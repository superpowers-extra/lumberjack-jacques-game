class IntroHouseBehavior extends Sup.Behavior {
  
  characterRenderer: Sup.SpriteRenderer;
  doorRenderer: Sup.SpriteRenderer;
  knockCounter = 0;
  interval = null;
  
  awake() {
    this.doorRenderer = Sup.getActor("Door").spriteRenderer;
    this.characterRenderer = Sup.getActor("Character").spriteRenderer;
    Sup.setTimeout(2500, this.startKnocking);
    
    const lightning = Sup.getActor("Lightning").getBehavior(LightningBehavior);
    lightning.minInterval = 2000;
    lightning.maxInterval = 6000;
    lightning.onFlash = () => { this.characterRenderer.setAnimation("Flash", false); };
    
    Sup.Audio.playSound("Menus/Intro House/Rocking Chair");
    
    new Sup.Tween(this.characterRenderer.actor, { angle: -2 })
      .to({ angle: 15 }, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .yoyo(true).repeat(Infinity)
      .onUpdate((obj) => {
        this.characterRenderer.actor.setLocalEulerZ(Sup.Math.toRadians(obj.angle));
      })
      .start();
  }
  
  update() {
    if (this.characterRenderer != null && !this.characterRenderer.isAnimationPlaying()) {
      this.characterRenderer.setAnimation(null);
    }
    
    if (!this.doorRenderer.isAnimationPlaying()) this.doorRenderer.setAnimation(null);
  }
  
  startKnocking = () => {
    this.interval = Sup.setInterval(500, this.knock);
  };
  
  knock = () => {
    this.knockCounter++;

    if (this.knockCounter >= 4) {
      if (this.knockCounter == 5) {
        Sup.clearInterval(this.interval);
        Sup.loadScene("Menus/Intro Outside/Scene");
      }
      return;
    }
    
    Sup.Audio.playSound("Menus/Intro House/Knock Sound");
    this.doorRenderer.setAnimation("Knock", false);
    
  };
}
Sup.registerBehavior(IntroHouseBehavior);
