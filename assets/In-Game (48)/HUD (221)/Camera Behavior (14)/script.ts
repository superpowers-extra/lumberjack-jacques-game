class CameraBehavior extends Sup.Behavior {
  
  position = new Sup.Math.Vector2();
  cameraWidth: number;
  cameraHeight: number;

  limits: { [name: string]: Sup.Math.Vector2 } = {};

  fxs: Sup.SpriteRenderer[] = [];
  
  awake() {
    Game.cameraBehavior = this;
    
    this.cameraHeight = this.actor.camera.getOrthographicScale();
    this.cameraWidth = this.cameraHeight * this.actor.camera.getWidthToHeightRatio();
  }

  start() {
    for (let limitActor of Sup.getActor("Limits").getChildren()) {
      this.limits[limitActor.getName()] = limitActor.getLocalPosition().toVector2();
    }
    
    this.position.copy(Game.playerBehavior.position);
    
    function setupRecursively(actor: Sup.Actor) {
      if (actor.spriteRenderer != null) {
        Utils.updateDepth(actor, actor.getY());
      } else {
        for (let child of actor.getChildren()) setupRecursively(child);
      }
    }
    setupRecursively(Sup.getActor("Scenery"));
    
    for (let fx of this.actor.getChild("Attached To Camera").getChildren()) this.fxs.push(fx.spriteRenderer);
    
    this.updateGoal();
  }

  updateGoal() {
    this.actor.getChild("Goal").textRenderer.setText(Game.currentGoal !== Game.Goals.None ? Game.getText(`goal_${Game.Goals[Game.currentGoal]}`) : "");
  }

  update() {
    if (Game.playerBehavior == null) return;
    
    this.position.copy(Game.playerBehavior.position);
    this.position.x = Sup.Math.clamp(this.position.x, this.limits["Left"].x + this.cameraWidth / 2 - CameraBehavior.limitBorder, this.limits["Right"].x - this.cameraWidth / 2 + CameraBehavior.limitBorder);
    this.position.y = Sup.Math.clamp(this.position.y, this.limits["Bottom"].y + this.cameraHeight / 2 - CameraBehavior.limitBorder, this.limits["Top"].y - this.cameraHeight / 2 + CameraBehavior.limitBorder);
    this.actor.setLocalPosition(this.position);

    for (let fx of this.fxs) fx.uniforms.setVector2("cameraPos", this.position);
  }
}
Sup.registerBehavior(CameraBehavior);

namespace CameraBehavior {
  export const limitBorder = 2;
  
  export const maxY = 300;
}
