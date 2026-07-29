'use strict';
/* Kapitel 4 — Austerlitz 1805. Reine Daten, wie die Kapitel davor.

   ══════════════════ Der Charakter dieses Kapitels ══════════════════

   **Die Ernte von Boulogne.**

   Zwei Jahre lang hat diese Armee nichts getan als exerzieren. Jetzt marschiert
   sie siebenhundert Kilometer in fünf Wochen, nimmt bei Ulm eine ganze
   feindliche Armee gefangen, ohne eine Schlacht zu schlagen — und liefert am
   2. Dezember die perfekteste, die es je gab.

   Für den Spieler heißt das: **Alles, was in Nîmes und Boulogne gelernt wurde,
   wird jetzt geprüft.** Bildung, Sektionsgüte, die Beziehungen der Kette und
   der Drill aus vier Saisons sind genau die Werte, die hier zahlen. Das
   Friedenskapitel bekommt rückwirkend seinen Ernstfall.

   **Feindgüte 6** — die erste Eskalationsstufe über Ägypten. Die eigene Linie
   hilft spürbar weniger; wer die Gefechte kurz halten will, muss sie selbst
   kurz machen. Genau darauf zahlen Veteranenpunkte ein.

   ══════════════════ Was dieses Kapitel neu bringt ══════════════════

   1. **Rang 6 wird erreichbar.** Die Decke des Prototyps hat seit Boulogne ein
      Gesicht: Martel sitzt auf dem Posten. Hier kann eine Vakanz entstehen —
      und das ist die einzige im Spiel, bei der ein Mann fällt, den man seit
      1796 kennt. Das Spiel spricht es nie aus.
   2. **Der Zug** (60 Mann, drei Sektionen) als dritter Kampfmaßstab.
   3. **Die Eiserne Krone**, der erste fremde Orden.
   4. **Das Bulletin** heißt ab hier auch so — 1805 ist das Jahr, in dem es
      gedruckt wurde (`jahrVonStation() >= 1805` schaltet den Namen um).

   ══════════════════ Historische Fixpunkte (Invariante 8) ══════════════════

   Abmarsch aus Boulogne Ende August 1805 · Kapitulation von Ulm 20. Oktober ·
   Trafalgar 21. Oktober (erreicht die Armee nur als Gerücht, Wochen später) ·
   Einzug in Wien 13. November · Schöngrabern/Hollabrunn 16. November · die
   Illumination in der Nacht zum 2. Dezember (Jahrestag der Krönung) ·
   Austerlitz 2. Dezember · Friede von Pressburg 26. Dezember.
   Dazwischen ist alles frei erfunden. */

