'use strict';
/* Kapitel 10 — Frankreich 1814. Reine Daten, wie die Kapitel davor.

   ══════════════════ Die eigene Regel ══════════════════

   **Du verteidigst dein eigenes Land, und es will dich nicht mehr.**

   Das kürzeste Kampfkapitel und das dichteste. Zwei Linien laufen nebeneinander:

   1. **Militärisch das Meisterstück.** Der Sechs-Tage-Feldzug ist die
      brillanteste Leistung dieser Laufbahn, geführt mit einer Armee, die es
      kaum noch gibt: drei Schlachten in fünf Tagen, forcierte Märsche
      dazwischen, jeder Sieg ohne Reserve. Wer die Tempowahl aus 1806 gelernt
      hat, spielt sie hier im Endspiel — und diesmal kostet jede Wahl.
   2. **Menschlich die Auflösung.** Die Bauern verstecken das Korn vor der
      eigenen Armee. Die Präfekten verhandeln schon mit dem Feind. Die
      Loyalitätsfrage zieht sich durch alle Szenen: nicht *ob* du fällst,
      sondern **wofür noch**. Das Spiel beantwortet sie nie — es stellt sie nur
      jedes Mal konkreter.

   **Am Ende steht die zweite Rangschranke** (`schranke:'waterloo'`): Rang 10
   wird gebraucht, um 1815 zurückgerufen zu werden. Darunter: Halbsold-Ende,
   +120 Punkte. Ab 10: die Wahl. Der Erwartungswert des Weitermachens ist fast
   null, und das Spiel rechnet ihn nicht vor. Man geht trotzdem.

   ══════════════════ Historische Fixpunkte (Invariante 8) ══════════════════

   Brienne 29. Januar 1814 — der Ort, an dem der Kaiser zur Schule ging ·
   La Rothière 1. Februar · der Sechs-Tage-Feldzug 10.–14. Februar
   (Champaubert, Montmirail, Château-Thierry, Vauchamps) · Laon 9.–10. März ·
   Paris kapituliert am 30./31. März · Abdankung in Fontainebleau am 6. April ·
   der Abschied von der Garde am 20. April.
   Dazwischen ist alles frei erfunden. */

