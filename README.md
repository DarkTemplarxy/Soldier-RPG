# Der Marschallstab

**Ein Karriere-Simulator in der Grande Armée, 1796–1815.**

Du beginnst als analphabetischer Rekrut mit einer Muskete, die dir nicht gehört. Wenn du zwanzig Jahre und sechs Feldzüge überlebst, hältst du vielleicht einen Marschallstab. Wahrscheinlicher liegst du 1796 in einem Graben bei Montenotte.

> ▶ **[Im Browser spielen](https://darktemplarxy.github.io/Soldier-RPG/)** — kein Download, keine Installation.
> *(Link funktioniert, sobald GitHub Pages aktiviert ist — siehe unten.)*

![Gefecht auf der Brücke von Lodi](entwurf/bild_gefecht.png)

---

## Was das anders macht

Die meisten Spiele über Rangaufstieg geben dir größere Zahlen. Dieses gibt dir **andere Knöpfe**.

Als **Fusilier** steuerst du deinen eigenen Körper: laden, anlegen, feuern, hinwerfen. Du siehst vier Männer und Rauch — keine Karte, keine Feindstärke, kein Überblick.

Als **Voltigeur** kämpfst du allein vor der Linie: zielen, Deckung wechseln, frei bewegen. Ein anderes Minispiel, nicht bessere Werte.

Als **Caporal** kommen acht Männer dazu, und mit ihnen Befehle: Salve schießen lassen, die Lücke schließen.

Weiter oben — im Konzept entworfen, noch nicht gebaut — wird daraus eine Kompanie, ein Regiment, eine Division. Der General sieht dann eine Operationskarte und Meldungen, die vierzig Minuten alt und teilweise falsch sind. **Er sieht mehr und weiß weniger als der Fusilier.**

Dazu ein paar Regeln, die das Spiel zusammenhalten:

- **Der Tod ist endgültig.** Kein Weiterspielen, kein Nachfolger.
- **Nur der beste Lauf zählt.** Veteranenpunkte sind das Maximum über alle Läufe, nie die Summe — es gibt nichts zu grinden, nur zu übertreffen.
- **Beförderung braucht eine Vakanz.** Ruf und Fürsprache reichen nicht; die Stelle muss frei sein. Frei wird sie, weil jemand gestorben ist. Das Spiel sagt das nie, es zeigt es nur.
- **Ausrüstung ist ein Zustand, kein Besitz.** Schuhe halten einen Feldzug, keine zwei.

Historische Fixpunkte, dazwischen freies Spiel: Montenotte, Dego, Mondovì, die Brücke von Lodi, Mailand, Mantua, Castiglione, Arcole, Rivoli, Leoben.

---

## Stand

**Kapitel 1 (Italien 1796/97) ist spielbar** — sechzehn Stationen, fünf Gefechte, drei Lager, Winterquartier, Ränge 1 bis 3.

Zwischen den Gefechten liegen Wege: 1 200 km von Savona bis Leoben, jede Station mit Entfernung und Dauer. Vor jedem Gefecht steht der Anmarsch — der Nachtmarsch im Regen, die vier Stunden Warten in den Gassen von Lodi, die Lagemeldung und das, womit du dastehst. In den Lagern entscheidest du, was du mit den zwei oder drei Abenden anfängst: exerzieren, scharf schießen, die Schuhe zum Schuster tragen, die Muskete ölen, schlafen. Es ist immer mehr zu tun als Zeit da ist.

Entworfen, aber noch nicht gebaut: die Kapitel 2 bis 11 (Ägypten, Austerlitz, Jena, Eylau, Spanien, Russland, Leipzig, Frankreich, Waterloo), die Ränge 4 bis 14, Orden, Pferd, Kompaniekasse und die vier möglichen Enden einer Laufbahn. Das vollständige Design steht in [`KONZEPT.md`](KONZEPT.md).

Gemessen über 120 automatisierte Durchläufe: **gut ein Drittel übersteht das erste Kapitel.** Etwa die Hälfte stirbt ohne eine einzige Beförderung.

---

## Spielen

`index.html` im Browser öffnen. Doppelklick genügt — kein Server, kein Build, keine Abhängigkeiten. Zum Weitergeben liegt dieselbe Fassung als einzelne Datei unter `dist/marschallstab.html`.

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
