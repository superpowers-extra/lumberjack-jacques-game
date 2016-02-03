class EnemyBulletBehavior extends Sup.Behavior {
  direction: Utils.Directions;
  ticks = 0;
  
  setup(position: Sup.Math.Vector2, target: Sup.Math.Vector2, sprite: string) {   
    const diff = target.clone().subtract(position).normalize();
    position.add(diff.multiplyScalar(2));
    this.actor.arcadeBody2D.warpPosition(position);
    this.actor.arcadeBody2D.setVelocity(diff.normalize().multiplyScalar(EnemyBulletBehavior.moveSpeed));
    this.actor.setLocalEulerZ(diff.angle() - Math.PI / 2);

    this.direction = Utils.getDirectionFromVector(diff);
    this.actor.spriteRenderer.setSprite(`In-Game/Entities/Enemies/Bullet/${sprite}`).setAnimation("Animation");
  }
  
  update() {
    if (++this.ticks > 300) {
      this.actor.destroy();
      return;
    }
    
    if (Game.playerBehavior != null && Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, Game.playerBehavior.actor.arcadeBody2D)) {
      Game.playerBehavior.hit(this.direction);
      this.actor.destroy();
      return;
    }
    
    if (Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies())) {
      this.actor.destroy();
      return;
    }
  }
}
Sup.registerBehavior(EnemyBulletBehavior);

namespace EnemyBulletBehavior {
  export const moveSpeed = 0.35;
}
