class BulletBehavior extends Sup.Behavior {
  private direction: Utils.Directions;
  ticks = 0;
  
  setup(position: Sup.Math.Vector2, direction: Utils.Directions) {
    this.direction = direction;
    let angle = Utils.getAngleFromDirection(direction);

    this.actor.arcadeBody2D.warpPosition(position.clone().add(Math.cos(angle), Math.sin(angle)));
    this.actor.arcadeBody2D.setVelocity(Math.cos(angle) * BulletBehavior.moveSpeed, Math.sin(angle) * BulletBehavior.moveSpeed);
  }
  
  update() {
    if (++this.ticks > 300) {
      this.actor.destroy();
      return;
    }
    
    for (let enemy of Game.enemies) {
      if (Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, enemy.actor.arcadeBody2D)) {
        enemy.hit(this.direction);
        this.actor.destroy();
        return;
      }
    }
  }
}
Sup.registerBehavior(BulletBehavior);

namespace BulletBehavior {
  export const moveSpeed = 0.35;
}
