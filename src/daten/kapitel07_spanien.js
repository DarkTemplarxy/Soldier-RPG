'use strict';
/* Kapitel 7 — Spanien 1808–1812. Reine Daten, wie die Kapitel davor.

   ══════════════════ Die eigene Regel ══════════════════

   **Es gibt hier keinen Ruhm. Nur Entscheidungen, bei denen niemand zusieht.**

   Das Moral-Kapitel, und das längste: vier Jahre in vierzehn Stationen, mit
   zwei harten Zeitsprüngen. Mechanisch ist Spanien die Umkehrung von allem,
   was das Spiel bisher belohnt hat:

   1. **`stumm:true`** an der Kampagne — Ruf aus Gefechten zählt halb, und
      Nennungen im Tagesbefehl gibt es nicht. Die Bulletins schweigen über
      Spanien, weil in Spanien nichts zu melden ist, was gut klänge. Wer hier
      aufsteigen will, tut es über die Kasse, die Listen und den
      Einheitszustand — die Werkzeuge des Capitaine.
   2. **`ueberfall:true`** an zwei Gefechten — kein Linienbeschuss (die
      zweihundert anderen sind nicht da), kurze Runden, hohe Gefahr, und
      Zurückweichen kostet keinen Ruf. **Es gibt keine Zeugen.**
   3. **Drei Repressalien-Szenen.** Dreimal stellt das Kapitel eine Frage, auf
      die es keine gute Antwort gibt. Jede Option hat einen Preis in einer
      anderen Währung: Kameradschaft, Einheitszustand, Belastung, Fürsprache.
      **Das Spiel wertet nie** — es führt nur Buch, und die Belastung ist das
      Buch.

   **Warum Rang 9 hier wohnt:** Vernet rückt auf, seine Kompanie wird deine —
   und Spanien ist der Ort, an dem eine Kompaniekasse etwas bedeutet. Der
   Nachschub muss gekauft werden, und der Inspecteur aux revues kommt selten.
   Die Auftragsachse (siegen ≠ Auftrag erfüllen) passt in keinen Krieg besser
   als in diesen, wo jeder taktische Sieg strategisch nichts ändert.

   ══════════════════ Historische Fixpunkte (Invariante 8) ══════════════════

   Einmarsch als „Verbündete" Frühjahr 1808 · der Aufstand von Madrid am
   2. Mai 1808 und die Erschießungen in der Nacht darauf · die Kapitulation
   von Bailén 22. Juli 1808, die erste einer französischen Armee überhaupt ·
   Somosierra 30. November 1808 · die zweite Belagerung von Saragossa
   Dezember 1808 bis Februar 1809, 54 000 Tote in einer Stadt · die
   Guerillajahre 1809–11 · der Abzug der besten Regimenter nach Osten im
   Frühjahr 1812. Dazwischen ist alles frei erfunden. */

