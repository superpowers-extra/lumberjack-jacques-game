class ClosedEnemyBehavior extends EnemyBehavior {
  
  behavior(diffToPlayer: Sup.Math.Vector2) {
    const distance = diffToPlayer.length();
    
    switch (this.state) {
      case EnemyBehavior.States.Charging:
        if (distance <= ClosedEnemyBehavior.attackDistance) {
          this.setAttacking(diffToPlayer);

        } else if (this.changeStateTimer === 0 || distance > EnemyBehavior.passiveDistance) {
          this.aggressive = false;
          this.initialPosition.copy(this.position);
          this.setIdle();

        } else {
          this.velocity.copy(diffToPlayer).normalize().multiplyScalar(EnemyBehavior.chargeSpeed);
          this.direction = Utils.getDirectionFromVector(this.velocity);
          this.actor.spriteRenderer.setAnimation(`Walk ${Utils.Directions[this.direction]}`);
        }
        break;

      case EnemyBehavior.States.Attacking:
        if (!this.actor.spriteRenderer.isAnimationPlaying()) {
          this.setCooldown();
        } else if (this.actor.spriteRenderer.getAnimationFrameTime() / this.actor.spriteRenderer.getAnimationFrameCount() > 0.7 && distance <= ClosedEnemyBehavior.hitRange) {
          Game.playerBehavior.hit(this.direction, false, this.damage);
        }
        break;
    }
  }
  
  chooseAction(diffToPlayer: Sup.Math.Vector2) {
    if (diffToPlayer.length() < ClosedEnemyBehavior.chargeDistance) this.setCharging();
    else this.setWalking();
  }
  
  setCharging() {
    this.state = EnemyBehavior.States.Charging;
    
    this.actor.spriteRenderer.setPlaybackSpeed(1).setAnimation(`Walk ${Utils.Directions[this.direction]}`);;
    this.resetChangeTimer();
  }
}
Sup.registerBehavior(ClosedEnemyBehavior);

namespace ClosedEnemyBehavior {
  export const chargeDistance = 10;
  export const attackDistance = 2.5;
  export const hitRange = 3;
}
