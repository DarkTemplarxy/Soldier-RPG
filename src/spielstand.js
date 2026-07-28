'use strict';
/* Spielstand: Fassungen, Wandler, Ablage, Aussetz-Spielstand.

   Zwei Dinge werden gespeichert, und sie haben nichts miteinander zu tun:

   CHRONIK  Veteranenpunkte, Chronik, erreichte Stationen. Lebt für immer,
            wächst, gehört später in die Steam-Cloud.
   LAUF     Der angefangene Feldzug. Ein einziger Platz, kein zweiter.
            Wird beim Tod sofort gelöscht und ist danach nicht mehr zu laden.

   Der Aussetz-Spielstand ist zum Aufhören da, nicht zum Wiederholen. Deshalb
   wird er bei jedem Schritt überschrieben und zeigt immer auf das Jetzt: Wer
   das Spiel beendet, kommt genau dorthin zurück, wo er war — nie weiter zurück.

   Die Datei bleibt das maßgebliche Format (Invariante 6). `localStorage` ist
   nur die bequeme Ablage, damit ein Absturz den Feldzug nicht kostet. Wo es
   sie nicht gibt, funktioniert alles weiter, nur eben ohne Absturzsicherung. */

const CHRONIK_FASSUNG = 1;
const LAUF_FASSUNG    = 2;   // 2: Lebenspunkte statt Todeswurf je Treffer
const CHRONIK_GRENZE  = 200;   // so viele Läufe im Einzelnen, der beste immer

const ORT_CHRONIK   = 'marschallstab.chronik';
const ORT_SICHERUNG = 'marschallstab.chronik.bak';
const ORT_LAUF      = 'marschallstab.lauf';

/* ══════════════════ ABLAGE ══════════════════ */

/* Eine Schicht, drei mögliche Rückseiten. Das Spiel darf nie wissen, wo es
   liegt — dieselbe Schnittstelle bedient später auch den Benutzerordner einer
   Electron-Verpackung und damit Steams Auto-Cloud. */
const Ablage = (function(){
  let echt = false;
  try { localStorage.setItem('__probe','1'); localStorage.removeItem('__probe'); echt = true; }
  catch(e){ echt = false; }        // file:// in manchen Browsern, privater Modus
  const fluechtig = {};
  return {
    dauerhaft: echt,
    lies(o){ try{ return echt ? localStorage.getItem(o) : (fluechtig[o] || null); }catch(e){ return fluechtig[o] || null; } },
    schreibe(o,t){ try{ if(echt) localStorage.setItem(o,t); else fluechtig[o]=t; return true; }
                   catch(e){ fluechtig[o]=t; return false; } },
    loesche(o){ try{ if(echt) localStorage.removeItem(o); }catch(e){} delete fluechtig[o]; }
  };
})();

/* ══════════════════ HÜLLE UND PRÜFSUMME ══════════════════ */

/* Nicht gegen Betrüger — auf dem eigenen Rechner ist das aussichtslos, und
   weil nur der beste Lauf zählt, lohnt es sich ohnehin nicht. Sondern gegen
   halb geschriebene Dateien und kaputte Cloud-Abgleiche. */
function pruefsumme(t){ let h = 0; for(let i=0;i<t.length;i++) h = (h*31 + t.charCodeAt(i))|0; return h; }

function huelle(nutzlast){
  const t = JSON.stringify(nutzlast);
  return JSON.stringify({pruef:pruefsumme(t), inhalt:nutzlast}, null, 1);
}
function auspacken(text){
  const d = JSON.parse(text);
  if(d && typeof d === 'object' && d.inhalt !== undefined){
    const heil = typeof d.pruef !== 'number' || d.pruef === pruefsumme(JSON.stringify(d.inhalt));
    return {inhalt:d.inhalt, heil};
  }
  return {inhalt:d, heil:true};        // Fassung 0: nackte Nutzlast, ohne Hülle
}

/* ══════════════════ WANDLER ══════════════════ */

/* Jeder Wandler hebt genau eine Fassung auf die nächste. Nie raten, nie eine
   Fassung überspringen. Wer das Format ändert, hängt hier einen Eintrag an und
   erhöht die Fassungszahl oben — sonst brechen alle Spielstände in der Welt. */
const CHRONIK_WANDLER = {
  0: alt => ({fassung:1, vp:alt.vp|0, chronik:alt.chronik||[], bestKapitel:alt.bestKapitel||{},
              laeufe:(alt.chronik||[]).length, zuletzt:null})
};
/* Fassung 1 kannte keine Lebenspunkte — der Tod war ein Wurf je Treffer. Ein
   angefangener Feldzug von damals bekommt sie voll, abzüglich dessen, was seine
   bleibenden Wunden ohnehin schon gekostet haben. Wer mit vier Wunden aus der
   alten Fassung kommt, steht also angeschlagen da, aber nicht tot. */
