'use strict';
/* Mechanik: Spielzustand, Proben, Fertigkeitswachstum, Verschleiß, Wunden. */

/* ══════════════════ SPIELZUSTAND ══════════════════ */

let META = neueChronik();

/* Der ganze laufende Feldzug in einem Objekt — nur Daten, keine Verweise auf
   Kapiteldaten, keine Funktionen. Genau deshalb lässt er sich speichern.
   S und K sind bloß Kurznamen darauf und werden von binde() neu gesetzt. */
let LAUF = null;
let S = null;      // = LAUF.mann
let K = null;      // = LAUF.kampf

function binde(){ S = LAUF ? LAUF.mann : null; K = LAUF ? LAUF.kampf : null; }
function setzeKampf(k){ if(LAUF) LAUF.kampf = k; K = k; }

function neuerLauf(mann){
  LAUF = {fassung:LAUF_FASSUNG, mann, node:0, kampf:null, szene:null,
          lager:{id:null, abende:0, log:[]}, winter:{ort:null, wochen:3, log:[]},
          begonnen:new Date().toISOString(), zuletzt:null};
  binde();
}

/* Die Station ist abgeschlossen und ihre Wirkung angewandt: Der Spielstand
   zeigt schon auf die nächste, damit ein Beenden auf dem Ergebnisbildschirm
   die Entscheidung nicht rückgängig macht. */
function stationErledigt(){
  if(!LAUF) return;
  LAUF.node++; LAUF.szene = null;
  /* Zwischen zwei Stationen liegen Tage bis Wochen Marsch, und in denen heilt
     der Körper von allein — langsam: fünf Prozent des Vorrats je Station. Wer
     mit einem Drittel aus einem Gefecht kommt, braucht sechs, sieben Stationen,
     bis er wieder dasteht, und genau in dieser Zeit gilt der Atem-Deckel
     unten. Das Lager („Schlafen und liegen bleiben") bleibt die schnelle
     Genesung; das hier ist nur der Lauf der Zeit.
     Erste Fassung war 8 % — damit fraß die Zeit den Blutzoll des Rückzugs
     wieder auf (gemessen: mutig 1 Toter statt 4 bei 40 Läufen).
     **Wer krank ist, erholt sich gar nicht.** Die erste Fassung zog die
     Zehrung ab und heilte danach trotzdem die 5 % — beides sind Summanden, die
     Reihenfolge ändert nichts, und der Kommentar „zehrt vorher, sonst hebt sich
     beides auf" war schlicht falsch gerechnet. Bei Konstitution 70 mit
     Sumpffieber standen +4 Heilung gegen −3 Zehrung: Ein Kranker **gewann**
     einen Punkt je Station, und das ganze System „Krankheit gefährlicher als
     Kugeln" lief leer.

     Auch die Klemme lag falsch — je Wunde einzeln bei 1 gekappt, verschluckte
     sie bei zwei Krankheiten die Hälfte der Summe. Jetzt: eine Summe, eine
     Klemme, und Genesung erst, wenn das Fieber weg ist. */
  /* Der Frost wirkt vor der Zehrung, aber die Wunde, die er gibt, zehrt erst
     ab der nächsten Station: Man erfriert nicht an dem Abend, an dem es
     anfängt. */
  const kalt = frostWirken(KAPITEL[LAUF.node-1]);
  if(kalt) S.log.push(((KAPITEL[LAUF.node-1]||{}).ort||'') + ': ' + kalt);
  aderlass(KAPITEL[LAUF.node-1]);
  /* „Er weiß, welches Wasser." Halbiert wird die Zehrung, nicht abgeschafft —
     und die Sperre der Zeitheilung bleibt bestehen, solange überhaupt etwas
     zehrt. Wer krank ist, erholt sich nicht; er wird nur langsamer weniger.
     Der Frost zählt bewusst mit: Auch ihn übersteht der besser, der weiß, wie
     man im Freien liegt. */
  let zehrung = S.wunden.reduce((sum,w)=> sum + (w.zehrt||0), 0);
  if(zehrung && zaeh('zaeh_wasser')) zehrung = Math.ceil(zehrung/2);
  if(zehrung) S.leben = Math.max(1, S.leben - zehrung);
  else lebenAuffuellen(0.05);
  /* Die Pension läuft, solange der Mann lebt. Historisch war die Ehrenlegion
     genau das — eine Rente, kein Blech —, und seit es einen Marketender gibt,
     ist Geld auch im Spiel etwas wert. Halbe Francs summieren sich langsam;
     über ein Kapitel sind das rund zwanzig. */
  const rente = ordenPension();
  if(rente) S.geld += rente;
  /* **Der Sold wird angeschrieben, nicht ausgezahlt.** Er sammelt sich je
     Station an und kommt erst im Lager oder Winterquartier in die Hand — so
     war es, und so ist es auch das bessere Spiel: Eine Zahl, die bei jeder
     Station um 0,45 steigt, ist Rauschen; sechs Wochen Sold auf einmal sind
     ein Moment. */
  S.soldOffen = (S.soldOffen||0) + soldSatz(S.rang) * soldFaktor();
  /* KONZEPT §10: „Briefe von zu Hause senken Belastung." Genau ein Punkt je
     Station — kein System, ein Beiwerk, wie es dort ausdrücklich heißt. */
  if(S.verheiratet) S.belastung = Math.max(0, S.belastung - 1);
  /* Ab Rang 9 zehrt der Zustand der Kompanie zwischen den Lagern ab, und was
     daraus folgt, steht als Satz im Verlauf — nicht als Warnung vorher. */
  const zustand = (typeof einheitZehren==='function') ? einheitZehren() : '';
  if(zustand) S.log.push(((KAPITEL[LAUF.node-1]||{}).ort||'') + ': ' + zustand);
  atemKlemmen();
  laufSichern();
}

/* ══════════════════ ORDEN ══════════════════ */

/* Wie zuverlässig in dieser Kampagne gezahlt wird. **Das ist der historisch
   interessanteste Teil des Soldes:** Die Italienarmee von 1796 war berüchtigt
   dafür, monatelang nichts zu sehen — barfuß, in Lumpen, siegreich. In Ägypten
   wurde in einer Münze gezahlt, die keiner kannte. In der Garnison kam der
   Sold pünktlich, und das war für viele der eigentliche Unterschied zum Krieg. */
/* Zu welcher Kampagne eine Station gehört. Die Zuordnung lag zweimal
   ausgeschrieben da (Sold, Zwischenfälle); seit es Kampagnenfelder gibt —
   Sold, Aderlass, Verschleiß —, steht sie einmal hier. */
function kampagneVon(n){
  if(!n) return null;
  for(const id in STATIONEN)
    if((STATIONEN[id]||[]).some(x=>x.id===n.id)) return KAMPAGNEN.find(c=>c.id===id) || null;
  return null;
}

function soldFaktor(){
  const k = kampagneVon(KAPITEL[Math.min(LAUF?LAUF.node:0, KAPITEL.length-1)]);
  return k && k.sold !== undefined ? k.sold : 1;
}

