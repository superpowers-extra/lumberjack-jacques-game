class PlayerBehavior extends Sup.Behavior {

  position = new Sup.Math.Vector2();
  moveDirection = Utils.Directions.Down;
  lookDirection = Utils.Directions.Down;
  private velocity = new Sup.Math.Vector2();
  
  private isAttacking = false;
  hasAttackHit = false;
  private attackCooldown = 0;

  autoPilot = false;
  activeInteractable: InteractableBehavior;
  
  healthBarActor: Sup.Actor;
  hitTimer = 0;

  heartRenderers: Sup.SpriteRenderer[];

  hackSound = Sup.get("In-Game/Entities/Player/Sounds/Hack", Sup.Sound);
  wooshSound = Sup.get("In-Game/Entities/Player/Sounds/Woosh", Sup.Sound);
  shootSound = Sup.get("In-Game/Entities/Player/Sounds/Shoot", Sup.Sound);
  reloadSound = Sup.get("In-Game/Entities/Player/Sounds/Reload Gun", Sup.Sound);
  hitSound = Sup.get("In-Game/Entities/Player/Sounds/Hit", Sup.Sound);
  isShotgunOut = false;

  awake() {
    Game.playerBehavior = this;    
  }

  setup(spawnName: string) {
    // create healthbar
    this.heartRenderers = [];
    const heartsRoot = Sup.getActor("Hearts");
    for (let i = 0; i < PlayerBehavior.maxHealth / 2; i++) {
      const heart = Sup.appendScene("In-Game/HUD/Items/Heart Prefab", heartsRoot)[0];
      heart.setLocalPosition(i, 0, 0);
      this.heartRenderers.push(heart.spriteRenderer);
    }
    this.updateHealth(PlayerBehavior.health);
    
    PlayerBehavior.setupInventory();
    
    let spawnActor = Sup.getActor("Markers").getChild(spawnName.replace("/", "_"));
    
    if (spawnActor == null) {
      Sup.log(`Couldn't find spawn point named ${spawnName}`);
      return;
    }
    
    this.position = spawnActor.getLocalPosition().toVector2();
    this.actor.arcadeBody2D.warpPosition(this.position);
    
    let teleportBehavior = spawnActor.getBehavior(TeleportBehavior);
    let spawnDirection = teleportBehavior != null ? teleportBehavior.direction : "Up";
    this.moveDirection = this.lookDirection = Utils.getOppositeDirection(Utils.Directions[spawnDirection]);
    this.actor.spriteRenderer.setAnimation(`Walk ${Utils.Directions[this.lookDirection]}`);
    
    let angle = Utils.getAngleFromDirection(this.moveDirection);
    this.velocity.setFromAngle(angle).multiplyScalar(PlayerBehavior.enterSpeed);
    this.actor.arcadeBody2D.setVelocity(this.velocity);
  }

  hit(direction: Utils.Directions, strong = false) {
    if (PlayerBehavior.health === 0 || this.hitTimer > 0) return;

    this.updateHealth(-1, true);
    
    if (PlayerBehavior.health === 0) {
      // FIXME: play some kind of animation or effect
      Game.playerBehavior = null;
      PlayerBehavior.health = PlayerBehavior.maxHealth;
      Game.loadMap(Game.currentMapName);

    } else {
      this.hitTimer = strong ? PlayerBehavior.strongHitDelay : PlayerBehavior.hitDelay;
      this.velocity.setFromAngle(Utils.getAngleFromDirection(direction)).multiplyScalar(strong ? PlayerBehavior.strongHitSpeed : PlayerBehavior.hitSpeed);
      this.actor.arcadeBody2D.setVelocity(this.velocity);

      this.lookDirection = Utils.getOppositeDirection(direction);
      this.actor.spriteRenderer.setAnimation(`Idle ${Utils.Directions[this.lookDirection]}`).pauseAnimation();
      const color = 3;
      this.actor.spriteRenderer.setColor(color, color, color);
    }
  }
  
  addHeart() {
    const heartsRoot = Sup.getActor("Hearts");
    const heart = Sup.appendScene("In-Game/HUD/Items/Heart Prefab", heartsRoot)[0];
    heart.setLocalPosition(PlayerBehavior.maxHealth / 2, 0, 0);
    this.heartRenderers.push(heart.spriteRenderer);
    
    PlayerBehavior.maxHealth += 2;
  }

  // update healthbar
  updateHealth(health: number, relative = false) {
    if (relative === true) {
      PlayerBehavior.health += health;
      if (health < 0) {
        Sup.Audio.playSound(this.hitSound);
      }
    } else PlayerBehavior.health = health;
    PlayerBehavior.health = Sup.Math.clamp(PlayerBehavior.health, 0, PlayerBehavior.maxHealth);
    
    // update the health bar accordingly
    const lastIndex = Math.ceil(PlayerBehavior.health / 2);
    for (let i=0; i < this.heartRenderers.length; i++) {
      const renderer = this.heartRenderers[i];
      if (i === lastIndex - 1) {
        if (PlayerBehavior.health % 2 == 0) {
          renderer.setAnimation("Full", false);
          renderer.setOpacity(1);
          renderer.actor.setLocalScale(1,1,1);
        }
        else {
          renderer.setAnimation("Half", false);
          renderer.setOpacity(1);
          renderer.actor.setLocalScale(0.9,0.9,1);
        }
      }
      else if (i < lastIndex) {
        renderer.setAnimation("Full");
        renderer.setOpacity(1);
        renderer.actor.setLocalScale(1,1,1);
      }
      else {
        renderer.setAnimation("Empty");
        renderer.setOpacity(0.6);
        renderer.actor.setLocalScale(0.8,0.8,1);
      }
    }
  }

  setDirection(direction: Utils.Directions, move: boolean) {
    this.moveDirection = direction;
    if (!this.isShotgunOut) this.lookDirection = direction;
    
    if (this.actor.spriteRenderer.getSprite().path !== "In-Game/Entities/Player/Sprite") {
      this.actor.spriteRenderer.setSprite("In-Game/Entities/Player/Sprite");
    }
    
    if (move) {
      this.velocity.setFromAngle(Utils.getAngleFromDirection(this.moveDirection)).multiplyScalar(PlayerBehavior.enterSpeed);
      this.actor.spriteRenderer.setAnimation(`Walk ${Utils.Directions[this.lookDirection]}`);
    } else {
      this.velocity.set(0, 0);
      this.actor.spriteRenderer.setAnimation(`Idle ${Utils.Directions[this.lookDirection]}`);
    }
    this.actor.arcadeBody2D.setVelocity(this.velocity);
  }

  clearMotion() {
    this.velocity.set(0, 0);
    this.actor.arcadeBody2D.setVelocity(this.velocity);
    this.actor.spriteRenderer.setSprite("In-Game/Entities/Player/Sprite");
    this.actor.spriteRenderer.setAnimation(`Idle ${Utils.Directions[this.lookDirection]}`);
    this.isAttacking = false;
  }

  update() {    
    if (this.activeInteractable != null) {
      if (Sup.Input.wasKeyJustPressed("SPACE") || Sup.Input.wasKeyJustPressed("RETURN") || Sup.Input.wasGamepadButtonJustPressed(0, 0)) this.activeInteractable.interact();
      return;
    }

    if (Fade.isFading || this.autoPilot) {
      this.position = this.actor.getLocalPosition().toVector2();
      return;
    }

    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());
    
    // Movement
    this.position = this.actor.getLocalPosition().toVector2();
    Utils.updateDepth(this.actor, this.position.y);
    
    if (this.hitTimer > 0) {
      this.hitTimer -= 1;
      if (this.hitTimer === 0) {
        this.actor.arcadeBody2D.setVelocity(0, 0);
        this.actor.spriteRenderer.setColor(1, 1, 1);
      }
      return;
    }
    
    if (Fade.isFading) return;

    // Attack shotgun
    if (this.isShotgunOut) {
      if (this.isAttacking) {
        if (!this.actor.spriteRenderer.isAnimationPlaying()) {
          this.isAttacking = false;
          this.isShotgunOut = false;
          this.actor.spriteRenderer.setSprite("In-Game/Entities/Player/Sprite");
          
          if (this.attackCooldown === 0) this.shoot();
        }
        
      } else if (Sup.Input.wasKeyJustReleased("B") || Sup.Input.wasGamepadButtonJustReleased(0, 1)) {
        this.isAttacking = true;
        this.actor.spriteRenderer.setAnimation(`Shotgun Attack ${Utils.Directions[this.lookDirection]}`, false);
      }
      
    } else if (PlayerBehavior.inventory["Rifle"].isActive && (Sup.Input.isKeyDown("B") || Sup.Input.isGamepadButtonDown(0, 1))) {
      this.isShotgunOut = true;
      Sup.Audio.playSound(this.reloadSound);
      this.actor.spriteRenderer.setSprite("In-Game/Entities/Player/Sprite Shotgun");
    }
    
    this.velocity.set(0, 0);
    let newDirection: Utils.Directions;
    if (Sup.Input.isKeyDown("DOWN")       || Sup.Input.getGamepadAxisValue(0, 1) > 0.5)  { this.velocity.y = -1; }
    else if (Sup.Input.isKeyDown("UP")    || Sup.Input.getGamepadAxisValue(0, 1) < -0.5) { this.velocity.y =  1; }
    if (Sup.Input.isKeyDown("LEFT")       || Sup.Input.getGamepadAxisValue(0, 0) < -0.5) { this.velocity.x = -1; }
    else if (Sup.Input.isKeyDown("RIGHT") || Sup.Input.getGamepadAxisValue(0, 0) > 0.5)  { this.velocity.x =  1; }

    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      this.velocity.normalize().multiplyScalar(this.isAttacking ? PlayerBehavior.attackMoveSpeed : PlayerBehavior.moveSpeed);
      this.moveDirection = Utils.getDirectionFromVector(this.velocity);
      if (!this.isShotgunOut) this.lookDirection = this.moveDirection;
      if (!this.isAttacking) this.actor.spriteRenderer.setAnimation(`Walk ${Utils.Directions[this.lookDirection]}`);
    } else {
      if (!this.isAttacking) this.actor.spriteRenderer.setAnimation(`Idle ${Utils.Directions[this.lookDirection]}`);
    }
    this.actor.arcadeBody2D.setVelocity(this.velocity);

    if (this.attackCooldown > 0) this.attackCooldown -= 1;

    // Attack Axe
    if (this.isAttacking) {
      if (!this.actor.spriteRenderer.isAnimationPlaying()) {
        this.isAttacking = false;
        
      } else if (this.canAttack()) {
        let closestEnemy: Enemy;
        let closestEnemyDistance = Infinity;
        for (let enemy of Game.enemies) {
          let diff = enemy.position.clone().add(0, enemy.radius).subtract(this.position);
          let distance = diff.length();
          if (distance < PlayerBehavior.attackRange + enemy.radius && Math.abs(Sup.Math.wrapAngle(diff.angle() - Utils.getAngleFromDirection(this.lookDirection))) < Math.PI * 1 / 3) {
            if (distance < closestEnemyDistance) {
              closestEnemyDistance = distance;
              closestEnemy = enemy;
            }
          }
        }
        if (closestEnemy != null) {
          this.hasAttackHit = true;
          Sup.Audio.playSound(this.hackSound);
          closestEnemy.hit(this.lookDirection);
        }
      }
      
    } else if ((Sup.Input.wasKeyJustPressed("X") || Sup.Input.wasGamepadButtonJustPressed(0, 2)) && this.attackCooldown === 0) {
      this.attackCooldown = PlayerBehavior.attackCooldownDelay;
      this.isAttacking = true;
      this.hasAttackHit = false;
      this.actor.spriteRenderer.setAnimation(`Attack ${Utils.Directions[this.lookDirection]}`, false);
      Sup.Audio.playSound(this.wooshSound);
    }

    // Interactions
    if (!this.isShotgunOut && (Sup.Input.wasKeyJustPressed("SPACE") || Sup.Input.wasKeyJustPressed("RETURN") || Sup.Input.wasGamepadButtonJustPressed(0, 0))) {
      let closestInteractable: InteractableBehavior;
      let closestDistance = Infinity;
      for (let interactable of Game.interactables) {
        let diff = interactable.position.clone().subtract(this.position);
        let distance = this.position.distanceTo(interactable.position);
        
        if (diff.length() < closestDistance && Math.abs(Sup.Math.wrapAngle(diff.angle() - Utils.getAngleFromDirection(this.lookDirection))) < Math.PI * 1 / 3) {
          closestDistance = distance;
          closestInteractable = interactable;
        }
      }

      if (closestDistance < 3) {
        closestInteractable.interact();
        this.clearMotion();
      }
    }
  }

  canAttack() {
    return !this.hasAttackHit && this.actor.spriteRenderer.getAnimationFrameTime() / this.actor.spriteRenderer.getAnimationFrameCount() > 0.4;
  }

  shoot() {
    this.attackCooldown = PlayerBehavior.shootCooldownDelay;
    Sup.Audio.playSound(this.shootSound);

    let bullet = Sup.appendScene("In-Game/Entities/Player/Bullet/Prefab")[0];
    bullet.getBehavior(BulletBehavior).setup(this.position, this.lookDirection);
  }
}
Sup.registerBehavior(PlayerBehavior);

