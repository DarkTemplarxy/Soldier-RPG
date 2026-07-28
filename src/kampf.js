'use strict';
/* Gefecht, Elitekompanie und Beförderung. */

/* ══════════════════ KAMPF ══════════════════ */

function aktionen(){
  const a = [];
  const zw = S.zweig;
  a.push({id:'laden',label:'Laden',cost:'Geschick · Atem −8',aus:()=>K.geladen});
  if(zw==='voltigeur'){
    a.push({id:'zielen',label:'Sorgfältig zielen und feuern',cost:'Muskete +15 · kostet zwei Atemzüge',aus:()=>!K.geladen});
    a.push({id:'feuern',label:'Schnell feuern',cost:'Muskete',aus:()=>!K.geladen});
    a.push({id:'deckung',label:'Deckung wechseln',cost:'Geschick · du bist schwer zu treffen'});
    // Der Plänkler ist gerade der, der sich hinlegt — er steht in keiner Linie,
    // die jemand halten müsste. Ohne diese Wahl war der Zweig der einzige, der
    // nicht verschnaufen konnte.
    a.push({id:'ducken',label:'Flach hinlegen',cost:'Atem +10 · Belastung −2 · kein Schuss, aber auch kein Ziel · höchstens drei Runden am Stück',
      aus:()=> (K.duckFolge||0)>=3});
  } else {
    a.push({id:'feuern',label:'Anlegen und feuern',cost:'Muskete',aus:()=>!K.geladen});
    a.push({id:'ducken',label:'Hinknien',cost:'Atem +10 · Belastung −2 · du schießt nicht, aber sie treffen dich auch schlechter · höchstens drei Runden am Stück',
      aus:()=> (K.duckFolge||0)>=3});
    a.push({id:'halten',label:'Stehenbleiben und die Linie halten',cost:'Kaltblütigkeit'});
  }
  a.push({id:'bajonett',label:zw==='grenadier'?'Bajonett fällen und vorgehen':'Mit dem Bajonett vor',
    cost:(zw==='grenadier'?'Bajonett +10 · ':'Bajonett · ')+'sehr gefährlich',risk:true});
  if(S.rang>=3){
    a.push({id:'salve',label:'Der Korporalschaft Salve befehlen',
      cost:'Autorität · acht Musketen auf einmal — mehr als du allein triffst, und deine bleibt geladen'});
    a.push({id:'luecke',label:'Die Lücke links schließen lassen',
      cost:'Drill · eure Linie verliert weniger Männer · Ruf, wenn es gelingt'});
  }
  a.push({id:'zurueck',label:'Zurückweichen',cost:'Ruf −− · der Kampf ist für dich vorbei',risk:true});
  return a;
}

/* ── Anmarsch: der Weg dorthin, die Lage, das Warten ──
   Zwischen zwei Gefechten liegen Wochen und hunderte Kilometer. Wer direkt aus
   der Szene in die erste Runde fällt, merkt davon nichts. Der Anmarsch kostet
   deshalb auch etwas: Marsch nutzt Schuhe ab und geht auf den Atem. */

/* ── Anerkennung im Gefecht ──
   Ruf entsteht aus dem, was man tut, nicht nur daraus, wie es ausgeht. Jede
   Tat, die jemand sehen konnte, bringt sofort etwas — sichtbar in der
   Seitenleiste, bevor das Gefecht vorbei ist.

   Höchstens drei je Gefecht — mehr sieht in diesem Rauch niemand. Die Grenze
   ist knapp gewählt, weil Ruf die Beförderungswährung ist: Ein Zuschlag von
   drei je Gefecht sind über fünf Gefechte fünfzehn Punkte auf eine Schwelle
   von dreißig, und das ist schon viel. Neu ist außerdem, dass auch ein
   verlorenes Gefecht Ruf bringen kann — gesehen wird man trotzdem.

   *Ein Umweg, der nicht funktioniert hat:* Statt eines Zuschlags war das
   zuerst eine Umverteilung — pauschaler Siegesruf minus vier, bis zu fünf hier
   zurückzuverdienen. Gemessen brach der Caporal-Anteil von 39 % auf 21 % und
   die Überlebensquote von 49 % auf 40 %, weil der Testbot sich nur etwa zwei
   Punkte je Gefecht zurückholt und über den Rang auch der zusätzliche
   Lagerabend wegfiel. Wer das noch einmal versucht, misst beide Zahlen. */
const RUHM_JE_GEFECHT = 3;

function anerkennung(betrag, was){
  const rest = Math.max(0, RUHM_JE_GEFECHT - K.ruhm);
  const gibt = Math.min(betrag, rest);
  if(gibt <= 0) return '';
  K.ruhm += gibt; S.ruf += gibt;
  K.taten.push({was, ruf:gibt});
  return ` <span class="fein">gesehen · Ruf +${gibt}</span>`;
}

/* Die Güte des Gegners in diesem Gefecht — aus der Kampagne, zu der die
   Station gehört. Einmal je Kampfrunde gerufen; die Suche über elf Kampagnen
   ist billiger als ein zweites Feld in jedem Gefechtsdatensatz. */
function feindGuete(n){
  for(const k of KAMPAGNEN)
    if((STATIONEN[k.id]||[]).some(x=>x.id===n.id)) return k.guete||0;
  return 0;
}

function starteKampf(n){
  if(n.anmarsch && !S.anmarschGesehen){
    S.anmarschGesehen = n.id;
    // Der Weg dorthin kostet — in Ägypten mehr als in Italien (anmarschKosten in den Daten)
    const ak = n.anmarschKosten || {verschleiss:0.15, atem:4, belastung:1};
    verschleiss(ak.verschleiss);
    S.atem = Math.max(0, S.atem-ak.atem);
    S.belastung = Math.min(100, S.belastung+ak.belastung);
    atemKlemmen();
    laufSichern();
    zeigeAnmarsch(n);
    return;
  }
  S.anmarschGesehen = null;
  setzeKampf({runde:1, geladen:true, deckung:false, feindMoral:n.feindMoral,
              eigen:100, vorn:false, geschlossen:0, lueckeGelobt:false,
              ruhm:0, taten:[],
              ereignis:null, ereignisZahl:0, gesehen:[], gefahrPlus:0, duckFolge:0,
              protokoll:['Das Gefecht beginnt.'], zielt:false, verluste:0});
  laufSichern();
  zeigeKampf(n.intro);
}

/* Was du über dich selbst weißt, bevor es losgeht. Keine Zahlen, die in der
   Seitenleiste schon stehen — sondern was sie bedeuten. */
function gefechtsbereitschaft(){
  const z = [], m = S.ausr.muskete.zustand, sch = S.ausr.schuhe.zustand;
  if(m<35) z.push('Das Schloss ist braun vom Rost. Ob die Muskete zündet, wird sich zeigen, wenn es darauf ankommt.');
  else if(m<60) z.push('Die Muskete ist gebraucht, aber trocken. Sie hat bisher gezündet.');
  else z.push('Die Muskete ist sauber und geölt. In dieser Armee ist das keine Selbstverständlichkeit.');
  if(sch<25) z.push('Von deinen Schuhen ist wenig übrig. Du hast seit dem Aufbruch nasse Füße und spürst jeden Stein.');
  else if(sch<50) z.push('Die Schuhe halten. Noch.');
  if(S.wunden.length) z.push('Du trägst ' + (S.wunden.length===1?'eine alte Wunde':S.wunden.length+' alte Wunden') +
    ' mit dir: ' + S.wunden.map(w=>esc(w.name)).join(', ') + '.');
  const seuche = S.wunden.filter(x=>x.zehrt);
  if(seuche.length) z.push('Du gehst krank in dieses Gefecht — ' + seuche.map(x=>esc(x.name)).join(' und ') +
    '. Es nimmt dir jeden Tag etwas, und heute ist ein schlechter Tag dafür.');
  if(angeschlagen()) z.push(S.leben <= lebenMax()*0.15
    ? 'Du hast zu viel Blut verloren, um hier zu stehen. Wenn dich heute etwas trifft, war es das.'
    : 'Du bist nicht wiederhergestellt. Was noch nicht zu ist, wird gleich wieder aufgehen.');
  if(ausserAtem()) z.push(S.atem<30
    ? 'Du bist ausgepumpt, bevor der erste Schuss fällt. Unter 30 Atem trifft dich mehr, als dich treffen müsste — das hier wird teuer.'
    : 'Dir geht die Luft aus, bevor es losgeht. Unter 30 wird jede Runde gefährlicher.');
  if(S.belastung>60) z.push('Deine Hände sind nicht ruhig. Du hältst sie an den Riemen, damit es niemand sieht.');
  if(S.kameradschaft>=50) z.push('Links und rechts stehen Männer, die deinen Namen kennen. Das ist keine Kleinigkeit.');
  if(S.rang>=3) z.push('Acht Mann sehen dich an und warten darauf, dass du etwas sagst.');
  else if(S.zweig==='voltigeur') z.push('Du gehst vor der Linie. Wenn es losgeht, steht neben dir niemand.');
  else if(S.zweig==='grenadier') z.push('Die Grenadierkompanie steht vorne. Das ist der Sinn der Bärenfellmütze.');
  return z;
}