/* ══════════════════ DER ADERLASS ══════════════════

   **Manche Kriege töten in den Gefechten. Andere töten dazwischen.**

   Spanien hat Frankreich dreihunderttausend Mann gekostet, und fast keiner
   davon ist in einer Schlacht gefallen: Es waren Posten, die nicht zurückkamen,
   Kuriere, Nachzügler, Fieber, ein Messer im Quartier. Russland hat
   vierhunderttausend gekostet, und das Gefecht war dabei die Ausnahme.

   `aderlass:n` an einer **Kampagne** — nicht an einer Station — zieht an jeder
   Station n Lebenspunkte und ebenso viel vom Zustand der Einheit ab. Es gibt
   keine Probe dagegen und keinen Knopf dafür. **Das ist der Punkt:** Ein
   Aderlass ist keine Entscheidung, sondern die Eigenschaft eines Krieges.

   **Er ersetzt die Zeitheilung nicht, er misst sich mit ihr** — und das ist
   der ganze Trick, aber es ist auch die Stelle, an der die erste Fassung
   danebenlag. Fünf Prozent des Vorrats sind bei neunzig Lebenspunkten
   viereinhalb je Station. Spaniens **4** hebt die Erholung damit fast genau
   auf: Man kommt nie wieder hoch. Russlands **8** liegt darüber, und erst
   dadurch fällt der Vorrat wirklich — was das Kapitel im Kopfkommentar
   verspricht („ein Vorrat, der kleiner wird"), tut es seitdem auch.

   > **Die erste Fassung stand auf 2 und 4 und tat rechnerisch nichts.**
   > Russlands 4 gegen 4,5 Heilung ergab **plus einen halben Punkt je
   > Station** — der Mann wurde nicht weniger, er stand still. Das ist
   > derselbe Fehler wie damals bei der Krankheit („Ein Kranker *gewann*
   > einen Punkt je Station"), nur eine Ebene höher, und er fiel erst auf,
   > als der Härtemodus Spanien und Russland auf dieselbe Zahl legte.
   > **Ein Zehrwert, der kleiner ist als die Heilung, ist kein Zehrwert.** */
/* ── Der Drill zahlt doppelt, wo die Leute nichts können ──

   **Sonst wäre `rekruten` eine Mautstelle statt einer Regel.** Ein Kapitel,
   dessen eigene Schwierigkeit man nicht abarbeiten kann, ist keine
   Entscheidung, sondern ein Abzug — dieselbe Überlegung wie beim Mantel im
   Frost, der von einem toten Russen zu nehmen ist.

   1813 heißt das: Der Exerzierplatz wird zum eigentlichen Spiel. Es ist
   derselbe Drill wie in Savona 1796, nur stehst du auf der anderen Seite,
   und die Gesichter vor dir sind das eigene von damals. */
function guetePlus(n){
  const k = kampagneVon(KAPITEL[LAUF?LAUF.node:0]);
  const faktor = (k && k.rekruten) ? 2 : 1;
  S.sektionGuete = (S.sektionGuete||0) + Math.round(n*faktor);
  return S.sektionGuete;
}

function aderlass(n){
  const k = kampagneVon(n);
  let wert = k && k.aderlass ? k.aderlass : 0;
  if(!wert || !S) return '';
  /* „Er bleibt nicht zurück." Der Aderlass ist keine Wunde und keine Kugel,
     sondern die Summe aus Nachzüglern, Posten, die nicht wiederkommen, und
     Fieber im Quartier. Genau davor schützt Erfahrung — nicht ganz, aber
     merklich. Am Mann wirkt sie; die Einheit zehrt weiter, denn deren
     Zustand hängt nicht daran, was **du** gelernt hast. */
  if(zaeh('zaeh_nachzuegler')) wert = Math.max(0, wert - 3);
  if(wert) S.leben = Math.max(1, S.leben - wert);
  if(S.einheit != null) S.einheit = Math.max(0, S.einheit - (k.aderlass|0));
  return '';
}

/* Die Auszahlung. Gibt den Betrag zurück, damit der Aufrufer ihn anzeigen
   kann — auf zwei Stellen gerundet, weil Sous existierten. */
function soldAuszahlen(){
  const offen = Math.round((S.soldOffen||0) * 100) / 100;
  if(offen <= 0) return 0;
  S.geld += offen;
  S.soldOffen = 0;
  return offen;
}

function ordenPension(){
  if(!S || !S.orden) return 0;
  return S.orden.reduce((sum,id)=>{ const o = ordenVon(id); return sum + (o ? o.pension : 0); }, 0)
    + dotationsErtrag();
}

/* ── Die Dotation (ab Rang 13) ──
   Ein Landgut in Westfalen oder Polen mit jährlichem Ertrag. **Das erste
   Einkommen im Spiel, das nichts mit Sold zu tun hat** — und das erste, das
   einem etwas zu verlieren gibt, das nicht das eigene Leben ist.

   Sie läuft wie eine Pension, weil sie mechanisch eine ist; erzählt wird sie
   anders, und das ist der ganze Unterschied. Napoleon hat seine Generale
   bewusst reich gemacht: Wer ein Gut in Polen hat, will, dass Polen
   französisch bleibt. */
function dotationsErtrag(){
  if(!S || S.rang < 13) return 0;
  if(!S.dotation) S.dotation = 8;      // Francs je Station
  return S.dotation;
}

/* Wer welchen Orden verdient hat — **geprüft, nicht gewürfelt.** Ein Orden ist
   die einzige Belohnung im Spiel, bei der man hinterher genau sagen können
   soll, wofür. Zufall würde das kaputtmachen.

   Rückgabe: der neu verdiente Orden oder null. Der Aufrufer zeigt ihn an;
   verliehen wird in `ordenVerleihen()`, damit die Anzeige nicht doppelt zählt. */
