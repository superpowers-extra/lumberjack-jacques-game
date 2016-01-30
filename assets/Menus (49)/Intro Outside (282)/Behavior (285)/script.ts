class IntroOutsideBehavior extends Sup.Behavior {
  doorRenderer: Sup.SpriteRenderer;
  shadowActor: Sup.Actor;

  awake() {
    this.doorRenderer = Sup.getActor("Outside Door").spriteRenderer;
    this.shadowActor = Sup.getActor("Shadow");
    
    new Sup.Tween(this.shadowActor, { y: -20 }).to({ y: 0 }, 3000)
    .easing(TWEEN.Easing.Quintic.Out)
    .onUpdate((obj) => {
      this.shadowActor.setLocalY(obj.y);
    }).onComplete(() => {
      Sup.Audio.playSound(Sup.get("Menus/Intro Outside/Open Door Sound", Sup.Sound));
      this.doorRenderer.setAnimation("Open", false);
      
      Sup.setTimeout(2000, () => { Game.loadMap("Home Outside"); })
    }).start();
  }
}
Sup.registerBehavior(IntroOutsideBehavior);
