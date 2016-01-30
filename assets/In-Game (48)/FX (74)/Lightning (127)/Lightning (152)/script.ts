class LightningBehavior extends Sup.Behavior {

  audio = Sup.get( "In-Game/FX/Lightning/Sound", Sup.Sound );
  
  awake() {
    this.actor.spriteRenderer.uniforms.setFloat("time", 5);
    this.newLoop();
  }
  
  newLoop() {
    Sup.setTimeout(Sup.Math.Random.float(4000, 15000), this.doubleTap);
  }
  
  doubleTap = () => {
    if (this.actor.isDestroyed()) return;
    
    this.actor.spriteRenderer.uniforms.setFloat("time", 0);
    Sup.setTimeout( Sup.Math.Random.float(100, 1000), this.playSound );
    Sup.setTimeout(150, this.lastTap);
  }
  
  lastTap = () => {
    if (this.actor.isDestroyed()) return;

    this.actor.spriteRenderer.uniforms.setFloat("time", 0);
    Sup.setTimeout( Sup.Math.Random.float(100, 1000), this.playSound );
    this.newLoop();
  }
  
  playSound = () =>
  {
    Sup.Audio.playSound( this.audio, 0.2, {pitch: Sup.Math.Random.float(-.2, .2)});
  }
}
Sup.registerBehavior(LightningBehavior);
