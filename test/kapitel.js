/* Ein einzelnes Kapitel auf Rangoffenheit prüfen (KAMPAGNEN §0, Grundsatz 3).

   **„Jede Station trägt jeden Rang."** Das ist eine Behauptung, solange sie
   niemand prüft — und `balance.js` prüft sie nicht, weil sein Bot in vier
   Kapiteln nie über Rang 8 hinauskommt und ein Kapitel immer nur mit dem Rang
   sieht, den er sich gerade verdient hat.

   Dieses Skript setzt den Rang von Hand, springt an den Anfang eines Kapitels
   und klickt es durch — einmal als Fusilier, einmal als Sergent, einmal als
   Lieutenant, einmal als General. Geprüft wird dreierlei:

     1. Fällt etwas in die Konsole?
     2. Wird jede Station erreicht, oder hängt der Ablauf irgendwo?
     3. Läuft jedes Gefecht auf dem Maßstab des Rangs (Sichtfeld · Skizze ·
        Rechtecke · Karte)?

   Der Mann wird vor jedem Schritt geheilt. Das ist Absicht: Gemessen wird hier
   die **Vollständigkeit** des Kapitels, nicht seine Härte — die misst
   `balance.js`, und ein Toter sieht die zweite Hälfte eines Kapitels nie.

   Aufruf:  node test/kapitel.js jena
            node test/kapitel.js jena 7        (nur ein Rang)                  */
