# Offene Punkte

**Ein Ort für alles, was gemessen, aber nicht entschieden ist.** Bis Kapitel 6 lagen diese Befunde über `CLAUDE.md` verstreut, jeder im Abschnitt seines Fundorts — und damit fand sie nur, wer ohnehin dort las. Hier stehen sie zusammen, in der Reihenfolge, in der sie angefasst gehören.

**Regeln für diese Datei:**

1. **Kein Punkt ohne Zahl.** Wer etwas einträgt, schreibt dazu, woran man es gemessen hat. Ein Verdacht ohne Messwert gehört in `KONZEPT.md`, nicht hierher.
2. **Kein Punkt ohne Hebel.** Es muss dastehen, an welcher Zeile man drehen würde — sonst ist es ein Gefühl.
3. **Erledigte Punkte werden nicht gelöscht, sondern nach unten verschoben** und mit dem Messwert versehen, der sie geschlossen hat. Das Protokoll ist der halbe Wert.
4. **Wer einen Punkt anfasst, misst gegen die vier Zahlen** aus `CLAUDE.md` („Die zwei Leitzahlen"): Erstlauf vorsichtig, Erstlauf mutig, Veteran 160, Veteran 400.

---

## 1 · Die Überlebensprogression ist flach *(gemessen, größte offene Frage)*

**Stand nach acht Kapiteln** — Erstlauf 80 Läufe, die Veteranen je 40, alle vorsichtig:

| | **Weite** (von 122) | höchster Rang (Cpt) |
|---|---|---|
| Erstlauf ohne Vorrat | **57,3** | 11 % |
| Veteran 160 | **61,9** | 30 % |
| Veteran 400 | **60,6** | 38 % |

**Der Rang trägt (27 Punkte), die Weite nicht (vier Stationen von 122).** Der Vierhunderter liegt sogar unter dem Hundertsechziger — das ist Rauschen, keine Progression.

> **Damit ist der Befund schärfer als nach Kapitel 6, nicht nur neuer.** Vorher stand da eine flache Überlebensquote, die man als Trichterwirkung lesen konnte. Jetzt steht daneben eine flache **Weite** — und die ist von der Trichterwirkung unabhängig, weil sie ein Median ist. **Wer mit Vorrat einrückt, kommt nicht weiter, sondern höher.**

**Der Mechanismus ist gemessen, nicht geraten, und steht in der Rangverteilung:** Vom Veteranen mit 160 VP sind über die Hälfte Offiziere (Rang 7–9), vom Erstläufer ein Fünftel. Und die Offiziersränge tragen **+4 bis +5 Gefahr je Runde** gegen +2 beim Unteroffizier und 0 bei der Mannschaft. Der Veteran tauscht seine Punkte gegen Epauletten, und die Epauletten zahlt er mit dem Leben zurück.

**Drei Hebel, keiner gemessen:**

| Hebel | Wo | Warum verdächtig |
|---|---|---|
| **Was ein Mann behält** — fünf Gewohnheiten im Laden | `art:'zaeh'` in `LADEN`, Wirkung in `verschleiss()` · `stationErledigt()` · `aderlass()` · `frostWirken()` · `kampfEnde()` | **Gebaut, Messung läuft.** Sie wirken nur auf die Zermürbung zwischen den Gefechten und können die Ruf-Kette deshalb nicht füttern. Der Prüfpunkt ist nicht, ob die Weite steigt, sondern ob sie steigt, **ohne dass die Rangverteilung mitwandert** |
| **Eine Progression, die im Lauf wirkt** | Sockel senken · Konstitution wächst am `uebergang` und nach überstandener Krankheit (Aufgabe #31) | Belohnt den Überlebenden statt den Käufer und rührt Invariante 3 nicht an. Der zweite Versuch, falls die Gewohnheiten allein nicht tragen |
| **Rangzuschlag +4/+5** | `kampfAktion()` in `src/kampf.js`, RANGLEITER §8 | Ein Fusilier steht bei Jena auf Gefahr 19, ein Capitaine auf 24 — im selben Gefecht |
| **Ereignis-Schwelle Ruf 30** | `ereignisWuerfeln()` | Sie stammt aus der Zeit, als der Sergent die Decke war. Heute liegt **jeder** Offizier weit darüber, also hat jedes Veteranengefecht drei Ereignisse statt zwei. Dieselbe Alterung wie bei den Leitzahlen — eine Schwelle, die einmal getrennt hat und jetzt nur noch durchlässt |

> **Die Frage dahinter ist eine Entwurfsfrage, keine Zahlenfrage:** „Wer aufsteigt, kauft sich nicht in Sicherheit ein" ist ausdrücklich gewollt. Nur darf es nicht so stark sein, dass Veteranenpunkte für das Überleben nichts mehr kaufen — dann bricht die Schleife, auf der das ganze Spiel beruht. **Wer das anfasst, entscheidet zuerst, welche der beiden Aussagen Vorrang hat.** Der erste Hebel umgeht die Frage, statt sie zu beantworten, und ist deshalb der billigste Versuch.

---

## 2 · Der Veteran mit 400 VP war einmal schlechter als der mit 160

**Gemessen nach Kapitel 5:** 23 % gegen 53 %, je 40 Läufe — über vier Standardabweichungen. **Nach Kapitel 6 ist es umgekehrt** (25 gegen 15 %), also möglicherweise erledigt oder möglicherweise Rauschen bei n=40.

**Der Verdacht bleibt eine Bot-Heuristik:** Der Bot bewertet Szenenwahlen nach dem Abstand `Wert − Schwierigkeit` und zieht für riskante 20 ab. Bei sehr hohen Werten übersteigt eine riskante Wahl auch nach dem Abschlag noch jede sichere — **der reiche Veteran geht mehr Risiken ein, nicht weil es klug wäre, sondern weil die Formel es so ausrechnet.**

**Zu messen ist der Hebel, nicht das Ergebnis:** Wie oft nimmt der 400er-Bot eine `risk`-Wahl gegenüber dem 160er? Erst wenn dieser Zähler gleich ist und die Quote trotzdem auseinanderliegt, ist es das Spiel. Dafür braucht `balance.js` einen Zähler.

---

## 3 · Die Achse „Mut kostet, Mut steigt auf" ist stumpf geworden

Der mutige Erstläufer sollte seltener überleben und **öfter aufsteigen**. Gemessen nach sechs Kapiteln: überlebt 0 % gegen 19 %, höchster Rang 1 % gegen 9 % — **er steigt nicht mehr öfter auf, er stirbt nur früher.** Von 80 mutigen Läufen sterben 59 in Ägypten.

**Die Achse ist damit vor dem Ort erstickt, an dem sie tragen soll.** Zwei Möglichkeiten, beide ungemessen:

- Der mutige Weg braucht wieder einen Ertrag, der die höhere Sterblichkeit aufwiegt (Ereignisse geben mehr Ruf).
- Oder die Achse verlagert sich nach oben, wo Aufträge und Ereignisse sie tragen — dann ist die Erstlauf-Messung dafür schlicht das falsche Messgerät, und man misst sie beim Veteranen.

---

## 4 · Der Linien-Hebel der Feindgüte ist seit Ägypten gesättigt

```
linie = (2 + Zufall·4) · max(0,3 ; 1 − guete·0,15)
```

Der Boden 0,3 wird bei **Güte 4,67** erreicht. Ägypten (5), Austerlitz (6), Jena (7), Eylau (8) und Spanien (8) haben damit **denselben** Linien-Hebel — und alle künftigen Kapitel bis Güte 12 ebenfalls. Der als „wichtigster Hebel" beschriebene Teil der Güte trennt nur die Werte 0 bis 4.

**Nicht zu reparieren, sondern zu wissen:** Der Boden hält die späten Kapitel rechnerisch gewinnbar; ihn zu senken hieße, die beiden gemessenen Kapitel neu zu eichen. **Ab Güte 5 eskaliert die Güte über Gefahr (+1 je Punkt) und eigene Verluste (+15 % je Punkt), nicht mehr über die Linie.** Für die Kapitel 8 bis 11 heißt das: Was ein spätes Kapitel hart macht, muss aus seiner eigenen Regel kommen.

---

## 5 · Zwei Szenen in Kapitel 4 haben keine probefreie Wahl

`marsch_rhein` und `donau` in `kapitel04_austerlitz.js`. Ein Mann mit durchgelaufenen Schuhen (`wert('konstitution')` −18) steht dort vor lauter gesperrten Knöpfen und landet auf dem Notausgang `szeneAushalten()`.

**Der Notausgang fängt es ab, aber er ist die Sicherung und nicht die Lösung.** Beide Szenen gehören um eine Wahl ohne Probe ergänzt — eine, die das ist, was die meisten wirklich getan haben.

---

## 6 · Späte Kapitel sind über `balance.js` nicht mehr messbar

**Der Trichter ist gewollt, aber er macht genau die Kapitel unmessbar, die es am nötigsten hätten.** Von achtzig vorsichtigen Erstläufen erreichen Spanien zwölf und Russland drei; beim Veteranen mit 400 VP sind es acht und drei. Eine Quote aus drei Läufen ist keine Quote — die Zeile „Russland 0 % (nur 3)" sagt über das Kapitel nichts.

**Der Hebel ist der Härtemodus** (`HAERTE=40 node test/kapitel.js <id> 9`, siehe CLAUDE.md): vierzig Männer ab Kapitelanfang, ungeheilt, fester Prüfmann. Er ist gebaut, und er misst jetzt.

**Was damit nicht gelöst ist:** Der Härtemodus misst ein Kapitel *isoliert*. Was er nicht sieht, ist die Wirkung des Kapitels davor — ein Mann, der Spanien mit vier Wunden verlässt, spielt ein anderes Russland als der Prüfmann. **Beide Zahlen gehören nebeneinander gelesen, nicht gegeneinander.**

---

## 7 · Vier Stücke des Ordens-Entwurfs sind gezeichnet, aber nicht gebaut

Aus dem Entwurfspaket, Bündel 5. **Keines davon ist ein Fehler** — sie brauchen alle etwas, das es im Datenmodell noch nicht gibt, und ein Bild ohne dahinterliegenden Orden wäre toter Code.

| Was | Was fehlt dafür |
|---|---|
| `legion_grand` — der Bruststern | Der Grad selbst. **Rang 13 fordert ihn schon** (`orden:'legion_grand'` in `LEITER`) und ist damit unerreichbar, solange er fehlt |
| `saint_henri` — der zweite fremde Orden | KONZEPT §5 hält den Platz frei („höchstens zwei gewertet"). Gehört an ein Kapitel, das ihn verdient — Preußen oder Spanien |
| **Schnallen** im Band, je Nennung eine mit Ort und Jahr | Ein neues Feld `S.schnallen = [{ort, jahr}]`. Der Ort eines Gefechts wird bisher nirgends mitgeschrieben |
| Die Ehrenwaffe als **Gegenstand** statt als Zeichen | `mann.waffe` gibt es nicht. Historisch war die Ehrenwaffe eine Muskete, die man trug — im Spiel ist sie ein Eintrag im Livret |

**Wer die höheren Ordensgrade baut, macht die ersten beiden in einem Zug** — die Zeichnungen liegen in `entwurf/`, und `ordensbild()` hat für beide Formen (Kreuz am Band, Bruststern) schon die Bausteine.

---

## 8 · ✓ Überführt: die Zwei-Würfe-Probe hat den Erstläufer halbiert

**Der Wurf ist der Mittelwert aus zwei Würfen** (`wurfZahl()` in `mechanik.js`, eingeführt in `52211b0`). Gemessen wurde damals die Wahrscheinlichkeitstabelle — **nicht die Wirkung auf die beiden Leitzahlen.** Das ist jetzt nachgeholt, und der Befund ist eindeutig.

**Der Prüfweg, und er ist der Grund, warum die Zahl trägt:** ein Worktree auf `52211b0` und einer auf `52211b0^`, in **beide** derselbe heutige (reparierte) Prüfstand, je 80 Läufe. Zwei benachbarte Commits, also **dieselben 148 Stationen** — die Weite ist damit ohne Umrechnung vergleichbar, und es gibt genau eine Variable.

| Erstlauf ohne Vorrat · je 80 Läufe | ein Wurf (`52211b0^`) | **zwei Würfe** (`52211b0`) |
|---|---|---|
| **Weite** | **70** von 148 | **31** von 148 |
| **Capitaine** | **9 %** | **1 %** |
| Caporal | 44 % | 35 % |
| Sergent | 39 % | 24 % |
| Ägypten überstanden | **58 %** | **42 %** |
| Punkte-Median | **83** | **37** |
| Ø Todesstation | 66,9 | 52,4 |

**Neununddreißig Stationen Weite und acht Punkte Capitaine-Quote.** Bei n = 80 ist σ auf eine 9-%-Quote rund 3,2 Punkte, 9 → 1 % also etwa 2,5 σ; die Weite liegt weit jenseits jeder Rauschgrenze, und der Punkte-Median fällt auf **weniger als die Hälfte**. Das ist die größte Einzelwirkung, die in diesem Projekt je an einer Zeile gemessen wurde.

**Damit ist die ganze Kette erklärt.** Weite 31 steht seit `52211b0` unverändert (`52211b0` 31/148 · `4c749d7` 31/157 · HEAD 31/157) — drei Commits, drei Kapitel und alle Gestaltungsbündel später dieselbe Zahl. Die 58 der Zielwert-Tabelle war nie falsch; sie ist die Zahl aus der Ein-Wurf-Zeit.

**Warum es den Erstläufer so viel härter trifft als den Veteranen:** Er hat Attribute 15–60 und Fertigkeiten 5. Gegen die üblichen Schwierigkeiten 35–50 liegt sein Zielwert bei 25–35, und genau dort ist der Verlust am größten (Zielwert 35: 35 → 24 %, Zielwert 20: 20 → 8 %). Der Gewinn am oberen Ende (80 → 92 %) fällt ihm nie zu — **ein Erstläufer wohnt ausschließlich in der unteren Hälfte der Skala.** Über zwanzig Proben je Kapitel multipliziert sich das.

> **Der dokumentierte Satz war falsch, und das ist der eigentliche Lehrsatz.** In CLAUDE.md steht: *„keine einzige Schwierigkeit in den Kapiteldaten musste angefasst werden — es sind die Ränder, die sich bewegen."* Die Ränder sind aber nicht symmetrisch bewohnt: **Der Veteran lebt am oberen Rand, der Erstläufer am unteren, und nur einer von beiden hat etwas gewonnen.** Eine Verteilungsänderung, die „die Mitte unberührt lässt", ist keine neutrale Änderung, solange die Spieler nicht in der Mitte stehen.

**Entschieden ist nichts, und das ist Absicht** — die Klage, die den Wurf ausgelöst hat, war berechtigt („manchmal schafft man eine Probe mit dem doppelten Wert nicht"), und die zwei Würfe lösen sie. Drei Wege, alle ungemessen:

| Weg | Was er tut | Was er kostet |
|---|---|---|
| **Schwierigkeiten senken** | Die Kapiteldaten um 5–10 nachziehen, damit der Zielwert des Erstläufers wieder dort liegt, wo er gedacht war | Viel Fläche: 11 Kapitel, 157 Stationen. Und die Eichung „Wert 40 gegen Schwierigkeit 40 ist ein Münzwurf" wandert |
| **Den Wurf abmildern** | Statt des Mittels aus zwei Würfen ein gewichtetes Mittel (z. B. 0,7 × ein Wurf + 0,3 × Mittel) — die Streuung schrumpft weniger stark | Eine Zeile, eine Messung. Nimmt aber auch vom Gewinn des Veteranen zurück |
| **Den Sockel heben** | Sockel 15 → 20 zurück, damit der Erstläufer nicht am untersten Rand der Skala startet | Widerspricht „früher sterben, länger leben" (`0aae610`), das der Entwickler ausdrücklich so wollte |

**Wer daran dreht, misst gegen die Tabelle oben** — dieselben zwei Worktrees liegen als Messweg beschrieben da und sind in zehn Minuten wieder aufgesetzt.

---

## Erledigt

| Punkt | Wie geschlossen | Messwert |
|---|---|---|
| Der Bot kaufte keine Ausrüstung, weshalb der Frost durchweg den Ausnahmefall maß | `VETERAN_PLAN` in `test/balance.js` — **eine** Liste, abwechselnd Werte und Stücke | Der 160er kauft jetzt den Mantel und steckt den Rest in Werte; der 400er kauft Mantel, vier Gewohnheiten *und* Werte |
| Die erste Fassung dieser Liste kaufte alle Stücke **vor** allen Punkten | Ein Veteran mit 160 VP gab 135 für Ausrüstung aus und hatte für Konstitution fünfundzwanzig übrig — er lief mit den Attributen eines Erstläufers los. **Kein Mensch kauft so.** Jetzt abwechselnd | Rangquote fiel dadurch 30 → 15 %; die Messung der Gewohnheiten ist damit ungültig und wird wiederholt |
| Der Überlebensbonus in `wertung()` war ein Platzhalter von 25 | Mit der Rangschranke in Kapitel 8 gebaut: `S.ende` trägt jetzt `ruhestand` / `halbsold` / sonst, und `wertung()` staffelt danach **180 / 120 / 70** wie KONZEPT §5 | Rang 5 ausgemustert 326 · Rang 9 geht 469 · Rang 9 marschiert weiter 359 Punkte — **weitermarschieren kostet sofort 110** |
| Der Härtemodus zählte jeden Gefallenen als Überlebenden | `zeigeTod()` nullt `LAUF` und über `binde()` auch `S` — genau wie ein Kapitelende. Unterschieden wird jetzt am Bildschirm, nicht am Zustand | Spanien und Russland meldeten **100 %**, tatsächlich 3 % |
| Der Vollständigkeitsmodus zählte jeden Ausgemusterten als Gefallenen | Er suchte im Schlusstext nach „gefallen" — und der Ruhestandsbildschirm sagt *„Du bist nicht gefallen."* Erkannt wird jetzt am Knopf | Russland: 3 von 4 Rängen falsch als tot gemeldet |
| Der Aderlass war kleiner als die Zeitheilung und tat nichts | Spanien 2 → **4** (hebt die Erholung auf), Russland 4 → **8** (der Vorrat fällt wirklich) | Russlands 4 gegen 4,5 Heilung = **plus ein halber Punkt je Station** |
| Vier Gefechte in Russland standen über der Decke von 22 | Am Hebel ausgelesen: 23 / 29 / 27 / 28. Basiswerte gesenkt auf 20 / 22 / 20 / 22; die Härte steckt jetzt im Aderlass und in Borodinos Länge | Härtemodus vorher wie nachher **3 %** — dieselbe Wand, ehrliche Quelle |
| Die Leitzahl „höchster Rang" misst den Sergent-major, während ein Drittel der Läufe ein Patent erreicht | `LEITRANG` in `test/balance.js`, auf Rang 9 (Capitaine) umgestellt und dort dokumentiert, dass er mit dem Ausbaustand wandert | Rang 9 erreichen 9 / 1 / 33 / 38 % |
| Der Bot nahm auf der Tempowahl immer „schonend" | `f(/^Forcieren/)` traf nie — `textContent` beginnt mit dem Zeilenumbruch aus dem Markup | — |
| Der Bot forcierte bei halbem Blut und drehte damit die Progression um | Bedingung auf `Blut > 80 %, Atem > 70, Schuhe ≥ 40` verschärft | Veteran 160: 13 → 53 % |
| Eine Szene konnte ohne drückbaren Knopf dastehen | Regel (jede Szene braucht eine probefreie Wahl) plus Sicherung `szeneAushalten()` | — |
| Der Nahkampf feuerte bis Rang 14 statt bis Rang 9 | `rang >= 7 && rang < 10` in `nahkampfPruefen()` | — |
| `kampfEnde()` arbeitete auf den Kapiteldaten statt auf einer Kopie | `Object.assign({}, …)` — sonst hätte `ueberfall` die Niederlagen-Wirkung dauerhaft verändert | — |
| **Der Bot fand das Lager nicht mehr** und ging ungeruht in jedes Gefecht | Er verzweigte auf `txt.includes('VERBLEIBENDE ABENDE')`; der Stationsbogen machte daraus „Verbleibend 3 von 3". Jetzt `LAUF.lager.id` und `LAUF.winter.ort` — **Zustand statt Fließtext**, dritter Fund derselben Art | Weite **28 statt 58**, **Caporal 0 % von 80**, Punkte-Median 20 statt 44 |
