/* Der Prüfmodus über alle vierzehn Ränge. Setzt den Rang von Hand, klickt bis
   ins erste Gefecht und prüft je Maßstab, ob das Richtige da ist — und ob das
   Richtige fehlt.

   **Warum das nötig ist:** `durchspielen.js` erreicht mit vier Kapiteln Rang 8
   und nie darüber. Ohne diesen Prüfstand wären die halben Rangleiter-Knöpfe
   gebaut und ungetestet — derselbe Fehler wie ein stummer Filter, nur eine
   Ebene höher.

   **Drei der vier Brüche bestehen im Weglassen**, und genau die sind hier am
   wichtigsten: keine Muskete ab 7, keine Atemleiste ab 10, kein
   Widerstandswert ab 12. Ein Test, der nur prüft, ob neue Knöpfe da sind,
   würde alle drei durchgehen lassen.

   Aufruf:  node test/raenge.js          */
/* ── Das Fenster über dem Bildschirm ──
   **Liegt ein Blatt obenauf (`.ueberlage`), ist nur dieses bedienbar.** Der
   Rücken fängt jeden Klick ab — ein Prüfstand, der dahinter klickt, läuft
   entweder in einen Timeout oder, schlimmer, drückt einen Knopf, den ein
   Spieler gar nicht erreichen kann. Deshalb sucht jeder Prüfstand seine
   Knöpfe **zuerst im Fenster**. */
const { chromium } = require('playwright');
const path = require('path');
const ziel = path.resolve(__dirname, '../index.html');

