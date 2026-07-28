'use strict';
/* Lager, Winterquartier, Punktwertung, Tod, Kapitelende, Spielstand. */

/* ══════════════════ LAGER ══════════════════ */

/* Ein Lager ist die kleine Fassung des Winterquartiers: zwei bis drei Abende,
   und immer mehr zu tun, als Zeit da ist. Ausbildung und Instandhaltung
   konkurrieren miteinander — das ist der ganze Entwurf. Was hier nicht getan
   wird, fehlt im nächsten Gefecht.

   Die Handlungen stehen hier, die Auswahl je Lager in den Kapiteldaten (tun:[…]).
   Handlungen für Rang und Zweig kommen selbsttätig dazu — ein höherer Rang gibt
   auch im Lager neue Knöpfe, nicht größere Zahlen. */

const LAGER_TUN = {
  exerzieren:{label:'Exerzieren, bis die Handgriffe von allein gehen',
    cost:'Muskete und Drill · Atem −6',
    tu(){ nutzen('muskete',2); nutzen('drill',2);
      S.atem=Math.max(0,S.atem-6); S.belastung=Math.min(100,S.belastung+2);
      return 'Laden in zwölf Zeiten, achtzig Mal hintereinander, bis die Hände es ohne den Kopf können. Ein Caporal zählt laut mit, und wer nachhängt, fängt von vorn an. <span class="fein">Muskete und Drill steigen · Atem −6</span>'; }},

  bajonett:{label:'Bajonettfechten gegen einen Strohmann',
    cost:'Bajonett · Atem −8',
    tu(){ nutzen('bajonett',2.5);
      S.atem=Math.max(0,S.atem-8); S.belastung=Math.min(100,S.belastung+2);
      return 'Ein Sack Stroh an einem Pfahl, zweihundert Stöße. Der Sergent sagt, du sollst nicht stechen wie einer, der jemanden verletzen will, sondern wie einer, der weitergehen will. <span class="fein">Bajonett steigt · Atem −8</span>'; }},

  scharf:{label:'Scharf schießen, mit gekauftem Pulver',
    cost:'Muskete ++ · kostet 4 Francs',
    tu(){ if(S.geld<4) return 'Der Mann mit dem Pulver rechnet nach und schickt dich weg. Vier Francs, sagt er, und du hast sie nicht. <span class="fein">nichts passiert</span>';
      S.geld-=4; nutzen('muskete',3.5);
      S.ausr.muskete.zustand = Math.max(0, S.ausr.muskete.zustand-5);
      return 'Zwölf scharfe Schüsse auf eine Scheibe aus Brettern, achtzig Schritt. Beim Bataillon sind drei Schuss im Jahr vorgesehen; den Rest muss man sich selbst kaufen. Beim neunten triffst du zum ersten Mal, weil du es willst, und nicht, weil es sich ergeben hat. <span class="fein">Muskete steigt deutlich · −4 F · Waffe −5</span>'; }},

  instand:{label:'Ausrüstung durchsehen und flicken',
    cost:'Geschick · alles ein Stück besser',
    tu(){ const p = probe('geschick',30);
      const plus = p.erfolg ? 20 : 8;
      for(const k in S.ausr) if(S.ausr[k].verschleiss) S.ausr[k].zustand = Math.min(100, S.ausr[k].zustand+plus);
      return (p.erfolg
        ? 'Riemen nachgenäht, Sohlen mit Draht gefasst, das Schloss zerlegt und ausgewischt. Du bist der Letzte am Feuer und der Einzige, dessen Zeug morgen noch hält.'
        : 'Du machst, was du kannst, und was du kannst, ist nicht viel. Der Riemen hält bis übermorgen, mehr nicht.')
        + ` <span class="fein">Alle Ausrüstung +${plus}</span>`; }},

  schuhe:{label:'Die Schuhe zum Schuster im Dorf tragen',
    cost:'Schuhe ++ · kostet 6 Francs',
    tu(){ if(S.geld<6) return 'Der Schuster hält die Hand auf, bevor er die Schuhe nimmt. Sechs Francs. Du hast sie nicht und gehst mit denselben Sohlen wieder hinaus. <span class="fein">nichts passiert</span>';
      S.geld-=6; S.ausr.schuhe.zustand = Math.min(100, S.ausr.schuhe.zustand+45);
      return 'Er sieht sie sich an, sagt etwas auf Italienisch, das nicht freundlich klingt, und näht trotzdem. Neue Sohlen, doppelt genagelt, und ein Stück Leder über der linken Ferse. <span class="fein">Schuhe +45 · −6 F</span>'; }},

  waffe:{label:'Die Muskete zerlegen und ölen',
    cost:'Waffenzustand ++',
    tu(){ S.ausr.muskete.zustand = Math.min(100, S.ausr.muskete.zustand+30); nutzen('muskete',0.5);
      return 'Schloss heraus, Feder ab, Pfanne blank, alles mit Öl und einem Lappen, den du dafür zerschnitten hast. Eine Muskete, die zündet, ist der Unterschied zwischen einem Soldaten und einem Mann mit einem Stock. <span class="fein">Muskete +30</span>'; }},

  lesen:{label:'Buchstaben lernen, gegen Bezahlung',
    cost:'Bildung · kostet 5 Francs',
    tu(){ if(S.geld<5) return 'Der Schreiber der Kompanie will fünf Francs für zwei Abende. Du hast sie nicht, und er hat keine Zeit zu verschenken. <span class="fein">nichts passiert</span>';
      S.geld-=5; S.attr.bildung=Math.min(100,S.attr.bildung+5); nutzen('verwaltung',1.5);
      return 'Der Kompanieschreiber malt dir Buchstaben in den Sand und wischt sie wieder weg. Am Ende des Abends kannst du drei Wörter, und eines davon ist dein Name. <span class="fein">Bildung +5 · −5 F</span>'; }},

  leute:{label:'Am Feuer sitzen bleiben',
    cost:'Kameradschaft und Fürsprache',
    tu(){ S.gunst+=1; S.kameradschaft=Math.min(100,S.kameradschaft+8);
      S.belastung=Math.max(0,S.belastung-4); nutzen('menschenkenntnis',1);
      return 'Karten um Knöpfe, weil niemand Geld hat. Martel erzählt von der Rheinfront und lässt die Stellen weg, an denen es schlecht ausging. Du merkst dir, wer redet und wer zuhört. <span class="fein">Kameradschaft +8 · Gunst +1 · Belastung −4</span>'; }},

  fouragieren:{label:'Die Höfe in der Umgegend abgehen',
    cost:'Fouragieren · Geld und Essen',
    tu(){ const p = probe('fouragieren',40);
      if(p.erfolg){ S.geld+=7; S.atem=Math.min(100,S.atem+8);
        return 'Zwei Hühner, ein Sack Kastanien und ein Bauer, der lieber verkauft als beraubt wird. Du bringst mehr zurück, als du selbst brauchst, und das spricht sich herum. <span class="fein">+7 F · Atem +8</span>'; }
      S.belastung=Math.min(100,S.belastung+3);
      return 'Vier Stunden auf nassen Feldwegen. Die Höfe sind leer, die Leute sind in den Bergen, und ihr Vieh ist bei ihnen. <span class="fein">Belastung +3</span>'; }},

  ruhe:{label:'Schlafen und liegen bleiben',
    cost:'Leben, Belastung −10 · Atem +18',
    tu(){ S.belastung=Math.max(0,S.belastung-10); S.atem=Math.min(100,S.atem+18);
      lebenAuffuellen(0.25);
      /* Ein Abend im Trockenen kann ein Fieber brechen — muss aber nicht. Das
         ist der einzige Ausweg aus einer Krankheit vor dem Winterquartier, und
         er ist absichtlich ein Wurf: Wer die Ruhr aus dem Sinai mitschleppt,
         verliert Abende, bis sie geht. */
      const krank = S.wunden.findIndex(w=>w.zehrt);
      let zusatz = '';
      if(krank>=0){
        const p = probe('konstitution', 35);
        if(p.erfolg){ const w=S.wunden.splice(krank,1)[0]; atemKlemmen();
          zusatz = ` Gegen Morgen ist das Fieber weg, und du weißt nicht, warum es gegangen ist und vorher nicht. <span class="fein">„${esc(w.name)}" überstanden</span>`; }
        else zusatz = ' Das Fieber bleibt. Es wird bei Dunkelheit stärker, und es wird jede Nacht bei Dunkelheit stärker. <span class="fein">Krankheit hält an</span>';
      }
      return 'Du legst dich hin, sobald es dunkel wird, und stehst auf, als man dich tritt. Dazwischen war nichts, und nichts ist genau das, was du gebraucht hast. <span class="fein">Leben +25 % · Belastung −10 · Atem +18</span>' + zusatz; }},

  /* Ab Rang 3: nicht mehr üben, sondern üben lassen. */
  korporalschaft:{label:'Deine acht Mann drillen',
    cost:'Autorität und Drill · Ruf +1',
    tu(){ nutzen('autoritaet',2); nutzen('drill',2); S.ruf+=1;
      S.kameradschaft=Math.min(100,S.kameradschaft+6);
      return 'Du stellst acht Mann in zwei Glieder und lässt sie laden, bis es gleichzeitig knackt. Zwei von ihnen sind älter als du. Einer sieht dich an, als wolle er etwas sagen, und sagt es dann doch nicht. <span class="fein">Autorität und Drill steigen · Ruf +1 · Kameradschaft +6</span>'; }},

  tornister:{label:'Mit vollem Tornister auf den Hügel und zurück',
    cost:'Konstitution · Atem −10',
    tu(){ nutzen('konstitution',1.5); S.atem=Math.max(0,S.atem-10);
      return 'Sechzig Pfund auf den Rücken, dreimal den Hang hinauf. Die Grenadierkompanie steht dort, wo es am dicksten kommt, und wer dort nicht stehen bleiben kann, bleibt liegen. <span class="fein">Konstitution steigt · Atem −10</span>'; }},

  gelaende:{label:'Allein im Gelände üben',
    cost:'Geschick und Muskete · Atem −6',
    tu(){ nutzen('geschick',1.5); nutzen('muskete',1.5); S.atem=Math.max(0,S.atem-6);
      return 'Von Deckung zu Deckung, hinlegen, zielen, weiter. Vor der Linie gibt es keinen Nebenmann, der dir sagt, wann du aufstehst. Das musst du selbst wissen. <span class="fein">Geschick und Muskete steigen · Atem −6</span>'; }}
};

