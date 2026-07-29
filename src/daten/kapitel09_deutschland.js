'use strict';
/* Kapitel 9 — Deutschland 1813. Reine Daten, wie die Kapitel davor.

   ══════════════════ Die eigene Regel ══════════════════

   **Deine Armee ist achtzehn Jahre alt.**

   Die alte Armee liegt in Russland. Die neue besteht aus Konskribierten, die
   noch nie geschossen haben — die *Marie-Louises*, benannt nach einer
   Kaiserin, die keiner von ihnen je gesehen hat. Mechanisch heißt das:
   **Einheitszustand und Sektionsgüte starten bei einem Bruchteil**
   (`rekruten:true` an der Kampagne), und der Drill zwischen den Schlachten
   wird zum eigentlichen Spiel.

   Es ist derselbe Drill wie in Savona 1796 — nur stehst du auf der anderen
   Seite, und die Gesichter vor dir sind das eigene von damals. **Das Kapitel
   sagt das genau einmal, in einem Nebensatz**, und danach nie wieder.

   Jedes Gefecht prüft die Ausbildung, nicht den Mut: Ein schlecht gedrillter
   Zug bricht bei den ersten Verlusten. Wer die Lagerabende in Drill steckt,
   kauft damit buchstäblich Standfestigkeit.

   **Und der Adler kommt.** Ab Rang 11 ist er ein Zustand mit drei Werten —
   getragen, gerettet, verloren. Ein verlorener Adler kostet den Rang,
   unabhängig von allem anderen. Die Sondermission von Leipzig ist deshalb
   keine Heldentat, sondern eine Bergung.

   ══════════════════ Historische Fixpunkte (Invariante 8) ══════════════════

   Lützen 2. Mai 1813 · Bautzen 20.–21. Mai · Waffenstillstand von Pläswitz
   Juni bis August · Dresden 26.–27. August, der letzte große Sieg · die
   Niederlagen der Unterführer im selben Monat (Katzbach, Kulm, Dennewitz) ·
   **Leipzig 16.–19. Oktober**, die Völkerschlacht · die zu früh gesprengte
   Elsterbrücke am 19. · Hanau 30.–31. Oktober · der Rhein im November.
   Dazwischen ist alles frei erfunden. */

