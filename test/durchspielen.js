/* Klickt einen kompletten Lauf durch und meldet Konsolenfehler.
   Aufruf:  node test/durchspielen.js          (aufgeteilte Fassung)
            node test/durchspielen.js dist     (gebaute Einzeldatei)  */
/* ── Das Fenster über dem Bildschirm ──
   **Liegt ein Blatt obenauf (`.ueberlage`), ist nur dieses bedienbar.** Der
   Rücken fängt jeden Klick ab — ein Prüfstand, der dahinter klickt, läuft
   entweder in einen Timeout oder, schlimmer, drückt einen Knopf, den ein
   Spieler gar nicht erreichen kann. Deshalb sucht jeder Prüfstand seine
   Knöpfe **zuerst im Fenster**. */
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
  await p.click('text=Einen anderen Mann');
  await p.click('#h_schmied');
  await p.click('#startbtn');

  let s = 0, ende = 'Limit erreicht';
  while (s++ < 300) {
    const t = await p.$eval('#app', e => e.innerText);
    if (t.includes('Nächster Mann')) { ende = 'gestorben'; break; }
    if (t.includes('Noch einmal, besser')) { ende = 'Kapitel überstanden'; break; }
    const w = (await p.$('.ueberlage')) ? null : await p.$('.ord.weiter'); if (w) { await w.click(); continue; }
    const ok = await p.evaluate(() => {
      const btn = [...document.querySelectorAll((document.querySelector('.ueberlage')?'.ueberlage ':'')+'.ord:not([disabled])')];
      const f = re => btn.find(e => re.test(e.textContent));
      let z = null;
      /* Gefecht und Lager werden am **Zustand** erkannt, nicht am Bildschirmtext.
         Hier stand `txt.includes('VERBLEIBENDE ABENDE')` — eine Zeichenkette,
         die der Stationsbogen umbenannt hat, worauf dieser Prüfstand still
         aufhörte, den Lagerpfad überhaupt zu betreten. Derselbe Fehler wie in
         `balance.js`, dort mit gemessenen Folgen (Caporal 0 % von 80). */
      if (K)
        z = f(/Salve befehlen/) || f(/Sorgfältig zielen/) || f(/Anlegen und feuern/) || f(/^Laden/) || f(/Hinknien|Flach hinlegen/);
      if (!z && LAUF && LAUF.lager && LAUF.lager.id && LAUF.lager.abende > 0 && gunst('martel') < 4)
        z = f(/Am Feuer/);
      // Die Tempowahl: forcieren, damit der Sprung über eine Station auch
      // wirklich durchlaufen wird — ein Pfad, den sonst nichts prüft.
      if (!z) z = f(/Forcieren/);
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
