# Änderungsprotokoll

Eine Zeile je Änderung. Balance-Zahlen immer mit Begründung und Messwert.
Format: `Datum · Bereich · was · warum · gemessen`

---

## 2026-07-28 — Kapitel 4: Austerlitz 1805, Rang 6 und der Zug

**Vierzehn Stationen, drei Gefechte, Feindgüte 6.** Die Ernte von Boulogne: Zwei Jahre Exerzieren, dann 700 km in fünf Wochen, Ulm ohne Schlacht, und am 2. Dezember der Pratzeberg.

Für den Spieler heißt das: **Alles, was in Nîmes und Boulogne gelernt wurde, wird hier geprüft.** Das Friedenskapitel bekommt rückwirkend seinen Ernstfall.

### Rang 6 — und die härteste Vakanz des Spiels

Boulogne hatte es angesagt: *„Nichts frei. Auf dem Posten sitzt Martel, zweiundvierzig und gesund."* Jetzt kommt der Feldzug, in dem eine Stelle frei werden kann — über dieselbe Maschine wie beim Sergenten: **Vorschlag → Vakanz → Beförderung.** Der Capitaine schlägt vor (Ruf 75 · Vernet ≥ 3), und im nächsten Gefecht **fällt Martel**.

**Das Spiel spricht es nie aus.** Bis hierher war jeder, dessen Stelle frei wurde, ein Name am Rand — Guérin, Lascaux. Martel ist der Mann, der einen 1796 über die Pässe gebracht hat. Wer den Vorschlag bekommen hat und zwei Stationen später den Nachruf liest, stellt die Rechnung selbst auf.

**Der Zug** (60 Mann, drei Sektionen) ist bewusst **zwei Knöpfe, nicht vier**: *Feuer nach Sektionen* (rollendes Feuer — drei Runden Schaden auch dann, wenn man nichts tut, die einzige Stelle im Spiel, an der das passiert) und *Die Sergenten einteilen*. Die Abrechnung skaliert auf sechzig, das Appell-Bild zeichnet drei Reihen. **Der Beitrag des rollenden Feuers zählt nicht für die Sichtbarkeit** — gezählt wird, was aus dem Stand geschieht, und das tut der Zug, nicht du.

**Die Eiserne Krone** ist der erste fremde Orden (eine Meldung an den Oberbefehl, ab 1805; +10 VP, Ruf +6, 0,5 F). Die zweite fremde Stelle bleibt offen.

### Güte 6 — am Hebel geprüft, nicht am Ergebnis

Erster Schritt nach dem Anhängen war, `feindGuete()` je Gefecht auszulesen: Kapitel 4 steht auf 6, alles davor unverändert, das Manöver korrekt auf 0. **Die teuerste Lektion des Projekts war das stumme Güte-0-Leck**, und sie wird nicht zweimal gemacht.

### Gemessen, je 40 Läufe — und eine eingelöste Vorhersage

| | Erstlauf v | mutig | Vet 160 | Vet 260 |
|---|---|---|---|---|
| **überlebt** | 35 % | 8 % | 65 % | 65 % |
| **höchster Rang (Sergent-major)** | 18 % | 3 % | 55 % | 63 % |
| Sergent erreicht | 23 % | 10 % | 73 % | 88 % |

**Der Überlebens-Abstand ist von 15 auf 30 Punkte gesprungen** (35 → 65) und damit wieder über der selbstgesetzten Grenze von 25 — **ohne dass an einer einzigen Balance-Zahl gedreht wurde.** Genau das hatte der Kapitel-3-Befund vorhergesagt: „Die Leitzahl misst nur so scharf, wie das letzte gebaute Kapitel gefährlich ist."

