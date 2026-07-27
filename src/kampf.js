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
  } else {
    a.push({id:'feuern',label:'Anlegen und feuern',cost:'Muskete',aus:()=>!K.geladen});
    a.push({id:'ducken',label:'Hinwerfen',cost:'Atem +10 · Belastung −2 · du schießt nicht, aber sie treffen dich auch nicht'});
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
    zeigeAnmarsch(n);
    return;
  }
  S.anmarschGesehen = null;
  K = {n, runde:1, geladen:true, deckung:false, feindMoral:n.feindMoral,
       protokoll:['Das Gefecht beginnt.'], zielt:false, verluste:0};
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
  if(S.atem<35) z.push('Du bist ausgepumpt, bevor der erste Schuss fällt.');
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
  app.innerHTML = `<div class="stage">
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
        <button class="ord weiter" onclick="starteKampf(KAPITEL[NODE])">Antreten
          <span class="cost">Danach gibt es keinen Weg zurück, der nicht Ruf kostet</span></button>
      </div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

function sichtfeld(){
  const rauch = Math.min(1, K.runde/6);
  return `<svg viewBox="0 0 640 200" role="img" aria-label="Sichtfeld im Gefecht">
    <defs>
      <linearGradient id="sm" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2b2723" stop-opacity="${0.6+0.4*rauch}"/>
        <stop offset="60%" stop-color="#221f1c" stop-opacity="${0.5*rauch}"/>
        <stop offset="100%" stop-color="#1a1816" stop-opacity="0"/></linearGradient>
      <radialGradient id="vg" cx="50%" cy="88%" r="62%">
        <stop offset="0%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity=".7"/></radialGradient>
    </defs>
    <rect width="640" height="200" fill="#191715"/>
    <rect width="640" height="126" fill="url(#sm)"/>
    <g opacity="${0.30-0.16*rauch}" fill="#cfc7b8">
      <rect x="120" y="58" width="9" height="26" rx="3"/><rect x="146" y="55" width="9" height="29" rx="3"/>
      <rect x="172" y="59" width="9" height="25" rx="3"/><rect x="404" y="56" width="9" height="28" rx="3"/>
      <rect x="430" y="60" width="9" height="24" rx="3"/><rect x="456" y="57" width="9" height="27" rx="3"/></g>
    <text x="320" y="34" text-anchor="middle" fill="#5c554b" font-family="Georgia,serif" font-size="12"
      font-style="italic">${K.deckung?'Du liegst. Über dir geht es hinweg.':'Rauch. Du siehst keine dreißig Schritt weit.'}</text>
    <g>
      <rect x="196" y="110" width="20" height="60" rx="6" fill="#3a352e"/><circle cx="206" cy="104" r="9" fill="#3a352e"/>
      <rect x="252" y="106" width="22" height="64" rx="6" fill="#4a443a"/><circle cx="263" cy="99" r="10" fill="#4a443a"/>
      <rect x="306" y="${K.deckung?140:100}" width="26" height="${K.deckung?32:72}" rx="6" fill="#7d7264"/>
      <circle cx="319" cy="${K.deckung?134:92}" r="11.5" fill="#7d7264"/>
      <rect x="366" y="106" width="22" height="64" rx="6" fill="#4a443a"/><circle cx="377" cy="99" r="10" fill="#4a443a"/>
    </g>
    <text x="319" y="192" text-anchor="middle" fill="#b8924f" font-size="10.5"
      font-family="ui-monospace,monospace" letter-spacing="1">DU</text>
    <rect width="640" height="200" fill="url(#vg)"/></svg>`;
}

function zeigeKampf(text){
  const n = K.n;
  const opt = aktionen().map(a=>`<button class="ord ${a.risk?'risk':''}" onclick="kampfAktion('${a.id}')"
      ${a.aus&&a.aus()?'disabled':''}>${a.label}<span class="cost">${a.cost}</span></button>`).join('');
  app.innerHTML = `<div class="stage">
    <div><div class="card"><div class="ch"><span>Sichtfeld</span><span>${esc(n.datum)}</span></div>
      <div class="cb">${sichtfeld()}
        <div class="prose" style="margin-top:15px"><p>${text}</p></div>
        <div class="probe" style="margin-top:12px">RUNDE ${K.runde} VON ${n.runden} · WIDERSTAND DES FEINDES ${Math.max(0,Math.round(K.feindMoral))}</div>
        ${balken('b-red',Math.max(0,K.feindMoral),n.feindMoral)}
        <div class="log" style="margin-top:14px">${K.protokoll.slice(-5).reverse().map(z=>`<div>${z}</div>`).join('')}</div>
      </div></div>
      <div class="orders"><div class="ch"><span>Was tust du?</span></div><div class="ordbody">${opt}</div></div>
    </div>${seitenleiste()}</div>`;
}

function kampfAktion(id){
  const n = K.n; let text = '', schaden = 0, gefahrMod = 0;
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
    text='Du wirfst dich hin. Über dir geht es hinweg. Man kann nicht ewig liegen bleiben, aber jetzt gerade schon.';
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

  // Die Linie kämpft auch ohne dich
  const linie = 2 + Math.random()*4;
  K.feindMoral -= schaden + linie;
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
  zeigeKampf(text + treffer);
}

function kampfEnde(sieg, letzterText){
  const n = K.n;
  const erg = sieg ? n.sieg : n.niederlage;
  anwenden(erg);
  verschleiss(0.9);
  // Der Feldscher flickt nach dem Gefecht die leichteste Wunde
  const leicht = S.wunden.findIndex(w=>w.abzug<=5);
  if(leicht>=0) S.wunden.splice(leicht,1);
  if(sieg && n.ruhm && S.ruf>=20 && Math.random()<0.6){ S.nennungen++; }
  const kk = K; K = null;
  app.innerHTML = `<div class="stage">
    <div><div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb"><div class="prose"><p>${letzterText}</p></div>
        <div class="ergebnis ${sieg?'gut':'schlecht'}">${erg.text}</div>${wirkungen(erg)}
        <div class="probe" style="margin-top:10px">${sieg?'GEFECHT BESTANDEN':'GEFECHT VERLOREN'} · ${kk.runde} RUNDEN</div>
      </div></div>
      <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="weiter()">Weiter</button></div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

