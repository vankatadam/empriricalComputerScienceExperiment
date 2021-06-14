var fs = require("fs");
var parse = require("csv-parse");
var seedrandom = require("seedrandom");
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");

//seeds the outcome
seedrandom("seed4", { global: true });

const einleitungHTMLAuto = `In der ersten Aufgabe werden Sie die Funktion Autocomplete verwenden dürfen.
                    Um sich mit dieser Funktion bekannt zu machen, gehen Sie bitte das folgende Einleitungsscenario durch:
                    Autocomplete bietet Ihnen die Möglichkeit, durch Vorschläge ihre Wörter zu vervollständigen.
                    Diese Funktion wird automatisch aufgerufen, während sie in diesem Code Editor tippen.
                    Versuchen Sie folgendes: schreiben sie ein "<se" in eine leere Zeile (Bitte wählen Sie eine komplett leere Zeile) 
                    unter diese Einleitung. Nachdem Sie "<se" geschrieben haben, taucht dadrunter ein Dialogfenster auf.
                    In diesem Dialogfenster sehen sie eine Reihe an Vorschlägen, die Ihnen von Autocomplete funktion vorgeschlagen werden.
                    Sie können eine dieser Möglichkleiten mit den Pfeilen nach oben und unten wählen und anschließend die "Tab Taste" drücken.
                    (Die Taste direk neben Q mit meistens draufgedrückten zwei Pfeilen nach links und rechts) Wenn sie nichts ausplizit auswählen 
                    und die "Tab Taste" drücken, wird automatisch die erste Option gewählt. Sagen wir, dass Sie die erste Option gewählt haben, 
                    (die Option "section") und die "Tab Taste" gedrückt haben und anschließend ">". Somit wird automatisch </section> für sie generiert, ohne, dass sie die
                    zusätzliche Zeichen abtippen müssen. Um dies zu trainieren, versuchen sie Folgende paar Zeilen mit hilfe dieser Funktion abzutippen:
                    <h1></h1>
                    <p></p>
                    <div></div>
                    <h2></h2>
                    <nav></nav>
                    <h3></h3>
                    <style></style>
                    <script></script>
                    <summary></summary>
                    <template></template>
                    <h5></h5>

                    Hier die Zeile dadrunter bitte die Einleitung versuchen:`;

const einleitungHTMLnoAuto = `Diese Aufgabe ist gleich wie die vorherige Aufgabe. Also Text abtippen und Zeit messen. Nur diesmal tuen sie 
                    dies ohne Autocomplete Funktion, indem sie die Datei in einem gängingen Editor ohne diese Funktion aufrufen.`;

//read tags etc. and write to files
fs.readFile("allHtmlTags.csv", function (err, fileData) {
  //reading out the html tags
  parse(
    fileData,
    { columns: false, trim: true },
    function (err, htmlTagsArray) {
      //generate task 1 (HTML)
      fs.writeFile(
        "task.html",
        generateHTMLTask(einleitungHTMLAuto, htmlTagsArray, true),
        () => {
          console.log("task.html generated");
        }
      );
      fs.writeFile(
        "task.txt",
        generateHTMLTask(einleitungHTMLnoAuto, htmlTagsArray, false),
        () => {
          console.log("task.txt generated");
        }
      );
    }
  );
});

//returning generated task
const generateHTMLTask = (einleitung, htmlTags, autocomplete) => {
  let unteraufgaben = "";
  const tasksCount = 30;
  for (let index = 1; index <= tasksCount; index++) {
    const tag = htmlTags[Math.floor(Math.random() * htmlTags.length)];
    unteraufgaben = unteraufgaben.concat(`<!--Unteraufgabe ${index}: ${tag} -->
    
    `);

    //Each 10 tasks, stop time and go to other block
    let newBlock = "";
    if (index % 5 === 0) {
      // let tasktype = "task.txt";
      // if (autocomplete) {
      //   tasktype = "task.html";
      // }

      const blockNumber = index / 5;
      let blockBegginning = `
  <!-- Anfang Block ${blockNumber + 1} -->
      `;
      if (index === tasksCount) {
        blockBegginning = "";
        if (autocomplete) {
          blockBegginning = `
    <!-- Wechseln Sie jetzt bitte zu task.txt und arbeiten sie die Aufgaben da ab -->      
          `;
        }
      }
      let fileChange = "";
      //if User should change tasks, than uncomment this:
      // fileChange = `Gehen sie in die Datei ${tasktype} und arbeiten Sie auch 5 Aufgaben ab. Danach wieder umgekehrt, bis Sie mit den Aufgaben fertig sind.`
      newBlock = `<!-- Ende Block ${blockNumber}. Bitte ZEIT STOPPEN, AUFSCHREIBEN und Zeitmessung wieder auf 0 setzen. ${fileChange}-->
    ${blockBegginning}
    `;
      unteraufgaben = unteraufgaben.concat(newBlock);
    }
  }

  var fakedNames = "";
  for (var i = 0; i < htmlTags.length; i++) {
    fakedNames = fakedNames.concat(htmlTags[i] + " ");
    fakedNames = fakedNames.concat(htmlTags[i] + "a ");
    // task = task.concat("a" + htmlTags[i] + " ");
    // task = task.concat("b" + htmlTags[i] + " ");
  }

  var task = `
    <!--Wilkommen im Experiment. Dies ist Ihre erste Aufgabe. In dieser Aufgabe wird die Zeit gemesse, die Sie zum Abtippen von folgenden Code benötigen. -->
    <!--Einleitung: ${einleitung} -->
    

    <!--Im folgenden Teil sollten Sie den aufgeführten Text der Unteraufgaben abtippen. Tippen Sie den Text bitte direkt die Unteraufgaben und schließen Sie die 
    Text Blöcke, wie in der Einleitung bereits gelernt, ab: Wenn in einer Unteraufgabe beispielsweise ein <section> steht, dann geben sie <section></section> ein. (Also einmal mit </section> 
    Textblock abschließen) Ignorieren sie die Zeichen "< !-- -- >".-->

    <!-- Starten Sie bitte die Zeitmessung, erst wenn Sie anfangen die Aufgaben zu bearbeiten. Nach 5 Aufgaben stoppen Sie die Zeit und schreiben Sie diese auf.
         Anullieren Sie die Zeitmessung und starten sie die Zeitmessung, wenn sie sich bereit fühlen, mit dem nächsten Block anzufangen-->

      ${fakedNames}

    ${unteraufgaben}
    `;

  return task;
};
