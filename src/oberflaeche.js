'use strict';
/* Oberfläche: Titel, Kaufladen, Charaktererschaffung, Ablaufsteuerung, Szenen. */

/* ══════════════════ DARSTELLUNG ══════════════════ */

const app = document.getElementById('app');
const kopf = document.getElementById('kopfrechts');
const fuss = document.getElementById('fusszeile');
const untertitel = document.getElementById('untertitel');

function esc(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function balken(klasse, v, max){ return `<div class="bar ${klasse}"><i style="width:${Math.max(0,Math.min(100,100*v/max))}%"></i></div>`; }

function kopfzeile(){
  fuss.textContent = `Veteranenpunkte: ${META.vp}`;
  if(!S){ kopf.innerHTML = `VETERANENPUNKTE ${META.vp} · LÄUFE ${META.chronik.length}`; untertitel.textContent='Erstes Kapitel · Italien 1796/97'; return; }
  kopf.innerHTML = `${esc(S.name.toUpperCase())} · ${rangName(S.rang).toUpperCase()} · RUF ${S.ruf}`;
  const n = KAPITEL[Math.min(NODE,KAPITEL.length-1)];
  untertitel.textContent = n && n.datum ? n.datum : 'Italien 1796/97';
}

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
      <div class="stat"><div class="statlab"><span>Atem</span><span>${S.atem}</span></div>${balken('b-steel',S.atem,100)}</div>
      <div class="stat"><div class="statlab"><span>Belastung</span><span>${S.belastung}</span></div>${balken('b-red',S.belastung,100)}</div>
      <div class="stat"><div class="statlab"><span>Ruf</span><span>${S.ruf}</span></div>${balken('b-brass',S.ruf,100)}</div>
      <div class="stat"><div class="statlab"><span>Kameradschaft</span><span>${S.kameradschaft}</span></div>${balken('b-green',S.kameradschaft,100)}</div>
      ${K?`<div class="rule"></div><div class="kv"><span>Muskete</span><b>${geladen}</b></div>
           <div class="kv"><span>Deckung</span><b>${K.deckung?'ja':'nein'}</b></div>`:''}
      <div class="rule"></div>
      <p class="mini">Attribute</p>
      ${ATTRIBUTE.map(([k,n])=>`<div class="kv"><span>${n}</span><b>${S.attr[k]}</b></div>`).join('')}
      <div class="rule"></div>
      <p class="mini">Fertigkeiten</p>
      ${FERTIGKEITEN.filter(([k])=>S.fert[k]>10).map(([k,n])=>`<div class="kv"><span>${n}</span><b>${S.fert[k]}</b></div>`).join('') || '<div class="kv"><span>alle bei 10</span><b>—</b></div>'}
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
  S=null; K=null; kopfzeile();
  const chron = META.chronik.length ? META.chronik.slice().reverse().map(c=>
    `<tr${c.punkte===Math.max(...META.chronik.map(x=>x.punkte))?' class="hi"':''}>
      <td class="d">${c.punkte===Math.max(...META.chronik.map(x=>x.punkte))?'★ ':''}${esc(c.name)}</td>
      <td class="d">${esc(c.rang)}</td><td class="d">${esc(c.ende)}</td><td class="n">${c.punkte}</td></tr>`).join('')
    : '<tr><td class="d" colspan="4">Noch kein Eintrag. Der erste Mann wartet.</td></tr>';

  const best = KAPITEL.filter(n=>n.datum).map((n,i)=>{
    const b = META.bestKapitel[n.id];
    return `<tr><td class="d">${esc(n.datum.split(' · ')[1]||n.id)}</td>
      <td class="n">${b?b.mal+'×':'—'}</td><td class="d">${b?esc(b.rang):'nie erreicht'}</td></tr>`;
  }).join('');

  app.innerHTML = `
  <div class="card"><div class="ch"><span>Der Marschallstab</span><span>Prototyp · Italien 1796/97</span></div>
   <div class="cb">
    <div class="zit">Du beginnst 1796 als Rekrut mit einer Muskete, die dir nicht gehört.<br>
    Wenn du dieses Kapitel überlebst, bist du vielleicht Caporal.<br>
    Wahrscheinlicher liegst du im April in einem Graben bei Montenotte.</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px">
      <button class="plain" onclick="zeigeLaden()">Neuen Mann aufstellen</button>
      <button class="plain" onclick="speichern()">Spielstand sichern</button>
      <button class="plain" onclick="document.getElementById('ladefeld').click()">Spielstand laden</button>
      <input type="file" id="ladefeld" accept=".json" class="hidden" onchange="laden(event)">
    </div>
   </div></div>

  <div class="grid2">
    <div class="card"><div class="ch"><span>Chronik</span><span>${META.chronik.length} Läufe</span></div>
      <div class="cb"><table><tr><th>Name</th><th>Endrang</th><th>Ende</th><th class="n">VP</th></tr>${chron}</table></div></div>
    <div class="card"><div class="ch"><span>Wie weit ich schon war</span></div>
      <div class="cb"><table><tr><th>Station</th><th class="n">erreicht</th><th>bester Rang dort</th></tr>${best}</table></div></div>
  </div>`;
  fuss.textContent = `Veteranenpunkte: ${META.vp}`;
}