/* Unteroffiziere sind vom Wachdienst und von den Handreichungen befreit, die
   den Füsilier den halben Abend kosten — dafür haben sie die Korporalschaft am
   Hals. Ein Rang gibt also nicht nur einen Knopf mehr, sondern auch den Abend,
   an dem man ihn drücken kann; sonst verdrängt die Dienstpflicht die eigene
   Ausbildung. Ab Sergent noch einen. */
function abendeFuer(n){ return n.abende + (S.rang>=5 ? 2 : S.rang>=3 ? 1 : 0); }

function lagerHandlungen(n){
  const ids = (n.tun||[]).slice();
  if(S.rang>=3) ids.push('korporalschaft');
  if(S.zweig==='grenadier') ids.push('tornister');
  if(S.zweig==='voltigeur') ids.push('gelaende');
  return ids.filter(id=>LAGER_TUN[id]);
}

/* Das Lager ist der angesagte Halt: Hier wird der Feldzug gesichert und
   gesagt, dass er gesichert ist. Danach läuft die Sicherung still weiter, damit
   Aufhören zurückbringt, wo man war, und nicht, wo man zuletzt gerastet hat. */
function zeigeLager(n){
  const L = LAUF.lager;
  if(L.id !== n.id){ L.id = n.id; L.abende = abendeFuer(n); L.log = []; L.gesichert = Ablage.dauerhaft; laufSichern(); }
  const opt = lagerHandlungen(n).map(id=>{
    const t = LAGER_TUN[id];
    return `<button class="ord" onclick="lagerTun('${id}')" ${L.abende<=0?'disabled':''}>
      ${t.label}<span class="cost">${t.cost}</span></button>`;
  }).join('');
  app.innerHTML = `<div class="stage">${verlauf()}<div>${wegband(n)}
    <div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb"><div class="prose">${n.text.map(t=>`<p>${t}</p>`).join('')}</div>
      ${L.log.length?`<div class="ergebnis">${L.log.join('<br><br>')}</div>`:''}
      ${L.gesichert?'<div class="wirkung"><span>Feldzug gesichert</span>Du kannst hier aufhören und später weitermachen. Wer fällt, verliert den Spielstand im selben Augenblick.</div>':''}
      <div class="probe" style="margin-top:12px">VERBLEIBENDE ABENDE: ${L.abende} VON ${abendeFuer(n)}${
        abendeFuer(n)>n.abende?` · ${(abendeFuer(n)-n.abende)===1?'EIN ABEND':'ZWEI ABENDE'} MEHR ALS ${rangName(S.rang).toUpperCase()}`:''}</div>
      </div></div>
    <div class="orders"><div class="ch"><span>Womit verbringst du den Abend?</span></div><div class="ordbody">
      ${opt}${L.abende<=0?'<button class="ord weiter" onclick="lagerEnde()">Antreten lassen</button>':''}
    </div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}
function lagerTun(id){
  const L = LAUF.lager;
  if(L.abende<=0) return;
  L.abende--;
  L.log.push(LAGER_TUN[id].tu());
  S.log.push(L.id+': '+LAGER_TUN[id].label);
  atemKlemmen();
  laufSichern();
  zeigeLager(KAPITEL[LAUF.node]);
}
function lagerEnde(){ LAUF.lager = {id:null, abende:0, log:[]}; stationErledigt(); naechster(); }

/* ══════════════════ WINTERQUARTIER ══════════════════ */

function zeigeWinter(n){
  const W = LAUF.winter;
  if(W.wochen===3 && !W.log.length){
    W.log=[]; W.gesichert = Ablage.dauerhaft;
    /* Drei Wochen unter einem Dach, mit Sold und zweimal Essen am Tag: Der Atem
       ist danach voll, ohne dass man dafür eine Woche opfern müsste. Belastung
       und Wunden bleiben Sache der Wochenverteilung — die sitzen tiefer. */
    W.atemVoll = S.atem < S.leben; S.atem = 100; atemKlemmen();
    laufSichern();
  }
  const tun = [
    {id:'ausr',label:'Ausrüstung instand setzen',cost:'Schuhe, Muskete und Tornister flicken'},
    {id:'drill',label:'Drillen und schießen üben',cost:'Muskete und Drill steigen'},
    {id:'lesen',label:'Lesen und Schreiben üben',cost:'Bildung und Verwaltung · kostet 6 Francs'},
    {id:'leute',label:'Zeit mit Martel und den Männern verbringen',cost:'Gunst und Kameradschaft'},
    {id:'ruhe',label:'Schlafen, essen, nichts tun',cost:'Leben und Belastung erholen sich, Wunden heilen'}
  ];
  const opt = tun.map(t=>`<button class="ord" onclick="winterTun('${t.id}')" ${W.wochen<=0?'disabled':''}>
    ${t.label}<span class="cost">${t.cost}</span></button>`).join('');
  app.innerHTML = `<div class="stage">${verlauf()}<div>${wegband(n)}
    <div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb"><div class="prose">${(n.text||[]).map(t=>`<p>${t}</p>`).join('')}</div>
      ${W.log.length?`<div class="ergebnis">${W.log.join('<br><br>')}</div>`:''}
      ${W.atemVoll?`<div class="wirkung"><span>Wieder bei Atem</span>Drei Wochen unter einem Dach, Sold und zweimal Essen am Tag. ${S.atem<100?'So ausgeruht, wie es dein Zustand zulässt — mehr Luft gibt der Körper nicht her, solange er nicht heil ist.':'Du bist ausgeruht, wie du es seit April nicht warst.'} <b>Atem ${S.atem}</b></div>`:''}
      ${W.gesichert?'<div class="wirkung"><span>Feldzug gesichert</span>Du kannst hier aufhören und später weitermachen. Wer fällt, verliert den Spielstand im selben Augenblick.</div>':''}
      <div class="probe" style="margin-top:12px">VERBLEIBENDE WOCHEN: ${W.wochen}</div>
      </div></div>
    <div class="orders"><div class="ch"><span>Womit verbringst du die Woche?</span></div><div class="ordbody">
      ${opt}${W.wochen<=0?'<button class="ord weiter" onclick="winterEnde()">Ins Feld zurück</button>':''}
    </div></div>
    </div>${seitenleiste()}</div>`;
}
function winterTun(id){
  const W = LAUF.winter;
  if(W.wochen<=0) return;
  W.wochen--;
  if(id==='ausr'){
    for(const k in S.ausr) if(S.ausr[k].verschleiss) S.ausr[k].zustand = Math.min(100, S.ausr[k].zustand+30);
    W.log.push('Eine Woche Draht, Pech und Leder. Die Schuhe halten wieder, das Schloss der Muskete ist trocken. <span style="color:var(--faint)">Alle Ausrüstung +30</span>');
  }
  if(id==='drill'){
    nutzen('muskete',3); nutzen('drill',3); nutzen('bajonett',2);
    W.log.push('Exerzieren auf einem gefrorenen Feld, bis die Handgriffe von allein gehen. <span style="color:var(--faint)">Muskete, Drill und Bajonett steigen</span>');
  }
  if(id==='lesen'){
    if(S.geld>=6){ S.geld-=6; S.attr.bildung=Math.min(100,S.attr.bildung+7); nutzen('verwaltung',2);
      W.log.push('Ein Sergent aus Lyon bringt dir Buchstaben bei, gegen Schnaps und sechs Francs. Es ist mühsamer als Grabenschaufeln. <span style="color:var(--faint)">Bildung +7 · −6 F</span>'); }
    else W.log.push('Du hast keine sechs Francs. Der Sergent lacht und dreht sich um. <span style="color:var(--faint)">nichts passiert</span>');
  }
  if(id==='leute'){
    S.gunst+=2; S.kameradschaft=Math.min(100,S.kameradschaft+10); S.belastung=Math.max(0,S.belastung-5);
    nutzen('menschenkenntnis',2);
    W.log.push('Karten, Wein und Geschichten, die jedes Mal besser werden. Martel erzählt vom Rhein, und du hörst zu. <span style="color:var(--faint)">Gunst +2 · Kameradschaft +10</span>');
  }
  if(id==='ruhe'){
    /* Die einzige Handlung, die den Lebensvorrat wirklich wieder auffüllt —
       und sie kostet eine der drei Wochen. Wer verwundet aus dem Feldzug kommt,
       muss sich zwischen Genesung und Ausbildung entscheiden; das ist dieselbe
       Knappheit wie im Lager, nur eine Größenordnung wirksamer. */
    S.belastung=Math.max(0,S.belastung-16); lebenAuffuellen(0.6); S.atem=100; atemKlemmen();
    // Krankheiten zuerst — sie sind das, was einen Mann über Wochen aufzehrt
    const krank = S.wunden.findIndex(w=>w.zehrt);
    if(krank>=0) S.wunden.unshift(S.wunden.splice(krank,1)[0]);
    if(S.wunden.length){ const w=S.wunden.shift(); atemKlemmen();
      W.log.push(`${w.zehrt?'Das Fieber geht in der zweiten Woche':'Die Wunde („'+esc(w.name)+'") schließt sich endlich'}. <span style="color:var(--faint)">Leben +60 % · Belastung −16 · „${esc(w.name)}" überstanden</span>`); }
    else W.log.push('Du schläfst, isst zweimal am Tag und tust drei Wochen lang nichts Nützliches. Es hilft mehr als alles andere. <span style="color:var(--faint)">Leben +60 % · Belastung −16</span>');
  }
  if(S.kaeufe.includes('flasche')) S.belastung=Math.max(0,S.belastung-2);
  laufSichern();
  zeigeWinter(KAPITEL[LAUF.node]);
}
function winterEnde(){ LAUF.winter = {wochen:3, log:[]}; stationErledigt(); naechster(); }

