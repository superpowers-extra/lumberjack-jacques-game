class PlayerBehavior extends Sup.Behavior {

  position = new Sup.Math.Vector2();
  direction = Utils.Directions.Down;
  private velocity = new Sup.Math.Vector2();
  
  private isAttacking = false;
  private hasAttackHit = false;
  private attackCooldown = 0;

  autoPilot = false;
  activeInteractable: InteractableBehavior;
  
  healthBarActor: Sup.Actor;
  hitTimer = 0;

  heartRenderers: Sup.SpriteRenderer[];

  // temp
  enemySpawnActor: Sup.Actor;
  enemySpawnPos: Sup.Math.Vector2; 

  awake() {
    Game.playerBehavior = this;    
  }

  start() {
    // temp, for testing enemies
    this.enemySpawnActor = Sup.getActor("Enemy Spawn");
    if (this.enemySpawnActor != null)
      this.enemySpawnPos = this.enemySpawnActor.getPosition().toVector2(); 
  }

  setup(spawnName: string) {
    // create healthbar
    this.heartRenderers = [];
    const heartsRoot = Sup.getActor("Hearts");
    let offset = 1;
    for (let i = 0; i < PlayerBehavior.maxHealth/2; i++) {
      const heart = Sup.appendScene("In-Game/HUD/Items/Heart Prefab", heartsRoot)[0];
      heart.setLocalPosition(i * offset, 0, 0);
      this.heartRenderers.push(heart.spriteRenderer);
    }
    this.updateHealth(PlayerBehavior.health);
    
    let spawnActor = Sup.getActor("Markers").getChild(spawnName.replace("/", "_"));
    
    if (spawnActor == null) {
      Sup.log(`Couldn't find spawn point named ${spawnName}`);
      return;
    }
    
    this.position = spawnActor.getLocalPosition().toVector2();
    this.actor.arcadeBody2D.warpPosition(this.position);
    
    let spawnDirection = spawnActor.getBehavior(TeleportBehavior).direction;
    this.direction = Utils.getOppositeDirection(Utils.Directions[spawnDirection]);
    this.actor.spriteRenderer.setAnimation(`Walk ${Utils.Directions[this.direction]}`);
    
    let angle = Utils.getAngleFromDirection(this.direction);
    this.velocity.setFromAngle(angle).multiplyScalar(PlayerBehavior.enterSpeed);
    this.actor.arcadeBody2D.setVelocity(this.velocity);
  }

  hit(direction: Utils.Directions) {
    if (PlayerBehavior.health === 0 || this.hitTimer > 0) return;

    this.updateHealth(-1, true);
    
    if (PlayerBehavior.health === 0) {
      // FIXME: play some kind of animation or effect
      Game.playerBehavior = null;
      Game.loadMap(Game.currentMapName);

    } else {
      this.hitTimer = PlayerBehavior.hitDelay;
      this.velocity.setFromAngle(Utils.getAngleFromDirection(direction)).multiplyScalar(PlayerBehavior.hitSpeed);
      this.actor.arcadeBody2D.setVelocity(this.velocity);

      this.direction = Utils.getOppositeDirection(direction);
      this.actor.spriteRenderer.setAnimation(`Idle ${Utils.Directions[this.direction]}`).pauseAnimation();
      const color = 3;
      this.actor.spriteRenderer.setColor(color, color, color);
    }
  }
  
  // updte healthbar
  updateHealth(health: number, relative = false) {
    if (relative === true) PlayerBehavior.health += health;
    else PlayerBehavior.health = health;
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
    this.direction = direction;
    if (move) {
      this.velocity.setFromAngle(Utils.getAngleFromDirection(this.direction)).multiplyScalar(PlayerBehavior.enterSpeed);
      this.actor.spriteRenderer.setAnimation(`Walk ${Utils.Directions[this.direction]}`);
    } else {
      this.velocity.set(0, 0);
      this.actor.spriteRenderer.setAnimation(`Idle ${Utils.Directions[this.direction]}`);
    }
    this.actor.arcadeBody2D.setVelocity(this.velocity);
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

    this.velocity.set(0, 0);
    let newDirection: Utils.Directions;
    if (Sup.Input.isKeyDown("DOWN")       || Sup.Input.getGamepadAxisValue(0, 1) > 0.5)  { this.velocity.y = -1; }
    else if (Sup.Input.isKeyDown("UP")    || Sup.Input.getGamepadAxisValue(0, 1) < -0.5) { this.velocity.y =  1; }
    if (Sup.Input.isKeyDown("LEFT")       || Sup.Input.getGamepadAxisValue(0, 0) < -0.5) { this.velocity.x = -1; }
    else if (Sup.Input.isKeyDown("RIGHT") || Sup.Input.getGamepadAxisValue(0, 0) > 0.5)  { this.velocity.x =  1; }

    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      this.velocity.normalize().multiplyScalar(this.isAttacking ? PlayerBehavior.attackMoveSpeed : PlayerBehavior.moveSpeed);
      this.direction = Utils.getDirectionFromVector(this.velocity);
      if (!this.isAttacking) this.actor.spriteRenderer.setAnimation(`Walk ${Utils.Directions[this.direction]}`);
    } else {
      if (!this.isAttacking) this.actor.spriteRenderer.setAnimation(`Idle ${Utils.Directions[this.direction]}`);
    }
    this.actor.arcadeBody2D.setVelocity(this.velocity);

    if (this.attackCooldown > 0) this.attackCooldown -= 1;

    // Attack Axe
    if (this.isAttacking) {
      if (!this.actor.spriteRenderer.isAnimationPlaying()) {
        this.isAttacking = false;
        
      } else if (!this.hasAttackHit && this.actor.spriteRenderer.getAnimationFrameTime() / this.actor.spriteRenderer.getAnimationFrameCount() > 0.4) {
        let closestEnemy: EnemyBehavior;
        let closestEnemyDistance = PlayerBehavior.attackRange;
        for (let enemy of Game.enemies) {
          let diff = enemy.position.clone().subtract(this.position);
          if (diff.length() < closestEnemyDistance && Math.abs(Sup.Math.wrapAngle(diff.angle() - Utils.getAngleFromDirection(this.direction))) < Math.PI * 1 / 3)
            closestEnemy = enemy;
        }
        if (closestEnemy != null) {
          this.hasAttackHit = true;
          closestEnemy.hit(this.direction);
        }
      }
      
    } else if ((Sup.Input.wasKeyJustPressed("X") || Sup.Input.wasGamepadButtonJustPressed(0, 2)) && this.attackCooldown === 0) {
      this.attackCooldown = PlayerBehavior.attackCooldownDelay;
      this.isAttacking = true;
      this.hasAttackHit = false;
      this.actor.spriteRenderer.setAnimation(`Attack ${Utils.Directions[this.direction]}`, false);
    }

    // Attack shotgun
    if (Sup.Input.wasKeyJustPressed("C") && this.attackCooldown === 0) {
      this.attackCooldown = PlayerBehavior.attackCooldownDelay;

      let bullet = Sup.appendScene("In-Game/Entities/Player/Bullet/Prefab")[0];
      bullet.getBehavior(BulletBehavior).setup(this.position, this.direction);
    }

    // Interactions
    if (Sup.Input.wasKeyJustPressed("SPACE") || Sup.Input.wasKeyJustPressed("RETURN") || Sup.Input.wasGamepadButtonJustPressed(0, 0)) {
      let closestInteractable: InteractableBehavior;
      let closestDistance = Infinity;
      for (let interactable of Game.interactables) {
        let diff = interactable.position.clone().subtract(this.position);
        let distance = this.position.distanceTo(interactable.position);
        
        if (diff.length() < closestDistance && Math.abs(Sup.Math.wrapAngle(diff.angle() - Utils.getAngleFromDirection(this.direction))) < Math.PI * 1 / 3) {
        
          closestDistance = distance;
          closestInteractable = interactable;
        }
      }
      
      if (closestDistance < 2) {
        closestInteractable.interact();
        this.setDirection(this.direction, false);
      }
    }
    
    // Spawn enemy (temporary)
    if (Sup.Input.wasKeyJustReleased("1") && this.enemySpawnActor != null) {
      Sup.appendScene("In-Game/Entities/Enemies/Eye/Prefab", this.enemySpawnActor);
    }
    if (Sup.Input.wasKeyJustReleased("2") && this.enemySpawnActor != null) {
      Sup.appendScene("In-Game/Entities/Enemies/Ranged/Prefab", this.enemySpawnActor);
    }
  }
}
Sup.registerBehavior(PlayerBehavior);

namespace PlayerBehavior {
  export const moveSpeed = 0.16;
  export const enterSpeed = 0.05;
  export const attackMoveSpeed = 0.08;
  
  export const hitDelay = 10;
  export const hitSpeed = 0.08;
  
  export let maxHealth = 10;
  export let health = PlayerBehavior.maxHealth;
  
  export const attackCooldownDelay = 10;

  export const attackDelay = 16;
  export const attackRange = 3.5;
}
