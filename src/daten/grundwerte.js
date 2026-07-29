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
  ['feldchirurgie','Feldchirurgie','Blut stillen, halten, zunähen. Zählt am Verbandsplatz nach dem Gefecht und bei den Kranken am Sinai — später der Unterschied zwischen einer Wunde und einem Grab.']
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
  {n:4,name:'Caporal-fourrier',wert:42},{n:5,name:'Sergent',wert:62},
  {n:6,name:'Sergent-major',wert:88}
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
    <rect x="0" y="0" width="36" height="24" rx="2" fill="#ddd0af" stroke="#b3a382"/>${i}</svg>`;

  if(r===2){                                   // Epaulette auf der Schulter
    const f = mann.zweig==='voltigeur' ? '#6f7d33' : '#9c3125';
    const fransen = [10,14,18,22,26].map(x=>`<rect x="${x}" y="13" width="2" height="7" rx="1"/>`).join('');
    return rahmen(`<rect x="7" y="5" width="22" height="7" rx="3.5" fill="${f}"/>
      <g fill="${f}" opacity=".8">${fransen}</g>`);
  }
  if(r>=3){                                    // Streifen am Unterarm
    const tresse = r>=5;
    const f = tresse ? '#8a6410' : '#a86a20';  // Tresse in Metallfarbe, Wolle in Aurore
    /* Der Sergent-major trägt **zwei** Tressen aus Metallfaden — historisch
       genau der Unterschied zum Sergenten, und auf 36 Pixel der einzige, den
       man sehen kann. */
    const streifen = r>=6
      ? `<polygon points="6,19 17,5 22,5 11,19" fill="${f}"/>
         <polygon points="17,19 28,5 33,5 22,19" fill="${f}"/>`
      : tresse
      ? `<polygon points="11,19 22,5 29,5 18,19" fill="${f}"/>`
      : `<polygon points="7,19 16,5 21,5 12,19" fill="${f}"/>
         <polygon points="16,19 25,5 30,5 21,19" fill="${f}"/>`;
    const quer = r===4 ? `<rect x="6" y="2.5" width="24" height="2.6" rx="1.3" fill="${f}" opacity=".85"/>` : '';
    return rahmen(streifen + quer);
  }
  return '';                                   // Fusilier: der Ärmel ist leer
}

/* ══════════════════ DIE KETTE ÜBER DIR ══════════════════

   Vier Männer, die ganze Laufbahn lang dieselben. Das ist der Kern: **Wer über
   dir steht, bleibt über dir — weil er selbst aufsteigt.** Martel ist dein
   Sergent, solange du Füsilier bist; wirst du selbst Sergent, ist er längst
   Sergent-major und immer noch dein Vorgesetzter. Man lernt in einer Karriere
   vier Gesichter kennen, nicht vierzehn.

   Ein neues Gesicht gibt es nur, wenn eines fällt — und dann fängt man bei
   Gunst 0 wieder an. Genau deshalb pflegt man zwei Beziehungen und nicht eine
   (KONZEPT §7: „Dein Gönner stirbt bei Eylau, und dein halber aufgebauter
   Einfluss ist weg").

   `stufen` ist die Rangfolge der Person selbst: Index 0, bis sie aufrückt.
   Die Gunst läuft von −5 bis +5 (KONZEPT §8) — negativ heißt, dass jemand
   über dir etwas gegen dich hat, und das blockt. */
const LEUTE = [
  {id:'martel', kurz:'Martel', stufen:['Sergent','Sergent-major'],
   was:'Dein Sergent. Er hat dich im April über die Pässe gebracht und weiß, wer bei Lodi wo gestanden hat.'},
  {id:'collot', kurz:'Collot', stufen:['Fourier','Sergent-fourrier'],
   was:'Der Schreiber der Kompanie. Er führt die Listen, und in den Listen steht, wer Schuhe bekommt.'},
  {id:'berthaud', kurz:'Berthaud', stufen:['Lieutenant','Capitaine'],
   was:'Der Zugführer. Er entscheidet, welche Namen der Capitaine überhaupt zu hören bekommt.'},
  {id:'vernet', kurz:'Vernet', stufen:['Capitaine','Chef de bataillon'],
   was:'Der Kompaniechef. Er kennt deinen Namen erst, wenn ihn jemand nennt.'}
];

/* Nachrücker, wenn einer fällt. Der Nachfolger trägt denselben Posten und
   kennt dich nicht — deshalb Gunst 0 und ein eigener Satz zur Einführung. */
const NACHFOLGER = {
  martel:  [{kurz:'Ricard',  satz:'Ricard trägt seit heute Morgen die Streifen. Er kommt aus einem anderen Bataillon, kennt hier niemanden und lässt sich nichts sagen.'},
            {kurz:'Dupleix', satz:'Dupleix war gestern noch Caporal in der zweiten Kompanie. Er tut, als wäre er es nie gewesen.'}],
  collot:  [{kurz:'Sarrazin', satz:'Der neue Fourier heißt Sarrazin und rechnet schneller als sein Vorgänger. Das ist keine gute Nachricht für die, die auf seiner Liste stehen.'}],
  berthaud:[{kurz:'Mareuil',  satz:'Der neue Lieutenant heißt Mareuil, ist dreiundzwanzig und hat die Epauletten seit vier Tagen. Er sieht über die Köpfe hinweg, wenn er spricht.'}],
  vernet:  [{kurz:'Lassalle', satz:'Der neue Capitaine kommt vom Stab und hat noch keinen seiner Männer nach dem Namen gefragt.'}]
};

function leuteStart(){
  const o = {};
  LEUTE.forEach(l => { o[l.id] = {gunst:0, stufe:0, lebt:true, kurz:l.kurz}; });
  return o;
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
/* `guete` ist die Güte des Gegners und die Eskalation des ganzen Spiels in
   **einer Zahl je Kampagne**. Sie schaltet drei Dinge zugleich (`feindGuete()`
   in `src/kampf.js`): Trefferchance je Runde, wie stark die eigene Linie von
   allein hilft, und wie viele Männer sie dabei verliert.

   Der Sinn: Man wird von Feldzug zu Feldzug stärker (Veteranenpunkte), also
   müssen die Gegner mitwachsen — sonst wird das Spiel mit jedem Lauf leichter,
   statt andere Fragen zu stellen. Die Kurve ist hier **einmal entworfen**,
   damit sie nicht elfmal neu erfunden wird; ein neues Kapitel bringt sie als
   ein Feld mit.

   Italien ist die Eichung (0) — Beaulieus geschlagene Kolonnen laufen von
   allein. **Ägypten steht auf 5**, und das ist ein Sprung, kein Schritt:
   Dschesärs Garnison mit britischen Marineartilleristen und die osmanische
   Landungsarmee bei Abukir laufen nicht weg. Ein Mann im ersten Lauf, der mit
   sechzig Poolpunkten einrückt, stirbt dort mit hoher Wahrscheinlichkeit — das
   ist die Absicht. Wer wiederkommt, bringt Veteranenpunkte mit und schießt
   schneller, und schneller heißt kürzere Gefechte heißt weniger Treffer.

   **Nur Italien (0) und Ägypten (5) sind gemessen.** Die Werte ab Austerlitz
   sind eine entworfene Kurve für Kapitel, die es noch nicht gibt; wer eines
   davon baut, misst seine Güte neu, statt der Zahl zu glauben. */
const KAMPAGNEN = [
  {id:'italien',    nr:1,  name:'Italien',        jahre:'1796–97', guete:0, kurz:'Barfuß, hungrig, siegreich.',                 gebaut:true},
  {id:'aegypten',   nr:2,  name:'Ägypten',        jahre:'1798–99', guete:5, kurz:'Hitze, Krankheit, Karrees gegen Mamluken.'},
  {id:'garnison',   nr:3,  name:'Garnison',       jahre:'1801–04', guete:0, kurz:'Ruhe. Bildung nachholen, Beziehungen knüpfen.'},
  {id:'austerlitz', nr:4,  name:'Austerlitz',     jahre:'1805',    guete:6, kurz:'Die perfekte Schlacht.'},
  {id:'jena',       nr:5,  name:'Jena–Auerstedt', jahre:'1806',    guete:7, kurz:'Tempo, Verfolgung, Marschstrapazen.'},
  {id:'eylau',      nr:6,  name:'Eylau & Friedland', jahre:'1807', guete:8, kurz:'Schnee und Massenverluste. Viele Vakanzen.'},
  {id:'spanien',    nr:7,  name:'Spanien',        jahre:'1808–12', guete:8, kurz:'Guerilla. Kein Ruhm, nur Repressalien.'},
  {id:'russland',   nr:8,  name:'Russland',       jahre:'1812',    guete:10, kurz:'Kein Feldzug, ein Überlebensspiel.'},
  {id:'deutschland',nr:9,  name:'Deutschland',    jahre:'1813',    guete:10, kurz:'Wiederaufbau aus Rekruten. Leipzig.'},
  {id:'frankreich', nr:10, name:'Frankreich',     jahre:'1814',    guete:11, kurz:'Verteidigung der Heimat, Abdankung.'},
  {id:'hunderttage',nr:11, name:'Hundert Tage',   jahre:'1815',    guete:12, kurz:'Waterloo. Epilog je nach Rang.'}
];
const STATIONEN = {};

/* ══════════════════ ORDEN UND AUSZEICHNUNGEN ══════════════════

   **Nennungen im Tagesbefehl waren bis zum 28.07.2026 eine Zahl ohne Folge.**
   Orden sind die Folge — und sie zahlen in drei Währungen zugleich, damit sie
   sich nicht wie Deko anfühlen:

     `vp`      in der Wertung (KONZEPT §5 hält die Plätze frei)
     `ruf`     einmalig beim Verleihen — wer das Kreuz trägt, ist bekannt
     `pension` Francs je Station, lebenslang. Historisch der eigentliche Wert:
               Die Ehrenlegion war eine Rente, kein Blech.

   **Historisch trägt sich der Bogen selbst.** Die Ehrenwaffen (armes d'honneur)
   wurden 1799–1802 an einfache Soldaten für einzelne Taten vergeben — genau die
   Jahre von Ägypten. Wer eine besaß, wurde bei der Stiftung der Ehrenlegion
   **von Rechts wegen aufgenommen**, ohne weitere Prüfung. Die erste große
   Verleihung war das Lager von Boulogne am 16. August 1804: Kapitel 3.

   Ein Orden ist damit die einzige Auszeichnung im Spiel, die man sich in einem
   Kapitel verdient und in einem anderen einlöst. */
const ORDEN = [
  {id:'ehrenwaffe', name:'Ehrenwaffe', voll:'Fusil d\'honneur',
   ab:'1799', vp:10, ruf:6, pension:0.5,
   was:'Eine Muskete mit graviertem Schloss und deinem Namen darauf, verliehen im Namen der Konsuln. Sie schießt nicht besser. Sie sagt nur jedem, der sie sieht, was du getan hast.',
   bedingung:'Drei Nennungen im Tagesbefehl'},

  /* Der Ehrensäbel ist die goldene Ehrenwaffe — historisch seltener und
     wertvoller als das Gewehr, vergeben für eine einzelne, benannte Tat. Er
     gibt der Sondermissions-Kette, der gefährlichsten Handlung im Spiel,
     endlich einen eigenen Preis: Wer durch die Bresche von Akkon gegangen ist,
     bekommt nicht dasselbe wie einer, der dreimal aufgefallen ist. */
  {id:'ehrensaebel', name:'Ehrensäbel', voll:'Sabre d\'honneur',
   ab:'1799', vp:14, ruf:8, pension:1.0,
   was:'Ein Säbel mit vergoldetem Gefäß und einer Gravur, die den Tag nennt und den Ort. Der Waffenmeister sagt, er sei zum Tragen und nicht zum Fechten, und hat unrecht: Er ist zum Angesehenwerden.',
   bedingung:'Eine Sondermission voll bestanden und fünf Nennungen'},

  /* Der erste **fremde** Orden. Gestiftet im Juni 1805 vom Königreich Italien,
     dessen König Napoleon selbst war; an Franzosen nach Austerlitz vergeben.
     KONZEPT §5 hält den Platz frei: „je fremdem Orden +10, höchstens zwei
     gewertet" — die zweite Stelle bleibt für Spanien oder Preußen offen. */
  {id:'eisenkrone', name:'Eiserne Krone', voll:'Ordine della Corona Ferrea',
   ab:'1805', fremd:true, vp:10, ruf:6, pension:0.5,
   was:'Ein Kreuz an dunkelgelbem Band mit grünem Rand, verliehen im Namen eines Königreichs, dessen König derselbe Mann ist, der dich schon einmal ausgezeichnet hat. In der Kompanie heißt es nur „die Lombardische".',
   bedingung:'Eine Meldung an den Oberbefehl und Austerlitz überlebt'},

  {id:'legion', name:'Ehrenlegion', voll:'Légionnaire de la Légion d\'honneur',
   ab:'1804', vp:12, ruf:10, pension:1.0,
   was:'Ein weißes Emailkreuz an rotem Band, fünfhundert Francs im Jahr und das Recht, vor jedem Offizier gegrüßt zu werden, der es nicht trägt.',
   bedingung:'Eine Ehrenwaffe — oder fünf Nennungen und Ruf 45'}
];
function ordenVon(id){ return ORDEN.find(o=>o.id===id) || null; }
function hatOrden(id){ return !!(S && S.orden && S.orden.includes(id)); }

/* Das Kreuz, wie es am Rock hängt. Wie die Rangabzeichen: ein Bild statt eines
   Wortes, und in derselben Größe, damit die Seitenleiste ruhig bleibt. */
function ordensbild(id){
  if(id==='ehrenwaffe') return `<svg class="abzeichen" viewBox="0 0 36 24" role="img" aria-label="Ehrenwaffe">
    <rect x="0" y="0" width="36" height="24" rx="2" fill="#ddd0af" stroke="#b3a382"/>
    <rect x="6" y="11.2" width="24" height="1.6" rx=".8" fill="#6a6152"/>
    <rect x="5" y="10" width="6" height="4" rx="1" fill="#6e5320"/>
    <circle cx="27" cy="12" r="3" fill="none" stroke="#8a6410" stroke-width="1.4"/></svg>`;
  if(id==='ehrensaebel') return `<svg class="abzeichen" viewBox="0 0 36 24" role="img" aria-label="Ehrensäbel">
    <rect x="0" y="0" width="36" height="24" rx="2" fill="#ddd0af" stroke="#b3a382"/>
    <path d="M8 17 C 16 15, 24 11, 29 6" fill="none" stroke="#5c5446" stroke-width="1.8" stroke-linecap="round"/>
    <rect x="5" y="15" width="5" height="3.4" rx="1.7" fill="#8a6410"/>
    <path d="M7 14.4 C 10 13, 11 16, 8 17.4" fill="none" stroke="#8a6410" stroke-width="1.3"/></svg>`;
  if(id==='eisenkrone') return `<svg class="abzeichen" viewBox="0 0 36 24" role="img" aria-label="Eiserne Krone">
    <rect x="0" y="0" width="36" height="24" rx="2" fill="#ddd0af" stroke="#b3a382"/>
    <rect x="12" y="2" width="12" height="3.4" fill="#c8901f"/>
    <rect x="12" y="2" width="2" height="3.4" fill="#3e5a2c"/>
    <rect x="22" y="2" width="2" height="3.4" fill="#3e5a2c"/>
    <path d="M18 7 L23 13 L18 19 L13 13 Z" fill="#e8e2d4" stroke="#8a8272" stroke-width=".6"/>
    <circle cx="18" cy="13" r="2.4" fill="none" stroke="#6e5320" stroke-width="1.5"/></svg>`;
  if(id==='legion'){
    const arme = [0,90,180,270].map(a=>`<rect x="16.6" y="6" width="2.8" height="12" rx="1.4"
      fill="#f0ece2" stroke="#8a8272" stroke-width=".5" transform="rotate(${a+45} 18 12)"/>`).join('');
    return `<svg class="abzeichen" viewBox="0 0 36 24" role="img" aria-label="Ehrenlegion">
      <rect x="0" y="0" width="36" height="24" rx="2" fill="#ddd0af" stroke="#b3a382"/>
      <rect x="13" y="2" width="10" height="4" fill="#9c3125"/>
      ${arme}<circle cx="18" cy="12" r="2.6" fill="#8a6410"/></svg>`;
  }
  return '';
}

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
  {id:'tornister_gut',art:'ausr',label:'Verstärkter Tornister',beschr:'Mehr Patronen und zwei Tage Proviant — der Anmarsch kostet halb so viel Atem',vp:24},
  {id:'bajonett_gut',art:'ausr',label:'Geschliffenes Bajonett',beschr:'+5 Bajonett',vp:20},
  {id:'mantel_gut',art:'ausr',label:'Beutemantel, gewachst',beschr:'Ein Mantel überhaupt — kalte Nächte, Wüste, später Russland',vp:30},
  {id:'flasche',art:'ausr',label:'Feldflasche mit Schnapsvorrat',beschr:'Belastung sinkt im Winterquartier',vp:15},
  {id:'geld',art:'geld',label:'50 Francs Startgeld',beschr:'Bares in der Tasche',vp:15},
  {id:'amulett',art:'ausr',label:'Amulett',beschr:'+5 Kaltblütigkeit. Wirkt, weil du glaubst, dass es wirkt.',vp:12}
];
