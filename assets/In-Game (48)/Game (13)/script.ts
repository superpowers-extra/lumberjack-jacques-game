namespace Game {
  export let playerBehavior: PlayerBehavior;
  export let cameraBehavior: CameraBehavior;
  export let dialogBehavior: DialogBehavior;

  export enum Goals { None, Village };
  export let currentGoal = Goals.None;

  export let enemies: EnemyBehavior[];
  export let interactables: InteractableBehavior[];

  export let currentMapName = "Start";

  export let currentLanguage = "en";
  export let texts: { [language: string]: { [key: string]: string } } = {};

  export function getText(textName: string) {
    let text = texts[currentLanguage][textName];

    // Fallback to french
    if (text == null) text = texts["fr"][textName];
    
    // Fallback to key
    if (text == null) text = textName;
    return text;
  }
  
  export function setGoal(goal: Goals) {
    currentGoal = goal;
    Game.cameraBehavior.updateGoal();
  }

  export function loadMap(mapName: string) {
    enemies = [];
    interactables = [];

    Sup.loadScene(`In-Game/Maps/${mapName}/Prefab`);

    Sup.getActor("Attached To Camera").setParent(Game.cameraBehavior.actor);

    Game.playerBehavior.setup(currentMapName);
    currentMapName = mapName;

    Fade.start(Fade.Direction.In, null, () => {
      Game.playerBehavior.actor.arcadeBody2D.setVelocity(0, 0);
      Game.playerBehavior.actor.spriteRenderer.setAnimation(`Idle ${Utils.Directions[Game.playerBehavior.direction]}`);
    });
  }
}
