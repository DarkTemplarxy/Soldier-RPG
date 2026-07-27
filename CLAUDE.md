# Der Marschallstab — Arbeitsgedächtnis

**Lies diese Datei zuerst.** Sie enthält, was aus dem Gespräch nicht mitkommt: warum die Zahlen so sind, wie sie sind, und welche Regeln nicht gebrochen werden dürfen.

---

## Was das ist

Ein Karriere-Simulator in der Grande Armée, 1796–1815. Man beginnt als analphabetischer Rekrut und steigt — vielleicht — im Rang auf. Vierzehn Ränge, elf Kapitel, harter Permadeath. Vorbild ist *A Legionary's Life*, aber in napoleonischer Zeit und mit einem längeren Aufstieg.

**Der Kern in einem Satz:** Der Rang verändert nicht die Zahlen, sondern das Spiel selbst — als Fusilier steuerst du deinen Körper, als Caporal acht Männer, als General schiebst du Divisionen über eine Karte und liest Meldungen, die vierzig Minuten alt sind.

Sprache des Spiels und des Codes: **Deutsch**. Variablennamen, Kommentare, Texte.

---

## Stand

Gebaut ist **Kapitel 1 (Italien 1796/97)**, Ränge 1–3, als reine HTML/JS-Anwendung ohne Abhängigkeiten.

| Fertig | Noch nicht |
|---|---|
| Charaktererschaffung mit Pool und sechs Herkünften | Kapitel 2–11 |
| Attribute und Fertigkeiten 0–100 mit Wachstum | Ränge 4–14 |
| Gefecht auf zwei Maßstäben (Körper / Sektion) | Ausrüstungskauf im Spiel |
| Voltigeur- und Grenadierzweig mit eigenen Aktionen | Orden und Ehrenlegion |
| Ausrüstung mit Zustandsverschleiß | Pferd, Kompaniekasse, Inspektionen |
| Ruf, Gunst, Kameradschaft, Belastung, Wunden | Offizierspatente |
| Vakanz-Regel für die Beförderung | Rangschranken und die vier Enden |
| Drei Lager mit Ausbildung und Instandhaltung | Generalskampagnen |
| Winterquartier mit Wochenverteilung | |
| Anmarsch und Lagebild vor jedem Gefecht | |
| Permadeath, Wertung, Chronik, Spielstand als Datei | |
| Aussetz-Spielstand mit Fassungen und Wandlern | Dateisystem-Ablage, Steam-Cloud |
| Erklärungen zu jedem Wert beim Überfahren | |

Das vollständige Design steht in **`KONZEPT.md`** — auch alles, was noch nicht gebaut ist. Wer ein neues System baut, liest dort zuerst nach, ob es schon entworfen wurde.

---

## Starten und prüfen

```bash
# Spielen: index.html im Browser öffnen. Kein Server, kein Build nötig.

npm install playwright && npx playwright install chromium   # einmalig

node test/durchspielen.js         # ein Lauf, meldet Konsolenfehler
node test/spielstand.js           # sichern, fortsetzen, sterben, alte Fassungen
node test/durchspielen.js dist    # dasselbe mit der gebauten Einzeldatei
node test/balance.js 40           # 40 Läufe, misst die Überlebensquote
node werkzeug/bauen.js            # baut dist/marschallstab.html zum Weitergeben
```

**Nach jeder Änderung am Code `node test/durchspielen.js` laufen lassen.** Nach jeder Änderung an Balance-Zahlen zusätzlich `node test/balance.js 40`, nach jeder Änderung am Zustand `node test/spielstand.js`.

---

## Dateien

