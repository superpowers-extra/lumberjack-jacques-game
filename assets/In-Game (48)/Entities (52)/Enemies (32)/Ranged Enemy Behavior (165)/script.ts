class RangedEnemyBehavior extends EnemyBehavior {
  projectileName: string;
  
  behavior(diffToPlayer: Sup.Math.Vector2) {
    switch (this.state) {
      case EnemyBehavior.States.Fleeing:
        if (this.changeStateTimer === 0) {
          if (diffToPlayer.length() < RangedEnemyBehavior.attackRange) this.setAttacking(diffToPlayer);
          else this.setCooldown();
        }
        break;

      case EnemyBehavior.States.Attacking:
        if (!this.actor.spriteRenderer.isAnimationPlaying()) {
          let bulletBehavior = Sup.appendScene("In-Game/Entities/Enemies/Bullet/Prefab")[0].getBehavior(EnemyBulletBehavior);
          bulletBehavior.setup(this.position, Game.playerBehavior.position, this.projectileName);

          this.setCooldown();
        }
        break;
    }
  }
  
  chooseAction(diffToPlayer: Sup.Math.Vector2) {
    const distanceToPlayer = diffToPlayer.length();
    if (distanceToPlayer > RangedEnemyBehavior.attackRange) {
      this.setWalking();
    } else {
      if (distanceToPlayer < RangedEnemyBehavior.fleeRange) this.setFleeing(diffToPlayer);
      else this.setAttacking(diffToPlayer);
    }
  }

  setFleeing(diffToPlayer: Sup.Math.Vector2) {
    this.state = EnemyBehavior.States.Fleeing;
    
    let angle = Sup.Math.wrapAngle(diffToPlayer.angle() - Math.PI + Sup.Math.Random.float(-Math.PI / 3, Math.PI / 3));
    this.velocity.setFromAngle(angle);
    
    this.velocity.normalize().multiplyScalar(EnemyBehavior.fastSpeed);
    this.direction = Utils.getDirectionFromVector(this.velocity);

    this.actor.spriteRenderer.setPlaybackSpeed(1).setAnimation(this.getAnimation("Walk"));
    
    this.resetChangeTimer();
  }
}
Sup.registerBehavior(RangedEnemyBehavior);

namespace RangedEnemyBehavior {
  export const attackRange = 12;
  export const fleeRange = 8;
}
