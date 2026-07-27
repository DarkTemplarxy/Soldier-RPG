# Änderungsprotokoll

Eine Zeile je Änderung. Balance-Zahlen immer mit Begründung und Messwert.
Format: `Datum · Bereich · was · warum · gemessen`

---

## 2026-07-27 — Erschaffung in zwei Schritten, Verlauf entrümpelt

**Reihenfolge umgedreht.** Vorher: Veteranenpunkte ausgeben, dann den Mann erschaffen. Jetzt: erst Name, Herkunft und Poolverteilung, dann die Punkte auf die **fertigen** Werte legen. Der Kaufteil stand vorher unter der Ausrüstungstabelle und war deshalb nicht zu finden — jetzt sind „Attribute ergänzen" und „Fertigkeiten ergänzen" zwei eigene Blöcke mit je einer Zeile pro Wert: jetziger Wert, Pfeil, neuer Wert, Preis.

**Der Preis rechnet vom Istwert statt vom Sockel.** Weil die Erschaffung zuerst kommt, ist der Ausgangswert bekannt. Ein Wilderer mit Muskete 40 zahlt für fünf Punkte 15 VP, einer bei Muskete 10 nur 5. Spezialisierung wird teuer, Breite bleibt bezahlbar — der eigentliche Sinn von `PRO_PUNKT`. Obergrenzen jetzt auf den Endwert bezogen: Attribute 70 (wie bei der Poolverteilung), Fertigkeiten 60.

**Kampagnenverlauf entrümpelt.** Jede Station stand in zwei Zeilen mit Datum, Art und Zähler, was bei 246 px Spaltenbreite umbrach. Jetzt eine Zeile: Ort, kleines Artkürzel (Gefecht, Lager, Winter, Musterung, Auswahl), Besuchszähler. Das Datum steht im Titel-Attribut und ohnehin im Kartenkopf, sobald man dort ist.

Die drei Testskripte folgen der neuen Reihenfolge (`Auswürfeln` → Herkunft → `Weiter zu den Veteranenpunkten` → `Einrücken`).

---

## 2026-07-27 — Kampagnenverlauf, volles Winterquartier, Ausbildung kaufen

**Kampagnenverlauf links.** Alle elf Feldzüge aus `KONZEPT.md` stehen jetzt in einer dritten Spalte, auf- und zuklappbar. **Innerhalb einer Kampagne sieht man nur die Stationen, die man mindestens einmal betreten hat**; danach steht „Was danach kommt, weißt du nicht." Der Nebel liegt in `META.bestKapitel` und überlebt deshalb den Tod — wer oft spielt, kennt den Weg. Die alte Tabelle „Wie weit ich schon war" auf dem Titelbildschirm ist ersetzt: Sie verriet alle Stationsnamen auf einmal.

**Das Winterquartier füllt den Atem ganz auf**, beim Betreten und ohne eine Woche dafür zu opfern. Belastung und Wunden bleiben Sache der Wochenverteilung.

| Stand | Läufe | überstanden | Caporal | Punkte-Median |
|---|---|---|---|---|
| ohne jede Erholung, nur Warnung | 120 | 38 % | 23 % | 60 |
| **Warnung + volles Winterquartier** | **80** | **44 %** | **30 %** | **86** |

Beide Sollwerte getroffen (45–55 % und ~30 %), ohne dass Atem außerhalb von Lager und Winterquartier geschenkt wird. **Ein einziger Erholungspunkt an der richtigen Stelle schlägt eine Erholung an jeder Station** — das war die Antwort auf die Frage nach einer wirkungsvollen, aber nicht frustrierenden Maßnahme.

**Veteranenpunkte lassen sich in einzelne Werte umsetzen.** `PRO_PUNKT` und `kostenVon()` lagen seit dem ersten Meilenstein ungenutzt in `grundwerte.js` und tun jetzt, wofür sie gedacht waren: Fünferschritte, gerechnet vom Sockel (Attribute 20, Fertigkeiten 10), mit steigendem Preis je Zehnerbereich — Fertigkeit 10 → 20 kostet 10 VP, Attribut 20 → 60 kostet 110. Obergrenzen 60 und 50. Invariante 3 bleibt gewahrt: gekauft wird der Ausgangspunkt, nie der Aufstieg. Der Testbot kauft nichts, die Messwerte gelten also weiterhin für den Lauf ohne Punkte.

**Probenergebnis verkleinert** — das Feld „KONSTITUTION — GELUNGEN" stand zu groß im Fließtext und steht jetzt kleiner und in eigener Zeile.

