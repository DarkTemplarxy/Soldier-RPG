'use strict';
/* Kapitel 6 — Eylau und Friedland 1807. Reine Daten, wie die Kapitel davor.

   ══════════════════ Die eigene Regel ══════════════════

   **Der Winter schießt mit.**

   Das erste Kapitel, in dem das Wetter ein Gegner mit Werten ist. Jede Station
   unter freiem Himmel trägt `frost:2` — Belastung +4, anderthalbfacher
   Verschleiß, und wer keinen Mantel hat, bekommt eine zehrende Wunde, die zwei
   Lebenspunkte je Station frisst und erst unter einem Dach wieder aufhört. Die
   Stufe *ist* die Zehrung (KAMPAGNEN §2: `zehrt 2`); Russland fährt sie später
   auf 3 und 4.

   **Das ist bewusst kein neues System, sondern die Aufwertung eines alten.**
   Der Beutemantel liegt seit Kapitel 1 im Kaufladen und war der unscheinbarste
   Posten darin; hier wird er zum wichtigsten. Genau wie die Schuhe in der
   Tempowahl von 1806. Die Mechanik selbst steht in `src/mechanik.js`
   (`frostWirken`), weil Russland sie in zwei Stufen wieder braucht.

   **Und Eylau ist die Schlacht, in der niemand etwas sieht.** `sturm:true`
   senkt die Trefferchance beider Seiten und ersetzt den Widerstandswert durch
   eine Schätzung — „vielleicht die Hälfte" statt einer Zahl, ohne Balken. Das
   ist der erste Vorgeschmack auf die Meldungsunsicherheit der Generalsränge,
   zehn Ränge bevor sie zum System wird, und er kommt von außen statt von oben:
   Wer im Schneetreiben steht, hat dasselbe Problem wie ein General mit einer
   Meldung von vor vierzig Minuten.

   ══════════════════ Was dieses Kapitel neu bringt ══════════════════

   1. **Der Frost** (`frost:n`) — Belastung, Verschleiß, und ohne Mantel Blut.
   2. **Der Sturm** (`sturm:true`) — beide Seiten treffen schlechter, und der
      Feind ist nur noch eine Schätzung.
   3. **Der zweite Ordensgrad**: Offizier der Ehrenlegion, Pension 2,0.
   4. **Rang 8 wohnt hier.** Eylau ist die Vakanzmaschine des Kaisers: kein
      Sieg, nur Verluste, und danach sind mehr Stellen frei als Männer da, die
      sie füllen können. Die Leiter erledigt das von allein.

   ══════════════════ Historische Fixpunkte (Invariante 8) ══════════════════

   Eylau 7.–8. Februar 1807, der blutigste Tag des Krieges bis dahin, ohne
   Ergebnis · die Winterquartiere an der Passarge · Danzig kapituliert
   24. Mai · Heilsberg 10. Juni · Friedland 14. Juni · das Floß auf dem Njemen
   bei Tilsit, 7. Juli. Dazwischen ist alles frei erfunden. */

