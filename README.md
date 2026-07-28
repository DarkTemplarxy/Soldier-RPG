# Der Marschallstab

**Ein Karriere-Simulator in der Grande Armée, 1796–1815.**

Du beginnst als analphabetischer Rekrut mit einer Muskete, die dir nicht gehört. Wenn du zwanzig Jahre und sechs Feldzüge überlebst, hältst du vielleicht einen Marschallstab. Wahrscheinlicher liegst du 1796 in einem Graben bei Montenotte.

> ▶ **[Im Browser spielen](https://darktemplarxy.github.io/Soldier-RPG/)** — kein Download, keine Installation.

![Gefecht auf der Brücke von Lodi](entwurf/bild_gefecht.png)

---

## Was das anders macht

Die meisten Spiele über Rangaufstieg geben dir größere Zahlen. Dieses gibt dir **andere Knöpfe**.

Als **Fusilier** steuerst du deinen eigenen Körper: laden, anlegen, feuern, hinwerfen. Du siehst vier Männer und Rauch — keine Karte, keine Feindstärke, kein Überblick.

Als **Voltigeur** kämpfst du allein vor der Linie: zielen, Deckung wechseln, frei bewegen. Ein anderes Minispiel, nicht bessere Werte.

Als **Caporal** kommen acht Männer dazu, und mit ihnen Befehle: Salve schießen lassen, die Lücke schließen.

Und mitten im Gefecht kommen Fragen, die keine Handgriffe sind. Der Adjutant sucht acht Mann für die Geschütze auf dem Hügel und sagt nicht, wofür. Der Adlerträger fällt, und der Adler steht schräg im Dreck, sechs Schritt vor der Linie, wo niemand steht. Vier Schritt weiter liegt einer und ruft, und hat keine Luft für laut. **Du kannst jedes Mal stehen bleiben.** Es kostet nichts und bringt nichts, und niemand sagt etwas dazu — weder jetzt noch später.

Weiter oben — im Konzept entworfen, noch nicht gebaut — wird daraus eine Kompanie, ein Regiment, eine Division. Der General sieht dann eine Operationskarte und Meldungen, die vierzig Minuten alt und teilweise falsch sind. **Er sieht mehr und weiß weniger als der Fusilier.**

Dazu ein paar Regeln, die das Spiel zusammenhalten:

- **Der Tod ist endgültig.** Kein Weiterspielen, kein Nachfolger.
- **Nur der beste Lauf zählt.** Veteranenpunkte sind das Maximum über alle Läufe, nie die Summe — es gibt nichts zu grinden, nur zu übertreffen.
- **Dein erster Mann rückt mit sechzig Punkten ein und wird Ägypten sehr wahrscheinlich nicht überleben.** Das ist keine Strafe, sondern der Anfang: Was er erreicht, wird zum Startkapital des Nächsten. Gegner, gegen die du im ersten Lauf chancenlos bist, sind im dritten zu schlagen — nicht weil sie schwächer geworden sind, sondern weil du schneller lädst.
- **Beförderung braucht eine Vakanz.** Ruf und Fürsprache reichen nicht; die Stelle muss frei sein. Frei wird sie, weil jemand gestorben ist. Das Spiel sagt das nie, es zeigt es nur.
- **Ausrüstung ist ein Zustand, kein Besitz.** Schuhe halten einen Feldzug, keine zwei.
- **Konstitution kauft Zähigkeit, nicht Unverwundbarkeit.** Sie bestimmt, wie viele Treffer du wegsteckst — fünf bis acht, dann ist es vorbei. Die Zeit heilt, langsam; aber der Atem steigt nie über das Leben, und wer zerschossen weiterkämpft, kämpft kurzatmig.

Historische Fixpunkte, dazwischen freies Spiel: Montenotte, die Brücke von Lodi, Mantua, Castiglione, Arcole, Rivoli, Leoben — dann Alexandria, die Pyramiden, der Kairoer Aufstand, Akkon, Abukir und die Nacht, in der Bonaparte ohne seine Armee nach Frankreich segelt.

---

## Stand

**Zwei Feldzüge sind spielbar** — Italien 1796/97 und Ägypten 1798/99, zusammen zweiunddreißig Stationen, zehn Gefechte, fünf Lager, zwei Winterquartiere, Ränge 1 bis 3.

Italien ist das Lehrstück: barfuß über die Pässe, die Brücke von Lodi, der Sumpf von Arcole. Ägypten ist etwas anderes — dort töten die Wege mehr Männer als die Gefechte. Hitzschlag im Marsch auf Damanhur, Ruhr am Sinai, das Fieber aus Jaffa auf dem Rückzug. Akkon fällt nicht, so wie es 1799 nicht gefallen ist, und nach Abukir liegt die Flotte auf dem Meeresgrund: Es gibt keinen Weg mehr nach Hause.

Zwischen den Gefechten liegen Wege: 1 200 km von Savona bis Leoben, danach 4 000 km über See und durch die Wüste, jede Station mit Entfernung und Dauer. Vor jedem Gefecht steht der Anmarsch — der Nachtmarsch im Regen, die vier Stunden Warten in den Gassen von Lodi, die Lagemeldung und das, womit du dastehst. In den Lagern entscheidest du, was du mit den zwei oder drei Abenden anfängst: exerzieren, scharf schießen, die Schuhe zum Schuster tragen, die Muskete ölen, schlafen. Es ist immer mehr zu tun als Zeit da ist.

Entworfen, aber noch nicht gebaut: die Kapitel 3 bis 11 (Garnison, Austerlitz, Jena, Eylau, Spanien, Russland, Leipzig, Frankreich, Waterloo), die Ränge 4 bis 14, Orden, Pferd, Kompaniekasse und die vier möglichen Enden einer Laufbahn. Das vollständige Design steht in [`KONZEPT.md`](KONZEPT.md).

Und die Gegner wachsen mit: Jede Kampagne trägt eine Güte-Zahl, die bestimmt, wie gut der Feind schießt und wie lange er steht. Beaulieus geschlagene Kolonnen laufen von allein; Dschesärs Garnison in Akkon läuft nicht. Wer beides schafft, hat zweiunddreißig Stationen hinter sich — und immer noch neun Feldzüge vor sich.

---

## Spielen

`index.html` im Browser öffnen. Doppelklick genügt — kein Server, kein Build, keine Abhängigkeiten. Zum Weitergeben liegt dieselbe Fassung als einzelne Datei unter `dist/marschallstab.html`.

Links steht der Weg: alle elf Feldzüge, auf- und zuklappbar. Innerhalb eines Feldzugs siehst du nur die Stationen, die du mindestens einmal betreten hast — was danach kommt, weißt du nicht. Was du einmal gesehen hast, bleibt über den Tod hinaus sichtbar.

Der angefangene Feldzug wird selbsttätig gesichert — beim Betreten eines Lagers wird es angesagt, danach still nach jedem Schritt. Wer aufhört, kommt genau dorthin zurück, wo er war. **Wer fällt, verliert den Spielstand im selben Augenblick:** Der Aussetz-Spielstand ist zum Aufhören da, nicht zum Wiederholen.

Chronik und laufender Feldzug lassen sich über „Spielstand sichern" zusätzlich als Datei herunterladen und später wieder laden. Die Datei bleibt das maßgebliche Format; der Browser-Speicher ist nur dafür da, dass ein Absturz keinen Feldzug kostet.

---

## Entwickeln

```bash
npm install playwright && npx playwright install chromium

node test/durchspielen.js     # spielt einen Lauf durch, meldet Konsolenfehler
node test/spielstand.js       # sichern, fortsetzen, sterben, alte Fassungen
node test/balance.js 40       # 40 Läufe, misst die Überlebensquote
node werkzeug/bauen.js        # baut dist/marschallstab.html
```

Findet Playwright den Browser nicht: `CHROMIUM=/pfad/zu/chrome node test/…`

```
index.html                      lädt die Skripte in fester Reihenfolge
src/stil.css
src/daten/grundwerte.js         Attribute, Fertigkeiten, Ränge, Herkünfte, Kaufladen
src/daten/kapitel01_italien.js  Kapitel 1 als reine Daten
src/daten/kapitel02_aegypten.js Kapitel 2, hängt sich selbst an die Kette
src/spielstand.js               Fassungen, Wandler, Ablage, Aussetz-Spielstand
src/mechanik.js                 Laufzustand, Proben, Wachstum, Verschleiß, Wunden
src/oberflaeche.js              Titel, Erschaffung, Ablauf, Szenen
src/kampf.js                    Anmarsch, Gefecht, Elitekompanie, Beförderung
src/abschluss.js                Lager, Winterquartier, Wertung, Tod, Spielstand
src/start.js                    Einstiegspunkt
```

Klassische Skripte statt ES-Module — damit `index.html` per Doppelklick über `file://` läuft. Bitte so lassen; Module scheitern dort an der Sicherheitsprüfung des Browsers.

---

## Mitmachen

Vor dem ersten Beitrag bitte **[`CLAUDE.md`](CLAUDE.md)** lesen. Dort stehen die acht Design-Invarianten und **jede Balance-Zahl mit Begründung** — etwa warum die Trefferchance bei Lodi 15 ist und nicht 38, und warum die Zeile `feindMoral -= schaden + linie` nicht entfernt werden darf. (Ohne sie sind alle Gefechte rechnerisch unmöglich zu gewinnen. Das ist getestet worden, mit 100 % Verlusten.)

Wer eine Balance-Zahl ändert, trägt sie in `CLAUDE.md` und `AENDERUNGEN.md` nach und lässt `node test/balance.js 40` laufen.

Neue Kapitel kommen als eigene Datendatei nach `src/daten/` und enthalten keine Logik.

**Ton der Texte:** nüchtern-brutal, zweite Person, Präsens. Konkrete Zahlen statt Adjektive. Das Spiel wertet nicht und sagt nie, ob eine Entscheidung richtig war.

---

## Dokumente

| Datei | Inhalt |
|---|---|
| [`KONZEPT.md`](KONZEPT.md) | Vollständiges Designdokument: elf Kapitel, vierzehn Ränge, Punkteökonomie, Simulationen |
| [`CLAUDE.md`](CLAUDE.md) | Design-Invarianten und alle Balance-Konstanten mit Begründung |
| [`AENDERUNGEN.md`](AENDERUNGEN.md) | Änderungsprotokoll, inklusive der vier Balance-Fassungen von 100 % auf 50 % Verluste |
| [`entwurf/`](entwurf/) | Konzeptgrafiken: Maßstabswechsel, Progression, Ausrüstung und Orden |

---

## Lizenz

**Code** unter der MIT-Lizenz — siehe [`LICENSE`](LICENSE).

**Spielinhalte** (Texte, Szenen, Design, Grafiken) unter [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de) — siehe [`LICENSE-INHALTE`](LICENSE-INHALTE). Verwenden und verändern ausdrücklich erlaubt, kommerziell verwerten nicht.
