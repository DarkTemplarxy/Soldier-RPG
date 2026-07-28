'use strict';
/* Kapitel 3 — Garnison 1801–04. Reine Daten, wie Kapitel 1 und 2.

   ══════════════════ Der Charakter dieses Kapitels ══════════════════

   **Im Krieg ist der Feind die Kugel. Im Frieden ist der Feind die Zeit.**

   Das ist der ganze Entwurf in einem Satz. Die Maschine bleibt dieselbe —
   Stationen, Proben, Saisons, am Ende sogar ein Gefecht —, aber der Einsatz ist
   nicht mehr Blut, sondern Zukunft: Bildung, Geld, Beziehungen, Stand. Und über
   allem steht eine Uhr, die jeder sieht: Der Krieg kommt zurück, und was du bis
   dahin nicht gelernt hast, hast du nicht.

   Vier Dinge halten das Kapitel davon ab, eine Verwaltung zu werden:

   1. **Knappheit statt Fülle.** Vier Saisons, nicht sechzehn Abende — und in
      jeder mehr zu tun als Wochen. Dieselbe Regel wie im Lager (CLAUDE.md),
      nur auf Jahresmaßstab.
   2. **Der Tod bleibt möglich, aber man muss ihn einladen.** Das Duell hinter
      der Reitbahn ist die einzige Kette des Kapitels und die einzige Stelle,
      an der eine Szene töten darf. Ein Permadeath-Spiel, das vier Jahre lang
      niemanden töten kann, ist vier Jahre lang ein Menü.
   3. **Das große Manöver** benutzt das volle Kampfsystem mit Platzpatronen —
      dasselbe Spiel, andere Währung. Es ist die Lektion des Kapitels als
      Bildschirm.
   4. **Die Decke hat ein Gesicht.** Über dem Sergenten sitzt Martel, und der
      geht nicht weg. Wer weiterwill, braucht eine Vakanz — und die entsteht im
      Frieden nicht. Das Spiel sagt das nie laut.

   ══════════════════ Historische Fixpunkte (Invariante 8) ══════════════════

   Kapitulation von Alexandria 2. September 1801 · Rückkehr über Marseille im
   Herbst 1801 · Friede von Amiens 25. März 1802 · Ehrenlegion gestiftet
   19. Mai 1802 · Umbenennung der Halbbrigaden in Regimenter September 1803 ·
   Bruch von Amiens Mai 1803 · Lager von Boulogne ab Sommer 1803 · erste große
   Verleihung der Ehrenlegion im Lager von Boulogne 16. August 1804 · Krönung
   2. Dezember 1804. Dazwischen ist alles frei erfunden.

   Feindgüte 0 (KAMPAGNEN) — es gibt keinen Feind. */

