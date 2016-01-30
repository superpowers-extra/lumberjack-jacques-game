namespace Game {
  export let playerBehavior: PlayerBehavior;
  export let cameraBehavior: CameraBehavior;
  export let dialogBehavior: DialogBehavior;

  export let enemies: EnemyBehavior[];
  export let interactables: InteractableBehavior[];
  
  export let mapActor: Sup.Actor;
  let currentMapName = "Start";

  export function loadMap(mapName: string) {
    if (mapActor != null) mapActor.getParent().destroy();
    
    enemies = [];
    interactables = [];
    
    let mapRoot = Sup.appendScene(`In-Game/Maps/${mapName}/Prefab`)[0];

    mapActor = mapRoot.getChild("Map");
    let tileMapAsset = mapActor.tileMapRenderer.getTileMap();
    let collisionLayer = tileMapAsset.getLayerCount() - 1;
    mapActor.tileMapRenderer.setLayerOpacity(collisionLayer, 0);
    let options: TileMapOptions = { tileMapAsset, tileSetPropertyName: "solid", layersIndex: collisionLayer.toString() };
    new Sup.ArcadePhysics2D.Body(mapActor, Sup.ArcadePhysics2D.BodyType.TileMap, options);

    let spawnName = currentMapName.split("/");
    let spawn = mapRoot.getChild("Markers").getChild(`From ${spawnName[spawnName.length-1]}`).getLocalPosition().toVector2();
    Game.playerBehavior.actor.arcadeBody2D.warpPosition(spawn);
    Game.playerBehavior.actor.arcadeBody2D.setVelocity(0, 0);
    currentMapName = mapName;
    
    const mapWidth = tileMapAsset.getWidth();
    const mapHeight = tileMapAsset.getHeight();
    Game.cameraBehavior.setupMapLimits(mapWidth, mapHeight);
    
    Fade.start(Fade.Direction.In);
  }
}
