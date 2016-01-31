class TimeOffsetBehavior extends Sup.Behavior {
  awake() {
   this.actor.spriteRenderer.uniforms.setFloat("time", Sup.Math.Random.float(0, 1) ); 
    this.destroy();
  }
}
Sup.registerBehavior(TimeOffsetBehavior);
