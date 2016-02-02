class MayorBehavior extends SimpleDialogBehavior {
  static combatStarted = false;

  playerEntering = true;
  cultists: Sup.Actor[];

  dialogs =[
    { name: "mayor", text:"mayor_first" },
    { name: "cultist", text:"cultist_first" },
    { name: "mayor", text:"mayor_1" },
    { name: "cultist", text:"cultist_1" },
    { name: "mayor", text:"mayor_2" },
    { name: "player", text:"player_caught" },
    { name: "mayor", text:"mayor_aggressive" },  
  ];
  
  start() {
    this.cultists = Sup.getActor("Enemies").getChildren();
    
    if (Game.currentGoal === Game.Goals.Boss) {
      for (let cultist of this.cultists) cultist.destroy();
      this.actor.destroy();
    }
  }

  ticks = 0;
  update() {
    if (this.playerEntering) {
      Game.playerBehavior.autoPilot = true;
      Game.playerBehavior.setDirection(Utils.Directions.Up, true);
      
      if (Game.playerBehavior.position.y >= -2) {
        this.playerEntering = false;
        Game.playerBehavior.autoPilot = false;
        Game.playerBehavior.clearMotion();
        Game.playerBehavior.activeInteractable = this;
        this.interact();
      }
    }
    
    this.ticks++;
    if (MayorBehavior.combatStarted === true && this.ticks % 30 == 0) {
      let aliveCultisits = 0;
      for (const cultist of this.cultists) {
        if (cultist.isDestroyed() === false) {
          aliveCultisits++;
        }
      }
      
      if (aliveCultisits <= 0) {
        Game.playerBehavior.clearMotion();
        
        // second dialogs
        this.dialogs = [
          { name: "mayor", text: "mayor_defeated" },
          { name: "player", text: "player_mayor" },
          { name: "mayor", text: "mayor_defeated_1" },
          { name: "player", text: "player_mayor_1" },
          { name: "mayor", text: "mayor_defeated_2" },
          { name: "mayor", text: "mayor_escape" },
          { name: "player", text: "player_decided" },
          { name: "player", text: "player_gunshot" },
        ];
        
        MayorBehavior.combatStarted = false;
        this.interact();
      } 
    }
  }
  
  mayorTween: Sup.Tween;
  interact() {
    super.interact();
    
    const line = this.dialogs[this.currentText-1];
    if (line != null && line.text == "mayor_escape" && this.mayorTween == null) {
      
      const mayor = Sup.getActor("Mayor");
      const pos = mayor.getPosition().toVector2();
      const start = {
        x: pos.x,
        y: pos.y,
        opacity: 1
      };
      
      let dest = pos.clone();
      dest.y = -10;
      
      const end = {
        x: dest.x,
        y: dest.y,
        opacity: 0
      }
    
      this.mayorTween = new Sup.Tween(mayor, start)
      .to(end, 4000)
      .onUpdate((data: any)=>{
        mayor.arcadeBody2D.warpPosition(data.x, data.y);
        mayor.spriteRenderer.setOpacity(data.opacity)
      })
      .onComplete(()=> {
        mayor.destroy();
      })
      .start();
      mayor.spriteRenderer.setAnimation("Run");
    }
  }
  
  onFinish() {
    if (this.dialogs[0].text === "mayor_first") {
      MayorBehavior.combatStarted = true;
    } else {
      Game.setGoal(Game.Goals.Boss);
    }
  }
}
Sup.registerBehavior(MayorBehavior);
