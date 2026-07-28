# Der Marschallstab — Arbeitsgedächtnis

**Lies diese Datei zuerst.** Sie enthält, was aus dem Gespräch nicht mitkommt: warum die Zahlen so sind, wie sie sind, und welche Regeln nicht gebrochen werden dürfen.

---

## Was das ist

Ein Karriere-Simulator in der Grande Armée, 1796–1815. Man beginnt als analphabetischer Rekrut und steigt — vielleicht — im Rang auf. Vierzehn Ränge, elf Kapitel, harter Permadeath. Vorbild ist *A Legionary's Life*, aber in napoleonischer Zeit und mit einem längeren Aufstieg.

**Der Kern in einem Satz:** Der Rang verändert nicht die Zahlen, sondern das Spiel selbst — als Fusilier steuerst du deinen Körper, als Caporal acht Männer, als General schiebst du Divisionen über eine Karte und liest Meldungen, die vierzig Minuten alt sind.

Sprache des Spiels und des Codes: **Deutsch**. Variablennamen, Kommentare, Texte.

---

## Stand

Gebaut sind **Kapitel 1 (Italien 1796/97)** und **Kapitel 2 (Ägypten 1798/99)**, Ränge 1–3, als reine HTML/JS-Anwendung ohne Abhängigkeiten.

| Fertig | Noch nicht |
|---|---|
| Charaktererschaffung mit Pool und sechs Herkünften | Kapitel 3–11 |
| Attribute und Fertigkeiten 0–100 mit Wachstum | Ränge 4–14 |
| Gefecht auf zwei Maßstäben (Körper / Sektion) | Ausrüstungskauf im Spiel |
| Voltigeur- und Grenadierzweig mit eigenen Aktionen | Orden und Ehrenlegion |
| Ausrüstung mit Zustandsverschleiß | Pferd, Kompaniekasse, Inspektionen |
| Ruf, Gunst, Kameradschaft, Belastung, Wunden, Lebenspunkte | Offizierspatente |
| Vakanz-Regel für die Beförderung | Rangschranken und die vier Enden |
| Drei Lager mit Ausbildung und Instandhaltung | Generalskampagnen |
| Winterquartier mit Wochenverteilung | |
| Anmarsch und Lagebild vor jedem Gefecht | |
| Permadeath, Wertung, Chronik, Spielstand als Datei | |
| Aussetz-Spielstand mit Fassungen und Wandlern | Dateisystem-Ablage, Steam-Cloud |
| Erklärungen zu jedem Wert beim Überfahren | |
| Kampagnenverlauf mit Nebel über Ungesehenem | |
| Veteranenpunkte in einzelne Werte umsetzbar | |
| Zwei Feldzüge mit Übergang dazwischen | |
| Elf Marsch-Zwischenfälle mit Sperr-Sätzen | |

Das vollständige Design steht in **`KONZEPT.md`** — auch alles, was noch nicht gebaut ist. Wer ein neues System baut, liest dort zuerst nach, ob es schon entworfen wurde.

---

## Starten und prüfen

```bash
# Spielen: index.html im Browser öffnen. Kein Server, kein Build nötig.

npm install playwright && npx playwright install chromium   # einmalig

node test/durchspielen.js         # ein Lauf, meldet Konsolenfehler
node test/spielstand.js           # sichern, fortsetzen, sterben, alte Fassungen
node test/durchspielen.js dist    # dasselbe mit der gebauten Einzeldatei
node test/balance.js 40           # 40 Läufe, misst die Überlebensquote
node werkzeug/bauen.js            # baut dist/marschallstab.html zum Weitergeben
```

**Nach jeder Änderung am Code `node test/durchspielen.js` laufen lassen.** Nach jeder Änderung an Balance-Zahlen zusätzlich `node test/balance.js 40`, nach jeder Änderung am Zustand `node test/spielstand.js`.

---

## Dateien

```
README.md                       Eingangstür für Fremde
CLAUDE.md                       diese Datei — Arbeitsgedächtnis
KONZEPT.md                      vollständiges Design, auch das Ungebaute
AENDERUNGEN.md                  Protokoll aller Balance-Änderungen
LICENSE / LICENSE-INHALTE       MIT für Code, CC BY-NC-SA für Inhalte
entwurf/                        Konzeptgrafiken, Bildschirmfotos, GITHUB.md
index.html                      Gerüst, lädt die Skripte in fester Reihenfolge
src/stil.css                    Gesamte Gestaltung
src/daten/grundwerte.js         Attribute, Fertigkeiten, Ränge, Herkünfte, Kaufladen
src/daten/kapitel01_italien.js  Kapitel 1 als reine Daten
src/daten/kapitel02_aegypten.js Kapitel 2 als reine Daten, hängt sich selbst an
src/spielstand.js               Fassungen, Wandler, Ablage, Aussetz-Spielstand
src/mechanik.js                 Laufzustand, Proben, Wachstum, Erholung, Verschleiß, Wunden
src/oberflaeche.js              Titel, Kaufladen, Erschaffung, Ablauf, Szenen
src/kampf.js                    Anmarsch, Gefecht, Elitekompanie, Beförderung
src/abschluss.js                Lager, Winterquartier, Wertung, Tod, Kapitelende, Spielstand
src/start.js                    Einstiegspunkt, muss zuletzt geladen werden
```

Die Skripte sind **klassische Skripte, keine ES-Module** — absichtlich, damit `index.html` per Doppelklick über `file://` läuft. Module würden dort an der Sicherheitsprüfung des Browsers scheitern. Wer das ändert, braucht einen lokalen Server und nimmt dem Projekt seine wichtigste Eigenschaft.

**Ein neues Kapitel** kommt als eigene Datei nach `src/daten/` und wird in `index.html` eingehängt. Am Ende der Datei hängt es sich selbst an — drei Zeilen, wie in `kapitel02_aegypten.js`:

```js
KAPITEL.push(...KAPITEL2);            // an das laufende Band
STATIONEN.aegypten = KAPITEL2;        // für den Verlauf links
(KAMPAGNEN.find(k=>k.id==='aegypten')||{}).gebaut = true;
```

Kapiteldaten enthalten keine Logik. **Was ein Kapitel enthalten muss:** einen `uebergang` am Ende (außer beim letzten, dort `ende` mit `text` und `ausblick`), eine `befoerderung`, ein `winter` mit eigenem `text`, ein Lager je zwei Gefechte. Alles, was früher fest im Code stand — Winterquartier-Text, Schlusstext —, kommt jetzt aus den Daten.

---

## Das Projekt ist öffentlich

Der Quelltext liegt auf **https://github.com/DarkTemplarxy/Soldier-RPG** und ist für jeden lesbar.

Was daraus folgt:

- **`README.md` ist die Eingangstür**, nicht die Arbeitsanweisung. Sie richtet sich an Fremde: was das Spiel ist, wie man es startet, wie der Stand ist. Arbeitsanweisungen gehören hierher.
- **Zwei Lizenzen.** Quelltext MIT (`LICENSE`), Spielinhalte CC BY-NC-SA (`LICENSE-INHALTE`) — Texte, Konzept, Gestaltung sind ausdrücklich **nicht** kommerziell nutzbar. Neue Dateien entsprechend zuordnen.
- **GitHub Pages** macht `index.html` unter `darktemplarxy.github.io/Soldier-RPG/` spielbar. Deshalb darf nie ein Build-Schritt nötig werden — siehe `entwurf/GITHUB.md`.
- **Keine privaten Angaben** in Dateien, die ins Repo gehen. Keine Pfade vom eigenen Rechner, keine Namen außer dem Urheber.
- **Commit-Nachrichten auf Deutsch**, wie der Rest des Projekts. Erste Zeile knapp, danach eine Leerzeile und die Begründung.

---

## Design-Invarianten

Diese acht Regeln nicht brechen. Wenn eine Änderung eine davon verletzt, ist die Änderung falsch — nicht die Regel.