**Die Leitzahl heißt jetzt `höchster Rang` statt `Sergent erreicht`.** Das war schon immer ihre Definition („der höchste gebaute Rang"); mit Rang 6 ist der Name Sergent falsch geworden. So wandert sie mit dem Ausbaustand mit und veraltet nicht — anders als der frühere Caporal-Sollwert. Bänder für vier Kapitel neu gesetzt; alle sechs Werte im Band.

---

## 2026-07-28 — Probenanzeige: Prozent statt zweier Zahlen

**Vom Spieler gemeldet:** Auf dem Knopf stand „Konstitution 40 gegen 40", die Probe misslang, und es war nicht nachvollziehbar, warum. Zwei Ursachen, beide behoben — **keine Balance-Änderung, nur Anzeige**:

1. **Die zwei Zahlen sagen nicht, was sie bedeuten.** „40 gegen 40" ist nach der Eichung des Spiels ein exakter Münzwurf (`Ziel = Wert − Schwierigkeit + 50`), liest sich aber wie „reicht genau". Jetzt steht die **Aussicht in Prozent** dabei: „Konstitution 40 gegen 40 · 50 %". Dieselbe Überlegung, aus der Wert und Schwierigkeit überhaupt auf dem Knopf stehen — sie sollen beim Entscheiden helfen, und eine Zahl, die man erst umrechnen muss, tut das nicht.

2. **Die Seitenleiste zeigte den rohen Wert, geprüft wurde mit dem gesenkten.** Wer eine schwere Wunde und zerrissene Schuhe hatte, las „Konstitution 70" und ging mit 52 in die Probe. Jetzt zeigt die Leiste den Wert, mit dem geprüft wird, den rohen klein daneben (`35 von 70`) — dieselbe Schreibweise wie beim Leben — und den Grund im Überfahrtext: *Wunden −14 · Belastung −3 · zerrissene Schuhe −18*.

**Was einen Wert senkt** (`wert()` in `mechanik.js`): Wunden (voll auf Körperliches, ein Drittel auf Geistiges) · Belastung (−1 je 12) · verrostete Muskete unter Zustand 35 (−15) · zerrissene Schuhe unter 25 (−18, nur Konstitution).

---

## 2026-07-28 — Der Lieutenant schlägt dich vor

**Aus einer Schwellenprüfung wird ein Ereignis.** `vakanzPruefen()` setzte bisher stumm ein Flag, sobald Ruf und Fürsprache für den Sergenten reichten. Der Spieler erfuhr nie, dass sein Name nach oben gegangen war — die Beförderung kam zwei Stationen später aus dem Nichts.

**Der Vorschlag ist aber das eigentliche Ereignis.** Er ist das, was ein Mann sich verdient; die Vakanz ist nur, was danach passieren muss. Jetzt hält Berthaud dich nach dem Appell auf, mit einem Blatt in der Hand, das er nicht vorzeigt:

> „Ich habe deinen Namen weitergegeben. Für die nächste Sektion, die einen Sergenten braucht." — Dann fügt er hinzu, was er hinzufügen muss: Es sei zurzeit keine Stelle frei. Die Kompanie habe ihre Sergenten, und alle drei seien gesund.

**Was daraus folgt, wird nicht ausgesprochen.** Das ist Invariante 5, gezeigt statt erklärt.

Damit hat der Aufstieg zum Sergenten drei Schläge statt einem: **Vorschlag → Vakanz → Beförderung.** Geprüft am ganzen Lauf; keine Zahl geändert, keine Schwelle verschoben.

---

## 2026-07-28 — Der Lieutenant schreibt deinen Namen auf

**Eine Frage des Entwicklers, die eine falsche Einschätzung von mir korrigiert hat.** Ich hatte Berthauds automatische Fürsprache (+1 je Gefecht aus `anerkennung()`) als zu großzügig eingestuft und vorgeschlagen, sie bei +3 zu deckeln — Begründung: Beim Sergenten falle damit eine der drei Bedingungen aus.

**Gemessen war das falsch.** `anerkennung()` feuert nur bei aktiven, gelungenen Taten. Wer sich ein ganzes Gefecht lang duckt, bekommt **0**; wer feuert und steht, bekommt **+1**. Die Fürsprache ist also verdient, nicht geschenkt — und sie bildet genau das ab, was inhaltlich stimmt: **Der Lieutenant ist der Zugführer, er sieht, was seine Leute tun, und er ist der Mann, der jemanden für den Sergenten vorschlägt.** Der Deckel-Vorschlag ist verworfen; er hätte eine funktionierende Fiktion durch eine Zahlenschranke ersetzt.

Dass Ruf und Berthauds Fürsprache beide die Leistung im Gefecht messen, ist keine Dopplung, sondern Verstärkung. Die *unterscheidende* Bedingung des Sergenten ist die Vakanz.

**Was tatsächlich fehlte, war die Sichtbarkeit im Augenblick.** In „Was gesehen wurde" stand nur „gesehen · Ruf +1"; dass der Lieutenant dabei eine Liste führt, erfuhr man erst bei der Musterung. Jetzt steht dort beim ersten Mal je Gefecht: **„Berthaud schreibt deinen Namen auf."** Keine Zahl geändert — die Ursache steht jetzt am Ort ihrer Wirkung.

---

## 2026-07-28 — Rückweg zur Übersicht

Aus dem laufenden Feldzug führte kein Weg zurück zu Chronik und Verlauf — man kam nur über einen Neustart des Reiters dorthin. Jetzt steht rechts oben in der Kopfzeile ein Knopf **„Übersicht"**.

**Er ist gefahrlos, und genau deshalb darf es ihn geben.** Der Feldzug wird bei jedem Schritt gesichert; wer die Übersicht aufruft, findet dort „Feldzug fortsetzen" und kommt an dieselbe Station zurück. Ein Rücksetzpunkt entsteht nicht, weil der Spielstand immer auf *jetzt* zeigt und nie weiter zurück (Invariante 1). Deshalb wird auch nicht nachgefragt — es gibt nichts zu verlieren.

---

## 2026-07-28 — Die Probenzeile war zu blass

`.pruefung.gut` trug noch das blasse Nachtgrün `#b6c48d` und verschwand auf dem Pergament fast. Das ist die **zweite der drei Zeilen nach jeder Wahl** (was passiert · ob es gelungen ist · was sich geändert hat) — sie muss man lesen können.

Beide Ausgänge tragen jetzt ihre volle Bedeutungsfarbe, halbfett und mit getöntem Grund: Grün ist Zugewinn, Rot ist Kosten.

---

## 2026-07-28 — Seitenspalten, Wunden, Kopfzeile — und ein Mann, der falsch anfing

**Ein Fehler, vom Spieler gemeldet: Atem stand bei 100, obwohl der Deckel schon bei 82 lag.** `atemKlemmen()` lief erst bei der ersten Handlung; bis dahin zeigte die Seitenleiste einen Wert, der nicht zu den Werten des Mannes passte, und sprang beim ersten Klick nach unten. Das sah aus wie ein Fehler, weil es einer war. **Der Atem-Deckel gilt jetzt ab der ersten Sekunde** — `neuerCharakter()` klemmt selbst.

Gemessen an einem Mann mit Konstitution 70: vorher „Atem 100" bis zum ersten Klick, dann 82. Jetzt 82 von Anfang an.

### Die beiden Spalten stehen kräftiger

Links der Verlauf, rechts das Livret. Beide sind **Nachschlagewerke, keine Fließtexte** — man sucht dort eine Zahl oder einen Ort, statt zu lesen. Auf dem hellen Pergament verschwand die frühere Abstufung zu leicht; jetzt stehen Beschriftungen halbfett und Zahlen fett. **Die alte Regel bleibt:** Die Zahl ist kräftiger als ihr Wort, weil man im Spiel die Zahl sucht.

### Die Wunden stehen unter dem Lebensbalken

Vorher standen sie ganz unten zwischen Geld und Nennungen. Sie erklären aber, **warum die Obergrenze wandert** („82 / 79 von 82"), und gehören deshalb neben die Zahl, die sie drücken. Eine gepunktete Linie trennt sie vom Balken.

### Die Kopfzeile zeigt, was ein Mann besitzt

Links vom Namen: **die Orden als Abzeichen und das Geld in Francs.** Beides stand bisher nur unten in der Seitenleiste, wo man es beim Spielen nicht sieht — und seit es einen Marketender und eine Ordenspension gibt, ist Geld eine Zahl, auf die man schaut.

**Dabei aufgefallen:** Die Rang- und Ordensabzeichen trugen noch ihren dunklen Rahmen aus der Nachtfassung (`#26221c`) — auf dem Pergament sahen sie aus wie Löcher im Papier. Alle Abzeichen sind auf die neue Palette umgestellt: Epauletten in gedecktem Rot und Olivgrün, Tressen in Bronze, das Kreuz der Ehrenlegion mit Konturlinie statt reinem Weiß.

---

## 2026-07-28 — Pergament statt Nacht

**Die Oberfläche ist von einem dunklen UI auf einen Feldtisch umgestellt.** Alles, was man sieht, sind Papiere: das Livret, die Meldungen, die Schlachtskizze, das Wertungsblatt. Der Grund dahinter ist dunkles Holz und nur an den Rändern sichtbar.

### Was dabei zu retten war

Die alte Gestalt hatte eine Begründung: Das Dunkel war die Nacht im Feldlager, und Papier war den amtlichen Momenten vorbehalten — der Wechsel dunkel → hell machte den Beförderungsbescheid von allein feierlich. **Wird alles hell, stirbt dieser Effekt.** Er ist deshalb ersetzt worden: Alltag auf **Feldpapier** (gebräunt, gekörnt), Amtliches auf **Kanzleipapier** (heller, glatter, Doppellinie, Vordruckkopf, **Lacksiegel**). Aus „dunkel → hell" wurde **„Feldpapier → Kanzleipapier"**.

### Der unsichtbare Schritt zuerst

Die vierundvierzig Festfarben des Sichtfelds wurden in **eine Tabelle `STICH`** gezogen — **die Namen sind Rollen, keine Farben**, damit `WASSER` `WASSER` bleibt, ob nachtschwarz oder als Lavierung. Dieser Schritt änderte nichts Sichtbares und wurde **pixelgleich gegengeprüft** (fünf Bildschirme, identische Prüfsummen), bevor eine einzige Farbe wechselte. Ohne ihn hätte jeder Farbwechsel vierundvierzig Einzelfunde bedeutet.

### Das Sichtfeld ist jetzt ein Kupferstich

Gefechtsdarstellungen der Epoche *sind* Stiche und lavierte Skizzen. Sepia-Gelände auf Papierton, eigene Linie in Uniformblau, Feind in Siegellackrot, du in Bronze, Pulverdampf als graue Lavierung — auf hellem Grund funktioniert das besser als heller Nebel auf dunklem.

### Textur ohne eine einzige Bilddatei

Zwei `feTurbulence`-Filter als data-URI im CSS: feines Faserkorn und große Vergilbungswolken, dazu eine Vignette. **Zwei Fallen, beide bezahlt:** `feTurbulence` rauscht in *Farbe* — ohne `feColorMatrix saturate 0` liegen grüne und rosa Flecken auf dem Papier. Und `feFuncA intercept` ist die *Deckkraft*: Ein hoher Wert macht die Lage dunkler, nicht heller; die erste Fassung sah aus wie Schmutz.

### Kontraste neu gerechnet

Alles gegen das Feldpapier `#e9dfc6`, Schwelle 4,5 : 1 unverändert: Text 11,4 · Beschriftungen 6,2 · Probenzeilen 4,8 · Rot 6,0 · Grün 5,4 · Bronze 5,3. **Die Bedeutungsregel bleibt** — Grün ist Zugewinn, Rot ist Kosten, Bronze gliedert; nur die Töne wechseln, weil Farbe auf hellem Grund dunkel sein muss. **Gold wurde zu Bronze**, sonst wäre es unsichtbar.

**Eine Ausnahme:** Der Seitenkopf liegt auf dem Holz, nicht auf einem Bogen — dort ist die Tinte hell (11,9 : 1 gegen das Holz).

Nebenbei gefunden und behoben: Die Fußzeile nannte fest verdrahtet „Prototyp · zwei Feldzüge · Ränge 1–3" — derselbe Fehler wie im Titelkopf, jetzt ebenfalls aus den Daten. `wiki.html` trägt dieselbe Palette.

---

## 2026-07-28 — Der Titelbildschirm bewarb zwei Kapitel, während drei liefen

**Ein Fehler durch Unterlassung, gemeldet von der veröffentlichten Seite.** Der Satz „Prototyp · Italien 1796/97 · Ägypten 1798/99" stand wörtlich im Code — an zwei Stellen, im Kartenkopf und im Untertitel. Beim Bau von Kapitel 3 wurde er nicht mitgezogen: Die Startseite warb für zwei Kapitel, während `index.html` drei lud.

**Deshalb steht die Zahl jetzt nirgends mehr geschrieben** (`gebauteKapitel()`) — sie kommt aus `KAMPAGNEN.filter(k=>k.gebaut)`. Das ist genau die Sorte Fehler, die kein Test findet, weil kein Test einen Werbetext prüft; die einzige Abhilfe ist, den Text nicht zu schreiben.

Drei Kleinigkeiten dabei mitgenommen:

- **Die Kokarde sitzt jetzt auch auf dem Titelbildschirm.** Sie war nur zu sehen, wenn ein Feldzug lief — ausgerechnet auf der Seite, die Fremde als Erstes sehen, fehlte das Epochenzeichen. Im Kartenkopf steht sie inline (`.ch .emblem`); `.emblem` selbst bleibt auf `display:block`, weil es in der Seitenleiste allein in seiner Zelle sitzt.
- **Der Handbuch-Link sah aus wie ein Link**, blau und unterstrichen, zwischen drei Knöpfen. Jetzt trägt `a.plain` dieselbe Prägung wie `button.plain`.
- **Garnison lief in `KAMPAGNEN` unter „1800–04"**, das Kapitel beginnt aber im Oktober 1801. Korrigiert; die Jahresspanne im Untertitel schreibt das Endjahr wieder aus („1796–1804" statt „1796–04"), und das Jahrhundert kommt vom Anfangsjahr des *letzten* Kapitels — mit dem des ersten wäre aus 04 die Zahl 1704 geworden.

---

## 2026-07-28 — Die Leiter der Sichtbarkeit, der Ehrensäbel, die Kompanie-Ebene im Entwurf

**Die Nennung im Tagesbefehl war ein Würfelwurf am Gefechtsende.** Jetzt ist sie die mittlere von drei Stufen, und alle drei werden verdient.

### Bronze, Silber, Gold — historisch eingekleidet

Napoleons Armee kannte keine gestuften Tapferkeitsmedaillen, aber etwas Besseres: **eine Leiter der Sichtbarkeit.** Wer etwas tat, wurde gemeldet; die Frage war nur, wie weit nach oben.

| Stufe | Heißt | Bedingung | Wirkung |
|---|---|---|---|
| 1 | **Lob vor der Front** | Schaden ≥ 60 *oder* ein Ereignis | Kameradschaft +4 · **kein Ruf** |
| 2 | **Nennung im Tagesbefehl** | Schaden ≥ 100 **und** überwiegend ungedeckt · *oder* zwei Ereignisse | +1 Nennung |
| 3 | **Bulletin der Großen Armee** (ab 1805; vorher „dem Oberbefehl gemeldet") | Schaden ≥ 150 *oder* Sondermission voll bestanden *oder* Ereignis vor der Linie im Höhepunktgefecht | **+2 Nennungen** · Ruf +4 |

Der Name der dritten Stufe schaltet mit der Epoche um, wie die Kokarde 1804 zum Adler wird.

**Gezählt wird der Schaden an der Feindmoral, nicht Tote.** Niemand zählt 1796 im Pulverdampf Gefallene, aber jeder sieht, wessen Abschnitt der Linie wankt. Der Beitrag der Linie zählt nicht mit — das ist nicht deine Tat. Nur die höchste Stufe je Gefecht, sonst wäre es Grinding.

### Die Sichtbarkeitsregel — der Zahn des Systems

*Gezählt wird nur, was aus dem Stand geschieht.* Wer kniet oder liegt, dessen Serie reißt und dessen Schaden zählt **halb**.

Historisch exakt: Im Rauch sieht niemand, wer gut zielt — gesehen wird, wer steht, wo geschossen wird. Mechanisch ist es die Bremse, ohne die alles kaputt wäre: **Man kann keine Auszeichnung aus der Deckung heraus erschießen.** Auszeichnungsjagd und Überleben ziehen an entgegengesetzten Enden desselben Seils — dieselbe Achse, auf der die Gefechts-Ereignisse stehen.

**Stufe 1 gibt bewusst keinen Ruf.** Die teuerste gelernte Regel des Projekts: Alles, was den Ruf hebt, hebt über die Schwellen auch den Aufstieg. Ruf +2 je gutem Gefecht wären über einen Lauf rund +30 — die Sergent-Quote ginge durch die Decke. Bronze zahlt in Kameradschaft und in die Zählung.

**Am Gefechtsende steht die Bilanz mit Zahlen** und, wenn es knapp war, der verfehlten Schwelle: „Eigener Anteil: 84. Für den Tagesbefehl hätte es 100 gebraucht — und man muss dabei stehen." Unsichtbare Schwellen fühlen sich wie Zufall an; dieselbe Überlegung wie bei den Proben, die Wert und Schwierigkeit schon auf dem Knopf zeigen.

### Der Ehrensäbel

Die goldene Ehrenwaffe, historisch seltener als das Ehrengewehr. **Bedingung: eine Sondermissions-Kette voll bestanden — jede Stufe, nicht die Mehrheit — und fünf Nennungen, Fenster 1799–1803.** +14 VP, Ruf +8, 1 F je Station; führt wie das Gewehr 1804 automatisch in die Ehrenlegion.

Er ist die einzige Auszeichnung, die an einer einzelnen benannten Tat hängt statt an einer Summe, und er gibt der gefährlichsten Handlung des Spiels endlich einen eigenen Preis.

### In KONZEPT §6 nachgetragen, noch nicht gebaut

**Auszeichnungen der Kompanie ab Rang 9** — Belobigung im Divisionsbefehl, die Kompanie im Bulletin, die Inschrift auf der Fahne. Dazu die zweite Gefechtsachse, die sie erst möglich macht: **jedes Gefecht bekommt einen Auftrag** neben der Feindmoral, und man kann siegen und ihn trotzdem verfehlen. Der Preis der Auszeichnung ist der Einsatz: Wer bei Austerlitz auf der Fahne steht, steht bei Eylau in der ersten Welle. Dazu die höheren Ordensgrade, die fremden Orden und die Dotationen ab Tilsit.

### Gemessen, je 40 Läufe — gegen denselben Stand ohne das System

| | Erstlauf v | mutig | Vet 160 |
|---|---|---|---|
| **überlebt** | 55 → **57 %** | 25 → **30 %** | 70 → **70 %** |
| **Sergent** | 23 → **25 %** | 25 → **28 %** | 78 → **70 %** |
| Punkte-Median | 61 → **93** | 60 → **87** | 203 → **194** |

Alle Leitzahlen im Rauschen; der Sergent beim Veteranen ist dabei von 78 zurück ins Band (60–75) gerutscht. **Der Punkte-Median des Erstlaufs steigt deutlich** — die Orden zahlen, und sie zahlen dem, der noch wenig hat, mehr als dem Veteranen. Der Überlebens-Abstand bleibt bei 13 Punkten und damit unter der 25er-Grenze; Ursache und Begründung stehen unverändert im Eintrag zu Kapitel 3.

Spielstand-Fassung 4 → **5** mit Wandler.

---

## 2026-07-28 — Kapitel 3: Garnison 1801–04, und die Orden

**Das dritte Kapitel, 17 Stationen, Nîmes und das Lager von Boulogne.** Dazu das Ordenssystem, ein Marketender und vier neue Zwischenfälle.

### Der Entwurf in einem Satz

**Im Krieg ist der Feind die Kugel. Im Frieden ist der Feind die Zeit.** Die Maschine bleibt dieselbe — Stationen, Proben, Saisons, am Ende sogar ein Gefecht —, aber der Einsatz ist nicht Blut, sondern Zukunft: Bildung, Geld, Beziehungen, Stand.

Die Gefahr war, aus vier Friedensjahren eine Verwaltung zu machen. Vier Hebel halten dagegen:

| Hebel | Was es tut |
|---|---|
| **Vier Saisons statt sechzehn Abende** | dieselbe Knappheit wie im Lager, auf Jahresmaßstab |
| **Das Duell hinter der Reitbahn** | die einzige Stelle im Spiel, an der eine **Szene töten darf** — man betritt sie freiwillig |
| **Das große Manöver** (`uebung:true`) | volles Kampfsystem mit Platzpatronen: dasselbe Spiel, andere Währung |
| **Die Decke hat ein Gesicht** | über dem Sergenten sitzt Martel, und der geht nicht weg |

**Die Regimentsschule ist das Nadelöhr.** Kapitel 3 ist das einzige Fenster, in dem ein Analphabet auf die 35 des Fourriers und in die Nähe der 50 kommt, die Rang 7 verlangt — der „Rangstillstand als Druckmittel" aus KONZEPT §9.

**Die Ehe ist Beiwerk, kein System**, genau wie KONZEPT §10 es festlegt: zwei Szenen, eine Mitgift, Belastung −1 je Station. Keine Kinder, kein Erbe.

### Orden — Nennungen bekommen endlich eine Folge

| Orden | Bedingung | VP | Ruf | Pension |
|---|---|---|---|---|
| **Ehrenwaffe** | 3 Nennungen, 1799–1803 | 10 | +6 | 0,5 F je Station |
| **Ehrenlegion** | eine Ehrenwaffe — *oder* 5 Nennungen und Ruf 45, ab 1804 | 12 | +10 | 1 F je Station |

**Historisch trägt sich der Bogen selbst:** Die *armes d'honneur* gingen 1799–1802 an einfache Soldaten für einzelne Taten — die Jahre von Ägypten. Wer eine besaß, wurde bei der Stiftung der Ehrenlegion **von Rechts wegen aufgenommen**; die erste große Verleihung war Boulogne, 16. August 1804. **Die einzige Auszeichnung, die man sich in einem Kapitel verdient und in einem anderen einlöst.** Geprüft, nicht gewürfelt — bei einem Orden soll man hinterher sagen können, wofür.

### Was an Code nötig war

Bewusst wenig, alles wiederverwendbar: Wochenverteilung **datengesteuert** (`WINTER_TUN`, Auswahl aus den Kapiteldaten), **Ketten in Szenen** (Semantik identisch zu den Sondermissionen), `heilt:` und `setzt:` in `anwenden()`, `uebung:true` im Gefecht, `zwischenfall:true` für Zwischenfälle ohne Marschweg, `ab:` als Sperr-Regel in Szenen. Spielstand-Fassung 3 → **4** mit Wandler.

Dazu der **Marketender** (Ausrüstung für Francs, nicht für Veteranenpunkte — die Grenze zieht Invariante 3) und vier Friedens-Zwischenfälle: **Patrouille**, Werber, Markttag, die kenternden Boote von Boulogne.

### Gemessen, je 40 Läufe

| | Erstlauf v | mutig | Vet 160 | Vet 260 |
|---|---|---|---|---|
| **überlebt** | 55 % | 25 % | 70 % | 63 % |
| **Sergent erreicht** | 23 % | 25 % | 78 % | 78 % |

Fünf der sechs Werte im Band, der Sergent beim Veteranen mit 78 % knapp über den 75.

> **⚠ Der Überlebens-Abstand ist auf 15 Punkte gefallen (vorher 30) und damit unter die selbstgesetzte Grenze von 25.** Ursache verstanden: Kapitel 3 tötet fast niemanden, *heilt* aber — Übergang, Lazarett, vier Saisons. Davon hat der angeschlagene Erstläufer mehr als der gesunde Veteran, also steigt die untere Zahl und die obere nicht.
>
> **Nicht schöngerechnet, sondern eingetragen.** Mit Kapitel 4 (Austerlitz, Feindgüte 6) endet die Kampagne wieder auf einem gefährlichen Kapitel, und der Abstand öffnet sich von allein. Die Regel daraus: **`überlebt` misst nur so scharf, wie das letzte gebaute Kapitel gefährlich ist** — endet der Ausbaustand auf einem ruhigen Kapitel, ist `Sergent erreicht` die aussagekräftigere der beiden.

---

## 2026-07-28 — Die volle Punkteskala, zwei neue Leitzahlen

**Zwei Entscheidungen des Entwicklers, beide umgesetzt und gemessen.**

### Die volle Skala löst die des Prototyps ab

```
vorher:  Rangwert + 2×Stationen + 5×(Ruf/10) + 3×Nennungen + 25 (lebend) + 10 (sauber)
jetzt:   Rangwert + 8×überlebte Kapitel + 5×(Ruf/10) + 3×Nennungen + 25 (lebend) + 20 (sauber)
```

**Der Anlass war ein Fehler, der erst mit den neuen Rängen sichtbar wurde.** `rangWert()` benutzte schon immer die volle Skala aus KONZEPT §5 — die Werte 0/12/26/42/62 stehen dort so —, die Zuschläge dagegen die des Prototyps. Solange die Ränge 4 und 5 unerreichbar waren, fiel das nicht auf. Seit sie erreichbar sind, **rechneten Rang und Zuschläge in zwei verschiedenen Skalen**: gemessener Spitzenwert **273 bei einer Ladensumme von 196**. Das war der *Anlass*, an dem es auffiel — die Rechtfertigung trägt sich selbst: **Zwei Skalen in einer Formel sind ein Fehler**, unabhängig davon, was der Laden kostet.

**Entschieden wurde, die Rangwerte zu behalten und die Zuschläge nachzuziehen** statt umgekehrt. Damit steht die ganze Wertung in einer Skala, und die vier noch fehlenden Posten (Ehrenlegion, fremde Orden, gestaffelter Überlebensbonus) haben ihren Platz schon frei.

**Ein Kapitel statt einer Station** (`kapitelUeberlebt()`). Die Prototypskala zahlte 2 VP je erreichter Station und belohnte den, der auf Station 30 von 32 fiel, fast wie den, der ankam. Die volle Skala zahlt je überlebtem Kapitel: **Ein Feldzug ist ein Feldzug, und ein halber ist keiner.** Daher der deutliche Rückgang des Medians — ein abgebrochener Lauf ist jetzt sichtbar weniger wert als ein vollendeter, und das war der Sinn.

**Der Überlebensbonus bleibt bei 25 und ist ausdrücklich ein Platzhalter.** Die vollen 70/120/180 ergeben erst Sinn mit dem freiwilligen Ausstieg an den Rangschranken — dann ist die Höhe des Bonus die Belohnung dafür, rechtzeitig aufzuhören. Ohne diese Entscheidung wäre er nur eine große Zahl für jeden, der nicht stirbt.

| Gemessen, je 40 Läufe | vorher | jetzt |
|---|---|---|
| Punkte-Median Erstlauf | 109 | **64** |
| Punkte-Median Veteran 160 | 218 | **192** |
| Höchster gemessener Lauf | 273 | **223** |

Der Laden kostet weiterhin 196, ein Spitzenlauf bringt 223. Alte Chronikeinträge bleiben lesbar: `wertungsTabelleAus()` zeigt für sie weiterhin die Stationszeile.

**Die Faustregel „Durchkommen ≤ halbe Ladensumme" ist für die Prototypphase ausgesetzt** *(Entscheidung des Entwicklers)*. Sie setzt einen ungefähr fertigen Laden voraus; es fehlen neun Kapitel und die ganze Ausrüstung ab Rang 7. KONZEPT §5 rechnet für die volle Wunschliste mit 1.010 VP — die 196 von heute sind ein Achtel davon. **Dass ein Spitzenlauf den Laden theoretisch leerkaufen kann, ist vorerst in Ordnung; die Antwort darauf sind mehr Posten, nicht eine kleinere Wertung.** Maßstab bleiben bis dahin die zwei Leitzahlen.

### Zwei Leitzahlen statt vier Zahlen ohne Maßstab

`test/balance.js` stellt jetzt zwei Zahlen voran, und nur die tragen Sollwerte:

| Sollwert | Erstlauf vorsichtig | Erstlauf mutig | Veteran 160 |
|---|---|---|---|
| **überlebt** | 40–55 % | 15–30 % | 70–85 % |
| **Sergent erreicht** | 15–30 % | 15–30 % | 60–75 % |

Gemessen: überlebt **43 / 20 / 73 %**, Sergent **18 / 20 / 70 %** — alle sechs im Band.

**„Italien überstanden" und der Caporal-Anteil sind als Sollwert ersatzlos gestrichen.** Das italienische Band 45–55 % liefert seit den Lebenspunkten 95–100 %: Italien ist das Lehrstück und *soll* fast jeden durchlassen. Der Caporal-Sollwert von 30 % war gegen ein Todesmodell geeicht, in dem ein Viertel der Männer die Beförderung nie erlebte; heute ist der Caporal der *unterste* erreichbare Aufstieg. Beide werden nur noch zur Einordnung mitgedruckt.

**Der Abstand zwischen Erstlauf und Veteran ist die eigentliche Zahl** — 30 Punkte beim Überleben, 52 beim Sergenten. Schrumpft einer unter 25, trägt die Leiter nicht mehr.

**Nebenbefund, der die Kostenkurve bestätigt:** Der Veteran mit 260 VP überlebt nicht besser als der mit 160 (68 gegen 73 %, im Rauschen), erreicht den Sergenten aber deutlich öfter (80 gegen 70 %). Die ersten 160 Punkte kaufen Konstitution und Muskete, also Überleben; die nächsten 100 kaufen nur noch das Nachschärfen einer Spitze, und die zahlt sich in Ruf aus. **Veteranenpunkte haben eine Sättigungsgrenze beim Überleben und keine beim Aufstieg** — genau so war `PRO_PUNKT` gedacht.

Beide Bänder sind zwei Kapitel tief und vorläufig; mit Kapitel 3 werden sie neu gesetzt.

---

## 2026-07-28 — Das Bild der Epoche, das Gefechtsfeld nach Rang, ein Handbuch

**Reine Darstellung — keine Balance-Zahl angefasst.** Gegengemessen: Erstlauf 50 %, Veteran 160 78 % (vorher 48/83) — im Rauschen.

**Napoleonisch statt „dunkles UI".** Ein Didone-Schriftstack für Überschriften und Kartenköpfe (nur Systemschriften, kein Download — das Spiel bleibt eine Datei), Kapitälchen statt Versalien im Titel, Mediävalziffern im Fließtext. **Alles, was im Spiel ein Schriftstück *ist*, sieht jetzt aus wie eines:** Chronikblatt, Wertung, Beförderungsbescheid und Todesblatt stehen auf gebrochenem Papierweiß mit Eisengallustinte, Doppellinienrahmen und einem Vordruckkopf („République Française · 32. Demi-brigade de bataille"). Kontrast geprüft: 11,4 : 1 und 6,2 : 1, beide über der Projektschwelle. Dazu die **Trikolore-Kokarde** im Seitenkopf, die ab 1804 zum **Adler** wird — das UI erzählt den Epochenwechsel selbst —, und die Seitenleiste heißt jetzt *Livret militaire*.

**Das Gefechtsbild richtet sich nach dem Rang.** Ein Füsilier sieht eine Linie; ein Caporal sieht seine acht heller als den Rest, mit einem Fanion darüber; ein **Sergent steht hinter dem Glied** (dort stand der serre-file), und vor ihm stehen seine zwanzig als eigener Block, während die übrige Linie ins Dunkel fällt. **`K.sektion` wird als stehende Männer gezeichnet, nicht als Balken** — von zwanzig stehen vierzehn heißt, dass sechs vor dir liegen. Sinkt die Sektion unter 70 %, tritt ein **Wankender** sichtbar aus dem Glied, und der Knopf „Den Wankenden herausziehen" zeigt auf etwas, das man sieht. Die Abrechnung nach dem Gefecht ist ein **Appell-Bild**: zwanzig Silhouetten, die Gefallenen liegend.

**Gelände und Formation je Gefecht** (`gelaende`, `formation` in den Kapiteldaten): die Brücke von Lodi mit Pfeilern und Fluss, der Damm von Arcole zwischen Wasser, die Zinnenmauer mit Bresche bei Akkon und Alexandria, Palmen und Pyramidenkegel in der Wüste. **Embabeh wird ein Karree von innen** — vier Fronten, kein Rücken, und der Feind sind Reiter, die außen vorbeiziehen. Dazu Mündungsblitze nach einer Salve und ein Schleier, der ab Runde 5 das hintere Feindglied verdeckt. Alles zustandsgesteuert: **In `sichtfeld()` wird weiterhin nichts gewürfelt.**

**Zwei Anachronismen behoben.** Das Gefechts-Ereignis heißt jetzt „Der Fahnenträger fällt" — die Halbbrigaden von 1796 trugen Fahnen, die Adler kamen 1804. Und der Erklärtext der Feldchirurgie behauptete „in diesem Kapitel noch ohne Verwendung", obwohl sie längst an zwei Stellen geprüft wird; das war eine Falschauskunft an genau der Stelle, an der man entscheidet.

**Das Handbuch liegt jetzt im Repo** (`wiki.html`) und ist vom Titelbildschirm aus erreichbar. Inhaltlich nachgezogen: die Kette über dir, die Ränge 4 und 5 mit beiden Wegen, die Sektion, die neuen Messwerte. **Zehn der zweiundvierzig offenen Punkte sind erledigt und herausgenommen** (Ränge 4/5, Personenkartei, Fürsprecher-Tod, Sergent-Vakanz, Feldchirurgie-Text, README-Hinweis, vier Dokumentationsfehler), **zwei neue sind durch den Bau entstanden** — die gemischten Punkteskalen und die drei Leitzahlen ohne Sollwert.

---

## 2026-07-28 — Die Kette über dir, Rang 4 und Rang 5

**Gunst ist keine Zahl mehr, sondern eine Beziehung je Person** (−5…+5, wie KONZEPT §8 es immer vorsah, aber nie gebaut war). Vier Männer, die ganze Laufbahn lang dieselben: Sergent Martel, Fourier Collot, Lieutenant Berthaud, Capitaine Vernet — jeder mit eigener Gunst, eigenem Erklärtext und einem Block „Über dir" in der Seitenleiste.

**Die Kette rückt mit.** Wer über dir steht, bleibt über dir, weil er selbst aufsteigt: Martel ist dein Sergent, solange du Füsilier bist, und Sergent-major, wenn du Sergent wirst. Man lernt in einer Karriere vier Gesichter kennen, nicht vierzehn. Ein neues gibt es nur, wenn eines fällt — in Höhepunktgefechten mit 22 %, und der Nachfolger tritt an der nächsten Station an, mit **Gunst 0**. Genau deshalb pflegt man zwei Beziehungen, nicht eine.

**Die Leiter** prüft Ruf, einen Fürsprecher mit Gesicht und eine Vakanz: Caporal (Ruf 30 · Martel 4), Caporal-fourrier (Ruf 35 · Collot 3 · **Bildung 35**), Sergent im Feldweg (Ruf 62 · Berthaud 5) oder im Listenweg über den Fourrier (Ruf 52 · Berthaud 4). `leiterZiel()` bietet den höchsten Eintrag an, den man tatsächlich erfüllt — dadurch ist der Fourrier ein **Seitenweg, kein Pflichtglied**, und Überspringen kostet keine Wertung.

**Die Vakanz wird angesagt, nicht geschenkt.** Sobald die Zahlen für den Sergenten stimmen, fällt der Sergent-major **im nächsten Gefecht**, nicht auf dem Bildschirm, auf dem die Zahlen stimmen. Danach rückt Martel auf, und seine alte Stelle ist die, die du bekommst. Invariante 5 wandert damit eine Stufe nach oben, bleibt aber intakt: Am Anfang der Kette steht weiterhin ein Toter.

**Rang 4 — die Listen:** „Die Listen der Kompanie führen" (Verwaltung, Fürsprache bei Collot und Berthaud — oder ein Rüffel) und „Die Ausgabe verteilen" (Kameradschaft gegen Fürsprache, die erste Handlung, die beide Währungen gegeneinanderstellt). Keine neuen Kampfknöpfe — das ist der Witz an ihm.

**Rang 5 — die Sektion:** `K.sektion` als eigene Größe, vier neue Kampfknöpfe statt der Caporal-Befehle (Salve auf Kommando, Glieder wechseln, den Wankenden herausziehen, schließen und halten), Verluste je Runde und eine **Abrechnung nach dem Gefecht**: unter neun Verlusten von zwanzig gibt es Fürsprache, ab neun kostet es welche. Zum ersten Mal kann man ein Gefecht gewinnen und trotzdem verlieren. Im Lager dazu „Rekruten aussuchen" und „exerzieren lassen". Neue Station **Katia** zwischen Rückzug und Abukir; Abukir ist damit das erste Sektionsgefecht.

**Ein Henne-Ei-Fehler, gemessen gefunden.** Die erste Fassung erreichte in 120 Läufen **0 % Fourrier und 0 % Sergent**. Alle bestehenden Gunst-Quellen liefen ohne Angabe und damit an Martel; Collot und Berthaud bekamen Fürsprache nur aus Handlungen, die es erst *ab* Rang 4 gibt. Behoben durch zweierlei: Die Szenen und Zwischenfälle wurden nach Inhalt zugeordnet (Fourier-Szenen an Collot, Offiziers-Szenen an Berthaud), und **`anerkennung()` gibt einmal je Gefecht Berthaud +1** — der Lieutenant führt die Liste der Namen. Gefunden wurde es, indem ich alle Gunst-Quellen des Spiels aufgelistet habe, statt an den Schwellen zu drehen. Dieselbe Regel wie beim Güte-Fehler: **Bewegt sich nichts, misst man den Mechanismus.**

**`LAUF_FASSUNG` 2 → 3** mit Wandler: Die alte Gunst-Zahl wird zu Martels Beziehung, die drei anderen fangen bei null an.

| je 40 Läufe | Erstlauf v | Erstlauf m | Veteran 160 | Veteran 260 |
|---|---|---|---|---|
| beide Feldzüge | 48 % | 23 % | **83 %** | 73 % |
| Caporal erreicht | 48 % | 48 % | 88 % | 95 % |
| **Fourrier / Sergent erreicht** | 20 % | 33 % | **65 %** | **68 %** |
| Punkte, Median | 106 | 112 | 207 | **226** |

Offen und dokumentiert: Fourrier und Sergent sind im Prototyp faktisch gekoppelt — wer in Kairo die Listen bekommt, hat bis Katia den Ruf ohnehin zusammen. Der Review-Vorbehalt für Kapitel 3 steht in `CLAUDE.md`.

---

## 2026-07-28 — Fehlerdurchsicht: siebzehn Funde, vier davon schwer

Drei unabhängige Durchsichten über den ganzen Baum, jeder Fund am Code belegt und vor der Reparatur im Browser nachgestellt.

**1 — Ein Toter durchlief den kompletten Stationsabschluss.** Jeder Gefechtstod ging über `kampfEnde()`, den Abschluss einer *bestandenen* Station: Der Gefallene bekam die Niederlagen-Wirkung (Ruf −4 bis −6, kostete echte Veteranenpunkte), der Feldscher nähte ihm eine Wunde, `stationErledigt()` heilte ihn um 5 % (er stand mit „Leben 4 von 64" im Chronikblatt), zählte die **nächste** Station (+2 VP, die der Rückzugstod nicht bekam), trug das Datum der Folgestation ein und schrieb noch einen Spielstand des Toten. Neu: `gefallen()`, das nichts davon tut. **Dass der Rückzugstod all das nie tat, war der Beweis, dass es ein Versehen war.** Nebenbei behoben: `zeigeTod()` überschrieb den gerade gebauten Bildschirm — **sämtliche Todestexte der Sondermissionen waren unerreichbar** und sind es jetzt nicht mehr.

**2 — Die Krankheit war wirkungslos.** Zehrung und Zeitheilung sind Summanden in derselben Funktion; der Kommentar „zehrt vorher, sonst hebt sich beides auf" war falsch gerechnet. Bei Konstitution 70 mit Sumpffieber standen +4 gegen −3: Ein Kranker **gewann** einen Punkt je Station. Jetzt bekommt ein Kranker keine Zeitheilung, und die Klemme sitzt auf der Summe statt je Wunde (bei zwei Krankheiten verschluckte sie die Hälfte). Dazu würfelt die Konstitutions-Probe im Lager ohne Übungseffekt — vorher trainierte ausgerechnet der Kranke seinen Lebensvorrat.

**3 — Ein fehlgeschlagenes Chronikladen vernichtete die Chronik.** Blieb `META` leer, überschrieb das erste `chronikSichern()` (läuft an jeder Station) die gute Datei, das zweite die `.bak`-Generation: nach zwei Stationen alle Veteranenpunkte weg. Neu: `CHRONIK_GESPERRT` schreibt nichts, bis der Spieler ausdrücklich verwirft; der Titelbildschirm erklärt es. Außerdem führt `dateiEinlesen` `vp` und `laeufe` per `Math.max` zusammen, statt sie zu ersetzen — eine alte Datei senkte den Vorrat.

**4 — `esc()` maskierte keine Anführungszeichen.** Das Namensfeld ist die einzige Stelle mit Spielertext in einem Attribut; ein Name mit `"` brach es auf.

**Reihenfolge-Regel, an drei Stellen falsch:** erst die Wunde entfernen, dann auffüllen — `lebenMax()` schrumpft mit offenen Wunden. Das Jahr Garnison lieferte 68 statt 82 Leben, obwohl „voll" dastand; Winterwoche und Lagerabend ebenso.

**Weitere Reparaturen:** Kniegrenze zählte über Ereignisrunden hinweg falsch (wer im Ereignis vorging, galt danach als kniend) · `S.belastung += 7` beim Bajonett-Fehlschlag ungeklemmt (bis 126 möglich) · Namensfeld hielt den Weiter-Knopf nicht aktuell (Mann ohne Namen möglich) · „Neuer Rekord" schon bei Gleichstand, weil gegen das bereits angehobene Maximum verglichen wurde · Doppelklick-Wächter in `marschWaehlen` und `ereignisWaehlen` · unbekannte Ereignis-ID wurde beim Fortsetzen ewig mitgeschleppt · `RANG.findIndex('Voltigeur')` = −1 überschrieb Voltigeur-Einträge mit „Fusilier" · Prüfsumme galt ohne Feld als heil · `wandle()` konnte bei einem fehlerhaften Wandler endlos laufen · `lebenGrund()` rechnet über `lebenMax()` statt die Formel ein drittes Mal zu schreiben · Konstitution 0 wurde als 20 gelesen · Seitentitel nannte nur Italien.

**`tornister_gut` (24 VP) hatte keine Wirkung** — der einzige Kauf ohne Anbindung. Neu: halbiert, was der Anmarsch an Atem kostet („zwei Tage Proviant"). Bei Akkon sind das 4 statt 8.

**Testfehler behoben:** `test/spielstand.js` schlug seit dem Einbau der Marsch-Zwischenfälle mit 35 % Wahrscheinlichkeit fehl, weil auch die erste Station einen Marschweg hat und dort ein Zwischenfall vor dem Lager stehen kann. Der Test räumt ihn jetzt ab.

**Bewusst nicht geändert:** Ausrüstungskäufe (Muskete +8, Bajonett +5) werden weiterhin **nach** der 60er-Fertigkeitsgrenze addiert und dürfen sie überschreiten — sich mit Veteranenpunkten über den Startdeckel zu schieben, ist ein gewollter Weg, sie auszugeben. Geklemmt wird nur die absolute 100, weil `nutzen()` darüber aussteigt.

**Offen und dokumentiert, keine Reparatur:** Der Datei-Export ist ein Rücksetzpunkt (im Lager sichern → sterben → Datei laden). Mit einer maßgeblichen Datei ist das prinzipiell nicht zu verhindern, und CLAUDE.md hält Schummelschutz auf dem eigenen Rechner ohnehin für aussichtslos.

**Gemessen nach allen Reparaturen (je 40 Läufe, beide Feldzüge überstanden):** Erstlauf vorsichtig 50 %, Erstlauf mutig 18 %, Veteran 160 VP 68 %, Veteran 260 VP 68 %. Die Progression steht unverändert; Ägypten ist durch die reparierte Krankheit für den Mutigen etwas härter geworden (18 statt 20 %).

---

## 2026-07-28 — Progression über Läufe: Pool 60, Feindgüte, drei Messungen

**Das Ziel:** Der erste Mann soll Ägypten mit hoher Wahrscheinlichkeit nicht überleben, und Gegner, gegen die man am Anfang chancenlos ist, sollen im dritten oder vierten Lauf zu schlagen sein. Umgesetzt in drei Teilen, in dieser Reihenfolge gebaut und je einzeln gemessen.

**1 — Der Verteilungspool sinkt von 120 auf 60** (`POOL` in `src/oberflaeche.js`). Vorher reichte er für zwei Attribute auf 70 *und* Reserve; ein Erstlauf-Mann war so gut ausgestattet wie ein Veteran, und die Veteranenpunkte waren Zierde — der Testbot gewann alles, ohne einen einzigen zu kaufen. Mit 60 reicht es für ein gutes Attribut und ein halbes; die Elitegrenze 55 wird zur Entscheidung. Der Schritt ist 10, der Pool muss also durch 10 teilbar sein.

**2 — Feindgüte je Kampagne** (`guete` in `grundwerte.js`, `feindGuete()` in `src/kampf.js`): eine Zahl, die drei Dinge zugleich schaltet — Trefferchance (`+guete`), wie stark die eigene Linie von allein hilft (`× max(0,3; 1 − guete·0,15)`) und die eigenen Verluste (`× (1 + guete·0,15)`). Italien 0 (Eichung), **Ägypten 5**. Der Linien-Hebel ist der eigentliche: Je weniger die Linie von allein schafft, desto mehr entscheidet die eigene Feuerkraft über die Länge des Gefechts — und genau die kaufen Veteranenpunkte. Die Werte ab Austerlitz (6 bis 12) sind eine entworfene Kurve für ungebaute Kapitel und ausdrücklich ungemessen.

**3 — Der Rückzugszoll wächst mit der Güte** (`× (1 + guete·0,2)`, in Ägypten also doppelt: 10–36 Leben je verlorenem Gefecht). Das trifft genau den Richtigen: Ein Veteran gewinnt seine Gefechte und zahlt nie, ein Rekrut mit Muskete 10 verliert sie und zahlt fünfmal.

**Dazu ein neuer Messmodus:** `VP=160 node test/balance.js 40` setzt einen festen Vorrat und gibt ihn nach fester Rangfolge aus. Ohne ihn ließe sich nach dem Pool-Umbau nur noch der erste Lauf messen. Fest deshalb, weil ein mitwachsender Vorrat die Messung wandern ließe.

| je 40 Läufe | Italien | beide Feldzüge | Tote | Elite | Caporal | Punkte |
|---|---|---|---|---|---|---|
| Erstlauf, vorsichtig | 95 % | **43 %** | 23 | 48 % | 45 % | 106 |
| Erstlauf, mutig | 100 % | **20 %** | **32** | 55 % | 45 % | 115 |
| Veteran 160 VP | 100 % | **68 %** | 13 | 93 % | 88 % | 185 |
| Veteran 260 VP | 100 % | **75 %** | 10 | 95 % | **100 %** | 188 |

**Ein Fehler, der drei Messreihen wertlos gemacht hat.** `STATIONEN.italien = KAPITEL` meldete die Stationen **ohne Kopie** an; Kapitel 2 hängt mit `KAPITEL.push(...)` an dasselbe Array an, also wuchs `STATIONEN.italien` still auf alle 32 Stationen. `feindGuete()` fand damit für jedes Gefecht zuerst Italien und lieferte immer 0 — zwei Balance-Runden wurden gegen ein totes System gemessen. Derselbe Fehler zeigte im Verlauf links ägyptische Stationen unter Italien. Behoben mit `.slice()` in beiden Kapiteldateien.

Gefunden wurde er erst, als ich aufgehört habe zu erklären, warum die Zahlen sich nicht bewegen, und stattdessen den Hebel selbst ausgelesen habe. **Regel: Bewegt eine Änderung dreimal nichts, misst man den Mechanismus, nicht das Ergebnis.**

---

## 2026-07-28 — Fünf Hebel gegen die Unsterblichkeit

Ein kundiger Spieler war nicht zu töten (40 von 40 überlebten beide Feldzüge). Der Grund war eine Bilanz, keine Einzelzahl: über 200 Punkte Genesung je Lauf gegen rund 70 Punkte Schaden. Fünf Hebel, die ineinandergreifen, statt am Schaden zu drehen:

1. **Offene Wunden verkleinern den Vorrat** (`lebenMax()`): je Abzugspunkt 0,6 Leben weniger, Boden bei 40 %. Das schließt die eigentliche Lücke — Leben heilt schnell nach, Wunden wird man nur langsam los. Zwei alte Wunden heißen 66 statt 82 Punkte und über den Atem-Deckel entsprechend weniger Luft. Der Boden verhindert die Todesspirale: Wunden machen kleiner, nie tot.
2. **Krankheit zehrt** (`zehrt:` in den Kapiteldaten): Sumpffieber 3, Hitzschlag 3, Ruhr 4, Fieber aus Jaffa 4 — je Station, bis sie behandelt ist. Tötet nie selbst (Klemme bei 1), liefert aber einen leeren Mann am nächsten Gefecht ab. Heilbar nur im Lager (Konstitutions-Probe 35) oder in einer Winterwoche; der Feldscher kann es nicht — eine Ruhr näht man nicht zu. Das ist die Einlösung von „Krankheit gefährlicher als Kugeln" aus KONZEPT.md.
3. **Ruf zieht Ereignisse an**: 45 % + Ruf/400, gedeckelt 65 %, und ab Ruf 30 ein drittes Ereignis je Gefecht. Wer gesehen wurde, wird geholt — der Adjutant sucht keine Unbekannten. Trifft den Aufsteiger, lässt den Vorsichtigen in Ruhe.
4. **Der Platz des Toten**: ab Caporal +2 Gefahr je Runde. Er steht außen am Glied, wo sein Vorgänger stand, und die Stelle wurde frei, weil der fiel. Invariante 4 bleibt gewahrt — die Zahl ist der Preis des Rangs, nicht seine Macht.
5. **Höhepunkte** (`haerte:1.4`): ein bis zwei Gefechte je Feldzug mit +40 % Schaden **und** +3 Gefahr — Lodi (15→18), Arcole (14→17), Embabeh (12→15), Akkon (14→17). Es sind dieselben vier, die eine Sondermission tragen: Das Gefecht, für das man berühmt wird, ist das, an dem man stirbt. Angesagt im Lagebild, überrascht wird niemand. Die +3 Gefahr sind der einzige Hebel, der auch den Vorsichtigen trifft.

Gemessen (je 40 Läufe): **vorsichtig 98 % / 1 Toter / Caporal 83 % / Median 199 · mutig 93 % Italien, 78 % beide Feldzüge / 9 Tote / Caporal 85 % / Median 192, Spitze 240.** Zwischenmessung ohne die Höhepunkt-Gefahr: 100 % / 100 %, 0 gegen 8 Tote — die +3 Gefahr sind das, was den Vorsichtigen erreicht.

---

## 2026-07-28 — Elf Zwischenfälle auf dem Marsch, mit Sperr-Sätzen

**Zwischen den Stationen kann jetzt etwas passieren** (`MARSCH_EREIGNISSE`, 35 % je Station mit Marschweg, jeder einmal je Lauf, nie vor Gefechten): der Verbandsplatz nach dem Gefecht, Briefe für die Kameraden, die durchgehende Protze, die Nachtwache, Karten um Sold, Requisition mit Quittung, der kranke Nebenmann — und in Ägypten der halbe Brunnen, das reiterlose Mamlukenpferd, die Karte des Ingenieurs, der Basar von Kairo. Ein Zwischenfall tötet nie (Leben klemmt bei 1); er kostet Blut, Atem, Geld oder Ruf und gibt Kameradschaft, Gunst und Fertigkeiten.

**Die Sperr-Regel ist neu:** Wer eine Probe erkennbar nicht bestehen kann (`ab:{min, sonst}`), bekommt keinen Knopf, sondern einen Satz — „Du musst verneinen, wie fast alle." Geprüft gegen `wert()`, ein Verwundeter kann also Wege verlieren.

**Feldchirurgie, Reiten, Kartenkunde und Bildung haben damit ihre erste Verwendung** — die Einlösung des dritten Erschaffungs-Exploits: Die Herkünfte, die in diese Währungen zahlen (Fuhrmann, Schreiber), sehen jetzt etwas dafür.

Gemessen (je 40): vorsichtig 95 % beide Feldzüge, 2 Tote · mutig 95 %, 2 Tote, mehr Elite (93 gegen 80 %) und mehr Punkte. Die Zwischenfälle kosten auch den Vorsichtigen.

---

## 2026-07-28 — Sondermissionen sind Ketten: Proben, die sofort bluten

**Der riskante Weg der vier Sondermissionen ist jetzt ein Gang aus zwei bis drei Proben** (`kette:` statt `probe:`), und jeder Fehlschlag kostet sofort 12–20 Leben — Akkon: Rampe (Geschick 40) → Bresche (Bajonett 45) → Rückweg (Kaltblütigkeit 45), Worst Case rund 50 Punkte in einem Zug. Wer unterwegs auf null fällt, fällt dort, mit eigenem Todestext („Gefallen in der Bresche von Akkon", „Im Sumpf von Arcole geblieben", „Im Karree bei Embabeh gefallen", „Gefallen auf der Brücke von Lodi"). Zurück gibt es ab der ersten Stufe nicht.

Die Wirkung am Ende braucht die Mehrheit der Stufen. Auch der Misserfolg gibt Ruf +2 und eine Tat — hingegangen ist hingegangen; die großen Belohnungen (Nennung, Ruf +6/+7) gibt es nur für den ganzen Gang. Auf dem Knopf stehen alle Stufen mit Wert und Schwierigkeit.

**Damit trägt die Risiko-Achse zum ersten Mal messbar:** je 40 Läufe — vorsichtig 100 % überstanden, 0 Tote, Caporal erreicht 85 % · mutig 90 % beide Feldzüge, **4 Tote**, Caporal erreicht **95 %**. Mut kostet Leben und kauft Rang. Das ist auch die erste Stelle, an der das Spiel einen kundigen Spieler töten kann.

---

## 2026-07-28 — Zeit heilt, Atem folgt dem Leben, Knien hat eine Grenze, vier Sondermissionen

**Geheilt wird jetzt von allein, mit der Zeit:** +5 % des Vorrats je Station (`stationErledigt()`). Die Lagerabende bleiben unverändert — Entscheidung: Die Härte soll aus Entscheidungen kommen, nicht aus Verwaltungsknappheit. Erste Fassung war 8 %; damit fraß die Zeit den Blutzoll des Rückzugs wieder auf (gemessen: mutig 1 Toter statt 4 bei 40 Läufen), auf 5 % gesenkt.

**Der Atem steigt nie über die Lebenspunkte** (`atemKlemmen()`, nach jeder Änderung an Atem oder Leben gerufen). Mit 25 Leben stehen einem höchstens 25 Atem zu — unter der Warnschwelle, nahe am Malus. Ein Schwerverwundeter kommt von allein wieder hoch, aber bis dahin kämpft er als der, der er gerade ist. Nebenwirkung, die Absicht ist: Konstitution kauft jetzt auch Luft — ein Gesunder mit Konstitution 70 hat höchstens 82 Atem.

**Knien höchstens drei Runden am Stück** (`K.duckFolge`): zwei Runden fragt niemand, die dritte kostet Ruf −2 („Martel sieht her, sagt nichts und merkt es sich"), die vierte ist gesperrt, bis man eine Runde etwas anderes getan hat. Der Blutzoll machte Aussitzen teuer, die Kniegrenze macht es unmöglich.

**Vier Gefechte haben eine Sondermission**, die es nur dort gibt (`nur:` in `GEFECHTS_EREIGNISSE`): die Brücke von Lodi (Spitze der Kolonne oder die Furt durch die Adda), der General im Sumpf von Arcole, der Riss im Karree von Embabeh, die Sturmkolonne von Akkon. Vorrang beim Würfeln und 60 % je Runde statt 45 — eine Sondermission, die fast nie stattfindet, wäre keine. Akkon fällt trotzdem nicht: Wer die Bresche überlebt, sieht die zweite Mauer.

Gemessen über je 40 Läufe: vorsichtig 100 % / 0 Tote / Caporal erreicht 85 % / Median 202 · mutig 98 % / 1 Toter / 88 % / 215 (Spitze 240 — die Sondermissionen zahlen). Die Härte-Frage bleibt als offener Punkt in `CLAUDE.md`, mit den verbleibenden Hebeln.

---

## 2026-07-28 — Ereignisse im Gefecht: wie weit gehst du

**Sechs Ereignisse unterbrechen die Rundenaktionen mit einer Frage.** Der Adjutant sucht acht Mann für die Geschütze auf dem Hügel. Die Linie wankt. Sie kommen im Laufschritt, vierzig Schritt, für einen Schuss reicht es noch. Der Adlerträger fällt und der Adler steht schräg im Dreck, sechs Schritt vor der Linie. Jemand ruft, vier Schritt vor der Linie, und hat keine Luft für laut. Sie gehen, und ein Bataillon, das man laufen lässt, steht morgen wieder da.

Jedes hat einen Weg, der nichts kostet und nichts bringt, und einen, der Moral, Ruf und Nennungen bringt — und bei Misserfolg 22 bis 34 Lebenspunkte, also ein Viertel bis ein Drittel des Vorrats. Die Verfolgung entscheidet das Gefecht bei Erfolg sofort. Höchstens zwei je Gefecht, ab Runde 2, jedes nur einmal, Wurf 45 % je Runde.

**Warum das statt an Schadenszahlen zu drehen:** Ein kundiger Spieler war nicht zu töten, weil optimales Spiel keine Frage mehr offenließ — Salve befehlen, knien, wenn es eng wird, fertig. Die Härte soll nicht daher kommen, dass Kugeln mehr wehtun, sondern daher, dass der Weg nach oben durch Stellen führt, an denen man auch bleiben kann.

**Ein verlorenes Gefecht kostet jetzt Blut** — 5 bis 18 Punkte, je nachdem, wieviel vom Feind noch steht. Ohne das waren die Ereignisse zahnlos: Wer unter 40 % fiel, kniete sich hin (Restgefahr etwa 4 %), ließ die Runden auslaufen und schlief sich im Lager wieder hoch. Gemessen null Tote in 80 Läufen, mutig wie vorsichtig. Wen es unter null drückt, den trägt es auf dem Rückzug.

**`balance.js` misst deshalb zwei Gemüter**, `MUT=1` sucht das Risiko statt es zu meiden. Der Abstand zwischen beiden Zahlen ist die Balance der Ereignisse. Gemessen über je 40 Läufe:

| | Italien | beide Feldzüge | gestorben | Caporal erreicht | Punkte-Median |
|---|---|---|---|---|---|
| vorsichtig | 100 % | 98 % | 1 | 88 % | 204 |
| mutig | 95 % | 90 % | 4 | 85 % | 211 |

**Der Abstand stimmt, die Höhe nicht — und der Grund liegt nicht im Gefecht.** Kapitel 1 bietet 7 bis 10 Lagerabende (je ≈20 Leben) und drei Winterwochen (je ≈49), zusammen über 200 Punkte Genesung, gegen rund 70 Punkte Schaden. Solange das so ist, kann kein Gefecht töten, das man überlebt hat — man schläft es weg. Der wirksamste Hebel ist damit die Zahl der Abende, nicht der Schaden; als offener Punkt in `CLAUDE.md` vermerkt, samt Reihenfolge der übrigen Hebel.

**Kleinkram:** Die Wahl steht auf dem Chronikblatt und in „Was gesehen wurde". Wer mitten in der Frage aufhört, steht beim Fortsetzen wieder vor ihr — sonst ließe sich eine Mutprobe durch Beenden und Fortsetzen umgehen, und das wäre dieselbe Lücke wie ein Rücksetzpunkt im Lager. Ruf aus Ereignissen geht an der Obergrenze von drei je Gefecht vorbei; die gilt für Handlungen, die man jede Runde wiederholen kann.

---

## 2026-07-28 — Der Testbot spielt jetzt gut, und das deckt etwas auf

**Gezählt wird der Rang, der *erreicht* wurde, nicht der, mit dem gestorben wird.** Die alte Zahl maß nach den Lebenspunkten vor allem, wann gestorben wird: Weil kaum noch jemand vor der Beförderungsstation stirbt, stieg der Endrang-Anteil auf 58 %, ohne dass die Beförderung leichter geworden wäre. `balance.js` merkt sich jetzt den höchsten Rang je Lauf und weist zusätzlich aus, wie viele die Elitekompanie erreicht haben.

**Der Bot würfelt seine Attribute nicht mehr aus, sondern verteilt sie bewusst:** Konstitution 70, Geschick 60, Kaltblütigkeit 40, Autorität 30. Beide Elitezweige offenzuhalten kostet 90 der 120 Punkte und ist es wert. Dazu eine Rangfolge für Gefecht, Lager, Winterquartier und Szenen: ruhen unter 60 % Leben, Fürsprache solange Gunst < 4, als Caporal immer die Salve, im Gefecht hinknien, wenn Blut oder Luft fehlen, in Szenen der Knopf mit dem größten Abstand zwischen Wert und Schwierigkeit. Veteranenpunkte kauft er weiterhin nicht — sonst wanderte die Messung, weil der Vorrat der beste Lauf bisher ist.

**Nebeneffekt, der die Messung brauchbarer macht:** Die Streuung ist weg. „Auswürfeln" maß vor allem den Zufallsgenerator — weil der Tod seit den Lebenspunkten eine Schwelle ist und der Vorrat an der Konstitution hängt, entschied der Wurf über den Lauf, bevor er begann (derselbe Stand: 48 %, 64 %, 51 %). Jetzt sagen 40 Läufe mehr als vorher 80, und ein Durchgang dauert drei Minuten.

**Und damit der Befund: Für einen Spieler, der weiß, was er tut, hat das Spiel derzeit keine Zähne.** Gemessen über 40 Läufe: **100 % überstehen Italien, 100 % überstehen beide Feldzüge, keiner stirbt.** Elitekompanie erreicht 90 %, Caporal erreicht 93 %, Punkte-Median 210 von 230 möglichen. Die alten 45–55 % waren nie die Härte des Spiels, sondern die Härte für einen Bot, der auswürfelte und sich nie ausruhte. Drei Dinge tragen den Unterschied: Konstitution 70 statt Zufall (82–94 statt 64 Lebenspunkte), kürzere Gefechte durch Salve und gezieltes Feuer (drei Runden statt acht, und Treffer kommen je Runde), und Ruhen im Lager (25 % je Abend).

**Der Sollwert 45–55 % ist damit hinfällig und in `CLAUDE.md` als offener Punkt vermerkt**, samt vorgeschlagenem Band (60–75 %) und den vier Hebeln nach erwarteter Wirkung: Schaden je Treffer, Gefahr-Werte der Gefechte, Heilung im Lager, Salven-Schaden. **Nichts davon ist gedreht worden** — die Zahlen des Spiels stehen unverändert, geändert wurde nur, was sie misst.

---

## 2026-07-28 — Lebenspunkte statt Todeswurf je Treffer

**Konstitution bestimmt jetzt, wie viel ein Mann aushält, statt ob eine Kugel ihn überhaupt töten kann.** Damit ist der letzte Rest des größten Erschaffungs-Exploits weg. Die alte Formel senkte die Todeschance je Treffer, und ab Konstitution 58 war sie rechnerisch null — eine Klammer hat das notdürftig geflickt, aber die Kurve blieb falsch. Neu: `lebenMax = 40 + Konstitution·0,6` (52 bei 20 · 64 bei 40 · 82 bei 70 · 94 bei 90), Schaden statt Todeswurf, Tod bei Leben ≤ 0. Die Kurve ist monoton — mehr Konstitution heißt mehr Treffer, die man wegsteckt, aber genug Treffer töten jeden.

**Deshalb darf die Herkunft die 70 wieder überschreiten.** Die zwischenzeitliche Deckelung von `neuerCharakter()` auf 70/60 war nur nötig, solange Konstitution Unverwundbarkeit kaufte. Konstitution 90 heißt jetzt 94 statt 82 Lebenspunkte: zwölf Prozent mehr Zähigkeit für eine Herkunft, die dafür anderswo zahlt. Die 70 begrenzt weiterhin Poolverteilung und Veteranenpunkte-Kauf.

**Getroffen wird ein Mann im ganzen Spiel nur rund neun Mal** — gemessen 8,9 bei 10 Gefechten und 57 Kampfrunden. An dieser Zahl hängt die ganze Eichung, und die erste Fassung hat sie verfehlt: 6 Schaden je Treffer plus ein Viertel Heilung nach jedem Gefecht ergab **100 % Überlebende bei 60 Läufen**, keinen einzigen Toten. Ein Treffer muss teuer sein.

| Fassung | Schaden je Treffer | Streifschuss | Heilung nach Gefecht | Italien überstanden |
|---|---|---|---|---|
| erste Eichung | ⌀ 6 | ohne Wunde | +25 % | **100 %** (60 Läufe) |
| zweite | ⌀ 12 | ohne Wunde | keine | 48 / 64 / 51 % (220 Läufe: 55 %) |
| dritte | ⌀ 12 | mit Wunde | keine | 41 % (80 Läufe) |
| **gültig** | **⌀ 11** (5–11 / 15–25) | **mit Wunde** | **keine** | **55 %** (80 Läufe) |

**Genesung ist eine Entscheidung, kein Geschenk** — dieselbe Regel wie beim Atem und aus demselben Grund. Der Feldscher näht nach dem Gefecht die leichteste Wunde zu, gibt aber keine Lebenspunkte zurück. Wieder auf die Beine kommt man im Lager („Schlafen und liegen bleiben", +25 %), im Winterquartier („Schlafen, essen, nichts tun", +60 %) und beim Jahr Garnison zwischen den Feldzügen (voll).

**Der Streifschuss kostet zweierlei, und das ist Absicht:** Blut (bleibt) und eine Wunde, die der Feldscher zunäht (bleibt nicht). Ohne die Wunde stimmte die Todesrechnung, aber ein Mann schoss den ganzen Feldzug wie am ersten Tag — der Caporal-Anteil stieg auf 57 %. Der Kratzer soll den Rest des Gefechts wehtun, nicht den Rest des Krieges.

**Die Wundenobergrenze 5 mit Verbluten ist ersatzlos weg**, sie war der zweite Todespfad. Eine Wunde aus einer Szene kostet 10 Lebenspunkte, tötet aber nie unmittelbar (`anwenden()` klemmt bei 1) — der Tod gehört ins Gefecht, wo er einen Text und einen Ort hat.

**Was der Umbau nebenbei abschafft: den frühen Tod.** Der Tod braucht jetzt fünf bis acht Treffer, also mehrere Gefechte; niemand fällt mehr in der zweiten Runde bei Montenotte. Kehrseite: Der gemessene Caporal-Anteil steigt auf 58 %, weil die Endrang-Zahl den Rang beim Tod mitzählt und kaum noch jemand vor der Beförderungsstation stirbt. Der alte Sollwert von 30 % war gegen ein Modell geeicht, in dem ein Viertel der Männer die Beförderung nie erlebte, und ist nicht unmittelbar vergleichbar. Als offener Punkt in `CLAUDE.md` vermerkt, mit den beiden ungemessenen Hebeln.

**Das Skript streut seitdem stärker:** derselbe Stand lieferte 48 %, 64 % und 51 %. Der Tod ist jetzt eine Schwelle statt eines Wurfs je Treffer, und wie nah ein Lauf an sie herankommt, hängt fast ganz an der ausgewürfelten Konstitution. Einzelmessungen unter 80 Läufen sagen noch weniger als vorher.

**`LAUF_FASSUNG` 1 → 2.** Ein angefangener Feldzug aus Fassung 1 bekommt den vollen Vorrat abzüglich dessen, was seine bleibenden Wunden gekostet haben, mindestens 30 %. Die Lebenspunkte stehen als eigener Balken in der Seitenleiste (grün, ab einem Drittel rot mit Warnung), im Lagebild vor dem Gefecht und auf dem Chronikblatt.

---

## 2026-07-27 — Chronikblatt und Anerkennung im Gefecht

**Die Namen in der Chronik sind anklickbar.** Dahinter steht der ganze Feldzug: Rangabzeichen, Herkunft, woran er gestorben ist, jede Entscheidung mit Ort, die Wertung und sein Zustand am Ende. `eintragen()` legt dafür ein `chronikblatt` an — die vier alten Felder stehen vorn, damit die Tabelle unverändert läuft, alles Übrige ist Zusatz. **Kein Fassungswechsel nötig:** Ältere Einträge ohne diese Felder bleiben lesbar und sagen es selbst („Von diesem Mann ist nur die Zeile geblieben").

**Anerkennung im Gefecht.** Jede Tat, die jemand sehen konnte, bringt sofort Ruf — sichtbar in der Rundenzeile und in der Seitenleiste, nicht erst am Ende. Getroffen +1, gezielt getroffen +2, stehen geblieben +1, mit dem Bajonett vor +2, eine Salve, die saß +1, die Linie geschlossen gehalten +1. Am Gefechtsende steht „Was gesehen wurde" mit jeder Tat einzeln. Obergrenze **3 je Gefecht** — über fünf Gefechte fünfzehn Punkte auf eine Schwelle von dreißig, und das ist schon viel.

**Ein Umweg, der nicht funktioniert hat.** Zuerst sollte das keine Zugabe sein, sondern eine Verschiebung: pauschaler Siegesruf minus vier, bis zu fünf im Gefecht zurückzuverdienen. Gemessen brach der Caporal-Anteil von 39 % auf 21 %, weil der Testbot sich nur etwa zwei Punkte je Gefecht zurückholt — und über den Rang fiel auch der zusätzliche Lagerabend weg. Zurückgenommen, der Siegesruf steht wieder bei 5 / 16 / 8 / 14 / 15.

**Zwei Messfallen, beide teuer bezahlt und jetzt in `CLAUDE.md` vermerkt:**

1. **Der Punkte-Median ist bei ~50 % Überlebensquote unbrauchbar.** Ein überstandener Lauf bekommt +35 pauschal; der Median springt um dreißig Punkte, sobald die Quote die 50 % kreuzt (gemessen 91 bei 43 %, 59 bei 36 % — dieselbe Mechanik). Ich hatte den Sprung als „die Männer sterben früher" gelesen. Er misst nur, ob der mittlere Lauf zufällig überlebt hat.
2. **Das Rauschen ist größer, als es sich anfühlt.** Derselbe unveränderte Stand lieferte an einem Nachmittag 49 % und 43 %. Bei 80 Läufen sind zwei Standardabweichungen elf Punkte. Wer weniger als zehn Punkte deutet, deutet Rauschen — dagegen hilft nur, den alten Stand per `git stash` noch einmal zu messen statt gegen eine Zahl von vorhin zu vergleichen.

**Gemessen über 120 Läufe:** überstanden 43 %, Caporal 34 %, Median 91. Derselbe Stand *ohne* die Anerkennung lieferte über 80 Läufe 43 % / 30 % / 91 — die Zugabe hebt also den Caporal-Anteil um rund vier Punkte und sonst nichts, genau wie beabsichtigt. Die 36 %, die zwischendurch zweimal auftauchten, waren Rauschen; genau dafür stehen die beiden Messfallen jetzt in `CLAUDE.md`.

---

## 2026-07-27 — Rang gibt Zeit, und die Befehle des Caporals bringen etwas

**Ab Caporal ein Lagerabend mehr, ab Sergent zwei** (`abendeFuer()` in `src/abschluss.js`). Im Spiel: Unteroffiziere sind vom Wachdienst und den Handreichungen befreit, die den Füsilier den halben Abend kosten. Im Entwurf: Ohne den zusätzlichen Abend verdrängt die rangeigene Handlung „Deine acht Mann drillen" die eigene Ausbildung, und der Rang fühlt sich an wie eine Strafe. Das ist die eine Stelle, an der ein Rang mehr gibt als einen Knopf — und sie ist nötig, damit der Knopf überhaupt drückbar ist.

**„Lücke schließen lassen" war sinnlos und ist es nicht mehr.** Vorher: Gefahr −14 und Kameradschaft +4 — während „Hinknien" jedem −22 Gefahr *und* +10 Atem gibt. Ein Rangbefehl, der schlechter ist als die Grundhandlung, ist kein Rangbefehl. Jetzt schützt Hinknien **dich**, die Lücke schützt **deine Leute**: Gefahr −8, und die eigene Linie verliert drei Runden lang halb so viele Männer — sichtbar an den blauen Figuren und der Waage im Sichtfeld. Dazu Kameradschaft +4 und beim ersten Mal je Gefecht Ruf +1; nur beim ersten Mal (`K.lueckeGelobt`), sonst ließe er sich in acht Runden achtmal einsammeln.

**„Salve befehlen" war schon immer die stärkste Aktion, nur stand es nirgends.** 26–36 Schaden gegen 12–20 bei einem eigenen Schuss, und die eigene Muskete bleibt geladen, weil die acht Mann feuern und nicht du — als Caporal wird man vom Schützen zum Befehlsgeber. Der Knopf sagt das jetzt.

| Stand | Läufe | überstanden | Caporal | Punkte-Median |
|---|---|---|---|---|
| volles Winterquartier | 80 | 44 % | 30 % | 86 |
| **zusätzlicher Lagerabend ab Caporal** | **80** | **49 %** | **39 %** | **95** |

Die Überlebensquote rückt in die Mitte des Bandes 45–55 %, der Anteil ohne jede Beförderung fällt von 56 % auf 43 % und damit nah an den Sollwert von 40 %. Der Caporal-Anteil steigt auf 39 % und steht neun Punkte über seinem Sollwert — gerade noch innerhalb der Zehn-Punkte-Regel, aber am oberen Rand; als offener Punkt in `CLAUDE.md` vermerkt. Der Weg dorthin ist mittelbar: Der zusätzliche Abend lässt mehr Beförderte den Feldzug überleben, und gezählt wird der Rang am Ende.

Der Testbot nimmt im Gefecht immer zuerst die Salve und rührt die Lücke nie an — gemessen wurde also fast ausschließlich der zusätzliche Lagerabend.

---

## 2026-07-27 — Kapitel 2: Ägypten 1798/99

**Sechzehn neue Stationen** in `src/daten/kapitel02_aegypten.js`, angehängt an dieselbe Kette: Überfahrt, Alexandria, Wüstenmarsch, Pyramiden, Kairo, Musterung, Aufstand, Winterquartier Kairo, Sinai, Akkon, Rückzug, Abukir, Abreise Bonapartes, Ende. Fixpunkte historisch: Pyramiden am 21. Juli 1798, der Aufstand im Oktober, Akkon März–Mai 1799 (**fällt nicht**), Abukir am 25. Juli 1799, Bonapartes Abreise in der Nacht des 24. August.

**Der Charakter des Kapitels steht in den Szenen, nicht in den Gefahr-Zahlen.** Die fünf Gefechte liegen mit Gefahr 9–14 im selben Band wie Italien. Was tötet, ist der Weg: `anmarschKosten` je Gefecht (bis 0,30 Verschleiß und Atem −9 statt der italienischen Pauschale 0,15/−4), dazu Hitzschlag im Wüstenmarsch, Ruhr am Sinai, das Fieber aus Jaffa auf dem Rückzug. Das setzt „Krankheit gefährlicher als Kugeln" aus dem Konzept um, ohne die Gefechtsbalance anzufassen.

**Neuer Stationstyp `uebergang`.** Zwischen Leoben und der Überfahrt liegt ein Jahr Garnison: Atem voll, Wunden zu, Belastung halbiert — sonst stirbt in Ägypten niemand an Ägypten, sondern an Arcole. Es wird dabei **nichts gewertet und nichts eingetragen**; gewertet wird ein Lauf erst, wenn er endet.

**Was dafür aus dem Code in die Daten gewandert ist:** der Winterquartier-Text, der Schlusstext samt Ausblick, die Anmarschkosten. Ein Kapitel hängt sich am Ende seiner Datei mit drei Zeilen selbst an (`KAPITEL.push`, `STATIONEN.x`, `KAMPAGNEN … gebaut`). Die Beförderung friert ihren Prüfstand jetzt **je Station** ein statt einmalig — Kairo prüft den Stand von Kairo, nicht den von Verona — und wer die Streifen schon trägt, bekommt einen eigenen kurzen Bildschirm statt einer zweiten Beförderung.

**Wertung: Stationen von 3 auf 2 Punkte.** Mit 32 statt 16 Stationen hätte allein das Durchkommen 96 Punkte gebracht. Regel dahinter: Das Durchkommen darf nie mehr als etwa die Hälfte der Ladensumme wert sein.

**`test/balance.js` weist jetzt zwei Quoten aus** — „Italien überstanden" (der alte Zielwert 45–55 %) und „beide Feldzüge". Ohne diese Trennung wäre der Zielwert nach dem Anbau bedeutungslos geworden.

---

## 2026-07-27 — Drei Exploits in der Charaktererschaffung

**1. Konstitution ≥ 58 machte den Tod unmöglich.** `Math.random()*100 − (Konstitution−40)/3 > 94` ist bei Konstitution 58 nicht mehr erreichbar. Ein solcher Mann sammelte nur Wunden, und Wunden heilen nach jedem Gefecht — Invariante 1 ausgehebelt, ohne dass es auffällt. Jetzt ist der Schutz auf `−10 … +5` geklammert: Todeschance je Treffer **1 % bis 16 %**, nie null.

**2. Die Herkunft wurde ungedeckelt addiert.** Pool bis 70, Herkunft obendrauf: Bauernsohn mit 70 Konstitution stand bei **90** — direkt über der Schwelle aus Exploit 1. Beide Fehler zusammen ergaben einen unsterblichen Charakter in dreißig Sekunden. `neuerCharakter()` deckelt jetzt auf 70 (Attribute) und 60 (Fertigkeiten); die Herkunft erreicht die Grenze billiger, überschreitet sie aber nicht.

**3. Zwei Herkünfte zahlten in toter Währung.** Alle sechs verteilen netto 50 Punkte, aber Reiten und Kartenkunde tun in den gebauten Kapiteln nichts. Wirksam waren: Fuhrmannssohn **20**, Schreibergehilfe **30**, alle anderen 50. Umgeschichtet — Fuhrmann Reiten 30 → 20, Konstitution 10 → 15, Kaltblütigkeit −10 → −5; Schreiber Kartenkunde 20 → 10, Konstitution −20 → −10. Netto weiter 50, wirksam jetzt 30 und 40. Ganz gleich werden sie erst, wenn Reiten und Kartenkunde ab Rang 7 zählen.

**Dazu ein Kauf mehr im Laden:** Beutemantel (30 VP). Der Mantelplatz war seit dem ersten Meilenstein leer („Kein Mantel", Verschleiß 0) — in Ägypten sind die Nächte kalt, und spätestens in Russland ist es der wichtigste Platz überhaupt.

---

## 2026-07-27 — Das Gefecht wird sichtbar, Rangabzeichen

**Sichtfeld neu gezeichnet.** Vorher standen vier namenlose Klötze im Rauch. Jetzt ist es eine Aufstellung aus Augenhöhe: unten die eigene Linie in Blau, zwei Glieder mit Tschako und geschultertem Gewehr, versetzt wie es sich gehört; drüben der Feind in Rot, kleiner, weil weiter weg; dazwischen Pulverdampf, der mit jeder Runde dichter wird.

- **Du stehst dort, wo du hingehörst** — im zweiten Glied als Füsilier oder Grenadier, vor der Linie als Voltigeur, flach am Boden wenn du kniest oder liegst, zehn Schritt vor der Linie nach einem gelungenen Bajonettangriff (`K.vorn`).
- **Beide Seiten verlieren sichtbar Männer.** Gefallene verschwinden nicht, sie liegen als Strich am Boden. Die Waage unter dem Bild zeigt, wohin es kippt.
- **Neu: `K.eigen`**, der Zustand der eigenen Linie. **Reine Anzeige** — daran hängt keine Probe, keine Gefahr, keine Wertung. Sie sinkt je Runde um 2–5, mal dem verbliebenen Widerstand des Feindes, sodass ein gebrochener Gegner kaum noch Verluste kostet. Wer daran eine Mechanik hängt, ändert die Balance und muss neu messen.
- **Geschlossene Ordnung durch Versatz:** je Glied zwanzig Mann (Feind fünfzehn), die Glieder um eine halbe Teilung versetzt, sodass das hintere die Lücken des vorderen füllt. Dazu je Glied ein schwacher Streifen über die volle Breite, damit die Linie nicht am Bildrand aufhört. Der Voltigeur bleibt die Ausnahme mit fünf weit verteilten Plänklern — er steht in keiner Linie.
- **Kopfbedeckungen nach Zweig:** die Linie trägt den Zweispitz (breit, flach, quer), die Grenadierkompanie die Bärenfellmütze mit rotem Stutz, der Feind den österreichischen Kasket. Auf 640 Pixel Breite ist die Silhouette das Einzige, was sich unterscheiden lässt.

**Rangabzeichen** (`rangabzeichen()` in `grundwerte.js`) zeigen den Rang als Bild statt als Wort: Der Fusilier trägt nichts — das ist der Witz an ihm —, die Elitekompanien eine Epaulette (Grenadier rot, Voltigeur grüngelb), die Unteroffiziere Streifen am Unterarm (Caporal zwei aus Wolle in Aurore, Caporal-fourrier zusätzlich einen quer, Sergent einen aus Tresse). Sie stehen in der Seitenleiste und dort, wo man sie bekommt: bei der Elitewahl und bei der Beförderung.

Gemessen über 40 Läufe: überstanden 43 %, Caporal 25 % — im Rahmen der Streuung um die gültigen 44 % / 30 %. Es hat sich auch nichts Mechanisches geändert.

---

## 2026-07-27 — Der Voltigeur darf sich hinlegen

**Fehlende Handlung ergänzt.** Der Voltigeur hatte „Hinwerfen" nicht — als einziger Zweig. Das ist doppelt falsch: Der Plänkler ist gerade der, der sich hinlegt, weil er in keiner Linie steht, die jemand halten müsste; und die Atem-Warnung im Gefecht verweist ausdrücklich auf „Hinwerfen bringt +10", was für ihn ins Leere lief. Damit war er der einzige Zweig, der im Gefecht nicht verschnaufen konnte.

Die Handlung heißt bei ihm **„Flach hinlegen"** und hat einen eigenen Text — er liegt allein in einer Ackerfurche, nicht neben Kameraden in der Linie. Wirkung unverändert: Atem +10, Belastung −2, Gefahr −22, kein Schuss.

**Bei Füsilier und Grenadier heißt sie jetzt „Hinknien"**, nicht mehr „Hinwerfen". In der geschlossenen Linie legt sich niemand hin — das Glied bliebe offen; man geht auf ein Knie und lässt den Kopf hinter den Rücken des Vordermanns. Damit trennen sich die beiden Zweige auch im Wort: Der Plänkler legt sich flach, der Mann in der Linie kniet. Die Atem-Warnung im Gefecht und die Zeile im Sichtfeld nennen jeweils die Handlung, die es beim eigenen Zweig wirklich gibt; die Testbots kennen beide Bezeichnungen.

Gemessen über 40 Läufe: überstanden 50 %, Caporal 33 % — im Rahmen der Streuung von ±8 Punkten um die gültigen 44 % / 30 % aus 80 Läufen. Der Zweig betrifft ohnehin nur rund jeden achten Lauf.

---

## 2026-07-27 — Erschaffung in zwei Schritten, Verlauf entrümpelt

**Reihenfolge umgedreht.** Vorher: Veteranenpunkte ausgeben, dann den Mann erschaffen. Jetzt: erst Name, Herkunft und Poolverteilung, dann die Punkte auf die **fertigen** Werte legen. Der Kaufteil stand vorher unter der Ausrüstungstabelle und war deshalb nicht zu finden — jetzt sind „Attribute ergänzen" und „Fertigkeiten ergänzen" zwei eigene Blöcke mit je einer Zeile pro Wert: jetziger Wert, Pfeil, neuer Wert, Preis.

**Der Preis rechnet vom Istwert statt vom Sockel.** Weil die Erschaffung zuerst kommt, ist der Ausgangswert bekannt. Ein Wilderer mit Muskete 40 zahlt für fünf Punkte 15 VP, einer bei Muskete 10 nur 5. Spezialisierung wird teuer, Breite bleibt bezahlbar — der eigentliche Sinn von `PRO_PUNKT`. Obergrenzen jetzt auf den Endwert bezogen: Attribute 70 (wie bei der Poolverteilung), Fertigkeiten 60.

**Kampagnenverlauf entrümpelt.** Jede Station stand in zwei Zeilen mit Datum, Art und Besuchszähler, was bei 246 px Spaltenbreite umbrach. Jetzt eine Zeile mit nur zwei Angaben: Ort und ein kleines Artkürzel (Gefecht, Lager, Winter, Musterung, Auswahl). Datum und Zähler sind gestrichen — das Datum steht im Titel-Attribut und ohnehin im Kartenkopf, sobald man dort ist, und wie oft man schon irgendwo war, sagt über den laufenden Feldzug nichts.

**Grün heißt: hier ist etwas dazugekommen.** Gekaufte Punkte und gewählte Ausrüstung bekommen einen grünen Balken, einen grünen Grundton und den neuen Wert in Grün — man sieht auf einen Blick, wo der Vorrat hingegangen ist. „Einrücken" steht jetzt rechts hinter „Zurück zur Erschaffung" und trägt als Hauptsache den Messingrand.

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
