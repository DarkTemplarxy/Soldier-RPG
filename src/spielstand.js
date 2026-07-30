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
const LAUF_FASSUNG    = 10;  // 2: Lebenspunkte · 3: die Kette · 4: Orden · 5: Tatenzählung · 6: Sold · 7: der Offizier · 8: der Stab · 9: die Patente · 10: der höchste getragene Rang
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
    /* Fehlt die Prüfsumme oder ist sie keine Zahl, gilt die Datei als **kaputt**,
       nicht als heil — sonst genügte das Löschen einer Zeile, um sie zu umgehen,
       und genau das passiert bei einem verschluckten Cloud-Abgleich. */
    const heil = typeof d.pruef === 'number' && d.pruef === pruefsumme(JSON.stringify(d.inhalt));
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
  },
  /* Fassung 2 hatte eine einzige Gunst-Zahl, die immer Martel meinte. Sie wird
     zu seiner Beziehung; die drei anderen fangen bei null an — man hat sie in
     diesem Feldzug schlicht noch nicht kennengelernt. */
  2: alt => {
    const m = alt.mann;
    if(m && !m.leute){
      m.leute = leuteStart();
      m.leute.martel.gunst = Math.max(-5, Math.min(5, m.gunst|0));
      delete m.gunst;
    }
    return Object.assign({}, alt, {fassung:3});
  },
  /* Fassung 3 kannte keine Orden. Ein angefangener Feldzug bekommt eine leere
     Liste — nachträglich verleihen wäre geraten, und `ordenFaellig()` holt es
     an der nächsten Station ohnehin nach, wenn die Bedingungen stimmen. */
  3: alt => {
    if(alt.mann && !alt.mann.orden) alt.mann.orden = [];
    return Object.assign({}, alt, {fassung:4});
  },
  /* Fassung 4 zählte Taten noch nicht. Alle drei Zähler fangen bei null an —
     rückwirkend aus den Nennungen zu raten wäre geraten, und die Zähler wirken
     ohnehin erst auf die Gefechte, die noch kommen. */
  4: alt => {
    const m = alt.mann;
    if(m){
      if(m.belobigungen === undefined) m.belobigungen = 0;
      if(m.bulletins === undefined) m.bulletins = 0;
      if(m.sondermissionen === undefined) m.sondermissionen = 0;
    }
    return Object.assign({}, alt, {fassung:5});
  },
  /* Fassung 5 kannte keinen Sold. Ein angefangener Feldzug fängt bei null an —
     rückwirkend Sold für gelaufene Stationen gutzuschreiben wäre geraten, und
     die nächste Auszahlung im Lager kommt ohnehin bald. */
  5: alt => {
    if(alt.mann && alt.mann.soldOffen === undefined) alt.mann.soldOffen = 0;
    return Object.assign({}, alt, {fassung:6});
  },
  /* Fassung 6 kannte die Offiziersränge nur als Namen, nicht als Zustand: Es
     gab keinen Einheitszustand, keine Kompaniekasse und keine Merkliste, in
     welchem Kapitel die Linie schon einmal gebrochen ist.

     **Der Einheitszustand fängt bei 70 an, nicht bei 100.** Wer als Capitaine
     eine Kompanie übernimmt, übernimmt sie so, wie sein Vorgänger sie
     hinterlassen hat — und der ist gefallen. Hundert wäre ein Geschenk, das
     die erste Entscheidung an der Kasse entwerten würde. */
  6: alt => {
    const m = alt.mann;
    if(m){
      if(m.einheit === undefined) m.einheit = (m.rang>=9 ? 70 : null);
      if(m.kasseRisiko === undefined) m.kasseRisiko = 0;
      if(m.auftraege === undefined) m.auftraege = 0;
      if(!m.nahkampfKapitel) m.nahkampfKapitel = [];
    }
    return Object.assign({}, alt, {fassung:7});
  },
  /* Fassung 7 endete beim Capitaine. Der Stab bringt zwei Felder mit, die
     nicht bloß Zähler sind:

     **Der Adler fängt bei „getragen" an, nicht bei null.** Ein Regiment hat
     einen; die Frage ist nur, ob es ihn behält. Und die **Dotation** ist ab
     Rang 13 ein laufender Ertrag — rückwirkend gutzuschreiben wäre geraten,
     also fängt sie bei der nächsten Station an zu laufen. */
  7: alt => {
    const m = alt.mann;
    if(m){
      if(m.adler === undefined) m.adler = (m.rang>=11 ? 'getragen' : null);
      if(m.dotation === undefined) m.dotation = (m.rang>=13 ? 8 : 0);
    }
    return Object.assign({}, alt, {fassung:8});
  },
  /* Fassung 8 kannte keine Patente. **Ein alter Feldzug hat keines** — er ist
     ehrlich erspielt, und das darf ihm nicht nachträglich weggenommen werden:
     Ein Patent kostet Wertung, macht die Kapitel härter und sperrt zwei
     Fürsprecher. Rückwirkend eines einzutragen wäre eine Bestrafung für nichts. */
  8: alt => {
    if(alt.mann && alt.mann.patent === undefined) alt.mann.patent = null;
    return Object.assign({}, alt, {fassung:9});
  },
  /* Fassung 9 merkte sich nicht, wie hoch einer schon einmal stand.
     Gebraucht wird das, seit die Seitenleiste `ab:` auswertet: Wer über dir
     steht, erscheint erst, wenn dein Rang ihn erreicht — und **ein
     zurückgestufter Offizier darf seinen Fürsprecher nicht verlieren.** Der
     Inspecteur nimmt einen Rang, nicht eine Bekanntschaft; Gunst liefe sonst
     unsichtbar weiter.

     Für einen angefangenen Feldzug ist der heutige Rang die einzige ehrliche
     Auskunft — höher stand er vielleicht, aber raten wäre schlechter als
     untertreiben. */
  9: alt => {
    const m = alt.mann;
    if(m && m.hoechsterRang === undefined) m.hoechsterRang = m.rang|0;
    return Object.assign({}, alt, {fassung:10});
  }
};

