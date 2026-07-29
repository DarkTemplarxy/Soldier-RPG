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
/* ── Der Wert heißt anders, sobald du ein Patent hast ──
   Das Bajonett steckt auf einer Muskete, und ab Rang 7 gibt es keine Muskete
   mehr. Der Wert bleibt derselbe — dieselbe Zahl, dieselbe Fertigkeit —, aber
   er heißt **Säbel**, weil das der Gegenstand ist, den du jetzt trägst.

   **Deshalb wird umbenannt statt neu angelegt:** Ein zweiter Nahkampfwert
   würde den ersten entwerten, und ein Grenadier, der zehn Jahre lang gestochen
   hat, soll das mitnehmen. Was er nicht mitnimmt, ist das Weiterüben —
   `nutzen('bajonett')` greift ab Rang 7 nicht mehr (siehe `nutzen()`). */
function wertName(k){
  if(k==='bajonett' && typeof S!=='undefined' && S && S.rang>=7) return 'Säbel';
  return NAMEN[k] || k;
}
const ERKLAERUNG = ATTRIBUTE.concat(FERTIGKEITEN).reduce((o,[k,,e])=>(o[k]=e||'',o),{});

/* Ein Wort mit Erklärung beim Überfahren. Reines CSS, keine Abhängigkeit. */
function mitHilfe(k, beschriftung){
  const e = ERKLAERUNG[k];
  return e ? `<span class="hilfe" data-hilfe="${String(e).replace(/"/g,'&quot;')}">${beschriftung}</span>` : beschriftung;
}

const RANG = [
  {n:1,name:'Fusilier',wert:0},{n:2,name:'Grenadier',wert:12},{n:3,name:'Caporal',wert:26},
  {n:4,name:'Caporal-fourrier',wert:42},{n:5,name:'Sergent',wert:62},
  {n:6,name:'Sergent-major',wert:88},
  /* Die Offiziers- und Stabshälfte. Bis zum 28.07.2026 endete `RANG` bei 6,
     und `rangWert()` lieferte für alles darüber **0** — eine stille
     Fehlwertung, die erst auffiel, als die Leiter über Rang 6 hinauswuchs.
     Werte aus RANGLEITER §7, identisch mit KONZEPT §5. */
  {n:7,name:'Sous-Lieutenant',wert:120},{n:8,name:'Lieutenant',wert:158},
  {n:9,name:'Capitaine',wert:205},{n:10,name:'Chef de bataillon',wert:262},
  {n:11,name:'Colonel',wert:330},{n:12,name:'Général de brigade',wert:408},
  {n:13,name:'Général de division',wert:490},{n:14,name:'Maréchal d\'Empire',wert:580}
];
/* ══════════════════ DER SOLD ══════════════════

   **Francs waren bis zum 28.07.2026 Zierde.** Es gab sie aus Szenen, und der
   Marketender nahm sie — aber es gab keine verlässliche Quelle, also war Geld
   eine Zahl, die man nicht planen konnte. Der Sold ist die Quelle.

   `SOLD` ist der Satz **je Station** in Francs. Die historischen Zahlen: Ein
   Fusilier bekam fünf Sous am Tag, also einen Viertelfranc — und davon ging
   die „masse" ab, aus der Schuhe und Wäsche bezahlt wurden. Was in die Hand
   kam, war fast nichts. Ein Sergent-major bekam gut das Dreifache.

   **Das ist die eine Stelle, an der ein höherer Rang mehr Zahlen gibt statt
   neuer Knöpfe — und sie ist dennoch richtig** (Invariante 4): Sold kauft
   keine Fähigkeit, sondern Ausrüstung, die man auch verlieren kann, und er
   bildet ab, was historisch der greifbarste Unterschied zwischen einem
   Füsilier und einem Unteroffizier war. */
/* Geeicht am Marketender, nicht am Geschichtsbuch. Die historischen fünf Sous
   am Tag wären im Spiel 1,4 Francs für den ganzen Italienfeldzug gewesen —
   korrekt und wirkungslos, also weiterhin Zierde. Maßstab ist stattdessen:
   **Ein Kapitel voller Sold soll ungefähr einen Posten beim Marketender
   kaufen** (8–18 F). Bei ~16 Stationen heißt das für den Füsilier rund 11 F
   bei voller Zahlung — und in Italien, wo zu 30 % gezahlt wird, drei. */
/* ── Ab Rang 7 ist Sold kein Zubrot mehr, sondern ein Haushalt ──
   Ein Offizier bezahlte Uniform, Degen, Pferd und seine Verpflegung im Feld
   selbst; ein Capitaine dazu die Repräsentation, ein Général Stab und
   Equipage. Deshalb springt der Satz bei 7 auf das Dreifache und wächst
   danach steil — und deshalb ist es trotzdem kein Geschenk: Was ein Offizier
   mehr bekommt, gibt er auch wieder aus. Die Ausgabenseite steht bei den
   Rängen selbst (Kompaniekasse ab 9), nicht hier.

   Die Vielfachen folgen RANGLEITER §8: 7–8 dreifach bis vierfach, 9 fünf- bis
   siebenfach, 10–11 acht- bis fünfzehnfach, 12–13 fünfundzwanzig- bis
   vierzigfach, 14 hundertfach. Gerechnet auf den Fusilier-Satz 0,70. */
const SOLD = {1:0.70, 2:0.80, 3:1.00, 4:1.20, 5:1.50, 6:2.00,
              7:2.10, 8:2.80, 9:4.20, 10:5.60, 11:10.50, 12:17.50, 13:28.00, 14:70.00};
function soldSatz(rang){ return SOLD[rang] || SOLD[14]; }

