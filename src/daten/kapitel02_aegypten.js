'use strict';
/* Kapitel 2 — Ägypten 1798/99. Reine Daten, wie Kapitel 1.

   Eigener Charakter dieses Kapitels: Hitze und Krankheit töten mehr Männer
   als Kugeln, die Karrees halten gegen Reiterei, und nach Abukir ist die
   Flotte weg — niemand kommt nach Hause, niemand schreibt einen Brief, der
   ankommt. Gefahr-Zahlen der Gefechte bleiben im Band 9–14 aus Kapitel 1;
   das Sterben verlagert sich in die Szenen (Hitzschlag, Ruhr, Pest) und in
   den Anmarsch, der hier mehr kostet als in Italien (anmarschKosten). */

const KAPITEL2 = [
/* 17 */ {typ:'szene',id:'ueberfahrt',datum:'19. Mai – 1. Juli 1798 · Auf See',ort:'An Bord der Flotte',
  marsch:{von:'Toulon',nach:'Ägypten',weg:'4 000 km über Malta · sechs Wochen auf vierhundert Schiffen'},
  text:[
    'Vierhundert Schiffe, sechsunddreißigtausend Mann, und keiner an Bord weiß, wohin es geht. In Toulon hieß es England, auf Malta hieß es Indien. Die Offiziere wissen es auch nicht, sie tun nur so.',
    'Du liegst seit fünf Wochen in einem Zwischendeck, in dem man nicht aufrecht stehen kann, neben achtzig Männern und dem Geruch von achtzig Männern. Zweimal die Woche gibt es Zwieback, in dem es sich bewegt.',
    'Am 1. Juli früh ruft einer von oben, dass Land in Sicht ist. Eine flache, gelbe Küste, ein Minarett, sonst nichts. Jemand sagt: Ägypten. Ein anderer fragt, wo das liegt.'
  ],
  optionen:[
    {label:'Dich an Deck nützlich machen',hint:'Taue, Segel, was die Matrosen dir zeigen',
     probe:{wert:'geschick',schw:35},
     erfolg:{text:'Nach zwei Wochen lassen sie dich ans laufende Gut. Es ist Arbeit, und Arbeit ist besser als das Zwischendeck. Du kommst als einer der wenigen mit Luft in den Lungen an.',
       kameradschaft:6,atem:6},
     misserfolg:{text:'Du stehst im Weg, zweimal, und beim dritten Mal schickt dich der Bootsmann mit einem Tritt nach unten. Der Rest der Reise ist Zwischendeck.',belastung:4}},
    {label:'Mit den Matrosen um Sold spielen',hint:'Sie haben Karten und Zeit',
     probe:{wert:'menschenkenntnis',schw:45},
     erfolg:{text:'Du lernst ihr Spiel schneller, als sie glauben, und hörst rechtzeitig auf. Acht Francs, und keiner ist dir böse — sie haben ja noch fünf Wochen mit dir vor sich.',geld:8},
     misserfolg:{text:'Sie spielen das Spiel seit zwanzig Jahren. Du verlierst vier Francs und weißt bis heute nicht, wie.',geld:-4,kameradschaft:2}},
    {label:'In der Hängematte bleiben',hint:'Kräfte sparen',
     erfolg:{text:'Du schläfst, so gut man zwischen achtzig Männern schläft. Es ist keine Erholung, aber es ist auch keine Arbeit.',belastung:-5,atem:5,kameradschaft:-2}},
    {label:'Bei den Offizieren zuhören',hint:'Auf dem Achterdeck wird geredet',
     probe:{wert:'menschenkenntnis',schw:40},
     erfolg:{text:'Du trägst zweimal Kaffee nach achtern und hältst die Ohren offen. Die Worte „Alexandria" und „Wüste" fallen, drei Tage bevor sie verlesen werden. Ein Adjutant merkt sich dein Gesicht.',
       fert:{taktik:4},gunst:1},
     misserfolg:{text:'Man schickt dich nach unten, bevor du drei Sätze gehört hast. Oben ist oben und unten ist unten, auch auf einem Schiff.',belastung:2}}
  ]},

/* 18 */ {typ:'kampf',id:'alexandria',datum:'2. Juli 1798 · Alexandria',ort:'Sturm auf die Stadtmauer',
  marsch:{von:'Reede von Marabut',nach:'Alexandria',weg:'13 km Strand und Geröll · gelandet in der Nacht, ohne Wasser'},
  anmarschKosten:{verschleiss:0.1,atem:5,belastung:1},
  anmarsch:[
    'Die Landung ist nachts, bei Brandung, und sie ist ein Durcheinander. Boote schlagen um, Männer waten mit der Patronentasche über dem Kopf an Land, und zwanzig ertrinken dreißig Schritt vor Ägypten.',
    'Es gibt kein Wasser. Die Fässer sind auf den Schiffen geblieben, weil die Boote für Männer gebraucht wurden. Ihr marschiert ab drei Uhr früh am Strand entlang, und beim ersten Licht siehst du die Stadtmauer — alt, halb verfallen, und besetzt.',
    'Der Befehl ist einfach, weil es für etwas anderes an allem fehlt: hinauf und hinüber, bevor die Sonne hoch steht. Wer bis Mittag nicht in der Stadt ist, verdurstet davor.',
    'Neben dir schiebt einer den Ladestock mit den Zähnen zurück, weil seine Hände zittern. Nicht vor Angst, sagt er. Vor Durst.'
  ],
  lage:{gegner:'Stadtmiliz und Beduinen hinter einer verfallenen Mauer',
        auftrag:'Über die Mauer, bevor die Sonne hoch steht',
        gelaende:'Geröll, Bresche, kein Schatten, kein Wasser',
        stellung:'Sturmkolonne, zweites Glied'},
  intro:'Die Mauer ist alt und die Bresche breit, aber dahinter wird geschossen, und ihr habt seit der Nacht nichts getrunken.',
  runden:5,feindMoral:40,gefahr:9,
  sieg:{text:'Gegen Mittag ist die Stadt offen. In den Zisternen steht braunes Wasser, und ihr trinkt es, ohne zu fragen, was darin schwimmt.',ruf:4},
  niederlage:{text:'Der erste Sturm bricht in der Bresche zusammen. Der zweite, eine Stunde später, kommt durch — ohne dich in der ersten Reihe.',ruf:-3,belastung:8}},

/* 19 */ {typ:'lager',id:'quartier_alex',datum:'3.–9. Juli 1798 · Alexandria',ort:'Quartier in Alexandria',
  abende:2,
  text:[
    'Alexandria ist keine Stadt aus den Büchern der Offiziere, sondern ein heißer, weißer Haufen aus Lehm, Fliegen und Hunden. Die Halbbrigade liegt in einem Warenhaus am Hafen, das nach Fisch riecht.',
    'Plünderung ist verboten, bei Todesstrafe, und diesmal meint es jemand ernst. Gekauft werden darf — mit Geld, das hier niemand wechseln will.',
    'In einer Woche geht es landeinwärts, sagt man. Durch die Wüste, im Juli. Die Alten, die schon in Italien dabei waren, sehen sich die Wasserschläuche an und sagen nichts.',
    'Zwei Abende, bevor der Marschbefehl kommt.'
  ],
  tun:['instand','waffe','fouragieren','leute','scharf','ruhe']},

/* 20 */ {typ:'szene',id:'wuestenmarsch',datum:'10.–20. Juli 1798 · Wüste vor Damanhur',ort:'Marsch zum Nil',
  marsch:{von:'Alexandria',nach:'Nil bei Ramanieh',weg:'70 km Sand und Salzkruste · vier Tage, das Wasser aus Brunnen, die die Beduinen zugeschüttet haben'},
  text:[
    'Der Marsch beginnt um zwei Uhr früh und müsste um neun vorbei sein, ist es aber nie. Um zehn hat die Sonne den Sand so heiß, dass man ihn durch die Sohlen spürt, und die Luft flimmert, bis der Horizont Wasser zeigt, wo keines ist.',
    'Am zweiten Tag erschießt sich ein Mann aus der dritten Kompanie, mitten in der Kolonne, ohne ein Wort. Am dritten Tag sind es zwei.',
    'Die Brunnen am Weg sind zugeschüttet oder leer. Was in deinem Schlauch schwappt, ist warm wie Blut und wird bis zum Nil reichen müssen. Neben dir taumelt einer, dem der Speichel weiß am Mund steht.'
  ],
  optionen:[
    {label:'Das Wasser einteilen, Schluck für Schluck',hint:'Der Kopf gegen den Durst',
     probe:{wert:'kaltbluetigkeit',schw:40},kosten:'Kaltblütigkeit',
     erfolg:{text:'Ein Schluck jede Stunde, nicht mehr, auch wenn die Zunge am Gaumen klebt. Am vierten Tag ist noch ein Rest im Schlauch, und du gehst noch aufrecht.',atem:-4},
     misserfolg:{text:'Am Mittag des zweiten Tages ist der Schlauch leer, und die Sonne steht noch sechs Stunden hoch. Den Rest des Tages weißt du hinterher nicht mehr genau.',
       wunde:'Hitzschlag',zehrt:3,atem:-12}},
    {label:'Einen Brunnen abseits der Route suchen',hint:'Fouragieren · allein in der Wüste',
     probe:{wert:'fouragieren',schw:45},
     erfolg:{text:'Hinter einem Dünenzug ein Loch mit einem Rest brackigem Wasser. Du füllst deinen Schlauch und zwei fremde und holst die Kolonne wieder ein, bevor dich jemand als Nachzügler meldet.',
       atem:10,kameradschaft:8},
     misserfolg:{text:'Sand, Salzkruste, ein toter Esel. Du brauchst zwei Stunden, um die Kolonne wiederzufinden, und hast unterwegs getrunken wie ein Loch.',atem:-8,belastung:4}},
    {label:'Einem Taumelnden den Tornister abnehmen',hint:'Konstitution · zwanzig Kilo mehr, bei fünfzig Grad',
     probe:{wert:'konstitution',schw:50},
     erfolg:{text:'Du trägst zwei Tornister bis zum Abendlager. Der Mann heißt Perrin und wird es dir nicht vergessen. Der Lieutenant hat es gesehen und sagt nichts, aber er hat es gesehen.',
       kameradschaft:10,ruf:3,gunst:1,atem:-12},
     misserfolg:{text:'Nach einer Stunde stellst du den zweiten Tornister in den Sand. Perrin holt ihn sich wortlos. Ihr geht nebeneinander und sagt beide nichts.',
       kameradschaft:-3,atem:-10}},
    {label:'Die Karte des Adjutanten lesen',hint:'Kartenkunde · die Kolonne läuft einen Bogen',
     probe:{wert:'kartenkunde',schw:40},kosten:'Kartenkunde',
     erfolg:{text:'Du siehst über die Schulter des Adjutanten auf ein Blatt, das er selbst nicht versteht, und zeigst ihm, dass der Weg einen Bogen um eine Salzsenke macht, die nicht mehr da ist. Am Abend ist die Kolonne acht Kilometer weiter, als sie sein müsste. Der Adjutant nennt es seine Idee. Der Lieutenant weiß es besser.',
       atem:8,ruf:3,gunst:1,fert:{kartenkunde:6}},
     misserfolg:{text:'Die Linien auf dem Blatt sind Linien, mehr sagen sie dir nicht. Der Adjutant nimmt dir die Karte aus der Hand, ohne dich anzusehen.',
       belastung:3,fert:{kartenkunde:3}}},
    {label:'Nur die Füße setzen, einen vor den anderen',hint:'Nicht denken, nicht hinsehen',
     erfolg:{text:'Du siehst auf die Fersen des Vordermanns und zählst bis tausend und wieder von vorn. Irgendwann glitzert links etwas Grünes: der Nil. Männer laufen hinein, in Uniform, und saufen wie Vieh.',
       belastung:5,atem:-8}}
  ]},

/* 21 */ {typ:'kampf',id:'pyramiden',datum:'21. Juli 1798 · Embabeh',ort:'Karree am Nil',
  marsch:{von:'Ramanieh',nach:'Embabeh bei Kairo',weg:'150 km den Nil hinauf · neun Tage, endlich Wasser, dafür die Ruhr'},
  anmarschKosten:{verschleiss:0.25,atem:9,belastung:2},
  anmarsch:[
    'Am Morgen des einundzwanzigsten stehen drüben die Mamluken. Sechstausend Reiter, und sie sehen aus wie aus einem anderen Jahrhundert: Damaszenerklingen, Pistolenpaare, Seide über Kettenhemden. Hinter ihnen, klein und grau im Dunst, die Pyramiden.',
    'Die Order kommt die Front entlang: Karree auf Divisionsebene. Sechs Glieder tief die Kanten, die Ecken Artillerie, in der Mitte die Esel, die Gelehrten und der Tross. Jemand lacht darüber. Es ist das letzte Lachen für heute.',
    'Man erklärt es dir in einem Satz: Das Karree lebt, solange keine Kante bricht. Ein Reiter kommt an eine Wand aus Bajonetten nicht heran — aber wenn irgendwo ein Loch entsteht, sind sie drin, und dann ist es vorbei, für alle.',
    'Sie kommen gegen vier Uhr nachmittags. Erst ein Beben im Boden, dann Staub, dann Geschrei, das nicht menschlich klingt. Der Capitaine sagt, ganz ruhig: „Erst auf dreißig Schritt."',
    'Du stehst in der zweiten Reihe der Nordkante, das Bajonett auf Brusthöhe des ersten Pferdes, das kommen wird.'
  ],
  lage:{gegner:'Murad Bey mit 6 000 Mamluken-Reitern und Fußvolk am Fluss',
        auftrag:'Das Karree halten, komme was will',
        gelaende:'Ebene, Staub, Melonenfelder, der Nil im Rücken',
        stellung:'Nordkante des Karrees, zweites Glied'},
  intro:'Sie reiten Wellen, wie Wasser gegen eine Mauer, und die Mauer bist du. Zwischen den Angriffen hört man drüben die Verwundeten und die Pferde.',
  runden:7,feindMoral:60,gefahr:12,haerte:1.4,ruhm:true,
  sieg:{text:'Gegen Abend brennt Embabeh, und im Nil treiben Mamluken, die mit Gold in den Gürteln schwimmen wollten. Männer waten hinein und fischen Leichen nach Münzen. Es ist ein Sieg, wie ihn noch keiner gesehen hat, und er fühlt sich an wie ein Schlachthof.',
    ruf:13,belastung:10,nennung:true,geld:6},
  niederlage:{text:'Die Südkante bricht, heißt es später, und für eine Viertelstunde ist alles Staub und Schreie. Dass es am Ende doch gehalten hat, war nicht dein Verdienst und nicht deine Schuld — aber du warst am Boden, als es entschieden wurde.',
    ruf:-4,belastung:14}},

/* 22 */ {typ:'szene',id:'kairo_einzug',datum:'August 1798 · Kairo',ort:'Quartier in der eroberten Stadt',
  text:[
    'Kairo ist größer als Paris und lauter und fremder als alles, was du gesehen hast. Die Halbbrigade bezieht ein Viertel bei der Zitadelle, und drei Tage lang ist es fast so etwas wie Frieden.',
    'Dann kommt die Nachricht aus Abukir: Die englische Flotte hat eure Schiffe in der Bucht gestellt und versenkt. Die L’Orient ist mit der Kriegskasse in die Luft geflogen. Es gibt keinen Weg mehr nach Hause.',
    'Der Fourier liest die Nachricht vor, faltet das Blatt und sagt den einzigen Satz, den es dazu zu sagen gibt: „Dann sind wir jetzt Ägypter."',
    'Der Sold wird ab jetzt in einer Münze gezahlt, die keiner kennt, nach Listen, die keiner führt.'
  ],
  optionen:[
    {label:'Dem Fourier die Listen führen helfen',hint:'Verwaltung · irgendjemand muss es ja können',
     probe:{wert:'verwaltung',schw:35},
     erfolg:{text:'Du sitzt drei Abende über Soldlisten in zwei Währungen und findest den Fehler, den alle suchen. Der Fourier merkt sich das. Der Sergent-major auch.',
       gunst:2,ruf:2,fert:{verwaltung:6}},
     misserfolg:{text:'Die Zahlen sind arabisch, die Kurse erfunden, und nach zwei Abenden gibt der Fourier dir einen Krug und keine Listen mehr.',fert:{verwaltung:3},belastung:2}},
    {label:'Auf dem Basar handeln lernen',hint:'Menschenkenntnis · alles hat drei Preise',
     probe:{wert:'menschenkenntnis',schw:45},
     erfolg:{text:'Nach einer Woche weißt du, dass der erste Preis eine Beleidigung ist, der zweite ein Spiel und der dritte ein Geschäft. Du kaufst für die halbe Korporalschaft ein und behältst den Unterschied.',geld:10,kameradschaft:4},
     misserfolg:{text:'Du zahlst für einen Sack Datteln, was in Paris ein Abendessen kostet. Der Händler segnet dich beim Hinausgehen, und seine Söhne lachen.',geld:-5,belastung:3}},
    {label:'Ein paar Brocken Arabisch lernen',hint:'Vom Dolmetscher der Kompanie, gegen Tabak',
     erfolg:{text:'Wasser, Brot, wie viel, zu teuer. Zwanzig Wörter, mehr nicht — aber zwanzig Wörter sind hier mehr wert als ein ganzer Pariser Wortschatz.',
       attr:{bildung:4},geld:-3}},
    {label:'Die Nachricht von der Flotte versaufen',hint:'Dattelschnaps gibt es trotz allem',
     erfolg:{text:'Ihr sitzt zu zehnt auf einem Dach, trinkt Dattelschnaps und singt, bis die Nachbarn schimpfen. Nach Hause kommt keiner, aber heute Nacht ist das egal.',
       belastung:-8,geld:-4,kameradschaft:6,ruf:-1}}
  ]},

/* 23 */ {typ:'befoerderung',id:'kairo_musterung',datum:'September 1798 · Kairo',ort:'Musterung im Hof der Zitadelle',
  text:[
    'Die Armee zählt nach, was von ihr übrig ist. Nicht die Gefechte haben die Lücken gerissen — die Hitze, die Ruhr und die Augenkrankheit, die hier jeder zweite hat. In manchen Kompanien führt ein Caporal, wo ein Lieutenant stehen müsste.',
    'Die Stellen werden aufgefüllt, aus dem, was da ist. Der Capitaine sitzt an einem Klapptisch im Hof der Zitadelle, vor sich die Listen, neben sich den Sergent-major.',
    'Es ist dieselbe Prozedur wie in Verona, nur dass diesmal niemand fragt, wo die Vorgänger geblieben sind.'
  ]},

/* 24 */ {typ:'kampf',id:'aufstand',datum:'21.–22. Oktober 1798 · Kairo',ort:'Straßenkampf um die Stadt',
  anmarschKosten:{verschleiss:0.05,atem:2,belastung:1},
  anmarsch:[
    'Es beginnt an einem Morgen mit Geschrei von den Minaretten, das anders klingt als sonst. Bis Mittag sind die Gassen um die Al-Azhar-Moschee voller Barrikaden, und General Dupuy liegt mit einer Lanze im Leib in seinem Quartier.',
    'Der Befehl kommt kurz nach: Viertel für Viertel räumen. In Gassen, die so eng sind, dass man die Muskete nicht quer nehmen kann, gegen Männer, die jede Tür und jedes Dach kennen.',
    'Von den Dächern kommen Steine und Schüsse, aus den Fenstern kochendes Wasser. Der Mann vor dir bekommt einen Mühlstein auf die Schulter und ist von einer Sekunde auf die andere kein Soldat mehr, sondern Gepäck.'
  ],
  lage:{gegner:'Aufständische der Stadt, in den Gassen um die Al-Azhar',
        auftrag:'Das Viertel räumen, Haus für Haus',
        gelaende:'Gassen, zwei Mann breit · Dächer und Fenster gehören dem Feind',
        stellung:'Spitze eines Räumtrupps'},
  intro:'In der Gasse ist es dunkel, obwohl Mittag ist. Jede Tür kann eine Muskete sein, jedes Dach einen Stein werfen.',
  runden:6,feindMoral:50,gefahr:11,
  sieg:{text:'Am zweiten Abend feuert die Artillerie von der Zitadelle in die Stadt, und danach ist es still. Was in den Gassen liegt, wird drei Tage lang weggetragen. Es ist kein Sieg, auf den jemand anstößt.',ruf:6,belastung:8},
  niederlage:{text:'Euer Trupp bleibt in der zweiten Barrikade stecken und geht zurück, einen Verwundeten in der Mitte. Das Viertel räumen andere, mit Kanonen.',ruf:-4,belastung:10}},

/* 25 */ {typ:'winter',id:'kairo_winter',datum:'Dezember 1798 · Kairo',ort:'Winterquartier in der Zitadelle',
  text:[
    'Kairo im Dezember: zwanzig Grad, Sonne, und zum ersten Mal seit Toulon so etwas wie Ordnung. Sold in Münze, zweimal am Tag Essen, ein Dach.',
    'Es ist die einzige Zeit im Jahr, in der du entscheidest, was du tust. Drei Wochen — dann, heißt es, geht es nach Syrien, dem Osmanen entgegen, der über den Sinai kommt.'
  ]},

/* 26 */ {typ:'szene',id:'sinai',datum:'Februar 1799 · El-Arisch',ort:'Marsch durch den Sinai',
  marsch:{von:'Kairo',nach:'El-Arisch',weg:'300 km Sand und Steine · elf Tage, das Wasser aus Ziegenhäuten'},
  text:[
    'Der Sinai ist schlimmer als die Wüste vor Damanhur, weil er kein Ende zeigt. Elf Tage Geröll und Salz, und das Wasser schmeckt nach den Ziegenhäuten, in denen es hängt.',
    'Mit dem Wasser kommt die Ruhr. Wer sie hat, geht gekrümmt und bleibt öfter stehen, und irgendwann bleibt er sitzen. Die Karren sind voll mit Fiebernden, und die Gesunden ziehen die Karren, weil die Pferde verdurstet sind.',
    'Abends liegt das Lager still. Man hört nur die Kranken und den Wind, und beides klingt gleich.'
  ],
  optionen:[
    {label:'Bei den Kranken bleiben und anfassen',hint:'Feldchirurgie · jemand muss die Karren laden',
     probe:{wert:'feldchirurgie',schw:30},kosten:'Nah an der Ruhr',
     erfolg:{text:'Du hebst, wäschst und hältst Köpfe, elf Tage lang. Zwei von den Männern auf deinem Karren erreichen El-Arisch lebend, und einer davon sagt es dem Sergent-major.',
       kameradschaft:10,gunst:1,fert:{feldchirurgie:8}},
     misserfolg:{text:'Am siebten Tag krümmst du dich selbst. Die Ruhr fragt nicht, wer hilft und wer nicht.',
       wunde:'Ruhr',zehrt:4,kameradschaft:4}},
    {label:'Die Wasserwache übernehmen',hint:'Autorität · nachts an den Ziegenhäuten stehen',
     probe:{wert:'autoritaet',schw:40},
     erfolg:{text:'Zwei Nächte stehst du an den Wasserkarren und schickst Männer weg, die dreimal so lange dienen wie du. Es macht dich nicht beliebt. Es macht dich bekannt.',
       ruf:3,gunst:1,atem:-6},
     misserfolg:{text:'In deiner zweiten Nacht fehlen am Morgen zwei Häute. Niemand hat etwas gesehen, und der Lieutenant sieht dich an, als hättest du sie selbst getrunken.',
       ruf:-2,belastung:5}},
    {label:'Abstand halten von den Karren der Kranken',hint:'Die Ruhr springt über',
     erfolg:{text:'Du gehst am anderen Rand der Kolonne und wäschst dir die Hände mit Sand, wie es ein Alter dir gezeigt hat. Du bleibst gesund. Es sieht nur niemand als Leistung an.',
       belastung:4,kameradschaft:-4}},
    {label:'Nachts zu einer Oase ausscheren',hint:'Fouragieren · Datteln und vielleicht Wasser',
     probe:{wert:'fouragieren',schw:40},risk:true,
     erfolg:{text:'Eine Handvoll Palmen, ein Brunnen, der nach Schwefel schmeckt, aber ein Brunnen ist. Du bringst Datteln für den halben Zug mit und sagst nicht, woher.',
       atem:8,geld:4,kameradschaft:6},
     misserfolg:{text:'Die Oase ist bewohnt, und die Bewohner schießen. Du rennst eine Stunde durch dunklen Sand und findest die Kolonne mit mehr Glück als Richtung wieder.',
       belastung:6,atem:-8}}
  ]},

/* 27 */ {typ:'lager',id:'feldlager_akkon',datum:'März 1799 · vor Akkon',ort:'Belagerungslager an der Küste',
  marsch:{von:'El-Arisch',nach:'Saint-Jean-d’Acre',weg:'350 km über Gaza und Jaffa · in Jaffa hat die Armee gewütet, und danach kam die Pest'},
  abende:2,
  text:[
    'Akkon liegt auf einer Landzunge, mit dem Meer auf drei Seiten, und auf dem Meer liegen zwei englische Linienschiffe, die eure Belagerungsgeschütze abgefangen haben. Ihr grabt Laufgräben mit dem, was übrig ist.',
    'Hinter euch, in Jaffa, ist die Pest ausgebrochen. Das Wort wird im Lager nicht ausgesprochen; man sagt „das Fieber" und sieht sich dabei nicht an.',
    'In der Stadt sitzt Djezzar Pascha, den sie den Schlächter nennen, und auf der Mauer steht ein englischer Kapitän, der jeden Sturm kommen sieht, bevor er beginnt.',
    'Zwei Abende, bevor dein Abschnitt an die Gräben geht.'
  ],
  tun:['instand','waffe','exerzieren','bajonett','leute','ruhe']},

/* 28 */ {typ:'kampf',id:'akkon',datum:'März – Mai 1799 · Saint-Jean-d’Acre',ort:'Bresche in der Stadtmauer',
  anmarschKosten:{verschleiss:0.3,atem:8,belastung:3},
  anmarsch:[
    'Die Belagerung dauert jetzt sechzig Tage, und die Stadt steht noch. Acht Stürme hat es gegeben; nach jedem liegen mehr Männer im Graben vor der Bresche, und niemand kann sie holen.',
    'Die Geschütze, die die Mauer brechen sollten, liegen auf dem Meeresgrund oder stehen jetzt drüben auf der Mauer und schießen auf euch herunter. Was ihr habt, sind Feldkanonen, die an dem Gemäuer kratzen.',
    'Im Lager geht das Fieber um, und aus Jaffa kommen Gerüchte, die schlimmer sind als das Fieber. Die Männer stürmen inzwischen fast lieber, als im Lager zu warten — vorne stirbt man wenigstens schnell.',
    'Heute ist der neunte Sturm. Der Capitaine sagt nicht mehr „für Frankreich". Er sagt: „Vielleicht ist heute die Bresche breit genug." Er glaubt es selbst nicht.'
  ],
  lage:{gegner:'Djezzar Paschas Garnison, englische Kanoniere auf der Mauer',
        auftrag:'Durch die Bresche in die Stadt',
        gelaende:'Trockengraben voller Toter, dahinter die Bresche · neunter Versuch',
        stellung:'Zweite Sturmwelle'},
  intro:'Die Bresche ist zwanzig Schritt breit und dahinter haben sie eine zweite Mauer gebaut, während ihr die erste beschossen habt. Von See her feuern die Engländer der Länge nach durch den Graben.',
  runden:9,feindMoral:85,gefahr:14,haerte:1.4,ruhm:true,
  sieg:{text:'Ihr kommt bis hinter die Bresche und haltet euch dort einen halben Tag. Dann kommt der Befehl zurückzugehen — was ihr genommen habt, ist eine zweite Mauer, und dahinter steht eine dritte. Aber ihr wart drin, und alle haben es gesehen.',
    ruf:15,belastung:16,nennung:true},
  niederlage:{text:'Am 20. Mai bricht die Armee die Belagerung ab. Nachts, damit die Stadt es nicht sieht, mit vergrabenen Geschützen und Karren voller Kranker. Akkon war der erste Ort, der nicht gefallen ist, und jeder in der Kolonne weiß, dass das etwas bedeutet.',
    ruf:-3,belastung:15}},

/* 29 */ {typ:'szene',id:'rueckzug',datum:'Mai – Juni 1799 · Rückzug durch den Sinai',ort:'Die Straße nach Ägypten',
  marsch:{von:'Akkon',nach:'Kairo',weg:'600 km zurück · die Verwundeten auf Karren, die Pestkranken am Ende der Kolonne'},
  text:[
    'Der Rückzug ist schlimmer als jede Schlacht. Die Kolonne zieht einen Schweif aus Karren hinter sich her, und auf den Karren liegen Verwundete, Fiebernde und die, über die niemand spricht.',
    'Befohlen ist, dass alle Berittenen zu Fuß gehen und die Pferde die Karren ziehen. Der Befehl gilt vom General abwärts, und man sieht tatsächlich Offiziere im Sand stapfen. Es hilft trotzdem nicht für alle.',
    'Wer am Ende der Kolonne zurückbleibt, bleibt zurück. Nachts sieht man hinter dem Horizont die Feuer der Beduinen, die auf die Nachzügler warten.'
  ],
  optionen:[
    {label:'Wache bei der Nachhut übernehmen',hint:'Kaltblütigkeit · zwischen Kolonne und Beduinen',
     probe:{wert:'kaltbluetigkeit',schw:45},
     erfolg:{text:'Drei Nächte gehst du als Letzter, das Gewehr geladen, und sammelst auf, wer noch kriechen kann. Zwei Männer erreichen Ägypten, weil du hinter ihnen gegangen bist.',
       ruf:4,gunst:1,atem:-8},
     misserfolg:{text:'In der zweiten Nacht verlierst du im Dunkeln den Anschluss und findest ihn erst im Morgengrauen wieder. Was hinter dir passiert ist, willst du nicht wissen.',
       belastung:8,atem:-6}},
    {label:'Einen Pestkranken mit auf den Karren heben',hint:'Niemand sonst fasst ihn an',risk:true,
     probe:{wert:'konstitution',schw:45},kosten:'Das Fieber springt über',
     erfolg:{text:'Du packst ihn unter den Achseln, und niemand hilft dir. Er stirbt zwei Tage später trotzdem — aber auf einem Karren, nicht im Sand. Die Kompanie hat zugesehen und nichts gesagt. Das ist hier die höchste Form von Respekt.',
       kameradschaft:12,ruf:3,belastung:6},
     misserfolg:{text:'Drei Tage später hast du Fieber und einen Knoten in der Achsel. Der Feldscher sieht dich lange an, sagt „vielleicht nur das Lagerfieber" und geht schnell weiter.',
       wunde:'Fieber aus Jaffa',zehrt:4,belastung:10}},
    {label:'Das Zählen der Kolonne übernehmen',hint:'Verwaltung · abends fehlt immer jemand',
     probe:{wert:'verwaltung',schw:35},
     erfolg:{text:'Du führst die Abendliste deiner Kompanie: wer geht, wer fährt, wer fehlt. Es ist Schreibarbeit über Sterbende, aber sie sorgt dafür, dass morgens nach den Fehlenden gesucht wird.',
       gunst:1,ruf:2,fert:{verwaltung:5}},
     misserfolg:{text:'Deine Liste stimmt zwei Abende nicht, weil Männer sich totstellen lassen, um auf die Karren zu kommen. Der Fourier nimmt dir die Liste wieder ab.',fert:{verwaltung:3}}},
    {label:'Die Zugpferde vor den Karren übernehmen',hint:'Reiten · die Pferde sind so kaputt wie die Männer',
     probe:{wert:'reiten',schw:35},kosten:'Reiten',
     erfolg:{text:'Du gehst neben dem Handpferd, redest mit ihm und hältst es aus dem Tiefsand. Zwei Karren, die stehengeblieben wären, kommen bis Katia durch — und auf jedem liegen sechs Männer. Der Fourier fragt am Abend nach deinem Namen.',
       ruf:4,gunst:1,kameradschaft:8,fert:{reiten:8}},
     misserfolg:{text:'Das Pferd geht dir im Tiefsand in die Knie und steht nicht wieder auf. Was danach mit ihm geschieht, geschieht, weil zweihundert Männer seit vier Tagen nichts gegessen haben.',
       belastung:6,fert:{reiten:4}}},
    {label:'Marschieren und die Karren nicht ansehen',hint:'Es geht dich nichts an, solange du gehst',
     erfolg:{text:'Du gehst vierzehn Tage mit Blick auf die Fersen des Vordermanns. In Katia gibt es das erste klare Wasser, in Salihija Brot. Du bist durchgekommen, und mehr wolltest du nicht.',
       belastung:6,kameradschaft:-3}}
  ]},

/* 30 */ {typ:'kampf',id:'abukir',datum:'25. Juli 1799 · Abukir',ort:'Halbinsel von Abukir',
  marsch:{von:'Kairo',nach:'Abukir',weg:'220 km in sechs Tagen · ein osmanisches Heer ist dort gelandet, wo eure Flotte unterging'},
  anmarschKosten:{verschleiss:0.2,atem:7,belastung:2},
  anmarsch:[
    'Die Osmanen sind mit englischen Schiffen gekommen und haben sich auf der Halbinsel eingegraben: achtzehntausend Mann in zwei Linien, den Rücken zum Meer, an derselben Bucht, in der eure Flotte liegt.',
    'Ihr habt sechs Tagesmärsche in den Knochen und seid weniger als sie. Dafür habt ihr etwas, das sie nicht haben, sagt der Capitaine: einen Rücken, der nicht ans Wasser gelehnt ist.',
    'Der Plan ist einfach und böse: die Linien durchbrechen und die Hälfte des osmanischen Heeres ins Meer drücken. Wer nicht schwimmen kann, hat verloren, und schwimmen kann mit Kettenhemd niemand.',
    'Es ist derselbe Strand, an dem vor einem Jahr eure Schiffe brannten. Ein paar von den Alten sagen das laut. Es klingt nicht wie Trauer, es klingt wie eine offene Rechnung.'
  ],
  lage:{gegner:'Mustafa Pascha, 18 000 Mann in zwei Grabenlinien, den Rücken zum Meer',
        auftrag:'Die Linien durchbrechen, den Feind ins Meer werfen',
        gelaende:'Sandhalbinsel, Dünen, kein Ausweichen für keine Seite',
        stellung:'Erste Linie des Zentrums'},
  intro:'Vor euch zwei Grabenlinien im Sand, dahinter das Meer. Einer von euch beiden wird heute hineingedrückt.',
  runden:8,feindMoral:62,gefahr:12,ruhm:true,
  sieg:{text:'Als die zweite Linie bricht, rennen zehntausend Männer ins Wasser, weil hinter ihnen Bajonette sind und vor ihnen vielleicht die Schiffe. Die Bucht ist danach still, auf eine Art, die du nicht vergessen wirst. Es ist der vollständigste Sieg dieses Feldzugs, und niemand singt.',
    ruf:13,belastung:12,nennung:true},
  niederlage:{text:'Der erste Angriff bleibt im Graben liegen. Die Reserve holt am Nachmittag heraus, was du am Morgen nicht geschafft hast, und du hörst den Sieg aus der zweiten Reihe.',
    ruf:-4,belastung:12}},

/* 31 */ {typ:'szene',id:'abreise',datum:'24. August 1799 · Kairo',ort:'Die Armee erfährt es zuletzt',
  text:[
    'Am Morgen des 24. August heißt es, der Oberbefehlshaber sei zur Inspektion im Delta. Am Abend weiß es die ganze Stadt: Er ist in der Nacht mit zwei Fregatten nach Frankreich gesegelt. Mit ihm die besten Generäle und kein einziger von euch.',
    'Kléber übernimmt. In der Schreibstube, sagt man, hat er einen Satz gesagt, den keiner wiederholen darf und jeder wiederholt: „Er hat uns hier gelassen wie seine schmutzige Wäsche."',
    'Die Armee des Orients steht jetzt allein, sechstausend Kilometer von zu Hause, ohne Flotte, ohne Nachschub, ohne Datum für die Heimkehr.'
  ],
  optionen:[
    {label:'Den Mund halten und Dienst tun',hint:'Was ändert Reden',
     erfolg:{text:'Du stehst deine Wachen und putzt deine Muskete. Am dritten Tag merkt der Lieutenant, dass in deinem Zug am wenigsten geredet wird, und merkt sich, wessen Zug das ist.',
       ruf:2,belastung:4}},
    {label:'Mit den anderen fluchen',hint:'Einmal muss es raus',
     erfolg:{text:'Ihr flucht einen Abend lang, gründlich und mit System, vom Oberbefehlshaber abwärts. Danach geht es allen besser, und gedient wird trotzdem.',
       kameradschaft:8,belastung:-5,ruf:-1}},
    {label:'Kléber zuhören, wenn er die Front abreitet',hint:'Der Neue redet anders',
     probe:{wert:'menschenkenntnis',schw:40},
     erfolg:{text:'Kléber redet mit Sergenten wie mit Generälen und sieht jedem auf die Schuhe. Du hörst zweimal zu und verstehst: Der hier führt eine Armee, keine Karriere. Es beruhigt mehr, als es sollte.',
       fert:{taktik:4},gunst:1},
     misserfolg:{text:'Du stehst zu weit hinten und hörst nur den Tonfall. Immerhin: Der Tonfall ist gut.',belastung:2}},
    {label:'Ein Heimkehr-Gerücht weitererzählen',hint:'Es tut so gut, daran zu glauben',risk:true,
     probe:{wert:'menschenkenntnis',schw:50},
     erfolg:{text:'Du erzählst es so, dass es Hoffnung macht, ohne dass jemand dich beim Wort nimmt. Drei Abende lang ist die Stimmung besser. Mehr kann ein Gerücht nicht leisten.',kameradschaft:6},
     misserfolg:{text:'Das Gerücht läuft, wächst und platzt nach einer Woche. Und weil jeder weiß, wo es herkam, bist du jetzt der Mann, der Märchen erzählt.',ruf:-4,belastung:4}}
  ]},

/* 32 */ {typ:'ende',id:'ende_aegypten',datum:'Herbst 1799 · Kairo',ort:'Die Armee des Orients bleibt',
  text:[
    'Der Herbst kommt, so weit man das hier Herbst nennen kann. Die Armee des Orients hält Ägypten — ohne Flotte, ohne Nachschub, ohne Nachricht, wann jemand sie holt.',
    'Du hast zwei Feldzüge überstanden. Italien hat dich zum Soldaten gemacht; Ägypten hat dir gezeigt, dass die meisten nicht am Feind sterben. Von den Männern, die in Toulon an Bord gingen, ist jeder dritte nicht mehr da, und die wenigsten davon hat eine Kugel getroffen.',
    'Es heißt, irgendwann werden Schiffe kommen. Bis dahin wird gedient.'
  ],
  ausblick:'<b>Hier endet der Prototyp.</b> Kapitel 3 — die Garnisonsjahre 1800–04, in denen Bildung, Heirat und Beziehungen zählen — steht im Konzept, aber noch nicht im Code. Danach: Austerlitz.'}
];

/* Anmeldung: an das laufende Band anhängen und beim Verlauf eintragen. */
KAPITEL.push(...KAPITEL2);
STATIONEN.aegypten = KAPITEL2;
(KAMPAGNEN.find(k=>k.id==='aegypten')||{}).gebaut = true;
