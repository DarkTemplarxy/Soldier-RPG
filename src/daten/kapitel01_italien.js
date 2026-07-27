'use strict';
/* Kapitel 1 — Italien 1796/97. Reine Daten: Szenen, Lager, Gefechte, Ergebnisse.
   Neue Kapitel als eigene Datei danebenlegen und in index.html einhängen.

   Stationstypen: szene · lager · kampf · elite · befoerderung · winter · ende
   marsch:   Ortswechsel vor der Station. Wird als Band über der Karte gezeigt.
   anmarsch: Text vor dem Gefecht. Der Weg dorthin, die Stellung, das Warten.
   lage:     Nüchterne Meldung vor dem Gefecht. Nur Angaben, keine Wertung. */

/* ══════════════════ KAPITEL ITALIEN 1796/97 ══════════════════ */

const KAPITEL = [
/* 1 */ {typ:'lager',id:'depot',datum:'1.–11. April 1796 · Savona',ort:'Rekrutendepot der 32. Halbbrigade',
  marsch:{von:'Aushebung in Frankreich',nach:'Savona',weg:'elf Tage auf dem Karren und zu Fuß · zuletzt über den Küstenweg'},
  abende:3,
  text:[
    'Du bist mit einundvierzig anderen angekommen und stehst jetzt in einem Hof, in dem es nach nassem Stroh riecht. Ein Sergent liest Namen von einer Liste und spricht die Hälfte falsch aus.',
    'Man gibt dir eine Muskete, die schon jemand anderem gehört hat, ein Bajonett, einen Tornister ohne Riemen und keine Schuhe. Die Muskete hat einen Namen: Charleville, Modell 1777. Du wirst ihn oft hören.',
    'Bis der Feldzug beginnt, bleiben elf Tage. In dieser Zeit soll aus dir ein Soldat werden. Man wird dir dabei nicht zusehen — hier sieht niemand jemandem zu.',
    'Drei Abende gehören dir. Was du in dieser Zeit nicht lernst, lernst du im April unter Beschuss oder gar nicht.'
  ],
  tun:['exerzieren','bajonett','scharf','instand','leute','ruhe']},

/* 2 */ {typ:'szene',id:'savona',datum:'12. April 1796 · Savona',ort:'Lager der Italienarmee',
  text:[
    'Du bist seit elf Tagen bei der Armee und hast in dieser Zeit zweimal etwas gegessen, das man Brot nennen konnte.',
    'Die Italienarmee ist keine Armee, sondern ein Haufen von dreißigtausend Männern, die zu wenig Schuhe und zu viele Läuse haben. Der neue Oberbefehlshaber ist seit zwölf Tagen da, sechsundzwanzig Jahre alt, klein, und niemand weiß, was man von ihm halten soll.',
    'Heute Abend wird verlesen, dass es morgen nach Norden geht. In die Berge. Über die Pässe, wo noch Schnee liegt.',
    'Deine Schuhe haben es bis hierher geschafft. Weiter vermutlich nicht.'
  ],
  optionen:[
    {label:'Einem Toten die Schuhe ausziehen',hint:'Es liegt einer hinter dem Lazarettzelt',
     probe:{wert:'menschenkenntnis',schw:35},kosten:'Menschenkenntnis · niemand darf es sehen',
     erfolg:{text:'Du wartest, bis der Posten sich umdreht. Die Schuhe sind zu groß, aber sie haben Sohlen. Du stopfst Lumpen hinein und sagst nichts.',
       ausr:{schuhe:30},belastung:4},
     misserfolg:{text:'Ein Sergent sieht dich und schlägt dir mit dem Stock über den Rücken. Du behältst die Schuhe — aber jetzt wissen es zwanzig Männer.',
       ausr:{schuhe:25},ruf:-3,belastung:6}},
    {label:'Die eigenen Schuhe flicken',hint:'Mit Draht und Lumpen, den halben Abend lang',
     probe:{wert:'geschick',schw:30},kosten:'Geschick · kostet Schlaf',
     erfolg:{text:'Du nähst die Sohle mit Draht an das Oberleder. Es hält. Es wird nicht ewig halten, aber es hält.',ausr:{schuhe:22},atem:-5},
     misserfolg:{text:'Der Draht reißt zweimal, du stichst dir in den Daumen, und am Ende ist es kaum besser als vorher.',ausr:{schuhe:8},belastung:3}},
    {label:'Nichts tun und schlafen',hint:'Morgen ist auch ein Tag',
     erfolg:{text:'Du schläfst sieben Stunden am Stück, was seit Wochen nicht vorgekommen ist. Die Schuhe sind am Morgen genauso kaputt wie am Abend, aber du bist ausgeruht.',
       belastung:-6,atem:8}},
    {label:'Den anderen zuhören',hint:'Wer redet, verrät etwas',
     probe:{wert:'menschenkenntnis',schw:40},kosten:'Menschenkenntnis',
     erfolg:{text:'Am Feuer sitzt ein Sergent namens Martel, der schon 1793 an der Rheinfront war. Er redet über den Neuen, ohne zu spotten, was hier selten ist. Du merkst dir den Namen.',
       gunst:2,kameradschaft:5,fert:{taktik:4}},
     misserfolg:{text:'Sie reden über Weiber und über Brot. Du lernst nichts, außer dass es hier keiner besser hat als du.',kameradschaft:2}}
  ]},

/* 3 */ {typ:'kampf',id:'montenotte',datum:'12. April 1796 · Montenotte',ort:'Höhenzug über Savona',
  marsch:{von:'Savona',nach:'Höhen von Montenotte',weg:'15 km bergauf · neun Stunden in der Nacht, Regen'},
  anmarsch:[
    'Um zehn Uhr abends heißt es antreten. Kein Licht, keine Trommel. Ihr geht in einer Reihe den Saumpfad hinauf, Mann hinter Mann, und wer stehen bleibt, bekommt den Kolben des Hintermanns in den Rücken.',
    'Es regnet seit vier Stunden. Der Pfad ist Lehm. Zweimal rutscht vor dir einer aus und reißt zwei andere mit, und jedes Mal wartet die Kolonne, bis sie wieder stehen. Niemand flucht laut.',
    'Gegen drei Uhr hält alles. Vierhundert Schritt weiter oben brennen Feuer. Man hat euch nicht gehört, weil der Regen lauter ist als ihr.',
    'Ihr legt euch in den nassen Ginster und wartet. Neben dir kaut ein Mann an einem Lederriemen, weil er nichts anderes zu kauen hat. Martel geht die Reihe ab und sieht jedem ins Gesicht, ohne etwas zu sagen.',
    'Dann wird es hell genug, dass man dreißig Schritt weit sieht, und vorne gibt einer den Befehl weiter, den du vier Sekunden später hörst.'
  ],
  lage:{gegner:'Österreichische Vorposten, etwa 3 000 Mann, halb angezogen',
        auftrag:'Den Höhenzug nehmen, bevor es hell wird',
        gelaende:'Nasser Hang, Ginster, oberhalb der Bäume keine Deckung',
        stellung:'Zweites Glied, rechter Flügel der Kompanie'},
  intro:'Es ist noch dunkel, als die Kolonne den Hang hinaufgeht. Oben stehen Österreicher, die nicht damit gerechnet haben, dass jemand bei diesem Wetter angreift. Du auch nicht.',
  runden:6,feindMoral:45,gefahr:10,
  sieg:{text:'Die Österreicher gehen zurück, erst geordnet, dann nicht mehr. Du stehst zwischen umgeworfenen Zelten und begreifst, dass ihr gewonnen habt, ohne dass es dir jemand gesagt hätte.',ruf:5,fert:{muskete:0}},
  niederlage:{text:'Die Linie hält nicht. Ihr geht den Hang hinunter, schneller als hinauf, und niemand sieht dabei zu.',ruf:-4,belastung:8}},

/* 4 */ {typ:'szene',id:'dego',datum:'15. April 1796 · Marsch auf Dego',ort:'Ligurische Alpen',
  marsch:{von:'Montenotte',nach:'Dego',weg:'12 km über zwei Sättel · dreißig Stunden mit vier Stunden Schlaf'},
  text:[
    'Dreißig Stunden Marsch mit vier Stunden Schlaf. Die Vorräte sind eine Vorstellung, die es in Papieren gibt und sonst nirgends.',
    'Am Nachmittag kommt ihr an einem Gehöft vorbei. Es ist nicht verlassen — hinter dem Fenster bewegt sich etwas. Der Sergent geht vorne und sieht es nicht.',
    'Hinter dir keucht ein Junge namens Guérin, achtzehn, seit drei Wochen dabei. Er hat seit gestern früh nichts gegessen und geht wie einer, der gleich nicht mehr geht.'
  ],
  optionen:[
    {label:'In das Gehöft gehen und nehmen, was da ist',hint:'Schnell, bevor die Kolonne weiterzieht',
     probe:{wert:'fouragieren',schw:40},kosten:'Fouragieren · Plünderung ist verboten',
     erfolg:{text:'Speck, Brot, ein halber Käse. Die Bäuerin schreit dich an in einer Sprache, die du nicht verstehst. Du legst zwei Sous auf den Tisch, was ungefähr nichts ist, und gehst.',
       ausr:{tornister:10},atem:12,belastung:5,geld:4},
     misserfolg:{text:'Das Haus ist schon geplündert. Du findest eine Handvoll Bohnen und den Geruch von Leuten, die vor dir da waren.',atem:3,belastung:4}},
    {label:'Guérin dein letztes Brot geben',hint:'Er schafft es sonst nicht bis Dego',
     kosten:'Kameradschaft ++ · du bleibst hungrig',
     erfolg:{text:'Er sagt nichts, isst und geht weiter. Zwei Stunden später hält er dich fest, als du auf dem Geröll wegrutschst. So funktioniert das hier.',
       kameradschaft:14,atem:-10,ruf:2}},
    {label:'Guérins Tornister mittragen',hint:'Konstitution · zwanzig Kilo mehr',
     probe:{wert:'konstitution',schw:50},kosten:'Konstitution',
     erfolg:{text:'Du nimmst ihm den Tornister ab und trägst zwei Tornister über einen Pass. Am Abend kannst du die Arme nicht heben. Der Sergent hat es gesehen.',
       kameradschaft:10,ruf:4,gunst:1,atem:-18},
     misserfolg:{text:'Nach einer Meile gibst du auf und wirfst ihm den Tornister vor die Füße. Er sagt nichts. Das ist schlimmer, als wenn er etwas gesagt hätte.',
       kameradschaft:-4,atem:-14,belastung:5}},
    {label:'Weitermarschieren und nichts sehen',hint:'Es geht dich nichts an',
     erfolg:{text:'Du gehst und siehst auf die Fersen des Vordermanns. Abends fehlt Guérin bei der Zählung. Am nächsten Morgen ist er wieder da, ohne Tornister und ohne Erklärung.',
       belastung:3,kameradschaft:-3}}
  ]},

/* 5 */ {typ:'szene',id:'mondovi',datum:'22. April 1796 · Mondovì',ort:'Piemont',
  marsch:{von:'Dego',nach:'Mondovì',weg:'70 km nach Westen · sieben Tage, drei davon im Schneeregen'},
  text:[
    'Sardinien hat um Waffenstillstand gebeten. Für euch heißt das: eine Stadt, die man nicht stürmen muss, und Quartier in Häusern statt auf Stein.',
    'Am zweiten Abend brennt in der Vorstadt ein Haus. Es sind Franzosen, die es angezündet haben — vier Mann aus der dritten Kompanie, betrunken, mit Sachen unter dem Arm, die ihnen nicht gehören.',
    'Der Befehl von oben ist unmissverständlich. Plünderung wird erschossen. Der Befehl von unten ist genauso deutlich: Man verrät keine Kameraden.',
    'Sergent Martel steht zehn Schritt weiter und sieht dich an, statt sie.'
  ],
  optionen:[
    {label:'Sie melden',hint:'Der Befehl ist der Befehl',kosten:'Ruf ++ · Kameradschaft −−',
     erfolg:{text:'Zwei werden erschossen, zwei ausgepeitscht. Der Bataillonschef merkt sich deinen Namen. Deine Kompanie auch, auf andere Weise.',
       ruf:8,gunst:3,kameradschaft:-22,belastung:8}},
    {label:'Sie wegschicken, bevor jemand kommt',hint:'Menschenkenntnis · schnell und leise',
     probe:{wert:'menschenkenntnis',schw:45},
     erfolg:{text:'Du redest schnell und leise, und sie sind weg, bevor die Patrouille um die Ecke biegt. Vier Männer schulden dir etwas. Martel hat es gesehen und sagt nichts.',
       kameradschaft:16,gunst:1,geld:6},
     misserfolg:{text:'Sie lachen dich aus. Die Patrouille kommt, es gibt ein Handgemenge, und du stehst mittendrin, als der Offizier eintrifft.',
       ruf:-5,kameradschaft:4,belastung:7}},
    {label:'Mitmachen',hint:'Es gibt Wein, Silber und Schuhe',kosten:'Geld ++ · sehr gefährlich',risk:true,
     probe:{wert:'kaltbluetigkeit',schw:55},
     erfolg:{text:'Du nimmst ein Paar Stiefel, einen Beutel Münzen und bist zurück im Quartier, bevor jemand zählt. Niemand fragt.',
       geld:40,ausr:{schuhe:35},belastung:10,ruf:-2},
     misserfolg:{text:'Die Patrouille greift dich am Arm. Man peitscht dich vor der Kompanie aus. Du kannst drei Tage nicht auf dem Rücken liegen und sechs Wochen niemandem in die Augen sehen.',
       ruf:-14,belastung:18,wunde:'Peitschenstriemen'}},
    {label:'Umdrehen und ins Quartier gehen',hint:'Nichts gesehen',
     erfolg:{text:'Du gehst. Am nächsten Morgen sind zwei Männer der dritten Kompanie tot und niemand redet darüber. Martel sagt beim Appell nur: „Sie waren gestern nicht da." Es ist keine Frage.',
       belastung:5}}
  ]},

/* 6 */ {typ:'kampf',id:'lodi',datum:'10. Mai 1796 · Brücke von Lodi',ort:'Über der Adda',
  marsch:{von:'Mondovì',nach:'Lodi an der Adda',weg:'220 km quer durch die Poebene · achtzehn Tage, zuletzt 40 km in einem Stück'},
  anmarsch:[
    'Achtzehn Tage Ebene. Maulbeerbäume, Reisfelder, Staub, der sich in den Augenwinkeln sammelt und dort bleibt. Zweimal Wein aus einem Fass, das jemand aufgeschlagen hat, sonst nichts Erwähnenswertes.',
    'Am Morgen des zehnten Mai steht ihr in Lodi, und die Stadt ist leer. Die Österreicher sind über die Adda und haben die Brücke stehen lassen, weil sie sie mit dreißig Geschützen bestreichen können. Das ist kein Versehen. Das ist die Absicht.',
    'Ihr wartet vier Stunden in den Gassen am Fluss. Vier Stunden sind lang. In der zweiten Stunde teilt jemand Branntwein aus, was er sonst nie tut, und danach redet keiner mehr über die Brücke.',
    'Ein Adjutant reitet vorbei, hält an und sagt dem Capitaine etwas, das du nicht hörst. Der Capitaine kommt zurück und sagt: „Kolonne. Zu sechst nebeneinander. Über die Brücke, ohne zu halten." Ohne zu halten sagt er zweimal.',
    'Vorne beginnen die Tambouren. Du stehst im vierten Glied und siehst nichts als den Rücken vor dir, und dahinter, zweihundert Schritt weit, das Holz und den Rauch.'
  ],
  lage:{gegner:'Sebottendorf mit 9 500 Mann und dreißig Geschützen am anderen Ufer',
        auftrag:'Über die Brücke und das jenseitige Ufer nehmen',
        gelaende:'Holzbrücke, 200 Schritt, keine Deckung, kein Ausweichen',
        stellung:'Viertes Glied der Sturmkolonne'},
  intro:'Die Brücke ist zweihundert Schritt lang, aus Holz, und am anderen Ende stehen dreißig österreichische Geschütze. Die Kolonne steht darauf und kommt nicht vor und nicht zurück. Vor dir ist Rauch, und in dem Rauch schlägt Geschützfeuer ins Holz und wirft Splitter, so lang wie dein Unterarm.',
  runden:9,feindMoral:78,gefahr:15,ruhm:true,
  sieg:{text:'Ihr kommt hinüber. Wie, weiß hinterher niemand genau zu sagen. Auf der Brücke liegen mehr Männer, als darauf gestanden haben, so kommt es dir vor. Am Abend nennt jemand den Oberbefehlshaber zum ersten Mal beim Spitznamen: le petit caporal.',
    ruf:16,belastung:14,nennung:true},
  niederlage:{text:'Die Kolonne weicht von der Brücke zurück. Es dauert eine Stunde, bis sie es noch einmal versuchen — ohne dich.',ruf:-6,belastung:16}},

/* 7 */ {typ:'elite',id:'mailand',datum:'15. Mai 1796 · Mailand',ort:'Einzug in die Lombardei',
  marsch:{von:'Lodi',nach:'Mailand',weg:'30 km nach Nordwesten · zwei Tage, zum ersten Mal auf einer gepflasterten Straße'}},

/* 8 */ {typ:'lager',id:'kantonierung',datum:'Ende Mai 1796 · vor Mailand',ort:'Kantonierung in Corsico',
  marsch:{von:'Mailand',nach:'Corsico',weg:'8 km vor die Stadt · Quartier in Scheunen, zwei Wochen'},
  abende:2,
  text:[
    'Mailand hat gezahlt. Zwanzig Millionen Livres, sagt man, und ein Teil davon ist tatsächlich bei der Truppe angekommen: Sold für vier Monate, in Münzen, die man anfassen kann.',
    'Die Halbbrigade liegt in Scheunen acht Kilometer vor der Stadt und tut zwei Wochen lang nichts. Es gibt einen Schuster im Dorf, einen Waffenschmied und einen Mann, der Pulver verkauft, das er nicht verkaufen dürfte.',
    'Von den vierhundert Mann des Bataillons sind dreihundertelf übrig. Die Lücken werden im Juli aufgefüllt, heißt es. Bis dahin steht ihr weiter auseinander.',
    'Zwei Abende, bevor es nach Süden gegen Mantua geht.'
  ],
  tun:['instand','schuhe','waffe','exerzieren','lesen','leute','ruhe']},

/* 9 */ {typ:'szene',id:'mantua',datum:'Juli 1796 · vor Mantua',ort:'Belagerung in den Sümpfen',
  marsch:{von:'Corsico',nach:'Mantua',weg:'150 km nach Südosten · neun Tage · die letzten zwanzig Kilometer durch Sumpfland'},
  text:[
    'Mantua liegt in einem Sumpf, und der Sumpf hat im Juli Fieber. Es sterben mehr Männer an der Luft als am Feind.',
    'Ihr grabt Laufgräben, die am nächsten Tag voll Wasser stehen, und wartet darauf, dass eine Festung aufgibt, die nicht aufgibt.',
    'Deine Muskete rostet in der Feuchtigkeit schneller, als du putzen kannst. Und der Fourier verteilt seit drei Wochen Rationen, die nicht stimmen.'
  ],
  optionen:[
    {label:'Die Muskete putzen, jeden Abend',hint:'Geschick · kostet jeden freien Abend',
     probe:{wert:'geschick',schw:35},
     erfolg:{text:'Du zerlegst das Schloss, ölst es mit Speck, wenn nichts anderes da ist, und hältst die Waffe trocken. Als es soweit ist, wird sie zünden. Das ist mehr, als die halbe Kompanie sagen kann.',
       ausr:{muskete:25},fert:{muskete:5}},
     misserfolg:{text:'Du putzt, und der Rost kommt wieder. Der Sumpf gewinnt.',ausr:{muskete:6}}},
    {label:'Dem Fourier auf die Finger sehen',hint:'Bildung · die Listen lesen können',
     probe:{wert:'bildung',schw:40},kosten:'Braucht Bildung',
     erfolg:{text:'Du kannst gerade genug lesen, um zu sehen, dass in der Liste hundertzwölf Mann stehen und in der Kompanie sechsundneunzig. Du sagst es Martel, nicht dem Fourier. Zwei Tage später stimmen die Rationen.',
       gunst:4,ruf:4,fert:{verwaltung:8},kameradschaft:6},
     misserfolg:{text:'Die Zahlen tanzen dir vor den Augen. Du hast nie richtig lesen gelernt, und hier merkst du es zum ersten Mal, dass dir das etwas kostet.',
       belastung:4,fert:{verwaltung:3}}},
    {label:'Im Sumpf fouragieren',hint:'Fouragieren · Fisch, Frösche, gestohlene Hühner',
     probe:{wert:'fouragieren',schw:45},
     erfolg:{text:'Aale aus den Gräben, ein Sack Mais aus einer Mühle. Die Korporalschaft isst drei Tage besser als das halbe Bataillon.',
       kameradschaft:12,atem:10,geld:5},
     misserfolg:{text:'Du stehst vier Stunden bis zu den Knien im Wasser und bringst nichts mit außer dem Fieber, das in diesem Wasser wohnt.',
       wunde:'Sumpffieber',atem:-15,belastung:6}},
    {label:'Schreiben lernen',hint:'Bildung · ein Sergent bringt es dir bei, gegen Schnaps',
     kosten:'Kostet Geld und jeden Abend',
     erfolg:{text:'Es ist mühsamer als Grabenschaufeln. Nach sechs Wochen kannst du deinen Namen schreiben und eine Liste lesen. In dieser Armee ist das mehr wert, als es klingt.',
       attr:{bildung:9},fert:{verwaltung:5},geld:-8,belastung:3}}
  ]},

/* 10 */ {typ:'kampf',id:'castiglione',datum:'5. August 1796 · Castiglione',ort:'Hügel bei Solferino',
  marsch:{von:'Belagerungslinien vor Mantua',nach:'Castiglione delle Stiviere',weg:'30 km nach Nordwesten · in zwei Nachtmärschen, die Belagerungsgeschütze bleiben im Sumpf zurück'},
  anmarsch:[
    'Die Belagerung wird abgebrochen. Hundertsiebzig Geschütze bleiben stehen, wo sie stehen, weil keine Pferde da sind, und ihr geht nach Norden. Wer die Geschütze zurücklässt, hat es eilig — das versteht auch einer, der nicht lesen kann.',
    'Zwei Nachtmärsche. Am zweiten Tag begegnet euch, was von zwei Bataillonen der 4. Halbbrigade übrig ist. Sie gehen in die andere Richtung und reden nicht.',
    'Am fünften August früh steht ihr auf einem Hügelrücken bei Solferino. Unter euch, zwei Kilometer weit, eine Ebene mit Maulbeerbäumen und darin die Weißröcke — nicht als Haufen, sondern in Linien, sauber, wie auf dem Exerzierplatz. Es sind sehr viele.',
    'Die Sonne steht schon um acht so, dass das Metall heiß wird. Man lässt euch die Tornister ablegen und in Reihen antreten und dann eine Stunde lang stehen.',
    'In dieser Stunde denkst du zum ersten Mal ohne Umschweife daran, dass die letzten vier Monate umsonst gewesen sein könnten.'
  ],
  lage:{gegner:'Wurmsers Entsatzarmee, etwa 25 000 Mann in geschlossener Ordnung',
        auftrag:'Die Höhe halten, bis der Umgehungsangriff im Rücken wirkt',
        gelaende:'Offener Hügelrücken, Maulbeerbäume, kein Schatten, 34 Grad',
        stellung:'Erstes Glied, Mitte des Bataillons'},
  intro:'Wurmser ist mit einer Entsatzarmee aus Tirol gekommen und hat euch von Mantua weggetrieben. Jetzt steht ihr wieder, auf einem Hügel, und es geht darum, ob die letzten vier Monate umsonst waren.',
  runden:7,feindMoral:58,gefahr:12,
  sieg:{text:'Die Österreicher gehen nach Norden zurück. Mantua ist wieder eingeschlossen, und ihr habt eine Armee geschlagen, die größer war als eure.',ruf:8},
  niederlage:{text:'Der Hügel geht verloren und mit ihm der halbe Tag. Ihr sammelt euch zwei Meilen weiter hinten.',ruf:-4,belastung:9}},

/* 11 */ {typ:'befoerderung',id:'verona',datum:'September 1796 · Verona',ort:'Neuaufstellung der Kompanien',
  marsch:{von:'Castiglione',nach:'Verona',weg:'45 km nach Osten · vier Tage, zum ersten Mal seit Mai wieder Quartier in einer Stadt'},
  text:[
    'Nach Castiglione zählt das Bataillon nach. Von den vierhundert Mann, die im April über die Pässe gegangen sind, stehen zweihunderteinundvierzig in der Reihe.',
    'Die Lücken werden aufgefüllt — mit Rekruten aus Frankreich, die aussehen wie du im April. Und die Stellen der Unteroffiziere werden neu besetzt, weil sie neu besetzt werden müssen.',
    'Der Capitaine sitzt an einem Tisch im Hof und geht eine Liste durch. Sergent Martel steht neben ihm.'
  ]},

/* 12 */ {typ:'lager',id:'feldlager',datum:'Oktober 1796 · bei Verona',ort:'Feldlager an der Etsch',
  marsch:{von:'Verona',nach:'Feldlager an der Etsch',weg:'6 km flussaufwärts · Zelte, Regen seit neun Tagen'},
  abende:2,
  text:[
    'Es regnet seit neun Tagen. Das Lager steht auf einem Acker, der keiner mehr ist, und alles, was Leder hat, wird weich und alles, was Eisen hat, wird braun.',
    'Aus Tirol kommt eine dritte österreichische Armee herunter — Alvinczi, sagt man, und diesmal in zwei Kolonnen. Es wird wieder losgehen, und alle wissen es.',
    'Die Rekruten aus dem September sitzen unter den Zeltbahnen und sehen aus, wie du im April ausgesehen hast. Einer von ihnen fragt dich, ob es stimmt, dass die Brücke von Lodi zweihundert Schritt lang ist.',
    'Zwei Abende, bevor der Befehl kommt.'
  ],
  tun:['instand','waffe','exerzieren','bajonett','fouragieren','leute','ruhe']},

/* 13 */ {typ:'kampf',id:'arcole',datum:'15.–17. November 1796 · Arcole',ort:'Damm im Sumpf von Alpone',
  marsch:{von:'Feldlager an der Etsch',nach:'Ronco am Alpone',weg:'25 km nach Südosten · Nachtmarsch über eine Pontonbrücke, ab Mitternacht'},
  anmarsch:[
    'Ihr geht um Mitternacht los und um zwei Uhr über eine Pontonbrücke, die unter jedem Schritt nachgibt. Danach ist rechts Sumpf und links Sumpf, und dazwischen ein Damm, auf dem drei Mann nebeneinander gehen.',
    'Bei Tagesanbruch steht die Kolonne. Vorne, achthundert Schritt weit, liegt ein Dorf hinter einem zweiten Damm, und in dem Dorf sind Kroaten, die seit zwei Tagen wissen, dass ihr kommt.',
    'Es ist der dritte Versuch. Von den ersten beiden liegen die Männer noch da, wo sie hingefallen sind, denn niemand kann sie holen. Ihr werdet über sie hinweggehen müssen.',
    'Ein Generaladjutant reitet den Damm entlang, gegen die Marschrichtung, und ruft etwas, das nach Aufmunterung klingt. Zwei Minuten später kommt er ohne Hut zurück.',
    'Vorne wird eine Fahne aufgerichtet. Neben dir sagt einer aus dem September: „Warum gehen wir nicht außen herum?" Niemand antwortet ihm, weil niemand die Antwort weiß.'
  ],
  lage:{gegner:'Kroatische Grenzer in Arcole, seit zwei Tagen eingegraben',
        auftrag:'Über den Damm und die Brücke von Arcole nehmen',
        gelaende:'Damm, drei Mann breit, beidseitig Sumpf · dritter Versuch',
        stellung:'In der Kolonne auf dem Damm, hinter den Grenadieren'},
  intro:'Der Damm ist so schmal, dass drei Mann nebeneinander gehen. Rechts und links Sumpf. Am anderen Ende Kroaten, die seit zwei Tagen wissen, dass ihr kommt. Es ist der dritte Versuch.',
  runden:9,feindMoral:74,gefahr:14,ruhm:true,
  sieg:{text:'Am dritten Tag geht es. Nicht, weil jemand tapferer geworden wäre, sondern weil jemand endlich auf die Idee kam, dass man den Sumpf auch umgehen kann. Auf dem Damm liegen die Männer der ersten beiden Tage.',
    ruf:14,belastung:16,nennung:true},
  niederlage:{text:'Der Damm bleibt österreichisch, und du liegst im Schilf, bis es dunkel wird.',ruf:-5,belastung:14}},

/* 14 */ {typ:'winter',id:'winter',datum:'Dezember 1796 · Verona',ort:'Winterquartier',
  marsch:{von:'Arcole',nach:'Verona',weg:'25 km zurück nach Nordwesten · drei Tage · zum ersten Mal seit November ein Dach'}},

/* 15 */ {typ:'kampf',id:'rivoli',datum:'14. Januar 1797 · Rivoli',ort:'Hochebene über der Etsch',
  marsch:{von:'Verona',nach:'Hochebene von Rivoli',weg:'30 km die Etsch hinauf · Gewaltmarsch in der Nacht vom 13. auf den 14., Schnee, Ankunft um zwei Uhr früh'},
  anmarsch:[
    'Der Befehl kommt am dreizehnten Januar um vier Uhr nachmittags, und um sechs seid ihr auf der Straße. Dreißig Kilometer die Etsch hinauf, im Dunkeln, bei Schnee, ohne Halt.',
    'Um zwei Uhr früh kommt ihr oben an. Es ist so kalt, dass der Atem in den Bärten gefriert, und so still, dass man die Geschütze der Vorausabteilung sechs Kilometer weit hört.',
    'Der Oberbefehlshaber ist selbst da. Er reitet in der Nacht über die Hochebene und sieht sich beim Schein von Fackeln an, wo die österreichischen Feuer brennen. Es sind sehr viele Feuer, in fünf Gruppen, und sie liegen um euch herum wie ein Hufeisen.',
    'Ihr legt euch für zwei Stunden auf den gefrorenen Boden, ohne Feuer, weil kein Feuer erlaubt ist. Schlafen kann niemand. Ein Mann aus der zweiten Kompanie steht in dieser Nacht auf, geht in den Schnee hinaus und kommt nicht wieder.',
    'Um halb sechs wird angetreten. Dir ist kalt bis in die Zähne, und deine Finger brauchen drei Versuche für den Riemen des Tornisters.'
  ],
  lage:{gegner:'Alvinczi in fünf Kolonnen, etwa 28 000 Mann, teils oberhalb von euch',
        auftrag:'Die Hochebene halten, bis Masséna heran ist',
        gelaende:'Hochebene, gefroren, offen · Steilabfall zur Etsch im Rücken',
        stellung:'Linker Flügel, gegen die Kolonne aus dem Tal'},
  intro:'Alvinczi kommt in fünf Kolonnen von den Bergen herunter, und einen halben Tag lang sieht es so aus, als würde das hier zu Ende gehen. Dann sieht es plötzlich anders aus.',
  runden:8,feindMoral:66,gefahr:13,ruhm:true,
  sieg:{text:'Die Kolonne, die euch in die Flanke fallen sollte, läuft in ihr eigenes Verderben. Am Nachmittag ist die österreichische Armee in Italien keine Armee mehr. Mantua wird in zwei Wochen fallen.',
    ruf:15,nennung:true},
  niederlage:{text:'Ihr weicht von der Hochebene. Andere gewinnen die Schlacht ohne dich.',ruf:-5,belastung:12}},

/* 16 */ {typ:'ende',id:'leoben',datum:'18. April 1797 · Leoben',ort:'Vorfrieden mit Österreich',
  marsch:{von:'Rivoli',nach:'Leoben in der Steiermark',weg:'400 km nach Nordosten über die Alpen · zehn Wochen, drei Pässe, kein Gefecht mehr'}}
];
