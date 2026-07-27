'use strict';
/* Winterquartier, Punktwertung, Tod, Kapitelende, Spielstand. */

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
  app.innerHTML = `<div class="stage"><div>
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
  p.stationen = 4 * stationen();
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
    <tr><td class="d">Erreichte Stationen (${stationen()} × 4)</td><td class="n">${p.stationen}</td></tr>
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