function ordenFaellig(){
  if(!S) return null;
  S.orden = S.orden || [];
  const jahr = jahrVonStation();
  if(!hatOrden('ehrenwaffe') && jahr >= 1799 && jahr <= 1803 && S.nennungen >= 3)
    return ordenVon('ehrenwaffe');
  if(!hatOrden('ehrensaebel') && jahr >= 1799 && jahr <= 1803 &&
     (S.sondermissionen|0) >= 1 && S.nennungen >= 5)
    return ordenVon('ehrensaebel');
  /* Der erste fremde Orden. Er verlangt eine Meldung an den Oberbefehl — also
     die dritte Stufe der Sichtbarkeitsleiter — und dass man den Feldzug von
     1805 überstanden hat. Höchstens zwei fremde Orden werden gewertet
     (KONZEPT §5); der zweite Platz bleibt für später offen. */
  if(!hatOrden('eisenkrone') && jahr >= 1805 && (S.bulletins|0) >= 1)
    return ordenVon('eisenkrone');
  if(!hatOrden('legion') && jahr >= 1804 &&
     (hatOrden('ehrenwaffe') || hatOrden('ehrensaebel') || (S.nennungen >= 5 && S.ruf >= 45)))
    return ordenVon('legion');
  /* ── Der zweite Grad, ab 1807 ──
     **Ein Grad ist keine zweite Auszeichnung, sondern dieselbe eine Stufe
     höher** — deshalb setzt er den ersten voraus und nicht bloß Zahlen. Die
     Ehrenlegion hatte fünf Grade, und der Sprung vom Légionnaire zum Officier
     war historisch an den Rang gebunden: Mannschaften wurden Légionnaire,
     Offiziere wurden Officier. Genau so steht es hier — Rang 7 als Schranke,
     acht Nennungen als Leistung, ab dem Jahr, in dem die Vakanzwelle von
     Eylau die Armee mit neuen Offizieren auffüllt. */
  if(!hatOrden('legion_offizier') && jahr >= 1807 && hatOrden('legion') &&
     S.rang >= 7 && S.nennungen >= 8)
    return ordenVon('legion_offizier');

  /* ── Die Tapferkeitsmedaillen ──
     **Sie hängen an drei Zählern, die seit der Leiter der Sichtbarkeit
     mitlaufen und bisher nichts ausgezahlt haben.** Gold verlangt zusätzlich
     eine voll bestandene Sondermission — dieselbe Bedingung wie der
     Ehrensäbel, und derselbe Gedanke: Die höchste Stufe hängt an einer
     einzelnen, benannten Tat und nicht an einer Summe.

     **Sie stapeln nicht.** Wer die nächste Stufe bekommt, legt die vorige ab
     — im Livret steht nur die höchste. Eine Reihe von drei Scheiben derselben
     Prägung wäre eine Sammlung, und Sammlungen gibt es hier nicht. */
  const tapfer =
    ((S.belobigungen|0) >= 1 && (S.bulletins|0) >= 1 && (S.sondermissionen|0) >= 1) ? 'tapfer_gold'
    : (S.bulletins|0) >= 1 ? 'tapfer_silber'
    : S.nennungen >= 1 ? 'tapfer_bronze' : null;
  if(tapfer && !hatOrden(tapfer)) return ordenVon(tapfer);
  return null;
}

function ordenVerleihen(o){
  if(!o || hatOrden(o.id)) return null;
  /* ── Eine Stufe ersetzt die vorige, und zwar in jeder Währung ──
     **Das Ablegen steht hier und nicht bei der Prüfung**, weil es eine
     Eigenschaft der Auszeichnung ist und keine der Vergabe: Die Scheibe kommt
     an dieselbe Stelle des Rocks, an der die alte hing.

     Der Ruf ist der Teil, der beim ersten Bauen falsch war. Livret und
     Wertung zeigten nur die höchste Stufe, der Ruf zählte aber alle drei
     zusammen — zwölf Punkte für eine Reihe, die höchstens sechs wert ist, und
     das in genau der Währung, an der die ganze Leiter hängt. **Was man
     dazubekommt, ist der Unterschied**: Man wird von Silber auf Gold gehoben,
     nicht ein zweites Mal geehrt. */
  const stufe = TAPFER_REIHE.indexOf(o.id);
  let schon = 0;
  if(stufe >= 0){
    S.orden.forEach(x => {
      const i = TAPFER_REIHE.indexOf(x);
      if(i >= 0 && i < stufe) schon += (ordenVon(x)||{}).ruf || 0;
    });
    S.orden = S.orden.filter(x => { const i = TAPFER_REIHE.indexOf(x); return i < 0 || i > stufe; });
  }
  S.orden.push(o.id);
  S.ruf += Math.max(0, o.ruf - schon);
  S.log.push('Ausgezeichnet: ' + o.name);
  return o;
}

/* Die Jahreszahl der aktuellen Station. Dieselbe Quelle, aus der `kaiserreich()`
   den Adler schaltet — ein Datum, zwei Verbraucher. */
function jahrVonStation(){
  const n = KAPITEL[Math.min(LAUF?LAUF.node:0, KAPITEL.length-1)] || {};
  const m = String(n.datum||'').match(/1[78]\d\d/);
  return m ? +m[0] : 1796;
}

