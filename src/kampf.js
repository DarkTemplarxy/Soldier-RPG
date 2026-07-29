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
  if(S.rang>=3 && S.rang<5){
    a.push({id:'salve',label:'Der Korporalschaft Salve befehlen',
      cost:'Autorität · acht Musketen auf einmal — mehr als du allein triffst, und deine bleibt geladen'});
    a.push({id:'luecke',label:'Die Lücke links schließen lassen',
      cost:'Drill · eure Linie verliert weniger Männer · Ruf, wenn es gelingt'});
  }
  /* Ab Rang 5 führt man keine acht Mann mehr, sondern zwanzig — und die
     Knöpfe wechseln vollständig. Das ist der Maßstabswechsel aus KONZEPT §3:
     Nicht größere Zahlen, ein anderes Spiel. Der Caporal befiehlt eine Salve;
     der Sergent verwaltet eine Sektion, die dabei aufgebraucht wird. */
  /* Ab Rang 6 führt man nicht mehr zwanzig Mann, sondern die, die zwanzig Mann
     führen. Der Zug ist bewusst **schlank** gehalten — zwei Knöpfe, nicht vier:
     Der Sergent-major greift seltener selbst ein, er lässt eingreifen. Genau
     das ist der Unterschied, und mehr Knöpfe würden ihn verwischen. */
  if(S.rang>=6){
    a.push({id:'zugfeuer',label:'Feuer nach Sektionen',
      cost:'Drill · rollendes Feuer · der Zug schießt auch, während du nachlädst'});
    a.push({id:'einteilen',label:'Die Sergenten einteilen',
      cost:'Autorität · drei Runden halbe Verluste im ganzen Zug'});
  }
  if(S.rang===5){
    a.push({id:'sektionsalve',label:'Salve auf Kommando',
      cost:'Autorität · zwanzig Musketen auf einen Schlag · deine bleibt geladen'});
    a.push({id:'glieder',label:'Die Glieder wechseln lassen',
      cost:'Drill · frische Männer nach vorn · eure Verluste sinken drei Runden'});
    a.push({id:'herausnehmen',label:'Den Wankenden aus dem Glied ziehen',
      cost:'Menschenkenntnis · einer läuft gleich · du stehst dabei im Freien',risk:true});
    a.push({id:'halten_sektion',label:'Schließen und halten lassen',
      cost:'Drill · die ganze Sektion · Ruf beim ersten Mal'});
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
  /* **Der Lieutenant führt die Liste der Namen.** Das ist die einzige Quelle
     für seine Fürsprache, die schon einem Füsilier offensteht — und sie muss
     es sein: Ohne sie hing der Sergent an Handlungen, die es erst ab Rang 4
     gibt (Henne und Ei, gemessen mit 0 % Sergenten in 120 Läufen). Einmal je
     Gefecht, damit sie sich nicht einsammeln lässt; wer zehn Gefechte lang
     auffällt, kommt genau auf die vier, die der Feldweg verlangt. */
  /* Sichtbar gemacht, wenn es passiert: Bis dahin stand nur „gesehen · Ruf +1"
     da, und der Spieler erfuhr erst bei der Musterung, dass der Lieutenant eine
     Liste führt („Er geht die Liste durch. Bei dir hält er nicht an."). Die
     Ursache gehört an den Ort der Wirkung — sonst wirkt die Fürsprache wie
     eine Zahl, die von allein wächst, statt wie das, was sie ist: Er hat
     zugesehen. Nur beim ersten Mal je Gefecht, weil sie nur einmal steigt. */
  let notiert = '';
  if(!K.offizierGesehen){
    K.offizierGesehen = true; gunstGeben('berthaud', 1);
    notiert = ` · <span class="fein">${esc(personKurz('berthaud'))} schreibt deinen Namen auf</span>`;
  }
  K.taten.push({was, ruf:gibt});
  if(K.zaehlung) K.zaehlung.ereignisse++;
  return ` <span class="fein">gesehen · Ruf +${gibt}</span>${notiert}`;
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
    /* „Mehr Patronen und zwei Tage Proviant": Der verstärkte Tornister halbiert,
       was der Anmarsch an Luft kostet. Bis dahin war er der einzige Kauf im
       Laden ohne jede Wirkung — 24 Veteranenpunkte für eine Zahl, die niemand
       abfragte. Wer bei Akkon 8 Atem verliert statt 4, merkt den Unterschied. */
    const tornister = S.kaeufe.includes('tornister_gut') ? 0.5 : 1;
    S.atem = Math.max(0, S.atem - Math.round(ak.atem*tornister));
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
              /* Was dieses Gefecht an Sichtbarem hervorgebracht hat. `taten` sind
                 die Ruf-Ereignisse (Text), `zaehlung` sind die Zahlen dahinter. */
              zaehlung:{schaden:0, serie:0, bestSerie:0, ereignisse:0, vorn:false, gedeckt:0, offen:0},
              ereignis:null, ereignisZahl:0, gesehen:[], gefahrPlus:0, duckFolge:0,
              sektion:100, sektionStart:100, sektionGelobt:false, offizierGesehen:false, blitz:false,
              rollend:0,
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

/* ── Gelände ──
   Ohne das sieht jedes Gefecht gleich aus: zwei Linien in einer Ebene. Ein
   Feld `gelaende` in den Kapiteldaten legt eine Silhouette dahinter, und man
   erkennt das Gefecht am Bild, bevor man den Namen liest. Alles in den
   vorhandenen Brauntönen, alles deterministisch — hier wird nie gewürfelt. */
function gelaendeBild(art){
  if(art==='bruecke') return `
    <rect x="0" y="150" width="640" height="50" fill="${STICH.WASSER}"/>
    <rect x="0" y="150" width="640" height="2" fill="${STICH.WASSER_LI}"/>
    <rect x="150" y="120" width="340" height="34" fill="${STICH.HOLZ}"/>
    <rect x="150" y="118" width="340" height="4" fill="${STICH.HOLZ_HELL}"/>
    ${[0,1,2,3,4,5,6,7,8].map(i=>`<rect x="${152+i*42}" y="100" width="3" height="20" fill="${STICH.HOLZ_HELL}"/>`).join('')}
    <rect x="150" y="100" width="340" height="3" fill="${STICH.HOLZ_HELL}"/>`;
  if(art==='damm') return `
    <rect x="0" y="128" width="640" height="72" fill="${STICH.SCHILF_D}"/>
    <rect x="0" y="140" width="640" height="46" fill="${STICH.SCHILF_M}"/>
    <rect x="0" y="120" width="640" height="26" fill="${STICH.SCHILF_H}"/>
    ${[40,120,300,470,560].map((x,i)=>`<ellipse cx="${x}" cy="${168+i*4}" rx="${22+i*6}" ry="3" fill="${STICH.BUSCH}" opacity=".6"/>`).join('')}
    ${[70,210,420,540].map(x=>`<rect x="${x}" y="150" width="2" height="14" fill="${STICH.HALM}"/>`).join('')}`;
  if(art==='mauer') return `
    <rect x="0" y="0" width="640" height="92" fill="${STICH.HIMMEL}"/>
    <rect x="0" y="24" width="640" height="68" fill="${STICH.MAUER}"/>
    <rect x="0" y="24" width="640" height="3" fill="${STICH.MAUER_FUGE}08"/>
    ${Array.from({length:22},(_,i)=>`<rect x="${i*30}" y="24" width="26" height="9" fill="${STICH.MAUER_STEIN}" opacity="${i%2?.5:.75}"/>`).join('')}
    <path d="M250 92 L272 34 L300 26 L340 30 L368 40 L392 92 Z" fill="${STICH.HIMMEL}"/>
    <path d="M250 92 L272 34 L300 26 L340 30 L368 40 L392 92" fill="none" stroke="${STICH.BRESCHE_K}" stroke-width="1.5"/>
    ${[[262,78],[300,84],[352,80],[380,88]].map(([x,y])=>`<rect x="${x}" y="${y}" width="12" height="5" rx="2" fill="${STICH.BRESCHE_S}"/>`).join('')}`;
  if(art==='wueste') return `
    <rect x="0" y="0" width="640" height="200" fill="${STICH.SAND}"/>
    <path d="M470 84 L520 22 L570 84 Z" fill="${STICH.PYRAMIDE}"/>
    <path d="M556 84 L592 40 L628 84 Z" fill="${STICH.PYRAMIDE_2}"/>
    ${[40,92,140].map((x,i)=>`<g fill="${STICH.PALME}"><rect x="${x+5}" y="${44-i*3}" width="2.5" height="40"/>
      ${[-1,1].map(d=>`<ellipse cx="${x+5+d*9}" cy="${44-i*3}" rx="10" ry="3" transform="rotate(${d*18} ${x+5} ${44-i*3})"/>`).join('')}</g>`).join('')}
    <rect x="0" y="84" width="640" height="116" fill="${STICH.SAND_UNTEN}"/>`;
  return '';
}

/* ══════════════════ DIE PALETTE DES SICHTFELDS ══════════════════

   Jede Farbe des Gefechtsbildes steht hier und nirgends sonst. Vorher lagen
   vierundvierzig Hexwerte über die Zeichenfunktionen verstreut — ein
   Farbwechsel hieß vierundvierzig Einzelfunde, und genau daran scheitert jeder
   Umbau der Gestaltung.

   **Die Namen sind Rollen, keine Farben.** `WASSER` bleibt `WASSER`, ob es
   nachtschwarz oder als Sepialavierung gezeichnet wird — deshalb überlebt diese
   Tabelle den Wechsel von der Nacht zum Kupferstich. */
const STICH = {
  /* ── Kupferstich statt Nacht (28.07.2026) ──
     Gefechtsdarstellungen der Epoche *sind* Stiche und lavierte Skizzen: Sepia
     auf Papier, die Truppen koloriert. Das Sichtfeld ist damit kein Fenster in
     eine dunkle Welt mehr, sondern **die Schlachtskizze auf dem Feldtisch** —
     dieselbe Metapher wie die ganze Oberfläche.

     Praktischer Nebeneffekt: Pulverdampf als graue Lavierung auf hellem Grund
     funktioniert besser als heller Nebel auf dunklem. */
  PAPIER:   '#e4d9bd',   /* der Bogen, auf dem die Skizze steht */
  HIMMEL:   '#e4d9bd',   GRUND:     '#cbbb95',   HORIZONT:  '#8a7a58',
  WASSER:   '#aeb5ab',   WASSER_LI: '#93a09b',
  HOLZ:     '#a68a5e',   HOLZ_HELL: '#8c6f45',
  SCHILF_D: '#b3ae86',   SCHILF_M:  '#c0ba91',   SCHILF_H:  '#cbbb95',
  BUSCH:    '#9aa177',   HALM:      '#7d8759',
  MAUER:    '#c3b491',   MAUER_FUGE:'#8a7a58',   MAUER_STEIN:'#b0a081',
  BRESCHE:  '#7a6b4c',   BRESCHE_K: '#6b5c3f',   BRESCHE_S: '#8a7a58',
  SAND:     '#ddd0ac',   SAND_UNTEN:'#d3c49f',
  PYRAMIDE: '#c4b48e',   PYRAMIDE_2:'#b8a882',   PALME:     '#7d6f4c',
  ZINNE:    '#9d8d6b',   ZINNE_ROT: '#a8503f',

  /* Die drei kolorierten Farben — wie auf einer Uniformtafel. Rot und Blau
     müssen auf dem hellen Bogen kräftiger sein als auf der Nacht, sonst
     verschwinden sie im Papier. */
  ROT:      '#9c3125',   ROT_TOT:   '#c39a90',
  BLAU:     '#27415f',   BLAU_TOT:  '#9aa8b8',   BLAU_WAAGE:'#27415f',
  MESSING:  '#8a6410',   /* du selbst — Bronze, dunkel genug fürs Papier */

  WANKEND:  '#7a6a52',   WAAGE:     '#6d5f4b',   BESCHRIFT: '#584c3c',
  BLITZ:    '#c8901f',   BLITZ_HOF: '#d8b060',

  /* Pulverdampf: graue Lavierung, wie mit dem Pinsel über den Stich gelegt */
  DAMPF:    '#6f6754',   DAMPF_BAND:'#8a8271',   DAMPF_RAND:'#e4d9bd',
  DUNKEL:   '#3a3020'    /* die Vignette am Rand des Bogens */
};


/* ── Das Appell-Bild ──
   Die Abrechnung des Sergenten als Bild statt als Zahl: zwanzig Silhouetten,
   die Gefallenen liegend. Dieselbe Information wie „von zwanzig stehen
   vierzehn", aber man sieht die sechs. */
/* Der Appell als Bild: Wer steht, steht; wer fehlt, liegt. Ab Rang 6 sind es
   sechzig statt zwanzig — dann in drei Reihen zu zwanzig, damit die Figuren
   nicht auf Strichbreite schrumpfen, und mit einer Lücke zwischen den Reihen:
   Es sind **drei Sektionen**, nicht sechzig Einzelne. */
function appellBild(uebrig, kopf){
  kopf = kopf || 20;
  const proReihe = 20, reihen = Math.ceil(kopf/proReihe);
  const R = [];
  for(let i=0;i<kopf;i++){
    const reihe = Math.floor(i/proReihe), spalte = i%proReihe;
    const x = 16 + spalte*26, y = reihe*34;
    R.push(i < uebrig
      ? `<g fill="${STICH.ZINNE}" transform="translate(0 ${y})"><rect x="${x-3}" y="14" width="6" height="18" rx="2.4"/><circle cx="${x}" cy="10" r="2.6"/>
         <ellipse cx="${x}" cy="7" rx="5.4" ry="2" transform="rotate(-7 ${x} 7)"/></g>`
      : `<rect x="${x-7}" y="${30+y}" width="14" height="2.6" rx="1.3" fill="${STICH.ZINNE_ROT}" opacity=".8"/>`);
  }
  return `<svg viewBox="0 0 540 ${40+(reihen-1)*34}" class="appell" role="img" aria-label="Appell: ${uebrig} von ${kopf} stehen">${R.join('')}</svg>`;
}

function sichtfeld(){
  const n = KAPITEL[LAUF.node], zw = S.zweig;
  const rauch = Math.min(1, K.runde/6);
  const feindTeil = Math.max(0, Math.min(1, K.feindMoral / n.feindMoral));
  const eigenTeil = Math.max(0, Math.min(1, (K.eigen==null?100:K.eigen) / 100));
  const karree = n.formation === 'karree';

  const streu = (i,a)=>{ const x = Math.sin(i*127.1 + a*311.7)*43758.5453; return x - Math.floor(x); };
  const gefallene = (anz,steht,a)=> new Set(
    Array.from({length:anz},(_,i)=>i).sort((p,q)=>streu(p,a)-streu(q,a)).slice(0, anz-steht));

  /* Geschlossene Ordnung: Die Glieder stehen um eine halbe Teilung versetzt,
     sodass das hintere Glied die Lücken des vorderen füllt — zusammen ergibt
     das die dichte Wand, die eine Linie ausmacht. */
  const FEIND_JE = 15, EIGEN_JE = 20, PLAENKLER = 5;
  const FEIND = FEIND_JE*2, EIGEN = EIGEN_JE*2;
  const feindWeg = gefallene(FEIND, Math.round(FEIND*feindTeil), 7);
  const eigenWeg = gefallene(EIGEN, Math.round(EIGEN*eigenTeil), 13);

  const ROT = STICH.ROT, ROT_TOT = STICH.ROT_TOT, BLAU = STICH.BLAU, BLAU_TOT = STICH.BLAU_TOT;
  const MESSING = STICH.MESSING;

  const kopfbedeckung = (x,y,b,f,art)=>{
    if(art==='baer') return `<rect x="${(x-4.6*b).toFixed(1)}" y="${(y-15.5*b).toFixed(1)}" width="${(9.2*b).toFixed(1)}" height="${(11*b).toFixed(1)}" rx="${(4.4*b).toFixed(1)}"/>`+
      `<rect x="${(x+2.6*b).toFixed(1)}" y="${(y-19*b).toFixed(1)}" width="${(1.8*b).toFixed(1)}" height="${(5*b).toFixed(1)}" rx="${(0.9*b).toFixed(1)}" fill="${STICH.ROT}"/>`;
    if(art==='kasket') return `<ellipse cx="${x.toFixed(1)}" cy="${(y-8.4*b).toFixed(1)}" rx="${(4.4*b).toFixed(1)}" ry="${(3.4*b).toFixed(1)}"/>`;
    if(art==='turban') return `<ellipse cx="${x.toFixed(1)}" cy="${(y-8.8*b).toFixed(1)}" rx="${(5.4*b).toFixed(1)}" ry="${(4.4*b).toFixed(1)}"/>`;
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
  // Mamlukenreiter: Pferdeleib, Reiter darüber, Säbel schräg
  const reiter = (x,y,o)=>`<g fill="${ROT}" opacity="${o}">
    <rect x="${x-13}" y="${y}" width="26" height="9" rx="4"/>
    <rect x="${x-10}" y="${y+8}" width="2.4" height="9"/><rect x="${x+8}" y="${y+8}" width="2.4" height="9"/>
    <rect x="${x+11}" y="${y-5}" width="7" height="6" rx="2.4"/>
    <rect x="${x-3}" y="${y-13}" width="6.4" height="14" rx="2.6"/><circle cx="${x}" cy="${y-16}" r="2.8"/>
    <ellipse cx="${x}" cy="${y-19}" rx="4.6" ry="3.6"/>
    <rect x="${x+3}" y="${y-24}" width="1.6" height="13" rx=".8" transform="rotate(28 ${x+3} ${y-24})" opacity=".7"/></g>`;

  const masse = (y,h,f,o)=>`<rect x="0" y="${(y+h*0.3).toFixed(0)}" width="640" height="${(h*0.7).toFixed(0)}" fill="${f}" opacity="${o}"/>`;

  /* ── Der Feind ── */
  let feind = '';
  if(karree){
    // Mamluken umreiten das Karree: keine Ordnung, Reiter statt Glieder
    for(let i=0;i<7;i++){
      const idx = i, x = 46 + i*88 + (streu(i,3)-0.5)*30, y = 40 + streu(i,11)*26;
      if(i/7 > feindTeil) { feind += toter(x, y+16, ROT_TOT); continue; }
      feind += reiter(x, y, 0.55 + streu(i,19)*0.4);
    }
  } else {
    feind = masse(48, 15, ROT, .08) + masse(56, 15, ROT, .06);
    const feindHut = (n.gelaende==='mauer'||n.gelaende==='wueste') ? 'turban' : 'kasket';
    for(let g=0;g<2;g++) for(let i=0;i<FEIND_JE;i++){
      const idx = g*FEIND_JE+i, schritt = 640/FEIND_JE;
      const x = 14 + i*schritt + g*schritt/2, y = 48 + g*8;
      feind += feindWeg.has(idx) ? toter(x, y+15, ROT_TOT) : mann(x, y, 15, ROT, g ? 0.5 : 0.9, feindHut);
    }
  }

  /* ── Deine Leute ──
     **Der Rang bestimmt, was hell ist.** Ein Füsilier sieht eine Linie; ein
     Caporal sieht seine acht heller als den Rest; ein Sergent steht *hinter*
     dem Glied (dort stand der serre-file), und vor ihm stehen seine zwanzig
     als eigener Block, während die übrige Linie in den Rändern verschwindet.
     Man sieht, was man verantwortet — und man sieht, wie viel davon liegt. */
  const meinX = 320;
  const meinHut = S.zweig==='grenadier' ? 'baer' : 'zwei';
  const fuehrt = S.rang>=5 ? 'sektion' : (S.rang>=3 ? 'korporalschaft' : null);
  const meineBreite = fuehrt==='sektion' ? 5 : (fuehrt==='korporalschaft' ? 2 : 0);   // Plätze je Seite
  const schritt = 640/EIGEN_JE;
  const meinPlatz = Math.round((meinX-8)/schritt);
  const meins = i => meineBreite>0 && Math.abs(i-meinPlatz) <= meineBreite;

  // Anteil der eigenen Sektion, der noch steht (nur ab Rang 5)
  const sektTeil = (fuehrt==='sektion' && K.sektion!=null) ? Math.max(0,Math.min(1,K.sektion/100)) : 1;
  const sektWeg = gefallene(EIGEN_JE, Math.round(EIGEN_JE*sektTeil), 23);

  const meinGlied = fuehrt==='sektion' ? -1 : 1;    // der Sergent steht dahinter
  let eigen = masse(130, 22, BLAU, .07) + masse(146, 26, BLAU, .10);

  if(karree){
    /* Das Karree von innen: vordere Front quer, zwei Flanken schräg nach
       hinten. Du stehst im Inneren — deshalb siehst du deine Leute von hinten. */
    for(let i=0;i<14;i++){
      const x = 60 + i*38, y = 128;
      eigen += eigenWeg.has(i) ? toter(x, y+24, BLAU_TOT) : mann(x, y, 24, BLAU, meins(i)?1:0.55, meinHut);
    }
    for(let i=0;i<4;i++){
      const l = 30 - i*4, r = 610 + i*4, y = 150 + i*12;
      eigen += mann(l, y, 22-i*2, BLAU, .4, meinHut) + mann(r, y, 22-i*2, BLAU, .4, meinHut);
    }
  } else {
    for(let g=0;g<2;g++) for(let i=0;i<EIGEN_JE;i++){
      const idx = g*EIGEN_JE+i;
      const x = 8 + i*schritt + (g?0:schritt/2), y = g ? 146 : 130, h = g ? 26 : 22;
      if(zw!=='voltigeur' && g===meinGlied && Math.abs(x-meinX)<schritt*0.6) continue;   // dein Platz
      const meiner = meins(i);
      // Ab Sergent zählt die Sektion getrennt: deine Leute fallen nach K.sektion
      const gefallen = meiner && fuehrt==='sektion' ? sektWeg.has(i) : eigenWeg.has(idx);
      const deckkraft = meineBreite>0 ? (meiner ? (g?1:0.75) : (g?0.42:0.26)) : (g?1:0.6);
      eigen += gefallen ? toter(x, y+h, BLAU_TOT) : mann(x, y, h, BLAU, deckkraft, meinHut);
    }
  }

  /* Der Wankende: Sinkt die Sektion, tritt einer sichtbar einen halben Schritt
     aus dem Glied — der Knopf „Den Wankenden herausziehen" zeigt dann auf
     etwas, das man sieht. */
  let wankend = '';
  if(fuehrt==='sektion' && sektTeil < 0.7){
    const wx = 8 + (meinPlatz-3)*schritt + schritt/2;
    wankend = mann(wx, 168, 24, STICH.WANKEND, .95, meinHut) +
      `<text x="${wx}" y="196" text-anchor="middle" fill="${STICH.WANKEND}" font-size="8.5"
        font-family="ui-monospace,monospace" letter-spacing=".5">WANKT</text>`;
  }

  // Voltigeure schwärmen aus: wenige, weit auseinander, ohne Ordnung
  let plaenkler = '';
  if(zw==='voltigeur') for(let i=0;i<PLAENKLER;i++){
    const x = 90 + i*(460/(PLAENKLER-1)) + (streu(i,5)-0.5)*48;
    if(Math.abs(x-meinX)<34) continue;
    plaenkler += mann(x, 92 + streu(i,9)*16, 20, BLAU, 0.85, 'zwei');
  }

  /* Der Fanion markiert deinen Abschnitt — ab Caporal die acht, ab Sergent die
     zwanzig. Eine Messinglinie über deinen Leuten, mehr braucht es nicht. */
  let fanion = '';
  if(meineBreite>0 && !karree){
    const l = 8 + (meinPlatz-meineBreite)*schritt, r = 8 + (meinPlatz+meineBreite)*schritt;
    fanion = `<rect x="${l.toFixed(0)}" y="118" width="${(r-l).toFixed(0)}" height="1.4" fill="${MESSING}" opacity=".5"/>
      <rect x="${(meinX-0.8).toFixed(0)}" y="104" width="1.6" height="15" fill="${MESSING}" opacity=".7"/>
      <path d="M${meinX+1} 104 L${meinX+17} 108 L${meinX+1} 112 Z" fill="${MESSING}" opacity=".8"/>
      <text x="${l.toFixed(0)}" y="114" fill="${MESSING}" font-size="8.5" opacity=".75"
        font-family="ui-monospace,monospace" letter-spacing=".6">${S.rang>=6 ? 'DEIN ZUG · '+Math.max(0,Math.round((K.sektion==null?100:K.sektion)*0.6))+' VON 60'
        : fuehrt==='sektion'
          ? 'DEINE SEKTION · '+Math.max(0,Math.round((K.sektion==null?100:K.sektion)/5))+' VON 20'
          : 'DEINE KORPORALSCHAFT'}</text>`;
  }

  // Du, dort wo du hingehörst
  let meinY = zw==='voltigeur' ? 100 : (fuehrt==='sektion' ? 172 : 146);
  let meinH = zw==='voltigeur' ? 20 : (fuehrt==='sektion' ? 25 : 26);
  if(karree){ meinY = 160; meinH = 25; }
  if(K.vorn){ meinY = 86; meinH = 18; }             // mit dem Bajonett vorgegangen
  if(K.deckung){ meinY += meinH-10; meinH = 10; }   // kniend oder liegend

  /* Mündungsblitze nach einer Salve — zustandsgesteuert über die letzte
     Aktion, nicht gewürfelt (siehe die Regel unten). */
  let blitze = '';
  if(K.blitz){
    const von = fuehrt ? meinPlatz-meineBreite : 0, bis = fuehrt ? meinPlatz+meineBreite : EIGEN_JE-1;
    for(let i=Math.max(0,von); i<=Math.min(EIGEN_JE-1,bis); i++){
      const x = 8 + i*schritt, y = 132;
      blitze += `<ellipse cx="${x.toFixed(0)}" cy="${y}" rx="7" ry="3.4" fill="${STICH.BLITZ}" opacity=".55"/>
                 <ellipse cx="${x.toFixed(0)}" cy="${y}" rx="15" ry="6" fill="${STICH.BLITZ_HOF}" opacity=".18"/>`;
    }
  }

  /* Pulverdampf steht zwischen den Linien und wird mit jeder Runde dichter —
     feste Plätze, nur die Zahl wächst. */
  let qualm = '';
  for(let i=0;i<Math.round(3+9*rauch);i++){
    const x = 40 + streu(i,17)*560, y = 86 + streu(i,23)*32;
    const r = 16 + streu(i,29)*28;
    qualm += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${r.toFixed(0)}" ry="${(r*0.42).toFixed(0)}"`+
             ` fill="${STICH.DAMPF}" opacity="${(0.10+0.12*streu(i,31)).toFixed(2)}"/>`;
  }
  // Ab Runde 5 legt sich der Dampf über das hintere Feindglied — die
  // Unsicherheit, von der die Texte reden, wird sichtbar.
  const schleier = K.runde>=5
    ? `<rect x="0" y="40" width="640" height="34" fill="${STICH.DAMPF_BAND}" opacity="${Math.min(0.5,(K.runde-4)*0.12).toFixed(2)}"/>` : '';

  const uebergewicht = eigenTeil + feindTeil > 0 ? eigenTeil/(eigenTeil+feindTeil) : 0.5;
  const lage = K.deckung
    ? (zw==='voltigeur'?'Du liegst. Über dir geht es hinweg.':'Du kniest. Über dir geht es hinweg.')
    : (K.vorn ? 'Du bist zehn Schritt vor der Linie.'
      : (fuehrt==='sektion' ? 'Du stehst hinter dem Glied. Von hier siehst du, wer fehlt.'
        : (karree ? 'Vier Fronten, kein Rücken. Innen ist es eng.'
          : 'Rauch. Du siehst keine dreißig Schritt weit.')));

  return `<svg viewBox="0 0 640 200" role="img"
    aria-label="Aufstellung: ${Math.round(EIGEN*eigenTeil)} eigene Männer gegen ${Math.round(FEIND*feindTeil)} feindliche">
    <defs>
      <linearGradient id="sm" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${STICH.DAMPF_RAND}" stop-opacity="0"/>
        <stop offset="45%" stop-color="${STICH.DAMPF_BAND}" stop-opacity="${(0.35+0.4*rauch).toFixed(2)}"/>
        <stop offset="100%" stop-color="${STICH.DAMPF_RAND}" stop-opacity="0"/></linearGradient>
      <radialGradient id="vg" cx="50%" cy="88%" r="62%">
        <stop offset="0%" stop-color="${STICH.DUNKEL}" stop-opacity="0"/>
        <stop offset="100%" stop-color="${STICH.DUNKEL}" stop-opacity=".7"/></radialGradient>
    </defs>
    <rect width="640" height="200" fill="${STICH.HIMMEL}"/>
    ${gelaendeBild(n.gelaende)}
    <rect x="0" y="84" width="640" height="1" fill="${STICH.HORIZONT}"/>
    ${feind}${schleier}
    <rect x="0" y="66" width="640" height="74" fill="url(#sm)"/>
    ${qualm}
    <text x="320" y="26" text-anchor="middle" fill="${STICH.BESCHRIFT}" font-family="Georgia,serif" font-size="11.5"
      font-style="italic">${lage}</text>
    ${plaenkler}${fanion}${eigen}${wankend}${blitze}
    ${mann(meinX, meinY, meinH, MESSING, 1, meinHut, !K.deckung)}
    <text x="${meinX}" y="${meinY < 130 ? (meinY-13).toFixed(0) : (meinY+meinH+11).toFixed(0)}"
      text-anchor="middle" fill="${MESSING}" font-size="9.5"
      font-family="ui-monospace,monospace" letter-spacing="1">DU</text>
    <rect x="0" y="192" width="640" height="4" fill="${ROT_TOT}"/>
    <rect x="0" y="192" width="${(640*uebergewicht).toFixed(0)}" height="4" fill="${STICH.BLAU_WAAGE}"/>
    <rect x="319" y="189" width="2" height="10" fill="${STICH.WAAGE}"/>
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

  /* ── Sondermission Austerlitz: der Pratzeberg ──
     Der Moment, für den die Schlacht berühmt ist, aus der Höhe eines Mannes im
     ersten Treffen: Man geht im Nebel bergauf gegen eine Höhe, von der man
     nicht weiß, wie stark sie besetzt ist, und über einem reißt es auf.

     Drei Stufen, wie Akkon und Lodi — und wie dort kostet jeder Fehlschlag
     sofort Blut. Die letzte Stufe ist nicht der Aufstieg, sondern das
     **Halten**: Der Berg wird zweimal genommen, und beim zweiten Mal kommt die
     russische Garde. */
  {id:'pratzen', nur:'austerlitz', frage:'Der Nebel reißt',
   wenn:(n)=> K.runde <= 4 && K.feindMoral > n.feindMoral*0.45,
   text:['Vor euch steigt der Hang an, und im Nebel sieht man dreißig Schritt weit. Irgendwo darüber steht der Pratzeberg, und niemand weiß, was oben noch steht, seit sie heruntergegangen sind.',
         'Der Divisionsgeneral lässt aufschließen und sagt einen Satz, der die Runde macht: Ein scharfer Schlag, und der Krieg ist zu Ende. Dann geht die Kolonne an, ohne einen Schuss abzugeben, das Gewehr geschultert, weil Schießen im Nebel nur zeigt, wo man ist.'],
   optionen:[
     {label:'Mit hinauf, ohne zu schießen', hint:'Drei Stufen · der Hang, die Höhe, der Gegenstoß', risk:true,
      kette:[
        {name:'Der Hang', wert:'konstitution', schw:40, schaden:13,
         gut:'Gefrorener Acker, zweihundert Meter Steigung, und über euch wird es hell, während unten der Nebel steht. Auf halber Höhe geht der erste Zug hinein, und ihr geht durch, ohne zu halten.',
         schlecht:'Auf halber Höhe kommt Kartätschfeuer aus einer Richtung, in der nichts stehen sollte. Die Reihe vor dir bricht ein, und du gehst über Männer, die du am Morgen noch beim Namen gerufen hast.'},
        {name:'Die Höhe', wert:'bajonett', schw:45, schaden:15,
         gut:'Oben stehen zwei österreichische Bataillone, die nicht damit gerechnet haben, dass jemand aus dem Nebel kommt. Es dauert vier Minuten, und dann gehört euch der Berg.',
         schlecht:'Oben steht mehr, als unten jemand gedacht hat. Es wird eine Sache auf zehn Schritt, und wer dabei stehen bleibt, hat Glück gehabt und sonst nichts.'},
        {name:'Der Gegenstoß', wert:'kaltbluetigkeit', schw:45, schaden:16,
         gut:'Gegen elf kommt die russische Garde den Berg herauf, in geschlossener Ordnung und ohne zu schießen, so wie ihr vor zwei Stunden. Ihr steht, wo ihr steht, und lasst sie auf sechzig Schritt herankommen, und dann fällt das Kommando.',
         schlecht:'Die Garde kommt herauf, und die Linie links von euch weicht. Für zehn Minuten ist der Berg wieder offen, und du bist einer von denen, die in dieser Zeit nicht weglaufen, ohne genau zu wissen, warum.'}],
      tod:'Auf dem gefrorenen Acker des Pratzebergs, dreißig Schritt unterhalb der Kuppe, in einem Nebel, der sich eine Stunde später auflöst.',
      todesart:'Gefallen auf dem Pratzeberg',
      erfolg:{text:'Um Mittag steht ihr oben und schießt nach beiden Seiten den Hang hinunter. Von hier sieht man, was der Plan war: eine Armee, in zwei Hälften geteilt, die einander nicht mehr erreichen. Der Divisionsgeneral reitet die Linie ab und lässt sich die Namen der Kompanien geben, die zuerst oben waren.',
              moral:-30, ruf:8, nennung:true, atem:-22, belastung:8,
              tat:'Auf dem Pratzeberg gestanden'},
      misserfolg:{text:'Der Berg wird genommen, und ihr seid dabei gewesen. Was von deinem Zug oben ankommt, ist die Hälfte, und die steht nicht mehr besonders gerade. Es zählt trotzdem: Oben war, wer oben war.',
              moral:-14, ruf:3, atem:-22, belastung:12,
              tat:'Den Pratzeberg mit hinaufgegangen'}},
     {label:'In der zweiten Welle nachrücken', hint:'Es geht auch ohne dich in der ersten Reihe',
      erfolg:{text:'Du gehst mit dem zweiten Treffen, zweihundert Schritt hinter der Spitze. Als ihr oben ankommt, ist es entschieden, und man muss nur noch stehen, wo man hingestellt wird. Das ist keine Schande und wird auch nicht als eine behandelt.',
              moral:-8, atem:-10}}
   ]},


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

  {id:'fahne', frage:'Der Fahnenträger fällt',
   wenn:(n)=> K.eigen < 85 && K.feindMoral > n.feindMoral*0.25,
   text:['Der Träger geht nach vorn weg, ohne Zwischenschritt, wie ein Sack. Die Fahnenstange kippt und bleibt schräg im Dreck stehen, sechs Schritt vor der Linie, wo niemand steht.',
         'Eine Fahne, die die anderen mitnehmen, ist das Ende einer Halbbrigade. Alle sehen hin, und keiner geht.'],
   optionen:[
     {label:'Ihn holen', hint:'Kaltblütigkeit · sechs Schritt ins Freie', risk:true,
      probe:{wert:'kaltbluetigkeit', schw:50},
      erfolg:{text:'Sechs Schritte hin, der Schaft ist warm und klebrig, sechs Schritte zurück. Es geht schneller, als du dachtest. Die Linie brüllt, als du wieder drin stehst, und brüllt weiter, als es längst nichts mehr zu brüllen gibt.',
              moral:-14, ruf:6, nennung:true, eigen:8, leben:-6, atem:-12, gefahr:5,
              tat:'Die Fahne aus dem Dreck geholt'},
      misserfolg:{text:'Du kommst bis auf zwei Schritte heran. Was dich trifft, wirft dich über den Schaft, und du liegst mit dem Gesicht in derselben Pfütze wie der Träger. Jemand zieht dich am Kragen zurück; die Fahne holt ein anderer.',
              leben:-30, atem:-20, belastung:12}},
     {label:'Weiterladen', hint:'Es ist ein Stück Tuch an einem Stock',
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
      ? ' · ' + o.kette.map(st=>NAMEN[st.wert]+' '+wert(st.wert)+' gegen '+st.schw+' · '+aussicht(st.wert,st.schw)+'%').join(' · ')
      : (o.probe ? ' · '+NAMEN[o.probe.wert]+' '+wert(o.probe.wert)+' gegen '+o.probe.schw+' · '+aussicht(o.probe.wert,o.probe.schw)+'%' : '');
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
  if(w.gunst) gunstGeben(w.gunstVon || 'martel', w.gunst);
  if(w.ruf) S.ruf = Math.max(0, S.ruf + w.ruf);
  if(w.nennung) S.nennungen++;
  if(w.vorn) K.vorn = true;
  if(w.tat && w.ruf > 0) K.taten.push({was:w.tat, ruf:w.ruf});
  atemKlemmen();
}

function ereignisWaehlen(i){
  const n = KAPITEL[LAUF.node];
  const e = GEFECHTS_EREIGNISSE.find(x=>x.id===K.ereignis);
  if(!e){ K.ereignis = null; zeigeKampf('Das Gefecht geht weiter.'); return; }
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
        gefallen(zeilen.join(' ') + ' ' + (o.tod||''),
                 o.todesart || ('Gefallen bei '+n.datum.split(' · ')[1]));
        return;
      }
    }
    w = (treffer*2 > o.kette.length) ? o.erfolg : (o.misserfolg || o.erfolg);
    /* **Voll bestanden** heißt: jede Stufe gelungen, nicht die Mehrheit. Das
       ist die Bedingung des Ehrensäbels und die einzige Stelle im Spiel, an der
       ein Orden an einer einzelnen, benannten Tat hängt statt an einer Summe.
       Wer durch die Bresche von Akkon gegangen ist, ohne einmal zu straucheln,
       soll nicht dasselbe bekommen wie einer, der dreimal aufgefallen ist. */
    if(treffer === o.kette.length){ S.sondermissionen = (S.sondermissionen|0) + 1; K.kette = true; }
    text = zeilen.join(' ') + '<br><br>' + w.text;
  } else {
    const p = o.probe ? probe(o.probe.wert, o.probe.schw) : {erfolg:true};
    w = p.erfolg ? o.erfolg : (o.misserfolg || o.erfolg);
    text = w.text;
    K.protokoll.push(esc(o.label) + (o.probe ? (p.erfolg?' — gelungen':' — misslungen') : ''));
  }
  ereignisWirkung(w);
  /* Eine Ereignisrunde ist eine Runde: Wer vorgetreten ist, hat nicht gekniet.
     Ohne diesen Reset galt „dritte Runde auf dem Knie" (Ruf −2) auch für einen
     Mann, der dazwischen mit dem Bajonett vorgegangen war. `deckung` fällt aus
     demselben Grund — sonst zeigt das Sichtfeld ihn weiter kniend. */
  K.duckFolge = 0; K.deckung = false;

  if(S.leben <= 0){
    gefallen(text + ' Du setzt dich hin, weil du nicht anders kannst, und stehst nicht wieder auf.',
             'Gefallen bei '+n.datum.split(' · ')[1]);
    return;
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
          · EURE LINIE ${Math.max(0,Math.round(K.eigen==null?100:K.eigen))}
          ${S.rang>=6 && K.sektion!=null ? '· DEIN ZUG '+Math.max(0,Math.round(K.sektion*0.6))+' VON 60'+(K.rollend>0?' · ROLLENDES FEUER':'')
            : S.rang===5 && K.sektion!=null ? '· DEINE SEKTION '+Math.max(0,Math.round(K.sektion/5))+' VON 20' : ''}</div>
        ${balken('b-red',Math.max(0,K.feindMoral),n.feindMoral)}
        ${S.rang>=5 && K.sektion!=null ? balken('b-steel',Math.max(0,K.sektion),100) : ''}
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
    else { text='Du gehst vor, aber niemand geht mit. Nach fünf Schritten stehst du allein und kehrst um.';
      S.belastung=Math.min(100,S.belastung+7); }   // die einzige Stelle, der die Klemme fehlte
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
  /* ── Die Sektion ──
     `K.sektion` ist **keine** Anzeige wie `K.eigen`, sondern die Größe, an der
     der Rang hängt: Sie entscheidet den Schaden der Salve, und sie wird nach
     dem Gefecht abgerechnet. Zum ersten Mal kann man ein Gefecht gewinnen und
     trotzdem verlieren — „Wer barfuß marschiert, ist dein Versäumnis". */
  else if(id==='sektionsalve'){
    const p = probe('autoritaet', 45);
    const anteil = Math.max(0.35, (K.sektion||100)/100);
    if(p.erfolg){ schaden = (34 + Math.random()*14) * anteil; nutzen('drill',1);
      text = 'Du lässt anlegen, wartest zwei Atemzüge länger, als sich richtig anfühlt, und dann fällt das Kommando. Zwanzig Musketen auf einen Schlag sind kein Lärm, sondern eine Wand.'
           + anerkennung(1,'Eine Salve, die saß'); }
    else { schaden = 10 * anteil; K.sektion = Math.max(0,(K.sektion||100)-6);
      text = 'Dein Kommando kommt eine Sekunde zu spät, und die Sektion feuert einzeln. Zwanzig Schüsse nacheinander sind zwanzig Gelegenheiten für die andere Seite.'; }
  }
  else if(id==='glieder'){
    const p = probe('drill', 40);
    if(p.erfolg){ K.geschlossen = 3; schaden = 8;
      text = 'Erstes Glied kniet, zweites tritt durch. Es dauert acht Sekunden, in denen niemand schießt, und danach steht vorn, wer noch Pulver hat.'; }
    else { text = 'Der Wechsel gerät durcheinander, und für einen Moment stehen alle zwanzig ohne Ordnung im Freien.'; K.sektion = Math.max(0,(K.sektion||100)-8); }
  }
  else if(id==='herausnehmen'){
    const p = probe('menschenkenntnis', 40);
    gefahrMod = +10;                       // du gehst dabei aus dem Glied
    if(p.erfolg){ K.sektion = Math.min(100,(K.sektion||100)+6); S.kameradschaft=Math.min(100,S.kameradschaft+4);
      text = 'Du siehst es an den Schultern, bevor er selbst es weiß: Der Junge im zweiten Glied läuft gleich. Du hast ihn am Riemen, bevor er den ersten Schritt macht, und stellst ihn zwischen zwei Ältere. Er bleibt.'
           + anerkennung(1,'Einen aus dem Glied geholt, bevor er lief'); }
    else { text = 'Du greifst nach ihm und bekommst nur den Tornistergurt. Er läuft trotzdem, und zwei sehen ihm nach.'; K.sektion = Math.max(0,(K.sektion||100)-10); }
  }
  /* ── Der Zug ──
     **Rollendes Feuer** ist der Kern: Drei Sektionen feuern nacheinander, also
     steht immer eine geladen. Für den Spieler heißt das, was ein Zug wirklich
     leistet — er schießt *durchgehend*, während ein einzelner Mann die Hälfte
     der Zeit lädt. Deshalb wirkt er auch in der Runde, in der man nichts tut. */
  else if(id==='zugfeuer'){
    const p = probe('drill', 45);
    const anteil = Math.max(0.35, (K.sektion||100)/100);
    if(p.erfolg){ schaden = (30 + Math.random()*12) * anteil; K.rollend = 3; nutzen('autoritaet',1);
      text = 'Erste Sektion Feuer, zweite Sektion Feuer, dritte Sektion Feuer, erste wieder geladen. Es hört nicht auf, und das ist der ganze Unterschied: Ein Mann schießt jede zweite Minute, ein Zug schießt immer.'
           + anerkennung(1,'Rollendes Feuer, das nicht abriss'); }
    else { schaden = 12 * anteil; K.sektion = Math.max(0,(K.sektion||100)-5);
      text = 'Die zweite Sektion feuert zu früh, die dritte gar nicht, und für vier Sekunden steht der ganze Zug mit leeren Läufen da.'; }
  }
  else if(id==='einteilen'){
    const p = probe('autoritaet', 50);
    if(p.erfolg){ K.geschlossen = 3; schaden = 6;
      K.sektion = Math.min(100,(K.sektion||100)+3);
      text = 'Du gehst hinter der Front durch und sagst drei Sergenten je einen Satz. Mehr ist es nicht — und danach steht der Zug anders da. Man führt sechzig Mann nicht, indem man sechzig Mann etwas zuruft.'; }
    else { text = 'Zwei von deinen Sergenten hören dich, der dritte nicht, und sein rechtes Ende steht zehn Schritt zu weit vorn. Das sieht jeder, der drüben zielt.';
      K.sektion = Math.max(0,(K.sektion||100)-6); }
  }
  else if(id==='halten_sektion'){
    const p = probe('drill', 40);
    if(p.erfolg){ gefahrMod = -6; K.geschlossen = 3;
      K.sektion = Math.min(100,(K.sektion||100)+4);
      let lob = '';
      if(!K.sektionGelobt){ K.sektionGelobt = true; lob = anerkennung(1,'Die Sektion geschlossen gehalten'); }
      text = 'Schließen, aufschließen, Abstand halten. Zwanzig Mann sind keine acht: Man sieht die Enden nicht mehr, man muss sie sich denken. Deine Sektion steht, wo sie stehen soll.' + lob; }
    else { text = 'Du rufst gegen den Lärm an, und der Lärm gewinnt. Das rechte Ende der Sektion hört dich nicht.'; K.sektion = Math.max(0,(K.sektion||100)-6); }
  }
  else if(id==='zurueck'){
    S.ruf = Math.max(0, S.ruf-8); S.belastung=Math.min(100,S.belastung+10); S.gekniffen=true;
    kampfEnde(false, 'Du gehst zurück. Niemand hält dich auf, und das ist das Schlimmste daran.');
    return;
  }

  // Mündungsblitze zeichnet das Sichtfeld nur, wenn gerade gefeuert wurde —
  // zustandsgesteuert, nie gewürfelt (siehe die Regel unter `sichtfeld`).
  K.blitz = (id==='salve' || id==='sektionsalve');
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

  /* **Rollendes Feuer wirkt auch in der Runde, in der du nichts tust.** Das ist
     der Sinn des Ranges und der einzige Ort, an dem Schaden ohne eigene
     Handlung entsteht: Ein Zug in drei Sektionen hört nicht auf zu schießen,
     nur weil sein Sergent-major gerade woanders hinsieht. Drei Runden lang,
     dann muss das Kommando erneuert werden — sonst wäre es kein Befehl, sondern
     ein Dauerzustand. Der Beitrag zählt **nicht** für die Sichtbarkeit: Gezählt
     wird, was aus dem Stand geschieht, und das hier tut der Zug, nicht du. */
  let rollend = 0;
  if(K.rollend > 0){
    rollend = (7 + Math.random()*5) * Math.max(0.35, (K.sektion||100)/100);
    K.rollend--;
  }
  K.feindMoral -= schaden + linie + rollend;

  /* ══════════════════ DIE TATENZÄHLUNG ══════════════════

     **Die Sichtbarkeitsregel ist der Zahn des ganzen Ordenssystems:**
     *Gezählt wird nur, was aus dem Stand geschieht.* Wer kniet oder liegt,
     dessen Serie reißt und dessen Schaden zählt halb.

     Historisch ist das exakt — im Pulverdampf sieht niemand, wer gut zielt;
     gesehen wird, wer steht, wo geschossen wird. Mechanisch ist es die Bremse,
     ohne die das System kaputt wäre: **Man kann keine Auszeichnung aus der
     Deckung heraus erschießen.** Auszeichnungsjagd und Überleben ziehen damit
     an entgegengesetzten Enden desselben Seils — dieselbe Achse, auf der die
     Gefechts-Ereignisse gebaut sind (vorsichtig überlebt, mutig steigt auf).

     Gezählt wird der **Schaden an der Feindmoral**, nicht Tote: Niemand zählt
     1796 im Rauch Gefallene, aber jeder sieht, wessen Abschnitt der Linie
     wankt. Der Beitrag der Linie (`linie`) zählt nicht mit — das ist nicht
     deine Tat. */
  const z = K.zaehlung;
  if(schaden > 0){
    z.schaden += K.deckung ? schaden*0.5 : schaden;
    if(K.deckung){ z.serie = 0; z.gedeckt++; }
    else { z.serie++; z.bestSerie = Math.max(z.bestSerie, z.serie); z.offen++; }
  } else if(!K.deckung && id!=='laden') { z.serie = 0; }
  if(K.vorn) z.vorn = true;

  /* Und sie verliert dabei Männer. Das ist reine Anzeige — an `eigen` hängt
     keine Probe und keine Gefahr, es macht nur sichtbar, was der Text sagt:
     Drüben wird auch geschossen. Je mehr Widerstand noch steht, desto teurer,
     und gegen einen besseren Gegner teurer als gegen einen schlechten. */
  const geschlossen = K.geschlossen > 0;
  K.eigen = Math.max(0, K.eigen - (2 + Math.random()*3) * (1 + guete*0.15)
    * Math.max(0, K.feindMoral/n.feindMoral) * (geschlossen?0.5:1));
  /* Deine zwanzig Mann verlieren dieselben Anteile wie die Linie — aber du
     musst sie hinterher verantworten. Eine gut ausgesuchte und gedrillte
     Sektion (`S.sektionGuete` aus dem Lager) hält länger. */
  if(S.rang>=5 && K.sektion != null){
    const guete2 = 1 - Math.min(0.4, (S.sektionGuete||0)/100);
    K.sektion = Math.max(0, K.sektion - (2 + Math.random()*3) * (1 + guete*0.15) * guete2
      * Math.max(0, K.feindMoral/n.feindMoral) * (geschlossen?0.5:1));
  }
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
    /* ── Übungsgefecht (Kapitel 3) ──
       Das große Manöver von Boulogne benutzt das volle Kampfsystem — Sichtfeld,
       Salven, für den Sergenten die Sektion —, aber es wird mit Platzpatronen
       geschossen. **Dasselbe Spiel, andere Währung:** Der Einsatz ist nicht
       Blut, sondern Sichtbarkeit, denn der Stab sieht zu.

       Ein „Treffer" ist hier ein Unfall — ein Rohrkrepierer, ein Ladestock im
       Gesicht, ein durchgehendes Pferd —, und die gab es reichlich. Er kostet
       ein paar Punkte und Atem, tötet aber nie: Die Klemme bei 1 ist dieselbe
       Regel wie bei den Szenen. Der Tod gehört dorthin, wo scharf geschossen
       wird. */
    if(n.uebung){
      const schaden = 2 + Math.floor(Math.random()*4);        // 2–5
      S.leben = Math.max(1, S.leben - schaden);
      S.atem = Math.max(0, S.atem - 6);
      treffer = ' Der Ladestock des Nebenmanns erwischt dich am Ohr, weil er ihn im Eifer nicht herausgezogen hat. Es blutet, es ist lächerlich, und der Schiedsrichter notiert dich als gefallen — für zwei Runden.';
      K.protokoll.push('Ein Unfall im Manöver.');
      atemKlemmen();
    } else {
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
      gefallen(text + treffer + ' Du willst dich abstützen und findest den Boden nicht, wo er sein müsste. Jemand ruft deinen Namen, weit weg.',
               'Gefallen bei '+n.datum.split(' · ')[1]);
      return;
    }
    if(S.leben <= lebenMax()*0.3) treffer += ' Du bist noch auf den Beinen, aber nicht mehr lange.';
    atemKlemmen();
    }
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

/* ══════════════════ WER ÜBER DIR STIRBT ══════════════════

   Ein Höhepunkt tötet nicht nur dich. Nach jedem Höhepunktgefecht (`haerte`)
   kann einer aus der Kette fallen — und dann ist der halbe aufgebaute Einfluss
   weg (KONZEPT §7). Das ist der Preis dafür, dass man vier Gesichter eine ganze
   Laufbahn lang behält: Wer nur eine Beziehung pflegt, verliert alles auf
   einmal.

   **Der Sergent-major ist der Sonderfall.** Er steht nicht in der Kette — man
   sieht ihn nur zweimal am Rand —, und er fällt *gezielt*, sobald der Spieler
   die Sergent-Hürden erreicht hat (`S.majorFaellt`). Damit die Naht unsichtbar
   bleibt, geschieht das nicht auf dem Bildschirm, auf dem die Zahlen stimmen,
   sondern **im nächsten Gefecht**. Danach rückt Martel auf seinen Posten, und
   Martels Stelle ist die, die du bekommst. Invariante 5 bleibt: Am Anfang der
   Kette steht weiterhin ein Toter. */

const MAJOR = 'Sergent-major Lascaux';

function ketteImGefecht(n){
  if(!S.leute) return '';
  let meldung = '';

  /* Der angesagte Tod: qualifiziert, also fällt der Mann, dessen Stelle
     freiwerden muss. Erst danach kann Martel aufrücken. */
  if(S.majorFaellt && !S.majorTot){
    S.majorTot = true; S.majorFaellt = false;
    const m = S.leute.martel;
    if(m && m.lebt && m.stufe === 0){
      m.stufe = 1;                                    // Martel wird Sergent-major
      meldung += `<div class="wirkung"><span>${esc(MAJOR)} ist gefallen</span>
        Vier Mann tragen ihn zurück, den Säbel quer über dem Tornister, und legen ihn zu den anderen.
        Am Abend steht ${esc(personKurz('martel'))} vor dem Capitaine und bekommt seine Tresse.
        <b>Damit ist die Stelle des Sergenten frei.</b></div>`;
    } else {
      meldung += `<div class="wirkung"><span>${esc(MAJOR)} ist gefallen</span>
        Die Stelle wird besetzt, bevor die Kompanie ihn begraben hat. Nicht mit dir.</div>`;
    }
  }

  /* ── Martels angesagter Fall ──
     **Die härteste Vakanz des Spiels.** Bis hierher ist jeder, dessen Stelle
     frei wurde, ein Name am Rand gewesen — Guérin, Lascaux. Martel ist der
     Mann, der einen 1796 über die Pässe gebracht hat und seither in jeder
     Seitenleiste steht.

     Das Spiel spricht es nicht aus. Es sagt nur, wer gefallen ist und dass die
     Stelle frei ist; die Rechnung stellt der Spieler selbst auf. Wer den
     Vorschlag des Capitaine bekommen hat und zwei Stationen später das hier
     liest, weiß, wofür er ihn bekommen hat. */
  if(S.martelFaellt && !S.martelTot){
    S.martelTot = true; S.martelFaellt = false;
    const m = S.leute.martel;
    if(m && m.lebt){
      meldung += personFaellt('martel');
      meldung += `<div class="wirkung"><span>Die Stelle des Sergent-majors</span>
        Die Bücher der Kompanie liegen seit dem Morgen bei niemandem.
        <b>Damit ist die Stelle frei.</b></div>`;
    }
  }

  /* Der ungeplante Tod. Nur in Höhepunktgefechten, höchstens einer, und nie
     der, den man gerade als Fürsprecher braucht — sonst wäre es keine
     Gefahr mehr, sondern eine Sperre. */
  if((n.haerte||1) > 1 && Math.random() < 0.22){
    const lebende = LEUTE.filter(l => S.leute[l.id] && S.leute[l.id].lebt);
    if(lebende.length > 1){
      const opfer = lebende[Math.floor(Math.random()*lebende.length)];
      meldung += personFaellt(opfer.id);
    }
  }
  return meldung;
}

/* Einer fällt, ein Nachfolger übernimmt den Posten — mit Gunst 0. Der Text
   dazu steht in `LAUF.nachfolger` und wird an der nächsten Station gezeigt,
   nicht hier: Ein Todesfall ist keine Fußnote unter einem Gefechtsergebnis. */
function personFaellt(id){
  const p = S.leute[id]; if(!p || !p.lebt) return '';
  const altName = personName(id);
  const liste = NACHFOLGER[id] || [];
  const nf = liste[Math.floor(Math.random()*liste.length)];
  p.lebt = false;
  LAUF.nachfolger = {id, alt:altName, kurz: nf?nf.kurz:'', satz: nf?nf.satz:''};
  return `<div class="wirkung"><span>${esc(altName)} ist gefallen</span>
    Was er für dich hätte sagen können, sagt jetzt niemand mehr. <b>Fürsprache verloren</b></div>`;
}

/* Der Nachfolger tritt an, sobald die Kompanie wieder steht. Gunst 0 — er
   kennt dich nicht, und du fängst bei ihm von vorn an. */
function nachfolgerAntreten(){
  const nf = LAUF.nachfolger; if(!nf) return;
  const p = S.leute[nf.id];
  if(p){ p.lebt = true; p.gunst = 0; if(nf.kurz) p.kurz = nf.kurz; }
  LAUF.nachfolger = null;
  laufSichern();
}

/* ── Der Tod im Gefecht ──
   **Ein Toter durchläuft keinen Stationsabschluss.** Vorher lief jeder
   Treffertod über `kampfEnde()`, und das ist der Abschluss einer *bestandenen*
   Station: Der Gefallene bekam noch die Niederlagen-Wirkung (Ruf −4 bis −6,
   was über `5·floor(ruf/10)` echte Veteranenpunkte kostete), der Feldscher
   nähte ihm eine Wunde zu, `stationErledigt()` heilte ihn um 5 % (er stand
   danach mit „Leben 4 von 64" im Chronikblatt), zählte die **nächste** Station
   als erreicht (+2 VP, die der Rückzugstod nicht bekam) und schrieb sogar noch
   einen Spielstand des Toten, weil `S.lebt` erst eine Anweisung später falsch
   wurde. Dass der Rückzugstod all das nicht tat, war der Beweis, dass es ein
   Versehen war und keine Absicht.

   Jetzt endet ein Gefechtstod hier und nirgends sonst: Kampfzustand weg,
   `toetlich()` (löscht den Spielstand im selben Augenblick, Invariante 1),
   dann der Todesbildschirm — mit dem letzten Absatz und den Taten dieses
   Gefechts, die vorher niemand zu sehen bekam. */
function gefallen(letzterText, todesart){
  const kk = K;
  setzeKampf(null);
  toetlich(todesart);
  zeigeTod(letzterText, kk);
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
      gefallen(letzterText + ' Ihr geht rückwärts aus dem Feuer, und das Feuer geht mit. Dich trägt niemand.',
               'Gefallen auf dem Rückzug bei '+n.datum.split(' · ')[1]);
      return;
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
  if(leicht>=0){ S.wunden.splice(leicht,1); atemKlemmen(); }   // der Vorrat wächst wieder
  if(sieg && n.ruhm && S.ruf>=20 && Math.random()<0.6){ S.nennungen++; }

  /* ══════════════════ DIE LEITER DER SICHTBARKEIT ══════════════════

     Napoleons Armee hatte keine gestuften Tapferkeitsmedaillen — sie hatte
     etwas Besseres: **eine Leiter der Sichtbarkeit.** Wer etwas tat, wurde
     gemeldet, und die einzige Frage war, wie weit nach oben die Meldung stieg.
     Das ist die historische Entsprechung von Bronze, Silber und Gold:

       1 · Lob vor der Front      — der Capitaine, am Abend des Gefechts
       2 · Nennung im Tagesbefehl — der Divisionsstab
       3 · Meldung an den Oberbefehl / ab 1805 **das Bulletin der Großen Armee**

     Der Name der dritten Stufe schaltet mit der Epoche um, wie die Kokarde zum
     Adler wird: Das Bulletin gab es erst ab 1805, gemeldet wurde vorher auch.

     **Nur die höchste Stufe je Gefecht zählt.** Stapeln wäre Grinding, und
     Invariante 2 verbietet es.

     **Die Bronzestufe gibt bewusst keinen Ruf.** Die teuerste gelernte Regel
     des Projekts lautet: Alles, was den Ruf hebt, hebt über die Schwellen auch
     den Aufstieg. Ruf +2 je gutem Gefecht wären über einen Lauf rund +30 — die
     Sergent-Quote würde durch die Decke gehen. Bronze zahlt deshalb in
     Kameradschaft und in die *Zählung*: Belobigungen sind die Währung, aus der
     später Ordensbedingungen erfüllt werden. */
  const z = K.zaehlung || {schaden:0, ereignisse:0, vorn:false, offen:0, gedeckt:0};
  const bulletinZeit = jahrVonStation() >= 1805;
  let stufe = 0;
  if(z.schaden >= 60 || z.ereignisse >= 1) stufe = 1;
  /* Silber verlangt zusätzlich, dass man überwiegend gestanden hat — sonst
     wäre die Sichtbarkeitsregel durch bloße Länge des Gefechts auszuhebeln. */
  if((z.schaden >= 100 && z.offen > z.gedeckt) || (z.ereignisse >= 2)) stufe = 2;
  if(z.schaden >= 150 || (z.ereignisse >= 1 && z.vorn && n.haerte) || K.kette) stufe = 3;

  S.belobigungen = S.belobigungen || 0;
  S.bulletins = S.bulletins || 0;
  K.stufe = stufe;
  if(stufe === 1) { S.belobigungen++; S.kameradschaft = Math.min(100, S.kameradschaft+4); }
  if(stufe === 2) { S.nennungen++; }
  if(stufe === 3) { S.nennungen += 2; S.bulletins++; S.ruf += 4; }
  K.stufeName = ['','Lob vor der Front','Nennung im Tagesbefehl',
                 bulletinZeit?'Im Bulletin der Großen Armee':'Dem Oberbefehl gemeldet'][stufe];
  /* ── Die Abrechnung ──
     Der eigentliche Rangunterschied des Sergenten. Ein Caporal kommt aus dem
     Gefecht und ist fertig; ein Sergent zählt ab, und die Zahl geht nach oben.
     Zwanzig Mann, von denen die Hälfte liegt, sind ein gewonnenes Gefecht und
     eine verlorene Woche. */
  let abrechnung = '';
  if(S.rang>=5 && K.sektion != null){
    /* Ab Rang 6 rechnet dieselbe Zahl über sechzig Mann statt über zwanzig —
       und der, dem man Rechenschaft schuldet, ist nicht mehr der Lieutenant,
       sondern der Capitaine. Die Schwellen skalieren mit. */
    const zug = S.rang>=6;
    const kopf = zug ? 60 : 20;
    const wem = zug ? 'vernet' : 'berthaud';
    const uebrig = Math.max(0, Math.round(K.sektion/100*kopf));
    const verlust = kopf - uebrig;
    if(verlust >= kopf*0.45){ gunstGeben(wem,-1); S.belastung=Math.min(100,S.belastung+6);
      abrechnung = `<div class="wirkung"><span>Appell nach dem Gefecht</span>
        Von ${kopf==60?'sechzig':'zwanzig'} stehen ${uebrig}. ${zug
          ? 'Der Capitaine lässt sich die Listen bringen und geht sie durch, ohne aufzusehen. Er sagt nichts, und das ist schlimmer als etwas zu sagen.'
          : 'Der Lieutenant lässt sich die Namen der Fehlenden geben und sagt nichts weiter, und das ist schlimmer als etwas zu sagen.'}
        <b>Fürsprache ${esc(personKurz(wem))} −1 · Belastung +6</b></div>`; }
    else if(verlust <= kopf*0.15){ gunstGeben(wem,1); S.kameradschaft=Math.min(100,S.kameradschaft+5);
      abrechnung = `<div class="wirkung"><span>Appell nach dem Gefecht</span>
        Von ${kopf==60?'sechzig':'zwanzig'} stehen ${uebrig}. Das fällt auf, weil es sonst nicht so ist. ${zug
          ? 'Drei Sergenten haben ihre Leute beisammen, und drei Sergenten wissen, von wem sie das haben.'
          : 'Deine Leute merken es zuerst.'}
        <b>Fürsprache ${esc(personKurz(wem))} +1 · Kameradschaft +5</b></div>`; }
    else abrechnung = `<div class="wirkung"><span>Appell nach dem Gefecht</span>
        Von ${kopf==60?'sechzig':'zwanzig'} stehen ${uebrig}. ${zug
          ? 'Der Capitaine schreibt die Zahl auf und geht zur nächsten Kompanie.'
          : 'Der Lieutenant schreibt die Zahl auf und geht zur nächsten Sektion.'}</div>`;
    abrechnung = appellBild(uebrig, kopf) + abrechnung;
  }

  vakanzPruefen();                    // stimmen die Zahlen, ist der Tod angesagt
  const ketteMeldung = ketteImGefecht(n);
  const kk = K; setzeKampf(null);
  stationErledigt();
  app.innerHTML = `<div class="stage">${verlauf()}
    <div><div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb"><div class="prose"><p>${letzterText}</p></div>
        <div class="ergebnis ${sieg?'gut':'schlecht'}">${erg.text}</div>${wirkungen(erg)}
        ${kk.rueckzug?`<div class="wirkung"><span>Der Rückzug</span>Ihr geht rückwärts aus dem Feuer, und das Feuer geht mit. Wer fällt, bleibt liegen. <b>Leben −${kk.rueckzug}</b></div>`:''}
        ${abrechnung}${ketteMeldung}
        ${kk.taten.length?`<div class="lage"><div class="lagekopf">Was gesehen wurde</div>
          ${kk.taten.map(t=>`<div class="tat"><span>${esc(t.was)}</span><b>Ruf +${t.ruf}</b></div>`).join('')}
          ${kk.ruhm>=RUHM_JE_GEFECHT?'<p class="hinweis" style="margin:9px 0 0">Mehr sieht in diesem Rauch niemand.</p>':''}
        </div>`:''}
        ${tatenBilanz(kk)}
        <div class="probe" style="margin-top:10px">${sieg?'GEFECHT BESTANDEN':'GEFECHT VERLOREN'} · ${kk.runde} RUNDEN</div>
      </div></div>
      <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="naechster()">Weiter</button></div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

/* Die Bilanz des Gefechts in Zahlen — und, wenn es knapp war, woran es lag.

   **Der zweite Satz ist der wichtigere.** Ein Auszeichnungssystem, dessen
   Schwellen unsichtbar sind, fühlt sich wie Zufall an; eines, das sagt „für den
   Tagesbefehl hätte es 100 gebraucht", macht aus dem nächsten Gefecht eine
   Entscheidung. Genau dieselbe Überlegung wie bei den Proben, die ihren Wert
   und ihre Schwierigkeit schon auf dem Knopf zeigen. */
function tatenBilanz(kk){
  const z = kk.zaehlung;
  if(!z || (!z.schaden && !z.ereignisse)) return '';
  const s = Math.round(z.schaden);
  const naechste = s < 60 ? 60 : s < 100 ? 100 : s < 150 ? 150 : 0;
  const wofuer = s < 60 ? 'ein Lob vor der Front' : s < 100 ? 'den Tagesbefehl' : 'die Meldung nach oben';
  return `<div class="wirkung"><span>${kk.stufe?esc(kk.stufeName):'Nicht aufgefallen'}</span>
    Eigener Anteil am Widerstand des Feindes: <b>${s}</b>${
      z.bestSerie>=3?` · ${z.bestSerie} Treffer in Folge aus dem Stand`:''}${
      z.gedeckt?` · ${z.gedeckt} Runden aus der Deckung, die halb zählen`:''}.
    ${kk.stufe===0 && naechste ? `Für ${wofuer} hätte es ${naechste} gebraucht.` :
      kk.stufe===1 && naechste ? `Für ${wofuer} hätte es ${naechste} gebraucht — und man muss dabei stehen.` : ''}</div>`;
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

/* ══════════════════ DIE LEITER ══════════════════

   Beförderung ist kein Erfahrungsbalken (KONZEPT §7). Drei Bedingungen
   gleichzeitig: **Ruf** über der Schwelle, ein **Fürsprecher** mit Gesicht —
   und eine **Vakanz**, die es nur gibt, weil jemand gestorben oder selbst
   aufgerückt ist.

   Neu daran ist der Fürsprecher: nicht mehr eine Zahl, sondern eine bestimmte
   Person der richtigen Ebene. Wer Martel verliert, bevor er Caporal wird,
   braucht dessen Nachfolger — und der kennt ihn nicht. Wer sich den Fourier
   zum Feind gemacht hat, kommt an den Listen nicht vorbei, so tapfer er war.

   **Zwei Wege zum Sergent.** Der Feldweg geht über den Caporal und verlangt
   Ruf 62; der Listenweg geht über den Fourrier und verlangt nur 52, weil der
   Lieutenant dann die eigene Handschrift kennt — die Listen *sind* Fürsprache.
   Der Fourrier ist damit ein Seitenweg wie die Elitekompanie, kein Pflichtglied:
   **Überspringen kostet keine Wertung** (gezählt wird der höchste Rang, nicht
   die Summe der Stufen), nur die Verwaltungsknöpfe und den leichteren Anlauf. */

const LEITER = [
  {rang:3, name:'Caporal', ruf:CAPORAL_RUF, patron:'martel', gunst:CAPORAL_GUNST, von:[1,2],
   fehltRuf:'Zwei Stellen werden besetzt. Keine mit dir. Der Capitaine kennt deinen Namen nicht, und das ist die ganze Erklärung.',
   fehltGunst:'Dein Name fällt. Er fällt sogar zweimal. Aber niemand am Tisch legt die Hand für dich auf den Tisch, und ohne das geht es nicht.',
   text:p=>esc(p)+` nennt deinen Namen, und der Capitaine schreibt ihn auf. Es gibt keine Zeremonie. Du bekommst zwei Wollstreifen an den Ärmel, acht Mann und die Verantwortung dafür, dass diese acht Mann morgens da sind, Schuhe haben und ihre Musketen zünden.
    <br><br>Der Mann, dessen Stelle du bekommst, heißt Guérin. Er ist bei Castiglione geblieben.`},

  {rang:4, name:'Caporal-fourrier', ruf:35, patron:'collot', gunst:3, bildung:35, von:[3],
   fehltRuf:'Der Fourier sucht einen, der schreiben kann und den die Kompanie kennt. Das zweite fehlt.',
   fehltGunst:'Der Fourier sucht sich seinen Nachfolger selbst aus. Er hat sich umgesehen und ist an dir vorbeigegangen.',
   fehltBildung:'Man gibt dir eine Feder in die Hand und ein Blatt. Nach einer Minute nimmt man dir beides wieder ab. Für die Listen braucht es mehr als drei Wörter.',
   text:p=>esc(p)+` rückt selbst auf, und seine Stelle ist frei. Du bekommst einen dritten Streifen quer über die beiden, einen Bleistift, der dir gehört, und die Bestandslisten der Kompanie.
    <br><br>Von jetzt an steht dein Name auf jedem Blatt, auf dem eine Zahl nicht stimmt. Das ist der Unterschied zwischen Tragen und Verantworten, und es hat noch nie jemand gemocht.`},

  {rang:5, name:'Sergent', ruf:62, patron:'berthaud', gunst:5, von:[3], vakanz:'major',
   fehltRuf:'Für eine Sektion braucht es einen Namen, den die Kompanie gehört hat, bevor er verlesen wird.',
   fehltGunst:'Der Lieutenant geht die Liste durch. Bei dir hält er nicht an.',
   text:p=>esc(personKurz('martel'))+` trägt seit vier Wochen die Tresse des Sergent-majors. Seine alte Stelle war seitdem nicht besetzt, weil niemand da war, der sie hätte ausfüllen können.
    <br><br>`+esc(p)+` nennt deinen Namen. Du bekommst eine Tresse aus Metallfaden, zwanzig Mann und die Frage, wie viele davon am Abend noch stehen. Es ist die erste Beförderung, bei der niemand für dich gestorben ist — dein Vorgänger ist bloß aufgerückt. <span class="fein">Weil über ihm einer gefallen war.</span>`},

  {rang:5, name:'Sergent', ruf:52, patron:'berthaud', gunst:4, listenweg:true, von:[4], vakanz:'major',
   fehltRuf:'Für eine Sektion braucht es einen Namen, den die Kompanie gehört hat, bevor er verlesen wird.',
   fehltGunst:'Der Lieutenant geht die Liste durch. Bei dir hält er nicht an.',
   text:p=>`Der Lieutenant kennt deine Handschrift, seit du die Listen führst. Das ist eine Art von Fürsprache, die nichts kostet und lange wirkt.
    <br><br>`+esc(personKurz('martel'))+` ist Sergent-major, seine Stelle ist frei, und `+esc(p)+` nennt deinen Namen. Zwanzig Mann, eine Tresse, und ein Buch weniger zu führen.`},

  /* ── Rang 6 · Sergent-major ──
     **Die Decke des Prototyps, und sie hat ein Gesicht.** Boulogne hat es
     angesagt: „Nichts frei. Auf dem Posten sitzt Martel, zweiundvierzig und
     gesund." Damit ist von Anfang an klar, was frei werden müsste.

     Der Fürsprecher ist **Vernet**, der Kompaniechef — und das gibt dem
     vierten Mann der Kette endlich eine Funktion. Seine Quellen sind knapp und
     bleiben es: Er kennt deinen Namen erst, wenn ihn jemand oft genug genannt
     hat (KONZEPT: „Er kennt deinen Namen erst, wenn ihn jemand nennt").

     Die Vakanz ist die härteste im Spiel — es ist die einzige, bei der ein
     Mann fällt, den man seit 1796 kennt. Das Spiel spricht es nie aus. */
  {rang:6, name:'Sergent-major', ruf:75, patron:'vernet', gunst:3, von:[5], vakanz:'majormajor',
   fehltRuf:'Für sechzig Mann reicht es nicht, dass die Kompanie deinen Namen kennt. Das Bataillon muss ihn kennen.',
   fehltGunst:'Der Capitaine weiß, wer du bist. Das ist etwas anderes, als dich zu wollen.',
   text:p=>`Die Stelle des Sergent-majors ist seit dem Gefecht nicht besetzt. Es hat drei Wochen gedauert, bis jemand die Bücher übernommen hat, und in diesen drei Wochen hat die Kompanie gemerkt, wie viel an einem Mann hängt, den niemand tagsüber sieht.
    <br><br>`+esc(p)+` unterschreibt. Du bekommst die zweite Tresse, drei Sektionen, sechzig Mann und die Fourage für sechzig Mann. Von jetzt an bist du der, den niemand tagsüber sieht.
    <br><br><span class="fein">Seine Sachen sind schon weggeräumt. Es ging schnell, weil es immer schnell geht.</span>`}
];

/* Welche Stufe hier zur Debatte steht: **der höchste Eintrag, den man
   tatsächlich erfüllt** — und wenn keiner, der niedrigste, damit der Bildschirm
   erklärt, woran es beim nächsten Schritt scheitert.

   Genau daraus fällt heraus, dass der Fourrier überspringbar ist: Ein Caporal
   mit Ruf 50 und der Fürsprache des Lieutenants steht direkt vor der
   Sergent-Stelle (Feldweg); wem dafür der Ruf fehlt, dem bietet dieselbe
   Musterung die Listen an (Listenweg). Niemand muss wählen — man merkt an dem,
   was einem angeboten wird, welchen Weg man ohnehin geht. */
function leiterZiel(){
  const passend = LEITER.filter(e => e.von.indexOf(S.rang) >= 0);
  if(!passend.length) return null;
  for(let i = passend.length-1; i >= 0; i--){
    const e = passend[i];
    const vakanz = e.vakanz === 'major' ? !!S.majorTot
                 : e.vakanz === 'majormajor' ? !!S.martelTot : true;
    if(S.ruf >= e.ruf && gunst(e.patron) >= e.gunst && (!e.bildung || S.attr.bildung >= e.bildung) && vakanz)
      return e;
  }
  return passend[0];
}

/* Die Vakanz für den Sergenten entsteht nicht von selbst: Sobald die Zahlen
   stimmen, wird der Tod des Sergent-majors **angesagt** und fällt im nächsten
   Gefecht (`ketteImGefecht`). Erst danach ist die Stelle frei — und die Naht
   zwischen „ich bin qualifiziert" und „über mir stirbt einer" bleibt unsichtbar. */
/* Stimmen Ruf und Fürsprache, **schlägt der Lieutenant dich vor** — und erst
   danach wird die Stelle frei.

   Bis zum 28.07.2026 setzte diese Prüfung nur stumm ein Flag: Der Spieler
   erfuhr nie, dass sein Name nach oben gegangen war, und die Beförderung zwei
   Stationen später kam aus dem Nichts. Der Vorschlag ist aber das eigentliche
   Ereignis — er ist das, was ein Mann sich verdient. Die Vakanz ist nur, was
   danach passieren muss.

   **Und genau darin liegt Invariante 5, ohne dass sie ausgesprochen wird:**
   Berthaud sagt, dein Name stehe auf der Liste, und es sei keine Stelle frei.
   Was daraus folgt, denkt der Spieler selbst. */
function vakanzPruefen(){
  if(!S || !S.leute) return;
  /* Zwei Vakanzen, dieselbe Maschine. `major` ist die Stelle des Sergenten
     (der Sergent-major fällt, Martel rückt auf); `majormajor` ist Martels
     eigene Stelle — die letzte des Prototyps, und die einzige, bei der ein
     Mann fällt, den man seit 1796 kennt. */
  for(const [flagT, flagF, rang] of [['majorTot','majorFaellt',5],
                                      ['martelTot','martelFaellt',6]]){
    if(S[flagT] || S[flagF]) continue;
    const z = LEITER.filter(e => e.rang === rang && e.von.indexOf(S.rang) >= 0)[0];
    if(!z) continue;
    if(S.ruf >= z.ruf && gunst(z.patron) >= z.gunst){
      S[flagF] = true;
      if(LAUF) LAUF.vorschlag = z.patron;
      return;                              // höchstens ein Vorschlag je Gefecht
    }
  }
}

function zeigeBefoerderung(n){
  /* Der Stand wird beim ersten Betreten der Station eingefroren, je Station —
     seit Kairo gibt es eine zweite Musterung, und die prüft den Stand von
     jetzt, nicht den von Verona. */
  S.befPruefungen = S.befPruefungen || {};
  const ziel = leiterZiel();

  if(!ziel){
    stationErledigt();
    app.innerHTML = `<div class="stage">${verlauf()}<div>${wegband(n)}
      <div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
        <div class="cb"><div class="prose">${(n.text||[]).map(t=>`<p>${t}</p>`).join('')}</div>
        <div class="ergebnis">${n.keinZiel || 'Du trägst die Tresse schon. Was darüber kommt, wird nicht im Hof einer Zitadelle vergeben, sondern in Paris — und dafür braucht es mehr als einen guten Feldzug.'}</div>
        </div></div>
      <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="naechster()">Weiter</button></div></div>
      </div>${seitenleiste()}</div>`;
    kopfzeile();
    return;
  }

  if(!S.befPruefungen[n.id])
    S.befPruefungen[n.id] = {ruf:S.ruf, gunst:gunst(ziel.patron), bildung:S.attr.bildung};
  const g = S.befPruefungen[n.id];

  const reichtRuf     = g.ruf >= ziel.ruf;
  const reichtGunst   = g.gunst >= ziel.gunst;
  const reichtBildung = !ziel.bildung || g.bildung >= ziel.bildung;
  const vakanz        = ziel.vakanz === 'major' ? !!S.majorTot
                      : ziel.vakanz === 'majormajor' ? !!S.martelTot : true;
  const bekommt = reichtRuf && reichtGunst && reichtBildung && vakanz;

  let text, klasse = 'schlecht';
  if(bekommt){
    S.rang = Math.max(S.rang, ziel.rang);
    S.ruf += 5;
    gunstGeben(ziel.patron, 1);
    text = ziel.text(personName(ziel.patron));
    klasse = 'gut';
  } else if(!vakanz){
    text = 'Über dir steht ein Sergent, und über dem ein Sergent-major, und beide stehen fest. Es gibt nichts zu vergeben.'
         + '<br><br><em>Für den Sergenten braucht es eine freie Stelle. Frei wird sie nicht, weil du bereit bist.</em>';
  } else if(!reichtBildung){
    text = ziel.fehltBildung + `<br><br><em>Für den ${esc(ziel.name)} braucht es Bildung ${ziel.bildung} — du hast ${g.bildung}. Buchstaben lernt man im Lager, gegen Geld.</em>`;
  } else if(!reichtRuf){
    text = ziel.fehltRuf + `<br><br><em>Für den ${esc(ziel.name)} braucht es Ruf ${ziel.ruf} — du hast ${g.ruf}.</em>`;
  } else {
    text = ziel.fehltGunst + `<br><br><em>Für den ${esc(ziel.name)} braucht es die Fürsprache von ${esc(personName(ziel.patron))} — ${ziel.gunst}, du hast ${g.gunst}. Fürsprache sammelt sich in Abenden und Gefälligkeiten, nicht in einer einzigen Tat.</em>`;
  }
  stationErledigt();     // die Entscheidung ist gefallen, bevor der Knopf kommt
  app.innerHTML = `<div class="stage">${verlauf()}<div>${wegband(n)}
    <div class="card papier"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb">${vordruck(n)}<div class="prose">${(n.text||[]).map(t=>`<p>${t}</p>`).join('')}</div>
      <div class="ergebnis ${klasse}">${text}</div>
      <div class="rangzeile" style="margin-top:12px">${bekommt?rangabzeichen(S):''}
        <span class="probe" style="margin:0">${vakanz?'VAKANZ VORHANDEN':'KEINE VAKANZ'} · RUF ${g.ruf}/${ziel.ruf} · ${esc(personKurz(ziel.patron).toUpperCase())} ${g.gunst}/${ziel.gunst}${ziel.bildung?' · BILDUNG '+g.bildung+'/'+ziel.bildung:''} · ${bekommt?'BEFÖRDERT':'ÜBERGANGEN'}</span></div>
      </div></div>
    <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="naechster()">Weiter</button></div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}