function zeigeAnmarsch(n){
  const l = n.lage || {};
  const hoehepunkt = n.haerte > 1;
  const zeilen = [['Gegner',l.gegner],['Auftrag',l.auftrag],['Gelände',l.gelaende],['Dein Platz',l.stellung]]
    .filter(([,v])=>v).map(([k,v])=>`<tr><td class="k">${k}</td><td class="d">${esc(v)}</td></tr>`).join('');
  app.innerHTML = `<div class="stage">${verlauf()}
    <div>${wegband(n)}
      <div class="card"><div class="ch"><span>Anmarsch · ${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
        <div class="cb">
          <div class="prose">${n.anmarsch.map(t=>`<p>${t}</p>`).join('')}</div>
          ${hoehepunkt?`<div class="ergebnis schlecht">Das hier wird kein gewöhnliches Gefecht. Was heute trifft, trifft härter — die Alten reden anders als sonst, und der Feldscher hat seine Karren schon vorn.</div>`:''}
          ${zeilen?`<div class="lage"><div class="lagekopf">Was man weiß</div>
            <table>${zeilen}</table></div>`:''}
          <div class="lage"><div class="lagekopf">Womit du dastehst</div>
            <div class="prose">${gefechtsbereitschaft().map(t=>`<p>${t}</p>`).join('')}</div></div>
        </div></div>
      <div class="orders"><div class="ordbody">
        <button class="ord weiter" onclick="starteKampf(KAPITEL[LAUF.node])">Antreten
          <span class="cost">Danach gibt es keinen Weg zurück, der nicht Ruf kostet</span></button>
      </div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

/* ── Sichtfeld ──
   Das Gefecht als Aufstellung, aus deiner Augenhöhe: unten deine Linie in
   Blau, drüben der Feind in Rot, dazwischen Rauch. Beide Seiten verlieren
   sichtbar Männer — die Zahl der Figuren folgt `feindMoral` und `eigen`, und
   die Waage unten sagt, wohin es gerade kippt.

   Zwei Regeln, die den Ton halten: Du stehst immer dort, wo du hingehörst
   (in der Linie, vor der Linie als Voltigeur, tiefer wenn du kniest oder
   liegst, vorne wenn du mit dem Bajonett vorgegangen bist), und Gefallene
   verschwinden nicht, sie liegen da.

   Alles wird bei jedem Zug neu gezeichnet, deshalb darf hier nichts gewürfelt
   werden: `streu()` ist ein fester Wert je Platz, kein Zufall. */

function sichtfeld(){
  const n = KAPITEL[LAUF.node], zw = S.zweig;
  const rauch = Math.min(1, K.runde/6);
  const feindTeil = Math.max(0, Math.min(1, K.feindMoral / n.feindMoral));
  const eigenTeil = Math.max(0, Math.min(1, (K.eigen==null?100:K.eigen) / 100));

  const streu = (i,a)=>{ const x = Math.sin(i*127.1 + a*311.7)*43758.5453; return x - Math.floor(x); };
  const gefallene = (anz,steht,a)=> new Set(
    Array.from({length:anz},(_,i)=>i).sort((p,q)=>streu(p,a)-streu(q,a)).slice(0, anz-steht));

  /* Geschlossene Ordnung: Die Glieder stehen um eine halbe Teilung versetzt,
     sodass das hintere Glied die Lücken des vorderen füllt — zusammen ergibt
     das die dichte Wand, die eine Linie ausmacht. Einzeln gezählt sind es
     wenige Männer je Glied, im Bild steht eine Linie. */
  const FEIND_JE = 15, EIGEN_JE = 20, PLAENKLER = 5;
  const FEIND = FEIND_JE*2, EIGEN = EIGEN_JE*2;
  const feindWeg = gefallene(FEIND, Math.round(FEIND*feindTeil), 7);
  const eigenWeg = gefallene(EIGEN, Math.round(EIGEN*eigenTeil), 13);

  const ROT = '#c2483a', ROT_TOT = '#5e2a24', BLAU = '#7d93ad', BLAU_TOT = '#3a4655';

  /* Die Kopfbedeckung sagt, wer da steht. 1796 trägt die Linie den Zweispitz,
     die Grenadierkompanie die Bärenfellmütze mit rotem Stutz, der Voltigeur
     denselben Zweispitz wie die Linie. Der Feind trägt den österreichischen
     Kasket. */
  const kopfbedeckung = (x,y,b,f,art)=>{
    if(art==='baer') return `<rect x="${(x-4.6*b).toFixed(1)}" y="${(y-15.5*b).toFixed(1)}" width="${(9.2*b).toFixed(1)}" height="${(11*b).toFixed(1)}" rx="${(4.4*b).toFixed(1)}"/>`+
      `<rect x="${(x+2.6*b).toFixed(1)}" y="${(y-19*b).toFixed(1)}" width="${(1.8*b).toFixed(1)}" height="${(5*b).toFixed(1)}" rx="${(0.9*b).toFixed(1)}" fill="#c2483a"/>`;
    if(art==='kasket') return `<ellipse cx="${x.toFixed(1)}" cy="${(y-8.4*b).toFixed(1)}" rx="${(4.4*b).toFixed(1)}" ry="${(3.4*b).toFixed(1)}"/>`;
    // Zweispitz: breit und flach, quer über dem Kopf getragen
    return `<ellipse cx="${x.toFixed(1)}" cy="${(y-8.6*b).toFixed(1)}" rx="${(7.6*b).toFixed(1)}" ry="${(2.9*b).toFixed(1)}"`+
           ` transform="rotate(-7 ${x.toFixed(1)} ${(y-8.6*b).toFixed(1)})"/>`;
  };

  const mann = (x,y,h,f,o,art,gewehr)=>{
    const b = h/26;
    return `<g opacity="${o}" fill="${f}">`+
      (gewehr!==false ? `<rect x="${(x+3.4*b).toFixed(1)}" y="${(y-13*b).toFixed(1)}" width="${(1.5*b).toFixed(1)}" height="${(h+11*b).toFixed(1)}" rx="${(0.7*b).toFixed(1)}" opacity=".4" transform="rotate(-22 ${(x+3.4*b).toFixed(1)} ${y.toFixed(1)})"/>` : '')+
      `<rect x="${(x-4.4*b).toFixed(1)}" y="${y.toFixed(1)}" width="${(8.8*b).toFixed(1)}" height="${h}" rx="${(3*b).toFixed(1)}"/>`+
      `<circle cx="${x.toFixed(1)}" cy="${(y-3.8*b).toFixed(1)}" r="${(3.4*b).toFixed(1)}"/>`+
      kopfbedeckung(x,y,b,f,art)+
      `</g>`;
  };
  const toter = (x,y,f)=>`<rect x="${(x-7).toFixed(1)}" y="${y.toFixed(1)}" width="14" height="2.6" rx="1.3" fill="${f}" opacity=".55"/>`;

  /* Hinter jedem Glied ein schwacher Streifen: die Masse, aus der die
     Einzelnen ragen — die Linie hört nicht am Bildrand auf. */
  const masse = (y,h,f,o)=>`<rect x="0" y="${(y+h*0.3).toFixed(0)}" width="640" height="${(h*0.7).toFixed(0)}" fill="${f}" opacity="${o}"/>`;

  // Feind: zwei versetzte Glieder, weiter weg und deshalb kleiner
  let feind = masse(48, 15, ROT, .08) + masse(56, 15, ROT, .06);
  for(let g=0;g<2;g++) for(let i=0;i<FEIND_JE;i++){
    const idx = g*FEIND_JE+i, schritt = 640/FEIND_JE;
    const x = 14 + i*schritt + g*schritt/2, y = 48 + g*8;
    feind += feindWeg.has(idx) ? toter(x, y+15, ROT_TOT) : mann(x, y, 15, ROT, g ? 0.5 : 0.9, 'kasket');
  }

  // Eigene Linie: erstes Glied weiter vorn und darum höher, deins darunter
  const meinX = 320, meinGlied = 1;
  const meinHut = S.zweig==='grenadier' ? 'baer' : 'zwei';
  let eigen = masse(130, 22, BLAU, .07) + masse(146, 26, BLAU, .10);
  for(let g=0;g<2;g++) for(let i=0;i<EIGEN_JE;i++){
    const idx = g*EIGEN_JE+i, schritt = 640/EIGEN_JE;
    const x = 8 + i*schritt + (g?0:schritt/2), y = g ? 146 : 130, h = g ? 26 : 22;
    if(zw!=='voltigeur' && g===meinGlied && Math.abs(x-meinX)<schritt*0.6) continue;   // dein Platz
    eigen += eigenWeg.has(idx) ? toter(x, y+h, BLAU_TOT) : mann(x, y, h, BLAU, g ? 1 : 0.6, meinHut);
  }

  // Voltigeure schwärmen aus: wenige, weit auseinander, ohne Ordnung
  let plaenkler = '';
  if(zw==='voltigeur') for(let i=0;i<PLAENKLER;i++){
    const x = 90 + i*(460/(PLAENKLER-1)) + (streu(i,5)-0.5)*48;
    if(Math.abs(x-meinX)<34) continue;
    plaenkler += mann(x, 92 + streu(i,9)*16, 20, BLAU, 0.85, 'zwei');
  }

  // Du, dort wo du hingehörst
  let meinY = zw==='voltigeur' ? 100 : 146, meinH = zw==='voltigeur' ? 20 : 26;
  if(K.vorn){ meinY = 86; meinH = 18; }             // mit dem Bajonett vorgegangen
  if(K.deckung){ meinY += meinH-10; meinH = 10; }   // kniend oder liegend

  /* Pulverdampf steht zwischen den Linien und wird mit jeder Runde dichter —
     feste Plätze, nur die Zahl wächst. */
  let qualm = '';
  for(let i=0;i<Math.round(3+9*rauch);i++){
    const x = 40 + streu(i,17)*560, y = 86 + streu(i,23)*32;
    const r = 16 + streu(i,29)*28;
    qualm += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${r.toFixed(0)}" ry="${(r*0.42).toFixed(0)}"`+
             ` fill="#3a352e" opacity="${(0.10+0.12*streu(i,31)).toFixed(2)}"/>`;
  }

  const uebergewicht = eigenTeil + feindTeil > 0 ? eigenTeil/(eigenTeil+feindTeil) : 0.5;

  return `<svg viewBox="0 0 640 200" role="img"
    aria-label="Aufstellung: ${Math.round(EIGEN*eigenTeil)} eigene Männer gegen ${Math.round(FEIND*feindTeil)} feindliche">
    <defs>
      <linearGradient id="sm" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1a1816" stop-opacity="0"/>
        <stop offset="45%" stop-color="#2b2723" stop-opacity="${(0.35+0.4*rauch).toFixed(2)}"/>
        <stop offset="100%" stop-color="#1a1816" stop-opacity="0"/></linearGradient>
      <radialGradient id="vg" cx="50%" cy="88%" r="62%">
        <stop offset="0%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity=".7"/></radialGradient>
    </defs>
    <rect width="640" height="200" fill="#191715"/>
    <rect x="0" y="84" width="640" height="1" fill="#2a2621"/>
    ${feind}
    <rect x="0" y="66" width="640" height="74" fill="url(#sm)"/>
    ${qualm}
    <text x="320" y="26" text-anchor="middle" fill="#8d8371" font-family="Georgia,serif" font-size="11.5"
      font-style="italic">${K.deckung
        ? (zw==='voltigeur'?'Du liegst. Über dir geht es hinweg.':'Du kniest. Über dir geht es hinweg.')
        : (K.vorn?'Du bist zehn Schritt vor der Linie.':'Rauch. Du siehst keine dreißig Schritt weit.')}</text>
    ${plaenkler}${eigen}
    ${mann(meinX, meinY, meinH, '#d0a75e', 1, meinHut, !K.deckung)}
    <text x="${meinX}" y="${meinY < 130 ? (meinY-13).toFixed(0) : (meinY+meinH+11).toFixed(0)}"
      text-anchor="middle" fill="#d0a75e" font-size="9.5"
      font-family="ui-monospace,monospace" letter-spacing="1">DU</text>
    <rect x="0" y="192" width="640" height="4" fill="${ROT_TOT}"/>
    <rect x="0" y="192" width="${(640*uebergewicht).toFixed(0)}" height="4" fill="#56718f"/>
    <rect x="319" y="189" width="2" height="10" fill="#948a79"/>
    <rect width="640" height="200" fill="url(#vg)"/></svg>`;
}