const KAPITEL3 = [

/* 34 */ {typ:'szene',id:'heimkehr',datum:'Oktober 1801 · Marseille',ort:'Die Landung',
  marsch:{von:'Alexandria',nach:'Marseille',weg:'2 400 km auf englischen Schiffen · sechs Wochen, als Gäste derer, die gewonnen haben'},
  text:[
    'Die Engländer bringen euch nach Hause, wie es abgemacht war. Sie sind höflich, sie sind sauber, und sie geben euch Zwieback, der besser ist als alles, was ihr seit Toulon gegessen habt. Das ist schwerer zu ertragen als eine Niederlage.',
    'Am 20. Oktober läuft das Schiff in Marseille ein. Auf dem Kai steht niemand. Es gab keine Nachricht, dass ihr kommt, und in Frankreich hat man euch drei Jahre lang für verschollen gehalten — eine Armee, die irgendwo in Afrika verschwunden ist und über die man in der Zeitung nichts Genaues las.',
    'Ihr geht von Bord, dreihundert Mann von den achthundert, die eingeschifft wurden. Die Uniformen sind aus Ägypten, das heißt: aus Fetzen. Ein Zollbeamter fragt, ob ihr etwas zu verzollen habt.'
  ],
  optionen:[
    {label:'Der Erste sein, der französischen Boden anfasst',hint:'Es ist eine Geste, und alle sehen sie',
     erfolg:{text:'Du gehst über die Planke, knietest dich hin und legst die Hand auf den nassen Stein des Kais. Es ist albern, es ist die Sorte Geste, über die man später lacht, und in diesem Augenblick lacht keiner. Hinter dir tun es vier andere.',
       kameradschaft:8,belastung:-6}},
    {label:'Nach Briefen fragen',hint:'Drei Jahre lang kam keiner an',
     probe:{wert:'bildung',schw:20},
     erfolg:{text:'Im Hafenamt liegen zwei Säcke Post für die Armee des Orients, seit über einem Jahr. Du findest nichts mit deinem Namen. Ein Schreiber sagt, das heiße gar nichts, die Hälfte sei nie angekommen. Du glaubst ihm die Hälfte.',
       belastung:4},
     misserfolg:{text:'Du stehst vor zwei Postsäcken und den Namen darauf, und die Namen sind Zeichen. Ein Korporal liest dir zwanzig davon vor, bevor ihm die Geduld ausgeht. Deiner ist nicht dabei gewesen — sagt er.',
       belastung:6}},
    {label:'Sofort nach dem Sold fragen',hint:'Drei Jahre Rückstand',
     probe:{wert:'verwaltung',schw:35},
     erfolg:{text:'Du findest den Zahlmeister, bevor die anderen wissen, dass es einen gibt, und legst ihm vor, was dir zusteht. Er zahlt nicht alles. Er zahlt mehr, als die zahlen, die morgen fragen.',geld:22},
     misserfolg:{text:'Der Zahlmeister sagt, die Listen der Armee des Orients seien in Kairo. Kairo, sagst du, ist englisch. Er sagt, das sei nicht sein Problem, und hat damit recht.',belastung:4,geld:4}},
    {label:'Nichts tun und sich umsehen',hint:'Europa',
     erfolg:{text:'Häuser aus Stein mit Dächern aus Ziegeln. Frauen in Schuhen. Ein Baum, dessen Blätter ohne Bewässerung grün sind. Du stehst zehn Minuten da und siehst zu, wie es regnet, und es ist der erste Regen seit dreiundvierzig Monaten.',
       belastung:-8,atem:4}}
  ]},

/* 35 */ {typ:'szene',id:'lazarett',datum:'November 1801 · Marseille',ort:'Quarantäne im Lazarett',
  text:[
    'Niemand aus Ägypten kommt ohne Quarantäne ins Land. Sechs Wochen hinter einer Mauer am Hafen, weil man in Marseille die Pest von 1720 nicht vergessen hat und nicht vergessen will.',
    'Es ist das erste Mal seit drei Jahren, dass jemand euch untersucht. Ein Arzt aus der Stadt, kein Feldscher — er hat saubere Hände, Instrumente in einem Kasten und eine Handschrift, die man lesen kann. Er notiert, was er findet, und findet bei jedem etwas.',
    'Die Augenkrankheit, sagt er, geht meistens weg. Die Ruhr auch, wenn man liegt und trinkt und nicht arbeitet. Was nicht weggeht, sagt er nicht, aber man sieht es ihm an, bei wem er es denkt.'
  ],
  optionen:[
    {label:'Sechs Wochen liegen bleiben und tun, was er sagt',hint:'Was aus Ägypten mitkam, bleibt in Marseille',
     erfolg:{text:'Du liegst sechs Wochen auf einer Pritsche und tust nichts, und es ist die vernünftigste Sache, die du in diesem Jahr tust. Was du aus Ägypten mitgebracht hast, geht in Marseille von dir ab — langsam, ohne dass ein Tag der Tag wäre, an dem es aufhört.',
       heilt:'krank',leben:25,belastung:-10}},
    {label:'Dem Arzt zur Hand gehen',hint:'Feldchirurgie · er nimmt jeden, der stillhalten kann',
     probe:{wert:'feldchirurgie',schw:30},
     erfolg:{text:'Er lässt dich halten, waschen und aufschreiben, was er diktiert — die letzten beiden Wochen sogar nähen, an einem Mann, dem es gleich war. Was du bei Guérin und am Sinai gelernt hast, hat zum ersten Mal einen Namen: Er nennt es Erfahrung und sagt es ohne Spott.',
       heilt:'krank',fert:{feldchirurgie:8},attr:{bildung:3},leben:12},
     misserfolg:{text:'Du hältst zweimal nicht still genug, und beim dritten Mal schickt er dich zurück auf die Pritsche. Immerhin liegst du dann. Das ist es, was hilft.',
       heilt:'krank',leben:15}},
    {label:'Über die Mauer und in die Stadt',hint:'Sechs Wochen sind lang',risk:true,
     probe:{wert:'geschick',schw:45},
     erfolg:{text:'Zweimal in sechs Wochen, nachts, über die Mauer am Westende, wo der Wachposten schläft, weil dort seit hundert Jahren nichts passiert. Wein, eine Wirtsstube, Menschen, die nicht deine Uniform tragen. Es ist jedes Mal die Sache wert und heilt nichts.',
       kameradschaft:6,belastung:-8,geld:-6},
     misserfolg:{text:'Beim zweiten Mal steht der Posten doch da. Er meldet es nicht — er nimmt dir das Geld ab und lässt dich zurückklettern. Die sechs Wochen werden dadurch nicht kürzer, und die Ruhr geht davon auch nicht weg.',
       geld:-12,belastung:6}}
  ]},

/* 36 */ {typ:'szene',id:'einzug',datum:'Dezember 1801 · Nîmes',ort:'Einzug in die Garnison',
  marsch:{von:'Marseille',nach:'Nîmes',weg:'120 km westwärts durch die Rhône-Ebene · fünf Tage, zum ersten Mal auf einer gepflasterten Straße'},
  text:[
    'Nîmes ist eine Stadt aus gelbem Stein mit einem römischen Amphitheater mitten drin, in dem Leute wohnen. Die Halbbrigade bekommt eine Kaserne am nördlichen Tor, zwei Stockwerke, echte Betten, ein Hof zum Exerzieren.',
    'Es ist Textilland hier: Seide, Wolle, Färbereien am Fluss, und ein Bürgertum, das Soldaten für eine Naturgewalt hält — nicht böse, aber besser abgedeckt.',
    'Der Capitaine verliest, was jetzt gilt. Wachdienst, Exerzieren, Kirchgang freiwillig. Und ein Satz, den keiner erwartet hat: Es ist kein Feldzug in Aussicht. Für die nächsten Jahre nicht.',
    'Draußen auf dem Hof braucht einer eine Weile, bis er begreift, was das heißt, und sagt dann laut, was alle denken: Und was machen wir jetzt?'
  ],
  optionen:[
    {label:'Dich beim Waffenmeister melden',hint:'Wer nichts zu tun hat, sucht sich etwas',
     erfolg:{text:'Der Waffenmeister ist ein Piemonteser mit einer Narbe vom Ohr zum Kinn und behauptet, er habe unter dem König gedient. Er fragt nicht, welchem. Er fragt, ob du das Bajonett schon einmal gegen einen benutzt hast, der auch eins hatte, und nickt zu deiner Antwort.',
       fert:{bajonett:5},kameradschaft:4}},
    {label:'Dich in der Stadt umsehen',hint:'Vier Jahre werden hier stattfinden',
     probe:{wert:'menschenkenntnis',schw:30},
     erfolg:{text:'Du gehst zwei Tage lang durch Nîmes und lernst, wo die Wirtsstuben billig sind, welche Färberei Tagelöhner nimmt, und dass die Leute hier über die Armee reden, als wäre sie das Wetter. Wer eine Stadt kennt, hat vier Jahre lang einen Vorteil.',
       fert:{fouragieren:5},attr:{menschenkenntnis:3},geld:5},
     misserfolg:{text:'Du läufst zwei Tage durch enge Gassen, die alle gleich aussehen, und kommst zweimal wieder beim Amphitheater heraus. In einer Wirtsstube zahlst du das Doppelte, weil man dir ansieht, dass du neu bist.',
       geld:-5}},
    {label:'Nach der Schule des Regiments fragen',hint:'Es gibt eine · Bildung',
     erfolg:{text:'Es gibt eine, sagt der Fourier und sieht dabei nicht auf. Ein invalider Sergent unterrichtet im Stall hinter dem Magazin, dienstags und freitags, für den, der will. Es wollen selten mehr als zwölf. Du merkst dir den Weg.',
       attr:{bildung:2},gunst:1,gunstVon:'collot'}},
    {label:'Schlafen',hint:'Zum ersten Mal seit 1798 in einem Bett',
     erfolg:{text:'Ein Strohsack in einem Raum mit einem Dach, das dicht ist, und einem Ofen, den jemand anders heizt. Du schläfst vierzehn Stunden und wachst auf, weil es still ist.',
       belastung:-12,atem:10,leben:15}}
  ]},

/* 37 */ {typ:'winter',id:'saison_nimes1',datum:'Januar–März 1802 · Nîmes',ort:'Erste Garnisonssaison',
  wochen:4,
  frage:'Womit verbringst du diese Monate?',
  weiter:'Das Frühjahr kommt',
  atemText:'Ein Winter in der Kaserne, mit Sold, Ofen und zweimal Essen am Tag.',
  tun:['schule','fechtboden','verdienst','wirtshaus','marketender','ausr','ruhe'],
  rangTun:{4:['magazin'],5:['ausbilden','schreiber','strafdienst']},
  text:[
    'Der erste Winter in Nîmes ist der längste deines Lebens, und das liegt daran, dass nichts passiert. Um sechs Uhr Wecken, Exerzieren bis zehn, Wachdienst nach Liste, um acht Zapfenstreich. Dazwischen liegt der Tag wie ein Feld ohne Weg.',
    'Vier Jahre klingen nach viel. Sie sind es auch — aber sie gehen weg, ohne dass man ihnen dabei zusieht, und am Ende steht die Frage, was in dieser Zeit aus dir geworden ist. Der Krieg wird das prüfen, und er wird nicht ankündigen, wann.',
    'Was du jetzt lernst, kannst du. Was du jetzt nicht lernst, wirst du in fünf Jahren brauchen und nicht haben.'
  ]},

/* 38 */ {typ:'szene',id:'amiens',zwischenfall:true,datum:'April 1802 · Nîmes',ort:'Der Friede von Amiens',
  text:[
    'Am 25. März wird in Amiens Friede mit England geschlossen. Zehn Tage später steht es in der Zeitung, die im Wachlokal herumgeht, und wer lesen kann, liest sie den anderen vor.',
    'Frieden mit allen. Zum ersten Mal seit zehn Jahren. In der Stadt läuten sie die Glocken, und abends brennen auf dem Platz vor dem Amphitheater Fässer mit Pech.',
    'Am nächsten Morgen wird ein zweiter Befehl verlesen: Die Armee wird verkleinert. Wer über vierzig ist, wer nicht mehr voll dienstfähig ist, wer es beantragt, geht nach Hause. Halbsold, ein Abschiedspapier, und ein Platz auf einem Karren nach Norden.',
    'Vier aus deiner Kompanie stehen auf der Liste. Einer davon ist Bertrand, der bei Embabeh im Karree neben dir stand und seitdem nicht mehr richtig hört.'
  ],
  optionen:[
    {label:'Bertrand zum Tor bringen',hint:'Es sieht ihm sonst keiner nach',
     erfolg:{text:'Du trägst seinen Sack bis zum Nordtor, wo die Karren stehen. Er redet die ganze Zeit zu laut, weil er sich selbst nicht hört, und erzählt, was er zu Hause machen wird — sein Bruder hat eine Werkstatt, es gibt Arbeit, es wird schon. Am Tor gibt er dir die Hand und sagt: Pass auf dich auf, wenn es wieder losgeht. Wenn, sagst du. Er hört das Wort nicht.',
       kameradschaft:10,belastung:6}},
    {label:'Fragen, ob du selbst gehen kannst',hint:'Der Frieden könnte halten',risk:true,
     probe:{wert:'menschenkenntnis',schw:50},
     erfolg:{text:'Du fragst den Fourier, halb im Scherz, was ein Antrag kosten würde. Er sieht dich an, ohne zu lachen, und sagt: Was willst du draußen? Du kannst nichts, was man draußen bezahlt. Bleib, lern etwas, und wenn du in fünf Jahren immer noch gehen willst, gehst du als jemand. Es ist der beste Rat, den dir hier jemand gibt, und er kostet dich nichts als den Stolz.',
       gunst:2,gunstVon:'collot',attr:{menschenkenntnis:3}},
     misserfolg:{text:'Du fragst zur falschen Stunde und beim falschen Mann. Der Sergent-major hört es, und ab dann bist du der, der bei der ersten Gelegenheit gehen wollte. Es wird nicht gemeldet. Es wird nur nicht vergessen.',
       ruf:-4,gunst:-1}},
    {label:'Auf dem Platz mitfeiern',hint:'Zehn Jahre Krieg sind vorbei',
     erfolg:{text:'Die halbe Stadt ist auf dem Platz, es gibt Wein aus Fässern, und irgendwann tanzt jemand mit jemandem. Es ist der Abend, an dem du zum ersten Mal seit Toulon nicht daran denkst, was morgen ist. Am nächsten Tag hast du Kopfweh und vier Francs weniger.',
       belastung:-10,kameradschaft:6,geld:-4}},
    {label:'In den Stall zur Schule gehen',hint:'Es sind heute noch weniger da als sonst',
     erfolg:{text:'Der Stall ist fast leer, weil alle auf dem Platz sind. Der invalide Sergent ist trotzdem da und sagt, das treffe sich gut, dann komme man mal weiter. Zwei Stunden für dich allein. Am Ende schreibst du deinen Namen dreimal hintereinander gleich.',
       attr:{bildung:5},gunst:1,gunstVon:'collot'}}
  ]},

/* 39 */ {typ:'szene',id:'begegnung',zwischenfall:true,datum:'Juni 1802 · Nîmes',ort:'Die Färberei am Fluss',
  text:[
    'Sie heißt Marguerite Aubanel, ist die Tochter eines Färbers am Vistre und zählt Ballen, während du im Hof stehst und auf den Feldwebel wartest, der Tuch für die Kompanie holen soll.',
    'Sie sieht auf, sieht die Uniform, sieht wieder weg, zählt weiter. Beim dritten Mal, dass du dort stehst, fragt sie, ob es in Ägypten wirklich keinen Regen gibt. Beim fünften Mal fragt sie nach deinem Namen.',
    'Es ist nichts dabei. Es ist eine Stadt, in der man vier Jahre bleibt, und in solchen Städten passiert so etwas ständig. Man kann es lassen. Die meisten lassen es.'
  ],
  optionen:[
    {label:'Wiederkommen',hint:'Es kostet Abende und ist nicht umsonst',
     erfolg:{text:'Du findest Gründe, in die Färberei zu gehen, und die Gründe werden mit der Zeit dünner. Ihr Vater sieht es und sagt nichts, was in dieser Stadt heißt: noch nicht nein. Im Herbst gehst du an einem Sonntag mit ihr am Fluss entlang, vor Zeugen, und danach weiß es die halbe Straße.',
       setzt:{umworben:true},belastung:-8,geld:-10}},
    {label:'Höflich sein und es dabei belassen',hint:'Ein Soldat zieht weiter',
     erfolg:{text:'Du grüßt, wenn du sie siehst, und sie grüßt zurück, und mehr wird es nicht. Es ist die vernünftige Entscheidung. In zwei Jahren, im Lager von Boulogne, wirst du an einem Abend daran denken und nicht mehr genau wissen, warum du sie getroffen hast.',
       belastung:2}},
    {label:'Sie fragen, ob sie dir schreiben beibringt',hint:'Bildung · sie führt die Bücher ihres Vaters',
     probe:{wert:'menschenkenntnis',schw:35},
     erfolg:{text:'Sie lacht, sagt zuerst nein und fängt dann doch an — sonntags, in der Kontorstube, mit den Rechnungsbüchern ihres Vaters als Vorlage. Sie ist ungeduldiger als der Sergent im Stall und erklärt besser. Nach drei Monaten liest du eine Rechnung, ohne mit dem Finger mitzugehen.',
       setzt:{umworben:true},attr:{bildung:8},fert:{verwaltung:5}},
     misserfolg:{text:'Sie sagt, sie habe die Bücher ihres Vaters zu führen und keine Zeit, einem Soldaten Buchstaben beizubringen. Es ist freundlich gesagt und trotzdem ein Nein. Immerhin weiß sie jetzt, dass du es willst.',
       attr:{bildung:2}}}
  ]},

/* 40 */ {typ:'winter',id:'saison_nimes2',datum:'Juli 1802 – Februar 1803 · Nîmes',ort:'Zweite Garnisonssaison',
  wochen:4,
  frage:'Womit verbringst du diese Monate?',
  weiter:'Der Winter geht',
  atemText:'Ein zweites Jahr in Stein und Ordnung.',
  tun:['schule','fechtboden','verdienst','wirtshaus','marketender','drill','ruhe'],
  rangTun:{4:['magazin'],5:['ausbilden','schreiber','strafdienst']},
  text:[
    'Der Sommer 1802 ist heiß und ereignislos. Im August lässt sich der Erste Konsul auf Lebenszeit wählen, im Mai hat er einen Orden gestiftet, den es noch nicht gibt und über den in der Kaserne schon gestritten wird: ein Orden für Verdienst, nicht für Geburt, und angeblich mit Geld dabei.',
    'Im September wird verlesen, dass aus den Halbbrigaden wieder Regimenter werden sollen — dieselben Männer, dieselben Fahnen, ein anderes Wort. Ein alter Sergent sagt, so habe es vor der Revolution auch geheißen, und wird dafür schief angesehen.',
    'Es ist das zweite Jahr. Wer im ersten nichts angefangen hat, hat jetzt noch zwei.'
  ]},

/* 41 */ {typ:'szene',id:'desertion',zwischenfall:true,datum:'März 1803 · Nîmes',ort:'Der Fall Rouvier',
  text:[
    'Rouvier ist neunzehn, aus einem Dorf bei Alès, seit vierzehn Monaten dabei und seit vier Tagen weg. Er hat keine Waffe mitgenommen, was ihm später hilft, und keinen Urlaubsschein, was ihm nicht hilft.',
    'Die Gendarmerie bringt ihn am Freitag zurück. Sie haben ihn nicht in Alès gefunden, sondern zwölf Meilen weiter, wo eine Erntearbeit war, und er hat nicht einmal versucht wegzulaufen, als sie kamen.',
    'Das Kriegsgericht tagt im Amphitheater, weil es der einzige Raum ist, in den das Bataillon passt. Er bekommt zwei Jahre Kette. Für Desertion in Friedenszeiten ohne Waffe ist das milde, und alle wissen es.',
    'Verlesen wird das Urteil vor der aufmarschierten Truppe, und die Truppe steht dabei still. Du auch.'
  ],
  optionen:[
    {label:'Ihm vorher etwas zu essen bringen',hint:'Er sitzt seit Freitag im Loch',risk:true,
     probe:{wert:'menschenkenntnis',schw:40},
     erfolg:{text:'Der Posten vor dem Arrestlokal ist einer aus deiner Kompanie, und er sieht weg, so lange es dauert. Rouvier isst nichts, redet aber. Er sagt, er habe nur nachsehen wollen, ob sein Vater noch lebt, und sei dann eingeschlafen und habe verschlafen, und dann sei es zu spät gewesen. Du glaubst ihm. Das ändert am Urteil nichts.',
       kameradschaft:10,belastung:6},
     misserfolg:{text:'Der Posten ist keiner aus deiner Kompanie. Er meldet es nicht, aber er lässt dich auch nicht durch, und er sieht dich dabei an wie einen, der etwas vorhat. Du gehst mit dem Brot zurück.',
       belastung:4}},
    {label:'Im Spalier stehen und das Urteil hören',hint:'Es steht so im Reglement',
     erfolg:{text:'Zwölfhundert Mann in drei Gliedern in einem römischen Theater, und in der Mitte ein Neunzehnjähriger, dem der Auditeur zwei Jahre Kette vorliest. Es dauert vier Minuten. Danach ist Ausbildungsdienst wie immer.',
       belastung:4}},
    {label:'Beim Lieutenant ein Wort für ihn einlegen',hint:'Kaltblütigkeit · es wird nichts nützen',risk:true,
     probe:{wert:'kaltbluetigkeit',schw:45},
     erfolg:{text:'Du gehst zu Berthaud, ehe das Gericht tagt, und sagst deinen Satz — kurz, ohne zu betteln, ohne das Urteil in Frage zu stellen: dass der Junge in Ägypten nicht dabei war und nicht weiß, was hier eine Fahnenflucht wiegt. Berthaud hört zu, sagt: Zur Kenntnis genommen, und schickt dich weg. Am Urteil ändert sich nichts. An dem, was er von dir hält, schon.',
       gunst:2,gunstVon:'berthaud',ruf:2},
     misserfolg:{text:'Du kommst zur Unzeit und sagst drei Sätze zu viel. Berthaud lässt dich ausreden und erklärt dir dann, ruhig und der Reihe nach, warum ein Unteroffizier, der so redet, seinen Leuten schadet. Du hast auf jeden Satz eine Antwort und sagst keine davon.',
       gunst:-1,gunstVon:'berthaud',belastung:6}}
  ]},

/* 42 */ {typ:'befoerderung',id:'nimes_musterung',datum:'April 1803 · Nîmes',ort:'Musterung im Kasernenhof',
  text:[
    'Einmal im Jahr wird durchgezählt, und im Frieden zählt man gründlicher, weil man Zeit hat. Der Capitaine sitzt an einem Tisch im Hof, neben ihm der Fourier mit den Büchern, und es geht Mann für Mann.',
    'Es gibt keine Lücken zu füllen, wie es sie in Verona und in Kairo gab. Hier wird niemandes Stelle frei, weil niemand gefallen ist. Was hier zählt, ist, was in den Büchern steht: wer lesen kann, wer rechnen kann, wer im Magazin nichts hat verschwinden lassen.',
    'Es ist die Sorte Beförderung, die man sich in einer Stube verdient und nicht auf einem Damm.'
  ]},

/* 43 */ {typ:'szene',id:'streit',zwischenfall:true,datum:'Juli 1803 · Nîmes',ort:'Das 79. rückt ein',
  text:[
    'Im Sommer legt man ein zweites Regiment nach Nîmes, das 79., frisch aus der Vendée und stolz darauf, nie in Ägypten gewesen zu sein. Zwei Regimenter, eine Stadt, vier Wirtsstuben — das geht selten lange gut.',
    'Ihr Sergent heißt Chabert, ist einen Kopf größer als du und hat eine Art, das Wort „Ägypten" auszusprechen, dass es klingt wie eine Krankheit. Beim dritten Mal in derselben Woche fügt er hinzu, man rieche die Armee des Orients, bevor man sie sehe, und in Marseille habe man sie deshalb sechs Wochen hinter eine Mauer gesperrt.',
    'Die halbe Stube hört es. Deine Leute sehen dich an, weil du der bist, den sie ansehen.'
  ],
  optionen:[
    {label:'Es stehen lassen',hint:'Es ist nur ein Sergent aus der Vendée',
     erfolg:{text:'Du trinkst aus, zahlst und gehst. Es ist die Sorte Entscheidung, die niemand lobt und die sich am nächsten Morgen richtig anfühlt. In der Stube redet man noch eine Woche darüber, und dann über etwas anderes.',
       ruf:-3,belastung:4,kameradschaft:-4}},
    {label:'Ihn vor Zeugen berichtigen',hint:'Kaltblütigkeit · ohne die Hand zu heben',
     probe:{wert:'kaltbluetigkeit',schw:40},
     erfolg:{text:'Du stehst auf, gehst zu seinem Tisch und sagst — leise genug, dass er sich vorbeugen muss, laut genug für die zwei Tische daneben —, dass von den achthundert, die in Toulon eingeschifft wurden, dreihundert zurückgekommen sind, und dass er die Namen der anderen fünfhundert gern haben könne, du kennest einige. Dann gehst du zurück und setzt dich. Er sagt in dieser Woche nichts mehr.',
       ruf:4,kameradschaft:8,setzt:{chabert:true}},
     misserfolg:{text:'Du stehst auf und sagst deinen Satz, und er ist einen Satz zu lang. Chabert lacht, und die Stube lacht mit, weil eine Stube immer mit dem lacht, der zuletzt gelacht hat. Du sitzt wieder, und die Sache ist nicht erledigt.',
       ruf:-2,belastung:6,setzt:{chabert:true}}}
  ]},

/* 44 */ {typ:'szene',id:'marschbefehl',datum:'August 1803 · Nîmes',ort:'Nach Norden',
  text:[
    'Der Friede hat vierzehn Monate gehalten. Im Mai erklärt England wieder den Krieg, und diesmal soll es nicht auf dem Festland ausgetragen werden, sondern drüben: An der Kanalküste wird ein Lager gebaut, hunderttausend Mann stark, für eine Landung in England.',
    'Der Marschbefehl kommt im August. Achthundert Kilometer nach Norden, quer durch Frankreich, sechs Wochen.',
    'Am Abend vorher stehst du im Hof und siehst zu, wie die Kompanie packt. Nîmes war zwanzig Monate lang ein Ort mit einem Namen. Ab morgen ist es wieder eine Straße.'
  ],
  optionen:[
    {label:'Um Erlaubnis zur Heirat bitten',hint:'Der Kompaniechef muss sie geben · nur wer geworben hat',
     ab:{min:1,wert:'umworben',sonst:'Es gibt niemanden in dieser Stadt, von dem du dich verabschieden müsstest. Das macht das Packen leichter.'},
     probe:{wert:'menschenkenntnis',schw:40},
     erfolg:{text:'Eine Heirat braucht die Erlaubnis des Kompaniechefs, und Vernet gibt sie ungern, weil ein verheirateter Soldat ein Soldat mit einem zweiten Gedanken ist. Er gibt sie trotzdem — nach vier Fragen, von denen zwei nach Geld sind. Getraut wird an einem Dienstagmorgen, in zwanzig Minuten, mit zwei Kameraden als Zeugen. Ihr Vater kommt nicht. Ihre Mutter schon.',
       setzt:{verheiratet:true},geld:35,belastung:-10,gunst:1,gunstVon:'vernet'},
     misserfolg:{text:'Vernet hört sich die Bitte an und sagt nein, ohne unfreundlich zu sein: nicht vor einem Feldzug, nicht bei einem Mann deines Dienstalters, nicht in dieser Woche. Du hast am Abend eine Stunde, um es ihr zu sagen. Sie nimmt es besser auf als du.',
       belastung:8}},
    {label:'Die Nacht in der Stadt verbringen',hint:'Es ist die letzte',
     erfolg:{text:'Du gehst durch Straßen, die du zwanzig Monate lang gegangen bist, und siehst sie zum ersten Mal an. Am Amphitheater sitzen Leute auf den Stufen, wie sie dort seit siebzehnhundert Jahren sitzen. Um vier Uhr früh ist Antreten.',
       belastung:-6,kameradschaft:4}},
    {label:'Die Ausrüstung für sechs Wochen Marsch herrichten',hint:'Achthundert Kilometer',
     probe:{wert:'geschick',schw:30},
     erfolg:{text:'Schuhe doppelt besohlen lassen, den Tornister neu schnüren, das Schloss der Muskete auseinandernehmen und ölen. Zwanzig Monate Garnison haben aus deiner Ausrüstung ein Kasernenstück gemacht; ab morgen ist es wieder Werkzeug.',
       ausr:{schuhe:35,muskete:25,tornister:20}},
     misserfolg:{text:'Du machst, was du kannst, und was du kannst, ist weniger, als du dachtest. Zwanzig Monate ohne Feldzug — man verlernt es schneller, als man es gelernt hat.',
       ausr:{schuhe:15,muskete:10}}}
  ]},

/* 45 */ {typ:'winter',id:'saison_boulogne1',datum:'Oktober 1803 – März 1804 · Lager von Boulogne',ort:'Baracke im Lager der Küste',
  wochen:4,
  frage:'Womit verbringst du den Winter an der Küste?',
  weiter:'Das Frühjahr an der Küste',
  atemText:'Eine Bretterbaracke mit Ofen, hunderttausend Mann und ein Meer, das man nicht überqueren kann.',
  tun:['schule','fechtboden','wirtshaus','marketender','drill','ausr','ruhe'],
  rangTun:{4:['magazin'],5:['ausbilden','schreiber','strafdienst']},
  text:[
    'Das Lager von Boulogne ist keine Garnison, sondern eine Stadt aus Brettern: Baracken in Reihen bis zum Horizont, Straßen mit Namen, Gärten, in denen Kompanien Kohl ziehen, und über allem der Wind vom Kanal, der niemals aufhört.',
    'Hunderttausend Mann warten darauf, nach England überzusetzen. Zweitausend flache Boote liegen im Hafen. Bei klarem Wetter sieht man die englische Küste — nicht als Gerücht, sondern als graue Linie, dreißig Kilometer weit weg, mit bloßem Auge.',
    'Geübt wird das Einschiffen, immer wieder, hinein in die Boote und wieder heraus, bei jedem Wetter. Zwischendurch wird exerziert wie nie zuvor. Aus einer Armee, die drei Jahre lang nichts getan hat, wird hier in achtzehn Monaten die beste, die Frankreich je hatte — nur weiß das an diesem Winterabend noch niemand.'
  ]},

/* 46 */ {typ:'szene',id:'duell',zwischenfall:true,datum:'April 1804 · Hinter der Reitbahn',ort:'Vier Uhr früh',
  text:[
    'Chabert und das 79. liegen zwei Straßen weiter im selben Lager. Man begegnet sich beim Einschiffungsdrill, in der Kantine, an der Latrine, und es hört seit Nîmes nicht auf. Diesmal geht es nicht mehr um Ägypten, sondern nur noch darum, dass es weitergeht.',
    'Am Ostermontag sagt er einen Satz über deine Kompanie, und es ist gleichgültig, welcher. Zwei seiner Leute sind dabei, zwei von deinen. Ab einem bestimmten Punkt entscheidet nicht mehr, was gesagt wurde, sondern wer dabeistand.',
    'Sein Zeuge findet dich am Abend und nennt Ort und Zeit: hinter der Reitbahn, morgen früh um vier, Säbel. Duelle sind bei Todesstrafe verboten. Sie finden im Lager von Boulogne ungefähr dreimal die Woche statt, und die Offiziere gehen so lange spazieren.',
    'Man kann absagen. Es kostet nichts als das, was es kostet.'
  ],
  optionen:[
    {label:'Absagen lassen',hint:'Der Zeuge wird es weitererzählen',
     erfolg:{text:'Du schickst seinen Zeugen ohne Antwort weg, was Antwort genug ist. Es spricht sich bis zum Mittag herum. Niemand sagt dir etwas ins Gesicht, außer einem aus deiner eigenen Kompanie, und der sagt es nur einmal. In vier Wochen redet keiner mehr davon. Du wirst dich noch in zehn Jahren daran erinnern.',
       ruf:-8,kameradschaft:-10,belastung:10,setzt:{gekniffen:true}}},
    {label:'Um vier Uhr hinter der Reitbahn sein',hint:'Säbel · drei Gänge · es kann tödlich enden',risk:true,
     kette:[
       {name:'Der erste Gang',wert:'kaltbluetigkeit',schw:40,schaden:13,
        gut:'Es ist kalt, es ist noch nicht hell, und deine Hand ist ruhiger, als sie sein dürfte. Drei Jahre Ägypten haben wenigstens das gebracht: Du weißt, wie sich das anfühlt, wenn jemand dich umbringen will, und es ist nicht neu.',
        schlecht:'Er ist schneller, als er aussieht, und beim zweiten Ausfall spürst du den Schnitt am Oberarm, bevor du ihn siehst. Der Zeuge fragt, ob es weitergeht. Es geht weiter.'},
       {name:'Der zweite Gang',wert:'bajonett',schw:45,schaden:15,
        gut:'Der Säbel ist nicht das Bajonett, aber die Beine sind dieselben. Du gehst nicht zurück, sondern zur Seite, wie es dir der Piemonteser in Nîmes gezeigt hat, und triffst ihn oberhalb des Knies. Er flucht auf eine Art, die zeigt, dass es weh tut.',
        schlecht:'Du gehst zurück statt zur Seite, und er kommt nach. Es trifft dich an der Schulter und geht tiefer, als es sollte. Jetzt bluten zwei.'},
       {name:'Der dritte Gang',wert:'geschick',schw:45,schaden:16,
        gut:'Beim dritten Mal ist er zu wütend, um noch zu sehen, was er tut, und du bist nur noch müde. Müde ist besser. Du setzt einmal richtig, quer über die Stirn, und es ist vorbei — Blut in den Augen sieht keiner mehr etwas.',
        schlecht:'Beim dritten Mal seid ihr beide zu langsam und zu wütend, und es wird eine hässliche, ungeschickte Sache, bei der ihr euch gegenseitig trefft, weil keiner mehr deckt.'}],
     tod:'Hinter der Reitbahn, um zwanzig nach vier, im nassen Gras, wegen eines Satzes, an den sich zwei Wochen später niemand mehr genau erinnert.',
     todesart:'Im Duell gefallen, Lager von Boulogne',
     erfolg:{text:'Sein Zeuge bricht ab, als das Blut ihm in die Augen läuft. Ihr gebt euch nicht die Hand — so weit geht die Vorschrift nicht —, aber er nickt, und das Nicken ist mehr wert als der Handschlag. Es spricht sich schneller herum als jede Meldung. Zwei Tage später weiß es das halbe Lager, und niemand hat es offiziell erfahren.',
       ruf:9,kameradschaft:12,belastung:6,leben:-8,fert:{bajonett:6}},
     misserfolg:{text:'Ihr werdet beide weggetragen, und keiner hat gewonnen. Der Feldscher näht, ohne zu fragen, wo es herkommt, weil er es dreimal die Woche macht. Hingegangen bist du trotzdem, und das ist das Einzige, was hängenbleibt.',
       ruf:4,kameradschaft:6,belastung:10,wunde:'Säbelhieb aus dem Duell'}}
  ]},

/* 47 */ {typ:'winter',id:'saison_boulogne2',datum:'Mai – Juli 1804 · Lager von Boulogne',ort:'Der Sommer an der Küste',
  wochen:4,
  frage:'Womit verbringst du den Sommer?',
  weiter:'Es wird August',
  atemText:'Ein Sommer an der Küste, mit Sold, Ordnung und dreimal am Tag Exerzieren.',
  tun:['schule','fechtboden','drill','wirtshaus','marketender','ausr','ruhe'],
  rangTun:{4:['magazin'],5:['ausbilden','schreiber','strafdienst']},
  text:[
    'Im Mai lässt sich der Erste Konsul zum Kaiser der Franzosen ausrufen. Im Lager wird es an einem Nachmittag verlesen, das Bataillon ruft dreimal, was es rufen soll, und danach ist Dienst.',
    'Ein alter Sergent, der 1792 dabei war, sagt am Abend leise, dafür hätten sie damals nicht den König weggeschickt. Zwei widersprechen ihm. Die anderen sagen nichts und denken an den Sold, der seit dem Konsulat pünktlich kommt.',
    'Für August ist eine Verleihung angekündigt. Der neue Orden, der im Mai 1802 gestiftet wurde und den bisher niemand gesehen hat, soll im Lager an die ausgegeben werden, die auf einer Liste stehen. Es heißt, es sei Geld dabei — fünfhundert Francs im Jahr, lebenslang.',
    'In der Kompanie wird gerechnet, wer draufstehen könnte. Es dauert nicht lange.'
  ]},

/* 48 */ {typ:'kampf',id:'manoever',datum:'14. August 1804 · Lager von Boulogne',ort:'Das große Manöver',
  uebung:true,
  marsch:{von:'Baracke der 32.',nach:'Übungsfeld über den Dünen',weg:'6 km · aufgesessen um drei Uhr früh, damit um sechs alles steht'},
  anmarschKosten:{verschleiss:0.05,atem:3,belastung:0},
  anmarsch:[
    'Vierzigtausend Mann auf einem Feld, das dafür planiert wurde. Zwei Parteien, blaue und weiße Armbinden, Platzpatronen, und Schiedsrichter zu Pferd, die entscheiden, wer als gefallen gilt.',
    'Es ist eine Übung. Es ist auch die erste Gelegenheit seit Abukir, dass jemand zusieht, der etwas zu vergeben hat — der Kaiser ist seit gestern im Lager, und mit ihm zwei Marschälle und ein Stab, für den die halbe Nacht Zelte aufgebaut wurden.',
    'Der Capitaine sagt es vor dem Abmarsch, ohne Umschweife: Heute wird nicht gestorben, heute wird gesehen. Wer heute schlecht aussieht, sieht vier Jahre lang schlecht aus.',
    'Neben dir prüft einer zum dritten Mal den Feuerstein, obwohl heute keine Kugel geladen wird.'
  ],
  lage:{gegner:'Das 79. Linienregiment, weiße Armbinden, in Linie über den Dünenkamm',
        auftrag:'Den Kamm nehmen und halten, unter den Augen des Stabes',
        gelaende:'Sand, flache Dünen, kein Deckungsgelände · trocken und heiß',
        stellung:'Zweites Treffen, rechter Flügel'},
  intro:'Es wird mit Platzpatronen geschossen und mit Schiedsrichtern gezählt. Was hier verloren geht, ist kein Blut, sondern vier Jahre Ansehen.',
  runden:6,feindMoral:52,gefahr:6,gelaende:'wueste',
  sieg:{text:'Um halb elf steht die 32. auf dem Kamm, und die Schiedsrichter zählen dem 79. mehr Ausfälle an, als es verkraften kann. Der Stab hat auf dem rechten Flügel zugesehen, weil dort etwas zu sehen war. Am Nachmittag lässt der Capitaine drei Namen aufschreiben.',ruf:6,nennung:true},
  niederlage:{text:'Der Kamm bleibt weiß. Es kostet niemanden das Leben und die 32. einen Nachmittag, an dem der Capitaine wenig sagt und alles zweimal wiederholen lässt. Gesehen worden ist trotzdem etwas — nur nicht das.',ruf:-4,belastung:6}},

/* 49 */ {typ:'befoerderung',id:'boulogne_musterung',datum:'September 1804 · Lager von Boulogne',ort:'Musterung vor dem Feldzug',
  keinZiel:'Über dir sitzt der Sergent-major, und der Sergent-major ist Martel. Er hat den Posten im Sommer 1799 bekommen, als sein Vorgänger vor Akkon liegen blieb, und er ist zweiundvierzig und gesund. Der Capitaine sieht in die Liste, sieht dich an und sagt: Nichts frei. Nächstes Jahr wieder. Es ist kein Vorwurf und kein Trost, es ist eine Zahl in einem Buch. Du weißt, was frei werden müsste, damit es weitergeht, und du denkst es nicht zu Ende.',
  text:[
    'Vor jedem Feldzug wird gemustert, und diesmal riecht es zum ersten Mal seit drei Jahren wieder nach einem. Die Boote im Hafen werden nicht mehr beladen. Die Karten auf dem Tisch des Stabes zeigen nicht mehr England, sondern die Donau.',
    'Der Capitaine sitzt vor der Baracke, neben ihm der Fourier mit den Büchern und Berthaud, der inzwischen Capitaine ist und in einer anderen Kompanie sitzt, aber heute hier. Man geht die Namen durch.',
    'Was in Nîmes gelernt wurde, steht hier in Zahlen. Wer lesen kann, steht anders da als vor drei Jahren. Wer es nicht gelernt hat, auch.'
  ]},

/* 50 */ {typ:'ende',id:'ende_garnison',datum:'2. Dezember 1804 · Paris',ort:'Die Krönung',
  marsch:{von:'Lager von Boulogne',nach:'Paris',weg:'240 km · Abordnungen aller Regimenter, für einen Tag in der Hauptstadt'},
  text:[
    'Von jedem Regiment geht eine Abordnung nach Paris. Am 2. Dezember 1804 wird in Notre-Dame ein Korse zum Kaiser der Franzosen gekrönt, und weil es kalt ist und der Weg lang, stehen die Abordnungen drei Stunden auf dem Platz, bevor etwas passiert.',
    'Sechs Tage später bekommen die Regimenter ihre neuen Fahnen: nicht mehr das Tuch von 1796, sondern ein Adler aus vergoldeter Bronze auf einem Stab, mit der Nummer des Regiments im Sockel. Der Kaiser sagt dazu einen Satz, den die vorderen Reihen hören und die hinteren später erzählt bekommen — dass man diese Adler nie aus den Augen lassen dürfe.',
    'Drei Jahre und zwei Monate Frieden. Du bist nicht besser im Schießen geworden. Was du gelernt hast, steht in Büchern, hängt an deiner Brust oder wohnt in Nîmes.',
    'Im Sommer 1805 wird das Lager von Boulogne abgebrochen, ohne dass ein einziges Boot ausgelaufen wäre. Die Armee, die für England gebaut wurde, marschiert nach Osten — siebenhundert Kilometer in fünf Wochen, gegen Österreich und Russland. Sie heißt jetzt Grande Armée, sie ist die beste, die Frankreich je hatte, und sie hat es im Frieden von Boulogne gelernt.'
  ],
  ausblick:'<b>Hier endet der Prototyp.</b> Am 2. Dezember 1805, auf den Tag ein Jahr nach der Krönung, steht die Grande Armée vor einem Dorf in Mähren, das Austerlitz heißt. Kapitel 4 steht im Konzept, aber noch nicht im Code.'}
];

/* Anmeldung: an das laufende Band anhängen und beim Verlauf eintragen.
   `.slice()` ist Pflicht, nicht Kosmetik — siehe die Warnung in Kapitel 1. */
KAPITEL.push(...KAPITEL3);
STATIONEN.garnison = KAPITEL3.slice();
(KAMPAGNEN.find(k=>k.id==='garnison')||{}).gebaut = true;
