/* Prüft den Spielstand: sichern, unterbrechen, fortsetzen, sterben, wandeln.
   Aufruf:  node test/spielstand.js  */
/* ── Das Fenster über dem Bildschirm ──
   **Liegt ein Blatt obenauf (`.ueberlage`), ist nur dieses bedienbar.** Der
   Rücken fängt jeden Klick ab — ein Prüfstand, der dahinter klickt, läuft
   entweder in einen Timeout oder, schlimmer, drückt einen Knopf, den ein
   Spieler gar nicht erreichen kann. Deshalb sucht jeder Prüfstand seine
   Knöpfe **zuerst im Fenster**. */
const { chromium } = require('playwright'); // CHROMIUM=/pfad/zu/chrome setzen, falls Playwright den Browser nicht findet
const path = require('path');
const ZIEL = 'file://' + path.resolve(__dirname, '../index.html');
const fehler = [];
const pruef = (b, t) => { console.log((b?'  ok   ':'  FEHL ') + t); if(!b) fehler.push(t); };

(async () => {
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const p = await b.newPage();
  p.on('pageerror', e => fehler.push('PAGEERROR: ' + e.message));
  p.on('console', m => { if (m.type()==='error') fehler.push('KONSOLE: ' + m.text()); });

  const text = () => p.$eval('#app', e => e.innerText);
  const klick = async re => p.evaluate(s => {
    const b=[...document.querySelectorAll((document.querySelector('.ueberlage')?'.ueberlage ':'')+'.ord:not([disabled]),button.plain')].find(e=>new RegExp(s).test(e.textContent));
    if(b){b.click();return true;} return false;
  }, re);
  const weiterBis = async (re, max=60) => {
    for(let i=0;i<max;i++){
      const t = await text(); if(new RegExp(re).test(t)) return true;
      const w = (await p.$('.ueberlage')) ? null : await p.$('.ord.weiter'); if(w){ await w.click(); continue; }
      const ok = await p.evaluate(()=>{ const b=[...document.querySelectorAll((document.querySelector('.ueberlage')?'.ueberlage ':'')+'.ord:not([disabled])')]
        .filter(e=>!/Zurückweichen|Mitmachen/.test(e.textContent)); if(b[0]){b[0].click();return true;} return false; });
      if(!ok) return false;
    }
    return false;
  };

  await p.goto(ZIEL);
  const dauerhaft = await p.evaluate(() => Ablage.dauerhaft);
  console.log('\nlocalStorage über file:// verfügbar:', dauerhaft);

  console.log('\n1 — Lauf beginnen, im Lager sichern');
  await klick('Neuen Mann aufstellen'); await klick('Einen anderen Mann');
  await p.click('#h_schmied');
  await p.click('#startbtn');
  const name = await p.evaluate(() => LAUF.mann.name);
  /* Auch die erste Station hat einen Marschweg, dort kann also mit 35 % ein
     Zwischenfall vor dem Lager stehen. Der Test hat das seit dem Einbau der
     Zwischenfälle sporadisch als Fehler gemeldet — er muss ihn abräumen,
     statt an ihm zu scheitern. */
  if(await p.evaluate(()=> !!LAUF.marsch)){
    await p.evaluate(()=>{ const b=document.querySelector('.ord:not([disabled])'); if(b) b.click(); });
    const w = (await p.$('.ueberlage')) ? null : await p.$('.ord.weiter'); if(w) await w.click();
  }
  /* **Geprüft wird die Frage, nicht der Zähler.** Bis zum Layoutumbau stand
     hier `VERBLEIBENDE ABENDE` — eine Zeichenkette aus der Gestaltung, die
     mit dem Stationsbogen zu „Verbleibend 3 von 3" wurde. Die Frage „Womit
     verbringst du den Abend?" ist das, was ein Lager *ist*; sie ändert sich
     nicht, wenn jemand einen Zähler umformuliert. */
  pruef((await text()).includes('Womit verbringst du den Abend'), 'Depot Savona ist die erste Station');
  pruef(await p.evaluate(()=>!!Ablage.lies('marschallstab.lauf')), 'Spielstand liegt beim Betreten des Lagers vor');
  pruef((await text()).includes('FELDZUG GESICHERT'), 'Das Lager sagt, dass gesichert wurde');

  console.log('\n2 — weiterspielen, dann "abstürzen" (neu laden)');
  await weiterBis('Sichtfeld|RUNDE ', 30);
  const vorher = await p.evaluate(() => ({node:LAUF.node, runde:LAUF.kampf&&LAUF.kampf.runde, atem:LAUF.mann.atem}));
  console.log('   Zustand vor dem Absturz:', JSON.stringify(vorher));
  await p.goto(ZIEL);                        // Absturz
  pruef((await text()).includes('Feldzug fortsetzen'), 'Titelbildschirm bietet Fortsetzen an');
  pruef((await text()).includes(name), 'Der Name des unterbrochenen Mannes steht da');

  console.log('\n3 — fortsetzen');
  await klick('Feldzug fortsetzen');
  const nachher = await p.evaluate(() => ({node:LAUF.node, runde:LAUF.kampf&&LAUF.kampf.runde, atem:LAUF.mann.atem, name:LAUF.mann.name}));
  console.log('   Zustand nach dem Fortsetzen:', JSON.stringify(nachher));
  pruef(nachher.name===name, 'Derselbe Mann');
  pruef(nachher.node===vorher.node, 'Dieselbe Station');
  pruef(nachher.runde===vorher.runde, 'Dieselbe Kampfrunde — kein Rücksetzen auf das Lager');
  pruef(nachher.atem===vorher.atem, 'Derselbe Atem');

  console.log('\n4 — sterben lassen');
  await p.evaluate(() => { toetlich('Prüfung'); zeigeTod(); });
  pruef(await p.evaluate(()=>!Ablage.lies('marschallstab.lauf')), 'Spielstand ist im Augenblick des Todes gelöscht');
  pruef((await text()).includes('GELÖSCHT'), 'Der Todesbildschirm sagt es');
  await klick('Zur Chronik');
  pruef(!(await text()).includes('Feldzug fortsetzen'), 'Kein Fortsetzen-Knopf mehr');
  pruef(await p.evaluate(()=>META.laeufe===1), 'Der Lauf steht in der Chronik');

  console.log('\n5 — Chronik überlebt das Neuladen');
  await p.goto(ZIEL);
  pruef(await p.evaluate(()=>META.vp>0 || META.laeufe===1), 'Chronik wurde selbsttätig geladen');

  console.log('\n6 — alte Spielstände (Fassung 0) lassen sich noch lesen');
  const alt = await p.evaluate(() => {
    const r = dateiEinlesen(JSON.stringify({vp:77, chronik:[{name:'Alter Mann',rang:'Caporal',ende:'tot',punkte:77}], bestKapitel:{}}));
    return {ok:r.ok, vp:META.vp, fassung:META.fassung, laeufe:META.laeufe};
  });
  console.log('   ', JSON.stringify(alt));
  pruef(alt.ok && alt.vp===77 && alt.fassung===1, 'Fassung 0 wird auf Fassung 1 gehoben');

  console.log('\n7 — beschädigte Datei wird abgewiesen');
  const kaputt = await p.evaluate(() => dateiEinlesen(JSON.stringify({pruef:12345, inhalt:{fassung:1, chronik:{fassung:1,vp:999,chronik:[],bestKapitel:{},laeufe:0}}})));
  pruef(!kaputt.ok, 'Falsche Prüfsumme wird erkannt: ' + (kaputt.grund||''));
  const zukunft = await p.evaluate(() => dateiEinlesen(JSON.stringify({fassung:99, vp:1})));
  pruef(!zukunft.ok, 'Spielstand aus der Zukunft wird abgewiesen');

  await b.close();
  console.log(fehler.length ? '\nFEHLER:\n' + fehler.join('\n') : '\nAlles bestanden.');
  process.exit(fehler.length ? 1 : 0);
})();
