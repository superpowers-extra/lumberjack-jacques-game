class CameraBehavior extends Sup.Behavior {
  
  position = new Sup.Math.Vector2();
  cameraWidth: number;
  cameraHeight: number;

  limits: { [name: string]: Sup.Math.Vector2 } = {};

  fxs: Sup.SpriteRenderer[] = [];

  inventory: { [name: string]: { isActive: boolean, renderer: Sup.SpriteRenderer }} = {};

  vibrateTimer = 0;
  vibrateIntensity: number;
  
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
    
    // play rain sound
    const drops = Sup.getActor("Rain Drops");
    if (drops != null) CameraBehavior.rainSoundPlayer.play();
    else CameraBehavior.rainSoundPlayer.stop();
  }

  updateGoal() {
    this.actor.getChild("Goal").textRenderer.setText(Game.currentGoal !== Game.Goals.None ? Game.getText(`goal_${Game.Goals[Game.currentGoal]}`) : "");
  }

  update() {
    if (Game.playerBehavior == null) return;
    
    this.position.copy(Game.playerBehavior.position);
    
    if (this.limits["Right"].x - this.limits["Left"].x > 40)
      this.position.x = Sup.Math.clamp(this.position.x, this.limits["Left"].x + this.cameraWidth / 2 - CameraBehavior.limitBorder, this.limits["Right"].x - this.cameraWidth / 2 + CameraBehavior.limitBorder);
    if (this.limits["Top"].y - this.limits["Bottom"].y > 30)
      this.position.y = Sup.Math.clamp(this.position.y, this.limits["Bottom"].y + this.cameraHeight / 2 - CameraBehavior.limitBorder, this.limits["Top"].y - this.cameraHeight / 2 + CameraBehavior.limitBorder);
    this.actor.setLocalPosition(this.position);
    
    if (this.vibrateTimer > 0) {
      this.vibrateTimer -= 1;
      this.actor.moveLocal(Sup.Math.Random.float(-this.vibrateIntensity, this.vibrateIntensity), Sup.Math.Random.float(-this.vibrateIntensity, this.vibrateIntensity));
    }

    for (let fx of this.fxs) fx.uniforms.setVector2("cameraPos", this.position);
  }

  vibrate(duration: number, intensity: number) {
    this.vibrateTimer = duration;
    this.vibrateIntensity = intensity;
  }
}
Sup.registerBehavior(CameraBehavior);

namespace CameraBehavior {
  export const limitBorder = 2;
  
  export const maxY = 300;
  
  export const rainSoundPlayer = new Sup.Audio.SoundPlayer("In-Game/FX/Rain Drops/Sound", 0.4, { loop: true });
}
