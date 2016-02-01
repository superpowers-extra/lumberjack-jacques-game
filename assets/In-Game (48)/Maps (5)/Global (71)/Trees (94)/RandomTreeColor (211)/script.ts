class RandomTreeColorBehavior extends Sup.Behavior {
  
  colorA = new Sup.Color( 0xffffff );
  colorB = new Sup.Color( 0x69a3ad );
  
  awake() {
    this.actor.spriteRenderer.setColor(
      Sup.Math.Random.float( this.colorA.r, this.colorB.r ),
      Sup.Math.Random.float( this.colorA.g, this.colorB.g ),
      Sup.Math.Random.float( this.colorA.b, this.colorB.b )
    );
    
    let spriteSize = this.actor.spriteRenderer.getSprite().getGridSize();
    this.actor.spriteRenderer.uniforms.setVector2( "texSize", new Sup.Math.Vector2( spriteSize.width, spriteSize.height ) );
    
    this.destroy();
  }
}
Sup.registerBehavior(RandomTreeColorBehavior);
