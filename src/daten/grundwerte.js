'use strict';
/* Grundwerte: Attribute, Fertigkeiten, Ränge, Herkünfte, Ausrüstung, Kaufladen.
   Reine Daten. Wer hier Zahlen ändert, trägt sie in CLAUDE.md nach. */

/* ══════════════════ DATEN ══════════════════ */

const ATTRIBUTE = [
  ['konstitution','Konstitution'],['geschick','Geschick'],['kaltbluetigkeit','Kaltblütigkeit'],
  ['autoritaet','Autorität'],['bildung','Bildung'],['menschenkenntnis','Menschenkenntnis']
];
const FERTIGKEITEN = [
  ['muskete','Muskete'],['bajonett','Bajonett'],['reiten','Reiten'],['drill','Drill'],
  ['taktik','Taktik'],['kartenkunde','Kartenkunde'],['verwaltung','Verwaltung'],
  ['fouragieren','Fouragieren'],['feldchirurgie','Feldchirurgie']
];
const NAMEN = ATTRIBUTE.concat(FERTIGKEITEN).reduce((o,[k,n])=>(o[k]=n,o),{});

const RANG = [
  {n:1,name:'Fusilier',wert:0},{n:2,name:'Grenadier',wert:12},{n:3,name:'Caporal',wert:26},
  {n:4,name:'Caporal-fourrier',wert:42},{n:5,name:'Sergent',wert:62}
];
function rangName(n){
  if(n===2) return S.zweig==='voltigeur' ? 'Voltigeur' : 'Grenadier';
  const r=RANG.find(r=>r.n===n); return r?r.name:'Fusilier';
}
function rangWert(n){ const r=RANG.find(r=>r.n===n); return r?r.wert:0; }

const HERKUENFTE = [
  {id:'bauer',name:'Bauernsohn',
   text:'Konstitution +20 · Fouragieren +25 · Bajonett +15 · Bildung −10',
   attr:{konstitution:20,bildung:-10}, fert:{fouragieren:25,bajonett:15}},
  {id:'schmied',name:'Schmiedsgeselle',
   text:'Geschick +20 · Muskete +25 · Bajonett +15 · Menschenkenntnis −10',
   attr:{geschick:20,menschenkenntnis:-10}, fert:{muskete:25,bajonett:15}},
  {id:'wilderer',name:'Wilderer',
   text:'Muskete +30 · Fouragieren +20 · Geschick +15 · Autorität −15',
   attr:{geschick:15,autoritaet:-15}, fert:{muskete:30,fouragieren:20}},
  {id:'fuhrmann',name:'Fuhrmannssohn',
   text:'Reiten +30 · Verwaltung +20 · Konstitution +10 · Kaltblütigkeit −10',
   attr:{konstitution:10,kaltbluetigkeit:-10}, fert:{reiten:30,verwaltung:20}},
  {id:'schreiber',name:'Schreibergehilfe',
   text:'Bildung +25 · Verwaltung +25 · Kartenkunde +20 · Konstitution −20',
   attr:{bildung:25,konstitution:-20}, fert:{verwaltung:25,kartenkunde:20}},
  {id:'strasse',name:'Straßenjunge aus Paris',
   text:'Menschenkenntnis +25 · Kaltblütigkeit +20 · Fouragieren +20 · Bildung −15',
   attr:{menschenkenntnis:25,kaltbluetigkeit:20,bildung:-15}, fert:{fouragieren:20}}
];

const AUSRUESTUNG_START = () => ({
  muskete:{name:'Charleville Modell 1777',zustand:70,verschleiss:15},
  seitenwaffe:{name:'Ausgabebajonett',zustand:80,verschleiss:8},
  schuhe:{name:'Ausgabeschuhe',zustand:55,verschleiss:25},
  mantel:{name:'Kein Mantel',zustand:0,verschleiss:0},
  tornister:{name:'Ausgabetornister',zustand:65,verschleiss:10}
});

// Kaufkosten: Preis je Punkt nach Zehnerbereich
const PRO_PUNKT = [1,1,2,2,3,4,6,8,11,15];
function kostenVon(a,b){ let t=0; for(let x=a;x<b;x++) t+=PRO_PUNKT[Math.min(9,Math.floor(x/10))]; return t; }

const LADEN = [
  {id:'muskete_gut',art:'ausr',label:'Sorgfältig eingeschossene Muskete',beschr:'Modell 1777 An IX · +8 Muskete, verrostet langsamer',vp:40},
  {id:'schuhe_gut',art:'ausr',label:'Doppelt besohlte Schuhe',beschr:'Halber Marschverschleiß — der unterschätzte Kauf',vp:40},
  {id:'tornister_gut',art:'ausr',label:'Verstärkter Tornister',beschr:'Mehr Patronen und zwei Tage Proviant',vp:24},
  {id:'bajonett_gut',art:'ausr',label:'Geschliffenes Bajonett',beschr:'+5 Bajonett',vp:20},
  {id:'flasche',art:'ausr',label:'Feldflasche mit Schnapsvorrat',beschr:'Belastung sinkt im Winterquartier',vp:15},
  {id:'geld',art:'geld',label:'50 Francs Startgeld',beschr:'Bares in der Tasche',vp:15},
  {id:'amulett',art:'ausr',label:'Amulett',beschr:'+5 Kaltblütigkeit. Wirkt, weil du glaubst, dass es wirkt.',vp:12}
];
