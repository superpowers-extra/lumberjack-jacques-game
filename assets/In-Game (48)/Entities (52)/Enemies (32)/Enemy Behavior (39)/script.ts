
abstract class EnemyBehavior extends Sup.Behavior {
  position: Sup.Math.Vector2;
  velocity = new Sup.Math.Vector2();
  direction = new Sup.Math.Vector2();

  moveSpeed = 0.1;
  moveDistance = 1.5; // distance at which the enemy stops moving toward the player
  attackDistance = 1.5; // distance at which the enemy starts attacking the player

  
  private maxHealth = 3;
  private health = this.maxHealth;

  hitTimer = 0;
  private hitSpeed = 0.08;

  awake() {
    Game.enemies.push(this);
    this.position = this.actor.getLocalPosition().toVector2();
  }

  onDestroy() {
    let index = Game.enemies.indexOf(this);
    if (index !== -1) Game.enemies.splice(index, 1);
  }

  update() {
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());
    this.position = this.actor.getPosition().toVector2();
    Utils.updateDepth(this.actor, this.position.y);
    
    if (Game.playerBehavior != null && Game.playerBehavior.activeInteractable == null)
      this.behavior();
    
    if (this.hitTimer > 0) {
      this.hitTimer -= 1;
      if (this.hitTimer === 0) {
        this.actor.arcadeBody2D.setVelocity(0, 0);
        this.actor.spriteRenderer.setColor(1, 1, 1);
      }
    }
  }

  abstract behavior();
  
  hit(direction: Utils.Directions) {
    if (this.health === 0) return;
    
    this.health -= 1;
    
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

namespace EnemyBehavior {
  export const hitDelay = 15;
}
