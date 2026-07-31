/* Misst über viele Läufe, wie weit ein Mann kommt.

   **Zwei Zahlen sind die Leitzahlen, alles andere ist Beiwerk:**

     1. `Weite` — der **Median der erreichten Stationen**, immer mit Nenner.
        Sie hat `überlebt` abgelöst: Das war ein *Produkt* über alle
        Kapitelquoten und geht mit jedem Kapitel gegen null — bei elf liefert es
        für jeden Spielertyp dasselbe. Ein Median hat kein Verfallsdatum, aber
        er ist eine absolute Stationszahl und wandert mit dem Ausbaustand.
        **32 von 163 ist nicht schlechter als 58 von 122, sondern etwas
        anderes.**
     2. `höchster Rang` — wie viele `LEITRANG` erreicht haben. **Das ist eine
        Definition, kein fester Rang:** Er steht heute auf **9 (Capitaine)** und
        wandert mit dem gebauten Inhalt. Wer ein Kapitel anbaut, prüft ihn mit.

   Die erste misst, wie hart das Spiel ist, die zweite, ob die Leiter trägt. Sie
   lösen „Italien überstanden" (Band 45–55 %) und den Caporal-Anteil (Sollwert
   30 %) ab: Italien ist inzwischen das Lehrstück und lässt 90–100 % durch, und
   der Caporal ist der *unterste* erreichbare Aufstieg — beide sagen nichts mehr
   über den Stand des Spiels. Die Sollwerte stehen in CLAUDE.md.

   `überlebt` wird als „Ganz durch" weiter mitgedruckt, trägt aber keinen
   Sollwert mehr.

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

   Aufruf:  node test/balance.js 80                    erster Lauf, ohne Vorrat
            MUT=1 node test/balance.js 80              derselbe Mann, aber mutig
            VP=5800 node test/balance.js 80            der Maximalveteran
            PATENT=lt VP=5800 node test/balance.js 40  der gekaufte Leutnant

   **80 Läufe sind der Normalfall.** Die Regel „bei Zweifeln 80" hat mehrfach
   eine Fehldeutung verhindert; bei 40 liegt eine Standardabweichung schon bei
   rund sieben Punkten.  */
/* ── Das Fenster über dem Bildschirm ──
   **Liegt ein Blatt obenauf (`.ueberlage`), ist nur dieses bedienbar.** Der
   Rücken fängt jeden Klick ab — ein Prüfstand, der dahinter klickt, läuft
   entweder in einen Timeout oder, schlimmer, drückt einen Knopf, den ein
   Spieler gar nicht erreichen kann. Deshalb sucht jeder Prüfstand seine
   Knöpfe **zuerst im Fenster**. */
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
/* HEBEL=1 hängt Zähler um Fürsprache, Auftrag und Folgen — siehe unten. */
const HEBEL = process.env.HEBEL === '1';

/* ── Die Einkaufsliste des Veteranen, eine einzige Reihenfolge ──

   **Punkte und Stücke stehen in *einer* Liste, und das ist der Kern.** Die
   erste Fassung trennte beides: erst alle Stücke, dann die Punkte. Gemessen
   war das ein Bot-Artefakt und keine Balance — ein Veteran mit 160 VP gab
   135 davon für Mantel, Schuhe und zwei Gewohnheiten aus und hatte für
   Konstitution **fünfundzwanzig** übrig. Er lief also mit den Attributen
   eines Erstläufers und guten Angewohnheiten los, und die Rangquote fiel von
   30 auf 15 %. Kein Mensch kauft so.

   Umgekehrt geht es auch nicht — wer zuerst alle Punkte verteilt, hat für
   ein Stück mit festem Preis nie wieder genug übrig, weil Punkte beliebig
   teilbar sind und Stücke nicht.

   **Also abwechselnd, in der Reihenfolge, in der ein Mann es täte, der weiß,
   woran er zuletzt gestorben ist:** zuerst der Lebensvorrat, dann der Mantel,
   dann das, was ihn durch Ägypten bringt, und der Rest, wenn noch etwas da
   ist. `['k', id]` ist ein Stück, `['w', name, bis]` ein Wert. */
