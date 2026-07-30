'use strict';
/* Oberfläche: Titel, Kaufladen, Charaktererschaffung, Ablaufsteuerung, Szenen. */

/* ══════════════════ DARSTELLUNG ══════════════════ */

const app = document.getElementById('app');
const kopf = document.getElementById('kopfrechts');
const fuss = document.getElementById('fusszeile');
const untertitel = document.getElementById('untertitel');

/* Auch `"` und `'` — sonst bricht ein Name mit Anführungszeichen im Namensfeld
   (`value="…"`) aus dem Attribut aus, und „Jean \"le Brave\" Duval" wird beim
   Neuzeichnen still abgeschnitten. Das ist die einzige Stelle im Spiel, an der
   Spielertext in einem Attribut landet; die Funktion muss trotzdem vollständig
   sein, weil überall angenommen wird, dass sie es ist. */
/* ── Kopf eines Vordrucks ──
   Republik bis 1804, Kaiserreich danach. Der Kopf steht auf jedem Papier, das
   die Armee ausstellt — und er wechselt mit dem Kapitel, ohne dass ein Wort
   dazu nötig wäre. */
function kaiserreich(){
  const n = LAUF ? KAPITEL[Math.min(LAUF.node, KAPITEL.length-1)] : null;
  const jahr = n && n.datum ? parseInt((n.datum.match(/1[78]\d\d/)||[0])[0],10) : 1796;
  return jahr >= 1804;
}
function vordruck(n){
  return `<div class="vordruck">
    <div class="rf">${kaiserreich() ? 'Empire Français' : 'République Française'}</div>
    <div class="einheit">32.&thinsp;Demi-brigade de bataille</div>
    <div class="wann">${esc((n && n.datum) || '')}</div>
  </div>`;
}

/* Kokarde (Republik) und Adler (Kaiserreich) als reines SVG — 1796 gab es
   keine Adler, die Halbbrigaden trugen Fahnen. */
function emblem(){
  if(kaiserreich()) return `<svg class="emblem" viewBox="0 0 26 26" role="img" aria-label="Adler">
    <path d="M13 4 L16 8 L22 9 L18 12 L20 19 L13 15 L6 19 L8 12 L4 9 L10 8 Z" fill="#d0a75e" opacity=".85"/>
    <rect x="12" y="14" width="2" height="8" fill="#d0a75e" opacity=".6"/></svg>`;
  return `<svg class="emblem" viewBox="0 0 26 26" role="img" aria-label="Kokarde">
    <circle cx="13" cy="13" r="10.5" fill="#c2483a"/>
    <circle cx="13" cy="13" r="7" fill="#e8e0cd"/>
    <circle cx="13" cy="13" r="3.4" fill="#3d5a80"/></svg>`;
}

/* Welche Kapitel gebaut sind — **aus den Daten, nicht aus einem festen Satz.**

   Diese Zeile stand zweimal wörtlich im Code („Prototyp · Italien 1796/97 ·
   Ägypten 1798/99") und wurde beim Bau von Kapitel 3 nicht mitgezogen: Die
   Startseite bewarb monatelang zwei Kapitel, während drei geladen wurden. Das
   ist genau die Sorte Fehler, die niemand im Test findet, weil kein Test einen
   Werbetext prüft — deshalb steht die Zahl jetzt nirgends mehr geschrieben.

   `kurz` liefert die Fassung für den Untertitel unter dem Haupttitel. */
function gebauteKapitel(kurz){
  const g = KAMPAGNEN.filter(k=>k.gebaut);
  if(!g.length) return 'Prototyp';
  if(kurz){
    if(g.length === 1) return `Erstes Kapitel · ${g[0].name} ${g[0].jahre}`;
    /* Die Jahre der Kampagnen stehen verkürzt da („1796–97"). Für die Spanne
       über alle Kapitel wird das Endjahr wieder ausgeschrieben — „1796–04"
       liest sich wie ein Zahlendreher. */
    const von = g[0].jahre.split('–')[0];
    const letzte = g[g.length-1].jahre.split('–');
    const bis = letzte.pop();
    /* Das Jahrhundert kommt vom **Anfangsjahr des letzten Kapitels**, nicht vom
       des ersten: Garnison ist „1801–04", also 1804. Mit dem Jahrhundert von
       1796 wäre daraus 1704 geworden. */
    const bisVoll = bis.length === 2 ? letzte[0].slice(0,2) + bis : bis;
    return `${g.length} Kapitel · ${von}–${bisVoll}`;
  }
  return 'Prototyp · ' + g.map(k=>`${k.name} ${k.jahre}`).join(' · ');
}

function esc(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;')
  .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
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
  /* Die Fußzeile nannte „Prototyp · zwei Feldzüge · Ränge 1–3" — fest in
     index.html, und damit derselbe Fehler wie im Titelkopf. Auch sie kommt
     jetzt aus den Daten. */
  const fussStand = document.getElementById('fussstand');
  if(fussStand) fussStand.textContent = `${gebauteKapitel(true)} · Ränge 1–${RANG[RANG.length-1].n}`;
  if(!S){ kopf.innerHTML = `VETERANENPUNKTE ${META.vp} · LÄUFE ${META.laeufe|0}`;
    untertitel.textContent = gebauteKapitel(true); return; }
  /* Links vom Namen steht, was ein Mann besitzt: sein Geld und seine Orden.
     Beides stand bisher nur unten in der Seitenleiste, wo man es beim Spielen
     nicht sieht — und seit es einen Marketender und eine Ordenspension gibt,
     ist Geld eine Zahl, auf die man schaut. */
  const orden = (S.orden||[]).map(id=>{
    const o = ordenVon(id);
    return o ? `<span class="kopforden" title="${esc(o.name)}">${ordensbild(id)}</span>` : '';
  }).join('');
  kopf.innerHTML = `<span class="kopfzeile">
    ${orden ? `<span class="kopfgruppe">${orden}</span>` : ''}
    <span class="kopfgeld">${francs(S.geld)} F</span>
    <span class="kopftrenner"></span>
    ${emblem()}<span>${esc(S.name.toUpperCase())} · ${rangName(S.rang).toUpperCase()} · RUF ${S.ruf}</span>
    <span class="kopftrenner"></span>
    <button class="zurueck" onclick="zumTitel()" title="Zur Übersicht — der Feldzug bleibt gesichert">Übersicht</button></span>`;
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
   Wunden ihn drücken — sonst wüsste niemand, warum die Obergrenze wandert.
   Rechnet über `lebenMax()` mit einem wundenlosen Mann, statt die Formel ein
   drittes Mal zu schreiben. */
function lebenGrund(){ return lebenMax({attr:S.attr, wunden:[]}); }

/* Die Kette über dir. Vier Namen statt einer Zahl — und der Rang davor ändert
   sich mit, wenn die Person selbst aufsteigt. Gefallene bleiben stehen, damit
   man sieht, wer einmal für einen gesprochen hätte. */
/* ── Wen du überhaupt kennst ──
   **`ab:` wurde bis zum 30.07.2026 nirgends gelesen**, obwohl es an
   Grandmaison stand: Ein frischer Fusilier las „Chef de bataillon Grandmaison
   0" in seiner Seitenleiste — und damit war die Pointe der ganzen Kette
   verschenkt. Grandmaison soll ab Rang 9 **wieder auftauchen**, zwölf
   Spieljahre nach dem Sumpf von Arcole, und wer damals bestanden hat, findet
   ihn bei Gunst +2 vor. Etwas, das die ganze Zeit dastand, kann nicht
   wiederkommen.

   Gezeigt wird deshalb nur, wen der eigene Rang erreicht — die Kette wächst
   von unten mit. Wer einmal drin steht, bleibt drin: `hoechsterRang` merkt
   sich das, sonst verschwände ein Fürsprecher bei einer Degradierung, und
   seine Gunst liefe unsichtbar weiter. */
function kenntPerson(l){
  if(!l.ab) return true;
  return Math.max(S.rang|0, S.hoechsterRang|0) >= l.ab;
}
function ueberDir(){
  if(!S.leute) return '';
  const zeile = l => {
    if(!kenntPerson(l)) return '';
    const p = S.leute[l.id]; if(!p) return '';
    const g = p.gunst, farbe = g<0 ? 'warn' : (g>=3 ? 'ok' : '');
    return `<div class="kv"><span class="hilfe" data-hilfe="${String(l.was).replace(/"/g,'&quot;')}">${
      p.lebt ? esc(personName(l.id)) : '<s>'+esc(personName(l.id))+'</s>'}</span>
      <b class="${farbe}">${p.lebt ? (g>0?'+':'')+g : '†'}</b></div>`;
  };
  return `<p class="mini">Über dir</p>${LEUTE.map(zeile).join('')}${unterDir()}${verzeichnis()}`;
}

/* ── Unter dir ──
   **Vier Personen mit je zwei Zahlen sind acht Zahlen — und das ist die
   Grenze dessen, was man im Blick behält, ohne eine Tabelle zu führen.**
   Deshalb Können und Treue als Zahl, nicht als Umschreibung, und daneben ein
   halber Satz über das letzte Ereignis: Die Zahl sagt *wie viel*, der Satz
   sagt *woran es liegt*.

   Der Mitgezogene steht zuerst und trägt ein Zeichen — er ist der einzige,
   dessen Treue +5 erreichen kann, und der einzige, der beim Aufstieg
   mitwandert. */
/* ── Das Verzeichnis ──
   **Angezeigt wird die Sache und die Zahl der Mitwisser, nie ihre Namen.**
   Du weißt, was du getan hast und wie viele dabei waren. Nicht, wer davon
   redet. Das ist die bessere Aufteilung: **Menschen sind lesbar, Vergangenheit
   ist es nicht** — man kann einschätzen, wem man traut, und trotzdem nicht
   ausrechnen, was auf dem Spiel steht.

   Der Aktenvermerk steht daneben, weil er nicht verjährt und weil er ab Rang
   11 die Beförderung halbiert. */
function verzeichnis(){
  if(!S || S.rang < 9) return '';
  const h = (S.heimlich||[]);
  const v = (S.vermerke|0);
  if(!h.length && !v) return '';
  /* **Gezählt werden die Lebenden.** Ein Toter nimmt seinen Teil mit, und
     genau das soll man an der Zahl sehen — sonst stünde neben einer Sache,
     von der niemand mehr weiß, weiter eine Zwei. Wer nicht mehr unter einem
     steht, zählt dagegen mit: Er ist versetzt, nicht verschwunden. */
  const tot = S.unterTot || [];
  const lebend = x => (x.mitwisser||[]).filter(m => tot.indexOf(m) < 0).length;
  const zeile = x => `<div class="kv"><span class="hilfe" data-hilfe="${
      String('Schwere '+x.schwere+' von 4. Wer dabei war, steht im Verzeichnis — nicht hier.').replace(/"/g,'&quot;')}">${
      esc(x.text)}</span><b class="${x.schwere>=3?'warn':''}">${lebend(x)}</b></div>`;
  return `<p class="mini">Was jemand weiß <span class="fein">Mitwisser</span></p>${h.map(zeile).join('')}${
    v ? `<div class="kv"><span>Aktenvermerke</span><b class="warn">${v}</b></div>` : ''}`;
}

function unterDir(){
  unterstellteSetzen();                 // heilt einen von Hand gesetzten Rang
  const u = (S.unterstellte||[]);
  if(!u.length) return '';
  const zeile = x => `<div class="kv"><span class="hilfe" data-hilfe="${
      String(x.posten+' '+x.name+'. '+(x.zustand!=='dienstfähig'?x.zustand[0].toUpperCase()+x.zustand.slice(1)+'.':'Dienstfähig.')).replace(/"/g,'&quot;')}">${
      x.lebt ? (x.mit?'· ':'')+esc(x.name) : '<s>'+esc(x.name)+'</s>'}${
      x.lebt && x.zustand!=='dienstfähig' ? ' <span class="warn">!</span>' : ''}</span>
    <b>${x.lebt ? x.koennen + ' <span class="fein">/</span> ' + (x.treue>0?'+':'') + x.treue : '†'}</b></div>`;
  return `<p class="mini">Unter dir <span class="fein">Können / Treue</span></p>${u.map(zeile).join('')}`;
}

/* Eine Zeile der Seitenleiste — und **sie zeigt den Wert, mit dem geprüft
   wird**, nicht den rohen.

   Vorher standen dort die rohen Attribute, während jede Probe mit `wert()`
   rechnet: Wer eine schwere Wunde und zerrissene Schuhe hatte, las
   „Konstitution 70" und ging mit 52 in die Probe. Diese Lücke war der
   häufigste Grund, warum sich ein Fehlschlag wie Willkür anfühlte.

   Ist der Wert gerade gedrückt, steht der rohe klein daneben — dieselbe
   Schreibweise wie beim Leben („82 / 79 von 82") — und der Grund im
   Überfahrtext. */
function attrZeile(k, name, roh){
  const w = wert(k);
  if(w >= roh) return `<div class="kv"><span>${mitHilfe(k,name)}</span><b>${roh}</b></div>`;
  const grund = abzugGrund(k).join(' · ');
  return `<div class="kv"><span>${mitHilfe(k,name)}</span>
    <b class="warn" title="${esc(grund)}">${w} <i class="fein">von ${roh}</i></b></div>`;
}

function seitenleiste(){
  const geladen = K ? (K.geladen?'geladen':'ungeladen') : '—';
  // Krankheiten werden ausgewiesen: Sie zehren an jeder Station weiter, Wunden nicht.
  const w = S.wunden.length
    ? S.wunden.map(x=>esc(x.name) + (x.zehrt?' <i class="zehrt">zehrt</i>':'')).join(', ')
    : 'keine';
  const zust = k => { const a=S.ausr[k]; const c = a.zustand<20?'warn':(a.zustand<40?'':'ok');
    return `<div class="kv"><span>${esc(a.name)}</span><b class="${a.zustand<20?'warn':''}">${a.zustand}</b></div>`; };
  return `<aside class="card">
    <div class="ch"><span>${K?'Dein Zustand':'Livret militaire'}</span><span>32.&thinsp;DB</span></div>
    <div class="cb">
      <p class="who">${esc(S.name)}</p>
      <div class="rangzeile">${rangabzeichen(S)}
        <p class="whorank">${rangName(S.rang)} · 32. Halbbrigade</p></div>
      <div class="stat"><div class="statlab"><span>Leben</span><span class="${angeschlagen()?'warn':''}">${S.leben} / ${lebenMax()}${lebenMax()<lebenGrund()?` <i class="fein">von ${lebenGrund()}</i>`:''}</span></div>
        ${balken(angeschlagen()?'b-red':'b-green',S.leben,lebenMax())}
        ${angeschlagen()?`<p class="warnung">Du hast zu viel Blut verloren.${S.leben<=lebenMax()*0.15?' Der nächste Treffer wird der letzte sein.':' Noch ein oder zwei Treffer, und es ist vorbei.'}</p>`:''}
        <div class="kv wunden"><span>Wunden</span><b class="${S.wunden.length?'warn':''}">${w}</b></div></div>
      ${/* ══════════════════ DER DRITTE SICHTBARE BRUCH ══════════════════

           **Ab Rang 10 verschwindet die Atemleiste. Ersatzlos, ohne Kommentar.**

           Zehn Ränge lang war sie die Zahl, auf die man am häufigsten geschaut
           hat: Sie hat entschieden, ob man knien musste, ob man vorgehen
           konnte, ob man einen Lagerabend verschläft. Jetzt ist sie weg, und
           es steht nirgends, dass sie weg ist.

           **Der Spieler merkt in derselben Sekunde, dass sein Körper aufgehört
           hat, das Thema zu sein** — und das ist der stärkste der vier Brüche,
           weil er fast nichts kostet zu bauen. Ein Hinweis („Ab jetzt zählt
           dein Atem nicht mehr") würde ihn vollständig zerstören: Man soll es
           bemerken, nicht gesagt bekommen.

           Der Wert läuft im Hintergrund weiter — `atemKlemmen()` und die
           Erholung fassen ihn wie bisher an. Er tut nur nichts mehr, weil ein
           Chef de bataillon nicht selbst lädt und nicht selbst rennt. */''}
      ${S.rang<10?`<div class="stat"><div class="statlab"><span>Atem</span><span class="${ausserAtem()?'warn':''}">${S.atem}</span></div>
        ${balken(ausserAtem()?'b-red':'b-steel',S.atem,100)}
        ${ausserAtem()?`<p class="warnung">Du bist außer Atem.${S.atem<30?' Unter 30 wird jede Runde im Gefecht gefährlicher — du triffst schlechter und sie treffen dich leichter.':' Unter 30 wird es im Gefecht gefährlich.'}</p>`:''}</div>`:''}
      <div class="stat"><div class="statlab"><span>Belastung</span><span>${S.belastung}</span></div>${balken('b-red',S.belastung,100)}</div>
      <div class="stat"><div class="statlab"><span>Ruf</span><span>${S.ruf}</span></div>${balken('b-brass',S.ruf,100)}</div>
      <div class="stat"><div class="statlab"><span>Kameradschaft</span><span>${S.kameradschaft}</span></div>${balken('b-green',S.kameradschaft,100)}</div>
      ${/* Der Adler steht in der Seitenleiste, sobald es einen gibt — als Wort,
           nicht als Balken. Ein Gegenstand hat keinen Prozentsatz; er ist da,
           er ist vorn, oder er ist weg, und das Letzte kostet den Rang. */''}
      ${/* Das Patent steht in der Seitenleiste, solange es etwas erklärt: dass
           dieser Mann von oben angefangen hat und dass Martel ihn nicht kennt. */''}
      ${S.patent?`<div class="kv"><span>Patent</span><b>gekauft</b></div>`:''}
      ${S.adler?`<div class="kv"><span>Der Adler</span><b class="${S.adler==='verloren'?'warn':''}">${
        S.adler==='verloren'?'verloren':S.adler==='gerettet'?'gerettet':'getragen'}</b></div>`:''}
      ${(S.rang>=13&&S.dotation)?`<div class="kv"><span>Dotation</span><b>${S.dotation} F je Station</b></div>`:''}
      ${/* ── Die Ausbildung, endlich sichtbar ──
           **`sektionGuete` hatte kein einziges Vorkommen in `oberflaeche.js`.**
           Vier Lagerhandlungen speisten sie, sie entschied über Haltung,
           Verluste und den Startbestand — und der Spieler sah nie eine Zahl.
           Ein Wert mit vier Zuflüssen und keiner Anzeige ist ein
           Konstruktionsfehler, kein Detail.

           Sie steht ab Rang 2 da, weil die Sektion dort anfängt zu zählen,
           und sie darf negativ sein: Der gekaufte Leutnant startet bei −25,
           und **genau das soll er sehen.** */''}
      ${S.rang>=2?`<div class="kv"><span>${mitHilfe('sektionGuete','Ausbildung der Einheit')}</span><b class="${
        (S.sektionGuete||0)<0?'warn':((S.sektionGuete||0)>=30?'ok':'')}">${
        (S.sektionGuete||0)>0?'+':''}${S.sektionGuete||0}</b></div>`:''}
      ${S.rang>=9?`<div class="stat"><div class="statlab"><span>Einheitszustand</span><span class="${(S.einheit==null?70:S.einheit)<40?'warn':''}">${Math.round(S.einheit==null?70:S.einheit)}</span></div>${balken((S.einheit==null?70:S.einheit)<40?'b-red':'b-steel',(S.einheit==null?70:S.einheit),100)}
        ${(S.einheit!=null&&S.einheit<40)?`<p class="warnung">Deine Kompanie hat nichts an den Füßen.${S.einheit<20?' Jeder Marsch kostet Männer, die niemand beschossen hat.':' Der Feldscher meldet mehr Kranke, als er sollte.'}</p>`:''}</div>`:''}
      ${K?`<div class="rule"></div>${S.rang>=7?'':`<div class="kv"><span>Muskete</span><b>${geladen}</b></div>`}
           <div class="kv"><span>Deckung</span><b>${K.deckung?'ja':'nein'}</b></div>`:''}
      <div class="rule"></div>
      <p class="mini">Attribute</p>
      ${ATTRIBUTE.map(([k,n])=>attrZeile(k,n,S.attr[k])).join('')}
      <div class="rule"></div>
      <p class="mini">Fertigkeiten</p>
      ${FERTIGKEITEN.filter(([k])=>S.fert[k]>10).map(([k])=>attrZeile(k,wertName(k),S.fert[k])).join('') || '<div class="kv"><span>alle bei 10</span><b>—</b></div>'}
      <div class="rule"></div>
      <p class="mini">Ausrüstung · Zustand</p>
      ${Object.keys(S.ausr).filter(k=>S.ausr[k].verschleiss>0).map(zust).join('')}
      <div class="rule"></div>
      <div class="kv"><span>Geld</span><b>${francs(S.geld)} F</b></div>
      ${(S.soldOffen||0) >= 0.5 ? `<div class="kv"><span>Sold ausstehend</span><b class="fein">${francs(S.soldOffen, true)} F</b></div>` : ''}
      <div class="kv"><span>Im Tagesbefehl</span><b>${S.nennungen}×</b></div>
      ${S.bulletins?`<div class="kv"><span>${kaiserreich()?'Im Bulletin':'Dem Oberbefehl gemeldet'}</span><b>${S.bulletins}×</b></div>`:''}
      ${S.belobigungen?`<div class="kv"><span>Vor der Front gelobt</span><b>${S.belobigungen}×</b></div>`:''}
      ${(S.orden||[]).map(id=>{ const o=ordenVon(id); return o?`<div class="kv"><span>${esc(o.name)}</span><b>${ordensbild(id)}</b></div>`:''; }).join('')}
      ${ueberDir()}
    </div>
  </aside>`;
}