const KAPITEL7 = [

/* 95 */ {typ:'szene',id:'bidassoa',datum:'Frühjahr 1808 · Über die Bidassoa',ort:'Als Verbündete',
  marsch:{von:'Garnison in Deutschland',nach:'Über die Pyrenäen',weg:'1 400 km nach Südwesten · und an der Grenze steht niemand, der schießt'},
  zwischenfall:true,
  text:[
    'Es ist kein Feldzug. Es steht in keinem Befehl, dass Krieg wäre. Spanien ist seit fünfzehn Jahren verbündet, die Truppen marschieren mit Erlaubnis der spanischen Regierung durch das Land, und das Ziel heißt Portugal, das die Kontinentalsperre nicht einhält.',
    'An der Bidassoa steht eine spanische Grenzwache und präsentiert das Gewehr. Man grüßt zurück.',
    'In den Dörfern dahinter stehen die Leute an den Straßen und sehen zu, wie ihr durchmarschiert. Sie winken nicht. Es ist nicht feindlich; es ist genauer als feindlich, und niemand in der Kolonne hat ein Wort dafür.',
    'Die Festungen von Pamplona und Barcelona werden im Vorbeigehen besetzt, mit Listen und Tricks, ohne einen Schuss. Es steht in keinem Befehl, warum.'
  ],
  optionen:[
    {label:'Marschieren und nichts denken',hint:'Es ist nicht dein Geschäft, und es wird deins',
     erfolg:{text:'Man geht durch ein Land, mit dem man nicht im Krieg ist, und besetzt im Vorbeigehen dessen Festungen. Wer darüber nachdenkt, denkt in eine Richtung, aus der man nicht zurückkommt. Also denkst du nicht darüber nach, wie alle anderen auch.',
       belastung:4}},
    {label:'Nachsehen, was in den Befehlen steht',hint:'Bildung · sie sind nicht verschlossen, nur langweilig',
     ab:{wert:'bildung',min:35,sonst:'Es hängen Anschläge an den Etappen. Was darauf steht, sagen dir andere, und was sie sagen, klingt jedes Mal ein bisschen anders.'},
     erfolg:{text:'In den Marschbefehlen steht nichts über Portugal. Es steht drin, welche spanische Festung wann von wem zu übernehmen ist, und daneben ein Wort, das man in einem Befehl an Verbündete nicht schreibt: „sichern". Du liest es zweimal und legst das Blatt zurück, wie es lag.',
       fert:{taktik:6,kartenkunde:4},belastung:6}},
    {label:'Mit den Leuten am Straßenrand reden',hint:'Menschenkenntnis · sie sagen nichts, und das ist die Auskunft',
     probe:{wert:'menschenkenntnis',schw:40},
     erfolg:{text:'Ein Mann mit einem Maultier lässt sich auf ein Gespräch ein, mit Händen und drei Wörtern. Er fragt nicht, wohin ihr geht. Er fragt, wann ihr wiederkommt, und meint damit etwas anderes als die Frage. Du verstehst ihn genau, ohne ein Wort seiner Sprache zu können.',
       attr:{menschenkenntnis:4},belastung:4},
     misserfolg:{text:'Sie gehen weg, wenn du näher kommst. Nicht schnell, nicht auffällig — sie haben nur plötzlich etwas anderes zu tun, alle gleichzeitig, in jedem Dorf.',
       belastung:6}}
  ]},

/* 96 */ {typ:'kampf',id:'madrid',datum:'2. Mai 1808 · Madrid',ort:'Der zweite Mai',
  stumm:true,
  marsch:{von:'Kaserne am Prado',nach:'Puerta del Sol',weg:'Zwei Kilometer durch eine Stadt, in der seit einer Stunde geschossen wird'},
  anmarschKosten:{verschleiss:0.1,atem:4,belastung:3},
  anmarsch:[
    'Am Morgen des 2. Mai versammelt sich vor dem Königspalast eine Menge, weil die letzten Mitglieder der königlichen Familie nach Frankreich gebracht werden sollen. Um zehn Uhr wird der erste Franzose erschlagen. Um elf brennt es an drei Stellen.',
    'Was folgt, ist kein Gefecht. Es ist eine Stadt mit vierzigtausend Häusern, aus denen geschossen wird, und dazwischen Gassen, in denen eine Kompanie nicht in Linie steht.',
    'Der Befehl lautet, die Straßen freizumachen. Was das heißt, wird nicht erklärt, und man versteht es nach der ersten Gasse.',
    'Zwischen den Leuten, die auf euch losgehen, sind Männer mit Messern, Handwerker mit Werkzeug und zwei Frauen mit einer Schere. Es ist nicht die Art von Feind, für die jemand ausgebildet worden ist.'
  ],
  lage:{gegner:'Die Einwohner von Madrid · dazu zwei spanische Artillerieoffiziere mit vier Geschützen',
        auftrag:'Die Straßen freimachen',
        gelaende:'Gassen, Fenster, Dächer · keine Linie, kein Feld',
        stellung:'Trupp zu zwölf Mann, ohne Anschluss'},
  intro:'Es wird kein Ruf verteilt. Über diesen Tag wird kein Bulletin geschrieben.',
  runden:6,feindMoral:45,gefahr:12,gelaende:'mauer',
  sieg:{text:'Am Nachmittag gehören die Straßen wieder euch. In den Gassen liegen an die vierhundert Einwohner und ungefähr hundertfünfzig Franzosen, und niemand wird je genau zählen.\\n\\nAbends wird ein Standgericht eingesetzt. Wer eine Waffe getragen hat, wird erschossen; als Waffe gilt auch eine Schere.',ruf:2},
  niederlage:{text:'Ihr kommt nicht durch die Gasse und zieht euch auf den Platz zurück, wo Artillerie steht. Was danach durch die Gasse geht, ist keine Infanterie mehr. Am Abend sind die Straßen frei.',ruf:-2,belastung:12}},

/* 97 */ {typ:'szene',id:'dritter_mai',datum:'3. Mai 1808 · Madrid, Príncipe Pío',ort:'Der Morgen danach',
  text:[
    'Das Standgericht hat die ganze Nacht getagt und ist schnell gewesen. Vor Tagesanbruch werden die Verurteilten in Gruppen auf einen Hügel am Stadtrand gebracht, wo eine Laterne steht.',
    'Es sind Handwerker, ein Bettler, drei Priester und ein Mann mit einem weißen Hemd, der die Arme ausbreitet und etwas ruft. Es sind an diesem Morgen ungefähr vierhundert.',
    'Die Kompanie ist zum Dienst eingeteilt. Es ist kein Gefecht, es ist eine Ausführung, und im Befehl steht das Wort „Vollstreckung", das bisher in keinem Befehl gestanden hat, den du gehört hast.',
    'Ein Maler, der in dieser Stadt lebt, wird das in sechs Jahren auf ein Bild bringen, und das Bild wird länger überdauern als alles, was diese Armee sonst getan hat.'
  ],
  optionen:[
    {label:'Antreten und schießen',hint:'Es ist ein Befehl, und Befehle werden ausgeführt',
     erfolg:{text:'Du stehst in der Reihe, du legst an, und auf das Kommando schießt du. Danach wird nachgeladen und die nächste Gruppe gebracht. Es dauert bis in den Vormittag. Am Nachmittag hast du Wachdienst und isst zu Abend, und beides geht.',
       belastung:18,einheit:5}},
    {label:'Dich krankmelden',hint:'Menschenkenntnis · es glaubt dir niemand, und das ist nicht der Punkt',
     probe:{wert:'menschenkenntnis',schw:45},
     erfolg:{text:'Du gehst zum Feldscher und sagst, du könnest nicht. Der Feldscher sieht dich an, sagt nichts und schreibt etwas auf, das nicht stimmt. Ein anderer steht an deiner Stelle in der Reihe. Er weiß, warum, und ihr redet nie darüber.',
       belastung:8,kameradschaft:-8,gunst:-1,gunstVon:'vernet'},
     misserfolg:{text:'Der Sergent hört sich das an, sagt „Antreten" und geht weiter. Du trittst an. Der Unterschied zwischen dir und den anderen ist, dass du es versucht hast, und dieser Unterschied ist am Nachmittag nichts mehr wert.',
       belastung:22,kameradschaft:-4}},
    {label:'Die Laterne halten',hint:'Jemand muss sie halten, und dann schießt man nicht',
     erfolg:{text:'Du meldest dich für die Laterne. Sie steht vier Schritt neben den Verurteilten und beleuchtet sie, damit die Reihe etwas sieht. Du schießt nicht. Du siehst dafür jeden Einzelnen von ihnen aus vier Schritt Entfernung an, mehrere Stunden lang, und keiner der anderen tut das.',
       belastung:24,attr:{kaltbluetigkeit:5}}},
    {label:'Nachher die Namen aufschreiben',hint:'Verwaltung · es verlangt niemand, und es fragt auch niemand',
     ab:{wert:'bildung',min:40,sonst:'Es wird nichts aufgeschrieben. Am Nachmittag weiß niemand mehr, wer es war, und in einer Woche weiß es überhaupt niemand mehr.'},
     erfolg:{text:'Du gehst nachher mit einem Blatt über den Hügel und schreibst auf, was zu erfahren ist: dreiundvierzig Namen, elf Berufe, vier Straßen. Es verlangt niemand von dir. Es fragt auch niemand danach. Das Blatt liegt später in deinem Tornister und wird nass und unleserlich, und du weißt die Namen trotzdem noch.',
       belastung:20,fert:{verwaltung:6},attr:{menschenkenntnis:4}}}
  ]},

/* 98 */ {typ:'lager',id:'quartier_madrid',datum:'Sommer 1808 · Madrid',ort:'Quartier in einer besetzten Hauptstadt',
  abende:3,
  tun:['exerzieren','bajonett','scharf','instand','schuhe','waffe','lesen','ruhe','leute','fouragieren'],
  rangTun:{3:['korporalschaft'],4:['listen'],5:['sektion','rekruten'],7:['fechtboden','zugfuehren','karten','adjutant'],9:['kasse_ganz','kasse_ueblich','kasse_voll']},
  text:[
    'Madrid im Juli ist heiß, still und voll. Die Läden sind offen, die Preise haben sich verdreifacht, und man wird bedient, ohne angesehen zu werden.',
    'Am 22. Juli kommt eine Nachricht aus Andalusien, die niemand glaubt: Bei Bailén hat ein französisches Korps kapituliert. Achtzehntausend Mann, mit Waffen, Fahnen und Generalen, vor einer spanischen Armee, über die man seit Monaten Witze macht.',
    'Es ist die erste Kapitulation einer französischen Armee seit 1793. In der Kompanie wird das drei Tage lang bestritten, dann geglaubt, dann nicht mehr erwähnt.',
    'Ende Juli wird Madrid geräumt. Ihr marschiert nach Norden hinter den Ebro und lasst eine Stadt zurück, in der ihr im Mai vierhundert Menschen erschossen habt.'
  ]},

/* 99 */ {typ:'kampf',id:'somosierra',datum:'30. November 1808 · Somosierra',ort:'Der Hohlweg',
  stumm:true,
  marsch:{von:'Aranda de Duero',nach:'Der Pass von Somosierra',weg:'60 km bergauf · Schnee auf 1 400 Metern, im November'},
  anmarschKosten:{verschleiss:0.2,atem:8,belastung:2},
  anmarsch:[
    'Der Kaiser ist selbst gekommen, mit hundertdreißigtausend Mann, und räumt in sechs Wochen auf, was ein halbes Jahr gedauert hat. Zwischen ihm und Madrid liegt ein Pass, in dem sich neuntausend Spanier mit sechzehn Geschützen eingegraben haben.',
    'Der Hohlweg ist vier Kilometer lang, an der schmalsten Stelle sechs Schritt breit, und alle achthundert Meter steht eine Batterie quer.',
    'Am Vormittag versuchen es drei Infanteriebataillone von den Hängen aus. Es geht nicht. Gegen elf gibt der Kaiser einen Befehl, den ein Adjutant zweimal zurückfragen muss, und dann reitet eine Eskadron polnischer Chevaulegers den Hohlweg hinauf.',
    'Man sieht es von unten. Es dauert acht Minuten. Von hundertfünfundzwanzig Reitern kommen etwa fünfzig oben an, und der Pass ist offen. Danach geht ihr zu Fuß hinterher und macht die Arbeit, über die niemand redet.'
  ],
  lage:{gegner:'Spanische Infanterie und sechzehn Geschütze, gestaffelt im Hohlweg',
        auftrag:'Hinter der Attacke aufräumen und die Batterien besetzen',
        gelaende:'Vier Kilometer Hohlweg, an der engsten Stelle sechs Schritt',
        stellung:'Erstes Treffen, hinter der Kavallerie'},
  intro:'Die Sache ist entschieden, bevor du losgehst. Was danach kommt, macht die Infanterie, und es kommt in kein Bulletin.',
  runden:6,feindMoral:55,gefahr:12,gelaende:'bruecke',
  sieg:{text:'Gegen zwei Uhr gehört der Pass euch. In den Batteriestellungen liegen Bedienungen an ihren Geschützen, weil sie nicht weggelaufen sind, und im Hohlweg liegen Pferde.\\n\\nAm Abend wird der Tagesbefehl verlesen. Er nennt die Polen. Er nennt sonst niemanden, und das ist richtig so.',ruf:4},
  niederlage:{text:'Ihr kommt bis zur zweiten Batterie und bleibt dort. Was die dritte und vierte nimmt, sind zwei Stunden später andere. Der Pass ist offen; genannt werden die Polen.',ruf:-2,belastung:10}},

/* 100 */ {typ:'befoerderung',id:'musterung_madrid',datum:'Dezember 1808 · Madrid',ort:'Musterung in der wiedergenommenen Stadt',
  keinZiel:'Es sind Stellen frei. Nur nicht die eine, die über dir liegt — und in einem Krieg, über den nicht berichtet wird, dauert es länger, bis ein Name nach oben durchdringt.',
  text:[
    'Madrid ist am 4. Dezember gefallen, nach vier Tagen. Gemustert wird im selben Kasernenhof wie im Mai, und die Hälfte der Kompanie war im Mai dabei.',
    'Was zählt, ist in diesem Krieg etwas anderes als sonst. Es gibt keine Bulletins über Spanien, keine Nennungen, keine Schlacht, deren Namen man einem Vater erzählen könnte. Was zählt, sind die Listen: wer seine Leute beisammen hat, wer seine Rationen abrechnen kann, wessen Kompanie im März noch Schuhe hat.',
    'Der Capitaine sagt das nicht so. Er sagt: Hier gewinnt man nichts, man verliert nur langsamer. Dann geht er die Liste durch.'
  ]},

/* 101 */ {typ:'kampf',id:'saragossa',datum:'Januar–Februar 1809 · Saragossa',ort:'Haus um Haus',
  haerte:1.4, stumm:true,
  marsch:{von:'Winterlager bei Tudela',nach:'Vor die Mauern von Saragossa',weg:'80 km den Ebro hinauf · und dann sechs Wochen keinen Schritt weiter'},
  anmarschKosten:{verschleiss:0.25,atem:8,belastung:4},
  anmarsch:[
    'Saragossa ist schon einmal belagert worden, im Sommer, und die Belagerung ist abgebrochen worden. Diesmal nicht.',
    'Die Stadt hat keine richtigen Festungswerke. Sie hat Klöster mit meterdicken Mauern, Häuser aus Bruchstein und dreißigtausend Einwohner, die nicht daran denken zu gehen. Nach dem Fall der Außenwerke geht der Kampf in den Straßen weiter, dann in den Häusern, dann von Zimmer zu Zimmer.',
    'Die Pioniere sprengen sich durch die Wände, weil man auf der Straße nicht vorwärtskommt. Man nimmt ein Haus, indem man ein Loch in die Wand des nächsten sprengt und hineingeht.',
    'In der Stadt herrscht Typhus. Von den Verteidigern sterben mehr an der Seuche als am Feuer, und irgendwann gilt das auch für euch.'
  ],
  lage:{gegner:'Die Einwohner und die Reste zweier Divisionen · dreißigtausend, die nicht gehen',
        auftrag:'Das Kloster im Abschnitt nehmen, Zimmer für Zimmer',
        gelaende:'Mauern, Keller, gesprengte Wände · keine Sicht über zehn Schritt',
        stellung:'Sturmtrupp zu zwanzig, mit Pionieren'},
  intro:'Das hier wird kein gewöhnliches Gefecht. Es dauert sechs Wochen, und am Ende zählt niemand mehr, wer gestorben ist.',
  runden:9,feindMoral:80,gefahr:15,gelaende:'mauer',
  sieg:{text:'Am 20. Februar wird kapituliert. In der Stadt liegen vierundfünfzigtausend Tote — Soldaten, Einwohner, Kinder —, und die Überlebenden marschieren zwischen zwei Reihen hindurch, die schweigen.\\n\\nEin Bulletin darüber gibt es nicht. Es gibt einen Bericht an den Kriegsminister, in dem das Wort „Beispiel" vorkommt.',ruf:6},
  niederlage:{text:'Euer Abschnitt kommt drei Wochen lang nicht über eine Straße. Was das Kloster nimmt, ist im Februar ein anderes Regiment mit mehr Pulver. Die Stadt kapituliert am 20. Februar; vierundfünfzigtausend Tote, und keiner davon gehört zu deinem Erfolg.',ruf:-3,belastung:14}},

/* 102 */ {typ:'kampf',id:'strasse',datum:'Sommer 1809 · Zwischen Burgos und Vitoria',ort:'Die Straße, die keine ist',
  ueberfall:true, stumm:true,
  marsch:{von:'Etappenort Briviesca',nach:'Nach Norden, angeblich',weg:'40 km, für die man einen ganzen Tag und dreißig Mann Bedeckung braucht'},
  anmarschKosten:{verschleiss:0.15,atem:5,belastung:3},
  anmarsch:[
    'Zwischen zwei französischen Posten liegen vierzig Kilometer Straße, und die Straße gehört niemandem. Sie gehört tagsüber dem, der gerade darauf marschiert, und nachts denen, die in den Hügeln daneben wohnen.',
    'Der Auftrag heißt Depeschenbegleitung. Es sind dreißig Mann für einen Reiter mit einer Ledertasche.',
    'Nach zwölf Kilometern beginnt der Beschuss aus dem Hang, von vier oder sechs Leuten, die man nicht sieht. Sie schießen nicht schnell und nicht besonders gut. Sie schießen nur, ohne aufzuhören, und alle zwanzig Minuten trifft einer.',
    'Es gibt keine Linie, die von allein mitschießt. Es gibt keine zweihundert anderen. Es gibt euch dreißig und einen Hang, und niemanden, der zusieht.'
  ],
  lage:{gegner:'Sechs bis zwölf Männer im Hang · keine Uniform, keine Fahne, kein Name',
        auftrag:'Den Kurier durchbringen',
        gelaende:'Straße im Talgrund, Hänge mit Ginster und Fels beidseits',
        stellung:'Dreißig Mann in Marschordnung'},
  intro:'Keine Linie hilft. Zurückweichen kostet keinen Ruf — es sieht niemand.',
  runden:5,feindMoral:35,gefahr:17,gelaende:'wueste',
  sieg:{text:'Nach vier Stunden hört es auf, weil sie weggehen, nicht weil ihr sie vertrieben hättet. Der Kurier kommt durch. Auf der Straße bleiben zwei von euch, und im Hang findet ihr eine Patronentasche und einen Schuh.\\n\\nIm Bericht steht: Depesche zugestellt. Mehr steht nicht drin, und mehr wird auch nicht gefragt.',ruf:3},
  niederlage:{text:'Ihr geht zurück auf den Posten, den ihr am Morgen verlassen habt. Der Kurier geht mit; er reitet am nächsten Tag mit einer stärkeren Bedeckung. Es steht nichts darüber in irgendeinem Bericht, und es fragt auch niemand.',ruf:0,belastung:8}},

/* 103 */ {typ:'winter',id:'besatzung',datum:'1810 · Ein Jahr Besatzung',ort:'Vier Jahreszeiten in Altkastilien',
  wochen:4,
  tun:['ausr','drill','lesen','leute','ruhe','marketender','verdienst','wirtshaus'],
  rangTun:{4:['magazin'],5:['ausbilden','schreiber','strafdienst'],7:['fechtboden']},
  frage:'Ein Jahr. Vier Abschnitte. Was tust du damit?',
  text:[
    'Ein Jahr, in dem es keine Schlacht gibt und trotzdem jede Woche jemand fehlt. Die Kompanie liegt in einer Kleinstadt, hält zwei Straßen und einen Konvoiweg, und verliert im Schnitt zwei Mann im Monat an Leute, die man nie zu sehen bekommt.',
    'Man gewöhnt sich an alles: an die Wachen zu zweit, daran, nie allein zum Brunnen zu gehen, daran, dass die Wirtin freundlich ist und ihr Sohn seit April nicht mehr da ist.',
    'Nach Frankreich geht Post, aber nichts, was man schreiben könnte. Es gibt keine Schlachtnamen. Es gibt nur Daten und Ortsnamen, die zu Hause niemand kennt.',
    'Die Kompaniekasse ist in diesem Jahr wichtiger als die Muskete. Was nicht gekauft wird, kommt nicht; was nicht kommt, fehlt im Winter.'
  ]},

/* 104 */ {typ:'szene',id:'dorf_und_name',datum:'Frühjahr 1810 · Ein Dorf in der Sierra',ort:'Der Befehl mit deinem Namen',
  text:[
    'Aus einem Dorf mit siebzig Häusern ist vor vier Tagen auf einen Nachschubzug geschossen worden. Vier Tote, zwei Wagen weg. Die, die geschossen haben, sind nicht aus dem Dorf; das weiß man, und es steht nicht im Befehl.',
    'Der Befehl kommt schriftlich vom Brigadekommando. Er nennt das Dorf, er nennt eine Frist, und er nennt das Wort „Exempel". Unten steht der Name des Empfängers, und das bist du.',
    'Ein schriftlicher Befehl ist etwas anderes als ein mündlicher. Ein mündlicher verschwindet. Ein schriftlicher liegt in zwei Akten, und in einer davon steht dein Name neben dem, was danach passiert ist.',
    'Es sind siebzig Häuser, vielleicht zweihundertfünfzig Menschen, davon achtzig unter zwölf.'
  ],
  optionen:[
    {label:'Den Befehl ausführen',hint:'Er ist schriftlich, und er ist eindeutig',
     erfolg:{text:'Ihr räumt das Dorf und brennt es nieder. Es dauert vier Stunden. Es kommt niemand um, weil ihr sie vorher hinausgetrieben habt, und das ist die Auslegung, für die du dich entschieden hast, ohne dass jemand danach gefragt hätte.\\n\\nIm Bericht steht „Exempel vollzogen". Vier Wochen später wird auf demselben Weg wieder geschossen, von mehr Leuten als vorher.',
       belastung:20,einheit:8,gunst:1,gunstVon:'grandmaison'}},
    {label:'Den Befehl ausführen und dabei zählen',hint:'Verwaltung · was man aufschreibt, ist nicht ungeschehen — aber es ist aufgeschrieben',
     ab:{wert:'bildung',min:45,sonst:'Was aufgeschrieben wird, schreibt der Fourier, und der Fourier schreibt, was üblich ist.'},
     erfolg:{text:'Du führst ihn aus, und du führst ein Verzeichnis: siebzig Häuser, zweihundertneununddreißig Einwohner, elf Namen von Familien mit Kindern unter zwei Jahren, dazu die Zahl der Ziegen. Das Verzeichnis geht mit dem Bericht nach oben, und im Bericht steht deshalb keine runde Zahl.\\n\\nEin Adjutant fragt später, warum du das getan hast. Du hast keine Antwort, die man aufschreiben könnte.',
       belastung:24,einheit:6,fert:{verwaltung:8},gunst:1,gunstVon:'grandmaison'}},
    {label:'Das Dorf räumen, aber nicht brennen',hint:'Taktik · und im Bericht steht dann etwas, das nicht stimmt',risk:true,
     probe:{wert:'taktik',schw:50},
     erfolg:{text:'Du lässt räumen, lässt zwei leere Scheunen anzünden, damit der Rauch von weitem stimmt, und ziehst ab. Der Bericht ist so geschrieben, dass er nicht widerlegt werden kann, ohne dass jemand hinreitet. Es reitet niemand hin.\\n\\nDrei Monate später wird auf demselben Weg nicht mehr geschossen. Ob das damit zu tun hat, wird nie jemand wissen, und du am wenigsten.',
       belastung:12,kameradschaft:6,einheit:-6},
     misserfolg:{text:'Ein Lieutenant deiner eigenen Kompanie schreibt einen zweiten Bericht. Er tut es nicht aus Bosheit, sondern weil es Vorschrift ist. Vier Wochen später steht in einer Akte, dass ein Befehl nicht vollzogen worden ist, und daneben dein Name.',
       belastung:16,ruf:-8,gunst:-3,gunstVon:'grandmaison',einheit:-8}},
    {label:'Den Befehl zurückgeben',hint:'Taktik · man kann widersprechen. Es kostet, und man behält selten recht',risk:true,
     ab:{wert:'rang',min:8,sonst:'Man gibt einen schriftlichen Befehl nicht zurück. Nicht auf deiner Stufe, und nicht in diesem Krieg.'},
     probe:{wert:'taktik',schw:50},
     erfolg:{text:'Du reitest zum Brigadekommando und legst dar, was ein niedergebranntes Dorf in dieser Provinz kostet, in Männern, über die nächsten sechs Monate gerechnet. Du hast Zahlen dabei. Der General hört zu, sagt nichts und zieht den Befehl zurück, ohne zu erklären, warum.\\n\\nEr wird es dir nicht vergessen. Beides nicht.',
       belastung:8,ruf:6,gunst:-1,gunstVon:'grandmaison',fert:{taktik:8}},
     misserfolg:{text:'Du legst dar, was es kostet. Der General hört zu, bis du fertig bist, und sagt dann, der Befehl gelte. Er gilt. Ausgeführt wird er von einer anderen Kompanie, und die zählt nicht mit.',
       belastung:16,gunst:-3,gunstVon:'grandmaison'}}
  ]},

/* 105 */ {typ:'kampf',id:'konvoi',datum:'1811 · Auf dem Weg nach Ciudad Rodrigo',ort:'Der Konvoi',
  ueberfall:true, stumm:true,
  marsch:{von:'Salamanca',nach:'Ciudad Rodrigo',weg:'90 km mit sechzig Wagen · vier Tage, und jeder Tag hat eine Stelle'},
  anmarschKosten:{verschleiss:0.15,atem:6,belastung:2},
  anmarsch:[
    'Sechzig Wagen mit Mehl, Pulver und Schuhen für eine Garnison, die seit sieben Wochen nichts bekommen hat. Bedeckung: eine Kompanie und dreißig Reiter.',
    'Am dritten Tag, an einer Stelle, wo die Straße zwischen zwei Hängen durchgeht, hört es an der Spitze auf zu fahren.',
    'Was jetzt zählt, sind nicht die Toten. Was zählt, sind die Wagen: wie viele in Ciudad Rodrigo ankommen. Das steht so im Auftrag, und es ist das erste Mal, dass ein Auftrag das ausdrücklich sagt.',
    'Man kann alle Wagen retten und dabei die halbe Kompanie verlieren. Man kann die Kompanie beisammen halten und zwanzig Wagen zurücklassen. Beides steht im Bericht, und die Zahl, die oben gelesen wird, ist die der Wagen.'
  ],
  lage:{gegner:'Zwei- bis dreihundert Mann in den Hängen, geführt und geübt',
        auftrag:'Die Wagen durchbringen — nicht: den Feind schlagen',
        gelaende:'Straße zwischen zwei Hängen, sechzig Wagen in Kolonne',
        stellung:'Kompanie verteilt über zwei Kilometer Wagenzug'},
  intro:'Keine Linie hilft. Und der Sieg zählt nicht — die Wagen zählen.',
  runden:5,feindMoral:40,gefahr:16,gelaende:'wueste',
  sieg:{text:'Gegen Abend fahrt ihr weiter. Achtundvierzig Wagen von sechzig kommen an; zwölf brennen an der Straße, weil man sie nicht wieder in Gang bekommen hat.\\n\\nIn Ciudad Rodrigo zählt ein Zahlmeister die Fässer und schreibt eine Zahl auf. Er fragt nicht, wie viele Männer euch das gekostet hat, und es steht auch in keinem Formular ein Feld dafür.',ruf:5},
  niederlage:{text:'Ihr bringt die Kompanie heraus und dreiundzwanzig Wagen. Der Rest steht am nächsten Morgen noch da, ausgeräumt. In Ciudad Rodrigo wird die Ration gekürzt, und irgendwann wird jemand ausrechnen, was das gekostet hat.',ruf:-2,belastung:10}},

/* 106 */ {typ:'szene',id:'der_junge',datum:'Herbst 1811 · Ein Gehöft in der Sierra',ort:'Der Gefangene',
  text:[
    'Bei einer Durchsuchung wird einer festgenommen, der ein Gewehr im Stroh hatte. Das Gewehr ist französisch und stammt aus einem Depot, das im Mai überfallen worden ist.',
    'Er ist vierzehn. Vielleicht fünfzehn; er weiß es selbst nicht genau, und seine Mutter ist nicht da, um es zu sagen.',
    'Die Vorschrift ist eindeutig und seit drei Jahren in Kraft: Wer ohne Uniform mit einer Waffe aufgegriffen wird, wird erschossen. Sie unterscheidet nicht nach Alter, weil niemand daran gedacht hat, dass sie es müsste.',
    'Es steht kein Vorgesetzter daneben. Es ist dein Abschnitt, es ist deine Entscheidung, und was du entscheidest, wird niemand nachprüfen.'
  ],
  optionen:[
    {label:'Die Vorschrift anwenden',hint:'Sie gilt, und sie unterscheidet nicht',
     erfolg:{text:'Es wird gemacht, wie es gemacht wird. Zwei Mann, eine Mauer, danach wird weitermarschiert. Im Bericht steht ein Satz mit vier Wörtern.\\n\\nDie Kompanie redet an diesem Abend weniger als sonst. Zwei von deinen Leuten sehen dich in den nächsten Wochen anders an, und einer davon war vorher der, auf den du dich verlassen hast.',
       belastung:26,kameradschaft:-12,einheit:4}},
    {label:'Ihn laufen lassen',hint:'Es sieht niemand. Es fragt später auch niemand',
     erfolg:{text:'Du lässt ihn hinter der Scheune stehen und gehst weg, und deine Leute gehen mit. Es wird nichts gesagt, nicht an diesem Tag und nicht später.\\n\\nIn drei Jahren wird er achtzehn sein. Was er dann tut, wirst du nicht erfahren, und du wirst trotzdem daran denken.',
       belastung:14,kameradschaft:8,einheit:-8}},
    {label:'Ihn als Gefangenen abliefern',hint:'Menschenkenntnis · die Vorschrift gilt auch beim Bataillon',risk:true,
     probe:{wert:'menschenkenntnis',schw:45},
     erfolg:{text:'Du lieferst ihn ab und sagst dazu, das Gewehr habe im Stroh gelegen und nicht in seiner Hand — was stimmt, wenn man es genau nimmt, und es nimmt sonst niemand genau. Er kommt in einen Gefangenentransport nach Frankreich. Was auf dem Transport aus ihm wird, steht auf einer Liste, die du nie sehen wirst.',
       belastung:12,fert:{verwaltung:4}},
     misserfolg:{text:'Beim Bataillon steht ein Adjutant, der die Vorschrift kennt und wenig Zeit hat. Es wird an Ort und Stelle erledigt, zwanzig Minuten nachdem du ihn abgegeben hast, und du stehst dabei, ohne noch etwas dazu sagen zu können.',
       belastung:28,kameradschaft:-6}}
  ]},

/* 107 */ {typ:'befoerderung',id:'musterung_rueckzug',datum:'Frühjahr 1812 · Bei Valladolid',ort:'Die letzte Musterung in Spanien',
  keinZiel:'Was hier frei wird, wird von Leuten besetzt, die bleiben. Du gehörst zu denen, die abmarschieren, und wer abmarschiert, wird nicht befördert, sondern eingeteilt.',
  text:[
    'Im Frühjahr 1812 werden die besten Regimenter aus Spanien abgezogen. Es heißt, sie würden im Osten gebraucht; wofür, wird nicht gesagt, und alle wissen es nach zwei Tagen.',
    'Was hierbleibt, ist der Krieg. Was mitgeht, sind die Veteranen — und es geht das Gerücht, in Polen stünden bereits vierhunderttausend Mann, und das sei die größte Armee, die je aufgestellt worden ist.',
    'Bei der Musterung wird abgerechnet, was vier Jahre gekostet haben. Von der Kompanie, die 1808 über die Bidassoa marschiert ist, ist jeder Vierte noch dabei. Es hat keine Schlacht gegeben, in der sie gefallen wären.'
  ]},

/* 108 */ {typ:'ende',id:'ende_spanien',datum:'Sommer 1812 · Über die Pyrenäen zurück',ort:'Was man mitnimmt',
  marsch:{von:'Valladolid',nach:'Über die Pyrenäen nach Osten',weg:'Zurück, wo es 1808 angefangen hat — und weiter, in eine andere Richtung'},
  text:[
    'An der Bidassoa steht keine spanische Grenzwache mehr, die das Gewehr präsentiert. Es steht überhaupt niemand da.',
    'Vier Jahre. Keine Schlacht, deren Namen man zu Hause kennt. Keine Nennung im Bulletin, kein Tagesbefehl, in dem etwas stand, das man erzählen möchte. Was du mitnimmst, sind zwei Dinge: was du kannst, und was du getan hast.',
    'Das Erste steht in den Listen. Das Zweite steht nirgends, und deshalb kann es auch niemand streichen.',
    'Es geht nach Osten. Die Männer, die 1809 aus Ostpreußen zurückgekommen sind, sagen, in Polen sei es im Winter kälter, als man es sich vorstellen könne. Man hört ihnen zu, wie man Leuten zuhört, die übertreiben.'
  ],
  ausblick:'<b>Hier endet der gebaute Stand.</b> Am 24. Juni 1812 gehen vierhunderttausend Mann über drei Brücken über den Njemen. Es ist die größte Armee, die Europa je gesehen hat, und es ist der letzte Tag, an dem irgendjemand sie zählen wird.'}
];

/* Anmeldung: an das laufende Band anhängen und beim Verlauf eintragen.
   `.slice()` ist Pflicht, nicht Kosmetik — siehe die Warnung in Kapitel 1. */
KAPITEL.push(...KAPITEL7);
STATIONEN.spanien = KAPITEL7.slice();
(KAMPAGNEN.find(k=>k.id==='spanien')||{}).gebaut = true;