function neuerCharakter(name, herkunftId, attrVerteilung, kaeufe, punkte){
  const h = HERKUENFTE.find(x=>x.id===herkunftId);
  const attr = {}; ATTRIBUTE.forEach(([k])=> attr[k] = attrVerteilung[k]);
  /* Fertigkeiten beginnen bei 5, nicht mehr bei 10 (29.07.2026, zusammen mit
     dem Attributsockel 15). Ein Rekrut hat die Muskete zweimal abgefeuert;
     alles darüber ist etwas, das er sich verdient oder gekauft hat. Nebenbei
     verlängert es die Strecke, auf der Übung noch etwas bringt — `nutzen()`
     gibt bei niedrigen Werten am meisten. */
  const fert = {}; FERTIGKEITEN.forEach(([k])=> fert[k] = FERT_SOCKEL);
  /* Die Herkunft darf über die 70 der Poolverteilung hinausgehen — sie ist das,
     was man mitbringt, nicht das, was man sich aussucht. Das war früher der
     halbe Exploit (Konstitution 90 = unsterblich); die andere Hälfte lag in der
     Tödlichkeitsformel und ist dort behoben worden: Konstitution gibt jetzt
     Lebenspunkte statt Unverwundbarkeit. */
  for(const k in h.attr) attr[k] = Math.max(0, Math.min(100, attr[k] + h.attr[k]));
  for(const k in h.fert) fert[k] = Math.max(0, Math.min(100, fert[k] + h.fert[k]));
  // Mit Veteranenpunkten vorweggenommene Ausbildung, oben auf Herkunft und Pool
  for(const k in (punkte||{})){
    if(attr[k] !== undefined) attr[k] = Math.min(100, attr[k] + punkte[k]);
    else if(fert[k] !== undefined) fert[k] = Math.min(100, fert[k] + punkte[k]);
  }
  /* **Ausrüstung wird bewusst nach den Kaufgrenzen addiert.** Muskete +8 und
     Bajonett +5 dürfen die 60 der Fertigkeitsgrenze überschreiten — sich mit
     Veteranenpunkten über den Startdeckel zu schieben, ist ein gewollter Weg,
     sie auszugeben (Entscheidung vom 28.07.2026). Geklemmt wird nur die
     absolute 100, weil `nutzen()` darüber aussteigt. */
  const ausr = AUSRUESTUNG_START();
  const hoch = (k,n)=>{ fert[k] = Math.min(100, fert[k] + n); };
  let geld = 4;
  (kaeufe||[]).forEach(id=>{
    if(id==='muskete_gut'){ ausr.muskete={name:'Modell 1777 An IX, eingeschossen',zustand:95,verschleiss:12}; hoch('muskete',8); }
    if(id==='bajonett_gut'){ ausr.seitenwaffe={name:'Geschliffenes Bajonett',zustand:95,verschleiss:8}; hoch('bajonett',5); }
    if(id==='schuhe_gut'){ ausr.schuhe={name:'Doppelt besohlte Schuhe',zustand:100,verschleiss:12}; }
    if(id==='tornister_gut'){ ausr.tornister={name:'Verstärkter Tornister',zustand:100,verschleiss:8}; }
    if(id==='mantel_gut'){ ausr.mantel={name:'Beutemantel, gewachst',zustand:90,verschleiss:8}; }
    if(id==='geld'){ geld += 50; }
  });
  const mann = {
    name, herkunft:h.name, herkunftId, attr, fert, ausr, geld,
    rang:1, zweig:null, ruf:0, leute:leuteStart(), kameradschaft:20, belastung:0,
    atem:100, leben:0,
    wunden:[], nennungen:0, belobigungen:0, bulletins:0, sondermissionen:0, orden:[], soldOffen:0, kaeufe:kaeufe||[], gekauft:punkte||{},
    /* Der Offizier: `einheit` bleibt null, bis es eine Kompanie gibt (Rang 9).
       `nahkampfKapitel` merkt, wo die Linie schon einmal gebrochen ist. */
    einheit:null, kasseRisiko:0, kasseQuartal:false, auftraege:0, nahkampfKapitel:[],
    /* Der Stab: der Adler kommt mit dem Regiment (Rang 11), die Dotation mit
       dem Divisionsgeneral (Rang 13). Bis dahin gibt es beides nicht. */
    adler:null, dotation:0,
    /* Das gekaufte Patent, falls eines dabei war. Es steht als eigenes Feld und
       nicht bloß in `kaeufe`, weil vier verschiedene Stellen es fragen: die
       Wertung, die Feindgüte, die Gunst und die Erschaffung selbst. */
    patent:null,
    kapitel:0, lebt:true, ende:null, log:[]
  };
  /* ── Der gekaufte Offizier ──
     **Er rückt 1796 in Savona ein wie jeder andere** — nur trägt er Epauletten,
     hat nie eine Muskete abgefeuert, und niemand in der Kompanie kennt ihn.

     Deshalb steht hier nur der Rang. Was ihm fehlt, steht an drei anderen
     Stellen: `wertung()` zieht ab, `feindGuete()` legt zu, und `gunstGeben()`
     lässt Martel und Collot nichts geben. Er ist mechanisch stärker und
     **sozial nackt** — und das ist der ganze Handel. */
  const pat = (kaeufe||[]).map(patentVon).find(Boolean);
  if(pat){
    mann.patent = pat.id;
    mann.rang = pat.rang;
    /* Ein Offizier bekommt keine Ausgabemuskete — er hat einen Degen, den er
       selbst bezahlt hat, und der ist teurer als alles, was ein Fusilier trägt. */
    mann.ausr.muskete = {name:'Keine Muskete mehr', zustand:0, verschleiss:0};
    mann.ausr.seitenwaffe = {name:'Degen, selbst bezahlt', zustand:95, verschleiss:6};
    mann.geld = Math.max(0, mann.geld - 2);   // das Patent kostete Stempelgebühr
    /* **Der Preis des Patents, vierter Teil: Seine Leute folgen ihm schlechter.**
       Ein Zug tut, was sein Lieutenant sagt, weil er weiß, wer der Lieutenant
       ist. Bei diesem weiß es niemand. `sektionGuete` startet deshalb bei −25
       und wirkt auf alles, was mit der Einheit zusammenhängt: Salven, Verluste,
       die Abrechnung nach dem Gefecht.

       **Das ist der bessere Malus als jede Gefahrzahl**, weil er den Rang an
       der Stelle trifft, an der der Rang stattfindet — bei anderen Leuten —
       und weil er sich abarbeiten lässt: Wer im Lager seinen Zug antreten
       lässt, holt ihn in zwei Kapiteln auf. */
    mann.sektionGuete = -25;
  }
  mann.leben = lebenMax(mann);
  /* **Der Atem-Deckel gilt ab der ersten Sekunde.** `atemKlemmen()` lief bisher
     erst bei der ersten Handlung — bis dahin stand in der Seitenleiste „Atem
     100", obwohl der Deckel bei einem Mann mit Konstitution 70 schon 82 ist.
     Der Wert sprang dann beim ersten Klick nach unten, und das sah aus wie ein
     Fehler, weil es einer war: Ein Mann, dessen Anzeige nicht zu seinen Werten
     passt, ist nicht erst nach der ersten Handlung falsch, sondern vorher. */
  mann.atem = Math.min(mann.atem, mann.leben);
  return mann;
}

/* ══════════════════ DIE KETTE ÜBER DIR ══════════════════ */

/* Gunst ist keine Zahl mehr, sondern eine Beziehung je Person (−5…+5). Wer
   über dir steht, kann dich fördern *oder* blockieren — ein Fourier, den du
   beim Unterschlagen gemeldet hast, sitzt immer noch an den Listen, wenn deine
   Beförderung dort vorbeikommt. */
function person(id){ return (S && S.leute && S.leute[id]) || null; }
function gunst(id){ const p = person(id); return p ? p.gunst : 0; }

function gunstGeben(id, n){
  const p = person(id);
  if(!p || !p.lebt) return;        // einem Toten kann man nicht mehr gefallen
  /* ── Der gekaufte Offizier hat keine Kette über sich ──
     **Martel und Collot geben ihm nichts, und zwar in beide Richtungen.** Sie
     sind der Sergent und der Fourier seiner Kompanie; er ist der Mann mit den
     Epauletten, der gestern noch nicht da war. Man lernt einander in Abenden am
     Feuer kennen, und an diesen Abenden sitzt kein Offizier.

     **Berthaud, Vernet und Grandmaison bleiben erreichbar** — sonst wäre er
     gesperrt statt nackt, und gesperrt ist etwas anderes als allein. Er muss
     sich ihre Fürsprache im Gefecht verdienen wie jeder andere auch, nur ohne
     die zehn Jahre Vorlauf, die ein aufgestiegener Mann mitbringt. */
  if(S.patent && (id==='martel' || id==='collot')) return;
  p.gunst = Math.max(-5, Math.min(5, p.gunst + n));
}

/* Anrede mit Rang: „Sergent Martel", nach seinem Aufstieg „Sergent-major
   Martel". Dieselbe Person, andere Anrede — KONZEPT §3 („Kostet nichts, wirkt
   enorm"), nur in die andere Richtung. */
function personName(id){
  const d = LEUTE.find(l => l.id === id), p = person(id);
  if(!d) return '';
  const kurz = (p && p.kurz) || d.kurz;
  return d.stufen[Math.min((p ? p.stufe : 0), d.stufen.length-1)] + ' ' + kurz;
}
function personKurz(id){ const p = person(id), d = LEUTE.find(l=>l.id===id); return (p && p.kurz) || (d ? d.kurz : ''); }

/* ══════════════════ MECHANIK ══════════════════ */

function wert(k){
  let v = (S.attr[k] !== undefined) ? S.attr[k] : S.fert[k];
  if(k==='kaltbluetigkeit' && S.kaeufe.includes('amulett')) v += 5;
  // Wunden schlagen auf den Körper, nicht auf den Kopf
  const koerperlich = ['konstitution','geschick','muskete','bajonett','reiten'];
  if(koerperlich.includes(k)) S.wunden.forEach(w=>{ v -= w.abzug || 0; });
  else S.wunden.forEach(w=>{ v -= Math.round((w.abzug||0)/3); });
  v -= Math.floor(S.belastung/12);
  if(k==='muskete' && S.ausr.muskete.zustand < 35) v -= 15;
  if(k==='konstitution' && S.ausr.schuhe.zustand < 25) v -= 18;
  return Math.max(1, Math.round(v));
}

