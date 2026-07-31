# Offene Punkte

**Ein Ort für alles, was gemessen, aber nicht entschieden ist.** Bis Kapitel 6 lagen diese Befunde über `CLAUDE.md` verstreut, jeder im Abschnitt seines Fundorts — und damit fand sie nur, wer ohnehin dort las. Hier stehen sie zusammen, in der Reihenfolge, in der sie angefasst gehören.

**Regeln für diese Datei:**

1. **Kein Punkt ohne Zahl.** Wer etwas einträgt, schreibt dazu, woran man es gemessen hat. Ein Verdacht ohne Messwert gehört in `KONZEPT.md`, nicht hierher.
2. **Kein Punkt ohne Hebel.** Es muss dastehen, an welcher Zeile man drehen würde — sonst ist es ein Gefühl.
3. **Erledigte Punkte werden nicht gelöscht, sondern nach unten verschoben** und mit dem Messwert versehen, der sie geschlossen hat. Das Protokoll ist der halbe Wert.
4. **Wer einen Punkt anfasst, misst gegen die Zahlen** aus `CLAUDE.md` („Die zwei Leitzahlen"): Erstlauf vorsichtig, Erstlauf mutig, **Veteran mit `VP=5800`**. *(Bis zum 30.07.2026 waren das 160 und 400 VP — seit der Verfünffachung der Wertung ist ein Vierhunderter nicht mehr der Veteran, den das Spiel hervorbringt, sondern der aus dem zweiten Lauf.)*

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

## 2 · ✓ Entschieden: es ist die Bot-Formel, nicht das Spiel

> **Geschlossen am 30.07.2026 mit dem `risk`-Zähler** (`balance.js` druckt jetzt „Riskante Wahlen: n von m"). Der Verdacht stand seit Tagen und war richtig:
>
> | Bot | riskante Wahlen |
> |---|---|
> | Erstlauf, vorsichtig *(80 Läufe)* | **1 %** (153 von 10 973) |
> | Erstlauf, mutig *(80)* | 6 % (541 von 8 462) |
> | **Veteran 5800 VP** | **38 %** (411 von 1 086) |
>
> **Der reiche Veteran geht achtunddreißigmal so oft ins Risiko wie der vorsichtige Erstläufer — und zwar nicht, weil es klug wäre.** Der Bot bewertet Szenenwahlen nach dem Abstand `Wert − Schwierigkeit` und zieht für riskante 20 ab. Bei Werten über 70 übersteigt eine riskante Wahl auch nach dem Abschlag noch jede sichere, also nimmt er sie fast immer. Ein Mensch mit Konstitution 85 riskiert eine Wunde nicht deshalb, weil er sie sich leisten kann.
>
> **Damit ist die frühere Beobachtung erklärt** („der 400er überlebte seltener als der 160er"): Es war kein Balance-Befund, sondern der Bot. Wer die Heuristik anfasst, misst gegen genau diese drei Zahlen — der Abschlag müsste mit dem Wert wachsen, nicht fest bei 20 stehen.
>
> **Nicht geändert, und das ist Absicht.** Ein Bot, der Risiken meidet, misst das Strafsystem und nicht das Spiel (Regel 9). Solange die Zahl *danebensteht*, ist sie kein Fehler mehr, sondern eine bekannte Eigenschaft der Messung.

### Der ursprüngliche Befund

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
| ~~`legion_grand` — der Bruststern~~ | **✓ Gebaut am 30.07.2026.** Er musste es: Rang 13 forderte ihn, also waren 13 und 14 verschlossen — und die ganze VP-Ökonomie war gegen eine Decke geeicht, die niemand erreicht |
| `saint_henri` — der zweite fremde Orden | KONZEPT §5 hält den Platz frei („höchstens zwei gewertet"). Gehört an ein Kapitel, das ihn verdient — Preußen oder Spanien |
| **Schnallen** im Band, je Nennung eine mit Ort und Jahr | Ein neues Feld `S.schnallen = [{ort, jahr}]`. Der Ort eines Gefechts wird bisher nirgends mitgeschrieben |
| Die Ehrenwaffe als **Gegenstand** statt als Zeichen | `mann.waffe` gibt es nicht. Historisch war die Ehrenwaffe eine Muskete, die man trug — im Spiel ist sie ein Eintrag im Livret |

**Wer die höheren Ordensgrade baut, macht die ersten beiden in einem Zug** — die Zeichnungen liegen in `entwurf/`, und `ordensbild()` hat für beide Formen (Kreuz am Band, Bruststern) schon die Bausteine.

---

## 8 · ✓✓ Erledigt: die Zwei-Würfe-Probe — überführt und ersetzt

> **Geschlossen am 30.07.2026.** Der Wurf mittelt jetzt **sechs** Würfe statt zwei, und der Sockel steht auf 60 statt 50 — der Umbau ist damit über den hier beschriebenen Befund hinausgegangen: Nicht einer der drei Wege unten wurde genommen, sondern beide Regler wurden neu gesetzt (siehe `AENDERUNGEN.md`, „Der Umbau"). **Der Befund selbst bleibt stehen, weil sein Lehrsatz gilt und weil der Messweg der beste ist, den dieses Projekt hat.**
>
> **Der Erstläufer hat davon nichts zurückbekommen — die Weite steht weiterhin bei 31.** Das ist inzwischen Absicht: Die Ansage lautet *„Am Anfang muss man sich nutzlos fühlen"*, und ein enger Wurf liefert genau das. Was der Umbau löst, ist die andere Hälfte: Der Veteran geht jetzt durch (Weite 163 von 163).

### Der ursprüngliche Befund

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

**Und dieselbe Messung beweist die Asymmetrie vom anderen Ende.** Derselbe Commit-Vergleich mit einem Veteranen (400 VP, je 40 Läufe) läuft **umgekehrt**:

| Veteran 400 VP · je 40 Läufe | ein Wurf (`52211b0^`) | **zwei Würfe** (`52211b0`) |
|---|---|---|
| Weite | 61 | **70** |
| Ägypten überstanden | 50 % | **70 %** |
| Austerlitz überstanden | 90 % | **100 %** |

**Dieselbe Zeile Code hilft dem Veteranen und halbiert den Erstläufer** — Weite 61 → 70 hier, 70 → 31 dort. Das ist der Beweis, dass es keine gleichmäßige Verschärfung ist, sondern eine Verlagerung entlang der Skala: Wer oben wohnt, gewinnt an Verlässlichkeit; wer unten wohnt, verliert an Trefferchance. (Die Capitaine-Quote des Veteranen — 38 → 28 % — bewegt sich bei n = 40 im Rauschen und trägt hier nicht.)

**Und die Quelle der 58 reproduziert sich auf den Punkt.** `0aae610` (der Commit, der die 58 einst lieferte, 8 Kapitel, Ein Wurf) mit dem heutigen Prüfstand gemessen: **Weite 58 von 122**, Ägypten 57 %, Caporal 43 %. Der Prüfstand ist also nicht der Verdächtige — die 58 war echt, und sie stammt aus der Ein-Wurf-Zeit.

> **Der dokumentierte Satz war falsch, und das ist der eigentliche Lehrsatz.** In CLAUDE.md steht: *„keine einzige Schwierigkeit in den Kapiteldaten musste angefasst werden — es sind die Ränder, die sich bewegen."* Die Ränder sind aber nicht symmetrisch bewohnt: **Der Veteran lebt am oberen Rand, der Erstläufer am unteren, und nur einer von beiden hat etwas gewonnen.** Eine Verteilungsänderung, die „die Mitte unberührt lässt", ist keine neutrale Änderung, solange die Spieler nicht in der Mitte stehen.

**Entschieden ist nichts, und das ist Absicht** — die Klage, die den Wurf ausgelöst hat, war berechtigt („manchmal schafft man eine Probe mit dem doppelten Wert nicht"), und die zwei Würfe lösen sie. Drei Wege, alle ungemessen:

| Weg | Was er tut | Was er kostet |
|---|---|---|
| **Schwierigkeiten senken** | Die Kapiteldaten um 5–10 nachziehen, damit der Zielwert des Erstläufers wieder dort liegt, wo er gedacht war | Viel Fläche: 11 Kapitel, 157 Stationen. Und die Eichung „Wert 40 gegen Schwierigkeit 40 ist ein Münzwurf" wandert |
| **Den Wurf abmildern** | Statt des Mittels aus zwei Würfen ein gewichtetes Mittel (z. B. 0,7 × ein Wurf + 0,3 × Mittel) — die Streuung schrumpft weniger stark | Eine Zeile, eine Messung. Nimmt aber auch vom Gewinn des Veteranen zurück |
| **Den Sockel heben** | Sockel 15 → 20 zurück, damit der Erstläufer nicht am untersten Rand der Skala startet | Widerspricht „früher sterben, länger leben" (`0aae610`), das der Entwickler ausdrücklich so wollte |

**Wer daran dreht, misst gegen die Tabelle oben** — dieselben zwei Worktrees liegen als Messweg beschrieben da und sind in zehn Minuten wieder aufgesetzt.

---

## 9 · Das Sieb ist schwächer geworden, und der Erstläufer kommt zu weit *(neu gemessen 31.07.2026)*

> **⚠ Die Zahlen dieses Punktes haben sich bewegt, und zwar in die falsche Richtung.** Gemessen mit demselben Prüfstand, 80 Läufe, null Abbrüche:
>
> | | 30.07. | **31.07.** |
> |---|---|---|
> | **Weite** | 32 von 163 | **60 von 163** |
> | Ägypten überstanden | 38 % | **54 %** |
> | sterben in Ägypten | 47 von 80 | **35 von 80** |
> | Patent erreicht (Rang 7+) | 26 % | **40 %** |
> | Punkte-Median | 462 | 502 |
>
> **Das Sieb ist breiter geworden — Ägypten 35, Spanien 9, Eylau 9, Russland 8, Jena 8, Austerlitz 7 —, aber es siebt insgesamt zu wenig.** Der Trichter hat jetzt die Form, die Punkt 9 verlangt hat, und liegt dabei zu tief: Jeder Zweite wird Sergent, zwei von fünf bekommen ein Patent. Das widerspricht der Ansage *„relativ nutzlos, bzw. ziemlich sicher sterben"*.
>
> **Woran es liegt, ist ungemessen und darf nicht geraten werden.** Zwischen beiden Messungen liegen die sieben Verwaltungssitzungen, der Schreibtisch, die Feuille d'enrôlement, die reifenden Unterstellten und die Verschlankung des Lagers. Erster Verdacht ist die Verschlankung — weniger Lagerknöpfe heißt für einen Bot, der nach Abstand rechnet, seltener eine schlechte Wahl. **Der Messweg steht in der eigenen Regel:** Worktree auf `289fa9f`, **denselben** Prüfstand hinein, 80 Läufe, dann vergleichen. Gegen eine Zahl von vorgestern zu vergleichen ist bei einem Projekt, das gleichzeitig Inhalt und Regeln ändert, wertlos.

**Der ursprüngliche Befund vom 30.07.2026, für die Einordnung:**

| | |
|---|---|
| **Weite** | **32 von 163** |
| sterben in Ägypten | **47 von 80** |
| bleiben zeitlebens Fusilier | **33** |
| erreichen ein Offizierspatent (Rang 7+) | **21 (26 %)** |
| erreichen den Colonel | **1** — denselben Rang wie der Maximalveteran |
| Punkte | Median 462 · **Bereich 0–4 348** |

**Zwei Zahlen, die sich zu widersprechen scheinen: Caporal 59 % bei einer Weite von 32.** Beide stimmen — sie beschreiben zwei verschiedene Männer. Der mittlere Lauf stirbt in Ägypten; wer Ägypten übersteht, wird Offizier.

**Denn dazwischen liegt fast nichts:**

| Kapitel | überstanden *(von denen, die es erreichen)* |
|---|---|
| Italien | 95 % |
| **Ägypten** | **38 %** |
| Garnison | 100 % |
| Austerlitz | 86 % |
| Jena | 80 % |
| Eylau | 70 % |

**Ägypten ist keine Stufe, sondern ein Sieb.** Es entscheidet den Lauf, und danach entscheidet kaum noch etwas. Die Spitze eines Erstlaufs liegt bei **4 348 Punkten** — 92 % dessen, was ein Maximalveteran mit 5 800 VP holt. **Ein Erstläufer, der Ägypten übersteht, ist kein Anfänger mehr, sondern ein zweiter Veteran.**

> **Das ist die schärfere Fassung des früheren Befundes.** Er lautete „der Erstläufer klettert zu schnell" und stimmte, war aber die halbe Wahrheit: Er klettert nicht durchgehend zu schnell, sondern **er wird an genau einer Stelle sortiert**, und danach ist alles entschieden. Eine Progression, die aus einem einzigen Wurf besteht, ist keine.

| Hebel | Wo | Was er kostet |
|---|---|---|
| **Die Härtekurve früher ansetzen** *(empfohlen)* | `schwierigkeit:` je Kampagne in `grundwerte.js` — Italien **+0**, Ägypten **+4** | Sie greift genau dort am schwächsten, wo der Erstläufer lebt und stirbt. Wer sie über die ersten drei Kapitel verteilt, verteilt auch die Sterblichkeit — **und ein Trichter, der verteilt ist, hat eine Mitte** |
| **Ägypten entschärfen** | `anmarschKosten`, Hitzschlag, Ruhr, Fieber aus Jaffa | Nimmt dem Kapitel seine eigene Regel („Krankheit ist gefährlicher als Kugeln"). **Der falsche Hebel** — das Kapitel ist nicht zu hart, die anderen sind zu weich |
| **Die Ruf-Schwellen unten anheben** | `LEITER`, Rang 3 steht bei 30 | Trifft den Aufstieg, nicht die Sortierung. Behandelt das Symptom |
| ~~Den Fertigkeiten-Sockel senken~~ | `FERT_SOCKEL` | **Nicht der Hebel.** Er ist gesetzt und gehört zur Skala |

> **Der Prüfpunkt ist nicht die Weite, sondern die Form der Verteilung.** Wer die Härtekurve anhebt, misst die Zeile „Überstanden je Kapitel": Sie soll flacher werden — kein Kapitel unter 60 %, keines über 95 %. **Bleibt ein einzelnes Kapitel bei 38 %, während die anderen bei 80 stehen, hat sich nur der Ort des Siebs verschoben.**

## 10 · Was „Generalskampagne" heißt — zwei Entwürfe sagen Verschiedenes

**Rang 14 verlangt `S.generalskampagne`. Das Feld wird an zwei Stellen gelesen und an keiner einzigen gesetzt** (`schwellenStimmen()` und `fehltWas()` in `kampf.js`). Der Marschall ist damit nicht schwer, sondern per Konstruktion unmöglich — dieselbe Lage, in der Rang 13 bis zum 30.07.2026 war, als ihm der Grand Officier fehlte.

**Und die beiden Quellen meinen nicht dasselbe:**

| Quelle | Was `generalskampagne` heißt |
|---|---|
| `KONZEPT.md` §9 | **Eigenständige Szenarien** — Wagram 1809, Leipzig 1813, Waterloo 1815, je 30–60 Minuten, rein auf der Operationsebene, mit eigener Wertung und eigenem Chronikeintrag. Rang 12 schaltet sie dauerhaft frei (`META.generalskampagnen`, gebaut und in Betrieb) |
| **Ansage des Entwicklers, 30.07.2026** | Eine **Zeitschranke**: *„man wird frühestens drei Kampagnen vor Schluss zum Marschall"* — also nicht vor Kapitel 9 (Deutschland 1813) |

**Nicht aufgelöst, weil beides gebaut werden kann und die Entscheidung nicht am Code hängt.** Zwei Beobachtungen dazu:

1. **Die zwei Flags werden leicht verwechselt.** `META.generalskampagnen` (dauerhaft, über alle Läufe, von Rang 12 gesetzt) und `S.generalskampagne` (je Lauf, von niemandem gesetzt) sehen fast gleich aus und bedeuten Verschiedenes. Wer eines von beiden baut, benennt das andere um.
2. **Die Zeitschranke ist die Fassung, die der Invariante näher steht.** Sie fordert nichts, was es nicht gibt, und sie hält den Ton: *„Sechsundzwanzig in zwölf Jahren, unter Hunderttausenden."* Ein Szenario, das man abhaken kann, wäre eine Bedingung; drei Feldzüge vor Schluss ist eine Aussage über den Krieg.

| Hebel | Was er tut |
|---|---|
| **Zeitschranke** *(näher an der Invariante)* | `generalskampagne` durch eine Kapitelmarke ersetzen — Rang 14 frühestens ab Kapitel 9. Eine Zeile, und der Stab bleibt die Legende, die er im Text ohnehin ist |
| **Die Szenarien bauen** | Die aufwendige Antwort. `META.generalskampagnen` steht bereit; es fehlt der ganze Szenariomodus |

**Solange die oberste Stufe fehlt, ist jede Eichung der Kostenkurve vorläufig:**

| Erreichbare Decke | Ein perfekter Lauf bringt |
|---|---|
| Rang 9 · Capitaine | 3 945 VP |
| Rang 12 · Général de brigade | 4 960 VP |
| Rang 13 · Général de division | 5 370 VP |
| **Rang 14 · Maréchal** | **ungerechnet** |

Das Ziel *„alles auf 70+"* kostet 4 950 VP.

---

## 11 · ✓ Erledigt: Die Decke bei Colonel ist gefallen

**Gemessen am 31.07.2026, `VP=5800`, 40 Läufe, vorsichtig — gegen die Zahlen, die hier vorher standen:**

| | vorher | **jetzt** |
|---|---|---|
| Rangverteilung | **11 Col 40** — alle vierzig | **11 Col 7 · 12 GdB 8 · 13 GdD 4 · 14 Mar 21** |
| Ganz durch | 98 % | **78 %** |
| Weite | 163 | 163 |
| Punkte | Median 4 728 | **Median 6 046** |

**Beide Teilbefunde sind erledigt, und zwar von verschiedenen Änderungen.**

**a) Die Decke** lag nicht an einer zu hohen Schwelle, sondern an vier Sperren in Reihe (siehe `CLAUDE.md`, „Vier Sperren hintereinander") — zuletzt daran, dass Rang 14 ein Feld verlangte, das nirgends gesetzt wird. Die **Protektion eines Marschalls** hat es ersetzt: Der Marschallstab hängt jetzt an einem Mann, den man sich mit Colonel aussucht. **Der Maximalveteran erreicht ihn in 21 von 40 Läufen.**

**b) „Kein Widerstand mehr"** ist mit 78 % statt 98 % erledigt. Er stirbt jetzt — Russland lässt ihn zu 85 % durch, Frankreich zu 94 % —, und 27 % seiner Wahlen sind riskante.

> **✓ Entschieden am 31.07.2026: 53 % Marschall bleiben so.** *(„Punkt 47 passt so, das ist in Ordnung.")* Die Zahl gilt für den **Maximalveteranen** — den Vorrat eines vollkommenen Laufs —, und für den soll der Marschallstab erreichbar sein, ohne sicher zu sein. Der historische Vergleich (sechsundzwanzig in zwölf Jahren) trägt hier nicht: Er zählt Menschen, die Quote zählt Läufe eines Spielers, der schon alles hinter sich hat. **Nicht mehr anfassen, außer die Ökonomie darüber ändert sich** — dann ist `patronMacht` der Hebel, nicht die Ruf-Schwelle.

---

## 12 · ✓ Erledigt: Welche Schranke bindet — jetzt lesbar statt geraten

**Die verlangte Zeile ist gebaut** und liest inzwischen das Richtige. Die erste Fassung fragte `gunst('grandmaison')` — **ein Name statt einer Rolle**, und damit den Falschen: Grandmaison beurteilt bis Rang 11, seit der Protektion entscheidet ab 12 der gewählte Marschall. Gemeldet wurde `Grandmaison 3 · 20 % erfüllt`, während 33 von 40 Läufen Rang 12 überschritten hatten.

Beurteiler, Sprosse und Schwellen kommen jetzt aus der `LEITER`; gezählt werden nur Läufe, die noch eine Sprosse vor sich hatten. Damit trägt die Zeile jeden Ausbaustand:

```
Erstläufer      Rang  3 · Ruf 10/30 33 % · Martel 4/4 50 %
Maximalveteran  Rang 14 · Ruf 859/680 100 % · Davout 5/5 50 % · Bulletins 6/5 100 %
```

> **Die Antwort auf die ursprüngliche Frage:** Es war **nie der Ruf** — der ist an jeder gemessenen Sprosse zu 100 % erfüllt. Es ist immer die **Fürsprache**. Das gilt unten wie oben, vom Caporal bis zum Marschall, und es ist genau das, was Invariante 5 verlangt.

---

## 13 · Die Mitte ist da — und sie ist die belastbarste Zahl des Projekts

**Zum ersten Mal ist ein *dritter* Bot gemessen worden** (`VP=1500`, 40 Läufe), und er füllt genau die Lücke, um die es in Punkt 9 und 11 ging:

| | Erstlauf (80) | **Mitte 1 500 VP (40)** | Maximum 5 800 VP (40) |
|---|---|---|---|
| **Weite von 163** | 60 | **93** | 163 |
| **Capitaine** | 6 % | **55 %** | 100 % |
| höchster Rang | 9 Cpt | **11 Col** | 14 Mar |
| Punkte-Median | 502 | **1 849** | 6 046 |

Seine Rangverteilung ist die einzige im Projekt, die sich wirklich verteilt: **5 Serg 4 · 7 S-Lt 10 · 8 Lt 4 · 9 Cpt 19 · 11 Col 3.** Er stirbt über sechs Kapitel verstreut, seine Punkte spannen von 482 bis 2 908, und Spanien (47 %) wie Russland (0 von 7) sind für ihn echte Wände.

> **Was daraus folgt: Der mittlere Bot gehört in die Regelmessung.** Zwei Bots messen die Enden, und beide Enden sind flach — der eine kommt fast immer durch, der andere fast nie weit. **Die Mitte ist die Zahl, an der man eine Änderung überhaupt sieht.** Kostet 40 Läufe zusätzlich.

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
| Der Schadensbonus über der Klemme (`koennen`/`meister()`) | Ersatzlos entfernt — *„Schwachsinn"*. An seine Stelle tritt `kampagnenHaerte()`: Der Wert kauft weiterhin Trefferchance, nur wird die Aufgabe mit jedem Feldzug schwerer | **Wert 80 ist 1796 überflüssig und 1812 gerade genug** |
| Gleich guter Wert wie Aufgabe war ein Münzwurf | Sockel 50 → **60** und der Wurf mittelt **sechs** statt zwei Würfen | Gleichstand 50 → **80 %**; „8 gegen 40" 29 → **3 %** |
| Der Deckel bei Attribut 70 / Fertigkeit 60 machte das erklärte Ziel unerreichbar | Ein Deckel für alles: **100**. Die Bremse ist jetzt allein der Preis (`PRO_PUNKT` bis 60 VP je Punkt) | „Alles auf 70" kostet **4 950 VP**, ein perfekter Lauf bringt 4 960–5 370 |
| Die Ruf-Leiter endete bei 300, angekommen wird mit 688 | Über die volle Strecke gespannt: 45 / 60–70 / 100 / 145 / 195 / 255 / 325 / 400 / 480 / 570 / **680** | Nach gut der halben Kampagne war die Leiter vorher aufgebraucht |
| Die Fürsprache des Auftrags ging hart an Vernet | `beurteiler()` liefert den Patron des **nächsten** Leitereintrags — die Rolle, nie ein Name | **40 von 40** Maximalveteranen blieben Capitaine, einer mit Ruf 748 und Grandmaison 1 |
| Fünf Kapitel hatten zu wenige Musterungen, Waterloo gar keine | Sechs Stationen dazu, **zwei je Feldzug**; dazu Feldbeförderung bis Rang 6 direkt nach dem Gefecht | Ein Mann mit erfüllten Schwellen stand bei Station 156 daneben |
| Der Bot nahm auf der Tempowahl immer „schonend" | `f(/^Forcieren/)` traf nie — `textContent` beginnt mit dem Zeilenumbruch aus dem Markup | — |
| Der Bot forcierte bei halbem Blut und drehte damit die Progression um | Bedingung auf `Blut > 80 %, Atem > 70, Schuhe ≥ 40` verschärft | Veteran 160: 13 → 53 % |
| Eine Szene konnte ohne drückbaren Knopf dastehen | Regel (jede Szene braucht eine probefreie Wahl) plus Sicherung `szeneAushalten()` | — |
| Der Nahkampf feuerte bis Rang 14 statt bis Rang 9 | `rang >= 7 && rang < 10` in `nahkampfPruefen()` | — |
| `kampfEnde()` arbeitete auf den Kapiteldaten statt auf einer Kopie | `Object.assign({}, …)` — sonst hätte `ueberfall` die Niederlagen-Wirkung dauerhaft verändert | — |
| **Der Bot fand das Lager nicht mehr** und ging ungeruht in jedes Gefecht | Er verzweigte auf `txt.includes('VERBLEIBENDE ABENDE')`; der Stationsbogen machte daraus „Verbleibend 3 von 3". Jetzt `LAUF.lager.id` und `LAUF.winter.ort` — **Zustand statt Fließtext**, dritter Fund derselben Art | Weite **28 statt 58**, **Caporal 0 % von 80**, Punkte-Median 20 statt 44 |
