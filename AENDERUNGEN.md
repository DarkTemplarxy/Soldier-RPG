# Änderungsprotokoll

Eine Zeile je Änderung. Balance-Zahlen immer mit Begründung und Messwert.
Format: `Datum · Bereich · was · warum · gemessen`

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
