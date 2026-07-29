'use strict';
/* Kapitel 11 — Die Hundert Tage 1815. Reine Daten, wie die Kapitel davor.

   ══════════════════ Die eigene Regel ══════════════════

   **Alle wissen, wie es ausgeht. Die Figuren nicht.**

   Das kürzeste Kapitel: acht Stationen, achtzehn Tage Feldzug. Zutritt nur mit
   Rang ≥ 10 — die Schranke aus Kapitel 10 —, und der Rückruf aus dem
   Ruhestand ist die Eingangsszene: ein Brief, eine Nacht Bedenkzeit, und die
   Bedenkzeit ist eine echte Wahl. **Wer hier ablehnt, bekommt ein
   vollwertiges Ende**, nicht ein schlechteres.

   **Der Ton kippt ein letztes Mal.** Sold-Moral 1,0 — Napoleon zahlt sofort
   und bar, und das Spiel lässt spüren, warum: Es ist das Geld eines Mannes,
   der keine zweite Chance bekommt. Alles hier hat diese Doppelbödigkeit; die
   Begeisterung der Armee ist echt, und auf der Karte bewegen sich drei Armeen
   auf Belgien zu, gegen eine.

   **Waterloo ist auf jeder Ebene spielbar, auf der man ankommt** — Rang 10–11
   führt ein Bataillon oder Regiment im klassischen Bild, Rang 12–13 auf der
   Operationskarte. Dieselben Fixpunkte, vier Maßstäbe. Das ist der
   Abschlussbeweis der ganzen Bauidee: ein Inhalt, vier Maßstäbe.

   ══════════════════ Historische Fixpunkte (Invariante 8) ══════════════════

   Landung bei Golfe-Juan 1. März 1815 · Paris 20. März · Grenzübertritt
   15. Juni · **Ligny und Quatre-Bras 16. Juni** · der Regen am 17. ·
   **Waterloo 18. Juni** · „la Garde recule" am Abend · zweite Abdankung
   22. Juni. Dazwischen ist alles frei erfunden. */

