class StartMenuBehavior extends Sup.Behavior {
  private introStarted = false;
  private introTimeout = null;
  private animatedIntroText: AnimatedTextBehavior;

  awake() {
    this.animatedIntroText = Sup.getActor("Intro Text").getBehavior(AnimatedTextBehavior);
  }

  update() {
    // DEBUG
    if (this.introTimeout == null && Sup.Input.wasKeyJustPressed("I")) {
      Game.loadMap("Home Outside");
      return;
    }
    
    if (!this.introStarted && Sup.Input.wasKeyJustPressed("RETURN") || Sup.Input.wasGamepadButtonJustPressed(0, 0)) {
      this.introStarted = true;
      Sup.getActor("Menu").destroy();
      this.animatedIntroText.actor.setVisible(true);
      this.animatedIntroText.setText(Game.getText("intro"));
    }
    
    if (this.introStarted && this.introTimeout == null && this.animatedIntroText.isTextFullyDisplayed()) {
      this.introTimeout = Sup.setTimeout(500, () => { 
        Fade.start(Fade.Direction.Out, () => { Game.loadMap("Home Outside"); });
      });
    }
  }
}
Sup.registerBehavior(StartMenuBehavior);