```
README.md                       Eingangstür für Fremde
CLAUDE.md                       diese Datei — Arbeitsgedächtnis
KONZEPT.md                      vollständiges Design, auch das Ungebaute
AENDERUNGEN.md                  Protokoll aller Balance-Änderungen
LICENSE / LICENSE-INHALTE       MIT für Code, CC BY-NC-SA für Inhalte
entwurf/                        Konzeptgrafiken, Bildschirmfotos, GITHUB.md
index.html                      Gerüst, lädt die Skripte in fester Reihenfolge
src/stil.css                    Gesamte Gestaltung
src/daten/grundwerte.js         Attribute, Fertigkeiten, Ränge, Herkünfte, Kaufladen
src/daten/kapitel01_italien.js  Kapitel 1 als reine Daten
src/spielstand.js               Fassungen, Wandler, Ablage, Aussetz-Spielstand
src/mechanik.js                 Laufzustand, Proben, Wachstum, Erholung, Verschleiß, Wunden
src/oberflaeche.js              Titel, Kaufladen, Erschaffung, Ablauf, Szenen
src/kampf.js                    Anmarsch, Gefecht, Elitekompanie, Beförderung
src/abschluss.js                Lager, Winterquartier, Wertung, Tod, Kapitelende, Spielstand
src/start.js                    Einstiegspunkt, muss zuletzt geladen werden
```

Die Skripte sind **klassische Skripte, keine ES-Module** — absichtlich, damit `index.html` per Doppelklick über `file://` läuft. Module würden dort an der Sicherheitsprüfung des Browsers scheitern. Wer das ändert, braucht einen lokalen Server und nimmt dem Projekt seine wichtigste Eigenschaft.

**Ein neues Kapitel** kommt als eigene Datei nach `src/daten/`, wird in `index.html` eingehängt und an `KAPITEL` angehängt. Kapiteldaten enthalten keine Logik.

---

## Das Projekt ist öffentlich

Der Quelltext liegt auf **https://github.com/DarkTemplarxy/Soldier-RPG** und ist für jeden lesbar.

Was daraus folgt:

- **`README.md` ist die Eingangstür**, nicht die Arbeitsanweisung. Sie richtet sich an Fremde: was das Spiel ist, wie man es startet, wie der Stand ist. Arbeitsanweisungen gehören hierher.
- **Zwei Lizenzen.** Quelltext MIT (`LICENSE`), Spielinhalte CC BY-NC-SA (`LICENSE-INHALTE`) — Texte, Konzept, Gestaltung sind ausdrücklich **nicht** kommerziell nutzbar. Neue Dateien entsprechend zuordnen.
- **GitHub Pages** macht `index.html` unter `darktemplarxy.github.io/Soldier-RPG/` spielbar. Deshalb darf nie ein Build-Schritt nötig werden — siehe `entwurf/GITHUB.md`.
- **Keine privaten Angaben** in Dateien, die ins Repo gehen. Keine Pfade vom eigenen Rechner, keine Namen außer dem Urheber.
- **Commit-Nachrichten auf Deutsch**, wie der Rest des Projekts. Erste Zeile knapp, danach eine Leerzeile und die Begründung.

---

## Design-Invarianten

Diese acht Regeln nicht brechen. Wenn eine Änderung eine davon verletzt, ist die Änderung falsch — nicht die Regel.