/* ══════════════════ DIE VERLUSTLISTE ══════════════════

   **Ab Rang 7 schreibt man sie selbst.** Wer als Sergent „vier von zwanzig"
   gelesen hat, liest jetzt vier Namen — und das ist der ganze Unterschied.
   Eine Zahl ist ein Ergebnis, ein Name ist ein Mann; das Spiel sagt dazu
   nichts, es druckt nur die Liste, die ein Offizier ohnehin abzuliefern hat.

   Die Namen sind gewöhnliche französische Namen des Jahrgangs, keine Figuren:
   Wer hier steht, wird nicht wiederkommen und hatte auch vorher keine Szene.
   Genau das ist gemeint. */
const MANNSCHAFT = [
  'Barrière','Aubry','Cheval','Delorme','Fabre','Gantier','Hurel','Jourdain',
  'Lavaud','Merle','Nadaud','Ollier','Pichon','Quesnel','Rouvier','Sarrazin',
  'Thibaud','Vasseur','Amiot','Boissel','Carrère','Doumer','Estève','Ferrand',
  'Gaubert','Hénault','Imbert','Joubert','Laffitte','Mazet','Noguès','Perrot',
  'Rabaud','Signoret','Toussaint','Vialar','Bézard','Colomb','Dagorne','Espitalier'
];
function verlustNamen(anzahl, saat){
  const zufall = i => { const x = Math.sin(i*127.1 + saat*311.7)*43758.5453; return x-Math.floor(x); };
  return MANNSCHAFT.map((nm,i)=>[nm, zufall(i)]).sort((a,b)=>a[1]-b[1])
    .slice(0, Math.max(0, Math.min(MANNSCHAFT.length, anzahl))).map(x=>x[0]);
}

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
/* ══════════════════ DIE RANGABZEICHEN ══════════════════

   **Vierzehn Ränge, drei Waffengattungen, kein einziges Bild.** Die Formen
   stammen aus dem Entwurfspaket (`abzeichen/*.svg`); eingebaut sind sie als
   Funktion, die einen SVG-String zurückgibt — sonst brechen `file://`, die
   Einzeldatei-Weitergabe und `werkzeug/bauen.js`.

   **Das Schildchen trägt die Farbe des Rocks**, das Metall die der Gattung:
   Infanterie Gold auf Königsblau, Kavallerie Silber auf Dragonergrün,
   Artillerie Gold auf Dunkelblau mit rotem Vorstoß. **Ab Rang 12 gibt es
   keine Gattung mehr** — ein General ist keiner Waffe mehr zugeordnet, und
   das Schildchen wird selbst golden.

   Die Stufenfolge ist in allen Gattungen dieselbe und erzählt die Laufbahn:
   leer → Epaulette der Elitekompanie → zwei Wollstreifen → plus Querstreifen
   → eine Tresse aus Metallfaden → zwei Tressen → Epaulette mit rotem
   Seidenstreifen → Streifen blass → Epaulette und Contre-Epaulette → dicke
   Fransen → zwei dicke → zwei Sterne → drei Sterne → gekreuzte Stäbe. */
const WAFFE = {
  infanterie: {plate:'#27415f', stroke:'#16283d', wolle:'#d08a2a', tresse:'#e8c469',
               tresseD:'#a8791a', ep:'#e0b552'},
  kavallerie: {plate:'#2c4630', stroke:'#182a1a', wolle:'#d08a2a', tresse:'#dfe3e0',
               tresseD:'#9aa3a0', ep:'#cfd6d2'},
  artillerie: {plate:'#1e2a3f', stroke:'#0f1624', piping:'rgba(156,49,37,.75)',
               wolle:'#9c3125', tresse:'#e8c469', tresseD:'#a8791a', ep:'#e0b552'}
};

/* Die drei Bausteine, aus denen jedes Abzeichen besteht. Sie stehen hier
   einmal statt in vierzehn Vorlagen mehrfach. */
function abzChevron(x1, f, breit){
  const b = breit||9;
  return `<polygon points="${x1},19 ${x1+b},5 ${x1+b+5},5 ${x1+5},19" fill="${f}"/>`;
}
function abzEpaulette(x, w, f, fransen, dick){
  const n = fransen===undefined ? 5 : fransen;
  const fy = dick ? 8 : 6.6, fw = dick ? 3.4 : 1.8, schritt = dick ? 4 : 4;
  let out = `<rect x="${x}" y="5" width="${w}" height="7.4" rx="3.7" fill="${f}"/>`;
  for(let i=0;i<n;i++){
    const fx = x + 5 + i*schritt;
    out += `<rect x="${fx}" y="13" width="${fw}" height="${fy}" rx="${fw/2}" fill="${f}" opacity=".${dick?'85':'8'}"/>`;
  }
  return out;
}
function abzStern(cx, gr){
  const h = (gr||6.8)/2;
  return `<rect x="${cx-h}" y="${12-h}" width="${gr||6.8}" height="${gr||6.8}" transform="rotate(45 ${cx} 12)" fill="url(#pgold)"/>`;
}

