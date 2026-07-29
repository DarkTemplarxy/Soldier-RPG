# Der Marschallstab — Arbeitsgedächtnis

**Lies diese Datei zuerst.** Sie enthält, was aus dem Gespräch nicht mitkommt: warum die Zahlen so sind, wie sie sind, und welche Regeln nicht gebrochen werden dürfen.

---

## Was das ist

Ein Karriere-Simulator in der Grande Armée, 1796–1815. Man beginnt als analphabetischer Rekrut und steigt — vielleicht — im Rang auf. Vierzehn Ränge, elf Kapitel, harter Permadeath. Vorbild ist *A Legionary's Life*, aber in napoleonischer Zeit und mit einem längeren Aufstieg.

**Der Kern in einem Satz:** Der Rang verändert nicht die Zahlen, sondern das Spiel selbst — als Fusilier steuerst du deinen Körper, als Caporal acht Männer, als General schiebst du Divisionen über eine Karte und liest Meldungen, die vierzig Minuten alt sind.

Sprache des Spiels und des Codes: **Deutsch**. Variablennamen, Kommentare, Texte.

---

## Stand

Gebaut sind **Kapitel 1 (Italien 1796/97)**, **Kapitel 2 (Ägypten 1798/99)**, **Kapitel 3 (Garnison 1801–04)** und **Kapitel 4 (Austerlitz 1805)**, alle vierzehn Ränge, als reine HTML/JS-Anwendung ohne Abhängigkeiten.

| Fertig | Noch nicht |
|---|---|
| Charaktererschaffung mit Pool und sechs Herkünften | Kapitel 3–11 |
| Attribute und Fertigkeiten 0–100 mit Wachstum | Offizierspatente (Phase E) |
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
| Die Kette über dir: vier Vorgesetzte mit Gunst und Mitaufstieg | |
| Ränge 4 und 5 mit zwei Wegen, Sektion und Abrechnung | |
| Napoleonische Gestaltung: Papier, Kokarde, Livret, Gelände | |
| Handbuch als eigene Seite (`wiki.html`), aus dem Spiel verlinkt | |
| Volle Punkteskala aus KONZEPT §5 | Überlebensbonus darin |
| **Kapitel 3 (Garnison 1801–04)**, 17 Stationen | Kapitel 4–11 |
| **Orden**: Ehrenwaffe und Ehrenlegion, VP + Ruf + Pension | weitere Grade, fremde Orden |
| **Marketender**: Ausrüstung für Francs | Pferd, Fernrohr, Patente |
| **Sold** je Rang und Kampagne, im Lager ausgezahlt | Pferd, Offizierssold |
| Vier Garnisonssaisons mit eigenen Handlungen | |
| **Sold** je Rang und Kampagne, im Lager ausgezahlt | Pferd, Offizierssold |
| **Kapitel 4 (Austerlitz 1805)**, 14 Stationen, Feindgüte 6 | Kapitel 5–11 |
| **Rang 6 (Sergent-major)** mit dem Zug als drittem Maßstab | Generalskampagnen als Szenarien |
| **Ränge 7–9**: Muskete weg, Skizze, Säbel, Auftrag, Kompaniekasse | höhere Ordensgrade |
| **Ränge 10–14**: Rechtecke, Operationskarte, Adler, Dotation | freiwilliger Ausstieg an den Schranken |
| **Alle vier sichtbaren Brüche** — Fanion, Skizze, Rechtecke, Karte | |
| **Eiserne Krone** — der erste fremde Orden | zweiter fremder Orden |
| Ehe als Beiwerk · Duell mit Todespfad · Übungsgefecht | |

Das vollständige Design steht in **`KONZEPT.md`** — auch alles, was noch nicht gebaut ist. Wer ein neues System baut, liest dort zuerst nach, ob es schon entworfen wurde.

---

## Starten und prüfen

```bash
# Spielen: index.html im Browser öffnen. Kein Server, kein Build nötig.

npm install playwright && npx playwright install chromium   # einmalig

node test/durchspielen.js         # ein Lauf, meldet Konsolenfehler
node test/offizier.js             # Ränge 7, 8, 9 von Hand gesetzt: Knöpfe, Muskete weg, Skizze
node test/spielstand.js           # sichern, fortsetzen, sterben, alte Fassungen
node test/durchspielen.js dist    # dasselbe mit der gebauten Einzeldatei
node test/balance.js 40           # 40 Läufe, misst die Überlebensquote
node werkzeug/bauen.js            # baut dist/marschallstab.html zum Weitergeben
```

**Nach jeder Änderung am Code `node test/durchspielen.js` laufen lassen.** Nach jeder Änderung an Balance-Zahlen zusätzlich `node test/balance.js 40`, nach jeder Änderung am Zustand `node test/spielstand.js`, nach jeder Änderung an den Offiziersrängen `node test/offizier.js`.

---

## Dateien