const KAPITEL10 = [

/* 136 */ {typ:'kampf',id:'brienne',datum:'29. Januar 1814 · Brienne',ort:'Die Schule',
  marsch:{von:'Châlons',nach:'Brienne-le-Château',weg:'60 km über gefrorene Feldwege · und der Ort steht auf keiner Karte, die jemand liest'},
  anmarschKosten:{verschleiss:0.2,atem:7,belastung:3},
  anmarsch:[
    'Dreihunderttausend Verbündete sind über den Rhein gegangen. Was ihnen entgegensteht, sind siebzigtausend Mann, verteilt auf drei Richtungen, und in der Mitte der Kaiser mit dem, was er zusammenbekommen hat.',
    'Bei Brienne steht Blücher mit dem schlesischen Korps. Der Angriff geht am Nachmittag los, gegen ein Schloss auf einer Höhe und einen Ort darunter.',
    'In diesem Schloss ist der Kaiser von zehn bis fünfzehn zur Schule gegangen, als er noch Buonaparte hieß und kein Französisch konnte. Er sagt es niemandem. Alle wissen es, und man merkt es daran, dass an diesem Abend niemand darüber redet.',
    'Es ist die erste Schlacht dieses Krieges auf französischem Boden. Die Bauern der Umgegend haben sich in den Wäldern versteckt, und zwar vor beiden Armeen.'
  ],
  lage:{gegner:'Blüchers Vorhut, dreißigtausend Mann, im Ort und im Schloss',
        auftrag:'Den Ort nehmen, ehe es dunkel ist',
        gelaende:'Ort im Tal, Schloss auf der Höhe, gefrorener Boden',
        stellung:'Erstes Treffen, am Ortseingang'},
  intro:'Zum ersten Mal seit achtzehn Jahren wird auf französischem Boden geschlagen.',
  runden:6,feindMoral:58,gefahr:10,gelaende:'mauer',
  sieg:{text:'Gegen zehn Uhr abends gehört euch der Ort, und um Mitternacht das Schloss. Blücher zieht ab; er hat in dem Zimmer geschlafen, in dem vor dreißig Jahren ein Junge aus Ajaccio geschlafen hat, und ist eine halbe Stunde zu spät aufgestanden.\\n\\nDrei Tage später, bei La Rothière, kommt er mit hunderttausend Mann zurück, und dann geht es rückwärts.',ruf:7,ruhm:true},
  niederlage:{text:'Ihr kommt bis zur Kirche und nicht weiter. Der Ort wird gegen Mitternacht von einem anderen Regiment genommen. Drei Tage später steht Blücher mit hunderttausend Mann bei La Rothière, und es geht rückwärts.',ruf:-3,belastung:10}},

/* 137 */ {typ:'szene',id:'korn_und_bauern',datum:'Anfang Februar 1814 · Ein Dorf in der Champagne',ort:'Requirieren zu Hause',
  frost:1,
  marsch:{von:'Troyes',nach:'Nach Norden, in die Champagne',weg:'50 km durch Dörfer, in denen man seine eigene Sprache spricht'},
  zwischenfall:true,
  text:[
    'Das Dorf hat vierzig Häuser und einen Bürgermeister mit Schärpe. Er kommt heraus, grüßt korrekt, und sagt, es sei nichts da.',
    'Es ist etwas da. Man sieht es an der Scheune, an den Spuren im Schnee, an der Art, wie er zwischen dir und dem Kellerloch stehen bleibt.',
    'In Spanien war das einfach: Es war ihr Korn, und es war ein fremdes Land. Hier ist es französisches Korn, es sind französische Bauern, und der Mann mit der Schärpe hat eine Urkunde an der Wand, auf der derselbe Name steht wie auf deinem Patent.',
    'Deine Leute haben seit zwei Tagen nichts gegessen. Das ist keine Redensart und keine Verhandlungsposition.'
  ],
  optionen:[
    {label:'Requirieren, wie man requiriert',hint:'Es steht dir zu, und du hast einen Zettel dafür',
     erfolg:{text:'Du lässt die Scheune öffnen, nimmst zwei Drittel und stellst eine Empfangsbestätigung aus, die auf die Staatskasse lautet und in drei Monaten nichts mehr wert ist. Der Bürgermeister nimmt sie und faltet sie sorgfältig.\\n\\nDeine Leute essen an diesem Abend. Auf dem Weg aus dem Dorf sieht dich niemand an.',
       kameradschaft:10,belastung:10}},
    {label:'Bezahlen, was du selbst hast',hint:'Es ist dein Geld, und es reicht nicht weit',
     ab:{wert:'geld',min:40,sonst:'Du hast nichts, womit du bezahlen könntest. Der Gedanke kommt trotzdem, und er kommt in den nächsten Wochen öfter.'},
     erfolg:{text:'Du zahlst aus der eigenen Tasche, in Münzen, und zwar mehr, als es wert ist. Der Bürgermeister zählt nach und sagt nichts. Deine Leute erfahren nicht, woher das Geld kam; einer errät es und behält es für sich.',
       geld:-40,kameradschaft:12,belastung:-4}},
    {label:'Weitergehen',hint:'Konstitution · zwei weitere Tage',risk:true,
     probe:{wert:'konstitution',schw:45},
     erfolg:{text:'Ihr geht weiter, ohne die Scheune zu öffnen. Zwei Tage später gibt es Brot von einem Magazin, das noch funktioniert hat. Es hat also gereicht, und du weißt bis heute nicht, ob das eine Entscheidung war oder Glück.',
       kameradschaft:6,atem:-14,belastung:8},
     misserfolg:{text:'Ihr geht weiter, und zwei Tage später gibt es immer noch nichts. Im nächsten Dorf wird nicht mehr gefragt, und du bist der, der dann nichts sagt.',
       leben:-14,atem:-16,belastung:16,kameradschaft:-6}},
    {label:'Deine Leute selbst suchen lassen',hint:'Menschenkenntnis · dann warst du es nicht',risk:true,
     probe:{wert:'menschenkenntnis',schw:45},
     erfolg:{text:'Du gehst zum Ortsrand und siehst dir die Straße an, und hinter dir wird eine Scheune geöffnet. Als du zurückkommst, ist es geschehen, und niemand hat einen Befehl gehört.\\n\\nEs ist der bequemste Weg, und er hat einen Preis, den man erst später ausgestellt bekommt.',
       kameradschaft:8,belastung:14,einheit:-6},
     misserfolg:{text:'Ohne Befehl wird aus Suchen etwas anderes. Als du zurückkommst, steht der Bürgermeister mit einer aufgeschlagenen Lippe da, und zwei deiner Leute tragen etwas, das kein Korn ist.',
       belastung:20,einheit:-12,ruf:-6,kameradschaft:-4}}
  ]},

/* 138 */ {typ:'kampf',id:'champaubert',datum:'10. Februar 1814 · Champaubert',ort:'Der erste Schlag',
  marsch:{von:'Nogent',nach:'Champaubert',weg:'70 km in zwei Tagen · durch Schlamm, in dem die Geschütze bis zur Achse stehen'},
  anmarschKosten:{verschleiss:0.2,atem:8,belastung:3},
  anmarsch:[
    'Blüchers Armee marschiert in vier getrennten Kolonnen auf Paris zu, jede einen Tagesmarsch von der nächsten. Niemand von ihnen weiß, wo die anderen stehen.',
    'Der Kaiser weiß es. Er ist die Nacht durchgeritten, hat die Armee zusammengezogen und stellt sich mitten zwischen die Kolonnen.',
    'Was jetzt kommt, ist fünf Tage lang dasselbe: Man fällt über eine Kolonne her, schlägt sie, marschiert nachts weiter und fällt am nächsten Tag über die nächste.',
    'Bei Champaubert steht ein russisches Korps von viertausend Mann, das nicht damit rechnet, dass hier überhaupt Franzosen sind.'
  ],
  lage:{gegner:'Russisches Korps, viertausend Mann, ohne Verbindung zu den Nachbarn',
        auftrag:'Die Straße sperren und die Kolonne zerschlagen',
        gelaende:'Flaches Land, Schlamm, ein Dorf an der Kreuzung',
        stellung:'Erstes Treffen, an der Kreuzung'},
  intro:'Sie wissen nicht, dass ihr hier seid. Fünf Tage lang wird das der ganze Plan sein.',
  runden:5,feindMoral:50,gefahr:9,gelaende:'damm',
  sieg:{text:'Nach vier Stunden ist das Korps nicht mehr da: zweitausend gefangen, der Rest zerstreut, der kommandierende General gefangen und ohne Degen.\\n\\nAm Abend steht auf dem Tisch eine Karte, und der Kaiser zeigt darauf, wo morgen die nächste Kolonne stehen wird. Er hat recht.',ruf:6,ruhm:true},
  niederlage:{text:'Die Kolonne kommt an euch vorbei nach Norden. Was von ihr übrig bleibt, holt zwei Tage später jemand anders ein. Der Plan funktioniert; euer Teil davon nicht.',ruf:-3,belastung:8}},

/* 139 */ {typ:'kampf',id:'montmirail',datum:'11. Februar 1814 · Montmirail',ort:'Neben der alten Garde',
  haerte:1.4,
  marsch:{von:'Champaubert',nach:'Montmirail',weg:'20 km in einer Nacht · und um neun Uhr früh steht man in Linie'},
  anmarschKosten:{verschleiss:0.15,atem:8,belastung:3},
  anmarsch:[
    'Zwanzig Kilometer in der Nacht, nach einem Gefechtstag, und um neun Uhr früh steht die Linie. Gegenüber stehen zwanzigtausend Russen und Preußen, ihr seid zehntausend.',
    'Es wird bis zum Nachmittag gewartet, weil die Garde noch nicht da ist. Die Garde kommt gegen zwei, in Marschordnung, ohne Aufenthalt, und geht ohne Halt in die Linie über.',
    'Was danach kommt, hat kein Mann dieser Armee je vergessen: sechstausend Grenadiere und Jäger der alten Garde gehen im Schritt über ein offenes Feld, im Feuer, ohne zu schießen, mit gefälltem Bajonett.',
    'Es ist das letzte Mal, dass die alte Garde das tut, und es ist das letzte Mal, dass es funktioniert.'
  ],
  lage:{gegner:'Russisch-preußische Kolonne, zwanzigtausend, in Stellung um ein Gehöft',
        auftrag:'Mit der Garde durchbrechen',
        gelaende:'Offenes Feld, ein Gehöft, dahinter die Straße nach Osten',
        stellung:'Erstes Treffen, rechts neben der Garde'},
  intro:'Das hier wird kein gewöhnliches Gefecht. Rechts von dir geht die alte Garde vor, und sie schießt nicht.',
  runden:8,feindMoral:78,gefahr:8,gelaende:'damm',
  sieg:{text:'Um sechs Uhr abends ist das Feld leer. Viertausend Gefangene, alle Geschütze, und die Straße nach Osten offen.\\n\\nDie Garde marschiert zurück in ihr Biwak, in Ordnung, ohne dass jemand ein Kommando gegeben hätte. Ein Bataillon von euch nimmt beim Vorbeimarsch von allein das Gewehr über — das ist nicht vorgeschrieben und wird auch nicht gerügt.',ruf:12,ruhm:true},
  niederlage:{text:'Euer Flügel kommt nicht über den Graben am Gehöft. Was durchbricht, ist die Garde, und die tut es allein. Am Abend ist die Straße offen und ihr steht noch da, wo ihr um zwei gestanden habt.',ruf:-4,belastung:14}},

/* Die erste Musterung von 1814, mitten im Sechs-Tage-Feldzug. Sie steht hier
   und nicht später, weil danach nichts mehr kommt, was einer Beförderung
   ähnlich sieht: Nach Laon geht es nur noch abwärts. */
{typ:'befoerderung',id:'musterung_montmirail',datum:'Februar 1814 · Zwischen zwei Märschen',ort:'Zwei Siege in zwei Tagen',
  text:[
    'Champaubert am Zehnten, Montmirail am Elften. Zwei Armeen getrennt geschlagen, von einer, die halb so groß ist wie jede von beiden. Es ist militärisch das Beste, was dieser Mann je gemacht hat, und es ändert nichts.',
    'Zwischen den Märschen wird eine Stunde gehalten. Der Chef de bataillon geht die Kompanien ab und macht dabei die Beförderungen, weil es keine andere Gelegenheit geben wird.',
    'Er hat keine Liste. Er hat die Namen im Kopf, weil es nicht mehr viele sind.'
  ],
  keinZiel:'Er geht an dir vorbei und nickt. Es gibt nichts zu vergeben, das über dem liegt, was du trägst.'},

/* 140 */ {typ:'szene',id:'dritter_marsch',datum:'12.–13. Februar 1814 · Nachts zwischen zwei Schlachten',ort:'Der dritte Marsch bei Nacht',
  frost:1,
  marsch:{von:'Montmirail',nach:'Vauchamps',weg:'Der dritte Nachtmarsch in vier Tagen'},
  tempo:{
    text:[
      'Es ist der dritte Nachtmarsch in vier Tagen, nach dem dritten Gefechtstag. Die Männer schlafen im Gehen; man erkennt es daran, dass die Kolonne alle paar hundert Meter langsamer wird und wieder aufholt, wie eine Ziehharmonika.',
      'Es gibt keine gute Wahl. Wer schont, kommt zu spät und trifft die nächste Kolonne nicht mehr allein an. Wer forciert, trifft sie an — mit Leuten, die seit neunzig Stunden nicht geschlafen haben.',
      'Der ganze Feldzug beruht darauf, schneller zu sein als vier Armeen, die zusammen fünfmal so stark sind. Es gibt keinen Plan B, weil es keine Reserve gibt.'
    ],
    ueberspringt:'quartier_montmirail',
    forciert:{hint:'ihr steht morgen früh vor ihnen, nicht neben ihnen',
      text:'Ihr geht durch. Um sechs Uhr früh steht die Kolonne an der Straße, über die Blüchers Nachhut abmarschieren will, und sie kommt eine Stunde später und weiß von nichts.',
      ruf:5},
    schonend:{text:'Ihr rastet vier Stunden. Es ist die richtige Entscheidung für die Männer und die falsche für den Feldzug, und beides ist an diesem Morgen gleichzeitig wahr.',
      atem:14,leben:10}
  },
  text:[
    'Vier Tage, drei Gefechte, drei Nachtmärsche. Es ist die Sorte Leistung, über die in vierzig Jahren in Militärschulen gesprochen wird, und sie besteht aus Männern, die im Gehen schlafen.',
    'Von deiner Kompanie sind zwei am Straßenrand geblieben, nicht verwundet, sondern eingeschlafen. Die Gendarmerie sammelt sie am Morgen ein, wenn sie noch da ist.',
    'Es wird nicht mehr gesprochen. Wenn gehalten wird, setzt sich niemand hin, weil das Aufstehen zu lange dauert.',
    'Vor euch, sagt der Adjutant, steht Blüchers Nachhut bei einem Ort namens Vauchamps.'
  ],
  optionen:[
    {label:'Deine Leute wach halten',hint:'Autorität · anstoßen, ansprechen, weitergehen',
     ab:{wert:'rang',min:3,sonst:'Du hältst dich selbst wach, indem du zählst. Bis tausend, dann von vorn.'},
     probe:{wert:'autoritaet',schw:45},
     erfolg:{text:'Du gehst die Reihe entlang und wieder zurück, die ganze Nacht, und stößt jeden an, der zu still wird. Es kostet dich das Doppelte an Weg. Am Morgen ist deine Sektion vollzählig, und das ist an diesem Morgen ungewöhnlich.',
       kameradschaft:12,einheit:10,atem:-14},
     misserfolg:{text:'Du hältst sie wach, so lange du selbst wach bist. Gegen vier Uhr merkst du, dass du seit einer Weile neben der Kolonne hergehst und nicht mehr weißt, wo dein Zug ist.',
       atem:-16,belastung:10,einheit:-4}},
    {label:'Gehen und zählen',hint:'Es ist die einzige Methode, die immer funktioniert',
     erfolg:{text:'Bis tausend, dann von vorn. Bei ungefähr dem elften Mal wird es hell. Du weißt bis heute nicht, ob du dabei geschlafen hast.',
       atem:-8,belastung:6}}
  ]},

/* 141 */ {typ:'szene',id:'quartier_montmirail',datum:'13. Februar 1814 · Ein Gehöft an der Straße',ort:'Vier Stunden',
  text:[
    'Ein Gehöft mit einer Scheune voll Stroh, vier Stunden Halt, verordnet vom Divisionsgeneral gegen den Befehl des Korps.',
    'Vier Stunden sind nicht viel. Es reicht, um die Schuhe auszuziehen, die Füße trocknen zu lassen und einmal warm zu essen, und wer das drei Tage lang nicht getan hat, weiß, was es wert ist.',
    'Der Bauer, dem das Gehöft gehört, sitzt in der Küche und sieht zu, wie sein Stroh verbraucht wird. Er sagt nichts. Als ihr abmarschiert, steht er in der Tür und sieht euch nach, und man kann nicht sagen, was er denkt.',
    'Vier Stunden später ist die Kolonne zwei Stunden hinter dem Zeitplan, und der Zeitplan ist der ganze Feldzug.'
  ],
  optionen:[
    {label:'Schlafen',hint:'Vier Stunden, zum ersten Mal seit vier Tagen',
     erfolg:{text:'Du liegst im Stroh und schläfst, bevor du liegst. Als geweckt wird, ist es, als hätte man dich weggenommen und wieder hingelegt.',
       atem:24,leben:18,belastung:-12}},
    {label:'Die Füße versorgen',hint:'Geschick · was jetzt nicht trocken wird, wird es nicht mehr',
     probe:{wert:'geschick',schw:35},
     erfolg:{text:'Schuhe aus, Lappen trocknen, Sohlen mit Fett, und dabei bei drei Leuten dasselbe. Es ist eine kleinere Sache als Schlaf und hält länger.',
       ausr:{schuhe:35},kameradschaft:8,atem:8},
     misserfolg:{text:'Die Lappen werden am Feuer nicht trocken, weil zu viele am Feuer stehen. Du ziehst sie nass wieder an, und das ist schlechter, als sie gar nicht ausgezogen zu haben.',
       ausr:{schuhe:-10},belastung:4}},
    {label:'Mit dem Bauern reden',hint:'Menschenkenntnis · er sitzt in seiner Küche und sagt nichts',
     probe:{wert:'menschenkenntnis',schw:45},
     erfolg:{text:'Er redet nach einer Weile. Er hat zwei Söhne gehabt; einer ist 1812 nicht wiedergekommen, der andere ist im Dezember eingezogen worden und liegt seither in einem Depot in Orléans. Er fragt nicht nach dem Krieg. Er fragt, ob man in Orléans genug zu essen bekommt.\\n\\nDu sagst ja. Es ist die einzige Lüge, die du in diesem Kapitel bewusst sagst.',
       belastung:8,attr:{menschenkenntnis:4}},
     misserfolg:{text:'Er sagt nichts, so lange du dasitzt, und steht auf, als du gehst. Es ist kein Schweigen aus Angst, sondern eines aus Rechnen, und das ist unangenehmer.',
       belastung:6}}
  ]},

/* 142 */ {typ:'kampf',id:'vauchamps',datum:'14. Februar 1814 · Vauchamps',ort:'Der letzte Schlag der Serie',
  marsch:{von:'Montmirail',nach:'Vauchamps',weg:'25 km ostwärts · der vierte Tag in Folge'},
  anmarschKosten:{verschleiss:0.2,atem:8,belastung:3},
  anmarsch:[
    'Der vierte Schlag in fünf Tagen. Blücher kommt mit zwanzigtausend Mann zurück, weil er glaubt, vor sich nur eine Nachhut zu haben.',
    'Er hat die Armee vor sich. Was danach kommt, dauert bis in die Nacht und endet mit einer Kolonne, die auf offener Straße von Kavallerie zusammengetrieben wird.',
    'Am Abend hat der Feldzug eine Bilanz, die niemand glauben will: In fünf Tagen sind viermal Schlachten geschlagen und viermal gewonnen worden, mit dreißigtausend gegen fünfmal so viele.',
    'Und danach ist nichts mehr da. Keine Reserve, keine Ersatzleute, kein zweiter Anlauf.'
  ],
  lage:{gegner:'Blüchers Hauptkolonne, zwanzigtausend, im Vormarsch und ohne Aufklärung',
        auftrag:'Halten, bis die Kavallerie um die Flanke herum ist',
        gelaende:'Offene Straße, Gehölze, keine Deckung für den, der weicht',
        stellung:'Erstes Treffen, quer über der Straße'},
  intro:'Der vierte in fünf Tagen. Danach ist die Reserve leer — endgültig.',
  runden:6,feindMoral:60,gefahr:9,gelaende:'damm',
  sieg:{text:'Bei Dunkelheit ist die Kolonne auf der Straße zerschlagen. Siebentausend Gefangene, und die Straße ist auf drei Kilometern so voll, dass man nicht hindurchreiten kann.\\n\\nEs ist der letzte Sieg dieser Serie und der letzte, der etwas ändert. Drei Wochen später stehen sie wieder da, mit mehr Männern als vorher, und diesmal alle zusammen.',ruf:8,ruhm:true},
  niederlage:{text:'Ihr haltet die Straße nicht, und die Kolonne kommt durch. Was von ihr die Kavallerie noch einholt, ist ein Drittel. Der Feldzug ist trotzdem gewonnen — und drei Wochen später zählt keiner dieser vier Siege mehr.',ruf:-3,belastung:12}},

/* 143 */ {typ:'befoerderung',id:'musterung_feld',datum:'Ende Februar 1814 · Im Feld bei Troyes',ort:'Musterung ohne Kaserne',
  keinZiel:'Es wird nichts mehr vergeben, was über dir läge. In dieser Armee gibt es mehr freie Stellen als Männer, und trotzdem nicht die eine — sie ist nicht frei, sie ist abgeschafft.',
  text:[
    'Gemustert wird auf einem Feld, an einem Tisch, den ein Adjutant hält. Es gibt keine Kaserne mehr, in der man mustern könnte, und keine Listen, die vollständig wären.',
    'Was hier vergeben wird, wird vergeben, weil das Offizierskorps leer ist. Brigaden werden von Obersten geführt, Bataillone von Lieutenants, Kompanien von Sergenten. Das ist keine Auszeichnung, das ist Arithmetik.',
    'Grandmaison ist seit dem Januar auf Divisionshöhe. Er sagt bei der Musterung einen Satz, den man auf zwei Arten verstehen kann, und geht weiter, bevor man nachfragen kann.'
  ]},

/* 144 */ {typ:'kampf',id:'laon',datum:'10. März 1814 · Laon',ort:'Die Stadt auf dem Berg',
  marsch:{von:'Soissons',nach:'Laon',weg:'40 km nach Norden · und die Stadt liegt hundert Meter über der Ebene'},
  anmarschKosten:{verschleiss:0.2,atem:7,belastung:3},
  anmarsch:[
    'Laon liegt auf einem Bergrücken, hundert Meter über einer flachen Ebene, und ist von drei Seiten unangreifbar. Blücher hat hunderttausend Mann darauf und darum.',
    'Ihr seid siebenunddreißigtausend. Der Angriff wird trotzdem befohlen, weil ein Rückzug in diesem Feldzug dasselbe bedeutet wie eine Niederlage: Die Verbündeten marschieren dann auf Paris, und niemand steht davor.',
    'Es ist der Punkt, an dem die Serie reißt. Man merkt es am zweiten Tag, an der Art, wie ein Angriff nicht mehr durchkommt und man ihn trotzdem wiederholt.',
    'Der Auftrag heißt hier nicht mehr siegen. Er heißt: sich geordnet lösen, ohne dass daraus eine Flucht wird.'
  ],
  lage:{gegner:'Blüchers vereinigte Armee, hunderttausend, auf einem Bergrücken',
        auftrag:'Sich geordnet lösen — die Armee erhalten, nicht die Stellung',
        gelaende:'Ebene ohne Deckung, Stadt auf hundert Meter hohem Rücken',
        stellung:'Erstes Treffen, in der Ebene'},
  intro:'Diese Schlacht ist nicht zu gewinnen. Der Auftrag ist ein anderer.',
  runden:7,feindMoral:72,gefahr:11,gelaende:'mauer',
  sieg:{text:'Ihr löst euch in der Nacht, in Ordnung, mit den Geschützen. Das ist alles, was zu erreichen war, und es ist mehr, als am Nachmittag wahrscheinlich schien.\\n\\nEin Korps auf dem rechten Flügel wird in der Nacht überrascht und verliert fünfundvierzig Geschütze. Die Armee steht am Morgen noch. Sie steht nur zwanzig Kilometer weiter südlich.',ruf:5},
  niederlage:{text:'Aus dem Lösen wird ein Zurückgehen und aus dem Zurückgehen streckenweise etwas anderes. Am Morgen sind die Geschütze weg und die Regimenter durcheinander. Es dauert zwei Tage, bis wieder gezählt werden kann.',ruf:-5,belastung:16}},

/* 145 */ {typ:'szene',id:'praefekt',datum:'März 1814 · Eine Unterpräfektur in der Aisne',ort:'Der Beamte',
  text:[
    'Der Unterpräfekt ist zweiundfünfzig, trägt den kaiserlichen Rock und bittet um eine Bedeckung für das Archiv seiner Behörde. Er ist höflich, gut vorbereitet und hat eine Liste dabei.',
    'In der obersten Schublade seines Schreibtischs liegt eine weiße Kokarde. Du siehst sie, weil er die Schublade aufzieht, um die Liste herauszunehmen, und weil er nicht darauf achtet, ob du hinsiehst.',
    'Er ist nicht verlegen. Es ist ein Mann, der ausgerechnet hat, wie das hier ausgeht, und der schon einmal in seinem Leben von einer Kokarde auf eine andere gewechselt ist. Er wird es wieder tun, und er wird sein Amt behalten, und in zwanzig Jahren wird er in derselben Behörde sitzen.',
    'Er wartet auf deine Antwort und ist dabei vollkommen ruhig.'
  ],
  optionen:[
    {label:'Die Bedeckung stellen',hint:'Das Archiv gehört dem Staat, und der Staat ist der Staat',
     erfolg:{text:'Du stellst acht Mann ab. Das Archiv kommt durch, und der Unterpräfekt bedankt sich schriftlich, mit Datum und Siegel.\\n\\nIm Juli wird dieselbe Behörde von demselben Mann geführt, unter einem anderen Wappen. Der Dank liegt dann immer noch in derselben Akte.',
       gunst:1,gunstVon:'grandmaison',belastung:6}},
    {label:'Ihn auf die Schublade ansprechen',hint:'Menschenkenntnis · er wird nicht lügen',risk:true,
     probe:{wert:'menschenkenntnis',schw:50},
     erfolg:{text:'Du sagst, was du gesehen hast. Er zieht die Schublade wieder auf, legt die Kokarde auf den Tisch und sagt, er habe seit 1789 vier Regierungen gedient und dabei jedes Mal dieselbe Präfektur verwaltet, und die Straßen seien unter allen vieren instand geblieben.\\n\\nEs ist die ehrlichste Antwort, die du in diesem Jahr bekommst, und die unangenehmste.',
       belastung:12,attr:{menschenkenntnis:5},fert:{verwaltung:4}},
     misserfolg:{text:'Er sieht dich an und fragt, ob das eine dienstliche Feststellung sei. Es ist keine, und beide wisst ihr das. Danach ist das Gespräch beendet und die Bedeckung auch.',
       belastung:10,gunst:-1,gunstVon:'grandmaison'}},
    {label:'Nichts stellen und weitermarschieren',hint:'Es gibt keine acht Mann zu entbehren',
     erfolg:{text:'Du sagst, du habest keine acht Mann. Es stimmt. Er nickt, als hätte er damit gerechnet, und trägt es in seine Liste ein — in eine Spalte, die vermutlich „verweigert" heißt.',
       belastung:4}}
  ]},

/* 146 */ {typ:'szene',id:'paris_faellt',datum:'31. März 1814 · Bei Fontainebleau',ort:'Die Nachricht',
  text:[
    'Ein Kurier kommt gegen zwei Uhr nachts an, reitet bis vor das Haus und entschuldigt sich, bevor er meldet. Es ist eine merkwürdige Sache, dass ein Mann sich für eine Nachricht entschuldigt.',
    'Paris hat kapituliert. Die Marschälle, die die Stadt hielten, haben einen Vertrag unterschrieben und ziehen ab; die Verbündeten sind am Morgen des 31. eingezogen, über die Boulevards, und es hat Leute gegeben, die zugesehen und Hüte geschwenkt haben.',
    'Ihr seid sechzig Kilometer entfernt. Ihr wart auf dem Weg und wärt in zwei Tagen dort gewesen.',
    'Die Armee steht am Morgen im Wald von Fontainebleau, sechzigtausend Mann, geschlossen, mit Geschützen, und es gibt nichts mehr, worauf sie marschieren könnte.'
  ],
  optionen:[
    {label:'Zuhören, was die Offiziere reden',hint:'Menschenkenntnis · seit gestern reden sie anders',
     probe:{wert:'menschenkenntnis',schw:45},
     erfolg:{text:'Sie reden über den Marsch auf Paris, den es geben soll, und keiner von ihnen glaubt daran. Zwei Marschälle sind seit dem Morgen nicht mehr im Lager. Was gesagt wird, ist militärisch; was gemeint ist, ist arithmetisch, und die Rechnung ist seit gestern eindeutig.',
       fert:{taktik:5},attr:{menschenkenntnis:4},belastung:8},
     misserfolg:{text:'Sie hören auf zu reden, wenn du in die Nähe kommst. Es ist das erste Mal in achtzehn Jahren, dass das passiert, und es sagt mehr als das Gespräch.',
       belastung:12}},
    {label:'Bei deinen Leuten bleiben',hint:'Sie fragen dich, und du weißt es auch nicht',
     erfolg:{text:'Sie fragen, ob es stimmt, und du sagst ja. Sie fragen, was jetzt wird, und darauf sagst du nichts, weil es nichts zu sagen gibt. Es wird an diesem Vormittag in der ganzen Armee dieselbe Frage gestellt und dieselbe Antwort nicht gegeben.',
       kameradschaft:8,belastung:6}},
    {label:'Nachrechnen, was noch da ist',hint:'Verwaltung · sechzigtausend, geschlossen, mit Geschützen',
     ab:{wert:'bildung',min:40,sonst:'Es wird gezählt, und die Zahl geht durch das Lager. Sie ist größer, als man denkt.'},
     erfolg:{text:'Sechzigtausend Mann, geschlossen, mit Artillerie, in guter Stellung. Gegen zweihunderttausend in einer Stadt, in der sie sich nicht auskennen. Es ist keine hoffnungslose Rechnung; es ist eine, bei der herauskommt, dass es noch achtzigtausend Tote kosten würde.\\n\\nDu rechnest sie zu Ende und verstehst zum ersten Mal, warum die Marschälle nicht mehr im Lager sind.',
       fert:{taktik:8,verwaltung:6},belastung:10}}
  ]},

/* 147 */ {typ:'szene',id:'fontainebleau',datum:'20. April 1814 · Fontainebleau',ort:'Der Abschied',
  text:[
    'Am 6. April hat er abgedankt, ohne Bedingungen. Am 11. ist der Vertrag unterschrieben worden: Elba, ein Titel, zwei Millionen im Jahr, vierhundert Mann Garde. Am 12. hat er in der Nacht versucht, sich zu vergiften, mit einem Gift von 1812, das nicht mehr gewirkt hat. Das erfährt man erst Jahre später.',
    'Am 20. April tritt die alte Garde im Hof des Schlosses an, im Karree, und er kommt die Treppe herunter. Es dauert vier Minuten.',
    'Er sagt, sie hätten ihm zwanzig Jahre lang gedient, er hätte weiterkämpfen können, aber es hätte den Bürgerkrieg bedeutet. Er umarmt den General, der die Fahne hält, und küsst den Adler.',
    'Die Garde weint. Sechshundert Männer, die zwanzig Jahre lang alles gesehen haben, was ein Mensch sehen kann, stehen im Karree und weinen, und das ist nicht die Sorte Satz, die man erfindet.'
  ],
  optionen:[
    {label:'Im Hof stehen und zusehen',hint:'Es kostet nichts. Es ändert nichts',
     erfolg:{text:'Du stehst hinten, wo die stehen, die nicht zur Garde gehören, und siehst zu. Es dauert vier Minuten. Danach steigt er in einen Wagen, und der Wagen fährt weg, und der Hof bleibt voll.\\n\\nNiemand geht sofort. Es dauert eine halbe Stunde, bis der Erste sich rührt.',
       belastung:12,attr:{kaltbluetigkeit:4}}},
    {label:'Nicht hingehen',hint:'Es gibt anderes zu tun, und es gibt nichts zu tun',
     erfolg:{text:'Du bleibst im Quartier und schreibst eine Liste zu Ende, die niemand mehr braucht. Vom Hof hört man nichts; er ist zu weit weg, und es wird dort ohnehin nicht laut.',
       belastung:8}},
    {label:'Nachher deine Leute entlassen, wie es sich gehört',hint:'Autorität · sie werden morgen auf Halbsold gesetzt',
     ab:{wert:'rang',min:5,sonst:'Man sagt euch, ihr sollt euch bereithalten, und niemand sagt wofür. Am nächsten Tag bekommt jeder ein Papier.'},
     probe:{wert:'autoritaet',schw:40},
     erfolg:{text:'Du lässt antreten, verliest, was zu verlesen ist, und gibst jedem sein Papier in die Hand statt es auszulegen. Es dauert eine Stunde länger und ist der einzige Unterschied, den du an diesem Tag machen kannst.\\n\\nZwei bedanken sich. Einer fragt, ob du weißt, wo er hin soll. Du weißt es nicht.',
       kameradschaft:14,belastung:6},
     misserfolg:{text:'Die Papiere liegen am Nachmittag auf einem Tisch, und wer will, holt sich seins. Am Abend ist der Tisch leer und der Hof auch.',
       kameradschaft:-6,belastung:10}}
  ]},

/* 148 */ {typ:'uebergang',id:'ende_frankreich',datum:'Mai 1814 · Irgendwo in Frankreich',ort:'Halbsold',
  schranke:'waterloo',
  text:[
    'Die Armee wird aufgelöst. Aus sechshunderttausend werden zweihunderttausend, und aus zweihunderttausend werden Papiere: Entlassungsscheine, Halbsoldlisten, Wohnorte.',
    'Der König ist zurück. Er ist neunundfünfzig, sehr dick, war dreiundzwanzig Jahre im Ausland und zählt seine Regierungsjahre ab 1795, als wäre nichts gewesen. Die weiße Kokarde ist wieder Vorschrift.',
    'Die Offiziere der kaiserlichen Armee werden auf Halbsold gesetzt. Man bekommt ein Papier, eine Zahl und eine Adresse, an die man sich vierteljährlich zu wenden hat.',
    'Es ist Mai, es ist Frieden, und es ist zum ersten Mal seit achtzehn Jahren nicht die Frage, wohin marschiert wird, sondern wohin man geht.'
  ],
  ausblick:'Am 1. März 1815 landet ein Mann mit siebenhundert Grenadieren bei Golfe-Juan. Zwanzig Tage später ist er in Paris, ohne dass ein Schuss gefallen wäre. Wer 1814 auf Halbsold gesetzt worden ist, bekommt in diesen Wochen einen Brief.'}
];

/* Anmeldung: an das laufende Band anhängen und beim Verlauf eintragen.
   `.slice()` ist Pflicht, nicht Kosmetik — siehe die Warnung in Kapitel 1. */
KAPITEL.push(...KAPITEL10);
STATIONEN.frankreich = KAPITEL10.slice();
(KAMPAGNEN.find(k=>k.id==='frankreich')||{}).gebaut = true;
