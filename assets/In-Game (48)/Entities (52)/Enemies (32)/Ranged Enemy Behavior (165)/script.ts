class RangedEnemyBehavior extends EnemyBehavior {
  projectileName: string;
  
  behavior() {
    switch (this.state) {
      case EnemyBehavior.States.Charging:

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
    if (diffToPlayer.length() < RangedEnemyBehavior.attackRange) this.setAttacking(diffToPlayer);
    else this.setWalking();
  }
}
Sup.registerBehavior(RangedEnemyBehavior);

namespace RangedEnemyBehavior {
  export const attackRange = 12;
}