const { chromium } = require('playwright');
const path = require('path');
const ziel = path.resolve(__dirname, '../index.html');
const KAP = process.argv[2] || 'jena';
const RAENGE = process.argv[3] ? [parseInt(process.argv[3], 10)] : [1, 5, 8, 12];

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

    /* An den Anfang des Kapitels springen. Bildung und Fertigkeiten werden
       mitgesetzt, weil ein hoher Rang mit Bildung 20 Szenen sperrt, die für
       ihn geschrieben sind — dann prüfte man die Sperre und nicht die Szene. */
    const start = await p.evaluate(({ kap, r }) => {
      const liste = STATIONEN[kap];
      if (!liste || !liste.length) return null;
      const i = KAPITEL.findIndex(x => x.id === liste[0].id);
      if (i < 0) return null;
      LAUF.node = i;
      S.rang = r;
      if (r === 2) S.zweig = 'voltigeur';
      S.attr.bildung = 60;
      for (const k in S.fert) S.fert[k] = Math.max(S.fert[k], 45);
      S.verheiratet = true;
      laufSichern();
      naechster();
      return { i, n: liste.length, letzte: liste[liste.length - 1].id };
    }, { kap: KAP, r: rang });

    if (!start) { console.log(`Kapitel „${KAP}" nicht gefunden oder nicht gebaut.`); await b.close(); process.exit(1); }

    const gesehen = new Set();
    const bilder = new Set();
    const spur = [];
    let s = 0, ende = 'Limit erreicht';
    while (s++ < 700) {
      /* **Welche Station gerade dasteht, verrät `LAUF.node` nicht.**
         `stationErledigt()` zählt schon hoch, während der Ergebnisbildschirm
         noch steht (das ist Absicht — sonst ließe sich eine Wahl durch
         Beenden rückgängig machen). Ein Test, der `LAUF.node` liest, meldet
         deshalb Stationen als übersprungen, die er gerade vor sich hat.
         Gelesen wird darum der Kartenkopf, und der ist der Ort. */
      const stand = await p.evaluate(kap => {
        if (!LAUF || !S) return { weg: true };
        if (!S.lebt) return { tot: true };
        /* **Die Wunden müssen mitgeheilt werden, nicht nur das Leben.**
           `wert()` zieht Wunden von den körperlichen Werten ab, und `zeigeSzene`
           sperrt einen Knopf, dessen Wert unter 5 liegt. Ein Mann, der nach
           Jena vier offene Wunden mitschleppt, steht deshalb irgendwann vor
           einer Szene ohne einen einzigen drückbaren Knopf — und das sah aus
           wie eine Endlosschleife im Kapitel. Es war der Prüfstand. */
        S.wunden = []; S.leben = lebenMax(); S.atem = 100; S.belastung = 0;
        const koepfe = [...document.querySelectorAll('#app .ch span')].map(e => e.textContent.trim());
        const treffer = (STATIONEN[kap] || []).find(x => koepfe.includes(x.ort));
        return { id: treffer ? treffer.id : '',
                 spur: LAUF.node + ':' + (K ? 'K' + K.runde : '') + (LAUF.marsch ? 'M' : '') +
                       ':' + [...document.querySelectorAll('#app .ord')].length };
      }, KAP);
      /* Ist `LAUF` weg, ist das Kapitel abgeschlossen — die Schlussstation
         zeigt die Wertung und nicht mehr ihren eigenen Kartenkopf, also wird
         sie hier eingetragen statt über den Kopf erkannt. */
      if (stand.weg) {
        const t0 = await p.$eval('#app', e => e.innerText).catch(() => '');
        if (/Nächster Mann|Der Mann ist tot|gefallen/i.test(t0)) { ende = 'gestorben'; break; }
        ende = 'Kapitel zu Ende'; gesehen.add(start.letzte); break;
      }
      if (stand.tot) { ende = 'gestorben'; break; }
      if (stand.id) gesehen.add(stand.id);
      spur.push(stand.spur); if (spur.length > 24) spur.shift();
      const t = await p.$eval('#app', e => e.innerText);
      if (t.includes('Nächster Mann')) { ende = 'gestorben'; break; }
      if (t.includes('Noch einmal, besser')) { ende = 'Kapitel zu Ende'; break; }
      if (/RUNDE |PHASE |STUNDE |TAG /.test(t)) {
        const bild = await p.evaluate(() =>
          document.querySelector('svg[aria-label="Operationskarte"]') ? 'karte'
          : document.querySelector('svg[aria-label="Das Bataillon in vier Kompanien"]') ? 'rechtecke'
          : document.querySelector('svg[aria-label="Handskizze der Lage"]') ? 'skizze'
          : document.querySelector('svg[aria-label^="Aufstellung"]') || document.querySelector('.feld svg') ? 'sichtfeld'
          : 'KEINS');
        bilder.add(bild);
      }
      // Ist das Kapitel durchlaufen, sind wir hinter seiner letzten Station.
      const fertig = await p.evaluate(l => {
        if (!LAUF) return true;
        const i = KAPITEL.findIndex(x => x.id === l);
        return LAUF.node > i;
      }, start.letzte);
      if (fertig) { ende = 'durchgelaufen'; break; }

      const w = await p.$('.ord.weiter'); if (w) { await w.click(); continue; }
      const ok = await p.evaluate(i => {
        const btn = [...document.querySelectorAll('.ord:not([disabled])')]
          .filter(e => !/Zurückweichen|Zurückgehen/.test(e.textContent));
        if (!btn.length) return false;
        btn[i % btn.length].click(); return true;   // reihum, damit alle Optionen drankommen
      }, s);
      if (!ok) { ende = 'kein Knopf mehr'; break; }
    }

    const fehlend = await p.evaluate(({ kap, ges }) =>
      (STATIONEN[kap] || []).map(x => x.id).filter(id => !ges.includes(id)),
      { kap: KAP, ges: [...gesehen] });

    const sollBild = rang >= 12 ? 'karte' : rang >= 10 ? 'rechtecke' : rang >= 7 ? 'skizze' : 'sichtfeld';
    /* **Ab Rang 7 ist das Sichtfeld kein falsches Bild, sondern ein zweites.**
       Bricht die Linie (`K.nahkampf`), fällt der Bildschirm zwei bis drei
       Runden auf die Männer und den Rauch von 1796 zurück — der einzige
       Augenblick, in dem der Säbelwert noch etwas tut. Ein Prüfstand, der das
       als Fehler meldet, misst den Entwurf statt der Ausführung. */
    const erlaubt = rang >= 7 && rang < 10 ? [sollBild, 'sichtfeld'] : [sollBild];
    const falschesBild = [...bilder].filter(x => !erlaubt.includes(x));

    let zeile = `Rang ${String(rang).padStart(2)}: ${gesehen.size}/${start.n} Stationen · ${ende}`;
    if (bilder.size) zeile += ` · Gefechtsbild ${[...bilder].join('+')}`;
    if (fehlend.length) { zeile += ` · NICHT GESEHEN: ${fehlend.join(', ')}`; }
    if (falschesBild.length) { zeile += ` · FALSCHES BILD (soll ${sollBild})`; schlecht++; }
    if (ende === 'Limit erreicht' || ende === 'kein Knopf mehr') {
      zeile += ' · HÄNGT';
      schlecht++;
      const wo = await p.evaluate(() => ({
        koepfe: [...document.querySelectorAll('#app .ch span')].map(e => e.textContent.trim()).join(' / '),
        knoepfe: [...document.querySelectorAll('#app .ord')].map(e => e.textContent.trim().split('\n')[0].slice(0, 40)).join(' / '),
        node: LAUF ? LAUF.node : -1, id: LAUF ? (KAPITEL[LAUF.node] || {}).id : ''
      })).catch(() => ({ koepfe: '', knoepfe: '', node: -1, id: '' }));
      zeile += `\n         node ${wo.node} (${wo.id}) · Köpfe: ${wo.koepfe}\n         Knöpfe: ${wo.knoepfe}`
             + `\n         Spur: ${spur.join(' ')}`;
    }
    console.log(zeile);
    await p.close();
  }

  console.log('Fehler:', fehler.length ? fehler.slice(0, 6) : 'keine');
  await b.close();
  process.exit(fehler.length || schlecht ? 1 : 0);
})();