---

## 2026-07-27 — Spielstand, Atem-Erholung, Erklärungen

**Aussetz-Spielstand.** Neu: `src/spielstand.js` mit Fassungen, Wandlern, Ablage und Prüfsumme. Der Laufzustand lag in acht verstreuten Globalen (`S`, `K`, `NODE`, `WOCHEN`, `WLOG`, `ABENDE`, `LAGER_ID`, `LLOG`) plus `window.AKT`, das ein Verweis mitten in die Kapiteldaten war — deshalb ließ sich ein laufender Feldzug gar nicht speichern. Jetzt ein `LAUF`-Objekt aus reinen Daten; `S` und `K` sind nur noch Kurznamen darauf.

- Gesichert wird beim **Betreten eines Lagers** — dort wird es auch angesagt — und danach still nach **jedem** Schritt, auch nach jeder Kampfrunde.
- **Der Tod löscht sofort.** Ein Spielstand, der nur im Lager stünde, wäre ein Rücksetzpunkt: Wer im Gefecht sieht, dass es schiefgeht, schließt den Reiter und stünde wieder im Lager. Ein immer aktueller Spielstand kann nicht zum Zurückspulen benutzt werden und leistet trotzdem alles, wofür man ihn will.
- `stationErledigt()` setzt `LAUF.node` schon hoch, während der Ergebnisbildschirm noch steht — sonst ließe sich eine Szenenwahl durch Beenden rückgängig machen.
- **Invariante 6 geändert:** `localStorage` war ganz verboten. Ohne Browser-Ablage kann ein Absturz keinen Feldzug retten. Neu: Die Datei bleibt maßgeblich, `localStorage` ist nur die bequeme Ablage, und das Spiel muss ohne sie vollständig funktionieren.
- Neuer Test `test/spielstand.js` mit fünfzehn Prüfungen. Er hat sofort einen echten Fehler gefunden: Die Beförderungsstation rief `stationErledigt()` nicht auf und lief in eine Endlosschleife.

**Atem-Erholung gebaut und wieder ausgebaut.** Die Formel lautete `8 + Konstitution/12 − Belastung/25 − 2×Wunden` je Station. Sie hob den Caporal-Anteil von 28 % auf 42 % und machte damit die Schwelle hinfällig, die zwei Stunden vorher darauf eingestellt worden war. Der Weg ist mittelbar: mehr Atem → seltener der Malus `Atem < 30` (+5 Gefahr je Runde) → mehr gewonnene Gefechte → mehr Ruf → mehr Beförderungen.

