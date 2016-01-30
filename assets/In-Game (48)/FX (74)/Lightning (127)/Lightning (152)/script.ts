class LightningBehavior extends Sup.Behavior {
  audio = Sup.get("In-Game/FX/Lightning/Sound", Sup.Sound);
  backgroundRenderer: Sup.SpriteRenderer;

  minInterval = 4000;
  maxInterval = 15000;
  
  awake() {
    const backgroundActor = Sup.getActor("Background");
    if (backgroundActor != null) this.backgroundRenderer = backgroundActor.spriteRenderer;
    this.actor.spriteRenderer.uniforms.setFloat("time", 5);
  }

  start() {
    // Starting the loop in start() so the frequency can be tweaked by another behavior's awake() before it starts
    this.newLoop();
  }

  update() {
    if (this.backgroundRenderer != null && !this.backgroundRenderer.isAnimationPlaying()) {
      this.backgroundRenderer.setAnimation(null);
    }
  }

  newLoop() {
    Sup.setTimeout(Sup.Math.Random.float(this.minInterval, this.maxInterval), this.doubleTap);
  }
  
  doubleTap = () => {
    if (this.actor.isDestroyed()) return;

    if (this.backgroundRenderer != null) this.backgroundRenderer.setAnimation("Flash", false);
    
    this.actor.spriteRenderer.uniforms.setFloat("time", 0);
    Sup.setTimeout(Sup.Math.Random.float(100, 1000), this.playSound);
    Sup.setTimeout(150, this.lastTap);
  }
  
  lastTap = () => {
    if (this.actor.isDestroyed()) return;

    this.actor.spriteRenderer.uniforms.setFloat("time", 0);
    Sup.setTimeout(Sup.Math.Random.float(100, 1000), this.playSound);
    this.newLoop();
  }
  
  playSound = () =>
  {
    Sup.Audio.playSound(this.audio, 0.2, {pitch: Sup.Math.Random.float(-.2, .2)});
  }
}
Sup.registerBehavior(LightningBehavior);
