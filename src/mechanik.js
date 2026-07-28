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
          lager:{id:null, abende:0, log:[]}, winter:{wochen:3, log:[]},
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
  const zehrung = S.wunden.reduce((sum,w)=> sum + (w.zehrt||0), 0);
  if(zehrung) S.leben = Math.max(1, S.leben - zehrung);
  else lebenAuffuellen(0.05);
  atemKlemmen();
  laufSichern();
}

function neuerCharakter(name, herkunftId, attrVerteilung, kaeufe, punkte){
  const h = HERKUENFTE.find(x=>x.id===herkunftId);
  const attr = {}; ATTRIBUTE.forEach(([k])=> attr[k] = attrVerteilung[k]);
  const fert = {}; FERTIGKEITEN.forEach(([k])=> fert[k] = 10);
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
    rang:1, zweig:null, ruf:0, gunst:0, kameradschaft:20, belastung:0,
    atem:100, leben:0,
    wunden:[], nennungen:0, kaeufe:kaeufe||[], gekauft:punkte||{},
    kapitel:0, lebt:true, ende:null, log:[]
  };
  mann.leben = lebenMax(mann);
  return mann;
}

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

/* `ohneUebung` für Würfe, die keine Handlung sind, sondern ein Zustand — die
   Konstitutions-Probe gegen ein Fieber etwa. Ohne den Schalter trainierte
   ausgerechnet der Kranke bei jedem Ruhe-Abend seine Konstitution und damit
   seinen Lebensvorrat, während der Gesunde beim selben Knopf nichts bekam:
   Krankheit wäre auf Dauer ein Vorteil gewesen. */
function probe(k, schwierigkeit, ohneUebung){
  const w = wert(k);
  const ziel = Math.max(5, Math.min(95, w - schwierigkeit + 50));
  const wurf = 1 + Math.floor(Math.random()*100);
  if(!ohneUebung) nutzen(k, 1);
  return {wurf, ziel, wertRoh:w, erfolg: wurf <= ziel};
}

function nutzen(k, intens){
  const ist = (S.attr[k] !== undefined) ? S.attr[k] : S.fert[k];
  if(ist >= 100) return;
  const zuwachs = (1.7 * intens * (100-ist)/100) * (0.5 + Math.random());
  if(Math.random() < 0.75){
    const neu = Math.min(100, ist + Math.max(1, Math.round(zuwachs)));
    if(S.attr[k] !== undefined) S.attr[k] = neu; else S.fert[k] = neu;
  }
}

function anwenden(e){
  if(!e) return;
  if(e.ruf) S.ruf = Math.max(0, S.ruf + e.ruf);
  if(e.gunst) S.gunst = Math.max(0, S.gunst + e.gunst);
  if(e.kameradschaft) S.kameradschaft = Math.max(0, Math.min(100, S.kameradschaft + e.kameradschaft));
  if(e.belastung) S.belastung = Math.max(0, Math.min(100, S.belastung + e.belastung));
  if(e.atem) S.atem = Math.max(0, Math.min(100, S.atem + e.atem));
  if(e.geld) S.geld = Math.max(0, S.geld + e.geld);
  if(e.nennung){ S.nennungen++; }
  if(e.attr) for(const k in e.attr) S.attr[k] = Math.max(0, Math.min(100, S.attr[k] + e.attr[k]));
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

function wundeGeben(name, abzug, zehrt){
  const w = {name, abzug};
  if(zehrt) w.zehrt = zehrt;          // Krankheit: zehrt je Station weiter
  S.wunden.push(w);
  S.belastung = Math.min(100, S.belastung + 6);
  atemKlemmen();                       // der Vorrat ist gerade kleiner geworden
}

function verschleiss(faktor){
  for(const k in S.ausr){
    const a = S.ausr[k];
    if(a.verschleiss>0) a.zustand = Math.max(0, a.zustand - Math.round(a.verschleiss*faktor));
  }
}

/* Der Tod nimmt dem Spielstand im selben Augenblick die Gültigkeit. Kein
   Zurück, keine zweite Ausfertigung — Invariante 1. */
function toetlich(grund){
  S.lebt = false; S.ende = 'tot'; S.todesart = grund;
  laufVerwerfen();
}
