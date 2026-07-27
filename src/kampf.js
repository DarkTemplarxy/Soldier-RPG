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
    a.push({id:'ducken',label:'Flach hinlegen',cost:'Atem +10 · Belastung −2 · kein Schuss, aber auch kein Ziel'});
  } else {
    a.push({id:'feuern',label:'Anlegen und feuern',cost:'Muskete',aus:()=>!K.geladen});
    a.push({id:'ducken',label:'Hinknien',cost:'Atem +10 · Belastung −2 · du schießt nicht, aber sie treffen dich auch schlechter'});
    a.push({id:'halten',label:'Stehenbleiben und die Linie halten',cost:'Kaltblütigkeit'});
  }
  a.push({id:'bajonett',label:zw==='grenadier'?'Bajonett fällen und vorgehen':'Mit dem Bajonett vor',
    cost:(zw==='grenadier'?'Bajonett +10 · ':'Bajonett · ')+'sehr gefährlich',risk:true});
  if(S.rang>=3){
    a.push({id:'salve',label:'Der Korporalschaft Salve befehlen',cost:'Autorität · acht Mann feuern zugleich'});
    a.push({id:'luecke',label:'Die Lücke links schließen lassen',cost:'Drill · schützt deine Männer'});
  }
  a.push({id:'zurueck',label:'Zurückweichen',cost:'Ruf −− · der Kampf ist für dich vorbei',risk:true});
  return a;
}

/* ── Anmarsch: der Weg dorthin, die Lage, das Warten ──
   Zwischen zwei Gefechten liegen Wochen und hunderte Kilometer. Wer direkt aus
   der Szene in die erste Runde fällt, merkt davon nichts. Der Anmarsch kostet
   deshalb auch etwas: Marsch nutzt Schuhe ab und geht auf den Atem. */