const KAPITEL9 = [

/* 123 */ {typ:'szene',id:'mainz',datum:'März 1813 · Mainz',ort:'Das neue Regiment',
  marsch:{von:'Sammelplatz in Frankreich',nach:'Mainz',weg:'Ein Depot, in dem dreitausend Achtzehnjährige stehen und niemand weiß, wohin mit ihnen'},
  text:[
    'Das Regiment steht auf dem Exerzierplatz, und es steht falsch. Nicht schlecht ausgerichtet — falsch: Sie stehen wie Leute, die noch nie in einer Reihe gestanden haben, weil sie noch nie in einer Reihe gestanden haben.',
    'Es sind Konskribierte des Jahrgangs 1814, vorzeitig eingezogen. Der Jüngste ist siebzehn. Viele haben eine Muskete zum ersten Mal in der Hand, als sie sie ausgehändigt bekommen, und drei Wochen später gehen sie damit über den Rhein.',
    'Von den Männern, mit denen du 1812 über den Njemen gegangen bist, sind vier hier. Vier, in einem Regiment von zweitausend.',
    'Einer der Neuen fragt dich abends am Feuer, wie es ist. Er meint es nicht als Redensart; er will es wirklich wissen, und er ist der Einzige, der fragt.'
  ],
  optionen:[
    {label:'Die Wahrheit sagen',hint:'Er hat gefragt',
     erfolg:{text:'Du sagst ihm, dass es laut ist, dass man nichts sieht, dass der Mann neben ihm fallen wird und dass er dann weiterladen muss. Du sagst ihm auch, dass die, die sich hinlegen, meistens dort liegen bleiben.\\n\\nEr hört zu und sagt danach nichts mehr. Am nächsten Morgen steht er beim Exerzieren vorn und stellt Fragen, die vernünftig sind.',
       kameradschaft:8,einheit:6}},
    {label:'Ihm sagen, es sei halb so schlimm',hint:'Es ist die Antwort, die man gibt',
     erfolg:{text:'Du sagst, es sei lauter als schlimm und man gewöhne sich daran. Er glaubt es, weil er es glauben will, und schläft in dieser Nacht gut.\\n\\nBei Lützen wird er in der zweiten Reihe stehen. Was dann passiert, hat mit dem, was du gesagt hast, nichts zu tun, und du wirst trotzdem daran denken.',
       kameradschaft:4,belastung:6}},
    {label:'Nichts sagen und ihm zeigen, wie man lädt',hint:'Drill · zwölf Zeiten, achtzigmal',
     probe:{wert:'drill',schw:40},
     erfolg:{text:'Du antwortest nicht, sondern nimmst ihm die Muskete aus der Hand und machst es vor. Zwölf Zeiten, dann noch einmal, dann lässt du ihn. Nach einer Stunde geht es. Nach drei Abenden geht es im Dunkeln.\\n\\nEs ist die einzige Antwort auf seine Frage, die etwas nützt, und sie beantwortet sie nicht.',
       einheit:12,fert:{drill:6},kameradschaft:6},
     misserfolg:{text:'Du machst es vor, und er macht es nach, und nach der vierten Wiederholung merkst du, dass du selbst zwei Griffe anders machst als das Reglement, weil man das nach siebzehn Jahren so macht. Er übernimmt beide.',
       einheit:4,fert:{drill:3}}},
    {label:'Sagen, dass du selbst so angefangen hast',hint:'Es ist wahr, und es ist der einzige Satz dieses Kapitels darüber',
     erfolg:{text:'Du sagst ihm, du seist 1796 mit siebzehn in Savona angetreten und habest damals dieselbe Frage gestellt, und der, den du gefragt hast, sei bei Lodi geblieben.\\n\\nDanach redest du in diesem Kapitel nicht mehr davon. Es ist gesagt, und einmal reicht.',
       kameradschaft:10,belastung:-6,attr:{menschenkenntnis:3}}}
  ]},

/* 124 */ {typ:'lager',id:'drilllager',datum:'April 1813 · Drilllager am Rhein',ort:'Drei Wochen, um aus Jungen eine Linie zu machen',
  abende:3,
  tun:['exerzieren','bajonett','scharf','instand','schuhe','waffe','ruhe','leute'],
  rangTun:{3:['korporalschaft'],4:['listen'],5:['sektion','rekruten'],7:['fechtboden','zugfuehren','karten','adjutant'],9:['kasse_ganz','kasse_ueblich','kasse_voll']},
  text:[
    'Drei Wochen. In drei Wochen macht man aus einem Achtzehnjährigen keinen Soldaten; man macht aus ihm jemanden, der in der Reihe stehen bleibt, wenn geschossen wird, und das ist alles, was gebraucht wird.',
    'Geübt wird das Nötigste: laden, in Linie gehen, Karree formieren, und vor allem stehen bleiben. Zielen wird nicht geübt, weil dafür Pulver fehlt und weil es auf zweihundert Schritt ohnehin keine Rolle spielt.',
    'Was fehlt, ist Kavallerie. Es gibt fast keine Pferde mehr in Frankreich, und ohne Kavallerie kann man siegen, aber nicht verfolgen — jeder Sieg dieses Jahres wird deshalb ein halber sein.',
    'Was hier in die Ausbildung geht, steht im Mai in der Linie. Was nicht hineingeht, liegt im Mai davor.'
  ]},

/* 125 */ {typ:'kampf',id:'luetzen',datum:'2. Mai 1813 · Großgörschen',ort:'Die Rekruten halten',
  marsch:{von:'Lager bei Naumburg',nach:'Die Dörfer bei Lützen',weg:'35 km · und dann steht die preußische Kavallerie in der Flanke'},
  anmarschKosten:{verschleiss:0.15,atem:6,belastung:2},
  anmarsch:[
    'Es beginnt als Überraschung, und zwar für euch: Die Kolonne marschiert nach Leipzig, und um elf Uhr vormittags geht in vier Dörfern rechts der Straße das Feuer los.',
    'Was dort steht, ist die preußisch-russische Hauptarmee, und was ihr gegenüberstellt, sind Bataillone aus Achtzehnjährigen, die vor sechs Wochen zu Hause waren.',
    'Sie stehen. Sie stehen nicht gut, sie stehen ungeordnet und mit zu viel Abstand, und sie laden zu langsam — aber sie gehen nicht weg. Vier Dörfer wechseln bis zum Abend fünfmal den Besitzer.',
    'Der Kaiser reitet mitten hinein und bleibt bis in die Nacht dort. Es heißt später, er habe seit Arcole nicht mehr so weit vorn gestanden. Was man sieht, ist ein Mann zu Pferd zwischen Jungen, die sich an ihm ausrichten wie an einem Fahnenmast.'
  ],
  lage:{gegner:'Preußisch-russische Hauptarmee, achtzigtausend Mann, dazu Kavallerie, die ihr nicht habt',
        auftrag:'Die Dörfer halten, bis die Korps von rechts und links da sind',
        gelaende:'Vier Dörfer in einer Mulde, Gärten, Mauern, Teiche',
        stellung:'Erstes Treffen, im zweiten Dorf'},
  intro:'Es hängt nicht am Mut. Es hängt daran, ob drei Wochen Drill reichen.',
  runden:7,feindMoral:62,gefahr:13,gelaende:'damm',
  sieg:{text:'Am Abend gehören euch die Dörfer. Es ist ein Sieg, und er hat zwanzigtausend Mann gekostet, und verfolgen kann ihn niemand, weil keine Kavallerie da ist.\\n\\nAm nächsten Tag reitet der Kaiser die Front ab und nennt die jungen Bataillone beim Namen. Es ist nicht üblich, und es ist an diesem Tag verdient.',ruf:8,ruhm:true},
  niederlage:{text:'Euer Dorf geht dreimal verloren und wird zweimal zurückgenommen, das dritte Mal von einem anderen Regiment. Am Abend ist die Schlacht gewonnen. Was in eurem Dorf liegt, ist zur Hälfte unter zwanzig.',ruf:-4,belastung:12}},

/* 126 */ {typ:'kampf',id:'bautzen',datum:'21. Mai 1813 · Bautzen',ort:'Sieg ohne Früchte',
  marsch:{von:'Dresden',nach:'Die Höhen bei Bautzen',weg:'80 km ostwärts · zwei Tage, und diesmal weiß man vorher, wo sie stehen'},
  anmarschKosten:{verschleiss:0.15,atem:6,belastung:2},
  anmarsch:[
    'Diesmal ist es geplant: Ein Korps geht in die Flanke, während die Front festhält, und wenn beides zusammenkommt, ist die verbündete Armee eingeschlossen.',
    'Beides kommt nicht zusammen. Das Flankenkorps ist zu spät, zu weit außen und marschiert an der Stelle vorbei, an der es hätte einschwenken sollen.',
    'Was übrig bleibt, ist ein Frontalangriff auf Höhen, die befestigt sind. Zwei Tage lang.',
    'Am Abend des 21. sind die Höhen euer. Die verbündete Armee zieht ab, in Ordnung, ohne einen Gefangenen und ohne ein Geschütz zurückzulassen — weil niemand da ist, der ihr folgt.'
  ],
  lage:{gegner:'Verbündete Armee auf befestigten Höhen, in aller Ruhe eingegraben',
        auftrag:'Die Höhen frontal nehmen',
        gelaende:'Terrassen, Bachtäler, Feldschanzen',
        stellung:'Erstes Treffen, Mitte'},
  intro:'Man gewinnt und hat nichts davon. Zum zweiten Mal in drei Wochen.',
  runden:7,feindMoral:64,gefahr:13,gelaende:'mauer',
  sieg:{text:'Am Abend stehen die Höhen leer. Kein Gefangener, kein Geschütz, keine Fahne — sie sind abgezogen, wie man abzieht, wenn man weiß, dass niemand hinterherkommt.\\n\\nDer Kaiser sagt am Abend einen Satz, den ein Adjutant aufschreibt: Wie, nach einem solchen Gemetzel, kein Ergebnis? Es ist die erste Frage dieser Art, die er stellt.',ruf:6},
  niederlage:{text:'Euer Angriff bleibt auf der zweiten Terrasse liegen, bis die Stellung von rechts aufgerollt wird. Am Abend ist die Höhe genommen, der Feind abgezogen, und niemand hat etwas gewonnen.',ruf:-3,belastung:10}},

/* 127 */ {typ:'winter',id:'waffenstillstand',datum:'Juni–August 1813 · Waffenstillstand',ort:'Zehn Wochen mitten im Krieg',
  wochen:4,
  tun:['ausr','drill','lesen','leute','ruhe','marketender','ausbilden','verdienst'],
  rangTun:{4:['magazin'],5:['ausbilden','schreiber'],7:['fechtboden']},
  frage:'Zehn Wochen. Beide Seiten benutzen sie. Wofür benutzt du sie?',
  text:[
    'Am 4. Juni wird ein Waffenstillstand geschlossen, der bis zum 10. August dauert. Er wird später als der größte Fehler des Kaisers gelten, und die Rechnung dahinter ist einfach: Ihr gewinnt in zehn Wochen dreißigtausend Mann dazu, sie gewinnen zweihunderttausend und Österreich.',
    'Für die Kompanie sind es zehn Wochen mit Dach, Sold und Zeit. Es wird exerziert, geschossen, neu eingekleidet und aufgefüllt. Die Rekruten vom März sind jetzt Soldaten; nicht gute, aber welche.',
    'In den Wirtshäusern hört man, was in Sachsen geredet wird, und es klingt anders als im Vorjahr. Die Leute sind höflich und rechnen.',
    'Jeder weiß, dass es weitergeht. Man kann in dieser Zeit sehr genau sehen, wer wie damit umgeht.'
  ]},

/* 128 */ {typ:'befoerderung',id:'musterung_dresden',datum:'August 1813 · Dresden',ort:'Musterung vor dem Herbstfeldzug',
  keinZiel:'Die Stellen, die frei sind, werden mit Leuten besetzt, die man seit dem Frühjahr kennt. Über dir ist keine frei, und in diesem Jahr wird nach oben nicht mehr viel frei — es fallen die, die vorn stehen.',
  text:[
    'Am 12. August erklärt Österreich den Krieg. Damit stehen gegen euch drei Armeen mit zusammen einer halben Million Mann, und der Plan der Verbündeten ist so einfach, dass er funktioniert: Wo der Kaiser selbst steht, wird ausgewichen; wo er nicht steht, wird geschlagen.',
    'Gemustert wird in Dresden, in einer Stadt, die noch französisch ist und in der man abends ins Theater gehen kann. Es ist die letzte Musterung dieser Art.',
    'Was gebraucht wird, sind Offiziere, die einen Zug aus Achtzehnjährigen zusammenhalten können, wenn Kavallerie in der Flanke steht. Wer das im Mai gezeigt hat, steht auf einer Liste.'
  ]},

/* 129 */ {typ:'kampf',id:'dresden',datum:'27. August 1813 · Dresden',ort:'Der letzte große Sieg',
  marsch:{von:'Quartier in der Neustadt',nach:'Die Vorstädte im Süden',weg:'Fünf Kilometer durch eine Stadt, in der es seit dem Vortag regnet'},
  anmarschKosten:{verschleiss:0.2,atem:6,belastung:3},
  anmarsch:[
    'Zweihundertfünfzigtausend Verbündete stehen vor Dresden, ihr seid hunderttausend, und der Kaiser ist in siebzig Stunden mit der Garde von Schlesien herangekommen.',
    'Es regnet seit dem Vortag und hört nicht auf. Das Pulver in den Pfannen wird nass; nach einer Stunde schießt auf beiden Seiten fast niemand mehr, und was entscheidet, ist das Bajonett und die Kavallerie.',
    'Auf dem linken Flügel steht österreichische Infanterie in einer Mulde, mit einem Bachtal im Rücken, und kann nicht weg. Was dort passiert, wird kurz und vollständig sein.',
    'Es ist der Tag, an dem diese Armee zum letzten Mal etwas tut, was ihr in zwanzig Jahren niemand nachgemacht hat.'
  ],
  lage:{gegner:'Böhmische Armee, zweihundertfünfzigtausend, in Anmarschordnung und im Regen',
        auftrag:'Die Vorstadt räumen und den linken Flügel aufrollen',
        gelaende:'Gärten, Weinberge, ein Bachtal · alles im Regen',
        stellung:'Erstes Treffen, linker Flügel'},
  intro:'Das Pulver ist nass. Was heute entscheidet, ist, wer näher herangeht.',
  runden:8,feindMoral:70,gefahr:14,gelaende:'damm',
  sieg:{text:'Am Abend des 27. ziehen sie nach Böhmen ab und lassen fünfzehntausend Gefangene und alle Geschütze des linken Flügels zurück.\\n\\nEs ist der letzte große Sieg dieser Armee. In derselben Woche verliert sie an der Katzbach, bei Kulm und bei Dennewitz drei Schlachten, in denen der Kaiser nicht anwesend war, und die Summe dieser drei ist größer als Dresden.',ruf:10,ruhm:true},
  niederlage:{text:'Euer Angriff kommt im Schlamm nicht über den Weinberg. Was den Flügel aufrollt, ist zwei Stunden später die Kavallerie. Der Sieg ist vollständig, und drei andere Schlachten in derselben Woche sind es auch — nur andersherum.',ruf:-3,belastung:12}},

/* 130 */ {typ:'szene',id:'nachrichten',datum:'September 1813 · Zwischen Dresden und Leipzig',ort:'Die Nachrichten der anderen',
  zwischenfall:true,
  text:[
    'Man rechnet in diesem Herbst viel. Nicht laut, aber in der Kompanie kann jeder rechnen, der einmal Rationen ausgegeben hat.',
    'An der Katzbach: ein Korps vernichtet, fünfzehntausend Mann, hundert Geschütze. Bei Kulm: ein Korps eingeschlossen, dreizehntausend, der Kommandierende gefangen. Bei Dennewitz: zweiundzwanzigtausend. Bei Großbeeren davor noch einmal dreitausend.',
    'Alle vier an Orten, an denen der Kaiser nicht war. Er kann nicht überall sein, und die andere Seite hat ausgerechnet, dass sie genau das ausnutzen muss.',
    'Wer diese Zahlen zusammenzählt, kommt auf mehr, als bei Dresden gewonnen worden ist. Es sagt niemand laut. Alle haben es gerechnet.'
  ],
  optionen:[
    {label:'Es ausrechnen und für dich behalten',hint:'Verwaltung · vier Zahlen, eine Summe',
     ab:{wert:'bildung',min:35,sonst:'Man hört Zahlen und behält sie nicht. Was hängen bleibt, ist, dass es viele waren.'},
     erfolg:{text:'Dreiundfünfzigtausend in vier Wochen, gegen fünfzehntausend Gefangene bei Dresden. Du rechnest es zweimal, weil es beim ersten Mal nicht stimmen kann, und beim zweiten Mal stimmt es wieder.\\n\\nDu sagst es niemandem. Es gibt niemanden, dem man das sagen könnte, ohne dass es eine Meldung wird.',
       fert:{taktik:6,verwaltung:5},belastung:10}},
    {label:'Deinen Leuten die Zahlen ausreden',hint:'Autorität · sie rechnen ohnehin',
     ab:{wert:'rang',min:5,sonst:'Es wird abends gerechnet, und du rechnest mit. Es kommt jedes Mal dasselbe heraus.'},
     probe:{wert:'autoritaet',schw:45},
     erfolg:{text:'Du sagst, dass eine Zahl aus dritter Hand keine Zahl ist, und das stimmt sogar. Es hilft drei Tage. Danach rechnen sie wieder, aber leiser, und leiser ist besser als gar nicht.',
       einheit:8,kameradschaft:4},
     misserfolg:{text:'Ein Sergent, der 1806 dabei war, rechnet dir vor, dass deine Zahlen die aus dem Bulletin sind, und dass die Bulletins seit Russland niemand mehr glaubt. Er hat recht, und alle wissen, dass er recht hat.',
       einheit:-6,kameradschaft:-4}},
    {label:'Nicht zuhören',hint:'Es ändert nichts, ob man es weiß',
     erfolg:{text:'Du gehst früh schlafen, wenn abends gerechnet wird. Es ist die vernünftigste Art, mit dieser Sorte Nachricht umzugehen, und sie funktioniert bis Mitte Oktober.',
       belastung:-6}}
  ]},

/* 131 */ {typ:'kampf',id:'leipzig1',datum:'16. Oktober 1813 · Wachau',ort:'Der erste Tag',
  haerte:1.4,
  marsch:{von:'Stellung bei Liebertwolkwitz',nach:'Die Höhen bei Wachau',weg:'Sechs Kilometer · und ringsum stehen dreihundertsechzigtausend'},
  anmarschKosten:{verschleiss:0.2,atem:7,belastung:3},
  anmarsch:[
    'Um Leipzig stehen an diesem Morgen sechshunderttausend Mann. Es ist die größte Schlacht, die vor 1914 geschlagen wird, und niemand auf dem Feld kann sie überblicken — auch der Kaiser nicht.',
    'Euer Auftrag lautet nicht, den Feind zu schlagen. Er lautet: die Stellung halten, bis rechts der Angriff angesetzt ist. Es ist der Unterschied zwischen Sieg und Auftrag, und in dieser Schlacht ist er zum ersten Mal der wichtigere.',
    'Um zehn Uhr beginnt es auf einer Front von acht Kilometern gleichzeitig. Was danach passiert, erfährt man abends oder gar nicht.',
    'Gegen Mittag geht die schwere Kavallerie vor, kommt bis an die Höhe, auf der die drei Monarchen stehen, und wird zurückgeworfen, weil ihr niemand folgt. Es ist der Augenblick, in dem der Krieg entschieden wird, und man sieht ihn von hier aus als Staub.'
  ],
  lage:{gegner:'Böhmische Armee, hundertdreißigtausend, im Angriff auf eurer ganzen Front',
        auftrag:'Die Höhe halten — nicht: sie nehmen',
        gelaende:'Sanfte Höhen, Dörfer, Teiche, achtzehnhundert Geschütze auf acht Kilometern',
        stellung:'Erstes Treffen, vor Wachau'},
  intro:'Das hier wird kein gewöhnliches Gefecht. Und der Sieg zählt nicht — die Stellung zählt.',
  runden:9,feindMoral:85,gefahr:15,gelaende:'damm',
  sieg:{text:'Am Abend steht ihr, wo ihr am Morgen gestanden habt. Das ist der Auftrag, und er ist erfüllt.\\n\\nIn der Nacht rücken auf der anderen Seite hunderttausend Mann nach, die am Morgen noch nicht da waren. Auf eurer Seite rückt niemand nach.',ruf:10,ruhm:true},
  niederlage:{text:'Die Höhe geht am Nachmittag verloren und wird nicht zurückgenommen. In der Nacht wird die Stellung um zwei Kilometer zurückverlegt, und auf der anderen Seite rücken hunderttausend nach.',ruf:-4,belastung:14}},

/* 132 */ {typ:'kampf',id:'leipzig2',datum:'19. Oktober 1813 · Die Elsterbrücke',ort:'Der Rückzug durch die Stadt',
  haerte:1.4, ueberfall:true,
  marsch:{von:'Die Vorstädte',nach:'Die Brücke über die Elster',weg:'Zwei Kilometer durch eine Stadt, durch die sich eine Armee zurückzieht'},
  anmarschKosten:{verschleiss:0.25,atem:8,belastung:4},
  anmarsch:[
    'Am 19. wird abgezogen. Es gibt eine Straße nach Westen und eine Brücke über die Elster, und über diese eine Brücke muss eine Armee von hunderttausend Mann.',
    'Die Nachhut steht in den Vorstädten und hält, während die Kolonne über die Bohlen geht. Es geht langsam, weil es nicht schneller geht.',
    'Um ein Uhr mittags fliegt die Brücke in die Luft. Ein Korporal der Pioniere hat den Befehl bekommen, sie zu sprengen, sobald der Feind kommt, und er hat den Feind gesehen.',
    'Auf dieser Seite stehen in diesem Augenblick noch dreißigtausend Mann. Was jetzt kommt, hat mit einem Gefecht nichts zu tun.'
  ],
  lage:{gegner:'Vier Armeen, die gleichzeitig in die Stadt kommen',
        auftrag:'Was zu retten ist, über den Fluss bringen',
        gelaende:'Gassen, Gärten, ein Fluss von vierzig Metern und keine Brücke',
        stellung:'Nachhut, diesseits'},
  intro:'Es gibt keine Brücke mehr. Es gibt einen Fluss, und was hinüber soll, muss hindurch.',
  runden:6,feindMoral:55,gefahr:16,gelaende:'bruecke',
  sieg:{text:'Du kommst hinüber. Wie, wirst du später erzählen können, aber nicht gern.\\n\\nVon den dreißigtausend, die diesseits standen, kommen etwa zehntausend durch. Der Rest ist gefangen oder liegt in der Elster; darunter ein Marschall, der schwimmen wollte und es nicht konnte.',ruf:8,ruhm:true},
  niederlage:{text:'Du kommst hinüber, ohne etwas mitzubringen — keine Verwundeten, keine Wagen, keinen von denen, die dir am Morgen unterstanden. Am anderen Ufer setzt du dich hin und siehst zurück auf eine Stadt, die euch seit gestern nicht mehr gehört.',ruf:-4,belastung:18}},

/* 133 */ {typ:'befoerderung',id:'musterung_rueckzug_13',datum:'Ende Oktober 1813 · Erfurt',ort:'Musterung im Rückzug',
  keinZiel:'Es sind viele Stellen frei — es sind fast nur noch freie Stellen da. Über dir ist trotzdem keine, und das liegt daran, dass über dir seit Leipzig niemand mehr steht, der ersetzt werden müsste.',
  text:[
    'In Erfurt wird gezählt, was aus Leipzig gekommen ist. Es sind achtzigtausend von hundertsiebzigtausend, dazu dreißigtausend, die in den Lazaretten liegen und Typhus haben.',
    'Die Verbündeten von gestern sind die Gegner von heute: Sachsen und Württemberg sind während der Schlacht übergelaufen, Bayern hat eine Woche vorher die Seiten gewechselt und steht jetzt bei Hanau quer über der Straße nach Frankreich.',
    'Was hier befördert wird, wird befördert, weil jemand tot ist. Das war immer so; in diesem Herbst sagt man es zum ersten Mal laut.'
  ]},

/* 134 */ {typ:'kampf',id:'hanau',datum:'30. Oktober 1813 · Hanau',ort:'Der Weg nach Hause',
  marsch:{von:'Der Spessart',nach:'Hanau',weg:'Vierzig Kilometer · und dahinter liegt der Rhein'},
  anmarschKosten:{verschleiss:0.2,atem:7,belastung:3},
  anmarsch:[
    'Bei Hanau steht eine bayerisch-österreichische Armee von vierzigtausend Mann quer über der Straße nach Frankfurt. Sie hat sich einen guten Platz ausgesucht und rechnet damit, dass das, was aus Leipzig kommt, kein Heer mehr ist.',
    'Es ist noch eines. Was nach Hanau kommt, sind achtzigtausend Männer, die seit vierzehn Tagen marschieren, und dreißig Geschütze der Garde unter einem Mann namens Drouot.',
    'Drouot fährt die dreißig Geschütze in den Wald hinein, auf hundertfünfzig Meter an die feindliche Linie heran, und schießt eine Bresche in eine Armee.',
    'Es ist kein Sieg. Es ist ein Durchbruch, und der Unterschied ist, dass man danach weitergeht, statt zu bleiben.'
  ],
  lage:{gegner:'Bayerisch-österreichische Armee, vierzigtausend, quer über der Straße',
        auftrag:'Durchbrechen — die Straße nach Frankfurt öffnen',
        gelaende:'Wald, eine Lichtung, dahinter offenes Feld und die Kinzig',
        stellung:'Erstes Treffen, hinter den Gardegeschützen'},
  intro:'Kein Sieg. Ein Durchbruch. Der Unterschied ist, dass man danach weitergeht.',
  runden:6,feindMoral:58,gefahr:14,gelaende:'damm',
  sieg:{text:'Am Abend ist die Straße frei. Neuntausend Bayern und Österreicher liegen auf dem Feld; von euch fünftausend.\\n\\nZwei Tage später steht ihr am Rhein. Es ist der 2. November 1813, und zum ersten Mal seit siebzehn Jahren steht diese Armee an der Grenze und nicht dahinter.',ruf:7,ruhm:true},
  niederlage:{text:'Euer Angriff bleibt in der Lichtung liegen. Was den Durchbruch macht, sind die Gardegeschütze und ein anderes Regiment. Die Straße ist frei, und ihr geht darauf, wie alle anderen auch.',ruf:-3,belastung:12}},

/* 135 */ {typ:'ende',id:'ende_deutschland',datum:'November 1813 · Am Rhein',ort:'Zu Hause',
  marsch:{von:'Hanau',nach:'Mainz und über den Rhein',weg:'Achtzig Kilometer · und dahinter ist Frankreich'},
  text:[
    'Am 2. November geht die Armee bei Mainz über den Rhein. Von den vierhunderttausend, die im Frühjahr aufgestellt worden sind, kommen siebzigtausend zurück; in Mainz bricht Typhus aus und holt in acht Wochen noch einmal zwanzigtausend.',
    'Deutschland ist verloren. Die Festungen östlich des Rheins halten noch — Dresden, Danzig, Hamburg —, aber sie halten für nichts, und ihre Besatzungen werden bis zum Frühjahr kapitulieren.',
    'Zum ersten Mal seit 1796 ist der Krieg zu Hause. Was das heißt, versteht man nicht in Mainz. Man versteht es im Januar, wenn man in Frankreich requiriert und die Bauern das Korn vor der eigenen Armee verstecken.',
    'Von den vier Männern, die im März in Mainz mit dir angetreten sind und die 1812 dabei waren, ist keiner mehr da.'
  ],
  ausblick:'<b>Hier endet der gebaute Stand.</b> Im Januar 1814 gehen dreihunderttausend Verbündete über den Rhein. Was ihnen entgegensteht, sind siebzigtausend Mann und ein Feldherr, der in sechs Tagen vier Schlachten gewinnen wird — und danach ist die Reserve leer, endgültig.'}
];

/* Anmeldung: an das laufende Band anhängen und beim Verlauf eintragen.
   `.slice()` ist Pflicht, nicht Kosmetik — siehe die Warnung in Kapitel 1. */
KAPITEL.push(...KAPITEL9);
STATIONEN.deutschland = KAPITEL9.slice();
(KAMPAGNEN.find(k=>k.id==='deutschland')||{}).gebaut = true;
