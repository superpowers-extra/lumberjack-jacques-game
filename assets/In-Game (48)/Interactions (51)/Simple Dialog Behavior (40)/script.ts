abstract class SimpleDialogBehavior extends InteractableBehavior {
  
  texts: { name: string; text: string; }[];
  private currentText: number = null;

  interact() {
    if (Game.playerBehavior.activeInteractable == null) {
      this.currentText = 0;
      Game.playerBehavior.activeInteractable = this;
    }
    
    if (!Game.dialogBehavior.isTextFullyDisplayed()) {
      Game.dialogBehavior.fullyDisplaytext();
    } else if (this.currentText < this.texts.length) {
      Game.dialogBehavior.show(this.texts[this.currentText].name, this.texts[this.currentText].text);
      this.currentText++;
    } else {
      Game.dialogBehavior.hide();
      Game.playerBehavior.activeInteractable = null;
    }
  }
}