/* ── Veteranenpunkte ausgeben ── */
let AUSWAHL = [];
function zeigeLaden(){
  AUSWAHL = [];
  const zeilen = LADEN.map(p=>`<tr id="kz_${p.id}"><td class="k">${p.label}</td><td class="d">${p.beschr}</td>
    <td class="n">${p.vp}</td><td class="n"><button class="plain" style="padding:4px 12px;font-size:13px"
    onclick="waehle('${p.id}')" id="kb_${p.id}">wählen</button></td></tr>`).join('');
  app.innerHTML = `
  <div class="card"><div class="ch"><span>Veteranenpunkte ausgeben</span><span id="vpanz">${META.vp} verfügbar</span></div>
   <div class="cb">
    <div class="note">Der Vorrat ist die Punktzahl deines besten Laufs. Er wird nicht verbraucht — bei jedem Neustart verteilst du ihn neu.
    ${META.vp===0?'<br><br><b>Beim ersten Mal hast du nichts.</b> Das gehört dazu.':''}</div>
    <table style="margin-top:16px"><tr><th>Kauf</th><th>Wirkung</th><th class="n">VP</th><th class="n"></th></tr>${zeilen}</table>
    <div style="margin-top:16px;display:flex;gap:10px"><button class="plain" onclick="zeigeErschaffung()">Weiter zur Erschaffung</button>
    <button class="plain" onclick="zeigeTitel()">Zurück</button></div>
   </div></div>`;
  aktualisiereLaden();
}
function waehle(id){
  const i = AUSWAHL.indexOf(id);
  if(i>=0) AUSWAHL.splice(i,1); else AUSWAHL.push(id);
  aktualisiereLaden();
}
function aktualisiereLaden(){
  const aus = AUSWAHL.reduce((s,id)=>s+LADEN.find(p=>p.id===id).vp,0);
  const rest = META.vp - aus;
  document.getElementById('vpanz').textContent = `${rest} von ${META.vp} übrig`;
  LADEN.forEach(p=>{
    const b = document.getElementById('kb_'+p.id), z = document.getElementById('kz_'+p.id);
    const drin = AUSWAHL.includes(p.id);
    b.textContent = drin?'gewählt':'wählen';
    b.disabled = !drin && p.vp>rest;
    z.className = drin?'hi':'';
  });
}