const VETERAN_PLAN = [
  /* ── Die billigen Leiterstufen zuerst ──
     **Seit dem Umbau des Ladens beginnt er nicht mehr bei 200.** Muskete und
     Schuhe auf Stufe 2 kosten zusammen 165 VP; für einen Veteranen ist das
     Kleingeld, und für die Messung ist es der Posten, der zuerst greift.
     Das Schreibzeug steht früh, weil Bildung die Schwelle zum Fourrier (35)
     und zum Sous-Lieutenant (50) ist und im Feld einen Lagerabend kostet. */
  ['k','muskete_depot'], ['k','schuhe_neu'], ['k','schreibzeug'],
  ['w','konstitution',70],      // der Lebensvorrat zuerst — er ist die Schwelle des Todes
  ['k','mantel_gut'],           // Eylau und Russland
  ['w','geschick',70],          // Voltigeur, und die zweite Elitegrenze
  ['k','zaeh_wasser'],          // Ägypten tötet mehr Veteranen als jedes andere Kapitel
  ['w','muskete',60],           // kürzere Gefechte heißen weniger Runden mit Treffern
  ['k','muskete_gut'],          // Stufe 3 ersetzt Stufe 2 — der Laden räumt selbst auf
  ['k','schuhe_gut'], ['k','zaeh_fuesse'],
  /* Bildung 40 steht bewusst hier: Sie ist die Schwelle zum Caporal-fourrier
     (35) und der einzige Weg, den ein Veteran *kaufen* kann — im Feld kostet
     sie Lagerabende und Geld. KONZEPT nennt sie „den eigentlichen Flaschenhals
     dieses Spiels". */
  ['w','bildung',40],
  ['k','zaeh_nachzuegler'],     // Spanien und Russland
  ['w','kaltbluetigkeit',60],
  ['k','zaeh_schlaf'], ['k','zaeh_narben'],
  /* Ab hier nur noch für die reichen Läufe. **Die Liste muss mit dem Inhalt
     wachsen:** Mit elf Kapiteln bringt ein Spitzenlauf über 500 Punkte, und
     ein Bot, der sie nicht ausgeben kann, misst einen ärmeren Veteranen als
     den, den das Spiel tatsächlich hervorbringt. */
  ['w','autoritaet',50], ['w','bajonett',40], ['w','drill',55],
  ['w','taktik',50], ['w','verwaltung',50], ['w','menschenkenntnis',60],
  /* Die oberen Leiterstufen und die Freischaltungen. Was gesperrt ist, fällt
     in `waehle()` von allein weg — der Bot muss nichts davon wissen. */
  ['k','uniform_gut'], ['k','besteck'], ['k','amulett'], ['k','tornister_gut'],
  ['k','uhr'], ['k','fernrohr'], ['k','degen'], ['k','geld_gross'],
  ['k','muskete_manu'], ['k','stiefel'], ['k','winter'], ['k','pferd_kav'],
  /* ── Die zweite Runde: alles auf 70 ──
     **Das ist das erklärte Ziel der neuen Ökonomie** — ein perfekter Lauf bis
     Waterloo soll reichen, um jeden Wert auf 70 zu heben (4 950 VP für alle
     fünfzehn). Die Liste geht deshalb ein zweites Mal durch, jetzt in die
     Breite statt in die Spitze: Erst die Werte, an denen ein Mann stirbt, dann
     die, an denen er scheitert.

     **Die Reihenfolge ist die Antwort auf einen gemessenen Befund:** Ägypten
     tötet Veteranen an ihren *Lücken* (Fouragieren, Feldchirurgie), nicht an
     ihren Spitzen. Wer nur Muskete und Konstitution kauft, marschiert in
     dieselbe Wand wie vorher. */
  ['w','konstitution',85], ['w','fouragieren',70], ['w','feldchirurgie',70],
  ['w','geschick',80],     ['w','muskete',80],     ['w','kaltbluetigkeit',75],
  ['w','bildung',70],      ['w','drill',70],       ['w','autoritaet',70],
  ['w','menschenkenntnis',70], ['w','taktik',70],  ['w','verwaltung',70],
  ['w','bajonett',70],     ['w','reiten',70],      ['w','kartenkunde',70]
];
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
/* Seit der Sockel auf 15 steht und die Erschaffung in Fünfern schreitet:
   45 + 15 = 60, der ganze Pool, exakt aufgehen. Vorher (Sockel 20, Zehner)
   waren es 40 + 20. */
/* Steht nur noch als Erinnerung da, wonach der Bot beim Würfeln aussucht —
   verteilt wird nichts mehr, siehe den Kommentar bei `wuerfeln()` unten. */
