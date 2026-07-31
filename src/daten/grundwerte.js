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
/* Werte, die keine Attribute und keine Fertigkeiten sind, aber in der
   Seitenleiste stehen und deshalb einen Satz brauchen. **Ein Wert ohne
   Erklärung ist eine Zahl, die der Spieler abschreibt statt versteht.** */
ERKLAERUNG.sektionGuete = 'Wie gut deine Leute ausgebildet sind. Sie kommt aus dem Lager — exerzieren, den Zug antreten lassen, Rekruten aussuchen — und entscheidet, wie viele antreten, wie lange sie halten und wie schnell sie wegschmelzen. Ein gekauftes Patent fängt hier bei −25 an: Seine Leute wissen nicht, wer er ist.';

/* Ein Wort mit Erklärung beim Überfahren. Reines CSS, keine Abhängigkeit. */
function mitHilfe(k, beschriftung){
  const e = ERKLAERUNG[k];
  return e ? `<span class="hilfe" data-hilfe="${String(e).replace(/"/g,'&quot;')}">${beschriftung}</span>` : beschriftung;
}

/* ══════════════════ WAS EIN RANG IN DER WERTUNG WIEGT ══════════════════

   **Der Rang ist der größte Posten der Wertung, und mit Abstand.** Ein
   perfekter Lauf bis Waterloo bringt rund 5 000 Punkte; davon kommen 2 900 —
   also über die Hälfte — allein aus dem Marschallstab. Das ist Absicht: Die
   Rangleiter *ist* das Spiel, und jede Beförderung soll sich in der Wertung
   anfühlen wie das, was sie im Leben des Mannes war.

   Die Werte sind das Fünffache der früheren Skala (KONZEPT §5), und sie
   wachsen überproportional: Der Schritt vom Caporal zum Fourrier bringt 80,
   der vom Colonel zum Général 390. **Je höher man steht, desto mehr ist der
   nächste Schritt wert** — weil er ungleich schwerer zu erreichen ist. */
const RANG = [
  {n:1,name:'Fusilier',wert:0},{n:2,name:'Grenadier',wert:60},{n:3,name:'Caporal',wert:130},
  {n:4,name:'Caporal-fourrier',wert:210},{n:5,name:'Sergent',wert:310},
  {n:6,name:'Sergent-major',wert:440},
  /* Die Offiziers- und Stabshälfte. Bis zum 28.07.2026 endete `RANG` bei 6,
     und `rangWert()` lieferte für alles darüber **0** — eine stille
     Fehlwertung, die erst auffiel, als die Leiter über Rang 6 hinauswuchs.
     Werte aus RANGLEITER §7, identisch mit KONZEPT §5. */
  {n:7,name:'Sous-Lieutenant',wert:600},{n:8,name:'Lieutenant',wert:790},
  {n:9,name:'Capitaine',wert:1025},{n:10,name:'Chef de bataillon',wert:1310},
  {n:11,name:'Colonel',wert:1650},{n:12,name:'Général de brigade',wert:2040},
  {n:13,name:'Général de division',wert:2450},{n:14,name:'Maréchal d\'Empire',wert:2900}
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
  /* `ab:` ist der Rang, ab dem einer in der Seitenleiste steht. **Wer über dir
     steht, den kennst du nicht von Anfang an** — ein Fusilier weiß, wie sein
     Sergent heißt, und hat den Capitaine höchstens einmal reiten sehen.
     `ueberDir()` wertet das aus; ohne `ab` steht einer von Station 1 an da. */
  {id:'martel', kurz:'Martel', stufen:['Sergent','Sergent-major'],
   was:'Dein Sergent. Er hat dich im April über die Pässe gebracht und weiß, wer bei Lodi wo gestanden hat.'},
  {id:'collot', kurz:'Collot', stufen:['Fourier','Sergent-fourrier','Adjudant'],
   was:'Der Schreiber der Kompanie. Er führt die Listen, und in den Listen steht, wer Schuhe bekommt.'},
  {id:'berthaud', kurz:'Berthaud', ab:3, stufen:['Lieutenant','Capitaine','Chef de bataillon'],
   was:'Der Zugführer. Er entscheidet, welche Namen der Capitaine überhaupt zu hören bekommt.'},
  {id:'vernet', kurz:'Vernet', ab:3, stufen:['Capitaine','Chef de bataillon','Colonel'],
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
   was:'Der General. Ob er deinen Namen kennt, hat sich vor zwölf Jahren entschieden, an einem Damm im Sumpf.'},

  /* ── Die drei Marschälle ──
     Sie stehen in derselben Liste wie die Kette, damit `gunst()`,
     `gunstGeben()` und `personName()` unverändert für sie gelten. Sichtbar ist
     immer nur der eine, den man gewählt hat — `kenntPerson()` prüft das. */
  {id:'davout',  kurz:'Davout',  ab:11, patron:true, stufen:['Maréchal'],
   was:'Prince d’Eckmühl. Er verlangt Ordnung, und er verlangt sie von jedem gleich, einschließlich von sich.'},
  {id:'ney',     kurz:'Ney',     ab:11, patron:true, stufen:['Maréchal'],
   was:'Duc d’Elchingen. Er sieht, wer vorgeht, und er sieht sonst wenig.'},
  {id:'massena', kurz:'Masséna', ab:11, patron:true, stufen:['Maréchal'],
   was:'Duc de Rivoli. Er hat in Italien mehr verdient als jeder andere und hört nicht auf damit.'}
];