/* ── Charaktererschaffung ── */
const POOL = 120, SOCKEL = 20, MAXE = 70;
let ERSCH = null;
function zeigeErschaffung(){
  ERSCH = {name:'', herkunft:null, attr:{}};
  ATTRIBUTE.forEach(([k])=> ERSCH.attr[k]=SOCKEL);
  const zeilen = ATTRIBUTE.map(([k,n])=>`
    <div class="attrrow">
      <span class="attrname">${n}${k==='bildung'?' <span style="color:var(--faint);font-size:11px">(fest)</span>':''}</span>
      ${balken('b-brass',ERSCH.attr[k],100).replace('class="bar','id="ab_'+k+'" class="bar')}
      <span class="attrval" id="av_${k}">${ERSCH.attr[k]}</span>
      <span><button class="pmbtn" onclick="stelle('${k}',-10)" id="am_${k}">−</button>
      <button class="pmbtn" onclick="stelle('${k}',10)" id="ap_${k}">+</button></span>
    </div>`).join('');
  app.innerHTML = `
  <div class="stage">
    <div>
      <div class="card"><div class="ch"><span>Wer bist du</span></div><div class="cb">
        <input type="text" id="namefeld" placeholder="Name des Rekruten" value="${zufallsName()}" oninput="ERSCH.name=this.value">
      </div></div>
      <div class="card"><div class="ch"><span>Attribute</span><span id="poolanz">${POOL} Punkte zu verteilen</span></div>
        <div class="cb">${zeilen}
        <p style="color:var(--faint);font-size:12.5px;margin-top:12px">Sockel 20 · höchstens 70 bei der Erschaffung · Bildung ist vom Pool ausgenommen.
        Alle neun Fertigkeiten beginnen bei 10.</p>
        <div style="margin-top:12px"><button class="plain" onclick="wuerfeln()">Auswürfeln</button></div>
      </div></div>
    </div>
    <div class="card"><div class="ch"><span>Herkunft</span><span>je genau 50 Punkte</span></div><div class="cb">
      <div class="herkwahl">${HERKUENFTE.map(h=>`<div class="herk" id="h_${h.id}" onclick="waehleHerkunft('${h.id}')">
        <div class="hn">${h.name}</div><div class="hd">${h.text}</div></div>`).join('')}</div>
      <div style="margin-top:16px"><button class="plain" id="startbtn" onclick="starte()" disabled>Einrücken</button></div>
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
  const b = document.getElementById('startbtn');
  if(b) b.disabled = !(ERSCH.herkunft && v===POOL && ERSCH.name.trim().length>0);
}
function starte(){
  S = neuerCharakter(ERSCH.name.trim(), ERSCH.herkunft, ERSCH.attr, AUSWAHL);
  NODE = 0; K = null; WOCHEN = 3; naechster();
}

/* ══════════════════ ABLAUF ══════════════════ */

function naechster(){
  if(!S.lebt){ zeigeTod(); return; }
  if(NODE >= KAPITEL.length){ zeigeKapitelende(); return; }
  const n = KAPITEL[NODE];
  if(n.datum && n.id){
    const b = META.bestKapitel[n.id] || {mal:0,rang:''};
    b.mal++; if(!b.rang || S.rang>=RANG.findIndex(r=>r.name===b.rang)+1) b.rang = rangName(S.rang);
    META.bestKapitel[n.id]=b;
  }
  kopfzeile();
  if(n.typ==='szene') zeigeSzene(n);
  else if(n.typ==='kampf') starteKampf(n);
  else if(n.typ==='befoerderung') zeigeBefoerderung(n);
  else if(n.typ==='elite') zeigeElite(n);
  else if(n.typ==='winter') zeigeWinter(n);
  else if(n.typ==='ende') zeigeKapitelende();
}
function weiter(){ NODE++; naechster(); }

/* ── Szene ── */
function zeigeSzene(n){
  const opt = n.optionen.map((o,i)=>{
    const gesperrt = o.probe && wert(o.probe.wert)<5;
    return `<button class="ord ${o.risk?'risk':''}" onclick="waehleOption(${i})" ${gesperrt?'disabled':''}>
      ${esc(o.label)}<span class="cost">${esc(o.kosten||o.hint||'')}${o.probe?' · '+NAMEN[o.probe.wert]+' '+wert(o.probe.wert)+' gegen '+o.probe.schw:''}</span></button>`;
  }).join('');
  app.innerHTML = `<div class="stage">
    <div><div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb"><div class="prose">${n.text.map(t=>`<p>${t}</p>`).join('')}</div></div></div>
      <div class="orders"><div class="ch"><span>Was tust du?</span></div><div class="ordbody">${opt}</div></div>
    </div>${seitenleiste()}</div>`;
  window.AKT = n;
}
function waehleOption(i){
  const n = window.AKT, o = n.optionen[i];
  let erg, klasse='', probeText='';
  if(o.probe){
    const p = probe(o.probe.wert, o.probe.schw);
    erg = p.erfolg ? o.erfolg : (o.misserfolg||o.erfolg);
    klasse = p.erfolg ? 'gut' : 'schlecht';
    probeText = `<div class="probe">${NAMEN[o.probe.wert].toUpperCase()} ${p.wertRoh} gegen ${o.probe.schw} → Zielwert ${p.ziel} · gewürfelt ${p.wurf} · ${p.erfolg?'GELUNGEN':'MISSLUNGEN'}</div>`;
  } else { erg = o.erfolg; klasse='gut'; }
  anwenden(erg);
  verschleiss(0.35);
  S.log.push(n.id+': '+o.label);
  app.innerHTML = `<div class="stage">
    <div><div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb"><div class="prose"><p class="said">${esc(o.label)}</p></div>
        <div class="ergebnis ${klasse}">${erg.text}${probeText}</div>
        ${wirkungen(erg)}</div></div>
      <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="weiter()">Weiter</button></div></div>
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
  return t.length ? `<div class="probe" style="margin-top:12px">${t.join(' · ')}</div>` : '';
}