/* ══════════════════ ELITEKOMPANIE ══════════════════ */

function zeigeElite(n){
  const kon = wert('konstitution'), ges = wert('geschick');
  const gr = kon>=55, vo = ges>=55;
  app.innerHTML = `<div class="stage">
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
  app.innerHTML = `<div class="stage"><div>
    <div class="card"><div class="ch"><span>Mailand</span><span>Mai 1796</span></div>
      <div class="cb"><div class="ergebnis ${z?'gut':''}">${text}</div>
      ${z?`<div class="probe" style="margin-top:10px">NEUER RANG · ${rangName(2).toUpperCase()} · RUF +4</div>`:''}</div></div>
    <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="weiter()">Weiter</button></div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

/* ══════════════════ BEFÖRDERUNG ══════════════════ */

function zeigeBefoerderung(n){
  if(S.befoerderungGeprueft===undefined){ S.befoerderungRuf=S.ruf; S.befoerderungGunst=S.gunst; S.befoerderungGeprueft=true; }
  const ruf = S.befoerderungRuf, gunst = S.befoerderungGunst;
  const reichtRuf = ruf>=25, reichtGunst = gunst>=3;
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
    <br><br><em>Für den Caporal braucht es Ruf 25 — du hast ${ruf}.</em>`;
    klasse='schlecht';
  } else {
    text = `Dein Name fällt. Er fällt sogar zweimal. Aber niemand am Tisch legt die Hand für dich auf den Tisch, und ohne das geht es nicht.
    <br><br><em>Für den Caporal braucht es einen Fürsprecher — Gunst 3, du hast ${gunst}.</em>`;
    klasse='schlecht';
  }
  app.innerHTML = `<div class="stage"><div>${wegband(n)}
    <div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb"><div class="prose">${(n.text||[]).map(t=>`<p>${t}</p>`).join('')}</div>
      <div class="ergebnis ${klasse}">${text}</div>
      <div class="probe" style="margin-top:10px">VAKANZ VORHANDEN · RUF ${ruf}/25 · FÜRSPRACHE ${gunst}/3 · ${bekommt?'BEFÖRDERT':'ÜBERGANGEN'}</div>
      </div></div>
    <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="weiter()">Weiter</button></div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}
