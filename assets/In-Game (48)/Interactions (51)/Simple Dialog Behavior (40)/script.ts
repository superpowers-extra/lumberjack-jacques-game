abstract class SimpleDialogBehavior extends InteractableBehavior {
  
  dialogName: string;
  private currentText: number = null;

  interact() {
    if (Game.playerBehavior.activeInteractable == null) {
      this.currentText = 0;
      Game.playerBehavior.activeInteractable = this;
    }
    
    const dialogs = Game.getDialogs(this.dialogName);
    if (dialogs == null) {
      Sup.log(`No dialog with name '${this.dialogName}' in language '${Game.currentLanguage}'`);
      // Sup.log(Game.dialogs[Game.currentLanguage]);
      return;
    }
    
    if (!Game.dialogBehavior.animatedText.isTextFullyDisplayed()) {
      Game.dialogBehavior.animatedText.fullyDisplayText();
    } else if (this.currentText < dialogs.length) {
      Game.dialogBehavior.show(dialogs[this.currentText].name, dialogs[this.currentText].text);
      
      this.currentText++;
    } else {
      Game.dialogBehavior.hide();
      Game.playerBehavior.activeInteractable = null;
      
      Game.setGoal(Game.Goals.Village);
    }
  }
}
