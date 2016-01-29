class PlayerBehavior extends Sup.Behavior {
  
  position: Sup.Math.Vector2;
  private direction = "Down";
  
  private weapon: Sup.Actor;
  private attackTimer = 0;
  private weaponData: { [direction: string]: { angle: number; position: Sup.Math.Vector3; }} = {
    "Down": { angle:  -60, position: new Sup.Math.Vector3(   0, -0.5,  0.1) },
    "Up":   { angle:  120, position: new Sup.Math.Vector3(   0,  0.4, -0.1) },
    "Left": { angle: -150, position: new Sup.Math.Vector3(-0.4, -0.2,  0.1) },
    "Right": { angle:  30, position: new Sup.Math.Vector3( 0.4, -0.2,  0.1) }
  };

  activeInteractable: InteractableBehavior;
  
  awake() {
    Game.playerBehavior = this;
    
    this.weapon = this.actor.getChild("Weapon");
    this.weapon.setVisible(false);
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

    let velocity = this.actor.arcadeBody2D.getVelocity();
    velocity.set(0, 0);
    
    if (Sup.Input.isKeyDown("DOWN")) { velocity.y = -1; this.direction = "Down"; }
    else if (Sup.Input.isKeyDown("UP")) { velocity.y = 1; this.direction = "Up"; }
    if (Sup.Input.isKeyDown("LEFT")) { velocity.x = -1; this.direction = "Left"; }
    else if (Sup.Input.isKeyDown("RIGHT")) { velocity.x = 1; this.direction = "Right"; }

    if (velocity.x != 0 || velocity.y != 0) {
      velocity.normalize().multiplyScalar(0.1);
      this.actor.spriteRenderer.setAnimation(`Walk ${this.direction}`);
    } else {
      this.actor.spriteRenderer.setAnimation(`Idle ${this.direction}`);
    }

    this.actor.arcadeBody2D.setVelocity(velocity);

    // Attack
    if (Sup.Input.wasKeyJustPressed("X") && this.attackTimer === PlayerBehavior.attackDelay) {
      let weaponData = this.weaponData[this.direction];
      this.weapon.setLocalPosition(weaponData.position);

      this.weapon.setVisible(true);
      this.attackTimer = 0;
    }

    if (this.attackTimer < PlayerBehavior.attackDelay) {
      let offset = Sup.Math.toRadians(this.weaponData[this.direction].angle);
      this.weapon.setEulerZ(offset + Math.PI * 2 / 3 * Math.sin(this.attackTimer / PlayerBehavior.attackDelay * Math.PI));

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
  export const attackDelay = 16;
  export const attackRange = 2;
}