/* ══════════════════ EREIGNISSE IM GEFECHT ══════════════════

   Die Rundenaktionen sind Handwerk: laden, feuern, knien. Sie stellen keine
   Frage, sie kosten nur Zeit. Ereignisse stellen die Frage, um die es in einem
   Gefecht wirklich geht — **wie weit gehst du**. Jedes hat einen Weg, der
   nichts kostet und nichts bringt, und einen, der Ruf, Nennungen und ein
   kürzeres Gefecht bringt und dich umbringen kann.

   Das ist der Ersatz für das Drehen an Schadenszahlen. Ein kundiger Spieler war
   bis dahin nicht zu töten (40 von 40 Läufen überlebten beide Feldzüge), weil
   optimales Spiel keine Frage mehr offenließ: Salve befehlen, knien, wenn es
   eng wird, fertig. Die Härte darf nicht daher kommen, dass die Kugeln mehr
   wehtun, sondern daher, dass der Weg nach oben durch Stellen führt, an denen
   man auch bleiben kann. Wer nie vortritt, überlebt eher — und verzichtet auf
   Ruf, Nennungen und die Abkürzungen, die ein Gefecht früh entscheiden. (Den
   Caporal gibt Mut allein nicht: Dort ist die Gunst der Engpass, und die holt
   man am Feuer. Mut kauft die Wertung, nicht den Rang.)

   Aufbau wie eine Szene: `probe`, `erfolg`, `misserfolg`. Zusätzlich kennen die
   Wirkungen hier `moral` (Widerstand des Feindes), `leben`, `eigen` (die eigene
   Linie), `gefahr` (für den Rest des Gefechts) und `ende:'sieg'`.

   `wenn(n)` entscheidet, ob ein Ereignis zur Lage passt — die Verfolgung gibt
   es nur, wenn der Feind schon wankt, den Sturm nur, wenn er noch steht. */

const GEFECHTS_EREIGNISSE = [

  {id:'freiwillige', frage:'Der Adjutant sucht acht Mann',
   wenn:(n)=> K.runde<=4 && K.feindMoral > n.feindMoral*0.5,
   text:['Ein Adjutant kommt von rechts durch den Rauch, zu Fuß, ohne Hut. Auf dem Hügel drüben stehen zwei Geschütze, die eure Linie der Länge nach bestreichen, und solange sie stehen, geht hier niemand vor.',
         'Er sagt, er braucht acht Mann. Er sagt nicht, wofür, aber alle wissen es. Neben dir sieht keiner auf.'],
   optionen:[
     {label:'Vortreten', hint:'Die Geschütze vernageln · Bajonett', risk:true,
      probe:{wert:'bajonett', schw:45},
      erfolg:{text:'Ihr geht seitlich den Hang hinauf, durch einen Graben, in dem Wasser steht. Es dauert acht Minuten und ist dann in vierzig Sekunden vorbei. Zwei von euch kommen nicht zurück, und der Adjutant schreibt sich Namen auf.',
              moral:-22, ruf:5, nennung:true, leben:-8, atem:-18, belastung:6,
              tat:'Sich freiwillig zu den Geschützen gemeldet'},
      misserfolg:{text:'Ihr kommt bis auf dreißig Schritt. Dann drehen sie das rechte Geschütz, und es ist mit Kartätschen geladen. Du liegst hinterher im Graben und weißt nicht, wie lange. Die Geschütze stehen noch.',
              leben:-30, atem:-25, belastung:12}},
     {label:'Stehenbleiben', hint:'Es meldet sich schon jemand',
      erfolg:{text:'Du siehst geradeaus. Acht andere treten vor, darunter zwei aus deiner Korporalschaft. Der Adjutant zählt sie ab und geht. Niemand sagt etwas zu dir, weder jetzt noch später.'}}]},

  {id:'linie', frage:'Die Linie wankt',
   wenn:(n)=> K.eigen < 72 && K.feindMoral > n.feindMoral*0.3,
   text:['Rechts von dir geht ein Glied nach hinten. Nicht gelaufen, nur zwei Schritte, aber zwei Schritte sind der Anfang. Ein Sergent brüllt etwas, das im Lärm nicht ankommt.',
         'Wenn die Linie hier aufgeht, schießt sie von der Seite hinein, und dann ist es kein Gefecht mehr, sondern ein Auflauf.'],
   optionen:[
     {label:'Stehen bleiben und es die anderen sehen lassen', hint:'Kaltblütigkeit', risk:true,
      probe:{wert:'kaltbluetigkeit', schw:40},
      erfolg:{text:'Du bleibst, wo du stehst, und lädst weiter, als wäre nichts. Der Mann links von dir bleibt auch. Dann der nächste. In zwanzig Sekunden steht die Linie wieder da, wo sie stand.',
              moral:-8, ruf:3, eigen:6, tat:'Die Linie gehalten, als sie wankte'},
      misserfolg:{text:'Du bleibst stehen, und du bleibst allein stehen. Zwanzig Schritt vor der Linie, die inzwischen hinter dir ist. Es dauert lange, bis du das merkst, und länger, bis du zurück bist.',
              leben:-22, atem:-15, belastung:10, gefahr:6}},
     {label:'Zwei Schritte mit zurück', hint:'Alle tun es',
      erfolg:{text:'Du gehst mit. Es sind wirklich nur zwei Schritte, und danach steht ihr wieder. Aber ihr steht zehn Schritt weiter hinten als vorher, und drüben haben sie es gesehen.',
              moral:6, ruf:-1, gefahr:-4}}]},

  {id:'sturm', frage:'Sie kommen',
   wenn:(n)=> K.runde>=3 && K.feindMoral > n.feindMoral*0.4,
   text:['Drüben hört das Feuer auf, und das ist schlimmer als das Feuer. Dann kommen sie: zwei Glieder im Laufschritt, das Bajonett vorn, und sie schreien dabei, weil man ohne Schreien nicht auf eine Linie zulaufen kann.',
         'Vierzig Schritt. Für einen Schuss reicht es noch, für zwei nicht.'],
   optionen:[
     {label:'Stehen und sie auf zwanzig Schritt herankommen lassen', hint:'Kaltblütigkeit · dann schießt es sich nicht mehr daneben', risk:true,
      probe:{wert:'kaltbluetigkeit', schw:45},
      erfolg:{text:'Du hältst die Muskete unten und zählst mit. Auf zwanzig Schritt geht die Salve los, und was danach noch steht, dreht um. So nah trifft jeder, auch die, die sonst nichts treffen.',
              moral:-26, ruf:4, tat:'Auf zwanzig Schritt stehen geblieben'},
      misserfolg:{text:'Die Nerven halten bis dreißig Schritt. Dann geht die Salve zu früh und zu hoch los, und sie sind trotzdem da. Was danach kommt, sind Kolben und Bajonette, und es dauert vier Minuten.',
              leben:-28, atem:-22, belastung:12}},
     {label:'Bajonett fällen und ihnen entgegen', hint:'Bajonett · zwei Linien, die aufeinander zulaufen', risk:true,
      probe:{wert:'bajonett', schw:40},
      erfolg:{text:'Ihr geht ihnen entgegen, und das erwarten sie nicht. Auf halbem Weg treffen sich die Linien, und die ihre bleibt stehen, bevor sie euch erreicht. Danach ist der Boden dazwischen belegt.',
              moral:-30, ruf:4, leben:-10, atem:-20, vorn:true,
              tat:'Dem Sturm entgegengegangen'},
      misserfolg:{text:'Du gehst vor, und die Linie geht nicht mit. Was dann passiert, siehst du hinterher an deinem Ärmel und an dem, was von deinem Tornistergurt übrig ist.',
              leben:-34, atem:-25, belastung:14}},
     {label:'Ins zweite Glied und laden', hint:'Andere stehen vorn',
      erfolg:{text:'Du gehst ein Glied zurück und lädst. Vor dir steht jemand, der jetzt das abbekommt, was sonst dich träfe. Die Linie hält auch ohne dich, gerade so.',
              moral:-6, ruf:-1, gefahr:-6}}]},

  {id:'fahne', frage:'Der Adlerträger fällt',
   wenn:(n)=> K.eigen < 85 && K.feindMoral > n.feindMoral*0.25,
   text:['Der Träger geht nach vorn weg, ohne Zwischenschritt, wie ein Sack. Der Adler kippt und bleibt schräg im Dreck stehen, sechs Schritt vor der Linie, wo niemand steht.',
         'Ein Adler, den die anderen mitnehmen, ist das Ende einer Halbbrigade. Alle sehen hin, und keiner geht.'],
   optionen:[
     {label:'Ihn holen', hint:'Kaltblütigkeit · sechs Schritt ins Freie', risk:true,
      probe:{wert:'kaltbluetigkeit', schw:50},
      erfolg:{text:'Sechs Schritte hin, der Schaft ist warm und klebrig, sechs Schritte zurück. Es geht schneller, als du dachtest. Die Linie brüllt, als du wieder drin stehst, und brüllt weiter, als es längst nichts mehr zu brüllen gibt.',
              moral:-14, ruf:6, nennung:true, eigen:8, leben:-6, atem:-12, gefahr:5,
              tat:'Den Adler aus dem Dreck geholt'},
      misserfolg:{text:'Du kommst bis auf zwei Schritte heran. Was dich trifft, wirft dich über den Schaft, und du liegst mit dem Gesicht in derselben Pfütze wie der Träger. Jemand zieht dich am Kragen zurück; den Adler holt ein anderer.',
              leben:-30, atem:-20, belastung:12}},
     {label:'Weiterladen', hint:'Es ist ein Stück Messing an einem Stock',
      erfolg:{text:'Du lädst. Nach einer halben Minute geht ein Sergent hin und holt ihn, und über den Sergent wird abends geredet. Über dich nicht.'}}]},

  {id:'verwundeter', frage:'Jemand ruft',
   wenn:(n)=> K.eigen < 88,
   text:['Vier Schritt vor der Linie liegt einer und ruft. Nicht laut — er hat keine Luft für laut. Es ist Guérin, oder es ist jemand, der so aussieht wie Guérin, und beides ist im Rauch dasselbe.',
         'Er wird dort liegen bleiben, bis das Gefecht vorbei ist. Danach räumen sie das Feld ab, aber danach ist ein langes Wort.'],
   optionen:[
     {label:'Ihn hereinziehen', hint:'Konstitution · du hast beide Hände voll und keine an der Muskete', risk:true,
      probe:{wert:'konstitution', schw:40},
      erfolg:{text:'Du packst ihn an den Achselriemen und ziehst rückwärts, und er ist schwerer als ein Mann sein sollte. Hinter der Linie lässt du ihn los und deine Arme zittern. Er lebt noch am Abend, und er weiß, wer ihn geholt hat.',
              ruf:2, kameradschaft:12, gunst:1, atem:-16, leben:-4,
              tat:'Einen Verwundeten aus dem Feuer geholt'},
      misserfolg:{text:'Du kommst hin und bekommst ihn hoch, und dann trifft es einen von euch beiden. Du kriechst zurück, allein, und hörst hinter dir, wie das Rufen aufhört.',
              leben:-24, atem:-20, belastung:14, kameradschaft:-4}},
     {label:'Weiterschießen', hint:'Dafür ist nach dem Gefecht Zeit',
      erfolg:{text:'Du legst an und feuerst über ihn hinweg. Das Rufen hört irgendwann von allein auf, und du weißt nicht, woran es liegt. Das Spiel sagt es dir auch nicht.'}}]},

  {id:'verfolgung', frage:'Sie gehen',
   wenn:(n)=> K.feindMoral > 0 && K.feindMoral < n.feindMoral*0.32,
   text:['Es kippt nicht, es reißt. Erst gehen zwanzig, dann geht alles, und was eben noch eine Linie war, ist ein Feld voller Rücken.',
         'Ein Bataillon, das man laufen lässt, steht morgen wieder da. Aber wer nachsetzt, hat keine Linie mehr um sich, und drüben stehen noch Reserven, die niemand gesehen hat.'],
   optionen:[
     {label:'Nachsetzen', hint:'Konstitution · das Gefecht sofort entscheiden', risk:true,
      probe:{wert:'konstitution', schw:45},
      erfolg:{text:'Ihr geht hinterher, so schnell es mit sechzig Pfund geht, und nehmt zweihundert Mann und vier Karren. Danach steht ihr keuchend auf einem Acker, und drüben ist niemand mehr, der etwas dagegen hätte.',
              ende:'sieg', ruf:5, nennung:true, atem:-28, belastung:6,
              tat:'Nachgesetzt, bis nichts mehr stand'},
      misserfolg:{text:'Zweihundert Schritt weit geht es gut. Dann kommt aus dem Wäldchen rechts eine Schwadron, die dort die ganze Zeit gestanden hat, und ihr steht ohne Linie und ohne Ordnung im Freien. Der Rückweg kostet mehr als der Hinweg.',
              leben:-30, atem:-30, belastung:14, eigen:-14}},
     {label:'Stehenbleiben und die Ordnung halten', hint:'Sie sind weg, das reicht',
      erfolg:{text:'Der Sergent lässt halten und richten. Drüben verschwinden sie hinter der Kuppe, und ihr steht in Reih und Glied auf einem Feld, auf dem sonst nichts mehr steht.',
              moral:-10}}]}
];

