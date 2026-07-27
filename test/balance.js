/* Misst über viele Läufe, wie oft Kapitel 1 überstanden wird.
   Zielwert laut CLAUDE.md: 45–55 % mit dieser (vernünftigen) Spielweise.
   Aufruf:  node test/balance.js [anzahl]  */
const { chromium } = require('playwright'); // CHROMIUM=/pfad/zu/chrome setzen, falls Playwright den Browser nicht findet
const path = require('path');
const N = parseInt(process.argv[2] || '40', 10);
const ziel = path.resolve(__dirname, '../index.html');

(async () => {
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const p = await b.newPage();
  const res = { tot: 0, ende: 0, raenge: {}, punkte: [] };
  for (let r = 0; r < N; r++) {
    await p.goto('file://' + ziel);
    await p.click('text=Neuen Mann aufstellen');
    await p.click('text=Weiter zur Erschaffung');
    await p.click('text=Auswürfeln');
    await p.click('#h_' + ['bauer', 'schmied', 'wilderer', 'strasse'][r % 4]);
    await p.click('#startbtn');
    let s = 0;
    while (s++ < 300) {
      const t = await p.$eval('#app', e => e.innerText);
      if (t.includes('Nächster Mann')) { res.tot++; break; }
      if (t.includes('Noch einmal, besser')) { res.ende++; break; }
      const w = await p.$('.ord.weiter'); if (w) { await w.click(); continue; }
      const ok = await p.evaluate(() => {
        const btn = [...document.querySelectorAll('.ord:not([disabled])')];
        const f = re => btn.find(e => re.test(e.textContent));
        const txt = document.body.innerText;
        let z = null;
        if (txt.includes('RUNDE '))
          z = f(/Salve befehlen/) || f(/Sorgfältig zielen/) || f(/Anlegen und feuern/) || f(/^Laden/) || f(/Hinwerfen/);
        // Im Lager erst Fürsprache besorgen, solange sie zur Beförderung nicht reicht.
        // Ohne das säße der Bot nie am Feuer und würde nie befördert — gemessen würde
        // dann nicht die Schwelle, sondern die Blindheit des Bots.
        if (!z && txt.includes('VERBLEIBENDE ABENDE') && +(txt.match(/Gunst Martel\s+(\d+)/) || [, 0])[1] < 4)
          z = f(/Am Feuer/);
        if (!z) z = btn.find(e => !/Zurückweichen|Mitmachen/.test(e.textContent)) || btn[0];
        if (z) { z.click(); return true; } return false;
      });
      if (!ok) break;
    }
    const t = await p.$eval('#app', e => e.innerText);
    const m = t.match(/Summe\s+(\d+)/); if (m) res.punkte.push(+m[1]);
    const rg = (t.match(/Erreichter Rang — ([^\t\n]+)/) || [, '?'])[1].trim();
    res.raenge[rg] = (res.raenge[rg] || 0) + 1;
  }
  const pu = res.punkte.sort((a, b) => a - b);
  console.log(`${N} Läufe · gestorben ${res.tot} (${Math.round(res.tot/N*100)} %) · überstanden ${res.ende} (${Math.round(res.ende/N*100)} %)`);
  console.log('Endränge:', res.raenge);
  console.log(`Punkte: Median ${pu[Math.floor(pu.length/2)]} · Bereich ${pu[0]}–${pu[pu.length-1]}`);
  await b.close();
})();