function rangabzeichen(mann){
  const r = mann.rang|0;
  if(r < 2) return '';                        // Fusilier: der Ärmel ist leer
  const gold = r >= 12;
  const P = WAFFE[mann.waffe || 'infanterie'] || WAFFE.infanterie;
  const verlauf = `<defs><linearGradient id="pgold" x1="0" y1="0" x2="0.3" y2="1">
    <stop offset="0%" stop-color="#f6ecc8"/><stop offset="34%" stop-color="#e0b552"/>
    <stop offset="70%" stop-color="#c8901f"/><stop offset="100%" stop-color="#8a6410"/></linearGradient></defs>`;
  const grund = gold
    ? `<rect x="0" y="0" width="36" height="24" rx="2" fill="url(#pgold)" stroke="#8a6410"/>
       <rect x="1.2" y="1.2" width="33.6" height="21.6" rx="1.4" fill="none" stroke="rgba(94,66,8,.35)"/>`
    : `<rect x="0" y="0" width="36" height="24" rx="2" fill="${P.plate}" stroke="${P.stroke}"/>
       <rect x="1.2" y="1.2" width="33.6" height="21.6" rx="1.4" fill="none" stroke="${P.piping||'rgba(255,255,255,.10)'}"/>`;

  let i = '';
  if(r === 2){                                 // Elitekompanie: rot oder grüngelb
    i = abzEpaulette(6, 24, mann.zweig==='voltigeur' ? '#6f7d33' : '#9c3125');
  } else if(r === 3){                          // zwei Wollstreifen
    i = abzChevron(6, P.wolle) + abzChevron(15, P.wolle);
  } else if(r === 4){                          // dazu der Querstreifen des Fourriers
    i = abzChevron(6, P.wolle) + abzChevron(15, P.wolle)
      + `<rect x="6" y="2.4" width="24" height="2.6" rx="1.3" fill="${P.wolle}" opacity=".9"/>`;
  } else if(r === 5){                          // eine Tresse aus Metallfaden
    i = `<polygon points="11,19 20,5 25,5 16,19" fill="${P.tresse}"/>
         <polygon points="11,19 20,5 21.4,5 12.4,19" fill="${P.tresseD}" opacity=".5"/>`;
  } else if(r === 6){                          // zwei Tressen — der sichtbare Unterschied
    i = abzChevron(5, P.tresse) + abzChevron(16, P.tresse);
  } else if(r === 7){                          // Epaulette mit rotem Seidenstreifen
    i = abzEpaulette(6, 24, P.ep)
      + `<rect x="8" y="7.6" width="20" height="2" rx="1" fill="#9c3125" opacity=".9"/>`;
  } else if(r === 8){                          // derselbe Streifen, blasser
    i = abzEpaulette(6, 24, P.ep)
      + `<rect x="8" y="7.6" width="20" height="1.2" rx=".6" fill="#9c3125" opacity=".55"/>`;
  } else if(r === 9){                          // Epaulette und Contre-Epaulette
    i = `<rect x="2" y="5" width="9" height="7.4" rx="3.7" fill="${P.ep}" opacity=".85"/>`
      + abzEpaulette(8, 24, P.ep);
  } else if(r === 10 || r === 11){             // dicke Fransen, ab 11 auf beiden Schultern
    if(r === 10){
      i = `<rect x="6" y="5" width="24" height="7.4" rx="3.7" fill="${P.ep}"/>`;
      for(let k=0;k<5;k++) i += `<rect x="${9.6+k*4}" y="13" width="3.4" height="8" rx="1.7" fill="${P.ep}" opacity=".85"/>`;
    } else {
      i = '';
      for(const x0 of [1.6, 22]){
        i += `<rect x="${x0}" y="5" width="12" height="7.4" rx="3.7" fill="${P.ep}"/>`;
        for(let k=0;k<3;k++) i += `<rect x="${x0+1.4+k*3.4}" y="12.4" width="3.2" height="8" rx="1.6" fill="${P.ep}" opacity=".85"/>`;
      }
    }
  } else if(r === 12){                         // zwei Sterne auf dem Balken
    i = `<rect x="5" y="9" width="26" height="6" rx="3" fill="#1e3350" opacity=".92"/>`
      + abzStern(13) + abzStern(23);
  } else if(r === 13){                         // drei Sterne
    i = `<rect x="4" y="9" width="28" height="6" rx="3" fill="#1e3350" opacity=".92"/>`
      + abzStern(11, 6.4) + abzStern(18, 6.4) + abzStern(25, 6.4);
  } else {                                     // der Marschallstab: gekreuzte Stäbe
    i = `<g stroke="#1e3350" stroke-width="3.4" stroke-linecap="round">
        <line x1="9" y1="18" x2="27" y2="6"/><line x1="27" y1="18" x2="9" y2="6"/></g>`
      + abzStern(18, 7.2)
      + [[9,6],[27,6],[9,18],[27,18]].map(([cx,cy])=>`<circle cx="${cx}" cy="${cy}" r="1.9" fill="#1e3350"/>`).join('');
  }
  return `<svg class="abzeichen" viewBox="0 0 36 24" role="img" aria-label="Rangabzeichen">${verlauf}${grund}${i}</svg>`;
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
  {id:'collot', kurz:'Collot', stufen:['Fourier','Sergent-fourrier','Adjudant'],
   was:'Der Schreiber der Kompanie. Er führt die Listen, und in den Listen steht, wer Schuhe bekommt.'},
  {id:'berthaud', kurz:'Berthaud', stufen:['Lieutenant','Capitaine','Chef de bataillon'],
   was:'Der Zugführer. Er entscheidet, welche Namen der Capitaine überhaupt zu hören bekommt.'},
  {id:'vernet', kurz:'Vernet', stufen:['Capitaine','Chef de bataillon','Colonel'],
   was:'Der Kompaniechef. Er kennt deinen Namen erst, wenn ihn jemand nennt.'},

  /* ── Der fünfte Mann, und warum er dich kennt ──
     Er kommt nicht aus dem Nichts: **Du hast ihn 1796 aus einem Sumpf
     gezogen.** Wer die Arcole-Sondermission besteht, zieht dort nicht nur den
     General heraus, sondern auch dessen Adjutanten — einen jungen Chef de
     bataillon, der nichts sagt und sich den Namen aufschreibt.

     Danach kommt er zwölf Spieljahre lang nicht mehr vor. Ab Rang 9 taucht er
     wieder auf, und wer damals bestanden hat, beginnt bei ihm mit **Gunst +2**
     und einem Satz, der zeigt, dass er sich erinnert. Wer die Kette nie
     gespielt oder verfehlt hat, trifft ihn kalt bei null.

     **Es ist die einzige Stelle im Spiel, an der eine Entscheidung aus dem
     ersten Kapitel zwanzig Spieljahre später eine mechanische Folge hat — und
     sie wird nirgends angekündigt.** Sie wird nur eingelöst. */
  {id:'grandmaison', kurz:'Grandmaison', ab:9,
   stufen:['Chef de bataillon','Colonel','Général de brigade','Général de division'],
   was:'Der General. Ob er deinen Namen kennt, hat sich vor zwölf Jahren entschieden, an einem Damm im Sumpf.'}
];