const KAPITEL11 = [

/* 149 */ {typ:'szene',id:'der_brief',datum:'April 1815 · Zu Hause',ort:'Der Rückruf',
  text:[
    'Der Brief kommt mit der Post und liegt zwei Stunden auf dem Tisch, bevor du ihn aufmachst. Er ist gedruckt, mit einer handschriftlichen Zeile am Rand und einem Siegel, das seit einem Jahr nicht mehr gültig sein sollte.',
    'Es steht darin, dass die Armee neu aufgestellt wird und dass dein Rang, dein Dienstalter und deine Verwendung anerkannt bleiben. Es steht nicht darin, gegen wen.',
    'Draußen ist April. Du hast seit einem Jahr Halbsold, ein Zimmer, und niemand hat in dieser Zeit von dir verlangt, dass jemand stirbt.',
    'Es wird nicht gedrängt. Es gibt eine Frist von vierzehn Tagen, und was man in diesen vierzehn Tagen entscheidet, ist die letzte Entscheidung dieser Laufbahn, die einem vollständig selbst gehört.'
  ],
  optionen:[
    {label:'Annehmen',hint:'Nach Paris, und von dort nach Norden',
     erfolg:{text:'Du packst, was du hast, und meldest dich bei der nächsten Sammelstelle. Es sind erstaunlich viele da, die du kennst, und alle sehen älter aus, als sie sein sollten.\\n\\nEs wird nicht darüber gesprochen, warum man gekommen ist. Es ist nicht nötig.',
       setzt:{zurueckgerufen:true},belastung:6,ruf:4}},
    {label:'Ablehnen',hint:'Ein Ende, kein schlechteres · die Laufbahn endet hier',
     erfolg:{text:'Du schreibst zwei Sätze, faltest das Papier und gibst es zur Post. Danach gehst du hinaus und tust den Rest des Tages nichts Besonderes.\\n\\nIm Juli liest du in der Zeitung, wie es ausgegangen ist. Du liest es zu Ende, faltest die Zeitung und legst sie weg. Es ist die vernünftigste Entscheidung deines Lebens, und du wirst sie dreißig Jahre lang bereuen.',
       setzt:{abgelehnt:true},belastung:-10}}
  ]},

/* 150 */ {typ:'szene',id:'paris_april',datum:'Mai 1815 · Paris',ort:'Die alte Armee sammelt sich',
  marsch:{von:'Halbsold, irgendwo',nach:'Paris',weg:'Von überall her, auf eigene Kosten, in vierzehn Tagen'},
  zwischenfall:true,
  text:[
    'In sechs Wochen entsteht eine Armee aus nichts: zweihundertachtzigtausend Mann, davon die Hälfte Veteranen, die aus dem Halbsold, aus englischer Gefangenschaft und aus den Depots zurückkommen.',
    'Es sind bekannte Gesichter dabei, und es fehlen bekannte Gesichter. Wer 1812 in Russland geblieben ist, ist geblieben; wer 1814 auf Halbsold ging, steht hier oder nicht.',
    'Die Stimmung ist etwas, das man nicht erwartet hätte. Es ist keine Begeisterung wie 1805; es ist etwas Trockeneres, Entschlosseneres, und es hat mit dem Wissen zu tun, dass diesmal nichts mehr danach kommt.',
    'Auf der Karte im Stab bewegen sich drei Armeen auf Belgien zu: Wellington, Blücher, dazu Österreicher und Russen am Rhein. Zusammen achthunderttausend. Der Plan ist, die ersten beiden zu schlagen, bevor die anderen da sind.'
  ],
  optionen:[
    {label:'Deine Leute suchen',hint:'Menschenkenntnis · wer von damals noch da ist, ist mehr wert als zwei Rekruten',
     probe:{wert:'menschenkenntnis',schw:45},
     erfolg:{text:'Du gehst die Sammelstellen ab und suchst nach Namen, die du kennst. Du findest neun. Zwei kommen aus englischer Gefangenschaft, einer war seit 1813 in einem Depot vergessen worden.\\n\\nNeun Männer, die wissen, wie man in einem Karree steht, sind in dieser Armee mehr wert als hundert, die es nicht wissen.',
       einheit:18,kameradschaft:14},
     misserfolg:{text:'Die Listen sind unvollständig, die Sammelstellen überfüllt, und die Namen, die du suchst, stehen auf keiner davon. Vielleicht sind sie da. Du findest sie nicht.',
       belastung:8}},
    {label:'Ausrüstung besorgen, solange die Magazine offen sind',hint:'Verwaltung · in vierzehn Tagen ist nichts mehr da',
     probe:{wert:'verwaltung',schw:45},
     erfolg:{text:'Die Magazine sind voll, weil sie ein Jahr lang niemand angerührt hat, und leer, sobald jemand mit einem Zettel kommt. Du kommst mit einem Zettel, und zwar zuerst.',
       ausr:{schuhe:60,muskete:45,tornister:40,mantel:40},kameradschaft:8},
     misserfolg:{text:'Vor dem Magazin stehen sechs Regimenter, und der Verwalter hat eine Reihenfolge, in der deins nicht vorkommt. Was du bekommst, ist, was übrig ist.',
       ausr:{schuhe:15,muskete:10},belastung:6}},
    {label:'Zuhören, was geredet wird',hint:'Es klingt anders als 1805, und man merkt sofort, warum',
     erfolg:{text:'Es wird nicht geprahlt. Es wird über Marschtabellen geredet, über Pferde, über die Frage, ob die Belgier in Wellingtons Armee schießen werden. Es ist die Sorte Gespräch, die Leute führen, die genau wissen, wie knapp es ist.',
       fert:{taktik:5},belastung:-8,attr:{menschenkenntnis:3}}}
  ]},

/* 151 */ {typ:'szene',id:'grenzuebertritt',datum:'15. Juni 1815 · Über die Sambre',ort:'Der letzte Marsch',
  marsch:{von:'Beaumont',nach:'Über die Sambre bei Charleroi',weg:'Der letzte Grenzübertritt dieser Laufbahn'},
  tempo:{
    text:[
      'Wellington steht bei Brüssel, Blücher bei Namur, und zwischen ihnen liegen fünfzig Kilometer. Der ganze Feldzug beruht darauf, in diese Lücke zu gehen und beide getrennt zu schlagen.',
      'Das heißt: schneller sein, als zwei Armeen sich verständigen können. Es ist derselbe Gedanke wie 1806 und wie im Februar 1814, und es ist das letzte Mal, dass er angewandt wird.',
      'Es ist der 15. Juni, es ist warm, und in Brüssel geben sie an diesem Abend einen Ball.'
    ],
    ueberspringt:'quartier_charleroi',
    forciert:{hint:'ihr steht zwischen ihnen, bevor sie es wissen',
      text:'Ihr geht durch. Am Abend des 15. steht die Armee auf beiden Seiten der Sambre, zwischen zwei Armeen, die noch nicht wissen, dass der Feldzug begonnen hat. Es ist genau das, was der Plan verlangt.',
      ruf:5},
    schonend:{text:'Ihr geht das Tempo, bei dem alle ankommen. Am Abend steht die Hälfte der Armee diesseits der Sambre, und in Brüssel weiß man seit zwei Stunden Bescheid.',
      atem:12}
  },
  text:[
    'Um halb vier Uhr früh geht es über die Grenze, in drei Kolonnen, auf einer Front von zwanzig Kilometern. Es ist gut gemacht: Bis zum Mittag hat keine der beiden feindlichen Armeen begriffen, was passiert.',
    'Die Kolonne geht durch Dörfer, in denen vor drei Jahren französische Präfekten saßen und in denen jetzt niemand grüßt.',
    'Es ist das siebte Land, in das du in dieser Laufbahn einmarschierst. Bei den ersten sechs hast du mitgezählt.',
    'Abends steht die Armee an der Sambre. Vor euch, irgendwo, stehen zweihundertfünfzigtausend Mann in zwei Armeen, die noch nicht zusammen sind.'
  ],
  optionen:[
    {label:'Die Karte lesen, solange es hell ist',hint:'Kartenkunde · fünfzig Kilometer Lücke, und sie schließt sich',
     probe:{wert:'kartenkunde',schw:45},
     erfolg:{text:'Zwei Straßen, eine Kreuzung bei einem Ort namens Quatre-Bras, und dahinter ein Höhenzug, auf dem ein Wald steht. Wer die Kreuzung hat, trennt die beiden Armeen. Wer sie nicht hat, hat morgen zwei Gegner statt einem.\\n\\nDu siehst es auf der Karte in fünf Minuten. Es sehen an diesem Abend mehrere, und einer von ihnen ist der, der den Befehl schreibt.',
       fert:{kartenkunde:8,taktik:6}},
     misserfolg:{text:'Straßen, Bäche, Ortsnamen auf Flämisch. Nach zehn Minuten legst du die Karte weg und merkst dir das Einzige, was sicher ist: Es geht nach Norden.',
       fert:{kartenkunde:3}}},
    {label:'Bei den Leuten bleiben',hint:'Die Hälfte war 1812 dabei, und die andere Hälfte fragt sie danach',
     erfolg:{text:'Am Feuer sitzen zwei, die Russland überlebt haben, und drei, die im März siebzehn geworden sind. Die drei fragen, die zwei antworten nicht viel, und beides ist genau richtig.',
       kameradschaft:10,einheit:8,belastung:-6}}
  ]},

/* 152 */ {typ:'szene',id:'quartier_charleroi',datum:'15. Juni 1815, abends · Charleroi',ort:'Eine Nacht diesseits',
  text:[
    'Die Stadt ist am Mittag genommen worden, fast ohne Schuss. Es gibt Quartier, es gibt Brot, und es gibt einen Abend, an dem noch nichts entschieden ist.',
    'Der Kaiser sitzt vor einem Gasthaus an der Straße und sieht der Kolonne beim Vorbeimarsch zu. Es heißt, er sei eingeschlafen. Man kann es glauben oder nicht; man kann von dieser Stelle aus sehen, dass er sitzt und dass er sechsundvierzig ist und aussieht wie fünfundfünfzig.',
    'Es ist die letzte ruhige Nacht dieses Feldzugs und die letzte dieser Laufbahn.',
    'In Brüssel, siebzig Kilometer nördlich, wird um diese Zeit ein Ball eröffnet.'
  ],
  optionen:[
    {label:'Schlafen',hint:'Morgen wird geschlagen, übermorgen auch',
     erfolg:{text:'Sechs Stunden in einem Bett, in einem Haus, mit einem Dach. Es ist das letzte Mal.',
       leben:20,atem:22,belastung:-12}},
    {label:'Alles zum letzten Mal durchsehen',hint:'Geschick · was jetzt nicht in Ordnung ist, bleibt es',
     probe:{wert:'geschick',schw:35},
     erfolg:{text:'Schuhe, Riemen, Schloss, Klinge. Du machst es, wie du es seit neunzehn Jahren machst, in derselben Reihenfolge, ohne nachzudenken. Es dauert vierzig Minuten und ist so etwas wie ein Gebet für jemanden, der nicht betet.',
       ausr:{schuhe:35,muskete:35,tornister:25},belastung:-6},
     misserfolg:{text:'Du fängst an und schläfst dabei ein. Am Morgen liegt alles halb zerlegt da, und es ist keine Zeit mehr.',
       ausr:{muskete:-10},atem:8}},
    {label:'Nachrechnen, was gegen euch steht',hint:'Taktik · es ist keine Zahl, die man nachrechnen sollte',
     ab:{wert:'bildung',min:40,sonst:'Es werden Zahlen genannt. Man hört sie und legt sich hin.'},
     erfolg:{text:'Hundertfünfundzwanzigtausend gegen zweihundertzwanzigtausend, und dahinter noch einmal fünfhunderttausend am Rhein, die in sechs Wochen da sind. Das geht nur auf, wenn beide getrennt geschlagen werden, und zwar diese Woche.\\n\\nDu rechnest es zu Ende, und dann liegst du wach.',
       fert:{taktik:8},belastung:10}}
  ]},

/* 153 */ {typ:'kampf',id:'ligny',datum:'16. Juni 1815 · Ligny',ort:'Der letzte Sieg',
  marsch:{von:'Charleroi',nach:'Ligny',weg:'15 km nach Nordosten · und die Preußen stehen auf einem Hang, den man von unten ganz übersieht'},
  anmarschKosten:{verschleiss:0.15,atem:6,belastung:2},
  anmarsch:[
    'Blücher hat drei Korps auf einem Hang aufgestellt, in Dörfern an einem Bach, und man kann von unten jedes einzelne Bataillon zählen. Wellington hat ihm am Vormittag gesagt, so aufgestellt werde er zusammengeschossen. Blücher hat es trotzdem so gelassen.',
    'Die Dörfer am Bach — Ligny, Saint-Amand — werden ab drei Uhr genommen, verloren, wieder genommen. Es sind Häuser aus Bruchstein, Mauern, Gärten, und der Bach dazwischen ist vier Meter breit.',
    'Gegen halb acht abends, bei einem Gewitter, geht die Garde in der Mitte durch. Danach ist die preußische Armee in zwei Teile geschnitten und Blücher liegt unter seinem Pferd.',
    'Es ist der letzte Sieg dieser Armee, und es weiß an diesem Abend niemand.'
  ],
  lage:{gegner:'Blüchers Armee, vierundachtzigtausend Mann, in Dörfern an einem Bach',
        auftrag:'Die Dörfer halten, bis die Garde in der Mitte durchgeht',
        gelaende:'Bach, Dörfer aus Bruchstein, Hang dahinter · abends Gewitter',
        stellung:'Erstes Treffen, in Ligny'},
  intro:'Der letzte Sieg dieser Laufbahn. Man erkennt ihn nicht daran, dass er der letzte ist.',
  runden:8,feindMoral:74,gefahr:10,gelaende:'damm',
  sieg:{text:'Um halb neun ist das Dorf euer und die preußische Mitte durchbrochen. Blücher wird unter seinem toten Pferd hervorgezogen und weggebracht; die Armee zieht in der Nacht ab.\\n\\nSie zieht nach **Norden** ab, nicht nach Osten. Das ist der ganze Unterschied dieses Feldzugs, und niemand auf dieser Seite bemerkt es bis übermorgen nachmittags um halb fünf.',ruf:12,ruhm:true},
  niederlage:{text:'Das Dorf wechselt sechsmal, und beim sechsten Mal steht ihr nicht mehr darin. Was durchbricht, ist um halb acht die Garde. Die preußische Armee zieht in der Nacht ab — nach Norden, was hier niemandem auffällt.',ruf:-4,belastung:14}},

/* 154 */ {typ:'szene',id:'tag_des_regens',datum:'17. Juni 1815 · Auf der Straße nach Brüssel',ort:'Der Tag des Regens',
  text:[
    'Es fängt am Mittag an zu regnen und hört bis in die Nacht nicht auf. Die Felder sind Lehm; die Kolonne kommt zwei Kilometer in der Stunde voran, und die Artillerie kommt gar nicht voran.',
    'Am Vormittag ist nichts geschehen. Es hat sechs Stunden gedauert, bis ein Befehl gegeben wurde, und in diesen sechs Stunden ist Wellington von Quatre-Bras auf einen Höhenzug bei Mont-Saint-Jean abmarschiert, ungestört.',
    'Gegen Mittag geht ein Marschall mit dreiunddreißigtausend Mann nach Osten ab, um die Preußen zu verfolgen. Der Befehl ist mündlich gegeben und schriftlich nachgereicht worden, und in beiden steht nicht dasselbe.',
    'Man liest die Meldung darüber am Abend im Biwak und denkt sich nichts dabei. Man wird sie am übernächsten Tag um halb fünf noch einmal lesen und dann etwas dabei denken.'
  ],
  optionen:[
    {label:'Die Meldung lesen und nichts denken',hint:'Es gibt keinen Grund, etwas zu denken',
     erfolg:{text:'Dreiunddreißigtausend Mann gehen nach Osten, um eine geschlagene Armee zu verfolgen. Das ist Vorschrift und richtig, und wenn es klappt, kommt Blücher nicht zurück.\\n\\nDu liest es und gibst das Blatt weiter. Es ist die letzte Meldung dieses Krieges, bei der du dir nichts denkst.',
       belastung:4}},
    {label:'Auf der Karte nachsehen, wo die Preußen hin sind',hint:'Kartenkunde · nach Osten steht im Befehl. Nach Norden wäre schlimmer',risk:true,
     ab:{wert:'rang',min:9,sonst:'Die Karte liegt beim Stab, und beim Stab hat man anderes zu tun, als sie einem Zugführer zu zeigen.'},
     probe:{wert:'kartenkunde',schw:50},
     erfolg:{text:'Die Meldungen der Kavalleriepatrouillen sind dünn und widersprechen sich. Zwei sagen Osten, eine sagt Wavre, und Wavre liegt nach Norden — zwanzig Kilometer von Mont-Saint-Jean, das heißt einen halben Tagesmarsch.\\n\\nDu meldest es. Es wird zur Kenntnis genommen. Was aus einer zur Kenntnis genommenen Meldung wird, entscheidet sich übermorgen um halb fünf.',
       fert:{kartenkunde:8,taktik:6},ruf:4,belastung:8},
     misserfolg:{text:'Die Meldungen widersprechen sich, und du kommst zu keinem Schluss. Es ist keine Schande — es kommt in diesen zwei Tagen niemand zu einem Schluss, und das ist der Grund, warum es ausgeht, wie es ausgeht.',
       belastung:6}},
    {label:'Für die Nacht sorgen',hint:'Es regnet, und morgen wird geschlagen',
     erfolg:{text:'Kein Feuer, kein Stroh, kein Dach; es gibt nichts zu holen. Was zu tun ist: das Schloss trocken halten, die Patronen unter den Rock, und sich so hinlegen, dass man nicht im Wasser liegt.\\n\\nDie ganze Armee verbringt diese Nacht so. Am Morgen ist keiner ausgeruht, und auf der anderen Seite auch nicht.',
       ausr:{muskete:20},belastung:-4,atem:6}}
  ]},

/* 155 */ {typ:'kampf',id:'waterloo',datum:'18. Juni 1815 · Mont-Saint-Jean',ort:'Waterloo',
  haerte:1.4,
  marsch:{von:'Biwak bei Le Caillou',nach:'Die Ebene vor Mont-Saint-Jean',weg:'Drei Kilometer · und dann wird bis halb zwölf gewartet, bis der Boden trocknet'},
  anmarschKosten:{verschleiss:0.15,atem:6,belastung:3},
  anmarsch:[
    'Der Angriff beginnt um halb zwölf statt um sechs, weil der Boden zu weich für die Artillerie ist. Es sind fünf Stunden, und sie werden am Abend genau die fünf Stunden sein, die fehlen.',
    'Gegenüber, auf einem Höhenzug, steht Wellington mit achtundsechzigtausend Mann, davon ein Drittel Briten und der Rest Niederländer, Belgier, Braunschweiger, Hannoveraner. Er steht hinter dem Kamm, wo man ihn nicht sieht und nicht trifft.',
    'Vor seinem rechten Flügel liegt ein ummauertes Gut namens Hougoumont, vor der Mitte ein Bauernhof namens La Haye Sainte. Beide werden den ganzen Tag über gehalten, und beide fressen mehr, als sie wert sind.',
    'Um halb fünf Uhr nachmittags erscheint am östlichen Horizont eine dunkle Linie. Ein Adjutant meldet, es seien die Truppen des Marschalls, der nach Osten abmarschiert ist. Es sind die Preußen.'
  ],
  lage:{gegner:'Wellingtons Armee auf dem Höhenzug — und ab halb fünf Blücher in der rechten Flanke',
        auftrag:'Den Kamm nehmen, bevor die Preußen da sind',
        gelaende:'Ebene, ein Hohlweg, zwei ummauerte Güter, dahinter ein Höhenzug',
        stellung:'Erstes Treffen, gegen die Mitte'},
  intro:'Das hier wird kein gewöhnliches Gefecht. Und ab halb fünf steht rechts von euch etwas, das dort nicht stehen sollte.',
  runden:10,feindMoral:100,gefahr:7,gelaende:'mauer',
  sieg:{text:'Gegen sieben Uhr geht die Garde den Hang hinauf, in zwei Kolonnen, zum ersten Mal in zwanzig Jahren gegen eine ungebrochene Linie. Sie kommt bis zwanzig Schritt an den Kamm.\\n\\nDann steht die britische Linie auf, die dahinter im Getreide gelegen hat, und feuert. Die Garde geht zurück, und jemand in der französischen Linie ruft die zwei Wörter, die diesen Krieg beenden.\\n\\nDu stehst da, wo du stehst, und was um dich herum passiert, ist keine Schlacht mehr.',ruf:14,ruhm:true},
  niederlage:{text:'Es ist um neun Uhr abends vorbei. Was auf der Straße nach Süden geht, ist keine Armee, und was die preußische Kavallerie in dieser Nacht einholt, bleibt liegen.\\n\\nDrei Karrees der alten Garde stehen bis zuletzt auf dem Feld und werden zusammengeschossen. Man sieht es aus der Entfernung, und es sieht aus wie etwas, das man später nicht erklären kann.',ruf:-4,belastung:20}},

/* 156 */ {typ:'szene',id:'strasse_nach_sueden',datum:'19.–22. Juni 1815 · Auf der Straße nach Süden',ort:'Was übrig ist',
  marsch:{von:'Mont-Saint-Jean',nach:'Nach Süden, über die Grenze zurück',weg:'Achtzig Kilometer, in vier Tagen, ohne Ordnung'},
  text:[
    'Die Straße nach Charleroi ist vier Tage lang voll. Es marschiert niemand; es gehen Männer, einzeln und in kleinen Gruppen, in dieselbe Richtung.',
    'Am 21. ist der Kaiser in Paris. Am 22. dankt er zum zweiten Mal ab, diesmal zugunsten seines Sohnes, den niemand je als Kaiser anerkennen wird. Es steht in einer Zeitung, die jemand aus Paris mitgebracht hat, und sie wird am Straßenrand von zwanzig Männern nacheinander gelesen.',
    'Was jetzt kommt, ist keine Frage der Armee mehr. Es ist eine Frage dessen, was jeder Einzelne mit dem anfängt, was ihm geblieben ist.',
    'Wenn du einen Adler trägst, trägst du ihn immer noch. Es gibt niemanden mehr, dem man ihn abgeben könnte.'
  ],
  optionen:[
    {label:'Den Adler zerlegen und verstecken',hint:'Sie werden eingesammelt und eingeschmolzen',
     ab:{wert:'adler',min:1,sonst:'Du trägst keinen Adler. Was du zu tragen hast, wiegt weniger und lässt sich schlechter verstecken.'},
     erfolg:{text:'Du nimmst ihn von der Stange, wickelst ihn in ein Hemd und trägst ihn im Tornister. Die Stange bleibt an der Straße liegen; eine Stange ist nur Holz.\\n\\nIm Juli werden alle Adler eingesammelt und eingeschmolzen. Deiner nicht. Er liegt bis 1830 unter den Dielen eines Zimmers, und danach hängt er über einem Kamin, und danach weiß niemand mehr, welcher es war.',
       ruf:5,belastung:-8}},
    {label:'Deine Leute zusammenhalten, solange es geht',hint:'Autorität · es gibt kein Ziel mehr, zu dem man sie führen könnte',
     probe:{wert:'autoritaet',schw:45},
     erfolg:{text:'Du sammelst ein, wen du kennst, und bringst neunzehn Mann über die Grenze, in Ordnung, mit Waffen. Es gibt keinen Grund dafür. Es ist das Einzige, was du noch kannst, und du tust es deshalb ordentlich.',
       kameradschaft:16,ruf:4,belastung:-6},
     misserfolg:{text:'Sie hören zu und gehen dann weiter, jeder in seine Richtung. Es ist kein Ungehorsam; es ist nur nichts mehr da, worauf ein Befehl sich stützen könnte.',
       kameradschaft:-8,belastung:12}},
    {label:'Allein gehen',hint:'Achtzig Kilometer, und danach ist es vorbei',
     erfolg:{text:'Du gehst allein, weil es nichts zu führen gibt und nichts zu bereden. Vier Tage, achtzig Kilometer, dieselbe Richtung wie zehntausend andere, die auch allein gehen.\\n\\nAn der Grenze steht ein Gendarm mit einer weißen Kokarde und schreibt Namen auf. Du nennst deinen. Er schreibt ihn falsch, und du berichtigst ihn nicht.',
       belastung:10}}
  ]},

/* 157 */ {typ:'ende',id:'epilog',datum:'Sommer 1815',ort:'Der Epilog',
  epilog:true,
  text:[
    'Es ist vorbei. Neunzehn Jahre, sieben Feldzüge, und am Ende ein Höhenzug in Belgien, auf dem eine Linie aufsteht, die im Getreide gelegen hat.',
    'Was von der Armee übrig ist, wird im Juli aufgelöst. Die Adler werden eingesammelt und eingeschmolzen; die Offiziere werden entlassen, auf Halbsold gesetzt oder auf Listen geschrieben, die man später „Proskriptionen" nennen wird. Manche gehen nach Amerika.',
    'Der Mann, für den das alles geschehen ist, wird auf ein Schiff gebracht und auf eine Insel im Südatlantik gefahren, die achttausend Kilometer von hier entfernt ist. Er wird dort sechs Jahre leben und ein Buch diktieren, in dem alles ein bisschen anders steht.',
    'Und du bist noch da.'
  ]}
];

/* Anmeldung: an das laufende Band anhängen und beim Verlauf eintragen.
   `.slice()` ist Pflicht, nicht Kosmetik — siehe die Warnung in Kapitel 1. */
KAPITEL.push(...KAPITEL11);
STATIONEN.hunderttage = KAPITEL11.slice();
(KAMPAGNEN.find(k=>k.id==='hunderttage')||{}).gebaut = true;
