declare var window;

class LanguageSelectBehavior extends Sup.Behavior {
  
  languageRenderers: Sup.TextRenderer[] = [];
  languageIndex = 0;

  inactiveOpacity = 0.6;
  inactiveColor = new Sup.Color(0.8, 0.8, 0.8);

  awake() {
    Sup.getActor("Start").textRenderer.setText(Game.getText("pressToStart"));

    for (const child of this.actor.getChildren()) {
      const textRenderer = child.getChild("Text").textRenderer;
      textRenderer.setOpacity(this.inactiveOpacity).setColor(this.inactiveColor);
      this.languageRenderers.push(textRenderer);
    }
    
    this.languageRenderers[0].setOpacity(1).setColor(new Sup.Color(1, 1, 1));
    
    if (window.navigator.language.slice(0, 2) === "fr") {
      this.updateLanguage(1);
    }
  }

  update() {
    if (Sup.Input.wasKeyJustPressed("LEFT", { autoRepeat: true }) || Sup.Input.wasGamepadAxisJustPressed(0, 0, false, { autoRepeat: true })) {
      this.updateLanguage(Math.max(this.languageIndex - 1, 0));
    }

    if (Sup.Input.wasKeyJustPressed("RIGHT", { autoRepeat: true }) || Sup.Input.wasGamepadAxisJustPressed(0, 0, true, { autoRepeat: true })) {
      this.updateLanguage(Math.min(this.languageIndex + 1, this.languageRenderers.length - 1));
    }

    /*if (Sup.Input.wasKeyJustPressed("LEFT")) {
      this.englishRenderer.setOpacity(1);
      this.frenchRenderer.setOpacity(this.inactiveOpacity);
      Game.currentLanguage = "en";
    }
    else if (Sup.Input.wasKeyJustPressed("RIGHT") && Game.currentLanguage != "fr") {
      this.englishRenderer.setOpacity(this.inactiveOpacity);
      this.frenchRenderer.setOpacity(1);
      Game.currentLanguage = "fr";
    }*/
  }

  updateLanguage(languageIndex: number) {
    this.languageRenderers[this.languageIndex].setOpacity(this.inactiveOpacity).setColor(this.inactiveColor);
    this.languageIndex = languageIndex;
    this.languageRenderers[this.languageIndex].setOpacity(1).setColor(new Sup.Color(1, 1, 1));
    Game.currentLanguage = this.languageRenderers[this.languageIndex].actor.getParent().getName();
    Sup.getActor("Start").textRenderer.setText(Game.getText("pressToStart"));
  }
}
Sup.registerBehavior(LanguageSelectBehavior);
