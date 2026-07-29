/* Misst über viele Läufe, wie weit ein Mann kommt.

   **Zwei Zahlen sind die Leitzahlen, alles andere ist Beiwerk:**

     1. `überlebt` — wie viele alle gebauten Kapitel hinter sich gebracht haben.
     2. `höchster Rang` — wie viele den höchsten gebauten Rang bekommen haben.
        **Das ist eine Definition, kein fester Rang:** Mit Kapitel 4 ist der
        höchste Rang der Sergent-major (6), vorher war es der Sergent (5). Die
        Zahl wandert also mit dem Ausbaustand mit, und genau deshalb veraltet
        sie nicht — im Gegensatz zum früheren Caporal-Sollwert.

   Die erste misst, wie hart das Spiel ist, die zweite, ob die Leiter trägt. Sie
   lösen „Italien überstanden" (Band 45–55 %) und den Caporal-Anteil (Sollwert
   30 %) ab: Italien ist inzwischen das Lehrstück und lässt 90–100 % durch, und
   der Caporal ist der *unterste* erreichbare Aufstieg — beide sagen nichts mehr
   über den Stand des Spiels. Die Sollwerte stehen in CLAUDE.md.

   Erreicht, nicht überlebt — gezählt wird der höchste Rang, den ein Mann
   je getragen hat, auch wenn er zwei Stationen später fällt. Vorher zählte das
   Skript den Rang *am Ende*, und das maß etwas anderes: Seit die Lebenspunkte
   den frühen Tod abgeschafft haben, stirbt kaum noch jemand vor der
   Beförderungsstation, und die Endrang-Zahl stieg auf 58 %, ohne dass die
   Beförderung selbst leichter geworden wäre.

   Der Bot spielt so gut, wie er ohne Vorauswissen spielen kann — verteilt seine
   Punkte bewusst, ruht, wenn er verwundet ist, besorgt sich Fürsprache, solange
   sie fehlt, und schießt sonst. Gemessen wird damit, wie hart das Spiel für
   einen kundigen Spieler ist, nicht für einen blinden.

   Zwei Gemüter, weil das Spiel seit den Gefechts-Ereignissen zwei Antworten
   hat: Vorsichtig (Vorgabe) tritt nur vor, wo seine Werte es klar tragen.
   MUT=1 tritt immer vor, außer es steht um sein Leben. Der Abstand zwischen
   beiden Messungen *ist* die Balance der Ereignisse — vorsichtig soll
   überleben und wenig erreichen, mutig soll erreichen und öfter fallen.

   **Drei Messungen, nicht mehr eine.** Seit der Pool von 120 auf 60 gesenkt
   wurde, ist der Bot ohne Veteranenpunkte *genau* der Erstlauf-Spieler — und
   der soll in Ägypten sterben. Wie es im dritten oder vierten Lauf aussieht,
   misst `VP=`: Der Vorrat wird auf einen festen Betrag gesetzt und nach fester
   Rangfolge ausgegeben. Fest deshalb, weil ein mitwachsender Vorrat die
   Messung wandern ließe — Lauf 40 spielte sonst ein anderes Spiel als Lauf 1.

   **Und seit Phase E eine vierte:** `PATENT=lt` kauft ein Offizierspatent und
   misst damit die Offiziershälfte, die ein Lauf mit vier Kapiteln sonst nie
   sieht — mit vier Kapiteln endet jeder Aufstieg spätestens bei Rang 8.

   Aufruf:  node test/balance.js [anzahl]              erster Lauf, ohne Vorrat
            MUT=1 node test/balance.js [anzahl]        derselbe Mann, aber mutig
            VP=160 node test/balance.js [anzahl]       dritter Lauf, mit Vorrat
            PATENT=lt VP=260 node test/balance.js 40   der gekaufte Leutnant  */