/* Woher der Abzug kommt, in Worten. Die Seitenleiste zeigt den **rohen**
   Wert, geprüft wird mit `wert()` — wer eine schwere Wunde und kaputte Schuhe
   hat, geht mit Konstitution 52 in eine Probe, während in der Leiste 70 steht.
   Diese Lücke war unerklärt und ist der häufigste Grund, warum sich eine
   misslungene Probe wie Willkür anfühlt. */
function abzugGrund(k){
  const g = [];
  const koerperlich = ['konstitution','geschick','muskete','bajonett','reiten'].includes(k);
  const wunden = S.wunden.reduce((sum,w)=> sum + (koerperlich ? (w.abzug||0) : Math.round((w.abzug||0)/3)), 0);
  if(wunden) g.push(`Wunden −${wunden}`);
  const bel = Math.floor(S.belastung/12);
  if(bel) g.push(`Belastung −${bel}`);
  if(k==='muskete' && S.ausr.muskete.zustand < 35) g.push('verrostete Muskete −15');
  if(k==='konstitution' && S.ausr.schuhe.zustand < 25) g.push('zerrissene Schuhe −18');
  return g;
}

/* `ohneUebung` für Würfe, die keine Handlung sind, sondern ein Zustand — die
   Konstitutions-Probe gegen ein Fieber etwa. Ohne den Schalter trainierte
   ausgerechnet der Kranke bei jedem Ruhe-Abend seine Konstitution und damit
   seinen Lebensvorrat, während der Gesunde beim selben Knopf nichts bekam:
   Krankheit wäre auf Dauer ein Vorteil gewesen. */
/* ══════════════════ DER PROBEN-SOCKEL — WO DIE KURVE STEHT ══════════════════

   Die Probe hat seit dem 30.07.2026 **zwei** Regler, und sie tun Verschiedenes:

     • `PROBE_SOCKEL` verschiebt die Kurve waagerecht — *wo* „gleich gut wie die
       Aufgabe" landet.
     • Die Wurfbreite (`wurfZahl()`) macht die Kurve steil oder flach — *wie
       sehr* der Abstand zwischen Wert und Aufgabe den Ausschlag gibt.

   **Der Sockel bestimmt den Nullpunkt.** `Ziel = Wert − Schwierigkeit + SOCKEL`;
   bei Wert == Schwierigkeit ist das Ziel genau der Sockel. Er steht auf **60**,
   und der enge Wurf macht daraus **rund 80 %**: Wer der Aufgabe gewachsen ist,
   besteht sie in vier von fünf Fällen, nicht im Münzwurf.

   Bis dahin stand er auf 50 und der Wurf war weit (Mittel aus *zwei* Würfen).
   Das hatte zwei Fehler in einem:
     1. „Gleich gut" war ein Münzwurf — reinspieltechnisch unsinnig.
     2. Der weite Wurf gab **jedem** eine Restchance, auch bei großem Abstand:
        *Bajonett 8 gegen Schwierigkeit 40* bestand zu 29 %. Ein Mann, der die
        Sache nicht kann, sollte sie nicht in fast jedem dritten Versuch schaffen.

   **Beide Regler zusammen ergeben eine Leiter statt eines Rauschens:** Früh, mit
   kleinen Werten, besteht man die 30er-Proben und scheitert an den 50ern; später,
   mit gewachsenen Werten, öffnen sich die 50er. Die Schwierigkeiten in den
   Kapiteln müssen dafür *nicht* mit dem Verlauf steigen (sie tun es nicht — alle
   Kapitel spannen 30–55) — die steile Kurve macht den eigenen Wert zur Schranke.

   Wer den Sockel ändert, misst gegen die vier Leitzahlen und trägt die neue
   Eichung in `CLAUDE.md` nach — „Wert 40 gegen Schwierigkeit 40" ist kein
   Münzwurf mehr, sondern vier von fünf. */
const PROBE_SOCKEL = 60;

/* Die Aussicht einer Probe in Prozent — **dieselbe Rechnung wie `probe()`**,
   nur ohne Wurf. Sie steht auf jedem Knopf, weil zwei nackte Zahlen
   („Konstitution 40 gegen 40") nicht verraten, was sie bedeuten.

   Das ist dieselbe Überlegung, aus der Wert und Schwierigkeit überhaupt auf dem
   Knopf stehen — sie sollen beim Entscheiden helfen. Eine Zahl, die man erst
   umrechnen muss, tut das nicht. */
/* **Der Kampagnenzuschlag muss hier mitgerechnet werden, sonst lügt der Knopf.**
   `aussicht()` und `probe()` sind dieselbe Rechnung, einmal mit und einmal ohne
   Wurf — wer in der einen einen Summanden ergänzt und in der anderen nicht,
   baut eine Anzeige, die etwas anderes verspricht als das, was passiert. */
function aussicht(k, schwierigkeit){
  return chance(Math.max(5, Math.min(95, wert(k) - (schwierigkeit + kampagnenHaerte()) + PROBE_SOCKEL)));
}

/* ══════════════════ DER ENGE WURF — KÖNNEN STATT GLÜCK ══════════════════

   **Der Wurf ist der Mittelwert aus sechs Würfen über 1–100.** Sechs, nicht
   einer und nicht zwei, und die Zahl ist der ganze Punkt: Je mehr Würfe man
   mittelt, desto enger ballt sich das Ergebnis um die Mitte (Streuung ~12 statt
   ~29 bei einem Wurf). **Der Wurf entscheidet dadurch immer weniger; der
   Abstand zwischen Wert und Aufgabe immer mehr.**

   Das ist die Antwort auf „reinspieltechnisch unsinnig": Ein weiter Wurf gibt
   auch dem, der weit unter der Aufgabe steht, eine dicke Restchance. Ein enger
   nimmt sie ihm. Gemessen an der Trefferchance (Sockel 60):

   | Abstand Wert−Aufgabe | Ziel | Chance |
   |---|---|---|
   | −32 (Bajonett 8 gegen 40) | 28 | **~3 %** |
   | −20 | 40 | ~19 % |
   | −10 | 50 | ~48 % |
   | **0 (gleich gut)** | **60** | **~80 %** |
   | +10 | 70 | ~95 % |
   | +20 | 80 | ~99 % |

   **Die Kurve ist jetzt eine Leiter:** Innerhalb von etwa ±12 um „gleich gut"
   entscheidet noch das Glück; darüber und darunter der Wert. Wer der Aufgabe
   gewachsen ist, besteht; wer es nicht ist, besteht nicht — und dazwischen ist
   ein schmaler Streifen, in dem es spannend bleibt.

   > **Woher die sechs kommen:** Der frühere Wurf (Mittel aus *zwei*) war zu
   > weit und hat, kombiniert mit dem Sockel 50, den Erstläufer halbiert — der
   > teuerste gemessene Verlust des Projekts (`OFFEN.md` Punkt 8). Er wohnt am
   > unteren Rand, und ein weiter Wurf trifft ihn dort am härtesten. Der enge
   > Wurf plus der höhere Sockel richten beides zugleich: „gleich gut" steigt
   > auf 80 %, „weit darunter" fällt auf fast nichts. */
