class TheEndBehavior extends Sup.Behavior {
  characterRenderer: Sup.SpriteRenderer;
  
  awake() {
    Game.playMusic("Final Orgue", 0.8);
    
    Sup.Audio.playSound("Menus/Intro House/Rocking Chair", 1, { loop: true });
    
    this.characterRenderer = Sup.getActor("Character").spriteRenderer;
    new Sup.Tween(this.characterRenderer.actor, { angle: -2 })
      .to({ angle: 15 }, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .yoyo(true).repeat(Infinity)
      .onUpdate((obj) => {
        this.characterRenderer.actor.setLocalEulerZ(Sup.Math.toRadians(obj.angle));
      })
      .start();
  }
}
Sup.registerBehavior(TheEndBehavior);
