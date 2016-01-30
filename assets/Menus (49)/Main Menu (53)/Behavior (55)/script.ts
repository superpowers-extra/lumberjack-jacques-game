class StartMenuBehavior extends Sup.Behavior {
  private introStarted = false;
  private introTimeout = null;
  private animatedIntroText: AnimatedTextBehavior;

  awake() {
    this.animatedIntroText = Sup.getActor("Intro Text").getBehavior(AnimatedTextBehavior);
    
    const lightning = Sup.getActor("Lightning").getBehavior(LightningBehavior);
    lightning.minInterval = 2000;
    lightning.maxInterval = 8000;
  }

  update() {
    // DEBUG
    if (this.introTimeout == null && Sup.Input.wasKeyJustPressed("I")) {
      Game.loadMap("Home Outside");
      return;
    } else if (this.introTimeout == null && Sup.Input.wasKeyJustPressed("V")) {
      Game.loadMap("Village");
      Game.currentGoal = Game.Goals.Village;
    }
    
    if (!this.introStarted && Sup.Input.wasKeyJustPressed("RETURN") || Sup.Input.wasGamepadButtonJustPressed(0, 0)) {
      this.introStarted = true;
      Sup.getActor("Menu").destroy();
      this.animatedIntroText.actor.setVisible(true);
      this.animatedIntroText.setText(Game.getText("intro"));
      
    const lightning = Sup.getActor("Lightning").getBehavior(LightningBehavior).doubleTap();
    }
    
    if (this.introStarted && this.introTimeout == null && this.animatedIntroText.isTextFullyDisplayed()) {
      this.introTimeout = Sup.setTimeout(500, () => { 
        Fade.start(Fade.Direction.Out, { duration: 1000 }, () => { Sup.loadScene("Menus/Intro House/Scene") });
      });
    }
    
    // temp
    if (Sup.Input.wasKeyJustReleased("V")) {
      Game.loadMap("Village");
      Game.currentGoal = Game.Goals.Village;
    }
  }
}
Sup.registerBehavior(StartMenuBehavior);