/* ══════════════════ DIE PROTEKTION EINES MARSCHALLS ══════════════════

   **Über dem Colonel hört Fürsprache auf, eine Zahl zu sein, und wird eine
   Zugehörigkeit.** Bis Rang 11 arbeitet man sich eine Kette hoch, in der jeder
   Nächste einen Schritt über dem Vorigen steht. Darüber gibt es das nicht mehr:
   Ein Général de brigade wird nicht von seinem Divisionsgeneral befördert,
   sondern vom Kaiser — und der Kaiser kennt achthundert Generäle nicht.

   **Er kennt seine Marschälle.** Wessen Mann du bist, entscheidet, wer deinen
   Namen ausspricht, wenn eine Stelle aufgeht. Historisch war das der
   entscheidende Mechanismus der ganzen Epoche: Es gab Davouts Leute, Neys
   Leute, Massénas Leute, und wer zu keinem gehörte, blieb Colonel.

   **Gemessen war das der Engpass.** Grandmaison war Patron für die Ränge 10 bis
   13 — ein Mann, vier Stufen, zwei Gunstquellen, und beide am Gefecht hängend.
   Vierzig von vierzig Maximalveteranen blieben Colonel, bei einem Median von
   **−2**, wo **+5** nötig waren. Nicht die Schwelle war zu hoch, die Mechanik
   war zu dünn.

   ── Was die drei voneinander unterscheidet ──

   **Jeder hat eine andere Vorstellung davon, was ein guter Untergebener ist**,
   und keine davon ist die richtige:

   | | verlangt | verachtet |
   |---|---|---|
   | **Davout** | erfüllte stehende Aufträge, ein Bataillon in Ordnung, saubere Bücher | jeden Eintrag im Verzeichnis, doppelt |
   | **Ney** | vor der Linie stehen, Bulletins, genommene Stellungen | ein Gefecht, in dem dein Name nicht fällt |
   | **Masséna** | Geld, und dass du weißt, wie man daran kommt | Ehrlichkeit, die ihn schlecht aussehen lässt |

   ── Und der Preis, den keiner ansagt: ihr eigener Stand ──

   **Ein Patron ist nur so viel wert, wie der Kaiser auf ihn hört**, und das
   ändert sich. Davout bleibt oben, weil er nie etwas falsch macht und deshalb
   nie geliebt wird. Ney steht hoch und stürzt in Russland ab, wo er die
   Nachhut führt und dabei ein Korps verliert. Masséna ist 1805 der reichste
   Mann der Armee und 1811 in Portugal erledigt.

   **Wer sich 1807 für Masséna entscheidet, wählt den, der jetzt am meisten
   gibt und am Ende nichts mehr wert ist.** Das Spiel sagt es nicht. Es zeigt
   nur seinen Stand, und der steht neben seinem Namen. */
const PATRONE = [
  {id:'davout',  name:'Maréchal Davout, Prince d’Eckmühl',
   will:'ordnung', wollen:'Ordnung, und zwar überprüfbar',
   text:'Er fragt dich nach Zahlen. Wie viele Paar Schuhe, wie viele auf dem Marsch zurückgeblieben, '
      +'wie viele deiner Unteroffiziere lesen können. Er schreibt die Antworten auf und vergleicht sie im Frühjahr '
      +'mit dem, was du gesagt hast. Man erzählt sich, dass er noch nie jemanden angeschrien hat.',
   /* Sein Stand ist der stabilste von allen und nie der höchste: Er macht
      nichts falsch und wird dafür geachtet, nicht geliebt. */
   stand:{4:3, 5:4, 6:4, 7:4, 8:5, 9:4, 10:4}},

  {id:'ney',     name:'Maréchal Ney, Duc d’Elchingen',
   will:'tapfer', wollen:'dass man dich vorn gesehen hat',
   text:'Er redet zwanzig Minuten mit dir und stellt keine einzige Frage, die du beantworten müsstest. '
      +'Am Ende sagt er, er habe bei Elchingen jemanden gesehen, der auf der Brücke stehen geblieben ist, '
      +'und ob du das gewesen seist. Du warst es nicht. Er nickt trotzdem.',
   /* Der Höchststand der Armee — bis Russland. Danach ist er der Mann, der die
      Nachhut geführt und ein Korps verloren hat, und beides stimmt. */
   stand:{4:4, 5:5, 6:5, 7:4, 8:5, 9:3, 10:2}},

  {id:'massena', name:'Maréchal Masséna, Duc de Rivoli',
   will:'geld', wollen:'seinen Anteil, und dass du deinen nimmst',
   text:'Er empfängt dich in einem Zimmer, das drei Wochen vorher jemand anderem gehört hat, und redet über '
      +'den Preis von Tuch. Nach einer halben Stunde weißt du, dass es kein Gespräch über Tuch war, '
      +'und dass du eine Antwort gegeben hast, ohne es zu merken.',
   /* 1805 der reichste Mann der Armee, nach Portugal 1811 erledigt. Wer ihn
      früh wählt, bekommt am meisten und steht am Ende allein. */
   stand:{4:5, 5:4, 6:4, 7:3, 8:1, 9:0, 10:0}}
];
function patronVon(id){ return PATRONE.find(p=>p.id===id) || null; }
/* Sein Stand beim Kaiser im laufenden Feldzug. Vor Rang 11 gibt es keine
   Wahl, also auch keinen Stand; nach dem letzten Eintrag gilt der letzte. */
function patronStand(id, kap){
  const p = patronVon(id); if(!p) return 0;
  const k = Math.max(0, kap|0);
  for(let i = k; i >= 0; i--) if(p.stand[i] !== undefined) return p.stand[i];
  return 3;
}

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

/* ══════════════════ DIE KETTE UNTER DIR ══════════════════

   **Der Kern der Verschiebung, und er kostet fast keine neue Maschine.** Das
   Spiel hat ein bewährtes System für benannte Personen mit eigener Haltung,
   Aufstieg, Tod und Nachfolge — `S.leute`, `LEUTE`, `NACHFOLGER`. Es zeigt
   nach oben. **Hier wird dasselbe System nach unten gerichtet.**

   Bis Rang 8 hat man Untergebene als *Zahl*: `K.sektion` ist eine Zahl für 20,
   60 oder 120 Mann, die Kompanien heißen „1. Kompanie" bis „4. Kompanie", und
   `MANNSCHAFT` liefert Namen ausschließlich für Verlustlisten. Die Texte
   behaupteten Untergebene („drei Sergenten machen die Arbeit"), der Zustand
   kannte sie nicht.

   **Ab Rang 9 haben sie Namen.** Vier Personen, wie „Über dir" — und je Person
   nur vier Werte, damit vier Personen überschaubar bleiben:

     koennen   0–100   was seine Einheit im Gefecht leistet
     treue    −5…+5    ob er dich deckt oder anzeigt
     zustand           ein Problem, das auf deinem Schreibtisch landet
     lebt              er kann fallen; der Nachfolger beginnt bei 25

   **Die Zahl der Menschen, die du kennst, bleibt gleich — sie rücken nur
   immer weiter von der Schlacht ab.** Als Fusilier kennst du vier Männer neben
   dir. Als Général de division kennst du vier Generäle unter dir. */
const UNTERSTELLTE_STUFEN = [
  {ab:9,  posten:['Sergent','Sergent','Sergent','Sous-Lieutenant'], was:'deine Unteroffiziere und dein junger Offizier'},
  {ab:10, posten:['Capitaine','Capitaine','Capitaine','Capitaine'], was:'die vier Kompaniechefs'},
  {ab:11, posten:['Chef de bataillon','Chef de bataillon','Chef de bataillon'], was:'die Bataillonschefs deines Regiments'},
  {ab:12, posten:['Colonel','Colonel','Colonel','Général de brigade'], was:'die Regimenter deiner Brigade'},
  {ab:13, posten:['Général de brigade','Général de brigade','Colonel','Colonel','Colonel'], was:'die Verbände deiner Division'}
];
/* Welche Stufe zum Rang gehört — die höchste, die er erreicht. */
function unterstellteStufe(rang){
  let s = null;
  for(const u of UNTERSTELLTE_STUFEN) if(rang >= u.ab) s = u;
  return s;
}
/* Namen für die Unterstellten. Sie kommen aus derselben Liste wie die
   Verlustmeldungen — es sind dieselben Leute, nur die, die man kennt. */
