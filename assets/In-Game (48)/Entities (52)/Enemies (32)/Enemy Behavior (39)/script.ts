interface Enemy {
  position: Sup.Math.Vector2;
  radius: number;
  
  hit(direction: Utils.Directions);
}

abstract class EnemyBehavior extends Sup.Behavior implements Enemy {
  position: Sup.Math.Vector2;
  protected initialPosition: Sup.Math.Vector2;
  protected velocity = new Sup.Math.Vector2();
  protected direction = Utils.Directions.Down;

  protected state: EnemyBehavior.States;
  protected changeStateTimer: number;
  allDirections = true;

  protected aggressive = false;
  protected hitTimer = 0;
  protected health = 3;
  radius = 0.5;
  damage = 1;

  awake() {
    Game.enemies.push(this);
    this.position = this.actor.getLocalPosition().toVector2();
    this.initialPosition = this.position.clone();
    
    this.setIdle();
  }

  onDestroy() {
    let index = Game.enemies.indexOf(this);
    if (index !== -1) Game.enemies.splice(index, 1);
  }

  update() {
    if (this.actor.arcadeBody2D.getEnabled()) {
      Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());
      this.position = this.actor.getPosition().toVector2();
      Utils.updateDepth(this.actor, this.position.y);
    }
    
    if (Game.playerBehavior == null || Game.playerBehavior.activeInteractable != null || Game.playerBehavior.autoPilot) this.setIdle();
    else {
      if (this.changeStateTimer > 0) this.changeStateTimer -= 1;
      const diffToPlayer = Game.playerBehavior.position.clone().subtract(this.position);
      
      switch (this.state) {
        case EnemyBehavior.States.Idle:
          if (this.changeStateTimer === 0) this.chooseAction(diffToPlayer);
          break;

        case EnemyBehavior.States.Walking:
        case EnemyBehavior.States.Cooldown:
          if (this.changeStateTimer === 0) this.setIdle();
          break;
          
        case EnemyBehavior.States.Hurting:
          this.doHurting();
          break;

        case EnemyBehavior.States.Dying:
          if (!this.actor.spriteRenderer.isAnimationPlaying()) this.actor.destroy();
          break;
          
        default:
          if (this.changeStateTimer > 0) this.changeStateTimer -= 1;
          this.behavior(diffToPlayer);
          break;
      }
    }
    
    if (this.actor.arcadeBody2D.getEnabled()) this.actor.arcadeBody2D.setVelocity(this.velocity);
  }

  abstract behavior(diffToPlayer: Sup.Math.Vector2);
  abstract chooseAction(diffToPlayer: Sup.Math.Vector2);
  
  resetChangeTimer() {
    this.changeStateTimer = Sup.Math.Random.integer(EnemyBehavior.minChangeStateDelay[this.state], EnemyBehavior.maxChangeStateDelay[this.state]);
  }
  
  getAnimation(name: string) {
    if (this.allDirections) name += ` ${Utils.Directions[this.direction]}`;
    return name;
  }
  
  setIdle() {
    this.state = EnemyBehavior.States.Idle;

    this.velocity.set(0, 0);

    this.actor.spriteRenderer.setPlaybackSpeed(1).setAnimation(this.getAnimation("Idle"));
    this.resetChangeTimer();
  }

  setCooldown() {
    this.state = EnemyBehavior.States.Cooldown;
    
    this.actor.spriteRenderer.setPlaybackSpeed(1).setAnimation(this.getAnimation("Idle"));
    this.resetChangeTimer();
  }
  
  setWalking() {
    this.state = EnemyBehavior.States.Walking;
    
    const diff = this.initialPosition.clone().subtract(this.position);
    if (diff.length() > EnemyBehavior.maxInitialPositionDistance) {
      this.velocity.copy(diff);
      
    } else {
      let angle = Sup.Math.Random.float(-Math.PI, Math.PI);
      this.velocity.setFromAngle(angle);
    }
    
    this.velocity.normalize().multiplyScalar(EnemyBehavior.walkSpeed);
    this.direction = Utils.getDirectionFromVector(this.velocity);

    this.actor.spriteRenderer.setPlaybackSpeed(0.8).setAnimation(this.getAnimation("Walk"));

    this.resetChangeTimer();
  }
  
  setAttacking(diffToPlayer: Sup.Math.Vector2) {
    this.state = EnemyBehavior.States.Attacking;

    this.direction = Utils.getDirectionFromVector(diffToPlayer);
    this.velocity.set(0, 0);
    
    this.actor.spriteRenderer.setPlaybackSpeed(1).setAnimation(this.getAnimation("Attack"), false);
  }

  hit(direction: Utils.Directions) {
    if (this.state === EnemyBehavior.States.Dying || this.state === EnemyBehavior.States.Hurting) return;
    
    this.health -= 1;
    if (this.health <= 0) {
      let sound = Sup.get(`In-Game/Entities/Enemies/${this.actor.getName()}/Die`, Sup.Sound, { ignoreMissing: true });
      if (sound != null) Sup.Audio.playSound(sound);
      
      this.state = EnemyBehavior.States.Dying;
      this.actor.arcadeBody2D.setEnabled(false);
      if (this.direction === Utils.Directions.Left) this.actor.spriteRenderer.setHorizontalFlip(true);
      this.actor.spriteRenderer.setAnimation("Die", false);
      
    } else {
      this.state = EnemyBehavior.States.Hurting;
      this.hitTimer = EnemyBehavior.hitDelay;
      this.velocity.setFromAngle(Utils.getAngleFromDirection(direction)).multiplyScalar(EnemyBehavior.hitSpeed);
      this.direction = Utils.getOppositeDirection(direction);
      
      let sound = Sup.get(`In-Game/Entities/Enemies/${this.actor.getName()}/Hurt`, Sup.Sound, { ignoreMissing: true });
      if (sound != null) Sup.Audio.playSound(sound);
      
      let color = 4;
      this.actor.spriteRenderer.setColor(color, color, color);
      if (this.direction === Utils.Directions.Left) this.actor.spriteRenderer.setHorizontalFlip(true);
      this.actor.spriteRenderer.setAnimation("Hit", false);
    }
    
    let bloodActor = Sup.appendScene("In-Game/FX/Blood/Prefab", this.actor)[0];
    bloodActor.setLocalPosition(0, 1, 2);
  }

  doHurting() {
    this.hitTimer -= 1;
    if (this.hitTimer === 0) {
      this.actor.spriteRenderer.setColor(1, 1, 1);
      this.actor.spriteRenderer.setHorizontalFlip(false);
      this.setCooldown();
    }
  }
}

namespace EnemyBehavior {
  export enum States { Idle, Walking, Charging, Cooldown, Fleeing, Attacking, Hurting, Dying };
  export const minChangeStateDelay = [ 60, 60, 200, 20, 40 ];
  export const maxChangeStateDelay = [ 80, 90, 300, 30, 70 ];
  
  export const walkSpeed = 0.05;
  export const fastSpeed = 0.14;
  
  export const passiveDistance = 20;
  export const maxInitialPositionDistance = 3;
  
  export const hitSpeed = 0.08;
  export const hitDelay = 15;
}