1. **Der Tod ist endgültig.** Kein Weiterspielen, kein Nachfolger, kein Zurücksetzen. Abschlusstext, Chronikeintrag, Titelbildschirm.
2. **Nur der beste Lauf zählt.** Der Veteranenpunkte-Vorrat ist das Maximum über alle Läufe, nie die Summe. Ein schlechter Lauf kostet nichts und bringt nichts. Es darf nichts zu grinden geben.
3. **Veteranenpunkte kaufen den Ausgangspunkt, nie den Aufstieg.** Rang, Ruf, Gunst und Orden sind unkäuflich. (Ausnahme später: die Offizierspatente ab Rang 7 — sie kosten dafür Wertungspunkte, siehe KONZEPT.md.)
4. **Ein höherer Rang gibt neue Knöpfe, nicht größere Zahlen.** Wenn ein neuer Rang keine neue Handlungsmöglichkeit bringt, ist er falsch entworfen.
5. **Beförderung braucht eine Vakanz.** Ruf und Fürsprache allein reichen nicht — die Stelle muss frei sein, und frei wird sie, weil jemand gestorben ist. Das wird nie ausgesprochen, nur gezeigt.
6. **Kein Server, keine Abhängigkeiten. Die Datei ist das maßgebliche Format.** Der Spielstand geht als JSON-Datei raus und wieder rein. `localStorage` ist ausschließlich die bequeme Ablage für den unterbrochenen Feldzug und die Chronik — nie die einzige Quelle, und das Spiel muss ohne sie vollständig funktionieren. *(Geändert am 27.07.2026: vorher verbot diese Invariante `localStorage` ganz. Ohne Browser-Ablage kann ein Absturz keinen Feldzug retten, und genau das war die Anforderung. Die Begründung steht unter „Spielstand".)*
7. **Ton: nüchtern-brutal.** Kein Heldenpathos, keine Musik im Text. Kurze Sätze, konkrete Details, keine Wertung. Der Aufstieg wird nie gefeiert, er wird protokolliert.
8. **Historische Fixpunkte sind fix.** Lodi ist am 10. Mai 1796, Arcole im November, Rivoli am 14. Januar 1797. Dazwischen ist alles frei erfunden.

---

## Balance-Konstanten und warum sie so sind

**Wer eine dieser Zahlen ändert, trägt sie hier mit Begründung nach und aktualisiert `AENDERUNGEN.md`.** Sonst ist das Wissen bei der nächsten Sitzung weg.

### Gefechte (`src/daten/kapitel01_italien.js`)

| Gefecht | Runden | Feindmoral | Gefahr |
|---|---|---|---|
| Montenotte | 6 | 45 | 10 |
| Lodi | 9 | 78 | 15 |
| Castiglione | 7 | 58 | 12 |
| Arcole | 9 | 74 | 14 |
| Rivoli | 8 | 66 | 13 |

**Gefahr** ist die Trefferchance in Prozent pro Runde, bevor Deckung sie verändert.

> **Warum so niedrig?** Die erste Fassung hatte Gefahr 26–38 und Feindmoral bis 100. Ergebnis im Test: **100 % Tod**, keine einzige gewonnene Schlacht. Zwei Gründe — man wurde zu oft getroffen, *und* die Gefechte waren rechnerisch nicht zu gewinnen: Weil man nur jede zweite Runde feuert (Laden, Feuern, Laden…), kommt man in neun Runden auf vier Schuss zu je 12–32 Schaden, also nie an 100 Feindmoral heran.

### Lager (`src/abschluss.js`, Auswahl in den Kapiteldaten)

**Drei Lager in Kapitel 1, plus das Winterquartier.** Depot Savona (3 Abende, vor allem Ausbildung), Kantonierung Corsico (2 Abende, vor allem Instandhaltung, weil dort zum ersten Mal Sold gezahlt wird), Feldlager an der Etsch (2 Abende, vor Arcole).

> **Warum drei und nicht mehr?** Ein Lager je zwei Gefechte ist die Grenze, ab der aus dem Spiel eine Verwaltung wird. Mehr Lager heißt vor allem: dieselben Knöpfe öfter — und Invariante 2 verbietet Grinding. Die Knappheit ist der Entwurf: Es gibt in jedem Lager mehr zu tun als Abende. **Regel für neue Kapitel: eins am Kapitelanfang, danach eins je zwei Gefechte, höchstens vier, immer mit knappem Zeitbudget.**

| Handlung | Wirkung | Preis |
|---|---|---|
| Exerzieren | Muskete und Drill (Intensität 2) | Atem −6 |
| Bajonettfechten | Bajonett (2,5) | Atem −8 |
| Scharf schießen | Muskete (3,5) | 4 F, Waffe −5 |
| Ausrüstung flicken | Geschick-Probe 30: alles +20, sonst +8 | ein Abend |
| Schuster | Schuhe +45 | 6 F |
| Muskete ölen | Muskete +30 | ein Abend |
| Buchstaben lernen | Bildung +5, Verwaltung | 5 F |
| Am Feuer bleiben | Kameradschaft +8, Gunst +1, Belastung −4 | ein Abend |
| Fouragieren | Probe 40: +7 F, Atem +8 | sonst Belastung +3 |
| Schlafen | Belastung −10, Atem +18 | ein Abend |
| Korporalschaft drillen (ab Rang 3) | Autorität und Drill, Ruf +1 | ein Abend |
| Tornistermarsch (Grenadier) | Konstitution | Atem −10 |
| Gelände üben (Voltigeur) | Geschick und Muskete | Atem −6 |

Ein Lagerabend gibt bewusst **weniger als eine Winterwoche** (dort: alles +30 statt +20, Belastung −16 statt −10). Die drei rang- und zweigabhängigen Handlungen erfüllen Invariante 4 auch außerhalb des Gefechts.

### Anmarsch vor dem Gefecht (`src/kampf.js`)

```js
verschleiss(0.15); S.atem -= 4; S.belastung += 1;
```

**Der Weg zum Gefecht kostet etwas** — sonst wären die Lager ein reiner Zugewinn und die Instandhaltung eine Pflichtübung ohne Gegner. Erste Fassung war `verschleiss(0.3)`, Atem −6, Belastung +2: **gemessen 35 % Überleben statt 50 %.** Der Marschverschleiß über fünf Gefechte wog schwerer als alles, was drei Lager wieder einbringen. Halbiert liegt der Wert wieder im Band.

### Atem erholt sich zwischen den Stationen (`src/mechanik.js`)

```js
Erholung = 8 + Konstitution/12 − Belastung/25 − 2×Wunden,   mindestens 2
```

Einmal je Station, also sechzehnmal im Kapitel; bei Konstitution 40 und keiner Wunde sind das etwa +11. **Vorher war Atem eine Einbahnstraße nach unten** — nur „Schlafen" im Lager und „Ruhe" im Winterquartier drehten ihn um, und wer dort etwas anderes tat, ging ausgepumpt ins nächste Gefecht. Das ist auch inhaltlich falsch: Zwischen Castiglione und Arcole liegen drei Monate, und niemand bleibt drei Monate außer Atem.

Die Formel bestraft, was sie bestrafen soll: Belastung und offene Wunden bremsen die Erholung, Konstitution beschleunigt sie. Das gibt Konstitution eine dritte Aufgabe neben Tödlichkeit und Grenadierschwelle.

### Die Linie kämpft auch ohne dich (`src/kampf.js`)

```js
const linie = 2 + Math.random()*4;
K.feindMoral -= schaden + linie;
```

**Das ist die wichtigste Zeile im Kampfsystem.** Jede Runde sinkt der Widerstand des Feindes um 2–6 von allein, weil zweihundert andere Männer ebenfalls schießen. Ohne sie sind alle Gefechte unwinnbar (siehe oben). Inhaltlich stimmt sie außerdem: Du bist ein Mann in einer Linie, nicht der Held.

### Tödlichkeit (`src/kampf.js`)

```js
const schwere = Math.random()*100 - (wert('konstitution')-40)/3;
if(schwere > 94)      → Tod
else if(schwere > 72) → schwere Wunde (Abzug 14)
else                  → Streifschuss (Abzug 5)
```

- Wundenobergrenze **5**, dann Verbluten.
- **Nach jedem Gefecht heilt die leichteste Wunde** („Der Feldscher flickt dich zusammen"). Ohne das häufen sich über fünf Gefechte so viele Wunden an, dass die Obergrenze allein tötet.
- **Wunden schlagen voll auf körperliche Werte** (Konstitution, Geschick, Muskete, Bajonett, Reiten), **nur zu einem Drittel auf geistige**. Vorher zogen sie von *allem* ab — das erzeugte eine Todesspirale: eine Wunde senkte Konstitution, das erhöhte die Todeschance, die nächste Wunde senkte sie weiter.

### Charaktererschaffung (`src/oberflaeche.js`, `src/daten/grundwerte.js`)

- Sockel **20** auf allen sechs Attributen, Verteilungspool **120**, Höchstwert bei Erschaffung **70**.
- **Bildung ist vom Pool ausgenommen** und bleibt bei 20 — man kann nicht lesen.
- Alle neun Fertigkeiten starten bei **10**.
- **Jede Herkunft verteilt exakt 50 Punkte netto**, nur anders gewichtet, teils mit Abzügen. Keine ist stärker. Wer eine neue Herkunft hinzufügt, hält die 50 ein.

### Proben und Wachstum (`src/mechanik.js`)

```
Zielwert = Wert − Schwierigkeit + 50        (begrenzt auf 5…95)
Wurf 1–100, Erfolg wenn Wurf ≤ Zielwert
```
Wert 40 gegen Schwierigkeit 40 ist also ein Münzwurf. Das ist die Eichung — Schwierigkeiten in Szenen immer gegen die erwarteten Werte des Kapitels ansetzen (Kapitel 1: Attribute 20–70, Fertigkeiten 10–50).

```
Wachstum = 1,7 × Intensität × (100 − Wert)/100,  mit 75 % Wahrscheinlichkeit
```
Abnehmender Ertrag ist Absicht: von 12 auf 40 geht schnell, von 80 auf 90 dauert Jahre. **Nebeneffekt, der erhalten bleiben muss:** gekaufte hohe Startwerte wachsen langsamer, der Vorsprung schaukelt sich nicht auf.

### Aufstieg (`src/kampf.js`)

- **Elitekompanie (Rang 2):** Grenadier ab Konstitution 55, Voltigeur ab Geschick 55. Keine Beförderung, sondern eine Auswahl — der Voltigeur bekommt ein anderes Kampf-Minispiel (zielen, Deckung wechseln), nicht bessere Werte.
- **Caporal (Rang 3):** Ruf ≥ **30** und Gunst ≥ **4** und eine Vakanz. Alle drei, sonst nichts. Die Schwelle steht als `CAPORAL_RUF` / `CAPORAL_GUNST` in `src/kampf.js` und wird von den Texten mitbenutzt — nur dort ändern.

> **Warum 30 und 4, und warum die Gunst-Quellen kleiner wurden.** Gemessen an 60 Läufen kamen **alle 42 Überlebenden mit exakt Gunst 3** bei Verona an — keine Verteilung, sondern eine Konstante. Grund: Eine einzige Szenenwahl (Mondovì melden, damals +3) erfüllte die Anforderung allein. Damit war die Schwelle 3 geschenkt und 4 unerreichbar; Fürsprache wurde gekauft, nicht erarbeitet, was Invariante 5 aushöhlt.
>
> Deshalb zwei Änderungen zusammen: **Schwelle auf 4** und **keine einzelne Tat trägt sie mehr allein** — Mondovì „melden" 3 → **2**, Mantua „dem Fourier auf die Finger sehen" 4 → **3**. Wer Caporal werden will, braucht jetzt zwei Handlungen: eine sichtbare Tat *und* Abende am Feuer (Lager +1, Winterwoche +2, Savona zuhören +2, Dego Tornister +1).
>
> Der Ruf war beim Bot zweigipflig — 19–25 oder 36–41, dazwischen niemand. Zwischen 26 und 35 liegt also keine Trennlinie; **30** ist die lesbare Zahl in dieser Lücke und schneidet die untere Gruppe sauber ab.

### Wertung Kapitel 1 (`src/abschluss.js`)

```
Rangwert + 3×Stationen + 5×(Ruf/10) + 3×Nennungen + 25 (lebend) + 10 (nie gekniffen)
```
Rangwerte 0 / 12 / 26. Kaufladen kostet 12–40 VP, alles zusammen 166.

> **Stationen von 4 auf 3 Punkte gesenkt**, weil es mit den drei Lagern jetzt 16 statt 13 Stationen sind. Bei 4 Punkten hätte allein das Durchkommen 64 statt 52 Punkte gebracht und ein Spitzenlauf hätte den ganzen Laden leergekauft. Gemessenes Maximum jetzt **162** — knapp unter der Ladensumme von 166, sodass immer ein Kauf übrig bleibt.

> Diese Wertung gilt nur für den Prototyp mit einem Kapitel. Die Skala des vollen Spiels (Maximum 918, Rangwerte bis 580) steht in KONZEPT.md und wird übernommen, sobald mehrere Kapitel existieren.

### Zielwerte

| Größe | Soll | Gemessen (105 Läufe) |
|---|---|---|
| Kapitel 1 überstanden (Testskript) | 45–55 % | **41 %** |
| Kapitel 1 überstanden (Mensch, geschätzt) | ~60 % | — |
| Erster Lauf ohne jede Beförderung | ~40 % | 43 % |
| Elitekompanie erreicht (Rang 2) | — | 15 % |
| Caporal im ersten Kapitel | ~30 % | 42 % |

Werte vor der Atem-Erholung, zum Vergleich (80 Läufe): überstanden 48 %, ohne Beförderung 53 %, Caporal 28 %.

Der Streubereich bei 40 Läufen ist etwa ±8 Punkte — ein einzelner Durchgang von 43 % oder 57 % sagt für sich genommen nichts. **Bei Zweifeln 80 Läufe messen**, wie hier geschehen.

**Offener Punkt — die Atem-Erholung hat den Caporal-Anteil zurückgetrieben.** Er lag nach der Schwellenänderung bei 28 %, jetzt wieder bei 42 %. Der Weg dorthin ist mittelbar und plausibel: Mehr Atem heißt seltener der Malus `Atem < 30` (+5 Gefahr je Runde), heißt mehr gewonnene Gefechte, heißt mehr Ruf — und Ruf ist die Caporal-Schwelle. Wer das wieder auf 30 % bringen will, hebt `CAPORAL_RUF` von 30 auf etwa 34; die Ruf-Verteilung war zweigipflig, deshalb bitte vorher neu messen, wo die Lücke jetzt liegt.

**Zweiter offener Punkt:** Die Überlebensquote liegt mit 41 % knapp unter dem Band 45–55 %. Der Abstand zur letzten Messung (48 %) ist 7 Punkte und damit innerhalb dessen, was 80 Läufe an Streuung hergeben (±5,5 Punkte) — aber er zeigt in die falsche Richtung für eine Änderung, die dem Spieler nützt. Vor einer Gegenmaßnahme erst mit 160 Läufen nachmessen.

`node test/balance.js 40` misst das. **Weicht der Wert nach einer Änderung um mehr als zehn Punkte ab, ist die Änderung zu prüfen.**

**Was der Testbot kann und was nicht.** Er nimmt in Szenen immer die erste Wahl, im Gefecht die sinnvolle Aktion und im Lager seit der Gunst-Änderung „Am Feuer sitzen bleiben", solange seine Fürsprache unter 4 liegt. Ohne diese eine Ausnahme bemühte er sich nie um einen Fürsprecher und würde nie befördert — gemessen würde dann nicht die Schwelle, sondern die Blindheit des Bots. Wer eine Schwelle einführt, die mehrere Handlungen verlangt, muss dem Bot beibringen, sie zu verfolgen, sonst misst das Skript etwas anderes als das Spiel.

---

## Ton

Was gemeint ist mit „nüchtern-brutal":

> *Gut:* „Guérin, der links neben dir stand, liegt seit einer Minute an den Brückenbalken und macht ein Geräusch, das aufhören wird."
>
> *Falsch:* „Tapfer stürmst du voran, das Herz voller Mut für Frankreich!"

Regeln für Szenentexte:

- Zweite Person, Präsens. Immer „du".
- Konkrete Zahlen und Gegenstände statt Adjektive. Elf Tage, zwei Sous, vierzig Schritt.
- Das Spiel wertet nicht. Es zeigt, was passiert, und schweigt darüber, ob es richtig war.
- Keine Rückmeldung darüber, ob eine moralische Entscheidung die richtige war. Nie.
- Nebenfiguren wiederkehren lassen — Sergent Martel, Guérin. Wenn Guérin stirbt, wird seine Stelle frei, und genau die bekommst du.

---

## Spielstand

Zwei Dinge werden gespeichert, und sie haben nichts miteinander zu tun:

| | Inhalt | Lebensdauer | Ort |
|---|---|---|---|
| **Chronik** | Veteranenpunkte, Läufe, erreichte Stationen | für immer | `marschallstab.chronik` (+ `.bak`) |
| **Lauf** | der angefangene Feldzug | bis Tod oder Kapitelende | `marschallstab.lauf` |

**Der Aussetz-Spielstand ist zum Aufhören da, nicht zum Wiederholen.** Ein einziger Platz, kein zweiter, keine Slots. Er wird beim Betreten eines Lagers angelegt *und angesagt* — das ist der sichtbare Halt — und danach bei **jedem** Schritt still überschrieben, auch nach jeder Kampfrunde. Deshalb bedeutet er immer „jetzt": Wer das Spiel beendet, kommt genau dorthin zurück, wo er war, und nie weiter zurück.

> **Warum nicht nur im Lager speichern?** Weil ein Halt im Lager, der ein Gefecht überdauert, ein Rücksetzpunkt ist: Wer im Gefecht sieht, dass es schiefgeht, schließt den Reiter und steht wieder im Lager. Das hebelt Invariante 1 aus. Ein Spielstand, der immer aktuell ist, kann nicht zum Zurückspulen benutzt werden — und leistet trotzdem alles, wofür man ihn will.

**Der Tod löscht ihn im selben Augenblick.** `toetlich()` ruft `laufVerwerfen()`, `zeigeTod()` noch einmal zur Sicherheit, `eintragen()` ein drittes Mal. Drei Stellen sind hier nicht zu viel, sondern richtig — die Invariante darf an keinem Pfad durchrutschen.

**Stationen schließen sich ab, bevor der „Weiter"-Knopf kommt.** `stationErledigt()` setzt `LAUF.node` schon hoch, während der Ergebnisbildschirm noch steht. Sonst könnte man eine Szenenwahl rückgängig machen, indem man auf dem Ergebnis das Spiel beendet. Wer eine neue Stationsart baut, muss sie aufrufen — vergisst man es, hängt das Spiel in einer Schleife (genau das ist beim Bau der Beförderung passiert und wurde vom Testskript gefunden).

**Fassungen.** `CHRONIK_FASSUNG` und `LAUF_FASSUNG` in `src/spielstand.js`. Wer das Format ändert, **erhöht die Zahl und hängt einen Wandler an** — jeder Wandler hebt genau eine Fassung auf die nächste, nie zwei auf einmal. Ein Spielstand aus einer neueren Fassung wird abgewiesen, nicht geraten. Die alte Chronik ohne Fassungsnummer ist Fassung 0 und wird weiterhin gelesen.

**`localStorage` ist nur die bequeme Ablage** (Invariante 6). Die Datei bleibt maßgeblich: `speichern()` schreibt Chronik *und* laufenden Feldzug in eine JSON-Datei, `laden()` liest beides zurück. Wo `localStorage` fehlt — mancher Browser über `file://`, privater Modus —, läuft alles weiter, nur ohne Absturzsicherung; der Titelbildschirm sagt das dann auch.

**Prüfsumme, keine Sicherung gegen Betrug.** Auf dem eigenen Rechner ist das aussichtslos, und weil nur der beste Lauf zählt (Invariante 2), lohnt Schummeln ohnehin nicht. Die Prüfsumme fängt halb geschriebene Dateien und kaputte Cloud-Abgleiche ab. Von der Chronik bleibt eine Generation als `.bak` stehen.

**Was für Steam noch fehlt** — die Reihenfolge ist absichtlich so, dass jeder Schritt für sich nützlich ist:

1. `Ablage` bekommt eine Dateisystem-Rückseite (Electron oder Tauri): schreiben nach `tmp`, dann umbenennen, damit ein Absturz mitten im Schreiben die Chronik nicht kostet.
2. Steam-Auto-Cloud auf den Benutzerordner zeigen lassen — Konfiguration, kein Code, wenn Schritt 1 sauber ist.
3. **Nur die Chronik synchronisieren, nie den laufenden Feldzug.** Ein halber Lauf auf zwei Rechnern ist genau das Schlupfloch, das der Ein-Platz-Entwurf verhindert.
4. Chroniken lassen sich bei einem Cloud-Konflikt *zusammenführen* statt auswählen: Einträge sind unabhängig, `vp` ist das Maximum, `laeufe` die Summe. Das ist ein seltener Luxus und folgt direkt aus Invariante 2.

`node test/spielstand.js` prüft fünfzehn Punkte davon: sichern, unterbrechen, fortsetzen ohne Rücksetzen, Löschen beim Tod, Wandeln von Fassung 0, Abweisen beschädigter und zukünftiger Dateien.

---

## Lesbarkeit

Die Oberfläche ist dunkelbraun, und genau deshalb sind Beschriftungen die Schwachstelle. Die erste Fassung hatte `--faint: #5c554b` auf `#211e1b` — **2,2 : 1**, also unter jeder brauchbaren Schwelle. Attributnamen, Kartenköpfe, Probenzeilen und Kostenhinweise waren kaum zu sehen.

Gültige Werte in `src/stil.css`:

| Rolle | Farbe | Kontrast auf der Karte |
|---|---|---|
| `--text` Fließtext | `#ded5c4` | ~11 : 1 |
| `--dim` Beschriftungen, Tabellen, Seitenleiste | `#aca192` | ~6,6 : 1 |
| `--faint` Probenzeilen, Kosten, Fußzeile | `#948a79` | ~4,7 : 1 |
| `--brass` Abschnittsüberschriften | `#d0a75e` | ~8 : 1 |

**Regeln:** Nichts unter 4,5 : 1. Kleiner als 11 px wird nichts. Abschnittsüberschriften in der Seitenleiste und über dem Lagebild stehen in Messing, nicht in Grau — sie gliedern, also müssen sie sichtbar sein. Zahlen in der Seitenleiste (`.kv b`) sind heller als ihre Beschriftung, weil man im Spiel die Zahl sucht, nicht das Wort.

**Drei Dinge nach jeder Wahl, in dieser Rangfolge:** was passiert ist (Fließtext), ob die Probe gelungen ist (`.pruefung`, ein Feld mit grünem oder rotem Rand), und was sich dadurch geändert hat (`.wirkung`, Messingbalken, fast in Textfarbe). Die dritte Zeile ist die wichtigste und war früher die blasseste.

**Die Probenrechnung wird nicht mehr ausgeschrieben.** Bis dahin stand da `GESCHICK 80 gegen 30 → Zielwert 95 · gewürfelt 52 · GELUNGEN`. Wert und Schwierigkeit stehen schon *vor* der Wahl auf dem Knopf — dort helfen sie beim Entscheiden. Hinterher sind Zielwert und Wurf nur noch Rechenweg, und der gehört nicht ins Spiel. Jetzt: `Geschick — gelungen`. `probe()` liefert `wurf`, `ziel` und `wertRoh` weiterhin zurück, falls man sie zum Prüfen braucht.

Wer die Palette abdunkelt, macht die Hälfte der Oberfläche wieder unlesbar. Der nüchterne Ton entsteht aus den Texten, nicht aus schwachem Kontrast.

---

## Nachtragepflicht

**Wenn du eine Balance-Zahl änderst:**

1. Ändere sie im Code.
2. Trag sie oben unter „Balance-Konstanten" ein — mit der Begründung, *warum*.
3. Schreib eine Zeile in `AENDERUNGEN.md`.
4. Lass `node test/balance.js 40` laufen und trag den neuen Messwert in die Zielwert-Tabelle ein.

Ohne diese vier Schritte ist das Wissen bei der nächsten Sitzung verloren, und irgendwer setzt die Gefahr wieder auf 26.

---

## Was als Nächstes ansteht

1. **Kapitel 2, Ägypten 1798/99** — als eigene Datendatei. Eigener Charakter: Hitze, Krankheit, Karrees gegen Mamluken, Isolation. Krankheit sollte hier gefährlicher sein als Kugeln.
2. **Ausrüstungskauf im Spiel** — bisher gibt es Ausrüstung nur über Veteranenpunkte und Szenen. Geld hat noch zu wenig Verwendung.
3. **Ränge 4 und 5** (Caporal-fourrier mit Bildungsschwelle 35, Sergent) samt der Verwaltungsschicht.
4. **Orden** — Nennung im Tagesbefehl wird schon gezählt, hat aber noch keine Folge.
5. **Übernahme der vollen Punkteskala**, sobald drei Kapitel stehen.