const UNTER_NAMEN = ['Toussaint','Lavaux','Perrin','Reynaud','Ducasse','Marbot',
  'Chevrier','Delaunay','Prevost','Ravel','Bonnet','Gerard','Lefranc','Vidal',
  'Aubert','Chastel','Marchand','Dorsay','Villiers','Rocher'];

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
  /* **Italien stand bis zum 31.07.2026 auf 0** — die Härtekurve griff damit
     genau dort am schwächsten, wo der Erstläufer lebt und stirbt: Gemessen
     überstehen 96 % das Lehrstück und 40 % Ägypten, ein Sprung von
     sechsundfünfzig Punkten zwischen dem ersten und dem zweiten Kapitel. Das
     Spiel sortiert an einer Stelle, und wer sie übersteht, hat den Lauf im
     Wesentlichen gewonnen.

     **+1 ist ein Tastversuch, keine Eichung** (Ansage des Entwicklers, dazu
     Ägypten unverändert bei 4). Ein Punkt verschiebt eine Probe um rund einen
     Prozentpunkt und liegt damit unter dem Rauschen von achtzig Läufen —
     gemessen wird trotzdem, denn eine Zahl, die man nicht misst, ist geraten. */
  {id:'italien',    nr:1,  name:'Italien',        jahre:'1796–97', guete:0, sold:0.3, schwierigkeit:1, kurz:'Barfuß, hungrig, siegreich.',                 gebaut:true},
  {id:'aegypten',   nr:2,  name:'Ägypten',        jahre:'1798–99', guete:5, sold:0.5, schwierigkeit:4, kurz:'Hitze, Krankheit, Karrees gegen Mamluken.'},
  {id:'garnison',   nr:3,  name:'Garnison',       jahre:'1801–04', guete:0, sold:1.0, schwierigkeit:0, kurz:'Ruhe. Bildung nachholen, Beziehungen knüpfen.'},
  {id:'austerlitz', nr:4,  name:'Austerlitz',     jahre:'1805',    guete:6, sold:0.9, schwierigkeit:6, kurz:'Die perfekte Schlacht.'},
  {id:'jena',       nr:5,  name:'Jena–Auerstedt', jahre:'1806',    guete:7, sold:0.8, schwierigkeit:8, kurz:'Tempo, Verfolgung, Marschstrapazen.'},
  {id:'eylau',      nr:6,  name:'Eylau & Friedland', jahre:'1807', guete:8, sold:0.6, schwierigkeit:10, kurz:'Schnee und Massenverluste. Viele Vakanzen.'},
  {id:'spanien',    nr:7,  name:'Spanien',        jahre:'1808–12', guete:8, sold:0.7, aderlass:4, schwierigkeit:12, kurz:'Guerilla. Kein Ruhm, nur Repressalien.'},
  {id:'russland',   nr:8,  name:'Russland',       jahre:'1812',    guete:10, sold:0.1, aderlass:8, verschleiss:2, ersatz:false, schwierigkeit:16, kurz:'Kein Feldzug, ein Überlebensspiel.'},
  {id:'deutschland',nr:9,  name:'Deutschland',    jahre:'1813',    guete:10, sold:0.4, rekruten:25, schwierigkeit:16, kurz:'Wiederaufbau aus Rekruten. Leipzig.'},
  {id:'frankreich', nr:10, name:'Frankreich',     jahre:'1814',    guete:11, sold:0.2, rekruten:20, schwierigkeit:18, kurz:'Verteidigung der Heimat, Abdankung.'},
  {id:'hunderttage',nr:11, name:'Hundert Tage',   jahre:'1815',    guete:12, sold:1.0, schwierigkeit:20, kurz:'Waterloo. Epilog je nach Rang.'}
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
   ab:'1799', vp:30, ruf:6, pension:0.5,
   was:'Eine Muskete mit graviertem Schloss und deinem Namen darauf, verliehen im Namen der Konsuln. Sie schießt nicht besser. Sie sagt nur jedem, der sie sieht, was du getan hast.',
   bedingung:'Drei Nennungen im Tagesbefehl'},

  /* Der Ehrensäbel ist die goldene Ehrenwaffe — historisch seltener und
     wertvoller als das Gewehr, vergeben für eine einzelne, benannte Tat. Er
     gibt der Sondermissions-Kette, der gefährlichsten Handlung im Spiel,
     endlich einen eigenen Preis: Wer durch die Bresche von Akkon gegangen ist,
     bekommt nicht dasselbe wie einer, der dreimal aufgefallen ist. */
  {id:'ehrensaebel', name:'Ehrensäbel', voll:'Sabre d\'honneur',
   ab:'1799', vp:42, ruf:8, pension:1.0,
   was:'Ein Säbel mit vergoldetem Gefäß und einer Gravur, die den Tag nennt und den Ort. Der Waffenmeister sagt, er sei zum Tragen und nicht zum Fechten, und hat unrecht: Er ist zum Angesehenwerden.',
   bedingung:'Eine Sondermission voll bestanden und fünf Nennungen'},

  /* Der erste **fremde** Orden. Gestiftet im Juni 1805 vom Königreich Italien,
     dessen König Napoleon selbst war; an Franzosen nach Austerlitz vergeben.
     KONZEPT §5 hält den Platz frei: „je fremdem Orden +10, höchstens zwei
     gewertet" — die zweite Stelle bleibt für Spanien oder Preußen offen. */
  {id:'eisenkrone', name:'Eiserne Krone', voll:'Ordine della Corona Ferrea',
   ab:'1805', fremd:true, vp:30, ruf:6, pension:0.5,
   was:'Ein Kreuz an dunkelgelbem Band mit grünem Rand, verliehen im Namen eines Königreichs, dessen König derselbe Mann ist, der dich schon einmal ausgezeichnet hat. In der Kompanie heißt es nur „die Lombardische".',
   bedingung:'Eine Meldung an den Oberbefehl und Austerlitz überlebt'},

  {id:'legion', name:'Ehrenlegion', voll:'Légionnaire de la Légion d\'honneur',
   ab:'1804', vp:36, ruf:10, pension:1.0,
   was:'Ein weißes Emailkreuz an rotem Band, fünfhundert Francs im Jahr und das Recht, vor jedem Offizier gegrüßt zu werden, der es nicht trägt.',
   bedingung:'Eine Ehrenwaffe — oder fünf Nennungen und Ruf 45'},

  /* Der zweite Grad. Historisch war der Sprung vom Légionnaire zum Officier an
     den Rang gebunden: Mannschaften wurden Légionnaire, Offiziere Officier.
     Deshalb setzt er den ersten Grad *und* ein Patent voraus — er ist keine
     zweite Auszeichnung, sondern dieselbe eine Stufe höher. Die Pension
     verdoppelt sich, und das war der eigentliche Unterschied: zweitausend
     Francs im Jahr statt fünfhundert. */
  {id:'legion_offizier', name:'Offizier der Ehrenlegion', voll:'Officier de la Légion d\'honneur',
   ab:'1807', vp:36, ruf:10, pension:2.0,
   was:'Dasselbe Kreuz, größer, an einem Band mit Rosette. Zweitausend Francs im Jahr, und in einer Liste, die in Paris geführt wird, steht dein Name jetzt in der zweiten Spalte statt in der ersten.',
   bedingung:'Die Ehrenlegion, ein Patent und acht Nennungen'},

  /* ── Der vierte Grad, und die Schranke von Rang 13 ──
     **Historisch ist der Grand Officier der Grad, ab dem man nicht mehr
     ausgezeichnet, sondern aufgenommen wird.** Die Ehrenlegion hatte fünf
     Stufen; die oberen zwei vergab der Kaiser persönlich, und die Liste war
     kurz genug, dass er die Namen kannte.

     Im Spiel ist er die Bedingung für den Général de division (`orden:
     'legion_grand'` in der LEITER). Bis zum 30.07.2026 war er dort gefordert
     und nicht gebaut — Rang 13 und damit auch 14 waren verschlossen, und die
     ganze VP-Ökonomie war gegen eine Decke geeicht, die niemand erreicht.

     **Die Bedingungen sind Zahlen, die es schon gibt**, keine neuen Zähler:
     der dritte Grad, ein Regiment (Rang 11) und fünf Bulletins. Wer so weit
     kommt, hat den Stern verdient, bevor er ihn braucht — und genau so soll
     eine Schranke sitzen: als Bestätigung, nicht als Mautstelle. */
  /* ── Der Orden für den, der nicht schießt, sondern sorgt ──
     **Alle übrigen Auszeichnungen verlangen, gesehen worden zu sein.** Der
     Capitaine, dessen Bataillon als einziges Schuhe hat, bekam dafür bis zum
     31.07.2026 nichts — Verwaltung zahlte in Fürsprache und sonst nirgendwohin.

     **Den Orden gab es wirklich**, und genau dafür: gestiftet am 18. Oktober
     1811, hellblaues Band, ausdrücklich *unterhalb* der Ehrenlegion angesiedelt
     und ausdrücklich auch für **Verwaltungsverdienst** — für Präfekten,
     Intendanten und Offiziere, deren Leistung in Listen stand statt in
     Bulletins.

     Seine drei Bedingungen sind Zahlen, die es schon gibt: der stehende
     Feldzugsauftrag zweimal erfüllt, ein Bataillon in brauchbarem Zustand und
     eine Akte ohne Vermerk. **Er ist damit der einzige Orden des Spiels, den
     ein Feigling bekommen kann** — und der einzige, für den man nie vor der
     Linie gestanden haben muss.

     Dass er zugleich genau Davouts Währung ist und genau das, was Ney für
     nichts hält, braucht keine eigene Mechanik: Die Bedingungen *sind* seine
     Zählung. */
  {id:'reunion', name:'Orden der Wiedervereinigung', voll:'Ordre de la Réunion',
   ab:'1811', vp:30, ruf:6, pension:0.5,
   was:'Ein weißes Kreuz an hellblauem Band, gestiftet für die, deren Verdienst in Listen steht und nicht in Bulletins. In der Armee heißt er „der Orden für Tinte", und wer ihn trägt, weiß das und trägt ihn trotzdem.',
   bedingung:'Zweimal den Feldzugsauftrag erfüllt, das Bataillon beisammen, die Akte ohne Vermerk'},

  {id:'legion_grand', name:'Grand Officier der Ehrenlegion', voll:'Grand Officier de la Légion d\'honneur',
   ab:'1808', vp:48, ruf:14, pension:3.0,
   was:'Ein achtstrahliger Stern, auf den Rock genäht, kein Band. Man hängt ihn nicht um und legt ihn nicht ab; er ist Teil des Mantels, in dem man vor Leute tritt. Dazu ein Betrag im Jahr, von dem eine Familie lebt, und eine Liste in Paris, die kurz genug ist, dass einer sie auswendig kann.',
   bedingung:'Offizier der Ehrenlegion, ein Regiment und fünf Bulletins'}
];
function ordenVon(id){ return ORDEN.find(o=>o.id===id) || null; }
function hatOrden(id){ return !!(S && S.orden && S.orden.includes(id)); }