const KAPITEL4 = [

/* 51 */ {typ:'szene',id:'aufbruch',datum:'27. August 1805 · Lager von Boulogne',ort:'Der Befehl nach Osten',
  text:[
    'Der Befehl kommt nachts und ist kurz. Das Lager wird abgebrochen, die Armee marschiert. Nicht nach England — nach Osten, gegen Österreich, das mit Russland ein Bündnis geschlossen hat, während ihr auf Boote gestarrt habt.',
    'Zweitausend flache Boote bleiben im Hafen liegen. Zwei Jahre Einschiffungsdrill, jeden Tag, bei jedem Wetter, für eine Landung, die nicht stattfindet. Niemand sagt das laut, und alle denken es.',
    'Was ihr stattdessen könnt: marschieren, laden, in Linie stehen, auf Kommando feuern. Das Lager von Boulogne hat aus einer Armee, die drei Jahre nichts getan hat, die beste gemacht, die Frankreich je hatte. Nur weiß das an diesem Morgen noch niemand.',
    'Der Marschbefehl nennt eine Zahl, die keiner glauben will: siebenhundert Kilometer bis zum Rhein. In fünf Wochen.'
  ],
  optionen:[
    {label:'Deine Leute auf den Marsch einstellen',hint:'Autorität · sechzig Kilometer die Woche mehr, als sie kennen',
     ab:{wert:'rang',min:5,sonst:'Du hörst zu, wie die Sergenten ihren Leuten den Marsch erklären. Einer von ihnen rechnet die Kilometer vor, und danach ist die Stimmung schlechter als vorher.'},
     probe:{wert:'autoritaet',schw:40},
     erfolg:{text:'Du sagst ihnen die Zahl nicht. Du sagst ihnen, was heute zu tun ist, und morgen wieder, und nach zehn Tagen fragt keiner mehr, wie weit es noch ist. Es ist der einzige Weg, sechzig Mann über siebenhundert Kilometer zu bringen.',
       gunst:1,gunstVon:'vernet',ruf:2},
     misserfolg:{text:'Du sagst ihnen die Zahl. Zwei rechnen nach, einer rechnet falsch, und am dritten Tag glaubt die halbe Sektion, es gehe bis Konstantinopel.',
       kameradschaft:-4,belastung:3}},
    {label:'Die Ausrüstung für fünf Wochen Marsch herrichten',hint:'Geschick · was jetzt kaputt ist, bleibt es',
     probe:{wert:'geschick',schw:35},
     erfolg:{text:'Schuhe, Riemen, Schloss, Sohlen doppelt. In zwei Jahren Lager ist aus der Ausrüstung ein Kasernenstück geworden; ab morgen ist sie wieder Werkzeug, und es gibt unterwegs keinen Schuster.',
       ausr:{schuhe:40,muskete:25,tornister:25}},
     misserfolg:{text:'Du machst, was du kannst, und die Zeit reicht nicht für alles. Der linke Schuh hält. Wahrscheinlich.',
       ausr:{schuhe:15,muskete:10}}},
    {label:'Beim Marketender einkaufen, solange es einen gibt',hint:'Ab morgen gibt es zwei Monate lang nichts zu kaufen',
     erfolg:{text:'Du gibst aus, was du hast: Zwieback, Branntwein, ein Stück Speck, das drei Wochen halten soll. Der Marketender nimmt jeden Preis, den er nennt, weil alle dasselbe denken.',
       geld:-16,belastung:-6,atem:6}},
    {label:'Schlafen, solange ein Dach da ist',hint:'Die nächsten fünf Wochen gibt es keins',
     erfolg:{text:'Die letzte Nacht in einer Bretterbaracke mit Ofen. Du schläfst bis zum Wecken und wachst auf, weil dreihundert Mann gleichzeitig ihre Tornister packen.',
       belastung:-8,atem:10,leben:12}}
  ]},

/* 52 */ {typ:'szene',id:'marsch_rhein',datum:'September 1805 · Auf der Straße nach Straßburg',ort:'Siebenhundert Kilometer',
  marsch:{von:'Boulogne',nach:'Straßburg',weg:'700 km quer durch Frankreich · fünf Wochen, dreißig Kilometer am Tag'},
  zwischenfall:true,
  text:[
    'Man marschiert im Dunkeln los und im Dunkeln an. Dazwischen liegt eine Straße, die aussieht wie die von gestern, und an ihrem Rand liegen die, die nicht mehr können. Die Gendarmerie sammelt sie abends ein.',
    'Es wird nicht requiriert wie in Italien. An jeder Etappe stehen Magazine, weil ein Mann in Paris vor drei Monaten ausgerechnet hat, wie viel Brot dreißigtausend Männer an welchem Tag wo brauchen. Das ist neu, und es ist der eigentliche Grund, warum dieser Marsch möglich ist.',
    'Ein alter Sergent, der 1796 in Italien war, sagt am zwölften Tag den Satz, den später alle zitieren werden: Der Kaiser führe Krieg mit ihren Beinen statt mit ihren Bajonetten.',
    'Deine Schuhe sind das Einzige, was dich interessiert.'
  ],
  optionen:[
    {label:'Marschieren und den Mund halten',hint:'Konstitution · dreißig Kilometer am Tag',
     probe:{wert:'konstitution',schw:35},
     erfolg:{text:'Du gehst. Dreißig Kilometer, dann noch einmal dreißig, und irgendwann denkt man nicht mehr an das Gehen, sondern an gar nichts, und das ist der Zustand, in dem man am weitesten kommt.',
       fert:{fouragieren:3},atem:-8,belastung:4},
     misserfolg:{text:'Am neunzehnten Tag reißt die Naht am rechten Schuh, und die letzten hundertfünfzig Kilometer gehst du auf etwas, das kein Schuh mehr ist.',
       ausr:{schuhe:-30},atem:-14,belastung:8}},
    {label:'Die Nachzügler deiner Leute einsammeln',hint:'Menschenkenntnis · wer abends fehlt, fehlt bei Ulm',
     ab:{wert:'rang',min:5,sonst:'Du bist selbst froh, wenn du abends ankommst. Wer hinter dir bleibt, bleibt hinter dir.'},
     probe:{wert:'menschenkenntnis',schw:40},
     erfolg:{text:'Du gehst abends die Straße zurück, jeden Tag ein Stück, und bringst sie herein — zwei, drei, manchmal keinen. Es kostet dich eine Stunde Schlaf am Tag. Bei Ulm ist deine Sektion die einzige, die vollzählig antritt.',
       kameradschaft:10,gunst:1,gunstVon:'vernet',atem:-10},
     misserfolg:{text:'Du findest zwei und verlierst dabei selbst den Anschluss. Am Morgen fehlen trotzdem drei, und einer davon kommt nie wieder.',
       kameradschaft:-6,belastung:6,atem:-8}},
    {label:'Unterwegs lesen, was zu lesen ist',hint:'Bildung · Marschbefehle, Etappenlisten, Anschläge',
     ab:{wert:'bildung',min:30,sonst:'An jeder Etappe hängen Zettel. Du weißt, dass etwas draufsteht, und das ist alles, was du weißt.'},
     erfolg:{text:'Du liest die Anschläge an den Etappen, die Marschtabellen, einmal einen Divisionsbefehl, der offen liegen bleibt. Wer weiß, was übermorgen ansteht, marschiert anders als einer, der es nicht weiß.',
       attr:{bildung:4},fert:{kartenkunde:5,taktik:4}}}
  ]},

/* 53 */ {typ:'lager',id:'lager_rhein',datum:'Anfang Oktober 1805 · Bei Donauwörth',ort:'Rast vor der Donau',
  abende:2,
  tun:['exerzieren','bajonett','scharf','instand','ruhe','leute','fouragieren'],
  text:[
    'Der Rhein ist überschritten, die Donau liegt vor euch, und zum ersten Mal seit Boulogne gibt es zwei Abende, an denen nicht marschiert wird.',
    'Die Armee ist in sieben Kolonnen über zweihundert Kilometer verteilt und zieht sich zusammen wie eine Hand. Wo genau die Österreicher stehen, weiß niemand in deiner Kompanie; dass sie irgendwo westlich der Donau sitzen und nicht mehr herauskommen, weiß jeder.',
    'Es ist kalt geworden. In den Dörfern spricht man Deutsch und schließt die Läden, wenn ihr kommt.'
  ]},

/* 54 */ {typ:'kampf',id:'elchingen',datum:'14. Oktober 1805 · Elchingen',ort:'Die Brücke und die Höhe',
  marsch:{von:'Donauwörth',nach:'Elchingen',weg:'80 km donauaufwärts · vier Tage, die letzten zwei im Regen'},
  anmarschKosten:{verschleiss:0.15,atem:5,belastung:1},
  anmarsch:[
    'Die Brücke von Elchingen ist halb abgebrochen, und die Pioniere legen Bohlen, während drüben geschossen wird. Über der Brücke steigt der Hang zu einem Kloster an, und auf dem Hang stehen Österreicher.',
    'Es ist der erste Feind, den du seit sechs Jahren siehst. Die Hälfte deiner Leute hat noch nie einen gesehen.',
    'Der Marschall reitet die Kolonne ab und sagt nichts Besonderes. Das Besondere ist, dass er absteigt und als Erster über die Bohlen geht.',
    'Neben dir prüft ein Achtzehnjähriger zum vierten Mal den Feuerstein. In Boulogne hat er das zweitausendmal geübt. Jetzt zittern ihm die Hände, und die Handgriffe gehen trotzdem — genau dafür waren die zwei Jahre.'
  ],
  lage:{gegner:'Österreichische Infanterie am Hang, Kloster als Stützpunkt',
        auftrag:'Über die Brücke und den Hang hinauf',
        gelaende:'Nasser Hang, aufgeweichter Boden, oben Mauern',
        stellung:'Zweites Treffen, hinter den Grenadieren'},
  intro:'Sechs Jahre kein Gefecht. Was in Boulogne eingeübt wurde, wird in den nächsten vierzig Minuten geprüft.',
  runden:6,feindMoral:52,gefahr:10,gelaende:'bruecke',
  sieg:{text:'Gegen Mittag steht das Kloster leer. Der Hang ist voller Tornister, die niemand mehr trägt, und die Bohlen der Brücke sind rot, wo die Männer über sie zurückgetragen wurden. Aber es hat funktioniert — es hat genau so funktioniert, wie es geübt wurde.',ruf:5,ruhm:true},
  niederlage:{text:'Der erste Angriff kommt nicht über die halbe Höhe. Ihr geht zurück auf die Brücke, und der zweite Angriff, zwei Stunden später, kommt durch — ohne dich in der ersten Reihe.',ruf:-4,belastung:8}},

/* 55 */ {typ:'szene',id:'ulm',datum:'20. Oktober 1805 · Vor Ulm',ort:'Fünfundzwanzigtausend legen die Waffen nieder',
  zwischenfall:true,
  text:[
    'Es gibt keine Schlacht. Die Armee ist um Ulm herumgegangen, hat sich hinter der Stadt geschlossen, und danach war der Krieg dort zu Ende, ohne dass die Kompanie einen Schuss abgegeben hätte.',
    'Am 20. Oktober marschieren fünfundzwanzigtausend Österreicher aus dem Tor, in Reih und Glied, und legen die Gewehre auf Haufen. Es dauert Stunden. Ihr steht am Straßenrand und seht zu.',
    'Ihr General reitet an Napoleon vorbei und übergibt seinen Degen. Man reicht ihn zurück. Das ist die Art von Geste, über die abends geredet wird.',
    'Ein österreichischer Grenadier, der an dir vorbeikommt, sieht dich an und sagt etwas auf Deutsch. Du verstehst kein Wort und weißt trotzdem, was er meint.'
  ],
  optionen:[
    {label:'Zusehen und nichts tun',hint:'Ein Sieg, an dem du keinen Anteil hast',
     erfolg:{text:'Fünf Stunden lang marschieren Männer an dir vorbei, die noch alles haben — Waffen, Schuhe, Fahnen — und sie legen es hin, weil ein Mann in Paris eine Karte besser gelesen hat als ihr General. Du hast nichts dafür getan. Du bist trotzdem dabei gewesen.',
       belastung:-4,fert:{taktik:4}}},
    {label:'Mit den Gefangenen reden, so gut es geht',hint:'Menschenkenntnis · sie sind nicht geschlagen worden, sie sind eingeholt worden',
     probe:{wert:'menschenkenntnis',schw:40},
     erfolg:{text:'Mit Händen, drei Wörtern Deutsch und einem Stück Brot kommt man weiter, als man denkt. Sie sind nicht geschlagen worden — sie sind umstellt worden, und sie wissen es. Einer zeigt dir, wie sein Regiment marschiert ist, mit dem Finger im Dreck. Es ist eine bessere Karte, als der Fourier hat.',
       fert:{kartenkunde:6,taktik:4},attr:{menschenkenntnis:3}},
     misserfolg:{text:'Du versuchst es und kommst nicht durch. Ein Feldwebel scheucht dich weg — Umgang mit Gefangenen ist verboten, und er hat recht, und es ist trotzdem schade.',
       belastung:2}},
    {label:'Bei den Beutewaffen nachsehen',hint:'Fünfundzwanzigtausend Gewehre liegen auf Haufen',risk:true,
     probe:{wert:'geschick',schw:40},
     erfolg:{text:'Es ist verboten, und es tun alle. Du nimmst dir keinen Säbel und keine Uhr, sondern zwei Feuersteine und einen Ladestock, der besser ist als deiner. Das ist der Unterschied zwischen Plündern und Vorsorgen, und der Unteroffizier, der dich sieht, sieht ihn auch.',
       ausr:{muskete:30},geld:6},
     misserfolg:{text:'Ein Adjutant sieht dich zwischen den Haufen und lässt sich deinen Namen geben. Es passiert nichts weiter. Der Name steht jetzt auf einem Blatt, auf dem er nicht stehen sollte.',
       ruf:-3,gunst:-1,gunstVon:'vernet'}}
  ]},

/* 56 */ {typ:'szene',id:'donau',datum:'November 1805 · Donauabwärts',ort:'Der Preis des Tempos',
  marsch:{von:'Ulm',nach:'Richtung Wien',weg:'450 km donauabwärts · vier Wochen, Regen, dann Schnee'},
  zwischenfall:true,
  text:[
    'Nach Ulm hört das Magazinwesen auf zu funktionieren. Nicht weil jemand einen Fehler macht, sondern weil die Armee schneller marschiert, als Brot herangefahren werden kann — der Nachschub hängt zweihundert Kilometer zurück und holt nie wieder auf.',
    'Es regnet drei Wochen. Danach schneit es. Die Straßen sind Lehm, die Dörfer sind leer, und was in ihnen war, ist mitgenommen worden, bevor ihr kamt.',
    'In der Kompanie hustet die Hälfte. Zwei sind an etwas gestorben, das keinen Namen bekommen hat, weil der Feldscher zwei Tagesmärsche hinten ist.',
    'Am 21. Oktober, heißt es, sei die Flotte bei Kap Trafalgar untergegangen. Die Nachricht braucht drei Wochen bis zu euch und wird nicht verlesen. Man erfährt sie von einem Fuhrmann.'
  ],
  optionen:[
    {label:'Für deine Leute fouragieren',hint:'Fouragieren · in leeren Dörfern',
     probe:{wert:'fouragieren',schw:45},
     erfolg:{text:'Du findest, was die vor euch nicht gefunden haben: einen Keller unter einem Stall, drei Sack Korn und einen Schinken im Rauchfang. Es reicht für zwei Tage für sechzig Mann, und es ist der Grund, warum an diesen zwei Tagen niemand liegen bleibt.',
       kameradschaft:12,gunst:1,gunstVon:'vernet',atem:-6},
     misserfolg:{text:'Vier Häuser, vier leere Häuser. In einem sitzt eine Frau mit zwei Kindern und hat selbst nichts. Du gehst weiter und nimmst nichts mit, und deine Leute essen an diesem Abend, was sie am Vortag nicht gegessen haben.',
       belastung:8,atem:-8,kameradschaft:-4}},
    {label:'Den Kranken der Kompanie helfen',hint:'Feldchirurgie · der Feldscher ist zwei Tagesmärsche hinten',
     probe:{wert:'feldchirurgie',schw:40},
     erfolg:{text:'Trocken halten, warm halten, trinken lassen, und die, die nicht mehr gehen können, auf die Protze legen, auch wenn das verboten ist. Zwei von den sechs kommen bis Wien. Ohne dich wären es keine.',
       kameradschaft:10,fert:{feldchirurgie:6},belastung:6},
     misserfolg:{text:'Du tust, was du kannst, und was du kannst, reicht bei diesem Wetter nicht. Vier bleiben unterwegs. Man schreibt ihre Namen auf, und irgendwann schreibt sie jemand ab.',
       belastung:12,wunde:'Fieber vom Donaumarsch',zehrt:3}},
    {label:'Marschieren und an nichts denken',hint:'Konstitution · vier Wochen im Regen',
     probe:{wert:'konstitution',schw:40},
     erfolg:{text:'Man kann einen Monat lang im Regen marschieren, wenn man aufhört zu rechnen, wie lange es noch dauert. Du kommst durch, und du kommst als einer der wenigen ohne Husten durch.',
       atem:-10,belastung:6},
     misserfolg:{text:'In der dritten Woche wirst du krank wie alle anderen. Es geht nicht weg; es wird nur bei jedem Schritt ein bisschen schlimmer.',
       wunde:'Husten vom Donaumarsch',zehrt:3,atem:-14,belastung:8}}
  ]},

/* 57 */ {typ:'szene',id:'wien',datum:'13. November 1805 · Wien',ort:'Eine Hauptstadt ohne Schuss',
  zwischenfall:true,
  text:[
    'Wien ergibt sich, ohne dass jemand schießt. Am 13. November marschiert die Armee über die Donaubrücke, die zwei Husarenoffiziere den Österreichern abgeschwatzt haben, indem sie behaupteten, es sei Waffenstillstand.',
    'Die Stadt ist unversehrt. Kaffeehäuser, Kirchen, Frauen mit Sonnenschirmen im November, Kutschen, die anhalten und warten, bis eure Kolonne durch ist. Nach vier Wochen Lehm ist es kaum zu ertragen.',
    'Die kaiserlichen Magazine sind voll und werden geöffnet: Mehl, Schuhe, Uniformtuch, Branntwein. Zum ersten Mal seit Ulm isst die Kompanie sich satt.',
    'Es heißt, die Russen stünden nordöstlich in Mähren, und der Kaiser wolle sie zur Schlacht zwingen, bevor der Winter kommt und bevor Preußen sich entscheidet.'
  ],
  optionen:[
    {label:'Aus dem Magazin nehmen, was deinen Leuten fehlt',hint:'Verwaltung · es steht ihnen zu, man muss es nur bekommen',
     probe:{wert:'verwaltung',schw:40},
     erfolg:{text:'Du hast in Nîmes gelernt, wie eine Empfangsbestätigung aussieht, und der österreichische Magazinverwalter kann sie nicht lesen, aber er erkennt sie. Sechzig Paar Schuhe, Mehl für eine Woche, zwei Fässer. Deine Leute gehen als einzige der Kompanie neu beschuht nach Mähren.',
       ausr:{schuhe:50},kameradschaft:10,gunst:1,gunstVon:'collot'},
     misserfolg:{text:'Vor dem Magazin steht eine Schlange aus drei Regimentern, und wer keinen Zettel hat, bekommt nichts. Du hast keinen Zettel. Am Abend gibt es Mehl, weil ein anderer einen hatte.',
       belastung:4}},
    {label:'Die Stadt ansehen, solange es geht',hint:'Es ist die erste Hauptstadt deines Lebens',
     erfolg:{text:'Du gehst durch Straßen mit Häusern, die fünf Stockwerke hoch sind, an einer Kirche vorbei, deren Turm man vom Feldlager aus sieht, und stehst zehn Minuten vor einem Schaufenster mit Uhren. Es ist ein anderes Leben, und es findet vierzig Schritt neben dir statt.',
       belastung:-10,attr:{menschenkenntnis:2}}},
    {label:'Schreiben lassen oder selbst schreiben',hint:'Nach Hause · zum ersten Mal seit Boulogne geht Post',
     ab:{wert:'verheiratet',min:1,sonst:'Vor dem Feldpostamt steht eine Schlange von Männern, die etwas nach Hause zu schreiben haben. Du gehst vorbei. Es ist niemand da, der auf Nachricht wartet.'},
     erfolg:{text:'Aus Wien geht Post nach Frankreich, sechs Wochen für den Weg. Du schreibst, dass es dir gut geht, dass es kalt ist und dass du nicht weißt, wann ihr zurückkommt. Alles drei stimmt. Was du nicht schreibst, ist, dass in acht Tagen eine Schlacht sein wird.',
       belastung:-12,kameradschaft:4}}
  ]},

/* 58 */ {typ:'kampf',id:'hollabrunn',datum:'16. November 1805 · Schöngrabern',ort:'Bagrations Nachhut',
  marsch:{von:'Wien',nach:'Hollabrunn',weg:'60 km nach Norden · zwei Tage Gewaltmarsch, um sie zu stellen'},
  anmarschKosten:{verschleiss:0.2,atem:7,belastung:2},
  anmarsch:[
    'Die russische Armee zieht sich nach Nordosten zurück, und zwischen ihr und euch steht eine Nachhut von sechstausend Mann unter einem Fürsten Bagration. Ihr Auftrag ist, zu sterben, damit die anderen wegkommen. Sie wissen das.',
    'Es ist der erste russische Feind, den die Armee sieht. Was man über sie erzählt hat, wird sich in den nächsten Stunden als teilweise wahr erweisen: Sie brechen nicht, wenn eine Linie normalerweise bricht.',
    'Der Angriff geht bei einbrechender Dunkelheit los, in ein Dorf hinein, das brennt, bevor ihr darin seid.',
    'Zwischen den Häusern kann man die Ordnung nicht halten. Das ist genau das, was in Boulogne nicht geübt wurde.'
  ],
  lage:{gegner:'Russische Nachhut, sechstausend Mann, mit dem Rücken zur Straße',
        auftrag:'Das Dorf nehmen, bevor es dunkel ist',
        gelaende:'Brennende Häuser, Gärten, Zäune · keine Linie zu halten',
        stellung:'Erstes Treffen, rechte Kompanie'},
  intro:'Sie brechen nicht, wenn eine Linie normalerweise bricht. Das ist neu, und es kostet.',
  runden:7,feindMoral:64,gefahr:12,gelaende:'damm',
  sieg:{text:'Um zehn Uhr nachts gehört euch das Dorf. Bagration ist mit der Hälfte seiner Leute durchgekommen und hat erreicht, was er erreichen sollte. Auf dem Weg zwischen den Häusern liegen mehr Russen als Franzosen, und das ist der einzige Maßstab, den es hier gibt.',ruf:7,ruhm:true},
  niederlage:{text:'Die Nachhut hält bis Mitternacht und zieht dann in Ordnung ab. Ihr habt das Dorf und sonst nichts.',ruf:-4,belastung:10}},

/* 59 */ {typ:'lager',id:'lager_bruenn',datum:'Ende November 1805 · Bei Brünn',ort:'Das Lager vor der Schlacht',
  abende:2,
  tun:['exerzieren','scharf','instand','schuhe','waffe','ruhe','leute','fouragieren'],
  text:[
    'Die Armee liegt seit einer Woche westlich eines Dorfes namens Austerlitz und tut etwas, das keiner versteht: Sie zieht sich zurück. Eine Höhe, die Pratzeberg heißt und das ganze Gelände beherrscht, wird geräumt, ohne dass jemand darauf geschossen hätte.',
    'Es geht das Gerücht, der Kaiser habe um Waffenstillstand bitten lassen. Die Offiziere sind unruhig, die Mannschaft rechnet. Von siebzigtausend Mann sind fünfzigtausend hier; die anderen stehen zweihundert Kilometer weit weg.',
    'Drüben, sagt man, seien es neunzigtausend, und sie hätten zwei Kaiser dabei.',
    'Ein alter Sergent-major sagt beim Essen, er habe den Kaiser noch nie etwas aufgeben sehen, was er halten wollte. Danach isst er weiter, und niemand fragt nach.'
  ]},

/* 60 */ {typ:'szene',id:'fackelnacht',datum:'1. Dezember 1805 · Vor Austerlitz',ort:'Die Nacht mit den Fackeln',
  text:[
    'Am Abend des 1. Dezember reitet der Kaiser die Linien ab, um sich das Gelände anzusehen. Es ist der Jahrestag seiner Krönung; niemand hat das angeordnet, und jemand fällt es ein.',
    'Ein Grenadier steckt ein Bündel Stroh auf einen Stock und zündet es an. Dann der nächste. Nach zwanzig Minuten brennen über fünfzigtausend Mann Strohfackeln, und die ganze Linie ist eine Lichterkette über drei Kilometer.',
    'Drüben, auf dem Pratzeberg, sehen sie es auch. Es heißt, ihre Offiziere hätten geglaubt, die Franzosen brennten ihr Lager ab und zögen sich zurück.',
    'Morgen früh wird geschlagen. Das weiß in dieser Nacht jeder, vom Marschall bis zum Trommlerjungen, und deshalb schläft kaum einer.'
  ],
  optionen:[
    {label:'Eine Fackel anzünden und mitgehen',hint:'Fünfzigtausend Mann tun dasselbe',
     erfolg:{text:'Du gehst mit, weil alle mitgehen, und irgendwann geht es nicht mehr darum, warum. Er reitet zwanzig Schritt an dir vorbei, sieht in die Fackeln und sagt nichts. Am nächsten Morgen wirst du müde sein und es nicht bereuen.',
       kameradschaft:12,belastung:-10,ruf:1}},
    {label:'Deine Leute schlafen schicken',hint:'Autorität · morgen zählt jede Stunde',
     ab:{wert:'rang',min:5,sonst:'Du bist selbst zu müde, um zu entscheiden, ob das hier klug ist. Du gehst mit.'},
     probe:{wert:'autoritaet',schw:45},
     erfolg:{text:'Du lässt sie zwanzig Minuten mitlaufen und schickst sie dann zum Feuer zurück. Zwei murren. Morgen um vier, wenn geweckt wird, murrt keiner mehr — sie sind die einzige Sektion, die geschlafen hat.',
       atem:12,belastung:-6,gunst:1,gunstVon:'vernet'},
     misserfolg:{text:'Du redest gegen fünfzigtausend Mann an, die singen. Sie kommen um halb zwei zurück, und um vier werden sie geweckt.',
       atem:-6,kameradschaft:4}},
    {label:'Die Waffe noch einmal durchsehen',hint:'Geschick · morgen früh ist keine Zeit dafür',
     probe:{wert:'geschick',schw:30},
     erfolg:{text:'Stein, Pfanne, Lauf, Ladestock. Du machst es im Fackelschein und noch einmal im Dunkeln, weil man es im Dunkeln können muss. Es ist die vernünftigste halbe Stunde der ganzen Nacht.',
       ausr:{muskete:30},belastung:-4},
     misserfolg:{text:'Du machst es im Halbdunkeln und übersiehst dabei, dass die Schraube am Hahn locker sitzt. Morgen wirst du es merken.',
       ausr:{muskete:-8}}}
  ]},

/* 61 */ {typ:'kampf',id:'austerlitz',datum:'2. Dezember 1805 · Austerlitz',ort:'Der Pratzeberg',
  haerte:1.4,
  marsch:{von:'Lager bei Schlapanitz',nach:'Der Pratzeberg',weg:'4 km ostwärts durch Nebel · angetreten um vier Uhr früh, ohne Feuer'},
  anmarschKosten:{verschleiss:0.15,atem:6,belastung:2},
  anmarsch:[
    'Um vier Uhr früh wird geweckt, ohne Trommel. Es ist minus fünf Grad, und im Tal steht ein Nebel, in dem man dreißig Schritt weit sieht.',
    'Der Plan ist so einfach, dass er nur von jemandem stammen kann, der ihn zwei Wochen lang vorbereitet hat: Der rechte Flügel wird schwach gehalten, damit die Verbündeten darauf losgehen. Dabei müssen sie den Pratzeberg räumen — die Höhe, die das ganze Feld beherrscht und die man ihnen vor drei Tagen absichtlich überlassen hat.',
    'In dem Augenblick, in dem sie herunter sind, geht ihr hinauf.',
    'Ihr steht seit einer Stunde im Nebel und wartet. Über euch wird es hell, unten bleibt es grau. Gegen acht reißt es auf, und die Sonne steht so tief und so rot, dass man später ein Wort dafür haben wird.'
  ],
  lage:{gegner:'Russische Garde und österreichische Kolonnen auf und um die Höhe',
        auftrag:'Den Pratzeberg nehmen und halten, bis der rechte Flügel steht',
        gelaende:'Kahle Höhe, gefrorener Acker, unten Teiche mit dünnem Eis',
        stellung:'Erstes Treffen, Mitte — die Kolonne Saint-Hilaire'},
  intro:'Sie sind vom Berg heruntergegangen, weil man sie hinuntergelassen hat. Jetzt liegt zwischen euch und der Höhe niemand mehr.',
  runden:9,feindMoral:80,gefahr:13,gelaende:'wueste',
  sieg:{text:'Um Mittag steht die Armee auf dem Pratzeberg und schießt nach beiden Seiten hinunter. Was unten passiert, sieht man von hier oben: Wie sich eine Armee, die morgens neunzigtausend Mann hatte, in zwei Hälften teilt, die einander nicht mehr erreichen.\\n\\nGegen drei Uhr treibt es die letzten über die zugefrorenen Teiche. Das Eis hält nicht überall.',ruf:12,ruhm:true},
  niederlage:{text:'Ihr kommt bis zur halben Höhe und bleibt dort liegen, bis eine zweite Kolonne von rechts hinaufgeht und es zu Ende bringt. Die Schlacht ist gewonnen. Dein Teil davon ist es nicht.',ruf:-4,belastung:12}},

/* 62 */ {typ:'szene',id:'abend_austerlitz',datum:'2. Dezember 1805, abends · Auf dem Schlachtfeld',ort:'Der Abend danach',
  text:[
    'Es ist um vier Uhr vorbei, weil es dunkel wird. Auf einem Feld von zwanzig Quadratkilometern liegen sechzehntausend Verbündete und neuntausend Franzosen, und es fängt an zu schneien.',
    'Der Tagesbefehl wird bei Fackelschein verlesen, während die Ambulanzwagen fahren: „Soldaten, ich bin zufrieden mit euch." Weiter heißt es, es genüge künftig zu sagen, man sei bei Austerlitz gewesen, damit man antworte: Das ist ein Tapferer.',
    'Zweihundert Schritt weiter arbeitet Larrey mit seinen Chirurgen seit vier Stunden, und sie werden bis übermorgen arbeiten.',
    'Es ist der größte Sieg, den diese Armee je erringen wird, und niemand, der ihn erlebt, wird jemals wieder etwas erleben, das ihm gleichkommt.'
  ],
  optionen:[
    {label:'Auf dem Feld nach Verwundeten suchen',hint:'Es friert, und wer liegen bleibt, erfriert',risk:true,
     probe:{wert:'konstitution',schw:40},
     erfolg:{text:'Du gehst mit einer Fackel über den gefrorenen Acker und findest sieben, die noch leben, drei davon in fremder Uniform. Man trägt sie alle zum selben Zelt. Es dauert die halbe Nacht, es kostet dich den Schlaf, und es ist das Einzige, woran du dich in zwanzig Jahren noch genau erinnern wirst.',
       kameradschaft:12,ruf:3,belastung:8,atem:-14},
     misserfolg:{text:'Nach zwei Stunden in minus acht Grad kannst du die Hände nicht mehr schließen und musst zurück. Du hast drei gefunden. Wie viele du nicht gefunden hast, rechnest du besser nicht aus.',
       belastung:14,atem:-16,wunde:'Erfrierungen an beiden Händen'}},
    {label:'Bei deinen Leuten bleiben und abzählen',hint:'Wer steht, steht',
     erfolg:{text:'Du zählst deine Leute ab, schreibst die Namen der Fehlenden auf und gibst den Zettel weiter. Danach setzt du dich ans Feuer und sagst zwei Stunden lang nichts, und niemand verlangt etwas anderes.',
       belastung:-6,kameradschaft:6}},
    {label:'Zum Tagesbefehl gehen und zuhören',hint:'Es wird auch verlesen, wer genannt wird',
     erfolg:{text:'Es sind viele Namen, und es dauert. Was hängen bleibt, ist nicht der eigene — falls er fällt —, sondern der Satz am Ende: dass es künftig genüge zu sagen, man sei bei Austerlitz gewesen. Fünfzigtausend Männer glauben ihm das in diesem Augenblick, und die meisten von ihnen ihr Leben lang.',
       ruf:2,belastung:-8}}
  ]},

/* 63 */ {typ:'befoerderung',id:'bruenn_musterung',datum:'12. Dezember 1805 · Brünn',ort:'Musterung nach der Schlacht',
  keinZiel:'Über dir sitzt niemand mehr, den dieser Feldzug freimachen könnte. Was jetzt käme, ist kein Unteroffiziersrang mehr, sondern ein Patent — und Patente werden nicht im Hof einer Kaserne vergeben, sondern in Paris, von Männern, die deinen Namen aus einem Bulletin kennen müssten.',
  text:[
    'Zehn Tage nach der Schlacht wird gemustert, und diesmal gibt es viel zu besetzen. Neuntausend Franzosen sind ausgefallen, und in den Listen stehen mehr leere Zeilen als in irgendeiner Musterung seit Ägypten.',
    'Der Capitaine sitzt in einem geheizten Zimmer in Brünn, vor sich die Bücher, neben sich den Fourier. Es geht schnell, weil es schnell gehen muss.',
    'Was hier zählt, ist, wer am 2. Dezember auf dem Berg gestanden hat und wer nicht.'
  ]},

/* 64 */ {typ:'uebergang',id:'ende_austerlitz',datum:'26. Dezember 1805 · Preßburg',ort:'Der Friede',
  marsch:{von:'Brünn',nach:'Winterquartier in Mähren',weg:'Vier Wochen Ruhe in einem Land, das Frieden geschlossen hat'},
  text:[
    'Am 26. Dezember wird in Preßburg Friede geschlossen. Österreich verliert ein Sechstel seiner Bevölkerung und tritt aus dem Krieg aus; Russland zieht nach Osten ab, ohne etwas zu unterschreiben.',
    'Die Armee bezieht Winterquartiere in Mähren, wo es Öfen gibt und Vieh und eine Bevölkerung, die den Krieg nicht wollte und ihn trotzdem bezahlt.',
    'Du bist bei Austerlitz gewesen. Das ist ein Satz, den du für den Rest deines Lebens sagen können wirst, und man wird ihn dir jedes Mal glauben.',
    'Von den Männern, die im August in Boulogne mit dir angetreten sind, ist einer von sechs nicht mehr da. Es war der kürzeste Feldzug, den diese Armee je geführt hat, und in vier Monaten hat sie zwei Armeen vernichtet.'
  ],
  }
];

/* Anmeldung: an das laufende Band anhängen und beim Verlauf eintragen.
   `.slice()` ist Pflicht, nicht Kosmetik — siehe die Warnung in Kapitel 1. */
KAPITEL.push(...KAPITEL4);
STATIONEN.austerlitz = KAPITEL4.slice();
(KAMPAGNEN.find(k=>k.id==='austerlitz')||{}).gebaut = true;
