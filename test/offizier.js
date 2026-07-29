/* Prüft die Offiziersränge 7, 8 und 9 im Gefecht — ohne Kapitel, die es noch
   nicht gibt. Setzt den Rang von Hand und spielt ein Gefecht durch.

   **Warum das nötig ist:** `durchspielen.js` erreicht Rang 7 nie, weil die
   Schwellen dafür mehr Kapitel voraussetzen. Ohne diesen Prüfstand wären die
   Offiziersknöpfe gebaut und ungetestet — und das ist derselbe Fehler wie ein
   stummer Filter, nur eine Ebene höher.

   Aufruf:  node test/offizier.js          */
const { chromium } = require('playwright');
const path = require('path');
const ziel = path.resolve(__dirname, '../index.html');

const RAENGE = [7, 8, 9, 10, 11, 12, 13, 14];

(async () => {
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const fehler = [];
  let schlecht = 0;

  for (const rang of RAENGE) {
    const p = await b.newPage({ viewport: { width: 1280, height: 1200 } });
    p.on('pageerror', e => fehler.push(`Rang ${rang} PAGEERROR: ` + e.message));
    p.on('console', m => { if (m.type() === 'error') fehler.push(`Rang ${rang}: ` + m.text()); });

    await p.goto('file://' + ziel);
    await p.click('text=Neuen Mann aufstellen');
    await p.click('text=Auswürfeln');
    await p.click('#h_schmied');
    await p.click('text=Weiter zu den Veteranenpunkten');
    await p.click('#startbtn');

    // Rang von Hand setzen und bis zum ersten Gefecht klicken.
    await p.evaluate(r => { S.rang = r; S.attr.bildung = 60; }, rang);

    let s = 0, gesehen = {knoepfe: [], skizze: false, rechtecke: false, karte: false,
                          atem: false, widerstand: false};
    while (s++ < 220) {
      const t = await p.$eval('#app', e => e.innerText);
      if (t.includes('Nächster Mann') || t.includes('Noch einmal, besser')) break;
      if (/RUNDE |PHASE |STUNDE |TAG /.test(t)) {
        gesehen.knoepfe = await p.evaluate(() =>
          [...document.querySelectorAll('.ord')].map(e => e.textContent.split('\n')[0].trim()));
        const bilder = await p.evaluate(() => ({
          skizze: !!document.querySelector('svg[aria-label="Handskizze der Lage"]'),
          rechtecke: !!document.querySelector('svg[aria-label="Das Bataillon in vier Kompanien"]'),
          karte: !!document.querySelector('svg[aria-label="Operationskarte"]')
        }));
        Object.assign(gesehen, bilder);
        gesehen.atem = /\bAtem\b/.test(t);
        gesehen.widerstand = /WIDERSTAND DES FEINDES/.test(t);
        break;
      }
      const w = await p.$('.ord.weiter'); if (w) { await w.click(); continue; }
      const ok = await p.evaluate(() => {
        const btn = [...document.querySelectorAll('.ord:not([disabled])')];
        const z = btn.find(e => !/Zurückweichen|Mitmachen/.test(e.textContent)) || btn[0];
        if (z) { z.click(); return true; } return false;
      });
      if (!ok) break;
    }

    // Ein paar Runden Gefecht: jeden Offiziersknopf mindestens einmal drücken.
    for (let r = 0; r < 24; r++) {
      const t = await p.$eval('#app', e => e.innerText);
      if (!/RUNDE |PHASE |STUNDE |TAG /.test(t)) break;
      const ok = await p.evaluate(i => {
        const btn = [...document.querySelectorAll('.ord:not([disabled])')]
          .filter(e => !/Zurückweichen/.test(e.textContent));
        if (!btn.length) return false;
        btn[i % btn.length].click(); return true;
      }, r);
      if (!ok) break;
    }

    /* Je Maßstab ein anderes Bild und andere Pflichtknöpfe. Der vierte Bruch
       prüft zusätzlich, dass die Atemleiste weg ist und der Feind kein
       Widerstandsbalken mehr ist — das sind die beiden Dinge, die den Bruch
       ausmachen, und beide bestehen im Weglassen. */
    const soll = rang >= 12 ? ['Aufklärung anfordern', 'Warten, bis die Meldungen kommen']
      : rang >= 10 ? ['Die 1. Kompanie vorgehen lassen']
      : ['Den Zug vorführen', 'Das Gelände nutzen', 'Die Front verkürzen lassen', 'Den Degen ziehen']
        .concat(rang >= 8 ? ['Den Zug aus der Linie lösen'] : []);
    const fehlt = soll.filter(x => !gesehen.knoepfe.some(k => k.startsWith(x)));
    const musketeDa = gesehen.knoepfe.some(k => /^Laden$|Anlegen und feuern|Sorgfältig zielen/.test(k));
    const bildDa = rang >= 12 ? gesehen.karte : rang >= 10 ? gesehen.rechtecke : gesehen.skizze;
    const bildName = rang >= 12 ? 'KARTE' : rang >= 10 ? 'RECHTECKE' : 'SKIZZE';

    let zeile = `Rang ${rang}: ${gesehen.knoepfe.length} Knöpfe`;
    if (fehlt.length) { zeile += ` · FEHLT: ${fehlt.join(', ')}`; schlecht++; }
    if (musketeDa) { zeile += ' · MUSKETE NOCH DA'; schlecht++; }
    if (!bildDa) { zeile += ` · KEIN BILD (${bildName})`; schlecht++; }
    if (rang >= 10 && gesehen.atem) { zeile += ' · ATEMLEISTE NOCH DA'; schlecht++; }
    if (rang >= 12 && gesehen.widerstand) { zeile += ' · WIDERSTANDSWERT NOCH DA'; schlecht++; }
    if (!fehlt.length && !musketeDa && bildDa) zeile += ` · Muskete weg · ${bildName.toLowerCase()} da` +
      (rang >= 10 ? ' · Atem weg' : '') + (rang >= 12 ? ' · Feind nur gemeldet' : '');
    console.log(zeile);
    await p.close();
  }

  console.log('Fehler:', fehler.length ? fehler.slice(0, 6) : 'keine');
  await b.close();
  process.exit(fehler.length || schlecht ? 1 : 0);
})();