function wandle(d, wandler, ziel){
  if(!d || typeof d !== 'object') return null;
  let f = typeof d.fassung === 'number' ? d.fassung : 0;
  while(f < ziel){
    const w = wandler[f];
    if(!w) return null;
    const vorher = f;
    d = w(d); f = d.fassung;
    // Ein Wandler, der die Fassung nicht erhöht, hinge sonst für immer.
    if(!(typeof f === 'number' && f > vorher)) return null;
  }
  return f === ziel ? d : null;        // aus der Zukunft: lieber nichts als Trümmer
}

function neueChronik(){
  /* `generalskampagnen` ist die einzige dauerhafte Freischaltung des Spiels —
     einmal Rang 12 erreicht, bleibt sie offen. Ein fehlendes Feld ist
     schlicht `undefined` und damit falsch; es braucht deshalb keinen Wandler
     und keine neue Chronikfassung. */
  return {fassung:CHRONIK_FASSUNG, vp:0, chronik:[], bestKapitel:{}, laeufe:0,
          generalskampagnen:false, bestRang:0, zuletzt:null};
}

/* ══════════════════ CHRONIK ══════════════════ */

/* **Der Riegel gegen die schlimmste Datenvernichtung des Spiels.** Schlägt das
   Laden fehl, obwohl eine Datei da war (Prüfsumme kaputt, Fassung aus der
   Zukunft), bleibt `META` die leere Neuchronik. Ohne Riegel überschrieb das
   erste `chronikSichern()` — und das läuft an *jeder* Station — die gute Datei
   mit der leeren, das zweite auch noch die `.bak`-Generation. Nach zwei
   Stationen waren alle Veteranenpunkte weg, und der Schutz in `wandle()`
   („aus der Zukunft: lieber nichts als Trümmer") war für nichts.
   Gelöst wird der Riegel nur, wenn der Spieler ausdrücklich verwirft. */
let CHRONIK_GESPERRT = false;

function chronikSichern(){
  if(CHRONIK_GESPERRT) return;
  META.fassung = CHRONIK_FASSUNG;
  META.zuletzt = new Date().toISOString();
  const alt = Ablage.lies(ORT_CHRONIK);
  if(alt) Ablage.schreibe(ORT_SICHERUNG, alt);     // eine Generation zurück bleibt
  Ablage.schreibe(ORT_CHRONIK, huelle(META));
}

function chronikLaden(){
  let gabEsWas = false;
  for(const ort of [ORT_CHRONIK, ORT_SICHERUNG]){
    const t = Ablage.lies(ort);
    if(!t) continue;
    gabEsWas = true;
    try{
      const {inhalt, heil} = auspacken(t);
      const d = wandle(inhalt, CHRONIK_WANDLER, CHRONIK_FASSUNG);
      if(d && heil){ META = d; return true; }
      if(d && !heil) continue;                     // beschädigt: Sicherung versuchen
    }catch(e){ /* nächster Ort */ }
  }
  // Es lag etwas da, war aber nicht lesbar: nichts überschreiben, bis der
  // Spieler entscheidet. Sonst frisst die leere Chronik beide Generationen.
  if(gabEsWas) CHRONIK_GESPERRT = true;
  return false;
}

/* „Trotzdem neu anfangen" auf dem Titelbildschirm: Der Spieler verwirft die
   unlesbare Chronik ausdrücklich, erst dann darf wieder geschrieben werden. */
function chronikFreigeben(){ CHRONIK_GESPERRT = false; chronikSichern(); }

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
  /* Zusammenführen statt ersetzen: `vp` ist das Maximum über alle Läufe
     (Invariante 2), also darf das Einlesen einer älteren Datei den Vorrat nicht
     senken. Vorher tat es genau das. `laeufe` zählt Läufe, addiert sich also. */
  c.vp = Math.max(c.vp|0, META.vp|0);
  c.laeufe = Math.max(c.laeufe|0, META.laeufe|0);
  /* Dieselbe Logik für die Freischaltung: Wer sie einmal hatte, behält sie.
     Eine ältere Datei darf sie nicht wieder wegnehmen. */
  c.generalskampagnen = !!(c.generalskampagnen || META.generalskampagnen);
  c.bestRang = Math.max(c.bestRang|0, META.bestRang|0);
  META = c;
  CHRONIK_GESPERRT = false;    // eine gültige Datei hebt den Riegel auf
  chronikSichern();
  const l = inhalt && inhalt.lauf ? wandle(inhalt.lauf, LAUF_WANDLER, LAUF_FASSUNG) : null;
  if(l && l.mann && l.mann.lebt) Ablage.schreibe(ORT_LAUF, huelle(l));
  return {ok:true, lauf:!!l};
}
