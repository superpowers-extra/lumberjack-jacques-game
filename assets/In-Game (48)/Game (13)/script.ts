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
  export let dialogs: { [language: string]: { [dialogName: string]: { name: string; text: string; }[] } } = {};
  export let texts: { [language: string]: { [key: string]: string } } = {};

  export function getText(textName: string) {
    return texts[currentLanguage][textName];
  }

  export function getDialogs(dialogName: string) {
    return dialogs[currentLanguage][dialogName];
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

    let spawnName = currentMapName.split("/").pop();
    Game.playerBehavior.setup(spawnName);
    currentMapName = mapName;

    Fade.start(Fade.Direction.In, () => {
      Game.playerBehavior.autoPilot = false;
    });
  }
}
