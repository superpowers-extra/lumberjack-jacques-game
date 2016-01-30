class ClosedEnemyBehavior extends EnemyBehavior {
  awake() {
    Game.enemies.push(this);
    this.position = this.actor.getLocalPosition().toVector2();
    
    this.moveSpeed = 0.1;
  }
  
  behavior() {
    // Movement
    if (Game.playerBehavior == null || Game.playerBehavior.health <= 0 || this.hitTimer > 0) {
      return;
    }
    
    const diff = Game.playerBehavior.position.clone().subtract(this.position);
    
    if (diff.length() < this.moveDistance) {
      this.direction = Utils.getDirectionFromVector(diff);

      if (this.velocity.x !== 0 || this.velocity.y !== 0) {
        this.velocity.copy(diff).normalize().multiplyScalar(this.moveSpeed);
        this.actor.spriteRenderer.setAnimation(`Walk ${Utils.Directions[this.direction]}`);
      } else {
        this.actor.spriteRenderer.setAnimation(`Idle ${Utils.Directions[this.direction]}`);
      }
      
      this.actor.arcadeBody2D.setVelocity(this.velocity);
    }
    else {
      // attack ...
      if (this.hitTimer <= 0 && Game.playerBehavior.hitTimer <= 0) { 
        // ... if not being attacked by player and player not already attacked
        
        // play attack animation that takes time to run, like the player's axe
        Game.playerBehavior.hit();
      }
    }
  }
}
Sup.registerBehavior(ClosedEnemyBehavior);
