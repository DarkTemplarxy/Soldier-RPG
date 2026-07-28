# Änderungsprotokoll

Eine Zeile je Änderung. Balance-Zahlen immer mit Begründung und Messwert.
Format: `Datum · Bereich · was · warum · gemessen`

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