const RAENGE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

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
    await p.click('text=Einen anderen Mann');
    await p.click('#h_schmied');
    await p.click('text=Weiter zu den Veteranenpunkten');
    await p.click('#startbtn');

    /* Rang von Hand setzen und bis zum ersten Gefecht klicken. Rang 2 ist die
       Elitekompanie und hängt am Zweig, nicht am Rang — deshalb wird er hier
       mitgesetzt, sonst prüfte man einen Fusilier mit der Zahl 2. */
    await p.evaluate(r => {
      S.rang = r; S.attr.bildung = 60;
      if(r === 2) S.zweig = 'voltigeur';
    }, rang);

    let s = 0, gesehen = {knoepfe: [], unterDir: false, nummern: false,
                          sichtfeld: false, skizze: false, rechtecke: false,
                          karte: false, atem: false, widerstand: false};
    while (s++ < 220) {
      const t = await p.$eval('#app', e => e.innerText);
      if (t.includes('Nächster Mann') || t.includes('Noch einmal, besser')) break;
      if (/(RUNDE|PHASE|STUNDE|TAG) \d+ VON \d+/.test(t)) {
        /* **Die Beschriftung steht seit dem Stationsbogen in `.label`.** Vorher
           war sie die erste Zeile des `textContent`; jetzt steht dort die
           römische Ziffer, und die Prüfung meldete zwei fehlende Knöpfe, die
           in Wahrheit dastanden. */
        gesehen.knoepfe = await p.evaluate(() =>
          [...document.querySelectorAll('.ord')].map(e => {
            const l = e.querySelector('.label');
            return (l ? l.textContent : e.textContent.split('\n')[0]).trim();
          }));
        const bilder = await p.evaluate(() => ({
          sichtfeld: !!document.querySelector('.feld svg:not([aria-label])') ||
                     !!document.querySelector('svg[aria-label^="Aufstellung"]'),
          skizze: !!document.querySelector('svg[aria-label="Handskizze der Lage"]'),
          rechtecke: !!document.querySelector('svg[aria-label="Das Bataillon in vier Kompanien"]'),
          karte: !!document.querySelector('svg[aria-label="Operationskarte"]')
        }));
        Object.assign(gesehen, bilder);
        gesehen.atem = /\bAtem\b/.test(t);
        gesehen.widerstand = /WIDERSTAND DES FEINDES/.test(t);
        /* Der Block „Unter dir" und die Frage, ob die Kompanien Namen tragen.
           Eine Nummer im Knopftext heißt: Es gibt keinen Chef dafür. */
        gesehen.unterDir = /Unter dir/i.test(t);
        gesehen.nummern = gesehen.knoepfe.some(k => /^Die \d\. Kompanie vorgehen/.test(k));
        break;
      }
      const w = (await p.$('.ueberlage')) ? null : await p.$('.ord.weiter'); if (w) { await w.click(); continue; }
      const ok = await p.evaluate(() => {
        const btn = [...document.querySelectorAll((document.querySelector('.ueberlage')?'.ueberlage ':'')+'.ord:not([disabled])')];
        const z = btn.find(e => !/Zurückweichen|Mitmachen/.test(e.textContent)) || btn[0];
        if (z) { z.click(); return true; } return false;
      });
      if (!ok) break;
    }

    // Ein paar Runden Gefecht: jeden Offiziersknopf mindestens einmal drücken.
    for (let r = 0; r < 24; r++) {
      const t = await p.$eval('#app', e => e.innerText);
      if (!/(RUNDE|PHASE|STUNDE|TAG) \d+ VON \d+/.test(t)) break;
      const ok = await p.evaluate(i => {
        const btn = [...document.querySelectorAll((document.querySelector('.ueberlage')?'.ueberlage ':'')+'.ord:not([disabled])')]
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
    /* Je Maßstab andere Pflichtknöpfe und ein anderes Bild. Was ein Rang
       *nicht* mehr hat, ist dabei so wichtig wie das, was er bekommt. */
    const soll = rang >= 12 ? ['Aufklärung anfordern', 'Warten, bis die Meldungen kommen']
      /* **Seit die Kompanien Namen tragen, heißt der Knopf nicht mehr „Die 1.
         Kompanie".** Geprüft wird deshalb der Anfang — und darunter eigens,
         dass wirklich ein Name dasteht und keine Nummer. */
      : rang >= 10 ? ['Die ']
      : rang >= 7 ? ['Den Zug vorführen', 'Das Gelände nutzen', 'Die Front verkürzen lassen', 'Den Degen ziehen']
          .concat(rang >= 8 ? ['Den Zug aus der Linie lösen'] : [])
      : rang === 6 ? ['Feuer nach Sektionen', 'Die Sergenten einteilen']
      : rang === 5 ? ['Salve auf Kommando', 'Die Glieder wechseln lassen']
      : rang >= 3 ? ['Der Korporalschaft Salve befehlen', 'Die Lücke links schließen lassen']
      : rang === 2 ? ['Sorgfältig zielen und feuern', 'Deckung wechseln']
      : ['Laden', 'Anlegen und feuern'];
    const fehlt = soll.filter(x => !gesehen.knoepfe.some(k => k.startsWith(x)));
    const musketeDa = gesehen.knoepfe.some(k => /^Laden$|Anlegen und feuern|Sorgfältig zielen/.test(k));
    const bildDa = rang >= 12 ? gesehen.karte : rang >= 10 ? gesehen.rechtecke
      : rang >= 7 ? gesehen.skizze : gesehen.sichtfeld;
    const bildName = rang >= 12 ? 'KARTE' : rang >= 10 ? 'RECHTECKE'
      : rang >= 7 ? 'SKIZZE' : 'SICHTFELD';

    let zeile = `Rang ${String(rang).padStart(2)}: ${String(gesehen.knoepfe.length).padStart(2)} Knöpfe`;
    if (fehlt.length) { zeile += ` · FEHLT: ${fehlt.join(', ')}`; schlecht++; }
    // Ab Rang 7 muss die Muskete weg sein, darunter muss sie da sein.
    if (rang >= 7 && musketeDa) { zeile += ' · MUSKETE NOCH DA'; schlecht++; }
    if (rang < 7 && !musketeDa) { zeile += ' · MUSKETE FEHLT'; schlecht++; }
    if (!bildDa) { zeile += ` · KEIN BILD (${bildName})`; schlecht++; }
    if (rang >= 10 && gesehen.atem) { zeile += ' · ATEMLEISTE NOCH DA'; schlecht++; }
    if (rang < 10 && !gesehen.atem) { zeile += ' · ATEMLEISTE FEHLT'; schlecht++; }
    if (rang >= 12 && gesehen.widerstand) { zeile += ' · WIDERSTANDSWERT NOCH DA'; schlecht++; }
    /* ── Die Kette unter dir (VERWALTUNG §2) ──
       Ab Rang 9 muss der Seitenleistenblock stehen, und ab Rang 10 müssen die
       Einheiten Namen tragen statt Nummern. **Ohne diese zwei Zeilen wäre die
       ganze Sitzung gebaut und ungeprüft** — genau der Fehler, den die
       Offiziersknöpfe schon einmal gemacht haben. */
    if (rang >= 9 && !gesehen.unterDir) { zeile += ' · KEIN BLOCK „UNTER DIR"'; schlecht++; }
    if (rang < 9 && gesehen.unterDir) { zeile += ' · BLOCK ZU FRÜH'; schlecht++; }
    if (rang >= 10 && gesehen.nummern) { zeile += ' · KOMPANIEN OHNE NAMEN'; schlecht++; }
    if (!fehlt.length && bildDa) zeile += ` · ${bildName.toLowerCase()}` +
      (rang >= 7 ? ' · Muskete weg' : '') +
      (rang >= 10 ? ' · Atem weg' : '') + (rang >= 12 ? ' · Feind nur gemeldet' : '');
    console.log(zeile);
    await p.close();
  }

  console.log('Fehler:', fehler.length ? fehler.slice(0, 6) : 'keine');
  await b.close();
  process.exit(fehler.length || schlecht ? 1 : 0);
})();