/* Nachrücker, wenn einer fällt. Der Nachfolger trägt denselben Posten und
   kennt dich nicht — deshalb Gunst 0 und ein eigener Satz zur Einführung. */
const NACHFOLGER = {
  grandmaison:[{kurz:'D\'Aubigny', satz:'Der neue Divisionsgeneral heißt d\'Aubigny, ist neunundvierzig und hat den größten Teil des Krieges in Ministerien verbracht. Er kennt deinen Namen aus einer Liste und sonst nirgendwoher.'}],
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
  {id:'italien',    nr:1,  name:'Italien',        jahre:'1796–97', guete:0, sold:0.3, kurz:'Barfuß, hungrig, siegreich.',                 gebaut:true},
  {id:'aegypten',   nr:2,  name:'Ägypten',        jahre:'1798–99', guete:5, sold:0.5, kurz:'Hitze, Krankheit, Karrees gegen Mamluken.'},
  {id:'garnison',   nr:3,  name:'Garnison',       jahre:'1801–04', guete:0, sold:1.0, kurz:'Ruhe. Bildung nachholen, Beziehungen knüpfen.'},
  {id:'austerlitz', nr:4,  name:'Austerlitz',     jahre:'1805',    guete:6, sold:0.9, kurz:'Die perfekte Schlacht.'},
  {id:'jena',       nr:5,  name:'Jena–Auerstedt', jahre:'1806',    guete:7, sold:0.8, kurz:'Tempo, Verfolgung, Marschstrapazen.'},
  {id:'eylau',      nr:6,  name:'Eylau & Friedland', jahre:'1807', guete:8, sold:0.6, kurz:'Schnee und Massenverluste. Viele Vakanzen.'},
  {id:'spanien',    nr:7,  name:'Spanien',        jahre:'1808–12', guete:8, sold:0.7, aderlass:4, kurz:'Guerilla. Kein Ruhm, nur Repressalien.'},
  {id:'russland',   nr:8,  name:'Russland',       jahre:'1812',    guete:10, sold:0.1, aderlass:8, verschleiss:2, kurz:'Kein Feldzug, ein Überlebensspiel.'},
  {id:'deutschland',nr:9,  name:'Deutschland',    jahre:'1813',    guete:10, sold:0.4, rekruten:25, kurz:'Wiederaufbau aus Rekruten. Leipzig.'},
  {id:'frankreich', nr:10, name:'Frankreich',     jahre:'1814',    guete:11, sold:0.2, rekruten:20, kurz:'Verteidigung der Heimat, Abdankung.'},
  {id:'hunderttage',nr:11, name:'Hundert Tage',   jahre:'1815',    guete:12, sold:1.0, kurz:'Waterloo. Epilog je nach Rang.'}
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
/* ══════════════════ DIE TAPFERKEITSMEDAILLEN ══════════════════

   **Drei Stufen an Zählern, die es längst gibt und die bisher nichts taten.**
   `S.nennungen`, `S.bulletins` und `S.belobigungen` liefen seit der Leiter der
   Sichtbarkeit mit; gezählt wurde, ausgezahlt nicht. Sie sind der natürliche
   Ort für eine Auszeichnung, die man sich im Gefecht verdient und nicht in
   einer Kanzlei.

   **Die Form trägt die Klasse** (Bündel 5 des Entwurfspakets): Ein Staatsorden
   ist ein Kreuz am Band, eine Gefechtsauszeichnung eine geprägte Scheibe an
   der Trikolore, eine Ehrenwaffe ein Stück auf einem gravierten Täfelchen.
   Man erkennt die Klasse, bevor man den Namen liest — deshalb wird keine
   dieser drei Formen für eine andere verwendet.

   **Sie stapeln nicht.** Wer Silber bekommt, legt Bronze ab; im Livret steht
   nur die höchste Stufe. Eine Reihe von drei Scheiben derselben Prägung wäre
   eine Sammlung, und Sammlungen gibt es in diesem Spiel nicht. */
const METALL = {
  gold:   {hell:'#f6ecc8', mid:'#e0b552', tief:'#c8901f', dunkel:'#8a6410', tinte:'#5e4208'},
  silber: {hell:'#f2f5f4', mid:'#dfe3e0', tief:'#c3cac7', dunkel:'#8d9794', tinte:'#41504c'},
  bronze: {hell:'#e7c39c', mid:'#c98f5c', tief:'#a8703c', dunkel:'#7a4f28', tinte:'#4a2d16'}
};
/* Welche Stufe eine andere ablöst. Steht hier und nicht in `ordenFaellig()`,
   weil es eine Eigenschaft der Auszeichnung ist und keine der Vergabe. */
const TAPFER_REIHE = ['tapfer_bronze','tapfer_silber','tapfer_gold'];

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
   bedingung:'Eine Ehrenwaffe — oder fünf Nennungen und Ruf 45'},

  /* Der zweite Grad. Historisch war der Sprung vom Légionnaire zum Officier an
     den Rang gebunden: Mannschaften wurden Légionnaire, Offiziere Officier.
     Deshalb setzt er den ersten Grad *und* ein Patent voraus — er ist keine
     zweite Auszeichnung, sondern dieselbe eine Stufe höher. Die Pension
     verdoppelt sich, und das war der eigentliche Unterschied: zweitausend
     Francs im Jahr statt fünfhundert. */
  {id:'legion_offizier', name:'Offizier der Ehrenlegion', voll:'Officier de la Légion d\'honneur',
   ab:'1807', vp:12, ruf:10, pension:2.0,
   was:'Dasselbe Kreuz, größer, an einem Band mit Rosette. Zweitausend Francs im Jahr, und in einer Liste, die in Paris geführt wird, steht dein Name jetzt in der zweiten Spalte statt in der ersten.',
   bedingung:'Die Ehrenlegion, ein Patent und acht Nennungen'}
];
function ordenVon(id){ return ORDEN.find(o=>o.id===id) || null; }
function hatOrden(id){ return !!(S && S.orden && S.orden.includes(id)); }

