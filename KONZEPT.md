# Der Marschallstab — Designdokument

**Ein Karriere-Simulator in der Grande Armée, 1796–1815**
Design-Dokument v3.3 · Stand 27. Juli 2026

> **Neu in v3.3:** **Machtdecke angehoben.** Ein voll ausgebauter Charakter erreicht jetzt in **jedem zweiten Lauf** den Generalsrang statt in jedem fünfundzwanzigsten. Überlebens- und Kompetenzobergrenze neu gesetzt, alle Tabellen nachgerechnet.
> **Aus v3.2:** **Freiwilliger Ausstieg** an beiden Schranken, auch wenn man die Bedingung erfüllt · **gestaffelter Überlebensbonus** (180 / 120 / 70), der den Ausstieg zu einer echten Entscheidung macht — ohne das Punktemaximum von 918 anzutasten.
> **Aus v3.1:** **Rangschranken und vier Enden** — wer nach Russland nicht Rang 7 hat, tritt in den Ruhestand; für Waterloo braucht es Rang 10. Beförderung deutlich verlangsamt, mit einer **Vakanzwelle 1813–15**. Generalsränge werden zur seltenen Freischaltung für eigene **Generalskampagnen** (Abschnitt 9).
> **Aus v3.0:** **Vierzehn Ränge** — zwei Mannschaftsgrade ergänzt, die beide eigene Arbeit leisten: **Grenadier/Voltigeur** als Verzweigung des Kampfstils und **Caporal-fourrier** als erste Stelle, an der Bildung zahlt. Alle Rangschwellen nachgezogen.
> **Aus v2.5:** **Ausrüstungsverantwortung skaliert mit dem Rang** — vom eigenen Schuhwerk bis zu den Magazinen einer Division. Mit **Kompaniekasse**, Inspektionen und dem Konflikt zwischen deiner Ausrüstung und ihrer (Abschnitt 6).
> **Aus v2.4:** **Ausrüstung mit Zustandsverschleiß** (Waffe, Seitenwaffe, Schuhwerk, Mantel, Tornister, Kleinkram) · **Pferd ab Rang 7**, vorgeschrieben ab Rang 10 · **Ordenssystem** mit wiederholbaren Nennungen und fünf Graden der Ehrenlegion samt historischen Pensionen (Abschnitt 6). Maximum steigt auf 918.
> **Aus v2.3:** Kauf **Punkt für Punkt** — nur der Preis springt an jeder Zehnergrenze · Punkteskala entsprechend vergrößert (Maximum 856) · **alle Herkünfte verteilen exakt 50 Punkte**, nur anders gewichtet
> **Aus v2.2:** **Attribute und Fertigkeiten auf einer gemeinsamen Skala 0–100** · Kaufkosten in 10er-Schritten mit steigendem Preis je Punkt · **Charaktererschaffung** mit Verteilungspool festgelegt (Abschnitt 5)
> **Aus v2.1:** Punkteökonomie neu skaliert — nach acht bis zwölf Durchläufen startet man als **voll ausgestatteter Leutnant**. Zwei Offizierspatente, größerer Kaufladen, simulierte Vorratskurve.
> **Aus v2.0:** Beförderung deutlich verlangsamt (Abschnitt 4) · **Fertigkeitskurve 0–100 durchgerechnet** (Abschnitt 5) · Punktewertung zählt nur den **selbst geleisteten Aufstieg** · Offizierspatent gilt ab Kapitel 1 für die volle Kampagne · **Schwierigkeit auf fünf Durchläufe geeicht** (Abschnitt 10)

---

## 0. Die eine Zeile

> Du beginnst 1796 als analphabetischer Rekrut mit einer Muskete, die du kaum halten kannst.
> Wenn du zwanzig Jahre und sechs Feldzüge überlebst, hältst du 1815 vielleicht einen Marschallstab.
> Wahrscheinlicher liegst du 1799 in einem Graben bei Mantua.

---

## 1. Warum ausgerechnet Napoleon

Das Ziel ist ein Spiel, in dem man im Rang aufsteigt und in dem sich Aufgaben und Möglichkeiten **mit** einem verändern. Die napoleonische Ära ist dafür nicht nur ein hübscher Anstrich, sondern historisch der Ort, an dem dieses Versprechen tatsächlich galt:

- Die Revolution schaffte den Adelsvorbehalt für Offiziersstellen ab. Beförderung lief ab 1793 über Bewährung, nicht über Geburt.
- Reale Belege: **Michel Ney** war Husaren-Unteroffizier, **Joachim Murat** Sohn eines Gastwirts, **Jean Lannes** Färberlehrling. Alle drei starben als Marschälle des Kaiserreichs.
- Das geflügelte Wort *„Jeder Soldat trägt den Marschallstab im Tornister"* ist exakt die Fantasie, die dieses Spiel verkauft.

Kurz: Das Setting **ist** die Kernmechanik. Bei „Fantasy-Abenteurergilde" wäre der Rangaufstieg eine erfundene Regel. Hier ist er das Thema.

### Die Marktlücke

Ich habe geschaut, was es auf Steam gibt:

