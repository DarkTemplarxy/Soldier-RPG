/* Baut aus den aufgeteilten Dateien eine einzelne HTML-Datei zum Weitergeben.
   Aufruf:  node werkzeug/bauen.js   →   dist/marschallstab.html  */
const fs = require('fs'), path = require('path');
const wurzel = path.resolve(__dirname, '..');
const lies = p => fs.readFileSync(path.join(wurzel, p), 'utf8');

const index = lies('index.html');
const dateien = [...index.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
const aus = index
  .replace('<link rel="stylesheet" href="src/stil.css">', '<style>\n' + lies('src/stil.css') + '\n</style>')
  .replace(/<!-- Reihenfolge[\s\S]*?<script src="src\/start\.js"><\/script>/,
           '<script>\n' + dateien.map(lies).join('\n\n') + '\n</script>');

fs.mkdirSync(path.join(wurzel, 'dist'), { recursive: true });
fs.writeFileSync(path.join(wurzel, 'dist/marschallstab.html'), aus);
console.log('dist/marschallstab.html ·', Math.round(aus.length/1024), 'KB ·', dateien.length, 'Quelldateien');