namespace PlayerBehavior {
  export const moveSpeed = 0.16;
  export const enterSpeed = 0.05;
  export const attackMoveSpeed = 0.08;
  
  export const hitDelay = 10;
  export const strongHitDelay = 25;
  export const hitSpeed = 0.08;
  export const strongHitSpeed = 0.12;
  
  export let maxHealth = 10;
  export let health = PlayerBehavior.maxHealth;
  
  export const attackCooldownDelay = 10;
  export const shootCooldownDelay = 60;

  export const attackDelay = 16;
  export const attackRange = 3.5;
  
  export let inventory: { [itemName: string]: { isActive: boolean, renderer: Sup.SpriteRenderer }} = {
    Bottle: {
      isActive: false,
      renderer: null
    },
    Key: {
      isActive: false,
      renderer: null
    },
    Book: {
      isActive: false,
      renderer: null
    },
    Rifle: {
      isActive: false,
      renderer: null
    }
  }
  
  export function setupInventory() {
    const inventoryRoot = Game.cameraBehavior.actor.getChild("Inventory");
    for (const itemName in PlayerBehavior.inventory) {
      const itemActor = inventoryRoot.getChild(itemName).getChild("Item");
      const renderer = itemActor.spriteRenderer;
      renderer.setSprite(`In-Game/HUD/Items/${itemName}`);
      PlayerBehavior.inventory[itemName].renderer = renderer;
    }
    
    updateInventory();
  };
  
  export function addToInventory(name: string) {
    PlayerBehavior.inventory[name].isActive = true;
    Sup.Audio.playSound("In-Game/Maps/Village/Noxy/Power Up");
    
    updateInventory();
  }
  
  export function removeFromInventory(name: string) {
    PlayerBehavior.inventory[name].isActive = false;
    Sup.Audio.playSound("In-Game/Entities/Player/Sounds/Give");

    updateInventory();
  }
  
  function updateInventory() {
    for (const name in PlayerBehavior.inventory) {
      const data = PlayerBehavior.inventory[name];
      data.renderer.setOpacity( data.isActive ? 1 : 0 );
    }
  }
}
