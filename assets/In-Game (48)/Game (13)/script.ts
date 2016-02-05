namespace Game {
  export let playerBehavior: PlayerBehavior;
  export let cameraBehavior: CameraBehavior;
  export let dialogBehavior: DialogBehavior;

  export enum Goals { None, Village, Shotgun, Boss };
  export let currentGoal = Goals.None;

  export let enemies: Enemy[];
  export let interactables: InteractableBehavior[];

  export let currentMapName = "Start";

  export let currentLanguage = "en";
  export let texts: { [language: string]: { [key: string]: string } } = {};
  
  export let musicPlayer: Sup.Audio.SoundPlayer;
  export let musicName: string;
  
  const musicsPerMap = {
    "Home Outside": { name: "Ambient 1", volume: 0.5 },
    "Forest House Village": { name: "Ambient 1", volume: 0.5 },
    "Village": { name: "Ambient 3", volume: 0.5 },
    "Village/Doctor House": { name: "Ambient 2", volume: 0.5 },
    "Village/Old Lady House": null,
    "Village/Family House": null,
    "Village/Tavern Inside": { name: "Jazzy", volume: 0.5 },
    "Village/Tavern Basement": { name: "Jazzy", volume: 0.2 },
    "Village/Church Inside": { name: "Orgue Metal", volume: 0.5 },
    "Mine Path": { name: "Drums Fight", volume: 0.5 },
    "Mine/Entrance": { name: "Drums Fight", volume: 0.5 },
    "Mine/Mine Room": { name: "Drums Fight", volume: 0.5 },
    "Mine/Boss Room": { name: "Fight", volume: 0.5 },
  };
  
  export function playMusic(name: string, volume=0.5) {
    if (musicName === name) {
      musicPlayer.setVolume(volume);
      return;
    }
    
    if (musicPlayer != null) musicPlayer.stop();
    musicName = name;
    musicPlayer = new Sup.Audio.SoundPlayer(`Music/${musicName}`, volume, { loop: true });
    musicPlayer.play();
  }

  export function getText(textKey: string) {
    let text = texts[currentLanguage][textKey];

    // Fallback to english
    if (text == null && currentLanguage === "fr") {
      Sup.log(`Missing french dialog key: ${textKey}`);
      text = texts["en"][textKey];
    }
    
    // Fallback to key
    if (text == null) {
      Sup.log(`Missing english dialog key: ${textKey}`);
      text = textKey;
    }
    return text;
  }
  
  export function setGoal(goal: Goals) {
    currentGoal = goal;
    Game.cameraBehavior.updateGoal();
  }

  export function loadMap(mapName: string) {
    enemies = [];
    interactables = [];

    if (musicsPerMap[mapName] != null) playMusic(musicsPerMap[mapName].name, musicsPerMap[mapName].volume);
    Sup.loadScene(`In-Game/Maps/${mapName}/Prefab`);

    Sup.getActor("Attached To Camera").setParent(Game.cameraBehavior.actor).setLocalPosition(0, 0);

    Game.playerBehavior.setup(currentMapName);
    currentMapName = mapName;

    Fade.start(Fade.Direction.In, null, () => {
      Game.playerBehavior.actor.arcadeBody2D.setVelocity(0, 0);
      Game.playerBehavior.actor.spriteRenderer.setAnimation(`Idle ${Utils.Directions[Game.playerBehavior.lookDirection]}`);
    });
  }
}
