class EnemyBehavior extends Sup.Behavior {
  position: Sup.Math.Vector2;
  
  private maxHealth = 3;
  private health = this.maxHealth;
  private healthbarActor: Sup.Actor;

  private hitTimer = 0;
  private hitSpeed = 0.08;
  
  awake() {
    Game.enemies.push(this);
    this.position = this.actor.getLocalPosition().toVector2();
    
    let healthbarRoot = Sup.appendScene("In-Game/HUD/Healthbar/Prefab", this.actor)[0];
    healthbarRoot.setLocalPosition(0, 1, 5);
    this.healthbarActor = healthbarRoot.getChild("Bar");
  }
  onDestroy() {
    let index = Game.enemies.indexOf(this);
    if (index !== -1) Game.enemies.splice(index, 1);
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
  
  hit(direction: Utils.Directions) {
    if (this.health === 0) return;
    
    this.health -= 1;
    this.healthbarActor.setLocalScaleX(this.health / this.maxHealth);
    
    if (this.health === 0) {
      // FIXME: play some kind of animation or effect
      this.actor.destroy();
    } else {
      this.hitTimer = EnemyBehavior.hitDelay;
      let offset = new Sup.Math.Vector2().setFromAngle(Utils.getAngleFromDirection(direction)).multiplyScalar(this.hitSpeed);
      this.actor.arcadeBody2D.setVelocity(offset);
      
      let color = 3;
      this.actor.spriteRenderer.setColor(color, color, color);
    }
  }
}
Sup.registerBehavior(EnemyBehavior);

namespace EnemyBehavior {
  export const hitDelay = 15;
}
