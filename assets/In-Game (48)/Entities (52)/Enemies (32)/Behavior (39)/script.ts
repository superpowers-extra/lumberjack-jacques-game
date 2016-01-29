class EnemyBehavior extends Sup.Behavior {
  position: Sup.Math.Vector2;
  
  private health = 3;
  private hitTimer = 0;
  private hitSpeed = 0.08;
  private hitOffsets: { [direction: string] : Sup.Math.Vector2 } = {
    "Down" : new Sup.Math.Vector2(0, -this.hitSpeed),
    "Up"   : new Sup.Math.Vector2(0, this.hitSpeed),
    "Left" : new Sup.Math.Vector2(-this.hitSpeed, 0),
    "Right": new Sup.Math.Vector2(this.hitSpeed, 0)
  };
  
  awake() {
    Game.enemies.push(this);
    this.position = this.actor.getLocalPosition().toVector2();
  }
  onDestroy() {
    let index = Game.enemies.indexOf(this);
    if (index !== -1) Game.enemies.splice(index);
  }

  update() {
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());
    this.position.x = this.actor.getLocalX();
    this.position.y = this.actor.getLocalY();
    
    if (this.hitTimer > 0) {
      this.hitTimer -= 1;
      if (this.hitTimer === 0) {
        this.actor.arcadeBody2D.setVelocity(0, 0);
        this.actor.spriteRenderer.setColor(1, 1, 1);
      }
    }
  }
  
  hit(direction: string) {
    this.health -= 1;
    
    if (this.health === 0) this.actor.destroy();
    else {
      this.hitTimer = EnemyBehavior.hitDelay;
      this.actor.arcadeBody2D.setVelocity(this.hitOffsets[direction]);
      
      let color = 3;
      this.actor.spriteRenderer.setColor(color, color, color);
    }
  }
}
Sup.registerBehavior(EnemyBehavior);

namespace EnemyBehavior {
  export const hitDelay = 15;
}