**Stattdessen wird gewarnt, statt zu heilen.** `ATEM_WARNUNG = 35`, fünf Punkte über dem Malus bei 30: roter Balken und rote Zahl in der Seitenleiste, ein roter Kasten mit der Folge im Klartext, eine Warnung über der Rundenzeile im Gefecht (mit dem Hinweis, dass „Hinwerfen" +10 bringt) und eine zweistufige Zeile im Anmarsch. Die Erholung bleibt damit eine Entscheidung im Lager und wird nicht verschenkt.

| Stand | Läufe | überstanden | Caporal | Punkte-Median |
|---|---|---|---|---|
| nach der Schwellenänderung | 80 | 48 % | 28 % | 88 |
| mit Atem-Erholung | 105 | 41 % | 42 % | 93 |
| **ohne Erholung, mit Warnung (gültig)** | **120** | **38 %** | **23 %** | **60** |

Der Punkte-Median sagt hier mehr als die Quote: Die Läufe enden nicht nur genauso oft tödlich, sie enden **früher**. Beides steht als offener Punkt in `CLAUDE.md`, mit drei benannten Hebeln — und dem Hinweis, dass jeder davon über den Ruf auch den Caporal-Anteil hebt.

**Gelernte Regel:** Alles, was die Kampfkraft hebt, hebt über den Ruf auch den Caporal-Anteil. Wer an Atem, Wunden oder Gefahr dreht, misst beide Zahlen — nicht nur die Überlebensquote.

**Erklärungen beim Überfahren** für alle sechs Attribute und neun Fertigkeiten, in der Seitenleiste und bei der Erschaffung. Reines CSS, keine Abhängigkeit. Wo ein Wert in Kapitel 1 noch nichts tut — Reiten, Kartenkunde, Feldchirurgie —, steht das ausdrücklich da.

---

## 2026-07-27 — Beförderungsschwelle und Lesbarkeit

**Gunst war keine Hürde, sondern eine Konstante.** Über 60 gemessene Läufe kamen *alle* 42 Überlebenden mit exakt Gunst 3 bei Verona an, weil eine einzige Szenenwahl (Mondovì melden, +3) die Anforderung allein erfüllte. Damit war die Schwelle 3 geschenkt und jede höhere unerreichbar.

| Änderung | Warum | Gemessen |
|---|---|---|
| Caporal-Schwelle Ruf 25 → **30**, Gunst 3 → **4** (`CAPORAL_RUF` / `CAPORAL_GUNST` in `src/kampf.js`) | Caporal-Anteil lag bei 44 % gegen einen Sollwert von 30 % | **28 %** über 80 Läufe |
| Mondovì „melden" Gunst 3 → **2**, Mantua „Fourier" 4 → **3** | Keine einzelne Tat soll die Fürsprache mehr allein tragen — sonst höhlt sie Invariante 5 aus | Überleben **48 %**, im Band 45–55 % |
| Testbot sitzt im Lager am Feuer, solange seine Gunst unter 4 liegt | Ohne das bemüht er sich nie um Fürsprache, und das Skript misst seine Blindheit statt der Schwelle | — |

Der Ruf war beim Bot zweigipflig (19–25 oder 36–41, dazwischen niemand); 30 liegt in dieser Lücke. Nebenbefund: Der Anteil ohne jede Beförderung steigt von 41 % auf 53 % — die Kehrseite derselben Schwelle.

**Probenergebnis statt Probenrechnung.** Nach einer Wahl stand `GESCHICK 80 gegen 30 → Zielwert 95 · gewürfelt 52 · GELUNGEN`. Wert und Schwierigkeit stehen schon vor der Wahl auf dem Knopf, wo sie beim Entscheiden helfen; hinterher ist das nur noch Rechenweg. Jetzt `Geschick — gelungen` in einem Feld mit grünem oder rotem Rand. Die Wirkungszeile („Atem −5 · Ausgabeschuhe +22") war die blasseste Zeile des Bildschirms und ist jetzt die deutlichste: eigener Kasten mit Messingbalken, fast in Textfarbe.

**Kontrast der Oberfläche angehoben.** `--dim` und `--faint` standen auf `#877e71` und `#5c554b`, was auf dem Braun der Karten **2,2 : 1** ergab — Attributnamen, Kartenköpfe und Kostenzeilen waren kaum lesbar. Jetzt `#aca192` (6,6 : 1) und `#948a79` (4,7 : 1), dazu Zahlen in der Seitenleiste fast weiß, Abschnittsüberschriften in Messing statt Grau, Kostenzeilen von 10,5 auf 11,5 px und deutlichere Knopfränder. Die Regeln stehen als eigener Abschnitt „Lesbarkeit" in `CLAUDE.md`.

---

## 2026-07-27 — Lager, Anmarsch, Ortswechsel

**Drei Lager eingebaut** (`typ:'lager'`): Depot Savona vor dem Feldzug (3 Abende), Kantonierung Corsico nach Mailand (2), Feldlager an der Etsch vor Arcole (2). Dazu dreizehn Lagerhandlungen für Ausbildung und Instandhaltung, drei davon nur für Rang 3, Grenadier oder Voltigeur. Grund: Zwischen Erschaffung und erstem Gefecht gab es keine einzige eigene Entscheidung, und Instandhaltung war bis zum Dezember nicht möglich. Stationen damit 13 → 16.

**Anmarsch vor jedem Gefecht** (`anmarsch`, `lage`): vier bis fünf Absätze über den Weg dorthin, das Warten und die Stellung, dazu eine nüchterne Lagemeldung (Gegner, Auftrag, Gelände, dein Platz) und eine Zustandsmeldung, die aus Ausrüstung, Wunden und Atem erzeugt wird. Vorher fiel man aus der Szene ohne Übergang in die erste Kampfrunde.

**Ortswechsel** (`marsch`): Band über jeder Station mit Herkunft, Ziel, Entfernung und Dauer — 1 200 km in einem Jahr, was vorher nirgends stand.

### Balance

| Änderung | Warum | Gemessen |
|---|---|---|
| Anmarsch kostet `verschleiss(0.3)`, Atem −6, Belastung +2 | Der Marsch soll die Lager nicht zum reinen Zugewinn machen | **35 % Überleben** — zu hart |
| **auf `verschleiss(0.15)`, Atem −4, Belastung +1 halbiert** | Marschverschleiß über fünf Gefechte wog schwerer als drei Lager einbringen | **47 %** über 120 Läufe · im Zielband 45–55 % |
| Wertung: Stationen von 4 auf **3** Punkte | 16 statt 13 Stationen; bei 4 Punkten hätte ein Spitzenlauf den Laden leergekauft | Maximum 162 gegen Ladensumme 166 |

Nebenbefund: Der Caporal-Anteil steigt von 37 % auf 44 %, weil mehr Männer den September lebend erreichen. Sollwert ist 30 % — falls gesenkt, dann an der Schwelle, nicht an der Tödlichkeit.

---

## 2026-07-27 — Meilenstein 1

**Kapitel 1 (Italien 1796/97) gebaut.** Dreizehn Stationen von Savona bis Leoben, fünf Gefechte, Winterquartier. Ränge 1–3.

### Balance-Verlauf desselben Tages

Die Zahlen sind nicht geraten, sondern in vier Durchgängen erspielt worden. Der Verlauf ist hier festgehalten, damit niemand versehentlich zur ersten Fassung zurückkehrt.

| Fassung | Gefahr | Feindmoral | Ergebnis (40 Testläufe) |
|---|---|---|---|
| 1 | 26 / 38 / 30 / 36 / 32 | 60 / 100 / 75 / 95 / 85 | **100 % Tod**, kein einziger Sieg |
| 2 | 12 / 17 / 14 / 16 / 15 | unverändert | 95 % Tod |
| 3 | unverändert | 45 / 78 / 58 / 74 / 66 + Linienbeschuss | 70 % Tod |
| **4 (gültig)** | **10 / 15 / 12 / 14 / 13** | **45 / 78 / 58 / 74 / 66** | **50 % Tod** |

**Was Fassung 1 wirklich kaputt gemacht hat, war nicht die Trefferchance, sondern die Rechnung:** Man feuert nur jede zweite Runde (laden, feuern, laden …), kommt in neun Runden auf vier Schuss zu je 12–32 Schaden und damit nie an eine Feindmoral von 100 heran. Die Gefechte waren nicht schwer, sie waren unmöglich.

**Die Lösung war eine Zeile** in `src/kampf.js`:

```js
const linie = 2 + Math.random()*4;   // Die Linie kämpft auch ohne dich
K.feindMoral -= schaden + linie;
```

Zweihundert andere Männer schießen ebenfalls. Das macht die Gefechte gewinnbar und stimmt inhaltlich — du bist ein Mann in einer Linie, kein Held.

### Weitere Korrekturen

- **Wunden schlagen nicht mehr auf alle Werte**, sondern voll auf körperliche und nur zu einem Drittel auf geistige. Vorher senkte jede Wunde die Konstitution, das erhöhte die Todeschance, was zur nächsten Wunde führte — eine Todesspirale.
- **Tödlichkeitsschwelle von 92 auf 94** angehoben, schwere Wunde von 66 auf 72.
- **Wundenobergrenze von 4 auf 5**, und nach jedem Gefecht heilt die leichteste Wunde. Ohne das tötete allein die Ansammlung über fünf Gefechte.
- **Wertung:** Stationen von 6 auf 4 Punkte gesenkt, Überlebensbonus von 40 auf 25 — der Stationsbonus hatte mit 78 von 130 Punkten die Wertung dominiert und den Rang bedeutungslos gemacht.
- **Kaufladen verteuert** (vorher 10–25 VP, Summe 107; jetzt 12–40 VP, Summe 166), weil ein einziger guter Lauf sonst den ganzen Laden leerkaufte.
- **Anzeigefehler behoben:** Der Beförderungsbildschirm zeigte den Ruf *nach* dem Beförderungsbonus, also 46 statt der geprüften 41.
- **Elitewahl und Beförderung getauscht:** Die Elitekompanie wird jetzt in Mailand (Mai 1796) besetzt, die Caporal-Stelle nach Castiglione (September). Vorher stand die Beförderung zu Rang 3 vor der Auswahl zu Rang 2.

### Bewusste Festlegungen

- **Klassische Skripte statt ES-Module**, damit `index.html` per Doppelklick über `file://` läuft.
- **Kein `localStorage`** — Spielstand als JSON-Datei zum Herunterladen und Laden.
- **Kein Build-Schritt nötig.** `werkzeug/bauen.js` ist nur zum Weitergeben einer Einzeldatei da.