/* ── Sondermissionen ──
   Vier Gefechte haben ein Ereignis, das es nur dort gibt (`nur:` trägt die
   Stations-ID). Es ist der Moment, für den das Gefecht berühmt ist, aus der
   Höhe eines Mannes im zweiten Glied gesehen: die Brücke von Lodi, der General
   im Sumpf von Arcole, der Riss im Karree von Embabeh, die Sturmkolonne von
   Akkon. Beim Würfeln haben sie Vorrang und eine höhere Chance (60 % je Runde
   statt 45 %) — eine Sondermission, die fast nie stattfindet, wäre keine.
   Historische Fixpunkte bleiben fix (Invariante 8): Auch wer die Bresche von
   Akkon überlebt, nimmt Akkon nicht ein. */

GEFECHTS_EREIGNISSE.push(
  {id:'lodi_bruecke', nur:'lodi', frage:'Die Brücke',
   wenn:(n)=> K.feindMoral > n.feindMoral*0.35,
   text:['Die Kolonne steht auf der Brücke und kommt nicht vor. Zweihundert Schritt Holz, drüben vierzehn Geschütze, und die schießen die Länge der Brücke aus, nicht die Breite. Vorn fallen Grenadiere, und die dahinter treten auf sie, weil es keinen anderen Platz für die Füße gibt.',
         'Am Brückenkopf steigen Offiziere von den Pferden und stellen sich an die Spitze, als wäre das ihr Platz. Einer davon ist klein und wird nach heute einen Beinamen haben. Es heißt, fünfzig Schritt flussab sei eine Furt.'],
   optionen:[
     {label:'Mit in die Spitze der Kolonne drängen', hint:'Wo die Offiziere stehen', risk:true,
      kette:[
        {name:'Der Lauf', wert:'kaltbluetigkeit', schw:45, schaden:14,
         gut:'Die Kolonne läuft an, und du läufst in der zweiten Reihe, wo man nicht denken muss, nur Schritt halten. Das Holz unter den Füßen zittert von den Einschlägen.',
         schlecht:'Auf der Brückenmitte fegt es die Reihe vor dir weg, und du gehst über Männer, die noch warm sind. Etwas wirft dich gegen das Geländer und nimmt ein Stück von dir mit.'},
        {name:'Der Brückenkopf', wert:'bajonett', schw:40, schaden:14,
         gut:'Drüben stehen die Kanoniere mit Wischern und Handspaken gegen Bajonette. Es ist kurz und hässlich, und dann gehören die Geschütze euch.',
         schlecht:'Am Brückenkopf steht noch eine Reihe, und ihr Feuer geht auf zehn Schritt in euch hinein.'}],
      tod:'Du bleibst auf den Balken liegen, das Gesicht zur Adda. Die Kolonne geht über dich hinweg, weil die Brücke schmal ist und der Sieg drüben liegt.',
      todesart:'Gefallen auf der Brücke von Lodi',
      erfolg:{text:'Drüben stehst du zwischen den erbeuteten Geschützen und hörst dein eigenes Blut in den Ohren. Hinter dir kommt die ganze Armee über die Brücke, und der kleine General sieht sich die Männer der Spitze einzeln an.',
              moral:-24, ruf:6, nennung:true, atem:-20, belastung:6,
              tat:'In der Spitze über die Brücke von Lodi'},
      misserfolg:{text:'Drüben bist du trotzdem — als einer von denen, die getragen wurden. Gesehen hat man dich in der Spitze, und das zählt; was es gekostet hat, trägst du selbst.',
              ruf:2, atem:-22, belastung:12,
              tat:'Mit der Spitze auf die Brücke von Lodi'}},
     {label:'Durch die Furt unterhalb der Brücke', hint:'Bis zur Brust in der Adda', risk:true,
      probe:{wert:'geschick', schw:40},
      erfolg:{text:'Zu zwanzig steigt ihr in den Fluss, die Patronentasche über dem Kopf. Die Adda zieht an den Beinen, aber sie trägt euch nicht weg, und ihr kommt schräg unter dem Ufer heraus, wo die Geschütze nicht hinsehen. Von der Flanke her ist eine Batterie nur eine Reihe Männer mit Wischern.',
              moral:-16, ruf:3, atem:-16,
              tat:'Durch die Furt in die Flanke der Batterie'},
      misserfolg:{text:'Die Adda ist schneller, als sie aussieht. Sie nimmt dir die Beine weg, und du gehst zweimal unter, bis dich einer am Riemen packt und ans Ufer zerrt — ans eigene. Deine Patronen sind nass, und du hustest Flusswasser, bis das Gefecht vorbei ist.',
              leben:-20, atem:-30, belastung:10}},
     {label:'In der Kolonne bleiben und warten', hint:'Irgendwann geht es vor',
      erfolg:{text:'Du stehst im vierten Glied auf der Brücke und wartest, dass die vor dir gehen. Irgendwann gehen sie. Als du drüben ankommst, ist die Batterie schon genommen — von der Kavallerie, die durch die Furt geritten ist, sagt man später.',
              moral:-6}}]},

  {id:'arcole_sumpf', nur:'arcole', frage:'Der General im Sumpf',
   wenn:()=> K.runde >= 3,
   text:['Auf dem Damm drängt ein Stab nach vorn, mitten ins Feuer, eine Fahne in der Hand — als ließe sich die Kolonne an einem Stück Tuch vorwärtsziehen. Dann flutet die Kolonne zurück, drückt den Stab an den Dammrand, und der kleine General liegt im Sumpf, bis zur Brust im braunen Wasser.',
         'Die Kroaten sind sechzig Schritt entfernt und laden. Zwei Adjutanten springen hinterher. Es reicht nicht.'],
   optionen:[
     {label:'Hinunter und mit anfassen', hint:'Der Sumpf will euch beide', risk:true,
      kette:[
        {name:'Hinunter', wert:'konstitution', schw:45, schaden:12,
         gut:'Du springst vom Damm und stehst bis zu den Hüften im Schlamm, der nicht loslässt, aber trägt. Zwei Schritte, dann hast du seinen Arm.',
         schlecht:'Der Sumpf nimmt dich sofort bis zur Brust, und die erste Minute geht dafür drauf, nicht selbst zu versinken.'},
        {name:'Heraus, unter Feuer', wert:'kaltbluetigkeit', schw:40, schaden:14,
         gut:'Zu dritt zerrt ihr ihn heraus, Zug um Zug, während es flach über das Wasser wegschlägt. Oben sitzt er einen Atemzug lang im Dreck, dann ist er wieder General.',
         schlecht:'Die Kroaten haben euch im Wasser, und Wasser ist keine Deckung. Neben dir hört ein Adjutant auf zu ziehen.'}],
      tod:'Der Sumpf von Arcole gibt nicht alles zurück. Den General ziehen sie heraus; nach dir wird morgen gesucht, wenn Zeit ist.',
      todesart:'Im Sumpf von Arcole geblieben',
      erfolg:{text:'Auf dem Damm sieht er dich an, einen Atemzug lang, Schlamm bis zum Kinn. Jemand hat deinen Namen gefragt und aufgeschrieben. Mehr passiert nicht, und mehr braucht es nicht.',
              ruf:6, nennung:true, atem:-25,
              tat:'Den General aus dem Sumpf von Arcole gezogen'},
      misserfolg:{text:'Herausgezogen haben ihn andere — und dich auch. Aber du warst im Wasser, als es darauf ankam, und die auf dem Damm haben es gesehen.',
              ruf:2, atem:-30, belastung:10,
              tat:'In den Sumpf von Arcole gesprungen'}},
     {label:'Auf dem Damm bleiben und Deckung schießen', hint:'Muskete · die Kroaten kurz ducken lassen',
      probe:{wert:'muskete', schw:40},
      erfolg:{text:'Du kniest an der Dammkante und feuerst auf alles, was drüben den Kopf hebt. Es sind die längsten zwei Minuten des Tages, aber die Kroaten schießen auf dich statt auf die Männer im Sumpf. Das war der Zweck.',
              moral:-12, ruf:2, tat:'Den Männern im Sumpf Deckung geschossen'},
      misserfolg:{text:'Deine Muskete versagt beim zweiten Schuss — nasses Pulver, der Sumpf ist überall. Du stehst nutzlos an der Kante, während unten gezogen und geschrien wird.',
              leben:-16, atem:-10, belastung:8}},
     {label:'Weitergehen', hint:'Adjutanten gibt es genug',
      erfolg:{text:'Du gehst weiter, wie fast alle. Sie ziehen ihn auch ohne dich heraus — dafür sind Adjutanten da. In den Berichten wird der Sumpf hinterher trockener sein und der Damm breiter.'}}]},

  {id:'pyramiden_riss', nur:'pyramiden', frage:'Der Riss im Karree',
   wenn:()=> K.runde >= 2,
   text:['Ein Mamluk setzt sein Pferd mitten auf die zweite Front, wo ein Gefallener eine Lücke gelassen hat. Das Pferd steigt in die Bajonette, schlägt aus, und auf einmal ist ein Loch im Karree, drei Mann breit — und ein Karree mit Loch ist keins mehr.',
         'Hinter ihm wenden dreißig Reiter. Sie haben es gesehen.'],
   optionen:[
     {label:'Mit dem Bajonett in die Lücke', hint:'Du bist der Nächste am Loch', risk:true,
      kette:[
        {name:'In die Lücke', wert:'bajonett', schw:40, schaden:14,
         gut:'Du stehst im Loch, bevor du dich entschieden hast. Der Reiter geht über dir hoch, und du stößt zu, wohin der Sergent es dich gelehrt hat — ins Pferd, nicht in den Mann.',
         schlecht:'Der Krummsäbel kommt von oben, wo dein Bajonett nicht ist, und reißt dich halb um.'},
        {name:'Standhalten', wert:'konstitution', schw:40, schaden:14,
         gut:'Drei Atemzüge stehst du allein in der Lücke, gegen alles, was hineinwill. Dann sind links und rechts wieder Schultern, und das Karree ist zu.',
         schlecht:'Das stürzende Pferd drückt dich nieder, und was über dich wegsteigt, fragt nicht, wo du hingehörst.'}],
      tod:'Das Karree schließt sich wieder — über dir. Von außen sieht es aus, als wäre nichts gewesen, und genau das ist der Sinn eines Karrees.',
      todesart:'Im Karree bei Embabeh gefallen',
      erfolg:{text:'Draußen dreht die Welle ab, dreißig Reiter auf einmal, weil das Loch zu ist, bevor sie da sind. Der Capitaine hat es gesehen. Das Karree hat es gesehen. Das reicht für einen Abend, an dem niemand fragt, warum du zitterst.',
              moral:-20, ruf:4, eigen:8,
              tat:'Das Karree bei Embabeh geschlossen'},
      misserfolg:{text:'Über dich hinweg schließen andere die Lücke. Du liegst zwischen den Beinen des zweiten Glieds und siehst den Himmel zwischen dreißig Hüten — aber gesprungen bist du, und das haben sie gesehen.',
              ruf:2, eigen:-4, atem:-15, belastung:10,
              tat:'In die Lücke des Karrees gesprungen'}},
     {label:'Das zweite Glied hineinziehen', hint:'Drill · Männer schieben statt selbst stehen',
      probe:{wert:'drill', schw:35},
      erfolg:{text:'Du packst zwei Mann an den Riemen und stellst sie in das Loch, wie man Steine in eine Mauer setzt. Es ist nicht tapfer, es ist Handwerk, und es macht das Karree zu, bevor die dreißig da sind.',
              moral:-8, ruf:2, eigen:6},
      misserfolg:{text:'Du zerrst am Falschen, er zerrt zurück, und drei Atemzüge lang ist das Loch größer statt kleiner. Dann macht es ein Sergent mit dem Kolben zu — das Loch und die Diskussion.',
              leben:-16, eigen:-8, belastung:8}},
     {label:'Ducken und die Flanken schießen lassen', hint:'Das Karree hat vier Seiten',
      erfolg:{text:'Du machst dich klein und lädst. Die Flanken feuern schräg vor das Loch, und irgendwer anders wirft sich hinein. Das Karree hält — es hält nur ohne dich, und die daneben wissen es.',
              eigen:-6, ruf:-1}}]},

  {id:'akkon_bresche', nur:'akkon', frage:'Die Sturmkolonne',
   wenn:(n)=> K.feindMoral > n.feindMoral*0.5,
   text:['Vor der Bresche wird eine Sturmkolonne gesammelt. Die Bresche ist zwanzig Schritt breit und sieht von hier aus wie ein Tor; wer näher war, sagt, dahinter stehe eine zweite Mauer, und auf der stünden die Engländer von den Schiffen.',
         'Die letzten zwei Kolonnen sind nicht zurückgekommen. Der Branntwein wird vorab ausgegeben, das sagt alles.'],
   optionen:[
     {label:'Sich melden', hint:'Doppelter Sold, wenn es einen Abend danach gibt', risk:true,
      kette:[
        {name:'Die Rampe', wert:'geschick', schw:40, schaden:14,
         gut:'Die Schuttrampe nimmst du im Zickzack, immer dorthin, wo es gerade eingeschlagen hat — dort schlägt es so schnell nicht wieder ein.',
         schlecht:'Auf der Rampe reißt es dich von den Beinen, und du rutschst ein Stück zurück, über Schutt, der aus Mauer und Männern besteht.'},
        {name:'Die Bresche', wert:'bajonett', schw:45, schaden:16,
         gut:'Oben ist die Bresche eng, und was darin steht, will sie halten. Du stößt zu, zweimal, und dann stehst du in der Öffnung — und siehst die zweite Mauer, von der keiner gesprochen hat, der sie nicht gesehen hat.',
         schlecht:'In der Bresche kommt es von zwei Seiten zugleich. Du wehrst ab, was du siehst, und was du nicht siehst, trifft dich an der Schulter.'},
        {name:'Der Rückweg', wert:'kaltbluetigkeit', schw:45, schaden:14,
         gut:'Der Rückzugsbefehl kommt, und du gehst rückwärts die Rampe hinunter, das Gesicht zur Mauer, Schritt für Schritt. Wer rennt, fällt.',
         schlecht:'Beim Rückzug rennst du, wie fast alle rennen, und die Mauer schießt euch in die Rücken.'}],
      tod:'Auf dem Schutt der Rampe bleibst du liegen, zwischen denen von gestern und vorgestern. Akkon fällt nicht — und du drei Wochen vor allen anderen.',
      todesart:'Gefallen in der Bresche von Akkon',
      erfolg:{text:'Du bist einer von neun, die zurückkommen. Der Adjutant, der die Namen aufschreibt, fragt zweimal nach, weil deine Stimme nicht mehr trägt. Doppelter Sold, ein Satz im Tagesbefehl — und das Wissen, dass hinter der Bresche eine zweite Mauer steht.',
              moral:-22, ruf:7, nennung:true, geld:6, atem:-22, belastung:8,
              tat:'Mit der Sturmkolonne in der Bresche von Akkon'},
      misserfolg:{text:'Du kommst zurück, gezogen von einem, dessen Gesicht du nie gesehen hast. Der doppelte Sold wird trotzdem gezahlt. Vom Branntwein spürst du nichts mehr.',
              ruf:2, geld:6, atem:-25, belastung:14,
              tat:'Mit der Sturmkolonne vor der Bresche von Akkon'}},
     {label:'Die Leitern bis an den Graben tragen', hint:'Konstitution · nicht hinein, nur hin',
      probe:{wert:'konstitution', schw:40},
      erfolg:{text:'Vier Mann je Leiter, im Laufschritt durch das Vorfeld, ablegen, zurück. Es ist Trägerarbeit unter Feuer, und niemand nennt sie im Tagesbefehl — aber ohne die Leitern läuft niemand irgendwo hinauf.',
              moral:-8, ruf:3, geld:3, atem:-14},
      misserfolg:{text:'Auf halbem Weg schlägt es in die Leiter, und die Leiter schlägt in euch. Du bringst das vordere Ende allein bis an den Graben, weil die anderen drei nicht mehr tragen.',
              leben:-20, atem:-18, belastung:10}},
     {label:'Im Graben bleiben und schießen', hint:'Die Mauer ist nicht dein Befehl',
      erfolg:{text:'Du feuerst aus dem Graben auf die Brustwehr, damit drüben die Köpfe unten bleiben. Die Kolonne läuft an dir vorbei die Rampe hinauf. Was von ihr zurückkommt, kommt einzeln.'}}]}
);

