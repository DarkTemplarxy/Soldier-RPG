/* Klickt einen kompletten Lauf durch und meldet Konsolenfehler.
   Aufruf:  node test/durchspielen.js          (aufgeteilte Fassung)
            node test/durchspielen.js dist     (gebaute Einzeldatei)  */
const { chromium } = require('playwright'); // CHROMIUM=/pfad/zu/chrome setzen, falls Playwright den Browser nicht findet
const path = require('path');
const ziel = process.argv[2] === 'dist'
  ? path.resolve(__dirname, '../dist/marschallstab.html')
  : path.resolve(__dirname, '../index.html');

(async () => {
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const p = await b.newPage({ viewport: { width: 1280, height: 1200 } });
  const fehler = [];
  p.on('pageerror', e => fehler.push('PAGEERROR: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });

  await p.goto('file://' + ziel);
  await p.click('text=Neuen Mann aufstellen');
  await p.click('text=Auswürfeln');
  await p.click('#h_schmied');
  await p.click('text=Weiter zu den Veteranenpunkten');
  await p.click('#startbtn');

  let s = 0, ende = 'Limit erreicht';
  while (s++ < 300) {
    const t = await p.$eval('#app', e => e.innerText);
    if (t.includes('Nächster Mann')) { ende = 'gestorben'; break; }
    if (t.includes('Noch einmal, besser')) { ende = 'Kapitel überstanden'; break; }
    const w = await p.$('.ord.weiter'); if (w) { await w.click(); continue; }
    const ok = await p.evaluate(() => {
      const btn = [...document.querySelectorAll('.ord:not([disabled])')];
      const f = re => btn.find(e => re.test(e.textContent));
      const txt = document.body.innerText;
      let z = null;
      if (txt.includes('RUNDE '))
        z = f(/Salve befehlen/) || f(/Sorgfältig zielen/) || f(/Anlegen und feuern/) || f(/^Laden/) || f(/Hinknien|Flach hinlegen/);
      if (!z && txt.includes('VERBLEIBENDE ABENDE') && +(txt.match(/Gunst Martel\s+(\d+)/) || [, 0])[1] < 4)
        z = f(/Am Feuer/);
      if (!z) z = btn.find(e => !/Zurückweichen|Mitmachen/.test(e.textContent)) || btn[0];
      if (z) { z.click(); return true; } return false;
    });
    if (!ok) break;
  }
  console.log(`Durchlauf: ${ende} nach ${s} Schritten`);
  console.log('Fehler:', fehler.length ? fehler.slice(0, 5) : 'keine');
  await b.close();
  process.exit(fehler.length ? 1 : 0);
})();
