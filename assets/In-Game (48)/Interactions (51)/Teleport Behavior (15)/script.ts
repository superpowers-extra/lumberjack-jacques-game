class TeleportBehavior extends Sup.Behavior {
  target: string;
  private position: Sup.Math.Vector2;

  awake() { this.position = this.actor.getLocalPosition().toVector2(); }

  update() {
    let distance = this.position.distanceTo(Game.playerBehavior.position);
    if (distance < 0.5) Fade.start(Fade.Direction.Out, () => { Game.loadMap(this.target) });
  }
}
Sup.registerBehavior(TeleportBehavior);