/* Das Kreuz, wie es am Rock hängt. Wie die Rangabzeichen: ein Bild statt eines
   Wortes, und in derselben Größe, damit die Seitenleiste ruhig bleibt. */
/* Die drei Tapferkeitsstufen. Sie stehen am Ende der Liste, weil sie die
   jüngste Zutat sind — die Reihenfolge in `ORDEN` bestimmt nichts. */
ORDEN.push(
  {id:'tapfer_bronze', name:'Tapferkeitsmedaille in Bronze', voll:'Médaille de la valeur · bronze',
   ab:'1796', metall:'bronze', stufe:1, vp:4, ruf:2, pension:0,
   was:'Eine geprägte Scheibe an der Trikolore, gekreuzte Musketen darauf. Sie wird nicht verliehen, sie wird ausgegeben — der Fourrier hat einen Karton davon, und wessen Name im Tagesbefehl stand, bekommt eine.',
   bedingung:'Einmal im Tagesbefehl genannt'},
  {id:'tapfer_silber', name:'Tapferkeitsmedaille in Silber', voll:'Médaille de la valeur · argent',
   ab:'1796', metall:'silber', stufe:2, vp:8, ruf:4, pension:0,
   was:'Dieselbe Scheibe in Silber. Der Karton des Fourriers hat davon vier, und er weiß, wer sie bekommt, bevor die Liste kommt.',
   bedingung:'Einmal im Bulletin der Großen Armee'},
  {id:'tapfer_gold', name:'Tapferkeitsmedaille in Gold', voll:'Médaille de la valeur · or',
   ab:'1796', metall:'gold', stufe:3, vp:12, ruf:6, pension:0.5,
   was:'Dieselbe Scheibe in Gold. Es gibt keinen Karton dafür; sie kommt einzeln, in Papier gewickelt, und der Capitaine übergibt sie selbst.',
   bedingung:'Lob vor der Front, ein Bulletin und eine Kette ohne einen einzigen Fehlschlag'}
);

/* ── Die geprägte Scheibe an der Trikolore ──
   **Die Aufhängung ist die halbe Arbeit**, und kein Bauteil darf frei
   schweben: Band → Steg → Ring → Scheibe, von oben nach unten. Die Scheibe
   wird **zuerst** gezeichnet und Steg und Ring darauf — sonst schneidet sie
   den Ring aus. Das war beim Entwerfen der häufigste Fehler. */
function tapferBild(metall){
  const M = METALL[metall] || METALL.bronze;
  const gid = 'm'+metall;
  return `<svg class="orden" viewBox="0 0 120 150" role="img" aria-label="Tapferkeitsmedaille">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="${M.hell}"/><stop offset="32%" stop-color="${M.mid}"/>
      <stop offset="70%" stop-color="${M.tief}"/><stop offset="100%" stop-color="${M.dunkel}"/></linearGradient></defs>
    <rect x="38" y="0" width="44" height="50" fill="#27415f"/>
    <rect x="52" y="0" width="16" height="50" fill="#e8e0cd"/>
    <rect x="68" y="0" width="14" height="50" fill="#9c3125"/>
    <circle cx="60" cy="108" r="36" fill="url(#${gid})"/>
    <circle cx="60" cy="108" r="29" fill="${M.mid}" opacity=".45"/>
    <circle cx="60" cy="108" r="31.5" fill="none" stroke="${M.dunkel}" stroke-width="1.6" opacity=".55"/>
    ${[-26,26].map(w=>`<g transform="rotate(${w} 60 108)">
      <rect x="59.2" y="82" width="1.9" height="52" fill="${M.tinte}" opacity=".78"/>
      <rect x="57.6" y="122" width="5" height="12" rx="2" fill="${M.tinte}" opacity=".62"/>
      <rect x="58.4" y="78" width="3.4" height="6" rx="1.2" fill="${M.tinte}" opacity=".5"/></g>`).join('')}
    <rect x="50" y="46" width="20" height="11" rx="2" fill="url(#${gid})"/>
    <circle cx="60" cy="68" r="6.5" fill="none" stroke="url(#${gid})" stroke-width="3.2"/>
  </svg>`;
}

/* ── Das Gold, in dem jede Fassung, jeder Steg und jeder Ring gezeichnet ist ──
   Ein Verlauf je Bild, weil zwei Bilder auf derselben Seite sonst um dieselbe
   `id` streiten. */
