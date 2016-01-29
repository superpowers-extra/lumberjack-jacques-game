namespace Game {
  export let playerBehavior: PlayerBehavior;
  export let cameraBehavior: CameraBehavior;
  export let dialogBehavior: DialogBehavior;

  export let enemies: EnemyBehavior[];
  export let interactables: InteractableBehavior[];
  
  export let mapRoot: Sup.Actor;
  let currentMapName = "Start";

  export function loadMap(mapName: string) {
    if (mapRoot != null) mapRoot.destroy();
    
    enemies = [];
    interactables = [];
    
    mapRoot = Sup.appendScene(`In-Game/Maps/${mapName}/Prefab`)[0];

    let mapActor = mapRoot.getChild("Map");
    let tileMapAsset = mapActor.tileMapRenderer.getTileMap();
    mapActor.tileMapRenderer.setLayerOpacity(tileMapAsset.getLayerCount() - 1, 0);
    let options: TileMapOptions = { tileMapAsset, tileSetPropertyName: "solid" };
    new Sup.ArcadePhysics2D.Body(mapActor, Sup.ArcadePhysics2D.BodyType.TileMap, options);
    
    let spawnName = currentMapName.split("/");
    let spawn = mapRoot.getChild("Markers").getChild(`From ${spawnName[spawnName.length-1]}`).getLocalPosition().toVector2();
    Game.playerBehavior.actor.arcadeBody2D.warpPosition(spawn);
    currentMapName = mapName;
    
    const mapWidth = tileMapAsset.getWidth();
    const mapHeight = tileMapAsset.getHeight();
    Game.cameraBehavior.setupMapLimits(mapWidth, mapHeight);
    
    let leftBorder = new Sup.Actor("Left Border", mapRoot);
    leftBorder.setLocalPosition(-0.5, mapHeight / 2);
    new Sup.ArcadePhysics2D.Body(leftBorder, Sup.ArcadePhysics2D.BodyType.Box, { width: 1, height: mapHeight, movable: false });
    
    let rightBorder = new Sup.Actor("Right Border", mapRoot);
    rightBorder.setLocalPosition(mapWidth + 0.5, mapHeight / 2);
    new Sup.ArcadePhysics2D.Body(rightBorder, Sup.ArcadePhysics2D.BodyType.Box, { width: 1, height: mapHeight, movable: false });
    
    let downBorder = new Sup.Actor("Down Border", mapRoot);
    downBorder.setLocalPosition(mapWidth / 2, -0.5);
    new Sup.ArcadePhysics2D.Body(downBorder, Sup.ArcadePhysics2D.BodyType.Box, { width: mapWidth, height: 1, movable: false });
    
    let upBorder = new Sup.Actor("Up Border", mapRoot);
    upBorder.setLocalPosition(mapWidth / 2, mapHeight + 0.5);
    new Sup.ArcadePhysics2D.Body(upBorder, Sup.ArcadePhysics2D.BodyType.Box, { width: mapWidth, height: 1, movable: false });
    
    Fade.start(Fade.Direction.In);
  }
}