```
README.md                       Eingangstür für Fremde
CLAUDE.md                       diese Datei — Arbeitsgedächtnis
KONZEPT.md                      vollständiges Design, auch das Ungebaute
RANGLEITER.md                   die vierzehn Ränge, Schwellen, Brüche, Baureihenfolge
AENDERUNGEN.md                  Protokoll aller Balance-Änderungen
LICENSE / LICENSE-INHALTE       MIT für Code, CC BY-NC-SA für Inhalte
entwurf/                        Konzeptgrafiken, Bildschirmfotos, GITHUB.md
wiki.html                       Handbuch und offene Punkte, eigenständige Seite
index.html                      Gerüst, lädt die Skripte in fester Reihenfolge
src/stil.css                    Gesamte Gestaltung
src/daten/grundwerte.js         Attribute, Fertigkeiten, Ränge, Herkünfte, Kaufladen
src/daten/kapitel01_italien.js  Kapitel 1 als reine Daten
src/daten/kapitel02_aegypten.js Kapitel 2 als reine Daten, hängt sich selbst an
src/daten/kapitel03_garnison.js Kapitel 3 — das Friedenskapitel, Saisons statt Lager
src/daten/kapitel04_austerlitz.js Kapitel 4 — die Ernte von Boulogne, Feindgüte 6
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

**Reihenfolge-Regel für jede Heilung: erst die Wunde entfernen, dann auffüllen.** `lebenMax()` schrumpft mit offenen Wunden, also rechnet ein `lebenAuffuellen()` davor gegen den zu kleinen Vorrat. An drei Stellen lag es falsch — Winterwoche, Lagerabend und das Jahr Garnison; letzteres lieferte einen Mann mit 68 statt 82 Leben nach Ägypten, obwohl „Leben und Atem voll" dastand.

**Der Atem-Deckel ist die Kehrseite:** Mit 25 Leben stehen einem höchstens 25 Atem zu — unter der Warnschwelle 35, nahe am Malus bei 30. Ein Schwerverwundeter kommt also von allein wieder hoch, aber bis dahin kämpft, marschiert und übt er als der, der er gerade ist. `atemKlemmen()` wird nach **jeder** Änderung an Atem oder Leben gerufen — wer eine neue Stelle baut, die daran dreht, ruft sie ebenfalls, sonst leckt der Deckel. Nebenwirkung, die Absicht ist: Auch ein Gesunder mit Konstitution 70 hat höchstens 82 Atem — Konstitution kauft jetzt auch Luft.

- **Der Streifschuss kostet zweierlei, und das ist Absicht:** Blut (bleibt) und eine Wunde, die der Feldscher nach dem Gefecht zunäht (bleibt nicht). Ohne die Wunde stimmte zwar die Todesrechnung, aber ein Mann schoss den ganzen Feldzug wie am ersten Tag — gemessen stieg der Caporal-Anteil auf 57 %, weil bessere Gefechte mehr Ruf bringen und Ruf die Beförderungsschwelle ist. Der Kratzer soll den Rest des Gefechts wehtun, nicht den Rest des Krieges.
- **Eine Wunde aus einer Szene kostet 10 Lebenspunkte**, tötet aber nie unmittelbar (`anwenden()` klemmt bei 1). Der Tod gehört ins Gefecht, wo er einen Text und einen Ort hat; Ruhr und das Fieber aus Jaffa lassen einen bloß so geschwächt hineingehen, dass die nächste Kugel reicht.
- **Die Wundenobergrenze 5 mit Verbluten ist ersatzlos weg.** Sie war der zweite Todespfad und wird von den Lebenspunkten mit erledigt.
- **Wunden schlagen voll auf körperliche Werte** (Konstitution, Geschick, Muskete, Bajonett, Reiten), **nur zu einem Drittel auf geistige**. Vorher zogen sie von *allem* ab — das erzeugte eine Todesspirale: eine Wunde senkte Konstitution, das erhöhte die Todeschance, die nächste Wunde senkte sie weiter.

**Ein Toter durchläuft keinen Stationsabschluss** (`gefallen()` in `src/kampf.js`). Jeder Gefechtstod endet dort und nirgends sonst: Kampfzustand weg, `toetlich()`, Todesbildschirm — mit dem letzten Absatz und den Taten dieses Gefechts.

> **Warum das eine eigene Funktion braucht.** Vorher lief jeder Treffertod über `kampfEnde()`, und das ist der Abschluss einer *bestandenen* Station. Der Gefallene bekam dadurch noch die Niederlagen-Wirkung (Ruf −4 bis −6, was über `5·floor(ruf/10)` echte Veteranenpunkte kostete), der Feldscher nähte ihm eine Wunde zu, `stationErledigt()` heilte ihn um 5 % — er stand mit „Leben 4 von 64" im Chronikblatt —, zählte die **nächste** Station als erreicht (+2 VP, die der Rückzugstod nicht bekam) und schrieb sogar einen Spielstand des Toten, weil `S.lebt` erst eine Anweisung später falsch wurde. Das Chronikblatt trug außerdem das Datum der Folgestation. **Dass der Rückzugstod nichts davon tat, war der Beweis, dass es ein Versehen war.**
>
> Nebenwirkung, die niemand bemerkt hatte: `zeigeTod()` überschrieb den von `kampfEnde()` gebauten Bildschirm sofort — **sämtliche Todestexte der Sondermissionen waren unerreichbar.** „Auf dem Schutt der Rampe bleibst du liegen" hat vor dieser Reparatur nie jemand gelesen.

> **Was der Umbau nebenbei abschafft: den frühen Tod.** Unter dem alten Wurf konnte man bei Montenotte in der zweiten Runde fallen. Jetzt braucht der Tod fünf bis acht Treffer, also mehrere Gefechte — niemand stirbt mehr vor Castiglione. Das ist die Kehrseite der Fairness und muss beim Lesen der Endrang-Zahlen mitgedacht werden (siehe „Zielwerte").

> **Spielstand:** `LAUF_FASSUNG` steht deshalb auf **2**. Der Wandler gibt einem angefangenen Feldzug aus Fassung 1 den vollen Vorrat abzüglich dessen, was seine bleibenden Wunden gekostet haben, mindestens aber 30 %.

### Charaktererschaffung (`src/oberflaeche.js`, `src/daten/grundwerte.js`)

- Sockel **20** auf allen sechs Attributen, Verteilungspool **60** (bis 28.07.2026: 120), Höchstwert bei Erschaffung **70**. Der Schritt ist 10, also muss der Pool durch 10 teilbar sein — sonst lässt er sich nie ganz verteilen und der „Weiter"-Knopf bleibt gesperrt.
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

**Was kein Exploit ist:** dass „Auswürfeln" schlechter verteilt als die Hand — das ist der Sinn des Knopfes. *(Der frühere Eintrag „zwei Attribute auf 70 sind legitime Spezialisierung" ist mit dem Pool von 60 gegenstandslos: Es reicht für genau eines.)*

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

### Die Eskalation: Feindgüte je Kampagne (`guete` in `grundwerte.js`)

**Das Spiel hat elf Kapitel und einen Spieler, der von Lauf zu Lauf stärker wird. Wenn die Gegner gleich bleiben, wird es mit jedem Lauf leichter — statt andere Fragen zu stellen.** `guete` ist die Antwort darauf: **eine Zahl je Kampagne**, die drei Dinge zugleich schaltet (`feindGuete()` in `src/kampf.js`).

| Wirkung | Formel | Warum diese |
|---|---|---|
| Trefferchance | `gefahr += guete` | Bessere Truppen treffen öfter — der einzige Teil, der auch den Vorsichtigen trifft |
| **Die eigene Linie hilft weniger** | `linie = (2 + Zufall·4) · max(0,3; 1 − guete·0,15)` | Der wichtigste Hebel, siehe unten |
| Eigene Verluste | `· (1 + guete·0,15)` | Sichtbar im Sichtfeld und an der Waage: Man *sieht*, dass dieser Feind besser ist |

> **Warum der Linien-Hebel der eigentliche ist.** Die Zeile `feindMoral -= schaden + linie` ist die wichtigste im Kampfsystem — sie ist der Grund, warum ein Gefecht überhaupt gewinnbar ist (ohne sie: 100 % Verluste, siehe unten). Wenn sie mit der Güte schrumpft, entscheidet zunehmend die **eigene Feuerkraft** über die Länge des Gefechts. Und genau die ist es, was Veteranenpunkte kaufen: Ein Erstlauf-Mann mit Muskete 10 braucht gegen Akkon zehn Runden, ein Veteran mit Muskete 60 vier. Treffer kommen je Runde — also stirbt der eine und der andere nicht, **ohne dass eine einzige Schadenszahl unterschiedlich wäre.** Der Boden bei 0,3 hält die späten Kapitel rechnerisch gewinnbar.

| Kampagne | Güte | | Kampagne | Güte |
|---|---|---|---|---|
| Italien 1796/97 | **0** | | Spanien | 8 |
| Ägypten 1798/99 | **5** | | Russland | 10 |
| Garnison | 0 | | Deutschland | 10 |
| Austerlitz | 6 | | Frankreich | 11 |
| Jena–Auerstedt | 7 | | Hundert Tage | 12 |
| Eylau & Friedland | 8 | | | |

**Nur Italien (0) und Ägypten (5) sind gemessen.** Alles ab Austerlitz ist eine entworfene Kurve für Kapitel, die es noch nicht gibt — wer eines baut, misst seine Güte neu, statt der Zahl zu glauben. Der Sinn der Tabelle ist, dass die Eskalation **einmal entworfen** ist und nicht elfmal neu erfunden wird.

**Güte ist die Grundlinie einer Kampagne, `haerte` die Spitze eines einzelnen Gefechts.** Beide addieren sich: Akkon steht bei Gefahr 14 + 3 (Höhepunkt) + 5 (Güte) = **22**.

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

**2 — Krankheit ist die Einlösung von „gefährlicher als Kugeln" (KONZEPT.md).** Sumpffieber (3), Hitzschlag (3), Ruhr (4), Fieber aus Jaffa (4) kosten an *jeder* Station weiter, **und wer krank ist, bekommt die 5 % Zeitheilung nicht** — sonst hebt sich beides auf. Genau das ist zwei Tage lang passiert: Die erste Fassung zog die Zehrung ab und heilte danach trotzdem; bei Konstitution 70 mit Sumpffieber standen +4 Heilung gegen −3 Zehrung, ein Kranker **gewann** also einen Punkt je Station. Der Kommentar „zehrt vorher, sonst hebt sich beides auf" war falsch gerechnet — beides sind Summanden, die Reihenfolge ändert nichts. Auch die Klemme lag falsch (je Wunde einzeln bei 1 statt auf die Summe), was bei zwei Krankheiten die Hälfte verschluckte. **Die Konstitutions-Probe im Lager würfelt mit `probe(k, schw, true)`, also ohne Übungseffekt** — sonst trainierte ausgerechnet der Kranke bei jedem Ruhe-Abend seine Konstitution und damit seinen Lebensvorrat. Sie töten nie selbst (`anwenden()` und `stationErledigt()` klemmen bei 1), aber sie liefern einen Mann mit leerem Vorrat und keiner Luft am nächsten Gefecht ab. **Heilbar nur an zwei Stellen:** Lagerabend „Schlafen" gegen eine Konstitutions-Probe 35, oder eine Winterwoche (die Krankheit rückt dort vor). Der Feldscher kann sie nicht — eine Ruhr näht man nicht zu.

**3 — Wer gesehen wurde, wird geholt.** Der Adjutant sucht keine Unbekannten. Trifft gezielt den Aufsteiger und lässt den Vorsichtigen in Ruhe: Ehrgeiz koppelt sich an Blut, ohne dass jemand gezwungen wird.

**4 — Der Caporal steht außen am Glied**, dort, wo sein Vorgänger stand, und die Stelle wurde frei, weil er fiel. Invariante 5 von der anderen Seite, und Invariante 4 bleibt gewahrt: Der Rang gibt weiter Knöpfe, die Zahl hier ist sein *Preis*, nicht seine Macht.

**5 — Ein bis zwei Höhepunkte je Feldzug.** Es sind dieselben vier, die eine Sondermission tragen — **Lodi, Arcole, Embabeh, Akkon** —, und das ist kein Zufall, sondern der Entwurf: Das Gefecht, für das man berühmt wird, ist das, an dem man stirbt. Montenotte und Alexandria bleiben Lehrgefechte. `haerte` schaltet Schaden *und* Gefahr zusammen, damit ein Feld genügt; angesagt wird es im Lagebild („Das hier wird kein gewöhnliches Gefecht"), überrascht wird niemand. **Die +3 Gefahr sind der einzige der fünf Hebel, der auch den Vorsichtigen trifft** — beschossen wird man, ob man vortritt oder nicht.

### Kapitel 3 — das Friedenskapitel (`kapitel03_garnison.js`)

**Im Krieg ist der Feind die Kugel. Im Frieden ist der Feind die Zeit.** Das ist der ganze Entwurf. Die Maschine bleibt dieselbe — Stationen, Proben, Saisons, am Ende sogar ein Gefecht —, aber der Einsatz ist nicht Blut, sondern Zukunft: Bildung, Geld, Beziehungen, Stand.

> **Warum das Kapitel überhaupt eine Gefahr ist.** Der Motor des Spiels lautet Gefecht → Tote → Vakanz → Aufstieg. Im Frieden fällt er aus, und KONZEPT setzt für die Garnison 98 % Überleben an. Wer es als „Lager, nur länger" baut, bekommt genau die Verwaltung, vor der die Lagerregel warnt. Vier Dinge halten dagegen:

| Hebel | Was es tut |
|---|---|
| **Vier Saisons statt sechzehn Abende** | Dieselbe Knappheit wie im Lager, auf Jahresmaßstab: in jeder Saison mehr zu tun als Wochen |
| **Das Duell** (`duell`) | Die einzige Kette des Kapitels und die einzige Stelle, an der eine **Szene töten darf** |
| **Das große Manöver** (`uebung:true`) | Volles Kampfsystem mit Platzpatronen — dasselbe Spiel, andere Währung |
| **Die Decke hat ein Gesicht** | Über dem Sergenten sitzt Martel, und der geht nicht weg (`keinZiel` in der Boulogne-Musterung) |

**Die Regimentsschule ist das eigentliche Nadelöhr.** Kapitel 3 ist das einzige Fenster, in dem ein Analphabet auf die 35 des Fourriers und in die Nähe der 50 kommt, die Rang 7 später verlangt. Wer die Jahre vertrödelt, sitzt fest — der „Rangstillstand als Druckmittel" aus KONZEPT §9. **Deshalb muss der Testbot die Schule kennen**, sonst misst das Skript wieder seine eigene Blindheit statt der Schwelle (dieselbe Lektion wie damals bei der Gunst).

**Die Ehe ist Beiwerk, kein System** — genau wie KONZEPT §10 es festlegt. Zwei Szenen (Werbung, Erlaubnis des Kompaniechefs), eine Mitgift, und `S.verheiratet` senkt die Belastung um **1 je Station**. Keine Kinder, kein Erbe, keine Folgegeneration.

**Was Kapitel 3 an Code gebraucht hat** — bewusst wenig, alles wiederverwendbar:

| Bau | Wo | Wofür |
|---|---|---|
| Wochenverteilung datengesteuert | `WINTER_TUN`, `winterHandlungen()` | Saisons sehen anders aus als Winterquartiere, ohne Code je Kapitel |
| Ketten in Szenen | `waehleOption()` | das Duell — Semantik identisch zu den Sondermissionen |
| `heilt:` und `setzt:` | `anwenden()` | Lazarett von Marseille · Ehe- und Streit-Merkmale |
| `uebung:true` | `kampfAktion()` | ein Treffer ist ein Unfall, tötet nie |
| `zwischenfall:true` | `naechster()` | Zwischenfälle ohne Marschweg — in einer Garnison marschiert niemand |
| `ab:` in Szenen | `szeneVerwehrt()` | dieselbe Sperr-Regel wie beim Marsch: kein Knopf, sondern ein Satz |

### Kapitel 4 — Austerlitz 1805 (`kapitel04_austerlitz.js`)

**Die Ernte von Boulogne.** Zwei Jahre lang hat diese Armee nichts getan als exerzieren; jetzt marschiert sie 700 km in fünf Wochen, nimmt bei Ulm eine ganze Armee gefangen, ohne zu schießen, und liefert am 2. Dezember die perfekteste Schlacht, die es je gab.

**Für den Spieler heißt das: Alles, was in Nîmes und Boulogne gelernt wurde, wird hier geprüft.** Bildung, Sektionsgüte, die Beziehungen der Kette und der Drill aus vier Saisons sind genau die Werte, die zahlen — das Friedenskapitel bekommt rückwirkend seinen Ernstfall. Und die Leitzahl `überlebt` bekommt ihre Schärfe zurück, weil die Kampagne wieder auf einem gefährlichen Kapitel endet (siehe den Abstand-Befund unten).

| Gefecht | Runden | Feindmoral | Gefahr | Güte | Gelände |
|---|---|---|---|---|---|
| Elchingen | 6 | 52 | 10 | +6 | Brücke |
| Schöngrabern | 7 | 64 | 12 | +6 | Damm |
| **Austerlitz (Höhepunkt)** | 9 | 80 | 13 → 16 | +6 | offen |

**Feindgüte 6** — die erste Eskalationsstufe über Ägypten, und der erste Einsatz der entworfenen Kurve für ein Kapitel, das es vorher nicht gab. **Direkt am Hebel geprüft** (`feindGuete()` je Gefecht ausgelesen), nicht am Ergebnis — die teuerste Lektion des Projekts war das stumme Güte-0-Leck.

**Die Sondermission ist der Pratzeberg:** drei Stufen im Nebel — der Hang (Konstitution 40), die Höhe (Bajonett 45), der Gegenstoß der russischen Garde (Kaltblütigkeit 45). Die letzte Stufe ist nicht der Aufstieg, sondern das **Halten**; der Berg wird zweimal genommen.

**Die Ehe bekommt ihren Nachklang** (KONZEPT §10, „Briefe von zu Hause"): In Wien geht zum ersten Mal seit Boulogne Post nach Frankreich — aber nur für den, der in Nîmes geheiratet hat. Wer nicht, bekommt keinen Knopf, sondern einen Satz.

### Rang 6 — Sergent-major und der Zug

**Die Decke des Prototyps hatte seit Boulogne ein Gesicht.** Dort stand: *„Nichts frei. Auf dem Posten sitzt Martel, zweiundvierzig und gesund."* Jetzt kommt der Feldzug, in dem eine Vakanz entstehen kann.

| Schritt | Was passiert |
|---|---|
| **Vorschlag** | Ruf 75 · Fürsprache **Vernet** ≥ 3 → der Capitaine schlägt dich vor und sagt, es sei keine Stelle frei |
| **Vakanz** | Im nächsten Gefecht **fällt Martel** (`S.martelFaellt` → `martelTot`) |
| **Beförderung** | Bei der Musterung nach Austerlitz bekommst du seine zweite Tresse |

> **Das ist die härteste Vakanz des Spiels.** Bis hierher war jeder, dessen Stelle frei wurde, ein Name am Rand — Guérin, Lascaux. Martel ist der Mann, der einen 1796 über die Pässe gebracht hat und seither in jeder Seitenleiste steht. **Das Spiel spricht es nie aus.** Wer den Vorschlag bekommen hat und zwei Stationen später Martels Nachruf liest, stellt die Rechnung selbst auf.

> **Vernet gibt dem vierten Mann der Kette endlich eine Funktion.** Seine Quellen sind knapp und bleiben es — der Capitaine kennt deinen Namen erst, wenn ihn jemand oft genug genannt hat. Die einzige, die schon einem Sergenten offensteht, ist „dem Capitaine die Berichte schreiben" in der Garnison; **deshalb muss der Bot sie verfolgen.**

**Was der Rang gibt (Invariante 4): den Zug**, 60 Mann in drei Sektionen — bewusst **zwei Knöpfe, nicht vier**:

| Knopf | Probe | Wirkung |
|---|---|---|
| **Feuer nach Sektionen** | Drill 45 | **rollendes Feuer**: drei Runden lang Schaden auch dann, wenn du nichts tust |
| **Die Sergenten einteilen** | Autorität 50 | drei Runden halbe Verluste im ganzen Zug |

> **Rollendes Feuer ist der Kern und die einzige Stelle im Spiel, an der Schaden ohne eigene Handlung entsteht.** Ein Zug in drei Sektionen hört nicht auf zu schießen, nur weil sein Sergent-major gerade woanders hinsieht — das ist der Unterschied zwischen einem Mann, der die Hälfte der Zeit lädt, und einer Einheit. **Der Beitrag zählt nicht für die Sichtbarkeit:** Gezählt wird, was aus dem Stand geschieht, und das hier tut der Zug, nicht du.

**Die Abrechnung skaliert mit** — dieselbe Zahl über sechzig statt zwanzig, Schwellen bei 45 % und 15 % Verlust, und Rechenschaft schuldet man jetzt Vernet statt Berthaud. Das Appell-Bild zeichnet drei Reihen zu zwanzig, mit Lücke: Es sind drei Sektionen, nicht sechzig Einzelne.

### Ränge 7–9 — der Offizier (Phase C der Rangleiter)

**Der zweite sichtbare Bruch** (RANGLEITER §2). Ab Rang 7 verschwinden Laden und Feuern **vollständig** — nicht abgefedert, nicht als Notknopf behalten. Ein „Muskete aufheben"-Knopf würde den Bruch in eine Option verwandeln, und eine Option ist kein Bruch.

| Was weg ist | Was dafür kommt |
|---|---|
| Muskete, Laden, Feuern, Bajonett, Zielen | vier Befehlsknöpfe, alle Proben auf *andere Leute* |
| die Ladeanzeige in der Seitenleiste | Einheitszustand (ab 9) |
| das Sichtfeld mit Männern | die **Handskizze**: eigene Front als Strich, Feind gestrichelt |
| Lagerabende an Muskete und Exerzieren | Fechtboden, Zug antreten, Karten, Adjutantenauftrag, Kompaniekasse |

| Knopf | Probe | Wirkung |
|---|---|---|
| **Den Zug vorführen** | Autorität 45 | voller Schaden, skaliert mit dem Zugbestand · **Gefahr +8** |
| **Das Gelände nutzen** | Taktik 40 | drei Runden **Gefahr −12**, dafür **Schaden −20 %** |
| **Die Front verkürzen** | Drill 45 | Bestand +5 · drei Runden halbe Verluste |
| **Den Degen ziehen** | Kaltblütigkeit 50 | einmal je Gefecht: der Zug fällt nicht unter 30 % · **Gefahr +20** |
| **Den Zug lösen** *(ab 8)* | Taktik 40 | **kein Linienbeitrag mehr** · dafür eigener Schaden ×1,6 |

> **Die neue Ohnmacht ist der Entwurf, nicht ein Nebeneffekt.** Als Fusilier lag zwischen Entscheidung und Wirkung nichts — du hast gezielt und getroffen. Als Sous-Lieutenant gibst du einen Befehl und wartest, ob er ausgeführt wird. **Du bist mächtiger und hilfloser zugleich.** Deshalb hängt jeder Schaden am Zustand der Einheit und nicht mehr an der eigenen Hand: Wer seine Leute im Lager vernachlässigt hat, merkt es hier und kann nichts dagegen tun.

> **Der gelöste Zug ist der schärfste Hebel der ganzen Phase.** Er nimmt die Zeile `feindMoral -= schaden + linie` weg — die wichtigste im Kampfsystem, ohne die alle Gefechte unwinnbar sind (siehe „Warum so niedrig?"). Zum ersten Mal steht der eigene Schaden für sich allein, und der Faktor 1,6 ist die Gegenrechnung. **Wer daran dreht, misst zuerst, ob Gefechte ab Rang 8 überhaupt noch enden.**

**Der Säbel** (`bajonett`, ab Rang 7 nur umbenannt über `wertName()`): Der Wert bleibt, aber **`nutzen('bajonett')` greift ab Rang 7 nicht mehr** — ein Offizier übt nicht mehr täglich. Einzige Quelle ist der Lagerabend **Fechtboden** (`nutzen(k,i,true)`). Nach drei Kapiteln als Offizier ist man schlechter im Nahkampf als man es als Grenadier war: **Du wirst größer und schwächer zugleich.**

**Die Linie bricht** (`K.nahkampf`, `nahkampfPruefen()`): Zwei bis drei Runden fällt der Bildschirm auf das alte Sichtfeld zurück — Männer und Rauch, wie 1796, nur bist du jetzt der, den sie zuerst suchen. **Höchstens einmal je Kapitel** (`S.nahkampfKapitel`), vier Auslöser: Bestand unter 40 %, Reiter im Karree, Bresche, Nachhut. Es ist der einzige Augenblick, in dem der Säbelwert etwas tut — und damit die Einlösung dafür, dass er verkümmert.

**Die Gefahr** (RANGLEITER §8): **+4 für 7–8, +5 ab 9**, statt der +2 der Unteroffiziere. Epauletten, Degen und drei Schritte vor der Front machten einen Offizier auf dreihundert Schritt kenntlich. **Die gefährlichsten Ränge des Spiels sind 7 bis 9, nicht 1** — wer aufsteigt, kauft sich nicht in Sicherheit ein.

**Die Verlustliste** ersetzt ab Rang 7 das Appell-Bild: Namen aus `MANNSCHAFT` statt Zahlen, deterministisch je Gefecht gezogen. Wer bis Rang 6 „vier von zwanzig" gelesen hat, liest jetzt vier Namen. Über zwölf bricht die Liste ab — nicht aus Platzmangel, sondern weil ein Offizier ab einer bestimmten Zahl aufhört, Namen zu schreiben.

**Die zweite Achse: der Auftrag** (`AUFTRAEGE`, ab Rang 9). Jedes Gefecht hat zwei Ziele — Feindmoral wie bisher und einen Auftrag vom Chef de bataillon. **Die Sichtbarkeit hängt am Auftrag, nicht am Sieg:** Wer ihn verfehlt, kommt über Stufe 1 nicht hinaus, auch bei gewonnenem Gefecht. Damit hört „gewinnen" auf, eine eindeutige Sache zu sein. Der Auftrag steht **vor** der ersten Runde auf dem Schirm — ein verstecktes Ziel wäre eine Falle, und Fallen sind nicht das, was dieser Rang verkauft.

**Die Kompaniekasse** (ab Rang 9, je Lager einmal, `S.kasseQuartal`):

| Entscheidung | für dich | Einheitszustand | Inspektionsrisiko |
|---|---|---|---|
| Wie vorgesehen ausgeben | 0 F | +25 | keines |
| Das Übliche abzweigen | +150 F | +10 | +15 % |
| Kräftig zulangen | +400 F | −10 | +40 % |

Bei Entdeckung durch den *Inspecteur aux revues*: **ein Rang zurück, Ruf −20, Vernet −4.** Das Risiko sinkt je Lager um 10, wenn nichts passiert — man kann es aussitzen, aber nicht dauerhaft. **Der Einheitszustand** (`S.einheit`, 0–100, Start 70) zehrt sich je Station um 2 ab; unter 40 steigt die Krankheitsrate, unter 20 verliert jeder Marsch Männer. Das Spiel kommentiert die Wahl nie — es zeigt ein halbes Jahr später einen Satz darüber, wie viele zurückgeblieben sind.

> **Der Stachel steckt woanders als im Geld.** Du hast Veteranenpunkte für deine eigene Muskete ausgegeben und weißt deshalb genau, was gute Ausrüstung wert ist — weil du dafür bezahlt hast. Und jetzt sitzt du auf dem Geld, mit dem hundertzwanzig andere Männer Schuhe bekommen sollen.

**Widerspruch** (Zwischenfall `order`, ab Rang 8): Zum ersten Mal die Möglichkeit, einem Vorgesetzten ins Gesicht zu sagen, dass sein Befehl falsch ist — Taktik 50, Fürsprache sofort weg, Ruf nur, wenn man recht behält. Er steht bewusst als Zwischenfall und nicht in einem Kapitel: **Widerspruch gehört keinem Feldzug, er gehört dem Rang.**

**Der Sold ab Rang 7** springt auf das Dreifache (2,10 F je Station) und erreicht 70,00 beim Marschall — die Vielfachen aus RANGLEITER §8, gerechnet auf den Fusilier-Satz 0,70. Es ist kein Geschenk: Ein Offizier bezahlte Uniform, Degen, Pferd und Verpflegung selbst, ein Capitaine dazu die Repräsentation. Die Ausgabenseite steht bei den Rängen (Kompaniekasse ab 9), nicht in `SOLD`.

**Und die Szene, die nichts kostet und alles sagt** — einmal, beim Patent, ohne Knopf und ohne Wirkung:

> *Martel steht in der Reihe, in der du zehn Jahre gestanden hast. Als du vorbeigehst, salutiert er. Er ist zweiundvierzig, er hat dich im April 1796 über die Pässe gebracht, und er wird nie ein Patent bekommen, weil er nicht lesen kann. Er sagt nichts dazu. Du auch nicht.*

**Geprüft mit `node test/offizier.js`** — setzt den Rang von Hand auf 7 bis 14 und prüft je ein Gefecht: Sind die Pflichtknöpfe des Maßstabs da, ist die Muskete weg, wird das richtige Bild gezeichnet, ist ab Rang 10 die Atemleiste weg und ab Rang 12 der Widerstandswert, gibt es Konsolenfehler? **Ohne diesen Prüfstand wären die Offiziersknöpfe gebaut und ungetestet**, weil `durchspielen.js` sie nicht zuverlässig erreicht — derselbe Fehler wie ein stummer Filter, nur eine Ebene höher.

### Ränge 10–14 — der Stab (Phase D der Rangleiter)

**Der dritte und der vierte sichtbare Bruch.** Beide bestehen im **Weglassen**, und das ist kein Sparen, sondern der Entwurf: Größe zeigt sich daran, was aufhört, dich zu betreffen.

| Bruch | Bei Rang | Was du siehst | **Was du verlierst** |
|---|---|---|---|
| **Dritter** | 10 · Chef de bataillon | vier Rechtecke mit Bestand und Haltung | **die Atemleiste** — ersatzlos, ohne Kommentar |
| **Vierter** | 12 · Général de brigade | eine Operationskarte mit Straßen und Uhrzeiten | **die Gewissheit** — der Feind ist eine Vermutung |

> **Die Atemleiste ist der stärkste der vier Brüche und kostet fast nichts.** Zehn Ränge lang war sie die Zahl, auf die man am häufigsten geschaut hat. Ab Rang 10 ist sie weg, und es steht nirgends, dass sie weg ist. **Ein Hinweis („Ab jetzt zählt dein Atem nicht mehr") würde ihn vollständig zerstören** — man soll es bemerken, nicht gesagt bekommen. Der Wert läuft im Hintergrund weiter; er tut nur nichts mehr.

> **Ab Rang 12 gibt es keinen Widerstandsbalken mehr.** Wo bis dahin eine Feindmoral stand, steht jetzt „*Gemeldete Stärke: im Weichen. Meldung 60 Minuten alt, Verlässlichkeit gering.*" Die Karte zeigt **`gemeldet`, nie `bestand`** — wer hier den wahren Wert einblendet, hat den Rang nicht gebaut, sondern nur eine hübschere Anzeige für denselben. Das ist die Umkehrung des Fusiliers und der Punkt des ganzen Spiels: **Der General sieht mehr und weiß weniger.** Der Fusilier sah vier Männer und Rauch — aber was er sah, war wahr.

**Die Zeit läuft mit dem Rang** (`zeitWort()`): Runden (1–9) → **Phasen** (10–11) → **Stunden** (12) → **Tage** (13–14). Eine Zeile Code, und sie sagt mehr über den Maßstab als jede Erklärung. *(Wer am Testbot arbeitet: Er erkennt das Gefecht daran — `/RUNDE |PHASE |STUNDE |TAG /`, nicht mehr `RUNDE `.)*

#### Rang 10 und 11 — vier Rechtecke und eine Rechnung

| Knopf | Probe | Wirkung |
|---|---|---|
| **Welche Kompanie geht zuerst hinein** | *keine* | die Entscheidung des Rangs — vier Knöpfe, einmal je Gefecht |
| Die Kompanien staffeln | Taktik 45 | die vorderste kommt heraus, ehe sie bricht |
| Den Schwerpunkt verlegen | Taktik 50 | 34–50 Schaden · **die anderen Abschnitte stehen offen** |
| Die Gebrochenen sammeln | Autorität 45 | Haltung +14 im ganzen Bataillon |
| Verstärkung erbitten | Verwaltung 40 | einmal je Gefecht · manchmal kommt sie |
| **Den Adler nach vorn** *(ab 11)* | Autorität 50 | Haltung +20 überall · bei Misserfolg steht er allein im Freien |

> **Die Rechnung hat bewusst keine Probe.** Es gibt keine Fertigkeit, die einem die Frage abnimmt, welche der vier zuerst hineingeht — man wählt, und danach ist es gewählt. **Das Spiel sagt nie, ob es die richtige Wahl war.** Nach dem Gefecht steht in der Verlustmeldung eine Zahl, und die Zahl hat einen Buchstaben: den der Kompanie, die du geschickt hast. Bis Rang 9 hast du entschieden, was *du* tust; ab hier entscheidest du, wer stirbt.

> **Namen gibt es ab Rang 10 nicht mehr.** Die Verlustliste aus Phase C hört auf, und das ist kein Versehen: Ein Chef de bataillon bekommt Summen. Die Namen stehen in vier Listen, die vier andere Männer schreiben.

**Der Schaden hängt am Zustand der Rechtecke, nicht an dir** (`kraft` in `kampfAktion()`). Deine Probe entscheidet, *ob* der Befehl ankommt; wie viel er wert ist, entscheiden vier Kästen, an denen du nichts mehr ändern kannst. Die Haltung sinkt schneller als der Bestand — ein Bataillon hört nicht auf, wenn es Männer verliert, sondern wenn es aufhört zu glauben. Fällt die Haltung der vordersten Kompanie auf null, **geht sie von allein zurück**, und niemand hat es befohlen.

**Der Adler ist ein Zustand mit drei Werten** (`S.adler`: getragen · gerettet · verloren). **Ein verlorener Adler kostet den Rang** — unabhängig von allem anderen, unabhängig davon, wie gut geführt wurde. Ein geretteter ist die einzige Tat im Spiel, die von allein einen Bulletin-Eintrag erzwingt. Damit stellt Rang 11 eine Frage, die keiner der Ränge davor gestellt hat: **Wie viele Männer ist ein Gegenstand wert?** Das Spiel beantwortet sie nicht. Es rechnet nur mit.

#### Rang 12 bis 14 — die Operationskarte

| Knopf | Was er tut |
|---|---|
| **Befehl an einen Verband** | wirkt **nach 1–2 Zeiteinheiten**, gegen die Lage von *dann* |
| Aufklärung anfordern | Kartenkunde 40 · macht Meldungen frischer und den Fehler kleiner, **nie null** |
| Die Reserve einsetzen | Taktik 45 · einmal · danach hast du nichts mehr in der Hand |
| **Warten** | nichts tun — und das ist hier eine Handlung |

> **Kein Knopf wirkt sofort, und das ist der ganze Rang.** Zwischen dem Befehl und seiner Ausführung liegen ein Reiter, drei Kilometer und die Möglichkeit, dass die Lage sich geändert hat: Ob der Befehl passt, entscheidet ein Wurf (55 % + 12 % je Aufklärung). **Aufklärung kauft keine Wahrheit, sondern frischere Meldungen** — mehr kann man nicht kaufen.
>
> Ein Verband, der drei Zeiteinheiten nichts gemeldet hat, **schweigt** — und schweigt weiter. Er ist entweder vernichtet oder unterwegs, und du hast keine Möglichkeit, das herauszufinden.

**Die Gefahr ändert ihre Form** (RANGLEITER §8): Der Zuschlag je Runde fällt auf **null**; du stehst nicht mehr im Feuer. An seiner Stelle steht **ein Stabsereignis je Gefecht mit 8 %** — ein Streuschuss, ein stürzendes Pferd, ein Splitter beim Kartenlesen, 16–32 Leben und eine bleibende Wunde. Selten, ohne Vorwarnung, **und man kann sich nicht hinwerfen.** Ein Bataillonschef ist statistisch sicherer als ein Caporal und stirbt trotzdem, nur eben ohne die Möglichkeit, etwas dagegen zu tun. Das passt zu einem Rang, dessen ganzes Wesen darin besteht, dass man nicht mehr selbst handelt.

**Rang 12 schaltet die Generalskampagnen frei** (`META.generalskampagnen`) — dauerhaft, über alle Läufe, damit nicht 96 % der Spieler die aufwendigste Darstellungsstufe nie sehen. Die Szenarien selbst gibt es noch nicht; die Freischaltung steht trotzdem schon, damit sie nicht später nachgereicht werden muss.

**Rang 13** bringt die **Dotation** (`dotationsErtrag()`, 8 F je Station): das erste Einkommen im Spiel, das nichts mit Sold zu tun hat, und das erste, das einem etwas zu verlieren gibt, das nicht das eigene Leben ist. Historisch war das Absicht — wer ein Gut in Polen hat, will, dass Polen französisch bleibt. Dazu der Zwischenfall **„Er fragt dich etwas"**: der Kaiser als Gegenüber, das Zelt nach elf, und **Schweigen als eine der drei Optionen.** Es ist der einzige Ort im Spiel, an dem Nichtstun eine Handlung ist.

**Rang 14 feiert nichts.** Der Abschlusstext nennt die Namen, die vor deinem stehen — Lannes, bei Aspern gefallen; Bessières, bei Rippach gefallen; Ney, der noch lebt — und stellt fest, dass die Liste nicht länger wird. Der Marschallstab ist ausdrücklich **die Legende, nicht das Ziel**: sechsundzwanzig in zwölf Jahren, unter Hunderttausenden.

**Lieferantenverträge ab Rang 11** ersetzen die Kompaniekasse: dieselbe Struktur, eine Größenordnung darüber (0 F / +600 F, Einheitszustand +30 / −15, Risiko 0 / +35 %), mit demselben Schweigen.

### Der Sold (`SOLD` in `grundwerte.js`, `soldAuszahlen()` in `mechanik.js`)

**Francs waren bis zum 28.07.2026 Zierde.** Es gab sie aus siebenundzwanzig Szenen, und der Marketender nahm sie — aber es gab keine verlässliche Quelle, also war Geld eine Zahl, die man nicht planen konnte.

**Angeschrieben, nicht ausgezahlt.** Der Sold sammelt sich je Station in `S.soldOffen` und kommt erst im Lager oder Winterquartier in die Hand. So war es historisch, und es ist auch das bessere Spiel: Eine Zahl, die bei jeder Station um 0,45 steigt, ist Rauschen; sechs Wochen Sold auf einmal sind ein Moment.

| Rang | F je Station | | Kampagne | Zahlungsmoral |
|---|---|---|---|---|
| Fusilier | 0,70 | | Italien 1796/97 | **0,3** |
| Grenadier/Voltigeur | 0,80 | | Ägypten 1798/99 | **0,5** |
| Caporal | 1,00 | | Garnison 1801–04 | **1,0** |
| Caporal-fourrier | 1,20 | | Austerlitz 1805 | **0,9** |
| Sergent | 1,50 | | | |
| Sergent-major | 2,00 | | | |

> **Geeicht am Marketender, nicht am Geschichtsbuch.** Historisch bekam ein Fusilier fünf Sous am Tag — im Spiel wären das **1,4 Francs für den ganzen Italienfeldzug** gewesen: korrekt und wirkungslos, also weiterhin Zierde. Maßstab ist stattdessen: **Ein Kapitel voller Sold soll ungefähr einen Posten beim Marketender kaufen** (8–18 F).

Gemessen je Kapitel: Italien **3,4 F** (Fusilier) bis **9,6 F** (Sergent-major) · Garnison **11,9** bis **34** · Austerlitz **8,8** bis **25,2**.

> **⚠ Zwei Leitzahlen haben sich um zehn Punkte bewegt — offen und nicht nachgemessen.** Gegen denselben Stand ohne Sold: Erstlauf `höchster Rang` **18 → 28 %** (über dem Band 12–25), Veteran `überlebt` **65 → 55 %** (unter dem Band 60–75). Zehn Punkte sind bei 40 Läufen genau die Grenze, ab der die eigene Regel „Änderung prüfen" sagt, und zugleich noch im Rauschen (±8).
>
> **Der Mechanismus ist verstanden:** Der Bot kauft beim Marketender, sobald er 18 F hat — mit Sold also viel öfter. Jeder Kauf kostet eine **Saisonwoche**, die vorher in Schule, Ruhe oder Drill ging. Für den Erstläufer ist das ein Gewinn (bessere Ausrüstung, wo er vorher keine hatte), für den Veteranen ein Verlust (er hatte schon gute Ausrüstung und verliert Ruhewochen). Das ist ein echter Effekt der Änderung, kein Fehler — aber es ist auch ein **Bot-Artefakt**: Ein Mensch kauft nicht, sobald er kann.
>
> **Zu tun:** Mit 80 Läufen nachmessen und, falls es bleibt, die Kaufregel des Bots verschärfen (nur kaufen, wenn die Ausrüstung wirklich schlecht ist) — nicht die Soldsätze drehen. Die Bänder für vier Kapitel sind ohnehin erst **eine Messung tief**.

> **Die Zahlungsmoral je Kampagne ist der historisch interessanteste Teil.** Die Italienarmee von 1796 war berüchtigt dafür, monatelang nichts zu sehen — barfuß, in Lumpen, siegreich; in Ägypten wurde in einer Münze gezahlt, die keiner kannte; in der Garnison kam der Sold pünktlich, und das war für viele der eigentliche Unterschied zum Krieg. Der Auszahlungstext wechselt mit dem Faktor und erklärt nichts, sondern klingt nur anders.

> **Die eine Stelle, an der ein höherer Rang mehr Zahlen gibt statt neuer Knöpfe — und sie ist trotzdem richtig** (Invariante 4): Sold kauft keine Fähigkeit, sondern Ausrüstung, die man auch wieder verlieren kann, und er bildet ab, was historisch der greifbarste Unterschied zwischen einem Füsilier und einem Unteroffizier war.

### Der Sold (`SOLD` in `grundwerte.js`, `soldAuszahlen()` in `mechanik.js`)

**Francs waren bis zum 28.07.2026 Zierde.** Es gab sie aus siebenundzwanzig Szenen, und der Marketender nahm sie — aber es gab keine verlässliche Quelle, also war Geld eine Zahl, die man nicht planen konnte.

**Angeschrieben, nicht ausgezahlt.** Der Sold sammelt sich je Station in `S.soldOffen` und kommt erst im Lager oder Winterquartier in die Hand. So war es historisch, und es ist auch das bessere Spiel: Eine Zahl, die bei jeder Station um 0,45 steigt, ist Rauschen; sechs Wochen Sold auf einmal sind ein Moment.

| Rang | F je Station | | Kampagne | Zahlungsmoral |
|---|---|---|---|---|
| Fusilier | 0,70 | | Italien 1796/97 | **0,3** |
| Grenadier/Voltigeur | 0,80 | | Ägypten 1798/99 | **0,5** |
| Caporal | 1,00 | | Garnison 1801–04 | **1,0** |
| Caporal-fourrier | 1,20 | | Austerlitz 1805 | **0,9** |
| Sergent | 1,50 | | | |
| Sergent-major | 2,00 | | | |

> **Geeicht am Marketender, nicht am Geschichtsbuch.** Historisch bekam ein Fusilier fünf Sous am Tag — im Spiel wären das **1,4 Francs für den ganzen Italienfeldzug** gewesen: korrekt und wirkungslos, also weiterhin Zierde. Maßstab ist stattdessen: **Ein Kapitel voller Sold soll ungefähr einen Posten beim Marketender kaufen** (8–18 F).

Gemessen je Kapitel: Italien **3,4 F** (Fusilier) bis **9,6 F** (Sergent-major) · Garnison **11,9** bis **34** · Austerlitz **8,8** bis **25,2**.

> **Die Zahlungsmoral je Kampagne ist der historisch interessanteste Teil.** Die Italienarmee von 1796 war berüchtigt dafür, monatelang nichts zu sehen — barfuß, in Lumpen, siegreich; in Ägypten wurde in einer Münze gezahlt, die keiner kannte; in der Garnison kam der Sold pünktlich, und das war für viele der eigentliche Unterschied zum Krieg. Der Auszahlungstext wechselt mit dem Faktor und erklärt nichts, sondern klingt nur anders.

> **Die eine Stelle, an der ein höherer Rang mehr Zahlen gibt statt neuer Knöpfe — und sie ist trotzdem richtig** (Invariante 4): Sold kauft keine Fähigkeit, sondern Ausrüstung, die man auch wieder verlieren kann, und er bildet ab, was historisch der greifbarste Unterschied zwischen einem Füsilier und einem Unteroffizier war.

### Orden und Auszeichnungen (`ORDEN` in `grundwerte.js`)

**Nennungen im Tagesbefehl waren bis dahin eine Zahl ohne Folge.** Orden sind die Folge, und sie zahlen in drei Währungen zugleich, damit sie sich nicht wie Deko anfühlen:

| Orden | Bedingung | VP | Ruf | Pension |
|---|---|---|---|---|
| **Ehrenwaffe** (Fusil d'honneur) | 3 Nennungen, 1799–1803 | 10 | +6 | 0,5 F je Station |
| **Ehrensäbel** (Sabre d'honneur) | **eine Sondermission voll bestanden** und 5 Nennungen, 1799–1803 | 14 | +8 | 1 F je Station |
| **Ehrenlegion** | eine Ehrenwaffe oder ein Ehrensäbel — *oder* 5 Nennungen und Ruf 45, ab 1804 | 12 | +10 | 1 F je Station |
| **Eiserne Krone** *(fremd)* | eine Meldung an den Oberbefehl, ab 1805 | 10 | +6 | 0,5 F je Station |

**Die Eiserne Krone ist der erste fremde Orden.** Gestiftet Juni 1805 vom Königreich Italien, dessen König Napoleon selbst war, und nach Austerlitz an Franzosen vergeben. KONZEPT §5 hält den Platz frei — „je fremdem Orden +10, höchstens zwei gewertet"; die zweite Stelle bleibt für Spanien oder Preußen offen.

**Der Ehrensäbel verlangt die Kette voll, nicht die Mehrheit** — jede Stufe gelungen. Er ist die einzige Auszeichnung, die an einer einzelnen, benannten Tat hängt statt an einer Summe: Wer durch die Bresche von Akkon gegangen ist, ohne einmal zu straucheln, bekommt nicht dasselbe wie einer, der dreimal aufgefallen ist.

> **Historisch trägt sich der Bogen selbst.** Die *armes d'honneur* wurden 1799–1802 an einfache Soldaten für einzelne Taten vergeben — genau die Jahre von Ägypten. Wer eine besaß, wurde bei der Stiftung der Ehrenlegion **von Rechts wegen aufgenommen**, ohne weitere Prüfung; die erste große Verleihung war das Lager von Boulogne am 16. August 1804. **Das ist die einzige Auszeichnung im Spiel, die man sich in einem Kapitel verdient und in einem anderen einlöst.**

### Die Leiter der Sichtbarkeit (`K.zaehlung` in `src/kampf.js`)

**Die Nennung im Tagesbefehl war ein Würfelwurf am Gefechtsende.** Jetzt ist sie die mittlere von drei Stufen, und alle drei werden verdient:

| Stufe | Heißt | Bedingung | Wirkung |
|---|---|---|---|
| 1 | **Lob vor der Front** | Schaden ≥ 60 *oder* ein Ereignis | Kameradschaft +4 · **kein Ruf** |
| 2 | **Nennung im Tagesbefehl** | Schaden ≥ 100 **und** überwiegend ungedeckt · *oder* zwei Ereignisse | +1 Nennung |
| 3 | **Bulletin der Großen Armee** (ab 1805; vorher „dem Oberbefehl gemeldet") | Schaden ≥ 150 *oder* Sondermission voll bestanden *oder* Ereignis vor der Linie im Höhepunktgefecht | **+2 Nennungen** · Ruf +4 |

Gezählt wird der **Schaden an der Feindmoral**, nicht Tote — niemand zählt 1796 im Rauch Gefallene, aber jeder sieht, wessen Abschnitt wankt. Der Beitrag der Linie zählt nicht mit; das ist nicht deine Tat. **Nur die höchste Stufe je Gefecht**, sonst wäre es Grinding.

> **Die Sichtbarkeitsregel ist der Zahn des Systems:** *Gezählt wird nur, was aus dem Stand geschieht.* Wer kniet oder liegt, dessen Serie reißt und dessen Schaden zählt **halb**. Historisch exakt — im Rauch sieht niemand, wer gut zielt; gesehen wird, wer steht. Mechanisch ist es die Bremse, ohne die alles kaputt wäre: **Man kann keine Auszeichnung aus der Deckung heraus erschießen.** Auszeichnungsjagd und Überleben ziehen an entgegengesetzten Enden desselben Seils — dieselbe Achse wie bei den Gefechts-Ereignissen.

> **Warum Stufe 1 keinen Ruf gibt.** Die teuerste gelernte Regel des Projekts: Alles, was den Ruf hebt, hebt über die Schwellen auch den Aufstieg. Ruf +2 je gutem Gefecht wären über einen Lauf rund +30, und die Sergent-Quote ginge durch die Decke. Bronze zahlt in Kameradschaft und in die Zählung — Belobigungen (`S.belobigungen`) sind die Währung für spätere Ordensbedingungen.

**Am Gefechtsende steht die Bilanz** (`tatenBilanz()`) mit Zahlen und, wenn es knapp war, der verfehlten Schwelle: „Eigener Anteil: 84. Für den Tagesbefehl hätte es 100 gebraucht — und man muss dabei stehen." Ein Auszeichnungssystem mit unsichtbaren Schwellen fühlt sich wie Zufall an; dieselbe Überlegung wie bei den Proben, die Wert und Schwierigkeit schon auf dem Knopf zeigen.

**Gemessen (je 40 Läufe, gegen denselben Stand ohne das System):** überlebt 55 → **57 / 25 → 30 / 70 → 70 %**, Sergent 23 → **25 / 25 → 28 / 78 → 70 %**. Alles im Rauschen; der Sergent beim Veteranen ist dabei von 78 zurück ins Band gerutscht. **Der Punkte-Median des Erstlaufs steigt deutlich (61 → 93)** — die Orden zahlen, und sie zahlen dem, der noch wenig hat, mehr als dem Veteranen (194).

**Geprüft, nicht gewürfelt** (`ordenFaellig()`). Ein Orden ist die einzige Belohnung, bei der man hinterher genau sagen können soll, wofür — Zufall würde das kaputtmachen. Die Pension ist historisch der eigentliche Wert: Die Ehrenlegion war eine Rente, kein Blech, und seit es einen Marketender gibt, ist Geld auch im Spiel etwas wert.

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

### Wertung: die volle Skala (`wertung()` in `src/abschluss.js`)

```
Rangwert + 8×überlebte Kapitel + 5×(Ruf/10) + 3×Nennungen + 25 (lebend) + 20 (nie gekniffen)
```

**Seit dem 28.07.2026 rechnet die ganze Wertung in der vollen Skala aus KONZEPT §5** (Maximum 918). Rangwerte 0 / 12 / 26 / 42 / 62 — die standen dort schon immer, auch die 42 und die 62.

> **Warum die Umstellung nötig war — und warum nicht.** Solange die Ränge 4 und 5 unerreichbar waren, fiel nicht auf, dass `rangWert()` die volle Skala benutzt, während die Zuschläge die des Prototyps benutzten. Seit sie erreichbar sind, **rechneten Rang und Zuschläge in zwei verschiedenen Skalen** — das ist der Grund, und er steht für sich. Dazu kommt die inhaltliche Hälfte: **Ein halber Feldzug ist kein Feldzug**, also zahlt man je Kapitel und nicht je Bildschirm.
>
> **Nicht der Grund war die Ladensumme.** Der Spitzenwert von 273 gegen einen Laden von 196 war der *Anlass*, an dem die Sache auffiel, nicht die Rechtfertigung — siehe den nächsten Absatz.

**Ein Kapitel statt einer Station.** Die Prototypskala zahlte 2 VP je erreichter Station und belohnte damit den, der auf Station 30 von 32 fiel, fast wie den, der ankam. Die volle Skala zahlt **je überlebtem Kapitel** (`kapitelUeberlebt()`): Ein Feldzug ist ein Feldzug, und ein halber ist keiner. Das ist der Grund, warum der Punkte-Median so deutlich fällt — ein abgebrochener Lauf ist jetzt sichtbar weniger wert als ein vollendeter, und das war der Sinn.

**Der Überlebensbonus steht auf 25 und ist ein Platzhalter.** Die volle Skala sieht gestaffelte 70/120/180 vor, aber die ergeben erst Sinn, wenn es den **freiwilligen Ausstieg an den Rangschranken** gibt — dann ist die Höhe des Bonus die Belohnung dafür, rechtzeitig aufzuhören. Ohne diese Entscheidung wäre er nur eine große Zahl für jeden, der nicht stirbt. **Wer den Ausstieg baut, ersetzt hier die 25.**

**Was noch fehlt:** Ehrenlegion (+12 je Grad) und fremde Orden (+10, höchstens zwei) — beides hängt an den Orden, die es nicht gibt.

| Gemessen, je 40 Läufe | Prototypskala | volle Skala |
|---|---|---|
| Punkte-Median Erstlauf | 109 | **64** |
| Punkte-Median Veteran 160 | 218 | **192** |
| Höchster gemessener Lauf | 273 | **223** |

Kaufladen kostet 12–40 VP je Posten, alles zusammen 196; ein Spitzenlauf bringt 223.

> **Die Ladensumme ist im Prototyp kein Maßstab, und die alte Faustregel ist ausgesetzt** *(Entscheidung des Entwicklers, 28.07.2026)*. „Das Durchkommen darf nie mehr als etwa die Hälfte der Ladensumme wert sein" hat einen Laden vorausgesetzt, der ungefähr fertig ist. Der ist er nicht: Es fehlen **neun Kapitel und der ganze Ausrüstungsteil ab Rang 7** — Pferd, Fernrohr, Uhr, Schreibzeug, Offizierspatente. KONZEPT §5 rechnet für die volle Wunschliste mit **1.010 VP** bei einem Punktemaximum von 918; die 196 von heute sind ein Achtel davon.
>
> **Dass man den Laden theoretisch leerkaufen kann, ist deshalb vorerst in Ordnung.** Die Antwort darauf ist, Posten hinzuzufügen — nicht, die Wertung kleinzurechnen. Wer die nächste Zahl an dieser Regel ausrichtet, optimiert gegen einen Zwischenstand.
>
> **Wieder scharf wird die Regel**, sobald der Laden ungefähr vollständig ist (Ausrüstung ab Rang 7, Patente, Pferd). Bis dahin sind die beiden Leitzahlen der Maßstab, nicht das Verhältnis von Spitzenlauf zu Ladensumme.

> **Historisch:** Die Stationspunkte wurden zweimal gesenkt (4 → 3 → 2), jedes Mal nach der Regel „Das Durchkommen darf nie mehr als etwa die Hälfte der Ladensumme wert sein". Mit dem Wechsel auf Kapitelpunkte ist die Frage gegenstandslos — und die Regel selbst ist für die Prototypphase ausgesetzt, siehe oben.

> Diese Wertung gilt nur für den Prototyp mit zwei Kapiteln. Die Skala des vollen Spiels (Maximum 918, Rangwerte bis 580) steht in KONZEPT.md und wird übernommen, sobald mehrere Kapitel existieren.

### Veteranenpunkte in Ausbildung (`src/oberflaeche.js`, `PRO_PUNKT` in `grundwerte.js`)

Die Erschaffung läuft in **zwei Schritten**, und die Reihenfolge ist der ganze Witz:

1. **Wer bist du** — Name, Herkunft, die 60 Poolpunkte auf die Attribute.
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

> **Seit dem Pool von 60 ist der Kauf kein Beiwerk mehr, sondern der halbe Charakter.** Vorher gewann der Testbot alles, ohne einen einzigen Punkt zu kaufen — der ganze Laden war Zierde. Jetzt trennt er 43 % von 68 % Überlebenden und 45 % von 88 % Caporals. Wer an `PRO_PUNKT` oder am Pool dreht, verschiebt damit unmittelbar, wie viele Läufe die Leiter hat.
>
> **Warum die Staffelung als Bremse reicht.** Ein Spitzenlauf bringt etwa 160 VP. Weil vom Istwert gerechnet wird, kostet das Nachschärfen einer Stärke am meisten — die 160 Punkte reichen für Breite oder für eine einzige Spitze, nie für beides. Dazu kommt die zweite, schon eingebaute Bremse aus `nutzen()`: Hohe Startwerte wachsen langsamer, weil das Wachstum vom Abstand zu 100 abhängt.

**Der frühere Entwurf rechnete vom Sockel** (Attribute 20, Fertigkeiten 10) und stand *vor* der Erschaffung. Das war vorhersagbar, aber blind: Man kaufte Punkte, ohne zu wissen, was Herkunft und Pool daraus machen, und der Kaufbildschirm lag unter der Ausrüstungstabelle, wo ihn niemand fand.

**Invariante 3 bleibt gewahrt:** Gekauft wird der Ausgangspunkt, nie der Aufstieg. Rang, Ruf, Gunst und Nennungen sind unkäuflich.

### Zielwerte

**Achtung: Der Testbot misst seit dem 28.07.2026 etwas anderes als vorher.** Er würfelt seine Attribute nicht mehr aus, sondern verteilt sie bewusst, ruht, wenn er verwundet ist, und befiehlt als Caporal die Salve. Gemessen wird damit, wie hart das Spiel für einen **kundigen** Spieler ist — vorher, wie hart es für einen blinden war. Alle Zahlen vor diesem Datum sind mit den neuen nicht vergleichbar.

**`balance.js` misst seit den Gefechts-Ereignissen zwei Gemüter**, weil das Spiel zwei Antworten hat. `node test/balance.js 40` ist der vorsichtige Bot: Er tritt nur vor, wo seine Werte es klar tragen. `MUT=1 node test/balance.js 40` tritt immer vor, außer es steht um sein Leben. **Der Abstand zwischen beiden Zahlen ist die Balance der Ereignisse.**

### Die zwei Leitzahlen und ihre Sollwerte *(neu gesetzt am 28.07.2026)*

**Gemessen wird an zwei Zahlen, und nur an ihnen:**

| | Was sie misst |
|---|---|
| **überlebt** | Wie viele alle gebauten Kapitel hinter sich gebracht haben — *wie hart das Spiel ist.* |
| **höchster Rang** | Wie viele den höchsten gebauten Rang bekommen haben — *ob die Leiter trägt.* |

> **„Höchster Rang" ist eine Definition, kein fester Rang.** Mit Kapitel 4 ist es der **Sergent-major (6)**, vorher der Sergent (5). Die Zahl wandert mit dem Ausbaustand mit — genau deshalb veraltet sie nicht, anders als der frühere Caporal-Sollwert. *(Umbenannt am 28.07.2026 mit dem Bau von Rang 6.)*

**Bänder für vier Kapitel** *(neu gesetzt am 28.07.2026)*:

| Sollwert | Erstlauf vorsichtig | Erstlauf mutig | Veteran 160 |
|---|---|---|---|
| **überlebt** | **30–45 %** | **8–20 %** | **60–75 %** |
| **höchster Rang** | **12–25 %** | **3–15 %** | **45–60 %** |

Gemessen nach Phase D: überlebt **43 / 19 / 70 %**, höchster Rang **23 / 16 / 55 %**. Alle sechs im Band (der mutige „höchster Rang" einen Punkt darüber, also im Rauschen). *(Nach Phase C: 45 / 10 / 60 % und 20 / 10 / 53 %. Mit Kapitel 4, vor den Rangleiter-Phasen: 35 / 8 / 65 % und 18 / 3 / 55 %.)*

> **Der mutige Erstlauf ist mit 80 Läufen gemessen, die übrigen mit 40 — und das war kein Luxus.** Die erste 40er-Messung nach Phase D lieferte **25 % überlebt**, fünf Punkte über dem Band. Es gab keinen mechanischen Grund dafür: Alles, was Phase D geändert hat, greift ab Rang 10, und **kein einziger der 200 gemessenen Läufe hat Rang 10 erreicht.** Mit 80 Läufen steht der Wert bei 19 %. Die eigene Regel „bei Zweifeln 80 Läufe" hat damit zum ersten Mal nachweisbar eine Fehldeutung verhindert.

> **⚠ Die Leitzahl „höchster Rang" ist strenggenommen von 6 auf 8 gewandert — und wird trotzdem weiter gegen 6 gedruckt.** Sie meint den höchsten mit dem gebauten Inhalt *erreichbaren* Rang, und nach Phase C erreichen **28 % der Veteranenläufe mit 260 VP ein Patent** (Rang 7 oder 8), mit 160 VP noch 13 %, und selbst ein Erstlauf ohne Vorrat hat es einmal geschafft. Möglich machen das die Sprungeinträge der Leiter zusammen mit der Regimentsschule.
>
> **Nicht umgestellt wird trotzdem**, aus zwei Gründen: Die Bänder sind gegen Rang 6 geeicht, und elf Läufe sind keine Stichprobe, auf die man eine Leitzahl setzt. **Wer Phase E misst, entscheidet das neu** — dann ist die Offiziershälfte über die Patente ohnehin regulär zugänglich.

> ### ✓ Eingelöst mit Kapitel 4: Der Abstand ist zurück auf 30 Punkte
>
> **Die Vorhersage hat gehalten.** Der Befund unten sagte: „Die Leitzahl `überlebt` misst nur so scharf, wie das letzte gebaute Kapitel gefährlich ist — mit Kapitel 4 endet die Kampagne wieder auf einem gefährlichen Kapitel, und der Abstand öffnet sich von allein."
>
> Gemessen: **35 → 65 %, also 30 Punkte** (vorher 15). Die selbstgesetzte Grenze von 25 ist wieder überschritten, **ohne dass an einer einzigen Balance-Zahl gedreht wurde.** Der Abstand beim höchsten Rang liegt bei 37 Punkten (18 → 55).
>
> **Was daraus als Regel bleibt:** Wer den Ausbaustand auf einem ruhigen Kapitel enden lässt, muss damit rechnen, dass `überlebt` stumpf wird — dann ist `höchster Rang` die aussagekräftigere der beiden. Der Fall ist eingetreten und wieder vergangen; die Regel gilt weiter.

> ### Der Befund von Kapitel 3, der dazu führte *(historisch)*
>
> **Die eigene Regel schlägt an:** „Schrumpft einer der beiden Abstände unter 25 Punkte, trägt die Leiter nicht mehr." Beim Sergenten stehen 55 Punkte (23 → 78), beim Überleben nur noch **15** (55 → 70). Vorher waren es 30.
>
> **Die Ursache ist verstanden und folgt aus dem Entwurf, nicht aus einem Fehler.** Kapitel 3 ist ein Friedenskapitel und tötet fast niemanden — KONZEPT setzt dafür 98 % an. Es *heilt* aber: Der `uebergang` am Ende von Ägypten gibt vollen Vorrat, das Lazarett von Marseille nimmt die Krankheiten, vier Saisons geben Ruhe. **Davon hat der angeschlagene Erstläufer mehr als der gesunde Veteran** — der Schwache holt auf, weil dem Starken nichts mehr zu geben ist. Deshalb steigt die untere Zahl (43 → 55 %) und die obere nicht.
>
> **Das Band bleibt vorerst stehen, und die Zahl wird nicht schöngerechnet.** Zwei Gründe: Erstens ist die Kompression eine Eigenschaft des *letzten* Kapitels, nicht des Spiels — mit Kapitel 4 (Austerlitz, Feindgüte 6) endet die Kampagne wieder auf einem gefährlichen Kapitel, und der Abstand öffnet sich von allein. Zweitens wäre die Alternative, ein Friedenskapitel künstlich tödlich zu machen, und das widerspricht seinem ganzen Zweck.
>
> **Was daraus als Regel folgt:** Die Leitzahl `überlebt` misst nur so scharf, wie das **letzte gebaute Kapitel** gefährlich ist. Endet der Ausbaustand auf einem ruhigen Kapitel, ist sie stumpf — dann ist `Sergent erreicht` die aussagekräftigere der beiden. **Wer nach Kapitel 4 misst, prüft zuerst, ob der Abstand wieder über 25 liegt.**

> **Warum diese beiden und nicht die alten.** „Italien überstanden" hatte das Band 45–55 % und liefert seit den Lebenspunkten 95–100 %: Italien ist das Lehrstück und *soll* fast jeden durchlassen — die Zahl misst nichts mehr. Der Caporal-Anteil war mit 30 % gegen ein Todesmodell geeicht, in dem ein Viertel der Männer die Beförderung nie erlebte; heute ist der Caporal der *unterste* erreichbare Aufstieg und sagt über den Stand des Spiels nichts. **Beide sind als Sollwert ersatzlos gestrichen** und werden nur noch zur Einordnung mitgedruckt.
>
> **Der Abstand ist die eigentliche Zahl.** Zwischen Erstlauf und Veteran liegen 30 Punkte beim Überleben und 52 beim Sergenten. **Schrumpft einer davon unter 25 Punkte, trägt die Leiter nicht mehr** — dann kaufen Veteranenpunkte keinen spürbaren Unterschied, und das ist der Kern des Spiels. Wächst er über 60, ist der Erstlauf zu hart.
>
> **Mut kostet, Mut steigt auf.** Der mutige Erstläufer überlebt halb so oft (20 gegen 43 %) und erreicht den Sergenten trotzdem etwas öfter (20 gegen 18 %). Dieser Kreuzungspunkt ist die Achse, um die die Ereignisse gebaut sind — **wer daran dreht, erhält ihn.**
>
> **Beide Bänder sind zwei Kapitel tief und vorläufig.** Sie sind an einem Spiel geeicht, das mit dem Sergenten endet. **Mit Kapitel 3 werden sie neu gesetzt** — zusammen mit den Rangschranken, für die derselbe Vorbehalt gilt.

**Seit dem Pool von 60 werden drei Männer gemessen, nicht mehr einer** — der Bot kauft nichts, also *ist* er ohne `VP=` genau der Erstlauf-Spieler. Alle Zahlen je 40 Läufe:

| Größe | Erstlauf vorsichtig | Erstlauf mutig | Veteran 160 VP | Veteran 260 VP |
|---|---|---|---|---|
| **überlebt** *(Leitzahl)* | **43 %** | **19 %** | **70 %** | 75 % |
| **höchster Rang: Sergent-major** *(Leitzahl)* | **23 %** | **16 %** | **55 %** | 70 % |
| Sergent erreicht | 48 % | 38 % | 78 % | 90 % |
| Gestorben | 23 von 40 | **65 von 80** | 12 von 40 | 10 von 40 |
| Italien überstanden *(Lehrstück)* | 100 % | 98 % | 98 % | 98 % |
| Elitekompanie erreicht | 45 % | 51 % | 85 % | 100 % |
| Caporal erreicht | 53 % | 48 % | 88 % | 100 % |
| Caporal-fourrier erreicht | 48 % | 38 % | 78 % | 90 % |
| **Patent erreicht (Rang 7 oder 8)** | **5 %** | **4 %** | **20 %** | **20 %** |
| **Stab erreicht (Rang 10+)** | **0 %** | **0 %** | **0 %** | **0 %** |
| Punkte, Median | 117 | 82 | 337 | 347 |

*(Vier Kapitel, Rangleiter bis Phase D, Stand 29.07.2026. Der mutige Lauf über 80 Läufe, die übrigen über 40. „überlebt" heißt: alle vier hinter sich gebracht.)*

> **Die letzte Zeile ist eine Null, und sie ist der wichtigste Messwert dieser Phase.** Phase D hat die Ränge 10 bis 14 vollständig gebaut — zwei neue Gefechtsbilder, zwei verschwundene Anzeigen, ein anderes Zeitmaß —, und **kein einziger von 200 Läufen hat sie gesehen.** Bei Rang 8 ist Schluss, weil Rang 9 die Ehrenlegion und Ruf 150 verlangt.
>
> **Geprüft ist Phase D deshalb ausschließlich über `test/offizier.js`**: dass die Knöpfe da sind, dass die Muskete weg ist, dass die Atemleiste ab 10 und der Widerstandswert ab 12 verschwinden, dass nichts in die Konsole fällt. **Wie hart die Stabsränge sind, ist ungemessen** und bleibt es, bis Phase E die Patente bringt. Das ist kein Mangel dieser Phase, sondern genau die Lücke, die Phase E schließen soll.

> **Die letzte Zeile ist die neue.** Sie misst, was Phase C überhaupt erst sichtbar macht: Wie oft sieht ein Lauf die Offiziershälfte? Die Antwort — 3 % im Erstlauf, 28 % beim reichen Veteranen — ist zugleich die Rechtfertigung für Phase E: Ohne die Patente bleibt der zweite Bruch für die meisten Spieler eine Zahl in der Rangtabelle.

> **Das ist die Kurve, um die es geht.** Italien ist das Lehrstück und lässt fast jeden durch; **Ägypten tötet den ersten Mann** — vorsichtig sehen 43 % das Ende, wer aufsteigen will, nur 20 %. Mit dem Vorrat eines guten ersten Laufs (160 VP) steigt es auf 73 %, und der Sergent wird von einer Ausnahme (18 %) zum Regelfall (70 %).
>
> **Der Veteran mit 260 VP überlebt nicht besser als der mit 160** (68 gegen 73 %, im Rauschen), **erreicht den Sergenten aber deutlich öfter** (80 gegen 70 %). Das ist kein Fehler, sondern die Staffelung aus `PRO_PUNKT`: Die ersten 160 Punkte kaufen Konstitution und Muskete — Überleben. Die nächsten 100 kaufen nur noch das Nachschärfen einer Spitze, und die zahlt sich in Ruf aus, nicht in Blut. **Veteranenpunkte haben eine Sättigungsgrenze beim Überleben und keine beim Aufstieg** — genau so war die Kostenkurve gedacht.
>
> **Gegner, gegen die man am Anfang chancenlos ist, sind später zu schlagen — nicht weil sie schwächer wurden, sondern weil man schneller lädt.** Genau das war die Vorgabe, und es steht in keiner einzigen Sonderregel: Es fällt aus Pool 60 + Feindgüte 5 + zollpflichtigem Rückzug von allein heraus.
>
> **Wer daran dreht, misst vier Zahlen** — Erstlauf vorsichtig, Erstlauf mutig, Veteran 160, Veteran 260. Der Abstand zwischen der ersten und der dritten *ist* die Progression.

> **Die Achse trägt, und zwar deutlich:** Mut kostet neunmal so viele Männer wie Vorsicht (9 Tote gegen 1), und der mutige Lauf holt trotzdem die Spitzenwertung (240 gegen 227). Wer an den Ereignissen oder den fünf Hebeln dreht, muss diesen Abstand erhalten — **vorsichtig überlebt, mutig steigt auf und stirbt öfter.**

> **Erreicht, nicht überlebt.** Gezählt wird seit dem 28.07.2026 der höchste Rang, den ein Mann je getragen hat, auch wenn er zwei Stationen später fällt. Vorher zählte das Skript den Rang *am Ende* — und das maß nach den Lebenspunkten vor allem, wann gestorben wird: Weil kaum noch jemand vor der Beförderungsstation stirbt, stieg die Endrang-Zahl auf 58 %, ohne dass die Beförderung leichter geworden wäre. Die neue Zahl misst die Schwelle selbst.

> ### Wo die Härte jetzt steht (überholt seit Pool 60 — siehe die Tabelle oben)
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
| + Höhepunkte auch +3 Gefahr · vorsichtig / mutig | 40 / 40 | 98 / 93 % | 83 / 85 % | 199 / 192 |
| Pool 120 → 60, Feindgüte gebaut (**wirkungslos, siehe Fehler unten**) · v / m | 40 / 40 | 100 / 100 % | 43 / 57 % | 139 / 157 |
| **Güte wirksam (gültig) · Erstlauf vorsichtig** | **40** | **95 %** | **45 %** | **106** |
| **dieselbe Fassung · Erstlauf mutig** | **40** | **100 %** | **45 %** | **115** |
| **dieselbe Fassung · Veteran 160 VP** | **40** | **100 %** | **88 %** | **185** |
| dieselbe Fassung · Veteran 260 VP | 40 | 100 % | 100 % | 188 |
| + Fehlerbereinigung (Todespfad, Krankheit, Heilreihenfolge) · Erstlauf v / m | 40 / 40 | 100 / 98 % | 50 / 45 % | 121 / 109 |
| dieselbe Fassung · Veteran 160 / 260 | 40 / 40 | 100 / 95 % | 90 / 98 % | 186 / 188 |
| Kette + Leiter, erste Schwellen (**Fourrier/Sergent 0 %, Henne-Ei**) · V160 | 40 | 100 % | 90 % | 187 |
| Gunst-Quellen verteilt, Schwellen Ruf 25/40 · V160 / V260 | 40 / 40 | 100 / 100 % | 88 / 100 % | 197 / 229 |
| **Schwellen Ruf 35/52/62 (gültig) · Erstlauf v / m** | **40 / 40** | **98 / 90 %** | **48 / 48 %** | **106 / 112** |
| **dieselbe Fassung · Veteran 160 / 260** | **40 / 40** | **100 / 95 %** | **88 / 95 %** | **207 / 226** |
| **volle Punkteskala (gültig) · Erstlauf v / m** | **40 / 40** | **100 / 95 %** | **38 / 55 %** | **64 / 61** |
| **dieselbe Fassung · Veteran 160 / 260** | **40 / 40** | **100 / 100 %** | **93 / 100 %** | **192 / 186** |
| **Kapitel 3 gebaut · Erstlauf v / m** | 40 / 40 | 98 / 88 % | 35 / 53 % | 61 / 60 |
| Leiter der Sichtbarkeit · Erstlauf v / m | 40 / 40 | 100 / 98 % | 45 / 53 % | 93 / 87 |
| dieselbe Fassung · Veteran 160 / 260 | 40 / 40 | 100 / 100 % | 98 / 95 % | 203 / 211 |
| Kapitel 4 + Rang 6 · Erstlauf v / m | 40 / 40 | 98 / 100 % | 45 / 45 % | 82 / 72 |
| dieselbe Fassung · Veteran 160 / 260 | 40 / 40 | 100 / 100 % | 95 / 100 % | 249 / 267 |
| Rangleiter Phase A (Fundament) · Erstlauf vorsichtig | 40 | — | 50 % überlebt · 28 % höchster Rang | 82 |
| Rangleiter Phase B (alle 14 vergebbar) · Erstlauf vorsichtig | 40 | — | 40 % überlebt · 23 % höchster Rang | — |
| Rangleiter Phase C (der Offizier) · Erstlauf v / m | 40 / 40 | 100 / 98 % | 48 / 48 % | 85 / 55 |
| dieselbe Fassung · Veteran 160 / 260 | 40 / 40 | 98 / 98 % | 88 / 95 % | 284 / 342 |
| **Rangleiter Phase D (der Stab, gültig) · Erstlauf v / m** | **40 / 80** | **100 / 98 %** | **53 / 48 %** | **117 / 82** |
| **dieselbe Fassung · Veteran 160 / 260** | **40 / 40** | **98 / 98 %** | **88 / 100 %** | **337 / 347** |

*(Die Spalte „überstanden" zeigt Italien; die Ägypten-Quote steht in der Zielwert-Tabelle oben.)*

> **Ein Fehler, der drei Messreihen wertlos gemacht hat, und wie er sich zeigte.** `kapitel01_italien.js` meldete seine Stationen mit `STATIONEN.italien = KAPITEL` an — **ohne Kopie**. Kapitel 2 hängt seine Stationen mit `KAPITEL.push(...)` an dasselbe Array, also wuchs `STATIONEN.italien` stillschweigend auf alle 32 Stationen mit. `feindGuete()` geht die Kampagnen der Reihe nach durch, fand für *jedes* Gefecht zuerst Italien und lieferte immer **0**. Zwei Runden Ägypten-Balance wurden gegen ein System gemessen, das nicht lief.
>
> Aufgefallen ist es erst, als ich aufgehört habe zu argumentieren, warum die Zahlen sich nicht bewegen, und stattdessen **den Mechanismus selbst ausgelesen habe** (`feindGuete(n)` je Gefecht in einer Tabelle). Regel daraus: **Wenn eine Änderung dreimal nichts bewegt, ist die Vermutung „das Modell ist falsch" wahrscheinlicher als „der Hebel ist zu schwach" — dann misst man den Hebel, nicht das Ergebnis.**
>
> Derselbe Fehler zeigte im Verlauf links ägyptische Stationen unter Italien. **Wer ein Kapitel anhängt, kopiert** (`KAPITEL.slice()`).

**Der Testbot kauft nichts.** Alle Zahlen gelten für einen Lauf ohne Veteranenpunkte. Wer Ausrüstung oder Ausbildung kauft, spielt leichter — das ist der Sinn der Punkte und keine Verzerrung der Messung.

**Seit den Lebenspunkten streut das Skript stärker.** Derselbe unveränderte Stand lieferte bei 60/80/80 Läufen 48 %, 64 % und 51 % — sechzehn Punkte Spannweite, wo die Faustregel elf erwarten ließe. Zusammengefasst über alle 220 Läufe: 55 %. Grund ist die Bauart des Modells: Der Tod ist jetzt eine Schwelle (Summe des Schadens gegen den Vorrat) statt eines Wurfs je Treffer, und wie nah ein Lauf an dieser Schwelle landet, hängt fast ganz an der ausgewürfelten Konstitution. **Einzelmessungen unter 80 Läufen sind damit noch weniger aussagekräftig als vorher; wer eine Zahl braucht, fasst mehrere Durchgänge zusammen.**

Der Streubereich bei 40 Läufen ist etwa ±8 Punkte — ein einzelner Durchgang von 43 % oder 57 % sagt für sich genommen nichts. **Bei Zweifeln 80 Läufe messen**, wie hier geschehen.

**Offener Punkt seit den Lebenspunkten: Der Caporal-Anteil steht bei 58 %, fast doppelt so hoch wie der Sollwert von 30 %.** Die Ursache ist verstanden und folgt unmittelbar aus dem Umbau: **Die Endrang-Zahl zählt den Rang beim Tod mit, und der Tod kommt jetzt später.** Unter dem alten Wurf starb ein guter Teil der Männer vor der Beförderungsstation und ging als Fusilier in die Statistik; unter den Lebenspunkten braucht der Tod fünf bis acht Treffer, also stirbt niemand mehr vor Castiglione — wer fällt, ist meist schon Caporal. Der Sollwert von 30 % war gegen ein Modell geeicht, in dem ein Viertel der Männer die Beförderung nie erlebte, und ist mit dem neuen nicht unmittelbar vergleichbar. Zwei Hebel, falls er trotzdem gesenkt werden soll: die Schwelle (`CAPORAL_RUF` / `CAPORAL_GUNST`) oder der Ruf-Zuschlag `RUHM_JE_GEFECHT`. **Beides ist ungemessen** — wer daran dreht, misst beide Zahlen neu.

**Älterer offener Punkt (Stand vor den Lebenspunkten):** Der Caporal-Anteil stand mit 34 % vier Punkte über dem Sollwert von 30 % — gerade noch innerhalb der Zehn-Punkte-Regel, aber am oberen Rand. Der Weg dorthin ist mittelbar und war beabsichtigt: Der zusätzliche Lagerabend ab Caporal lässt mehr Beförderte den Feldzug überleben, und gezählt wird der Rang am Ende. Wer das senken will, hat zwei Hebel — die Caporal-Schwelle (`CAPORAL_RUF` / `CAPORAL_GUNST`) oder den Abend selbst. **Nicht empfohlen ist der Abend:** Er ist der Grund, warum der Rang sich nicht wie eine Strafe anfühlt.

> **Historisch, nicht mehr gültig:** Der folgende Absatz stammt aus der Messreihe vor den Lebenspunkten und widerspricht der Tabelle oben. Er bleibt stehen, weil die Begründung zur Elitegrenze weiterhin stimmt.
>
> *Die Überlebensquote liegt mit 43 % zwei Punkte unter dem Band 45–55 %. Der Anteil ohne jede Beförderung ist mit 58 % weit über dem Sollwert von 40 %, und nur 8 % erreichen die Elitekompanie; der Engpass bleibt die Schwelle von 55 in Konstitution beziehungsweise Geschick, an der die meisten schon bei der Erschaffung scheitern. Wer daran etwas ändern will, senkt diese 55.*

**Gelernte Regel aus dieser Sitzung:** Alles, was die Kampfkraft hebt, hebt über den Ruf auch den Caporal-Anteil. Wer an Atem, Wunden oder Gefahr dreht, misst beide Zahlen — nicht nur die Überlebensquote. Und: **Ein einziger Erholungspunkt an der richtigen Stelle schlägt eine Erholung an jeder Station.**

`node test/balance.js 40` misst das. **Weicht der Wert nach einer Änderung um mehr als zehn Punkte ab, ist die Änderung zu prüfen.**

**Zwei Fallen beim Messen, beide teuer bezahlt:**

1. **Der Punkte-Median ist bei ~50 % Überlebensquote unbrauchbar.** Ein überstandener Lauf bekommt +25 und +10 pauschal; der Median springt deshalb um rund dreißig Punkte, sobald die Quote die 50 % kreuzt. Gemessen: 91 bei 43 % Überleben, 59 bei 36 % — dieselbe Mechanik, nur die andere Seite der Schwelle. **Der Median misst hier nicht die Härte, sondern nur, ob der mittlere Lauf zufällig überlebt hat.** Wer eine Änderung beurteilen will, nimmt die Quote.
2. **Das Rauschen ist größer, als es sich anfühlt.** Derselbe unveränderte Stand lieferte an einem Nachmittag 49 % und 43 %. Bei 80 Läufen ist eine Standardabweichung rund 5,6 Punkte, zwei also elf. **Wer einen Unterschied von unter zehn Punkten deutet, deutet Rauschen** — dagegen hilft nur, den alten Stand noch einmal zu messen (`git stash`) statt gegen eine Zahl von gestern zu vergleichen.

**Was der Testbot tut.** Er spielt so gut, wie es ohne Vorauswissen geht — das ist seit dem 28.07.2026 der Zweck des Skripts:

| Wo | Was |
|---|---|
| Elitewahl | Voltigeur vor Grenadier (zielen bringt 22–32 statt 12–20) |
| Gefecht | Lücke einmal je Gefecht · hinknien bei wenig Blut oder Luft · als Caporal immer die Salve · sonst feuern · nachladen. Kein Bajonett. |
| Lager | ruhen unter 60 % Leben · Fürsprache, solange Gunst < 4 · Muskete ölen · Schuster · scharf schießen · exerzieren |
| Winterquartier | ruhen unter 80 % Leben oder bei einer Wunde · sonst Fürsprache, Ausrüstung, Drill |
| **Gefecht ab Rang 7** | Säbel, wenn die Linie bricht · Gelände lesen, solange der Vorteil aus ist · Front verkürzen unter 70 % Zug · Degen unter 45 % · sonst **immer** der Feuerbefehl. **Den gelösten Zug drückt er nie** — der ist ein Handel, kein Handgriff, und ein Bot, der ihn immer nimmt, misst nicht, ob er sich lohnt. |
| **Lager ab Rang 7** | Kasse ehrlich ausgeben · Adjutantenauftrag, solange Vernet < 4 · Fechtboden, Zug, Karten |
| Szenen | der Knopf mit dem größten Abstand zwischen Wert und Schwierigkeit; riskante mit Abschlag, bei wenig Blut gar nicht |
| Gefechts-Ereignisse | dieselbe Rechnung. **`MUT=1` sucht das Risiko** statt es zu meiden — außer es steht um sein Leben. |
| Erschaffung | Konstitution 60, Geschick 40 — die ganzen 60 Poolpunkte. Herkunft reihum durch alle sechs. |
| Veteranenpunkte | **ohne `VP=` kauft er nichts** und ist damit genau der Erstlauf-Spieler. `VP=160` setzt einen festen Vorrat und gibt ihn nach fester Rangfolge aus (Konstitution 70 → Geschick 70 → Muskete 60 → Kaltblütigkeit 60 → …). Der Vorrat wird bei **jedem** Lauf neu gesetzt, auch auf 0 — sonst ließe die Chronik im localStorage ihn anwachsen und die Messung wanderte. |

**Warum die feste Verteilung wichtiger ist, als sie aussieht.** „Auswürfeln" maß vor allem den Zufallsgenerator: Weil der Tod seit den Lebenspunkten eine Schwelle ist und der Vorrat an der Konstitution hängt, entschied der Wurf über den Lauf, bevor er begann — derselbe Stand lieferte 48 %, 64 % und 51 %. Mit fester Verteilung ist die Streuung weg, und 40 Läufe sagen mehr als vorher 80.

**Regel, die daraus folgt:** Wer eine Schwelle einführt, die mehrere Handlungen verlangt, muss dem Bot beibringen, sie zu verfolgen — sonst misst das Skript die Blindheit des Bots und nicht das Spiel. Das galt für die Gunst und gilt für jede weitere Schwelle.

**Seit Phase C druckt `balance.js` eine Rangverteilung** — wie viele Läufe auf welchem Rang enden (RANGLEITER §10 verlangt sie nach jeder Phase). Die beiden Leitzahlen sagen, ob das Spiel hart genug ist und ob die Leiter trägt; sie sagen nicht, **wo** sie trägt. Mit vierzehn Rängen und vier Kapiteln ist genau das die Frage: Sammelt sich alles bei Rang 6, oder sieht überhaupt jemand ein Patent?

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

**Der Riegel gegen die schlimmste Datenvernichtung des Spiels** (`CHRONIK_GESPERRT`). Schlägt das Laden fehl, obwohl eine Datei da war — kaputte Prüfsumme, Fassung aus der Zukunft —, wird **nichts mehr geschrieben**, bis der Spieler ausdrücklich verwirft. Ohne den Riegel überschrieb das erste `chronikSichern()` (und das läuft an *jeder* Station) die gute Datei mit der leeren Neuchronik, das zweite auch noch die `.bak`-Generation: **nach zwei Stationen waren alle Veteranenpunkte weg**, und der sorgfältige Schutz in `wandle()` („aus der Zukunft: lieber nichts als Trümmer") war für nichts. Der Titelbildschirm sagt es und bietet „Alte Chronik verwerfen" an.

**`dateiEinlesen` führt zusammen, statt zu ersetzen:** `vp` per `Math.max`, `laeufe` ebenso. Vorher senkte das Einspielen einer alten Datei den Vorrat — ein Verstoß gegen Invariante 2 in der Funktion, die ihn am wenigsten erwarten lässt.

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

## Pergament: die Gestalt seit dem 28.07.2026 (`src/stil.css`)

**Die Leitmetapher ist der Feldtisch.** Alles, was man sieht, sind Papiere auf dem Tisch eines Capitaine — das Livret, die Meldungen, die Schlachtskizze, das Wertungsblatt. Der Grund dahinter ist dunkles Holz (`--holz`) und nur an den Rändern sichtbar, damit die Bögen als Bögen lesbar sind.

> **Warum das die frühere Nacht abgelöst hat, und was dabei zu retten war.** Die alte Begründung lautete: „Das Dunkel ist die Nacht im Feldlager, und Papier ist den amtlichen Momenten vorbehalten" — der Wechsel dunkel → hell machte den Beförderungsbescheid von allein feierlich. **Wird alles hell, stirbt dieser Effekt.** Er ist deshalb nicht verloren gegangen, sondern ersetzt worden: Der Alltag steht auf **Feldpapier** (`.card` — gebräunt, gekörnt, fleckig), das Amtliche auf **Kanzleipapier** (`.papier` — heller, glatter, mit Doppellinie, Vordruckkopf und **Lacksiegel**). Aus „dunkel → hell" wurde **„Feldpapier → Kanzleipapier"**.

**Die Textur ist prozedural, keine einzige Bilddatei.** Zwei `feTurbulence`-Filter als data-URI im CSS: feines Faserkorn (`--korn`, 150 px) und große Vergilbungswolken (`--wolken`, 480 px), dazu eine Vignette. Das hält `file://`, die Einzeldatei-Weitergabe und die Ladezeit intakt — dieselbe Regel wie beim Sichtfeld und den Rangabzeichen.

