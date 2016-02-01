class ChiomeSoundPlayBehavior extends Sup.Behavior {
  awake() {
    
  }

  update() {
    Sup.Audio.playSound("chiomeSoundPlay",0)
  }
}
Sup.registerBehavior(ChiomeSoundPlayBehavior);
