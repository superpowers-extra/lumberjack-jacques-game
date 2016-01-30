class PlayerBehavior extends Sup.Behavior {
  
  position = new Sup.Math.Vector2();
  private direction = Utils.Directions.Down;
  private velocity = new Sup.Math.Vector2();
  
  private isAttacking = false;
  private hasAttackHit = false;
  private attackCooldown = 0;

  autoPilot = true;
  activeInteractable: InteractableBehavior;
  
  health = 5;
  healthBarActor: Sup.Actor;
  hitTimer = 0;

  // temp
  enemySpawnActor: Sup.Actor;
  enemySpawnPos: Sup.Math.Vector2; 

  

  awake() {
    PlayerBehavior.health = PlayerBehavior.maxHealth;
    Game.playerBehavior = this;
  }

  start() {
    // temp, for testing enemies
    this.enemySpawnActor = Sup.getActor("Enemy Spawn");
    if (this.enemySpawnActor != null)
      this.enemySpawnPos = this.enemySpawnActor.getPosition().toVector2(); 
  }

  setup(spawnName: string) {
    let spawnActor = Sup.getActor("Markers").getChild(spawnName);
    
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
    
    // setup HUD
    const heartsRoot = Sup.getActor("Hearts");
    let offset = 2.5;
    Sup.log("player health", PlayerBehavior.health );
    for (let i=0; i < PlayerBehavior.health/2; i++) {
      const hearts = Sup.appendScene("In-Game/HUD/Items/Heart Prefab", heartsRoot);     
      hearts[0].setLocalPosition(i*offset,0,0);
      hearts[1].setLocalPosition(i*offset,0,0);
    }
  }

  hit() {
    if (PlayerBehavior.health === 0 || this.hitTimer > 0) return;
    
    Sup.log("player hit");
    // Sup.log("player hit", PlayerBehavior.health, this.hitTimer );
    PlayerBehavior.health -= 1;
    
    // PlayerBehavior.healthbarActor.setLocalScaleX(PlayerBehavior.health / this.maxHealth);
    
    if (PlayerBehavior.health === 0) {
      // FIXME: play some kind of animation or effect
      Game.playerBehavior = null;
      Game.loadMap(Game.currentMapName);
      this.actor.destroy();
    } else {
      this.hitTimer = PlayerBehavior.hitDelay;
      // let offset = new Sup.Math.Vector2().setFromAngle(Utils.getAngleFromDirection(direction)).multiplyScalar(this.hitSpeed);
      // this.actor.arcadeBody2D.setVelocity(offset);
      
      const color = 3;
      this.actor.spriteRenderer.setColor(color, color, color);
    }
  }
  

  setDirection(direction: Utils.Directions) {
    this.direction = direction;
    this.velocity.setFromAngle(Utils.getAngleFromDirection(this.direction)).multiplyScalar(PlayerBehavior.moveSpeed);
    this.actor.spriteRenderer.setAnimation(`Walk ${Utils.Directions[this.direction]}`);
    this.actor.arcadeBody2D.setVelocity(this.velocity);
  }

  update() {
    if (this.autoPilot) {
      this.position = this.actor.getLocalPosition().toVector2();
      return;
    }

    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());

    if (this.activeInteractable != null) {
      if (Sup.Input.wasKeyJustPressed("SPACE")) this.activeInteractable.interact();
      return;
    }
    
    // Movement
    this.position = this.actor.getLocalPosition().toVector2();
    Utils.updateDepth(this.actor, this.position.y);
    
    if (Fade.isFading) return;

    this.velocity.set(0, 0);
    let newDirection: Utils.Directions;
    if (Sup.Input.isKeyDown("DOWN"))       { this.velocity.y = -1; }
    else if (Sup.Input.isKeyDown("UP"))    { this.velocity.y =  1; }
    if (Sup.Input.isKeyDown("LEFT"))       { this.velocity.x = -1; }
    else if (Sup.Input.isKeyDown("RIGHT")) { this.velocity.x =  1; }

    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      this.velocity.normalize().multiplyScalar(this.isAttacking ? PlayerBehavior.attackMoveSpeed : PlayerBehavior.moveSpeed);
      this.direction = Utils.getDirectionFromDirection(this.velocity);
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
        
      } else if (!this.hasAttackHit && this.actor.spriteRenderer.getAnimationFrameTime() / this.actor.spriteRenderer.getAnimationFrameCount() > 0.5) {
        for (let enemy of Game.enemies) {
          let diff = enemy.position.clone().subtract(this.position);
          let distance = this.position.distanceTo(enemy.position);
          if (diff.length() < PlayerBehavior.attackRange && Math.abs(Sup.Math.wrapAngle(diff.angle() - Utils.getAngleFromDirection(this.direction))) < Math.PI * 1 / 3) {
            this.hasAttackHit = true;
            enemy.hit(this.direction);
            break;
          }
        }
      }
      
    } else if (Sup.Input.wasKeyJustPressed("X") && this.attackCooldown === 0) {
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
    if (Sup.Input.wasKeyJustPressed("SPACE")) {
      let closestInteractable: InteractableBehavior;
      let closestDistance = Infinity;
      for (let interactable of Game.interactables) {
        let distance = this.position.distanceTo(interactable.actor.getLocalPosition().toVector2());
        if (distance < closestDistance) {
          closestDistance = distance;
          closestInteractable = interactable;
        }
      }
      
      if (closestDistance < 1) closestInteractable.interact();
    }
    
    // Spawn enemy (temporary)
    if (Sup.Input.wasKeyJustReleased("1") && this.enemySpawnActor != null) {
      Sup.appendScene("In-Game/Entities/Enemies/Eye/Prefab", this.enemySpawnActor);
      Sup.log(Game.enemies.length);
    }
    if (Sup.Input.wasKeyJustReleased("2") && this.enemySpawnActor != null) {
      Sup.appendScene("In-Game/Entities/Enemies/Ranged/Prefab", this.enemySpawnActor);
      Sup.log(Game.enemies.length);
    }
    
    if (this.hitTimer > 0) {
      this.hitTimer -= 1;
      if (this.hitTimer < PlayerBehavior.hitDelay/2) {
        // this.actor.arcadeBody2D.setVelocity(0, 0);
        this.actor.spriteRenderer.setColor(1, 1, 1);
        
      }
    }
  }
}
Sup.registerBehavior(PlayerBehavior);

namespace PlayerBehavior {
  export const moveSpeed = 0.16;
  export const enterSpeed = 0.05;
  export const attackMoveSpeed = 0.08;
  export const hitDelay = 40;
  
  export const maxHealth = 10;
  export let health = 10;
  
  export const attackCooldownDelay = 10;

  export const attackDelay = 16;
  export const attackRange = 2;
}
