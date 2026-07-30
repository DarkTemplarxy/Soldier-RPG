# Entwurfsunterlagen

Diese drei Dateien im Browser öffnen. Sie sind keine Programme, sondern Konzeptgrafiken,
auf die sich KONZEPT.md und CLAUDE.md beziehen.

| Datei | Was drin steht |
|---|---|
| `Mockup_Drei_Raenge.html` | Dasselbe Gefecht als Fusilier, Capitaine und General — zeigt, wie der Maßstab mit dem Rang wandert |
| `Progression_Veteranenpunkte.html` | Fertigkeitskurven, Überlebenschancen je Kapitel, Punkteökonomie, die vier Enden |
| `Ausruestung_und_Orden.html` | Ausrüstungsstufen, Pferd nach Rang, Verantwortung, Kompaniekasse, Ehrenlegion |
| `orden/*.svg` | Die elf Ordensentwürfe aus dem Gestaltungspaket, Bündel 5 |

## `orden/` — die Vorlage, nicht die Quelle

**Im Spiel werden die Orden prozedural gezeichnet** (`ordensbild()` in
`src/daten/grundwerte.js`), nicht aus diesen Dateien geladen — die Regel „keine
Bilddatei" gilt hier wie überall. Die SVGs sind die Vorlage, gegen die
nachgebaut wurde, und sie bleiben liegen, weil zwei davon noch **nicht** gebaut
sind: `legion_grand` (der Bruststern, den Rang 13 verlangt) und `saint_henri`
(der zweite fremde Orden). Siehe `OFFEN.md` Punkt 7.

Zwei Fehler stecken in den Vorlagen und sind beim Nachbauen bewusst *nicht*
übernommen worden: Die vier Kreuzarme gehen dort durch den Mittelpunkt und
ergeben deshalb ein X statt eines Kreuzes, und das Täfelchen hat den Papierton
des Bogens, auf dem es liegt.
