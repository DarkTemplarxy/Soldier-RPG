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
    cost:'Belastung −10 · Atem +18',
    tu(){ S.belastung=Math.max(0,S.belastung-10); S.atem=Math.min(100,S.atem+18);
      return 'Du legst dich hin, sobald es dunkel wird, und stehst auf, als man dich tritt. Dazwischen war nichts, und nichts ist genau das, was du gebraucht hast. <span class="fein">Belastung −10 · Atem +18</span>'; }},

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

function lagerHandlungen(n){
  const ids = (n.tun||[]).slice();
  if(S.rang>=3) ids.push('korporalschaft');
  if(S.zweig==='grenadier') ids.push('tornister');
  if(S.zweig==='voltigeur') ids.push('gelaende');
  return ids.filter(id=>LAGER_TUN[id]);
}

let ABENDE = null, LAGER_ID = null, LLOG = [];
function zeigeLager(n){
  if(LAGER_ID !== n.id){ LAGER_ID = n.id; ABENDE = n.abende; LLOG = []; }
  const opt = lagerHandlungen(n).map(id=>{
    const t = LAGER_TUN[id];
    return `<button class="ord" onclick="lagerTun('${id}')" ${ABENDE<=0?'disabled':''}>
      ${t.label}<span class="cost">${t.cost}</span></button>`;
  }).join('');
  app.innerHTML = `<div class="stage"><div>${wegband(n)}
    <div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb"><div class="prose">${n.text.map(t=>`<p>${t}</p>`).join('')}</div>
      ${LLOG.length?`<div class="ergebnis">${LLOG.join('<br><br>')}</div>`:''}
      <div class="probe" style="margin-top:12px">VERBLEIBENDE ABENDE: ${ABENDE} VON ${n.abende}</div>
      </div></div>
    <div class="orders"><div class="ch"><span>Womit verbringst du den Abend?</span></div><div class="ordbody">
      ${opt}${ABENDE<=0?'<button class="ord weiter" onclick="lagerEnde()">Antreten lassen</button>':''}
    </div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}
function lagerTun(id){
  if(ABENDE<=0) return;
  ABENDE--;
  LLOG.push(LAGER_TUN[id].tu());
  S.log.push(LAGER_ID+': '+LAGER_TUN[id].label);
  zeigeLager(KAPITEL[NODE]);
}
function lagerEnde(){ LAGER_ID = null; ABENDE = null; LLOG = []; weiter(); }

/* ══════════════════ WINTERQUARTIER ══════════════════ */

let WOCHEN = 3, WLOG = [];
function zeigeWinter(n){
  if(WOCHEN===3) WLOG=[];
  const tun = [
    {id:'ausr',label:'Ausrüstung instand setzen',cost:'Schuhe, Muskete und Tornister flicken'},
    {id:'drill',label:'Drillen und schießen üben',cost:'Muskete und Drill steigen'},
    {id:'lesen',label:'Lesen und Schreiben üben',cost:'Bildung und Verwaltung · kostet 6 Francs'},
    {id:'leute',label:'Zeit mit Martel und den Männern verbringen',cost:'Gunst und Kameradschaft'},
    {id:'ruhe',label:'Schlafen, essen, nichts tun',cost:'Belastung sinkt, Atem steigt, Wunden heilen'}
  ];
  const opt = tun.map(t=>`<button class="ord" onclick="winterTun('${t.id}')" ${WOCHEN<=0?'disabled':''}>
    ${t.label}<span class="cost">${t.cost}</span></button>`).join('');
  app.innerHTML = `<div class="stage"><div>${wegband(n)}
    <div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb"><div class="prose">
        <p>Verona im Dezember. Die Armee liegt in Quartieren, die Österreicher liegen in ihren, und für ein paar Wochen schießt niemand auf niemanden.</p>
        <p>Es ist die einzige Zeit im Jahr, in der du entscheidest, was du tust. Drei Wochen, mehr nicht — im Januar geht es weiter.</p>
      </div>
      ${WLOG.length?`<div class="ergebnis">${WLOG.join('<br><br>')}</div>`:''}
      <div class="probe" style="margin-top:12px">VERBLEIBENDE WOCHEN: ${WOCHEN}</div>
      </div></div>
    <div class="orders"><div class="ch"><span>Womit verbringst du die Woche?</span></div><div class="ordbody">
      ${opt}${WOCHEN<=0?'<button class="ord weiter" onclick="WOCHEN=3;weiter()">Ins Feld zurück</button>':''}
    </div></div>
    </div>${seitenleiste()}</div>`;
}
function winterTun(id){
  if(WOCHEN<=0) return;
  WOCHEN--;
  if(id==='ausr'){
    for(const k in S.ausr) if(S.ausr[k].verschleiss) S.ausr[k].zustand = Math.min(100, S.ausr[k].zustand+30);
    WLOG.push('Eine Woche Draht, Pech und Leder. Die Schuhe halten wieder, das Schloss der Muskete ist trocken. <span style="color:var(--faint)">Alle Ausrüstung +30</span>');
  }
  if(id==='drill'){
    nutzen('muskete',3); nutzen('drill',3); nutzen('bajonett',2);
    WLOG.push('Exerzieren auf einem gefrorenen Feld, bis die Handgriffe von allein gehen. <span style="color:var(--faint)">Muskete, Drill und Bajonett steigen</span>');
  }
  if(id==='lesen'){
    if(S.geld>=6){ S.geld-=6; S.attr.bildung=Math.min(100,S.attr.bildung+7); nutzen('verwaltung',2);
      WLOG.push('Ein Sergent aus Lyon bringt dir Buchstaben bei, gegen Schnaps und sechs Francs. Es ist mühsamer als Grabenschaufeln. <span style="color:var(--faint)">Bildung +7 · −6 F</span>'); }
    else WLOG.push('Du hast keine sechs Francs. Der Sergent lacht und dreht sich um. <span style="color:var(--faint)">nichts passiert</span>');
  }
  if(id==='leute'){
    S.gunst+=2; S.kameradschaft=Math.min(100,S.kameradschaft+10); S.belastung=Math.max(0,S.belastung-5);
    nutzen('menschenkenntnis',2);
    WLOG.push('Karten, Wein und Geschichten, die jedes Mal besser werden. Martel erzählt vom Rhein, und du hörst zu. <span style="color:var(--faint)">Gunst +2 · Kameradschaft +10</span>');
  }
  if(id==='ruhe'){
    S.belastung=Math.max(0,S.belastung-16); S.atem=Math.min(100,S.atem+25);
    if(S.wunden.length){ const w=S.wunden.shift(); WLOG.push(`Die Wunde („${w.name}") schließt sich endlich. <span style="color:var(--faint)">Belastung −16 · Atem +25 · Wunde geheilt</span>`); }
    else WLOG.push('Du schläfst, isst zweimal am Tag und tust drei Wochen lang nichts Nützliches. Es hilft mehr als alles andere. <span style="color:var(--faint)">Belastung −16 · Atem +25</span>');
  }
  if(S.kaeufe.includes('flasche')) S.belastung=Math.max(0,S.belastung-2);
  zeigeWinter(KAPITEL[NODE]);
}

