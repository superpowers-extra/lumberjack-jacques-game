class DialogBehavior extends Sup.Behavior {
  
  private speaker = "";
  private text = "";
  private textProgress = 0;
  private speakerText: string;

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

    this.textRenderer.setText("");
    text = `${this.speaker.toUpperCase()}: ${text}`;
    
    const charsPerLine = 40;
    const lines: string[] = [];
    
    let prevI = 0;
    for (let i = charsPerLine; prevI < text.length; i += charsPerLine) {
      while (i > 0 && i < text.length && text[i - 1] !== " ") i--;
      if (i > text.length) i = text.length;
      lines.push(text.slice(prevI, i));
      prevI = i;
    }
    
    this.text = lines.join("\n");
    this.textProgress = 0;
  }
  
  hide() {
    this.actor.setVisible(false);
  }

  isTextFullyDisplayed() { return this.textProgress === this.text.length; }
  fullyDisplaytext() {
    this.textProgress = this.text.length;
    this.textRenderer.setText(this.text);
  }

  update() {
    if (! this.actor.getVisible()) return;
    
    if (this.textProgress < this.text.length) {
      this.textProgress++;
      this.textRenderer.setText(this.text.slice(0, this.textProgress));
    }
  }
}
Sup.registerBehavior(DialogBehavior);
