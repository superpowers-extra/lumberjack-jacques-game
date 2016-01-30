class EnemyBulletBehavior extends Sup.Behavior {
  playerArcadeBody2D: Sup.ArcadePhysics2D.Body;
  ticks = 0;
  
  setup(position: Sup.Math.Vector2, target: Sup.Math.Vector2) {   
    const direction = target.clone().subtract(position).normalize();
    this.actor.arcadeBody2D.warpPosition(position);
    this.actor.arcadeBody2D.setVelocity(direction.multiplyScalar(EnemyBulletBehavior.moveSpeed));

    this.playerArcadeBody2D = Game.playerBehavior.actor.arcadeBody2D;
  }
  
  update() {
    if (++this.ticks > 300) {
      this.actor.destroy();
      return;
    }
    
    if (this.playerArcadeBody2D != null && Game.playerBehavior != null && Game.playerBehavior.health > 0 && Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, this.playerArcadeBody2D)) {
      Game.playerBehavior.hit();
      this.playerArcadeBody2D = null;
      this.actor.destroy();
      return;
    }   
  }
}
Sup.registerBehavior(EnemyBulletBehavior);

namespace EnemyBulletBehavior {
  export const moveSpeed = 0.35;
}
