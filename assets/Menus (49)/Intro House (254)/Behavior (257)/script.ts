class IntroHouseBehavior extends Sup.Behavior {
  
  doorRenderer: Sup.SpriteRenderer;
  knockCounter = 0;
  interval = null;
  
  awake() {
    this.doorRenderer = Sup.getActor("Door").spriteRenderer;
    Sup.setTimeout(2500, this.startKnocking);
    
    const lightning = Sup.getActor("Lightning").getBehavior(LightningBehavior);
    lightning.minInterval = 2000;
    lightning.maxInterval = 8000;
  }
  
  update() {
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
    
    Sup.Audio.playSound(Sup.get("Menus/Intro House/Knock Sound", Sup.Sound));
    this.doorRenderer.setAnimation("Knock", false);
    
  };
}
Sup.registerBehavior(IntroHouseBehavior);