const VERTEILUNG = { konstitution: 60, geschick: 30 };

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
                /* Läufe, die weder gestorben noch angekommen sind — Klickbudget
                   erschöpft oder kein Knopf mehr da. Sie gehen in keine Quote
                   ein und werden laut gemeldet: **Ein Prüfstand, der seine
                   eigene Obergrenze verschweigt, misst sich selbst.** */
                abbruch: 0,
                /* Wie oft der Bot eine als riskant markierte Wahl genommen hat,
                   und wie viele Wahlen er insgesamt hatte. Erst das Verhältnis
                   macht `OFFEN.md` Punkt 2 entscheidbar. */
                risk: 0, wahlen: 0,
                /* Die drei Schranken von Rang 12, je Lauf am Ende ausgelesen —
                   Ruf, Grandmaisons Fürsprache, Bulletins. OFFEN.md Punkt 12. */
                schranke: {ruf: [], gm: [], bul: [], ziel: [], wer: []},
                /* ── Wo gestorben wird ──
                   Die Leitzahlen sagen, **wie viele** sterben; sie sagen nicht,
                   **wo**. Für jede Frage der Art „warum stirbt dieser Mann so
                   oft" ist das die erste Zahl, die man braucht — und sie ist
                   billig, weil das Chronikblatt Ort und Station ohnehin
                   mitschreibt. */
                sterbeort: {}, sterbeplatz: {}, sterbestation: [], weite: [],
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
  /* ── Die Kapitelliste kommt aus dem Spiel, nicht aus dem Skript ──
     ⚠ **Sie stand hier als fester Satz von ACHT Namen, während elf gebaut
     sind.** Und die Zuordnung lief über die Jahreszahl im Stationsdatum, mit
     `<= '1811' ? 'Spanien' : 'Russland'` als letztem Zweig — **jeder Tote von
     1813, 1814 und 1815 wurde damit als Russland gezählt.** Leipzig, Laon und
     Waterloo gab es in dieser Statistik nicht.
     Dieselbe Fehlerfamilie wie dreimal zuvor: aus einem gerenderten Text
     (hier: einer Jahreszahl) auf einen Zustand schließen, statt den Zustand zu
     lesen. Die Stationsnummer ist eindeutig, das Datum ist es nicht. */
  let KAPITEL_FOLGE = [], KAPITEL_GRENZE = [], ORTE = [];
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
    /* ── Der Bot würfelt jetzt, weil der Spieler auch würfelt ──
       **Bis zum 30.07.2026 verteilte er von Hand** (`stelle()`), und das war
       richtig, solange es eine Handverteilung gab: Auswürfeln maß vor allem
       den Zufallsgenerator. Seit die Erschaffung nur noch würfelt, gibt es
       `stelle()` nicht mehr — und ein Bot, der einen Mann baut, den kein
       Spieler bauen kann, misst nicht das Spiel.

       **Der Preis ist bekannt und eingepreist:** Die Streuung kommt zurück,
       weil der Lebensvorrat an der ausgewürfelten Konstitution hängt. Deshalb
       würfelt der Bot mehrfach und nimmt den besten Wurf — genau das tut ein
       Spieler auch, der auf „Einen anderen Mann" drücken darf, bis ihm der
       Mann passt. Gemessen wird damit der kundige Spieler, nicht der
       gleichgültige. */
    await p.evaluate(() => {
      let bester = null, bestwert = -1;
      for (let i = 0; i < 12; i++){
        wuerfeln();
        /* Konstitution ist der Lebensvorrat und damit die Todesschwelle;
           Geschick öffnet die Voltigeure. Dieselbe Rangfolge wie früher die
           feste Verteilung, nur als Auswahlkriterium statt als Vorgabe. */
        const w = ERSCH.attr.konstitution * 2 + ERSCH.attr.geschick;
        if (w > bestwert){ bestwert = w; bester = Object.assign({}, ERSCH.attr); }
      }
      ERSCH.attr = bester;
      aktualisiereErschaffung();
    });
    await p.click('#h_' + ['bauer', 'schmied', 'wilderer', 'strasse', 'fuhrmann', 'schreiber'][r % 6]);
    // Das Patent zuerst — es ist die teuerste Einzelentscheidung des Ladens.
    if (PATENT) await p.evaluate(id => waehle(id), PATENT);
    /* Der Veteran arbeitet **eine** Liste ab, abwechselnd Werte und Stücke.
       Beides greift auf denselben Vorrat zu; was nicht mehr hineinpasst, fällt
       von allein weg, weil `waehle()` und `stellePunkt()` beide prüfen. Bei
       VP=0 wird nichts gekauft — dann *ist* der Bot der Erstlauf-Spieler. */
    if (VP > 0) await p.evaluate(plan => {
      for (const eintrag of plan){
        if (eintrag[0] === 'k'){ waehle(eintrag[1]); continue; }
        const k = eintrag[1], bis = eintrag[2];
        for(;;){
          if (istWert(k) + (PUNKTE[k]||0) + PUNKT_SCHRITT > bis) break;
          const vorher = PUNKTE[k]||0;
          stellePunkt(k, PUNKT_SCHRITT);
          if ((PUNKTE[k]||0) === vorher) break;      // der Vorrat reicht nicht mehr
        }
      }
    }, VETERAN_PLAN);
    await p.click('#startbtn');
    if (!STATIONSZAHL) {
      const k = await p.evaluate(() => {
        const namen = [], grenzen = []; let summe = 0;
        for (const kam of KAMPAGNEN) {
          const st = STATIONEN[kam.id];
          if (!st || !st.length) continue;      // ungebaute Kapitel zählen nicht
          summe += st.length; namen.push(kam.name); grenzen.push(summe);
        }
        return {gesamt: KAPITEL.length, namen, grenzen,
                orte: KAPITEL.map(n => (n.typ==='kampf' ? '⚔ ' : '') + (n.ort || n.id || '?'))};
      });
      STATIONSZAHL = k.gesamt; KAPITEL_FOLGE = k.namen; KAPITEL_GRENZE = k.grenzen;
      ORTE = k.orte;
    }
    /* Wie lang die Chronik VOR diesem Lauf war — daran erkennt man unten, ob
       der Eintrag am Ende von diesem Lauf stammt oder vom vorigen. */
    const chronikVorher = await p.evaluate(() => META.chronik.length);
    /* ── HEBEL=1 · den Mechanismus auslesen statt das Ergebnis deuten ──
       **Die eigene Regel des Projekts, in ein Werkzeug gegossen.** Wenn eine
       Zahl unerklärlich dasteht — Grandmaison im Median bei −5, wo 5 nötig
       wären —, ist die erste Frage nicht „welcher Regler", sondern „wer zieht
       daran". Diese Klammer zählt, wer wie oft an einer Fürsprache dreht, wie
       oft ein Auftrag steht, und wie oft eine Folge aus dem Verzeichnis
       zuschlägt. Sie hängt sich um die vorhandenen Funktionen, ändert also
       nichts am Lauf. */
    if (HEBEL) await p.evaluate(() => {
      window.__z = window.__z || {folge:0, stufen:{}, auftragOk:0, auftragNein:0, gm:{}};
      if (window.__hebelDrin) return;
      window.__hebelDrin = true;
      const oFolge = folgeAnwenden;
      folgeAnwenden = function(st, sa){ window.__z.folge++;
        window.__z.stufen[st] = (window.__z.stufen[st]||0)+1; return oFolge(st, sa); };
      /* ⚠ **Hier stand `if (id === 'grandmaison')`** — wieder ein Name statt
         einer Rolle. Seit der Protektion beurteilt ab Rang 12 der gewählte
         Marschall; jede Fürsprache, die an ihn ging, fiel damit aus der
         Zählung, und genau die entscheidet die letzten drei Sprossen.

         Gezählt wird jetzt **jede** Fürsprache, mit Empfänger und Quelle.
         Das ist mehr Ausgabe und dafür keine Annahme darüber, wer gerade
         wichtig ist — die Frage „wer füttert wen" beantwortet sich damit für
         die ganze Kette statt nur für einen Mann. */
      const oGunst = gunstGeben;
      gunstGeben = function(id, n){
        const z = String((new Error()).stack||'').split('\n')[2] || '?';
        const wer = id + '/' + (z.match(/at (\w+)/) || [0,'?'])[1] + (n>0 ? ' +' : ' −');
        window.__z.gm[wer] = (window.__z.gm[wer]||0) + Math.abs(n);
        return oGunst(id, n);
      };
      const oAuf = auftragFuer;
      auftragFuer = function(n){ const a = oAuf(n);
        if (a && K && K.auftragErfuellt !== undefined) {}
        return a; };
    });

    let s = 0, italienGeschafft = false, hoechster = 1, zweig = null;
    const schluss = {ruf: 0, gm: 0, bul: 0};
    /* ── Das Klickbudget ist ein Prüfstand-Wert und darf nie die Messung sein ──
       **Es stand auf 600, und am 30.07.2026 wurde es zur bindenden Schranke.**
       Der Auftrag-Fix hob die Rangdecke von 9 auf 11 — und ab Rang 10 hängt der
       Schaden am Zustand der vier Kompanien statt an den eigenen Werten. Ein
       Maximalveteran, der als Capitaine ein Gefecht in drei Runden entschied,
       braucht als Colonel zehn. Die Klicks je Gefecht vervielfachen sich also
       genau dann, wenn die Leiter endlich trägt.

       Gemessen an derselben Fassung, 40 Läufe: mit 600 endeten **39 von 40**
       Läufen ohne Todesblatt und ohne Wertung — der Median stand bei Station 32
       und der Punktebereich bei „952–952“, also einem einzigen gewerteten Lauf.
       **Eine Spanne von null ist dasselbe Signal wie eine Quote von exakt 100 %:
       kein Befund, sondern ein kaputter Prüfstand.**

       2500 ist bewusst weit über dem, was ein voller Lauf braucht (rund 700).
       Ein Budget, das gerade so reicht, misst beim nächsten Kapitel wieder sich
       selbst. */
    while (s++ < 2500) {
      const t = await p.$eval('#app', e => e.innerText);
      // Leoben ist der Übergang: wer ihn sieht, hat Italien lebend hinter sich.
      // Achtung: Kartenköpfe werden per CSS in Großbuchstaben gesetzt, und
      // innerText liefert die gerenderte Fassung — deshalb ohne Rücksicht auf Groß/Klein.
      if (!italienGeschafft && /vorfrieden/i.test(t)) { italienGeschafft = true; res.italien++; }
      if (t.includes('Nächster Mann')) { res.tot++; break; }
      if (t.includes('Noch einmal, besser')) { res.ende++; break; }
      const w = (await p.$('.ueberlage')) ? null : await p.$('.ord.weiter'); if (w) { await w.click(); continue; }
      const zug = await p.evaluate((MUT) => {
        const btn = [...document.querySelectorAll((document.querySelector('.ueberlage')?'.ueberlage ':'')+'.ord:not([disabled])')];
        const f = re => btn.find(e => re.test(e.textContent));
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

        /* ── Lager und Winterquartier werden am Zustand erkannt, nicht am Text ──
           **Hier stand `txt.includes('VERBLEIBENDE ABENDE')`, und der
           Stationsbogen hat diese Zeichenkette zu „Verbleibend 3 von 3"
           gemacht.** Der Bot hat das Lager danach nicht mehr gefunden: kein
           Ruhen, keine Fürsprache, keine Instandhaltung — er fiel auf den
           allgemeinen Klick durch. Gemessen wurde daraufhin **Caporal 0 % von
           80** und Weite 28 statt 58, und beides war die Blindheit des Bots
           und nicht das Spiel.

           `LAUF.lager.id` und `LAUF.winter.ort` sind Zustände. Sie ändern sich
           nicht, wenn jemand einen Zähler umformuliert, und beim
           Winterquartier trägt die Frage ohnehin nicht: Sie ist über `frage:`
           je Kapitel überschreibbar („Zehn Wochen. Beide Seiten benutzen
           sie."). **Ein Fließtext ist kein Zustand** — dritter Fund derselben
           Art, und der teuerste, weil er eine Messung still verfälscht statt
           laut zu scheitern. */
        else if (LAUF && LAUF.lager && LAUF.lager.id && LAUF.lager.abende > 0) {
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
          /* Kasse und Adjutantenauftrag liegen seit dem 30.07.2026 auf dem
             Schreibtisch und nicht mehr im Lager — sie stehen weiter unten. */
          if (!z && S.rang >= 7) z = f(/Fechtboden/) || f(/Zug selbst antreten/) || f(/Karten des Abschnitts/);
          if (!z && gunst('martel') < 4) z = f(/Am Feuer/);
          /* Die Leiter verlangt jetzt verschiedene Fürsprecher und Bildung 35.
             Wem man das nicht beibringt, der misst wieder die Blindheit des
             Bots statt der Schwelle — dieselbe Lektion wie bei der Gunst. */
          if (!z && S.rang >= 5) z = f(/Deine zwanzig Mann/);
          if (!z && S.rang >= 4) z = f(/Schreibarbeit der Kompanie/);
          if (!z && S.rang === 3 && S.attr.bildung < 35 && S.geld >= 5) z = f(/Buchstaben lernen/);
          if (!z && S.rang >= 3 && gunst('berthaud') < 4) z = f(/acht Mann drillen|Schreibarbeit der Kompanie/);
          if (!z && S.atem < 55) z = f(/Schlafen und liegen/);
          if (!z && S.ausr.muskete.zustand < 55) z = f(/Muskete zerlegen/);
          if (!z && S.ausr.schuhe.zustand < 40 && S.geld >= 6) z = f(/Schuster/);
          if (!z && S.geld >= 4) z = f(/Scharf schießen/);
          if (!z) z = f(/Exerzieren/) || f(/Ausrüstung durchsehen/) || f(/Schlafen und liegen/);
        }

        else if (LAUF && LAUF.winter && LAUF.winter.ort && LAUF.winter.wochen > 0) {
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

        /* ── Der Schreibtisch (ab Rang 9) ──
           **Ein Prüfbot, der eine Handlung meidet, misst das Strafsystem und
           nicht das Spiel** (Regel 9). Der Bot arbeitet die Vorgänge deshalb
           wie ein Mensch ab, der seine Leute behalten will: Er hält die
           Einheit instand, deckt niemanden und schont sein Personal — die
           riskanten Wege nimmt er nur, wenn `MUT=1` steht. */
        if (!z && typeof LAUF === 'object' && LAUF && LAUF.schreibtisch
            && LAUF.schreibtisch.offen && LAUF.schreibtisch.offen.length){
          const riskant = btn.filter(e => e.classList.contains('risk'));
          const brav    = btn.filter(e => !e.classList.contains('risk'));
          /* ── Die Wahl des Patrons ist eine Charakterfrage, keine Optimierung ──
             **Die beiden Gemüter wählen verschieden, und das ist der Sinn.**
             Der vorsichtige Bot nimmt die Kasse ehrlich, erfüllt Aufträge und
             hält seine Bücher sauber — das ist Davouts Währung. Der mutige
             tritt vor die Linie und sammelt Bulletins — das ist Neys.
             Masséna wählt keiner von beiden: Seine Währung ist Unterschlagung,
             und ein Bot, der unterschlägt, misst das Strafsystem statt des
             Spiels. **Wer Massénas Weg messen will, ändert diese Zeile und
             sagt dazu, dass er es getan hat.** */
          z = f(MUT ? /Maréchal Ney/ : /Maréchal Davout/)
            || ((MUT && riskant.length) ? riskant[0]
            : (f(/Kasse ausgeben, wie sie vorgesehen/) || f(/an den vergeben, der liefert/)
               || f(/auf eigene Kosten/) || f(/Wahrheit melden/) || f(/Fähigeren/)
               || f(/Selbst mit ihm reden/) || f(/gleichmäßig/) || f(/Unteroffiziere selbst unterrichten/)
               || f(/Eng legen/) || f(/Schreiben, was er kann/) || f(/Stellung erkunden/)
               || brav[0] || btn[0]));
        }
        if (!z) z = btn[0];
        if (z) z.click();
        /* ── Der risk-Zähler ──
           `OFFEN.md` Punkt 2 fragt seit Tagen, ob der reiche Veteran wirklich
           gefährlicher lebt oder ob nur die Bot-Formel ihn dorthin rechnet: Bei
           sehr hohen Werten übersteigt eine riskante Wahl auch nach dem Abschlag
           von 20 noch jede sichere. **Solange niemand zählt, wie oft er zugreift,
           misst man das Ergebnis und nicht den Hebel** — derselbe Fehler wie beim
           stummen Güte-Leck.
           Gezählt wird der Knopf, den er wirklich gedrückt hat, nicht der, den er
           hätte drücken können. */
        return { ok: !!z, rang: S ? S.rang : 0, zweig: S ? S.zweig : null,
                 risk: !!(z && z.classList && z.classList.contains('risk')),
                 /* ── Die drei Schranken von Rang 12, direkt ausgelesen ──
                    **OFFEN.md Punkt 12 verlangt genau das: erst den Hebel,
                    dann das Ergebnis.** Vierzig von vierzig Veteranen bleiben
                    Colonel, und welche der drei Bedingungen sie hält — Ruf
                    480, Grandmaison 5, drei Bulletins —, war eine Vermutung.
                    Dreimal an einem Tag war die vermutete Ursache nicht die
                    wirkliche; eine Zeile, die die Zahlen ausgibt, ist billiger
                    als die vierte Vermutung. */
                 /* ⚠ **Hier stand `gunst('grandmaison')` — ein Name statt einer
                    Rolle**, und damit las der Hebel seit der Protektion des
                    Marschalls die falsche Zahl. Grandmaison hört bei Rang 11
                    auf; ab 12 beurteilt der gewählte Marschall. Gemeldet wurde
                    daraufhin „20 % erfüllt", während 33 von 40 Läufen Rang 12
                    tatsächlich überschritten hatten.

                    Es ist dieselbe Fehlerfamilie, die im Spiel schon fünfmal
                    zugeschlagen hat, nur diesmal im Messgerät — und ein
                    Messgerät, das den Falschen fragt, ist die teuerste Sorte
                    Fehler, weil seine Zahl trotzdem plausibel aussieht.
                    `beurteiler()` liefert die Rolle. */
                 ruf: S ? (S.ruf|0) : 0,
                 gm: S ? (typeof gunst === 'function' && typeof beurteiler === 'function'
                          ? (gunst(beurteiler() || '')|0) : 0) : 0,
                 /* Und wer das ist, steht dazu — sonst rät man beim Lesen des
                    Berichts, gegen wen die Zahl gerechnet wurde. Ebenso die
                    Sprosse selbst mit ihren eigenen Schwellen, statt die
                    Zahlen von Rang 12 fest einzutragen: Die LEITER darf sich
                    ändern, ohne dass der Prüfstand still danebenliegt. */
                 wer: S ? (typeof beurteiler === 'function' && typeof personKurz === 'function'
                           ? (personKurz(beurteiler() || '') || '') : '') : '',
                 ziel: (S && typeof LEITER !== 'undefined') ? (()=>{
                   const p = LEITER.filter(e => e.von.indexOf(S.rang) >= 0);
                   if(!p.length) return null;
                   const z = p.reduce((a,b)=> b.rang < a.rang ? b : a);
                   return {rang:z.rang, ruf:z.ruf|0, gunst:z.gunst|0, bul:z.bulletins|0};
                 })() : null,
                 bul: S ? (S.bulletins|0) : 0 };
      }, MUT);
      if (zug.rang > hoechster) hoechster = zug.rang;
      if (zug.zweig) zweig = zug.zweig;
      if (zug.risk) res.risk++;
      // Der letzte lebende Stand: nach dem Tod ist `S` null.
      if (zug.rang) { schluss.ruf = zug.ruf; schluss.gm = zug.gm; schluss.bul = zug.bul;
                      schluss.wer = zug.wer; schluss.ziel = zug.ziel; }
      res.wahlen++;
      if (!zug.ok) break;
    }
    /* **Nur Läufe, die noch eine Sprosse vor sich hatten.** Wer den Marschall
       trägt, hat keinen Beurteiler mehr — `beurteiler()` gibt dort null, und
       eine Schranke, die es nicht gibt, gehört in keine Quote. Die erste
       Fassung nahm ihn mit und meldete daraufhin für einen Bogen aus lauter
       Marschällen „Grandmaison 25 % erfüllt". */
    if (schluss.ziel) {
      res.schranke.ruf.push(schluss.ruf);
      res.schranke.gm.push(schluss.gm);
      res.schranke.bul.push(schluss.bul);
      res.schranke.ziel.push(schluss.ziel);
      res.schranke.wer.push(schluss.wer || '—');
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
    /* ── Die Chronik überlebt den Lauf, der Lauf überlebt die Chronik nicht ──
       **Der Prüfstand benutzt EINE Seite für alle Läufe** (`newPage()` einmal,
       `goto()` je Lauf), also bleibt `localStorage` stehen und die Chronik
       wächst über die Läufe hinweg. Ein Lauf, der weder stirbt noch endet —
       weil er am Klickbudget hängenbleibt oder keinen Knopf mehr findet —
       schreibt **keinen** Eintrag. `META.chronik[length-1]` lieferte dann den
       Eintrag des *vorigen* Laufs.

       **Und das erfand gute Nachrichten.** Stand dort zufällig ein Überlebender
       (`gefallen:false`), zählte der Zweig unten den abgebrochenen Lauf als
       „alle 163 Stationen erreicht, jedes Kapitel überstanden". Gemessen kam so
       eine Weite von 163 bei einer einzigen tatsächlich beendeten Wertung
       heraus — und eine Zeile „gestorben 1" direkt neben „Gestorben in:
       Eylau 13", weil die eine Zahl vom Bildschirm kam und die andere aus der
       fremden Chronik.

       Gezählt wird jetzt nur ein Eintrag, den **dieser** Lauf geschrieben hat;
       alles andere ist `abbruch` und geht in keine Quote ein. **Ein Lauf, der
       nicht zu Ende gespielt wurde, ist kein Messwert — weder ein guter noch
       ein schlechter.** */
    const d = await p.evaluate(vorher => {
      if (META.chronik.length <= vorher) return null;   // dieser Lauf hat nichts geschrieben
      const c = META.chronik[META.chronik.length-1] || {};
      return {gefallen: !!c.gefallen, ort: c.ort||'', stationen: c.stationen|0};
    }, chronikVorher);
    if (!d) { res.abbruch++; continue; }
    if (d.gefallen) {
      /* Aus der Stationsnummer, nicht aus dem Datum: Sie ist der Zustand. */
      let bisIdx = KAPITEL_GRENZE.findIndex(g => d.stationen <= g);
      if (bisIdx < 0) bisIdx = KAPITEL_FOLGE.length - 1;
      const kap = KAPITEL_FOLGE[bisIdx] || '?';
      res.sterbeort[kap] = (res.sterbeort[kap]||0) + 1;
      /* **Und woran genau.** Das Kapitel sagt, in welchem Krieg er geblieben
         ist; die Station sagt, an welchem Tag. Für jede Frage der Art „woran
         stirbt dieser Mann" ist das die Zahl, die man wirklich braucht. */
      const ort = ORTE[d.stationen-1] || ('Station ' + d.stationen);
      res.sterbeplatz[ort] = (res.sterbeplatz[ort]||0) + 1;
      res.sterbestation.push(d.stationen);
      res.weite.push(d.stationen);
      /* Erreicht hat er jedes Kapitel bis einschließlich dem, in dem er
         gestorben ist. */
      KAPITEL_FOLGE.slice(0, bisIdx+1).forEach(k => res.erreicht[k] = (res.erreicht[k]||0)+1);
    } else {
      res.weite.push(STATIONSZAHL);
      KAPITEL_FOLGE.forEach(k => res.erreicht[k] = (res.erreicht[k]||0)+1);
    }
  }
  /* Die Zähler leben in der Seite und überstehen `goto()`, weil `balance.js`
     EINE Seite für alle Läufe benutzt — hier werden sie einmal abgeholt. */
  if (HEBEL) res.hebel = await p.evaluate(() => window.__z || null);
  const pu = res.punkte.sort((a, b) => a - b);
  const q = n => `${n} (${Math.round(n / N * 100)} %)`;
  console.log(`${N} Läufe · ${VP?`Veteran mit ${VP} VP`:'erster Lauf, ohne Vorrat'} · ${MUT?'mutig':'vorsichtig'}`
    + (PATENT ? ` · mit Patent (${PATENT === 'patent_lt' ? 'Lieutenant' : 'Sous-Lieutenant'})` : ''));
  /* ── Die Leitzahlen ──
     **`überlebt` ist mit acht Kapiteln ausgelaufen, und zwar rechnerisch.**
     Sie ist das Produkt aller Kapitelquoten; schon bei acht Kapiteln stand sie
     für jeden der drei gemessenen Männer auf **0 %** und trennte nichts mehr.
     Mit elf ist sie es erst recht.
     Genau das war vorhergesagt („eine Leitzahl, die ein Produkt ist, läuft
     mit jedem Kapitel aus"), und sie bleibt nur noch zur Einordnung stehen.

     An ihre Stelle tritt **die Weite**: wie weit der mittlere Lauf kommt.
     Sie schrumpft nicht mit dem Ausbaustand, weil sie ein Median ist und kein
     Produkt — **aber sie ist eine absolute Stationszahl und wandert deshalb
     mit dem Nenner.** Wer sie vergleicht, vergleicht sie nur gegen eine
     Messung mit derselben Stationszahl; deshalb steht sie hier immer mit
     „von ${STATIONSZAHL}" daneben. */
  const we = res.weite.slice().sort((a, b) => a - b);
  const weite = we.length ? we[Math.floor(we.length / 2)] : 0;
  console.log(`\n  WEITE ${weite} von ${STATIONSZAHL} (${Math.round(weite/STATIONSZAHL*100)} %)`
    + `   ·   HÖCHSTER RANG (${rangKurz(LEITRANG)}) ${q(res.leit)}\n`);
  /* **Laut, nicht am Rand.** Ein abgebrochener Lauf ist kein Messwert, und ein
     Prüfstand, der seine eigene Obergrenze verschweigt, misst irgendwann sich
     selbst statt des Spiels. Genau das ist am 30.07.2026 passiert. */
  if (res.abbruch) console.log(`  ⚠ ABGEBROCHEN: ${q(res.abbruch)} — weder gestorben noch angekommen.`
    + `\n    Klickbudget erschöpft oder kein Knopf mehr. Diese Läufe gehen in KEINE Quote unten ein.\n`);
  console.log(`Ganz durch: ${q(res.ende)} (Produktzahl, mit elf Kapiteln stumpf)`);
  console.log(`Italien überstanden ${q(res.italien)} (Lehrstück, kein Sollwert) · gestorben ${res.tot}`);
  console.log(`Weitere Ränge erreicht: Elitekompanie ${q(res.elite)} · Caporal ${q(res.caporal)} · Fourrier ${q(res.fourrier)} · Sergent ${q(res.sergent)}`);
  console.log(`Punkte: Median ${pu[Math.floor(pu.length / 2)]} · Bereich ${pu[0]}–${pu[pu.length - 1]}`);
  const verteilung = Object.keys(res.raenge).map(Number).sort((a, b) => a - b)
    .map(r => `${r} ${rangKurz(r)} ${res.raenge[r]}`).join(' · ');
  console.log(`Rangverteilung (höchster je Lauf): ${verteilung}`);
  /* ── Wie oft der Bot ins Risiko gegangen ist ──
     `OFFEN.md` Punkt 2 lässt sich nur mit dieser Zeile entscheiden: Wenn der
     reiche Veteran seltener überlebt als der ärmere, muss man wissen, ob er
     **öfter zugreift** (Bot-Artefakt — bei hohen Werten übersteigt eine
     riskante Wahl auch nach dem Abschlag jede sichere) oder ob dieselbe Zahl
     Wahlen härter bestraft wird (dann ist es das Spiel). */
  console.log(`Riskante Wahlen: ${res.risk} von ${res.wahlen} (${res.wahlen ? Math.round(res.risk/res.wahlen*100) : 0} %)`);
  /* ── Die drei Schranken der nächsten Sprosse ──
     **OFFEN.md Punkt 12: erst den Hebel auslesen, dann drehen.** Was einen
     Lauf hält — der Ruf, die Fürsprache oder die Bulletins —, war bis hierher
     eine Vermutung. Gedruckt wird der Median, weil ein Mittelwert von den
     frühen Toten nach unten gezogen wird.

     **Sprosse, Schwellen und Beurteiler kommen aus dem Spiel, nicht aus dieser
     Datei.** Vorher standen hier „Rang 12", „480", „5", „3" und
     „Grandmaison" als feste Zeichenketten — und der Name war schon falsch,
     ehe jemand die Zahlen ändern konnte. */
  if (res.schranke.ruf.length) {
    const med = a => { const b = a.slice().sort((x,y)=>x-y); return b[Math.floor(b.length/2)]; };
    const anteil = (a,s) => s ? Math.round(a.filter(x=>x>=s).length / a.length * 100) : 100;
    const haeufigst = a => { const z = {}; a.forEach(x=>{ const k = JSON.stringify(x); z[k]=(z[k]||0)+1; });
      const k = Object.keys(z).sort((x,y)=>z[y]-z[x])[0]; return k ? JSON.parse(k) : null; };
    const ziel = haeufigst(res.schranke.ziel) || {rang:'?', ruf:0, gunst:0, bul:0};
    const wer  = haeufigst(res.schranke.wer) || 'der Beurteiler';
    /* Eine Schwelle von 0 ist keine — sie wird gar nicht erst gedruckt,
       statt als „100 % erfüllt (0)" nach einer erledigten Hürde auszusehen. */
    const teil = (name, werte, schwelle) => schwelle
      ? `${name} ${med(werte)} ${anteil(werte,schwelle)} % (${schwelle})` : '';
    console.log(`Rang ${ziel.rang} — die Schranken davor `
      + `(Median · erfüllt · nötig, ${res.schranke.ruf.length} Läufe): `
      + [teil('Ruf', res.schranke.ruf, ziel.ruf),
         teil(wer, res.schranke.gm, ziel.gunst),
         teil('Bulletins', res.schranke.bul, ziel.bul)].filter(Boolean).join(' · '));
  }
  if (HEBEL && res.hebel) {
    const z = res.hebel;
    console.log(`Hebel · Folgen aus dem Verzeichnis: ${z.folge} (Stufen ${
      Object.keys(z.stufen||{}).sort().map(k=>k+': '+z.stufen[k]).join(' · ') || '—'})`);
    console.log(`Hebel · Wer welche Fürsprache bewegt (Empfänger/Quelle, die zwölf stärksten): ${
      Object.keys(z.gm||{}).sort((a,b)=>z.gm[b]-z.gm[a]).slice(0,12)
        .map(k=>k+' '+z.gm[k]).join(' · ') || '—'}`);
  }
  /* Die Quote je Kapitel — die Zahl, die nicht mit dem Ausbaustand schrumpft. */
  const jeKapitel = KAPITEL_FOLGE.filter(k => res.erreicht[k])
    .map(k => { const e = res.erreicht[k], t = res.sterbeort[k]||0;
                return `${k} ${Math.round((1-t/e)*100)} %${e<15?' (nur '+e+')':''}`; });
  if (jeKapitel.length) console.log(`Überstanden je Kapitel (von denen, die es erreichen): ${jeKapitel.join(' · ')}`);
  if (res.sterbestation.length) {
    const mittel = Math.round(res.sterbestation.reduce((a, x) => a + x, 0) / res.sterbestation.length * 10) / 10;
    const plaetze = Object.keys(res.sterbeplatz).sort((a,b)=>res.sterbeplatz[b]-res.sterbeplatz[a]).slice(0,6);
    console.log(`Gestorben wo genau: ${plaetze.map(k=>`${k} ${res.sterbeplatz[k]}`).join(' · ')}`);
    console.log(`Gestorben in: ${Object.keys(res.sterbeort).map(k => `${k} ${res.sterbeort[k]}`).join(' · ')}`
      + ` · im Schnitt bei Station ${mittel} von ${STATIONSZAHL}`);
  }
  await b.close();
})();