/* Höchstens zwei je Gefecht, frühestens ab der zweiten Runde, und jedes nur
   einmal. Ohne die Obergrenze würde ein langes Gefecht (Akkon: neun Runden) zu
   einer Ereigniskette, und die Frage „wie weit gehst du" nutzt sich ab, wenn
   sie fünfmal hintereinander kommt. Sondermissionen (`nur`) kommen zuerst und
   öfter; die allgemeinen Ereignisse füllen auf. */
/* Wer gesehen wurde, wird geholt: Ruf zieht Ereignisse an. Der Adjutant sucht
   keine Unbekannten, und die Lücke im Glied schließt der, dessen Name schon
   einmal gefallen ist. Ab Ruf 30 — derselben Schwelle, an der der Caporal
   hängt — kommt sogar ein drittes Ereignis in Frage.

   Das trifft gezielt den Aufsteiger und lässt den Vorsichtigen in Ruhe, und
   genau so soll es sein: Ehrgeiz koppelt sich an Blut, ohne dass jemand
   gezwungen wird. */
function ereignisWuerfeln(n){
  const gesehen = K.gesehen || (K.gesehen = []);   // Läufe aus Fassung 2 kennen das Feld noch nicht
  K.ereignisZahl = K.ereignisZahl || 0;
  const hoechstens = S.ruf >= CAPORAL_RUF ? 3 : 2;
  if(K.ereignisZahl >= hoechstens || K.runde < 2) return null;
  const zieht = Math.min(0.65, 0.45 + S.ruf/400);
  const sonder = GEFECHTS_EREIGNISSE.find(e => e.nur === n.id && !gesehen.includes(e.id) && e.wenn(n));
  if(sonder && Math.random() < 0.6) return sonder;
  if(Math.random() > zieht) return null;
  const moeglich = GEFECHTS_EREIGNISSE.filter(e => !e.nur && !gesehen.includes(e.id) && e.wenn(n));
  if(!moeglich.length) return null;
  return moeglich[Math.floor(Math.random()*moeglich.length)];
}

