/* Der Prüfstand für das Fenster — die Nachrichten, die beim ersten Mal kommen.

   **Warum er nötig ist:** Ein Fenster wird angemeldet, während der Bildschirm
   noch gezeichnet wird, und erst im nächsten Durchlauf gemalt. Wer das nicht
   prüft, prüft nichts: `durchspielen.js` und `raenge.js` klicken es einfach
   weg und melden „Fehler: keine", ob es dastand oder nicht.

   Geprüft wird deshalb nicht, dass nichts kaputtgeht, sondern **dass jede
   Nachricht wirklich einmal dasteht** — und dass Rang 1 keine bekommt. Ein
   Prüfpunkt, der nie ausschlägt, ist keiner.

   Aufruf:  node test/fenster.js                                            */
const { chromium } = require('playwright');
const path = require('path');
const ziel = path.resolve(__dirname, '../index.html');

/* Was ein Mann dieses Rangs auf dem Weg ins erste Gefecht sehen muss.
   Rang 1 steht mit einer leeren Liste da und ist damit die Gegenprobe:
   Wer nichts erreicht hat, bekommt auch nichts erzählt. */
const PFLICHT = {
  1:  [],
  5:  ['Zwanzig Mann'],
  7:  ['Ohne Muskete'],
  10: ['Der Tisch', 'Vier Rechtecke'],
  12: ['Der Tisch', 'Die Karte', 'Befehlsausgabe', 'Sie stehen und warten']
};

(async () => {
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const fehler = [];

  for (const rang of Object.keys(PFLICHT).map(Number)) {
    const p = await b.newPage({ viewport: { width: 1280, height: 1200 } });
    p.on('pageerror', e => fehler.push(`Rang ${rang} PAGEERROR: ` + e.message));
    p.on('console', m => { if (m.type() === 'error') fehler.push(`Rang ${rang}: ` + m.text()); });

    await p.goto('file://' + ziel);
    await p.click('text=Neuen Mann aufstellen');
    await p.click('#h_schmied');
    await p.click('#startbtn');
    /* **Der Rang wird gesetzt und dann festgehalten.** Ein geheilter Mann
       überlebt und steigt auf — und dann sieht ein Lauf, der bei Rang 1
       beginnt, irgendwann jede Nachricht, und die Pflichtliste prüft nichts
       mehr. `rangSetzen()` ist seit Sitzung 2 die einzige Tür für jede
       Rangänderung; sie zuzuhalten genügt. */
    await p.evaluate(r => {
      S.rang = r; S.attr.bildung = 60;
      window.rangSetzen = () => {};
    }, rang);

    let s = 0; const alle = [];
    while (s++ < 260) {
      /* Sind alle Pflichtblätter dagewesen, ist die Frage beantwortet —
         weiterzuklicken misst nur noch Rechenzeit. Rang 1 hat keine und
         läuft deshalb bis zum Anschlag: Genau das ist seine Prüfung. */
      if (PFLICHT[rang].length && PFLICHT[rang].every(z => alle.includes(z))) break;
      /* **Geheilt wird vor jedem Schritt** — gemessen wird Vollständigkeit,
         nicht Härte, wie in `test/kapitel.js`. Ohne das entscheidet der
         Zufall, ob ein Mann den ersten Höhepunkt überhaupt erreicht, und der
         Prüfstand meldet mal vier Nachrichten und mal zwei. Wunden gehören
         mit geheilt: `wert()` zieht sie ab, und ein Knopf unter Wert 5 wird
         gesperrt. */
      /* **Und einmal die Zeitschlange leerlaufen lassen.** Ein Fenster wird
         mit `setTimeout(…,0)` gemalt, also *nach* dem Klick, der es angemeldet
         hat. Ein Browser zeichnet nie, ohne die Schlange vorher zu leeren —
         ein Prüfstand kann aber zwei Auswertungen so dicht hintereinander
         schicken, dass er dazwischen guckt. Er meldet dann ein fehlendes
         Blatt, das jeder Spieler gesehen hätte. Das eigene `setTimeout`
         hängt sich hinter das des Spiels und wartet damit auf dieselbe
         Runde. */
      await p.evaluate(() => new Promise(fertig => setTimeout(() => {
        if (typeof S === 'object' && S) {
          S.wunden = []; S.belastung = 0;
          S.leben = lebenMax(); S.atem = 100;
        }
        fertig();
      }, 0)));
      if (await p.$('#fenster')) {
        /* Zeile 2 ist die Überschrift; Zeile 1 ist bei allen „Zum ersten Mal". */
        const z = (await p.$eval('#fenster', e => e.innerText)).split('\n')[1];
        if (alle[alle.length - 1] !== z) alle.push(z);
      }
      const t = await p.$eval('#app', e => e.innerText);
      if (t.includes('Nächster Mann') || t.includes('Noch einmal, besser')) break;
      const w = (await p.$('.ueberlage')) ? null : await p.$('.ord.weiter');
      if (w) { await w.click(); continue; }
      const ok = await p.evaluate(() => {
        const btn = [...document.querySelectorAll((document.querySelector('.ueberlage') ? '.ueberlage ' : '') + '.ord:not([disabled])')];
        if (!btn.length) return false; btn[0].click(); return true;
      });
      if (!ok) break;
    }

    /* Jede Nachricht höchstens einmal — sonst wäre `S.gesehen` wirkungslos. */
    alle.forEach((z, i) => { if (alle.indexOf(z) !== i) fehler.push(`Rang ${rang}: „${z}" kam zweimal`); });
    PFLICHT[rang].forEach(z => { if (!alle.includes(z)) fehler.push(`Rang ${rang}: „${z}" FEHLT`); });
    if (!PFLICHT[rang].length && alle.length) fehler.push(`Rang ${rang}: unerwartet ${alle.join(' · ')}`);

    console.log(`Rang ${String(rang).padStart(2)}: ${alle.join(' · ') || '— kein Fenster, wie erwartet —'}`);
    await p.close();
  }

  await b.close();
  console.log(fehler.length ? 'Fehler:\n  ' + fehler.join('\n  ') : 'Fehler: keine');
  process.exit(fehler.length ? 1 : 0);
})();