/* ══════════════════ WERTUNG UND ENDE ══════════════════ */

function stationen(){ return Math.min(KAPITEL.length, LAUF.node+1); }

function wertung(){
  const p = {};
  p.rang = rangWert(S.rang);
  p.stationen = 2 * stationen();   // 2 seit Kapitel 2: 32 Stationen — siehe CLAUDE.md
  p.ruf = 5 * Math.floor(S.ruf/10);
  p.nennungen = 3 * Math.min(10, S.nennungen);
  p.ueberleben = S.lebt ? 25 : 0;
  p.sauber = (!S.gekniffen && S.lebt) ? 10 : 0;
  p.summe = p.rang+p.stationen+p.ruf+p.nennungen+p.ueberleben+p.sauber;
  return p;
}

/* Was von einem Mann bleibt. Die vier alten Felder stehen vorn, damit die
   Chroniktabelle unverändert weiterläuft; alles Übrige ist der Zusatz, den das
   Blatt anzeigt. Ältere Einträge ohne diese Felder bleiben lesbar — sie zeigen
   dann eben nur die Zeile. */
function chronikblatt(endeText, p){
  const letzte = KAPITEL[Math.min(LAUF?LAUF.node:0, KAPITEL.length-1)] || {};
  return {
    name:S.name, rang:rangName(S.rang), ende:endeText, punkte:p.summe,
    herkunft:S.herkunft, zweig:S.zweig, rangN:S.rang, gefallen:!S.lebt,
    ort:letzte.datum || '', stationen:stationen(),
    attr:Object.assign({},S.attr), fert:Object.assign({},S.fert),
    ausr:Object.keys(S.ausr).map(k=>({name:S.ausr[k].name, zustand:S.ausr[k].zustand,
                                      verschleiss:S.ausr[k].verschleiss})),
    wunden:S.wunden.map(w=>w.name), ruf:S.ruf, gunst:S.gunst,
    kameradschaft:S.kameradschaft, belastung:S.belastung, atem:S.atem,
    leben:S.leben, lebenMax:lebenMax(),
    nennungen:S.nennungen, geld:S.geld, gekniffen:!!S.gekniffen,
    kaeufe:(S.kaeufe||[]).slice(), gekauft:Object.assign({},S.gekauft||{}),
    log:(S.log||[]).slice(), wertung:p
  };
}

