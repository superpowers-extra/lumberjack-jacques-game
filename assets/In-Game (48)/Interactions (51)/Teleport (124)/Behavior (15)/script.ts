class TeleportBehavior extends Sup.Behavior {
  direction: string;

  private triggered = false;
  private position: Sup.Math.Vector2;
  private size = this.actor.getLocalScale();

  awake() {
    this.position = this.actor.getLocalPosition().toVector2();
    this.actor.setVisible(false);
  }

  start() {
    if (this.actor.getName() === "Start") this.actor.destroy();
  }

  update() {
    if (Fade.isFading || Game.playerBehavior.autoPilot || this.triggered) return;
    
    if (Math.abs(Game.playerBehavior.position.x - this.position.x) <= this.size.x / 2 && Math.abs(Game.playerBehavior.position.y - this.position.y) <= this.size.y / 2) {
      this.triggered = true;
      Game.playerBehavior.autoPilot = true;
      Game.playerBehavior.setDirection(Utils.Directions[this.direction], true);
      Sup.log("teleport", this.actor.getName(), this.direction);
      Fade.start(Fade.Direction.Out, null, () => { Game.loadMap(this.actor.getName().replace("_", "/")); });
    }
  }
}
Sup.registerBehavior(TeleportBehavior);
