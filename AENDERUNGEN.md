# Änderungsprotokoll

Eine Zeile je Änderung. Balance-Zahlen immer mit Begründung und Messwert.
Format: `Datum · Bereich · was · warum · gemessen`

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
