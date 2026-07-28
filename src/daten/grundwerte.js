'use strict';
/* Grundwerte: Attribute, Fertigkeiten, Ränge, Herkünfte, Ausrüstung, Kaufladen.
   Reine Daten. Wer hier Zahlen ändert, trägt sie in CLAUDE.md nach. */

/* ══════════════════ DATEN ══════════════════ */

/* Dritter Eintrag ist der Erklärtext, der beim Überfahren erscheint. Er sagt,
   was der Wert im Spiel tut — nicht, was er bedeutet. Wo ein Wert in diesem
   Kapitel noch nichts tut, steht das auch da. */
const ATTRIBUTE = [
  ['konstitution','Konstitution','Was du aushältst. Bestimmt deinen Lebensvorrat — 40 plus drei Fünftel deiner Konstitution —, also wie viele Treffer du wegsteckst, bevor einer zu viel ist. Der Atem steigt nie über das Leben: Wer zerschossen ist, bekommt auch keine Luft. Und ob dich die Grenadiere nehmen; sie verlangen 55.'],
  ['geschick','Geschick','Hände und Füße. Laden unter Beschuss, Deckung wechseln, Ausrüstung flicken. Die Voltigeure verlangen 55.'],
  ['kaltbluetigkeit','Kaltblütigkeit','Ob du stehen bleibst, wenn die Linie steht. Wird geprüft, wenn es darauf ankommt, und nie vorher.'],
  ['autoritaet','Autorität','Ob acht Männer tun, was du sagst. Als Fusilier ohne Wirkung, ab dem Caporal das Wichtigste.'],
  ['bildung','Bildung','Lesen, schreiben, rechnen. Du kannst es nicht — und ab dem Caporal-fourrier geht es ohne nicht weiter.'],
  ['menschenkenntnis','Menschenkenntnis','Wer redet, wer schweigt, wer dich deckt. Öffnet Wege durch Szenen, die andere nicht sehen.']
];
const FERTIGKEITEN = [
  ['muskete','Muskete','Treffen im Rauch. Die wichtigste Zahl im Gefecht — und die einzige, die vom Zustand deiner Waffe abhängt.'],
  ['bajonett','Bajonett','Der Angriff auf zehn Schritt. Richtet mehr an als jeder Schuss und bringt dich weit nach vorn, wo es am gefährlichsten ist.'],
  ['reiten','Reiten','Pferde führen und beruhigen — auf dem Rückzug durch den Sinai zählt es zum ersten Mal. Richtig wichtig ab den Rängen, die ein eigenes Pferd bekommen.'],
  ['drill','Drill','Handgriffe ohne Nachdenken. Hält die Linie und schließt Lücken, wenn du Männer zu befehligen hast.'],
  ['taktik','Taktik','Gelände lesen, Absichten erkennen. Kommt in Szenen vor, zählt aber erst in den höheren Rängen richtig.'],
  ['kartenkunde','Kartenkunde','Eine Karte lesen können. In der Wüste rettet das Kilometer, später ganze Kolonnen — für den General ist es alles.'],
  ['verwaltung','Verwaltung','Listen, Rationen, Kompaniekasse. Der Weg zum Caporal-fourrier führt hier entlang.'],
  ['fouragieren','Fouragieren','Essen finden, wo keins ist. Hält dich und deine Kameradschaft am Leben, wenn der Nachschub ausbleibt.'],
  ['feldchirurgie','Feldchirurgie','In diesem Kapitel noch ohne Verwendung. Später der Unterschied zwischen einer Wunde und einem Grab.']
];
const NAMEN = ATTRIBUTE.concat(FERTIGKEITEN).reduce((o,[k,n])=>(o[k]=n,o),{});
const ERKLAERUNG = ATTRIBUTE.concat(FERTIGKEITEN).reduce((o,[k,,e])=>(o[k]=e||'',o),{});

/* Ein Wort mit Erklärung beim Überfahren. Reines CSS, keine Abhängigkeit. */
function mitHilfe(k, beschriftung){
  const e = ERKLAERUNG[k];
  return e ? `<span class="hilfe" data-hilfe="${String(e).replace(/"/g,'&quot;')}">${beschriftung}</span>` : beschriftung;
}

const RANG = [
  {n:1,name:'Fusilier',wert:0},{n:2,name:'Grenadier',wert:12},{n:3,name:'Caporal',wert:26},
  {n:4,name:'Caporal-fourrier',wert:42},{n:5,name:'Sergent',wert:62}
];
function rangNameVon(mann){
  if(mann.rang===2) return mann.zweig==='voltigeur' ? 'Voltigeur' : 'Grenadier';
  const r=RANG.find(r=>r.n===mann.rang); return r?r.name:'Fusilier';
}
function rangName(n){ return rangNameVon({rang:n, zweig:S?S.zweig:null}); }
function rangWert(n){ const r=RANG.find(r=>r.n===n); return r?r.wert:0; }

/* Rangabzeichen, so wie man es am Ärmel oder auf der Schulter trägt.
   Der Fusilier trägt nichts — das ist der Witz an ihm. Die Elitekompanien
   erkennt man an der Epaulette (Grenadier rot, Voltigeur grüngelb), die
   Unteroffiziere an den Streifen am Unterarm: Caporal zwei aus Wolle,
   Caporal-fourrier zusätzlich einen quer, Sergent einen aus Tresse. */