const KAPITEL6 = [

/* 82 */ {typ:'szene',id:'ostpreussen',datum:'Januar 1807 · Ostpreußen',ort:'Der erste Winter',
  frost:2,
  marsch:{von:'Winterlinie an der Weichsel',nach:'Nach Nordosten, gegen Bennigsen',weg:'200 km in vierzehn Tagen · minus fünfzehn Grad, kein Quartier'},
  zwischenfall:true,
  text:[
    'Die Russen sind nicht in die Winterquartiere gegangen. Ende Dezember hat Bennigsen seine Armee in Bewegung gesetzt, quer über die eigenen Nachschublinien, und damit etwas getan, das nach den Regeln dieses Jahrhunderts niemand tut: im Januar Krieg führen.',
    'Also führt ihr im Januar Krieg. Die Kolonne geht über Land, das aus Schnee, Kiefern und alle zwanzig Kilometer einem Dorf aus vier Häusern besteht. In den vier Häusern liegen zweihundert Mann; die übrigen achthundert liegen draußen.',
    'Es sind minus fünfzehn Grad. Wer einen Mantel hat, schläft. Wer keinen hat, sitzt die Nacht am Feuer und dreht sich alle zwanzig Minuten um, und am Morgen fehlt ihm etwas an den Fingern, das nicht wiederkommt.',
    'Der Feldscher sagt, man solle sich nicht am Feuer aufwärmen, wenn man erfroren ist. Niemand hält sich daran, und der Feldscher auch nicht.'
  ],
  optionen:[
    {label:'Ein Quartier organisieren, egal wie',hint:'Autorität · vier Häuser, tausend Mann',
     probe:{wert:'autoritaet',schw:45},
     erfolg:{text:'Du stellst dich vor eine Scheune, bevor ein anderer sie hat, und lässt hinein, wen du hineinlassen willst. Es ist die Art von Sache, für die man kein Recht braucht, sondern nur ein lautes Auftreten und den Willen, es durchzustehen. Es wird nicht wärmer als null Grad. Null Grad sind fünfzehn mehr als draußen.',
       atem:12,belastung:-8,kameradschaft:8},
     misserfolg:{text:'Ein Bataillonsadjutant hat die Scheune schon vergeben, an sein eigenes Bataillon. Ihr liegt auf der Wetterseite eines Zauns, zu dritt unter zwei Mänteln, und keiner schläft.',
       atem:-10,belastung:8}},
    {label:'Aus einem toten Russen einen Mantel machen',hint:'Er braucht ihn nicht mehr, und du schon',risk:true,
     probe:{wert:'fouragieren',schw:40},
     erfolg:{text:'An der Straße liegen seit dem Vortag welche, die keiner eingesammelt hat. Der Mantel ist grau, zu groß und steif gefroren; man muss ihn am Feuer auftauen, bevor er sich falten lässt. Danach ist er ein Mantel. Wer darüber etwas sagen will, sagt es nicht laut.',
       ausruestung:{mantel:{name:'Russischer Mantel, aufgetaut',zustand:60,verschleiss:10}}},
     misserfolg:{text:'Andere waren vor drei Tagen da. Was noch liegt, ist ausgezogen bis auf das Hemd, und das Hemd hilft niemandem.',
       belastung:6}},
    {label:'Gehen und nichts weiter',hint:'Zweihundert Kilometer bei minus fünfzehn',
     erfolg:{text:'Man geht. Es gibt nichts zu holen, nichts zu entscheiden, und nach dem vierten Tag denkt man auch nicht mehr darüber nach, ob es aufhört.',
       belastung:4}}
  ],
  rangText:{7:['Von deinen sechzig Mann haben achtzehn keinen Mantel. Du hast eine Liste, auf der das steht, und ein Formblatt, mit dem man Mäntel anfordert, und das Formblatt geht an ein Magazin, das dreihundert Kilometer hinter euch steht.']}},

/* 83 */ {typ:'szene',id:'vorwerk',datum:'Anfang Februar 1807 · Ein Vorwerk am Weg',ort:'Wer kommt unters Dach',
  frost:2,
  text:[
    'Ein Gutshof mit einem Wohnhaus, zwei Ställen und einer Scheune, achtzig Kilometer vor Eylau. Das Regiment hat ihn für eine Nacht, und in den Ställen ist Platz für zweihundert von achthundert.',
    'Der Verwalter steht in der Tür und redet auf Deutsch. Er sagt, er habe schon dreimal einquartiert und nichts mehr, und beim dritten Mal stimmte es sogar.',
    'Die Entscheidung, wer hineinkommt, fällt in zehn Minuten und ohne Vorschrift. Danach wird sie nicht mehr besprochen, sondern nur noch erinnert.',
    'Draußen fängt es an zu schneien, waagerecht.'
  ],
  optionen:[
    {label:'Deine Leute hineinbringen',hint:'Autorität · gegen fünf andere, die dasselbe wollen',
     probe:{wert:'autoritaet',schw:45},
     erfolg:{text:'Du bist zuerst am Stall und bleibst in der Tür stehen, bis alle deine drin sind. Zwei andere Sergenten stehen daneben und sehen zu. Einer sagt etwas, das du dir merkst; der andere sagt nichts, und das merkst du dir auch.',
       kameradschaft:12,atem:10,belastung:-8,gunst:-1,gunstVon:'martel'},
     misserfolg:{text:'Du bist zu spät und redest zu lange. Deine Leute liegen im Windschatten der Scheune, was besser ist als nichts und schlechter als alles andere.',
       kameradschaft:-6,belastung:8,atem:-6}},
    {label:'Die Kranken hineinbringen, wer immer sie sind',hint:'Menschenkenntnis · nicht deine Leute zuerst',
     probe:{wert:'menschenkenntnis',schw:40},
     erfolg:{text:'Du gehst die Reihen ab und suchst die heraus, die es ohne ein Dach nicht bis Eylau schaffen — aus drei Kompanien, nicht aus deiner. Es sind einundvierzig. Der Capitaine erfährt am nächsten Morgen davon, sagt nichts dazu und merkt es sich.',
       ruf:3,gunst:1,gunstVon:'vernet',belastung:6,atem:-8},
     misserfolg:{text:'Du suchst sie heraus, und während du suchst, sind die Ställe voll. Du hast eine Liste mit einundvierzig Namen und keinen Platz für einen davon.',
       belastung:12,kameradschaft:-4}},
    {label:'Draußen bleiben und ein Feuer bauen',hint:'Es gibt Holz, und es gibt Wind',
     erfolg:{text:'Ein Feuer im Windschatten eines umgestürzten Wagens, sechs Mann drumherum, jeder eine Stunde Wache. Es ist nicht warm. Es ist nur nicht tödlich, und dazwischen liegt in dieser Nacht alles.',
       belastung:-4,kameradschaft:6}}
  ]},

/* 84 */ {typ:'kampf',id:'eylau',datum:'8. Februar 1807 · Preußisch Eylau',ort:'Der Friedhof',
  haerte:1.4, frost:2, sturm:true,
  marsch:{von:'Vorwerk bei Landsberg',nach:'Preußisch Eylau',weg:'25 km durch Neuschnee · angetreten um sechs, angekommen im Dunkeln'},
  anmarschKosten:{verschleiss:0.2,atem:8,belastung:3},
  anmarsch:[
    'Um sieben Uhr früh beginnt es zu schneien, und um acht sieht man dreißig Schritt weit. Es hört den ganzen Tag nicht auf.',
    'Was das für ein Gefecht bedeutet, versteht man erst, wenn man darin steht: Man weiß nicht, wo der Feind ist, und der Feind weiß nicht, wo man selbst ist. Zwei Armeen zu je siebzigtausend Mann verlieren einander auf zweihundert Schritt.',
    'Gegen zehn geht ein ganzes Korps in die falsche Richtung, läuft in vierzig russische Geschütze hinein und ist nach zwanzig Minuten nicht mehr da. Es sind fünftausend Mann. Niemand hat es befohlen, und niemand hat es gesehen.',
    'Auf dem Kirchhof von Eylau stehen die Grabsteine bis zur Brust im Schnee. Der Kirchhof wird an diesem Tag viermal genommen.'
  ],
  lage:{gegner:'Bennigsens Armee, siebzigtausend Mann und vierhundert Geschütze — Stellung unbekannt',
        auftrag:'Den Kirchhof halten, solange es hell ist',
        gelaende:'Schneesturm, Sicht dreißig Schritt · Mauer, Steine, gefrorener Boden',
        stellung:'Erstes Treffen, an der Kirchhofsmauer'},
  intro:'Das hier wird kein gewöhnliches Gefecht. Und es ist das erste, in dem du nicht sehen kannst, wie es steht.',
  runden:9,feindMoral:88,gefahr:13,gelaende:'mauer',
  sieg:{text:'Um sieben Uhr abends hört es auf, weil es dunkel ist. Der Kirchhof gehört euch, die Stadt gehört euch, und das Feld dazwischen gehört fünfundzwanzigtausend Männern, die darauf liegen.\\n\\nIn der Nacht zieht Bennigsen ab. Das macht es zu einem Sieg. Am Morgen reitet der Kaiser über das Feld und sagt nichts, und ein Adjutant schreibt später auf, dass er noch nie jemanden so hat schweigen sehen.',ruf:10,ruhm:true},
  niederlage:{text:'Der Kirchhof wechselt viermal den Besitzer, und beim vierten Mal seid ihr nicht mehr dabei. In der Nacht zieht der Feind ab, was den Tag zu einem Sieg macht, an dem du keinen Anteil hast. Auf dem Feld liegen fünfundzwanzigtausend.',ruf:-3,belastung:14}},

/* 85 */ {typ:'szene',id:'morgen_danach',datum:'9. Februar 1807 · Das Feld bei Eylau',ort:'Der Morgen',
  frost:2,
  text:[
    'Es ist hell geworden, der Schnee hat aufgehört, und man sieht zum ersten Mal seit dreißig Stunden weiter als dreißig Schritt.',
    'Auf einer Fläche von acht Quadratkilometern liegen fünfundzwanzigtausend Männer, die meisten davon dort, wo sie in Linie gestanden haben — man erkennt die Linien noch, weil sie gerade sind. Zwischen ihnen stehen Pferde, die nicht weggehen.',
    'Es ist minus zwölf Grad. Wer verwundet die Nacht draußen verbracht hat, ist nicht mehr verwundet.',
    'Niemand nennt es an diesem Morgen einen Sieg. Später wird es einer, weil der andere zuerst abgezogen ist, aber das ist eine Sache für Bulletins.'
  ],
  optionen:[
    {label:'Hinsehen',hint:'Es kostet nichts. Es geht nur nicht weg',
     erfolg:{text:'Du gehst zweihundert Schritt auf das Feld hinaus und drehst dich einmal um dich selbst, und in jede Richtung ist es dasselbe. Danach gehst du zurück und sagst nichts. Es ist der Anblick, an den sich jeder erinnert, der 1807 dabei war, und keiner von ihnen hat je ein Wort dafür gefunden.',
       belastung:14,attr:{kaltbluetigkeit:4}}},
    {label:'Wegsehen und arbeiten',hint:'Es gibt genug zu tun, und es tut niemand',
     erfolg:{text:'Munition zählen, Waffen sammeln, die eigenen Toten zusammenlegen. Du siehst dabei nur auf das, was du gerade in der Hand hast, und das ist eine Fertigkeit für sich, die man an genau so einem Morgen erwirbt.',
       belastung:4,fert:{verwaltung:5},kameradschaft:6}},
    {label:'Die Verwundeten suchen, die die Nacht überstanden haben',hint:'Feldchirurgie · es sind nicht viele',risk:true,
     probe:{wert:'feldchirurgie',schw:45},
     erfolg:{text:'Von den Verwundeten, die draußen gelegen haben, lebt einer von zehn. Du findest neun, drei davon in fremder Uniform, und trägst sie ins selbe Zelt. Larrey und seine Chirurgen arbeiten seit dreißig Stunden ohne Pause und werden noch zwei Tage arbeiten.',
       ruf:4,kameradschaft:12,fert:{feldchirurgie:8},belastung:10,atem:-12},
     misserfolg:{text:'Du gehst zwei Stunden über das Feld und findest vier, und von den vieren stirbt einer, während du ihn trägst. Danach kannst du die Hände nicht mehr schließen.',
       belastung:16,atem:-14,wunde:'Erfrierungen an beiden Händen'}}
  ],
  rangText:{7:['Die Verlustliste deines Zuges hat achtundzwanzig Zeilen. Das Formblatt hat zwanzig, und man muss auf der Rückseite weiterschreiben.']}},

/* 86 */ {typ:'befoerderung',id:'musterung_eylau',datum:'25. Februar 1807 · Landsberg',ort:'Musterung nach Eylau',
  keinZiel:'Es sind viele Stellen frei. Über dir ist keine dabei — nicht weil dein Name fehlt, sondern weil der Mann, dessen Posten du bekommen müsstest, an diesem Tag Glück gehabt hat.',
  text:[
    'Drei Wochen nach der Schlacht wird gemustert, und es ist die größte Musterung, die diese Armee je erlebt hat. Von den Offizieren des Regiments sind ein Drittel gefallen oder unbrauchbar; von den Unteroffizieren mehr.',
    'Was in normalen Zeiten zwei Jahre dauert, dauert hier drei Wochen. Es werden Patente ausgestellt an Leute, die im Oktober noch Sergenten waren, und in Paris unterschreibt sie jemand, der die Namen zum ersten Mal liest.',
    'Der Capitaine geht die Listen durch und sagt bei jedem dritten Namen einen halben Satz. Bei manchen sagt er nichts, und das ist die schnellere Art.'
  ]},

/* 87 */ {typ:'winter',id:'passarge',datum:'März–April 1807 · Quartier an der Passarge',ort:'Zwei Monate hinter dem Fluss',
  wochen:3,
  tun:['ausr','drill','lesen','leute','ruhe','marketender','verdienst'],
  rangTun:{5:['ausbilden'],7:['fechtboden']},
  frage:'Drei Wochen unter einem Dach. Was tust du damit?',
  text:[
    'Beide Armeen gehen in die Winterquartiere, weil beide nicht mehr können. Ihr liegt hinter der Passarge, sie liegen dahinter, und dazwischen stehen zwei Ketten von Feldwachen, die sich gegenseitig sehen und nicht aufeinander schießen.',
    'Das Regiment liegt in Dörfern mit Öfen. Es ist der erste Ofen seit Dezember, und die ersten drei Nächte schläft niemand richtig, weil es zu warm ist.',
    'Der Nachschub kommt wieder, langsam. Mäntel kommen auch — nicht genug, aber es kommen welche, und wer im Januar keinen hatte, bekommt jetzt einen aus einer Sendung, die für ein Regiment gedacht war, das es nicht mehr gibt.',
    'Danzig wird belagert. Es kapituliert am 24. Mai, und danach fängt der Krieg wieder an.'
  ]},

/* 88 */ {typ:'szene',id:'danzig',datum:'Mai 1807 · Zwischen Passarge und Weichsel',ort:'Der Ritt nach Danzig',
  marsch:{von:'Quartier an der Passarge',nach:'Danzig und zurück',weg:'zweimal 140 km · durch Land, in dem nicht überall Franzosen stehen'},
  zwischenfall:true,
  text:[
    'Danzig hat kapituliert, und mit der Festung fällt das größte Magazin an der Ostsee in französische Hand. Was darin liegt, muss gezählt, aufgeteilt und abgeholt werden, und dafür braucht der Stab jemanden, der reiten und rechnen kann.',
    'Der Weg geht durch Ermland und Pommerellen. Auf der Karte sind es hundertvierzig Kilometer und drei Tage. Auf der Karte steht nicht, dass zwischen den französischen Posten sechzig Kilometer liegen, in denen die Bevölkerung preußisch ist und ihre eigene Meinung dazu hat.',
    'Man reitet allein oder mit zwei Mann. Mehr wären auffällig, weniger wären dumm.',
    'Es ist der erste Auftrag deiner Laufbahn, bei dem niemand danebensteht und sagt, was zu tun ist.'
  ],
  optionen:[
    {label:'Den Auftrag reiten',hint:'Reiten, dann Kartenkunde · zwei Stufen, und der Rückweg zählt',risk:true,
     kette:[
       {name:'Der Hinweg',wert:'reiten',schw:40,schaden:12,
        gut:'Drei Tage im Sattel, zwei Pferdewechsel, eine Nacht in einer Scheune, in der jemand anders geschlafen hat und vor dir weg war. Du kommst an, und du kommst zwei Tage vor dem Termin an.',
        schlecht:'Am zweiten Tag geht das Pferd auf einer vereisten Furt weg, und du liegst zehn Minuten im Wasser, bevor du auf der anderen Seite bist. Danach reitest du nass weiter, weil es keine andere Möglichkeit gibt.'},
       {name:'Der Rückweg',wert:'kartenkunde',schw:45,schaden:14,
        gut:'Zurück nimmst du eine andere Straße, weil man dieselbe nie zweimal nimmt. Sie steht auf der Karte als Weg und ist einer, und am dritten Abend reitest du an der eigenen Feldwache vorbei, die dich zuerst anschreit und dann durchlässt.',
        schlecht:'Die andere Straße ist auf der Karte eine Straße und im Mai ein Sumpf. Du verlierst einen Tag, und am verlorenen Tag begegnest du drei Männern mit Sensen, die keine Bauern sind und dich für einen Kurier halten. Sie haben recht.'}],
     tod:'Auf einer Straße in Pommerellen, die auf keiner brauchbaren Karte steht, von Leuten, deren Namen niemand aufgeschrieben hat.',
     todesart:'Erschlagen auf dem Weg nach Danzig',
     erfolg:{text:'Du legst dem Chef de bataillon eine Aufstellung vor, die stimmt: Mehl, Pökelfleisch, viertausend Paar Schuhe, und daneben, in welcher Reihenfolge es abgeholt werden muss, damit es nicht in Danzig verrottet. Er liest sie zweimal. Beim zweiten Mal fragt er nach deinem Namen.',
       gunst:2,gunstVon:'vernet',ruf:5,nennung:true,fert:{reiten:8,kartenkunde:8,verwaltung:6}},
     misserfolg:{text:'Du kommst an, du kommst zurück, und die Aufstellung, die du mitbringst, ist unvollständig. Es wird nichts dazu gesagt. Beim nächsten Auftrag dieser Art fragt man jemand anderen.',
       fert:{reiten:5,kartenkunde:4},belastung:8}},
    {label:'Den Auftrag abgeben',hint:'Es gibt genug, die reiten können',
     erfolg:{text:'Du sagst, du seist kein Reiter, und das stimmt sogar ungefähr. Ein anderer reitet, kommt nach acht Tagen zurück und wird im Tagesbefehl genannt. Man merkt sich beides — dass er geritten ist, und dass du nicht.',
       gunst:-1,gunstVon:'vernet'}}
  ]},

/* 89 */ {typ:'lager',id:'lager_heilsberg',datum:'Anfang Juni 1807 · Vor Heilsberg',ort:'Das letzte Lager vor dem Sommer',
  abende:2,
  tun:['exerzieren','bajonett','scharf','instand','schuhe','waffe','ruhe','leute','fouragieren'],
  text:[
    'Es ist Juni geworden, und Ostpreußen im Juni sieht aus wie ein anderes Land: Getreide, Laubwald, Wärme, und die Wege sind trocken. Es ist schwer zu glauben, dass hier vor vier Monaten Männer erfroren sind.',
    'Die Armee ist aufgefüllt worden — Konskribierte aus Frankreich, Bataillone aus Italien, Polen, die freiwillig gekommen sind, weil ihnen jemand etwas versprochen hat. Ein Drittel der Kompanie hat Eylau nicht mitgemacht und weiß nur, was erzählt wird.',
    'Zwei Abende, bevor es weitergeht. Bennigsen steht bei Heilsberg in einer befestigten Stellung, und diesmal will er sie halten.'
  ]},

/* 90 */ {typ:'kampf',id:'heilsberg',datum:'10. Juni 1807 · Heilsberg',ort:'Die Schanzen an der Alle',
  marsch:{von:'Lager bei Guttstadt',nach:'Heilsberg',weg:'30 km an der Alle entlang · ein heißer Tag'},
  anmarschKosten:{verschleiss:0.15,atem:6,belastung:2},
  anmarsch:[
    'Bennigsen hat sich einen Platz ausgesucht und ihn drei Wochen lang befestigt: Schanzen auf beiden Ufern, Geschütze in den Schanzen, dahinter die Armee.',
    'Der Angriff wird trotzdem befohlen, frontal, am späten Nachmittag, gegen eine Stellung, die man umgehen könnte. Es gibt keinen Grund dafür, der einem Fusilier erklärt würde, und es gibt später auch keinen, der einem Historiker erklärt würde.',
    'Ihr geht über offenes Feld auf eine Schanze zu, aus der geschossen wird, und der Weg dahin ist achthundert Schritt lang.',
    'Es ist der einzige Tag dieses Feldzugs, an dem in der Kompanie vor dem Angriff laut gesagt wird, dass das keinen Sinn hat.'
  ],
  lage:{gegner:'Russische Infanterie in Feldschanzen, Geschütze auf beiden Ufern',
        auftrag:'Die Schanze nehmen',
        gelaende:'Offenes Feld, achthundert Schritt, dahinter Erdwerk und Graben',
        stellung:'Erstes Treffen, Mitte'},
  intro:'Man könnte die Stellung umgehen. Man umgeht sie nicht.',
  runden:7,feindMoral:60,gefahr:12,gelaende:'mauer',
  sieg:{text:'Gegen zehn Uhr abends gehört euch das Vorwerk vor der Schanze. Die Schanze selbst gehört euch nicht, und in der Nacht zieht Bennigsen ab, weil ihm die Straße nach Königsberg wichtiger ist als das Erdwerk.\\n\\nEs hat zehntausend Mann gekostet, und man hätte es umgehen können. In der Kompanie sagt das am nächsten Tag jemand laut, vor einem Lieutenant, und der Lieutenant sagt nichts dagegen.',ruf:5},
  niederlage:{text:'Der Angriff bleibt auf halbem Feld liegen, zweihundert Schritt vor dem Graben, und dort bleibt ihr bis es dunkel wird. In der Nacht zieht der Feind ab. Man hätte die Stellung umgehen können; man hat es nicht getan, und man hat auch nicht gefragt, warum.',ruf:-3,belastung:12}},

/* 91 */ {typ:'kampf',id:'friedland',datum:'14. Juni 1807 · Friedland',ort:'Der Fluss im Rücken',
  haerte:1.4,
  marsch:{von:'Eylau-Stellung',nach:'Friedland',weg:'40 km in einer Nacht · angekommen um sechs Uhr früh, gekämpft ab fünf Uhr nachmittags'},
  anmarschKosten:{verschleiss:0.2,atem:8,belastung:2},
  anmarsch:[
    'Bennigsen hat in der Nacht die Alle überschritten, um ein französisches Korps zu schlagen, das allein stand. Bis Mittag ist es nicht mehr allein: Der Kaiser ist mit achtzigtausend Mann eingetroffen, und die russische Armee steht mit dem Rücken an einem Fluss, über den drei Brücken führen.',
    'Es ist der 14. Juni. Vor sieben Jahren war der 14. Juni Marengo, und das sagt an diesem Morgen jeder mindestens einmal.',
    'Der Angriff wird auf fünf Uhr nachmittags festgesetzt, damit alles da ist. Fünf Stunden lang stehen beide Armeen einander gegenüber und tun nichts.',
    'Um fünf Uhr fallen drei Salven aus zwanzig Geschützen als Zeichen, und dann geht die ganze Linie an.'
  ],
  lage:{gegner:'Bennigsens Armee, sechzigtausend Mann, mit dem Rücken zur Alle',
        auftrag:'Auf die Stadt zu und die Brücken nehmen',
        gelaende:'Getreidefelder, ein Mühlbach, dahinter die Stadt und drei Brücken',
        stellung:'Erstes Treffen, linker Flügel'},
  intro:'Das hier wird kein gewöhnliches Gefecht. Sie stehen mit dem Rücken an einem Fluss, und das weiß jeder auf beiden Seiten.',
  /* **Gefahr 11 statt der 13 aus dem Entwurf.** Mit `haerte` (+3) und Güte 8
     landet Friedland bei 22 — auf der Höhe von Akkon, Austerlitz und Jena.
     Die 13 hätte 24 ergeben und damit die Regel gebrochen, die mit Kapitel 5
     aufgestellt wurde: Kein Gefecht geht über 22, wenn nicht das Gefecht
     selbst die Regel seines Kapitels ist. Die Regel dieses Kapitels ist der
     Winter — und Eylau, das sie trägt, kommt durch den Sturm (−4) sogar auf
     20. **Das ist Absicht: Eylau ist nicht das Gefecht, in dem man am
     ehesten getroffen wird, sondern das, in dem man nicht sieht, wie es
     steht.** */
  runden:8,feindMoral:72,gefahr:11,gelaende:'bruecke',
  sieg:{text:'Um acht Uhr abends brennt Friedland, und die Brücken brennen mit. Was auf dieser Seite steht, kommt nicht mehr hinüber; ein Teil versucht die Furt und findet sie nicht.\\n\\nEs ist ein Sieg, wie es ihn seit Austerlitz nicht gegeben hat, und er ist in drei Stunden erledigt. Zwei Wochen später steht auf einem Floß in der Mitte des Njemen ein Zelt, in dem sich zwei Kaiser umarmen.',ruf:12,ruhm:true},
  niederlage:{text:'Euer Flügel kommt bis an den Mühlbach und nicht weiter. Was die Stadt nimmt, sind gegen sieben Uhr die anderen. Der Sieg ist vollständig, und dein Teil daran ist es nicht.',ruf:-4,belastung:12}},

/* 92 */ {typ:'befoerderung',id:'musterung_friedland',datum:'25. Juni 1807 · Bei Tilsit',ort:'Musterung nach Friedland',
  keinZiel:'Der Krieg ist zu Ende, und mit ihm die Vakanzen. Was jetzt frei würde, würde durch Krankheit frei, und darauf wartet man nicht laut.',
  text:[
    'Elf Tage nach Friedland wird gemustert, und es ist die letzte Musterung dieses Krieges: Am 19. Juni ist Waffenstillstand geschlossen worden, und was danach kommt, sind Verhandlungen.',
    'Wer im Februar bei Eylau gestanden hat und im Juni bei Friedland, hat in einem halben Jahr mehr gesehen als mancher in zehn Jahren. Das steht in keiner Liste, und die Leute, die die Listen führen, wissen es trotzdem.',
    'Der Capitaine hat seit Eylau eine andere Stelle und seit Friedland noch eine andere. Er sagt, das gehe jetzt eine Weile so weiter, und man solle sich daran gewöhnen.'
  ]},

/* 93 */ {typ:'szene',id:'tilsit',datum:'7. Juli 1807 · Tilsit',ort:'Das Floß auf dem Njemen',
  text:[
    'In der Mitte des Njemen liegt ein Floß, und auf dem Floß steht ein Zelt mit zwei Türen, damit beide Kaiser gleichzeitig eintreten können und keiner auf den anderen wartet.',
    'Die Armee steht am Ufer und sieht zu. Man sieht zwei Boote, zwei Männer, eine Umarmung, ein Zelt. Was drinnen gesprochen wird, weiß hier niemand; man wird es in vier Wochen aus einem Bulletin erfahren, und in fünf Jahren wird sich herausstellen, dass darin nicht alles stand.',
    'Preußen verliert die Hälfte seines Gebiets. Russland verliert nichts und wird Verbündeter. Was der Zar dafür verspricht, ist die Kontinentalsperre — und die ist der Grund, aus dem diese Armee 1812 nach Moskau marschieren wird.',
    'An diesem Nachmittag denkt niemand daran. Es ist Frieden, es ist Juli, und es geht nach Hause.'
  ],
  optionen:[
    {label:'Zusehen',hint:'Zwei Kaiser, zweihundert Schritt weit weg',
     erfolg:{text:'Du stehst mit dreißigtausend anderen am Ufer und siehst zwei Männer auf ein Floß steigen. Der eine ist siebenunddreißig und hat in elf Monaten zwei Armeen vernichtet; der andere ist neunundzwanzig und hat eben eine verloren. Sie umarmen sich vor aller Augen, und beide wissen genau, warum sie das tun.',
       belastung:-10,fert:{taktik:4},attr:{menschenkenntnis:3}}},
    {label:'Nachrechnen, was das Jahr gekostet hat',hint:'Verwaltung · die Listen sind da, man muss nur addieren',
     probe:{wert:'verwaltung',schw:40},
     erfolg:{text:'Von den Männern, die im Oktober in Bamberg angetreten sind, ist einer von drei nicht mehr dabei. Bei Eylau allein sind es in einem Tag mehr gewesen als in ganz Preußen 1806. Du schreibst die Zahl auf ein Blatt, siehst sie an und legst das Blatt weg.',
       fert:{verwaltung:8},belastung:8}},
    {label:'Trinken, solange es etwas gibt',hint:'Es ist Frieden, und der Sold ist da',
     erfolg:{text:'In Tilsit kostet an diesem Abend alles das Dreifache, und alle zahlen es. Am nächsten Morgen weiß man wenig, und was man weiß, ist nichts, woran man sich lange erinnert.',
       geld:-12,belastung:-16,kameradschaft:8}}
  ]},

/* 94 */ {typ:'uebergang',id:'ende_eylau',datum:'Sommer 1807 · Rückmarsch nach Westen',ort:'Der Friede von Tilsit',
  marsch:{von:'Tilsit',nach:'Garnison in Deutschland',weg:'Ein Jahr Ruhe · das erste seit Boulogne'},
  text:[
    'Der Krieg ist zu Ende, und zwar so gründlich, wie ein Krieg nur zu Ende sein kann: Österreich geschlagen, Preußen halbiert, Russland verbündet. Auf dem Festland gibt es niemanden mehr, gegen den man Krieg führen könnte.',
    'Die Armee marschiert nach Westen und bezieht Garnisonen in Deutschland. Es wird ein Jahr, in dem nichts passiert — Wachdienst, Exerzieren, Sold, und abends ein Wirtshaus, in dem man verstanden wird, wenn man Französisch spricht.',
    'Wer 1807 überlebt hat, hat den blutigsten Tag dieses Krieges hinter sich und weiß es. Bei Eylau sind an einem Tag fünfundzwanzigtausend Männer liegen geblieben, für nichts, das man auf einer Karte zeigen könnte.',
    'Es heißt, im Süden gebe es Schwierigkeiten. Spanien sei verbündet, aber Portugal nicht, und der Kaiser habe ein Korps über die Pyrenäen geschickt. In der Kompanie hält das niemand für eine Nachricht.'
  ]}
];

/* Anmeldung: an das laufende Band anhängen und beim Verlauf eintragen.
   `.slice()` ist Pflicht, nicht Kosmetik — siehe die Warnung in Kapitel 1. */
KAPITEL.push(...KAPITEL6);
STATIONEN.eylau = KAPITEL6.slice();
(KAMPAGNEN.find(k=>k.id==='eylau')||{}).gebaut = true;