function wurfZahl(){
  let s = 0;
  for(let i = 0; i < 6; i++) s += 1 + Math.floor(Math.random() * 100);
  return Math.round(s / 6);
}

/* Die Wahrscheinlichkeit, einen Zielwert zu erreichen — damit auf dem Knopf
   steht, was wirklich passiert. **Ohne diese Umrechnung löge die Oberfläche:**
   Der Zielwert ist bei sechs Würfen nicht die Prozentzahl. Das Mittel aus sechs
   Gleichverteilungen ist nach dem zentralen Grenzwertsatz nahezu normal
   (Mittel 50,5, Streuung ≈ 11,8); die logistische Näherung der Normalverteilung
   ist auf einem Knopf mehr als genau genug. */
function chance(ziel){
  const x = (Math.max(0, Math.min(100, ziel)) - 50.5) / 11.79;
  const p = 1 / (1 + Math.exp(-1.702 * x));
  /* **Nie 100, nie 0.** Es gibt keine sichere Probe und keine unmögliche —
     „100 %" oder „0 %" auf einem Knopf wären eine Lüge. */
  return Math.min(99, Math.max(1, Math.round(p * 100)));
}

/* ══════════════════ DIE PROBE ══════════════════

   ```
   Aufgabe = Schwierigkeit + kampagnenHaerte()    (der Feldzug macht sie härter)
   roh     = Wert − Aufgabe + PROBE_SOCKEL        (ungeklemmt, Sockel = 60)
   Ziel    = clamp(roh, 5, 95)
   Wurf    = Mittel aus sechs d100 (eng, siehe wurfZahl)
   ```

   **Die Klemme bleibt, und sie ist richtig.** Fünf Prozent Fehlschlag gehören
   dazu: Im Rauch schießt auch der beste Schütze daneben, und eine Probe, die
   nie misslingt, ist keine.

   > **Hier stand einmal `koennen` — ein Schadensbonus für alles über der
   > Klemme.** Er ist am 30.07.2026 ersatzlos entfernt worden, weil er die
   > falsche Antwort auf eine richtige Frage war. Die Frage lautete: *Was kauft
   > ein Wert, wenn die Trefferchance schon bei 99 % steht?* Die Antwort des
   > Bonus war „mehr Schaden", und das ist unsinnig — eine Muskete schießt
   > nicht härter, weil der Mann besser zielt.
   >
   > **Die Antwort ist jetzt `kampagnenHaerte()`:** Der Wert kauft weiterhin
   > Trefferchance, nur wird die Aufgabe mit jedem Feldzug schwerer. Wert 80
   > ist 1796 überflüssig und 1812 gerade genug. */

/* ── Wie viel härter die Aufgaben in diesem Feldzug sind ──
   **Ein Regler je Kampagne, genau wie `guete` beim Gefecht** — und aus
   demselben Grund: Das Spiel hat elf Kapitel und einen Spieler, der von Lauf
   zu Lauf besser wird. Bleiben die Anforderungen gleich, wird es mit jedem
   Lauf leichter, statt andere Fragen zu stellen.

   **Warum ein Zuschlag und nicht höhere Zahlen in den Kapiteldaten:** Die
   Schwierigkeiten dort spannen in *jedem* Kapitel 30–55, an rund
   einhundertfünfzig Stellen. Sie einzeln anzuheben wäre dieselbe Änderung,
   nur hundertfünfzigmal abgeschrieben und beim nächsten Mal wieder. Der
   Zuschlag steht an *einer* Stelle und ist eine Zahl je Feldzug.

   Der Nebeneffekt ist Absicht: Die Kapiteldaten sagen weiterhin, wie schwer
   eine Sache *an sich* ist (einen Wagen aus dem Schlamm ziehen: 40), und der
   Feldzug sagt, unter welchen Umständen man sie tut. Derselbe Wagen, derselbe
   Schlamm — aber 1812 bei minus zwanzig Grad und mit leerem Magen. */
function kampagnenHaerte(){
  if(typeof LAUF === 'undefined' || !LAUF) return 0;
  const n = KAPITEL[Math.min(LAUF.node, KAPITEL.length - 1)];
  if(!n) return 0;
  for(const k of KAMPAGNEN){
    const st = STATIONEN[k.id];
    if(st && st.indexOf(n) >= 0) return k.schwierigkeit || 0;
  }
  return 0;
}

function probe(k, schwierigkeit, ohneUebung){
  const w = wert(k);
  const roh = w - (schwierigkeit + kampagnenHaerte()) + PROBE_SOCKEL;
  const ziel = Math.max(5, Math.min(95, roh));
  const wurf = wurfZahl();
  if(!ohneUebung) nutzen(k, 1);
  return {wurf, ziel, wertRoh:w, roh, erfolg: wurf <= ziel};
}

/* **Wie deutlich es gelungen ist, in einem Wort.** Wer die Aufgabe um mehr als
   dreissig Punkte übertrifft, für den ist sie nur noch Form — und das gehört
   auf den Schirm, sonst merkt niemand, wofür er seine Veteranenpunkte
   ausgegeben hat. Darunter steht nichts Besonderes: Ein Wort, das immer
   dasteht, sagt nichts. */
function probeWort(p){
  if(!p || !p.erfolg) return 'misslungen';
  return (p.roh - PROBE_SOCKEL) >= 30 ? 'mühelos gelungen' : 'gelungen';
}

function nutzen(k, intens, fechtboden){
  const ist = (S.attr[k] !== undefined) ? S.attr[k] : S.fert[k];
  if(ist >= 100) return;
  /* ── Die Pointe des Säbels ──
     Ab Rang 7 wächst der Nahkampfwert nicht mehr von allein, weil man nicht
     mehr täglich damit übt: Ein Offizier hat den Degen an der Seite, nicht in
     der Hand. Nach drei Kapiteln als Offizier ist man schlechter im Nahkampf
     als man es als Grenadier war — **du wirst größer und schwächer zugleich.**
     Wer sich dagegen wehren will, geht im Lager auf den Fechtboden; das ist
     die einzige Quelle, und sie kostet einen Abend, den man nicht auf Listen,
     Kasse oder Drill verwendet. Sie umgeht diese Sperre über `fechten:true`. */
  if(k==='bajonett' && S.rang>=7 && !fechtboden) return;
  const zuwachs = (1.7 * intens * (100-ist)/100) * (0.5 + Math.random());
  if(Math.random() < 0.75){
    const neu = Math.min(100, ist + Math.max(1, Math.round(zuwachs)));
    if(S.attr[k] !== undefined) S.attr[k] = neu; else S.fert[k] = neu;
  }
}

