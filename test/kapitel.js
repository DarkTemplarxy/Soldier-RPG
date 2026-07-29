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

   ── Der Härtemodus ──

   **Späte Kapitel lassen sich mit `balance.js` nicht mehr messen.** Der
   Trichter frisst die Stichprobe: Von achtzig Läufen erreichen Spanien acht
   und Russland zwei, und auf zwei Läufen lässt sich nichts eichen. Die Quote
   je Kapitel, die `balance.js` seit Kapitel 7 druckt, sagt für die letzten
   Kapitel deshalb „nur 2" statt einer Zahl.

   `HAERTE=40` misst ein Kapitel **direkt**: vierzig Läufe, die an seinem
   Anfang beginnen, mit einem Mann, wie er dort ankommen würde — und **ohne
   Heilung zwischendurch**. Gemessen wird, wie viele es überstehen.

   **Der Mann ist die Eichung, nicht das Kapitel.** Er bekommt die Werte, die
   ein Veteran an dieser Stelle hätte (Attribute 55–70, Fertigkeiten 45, Rang
   nach Ausbaustand), volle Gesundheit und keine Ausrüstungsgeschenke. Wer die
   Zahlen ändert, ändert den Maßstab für alle Kapitel gleichzeitig — das ist
   Absicht: Vergleichbarkeit zwischen Kapiteln ist der ganze Zweck.

   Aufruf:  node test/kapitel.js jena
            node test/kapitel.js jena 7        (nur ein Rang)
            HAERTE=40 node test/kapitel.js russland 9   (vierzig Läufe, ungeheilt) */
const { chromium } = require('playwright');
const path = require('path');
const ziel = path.resolve(__dirname, '../index.html');
const KAP = process.argv[2] || 'jena';
const HAERTE = parseInt(process.env.HAERTE || '0', 10);
const RAENGE = process.argv[3] ? [parseInt(process.argv[3], 10)] : [1, 5, 8, 12];

/* ── Der Härtemodus ──
   Ein Lauf: an den Anfang des Kapitels springen, den Mann auf Veteranenmaß
   setzen und durchklicken, **ohne zu heilen**. Rückgabe: überlebt oder nicht,
   und an welcher Station es endete. */
async function haerteLauf(b, rang) {
  const p = await b.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + ziel);
  await p.click('text=Neuen Mann aufstellen');
  await p.click('text=Auswürfeln');
  await p.click('#h_schmied');
  await p.click('text=Weiter zu den Veteranenpunkten');
  await p.click('#startbtn');

  const start = await p.evaluate(({ kap, r }) => {
    const liste = STATIONEN[kap];
    if (!liste || !liste.length) return null;
    const i = KAPITEL.findIndex(x => x.id === liste[0].id);
    if (i < 0) return null;
    LAUF.node = i; S.rang = r;
    /* **Der Mann ist absichtlich gut und absichtlich fest.**
       Fest, damit Kapitel untereinander vergleichbar bleiben — nicht
       ausgewürfelt. Gut, weil die Zahl sonst am Boden klebt: Mit Konstitution
       70 und mittelmäßiger Ausrüstung starben in Spanien wie in Russland
       siebenunddreißig von vierzig, und zwei Kapitel, die beide 3 % liefern,
       sagen über ihren Unterschied nichts. **Ein Prüfstand ohne Kopfraum
       misst seinen eigenen Boden.** Die Ausrüstung gehört dazu, und der
       Mantel besonders: Ohne ihn misst man in Russland nur die Frostregel
       und nie das Kapitel. */
    S.attr.konstitution = 85; S.attr.geschick = 70; S.attr.kaltbluetigkeit = 70;
    S.attr.autoritaet = 70; S.attr.bildung = 60; S.attr.menschenkenntnis = 65;
    for (const k in S.fert) S.fert[k] = 60;
    S.ausr.muskete.zustand = 100; S.ausr.seitenwaffe.zustand = 100;
    S.ausr.schuhe.zustand = 100; S.ausr.tornister.zustand = 100;
    S.ausr.mantel = { name: 'Beutemantel, gewachst', zustand: 100, verschleiss: 6 };
    S.wunden = []; S.leben = lebenMax(); S.atem = 100; S.belastung = 10;
    S.ruf = 90; S.einheit = 70; S.sektionGuete = 0;
    laufSichern(); naechster();
    return { letzte: liste[liste.length - 1].id };
  }, { kap: KAP, r: rang });
  if (!start) { await p.close(); return null; }

  let s = 0, ende = 'Limit', letzterOrt = '';
  while (s++ < 700) {
    /* **Am Zustand ist der Tod nicht zu erkennen — das ist die Falle hier.**
       `zeigeTod()` setzt `LAUF=null` und ruft `binde()`, und danach ist auch
       `S` null. Genau dasselbe tut ein Kapitelende. Wer also auf `!LAUF` oder
       `!S` prüft und daraus „durch" schließt, zählt jeden Gefallenen als
       Überlebenden — die erste Fassung tat das und meldete für Spanien wie
       für Russland hundert Prozent. **Unterschieden wird am Bildschirm.** */
    const st = await p.evaluate(() => {
      if (!S || !LAUF) return { weg: true };
      if (!S.lebt) return { tot: true };
      return { ort: (KAPITEL[LAUF.node] || {}).ort || '' };
    });
    const t = await p.$eval('#app', e => e.innerText).catch(() => '');
    if (st.tot || /Nächster Mann/.test(t)) { ende = 'tot'; break; }
    if (st.weg) { ende = /Nächster Mann/.test(t) ? 'tot' : 'durch'; break; }
    if (st.ort) letzterOrt = st.ort;
    const fertig = await p.evaluate(l => {
      if (!LAUF) return true;
      const i = KAPITEL.findIndex(x => x.id === l);
      return LAUF.node > i;
    }, start.letzte);
    if (fertig) { ende = 'durch'; break; }
    const w = await p.$('.ord.weiter'); if (w) { await w.click(); continue; }
    const ok = await p.evaluate(i => {
      const btn = [...document.querySelectorAll('.ord:not([disabled])')]
        .filter(e => !/Zurückweichen|Zurückgehen/.test(e.textContent));
      if (!btn.length) return false;
      btn[i % btn.length].click(); return true;
    }, s);
    if (!ok) { ende = 'kein Knopf'; break; }
  }
  await p.close();
  return { ende, wo: letzterOrt, fehler: errs };
}

