'use strict';
/* Kapitel 5 — Jena und Auerstedt 1806. Reine Daten, wie die Kapitel davor.

   ══════════════════ Die eigene Regel ══════════════════

   **Der Krieg wird mit den Beinen gewonnen.**

   Die Schlacht ist der kleinste Teil dieses Feldzugs. Die Grande Armée schlägt
   Preußen in vier Wochen, und sie tut es durch Marschleistung: Wer zuerst da
   ist, gewinnt, bevor geschossen wird. Zwischen dem 8. Oktober und dem
   7. November verschwindet eine Armee, die zwanzig Jahre lang als die beste
   Europas galt, und das entscheidende Werkzeug dabei ist der Schuh.

   Für den Spieler heißt das: **Der Marsch bekommt Entscheidungen.** An drei
   Stationen steht vor dem Abmarsch die Tempowahl — schonend, nach Vorschrift,
   forciert. Der forcierte Marsch überspringt eine Station, kostet doppelten
   Verschleiß, Atem und Belastung, und ist das erste Mal im Spiel, dass man
   Zeit gegen Substanz tauschen kann. Er ist mächtig und teuer; er ist die
   Miniatur des ganzen Feldzugs.

   Die Tempowahl selbst steht in `src/oberflaeche.js` (`TEMPO`, `zeigeTempo`) —
   sie ist kapitelübergreifend und wird in Russland und 1814 wieder gebraucht.
   Hier stehen nur die Daten: welche Station der forcierte Marsch auslässt und
   was er einbringt.

   ══════════════════ Was dieses Kapitel neu bringt ══════════════════

   1. **Die Tempowahl** — drei Marschknöpfe, das erste kapitelübergreifende
      System seit der Feindgüte.
   2. **Rangfassungen in Szenen** (`rangText`, `rangOptionen`): KAMPAGNEN §0.3
      verlangt, dass jede Station jeden Rang trägt. Der Marsch nach Norden und
      die Verfolgung lesen sich als Fusilier anders als als Capitaine, und
      beides steht jetzt in derselben Station.
   3. **Beutegeld** als Szenenentscheidung mit Gunst-Risiko — Berlin ist die
      erste Hauptstadt, die dieser Armee gehört, und sie hat Schränke.
   4. **Rang 7 wohnt hier.** Nach der Doppelschlacht ist das Offizierskorps
      gerupft und die Armee steht tief in Preußen: Patente werden im Feld
      ausgestellt. Die Vakanz-Maschine erledigt das von allein (LEITER, Rang 7,
      `vakanz:'zugfuehrer'`) — dieses Kapitel liefert nur die zwei Musterungen
      und das Höhepunktgefecht, in dem eine Stelle frei werden kann.

   ══════════════════ Historische Fixpunkte (Invariante 8) ══════════════════

   Kriegserklärung und Ultimatum Anfang Oktober 1806 · Saalfeld 10. Oktober
   (Prinz Louis Ferdinand fällt im Handgemenge) · Jena und Auerstedt am selben
   Tag, 14. Oktober · Kapitulation Hohenlohes bei Prenzlau 28. Oktober · Einzug
   in Berlin 27. Oktober · Blücher gibt bei Lübeck am 7. November auf ·
   das Berliner Dekret über die Kontinentalsperre 21. November.
   Dazwischen ist alles frei erfunden. */