function eintragen(endeText){
  const p = wertung();
  META.chronik.push(chronikblatt(endeText, p));
  META.laeufe = (META.laeufe|0) + 1;
  META.vp = Math.max(META.vp, p.summe);
  chronikKuerzen();
  laufVerwerfen();          // der Lauf ist zu Ende, in jedem Fall
  chronikSichern();
  return p;
}

function wertungsTabelle(p){ return wertungsTabelleAus({wertung:p, rang:rangName(S.rang),
  stationen:stationen(), ruf:S.ruf, nennungen:S.nennungen}); }

function wertungsTabelleAus(c){
  const p = c.wertung; if(!p) return '';
  return `<table>
    <tr><th>Wofür</th><th class="n">VP</th></tr>
    <tr><td class="d">Erreichter Rang — ${esc(c.rang)}</td><td class="n">${p.rang}</td></tr>
    <tr><td class="d">Erreichte Stationen (${c.stationen} × 2)</td><td class="n">${p.stationen}</td></tr>
    <tr><td class="d">Ruf ${c.ruf}, je volle 10 Punkte</td><td class="n">${p.ruf}</td></tr>
    <tr><td class="d">Im Tagesbefehl genannt (${c.nennungen}×)</td><td class="n">${p.nennungen}</td></tr>
    <tr><td class="d">Kapitel lebend beendet</td><td class="n">${p.ueberleben}</td></tr>
    <tr><td class="d">Nie vor Zeugen gekniffen</td><td class="n">${p.sauber}</td></tr>
    <tr class="hi"><td class="d"><b>Summe</b></td><td class="n"><b>${p.summe}</b></td></tr>
  </table>`;
}

