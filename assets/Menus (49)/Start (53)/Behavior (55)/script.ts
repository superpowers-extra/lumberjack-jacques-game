class StartMenuBehavior extends Sup.Behavior {
  awake() {
    
  }

  update() {
    if (Sup.Input.wasKeyJustPressed("RETURN")) {
      Sup.loadScene("In-Game/Scene");
      Game.loadMap("Town");
    }
  }
}
Sup.registerBehavior(StartMenuBehavior);
