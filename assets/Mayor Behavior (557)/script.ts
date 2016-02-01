class MayorBehavior extends SimpleDialogBehavior {
  static combatStarted = false;

  dialogs =[
    { name: "mayor_name", text:"mayor" },
    { name: "cultist_name", text:"cultist" },
    { name: "mayor_name", text:"mayor_1" },
    { name: "cultist_name", text:"cultist_1" },
    { name: "mayor_name", text:"mayor_2" },
    { name: "player", text:"player_caught" },
    { name: "mayor_name", text:"mayor_aggressive" },  
  ];
  
  cultists: Sup.Actor[];
  start() {
    const enemies = Sup.getActor("Enemies");
    this.cultists = [];
    for (let enemy of enemies.getChildren()) {
      if (enemy.getName() == "Cultist") {
        this.cultists.push(enemy);
        enemy.getBehavior(ClosedEnemyBehavior).destroy();
      }
    }
    
    Sup.setTimeout(2000, ()=> {
      Game.playerBehavior.clearMotion();
      Game.playerBehavior.activeInteractable = this;
      this.interact();
      Sup.log("interact");
    });

  }

  activateCultists() {
    for (const cultist of this.cultists) {
      cultist.addBehavior(ClosedEnemyBehavior);
    }
    MayorBehavior.combatStarted = true;
  }

  ticks = 0;
  update() {
    this.ticks++;
    if (MayorBehavior.combatStarted === true && this.ticks % 30 == 0) {
      let aliveCultisits = 0;
      for (const cultist of this.cultists) {
        if (cultist.isDestroyed() === false) {
          aliveCultisits++;
        }
      }
      
      if (aliveCultisits <= 0) {
        // second dialogs
        this.dialogs = [
          { name: "mayor_name", text: "mayor_defeated" },
          { name: "player", text: "player_mayor" },
          { name: "mayor_name", text: "mayor_defeated_1" },
          { name: "player", text: "player_mayor_1" },
          { name: "mayor_name", text: "mayor_defeated_2" },
          { name: "mayor_name", text: "mayor_escape" },
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
    if (this.dialogs[0].text === "mayor") {
      this.activateCultists();
    }
  }
}
Sup.registerBehavior(MayorBehavior);
