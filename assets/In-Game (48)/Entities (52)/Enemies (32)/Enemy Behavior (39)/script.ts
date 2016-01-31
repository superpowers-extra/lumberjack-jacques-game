abstract class EnemyBehavior extends Sup.Behavior {
  position: Sup.Math.Vector2;
  initialPosition: Sup.Math.Vector2;
  velocity = new Sup.Math.Vector2();
  direction = Utils.Directions.Down;

  state: EnemyBehavior.States;
  changeStateTimer: number;

  aggressive = false;

  health = 3;

  hitTimer = 0;

  awake() {
    Game.enemies.push(this);
    this.position = this.actor.getLocalPosition().toVector2();
    this.initialPosition = this.position.clone();
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
    
    if (Game.playerBehavior != null && Game.playerBehavior.activeInteractable == null) this.behavior();
    else this.setIdle();
    
    if (this.actor.arcadeBody2D.getEnabled()) this.actor.arcadeBody2D.setVelocity(this.velocity);
  }

  abstract behavior();
  
  resetChangeTimer() {
    this.changeStateTimer = Sup.Math.Random.integer(EnemyBehavior.minChangeStateDelay[this.state], EnemyBehavior.maxChangeStateDelay[this.state]);
  }
  
  setIdle() {
    this.state = EnemyBehavior.States.Idle;

    this.velocity.set(0, 0);

    this.actor.spriteRenderer.setPlaybackSpeed(1);
    this.actor.spriteRenderer.setAnimation(`Idle ${Utils.Directions[this.direction]}`);

    this.resetChangeTimer();
  }

  setCooldown() {
    this.state = EnemyBehavior.States.Cooldown;
    
    this.actor.spriteRenderer.setPlaybackSpeed(1);
    this.actor.spriteRenderer.setAnimation(`Idle ${Utils.Directions[this.direction]}`);

    this.resetChangeTimer();
  }

  hit(direction: Utils.Directions) {
    if (this.state === EnemyBehavior.States.Dying || this.state === EnemyBehavior.States.Hitting) return;
    
    this.health -= 1;
    if (this.health === 0) {
      this.state = EnemyBehavior.States.Dying;
      this.actor.arcadeBody2D.setEnabled(false);
      if (this.direction === Utils.Directions.Left) this.actor.spriteRenderer.setHorizontalFlip(true);
      this.actor.spriteRenderer.setAnimation("Die", false);
      
    } else {
      this.state = EnemyBehavior.States.Hitting;
      this.hitTimer = EnemyBehavior.hitDelay;
      this.velocity.setFromAngle(Utils.getAngleFromDirection(direction)).multiplyScalar(EnemyBehavior.hitSpeed);
      this.direction = Utils.getOppositeDirection(direction);
      
      let color = 3;
      this.actor.spriteRenderer.setColor(color, color, color);
      this.actor.spriteRenderer.setAnimation(`Idle ${Utils.Directions[this.direction]}`).pauseAnimation();
    }
  }

  doHitting() {
    this.hitTimer -= 1;
    if (this.hitTimer === 0) {
      this.actor.spriteRenderer.setColor(1, 1, 1);
      this.setCooldown();
    }
  }
}

namespace EnemyBehavior {
  export enum States { Idle, Walking, Charging, Cooldown, Attacking, Hitting, Dying };
  export const minChangeStateDelay = [ 60, 60, 200, 20 ];
  export const maxChangeStateDelay = [ 80, 90, 300, 30 ];
  
  export const walkSpeed = 0.05;
  export const chargeSpeed = 0.14;
  
  export const chargeDistance = 10;
  export const attackDistance = 2.5;
  export const hitRange = 3;
  
  export const passiveDistance = 20;
  export const maxInitialPositionDistance = 5;
  
  export const hitSpeed = 0.08;
  export const hitDelay = 15;
}