function ordenGold(gid){
  const M = METALL.gold;
  return `<linearGradient id="${gid}" x1="0" y1="0" x2="0.35" y2="1">
    <stop offset="0%" stop-color="#f0dfae"/><stop offset="30%" stop-color="${M.mid}"/>
    <stop offset="68%" stop-color="${M.tief}"/><stop offset="100%" stop-color="${M.dunkel}"/></linearGradient>`;
}

/* ── Die Aufhängung: Band, Steg, Ring ──
   Dieselbe Reihenfolge wie bei der Tapferkeitsscheibe und aus demselben Grund:
   **kein Bauteil darf frei schweben.** Das Band läuft von der Oberkante bis
   `y 56`, der Steg überlappt es, der Ring hängt am Steg, und was darunter
   kommt, wird zuerst gezeichnet, damit es den Ring nicht ausschneidet. */
function ordenBand(gid, rosette){
  return `<rect x="57" y="50" width="6" height="12" rx="3" fill="url(#${gid})"/>
    ${rosette||''}<circle cx="60" cy="62" r="7.5" fill="none" stroke="url(#${gid})" stroke-width="3.6"/>`;
}

/* ── Die vier weißen Emailarme ──
   **Der Arm läuft nach außen breiter zu, und das ist keine Zierde, sondern der
   Grund, warum man vier Arme sieht statt zwei.** Ein Balken, der durch die
   Mitte geht, ist nach einer Drehung um 180° derselbe Balken; vier davon bei
   45° · 135° · 225° · 315° ergeben deshalb ein X aus zwei Strichen und kein
   Kreuz. Gezeichnet wird jeder Arm daher **vom Mittelpunkt nach außen** — als
   Trapez, schmal innen, breit an der Spitze. Das ist zugleich die Form, die
   die Sterne der Zeit wirklich hatten. */
function ordenKreuz(cy, innen, aussen, strich){
  const hi = innen * 1.1, ha = aussen * 0.38;
  const punkte = `${-hi},${-innen} ${hi},${-innen} ${ha},${-aussen} ${-ha},${-aussen}`;
  return [45,135,225,315].map(a=>`<polygon points="${punkte}" fill="#f7f4ec"
    stroke="#8a8272" stroke-width="${strich}" stroke-linejoin="round"
    transform="translate(60 ${cy}) rotate(${a})"/>`).join('');
}

/* ── Das gravierte Täfelchen ──
   Eine Ehrenwaffe ist kein Orden, den man anlegt, sondern ein **Gegenstand mit
   deinem Namen darauf**. Deshalb hängt sie an keinem Band, sondern liegt auf
   einem Kärtchen mit Doppellinie — derselbe Vordruck wie die amtlichen Bögen,
   nur handgroß.

   **Die Gravur ist die halbe Auszeichnung, und sie nennt den Namen des Mannes,
   der sie trägt.** Historisch stand er darauf; im Spiel ist es die einzige
   Stelle, an der die eigene Ausrüstung den eigenen Namen sagt — und genau das
   unterscheidet ein Täfelchen von einer Zahl in einer Liste. Wo kein Name da
   ist, steht das, was ein Graveur ohne Namen schreiben würde. */
function ordenGravur(){
  const n = (S && S.name || '').trim();
  if(!n) return 'VALEUR';
  const kurz = n.split(/\s+/).pop().toUpperCase();
  return kurz.length > 11 ? kurz.slice(0,11) : kurz;
}
/* **Das Kärtchen ist einen Ton dunkler als das Papier, auf dem es liegt.** Der
   Entwurf gibt ihm den Papierton selbst — auf dem Ordensblatt, das denselben
   Grund hat, verschwindet es dann bis auf seinen Rand. Ein Täfelchen ist ein
   Gegenstand und kein Loch im Bogen. */
function ordenTaefelchen(inhalt){
  return `<rect x="14" y="30" width="92" height="116" rx="3" fill="#ddd0af" stroke="#9d8d6e"/>
    <rect x="18" y="34" width="84" height="108" rx="2" fill="none" stroke="rgba(90,76,58,.45)"/>
    ${inhalt}
    <text x="60" y="133" text-anchor="middle" font-family="Didot,'Bodoni 72',Georgia,serif"
      font-size="10" letter-spacing="2" fill="#6b4f22">${esc(ordenGravur())}</text>`;
}

/* **Die Form trägt die Klasse** (Entwurfspaket, Bündel 5): Ein Staatsorden ist
   ein *Kreuz am Band*, eine Gefechtsauszeichnung eine *geprägte Scheibe an der
   Trikolore*, eine Ehrenwaffe ein *Stück auf einem gravierten Täfelchen*. Man
   erkennt die Klasse, bevor man den Namen liest — deshalb wird keine dieser
   drei Formen für eine andere verwendet. */
