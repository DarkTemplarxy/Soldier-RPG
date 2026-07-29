'use strict';
/* Kapitel 8 — Russland 1812. Reine Daten, wie die Kapitel davor.

   ══════════════════ Die eigene Regel ══════════════════

   **Das ist kein Feldzug. Das ist ein Vorrat, der kleiner wird.**

   Alles an diesem Kapitel ist eine Abwärtskurve. Die Kampagne trägt
   `verschleiss:2` und `ersatz:false`: Ausrüstung nutzt sich doppelt ab und
   wird **nicht ersetzt** — der Marketender hat nichts, die Magazine sind leer,
   was kaputt ist, bleibt kaputt. Der Hinweg kostet durch Hitze, Staub und
   Ruhr; der Rückweg kostet durch alles.

   **Hier sterben die meisten Charaktere, und zwar nicht im Gefecht.** Der
   Frost aus Kapitel 6 kommt wieder, aber in Stufen: `frost:2` auf dem Hinweg
   im November, `frost:3` ab Krasnoi, `frost:4` an der Beresina. Ohne Mantel
   ist das eine zehrende Wunde, die an jeder Station weiterfrisst.

   **Die vier Gefechte liegen deshalb nicht über der Decke, sondern darunter**
   — Smolensk 20, Krasnoi 20, Borodino und die Beresina auf den 22, die kein
   Gefecht überschreitet, wenn es nicht selbst die Regel seines Kapitels ist
   (CLAUDE.md, „Die 22"). Die erste Fassung stand bei 23, 27, 28 und **29**,
   und das war der falsche Ort: Russland ist nicht das Kapitel, in dem am
   besten geschossen wird, sondern das, in dem der Vorrat nicht zurückkommt.
   **Borodino trägt seine Härte in der Länge** — zehn Runden gegen Feindmoral
   95, das längste und zäheste Gefecht des Spiels. Ein Tag, der nicht aufhört,
   ist die richtige Übersetzung für den blutigsten Tag des Jahrhunderts; eine
   erhöhte Trefferchance wäre nur eine größere Zahl gewesen.

   **Und am Ende steht die erste Rangschranke** (`schranke:'russland'`,
   RANGLEITER §9): Wer lebt und unter Rang 7 ist, wird ausgemustert — Ruhestand,
   +180 Punkte, und der Abschlusstext, der dazu gehört. Wer Rang 7 oder höher
   trägt, wählt: weiter oder freiwillig gehen. **Damit fällt der Platzhalter 25
   in `wertung()`** und wird durch die gestaffelten 180/120/70 aus KONZEPT §5
   ersetzt.

   ══════════════════ Historische Fixpunkte (Invariante 8) ══════════════════

   Njemen-Übergang 24. Juni 1812, drei Tage lang über drei Brücken · Smolensk
   17. August · Borodino 7. September, der blutigste Tag des Jahrhunderts ·
   Einzug in Moskau 14. September, der Brand ab dem 15. · Abmarsch 19. Oktober ·
   Krasnoi 15.–18. November · **die Beresina 26.–29. November** · die Reste
   erreichen den Njemen Mitte Dezember.
   Dazwischen ist alles frei erfunden. */

