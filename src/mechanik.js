'use strict';
/* Mechanik: Spielzustand, Proben, Fertigkeitswachstum, Verschleiß, Wunden. */

/* ══════════════════ SPIELZUSTAND ══════════════════ */

let META = { vp:0, chronik:[], bestKapitel:{} };
let S = null;
let K = null;      // Kampfzustand
let NODE = 0;

function neuerCharakter(name, herkunftId, attrVerteilung, kaeufe){
  const h = HERKUENFTE.find(x=>x.id===herkunftId);
  const attr = {}; ATTRIBUTE.forEach(([k])=> attr[k] = attrVerteilung[k]);
  const fert = {}; FERTIGKEITEN.forEach(([k])=> fert[k] = 10);
  for(const k in h.attr) attr[k] = Math.max(0, Math.min(100, attr[k] + h.attr[k]));
  for(const k in h.fert) fert[k] = Math.max(0, Math.min(100, fert[k] + h.fert[k]));
  const ausr = AUSRUESTUNG_START();
  let geld = 4;
  (kaeufe||[]).forEach(id=>{
    if(id==='muskete_gut'){ ausr.muskete={name:'Modell 1777 An IX, eingeschossen',zustand:95,verschleiss:12}; fert.muskete+=8; }
    if(id==='bajonett_gut'){ ausr.seitenwaffe={name:'Geschliffenes Bajonett',zustand:95,verschleiss:8}; fert.bajonett+=5; }
    if(id==='schuhe_gut'){ ausr.schuhe={name:'Doppelt besohlte Schuhe',zustand:100,verschleiss:12}; }
    if(id==='tornister_gut'){ ausr.tornister={name:'Verstärkter Tornister',zustand:100,verschleiss:8}; }
    if(id==='geld'){ geld += 50; }
  });
  return {
    name, herkunft:h.name, herkunftId, attr, fert, ausr, geld,
    rang:1, zweig:null, ruf:0, gunst:0, kameradschaft:20, belastung:0,
    atem:100, wunden:[], nennungen:0, kaeufe:kaeufe||[],
    kapitel:0, lebt:true, ende:null, log:[]
  };
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

function probe(k, schwierigkeit){
  const w = wert(k);
  const ziel = Math.max(5, Math.min(95, w - schwierigkeit + 50));
  const wurf = 1 + Math.floor(Math.random()*100);
  nutzen(k, 1);
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
  if(e.wunde) wundeGeben(e.wunde, 8);
}

function wundeGeben(name, abzug){
  S.wunden.push({name, abzug});
  S.belastung = Math.min(100, S.belastung + 6);
}

function verschleiss(faktor){
  for(const k in S.ausr){
    const a = S.ausr[k];
    if(a.verschleiss>0) a.zustand = Math.max(0, a.zustand - Math.round(a.verschleiss*faktor));
  }
}

function toetlich(grund){
  S.lebt = false; S.ende = 'tot'; S.todesart = grund;
}