/* ══════════════════ WERTUNG UND ENDE ══════════════════ */

function stationen(){ return Math.min(KAPITEL.length, NODE+1); }

function wertung(){
  const p = {};
  p.rang = rangWert(S.rang);
  p.stationen = 3 * stationen();   // 3 statt 4, seit es 16 Stationen sind — siehe CLAUDE.md
  p.ruf = 5 * Math.floor(S.ruf/10);
  p.nennungen = 3 * Math.min(10, S.nennungen);
  p.ueberleben = S.lebt ? 25 : 0;
  p.sauber = (!S.gekniffen && S.lebt) ? 10 : 0;
  p.summe = p.rang+p.stationen+p.ruf+p.nennungen+p.ueberleben+p.sauber;
  return p;
}

function eintragen(endeText){
  const p = wertung();
  META.chronik.push({name:S.name, rang:rangName(S.rang), ende:endeText, punkte:p.summe});
  META.vp = Math.max(META.vp, p.summe);
  return p;
}

function wertungsTabelle(p){
  return `<table>
    <tr><th>Wofür</th><th class="n">VP</th></tr>
    <tr><td class="d">Erreichter Rang — ${rangName(S.rang)}</td><td class="n">${p.rang}</td></tr>
    <tr><td class="d">Erreichte Stationen (${stationen()} × 3)</td><td class="n">${p.stationen}</td></tr>
    <tr><td class="d">Ruf ${S.ruf}, je volle 10 Punkte</td><td class="n">${p.ruf}</td></tr>
    <tr><td class="d">Im Tagesbefehl genannt (${S.nennungen}×)</td><td class="n">${p.nennungen}</td></tr>
    <tr><td class="d">Kapitel lebend beendet</td><td class="n">${p.ueberleben}</td></tr>
    <tr><td class="d">Nie vor Zeugen gekniffen</td><td class="n">${p.sauber}</td></tr>
    <tr class="hi"><td class="d"><b>Summe</b></td><td class="n"><b>${p.summe}</b></td></tr>
  </table>`;
}

