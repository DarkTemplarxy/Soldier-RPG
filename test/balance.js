/* Misst über viele Läufe, wie weit ein Mann kommt.

   Ausgewiesen werden vier Zahlen: „Italien überstanden" (der Zielwert 45–55 %),
   „beide Feldzüge", und wie viele die Elitekompanie und den Caporal **erreicht**
   haben. Erreicht, nicht überlebt — gezählt wird der höchste Rang, den ein Mann
   je getragen hat, auch wenn er zwei Stationen später fällt. Vorher zählte das
   Skript den Rang *am Ende*, und das maß etwas anderes: Seit die Lebenspunkte
   den frühen Tod abgeschafft haben, stirbt kaum noch jemand vor der
   Beförderungsstation, und die Endrang-Zahl stieg auf 58 %, ohne dass die
   Beförderung selbst leichter geworden wäre.

   Der Bot spielt so gut, wie er ohne Vorauswissen spielen kann — verteilt seine
   Punkte bewusst, ruht, wenn er verwundet ist, besorgt sich Fürsprache, solange
   sie fehlt, und schießt sonst. Gemessen wird damit, wie hart das Spiel für
   einen kundigen Spieler ist, nicht für einen blinden.

   Aufruf:  node test/balance.js [anzahl]  */
const { chromium } = require('playwright'); // CHROMIUM=/pfad/zu/chrome setzen, falls Playwright den Browser nicht findet
const path = require('path');
const N = parseInt(process.argv[2] || '40', 10);
const ziel = path.resolve(__dirname, '../index.html');

/* ── Die Punkteverteilung ──
   120 Punkte auf fünf Attribute (Bildung ist ausgenommen), Sockel 20, höchstens
   70. Vorher drückte das Skript „Auswürfeln" — und maß damit vor allem den
   Zufallsgenerator: Weil der Tod seit den Lebenspunkten eine Schwelle ist
   (Summe des Schadens gegen den Vorrat) und der Vorrat an der Konstitution
   hängt, entschied der Wurf über den Lauf, bevor er begann. Derselbe Stand
   lieferte deshalb 48 %, 64 % und 51 %.

   Diese Verteilung ist die beste, die sich aus den zwei gebauten Kapiteln
   begründen lässt:
     Konstitution 70 — der Lebensvorrat (82 statt 64) und die Schwelle 55 für die Grenadiere
     Geschick      60 — Laden unter Beschuss, Deckung, Flicken, und die Schwelle 55 für die Voltigeure
     Kaltblütigkeit 40 — „Stehenbleiben und die Linie halten", dazu viele Szenen
     Autorität     30 — die Salve des Caporals steht und fällt damit
     Menschenkenntnis 20 — bleibt auf dem Sockel; öffnet Szenenwege, rettet aber niemanden

   Beide Elitezweige offenzuhalten kostet 90 der 120 Punkte und ist es wert:
   der Voltigeur zielt für 22–32 Schaden statt 12–20 zu feuern. */
const VERTEILUNG = { konstitution: 70, geschick: 60, kaltbluetigkeit: 40, autoritaet: 30 };