function ordensbild(id){
  /* Die drei Stufen teilen sich eine Form und unterscheiden sich nur im
     Metall — genau so, wie sie im Karton des Fourriers liegen. */
  const t = ORDEN.find(o=>o.id===id && o.metall);
  if(t) return tapferBild(t.metall);

  const gid = 'og_' + id;
  const bild = (label, inhalt) => `<svg class="orden" viewBox="0 0 120 176" role="img"
    aria-label="${label}"><defs>${ordenGold(gid)}</defs>${inhalt}</svg>`;

  if(id==='ehrenwaffe') return bild('Ehrenwaffe', ordenTaefelchen(
    `<g transform="rotate(-28 60 92)">
      <rect x="24" y="88" width="72" height="5" rx="2.5" fill="#6a6152"/>
      <rect x="22" y="84" width="20" height="13" rx="3" fill="url(#${gid})"/>
      <rect x="86" y="86" width="12" height="9" rx="2" fill="#8a7a58"/>
      <circle cx="52" cy="98" r="7" fill="none" stroke="url(#${gid})" stroke-width="2.6"/></g>`));

  if(id==='ehrensaebel') return bild('Ehrensäbel', ordenTaefelchen(
    `<path d="M28 116 C 52 108, 78 84, 94 52" fill="none" stroke="#5c5446" stroke-width="7" stroke-linecap="round"/>
     <path d="M28 116 C 52 108, 78 84, 94 52" fill="none" stroke="#8f8878" stroke-width="2" stroke-linecap="round"/>
     <rect x="18" y="112" width="16" height="11" rx="5" fill="url(#${gid})"/>
     <path d="M24 108 C 34 104, 36 122, 26 120" fill="none" stroke="url(#${gid})" stroke-width="4"/>`));

  /* Die Eiserne Krone ist kein Malteserkreuz, sondern eine **Raute** — und in
     ihrer Mitte liegt der eiserne Reif, der dem Orden den Namen gibt. Das Band
     ist dunkelgelb mit grünem Rand: die Farben des Königreichs Italien, und der
     schnellste Weg zu sehen, dass dieser Orden nicht aus Paris kommt. */
  if(id==='eisenkrone') return bild('Eiserne Krone',
    `<rect x="40" y="0" width="40" height="56" fill="#c8901f"/>
     <rect x="40" y="0" width="6" height="56" fill="#3e5a2c"/>
     <rect x="74" y="0" width="6" height="56" fill="#3e5a2c"/>
     <polygon points="60,66 90,98 60,130 30,98" fill="#f7f4ec" stroke="#8a8272" stroke-width="1.2"/>
     <circle cx="60" cy="98" r="13" fill="none" stroke="url(#${gid})" stroke-width="5"/>
     <rect x="46" y="92" width="28" height="12" rx="2" fill="url(#${gid})" opacity=".9"/>
     ${ordenBand(gid)}`);

  if(id==='legion' || id==='legion_offizier'){
    /* Der zweite Grad trägt dasselbe Kreuz an einem Band mit **Rosette** —
       historisch genau der Unterschied, an dem man ihn erkannte, und der
       einzige, der sich auf Daumengröße noch zeigen lässt. */
    const offizier = id === 'legion_offizier';
    const rosette = offizier
      ? `<circle cx="60" cy="28" r="15" fill="#7e1f16"/><circle cx="60" cy="28" r="9" fill="#b8402c"/>
         <circle cx="60" cy="28" r="4" fill="#7e1f16"/>` : '';
    return bild(offizier ? 'Offizier der Ehrenlegion' : 'Ehrenlegion',
      `<rect x="40" y="0" width="40" height="56" fill="#9c3125"/>
       ${ordenKreuz(98, 5, 32, 1.1)}
       <circle cx="60" cy="98" r="10.5" fill="url(#${gid})"/>
       <text x="60" y="103" text-anchor="middle" font-family="Didot,'Bodoni 72',Georgia,serif"
         font-size="13" fill="${METALL.gold.tinte}">N</text>
       ${ordenBand(gid, rosette)}`);
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

/* ══════════════════ DIE OFFIZIERSPATENTE ══════════════════

   **Die einzige zugelassene Ausnahme von Invariante 3** („Veteranenpunkte
   kaufen den Ausgangspunkt, nie den Aufstieg"). Sie ist es deshalb, weil sie
   den Ausgangspunkt kauft und nicht den Aufstieg: Wer ein Patent hat, *fängt*
   als Offizier an — er steigt deswegen keinen Schritt weiter auf.

   **Und sie ist die Antwort auf ein gemessenes Problem.** Mit vier Kapiteln
   erreicht kein Lauf Rang 10; die halbe Rangleiter war gebaut und für den
   Spieler unsichtbar. Die Patente lösen das ohne ein einziges neues Kapitel:
   Wer eines kauft, startet 1796 in Savona als Sous-Lieutenant und spielt die
   Offiziershälfte vom ersten Tag an.

   **Freigeschaltet wird durch Leistung, nicht durch Geld** (`frei`): Man muss
   den Rang einmal *erreicht* haben, ehe man einen darüber kaufen darf. Damit
   bleibt der erste Weg nach oben der verdiente.

   **Der Ausgleich ist dreifach und beißt:**
     1. **Wertungsabzug** (`abzug`) — der gekaufte Rang zählt nicht, und die
        Stufe darüber auch nicht. Ein Marschall mit Patent ist weniger wert als
        einer ohne.
     2. **Keine Kette über dir.** Martel, Collot, Berthaud und Vernet stehen bei
        Gunst 0, und die Quellen, aus denen sich Gunst sonst speist — Abende am
        Feuer, Listen führen, den Tornister eines Erschöpften tragen —, sind für
        ihn geschlossen. Er ist mechanisch stärker und **sozial nackt**.
     3. **Man steht sichtbarer.** Der Gefahrzuschlag des Patents ist **+2** je
        Runde, zusätzlich zu den +4/+5 des Offiziersrangs — Epauletten an einem
        Mann, den in dieser Kompanie niemand kennt.

   **Was hier ausdrücklich nicht steht: ein Güte-Zuschlag.** Die erste Fassung
   erhöhte die Feindgüte der ersten vier Kapitel um 8, und das Ergebnis waren
   40 Tote in 40 Läufen. Der Grund stand längst in CLAUDE.md und wurde
   übersehen: `guete` schrumpft die Hilfe der eigenen Linie, und bei 8 sitzt
   dieser Hebel am Boden (0,3) — damit ist kein Gefecht mehr zu gewinnen, und
   jedes verlorene kostet Blut. **`guete` ist kein Schwierigkeitsregler.**

   Erzählt wird es als das, was es historisch war: der Sohn eines
   zurückgekehrten Emigranten oder ein Freiwilliger von 1792 mit Schulbildung,
   der sein Patent auf dem Papier hat und im Feld noch gar nichts. */
const PATENTE = [
  {id:'patent_sl', rang:7, vp:110, frei:6, abzug:158,
   label:'Patent als Sous-Lieutenant',
   beschr:'Du rückst 1796 mit Epauletten ein und hast nie eine Muskete abgefeuert. Niemand in der Kompanie kennt dich.'},
  {id:'patent_lt', rang:8, vp:145, frei:8, abzug:205,
   label:'Patent als Lieutenant',
   beschr:'Dasselbe, eine Stufe höher — und mit demselben Nichts an Bekanntschaft.'}
];
function patentVon(id){ return PATENTE.find(p=>p.id===id) || null; }
/* Freigeschaltet ist, wer den Rang einmal getragen hat. `META.bestRang` läuft
   über alle Läufe mit und ist damit dauerhaft — wie die Generalskampagnen. */
function patentFrei(p){ return (typeof META==='object' && META ? (META.bestRang|0) : 0) >= p.frei; }

const LADEN = [
  {id:'muskete_gut',art:'ausr',label:'Sorgfältig eingeschossene Muskete',beschr:'Modell 1777 An IX · +8 Muskete, verrostet langsamer',vp:40},
  {id:'schuhe_gut',art:'ausr',label:'Doppelt besohlte Schuhe',beschr:'Halber Marschverschleiß — der unterschätzte Kauf',vp:40},
  {id:'tornister_gut',art:'ausr',label:'Verstärkter Tornister',beschr:'Mehr Patronen und zwei Tage Proviant — der Anmarsch kostet halb so viel Atem',vp:24},
  {id:'bajonett_gut',art:'ausr',label:'Geschliffenes Bajonett',beschr:'+5 Bajonett',vp:20},
  {id:'mantel_gut',art:'ausr',label:'Beutemantel, gewachst',beschr:'Ein Mantel überhaupt — kalte Nächte, Wüste, später Russland',vp:30},
  {id:'flasche',art:'ausr',label:'Feldflasche mit Schnapsvorrat',beschr:'Belastung sinkt im Winterquartier',vp:15},
  {id:'geld',art:'geld',label:'50 Francs Startgeld',beschr:'Bares in der Tasche',vp:15},
  {id:'amulett',art:'ausr',label:'Amulett',beschr:'+5 Kaltblütigkeit. Wirkt, weil du glaubst, dass es wirkt.',vp:12},

  /* ══════════════════ WAS EIN MANN BEHÄLT ══════════════════

     **Der Rekrut kauft Muskeln, der Veteran kauft Gewohnheiten.**

     Gemessen kaufen Veteranenpunkte heute **Rang und keine Strecke** — Weite
     57 / 62 / 61 Stationen bei 11 / 30 / 38 % Capitaine. Die Ursache ist eine
     Kette: bessere Werte → kürzere Gefechte → mehr Ruf → schnellere
     Beförderung → Offiziersränge mit +4 bis +5 Gefahr je Runde. **Jeder Kauf,
     der die Kampfkraft hebt, landet am Ende in dieser Kette und zahlt seinen
     Gewinn dort wieder zurück.**

     Diese fünf können das nicht. Sie wirken ausschließlich auf die
     Zermürbung **zwischen** den Gefechten — Verschleiß, Krankheit, Aderlass,
     Frost, alte Wunden. Sie machen zäher, ohne sichtbarer zu machen, und
     erzeugen deshalb keinen Ruf.

     **Und sie greifen dort, wo der Veteran wirklich stirbt.** Nicht am
     Anfang: Italien übersteht er zu 98 bis 100 %. Er stirbt in Ägypten an
     Hitze und Ruhr und in Jena an den Beinen. Genau davon handelt jede
     einzelne.

     Inhaltlich ist das, was ein Mann aus zwei Feldzügen mitbringt, ohnehin
     nicht Kraft, sondern das Wissen, wie man nicht stirbt: welches Wasser
     man trinkt, wie man seine Füße behält, wann man sich hinlegt. */
  {id:'zaeh_fuesse',art:'zaeh',label:'Füße wie Leder',
   beschr:'Schuhe halten doppelt so lange, und ein forcierter Marsch nimmt dir weniger Luft',vp:30},
  {id:'zaeh_wasser',art:'zaeh',label:'Er weiß, welches Wasser',
   beschr:'Ruhr, Fieber und Sumpffieber zehren nur halb so stark',vp:35},
  {id:'zaeh_nachzuegler',art:'zaeh',label:'Er bleibt nicht zurück',
   beschr:'In Kriegen, die zwischen den Gefechten töten, kostet dich jede Station drei Punkte weniger',vp:45},
  {id:'zaeh_schlaf',art:'zaeh',label:'Er schläft im Freien',
   beschr:'Der Frost trifft dich eine Stufe milder, als er ist',vp:30},
  {id:'zaeh_narben',art:'zaeh',label:'Alte Narben',
   beschr:'Der Feldscher näht dir nach jedem Gefecht zwei Wunden zu statt einer',vp:40}
];
/* Ob eine Gewohnheit gekauft wurde. Eine Zeile, weil sie an sechs Stellen
   gefragt wird — und alle sechs liegen in der Zermürbung, nicht im Gefecht. */
function zaeh(id){ return !!(typeof S==='object' && S && S.kaeufe && S.kaeufe.includes(id)); }