function zeigeEreignis(e){
  const n = KAPITEL[LAUF.node];
  const opt = e.optionen.map((o,i)=>{
    const proben = o.kette
      ? ' · ' + o.kette.map(st=>NAMEN[st.wert]+' '+wert(st.wert)+' gegen '+st.schw).join(' · ')
      : (o.probe ? ' · '+NAMEN[o.probe.wert]+' '+wert(o.probe.wert)+' gegen '+o.probe.schw : '');
    return `<button class="ord ${o.risk?'risk':''}" onclick="ereignisWaehlen(${i})">
    ${esc(o.label)}<span class="cost">${esc(o.hint||'')}${proben}</span></button>`;
  }).join('');
  app.innerHTML = `<div class="stage">${verlauf()}
    <div><div class="card"><div class="ch"><span>${esc(e.frage)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb">${sichtfeld()}
        <div class="prose" style="margin-top:15px">${e.text.map(t=>`<p>${t}</p>`).join('')}</div>
        <div class="probe" style="margin-top:12px">RUNDE ${K.runde} VON ${n.runden}
          · WIDERSTAND DES FEINDES ${Math.max(0,Math.round(K.feindMoral))}
          · EURE LINIE ${Math.max(0,Math.round(K.eigen==null?100:K.eigen))}</div>
        ${balken('b-red',Math.max(0,K.feindMoral),n.feindMoral)}
      </div></div>
      <div class="orders"><div class="ch"><span>Was tust du?</span></div><div class="ordbody">${opt}</div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

/* Die Wirkung eines Ereignisses. Ruf kommt hier an `anerkennung()` vorbei und
   damit an der Obergrenze von drei je Gefecht: Die gilt für Handlungen, die man
   jede Runde wiederholen kann, und soll das Einsammeln verhindern. Ein Ereignis
   kommt höchstens einmal und stellt eine Frage, die etwas kostet — es ist genau
   das, wofür „besondere Dinge am Gefechtsende" gedacht war. */
function ereignisWirkung(w){
  if(w.moral) K.feindMoral += w.moral;
  if(w.eigen) K.eigen = Math.max(0, Math.min(100, K.eigen + w.eigen));
  if(w.gefahr) K.gefahrPlus = (K.gefahrPlus||0) + w.gefahr;
  if(w.leben) S.leben = Math.max(0, S.leben + w.leben);
  if(w.atem) S.atem = Math.max(0, Math.min(100, S.atem + w.atem));
  if(w.belastung) S.belastung = Math.max(0, Math.min(100, S.belastung + w.belastung));
  if(w.kameradschaft) S.kameradschaft = Math.max(0, Math.min(100, S.kameradschaft + w.kameradschaft));
  if(w.gunst) S.gunst = Math.max(0, S.gunst + w.gunst);
  if(w.ruf) S.ruf = Math.max(0, S.ruf + w.ruf);
  if(w.nennung) S.nennungen++;
  if(w.vorn) K.vorn = true;
  if(w.tat && w.ruf > 0) K.taten.push({was:w.tat, ruf:w.ruf});
  atemKlemmen();
}

function ereignisWaehlen(i){
  const n = KAPITEL[LAUF.node];
  const e = GEFECHTS_EREIGNISSE.find(x=>x.id===K.ereignis);
  const o = e.optionen[i];
  K.ereignis = null;
  S.log.push(n.id+': '+o.label);   // steht auf dem Chronikblatt unter der Station

  let text, w;
  if(o.kette){
    /* Eine Sondermission ist keine einzelne Probe, sondern ein Gang: zwei oder
       drei Stufen, jede mit eigener Probe, und jeder Fehlschlag kostet sofort
       Blut (Stufenschaden 12–20). Wer unterwegs auf null fällt, fällt dort —
       mit dem Todestext der Mission, nicht dem allgemeinen. Zurück gibt es ab
       der ersten Stufe nicht mehr; genau das unterscheidet den Gang vom
       Rundengeschäft, aus dem man sich jede Runde neu entscheiden kann.
       Die Wirkung am Ende braucht die Mehrheit der Stufen; auch der
       Misserfolg gibt Ruf +2 — hingegangen ist hingegangen. */
    const zeilen = []; let treffer = 0;
    for(const st of o.kette){
      const p = probe(st.wert, st.schw);
      let schaden = 0;
      if(p.erfolg) treffer++;
      else { schaden = st.schaden + Math.floor(Math.random()*5); S.leben = Math.max(0, S.leben - schaden); }
      atemKlemmen();
      zeilen.push((p.erfolg?st.gut:st.schlecht) +
        ` <span class="fein">${NAMEN[st.wert]} — ${p.erfolg?'gelungen':'misslungen'}${schaden?' · Leben −'+schaden:''}</span>`);
      K.protokoll.push(st.name + (p.erfolg?' — gelungen':' — misslungen'));
      if(S.leben <= 0){
        kampfEnde(false, zeilen.join(' ') + ' ' + (o.tod||''));
        toetlich(o.todesart || ('Gefallen bei '+n.datum.split(' · ')[1]));
        zeigeTod(); return;
      }
    }
    w = (treffer*2 > o.kette.length) ? o.erfolg : (o.misserfolg || o.erfolg);
    text = zeilen.join(' ') + '<br><br>' + w.text;
  } else {
    const p = o.probe ? probe(o.probe.wert, o.probe.schw) : {erfolg:true};
    w = p.erfolg ? o.erfolg : (o.misserfolg || o.erfolg);
    text = w.text;
    K.protokoll.push(esc(o.label) + (o.probe ? (p.erfolg?' — gelungen':' — misslungen') : ''));
  }
  ereignisWirkung(w);

  if(S.leben <= 0){
    kampfEnde(false, text + ' Du setzt dich hin, weil du nicht anders kannst, und stehst nicht wieder auf.');
    toetlich('Gefallen bei '+n.datum.split(' · ')[1]);
    zeigeTod(); return;
  }
  if(w.ende==='sieg' || K.feindMoral <= 0){ kampfEnde(true, text); return; }
  K.runde++;
  if(K.runde > n.runden){
    const knapp = K.feindMoral < n.feindMoral*0.35;
    kampfEnde(knapp, text + (knapp?' Und dann ist es plötzlich vorbei.':' Es wird dunkel, und nichts ist entschieden.'));
    return;
  }
  laufSichern();
  zeigeKampf(text);
}

function zeigeKampf(text){
  const n = KAPITEL[LAUF.node];
  const opt = aktionen().map(a=>`<button class="ord ${a.risk?'risk':''}" onclick="kampfAktion('${a.id}')"
      ${a.aus&&a.aus()?'disabled':''}>${a.label}<span class="cost">${a.cost}</span></button>`).join('');
  app.innerHTML = `<div class="stage">${verlauf()}
    <div><div class="card"><div class="ch"><span>Sichtfeld</span><span>${esc(n.datum)}</span></div>
      <div class="cb">${sichtfeld()}
        <div class="prose" style="margin-top:15px"><p>${text}</p></div>
        ${ausserAtem()?`<p class="warnung">Du bekommst keine Luft mehr. ${S.atem<30?'Jeder Handgriff dauert zu lange, und du bist ein leichteres Ziel.':'Noch geht es — aber nicht mehr lange.'} <b>Atem ${S.atem}</b> · ${S.zweig==='voltigeur'?'Flach hinlegen':'Hinknien'} bringt +10.</p>`:''}
        <div class="probe" style="margin-top:12px">RUNDE ${K.runde} VON ${n.runden}
          · WIDERSTAND DES FEINDES ${Math.max(0,Math.round(K.feindMoral))}
          · EURE LINIE ${Math.max(0,Math.round(K.eigen==null?100:K.eigen))}</div>
        ${balken('b-red',Math.max(0,K.feindMoral),n.feindMoral)}
        <div class="log" style="margin-top:14px">${K.protokoll.slice(-5).reverse().map(z=>`<div>${z}</div>`).join('')}</div>
      </div></div>
      <div class="orders"><div class="ch"><span>Was tust du?</span></div><div class="ordbody">${opt}</div></div>
    </div>${seitenleiste()}</div>`;
}

function kampfAktion(id){
  const n = KAPITEL[LAUF.node]; let text = '', schaden = 0, gefahrMod = 0;
  const zw = S.zweig;

  if(id==='laden'){
    const p = probe('geschick', 30);
    S.atem = Math.max(0,S.atem-8);
    if(p.erfolg){ K.geladen=true; text='Patrone auf, Pulver, Kugel, Ladestock. Die Muskete ist geladen.'; }
    else { text='Die Patrone rutscht dir durch die Finger. Du musst eine neue nehmen.'; S.atem=Math.max(0,S.atem-4); }
  }
  else if(id==='feuern' || id==='zielen'){
    const sorgfalt = (id==='zielen');
    const p = probe('muskete', sorgfalt? 20 : 35);
    K.geladen = false;
    S.atem = Math.max(0, S.atem - (sorgfalt?10:5));
    if(p.erfolg){ schaden = sorgfalt? 22+Math.random()*10 : 12+Math.random()*8;
      text = (sorgfalt? 'Du liegst still, atmest aus und drückst ab. Drüben fällt einer, und du weißt, dass er dir gehört.'
                      : 'Du feuerst in den Rauch. Irgendetwas drüben gerät in Unordnung.')
           + anerkennung(sorgfalt?2:1, sorgfalt?'Ein gezielter Schuss, der saß':'Getroffen'); }
    else { text = S.ausr.muskete.zustand<35 ? 'Das Schloss klickt und nichts geschieht. Die Waffe ist verrostet.'
                                            : 'Der Schuss geht zu hoch. In diesem Rauch trifft man mehr durch Zufall als durch Können.'; }
    if(S.ausr.muskete.verschleiss) S.ausr.muskete.zustand = Math.max(0,S.ausr.muskete.zustand-2);
  }
  else if(id==='ducken'){
    /* Verschnaufen ja, verstecken nein: Zwei Runden am Stück fragt niemand.
       Die dritte sieht der Sergent (Ruf −2), eine vierte gibt es nicht — der
       Knopf ist gesperrt, bis man eine Runde lang etwas anderes getan hat.
       Ohne diese Grenze war Knien ein Panzer: −22 Gefahr, Restrisiko ~4 %,
       und ein Gefecht ließ sich vom Boden aus aussitzen. */
    K.duckFolge = (K.duckFolge||0) + 1;
    K.deckung=true; S.atem=Math.min(100,S.atem+10); S.belastung=Math.max(0,S.belastung-2);
    text = zw==='voltigeur'
      ? 'Du gehst flach in eine Ackerfurche, das Gesicht im Dreck, und atmest zum ersten Mal seit zehn Minuten bis unten. Vor der Linie sucht dich jetzt niemand mehr — die eigenen Leute auch nicht.'
      : 'Du gehst auf ein Knie, den Kolben in den Dreck, den Kopf hinter den Rücken des Vordermanns. Hinlegen kann sich in der Linie niemand — das Glied bliebe offen. Man kann nicht ewig knien, aber jetzt gerade schon.';
    if(K.duckFolge===3){
      S.ruf = Math.max(0, S.ruf-2);
      text += zw==='voltigeur'
        ? ' Die dritte Runde im Dreck. Irgendwer wird nachher fragen, wo deine Patronen geblieben sind — die Antwort steht dir ins Gesicht geschrieben. <span class="fein">Ruf −2</span>'
        : ' Die dritte Runde auf dem Knie. Martel sieht her, sagt nichts und merkt es sich. <span class="fein">Ruf −2</span>';
    }
    gefahrMod = -22;
  }
  else if(id==='deckung'){
    const p = probe('geschick', 35);
    if(p.erfolg){ K.deckung=true; gefahrMod=-20; text='Drei Sprünge nach links, hinter einen Weidenstumpf. Wer dort hinschießt, wo du warst, trifft nichts.'; }
    else { text='Du bleibst auf halbem Weg im Freien hängen und musst dich flach machen, wo keine Deckung ist.'; gefahrMod=+10; }
  }
  else if(id==='halten'){
    const p = probe('kaltbluetigkeit', 40);
    K.deckung=false;
    if(p.erfolg){ schaden = 6; S.belastung=Math.max(0,S.belastung-3); nutzen('drill',1);
      text='Du bleibst stehen. Links und rechts bleiben sie auch stehen, weil du stehst. Die Linie hält.'
         + anerkennung(1,'Stehen geblieben, als es darauf ankam'); }
    else { S.belastung=Math.min(100,S.belastung+6);
      text='Du stehst, aber deine Hände zittern so, dass du nichts damit anfangen kannst.'; }
  }
  else if(id==='bajonett'){
    const p = probe('bajonett', zw==='grenadier'?30:45);
    K.deckung=false; S.atem=Math.max(0,S.atem-18); gefahrMod = +26;
    K.vorn = p.erfolg;
    if(p.erfolg){ schaden = 30+Math.random()*14;
      text='Du gehst vor. Es ist laut und kurz und danach stehst du zehn Schritt weiter als vorher.'
         + anerkennung(2,'Mit dem Bajonett vorgegangen'); }
    else { text='Du gehst vor, aber niemand geht mit. Nach fünf Schritten stehst du allein und kehrst um.'; S.belastung+=7; }
  }
  else if(id==='salve'){
    const p = probe('autoritaet', 40);
    if(p.erfolg){ schaden = 26+Math.random()*10; nutzen('drill',1);
      text='„Anlegen — Feuer!" Acht Musketen gehen fast gleichzeitig los. Fast. Aber es reicht.'
         + anerkennung(1,'Eine Salve, die saß'); }
    else { text='Du rufst den Befehl, und drei von acht hören ihn. Das Ergebnis ist ein trauriges Geknatter.'; schaden=6; }
  }
  else if(id==='luecke'){
    /* Der Unterschied zum Hinknien: Das dort schützt dich, das hier deine
       Leute. Die geschlossene Linie hält drei Runden lang die halben Verluste
       aus, und das erste Mal je Gefecht sieht es jemand, der Listen führt. */
    const p = probe('drill', 35);
    if(p.erfolg){
      gefahrMod = -8; K.geschlossen = 3;
      S.kameradschaft = Math.min(100, S.kameradschaft+4);
      let lob = '';
      if(!K.lueckeGelobt){ K.lueckeGelobt = true; lob = ' Der Capitaine geht hinter der Linie durch und sieht es.'
        + anerkennung(1,'Die Linie geschlossen gehalten'); }
      text = 'Du schiebst die Männer zusammen, bis kein Loch mehr in der Linie ist. Deine acht wissen jetzt, wozu du gut bist.'+lob;
    }
    else { text='Sie rücken auf, aber zu langsam, und die Lücke bleibt offen. Durch ein offenes Glied schießt es sich leichter.'; }
  }
  else if(id==='zurueck'){
    S.ruf = Math.max(0, S.ruf-8); S.belastung=Math.min(100,S.belastung+10); S.gekniffen=true;
    kampfEnde(false, 'Du gehst zurück. Niemand hält dich auf, und das ist das Schlimmste daran.');
    return;
  }

  if(id!=='ducken') K.duckFolge = 0;
  if(id!=='bajonett') K.vorn = false;

  /* Die Linie kämpft auch ohne dich — aber gegen einen besseren Gegner weniger
     erfolgreich. Das ist der wirksamste der drei Güte-Hebel und der leiseste:
     Gegen Österreicher 1796 bricht der Feind von allein, gegen Dschesärs
     Garnison steht er, bis *du* etwas tust. Das Gefecht dauert dadurch länger,
     und weil Treffer je Runde kommen, kostet es mehr Blut — ohne dass eine
     einzige Schadenszahl angefasst wurde. Boden bei 30 %, sonst wären die
     späten Kapitel rechnerisch unmöglich (siehe „Warum so niedrig?"). */
  const guete = feindGuete(n);
  const linie = (2 + Math.random()*4) * Math.max(0.3, 1 - guete*0.15);
  K.feindMoral -= schaden + linie;

  /* Und sie verliert dabei Männer. Das ist reine Anzeige — an `eigen` hängt
     keine Probe und keine Gefahr, es macht nur sichtbar, was der Text sagt:
     Drüben wird auch geschossen. Je mehr Widerstand noch steht, desto teurer,
     und gegen einen besseren Gegner teurer als gegen einen schlechten. */
  const geschlossen = K.geschlossen > 0;
  K.eigen = Math.max(0, K.eigen - (2 + Math.random()*3) * (1 + guete*0.15)
    * Math.max(0, K.feindMoral/n.feindMoral) * (geschlossen?0.5:1));
  if(geschlossen) K.geschlossen--;

  K.protokoll.push(text);

  // Feindliche Wirkung
  atemKlemmen();
  let gefahr = n.gefahr + gefahrMod + (K.gefahrPlus||0);
  if(K.deckung && id!=='ducken' && id!=='deckung') K.deckung=false;
  if(S.belastung>60) gefahr += 6;
  if(S.atem<30) gefahr += 5;
  /* Der Platz des Toten. Ein Caporal steht außen am Glied — dort, wo sein
     Vorgänger stand, und die Stelle wurde frei, weil er fiel (Invariante 5,
     von der anderen Seite gesehen). Das wird nie ausgesprochen, nur gespürt.
     Historisch fielen Unteroffiziere überproportional; im Entwurf ist das der
     Preis des Rangs, nicht seine Macht — Invariante 4 bleibt gewahrt, weil
     der Rang weiterhin Knöpfe gibt und hier nur Deckung kostet. */
  if(S.rang>=3) gefahr += 2;
  /* Ein Höhepunkt ist nicht nur teurer, sondern auch dichter: +3 Trefferchance
     je Runde. Das ist der Teil, der auch den Vorsichtigen trifft — beschossen
     wird man, ob man vortritt oder nicht. `haerte` schaltet beides zusammen,
     damit ein Gefecht mit einem einzigen Feld zum Höhepunkt wird. */
  if(n.haerte > 1) gefahr += 3;
  gefahr += feindGuete(n);      // bessere Truppen treffen öfter
  gefahr = Math.max(4, gefahr);
  let treffer = '';
  if(Math.random()*100 < gefahr){
    /* Ein Treffer tötet nicht mehr durch einen eigenen Wurf, sondern zehrt an
       den Lebenspunkten. Der Unterschied ist der ganze Sinn des Umbaus:

       Vorher senkte Konstitution die Todeschance je Treffer — und ab
       Konstitution 58 war sie rechnerisch null (Schwelle 94 + 18/3 > 100). Ein
       Mann, den keine Kugel töten kann, hebelt Invariante 1 aus. Eine Klammer
       auf den Schutz hat das notdürftig geflickt, aber die Kurve blieb falsch:
       Konstitution kaufte Unverwundbarkeit, nicht Zähigkeit.

       Jetzt ist sie monoton. `lebenMax()` wächst mit der Konstitution
       (52 bei 20 · 64 bei 40 · 82 bei 70), der Schaden je Treffer nicht — mehr
       Konstitution heißt also mehr Treffer, die man wegsteckt, aber genug
       Treffer töten jeden. Deshalb darf die Herkunft auch über 70 gehen.

       Geeicht an einer gemessenen Zahl: Ein Mann wird in beiden Feldzügen
       zusammen nur **rund neun Mal** getroffen — 10 Gefechte, 57 Kampfrunden,
       etwa 16 % Trefferchance je Runde. Ein Vorrat, den neun Treffer nicht
       leeren, tötet niemanden; die erste Eichung auf 6 Schaden je Treffer
       ergab gemessen **100 % Überlebende**. Deshalb ist ein Treffer teuer:
       im Mittel 11 Punkte, also stirbt ein Mann mit Konstitution 40 am
       sechsten, einer mit 20 am fünften, einer mit 70 am achten. Das ist auch
       inhaltlich richtig — wer 1796 vier Mal getroffen wird, steht nicht mehr. */
    /* Höhepunkte schlagen härter (`haerte` in den Kapiteldaten): ein bis zwei
       Gefechte je Feldzug, an denen ein Treffer 40 % mehr kostet. Es sind
       dieselben vier, die eine Sondermission tragen — Lodi, Arcole, Embabeh,
       Akkon —, und das ist kein Zufall, sondern der Entwurf: Das Gefecht, für
       das man berühmt wird, ist das, an dem man stirbt. Die Lehrgefechte
       (Montenotte, Alexandria) bleiben Lehrgefechte. Angesagt wird es im
       Lagebild vor dem Anmarsch — überrascht wird niemand. */
    const haerte = n.haerte || 1;
    let schaden;
    if(Math.random()*100 > 75){
      schaden = 15 + Math.floor(Math.random()*11);            // 15–25
      wundeGeben('Schwere Wunde ('+n.datum.split(' · ')[1]+')', 14);
      treffer = ' Ein Schlag gegen die Schulter, dann Nässe im Ärmel. Du kannst den Arm noch bewegen, aber es tut sehr weh.';
      S.atem = Math.max(0,S.atem-20);
    } else {
      /* Der Streifschuss kostet zweierlei, und das ist Absicht: Blut (bleibt)
         und eine Wunde, die der Feldscher nach dem Gefecht zunäht (bleibt
         nicht). Ohne die Wunde stimmte zwar die Todesrechnung, aber ein Mann
         schoss den ganzen Feldzug lang wie am ersten Tag — gemessen stieg der
         Caporal-Anteil von 40 % auf 57 %, weil bessere Gefechte mehr Ruf
         bringen und Ruf die Beförderungsschwelle ist. Der Kratzer soll den
         Rest des Gefechts wehtun, nicht den Rest des Krieges. */
      schaden = 5 + Math.floor(Math.random()*7);              // 5–11
      wundeGeben('Streifschuss', 5);
      treffer = ' Etwas reißt dir den Ärmel auf und brennt. Nicht schlimm. Noch nicht.';
      S.atem = Math.max(0,S.atem-8);
    }
    schaden = Math.round(schaden * haerte);
    S.leben = Math.max(0, S.leben - schaden);
    K.protokoll.push('Du wirst getroffen.');
    if(S.leben <= 0){
      kampfEnde(false, text + treffer + ' Du willst dich abstützen und findest den Boden nicht, wo er sein müsste. Jemand ruft deinen Namen, weit weg.');
      toetlich('Gefallen bei '+n.datum.split(' · ')[1]);
      zeigeTod(); return;
    }
    if(S.leben <= lebenMax()*0.3) treffer += ' Du bist noch auf den Beinen, aber nicht mehr lange.';
    atemKlemmen();
  }

  if(K.feindMoral <= 0){ kampfEnde(true, text+treffer); return; }
  K.runde++;
  if(K.runde > n.runden){
    const knapp = K.feindMoral < n.feindMoral*0.35;
    kampfEnde(knapp, text+treffer+(knapp?' Und dann ist es plötzlich vorbei.':' Es wird dunkel, und nichts ist entschieden.'));
    return;
  }

  /* Ereignis vor der nächsten Runde: Es unterbricht die Handgriffe mit einer
     Frage. Der Text der eben abgeschlossenen Runde steht dabei nicht mehr da —
     er kommt ins Protokoll, damit die Frage die Seite für sich hat. */
  const e = ereignisWuerfeln(n);
  if(e){
    K.ereignis = e.id; K.ereignisZahl++; K.gesehen.push(e.id);
    K.protokoll.push(text + treffer);
    laufSichern();
    zeigeEreignis(e);
    return;
  }

  laufSichern();
  zeigeKampf(text + treffer);
}

function kampfEnde(sieg, letzterText){
  const n = KAPITEL[LAUF.node];
  const erg = sieg ? n.sieg : n.niederlage;

  /* Der Rückzug kostet Blut — je mehr vom Feind noch steht, desto mehr.
     Ohne diese Zeilen war Verlieren gratis: Wer unter 40 % Leben fiel, kniete
     sich hin (−22 Gefahr, Rest ~4 %), ließ die Runden auslaufen und schlief
     sich im Lager wieder hoch. Gemessen: null Tote in 80 Läufen, mutig wie
     vorsichtig. Ein Gefecht, das man nicht gewinnt, muss man verlassen — und
     eine Linie, die rückwärts durchs Feuer geht, lässt Männer liegen. Das ist
     auch die historische Wahrheit: Gefallen wird beim Weichen, nicht im Stehen.
     5–18 Leben je nach Restwiderstand; wen es unter null drückt, der stirbt
     auf dem Rückzug. Damit ist Aussitzen keine Antwort mehr, sondern eine
     Wette darauf, dass die eigene Seite auch ohne dich gewinnt.

     **Und der Zoll wächst mit der Güte des Gegners (28.07.2026).** Das ist die
     Stelle, an der die Progression wirklich beißt, und sie wurde gemessen
     gefunden: Ein Erstlauf-Mann in Ägypten *stirbt* nicht an der höheren
     Gefahr — er kniet sich hin, lässt die Runden auslaufen und **verliert**.
     Bei Güte 5 verlor er reihenweise und überlebte trotzdem 98 %. Wer vor
     Dschesärs Garnison zurückweicht, kommt aber nicht so davon wie vor
     Beaulieus Kolonnen: Die verfolgen. Faktor `1 + guete·0,2`, in Ägypten
     also das Doppelte — 10 bis 36 Leben je verlorenem Gefecht.

     **Das trifft genau den Richtigen.** Ein Veteran gewinnt seine Gefechte und
     zahlt den Zoll nie; ein Rekrut mit Muskete 10 verliert sie und zahlt ihn
     fünfmal. Der Unterschied zwischen erstem und drittem Lauf ist damit nicht
     mehr „etwas mehr Leben", sondern „gewinnen oder nicht". */
  if(!sieg && S.lebt && S.leben > 0){
    const rest = Math.max(0, Math.min(1, K.feindMoral / n.feindMoral));
    K.rueckzug = Math.round((5 + 13*rest) * (1 + feindGuete(n)*0.2));
    S.leben = Math.max(0, S.leben - K.rueckzug);
    if(S.leben <= 0){
      setzeKampf(null);
      toetlich('Gefallen auf dem Rückzug bei '+n.datum.split(' · ')[1]);
      zeigeTod(); return;
    }
  }
  anwenden(erg);
  verschleiss(0.9);
  /* Der Feldscher näht die leichteste Wunde zu — in der Regel den Streifschuss
     des letzten Gefechts. Lebenspunkte gibt er nicht zurück.

     Das ist dieselbe Regel wie beim Atem, und aus demselben Grund: Eine
     Erholung an jeder Station verschenkt genau das, was die Lager knapp machen
     soll. Gemessen mit einem Viertel je Gefecht überlebten **alle sechzig**
     Läufe beide Feldzüge — bei rund neun Treffern im ganzen Spiel wiegt jede
     geschenkte Genesung schwerer als der Schaden. Wer wieder auf die Beine
     will, verbringt einen Lagerabend oder eine Winterwoche damit. */
  // Krankheiten kann er nicht: eine Ruhr näht man nicht zu (`!w.zehrt`)
  const leicht = S.wunden.findIndex(w=>w.abzug<=8 && !w.zehrt);
  if(leicht>=0) S.wunden.splice(leicht,1);
  if(sieg && n.ruhm && S.ruf>=20 && Math.random()<0.6){ S.nennungen++; }
  const kk = K; setzeKampf(null);
  stationErledigt();
  app.innerHTML = `<div class="stage">${verlauf()}
    <div><div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb"><div class="prose"><p>${letzterText}</p></div>
        <div class="ergebnis ${sieg?'gut':'schlecht'}">${erg.text}</div>${wirkungen(erg)}
        ${kk.rueckzug?`<div class="wirkung"><span>Der Rückzug</span>Ihr geht rückwärts aus dem Feuer, und das Feuer geht mit. Wer fällt, bleibt liegen. <b>Leben −${kk.rueckzug}</b></div>`:''}
        ${kk.taten.length?`<div class="lage"><div class="lagekopf">Was gesehen wurde</div>
          ${kk.taten.map(t=>`<div class="tat"><span>${esc(t.was)}</span><b>Ruf +${t.ruf}</b></div>`).join('')}
          ${kk.ruhm>=RUHM_JE_GEFECHT?'<p class="hinweis" style="margin:9px 0 0">Mehr sieht in diesem Rauch niemand.</p>':''}
        </div>`:''}
        <div class="probe" style="margin-top:10px">${sieg?'GEFECHT BESTANDEN':'GEFECHT VERLOREN'} · ${kk.runde} RUNDEN</div>
      </div></div>
      <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="naechster()">Weiter</button></div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

/* ══════════════════ ELITEKOMPANIE ══════════════════ */

function zeigeElite(n){
  const kon = wert('konstitution'), ges = wert('geschick');
  const gr = kon>=55, vo = ges>=55;
  app.innerHTML = `<div class="stage">${verlauf()}
    <div>${wegband(n)}<div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb"><div class="prose">
        <p>Mailand hat der Armee Sold gegeben und Schuhe, und jetzt werden die Bataillone neu geordnet. Jedes bekommt eine Grenadier- und eine Voltigeurkompanie, und die Chefs suchen sich die Männer aus.</p>
        <p>Die Grenadiere nehmen die Großen und die, die stehen bleiben. Die Voltigeure nehmen die Kleinen und die, die schnell sind und allein zurechtkommen.</p>
        <p class="said">Der Adjutant geht die Reihe ab und bleibt vor dir stehen. Er sieht dich an, wie man ein Pferd ansieht.</p>
      </div></div></div>
      <div class="orders"><div class="ch"><span>Wohin</span></div><div class="ordbody">
        <button class="ord" onclick="waehleZweig('grenadier')" ${gr?'':'disabled'}>Zu den Grenadieren
          <span class="cost">Konstitution ${kon} · verlangt 55 · Bärenfellmütze, höherer Sold, die härteste Stelle der Linie</span></button>
        <button class="ord" onclick="waehleZweig('voltigeur')" ${vo?'':'disabled'}>Zu den Voltigeuren
          <span class="cost">Geschick ${ges} · verlangt 55 · Plänkler: zielen, Deckung, allein vor der Linie</span></button>
        <button class="ord" onclick="waehleZweig(null)">In der Füsilierkompanie bleiben
          <span class="cost">Kein Aufstieg, kein Umweg</span></button>
      </div></div>
    </div>${seitenleiste()}</div>`;
}
function waehleZweig(z){
  let text;
  if(z){ S.zweig=z; S.rang=Math.max(S.rang,2); S.ruf+=4;
    text = z==='grenadier'
      ? 'Man misst dich an einem Stab, nickt und schreibt deinen Namen auf die andere Liste. Ab morgen trägst du die Bärenfellmütze, bekommst zwei Sous mehr am Tag und stehst dort, wo es am dicksten kommt.'
      : 'Der Adjutant lässt dich dreißig Schritt laufen und wieder zurück, dann nickt er. Ab morgen gehst du vor der Linie, allein oder zu zweit, und schießt auf das, was du siehst — nicht auf das, wohin alle schießen.';
  } else {
    text = 'Er geht weiter, ohne etwas zu sagen. Du bleibst in der Mitte des Bataillons, wo die meisten bleiben. Es ist keine Schande, nur eben nichts.';
  }
  stationErledigt();
  app.innerHTML = `<div class="stage">${verlauf()}<div>
    <div class="card"><div class="ch"><span>Mailand</span><span>Mai 1796</span></div>
      <div class="cb"><div class="ergebnis ${z?'gut':''}">${text}</div>
      ${z?`<div class="rangzeile" style="margin-top:12px">${rangabzeichen(S)}
        <span class="probe" style="margin:0">NEUER RANG · ${rangName(2).toUpperCase()} · RUF +4</span></div>`:''}</div></div>
    <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="naechster()">Weiter</button></div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

/* ══════════════════ BEFÖRDERUNG ══════════════════ */

/* Schwelle zum Caporal. Beides zusammen, und dazu die Vakanz — siehe CLAUDE.md.
   Wer diese Zahlen ändert, trägt sie dort nach. */
const CAPORAL_RUF = 30, CAPORAL_GUNST = 4;

function zeigeBefoerderung(n){
  /* Der Stand wird beim ersten Betreten der Station eingefroren, je Station —
     seit Kairo gibt es eine zweite Musterung, und die prüft den Stand von
     jetzt, nicht den von Verona. */
  S.befPruefungen = S.befPruefungen || {};
  if(!S.befPruefungen[n.id]) S.befPruefungen[n.id] = {ruf:S.ruf, gunst:S.gunst};
  const {ruf, gunst} = S.befPruefungen[n.id];

  if(S.rang>=3){
    stationErledigt();
    app.innerHTML = `<div class="stage">${verlauf()}<div>${wegband(n)}
      <div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
        <div class="cb"><div class="prose">${(n.text||[]).map(t=>`<p>${t}</p>`).join('')}</div>
        <div class="ergebnis">Du trägst die Streifen schon. Der Capitaine geht die Liste durch, sieht dich kurz an und geht weiter — für mehr als den Caporal braucht es Lesen und Schreiben, und das steht auf einem anderen Blatt.</div>
        </div></div>
      <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="naechster()">Weiter</button></div></div>
      </div>${seitenleiste()}</div>`;
    kopfzeile();
    return;
  }
  const reichtRuf = ruf>=CAPORAL_RUF, reichtGunst = gunst>=CAPORAL_GUNST;
  const bekommt = reichtRuf && reichtGunst;
  let text, klasse;
  if(bekommt){
    S.rang = Math.max(S.rang,3);
    S.ruf += 5;
    text = `Martel — inzwischen Sergent-major — nennt deinen Namen, und der Capitaine schreibt ihn auf. Es gibt keine Zeremonie. Du bekommst zwei Wollstreifen an den Ärmel, acht Mann und die Verantwortung dafür, dass diese acht Mann morgens da sind, Schuhe haben und ihre Musketen zünden.
    <br><br>Der Mann, dessen Stelle du bekommst, heißt Guérin. Er ist bei Castiglione geblieben.`;
    klasse='gut';
  } else if(!reichtRuf){
    text = `Zwei Stellen werden besetzt. Keine mit dir. Der Capitaine kennt deinen Namen nicht, und das ist die ganze Erklärung.
    <br><br><em>Für den Caporal braucht es Ruf ${CAPORAL_RUF} — du hast ${ruf}.</em>`;
    klasse='schlecht';
  } else {
    text = `Dein Name fällt. Er fällt sogar zweimal. Aber niemand am Tisch legt die Hand für dich auf den Tisch, und ohne das geht es nicht.
    <br><br><em>Für den Caporal braucht es einen Fürsprecher — Gunst ${CAPORAL_GUNST}, du hast ${gunst}. Fürsprache sammelt sich in Abenden am Feuer, nicht in einer einzigen Tat.</em>`;
    klasse='schlecht';
  }
  stationErledigt();     // die Entscheidung ist gefallen, bevor der Knopf kommt
  app.innerHTML = `<div class="stage">${verlauf()}<div>${wegband(n)}
    <div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb"><div class="prose">${(n.text||[]).map(t=>`<p>${t}</p>`).join('')}</div>
      <div class="ergebnis ${klasse}">${text}</div>
      <div class="rangzeile" style="margin-top:12px">${bekommt?rangabzeichen(S):''}
        <span class="probe" style="margin:0">VAKANZ VORHANDEN · RUF ${ruf}/${CAPORAL_RUF} · FÜRSPRACHE ${gunst}/${CAPORAL_GUNST} · ${bekommt?'BEFÖRDERT':'ÜBERGANGEN'}</span></div>
      </div></div>
    <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="naechster()">Weiter</button></div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}