function anwenden(e){
  if(!e) return;
  if(e.ruf) S.ruf = Math.max(0, S.ruf + e.ruf);
  // Ohne Angabe geht Gunst an Martel — er ist der unmittelbare Vorgesetzte,
  // und alle bestehenden Szenen meinen ihn. Neue Daten setzen `gunstVon`.
  if(e.gunst) gunstGeben(e.gunstVon || 'martel', e.gunst);
  if(e.kameradschaft) S.kameradschaft = Math.max(0, Math.min(100, S.kameradschaft + e.kameradschaft));
  if(e.belastung) S.belastung = Math.max(0, Math.min(100, S.belastung + e.belastung));
  if(e.atem) S.atem = Math.max(0, Math.min(100, S.atem + e.atem));
  if(e.geld) S.geld = Math.max(0, S.geld + e.geld);
  if(e.nennung){ S.nennungen++; }
  /* **Konstitution darf über 100 gehen, alles andere nicht.** Sie ist der
     einzige Wert, der in etwas Ungeklemmtes zahlt — `lebenMax()` rechnet
     `40 + 0,6 × roh`, linear und ohne Obergrenze. Bei jedem anderen Attribut
     wäre die 100 ohnehin tote Währung, weil die Probe bei 95 klemmt: Gegen
     die üblichen Schwierigkeiten 35–50 sind 85 und 100 dieselbe Zahl.
     Wohlgemerkt hebt das nur die *Klemme*; **wachsen** kann auch die
     Konstitution nur bis 100 (`nutzen()` steigt dort aus), denn die
     Wachstumsformel `(100 − Wert)/100` wird darüber negativ. Was über die
     100 hinausgeht, kommt ausschließlich aus überstandenen Feldzügen —
     Drill plateauiert, ein Krieg nicht. */
  if(e.attr) for(const k in e.attr){
    const deckel = k==='konstitution' ? Infinity : 100;
    S.attr[k] = Math.max(0, Math.min(deckel, S.attr[k] + e.attr[k]));
  }
  if(e.fert) for(const k in e.fert) S.fert[k] = Math.max(0, Math.min(100, S.fert[k] + e.fert[k]));
  if(e.ausr) for(const k in e.ausr) S.ausr[k].zustand = Math.max(0, Math.min(100, S.ausr[k].zustand + e.ausr[k]));
  if(e.leben) S.leben = Math.max(1, Math.min(lebenMax(), S.leben + e.leben));
  /* Eine Wunde aus einer Szene kostet auch Kraft — Ruhr, Hitzschlag und das
     Fieber aus Jaffa sind in Ägypten gefährlicher als Kugeln, und das muss man
     an derselben Zahl sehen. Sie tötet nie unmittelbar: Der Tod gehört ins
     Gefecht, wo er einen Text und einen Ort hat. Sie lässt einen aber so
     geschwächt hineingehen, dass die nächste Kugel reicht. */
  /* `zehrt` macht aus einer Wunde eine Krankheit: Sie kostet nicht einmal,
     sondern an jeder Station weiter, bis sie behandelt ist. Das ist die
     Umsetzung von „Krankheit sollte gefährlicher sein als Kugeln" (KONZEPT.md)
     — Ruhr und das Fieber aus Jaffa liefern einen Mann beim nächsten Gefecht
     mit leerem Vorrat und keiner Luft ab, ohne ihn je selbst zu töten. */
  if(e.wunde){ wundeGeben(e.wunde, 8, e.zehrt); S.leben = Math.max(1, S.leben - 10); }
  /* `heilt` nimmt Wunden weg, statt welche zu geben — die Gegenrichtung, und
     bis Kapitel 3 gab es sie nicht. Das Lazarett von Marseille braucht sie:
     Wer mit der Ruhr aus Ägypten kommt, soll sie *gespielt* loswerden und
     nicht stillschweigend beim Kapitelwechsel. `'krank'` nimmt alles Zehrende,
     eine Zahl nimmt so viele Wunden von vorn. */
  if(e.heilt === 'krank') S.wunden = S.wunden.filter(w=>!w.zehrt);
  else if(typeof e.heilt === 'number') S.wunden.splice(0, e.heilt);
  /* Ein Merkmal, das über die Station hinaus gilt (Ehe, Schulden, gesehene
     Dinge). Bewusst schmal: nur setzen, nie rechnen — wer eine Zahl braucht,
     nimmt eines der bestehenden Felder. */
  if(e.setzt) for(const k in e.setzt) S[k] = e.setzt[k];
  /* Der Zustand der Einheit als Wirkung einer Szene. Gebraucht wird das zum
     ersten Mal in Spanien: Die Repressalien-Entscheidungen kosten oder bringen
     nichts, was am Mann hängt — sie schlagen sich darin nieder, wie die
     Kompanie hinterher funktioniert. **Das ist die Währung, in der ein
     Capitaine bezahlt**, und sie liegt zwischen Kameradschaft (was die Leute
     von dir halten) und Belastung (was du selbst mit dir herumträgst). */
  if(e.einheit) S.einheit = Math.max(0, Math.min(100, (S.einheit==null?70:S.einheit) + e.einheit));
  /* ── Ein Gegenstand, den man vorher nicht hatte ──
     `ausr:` verändert den Zustand vorhandener Ausrüstung; `ausruestung:` legt
     ein Stück neu an. Gebraucht wird das zum ersten Mal für den Mantel: Ohne
     ihn zehrt der Frost, und ein Kapitel, in dem man ihn nur mit
     Veteranenpunkten bekommen kann, wäre eine Mautstelle statt einer Regel.
     **Was man im Feld findet, ist schlechter als was man kauft** — das ist der
     Unterschied, und er steht in den Daten, nicht hier. */
  if(e.ausruestung) for(const k in e.ausruestung) S.ausr[k] = Object.assign({}, e.ausruestung[k]);
  atemKlemmen();
}

/* ── Lebenspunkte ──
   Konstitution bestimmt, wie viel ein Mann aushält, nicht ob ihn eine Kugel
   überhaupt töten kann. Das ist der Unterschied zur alten Formel: Dort senkte
   Konstitution die Todeschance je Treffer, und ab 58 war sie rechnerisch null
   — ein Mann, den keine Kugel tötet. Hier ist die Kurve monoton: Mehr
   Konstitution heißt mehr Treffer, die man wegsteckt, aber genug Treffer
   töten jeden.

   Gerechnet wird vom **rohen** Attribut, nicht von wert(): Sonst schrumpfte
   die Obergrenze mitten im Gefecht, weil Wunden die Konstitution senken. */
const WUNDE_JE_PUNKT = 0.6;    // Abzug 5/8/14 → 3/5/8 Punkte weniger Vorrat
const VORRAT_BODEN     = 0.4;    // so viel bleibt einem Zerschossenen mindestens