const KAPITEL5 = [

/* 65 */ {typ:'szene',id:'bamberg',datum:'8. Oktober 1806 · Bamberg',ort:'Der Aufbruch nach Norden',
  marsch:{von:'Winterquartier in Mähren',nach:'Bamberg',weg:'Ein halbes Jahr Garnison, dann in acht Tagen an den Main'},
  tempo:{
    text:[
      'Der Spieß steht mit einem Zettel vor der Kompanie und rechnet vor, was in den nächsten zwei Wochen verlangt wird. Er rechnet es nicht vor, damit ihr es versteht, sondern damit ihr es nicht später fragt.',
      'Drei Kolonnen gehen gleichzeitig durch den Thüringer Wald, auf drei Straßen, die keine sind. Was zusammengehört, sieht einander vierzig Kilometer lang nicht. Wenn eine Kolonne zu früh auf den Feind stößt, steht sie allein.',
      'Zum ersten Mal in diesem Krieg hängt alles daran, wie schnell ihr geht.'
    ],
    ueberspringt:'thueringer_wald',
    forciert:{hint:'als erste Brigade an der Saale',
      text:'Ihr geht durch, ohne den Wald anzusehen. Am Abend des dritten Tages steht deine Brigade an der Saale, und die anderen stehen noch im Wald. Der Divisionsgeneral lässt sich melden, welches Regiment als erstes da war, und schreibt es auf.',
      gunst:1,gunstVon:'vernet'},
    schonend:{text:'Man kommt an, wenn man ankommt. Es ist nicht der schlechteste Grundsatz, und die Beine deiner Leute geben dir recht.'}
  },
  text:[
    'Preußen hat ein Ultimatum gestellt: Die französischen Truppen sollen bis zum 8. Oktober hinter den Rhein zurück. Der Kaiser hat nicht geantwortet, sondern ist am 8. Oktober losmarschiert, nach Norden, mit hundertachtzigtausend Mann in drei Kolonnen.',
    'In der Kompanie erzählt man sich, die preußischen Offiziere hätten in Berlin ihre Säbel an den Stufen der französischen Gesandtschaft gewetzt. Es stimmt wahrscheinlich nicht. Erzählt wird es trotzdem, und es tut, was solche Geschichten tun.',
    'Was stimmt: Diese Armee gilt seit Friedrich als die beste Europas, und die Hälfte ihrer Generale hat unter ihm gedient. Der jüngste von ihnen ist einundsechzig.',
    'Was auch stimmt: Von den Männern, die 1796 mit dir in Italien angetreten sind, marschieren noch die, die es überlebt haben, und sie marschieren anders als damals.'
  ],
  optionen:[
    {label:'Die Schuhe der Kompanie nachsehen, bevor es losgeht',hint:'Geschick · in zwei Wochen gibt es keinen Schuster',
     probe:{wert:'geschick',schw:35},
     erfolg:{text:'Sohle, Naht, Absatz, bei allen. Drei Paar sind hin, und du bekommst zwei ersetzt, indem du den Fourier so lange stehen lässt, bis er nachgibt. Ein Mann mit ganzen Schuhen marschiert vierzig Kilometer. Ein Mann ohne marschiert dreißig und liegt dann.',
       ausr:{schuhe:45},kameradschaft:6},
     misserfolg:{text:'Du siehst nach, und was du siehst, ändert nichts: Der Fourier hat keine Schuhe, weil das Magazin in Würzburg steht und Würzburg hinter euch liegt. Man geht mit dem, was man hat.',
       ausr:{schuhe:10},belastung:3}},
    {label:'Nachsehen, was über die Preußen bekannt ist',hint:'Kartenkunde · Straßen, Flüsse, Namen',
     ab:{wert:'bildung',min:30,sonst:'Beim Stab liegen Karten aus, und jeder, der lesen kann, sieht sie sich an. Du siehst zu, wie sie sie ansehen.'},
     probe:{wert:'kartenkunde',schw:40},
     erfolg:{text:'Die Saale läuft von Süden nach Norden, links davon der Thüringer Wald, rechts die Straße nach Leipzig. Wer die Saale-Übergänge hat, hat die preußische Armee im Rücken. Es ist keine Karte, die man einem Fusilier zeigen müsste, und trotzdem verstehst du in fünf Minuten, warum diese Kolonne dorthin geht, wo sie hingeht.',
       fert:{kartenkunde:7,taktik:5}},
     misserfolg:{text:'Namen, Striche, ein Fluss, der zweimal um sich selbst geht. Nach zehn Minuten weißt du weniger als vorher und merkst dir nur eines: Es geht nach Norden.',
       fert:{kartenkunde:2}}},
    {label:'Beim Marketender einkaufen, solange es einen gibt',hint:'Ab morgen ist zwei Wochen lang nichts zu kaufen',
     erfolg:{text:'Zwieback, Branntwein, ein Stück Speck. Der Marketender weiß, was ein Aufbruch wert ist, und nimmt den Preis, den er nennt.',
       geld:-14,belastung:-6,atem:6}}
  ],
  rangText:{5:['Deine Leute stehen in Reihe und sehen dich an, während der Spieß rechnet. Was der Spieß rechnet, geht sie nichts an; was du gleich sagst, schon.'],
            7:['Der Capitaine gibt die Marschtabelle an die Zugführer aus. Auf dem Blatt stehen Uhrzeiten, hinter denen Ortsnamen stehen, die niemand kennt, und es ist deine Sache, dass die Uhrzeiten stimmen.']},
  rangOptionen:{5:[
    {label:'Deinen Leuten sagen, was auf sie zukommt',hint:'Autorität · die Wahrheit oder das, was hilft',
     probe:{wert:'autoritaet',schw:40},
     erfolg:{text:'Du sagst ihnen nicht, wie weit es ist. Du sagst ihnen, dass sie in zwei Wochen in Berlin sind, wenn sie gehen, und in vier Wochen tot, wenn sie stehen bleiben. Das ist ungefähr richtig, und sie glauben es, weil du es glaubst.',
       kameradschaft:8,gunst:1,gunstVon:'vernet'},
     misserfolg:{text:'Du sagst zu viel und sagst es zu genau. Zwei rechnen nach, einer rechnet falsch, und ab dem zweiten Tag geht das Gerücht, es gehe bis Königsberg.',
       kameradschaft:-5,belastung:3}}]}},

/* 66 */ {typ:'szene',id:'thueringer_wald',datum:'11. Oktober 1806 · Im Thüringer Wald',ort:'Drei Straßen, die keine sind',
  zwischenfall:true,
  text:[
    'Der Weg über den Kamm ist an manchen Stellen so schmal, dass die Geschütze abgeprotzt und an Seilen hochgezogen werden müssen. Die Kolonne steht dabei und wartet, drei Stunden, im Nieselregen, und wer wartet, wird kalt.',
    'In den Dörfern sind die Leute nicht weggelaufen. Sie stehen an den Zäunen und sehen zu, und einer sagt auf Deutsch etwas, das wie eine Frage klingt. Niemand antwortet ihm.',
    'Es gibt keinen Feind. Das ist das Merkwürdige an diesen drei Tagen: Man geht durch ein Land, das im Krieg ist, und trifft niemanden, der davon weiß.',
    'Abends brennen die Feuer, und zum ersten Mal seit Mähren hat die Kompanie Zeit, etwas anderes zu tun als zu gehen.'
  ],
  optionen:[
    {label:'Für die Kompanie fouragieren',hint:'Fouragieren · die Dörfer sind voll und ahnungslos',
     probe:{wert:'fouragieren',schw:35},
     erfolg:{text:'Ein Hof am Waldrand, in dem geschlachtet worden ist, und ein Bauer, der nicht versteht, was ihm gerade geschieht. Du zahlst mit einem Zettel, den der Fourier ausgestellt hat und den niemand je einlösen wird. Am Abend isst die Kompanie warm.',
       kameradschaft:10,atem:8,geld:4},
     misserfolg:{text:'Drei Höfe, drei verschlossene Türen. Sie sind nicht weggelaufen, sie haben nur gelernt, wie das geht. Am Abend gibt es Zwieback und das, was du selbst mitgebracht hast.',
       belastung:4,atem:-4}},
    {label:'Am Feuer bleiben und zuhören',hint:'Belastung sinkt · Gunst',
     erfolg:{text:'Es wird über Preußen geredet, über Friedrich, über einen Marsch von 1796, den außer dreien niemand mehr kennt. Ein Sergent-major sagt, er habe noch nie eine Armee gesehen, die so gut aussehe und so alt sei. Er meint die andere.',
       kameradschaft:8,belastung:-8,gunst:1}},
    {label:'Die Ausrüstung durchsehen, solange es hell ist',hint:'Geschick · nasses Leder, nasses Pulver',
     probe:{wert:'geschick',schw:30},
     erfolg:{text:'Pfanne trocken, Stein neu, Riemen nachgezogen, Sohlen mit Fett eingerieben. Drei Stunden Arbeit für etwas, das man erst merkt, wenn es fehlt.',
       ausr:{muskete:30,schuhe:25,tornister:20}},
     misserfolg:{text:'Der Regen ist schneller als du. Was du trocken bekommst, ist am Morgen wieder nass, und der Ladestock hat Rost angesetzt, wo gestern keiner war.',
       ausr:{muskete:-8}}},
    {label:'Schlafen, solange es geht',hint:'Vier Stunden unter einer Plane',
     erfolg:{text:'Vier Stunden unter einer Plane zwischen zwei Bäumen. Es ist kalt und es tropft, und es ist trotzdem der beste Schlaf seit acht Tagen.',
       atem:14,belastung:-6,leben:10}}
  ]},

/* 67 */ {typ:'kampf',id:'saalfeld',datum:'10. Oktober 1806 · Saalfeld',ort:'Der Prinz und die Wiesen an der Saale',
  marsch:{von:'Coburg',nach:'Saalfeld',weg:'50 km über den Kamm · zwei Tage, die letzte Nacht im Stehen'},
  anmarschKosten:{verschleiss:0.15,atem:5,belastung:1},
  anmarsch:[
    'Der erste Feind dieses Krieges steht auf den Wiesen vor Saalfeld, in Reih und Glied, in Blau und Weiß, mit Fahnen. Es sind achttausend gegen dreizehntausend, und sie stehen im offenen Feld, weil ihr Reglement es so vorsieht.',
    'Sie haben Zeit gehabt, sich aufzustellen. Sie haben sie genutzt, um sich richtig aufzustellen.',
    'Vor der Linie reitet ein junger Mann in einer Uniform, die auch aus zweihundert Schritt teuer aussieht. Man wird später sagen, er sei der beste Soldat gewesen, den dieses Heer hatte, und der einzige, der begriffen hatte, was auf sie zukommt.',
    'Die Voltigeure gehen vor und setzen sich in die Hecken und Gärten am Fluss. Von da an ist es keine Schlacht mehr, sondern etwas, wofür die andere Seite kein Wort hat.'
  ],
  lage:{gegner:'Preußisch-sächsische Vorhut, achttausend Mann, in Linie auf offener Wiese',
        auftrag:'Die Saale-Übergänge nehmen und die Straße nach Norden öffnen',
        gelaende:'Wiesen am Fluss, Hecken, Gärten, dahinter die Stadt',
        stellung:'Erstes Treffen, links am Wasser'},
  intro:'Sie stehen, wie man vor vierzig Jahren gestanden hat. Ihr steht nicht.',
  runden:5,feindMoral:48,gefahr:10,gelaende:'bruecke',
  sieg:{text:'Nach zwei Stunden gibt die Linie nach, und was folgt, ist kein Rückzug mehr. Auf den Wiesen liegen zwölfhundert, in der Stadt werden Gefangene zusammengetrieben, und an einem Graben am Ortsrand liegt ein junger Mann in einer teuren Uniform, den ein Quartiermeister der Husaren erstochen hat, weil er sich nicht ergeben wollte.\\n\\nEs dauert bis zum Abend, bis jemand weiß, wer er war.',ruf:5,ruhm:true},
  niederlage:{text:'Die Hecken kosten mehr, als sie einbringen. Ihr kommt nicht über den Graben, und was den Ort nimmt, ist zwei Stunden später ein anderes Regiment. Der Prinz fällt trotzdem. Er fällt nur nicht vor euch.',ruf:-3,belastung:8}},

/* 68 */ {typ:'szene',id:'nach_norden',datum:'11.–13. Oktober 1806 · Auf der Straße nach Jena',ort:'Wen sie verloren haben',
  marsch:{von:'Saalfeld',nach:'Jena',weg:'60 km die Saale abwärts · drei Tage, jeden Tag Meldungen von rechts'},
  zwischenfall:true,
  text:[
    'Am Morgen nach Saalfeld steht in einem Tagesbefehl, wen die Preußen verloren haben: Louis Ferdinand von Preußen, Neffe Friedrichs des Großen, vierunddreißig Jahre alt, Chef eines Regiments, das seinen Namen trägt. Er ist von einem Unteroffizier erstochen worden, dessen Namen niemand aufgeschrieben hat.',
    'In der Kompanie wird das den ganzen Tag durchgekaut. Nicht der Tod — der Tod ist gewöhnlich. Sondern die Rechnung: Ein Prinz gegen einen Quartiermeister, und dazwischen liegt kein Unterschied, sobald beide auf derselben Wiese stehen.',
    'Danach marschiert ihr drei Tage die Saale abwärts, und mit jedem Tag kommen von rechts und links Meldungen herein, die einander widersprechen. Irgendwo dort drüben steht die preußische Hauptarmee. Niemand weiß, wo genau, auch der Kaiser nicht.',
    'Am 13. Oktober abends steht ihr am Fuß eines Bergs, auf dem eine Universitätsstadt liegt, und über euch werden Geschütze an Seilen einen Hohlweg hinaufgezogen, in dem zwei Männer nebeneinander nicht vorbeikommen.'
  ],
  optionen:[
    {label:'Mit an den Seilen ziehen',hint:'Konstitution · die halbe Nacht, im Dunkeln, bergauf',
     probe:{wert:'konstitution',schw:40},
     erfolg:{text:'Vierundzwanzig Geschütze durch einen Hohlweg, in dem der Karren an beiden Seiten schleift. Man zieht zu zwanzig an einem Seil, jemand zählt, und wenn es einmal zurückrutscht, zählt man wieder von vorn. Um drei Uhr früh steht die letzte Batterie oben. Am Morgen wird sie den Unterschied machen.',
       ruf:3,kameradschaft:8,atem:-16,belastung:6,fert:{drill:5}},
     misserfolg:{text:'Um Mitternacht rutscht der Karren an der engsten Stelle zurück, und der Mann neben dir kommt nicht schnell genug weg. Danach zieht ihr weiter, weil das Geschütz oben sein muss. Es ist oben, als es hell wird.',
       ruf:1,atem:-20,belastung:12,leben:-12}},
    {label:'Schlafen, wo du stehst',hint:'Morgen wird geschlagen',
     erfolg:{text:'Du legst dich an den Hang, den Tornister unter den Kopf, und schläfst vier Stunden zwischen Männern, die dasselbe tun. Über dir zieht die ganze Nacht die Artillerie vorbei, und du wachst nur einmal auf.',
       atem:16,belastung:-8,leben:10}},
    {label:'Nach vorn gehen und sehen, was drüben steht',hint:'Taktik · von der Kuppe sieht man in die Ebene',risk:true,
     probe:{wert:'taktik',schw:40},
     erfolg:{text:'Von oben sieht man im Mondlicht die Feuer der anderen, und sie stehen nicht so, wie sie nach den Meldungen stehen sollten. Es sind zu wenige. Du sagst es dem Sergenten, der Sergent sagt nichts, und am nächsten Tag stellt sich heraus, dass die Hälfte der preußischen Armee zwanzig Kilometer weiter nördlich steht und niemand es wusste.',
       fert:{taktik:8,kartenkunde:5},ruf:2},
     misserfolg:{text:'Du gehst zu weit nach vorn und wirst von einer eigenen Feldwache angerufen, die nervös ist und zuerst schießt. Es geht daneben. Der Rest der Nacht ist damit erledigt.',
       belastung:8,atem:-10}}
  ],
  rangText:{7:['Beim Capitaine liegen drei Meldungen, die einander widersprechen, und der Befehl, sich um vier Uhr bereitzuhalten. Auf die Frage, wogegen, gibt es keine Antwort, weil niemand eine hat.']}},

/* 69 */ {typ:'lager',id:'lager_landgrafenberg',datum:'13. Oktober 1806, nachts · Am Landgrafenberg',ort:'Die Nacht vor der Schlacht',
  abende:2,
  tun:['exerzieren','instand','schuhe','waffe','ruhe','leute','fouragieren'],
  text:[
    'Auf dem Plateau über Jena stehen bis zum Morgen dreißigtausend Mann auf einer Fläche, auf der eigentlich fünftausend Platz haben. Man liegt aneinander, weil man nicht anders liegen kann, und es ist die wärmste Nacht seit Bamberg.',
    'Feuer sind verboten. Der Kaiser geht zwischen den Männern durch, mit einer Laterne, und lässt sich von einem Pfarrer den Weg durch den Hohlweg erklären. Wer wach ist, sieht ihn; wer schläft, wird nicht geweckt.',
    'Unten im Tal steht Nebel, und in dem Nebel steht die preußische Armee — oder ein Teil von ihr, das weiß hier oben niemand.',
    'Es sind zwei Abende, wenn man die Nacht mitzählt, und man zählt sie mit.'
  ]},

/* 70 */ {typ:'kampf',id:'jena',datum:'14. Oktober 1806 · Jena',ort:'Der Landgrafenberg',
  haerte:1.4,
  marsch:{von:'Landgrafenberg',nach:'Die Ebene bei Vierzehnheiligen',weg:'3 km durch Nebel · angetreten um halb sechs, ohne Trommel'},
  anmarschKosten:{verschleiss:0.15,atem:6,belastung:2},
  anmarsch:[
    'Um halb sechs wird angetreten. Der Nebel steht so dicht, dass die Bataillone einander an den Trommeln finden müssen, und die Trommeln sind verboten.',
    'Ihr geht vom Plateau herunter in eine Ebene, von der niemand weiß, wie breit sie ist. Nach zwanzig Minuten läuft die erste Linie in eine preußische Vorpostenkette hinein, ohne sie vorher zu sehen. Danach schießen beide Seiten in eine Richtung, in der etwas sein könnte.',
    'Gegen zehn reißt der Nebel auf, und dann sieht man es: eine preußische Linie, drei Kilometer breit, in vollkommener Ordnung, wie auf dem Exerzierplatz. Sie steht da und lässt sich beschießen, weil ihr Reglement das Vorgehen erst nach dem Salvenwechsel vorsieht.',
    'Zwei Stunden lang stehen sie und schießen und sterben. Es ist kein Kampf, es ist eine Rechnung, und beide Seiten kennen das Ergebnis, bevor es fertig ist.'
  ],
  lage:{gegner:'Hohenlohes Armee, fünfundfünfzigtausend Mann, in Linie in der Ebene',
        auftrag:'Aus dem Nebel heraus, das Dorf halten, die Ebene öffnen',
        gelaende:'Ebene mit zwei Dörfern · Nebel bis zehn Uhr, danach freies Feld',
        stellung:'Erstes Treffen, rechts von Vierzehnheiligen'},
  intro:'Das hier wird kein gewöhnliches Gefecht. Auf dreißig Kilometern wird heute zweimal geschlagen, und niemand hier weiß etwas von der zweiten Schlacht.',
  /* **Gefahr 12, nicht 14 wie im Entwurf.** Mit `haerte` (+3) und Güte 7 landet
     das Gefecht bei 22 — genau auf der Höhe von Akkon und Austerlitz, den
     beiden anderen Spitzengefechten. Der Entwurfswert 14 hätte 24 ergeben und
     Jena damit still zum tödlichsten Gefecht des Spiels gemacht.
     **Die Regel, die daraus folgt: Kein Gefecht geht über 22, wenn nicht das
     Gefecht selbst die Regel seines Kapitels ist.** Die Regel dieses Kapitels
     ist der Marsch. */
  runden:9,feindMoral:82,gefahr:12,gelaende:'damm',
  sieg:{text:'Gegen ein Uhr geht die ganze Linie vor, und was drüben steht, hält es nicht aus. Was danach kommt, ist keine Schlacht mehr: Die Kavallerie geht durch und reitet bis in die Nacht.\\n\\nAbends erfährt man, dass zwanzig Kilometer nördlich, bei einem Dorf namens Auerstedt, an diesem Tag noch eine zweite Schlacht stattgefunden hat, von der hier niemand wusste. Sechsundzwanzigtausend Franzosen gegen fünfzigtausend Preußen. Und dass auch die gewonnen worden ist.',ruf:12,ruhm:true},
  niederlage:{text:'Vor dem Dorf bleibt ihr liegen, zweihundert Schritt vor einer Linie, die nicht weicht, weil sie nicht weichen darf. Was das Dorf nimmt, sind gegen Mittag die anderen. Die Schlacht ist gewonnen. Dein Teil davon ist es nicht.',ruf:-4,belastung:12}},

/* 71 */ {typ:'szene',id:'auerstedt',datum:'14. Oktober 1806, abends · Zwischen Jena und Weimar',ort:'Die zweite Schlacht',
  text:[
    'Es ist um vier vorbei. Auf der Straße nach Weimar steht alles, was von einer Armee übrig ist, wenn sie aufhört, eine zu sein: Wagen quer, Geschütze ohne Bespannung, Männer, die ihre Waffen nicht mehr haben und nicht sagen können, wo sie sie gelassen haben.',
    'Gegen sieben kommt die Nachricht von Norden. Bei Auerstedt hat ein Marschall mit sechsundzwanzigtausend Mann die preußische Hauptarmee geschlagen — fünfzigtausend, mit dem König und dem Herzog von Braunschweig dabei. Der Herzog hat einen Schuss durch beide Augen bekommen und wird in drei Wochen sterben.',
    'Der Kaiser hat den ganzen Tag geglaubt, er kämpfe gegen die Hauptarmee. Er hat gegen die Hälfte gekämpft. Die andere Hälfte ist zwanzig Kilometer weiter von einem Mann geschlagen worden, den er dafür zunächst nicht loben will.',
    'In der Kompanie zählt man ab. Es ist die kürzeste Abrechnung seit langem, weil viele einfach da sind.'
  ],
  optionen:[
    {label:'Die Verlustliste schreiben',hint:'Wer fehlt, fehlt namentlich',
     erfolg:{text:'Du gehst die Reihe ab und schreibst auf, wer nicht antritt. Bei zweien weiß man, wo sie liegen. Bei den anderen schreibt man „vermisst", und in vier Wochen schreibt jemand in Paris „gefallen" darüber, ohne je dagewesen zu sein.',
       belastung:-4,kameradschaft:6,fert:{verwaltung:5}}},
    {label:'Auf der Straße nach Weimar nachsehen',hint:'Menschenkenntnis · was eine Armee zurücklässt',risk:true,
     probe:{wert:'menschenkenntnis',schw:40},
     erfolg:{text:'Zwischen den umgestürzten Wagen sitzen preußische Soldaten und warten darauf, dass jemand ihnen sagt, was sie jetzt sind. Einer, der Französisch kann, fragt dich, ob es stimmt, dass der Herzog tot ist. Du weißt es nicht. Er nickt, als hättest du ja gesagt.',
       attr:{menschenkenntnis:4},belastung:4,geld:8},
     misserfolg:{text:'Auf der Straße sind schon andere gewesen, und was sie zurückgelassen haben, will man nicht mitnehmen. Ein Fourier scheucht dich zurück in die Kolonne. Er hat recht.',
       belastung:6}},
    {label:'Am Feuer sitzen und nichts sagen',hint:'Belastung sinkt',
     erfolg:{text:'Vierzehn Stunden Gefecht, und was hängen bleibt, ist nicht das Dorf und nicht die Kavallerie, sondern der Nebel am Morgen, in dem man in eine Richtung geschossen hat, weil dort etwas sein könnte. Du sagst dazu nichts, und niemand verlangt etwas anderes.',
       belastung:-10,kameradschaft:4}}
  ],
  rangText:{7:['Auf deinem Blatt stehen die Namen, die du selbst geschrieben hast. Es sind mehr als beim letzten Mal, und es ist das erste Mal, dass du dabei aufhörst, sie einzeln zu lesen.']}},

/* 72 */ {typ:'befoerderung',id:'weimar',datum:'18. Oktober 1806 · Weimar',ort:'Musterung nach der Doppelschlacht',
  keinZiel:'Auf dem Blatt stehen die Stellen, die frei geworden sind, und daneben die Namen derer, die sie bekommen. Deiner steht auf keiner der beiden Seiten. Das ist keine Kränkung, sondern eine Auskunft: Über dir ist niemand gefallen.',
  text:[
    'Vier Tage nach der Schlacht wird in Weimar gemustert. Es ist eine Musterung, wie es sie in dieser Armee seit Ägypten nicht gegeben hat: In den Listen stehen mehr leere Zeilen als besetzte, und drei Kompanien werden zu zweien zusammengelegt, weil es anders nicht geht.',
    'Der Capitaine hat einen Verband um die linke Hand und schreibt mit der rechten. Neben ihm sitzt der Fourier und liest vor, wer nicht mehr da ist.',
    'Was hier zählt, ist, wer am 14. Oktober im Nebel weitergegangen ist, als niemand mehr wusste, wohin.'
  ]},

/* 73 */ {typ:'szene',id:'verfolgung',datum:'20.–27. Oktober 1806 · Zwischen Elbe und Oder',ort:'Die Verfolgung',
  marsch:{von:'Weimar',nach:'Die Uckermark',weg:'350 km in vierzehn Tagen · niemand hat das je gemacht'},
  tempo:{
    text:[
      'Was jetzt kommt, hat es noch nicht gegeben: Eine geschlagene Armee wird nicht ziehen gelassen, sondern eingeholt. Zweiundzwanzig Tage lang marschiert die Kavallerie voraus und die Infanterie hinterher, und jeden zweiten Tag gibt irgendwo eine Festung oder ein Korps auf, weil es nicht glaubt, dass die Franzosen schon da sein können.',
      'Der Befehl lautet: nicht rasten, bis sie stehen. Was das für die Beine bedeutet, steht in keinem Befehl.',
      'Vor euch, irgendwo, zieht Hohenlohe mit zwanzigtausend Mann nach Norden und sucht einen Übergang über die Oder.'
    ],
    ueberspringt:'quartier_zehdenick',
    forciert:{hint:'ihr holt eine Kolonne ein, die aufgeben will',
      text:'Vierzig Kilometer am Tag, sechs Tage. Am siebten steht ihr auf einer Anhöhe, und unten auf der Straße steht eine preußische Kolonne, die nicht weiterkann, weil vor ihr Kavallerie steht, von der sie glaubt, es sei ein ganzes Korps. Es ist keins. Aber sie legen die Waffen nieder, und ihr habt sie eingeholt, und das steht später auch so im Bericht.',
      ruf:6,nennung:true},
    schonend:{text:'Ihr geht das Tempo, das ein Mensch gehen kann. Vor euch fahren die anderen die Ernte ein, und was ihr seht, wenn ihr ankommt, sind ihre Wachfeuer und ihre Gefangenen.'}
  },
  text:[
    'Preußen hat aufgehört, sich zu wehren, aber noch nicht aufgehört zu existieren. Zwischen euch und der Oder ziehen Reste einer Armee, die immer noch zahlenmäßig stärker ist als das, was ihnen nachgeht.',
    'Was sie nicht mehr haben, ist die Vorstellung, dass sie ankommen. Festungen, die drei Monate hätten halten müssen, geben nach einem Tag auf. In Erfurt ergeben sich vierzehntausend Mann einem Marschall, der zweitausend dabeihat. In Stettin nimmt ein Husarenoberst mit fünfhundert Reitern eine Festung mit hundertsechzig Geschützen.',
    'Man erzählt sich das abends, und man lacht darüber, und irgendwann lacht keiner mehr, weil man begreift, dass so etwas auch der eigenen Armee zustoßen kann.',
    'Deine Schuhe halten oder halten nicht. Das ist in diesen vierzehn Tagen die wichtigste Frage, die du zu entscheiden hast.'
  ],
  optionen:[
    {label:'Marschieren und an nichts denken',hint:'Konstitution · vierzehn Tage',
     probe:{wert:'konstitution',schw:40},
     erfolg:{text:'Man kann vierzehn Tage lang gehen, wenn man aufhört, sich vorzustellen, wie viele Tage noch kommen. Du kommst durch, und du kommst als einer der wenigen durch, die abends noch stehen können.',
       fert:{fouragieren:4},atem:-8,belastung:4},
     misserfolg:{text:'Am neunten Tag geht der rechte Schuh auf, und die restlichen fünf Tage sind eine Sache zwischen dir und deinen Füßen, bei der niemand hilft.',
       ausr:{schuhe:-35},atem:-14,belastung:8}},
    {label:'Die Nachzügler deiner Leute einsammeln',hint:'Menschenkenntnis · wer abends fehlt, fehlt an der Oder',
     ab:{wert:'rang',min:3,sonst:'Du bist selbst froh, wenn du abends ankommst. Wer hinter dir bleibt, bleibt hinter dir, und du siehst nicht zurück.'},
     probe:{wert:'menschenkenntnis',schw:40},
     erfolg:{text:'Jeden Abend eine Stunde die Straße zurück, jeden Morgen eine Stunde weniger Schlaf. Du bringst sechs herein, die sonst in einem Lazarett in Sachsen gelandet wären. Zwei von ihnen werden dir das später bei anderer Gelegenheit anrechnen.',
       kameradschaft:12,gunst:1,gunstVon:'vernet',atem:-10},
     misserfolg:{text:'Du findest zwei und verlierst dabei selbst den Anschluss. Am Morgen fehlen trotzdem vier, und die Gendarmerie hat keinen davon.',
       kameradschaft:-6,belastung:6,atem:-8}},
    /* Jede Szene braucht eine Wahl ohne Probe — sonst steht ein Mann mit
       durchgelaufenen Schuhen vor einer Station, an der jeder Knopf gesperrt
       ist (siehe den Notausgang in `zeigeSzene`). Hier ist sie außerdem das,
       was die meisten wirklich getan haben. */
    {label:'Die Schuhe schonen und hinten mitgehen',hint:'Du kommst an. Es sieht nur niemand',
     erfolg:{text:'Du gehst am Ende der Kompanie, nimmst jede Rast mit und ziehst zweimal am Tag die Schuhe aus. Am 27. Oktober bist du da, wie alle anderen auch, und in keinem Bericht steht dein Name. In vier Wochen wird niemand mehr wissen, wer vorn gegangen ist.',
       atem:6,belastung:-4,ruf:-1}}
  ],
  rangText:{7:['Die Marschtabelle für den Zug schreibst du selbst, und du schreibst hinein, was du für machbar hältst. Was du für machbar hältst, marschieren am nächsten Tag sechzig Männer, die nicht gefragt worden sind.']},
  rangOptionen:{9:[
    {label:'Aus der Kompaniekasse Schuhe kaufen',hint:'Verwaltung · das Geld ist dafür da, und es ist auch für anderes da',risk:true,
     probe:{wert:'verwaltung',schw:40},
     erfolg:{text:'In einer sächsischen Kleinstadt gibt es einen Schuster mit vierzig Paar auf Lager, und du kaufst sie alle, zu einem Preis, bei dem er dreimal nachfragt, ob er richtig gehört hat. Das Geld gehört der Kompanie. Sie merkt es an ihren Füßen und nicht am Buch.',
       kameradschaft:14,ausr:{schuhe:40},geld:-30},
     misserfolg:{text:'Der Schuster hat vierzig Paar und einen Zettel vom Divisionskommando, dass sie bereits requiriert sind. Wer den Zettel ausgestellt hat, steht nicht drauf. Du zahlst trotzdem und bekommst zwölf Paar.',
       ausr:{schuhe:15},geld:-30,belastung:4}}]}},

/* 74 */ {typ:'szene',id:'quartier_zehdenick',datum:'26. Oktober 1806 · Zehdenick',ort:'Ein Quartier für eine Nacht',
  zwischenfall:true,
  text:[
    'Ein Marktflecken an einem Kanal, in dem die halbe Division Quartier nimmt und die andere Hälfte im Freien liegt. Wer zuerst da ist, schläft unter einem Dach. Wer später kommt, schläft auf dem Markt.',
    'Der Bürgermeister steht mit einer Liste da, auf der steht, wie viele Betten der Ort hat. Es ist ein Zehntel dessen, was gebraucht wird, und er weiß es, und er hält die Liste trotzdem hoch.',
    'In der Scheune neben der Kirche liegen achtzig preußische Verwundete von Prenzlau, die keiner mitnehmen konnte. Ein Feldscher ist nicht da. Ein Feldscher ist seit vier Tagen nirgends da.',
    'Es regnet seit dem Nachmittag, und es wird die ganze Nacht regnen.'
  ],
  optionen:[
    {label:'In der Scheune helfen',hint:'Feldchirurgie · achtzig Mann, kein Arzt',
     probe:{wert:'feldchirurgie',schw:40},
     erfolg:{text:'Binden abnehmen, waschen, neu binden, und bei dreien das tun, was ein Feldscher zuerst tut: nichts mehr. Es dauert bis vier Uhr früh. Am Morgen leben zweiundsiebzig, und der Preuße, der Französisch kann, sagt einen Satz, den du nicht verstehst und dessen Ton eindeutig ist.',
       fert:{feldchirurgie:8},kameradschaft:6,belastung:4,atem:-10},
     misserfolg:{text:'Du hältst zwei Stunden durch. Danach gehst du hinaus und setzt dich in den Regen, und es ist besser draußen. In der Scheune ist es bis zum Morgen leiser geworden.',
       belastung:12,atem:-8}},
    {label:'Ein Quartier für deine Leute besorgen',hint:'Autorität · es gibt zu wenige Betten und keine Regel',
     probe:{wert:'autoritaet',schw:40},
     erfolg:{text:'Du stellst dich vor eine Scheune, ehe ein anderer Zug sie hat, und lässt zwanzig Mann hinein. Der Sergent, dessen Leute draußen bleiben, sagt dir etwas, das du dir merken wirst. Deine Leute schlafen trocken.',
       kameradschaft:10,atem:8,gunst:-1,gunstVon:'martel'},
     misserfolg:{text:'Ein anderer war schneller und hat mehr Streifen. Ihr liegt auf dem Markt, unter Planen, und es hört bis zum Morgen nicht auf zu regnen.',
       atem:-8,belastung:8,kameradschaft:-4}},
    {label:'Trocken werden und schlafen',hint:'Das Einfachste ist manchmal das Richtige',
     erfolg:{text:'Du findest eine halbe Türnische, ziehst die Schuhe aus, stellst sie neben dich und schläfst sechs Stunden. Am Morgen sind die Schuhe trocken. Das ist mehr wert als alles andere, was du in dieser Nacht hättest tun können.',
       atem:14,belastung:-8,ausr:{schuhe:20},leben:10}}
  ]},

/* 75 */ {typ:'kampf',id:'prenzlau',datum:'28. Oktober 1806 · Prenzlau',ort:'Die eingeholte Kolonne',
  marsch:{von:'Zehdenick',nach:'Prenzlau',weg:'45 km in einer Nacht und einem Vormittag'},
  anmarschKosten:{verschleiss:0.2,atem:8,belastung:2},
  anmarsch:[
    'Hohenlohes Korps ist seit zwölf Tagen auf der Straße und hat in dieser Zeit nicht einmal ausgeschlafen. Es sind noch zwölftausend, und sie brauchen bis zur Oder einen Tag.',
    'Sie bekommen ihn nicht. Vor Prenzlau steht französische Kavallerie quer über der Straße, und hinter der Kolonne steht ihr.',
    'Was hier geschossen wird, wird von Männern geschossen, die seit einer Woche wissen, dass es nichts nützt. Das macht sie nicht ungefährlich — es macht sie kurz gefährlich.',
    'Es ist elf Uhr vormittags, und die Sache wird um zwei entschieden sein.'
  ],
  lage:{gegner:'Hohenlohes Nachhut, erschöpft, ohne Munitionswagen',
        auftrag:'Die Straße sperren, bis die Kavallerie herum ist',
        gelaende:'Sandige Straße zwischen Seen, Weiden, ein Stadttor',
        stellung:'Erstes Treffen, an der Straße'},
  intro:'Sie haben seit zwölf Tagen nicht geschlafen. Ihr seit sechs. Darauf läuft es hinaus.',
  runden:5,feindMoral:42,gefahr:11,gelaende:'bruecke',
  sieg:{text:'Um zwei Uhr kommt ein preußischer Offizier mit einem weißen Tuch, und um vier legen zehntausend Mann die Waffen nieder — vor einer Truppe, die halb so stark ist und das die ganze Zeit gewusst hat.\\n\\nAuf dem Feld vor dem Tor liegen die Gewehre in Reihen, wie man sie hinlegt, wenn es geordnet zugeht. Es geht geordnet zu. Das ist das Merkwürdigste an diesem Tag.',ruf:6,ruhm:true},
  niederlage:{text:'Sie kommen durch, weil sie durchmüssen, und ihr steht am Straßenrand und seht ihnen nach. Zwei Tage später ergeben sie sich jemand anderem.',ruf:-3,belastung:8}},

/* 76 */ {typ:'szene',id:'berlin',datum:'November 1806 · Berlin',ort:'Die Hauptstadt',
  marsch:{von:'Prenzlau',nach:'Berlin',weg:'120 km nach Süden · vier Tage, zum ersten Mal ohne Eile'},
  zwischenfall:true,
  text:[
    'Am 27. Oktober ist der Kaiser durch das Brandenburger Tor geritten, zwischen zwei Reihen von Grenadieren, und die Berliner haben zugesehen und die Hüte abgenommen. Ihr wart an diesem Tag noch bei Prenzlau. Ihr kommt eine Woche später, und niemand nimmt mehr den Hut ab.',
    'Neunzehn Tage zwischen der Kriegserklärung und dem Einzug in die feindliche Hauptstadt. Es gibt keinen Feldzug in der Geschichte, der so schnell gegangen ist, und in der Kompanie weiß man das, ohne es beweisen zu können.',
    'Die Stadt ist unversehrt. Läden offen, Kaffeehäuser voll, Theater spielen. Auf den Straßen stehen preußische Beamte, die weiterarbeiten, weil ihnen niemand gesagt hat, dass sie aufhören sollen.',
    'Aus den Zeughäusern werden hundertfünfzigtausend Gewehre gefahren. Der Sold wird in preußischer Münze ausgezahlt, aus preußischen Kassen, und es ist das erste Mal seit Mähren, dass er pünktlich kommt.'
  ],
  optionen:[
    {label:'Die Stadt ansehen',hint:'Es ist die zweite Hauptstadt deines Lebens',
     erfolg:{text:'Unter den Linden, ein Schloss, ein Zeughaus, eine Straße, die so gerade ist, dass man das Ende sieht. Vor einem Buchladen steht ein Schaufenster mit Karten, und du stehst zehn Minuten davor und siehst zu, wie jemand drinnen eine kauft.',
       belastung:-10,attr:{menschenkenntnis:2},fert:{kartenkunde:3}}},
    {label:'In den Zeughäusern nachsehen, was herumliegt',hint:'Geschick · hundertfünfzigtausend Gewehre, und es zählt sie niemand',risk:true,
     probe:{wert:'geschick',schw:40},
     erfolg:{text:'Du nimmst keinen Säbel und keine Uhr, sondern einen Ladestock, zwei Feuersteine und ein Stück Wachstuch, das gegen Regen taugt. Der Unteroffizier, der dich sieht, sieht auch, was du nicht genommen hast, und lässt dich gehen.',
       ausr:{muskete:30,tornister:20},geld:10},
     misserfolg:{text:'Ein Gendarm hält dich im Hof an und lässt sich deinen Namen und deine Kompanie geben. Es passiert nichts weiter. Der Name steht jetzt auf einem Blatt, auf dem er nicht stehen sollte.',
       ruf:-3,gunst:-1,gunstVon:'vernet'}},
    {label:'Beutegeld annehmen',hint:'Es wird verteilt, und es wird nicht aufgeschrieben',risk:true,kosten:'Gunst-Risiko',
     erfolg:{text:'In der Kompanie wird verteilt, was aus einer Kasse in Küstrin gekommen ist, und es wird verteilt, ohne dass jemand ein Buch führt. Du nimmst deinen Teil. Alle nehmen ihren Teil. Vier Wochen später fragt ein Inspecteur nach dieser Kasse, und die Antwort, die er bekommt, ist eine, die alle vorher abgesprochen haben.',
       geld:45,belastung:4,gunst:-1,gunstVon:'collot'}},
    {label:'Schreiben lassen oder selbst schreiben',hint:'Nach Hause · aus Berlin geht Post',
     ab:{wert:'verheiratet',min:1,sonst:'Vor der Feldpost steht eine Schlange von Männern, die etwas nach Hause zu schreiben haben. Du gehst vorbei.'},
     erfolg:{text:'Fünf Wochen braucht ein Brief von Berlin nach Frankreich. Du schreibst, dass der Krieg gewonnen ist und dass du nicht weißt, wann ihr zurückkommt. Das erste stimmt. Beim zweiten weißt du bereits, dass es nach Osten geht.',
       belastung:-12,kameradschaft:4}}
  ],
  rangText:{7:['Im Quartier liegt ein Brief mit einem Siegel, das du nicht kennst, und darin steht nichts über dich. Es ist eine Anweisung, die Zugführer der Kompanie namentlich zu melden. Dein Name steht auf der Liste, die der Capitaine zurückschickt.']}},

/* 77 */ {typ:'lager',id:'quartier_berlin',datum:'November 1806 · Quartier in Berlin',ort:'Drei Wochen in einer fremden Stadt',
  abende:3,
  tun:['exerzieren','bajonett','scharf','instand','schuhe','waffe','lesen','ruhe','leute','fouragieren'],
  text:[
    'Drei Wochen Quartier in einer Stadt, die alles hat und nichts hergeben will. Man wohnt bei Leuten, die einen nicht wollen und höflich sind, weil ihnen nichts anderes übrig bleibt.',
    'Es gibt Fechtböden, weil preußische Offiziere Fechtböden hatten. Es gibt Buchbinder, Schuster, Uhrmacher und einen Waffenschmied in der Klosterstraße, der französisch spricht und dafür das Doppelte nimmt.',
    'Abends spielt in der Behrenstraße ein Theater weiter, als wäre nichts. Die halbe Loge ist französisch besetzt, die andere Hälfte berlinisch, und beide sehen auf die Bühne, damit sie einander nicht ansehen müssen.',
    'In drei Wochen geht es nach Osten. Was hier nicht getan wird, wird nicht mehr getan.'
  ]},

/* 78 */ {typ:'befoerderung',id:'berlin_musterung',datum:'20. November 1806 · Berlin',ort:'Musterung in der Hauptstadt',
  keinZiel:'Was jetzt käme, wird nicht in Berlin entschieden und nicht von einem Capitaine. Über dir ist alles besetzt, und die Stellen, die frei werden, werden in einem anderen Krieg frei.',
  text:[
    'Gemustert wird in einem preußischen Kasernenhof, unter preußischen Fenstern, von einem französischen Capitaine, der an einem preußischen Tisch sitzt. Es ist eine Ordnung, die vor sechs Wochen niemand für möglich gehalten hätte, und sie funktioniert seit dem ersten Tag.',
    'Zwei Bataillone werden aufgefüllt, und die Männer dafür kommen aus Frankreich nach: Konskribierte des Jahrgangs 1806, die seit sechs Wochen unterwegs sind und noch nie geschossen haben.',
    'Was hier zählt, ist nicht Berlin. Es ist, was zwischen dem 10. und dem 28. Oktober in den Listen aufgeschrieben worden ist.'
  ]},

/* 79 */ {typ:'szene',id:'nach_osten',datum:'25. November 1806 · Zwischen Oder und Weichsel',ort:'In den Schlamm',
  marsch:{von:'Berlin',nach:'Posen und weiter',weg:'400 km nach Osten · und ab der Oder gibt es keine Straßen mehr'},
  zwischenfall:true,
  text:[
    'Am 21. November ist in Berlin ein Dekret unterschrieben worden, das den britischen Inseln den Handel mit dem gesamten Festland verbietet. Es wird verlesen, und niemand in der Kompanie versteht, warum das etwas mit ihm zu tun haben soll. In sechs Jahren wird es der Grund sein, warum diese Armee nach Moskau marschiert.',
    'Was die Kompanie stattdessen bemerkt: Hinter der Oder hören die Straßen auf. Was man vorher Straße genannt hat, ist ab jetzt ein Streifen Lehm zwischen zwei Gräben, und im November ist der Lehm einen Fuß tief.',
    'Die Wagen bleiben stecken, und mit den Wagen bleibt das Brot stecken. Zum ersten Mal seit Bamberg ist die Frage, was man isst, wieder eine Frage.',
    'Es heißt, die Russen stünden hinter der Weichsel und rührten sich nicht. Es heißt auch, es sei dort kälter als in Frankreich. Beides stellt sich als richtig heraus.'
  ],
  optionen:[
    {label:'Fouragieren, wo nichts ist',hint:'Fouragieren · polnische Dörfer im November',
     probe:{wert:'fouragieren',schw:45},
     erfolg:{text:'Ein Vorratsloch unter einem Stall, das die vor euch nicht gefunden haben: Kartoffeln, Rüben, ein Sack Buchweizen. Die Bäuerin sieht zu und sagt nichts, und du legst zwei Francs auf den Tisch, die sie nicht anfasst, solange du hinsiehst.',
       kameradschaft:12,atem:6,belastung:4,geld:-2},
     misserfolg:{text:'Vier Höfe, vier Löcher, alle leer. Die vor euch waren gründlich, und was sie übrig gelassen haben, war schon vorher nichts. Am Abend gibt es, was jeder noch selbst hat.',
       belastung:8,atem:-8}},
    {label:'Durch den Schlamm marschieren und nichts weiter',hint:'Konstitution · vierzehn Tage einen Fuß tief',
     probe:{wert:'konstitution',schw:45},
     erfolg:{text:'Man zieht bei jedem Schritt den Fuß aus etwas heraus, das ihn festhalten will, vierzehn Tage lang, dreißigtausendmal am Tag. Du kommst durch. Was du dabei verlierst, ist keine Gesundheit, sondern eine bestimmte Art, an den Krieg zu denken.',
       atem:-12,belastung:8},
     misserfolg:{text:'In der zweiten Woche steckst du bis über die Knöchel in etwas, das nachts gefriert, und am Morgen sind die Zehen weiß. Es geht wieder weg. Es geht langsam wieder weg.',
       wunde:'Kalte Füße von der Weichsel',zehrt:3,atem:-14,belastung:8}},
    {label:'Zusehen, dass die Wagen durchkommen',hint:'Reiten · ohne die Wagen isst niemand',
     probe:{wert:'reiten',schw:40},
     erfolg:{text:'Vorspann umlegen, sechs Pferde an einen Wagen statt vier, die Räder freischaufeln und wieder von vorn. Am Ende des Tages sind vier Wagen zehn Kilometer weiter, und das ist die Ration für zwei Tage für ein Bataillon.',
       kameradschaft:8,fert:{reiten:8},gunst:1,gunstVon:'collot',atem:-10},
     misserfolg:{text:'Ein Rad bricht, und was auf dem Wagen war, wird auf die Männer verteilt, die ohnehin schon tragen. Du trägst dreißig Pfund mehr als gestern.',
       belastung:10,atem:-12}},
    {label:'Gehen und nichts weiter',hint:'Vierzehn Tage, ein Fuß vor den anderen',
     erfolg:{text:'Du gehst. Es gibt nichts zu entscheiden und nichts zu holen, und das ist der größere Teil dieses Krieges. Am Abend sind es dreißig Kilometer weniger bis zu einem Ort, dessen Namen niemand aussprechen kann.',
       atem:-6,belastung:4}}
  ]},

/* 80 */ {typ:'winter',id:'weichsel',datum:'Dezember 1806 · Winterlinie an der Weichsel',ort:'Quartier hinter dem Fluss',
  wochen:3,
  tun:['ausr','drill','lesen','leute','ruhe','marketender'],
  rangTun:{5:['ausbilden'],7:['fechtboden']},
  frage:'Drei Wochen. Was tust du damit?',
  text:[
    'Die Armee bezieht Winterquartiere hinter der Weichsel, in Dörfern aus Holz und Lehm, in denen zwanzig Männer in eine Stube gehen, wenn man es darauf anlegt. Man legt es darauf an.',
    'Es ist der erste Winter dieses Krieges, in dem der Sold pünktlich kommt und das Brot nicht. Man kann sich in Polen nichts kaufen, weil es nichts gibt, und wenn es etwas gibt, ist es in einer Woche das Doppelte wert.',
    'Von den Russen hört man nichts. Sie stehen irgendwo im Osten, sie sind nicht geschlagen worden, und in vier Wochen wird sich herausstellen, dass sie nicht vorhaben zu warten.',
    'Drei Wochen unter einem Dach. Es sind die letzten drei Wochen dieser Art für lange Zeit, und das weiß in diesem Dezember niemand.'
  ]},

/* 81 */ {typ:'uebergang',id:'ende_jena',datum:'31. Dezember 1806 · Biwak an der Weichsel',ort:'Das Jahr endet',
  text:[
    'Zwischen dem 8. Oktober und dem 7. November ist die preußische Armee verschwunden. Nicht geschlagen — verschwunden: einhundertvierzigtausend Gefangene, dreitausend Geschütze, jede Festung zwischen Elbe und Oder, und ein König, der sich nach Ostpreußen zurückgezogen hat, an das äußerste Ende seines Landes.',
    'Es hat vier Wochen gedauert. Vierzehn Tage davon sind marschiert worden, und zwei Tage ist geschossen worden.',
    'Von den Männern, die im Oktober in Bamberg mit dir angetreten sind, fehlt einer von zwölf. Es ist der billigste Feldzug, den diese Armee je geführt hat, und es wird der letzte billige sein.',
    'Am Silvesterabend steht die Kompanie in einem polnischen Dorf um ein Feuer, das aus einem abgebrochenen Zaun gemacht ist. Es ist minus zehn Grad. Man rechnet aus, wie viele Kilometer man in diesem Jahr gegangen ist, und kommt auf eine Zahl, die niemand glauben will.'
  ],
  }
];

/* Anmeldung: an das laufende Band anhängen und beim Verlauf eintragen.
   `.slice()` ist Pflicht, nicht Kosmetik — siehe die Warnung in Kapitel 1. */
KAPITEL.push(...KAPITEL5);
STATIONEN.jena = KAPITEL5.slice();
(KAMPAGNEN.find(k=>k.id==='jena')||{}).gebaut = true;