(async () => {
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const fehler = [];
  let schlecht = 0;

  if (HAERTE) {
    const rang = RAENGE.length === 1 ? RAENGE[0] : 9;
    const wo = {}; let durch = 0, tot = 0;
    for (let i = 0; i < HAERTE; i++) {
      const r = await haerteLauf(b, rang);
      if (!r) { console.log(`Kapitel „${KAP}" nicht gefunden.`); await b.close(); process.exit(1); }
      if (r.ende === 'durch') durch++;
      else { tot++; if (r.wo) wo[r.wo] = (wo[r.wo] || 0) + 1; }
      r.fehler.forEach(e => fehler.push(e));
    }
    console.log(`${KAP} · Rang ${rang} · ${HAERTE} Läufe ab Kapitelanfang, ungeheilt`);
    console.log(`\n  ÜBERSTANDEN ${durch} (${Math.round(durch / HAERTE * 100)} %)\n`);
    const orte = Object.keys(wo).sort((a, x) => wo[x] - wo[a]).slice(0, 5).map(k => `${k} ${wo[k]}`);
    if (orte.length) console.log(`Gestorben bei: ${orte.join(' · ')}`);
    console.log('Fehler:', fehler.length ? fehler.slice(0, 3) : 'keine');
    await b.close();
    process.exit(fehler.length ? 1 : 0);
  }

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
      /* **Konstitution wird mitgesetzt, aus demselben Grund wie Bildung.**
         Der Prüfstand heilt vor jedem Klick, aber er heilt nur bis
         `lebenMax()` — und das hängt am rohen Attribut. Seit der Sockel bei 15
         steht, würfelt „Auswürfeln" Männer mit Konstitution 15 aus, also
         neunundvierzig Lebenspunkten; eine Sondermissionskette kostet in drei
         Stufen bis zu sechzig, **also stirbt so einer aus voller Kraft in
         einem einzigen Klick** und der Prüfstand sieht das halbe Kapitel
         nicht. Gemessen wird hier Vollständigkeit, nicht Härte — die Härte
         misst `HAERTE=n` mit seinem eigenen, festen Prüfmann. */
      S.attr.konstitution = Math.max(S.attr.konstitution, 60);
      S.leben = lebenMax();
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
        /* **Erkannt wird am Knopf, nicht am Fließtext.** Die frühere Prüfung
           suchte unter anderem nach „gefallen" — und der Ruhestandsbildschirm
           der Rangschranke sagt wörtlich *„Du bist nicht gefallen."* Damit
           galten in Russland drei von vier Rängen als tot, die in Ehren
           ausgemustert worden waren. Die Knöpfe sind eindeutig: „Nächster
           Mann" steht nur auf dem Todesblatt, „Noch einmal, besser" nur unter
           einem Ende, das der Mann überlebt hat. */
        if (/Nächster Mann/.test(t0)) { ende = 'gestorben'; break; }
        ende = 'Kapitel zu Ende'; gesehen.add(start.letzte); break;
      }
      if (stand.tot) { ende = 'gestorben'; break; }
      if (stand.id) gesehen.add(stand.id);
      spur.push(stand.spur); if (spur.length > 24) spur.shift();
      const t = await p.$eval('#app', e => e.innerText);
      if (t.includes('Nächster Mann')) { ende = 'gestorben'; break; }
      if (t.includes('Noch einmal, besser')) { ende = 'Kapitel zu Ende'; break; }
      /* **Die Rundenzeile, nicht irgendein Wort.** Die frühere Prüfung suchte
         nach `RUNDE |PHASE |STUNDE |TAG ` im ganzen Bildschirmtext — und die
         Station „Der Tag des Regens" (1815) steht als Kartenkopf in
         Großbuchstaben da, also traf `TAG `. Vier Ränge meldeten daraufhin ein
         falsches Gefechtsbild in einer Szene, in der es gar kein Gefecht gibt.
         Gesucht wird jetzt die vollständige Zeile `<ZEIT> n VON m`. */
      if (/(RUNDE|PHASE|STUNDE|TAG) \d+ VON \d+/.test(t)) {
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

    /* **Eine Station, die der forcierte Marsch verschluckt, fehlt nicht.**
       `tempo.ueberspringt` nennt sie beim Namen; wer forciert, sieht sie
       wirklich nicht, und das ist der Preis, um den es dort geht. Ein
       Prüfstand, der das als Lücke meldet, meldet die Tempowahl als Fehler. */
    const fehlend = await p.evaluate(({ kap, ges }) => {
      const liste = STATIONEN[kap] || [];
      const uebersprungen = liste.filter(x => x.tempo && x.tempo.ueberspringt)
                                 .map(x => x.tempo.ueberspringt);
      return liste.map(x => x.id)
                  .filter(id => !ges.includes(id) && !uebersprungen.includes(id));
    }, { kap: KAP, ges: [...gesehen] });

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