const LAUF_WANDLER = {
  1: alt => {
    const m = alt.mann;
    if(m && m.leben === undefined){
      const max = 40 + Math.round((m.attr && m.attr.konstitution || 20) * 0.6);
      const gezahlt = (m.wunden||[]).reduce((s,w)=> s + (w.abzug||0), 0);
      m.leben = Math.max(Math.round(max*0.3), max - gezahlt);
    }
    return Object.assign({}, alt, {fassung:2});
  }
};

function wandle(d, wandler, ziel){
  if(!d || typeof d !== 'object') return null;
  let f = typeof d.fassung === 'number' ? d.fassung : 0;
  while(f < ziel){
    const w = wandler[f];
    if(!w) return null;
    d = w(d); f = d.fassung;
  }
  return f === ziel ? d : null;        // aus der Zukunft: lieber nichts als Trümmer
}

function neueChronik(){
  return {fassung:CHRONIK_FASSUNG, vp:0, chronik:[], bestKapitel:{}, laeufe:0, zuletzt:null};
}

/* ══════════════════ CHRONIK ══════════════════ */

function chronikSichern(){
  META.fassung = CHRONIK_FASSUNG;
  META.zuletzt = new Date().toISOString();
  const alt = Ablage.lies(ORT_CHRONIK);
  if(alt) Ablage.schreibe(ORT_SICHERUNG, alt);     // eine Generation zurück bleibt
  Ablage.schreibe(ORT_CHRONIK, huelle(META));
}

function chronikLaden(){
  for(const ort of [ORT_CHRONIK, ORT_SICHERUNG]){
    const t = Ablage.lies(ort);
    if(!t) continue;
    try{
      const {inhalt, heil} = auspacken(t);
      const d = wandle(inhalt, CHRONIK_WANDLER, CHRONIK_FASSUNG);
      if(d && heil){ META = d; return true; }
      if(d && !heil) continue;                     // beschädigt: Sicherung versuchen
    }catch(e){ /* nächster Ort */ }
  }
  return false;
}

/* Die Chronik wächst mit jedem Lauf. Alle zählen, aber nur die jüngsten
   werden einzeln behalten — und der beste immer, denn er ist der Vorrat. */
function chronikKuerzen(){
  if(META.chronik.length <= CHRONIK_GRENZE) return;
  const best = META.chronik.reduce((a,b)=> b.punkte > a.punkte ? b : a);
  const jung = META.chronik.slice(-(CHRONIK_GRENZE-1));
  META.chronik = jung.indexOf(best) >= 0 ? jung : [best].concat(jung);
}

/* ══════════════════ AUSSETZ-SPIELSTAND ══════════════════ */

function laufSichern(){
  if(!LAUF || !LAUF.mann || !LAUF.mann.lebt) return;
  LAUF.zuletzt = new Date().toISOString();
  Ablage.schreibe(ORT_LAUF, huelle(LAUF));
}

/* Beim Tod. Sofort und ohne Umweg — danach gibt es nichts mehr zu laden. */
function laufVerwerfen(){ Ablage.loesche(ORT_LAUF); }

function laufVorhanden(){
  const t = Ablage.lies(ORT_LAUF);
  if(!t) return null;
  try{
    const {inhalt, heil} = auspacken(t);
    if(!heil) return null;
    const d = wandle(inhalt, LAUF_WANDLER, LAUF_FASSUNG);
    if(!d || !d.mann || !d.mann.lebt) return null;
    return d;
  }catch(e){ return null; }
}

/* ══════════════════ DATEI ══════════════════ */

/* Das maßgebliche Format: Chronik und, falls einer läuft, der Feldzug.
   Eine Datei, damit niemand zwei verwalten muss. */
function dateiInhalt(){
  return huelle({fassung:CHRONIK_FASSUNG, chronik:META, lauf:LAUF || laufVorhanden() || null});
}

function dateiEinlesen(text){
  const {inhalt, heil} = auspacken(text);
  if(!heil) return {ok:false, grund:'Die Datei ist beschädigt — die Prüfsumme stimmt nicht.'};
  // Fassung 0 war die nackte Chronik ohne Umschlag
  const rohChronik = inhalt && inhalt.chronik !== undefined && inhalt.chronik.vp !== undefined
    ? inhalt.chronik : inhalt;
  const c = wandle(rohChronik, CHRONIK_WANDLER, CHRONIK_FASSUNG);
  if(!c) return {ok:false, grund:'Diese Datei ist kein Spielstand oder stammt aus einer neueren Fassung des Spiels.'};
  META = c;
  chronikSichern();
  const l = inhalt && inhalt.lauf ? wandle(inhalt.lauf, LAUF_WANDLER, LAUF_FASSUNG) : null;
  if(l && l.mann && l.mann.lebt) Ablage.schreibe(ORT_LAUF, huelle(l));
  return {ok:true, lauf:!!l};
}
