class DialogBehavior extends Sup.Behavior {
  
  private speaker = "";
  private text = "Ceci est un test";
  private textProgress = 0;

  portraitRenderer: Sup.SpriteRenderer;
  textRenderer: Sup.TextRenderer;
  
  awake() {
    Game.dialogBehavior = this;
    
    this.portraitRenderer = this.actor.getChild("Portrait").spriteRenderer;
    this.textRenderer = this.actor.getChild("Text").textRenderer;
  }
  
  show(speaker: string, text: string) {
    this.actor.setVisible(true);
    
    this.speaker = speaker;
    this.portraitRenderer.setSprite(`In-Game/HUD/Dialog/Portraits/${speaker}`);

    this.textRenderer.setText(`${speaker.toUpperCase()}:`);
    this.text = text;
    this.textProgress = 0;
  }
  
  hide() {
    this.actor.setVisible(false);
  }

  update() {
    if (! this.actor.getVisible()) return;
    
    if (this.textProgress < this.text.length) {
      this.textProgress++;
      this.textRenderer.setText(`${this.speaker.toUpperCase()}: ${this.text.slice(0, this.textProgress)}`);
    }
  }
}
Sup.registerBehavior(DialogBehavior);
