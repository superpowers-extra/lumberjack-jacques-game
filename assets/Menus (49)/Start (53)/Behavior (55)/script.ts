class StartMenuBehavior extends Sup.Behavior {
  awake() {
    
  }

  update() {
    if (Sup.Input.wasKeyJustPressed("RETURN")) {
      Sup.loadScene("In-Game/Scene");
      Game.loadMap("Start");
    }
  }
}
Sup.registerBehavior(StartMenuBehavior);
