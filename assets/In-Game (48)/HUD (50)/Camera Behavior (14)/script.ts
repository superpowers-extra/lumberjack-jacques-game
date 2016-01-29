class CameraBehavior extends Sup.Behavior {
  
  position = new Sup.Math.Vector2();
  cameraWidth: number;
  cameraHeight: number;

  mapWidth: number;
  mapHeight: number;
  
  awake() {
    Game.cameraBehavior = this;
    
    this.cameraHeight = this.actor.camera.getOrthographicScale();
    this.cameraWidth = this.cameraHeight * this.actor.camera.getWidthToHeightRatio();
  }

  setupMapLimits(width: number, height: number) {
    this.mapWidth = width;
    this.mapHeight = height;
  }

  update() {
    this.position.copy(Game.playerBehavior.position);
    this.position.x = Sup.Math.clamp(this.position.x, this.cameraWidth / 2, this.mapWidth - this.cameraWidth / 2);
    this.position.y = Sup.Math.clamp(this.position.y, this.cameraHeight / 2, this.mapHeight - this.cameraHeight / 2);
    
    this.actor.setLocalPosition(this.position);
  }
}
Sup.registerBehavior(CameraBehavior);
