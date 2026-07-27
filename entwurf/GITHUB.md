# Einrichtung auf GitHub

Drei Handgriffe nach dem ersten Push.

## 1. Spielbaren Link aktivieren (GitHub Pages)

Das Spiel ist reines HTML ohne Build-Schritt und läuft daher direkt von GitHub aus.

**Settings → Pages → Source: „Deploy from a branch" → Branch: `main`, Ordner `/ (root)` → Save**

Nach ein bis zwei Minuten ist es erreichbar unter:

```
https://darktemplarxy.github.io/Soldier-RPG/
```

Der Link steht bereits oben in der README.

## 2. Beschreibung und Themen

Rechts oben auf der Repo-Seite auf das Zahnrad neben „About":

**Beschreibung**
> Karriere-Simulator in der Grande Armée 1796–1815. Vom analphabetischen Rekruten zum Marschall — wenn du überlebst.

**Website:** die Pages-Adresse von oben eintragen.

**Themen (Topics):**
`game` · `roguelike` · `permadeath` · `napoleonic` · `text-game` · `javascript` · `html5` · `no-dependencies` · `deutsch` · `historical`

## 3. Erster Push

```bash
git init
git add -A
git commit -m "Meilenstein 1: Kapitel Italien 1796/97 spielbar"
git branch -M main
git remote add origin https://github.com/DarkTemplarxy/Soldier-RPG.git
git push -u origin main
```

Liegt dort schon eine README aus der Repo-Erstellung, vorher einmal
`git pull --rebase origin main` — oder sie beim Push überschreiben lassen.
