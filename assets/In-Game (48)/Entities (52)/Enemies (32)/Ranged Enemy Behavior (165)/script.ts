class RangedEnemyBehavior extends EnemyBehavior {
  
  awake() {
    Game.enemies.push(this);
    this.position = this.actor.getLocalPosition().toVector2();
  }
  
  behavior() {
    const playerPos = Game.playerBehavior.position;
    const ditanceToPlayer = this.position.distanceTo(playerPos);
    
    if (ditanceToPlayer > EnemyBehavior.chargeDistance) {
      // this.direction.x = Game.playerBehavior.position.x - this.position.x;
      // this.direction.y = Game.playerBehavior.position.y - this.position.y;

      // this.velocity.set(this.direction.x, this.direction.y);
      
      if (this.velocity.x !== 0 || this.velocity.y !== 0) {
        // this.velocity.normalize().multiplyScalar(this.moveSpeed);
        //this.direction = Utils.getDirectionFromDirection(this.velocity);
        //this.actor.spriteRenderer.setAnimation(`Walk ${Utils.Directions[this.direction]}`);
      } else {
        //this.actor.spriteRenderer.setAnimation(`Idle ${Utils.Directions[this.direction]}`);
      }
      
      this.actor.arcadeBody2D.setVelocity(this.velocity);
    }
    else {
      this.velocity.set(0,0);
      this.actor.arcadeBody2D.setVelocity(this.velocity);
    }
    
    if (RangedEnemyBehavior.attackTimer > 0) {
      RangedEnemyBehavior.attackTimer -= 1;
    }
    else if (ditanceToPlayer < EnemyBehavior.attackDistance && this.hitTimer <= 0) {
      // attack ... if not being attacked by player
      
      const bullet = Sup.appendScene("In-Game/Entities/Enemies/Ranged/Bullet/Prefab")[0];
      bullet.getBehavior(EnemyBulletBehavior).setup(this.position, playerPos);
      RangedEnemyBehavior.attackTimer = RangedEnemyBehavior.attackCooldown;
    }
  }
}
Sup.registerBehavior(RangedEnemyBehavior);

namespace RangedEnemyBehavior {
  export const attackCooldown = 60;
  export let attackTimer = 0;
}