function lebenMax(mann){
  const m = mann || S;
  const roh = m.attr && typeof m.attr.konstitution === 'number' ? m.attr.konstitution : 20;
  const grund = 40 + Math.round(roh * 0.6);   // 52 bei 20 · 64 bei 40 · 82 bei 70 · 94 bei 90
  /* Offene Wunden verkleinern den Mann. Das ist der Hebel, der die Lücke
     schließt, durch die ein kundiger Spieler bisher unbeschadet kam: Leben
     heilt schnell nach (Zeit, Lagerabend, Winterwoche), Wunden wird man nur
     langsam los — der Feldscher näht je Gefecht nur die leichteste. Wer mit
     zwei alten Wunden nach Arcole geht, hat 66 statt 82 Punkte, und über den
     Atem-Deckel entsprechend weniger Luft.
     Der Boden bei 40 % verhindert, dass Wunden allein töten: Sie machen einen
     kleiner, nie tot — der Tod gehört ins Gefecht. */
  const offen = (m.wunden||[]).reduce((sum,w)=> sum + (w.abzug||0), 0);
  return Math.max(Math.round(grund*VORRAT_BODEN), grund - Math.round(offen*WUNDE_JE_PUNKT));
}
function lebenAuffuellen(anteil){
  const max = lebenMax();
  // Klemme bei 1: Sterben darf man nur im Gefecht, nie durch Buchhaltung.
  S.leben = Math.max(1, Math.min(max, S.leben + Math.round(max*anteil)));
}

/* Der Atem steigt nie über die Lebenspunkte. Das ist die eine Regel, die einen
   schwer Verwundeten wirklich verwundet spielen lässt: Mit 25 Leben stehen ihm
   höchstens 25 Atem zu — unter der Warnschwelle 35, nahe am Malus bei 30. Er
   kann ins Gefecht, aber er geht als der hinein, der er gerade ist. Erst
   heilen, dann verschnaufen. Aufgerufen nach jeder Änderung an Atem oder
   Leben; wer eine neue Stelle baut, die daran dreht, ruft sie ebenfalls. */
function atemKlemmen(){
  if(!S) return;
  S.leben = Math.max(0, Math.min(S.leben, lebenMax()));
  S.atem  = Math.max(0, Math.min(S.atem, S.leben));
}

/* ══════════════════ DER FROST ══════════════════

   **Die eigene Regel von Kapitel 6: Der Winter schießt mit.** Das erste Mal,
   dass das Wetter ein Gegner mit Werten ist — und es ist ausdrücklich *keine*
   neue Krankheit, sondern die Einlösung von KAMPAGNEN §0.9: „Kälte ist keine
   Krankheit, sondern Belastung und Verschleiß."

   `frost:n` an einer Station heißt: Diese Station wird unter freiem Himmel
   verbracht. Die Stufe ist die Härte — 1 in Ostpreußen, 3 auf dem Rückweg von
   Moskau, 4 ohne Mantel ab Smolensk.

   | | mit Mantel | ohne |
   |---|---|---|
   | Belastung | +4 je Station | +4 |
   | Verschleiß | ×(1 + Stufe/2) | dasselbe |
   | Leben | — | **eine zehrende Wunde, Stufe = Zehrung** |

   **Der Beutemantel ist damit rückwirkend der wichtigste Posten im Laden**,
   und das ist der ganze Trick: Kapitel 6 baut kein neues System, es macht ein
   altes wichtig. Genau wie die Schuhe in der Tempowahl.

   **Der Frost taut auf, sobald eine Station ein Dach hat** (jede ohne `frost`).
   Er ist kein Fieber, das man mitschleppt — er ist der Zustand, in dem man
   gerade lebt. Deshalb wird die Wunde entfernt und nicht geheilt: Es gibt
   nichts zuzunähen. */
const FROST_WUNDE = 'Der Frost';

function frostWirken(n){
  if(!S) return '';
  /* „Er schläft im Freien." Eine Stufe milder, und bei Stufe 1 heißt das:
     gar nicht. Das ist kein Ersatz für den Mantel — ohne ihn bleibt auch der
     Gewohnte im Januar bei Stufe 4 eine zehrende Wunde schuldig. Es ist die
     Erfahrung, die daneben steht: wo man liegt, wie man sich einwickelt,
     wann man aufsteht und geht, statt liegen zu bleiben. */
  const stufe = Math.max(0, ((n && n.frost) | 0) - (zaeh('zaeh_schlaf') ? 1 : 0));
  const hat = S.wunden.some(w => w.name === FROST_WUNDE);
  if(!stufe){
    if(!hat) return '';
    S.wunden = S.wunden.filter(w => w.name !== FROST_WUNDE);
    atemKlemmen();
    return 'Ein Dach, ein Ofen, und es dauert zwei Tage, bis die Finger wieder etwas halten.';
  }
  S.belastung = Math.min(100, S.belastung + 4);
  /* **Verschleiß ×1,5, nicht ×2.** Eine Szene kostet ohnehin 0,35; 0,1 je
     Stufe legt bei Stufe 2 ein Fünftel darauf und trifft damit die Vorgabe aus
     KAMPAGNEN §2. Wer hier auf 0,15 geht, verdoppelt den Verschleiß und macht
     aus einer Regel eine Mautstelle. */
  verschleiss(0.1 * stufe);
  const mantel = S.ausr.mantel && S.ausr.mantel.zustand >= 20;
  if(mantel || hat) return '';
  wundeGeben(FROST_WUNDE, 6, stufe);
  return 'Eine Nacht im Freien ohne Mantel. Es geht in die Finger und bleibt dort.';
}

function wundeGeben(name, abzug, zehrt){
  const w = {name, abzug};
  if(zehrt) w.zehrt = zehrt;          // Krankheit: zehrt je Station weiter
  S.wunden.push(w);
  S.belastung = Math.min(100, S.belastung + 6);
  atemKlemmen();                       // der Vorrat ist gerade kleiner geworden
}

/* ── Doppelter Verschleiß, wo nichts nachkommt ──
   `verschleiss:2` an einer Kampagne (Russland) verdoppelt jeden Abrieb. Das
   ist die Hälfte der Regel; die andere steht in den Kapiteldaten, weil sie
   dort hingehört: In Russland gibt es keine Lagerhandlung, die Schuhe oder
   Muskete instand setzt, und keinen Marketender. **Was kaputt ist, bleibt
   kaputt** — und der Verschleiß greift über `wert()` direkt in die Proben:
   Konstitution verliert 18 Punkte, sobald die Schuhe unter Zustand 25 fallen. */
function verschleiss(faktor){
  const k = (typeof kampagneVon==='function') ? kampagneVon(KAPITEL[LAUF?LAUF.node:0]) : null;
  if(k && k.verschleiss) faktor *= k.verschleiss;
  for(const k2 in S.ausr){
    const a = S.ausr[k2];
    /* „Füße wie Leder": Nur die Schuhe, und nur sie — ein Mann, der weiß, wie
       man geht, schont sein Schuhwerk und sonst nichts. Das trifft genau die
       Stelle, an der Verschleiß wirklich wehtut: Unter Zustand 25 kostet
       Schuhwerk 18 Konstitution, und in Russland gibt es keinen Ersatz. */
    const f = (k2==='schuhe' && zaeh('zaeh_fuesse')) ? faktor*0.5 : faktor;
    if(a.verschleiss>0) a.zustand = Math.max(0, a.zustand - Math.round(a.verschleiss*f));
  }
}

/* Der Tod nimmt dem Spielstand im selben Augenblick die Gültigkeit. Kein
   Zurück, keine zweite Ausfertigung — Invariante 1. */
function toetlich(grund){
  S.lebt = false; S.ende = 'tot'; S.todesart = grund;
  laufVerwerfen();
}