const KAPITEL8 = [

/* 109 */ {typ:'szene',id:'njemen',datum:'24. Juni 1812 · Am Njemen',ort:'Drei Brücken, drei Tage',
  marsch:{von:'Sammelraum in Polen',nach:'Über den Njemen',weg:'Die größte Armee, die Europa je gesehen hat, geht über einen Fluss von hundert Metern Breite'},
  text:[
    'Es dauert drei Tage, bis alle drüben sind. Man steht am Hang und sieht zu, wie unten eine Kolonne über die Brücke geht, die kein Ende hat, und wenn man abends wiederkommt, geht sie immer noch.',
    'Vierhunderttausend Mann in der ersten Staffel, zweihunderttausend in der zweiten. Zwanzig Nationen, elf Sprachen im Kommando, hundertfünfzigtausend Pferde. In den Trains stehen Wagen mit Vorräten für vierundzwanzig Tage, weil der Feldzug drei Wochen dauern soll.',
    'Man ist stolz. Es ist unmöglich, das nicht zu sein, wenn man in so etwas steht.',
    'Auf der anderen Seite ist niemand. Kein Posten, keine Feldwache, keine Schlacht. Die russische Armee ist zurückgegangen, bevor ihr da wart, und das wird sie die nächsten drei Monate tun.'
  ],
  optionen:[
    {label:'Die Zahl aufschreiben',hint:'Verwaltung · irgendwann wird man sie brauchen',
     ab:{wert:'bildung',min:35,sonst:'Es wird eine Zahl genannt, und man merkt sie sich oder nicht. Du merkst sie dir.'},
     erfolg:{text:'Du schreibst sie auf ein Blatt, das du hinten in den Tornister legst: vierhunderttausend. Es ist die Art von Zahl, die man aufschreibt, weil man sie sonst nicht glaubt.\\n\\nIn sechs Monaten wirst du dasselbe Blatt herausnehmen und eine zweite Zahl darunterschreiben.',
       fert:{verwaltung:5},attr:{bildung:3}}},
    {label:'Zusehen, solange es dauert',hint:'Es dauert drei Tage',
     erfolg:{text:'Du siehst zu, wie eine Armee über einen Fluss geht. Zwischen den Kolonnen fahren Wagen mit Kanzleien, mit Feldschmieden, mit einer Druckerpresse. Es ist die vollständigste Sache, die du je gesehen hast, und du wirst dich in einem Jahr an genau diesen Nachmittag erinnern.',
       belastung:-8,kameradschaft:6}},
    {label:'Nachsehen, was in den Wagen steht',hint:'Fouragieren · vierundzwanzig Tage für drei Wochen Krieg',
     probe:{wert:'fouragieren',schw:40},
     erfolg:{text:'Mehl, Reis, Zwieback, Branntwein, und eine Rechnung, die jeder anstellen kann, der zählen kann: vierundzwanzig Tage. Danach muss das Land liefern. Du siehst dir das Land an und packst zwei Pfund Zwieback extra ein, die dir nicht zustehen.',
       fert:{fouragieren:6},belastung:4}}
  ]},

/* 110 */ {typ:'szene',id:'marsch_ohne_feind',datum:'Juli 1812 · Zwischen Wilna und Witebsk',ort:'Der Marsch, der nichts findet',
  marsch:{von:'Wilna',nach:'Richtung Witebsk',weg:'400 km ostwärts · vierunddreißig Grad, Staub, und alle vier Tage ein Dorf'},
  zwischenfall:true,
  tempo:{
    text:[
      'Die russische Armee weicht aus. Sie stellt sich nicht, sie brennt hinter sich ab, was sie nicht mitnehmen kann, und geht weiter nach Osten. Wer sie stellen will, muss schneller sein.',
      'Schneller sein heißt hier: bei vierunddreißig Grad, in Staub, in dem man den Vordermann nicht sieht, mit Wasser aus Tümpeln, an denen schon zehntausend andere getrunken haben.',
      'In den ersten sechs Wochen dieses Feldzugs verliert die Armee ohne ein einziges Gefecht hunderttausend Mann. Es steht in keinem Bericht, weil niemand sie zählt.'
    ],
    ueberspringt:'rastplatz',
    forciert:{hint:'die Nachhut ist zum Greifen nah, sagt man',
      text:'Vierzig Kilometer am Tag, sechs Tage. Am siebten steht ihr auf einer Anhöhe und seht Staub, und der Staub ist die russische Nachhut, und sie ist zwei Stunden entfernt. Am nächsten Morgen ist sie vier Stunden entfernt.',
      ruf:3},
    schonend:{text:'Ihr geht das Tempo, bei dem die Leute abends noch stehen. Die Kolonne vor euch geht schneller und lässt dabei zweihundert Mann am Straßenrand. Ihr sammelt achtzig davon auf.',
      kameradschaft:8}
  },
  text:[
    'Es gibt keinen Feind. Es gibt eine Straße, Staub, der in den Augen steht, und Hitze, in der man nach drei Stunden nicht mehr schwitzt.',
    'Die Dörfer sind leer und abgebrannt. Was nicht abgebrannt ist, ist ausgeräumt — nicht von euch, sondern von denen, die vor euch durchgezogen sind, und das waren ihre eigenen Leute.',
    'Die Ruhr geht um. Sie geht nicht um wie in Ägypten, wo es Namen gab und einen Feldscher; sie geht um wie ein Wetter. Wer sie hat, geht weiter, bis er nicht mehr geht.',
    'Was hier verschleißt, wird nicht ersetzt. Es gibt keinen Marketender mehr, kein Magazin und keinen Schuster. Was kaputt ist, bleibt kaputt.'
  ],
  optionen:[
    {label:'Wasser suchen, das nicht steht',hint:'Fouragieren · davon hängt mehr ab als vom Brot',
     probe:{wert:'fouragieren',schw:45},
     erfolg:{text:'Zweihundert Schritt abseits der Straße gibt es eine Quelle unter einem Stein, an der noch niemand war. Du füllst sechs Feldflaschen und sagst es fünf Leuten und nicht mehr. Von den fünfen bekommt in den nächsten Wochen keiner die Ruhr.',
       kameradschaft:10,atem:6},
     misserfolg:{text:'Du trinkst, was alle trinken, aus einem Tümpel, in dem seit gestern ein Pferd liegt. In vier Tagen weißt du, ob du Glück hattest.',
       wunde:'Ruhr',zehrt:4,belastung:8}},
    {label:'Marschieren und an nichts denken',hint:'Konstitution · vierhundert Kilometer ohne Gegner',
     probe:{wert:'konstitution',schw:45},
     erfolg:{text:'Man geht. Es gibt keinen Feind, keine Entscheidung und nichts zu sehen, und das ist die Art von Marsch, an der Männer zugrunde gehen, ohne dass jemand geschossen hätte.',
       atem:-10,belastung:6},
     misserfolg:{text:'In der dritten Woche wird dir schwarz vor Augen, und du kommst auf einem Wagen zu dir, zwischen zweien, die nicht mehr aufwachen. Am nächsten Tag gehst du wieder.',
       leben:-16,atem:-14,belastung:10}},
    {label:'Gehen und nichts weiter',hint:'Es gibt nichts zu holen und nichts zu entscheiden',
     erfolg:{text:'Ein Fuß vor den anderen, sechs Wochen lang, ostwärts. Der Krieg besteht bisher aus Staub.',
       belastung:4,atem:-4}}
  ]},

/* 111 */ {typ:'szene',id:'rastplatz',datum:'August 1812 · Ein Gut an der Straße',ort:'Zwei Tage an einem Fluss',
  zwischenfall:true,
  text:[
    'Ein Gutshof mit einem Teich, den die Vorhut nicht abgebrannt hat, weil sie zu schnell durch war. Zwei Tage Rast, verordnet, weil die Kolonne sonst auseinanderfällt.',
    'Es gibt Wasser, das man trinken kann, Schatten und Zeit, die Schuhe zu flicken. Es ist das letzte Mal in diesem Feldzug, dass es alle drei gleichzeitig gibt.',
    'Der Regimentsschuster hat kein Leder mehr. Er hat Draht, Pech und die Schuhe von denen, die auf dem Weg geblieben sind, und daraus macht er, was zu machen ist.',
    'Wer diese zwei Tage nutzt, geht anders nach Smolensk als der, der schneller da war.'
  ],
  optionen:[
    {label:'Alles herrichten, was du hast',hint:'Geschick · danach gibt es nichts mehr',
     probe:{wert:'geschick',schw:35},
     erfolg:{text:'Sohlen doppelt, Riemen neu, Schloss zerlegt und trocken gelegt, den Tornister an zwei Stellen genäht. Es dauert einen ganzen Tag. Es ist die beste Arbeit, die du in diesem Jahr machst, und du wirst im Dezember wissen, warum.',
       ausr:{schuhe:45,muskete:35,tornister:30}},
     misserfolg:{text:'Du machst, was du kannst, und was du kannst, reicht bei diesem Material nicht. Die linke Sohle hält bis Moskau. Wahrscheinlich.',
       ausr:{schuhe:15,muskete:10}}},
    {label:'Schlafen und liegen bleiben',hint:'Zwei Tage im Schatten',
     erfolg:{text:'Zwei Tage. Du schläfst zwölf Stunden am Stück, wäschst dich im Teich und isst zweimal warm. Es ist wenig, und es ist mehr als alles, was in den nächsten vier Monaten kommt.',
       leben:22,atem:20,belastung:-14}},
    {label:'Für die Kompanie vorsorgen',hint:'Fouragieren · was jetzt nicht eingepackt wird, fehlt im Oktober',
     probe:{wert:'fouragieren',schw:40},
     erfolg:{text:'Du lässt trocknen, was sich trocknen lässt, und packst es in Säcke, die auf den Kompaniewagen gehen. Zwieback, Rüben, ein halber Sack Salz. Im Oktober wird das drei Tage lang der Unterschied sein.',
       kameradschaft:12,geld:-8},
     misserfolg:{text:'Was du findest, findet auch der Fourier des Nachbarbataillons, und der hat einen Wagen und du nicht.',
       belastung:4}}
  ]},

/* 112 */ {typ:'kampf',id:'smolensk',datum:'17. August 1812 · Smolensk',ort:'Die brennende Stadt',
  frost:0,
  marsch:{von:'Straße von Krasnoi',nach:'Vor die Mauern von Smolensk',weg:'40 km · und dahinter steht zum ersten Mal jemand'},
  anmarschKosten:{verschleiss:0.25,atem:7,belastung:2},
  anmarsch:[
    'Zum ersten Mal seit acht Wochen bleibt jemand stehen. Smolensk hat eine Mauer aus dem sechzehnten Jahrhundert, fünf Meter dick, und dahinter steht ein russisches Korps, das den Auftrag hat zu halten, bis die Hauptarmee weg ist.',
    'Der Angriff geht am Nachmittag los, gegen Vorstädte aus Holz. Die Vorstädte brennen, bevor ihr darin seid, und dann brennt die Stadt.',
    'Es gibt keinen Sturm auf die Mauer. Es gibt ein Artillerieduell, ein Feuer, das sich selbst nährt, und eine Nacht, in der man dreihundert Meter weit lesen könnte.',
    'Am Morgen ist die Stadt leer. Sie sind abgezogen, wie sie immer abziehen, und was zurückbleibt, ist Asche und dreitausend Verwundete in einer Kathedrale.'
  ],
  lage:{gegner:'Russisches Korps hinter einer fünf Meter dicken Mauer',
        auftrag:'Die Vorstädte nehmen und die Mauer erreichen',
        gelaende:'Holzhäuser, die brennen · dahinter Mauer und Graben',
        stellung:'Erstes Treffen, rechte Vorstadt'},
  intro:'Zum ersten Mal seit dem Njemen steht jemand. Er steht, damit die anderen wegkommen.',
  runden:7,feindMoral:66,gefahr:10,gelaende:'mauer',
  sieg:{text:'Am Morgen des 18. gehört euch eine Stadt, die es nicht mehr gibt. In der Kathedrale liegen dreitausend Verwundete beider Seiten, und in den Straßen liegt, was von einer Stadt aus Holz übrig ist, wenn sie zwei Tage gebrannt hat.\\n\\nDie russische Armee ist weg. Sie ist nach Osten gegangen, in der Nacht, in Ordnung, und niemand hat sie aufgehalten.',ruf:7,ruhm:true},
  niederlage:{text:'Ihr kommt nicht durch die brennende Vorstadt und liegt bis Mitternacht in einem Garten, in dem es zu heiß ist zum Atmen. Am Morgen ist die Stadt trotzdem leer, weil sie in der Nacht abgezogen sind.',ruf:-3,belastung:12}},

/* 113 */ {typ:'lager',id:'lager_moskaustrasse',datum:'Ende August 1812 · An der Straße nach Moskau',ort:'Das letzte volle Lager',
  abende:2,
  tun:['exerzieren','instand','waffe','ruhe','leute','fouragieren'],
  rangTun:{5:['sektion'],7:['fechtboden','zugfuehren','karten'],9:['kasse_ganz','kasse_ueblich','kasse_voll']},
  text:[
    'Zwei Abende an der Straße nach Moskau, dreihundert Kilometer vor der Stadt. Es ist das letzte Lager, in dem es noch etwas gibt — und man merkt es daran, was fehlt: kein Schuster, kein Marketender, keine Ausgabe.',
    'Von den vierhunderttausend, die im Juni über den Njemen gingen, marschieren auf dieser Straße noch hundertdreißigtausend. Der Rest steht auf Etappen, liegt in Lazaretten oder ist weg, und geschossen worden ist erst einmal.',
    'Es heißt, sie hätten einen neuen Oberbefehlshaber, und der werde sich stellen. Sein Name wird verschieden ausgesprochen und beim dritten Mal richtig: Kutusow.',
    'Zwei Abende. Was jetzt nicht instand gesetzt wird, geht so nach Moskau und so wieder zurück.'
  ]},

/* 114 */ {typ:'kampf',id:'borodino',datum:'7. September 1812 · Borodino',ort:'Die Mühle',
  haerte:1.4,
  marsch:{von:'Lager bei Gschatsk',nach:'Das Feld von Borodino',weg:'50 km · und diesmal gehen sie nicht weg'},
  anmarschKosten:{verschleiss:0.2,atem:8,belastung:3},
  anmarsch:[
    'Sie stehen. Zum ersten Mal seit dem Njemen steht eine russische Armee auf einem Feld und geht nicht weg — hundertzwanzigtausend Mann, eingegraben, mit sechshundert Geschützen, quer über eine Front von acht Kilometern.',
    'Der Angriff beginnt um halb sechs mit einhundertzwei Geschützen. Bis zum Abend werden auf beiden Seiten hunderttausend Schuss gefallen sein.',
    'Es gibt keinen Plan, der etwas anderes vorsieht als: von vorn. Die Schanzen in der Mitte werden siebenmal genommen und sechsmal wieder verloren.',
    'Hier gibt es keine Sondermission und keinen Augenblick, für den man berühmt wird. Es gibt eine Mühle, in die man hineingeht, und man kommt heraus oder nicht.'
  ],
  lage:{gegner:'Kutusows Armee, hundertzwanzigtausend Mann, sechshundert Geschütze, eingegraben',
        auftrag:'Die große Schanze nehmen — und dann noch einmal',
        gelaende:'Offenes Feld, Erdwerke, acht Kilometer Front, kein Flügel offen',
        stellung:'Erstes Treffen, vor der großen Schanze'},
  intro:'Das hier wird kein gewöhnliches Gefecht. Es ist auch keine Bühne — nur eine Mühle, und das ist die Aussage.',
  runden:10,feindMoral:95,gefahr:9,gelaende:'mauer',
  sieg:{text:'Um vier Uhr nachmittags gehört euch die große Schanze. Um sechs hört es auf, weil auf beiden Seiten niemand mehr angreifen kann.\\n\\nAuf dem Feld liegen fünfundzwanzigtausend Franzosen und vierzigtausend Russen. Die russische Armee zieht in der Nacht ab, in Ordnung, wie immer. Der Weg nach Moskau ist frei, und es ist der teuerste Weg, den je jemand gekauft hat.',ruf:14,ruhm:true},
  niederlage:{text:'Ihr kommt bis an den Graben der Schanze und liegt dort, bis eine andere Division es zu Ende bringt. Am Abend ist das Feld gewonnen. Es liegen fünfundzwanzigtausend Franzosen darauf, und die russische Armee zieht in Ordnung ab.',ruf:-4,belastung:16}},

/* 115 */ {typ:'szene',id:'moskau',datum:'14.–18. September 1812 · Moskau',ort:'Die leere Stadt und der Brand',
  text:[
    'Von den Sperlingsbergen sieht man eine Stadt mit zweihundert Kirchtürmen und vergoldeten Kuppeln. Die Kolonne hält an, und dreißigtausend Mann sagen gleichzeitig nichts.',
    'Dann geht man hinein, und die Stadt ist leer. Nicht verlassen — leer: dreihunderttausend Einwohner sind weg, in vier Tagen, und zurückgeblieben sind ein paar tausend, die nicht wegkonnten, und die Insassen der Gefängnisse, die man geöffnet hat.',
    'In der Nacht zum 15. brennt es an drei Stellen. Am 16. brennt es überall. Die Feuerspritzen sind vor dem Abzug aus der Stadt gefahren worden; das ist keine Vermutung, man findet die Depots leer.',
    'Vier Tage später sind drei Viertel von Moskau Asche. Was übrig ist, reicht als Quartier für eine Armee, die hier den Winter verbringen soll, und der Winter fängt in acht Wochen an.'
  ],
  optionen:[
    {label:'Löschen helfen, solange es geht',hint:'Konstitution · ohne Spritzen, mit Eimern',risk:true,
     probe:{wert:'konstitution',schw:45},
     erfolg:{text:'Eine Kette von der Moskwa zu einem Häuserblock, sechs Stunden, und der Block steht am Morgen noch. Es sind vier Straßen von zwölftausend. Es ist trotzdem der Grund, warum zweihundert Mann deines Bataillons ein Dach über dem Kopf haben.',
       ruf:4,kameradschaft:12,atem:-16,belastung:8},
     misserfolg:{text:'Der Wind dreht, und die Straße, in der ihr steht, brennt von beiden Seiten. Ihr kommt heraus. Zwei kommen nicht heraus, und einer davon war deiner.',
       leben:-22,belastung:16,kameradschaft:-6,wunde:'Verbrennungen am Arm'}},
    {label:'Nehmen, was zu nehmen ist',hint:'Es brennt ohnehin ab — aber Tragen kostet ab hier Leben',risk:true,
     erfolg:{text:'Silberbesteck, ein Pelzmantel, ein Kelch aus einer Kirche, dazu Geld, das in einem Schrank lag. Es ist mehr wert als dein Sold von zehn Jahren.\\n\\nEs wiegt dreißig Pfund. Auf dem Rückweg wirst du an jedem einzelnen Tag darüber nachdenken, und das Pfund, das du dann wegwirfst, ist nie das erste.',
       geld:120,belastung:10,setzt:{beute:true}}},
    {label:'Einen Mantel und Vorräte suchen, sonst nichts',hint:'Fouragieren · das Nützliche, nicht das Wertvolle',
     probe:{wert:'fouragieren',schw:40},
     erfolg:{text:'Ein Pelzmantel aus einem Kleiderschrank, zwei Paar Filzstiefel, Zucker, Tee, ein Sack Mehl. Nichts davon ist etwas wert; alles davon ist im Dezember mehr wert als der Kelch, den ein anderer trägt.',
       ausruestung:{mantel:{name:'Moskauer Pelzmantel',zustand:85,verschleiss:8}},
       ausr:{schuhe:35},kameradschaft:6},
     misserfolg:{text:'Die Häuser, in denen so etwas läge, brennen seit zwei Tagen. Du findest einen Teppich, den du nicht brauchst, und lässt ihn liegen.',
       belastung:6}}
  ]},

/* 116 */ {typ:'befoerderung',id:'musterung_moskau',datum:'Oktober 1812 · Moskau',ort:'Die letzte Musterung im Vorwärtsgang',
  keinZiel:'Es wird nichts vergeben, was über dir läge. Wer hier eine Stelle bekommt, bekommt sie, weil einer bei Borodino geblieben ist — und über dir ist niemand geblieben.',
  text:[
    'Fünf Wochen in einer ausgebrannten Stadt. Es wird gemustert, weil es Vorschrift ist, und es werden Stellen besetzt, die bei Borodino frei geworden sind. Es sind viele.',
    'Der Kaiser wartet auf eine Antwort aus Petersburg. Es kommt keine. Sie kommt auch in der zweiten und dritten Woche nicht, und in der fünften begreift man, dass gar keine kommen wird.',
    'Nachts ist es schon unter null. Die Pferde bekommen kein Futter mehr; man treibt sie auf abgeerntete Felder, dreißig Kilometer weit, und die Hälfte kommt nicht zurück.',
    'Am 19. Oktober wird abmarschiert. Es heißt, man gehe in Winterquartiere nach Smolensk.'
  ]},

/* 117 */ {typ:'szene',id:'abmarsch',datum:'19. Oktober 1812 · Aus Moskau heraus',ort:'Was du trägst',
  marsch:{von:'Moskau',nach:'Nach Westen, auf der Straße, auf der ihr gekommen seid',weg:'Die Kolonne ist vierzig Kilometer lang, und die Hälfte davon sind Wagen mit Beute'},
  zwischenfall:true,
  text:[
    'Die Armee, die aus Moskau herausmarschiert, ist kein Heer, sondern ein Umzug. Hinter hunderttausend Soldaten fahren vierzigtausend Wagen mit allem, was aus einer Millionenstadt mitgenommen werden konnte, dazu Kutschen mit Schauspielerinnen und ein Wagen mit dem vergoldeten Kreuz vom Turm Iwans des Großen.',
    'Der Weg nach Süden, durch unverwüstetes Land, wird nach zwei Tagen aufgegeben: Bei Malojaroslawez steht die russische Armee quer. Also zurück auf die Straße, auf der ihr gekommen seid — dieselbe Straße, dieselben abgebrannten Dörfer, und jetzt ohne Vorräte.',
    'Es sind achthundert Kilometer bis Smolensk. Es ist Ende Oktober.',
    'Was du trägst, trägst du selbst. Wagen gibt es genug, aber sie stehen alle schon voll, und nach der ersten Woche steht keiner mehr.'
  ],
  optionen:[
    {label:'Alles wegwerfen, was nicht wärmt oder satt macht',hint:'Es ist die vernünftigste Entscheidung, die du je triffst',
     erfolg:{text:'Du gehst deinen Tornister durch und lässt liegen, was du in Moskau eingepackt hast — bis auf den Mantel, die Stiefel und das Essen. Zwei Leute sehen zu und lachen. In vier Wochen lebt einer von den beiden noch.',
       belastung:-8,atem:10,setzt:{beute:false}}},
    {label:'Es tragen, solange es geht',hint:'Dreißig Pfund, achthundert Kilometer',risk:true,
     ab:{wert:'beute',min:1,sonst:'Du hast nichts zu tragen, was du nicht brauchst. Das ist an diesem Morgen kein Trost und in vier Wochen einer.'},
     erfolg:{text:'Du trägst es. Zwölf Kilometer am Tag mit dreißig Pfund mehr, als du müsstest, durch Schneematsch, und jeden Abend rechnest du dir aus, was es wert ist.\\n\\nIrgendwo hinter Wjasma lässt du es fallen. Nicht in einer Entscheidung — du merkst nur abends, dass es weg ist, und gehst nicht zurück.',
       leben:-18,belastung:14,atem:-12,geld:40}},
    {label:'Deinen Leuten sagen, was sie wegwerfen sollen',hint:'Autorität · sie werden es nicht tun',
     ab:{wert:'rang',min:5,sonst:'Was die anderen tragen, ist ihre Sache. Du hast genug damit zu tun, deins zu tragen.'},
     probe:{wert:'autoritaet',schw:50},
     erfolg:{text:'Du lässt antreten und die Tornister ausleeren, auf der Straße, vor allen. Es wird geflucht. Vier Wochen später hat deine Sektion die geringsten Ausfälle des Bataillons, und dann flucht keiner mehr.',
       kameradschaft:-8,einheit:15,gunst:1,gunstVon:'vernet'},
     misserfolg:{text:'Sie sagen ja und packen es wieder ein, sobald du weg bist. Es ist nicht Ungehorsam; es ist der Gedanke, dass man mit so viel Geld zu Hause ein Haus kaufen könnte, und gegen diesen Gedanken kommt keine Autorität an.',
       kameradschaft:-4,einheit:-5,belastung:6}}
  ]},

/* 118 */ {typ:'szene',id:'erster_schnee',datum:'6. November 1812 · Zwischen Wjasma und Smolensk',ort:'Der erste Schnee',
  frost:3,
  marsch:{von:'Wjasma',nach:'Smolensk',weg:'250 km · und am 6. November fängt es an zu schneien'},
  text:[
    'Am 6. November schneit es zum ersten Mal richtig, und danach hört es nicht mehr auf. Innerhalb von drei Tagen fällt die Temperatur auf minus zwanzig.',
    'Was jetzt passiert, passiert schnell. Die Pferde, die auf glattem Boden nicht mehr stehen können, fallen und stehen nicht wieder auf. Ohne Pferde bleiben die Geschütze stehen. Ohne Geschütze bleibt die Nachhut ohne Feuerschutz.',
    'Wer sich abends hinsetzt, um auszuruhen, steht am Morgen nicht mehr auf. Das ist keine Redensart; es ist die häufigste Todesart dieses Feldzugs, und sie sieht friedlich aus.',
    'Dein Pferd — falls du ein Pferd hast — ist ab jetzt keine Fortbewegung mehr, sondern ein Vorrat. Das Spiel fragt nicht, ob. Nur wann, und wer zuerst.'
  ],
  optionen:[
    {label:'Am Feuer bleiben und die Nacht durchwachen',hint:'Kaltblütigkeit · wer schläft, wacht nicht auf',
     probe:{wert:'kaltbluetigkeit',schw:40},
     erfolg:{text:'Du machst es wie die, die 1807 in Ostpreußen waren: nicht hinsetzen, alle zwanzig Minuten aufstehen, den Nebenmann anstoßen, wenn er still wird. Es ist eine Nacht ohne Schlaf, und du hast am Morgen alle deine Leute.',
       kameradschaft:12,atem:-10,belastung:6},
     misserfolg:{text:'Gegen drei Uhr schläfst du im Sitzen ein, wie alle anderen. Du wachst auf, weil dich jemand tritt. Zwei neben dir wachen nicht auf, und einer davon hat dich am Abend noch gefragt, wie weit es bis Smolensk ist.',
       leben:-20,belastung:18,kameradschaft:-6}},
    {label:'Das Pferd schlachten',hint:'Es kommt nicht bis Smolensk, und ihr vielleicht',
     ab:{wert:'rang',min:7,sonst:'Es gibt Pferde an der Straße, die gefallen sind. Man schneidet heraus, was noch warm ist, und kocht es in einem Helm. Es ist das erste Fleisch seit elf Tagen.'},
     erfolg:{text:'Es ist ein Pferd, das dir gehört, seit du ein Patent hast, und es hat dich achthundert Kilometer getragen. Du führst es hinter eine Scheune, und danach isst deine Kompanie zwei Tage lang.\\n\\nDu gehst den Rest des Weges zu Fuß, wie alle anderen. Das ist nicht der Teil, an den du dich erinnern wirst.',
       kameradschaft:14,leben:12,belastung:10,einheit:8}},
    {label:'Weitergehen und nicht stehen bleiben',hint:'Der einzige Rat, den die Veteranen geben',
     erfolg:{text:'Nicht stehen bleiben. Nicht hinsetzen. Nicht ausruhen. Wer das durchhält, kommt an; wer es nicht durchhält, sieht dabei aus, als hätte er sich einfach hingesetzt.',
       atem:-8,belastung:8}}
  ]},

/* 119 */ {typ:'kampf',id:'krasnoi',datum:'17. November 1812 · Krasnoi',ort:'Die Nachhut',
  ueberfall:true, frost:3,
  marsch:{von:'Smolensk',nach:'Krasnoi',weg:'45 km · und die russische Armee steht auf der Straße, nicht daneben'},
  anmarschKosten:{verschleiss:0.3,atem:9,belastung:4},
  anmarsch:[
    'Smolensk hat nichts. Die Magazine, für die man achthundert Kilometer gegangen ist, sind in drei Tagen von den ersten Ankommenden geleert worden, und die Kolonne kommt in vier Tagen an.',
    'Bei Krasnoi steht die russische Armee quer über der Straße nach Westen. Es ist kein Gefecht, das man gewinnen kann; es ist eines, durch das man durchmuss.',
    'Was von der Garde noch steht, geht in Karrees und schiebt sich durch. Was nicht in einem Karree steht, kommt nicht durch.',
    'Es gibt keine Linie mehr, die von allein mitschießt. Es gibt das, was um dich herum noch stehen kann.'
  ],
  lage:{gegner:'Russische Armee quer über der Straße, mit Artillerie auf der Höhe',
        auftrag:'Durchkommen — nicht siegen',
        gelaende:'Verschneite Straße, offenes Feld, keine Deckung',
        stellung:'Was von der Kompanie noch geht'},
  intro:'Keine Linie hilft. Zurückweichen kostet keinen Ruf — es gibt nur kein Zurück.',
  runden:5,feindMoral:45,gefahr:10,gelaende:'wueste',
  sieg:{text:'Ihr kommt durch. Von dem Korps, das am Morgen angetreten ist, kommen sechstausend von sechzehntausend durch, und die Geschütze bleiben stehen, weil keine Pferde mehr da sind, sie zu ziehen.\\n\\nDrei Tage später erfährt man, dass ein ganzes Korps hinter euch nicht durchgekommen ist.',ruf:6},
  niederlage:{text:'Ihr kommt nicht durch die Straße und geht querfeldein nach Norden, durch Schnee, der bis über die Knie geht, und stoßt zwei Tage später wieder auf die Kolonne. Was ihr dabei verliert, zählt niemand.',ruf:0,belastung:16}},

/* 120 */ {typ:'kampf',id:'beresina',datum:'28. November 1812 · Studjanka',ort:'Die Brücke',
  haerte:1.4, ueberfall:true, frost:4,
  marsch:{von:'Borissow',nach:'Die Furt von Studjanka',weg:'20 km flussaufwärts · und der Fluss ist nicht zugefroren, sondern führt Eis'},
  anmarschKosten:{verschleiss:0.3,atem:10,belastung:5},
  anmarsch:[
    'Die Beresina ist achtzig Meter breit, führt Treibeis und ist nicht zugefroren, weil es vier Tage lang getaut hat. Die Brücke bei Borissow ist verbrannt. Vor euch steht eine russische Armee, hinter euch zwei.',
    'Bei Studjanka gibt es eine Furt. Die Pontoniere gehen bei minus zwanzig Grad ins Wasser und bauen zwei Brücken auf Böcken, sechs Stunden lang, im Wasser stehend. Von vierhundert Pontonieren werden im Frühjahr acht leben.',
    'Am 26. sind die Brücken fertig. Am 27. geht die Armee hinüber. Am 28. greifen beide russischen Armeen gleichzeitig an, auf beiden Ufern.',
    '**Deine Laufbahn hat auf einer Brücke angefangen.** Bei Lodi, im Mai 1796, unter Kartätschfeuer, mit dem General an der Spitze. Hier entscheidet sich, ob sie auf einer endet.'
  ],
  lage:{gegner:'Tschitschagow auf dem Westufer, Wittgenstein auf dem Ostufer · beide gleichzeitig',
        auftrag:'Den Brückenkopf halten, bis die Kolonne drüben ist',
        gelaende:'Sumpf, Treibeis, zwei Bockbrücken über achtzig Meter',
        stellung:'Am Brückenkopf, Ostufer'},
  intro:'Das hier wird kein gewöhnliches Gefecht. Die Laufbahn hat auf einer Brücke angefangen.',
  runden:8,feindMoral:70,gefahr:9,gelaende:'bruecke',
  sieg:{text:'Am Abend des 28. steht der Brückenkopf noch. In der Nacht geht hinüber, wer gehen kann; am Morgen des 29. werden die Brücken angezündet, während auf dem Ostufer noch zehntausend Nachzügler stehen.\\n\\nWas dort passiert, sieht man vom Westufer aus. Man sieht es sehr genau, weil es hell ist und weil es zwei Stunden dauert.',ruf:12,ruhm:true},
  niederlage:{text:'Der Brückenkopf wird zusammengedrückt, und was übrig ist, kommt einzeln über die Bohlen. Du kommst hinüber. Wie, wirst du später nicht erklären können, und es fragt auch nie jemand.',ruf:-3,belastung:20}},

/* 121 */ {typ:'szene',id:'was_uebrig_ist',datum:'14. Dezember 1812 · Am Njemen',ort:'Die zweite Zahl',
  frost:3,
  marsch:{von:'Wilna',nach:'Über den Njemen zurück',weg:'Dieselbe Brücke, dieselbe Richtung rückwärts'},
  text:[
    'Am 14. Dezember geht der Rest der Armee über den Njemen zurück, über dieselbe Brücke, über die sie im Juni gekommen ist. Es dauert keine drei Tage. Es dauert einen Vormittag.',
    'Was hinübergeht, sieht nicht wie eine Armee aus. Es sind Männer in Decken, Frauenkleidern und Pelzen, mit Lumpen um die Füße, viele ohne Waffe. Von den Regimentern sind Fahnen da, aber keine Bataillone.',
    'Von den vierhunderttausend der ersten Staffel gehen etwa zwanzigtausend als geschlossene Truppe zurück. Dazu kommt eine ähnliche Zahl an Einzelnen, die sich durchgeschlagen haben.',
    'Wer im Juni die Zahl aufgeschrieben hat, kann sie jetzt herausnehmen und eine zweite darunterschreiben. Es ist derselbe Fluss und dieselbe Brücke.'
  ],
  optionen:[
    {label:'Die zweite Zahl darunterschreiben',hint:'Es steht sonst nirgends',
     ab:{wert:'bildung',min:35,sonst:'Man nennt eine Zahl, und man glaubt sie nicht, und man merkt sie sich trotzdem für den Rest seines Lebens.'},
     erfolg:{text:'Du nimmst das Blatt aus dem Tornister, auf dem seit Juni „vierhunderttausend" steht, und schreibst darunter, was der Fourier heute gezählt hat. Dann faltest du es und steckst es weg.\\n\\nDu wirst es nie jemandem zeigen. Du wirst es auch nie wegwerfen.',
       belastung:16,attr:{kaltbluetigkeit:5}}},
    {label:'Nachsehen, wer von deinen Leuten da ist',hint:'Es geht schnell',
     erfolg:{text:'Du gehst die Reihe ab. Es ist eine kurze Reihe. Bei drei Namen weiß jemand, wo sie geblieben sind; bei den übrigen weiß es niemand, und du schreibst „vermisst", weil man das schreibt.',
       belastung:14,kameradschaft:8}},
    {label:'Nichts tun und weitergehen',hint:'Es ist noch nicht vorbei',
     erfolg:{text:'Du gehst über die Brücke, wie du im Juni darübergegangen bist, und siehst nicht zurück. Es ist die einzige Möglichkeit, an diesem Tag nicht stehen zu bleiben.',
       belastung:8}}
  ]},

/* 122 */ {typ:'uebergang',id:'ende_russland',datum:'Ende Dezember 1812 · Königsberg',ort:'Die Listen werden neu geschrieben',
  schranke:'russland',
  text:[
    'In Königsberg wird gesammelt, gezählt und neu eingeteilt. Was von der Großen Armee übrig ist, füllt keine Division.',
    'Der Kaiser ist am 5. Dezember abgereist, in einem Schlitten, nach Paris. Es steht in einem Bulletin, dem neunundzwanzigsten, und in demselben Bulletin steht zum ersten Mal seit sechzehn Jahren, wie es wirklich aussieht. Der letzte Satz lautet, die Gesundheit Seiner Majestät sei nie besser gewesen.',
    'Es wird eine neue Armee aufgestellt. Sie wird aus Konskribierten des Jahrgangs 1813 bestehen und aus denen, die man aus Spanien holt, und sie wird Offiziere brauchen — Offiziere, die wissen, wie eine Kolonne bei minus zwanzig Grad zusammenbleibt.',
    'Was man nicht mehr braucht, sind Unteroffiziere. Davon gibt es genug, und die meisten von ihnen wollen nach Hause.'
  ],
  ausblick:'Im Frühjahr 1813 steht eine neue Armee am Rhein. Sie ist achtzehn Jahre alt, hat noch nie geschossen und wird nach dem Namen einer Kaiserin benannt, die keiner von ihnen je gesehen hat.'}
];

/* Anmeldung: an das laufende Band anhängen und beim Verlauf eintragen.
   `.slice()` ist Pflicht, nicht Kosmetik — siehe die Warnung in Kapitel 1. */
KAPITEL.push(...KAPITEL8);
STATIONEN.russland = KAPITEL8.slice();
(KAMPAGNEN.find(k=>k.id==='russland')||{}).gebaut = true;
