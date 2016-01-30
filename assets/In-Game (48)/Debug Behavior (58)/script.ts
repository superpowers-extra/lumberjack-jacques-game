class DebugBehavior extends Sup.Behavior {
  awake() {
    
  }

  update() {
    if (Sup.Input.wasKeyJustPressed("ADD")) {
      let mapRndr = Game.mapActor.tileMapRenderer;
      let collisionLayer = mapRndr.getTileMap().getLayerCount() - 1;
      let opacity = mapRndr.getLayerOpacity(collisionLayer);
      mapRndr.setLayerOpacity(collisionLayer, opacity === 0 ? 0.8 : 0);
    }
  }
}
Sup.registerBehavior(DebugBehavior);