function zeigeTod(){
  const grund = S.todesart || 'Gefallen';
  laufVerwerfen();
  const p = eintragen(grund);
  const neu = p.summe >= META.vp;
  app.innerHTML = `<div class="card"><div class="ch"><span class="tot">Ende</span><span>${esc(grund)}</span></div>
    <div class="cb">
      <div class="prose">
        <p><b>${esc(S.name)}</b>, ${rangName(S.rang)} der 32. Halbbrigade, ${esc(grund.toLowerCase())}.</p>
        <p>${todesText()}</p>
      </div>
      <div class="grid2" style="margin-top:18px">
        <div>${wertungsTabelle(p)}</div>
        <div class="note ${neu?'green':'red'}">
          ${neu?`<b>Neuer Rekord.</b> Dein Vorrat steigt auf <b>${META.vp} Veteranenpunkte</b>. Der nächste Mann rückt besser ausgerüstet ein.`
                :`Dein bester Lauf bleibt bei <b>${META.vp} Punkten</b>. Dieser hier war nicht besser — er kostet dich aber auch nichts.`}
          <p style="margin-top:10px">Gezählt wird nur der beste Lauf. Es gibt nichts zu grinden, nur zu übertreffen.</p>
        </div>
      </div>
      <div class="probe" style="margin-top:14px">DER SPIELSTAND DIESES MANNES IST GELÖSCHT</div>
      <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="plain" onclick="zeigeErschaffung(true)">Nächster Mann</button>
        <button class="plain" onclick="zeigeTitel()">Zur Chronik</button>
        <button class="plain" onclick="speichern()">Spielstand sichern</button>
      </div>
    </div></div>`;
  LAUF=null; binde(); kopfzeile();
}
function todesText(){
  const t = [
    'Man nimmt ihm die Patronen ab und die Schuhe, wenn sie noch etwas taugen, und zieht weiter. Am Abend fehlt sein Name beim Appell, und am übernächsten Tag erinnert sich niemand mehr, wann genau er gefehlt hat.',
    'Zwei Männer tragen ihn an den Rand und legen ihn zu den anderen. Ein Brief nach Hause wird nicht geschrieben, weil in seiner Kompanie niemand schreiben kann.',
    'Er wird in eine Grube gelegt, die vierzig andere teilen. Die Halbbrigade marschiert am Morgen weiter, und seine Muskete bekommt ein Rekrut, der noch nicht weiß, wem sie gehört hat.'
  ];
  return t[Math.floor(Math.random()*t.length)];
}

