class BulletBehavior extends Sup.Behavior {
  private direction: Utils.Directions;
  ticks = 0;

  static doorOpened = false;
  mineDoorPosition: Sup.Math.Vector2;
  
  setup(position: Sup.Math.Vector2, direction: Utils.Directions) {
    this.direction = direction;
    let angle = Utils.getAngleFromDirection(direction);

    let bulletPosition = position.clone().add(Math.cos(angle), Math.sin(angle));
    if (direction === Utils.Directions.Left || direction === Utils.Directions.Right) bulletPosition.y += 0.3;
    this.actor.arcadeBody2D.warpPosition(bulletPosition);
    this.actor.arcadeBody2D.setVelocity(Math.cos(angle) * BulletBehavior.moveSpeed, Math.sin(angle) * BulletBehavior.moveSpeed);
    
    let mineDoorActor = Sup.getActor("Mine Door");
    if (mineDoorActor != null) this.mineDoorPosition = mineDoorActor.getLocalPosition().toVector2();
  }
  
  update() {
    if (++this.ticks > 300) {
      this.actor.destroy();
      return;
    }
    
    let position = this.actor.getLocalPosition().toVector2();
    for (let enemy of Game.enemies) {
      if (position.distanceTo(enemy.position) < 2) {
        enemy.hit(this.direction);
        this.actor.destroy();
        return;
      }
    }
    
    if (this.mineDoorPosition != null && position.distanceTo(this.mineDoorPosition) < 2) {
      BulletBehavior.doorOpened = true;
      Sup.getActor("Mine Door").destroy();
      this.actor.destroy();
    }
      
  }
}
Sup.registerBehavior(BulletBehavior);

namespace BulletBehavior {
  export const moveSpeed = 0.35;
}
