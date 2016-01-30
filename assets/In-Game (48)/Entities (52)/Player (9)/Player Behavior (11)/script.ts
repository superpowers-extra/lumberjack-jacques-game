class PlayerBehavior extends Sup.Behavior {
  
  position: Sup.Math.Vector2;
  private direction = Utils.Directions.Down;
  private velocity = new Sup.Math.Vector2();
  
  private attackCooldown = 0;

  private weapon: Sup.Actor;
  private attackTimer = 0;

  activeInteractable: InteractableBehavior;

  awake() {
    Game.playerBehavior = this;

    this.weapon = this.actor.getChild("Weapon");
    this.weapon.setVisible(false);
  }

  setDirection(direction: Utils.Directions) {
    this.direction = direction;
    this.velocity.setFromAngle(Utils.getAngleFromDirection(this.direction)).multiplyScalar(PlayerBehavior.moveSpeed);
    this.actor.spriteRenderer.setAnimation(`Walk ${Utils.Directions[this.direction]}`);
    this.actor.arcadeBody2D.setVelocity(this.velocity);
  }

  update() {
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());
    
    if (this.activeInteractable != null) {
      if (Sup.Input.wasKeyJustPressed("SPACE")) this.activeInteractable.interact();
      return;
    }
    
    // Movement
    this.position = this.actor.getLocalPosition().toVector2();
    if (Fade.isFading()) return;

    this.velocity.set(0, 0);
    let newDirection: Utils.Directions;
    if (Sup.Input.isKeyDown("DOWN"))       { this.velocity.y = -1; }
    else if (Sup.Input.isKeyDown("UP"))    { this.velocity.y =  1; }
    if (Sup.Input.isKeyDown("LEFT"))       { this.velocity.x = -1; }
    else if (Sup.Input.isKeyDown("RIGHT")) { this.velocity.x =  1; }

    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      this.velocity.normalize().multiplyScalar(PlayerBehavior.moveSpeed);
      this.direction = Utils.getDirectionFromDirection(this.velocity);
      this.actor.spriteRenderer.setAnimation(`Walk ${Utils.Directions[this.direction]}`);
    } else {
      this.actor.spriteRenderer.setAnimation(`Idle ${Utils.Directions[this.direction]}`);
    }
    this.actor.arcadeBody2D.setVelocity(this.velocity);

    // Attack Axe
    if (Sup.Input.wasKeyJustPressed("X") && this.attackTimer === PlayerBehavior.attackDelay) {
      this.weapon.setVisible(true);
      this.attackTimer = 0;
    }

    if (this.attackTimer < PlayerBehavior.attackDelay) {
      this.weapon.setEulerZ(Math.PI * 2 / 3 * Math.sin(this.attackTimer / PlayerBehavior.attackDelay * Math.PI));

      this.attackTimer += 1;
      if (this.attackTimer === PlayerBehavior.attackDelay) this.weapon.setVisible(false);
      else if (this.attackTimer === PlayerBehavior.attackDelay / 2) {
        for (let enemy of Game.enemies) {
          let distance = this.position.distanceTo(enemy.position);
          if (distance < PlayerBehavior.attackRange) {
            enemy.hit(this.direction);
            break;
          }
        }
      }
    }

    // Attack shotgun
    if (this.attackCooldown > 0) {
      this.attackCooldown -= 1;

    } else if (Sup.Input.wasKeyJustPressed("C")) {
      this.attackCooldown = PlayerBehavior.attackCooldownDelay;

      let bullet = Sup.appendScene("In-Game/Entities/Player/Bullet/Prefab")[0];
      bullet.getBehavior(BulletBehavior).setup(this.position, this.direction);
    }

    // Interactions
    if (Sup.Input.wasKeyJustPressed("SPACE")) {
      let closestInteractable: InteractableBehavior;
      let closestDistance = Infinity;
      for (let interactable of Game.interactables) {
        let distance = this.position.distanceTo(interactable.actor.getLocalPosition().toVector2());
        if (distance < closestDistance) {
          closestDistance = distance;
          closestInteractable = interactable;
        }
      }
      
      if (closestDistance < 1) closestInteractable.interact();
    }
  }
}
Sup.registerBehavior(PlayerBehavior);

namespace PlayerBehavior {
  export const moveSpeed = 0.1;
  
  export const attackCooldownDelay = 10;

  export const attackDelay = 16;
  export const attackRange = 2;
}