1. **Der Tod ist endgültig.** Kein Weiterspielen, kein Nachfolger, kein Zurücksetzen. Abschlusstext, Chronikeintrag, Titelbildschirm.
2. **Nur der beste Lauf zählt.** Der Veteranenpunkte-Vorrat ist das Maximum über alle Läufe, nie die Summe. Ein schlechter Lauf kostet nichts und bringt nichts. Es darf nichts zu grinden geben.
3. **Veteranenpunkte kaufen den Ausgangspunkt, nie den Aufstieg.** Rang, Ruf, Gunst und Orden sind unkäuflich. (Ausnahme später: die Offizierspatente ab Rang 7 — sie kosten dafür Wertungspunkte, siehe KONZEPT.md.)
4. **Ein höherer Rang gibt neue Knöpfe, nicht größere Zahlen.** Wenn ein neuer Rang keine neue Handlungsmöglichkeit bringt, ist er falsch entworfen.
5. **Beförderung braucht eine Vakanz.** Ruf und Fürsprache allein reichen nicht — die Stelle muss frei sein, und frei wird sie, weil jemand gestorben ist. Das wird nie ausgesprochen, nur gezeigt.
6. **Kein Server, keine Abhängigkeiten. Die Datei ist das maßgebliche Format.** Der Spielstand geht als JSON-Datei raus und wieder rein. `localStorage` ist ausschließlich die bequeme Ablage für den unterbrochenen Feldzug und die Chronik — nie die einzige Quelle, und das Spiel muss ohne sie vollständig funktionieren. *(Geändert am 27.07.2026: vorher verbot diese Invariante `localStorage` ganz. Ohne Browser-Ablage kann ein Absturz keinen Feldzug retten, und genau das war die Anforderung. Die Begründung steht unter „Spielstand".)*
7. **Ton: nüchtern-brutal.** Kein Heldenpathos, keine Musik im Text. Kurze Sätze, konkrete Details, keine Wertung. Der Aufstieg wird nie gefeiert, er wird protokolliert.
8. **Historische Fixpunkte sind fix.** Lodi ist am 10. Mai 1796, Arcole im November, Rivoli am 14. Januar 1797. Dazwischen ist alles frei erfunden.

---

## Balance-Konstanten und warum sie so sind

**Wer eine dieser Zahlen ändert, trägt sie hier mit Begründung nach und aktualisiert `AENDERUNGEN.md`.** Sonst ist das Wissen bei der nächsten Sitzung weg.

### Gefechte (`src/daten/kapitel01_italien.js`)

| Gefecht | Runden | Feindmoral | Gefahr |
|---|---|---|---|
| Montenotte | 6 | 45 | 10 |
| Lodi **(Höhepunkt)** | 9 | 78 | 15 → 18 |
| Castiglione | 7 | 58 | 12 |
| Arcole **(Höhepunkt)** | 9 | 74 | 14 → 17 |
| Rivoli | 8 | 66 | 13 |

### Gefechte Kapitel 2 (`src/daten/kapitel02_aegypten.js`)

| Gefecht | Runden | Feindmoral | Gefahr | Anmarsch kostet |
|---|---|---|---|---|
| Alexandria | 5 | 40 | 9 | 0,10 · Atem 5 |
| Pyramiden (Embabeh) **(Höhepunkt)** | 7 | 60 | 12 → 15 | 0,25 · Atem 9 |
| Kairoer Aufstand | 6 | 50 | 11 | 0,05 · Atem 2 |
| Akkon **(Höhepunkt)** | 9 | 85 | **14 → 17** | 0,30 · Atem 8 |
| Abukir | 8 | 62 | 12 | 0,20 · Atem 7 |

**Gefahr** ist die Trefferchance in Prozent pro Runde, bevor Deckung sie verändert. Der zweite Wert gilt für die vier **Höhepunkte** (`haerte:1.4`): +3 Gefahr und +40 % Schaden je Treffer.

> **Ägypten ist nicht gefährlicher im Gefecht, sondern auf dem Weg dorthin.** Die Gefahr-Werte liegen im selben Band wie in Italien (9–14); was das Kapitel härter macht, sind der Anmarsch (`anmarschKosten` je Gefecht statt der italienischen Pauschale 0,15/4/1) und die Szenen: Hitzschlag im Wüstenmarsch, Ruhr am Sinai, das Fieber aus Jaffa auf dem Rückzug. Das ist die Umsetzung von „Krankheit sollte hier gefährlicher sein als Kugeln" aus KONZEPT.md — sie steht in den Szenen, nicht in den Gefahr-Zahlen.
>
> **Akkon ist das erste Gefecht, das man auch bei Sieg nicht gewinnt.** Feindmoral 85 ist der höchste Wert im Spiel, und der „Sieg" bringt nur die Erkenntnis, dass hinter der zweiten Mauer eine dritte steht. Historisch ist das der Fixpunkt: Akkon fiel nicht. Die Niederlage bringt hier deshalb auch nur −3 Ruf statt der üblichen −4 bis −6 — man hat es niemandem vorzuwerfen.

> **Warum so niedrig?** Die erste Fassung hatte Gefahr 26–38 und Feindmoral bis 100. Ergebnis im Test: **100 % Tod**, keine einzige gewonnene Schlacht. Zwei Gründe — man wurde zu oft getroffen, *und* die Gefechte waren rechnerisch nicht zu gewinnen: Weil man nur jede zweite Runde feuert (Laden, Feuern, Laden…), kommt man in neun Runden auf vier Schuss zu je 12–32 Schaden, also nie an 100 Feindmoral heran.

### Lager (`src/abschluss.js`, Auswahl in den Kapiteldaten)

**Drei Lager in Kapitel 1, plus das Winterquartier.** Depot Savona (3 Abende, vor allem Ausbildung), Kantonierung Corsico (2 Abende, vor allem Instandhaltung, weil dort zum ersten Mal Sold gezahlt wird), Feldlager an der Etsch (2 Abende, vor Arcole).

> **Warum drei und nicht mehr?** Ein Lager je zwei Gefechte ist die Grenze, ab der aus dem Spiel eine Verwaltung wird. Mehr Lager heißt vor allem: dieselben Knöpfe öfter — und Invariante 2 verbietet Grinding. Die Knappheit ist der Entwurf: Es gibt in jedem Lager mehr zu tun als Abende. **Regel für neue Kapitel: eins am Kapitelanfang, danach eins je zwei Gefechte, höchstens vier, immer mit knappem Zeitbudget.**

| Handlung | Wirkung | Preis |
|---|---|---|
| Exerzieren | Muskete und Drill (Intensität 2) | Atem −6 |
| Bajonettfechten | Bajonett (2,5) | Atem −8 |
| Scharf schießen | Muskete (3,5) | 4 F, Waffe −5 |
| Ausrüstung flicken | Geschick-Probe 30: alles +20, sonst +8 | ein Abend |
| Schuster | Schuhe +45 | 6 F |
| Muskete ölen | Muskete +30 | ein Abend |
| Buchstaben lernen | Bildung +5, Verwaltung | 5 F |
| Am Feuer bleiben | Kameradschaft +8, Gunst +1, Belastung −4 | ein Abend |
| Fouragieren | Probe 40: +7 F, Atem +8 | sonst Belastung +3 |
| Schlafen | **Leben +25 %**, Belastung −10, Atem +18 | ein Abend |
| Korporalschaft drillen (ab Rang 3) | Autorität und Drill, Ruf +1 | ein Abend |
| Tornistermarsch (Grenadier) | Konstitution | Atem −10 |
| Gelände üben (Voltigeur) | Geschick und Muskete | Atem −6 |

**Der Rang gibt Zeit, nicht nur Knöpfe.** Ab Caporal ein Abend mehr je Lager, ab Sergent zwei (`abendeFuer()` in `src/abschluss.js`). Begründung im Spiel: Unteroffiziere sind vom Wachdienst und den Handreichungen befreit, die den Füsilier den halben Abend kosten — dafür haben sie die Korporalschaft am Hals. Begründung im Entwurf: Ohne den zusätzlichen Abend verdrängt die rangeigene Handlung („Deine acht Mann drillen") die eigene Ausbildung, und der Rang würde sich anfühlen wie eine Strafe. Das ist die eine Stelle, an der ein Rang mehr gibt als einen Knopf — und sie ist nötig, damit der Knopf überhaupt drückbar ist.

Ein Lagerabend gibt bewusst **weniger als eine Winterwoche** (dort: alles +30 statt +20, Belastung −16 statt −10, Leben +60 % statt +25 %). Die drei rang- und zweigabhängigen Handlungen erfüllen Invariante 4 auch außerhalb des Gefechts.

### Der Übergang zwischen zwei Feldzügen (`typ:'uebergang'`)

Zwischen Leoben (April 1797) und der Überfahrt (Mai 1798) liegt ein Jahr Garnison. Der Übergang ist kein Kapitelende: Es wird **nichts eingetragen und nichts gewertet** — gewertet wird ein Lauf erst, wenn er endet. Zwischendurch zu banken wäre sinnlos, weil ein späterer Tod immer mindestens die Stationen von jetzt enthält, und es würde Invariante 2 aufweichen.

```js
S.atem = 100;  S.leben = lebenMax();  S.belastung = Math.floor(S.belastung/2);  S.wunden = [];
```

**Ein Jahr heilt alles, was heilbar ist.** Sonst stirbt in Ägypten niemand an Ägypten, sondern an Arcole: Wer mit vier Wunden und Belastung 80 aus Italien kommt, hat in Kapitel 2 keine Chance, und das Kapitel könnte seinen eigenen Charakter nicht entfalten. Dieselbe Logik wie beim Winterquartier (drei Wochen Dach = Atem voll), nur eine Größenordnung länger. Was bleibt, ist, was er gelernt hat — Attribute, Fertigkeiten, Rang, Ruf, Gunst.

### Anmarsch vor dem Gefecht (`src/kampf.js`)

```js
verschleiss(0.15); S.atem -= 4; S.belastung += 1;
```

**Der Weg zum Gefecht kostet etwas** — sonst wären die Lager ein reiner Zugewinn und die Instandhaltung eine Pflichtübung ohne Gegner. Erste Fassung war `verschleiss(0.3)`, Atem −6, Belastung +2: **gemessen 35 % Überleben statt 50 %.** Der Marschverschleiß über fünf Gefechte wog schwerer als alles, was drei Lager wieder einbringen. Halbiert liegt der Wert wieder im Band.

### Atem erholt sich nicht von allein (`src/oberflaeche.js`)

```js
const ATEM_WARNUNG = 35;     // gewarnt wird ab 35, gekostet wird ab 30
```

**Eine selbsttätige Erholung war gebaut und ist wieder ausgebaut worden.** Die Formel lautete `8 + Konstitution/12 − Belastung/25 − 2×Wunden` je Station. Gemessen über 105 Läufe:

| | vorher | mit Erholung |
|---|---|---|
| Kapitel 1 überstanden | 48 % | 41 % |
| Caporal | 28 % | 42 % |

Der Caporal-Anteil stieg mittelbar — mehr Atem heißt seltener der Malus `Atem < 30` (+5 Gefahr je Runde), heißt mehr gewonnene Gefechte, heißt mehr Ruf, und Ruf *ist* die Caporal-Schwelle. Damit war die gerade erst eingestellte Schwelle wieder hinfällig.

**Stattdessen wird gewarnt, statt zu heilen.** Ab Atem 35 färbt sich der Balken rot und im Gefecht steht eine Warnung über der Rundenzeile; die Zahl 35 liegt absichtlich *fünf Punkte über* dem Malus bei 30. Der Spieler soll rechtzeitig „Schlafen und liegen bleiben" wählen — die Erholung bleibt eine Entscheidung im Lager und wird nicht verschenkt.

**Das Winterquartier füllt den Atem ganz auf**, beim Betreten und ohne dass man dafür eine Woche opfern müsste (`src/abschluss.js`). Belastung und Wunden bleiben Sache der Wochenverteilung — die sitzen tiefer als Kurzatmigkeit. Das ist die eine Stelle, an der Erholung geschenkt wird, und sie ist verdient: drei Wochen unter einem Dach, mit Sold und zweimal Essen am Tag.

> **Diese eine Änderung hat die Balance wieder eingefangen.** Gemessen über 80 Läufe: überstanden **44 %** (vorher 38 %), Caporal **30 %** (vorher 23 %), Punkte-Median **86** (vorher 60). Beide Sollwerte getroffen, ohne dass Atem außerhalb von Lager und Winterquartier geschenkt wird. Ein einziger Erholungspunkt an der richtigen Stelle schlägt eine Erholung an jeder Station.

> **Regel daraus:** Alles, was die Kampfkraft hebt, hebt über den Ruf auch den Caporal-Anteil. Wer an Atem, Wunden oder Gefahr dreht, misst nicht nur die Überlebensquote, sondern auch die Endränge.

### Die Linie kämpft auch ohne dich (`src/kampf.js`)

```js
const linie = 2 + Math.random()*4;
K.feindMoral -= schaden + linie;
```

**Das ist die wichtigste Zeile im Kampfsystem.** Jede Runde sinkt der Widerstand des Feindes um 2–6 von allein, weil zweihundert andere Männer ebenfalls schießen. Ohne sie sind alle Gefechte unwinnbar (siehe oben). Inhaltlich stimmt sie außerdem: Du bist ein Mann in einer Linie, nicht der Held.

### Tödlichkeit: Lebenspunkte (`src/kampf.js`, `lebenMax()` in `src/mechanik.js`)

```js
lebenMax = 40 + Konstitution·0,6          // 52 bei 20 · 64 bei 40 · 82 bei 70 · 94 bei 90
Treffer:  25 % → 15–25 Schaden + schwere Wunde (Abzug 14) + Atem −20
          75 % →  5–11 Schaden + Streifschuss  (Abzug  5) + Atem  −8
Leben ≤ 0 → Tod
```

**Konstitution bestimmt, wie viel man aushält, nicht ob eine Kugel überhaupt töten kann.** Das ist der ganze Umbau. Vorher senkte Konstitution die Todeschance je Treffer, und ab 58 war sie rechnerisch null — ein Mann, den keine Kugel tötet (Exploit 1 unten). Eine Klammer auf den Schutz hat das notdürftig geflickt, aber die Kurve blieb falsch: Konstitution kaufte Unverwundbarkeit statt Zähigkeit. Jetzt ist sie monoton — mehr Konstitution heißt mehr Treffer, die man wegsteckt, aber genug Treffer töten jeden. **Deshalb darf die Herkunft die 70 der Poolverteilung überschreiten**, und deshalb ist die Deckelung aus Exploit 2 wieder aufgehoben.

`lebenMax()` rechnet vom **rohen** Attribut, nicht von `wert()`. Sonst schrumpfte die Obergrenze mitten im Gefecht, weil Wunden die Konstitution senken — das wäre die alte Todesspirale in neuer Form.

> **Die Zahl, an der alles hängt, ist neun.** So oft wird ein Mann in beiden Feldzügen zusammen getroffen — gemessen über 20 Läufe: 8,9 Treffer bei 10 Gefechten und 57 Kampfrunden, also rund 16 % je Runde. Ein Vorrat, den neun Treffer nicht leeren, tötet niemanden. Die erste Eichung auf 6 Schaden je Treffer (plus Feldscher-Heilung nach jedem Gefecht) ergab gemessen **100 % Überlebende bei 60 Läufen** — kein einziger Toter. Ein Treffer muss also teuer sein: im Mittel 11 Punkte, damit ein Mann mit Konstitution 40 am sechsten stirbt, einer mit 20 am fünften, einer mit 70 am achten. Das ist auch inhaltlich richtig: Wer 1796 vier Mal getroffen wird, steht nicht mehr.

**Geheilt wird mit der Zeit — aber der Atem steigt nie über das Leben** (`atemKlemmen()` in `src/mechanik.js`). Das ist das Paar, das einen Verwundeten verwundet spielen lässt, ohne ihn dauerhaft zu verkrüppeln *(Entscheidung vom 28.07.2026, ersetzt die frühere Regel „Genesung nur im Lager")*:

| Quelle | Wieviel |
|---|---|
| Jede Station, von allein („der Lauf der Zeit") | +5 % — erste Fassung 8 % fraß den Blutzoll des Rückzugs wieder auf |
| Lagerabend „Schlafen und liegen bleiben" | +25 % |
| Winterwoche „Schlafen, essen, nichts tun" | +60 % |
| Ein Jahr Garnison beim `uebergang` | voll |

**Der Atem-Deckel ist die Kehrseite:** Mit 25 Leben stehen einem höchstens 25 Atem zu — unter der Warnschwelle 35, nahe am Malus bei 30. Ein Schwerverwundeter kommt also von allein wieder hoch, aber bis dahin kämpft, marschiert und übt er als der, der er gerade ist. `atemKlemmen()` wird nach **jeder** Änderung an Atem oder Leben gerufen — wer eine neue Stelle baut, die daran dreht, ruft sie ebenfalls, sonst leckt der Deckel. Nebenwirkung, die Absicht ist: Auch ein Gesunder mit Konstitution 70 hat höchstens 82 Atem — Konstitution kauft jetzt auch Luft.

- **Der Streifschuss kostet zweierlei, und das ist Absicht:** Blut (bleibt) und eine Wunde, die der Feldscher nach dem Gefecht zunäht (bleibt nicht). Ohne die Wunde stimmte zwar die Todesrechnung, aber ein Mann schoss den ganzen Feldzug wie am ersten Tag — gemessen stieg der Caporal-Anteil auf 57 %, weil bessere Gefechte mehr Ruf bringen und Ruf die Beförderungsschwelle ist. Der Kratzer soll den Rest des Gefechts wehtun, nicht den Rest des Krieges.
- **Eine Wunde aus einer Szene kostet 10 Lebenspunkte**, tötet aber nie unmittelbar (`anwenden()` klemmt bei 1). Der Tod gehört ins Gefecht, wo er einen Text und einen Ort hat; Ruhr und das Fieber aus Jaffa lassen einen bloß so geschwächt hineingehen, dass die nächste Kugel reicht.
- **Die Wundenobergrenze 5 mit Verbluten ist ersatzlos weg.** Sie war der zweite Todespfad und wird von den Lebenspunkten mit erledigt.
- **Wunden schlagen voll auf körperliche Werte** (Konstitution, Geschick, Muskete, Bajonett, Reiten), **nur zu einem Drittel auf geistige**. Vorher zogen sie von *allem* ab — das erzeugte eine Todesspirale: eine Wunde senkte Konstitution, das erhöhte die Todeschance, die nächste Wunde senkte sie weiter.

> **Was der Umbau nebenbei abschafft: den frühen Tod.** Unter dem alten Wurf konnte man bei Montenotte in der zweiten Runde fallen. Jetzt braucht der Tod fünf bis acht Treffer, also mehrere Gefechte — niemand stirbt mehr vor Castiglione. Das ist die Kehrseite der Fairness und muss beim Lesen der Endrang-Zahlen mitgedacht werden (siehe „Zielwerte").

> **Spielstand:** `LAUF_FASSUNG` steht deshalb auf **2**. Der Wandler gibt einem angefangenen Feldzug aus Fassung 1 den vollen Vorrat abzüglich dessen, was seine bleibenden Wunden gekostet haben, mindestens aber 30 %.

### Charaktererschaffung (`src/oberflaeche.js`, `src/daten/grundwerte.js`)

- Sockel **20** auf allen sechs Attributen, Verteilungspool **120**, Höchstwert bei Erschaffung **70**.
- **Bildung ist vom Pool ausgenommen** und bleibt bei 20 — man kann nicht lesen.
- Alle neun Fertigkeiten starten bei **10**.
- **Jede Herkunft verteilt exakt 50 Punkte netto**, nur anders gewichtet, teils mit Abzügen. Keine ist stärker. Wer eine neue Herkunft hinzufügt, hält die 50 ein.
- **Die Obergrenze 70 gilt für den Pool und für den Veteranenpunkte-Kauf, nicht für die Herkunft.** Ein Bauernsohn darf mit Konstitution 90 anfangen — seit den Lebenspunkten ist das kein Exploit mehr, sondern zwölf Prozent mehr Zähigkeit (Exploit 2 unten).

#### Drei Exploits, die dort steckten

**1. Konstitution ≥ 58 machte den Tod unmöglich.** Die Tödlichkeitsformel lautete `Math.random()*100 - (Konstitution-40)/3 > 94`. Bei Konstitution 58 ist der Abzug 6, die Schwelle also 100 — nicht erreichbar. Man konnte einen Mann bauen, der von einer Kugel *nie* stirbt, sondern nur Wunden sammelt, und Wunden heilen nach jedem Gefecht. Das hebelt Invariante 1 aus, ohne dass es jemand merkt.

> Zuerst behoben durch eine Klammer (`schutz = clamp((Konstitution−40)/3, −10, +5)`), also Todeschance je Treffer zwischen 1 % und 16 %. Das war ein Pflaster: Es nahm die Unsterblichkeit weg, ließ aber die falsche Kurve stehen — Konstitution kaufte weiterhin Unverwundbarkeit. **Endgültig behoben durch die Lebenspunkte** (siehe „Tödlichkeit"): Konstitution kauft jetzt Zähigkeit, und die Kurve ist monoton.

**2. Die Herkunft wurde ungedeckelt addiert.** Der Pool war auf 70 begrenzt, die Herkunft kam obendrauf: Ein Bauernsohn mit 70 Konstitution stand nach der Herkunft bei **90** — und war damit über der Schwelle aus Exploit 1. Die beiden Fehler zusammen ergaben einen unsterblichen Charakter, den man in dreißig Sekunden bauen konnte.

> Zwischenzeitlich deckelte `neuerCharakter()` deshalb auch nach der Herkunft auf 70 beziehungsweise 60. **Diese Deckelung ist wieder aufgehoben** — sie war nur nötig, solange Konstitution Unverwundbarkeit kaufte. Seit den Lebenspunkten ist eine Konstitution von 90 kein Exploit mehr, sondern 94 statt 82 Lebenspunkte: zwölf Prozent mehr Treffer, die man wegsteckt, für eine Herkunft, die dafür anderswo zahlt. Die Herkunft ist das, was man mitbringt, nicht das, was man sich aussucht; die 70 begrenzt weiterhin die Poolverteilung und den Veteranenpunkte-Kauf.

**3. Zwei Herkünfte zahlten in tote Währung.** Netto verteilen alle sechs genau 50 Punkte, aber Reiten und Kartenkunde tun in den gebauten Kapiteln **nichts**. Gemessen an dem, was wirkt:

| Herkunft | netto | davon wirksam (vorher) | jetzt |
|---|---|---|---|
| Bauernsohn, Schmiedsgeselle, Wilderer, Straßenjunge | 50 | 50 | 50 |
| Fuhrmannssohn | 50 | **20** | 30 |
| Schreibergehilfe | 50 | **30** | 40 |

> Der Fuhrmannssohn bekam 30 Punkte auf Reiten — eine Fertigkeit, die frühestens ab Rang 7 zählt — und zahlte dafür mit Kaltblütigkeit. Der Schreibergehilfe zahlte −20 Konstitution, was ihn direkt gefährlicher lebte, für 20 Punkte Kartenkunde. Umgeschichtet: Fuhrmann Reiten 30 → **20**, Konstitution 10 → **15**, Kaltblütigkeit −10 → **−5**. Schreiber Kartenkunde 20 → **10**, Konstitution −20 → **−10**. Netto bleiben es 50; der Rest ist in Währung umgebucht, die im Spiel etwas kauft. Ganz gleich werden sie erst, wenn Reiten und Kartenkunde ab Rang 7 wirklich zählen — das ist Absicht und steht so im Konzept.

**Was kein Exploit ist:** Zwei Attribute auf 70 zu ziehen (kostet 100 der 120 Poolpunkte) ist eine legitime Spezialisierung — sie öffnet beide Elitezweige und kostet Breite. Und dass „Auswürfeln" schlechter verteilt als die Hand, ist der Sinn des Knopfes.

### Proben und Wachstum (`src/mechanik.js`)

```
Zielwert = Wert − Schwierigkeit + 50        (begrenzt auf 5…95)
Wurf 1–100, Erfolg wenn Wurf ≤ Zielwert
```
Wert 40 gegen Schwierigkeit 40 ist also ein Münzwurf. Das ist die Eichung — Schwierigkeiten in Szenen immer gegen die erwarteten Werte des Kapitels ansetzen (Kapitel 1: Attribute 20–70, Fertigkeiten 10–50).

```
Wachstum = 1,7 × Intensität × (100 − Wert)/100,  mit 75 % Wahrscheinlichkeit
```
Abnehmender Ertrag ist Absicht: von 12 auf 40 geht schnell, von 80 auf 90 dauert Jahre. **Nebeneffekt, der erhalten bleiben muss:** gekaufte hohe Startwerte wachsen langsamer, der Vorsprung schaukelt sich nicht auf.

### Aufstieg (`src/kampf.js`)

- **Elitekompanie (Rang 2):** Grenadier ab Konstitution 55, Voltigeur ab Geschick 55. Keine Beförderung, sondern eine Auswahl — der Voltigeur bekommt ein anderes Kampf-Minispiel (zielen, Deckung wechseln, flach hinlegen), nicht bessere Werte.

> **Hinlegen kann jeder Zweig.** Der Voltigeur hatte die Wahl anfangs nicht — ein Fehler, denn der Plänkler ist gerade der, der sich hinlegt: Er steht in keiner Linie, die jemand halten müsste. Ohne sie war sein Zweig der einzige, der im Gefecht nicht verschnaufen konnte, obwohl die Atem-Warnung ausdrücklich darauf verweist.
- **Caporal (Rang 3):** Ruf ≥ **30** und Gunst ≥ **4** und eine Vakanz. Alle drei, sonst nichts. Die Schwelle steht als `CAPORAL_RUF` / `CAPORAL_GUNST` in `src/kampf.js` und wird von den Texten mitbenutzt — nur dort ändern.

> **Warum 30 und 4, und warum die Gunst-Quellen kleiner wurden.** Gemessen an 60 Läufen kamen **alle 42 Überlebenden mit exakt Gunst 3** bei Verona an — keine Verteilung, sondern eine Konstante. Grund: Eine einzige Szenenwahl (Mondovì melden, damals +3) erfüllte die Anforderung allein. Damit war die Schwelle 3 geschenkt und 4 unerreichbar; Fürsprache wurde gekauft, nicht erarbeitet, was Invariante 5 aushöhlt.
>
> Deshalb zwei Änderungen zusammen: **Schwelle auf 4** und **keine einzelne Tat trägt sie mehr allein** — Mondovì „melden" 3 → **2**, Mantua „dem Fourier auf die Finger sehen" 4 → **3**. Wer Caporal werden will, braucht jetzt zwei Handlungen: eine sichtbare Tat *und* Abende am Feuer (Lager +1, Winterwoche +2, Savona zuhören +2, Dego Tornister +1).
>
> Der Ruf war beim Bot zweigipflig — 19–25 oder 36–41, dazwischen niemand. Zwischen 26 und 35 liegt also keine Trennlinie; **30** ist die lesbare Zahl in dieser Lücke und schneidet die untere Gruppe sauber ab.

### Was die Befehle des Caporals bringen (`src/kampf.js`)

Beides sind Handlungen, die es für den Füsilier nicht gibt — sie sind der eigentliche Rangunterschied.

| Befehl | Wirkung | Wofür man ihn nimmt |
|---|---|---|
| **Salve befehlen** | Autoritäts-Probe 40 · 26–36 Schaden (Fehlschlag 6) · **deine eigene Muskete bleibt geladen** | Das Gefecht schneller entscheiden. Mehr als doppelt so viel Schaden wie ein eigener Schuss, und weil die anderen feuern, musst du nie nachladen — als Caporal wirst du in erster Linie zum Befehlsgeber und nicht mehr zum Schützen. |
| **Lücke schließen lassen** | Drill-Probe 35 · Gefahr −8 · **eure Linie verliert drei Runden lang halb so viele Männer** · Kameradschaft +4 · beim ersten Mal je Gefecht Ruf +1 | Deine Leute am Leben halten. Sichtbar an der eigenen Linie im Sichtfeld und an der Waage darunter. |

> **Warum „Lücke schließen" umgebaut wurde.** Vorher gab es −14 Gefahr und Kameradschaft +4 — und damit war die Handlung sinnlos: „Hinknien" gibt −22 Gefahr *und* +10 Atem und steht jedem offen. Ein Rangbefehl, der schlechter ist als die Grundhandlung, ist kein Rangbefehl. Jetzt schützt Hinknien **dich**, die Lücke schützt **deine Leute** — zwei verschiedene Fragen, und die zweite ist die, die einen Caporal von einem Füsilier unterscheidet. Der Ruf-Punkt gibt es nur einmal je Gefecht (`K.lueckeGelobt`), sonst ließe er sich in acht Runden achtmal einsammeln.

### Ereignisse im Gefecht (`GEFECHTS_EREIGNISSE` in `src/kampf.js`)

Die Rundenaktionen sind Handwerk: laden, feuern, knien. Sie stellen keine Frage, sie kosten nur Zeit. **Ereignisse stellen die Frage, um die es in einem Gefecht wirklich geht — wie weit gehst du.** Jedes hat einen Weg, der nichts kostet und nichts bringt, und einen, der Ruf, Nennungen und ein kürzeres Gefecht bringt und dich umbringen kann.

> **Warum sie gebaut wurden.** Ein kundiger Spieler war nicht zu töten — 40 von 40 Läufen überlebten beide Feldzüge. Optimales Spiel ließ keine Frage mehr offen: Salve befehlen, knien, wenn es eng wird, fertig. Die naheliegende Antwort wäre gewesen, an Schaden und Gefahr zu drehen; die bessere ist, dass der Weg nach oben durch Stellen führt, an denen man auch bleiben kann. **Ereignisse machen Mut zu einer Entscheidung mit Preis, statt Feigheit zu einer Zahl.**

| Ereignis | Wann | Der Weg, der etwas kostet | Gewinn | Preis bei Misserfolg |
|---|---|---|---|---|
| **Der Adjutant sucht acht Mann** | Runde ≤ 4, Feind über 50 % | Geschütze vernageln · Bajonett 45 | Moral −22 · Ruf +5 · Nennung | Leben −30 · Atem −25 |
| **Die Linie wankt** | eigene Linie < 72 | Stehen bleiben · Kaltblütigkeit 40 | Moral −8 · Ruf +3 · Linie +6 | Leben −22 · Gefahr +6 für den Rest |
| **Sie kommen** | ab Runde 3, Feind über 40 % | Auf zwanzig Schritt halten · Kaltblütigkeit 45 | Moral −26 · Ruf +4 | Leben −28 |
| | | *oder* entgegengehen · Bajonett 40 | Moral −30 · Ruf +4 | Leben −34 |
| **Der Adlerträger fällt** | eigene Linie < 85 | Ihn holen · Kaltblütigkeit 50 | Moral −14 · Ruf +6 · Nennung | Leben −30 |
| **Jemand ruft** | eigene Linie < 88 | Hereinziehen · Konstitution 40 | Kameradschaft +12 · Gunst +1 · Ruf +2 | Leben −24 |
| **Sie gehen** | Feind unter 32 % | Nachsetzen · Konstitution 45 | **Gefecht sofort gewonnen** · Ruf +5 · Nennung | Leben −30 · Linie −14 |

**Höchstens zwei je Gefecht, frühestens ab Runde 2, jedes nur einmal, Wurf 45 % je Runde.** Ohne die Obergrenze würde Akkon mit seinen neun Runden zur Ereigniskette, und die Frage nutzt sich ab, wenn sie fünfmal hintereinander kommt.

- **Ruf aus Ereignissen geht an `anerkennung()` vorbei** und damit an der Obergrenze von drei je Gefecht. Die gilt für Handlungen, die man jede Runde wiederholen kann, und soll das Einsammeln verhindern; ein Ereignis kommt höchstens einmal und kostet etwas. Es ist genau das, wofür „besondere Dinge am Gefechtsende" gedacht war.
- **Die Wahl steht auf dem Chronikblatt** (`S.log`) und in „Was gesehen wurde" am Gefechtsende.
- **Wer mitten in der Frage aufhört, steht wieder vor ihr.** `fortsetzen()` prüft `K.ereignis` — sonst ließe sich eine Mutprobe durch Beenden und Fortsetzen umgehen, und das wäre dieselbe Lücke wie ein Rücksetzpunkt im Lager.
- **Mut kauft die Wertung, nicht den Rang.** Zum Caporal fehlt fast nie der Ruf, sondern die Gunst — und die holt man am Feuer, nicht vor der Linie.

**Vier Gefechte haben eine Sondermission** (`nur:` trägt die Stations-ID) — der Moment, für den das Gefecht berühmt ist, aus der Höhe eines Mannes im zweiten Glied: die **Brücke von Lodi** (Spitze der Kolonne oder Furt), der **General im Sumpf von Arcole**, der **Riss im Karree von Embabeh**, die **Sturmkolonne von Akkon**. Beim Würfeln haben sie Vorrang und 60 % je Runde statt 45 — eine Sondermission, die fast nie stattfindet, wäre keine. Akkon fällt trotzdem nicht (Invariante 8): Auch wer die Bresche überlebt, sieht nur die zweite Mauer.

**Der riskante Weg einer Sondermission ist eine Kette** (`kette:` statt `probe:`): zwei bis drei Proben hintereinander — Akkon: die Rampe (Geschick 40), die Bresche (Bajonett 45), der Rückweg (Kaltblütigkeit 45) —, und **jeder Fehlschlag kostet sofort 12–20 Leben**. Wer unterwegs auf null fällt, fällt dort, mit dem Todestext der Mission („Gefallen in der Bresche von Akkon"). Zurück gibt es ab der ersten Stufe nicht; genau das unterscheidet den Gang vom Rundengeschäft, aus dem man sich jede Runde neu entscheiden kann. Die Wirkung am Ende braucht die **Mehrheit der Stufen**; auch der Misserfolg gibt Ruf +2 und eine Tat — hingegangen ist hingegangen. Auf dem Knopf stehen alle Stufen mit Wert und Schwierigkeit, damit die Entscheidung eine ist. **Das ist die Stelle, an der das Spiel einen kundigen Spieler töten kann:** Worst Case Akkon sind rund 50 Punkte in einem einzigen Zug — wer angeschlagen vortritt, kann liegen bleiben.

**Knien ist begrenzt: höchstens drei Runden am Stück** (`K.duckFolge`). Zwei Runden fragt niemand, die dritte kostet Ruf −2, eine vierte gibt es nicht — der Knopf ist gesperrt, bis man eine Runde etwas anderes getan hat. Ohne die Grenze war Knien ein Panzer (−22 Gefahr, Restrisiko ~4 %), hinter dem sich jedes Gefecht aussitzen ließ; der Blutzoll des Rückzugs machte das Aussitzen teuer, die Kniegrenze macht es unmöglich.

### Fünf Hebel, die das Spiel gefährlich machen (28.07.2026)

Bis dahin war ein kundiger Spieler nicht zu töten: 40 von 40 überlebten beide Feldzüge. Der Grund war eine Bilanz, keine Einzelzahl — über 200 Punkte Genesung je Lauf gegen rund 70 Punkte Schaden. Diese fünf greifen ineinander, statt am Schaden zu drehen:

| # | Hebel | Wo | Was |
|---|---|---|---|
| 1 | **Offene Wunden verkleinern den Vorrat** | `lebenMax()` | je Abzugspunkt 0,6 Leben weniger, Boden bei 40 % |
| 2 | **Krankheit zehrt** | `zehrt:` in Kapiteldaten | 3–4 Leben je Station, bis sie behandelt ist |
| 3 | **Ruf zieht Ereignisse an** | `ereignisWuerfeln()` | 45 % + Ruf/400, gedeckelt 65 %; ab Ruf 30 ein drittes je Gefecht |
| 4 | **Der Platz des Toten** | `kampfAktion()` | ab Caporal +2 Gefahr je Runde |
| 5 | **Höhepunkte** | `haerte:` in Kapiteldaten | +40 % Schaden **und** +3 Gefahr |

**1 — Wunden verkleinern den Mann.** Das schließt die Lücke, durch die ein kundiger Spieler bisher kam: Leben heilt schnell nach (Zeit, Lagerabend, Winterwoche), Wunden wird man nur langsam los — der Feldscher näht je Gefecht die *leichteste*, der Rest wartet auf die Winterwoche oder das Jahr Garnison. Wer mit zwei alten Wunden nach Arcole geht, hat 66 statt 82 Punkte und über den Atem-Deckel entsprechend weniger Luft. **Der Boden bei 40 % ist die Sicherung gegen die Todesspirale:** Wunden machen einen kleiner, nie tot.

**2 — Krankheit ist die Einlösung von „gefährlicher als Kugeln" (KONZEPT.md).** Sumpffieber (3), Hitzschlag (3), Ruhr (4), Fieber aus Jaffa (4) kosten an *jeder* Station weiter. Sie töten nie selbst (`anwenden()` und `stationErledigt()` klemmen bei 1), aber sie liefern einen Mann mit leerem Vorrat und keiner Luft am nächsten Gefecht ab. **Heilbar nur an zwei Stellen:** Lagerabend „Schlafen" gegen eine Konstitutions-Probe 35, oder eine Winterwoche (die Krankheit rückt dort vor). Der Feldscher kann sie nicht — eine Ruhr näht man nicht zu.

**3 — Wer gesehen wurde, wird geholt.** Der Adjutant sucht keine Unbekannten. Trifft gezielt den Aufsteiger und lässt den Vorsichtigen in Ruhe: Ehrgeiz koppelt sich an Blut, ohne dass jemand gezwungen wird.

**4 — Der Caporal steht außen am Glied**, dort, wo sein Vorgänger stand, und die Stelle wurde frei, weil er fiel. Invariante 5 von der anderen Seite, und Invariante 4 bleibt gewahrt: Der Rang gibt weiter Knöpfe, die Zahl hier ist sein *Preis*, nicht seine Macht.

**5 — Ein bis zwei Höhepunkte je Feldzug.** Es sind dieselben vier, die eine Sondermission tragen — **Lodi, Arcole, Embabeh, Akkon** —, und das ist kein Zufall, sondern der Entwurf: Das Gefecht, für das man berühmt wird, ist das, an dem man stirbt. Montenotte und Alexandria bleiben Lehrgefechte. `haerte` schaltet Schaden *und* Gefahr zusammen, damit ein Feld genügt; angesagt wird es im Lagebild („Das hier wird kein gewöhnliches Gefecht"), überrascht wird niemand. **Die +3 Gefahr sind der einzige der fünf Hebel, der auch den Vorsichtigen trifft** — beschossen wird man, ob man vortritt oder nicht.

### Zwischenfälle auf dem Marsch (`MARSCH_EREIGNISSE` in `src/oberflaeche.js`)

**Elf kleine Szenen zwischen den Stationen** — sieben allgemeine (Verbandsplatz, Briefe, Protze, Nachtwache, Kartenspiel, Requisition, der kranke Nebenmann), vier ägyptische (Brunnen, Beutepferd, Ingenieurkarte, Basar). Gewürfelt beim ersten Betreten einer Station mit Marschweg (35 %, jeder Zwischenfall einmal je Lauf, nie vor Gefechten — dort trägt der Anmarsch die Last). Ein Zwischenfall tötet nie: `anwenden()` klemmt das Leben bei 1, der Tod gehört ins Gefecht.

**Die Sperr-Regel:** Wer eine Probe erkennbar nicht bestehen kann (`ab:{min, sonst}`), bekommt **keinen Knopf, sondern einen Satz** — der Analphabet wird nicht gefragt, ob er Briefe schreiben will: „Die Kameraden fragen die Reihe entlang, wer schreiben kann. Auch dich. Du musst verneinen, wie fast alle." Geprüft wird gegen `wert()`, nicht das rohe Attribut — ein Verwundeter kann Wege verlieren, die ihm gesund offenstünden. Wer eine neue Sperre baut, schreibt den `sonst`-Satz mit; ein stummer gesperrter Knopf wäre die falsche Fassung derselben Idee.

**Vier Zwischenfälle geben toten Fertigkeiten ihre erste Verwendung:** Feldchirurgie (Verbandsplatz), Reiten (Protze, Beutepferd), Kartenkunde (Ingenieur), Bildung vor Rang 4 (Briefe). Das ist die Einlösung von Exploit 3: Die Herkünfte, die in diese Währungen zahlen, sehen jetzt etwas dafür. Der Hänge-Zustand steht in `LAUF.marsch` und wird von `naechster()` vor der Station geprüft — wer mitten im Zwischenfall aufhört, steht wieder vor ihm, wie bei den Gefechts-Ereignissen.

Gemessen (je 40 Läufe): Die Zwischenfälle kosten auch den Vorsichtigen — 95 % statt 100 %, 2 Tote je Gemüt. Der Abstand der Gemüter liegt jetzt in Rang und Punkten, nicht mehr nur im Überleben.

### Ein verlorenes Gefecht kostet Blut (`kampfEnde` in `src/kampf.js`)

```js
if(!sieg) S.leben -= 5 + 13·(Restwiderstand des Feindes / Anfangswert)
```

**Verlieren war gratis, und das machte alle Ereignisse zahnlos.** Wer unter 40 % Leben fiel, kniete sich hin (−22 Gefahr, Restgefahr etwa 4 %), ließ die Runden auslaufen und schlief sich im Lager wieder hoch — gemessen null Tote in 80 Läufen, mutig wie vorsichtig. Ein Gefecht, das man nicht gewinnt, muss man verlassen, und eine Linie, die rückwärts durchs Feuer geht, lässt Männer liegen. Historisch ist das dieselbe Wahrheit: Gefallen wird beim Weichen, nicht im Stehen. Wen es unter null drückt, den trägt es auf dem Rückzug — `todesart` sagt das dann auch.

### Wertung Kapitel 1 (`src/abschluss.js`)

```
Rangwert + 2×Stationen + 5×(Ruf/10) + 3×Nennungen + 25 (lebend) + 10 (nie gekniffen)
```
Rangwerte 0 / 12 / 26. Kaufladen kostet 12–40 VP plus den Mantel (30), alles zusammen 196.

> **Stationen von 3 auf 2 Punkte gesenkt**, weil es mit Kapitel 2 jetzt 32 statt 16 Stationen sind. Bei 3 Punkten hätte allein das Durchkommen 96 Punkte gebracht — mehr als der ganze bisherige Spitzenlauf. Die Reihe der Anpassungen (4 → 3 → 2) folgt derselben Regel: **Das Durchkommen darf nie mehr als etwa die Hälfte der Ladensumme wert sein**, sonst kauft ein einziger guter Lauf alles.

> Diese Wertung gilt nur für den Prototyp mit zwei Kapiteln. Die Skala des vollen Spiels (Maximum 918, Rangwerte bis 580) steht in KONZEPT.md und wird übernommen, sobald mehrere Kapitel existieren.

### Veteranenpunkte in Ausbildung (`src/oberflaeche.js`, `PRO_PUNKT` in `grundwerte.js`)

Die Erschaffung läuft in **zwei Schritten**, und die Reihenfolge ist der ganze Witz:

1. **Wer bist du** — Name, Herkunft, die 120 Poolpunkte auf die Attribute.
2. **Veteranenpunkte** — auf die *fertigen* Werte legen: Attribute, Fertigkeiten, Ausrüstung.

```js
PRO_PUNKT = [1,1,2,2,3,4,6,8,11,15]    // VP je Punkt, nach Zehnerbereich
kostenVon(a,b)                          // Summe für den Weg von a nach b
```

**Gerechnet wird vom tatsächlichen Wert, nicht vom Sockel.** Weil Schritt 1 zuerst kommt, steht schon fest, was Herkunft und Pool ergeben haben. Ein Wilderer mit Muskete 40 zahlt für die nächsten fünf Punkte 15 VP; wer bei 10 steht, zahlt 5. Spezialisierung wird teuer, Breite bleibt bezahlbar — genau das, wofür `PRO_PUNKT` gedacht war.

| Kauf | Kosten |
|---|---|
| Fertigkeit 10 → 20 | 10 VP |
| Fertigkeit 40 → 45 | 15 VP |
| Attribut 20 → 25 | 10 VP |
| Attribut 60 → 70 | 60 VP |

**Obergrenzen für den Endwert: Attribute 70, Fertigkeiten 60** — dieselbe 70 wie bei der Pool-Verteilung. Wer durch Herkunft schon darüber liegt, kann dort nichts mehr kaufen; das muss man sich im Feld verdienen.

> **Warum die Staffelung als Bremse reicht.** Ein Spitzenlauf bringt etwa 160 VP. Weil vom Istwert gerechnet wird, kostet das Nachschärfen einer Stärke am meisten — die 160 Punkte reichen für Breite oder für eine einzige Spitze, nie für beides. Dazu kommt die zweite, schon eingebaute Bremse aus `nutzen()`: Hohe Startwerte wachsen langsamer, weil das Wachstum vom Abstand zu 100 abhängt.

**Der frühere Entwurf rechnete vom Sockel** (Attribute 20, Fertigkeiten 10) und stand *vor* der Erschaffung. Das war vorhersagbar, aber blind: Man kaufte Punkte, ohne zu wissen, was Herkunft und Pool daraus machen, und der Kaufbildschirm lag unter der Ausrüstungstabelle, wo ihn niemand fand.

**Invariante 3 bleibt gewahrt:** Gekauft wird der Ausgangspunkt, nie der Aufstieg. Rang, Ruf, Gunst und Nennungen sind unkäuflich.

### Zielwerte

**Achtung: Der Testbot misst seit dem 28.07.2026 etwas anderes als vorher.** Er würfelt seine Attribute nicht mehr aus, sondern verteilt sie bewusst, ruht, wenn er verwundet ist, und befiehlt als Caporal die Salve. Gemessen wird damit, wie hart das Spiel für einen **kundigen** Spieler ist — vorher, wie hart es für einen blinden war. Alle Zahlen vor diesem Datum sind mit den neuen nicht vergleichbar.

**`balance.js` misst seit den Gefechts-Ereignissen zwei Gemüter**, weil das Spiel zwei Antworten hat. `node test/balance.js 40` ist der vorsichtige Bot: Er tritt nur vor, wo seine Werte es klar tragen. `MUT=1 node test/balance.js 40` tritt immer vor, außer es steht um sein Leben. **Der Abstand zwischen beiden Zahlen ist die Balance der Ereignisse.**

| Größe | Soll | vorsichtig | mutig |
|---|---|---|---|
| **Italien überstanden** | Sollwert wird neu gesetzt, siehe unten | **98 %** | **93 %** |
| **Beide Feldzüge überstanden** | noch keiner | **98 %** | **78 %** |
| Gestorben | — | 1 von 40 | **9 von 40** |
| **Elitekompanie erreicht** | noch keiner | 85 % | 85 % |
| **Caporal erreicht** | ~30 % (galt für den blinden Bot) | 83 % | 85 % |
| Punkte, Median | — | 199 | 192 · Spitze **240** |

> **Die Achse trägt, und zwar deutlich:** Mut kostet neunmal so viele Männer wie Vorsicht (9 Tote gegen 1), und der mutige Lauf holt trotzdem die Spitzenwertung (240 gegen 227). Wer an den Ereignissen oder den fünf Hebeln dreht, muss diesen Abstand erhalten — **vorsichtig überlebt, mutig steigt auf und stirbt öfter.**

> **Erreicht, nicht überlebt.** Gezählt wird seit dem 28.07.2026 der höchste Rang, den ein Mann je getragen hat, auch wenn er zwei Stationen später fällt. Vorher zählte das Skript den Rang *am Ende* — und das maß nach den Lebenspunkten vor allem, wann gestorben wird: Weil kaum noch jemand vor der Beförderungsstation stirbt, stieg die Endrang-Zahl auf 58 %, ohne dass die Beförderung leichter geworden wäre. Die neue Zahl misst die Schwelle selbst.

> ### Wo die Härte jetzt steht
>
> **Der Weg dorthin, zum Nachlesen:** Ein kundiger Spieler war lange nicht zu töten — 40 von 40 überlebten beide Feldzüge. Die alten 45–55 % waren nie die Härte des Spiels, sondern die Härte für einen Bot, der seine Attribute auswürfelte und sich nie ausruhte. Drei Dinge trugen den Unterschied: Konstitution 70 statt Zufall (82 statt 64 Lebenspunkte), kürzere Gefechte durch Salve und gezieltes Feuer (drei Runden statt acht, und Treffer kommen je Runde), und Ruhen im Lager.
>
> **Gebaut wurde daraufhin nicht am Schaden, sondern an den Entscheidungen** — Gefechts-Ereignisse, Sondermissions-Ketten, Blutzoll beim Rückzug, Kniegrenze, Atem-Deckel, Marsch-Zwischenfälle — und zuletzt die fünf Hebel oben. **Ergebnis: mutig 9 Tote von 40, vorsichtig 1.**
>
> **Was offen bleibt und eine Entwurfsfrage ist, keine Zahlenfrage:** Ein Spieler, der nie vortritt und im Lager schläft, kommt weiterhin fast sicher durch (98 %). Das ist vertretbar — ein Feigling *soll* überleben; er wird nur nie Caporal und bleibt in der Wertung unter dem, der vortritt. Wer die Höhe trotzdem senken will, dreht am ehesten an der Selbstheilung je Station (5 %) oder an der Heilung je Lagerabend (25 %). **Entschieden bleibt (28.07.2026): Die Lagerabende bleiben, wie sie sind** — die Härte kommt aus Entscheidungen, nicht aus Verwaltungsknappheit. **Wer daran dreht, misst danach vier Zahlen** — Überleben und erreichte Ränge, je vorsichtig und mutig.

**Seit Kapitel 2 misst `test/balance.js` zwei Quoten.** „Italien überstanden" war der alte Zielwert von 45–55 %; „beide Feldzüge" ist neu und hat noch keinen Sollwert — der Bot muss dafür 32 statt 16 Stationen überleben. Ohne diese Trennung wäre der alte Zielwert nach dem Anbau bedeutungslos geworden. Der Punkte-Median fällt von 91 auf 45, weil Stationen nur noch 2 statt 3 Punkte zählen und die meisten Läufe jetzt vor dem Ende sterben; die Spitze steigt dafür von 162 auf 230.

> **Ein Stolperstein beim Messen, zum zweiten Mal:** Die Erkennung von „Italien überstanden" prüft `/vorfrieden/i` **ohne Rücksicht auf Groß- und Kleinschreibung**. Kartenköpfe setzt das CSS in Großbuchstaben, und `innerText` liefert die gerenderte Fassung — eine Prüfung auf `'Vorfrieden mit Österreich'` meldete 0 %, während im selben Lauf acht Männer ganz Ägypten überlebten.

Die 120 Läufe der vorigen Messreihe (nur Kapitel 1) waren die belastbarste Messung dieser Sitzung. Zur Einordnung: Derselbe Stand *ohne* die Anerkennung im Gefecht lieferte über 80 Läufe 43 % / 30 % / 91 — die Anerkennung hebt also den Caporal-Anteil um rund vier Punkte und sonst nichts, genau wie beabsichtigt. Der Anteil der Elitekompanie schwankt zwischen den Messreihen stark (8 % hier, 19 % zuvor), weil er fast nur davon abhängt, was `Auswürfeln` bei der Erschaffung an Konstitution und Geschick ausschüttet.

Verlauf derselben Sitzung, damit niemand die Zahlen verwechselt:

| Stand | Läufe | überstanden | Caporal | Punkte-Median |
|---|---|---|---|---|
| nach der Schwellenänderung | 80 | 48 % | 28 % | 88 |
| mit Atem-Erholung an jeder Station | 105 | 41 % | 42 % | 93 |
| ohne jede Erholung, nur Warnung | 120 | 38 % | 23 % | 60 |
| Warnung + volles Winterquartier | 80 | 44 % | 30 % | 86 |
| zusätzlicher Lagerabend ab Caporal | 80 | 49 % | 39 % | 95 |
| derselbe Stand am selben Nachmittag noch einmal | 80 | 43 % | 30 % | 91 |
| Anerkennung im Gefecht · nur Kapitel 1 | 120 | 43 % | 34 % | 91 |
| mit Kapitel 2 · Spalte zeigt „Italien überstanden" (gültig) | 60 | 45 % | 40 % | 45 |
| Lebenspunkte, erste Eichung (6 Schaden, Feldscher heilt) | 60 | **100 %** | 93 % | 207 |
| Lebenspunkte, 12 Schaden, Streifschuss ohne Wunde | 60 / 80 / 80 | 48 / 64 / 51 % | 57 % | 77–183 |
| dieselbe Eichung, Streifschuss mit Wunde | 80 | 41 % | 55 % | 89 |
| 11 Schaden, Streifschuss mit Wunde · **blinder Bot** | 80 | 55 % | 58 % (am Ende) | 107 |
| derselbe Stand · kundiger Bot | 40 | 100 % | 93 % (erreicht) | 210 |
| Gefechts-Ereignisse · vorsichtig | 40 | 100 % | 88 % | 204 |
| Gefechts-Ereignisse · mutig | 40 | 100 % | 90 % | 212 |
| + höhere Misserfolgskosten, 45 % Wurf · vorsichtig / mutig | 40 / 40 | 100 / 100 % | 80 / 93 % | 201 / 210 |
| + Blutzoll beim Rückzug · vorsichtig | 40 | 100 % | 88 % | 204 |
| dieselbe Fassung · mutig | 40 | 95 % | 85 % | 211 |
| + Selbstheilung 8 %, Atem-Deckel, Kniegrenze, Sondermissionen · v / m | 40 / 40 | 100 / 98 % | 93 / 93 % | 206 / 215 |
| Selbstheilung auf 5 % · vorsichtig | 40 | 100 % | 85 % | 202 |
| dieselbe Fassung · mutig | 40 | 98 % | 88 % | 215 |
| + Sondermissions-Ketten, Stufenschaden 12–20 · vorsichtig | 40 | 100 % | 85 % | 202 |
| dieselbe Fassung · mutig | 40 | 95 % | 95 % | 202 |
| + Marsch-Zwischenfälle · vorsichtig | 40 | 100 % | 78 % | 196 |
| dieselbe Fassung · mutig | 40 | 98 % | 88 % | 202 |
| + fünf Hebel ohne die Höhepunkt-Gefahr · v / m | 40 / 40 | 100 / 100 % | 83 / 88 % | 199 / 202 |
| **+ Höhepunkte auch +3 Gefahr (gültig) · vorsichtig** | **40** | **98 %** | **83 %** | **199** |
| **dieselbe Fassung · mutig** | **40** | **93 %** | **85 %** | **192** |

**Der Testbot kauft nichts.** Alle Zahlen gelten für einen Lauf ohne Veteranenpunkte. Wer Ausrüstung oder Ausbildung kauft, spielt leichter — das ist der Sinn der Punkte und keine Verzerrung der Messung.

**Seit den Lebenspunkten streut das Skript stärker.** Derselbe unveränderte Stand lieferte bei 60/80/80 Läufen 48 %, 64 % und 51 % — sechzehn Punkte Spannweite, wo die Faustregel elf erwarten ließe. Zusammengefasst über alle 220 Läufe: 55 %. Grund ist die Bauart des Modells: Der Tod ist jetzt eine Schwelle (Summe des Schadens gegen den Vorrat) statt eines Wurfs je Treffer, und wie nah ein Lauf an dieser Schwelle landet, hängt fast ganz an der ausgewürfelten Konstitution. **Einzelmessungen unter 80 Läufen sind damit noch weniger aussagekräftig als vorher; wer eine Zahl braucht, fasst mehrere Durchgänge zusammen.**

Der Streubereich bei 40 Läufen ist etwa ±8 Punkte — ein einzelner Durchgang von 43 % oder 57 % sagt für sich genommen nichts. **Bei Zweifeln 80 Läufe messen**, wie hier geschehen.

**Offener Punkt seit den Lebenspunkten: Der Caporal-Anteil steht bei 58 %, fast doppelt so hoch wie der Sollwert von 30 %.** Die Ursache ist verstanden und folgt unmittelbar aus dem Umbau: **Die Endrang-Zahl zählt den Rang beim Tod mit, und der Tod kommt jetzt später.** Unter dem alten Wurf starb ein guter Teil der Männer vor der Beförderungsstation und ging als Fusilier in die Statistik; unter den Lebenspunkten braucht der Tod fünf bis acht Treffer, also stirbt niemand mehr vor Castiglione — wer fällt, ist meist schon Caporal. Der Sollwert von 30 % war gegen ein Modell geeicht, in dem ein Viertel der Männer die Beförderung nie erlebte, und ist mit dem neuen nicht unmittelbar vergleichbar. Zwei Hebel, falls er trotzdem gesenkt werden soll: die Schwelle (`CAPORAL_RUF` / `CAPORAL_GUNST`) oder der Ruf-Zuschlag `RUHM_JE_GEFECHT`. **Beides ist ungemessen** — wer daran dreht, misst beide Zahlen neu.

**Älterer offener Punkt (Stand vor den Lebenspunkten):** Der Caporal-Anteil stand mit 34 % vier Punkte über dem Sollwert von 30 % — gerade noch innerhalb der Zehn-Punkte-Regel, aber am oberen Rand. Der Weg dorthin ist mittelbar und war beabsichtigt: Der zusätzliche Lagerabend ab Caporal lässt mehr Beförderte den Feldzug überleben, und gezählt wird der Rang am Ende. Wer das senken will, hat zwei Hebel — die Caporal-Schwelle (`CAPORAL_RUF` / `CAPORAL_GUNST`) oder den Abend selbst. **Nicht empfohlen ist der Abend:** Er ist der Grund, warum der Rang sich nicht wie eine Strafe anfühlt.

Die Überlebensquote liegt mit 43 % zwei Punkte unter dem Band 45–55 % — innerhalb des Rauschens, aber am unteren Rand. Der Anteil ohne jede Beförderung ist mit 58 % wieder weit über dem Sollwert von 40 %, und nur 8 % erreichen die Elitekompanie; der Engpass bleibt die Schwelle von 55 in Konstitution beziehungsweise Geschick, an der die meisten schon bei der Erschaffung scheitern. Wer daran etwas ändern will, senkt diese 55.

**Gelernte Regel aus dieser Sitzung:** Alles, was die Kampfkraft hebt, hebt über den Ruf auch den Caporal-Anteil. Wer an Atem, Wunden oder Gefahr dreht, misst beide Zahlen — nicht nur die Überlebensquote. Und: **Ein einziger Erholungspunkt an der richtigen Stelle schlägt eine Erholung an jeder Station.**

`node test/balance.js 40` misst das. **Weicht der Wert nach einer Änderung um mehr als zehn Punkte ab, ist die Änderung zu prüfen.**

**Zwei Fallen beim Messen, beide teuer bezahlt:**

1. **Der Punkte-Median ist bei ~50 % Überlebensquote unbrauchbar.** Ein überstandener Lauf bekommt +25 und +10 pauschal; der Median springt deshalb um rund dreißig Punkte, sobald die Quote die 50 % kreuzt. Gemessen: 91 bei 43 % Überleben, 59 bei 36 % — dieselbe Mechanik, nur die andere Seite der Schwelle. **Der Median misst hier nicht die Härte, sondern nur, ob der mittlere Lauf zufällig überlebt hat.** Wer eine Änderung beurteilen will, nimmt die Quote.
2. **Das Rauschen ist größer, als es sich anfühlt.** Derselbe unveränderte Stand lieferte an einem Nachmittag 49 % und 43 %. Bei 80 Läufen ist eine Standardabweichung rund 5,6 Punkte, zwei also elf. **Wer einen Unterschied von unter zehn Punkten deutet, deutet Rauschen** — dagegen hilft nur, den alten Stand noch einmal zu messen (`git stash`) statt gegen eine Zahl von gestern zu vergleichen.

**Was der Testbot tut.** Er spielt so gut, wie es ohne Vorauswissen geht — das ist seit dem 28.07.2026 der Zweck des Skripts:

| Wo | Was |
|---|---|
| Erschaffung | Konstitution 70, Geschick 60, Kaltblütigkeit 40, Autorität 30 — feste Verteilung statt „Auswürfeln". Herkunft reihum durch alle sechs. |
| Elitewahl | Voltigeur vor Grenadier (zielen bringt 22–32 statt 12–20) |
| Gefecht | Lücke einmal je Gefecht · hinknien bei wenig Blut oder Luft · als Caporal immer die Salve · sonst feuern · nachladen. Kein Bajonett. |
| Lager | ruhen unter 60 % Leben · Fürsprache, solange Gunst < 4 · Muskete ölen · Schuster · scharf schießen · exerzieren |
| Winterquartier | ruhen unter 80 % Leben oder bei einer Wunde · sonst Fürsprache, Ausrüstung, Drill |
| Szenen | der Knopf mit dem größten Abstand zwischen Wert und Schwierigkeit; riskante mit Abschlag, bei wenig Blut gar nicht |
| Gefechts-Ereignisse | dieselbe Rechnung. **`MUT=1` sucht das Risiko** statt es zu meiden — außer es steht um sein Leben. |
| Veteranenpunkte | **kauft nichts.** Sonst wanderte die Messung: Der Vorrat ist der beste Lauf bisher, also spielte Lauf 40 ein anderes Spiel als Lauf 1. |

**Warum die feste Verteilung wichtiger ist, als sie aussieht.** „Auswürfeln" maß vor allem den Zufallsgenerator: Weil der Tod seit den Lebenspunkten eine Schwelle ist und der Vorrat an der Konstitution hängt, entschied der Wurf über den Lauf, bevor er begann — derselbe Stand lieferte 48 %, 64 % und 51 %. Mit fester Verteilung ist die Streuung weg, und 40 Läufe sagen mehr als vorher 80.

**Regel, die daraus folgt:** Wer eine Schwelle einführt, die mehrere Handlungen verlangt, muss dem Bot beibringen, sie zu verfolgen — sonst misst das Skript die Blindheit des Bots und nicht das Spiel. Das galt für die Gunst und gilt für jede weitere Schwelle.

---

## Ton

Was gemeint ist mit „nüchtern-brutal":

> *Gut:* „Guérin, der links neben dir stand, liegt seit einer Minute an den Brückenbalken und macht ein Geräusch, das aufhören wird."
>
> *Falsch:* „Tapfer stürmst du voran, das Herz voller Mut für Frankreich!"

Regeln für Szenentexte:

- Zweite Person, Präsens. Immer „du".
- Konkrete Zahlen und Gegenstände statt Adjektive. Elf Tage, zwei Sous, vierzig Schritt.
- Das Spiel wertet nicht. Es zeigt, was passiert, und schweigt darüber, ob es richtig war.
- Keine Rückmeldung darüber, ob eine moralische Entscheidung die richtige war. Nie.
- Nebenfiguren wiederkehren lassen — Sergent Martel, Guérin. Wenn Guérin stirbt, wird seine Stelle frei, und genau die bekommst du.

---

## Spielstand

Zwei Dinge werden gespeichert, und sie haben nichts miteinander zu tun:

| | Inhalt | Lebensdauer | Ort |
|---|---|---|---|
| **Chronik** | Veteranenpunkte, Läufe, erreichte Stationen | für immer | `marschallstab.chronik` (+ `.bak`) |
| **Lauf** | der angefangene Feldzug | bis Tod oder Kapitelende | `marschallstab.lauf` |

**Der Aussetz-Spielstand ist zum Aufhören da, nicht zum Wiederholen.** Ein einziger Platz, kein zweiter, keine Slots. Er wird beim Betreten eines Lagers angelegt *und angesagt* — das ist der sichtbare Halt — und danach bei **jedem** Schritt still überschrieben, auch nach jeder Kampfrunde. Deshalb bedeutet er immer „jetzt": Wer das Spiel beendet, kommt genau dorthin zurück, wo er war, und nie weiter zurück.

> **Warum nicht nur im Lager speichern?** Weil ein Halt im Lager, der ein Gefecht überdauert, ein Rücksetzpunkt ist: Wer im Gefecht sieht, dass es schiefgeht, schließt den Reiter und steht wieder im Lager. Das hebelt Invariante 1 aus. Ein Spielstand, der immer aktuell ist, kann nicht zum Zurückspulen benutzt werden — und leistet trotzdem alles, wofür man ihn will.

**Der Tod löscht ihn im selben Augenblick.** `toetlich()` ruft `laufVerwerfen()`, `zeigeTod()` noch einmal zur Sicherheit, `eintragen()` ein drittes Mal. Drei Stellen sind hier nicht zu viel, sondern richtig — die Invariante darf an keinem Pfad durchrutschen.

**Stationen schließen sich ab, bevor der „Weiter"-Knopf kommt.** `stationErledigt()` setzt `LAUF.node` schon hoch, während der Ergebnisbildschirm noch steht. Sonst könnte man eine Szenenwahl rückgängig machen, indem man auf dem Ergebnis das Spiel beendet. Wer eine neue Stationsart baut, muss sie aufrufen — vergisst man es, hängt das Spiel in einer Schleife (genau das ist beim Bau der Beförderung passiert und wurde vom Testskript gefunden).

**Fassungen.** `CHRONIK_FASSUNG` (1) und `LAUF_FASSUNG` (2, seit den Lebenspunkten) in `src/spielstand.js`. Wer das Format ändert, **erhöht die Zahl und hängt einen Wandler an** — jeder Wandler hebt genau eine Fassung auf die nächste, nie zwei auf einmal. Ein Spielstand aus einer neueren Fassung wird abgewiesen, nicht geraten. Die alte Chronik ohne Fassungsnummer ist Fassung 0 und wird weiterhin gelesen.

**`localStorage` ist nur die bequeme Ablage** (Invariante 6). Die Datei bleibt maßgeblich: `speichern()` schreibt Chronik *und* laufenden Feldzug in eine JSON-Datei, `laden()` liest beides zurück. Wo `localStorage` fehlt — mancher Browser über `file://`, privater Modus —, läuft alles weiter, nur ohne Absturzsicherung; der Titelbildschirm sagt das dann auch.

**Prüfsumme, keine Sicherung gegen Betrug.** Auf dem eigenen Rechner ist das aussichtslos, und weil nur der beste Lauf zählt (Invariante 2), lohnt Schummeln ohnehin nicht. Die Prüfsumme fängt halb geschriebene Dateien und kaputte Cloud-Abgleiche ab. Von der Chronik bleibt eine Generation als `.bak` stehen.

**Was für Steam noch fehlt** — die Reihenfolge ist absichtlich so, dass jeder Schritt für sich nützlich ist:

1. `Ablage` bekommt eine Dateisystem-Rückseite (Electron oder Tauri): schreiben nach `tmp`, dann umbenennen, damit ein Absturz mitten im Schreiben die Chronik nicht kostet.
2. Steam-Auto-Cloud auf den Benutzerordner zeigen lassen — Konfiguration, kein Code, wenn Schritt 1 sauber ist.
3. **Nur die Chronik synchronisieren, nie den laufenden Feldzug.** Ein halber Lauf auf zwei Rechnern ist genau das Schlupfloch, das der Ein-Platz-Entwurf verhindert.
4. Chroniken lassen sich bei einem Cloud-Konflikt *zusammenführen* statt auswählen: Einträge sind unabhängig, `vp` ist das Maximum, `laeufe` die Summe. Das ist ein seltener Luxus und folgt direkt aus Invariante 2.

`node test/spielstand.js` prüft fünfzehn Punkte davon: sichern, unterbrechen, fortsetzen ohne Rücksetzen, Löschen beim Tod, Wandeln von Fassung 0, Abweisen beschädigter und zukünftiger Dateien.

---

## Das Sichtfeld im Gefecht (`sichtfeld()` in `src/kampf.js`)

Das Bild über der Rundenzeile ist eine Aufstellung aus Augenhöhe: unten die eigene Linie in Blau (zwei Glieder, dicht geschlossen), drüben der Feind in Rot (zwei Glieder, kleiner, weil weiter weg), dazwischen Pulverdampf, der mit jeder Runde dichter wird.

**Du stehst immer dort, wo du hingehörst** — und das ist der Sinn der ganzen Zeichnung:

| Lage | Wo die Messingfigur steht |
|---|---|
| Fusilier, Grenadier | im zweiten Glied der Linie |
| Voltigeur | vor der Linie, zwischen fünf locker verteilten Plänklern |
| kniend oder liegend (`K.deckung`) | am selben Platz, aber flach |
| nach gelungenem Bajonettangriff (`K.vorn`) | zehn Schritt vor der Linie |

**Beide Seiten verlieren sichtbar Männer.** Die Zahl der stehenden Figuren folgt `feindMoral` beim Feind und `K.eigen` bei der eigenen Linie; wer fällt, verschwindet nicht, sondern liegt als Strich am Boden. Die Waage unter dem Bild zeigt, wohin es kippt: blau links, rot rechts, ein Strich in der Mitte als Gleichstand.

> **`K.eigen` ist reine Anzeige.** An dieser Zahl hängt keine Probe, keine Gefahr und keine Wertung — sie macht nur sichtbar, was die Texte ohnehin sagen: Drüben wird auch geschossen. Sie sinkt je Runde um 2–5, mal dem verbliebenen Widerstand des Feindes, sodass ein gebrochener Gegner kaum noch Verluste kostet. **Wer daran eine Mechanik hängt, ändert die Balance** und muss neu messen.

**Geschlossene Ordnung durch Versatz.** Je Glied zwanzig Mann (Feind fünfzehn), und die Glieder stehen um eine **halbe Teilung versetzt** — das hintere Glied füllt die Lücken des vorderen, und zusammen ergibt das die dichte Wand, die eine Linie ausmacht. Dazu je Glied ein schwacher Streifen über die volle Breite, damit die Linie nicht am Bildrand aufhört. Der Voltigeur bleibt die Ausnahme: fünf Plänkler, weit auseinander, ohne Ordnung — er steht in keiner Linie.

**Die Kopfbedeckung sagt, wer da steht.** 1796 trägt die Linie den Zweispitz (breit und flach, quer getragen), die Grenadierkompanie die Bärenfellmütze mit rotem Stutz, der Feind den österreichischen Kasket. Die Silhouetten sind absichtlich verschieden — flach und breit, hoch und rund, klein und rund —, weil man auf 640 Pixel Breite nichts anderes unterscheiden kann. Dazu ein geschultertes Gewehr: Ohne das sind es Stäbchen, keine Soldaten.

**Nichts in dieser Funktion darf gewürfelt werden.** Das Bild wird bei jedem Zug neu gezeichnet; ein `Math.random()` darin ließe die Aufstellung bei jedem Klick springen. Deshalb liefert `streu(i, a)` einen festen Wert je Platz — dieselbe Aufstellung, solange sich die Zahlen nicht ändern.

**Rangabzeichen** (`rangabzeichen()` in `grundwerte.js`) zeigen den Rang als Bild statt als Wort: Der Fusilier trägt nichts — das ist der Witz an ihm —, die Elitekompanien eine Epaulette (Grenadier rot, Voltigeur grüngelb), die Unteroffiziere Streifen am Unterarm (Caporal zwei aus Wolle in Aurore, Caporal-fourrier zusätzlich einen quer, Sergent einen aus Tresse in Metallfarbe). Sie stehen in der Seitenleiste und dort, wo man sie bekommt: bei der Elitewahl und bei der Beförderung.

---

## Lesbarkeit

Die Oberfläche ist dunkelbraun, und genau deshalb sind Beschriftungen die Schwachstelle. Die erste Fassung hatte `--faint: #5c554b` auf `#211e1b` — **2,2 : 1**, also unter jeder brauchbaren Schwelle. Attributnamen, Kartenköpfe, Probenzeilen und Kostenhinweise waren kaum zu sehen.

Gültige Werte in `src/stil.css`:

| Rolle | Farbe | Kontrast auf der Karte |
|---|---|---|
| `--text` Fließtext | `#ded5c4` | ~11 : 1 |
| `--dim` Beschriftungen, Tabellen, Seitenleiste | `#aca192` | ~6,6 : 1 |
| `--faint` Probenzeilen, Kosten, Fußzeile | `#948a79` | ~4,7 : 1 |
| `--brass` Abschnittsüberschriften | `#d0a75e` | ~8 : 1 |

**Regeln:** Nichts unter 4,5 : 1. Kleiner als 11 px wird nichts. Abschnittsüberschriften in der Seitenleiste und über dem Lagebild stehen in Messing, nicht in Grau — sie gliedern, also müssen sie sichtbar sein. Zahlen in der Seitenleiste (`.kv b`) sind heller als ihre Beschriftung, weil man im Spiel die Zahl sucht, nicht das Wort.

**Grün ist die Farbe des Zugewinns**, und nur dafür: gekaufte Punkte, gewählte Ausrüstung, gelungene Proben. Rot ist die Farbe der Kosten: Wunden, Atem unter 35, misslungene Proben. Messing gliedert und hebt die Hauptsache hervor (der „Einrücken"-Knopf, Abschnittsüberschriften, der aktuelle Ort im Verlauf). Wer eine vierte Bedeutung einführt, nimmt den dreien ihre.

**Drei Dinge nach jeder Wahl, in dieser Rangfolge:** was passiert ist (Fließtext), ob die Probe gelungen ist (`.pruefung`, ein Feld mit grünem oder rotem Rand), und was sich dadurch geändert hat (`.wirkung`, Messingbalken, fast in Textfarbe). Die dritte Zeile ist die wichtigste und war früher die blasseste.

**Die Probenrechnung wird nicht mehr ausgeschrieben.** Bis dahin stand da `GESCHICK 80 gegen 30 → Zielwert 95 · gewürfelt 52 · GELUNGEN`. Wert und Schwierigkeit stehen schon *vor* der Wahl auf dem Knopf — dort helfen sie beim Entscheiden. Hinterher sind Zielwert und Wurf nur noch Rechenweg, und der gehört nicht ins Spiel. Jetzt: `Geschick — gelungen`. `probe()` liefert `wurf`, `ziel` und `wertRoh` weiterhin zurück, falls man sie zum Prüfen braucht.

Wer die Palette abdunkelt, macht die Hälfte der Oberfläche wieder unlesbar. Der nüchterne Ton entsteht aus den Texten, nicht aus schwachem Kontrast.

---

## Nachtragepflicht

**Wenn du eine Balance-Zahl änderst:**

1. Ändere sie im Code.
2. Trag sie oben unter „Balance-Konstanten" ein — mit der Begründung, *warum*.
3. Schreib eine Zeile in `AENDERUNGEN.md`.
4. Lass `node test/balance.js 40` laufen und trag den neuen Messwert in die Zielwert-Tabelle ein.

Ohne diese vier Schritte ist das Wissen bei der nächsten Sitzung verloren, und irgendwer setzt die Gefahr wieder auf 26.

---

## Was als Nächstes ansteht

1. **Kapitel 2, Ägypten 1798/99** — als eigene Datendatei. Eigener Charakter: Hitze, Krankheit, Karrees gegen Mamluken, Isolation. Krankheit sollte hier gefährlicher sein als Kugeln.
2. **Ausrüstungskauf im Spiel** — bisher gibt es Ausrüstung nur über Veteranenpunkte und Szenen. Geld hat noch zu wenig Verwendung.
3. **Ränge 4 und 5** (Caporal-fourrier mit Bildungsschwelle 35, Sergent) samt der Verwaltungsschicht.
4. **Orden** — Nennung im Tagesbefehl wird schon gezählt, hat aber noch keine Folge.
5. **Übernahme der vollen Punkteskala**, sobald drei Kapitel stehen.
