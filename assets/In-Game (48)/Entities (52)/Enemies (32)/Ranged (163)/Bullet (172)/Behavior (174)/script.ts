class EnemyBulletBehavior extends Sup.Behavior {
  direction: Utils.Directions;
  playerArcadeBody2D: Sup.ArcadePhysics2D.Body;
  ticks = 0;
  
  setup(position: Sup.Math.Vector2, target: Sup.Math.Vector2) {   
    const diff = target.clone().subtract(position).normalize();
    this.actor.arcadeBody2D.warpPosition(position);
    this.actor.arcadeBody2D.setVelocity(diff.multiplyScalar(EnemyBulletBehavior.moveSpeed));

    this.playerArcadeBody2D = Game.playerBehavior.actor.arcadeBody2D;
    this.direction = Utils.getDirectionFromVector(diff);
  }
  
  update() {
    if (++this.ticks > 300) {
      this.actor.destroy();
      return;
    }
    
    if (this.playerArcadeBody2D != null && Game.playerBehavior != null && Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, this.playerArcadeBody2D)) {
      Game.playerBehavior.hit(this.direction);
      this.actor.destroy();
      return;
    }   
  }
}
Sup.registerBehavior(EnemyBulletBehavior);

namespace EnemyBulletBehavior {
  export const moveSpeed = 0.35;
}
