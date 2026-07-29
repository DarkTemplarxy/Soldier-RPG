# Offene Punkte

**Ein Ort für alles, was gemessen, aber nicht entschieden ist.** Bis Kapitel 6 lagen diese Befunde über `CLAUDE.md` verstreut, jeder im Abschnitt seines Fundorts — und damit fand sie nur, wer ohnehin dort las. Hier stehen sie zusammen, in der Reihenfolge, in der sie angefasst gehören.

**Regeln für diese Datei:**

1. **Kein Punkt ohne Zahl.** Wer etwas einträgt, schreibt dazu, woran man es gemessen hat. Ein Verdacht ohne Messwert gehört in `KONZEPT.md`, nicht hierher.
2. **Kein Punkt ohne Hebel.** Es muss dastehen, an welcher Zeile man drehen würde — sonst ist es ein Gefühl.
3. **Erledigte Punkte werden nicht gelöscht, sondern nach unten verschoben** und mit dem Messwert versehen, der sie geschlossen hat. Das Protokoll ist der halbe Wert.
4. **Wer einen Punkt anfasst, misst gegen die vier Zahlen** aus `CLAUDE.md` („Die zwei Leitzahlen"): Erstlauf vorsichtig, Erstlauf mutig, Veteran 160, Veteran 400.

---

## 1 · Die Überlebensprogression ist flach *(gemessen, größte offene Frage)*

**Stand nach sechs Kapiteln** — die Erstläufe je 80 Läufe, die Veteranen je 40:

| | überlebt | höchster Rang (Cpt) |
|---|---|---|
| Erstlauf vorsichtig | 19 % | 9 % |
| Veteran 160 | 15 % | 33 % |
| Veteran 400 | 25 % | 38 % |

**Beim Rang trägt der Abstand (29 Punkte). Beim Überleben nicht (6 Punkte).** Die eigene Regel verlangt 25. Der Veteran mit 160 VP liegt sogar unter dem Erstläufer — bei n=40 gegen n=80 ist das innerhalb des Rauschens, aber die Richtung stimmt seit zwei Kapiteln.

**Der Mechanismus ist gemessen, nicht geraten, und steht in der Rangverteilung:** Vom Veteranen mit 160 VP sind **53 % Offiziere** (Rang 7–9), vom Erstläufer **20 %**. Die Offiziersränge sind die gefährlichsten des Spiels.

**Zwei Hebel, beide dokumentiert, keiner gemessen:**

| Hebel | Wo | Warum verdächtig |
|---|---|---|
| **Rangzuschlag +4/+5** | `kampfAktion()` in `src/kampf.js`, RANGLEITER §8 | Ein Fusilier steht bei Jena auf Gefahr 19, ein Capitaine auf 24 — im selben Gefecht |
| **Ereignis-Schwelle Ruf 30** | `ereignisWuerfeln()` | Sie stammt aus der Zeit, als der Sergent die Decke war. Heute liegt **jeder** Offizier weit darüber, also hat jedes Veteranengefecht drei Ereignisse statt zwei. Dieselbe Alterung wie bei der Leitzahl „höchster Rang" — eine Schwelle, die einmal getrennt hat und jetzt nur noch durchlässt |

> **Die Frage dahinter ist eine Entwurfsfrage, keine Zahlenfrage:** „Wer aufsteigt, kauft sich nicht in Sicherheit ein" ist ausdrücklich gewollt. Nur darf es nicht so stark sein, dass Veteranenpunkte für das Überleben nichts mehr kaufen — dann bricht die Schleife, auf der das ganze Spiel beruht. **Wer das anfasst, entscheidet zuerst, welche der beiden Aussagen Vorrang hat.**

---

## 2 · Der Veteran mit 400 VP war einmal schlechter als der mit 160

**Gemessen nach Kapitel 5:** 23 % gegen 53 %, je 40 Läufe — über vier Standardabweichungen. **Nach Kapitel 6 ist es umgekehrt** (25 gegen 15 %), also möglicherweise erledigt oder möglicherweise Rauschen bei n=40.

**Der Verdacht bleibt eine Bot-Heuristik:** Der Bot bewertet Szenenwahlen nach dem Abstand `Wert − Schwierigkeit` und zieht für riskante 20 ab. Bei sehr hohen Werten übersteigt eine riskante Wahl auch nach dem Abschlag noch jede sichere — **der reiche Veteran geht mehr Risiken ein, nicht weil es klug wäre, sondern weil die Formel es so ausrechnet.**

**Zu messen ist der Hebel, nicht das Ergebnis:** Wie oft nimmt der 400er-Bot eine `risk`-Wahl gegenüber dem 160er? Erst wenn dieser Zähler gleich ist und die Quote trotzdem auseinanderliegt, ist es das Spiel. Dafür braucht `balance.js` einen Zähler.

---

## 3 · Der Bot kauft keine Ausrüstung — und der Frost misst deshalb den Ausnahmefall

`VETERAN_ZIELE` in `test/balance.js` kennt nur Attribute und Fertigkeiten. Ein Mantel wird nie gekauft, und die einzige Mantelquelle vor Eylau ist eine `risk`-Wahl, die ein vorsichtiger Bot grundsätzlich meidet.

**Gemessen:** Eylau tötet den Veteranen mit 160 VP zu **63 %**, den mit 400 zu **23 %** — der Unterschied ist reine Konstitution gegen eine flache Zehrung. Beide spielen das Kapitel **ohne Mantel**, also durchweg den Fall, für den die Regel gebaut wurde, und nicht den Normalfall eines Menschen.

**Der Hebel ist das Skript, nicht das Spiel: `VETERAN_ZIELE` um Ladenposten erweitern.** Solange das nicht geschehen ist, wird **am Frost nichts gedreht** — sonst repariert man das Spiel gegen eine Blindheit des Messgeräts. Das ist derselbe Fehler wie damals bei der Gunst und der Regimentsschule, nur eine Ebene höher.

---

## 4 · Die Achse „Mut kostet, Mut steigt auf" ist stumpf geworden

Der mutige Erstläufer sollte seltener überleben und **öfter aufsteigen**. Gemessen nach sechs Kapiteln: überlebt 0 % gegen 19 %, höchster Rang 1 % gegen 9 % — **er steigt nicht mehr öfter auf, er stirbt nur früher.** Von 80 mutigen Läufen sterben 59 in Ägypten.

**Die Achse ist damit vor dem Ort erstickt, an dem sie tragen soll.** Zwei Möglichkeiten, beide ungemessen:

- Der mutige Weg braucht wieder einen Ertrag, der die höhere Sterblichkeit aufwiegt (Ereignisse geben mehr Ruf).
- Oder die Achse verlagert sich nach oben, wo Aufträge und Ereignisse sie tragen — dann ist die Erstlauf-Messung dafür schlicht das falsche Messgerät, und man misst sie beim Veteranen.

---

## 5 · Der Linien-Hebel der Feindgüte ist seit Ägypten gesättigt

```
linie = (2 + Zufall·4) · max(0,3 ; 1 − guete·0,15)
```

Der Boden 0,3 wird bei **Güte 4,67** erreicht. Ägypten (5), Austerlitz (6), Jena (7), Eylau (8) und Spanien (8) haben damit **denselben** Linien-Hebel — und alle künftigen Kapitel bis Güte 12 ebenfalls. Der als „wichtigster Hebel" beschriebene Teil der Güte trennt nur die Werte 0 bis 4.

**Nicht zu reparieren, sondern zu wissen:** Der Boden hält die späten Kapitel rechnerisch gewinnbar; ihn zu senken hieße, die beiden gemessenen Kapitel neu zu eichen. **Ab Güte 5 eskaliert die Güte über Gefahr (+1 je Punkt) und eigene Verluste (+15 % je Punkt), nicht mehr über die Linie.** Für die Kapitel 8 bis 11 heißt das: Was ein spätes Kapitel hart macht, muss aus seiner eigenen Regel kommen.

---

## 6 · Zwei Szenen in Kapitel 4 haben keine probefreie Wahl

`marsch_rhein` und `donau` in `kapitel04_austerlitz.js`. Ein Mann mit durchgelaufenen Schuhen (`wert('konstitution')` −18) steht dort vor lauter gesperrten Knöpfen und landet auf dem Notausgang `szeneAushalten()`.

**Der Notausgang fängt es ab, aber er ist die Sicherung und nicht die Lösung.** Beide Szenen gehören um eine Wahl ohne Probe ergänzt — eine, die das ist, was die meisten wirklich getan haben.

---

## 7 · Der Überlebensbonus in `wertung()` ist ein Platzhalter

Er steht auf **25**. KONZEPT §5 sieht gestaffelte **180 / 120 / 70** vor — aber die ergeben erst Sinn, wenn es den **freiwilligen Ausstieg an den Rangschranken** gibt, denn dann ist die Höhe des Bonus die Belohnung dafür, rechtzeitig aufzuhören.

**Fällig mit Kapitel 8** (Russland trägt die erste Schranke). Wer den Ausstieg baut, ersetzt dort die 25.

---

## Erledigt

| Punkt | Wie geschlossen | Messwert |
|---|---|---|
| Die Leitzahl „höchster Rang" misst den Sergent-major, während ein Drittel der Läufe ein Patent erreicht | `LEITRANG` in `test/balance.js`, auf Rang 9 (Capitaine) umgestellt und dort dokumentiert, dass er mit dem Ausbaustand wandert | Rang 9 erreichen 9 / 1 / 33 / 38 % |
| Der Bot nahm auf der Tempowahl immer „schonend" | `f(/^Forcieren/)` traf nie — `textContent` beginnt mit dem Zeilenumbruch aus dem Markup | — |
| Der Bot forcierte bei halbem Blut und drehte damit die Progression um | Bedingung auf `Blut > 80 %, Atem > 70, Schuhe ≥ 40` verschärft | Veteran 160: 13 → 53 % |
| Eine Szene konnte ohne drückbaren Knopf dastehen | Regel (jede Szene braucht eine probefreie Wahl) plus Sicherung `szeneAushalten()` | — |
| Der Nahkampf feuerte bis Rang 14 statt bis Rang 9 | `rang >= 7 && rang < 10` in `nahkampfPruefen()` | — |
| `kampfEnde()` arbeitete auf den Kapiteldaten statt auf einer Kopie | `Object.assign({}, …)` — sonst hätte `ueberfall` die Niederlagen-Wirkung dauerhaft verändert | — |