function rangabzeichen(mann){
  const r = mann.rang, hoehe = 23;
  const rahmen = i => `<svg class="abzeichen" viewBox="0 0 36 24" role="img" aria-label="Rangabzeichen">
    <rect x="0" y="0" width="36" height="24" rx="2" fill="#26221c" stroke="#3a342c"/>${i}</svg>`;

  if(r===2){                                   // Epaulette auf der Schulter
    const f = mann.zweig==='voltigeur' ? '#9aa85c' : '#c2483a';
    const fransen = [10,14,18,22,26].map(x=>`<rect x="${x}" y="13" width="2" height="7" rx="1"/>`).join('');
    return rahmen(`<rect x="7" y="5" width="22" height="7" rx="3.5" fill="${f}"/>
      <g fill="${f}" opacity=".8">${fransen}</g>`);
  }
  if(r>=3){                                    // Streifen am Unterarm
    const tresse = r>=5;
    const f = tresse ? '#d0a75e' : '#c98a3a';  // Tresse in Metallfarbe, Wolle in Aurore
    const streifen = tresse
      ? `<polygon points="11,19 22,5 29,5 18,19" fill="${f}"/>`
      : `<polygon points="7,19 16,5 21,5 12,19" fill="${f}"/>
         <polygon points="16,19 25,5 30,5 21,19" fill="${f}"/>`;
    const quer = r===4 ? `<rect x="6" y="2.5" width="24" height="2.6" rx="1.3" fill="${f}" opacity=".85"/>` : '';
    return rahmen(streifen + quer);
  }
  return '';                                   // Fusilier: der Ärmel ist leer
}

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
   text:'Reiten +20 · Verwaltung +20 · Konstitution +15 · Kaltblütigkeit −5',
   attr:{konstitution:15,kaltbluetigkeit:-5}, fert:{reiten:20,verwaltung:20}},
  {id:'schreiber',name:'Schreibergehilfe',
   text:'Bildung +25 · Verwaltung +25 · Kartenkunde +10 · Konstitution −10',
   attr:{bildung:25,konstitution:-10}, fert:{verwaltung:25,kartenkunde:10}},
  {id:'strasse',name:'Straßenjunge aus Paris',
   text:'Menschenkenntnis +25 · Kaltblütigkeit +20 · Fouragieren +20 · Bildung −15',
   attr:{menschenkenntnis:25,kaltbluetigkeit:20,bildung:-15}, fert:{fouragieren:20}}
];

/* Die elf Kampagnen. Nur die erste ist gebaut; die übrigen stehen so im
   KONZEPT.md und werden im Verlauf links angezeigt, damit man sieht, wie lang
   der Weg ist. Jede Kapiteldatei trägt ihre Stationen selbst in STATIONEN ein. */
const KAMPAGNEN = [
  {id:'italien',    nr:1,  name:'Italien',        jahre:'1796–97', kurz:'Barfuß, hungrig, siegreich.',                 gebaut:true},
  {id:'aegypten',   nr:2,  name:'Ägypten',        jahre:'1798–99', kurz:'Hitze, Krankheit, Karrees gegen Mamluken.'},
  {id:'garnison',   nr:3,  name:'Garnison',       jahre:'1800–04', kurz:'Ruhe. Bildung nachholen, Beziehungen knüpfen.'},
  {id:'austerlitz', nr:4,  name:'Austerlitz',     jahre:'1805',    kurz:'Die perfekte Schlacht.'},
  {id:'jena',       nr:5,  name:'Jena–Auerstedt', jahre:'1806',    kurz:'Tempo, Verfolgung, Marschstrapazen.'},
  {id:'eylau',      nr:6,  name:'Eylau & Friedland', jahre:'1807', kurz:'Schnee und Massenverluste. Viele Vakanzen.'},
  {id:'spanien',    nr:7,  name:'Spanien',        jahre:'1808–12', kurz:'Guerilla. Kein Ruhm, nur Repressalien.'},
  {id:'russland',   nr:8,  name:'Russland',       jahre:'1812',    kurz:'Kein Feldzug, ein Überlebensspiel.'},
  {id:'deutschland',nr:9,  name:'Deutschland',    jahre:'1813',    kurz:'Wiederaufbau aus Rekruten. Leipzig.'},
  {id:'frankreich', nr:10, name:'Frankreich',     jahre:'1814',    kurz:'Verteidigung der Heimat, Abdankung.'},
  {id:'hunderttage',nr:11, name:'Hundert Tage',   jahre:'1815',    kurz:'Waterloo. Epilog je nach Rang.'}
];
const STATIONEN = {};

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
  {id:'mantel_gut',art:'ausr',label:'Beutemantel, gewachst',beschr:'Ein Mantel überhaupt — kalte Nächte, Wüste, später Russland',vp:30},
  {id:'flasche',art:'ausr',label:'Feldflasche mit Schnapsvorrat',beschr:'Belastung sinkt im Winterquartier',vp:15},
  {id:'geld',art:'geld',label:'50 Francs Startgeld',beschr:'Bares in der Tasche',vp:15},
  {id:'amulett',art:'ausr',label:'Amulett',beschr:'+5 Kaltblütigkeit. Wirkt, weil du glaubst, dass es wirkt.',vp:12}
];