> **Zwei Fallen dabei, beide bezahlt:** `feTurbulence` rauscht in **Farbe** — ohne `feColorMatrix saturate 0` liegen grüne und rosa Flecken auf dem Papier. Und `feFuncA intercept` ist die *Deckkraft*: Ein hoher Wert macht die Lage dunkler, nicht heller. Erst `slope 0.16 / intercept 0.04` (Korn) und `0.09 / 0.02` (Wolken) sahen nach Papier aus statt nach Schmutz.

### Das Sichtfeld ist ein Kupferstich (`STICH` in `src/kampf.js`)

**Gefechtsdarstellungen der Epoche *sind* Stiche und lavierte Skizzen.** Das Sichtfeld ist deshalb kein Fenster in eine dunkle Welt mehr, sondern die **Schlachtskizze auf dem Feldtisch**: Sepia-Gelände auf Papierton, eigene Linie in Uniformblau `#27415f`, Feind in Siegellackrot `#9c3125`, du selbst in Bronze. Pulverdampf ist eine graue Lavierung — auf hellem Grund funktioniert das sogar besser als heller Nebel auf dunklem.

**Voraussetzung war ein Schritt, der für sich nichts sichtbar machte:** Die vierundvierzig Festfarben der Zeichenfunktionen liegen jetzt in **einer Tabelle `STICH`**, und **die Namen sind Rollen, keine Farben** — `WASSER` bleibt `WASSER`, ob es nachtschwarz oder als Lavierung gezeichnet wird. Vorher hieß ein Farbwechsel vierundvierzig Einzelfunde; genau daran scheitert jeder Umbau der Gestaltung. Der Umbau wurde **pixelgleich gegengeprüft**, bevor eine einzige Farbe wechselte.