function zeigeTod(){
  const grund = S.todesart || 'Gefallen';
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
      <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="plain" onclick="zeigeLaden()">Nächster Mann</button>
        <button class="plain" onclick="zeigeTitel()">Zur Chronik</button>
        <button class="plain" onclick="speichern()">Spielstand sichern</button>
      </div>
    </div></div>`;
  S=null; kopfzeile();
}
function todesText(){
  const t = [
    'Man nimmt ihm die Patronen ab und die Schuhe, wenn sie noch etwas taugen, und zieht weiter. Am Abend fehlt sein Name beim Appell, und am übernächsten Tag erinnert sich niemand mehr, wann genau er gefehlt hat.',
    'Zwei Männer tragen ihn an den Rand und legen ihn zu den anderen. Ein Brief nach Hause wird nicht geschrieben, weil in seiner Kompanie niemand schreiben kann.',
    'Er wird in eine Grube gelegt, die vierzig andere teilen. Die Halbbrigade marschiert am Morgen weiter, und seine Muskete bekommt ein Rekrut, der noch nicht weiß, wem sie gehört hat.'
  ];
  return t[Math.floor(Math.random()*t.length)];
}

function zeigeKapitelende(){
  const p = eintragen('Kapitel überstanden · '+rangName(S.rang));
  const neu = p.summe >= META.vp;
  app.innerHTML = `<div class="card"><div class="ch"><span>18. April 1797 · Leoben</span><span>Vorfrieden mit Österreich</span></div>
    <div class="cb"><div class="prose">
      <p>In Leoben wird ein Vorfrieden unterschrieben. Für dich heißt das: Der Feldzug ist vorbei, und du lebst noch.</p>
      <p>Vor einem Jahr bist du mit zerfallenen Schuhen in Savona angekommen und hast nicht gewusst, ob du bis Dego durchhältst. Seitdem warst du auf der Brücke von Lodi, im Sumpf von Arcole und auf der Hochebene von Rivoli. Von den Männern, die im April neben dir standen, ist ungefähr die Hälfte noch da.</p>
      <p>Du bist <b>${rangName(S.rang)}</b>. ${S.rang>=3?'Acht Mann sehen dich morgens an und warten, was du sagst.':(S.rang===2?'Du stehst nicht mehr in der Mitte des Bataillons, sondern dort, wo sie die Leute hinstellen, auf die es ankommt.':'Du stehst noch in der Reihe wie im April — aber du stehst.')}</p>
      <p class="said">Es heißt, als Nächstes geht es nach Ägypten. Niemand weiß, wo das genau liegt.</p>
    </div>
    <div class="grid2" style="margin-top:18px">
      <div>${wertungsTabelle(p)}</div>
      <div class="note ${neu?'green':''}">
        ${neu?`<b>Neuer Rekord: ${META.vp} Veteranenpunkte.</b>`:`Dein bester Lauf bleibt bei <b>${META.vp} Punkten</b>.`}
        <p style="margin-top:10px"><b>Hier endet der Prototyp.</b> Die Kapitel 2 bis 11 — Ägypten, Austerlitz, Eylau, Spanien, Russland, Leipzig, Frankreich, Waterloo — stehen im Konzept, aber noch nicht im Code.</p>
        <p style="margin-top:10px">Was hier funktioniert, funktioniert dort genauso: Proben gegen Attribute, Ausrüstung, die verschleißt, Ruf und Fürsprache, die über Beförderung entscheiden — und ein Tod, der endgültig ist.</p>
      </div>
    </div>
    <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">
      <button class="plain" onclick="zeigeLaden()">Noch einmal, besser</button>
      <button class="plain" onclick="zeigeTitel()">Zur Chronik</button>
      <button class="plain" onclick="speichern()">Spielstand sichern</button>
    </div>
  </div></div>`;
  S=null; kopfzeile();
}

/* ══════════════════ SPIELSTAND ══════════════════ */

function speichern(){
  const blob = new Blob([JSON.stringify(META,null,1)],{type:'application/json'});
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
    try{
      const d = JSON.parse(r.result);
      if(typeof d.vp === 'number'){ META = {vp:d.vp, chronik:d.chronik||[], bestKapitel:d.bestKapitel||{}}; zeigeTitel(); }
      else alert('Diese Datei ist kein Spielstand.');
    }catch(e){ alert('Diese Datei ließ sich nicht lesen.'); }
  };
  r.readAsText(f);
}