function starteKampf(n){
  if(n.anmarsch && !S.anmarschGesehen){
    S.anmarschGesehen = n.id;
    verschleiss(0.15);
    S.atem = Math.max(0, S.atem-4);
    S.belastung = Math.min(100, S.belastung+1);
    laufSichern();
    zeigeAnmarsch(n);
    return;
  }
  S.anmarschGesehen = null;
  setzeKampf({runde:1, geladen:true, deckung:false, feindMoral:n.feindMoral,
              eigen:100, vorn:false,
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
  const zeilen = [['Gegner',l.gegner],['Auftrag',l.auftrag],['Gelände',l.gelaende],['Dein Platz',l.stellung]]
    .filter(([,v])=>v).map(([k,v])=>`<tr><td class="k">${k}</td><td class="d">${esc(v)}</td></tr>`).join('');
  app.innerHTML = `<div class="stage">${verlauf()}
    <div>${wegband(n)}
      <div class="card"><div class="ch"><span>Anmarsch · ${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
        <div class="cb">
          <div class="prose">${n.anmarsch.map(t=>`<p>${t}</p>`).join('')}</div>
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
      text = sorgfalt? 'Du liegst still, atmest aus und drückst ab. Drüben fällt einer, und du weißt, dass er dir gehört.'
                     : 'Du feuerst in den Rauch. Irgendetwas drüben gerät in Unordnung.'; }
    else { text = S.ausr.muskete.zustand<35 ? 'Das Schloss klickt und nichts geschieht. Die Waffe ist verrostet.'
                                            : 'Der Schuss geht zu hoch. In diesem Rauch trifft man mehr durch Zufall als durch Können.'; }
    if(S.ausr.muskete.verschleiss) S.ausr.muskete.zustand = Math.max(0,S.ausr.muskete.zustand-2);
  }
  else if(id==='ducken'){
    K.deckung=true; S.atem=Math.min(100,S.atem+10); S.belastung=Math.max(0,S.belastung-2);
    text = zw==='voltigeur'
      ? 'Du gehst flach in eine Ackerfurche, das Gesicht im Dreck, und atmest zum ersten Mal seit zehn Minuten bis unten. Vor der Linie sucht dich jetzt niemand mehr — die eigenen Leute auch nicht.'
      : 'Du gehst auf ein Knie, den Kolben in den Dreck, den Kopf hinter den Rücken des Vordermanns. Hinlegen kann sich in der Linie niemand — das Glied bliebe offen. Man kann nicht ewig knien, aber jetzt gerade schon.';
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
    if(p.erfolg){ schaden = 6; S.belastung=Math.max(0,S.belastung-3);
      text='Du bleibst stehen. Links und rechts bleiben sie auch stehen, weil du stehst. Die Linie hält.'; nutzen('drill',1); }
    else { S.belastung=Math.min(100,S.belastung+6);
      text='Du stehst, aber deine Hände zittern so, dass du nichts damit anfangen kannst.'; }
  }
  else if(id==='bajonett'){
    const p = probe('bajonett', zw==='grenadier'?30:45);
    K.deckung=false; S.atem=Math.max(0,S.atem-18); gefahrMod = +26;
    K.vorn = p.erfolg;
    if(p.erfolg){ schaden = 30+Math.random()*14;
      text='Du gehst vor. Es ist laut und kurz und danach stehst du zehn Schritt weiter als vorher.'; S.ruf+=2; }
    else { text='Du gehst vor, aber niemand geht mit. Nach fünf Schritten stehst du allein und kehrst um.'; S.belastung+=7; }
  }
  else if(id==='salve'){
    const p = probe('autoritaet', 40);
    if(p.erfolg){ schaden = 26+Math.random()*10; nutzen('drill',1);
      text='„Anlegen — Feuer!" Acht Musketen gehen fast gleichzeitig los. Fast. Aber es reicht.'; }
    else { text='Du rufst den Befehl, und drei von acht hören ihn. Das Ergebnis ist ein trauriges Geknatter.'; schaden=6; }
  }
  else if(id==='luecke'){
    const p = probe('drill', 35);
    if(p.erfolg){ gefahrMod=-14; S.kameradschaft=Math.min(100,S.kameradschaft+4);
      text='Du schiebst die Männer zusammen, bis kein Loch mehr in der Linie ist. Deine acht wissen jetzt, wozu du gut bist.'; }
    else { text='Sie rücken auf, aber zu langsam, und die Lücke bleibt.'; }
  }
  else if(id==='zurueck'){
    S.ruf = Math.max(0, S.ruf-8); S.belastung=Math.min(100,S.belastung+10); S.gekniffen=true;
    kampfEnde(false, 'Du gehst zurück. Niemand hält dich auf, und das ist das Schlimmste daran.');
    return;
  }

  if(id!=='bajonett') K.vorn = false;

  // Die Linie kämpft auch ohne dich
  const linie = 2 + Math.random()*4;
  K.feindMoral -= schaden + linie;

  /* Und sie verliert dabei Männer. Das ist reine Anzeige — an `eigen` hängt
     keine Probe und keine Gefahr, es macht nur sichtbar, was der Text sagt:
     Drüben wird auch geschossen. Je mehr Widerstand noch steht, desto teurer. */
  K.eigen = Math.max(0, K.eigen - (2 + Math.random()*3) * Math.max(0, K.feindMoral/n.feindMoral));

  K.protokoll.push(text);

  // Feindliche Wirkung
  let gefahr = n.gefahr + gefahrMod;
  if(K.deckung && id!=='ducken' && id!=='deckung') K.deckung=false;
  if(S.belastung>60) gefahr += 6;
  if(S.atem<30) gefahr += 5;
  gefahr = Math.max(4, gefahr);
  let treffer = '';
  if(Math.random()*100 < gefahr){
    const schwere = Math.random()*100 - (wert('konstitution')-40)/3;
    if(schwere > 94){
      kampfEnde(false, text + ' — Dann trifft dich etwas in die Brust, und du siehst noch, wie der Himmel kippt.');
      toetlich('Gefallen bei '+n.datum.split(' · ')[1]);
      zeigeTod(); return;
    } else if(schwere > 72){
      wundeGeben('Schwere Wunde ('+n.datum.split(' · ')[1]+')', 14);
      treffer = ' Ein Schlag gegen die Schulter, dann Nässe im Ärmel. Du kannst den Arm noch bewegen, aber es tut sehr weh.';
      S.atem = Math.max(0,S.atem-20);
    } else {
      wundeGeben('Streifschuss', 5);
      treffer = ' Etwas reißt dir den Ärmel auf und brennt. Nicht schlimm. Noch nicht.';
      S.atem = Math.max(0,S.atem-8);
    }
    K.protokoll.push('Du wirst getroffen.');
  }
  if(S.wunden.length>=5){
    kampfEnde(false, text+treffer);
    toetlich('Verblutet bei '+n.datum.split(' · ')[1]); zeigeTod(); return;
  }

  if(K.feindMoral <= 0){ kampfEnde(true, text+treffer); return; }
  K.runde++;
  if(K.runde > n.runden){
    const knapp = K.feindMoral < n.feindMoral*0.35;
    kampfEnde(knapp, text+treffer+(knapp?' Und dann ist es plötzlich vorbei.':' Es wird dunkel, und nichts ist entschieden.'));
    return;
  }
  laufSichern();
  zeigeKampf(text + treffer);
}

function kampfEnde(sieg, letzterText){
  const n = KAPITEL[LAUF.node];
  const erg = sieg ? n.sieg : n.niederlage;
  anwenden(erg);
  verschleiss(0.9);
  // Der Feldscher flickt nach dem Gefecht die leichteste Wunde
  const leicht = S.wunden.findIndex(w=>w.abzug<=5);
  if(leicht>=0) S.wunden.splice(leicht,1);
  if(sieg && n.ruhm && S.ruf>=20 && Math.random()<0.6){ S.nennungen++; }
  const kk = K; setzeKampf(null);
  stationErledigt();
  app.innerHTML = `<div class="stage">${verlauf()}
    <div><div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb"><div class="prose"><p>${letzterText}</p></div>
        <div class="ergebnis ${sieg?'gut':'schlecht'}">${erg.text}</div>${wirkungen(erg)}
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
  if(S.befoerderungGeprueft===undefined){ S.befoerderungRuf=S.ruf; S.befoerderungGunst=S.gunst; S.befoerderungGeprueft=true; }
  const ruf = S.befoerderungRuf, gunst = S.befoerderungGunst;
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