/* Das Kreuz, wie es am Rock hängt. Wie die Rangabzeichen: ein Bild statt eines
   Wortes, und in derselben Größe, damit die Seitenleiste ruhig bleibt. */
/* Die drei Tapferkeitsstufen. Sie stehen am Ende der Liste, weil sie die
   jüngste Zutat sind — die Reihenfolge in `ORDEN` bestimmt nichts. */
ORDEN.push(
  {id:'tapfer_bronze', name:'Tapferkeitsmedaille in Bronze', voll:'Médaille de la valeur · bronze',
   ab:'1796', metall:'bronze', stufe:1, vp:12, ruf:2, pension:0,
   was:'Eine geprägte Scheibe an der Trikolore, gekreuzte Musketen darauf. Sie wird nicht verliehen, sie wird ausgegeben — der Fourrier hat einen Karton davon, und wessen Name im Tagesbefehl stand, bekommt eine.',
   bedingung:'Einmal im Tagesbefehl genannt'},
  {id:'tapfer_silber', name:'Tapferkeitsmedaille in Silber', voll:'Médaille de la valeur · argent',
   ab:'1796', metall:'silber', stufe:2, vp:24, ruf:4, pension:0,
   was:'Dieselbe Scheibe in Silber. Der Karton des Fourriers hat davon vier, und er weiß, wer sie bekommt, bevor die Liste kommt.',
   bedingung:'Einmal im Bulletin der Großen Armee'},
  {id:'tapfer_gold', name:'Tapferkeitsmedaille in Gold', voll:'Médaille de la valeur · or',
   ab:'1796', metall:'gold', stufe:3, vp:36, ruf:6, pension:0.5,
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

/* ── Der Bruststern ──
   **Die einzige Auszeichnung ohne Band**, und daran erkennt man sie: Ein Stern
   wird nicht umgehängt, er wird auf den Rock genäht. Genau deshalb ist er die
   richtige Form für einen Grad, den man nicht mehr vorzeigt, sondern trägt.

   Acht Strahlen aus vier durchgehenden Balken — **hier ist der Durchstoß
   richtig**, anders als beim Kreuz: Ein Balken durch die Mitte gibt zwei
   Spitzen, vier Balken geben acht, und acht Spitzen sind das, was ein Stern
   hat. Darüber die vier verjüngten Kreuzarme aus `ordenKreuz()`, damit das
   Kreuz auch hier vier Arme zeigt und kein X. */
function ordenStern(gid, cy){
  const strahlen = [22.5, 67.5, 112.5, 157.5].map(a =>
    `<rect x="55.5" y="${cy-48}" width="9" height="96" transform="rotate(${a} 60 ${cy})" fill="url(#${gid})"/>`).join('');
  const glanz = [33.5, 78.5, 123.5, 168.5].map(a =>
    `<rect x="58.5" y="${cy-40}" width="3" height="80" transform="rotate(${a} 60 ${cy})" fill="#f0dfae" opacity=".55"/>`).join('');
  /* **Das Kreuz reicht fast bis an die Strahlenspitzen.** Bleibt es deutlich
     kürzer, überragen die Strahlen es so weit, dass das Ganze als Windrad
     liest und nicht als Stern mit Kreuz — bei Daumengröße war genau das der
     erste Eindruck. Vierzig gegen achtundvierzig ist das Verhältnis, das die
     Bruststerne der Zeit hatten. */
  return strahlen + glanz + ordenKreuz(cy, 7, 40, 1.3)
    + `<circle cx="60" cy="${cy}" r="13" fill="url(#${gid})"/>
       <circle cx="60" cy="${cy}" r="9.5" fill="none" stroke="${METALL.gold.dunkel}" stroke-width="1" opacity=".6"/>
       <text x="60" y="${cy+6}" text-anchor="middle" font-family="Didot,'Bodoni 72',Georgia,serif"
         font-size="15" fill="${METALL.gold.tinte}">N</text>`;
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

  if(id==='legion_grand') return bild('Grand Officier der Ehrenlegion', ordenStern(gid, 88));

  /* Hellblaues Band und ein **weißes** Kreuz ohne Mittelbild — so unterscheidet
     er sich auf Daumengröße von der Ehrenlegion, die dasselbe Kreuz an rotem
     Band mit goldenem Mittelstück trägt. Das ist der ganze Unterschied, den
     man bei 44 Pixeln Höhe noch zeigen kann, und er genügt: Man sieht die
     Farbe, bevor man den Namen liest. */
  if(id==='reunion') return bild('Orden der Wiedervereinigung',
    `<rect x="40" y="0" width="40" height="56" fill="#7fa8c9"/>
     ${ordenKreuz(98, 5, 32, 1.1)}
     <circle cx="60" cy="98" r="9" fill="#f2ede1" stroke="#8a8272" stroke-width="1.2"/>
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

/* ── Der Fertigkeiten-Sockel ──
   **Alle neun Fertigkeiten beginnen bei 20, nicht mehr bei 5.** Die Skala geht
   0–100, und 20 ist das, was ein Mann mitbringt, der schon einmal eine Muskete
   gehalten und schon einmal Hunger gehabt hat — nicht Können, aber auch nicht
   Ahnungslosigkeit.

   **Der Sinn ist nicht, den Anfänger stärker zu machen.** Gegen die üblichen
   Schwierigkeiten steht er mit 20 weiterhin weit unten und scheitert; er
   scheitert nur nicht mehr *absolut*. Die Zahl gehört zur Skala: Wenn ein Wert
   bis 100 gekauft werden kann, ist 5 kein Startwert, sondern ein Rundungsfehler.

   **Steht in `grundwerte.js` und nicht bei den übrigen Erschaffungszahlen**,
   weil `mechanik.js` (`neuerCharakter`) ihn braucht und **vor** `oberflaeche.js`
   geladen wird. Eine Konstante, die zwei Dateien teilen, gehört in die, die
   zuerst kommt — sonst hängt sie an der Ladereihenfolge. */
const FERT_SOCKEL = 20;

/* ══════════════════ WAS EIN PUNKT KOSTET ══════════════════

   Preis je Punkt nach Zehnerbereich — `PRO_PUNKT[Math.floor(wert/10)]`.

   **Die Kurve ist exponentiell, und das ist der Bremsklotz der ganzen
   Ökonomie.** Seit die Obergrenze bei 100 liegt und ein perfekter Lauf ein
   Vielfaches der früheren Punkte bringt, muss die Bremse aus dem Preis kommen
   und nicht mehr aus einem Deckel:

   | Weg | Kosten |
   |---|---|
   | ein Wert von 20 auf 70 | 330 VP |
   | **alle fünfzehn** von 20 auf 70 | **4 950 VP** |
   | ein Wert von 70 auf 100 | 1 250 VP |
   | ein Wert von 20 auf 100 | 1 580 VP |

   Damit ist „alles auf 70" das Ziel eines perfekten Laufs, und „eine Hundert"
   kostet so viel wie drei Werte auf 70 — **Breite und Spitze schließen einander
   fast aus**, und genau das soll die Entscheidung sein. */
const PRO_PUNKT = [1,1,2,3,5,8,15,25,40,60];
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
/* ── Die Freischaltung steht seit dem 30.07.2026 wieder auf 9 und 11 ──
   **`frei:6` und `frei:8` waren die befristete Fassung für vier Kapitel.**
   Damals war Rang 9 gemessen unerreichbar, und eine Freischaltung, die
   niemand auslöst, hätte Phase E ihren Zweck genommen — die Offiziershälfte
   sollte überhaupt einmal jemand sehen.

   Der Grund ist weg: Mit elf Kapiteln erreicht der Veteran mit 5800 VP in
   **40 von 40 Läufen den Colonel**. Wer ein Patent kaufen will, hat den
   verlangten Rang längst getragen. `RANGLEITER.md` §9 gilt damit wieder
   wörtlich, und die Abweichung ist keine mehr. */
const PATENTE = [
  {id:'patent_sl', rang:7, vp:550, frei:9, abzug:790,
   label:'Patent als Sous-Lieutenant',
   beschr:'Du rückst 1796 mit Epauletten ein und hast nie eine Muskete abgefeuert. Niemand in der Kompanie kennt dich.'},
  {id:'patent_lt', rang:8, vp:725, frei:11, abzug:1025,
   label:'Patent als Lieutenant',
   beschr:'Dasselbe, eine Stufe höher — und mit demselben Nichts an Bekanntschaft.'}
];
function patentVon(id){ return PATENTE.find(p=>p.id===id) || null; }
/* Freigeschaltet ist, wer den Rang einmal getragen hat. `META.bestRang` läuft
   über alle Läufe mit und ist damit dauerhaft — wie die Generalskampagnen. */
function patentFrei(p){ return (typeof META==='object' && META ? (META.bestRang|0) : 0) >= p.frei; }

/* ══════════════════ DAS ERSTE MAL ══════════════════

   **Invariante 4 sagt: Ein höherer Rang gibt neue Knöpfe, nicht größere
   Zahlen. Bis hierher hat das Spiel es niemandem gesagt.** Man stand
   plötzlich vor vier Rechtecken statt vor einer Linie, vor einem Schreibtisch
   statt vor drei Abenden, in einem Zelt statt in einem Glied — und musste
   selbst darauf kommen, dass das der Aufstieg war, für den man gearbeitet hat.

   Ein Fenster je Sache, einmal je Laufbahn, ausgelöst **dort, wo die Sache
   zum ersten Mal wirklich geschieht** und nicht bei der Beförderung. Das ist
   der Unterschied, auf den es ankommt: Die Nachricht kommt nicht, wenn man den
   Rang bekommt, sondern wenn er einen zum ersten Mal etwas tun lässt.

   **Zwei Regeln für den Ton, beide aus Invariante 7:**

   1. **Kein Glückwunsch.** Der Aufstieg wird protokolliert, nicht gefeiert.
      Jedes dieser Blätter sagt, was jetzt anders ist, und was es kostet.
   2. **Nichts, was das Spiel selbst zeigen könnte, wird hier erklärt.** Vor
      allem sagt `bataillon` **nicht**, dass die Atemleiste verschwunden ist —
      der Bruch besteht darin, dass man es bemerkt, und ein Hinweis darauf
      zerstört ihn vollständig (RANGLEITER §2). */
const ERSTMAL = {
  sektion:{
    kopf:'Zum ersten Mal', titel:'Zwanzig Mann', ort:'Was ein Sergent tut',
    text:['Bis gestern hast du geladen und gefeuert, und das war alles, was man von dir wollte. Heute stehst du hinter dem Glied, wo der serre-file steht, und vor dir stehen zwanzig, die auf dich hören sollen.',
          'Du schießt weiter. Es zählt nur nichts mehr.'],
    fuss:'Neue Befehle im Gefecht · nach jedem Gefecht wird gezählt, wie viele von den zwanzig noch stehen',
    knopf:'Antreten lassen'},
  zug:{
    kopf:'Zum ersten Mal', titel:'Ohne Muskete', ort:'Was ein Offizier nicht mehr tut',
    text:['Der Fourrier hat deine Muskete abgenommen und nichts dazu gesagt. An ihrer Stelle hängt ein Degen, mit dem du in zehn Jahren dreimal etwas anfangen wirst.',
          'Von jetzt an entscheidest du nicht mehr, was du tust, sondern was hundertzwanzig andere tun. Zwischen deinem Befehl und dem, was daraus wird, liegen Leute, die du nicht ausgesucht hast.'],
    fuss:'Kein Laden, kein Feuern · was du befiehlst, führt jemand anders aus — oder auch nicht',
    knopf:'Den Degen umschnallen'},
  schreibtisch:{
    kopf:'Zum ersten Mal', titel:'Der Tisch', ort:'Was vor den Abenden liegt',
    text:['Vor deinem Quartier steht ein Tisch, und auf dem Tisch liegen drei Vorgänge, die keiner sonst unterschreiben kann. Sie kosten dich keinen Abend. Sie kosten dich nur, dass du sie entscheidest.',
          'Über jedem steht, wie weit die Entscheidung reicht. Bei der dritten Sorte steht es dabei, weil sie über den Feldzug hinausgeht, und dann sagt niemand mehr etwas dazu.'],
    fuss:'Drei Vorgänge je Lager · kein Kommentar hinterher, in keine Richtung',
    knopf:'Die Feder nehmen'},
  briefing:{
    kopf:'Zum ersten Mal', titel:'Befehlsausgabe', ort:'Am Vorabend',
    text:['Du wirst geholt. Nicht ausgerichtet, nicht über den Fourrier — geholt, in ein Quartier mit einer Karte auf dem Tisch, zu einer Stunde, zu der sonst niemand mehr geweckt wird.',
          'Was dort gesagt wird, hast du zehn Jahre lang am nächsten Morgen erfahren, in einer Fassung, die durch vier Münder gegangen war. Jetzt hörst du es aus dem ersten.'],
    fuss:'Vor jedem Höhepunktgefecht · du bekommst den Befehl, und was du darauf sagst, steht auf dem Spiel',
    knopf:'Eintreten'},
  antreten:{
    kopf:'Zum ersten Mal', titel:'Sie stehen und warten', ort:'Am Morgen',
    text:['Es ist noch nicht hell, und sie sind zusammengerufen worden. Man ruft niemanden zusammen, um ihm zu sagen, dass nichts ist — sie wissen also schon, was für ein Tag das wird, bevor du ein Wort gesagt hast.',
          'Zehn Jahre hast du in dieser Reihe gestanden und zugehört. Von der Seite, auf der du jetzt stehst, sieht es anders aus, als du gedacht hast.'],
    fuss:'Was du sagst, wirkt das ganze Gefecht · und was du weglässt, finden sie selbst heraus',
    knopf:'Vortreten'},
  bataillon:{
    kopf:'Zum ersten Mal', titel:'Vier Rechtecke', ort:'Was ein Bataillonschef sieht',
    text:['Es gibt keine Männer mehr auf deinem Bild. Es gibt vier Kästen mit einem Buchstaben, einer Zahl und einer Haltung, und einer von ihnen geht zuerst hinein.',
          'Welcher, entscheidest du. Es gibt keine Probe darauf, keine Fertigkeit, die es dir abnimmt, und das Spiel wird dir nie sagen, ob es die richtige war. Nach dem Gefecht steht in der Meldung eine Zahl, und die Zahl hat einen Buchstaben.'],
    fuss:'Bis hierher hast du entschieden, was du tust · ab jetzt, wer stirbt',
    knopf:'Die Meldungen durchsehen'},
  karte:{
    kopf:'Zum ersten Mal', titel:'Die Karte', ort:'Was ein General weiß',
    text:['Vor dir liegt mehr Gelände, als ein Mann an einem Tag abreiten kann, und darauf stehen deine Verbände als Rechtecke mit einer Uhrzeit daneben. Die Uhrzeit ist das Wichtigste an ihnen.',
          'Wo der Feind steht, ist eine Vermutung. Was du befiehlst, wird ausgeführt, wenn ein Reiter angekommen ist, und dann gilt eine Lage, die du nicht gesehen hast. Aufklärung macht die Meldungen frischer. Wahr macht sie nichts.'],
    fuss:'Kein Befehl wirkt sofort · und du bekommst nie zu wissen, wie es wirklich stand',
    knopf:'Den Zirkel ansetzen'}
};

/* ══════════════════ DER KAUFLADEN ══════════════════

   **Drei Qualitätsleitern, Extras, und die fünf Gewohnheiten.**

   `gruppe:` macht aus Posten eine Leiter: Innerhalb einer Gruppe gibt es
   **einen** Kauf, und der teurere ersetzt den billigeren, statt danebenzustehen.
   Was keine Gruppe hat, ist stapelbar — Kleinkram und Gewohnheiten.

   **Jede Stufe kostet mehr und bringt weniger Zuwachs als die davor.** Wer
   Stufe 4 bezahlt, bezahlt Zuverlässigkeit, keinen Sprung. Stufe 1 ist immer
   die Ausgabe, die jeder ohnehin bekommt, und steht deshalb nicht im Laden.

   `frei:` schaltet über `META.bestRang` frei — **durch Erreichtes, nie durch
   Vorrat.** Gesperrtes steht grau mit einem Satz Bedingung da; damit ist der
   Laden zugleich die Landkarte dessen, was noch kommt. `freiKapitel:` ist
   dasselbe für eine Kapitelmarke: Die Winterausstattung kann man erst kaufen,
   wenn man weiß, warum man sie braucht.

   **Der Nebeneffekt ist der Hauptpunkt:** Für 165 VP (Muskete und Schuhe auf
   Stufe 2) ist ein Erstkäufer spürbar besser ausgerüstet. Vorher begann der
   Laden praktisch bei 200 — bei einer Erstlauf-Weite von 32 von 163 Stationen
   war das der falsche Einstiegspreis. */
const LADEN = [
  /* ── Die Waffe ── */
  {id:'muskete_depot',art:'ausr',gruppe:'waffe',stufe:2,label:'Ausgesuchte Muskete aus dem Depot',
   beschr:'Der Waffenmeister legt drei nebeneinander und nimmt die, deren Lauf gerade ist · +4 Muskete',vp:90},
  {id:'muskete_gut',art:'ausr',gruppe:'waffe',stufe:3,label:'Sorgfältig eingeschossene Muskete',
   beschr:'Modell 1777 An IX · +8 Muskete, verrostet langsamer',vp:200},
  {id:'muskete_manu',art:'ausr',gruppe:'waffe',stufe:4,label:'Manufakturmuskete aus Versailles',
   beschr:'Sie schießt nicht anders, sie schießt jedes Mal gleich · +12 Muskete, hält einen ganzen Krieg',vp:350},
  {id:'stutzen',art:'ausr',gruppe:'waffe',frei:2,label:'Gezogener Stutzen',
   beschr:'Kein Aufstieg, ein anderer Weg: Zielen wird tödlich, schnelles Feuern wertlos · nur für Plänkler',vp:275},

  /* ── Die Schuhe ── */
  {id:'schuhe_neu',art:'ausr',gruppe:'schuhe',stufe:2,label:'Neue Schuhe, passend',
   beschr:'Nicht besser gemacht als die Ausgabe, nur nicht von einem anderen getragen',vp:75},
  {id:'schuhe_gut',art:'ausr',gruppe:'schuhe',stufe:3,label:'Doppelt besohlte Schuhe',
   beschr:'Halber Marschverschleiß — der unterschätzte Kauf',vp:200},
  {id:'stiefel',art:'ausr',gruppe:'schuhe',stufe:4,label:'Marschstiefel vom Schuster, Maßarbeit',
   beschr:'Sie gehen kaputt wie alles andere, nur zwei Feldzüge später · und du merkst es viel später',vp:300},

  /* ── Uniform und Mantel ── */
  {id:'mantel_gut',art:'ausr',gruppe:'mantel',stufe:2,label:'Beutemantel, gewachst',
   beschr:'Ein Mantel überhaupt — kalte Nächte, Wüste, später Russland',vp:150},
  {id:'uniform_gut',art:'ausr',gruppe:'mantel',stufe:3,label:'Gute Uniform mit Capote',
   beschr:'Man sieht einem Mann an, wie ernst er sich nimmt · Mantel und +4 Autorität',vp:250},
  {id:'winter',art:'ausr',gruppe:'mantel',stufe:4,freiKapitel:'eylau',label:'Winterausstattung: Tuch und Pelz',
   beschr:'Der Kauf, den man erst versteht, wenn man einmal ohne dagestanden hat · Frost eine Stufe milder',vp:375},

  /* ── Die Seitenwaffe ── */
  {id:'bajonett_gut',art:'ausr',gruppe:'seitenwaffe',label:'Geschliffenes Bajonett',beschr:'+5 Bajonett',vp:100},
  {id:'sabre',art:'ausr',gruppe:'seitenwaffe',frei:2,label:'Sabre briquet',
   beschr:'Der kurze Säbel der Elitekompanien · +4, und ab dem Patent zählt er als gepflegter Säbel',vp:125},
  {id:'degen',art:'ausr',gruppe:'seitenwaffe',frei:7,label:'Offiziersdegen',
   beschr:'Zum Angesehenwerden und einmal je Gefecht zu etwas anderem · „Den Degen ziehen" +6',vp:175},

  /* ── Tornister ── */
  {id:'tornister_gut',art:'ausr',label:'Verstärkter Tornister',beschr:'Mehr Patronen und zwei Tage Proviant — der Anmarsch kostet halb so viel Atem',vp:120},

  /* ── Kleinkram, stapelbar ── */
  {id:'amulett',art:'ausr',label:'Amulett',beschr:'+5 Kaltblütigkeit. Wirkt, weil du glaubst, dass es wirkt.',vp:60},
  {id:'flasche',art:'ausr',label:'Feldflasche mit Schnapsvorrat',beschr:'Belastung sinkt im Winterquartier',vp:75},
  {id:'schreibzeug',art:'ausr',label:'Schreibzeug',
   beschr:'Feder, Tinte, ein Bogen zum Üben · Bildung wächst schneller — der kürzeste Weg zur Offiziersschwelle',vp:75},
  {id:'uhr',art:'ausr',frei:5,label:'Taschenuhr',
   beschr:'Wer die Zeit hat, hat die Salve · +4 auf Drill-Proben im Gefecht',vp:90},
  {id:'besteck',art:'ausr',label:'Chirurgenbesteck',
   beschr:'+5 Feldchirurgie, und am Verbandsplatz hilft es wirklich',vp:100},
  {id:'fernrohr',art:'ausr',frei:7,label:'Fernrohr',
   beschr:'Es zeigt, was sonst nur gemeldet wird — im Sturm, auf der Skizze, auf der Karte · +4 Taktik',vp:150},

  /* ── Geld ── */
  {id:'geld',art:'geld',gruppe:'geld',label:'50 Francs Startgeld',beschr:'Bares in der Tasche',vp:75},
  {id:'geld_gross',art:'geld',gruppe:'geld',frei:9,label:'200 Francs Startgeld',
   beschr:'Genug, um eine Kompanie zu beschuhen, ohne die Kasse anzurühren',vp:225},

  /* ── Papiere ── */
  {id:'empfehlung',art:'ausr',frei:4,label:'Empfehlungsschreiben',
   beschr:'Ein Brief von jemandem, den der Capitaine kennt · er öffnet eine Tür, mehr nicht',vp:150},

  /* ── Das Pferd ── */
  {id:'pferd_land',art:'ausr',gruppe:'pferd',frei:7,label:'Landpferd',
   beschr:'Kein schönes Tier, aber du gehst nicht mehr zu Fuß · Marsch kostet 40 % weniger · 15 F je Kapitel',vp:200},
  {id:'pferd_kav',art:'ausr',gruppe:'pferd',frei:9,label:'Kavalleriepferd',
   beschr:'Es bleibt stehen, wenn geschossen wird, und das ist der ganze Unterschied · 30 F je Kapitel',vp:375},
  {id:'pferd_voll',art:'ausr',gruppe:'pferd',frei:11,label:'Vollblut',
   beschr:'Man sieht dich von weitem. Das ist der Vorteil und der Preis · Ruf +1 je Gefecht, +2 Gefahr · 60 F je Kapitel',vp:600},

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
   beschr:'Schuhe halten doppelt so lange, und ein forcierter Marsch nimmt dir weniger Luft',vp:150},
  {id:'zaeh_wasser',art:'zaeh',label:'Er weiß, welches Wasser',
   beschr:'Ruhr, Fieber und Sumpffieber zehren nur halb so stark',vp:175},
  {id:'zaeh_nachzuegler',art:'zaeh',label:'Er bleibt nicht zurück',
   beschr:'In Kriegen, die zwischen den Gefechten töten, kostet dich jede Station drei Punkte weniger',vp:225},
  {id:'zaeh_schlaf',art:'zaeh',label:'Er schläft im Freien',
   beschr:'Der Frost trifft dich eine Stufe milder, als er ist',vp:150},
  {id:'zaeh_narben',art:'zaeh',label:'Alte Narben',
   beschr:'Der Feldscher näht dir nach jedem Gefecht zwei Wunden zu statt einer',vp:200}
];
/* Ob eine Gewohnheit gekauft wurde. Eine Zeile, weil sie an sechs Stellen
   gefragt wird — und alle sechs liegen in der Zermürbung, nicht im Gefecht. */
function zaeh(id){ return !!(typeof S==='object' && S && S.kaeufe && S.kaeufe.includes(id)); }
/* Dasselbe für jeden anderen Posten. `zaeh()` bleibt als eigener Name stehen,
   weil an seinen sechs Stellen die Absicht mitgelesen wird. */
function gekauft(id){ return !!(typeof S==='object' && S && S.kaeufe && S.kaeufe.includes(id)); }

/* ── Freigeschaltet wird durch Erreichtes, nie durch Vorrat ──
   `frei:` prüft gegen `META.bestRang` (läuft dauerhaft über alle Läufe),
   `freiKapitel:` gegen die betretenen Kapitel. **Ein Posten, den man sich
   kaufen kann, weil man reich ist, wäre keine Freischaltung, sondern ein
   Preisschild.**

   Gesperrtes wird **angezeigt**, nicht versteckt: Der Laden ist die einzige
   Stelle, an der ein Spieler sieht, was das Spiel noch hat. */
function ladenFrei(p){
  const m = (typeof META==='object' && META) ? META : null;
  if(p.frei && (!m || (m.bestRang|0) < p.frei)) return false;
  if(p.freiKapitel && !kapitelGesehen(p.freiKapitel, m)) return false;
  return true;
}
/* ── Warum das nicht `bestKapitel[id]` sein darf ──
   **`META.bestKapitel` ist nach Stations-IDs verschlüsselt, nicht nach
   Kampagnen-IDs.** Die erste Fassung schlug die Kampagne direkt darin nach und
   funktionierte nur deshalb, weil in Kapitel 6 zufällig eine *Station* `eylau`
   heißt. Jeder künftige Wert ohne gleichnamige Station hätte den Posten
   **stumm für immer gesperrt** — dieselbe Familie wie der stumme Filter im
   Lager, der siebzehn Prozentpunkte gekostet hat.
   Jetzt wird gegen die Stationsliste der Kampagne geprüft: gesehen ist sie,
   wenn irgendeine ihrer Stationen betreten wurde. */
function kapitelGesehen(id, m){
  const meta = m || ((typeof META==='object' && META) ? META : null);
  if(!meta || !meta.bestKapitel) return false;
  const st = (typeof STATIONEN==='object' && STATIONEN) ? STATIONEN[id] : null;
  if(!st || !st.length) return !!meta.bestKapitel[id];
  return st.some(n => n && n.id && meta.bestKapitel[n.id]);
}
function ladenBedingung(p){
  if(p.frei){
    const r = RANG.find(x=>x.n===p.frei);
    return 'Erst, wenn du einmal ' + (r ? r.name : 'Rang '+p.frei) + ' warst.';
  }
  if(p.freiKapitel){
    const k = KAMPAGNEN.find(x=>x.id===p.freiKapitel);
    return 'Erst, wenn du ' + (k ? k.name+' '+k.jahre : p.freiKapitel) + ' gesehen hast.';
  }
  return '';
}
/* Die Leitern des Ladens, in der Reihenfolge, in der sie angezeigt werden. */
const LADEN_GRUPPEN = [
  ['waffe','Die Waffe','je ein Kauf · der teurere ersetzt den billigeren'],
  ['schuhe','Die Schuhe','der Posten, den jeder zuletzt kauft und zuerst braucht'],
  ['mantel','Uniform und Mantel','was zwischen dir und der Nacht steht'],
  ['seitenwaffe','Die Seitenwaffe','einmal je Laufbahn wichtig, und dann sehr'],
  ['geld','Bares','was in der Tasche ist, wenn der Marketender kommt'],
  ['pferd','Das Pferd','ab dem Patent — und in Russland wird es gegessen']
];