/* ── Titelbildschirm ── */
/* Der Weg zurück zur Übersicht — Chronik, Verlauf, Spielstand.

   **Er ist gefahrlos, und das ist der Grund, warum es ihn geben darf.** Der
   Feldzug wird bei jedem Schritt gesichert (siehe „Spielstand" in CLAUDE.md);
   wer die Übersicht aufruft, findet dort „Feldzug fortsetzen" und kommt genau
   dorthin zurück, wo er war. Ein Rücksetzpunkt entsteht dadurch nicht — der
   Spielstand zeigt immer auf *jetzt*, nie weiter zurück.

   Deshalb wird auch nicht nachgefragt: Es gibt nichts zu verlieren. */
function zumTitel(){
  if(LAUF) laufSichern();
  zeigeTitel();
}

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
  <div class="card"><div class="ch"><span>${emblem()} Der Marschallstab</span><span>${gebauteKapitel()}</span></div>
   <div class="cb">
    <div class="zit">Du beginnst 1796 als Rekrut mit einer Muskete, die dir nicht gehört.<br>
    Wenn du dieses Kapitel überlebst, bist du vielleicht Caporal.<br>
    Wahrscheinlicher liegst du im April in einem Graben bei Montenotte.</div>
    ${CHRONIK_GESPERRT ? `<div class="ergebnis schlecht" style="margin-bottom:14px">
      <b>Deine Chronik ist nicht lesbar.</b> Es lag ein Spielstand vor, aber er ist beschädigt oder
      stammt aus einer neueren Fassung des Spiels. Solange das so ist, wird <b>nichts überschrieben</b> —
      deine Veteranenpunkte sind noch da, dieses Spiel sieht sie nur nicht.
      <p style="margin:10px 0 0">Lade die Datei über „Spielstand laden", oder verwirf die alte Chronik und fang bei null an.</p>
      <p style="margin:10px 0 0"><button class="plain" onclick="if(confirm('Die alte Chronik wird überschrieben. Sicher?')){chronikFreigeben();zeigeTitel();}">Alte Chronik verwerfen</button></p>
    </div>` : ''}
    ${offen ? `<div class="wirkung" style="margin-bottom:14px"><span>Unterbrochener Feldzug</span>
      ${esc(offen.mann.name)} · ${esc(rangNameVon(offen.mann))} · ${esc((KAPITEL[Math.min(offen.node,KAPITEL.length-1)].datum||'').split(' · ')[0])}</div>` : ''}
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px">
      ${offen ? '<button class="plain" onclick="fortsetzen()">Feldzug fortsetzen</button>' : ''}
      <button class="plain" onclick="zeigeErschaffung(true)">Neuen Mann aufstellen</button>
      <button class="plain" onclick="speichern()">Spielstand sichern</button>
      <a class="plain" href="wiki.html" target="_blank" rel="noopener"
         style="text-decoration:none;display:inline-block">Handbuch</a>
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
    app.innerHTML = `<div class="card papier"><div class="ch"><span>${esc(c.name)}</span><span>${esc(c.ende)}</span></div>
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
      <div class="card papier"><div class="ch"><span>${esc(c.name)}</span><span>${esc(c.ort||'')}</span></div>
        <div class="cb">
          <div class="rangzeile">${rangabzeichen({rang:c.rangN||1, zweig:c.zweig})}
            <p class="whorank">${esc(c.rang)} · ${esc(c.herkunft||'')} · 32. Halbbrigade</p></div>
          <div class="note ${c.gefallen?'red':'green'}">${c.gefallen
            ? esc(c.ende)+'. Von den Stationen dieses Feldzugs hat er '+c.stationen+' erreicht.'
            : esc(c.ende)+'. Er hat den Feldzug überstanden — '+c.stationen+' Stationen.'}</div>
          <div class="lage"><div class="lagekopf">Was er unterwegs entschieden hat</div>${taten}</div>
        </div></div>
      <div class="card papier"><div class="ch"><span>Wertung</span><span>${c.punkte} Veteranenpunkte</span></div>
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
      ${zeile('Ruf', c.ruf)}${zeile('Kameradschaft', c.kameradschaft)}
      ${c.leute ? '<div class="rule"></div><p class="mini">Über ihm</p>' + c.leute.map(l=>
        zeile(l.lebt?esc(l.name):'<s>'+esc(l.name)+'</s>', l.lebt?((l.gunst>0?'+':'')+l.gunst):'†')).join('') : ''}
      ${c.lebenMax ? zeile('Leben', c.leben+' / '+c.lebenMax) : ''}
      ${zeile('Belastung', c.belastung)}${zeile('Atem', c.atem)}${zeile('Geld', c.geld+' F')}
      ${zeile('Im Tagesbefehl', c.nennungen+'×')}
      ${(c.orden||[]).length ? zeile('Ausgezeichnet', (c.orden||[]).map(id=>(ordenVon(id)||{}).name).filter(Boolean).join(', ')) : ''}
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
    ? Math.max(0, Math.min(100, (ERSCH?ERSCH.attr[k]:SOCKEL) + (h.attr[k]||0)))
    : Math.max(0, Math.min(100, FERT_SOCKEL + (h.fert[k]||0)));
}
/* ── Die Obergrenze ist 100, für alles ──
   **Bis zum 30.07.2026 lag sie bei 70 für Attribute und 60 für Fertigkeiten.**
   Das war richtig, solange ein Spitzenlauf 160 Punkte brachte: Man konnte sich
   ohnehin nur eine Spitze leisten, und der Deckel verhinderte, dass sie absurd
   wird. Mit der neuen Ökonomie ist das Ziel ein anderes — **ein perfekter Lauf
   bis Waterloo soll reichen, um alles auf 70+ zu heben** —, und ein Deckel bei
   60 machte das per Regel unerreichbar.

   **Die Bremse ist jetzt allein der Preis.** Der Weg von 90 auf 100 kostet
   600 VP, also mehr als drei Werte von 20 auf 70 zusammen. Wer eine Hundert
   will, bezahlt sie mit der Breite. */
function punktGrenze(k){ return 100; }
function punktKosten(k){ const b = istWert(k); return kostenVon(b, b + (PUNKTE[k]||0)); }
function gesamtKosten(){
  return AUSWAHL.reduce((s,id)=>{
           const p = LADEN.find(x=>x.id===id) || patentVon(id);
           return s + (p ? p.vp : 0);
         },0)
       + Object.keys(PUNKTE).reduce((s,k)=>s+punktKosten(k),0);
}

/* ══════════════════ DIE FEUILLE D'ENRÔLEMENT ══════════════════

   **Ein Bogen statt zwei Bildschirme** (Entwurfspaket `12a`). Bis zum
   30.07.2026 waren Aushebung und Veteranenpunkte zwei Ansichten mit einem
   Knopf dazwischen — und der zweite Schritt ist genau der, in dem man die
   Werte des ersten *bewertet*. Man braucht sie nebeneinander.

   Links das Formular, rechts eine mitrechnende Spalte *So rückt er ein*,
   unten der Vorrat. Es ist dasselbe Blatt, das der Werber ausfüllt, und der
   Spieler schreibt in die eine Spalte, die ihm gehört.

   **Drei Dinge tragen die Gestaltung, und alle drei folgen aus dem Inhalt:**

   1. **Der Befund ist ein Befund, kein Formular.** Name, Balken, Rechnung —
      kein −/+, keine Punktanzeige, kein „übrig". Der einzige Knopf heißt
      *Einen anderen Mann*. Wo die Herkunft nichts beiträgt, steht der Wert
      **einmal** und nicht als `30 = 30`.
   2. **Der Vorrat ist der einzige Ort, an dem gewählt wird — also der
      einzige, der laut sein darf.** Eigener Kasten, Bronzebalken, der Rest
      als große Mediävalzahl.
   3. **An jeder Kaufzeile steht der Preis des nächsten Fünfers**, nicht nur
      das bereits Ausgegebene. Bei einer exponentiellen Kurve ist das die
      Zahl, nach der man entscheidet. */

/* Eine Zeile des Werberbefunds: Wurf, Herkunftszuschlag, Ergebnis. Wo die
   Herkunft nichts beiträgt, steht nur eine Zahl — `30 = 30` ist keine
   Rechnung, sondern Rauschen. */
function befundZeile(k, n){
  const h = HERKUENFTE.find(x=>x.id===(ERSCH&&ERSCH.herkunft)) || {attr:{}};
  const roh = ERSCH.attr[k], bonus = h.attr[k]||0, ist = istWert(k);
  const rechnung = bonus
    ? `${roh}<i class="bo">${bonus>0?' +':' −'}${Math.abs(bonus)}</i><i class="gl"> = </i><b>${ist}</b>`
    : `<b>${ist}</b>`;
  return `<div class="befund" id="bf_${k}">
    <span class="bfname">${mitHilfe(k,n)}${k==='bildung'?'<i class="fest">fest</i>':''}</span>
    <span class="bfbalken"><i id="bb_${k}" style="width:${Math.max(0,Math.min(100,ist))}%"></i></span>
    <span class="bfwert" id="bw_${k}">${rechnung}</span>
  </div>`;
}

/* Eine Kaufzeile des Vorrats. Gekauft: `ist → neu` und die Summe. Nicht
   gekauft: der Istwert und **was der nächste Fünfer kostet**. */
function punktZeile(k,n){
  const p = PUNKTE[k]||0, ist = istWert(k);
  return `<div class="punktzeile ${p?'gewaehlt':''}" id="pz_${k}">
    <span>${mitHilfe(k,n)}</span>
    <span class="punktwert" id="pw_${k}">${ist}${p?` <i>→</i> <b>${ist+p}</b>`:''}</span>
    <span class="punktvp ${p?'':'aus'}" id="pv_${k}">${p?punktKosten(k)+' VP':naechsterFuenfer(k)}</span>
    <span><button class="pmbtn" onclick="stellePunkt('${k}',-PUNKT_SCHRITT)" id="pm_${k}">−</button>
    <button class="pmbtn" onclick="stellePunkt('${k}',PUNKT_SCHRITT)" id="pa_${k}">+</button></span>
  </div>`;
}
/* Was der nächste Schritt kostet — die Zahl, nach der man bei einer
   exponentiellen Kurve entscheidet. Am Deckel steht kein Preis, sondern die
   Decke. */
function naechsterFuenfer(k){
  const ist = istWert(k) + (PUNKTE[k]||0);
  if(ist + PUNKT_SCHRITT > punktGrenze(k)) return '<i class="voll">am Deckel</i>';
  return `<i class="naechst">+${PUNKT_SCHRITT} für ${kostenVon(ist, ist+PUNKT_SCHRITT)}</i>`;
}

/* ══════════════════ DIE PATENTKARTE ══════════════════

   **Sie erscheint erst, wenn eines der beiden Patente freigeschaltet ist** —
   und für die meisten Spieler heißt das: gar nicht, jedenfalls nicht in den
   ersten Läufen. Das ist Absicht. Ein Kaufladen, der einem beim ersten Mann
   anbietet, Offizier zu werden, macht aus dem verdienten Aufstieg eine
   Kaufentscheidung, und genau das darf er nicht.

   **Höchstens eins.** Zwei Patente nebeneinander ergeben keinen Sinn, und die
   Grenze ist billiger als jede Erklärung. */
function patentKarte(){
  const offen = PATENTE.filter(patentFrei);
  if(!offen.length) return '';
  const zeilen = offen.map(p=>`<button class="kaufzeile" id="kz_${p.id}" onclick="waehle('${p.id}')">
    <span><b class="kl">${p.label}</b><span class="kb">${p.beschr}</span>
      <span class="kabzug">Wertung −${p.abzug} · keine Fürsprecher · Gefahr +2</span></span>
    <span class="kvp">${p.vp}</span><span class="kwahl" id="kb_${p.id}">wählen</span></button>`).join('');
  return `<div class="patentkasten">
    <div class="patentkopf"><span>Offizierspatent</span><span>höchstens eines</span></div>
    <p>Ein Patent unterschreibt der Kaiser, und es kommt auf Papier. Wer eines hat, rückt 1796 als Offizier ein — mit allem, was das an Knöpfen gibt, und ohne alles, was ein Mann sich in zehn Jahren an Bekanntschaften erwirbt. <b>Martel, Collot, Berthaud und Vernet kennen dich nicht</b>, und die Abende am Feuer, an denen man sie kennenlernt, stehen einem Offizier nicht offen.</p>
    ${zeilen}</div>`;
}

/* Die rechte Spalte: was aus dem Blatt wird, wenn man jetzt einrückt. Sie
   rechnet bei jedem Klick mit — das ist der Grund, warum die beiden Schritte
   auf ein Blatt gehören. */
function einrueckSpalte(){
  const h = HERKUENFTE.find(x=>x.id===ERSCH.herkunft) || {attr:{},fert:{},name:''};
  const end = k => istWert(k) + (PUNKTE[k]||0);
  const kon = end('konstitution');
  const zeile = (n, v, hervor) => `<div class="ezeile${hervor?' hervor':''}"><span>${n}</span><b>${v}</b></div>`;
  const schwelle = (n, ja) => `<div class="ezeile ${ja?'ja':'nein'}"><span>${n}</span><b>${ja?'erreicht':'nicht erreicht'}</b></div>`;
  /* ── Ein Kauf ersetzt das Ausgabestück, statt danebenzustehen ──
     Sonst steht dasselbe Paar Schuhe zweimal auf dem Blatt. Die Leitern des
     Ladens heißen anders als die Plätze der Ausrüstung (`waffe` gegen
     `muskete`), also braucht es eine Zuordnung — und die steht hier und
     nicht in den Daten, weil sie nur diesen einen Bildschirm betrifft.

     ⚠ `AUSRUESTUNG_START` ist eine **Funktion**, kein Objekt. Die erste
     Fassung ging mit `Object.keys()` darüber und lieferte eine leere Liste —
     der Abschnitt „Ausgabe · Zustand" stand mit Überschrift und ohne Inhalt
     auf dem Blatt. */
  const PLATZ = {waffe:'muskete', schuhe:'schuhe', mantel:'mantel', seitenwaffe:'seitenwaffe'};
  const start = AUSRUESTUNG_START();
  const ersetzt = {};
  AUSWAHL.forEach(id=>{ const q = LADEN.find(x=>x.id===id);
    if(q && q.art==='ausr' && PLATZ[q.gruppe]) ersetzt[PLATZ[q.gruppe]] = q.label; });
  const ausrZeilen = Object.keys(start).map(k=>{
    const a = start[k], neu = ersetzt[k];
    return `<div class="ezeile${neu?' hervor':''}"><span>${esc(neu||a.name)}</span><b>${neu?'neu':a.zustand}</b></div>`;
  }).join('');
  const gekauft = AUSWAHL.map(id=>{
    const p = LADEN.find(x=>x.id===id) || patentVon(id);
    return p ? `<div class="ezeile"><span>${p.label}</span><b>${p.vp} VP</b></div>` : '';
  }).join('');
  return `<div class="einrueck">
    <div class="ekopf">So rückt er ein</div>
    <div class="ebody">
      <div class="ename" id="e_name">${esc(ERSCH.name||'')}</div>
      <div class="erang" id="e_rang">Fusilier · ${esc(h.name||'ohne Herkunft')}</div>
      <div class="eleben"><span>Leben</span><b id="e_leben">${40 + Math.round(kon*0.6)}</b></div>
      <p class="efein">40 plus drei Fünftel der Konstitution.<br>Der Atem steigt nie darüber.</p>
      <div class="eabschnitt">Attribute</div>
      ${ATTRIBUTE.map(([k,n])=>zeile(n, end(k), !!PUNKTE[k])).join('')}
      <div class="eabschnitt">Fertigkeiten</div>
      ${FERTIGKEITEN.map(([k,n])=>zeile(n, end(k), !!PUNKTE[k] || !!(h.fert&&h.fert[k]))).join('')}
      <div class="eabschnitt">Elitekompanie</div>
      ${schwelle('Grenadiere · Konstitution 55', kon>=55)}
      ${schwelle('Voltigeure · Geschick 55', end('geschick')>=55)}
      ${gekauft?`<div class="eabschnitt">Gekauft</div>${gekauft}`:''}
      <div class="eabschnitt">Ausgabe · Zustand</div>
      ${ausrZeilen}
    </div></div>
  <button class="plain haupt einruecken" id="startbtn" onclick="starte()">Einrücken</button>
  <p class="efein mitte">Ein Platz, kein zweiter — der alte Feldzug ist damit vorbei.</p>
  <div class="enebentasten">
    <button class="plain" onclick="zeigeTitel()">Zur Chronik</button>
    <button class="plain" onclick="window.open('wiki.html','_blank')">Handbuch</button>
  </div>`;
}

/* Der eine Bogen. `neu` würfelt einen frischen Mann aus; ohne das Flag wird
   nur neu gezeichnet (Herkunftswechsel, Rückkehr vom Titel). */
function zeigeErschaffung(neu){
  if(neu || !ERSCH){
    ERSCH = {name:'', herkunft:null, attr:{}};
    ATTRIBUTE.forEach(([k])=> ERSCH.attr[k]=sockelVon(k));
    wuerfeln(true);   // **Es steht nie ein unverteilter Mann da.** Man sieht sofort einen.
    AUSWAHL = []; PUNKTE = {};
  }
  if(!ERSCH.name) ERSCH.name = zufallsName();
  /* **Gesperrtes bekommt den Bedingungssatz statt der Wirkung.** Der Laden ist
     die Landkarte dessen, was noch kommt — wer nicht weiß, wofür er spielt,
     spielt auf nichts hin. */
  const kaufZeile = p=>{
    const frei = ladenFrei(p);
    return `<button class="kaufzeile${frei?'':' gesperrt'}" id="kz_${p.id}" onclick="waehle('${p.id}')"${frei?'':' disabled'}>
      <span><b class="kl">${p.label}</b><span class="kb">${frei ? p.beschr : ladenBedingung(p)}</span></span>
      <span class="kvp">${p.vp}</span><span class="kwahl" id="kb_${p.id}">${frei?'wählen':'gesperrt'}</span></button>`;
  };
  const leitern = LADEN_GRUPPEN.map(([g,titel,unter])=>{
    const teile = LADEN.filter(p=>p.gruppe===g);
    if(!teile.length) return '';
    return `<div class="vabschnitt">${titel} <i>${unter}</i></div>${teile.map(kaufZeile).join('')}`;
  }).join('');
  const einzeln = LADEN.filter(p=>p.art!=='zaeh' && !p.gruppe).map(kaufZeile).join('');
  const zaeh    = LADEN.filter(p=>p.art==='zaeh').map(kaufZeile).join('');

  app.innerHTML = `<div class="enrol"><div class="enrolinner">
    <div class="enrolkopf">
      <div class="rf">${kaiserreich() ? 'Empire Français' : 'République Française'}</div>
      <div class="enroltitel">Feuille d’enrôlement</div>
      <div class="enrolwo">32.&thinsp;Demi-brigade de bataille · Savona, 1. April 1796</div>
    </div>
    <div class="enrolgrid">
      <div>
        <div class="namezeile">
          <span class="nlabel">Name</span>
          <input type="text" id="namefeld" value="${esc(ERSCH.name)}"
                 oninput="ERSCH.name=this.value;aktualisiereBogen()">
          <button class="plain" onclick="wuerfeln()">Einen anderen Mann</button>
        </div>

        <div class="enrolabschnitt"><span>Befund des Werbers</span><i>ausgehoben · nicht verhandelbar</i></div>
        ${ATTRIBUTE.map(([k,n])=>befundZeile(k,n)).join('')}
        <p class="enrolsatz"><b>Du suchst dir nicht aus, wer du bist.</b> Der Werber schreibt auf, was er sieht. Wenn dir der Mann nicht passt, kannst du einen anderen nehmen — aber besser machen kannst du ihn nicht.</p>
        <p class="efein">Sockel ${SOCKEL} · ${POOL} Punkte in Schritten von ${ERSCH_SCHRITT} · höchstens ${MAXE} bei der Aushebung<br>
        Bildung steht fest auf ${BILDUNG_SOCKEL} — du kannst nicht lesen. Alle neun Fertigkeiten beginnen bei ${FERT_SOCKEL}.</p>

        <div class="enrolabschnitt"><span>Herkunft</span><i>je genau 50 Punkte · deine Wahl</i></div>
        <div class="herkwahl">${HERKUENFTE.map(h=>`<div class="herk${h.id===ERSCH.herkunft?' on':''}" id="h_${h.id}" onclick="waehleHerkunft('${h.id}')">
          <div class="hn">${h.name}</div><div class="hd">${h.text}</div></div>`).join('')}</div>

        <div class="vorratkasten">
          <div class="vorratbalken">
            <h3>Veteranenpunkte</h3>
            <span class="vorratrechts">
              <span class="vorratklein">Vorrat ${META.vp}<br>Ausgegeben <i id="vpaus">0</i></span>
              <span class="vorratstrich"></span>
              <span class="vorratzahl"><b id="vpanz">${META.vp}</b><span>übrig</span></span>
            </span>
          </div>
          <div class="vorratbody">
            <p>Der Vorrat ist die Punktzahl deines besten Laufs; er wird nicht verbraucht, sondern bei jedem Neustart neu verteilt. <b>Hier darfst du wählen</b> — und nur hier. Gerechnet wird vom jetzigen Wert, nicht vom Sockel: Wer als Wilderer mit Muskete 50 anfängt, zahlt für den nächsten Punkt mehr als einer, der bei 20 steht.
            ${META.vp===0?'<br><br><b>Beim ersten Mal hast du nichts.</b> Das gehört dazu — der erste Mann rückt ein, wie er ist.':''}</p>
            <div class="vabschnitt">Attribute ergänzen <i>Obergrenze ${punktGrenze('konstitution')}</i></div>
            ${ATTRIBUTE.map(([k,n])=>punktZeile(k,n)).join('')}
            <div class="vabschnitt">Fertigkeiten ergänzen <i>Obergrenze ${punktGrenze('muskete')}</i></div>
            ${FERTIGKEITEN.map(([k,n])=>punktZeile(k,n)).join('')}
            ${leitern}
            <div class="vabschnitt">Kleinkram und Papiere <i>stapelbar · das Billigste ist oft das Klügste</i></div>
            ${einzeln}
            <div class="vabschnitt">Was ein Mann behält <i>nicht Kraft, sondern Gewohnheit</i></div>
            <p class="efein">Was einer aus zwei Feldzügen mitbringt, ist selten Kraft. Es ist das Wissen, wie man nicht stirbt. <b>Nichts davon macht dich im Gefecht besser</b> — es hält dich nur zwischen den Gefechten aufrecht, und dort verliert man die meisten Männer.</p>
            ${zaeh}
            ${patentKarte()}
            <p class="efein">Der Weg von 90 auf 100 kostet 600 VP — mehr als drei Werte von 20 auf 70 zusammen.<br>Wer eine Hundert will, bezahlt sie mit der Breite.</p>
          </div>
        </div>
      </div>
      <div class="enrolrechts" id="enrolrechts">${einrueckSpalte()}</div>
    </div>
  </div></div>`;
  aktualisiereBogen();
}

/* Ein Aktualisierer für das ganze Blatt. Er ersetzt `aktualisiereErschaffung()`
   und `aktualisiereLaden()`: Auf einem Blatt gibt es nur einen Zustand, und
   zwei Funktionen, die dieselbe Ansicht pflegen, laufen früher oder später
   auseinander. */
function aktualisiereBogen(){
  const rest = META.vp - gesamtKosten();
  const anz = document.getElementById('vpanz');
  if(anz){ anz.textContent = rest; anz.className = rest ? '' : 'leer'; }
  const aus = document.getElementById('vpaus');
  if(aus) aus.textContent = gesamtKosten();
  /* Der Befund hängt an der Herkunft: Ein Wechsel ändert jede Zeile. */
  ATTRIBUTE.forEach(([k,n])=>{
    const z = document.getElementById('bf_'+k);
    if(z) z.outerHTML = befundZeile(k,n);
  });
  LADEN.concat(PATENTE.filter(patentFrei)).forEach(p=>{
    const b = document.getElementById('kb_'+p.id), z = document.getElementById('kz_'+p.id);
    if(!b || !z) return;
    /* Gesperrtes ist im Laden **sichtbar**, nicht versteckt: Er ist die
       einzige Stelle, an der man sieht, was das Spiel noch hat. */
    if(!patentVon(p.id) && (p.frei !== undefined || p.freiKapitel) && !ladenFrei(p)){
      b.textContent = 'gesperrt'; z.disabled = true; z.className = 'kaufzeile gesperrt'; return;
    }
    const drin = AUSWAHL.includes(p.id);
    /* **Was der Vorrat nicht deckt, wird gesperrt statt kommentiert.** */
    const zuTeuer = !drin && p.vp > rest;
    b.textContent = drin ? 'gewählt' : zuTeuer ? 'zu teuer' : 'wählen';
    z.disabled = zuTeuer;
    z.className = 'kaufzeile' + (drin?' gewaehlt':'') + (zuTeuer?' teuer':'');
  });
  ATTRIBUTE.concat(FERTIGKEITEN).forEach(([k])=>{
    const p = PUNKTE[k]||0, b = istWert(k);
    const pw = document.getElementById('pw_'+k), pv = document.getElementById('pv_'+k);
    if(!pw) return;
    pw.innerHTML = p ? `${b} <i>→</i> <b>${b+p}</b>` : String(b);
    pv.innerHTML = p ? punktKosten(k)+' VP' : naechsterFuenfer(k);
    pv.className = 'punktvp'+(p?'':' aus');
    document.getElementById('pz_'+k).className = 'punktzeile'+(p?' gewaehlt':'');
    document.getElementById('pm_'+k).disabled = !p;
    document.getElementById('pa_'+k).disabled =
      b+p+PUNKT_SCHRITT > punktGrenze(k) || kostenVon(b+p, b+p+PUNKT_SCHRITT) > rest;
  });
  const r = document.getElementById('enrolrechts');
  if(r) r.innerHTML = einrueckSpalte();
  const s = document.getElementById('startbtn');
  if(s) s.disabled = !(ERSCH.herkunft && (ERSCH.name||'').trim().length>0);
}
/* Die alten Namen bleiben als Weiterleitung stehen: `waehleHerkunft()`,
   `stellePunkt()` und `waehle()` rufen sie, und die Prüfstände tun es auch. */
function aktualisiereErschaffung(){ aktualisiereBogen(); }
function aktualisiereLaden(){ aktualisiereBogen(); }
/* `zeigeLaden()` gibt es nicht mehr als eigenen Bildschirm — der Aufruf
   landet auf demselben Bogen, damit ein alter Knopf nirgends ins Leere geht. */
function zeigeLaden(){ zeigeErschaffung(); }

function waehle(id){
  const p = LADEN.find(x=>x.id===id);
  if(p && !ladenFrei(p)) return;                 // gesperrt bleibt gesperrt
  const i = AUSWAHL.indexOf(id);
  if(i>=0) AUSWAHL.splice(i,1);
  else {
    // Höchstens ein Patent: das zweite ersetzt das erste, statt danebenzustehen.
    if(patentVon(id)) AUSWAHL = AUSWAHL.filter(x=>!patentVon(x));
    /* ── Je Leiter ein Kauf ──
       **Der teurere ersetzt den billigeren, statt danebenzustehen.** Zwei
       Musketen trägt niemand, und ein Laden, in dem man Stufe 2 und Stufe 4
       nebeneinander kauft, ist kein Laden, sondern eine Liste. Wer klickt,
       wählt damit die Stufe — er muss nichts abwählen. */
    if(p && p.gruppe) AUSWAHL = AUSWAHL.filter(x=>{
      const q = LADEN.find(y=>y.id===x); return !q || q.gruppe !== p.gruppe; });
    AUSWAHL.push(id); if(gesamtKosten() > META.vp) AUSWAHL.pop();
  }
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
/* ── Charaktererschaffung ──

   **Der Pool ist von 120 auf 60 gesenkt worden (28.07.2026), und das ist die
   größte Einzeländerung am Spielgefühl.** Vorher reichte er für zwei Attribute
   auf 70 *und* Reserve — ein Erstlauf-Mann war damit so gut ausgestattet wie
   ein Veteran, und die Veteranenpunkte waren Zierde: Der Testbot gewann alles,
   ohne je einen zu kaufen.

   Mit 60 Punkten reicht es für ein gutes Attribut und ein halbes. Die Schwelle
   55 der Elitekompanien wird zur Entscheidung statt zur Selbstverständlichkeit,
   und **der Rest des Weges führt über die Veteranenpunkte** — Lauf 2 spielt
   ungefähr auf dem alten Niveau, Lauf 3 und 4 darüber. Damit entsteht die
   Progression, die das Spiel bisher nur behauptet hat: Gegner, gegen die man am
   Anfang chancenlos ist, werden später schlagbar.

   **Der Sockel ist am 29.07.2026 von 20 auf 15 gefallen, und der Schritt von
   10 auf 5.** Beides gehört zusammen: Von 15 aus ist die 70 in Zehnerschritten
   nicht erreichbar (15+50 = 65, 15+60 = 75), also musste erst der Schritt
   feiner werden. Mit 5 geht 15 + 55 = 70 exakt auf, POOL 60 ist durch 5
   teilbar, und **beide Hälften der Erschaffung schreiten jetzt gleich** —
   `PUNKT_SCHRITT` für die Veteranenpunkte stand ohnehin schon auf 5.

   **Wozu der tiefere Sockel:** Ein Erstlauf-Mann soll früher sterben, damit
   der Veteran länger lebt. Die Wachstumsformel gibt bei niedrigen Werten am
   meisten (`1,7 × Intensität × (100 − Wert)/100`), also verlängert ein
   tieferer Sockel zugleich die Strecke, auf der ein Mann sich noch
   verbessern kann. Das ist die Gegenseite zur wachsenden Konstitution.

   **Der Sollwert dafür ist Italien** (Entscheidung des Entwicklers): Das
   Lehrstück darf töten, aber **nicht mehr als 20 % im Erstlauf**. Fällt
   „Italien überstanden" unter 80 %, ist der Sockel zu tief.

   Invariante 3 bleibt unberührt: Gekauft wird der Ausgangspunkt, nie der
   Aufstieg. */
const POOL = 60, SOCKEL = 15, MAXE = 70, ERSCH_SCHRITT = 5;
/* **Bildung ist die Ausnahme und bleibt bei 20.** Sie ist schon immer vom Pool
   ausgenommen, weil sie kein körperlicher Ausgangspunkt ist, sondern eine
   soziale Tatsache — man kann nicht lesen —, und sie hat einen eigenen Weg
   über die Regimentsschule. Sie mit abzusenken träfe die **Rangleiter**
   (Fourrier braucht 35, Rang 7 braucht 50) statt der Überlebensfähigkeit,
   und darum geht es beim Sockel nicht. */
const BILDUNG_SOCKEL = 20;
const sockelVon = k => k==='bildung' ? BILDUNG_SOCKEL : SOCKEL;
let ERSCH = null;
function zufallsName(){
  const v=['Étienne','Jean-Baptiste','Pierre','Antoine','Louis','Nicolas','Claude','Michel','François','Gilbert'];
  const n=['Duval','Rey','Vasseur','Marchand','Ferrand','Bonnet','Lemoine','Charpentier','Roussel','Barbier'];
  return v[Math.floor(Math.random()*v.length)]+' '+n[Math.floor(Math.random()*n.length)];
}
function verteilt(){ return ATTRIBUTE.reduce((s,[k])=>s+(ERSCH.attr[k]-sockelVon(k)),0); }
/* `stille` unterdrückt das Neuzeichnen — beim ersten Aufbau ist der Bildschirm
   noch gar nicht da, und `aktualisiereErschaffung()` liefe ins Leere. */
function wuerfeln(stille){
  ATTRIBUTE.forEach(([k])=> ERSCH.attr[k]=sockelVon(k));
  const frei = ATTRIBUTE.map(([k])=>k).filter(k=>k!=='bildung');
  let rest = POOL;
  const gew = frei.map(()=>Math.random()+0.35);
  while(rest>0){
    const i = gew.map((g,i)=>[g*Math.random(),i]).sort((a,b)=>b[0]-a[0])[0][1];
    const k = frei[i];
    if(ERSCH.attr[k]+ERSCH_SCHRITT<=MAXE){ ERSCH.attr[k]+=ERSCH_SCHRITT; rest-=ERSCH_SCHRITT; }
    else { gew[i]=0; if(gew.every(g=>g===0)) break; }
  }
  if(!stille) aktualisiereErschaffung();
}
function waehleHerkunft(id){
  ERSCH.herkunft=id;
  HERKUENFTE.forEach(h=> document.getElementById('h_'+h.id).className = 'herk'+(h.id===id?' on':''));
  aktualisiereErschaffung();
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

/* Ein Zwischenfall mit `kapitel:` erscheint nur dort. Bis Kapitel 3 gab es nur
   `'aegypten'`; jetzt auch `'garnison'` — im Frieden begegnet man anderen Dingen
   als auf einem Wüstenmarsch, und ein Verbandsplatz zwischen zwei Kasernentagen
   wäre falsch. */
const MARSCH_EREIGNISSE = [

  /* ══════════════════ AB RANG 8 · DU DARFST WIDERSPRECHEN ══════════════════

     **Rang 7 hat dir die Waffe genommen. Rang 8 nimmt dir die Anweisung.**
     Zum ersten Mal gibt es die Möglichkeit, einem Vorgesetzten ins Gesicht zu
     sagen, dass sein Befehl falsch ist. Sie kostet Fürsprache sofort und
     bringt Ruf, wenn man recht behält — **meistens behält man nicht recht**,
     und das ist der Preis, den ein eigener Kopf hat.

     Es steht bewusst als Zwischenfall und nicht als Szene in einem Kapitel:
     Widerspruch gehört keinem Feldzug, er gehört dem Rang. */
  /* ══════════════════ AB RANG 13 · DER KAISER STELLT DIR EINE FRAGE ══════════════════

     **Er ist kein Gönner, sondern jemand, der Fragen stellt, auf die es keine
     gute Antwort gibt.** Die Szenen dieses Rangs sind fast alle Gespräche, und
     in fast allen ist **Schweigen** eine der Optionen — manchmal die beste.

     Das ist keine Bequemlichkeit im Entwurf: Wer zehn Ränge lang Handgriffe,
     Befehle und Meldungen gedrückt hat, bekommt hier zum ersten Mal einen
     Knopf, auf dem steht, dass man nichts sagt. Es ist der einzige Ort im
     Spiel, an dem das eine Handlung ist. */
  {id:'kaiser', titel:'Er fragt dich etwas', wenn:()=>S.rang>=13,
   text:['Es ist nach elf, das Zelt ist zu warm, und auf dem Tisch liegen Karten von einem Land, in dem ihr seit fünf Wochen steht. Berthier ist gegangen. Zwei Ordonnanzoffiziere stehen am Eingang und sehen weg.',
         'Er sieht nicht auf, als er fragt, ob die Armee noch so ist wie 1805. Es ist keine rhetorische Frage; er wartet auf eine Antwort, und er wartet lange genug, dass es unangenehm wird.'],
   optionen:[
     {label:'Nein sagen', hint:'Kaltblütigkeit · und danach den Satz nicht abschwächen',
      probe:{wert:'kaltbluetigkeit', schw:55}, risk:true,
      erfolg:{text:'Du sagst nein und sagst auch, woran du es siehst: an den Schuhen, am Alter der Konskribierten, daran, dass in deiner Division vier Bataillone von Offizieren geführt werden, die 1805 noch nicht geboren waren — das letzte stimmt nicht ganz, und er weiß es, und er lässt es durchgehen. Er sagt eine Weile nichts. Dann sagt er, du sollst das aufschreiben.',
              ruf:8, gunst:1, gunstVon:'grandmaison'},
      misserfolg:{text:'Du sagst nein und hörst dich dabei selbst, und was du hörst, klingt wie ein Mann, der sich herausreden will. Er unterbricht dich nach dem dritten Satz, nicht unfreundlich, und redet über etwas anderes. Am nächsten Morgen kommt der Befehl über deinen Abschnitt, und darin steht nichts von dem, was du gesagt hast.',
              ruf:-3, belastung:8}},
     {label:'Ja sagen', hint:'Es ist, was er hören will, und es ist nicht wahr',
      erfolg:{text:'Du sagst ja. Er nickt und wendet sich der Karte zu, und danach geht es zwei Stunden lang um Straßen und Marschzeiten. Es ist ein leichter Abend. Sechs Wochen später steht deine Division an einer Stelle, an der eine Armee von 1805 gestanden hätte, und deine ist nicht die von 1805.',
              ruf:2, gunst:1, gunstVon:'grandmaison', belastung:6}},
     {label:'Nichts sagen', hint:'Schweigen ist hier eine Handlung',
      probe:{wert:'menschenkenntnis', schw:45},
      erfolg:{text:'Du sagst nichts. Es dauert lange genug, dass die beiden am Eingang sich ansehen. Dann sagt er, das sei auch eine Antwort, und geht zur Karte. Er nimmt zwei Regimenter aus deinem Abschnitt heraus und stellt sie nach hinten, ohne zu erklären, warum. Es ist genau das, was du gesagt hättest.',
              ruf:5, gunst:2, gunstVon:'grandmaison'},
      misserfolg:{text:'Du sagst nichts, und dein Schweigen kommt nicht als Antwort an, sondern als Zögern. Er wiederholt die Frage etwas langsamer, so wie man sie einem stellt, der sie nicht verstanden hat. Danach beantwortet er sie selbst.',
              ruf:-2, belastung:5}}
   ]},

  {id:'order', titel:'Die Order des Chef de bataillon', wenn:()=>S.rang>=8,
   text:['Der Befehl kommt um vier Uhr morgens auf einem halben Blatt: Dein Zug soll bei Tagesanbruch das Gehöft am Waldrand nehmen und halten.',
         'Du bist gestern Abend dort gewesen. Das Gehöft liegt in einer Senke, es hat drei Zugänge und keinen einzigen, den sechzig Mann decken können. Der Chef de bataillon war nicht dort. Auf seiner Karte ist es ein Punkt.'],
   optionen:[
     {label:'Ihm sagen, dass der Befehl falsch ist', hint:'Taktik · es kostet Fürsprache, ehe du den Satz zu Ende hast',
      probe:{wert:'taktik', schw:50}, risk:true,
      erfolg:{text:'Du sagst es kurz, im Stehen, ohne den Befehl anzufassen: Die Senke sei nicht zu halten, der Waldrand zweihundert Schritt weiter östlich sei es. Er sieht dich an, dann die Karte, dann wieder dich. Am Nachmittag steht dein Zug am Waldrand, und in der Senke steht niemand, und um vier Uhr geht durch die Senke ein ganzes Bataillon Jäger, das dort niemanden findet.',
              ruf:6, gunst:1, gunstVon:'vernet'},
      misserfolg:{text:'Du sagst es, und er hört es sich an. Dann sagt er, dass er den Abschnitt seit drei Wochen kennt und du seit gestern Abend, und dass er den Befehl nicht ändern wird. Du nimmst das Gehöft bei Tagesanbruch. Es ist zu halten. Es kostet neun Mann, und danach sagt niemand mehr etwas dazu — auch du nicht.',
              ruf:-2, gunst:-2, gunstVon:'vernet', belastung:8}},
     {label:'Den Befehl ausführen', hint:'Er ist der Chef de bataillon, und du bist es nicht',
      erfolg:{text:'Du führst den Zug bei Tagesanbruch in die Senke und verteilst ihn auf drei Zugänge, von denen keiner zu halten ist. Ihr haltet ihn trotzdem, bis um zehn Uhr Ablösung kommt. Der Chef de bataillon schreibt: „Auftrag erfüllt." Es stimmt.',
              gunst:1, gunstVon:'vernet', belastung:5, leben:-8}},
     {label:'Den Befehl ausführen und ihn im Rapport festhalten', hint:'Verwaltung · Papier vergisst nicht',
      probe:{wert:'verwaltung', schw:40},
      erfolg:{text:'Du führst den Befehl aus und schreibst am Abend zwei Sätze darüber, wie die Senke beschaffen ist, ohne ein Wort darüber, wessen Befehl es war. Drei Wochen später fragt ein Adjutant des Brigadestabs nach dem Gehöft, und man reicht ihm deinen Rapport.',
              ruf:3, belastung:4, leben:-6, fert:{verwaltung:3}},
      misserfolg:{text:'Du führst den Befehl aus und schreibst am Abend drei Sätze, die man auch als Beschwerde lesen kann. Jemand liest sie so.',
              gunst:-1, gunstVon:'vernet', belastung:6, leben:-6}}
   ]},

  /* ── Garnison 1801–04 ──
     Vier Jahre Frieden brauchen ihre eigenen kleinen Fragen. Zwei davon
     (Patrouille, Werbung) gibt es nur hier, weil es sie im Feld nicht gibt. */

  {id:'patrouille', titel:'Patrouille durch die Stadt', kapitel:'garnison',
   text:['Zwei Mann, eine Laterne, vier Stunden. Die Nachtpatrouille geht die Straßen ab, in denen die Wirtsstuben sind, und sammelt ein, was die Wirtsstuben ausspucken.',
         'Um halb zwei findet ihr drei Mann vom 79. vor einer Tür, von denen zwei den dritten halten. Der dritte hat einer Frau ins Fenster geschrien, und die Frau hat einen Mann, und der Mann steht jetzt mit einem Beil in der Tür. Es ist noch nichts passiert.'],
   optionen:[
     {label:'Die drei einsammeln und abführen', hint:'Autorität · es ist der Dienstweg',
      probe:{wert:'autoritaet', schw:35},
      erfolg:{text:'Du sagst es einmal, laut, und dann noch einmal, leiser. Der mit dem Beil geht zuerst hinein, weil ihm jemand einen Grund gegeben hat, es zu tun, ohne das Gesicht zu verlieren. Die drei vom 79. gehen mit, weil sie zu betrunken sind, um sich etwas Besseres einfallen zu lassen. Im Rapport steht am Morgen: keine besonderen Vorkommnisse.',
              ruf:2, gunst:1, gunstVon:'berthaud', fert:{drill:3}},
      misserfolg:{text:'Du sagst es dreimal, und beim dritten Mal lacht einer. Es wird eine Prügelei, in der du einen Schlag abbekommst, der für jemand anderen gedacht war, und am Ende ist die Tür kaputt und der Wirt schreibt eine Rechnung. Der Rapport wird länger als die Nacht.',
              belastung:6, leben:-6, gunst:-1, gunstVon:'berthaud'}},
     {label:'Erst mit dem Mann in der Tür reden', hint:'Menschenkenntnis · das Beil ist das Problem',
      probe:{wert:'menschenkenntnis', schw:40},
      erfolg:{text:'Du gehst an den drei Betrunkenen vorbei und stellst dich zu dem mit dem Beil, mit dem Rücken zu ihnen, und fragst ihn, ob er Kinder im Haus hat. Er sagt: zwei. Dann sagst du, es wäre gut, wenn die morgen früh nichts zu sehen bekämen. Er geht hinein. Die drei sammelt ihr danach in Ruhe ein.',
              ruf:3, kameradschaft:6, attr:{menschenkenntnis:3}},
      misserfolg:{text:'Du redest, und er hört nicht zu, weil er zu weit ist. Es geht am Ende ohne Toten aus, aber nicht ohne Blut, und du hast eine Hand voll Splitter aus einem Türrahmen.',
              belastung:8, leben:-8}},
     {label:'Einen Bogen machen', hint:'In vier Stunden sieht man vieles',
      erfolg:{text:'Ihr geht die Gasse nicht hinunter, sondern die nächste. Was ihr nicht gesehen habt, steht nicht im Rapport. Am Morgen hört man, dass es beim 79. eine Anzeige gegeben hat, wegen einer eingeschlagenen Tür.',
              ruf:-2, belastung:2}}
   ]},

  {id:'werber', titel:'Der Werber des Regiments', kapitel:'garnison',
   text:['Ein Regiment im Frieden muss sich auffüllen, und Konskribierte kommen ungern. Also schickt man Werber auf die Dörfer, mit einer Trommel, einer Fahne und Geld, und weil ein Werber allein nichts wert ist, schickt man einen Soldaten mit, der aussieht, als sei es ihm gut ergangen.',
         'Diese Woche bist du das. Vier Dörfer im Umland, ein Tisch vor der Kirche, und die Aufgabe, jungen Männern das Leben zu erklären, das du hinter dir hast.'],
   optionen:[
     {label:'Erzählen, wie es war', hint:'Menschenkenntnis · die Wahrheit wirbt schlecht',
      probe:{wert:'menschenkenntnis', schw:45},
      erfolg:{text:'Du erzählst Lodi und Embabeh und lässt nichts weg, auch nicht den Sinai und nicht die Ruhr. Am Ende des Tages haben zwei unterschrieben — zwei, die zugehört haben und trotzdem wollten. Der Werber ist unzufrieden, weil er auf sechs gehofft hatte. In zwei Jahren wirst du froh sein, dass es diese zwei sind.',
              ruf:2, kameradschaft:6, gunst:1, gunstVon:'martel'},
      misserfolg:{text:'Du erzählst, wie es war, und nach zwanzig Minuten steht keiner mehr am Tisch. Der Werber sagt auf dem Rückweg kein Wort und meldet im Regiment, du seist für so etwas ungeeignet. Er hat recht.',
              belastung:4}},
     {label:'Erzählen, wie es klingen soll', hint:'Sechs Unterschriften sind sechs Unterschriften',
      erfolg:{text:'Du erzählst Ägypten als Abenteuer, den Sold als Vermögen und die Beförderung als Frage der Zeit. Es ist nicht gelogen, es ist nur alles weggelassen. Sechs unterschreiben, einer davon ist fünfzehn und behauptet, er sei achtzehn. Der Werber gibt dir zehn Francs von seinem Kopfgeld.',
              geld:10, ruf:1, kameradschaft:-6}},
     {label:'Krank melden', hint:'Es geht auch ohne dich',
      erfolg:{text:'Du meldest dich mit dem Rücken krank, und der Feldscher schreibt es auf, weil er es bei einem aus Ägypten glaubt. Die Woche verbringst du im Quartier. Es ist die langweiligste des Jahres.',
              belastung:-4, ruf:-1}}
   ]},

  {id:'markt', titel:'Markttag in Nîmes', kapitel:'garnison',
   text:['Am Donnerstag ist Markt vor dem Amphitheater, und am Donnerstag ist die halbe Kompanie dort, weil es der einzige Ort ist, an dem etwas passiert.',
         'Ein Händler aus Lyon verkauft Ausrüstung, die er von irgendwoher hat und über die man besser nicht fragt: Schuhe, Mäntel, Klingen, ein Fernrohr mit einem Sprung im Glas.'],
   optionen:[
     {label:'Ein Paar richtige Schuhe kaufen', hint:'12 Francs · doppelt genäht',
      erfolg:{text:'Zwölf Francs für ein Paar Schuhe, die ein Schuster gemacht hat und nicht ein Lieferant mit einem Vertrag. Man merkt den Unterschied am dritten Tag eines Marsches, und der nächste Marsch kommt bestimmt.',
              geld:-12, ausr:{schuhe:45}}},
     {label:'Nach dem Fernrohr fragen', hint:'Kartenkunde · es ist zu teuer und zu gut',
      probe:{wert:'kartenkunde', schw:35},
      erfolg:{text:'Du siehst hindurch und siehst, dass der Sprung im Glas nur am Rand sitzt und in der Mitte nichts stört. Der Händler merkt, dass du weißt, was du in der Hand hast, und geht von dreißig auf achtzehn. Es ist immer noch zu viel für einen Unteroffizier. Du kaufst es trotzdem.',
              geld:-18, fert:{kartenkunde:8, taktik:4}},
      misserfolg:{text:'Du siehst hindurch und siehst einen Sprung. Der Händler redet zwei Minuten über Amsterdam und optische Gläser, und du legst es zurück, weil du nicht beurteilen kannst, ob eines der Wörter stimmt.',
              geld:0}},
     {label:'Zusehen, wie andere kaufen', hint:'Der Sold reicht nicht für alles',
      erfolg:{text:'Du gehst über den Markt, siehst dir alles an und kaufst ein Brot. Zwei aus der Kompanie geben an einem Nachmittag aus, was sie in drei Wochen verdient haben. In vier Wochen borgen sie sich Geld.',
              geld:3, attr:{menschenkenntnis:2}}}
   ]},

  {id:'boote', titel:'Die Boote im Hafen', kapitel:'garnison',
   text:['Zweitausend flache Boote liegen im Hafen von Boulogne, und jedes soll hundert Mann übersetzen. Geübt wird das Einschiffen bei jedem Wetter, weil bei jedem Wetter gelandet werden soll.',
         'Heute ist Wind aus Nordwest, und bei Wind aus Nordwest kentert regelmäßig eines. Heute ist es das dritte in der Reihe neben euch, mit achtzig Mann des 51. an Bord, vierzig Meter vom Kai.'],
   optionen:[
     {label:'Hinterher ins Wasser', hint:'Konstitution · es ist November und der Kanal',
      risk:true, probe:{wert:'konstitution', schw:45},
      erfolg:{text:'Das Wasser ist so kalt, dass es einen Augenblick lang nicht kalt ist, sondern nur laut. Du bekommst zwei zu fassen und schiebst sie an den Bootshaken, den jemand von oben herunterhält. Der Zweite ist bewusstlos und wird es überleben. Der Capitaine des 51. schreibt einen Namen auf, und es ist deiner.',
              ruf:5, nennung:true, kameradschaft:10, leben:-12, belastung:8, atem:-15},
      misserfolg:{text:'Du kommst zwanzig Meter weit, und dann nimmt dir der Mantel das Wasser auf und zieht. Man fischt dich mit einem Haken heraus, zusammen mit denen, die du holen wolltest. Zwei von denen sind tot, und es lag nicht an dir. Das hilft am Abend nicht.',
              leben:-16, belastung:12, atem:-20, wunde:'Unterkühlung'}},
     {label:'Die Leine werfen', hint:'Geschick · vom Kai aus',
      probe:{wert:'geschick', schw:35},
      erfolg:{text:'Du wirfst zweimal daneben und beim dritten Mal richtig, und an der Leine hängen am Ende sechs Mann. Es ist die vernünftige Art, so etwas zu tun, und deshalb schreibt sie niemand auf.',
              ruf:2, kameradschaft:6},
      misserfolg:{text:'Du wirfst dreimal und triffst nichts, und dann nimmt dir ein Matrose die Leine aus der Hand und macht es richtig. Er sagt nichts dazu, was schlimmer ist, als wenn er etwas gesagt hätte.',
              belastung:4}},
     {label:'Am Kai bleiben', hint:'Es sind Matrosen da, die das können',
      erfolg:{text:'Du stehst am Kai und siehst zu, wie es die machen, die es können. Sie holen sechzig der achtzig heraus. Die anderen zwanzig findet man in den nächsten Tagen an der Küste, und keiner von ihnen ist ertrunken, weil du am Kai gestanden hast.',
              belastung:6}}
   ]},


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
              ruf:2, gunst:1, gunstVon:'berthaud', fert:{reiten:4}},
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
              gunst:1, gunstVon:'collot', geld:5, fert:{verwaltung:5}},
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
              ruf:2, gunst:1, gunstVon:'berthaud', kameradschaft:4},
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
              gunst:1, gunstVon:'berthaud', ruf:1, fert:{kartenkunde:6}},
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

/* In welchem Kapitel diese Station liegt. Früher stand hier eine feste Abfrage
   auf Ägypten; mit dem dritten Kapitel wäre das die Stelle gewesen, an der man
   eine zweite Sonderregel danebenschreibt. Stattdessen einmal nachschlagen. */
function kapitelVon(n){
  for(const id in STATIONEN) if((STATIONEN[id]||[]).some(x=>x.id===n.id)) return id;
  return null;
}

function marschWuerfeln(n){
  const gesehen = S.marschGesehen || [];
  const hier = kapitelVon(n);
  const pool = MARSCH_EREIGNISSE.filter(e =>
    !gesehen.includes(e.id) &&
    (!e.kapitel || e.kapitel === hier) &&
    (!e.wenn || e.wenn(n)));
  if(!pool.length || Math.random() > 0.35) return null;
  return pool[Math.floor(Math.random()*pool.length)];
}

function zeigeMarschEreignis(e, n){
  const offen = marschOffen(e);
  const opt = offen.map((o,i)=>
    wahlZeile(roemisch(i+1), esc(o.label), wahlKosten(o), `marschWaehlen(${i})`, {risk:o.risk})).join('');
  const gesperrt = marschVerwehrt(e).map(o=>`<p>${esc(o.ab.sonst)}</p>`).join('');
  app.innerHTML = `<div class="stage">${verlauf()}
    <div>${wegband(n)}
      ${bogen({ort:'Auf dem Marsch · '+e.titel, datum:n.datum||''},
        `<div class="prose">${e.text.map(t=>`<p>${t}</p>`).join('')}${gesperrt}</div>`,
        ['Was tust du?','Ein Zwischenfall · er zählt wie jede Wahl'],
        opt,
        'Zwischen zwei Stationen · der Feldzug ist gesichert')}
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