const { chromium } = require('playwright'); // CHROMIUM=/pfad/zu/chrome setzen, falls Playwright den Browser nicht findet
const path = require('path');
const N = parseInt(process.argv[2] || '40', 10);
const MUT = process.env.MUT === '1';
const VP  = parseInt(process.env.VP || '0', 10);   // Vorrat des Veteranen, 0 = erster Lauf
/* ── Der gekaufte Offizier ──
   `PATENT=sl` oder `PATENT=lt` kauft vor dem Einrücken ein Offizierspatent.
   **Das ist die Messung, für die Phase E gebaut wurde:** Ohne sie sieht
   `balance.js` die Offiziershälfte nie, weil kein Lauf mit vier Kapiteln über
   Rang 8 hinauskommt. Der Vorrat wird dabei so gesetzt, dass er für das Patent
   reicht — sonst misst man, ob der Bot sparen kann, und nicht das Spiel. */
const PATENT = ({sl:'patent_sl', lt:'patent_lt'})[process.env.PATENT] || null;

/* Wofür ein Veteran seinen Vorrat ausgibt, in dieser Reihenfolge. Konstitution
   zuerst, weil sie der Lebensvorrat *und* die Elitegrenze ist; dann Geschick
   für den Voltigeur; dann die Muskete, weil kürzere Gefechte weniger Treffer
   heißen. Was danach kommt, kauft nur ein reicher Lauf. */
const VETERAN_ZIELE = [['konstitution',70],['geschick',70],['muskete',60],
                       ['bildung',40],['kaltbluetigkeit',60],['autoritaet',50],['bajonett',40],
                       /* Ab hier nur noch für die reichen Läufe. **Die Liste
                          muss mit dem Inhalt wachsen:** Mit fünf Kapiteln
                          bringt ein Spitzenlauf über 440 Punkte, und ein Bot,
                          der sie nicht ausgeben kann, misst einen ärmeren
                          Veteranen als den, den das Spiel tatsächlich
                          hervorbringt. */
                       ['drill',55],['taktik',50],['verwaltung',50],['menschenkenntnis',60]];
/* Bildung 40 steht bewusst vor Kaltblütigkeit: Sie ist die Schwelle zum
   Caporal-fourrier (35) und damit der einzige Weg, den ein Veteran *kaufen*
   kann — im Feld kostet sie Lagerabende und Geld. KONZEPT nennt sie „den
   eigentlichen Flaschenhals dieses Spiels". */
const ziel = path.resolve(__dirname, '../index.html');

/* Kurzname je Rang — das Skript kennt `grundwerte.js` nicht, weil es im Browser
   läuft und nicht in Node. Sieben Wörter doppelt zu halten ist billiger als
   eine Brücke zwischen beiden Welten. */
const RANG_KURZ = ['', 'Fus', 'Elite', 'Cap', 'Four', 'Serg', 'S-maj', 'S-Lt',
                   'Lt', 'Cpt', 'Chef', 'Col', 'GdB', 'GdD', 'Mar'];

/* ── Welcher Rang die zweite Leitzahl trägt ──
   **Eine Definition, kein fester Rang** (so steht es oben): gemeint ist der
   höchste Rang, den der *gebaute Inhalt* tatsächlich hergibt. Er wandert mit:

     zwei Kapitel   → 5, Sergent
     vier Kapitel   → 6, Sergent-major
     fünf Kapitel   → 9, Capitaine

   Mit Kapitel 5 erreicht ein Drittel der reichen Veteranenläufe den Capitaine;
   eine Leitzahl, die weiterhin den Sergent-major zählt, misst dann nur noch,
   wie viele überhaupt bis zur Mitte kommen. **Wer ein Kapitel anbaut, prüft
   diese Zahl mit** — und trägt die alte in CLAUDE.md nach, sonst ist der
   Vergleich mit den früheren Messreihen verloren. */
const LEITRANG = 9;
const rangKurz = r => RANG_KURZ[r] || ('R' + r);