(async () => {
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const p = await b.newPage();
  const res = { tot: 0, ende: 0, italien: 0, elite: 0, caporal: 0, punkte: [] };
  for (let r = 0; r < N; r++) {
    await p.goto('file://' + ziel);
    await p.click('text=Neuen Mann aufstellen');
    await p.evaluate(v => { for (const k in v) while (ERSCH.attr[k] < v[k]) stelle(k, 10); }, VERTEILUNG);
    await p.click('#h_' + ['bauer', 'schmied', 'wilderer', 'strasse', 'fuhrmann', 'schreiber'][r % 6]);
    await p.click('text=Weiter zu den Veteranenpunkten');
    /* Der Bot kauft keine Veteranenpunkte, obwohl er welche hätte. Sonst
       wanderte die Messung: Der Vorrat ist der beste Lauf bisher, also spielte
       Lauf 80 ein anderes Spiel als Lauf 1. Alle Zahlen hier gelten für einen
       Mann ohne gekaufte Ausbildung — wer kauft, spielt leichter. */
    await p.click('#startbtn');

    let s = 0, italienGeschafft = false, hoechster = 1, zweig = null;
    while (s++ < 600) {
      const t = await p.$eval('#app', e => e.innerText);
      // Leoben ist der Übergang: wer ihn sieht, hat Italien lebend hinter sich.
      // Achtung: Kartenköpfe werden per CSS in Großbuchstaben gesetzt, und
      // innerText liefert die gerenderte Fassung — deshalb ohne Rücksicht auf Groß/Klein.
      if (!italienGeschafft && /vorfrieden/i.test(t)) { italienGeschafft = true; res.italien++; }
      if (t.includes('Nächster Mann')) { res.tot++; break; }
      if (t.includes('Noch einmal, besser')) { res.ende++; break; }
      const w = await p.$('.ord.weiter'); if (w) { await w.click(); continue; }
      const zug = await p.evaluate(() => {
        const btn = [...document.querySelectorAll('.ord:not([disabled])')];
        const f = re => btn.find(e => re.test(e.textContent));
        const txt = document.body.innerText;
        const anteil = S.leben / lebenMax();
        let z = null;

        if (K) {
          /* Gefecht. Die Reihenfolge ist die Rangfolge:
             1. Die Lücke einmal je Gefecht — Ruf +1 und drei Runden weniger Verluste.
             2. Hinknien, wenn Blut oder Luft fehlen: −22 Gefahr und +10 Atem
                wiegen eine ausgelassene Salve auf.
             3. Als Caporal immer die Salve — 26–36 Schaden, und die eigene
                Muskete bleibt geladen, man muss also nie nachladen.
             4. Sonst feuern, und zwar gezielt, wenn man Voltigeur ist.
             Das Bajonett bleibt liegen: 30–44 Schaden für +26 Gefahr und eine
             Probe gegen 45, die ein Füsilier meist verliert. */
          // Nur in den ersten beiden Runden versuchen: `lueckeGelobt` wird erst
          // bei gelungener Probe gesetzt, sonst drückte der Bot acht Runden lang
          // denselben Knopf, statt zu schießen.
          if (S.rang >= 3 && !K.lueckeGelobt && K.runde <= 2) z = f(/Lücke/);
          if (!z && (anteil <= 0.35 || S.atem <= 35)) z = f(/Hinknien|Flach hinlegen/);
          if (!z && S.rang >= 3) z = f(/Salve befehlen/);
          if (!z) z = f(/Sorgfältig zielen/) || f(/Anlegen und feuern/) || f(/Schnell feuern/);
          if (!z) z = f(/^Laden/);
        }

        else if (txt.includes('VERBLEIBENDE ABENDE')) {
          /* Lager. Erst heil werden, dann einen Fürsprecher besorgen, dann die
             Ausrüstung, dann üben. Ohne die Gunst-Regel bemühte sich der Bot nie
             um Fürsprache und würde nie befördert — gemessen würde dann nicht
             die Schwelle, sondern die Blindheit des Bots. */
          if (anteil < 0.6) z = f(/Schlafen und liegen/);
          if (!z && S.gunst < 4) z = f(/Am Feuer/);
          if (!z && S.atem < 55) z = f(/Schlafen und liegen/);
          if (!z && S.ausr.muskete.zustand < 55) z = f(/Muskete zerlegen/);
          if (!z && S.ausr.schuhe.zustand < 40 && S.geld >= 6) z = f(/Schuster/);
          if (!z && S.geld >= 4) z = f(/Scharf schießen/);
          if (!z) z = f(/Exerzieren/) || f(/Ausrüstung durchsehen/) || f(/Schlafen und liegen/);
        }

        else if (txt.includes('VERBLEIBENDE WOCHEN')) {
          // Winterquartier: die einzige Woche, die 60 % Leben und eine Wunde zurückgibt.
          if (anteil < 0.8 || S.wunden.length) z = f(/Schlafen, essen/);
          if (!z && S.gunst < 4) z = f(/Martel/);
          if (!z && S.ausr.schuhe.zustand < 70) z = f(/Ausrüstung instand/);
          if (!z) z = f(/Drillen/);
        }

        else if (f(/Zu den Voltigeuren/) || f(/Zu den Grenadieren/)) {
          // Der Voltigeur zielt für 22–32 statt für 12–20 zu feuern — kürzere
          // Gefechte heißen weniger Runden heißt weniger Treffer.
          z = f(/Zu den Voltigeuren/) || f(/Zu den Grenadieren/);
        }

        else {
          /* Szene. Auf jedem Knopf stehen Wert und Schwierigkeit („Geschick 45
             gegen 30"); genommen wird der größte Abstand. Ein Knopf ohne Probe
             gelingt immer und zählt deshalb wie ein kleiner Vorsprung. Riskante
             Wahlen sind einen Abschlag wert und fallen ganz weg, wenn es eng
             steht — sie kosten im Misserfolg eine Wunde, und eine Wunde kostet
             jetzt zehn Lebenspunkte. */
          const eng = anteil <= 0.4;
          const bewertet = btn.map(e => {
            const m = e.textContent.match(/(\d+)\s+gegen\s+(\d+)/);
            const risk = e.classList.contains('risk');
            return { e, punkte: (m ? +m[1] - +m[2] : 5) - (risk ? (eng ? 90 : 20) : 0) };
          }).sort((a, x) => x.punkte - a.punkte);
          z = bewertet.length ? bewertet[0].e : null;
        }

        if (!z) z = btn[0];
        if (z) z.click();
        return { ok: !!z, rang: S ? S.rang : 0, zweig: S ? S.zweig : null };
      });
      if (zug.rang > hoechster) hoechster = zug.rang;
      if (zug.zweig) zweig = zug.zweig;
      if (!zug.ok) break;
    }
    if (zweig) res.elite++;
    if (hoechster >= 3) res.caporal++;
    const t = await p.$eval('#app', e => e.innerText);
    const m = t.match(/Summe\s+(\d+)/); if (m) res.punkte.push(+m[1]);
  }
  const pu = res.punkte.sort((a, b) => a - b);
  const q = n => `${n} (${Math.round(n / N * 100)} %)`;
  console.log(`${N} Läufe · Italien überstanden ${q(res.italien)} · beide Feldzüge ${q(res.ende)} · gestorben ${res.tot}`);
  console.log(`Erreicht: Elitekompanie ${q(res.elite)} · Caporal ${q(res.caporal)}`);
  console.log(`Punkte: Median ${pu[Math.floor(pu.length / 2)]} · Bereich ${pu[0]}–${pu[pu.length - 1]}`);
  await b.close();
})();