| Was existiert | Was es ist | Warum es etwas anderes ist |
|---|---|---|
| [Veterans: Napoleonic Wars](https://store.steampowered.com/app/4202430/Veterans_Napoleonic_Wars/) | Echtzeit-Taktik, tausende Soldaten | Du bist von Anfang an der Feldherr. Kein Aufstieg. |
| [Holdfast: Nations At War](https://store.steampowered.com/app/589290/Holdfast_Nations_At_War/) | Multiplayer-Shooter | Kein Karrierebogen, keine Persistenz. |
| [Grand Tactician: Napoleonic Wars](https://steamcommunity.com/app/3829400) | Große Kampagnenstrategie | Nationsebene, nicht Personenebene. |
| [Grand Tactician: Whiskey & Lemons](https://store.steampowered.com/app/2138830/Grand_Tactician_The_Civil_War__Whiskey__Lemons/) | Offizierskarriere im US-Bürgerkrieg | Startet als *Offizier*. Der Weg von unten fehlt. |
| [A Legionary's Life](https://store.steampowered.com/app/1058430/A_Legionarys_Life/) | Einzelsoldat, Attributs-Checks, Permadeath, 86 % positiv bei ~2.200 Reviews, 8 $ | Genau die richtige Struktur — aber Antike, und der Aufstieg endet früh. |

**Die Lücke:** Es gibt kein Napoleon-Spiel, das dich als *eine Person* durch die gesamte Rangleiter führt. Alle napoleonischen Titel setzen bei der Armee an, alle Karriere-Simulatoren spielen woanders. Genau dazwischen liegt dieser Entwurf.

---

## 2. Die drei Schichten

Gewollt ist eine Mischung aus allen drei Spielarten. So greift das ineinander, ohne dass es drei separate Spiele werden:

```
   ┌─────────────────────────────────────────────────────┐
   │  WINTERQUARTIER   Zeit einteilen: Training,         │  Wochen
   │  (Management)     Beziehungen, Bildung, Genesung    │
   └───────────────────────┬─────────────────────────────┘
                           ↓ Attribute, Gunst, Gesundheit
   ┌─────────────────────────────────────────────────────┐
   │  FELDZUG          Textszenen mit Entscheidungen     │  Tage
   │  (Entscheidungen) und Attributs-Checks              │
   └───────────────────────┬─────────────────────────────┘
                           ↓ Ruf, Verwundung, Zeugen
   ┌─────────────────────────────────────────────────────┐
   │  GEFECHT          Rundentaktik — und der Maßstab    │  Minuten
   │  (Kampf)          wächst mit deinem Rang            │
   └─────────────────────────────────────────────────────┘
```

Kein Teil ist optional-nebensächlich: Das Winterquartier bestimmt, ob du den Feldzug bestehst. Der Feldzug bestimmt, wer dich im Gefecht deckt. Das Gefecht bestimmt, ob dich jemand befördert.

---

## 3. Wie sich der Rangaufstieg *anfühlt*

Das ist der eigentliche Kern des Entwurfs, deshalb ausführlich. Ein höherer Rang darf nicht nur eine größere Zahl sein. Acht Hebel, die sich mit jeder Beförderung verändern:

**1. Der Maßstab des Kampfes wandert.**
Als Fusilier steuerst du deinen eigenen Körper: laden, anlegen, feuern, Bajonett, stehenbleiben. Als Sergent steuerst du eine Sektion von 20 Mann und musst sie in der Linie halten. Als Capitaine eine Kompanie. Als Colonel ein Regiment mit Formationswechseln. Als Général schiebst du Brigaden über eine Karte. **Das Kampf-Minispiel selbst verwandelt sich** — das ist der stärkste Aufstiegs-Effekt, den ein Spiel haben kann.

**2. Deine Sicht öffnet sich.**
Am Anfang siehst du nur, was deine Augen sehen: Pulverdampf, den Rücken des Vordermanns, Lärm. Keine Karte, keine Feindstärken. Als Offizier bekommst du eine Karte. Als General bekommst du *Meldungen* — verzögert, teils falsch. Die Informationslage wird besser und gleichzeitig unzuverlässiger.

**3. Man redet anders mit dir.**
„He, du da" → „Caporal" → „Sergent Duval" → „mon Capitaine" → „Monsieur le Général". Dieselben NPCs, andere Anrede. Kostet nichts, wirkt enorm.

**4. Scheitern bedeutet etwas anderes.**
Als Fusilier heißt Scheitern: du stirbst. Als Capitaine: dreißig Mann sterben und du musst dreißig Briefe schreiben. Als Général: eine Division ist weg und der Kaiser hat eine Frage an dich.

**5. Die Zeitauflösung wird gröber.**
Unten spielst du Minuten. Oben spielst du Tage und Wochen. Der Charakterbogen desselben Spiels tickt anders.

**6. Was du ablehnen darfst.**
Ein Rekrut kann nichts verweigern. Ein Sergent kann einen Befehl langsam ausführen. Ein Colonel kann widersprechen. Ein Général kann einen Marschall vor dem Kaiser blamieren — mit allen Folgen.

**7. Dein Leben außerhalb der Armee entsteht.**
Sold 1 Franc/Tag → Beute → Offizierskasse → Dotation → Landgut. Dazu Quartier, Bursche, Pferd, eine Frau, die Briefe schreibt. Nichts davon ist ein eigenes System — es ist der sichtbare Beweis, dass sich etwas verändert hat.

**8. Der Bildschirm füllt sich.**
Zu Beginn: ein Name, sechs Werte, eine Muskete. Am Ende: Stab, Pferd, Bursche, Orden, Gut, Familie, Ruf in drei Armeen. Der Charakterbogen wächst sichtbar mit.

---

## 4. Die Rangleiter

Vierzehn Ränge über neunzehn Jahre — grob einer je Kapitel. Zwei davon sind Mannschaftsgrade, die mehr tun als Zeit zu füllen.

| # | Rang | Kommando | Kampf-Maßstab | Neu freigeschaltet | Typisch in |
|---|---|---|---|---|---|
| 1 | **Conscrit / Fusilier** | — | Eigener Körper | — | Start 1796 |
| 2 | **Grenadier** *oder* **Voltigeur** | — | Körper, aber anders (s.u.) | **Auswahl statt Beförderung.** Höherer Sold, bessere Ausgabe | Kapitel 2–3 |
| 3 | **Caporal** | 8 Mann | Körper + Nachbarn decken | Kleine Befehle, Wachdienst, Sabre briquet | Kapitel 4 |
| 4 | **Caporal-fourrier** | 8 Mann + die Listen | wie Caporal | **Schwelle: Bildung ≥ 35.** Bestandslisten, Verpflegung, erste Verwaltung | Kapitel 5 |
| 5 | **Sergent** | 20 Mann | Sektion in Linie halten | Drill-Training, Rekrutenauswahl | Kapitel 6–7 |
| 6 | **Sergent-major** | 60 Mann | Zug, Feuerdisziplin | Fourage, Korruptionschancen | Kapitel 8 · Russland |
| 7 | **Sous-Lieutenant** | Zug | Erste Karte, eigene Initiative | **Bildung ≥ 50** · **Rangschranke nach Russland** · Degen, Pferd erlaubt | Kapitel 8 · Russland |
| 8 | **Lieutenant** | Zug + Stellvertretung | Zug frei bewegen | Adjutanten-Aufträge beim Stab | Kapitel 9 · Deutschland |
| 9 | **Capitaine** | Kompanie (~120) | Kompanie, Formationen | **Die Kompaniekasse.** Eigene Personalpolitik | Kapitel 10 · Frankreich |
| 10 | **Chef de bataillon** | Bataillon (~800) | Mehrere Kompanien | **Rangschranke für Waterloo** · Pferd gestellt | Kapitel 10 · Frankreich |
| 11 | **Colonel** | Regiment (~2.000) | Regiment auf Gefechtskarte | Regimentsehre, Adlerträger, Lieferantenverträge | Kapitel 11 · **Waterloo** |
| 12 | **Général de brigade** | Brigade | Brigaden auf Operationskarte | **Schaltet die Generalskampagnen frei** | nur im besten Lauf |
| 13 | **Général de division** | Division | Divisionen, Zeitachse in Tagen | Kaiserlicher Kontakt, Adelstitel, Dotation | nur im Ausnahmelauf |
| 14 | **Maréchal d'Empire** | Korps | Korps, strategische Ebene | Die Legende. Praktisch nie. | nur im Ausnahmelauf |

### Rang 2 — Grenadier oder Voltigeur

**Keine Beförderung, sondern eine Auswahl.** Du wirst aus der Füsilierkompanie in eine der beiden Elitekompanien versetzt — historisch hatte jedes Bataillon eine Grenadier- und eine Voltigeurkompanie, besetzt nach Körperbau und Eignung.

| Weg | Voraussetzung | Was sich ändert |
|---|---|---|
| **Grenadier** | Konstitution ≥ 55 | Die Großen und Standhaften. Sturmangriffe, Bärenfellmütze, höherer Sold. Der Kampf bleibt „in der Linie stehen" — aber immer an der härtesten Stelle |
| **Voltigeur** | Geschick ≥ 55 | Die Kleinen und Schnellen. Plänkler. **Eine andere Kampfart:** gezielter Einzelschuss, Deckung suchen, frei bewegen, keine Formation |
| **Fusilier bleiben** | — | Kein Bonus, kein Umweg. Wer beide Werte verfehlt, bleibt in der Mitte |

Das ist der früheste Punkt, an dem sich das Spiel verzweigt — und es liefert eine **zweite Kampfart, ohne eine Kommandoebene hinzuzufügen.** Genau das fehlte dem alten Rang 2.

### Rang 4 — Caporal-fourrier

Der Schreiber der Kompanie. Historisch nach Schreibkundigkeit ausgewählt, führte er die Bestandslisten und die Verpflegung. **Schwelle: Bildung ≥ 35.**

Vier Gründe, warum dieser Rang mehr ist als eine Zwischenstufe:

1. **Bildung zahlt sich zum ersten Mal aus** — lange vor der Offiziersschwelle bei 50. Wer den Fourrier erreicht, hat die Lektion gelernt, die er für Rang 7 braucht.
2. **Die Verwaltungsschicht wird behutsam eingeführt**, fünf Ränge vor der Kompaniekasse. Erst Listen führen, später Geld verwalten.
3. **Ein Weg nach oben für schlechte Kämpfer.** Wer Muskete 20 hat, aber lesen kann, ist nicht chancenlos.
4. Es ist die Stelle, an der ein Spieler ohne Tutorial begreift, dass **Bildung der eigentliche Flaschenhals** dieses Spiels ist.

### Was ich bewusst *nicht* ergänzt habe

**Conscrit als eigener Rang** — wäre reine Verzögerung, der Rekrutenstatus ist schon Rang 1. **Sergent-fourrier** — doppelt sich mit dem Caporal-fourrier. **Adjudant** — würde die Offiziersschwelle verwässern, und die soll die schärfste Kante im Spiel bleiben.

Vierzehn ist meine Obergrenze: Mehr Stufen verwässern jede einzelne Beförderung, und oben muss es dünn bleiben. **Der erste Lauf endet meist bei Rang 1 oder 2. Ein guter Lauf endet als Sergent-major im Ruhestand nach Russland. Rang 12 ist die Freischaltung, Rang 14 die Legende.**

---

## 5. Attribute und Fertigkeiten

**Eine Skala für alles: 0–100.** Attribute und Fertigkeiten laufen auf derselben Achse, mit denselben Kompetenzstufen und derselben Kostentabelle. Das spart eine Umrechnung im Kopf und macht jeden Wert im Spiel sofort lesbar.

| Wert | Stufe | Fertigkeit | Attribut |
|---|---|---|---|
| 0–19 | **Untauglich** | Der Ladestock fällt, du zuckst beim Schuss | Gebrechlich, schreckhaft, begriffsstutzig |
| 20–39 | **Rekrut** | Klappt, wenn niemand zurückschießt | Unter dem Durchschnitt |
| 40–59 | **Gedient** | Verlässlich im Drill, wacklig im Gefecht | Normal für einen gesunden jungen Mann |
| 60–79 | **Erfahren** | Verlässlich auch unter Feuer | Deutlich über dem Durchschnitt |
| 80–94 | **Veteran** | Du machst es, während du an anderes denkst | Im Regiment bekannt dafür |
| 95–100 | **Meister** | Ein, höchstens zwei pro Leben | In der Armee bekannt dafür |

### Die sechs Attribute

| Attribut | Wirkt auf |
|---|---|
| **Konstitution** | Marschausdauer, Wundheilung, Krankheit, Russland-Winter |
| **Geschick** | Ladegeschwindigkeit, Zielgenauigkeit, Bajonett, Reiten |
| **Kaltblütigkeit** | Standhalten unter Feuer, Panikwiderstand, Kartenspiel, Duelle |
| **Autorität** | Werden Befehle befolgt? Sichtbarkeit bei Vorgesetzten |
| **Bildung** | Lesen, Schreiben, Karten, Taktik. **Harte Schwelle: 50 für den Offiziersrang** |
| **Menschenkenntnis** | Beziehungen, Intrigen erkennen, Handel, Verhöre |

### Die neun Fertigkeiten

Muskete · Bajonett · Reiten · Drill · Taktik · Kartenkunde · Verwaltung · Fouragieren · Feldchirurgie

### Charaktererschaffung

| Bei der Erschaffung | Wert |
|---|---|
| Sockel auf allen sechs Attributen | 20 |
| **Verteilungspool, frei in 1er-Schritten** | **120** |
| Höchstwert je Attribut bei der Erschaffung | 70 |
| Bildung — vom Pool ausgenommen | 20 |
| Alle neun Fertigkeiten | 10 |
| **Summe der Attribute · Durchschnitt** | **240 · 40** |

**60 Punkte** bei einem Höchstwert von 70 heißt: Es lässt sich **genau ein Attribut auf 70** bringen — oder eines auf 60 und eines auf 40 —, der Rest bleibt beim Sockel. Würfeln oder selbst verteilen. *(Bis 28.07.2026 waren es 120; gesenkt, damit der Weg nach oben über die Veteranenpunkte führt und ein Erstlauf-Mann kein Veteran ist.)*

| Beispielbauart | Verteilung | Wert in VP |
|---|---|---|
| **Spezialist** | 70 · 70 · 40 · 20 · 20 · 20 | 380 |
| **Zwei Säulen** | 70 · 60 · 40 · 30 · 20 · 20 | 340 |
| **Ausgewogen** | 50 · 50 · 40 · 40 · 40 · 20 | 260 |
| **Breit** | 40 · 40 · 40 · 40 · 40 · 40 | 240 |

**Warum Spezialisierung sich lohnt:** Zehn freie Punkte auf Stufe 20 wären 20 VP wert, dieselben zehn Punkte auf Stufe 60 aber 60 VP. Wer streut, verschenkt Budget — der Pool ist konzentriert **380 VP** wert, breit verteilt nur 240, bei einem Maximum von 918.

**Ein Rekrut ist ein normaler Mann, der nichts kann.** Attribute im Schnitt 40 — er ist gesund, wach, nicht dumm. Fertigkeiten bei 10 — er hat nie eine Muskete geladen. Genau diese Lücke schließt sich über die Kampagne, und genau sie macht den ersten Lauf so tödlich.

### Herkunft

Ein Zuschnitt obendrauf, gewählt oder gewürfelt. **Jede Herkunft verteilt exakt 50 Punkte** — keine ist stärker als eine andere, sie unterscheiden sich nur darin, *wohin* die fünfzig gehen. Teils mit Abzügen, damit die Profile scharf werden.

| Herkunft | Verteilung | Summe |
|---|---|---|
| **Bauernsohn** | Konstitution +20 · Fouragieren +25 · Bajonett +15 · Bildung −10 | 50 |
| **Schmiedsgeselle** | Geschick +20 · Muskete +25 · Bajonett +15 · Menschenkenntnis −10 | 50 |
| **Wilderer** | Muskete +30 · Fouragieren +20 · Geschick +15 · Autorität −15 | 50 |
| **Fuhrmannssohn** | Reiten +30 · Verwaltung +20 · Konstitution +10 · Kaltblütigkeit −10 | 50 |
| **Schreibergehilfe** | Bildung +25 · Verwaltung +25 · Kartenkunde +20 · Konstitution −20 | 50 |
| **Straßenjunge aus Paris** | Menschenkenntnis +25 · Kaltblütigkeit +20 · Fouragieren +20 · Bildung −15 | 50 |

Der **Schreibergehilfe** landet bei Bildung 45 und damit fünf Punkte unter der Offiziersschwelle — der billigste Weg nach oben, bezahlt mit einem schwachen Körper. Genau die Abwägung, die das Spiel stellen will.

### Wachstum im Spiel

```
Zuwachs pro Kapitel ≈ 16 × Nutzungsintensität × (100 − aktueller Wert) / 100
```

Von 12 auf 40 geht schnell, von 80 auf 90 dauert Jahre. Typische Kurve der täglich benutzten Hauptfertigkeit, ohne Veteranenpunkte:

| Kapitel | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Muskete** | 12 | 26 | 37 | 42 | 52 | 59 | 66 | 72 | 75 | 79 | 82 |

Nach einer vollen Kampagne hast du **eine** Fertigkeit um 85 und den Rest zwischen 40 und 65. Nie alles.

**Ein schöner Nebeneffekt:** Weil das Wachstum vom Abstand zu 100 abhängt, wachsen gekaufte hohe Startwerte im Spiel *langsamer*. Wer sich Muskete 60 kauft, holt bis Waterloo weniger heraus als jemand, der bei 10 anfängt — der Vorsprung schrumpft, statt sich aufzuschaukeln. Die Bremse ist schon eingebaut.

**Was der Wert konkret tut** — am Beispiel Muskete:

| Muskete | Ladezeit | Im Gefecht |
|---|---|---|
| 12 | ~34 s | Jeder vierte Ladevorgang misslingt |
| 30 | ~28 s | Zwei Schuss in der Minute wären Glück |
| 50 | ~23 s | Du hältst mit der Linie mit |
| 70 | ~19 s | Drei Schuss pro Minute, auch mit Rauch in den Augen |
| 90 | ~15 s | Vier Schuss pro Minute — der historische Bestwert |

---

## 6. Ausrüstung, Pferd und Orden

### Das Prinzip: Ausrüstung ist ein Zustand, keine Statistik

Jedes Ausrüstungsstück hat einen **Zustand von 0 bis 100**, und dieser Wert sinkt. Schuhe halten einen Feldzug, keine zwei. Eine Muskete, die niemand putzt, zündet irgendwann nicht mehr.

Damit bekommen drei Dinge einen Zweck, die sonst Beiwerk wären: das **Winterquartier** (instandsetzen kostet Zeit), das **Geld** (Handwerker kosten Francs) und die Fertigkeit **Fouragieren** (Ersatz beschaffen, wenn kein Nachschub kommt). Und es erklärt Russland: Dort verschleißt alles doppelt so schnell, und was kaputtgeht, wird nicht ersetzt.

**Sieben Plätze, keine Inventarliste:** Waffe · Seitenwaffe · Schuhwerk · Mantel · Tornister · Kleinkram · Pferd.

### Waffe

| Muskete | Wirkung | Verschleiß | VP |
|---|---|---|---|
| Ausgemustertes Modell 1763 | −10 Muskete, jeder achte Schuss versagt | −20 | Beute |
| Charleville Modell 1777 (Ausgabe) | Standard. Gehört dir nicht. | −15 | 0 |
| Modell 1777 An IX, eingeschossen | +8 Muskete | −12 | 25 |
| **Manufakturmuskete aus Versailles** | +15 Muskete, hält länger | −8 | 55 |
| Gezogener Stutzen (Voltigeur) | +20 auf Distanz, doppelte Ladezeit | −10 | 60 |

| Seitenwaffe | Wirkung | Voraussetzung | VP |
|---|---|---|---|
| Ausgabebajonett | Standard | — | 0 |
| Geschliffenes Bajonett | +5 Bajonett | — | 12 |
| Sabre briquet | +8 Nahkampf, Ruf im Lager | ab Rang 3 | 20 |
| **Offiziersdegen** | +10 Nahkampf, Duelle möglich | ab Rang 7 | 30 |

### Was am Körper hängt

| Schuhwerk | Wirkung | Verschleiß | VP |
|---|---|---|---|
| Zerfallene Schuhe | Marschproben um 20 erschwert, Erfrierungsgefahr | — | — |
| Ausgabeschuhe | Standard. Halten einen Feldzug. | −25 | 0 |
| **Doppelt besohlte Schuhe** | Marschverschleiß halbiert | −12 | 25 |
| Reitstiefel | +Ruf, +Reiten, schlecht zu Fuß | −10 | 35 (Rang 7) |

| Mantel | Wirkung | VP |
|---|---|---|
| Keiner | In Russland praktisch ein Todesurteil | 0 |
| Capote (Ausgabemantel ab 1806) | Kälteproben +15 | 20 |
| **Pelzgefütterter Mantel** | Kälteproben +35 | 45 |

| Tornister und Kleinkram | Wirkung | VP |
|---|---|---|
| Kalbslederner Tornister, verstärkt | +10 Patronen, +2 Tage Proviant | 15 |
| Feldflasche mit Schnapsvorrat | Belastung −5 je Kapitel. Nicht ohne Preis. | 10 |
| Taschenuhr | Du weißt, wie lange du hältst. +Taktik-Proben | 15 |
| Schreibzeug | Bildung wächst schneller, Briefe nach Hause | 15 |
| Amulett oder Heiligenbild | +5 Kaltblütigkeit. Wirkt, weil du glaubst, dass es wirkt. | 10 |
| Fernrohr | Gefechtskarte zeigt mehr, Meldungen früher | 30 (Rang 7) |

### Das Pferd — ab Rang 7

| Rang | Regelung | Was das bedeutet |
|---|---|---|
| 1–6 | **Kein Pferd** | Du bist Fußvolk. Auch mit Geld nicht zu ändern. |
| 7–8 | Erlaubt, selbst zu kaufen | Der erste sichtbare Unterschied zum Mannschaftsgrad — und dein Geld ist weg. |
| 9 | Üblich | Unterhalt läuft über die Kompaniekasse. |
| 10–11 | **Vorgeschrieben, wird gestellt** | Ein Stabsoffizier zu Fuß ist undenkbar. |
| 12–14 | Mehrere Pferde und ein Bursche | Du reitest die Front ab, statt in ihr zu stehen. |

| Pferd | Wirkung | Unterhalt | VP |
|---|---|---|---|
| Landpferd | Marschermüdung −40 % | 15 F / Kapitel | 40 (Rang 7) |
| **Kavalleriepferd** | Marschermüdung −60 %, +Reiten, ruhig unter Feuer | 30 F | 75 (Rang 9) |
| Vollblut | Wie oben, dazu +Ruf | 60 F | 120 (Rang 11) |

**Ein Pferd macht dich sichtbar — in beide Richtungen.** Deine Ruf-Gewinne steigen, weil man dich sieht. Und die feindlichen Schützen sehen dich auch: Berittene ziehen gezieltes Feuer, in jedem Gefecht läuft eine zusätzliche Probe. Dazu kostet es Geld, jedes Kapitel, ob du es benutzt oder nicht.

**Und in Russland wird dein Pferd gegessen.** Nicht vom Feind — von deinen eigenen Männern, und irgendwann von dir. Das ist keine Zufallskatastrophe, sondern eine Szene mit einer Entscheidung darin.

### Verschleiß

| Zustand | Was passiert |
|---|---|
| 100–70 | Tadellos. Keine Abzüge. |
| 69–40 | Gebraucht. Leichte Abzüge, hält noch. |
| 39–20 | Schadhaft. Deutliche Abzüge, Versager häufen sich. |
| 19–0 | **Unbrauchbar.** Barfuß, unbewaffnet, ohne Mantel. |

Instandsetzung: selbst flicken im Feldlager (+15 Zustand, kostet einen Abend) · Handwerker im Winterquartier (volle Wiederherstellung, kostet Francs) · Fouragieren vom Schlachtfeld (Ruf-Risiko). In **Russland 1812** verschleißt alles doppelt und nichts lässt sich instand setzen.

### Verantwortung — erst für dich, dann für sie

**Ausrüstung ist der zweite Maßstab, der mit dem Rang wandert.** Im Gefecht wächst dein Kommando vom eigenen Körper zur Division (Abschnitt 3, Hebel 1) — bei der Ausrüstung passiert dasselbe, nur leiser. Erst sorgst du für deine Schuhe. Dann für die von acht Männern. Irgendwann unterschreibst du Listen über zweitausend Paar, die du nie gesehen hast.

| Rang | Wofür du geradestehst | Männer | Was neu dazukommt |
|---|---|---|---|
| 1–2 · Fusilier / Grenadier | Dich selbst | — | Sieben Plätze, mehr nicht |
| 3 · Caporal | Deine Korporalschaft | 8 | Du meldest Mängel nach oben — und haftest für Fehlbestände |
| **4 · Caporal-fourrier** | **Die Listen der Kompanie** | ~120 auf Papier | Erster Kontakt mit Verwaltung: Bestände, Verpflegung, Fehlmengen erklären |
| 5–6 · Sergent | Sektion und Zug | 20–60 | Du verteilst die Ausgabe. Wer barfuß marschiert, ist dein Versäumnis |
| 7–8 · Offizier | Dein Zug, mit Unterschrift | ~40 | Du unterschreibst, was der Fourrier aufschreibt. Ab jetzt haftest du für fremde Zahlen |
| **9 · Capitaine** | **Die Kompaniekasse** | ~120 | Zum ersten Mal Geld in deiner Hand. Und die Versuchung |
| 10–11 · Chef de b. / Colonel | Bataillon, Regiment | 800–2.000 | Nachschubverhandlungen, Fuhrwerke, Lieferanten mit eigenen Interessen |
| 12–14 · General | Division und Korps | 10.000+ | Magazine, Requisition, Zahlen statt Männer. Du siehst keine Schuhe mehr, nur Bestandsmeldungen |

### Der Zustand deiner Einheit

Ein eigener Wert von 0 bis 100, der Durchschnitt über die Ausrüstung deiner Männer:

| Einheitszustand | Wirkung |
|---|---|
| 80–100 | Moral +10, kaum Marschausfälle, die Inspektion lobt dich |
| 60–79 | Normal. Nichts fällt auf |
| 40–59 | Moral −10, Krankheitsrate steigt |
| 20–39 | Moral −25, jeder Marsch kostet Männer, die Inspektion rügt dich |
| 0–19 | **Die Einheit löst sich auf dem Marsch auf.** Nachzügler kommen nicht zurück |

**Es wirkt zurück auf deine Karriere.** Eine verlotterte Kompanie ist keine Privatsache: Der *Inspecteur aux revues* zählt Männer, prüft Schuhe und liest die Kasse. Das Ergebnis geht als Gunst oder Rüffel an deinen Fürsprecher — und die Vakanz-Regel bleibt, wie sie ist. **Ohne Fürsprecher keine Beförderung.** Wer seine Männer verkommen lässt, steigt nicht auf, egal wie tapfer er persönlich war.

### Die Kompaniekasse — ab Rang 9

Die französische Armee führte je Einheit eigene Kassen für Wäsche und Schuhwerk — die *masses* —, verwaltet vom Capitaine. Jedes Quartal fließt ein fester Satz je Mann hinein. Was damit geschieht, entscheidest du:

| Entscheidung je Quartal | für dich | Einheitszustand | Risiko bei Inspektion |
|---|---|---|---|
| Alles ausgeben, wie vorgesehen | 0 F | +25 | keines |
| Das Übliche abzweigen | +150 F | +10 | 15 % |
| **Kräftig zulangen** | +400 F | −10 | 40 % — bei Entdeckung Rang und Fürsprecher weg |

**Warum das die schärfste Entscheidung im Spiel ist:** Du hast Veteranenpunkte für deine eigene Manufakturmuskete ausgegeben, für Reitstiefel, für ein Pferd. Du weißt genau, was gute Ausrüstung wert ist — *weil du dafür bezahlt hast*. Und jetzt sitzt du auf dem Geld, mit dem hundertzwanzig andere Männer Schuhe bekommen sollen.

Das Spiel kommentiert das nie. Es zeigt zwei Zahlen: dein Vermögen und den Zustand deiner Kompanie. Und ein halbes Jahr später steht in einer Textszene, wie viele auf dem Marsch zurückgeblieben sind.

**Ab Colonel wird es abstrakter und größer.** Kein Griff in die Kasse mehr, sondern ein Lieferant, der dir für den Regimentsvertrag etwas zurückzahlt. Die Summe wächst, die Opfer werden unsichtbarer — genau der Bogen, den der Rangaufstieg überall beschreibt: *Als Fusilier heißt Scheitern, du stirbst. Als Colonel heißt es, dass zweitausend Männer schlechte Schuhe haben und du nie erfährst, wer deshalb liegen blieb.*

### Zwei Kapitel, in denen das alles kippt

**Spanien 1808–12 — Requisition oder Plünderung.** Es gibt keinen Nachschub, nur Land. Du kannst *requirieren* (mit Papieren, langsam, die Disziplin bleibt) oder deine Männer *nehmen lassen*, was sie finden (schnell, aber die Einheit verwildert und jedes Dorf schickt danach mehr Männer in die Guerilla). Der Einheitszustand steigt in beiden Fällen. Der Unterschied zeigt sich drei Kapitel später.

**Russland 1812 — wer bekommt die Schuhe.** Du hast 120 Mann, 40 brauchbare Paar und keinen Nachschub. Die Szene stellt genau eine Frage: Die Besten, damit die Kompanie noch kämpfen kann? Die Schwächsten, damit sie überhaupt weiterkommen? Oder du behältst ein Paar für dich, und niemand fragt nach. Es gibt keine richtige Antwort und keine Rückmeldung, ob es die richtige war.

### Orden

**Nennung im Tagesbefehl — beliebig oft.** *Cité à l'ordre du jour*, für eine sichtbare Tat vor einem Zeugen. Keine Obergrenze; manche Männer wurden ein Dutzend Mal genannt. Jede Nennung bringt +3 Ruf und zählt für die Ehrenlegion. Im Charakterbogen steht dann: `7× im Tagesbefehl genannt`.

**Ehrenwaffen 1799–1802.** Ehrengewehr, Ehrensäbel, Ehrentrommelstock — vor der Ehrenlegion die höchste Auszeichnung der Republik. Historischer Kniff: Wer eine Ehrenwaffe besaß, wurde 1804 **automatisch** in die Ehrenlegion aufgenommen. Wer 1796 in Italien etwas Verrücktes getan hat, bekommt acht Jahre später einen Brief.

**Ehrenlegion, gestiftet am 19. Mai 1802** — fünf Grade, jeder mit einer lebenslangen Pension:

| Grad | Bedingung | Pension | VP |
|---|---|---|---|
| Légionnaire | 3 Nennungen oder eine Ehrenwaffe | 250 F / Jahr | +12 |
| Officier | Rang ≥ 8 und 5 Nennungen | 1.000 F | +12 |
| Commandeur | Rang ≥ 10 | 2.000 F | +12 |
| Grand Officier | Rang ≥ 12 | 5.000 F | +12 |
| Grand Aigle (ab 1805) | Rang ≥ 13. Praktisch nie. | 5.000 F | +12 |

**Die Pensionen sind historisch exakt** — sie stehen so im Gesetz vom 29. Floréal des Jahres X. Und sie sind der Grund, warum Orden hier keine Vitrinenstücke sind: Ein Fusilier verdient 1 Franc am Tag, also rund 365 im Jahr. Die 250 Francs eines einfachen Légionnaire sind fast eine Verdopplung seines Einkommens — jedes Jahr, lebenslang. Ein Commandeur mit 2.000 Francs leistet sich Pferde und Ausrüstung, von denen ein Sergent nicht träumt. **Der Orden zahlt für die nächste Beförderung.**

**Fremde Orden:** Eiserne Krone (Königreich Italien, ab 1805) · Réunion (ab 1811) · Verbündeten-Orden aus Bayern, Sachsen, Württemberg. Je +10 VP, höchstens zwei gewertet.

### Was das für die Punktewertung heißt

| Auszeichnung | VP |
|---|---|
| Je Nennung im Tagesbefehl (höchstens 10 gewertet) | +3 |
| Je Grad der Ehrenlegion (5 Grade) | +12 |
| Je fremdem Orden (höchstens 2 gewertet) | +10 |
| **Zusammen höchstens** | **+110** |

Damit steigt das Punktemaximum von 856 auf **918**. Die vollständige Wunschliste eines Leutnants — Patent, drei Attribute auf 70, vier Fertigkeiten auf 40 und die komplette Ausrüstung samt Pferd — kostet **1.010 VP**. Es bleibt also dabei: Selbst der perfekte Lauf muss noch etwas weglassen.

---

## 7. Beförderung: die Vakanz-Regel

Beförderung ist **kein** Erfahrungsbalken. Drei Bedingungen müssen gleichzeitig zutreffen:

1. **Ruf** über dem Schwellenwert des Zielrangs
2. **Ein Fürsprecher** — ein konkreter NPC-Offizier mit ausreichender Gunst, der dich vorschlägt
3. **Eine offene Stelle** — die es nur gibt, wenn der Mann über dir stirbt, befördert wird oder in Ungnade fällt

Punkt 3 ist die moralisch unangenehme Pointe des Spiels: **Du brauchst Verluste.** Ein ruhiges Jahr in Garnison ist ein verlorenes Jahr. Ein Gemetzel, das du überlebst, ist eine Karrierechance. Das Spiel sagt das nie laut — der Spieler merkt es irgendwann selbst, und dieser Moment ist mehr wert als jedes Tutorial.

**Zusätzliche Mechanik: der Fürsprecher kann fallen.** Dein Gönner stirbt bei Eylau, und dein halber aufgebauter Einfluss ist weg. Deshalb lohnt es sich, mehrere Beziehungen zu pflegen — und deshalb ist das Winterquartier keine Pause.

---

## 8. Meta-Ressourcen

| Ressource | Skala | Wie man sie gewinnt | Wie man sie verliert |
|---|---|---|---|
| **Ruf** | 0–100 | Sichtbare Tapferkeit, überlebte Gefechte, Orden | Feigheit vor Zeugen, Fahnenflucht-Verdacht |
| **Gunst** | pro NPC, −5…+5 | Loyalität, Gefälligkeiten, gemeinsames Überleben | Ungehorsam, Konkurrenz, Intrigen Dritter |
| **Kameradschaft** | 0–100 | Beute teilen, Verwundete tragen, Strafen abfedern | Denunziation, Härte, Postenschieberei |
| **Belastung** | 0–100 | Sammelt sich bei Gemetzel, Kälte, Todesnähe | Winterquartier, Alkohol (mit Preis), Heimaturlaub |
| **Geld** | Francs | Sold, Beute, Fouragehandel, später Dotation | Ausrüstung, Bestechung, Spiel, Familie |

**Belastung** ist der Gegenspieler zum Aufstieg. Sie senkt Kaltblütigkeit, erhöht die Chance auf falsche Entscheidungen in Textszenen und schaltet ab bestimmten Schwellen eigene, düstere Ereignisse frei. Sie ist nicht heilbar, nur verwaltbar. Der Aufstieg hat einen Preis, und das Spiel führt Buch.

---

## 9. Kampagnenstruktur: elf Kapitel

| # | Kapitel | Jahr | Charakter des Kapitels |
|---|---|---|---|
| 1 | **Italien** | 1796–97 | Tutorial im Elend. Barfuß, hungrig, siegreich. |
| 2 | **Ägypten** | 1798–99 | Hitze, Krankheit, Karrees gegen Mamluken. Isolation. |
| 3 | **Garnison** | 1800–04 | Ruhe. Bildung nachholen, heiraten, Beziehungen. Rangstillstand als Druckmittel. |
| 4 | **Austerlitz** | 1805 | Die perfekte Schlacht. Erste große Bewährung als Offizier. |
| 5 | **Jena–Auerstedt** | 1806 | Tempo, Verfolgung, Marschstrapazen. |
| 6 | **Eylau & Friedland** | 1807 | Schnee und Massenverluste. Viele Vakanzen — viele Beförderungen. |
| 7 | **Spanien** | 1808–12 | Guerilla. Andere Regeln: kein Ruhm, nur Repressalien und Moral. |
| 8 | **Russland** | 1812 | Kein Feldzug, ein Überlebensspiel. Der Rückzug. Hier sterben die meisten Charaktere. |
| 9 | **Deutschland** | 1813 | Wiederaufbau aus Rekruten. Leipzig. |
| 10 | **Frankreich** | 1814 | Verteidigung der Heimat, Abdankung. Loyalitätsfrage. |
| 11 | **Hundert Tage** | 1815 | Waterloo. Epilog je nach Rang und Entscheidung. |

Jedes Kapitel hat eigene Regeln, nicht nur eigene Gegner. Kapitel 3 ist ein Management-Kapitel, Kapitel 7 ein Moral-Kapitel, Kapitel 8 ein Ressourcen-Überlebenskapitel. Das hält die 19 Spieljahre frisch.

---


### Die zwei Rangschranken

Die Kampagne ist nicht für jeden bis zum Ende offen. **Dein Rang entscheidet, wie viel vom Krieg du überhaupt zu sehen bekommst.**

| Schranke | Wann | Bedingung | Sonst |
|---|---|---|---|
| **Nach Russland** | Ende Kapitel 8, Dezember 1812 | **Rang ≥ 7** (Sous-Lieutenant) | Ruhestand. Die Kampagne endet hier. |
| **Vor Waterloo** | Ende Kapitel 10, April 1814 | **Rang ≥ 10** (Chef de bataillon) | Ruhestand auf Halbsold. Du erlebst die Hundert Tage vom Fenster aus. |

Beides ist historisch stimmig: Nach der Katastrophe von 1812 wurden Mannschaften und Unteroffiziere in Massen ausgemustert oder in neue Regimenter gesteckt, während erfahrene Offiziere gebraucht wurden. Und als Napoleon 1815 von Elba zurückkam, rief er gezielt **Offiziersveteranen** zurück — keine Feldwebel.

### Vier Enden

| Ende | Wie es dazu kommt | Was der Epilog erzählt |
|---|---|---|
| **Tod** | Jederzeit | Was aus deiner Einheit wurde, was nach Hause geschrieben wurde, wo man dich verscharrt hat |
| **Ruhestand nach Russland** | Kapitel 8 überlebt, aber Rang < 7 | Du hast alles gesehen, was ein Mensch sehen kann, und gehst nach Hause. Kein Ruhm, aber du lebst |
| **Ruhestand 1814** | Kapitel 10 überlebt, aber Rang < 10 | Der Kaiser dankt ab, die Armee wird aufgelöst, du sitzt auf Halbsold in einer Provinzstadt. Im März 1815 liest du Zeitung |
| **Waterloo** | Rang ≥ 10 bei Kriegsende 1814 | Als Offiziersveteran zurückgeholt, als Getreuer des Kaisers. Der 18. Juni 1815 |

**Das Ruhestands-Ende nach Russland ist kein Verlieren.** Es ist die häufigste Art, wie ein guter Lauf endet, und der Text soll das auch so behandeln: Du bist einer der wenigen, die aus Russland zurückkamen. Dass du kein Offizier geworden bist, macht das nicht kleiner.

### Freiwillig aufhören — und der Überlebensbonus

**An beiden Schranken darfst du gehen, auch wenn du bleiben dürftest.** Wer nach Russland Rang 7 hat, kann trotzdem den Abschied nehmen. Wer 1814 Rang 10 hat und für Waterloo zurückgeholt würde, kann ablehnen und seine Pension nehmen. Gleiches Ende, gleicher Epilog, gleicher Bonus wie beim erzwungenen Ruhestand.

**Der Überlebensbonus ist gestaffelt — und zwar rückwärts:**

| Ende | Bonus | Warum |
|---|---|---|
| **Tod** | 0 | — |
| **Ruhestand nach Russland** (Ende Kapitel 8) | **+180** | ersetzt die drei Kapitel, auf die du verzichtest |
| **Ruhestand 1814** (Ende Kapitel 10) | **+120** | ersetzt das letzte Kapitel |
| **Waterloo überlebt** (Ende Kapitel 11) | **+70** | es gibt nichts mehr zu ersetzen |

**Je früher du gehst, desto größer der Bonus.** Das klingt zunächst verkehrt, ist aber genau die Regel, die den Ausstieg zu einer echten Entscheidung macht statt zu einer immer falschen. Ohne sie wäre Weiterspielen ausnahmslos die bessere Wahl, und die ganze Option wäre totes Beiwerk.

**So steht die Rechnung dann tatsächlich:**

| Vorrat | Weitermachen nach Russland bringt | Weitermachen vor Waterloo bringt |
|---|---|---|
| 0 VP | +19 Punkte | **+3 Punkte** |
| 300 VP | +66 Punkte | **+19 Punkte** |
| 650 VP | +101 Punkte | **+30 Punkte** |

Nach Russland lohnt Weitermachen deutlich — außer für einen zerschlissenen Charakter ohne Vorrat, für den es knapp wird. **Vor Waterloo ist es fast ein Münzwurf.** Zwanzig Punkte mehr im Erwartungswert, gegen eine reale Chance, alles zu verlieren.

Genau so soll sich diese Entscheidung anfühlen: Die vernünftige Wahl 1814 ist, die Pension zu nehmen und nach Hause zu gehen. Nach Waterloo zu reiten ist die loyale, romantische, mathematisch kaum begründbare Wahl. **Man geht trotzdem.**

**Das Maximum bleibt bei 918 und gehört weiterhin Waterloo:** Ein Ruhestand nach Russland kommt bestenfalls auf rund 560 Punkte, ein Ruhestand 1814 auf rund 750. Der Bonus verschiebt die Entscheidung, aber nicht den Rekord.

### Die Vakanzwelle 1813–15

Ab Kapitel 9 beschleunigt sich die Beförderung deutlich. Das ist keine Belohnung, sondern eine Buchhaltung: Die Offizierskorps von 1812 lagen in Russland, und die Armee wurde aus Rekruten neu aufgebaut. **Wer Ende 1812 noch lebt und Offizier ist, steigt schnell** — weil über ihm niemand mehr steht.

Damit ist die Kurve zweigeteilt: bis Russland zäh, danach steil. Wer die erste Schranke schafft, hat plötzlich eine echte Chance auf Colonel.

### Generalskampagnen — die Freischaltung

**Rang 12 (Général de brigade)** ist praktisch nur im allerbesten Lauf erreichbar, meist erst bei Waterloo selbst. Wer ihn einmal erreicht, schaltet **zwei bis drei eigenständige Generalskampagnen** frei:

| Szenario | Dauer | Was man spielt |
|---|---|---|
| **Wagram, 5.–6. Juli 1809** | zwei Tage | Eine Division auf dem Marchfeld. Der klassische Sieg |
| **Leipzig, 16.–19. Oktober 1813** | vier Tage | Ein Korps in der Völkerschlacht. Man weiß, wie es ausgeht |
| **Waterloo, 18. Juni 1815** | ein Tag | Und alle wissen, wie es ausgeht |

Jede dauert 30 bis 60 Minuten, spielt ausschließlich auf der Operationsebene mit Meldungen und Befehlslaufzeiten, hat eigene Wertung und einen eigenen Chronikeintrag.

**Warum das nötig ist:** Die Generalsebene ist die aufwendigste Darstellungsstufe des Spiels — Operationskarte, verzögerte Meldungen, Befehlslaufzeit. Ohne diese Freischaltung würden 96 % der Spieler sie nie zu sehen bekommen. So bleibt sie ein seltener Aufstieg *und* wird als Belohnung dauerhaft zugänglich.

---

## 10. Tod und Veteranenpunkte

> **Entschieden:** Eine Generation. Kein Sohn, kein Nachfolger, kein Erbe. Die Vater-Sohn-Idee aus v1.2 war reizvoll, ist aber ein zweites Spiel und bleibt draußen. Was über den Tod hinausreicht, ist eine einzige, schlanke Mechanik.

### Regel 1 · Der Tod beendet den Feldzug

Fällst du bei Eylau, ist der Feldzug vorbei. Kein Weiterspielen, kein Übernehmen eines Kameraden, kein Zurücksetzen der Uhr. Es gibt einen Abschlusstext — was aus deiner Kompanie wurde, was nach Hause geschrieben wurde, wo man dich verscharrt hat —, einen Eintrag in der Chronik, und dann den Titelbildschirm.

Das ist die Härte, die A Legionary's Life gut tut, und der Grund, warum jede Entscheidung im Gefecht Gewicht hat.

### Regel 2 · Nur dein bester Lauf zählt

Veteranenpunkte sind **kein Konto, das sich füllt**. Sie sind die Punktzahl deines **besten** Charakters — das Maximum über alle Läufe, nicht die Summe.

Die Folge ist wichtig: Ein schlechter Lauf kostet dich nichts und bringt dir nichts. Du kommst nur weiter, indem du **deinen eigenen Rekord schlägst**. Damit gibt es nichts zu grinden — niemand spielt fünfzig kurze Läufe, um Punkte zu sammeln, weil das nichts einbringt.

### Regel 3 · Der Vorrat wird bei jedem Neustart frei verteilt

Punkte werden nicht verbraucht. Bei 70 Punkten bekommt **jeder** neue Charakter 70 Punkte zum Ausgeben — jedes Mal neu und anders, wenn du willst. Du kannst gefahrlos experimentieren: einmal ein zäher Bauernsohn mit Konstitution 6, einmal ein Schreiber, der von Anfang an lesen kann.

### Punktevergabe — gezählt wird der Aufstieg

`Rangpunkte = Wert des Endrangs − Wert des Startrangs.` Punkte für den **Weg**, nicht für den Standort.

| Rang | Wert | Rang | Wert |
|---|---|---|---|
| 1 · Fusilier | 0 | 8 · Lieutenant | 158 |
| 2 · Grenadier/Voltigeur | 12 | 9 · Capitaine | 205 |
| 3 · Caporal | 26 | 10 · Chef de bataillon | 262 |
| 4 · Caporal-fourrier | 42 | 11 · Colonel | 330 |
| 5 · Sergent | 62 | 12 · Général de brigade | 408 |
| 6 · Sergent-major | 88 | 13 · Général de division | 490 |
| 7 · Sous-Lieutenant | 120 | 14 · Maréchal | 580 |

| Zuschlag | VP |
|---|---|
| Je überlebtem Kapitel (max. 11) | +8 |
| Ruf am Ende, je volle 10 Punkte | +5 |
| Je Nennung im Tagesbefehl (max. 10) | +3 |
| Je Grad der Ehrenlegion (5 Grade) | +12 |
| Je fremdem Orden (max. 2) | +10 |
| **Überlebensbonus** (siehe Abschnitt 9) | +70 … +180 |
| Nie vor Zeugen gekniffen, nie desertiert | +20 |

**Maximum als Rekrut: 918. Als gekaufter Leutnant: 760.** (Siehe Abschnitt 6 für die Orden im Detail.)

### Der Kaufladen

**Gekauft wird Punkt für Punkt.** Nur der *Preis* springt an jeder Zehnergrenze. Dieselbe Tabelle für Attribute und Fertigkeiten:

| Bereich | VP je Punkt | der ganze Zehner | ab 0 kumuliert |
|---|---|---|---|
| 0 – 9 | 1 | 10 | 10 |
| 10 – 19 | 1 | 10 | 20 |
| 20 – 29 | 2 | 20 | 40 |
| 30 – 39 | 2 | 20 | 60 |
| 40 – 49 | 3 | 30 | 90 |
| 50 – 59 | 4 | 40 | 130 |
| 60 – 69 | 6 | 60 | 190 |
| 70 – 79 | 8 | 80 | 270 |
| 80 – 89 | 11 | 110 | 380 |
| 90 – 99 | 15 | 150 | 530 |

Ein Punkt auf Stufe 25 kostet 2 VP, derselbe Punkt auf Stufe 65 kostet 6, auf Stufe 95 kostet er 15.

| Beispiel | VP | | Sonstiges | VP |
|---|---|---|---|---|
| Fertigkeit 10 → 40 | 50 | | 200 Francs Startgeld | 20 |
| Attribut 40 → 60 | 70 | | Empfehlungsschreiben | 65 |
| Attribut 40 → 70 | 130 | | **Patent Sous-Lieutenant** | **110** |
| Fertigkeit 10 → 60 | 120 | | **Patent Lieutenant** | **145** |
| Bildung 45 → 50 (Offiziersschwelle) | 15 | | | |
| Fertigkeit 10 → 100 | **520** | | | |

Ausrüstung, Pferd und Kleinkram stehen mit ihren Preisen in **Abschnitt 6**.

### Startpakete — der kaufbare Offiziersstart

| Paket | Start | Was mitkommt | VP |
|---|---|---|---|
| **Freiwilliger** | Fusilier, Mai 1796 | Nichts. Eine Muskete, die dir nicht gehört. | 0 |
| **Patent Sous-Lieutenant** | Rang 7, Mai 1796 | Bildung 50 · Ruf 10 · Degen. Volle Kampagne als Offizier. | 110 |
| **Patent Lieutenant** | Rang 8, Mai 1796 | Bildung 50 · Ruf 10 · Degen, eigener Zug. Volle Kampagne. | 145 |

**Freischaltbedingung: mindestens einmal Capitaine (Rang 9) erreicht.**

**Der Rang kommt ohne das Können.** Das Patent kauft die *Stellung*, nicht die *Fertigkeiten* — ein Lieutenant mit Muskete 10 ist ein Offizier, der nicht schießen kann, und Offiziere stehen vorn. In den Kapiteln 1–4 liegt die Anforderung für dich **8 Punkte höher**, weil man von dir erwartet voranzugehen, während die anderen liegen bleiben dürfen. Wer den Rang kauft und die Fertigkeiten spart, stirbt schneller als ein Konskribierter.

Dazu: kein Fürsprecher (ohne den keine Beförderung — die Wand verschiebt sich nur nach oben) und 158 Punkte Wertungsabzug durch die Aufstiegsregel.

### Die Sperre

Veteranenpunkte kaufen den **Ausgangspunkt** — nie den Aufstieg selbst. Dauerhaft gesperrt:

- **Ruf über 10** — dich kennt niemand, egal wie oft du gespielt hast
- **Gunst** — Beziehungen werden gelebt, nicht gekauft
- **Orden** — verdient oder gar nicht
- **Ränge über Lieutenant** — ab Rang 9 ist Schluss mit Kaufen
- **Geschichte** — kein Feldzug lässt sich überspringen, nur der Einstieg verschieben

Ein Empfehlungsschreiben (30 VP) gibt es zu kaufen, aber es bleibt ein *schwacher* Fürsprecher — die tragfähigen Beziehungen entstehen nur im Spiel.

### Die Schwierigkeitskurve

Der Vorrat ist immer die Punktzahl des **besten** Laufs. Die folgende Kette ist simuliert, nicht geschätzt: 6.000 virtuelle Spieler mit je 50 Durchläufen, angegeben ist der Median.

| Stufe | Vorrat | Tod | Ruhestand nach Russland | Ruhestand 1814 | **Waterloo** | **General (12+)** |
|---|---|---|---|---|---|---|
| Erster Lauf | 0 | 97 % | 2,1 % | 0,4 % | 0,6 % | 0,3 % |
| Nach 3 Läufen | 214 | 70 % | 10,5 % | 4,5 % | 14,9 % | 10,0 % |
| Nach 8 Läufen | 692 | 33 % | 4,8 % | 4,3 % | 58,1 % | 47,3 % |
| **An der Decke** | 774 | 30 % | 4,2 % | 3,8 % | **61,5 %** | **50,0 %** |

**An der Decke wird der Generalsrang zuverlässig:** 50 % je Lauf heißt 75 % in zwei Läufen, 88 % in drei, 97 % in fünf. Die Generalskampagnen sind damit garantiertes Ziel, kein Lotteriegewinn — man muss nur so weit kommen.

**Wie oft die Schranken greifen:**

| Vorrat | von den Russland-Überlebenden haben Rang 7+ | von den 1814-Überlebenden haben Rang 10+ |
|---|---|---|
| 0 VP | 28 % | 33 % |
| 214 VP | 55 % | 62 % |
| 774 VP | 93 % | 96 % |

Die Schranken beißen also vor allem am Anfang. Wer seinen Charakter voll ausgebaut hat, kommt fast immer durch — genau so, wie es sein soll: **Die Schranken sind eine Hürde für Anfänger, kein Deckel für Könner.**

**Der erste Lauf ist unverändert brutal:** 62 % erreichen **keine einzige Beförderung**. 31 % schaffen mit Glück die ersten zwei und sterben als Caporal. Ein Offizier im ersten Lauf ist eine Seltenheit, Waterloo praktisch ausgeschlossen.

Ein Lieutenant erreicht Waterloo nie — für ihn endet die Kampagne 1814 auf Halbsold. Wer ankommt, ist mindestens Chef de bataillon, meist Colonel oder General.

**Überlebenschance je Kapitel:**

| Kapitel | 0 VP | 200 VP | 420 VP | 690 VP | 880 VP |
|---|---|---|---|---|---|
| 1 · Italien 1796/97 | 60 % | 98 % | 98 % | 98 % | 98 % |
| 2 · Ägypten 1798/99 | 63 % | 98 % | 98 % | 98 % | 98 % |
| 3 · Garnison 1800–04 | 98 % | 98 % | 98 % | 98 % | 98 % |
| 4 · Austerlitz 1805 | 67 % | 94 % | 98 % | 98 % | 98 % |
| 5 · Jena 1806 | 66 % | 88 % | 98 % | 98 % | 98 % |
| 6 · Eylau 1807 | 65 % | 84 % | 98 % | 98 % | 98 % |
| 7 · Spanien 1808–12 | 70 % | 86 % | 98 % | 98 % | 98 % |
| **8 · Russland 1812** | **57 %** | **70 %** | **81 %** | **89 %** | **94 %** |
| 9 · Deutschland 1813 | 75 % | 87 % | 96 % | 98 % | 98 % |
| 10 · Frankreich 1814 | 75 % | 85 % | 92 % | 98 % | 98 % |
| 11 · Waterloo 1815 | 73 % | 82 % | 88 % | 94 % | 96 % |

**98 % ist die Obergrenze.** In jedem Feldzug bleibt eine Kugel übrig, die niemanden fragt — aber ein voll ausgebauter Veteran ist sehr schwer zu töten. **Russland bleibt die Ausnahme:** Dort greift keine Obergrenze, sondern nur das eigene Können, und selbst bei 880 Punkten bleibt eine Chance von sechs Prozent, dort liegen zu bleiben.

**Wie die Zahlen zustande kommen:** Jedes Kapitel hat eine *Anforderung* (Italien 22, Austerlitz 48, Spanien 70, Russland 84). Die Überlebenschance ergibt sich aus dem Abstand zwischen deinem Können und dieser Anforderung:

```
Überleben      = 0,76 + 0,016 × (Kompetenz − Anforderung)   [begrenzt auf 30 % … 98 %]
Startkompetenz = 12 + 97 × (1 − e^(−Vorrat / 650))
Rang           = 0,2 + 0,66 × Kapitel + (Kompetenz − 50)/22 + Vakanzwelle + Glück
```

Beim ersten Lauf liegt deine Fertigkeitskurve die halbe Kampagne lang *unter* der Anforderungslinie. Du bist nicht schlecht gespielt — du bist unfertig.

### Das Endspiel — der voll ausgestattete Leutnant

Wofür ein Vielspieler seine 400 Punkte ausgibt:

| Posten | VP |
|---|---|
| Patent Lieutenant — Rang 8 ab Mai 1796, Bildung 50 | 145 |
| Drei Attribute von 40 auf 70 (Konstitution, Kaltblütigkeit, Autorität) | 390 |
| Vier Fertigkeiten von 10 auf 40 — Muskete, Bajonett, Drill, Taktik | 200 |
| Manufakturmuskete, Offiziersdegen, Reitstiefel, Capote, Landpferd | 180 |
| **Summe** — von 918 möglichen | **915** |

915 Punkte hat man im Median nach **zwölf bis zwanzig Durchläufen** — das Maximum sind 918. Dann tritt dein Charakter als Leutnant in die Armee ein: beritten, ausgerüstet, ausgebildet, mit einem Empfehlungsschreiben in der Tasche und Fertigkeiten auf dem Stand eines Mannes, der schon gedient hat. Das ist ein anderes Spiel als der barfüßige Konskribierte aus Lauf 1 — und genau das soll es sein.

**Und trotzdem nie alles.** Alle sechs Attribute und alle neun Fertigkeiten auf 100 kosten **7.500 VP** bei einem Maximum von 918. Eine *einzige* Fertigkeit von 10 auf 100 kostet 520 — weit über die Hälfte des Budgets für eine Zahl. Und die volle Wunschliste eines Leutnants inklusive Fernrohr, Uhr, Schreibzeug und Empfehlungsschreiben kostet **1.010 VP**: 92 mehr, als es je gibt. Jeder Neustart bleibt eine Entscheidung darüber, *was für ein Mann* das diesmal wird.

### Die Chronik — und der Beweis, dass es vorangeht

Nach jedem Ende ein Eintrag: Name, Endrang, Datum, Art des Endes, Punktzahl. Der Rekordhalter ist markiert.

**Dazu eine zweite Spalte, die den eigentlichen Fortschritt sichtbar macht:** eine Bestenliste *je Kapitel*. Wie weit bin ich schon gekommen, und wie oft? Weil die Läufe kurz sind und der Tod häufig, ist die Frage „komme ich weiter als letztes Mal?" die eigentliche Motivation — und die soll man ablesen können, nicht schätzen müssen.

```
   Kapitel                   erreicht   bester Rang dort
   1 · Italien 1796/97          14×     Sergent
   2 · Ägypten 1798/99           9×     Sergent
   3 · Garnison 1800-04          8×     Caporal-fourrier
   4 · Austerlitz 1805           6×     Sergent-major
   5 · Jena 1806                 4×     Sous-Lieutenant
   6 · Eylau 1807                3×     Lieutenant
   7 · Spanien 1808-12           2×     Lieutenant
   8 · Russland 1812             1×     Capitaine        ← weiter war ich nie
   9 · Deutschland 1813          —
```

### Die Chronik

Nach jedem Tod ein Eintrag: Name, Endrang, Datum und Art des Todes, Punktzahl. Der Rekordhalter ist markiert und ist das, wogegen du antrittst — nicht gegen eine Bestenliste im Internet, sondern gegen deinen eigenen besten Mann.

```
    Étienne Duval        Fusilier             Erschossen bei Lodi, 10.05.1796        4
    Jean-Baptiste Rey    Sergent              Ruhr, Ägypten, August 1799            18
    Pierre Vasseur       Lieutenant           Gefallen bei Eylau, 08.02.1807        38
  ★ Antoine Marchand     Chef de bataillon    Gefallen bei Wagram, 06.07.1809       70
    Louis Ferrand        Caporal              Erfroren, Beresina, November 1812     11
```

### Und die Ehe?

Bleibt als **Beiwerk im Garnisonskapitel**, nicht als System: Man kann heiraten, es kostet Geld und Zeit, es bringt Briefe von zu Hause (senken **Belastung**), eine Mitgift und im Epilog einen Satz darüber, was aus der Familie wurde. Keine Kinder-Mechanik, kein Erbe, keine Folgegeneration.

## 11. Was ich als Erstes bauen würde

Nicht alles auf einmal. **Vertikaler Schnitt** statt breitem Fundament:

**Prototyp (Meilenstein 1)** — spielbar, ~2–3 Stunden Inhalt
- Kapitel 1 (Italien 1796) vollständig
- Ränge 1–3 (Fusilier → Grenadier/Voltigeur → Caporal), inklusive der Verzweigung des Kampfstils
- Alle sechs Attribute, vier Fertigkeiten
- Kampf auf zwei Maßstäben: eigener Körper und Sektion — damit der Maßstabswechsel bei Beförderung **sofort erlebbar** ist
- Vakanz-Regel, Ruf, ein Fürsprecher-NPC
- Speichern und **harter Permadeath**: Tod = Abschlusstext, Chronikeintrag, Ende
- **Veteranenpunkte und Chronik** — Punktwertung am Laufende, Rekordverwaltung, Verteilungsbildschirm beim Neustart (Startpakete kommen mit Meilenstein 2, wenn Rang 7 existiert)
- **Ausrüstung in Grundzügen** — Waffe, Schuhwerk und Zustandsverschleiß; Pferd und Orden folgen mit Meilenstein 2

Wenn dieser Prototyp Spaß macht, funktioniert das ganze Spiel. Wenn nicht, haben wir zwei Wochen verloren statt sechs Monaten.

**Meilenstein 2** — Kapitel 2–4, Ränge bis 9, Offiziersschwelle mit Bildung, Winterquartier-Management
**Meilenstein 3** — Kapitel 5–8, Ränge bis 9, Regimentsmaßstab im Kampf
**Meilenstein 4** — Kapitel 9–11, Generalsränge, Meldungssystem, Epiloge

---

## 12. Darstellungsform: Simulation oder Text?

Deine Frage. Kurze Antwort vorweg: **weder noch — sondern ein Interface, das selbst zum Charakter gehört.** Der Reihe nach.

### Option A · Rein textbasiert

Prosa, Auswahlknöpfe, eine Werteleiste. So macht es A Legionary's Life, und es funktioniert dort sehr gut.

Das Problem für *dieses* Spiel: Der stärkste Aufstiegs-Hebel aus Abschnitt 3 ist, dass sich dein **Sichtfeld öffnet**. Als Fusilier siehst du Rauch, als General eine Operationskarte mit verzögerten Meldungen. In reinem Fließtext ist das ein Unterschied zwischen zwei Absätzen. Man liest ihn, aber man spürt ihn nicht.

### Option B · Vollsimulation aus der Ich-Perspektive

Ein 3D-Schlachtfeld, in dem du durch die Augen deines Soldaten schaust.

Drei Gründe dagegen, in aufsteigender Wichtigkeit:

1. Der Aufwand ist zwei Größenordnungen höher — Modelle, Animation, Physik, KI für tausende Einheiten.
2. Das Genre kippt. Aus einem Karriere-Simulator wird ein Shooter, und im Shooter ist der Rang eine Zahl über dem Kopf.
3. **Der entscheidende Grund:** Eine Ich-Perspektive kann Rang 10 gar nicht darstellen. Ein General *erlebt* seine Schlacht nicht mit den Augen. Er sitzt an einem Tisch und liest Zettel. Wenn die Kamera immer im Kopf einer Person klebt, kannst du genau die Ebene nicht zeigen, auf die das ganze Spiel zuläuft.

### Option C · Diegetisches Interface — meine Empfehlung

Die Grundidee in einem Satz: **Der Bildschirm ist kein Fenster in die Welt, sondern das, was dein Charakter weiß.**

Die Perspektive bleibt durchgehend die deine — Anrede „du", Präsens, nüchtern. Was sich mit dem Rang verändert, ist nicht die Kamera, sondern der **Radius deines Wissens**, und der wird direkt auf den Bildschirm gezeichnet:

| Rang | Was der Bildschirm zeigt | Was er nicht zeigt |
|---|---|---|
| 1–4 | Vier Männer, Rauch, dein Körper. Leisten für Atem, Nerven, Ladezustand | Keine Karte. Keine Feindstärke. Kein Schlachtausgang |
| 5–7 | Handgezeichnete Gefechtsskizze. Feind gestrichelt und mit Fragezeichen | Alles jenseits der Sichtweite. Was die Nachbarkompanie tut |
| 8–9 | Regimentskarte mit Formationen, Munitions- und Moralwerten | Absichten des Gegners. Zustand der eigenen Flügel in Echtzeit |
| 10–12 | Operationskarte, Einheitensymbole, eingehende Meldungen mit Uhrzeit und Verlässlichkeit | Die Wirklichkeit. Alles ist 40 Minuten alt, manches falsch |

Die Pointe: **Der General sieht mehr und weiß weniger.** Der Fusilier sah wenigstens die Wahrheit — drei Schritt davon. Und die Umkehrung, die das Spiel oben trägt: Deine Befehle wirken erst nach der Laufzeit eines Reiters. Als Fusilier lag zwischen Entscheidung und Folge nichts. Als General entscheidest du über eine Lage, die es nicht mehr gibt.

Prosa bleibt das Rückgrat — sie trägt Ton, Figuren und die Härte. Die Grafik ist nie Dekoration, sondern immer die Antwort auf die Frage *„Was hat dieser Mann gerade vor sich?"*.

**Das ist alles in HTML machbar.** Karten als SVG, Meldungen als Liste, Zustandsleisten als CSS. Nichts davon braucht eine Engine. Ein Mockup der drei Ebenen liegt diesem Konzept bei.

---

## 13. Technik: die Optionen im Vergleich

| | **Browser (eine HTML-Datei)** | **Python im Terminal** | **Python + Pygame** | **Godot** |
|---|---|---|---|---|
| Was du zum Starten brauchst | Nichts. Doppelklick. | Python installiert | Python + Pygame | Godot installiert |
| Wie es aussieht | Echtes UI: Layout, Farben, Karten, Animationen | Reiner Text im schwarzen Fenster | Eigenes Fenster, Grafik, Sound | Vollwertig, wie ein Steam-Spiel |
| Teilen mit anderen | Datei schicken oder ins Netz stellen, läuft überall | Empfänger braucht Python | Empfänger braucht Python + Pygame | .exe exportierbar |
| Auf dem Handy | Läuft | Nein | Nein | Mit Aufwand |
| Wie schnell etwas Sichtbares entsteht | Sehr schnell | Sehr schnell | Mittel | Langsam |
| Wie weit es trägt | Trägt dieses Spiel komplett. Textlastige Simulationen sind Browser-Heimatgebiet | Nur Prototyp | Solide, aber Handarbeit für jedes UI-Element | Trägt alles, auch 3D |
| Steam-Release später | Möglich (Electron-Verpackung) | Nein | Möglich, mühsam | Der Standardweg |
| Aufwand für dich | Null | Gering | Mittel | Hoch — Engine lernen |

**Meine Empfehlung: eine einzelne HTML-Datei.**

Begründung: Dieses Spiel ist zu 80 % Text, Tabellen, Werte und Entscheidungsknöpfe. Genau darin ist HTML das beste Werkzeug, das es gibt — Layout, Schriften, Karten, Übergänge bekommst du geschenkt statt sie zu programmieren. Du kannst nach jeder Änderung sofort draufschauen, ohne irgendetwas zu installieren, und die Datei per Nachricht weitergeben, wenn jemand testen soll. Der Spielstand liegt in einer Datei, die du herunterlädst.

Der einzige echte Nachteil: Für einen Steam-Verkauf müsste man später umverpacken. Das ist ein Problem für den Tag, an dem das Spiel gut genug für Steam ist — und bis dahin wäre Godot verfrühter Aufwand an einer Stelle, an der noch nicht feststeht, ob das Spiel überhaupt Spaß macht.

Falls du später doch zu Godot willst: Die gesamte Spiellogik dieses Konzepts — Attribute, Checks, Beförderungsregeln, Ereignistexte — liegt in Datenstrukturen, die sich portieren lassen. Nur die Oberfläche wäre neu.

---

## 14. Alternative Settings, falls Napoleon doch nicht zündet

Nach demselben Muster gebaut, gleiche Mechanik, anderes Kleid — jeweils mit der Frage, wie groß die Lücke ist:

| Setting | Rangleiter | Lücke | Anmerkung |
|---|---|---|---|
| **Segelmarine 1793–1815** | Schiffsjunge → Midshipman → Lieutenant → Kapitän → Admiral | **Groß.** Es gibt Seeschlacht-Spiele, aber keinen Karriere-Simulator | Hornblower-Fantasie. Beste Alternative, sehr nah dran |
| **Osmanische Janitscharen 1500er** | Devşirme-Knabe → Janitschar → Bölükbaşı → Ağa | **Sehr groß.** Praktisch unbesetzt | Exotisch, dadurch riskanter, aber unverbraucht |
| **Rote Armee 1941–45** | Rekrut → Serschant → Leutnant → Oberst | Mittel. Viele WK2-Spiele, aber kaum Personenkarrieren | Thematisch schwer, braucht Fingerspitzengefühl |
| **Mittelalterlicher Hof** | Knappe → Ritter → Baron → Herzog | Klein. Crusader Kings besetzt das Feld | Würde ich lassen |
| **Moderne Firma** | Praktikant → Teamlead → CEO | Klein und satirisch besetzt | Kein Heldenbogen, schwer emotional zu tragen |

---

## 15. Getroffene Entscheidungen

| Frage | Entschieden | Konsequenz für den Bau |
|---|---|---|
| **Nation** | Frankreich zuerst, weitere Nationen später spielbar | Nation wird von Anfang an als **Datensatz** geführt, nicht fest verdrahtet: Rangnamen, Feldzugsliste, Ereignistexte und Beförderungsregeln liegen in getrennten Dateien. Eine spätere Nation ist dann Textarbeit, kein Umbau. |
| **Waffengattung** | Nur Infanterie, Kavallerie und Artillerie später | Kampfsystem bekommt trotzdem gleich einen Gattungs-Schalter, damit Reiterei später nicht am Fundament scheitert. Inhaltlich wird zunächst nur Infanterie gefüllt. |
| **Historische Treue** | Sowohl als auch: **große Schlachten sind Fixpunkte**, dazwischen wird frei gespielt | Lodi, Austerlitz, Eylau, Borodino, Beresina, Leipzig, Waterloo liegen auf festen Daten und laufen historisch aus. Marsch, Lager, Scharmützel, Winterquartier und dein persönliches Schicksal dazwischen sind frei. Historische Schlacht = Bühne, deine Karriere = Stück. |
| **Sprache** | Deutsch zuerst | Alle Texte laufen von Beginn an über eine Textdatei mit Schlüsseln statt fest im Code. Eine englische Fassung ist später eine Übersetzung, keine Neuprogrammierung. |
| **Ton** | Nüchtern-brutal | Kein Heldenpathos, keine Musik im Text. Kurze Sätze, konkrete Details, keine Wertung. Der Aufstieg wird nie gefeiert, er wird protokolliert. Belastung (Abschnitt 7) ist kein Nebensystem, sondern die zweite Hauptlinie. |
| **Darstellung** | Diegetisches Interface (Abschnitt 12) | Prosa plus SVG-Karten, deren Detailgrad mit dem Rang wächst. |
| **Tod** | Beendet den Feldzug endgültig | Kein Nachfolger, kein Weiterspielen. Abschlusstext, Chronikeintrag, Titelbildschirm. |
| **Generationen** | Gestrichen — nur eine | Kein Sohn, kein Erbe. Hält das Spiel klein genug, um fertig zu werden. |
| **Meta-Progression** | **Veteranenpunkte, bester Lauf zählt** | Punktevorrat = Punktzahl des besten Charakters. Wird bei jedem Neustart frei auf Startattribute und Fertigkeiten verteilt. Kein Grinding möglich. |
| **Startpakete** | Zwei Patente: Sous-Lieutenant 110 VP, Lieutenant 145 VP | Ab Kapitel 1, volle Kampagne. Freigeschaltet ab einmal Rang 9. Ausgeglichen durch Wertungsabzug, höhere Anforderung und fehlende Fertigkeiten. |
| **Schwierigkeit** | Simuliert geeicht | Erster Lauf endet meist in Italien. Waterloo selbst mit vollem Vorrat nur zu ~42 %. |
| **Skala** | Attribute und Fertigkeiten gemeinsam 0–100 | Kauf Punkt für Punkt, Preis je Punkt steigt von 1 auf 15 VP an den Zehnergrenzen. |
| **Erschaffung** | Sockel 20, Pool 60 frei verteilbar, Maximum 70 | Ø 40 über sechs Attribute, Fertigkeiten bei 10. Plus eine Herkunft — alle sechs verteilen exakt 50 Punkte. |
| **Ausrüstung** | Sieben Plätze mit Zustand 0–100 | Waffe, Seitenwaffe, Schuhwerk, Mantel, Tornister, Kleinkram, Pferd. Verschleiß je Kapitel, Instandsetzung im Winterquartier. |
| **Verantwortung** | Skaliert mit dem Rang | Ab Caporal für andere mitverantwortlich, ab Fourrier für die Listen, ab Capitaine für die Kasse. Einheitszustand wirkt auf Moral, Verluste und die Beurteilung durch Vorgesetzte. |
| **Pferd** | Ab Rang 7 erlaubt, ab Rang 10 gestellt | Weniger Marschermüdung, mehr Ruf — aber ein Ziel für Schützen und ein Kostenposten. |
| **Orden** | Wiederholbare Nennungen + 5 Grade der Ehrenlegion | Mit historischen Pensionen von 250 bis 5.000 Francs jährlich. Orden sind Einkommen, nicht Deko. |
| **Ausstieg** | An beiden Schranken freiwillig möglich | Überlebensbonus 180 / 120 / 70 — je früher, desto mehr. Macht den Ausstieg vor Waterloo zur echten Wahl. |
| **Endspiel** | Voll ausgestatteter Leutnant für 915 VP | Erreichbar nach zwölf bis zwanzig Durchläufen, bei einem Maximum von 918. |

### Was jetzt noch offen ist

1. **Startjahr des ersten Charakters** — immer 1796, oder soll man auch später einsteigen können (kürzerer Durchlauf, höherer Startrang)?
2. **Länge einer Sitzung** — soll ein Kapitel in etwa 30–45 Minuten spielbar sein, oder darf Russland auch zwei Stunden am Stück dauern?
3. **Schwierigkeit** — ein Modus, oder ein „Eiserner Lauf" ohne Speichern zwischendurch für die, die es hart wollen?

Keine davon blockiert den Prototyp. Ich baue mit 1796, ~40 Minuten pro Kapitel und einem Modus, und wir sehen es im Spielen.

---

*Nächster Schritt: Meilenstein 1 als spielbarer Prototyp — Kapitel 1 (Italien 1796), Ränge 1–3, Kampf auf zwei Maßstäben, Vakanz-Regel, Nachfolge-System.*