**Die alte Regel gilt unverändert: In `sichtfeld()` wird nichts gewürfelt.**

### Kontraste, neu gerechnet

Alle Werte gegen das Feldpapier `#e9dfc6`; die Schwelle 4,5 : 1 gilt weiter.

| Rolle | Farbe | Kontrast |
|---|---|---|
| `--text` Fließtext | `#2a2420` | 11,4 : 1 |
| `--dim` Beschriftungen | `#584c3c` | 6,2 : 1 |
| `--faint` Probenzeilen | `#6d5f4b` | 4,8 : 1 |
| `--blood` Kosten (Siegellack) | `#8f2a1e` | ~6,0 : 1 |
| `--green` Zugewinn (Jägergrün) | `#3e5a2c` | ~5,4 : 1 |
| `--brass` Gliederung (Bronze) | `#6e5320` | ~5,3 : 1 |

**Die Bedeutungsregel ist unverändert:** Grün ist Zugewinn, Rot ist Kosten, Bronze gliedert. Nur die Töne wechseln — auf hellem Grund muss Farbe *dunkel* sein, sonst verschwindet sie. **Gold wird zu Bronze**, sonst ist es unsichtbar.

**Eine Ausnahme, und nur eine:** Der Seitenkopf liegt auf dem Holz, nicht auf einem Bogen. Dort ist die Tinte hell (`#e4d7ba`, 11,9 : 1 gegen `--holz`) — Eisengallustinte wäre dort unlesbar. Wer eine neue Fläche außerhalb der Bögen baut, rechnet gegen `--holz`.

