class BubiBehavior extends SimpleDialogBehavior {
  
  texts = [
    { name: "Bubi", text: "ceci est un long texte avec des mots qui ne doivent pas etre coupes bizarrement donc il va falloir gerer ca enfin voila quoi." },
    { name: "Player", text: "Oui donc voila." },
    { name: "Bubi", text: "Merci tchou" }
  ];
}
Sup.registerBehavior(BubiBehavior);
