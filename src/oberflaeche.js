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
      inhalt = '<div class="kmpleer">Du warst noch nirgends. Es fängt in Savona an.</div>';
    } else {
      // Eine Zeile je Station: Ort, Art, wie oft. Das Datum stand früher darunter
      // und machte aus der Liste eine Tabelle — es steht ohnehin im Kartenkopf,
      // sobald man dort ist. Die beiden Stationen in Savona trennt jetzt die Art.
      inhalt = gesehen.map(n=>{
        const b = META.bestKapitel[n.id];
        const ort = (n.datum||'').split(' · ')[1] || n.ort || n.id;
        const art = stationsArt(n);
        return `<div class="kmpst ${n.id===jetzt?'jetzt':''} ${n.typ==='kampf'?'gefecht':''}"
          title="${esc(n.datum||'')}">
          <span class="kmpst-ort">${esc(ort)}</span>
          ${art?`<span class="kmpst-art">${art}</span>`:''}
          ${b.mal>1?`<span class="kmpst-mal">${b.mal}×</span>`:''}</div>`;
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

function seitenleiste(){
  const geladen = K ? (K.geladen?'geladen':'ungeladen') : '—';
  const w = S.wunden.length ? S.wunden.map(x=>esc(x.name)).join(', ') : 'keine';
  const zust = k => { const a=S.ausr[k]; const c = a.zustand<20?'warn':(a.zustand<40?'':'ok');
    return `<div class="kv"><span>${esc(a.name)}</span><b class="${a.zustand<20?'warn':''}">${a.zustand}</b></div>`; };
  return `<aside class="card">
    <div class="ch"><span>${K?'Dein Zustand':'Charakterbogen'}</span></div>
    <div class="cb">
      <p class="who">${esc(S.name)}</p>
      <p class="whorank">${rangName(S.rang)} · 32. Halbbrigade</p>
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
  const chron = META.chronik.length ? META.chronik.slice().reverse().map(c=>
    `<tr${c.punkte===Math.max(...META.chronik.map(x=>x.punkte))?' class="hi"':''}>
      <td class="d">${c.punkte===Math.max(...META.chronik.map(x=>x.punkte))?'★ ':''}${esc(c.name)}</td>
      <td class="d">${esc(c.rang)}</td><td class="d">${esc(c.ende)}</td><td class="n">${c.punkte}</td></tr>`).join('')
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
    ? Math.max(0, Math.min(100, (ERSCH?ERSCH.attr[k]:20) + (h.attr[k]||0)))
    : Math.max(0, Math.min(100, 10 + (h.fert[k]||0)));
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
  if(n.typ==='szene') zeigeSzene(n);
  else if(n.typ==='lager') zeigeLager(n);
  else if(n.typ==='kampf'){ if(K) zeigeKampf('Das Gefecht geht weiter, wo du es verlassen hast.'); else starteKampf(n); }
  else if(n.typ==='befoerderung') zeigeBefoerderung(n);
  else if(n.typ==='elite') zeigeElite(n);
  else if(n.typ==='winter') zeigeWinter(n);
  else if(n.typ==='ende') zeigeKapitelende();
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
  const m = {ruf:'Ruf',gunst:'Gunst',kameradschaft:'Kameradschaft',belastung:'Belastung',atem:'Atem',geld:'Francs'};
  for(const k in m) if(e[k]) t.push(`${m[k]} ${e[k]>0?'+':''}${e[k]}`);
  if(e.attr) for(const k in e.attr) t.push(`${NAMEN[k]} ${e.attr[k]>0?'+':''}${e.attr[k]}`);
  if(e.fert) for(const k in e.fert) if(e.fert[k]) t.push(`${NAMEN[k]} ${e.fert[k]>0?'+':''}${e.fert[k]}`);
  if(e.ausr) for(const k in e.ausr) t.push(`${S.ausr[k].name} ${e.ausr[k]>0?'+':''}${e.ausr[k]}`);
  if(e.wunde) t.push('Wunde: '+e.wunde);
  if(e.nennung) t.push('Im Tagesbefehl genannt');
  return t.length ? `<div class="wirkung"><span>Wirkung</span>${t.join(' · ')}</div>` : '';
}
