'use strict';
/* Oberfläche: Titel, Kaufladen, Charaktererschaffung, Ablaufsteuerung, Szenen. */

/* ══════════════════ DARSTELLUNG ══════════════════ */

const app = document.getElementById('app');
const kopf = document.getElementById('kopfrechts');
const fuss = document.getElementById('fusszeile');
const untertitel = document.getElementById('untertitel');

function esc(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function balken(klasse, v, max){ return `<div class="bar ${klasse}"><i style="width:${Math.max(0,Math.min(100,100*v/max))}%"></i></div>`; }

/* Ortswechsel über der Station: woher, wohin, wie weit, wie lange.
   Die Wege sind die halbe Erzählung dieses Feldzugs — 1 200 km in einem Jahr. */
function wegband(n){
  if(!n || !n.marsch) return '';
  const m = n.marsch;
  return `<div class="weg">
    <div class="wegorte">${esc(m.von)}<i>→</i>${esc(m.nach)}</div>
    <div class="wegtext">${esc(m.weg)}</div></div>`;
}

function kopfzeile(){
  fuss.textContent = `Veteranenpunkte: ${META.vp}`;
  if(!S){ kopf.innerHTML = `VETERANENPUNKTE ${META.vp} · LÄUFE ${META.laeufe|0}`; untertitel.textContent='Erstes Kapitel · Italien 1796/97'; return; }
  kopf.innerHTML = `${esc(S.name.toUpperCase())} · ${rangName(S.rang).toUpperCase()} · RUF ${S.ruf}`;
  const n = KAPITEL[Math.min(LAUF?LAUF.node:0, KAPITEL.length-1)];
  untertitel.textContent = n && n.datum ? n.datum : 'Italien 1796/97';
}

/* ── Kampagnenverlauf links ──
   Zeigt alle elf Kampagnen, aber innerhalb einer Kampagne nur die Stationen,
   die man mindestens einmal betreten hat. Was danach kommt, weiß man nicht —
   das ist Absicht und dieselbe Haltung wie im Gefecht: Du siehst, wo du bist,
   nicht, was auf dich zukommt. Der Nebel liegt in META.bestKapitel und
   überlebt deshalb den Tod. */

let VERLAUF_OFFEN = {italien:1};

/* Kurze Wörter: Die Spalte ist 246 px breit, „Neuaufstellung" bricht dort um. */
function stationsArt(n){
  return {kampf:'Gefecht', lager:'Lager', winter:'Winter',
          befoerderung:'Musterung', elite:'Auswahl', ende:'Ende'}[n.typ] || '';
}

function verlauf(){
  const jetzt = LAUF ? (KAPITEL[Math.min(LAUF.node,KAPITEL.length-1)]||{}).id : null;
  const bloecke = KAMPAGNEN.map(k=>{
    const auf = !!VERLAUF_OFFEN[k.id];
    const st = STATIONEN[k.id] || [];
    const gesehen = st.filter(n=>n.id && META.bestKapitel[n.id]);
    const hier = st.some(n=>n.id===jetzt);
    let inhalt;
    if(!k.gebaut){
      inhalt = `<div class="kmpleer">Noch nicht gebaut. ${esc(k.kurz)}</div>`;
    } else if(!gesehen.length){
      inhalt = '<div class="kmpleer">Noch keine Station dieses Feldzugs betreten.</div>';
    } else {
      // Eine Zeile je Station: nur Ort und Art. Datum und Besuchszähler standen
      // früher mit darin und machten aus der Liste eine Tabelle. Das Datum steht
      // ohnehin im Kartenkopf, sobald man dort ist, und hängt hier im Titel.
      // Die beiden Stationen in Savona trennt jetzt die Art.
      inhalt = gesehen.map(n=>{
        const ort = (n.datum||'').split(' · ')[1] || n.ort || n.id;
        const art = stationsArt(n);
        return `<div class="kmpst ${n.id===jetzt?'jetzt':''} ${n.typ==='kampf'?'gefecht':''}"
          title="${esc(n.datum||'')}">
          <span class="kmpst-ort">${esc(ort)}</span>
          ${art?`<span class="kmpst-art">${art}</span>`:''}</div>`;
      }).join('');
      if(gesehen.length < st.length)
        inhalt += '<div class="kmpleer">Was danach kommt, weißt du nicht.</div>';
    }
    return `<div class="kmp ${auf?'auf':''} ${k.gebaut?'':'ungebaut'}" id="kmp_${k.id}">
      <button class="kmpkopf" onclick="verlaufUm('${k.id}')">
        <span class="kmppfeil">${auf?'▾':'▸'}</span>
        <span class="kmpnr">${k.nr}</span>
        <span class="kmpname">${esc(k.name)}${hier?' <i>· hier</i>':''}</span>
        <span class="kmpjahr">${esc(k.jahre)}</span>
      </button>
      <div class="kmpliste">${inhalt}</div></div>`;
  }).join('');
  return `<aside class="card verlauf"><div class="ch"><span>Der Weg</span><span>11 Feldzüge</span></div>
    <div class="cb">${bloecke}</div></aside>`;
}

/* Auf- und zuklappen ohne Neuaufbau des Bildschirms — sonst müsste jede
   Ansicht wissen, wie sie sich selbst neu zeichnet. */
function verlaufUm(id){
  const e = document.getElementById('kmp_'+id); if(!e) return;
  const auf = e.classList.toggle('auf');
  if(auf) VERLAUF_OFFEN[id]=1; else delete VERLAUF_OFFEN[id];
  const p = e.querySelector('.kmppfeil'); if(p) p.textContent = auf ? '▾' : '▸';
}

/* Ab 35 wird gewarnt, ab 30 kostet es wirklich (+5 Gefahr je Kampfrunde).
   Die Warnung kommt absichtlich fünf Punkte früher als der Malus — sie soll
   zum Schlafen im Lager bewegen, nicht den Schaden bloß melden. */
const ATEM_WARNUNG = 35;
function ausserAtem(){ return S && S.atem <= ATEM_WARNUNG; }

/* Dieselbe Regel für die Lebenspunkte: gewarnt wird bei einem Drittel, lange
   bevor es rechnerisch eng wird. Wer rot sieht, soll im Lager „Schlafen und
   liegen bleiben" wählen, statt scharf zu schießen. */
function angeschlagen(){ return S && S.leben <= lebenMax()/3; }

/* Der ungeschmälerte Vorrat. Steht blass hinter dem aktuellen, sobald offene
   Wunden ihn drücken — sonst wüsste niemand, warum die Obergrenze wandert. */
function lebenGrund(){ return 40 + Math.round((S.attr.konstitution||20)*0.6); }

function seitenleiste(){
  const geladen = K ? (K.geladen?'geladen':'ungeladen') : '—';
  // Krankheiten werden ausgewiesen: Sie zehren an jeder Station weiter, Wunden nicht.
  const w = S.wunden.length
    ? S.wunden.map(x=>esc(x.name) + (x.zehrt?' <i class="zehrt">zehrt</i>':'')).join(', ')
    : 'keine';
  const zust = k => { const a=S.ausr[k]; const c = a.zustand<20?'warn':(a.zustand<40?'':'ok');
    return `<div class="kv"><span>${esc(a.name)}</span><b class="${a.zustand<20?'warn':''}">${a.zustand}</b></div>`; };
  return `<aside class="card">
    <div class="ch"><span>${K?'Dein Zustand':'Charakterbogen'}</span></div>
    <div class="cb">
      <p class="who">${esc(S.name)}</p>
      <div class="rangzeile">${rangabzeichen(S)}
        <p class="whorank">${rangName(S.rang)} · 32. Halbbrigade</p></div>
      <div class="stat"><div class="statlab"><span>Leben</span><span class="${angeschlagen()?'warn':''}">${S.leben} / ${lebenMax()}${lebenMax()<lebenGrund()?` <i class="fein">von ${lebenGrund()}</i>`:''}</span></div>
        ${balken(angeschlagen()?'b-red':'b-green',S.leben,lebenMax())}
        ${angeschlagen()?`<p class="warnung">Du hast zu viel Blut verloren.${S.leben<=lebenMax()*0.15?' Der nächste Treffer wird der letzte sein.':' Noch ein oder zwei Treffer, und es ist vorbei.'}</p>`:''}</div>
      <div class="stat"><div class="statlab"><span>Atem</span><span class="${ausserAtem()?'warn':''}">${S.atem}</span></div>
        ${balken(ausserAtem()?'b-red':'b-steel',S.atem,100)}
        ${ausserAtem()?`<p class="warnung">Du bist außer Atem.${S.atem<30?' Unter 30 wird jede Runde im Gefecht gefährlicher — du triffst schlechter und sie treffen dich leichter.':' Unter 30 wird es im Gefecht gefährlich.'}</p>`:''}</div>
      <div class="stat"><div class="statlab"><span>Belastung</span><span>${S.belastung}</span></div>${balken('b-red',S.belastung,100)}</div>
      <div class="stat"><div class="statlab"><span>Ruf</span><span>${S.ruf}</span></div>${balken('b-brass',S.ruf,100)}</div>
      <div class="stat"><div class="statlab"><span>Kameradschaft</span><span>${S.kameradschaft}</span></div>${balken('b-green',S.kameradschaft,100)}</div>
      ${K?`<div class="rule"></div><div class="kv"><span>Muskete</span><b>${geladen}</b></div>
           <div class="kv"><span>Deckung</span><b>${K.deckung?'ja':'nein'}</b></div>`:''}
      <div class="rule"></div>
      <p class="mini">Attribute</p>
      ${ATTRIBUTE.map(([k,n])=>`<div class="kv"><span>${mitHilfe(k,n)}</span><b>${S.attr[k]}</b></div>`).join('')}
      <div class="rule"></div>
      <p class="mini">Fertigkeiten</p>
      ${FERTIGKEITEN.filter(([k])=>S.fert[k]>10).map(([k,n])=>`<div class="kv"><span>${mitHilfe(k,n)}</span><b>${S.fert[k]}</b></div>`).join('') || '<div class="kv"><span>alle bei 10</span><b>—</b></div>'}
      <div class="rule"></div>
      <p class="mini">Ausrüstung · Zustand</p>
      ${Object.keys(S.ausr).filter(k=>S.ausr[k].verschleiss>0).map(zust).join('')}
      <div class="rule"></div>
      <div class="kv"><span>Geld</span><b>${S.geld} F</b></div>
      <div class="kv"><span>Wunden</span><b class="${S.wunden.length?'warn':''}">${w}</b></div>
      <div class="kv"><span>Im Tagesbefehl</span><b>${S.nennungen}×</b></div>
      <div class="kv"><span>Gunst Martel</span><b>${S.gunst}</b></div>
    </div>
  </aside>`;
}

/* ── Titelbildschirm ── */
function zeigeTitel(){
  LAUF=null; binde(); kopfzeile();
  const offen = laufVorhanden();
  const best = META.chronik.length ? Math.max(...META.chronik.map(x=>x.punkte)) : 0;
  const chron = META.chronik.length ? META.chronik.map((c,i)=>
    `<tr${c.punkte===best?' class="hi"':''}>
      <td class="d"><button class="namebtn" onclick="zeigeBlatt(${i})">${c.punkte===best?'★ ':''}${esc(c.name)}</button></td>
      <td class="d">${esc(c.rang)}</td><td class="d">${esc(c.ende)}</td><td class="n">${c.punkte}</td></tr>`)
    .reverse().join('')
    : '<tr><td class="d" colspan="4">Noch kein Eintrag. Der erste Mann wartet.</td></tr>';

  app.innerHTML = `
  <div class="card"><div class="ch"><span>Der Marschallstab</span><span>Prototyp · Italien 1796/97</span></div>
   <div class="cb">
    <div class="zit">Du beginnst 1796 als Rekrut mit einer Muskete, die dir nicht gehört.<br>
    Wenn du dieses Kapitel überlebst, bist du vielleicht Caporal.<br>
    Wahrscheinlicher liegst du im April in einem Graben bei Montenotte.</div>
    ${offen ? `<div class="wirkung" style="margin-bottom:14px"><span>Unterbrochener Feldzug</span>
      ${esc(offen.mann.name)} · ${esc(rangNameVon(offen.mann))} · ${esc((KAPITEL[Math.min(offen.node,KAPITEL.length-1)].datum||'').split(' · ')[0])}</div>` : ''}
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px">
      ${offen ? '<button class="plain" onclick="fortsetzen()">Feldzug fortsetzen</button>' : ''}
      <button class="plain" onclick="zeigeErschaffung(true)">Neuen Mann aufstellen</button>
      <button class="plain" onclick="speichern()">Spielstand sichern</button>
      <button class="plain" onclick="document.getElementById('ladefeld').click()">Spielstand laden</button>
      <input type="file" id="ladefeld" accept=".json" class="hidden" onchange="laden(event)">
    </div>
    ${offen ? '' : `<p class="mini" style="margin:14px 0 0;color:var(--faint)">${Ablage.dauerhaft
      ? 'Der Feldzug wird selbsttätig gesichert. Wer stirbt, verliert ihn — wer aufhört, kommt zurück.'
      : 'Dieser Browser erlaubt keine selbsttätige Sicherung. Der Spielstand geht nur über die Datei.'}</p>`}
   </div></div>

  <div class="grid2">
    <div class="card"><div class="ch"><span>Chronik</span><span>${META.laeufe|0} Läufe</span></div>
      <div class="cb"><table><tr><th>Name</th><th>Endrang</th><th>Ende</th><th class="n">VP</th></tr>${chron}</table></div></div>
    ${verlauf()}
  </div>`;
  fuss.textContent = `Veteranenpunkte: ${META.vp}`;
}

/* ── Das Blatt eines Mannes ──
   Was in der Chronik als eine Zeile steht, war ein ganzer Feldzug. Hier steht
   er ausgeschrieben: womit er einrückte, was er unterwegs entschieden hat und
   womit er aufgehört hat. Ältere Einträge kennen diese Felder nicht — dann
   bleibt es bei der Zeile, und das Blatt sagt das auch. */
function zeigeBlatt(i){
  const c = META.chronik[i];
  if(!c){ zeigeTitel(); return; }
  const zeile = (k,v)=>`<div class="kv"><span>${k}</span><b>${v}</b></div>`;

  if(!c.attr){
    app.innerHTML = `<div class="card"><div class="ch"><span>${esc(c.name)}</span><span>${esc(c.ende)}</span></div>
      <div class="cb"><div class="note">Von diesem Mann ist nur die Zeile geblieben — er stammt aus einer Fassung,
      die noch kein Blatt geführt hat. ${esc(c.rang)}, ${c.punkte} Punkte.</div>
      <div style="margin-top:16px"><button class="plain" onclick="zeigeTitel()">Zurück zur Chronik</button></div>
      </div></div>`;
    return;
  }

  const taten = c.log.length ? c.log.map(z=>{
    const t = z.split(': '), n = KAPITEL.find(x=>x.id===t[0]);
    const wo = n ? ((n.datum||'').split(' · ')[1] || n.ort || t[0]) : t[0];
    return `<div class="blattzeile"><span class="blattort">${esc(wo)}</span><span>${esc(t.slice(1).join(': '))}</span></div>`;
  }).join('') : '<p class="hinweis">Er hat nichts entschieden, was jemand aufgeschrieben hätte.</p>';

  const fert = FERTIGKEITEN.filter(([k])=>c.fert[k]>10);
  app.innerHTML = `<div class="stage">${verlauf()}
    <div>
      <div class="card"><div class="ch"><span>${esc(c.name)}</span><span>${esc(c.ort||'')}</span></div>
        <div class="cb">
          <div class="rangzeile">${rangabzeichen({rang:c.rangN||1, zweig:c.zweig})}
            <p class="whorank">${esc(c.rang)} · ${esc(c.herkunft||'')} · 32. Halbbrigade</p></div>
          <div class="note ${c.gefallen?'red':'green'}">${c.gefallen
            ? esc(c.ende)+'. Von den Stationen dieses Feldzugs hat er '+c.stationen+' erreicht.'
            : esc(c.ende)+'. Er hat den Feldzug überstanden — '+c.stationen+' Stationen.'}</div>
          <div class="lage"><div class="lagekopf">Was er unterwegs entschieden hat</div>${taten}</div>
        </div></div>
      <div class="card"><div class="ch"><span>Wertung</span><span>${c.punkte} Veteranenpunkte</span></div>
        <div class="cb">${wertungsTabelleAus(c)}
        <div style="margin-top:16px"><button class="plain" onclick="zeigeTitel()">Zurück zur Chronik</button></div>
        </div></div>
    </div>
    <aside class="card"><div class="ch"><span>Sein Zustand am Ende</span></div><div class="cb">
      <p class="mini">Attribute</p>
      ${ATTRIBUTE.map(([k,n])=>zeile(mitHilfe(k,n), c.attr[k])).join('')}
      <div class="rule"></div>
      <p class="mini">Fertigkeiten</p>
      ${fert.length ? fert.map(([k,n])=>zeile(mitHilfe(k,n), c.fert[k])).join('') : '<div class="kv"><span>alle bei 10</span><b>—</b></div>'}
      <div class="rule"></div>
      <p class="mini">Ausrüstung · Zustand</p>
      ${c.ausr.filter(a=>a.verschleiss>0).map(a=>zeile(esc(a.name), a.zustand)).join('')}
      <div class="rule"></div>
      ${zeile('Ruf', c.ruf)}${zeile('Gunst Martel', c.gunst)}${zeile('Kameradschaft', c.kameradschaft)}
      ${c.lebenMax ? zeile('Leben', c.leben+' / '+c.lebenMax) : ''}
      ${zeile('Belastung', c.belastung)}${zeile('Atem', c.atem)}${zeile('Geld', c.geld+' F')}
      ${zeile('Im Tagesbefehl', c.nennungen+'×')}
      ${zeile('Wunden', c.wunden.length ? c.wunden.map(esc).join(', ') : 'keine')}
    </div></aside>
  </div>`;
  kopfzeile();
}

/* ── Veteranenpunkte ausgeben ──
   Zwei Arten, sie loszuwerden: Ausrüstung als Ganzes, oder Ausbildung in
   einzelnen Punkten. Die Punkte werden mit jedem Zehnerbereich teurer
   (PRO_PUNKT in grundwerte.js) — von 10 auf 20 kostet 10 VP, von 50 auf 60
   schon 40. Damit kauft man sich einen Vorsprung, aber nie eine Laufbahn:
   Rang, Ruf und Gunst bleiben unkäuflich (Invariante 3). */

let AUSWAHL = [], PUNKTE = {};
const PUNKT_SCHRITT = 5;
function istAttribut(k){ return ATTRIBUTE.some(([a])=>a===k); }

/* Der Preis rechnet vom **tatsächlichen** Wert, nicht vom Sockel: Die Erschaffung
   kommt zuerst, also steht schon fest, was Herkunft und Pool ergeben haben. Wer
   als Wilderer mit Muskete 40 anfängt, zahlt für den nächsten Punkt mehr als
   einer, der bei 10 steht — das ist der Sinn von PRO_PUNKT. */
function istWert(k){
  const h = HERKUENFTE.find(x=>x.id===(ERSCH&&ERSCH.herkunft)) || {attr:{},fert:{}};
  return istAttribut(k)
    ? Math.max(0, Math.min(70, (ERSCH?ERSCH.attr[k]:20) + (h.attr[k]||0)))
    : Math.max(0, Math.min(60, 10 + (h.fert[k]||0)));
}
function punktGrenze(k){ return istAttribut(k) ? 70 : 60; }   // darüber nur noch im Feld
function punktKosten(k){ const b = istWert(k); return kostenVon(b, b + (PUNKTE[k]||0)); }
function gesamtKosten(){
  return AUSWAHL.reduce((s,id)=>s+LADEN.find(p=>p.id===id).vp,0)
       + Object.keys(PUNKTE).reduce((s,k)=>s+punktKosten(k),0);
}

function punktZeile(k,n){
  const p = PUNKTE[k]||0, ist = istWert(k);
  return `<div class="punktzeile ${p?'gewaehlt':''}" id="pz_${k}">
    <span>${mitHilfe(k,n)}</span>
    <span class="punktwert" id="pw_${k}">${ist}${p?` <i>→</i> <b>${ist+p}</b>`:''}</span>
    <span class="punktvp ${p?'':'aus'}" id="pv_${k}">${p?punktKosten(k)+' VP':''}</span>
    <span><button class="pmbtn" onclick="stellePunkt('${k}',-PUNKT_SCHRITT)" id="pm_${k}">−</button>
    <button class="pmbtn" onclick="stellePunkt('${k}',PUNKT_SCHRITT)" id="pa_${k}">+</button></span>
  </div>`;
}

/* Zweiter Schritt der Erschaffung: Was der Vorrat aus dem fertigen Mann macht. */
function zeigeLaden(){
  if(!ERSCH || !ERSCH.herkunft){ zeigeErschaffung(); return; }
  AUSWAHL = []; PUNKTE = {};
  const zeilen = LADEN.map(p=>`<tr id="kz_${p.id}"><td class="k">${p.label}</td><td class="d">${p.beschr}</td>
    <td class="n">${p.vp}</td><td class="n"><button class="plain" style="padding:4px 12px;font-size:13px"
    onclick="waehle('${p.id}')" id="kb_${p.id}">wählen</button></td></tr>`).join('');
  const h = HERKUENFTE.find(x=>x.id===ERSCH.herkunft);
  app.innerHTML = `
  <div class="card"><div class="ch"><span>Zweiter Schritt · Veteranenpunkte</span><span id="vpanz">${META.vp} verfügbar</span></div>
   <div class="cb">
    <div class="note"><b>${esc(ERSCH.name)}</b>, ${esc(h.name)}. Die Werte unten sind die, mit denen er einrücken würde.
    Der Vorrat ist die Punktzahl deines besten Laufs; er wird nicht verbraucht, sondern bei jedem Neustart neu verteilt.
    ${META.vp===0?'<br><br><b>Beim ersten Mal hast du nichts.</b> Das gehört dazu — der erste Mann rückt ein, wie er ist.':''}</div>
   </div></div>

  <div class="card"><div class="ch"><span>Attribute ergänzen</span><span>je ${PUNKT_SCHRITT} Punkte · höchstens 70</span></div>
   <div class="cb">
    <p class="hinweis">Gerechnet wird vom jetzigen Wert. Der erste Zehner kostet 1 VP je Punkt, der fünfte schon 4 — wer schon hoch steht, zahlt für jeden weiteren Punkt mehr.</p>
    ${ATTRIBUTE.map(([k,n])=>punktZeile(k,n)).join('')}
   </div></div>

  <div class="card"><div class="ch"><span>Fertigkeiten ergänzen</span><span>je ${PUNKT_SCHRITT} Punkte · höchstens 60</span></div>
   <div class="cb">
    <p class="hinweis">Alle beginnen bei 10, sofern die Herkunft nichts anderes mitgebracht hat. Was darüber hinausgeht, musst du dir im Feld verdienen.</p>
    ${FERTIGKEITEN.map(([k,n])=>punktZeile(k,n)).join('')}
   </div></div>

  <div class="card"><div class="ch"><span>Ausrüstung</span><span>fertige Stücke statt einzelner Punkte</span></div>
   <div class="cb">
    <table><tr><th>Kauf</th><th>Wirkung</th><th class="n">VP</th><th class="n"></th></tr>${zeilen}</table>
    <div style="margin-top:18px;display:flex;gap:10px">
      <button class="plain" onclick="zeigeErschaffung()">Zurück zur Erschaffung</button>
      <button class="plain haupt" id="startbtn" onclick="starte()">Einrücken</button></div>
   </div></div>`;
  aktualisiereLaden();
}
function waehle(id){
  const i = AUSWAHL.indexOf(id);
  if(i>=0) AUSWAHL.splice(i,1);
  else { AUSWAHL.push(id); if(gesamtKosten() > META.vp) AUSWAHL.pop(); }
  aktualisiereLaden();
}
function stellePunkt(k,d){
  const alt = PUNKTE[k]||0, neu = alt + d;
  if(neu < 0 || istWert(k)+neu > punktGrenze(k)) return;
  PUNKTE[k] = neu;
  if(gesamtKosten() > META.vp){ PUNKTE[k] = alt; }     // der Vorrat ist die Grenze
  if(!PUNKTE[k]) delete PUNKTE[k];
  aktualisiereLaden();
}
function aktualisiereLaden(){
  const rest = META.vp - gesamtKosten();
  document.getElementById('vpanz').textContent = `${rest} von ${META.vp} übrig`;
  LADEN.forEach(p=>{
    const b = document.getElementById('kb_'+p.id), z = document.getElementById('kz_'+p.id);
    const drin = AUSWAHL.includes(p.id);
    b.textContent = drin?'gewählt':'wählen';
    b.disabled = !drin && p.vp>rest;
    z.className = drin?'gewaehlt':'';
    b.className = 'plain'+(drin?' gewaehlt':'');
  });
  ATTRIBUTE.concat(FERTIGKEITEN).forEach(([k])=>{
    const p = PUNKTE[k]||0, b = istWert(k);
    const pw = document.getElementById('pw_'+k), pv = document.getElementById('pv_'+k);
    pw.innerHTML = p ? `${b} <i>→</i> <b>${b+p}</b>` : String(b);
    pv.textContent = p?punktKosten(k)+' VP':''; pv.className = 'punktvp'+(p?'':' aus');
    document.getElementById('pz_'+k).className = 'punktzeile'+(p?' gewaehlt':'');
    document.getElementById('pm_'+k).disabled = !p;
    document.getElementById('pa_'+k).disabled =
      b+p+PUNKT_SCHRITT > punktGrenze(k) || kostenVon(b+p, b+p+PUNKT_SCHRITT) > rest;
  });
}

/* ── Charaktererschaffung ── */
const POOL = 120, SOCKEL = 20, MAXE = 70;
let ERSCH = null;
function zeigeErschaffung(neu){
  if(neu || !ERSCH){
    ERSCH = {name:'', herkunft:null, attr:{}};
    ATTRIBUTE.forEach(([k])=> ERSCH.attr[k]=SOCKEL);
  }
  const zeilen = ATTRIBUTE.map(([k,n])=>`
    <div class="attrrow">
      <span class="attrname">${mitHilfe(k,n)}${k==='bildung'?' <span style="color:var(--faint);font-size:11px">(fest)</span>':''}</span>
      ${balken('b-brass',ERSCH.attr[k],100).replace('class="bar','id="ab_'+k+'" class="bar')}
      <span class="attrval" id="av_${k}">${ERSCH.attr[k]}</span>
      <span><button class="pmbtn" onclick="stelle('${k}',-10)" id="am_${k}">−</button>
      <button class="pmbtn" onclick="stelle('${k}',10)" id="ap_${k}">+</button></span>
    </div>`).join('');
  app.innerHTML = `
  <div class="stage">${verlauf()}
    <div>
      <div class="card"><div class="ch"><span>Erster Schritt · Wer bist du</span></div><div class="cb">
        <input type="text" id="namefeld" placeholder="Name des Rekruten" value="${esc(ERSCH.name||zufallsName())}" oninput="ERSCH.name=this.value">
      </div></div>
      <div class="card"><div class="ch"><span>Attribute</span><span id="poolanz">${POOL} Punkte zu verteilen</span></div>
        <div class="cb">${zeilen}
        <p style="color:var(--faint);font-size:12.5px;margin-top:12px">Sockel 20 · höchstens 70 bei der Erschaffung · Bildung ist vom Pool ausgenommen.
        Alle neun Fertigkeiten beginnen bei 10.</p>
        <div style="margin-top:12px"><button class="plain" onclick="wuerfeln()">Auswürfeln</button></div>
      </div></div>
    </div>
    <div class="card"><div class="ch"><span>Herkunft</span><span>je genau 50 Punkte</span></div><div class="cb">
      <div class="herkwahl">${HERKUENFTE.map(h=>`<div class="herk${h.id===ERSCH.herkunft?' on':''}" id="h_${h.id}" onclick="waehleHerkunft('${h.id}')">
        <div class="hn">${h.name}</div><div class="hd">${h.text}</div></div>`).join('')}</div>
      <div style="margin-top:16px"><button class="plain" id="weiterbtn" onclick="zeigeLaden()" disabled>Weiter zu den Veteranenpunkten</button>
      <p class="hinweis" style="margin-top:10px">Danach kannst du auf diese Werte noch Veteranenpunkte legen.</p></div>
    </div></div>
  </div>`;
  ERSCH.name = document.getElementById('namefeld').value;
  aktualisiereErschaffung();
}
function zufallsName(){
  const v=['Étienne','Jean-Baptiste','Pierre','Antoine','Louis','Nicolas','Claude','Michel','François','Gilbert'];
  const n=['Duval','Rey','Vasseur','Marchand','Ferrand','Bonnet','Lemoine','Charpentier','Roussel','Barbier'];
  return v[Math.floor(Math.random()*v.length)]+' '+n[Math.floor(Math.random()*n.length)];
}
function verteilt(){ return ATTRIBUTE.reduce((s,[k])=>s+(ERSCH.attr[k]-SOCKEL),0); }
function stelle(k,d){
  if(k==='bildung') return;
  const neu = ERSCH.attr[k]+d;
  if(neu<SOCKEL || neu>MAXE) return;
  if(d>0 && verteilt()+d>POOL) return;
  ERSCH.attr[k]=neu; aktualisiereErschaffung();
}
function wuerfeln(){
  ATTRIBUTE.forEach(([k])=> ERSCH.attr[k]=SOCKEL);
  const frei = ATTRIBUTE.map(([k])=>k).filter(k=>k!=='bildung');
  let rest = POOL;
  const gew = frei.map(()=>Math.random()+0.35);
  while(rest>0){
    const i = gew.map((g,i)=>[g*Math.random(),i]).sort((a,b)=>b[0]-a[0])[0][1];
    const k = frei[i];
    if(ERSCH.attr[k]+10<=MAXE){ ERSCH.attr[k]+=10; rest-=10; }
    else { gew[i]=0; if(gew.every(g=>g===0)) break; }
  }
  aktualisiereErschaffung();
}
function waehleHerkunft(id){
  ERSCH.herkunft=id;
  HERKUENFTE.forEach(h=> document.getElementById('h_'+h.id).className = 'herk'+(h.id===id?' on':''));
  aktualisiereErschaffung();
}
function aktualisiereErschaffung(){
  const v = verteilt();
  document.getElementById('poolanz').textContent = `${POOL-v} von ${POOL} übrig`;
  ATTRIBUTE.forEach(([k])=>{
    document.getElementById('av_'+k).textContent = ERSCH.attr[k];
    const b = document.getElementById('ab_'+k); if(b) b.querySelector('i').style.width = ERSCH.attr[k]+'%';
    document.getElementById('am_'+k).disabled = (k==='bildung')||ERSCH.attr[k]<=SOCKEL;
    document.getElementById('ap_'+k).disabled = (k==='bildung')||ERSCH.attr[k]>=MAXE||v+10>POOL;
  });
  const b = document.getElementById('weiterbtn');
  if(b) b.disabled = !(ERSCH.herkunft && v===POOL && ERSCH.name.trim().length>0);
}
function starte(){
  laufVerwerfen();       // ein Platz, kein zweiter — der alte Feldzug ist damit vorbei
  neuerLauf(neuerCharakter(ERSCH.name.trim(), ERSCH.herkunft, ERSCH.attr, AUSWAHL, PUNKTE));
  naechster();
}

/* Fortsetzen ist kein Zurückspulen: Der Spielstand zeigt immer auf den letzten
   Schritt, nicht auf den letzten Halt. */
function fortsetzen(){
  const d = laufVorhanden();
  if(!d){ zeigeTitel(); return; }
  LAUF = d; binde(); naechster();
}

/* ══════════════════ ZWISCHENFÄLLE AUF DEM MARSCH ══════════════════

   Zwischen den Gefechten liegen Wochen, und bisher lagen sie nur im Wegband.
   Ein Zwischenfall ist eine kleine Szene, die beim Betreten einer Station mit
   Marschweg fallen kann (35 %, jeder nur einmal je Lauf): ein Weg mit Probe
   und Preis, ein Weg, der wenig kostet. Der Tod gehört ins Gefecht —
   `anwenden()` klemmt das Leben bei 1, ein Zwischenfall schwächt höchstens.

   **Wer eine Probe erkennbar nicht bestehen kann, bekommt keinen Knopf,
   sondern einen Satz** (`ab:{min, sonst}`): Der Analphabet wird nicht gefragt,
   ob er Briefe schreiben will — er muss verneinen, und das steht dann da.
   Geprüft wird gegen wert(), nicht das rohe Attribut: Ein Verwundeter kann
   Wege verlieren, die ihm gesund offenstünden.

   Vier Zwischenfälle geben toten Fertigkeiten ihre erste Verwendung:
   Feldchirurgie (der Verbandsplatz), Reiten (Protze und Beutepferd),
   Kartenkunde (der Ingenieur), Bildung (die Briefe). Das ist Absicht — die
   Herkünfte, die in diese Währungen zahlen, sollen etwas dafür sehen. */

const MARSCH_EREIGNISSE = [

  {id:'feldscher', titel:'Der Feldscher braucht Hände',
   wenn:(n)=> LAUF.node>0 && (KAPITEL[LAUF.node-1]||{}).typ==='kampf',
   text:['Hinter der Kirche liegen die Verwundeten von gestern in zwei Reihen, und zwischen ihnen geht ein einziger Mann mit aufgekrempelten Ärmeln. Er sieht dich an, weil du gerade da bist.',
         '„Halten kannst du doch", sagt er. Es ist keine Frage.'],
   optionen:[
     {label:'Die Nacht am Verbandsplatz bleiben', hint:'Halten, ziehen, zunähen', risk:true,
      probe:{wert:'feldchirurgie', schw:25},
      erfolg:{text:'Du hältst, was gehalten werden muss, und lernst, wohin man sieht und wohin nicht. Gegen Morgen sagt der Feldscher, du hättest ruhige Hände. Von ihm ist das eine Auszeichnung.',
              kameradschaft:8, gunst:1, ruf:1, fert:{feldchirurgie:6}, atem:-8},
      misserfolg:{text:'Der dritte Mann stirbt, während du ihn hältst, und du spürst genau den Augenblick, in dem er es tut. Der Feldscher arbeitet weiter. Du auch, aber deine Hände sind es nicht mehr.',
              belastung:8, fert:{feldchirurgie:4}, atem:-8}},
     {label:'Weitergehen', hint:'Dafür gibt es Sanitäter',
      erfolg:{text:'Du gehst weiter, wie fast alle. Was hinter der Kirche passiert, hört man bis zum Morgen.'}}]},

  {id:'briefe', titel:'Briefe nach Hause',
   text:['Nach dem Sold kommt das Heimweh. Drei Männer aus deiner Korporalschaft sitzen um eine Kiste und drehen ein leeres Blatt zwischen den Fingern — die Familie soll wissen, dass man lebt, und keiner von ihnen kann es ihr schreiben.'],
   optionen:[
     {label:'Sich als Schreiber anbieten', hint:'Zwei Sous je Brief',
      probe:{wert:'bildung', schw:35}, ab:{min:30,
        sonst:'Die Kameraden fragen die Reihe entlang, wer schreiben kann. Auch dich. Du musst verneinen, wie fast alle, und das Blatt bleibt leer, bis einer den Fourier bezahlt.'},
      erfolg:{text:'Du schreibst drei Briefe, langsam und in großen Buchstaben. Was die Männer diktieren, ist immer dasselbe: Es geht mir gut, das Land ist reich, schickt Nachricht. Sie zahlen, und sie merken sich, wer ihnen geholfen hat.',
              geld:4, kameradschaft:6},
      misserfolg:{text:'Beim zweiten Brief gerät der Name des Dorfes falsch, und der Mann sieht es nicht — aber der Fourier, der abends die Post siegelt, sieht es und liest ihn laut vor. Es wird gelacht. Nicht über den Mann.',
              ruf:-1, belastung:4, kameradschaft:2}},
     {label:'Zuhören, wie diktiert wird', hint:'Es kostet nichts',
      erfolg:{text:'Du sitzt dabei und hörst zu, was Männer nach Hause schreiben lassen, die seit einem Jahr nicht zu Hause waren. Es ist immer derselbe Brief. Er stimmt nie, und er soll auch nicht stimmen.',
              kameradschaft:2}}]},

  {id:'protze', titel:'Die durchgehende Protze',
   text:['Vor dir in der Kolonne geht ein Geschirr durch: zwei Pferde, eine Munitionsprotze, die Deichsel voran in die Marschordnung. Der Fahrer hängt halb im Sattel und hat die Zügel nicht mehr.',
         'Es sind vierzig Schritt, bis sie die Kompanie erreicht.'],
   optionen:[
     {label:'Den Pferden in die Zügel fallen', hint:'Vor die Deichsel, nicht daneben', risk:true,
      probe:{wert:'reiten', schw:35}, ab:{min:20,
        sonst:'Du hast nie im Leben ein Pferd am Zügel gehabt und weißt es. Du springst zur Seite, wie alle springen.'},
      erfolg:{text:'Du fasst das Sattelpferd am Backenstück und lehnst dich mit dem ganzen Gewicht hinein, und nach zwanzig Schritt steht es, zitternd und weiß am Hals. Der Fahrer wird abgelöst. Dich fragt ein Leutnant nach deinem Namen.',
              ruf:2, gunst:1, fert:{reiten:4}},
      misserfolg:{text:'Du bekommst den Zügel zu fassen und dann den Huf. Er trifft den Oberschenkel, nicht das Knie — das ist der ganze Unterschied zwischen einer schlechten Woche und einem Lazarett.',
              wunde:'Huftritt', belastung:4}},
     {label:'Die Deichsel packen', hint:'Geschick · mit dem Gewicht bremsen', risk:true,
      probe:{wert:'geschick', schw:40},
      erfolg:{text:'Du wirfst dich an die Deichsel und drückst sie herum, und die Protze schert aus der Kolonne, statt hineinzupflügen. Zwei andere hängen sich dazu. Es reicht.',
              ruf:2, atem:-8},
      misserfolg:{text:'Die Deichsel schlägt aus wie ein Balken im Sturm und wirft dich ins Feld. Die Protze fängt ein anderer — du fängst die Blicke.',
              leben:-8, belastung:6}},
     {label:'Beiseite springen', hint:'Das Naheliegende',
      erfolg:{text:'Du springst, die Kolonne spritzt auseinander, und hundert Schritt weiter läuft sich das Gespann im Acker fest. Zwei Mann liegen im Graben. Es hätte schlimmer kommen können, sagt man sich, bis es einer nicht mehr sagen kann.',
              belastung:2}}]},

  {id:'nachtwache', titel:'Die vierte Stunde',
   wenn:()=> S.rang <= 2,
   text:['Doppelposten am Rand des Lagers, die Stunde vor dem Morgengrauen. Dein Nebenposten schläft im Stehen, den Rücken am Baum, und vor euch ist ein Geräusch, das ein Igel sein kann oder nicht.'],
   optionen:[
     {label:'Wach bleiben und nachsehen', hint:'Zehn Schritt ins Dunkel',
      probe:{wert:'kaltbluetigkeit', schw:35},
      erfolg:{text:'Du gehst dem Geräusch entgegen, die Muskete halb angeschlagen, und stellst zwei Nachzügler einer feindlichen Patrouille, die sich verlaufen haben. Der wachhabende Sergent nimmt sie dir ab und merkt sich, wer sie gebracht hat.',
              ruf:2, gunst:1},
      misserfolg:{text:'Du gehst hin und findest nichts, und auf dem Rückweg findet dich der Rundgang — zehn Schritt vom Posten entfernt, den du nicht hättest verlassen dürfen. Die Erklärung interessiert niemanden.',
              ruf:-1, belastung:5}},
     {label:'Am Posten dösen wie der Nebenmann', hint:'Es ist die vierte Stunde',
      erfolg:{text:'Du döst im Stehen, das Kinn auf der Brust, und nichts passiert. In dieser Nacht.',
              belastung:-2}}]},

  {id:'kartenspiel', titel:'Karten um Sold',
   text:['Zahltag, und am dritten Feuer wird nicht um Knöpfe gespielt. Der Bursche, der die Bank hält, hat weiche Hände und gewinnt seit einer Stunde etwas zu gleichmäßig.'],
   optionen:[
     {label:'Sich setzen und die Bank beobachten', hint:'Menschenkenntnis · sein Sold gegen deinen', risk:true,
      probe:{wert:'menschenkenntnis', schw:45},
      erfolg:{text:'Du siehst nach vier Spielen, wann er unten abhebt, und setzt nur dann dagegen. Er merkt, dass du es merkst, und die Bank wird ehrlich — für dich. Du stehst mit acht Francs auf.',
              geld:8, kameradschaft:2},
      misserfolg:{text:'Du siehst nichts, setzt zweimal falsch und stehst mit leichter Tasche auf. Am nächsten Feuer erzählt einer, der Bursche zinke — aber das hilft deinem Sold nicht mehr.',
              geld:-6, belastung:4}},
     {label:'Zusehen und die Finger vom Sold lassen', hint:'Es kostet nichts',
      erfolg:{text:'Du siehst zu, wie andere verlieren, und trinkst den Schnaps, den ein Gewinner ausgibt. Das ist die einzige sichere Rechnung an diesem Feuer.',
              kameradschaft:2}}]},

  {id:'requisition', titel:'Requisition mit Quittung',
   text:['Der Fourier braucht zwei Mann für ein Dorf abseits der Straße: Heu, Brot und einen Ochsen — gegen Quittung, sagt der Befehl, denn geplündert wird hier nicht mehr, seit der Stab im Land lebt.'],
   optionen:[
     {label:'Die Quittung führen', hint:'Verwaltung · das Papier ist die Waffe',
      probe:{wert:'verwaltung', schw:35}, ab:{min:20,
        sonst:'Der Fourier hält dir Papier und Feder hin und sieht dich an. Dann sieht er dich genauer an und gibt beides dem Nebenmann.'},
      erfolg:{text:'Du schreibst auf, was genommen wird, mit Menge und Namen, und der Bauer bekommt sein Papier. Er glaubt nicht daran, aber er sieht, dass gezählt wurde — und der Fourier sieht es auch.',
              gunst:1, geld:5, fert:{verwaltung:5}},
      misserfolg:{text:'Deine Liste und der Wagen stimmen nicht überein, und was fehlt, fehlt zu deinen Lasten. Der Bauer beschwert sich beim Stab, mit deinem Zettel in der Hand.',
              ruf:-2, belastung:4}},
     {label:'Nur tragen und laden', hint:'Das Papier führen andere',
      erfolg:{text:'Du lädst Heu und treibst den Ochsen, und was auf dem Papier steht, ist nicht deine Sache. Der Rückweg ist lang und riecht nach Stall.',
              atem:-6}}]},

  {id:'nebenmann', titel:'Der Mann neben dir',
   text:['Guérin hält seit zwei Tagen nicht mehr Schritt. Das Fieber sitzt ihm in den Augen, die Schuhe sind seit Wochen offen, und heute Mittag ist er zum ersten Mal aus der Reihe gekippt und wieder aufgestanden, als hätte niemand es gesehen.',
         'Der Weg ist noch elf Kilometer.'],
   optionen:[
     {label:'Seinen Tornister dazunehmen', hint:'Sechzig Pfund werden hundert', risk:true,
      probe:{wert:'konstitution', schw:40},
      erfolg:{text:'Du trägst beide Tornister die elf Kilometer, und Guérin geht neben dir, leicht wie ein Kranker. Im Lager stellt er dir wortlos seinen Wein hin. Ab heute ist das dein Mann, und jeder weiß es.',
              kameradschaft:10, gunst:1, ruf:1, atem:-14},
      misserfolg:{text:'Nach sechs Kilometern trägst du zwei Tornister und schleifst einen Mann, und dann geht es nicht mehr. Der Karren der Nachhut nimmt ihn auf — was er dort aufschnappt, überlebt nicht jeder.',
              atem:-16, belastung:6, kameradschaft:4}},
     {label:'Weitermarschieren', hint:'Jeder trägt seins',
      erfolg:{text:'Du marschierst weiter, wie die Reihe marschiert. Guérin kommt am Abend nicht ins Lager. Am Morgen auch nicht. Sein Platz im Glied bleibt zwei Tage leer, dann rückt einer nach.',
              kameradschaft:-4}}]},

  /* ── Ägypten: die Wüste stellt andere Fragen ── */

  {id:'brunnen', titel:'Der halbe Brunnen', kapitel:'aegypten',
   text:['Der Brunnen am Rastplatz gibt Wasser für die Hälfte derer, die darum stehen. Es gibt keinen Offizier in Sichtweite, nur Durst, Ellenbogen und einen Eimer an einem zu kurzen Seil.'],
   optionen:[
     {label:'Eine Reihenfolge durchsetzen', hint:'Autorität · Verwundete zuerst', risk:true,
      probe:{wert:'autoritaet', schw:40},
      erfolg:{text:'Du stellst dich an den Rand und teilst ein: Verwundete, dann die Kompanien der Reihe nach, ein Eimer je Korporalschaft. Es murrt, aber es hält — weil einer da ist, der zählt.',
              ruf:2, gunst:1, kameradschaft:4},
      misserfolg:{text:'Du hebst die Stimme, und für einen Augenblick hört sogar jemand hin. Dann kippt der erste Eimer im Gedränge, und danach gilt wieder das Recht des längeren Arms. Deinen Namen merken sich die Falschen.',
              belastung:6, kameradschaft:-4}},
     {label:'Sich anstellen wie alle', hint:'Der Arm ist lang genug',
      erfolg:{text:'Du wartest, drängst, wenn gedrängt wird, und bekommst einen halben Eimer, lauwarm und trüb. Es ist das beste Wasser seit Tagen.',
              atem:4}}]},

  {id:'beutepferd', titel:'Das reiterlose Pferd', kapitel:'aegypten',
   text:['Nach dem Gefecht läuft ein Mamlukenpferd zwischen den Kompanien umher, gesattelt, die Steigbügel schlagend, die Satteltaschen schwer. Wer es fängt, dem gehört, was der Reiter nicht mehr braucht — so hält es die Armee, solange kein Offizier zusieht.'],
   optionen:[
     {label:'Es einfangen', hint:'Ruhig, von der Seite, an die Trense', risk:true,
      probe:{wert:'reiten', schw:40}, ab:{min:20,
        sonst:'Du weißt nicht einmal, an welcher Seite man ein Pferd anfasst. Zwei Chasseure wissen es, und die Satteltaschen gehören ihnen.'},
      erfolg:{text:'Du gehst schräg von hinten heran, redest Unsinn in ruhigem Ton und hast auf einmal die Trense in der Hand. In den Satteltaschen: ein Beutel Piaster und ein Pistolenpaar, das ein Escadronchef dir gegen gutes Geld abnimmt.',
              geld:12, ruf:1, fert:{reiten:4}},
      misserfolg:{text:'Das Pferd lässt dich bis auf einen Schritt heran und dreht dann die Hinterhand. Der Schlag wirft dich in den Sand, und als du wieder Luft hast, führt ein Chasseur das Pferd am Zügel davon.',
              leben:-8, belastung:4}},
     {label:'Es laufen lassen', hint:'Beute macht Neider',
      erfolg:{text:'Du siehst zu, wie andere sich darum balgen. Am Abend hat es ein Wachtmeister der Kavallerie, und die, die es fingen, haben den Streit.'}}]},

  {id:'ingenieur', titel:'Die Karte des Ingenieurs', kapitel:'aegypten',
   text:['Ein Ingenieurgeograph des Stabes sitzt am Rand der Marschsäule, die Karte auf den Knien, und vergleicht Brunnen, die es geben soll, mit Brunnen, die es gibt. Er sucht jemanden, der gestern die Vorhut gegangen ist — und der eine Karte halten kann, ohne sie zu drehen.'],
   optionen:[
     {label:'Die Route mit ihm abgleichen', hint:'Kartenkunde · Brunnen, Wadis, Stunden',
      probe:{wert:'kartenkunde', schw:35}, ab:{min:20,
        sonst:'Er hält dir die Karte hin. Die Linien sagen dir nichts, und er sieht es an deinen Augen, bevor du etwas sagen musst. „Schon gut", sagt er und winkt den Nächsten heran.'},
      erfolg:{text:'Du zeigst ihm den Brunnen, der versandet ist, und den Umweg über das Wadi, der eine Stunde kostet und zwei spart. Er zeichnet nach, fragt zweimal nach und schreibt sich am Ende deine Kompanie auf.',
              gunst:1, ruf:1, fert:{kartenkunde:6}},
      misserfolg:{text:'Du verwechselst zwei Wadis, die auf der Karte gleich aussehen und im Sand nicht. Die Kolonne merkt es am nächsten Mittag, als der Brunnen nicht kommt. Dass es dein Finger auf der Karte war, wissen zum Glück nur zwei.',
              belastung:5, atem:-6, fert:{kartenkunde:3}}},
     {label:'Wasser holen, während andere rechnen', hint:'Karten sind Offizierssache',
      erfolg:{text:'Du füllst die Feldflaschen der Korporalschaft, solange die Reihe kurz ist. Es ist die nützlichste Viertelstunde des Tages, auch wenn sie in keinem Bericht steht.',
              atem:4}}]},

  {id:'basar', titel:'Der Basar', kapitel:'aegypten',
   text:['Im Basar von Kairo gibt es alles, was der Armee fehlt: Kaffee, Datteln, Seife, Tabak. Die Preise entstehen beim Ansehen des Käufers, und du trägst die falsche Uniform für gute Preise.'],
   optionen:[
     {label:'Handeln, wie der Dolmetscher es vorgemacht hat', hint:'Menschenkenntnis · weggehen gehört dazu', risk:true,
      probe:{wert:'menschenkenntnis', schw:45},
      erfolg:{text:'Du bietest ein Drittel, gehst zweimal weg und lässt dich zweimal zurückrufen. Am Ende zahlst du die Hälfte des ersten Preises und bekommst den Kaffee dazu, den der Händler „nur für dich" aufbrüht. Ihr betrügt euch beide und seid zufrieden.',
              geld:6, belastung:-4},
      misserfolg:{text:'Du zahlst den ersten Preis, und am Nachbarstand zahlt ein Chasseur für dasselbe die Hälfte. Der Händler segnet dich beim Einpacken. Jetzt weißt du auch, warum.',
              geld:-5, belastung:3}},
     {label:'Das Geld in der Tasche lassen', hint:'Sold ist Sold',
      erfolg:{text:'Du gehst durch die Gassen, siehst und riechst, was es alles gäbe, und behältst die Hand am Beutel — auch, weil hier Hände unterwegs sind, die schneller sind als deine.'}}]}
];

/* Welche Wege offenstehen: Ein `ab.min` gegen wert() sperrt den Knopf und
   liefert stattdessen den Satz, der an seine Stelle tritt. */
function marschOffen(e){ return e.optionen.filter(o => !(o.ab && o.probe && wert(o.probe.wert) < o.ab.min)); }
function marschVerwehrt(e){ return e.optionen.filter(o => o.ab && o.probe && wert(o.probe.wert) < o.ab.min); }

function marschWuerfeln(n){
  const gesehen = S.marschGesehen || [];
  const aeg = (STATIONEN.aegypten||[]).some(x=>x.id===n.id);
  const pool = MARSCH_EREIGNISSE.filter(e =>
    !gesehen.includes(e.id) &&
    (!e.kapitel || (e.kapitel==='aegypten' && aeg)) &&
    (!e.wenn || e.wenn(n)));
  if(!pool.length || Math.random() > 0.35) return null;
  return pool[Math.floor(Math.random()*pool.length)];
}

function zeigeMarschEreignis(e, n){
  const offen = marschOffen(e);
  const opt = offen.map((o,i)=>`<button class="ord ${o.risk?'risk':''}" onclick="marschWaehlen(${i})">
    ${esc(o.label)}<span class="cost">${esc(o.hint||'')}${o.probe?' · '+NAMEN[o.probe.wert]+' '+wert(o.probe.wert)+' gegen '+o.probe.schw:''}</span></button>`).join('');
  const gesperrt = marschVerwehrt(e).map(o=>`<p>${esc(o.ab.sonst)}</p>`).join('');
  app.innerHTML = `<div class="stage">${verlauf()}
    <div>${wegband(n)}<div class="card"><div class="ch"><span>Auf dem Marsch · ${esc(e.titel)}</span><span>${esc(n.datum||'')}</span></div>
      <div class="cb"><div class="prose">${e.text.map(t=>`<p>${t}</p>`).join('')}${gesperrt}</div></div></div>
      <div class="orders"><div class="ch"><span>Was tust du?</span></div><div class="ordbody">${opt}</div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

function marschWaehlen(i){
  const e = MARSCH_EREIGNISSE.find(x=>x.id===LAUF.marsch);
  const n = KAPITEL[LAUF.node];
  const o = marschOffen(e)[i];
  let w, klasse='gut', probeText='';
  if(o.probe){
    const p = probe(o.probe.wert, o.probe.schw);
    w = p.erfolg ? o.erfolg : (o.misserfolg||o.erfolg);
    klasse = p.erfolg ? 'gut' : 'schlecht';
    probeText = `<div class="pruefung ${klasse}">${NAMEN[o.probe.wert]} — ${p.erfolg?'gelungen':'misslungen'}</div>`;
  } else w = o.erfolg;
  anwenden(w);
  S.log.push('marsch: '+o.label);
  LAUF.marsch = null;
  laufSichern();
  app.innerHTML = `<div class="stage">${verlauf()}
    <div><div class="card"><div class="ch"><span>Auf dem Marsch · ${esc(e.titel)}</span><span>${esc(n.datum||'')}</span></div>
      <div class="cb"><div class="ergebnis ${klasse}">${w.text}${probeText}</div>${wirkungen(w)}
      </div></div>
      <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="naechster()">Weiter</button></div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

/* ══════════════════ ABLAUF ══════════════════ */

function naechster(){
  if(!S.lebt){ zeigeTod(); return; }
  if(LAUF.node >= KAPITEL.length){ zeigeKapitelende(); return; }
  const n = KAPITEL[LAUF.node];
  if(n.datum && n.id && LAUF.gezaehlt !== n.id){
    LAUF.gezaehlt = n.id;                 // beim Fortsetzen nicht doppelt zählen
    const b = META.bestKapitel[n.id] || {mal:0,rang:''};
    b.mal++; if(!b.rang || S.rang>=RANG.findIndex(r=>r.name===b.rang)+1) b.rang = rangName(S.rang);
    META.bestKapitel[n.id]=b;
    chronikSichern();
  }
  laufSichern();
  kopfzeile();
  /* Zwischenfall auf dem Marsch: hängt einer an (auch nach Fortsetzen), steht
     er wieder da; sonst wird beim ersten Betreten einer Station mit Marschweg
     einmal gewürfelt. Vor Gefechten nicht — dort trägt der Anmarsch die Last. */
  if(LAUF.marsch){
    const me = MARSCH_EREIGNISSE.find(x=>x.id===LAUF.marsch);
    if(me){ zeigeMarschEreignis(me, n); return; }
    LAUF.marsch = null;
  }
  if(n.marsch && n.id && n.typ!=='kampf' && LAUF.marschGeprueft !== n.id){
    LAUF.marschGeprueft = n.id;
    const me = marschWuerfeln(n);
    if(me){
      LAUF.marsch = me.id;
      (S.marschGesehen = S.marschGesehen||[]).push(me.id);
      laufSichern();
      zeigeMarschEreignis(me, n); return;
    }
    laufSichern();
  }
  if(n.typ==='szene') zeigeSzene(n);
  else if(n.typ==='lager') zeigeLager(n);
  else if(n.typ==='kampf'){
    // Hing der Lauf mitten in einer Ereignis-Frage, steht sie wieder da —
    // sonst ließe sich die Wahl durch Beenden und Fortsetzen umgehen.
    const e = K && K.ereignis && GEFECHTS_EREIGNISSE.find(x=>x.id===K.ereignis);
    if(e) zeigeEreignis(e);
    else if(K) zeigeKampf('Das Gefecht geht weiter, wo du es verlassen hast.');
    else starteKampf(n);
  }
  else if(n.typ==='befoerderung') zeigeBefoerderung(n);
  else if(n.typ==='elite') zeigeElite(n);
  else if(n.typ==='winter') zeigeWinter(n);
  else if(n.typ==='uebergang') zeigeUebergang(n);
  else if(n.typ==='ende') zeigeKapitelende(n);
}

/* ── Übergang zwischen zwei Feldzügen ──
   Kein Ende, kein Neuanfang: Der Mann bleibt derselbe, nur der Krieg wechselt
   das Ufer. Der Zwischenstand wird gezeigt, aber nichts wird eingetragen —
   gewertet wird ein Lauf erst, wenn er endet (Invariante 2: Banken zwischendurch
   gäbe es nicht, weil ein späterer Tod immer mindestens die Stationen von jetzt
   enthält). */
function zeigeUebergang(n){
  /* Zwischen zwei Feldzügen liegt ein Jahr Garnison. Nach derselben Regel wie
     beim Winterquartier (drei Wochen Dach = Atem voll) heilt ein Jahr alles,
     was heilbar ist: Leben und Atem voll, Wunden zu, Belastung halbiert. Der nächste
     Feldzug beginnt mit seinem eigenen Elend, nicht mit dem alten — sonst
     stirbt in Ägypten niemand an Ägypten, sondern an Arcole. */
  if(LAUF.erholt !== n.id){
    LAUF.erholt = n.id;
    S.leben = lebenMax();
    S.atem = 100; atemKlemmen();
    S.belastung = Math.max(0, Math.floor(S.belastung/2));
    S.wunden = [];
    laufSichern();
  }
  app.innerHTML = `<div class="stage">${verlauf()}
    <div>${wegband(n)}
      <div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
        <div class="cb"><div class="prose">${(n.text||[]).map(t=>`<p>${t}</p>`).join('')}</div>
        <div class="wirkung"><span>Zwischenstand</span>
          ${rangName(S.rang)} · Ruf ${S.ruf} · ${stationen()} Stationen · ${S.nennungen}× im Tagesbefehl</div>
        <div class="wirkung"><span>Ein Jahr Garnison</span>
          Die Wunden schließen sich, der Atem kommt zurück. Was bleibt, ist, was du gelernt hast — und die Hälfte der Last.</div>
        </div></div>
      <div class="orders"><div class="ordbody">
        <button class="ord weiter" onclick="stationErledigt();naechster()">Weiter
          <span class="cost">Der nächste Feldzug · derselbe Mann</span></button>
      </div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

/* ── Szene ── */
function zeigeSzene(n){
  const opt = n.optionen.map((o,i)=>{
    const gesperrt = o.probe && wert(o.probe.wert)<5;
    return `<button class="ord ${o.risk?'risk':''}" onclick="waehleOption(${i})" ${gesperrt?'disabled':''}>
      ${esc(o.label)}<span class="cost">${esc(o.kosten||o.hint||'')}${o.probe?' · '+NAMEN[o.probe.wert]+' '+wert(o.probe.wert)+' gegen '+o.probe.schw:''}</span></button>`;
  }).join('');
  app.innerHTML = `<div class="stage">${verlauf()}
    <div>${wegband(n)}<div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb"><div class="prose">${n.text.map(t=>`<p>${t}</p>`).join('')}</div></div></div>
      <div class="orders"><div class="ch"><span>Was tust du?</span></div><div class="ordbody">${opt}</div></div>
    </div>${seitenleiste()}</div>`;
  LAUF.szene = n.id;
}
function waehleOption(i){
  const n = KAPITEL[LAUF.node], o = n.optionen[i];
  let erg, klasse='', probeText='';
  if(o.probe){
    const p = probe(o.probe.wert, o.probe.schw);
    erg = p.erfolg ? o.erfolg : (o.misserfolg||o.erfolg);
    klasse = p.erfolg ? 'gut' : 'schlecht';
    // Nur das Ergebnis, nicht die Rechnung: Wert und Schwierigkeit stehen schon
    // vor der Wahl auf dem Knopf, und Zielwert und Wurf sagen hinterher nichts mehr.
    probeText = `<div class="pruefung ${klasse}">${NAMEN[o.probe.wert]} — ${p.erfolg?'gelungen':'misslungen'}</div>`;
  } else { erg = o.erfolg; klasse='gut'; }
  anwenden(erg);
  verschleiss(0.35);
  S.log.push(n.id+': '+o.label);
  stationErledigt();
  app.innerHTML = `<div class="stage">${verlauf()}
    <div><div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb"><div class="prose"><p class="said">${esc(o.label)}</p></div>
        <div class="ergebnis ${klasse}">${erg.text}${probeText}</div>
        ${wirkungen(erg)}</div></div>
      <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="naechster()">Weiter</button></div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}
function wirkungen(e){
  const t=[];
  const m = {ruf:'Ruf',gunst:'Gunst',kameradschaft:'Kameradschaft',belastung:'Belastung',atem:'Atem',geld:'Francs',leben:'Leben'};
  for(const k in m) if(e[k]) t.push(`${m[k]} ${e[k]>0?'+':''}${e[k]}`);
  if(e.attr) for(const k in e.attr) t.push(`${NAMEN[k]} ${e.attr[k]>0?'+':''}${e.attr[k]}`);
  if(e.fert) for(const k in e.fert) if(e.fert[k]) t.push(`${NAMEN[k]} ${e.fert[k]>0?'+':''}${e.fert[k]}`);
  if(e.ausr) for(const k in e.ausr) t.push(`${S.ausr[k].name} ${e.ausr[k]>0?'+':''}${e.ausr[k]}`);
  if(e.wunde) t.push('Wunde: '+e.wunde);
  if(e.nennung) t.push('Im Tagesbefehl genannt');
  return t.length ? `<div class="wirkung"><span>Wirkung</span>${t.join(' · ')}</div>` : '';
}