**`wiki.html` trägt dieselbe Palette.** Das Handbuch ist vom Titelbildschirm verlinkt und darf nicht aus einer anderen Welt kommen; wer die Farben im Spiel ändert, ändert sie dort mit.

## Das Bild der Epoche (`src/stil.css`, `sichtfeld()` in `src/kampf.js`)

Die Oberfläche soll nach 1796 aussehen, nicht nach „dunkles UI". Vier Mittel, alle ohne Abhängigkeit und `file://`-tauglich:

**1. Didone-Schriftstack** (`--didone`) für Überschriften, Kartenköpfe und Tabellenspalten — hohe Strichkontraste und senkrechte Achse sind die französische Buchform um 1800. **Nur Systemschriften, kein Download**: Wo keine Didot-Verwandte liegt, fällt es auf Georgia zurück, und das ist kein Verlust. Der Haupttitel steht in **Kapitälchen** statt in Versalien — um 1800 wurde gesperrt gesetzt, nicht geschrien. Fließtext bekommt Mediävalziffern (`oldstyle-nums`).

**2. Papier für alles, was ein Schriftstück *ist*** (`.papier`). Nicht die ganze Oberfläche wird hell — das Dunkel ist die Nacht im Feldlager. Aber Chronikblatt, Wertung, Beförderungsbescheid und Todesblatt bekommen gebrochenes Papierweiß, Eisengallustinte, eine Doppellinie als Rahmen (`::before`) und einen **Vordruckkopf** („République Française · 32. Demi-brigade de bataille · Datum"). Der Wechsel dunkel → hell macht diese Augenblicke von allein amtlich.

> **Kontrast geprüft:** Tinte `#2a2420` auf Papier `#e6dcc2` = 11,4 : 1, blasse Tinte `#584c3c` = 6,2 : 1. Beide über der 4,5er-Schwelle. **Wer die Papierfarbe abdunkelt, rechnet beide nach.**

**3. Kokarde und Adler** (`emblem()`). 1796 ist Republik: Die Trikolore-Kokarde sitzt im Kopf der Seite, der Adler kommt erst 1804 — `kaiserreich()` liest die Jahreszahl aus dem Stationsdatum und schaltet um. Das UI erzählt den Epochenwechsel selbst. *(Aus demselben Grund heißt das Gefechts-Ereignis jetzt „Der Fahnenträger fällt": Die Halbbrigaden von 1796 trugen Fahnen, keine Adler.)*

**4. Die Seitenleiste ist das Livret militaire** — das Heftchen, das jeder Soldat trug.

### Das Gefechtsbild nach Rang

**Der Rang bestimmt, was hell ist.** Das ist die Regel, aus der alles Übrige folgt:

| Rang | Was man sieht |
|---|---|
| Fusilier, Grenadier | die Linie, du im zweiten Glied — unverändert |
| Voltigeur | vor der Linie, fünf Plänkler, keine Ordnung |
| **Caporal** | deine acht heller als der Rest, ein **Fanion** darüber („DEINE KORPORALSCHAFT") |
| **Sergent** | du stehst **hinter** dem Glied (dort stand der serre-file), davor deine zwanzig als eigener Block; die übrige Linie fällt ins Dunkel. Der Fanion zählt mit: „DEINE SEKTION · 14 VON 20" |

**`K.sektion` wird als stehende Männer gezeichnet, nicht als Balken.** Von zwanzig stehen vierzehn heißt: sechs liegen, und sie liegen vor dir. Sinkt die Sektion unter 70 %, tritt ein **Wankender** sichtbar einen halben Schritt aus dem Glied — der Knopf „Den Wankenden herausziehen" zeigt dann auf etwas, das man sieht. Nach dem Gefecht steht die Abrechnung als **Appell-Bild** (`appellBild()`): zwanzig Silhouetten, die Gefallenen liegend.

### Gelände und Formation

`gelaende` und `formation` in den Kapiteldaten legen eine Silhouette hinter die Linien — man erkennt das Gefecht am Bild, bevor man den Namen liest:

| Feld | Gefechte | Was man sieht |
|---|---|---|
| `bruecke` | Lodi | Geländer, Pfeiler, der Fluss als dunkles Band |
| `damm` | Arcole | schmaler Streifen, Wasser beidseits, Schilf |
| `mauer` | Akkon, Alexandria | Zinnenmauer mit **Bresche** — der Feind steht *oben* |
| `wueste` | Embabeh, Abukir | Palmen, Pyramidenkegel am Horizont |
| `formation:'karree'` | Embabeh | eigene Aufstellung als **Viereck von innen**, der Feind sind **Reiter**, die außen vorbeiziehen |

Dazu **Mündungsblitze** nach einer Salve und ein Schleier, der ab Runde 5 das hintere Feindglied verdeckt — die Unsicherheit, von der die Texte reden, wird sichtbar.

> **Die alte Regel gilt weiter und ist jetzt wichtiger denn je: In `sichtfeld()` wird nichts gewürfelt.** Das Bild wird bei jedem Zug neu gezeichnet; ein `Math.random()` darin ließe Gelände, Blitze und Aufstellung bei jedem Klick springen. Blitze hängen an `K.blitz` (gesetzt in `kampfAktion`), Streuung an `streu(i,a)`.

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

## Die Kette über dir und die Leiter (`LEUTE` in `grundwerte.js`, `LEITER` in `kampf.js`)

**Gunst ist keine Zahl mehr, sondern eine Beziehung je Person** (−5…+5, wie KONZEPT §8 es immer vorsah). Vier Männer, die ganze Laufbahn lang dieselben:

| Person | Posten | steigt auf zu |
|---|---|---|
| **Martel** | Sergent | Sergent-major |
| **Collot** | Fourier | Sergent-fourrier |
| **Berthaud** | Lieutenant | Capitaine |
| **Vernet** | Capitaine | Chef de bataillon |

**Die Kette rückt mit.** Wer über dir steht, bleibt über dir, weil er selbst aufsteigt — man lernt in einer Karriere vier Gesichter kennen, nicht vierzehn. Ein neues Gesicht gibt es nur, wenn eines fällt: In Höhepunktgefechten stirbt mit 22 % einer aus der Kette, der Nachfolger tritt an der nächsten Station an und **fängt bei Gunst 0 an**. Genau deshalb pflegt man zwei Beziehungen, nicht eine.

**Die Leiter** prüft drei Dinge gleichzeitig — Ruf, einen **Fürsprecher mit Gesicht** und eine Vakanz:

| Rang | Ruf | Fürsprecher | dazu | Vakanz entsteht durch |
|---|---|---|---|---|
| 3 · Caporal | 30 | Martel ≥ 4 | — | Guérins Tod |
| 4 · Caporal-fourrier | 35 | Collot ≥ 3 | **Bildung ≥ 35** | Collot rückt selbst auf |
| 5 · Sergent *(Feldweg)* | 62 | Berthaud ≥ 5 | — | der Sergent-major fällt |
| 5 · Sergent *(Listenweg)* | 52 | Berthaud ≥ 4 | ab Rang 4 | dieselbe |

> **Der Fourrier ist ein Seitenweg, kein Pflichtglied** — überspringen kostet keine Wertung (gezählt wird der höchste Rang, nicht die Summe der Stufen). `leiterZiel()` bietet **den höchsten Eintrag an, den man tatsächlich erfüllt**; wer den Ruf für den Feldweg hat, steht direkt vor der Sergent-Stelle, wem er fehlt, dem bietet dieselbe Musterung die Listen an. Niemand muss wählen — man merkt am Angebot, welchen Weg man ohnehin geht.

> **Der Lieutenant schlägt dich vor — und das ist jetzt ein Bildschirm.** Stimmen Ruf und Fürsprache, hält Berthaud dich nach dem Appell auf und sagt, er habe deinen Namen weitergegeben; und dass zurzeit keine Stelle frei sei, die Kompanie habe ihre Sergenten, und alle drei seien gesund. **Was daraus folgt, wird nicht ausgesprochen.** Das ist Invariante 5, gezeigt statt erklärt.
>
> Vorher setzte `vakanzPruefen()` nur stumm ein Flag: Der Spieler erfuhr nie, dass sein Name nach oben gegangen war, und die Beförderung zwei Stationen später kam aus dem Nichts. **Der Vorschlag ist aber das eigentliche Ereignis** — er ist das, was ein Mann sich verdient; die Vakanz ist nur, was danach passieren muss. Drei Schläge statt einem: Vorschlag → Vakanz → Beförderung.

> **Die Vakanz wird angesagt, nicht geschenkt.** Sobald Ruf und Fürsprache für den Sergenten stimmen, setzt `vakanzPruefen()` ein Flag — und der Sergent-major fällt **im nächsten Gefecht**, nicht auf dem Bildschirm, auf dem die Zahlen stimmen. Danach rückt Martel auf seinen Posten, und Martels alte Stelle ist die, die du bekommst. Invariante 5 bleibt intakt, sie wandert nur eine Stufe: Am Anfang der Kette steht weiterhin ein Toter. Wäre der Tod sofort, drehte sich die Welt sichtbar um den Spieler.

> **Warum Berthauds Fürsprache aus dem Gefecht kommt, und warum das richtig ist.** Der Lieutenant ist der Zugführer — er sieht, was seine Leute im Gefecht tun, und er ist der Mann, der jemanden für den Sergenten vorschlägt. Genau das tut `anerkennung()`: **+1 einmal je Gefecht, aber nur bei einer aktiven, gelungenen Tat** — ein Treffer, der saß, Stehenbleiben unter Beschuss, ein Bajonettangriff, eine Salve, die Linie geschlossen halten, einen Wankenden herausziehen.
>
> **Sie ist damit nicht geschenkt, sondern verdient.** Gemessen: Wer sich ein ganzes Gefecht lang duckt, bekommt **0**; wer feuert und steht, bekommt **+1**. Die Kette ist von vorn bis hinten stimmig — im Gefecht schreibt er den Namen auf (sichtbar in „Was gesehen wurde"), bei der Musterung heißt es entweder „Er geht die Liste durch. Bei dir hält er nicht an." oder „Berthaud nennt deinen Namen."
>
> *(Ein Vorschlag, diese Quelle zu deckeln, wurde am 28.07.2026 geprüft und **verworfen**: Er hätte eine funktionierende Fiktion durch eine Zahlenschranke ersetzt. Dass Ruf und Berthauds Fürsprache beide die Leistung im Gefecht messen, ist keine Dopplung, sondern Verstärkung — die *unterscheidende* Bedingung des Sergenten ist die Vakanz.)*

> **Ein Henne-Ei-Fehler, gemessen gefunden.** Die erste Fassung erreichte in 120 Läufen **0 % Fourrier und 0 % Sergent**. Grund: Alle bestehenden Gunst-Quellen liefen ohne `gunstVon` und damit an Martel; Collot und Berthaud bekamen Fürsprache nur aus Handlungen, die es erst *ab* Rang 4 gibt. Behoben durch zweierlei — die Szenen und Zwischenfälle wurden nach Inhalt zugeordnet (der Fourier-Szenen an Collot, die Offiziers-Szenen an Berthaud), und **`anerkennung()` gibt einmal je Gefecht Berthaud +1**: Der Lieutenant führt die Liste der Namen. Das ist die einzige Quelle seiner Fürsprache, die schon einem Füsilier offensteht, und sie muss es sein.

### Die Sektion des Sergenten (`K.sektion`)

Ab Rang 5 wechseln die Kampfknöpfe vollständig — der Maßstabswechsel aus KONZEPT §3, nicht größere Zahlen, ein anderes Spiel:

| Knopf | Probe | Wirkung |
|---|---|---|
| Salve auf Kommando | Autorität 45 | 34–48 Schaden, **skaliert mit der Sektionsstärke** · Muskete bleibt geladen |
| Die Glieder wechseln | Drill 40 | drei Runden halbe Verluste |
| Den Wankenden herausziehen | Menschenkenntnis 40 | Sektion +6, Kameradschaft +4 · **+10 Gefahr, du stehst dabei im Freien** |
| Schließen und halten | Drill 40 | Gefahr −6, Sektion +4, Ruf beim ersten Mal |

**Die Abrechnung ist der eigentliche Rangunterschied.** Nach jedem Gefecht wird gezählt: Von zwanzig unter neun Verlusten gibt Fürsprache, ab neun kostet sie. Zum ersten Mal kann man ein Gefecht gewinnen und trotzdem verlieren — „Wer barfuß marschiert, ist dein Versäumnis" (KONZEPT). Im Lager kommen „Rekruten aussuchen" (Menschenkenntnis, hebt `S.sektionGuete` für den Rest des Laufs) und „exerzieren lassen" dazu.

## Was an der Leiter noch offen ist

**Die Stationen im Prototyp:** Caporal in Verona (Italien), Fourrier bei der Musterung in Kairo, **Sergent in Katia** — der neuen Station zwischen dem Rückzug aus Syrien und Abukir. **Abukir ist damit das erste und einzige Sektionsgefecht**, und das ist dramaturgisch der richtige Ort: ein Gefecht im neuen Maßstab als Schlussstein, statt Rang 5 zu verwalten.

> **Fourrier und Sergent sind im Prototyp faktisch gekoppelt.** Gemessen erreichen exakt dieselben Läufe beides (65 % / 65 % beim Veteranen): Wer in Kairo den Fourrier bekommt, hat bis Katia den Ruf für den Listenweg ohnehin zusammen. Der Feldweg (Ruf 62 ohne Fourrier) ist gebaut und erreichbar, wird vom Testbot aber nie genommen, weil der immer Buchstaben lernt. Das ist kein Fehler, aber es heißt: **Die zweite Schwelle bindet in zwei Kapiteln nicht.** Mit Kapitel 3 sollte sie das.

> **REVIEW-VORBEHALT (ausdrücklich vom Entwickler, 28.07.2026):** Sergent in zwei Kapiteln staucht die Leiter — KONZEPT sah ihn für Kapitel 6–7 vor. **Sobald Kapitel 3 (Garnison) gebaut wird, Schwellen und Fenster neu eichen** — anheben oder strecken, gemessen an den vier Zahlen. Nicht stillschweigend so lassen. Dazu gehört auch die Frage, ob der Erstlauf den Sergenten überhaupt sehen können soll (heute: vorsichtig 20 %, mutig 33 %).

## Die Rangleiter als System (`RANGLEITER.md`, Phase A gebaut)

**Der verbindliche Entwurf aller vierzehn Ränge steht in `RANGLEITER.md`.** Wer an der Leiter baut, liest dort zuerst.

> **Der Grundsatz:** Die Leiter ist ein **System**, die Kapitel sind **Inhalt**. Eine Vakanz hängt an einer allgemeinen Regel — in jedem Gefecht kann die Stelle über dir frei werden, sobald Ruf und Fürsprache stimmen —, nicht an benannten Schlachten. Deshalb funktioniert dieselbe Leiter in vier Kapiteln wie später in elf; sie wird nur seltener durchlaufen.

**Was Phase A gebaut hat:**

| | Was und warum |
|---|---|
| `rangWert()` auf **14 Ränge** | Alles über Rang 6 lieferte **0** — eine stille Fehlwertung, die erst auffiel, als die Leiter darüber hinauswuchs. Werte 120/158/205/262/330/408/490/580 aus KONZEPT §5 |
| `stufe` für **alle** der Kette | Bisher rückte nur Martel auf; `personName('berthaud')` sagte „Lieutenant Berthaud", während die Texte ihn Capitaine nannten. Ohne das trägt die Offiziershälfte nicht |
| Vakanzmaschine als **Liste** | War hart auf zwei Flagpaare verdrahtet (`majorTot`/`martelTot`). Jetzt `S.vakanz[key]`, gespeist aus den `vakanz`-Feldern der LEITER-Einträge |
| `zeigeVorschlag()` **je Eintrag** | War fest auf den Sergenten getextet, lief aber schon für Rang 6 |
| **Sprünge** (`von` mit zwei Rängen) | Wer die Schwellen für Rang 5 erfüllt, während er Rang 3 trägt, wird Sergent. Der Mechanismus, mit dem starke Veteranen unten beschleunigen |
| **Grandmaison**, fünfte Person, vier Stufen | Fürsprecher für Rang 10–13 |
| Musterung **auch im Winterquartier** | Vier Kapitel haben sechs `befoerderung`-Stationen; eine vierzehnstufige Leiter verhungert daran |

### Phase B: die Leiter vollständig, vierzehn Einträge

**Alle vierzehn Ränge sind vergebbar** — Schwellen nach RANGLEITER §7, Fortschreibung der gebauten Reihe 30 / 35 / 52–62 / 75:

| Rang | Ruf | Patron | Gunst | Zusatzschranke | Wer fällt |
|---|---|---|---|---|---|
| 7 Sous-Lieutenant | 95 | Berthaud | 4 | **Bildung 50** | Lieutenant Ferrand |
| 8 Lieutenant | 120 | Vernet | 4 | — | ein Bataillonschef, Berthaud rückt auf |
| 9 Capitaine | 150 | Vernet | 5 | **Ehrenlegion** | Capitaine Lasserre, Vernet rückt auf |
| 10 Chef de bataillon | 180 | Grandmaison | 3 | **Reiten 40** | Chef de bataillon Aubry |
| 11 Colonel | 200 | Grandmaison | 4 | **Adler nicht verloren** | Colonel Desmarets |
| 12 Général de brigade | 230 | Grandmaison | 5 | **3 Bulletins** | Général Séverin |
| 13 Général de division | 260 | Grandmaison | 5 | **Grand Officier** | Général Marchand |
| 14 Maréchal | 300 | — | — | **Generalskampagne** | — |

> **Die Schwellen werden gemessen, aber nicht gesenkt.** Die Leiter ist absichtlich länger als der Inhalt: Mit vier Kapiteln erreicht niemand Ruf 230, und das ist kein Fehler — Phase E löst es über die Patente.

**Zwei Einträge fordern etwas, das es noch nicht gibt** (`orden:'legion_grand'` bei Rang 13, `generalskampagne` bei Rang 14). Sie sind programmiert und unerreichbar, bis der Inhalt nachkommt — genau so gewollt.

**Die Musterung prüft jetzt sieben Schrankenarten** statt drei (`fehltWas()`), und der Nachsatz, der die fehlende Zahl beim Namen nennt, kommt aus einer Tabelle statt aus vier ausgeschriebenen Fällen. Mit vierzehn Rängen wäre das sonst eine Kette von Sonderfällen geworden.

**Die zwei Rangschranken** (`SCHRANKEN` in `kampf.js`) sind gebaut, bevor die Kapitel dafür stehen: nach Russland Rang 7, vor Waterloo Rang 10, samt Durchlass-, Ende- und Epilogtext. Kapitel 8 und 10 müssen später nur noch `schranke:'russland'` an eine Station hängen.

### Die Arcole-Marke — die einzige Fernwirkung des Spiels

**Du hast Grandmaison 1796 aus einem Sumpf gezogen.** Wer die Arcole-Sondermission besteht, setzt `S.arcoleMarke`; ab Rang 9 beginnt man bei ihm mit **Gunst +2** und einem Satz, der zeigt, dass er sich erinnert („Arcole", sagt er. Keine Frage, keine Erklärung). Wer sie verfehlt oder nie antritt, trifft ihn kalt bei null.

**Sie wird nirgends angekündigt** — weder im Spiel noch im Handbuch. Sie wird nur eingelöst. Wer sie erwähnt, nimmt ihr alles.

### Ein teurer Fehler, nebenbei gefunden

`lager_rhein` und `lager_bruenn` in Kapitel 4 forderten Handlungs-IDs, die `LAGER_TUN` nicht kennt (`schiessen`, `flicken`, `schlafen`, `feuer`, `schuster`, `oelen`), und `lagerHandlungen()` filtert Unbekanntes **stumm** weg. **Das Lager vor Austerlitz hatte dadurch zwei von acht Knöpfen — und keinen davon war `ruhe`.** Gemessen: Überleben **33 → 50 %** allein durch die Reparatur.

> **Regel daraus:** Ein stummer Filter ist ein Fehlerverstecker. Wer eine Auswahl aus Daten füttert, sollte Unbekanntes melden statt weglassen — sonst kostet ein Tippfehler siebzehn Prozentpunkte, und niemand sieht ihn.

## Was als Nächstes ansteht

1. **Die Rangleiter, Phase E** — die Patente (Sous-Lieutenant 110 VP, Lieutenant 145 VP), der Prüfmodus über alle vierzehn Ränge, die Rangverteilung in `balance.js`. **Phase E trägt den Schlüssel:** Solange nur vier Kapitel stehen, erreicht niemand Ruf 230 — die oberen Ränge sind gebaut und unsichtbar. Wer ein Patent kauft, spielt die Offiziershälfte vom ersten Kapitel an.
2. **Die höheren Ordensgrade** (Officier ab 1807, Commandeur ab 1809). Sie sind in KONZEPT §6 vollständig entworfen und hängen nur an Kapiteln, die es noch nicht gibt. *(Die Dotationen sind mit Phase D erledigt.)*
3. **Kapitel 5 bis 11** — je Kapitel ein Rang als Wohnort (RANGLEITER §10, Phase F).
4. **Der freiwillige Ausstieg an den Rangschranken** — daran hängt der gestaffelte Überlebensbonus (70/120/180), der in der Wertung noch als Platzhalter 25 steht.

> **Erledigt am 28.07.2026:** Die volle Punkteskala ist übernommen, und die Sollwerte sind auf die zwei Leitzahlen `überlebt` und `höchster Rang` neu gesetzt. Beides steht oben unter „Balance-Konstanten".
>
> **Erledigt am 29.07.2026:** Rangleiter Phase C — die Ränge 7 bis 9 (siehe „Ränge 7–9 — der Offizier"). Damit ist auch die frühere Nummer 3 der Liste eingelöst: Die **zweite Gefechtsachse „Auftrag erfüllt"** steht, und die Auszeichnungen hängen ab Rang 9 daran statt am Sieg.
>
> **Ebenfalls am 29.07.2026:** Rangleiter Phase D — die Ränge 10 bis 14 (siehe „Ränge 10–14 — der Stab"). **Alle vier sichtbaren Brüche stehen damit**, und die Generalskampagnen sind freigeschaltet, sobald jemand Rang 12 erreicht. Die Dotationen sind mit erledigt.

> **⚠ Offen und ausdrücklich nicht gemessen: die Härte der Offiziersränge.** RANGLEITER §11 fragt, ob der Spieler den Anschluss verliert, wenn die Muskete weg ist — „zu messen, nicht zu beschließen: Wenn nach Rang 7 die Sterblichkeit einbricht oder explodiert, stimmt die Umstellung der Proben nicht."
>
> **Diese Messung ist mit vier Kapiteln unmöglich**, weil kein Lauf Rang 7 erreicht; `balance.js` sieht die Offiziersknöpfe nie. Geprüft ist bisher nur, **dass** sie funktionieren (`test/offizier.js`), nicht **wie hart** sie sind. **Wer Phase E baut, misst als Erstes den gekauften Leutnant** — und zwar gegen die vier bekannten Zahlen, nicht gegen ein Gefühl. Zwei Verdächtige stehen dabei schon fest: der Gefahrzuschlag +4/+5 und der gelöste Zug, der die Linie ganz abschaltet.