function zeigeKapitelende(n){
  n = n || KAPITEL[KAPITEL.length-1] || {};
  const p = eintragen('Feldzüge überstanden · '+rangName(S.rang));
  const neu = p.summe >= META.vp;
  const rangSatz = S.rang>=3 ? 'Acht Mann sehen dich morgens an und warten, was du sagst.'
    : (S.rang===2 ? 'Du stehst nicht mehr in der Mitte des Bataillons, sondern dort, wo sie die Leute hinstellen, auf die es ankommt.'
                  : 'Du stehst noch in der Reihe wie am ersten Tag — aber du stehst.');
  app.innerHTML = `<div class="card"><div class="ch"><span>${esc(n.datum||'')}</span><span>${esc(n.ort||'')}</span></div>
    <div class="cb"><div class="prose">
      ${(n.text||[]).map(t=>`<p>${t}</p>`).join('')}
      <p>Du bist <b>${rangName(S.rang)}</b>. ${rangSatz}</p>
    </div>
    <div class="grid2" style="margin-top:18px">
      <div>${wertungsTabelle(p)}</div>
      <div class="note ${neu?'green':''}">
        ${neu?`<b>Neuer Rekord: ${META.vp} Veteranenpunkte.</b>`:`Dein bester Lauf bleibt bei <b>${META.vp} Punkten</b>.`}
        <p style="margin-top:10px">${n.ausblick||''}</p>
        <p style="margin-top:10px">Was hier funktioniert, funktioniert in den nächsten Kapiteln genauso: Proben gegen Attribute, Ausrüstung, die verschleißt, Ruf und Fürsprache, die über Beförderung entscheiden — und ein Tod, der endgültig ist.</p>
      </div>
    </div>
    <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">
      <button class="plain" onclick="zeigeErschaffung(true)">Noch einmal, besser</button>
      <button class="plain" onclick="zeigeTitel()">Zur Chronik</button>
      <button class="plain" onclick="speichern()">Spielstand sichern</button>
    </div>
  </div></div>`;
  LAUF=null; binde(); kopfzeile();
}

/* ══════════════════ SPIELSTAND ══════════════════ */

function speichern(){
  const blob = new Blob([dateiInhalt()],{type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'marschallstab-spielstand.json';
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
}
function laden(ev){
  const f = ev.target.files[0]; if(!f) return;
  const r = new FileReader();
  r.onload = () => {
    let e;
    try{ e = dateiEinlesen(r.result); }
    catch(x){ e = {ok:false, grund:'Diese Datei ließ sich nicht lesen.'}; }
    if(e.ok) zeigeTitel(); else alert(e.grund);
  };
  r.readAsText(f);
}