/* ── Die Punkteverteilung ──
   60 Punkte auf fünf Attribute (Bildung ist ausgenommen), Sockel 20, höchstens
   70. Vorher drückte das Skript „Auswürfeln" — und maß damit vor allem den
   Zufallsgenerator: Weil der Tod seit den Lebenspunkten eine Schwelle ist
   (Summe des Schadens gegen den Vorrat) und der Vorrat an der Konstitution
   hängt, entschied der Wurf über den Lauf, bevor er begann. Derselbe Stand
   lieferte deshalb 48 %, 64 % und 51 %.

   Diese Verteilung ist die beste, die sich aus den zwei gebauten Kapiteln
   begründen lässt:
     Konstitution 60 — der Lebensvorrat (76) und die Schwelle 55 für die Grenadiere
     Geschick      40 — Laden unter Beschuss, Deckung wechseln, Ausrüstung flicken

   Seit der Pool auf 60 steht, ist das alles: ein gutes Attribut und ein halbes.
   Für die Voltigeure (Geschick 55) reicht es nur noch mit der Herkunft — genau
   das ist der Sinn der Senkung. Kaltblütigkeit und Autorität bleiben auf dem
   Sockel und werden im Feld verdient oder mit Veteranenpunkten gekauft. */
const VERTEILUNG = { konstitution: 60, geschick: 40 };   // 40 + 20 = 60, der ganze Pool

