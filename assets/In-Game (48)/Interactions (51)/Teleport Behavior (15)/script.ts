class TeleportBehavior extends Sup.Behavior {
  target: string;
  direction: string;

  private triggered = false;
  private position: Sup.Math.Vector2;


  awake() { this.position = this.actor.getLocalPosition().toVector2(); }

  update() {
    if (this.triggered) return;
    
    let distance = this.position.distanceTo(Game.playerBehavior.position);
    if (distance < 0.5) {
      this.triggered = true;
      Game.playerBehavior.setDirection(Utils.Directions[this.direction]);
      Fade.start(Fade.Direction.Out, () => { Game.loadMap(this.target) });
    }
  }
}
Sup.registerBehavior(TeleportBehavior);
