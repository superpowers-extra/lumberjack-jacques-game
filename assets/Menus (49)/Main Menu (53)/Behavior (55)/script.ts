class StartMenuBehavior extends Sup.Behavior {
  private introStarted = false;
  private introTimeout = null;
  private animatedIntroText: AnimatedTextBehavior;

  awake() {
    Fade.start(Fade.Direction.In, { duration: 500 });
    Game.playMusic("Ambient 1", 0.8);
    
    const logoActor = Sup.getActor("Logo");
    new Sup.Tween(logoActor, { y: 15.2 }).to({ y: 5.2 }, 2000)
      .delay(300)
      .easing(TWEEN.Easing.Bounce.Out)
      .onUpdate((obj) => { logoActor.setLocalY(obj.y); })
      .start();

    this.animatedIntroText = Sup.getActor("Intro Text").getBehavior(AnimatedTextBehavior);
    
    const lightning = Sup.getActor("Lightning").getBehavior(LightningBehavior);
    lightning.minInterval = 2000;
    lightning.maxInterval = 8000;
    
    CameraBehavior.rainSoundPlayer.play();
  }

  update() {
    // DEBUG
    if (this.introTimeout == null && Sup.Input.wasKeyJustPressed("V")) {
      PlayerBehavior.inventory["Key"].isActive = true;
      Game.loadMap("Village");
      Game.currentGoal = Game.Goals.Village;
    } else if (this.introTimeout == null && Sup.Input.wasKeyJustPressed("M")) {
      PlayerBehavior.inventory["Rifle"].isActive = true;
      Game.loadMap("Mine/Room");
      Game.currentGoal = Game.Goals.Mine;
    } /*else if (this.introTimeout == null && Sup.Input.wasKeyJustPressed("B")) {
      Game.loadMap("Mine/Boss Room");
      Game.currentGoal = Game.Goals.Boss;
    }
    */
    
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
    if (Sup.Input.wasKeyJustReleased("F")) {
      Game.loadMap("Forest House Village");
      Game.currentGoal = Game.Goals.Village;
    }
  }
}
Sup.registerBehavior(StartMenuBehavior);