(async () => {
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const p = await b.newPage();
  /* ── Die Rangverteilung ──
     RANGLEITER §10 verlangt sie nach **jeder** Phase: wie viele Läufe enden auf
     welchem Rang. Die beiden Leitzahlen sagen, ob das Spiel hart genug ist und
     ob die Leiter trägt — sie sagen nicht, **wo** sie trägt. Mit vierzehn
     Rängen und vier Kapiteln ist genau das die Frage: Sammelt sich alles bei
     Rang 6, oder sieht überhaupt jemand ein Patent? */
  const res = { tot: 0, ende: 0, italien: 0, elite: 0, caporal: 0, fourrier: 0, sergent: 0, major: 0, leit: 0,
                punkte: [], raenge: {},
                /* ── Wo gestorben wird ──
                   Die Leitzahlen sagen, **wie viele** sterben; sie sagen nicht,
                   **wo**. Für jede Frage der Art „warum stirbt dieser Mann so
                   oft" ist das die erste Zahl, die man braucht — und sie ist
                   billig, weil das Chronikblatt Ort und Station ohnehin
                   mitschreibt. */
                sterbeort: {}, sterbestation: [],
                /* ── Die Sterblichkeit je Kapitel ──
                   **`überlebt` läuft aus, und zwar rechnerisch.** Die Zahl ist
                   ein Produkt: Sieben Kapitel zu je rund fünfzig Prozent
                   ergeben einstellige Werte, bei elf wird sie für jeden
                   Spielertyp null. Dann misst sie nur noch, dass es viele
                   Kapitel gibt — dieselbe Alterung, die schon „höchster Rang"
                   erwischt hat, als er den Sergent-major zählte.

                   Was nicht mit dem Ausbaustand schrumpft, ist die Quote je
                   Kapitel: **von denen, die Kapitel N erreichen, wie viele
                   überstehen es.** Sie ist über den ganzen Ausbau vergleichbar
                   und sagt sofort, welches Kapitel die Wand ist. */
                erreicht: {} };
  /* Reihenfolge der Kapitel, für die Quote je Kapitel. Muss zur Zuordnung
     unten passen (dort wird aus der Jahreszahl der Kapitelname gewonnen). */
  const KAPITEL_FOLGE = ['Italien','Ägypten','Garnison','Austerlitz','Jena','Eylau','Spanien','Russland'];
  /* Die Gesamtzahl der Stationen kommt aus dem Spiel, nicht aus dem Skript —
     sie stand hier als „von 64" fest und war mit dem fünften Kapitel falsch. */
  let STATIONSZAHL = 0;
  for (let r = 0; r < N; r++) {
    await p.goto('file://' + ziel);
    /* Der Vorrat wird bei **jedem** Lauf neu gesetzt, auch auf 0. Sonst ließe
       die Chronik im localStorage ihn über die Läufe hinweg anwachsen, und die
       Messung wanderte. */
    await p.evaluate(v => { META.vp = v; }, VP);
    // Die Patente sind erst ab einem einmal getragenen Rang im Laden sichtbar.
    if (PATENT) await p.evaluate(() => { META.bestRang = 8; });
    await p.click('text=Neuen Mann aufstellen');
    /* Die Abbruchbedingung prüft, ob sich etwas bewegt hat — `stelle()` weigert
       sich stumm, wenn der Pool leer ist, und eine Prüfung auf den Zielwert
       allein hinge dann für immer. */
    await p.evaluate(v => {
      for (const k in v){
        while (ERSCH.attr[k] < v[k]){
          const vorher = ERSCH.attr[k];
          stelle(k, 10);
          if (ERSCH.attr[k] === vorher) break;
        }
      }
    }, VERTEILUNG);
    await p.click('#h_' + ['bauer', 'schmied', 'wilderer', 'strasse', 'fuhrmann', 'schreiber'][r % 6]);
    await p.click('text=Weiter zu den Veteranenpunkten');
    // Das Patent zuerst — es ist die teuerste Einzelentscheidung des Ladens.
    if (PATENT) await p.evaluate(id => waehle(id), PATENT);
    // Der Veteran gibt seinen Vorrat nach fester Rangfolge aus; bei VP=0 nichts.
    if (VP > 0) await p.evaluate(ziele => {
      for (const [k, bis] of ziele){
        for(;;){
          if (istWert(k) + (PUNKTE[k]||0) + PUNKT_SCHRITT > bis) break;
          const vorher = PUNKTE[k]||0;
          stellePunkt(k, PUNKT_SCHRITT);
          if ((PUNKTE[k]||0) === vorher) break;      // der Vorrat reicht nicht mehr
        }
      }
    }, VETERAN_ZIELE);
    await p.click('#startbtn');
    if (!STATIONSZAHL) STATIONSZAHL = await p.evaluate(() => KAPITEL.length);

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
      const zug = await p.evaluate((MUT) => {
        const btn = [...document.querySelectorAll('.ord:not([disabled])')];
        const f = re => btn.find(e => re.test(e.textContent));
        const txt = document.body.innerText;
        const anteil = S.leben / lebenMax();
        let z = null;

        if (K && K.ereignis) {
          /* Ereignis-Frage: wie eine Szene behandeln — größter Abstand zwischen
             Wert und Schwierigkeit, Risiko mit Abschlag, bei wenig Blut gar
             nicht. Der kundige Spieler tritt vor, wenn seine Werte es tragen. */
          const eng = anteil <= 0.4;
          const bewertet = btn.map(e => {
            const m = e.textContent.match(/(\d+)\s+gegen\s+(\d+)/);
            const risk = e.classList.contains('risk');
            return { e, punkte: (m ? +m[1] - +m[2] : 5) - (risk ? (eng ? 90 : (MUT ? -10 : 20)) : 0) };
          }).sort((a, x) => x.punkte - a.punkte);
          z = bewertet.length ? bewertet[0].e : null;
        }

        else if (K) {
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
          /* ── Ab Rang 12: der Stab ──
             **Die Reihenfolge ist wieder eine andere**, weil nichts mehr
             sofort wirkt. Zuerst aufklären (das verkleinert den Fehler in
             allen späteren Meldungen), dann Befehle geben, solange Verbände
             ohne Order dastehen, die Reserve erst, wenn der Feind wankt —
             und sonst warten. Warten ist hier eine Handlung, keine Lücke. */
          if (S.rang >= 12) {
            if (!(K.aufklaerung > 0)) z = f(/Aufklärung anfordern/);
            if (!z) z = f(/^Befehl an die/);
            if (!z && !K.reserveWeg && K.feindMoral < 45) z = f(/Reserve einsetzen/);
            if (!z) z = f(/Warten, bis die Meldungen/);
          }
          /* ── Rang 10 und 11: das Bataillon ──
             Die Vorhut-Wahl ist keine Optimierung, sondern eine Entscheidung;
             der Bot nimmt die Kompanie mit der besten Haltung, weil das die
             ist, die am längsten steht. Danach staffeln, bevor sie bricht. */
          else if (S.rang >= 10) {
            if (K.vorhut == null) {
              const best = (K.kompanien || []).reduce((b, k, i, a) => a[b].haltung >= k.haltung ? b : i, 0);
              z = f(new RegExp('Die ' + (best + 1) + '\\. Kompanie vorgehen'));
            }
            if (!z && K.kompanien && K.kompanien[K.vorhut] && K.kompanien[K.vorhut].haltung < 35) z = f(/Kompanien staffeln/);
            if (!z && K.kompanien && K.kompanien.some(k => k.haltung < 30)) z = f(/Gebrochenen sammeln/);
            if (!z && !K.gemeldet) z = f(/Verstärkung/);
            if (!z && S.rang >= 11 && !K.adlerVorn && K.feindMoral > 40) z = f(/Adler nach vorn/);
            if (!z) z = f(/Schwerpunkt verlegen/) || f(/Kompanien staffeln/);
          }
          /* ── Ab Rang 7: der Offizier ──
             **Die Reihenfolge ist eine andere als bei allen Rängen davor**,
             weil es keinen eigenen Schuss mehr gibt. Zuerst das Gelände (drei
             Runden −12 Gefahr, einmal je Gefecht), dann die Front verkürzen,
             wenn der Zug abbaut, dann der Degen, wenn es kippt — und sonst
             immer der Feuerbefehl, weil er das Einzige ist, das Schaden macht.

             **Wer dem Bot das nicht beibringt, misst wieder seine Blindheit
             und nicht das Spiel** — dieselbe Lektion wie damals bei der Gunst
             und bei der Regimentsschule. Der gelöste Zug bleibt bewusst außen
             vor: Er ist ein Handel, kein Handgriff, und ein Bot, der ihn immer
             drückt, misst nicht, ob er sich lohnt. */
          else if (S.rang >= 7) {
            if (K.nahkampf > 0) z = f(/Den Säbel nehmen|Stehenbleiben/);
            if (!z && !(K.gelaendeVorteil > 0)) z = f(/Gelände nutzen/);
            if (!z && K.sektion != null && K.sektion < 70) z = f(/Front verkürzen/);
            if (!z && !K.degenGezogen && K.sektion != null && K.sektion < 45) z = f(/Degen ziehen/);
            if (!z && (anteil <= 0.3 || S.atem <= 30)) z = f(/In Deckung gehen/);
            if (!z) z = f(/Den Zug vorführen/);
          }
          if (!z && S.rang >= 3 && S.rang < 5 && !K.lueckeGelobt && K.runde <= 2) z = f(/Lücke/);
          // Ab Sergent: erst die Sektion schließen, dann die Salve. Wer die
          // Sektion verkommen lässt, verliert die Fürsprache des Lieutenants.
          if (!z && S.rang >= 5 && !K.sektionGelobt && K.runde <= 2) z = f(/Schließen und halten/);
          if (!z && S.rang >= 5 && K.sektion != null && K.sektion < 70) z = f(/Glieder wechseln/);
          if (!z && (anteil <= 0.35 || S.atem <= 35)) z = f(/Hinknien|Flach hinlegen/);
          /* Ab Rang 6 der Zug: Rollendes Feuer ist der Kern — es wirkt drei
             Runden lang auch dann, wenn man nichts tut, also erneuert man es,
             sobald es ausläuft, statt jede Runde etwas anderes zu drücken. */
          if (!z && S.rang >= 6 && !(K.rollend > 0)) z = f(/Feuer nach Sektionen/);
          if (!z && S.rang >= 6 && K.sektion != null && K.sektion < 75) z = f(/Sergenten einteilen/);
          if (!z && S.rang === 5) z = f(/Salve auf Kommando/);
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
          /* ── Ab Rang 7 ist das Lager ein anderes Lager ──
             Muskete und Exerzieren sind weg; dafür gibt es den Fechtboden (die
             einzige Quelle, aus der der Säbel noch wächst), den Zug und ab
             Rang 8 den Adjutantenauftrag, der Vernets Fürsprache trägt.

             **Die Kompaniekasse nimmt der Bot immer ehrlich.** Ein Bot, der
             unterschlägt, misst nicht das Spiel, sondern das Strafsystem — und
             die Entscheidung ist eine moralische, nicht eine optimale. Wer die
             andere Seite messen will, ändert diese eine Zeile und sagt dazu,
             dass er es getan hat. */
          if (!z && S.rang >= 9) z = f(/Kasse ausgeben, wie sie vorgesehen/);
          if (!z && S.rang >= 8 && gunst('vernet') < 4) z = f(/Auftrag des Bataillons/);
          if (!z && S.rang >= 7) z = f(/Fechtboden/) || f(/Zug selbst antreten/) || f(/Karten des Abschnitts/);
          if (!z && gunst('martel') < 4) z = f(/Am Feuer/);
          /* Die Leiter verlangt jetzt verschiedene Fürsprecher und Bildung 35.
             Wem man das nicht beibringt, der misst wieder die Blindheit des
             Bots statt der Schwelle — dieselbe Lektion wie bei der Gunst. */
          if (!z && S.rang >= 5) z = f(/zwanzig Mann exerzieren|Rekruten für deine Sektion/);
          if (!z && S.rang >= 4) z = f(/Listen der Kompanie/);
          if (!z && S.rang === 3 && S.attr.bildung < 35 && S.geld >= 5) z = f(/Buchstaben lernen/);
          if (!z && S.rang >= 3 && gunst('berthaud') < 4) z = f(/acht Mann drillen|Listen der Kompanie/);
          if (!z && S.atem < 55) z = f(/Schlafen und liegen/);
          if (!z && S.ausr.muskete.zustand < 55) z = f(/Muskete zerlegen/);
          if (!z && S.ausr.schuhe.zustand < 40 && S.geld >= 6) z = f(/Schuster/);
          if (!z && S.geld >= 4) z = f(/Scharf schießen/);
          if (!z) z = f(/Exerzieren/) || f(/Ausrüstung durchsehen/) || f(/Schlafen und liegen/);
        }

        else if (txt.includes('VERBLEIBENDE WOCHEN')) {
          /* Winterquartier **und** Garnisonssaison — dieselbe Maschine, zwei
             sehr verschiedene Fragen. Im Winterquartier zwischen zwei Feldzügen
             geht es ums Heilwerden; in der Garnison ist der Feind die Zeit, und
             wer sie vertrödelt, sitzt in fünf Jahren bei Bildung 20 fest.

             **Die Reihenfolge ist die Lektion des Kapitels.** Bildung zuerst,
             solange die Schwellen nicht stehen (35 für den Fourrier, 50 für den
             Offizier später) — sonst misst das Skript wieder die Blindheit des
             Bots und nicht das Spiel. Dieselbe Regel wie damals bei der Gunst. */
          if (anteil < 0.8 || S.wunden.length) z = f(/Schlafen, essen/);
          // Garnison: die Regimentsschule ist das einzige Fenster für Bildung
          if (!z && S.attr.bildung < 50) z = f(/Regimentsschule/);
          /* Rang 6 hängt an Vernet, und die einzige Quelle, die schon einem
             Sergenten offensteht, ist „dem Capitaine die Berichte schreiben".
             Wer das dem Bot nicht beibringt, misst wieder seine Blindheit. */
          if (!z && S.rang >= 5 && gunst('vernet') < 3) z = f(/Berichte schreiben/);
          if (!z && S.rang >= 5) z = f(/Rekruten des Jahrgangs|Berichte schreiben/);
          if (!z && S.rang >= 4 && gunst('collot') < 4) z = f(/Magazin verwalten/);
          if (!z && gunst('martel') < 4) z = f(/Martel|Wirtshaus/);
          if (!z && S.ausr.schuhe.zustand < 55 && S.geld >= 18) z = f(/Marketender/);
          if (!z && S.ausr.schuhe.zustand < 70) z = f(/Ausrüstung instand/);
          if (!z && S.geld < 20) z = f(/Nebenher arbeiten/);
          if (!z) z = f(/Drillen/) || f(/Fechtboden/) || f(/Schlafen, essen/);
        }

        /* ── Die Tempowahl (ab Kapitel 5) ──
           **Schonend nimmt der Bot nie.** Ruf −2 ist die Währung, in der die
           ganze Leiter rechnet; ein Bot, der sie verschenkt, misst nicht das
           Spiel, sondern seine eigene Vorsicht. Die Frage ist also nur, ob
           forciert oder nach Vorschrift — und die entscheidet der Zustand:
           Atem −25 und doppelter Verschleiß sind bezahlbar, solange Blut und
           Luft da sind, und ruinös, wenn nicht.

           Der mutige Bot forciert fast immer. Der Abstand zwischen beiden
           Gemütern *ist* die Balance dieser Wahl. */
        else if (f(/Forcieren/)) {
          /* `^Forcieren` traf nie: `textContent` eines Knopfes beginnt mit dem
             Zeilenumbruch aus dem Markup. Der Bot fiel deshalb in den
             Szenen-Zweig und drückte immer den ersten Knopf — also „schonend",
             die eine Wahl, die ein kundiger Spieler nie trifft. Zwei Messreihen
             lang war das die Blindheit des Bots und nicht das Spiel. */
          const fz = f(/Forcieren/);
          const lohnt = fz.hasAttribute('data-gewinn');    // steht als Satz auf dem Knopf
          /* **Der Vorsichtige forciert nur, wenn es billig ist.** Die erste
             Fassung ließ ihn bei halbem Blut losmarschieren — gemessen
             überlebte der Veteran mit 160 VP damit seltener (13 %) als der
             Erstläufer ohne Vorrat (23 %), weil nur der Veteran überhaupt die
             Kraft hat, in die Falle zu laufen. **Eine Progression, die sich
             umdreht, misst nicht das Spiel, sondern die Leichtfertigkeit des
             Bots.** Ein kundiger Spieler forciert frisch und gut beschuht,
             nicht angeschlagen und nicht vor einem Höhepunkt. */
          const frisch = anteil > 0.8 && S.atem > 70 && S.ausr.schuhe.zustand >= 40;
          const tragfaehig = MUT ? anteil > 0.35 : (lohnt && frisch);
          z = tragfaehig ? fz : f(/Nach Vorschrift/);
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
            return { e, punkte: (m ? +m[1] - +m[2] : 5) - (risk ? (eng ? 90 : (MUT ? -10 : 20)) : 0) };
          }).sort((a, x) => x.punkte - a.punkte);
          z = bewertet.length ? bewertet[0].e : null;
        }

        if (!z) z = btn[0];
        if (z) z.click();
        return { ok: !!z, rang: S ? S.rang : 0, zweig: S ? S.zweig : null };
      }, MUT);
      if (zug.rang > hoechster) hoechster = zug.rang;
      if (zug.zweig) zweig = zug.zweig;
      if (!zug.ok) break;
    }
    if (zweig) res.elite++;
    if (hoechster >= 3) res.caporal++;
    if (hoechster >= 4) res.fourrier++;
    if (hoechster >= 5) res.sergent++;
    if (hoechster >= 6) res.major++;
    if (hoechster >= LEITRANG) res.leit++;
    res.raenge[hoechster] = (res.raenge[hoechster] || 0) + 1;
    const t = await p.$eval('#app', e => e.innerText);
    const m = t.match(/Summe\s+(\d+)/); if (m) res.punkte.push(+m[1]);
    const d = await p.evaluate(() => {
      const c = META.chronik[META.chronik.length-1] || {};
      return {gefallen: !!c.gefallen, ort: c.ort||'', stationen: c.stationen|0};
    });
    if (d.gefallen) {
      /* Das Kapitel steht nicht im Blatt, wohl aber das Datum der letzten
         Station — und die Jahreszahl ist eindeutig. */
      const j = (d.ort.match(/1[78]\d\d/) || ['?'])[0];
      const kap = j <= '1797' ? 'Italien' : j <= '1799' ? 'Ägypten'
                : j <= '1804' ? 'Garnison' : j <= '1805' ? 'Austerlitz' : j <= '1806' ? 'Jena' : j <= '1807' ? 'Eylau' : j <= '1811' ? 'Spanien' : 'Russland';
      res.sterbeort[kap] = (res.sterbeort[kap]||0) + 1;
      res.sterbestation.push(d.stationen);
      /* Erreicht hat er jedes Kapitel bis einschließlich dem, in dem er
         gestorben ist. */
      const bis = KAPITEL_FOLGE.indexOf(kap);
      KAPITEL_FOLGE.slice(0, bis+1).forEach(k => res.erreicht[k] = (res.erreicht[k]||0)+1);
    } else {
      KAPITEL_FOLGE.forEach(k => res.erreicht[k] = (res.erreicht[k]||0)+1);
    }
  }
  const pu = res.punkte.sort((a, b) => a - b);
  const q = n => `${n} (${Math.round(n / N * 100)} %)`;
  console.log(`${N} Läufe · ${VP?`Veteran mit ${VP} VP`:'erster Lauf, ohne Vorrat'} · ${MUT?'mutig':'vorsichtig'}`
    + (PATENT ? ` · mit Patent (${PATENT === 'patent_lt' ? 'Lieutenant' : 'Sous-Lieutenant'})` : ''));
  /* Die beiden Leitzahlen zuerst und für sich — sie tragen die Sollwerte.
     Wer eine Änderung beurteilt, liest diese Zeile und sonst nichts. */
  console.log(`\n  ÜBERLEBT ${q(res.ende)}   ·   HÖCHSTER RANG (${rangKurz(LEITRANG)}) ${q(res.leit)}\n`);
  console.log(`Italien überstanden ${q(res.italien)} (Lehrstück, kein Sollwert) · gestorben ${res.tot}`);
  console.log(`Weitere Ränge erreicht: Elitekompanie ${q(res.elite)} · Caporal ${q(res.caporal)} · Fourrier ${q(res.fourrier)} · Sergent ${q(res.sergent)}`);
  console.log(`Punkte: Median ${pu[Math.floor(pu.length / 2)]} · Bereich ${pu[0]}–${pu[pu.length - 1]}`);
  const verteilung = Object.keys(res.raenge).map(Number).sort((a, b) => a - b)
    .map(r => `${r} ${rangKurz(r)} ${res.raenge[r]}`).join(' · ');
  console.log(`Rangverteilung (höchster je Lauf): ${verteilung}`);
  /* Die Quote je Kapitel — die Zahl, die nicht mit dem Ausbaustand schrumpft. */
  const jeKapitel = KAPITEL_FOLGE.filter(k => res.erreicht[k])
    .map(k => { const e = res.erreicht[k], t = res.sterbeort[k]||0;
                return `${k} ${Math.round((1-t/e)*100)} %${e<15?' (nur '+e+')':''}`; });
  if (jeKapitel.length) console.log(`Überstanden je Kapitel (von denen, die es erreichen): ${jeKapitel.join(' · ')}`);
  if (res.sterbestation.length) {
    const mittel = Math.round(res.sterbestation.reduce((a, x) => a + x, 0) / res.sterbestation.length * 10) / 10;
    console.log(`Gestorben in: ${Object.keys(res.sterbeort).map(k => `${k} ${res.sterbeort[k]}`).join(' · ')}`
      + ` · im Schnitt bei Station ${mittel} von ${STATIONSZAHL}`);
  }
  await b.close();
})();