function marschWaehlen(i){
  // Wächter gegen den zweiten Klick, bevor der Bildschirm ausgetauscht ist
  const e = MARSCH_EREIGNISSE.find(x=>x.id===LAUF.marsch);
  if(!e){ LAUF.marsch = null; naechster(); return; }
  const n = KAPITEL[LAUF.node];
  const o = marschOffen(e)[i];
  if(!o) return;
  let w, klasse='gut', probeText='';
  if(o.probe){
    const p = probe(o.probe.wert, o.probe.schw);
    w = p.erfolg ? o.erfolg : (o.misserfolg||o.erfolg);
    klasse = p.erfolg ? 'gut' : 'schlecht';
    probeText = `<div class="pruefung ${klasse}">${wertName(o.probe.wert)} — ${probeWort(p)}</div>`;
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

/* Der Nachfolger stellt sich vor. Kurz, ohne Wahl — man hat hier nichts zu
   entscheiden, und genau das ist der Punkt: Die Armee ersetzt ihre Leute, und
   der Neue kennt dich nicht. */
function zeigeNachfolger(nf, n){
  app.innerHTML = `<div class="stage">${verlauf()}
    <div><div class="card"><div class="ch"><span>Die Stelle wird besetzt</span><span>${esc(n.datum||'')}</span></div>
      <div class="cb"><div class="prose">
        <p>${esc(nf.alt)} ist tot. Sein Posten war zwei Tage lang unbesetzt, und zwei Tage sind in dieser Armee lang.</p>
        <p>${esc(nf.satz)}</p>
        <p class="said">Er sieht die Reihe entlang, an dir vorbei. Was du dir bei seinem Vorgänger erarbeitet hast, steht in keiner Liste.</p>
      </div>
      <div class="wirkung"><span>Von vorn</span>Bei ihm stehst du bei null. <b>Fürsprache 0</b></div>
      </div></div>
      <div class="orders"><div class="ordbody">
        <button class="ord weiter" onclick="nachfolgerAntreten();naechster()">Weiter</button>
      </div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

/* ══════════════════ ABLAUF ══════════════════ */

/* Die Verleihung steht auf Papier, wie der Beförderungsbescheid und das
   Chronikblatt: Ein Orden ist ein Schriftstück, bevor er ein Stück Blech ist.
   Der Ton bleibt trocken — verliehen wird, nicht gefeiert. */
/* **Der Vorschlag.** Zwischen „du hast genug getan" und „du bist befördert"
   lag bisher nichts — die Schwelle wurde stumm geprüft, und zwei Stationen
   später stand die Beförderung da. Jetzt sagt es dir der Mann, der es tut.

   Der Text nennt beides: dass dein Name oben liegt, und dass keine Stelle frei
   ist. **Was daraus folgt, wird nicht ausgesprochen** — das ist Invariante 5,
   und sie wird nie erklärt, nur gezeigt. */
function zeigeVorschlag(v, n){
  const patronId = v.patron;
  const wer = personName(patronId);
  /* Wofür er dich vorschlägt, steht am LEITER-Eintrag. Vorher war dieser
     Bildschirm fest auf den Sergenten getextet und lief trotzdem schon für
     Rang 6 — mit acht weiteren Rängen wäre daraus ein Text geworden, der bei
     jedem zweiten Aufstieg das Falsche sagt. */
  const ziel = LEITER.filter(e => e.rang === v.rang)[0] || {};
  const wofuer = ziel.vorschlag || 'für die nächste Stelle, die frei wird';
  const stellen = ziel.stellenText || 'Die Kompanie habe ihre Leute, und alle seien gesund.';
  laufSichern();
  app.innerHTML = `<div class="stage">${verlauf()}<div>${wegband(n)}
    <div class="card papier"><div class="ch"><span>${esc(wer)}</span><span>${esc(n.datum||'')}</span></div>
      <div class="cb">
        <div class="prose">
          <p>${esc(wer)} hält dich nach dem Appell auf. Er hat ein Blatt in der Hand, das er nicht vorzeigt.</p>
          <p>„Ich habe deinen Namen weitergegeben", sagt er. „${esc(wofuer.charAt(0).toUpperCase()+wofuer.slice(1))}." Er sagt es so, wie man eine Bestandsmeldung vorliest.</p>
          <p>Dann fügt er hinzu, was er hinzufügen muss: Es sei zurzeit keine Stelle frei. ${esc(stellen)}</p>
          <p>Er faltet das Blatt und steckt es weg. „Halt dich bereit", sagt er noch, und geht.</p>
        </div>
        <div class="wirkung"><span>Auf der Liste</span>
          Dein Name liegt beim Bataillon. Ruf ${S.ruf} · Fürsprache ${esc(personKurz(patronId))} ${gunst(patronId)}</div>
      </div></div>
    <div class="orders"><div class="ordbody">
      <button class="ord weiter" onclick="vorschlagWeiter()">Wegtreten</button>
    </div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}
function vorschlagWeiter(){ LAUF.vorschlag = null; laufSichern(); naechster(); }

function zeigeOrden(o, n){
  ordenVerleihen(o);
  laufSichern();
  const auto = o.id==='legion' && hatOrden('ehrenwaffe');
  app.innerHTML = `<div class="stage">${verlauf()}<div>${wegband(n)}
    <div class="card papier"><div class="ch"><span>${esc(o.voll)}</span><span>${esc(n.datum||'')}</span></div>
      <div class="cb">
        <div class="ordenblatt">${ordensbild(o.id)}</div>
        <div class="prose">
          <p>${esc(o.was)}</p>
          <p>${auto
            ? 'Du musstest dich nicht bewerben. Wer eine Ehrenwaffe trägt, steht von Rechts wegen auf der Liste — so hat es der Kaiser verfügen lassen, und so steht es in der Verordnung, die der Adjutant vorliest, während dreitausend Mann in der Sonne stehen.'
            : 'Der Adjutant liest deinen Namen von einem Blatt ab, auf dem noch neunzehn andere stehen. Er spricht ihn falsch aus. Dann geht er zum nächsten.'}</p>
          <p>${esc(S.name)}, ${rangName(S.rang)} der 32. ${jahrVonStation()>=1803?'Linie':'Halbbrigade'}. Verliehen für: ${S.nennungen} Nennungen im Tagesbefehl.</p>
        </div>
        <div class="wirkung"><span>${esc(o.name)}</span>
          Ruf +${o.ruf}${o.pension?` · Pension ${o.pension===1?'ein Franc':'ein halber Franc'} je Station`:''} · ${o.vp} Punkte in der Wertung</div>
      </div></div>
    <div class="orders"><div class="ordbody">
      <button class="ord weiter" onclick="ordenWeiter()">Wegtreten</button>
    </div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}
function ordenWeiter(){ LAUF.orden = null; laufSichern(); naechster(); }

function naechster(){
  if(!S.lebt){ zeigeTod(); return; }
  if(LAUF.node >= KAPITEL.length){ zeigeKapitelende(); return; }
  const n = KAPITEL[LAUF.node];
  /* ── Der forcierte Marsch hat diese Station überholt ──
     Übersprungen heißt: Sie findet nicht statt. Kein `stationErledigt()`, also
     keine Zeitheilung, kein Sold, kein Chronikeintrag — man war nicht da. Das
     ist der Preis auf der anderen Seite des Handels und der Grund, warum
     Forcieren nicht immer richtig ist. */
  if(LAUF.ueberspringen && n.id === LAUF.ueberspringen){
    LAUF.ueberspringen = null;
    LAUF.node++; laufSichern();
    naechster(); return;
  }
  if(n.datum && n.id && LAUF.gezaehlt !== n.id){
    LAUF.gezaehlt = n.id;                 // beim Fortsetzen nicht doppelt zählen
    const b = META.bestKapitel[n.id] || {mal:0,rangN:0,rang:''};
    b.mal++;
    /* Die Rangzahl mitschreiben statt sie aus dem Namen zurückzurechnen:
       `rangName(2)` liefert für den Voltigeur „Voltigeur", das in RANG nicht
       vorkommt — `findIndex` gab −1, und damit überschrieb jeder Füsilier den
       Eintrag eines Voltigeurs. */
    if(S.rang >= (b.rangN|0)){ b.rangN = S.rang; b.rang = rangName(S.rang); }
    META.bestKapitel[n.id]=b;
    /* Der höchste je getragene Rang über **alle** Läufe. Er schaltet die
       Patente frei und ist damit die zweite dauerhafte Freischaltung des
       Spiels neben den Generalskampagnen. Ein gekaufter Rang zählt dabei
       mit — wer als Sous-Lieutenant startet und Lieutenant wird, hat den
       Lieutenant getragen, und das ist der Punkt der Staffelung. */
    if(S.rang > (META.bestRang|0)) META.bestRang = S.rang;
    chronikSichern();
  }
  laufSichern();
  kopfzeile();
  /* Ist einer aus der Kette gefallen, tritt sein Nachfolger an, bevor
     irgendetwas anderes passiert. Ein Todesfall ist keine Fußnote. */
  if(LAUF.nachfolger){ zeigeNachfolger(LAUF.nachfolger, n); return; }

  /* Ein fälliger Orden wird angesagt, bevor die Station kommt — er gehört zu
     dem, was gerade passiert ist, nicht zu dem, was als Nächstes kommt.
     `LAUF.orden` hält ihn fest, damit ein Beenden mitten in der Verleihung
     nicht darüber hinweggeht. */
  if(!LAUF.orden){
    const faellig = ordenFaellig();
    if(faellig){ LAUF.orden = faellig.id; laufSichern(); }
  }
  if(LAUF.orden){
    const o = ordenVon(LAUF.orden);
    if(o){ zeigeOrden(o, n); return; }
    LAUF.orden = null;
  }

  /* Der Lieutenant hat deinen Namen nach oben gegeben. Das steht vor der
     nächsten Station, weil es zu dem gehört, was gerade passiert ist. */
  if(LAUF.vorschlag){
    const v = typeof LAUF.vorschlag === 'string' ? {patron:LAUF.vorschlag} : LAUF.vorschlag;
    zeigeVorschlag(v, n); return;
  }

  /* Zwischenfall auf dem Marsch: hängt einer an (auch nach Fortsetzen), steht
     er wieder da; sonst wird beim ersten Betreten einer Station mit Marschweg
     einmal gewürfelt. Vor Gefechten nicht — dort trägt der Anmarsch die Last. */
  if(LAUF.marsch){
    const me = MARSCH_EREIGNISSE.find(x=>x.id===LAUF.marsch);
    if(me){ zeigeMarschEreignis(me, n); return; }
    LAUF.marsch = null;
  }
  /* Das Tempo wird vor dem Marsch gewählt, nicht auf ihm — also vor dem
     Zwischenfall-Wurf, aber nach einer noch offenen Frage von vorhin. */
  if(n.tempo && LAUF.tempo !== n.id){ zeigeTempo(n); return; }
  /* ── Wer den Rückruf abgelehnt hat, marschiert nicht mit ──
     **Ganz oben, vor allem anderen.** Die Ablehnung im April 1815 ist eine
     echte Wahl mit einem vollwertigen Ende, kein schlechteres — deshalb
     überspringt sie alles, was noch käme, und geht direkt in den Epilog. Ein
     Mann, der zu Hause bleibt, steht nicht bei Ligny und begegnet auch keinem
     Zwischenfall auf einem Marsch, den er nicht mitmacht.

     Die erste Fassung stand weiter unten in der Kette, hinter `typ==='szene'`
     — und traf deshalb nie, weil auf den Brief eine Szene folgt. */
  if(S && S.abgelehnt && !n.epilog){
    const i = KAPITEL.findIndex(x=>x.epilog);
    if(i >= 0 && LAUF.node !== i){ LAUF.node = i; laufSichern(); naechster(); return; }
    zeigeEpilog(KAPITEL[i] || n); return;
  }

  /* Gewürfelt wird auf Stationen mit Marschweg — und seit Kapitel 3 auch auf
     solchen, die es ausdrücklich anfordern (`zwischenfall:true`). In einer
     Garnison marschiert niemand, und ohne diese zweite Tür hätten die vier
     Friedens-Zwischenfälle nie eine Gelegenheit. Vor Gefechten weiterhin nicht:
     dort trägt der Anmarsch die Last. */
  if((n.marsch || n.zwischenfall) && n.id && n.typ!=='kampf' && LAUF.marschGeprueft !== n.id){
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
    if(K && K.ereignis && !e) K.ereignis = null;   // unbekannte ID nicht ewig mitschleppen
    if(e) zeigeEreignis(e);
    else if(K) zeigeKampf('Das Gefecht geht weiter, wo du es verlassen hast.');
    else starteKampf(n);
  }
  else if(n.epilog) zeigeEpilog(n);
  else if(n.typ==='befoerderung') zeigeBefoerderung(n);
  else if(n.typ==='elite') zeigeElite(n);
  else if(n.typ==='winter') zeigeWinter(n);
  else if(n.typ==='uebergang') zeigeUebergang(n);
  /* Eine Station mit `schranke` ist ein Ende mit einer Wahl davor — sie geht
     deshalb vor der gewöhnlichen Endstation, nicht daneben. */
  else if(n.schranke) zeigeSchranke(n);
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
    /* ── Was ein Feldzug aus einem Körper macht ──

       **Der einzige Ort im Spiel, an dem ein Attribut wächst, ohne dass man
       etwas dafür gedrückt hat — und er ist verdient, nicht geschenkt.** Wer
       hier steht, hat einen ganzen Feldzug überlebt; das ist die Bedingung,
       und sie ist die härteste im Spiel.

       Gebaut gegen den schärfsten gemessenen Befund: **Veteranenpunkte kaufen
       Rang und keine Strecke** (Weite 57 / 62 / 61 bei 11 / 30 / 38 %
       Capitaine). Jede Progression, die über bessere Werte läuft, endet in
       der Ruf-Kette und damit in den Offiziersrängen mit ihren +4 bis +5
       Gefahr. Diese hier läuft über die **Strecke**: Sieben Übergänge sind
       +21 Konstitution und damit rund dreizehn Lebenspunkte, und man bekommt
       sie nur, indem man ankommt.

       **Ohne Deckel bei 100.** `lebenMax()` rechnet vom rohen Wert, linear
       und ungeklemmt — ein Mann, der acht Feldzüge überlebt hat, darf
       zäher sein als menschenmöglich. Natürliches Üben plateauiert dagegen
       weiterhin bei 100, weil die Wachstumsformel darüber negativ wird.

       Reihenfolge: **erst der Zuwachs, dann auffüllen.** `lebenMax()` hängt
       an der Konstitution, und wer davor auffüllt, füllt gegen den kleineren
       Vorrat — derselbe Fehler wie damals bei den Wunden. */
    S.attr.konstitution = (S.attr.konstitution|0) + 3;
    // Erst die Wunden weg, dann auffüllen: `lebenMax()` schrumpft mit offenen
    // Wunden, sonst rückt der Mann mit 68 statt 82 ein, obwohl „voll" dasteht.
    S.wunden = [];
    S.leben = lebenMax();
    S.atem = 100; atemKlemmen();
    S.belastung = Math.max(0, Math.floor(S.belastung/2));
    /* ── Der Unterhalt des Pferdes ──
       Er wird am Übergang fällig, also einmal je Feldzug, und er ist der
       Grund, warum ein Pferd eine Entscheidung ist: 60 Francs für das Vollblut
       sind mehr, als ein Fusilier in drei Kapiteln Sold sieht. Wer nicht
       zahlen kann, verliert es — die Armee füttert kein Privatpferd. */
    const uh = pferdUnterhalt();
    if(uh){
      if(S.geld >= uh){ S.geld -= uh; LAUF.pferdKosten = uh; }
      else { S.pferdWeg = true; LAUF.pferdKosten = -1; }
    }
    /* Der stehende Auftrag des Feldzugs wird hier abgerechnet — die einzige
       Stelle, an der ein ganzer Feldzug zu Ende ist und noch jemand da ist,
       der etwas dazu sagt. */
    kapitelauftragAbrechnen();
    laufSichern();
  }
  app.innerHTML = `<div class="stage">${verlauf()}
    <div>${wegband(n)}
      <div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
        <div class="cb"><div class="prose">${(n.text||[]).map(t=>`<p>${t}</p>`).join('')}</div>
        <div class="wirkung"><span>Zwischenstand</span>
          ${rangName(S.rang)} · Ruf ${S.ruf} · ${stationen()} Stationen · ${S.nennungen}× im Tagesbefehl</div>
        ${LAUF.pferdKosten ? `<div class="wirkung"><span>Das Pferd</span>${
          LAUF.pferdKosten > 0
            ? 'Hafer, Hufeisen, ein Sattler, der zweimal ausbessert. <b>−'+francs(LAUF.pferdKosten)+' F</b>'
            : 'Du kannst es nicht mehr füttern. Der Train nimmt es, und man gibt dir einen Schein, den niemand einlöst. <b>Das Pferd ist weg.</b>'}</div>` : ''}
        ${kapitelauftragAbrechnungZeile()}
        <div class="wirkung"><span>Ein Jahr Garnison</span>
          Die Wunden schließen sich, der Atem kommt zurück. Was bleibt, ist, was du gelernt hast — und die Hälfte der Last.
          <b>Konstitution +3:</b> Der Körper hat sich an das Marschieren gewöhnt, an das Schlafen im Nassen und daran, mit wenig auszukommen.</div>
        </div></div>
      <div class="orders"><div class="ordbody">
        <button class="ord weiter" onclick="stationErledigt();naechster()">Weiter
          <span class="cost">Der nächste Feldzug · derselbe Mann</span></button>
      </div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

/* ══════════════════ DIE TEMPOWAHL ══════════════════

   **Der Krieg wird mit den Beinen gewonnen** — die eigene Regel von Kapitel 5
   (KAMPAGNEN §1). Die Grande Armée schlägt Preußen in vier Wochen, und sie tut
   es durch Marschleistung: Wer zuerst da ist, gewinnt, bevor geschossen wird.
   Damit das nicht bloß im Text steht, bekommt der Marsch selbst eine
   Entscheidung — drei Knöpfe an jeder Station, die `tempo` trägt.

   **Der forcierte Marsch ist der einzige Knopf im Spiel, der Spielzeit
   überspringt.** Welche Station er auslässt, sagen die Daten
   (`tempo.ueberspringt`), nicht der Code: Ein Tempo, das wahllos die nächste
   Station verschluckt, träfe irgendwann ein Gefecht oder ein Lager, und beides
   wäre falsch. Was übersprungen wird, ist immer eine Szene — und eine, in der
   etwas zu holen gewesen wäre. Das ist der Handel: **Zeit gegen Substanz.**

   **Warum ohne Probe.** Wie die Rechnung des Bataillonschefs („welche Kompanie
   geht zuerst hinein") ist das keine Frage des Könnens, sondern eine, für die
   man bezahlt. Es gibt keine Fertigkeit, die einem abnimmt, ob man seine Leute
   schont oder verheizt.

   **Die Schuhe zahlen mit.** Wer forciert marschiert und schlechte Schuhe hat,
   zahlt doppelt. Das ist die rückwirkende Aufwertung des unscheinbarsten
   Ladenpostens — dieselbe Idee, mit der später der Mantel im Frost zum
   wichtigsten Gegenstand des Spiels wird, ohne dass ein System dazukommt.

   Datenformat an der Station:
     tempo:{ ueberspringt:'stations-id',        // optional
             forciert:{text:'…', ruf:6},        // optionale Zusatzwirkung
             normal:{…}, schonend:{…} }                                     */
const TEMPO = [
  {id:'schonend', label:'Schonend marschieren',
   hint:'Ruf −2 · es wird aufgeschrieben, wer wann eintrifft',
   verschleiss:0.08, atem:-2, belastung:1, ruf:-2,
   text:'Du lässt die Kolonne in ihrem Schritt. Am Abend steht, wer morgens angetreten ist, und am Straßenrand liegt keiner von euch. Am Etappenort steht ein Adjutant mit einer Uhr und schreibt auf, welches Bataillon wann eintrifft. Er schreibt es für jemanden auf, den du nie zu sehen bekommst.'},
  {id:'normal', label:'Nach Vorschrift marschieren',
   hint:'Dreißig Kilometer, zwei Rasten, abends Quartier',
   verschleiss:0.15, atem:-6, belastung:2,
   text:'Dreißig Kilometer, zwei Rasten, abends Quartier. Es ist die Leistung, für die dieses Heer gebaut worden ist, und sie fühlt sich nach nichts Besonderem an, solange man sie erbringt.'},
  {id:'forciert', label:'Forcieren',
   hint:'Doppelter Verschleiß · Atem −25 · du kommst an, bevor der Weg zu Ende ist',
   verschleiss:0.5, atem:-25, belastung:8, forciert:true,
   text:'Losgehen um drei, Rast im Stehen, weiter im Dunkeln. Die letzten Stunden geht die Kolonne, ohne dass jemand redet. Wer liegen bleibt, bleibt liegen; die Gendarmerie sammelt ihn ein, wenn sie kann, und wenn nicht, dann nicht.'}
];

function zeigeTempo(n){
  const t = n.tempo || {};
  const opt = TEMPO.map((x,i)=>{
    const zusatz = t[x.id] || {};
    const uebersprungen = (x.forciert && t.ueberspringt) ? ' · eine Station bleibt liegen' : '';
    /* `data-gewinn` ist kein verstecktes Wissen — es steht als Satz auf dem
       Knopf („ihr holt eine Kolonne ein, die aufgeben will"). Das Attribut
       sagt dem Testbot dasselbe, was ein Spieler liest, und ohne es misst das
       Skript wieder seine eigene Blindheit statt des Spiels. */
    /* `data-gewinn` sagt dem Testbot dasselbe, was ein Spieler liest — ohne
       es misst das Skript wieder seine eigene Blindheit statt des Spiels. */
    const zeile = wahlZeile(roemisch(i+1), esc(x.label),
      esc(x.hint)+uebersprungen+(zusatz.hint?' · '+esc(zusatz.hint):''),
      `waehleTempo(${i})`, {risk:x.forciert});
    return (x.forciert && zusatz.hint) ? zeile.replace('<button ', '<button data-gewinn="1" ') : zeile;
  }).join('');
  app.innerHTML = `<div class="stage">${verlauf()}
    <div>${wegband(n)}
      ${bogen({ort:'Das Tempo', datum:n.datum||''},
        `<div class="prose">${(t.text||[
          'Vor dem Abmarsch steht die Frage, die in diesem Feldzug jeden Tag gestellt wird und über die keine Vorschrift etwas sagt: wie schnell.'
        ]).map(x=>`<p>${x}</p>`).join('')}</div>`,
        ['Wie marschiert ihr?','Keine Probe · es gibt keine Fertigkeit dafür'],
        opt,
        'Vor dem Abmarsch · der Feldzug ist gesichert')}
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

function waehleTempo(i){
  const n = KAPITEL[LAUF.node];
  if(!n || !n.tempo || LAUF.tempo === n.id) return;   // Wächter gegen den zweiten Klick
  const t = TEMPO[i]; if(!t) return;
  LAUF.tempo = n.id;
  const zusatz = n.tempo[t.id] || {};

  /* Grund- und Kapitelwirkung landen in **einem** Kasten: Der Spieler soll
     nicht zwei Rechnungen lesen, sondern eine. */
  const w = Object.assign({}, zusatz);
  delete w.text; delete w.hint;
  w.atem = (w.atem||0) + t.atem;
  w.belastung = (w.belastung||0) + t.belastung;
  if(t.ruf) w.ruf = (w.ruf||0) + t.ruf;

  let schuhe = '';
  if(t.forciert && S.ausr.schuhe && S.ausr.schuhe.zustand < 40){
    w.atem -= 8; w.belastung += 4;
    if(!w.wunde) w.wunde = 'Wundgelaufene Füße';
    schuhe = ' Deine Schuhe halten das nicht. Am dritten Tag gehst du auf etwas, das keine Sohle mehr hat.';
  }
  /* „Füße wie Leder", zweite Hälfte. Der forcierte Marsch bleibt teuer — er
     kostet weiterhin Verschleiß, Belastung und eine übersprungene Station.
     Was ein Gewohnter spart, ist Luft: acht von fünfundzwanzig. Das reicht,
     um ihn nicht unter die Warnschwelle 35 zu drücken, und ändert nichts
     daran, dass Forcieren eine Entscheidung mit Preis bleibt. */
  if(t.forciert && zaeh('zaeh_fuesse')){
    w.atem += 8;
    schuhe += ' Du gehst, wie man geht, wenn man es oft genug getan hat: kurze Schritte, und die Füße bleiben trocken.';
  }

  verschleiss(t.verschleiss);
  anwenden(w);
  if(t.forciert && n.tempo.ueberspringt) LAUF.ueberspringen = n.tempo.ueberspringt;
  S.log.push((n.ort||'') + ': ' + t.label);
  laufSichern();

  app.innerHTML = `<div class="stage">${verlauf()}
    <div><div class="card"><div class="ch"><span>Das Tempo</span><span>${esc(n.datum||'')}</span></div>
      <div class="cb"><div class="prose"><p class="said">${esc(t.label)}</p></div>
        <div class="ergebnis ${t.forciert?'schlecht':'gut'}">${t.text}${schuhe}${zusatz.text?'<br><br>'+zusatz.text:''}</div>
        ${wirkungen(w)}</div></div>
      <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="naechster()">Weiter</button></div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

/* ── Szene ── */
/* ── Rangfassungen (KAMPAGNEN §0.3) ──
   „Jede Station trägt jeden Rang." Eine Szene, die 1806 geschrieben ist, muss
   für einen Caporal stimmen und für einen Colonel — und wo das mit einem Text
   nicht geht, bekommt sie eine zweite Lage. Beides ist **additiv**, nach dem
   Muster von `rangTun` im Lager:

     rangText:{7:['…']}       zusätzliche Absätze ab Rang 7
     rangOptionen:{7:[{…}]}   zusätzliche Knöpfe ab Rang 7

   **Additiv und nicht ersetzend, aus einem Grund:** Ein ersetzter Text wäre
   eine zweite Szene unter demselben Namen, und dann hätte man zwei zu pflegen.
   Ein zusätzlicher Absatz sagt, was der Höhergestellte *mehr* sieht — und das
   ist ohnehin die Wahrheit über Ränge. Wer eine Wahl nur unten oder nur oben
   haben will, nimmt weiterhin `ab:{wert:'rang',min:n,sonst:'…'}`; das sperrt
   mit einem Satz statt mit einem grauen Knopf. */
function rangZusatz(o){
  if(!o) return [];
  const raus = [];
  for(const r in o) if(S.rang >= +r) raus.push(...o[r]);
  return raus;
}
function szeneText(n){ return (n.text||[]).concat(rangZusatz(n.rangText)); }
function szeneOptionen(n){ return (n.optionen||[]).concat(rangZusatz(n.rangOptionen)); }

/* Ob eine Szenenwahl überhaupt offensteht. Dieselbe Sperr-Regel wie bei den
   Marsch-Zwischenfällen (CLAUDE.md): **Wer eine Probe erkennbar nicht bestehen
   kann, bekommt keinen Knopf, sondern einen Satz.** Ein stummer gesperrter
   Knopf wäre die falsche Fassung derselben Idee.

   `ab:{wert:'…', min:n, sonst:'…'}` prüft entweder ein Merkmal auf `S`
   (die Heirat setzt voraus, dass man geworben hat) oder einen Attributwert. */
function szeneVerwehrt(o){
  if(!o.ab) return false;
  const k = o.ab.wert;
  if(k && S[k] !== undefined && typeof S[k] !== 'number') return !S[k];
  const v = (k && NAMEN[k]) ? wert(k) : (S[k]|0);
  return v < (o.ab.min|0);
}

/* ══════════════════ DER STATIONSBOGEN ══════════════════

   **Szene und Wahlen auf einem Blatt** (Bündel 1 des Entwurfspakets). Bis
   dahin standen sie in zwei Kästen — `.card` mit dem Text, darunter `.orders`
   mit den Knöpfen — und dazwischen klaffte eine Lücke, die es auf einem
   Kanzleibogen nicht gibt. Die Wahlen sahen außerdem aus wie Schaltflächen
   statt wie das, was sie sind: die Punkte einer Verfügung.

   `wahlListe()` und `bogen()` stehen hier einmal für alle sechs Aufrufstellen
   — Szene, Marschereignis, Lager, Gefecht, Gefechts-Ereignis. */
const ROEMISCH = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];
function roemisch(k){ return ROEMISCH[k-1] || String(k); }

/* Die Probenzeile hinter einer Wahl — Wert, Schwierigkeit und die *wirkliche*
   Aussicht. Seit dem Wurf aus zwei Würfen ist der Zielwert nicht mehr die
   Prozentzahl; `aussicht()` rechnet um. */
function wahlKosten(o){
  const teile = [];
  if(o.kosten || o.hint) teile.push(esc(o.kosten||o.hint));
  if(o.probe) teile.push(`${wertName(o.probe.wert)} ${wert(o.probe.wert)} gegen ${o.probe.schw} · ${aussicht(o.probe.wert,o.probe.schw)}%`);
  if(o.kette) teile.push(o.kette.map(st=>`${wertName(st.wert)} ${wert(st.wert)} gegen ${st.schw} · ${aussicht(st.wert,st.schw)}%`).join(' · '));
  return teile.join(' · ');
}

/* Eine Wahl als Zeile im Bogen. Gesperrte Wahlen bleiben `<button disabled>`
   und werden **nicht** zu `<div>`: Ein deaktivierter Knopf ist ohnehin nicht
   fokussierbar, und ein `<div>` fällt aus jedem Selektor heraus, der
   `:not([disabled])` prüft — der Testbot klickt dann ins Leere. */
function wahlZeile(nr, label, kosten, aufruf, opt){
  const o = opt || {};
  const attr = o.gesperrt ? ' disabled' : '';
  /* **`ord` steht mit dabei, und das ist kein Rest.** Fünf Prüfstände suchen
     ihre Knöpfe über `.ord`; sie alle umzuschreiben, nur weil sich die
     Gestaltung ändert, hieße die Messgeräte an die Optik zu binden. Im CSS
     gewinnt `.wahl`, weil es später steht — die Klasse ist also allein für
     die Skripte da und kostet nichts. */
  const kl = `wahl ord${o.risk?' risk':''}${o.klasse?' '+o.klasse:''}`;
  return `<button class="${kl}" onclick="${aufruf}"${attr}><span class="nr">${nr}</span><span>
      <span class="label">${label}</span><span class="cost">${kosten}</span></span></button>`;
}

/* Der Bogen selbst: Vordruckkopf, Fließtext, Wahlen, Fußzeile mit Siegel. */
function bogen(n, inhalt, wahlkopf, wahlen, fuss){
  /* **Der Kartenkopf bleibt, auch wenn der Vordruck darunter dasselbe Datum
     noch einmal setzt.** Er trägt den *Ort*, den der Vordruck nicht kennt —
     und fünf Prüfstände lesen die aktuelle Station aus `#app .ch span`. Ohne
     ihn meldet `test/kapitel.js` Stationen als übersprungen, die es gerade
     vor sich hat, und `test/spielstand.js` findet Savona nicht mehr. */
  return `<div class="card bogen"><div class="ch"><span>${esc((n&&n.ort)||'')}</span><span>${esc((n&&n.datum)||'')}</span></div>
    <div class="inner">
    ${vordruck(n)}
    ${inhalt}
    ${wahlen ? `<div class="wahlkopf"><span>${wahlkopf[0]}</span><span>${wahlkopf[1]}</span></div>${wahlen}` : ''}
    <div class="bogenfuss"><span>${fuss}</span>
      <span class="siegel">${kaiserreich()?'N':'RF'}</span></div>
  </div></div>`;
}

function zeigeSzene(n){
  const alle = szeneOptionen(n);
  const gesperrtText = alle.filter(o=>szeneVerwehrt(o) && o.ab.sonst)
    .map(o=>`<p>${esc(o.ab.sonst)}</p>`).join('');
  const offen = alle.filter(o=>!szeneVerwehrt(o));
  const opt = offen.map((o,k)=>
    wahlZeile(roemisch(k+1), esc(o.label), wahlKosten(o), `waehleOption(${alle.indexOf(o)})`,
      {risk:o.risk, gesperrt: o.probe && wert(o.probe.wert)<5})).join('');
  /* ── Der Notausgang ──
     **Eine Szene ohne einen einzigen drückbaren Knopf ist eine Sackgasse**, und
     der Lauf ist verloren, obwohl der Mann lebt. Das kann passieren, ohne dass
     es jemand beim Schreiben der Daten sieht: `wert()` zieht Wunden, Belastung
     und kaputte Schuhe ab (Konstitution −18 unter Zustand 25), und wer unter 5
     fällt, dessen Knopf wird gesperrt. Trägt jede Wahl der Szene eine Probe,
     bleibt nichts übrig.

     Gefunden beim Rangdurchlauf von Kapitel 5 (`test/kapitel.js`): ein
     Fusilier mit durchgelaufenen Schuhen stand vor der Verfolgung und konnte
     nichts mehr tun. **Die Regel bleibt, dass jede Szene eine Wahl ohne Probe
     haben soll** — dies hier ist die Sicherung dagegen, dass sie einmal
     vergessen wird, und sie ist absichtlich das Kärglichste, was das Spiel
     anbieten kann. */
  const notausgang = opt ? '' :
    wahlZeile('I','Es aushalten','Du kannst nichts von dem, was hier zu tun wäre','szeneAushalten()',{});
  app.innerHTML = `<div class="stage">${verlauf()}
    <div>${wegband(n)}
      ${bogen(n,
        `<div class="prose">${szeneText(n).map(t=>`<p>${t}</p>`).join('')}${gesperrtText}</div>`,
        ['Was tust du?','Eine Wahl · sie wird nicht bewertet'],
        opt+notausgang,
        `Der Feldzug ist gesichert · Station ${roemisch(LAUF.node+1)} von ${KAPITEL.length}`)}
    </div>${seitenleiste()}</div>`;
  LAUF.szene = n.id;
}
/* Der Notausgang aus `zeigeSzene`: keine Probe, keine Wirkung außer der, die
   ohnehin da ist. Er kostet einen Punkt Belastung, damit er kein Schlupfloch
   ist — aber er tut auch nicht so, als sei Nichtstun eine Leistung. */
function szeneAushalten(){
  const n = KAPITEL[LAUF.node];
  const erg = {text:'Es gibt an diesem Tag nichts, was du tun kannst. Du gehst mit, du stehst dabei, und am Abend ist es vorbei, ohne dass jemand deinen Namen genannt hätte.', belastung:2};
  anwenden(erg);
  S.log.push(n.id + ': ausgehalten');
  stationErledigt();
  app.innerHTML = `<div class="stage">${verlauf()}
    <div><div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb"><div class="ergebnis">${erg.text}</div>${wirkungen(erg)}</div></div>
      <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="naechster()">Weiter</button></div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

function waehleOption(i){
  const n = KAPITEL[LAUF.node], o = szeneOptionen(n)[i];
  let erg, klasse='', probeText='', kettenText='';

  /* ── Ketten in Szenen ──
     Dieselbe Semantik wie die Sondermissionen im Gefecht (`kette:` in
     GEFECHTS_EREIGNISSE): mehrere Proben hintereinander, jeder Fehlschlag
     kostet sofort Blut, die Mehrheit der Stufen entscheidet über die Wirkung.

     **Das ist die einzige Stelle, an der eine Szene töten darf.** Sonst klemmt
     `anwenden()` das Leben bei 1, weil der Tod ins Gefecht gehört, wo er einen
     Text und einen Ort hat. Eine Kette hat beides — man betritt sie
     freiwillig, sie hat einen Namen, und sie hat einen eigenen Todestext.
     Ohne diese Ausnahme wäre das Duell im Garnisonskapitel folgenlos, und ein
     Friedenskapitel ohne jede Todesmöglichkeit macht aus einem
     Permadeath-Spiel für vier Jahre ein Menü. */
  if(o.kette){
    const zeilen = []; let treffer = 0;
    for(const st of o.kette){
      const p = probe(st.wert, st.schw);
      let schaden = 0;
      if(p.erfolg) treffer++;
      else { schaden = st.schaden + Math.floor(Math.random()*5); S.leben = Math.max(0, S.leben - schaden); }
      atemKlemmen();
      zeilen.push((p.erfolg?st.gut:st.schlecht) +
        ` <span class="fein">${wertName(st.wert)} — ${probeWort(p)}${schaden?' · Leben −'+schaden:''}</span>`);
      if(S.leben <= 0){
        S.log.push(n.id+': '+o.label);
        toetlich(o.todesart || 'Gefallen');
        zeigeTod(zeilen.join(' ') + ' ' + (o.tod||''));
        return;
      }
    }
    erg = (treffer*2 > o.kette.length) ? o.erfolg : (o.misserfolg || o.erfolg);
    klasse = (treffer*2 > o.kette.length) ? 'gut' : 'schlecht';
    kettenText = zeilen.join(' ') + '<br><br>';
  }
  else if(o.probe){
    const p = probe(o.probe.wert, o.probe.schw);
    erg = p.erfolg ? o.erfolg : (o.misserfolg||o.erfolg);
    klasse = p.erfolg ? 'gut' : 'schlecht';
    // Nur das Ergebnis, nicht die Rechnung: Wert und Schwierigkeit stehen schon
    // vor der Wahl auf dem Knopf, und Zielwert und Wurf sagen hinterher nichts mehr.
    probeText = `<div class="pruefung ${klasse}">${wertName(o.probe.wert)} — ${probeWort(p)}</div>`;
  } else { erg = o.erfolg; klasse='gut'; }
  anwenden(erg);
  verschleiss(0.35);
  S.log.push(n.id+': '+o.label);
  stationErledigt();
  app.innerHTML = `<div class="stage">${verlauf()}
    <div><div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb"><div class="prose"><p class="said">${esc(o.label)}</p></div>
        <div class="ergebnis ${klasse}">${kettenText}${erg.text}${probeText}</div>
        ${wirkungen(erg)}</div></div>
      <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="naechster()">Weiter</button></div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}
function wirkungen(e){
  const t=[];
  const m = {ruf:'Ruf',gunst:'Gunst '+personKurz(e.gunstVon||'martel'),kameradschaft:'Kameradschaft',
             belastung:'Belastung',atem:'Atem',geld:'Francs',leben:'Leben',einheit:'Zustand der Einheit'};
  for(const k in m) if(e[k]) t.push(`${m[k]} ${e[k]>0?'+':''}${e[k]}`);
  if(e.attr) for(const k in e.attr) t.push(`${wertName(k)} ${e.attr[k]>0?'+':''}${e.attr[k]}`);
  if(e.fert) for(const k in e.fert) if(e.fert[k]) t.push(`${wertName(k)} ${e.fert[k]>0?'+':''}${e.fert[k]}`);
  if(e.ausr) for(const k in e.ausr) t.push(`${S.ausr[k].name} ${e.ausr[k]>0?'+':''}${e.ausr[k]}`);
  if(e.wunde) t.push('Wunde: '+e.wunde);
  if(e.nennung) t.push('Im Tagesbefehl genannt');
  return t.length ? `<div class="wirkung"><span>Wirkung</span>${t.join(' · ')}</div>` : '';
}
