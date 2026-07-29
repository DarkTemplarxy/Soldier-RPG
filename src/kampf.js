'use strict';
/* Gefecht, Elitekompanie und Beförderung. */

/* ══════════════════ KAMPF ══════════════════ */

function aktionen(){
  const a = [];
  const zw = S.zweig;

  /* ══════════════════ DER ZWEITE SICHTBARE BRUCH ══════════════════

     **Ab Rang 7 verschwinden Laden und Feuern vollständig.** Nicht abgefedert,
     nicht als Notknopf behalten — ein Offizier trug keine Muskete, und das ist
     der Punkt: *Du schießt nicht mehr. Du entscheidest.*

     Es ist der härteste Eingriff des ganzen Entwurfs, weil er dem Spieler das
     wegnimmt, was er zehn Spieljahre lang getan hat. Genau deshalb darf er
     nicht weich sein: Ein „Muskete aufheben"-Knopf würde den Bruch in eine
     Option verwandeln, und eine Option ist kein Bruch.

     **Ausnahme mit Ansage:** Wenn die Linie bricht (`K.nahkampf`), klappt das
     Gefecht für zwei bis drei Runden auf die persönliche Ansicht zurück. Dann
     gibt es wieder Säbel und Deckung — aber nie wieder eine Muskete. */
  const offizier = S.rang >= 7;
  const stab = S.rang >= 10;                 // Bataillon und darüber
  const general = S.rang >= 12;              // die Operationskarte
  const nah = offizier && K.nahkampf > 0;

  /* ── Der Stab ──
     Ab Rang 10 gibt es keine persönliche Handlung mehr, auch keine im
     Nahkampf: Ein Chef de bataillon, der den Degen zieht, hat sein Bataillon
     bereits verloren. Die Knöpfe unten hören deshalb hier auf und fangen
     weiter unten neu an. */
  if(stab && !general) return stabAktionen();
  if(general) return generalAktionen();

  if(!offizier){
  a.push({id:'laden',label:'Laden',cost:'Geschick · Atem −8',aus:()=>K.geladen});
  if(zw==='voltigeur'){
    a.push({id:'zielen',label:'Sorgfältig zielen und feuern',cost:'Muskete +15 · kostet zwei Atemzüge',aus:()=>!K.geladen});
    a.push({id:'feuern',label:'Schnell feuern',cost:'Muskete',aus:()=>!K.geladen});
    a.push({id:'deckung',label:'Deckung wechseln',cost:'Geschick · du bist schwer zu treffen'});
    // Der Plänkler ist gerade der, der sich hinlegt — er steht in keiner Linie,
    // die jemand halten müsste. Ohne diese Wahl war der Zweig der einzige, der
    // nicht verschnaufen konnte.
    a.push({id:'ducken',label:'Flach hinlegen',cost:'Atem +10 · Belastung −2 · kein Schuss, aber auch kein Ziel · höchstens drei Runden am Stück',
      aus:()=> (K.duckFolge||0)>=3});
  } else {
    a.push({id:'feuern',label:'Anlegen und feuern',cost:'Muskete',aus:()=>!K.geladen});
    a.push({id:'ducken',label:'Hinknien',cost:'Atem +10 · Belastung −2 · du schießt nicht, aber sie treffen dich auch schlechter · höchstens drei Runden am Stück',
      aus:()=> (K.duckFolge||0)>=3});
    a.push({id:'halten',label:'Stehenbleiben und die Linie halten',cost:'Kaltblütigkeit'});
  }
  a.push({id:'bajonett',label:zw==='grenadier'?'Bajonett fällen und vorgehen':'Mit dem Bajonett vor',
    cost:(zw==='grenadier'?'Bajonett +10 · ':'Bajonett · ')+'sehr gefährlich',risk:true});
  }

  /* ── Der Offizier ──
     Vier Knöpfe, und keiner davon ist ein Schuss. Der Feuerbefehl ist sein
     „Schuss": Er skaliert mit dem Zustand der Einheit, nicht mit der eigenen
     Hand. Das Gelände lesen wirkt einmal je Gefecht und dauerhaft — die erste
     Verwendung von Taktik, die etwas kostet und etwas bringt.

     **Die Initiative ist die Frage des Ranges.** Gehorchen oder handeln, und
     der Preis für Eigenmacht ist nicht Blut, sondern die Kette: Wer danebenhaut,
     hat eigenmächtig gehandelt, und das steht in einem Bericht. */
  if(offizier && !nah){
    a.push({id:'vorfuehren',label:'Den Zug vorführen',
      cost:'Autorität · voller Schaden · Gefahr +8, denn du gehst voran',risk:true});
    a.push({id:'gelaendenutzen',label:'Das Gelände nutzen',
      cost:'Taktik · drei Runden weniger Gefahr, dafür weniger Wirkung'});
    a.push({id:'frontverkuerzen',label:'Die Front verkürzen lassen',
      cost:'Drill · Bestand +5 · drei Runden halbe Verluste'});
    a.push({id:'degen',label:'Den Degen ziehen',
      cost:'Kaltblütigkeit · einmal je Gefecht · deine Einheit hält, egal wie es steht · Gefahr +20',
      risk:true, aus:()=> !!K.degenGezogen});
    /* Ab Rang 8 darf sich der Zug aus der Linie lösen — und damit fällt der
       Beitrag der zweihundert anderen weg, ohne den seit Rang 1 kein Gefecht
       zu gewinnen war. Zum ersten Mal steht dein Schaden für sich allein. */
    if(S.rang>=8) a.push({id:'loesen',label:K.geloest?'Den Zug wieder in die Linie nehmen':'Den Zug aus der Linie lösen',
      cost:K.geloest?'zurück unter den Schutz der Linie':'Taktik · kein Linienfeuer mehr · dafür ist nichts mehr gedeckelt'});
  }

  /* Wenn die Linie bricht: zurück auf vier Männer und Rauch. Keine Muskete —
     die ist seit dem Patent weg —, aber Säbel, Deckung und die Frage, ob man
     stehen bleibt. Wie in Savona 1796, nur suchen sie jetzt zuerst dich. */
  if(nah){
    a.push({id:'saebel',label:'Den Säbel nehmen',
      cost:'Säbel · sie sind schon in der Linie',risk:true});
    a.push({id:'halten',label:'Stehenbleiben, wo du stehst',cost:'Kaltblütigkeit'});
    a.push({id:'ducken',label:'In Deckung gehen',
      cost:'Atem +10 · und jeder sieht, dass der Offizier sich duckt',
      aus:()=> (K.duckFolge||0)>=2});
  }
  if(S.rang>=3 && S.rang<5){
    a.push({id:'salve',label:'Der Korporalschaft Salve befehlen',
      cost:'Autorität · acht Musketen auf einmal — mehr als du allein triffst, und deine bleibt geladen'});
    a.push({id:'luecke',label:'Die Lücke links schließen lassen',
      cost:'Drill · eure Linie verliert weniger Männer · Ruf, wenn es gelingt'});
  }
  /* Ab Rang 5 führt man keine acht Mann mehr, sondern zwanzig — und die
     Knöpfe wechseln vollständig. Das ist der Maßstabswechsel aus KONZEPT §3:
     Nicht größere Zahlen, ein anderes Spiel. Der Caporal befiehlt eine Salve;
     der Sergent verwaltet eine Sektion, die dabei aufgebraucht wird. */
  /* Ab Rang 6 führt man nicht mehr zwanzig Mann, sondern die, die zwanzig Mann
     führen. Der Zug ist bewusst **schlank** gehalten — zwei Knöpfe, nicht vier:
     Der Sergent-major greift seltener selbst ein, er lässt eingreifen. Genau
     das ist der Unterschied, und mehr Knöpfe würden ihn verwischen. */
  if(S.rang>=6){
    a.push({id:'zugfeuer',label:'Feuer nach Sektionen',
      cost:'Drill · rollendes Feuer · der Zug schießt auch, während du nachlädst'});
    a.push({id:'einteilen',label:'Die Sergenten einteilen',
      cost:'Autorität · drei Runden halbe Verluste im ganzen Zug'});
  }
  if(S.rang===5){
    a.push({id:'sektionsalve',label:'Salve auf Kommando',
      cost:'Autorität · zwanzig Musketen auf einen Schlag · deine bleibt geladen'});
    a.push({id:'glieder',label:'Die Glieder wechseln lassen',
      cost:'Drill · frische Männer nach vorn · eure Verluste sinken drei Runden'});
    a.push({id:'herausnehmen',label:'Den Wankenden aus dem Glied ziehen',
      cost:'Menschenkenntnis · einer läuft gleich · du stehst dabei im Freien',risk:true});
    a.push({id:'halten_sektion',label:'Schließen und halten lassen',
      cost:'Drill · die ganze Sektion · Ruf beim ersten Mal'});
  }
  a.push({id:'zurueck',label:'Zurückweichen',cost:'Ruf −− · der Kampf ist für dich vorbei',risk:true});
  return a;
}

/* ── Die Knöpfe des Bataillonschefs (Rang 10 und 11) ──
   Fünf, und keiner davon ist eine Handlung — es sind Anweisungen an vier
   Rechtecke. Der erste ist die Rechnung: **Wen schickst du zuerst hinein?** */
function stabAktionen(){
  const a = [], K1 = K.kompanien || [];
  if(!K.vorhut){
    K1.forEach((k,i)=> a.push({id:'vorhut'+i, label:'Die '+k.name+' vorgehen lassen',
      cost:'Bestand '+Math.round(k.bestand)+' · Haltung '+Math.round(k.haltung)+
           ' · sie geht als erste hinein', risk:true}));
    return a;
  }
  a.push({id:'staffeln',label:'Die Kompanien staffeln',
    cost:'Taktik · die hinteren lösen die vordere ab, ehe sie bricht'});
  a.push({id:'schwerpunkt',label:'Den Schwerpunkt verlegen',
    cost:'Taktik · voller Druck auf einen Abschnitt · die anderen stehen offen',risk:true});
  a.push({id:'sammeln',label:'Die Gebrochenen sammeln lassen',
    cost:'Autorität · Haltung zurück, Bestand nicht'});
  a.push({id:'melden',label:'Nach oben melden und um Verstärkung bitten',
    cost:'Verwaltung · manchmal kommt sie · einmal je Gefecht',
    aus:()=> !!K.gemeldet});
  /* Ab Rang 11 hängt am Bataillon ein Adler, und der Adler ist kein Symbol,
     sondern ein Zustand mit drei Werten (siehe `adlerStand()`). */
  if(S.rang>=11) a.push({id:'adler',label:'Den Adler nach vorn tragen lassen',
    cost:'Autorität · Haltung im ganzen Regiment · und er steht dort, wo geschossen wird',risk:true});
  a.push({id:'zurueck',label:'Das Bataillon zurücknehmen',
    cost:'Ruf −− · das Gefecht ist für euch vorbei',risk:true});
  return a;
}

/* ── Die Knöpfe des Generals (Rang 12 bis 14) ──
   **Keiner davon wirkt sofort.** Ein Befehl braucht Laufzeit, eine Aufklärung
   braucht Laufzeit, und was zurückkommt, ist vierzig Minuten alt. Das ist die
   Umkehrung des Fusiliers und der Punkt des ganzen Spiels: *Der General sieht
   mehr und weiß weniger.* Der Fusilier sah vier Männer und Rauch — aber was er
   sah, war wahr. */
function generalAktionen(){
  const a = [], V = K.verbaende || [];
  V.forEach((v,i)=>{
    if(v.befehl) return;                        // ein Verband hat einen Befehl oder keinen
    a.push({id:'befehl'+i, label:'Befehl an die '+v.name,
      cost:'gemeldet '+Math.round(v.gemeldet)+(v.alter?' · '+v.alter+' '+zeitWort(true)+' alt':' · eben erst')+
           (v.schweigt?' · sie antwortet nicht':'')+' · Laufzeit'});
  });
  a.push({id:'aufklaeren',label:'Aufklärung anfordern',
    cost:'Kartenkunde · du erfährst es, wenn es vorbei ist'});
  a.push({id:'reserve',label:'Die Reserve einsetzen',
    cost:'Taktik · einmal · und danach hast du keine mehr',risk:true, aus:()=> !!K.reserveWeg});
  a.push({id:'warten',label:'Warten, bis die Meldungen kommen',
    cost:'nichts tun · und das ist manchmal die Entscheidung'});
  a.push({id:'zurueck',label:'Den Angriff abbrechen',
    cost:'Ruf −− · und niemand wird dir sagen, ob es nötig war',risk:true});
  return a;
}

/* ── Die Zeit läuft mit dem Rang ──
   Runden (1–9) → Phasen (10–11) → Stunden (12) → Tage (13–14). Es ist die
   billigste Rückmeldung über Größe, die es gibt, und sie kostet eine Zeile:
   Wer in Tagen denkt, führt keine Männer mehr, sondern einen Feldzug. */
function zeitWort(mehrzahl){
  if(S.rang>=13) return mehrzahl ? 'Tage' : 'TAG';
  if(S.rang>=12) return mehrzahl ? 'Stunden' : 'STUNDE';
  if(S.rang>=10) return mehrzahl ? 'Phasen' : 'PHASE';
  return mehrzahl ? 'Runden' : 'RUNDE';
}

/* ── Anmarsch: der Weg dorthin, die Lage, das Warten ──
   Zwischen zwei Gefechten liegen Wochen und hunderte Kilometer. Wer direkt aus
   der Szene in die erste Runde fällt, merkt davon nichts. Der Anmarsch kostet
   deshalb auch etwas: Marsch nutzt Schuhe ab und geht auf den Atem. */

/* ── Anerkennung im Gefecht ──
   Ruf entsteht aus dem, was man tut, nicht nur daraus, wie es ausgeht. Jede
   Tat, die jemand sehen konnte, bringt sofort etwas — sichtbar in der
   Seitenleiste, bevor das Gefecht vorbei ist.

   Höchstens drei je Gefecht — mehr sieht in diesem Rauch niemand. Die Grenze
   ist knapp gewählt, weil Ruf die Beförderungswährung ist: Ein Zuschlag von
   drei je Gefecht sind über fünf Gefechte fünfzehn Punkte auf eine Schwelle
   von dreißig, und das ist schon viel. Neu ist außerdem, dass auch ein
   verlorenes Gefecht Ruf bringen kann — gesehen wird man trotzdem.

   *Ein Umweg, der nicht funktioniert hat:* Statt eines Zuschlags war das
   zuerst eine Umverteilung — pauschaler Siegesruf minus vier, bis zu fünf hier
   zurückzuverdienen. Gemessen brach der Caporal-Anteil von 39 % auf 21 % und
   die Überlebensquote von 49 % auf 40 %, weil der Testbot sich nur etwa zwei
   Punkte je Gefecht zurückholt und über den Rang auch der zusätzliche
   Lagerabend wegfiel. Wer das noch einmal versucht, misst beide Zahlen. */
const RUHM_JE_GEFECHT = 3;

function anerkennung(betrag, was){
  const rest = Math.max(0, RUHM_JE_GEFECHT - K.ruhm);
  const gibt = Math.min(betrag, rest);
  if(gibt <= 0) return '';
  K.ruhm += gibt; S.ruf += gibt;
  /* **Der Lieutenant führt die Liste der Namen.** Das ist die einzige Quelle
     für seine Fürsprache, die schon einem Füsilier offensteht — und sie muss
     es sein: Ohne sie hing der Sergent an Handlungen, die es erst ab Rang 4
     gibt (Henne und Ei, gemessen mit 0 % Sergenten in 120 Läufen). Einmal je
     Gefecht, damit sie sich nicht einsammeln lässt; wer zehn Gefechte lang
     auffällt, kommt genau auf die vier, die der Feldweg verlangt. */
  /* Sichtbar gemacht, wenn es passiert: Bis dahin stand nur „gesehen · Ruf +1"
     da, und der Spieler erfuhr erst bei der Musterung, dass der Lieutenant eine
     Liste führt („Er geht die Liste durch. Bei dir hält er nicht an."). Die
     Ursache gehört an den Ort der Wirkung — sonst wirkt die Fürsprache wie
     eine Zahl, die von allein wächst, statt wie das, was sie ist: Er hat
     zugesehen. Nur beim ersten Mal je Gefecht, weil sie nur einmal steigt. */
  let notiert = '';
  if(!K.offizierGesehen){
    K.offizierGesehen = true; gunstGeben('berthaud', 1);
    notiert = ` · <span class="fein">${esc(personKurz('berthaud'))} schreibt deinen Namen auf</span>`;
  }
  K.taten.push({was, ruf:gibt});
  if(K.zaehlung) K.zaehlung.ereignisse++;
  return ` <span class="fein">gesehen · Ruf +${gibt}</span>${notiert}`;
}

/* Die Güte des Gegners in diesem Gefecht — aus der Kampagne, zu der die
   Station gehört. Einmal je Kampfrunde gerufen; die Suche über elf Kampagnen
   ist billiger als ein zweites Feld in jedem Gefechtsdatensatz. */
function feindGuete(n){
  for(const k of KAMPAGNEN)
    if((STATIONEN[k.id]||[]).some(x=>x.id===n.id)) return k.guete||0;
  return 0;
}

function starteKampf(n){
  if(n.anmarsch && !S.anmarschGesehen){
    S.anmarschGesehen = n.id;
    // Der Weg dorthin kostet — in Ägypten mehr als in Italien (anmarschKosten in den Daten)
    const ak = n.anmarschKosten || {verschleiss:0.15, atem:4, belastung:1};
    verschleiss(ak.verschleiss);
    /* „Mehr Patronen und zwei Tage Proviant": Der verstärkte Tornister halbiert,
       was der Anmarsch an Luft kostet. Bis dahin war er der einzige Kauf im
       Laden ohne jede Wirkung — 24 Veteranenpunkte für eine Zahl, die niemand
       abfragte. Wer bei Akkon 8 Atem verliert statt 4, merkt den Unterschied. */
    const tornister = S.kaeufe.includes('tornister_gut') ? 0.5 : 1;
    S.atem = Math.max(0, S.atem - Math.round(ak.atem*tornister));
    S.belastung = Math.min(100, S.belastung+ak.belastung);
    atemKlemmen();
    laufSichern();
    zeigeAnmarsch(n);
    return;
  }
  S.anmarschGesehen = null;
  setzeKampf({runde:1, geladen:true, deckung:false, feindMoral:n.feindMoral,
              eigen:100, vorn:false, geschlossen:0, lueckeGelobt:false,
              ruhm:0, taten:[],
              /* Was dieses Gefecht an Sichtbarem hervorgebracht hat. `taten` sind
                 die Ruf-Ereignisse (Text), `zaehlung` sind die Zahlen dahinter. */
              zaehlung:{schaden:0, serie:0, bestSerie:0, ereignisse:0, vorn:false, gedeckt:0, offen:0},
              ereignis:null, ereignisZahl:0, gesehen:[], gefahrPlus:0, duckFolge:0,
              sektion:100, sektionStart:100, sektionGelobt:false, offizierGesehen:false, blitz:false,
              rollend:0,
              /* Der Offizier: gelöster Zug, Geländevorteil, gezogener Degen —
                 und `nahkampf`, die Runden, in denen das alles nichts gilt. */
              geloest:false, gelaendeVorteil:0, degenGezogen:false, zugHaelt:false,
              nahkampf:0, nahkampfGrund:'', auftragErfuellt:null,
              /* Der Stab: vier Kompanien ab Rang 10, Verbände auf der Karte ab
                 Rang 12, und die Meldungen, die immer zu spät kommen. */
              kompanien: S.rang>=10 ? kompanienStart() : null,
              vorhut:null, stabsereignis:false,
              verbaende: S.rang>=12 ? verbaendeStart() : null,
              befehle:[], meldungen:[], uhr:0,
              protokoll:['Das Gefecht beginnt.'], zielt:false, verluste:0});
  laufSichern();
  zeigeKampf(n.intro);
}

/* ══════════════════ DER DRITTE SICHTBARE BRUCH: DAS BATAILLON ══════════════════

   **Ab Rang 10 sind Männer Rechtecke.** Vier Kompanien, jede mit Bestand und
   Haltung, und du siehst kein einziges Gesicht mehr. Die Kompanie, die als
   erste hineingeht, hat einen Namen und einen Buchstaben; wenn sie
   zusammenbricht, steht das als Zahl in einer Meldung.

   **Die neue Frage ist eine Rechnung, die man nicht gerne macht.** Eine der
   vier muss vorgehen, damit die anderen drei durchkommen. Das Spiel fragt
   dich, welche. Es sagt dir nicht, dass es eine falsche Wahl gibt, und es sagt
   dir hinterher nicht, ob du richtig lagst — es nennt nur die Zahl und den
   Buchstaben. Genau darin liegt der Unterschied zu allen Rängen davor: Bis
   Rang 9 hast du entschieden, was **du** tust. Ab hier entscheidest du, wer
   stirbt. */
function kompanienStart(){
  /* Die Güte kommt aus dem Lager (`S.sektionGuete`), wie schon bei Sektion und
     Zug — wer seine Leute ausgebildet hat, hat sie hier in vierfacher Zahl. */
  const g = Math.min(20, (S.sektionGuete||0)/2);
  return ['1.','2.','3.','4.'].map((nm,i)=>({
    name: nm+' Kompanie', kurz: nm[0],
    bestand: 100, haltung: 70 + Math.round(g) - i*3, vorn: false
  }));
}

/* Ab Rang 12 sind es keine Kompanien mehr, sondern Verbände auf einer Karte —
   und ihr Zustand ist nicht bekannt, sondern **gemeldet**. Siehe `karte()`. */
function verbaendeStart(){
  const n = S.rang>=13 ? 5 : 4;
  const namen = ['9. Linie','24. Linie','57. Linie','5. Leichte','12. Kürassiere'];
  return namen.slice(0,n).map((nm,i)=>({
    name: nm, bestand: 100, ort: i, befehl: null,
    /* Was du zuletzt gehört hast, und wie alt es ist. Nicht, was wahr ist. */
    gemeldet: 100, alter: 0, schweigt: false
  }));
}

/* ══════════════════ DIE ZWEITE ACHSE: DER AUFTRAG ══════════════════

   **Ab Rang 9 hat jedes Gefecht zwei Ziele.** Die Feindmoral wie bisher — und
   einen Auftrag vom Chef de bataillon, der damit nichts zu tun haben muss.

   Man kann siegen und den Auftrag verfehlen. Man kann den Auftrag erfüllen und
   die halbe Kompanie verlieren. **Die Auszeichnungen hängen am Auftrag, nicht
   am Sieg** — und damit hört „gewinnen" auf, eine eindeutige Sache zu sein.
   Das ist der eigentliche Rangunterschied des Capitaine: Bis Rang 8 war klar,
   was gut ausgegangen ist; ab hier steht es auf zwei Blättern, und die beiden
   Blätter widersprechen einander regelmäßig.

   Der Auftrag steht **vor** der ersten Runde auf dem Schirm und wird nie
   nachträglich geändert. Ein verstecktes Ziel wäre eine Falle, und Fallen sind
   nicht das, was dieser Rang verkauft. */
const AUFTRAEGE = [
  {id:'halten', text:'Die Kompanie hält den Abschnitt, bis das zweite Bataillon durch ist.',
   erfuellt:(n)=> (K.sektion==null?100:K.sektion) >= 50,
   gut:'Das zweite Bataillon ist durch. Der Abschnitt hat gehalten, weil hundertzwanzig Mann dort gestanden sind, wo sie stehen sollten.',
   schlecht:'Das zweite Bataillon ist durch, aber nicht dort, wo es durch sollte, weil dein Abschnitt vorher aufgemacht hat.'},
  {id:'nehmen', text:'Die Kompanie nimmt die Stellung, ehe es dunkel wird.',
   erfuellt:(n)=> K.feindMoral <= 0,
   gut:'Die Stellung ist genommen, und sie ist vor der Dämmerung genommen. Mehr stand nicht im Befehl.',
   schlecht:'Es wird dunkel, und die Stellung ist nicht genommen. Was im Befehl stand, steht am Morgen unverändert wieder da.'},
  {id:'decken', text:'Die Kompanie deckt die linke Flanke der Brigade. Vorgehen ist nicht befohlen.',
   erfuellt:(n)=> (K.eigen==null?100:K.eigen) >= 45,
   gut:'Die Flanke steht. Von der Brigade hat es niemand gesehen, und das ist bei einer gedeckten Flanke die Regel.',
   schlecht:'Die Flanke ist aufgegangen. Was hindurchkam, kam der Brigade in den Rücken, und das hat jemand gesehen.'},
  {id:'schonen', text:'Die Kompanie hält den Abschnitt und schont ihre Leute. Man braucht sie übermorgen.',
   erfuellt:(n)=> (K.sektion==null?100:K.sektion) >= 70,
   gut:'Übermorgen steht die Kompanie da, wo man sie braucht, und sie steht vollzählig genug, um etwas damit anzufangen.',
   schlecht:'Übermorgen fehlt der Kompanie ein Drittel. Der Befehl hat das ausdrücklich verhindern wollen.'}
];
function auftragFuer(n){
  if(S.rang < 9) return null;
  const saat = (n.id||'').split('').reduce((a,c)=>a+c.charCodeAt(0),0);
  return AUFTRAEGE[saat % AUFTRAEGE.length];
}

/* ══════════════════ DIE LINIE BRICHT ══════════════════

   **Der Bildschirm klappt für zwei bis drei Runden auf die persönliche Ansicht
   zurück.** Keine Sektionen, keine Befehle, keine Probe auf andere Leute. Vier
   Männer und Rauch, wie in Savona 1796 — nur bist du jetzt der, den sie zuerst
   suchen.

   **Höchstens einmal je Kapitel**, sonst wäre es kein Einbruch, sondern eine
   Spielart. Und es ist der einzige Augenblick, in dem der Säbelwert etwas tut:
   derselbe Wert, den man als Grenadier hatte, und seither nicht gewachsen
   (siehe `nutzen()`). Wer im Lager nie auf dem Fechtboden war, merkt genau
   hier, was zehn Jahre Schreibtisch mit einem Mann machen. */
function nahkampfPruefen(n){
  /* ── Nur die Ränge 7 bis 9 ──
     **Gefunden vom Kapitelprüfstand bei Eylau:** Die Bedingung lautete
     `rang < 7` und ließ die Linie damit bis zum Marschall brechen — ein
     Général de brigade zog auf der Operationskarte den Säbel, weil ein
     Karree, das er nie gesehen hat, an einer Seite nachgab.
     `K.sektion` ist ab Rang 10 leer, also griff nur der `bestand`-Auslöser
     nicht; die drei anderen schon.

     Das widerspricht dem Entwurf der Stabsränge an der empfindlichsten
     Stelle: Ab Rang 10 ist der Gefahrzuschlag **null** („du stehst nicht mehr
     im Feuer", RANGLEITER §8), und an seiner Stelle steht das Stabsereignis
     mit 8 % — ein Streuschuss, ein stürzendes Pferd, und **man kann sich
     nicht hinwerfen.** Das ist die Ersatzgefahr des Stabes, und daneben
     gehört keine zweite. */
  if(S.rang < 7 || S.rang >= 10 || K.nahkampf > 0) return '';
  const kap = (typeof kapitelVon==='function') ? kapitelVon(n) : 'x';
  if((S.nahkampfKapitel||[]).includes(kap)) return '';
  let grund = '';
  if((K.sektion||100) < 40) grund = 'bestand';
  else if(n.formation==='karree' && K.runde>=4 && Math.random()<0.5) grund = 'reiter';
  else if(n.gelaende==='mauer' && K.runde>=5 && Math.random()<0.4) grund = 'bresche';
  else if(K.feindMoral > n.feindMoral*0.8 && K.runde>=6 && Math.random()<0.25) grund = 'nachhut';
  if(!grund) return '';
  S.nahkampfKapitel = (S.nahkampfKapitel||[]).concat([kap]);
  K.nahkampf = 2 + Math.floor(Math.random()*2);
  K.nahkampfGrund = grund;
  K.deckung = false;
  return ({
    bestand:'Von deinen sechzig stehen keine vierundzwanzig mehr, und die Ordnung, die sie zusammengehalten hat, ist keine Ordnung mehr. Was jetzt kommt, kommt zu dir.',
    reiter:'Das Karree hält an drei Seiten. An der vierten kommt ein Pferd durch, und hinter dem Pferd kommen die anderen. Drinnen ist kein Platz zum Ausweichen — das ist der Sinn eines Karrees und gerade jetzt sein Fehler.',
    bresche:'Auf der Rampe wird es eng, und in der Bresche ist es kein Gefecht mehr, sondern Gedränge mit Eisen. Niemand befiehlt hier irgendetwas.',
    nachhut:'Der Rückzug geht über einen Damm, der für zwei Mann nebeneinander gebaut ist. Die Nachhut bist du, weil du der Letzte bist, der noch etwas sagen kann.'
  })[grund];
}

/* Was du über dich selbst weißt, bevor es losgeht. Keine Zahlen, die in der
   Seitenleiste schon stehen — sondern was sie bedeuten. */
function gefechtsbereitschaft(){
  const z = [], m = S.ausr.muskete.zustand, sch = S.ausr.schuhe.zustand;
  if(m<35) z.push('Das Schloss ist braun vom Rost. Ob die Muskete zündet, wird sich zeigen, wenn es darauf ankommt.');
  else if(m<60) z.push('Die Muskete ist gebraucht, aber trocken. Sie hat bisher gezündet.');
  else z.push('Die Muskete ist sauber und geölt. In dieser Armee ist das keine Selbstverständlichkeit.');
  if(sch<25) z.push('Von deinen Schuhen ist wenig übrig. Du hast seit dem Aufbruch nasse Füße und spürst jeden Stein.');
  else if(sch<50) z.push('Die Schuhe halten. Noch.');
  if(S.wunden.length) z.push('Du trägst ' + (S.wunden.length===1?'eine alte Wunde':S.wunden.length+' alte Wunden') +
    ' mit dir: ' + S.wunden.map(w=>esc(w.name)).join(', ') + '.');
  const seuche = S.wunden.filter(x=>x.zehrt);
  if(seuche.length) z.push('Du gehst krank in dieses Gefecht — ' + seuche.map(x=>esc(x.name)).join(' und ') +
    '. Es nimmt dir jeden Tag etwas, und heute ist ein schlechter Tag dafür.');
  if(angeschlagen()) z.push(S.leben <= lebenMax()*0.15
    ? 'Du hast zu viel Blut verloren, um hier zu stehen. Wenn dich heute etwas trifft, war es das.'
    : 'Du bist nicht wiederhergestellt. Was noch nicht zu ist, wird gleich wieder aufgehen.');
  // Ab Rang 10 schweigt der Atem, hier wie in der Seitenleiste (der dritte Bruch).
  if(ausserAtem() && S.rang<10) z.push(S.atem<30
    ? 'Du bist ausgepumpt, bevor der erste Schuss fällt. Unter 30 Atem trifft dich mehr, als dich treffen müsste — das hier wird teuer.'
    : 'Dir geht die Luft aus, bevor es losgeht. Unter 30 wird jede Runde gefährlicher.');
  if(S.belastung>60) z.push('Deine Hände sind nicht ruhig. Du hältst sie an den Riemen, damit es niemand sieht.');
  if(S.kameradschaft>=50) z.push('Links und rechts stehen Männer, die deinen Namen kennen. Das ist keine Kleinigkeit.');
  if(S.rang>=13) z.push('Zehntausend Mann stehen auf einer Fläche, die du von hier nicht überblicken kannst. Was du von ihnen weißt, steht auf Papier.');
  else if(S.rang>=12) z.push('Fünf Regimenter, drei Straßen, eine Uhr. Du wirst heute niemanden sehen, den du kennst.');
  else if(S.rang>=11) z.push('Zweitausend Mann und ein Adler. Der Adler wiegt zwei Kilo und ist das Einzige, dessen Verlust dich den Rang kostet.');
  else if(S.rang>=10) z.push('Vier Kompanien stehen bereit. Du wirst gleich entscheiden müssen, welche davon zuerst hineingeht.');
  else if(S.rang>=3) z.push('Acht Mann sehen dich an und warten darauf, dass du etwas sagst.');
  else if(S.zweig==='voltigeur') z.push('Du gehst vor der Linie. Wenn es losgeht, steht neben dir niemand.');
  else if(S.zweig==='grenadier') z.push('Die Grenadierkompanie steht vorne. Das ist der Sinn der Bärenfellmütze.');
  return z;
}

function zeigeAnmarsch(n){
  const l = n.lage || {};
  const hoehepunkt = n.haerte > 1;
  const zeilen = [['Gegner',l.gegner],['Auftrag',l.auftrag],['Gelände',l.gelaende],['Dein Platz',l.stellung]]
    .filter(([,v])=>v).map(([k,v])=>`<tr><td class="k">${k}</td><td class="d">${esc(v)}</td></tr>`).join('');
  app.innerHTML = `<div class="stage">${verlauf()}
    <div>${wegband(n)}
      <div class="card"><div class="ch"><span>Anmarsch · ${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
        <div class="cb">
          <div class="prose">${n.anmarsch.map(t=>`<p>${t}</p>`).join('')}</div>
          ${hoehepunkt?`<div class="ergebnis schlecht">Das hier wird kein gewöhnliches Gefecht. Was heute trifft, trifft härter — die Alten reden anders als sonst, und der Feldscher hat seine Karren schon vorn.</div>`:''}
          ${zeilen?`<div class="lage"><div class="lagekopf">Was man weiß</div>
            <table>${zeilen}</table></div>`:''}
          <div class="lage"><div class="lagekopf">Womit du dastehst</div>
            <div class="prose">${gefechtsbereitschaft().map(t=>`<p>${t}</p>`).join('')}</div></div>
        </div></div>
      <div class="orders"><div class="ordbody">
        <button class="ord weiter" onclick="starteKampf(KAPITEL[LAUF.node])">Antreten
          <span class="cost">Danach gibt es keinen Weg zurück, der nicht Ruf kostet</span></button>
      </div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

/* ── Sichtfeld ──
   Das Gefecht als Aufstellung, aus deiner Augenhöhe: unten deine Linie in
   Blau, drüben der Feind in Rot, dazwischen Rauch. Beide Seiten verlieren
   sichtbar Männer — die Zahl der Figuren folgt `feindMoral` und `eigen`, und
   die Waage unten sagt, wohin es gerade kippt.

   Zwei Regeln, die den Ton halten: Du stehst immer dort, wo du hingehörst
   (in der Linie, vor der Linie als Voltigeur, tiefer wenn du kniest oder
   liegst, vorne wenn du mit dem Bajonett vorgegangen bist), und Gefallene
   verschwinden nicht, sie liegen da.

   Alles wird bei jedem Zug neu gezeichnet, deshalb darf hier nichts gewürfelt
   werden: `streu()` ist ein fester Wert je Platz, kein Zufall. */

/* ── Gelände ──
   Ohne das sieht jedes Gefecht gleich aus: zwei Linien in einer Ebene. Ein
   Feld `gelaende` in den Kapiteldaten legt eine Silhouette dahinter, und man
   erkennt das Gefecht am Bild, bevor man den Namen liest. Alles in den
   vorhandenen Brauntönen, alles deterministisch — hier wird nie gewürfelt. */
function gelaendeBild(art){
  if(art==='bruecke') return `
    <rect x="0" y="150" width="640" height="50" fill="${STICH.WASSER}"/>
    <rect x="0" y="150" width="640" height="2" fill="${STICH.WASSER_LI}"/>
    <rect x="150" y="120" width="340" height="34" fill="${STICH.HOLZ}"/>
    <rect x="150" y="118" width="340" height="4" fill="${STICH.HOLZ_HELL}"/>
    ${[0,1,2,3,4,5,6,7,8].map(i=>`<rect x="${152+i*42}" y="100" width="3" height="20" fill="${STICH.HOLZ_HELL}"/>`).join('')}
    <rect x="150" y="100" width="340" height="3" fill="${STICH.HOLZ_HELL}"/>`;
  if(art==='damm') return `
    <rect x="0" y="128" width="640" height="72" fill="${STICH.SCHILF_D}"/>
    <rect x="0" y="140" width="640" height="46" fill="${STICH.SCHILF_M}"/>
    <rect x="0" y="120" width="640" height="26" fill="${STICH.SCHILF_H}"/>
    ${[40,120,300,470,560].map((x,i)=>`<ellipse cx="${x}" cy="${168+i*4}" rx="${22+i*6}" ry="3" fill="${STICH.BUSCH}" opacity=".6"/>`).join('')}
    ${[70,210,420,540].map(x=>`<rect x="${x}" y="150" width="2" height="14" fill="${STICH.HALM}"/>`).join('')}`;
  if(art==='mauer') return `
    <rect x="0" y="0" width="640" height="92" fill="${STICH.HIMMEL}"/>
    <rect x="0" y="24" width="640" height="68" fill="${STICH.MAUER}"/>
    <rect x="0" y="24" width="640" height="3" fill="${STICH.MAUER_FUGE}08"/>
    ${Array.from({length:22},(_,i)=>`<rect x="${i*30}" y="24" width="26" height="9" fill="${STICH.MAUER_STEIN}" opacity="${i%2?.5:.75}"/>`).join('')}
    <path d="M250 92 L272 34 L300 26 L340 30 L368 40 L392 92 Z" fill="${STICH.HIMMEL}"/>
    <path d="M250 92 L272 34 L300 26 L340 30 L368 40 L392 92" fill="none" stroke="${STICH.BRESCHE_K}" stroke-width="1.5"/>
    ${[[262,78],[300,84],[352,80],[380,88]].map(([x,y])=>`<rect x="${x}" y="${y}" width="12" height="5" rx="2" fill="${STICH.BRESCHE_S}"/>`).join('')}`;
  if(art==='wueste') return `
    <rect x="0" y="0" width="640" height="200" fill="${STICH.SAND}"/>
    <path d="M470 84 L520 22 L570 84 Z" fill="${STICH.PYRAMIDE}"/>
    <path d="M556 84 L592 40 L628 84 Z" fill="${STICH.PYRAMIDE_2}"/>
    ${[40,92,140].map((x,i)=>`<g fill="${STICH.PALME}"><rect x="${x+5}" y="${44-i*3}" width="2.5" height="40"/>
      ${[-1,1].map(d=>`<ellipse cx="${x+5+d*9}" cy="${44-i*3}" rx="10" ry="3" transform="rotate(${d*18} ${x+5} ${44-i*3})"/>`).join('')}</g>`).join('')}
    <rect x="0" y="84" width="640" height="116" fill="${STICH.SAND_UNTEN}"/>`;
  return '';
}

/* ══════════════════ DIE PALETTE DES SICHTFELDS ══════════════════

   Jede Farbe des Gefechtsbildes steht hier und nirgends sonst. Vorher lagen
   vierundvierzig Hexwerte über die Zeichenfunktionen verstreut — ein
   Farbwechsel hieß vierundvierzig Einzelfunde, und genau daran scheitert jeder
   Umbau der Gestaltung.

   **Die Namen sind Rollen, keine Farben.** `WASSER` bleibt `WASSER`, ob es
   nachtschwarz oder als Sepialavierung gezeichnet wird — deshalb überlebt diese
   Tabelle den Wechsel von der Nacht zum Kupferstich. */
const STICH = {
  /* ── Kupferstich statt Nacht (28.07.2026) ──
     Gefechtsdarstellungen der Epoche *sind* Stiche und lavierte Skizzen: Sepia
     auf Papier, die Truppen koloriert. Das Sichtfeld ist damit kein Fenster in
     eine dunkle Welt mehr, sondern **die Schlachtskizze auf dem Feldtisch** —
     dieselbe Metapher wie die ganze Oberfläche.

     Praktischer Nebeneffekt: Pulverdampf als graue Lavierung auf hellem Grund
     funktioniert besser als heller Nebel auf dunklem. */
  PAPIER:   '#e4d9bd',   /* der Bogen, auf dem die Skizze steht */
  HIMMEL:   '#e4d9bd',   GRUND:     '#cbbb95',   HORIZONT:  '#8a7a58',
  WASSER:   '#aeb5ab',   WASSER_LI: '#93a09b',
  HOLZ:     '#a68a5e',   HOLZ_HELL: '#8c6f45',
  SCHILF_D: '#b3ae86',   SCHILF_M:  '#c0ba91',   SCHILF_H:  '#cbbb95',
  BUSCH:    '#9aa177',   HALM:      '#7d8759',
  MAUER:    '#c3b491',   MAUER_FUGE:'#8a7a58',   MAUER_STEIN:'#b0a081',
  BRESCHE:  '#7a6b4c',   BRESCHE_K: '#6b5c3f',   BRESCHE_S: '#8a7a58',
  SAND:     '#ddd0ac',   SAND_UNTEN:'#d3c49f',
  PYRAMIDE: '#c4b48e',   PYRAMIDE_2:'#b8a882',   PALME:     '#7d6f4c',
  ZINNE:    '#9d8d6b',   ZINNE_ROT: '#a8503f',

  /* Die drei kolorierten Farben — wie auf einer Uniformtafel. Rot und Blau
     müssen auf dem hellen Bogen kräftiger sein als auf der Nacht, sonst
     verschwinden sie im Papier. */
  ROT:      '#9c3125',   ROT_TOT:   '#c39a90',
  BLAU:     '#27415f',   BLAU_TOT:  '#9aa8b8',   BLAU_WAAGE:'#27415f',
  MESSING:  '#8a6410',   /* du selbst — Bronze, dunkel genug fürs Papier */

  WANKEND:  '#7a6a52',   WAAGE:     '#6d5f4b',   BESCHRIFT: '#584c3c',
  BLITZ:    '#c8901f',   BLITZ_HOF: '#d8b060',

  /* Pulverdampf: graue Lavierung, wie mit dem Pinsel über den Stich gelegt */
  DAMPF:    '#6f6754',   DAMPF_BAND:'#8a8271',   DAMPF_RAND:'#e4d9bd',
  DUNKEL:   '#3a3020'    /* die Vignette am Rand des Bogens */
};


/* ── Das Appell-Bild ──
   Die Abrechnung des Sergenten als Bild statt als Zahl: zwanzig Silhouetten,
   die Gefallenen liegend. Dieselbe Information wie „von zwanzig stehen
   vierzehn", aber man sieht die sechs. */
/* Der Appell als Bild: Wer steht, steht; wer fehlt, liegt. Ab Rang 6 sind es
   sechzig statt zwanzig — dann in drei Reihen zu zwanzig, damit die Figuren
   nicht auf Strichbreite schrumpfen, und mit einer Lücke zwischen den Reihen:
   Es sind **drei Sektionen**, nicht sechzig Einzelne. */
function appellBild(uebrig, kopf){
  kopf = kopf || 20;
  const proReihe = 20, reihen = Math.ceil(kopf/proReihe);
  const R = [];
  for(let i=0;i<kopf;i++){
    const reihe = Math.floor(i/proReihe), spalte = i%proReihe;
    const x = 16 + spalte*26, y = reihe*34;
    R.push(i < uebrig
      ? `<g fill="${STICH.ZINNE}" transform="translate(0 ${y})"><rect x="${x-3}" y="14" width="6" height="18" rx="2.4"/><circle cx="${x}" cy="10" r="2.6"/>
         <ellipse cx="${x}" cy="7" rx="5.4" ry="2" transform="rotate(-7 ${x} 7)"/></g>`
      : `<rect x="${x-7}" y="${30+y}" width="14" height="2.6" rx="1.3" fill="${STICH.ZINNE_ROT}" opacity=".8"/>`);
  }
  return `<svg viewBox="0 0 540 ${40+(reihen-1)*34}" class="appell" role="img" aria-label="Appell: ${uebrig} von ${kopf} stehen">${R.join('')}</svg>`;
}

/* ══════════════════ DER ZWEITE SICHTBARE BRUCH: DIE HANDSKIZZE ══════════════════

   **Ab Rang 7 siehst du keine Männer mehr.** Was ein Sous-Lieutenant vom
   Gefecht hat, ist das, was er auf ein Blatt zeichnen kann, während er es
   führt: die eigene Front als Strich in drei Abschnitten, den Feind gestrichelt
   und mit einem Fragezeichen, weil niemand weiß, was hinter dem Rauch steht.

   **Das ist der Verlust, um den es geht.** Ein Caporal sah acht Gesichter. Ein
   Sous-Lieutenant sieht drei Striche und eine Zahl, und die Zahl ist das
   Einzige, was ihm sagt, wie es seinen Leuten geht. Größe kostet Nähe — und
   das muss man **sehen**, nicht erklärt bekommen.

   Gezeichnet wird wie im Sichtfeld: **nichts gewürfelt.** Die Handzitterei der
   Striche hängt an `streu(i,a)`, damit die Skizze bei jedem Klick dieselbe ist.

   **Wenn die Linie bricht** (`K.nahkampf`), fällt der Bildschirm auf das alte
   Sichtfeld zurück — dann gibt es wieder Männer und Rauch. */
function skizzenfeld(n){
  const streu = (i,a)=>{ const x = Math.sin(i*127.1 + a*311.7)*43758.5453; return x - Math.floor(x); };
  const feindTeil = Math.max(0, Math.min(1, K.feindMoral / n.feindMoral));
  const teil = Math.max(0, Math.min(1, (K.sektion==null?100:K.sektion)/100));
  const kopf = S.rang>=9 ? 120 : 60;
  const uebrig = Math.max(0, Math.round(teil*kopf));
  const TINTE = STICH.MESSING, BLAU = STICH.BLAU, ROT = STICH.ROT;

  /* Ein von Hand gezogener Strich: drei Stützstellen, alle aus `streu`. */
  const strich = (x1,x2,y,a)=> {
    const m1 = (x1*2+x2)/3, m2 = (x1+x2*2)/3;
    return `M ${x1} ${(y+streu(1,a)*4-2).toFixed(1)} Q ${m1} ${(y+streu(2,a)*6-3).toFixed(1)} ${m2} ${(y+streu(3,a)*5-2.5).toFixed(1)} T ${x2} ${(y+streu(4,a)*4-2).toFixed(1)}`;
  };

  /* Die eigene Front: drei Abschnitte, so viele wie Sektionen. Wo Verluste
     sind, reißt der Strich — nicht als Balken, sondern als Lücke. */
  let front = '';
  for(let s=0;s<3;s++){
    const x1 = 90 + s*160, x2 = x1 + 140;
    const heil = teil > (s===1 ? 0.35 : 0.6);        // die Mitte hält am längsten
    front += `<path d="${strich(x1,x2,236,s+1)}" fill="none" stroke="${BLAU}" stroke-width="${heil?4:2.4}"
      stroke-linecap="round" ${heil?'':'stroke-dasharray="9 7"'} opacity="${heil?0.95:0.6}"/>`;
  }

  /* Der Feind: gestrichelt, weil man ihn nicht sieht, sondern vermutet. */
  let gegen = '';
  for(let s=0;s<3;s++){
    const x1 = 70 + s*170, x2 = x1 + 150;
    gegen += `<path d="${strich(x1,x2,86,s+7)}" fill="none" stroke="${ROT}" stroke-width="3"
      stroke-linecap="round" stroke-dasharray="${(6+streu(s,3)*5).toFixed(1)} ${(7+streu(s,4)*4).toFixed(1)}"
      opacity="${(0.35 + feindTeil*0.55).toFixed(2)}"/>`;
  }

  /* Dein Platz: drei Schritt vor der eigenen Front, als Kreuz. Ein Offizier
     steht nicht *in* der Zeichnung, er steht daneben — sichtbar für beide. */
  const meinY = K.geloest ? 196 : 214;
  const ich = `<g stroke="${TINTE}" stroke-width="2.6" stroke-linecap="round">
      <path d="M 314 ${meinY-7} L 326 ${meinY+7}"/><path d="M 326 ${meinY-7} L 314 ${meinY+7}"/></g>`;

  const marke = (t,x,y,farbe,anker)=>`<text x="${x}" y="${y}" fill="${farbe}" font-size="11"
      text-anchor="${anker||'start'}" font-family="ui-monospace,monospace" letter-spacing=".8">${esc(t)}</text>`;

  return `<div class="feld"><svg viewBox="0 0 640 300" width="100%" height="180"
      preserveAspectRatio="xMidYMid slice" role="img" aria-label="Handskizze der Lage">
    <rect width="640" height="300" fill="${STICH.HIMMEL}"/>
    ${/* Karierung wie auf Millimeterpapier — der Untergrund, auf dem 1805
         Skizzen entstanden, war liniert oder gar nichts. */''}
    ${Array.from({length:7},(_,i)=>`<path d="M 0 ${40+i*38} H 640" stroke="${TINTE}" stroke-width="0.5" opacity="0.12"/>`).join('')}
    ${gegen}
    ${marke('GEMELDET: ' + (feindTeil>0.7?'STARK':feindTeil>0.35?'IM WANKEN':'IM ABBRÖCKELN') + ' ?', 20, 62, ROT)}
    ${K.gelaendeVorteil>0?`<path d="${strich(120,520,160,21)}" fill="none" stroke="${TINTE}" stroke-width="1.6" opacity="0.5" stroke-dasharray="3 6"/>`+marke('BODENWELLE', 20, 156, TINTE):''}
    ${front}
    ${ich}
    ${marke((S.rang>=9?'DEINE KOMPANIE · ':'DEIN ZUG · ')+uebrig+' VON '+kopf, 20, 262, BLAU)}
    ${K.geloest?marke('AUS DER LINIE GELÖST — KEIN FEUER VON RECHTS UND LINKS', 20, 282, ROT):''}
    ${K.zugHaelt?marke('DEGEN GEZOGEN', 620, 262, TINTE, 'end'):''}
    ${marke('SKIZZE · '+esc((n.datum||'').split(' · ')[0]||''), 620, 24, TINTE, 'end')}
  </svg></div>`;
}

/* ══════════════════ DER DRITTE BRUCH ALS BILD: VIER RECHTECKE ══════════════════

   **Männer werden zu Rechtecken.** Kein Strich mehr, der eine Front andeutet,
   und schon gar keine Figuren — vier Kästen mit einem Buchstaben, einer Zahl
   für den Bestand und einem Balken für die Haltung. Der Kasten, der vorn
   steht, ist der einzige, der sich bewegt.

   Das ist ehrlich gezeichnet, nicht abstrakt aus Bequemlichkeit: Ein Chef de
   bataillon sah 1809 genau das — Meldungen, Ziffern, und in der Ferne Staub. */
function bataillonsfeld(n){
  const streu = (i,a)=>{ const x = Math.sin(i*127.1 + a*311.7)*43758.5453; return x-Math.floor(x); };
  const feindTeil = Math.max(0, Math.min(1, K.feindMoral / n.feindMoral));
  const BLAU = STICH.BLAU, ROT = STICH.ROT, TINTE = STICH.MESSING;
  const K1 = K.kompanien || [];

  const kasten = (k,i)=>{
    const vorn = (i === K.vorhut);
    const x = 60 + i*140, y = vorn ? 168 : 218;
    const h = Math.max(0, Math.min(1, k.haltung/100));
    const b = Math.max(0, Math.min(1, k.bestand/100));
    return `<g>
      <rect x="${x}" y="${y}" width="${(96*(0.55+b*0.45)).toFixed(1)}" height="34" fill="${BLAU}"
        opacity="${(0.30 + h*0.6).toFixed(2)}" stroke="${BLAU}" stroke-width="${vorn?2.4:1}"/>
      <text x="${x+8}" y="${y+23}" fill="${STICH.HIMMEL}" font-size="17"
        font-family="var(--didone),Georgia,serif">${esc(k.kurz)}</text>
      <text x="${x}" y="${y+50}" fill="${TINTE}" font-size="11"
        font-family="ui-monospace,monospace" letter-spacing=".5">${Math.round(k.bestand)} · ${Math.round(k.haltung)}</text>
      ${vorn?`<text x="${x}" y="${y-8}" fill="${ROT}" font-size="10"
        font-family="ui-monospace,monospace" letter-spacing=".8">VORN</text>`:''}
    </g>`;
  };

  return `<div class="feld"><svg viewBox="0 0 640 300" width="100%" height="180"
      preserveAspectRatio="xMidYMid slice" role="img" aria-label="Das Bataillon in vier Kompanien">
    <rect width="640" height="300" fill="${STICH.HIMMEL}"/>
    ${Array.from({length:7},(_,i)=>`<path d="M 0 ${40+i*38} H 640" stroke="${TINTE}" stroke-width="0.5" opacity="0.1"/>`).join('')}
    ${/* Der Feind: ein einziger Block, dessen Breite die Feindmoral ist. Kein
         Buchstabe, keine Zahl — man weiß von drüben nichts als die Front. */''}
    <rect x="${(60 + (1-feindTeil)*140).toFixed(0)}" y="70" width="${(520*feindTeil).toFixed(0)}" height="30"
      fill="${ROT}" opacity="0.55" stroke="${ROT}" stroke-width="1.4"/>
    <text x="60" y="58" fill="${ROT}" font-size="11" font-family="ui-monospace,monospace" letter-spacing=".8">DER FEIND</text>
    ${K1.map(kasten).join('')}
    ${K.adlerVorn?`<g><path d="M 320 128 L 320 162" stroke="${TINTE}" stroke-width="2.4"/>
      <path d="M 312 128 L 328 128 L 320 118 Z" fill="${TINTE}"/>
      <text x="334" y="132" fill="${TINTE}" font-size="10" font-family="ui-monospace,monospace" letter-spacing=".8">ADLER VORN</text></g>`:''}
    <text x="60" y="286" fill="${BLAU}" font-size="11" font-family="ui-monospace,monospace" letter-spacing=".8">
      ${S.rang>=11?'DEIN REGIMENT':'DEIN BATAILLON'} · ${K1.length} KOMPANIEN · BESTAND UND HALTUNG</text>
    <text x="620" y="24" fill="${TINTE}" font-size="11" text-anchor="end"
      font-family="ui-monospace,monospace" letter-spacing=".8">${esc((n.datum||'').split(' · ')[0]||'')}</text>
  </svg></div>`;
}

/* ══════════════════ DER VIERTE BRUCH: DIE OPERATIONSKARTE ══════════════════

   **Der Feind ist ab hier eine Vermutung.** Wo bis Rang 11 eine Feindmoral als
   Balken stand, steht jetzt eine Meldung mit Uhrzeit und Verlässlichkeit — und
   sie ist alt. Was du liest, ist vierzig Minuten alt, manches davon ist
   falsch, und du entscheidest trotzdem, und zwar jetzt.

   **Das ist die Umkehrung des Fusiliers und der Punkt des ganzen Spiels:** Der
   General sieht mehr und weiß weniger. Der Fusilier sah vier Männer und Rauch
   — aber was er sah, war wahr.

   Deshalb zeigt die Karte **`gemeldet`, nie `bestand`.** Wer hier den wahren
   Wert einblendet, hat den Rang nicht gebaut, sondern nur eine hübschere
   Anzeige für denselben. */
function karte(n){
  const TINTE = STICH.MESSING, BLAU = STICH.BLAU, ROT = STICH.ROT;
  const V = K.verbaende || [];
  const orte = [[110,120],[250,90],[390,130],[520,100],[300,200]];

  const symbol = (v,i)=>{
    const [x,y] = orte[i % orte.length];
    const g = Math.max(0, Math.min(1, v.gemeldet/100));
    return `<g>
      <rect x="${x-26}" y="${y-11}" width="52" height="22" fill="${BLAU}"
        opacity="${v.schweigt?0.18:(0.3+g*0.5).toFixed(2)}" stroke="${BLAU}"
        stroke-width="1.2" ${v.schweigt?'stroke-dasharray="4 3"':''}/>
      <path d="M ${x-26} ${y-11} L ${x+26} ${y+11} M ${x+26} ${y-11} L ${x-26} ${y+11}"
        stroke="${BLAU}" stroke-width="0.9" opacity="0.7"/>
      <text x="${x}" y="${y+27}" fill="${TINTE}" font-size="10" text-anchor="middle"
        font-family="ui-monospace,monospace" letter-spacing=".4">${esc(v.name)}</text>
      <text x="${x}" y="${y+39}" fill="${v.schweigt?ROT:TINTE}" font-size="10" text-anchor="middle"
        font-family="ui-monospace,monospace">${v.schweigt?'antwortet nicht':Math.round(v.gemeldet)+' · '+(v.alter||0)+' alt'}</text>
      ${v.befehl?`<text x="${x}" y="${y-19}" fill="${ROT}" font-size="9" text-anchor="middle"
        font-family="ui-monospace,monospace" letter-spacing=".6">ORDER UNTERWEGS</text>`:''}
    </g>`;
  };

  const feindTeil = Math.max(0, Math.min(1, K.feindMoral / n.feindMoral));
  const vermutung = feindTeil>0.75 ? 'in voller Stärke' : feindTeil>0.45 ? 'im Weichen'
    : feindTeil>0.15 ? 'stark angeschlagen' : 'aufgelöst';
  const verlaesslich = (K.aufklaerung||0) >= 2 ? 'gut' : (K.aufklaerung||0) >= 1 ? 'mäßig' : 'gering';

  return `<div class="feld"><svg viewBox="0 0 640 300" width="100%" height="180"
      preserveAspectRatio="xMidYMid slice" role="img" aria-label="Operationskarte">
    <rect width="640" height="300" fill="${STICH.HIMMEL}"/>
    ${/* Straßen und ein Fluss — das Einzige auf dieser Karte, das sicher stimmt. */''}
    <path d="M 20 250 Q 180 210 320 235 T 620 200" fill="none" stroke="${TINTE}" stroke-width="1.6" opacity="0.45"/>
    <path d="M 60 40 Q 200 150 340 160 T 600 260" fill="none" stroke="${STICH.WASSER}" stroke-width="4" opacity="0.6"/>
    <path d="M 120 280 L 250 100 L 520 70" fill="none" stroke="${TINTE}" stroke-width="1.2"
      opacity="0.4" stroke-dasharray="7 5"/>
    ${V.map(symbol).join('')}
    <rect x="360" y="238" width="250" height="42" fill="${ROT}" opacity="0.1" stroke="${ROT}"
      stroke-width="1" stroke-dasharray="6 4"/>
    <text x="372" y="256" fill="${ROT}" font-size="11" font-family="ui-monospace,monospace" letter-spacing=".6">GEMELDETE STÄRKE: ${esc(vermutung.toUpperCase())}</text>
    <text x="372" y="272" fill="${TINTE}" font-size="10" font-family="ui-monospace,monospace">Meldung ${40+((K.runde||1)*20)%60} Minuten alt · Verlässlichkeit ${esc(verlaesslich)}</text>
    <text x="20" y="24" fill="${TINTE}" font-size="11" font-family="ui-monospace,monospace" letter-spacing=".8">${S.rang>=13?'DIVISION':'BRIGADE'} · ${esc((n.datum||'').split(' · ')[0]||'')}</text>
  </svg></div>`;
}

function sichtfeld(){
  const n = KAPITEL[LAUF.node], zw = S.zweig;
  /* Der Rang bestimmt, was man überhaupt sieht — vier Bilder, vier Brüche.
     Wenn die Linie bricht, fällt alles davon auf das erste zurück. */
  if(S.rang>=12 && !(K.nahkampf>0)) return karte(n);
  if(S.rang>=10 && !(K.nahkampf>0)) return bataillonsfeld(n);
  /* Der Offizier sieht eine Skizze, nicht ein Feld — außer die Linie bricht. */
  if(S.rang>=7 && !(K.nahkampf>0)) return skizzenfeld(n);
  const rauch = Math.min(1, K.runde/6);
  const feindTeil = Math.max(0, Math.min(1, K.feindMoral / n.feindMoral));
  const eigenTeil = Math.max(0, Math.min(1, (K.eigen==null?100:K.eigen) / 100));
  const karree = n.formation === 'karree';

  const streu = (i,a)=>{ const x = Math.sin(i*127.1 + a*311.7)*43758.5453; return x - Math.floor(x); };
  const gefallene = (anz,steht,a)=> new Set(
    Array.from({length:anz},(_,i)=>i).sort((p,q)=>streu(p,a)-streu(q,a)).slice(0, anz-steht));

  /* Geschlossene Ordnung: Die Glieder stehen um eine halbe Teilung versetzt,
     sodass das hintere Glied die Lücken des vorderen füllt — zusammen ergibt
     das die dichte Wand, die eine Linie ausmacht. */
  const FEIND_JE = 15, EIGEN_JE = 20, PLAENKLER = 5;
  const FEIND = FEIND_JE*2, EIGEN = EIGEN_JE*2;
  const feindWeg = gefallene(FEIND, Math.round(FEIND*feindTeil), 7);
  const eigenWeg = gefallene(EIGEN, Math.round(EIGEN*eigenTeil), 13);

  const ROT = STICH.ROT, ROT_TOT = STICH.ROT_TOT, BLAU = STICH.BLAU, BLAU_TOT = STICH.BLAU_TOT;
  const MESSING = STICH.MESSING;

  const kopfbedeckung = (x,y,b,f,art)=>{
    if(art==='baer') return `<rect x="${(x-4.6*b).toFixed(1)}" y="${(y-15.5*b).toFixed(1)}" width="${(9.2*b).toFixed(1)}" height="${(11*b).toFixed(1)}" rx="${(4.4*b).toFixed(1)}"/>`+
      `<rect x="${(x+2.6*b).toFixed(1)}" y="${(y-19*b).toFixed(1)}" width="${(1.8*b).toFixed(1)}" height="${(5*b).toFixed(1)}" rx="${(0.9*b).toFixed(1)}" fill="${STICH.ROT}"/>`;
    if(art==='kasket') return `<ellipse cx="${x.toFixed(1)}" cy="${(y-8.4*b).toFixed(1)}" rx="${(4.4*b).toFixed(1)}" ry="${(3.4*b).toFixed(1)}"/>`;
    if(art==='turban') return `<ellipse cx="${x.toFixed(1)}" cy="${(y-8.8*b).toFixed(1)}" rx="${(5.4*b).toFixed(1)}" ry="${(4.4*b).toFixed(1)}"/>`;
    // Zweispitz: breit und flach, quer über dem Kopf getragen
    return `<ellipse cx="${x.toFixed(1)}" cy="${(y-8.6*b).toFixed(1)}" rx="${(7.6*b).toFixed(1)}" ry="${(2.9*b).toFixed(1)}"`+
           ` transform="rotate(-7 ${x.toFixed(1)} ${(y-8.6*b).toFixed(1)})"/>`;
  };

  const mann = (x,y,h,f,o,art,gewehr)=>{
    const b = h/26;
    return `<g opacity="${o}" fill="${f}">`+
      (gewehr!==false ? `<rect x="${(x+3.4*b).toFixed(1)}" y="${(y-13*b).toFixed(1)}" width="${(1.5*b).toFixed(1)}" height="${(h+11*b).toFixed(1)}" rx="${(0.7*b).toFixed(1)}" opacity=".4" transform="rotate(-22 ${(x+3.4*b).toFixed(1)} ${y.toFixed(1)})"/>` : '')+
      `<rect x="${(x-4.4*b).toFixed(1)}" y="${y.toFixed(1)}" width="${(8.8*b).toFixed(1)}" height="${h}" rx="${(3*b).toFixed(1)}"/>`+
      `<circle cx="${x.toFixed(1)}" cy="${(y-3.8*b).toFixed(1)}" r="${(3.4*b).toFixed(1)}"/>`+
      kopfbedeckung(x,y,b,f,art)+
      `</g>`;
  };
  const toter = (x,y,f)=>`<rect x="${(x-7).toFixed(1)}" y="${y.toFixed(1)}" width="14" height="2.6" rx="1.3" fill="${f}" opacity=".55"/>`;
  // Mamlukenreiter: Pferdeleib, Reiter darüber, Säbel schräg
  const reiter = (x,y,o)=>`<g fill="${ROT}" opacity="${o}">
    <rect x="${x-13}" y="${y}" width="26" height="9" rx="4"/>
    <rect x="${x-10}" y="${y+8}" width="2.4" height="9"/><rect x="${x+8}" y="${y+8}" width="2.4" height="9"/>
    <rect x="${x+11}" y="${y-5}" width="7" height="6" rx="2.4"/>
    <rect x="${x-3}" y="${y-13}" width="6.4" height="14" rx="2.6"/><circle cx="${x}" cy="${y-16}" r="2.8"/>
    <ellipse cx="${x}" cy="${y-19}" rx="4.6" ry="3.6"/>
    <rect x="${x+3}" y="${y-24}" width="1.6" height="13" rx=".8" transform="rotate(28 ${x+3} ${y-24})" opacity=".7"/></g>`;

  const masse = (y,h,f,o)=>`<rect x="0" y="${(y+h*0.3).toFixed(0)}" width="640" height="${(h*0.7).toFixed(0)}" fill="${f}" opacity="${o}"/>`;

  /* ── Der Feind ── */
  let feind = '';
  if(karree){
    // Mamluken umreiten das Karree: keine Ordnung, Reiter statt Glieder
    for(let i=0;i<7;i++){
      const idx = i, x = 46 + i*88 + (streu(i,3)-0.5)*30, y = 40 + streu(i,11)*26;
      if(i/7 > feindTeil) { feind += toter(x, y+16, ROT_TOT); continue; }
      feind += reiter(x, y, 0.55 + streu(i,19)*0.4);
    }
  } else {
    feind = masse(48, 15, ROT, .08) + masse(56, 15, ROT, .06);
    const feindHut = (n.gelaende==='mauer'||n.gelaende==='wueste') ? 'turban' : 'kasket';
    for(let g=0;g<2;g++) for(let i=0;i<FEIND_JE;i++){
      const idx = g*FEIND_JE+i, schritt = 640/FEIND_JE;
      const x = 14 + i*schritt + g*schritt/2, y = 48 + g*8;
      feind += feindWeg.has(idx) ? toter(x, y+15, ROT_TOT) : mann(x, y, 15, ROT, g ? 0.5 : 0.9, feindHut);
    }
  }

  /* ── Deine Leute ──
     **Der Rang bestimmt, was hell ist.** Ein Füsilier sieht eine Linie; ein
     Caporal sieht seine acht heller als den Rest; ein Sergent steht *hinter*
     dem Glied (dort stand der serre-file), und vor ihm stehen seine zwanzig
     als eigener Block, während die übrige Linie in den Rändern verschwindet.
     Man sieht, was man verantwortet — und man sieht, wie viel davon liegt. */
  const meinX = 320;
  const meinHut = S.zweig==='grenadier' ? 'baer' : 'zwei';
  const fuehrt = S.rang>=5 ? 'sektion' : (S.rang>=3 ? 'korporalschaft' : null);
  const meineBreite = fuehrt==='sektion' ? 5 : (fuehrt==='korporalschaft' ? 2 : 0);   // Plätze je Seite
  const schritt = 640/EIGEN_JE;
  const meinPlatz = Math.round((meinX-8)/schritt);
  const meins = i => meineBreite>0 && Math.abs(i-meinPlatz) <= meineBreite;

  // Anteil der eigenen Sektion, der noch steht (nur ab Rang 5)
  const sektTeil = (fuehrt==='sektion' && K.sektion!=null) ? Math.max(0,Math.min(1,K.sektion/100)) : 1;
  const sektWeg = gefallene(EIGEN_JE, Math.round(EIGEN_JE*sektTeil), 23);

  const meinGlied = fuehrt==='sektion' ? -1 : 1;    // der Sergent steht dahinter
  let eigen = masse(130, 22, BLAU, .07) + masse(146, 26, BLAU, .10);

  if(karree){
    /* Das Karree von innen: vordere Front quer, zwei Flanken schräg nach
       hinten. Du stehst im Inneren — deshalb siehst du deine Leute von hinten. */
    for(let i=0;i<14;i++){
      const x = 60 + i*38, y = 128;
      eigen += eigenWeg.has(i) ? toter(x, y+24, BLAU_TOT) : mann(x, y, 24, BLAU, meins(i)?1:0.55, meinHut);
    }
    for(let i=0;i<4;i++){
      const l = 30 - i*4, r = 610 + i*4, y = 150 + i*12;
      eigen += mann(l, y, 22-i*2, BLAU, .4, meinHut) + mann(r, y, 22-i*2, BLAU, .4, meinHut);
    }
  } else {
    for(let g=0;g<2;g++) for(let i=0;i<EIGEN_JE;i++){
      const idx = g*EIGEN_JE+i;
      const x = 8 + i*schritt + (g?0:schritt/2), y = g ? 146 : 130, h = g ? 26 : 22;
      if(zw!=='voltigeur' && g===meinGlied && Math.abs(x-meinX)<schritt*0.6) continue;   // dein Platz
      const meiner = meins(i);
      // Ab Sergent zählt die Sektion getrennt: deine Leute fallen nach K.sektion
      const gefallen = meiner && fuehrt==='sektion' ? sektWeg.has(i) : eigenWeg.has(idx);
      const deckkraft = meineBreite>0 ? (meiner ? (g?1:0.75) : (g?0.42:0.26)) : (g?1:0.6);
      eigen += gefallen ? toter(x, y+h, BLAU_TOT) : mann(x, y, h, BLAU, deckkraft, meinHut);
    }
  }

  /* Der Wankende: Sinkt die Sektion, tritt einer sichtbar einen halben Schritt
     aus dem Glied — der Knopf „Den Wankenden herausziehen" zeigt dann auf
     etwas, das man sieht. */
  let wankend = '';
  if(fuehrt==='sektion' && sektTeil < 0.7){
    const wx = 8 + (meinPlatz-3)*schritt + schritt/2;
    wankend = mann(wx, 168, 24, STICH.WANKEND, .95, meinHut) +
      `<text x="${wx}" y="196" text-anchor="middle" fill="${STICH.WANKEND}" font-size="8.5"
        font-family="ui-monospace,monospace" letter-spacing=".5">WANKT</text>`;
  }

  // Voltigeure schwärmen aus: wenige, weit auseinander, ohne Ordnung
  let plaenkler = '';
  if(zw==='voltigeur') for(let i=0;i<PLAENKLER;i++){
    const x = 90 + i*(460/(PLAENKLER-1)) + (streu(i,5)-0.5)*48;
    if(Math.abs(x-meinX)<34) continue;
    plaenkler += mann(x, 92 + streu(i,9)*16, 20, BLAU, 0.85, 'zwei');
  }

  /* Der Fanion markiert deinen Abschnitt — ab Caporal die acht, ab Sergent die
     zwanzig. Eine Messinglinie über deinen Leuten, mehr braucht es nicht. */
  let fanion = '';
  if(meineBreite>0 && !karree){
    const l = 8 + (meinPlatz-meineBreite)*schritt, r = 8 + (meinPlatz+meineBreite)*schritt;
    fanion = `<rect x="${l.toFixed(0)}" y="118" width="${(r-l).toFixed(0)}" height="1.4" fill="${MESSING}" opacity=".5"/>
      <rect x="${(meinX-0.8).toFixed(0)}" y="104" width="1.6" height="15" fill="${MESSING}" opacity=".7"/>
      <path d="M${meinX+1} 104 L${meinX+17} 108 L${meinX+1} 112 Z" fill="${MESSING}" opacity=".8"/>
      <text x="${l.toFixed(0)}" y="114" fill="${MESSING}" font-size="8.5" opacity=".75"
        font-family="ui-monospace,monospace" letter-spacing=".6">${S.rang>=6 ? 'DEIN ZUG · '+Math.max(0,Math.round((K.sektion==null?100:K.sektion)*0.6))+' VON 60'
        : fuehrt==='sektion'
          ? 'DEINE SEKTION · '+Math.max(0,Math.round((K.sektion==null?100:K.sektion)/5))+' VON 20'
          : 'DEINE KORPORALSCHAFT'}</text>`;
  }

  // Du, dort wo du hingehörst
  let meinY = zw==='voltigeur' ? 100 : (fuehrt==='sektion' ? 172 : 146);
  let meinH = zw==='voltigeur' ? 20 : (fuehrt==='sektion' ? 25 : 26);
  if(karree){ meinY = 160; meinH = 25; }
  if(K.vorn){ meinY = 86; meinH = 18; }             // mit dem Bajonett vorgegangen
  if(K.deckung){ meinY += meinH-10; meinH = 10; }   // kniend oder liegend

  /* Mündungsblitze nach einer Salve — zustandsgesteuert über die letzte
     Aktion, nicht gewürfelt (siehe die Regel unten). */
  let blitze = '';
  if(K.blitz){
    const von = fuehrt ? meinPlatz-meineBreite : 0, bis = fuehrt ? meinPlatz+meineBreite : EIGEN_JE-1;
    for(let i=Math.max(0,von); i<=Math.min(EIGEN_JE-1,bis); i++){
      const x = 8 + i*schritt, y = 132;
      blitze += `<ellipse cx="${x.toFixed(0)}" cy="${y}" rx="7" ry="3.4" fill="${STICH.BLITZ}" opacity=".55"/>
                 <ellipse cx="${x.toFixed(0)}" cy="${y}" rx="15" ry="6" fill="${STICH.BLITZ_HOF}" opacity=".18"/>`;
    }
  }

  /* Pulverdampf steht zwischen den Linien und wird mit jeder Runde dichter —
     feste Plätze, nur die Zahl wächst. */
  let qualm = '';
  for(let i=0;i<Math.round(3+9*rauch);i++){
    const x = 40 + streu(i,17)*560, y = 86 + streu(i,23)*32;
    const r = 16 + streu(i,29)*28;
    qualm += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${r.toFixed(0)}" ry="${(r*0.42).toFixed(0)}"`+
             ` fill="${STICH.DAMPF}" opacity="${(0.10+0.12*streu(i,31)).toFixed(2)}"/>`;
  }
  // Ab Runde 5 legt sich der Dampf über das hintere Feindglied — die
  // Unsicherheit, von der die Texte reden, wird sichtbar.
  const schleier = K.runde>=5
    ? `<rect x="0" y="40" width="640" height="34" fill="${STICH.DAMPF_BAND}" opacity="${Math.min(0.5,(K.runde-4)*0.12).toFixed(2)}"/>` : '';

  const uebergewicht = eigenTeil + feindTeil > 0 ? eigenTeil/(eigenTeil+feindTeil) : 0.5;
  const lage = K.deckung
    ? (zw==='voltigeur'?'Du liegst. Über dir geht es hinweg.':'Du kniest. Über dir geht es hinweg.')
    : (K.vorn ? 'Du bist zehn Schritt vor der Linie.'
      : (fuehrt==='sektion' ? 'Du stehst hinter dem Glied. Von hier siehst du, wer fehlt.'
        : (karree ? 'Vier Fronten, kein Rücken. Innen ist es eng.'
          : 'Rauch. Du siehst keine dreißig Schritt weit.')));

  return `<svg viewBox="0 0 640 200" role="img"
    aria-label="Aufstellung: ${Math.round(EIGEN*eigenTeil)} eigene Männer gegen ${Math.round(FEIND*feindTeil)} feindliche">
    <defs>
      <linearGradient id="sm" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${STICH.DAMPF_RAND}" stop-opacity="0"/>
        <stop offset="45%" stop-color="${STICH.DAMPF_BAND}" stop-opacity="${(0.35+0.4*rauch).toFixed(2)}"/>
        <stop offset="100%" stop-color="${STICH.DAMPF_RAND}" stop-opacity="0"/></linearGradient>
      <radialGradient id="vg" cx="50%" cy="88%" r="62%">
        <stop offset="0%" stop-color="${STICH.DUNKEL}" stop-opacity="0"/>
        <stop offset="100%" stop-color="${STICH.DUNKEL}" stop-opacity=".7"/></radialGradient>
    </defs>
    <rect width="640" height="200" fill="${STICH.HIMMEL}"/>
    ${gelaendeBild(n.gelaende)}
    <rect x="0" y="84" width="640" height="1" fill="${STICH.HORIZONT}"/>
    ${feind}${schleier}
    <rect x="0" y="66" width="640" height="74" fill="url(#sm)"/>
    ${qualm}
    <text x="320" y="26" text-anchor="middle" fill="${STICH.BESCHRIFT}" font-family="Georgia,serif" font-size="11.5"
      font-style="italic">${lage}</text>
    ${plaenkler}${fanion}${eigen}${wankend}${blitze}
    ${mann(meinX, meinY, meinH, MESSING, 1, meinHut, !K.deckung)}
    <text x="${meinX}" y="${meinY < 130 ? (meinY-13).toFixed(0) : (meinY+meinH+11).toFixed(0)}"
      text-anchor="middle" fill="${MESSING}" font-size="9.5"
      font-family="ui-monospace,monospace" letter-spacing="1">DU</text>
    <rect x="0" y="192" width="640" height="4" fill="${ROT_TOT}"/>
    <rect x="0" y="192" width="${(640*uebergewicht).toFixed(0)}" height="4" fill="${STICH.BLAU_WAAGE}"/>
    <rect x="319" y="189" width="2" height="10" fill="${STICH.WAAGE}"/>
    <rect width="640" height="200" fill="url(#vg)"/></svg>`;
}

/* ══════════════════ EREIGNISSE IM GEFECHT ══════════════════

   Die Rundenaktionen sind Handwerk: laden, feuern, knien. Sie stellen keine
   Frage, sie kosten nur Zeit. Ereignisse stellen die Frage, um die es in einem
   Gefecht wirklich geht — **wie weit gehst du**. Jedes hat einen Weg, der
   nichts kostet und nichts bringt, und einen, der Ruf, Nennungen und ein
   kürzeres Gefecht bringt und dich umbringen kann.

   Das ist der Ersatz für das Drehen an Schadenszahlen. Ein kundiger Spieler war
   bis dahin nicht zu töten (40 von 40 Läufen überlebten beide Feldzüge), weil
   optimales Spiel keine Frage mehr offenließ: Salve befehlen, knien, wenn es
   eng wird, fertig. Die Härte darf nicht daher kommen, dass die Kugeln mehr
   wehtun, sondern daher, dass der Weg nach oben durch Stellen führt, an denen
   man auch bleiben kann. Wer nie vortritt, überlebt eher — und verzichtet auf
   Ruf, Nennungen und die Abkürzungen, die ein Gefecht früh entscheiden. (Den
   Caporal gibt Mut allein nicht: Dort ist die Gunst der Engpass, und die holt
   man am Feuer. Mut kauft die Wertung, nicht den Rang.)

   Aufbau wie eine Szene: `probe`, `erfolg`, `misserfolg`. Zusätzlich kennen die
   Wirkungen hier `moral` (Widerstand des Feindes), `leben`, `eigen` (die eigene
   Linie), `gefahr` (für den Rest des Gefechts) und `ende:'sieg'`.

   `wenn(n)` entscheidet, ob ein Ereignis zur Lage passt — die Verfolgung gibt
   es nur, wenn der Feind schon wankt, den Sturm nur, wenn er noch steht. */

/* ══════════════════ WIE DER FEIND DASTEHT ══════════════════

   Drei Fassungen derselben Zeile, und der Unterschied zwischen ihnen ist das
   ganze Spiel:

     bis Rang 11   eine Zahl. Was du siehst, ist wahr.
     `sturm:true`  eine Schätzung. Du siehst, aber du siehst nicht genug.
     ab Rang 12    eine Meldung. Du siehst gar nichts, du bekommst gesagt.

   **Der Sturm von Eylau ist der Vorgeschmack auf den vierten Bruch**, zehn
   Ränge bevor er zum System wird — und er kommt von außen statt von oben.
   Ein Fusilier in einem Schneetreiben, in dem beide Armeen einander verlieren,
   hat dasselbe Problem wie ein General mit einer Meldung von vor vierzig
   Minuten: **Er muss entscheiden, ohne zu wissen.** Dass es sich zwölf Jahre
   später wiederholt, mit demselben Wortlaut in der Zeile, ist die Absicht.

   Der Balken fällt bei Sturm mit weg. Ein Balken *ist* eine Zahl. */
function schaetzung(ist, max){
  const a = Math.max(0, ist) / Math.max(1, max);
  return a > 0.85 ? 'STEHT, WIE ER STAND'
       : a > 0.65 ? 'NICHT ERSCHÜTTERT, SOWEIT MAN SIEHT'
       : a > 0.45 ? 'VIELLEICHT DIE HÄLFTE'
       : a > 0.25 ? 'ER GIBT NACH, GLAUBT MAN'
       : a > 0.08 ? 'KAUM NOCH ETWAS'
                  : 'NICHTS MEHR, SOWEIT MAN SIEHT';
}
function feindAnzeige(n){
  if(S.rang >= 12) return '· DER FEIND: SIEHE MELDUNG';
  if(n && n.sturm) return '· DER FEIND: ' + schaetzung(K.feindMoral, n.feindMoral);
  return '· WIDERSTAND DES FEINDES ' + Math.max(0, Math.round(K.feindMoral));
}

const GEFECHTS_EREIGNISSE = [

  /* ── Sondermission Jena: die Geschütze im Nebel ──
     Die eigene Regel von Kapitel 5 lautet, dass dieser Krieg mit den Beinen
     gewonnen wird. Also ist auch die Sondermission des Höhepunktgefechts
     **keine Waffentat**: Man zieht Geschütze an Seilen durch einen Hohlweg, in
     dem zwei Männer nebeneinander nicht vorbeikommen, im Dunkeln, bergauf.

     Zwei Stufen statt drei — Konstitution und Drill —, und beide sind
     Arbeitsproben. Es ist die einzige Kette im Spiel, in der niemand auf
     einen schießt und in der man trotzdem sterben kann: Ein Achtpfünder, der
     an einer engen Stelle zurückrutscht, fragt nicht, wer dahintersteht. */
  {id:'geschuetze', nur:'jena', frage:'Die Geschütze stehen im Hohlweg',
   wenn:(n)=> K.runde <= 4 && K.feindMoral > n.feindMoral*0.5,
   text:['Der Nebel steht so dicht, dass die Bataillone einander an den Trommeln finden müssten, und die Trommeln sind verboten. Aus dem Hohlweg hinter euch kommt kein Ton, der dorthin gehört — kein Rollen, kein Kommando, nichts.',
         'Ein Artillerieoffizier kommt zu Fuß nach vorn und sucht Leute. Sechs Geschütze stecken auf halber Höhe fest, die Bespannung kommt nicht durch, und ohne sie steht die Division in einer Ebene, deren Breite niemand kennt.'],
   optionen:[
     {label:'Mit an die Seile', hint:'Zwei Stufen · im Dunkeln, bergauf, an nassem Hanf', risk:true,
      kette:[
        {name:'Der Hohlweg', wert:'konstitution', schw:40, schaden:14,
         gut:'Zwanzig Mann an einem Seil, einer zählt, und bei jedem dritten Zug rollt der Achtpfünder eine Handbreit weiter. Der Karren schleift links und rechts an der Wand, und was an Farbe daran war, ist nach hundert Metern nicht mehr daran.',
         schlecht:'An der engsten Stelle rutscht es zurück, und der Mann hinter dir bekommt die Deichsel gegen die Brust. Man zieht weiter, weil hinter euch fünf weitere stehen und der Weg nur in eine Richtung geht.'},
        {name:'Die Kuppe', wert:'drill', schw:45, schaden:15,
         gut:'Oben wird abgeprotzt, ausgerichtet und geladen, in einer Ordnung, die im Dunkeln nur geht, wenn die Handgriffe von allein gehen. Als es hell wird, stehen sechs Geschütze da, wo drüben niemand mit welchen rechnet.',
         schlecht:'Oben wird es hell, bevor die Geschütze stehen, und in den ersten zwanzig Minuten steht ihr im Freien und richtet aus, während drüben jemand die Entfernung schätzt und dann nicht mehr schätzt.'}],
      tod:'Im Hohlweg unterhalb des Landgrafenbergs, unter einem Achtpfünder, der in der Dunkelheit zurückgerutscht ist. Der Bericht wird das Geschütz erwähnen.',
      todesart:'Erdrückt im Hohlweg von Jena',
      erfolg:{text:'Um zehn reißt der Nebel auf, und die sechs Geschütze stehen richtig. Was sie zwei Stunden lang in eine Linie hineinschießen, die in vollkommener Ordnung stehen bleibt und wartet, wird später in keinem Bericht als Handwerk beschrieben, sondern als Sieg. Der Artillerieoffizier lässt sich die Namen der Mannschaft geben.',
              moral:-26, ruf:7, nennung:true, atem:-20, belastung:8,
              tat:'Die Geschütze auf den Landgrafenberg gebracht'},
      misserfolg:{text:'Die Geschütze stehen, und sie stehen zu spät. Zwei Stunden lang war die Ebene offen, und was in diesen zwei Stunden vor dem Dorf gelegen hat, hat dort ohne Artillerie gelegen. Hinaufgebracht habt ihr sie trotzdem.',
              moral:-10, ruf:3, atem:-20, belastung:12,
              tat:'An den Seilen im Hohlweg gezogen'}},
     {label:'In der Linie bleiben', hint:'Dafür ist die Artillerie da, und du bist es nicht',
      erfolg:{text:'Du bleibst, wo du stehst, und schießt in eine Richtung, in der etwas sein könnte. Zwei Stunden später kommen die Geschütze doch noch die Höhe herauf, gezogen von anderen. Es ändert für dich nichts, außer dass deine Schultern es nicht waren.',
              moral:-6}}
   ]},

  /* ── Sondermission Austerlitz: der Pratzeberg ──
     Der Moment, für den die Schlacht berühmt ist, aus der Höhe eines Mannes im
     ersten Treffen: Man geht im Nebel bergauf gegen eine Höhe, von der man
     nicht weiß, wie stark sie besetzt ist, und über einem reißt es auf.

     Drei Stufen, wie Akkon und Lodi — und wie dort kostet jeder Fehlschlag
     sofort Blut. Die letzte Stufe ist nicht der Aufstieg, sondern das
     **Halten**: Der Berg wird zweimal genommen, und beim zweiten Mal kommt die
     russische Garde. */
  {id:'pratzen', nur:'austerlitz', frage:'Der Nebel reißt',
   wenn:(n)=> K.runde <= 4 && K.feindMoral > n.feindMoral*0.45,
   text:['Vor euch steigt der Hang an, und im Nebel sieht man dreißig Schritt weit. Irgendwo darüber steht der Pratzeberg, und niemand weiß, was oben noch steht, seit sie heruntergegangen sind.',
         'Der Divisionsgeneral lässt aufschließen und sagt einen Satz, der die Runde macht: Ein scharfer Schlag, und der Krieg ist zu Ende. Dann geht die Kolonne an, ohne einen Schuss abzugeben, das Gewehr geschultert, weil Schießen im Nebel nur zeigt, wo man ist.'],
   optionen:[
     {label:'Mit hinauf, ohne zu schießen', hint:'Drei Stufen · der Hang, die Höhe, der Gegenstoß', risk:true,
      kette:[
        {name:'Der Hang', wert:'konstitution', schw:40, schaden:13,
         gut:'Gefrorener Acker, zweihundert Meter Steigung, und über euch wird es hell, während unten der Nebel steht. Auf halber Höhe geht der erste Zug hinein, und ihr geht durch, ohne zu halten.',
         schlecht:'Auf halber Höhe kommt Kartätschfeuer aus einer Richtung, in der nichts stehen sollte. Die Reihe vor dir bricht ein, und du gehst über Männer, die du am Morgen noch beim Namen gerufen hast.'},
        {name:'Die Höhe', wert:'bajonett', schw:45, schaden:15,
         gut:'Oben stehen zwei österreichische Bataillone, die nicht damit gerechnet haben, dass jemand aus dem Nebel kommt. Es dauert vier Minuten, und dann gehört euch der Berg.',
         schlecht:'Oben steht mehr, als unten jemand gedacht hat. Es wird eine Sache auf zehn Schritt, und wer dabei stehen bleibt, hat Glück gehabt und sonst nichts.'},
        {name:'Der Gegenstoß', wert:'kaltbluetigkeit', schw:45, schaden:16,
         gut:'Gegen elf kommt die russische Garde den Berg herauf, in geschlossener Ordnung und ohne zu schießen, so wie ihr vor zwei Stunden. Ihr steht, wo ihr steht, und lasst sie auf sechzig Schritt herankommen, und dann fällt das Kommando.',
         schlecht:'Die Garde kommt herauf, und die Linie links von euch weicht. Für zehn Minuten ist der Berg wieder offen, und du bist einer von denen, die in dieser Zeit nicht weglaufen, ohne genau zu wissen, warum.'}],
      tod:'Auf dem gefrorenen Acker des Pratzebergs, dreißig Schritt unterhalb der Kuppe, in einem Nebel, der sich eine Stunde später auflöst.',
      todesart:'Gefallen auf dem Pratzeberg',
      erfolg:{text:'Um Mittag steht ihr oben und schießt nach beiden Seiten den Hang hinunter. Von hier sieht man, was der Plan war: eine Armee, in zwei Hälften geteilt, die einander nicht mehr erreichen. Der Divisionsgeneral reitet die Linie ab und lässt sich die Namen der Kompanien geben, die zuerst oben waren.',
              moral:-30, ruf:8, nennung:true, atem:-22, belastung:8,
              tat:'Auf dem Pratzeberg gestanden'},
      misserfolg:{text:'Der Berg wird genommen, und ihr seid dabei gewesen. Was von deinem Zug oben ankommt, ist die Hälfte, und die steht nicht mehr besonders gerade. Es zählt trotzdem: Oben war, wer oben war.',
              moral:-14, ruf:3, atem:-22, belastung:12,
              tat:'Den Pratzeberg mit hinaufgegangen'}},
     {label:'In der zweiten Welle nachrücken', hint:'Es geht auch ohne dich in der ersten Reihe',
      erfolg:{text:'Du gehst mit dem zweiten Treffen, zweihundert Schritt hinter der Spitze. Als ihr oben ankommt, ist es entschieden, und man muss nur noch stehen, wo man hingestellt wird. Das ist keine Schande und wird auch nicht als eine behandelt.',
              moral:-8, atem:-10}}
   ]},


  {id:'freiwillige', frage:'Der Adjutant sucht acht Mann',
   wenn:(n)=> K.runde<=4 && K.feindMoral > n.feindMoral*0.5,
   text:['Ein Adjutant kommt von rechts durch den Rauch, zu Fuß, ohne Hut. Auf dem Hügel drüben stehen zwei Geschütze, die eure Linie der Länge nach bestreichen, und solange sie stehen, geht hier niemand vor.',
         'Er sagt, er braucht acht Mann. Er sagt nicht, wofür, aber alle wissen es. Neben dir sieht keiner auf.'],
   optionen:[
     {label:'Vortreten', hint:'Die Geschütze vernageln · Bajonett', risk:true,
      probe:{wert:'bajonett', schw:45},
      erfolg:{text:'Ihr geht seitlich den Hang hinauf, durch einen Graben, in dem Wasser steht. Es dauert acht Minuten und ist dann in vierzig Sekunden vorbei. Zwei von euch kommen nicht zurück, und der Adjutant schreibt sich Namen auf.',
              moral:-22, ruf:5, nennung:true, leben:-8, atem:-18, belastung:6,
              tat:'Sich freiwillig zu den Geschützen gemeldet'},
      misserfolg:{text:'Ihr kommt bis auf dreißig Schritt. Dann drehen sie das rechte Geschütz, und es ist mit Kartätschen geladen. Du liegst hinterher im Graben und weißt nicht, wie lange. Die Geschütze stehen noch.',
              leben:-30, atem:-25, belastung:12}},
     {label:'Stehenbleiben', hint:'Es meldet sich schon jemand',
      erfolg:{text:'Du siehst geradeaus. Acht andere treten vor, darunter zwei aus deiner Korporalschaft. Der Adjutant zählt sie ab und geht. Niemand sagt etwas zu dir, weder jetzt noch später.'}}]},

  {id:'linie', frage:'Die Linie wankt',
   wenn:(n)=> K.eigen < 72 && K.feindMoral > n.feindMoral*0.3,
   text:['Rechts von dir geht ein Glied nach hinten. Nicht gelaufen, nur zwei Schritte, aber zwei Schritte sind der Anfang. Ein Sergent brüllt etwas, das im Lärm nicht ankommt.',
         'Wenn die Linie hier aufgeht, schießt sie von der Seite hinein, und dann ist es kein Gefecht mehr, sondern ein Auflauf.'],
   optionen:[
     {label:'Stehen bleiben und es die anderen sehen lassen', hint:'Kaltblütigkeit', risk:true,
      probe:{wert:'kaltbluetigkeit', schw:40},
      erfolg:{text:'Du bleibst, wo du stehst, und lädst weiter, als wäre nichts. Der Mann links von dir bleibt auch. Dann der nächste. In zwanzig Sekunden steht die Linie wieder da, wo sie stand.',
              moral:-8, ruf:3, eigen:6, tat:'Die Linie gehalten, als sie wankte'},
      misserfolg:{text:'Du bleibst stehen, und du bleibst allein stehen. Zwanzig Schritt vor der Linie, die inzwischen hinter dir ist. Es dauert lange, bis du das merkst, und länger, bis du zurück bist.',
              leben:-22, atem:-15, belastung:10, gefahr:6}},
     {label:'Zwei Schritte mit zurück', hint:'Alle tun es',
      erfolg:{text:'Du gehst mit. Es sind wirklich nur zwei Schritte, und danach steht ihr wieder. Aber ihr steht zehn Schritt weiter hinten als vorher, und drüben haben sie es gesehen.',
              moral:6, ruf:-1, gefahr:-4}}]},

  {id:'sturm', frage:'Sie kommen',
   wenn:(n)=> K.runde>=3 && K.feindMoral > n.feindMoral*0.4,
   text:['Drüben hört das Feuer auf, und das ist schlimmer als das Feuer. Dann kommen sie: zwei Glieder im Laufschritt, das Bajonett vorn, und sie schreien dabei, weil man ohne Schreien nicht auf eine Linie zulaufen kann.',
         'Vierzig Schritt. Für einen Schuss reicht es noch, für zwei nicht.'],
   optionen:[
     {label:'Stehen und sie auf zwanzig Schritt herankommen lassen', hint:'Kaltblütigkeit · dann schießt es sich nicht mehr daneben', risk:true,
      probe:{wert:'kaltbluetigkeit', schw:45},
      erfolg:{text:'Du hältst die Muskete unten und zählst mit. Auf zwanzig Schritt geht die Salve los, und was danach noch steht, dreht um. So nah trifft jeder, auch die, die sonst nichts treffen.',
              moral:-26, ruf:4, tat:'Auf zwanzig Schritt stehen geblieben'},
      misserfolg:{text:'Die Nerven halten bis dreißig Schritt. Dann geht die Salve zu früh und zu hoch los, und sie sind trotzdem da. Was danach kommt, sind Kolben und Bajonette, und es dauert vier Minuten.',
              leben:-28, atem:-22, belastung:12}},
     {label:'Bajonett fällen und ihnen entgegen', hint:'Bajonett · zwei Linien, die aufeinander zulaufen', risk:true,
      probe:{wert:'bajonett', schw:40},
      erfolg:{text:'Ihr geht ihnen entgegen, und das erwarten sie nicht. Auf halbem Weg treffen sich die Linien, und die ihre bleibt stehen, bevor sie euch erreicht. Danach ist der Boden dazwischen belegt.',
              moral:-30, ruf:4, leben:-10, atem:-20, vorn:true,
              tat:'Dem Sturm entgegengegangen'},
      misserfolg:{text:'Du gehst vor, und die Linie geht nicht mit. Was dann passiert, siehst du hinterher an deinem Ärmel und an dem, was von deinem Tornistergurt übrig ist.',
              leben:-34, atem:-25, belastung:14}},
     {label:'Ins zweite Glied und laden', hint:'Andere stehen vorn',
      erfolg:{text:'Du gehst ein Glied zurück und lädst. Vor dir steht jemand, der jetzt das abbekommt, was sonst dich träfe. Die Linie hält auch ohne dich, gerade so.',
              moral:-6, ruf:-1, gefahr:-6}}]},

  {id:'fahne', frage:'Der Fahnenträger fällt',
   wenn:(n)=> K.eigen < 85 && K.feindMoral > n.feindMoral*0.25,
   text:['Der Träger geht nach vorn weg, ohne Zwischenschritt, wie ein Sack. Die Fahnenstange kippt und bleibt schräg im Dreck stehen, sechs Schritt vor der Linie, wo niemand steht.',
         'Eine Fahne, die die anderen mitnehmen, ist das Ende einer Halbbrigade. Alle sehen hin, und keiner geht.'],
   optionen:[
     {label:'Ihn holen', hint:'Kaltblütigkeit · sechs Schritt ins Freie', risk:true,
      probe:{wert:'kaltbluetigkeit', schw:50},
      erfolg:{text:'Sechs Schritte hin, der Schaft ist warm und klebrig, sechs Schritte zurück. Es geht schneller, als du dachtest. Die Linie brüllt, als du wieder drin stehst, und brüllt weiter, als es längst nichts mehr zu brüllen gibt.',
              moral:-14, ruf:6, nennung:true, eigen:8, leben:-6, atem:-12, gefahr:5,
              tat:'Die Fahne aus dem Dreck geholt'},
      misserfolg:{text:'Du kommst bis auf zwei Schritte heran. Was dich trifft, wirft dich über den Schaft, und du liegst mit dem Gesicht in derselben Pfütze wie der Träger. Jemand zieht dich am Kragen zurück; die Fahne holt ein anderer.',
              leben:-30, atem:-20, belastung:12}},
     {label:'Weiterladen', hint:'Es ist ein Stück Tuch an einem Stock',
      erfolg:{text:'Du lädst. Nach einer halben Minute geht ein Sergent hin und holt ihn, und über den Sergent wird abends geredet. Über dich nicht.'}}]},

  {id:'verwundeter', frage:'Jemand ruft',
   wenn:(n)=> K.eigen < 88,
   text:['Vier Schritt vor der Linie liegt einer und ruft. Nicht laut — er hat keine Luft für laut. Es ist Guérin, oder es ist jemand, der so aussieht wie Guérin, und beides ist im Rauch dasselbe.',
         'Er wird dort liegen bleiben, bis das Gefecht vorbei ist. Danach räumen sie das Feld ab, aber danach ist ein langes Wort.'],
   optionen:[
     {label:'Ihn hereinziehen', hint:'Konstitution · du hast beide Hände voll und keine an der Muskete', risk:true,
      probe:{wert:'konstitution', schw:40},
      erfolg:{text:'Du packst ihn an den Achselriemen und ziehst rückwärts, und er ist schwerer als ein Mann sein sollte. Hinter der Linie lässt du ihn los und deine Arme zittern. Er lebt noch am Abend, und er weiß, wer ihn geholt hat.',
              ruf:2, kameradschaft:12, gunst:1, atem:-16, leben:-4,
              tat:'Einen Verwundeten aus dem Feuer geholt'},
      misserfolg:{text:'Du kommst hin und bekommst ihn hoch, und dann trifft es einen von euch beiden. Du kriechst zurück, allein, und hörst hinter dir, wie das Rufen aufhört.',
              leben:-24, atem:-20, belastung:14, kameradschaft:-4}},
     {label:'Weiterschießen', hint:'Dafür ist nach dem Gefecht Zeit',
      erfolg:{text:'Du legst an und feuerst über ihn hinweg. Das Rufen hört irgendwann von allein auf, und du weißt nicht, woran es liegt. Das Spiel sagt es dir auch nicht.'}}]},

  {id:'verfolgung', frage:'Sie gehen',
   wenn:(n)=> K.feindMoral > 0 && K.feindMoral < n.feindMoral*0.32,
   text:['Es kippt nicht, es reißt. Erst gehen zwanzig, dann geht alles, und was eben noch eine Linie war, ist ein Feld voller Rücken.',
         'Ein Bataillon, das man laufen lässt, steht morgen wieder da. Aber wer nachsetzt, hat keine Linie mehr um sich, und drüben stehen noch Reserven, die niemand gesehen hat.'],
   optionen:[
     {label:'Nachsetzen', hint:'Konstitution · das Gefecht sofort entscheiden', risk:true,
      probe:{wert:'konstitution', schw:45},
      erfolg:{text:'Ihr geht hinterher, so schnell es mit sechzig Pfund geht, und nehmt zweihundert Mann und vier Karren. Danach steht ihr keuchend auf einem Acker, und drüben ist niemand mehr, der etwas dagegen hätte.',
              ende:'sieg', ruf:5, nennung:true, atem:-28, belastung:6,
              tat:'Nachgesetzt, bis nichts mehr stand'},
      misserfolg:{text:'Zweihundert Schritt weit geht es gut. Dann kommt aus dem Wäldchen rechts eine Schwadron, die dort die ganze Zeit gestanden hat, und ihr steht ohne Linie und ohne Ordnung im Freien. Der Rückweg kostet mehr als der Hinweg.',
              leben:-30, atem:-30, belastung:14, eigen:-14}},
     {label:'Stehenbleiben und die Ordnung halten', hint:'Sie sind weg, das reicht',
      erfolg:{text:'Der Sergent lässt halten und richten. Drüben verschwinden sie hinter der Kuppe, und ihr steht in Reih und Glied auf einem Feld, auf dem sonst nichts mehr steht.',
              moral:-10}}]}
];

/* ── Sondermissionen ──
   Vier Gefechte haben ein Ereignis, das es nur dort gibt (`nur:` trägt die
   Stations-ID). Es ist der Moment, für den das Gefecht berühmt ist, aus der
   Höhe eines Mannes im zweiten Glied gesehen: die Brücke von Lodi, der General
   im Sumpf von Arcole, der Riss im Karree von Embabeh, die Sturmkolonne von
   Akkon. Beim Würfeln haben sie Vorrang und eine höhere Chance (60 % je Runde
   statt 45 %) — eine Sondermission, die fast nie stattfindet, wäre keine.
   Historische Fixpunkte bleiben fix (Invariante 8): Auch wer die Bresche von
   Akkon überlebt, nimmt Akkon nicht ein. */

GEFECHTS_EREIGNISSE.push(
  {id:'lodi_bruecke', nur:'lodi', frage:'Die Brücke',
   wenn:(n)=> K.feindMoral > n.feindMoral*0.35,
   text:['Die Kolonne steht auf der Brücke und kommt nicht vor. Zweihundert Schritt Holz, drüben vierzehn Geschütze, und die schießen die Länge der Brücke aus, nicht die Breite. Vorn fallen Grenadiere, und die dahinter treten auf sie, weil es keinen anderen Platz für die Füße gibt.',
         'Am Brückenkopf steigen Offiziere von den Pferden und stellen sich an die Spitze, als wäre das ihr Platz. Einer davon ist klein und wird nach heute einen Beinamen haben. Es heißt, fünfzig Schritt flussab sei eine Furt.'],
   optionen:[
     {label:'Mit in die Spitze der Kolonne drängen', hint:'Wo die Offiziere stehen', risk:true,
      kette:[
        {name:'Der Lauf', wert:'kaltbluetigkeit', schw:45, schaden:14,
         gut:'Die Kolonne läuft an, und du läufst in der zweiten Reihe, wo man nicht denken muss, nur Schritt halten. Das Holz unter den Füßen zittert von den Einschlägen.',
         schlecht:'Auf der Brückenmitte fegt es die Reihe vor dir weg, und du gehst über Männer, die noch warm sind. Etwas wirft dich gegen das Geländer und nimmt ein Stück von dir mit.'},
        {name:'Der Brückenkopf', wert:'bajonett', schw:40, schaden:14,
         gut:'Drüben stehen die Kanoniere mit Wischern und Handspaken gegen Bajonette. Es ist kurz und hässlich, und dann gehören die Geschütze euch.',
         schlecht:'Am Brückenkopf steht noch eine Reihe, und ihr Feuer geht auf zehn Schritt in euch hinein.'}],
      tod:'Du bleibst auf den Balken liegen, das Gesicht zur Adda. Die Kolonne geht über dich hinweg, weil die Brücke schmal ist und der Sieg drüben liegt.',
      todesart:'Gefallen auf der Brücke von Lodi',
      erfolg:{text:'Drüben stehst du zwischen den erbeuteten Geschützen und hörst dein eigenes Blut in den Ohren. Hinter dir kommt die ganze Armee über die Brücke, und der kleine General sieht sich die Männer der Spitze einzeln an.',
              moral:-24, ruf:6, nennung:true, atem:-20, belastung:6,
              tat:'In der Spitze über die Brücke von Lodi'},
      misserfolg:{text:'Drüben bist du trotzdem — als einer von denen, die getragen wurden. Gesehen hat man dich in der Spitze, und das zählt; was es gekostet hat, trägst du selbst.',
              ruf:2, atem:-22, belastung:12,
              tat:'Mit der Spitze auf die Brücke von Lodi'}},
     {label:'Durch die Furt unterhalb der Brücke', hint:'Bis zur Brust in der Adda', risk:true,
      probe:{wert:'geschick', schw:40},
      erfolg:{text:'Zu zwanzig steigt ihr in den Fluss, die Patronentasche über dem Kopf. Die Adda zieht an den Beinen, aber sie trägt euch nicht weg, und ihr kommt schräg unter dem Ufer heraus, wo die Geschütze nicht hinsehen. Von der Flanke her ist eine Batterie nur eine Reihe Männer mit Wischern.',
              moral:-16, ruf:3, atem:-16,
              tat:'Durch die Furt in die Flanke der Batterie'},
      misserfolg:{text:'Die Adda ist schneller, als sie aussieht. Sie nimmt dir die Beine weg, und du gehst zweimal unter, bis dich einer am Riemen packt und ans Ufer zerrt — ans eigene. Deine Patronen sind nass, und du hustest Flusswasser, bis das Gefecht vorbei ist.',
              leben:-20, atem:-30, belastung:10}},
     {label:'In der Kolonne bleiben und warten', hint:'Irgendwann geht es vor',
      erfolg:{text:'Du stehst im vierten Glied auf der Brücke und wartest, dass die vor dir gehen. Irgendwann gehen sie. Als du drüben ankommst, ist die Batterie schon genommen — von der Kavallerie, die durch die Furt geritten ist, sagt man später.',
              moral:-6}}]},

  {id:'arcole_sumpf', nur:'arcole', frage:'Der General im Sumpf',
   wenn:()=> K.runde >= 3,
   text:['Auf dem Damm drängt ein Stab nach vorn, mitten ins Feuer, eine Fahne in der Hand — als ließe sich die Kolonne an einem Stück Tuch vorwärtsziehen. Dann flutet die Kolonne zurück, drückt den Stab an den Dammrand, und der kleine General liegt im Sumpf, bis zur Brust im braunen Wasser.',
         'Die Kroaten sind sechzig Schritt entfernt und laden. Zwei Adjutanten springen hinterher. Es reicht nicht.'],
   optionen:[
     {label:'Hinunter und mit anfassen', hint:'Der Sumpf will euch beide', risk:true,
      kette:[
        {name:'Hinunter', wert:'konstitution', schw:45, schaden:12,
         gut:'Du springst vom Damm und stehst bis zu den Hüften im Schlamm, der nicht loslässt, aber trägt. Zwei Schritte, dann hast du seinen Arm.',
         schlecht:'Der Sumpf nimmt dich sofort bis zur Brust, und die erste Minute geht dafür drauf, nicht selbst zu versinken.'},
        {name:'Heraus, unter Feuer', wert:'kaltbluetigkeit', schw:40, schaden:14,
         gut:'Zu dritt zerrt ihr ihn heraus, Zug um Zug, während es flach über das Wasser wegschlägt. Oben sitzt er einen Atemzug lang im Dreck, dann ist er wieder General.',
         schlecht:'Die Kroaten haben euch im Wasser, und Wasser ist keine Deckung. Neben dir hört ein Adjutant auf zu ziehen.'}],
      tod:'Der Sumpf von Arcole gibt nicht alles zurück. Den General ziehen sie heraus; nach dir wird morgen gesucht, wenn Zeit ist.',
      todesart:'Im Sumpf von Arcole geblieben',
      /* **Die Marke, die zwölf Spieljahre später gelesen wird.** „Jemand hat
         deinen Namen gefragt und aufgeschrieben" — das ist Grandmaison, damals
         ein junger Chef de bataillon und Adjutant des Generals. Ab Rang 9
         beginnt man bei ihm mit Gunst +2 statt bei null.

         **Es wird nirgends angekündigt.** Weder hier noch im Handbuch. Es wird
         nur eingelöst — die einzige Stelle im Spiel, an der eine Entscheidung
         aus dem ersten Kapitel eine mechanische Folge in der Offiziershälfte
         hat. Wer die Kette verfehlt oder gar nicht erst antritt, trifft ihn in
         zwölf Jahren kalt. */
      erfolg:{text:'Auf dem Damm sieht er dich an, einen Atemzug lang, Schlamm bis zum Kinn. Jemand hat deinen Namen gefragt und aufgeschrieben. Mehr passiert nicht, und mehr braucht es nicht.',
              ruf:6, nennung:true, atem:-25, setzt:{arcoleMarke:true},
              tat:'Den General aus dem Sumpf von Arcole gezogen'},
      misserfolg:{text:'Herausgezogen haben ihn andere — und dich auch. Aber du warst im Wasser, als es darauf ankam, und die auf dem Damm haben es gesehen.',
              ruf:2, atem:-30, belastung:10,
              tat:'In den Sumpf von Arcole gesprungen'}},
     {label:'Auf dem Damm bleiben und Deckung schießen', hint:'Muskete · die Kroaten kurz ducken lassen',
      probe:{wert:'muskete', schw:40},
      erfolg:{text:'Du kniest an der Dammkante und feuerst auf alles, was drüben den Kopf hebt. Es sind die längsten zwei Minuten des Tages, aber die Kroaten schießen auf dich statt auf die Männer im Sumpf. Das war der Zweck.',
              moral:-12, ruf:2, tat:'Den Männern im Sumpf Deckung geschossen'},
      misserfolg:{text:'Deine Muskete versagt beim zweiten Schuss — nasses Pulver, der Sumpf ist überall. Du stehst nutzlos an der Kante, während unten gezogen und geschrien wird.',
              leben:-16, atem:-10, belastung:8}},
     {label:'Weitergehen', hint:'Adjutanten gibt es genug',
      erfolg:{text:'Du gehst weiter, wie fast alle. Sie ziehen ihn auch ohne dich heraus — dafür sind Adjutanten da. In den Berichten wird der Sumpf hinterher trockener sein und der Damm breiter.'}}]},

  {id:'pyramiden_riss', nur:'pyramiden', frage:'Der Riss im Karree',
   wenn:()=> K.runde >= 2,
   text:['Ein Mamluk setzt sein Pferd mitten auf die zweite Front, wo ein Gefallener eine Lücke gelassen hat. Das Pferd steigt in die Bajonette, schlägt aus, und auf einmal ist ein Loch im Karree, drei Mann breit — und ein Karree mit Loch ist keins mehr.',
         'Hinter ihm wenden dreißig Reiter. Sie haben es gesehen.'],
   optionen:[
     {label:'Mit dem Bajonett in die Lücke', hint:'Du bist der Nächste am Loch', risk:true,
      kette:[
        {name:'In die Lücke', wert:'bajonett', schw:40, schaden:14,
         gut:'Du stehst im Loch, bevor du dich entschieden hast. Der Reiter geht über dir hoch, und du stößt zu, wohin der Sergent es dich gelehrt hat — ins Pferd, nicht in den Mann.',
         schlecht:'Der Krummsäbel kommt von oben, wo dein Bajonett nicht ist, und reißt dich halb um.'},
        {name:'Standhalten', wert:'konstitution', schw:40, schaden:14,
         gut:'Drei Atemzüge stehst du allein in der Lücke, gegen alles, was hineinwill. Dann sind links und rechts wieder Schultern, und das Karree ist zu.',
         schlecht:'Das stürzende Pferd drückt dich nieder, und was über dich wegsteigt, fragt nicht, wo du hingehörst.'}],
      tod:'Das Karree schließt sich wieder — über dir. Von außen sieht es aus, als wäre nichts gewesen, und genau das ist der Sinn eines Karrees.',
      todesart:'Im Karree bei Embabeh gefallen',
      erfolg:{text:'Draußen dreht die Welle ab, dreißig Reiter auf einmal, weil das Loch zu ist, bevor sie da sind. Der Capitaine hat es gesehen. Das Karree hat es gesehen. Das reicht für einen Abend, an dem niemand fragt, warum du zitterst.',
              moral:-20, ruf:4, eigen:8,
              tat:'Das Karree bei Embabeh geschlossen'},
      misserfolg:{text:'Über dich hinweg schließen andere die Lücke. Du liegst zwischen den Beinen des zweiten Glieds und siehst den Himmel zwischen dreißig Hüten — aber gesprungen bist du, und das haben sie gesehen.',
              ruf:2, eigen:-4, atem:-15, belastung:10,
              tat:'In die Lücke des Karrees gesprungen'}},
     {label:'Das zweite Glied hineinziehen', hint:'Drill · Männer schieben statt selbst stehen',
      probe:{wert:'drill', schw:35},
      erfolg:{text:'Du packst zwei Mann an den Riemen und stellst sie in das Loch, wie man Steine in eine Mauer setzt. Es ist nicht tapfer, es ist Handwerk, und es macht das Karree zu, bevor die dreißig da sind.',
              moral:-8, ruf:2, eigen:6},
      misserfolg:{text:'Du zerrst am Falschen, er zerrt zurück, und drei Atemzüge lang ist das Loch größer statt kleiner. Dann macht es ein Sergent mit dem Kolben zu — das Loch und die Diskussion.',
              leben:-16, eigen:-8, belastung:8}},
     {label:'Ducken und die Flanken schießen lassen', hint:'Das Karree hat vier Seiten',
      erfolg:{text:'Du machst dich klein und lädst. Die Flanken feuern schräg vor das Loch, und irgendwer anders wirft sich hinein. Das Karree hält — es hält nur ohne dich, und die daneben wissen es.',
              eigen:-6, ruf:-1}}]},

  {id:'akkon_bresche', nur:'akkon', frage:'Die Sturmkolonne',
   wenn:(n)=> K.feindMoral > n.feindMoral*0.5,
   text:['Vor der Bresche wird eine Sturmkolonne gesammelt. Die Bresche ist zwanzig Schritt breit und sieht von hier aus wie ein Tor; wer näher war, sagt, dahinter stehe eine zweite Mauer, und auf der stünden die Engländer von den Schiffen.',
         'Die letzten zwei Kolonnen sind nicht zurückgekommen. Der Branntwein wird vorab ausgegeben, das sagt alles.'],
   optionen:[
     {label:'Sich melden', hint:'Doppelter Sold, wenn es einen Abend danach gibt', risk:true,
      kette:[
        {name:'Die Rampe', wert:'geschick', schw:40, schaden:14,
         gut:'Die Schuttrampe nimmst du im Zickzack, immer dorthin, wo es gerade eingeschlagen hat — dort schlägt es so schnell nicht wieder ein.',
         schlecht:'Auf der Rampe reißt es dich von den Beinen, und du rutschst ein Stück zurück, über Schutt, der aus Mauer und Männern besteht.'},
        {name:'Die Bresche', wert:'bajonett', schw:45, schaden:16,
         gut:'Oben ist die Bresche eng, und was darin steht, will sie halten. Du stößt zu, zweimal, und dann stehst du in der Öffnung — und siehst die zweite Mauer, von der keiner gesprochen hat, der sie nicht gesehen hat.',
         schlecht:'In der Bresche kommt es von zwei Seiten zugleich. Du wehrst ab, was du siehst, und was du nicht siehst, trifft dich an der Schulter.'},
        {name:'Der Rückweg', wert:'kaltbluetigkeit', schw:45, schaden:14,
         gut:'Der Rückzugsbefehl kommt, und du gehst rückwärts die Rampe hinunter, das Gesicht zur Mauer, Schritt für Schritt. Wer rennt, fällt.',
         schlecht:'Beim Rückzug rennst du, wie fast alle rennen, und die Mauer schießt euch in die Rücken.'}],
      tod:'Auf dem Schutt der Rampe bleibst du liegen, zwischen denen von gestern und vorgestern. Akkon fällt nicht — und du drei Wochen vor allen anderen.',
      todesart:'Gefallen in der Bresche von Akkon',
      erfolg:{text:'Du bist einer von neun, die zurückkommen. Der Adjutant, der die Namen aufschreibt, fragt zweimal nach, weil deine Stimme nicht mehr trägt. Doppelter Sold, ein Satz im Tagesbefehl — und das Wissen, dass hinter der Bresche eine zweite Mauer steht.',
              moral:-22, ruf:7, nennung:true, geld:6, atem:-22, belastung:8,
              tat:'Mit der Sturmkolonne in der Bresche von Akkon'},
      misserfolg:{text:'Du kommst zurück, gezogen von einem, dessen Gesicht du nie gesehen hast. Der doppelte Sold wird trotzdem gezahlt. Vom Branntwein spürst du nichts mehr.',
              ruf:2, geld:6, atem:-25, belastung:14,
              tat:'Mit der Sturmkolonne vor der Bresche von Akkon'}},
     {label:'Die Leitern bis an den Graben tragen', hint:'Konstitution · nicht hinein, nur hin',
      probe:{wert:'konstitution', schw:40},
      erfolg:{text:'Vier Mann je Leiter, im Laufschritt durch das Vorfeld, ablegen, zurück. Es ist Trägerarbeit unter Feuer, und niemand nennt sie im Tagesbefehl — aber ohne die Leitern läuft niemand irgendwo hinauf.',
              moral:-8, ruf:3, geld:3, atem:-14},
      misserfolg:{text:'Auf halbem Weg schlägt es in die Leiter, und die Leiter schlägt in euch. Du bringst das vordere Ende allein bis an den Graben, weil die anderen drei nicht mehr tragen.',
              leben:-20, atem:-18, belastung:10}},
     {label:'Im Graben bleiben und schießen', hint:'Die Mauer ist nicht dein Befehl',
      erfolg:{text:'Du feuerst aus dem Graben auf die Brustwehr, damit drüben die Köpfe unten bleiben. Die Kolonne läuft an dir vorbei die Rampe hinauf. Was von ihr zurückkommt, kommt einzeln.'}}]}
);

/* Höchstens zwei je Gefecht, frühestens ab der zweiten Runde, und jedes nur
   einmal. Ohne die Obergrenze würde ein langes Gefecht (Akkon: neun Runden) zu
   einer Ereigniskette, und die Frage „wie weit gehst du" nutzt sich ab, wenn
   sie fünfmal hintereinander kommt. Sondermissionen (`nur`) kommen zuerst und
   öfter; die allgemeinen Ereignisse füllen auf. */
/* Wer gesehen wurde, wird geholt: Ruf zieht Ereignisse an. Der Adjutant sucht
   keine Unbekannten, und die Lücke im Glied schließt der, dessen Name schon
   einmal gefallen ist. Ab Ruf 30 — derselben Schwelle, an der der Caporal
   hängt — kommt sogar ein drittes Ereignis in Frage.

   Das trifft gezielt den Aufsteiger und lässt den Vorsichtigen in Ruhe, und
   genau so soll es sein: Ehrgeiz koppelt sich an Blut, ohne dass jemand
   gezwungen wird. */
function ereignisWuerfeln(n){
  const gesehen = K.gesehen || (K.gesehen = []);   // Läufe aus Fassung 2 kennen das Feld noch nicht
  K.ereignisZahl = K.ereignisZahl || 0;
  const hoechstens = S.ruf >= CAPORAL_RUF ? 3 : 2;
  if(K.ereignisZahl >= hoechstens || K.runde < 2) return null;
  const zieht = Math.min(0.65, 0.45 + S.ruf/400);
  const sonder = GEFECHTS_EREIGNISSE.find(e => e.nur === n.id && !gesehen.includes(e.id) && e.wenn(n));
  if(sonder && Math.random() < 0.6) return sonder;
  if(Math.random() > zieht) return null;
  const moeglich = GEFECHTS_EREIGNISSE.filter(e => !e.nur && !gesehen.includes(e.id) && e.wenn(n));
  if(!moeglich.length) return null;
  return moeglich[Math.floor(Math.random()*moeglich.length)];
}

function zeigeEreignis(e){
  const n = KAPITEL[LAUF.node];
  const opt = e.optionen.map((o,i)=>{
    const proben = o.kette
      ? ' · ' + o.kette.map(st=>wertName(st.wert)+' '+wert(st.wert)+' gegen '+st.schw+' · '+aussicht(st.wert,st.schw)+'%').join(' · ')
      : (o.probe ? ' · '+wertName(o.probe.wert)+' '+wert(o.probe.wert)+' gegen '+o.probe.schw+' · '+aussicht(o.probe.wert,o.probe.schw)+'%' : '');
    return `<button class="ord ${o.risk?'risk':''}" onclick="ereignisWaehlen(${i})">
    ${esc(o.label)}<span class="cost">${esc(o.hint||'')}${proben}</span></button>`;
  }).join('');
  app.innerHTML = `<div class="stage">${verlauf()}
    <div><div class="card"><div class="ch"><span>${esc(e.frage)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb">${sichtfeld()}
        <div class="prose" style="margin-top:15px">${e.text.map(t=>`<p>${t}</p>`).join('')}</div>
        <div class="probe" style="margin-top:12px">${zeitWort()} ${K.runde} VON ${n.runden}
          · WIDERSTAND DES FEINDES ${Math.max(0,Math.round(K.feindMoral))}
          · EURE LINIE ${Math.max(0,Math.round(K.eigen==null?100:K.eigen))}</div>
        ${balken('b-red',Math.max(0,K.feindMoral),n.feindMoral)}
      </div></div>
      <div class="orders"><div class="ch"><span>Was tust du?</span></div><div class="ordbody">${opt}</div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

/* Die Wirkung eines Ereignisses. Ruf kommt hier an `anerkennung()` vorbei und
   damit an der Obergrenze von drei je Gefecht: Die gilt für Handlungen, die man
   jede Runde wiederholen kann, und soll das Einsammeln verhindern. Ein Ereignis
   kommt höchstens einmal und stellt eine Frage, die etwas kostet — es ist genau
   das, wofür „besondere Dinge am Gefechtsende" gedacht war. */
function ereignisWirkung(w){
  if(w.moral) K.feindMoral += w.moral;
  if(w.eigen) K.eigen = Math.max(0, Math.min(100, K.eigen + w.eigen));
  if(w.gefahr) K.gefahrPlus = (K.gefahrPlus||0) + w.gefahr;
  if(w.leben) S.leben = Math.max(0, S.leben + w.leben);
  if(w.atem) S.atem = Math.max(0, Math.min(100, S.atem + w.atem));
  if(w.belastung) S.belastung = Math.max(0, Math.min(100, S.belastung + w.belastung));
  if(w.kameradschaft) S.kameradschaft = Math.max(0, Math.min(100, S.kameradschaft + w.kameradschaft));
  if(w.gunst) gunstGeben(w.gunstVon || 'martel', w.gunst);
  if(w.ruf) S.ruf = Math.max(0, S.ruf + w.ruf);
  if(w.nennung) S.nennungen++;
  if(w.vorn) K.vorn = true;
  if(w.tat && w.ruf > 0) K.taten.push({was:w.tat, ruf:w.ruf});
  atemKlemmen();
}

function ereignisWaehlen(i){
  const n = KAPITEL[LAUF.node];
  const e = GEFECHTS_EREIGNISSE.find(x=>x.id===K.ereignis);
  if(!e){ K.ereignis = null; zeigeKampf('Das Gefecht geht weiter.'); return; }
  const o = e.optionen[i];
  K.ereignis = null;
  S.log.push(n.id+': '+o.label);   // steht auf dem Chronikblatt unter der Station

  let text, w;
  if(o.kette){
    /* Eine Sondermission ist keine einzelne Probe, sondern ein Gang: zwei oder
       drei Stufen, jede mit eigener Probe, und jeder Fehlschlag kostet sofort
       Blut (Stufenschaden 12–20). Wer unterwegs auf null fällt, fällt dort —
       mit dem Todestext der Mission, nicht dem allgemeinen. Zurück gibt es ab
       der ersten Stufe nicht mehr; genau das unterscheidet den Gang vom
       Rundengeschäft, aus dem man sich jede Runde neu entscheiden kann.
       Die Wirkung am Ende braucht die Mehrheit der Stufen; auch der
       Misserfolg gibt Ruf +2 — hingegangen ist hingegangen. */
    const zeilen = []; let treffer = 0;
    for(const st of o.kette){
      const p = probe(st.wert, st.schw);
      let schaden = 0;
      if(p.erfolg) treffer++;
      else { schaden = st.schaden + Math.floor(Math.random()*5); S.leben = Math.max(0, S.leben - schaden); }
      atemKlemmen();
      zeilen.push((p.erfolg?st.gut:st.schlecht) +
        ` <span class="fein">${wertName(st.wert)} — ${p.erfolg?'gelungen':'misslungen'}${schaden?' · Leben −'+schaden:''}</span>`);
      K.protokoll.push(st.name + (p.erfolg?' — gelungen':' — misslungen'));
      if(S.leben <= 0){
        gefallen(zeilen.join(' ') + ' ' + (o.tod||''),
                 o.todesart || ('Gefallen bei '+n.datum.split(' · ')[1]));
        return;
      }
    }
    w = (treffer*2 > o.kette.length) ? o.erfolg : (o.misserfolg || o.erfolg);
    /* **Voll bestanden** heißt: jede Stufe gelungen, nicht die Mehrheit. Das
       ist die Bedingung des Ehrensäbels und die einzige Stelle im Spiel, an der
       ein Orden an einer einzelnen, benannten Tat hängt statt an einer Summe.
       Wer durch die Bresche von Akkon gegangen ist, ohne einmal zu straucheln,
       soll nicht dasselbe bekommen wie einer, der dreimal aufgefallen ist. */
    if(treffer === o.kette.length){ S.sondermissionen = (S.sondermissionen|0) + 1; K.kette = true; }
    text = zeilen.join(' ') + '<br><br>' + w.text;
  } else {
    const p = o.probe ? probe(o.probe.wert, o.probe.schw) : {erfolg:true};
    w = p.erfolg ? o.erfolg : (o.misserfolg || o.erfolg);
    text = w.text;
    K.protokoll.push(esc(o.label) + (o.probe ? (p.erfolg?' — gelungen':' — misslungen') : ''));
  }
  ereignisWirkung(w);
  /* Eine Ereignisrunde ist eine Runde: Wer vorgetreten ist, hat nicht gekniet.
     Ohne diesen Reset galt „dritte Runde auf dem Knie" (Ruf −2) auch für einen
     Mann, der dazwischen mit dem Bajonett vorgegangen war. `deckung` fällt aus
     demselben Grund — sonst zeigt das Sichtfeld ihn weiter kniend. */
  K.duckFolge = 0; K.deckung = false;

  if(S.leben <= 0){
    gefallen(text + ' Du setzt dich hin, weil du nicht anders kannst, und stehst nicht wieder auf.',
             'Gefallen bei '+n.datum.split(' · ')[1]);
    return;
  }
  if(w.ende==='sieg' || K.feindMoral <= 0){ kampfEnde(true, text); return; }
  K.runde++;
  if(K.runde > n.runden){
    const knapp = K.feindMoral < n.feindMoral*0.35;
    kampfEnde(knapp, text + (knapp?' Und dann ist es plötzlich vorbei.':' Es wird dunkel, und nichts ist entschieden.'));
    return;
  }
  laufSichern();
  zeigeKampf(text);
}

/* ══════════════════ DIE VIER BRÜCHE BEKOMMEN JE EINEN SATZ ══════════════════

   **Ein Satz, keine Fanfare, und danach nie wieder.** Beim ersten Gefecht in
   einem neuen Maßstab hält das Spiel einmal an und sagt, was anders ist — und
   zwar immer das, **was fehlt**, nicht das, was dazugekommen ist.

   Größe muss man sehen, nicht erklärt bekommen. Deshalb steht hier auch kein
   Wort über neue Knöpfe: Die findet man selbst. Was man nicht selbst findet,
   ist die Abwesenheit einer Sache, die zehn Ränge lang da war.

   **Der dritte Bruch bekommt bewusst keinen Hinweis auf die Atemleiste.** Sie
   ist einfach weg. Wer sie vermisst, hat den Bruch verstanden; wer nicht, hat
   nichts verloren. Ein Satz „Ab jetzt zählt dein Atem nicht mehr" würde ihn
   vollständig zerstören. */
function bruchAnsage(){
  if(K.runde !== 1) return '';
  const zeig = (schluessel, kopf, text)=>{
    if(S[schluessel]) return null;
    S[schluessel] = true;
    return `<div class="wirkung" style="margin-top:14px"><span>${esc(kopf)}</span>${text}</div>`;
  };
  let a = null;
  if(S.rang>=12) a = zeig('karteGesehen','Was du jetzt siehst',
    'Eine Karte, drei Straßen, fünf Kästchen und eine Uhr. Auf keinem der Kästchen steht, wie es dort wirklich aussieht — es steht darauf, was zuletzt gemeldet wurde und wie alt die Meldung ist. Ein Fusilier sah vier Männer und Rauch. Was er sah, war wahr.');
  else if(S.rang>=10) a = zeig('rechteckeGesehen','Was du jetzt siehst',
    'Vier Rechtecke, ein Buchstabe in jedem, zwei Zahlen darunter. Achthundert Mann, und du wirst heute keinen davon von nahem sehen. Gleich wirst du entscheiden, welches der vier zuerst hineingeht.');
  else if(S.rang>=7) a = zeig('skizzeGesehen','Was du jetzt siehst',
    'Ein Blatt, ein Bleistift und die Front als Strich. Wo bis gestern Gesichter standen, steht eine Zahl. Deine Muskete hat der Fourrier eingezogen; man hat dir nichts dafür gegeben außer einem Degen, den du selbst bezahlt hast.');
  return a || '';
}

function zeigeKampf(text){
  const n = KAPITEL[LAUF.node];
  const opt = aktionen().map(a=>`<button class="ord ${a.risk?'risk':''}" onclick="kampfAktion('${a.id}')"
      ${a.aus&&a.aus()?'disabled':''}>${a.label}<span class="cost">${a.cost}</span></button>`).join('');
  app.innerHTML = `<div class="stage">${verlauf()}
    <div><div class="card"><div class="ch"><span>Sichtfeld</span><span>${esc(n.datum)}</span></div>
      <div class="cb">${sichtfeld()}
        ${bruchAnsage()}
        ${(()=>{ const auf = auftragFuer(n); return auf
          ? `<div class="wirkung" style="margin-top:14px"><span>Auftrag des Chef de bataillon</span>${esc(auf.text)}</div>` : ''; })()}
        <div class="prose" style="margin-top:15px"><p>${text}</p></div>
        ${/* Ab Rang 12 stehen hier Meldungen statt eines Zustands — mit Alter,
             ohne Gewähr. Sie sind das Einzige, was ein General vom Gefecht hat. */''}
        ${(K.meldungen&&K.meldungen.length)?`<div class="lage"><div class="lagekopf">Was auf dem Tisch liegt</div>
          ${K.meldungen.slice().reverse().map(m=>`<div class="tat"><span>${esc(m.text)}</span><b>${m.alter} ${esc(zeitWort(true).toLowerCase())} alt</b></div>`).join('')}</div>`:''}
        ${(ausserAtem()&&S.rang<10)?`<p class="warnung">Du bekommst keine Luft mehr. ${S.atem<30?'Jeder Handgriff dauert zu lange, und du bist ein leichteres Ziel.':'Noch geht es — aber nicht mehr lange.'} <b>Atem ${S.atem}</b> · ${S.zweig==='voltigeur'?'Flach hinlegen':'Hinknien'} bringt +10.</p>`:''}
        <div class="probe" style="margin-top:12px">${zeitWort()} ${K.runde} VON ${n.runden}
          ${/* **Ab Rang 12 gibt es keinen Widerstandswert mehr.** Der Feind ist
               eine Vermutung, und eine Vermutung hat keinen Balken. Wer sie hier
               doch anzeigt, hat den Rang nicht gebaut. */''}
          ${feindAnzeige(n)}
          ${S.rang>=10 ? '' : '· EURE LINIE '+Math.max(0,Math.round(K.eigen==null?100:K.eigen))}
          ${/* Der Kopf zählt in der Größe, die man führt: zwanzig, sechzig, hundertzwanzig. */''}
          ${S.rang>=12 ? '· '+(K.verbaende||[]).length+' VERBÄNDE'
            : S.rang>=10 ? '· '+(K.kompanien||[]).length+' KOMPANIEN'+(K.vorhut!=null?' · '+esc(K.kompanien[K.vorhut].name.toUpperCase())+' VORN':' · KEINE VORN')
            : S.rang>=9 && K.sektion!=null ? '· DEINE KOMPANIE '+Math.max(0,Math.round(K.sektion*1.2))+' VON 120'
            : S.rang>=6 && K.sektion!=null ? '· DEIN ZUG '+Math.max(0,Math.round(K.sektion*0.6))+' VON 60'+(K.rollend>0?' · ROLLENDES FEUER':'')
            : S.rang===5 && K.sektion!=null ? '· DEINE SEKTION '+Math.max(0,Math.round(K.sektion/5))+' VON 20' : ''}</div>
        ${(S.rang>=12 || n.sturm) ? '' : balken('b-red',Math.max(0,K.feindMoral),n.feindMoral)}
        ${(S.rang>=5 && S.rang<10 && K.sektion!=null) ? balken('b-steel',Math.max(0,K.sektion),100) : ''}
        <div class="log" style="margin-top:14px">${K.protokoll.slice(-5).reverse().map(z=>`<div>${z}</div>`).join('')}</div>
      </div></div>
      <div class="orders"><div class="ch"><span>Was tust du?</span></div><div class="ordbody">${opt}</div></div>
    </div>${seitenleiste()}</div>`;
}

function kampfAktion(id){
  const n = KAPITEL[LAUF.node]; let text = '', schaden = 0, gefahrMod = 0;
  const zw = S.zweig;

  if(id==='laden'){
    const p = probe('geschick', 30);
    S.atem = Math.max(0,S.atem-8);
    if(p.erfolg){ K.geladen=true; text='Patrone auf, Pulver, Kugel, Ladestock. Die Muskete ist geladen.'; }
    else { text='Die Patrone rutscht dir durch die Finger. Du musst eine neue nehmen.'; S.atem=Math.max(0,S.atem-4); }
  }
  else if(id==='feuern' || id==='zielen'){
    const sorgfalt = (id==='zielen');
    const p = probe('muskete', sorgfalt? 20 : 35);
    K.geladen = false;
    S.atem = Math.max(0, S.atem - (sorgfalt?10:5));
    if(p.erfolg){ schaden = sorgfalt? 22+Math.random()*10 : 12+Math.random()*8;
      text = (sorgfalt? 'Du liegst still, atmest aus und drückst ab. Drüben fällt einer, und du weißt, dass er dir gehört.'
                      : 'Du feuerst in den Rauch. Irgendetwas drüben gerät in Unordnung.')
           + anerkennung(sorgfalt?2:1, sorgfalt?'Ein gezielter Schuss, der saß':'Getroffen'); }
    else { text = S.ausr.muskete.zustand<35 ? 'Das Schloss klickt und nichts geschieht. Die Waffe ist verrostet.'
                                            : 'Der Schuss geht zu hoch. In diesem Rauch trifft man mehr durch Zufall als durch Können.'; }
    if(S.ausr.muskete.verschleiss) S.ausr.muskete.zustand = Math.max(0,S.ausr.muskete.zustand-2);
  }
  else if(id==='ducken'){
    /* Verschnaufen ja, verstecken nein: Zwei Runden am Stück fragt niemand.
       Die dritte sieht der Sergent (Ruf −2), eine vierte gibt es nicht — der
       Knopf ist gesperrt, bis man eine Runde lang etwas anderes getan hat.
       Ohne diese Grenze war Knien ein Panzer: −22 Gefahr, Restrisiko ~4 %,
       und ein Gefecht ließ sich vom Boden aus aussitzen. */
    K.duckFolge = (K.duckFolge||0) + 1;
    K.deckung=true; S.atem=Math.min(100,S.atem+10); S.belastung=Math.max(0,S.belastung-2);
    /* Ein Offizier hat keinen Kolben, den er in den Dreck setzen könnte, und
       er kniet auch nicht hinter dem Vordermann — er steht vor der Front. Das
       Ducken kostet ihn deshalb nicht Luft, sondern Ansehen: Es sieht jeder. */
    text = S.rang>=7
      ? 'Du gehst hinter die Böschung, drei Schritte, mehr ist es nicht. Es reicht, um zu Atem zu kommen, und es reicht, damit sechzig Mann sehen, dass ihr Offizier hinter der Böschung ist.'
      : zw==='voltigeur'
      ? 'Du gehst flach in eine Ackerfurche, das Gesicht im Dreck, und atmest zum ersten Mal seit zehn Minuten bis unten. Vor der Linie sucht dich jetzt niemand mehr — die eigenen Leute auch nicht.'
      : 'Du gehst auf ein Knie, den Kolben in den Dreck, den Kopf hinter den Rücken des Vordermanns. Hinlegen kann sich in der Linie niemand — das Glied bliebe offen. Man kann nicht ewig knien, aber jetzt gerade schon.';
    /* Und für den Offizier reißt die Serie nicht nur — es kostet sofort. */
    if(S.rang>=7 && K.duckFolge>=2){ S.ruf = Math.max(0,S.ruf-2);
      text += ' <span class="fein">Die zweite Runde dahinter. Es wird niemand ansprechen, und es wird trotzdem jeder wissen. Ruf −2</span>'; }
    if(K.duckFolge===3){
      S.ruf = Math.max(0, S.ruf-2);
      text += zw==='voltigeur'
        ? ' Die dritte Runde im Dreck. Irgendwer wird nachher fragen, wo deine Patronen geblieben sind — die Antwort steht dir ins Gesicht geschrieben. <span class="fein">Ruf −2</span>'
        : ' Die dritte Runde auf dem Knie. Martel sieht her, sagt nichts und merkt es sich. <span class="fein">Ruf −2</span>';
    }
    gefahrMod = -22;
  }
  else if(id==='deckung'){
    const p = probe('geschick', 35);
    if(p.erfolg){ K.deckung=true; gefahrMod=-20; text='Drei Sprünge nach links, hinter einen Weidenstumpf. Wer dort hinschießt, wo du warst, trifft nichts.'; }
    else { text='Du bleibst auf halbem Weg im Freien hängen und musst dich flach machen, wo keine Deckung ist.'; gefahrMod=+10; }
  }
  else if(id==='halten'){
    const p = probe('kaltbluetigkeit', 40);
    K.deckung=false;
    if(p.erfolg){ schaden = 6; S.belastung=Math.max(0,S.belastung-3); nutzen('drill',1);
      text='Du bleibst stehen. Links und rechts bleiben sie auch stehen, weil du stehst. Die Linie hält.'
         + anerkennung(1,'Stehen geblieben, als es darauf ankam'); }
    else { S.belastung=Math.min(100,S.belastung+6);
      text='Du stehst, aber deine Hände zittern so, dass du nichts damit anfangen kannst.'; }
  }
  else if(id==='bajonett'){
    const p = probe('bajonett', zw==='grenadier'?30:45);
    K.deckung=false; S.atem=Math.max(0,S.atem-18); gefahrMod = +26;
    K.vorn = p.erfolg;
    if(p.erfolg){ schaden = 30+Math.random()*14;
      text='Du gehst vor. Es ist laut und kurz und danach stehst du zehn Schritt weiter als vorher.'
         + anerkennung(2,'Mit dem Bajonett vorgegangen'); }
    else { text='Du gehst vor, aber niemand geht mit. Nach fünf Schritten stehst du allein und kehrst um.';
      S.belastung=Math.min(100,S.belastung+7); }   // die einzige Stelle, der die Klemme fehlte
  }
  else if(id==='salve'){
    const p = probe('autoritaet', 40);
    if(p.erfolg){ schaden = 26+Math.random()*10; nutzen('drill',1);
      text='„Anlegen — Feuer!" Acht Musketen gehen fast gleichzeitig los. Fast. Aber es reicht.'
         + anerkennung(1,'Eine Salve, die saß'); }
    else { text='Du rufst den Befehl, und drei von acht hören ihn. Das Ergebnis ist ein trauriges Geknatter.'; schaden=6; }
  }
  else if(id==='luecke'){
    /* Der Unterschied zum Hinknien: Das dort schützt dich, das hier deine
       Leute. Die geschlossene Linie hält drei Runden lang die halben Verluste
       aus, und das erste Mal je Gefecht sieht es jemand, der Listen führt. */
    const p = probe('drill', 35);
    if(p.erfolg){
      gefahrMod = -8; K.geschlossen = 3;
      S.kameradschaft = Math.min(100, S.kameradschaft+4);
      let lob = '';
      if(!K.lueckeGelobt){ K.lueckeGelobt = true; lob = ' Der Capitaine geht hinter der Linie durch und sieht es.'
        + anerkennung(1,'Die Linie geschlossen gehalten'); }
      text = 'Du schiebst die Männer zusammen, bis kein Loch mehr in der Linie ist. Deine acht wissen jetzt, wozu du gut bist.'+lob;
    }
    else { text='Sie rücken auf, aber zu langsam, und die Lücke bleibt offen. Durch ein offenes Glied schießt es sich leichter.'; }
  }
  /* ── Die Sektion ──
     `K.sektion` ist **keine** Anzeige wie `K.eigen`, sondern die Größe, an der
     der Rang hängt: Sie entscheidet den Schaden der Salve, und sie wird nach
     dem Gefecht abgerechnet. Zum ersten Mal kann man ein Gefecht gewinnen und
     trotzdem verlieren — „Wer barfuß marschiert, ist dein Versäumnis". */
  else if(id==='sektionsalve'){
    const p = probe('autoritaet', 45);
    const anteil = Math.max(0.35, (K.sektion||100)/100);
    if(p.erfolg){ schaden = (34 + Math.random()*14) * anteil; nutzen('drill',1);
      text = 'Du lässt anlegen, wartest zwei Atemzüge länger, als sich richtig anfühlt, und dann fällt das Kommando. Zwanzig Musketen auf einen Schlag sind kein Lärm, sondern eine Wand.'
           + anerkennung(1,'Eine Salve, die saß'); }
    else { schaden = 10 * anteil; K.sektion = Math.max(0,(K.sektion||100)-6);
      text = 'Dein Kommando kommt eine Sekunde zu spät, und die Sektion feuert einzeln. Zwanzig Schüsse nacheinander sind zwanzig Gelegenheiten für die andere Seite.'; }
  }
  else if(id==='glieder'){
    const p = probe('drill', 40);
    if(p.erfolg){ K.geschlossen = 3; schaden = 8;
      text = 'Erstes Glied kniet, zweites tritt durch. Es dauert acht Sekunden, in denen niemand schießt, und danach steht vorn, wer noch Pulver hat.'; }
    else { text = 'Der Wechsel gerät durcheinander, und für einen Moment stehen alle zwanzig ohne Ordnung im Freien.'; K.sektion = Math.max(0,(K.sektion||100)-8); }
  }
  else if(id==='herausnehmen'){
    const p = probe('menschenkenntnis', 40);
    gefahrMod = +10;                       // du gehst dabei aus dem Glied
    if(p.erfolg){ K.sektion = Math.min(100,(K.sektion||100)+6); S.kameradschaft=Math.min(100,S.kameradschaft+4);
      text = 'Du siehst es an den Schultern, bevor er selbst es weiß: Der Junge im zweiten Glied läuft gleich. Du hast ihn am Riemen, bevor er den ersten Schritt macht, und stellst ihn zwischen zwei Ältere. Er bleibt.'
           + anerkennung(1,'Einen aus dem Glied geholt, bevor er lief'); }
    else { text = 'Du greifst nach ihm und bekommst nur den Tornistergurt. Er läuft trotzdem, und zwei sehen ihm nach.'; K.sektion = Math.max(0,(K.sektion||100)-10); }
  }
  /* ── Der Zug ──
     **Rollendes Feuer** ist der Kern: Drei Sektionen feuern nacheinander, also
     steht immer eine geladen. Für den Spieler heißt das, was ein Zug wirklich
     leistet — er schießt *durchgehend*, während ein einzelner Mann die Hälfte
     der Zeit lädt. Deshalb wirkt er auch in der Runde, in der man nichts tut. */
  else if(id==='zugfeuer'){
    const p = probe('drill', 45);
    const anteil = Math.max(0.35, (K.sektion||100)/100);
    if(p.erfolg){ schaden = (30 + Math.random()*12) * anteil; K.rollend = 3; nutzen('autoritaet',1);
      text = 'Erste Sektion Feuer, zweite Sektion Feuer, dritte Sektion Feuer, erste wieder geladen. Es hört nicht auf, und das ist der ganze Unterschied: Ein Mann schießt jede zweite Minute, ein Zug schießt immer.'
           + anerkennung(1,'Rollendes Feuer, das nicht abriss'); }
    else { schaden = 12 * anteil; K.sektion = Math.max(0,(K.sektion||100)-5);
      text = 'Die zweite Sektion feuert zu früh, die dritte gar nicht, und für vier Sekunden steht der ganze Zug mit leeren Läufen da.'; }
  }
  else if(id==='einteilen'){
    const p = probe('autoritaet', 50);
    if(p.erfolg){ K.geschlossen = 3; schaden = 6;
      K.sektion = Math.min(100,(K.sektion||100)+3);
      text = 'Du gehst hinter der Front durch und sagst drei Sergenten je einen Satz. Mehr ist es nicht — und danach steht der Zug anders da. Man führt sechzig Mann nicht, indem man sechzig Mann etwas zuruft.'; }
    else { text = 'Zwei von deinen Sergenten hören dich, der dritte nicht, und sein rechtes Ende steht zehn Schritt zu weit vorn. Das sieht jeder, der drüben zielt.';
      K.sektion = Math.max(0,(K.sektion||100)-6); }
  }
  else if(id==='halten_sektion'){
    const p = probe('drill', 40);
    if(p.erfolg){ gefahrMod = -6; K.geschlossen = 3;
      K.sektion = Math.min(100,(K.sektion||100)+4);
      let lob = '';
      if(!K.sektionGelobt){ K.sektionGelobt = true; lob = anerkennung(1,'Die Sektion geschlossen gehalten'); }
      text = 'Schließen, aufschließen, Abstand halten. Zwanzig Mann sind keine acht: Man sieht die Enden nicht mehr, man muss sie sich denken. Deine Sektion steht, wo sie stehen soll.' + lob; }
    else { text = 'Du rufst gegen den Lärm an, und der Lärm gewinnt. Das rechte Ende der Sektion hört dich nicht.'; K.sektion = Math.max(0,(K.sektion||100)-6); }
  }
  /* ══════════════════ DER OFFIZIER ══════════════════

     **Die neue Ohnmacht.** Als Fusilier lag zwischen Entscheidung und Wirkung
     nichts — du hast gezielt und getroffen. Als Sous-Lieutenant gibst du einen
     Befehl und wartest, ob er ausgeführt wird: Jeder Knopf hier ist eine Probe
     auf *andere Leute*. Das ist die Erfahrung, die Rang 7 verkauft — **du bist
     mächtiger und hilfloser zugleich.**

     Deshalb hängt jeder Schaden am Zustand der Einheit (`K.sektion`) und nicht
     mehr an der eigenen Hand. Wer seine Leute im Lager vernachlässigt hat,
     merkt es hier und kann nichts dagegen tun. */
  else if(id==='vorfuehren'){
    const p = probe('autoritaet', 45);
    const anteil = Math.max(0.35, (K.sektion||100)/100);
    K.deckung = false; gefahrMod = +8;    // du gehst voran, sonst geht niemand
    if(p.erfolg){ schaden = (36 + Math.random()*16) * anteil;
      text = 'Du gehst die drei Schritte vor die Front, drehst dich nicht um und weißt trotzdem, dass sie mitkommen. Genau dafür stehst du dort: damit sechzig Männer etwas sehen, dem sie folgen können.'
           + anerkennung(2,'Den Zug selbst vorgeführt'); }
    else { schaden = 8 * anteil; K.sektion = Math.max(0,(K.sektion||100)-7);
      text = 'Du gehst vor, und die vordere Sektion kommt mit. Die beiden hinteren nicht, weil sie den Befehl im Lärm nicht gehört haben, und für zehn Sekunden steht ein Drittel deines Zuges allein im Freien.'; }
  }
  else if(id==='gelaendenutzen'){
    /* Die erste Verwendung von Taktik, die etwas kostet und etwas bringt: Wer
       eine Bodenwelle nutzt, wird schlechter getroffen und trifft schlechter.
       Das ist der Handel, den ein Offizier abschließt und ein Fusilier nicht
       abschließen konnte, weil er stand, wo man ihn hinstellte. */
    const p = probe('taktik', 40);
    if(p.erfolg){ K.gelaendeVorteil = 3;
      text = 'Zweihundert Schritt links liegt eine Bodenwelle, die auf keiner Karte steht. Du lässt den Zug dorthin ziehen, ehe drüben jemand merkt, dass er sich bewegt. Von hier aus schießt es sich schlechter — und auf euch auch.'; }
    else { text = 'Was von hier aus wie eine Senke aussah, ist eine Mulde von vierzig Schritt, die an beiden Enden offen liegt. Der Zug steht darin wie in einer Schüssel.'; gefahrMod = +6; }
  }
  else if(id==='frontverkuerzen'){
    const p = probe('drill', 45);
    if(p.erfolg){ K.geschlossen = 3; K.sektion = Math.min(100,(K.sektion||100)+5);
      text = 'Von drei Sektionen auf zwei, das rechte Ende zieht nach innen. Die Front ist kürzer, die Wand ist dichter, und die Lücken, durch die es vorhin hereinkam, sind zu.'; }
    else { text = 'Der Befehl geht durch, und dann steht das rechte Ende an zwei Stellen doppelt und an einer gar nicht. Es dauert eine Minute, das aufzulösen, und in der Minute wird geschossen.';
      K.sektion = Math.max(0,(K.sektion||100)-6); }
  }
  else if(id==='degen'){
    /* Einmal je Gefecht, und es ist keine Handlung, sondern ein Zeichen: Ein
       Offizier mit gezogenem Degen ist auf dreihundert Schritt zu erkennen —
       von den eigenen Leuten und von denen, die zielen. */
    K.degenGezogen = true; K.deckung = false;
    const p = probe('kaltbluetigkeit', 50);
    gefahrMod = +20;
    if(p.erfolg){ K.zugHaelt = true; schaden = 14;
      text = 'Du ziehst den Degen und hältst ihn hoch, und danach geht niemand mehr zurück. Es ist kein Befehl. Es ist nur etwas, das jeder sehen kann, und in einem Gefecht ist das mehr wert als ein Befehl.'
           + anerkennung(2,'Mit gezogenem Degen vor der Front gestanden'); }
    else { text = 'Du ziehst den Degen, und für einen Augenblick sieht dich der halbe Zug an statt nach vorn. Dann fällt links jemand, und sie sehen wieder nach vorn.';
      S.belastung = Math.min(100,S.belastung+6); }
  }
  else if(id==='loesen'){
    /* **Rang 8 nimmt dir die Linie.** Die zweihundert anderen, die seit Rang 1
       unsichtbar mitgeschossen haben und ohne die kein Gefecht zu gewinnen war,
       fallen weg. Dafür ist nichts mehr gedeckelt: Ein gut geführter, gelöster
       Zug richtet mehr an als je zuvor — und ein schlechter stirbt allein. */
    if(K.geloest){ K.geloest = false;
      text = 'Du führst den Zug zurück an die Bataillonsfront. Es dauert zwei Minuten, in denen ihr nichts tut, und danach steht wieder rechts und links jemand.'; }
    else {
      const p = probe('taktik', 40);
      if(p.erfolg){ K.geloest = true;
        text = 'Du nimmst den Zug aus der Linie heraus und führst ihn schräg nach vorn, auf eigene Rechnung. Von hier an schießt niemand mehr für dich mit. Was drüben geschieht, geschieht durch deine sechzig Mann oder gar nicht.'; }
      else { text = 'Du willst den Zug herausnehmen, und der Chef de bataillon schickt einen Adjutanten, der dich fragt, ob du dir sicher bist. Du bist es dann doch nicht.'; }
    }
  }
  /* ── Wenn die Linie bricht ──
     Keine Muskete — die ist seit dem Patent weg —, aber Säbel und die Frage,
     ob man stehen bleibt. Der Wert dafür ist derselbe, den man als Grenadier
     hatte, und er ist seither nicht gewachsen. */
  else if(id==='saebel'){
    const p = probe('bajonett', 45);
    K.deckung = false; S.atem = Math.max(0,S.atem-16); gefahrMod = +18;
    if(p.erfolg){ schaden = 26+Math.random()*14; K.nahkampf = Math.max(0,K.nahkampf-1);
      text = 'Der Degen ist kein Bajonett, und deine Hände wissen das nicht. Sie tun, was sie 1797 gelernt haben, und es funktioniert trotzdem. Vor dir wird eine Lücke frei, und in die Lücke tritt einer deiner Sergenten.'
           + anerkennung(2,'Mit dem Degen in der Hand'); }
    else { text = 'Du triffst den Kolben statt den Mann. Der Degen bleibt hängen, und du bekommst ihn erst wieder frei, als jemand neben dir zusticht.';
      S.belastung = Math.min(100,S.belastung+8); }
  }
  /* ══════════════════ DAS BATAILLON (RANG 10 UND 11) ══════════════════ */

  /* **Die Rechnung.** Vier Kompanien, eine geht zuerst hinein. Es gibt keine
     Probe darauf, weil es keine Fertigkeit gibt, die einem diese Entscheidung
     abnimmt — man wählt, und danach ist es gewählt. Das Spiel sagt nicht, ob
     es eine falsche Wahl war. Es nennt nach dem Gefecht die Zahl und den
     Buchstaben. */
  else if(id.startsWith('vorhut')){
    const i = +id.slice(6); const k = K.kompanien[i];
    K.vorhut = i; k.vorn = true;
    schaden = 10;
    text = `Du zeigst auf die ${esc(k.name)}, und der Adjutant reitet los. Zwei Minuten später setzt sie sich in Bewegung, in Kolonne, das Tambour vorneweg. Die anderen drei sehen ihr nach.`;
  }
  else if(id==='staffeln'){
    const p = probe('taktik', 45);
    const K1 = K.kompanien;
    if(p.erfolg){
      /* Ablösen heißt: Die vordere kommt heraus, ehe sie bricht, und eine
         frische geht hinein. Es kostet Zeit und damit Wirkung, aber es ist der
         einzige Weg, ein Bataillon ganz aus einem Gefecht zu bringen. */
      const alt = K1[K.vorhut]; alt.vorn = false;
      let best = 0; for(let i=0;i<K1.length;i++) if(K1[i].bestand > K1[best].bestand) best = i;
      K.vorhut = best; K1[best].vorn = true;
      schaden = 14 + Math.random()*8;
      alt.haltung = Math.min(100, alt.haltung + 12);
      text = `Die ${esc(alt.name)} kommt heraus, die ${esc(K1[best].name)} geht hinein, und dazwischen liegen elf Sekunden, in denen niemand schießt. Es ist der Handgriff, an dem man ein gut geführtes Bataillon erkennt, und man sieht ihn von hier oben nicht — man hört ihn nur nicht schiefgehen.`;
    } else {
      text = 'Der Wechsel gerät ineinander. Für eine halbe Minute stehen zwei Kompanien im selben Abschnitt und eine dritte gar nicht mehr, wo sie stehen sollte.';
      K1.forEach(k=> k.haltung = Math.max(0, k.haltung - 6));
    }
  }
  else if(id==='schwerpunkt'){
    const p = probe('taktik', 50);
    if(p.erfolg){ schaden = 34 + Math.random()*16;
      text = 'Du nimmst zwei Kompanien aus der Front und schiebst sie hinter die dritte. Alles, was du hast, drückt jetzt auf zweihundert Schritt. Genau das ist der Unterschied zwischen einem Bataillon und achthundert Männern.'
           + anerkennung(2,'Den Schwerpunkt verlegt, und es hat getragen'); }
    else { schaden = 10;
      text = 'Die Verlegung dauert zu lange. Als sie steht, steht drüben auch etwas, und deine Flanken sind offen, wo sie vorher besetzt waren.'; }
    // Wer den Schwerpunkt verlegt, macht die anderen Abschnitte auf — immer.
    K.kompanien.forEach((k,i)=>{ if(i!==K.vorhut) k.bestand = Math.max(0, k.bestand - (5+Math.random()*6)); });
  }
  else if(id==='sammeln'){
    const p = probe('autoritaet', 45);
    if(p.erfolg){ K.kompanien.forEach(k=> k.haltung = Math.min(100, k.haltung + 14));
      text = 'Hinter der Front stehen die, die es nach hinten geschafft haben, in Gruppen von drei und vier. Deine Adjutanten treiben sie zusammen, und weil jemand ihnen sagt, wohin, gehen sie. Es sind keine feigen Männer. Es hat ihnen nur zwanzig Minuten lang niemand gesagt, wohin.'; }
    else { text = 'Die Gruppen hinter der Front lösen sich auf, sobald deine Adjutanten weiterreiten. Man kann Männer nicht sammeln, indem man an ihnen vorbeireitet.';
      K.kompanien.forEach(k=> k.haltung = Math.max(0, k.haltung - 3)); }
  }
  else if(id==='melden'){
    K.gemeldet = true;
    const p = probe('verwaltung', 40);
    if(p.erfolg && Math.random()<0.5){
      K.kompanien.forEach(k=>{ k.bestand = Math.min(100, k.bestand + 12); k.haltung = Math.min(100, k.haltung + 8); });
      text = 'Eine Dreiviertelstunde später kommen zweihundert Mann von der Brigade herüber, geführt von einem Capitaine, der nicht weiß, wo er hin soll. Du weißt es.';
    } else if(p.erfolg){
      gunstGeben('grandmaison',1);
      text = 'Die Meldung ist knapp, richtig und rechtzeitig. Verstärkung gibt es keine — es ist keine da. Aber oben weiß jetzt jemand, wie es hier steht, und das ist der eigentliche Zweck einer Meldung.';
    } else {
      gunstGeben('grandmaison',-1);
      text = 'Deine Meldung kommt an, und aus ihr geht nicht hervor, ob du Verstärkung brauchst oder Erlaubnis, zurückzugehen. Man schickt dir einen Adjutanten, der fragt, was du eigentlich willst.';
    }
  }
  /* ── Der Adler (ab Rang 11) ──
     **Wie viele Männer ist ein Gegenstand wert?** Das Spiel beantwortet die
     Frage nicht. Es rechnet nur mit: Der Adler vorn hebt die Haltung des
     ganzen Regiments — und er steht dann dort, wo geschossen wird. */
  else if(id==='adler'){
    const p = probe('autoritaet', 50);
    K.adlerVorn = true;
    if(p.erfolg){ K.kompanien.forEach(k=> k.haltung = Math.min(100, k.haltung + 20));
      schaden = 12;
      text = 'Der Adlerträger geht durch bis ins erste Glied und bleibt dort stehen. Zweitausend Mann sehen zwei Kilo Messing auf einer Stange, und zweitausend Mann gehen deshalb nicht zurück. Man kann darüber denken, was man will; es funktioniert.'
           + anerkennung(2,'Den Adler nach vorn geschickt'); }
    else { text = 'Der Adlerträger geht vor, und der Rest bleibt, wo er ist. Jetzt steht das teuerste Stück des Regiments allein zwanzig Schritt vor der Front.';
      S.adlerGefahr = true; }
  }

  /* ══════════════════ DER STAB (RANG 12 BIS 14) ══════════════════ */

  else if(id.startsWith('befehl')){
    /* **Ein Befehl wirkt nicht, er reist.** Zwischen dem Augenblick, in dem du
       ihn gibst, und dem, in dem er ausgeführt wird, liegen ein Reiter, drei
       Kilometer und die Möglichkeit, dass sich die Lage inzwischen geändert
       hat. Genau das ist der Rang. */
    const i = +id.slice(6); const v = K.verbaende[i];
    const lauf = 1 + Math.floor(Math.random()*2);
    v.befehl = {rest: lauf, art: 'vor'};
    K.befehle.push({verband:i, rest:lauf});
    text = `Der Befehl an die ${esc(v.name)} geht mit einem Ordonnanzoffizier ab. Er braucht ${lauf===1?'eine':'zwei'} ${lauf===1?zeitWort().toLowerCase():zeitWort(true).toLowerCase()} dorthin, falls er ankommt. Was du eben angeordnet hast, gilt für eine Lage, die es dann vielleicht nicht mehr gibt.`;
  }
  else if(id==='aufklaeren'){
    const p = probe('kartenkunde', 40);
    K.aufklaerung = (K.aufklaerung||0) + 1;
    if(p.erfolg){
      /* Aufklärung kauft keine Wahrheit, sondern **frischere** Meldungen —
         und einen kleineren Fehler darin. Mehr kann man nicht kaufen. */
      K.verbaende.forEach(v=>{ v.alter = 0; v.schweigt = false;
        v.gemeldet = Math.max(0, Math.min(100, v.bestand + (Math.random()*12-6))); });
      text = 'Zwei Schwadronen gehen vor und kommen wieder. Was sie bringen, ist eine Stunde alt statt vier, und die Zahlen darin sind fast richtig. Fast ist hier sehr viel.';
    } else {
      text = 'Die Patrouille kommt zurück und meldet, was sie gesehen hat. Was sie gesehen hat, ist eine Staubwolke. Eine Staubwolke ist entweder ein Korps oder ein Fuhrpark.';
    }
  }
  else if(id==='reserve'){
    K.reserveWeg = true;
    const p = probe('taktik', 45);
    if(p.erfolg){ schaden = 40 + Math.random()*20;
      text = 'Du schickst die Reserve, und du schickst sie an die Stelle, an der drüben nichts mehr steht. Es ist die einzige Entscheidung des Tages, deren Wirkung du selbst siehst — der Rauch dort drüben zieht in die falsche Richtung, nämlich nach hinten.'
           + anerkennung(3,'Die Reserve zur rechten Zeit'); }
    else { schaden = 12;
      text = 'Du schickst die Reserve, und sie kommt an einer Stelle an, an der vor zwei Stunden eine Lücke war. Jetzt steht dort eine Batterie. Ab diesem Augenblick hast du nichts mehr in der Hand.'; }
  }
  else if(id==='warten'){
    /* **Nichts tun ist ab Rang 12 eine Handlung.** Ein General, der jede Stunde
       etwas anordnet, führt keinen Feldzug, sondern stört seine Untergebenen.
       Der Knopf kostet Zeit und bringt Meldungen — und manchmal ist genau das
       die richtige Entscheidung. */
    schaden = 6;
    text = 'Du wartest. Es ist das Schwerste, was dieser Posten verlangt, und es sieht von außen aus wie Untätigkeit. Auf dem Tisch sammeln sich Zettel.';
  }

  else if(id==='zurueck'){
    S.ruf = Math.max(0, S.ruf-8); S.belastung=Math.min(100,S.belastung+10); S.gekniffen=true;
    kampfEnde(false, S.rang>=12
      ? 'Du brichst ab. Es ist die richtige Entscheidung, wenn die Meldungen stimmen, und niemand wird dir je sagen, ob sie stimmten.'
      : S.rang>=10
      ? 'Du nimmst das Bataillon zurück, in Ordnung, mit den Verwundeten. Es ist sauber gemacht und es ist trotzdem ein Rückzug.'
      : 'Du gehst zurück. Niemand hält dich auf, und das ist das Schlimmste daran.');
    return;
  }

  // Mündungsblitze zeichnet das Sichtfeld nur, wenn gerade gefeuert wurde —
  // zustandsgesteuert, nie gewürfelt (siehe die Regel unter `sichtfeld`).
  K.blitz = (id==='salve' || id==='sektionsalve');
  if(id!=='ducken') K.duckFolge = 0;
  if(id!=='bajonett') K.vorn = false;

  /* Die Linie kämpft auch ohne dich — aber gegen einen besseren Gegner weniger
     erfolgreich. Das ist der wirksamste der drei Güte-Hebel und der leiseste:
     Gegen Österreicher 1796 bricht der Feind von allein, gegen Dschesärs
     Garnison steht er, bis *du* etwas tust. Das Gefecht dauert dadurch länger,
     und weil Treffer je Runde kommen, kostet es mehr Blut — ohne dass eine
     einzige Schadenszahl angefasst wurde. Boden bei 30 %, sonst wären die
     späten Kapitel rechnerisch unmöglich (siehe „Warum so niedrig?"). */
  const guete = feindGuete(n);
  /* **Der gelöste Zug steht allein.** Das ist der Bruch von Rang 8, und er ist
     absichtlich einer: Wer die Linie verlässt, verliert den einzigen Beitrag,
     der ein Gefecht auch ohne ihn vorantreibt — und bekommt dafür sechzig
     Mann, die auf eigene Rechnung schießen (Faktor 1,6 auf allen eigenen
     Schaden). Ein guter Zug gewinnt damit schneller als je zuvor; ein
     schlechter bekommt nichts geschenkt. */
  /* `n.ueberfall`: **Die zweihundert anderen sind nicht da.** Ein Überfall auf
     einer spanischen Straße wird von dreißig Mann ausgefochten; es gibt keine
     Linie, die von allein mitschießt. Damit fällt die wichtigste Zeile des
     Kampfsystems weg, und der eigene Schaden steht zum zweiten Mal für sich
     allein — das erste Mal war der gelöste Zug ab Rang 8, und dort gab es
     dafür den Faktor 1,6. Hier gibt es ihn nicht: Ein Überfall ist kein
     Handel, sondern eine Lage. Ausgeglichen wird über kurze Runden und
     niedrige Feindmoral in den Daten. */
  let linie = (K.geloest || n.ueberfall) ? 0 : (2 + Math.random()*4) * Math.max(0.3, 1 - guete*0.15);
  if(K.geloest) schaden *= 1.6;
  /* Wer im Gelände liegt, trifft schlechter. Der Handel des Taktikers. */
  if(K.gelaendeVorteil > 0) schaden *= 0.8;
  /* **Der Schaden des Bataillons hängt an dem, was noch steht — nicht an dir.**
     Das ist die mechanische Fassung von „du siehst keine Gesichter mehr": Deine
     Probe entscheidet, *ob* der Befehl ankommt; wie viel er wert ist,
     entscheiden vier Rechtecke, an denen du nichts mehr ändern kannst. */
  if(K.kompanien){
    const kraft = K.kompanien.reduce((s,k)=> s + k.bestand*k.haltung/10000, 0) / K.kompanien.length;
    schaden *= Math.max(0.3, kraft*1.6);
  }

  /* **Rollendes Feuer wirkt auch in der Runde, in der du nichts tust.** Das ist
     der Sinn des Ranges und der einzige Ort, an dem Schaden ohne eigene
     Handlung entsteht: Ein Zug in drei Sektionen hört nicht auf zu schießen,
     nur weil sein Sergent-major gerade woanders hinsieht. Drei Runden lang,
     dann muss das Kommando erneuert werden — sonst wäre es kein Befehl, sondern
     ein Dauerzustand. Der Beitrag zählt **nicht** für die Sichtbarkeit: Gezählt
     wird, was aus dem Stand geschieht, und das hier tut der Zug, nicht du. */
  let rollend = 0;
  if(K.rollend > 0){
    rollend = (7 + Math.random()*5) * Math.max(0.35, (K.sektion||100)/100);
    K.rollend--;
  }
  /* Die zweite Hälfte des Sturms: Wer nicht sieht, trifft nicht — auch du
     nicht. Ohne diesen Abzug wäre der Schneesturm ein Vorteil, und ein
     Vorteil ist keine eigene Regel (siehe den Gefahr-Abzug oben). */
  if(n.sturm){ schaden *= 0.8; linie *= 0.8; }
  K.feindMoral -= schaden + linie + rollend;

  /* ══════════════════ DIE TATENZÄHLUNG ══════════════════

     **Die Sichtbarkeitsregel ist der Zahn des ganzen Ordenssystems:**
     *Gezählt wird nur, was aus dem Stand geschieht.* Wer kniet oder liegt,
     dessen Serie reißt und dessen Schaden zählt halb.

     Historisch ist das exakt — im Pulverdampf sieht niemand, wer gut zielt;
     gesehen wird, wer steht, wo geschossen wird. Mechanisch ist es die Bremse,
     ohne die das System kaputt wäre: **Man kann keine Auszeichnung aus der
     Deckung heraus erschießen.** Auszeichnungsjagd und Überleben ziehen damit
     an entgegengesetzten Enden desselben Seils — dieselbe Achse, auf der die
     Gefechts-Ereignisse gebaut sind (vorsichtig überlebt, mutig steigt auf).

     Gezählt wird der **Schaden an der Feindmoral**, nicht Tote: Niemand zählt
     1796 im Rauch Gefallene, aber jeder sieht, wessen Abschnitt der Linie
     wankt. Der Beitrag der Linie (`linie`) zählt nicht mit — das ist nicht
     deine Tat. */
  const z = K.zaehlung;
  if(schaden > 0){
    z.schaden += K.deckung ? schaden*0.5 : schaden;
    if(K.deckung){ z.serie = 0; z.gedeckt++; }
    else { z.serie++; z.bestSerie = Math.max(z.bestSerie, z.serie); z.offen++; }
  } else if(!K.deckung && id!=='laden') { z.serie = 0; }
  if(K.vorn) z.vorn = true;

  /* Und sie verliert dabei Männer. Das ist reine Anzeige — an `eigen` hängt
     keine Probe und keine Gefahr, es macht nur sichtbar, was der Text sagt:
     Drüben wird auch geschossen. Je mehr Widerstand noch steht, desto teurer,
     und gegen einen besseren Gegner teurer als gegen einen schlechten. */
  const geschlossen = K.geschlossen > 0;
  K.eigen = Math.max(0, K.eigen - (2 + Math.random()*3) * (1 + guete*0.15)
    * Math.max(0, K.feindMoral/n.feindMoral) * (geschlossen?0.5:1));
  /* Deine zwanzig Mann verlieren dieselben Anteile wie die Linie — aber du
     musst sie hinterher verantworten. Eine gut ausgesuchte und gedrillte
     Sektion (`S.sektionGuete` aus dem Lager) hält länger. */
  if(S.rang>=5 && K.sektion != null){
    const guete2 = 1 - Math.min(0.4, (S.sektionGuete||0)/100);
    K.sektion = Math.max(0, K.sektion - (2 + Math.random()*3) * (1 + guete*0.15) * guete2
      * Math.max(0, K.feindMoral/n.feindMoral) * (geschlossen?0.5:1));
    /* Der gezogene Degen hält den Zug zusammen — nicht heil, aber beisammen.
       Der Boden bei 30 ist die Zusage des Knopfes und zugleich seine Grenze:
       Er verhindert den Zusammenbruch, nicht die Verluste. */
    if(K.zugHaelt) K.sektion = Math.max(30, K.sektion);
  }
  if(K.gelaendeVorteil > 0) K.gelaendeVorteil--;

  /* ── Die vier Kompanien bluten, und die vorderste blutet am meisten ──
     Das ist der ganze mechanische Gehalt der Rechnung: Wer vorgeht, zahlt.
     Die Haltung sinkt schneller als der Bestand, weil ein Bataillon nicht
     aufhört, wenn es Männer verliert, sondern wenn es aufhört zu glauben. */
  if(K.kompanien){
    const druck = Math.max(0, K.feindMoral/n.feindMoral) * (1 + feindGuete(n)*0.15);
    K.kompanien.forEach((k,i)=>{
      const vorn = (i === K.vorhut);
      k.bestand = Math.max(0, k.bestand - (vorn ? 5+Math.random()*5 : 1+Math.random()*2) * druck);
      k.haltung = Math.max(0, k.haltung - (vorn ? 6+Math.random()*5 : 2+Math.random()*2) * druck);
      /* Eine Kompanie, deren Haltung fällt, geht von allein zurück — dann
         steht der Abschnitt offen, und das kostet den Rest. */
      if(k.haltung <= 0 && vorn){ K.vorhut = null; k.vorn = false;
        K.protokoll.push(k.name + ' geht zurück. Niemand hat es befohlen.'); }
    });
  }

  /* ── Befehle reisen, Meldungen altern ──
     Die zwei Zeilen, an denen der vierte Bruch hängt. Ein Befehl wirkt, wenn
     er ankommt, nicht wenn er gegeben wird; und was auf deinem Tisch liegt,
     wird mit jeder Stunde eine Stunde falscher. */
  if(K.verbaende){
    K.befehle = (K.befehle||[]).filter(b=>{
      if(--b.rest > 0) return true;
      const v = K.verbaende[b.verband];
      if(!v) return false;
      v.befehl = null;
      /* Der Verband tut, was befohlen war — gegen die Lage von jetzt, nicht
         gegen die von damals. Ob das passt, entscheidet der Zufall, den man
         mit besserer Aufklärung kleiner macht, aber nie beseitigt. */
      const passt = Math.random() < 0.55 + (K.aufklaerung||0)*0.12;
      K.feindMoral -= passt ? (16 + Math.random()*14) : (3 + Math.random()*4);
      v.bestand = Math.max(0, v.bestand - (passt ? 6+Math.random()*6 : 12+Math.random()*10));
      K.meldungen.push({text: v.name + (passt
        ? ' meldet den Auftrag ausgeführt.'
        : ' meldet, sie sei auf Widerstand gestoßen, den die Order nicht vorgesehen hat.'),
        alter: 0});
      return false;
    });
    K.verbaende.forEach(v=>{
      v.bestand = Math.max(0, v.bestand - (1+Math.random()*2) * Math.max(0, K.feindMoral/n.feindMoral));
      v.alter++;
      /* Ein Verband, der nicht antwortet, ist entweder vernichtet oder
         unterwegs, und du hast keine Möglichkeit, das herauszufinden. */
      if(v.alter >= 3 && Math.random() < 0.3) v.schweigt = true;
      if(!v.schweigt && Math.random() < 0.35){
        v.alter = 1;
        v.gemeldet = Math.max(0, Math.min(100, v.bestand + (Math.random()*24-12)));
      }
    });
    (K.meldungen||[]).forEach(m=> m.alter++);
    if(K.meldungen.length > 6) K.meldungen = K.meldungen.slice(-6);
  }
  if(geschlossen) K.geschlossen--;

  K.protokoll.push(text);

  // Feindliche Wirkung
  atemKlemmen();
  let gefahr = n.gefahr + gefahrMod + (K.gefahrPlus||0);
  if(K.deckung && id!=='ducken' && id!=='deckung') K.deckung=false;
  if(S.belastung>60) gefahr += 6;
  if(S.atem<30) gefahr += 5;
  /* Der Platz des Toten. Ein Caporal steht außen am Glied — dort, wo sein
     Vorgänger stand, und die Stelle wurde frei, weil er fiel (Invariante 5,
     von der anderen Seite gesehen). Das wird nie ausgesprochen, nur gespürt.
     Historisch fielen Unteroffiziere überproportional; im Entwurf ist das der
     Preis des Rangs, nicht seine Macht — Invariante 4 bleibt gewahrt, weil
     der Rang weiterhin Knöpfe gibt und hier nur Deckung kostet. */
  /* **Die gefährlichsten Ränge des Spiels sind 7 bis 9, nicht 1** (RANGLEITER
     §8). Epauletten, Degen und drei Schritte vor der Front machen einen
     Offizier auf dreihundert Schritt kenntlich, und beide Seiten schossen
     gezielt auf ihn; ab dem Capitaine sammelt sich die Kompanie zusätzlich um
     ihn. Wer aufsteigt, kauft sich nicht in Sicherheit ein. */
  /* ── Und ab Rang 10 ändert die Gefahr ihre Form ──
     Der Zuschlag je Runde fällt weg; du stehst nicht mehr im Feuer. An seiner
     Stelle steht **ein Stabsereignis je Gefecht mit rund 8 %** — ein
     Streuschuss, ein stürzendes Pferd, ein Splitter beim Kartenlesen. Selten,
     ohne Vorwarnung, und **man kann sich nicht hinwerfen.**

     Ein Bataillonschef ist statistisch sicherer als ein Caporal und stirbt
     trotzdem, nur eben ohne die Möglichkeit, etwas dagegen zu tun. Das ist
     nicht dieselbe Gefahr in kleiner, sondern eine andere Art von Gefahr, und
     sie passt zu einem Rang, dessen ganzes Wesen darin besteht, dass man nicht
     mehr selbst handelt. */
  if(S.rang>=10) gefahr = 0;
  else if(S.rang>=9) gefahr += 5;
  else if(S.rang>=7) gefahr += 4;
  else if(S.rang>=3) gefahr += 2;
  /* ── Der Preis des Patents, dritter Teil ──
     **Ein gekaufter Offizier steht falsch, und er steht zu lange falsch.** Er
     hat zehn Jahre nicht im Glied gestanden und weiß deshalb nicht, was ein
     Mann weiß, der es getan hat: wann man sich duckt, wo eine Batterie
     hinschießt, wie lange eine Salve braucht. **+2 auf die Gefahr**, zusätzlich
     zu dem, was der Rang ohnehin kostet.

     **Die 2 ist gemessen, nicht geschätzt** — und zwar am Hebel, nicht am
     Ergebnis: +4 lieferte 0 % Überlebende bei 40 Läufen, +0 lieferte 25 %.
     Der Zuschlag allein trug also den ganzen Unterschied, und die Hälfte davon
     ist der Preis, den der Kauf verträgt.

     **Die erste Fassung war ein Güte-Zuschlag von +8 in den Kapiteln 1–4, und
     der hat den Kauf umgebracht: 40 von 40 Läufen starben in Italien**, weil
     `guete` nicht nur die Gefahr hebt, sondern auch die Hilfe der Linie
     schrumpfen lässt — und die ist der Grund, warum ein Gefecht überhaupt
     gewinnbar ist. Bei Güte 8 steht dieser Hebel am Boden (0,3), also endete
     kein Gefecht mehr mit einem Sieg, und jedes verlorene kostet Blut.

     Ein Gefahr-Zuschlag trifft nur den Mann, nicht die Gewinnbarkeit. Das ist
     auch inhaltlich das Richtige: **Der Feind wird nicht besser, weil du ein
     Patent gekauft hast. Du bist schlechter.** */
  if(S.patent) gefahr += 2;
  /* Wer im Gelände liegt, wird schlechter getroffen — drei Runden lang. */
  if(K.gelaendeVorteil > 0) gefahr -= 12;
  /* Ein Höhepunkt ist nicht nur teurer, sondern auch dichter: +3 Trefferchance
     je Runde. Das ist der Teil, der auch den Vorsichtigen trifft — beschossen
     wird man, ob man vortritt oder nicht. `haerte` schaltet beides zusammen,
     damit ein Gefecht mit einem einzigen Feld zum Höhepunkt wird. */
  if(n.haerte > 1) gefahr += 3;
  gefahr += feindGuete(n);      // bessere Truppen treffen öfter
  /* ── Der Sturm senkt die Trefferchance beider Seiten ──
     Bei Eylau schneite es waagerecht, und beide Armeen verloren einander. Wer
     nicht sieht, trifft nicht — das gilt für die drüben und für dich, und
     deshalb steht der Abzug hier (Gefahr) *und* unten beim eigenen Schaden.
     **Ein Sturm, der nur den Feind blind macht, wäre ein Geschenk**, und ein
     Geschenk ist keine eigene Regel. */
  if(n.sturm) gefahr -= 4;
  gefahr = S.rang>=10 ? 0 : Math.max(4, gefahr);
  let treffer = '';
  /* Das Stabsereignis: einmal je Gefecht gewürfelt, ohne Ankündigung und ohne
     Gegenmittel. Es kostet mehr als ein gewöhnlicher Treffer, weil es keinen
     zweiten gibt — und weil ein Mann, der nicht damit rechnet, ungeschützt
     steht. Der Text nennt nie eine Kugel, die auf dich gezielt hat. */
  if(S.rang>=10 && !K.stabsereignis && !n.uebung && Math.random() < 0.08){
    K.stabsereignis = true;
    const arten = [
      ['Eine verirrte Kugel — niemand hat auf dich gezielt, dafür bist du zu weit weg — geht durch den Oberschenkel, während du auf die Karte siehst.', 'Streifschuss am Oberschenkel', 8],
      ['Das Pferd geht unter dir zu Boden, ohne dass du gehört hättest, was es getroffen hat. Du liegst darunter, bis zwei Adjutanten es hochbekommen.', 'Sturz mit dem Pferd', 12],
      ['Eine Granate schlägt vierzig Schritt entfernt ein. Ein Splitter, groß wie ein Daumennagel, geht durch die Kartentasche und danach in die Seite.', 'Splitter in der Seite', 14]
    ];
    const e = arten[Math.floor(Math.random()*arten.length)];
    const schaden = 16 + Math.floor(Math.random()*16);
    S.leben -= schaden; S.wunden.push({name:e[1], abzug:e[2]});
    atemKlemmen();
    treffer = ` <b>${esc(e[0])}</b> <span class="fein">Leben −${schaden} · „${esc(e[1])}"</span>`;
    if(S.leben <= 0){
      gefallen(text + treffer, 'Gefallen bei ' + (n.datum||'').split(' · ')[1]);
      return;
    }
  }
  if(Math.random()*100 < gefahr){
    /* Ein Treffer tötet nicht mehr durch einen eigenen Wurf, sondern zehrt an
       den Lebenspunkten. Der Unterschied ist der ganze Sinn des Umbaus:

       Vorher senkte Konstitution die Todeschance je Treffer — und ab
       Konstitution 58 war sie rechnerisch null (Schwelle 94 + 18/3 > 100). Ein
       Mann, den keine Kugel töten kann, hebelt Invariante 1 aus. Eine Klammer
       auf den Schutz hat das notdürftig geflickt, aber die Kurve blieb falsch:
       Konstitution kaufte Unverwundbarkeit, nicht Zähigkeit.

       Jetzt ist sie monoton. `lebenMax()` wächst mit der Konstitution
       (52 bei 20 · 64 bei 40 · 82 bei 70), der Schaden je Treffer nicht — mehr
       Konstitution heißt also mehr Treffer, die man wegsteckt, aber genug
       Treffer töten jeden. Deshalb darf die Herkunft auch über 70 gehen.

       Geeicht an einer gemessenen Zahl: Ein Mann wird in beiden Feldzügen
       zusammen nur **rund neun Mal** getroffen — 10 Gefechte, 57 Kampfrunden,
       etwa 16 % Trefferchance je Runde. Ein Vorrat, den neun Treffer nicht
       leeren, tötet niemanden; die erste Eichung auf 6 Schaden je Treffer
       ergab gemessen **100 % Überlebende**. Deshalb ist ein Treffer teuer:
       im Mittel 11 Punkte, also stirbt ein Mann mit Konstitution 40 am
       sechsten, einer mit 20 am fünften, einer mit 70 am achten. Das ist auch
       inhaltlich richtig — wer 1796 vier Mal getroffen wird, steht nicht mehr. */
    /* Höhepunkte schlagen härter (`haerte` in den Kapiteldaten): ein bis zwei
       Gefechte je Feldzug, an denen ein Treffer 40 % mehr kostet. Es sind
       dieselben vier, die eine Sondermission tragen — Lodi, Arcole, Embabeh,
       Akkon —, und das ist kein Zufall, sondern der Entwurf: Das Gefecht, für
       das man berühmt wird, ist das, an dem man stirbt. Die Lehrgefechte
       (Montenotte, Alexandria) bleiben Lehrgefechte. Angesagt wird es im
       Lagebild vor dem Anmarsch — überrascht wird niemand. */
    /* ── Übungsgefecht (Kapitel 3) ──
       Das große Manöver von Boulogne benutzt das volle Kampfsystem — Sichtfeld,
       Salven, für den Sergenten die Sektion —, aber es wird mit Platzpatronen
       geschossen. **Dasselbe Spiel, andere Währung:** Der Einsatz ist nicht
       Blut, sondern Sichtbarkeit, denn der Stab sieht zu.

       Ein „Treffer" ist hier ein Unfall — ein Rohrkrepierer, ein Ladestock im
       Gesicht, ein durchgehendes Pferd —, und die gab es reichlich. Er kostet
       ein paar Punkte und Atem, tötet aber nie: Die Klemme bei 1 ist dieselbe
       Regel wie bei den Szenen. Der Tod gehört dorthin, wo scharf geschossen
       wird. */
    if(n.uebung){
      const schaden = 2 + Math.floor(Math.random()*4);        // 2–5
      S.leben = Math.max(1, S.leben - schaden);
      S.atem = Math.max(0, S.atem - 6);
      treffer = ' Der Ladestock des Nebenmanns erwischt dich am Ohr, weil er ihn im Eifer nicht herausgezogen hat. Es blutet, es ist lächerlich, und der Schiedsrichter notiert dich als gefallen — für zwei Runden.';
      K.protokoll.push('Ein Unfall im Manöver.');
      atemKlemmen();
    } else {
    const haerte = n.haerte || 1;
    let schaden;
    if(Math.random()*100 > 75){
      schaden = 15 + Math.floor(Math.random()*11);            // 15–25
      wundeGeben('Schwere Wunde ('+n.datum.split(' · ')[1]+')', 14);
      treffer = ' Ein Schlag gegen die Schulter, dann Nässe im Ärmel. Du kannst den Arm noch bewegen, aber es tut sehr weh.';
      S.atem = Math.max(0,S.atem-20);
    } else {
      /* Der Streifschuss kostet zweierlei, und das ist Absicht: Blut (bleibt)
         und eine Wunde, die der Feldscher nach dem Gefecht zunäht (bleibt
         nicht). Ohne die Wunde stimmte zwar die Todesrechnung, aber ein Mann
         schoss den ganzen Feldzug lang wie am ersten Tag — gemessen stieg der
         Caporal-Anteil von 40 % auf 57 %, weil bessere Gefechte mehr Ruf
         bringen und Ruf die Beförderungsschwelle ist. Der Kratzer soll den
         Rest des Gefechts wehtun, nicht den Rest des Krieges. */
      schaden = 5 + Math.floor(Math.random()*7);              // 5–11
      wundeGeben('Streifschuss', 5);
      treffer = ' Etwas reißt dir den Ärmel auf und brennt. Nicht schlimm. Noch nicht.';
      S.atem = Math.max(0,S.atem-8);
    }
    schaden = Math.round(schaden * haerte);
    S.leben = Math.max(0, S.leben - schaden);
    K.protokoll.push('Du wirst getroffen.');
    if(S.leben <= 0){
      gefallen(text + treffer + ' Du willst dich abstützen und findest den Boden nicht, wo er sein müsste. Jemand ruft deinen Namen, weit weg.',
               'Gefallen bei '+n.datum.split(' · ')[1]);
      return;
    }
    if(S.leben <= lebenMax()*0.3) treffer += ' Du bist noch auf den Beinen, aber nicht mehr lange.';
    atemKlemmen();
    }
  }

  if(K.feindMoral <= 0){ kampfEnde(true, text+treffer); return; }
  K.runde++;
  if(K.runde > n.runden){
    const knapp = K.feindMoral < n.feindMoral*0.35;
    kampfEnde(knapp, text+treffer+(knapp?' Und dann ist es plötzlich vorbei.':' Es wird dunkel, und nichts ist entschieden.'));
    return;
  }

  /* Der Einbruch wird angesagt, nicht gewürfelt und dann verschwiegen: Wenn
     die Linie bricht, steht der Grund im selben Absatz wie die Runde. Danach
     zählen die Runden herunter, und wenn sie abgelaufen sind, steht der Zug
     wieder da, wo ein Zug steht. */
  if(K.nahkampf > 0){ K.nahkampf--;
    if(K.nahkampf === 0) treffer += ' <span class="fein">Es wird wieder ruhiger. Zwei Sergenten sammeln, was noch steht, und du bist wieder der, der etwas befiehlt.</span>'; }
  else {
    const einbruch = nahkampfPruefen(n);
    if(einbruch) treffer += ' <b>'+einbruch+'</b>';
  }

  /* Ereignis vor der nächsten Runde: Es unterbricht die Handgriffe mit einer
     Frage. Der Text der eben abgeschlossenen Runde steht dabei nicht mehr da —
     er kommt ins Protokoll, damit die Frage die Seite für sich hat. */
  const e = K.nahkampf>0 ? null : ereignisWuerfeln(n);
  if(e){
    K.ereignis = e.id; K.ereignisZahl++; K.gesehen.push(e.id);
    K.protokoll.push(text + treffer);
    laufSichern();
    zeigeEreignis(e);
    return;
  }

  laufSichern();
  zeigeKampf(text + treffer);
}

/* ══════════════════ WER ÜBER DIR STIRBT ══════════════════

   Ein Höhepunkt tötet nicht nur dich. Nach jedem Höhepunktgefecht (`haerte`)
   kann einer aus der Kette fallen — und dann ist der halbe aufgebaute Einfluss
   weg (KONZEPT §7). Das ist der Preis dafür, dass man vier Gesichter eine ganze
   Laufbahn lang behält: Wer nur eine Beziehung pflegt, verliert alles auf
   einmal.

   **Der Sergent-major ist der Sonderfall.** Er steht nicht in der Kette — man
   sieht ihn nur zweimal am Rand —, und er fällt *gezielt*, sobald der Spieler
   die Sergent-Hürden erreicht hat (`S.majorFaellt`). Damit die Naht unsichtbar
   bleibt, geschieht das nicht auf dem Bildschirm, auf dem die Zahlen stimmen,
   sondern **im nächsten Gefecht**. Danach rückt Martel auf seinen Posten, und
   Martels Stelle ist die, die du bekommst. Invariante 5 bleibt: Am Anfang der
   Kette steht weiterhin ein Toter. */

const MAJOR = 'Sergent-major Lascaux';

/* Grandmaison tritt erst ab Rang 9 in Erscheinung — und was er mitbringt, hat
   sich 1796 entschieden. Wird einmal je Lauf gerufen, sobald der Rang reicht. */
function grandmaisonAuftritt(){
  if(!S || !S.leute || !S.leute.grandmaison) return null;
  if(S.rang < 9 || S.grandmaisonBekannt) return null;
  S.grandmaisonBekannt = true;
  if(S.arcoleMarke){
    S.leute.grandmaison.gunst = Math.max(S.leute.grandmaison.gunst, 2);
    return `<div class="wirkung"><span>${esc(personName('grandmaison'))}</span>
      Er sieht dich zweimal an, bevor er etwas sagt. „Arcole", sagt er dann. Keine Frage, keine Erklärung.
      Zwölf Jahre, und er hat den Namen nicht vergessen — weil er damals im selben Wasser lag.
      <b>Fürsprache ${esc(personKurz('grandmaison'))} +2</b></div>`;
  }
  return `<div class="wirkung"><span>${esc(personName('grandmaison'))}</span>
    Er nimmt deine Meldung entgegen, nickt und wendet sich ab. Er hat heute vierzig Meldungen entgegengenommen.
    <b>Er kennt deinen Namen aus einer Liste und sonst nirgendwoher.</b></div>`;
}

function ketteImGefecht(n){
  if(!S.leute) return '';
  let meldung = '';

  /* ── Die angesagte Vakanz, für jeden Rang der Leiter ──
     Qualifiziert heißt: Der Patron hat dich vorgeschlagen, und jetzt muss die
     Stelle frei werden. **Wer fällt, steht am LEITER-Eintrag**, nicht an der
     Schlacht — deshalb funktioniert dasselbe in Italien wie in Russland.

     Zwei Formen, und der Unterschied ist der ganze Ton: Entweder fällt ein
     Namenloser am Rand (`faelltWer`), und ein Mann der Kette rückt in seine
     Stelle nach (`rueckt`) — dann ist *dessen* alte Stelle die deine. Oder es
     fällt einer aus der Kette selbst; dann steht der Nachruf da, und die
     Rechnung stellt der Spieler auf. Das Spiel spricht sie nie aus. */
  for(const z of LEITER){
    if(!z.vakanz) continue;
    const v = vakanzStand(z.vakanz);
    if(!v.faellt || v.tot) continue;
    v.faellt = false; v.tot = true;

    if(z.faelltKette){                         // einer aus der Kette fällt
      const m = S.leute[z.faelltKette];
      if(m && m.lebt){
        meldung += personFaellt(z.faelltKette);
        meldung += `<div class="wirkung"><span>${esc(z.stelle||'Die Stelle')}</span>
          ${z.frei || 'Sie ist seit heute Morgen nicht besetzt.'} <b>Damit ist sie frei.</b></div>`;
      }
      continue;
    }

    const auf = z.rueckt ? S.leute[z.rueckt] : null;
    const kannAuf = auf && auf.lebt &&
      auf.stufe < ((LEUTE.find(l=>l.id===z.rueckt)||{stufen:[]}).stufen.length - 1);
    if(kannAuf){
      auf.stufe++;
      meldung += `<div class="wirkung"><span>${esc(z.faelltWer)} ist gefallen</span>
        ${z.fallText || 'Vier Mann tragen ihn zurück und legen ihn zu den anderen.'}
        Am Abend rückt ${esc(personKurz(z.rueckt))} auf seine Stelle.
        <b>Damit ist die Stelle darunter frei.</b></div>`;
    } else {
      meldung += `<div class="wirkung"><span>${esc(z.faelltWer)} ist gefallen</span>
        ${z.fallText || 'Vier Mann tragen ihn zurück und legen ihn zu den anderen.'}
        <b>Die Stelle ist frei.</b></div>`;
    }
  }

  /* Der ungeplante Tod. Nur in Höhepunktgefechten, höchstens einer, und nie
     der, den man gerade als Fürsprecher braucht — sonst wäre es keine
     Gefahr mehr, sondern eine Sperre. */
  if((n.haerte||1) > 1 && Math.random() < 0.22){
    const lebende = LEUTE.filter(l => S.leute[l.id] && S.leute[l.id].lebt);
    if(lebende.length > 1){
      const opfer = lebende[Math.floor(Math.random()*lebende.length)];
      meldung += personFaellt(opfer.id);
    }
  }
  return meldung;
}

/* Einer fällt, ein Nachfolger übernimmt den Posten — mit Gunst 0. Der Text
   dazu steht in `LAUF.nachfolger` und wird an der nächsten Station gezeigt,
   nicht hier: Ein Todesfall ist keine Fußnote unter einem Gefechtsergebnis. */
function personFaellt(id){
  const p = S.leute[id]; if(!p || !p.lebt) return '';
  const altName = personName(id);
  const liste = NACHFOLGER[id] || [];
  const nf = liste[Math.floor(Math.random()*liste.length)];
  p.lebt = false;
  LAUF.nachfolger = {id, alt:altName, kurz: nf?nf.kurz:'', satz: nf?nf.satz:''};
  return `<div class="wirkung"><span>${esc(altName)} ist gefallen</span>
    Was er für dich hätte sagen können, sagt jetzt niemand mehr. <b>Fürsprache verloren</b></div>`;
}

/* Der Nachfolger tritt an, sobald die Kompanie wieder steht. Gunst 0 — er
   kennt dich nicht, und du fängst bei ihm von vorn an. */
function nachfolgerAntreten(){
  const nf = LAUF.nachfolger; if(!nf) return;
  const p = S.leute[nf.id];
  if(p){ p.lebt = true; p.gunst = 0; if(nf.kurz) p.kurz = nf.kurz; }
  LAUF.nachfolger = null;
  laufSichern();
}

/* ── Der Tod im Gefecht ──
   **Ein Toter durchläuft keinen Stationsabschluss.** Vorher lief jeder
   Treffertod über `kampfEnde()`, und das ist der Abschluss einer *bestandenen*
   Station: Der Gefallene bekam noch die Niederlagen-Wirkung (Ruf −4 bis −6,
   was über `5·floor(ruf/10)` echte Veteranenpunkte kostete), der Feldscher
   nähte ihm eine Wunde zu, `stationErledigt()` heilte ihn um 5 % (er stand
   danach mit „Leben 4 von 64" im Chronikblatt), zählte die **nächste** Station
   als erreicht (+2 VP, die der Rückzugstod nicht bekam) und schrieb sogar noch
   einen Spielstand des Toten, weil `S.lebt` erst eine Anweisung später falsch
   wurde. Dass der Rückzugstod all das nicht tat, war der Beweis, dass es ein
   Versehen war und keine Absicht.

   Jetzt endet ein Gefechtstod hier und nirgends sonst: Kampfzustand weg,
   `toetlich()` (löscht den Spielstand im selben Augenblick, Invariante 1),
   dann der Todesbildschirm — mit dem letzten Absatz und den Taten dieses
   Gefechts, die vorher niemand zu sehen bekam. */
function gefallen(letzterText, todesart){
  const kk = K;
  setzeKampf(null);
  toetlich(todesart);
  zeigeTod(letzterText, kk);
}

function kampfEnde(sieg, letzterText){
  const n = KAPITEL[LAUF.node];
  /* **Eine Kopie, keine Referenz.** `n.sieg` und `n.niederlage` sind
     Kapiteldaten und leben so lange wie die Seite; wer sie hier ändert (etwa
     für `ueberfall`), ändert sie für jeden weiteren Lauf im selben
     Browserfenster mit. Das wäre die Sorte Fehler, die man erst nach dreißig
     Messläufen bemerkt. */
  const erg = Object.assign({}, sieg ? n.sieg : n.niederlage);

  /* Der Rückzug kostet Blut — je mehr vom Feind noch steht, desto mehr.
     Ohne diese Zeilen war Verlieren gratis: Wer unter 40 % Leben fiel, kniete
     sich hin (−22 Gefahr, Rest ~4 %), ließ die Runden auslaufen und schlief
     sich im Lager wieder hoch. Gemessen: null Tote in 80 Läufen, mutig wie
     vorsichtig. Ein Gefecht, das man nicht gewinnt, muss man verlassen — und
     eine Linie, die rückwärts durchs Feuer geht, lässt Männer liegen. Das ist
     auch die historische Wahrheit: Gefallen wird beim Weichen, nicht im Stehen.
     5–18 Leben je nach Restwiderstand; wen es unter null drückt, der stirbt
     auf dem Rückzug. Damit ist Aussitzen keine Antwort mehr, sondern eine
     Wette darauf, dass die eigene Seite auch ohne dich gewinnt.

     **Und der Zoll wächst mit der Güte des Gegners (28.07.2026).** Das ist die
     Stelle, an der die Progression wirklich beißt, und sie wurde gemessen
     gefunden: Ein Erstlauf-Mann in Ägypten *stirbt* nicht an der höheren
     Gefahr — er kniet sich hin, lässt die Runden auslaufen und **verliert**.
     Bei Güte 5 verlor er reihenweise und überlebte trotzdem 98 %. Wer vor
     Dschesärs Garnison zurückweicht, kommt aber nicht so davon wie vor
     Beaulieus Kolonnen: Die verfolgen. Faktor `1 + guete·0,2`, in Ägypten
     also das Doppelte — 10 bis 36 Leben je verlorenem Gefecht.

     **Das trifft genau den Richtigen.** Ein Veteran gewinnt seine Gefechte und
     zahlt den Zoll nie; ein Rekrut mit Muskete 10 verliert sie und zahlt ihn
     fünfmal. Der Unterschied zwischen erstem und drittem Lauf ist damit nicht
     mehr „etwas mehr Leben", sondern „gewinnen oder nicht". */
  /* ── `ueberfall:true` · Zurückweichen kostet keinen Ruf ──
     **Es gibt keine Zeugen.** Ein Überfall auf einer Straße in Aragón wird von
     dreißig Mann ausgefochten und von niemandem beobachtet; was im Bericht
     steht, schreibt derselbe, der weggegangen ist. Deshalb fällt hier die
     Ruf-Strafe der Niederlage weg — nicht der Blutzoll, denn eine Kolonne, die
     rückwärts aus einem Hohlweg geht, lässt trotzdem Männer liegen.

     Der zweite Teil des Schalters steht bei der Linie: Es gibt keine
     zweihundert anderen, die von allein mitschießen. */
  if(n.ueberfall && !sieg && erg && erg.ruf < 0) erg.ruf = 0;
  if(!sieg && S.lebt && S.leben > 0){
    const rest = Math.max(0, Math.min(1, K.feindMoral / n.feindMoral));
    /* ── Beim Überfall gibt es keinen Güte-Faktor auf den Rückzugszoll ──
       **Der Faktor existiert, weil manche Gegner verfolgen** — Dschesärs
       Garnison tut es, Beaulieus geschlagene Kolonnen nicht. Guerrilleros in
       den Hügeln verfolgen keine Kompanie über offenes Land; sie lösen sich
       auf. Genau das sagt der Gefechtstext selbst: „Nach vier Stunden hört es
       auf, weil sie weggehen, nicht weil ihr sie vertrieben hättet."

       **Gemessen war es die Wand des Kapitels.** Ein Überfall hat keine Linie,
       die von allein mitschießt; der eigene Schaden muss die volle Feindmoral
       tragen, also endet er meistens als Niederlage. Mit dem Faktor 2,6 bei
       Güte 8 kostete jede dieser Niederlagen dreißig bis vierzig Lebenspunkte,
       zweimal im Kapitel, zusätzlich zu drei gewöhnlichen Gefechten. Spanien
       tötete dadurch 64 bis 77 % derer, die es erreichten — mehr als jedes
       andere Kapitel, Ägypten eingeschlossen.

       **Der Zoll selbst bleibt.** Eine Kolonne, die rückwärts aus einem
       Hohlweg geht, lässt Männer liegen; nur wird sie nicht auch noch
       eingeholt. */
    const verfolgt = n.ueberfall ? 1 : (1 + feindGuete(n)*0.2);
    K.rueckzug = Math.round((5 + 13*rest) * verfolgt);
    S.leben = Math.max(0, S.leben - K.rueckzug);
    if(S.leben <= 0){
      gefallen(letzterText + ' Ihr geht rückwärts aus dem Feuer, und das Feuer geht mit. Dich trägt niemand.',
               'Gefallen auf dem Rückzug bei '+n.datum.split(' · ')[1]);
      return;
    }
  }
  anwenden(erg);
  verschleiss(0.9);
  /* Der Feldscher näht die leichteste Wunde zu — in der Regel den Streifschuss
     des letzten Gefechts. Lebenspunkte gibt er nicht zurück.

     Das ist dieselbe Regel wie beim Atem, und aus demselben Grund: Eine
     Erholung an jeder Station verschenkt genau das, was die Lager knapp machen
     soll. Gemessen mit einem Viertel je Gefecht überlebten **alle sechzig**
     Läufe beide Feldzüge — bei rund neun Treffern im ganzen Spiel wiegt jede
     geschenkte Genesung schwerer als der Schaden. Wer wieder auf die Beine
     will, verbringt einen Lagerabend oder eine Winterwoche damit. */
  // Krankheiten kann er nicht: eine Ruhr näht man nicht zu (`!w.zehrt`)
  const leicht = S.wunden.findIndex(w=>w.abzug<=8 && !w.zehrt);
  if(leicht>=0){ S.wunden.splice(leicht,1); atemKlemmen(); }   // der Vorrat wächst wieder
  if(sieg && n.ruhm && S.ruf>=20 && Math.random()<0.6){ S.nennungen++; }

  /* ══════════════════ DIE LEITER DER SICHTBARKEIT ══════════════════

     Napoleons Armee hatte keine gestuften Tapferkeitsmedaillen — sie hatte
     etwas Besseres: **eine Leiter der Sichtbarkeit.** Wer etwas tat, wurde
     gemeldet, und die einzige Frage war, wie weit nach oben die Meldung stieg.
     Das ist die historische Entsprechung von Bronze, Silber und Gold:

       1 · Lob vor der Front      — der Capitaine, am Abend des Gefechts
       2 · Nennung im Tagesbefehl — der Divisionsstab
       3 · Meldung an den Oberbefehl / ab 1805 **das Bulletin der Großen Armee**

     Der Name der dritten Stufe schaltet mit der Epoche um, wie die Kokarde zum
     Adler wird: Das Bulletin gab es erst ab 1805, gemeldet wurde vorher auch.

     **Nur die höchste Stufe je Gefecht zählt.** Stapeln wäre Grinding, und
     Invariante 2 verbietet es.

     **Die Bronzestufe gibt bewusst keinen Ruf.** Die teuerste gelernte Regel
     des Projekts lautet: Alles, was den Ruf hebt, hebt über die Schwellen auch
     den Aufstieg. Ruf +2 je gutem Gefecht wären über einen Lauf rund +30 — die
     Sergent-Quote würde durch die Decke gehen. Bronze zahlt deshalb in
     Kameradschaft und in die *Zählung*: Belobigungen sind die Währung, aus der
     später Ordensbedingungen erfüllt werden. */
  const z = K.zaehlung || {schaden:0, ereignisse:0, vorn:false, offen:0, gedeckt:0};
  const bulletinZeit = jahrVonStation() >= 1805;
  let stufe = 0;
  if(z.schaden >= 60 || z.ereignisse >= 1) stufe = 1;
  /* Silber verlangt zusätzlich, dass man überwiegend gestanden hat — sonst
     wäre die Sichtbarkeitsregel durch bloße Länge des Gefechts auszuhebeln. */
  if((z.schaden >= 100 && z.offen > z.gedeckt) || (z.ereignisse >= 2)) stufe = 2;
  if(z.schaden >= 150 || (z.ereignisse >= 1 && z.vorn && n.haerte) || K.kette) stufe = 3;

  /* ── Ab Rang 9 hängt die Sichtbarkeit am Auftrag, nicht am Sieg ──
     Ein Capitaine wird nicht dafür gemeldet, dass er tapfer war, sondern
     dafür, dass die Kompanie getan hat, was ihr aufgetragen war. Wer den
     Auftrag verfehlt, kommt über das Lob vor der Front nicht hinaus, und zwar
     auch dann nicht, wenn er das Gefecht gewonnen hat. **Damit hört „gewinnen"
     auf, eine eindeutige Sache zu sein** — genau das ist der Rang. */
  const auftrag = auftragFuer(n);
  let auftragZeile = '';
  if(auftrag){
    const ok = auftrag.erfuellt(n);
    K.auftragErfuellt = ok;
    if(!ok) stufe = Math.min(stufe, 1);
    if(ok){ gunstGeben('vernet',1); S.ruf += 2; }
    else { gunstGeben('vernet',-1); S.ruf = Math.max(0,S.ruf-2); }
    auftragZeile = `<div class="wirkung"><span>Der Auftrag${ok?' — erfüllt':' — verfehlt'}</span>
      ${esc(auftrag.text)} ${esc(ok?auftrag.gut:auftrag.schlecht)}
      <b>Fürsprache Vernet ${ok?'+1 · Ruf +2':'−1 · Ruf −2'}</b></div>`;
  }

  /* ── `stumm:true` · Die Bulletins schweigen ──
     **Die eigene Regel von Spanien: Es gibt hier keinen Ruhm. Nur
     Entscheidungen, bei denen niemand zusieht.** Mechanisch heißt das, dass
     die Leiter der Sichtbarkeit auf ihrer untersten Stufe stehen bleibt: Lob
     vor der Front gibt es, weil die Kompanie es sieht — Nennungen und
     Bulletins nicht, weil in Paris über diesen Krieg nichts gedruckt wird,
     was gut klänge.

     **Das ist die härteste Umkehrung des Spiels**, und sie ist historisch:
     Über fünf Jahre Spanien gibt es kaum eine Meldung, die eine Schlacht
     feiert. Wer hier aufsteigen will, tut es über die Kasse, die Listen und
     den Einheitszustand — die Werkzeuge des Capitaine, die anderswo Beiwerk
     sind. Der Rang, der hier wohnt, ist genau deshalb der Capitaine. */
  const stumm = !!n.stumm;
  if(stumm) stufe = Math.min(stufe, 1);

  S.belobigungen = S.belobigungen || 0;
  S.bulletins = S.bulletins || 0;
  K.stufe = stufe;
  K.stumm = stumm;
  if(stufe === 1) { S.belobigungen++; S.kameradschaft = Math.min(100, S.kameradschaft+4); }
  if(stufe === 2) { S.nennungen++; }
  if(stufe === 3) { S.nennungen += 2; S.bulletins++; S.ruf += 4; }
  K.stufeName = ['','Lob vor der Front','Nennung im Tagesbefehl',
                 bulletinZeit?'Im Bulletin der Großen Armee':'Dem Oberbefehl gemeldet'][stufe];
  /* ── Die Abrechnung ──
     Der eigentliche Rangunterschied des Sergenten. Ein Caporal kommt aus dem
     Gefecht und ist fertig; ein Sergent zählt ab, und die Zahl geht nach oben.
     Zwanzig Mann, von denen die Hälfte liegt, sind ein gewonnenes Gefecht und
     eine verlorene Woche. */
  let abrechnung = '';

  /* ══════════════════ DIE ABRECHNUNG DES STABES ══════════════════

     Ab Rang 10 wird nicht mehr appelliert, sondern gerechnet. Was auf dem
     Zettel steht, sind vier Zahlen und ein Buchstabe — und der Buchstabe ist
     der der Kompanie, die du vorgeschickt hast.

     **Das Spiel sagt nie, ob es die richtige war.** Es nennt die Zahl. */
  if(K.kompanien){
    const gesamt = K.kompanien.reduce((s,k)=> s + k.bestand, 0) / K.kompanien.length;
    const kopf = S.rang>=11 ? 2000 : 800;
    const uebrig = Math.round(kopf * gesamt/100);
    const verlust = kopf - uebrig;
    const vorne = K.vorhut != null ? K.kompanien[K.vorhut] : null;
    if(verlust >= kopf*0.4){ gunstGeben('grandmaison',-1); S.belastung=Math.min(100,S.belastung+6); }
    else if(verlust <= kopf*0.12) gunstGeben('grandmaison',1);
    abrechnung = `<div class="wirkung"><span>Die Verlustmeldung</span>
      Von ${kopf} Mann stehen ${uebrig}. ${vorne
        ? 'Die ' + esc(vorne.name) + ' ist mit ' + Math.round(vorne.bestand) + ' von 100 herausgekommen. Sie ist die, die du vorgeschickt hast.'
        : 'Keine Kompanie ist zuerst hineingegangen; die Front ist über die ganze Breite in Bewegung gekommen und hat sich selbst gefunden.'}
      <b>${verlust >= kopf*0.4 ? 'Fürsprache Grandmaison −1 · Belastung +6'
          : verlust <= kopf*0.12 ? 'Fürsprache Grandmaison +1' : 'Zur Kenntnis genommen'}</b></div>`;
    /* Namen gibt es hier nicht mehr — das ist kein Versehen, sondern der Rang.
       Ein Chef de bataillon bekommt Summen; die Namen stehen in vier Listen,
       die vier andere Männer schreiben. */
  }

  /* ── Der Adler (ab Rang 11) ──
     **Ein verlorener Adler kostet den Rang**, unabhängig von allem anderen und
     unabhängig davon, wie gut geführt wurde. Ein geretteter erzwingt von
     allein einen Eintrag im Bulletin — die einzige Tat im Spiel, die das tut.

     Damit stellt Rang 11 eine Frage, die keiner der Ränge davor gestellt hat:
     **Wie viele Männer ist ein Gegenstand wert?** Das Spiel beantwortet sie
     nicht. Es rechnet nur mit. */
  if(S.rang>=11 && K.adlerVorn){
    const gesamt = K.kompanien ? K.kompanien.reduce((s,k)=> s+k.bestand,0)/K.kompanien.length : 100;
    const weg = S.adlerGefahr && (!sieg || gesamt < 40) && Math.random() < 0.5;
    if(weg){
      S.adler = 'verloren';
      S.rang = Math.max(10, S.rang-1); S.ruf = Math.max(0, S.ruf-25);
      gunstGeben('grandmaison',-3);
      abrechnung += `<div class="wirkung"><span>Der Adler</span>
        Er ist nicht zurückgekommen. Man wird nie herausfinden, wer ihn zuletzt gehabt hat, und es spielt auch keine Rolle: Ein Regiment, das seinen Adler verliert, hat keinen Colonel mehr. Der Befehl kommt nach elf Tagen, und er ist zwei Zeilen lang.
        <b>Rang zurück · Ruf −25 · Fürsprache Grandmaison −3</b></div>`;
    } else if(sieg){
      S.adler = 'gerettet'; S.bulletins = (S.bulletins||0)+1; S.nennungen += 2; S.ruf += 6;
      abrechnung += `<div class="wirkung"><span>Der Adler</span>
        Er ist vorn gewesen und er ist zurück. Der Adlerträger lebt nicht mehr, der zweite auch nicht; der dritte ist ein Tambour von neunzehn, der ihn hält, als wäre er heiß. Das steht so im Bulletin, und zwar ohne dass jemand es hätte melden müssen.
        <b>Bulletin · Nennungen +2 · Ruf +6</b></div>`;
    }
    S.adlerGefahr = false;
  }

  if(S.rang>=5 && S.rang<10 && K.sektion != null){
    /* Ab Rang 6 rechnet dieselbe Zahl über sechzig Mann statt über zwanzig —
       und der, dem man Rechenschaft schuldet, ist nicht mehr der Lieutenant,
       sondern der Capitaine. Die Schwellen skalieren mit. */
    const zug = S.rang>=6;
    const kopf = S.rang>=9 ? 120 : (zug ? 60 : 20);
    const wem = zug ? 'vernet' : 'berthaud';
    const uebrig = Math.max(0, Math.round(K.sektion/100*kopf));
    const verlust = kopf - uebrig;
    const kopfWort = kopf===120?'hundertzwanzig':kopf===60?'sechzig':'zwanzig';
    if(verlust >= kopf*0.45){ gunstGeben(wem,-1); S.belastung=Math.min(100,S.belastung+6);
      abrechnung = `<div class="wirkung"><span>Appell nach dem Gefecht</span>
        Von ${kopfWort} stehen ${uebrig}. ${zug
          ? 'Der Capitaine lässt sich die Listen bringen und geht sie durch, ohne aufzusehen. Er sagt nichts, und das ist schlimmer als etwas zu sagen.'
          : 'Der Lieutenant lässt sich die Namen der Fehlenden geben und sagt nichts weiter, und das ist schlimmer als etwas zu sagen.'}
        <b>Fürsprache ${esc(personKurz(wem))} −1 · Belastung +6</b></div>`; }
    else if(verlust <= kopf*0.15){ gunstGeben(wem,1); S.kameradschaft=Math.min(100,S.kameradschaft+5);
      abrechnung = `<div class="wirkung"><span>Appell nach dem Gefecht</span>
        Von ${kopfWort} stehen ${uebrig}. Das fällt auf, weil es sonst nicht so ist. ${zug
          ? 'Drei Sergenten haben ihre Leute beisammen, und drei Sergenten wissen, von wem sie das haben.'
          : 'Deine Leute merken es zuerst.'}
        <b>Fürsprache ${esc(personKurz(wem))} +1 · Kameradschaft +5</b></div>`; }
    else abrechnung = `<div class="wirkung"><span>Appell nach dem Gefecht</span>
        Von ${kopfWort} stehen ${uebrig}. ${zug
          ? 'Der Capitaine schreibt die Zahl auf und geht zur nächsten Kompanie.'
          : 'Der Lieutenant schreibt die Zahl auf und geht zur nächsten Sektion.'}</div>`;
    /* ── Die Verlustliste ──
       **Ab Rang 7 ist der Appell eine Pflicht, keine Anzeige.** Wer bis Rang 6
       „vier von zwanzig" gelesen hat, liest jetzt vier Namen, und die Namen
       stehen in derselben Handschrift wie die Meldung, die er unterschreibt.
       Das Spiel sagt dazu nichts. Es druckt die Liste, und die Liste ist bei
       einem verlorenen Gefecht länger als bei einem gewonnenen.

       Bei mehr als zwölf Gefallenen bricht die Liste ab — „und siebzehn
       weitere". Das ist nicht Platzmangel, sondern der Punkt: Ab einer
       bestimmten Zahl hört ein Offizier auf, Namen zu schreiben. */
    if(S.rang>=7 && verlust>0){
      const saat = (n.id||'').split('').reduce((a,c)=>a+c.charCodeAt(0),0) + K.runde;
      const namen = verlustNamen(Math.min(12, verlust), saat);
      abrechnung += `<div class="lage"><div class="lagekopf">Verlustliste · ${esc(n.ort)}</div>
        <p class="hinweis" style="margin:0 0 6px">Du schreibst sie selbst, und du unterschreibst sie auch.</p>
        <div class="verluste">${namen.map(nm=>`<span>${esc(nm)}</span>`).join('')}</div>
        ${verlust>12?`<p class="hinweis" style="margin:6px 0 0">Und ${verlust-12} weitere, deren Namen der Fourrier nachträgt.</p>`:''}</div>`;
    }
    else abrechnung = appellBild(uebrig, kopf) + abrechnung;
  }

  vakanzPruefen();                    // stimmen die Zahlen, ist der Tod angesagt
  const ketteMeldung = (grandmaisonAuftritt() || '') + ketteImGefecht(n);
  const kk = K; setzeKampf(null);
  stationErledigt();
  app.innerHTML = `<div class="stage">${verlauf()}
    <div><div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb"><div class="prose"><p>${letzterText}</p></div>
        <div class="ergebnis ${sieg?'gut':'schlecht'}">${erg.text}</div>${wirkungen(erg)}
        ${kk.rueckzug?`<div class="wirkung"><span>Der Rückzug</span>Ihr geht rückwärts aus dem Feuer, und das Feuer geht mit. Wer fällt, bleibt liegen. <b>Leben −${kk.rueckzug}</b></div>`:''}
        ${auftragZeile}${abrechnung}${ketteMeldung}
        ${kk.taten.length?`<div class="lage"><div class="lagekopf">Was gesehen wurde</div>
          ${kk.taten.map(t=>`<div class="tat"><span>${esc(t.was)}</span><b>Ruf +${t.ruf}</b></div>`).join('')}
          ${kk.ruhm>=RUHM_JE_GEFECHT?'<p class="hinweis" style="margin:9px 0 0">Mehr sieht in diesem Rauch niemand.</p>':''}
        </div>`:''}
        ${tatenBilanz(kk)}
        <div class="probe" style="margin-top:10px">${sieg?'GEFECHT BESTANDEN':'GEFECHT VERLOREN'} · ${kk.runde} RUNDEN</div>
      </div></div>
      <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="naechster()">Weiter</button></div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

/* Die Bilanz des Gefechts in Zahlen — und, wenn es knapp war, woran es lag.

   **Der zweite Satz ist der wichtigere.** Ein Auszeichnungssystem, dessen
   Schwellen unsichtbar sind, fühlt sich wie Zufall an; eines, das sagt „für den
   Tagesbefehl hätte es 100 gebraucht", macht aus dem nächsten Gefecht eine
   Entscheidung. Genau dieselbe Überlegung wie bei den Proben, die ihren Wert
   und ihre Schwierigkeit schon auf dem Knopf zeigen. */
function tatenBilanz(kk){
  const z = kk.zaehlung;
  if(!z || (!z.schaden && !z.ereignisse)) return '';
  const s = Math.round(z.schaden);
  const naechste = s < 60 ? 60 : s < 100 ? 100 : s < 150 ? 150 : 0;
  const wofuer = s < 60 ? 'ein Lob vor der Front' : s < 100 ? 'den Tagesbefehl' : 'die Meldung nach oben';
  return `<div class="wirkung"><span>${kk.stufe?esc(kk.stufeName):'Nicht aufgefallen'}</span>
    Eigener Anteil am Widerstand des Feindes: <b>${s}</b>${
      z.bestSerie>=3?` · ${z.bestSerie} Treffer in Folge aus dem Stand`:''}${
      z.gedeckt?` · ${z.gedeckt} Runden aus der Deckung, die halb zählen`:''}.
    ${kk.stufe===0 && naechste ? `Für ${wofuer} hätte es ${naechste} gebraucht.` :
      kk.stufe===1 && naechste ? `Für ${wofuer} hätte es ${naechste} gebraucht — und man muss dabei stehen.` : ''}</div>`;
}

/* ══════════════════ ELITEKOMPANIE ══════════════════ */

function zeigeElite(n){
  const kon = wert('konstitution'), ges = wert('geschick');
  const gr = kon>=55, vo = ges>=55;
  app.innerHTML = `<div class="stage">${verlauf()}
    <div>${wegband(n)}<div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb"><div class="prose">
        <p>Mailand hat der Armee Sold gegeben und Schuhe, und jetzt werden die Bataillone neu geordnet. Jedes bekommt eine Grenadier- und eine Voltigeurkompanie, und die Chefs suchen sich die Männer aus.</p>
        <p>Die Grenadiere nehmen die Großen und die, die stehen bleiben. Die Voltigeure nehmen die Kleinen und die, die schnell sind und allein zurechtkommen.</p>
        <p class="said">Der Adjutant geht die Reihe ab und bleibt vor dir stehen. Er sieht dich an, wie man ein Pferd ansieht.</p>
      </div></div></div>
      <div class="orders"><div class="ch"><span>Wohin</span></div><div class="ordbody">
        <button class="ord" onclick="waehleZweig('grenadier')" ${gr?'':'disabled'}>Zu den Grenadieren
          <span class="cost">Konstitution ${kon} · verlangt 55 · Bärenfellmütze, höherer Sold, die härteste Stelle der Linie</span></button>
        <button class="ord" onclick="waehleZweig('voltigeur')" ${vo?'':'disabled'}>Zu den Voltigeuren
          <span class="cost">Geschick ${ges} · verlangt 55 · Plänkler: zielen, Deckung, allein vor der Linie</span></button>
        <button class="ord" onclick="waehleZweig(null)">In der Füsilierkompanie bleiben
          <span class="cost">Kein Aufstieg, kein Umweg</span></button>
      </div></div>
    </div>${seitenleiste()}</div>`;
}
function waehleZweig(z){
  let text;
  if(z){ S.zweig=z; S.rang=Math.max(S.rang,2); S.ruf+=4;
    text = z==='grenadier'
      ? 'Man misst dich an einem Stab, nickt und schreibt deinen Namen auf die andere Liste. Ab morgen trägst du die Bärenfellmütze, bekommst zwei Sous mehr am Tag und stehst dort, wo es am dicksten kommt.'
      : 'Der Adjutant lässt dich dreißig Schritt laufen und wieder zurück, dann nickt er. Ab morgen gehst du vor der Linie, allein oder zu zweit, und schießt auf das, was du siehst — nicht auf das, wohin alle schießen.';
  } else {
    text = 'Er geht weiter, ohne etwas zu sagen. Du bleibst in der Mitte des Bataillons, wo die meisten bleiben. Es ist keine Schande, nur eben nichts.';
  }
  stationErledigt();
  app.innerHTML = `<div class="stage">${verlauf()}<div>
    <div class="card"><div class="ch"><span>Mailand</span><span>Mai 1796</span></div>
      <div class="cb"><div class="ergebnis ${z?'gut':''}">${text}</div>
      ${z?`<div class="rangzeile" style="margin-top:12px">${rangabzeichen(S)}
        <span class="probe" style="margin:0">NEUER RANG · ${rangName(2).toUpperCase()} · RUF +4</span></div>`:''}</div></div>
    <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="naechster()">Weiter</button></div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

/* ══════════════════ BEFÖRDERUNG ══════════════════ */

/* Schwelle zum Caporal. Beides zusammen, und dazu die Vakanz — siehe CLAUDE.md.
   Wer diese Zahlen ändert, trägt sie dort nach. */
const CAPORAL_RUF = 30, CAPORAL_GUNST = 4;

/* ══════════════════ DIE LEITER ══════════════════

   Beförderung ist kein Erfahrungsbalken (KONZEPT §7). Drei Bedingungen
   gleichzeitig: **Ruf** über der Schwelle, ein **Fürsprecher** mit Gesicht —
   und eine **Vakanz**, die es nur gibt, weil jemand gestorben oder selbst
   aufgerückt ist.

   Neu daran ist der Fürsprecher: nicht mehr eine Zahl, sondern eine bestimmte
   Person der richtigen Ebene. Wer Martel verliert, bevor er Caporal wird,
   braucht dessen Nachfolger — und der kennt ihn nicht. Wer sich den Fourier
   zum Feind gemacht hat, kommt an den Listen nicht vorbei, so tapfer er war.

   **Zwei Wege zum Sergent.** Der Feldweg geht über den Caporal und verlangt
   Ruf 62; der Listenweg geht über den Fourrier und verlangt nur 52, weil der
   Lieutenant dann die eigene Handschrift kennt — die Listen *sind* Fürsprache.
   Der Fourrier ist damit ein Seitenweg wie die Elitekompanie, kein Pflichtglied:
   **Überspringen kostet keine Wertung** (gezählt wird der höchste Rang, nicht
   die Summe der Stufen), nur die Verwaltungsknöpfe und den leichteren Anlauf. */

const LEITER = [
  {rang:3, name:'Caporal', ruf:CAPORAL_RUF, patron:'martel', gunst:CAPORAL_GUNST, von:[1,2],
   vorschlag:'für die nächste Korporalschaft, die einen Führer braucht',
   fehltRuf:'Zwei Stellen werden besetzt. Keine mit dir. Der Capitaine kennt deinen Namen nicht, und das ist die ganze Erklärung.',
   fehltGunst:'Dein Name fällt. Er fällt sogar zweimal. Aber niemand am Tisch legt die Hand für dich auf den Tisch, und ohne das geht es nicht.',
   text:p=>esc(p)+` nennt deinen Namen, und der Capitaine schreibt ihn auf. Es gibt keine Zeremonie. Du bekommst zwei Wollstreifen an den Ärmel, acht Mann und die Verantwortung dafür, dass diese acht Mann morgens da sind, Schuhe haben und ihre Musketen zünden.
    <br><br>Der Mann, dessen Stelle du bekommst, heißt Guérin. Er ist bei Castiglione geblieben.`},

  {rang:4, name:'Caporal-fourrier', ruf:35, patron:'collot', gunst:3, bildung:35, von:[2,3],
   vorschlag:'für die Listen, sobald er selbst aufrückt',
   fehltRuf:'Der Fourier sucht einen, der schreiben kann und den die Kompanie kennt. Das zweite fehlt.',
   fehltGunst:'Der Fourier sucht sich seinen Nachfolger selbst aus. Er hat sich umgesehen und ist an dir vorbeigegangen.',
   fehltBildung:'Man gibt dir eine Feder in die Hand und ein Blatt. Nach einer Minute nimmt man dir beides wieder ab. Für die Listen braucht es mehr als drei Wörter.',
   text:p=>esc(p)+` rückt selbst auf, und seine Stelle ist frei. Du bekommst einen dritten Streifen quer über die beiden, einen Bleistift, der dir gehört, und die Bestandslisten der Kompanie.
    <br><br>Von jetzt an steht dein Name auf jedem Blatt, auf dem eine Zahl nicht stimmt. Das ist der Unterschied zwischen Tragen und Verantworten, und es hat noch nie jemand gemocht.`},

  {rang:5, name:'Sergent', ruf:62, patron:'berthaud', gunst:5, von:[3,4], vakanz:'major',
   vorschlag:'für die nächste Sektion, die einen Sergenten braucht',
   faelltWer:MAJOR, rueckt:'martel',
   fallText:'Vier Mann tragen ihn zurück, den Säbel quer über dem Tornister, und legen ihn zu den anderen.',
   fehltRuf:'Für eine Sektion braucht es einen Namen, den die Kompanie gehört hat, bevor er verlesen wird.',
   fehltGunst:'Der Lieutenant geht die Liste durch. Bei dir hält er nicht an.',
   text:p=>esc(personKurz('martel'))+` trägt seit vier Wochen die Tresse des Sergent-majors. Seine alte Stelle war seitdem nicht besetzt, weil niemand da war, der sie hätte ausfüllen können.
    <br><br>`+esc(p)+` nennt deinen Namen. Du bekommst eine Tresse aus Metallfaden, zwanzig Mann und die Frage, wie viele davon am Abend noch stehen. Es ist die erste Beförderung, bei der niemand für dich gestorben ist — dein Vorgänger ist bloß aufgerückt. <span class="fein">Weil über ihm einer gefallen war.</span>`},

  {rang:5, name:'Sergent', ruf:52, patron:'berthaud', gunst:4, listenweg:true, von:[3,4], vakanz:'major',
   vorschlag:'für die nächste Sektion, die einen Sergenten braucht',
   faelltWer:MAJOR, rueckt:'martel',
   fallText:'Vier Mann tragen ihn zurück, den Säbel quer über dem Tornister, und legen ihn zu den anderen.',
   fehltRuf:'Für eine Sektion braucht es einen Namen, den die Kompanie gehört hat, bevor er verlesen wird.',
   fehltGunst:'Der Lieutenant geht die Liste durch. Bei dir hält er nicht an.',
   text:p=>`Der Lieutenant kennt deine Handschrift, seit du die Listen führst. Das ist eine Art von Fürsprache, die nichts kostet und lange wirkt.
    <br><br>`+esc(personKurz('martel'))+` ist Sergent-major, seine Stelle ist frei, und `+esc(p)+` nennt deinen Namen. Zwanzig Mann, eine Tresse, und ein Buch weniger zu führen.`},

  /* ── Rang 6 · Sergent-major ──
     **Die Decke des Prototyps, und sie hat ein Gesicht.** Boulogne hat es
     angesagt: „Nichts frei. Auf dem Posten sitzt Martel, zweiundvierzig und
     gesund." Damit ist von Anfang an klar, was frei werden müsste.

     Der Fürsprecher ist **Vernet**, der Kompaniechef — und das gibt dem
     vierten Mann der Kette endlich eine Funktion. Seine Quellen sind knapp und
     bleiben es: Er kennt deinen Namen erst, wenn ihn jemand oft genug genannt
     hat (KONZEPT: „Er kennt deinen Namen erst, wenn ihn jemand nennt").

     Die Vakanz ist die härteste im Spiel — es ist die einzige, bei der ein
     Mann fällt, den man seit 1796 kennt. Das Spiel spricht es nie aus. */
  {rang:6, name:'Sergent-major', ruf:75, patron:'vernet', gunst:3, von:[4,5], vakanz:'majormajor',
   vorschlag:'für die Kompanie, sobald sie einen Sergent-major braucht',
   faelltKette:'martel', stelle:'Die Stelle des Sergent-majors',
   frei:'Die Bücher der Kompanie liegen seit dem Morgen bei niemandem.',
   fehltRuf:'Für sechzig Mann reicht es nicht, dass die Kompanie deinen Namen kennt. Das Bataillon muss ihn kennen.',
   fehltGunst:'Der Capitaine weiß, wer du bist. Das ist etwas anderes, als dich zu wollen.',
   text:p=>`Die Stelle des Sergent-majors ist seit dem Gefecht nicht besetzt. Es hat drei Wochen gedauert, bis jemand die Bücher übernommen hat, und in diesen drei Wochen hat die Kompanie gemerkt, wie viel an einem Mann hängt, den niemand tagsüber sieht.
    <br><br>`+esc(p)+` unterschreibt. Du bekommst die zweite Tresse, drei Sektionen, sechzig Mann und die Fourage für sechzig Mann. Von jetzt an bist du der, den niemand tagsüber sieht.
    <br><br><span class="fein">Seine Sachen sind schon weggeräumt. Es ging schnell, weil es immer schnell geht.</span>`},

  /* ══════════════════ DIE OFFIZIERSHÄLFTE ══════════════════

     Schwellen nach RANGLEITER §7, Fortschreibung der gebauten Reihe
     (30 / 35 / 52–62 / 75). **Alle Zahlen sind Entwurf und werden gemessen —
     aber sie werden nicht gesenkt, damit Rang 14 in vier Kapiteln erreichbar
     wird. Die Leiter ist absichtlich länger als der Inhalt.**

     Vier Einträge fordern etwas, das es noch nicht gibt (`orden:'legion_grand'`,
     `generalskampagne`). Das ist kein Versehen: Sie sind programmiert und
     unerreichbar, bis der Inhalt nachkommt — genau wie es der Entwurf will. */

  /* ── Rang 7 · Die schärfste Kante des Spiels ──
     Bildung 50 hat keinen zweiten Weg. Wer die Regimentsschule in der Garnison
     vertrödelt hat, steht hier mit Ruf 100 und drei Orden — und kommt nicht
     durch. Das ist der „Rangstillstand als Druckmittel" aus KONZEPT §9, als
     Klinge statt als Hinweis. */
  {rang:7, name:'Sous-Lieutenant', ruf:95, patron:'berthaud', gunst:4, bildung:50, von:[5,6],
   vakanz:'zugfuehrer', vorschlag:'für das Patent, sobald eines frei wird',
   stellenText:'Das Bataillon habe seine Zugführer, und alle seien im Dienst.',
   faelltWer:'Lieutenant Ferrand', rueckt:null,
   fallText:'Er war dreiundzwanzig und seit vier Monaten bei der Kompanie. Man findet ihn erst am Abend, weil er zwanzig Schritt vor der Linie lag, wo ein Zugführer liegt.',
   fehltRuf:'Ein Patent bekommt, wessen Namen der Bataillonschef von selbst nennt. Deiner wird genannt, wenn man nachfragt.',
   fehltGunst:'Zwei Unterschriften braucht ein Patent. Du hast eine.',
   fehltBildung:'Der Capitaine legt dir ein Blatt hin und einen Federkiel. Du sollst den Empfang von vierzig Paar Schuhen quittieren. Mehr ist es nicht. Er nimmt das Blatt zurück, bevor du fertig bist.',
   text:p=>esc(p)+` unterschreibt, und danach unterschreibt der Chef de bataillon. Zwei Namen auf einem Papier, und du bist kein Unteroffizier mehr.
    <br><br>Du gibst die Muskete ab. Dafür bekommst du einen Degen, der nichts taugt, Epauletten, die du selbst bezahlen musst, und den Platz drei Schritt vor der Front, an dem dein Vorgänger vier Monate alt geworden ist.
    <br><br><span class="fein">Von hier an schießt du nicht mehr. Du entscheidest.</span>`},

  /* ── Rang 8 · Der ruhige Rang nach dem Bruch ── */
  {rang:8, name:'Lieutenant', ruf:120, patron:'vernet', gunst:4, von:[6,7],
   vakanz:'lieutenant', vorschlag:'für die Stellvertretung der Kompanie',
   stellenText:'Die Kompanie habe ihren Lieutenant, und der sei gesund.',
   faelltWer:'Chef de bataillon Reynaud', rueckt:'berthaud',
   fallText:'Ein Schuss aus vierhundert Schritt, von jemandem, der nicht gezielt haben kann. So etwas passiert, und man kann nichts dagegen tun.',
   fehltRuf:'Ein Lieutenant vertritt den Capitaine. Dafür muss die Kompanie ihn kennen, nicht nur der Capitaine.',
   fehltGunst:'Er kennt dich. Er hält dich für ordentlich. Ordentlich reicht für einen Sous-Lieutenant.',
   text:p=>esc(p)+` gibt dir die zweite Epaulette und einen Satz dazu: Wenn er fällt, bist du die Kompanie.
    <br><br>Es ist kein Bild, es steht so im Reglement. Von jetzt an reitest du Meldungen zum Stab, und was du dort schreibst, liest jemand, der Divisionen bewegt.`},

  /* ── Rang 9 · Die Kompanie ── */
  {rang:9, name:'Capitaine', ruf:150, patron:'vernet', gunst:5, orden:'legion', von:[7,8],
   vakanz:'capitaine', vorschlag:'für die Kompanie, sobald sie einen Chef braucht',
   stellenText:'Die Kompanie habe ihren Capitaine.',
   faelltWer:'Capitaine Lasserre', rueckt:'vernet',
   fallText:'Er hat seine Kompanie viermal über dasselbe Feld geführt und ist beim vierten Mal geblieben. Die Kompanie war beim fünften Mal trotzdem oben.',
   fehltRuf:'Eine Kompanie bekommt, wen das Regiment kennt.',
   fehltGunst:'Der Chef de bataillon empfiehlt niemanden, den er nicht selbst gesehen hat.',
   fehltOrden:'Für eine Kompanie verlangt das Regiment ein Kreuz an der Brust. Es steht in keiner Vorschrift und ist trotzdem so.',
   text:p=>esc(p)+` übergibt dir hundertzwanzig Mann, eine Kasse und ein Buch, in dem steht, was die hundertzwanzig gekostet haben.
    <br><br>Von jetzt an bekommst du vor jedem Gefecht einen Auftrag, und der Auftrag ist nicht dasselbe wie der Sieg. Man kann gewinnen und ihn verfehlen.`},

  /* ── Ränge 10 bis 13 · Der Stab ──
     Grandmaison ist über vier Ränge der alleinige Fürsprecher. Das ist wenig
     Redundanz für viel Spielzeit und steht als offener Punkt in RANGLEITER §11. */
  {rang:10, name:'Chef de bataillon', ruf:180, patron:'grandmaison', gunst:3, reiten:40, von:[8,9],
   vakanz:'bataillon', vorschlag:'für ein Bataillon, sobald eines ohne Chef ist',
   stellenText:'Das Regiment habe seine drei Bataillonschefs.',
   faelltWer:'Chef de bataillon Aubry',
   fallText:'Er ist vom Pferd gefallen, bevor ihn jemand schießen sah. Man streitet drei Tage darüber, woran er gestorben ist, und begräbt ihn währenddessen.',
   fehltRuf:'Ein Bataillon führt, wen die Brigade kennt.',
   fehltGunst:'Der General kennt viele Namen. Deiner ist einer davon.',
   fehltReiten:'Ein Bataillonschef ist beritten. Du sitzt auf, und man sieht dir zu, wie du absteigst.',
   text:p=>esc(p)+` nennt deinen Namen, und niemand widerspricht. Achthundert Mann, zwei Pferde und ein Bursche, den du bezahlst.
    <br><br>Du siehst deine Leute ab jetzt als Rechtecke auf einer Skizze. Ob das ein Verlust ist, entscheidest du selbst.`},

  {rang:11, name:'Colonel', ruf:200, patron:'grandmaison', gunst:4, adler:true, von:[9,10],
   vakanz:'regiment', vorschlag:'für das Regiment, wenn es eines braucht',
   stellenText:'Das Regiment habe seinen Colonel.',
   faelltWer:'Colonel Desmarets',
   fallText:'Er ist vorn geritten, weil ein Colonel vorn reitet, und hat es zweiundzwanzig Jahre lang überlebt. Heute nicht.',
   fehltRuf:'Ein Regiment bekommt, wen die Armee kennt.',
   fehltGunst:'Für ein Regiment braucht es mehr als Wohlwollen.',
   fehltAdler:'Ein Regiment, das seinen Adler verloren hat, bekommt keinen neuen Colonel. Es bekommt gar nichts mehr.',
   text:p=>esc(p)+` übergibt dir das Regiment und den Adler dazu.
    <br><br>Der Adler ist kein Gegenstand, sondern eine Bedingung. Wer ihn verliert, verliert alles, was daran hängt — unabhängig davon, wie das Gefecht ausgegangen ist.`},

  {rang:12, name:'Général de brigade', ruf:230, patron:'grandmaison', gunst:5, bulletins:3, von:[10,11],
   vakanz:'brigade', vorschlag:'für eine Brigade, wenn der Kaiser zustimmt',
   stellenText:'Die Division habe ihre Brigadegenerale.',
   faelltWer:'Général Séverin', rueckt:'grandmaison',
   fallText:'Er hat den Angriff angeführt, den er hätte befehlen sollen. Man wird ihn dafür in einem Bulletin loben.',
   fehltRuf:'Eine Brigade bekommt, wen die Armee nennt.',
   fehltGunst:'Der General empfiehlt dich. Einmal.',
   fehltBulletins:'Für einen General reicht ein General nicht. Es braucht einen Kaiser, der den Namen schon einmal gelesen hat.',
   text:p=>esc(p)+` schlägt dich vor, und in Paris wird unterschrieben. Vier Regimenter, ein Stab, eine Karte.
    <br><br>Ab jetzt vergeht die Zeit in Stunden, und was du über den Feind weißt, hat jemand vor einer Stunde gesehen.`},

  {rang:13, name:'Général de division', ruf:260, patron:'grandmaison', gunst:5, orden:'legion_grand', von:[11,12],
   vakanz:'division', vorschlag:'für eine Division',
   stellenText:'Das Korps habe seine Divisionsgenerale.',
   faelltWer:'Général de division Marchand', rueckt:'grandmaison',
   fallText:'Er ist an einer Wunde gestorben, die drei Wochen alt war und für harmlos galt.',
   fehltRuf:'Eine Division führt, wen Frankreich kennt.',
   fehltGunst:'Auch ein General hat nur eine Stimme.',
   fehltOrden:'Für eine Division verlangt der Kaiser einen Grad, den er selbst vergibt.',
   text:p=>esc(p)+` ist der Letzte, der dich vorschlägt. Was darüber liegt, vergibt einer allein.
    <br><br>Eine Division, ein eigener Stab, eine Dotation, von der man in Frankreich ein Gut kaufen kann. Und Gespräche, in denen Schweigen manchmal die bessere Antwort ist.`},

  /* ── Rang 14 · Praktisch nie ──
     Kein Patron: Marschälle wurden von einem Mann allein ernannt. Die
     Bedingung `generalskampagne` gibt es noch nicht — der Rang ist gebaut und
     unerreichbar, und das ist der Entwurf, nicht ein Versäumnis. */
  {rang:14, name:'Maréchal d\'Empire', ruf:300, patron:null, gunst:0,
   generalskampagne:true, von:[13],
   fehltRuf:'Es gibt keine Liste, auf die man sich setzen lässt. Es gibt einen Mann, der einen Namen sagt.',
   text:()=>`Es wird nicht verlesen. Es steht im Moniteur, und jemand liest es dir vor.
    <br><br>Vierundzwanzig Namen stehen vor deinem, und die meisten davon standen 1796 dort, wo du gestanden hast.`}
];

/* Welche Stufe hier zur Debatte steht: **der höchste Eintrag, den man
   tatsächlich erfüllt** — und wenn keiner, der niedrigste, damit der Bildschirm
   erklärt, woran es beim nächsten Schritt scheitert.

   Genau daraus fällt heraus, dass der Fourrier überspringbar ist: Ein Caporal
   mit Ruf 50 und der Fürsprache des Lieutenants steht direkt vor der
   Sergent-Stelle (Feldweg); wem dafür der Ruf fehlt, dem bietet dieselbe
   Musterung die Listen an (Listenweg). Niemand muss wählen — man merkt an dem,
   was einem angeboten wird, welchen Weg man ohnehin geht. */
function leiterZiel(){
  const passend = LEITER.filter(e => e.von.indexOf(S.rang) >= 0);
  if(!passend.length) return null;
  for(let i = passend.length-1; i >= 0; i--){
    const e = passend[i];
    const vakanz = !e.vakanz || vakanzStand(e.vakanz).tot;
    if(schwellenStimmen(e) && vakanz) return e;
  }
  return passend[0];
}

/* Die Vakanz für den Sergenten entsteht nicht von selbst: Sobald die Zahlen
   stimmen, wird der Tod des Sergent-majors **angesagt** und fällt im nächsten
   Gefecht (`ketteImGefecht`). Erst danach ist die Stelle frei — und die Naht
   zwischen „ich bin qualifiziert" und „über mir stirbt einer" bleibt unsichtbar. */
/* Stimmen Ruf und Fürsprache, **schlägt der Lieutenant dich vor** — und erst
   danach wird die Stelle frei.

   Bis zum 28.07.2026 setzte diese Prüfung nur stumm ein Flag: Der Spieler
   erfuhr nie, dass sein Name nach oben gegangen war, und die Beförderung zwei
   Stationen später kam aus dem Nichts. Der Vorschlag ist aber das eigentliche
   Ereignis — er ist das, was ein Mann sich verdient. Die Vakanz ist nur, was
   danach passieren muss.

   **Und genau darin liegt Invariante 5, ohne dass sie ausgesprochen wird:**
   Berthaud sagt, dein Name stehe auf der Liste, und es sei keine Stelle frei.
   Was daraus folgt, denkt der Spieler selbst. */
/* ══════════════════ DIE VAKANZMASCHINE ══════════════════

   **Die Vakanz ist eine allgemeine Regel, keine Liste von Schlachten.** Sobald
   Ruf und Fürsprache für einen Zielrang stimmen, schlägt der Patron dich vor —
   und die Stelle wird im nächsten Gefecht frei, das etwas taugt. Wer fällt,
   hängt am **Zielrang**, nicht am Ort.

   Genau deshalb funktioniert die Leiter in vier Kapiteln wie später in elf: Sie
   wird nur seltener durchlaufen. Bis zum 28.07.2026 war sie auf zwei Flagpaare
   verdrahtet (`majorTot`/`majorFaellt`, `martelTot`/`martelFaellt`); mit acht
   weiteren Rängen wäre daraus eine unlesbare Kette von Sonderfällen geworden.

   Der Zustand liegt jetzt in `S.vakanz[key] = {faellt, tot}`, gespeist aus den
   `vakanz`-Feldern der LEITER-Einträge. */
function vakanzStand(key){
  S.vakanz = S.vakanz || {};
  return (S.vakanz[key] = S.vakanz[key] || {faellt:false, tot:false});
}

function vakanzPruefen(){
  if(!S || !S.leute) return;
  for(const z of LEITER){
    if(!z.vakanz) continue;
    if(z.von.indexOf(S.rang) < 0) continue;
    const v = vakanzStand(z.vakanz);
    if(v.tot || v.faellt) continue;
    if(!schwellenStimmen(z)) continue;
    v.faellt = true;
    if(LAUF) LAUF.vorschlag = {patron:z.patron, rang:z.rang};
    return;                                // höchstens ein Vorschlag je Gefecht
  }
}

/* Ob ein Eintrag der Leiter erfüllt ist — **ohne** die Vakanz. Sie wird
   getrennt geprüft, weil sie erst durch den Vorschlag entsteht. */
function schwellenStimmen(z, stand){
  const g = stand || {ruf:S.ruf, gunst:gunst(z.patron), bildung:S.attr.bildung};
  if(g.ruf < z.ruf) return false;
  if(z.patron && g.gunst < z.gunst) return false;
  if(z.bildung && g.bildung < z.bildung) return false;
  if(z.reiten && wert('reiten') < z.reiten) return false;
  if(z.orden && !hatOrden(z.orden)) return false;
  if(z.bulletins && (S.bulletins|0) < z.bulletins) return false;
  if(z.adler && S.adlerVerloren) return false;
  if(z.generalskampagne && !S.generalskampagne) return false;
  return true;
}

/* Welche Zusatzschranke fehlt — für den Text auf dem Musterungsbildschirm.
   Gibt den Schlüssel zurück, nicht den Satz; den holt `zeigeBefoerderung`
   aus dem LEITER-Eintrag (`fehltBildung`, `fehltOrden`, …). */
function fehltWas(z){
  if(S.ruf < z.ruf) return 'fehltRuf';
  if(z.patron && gunst(z.patron) < z.gunst) return 'fehltGunst';
  if(z.bildung && S.attr.bildung < z.bildung) return 'fehltBildung';
  if(z.reiten && wert('reiten') < z.reiten) return 'fehltReiten';
  if(z.orden && !hatOrden(z.orden)) return 'fehltOrden';
  if(z.bulletins && (S.bulletins|0) < z.bulletins) return 'fehltBulletins';
  if(z.adler && S.adlerVerloren) return 'fehltAdler';
  if(z.generalskampagne && !S.generalskampagne) return 'fehltRuf';
  return null;
}

/* ══════════════════ DIE ZWEI RANGSCHRANKEN ══════════════════

   **Dein Rang entscheidet, wie viel vom Krieg du überhaupt zu sehen bekommst**
   (KONZEPT §9, RANGLEITER §9). Nach Russland braucht es Rang 7, vor Waterloo
   Rang 10; wer darunter bleibt, geht in den Ruhestand, und die Kampagne endet.

   Beides ist historisch: Nach 1812 wurden Mannschaften und Unteroffiziere in
   Massen ausgemustert, während erfahrene Offiziere gebraucht wurden — und als
   Napoleon 1815 von Elba zurückkam, rief er gezielt Offiziersveteranen zurück,
   keine Feldwebel.

   **Gebaut, bevor die Kapitel dafür stehen.** Eine Station setzt
   `schranke:'russland'` oder `'waterloo'`; die Prüfung liegt hier, damit
   Kapitel 8 und 10 später nur noch Daten anhängen müssen. */
const SCHRANKEN = {
  russland:{rang:7, name:'Nach Russland', bonus:180,
    durch:'Von der Armee, die im Juni über den Njemen ging, kommen im Dezember dreißigtausend zurück. Du bist einer davon, und du bist Offizier — also wirst du gebraucht.',
    ende:'Die Listen werden neu geschrieben, und was kein Offizier ist, steht nicht mehr darauf. Man dankt dir, zahlt aus und schickt dich nach Hause.',
    epilog:'Du hast alles gesehen, was ein Mensch sehen kann, und gehst nach Hause. Dass du kein Offizier geworden bist, macht das nicht kleiner: Von hundert, die mit dir über den Njemen gingen, sind sechs zurückgekommen.'},
  waterloo:{rang:10, name:'Vor Waterloo', bonus:120,
    durch:'Er ruft die zurück, die er kennt. Du stehst auf der Liste, weil ein Regiment ohne dich nicht marschiert.',
    ende:'Die Armee wird aufgelöst, die Offiziere auf Halbsold gesetzt. Du bekommst ein Papier, eine Zahl und eine Adresse.',
    epilog:'Im März 1815 liest du in der Zeitung, dass er zurück ist. Du liest es zu Ende, faltest sie und legst sie weg. Es ist die vernünftigste Entscheidung deines Lebens, und du wirst sie dreißig Jahre lang bereuen.'}
};

function schrankeGeschafft(id){
  const sch = SCHRANKEN[id];
  return !sch || S.rang >= sch.rang;
}

function zeigeBefoerderung(n){
  /* Der Stand wird beim ersten Betreten der Station eingefroren, je Station —
     seit Kairo gibt es eine zweite Musterung, und die prüft den Stand von
     jetzt, nicht den von Verona. */
  S.befPruefungen = S.befPruefungen || {};
  const ziel = leiterZiel();

  if(!ziel){
    stationErledigt();
    app.innerHTML = `<div class="stage">${verlauf()}<div>${wegband(n)}
      <div class="card"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
        <div class="cb"><div class="prose">${(n.text||[]).map(t=>`<p>${t}</p>`).join('')}</div>
        <div class="ergebnis">${n.keinZiel || 'Du trägst die Tresse schon. Was darüber kommt, wird nicht im Hof einer Zitadelle vergeben, sondern in Paris — und dafür braucht es mehr als einen guten Feldzug.'}</div>
        </div></div>
      <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="naechster()">Weiter</button></div></div>
      </div>${seitenleiste()}</div>`;
    kopfzeile();
    return;
  }

  if(!S.befPruefungen[n.id])
    S.befPruefungen[n.id] = {ruf:S.ruf, gunst:gunst(ziel.patron), bildung:S.attr.bildung};
  const g = S.befPruefungen[n.id];

  const vakanz  = !ziel.vakanz || vakanzStand(ziel.vakanz).tot;
  const fehlt   = fehltWas(ziel);
  const bekommt = !fehlt && vakanz;

  /* Der Nachsatz, der die fehlende Zahl beim Namen nennt. Er stand früher
     viermal ausgeschrieben; mit vierzehn Rängen und sieben Schrankenarten wäre
     daraus eine Kette von Sonderfällen geworden. */
  const nachsatz = {
    fehltRuf:     () => `Für den ${esc(ziel.name)} braucht es Ruf ${ziel.ruf} — du hast ${S.ruf}.`,
    fehltGunst:   () => `Für den ${esc(ziel.name)} braucht es die Fürsprache von ${esc(personName(ziel.patron))} — ${ziel.gunst}, du hast ${gunst(ziel.patron)}. Fürsprache sammelt sich in Abenden und Gefälligkeiten, nicht in einer einzigen Tat.`,
    fehltBildung: () => `Für den ${esc(ziel.name)} braucht es Bildung ${ziel.bildung} — du hast ${S.attr.bildung}. Buchstaben lernt man im Lager und in der Regimentsschule, gegen Geld und gegen Zeit.`,
    fehltReiten:  () => `Für den ${esc(ziel.name)} braucht es Reiten ${ziel.reiten} — du hast ${wert('reiten')}.`,
    fehltOrden:   () => `Für den ${esc(ziel.name)} braucht es ${esc((ordenVon(ziel.orden)||{name:'einen Orden, den es noch nicht gibt'}).name)}.`,
    fehltBulletins:() => `Für den ${esc(ziel.name)} braucht es ${ziel.bulletins} Nennungen im Bulletin — du hast ${S.bulletins|0}.`,
    fehltAdler:   () => `Ein Regiment ohne Adler bekommt keinen Colonel.`
  };

  let text, klasse = 'schlecht';
  if(bekommt){
    S.rang = Math.max(S.rang, ziel.rang);
    S.ruf += 5;
    if(ziel.patron) gunstGeben(ziel.patron, 1);
    text = ziel.text(ziel.patron ? personName(ziel.patron) : '');
    klasse = 'gut';
    /* ── Rang 12 schaltet die Generalskampagnen frei ──
       Einmal erreicht, bleiben sie dauerhaft offen (`META.generalskampagnen`) —
       sonst sähen 96 % der Spieler die aufwendigste Darstellungsstufe nie.
       Die Szenarien selbst gibt es noch nicht; freigeschaltet wird trotzdem
       jetzt, damit die Freischaltung nicht später nachgereicht werden muss und
       ein alter Chronikeintrag sie rückwirkend nicht bekommt. */
    /* Mit dem Regiment kommt der Adler. Er wird nicht verliehen, er ist da —
       die Frage ist nur, ob er bleibt. */
    if(ziel.rang>=11 && !S.adler) S.adler = 'getragen';
    if(ziel.rang>=12 && typeof META==='object' && META && !META.generalskampagnen){
      META.generalskampagnen = true;
      try{ chronikSichern(); }catch(e){}
    }
    /* ── Die Szene, die nichts kostet und alles sagt ──
       Sie steht genau einmal, beim Patent, und sie hat keinen Knopf, keine
       Probe und keine Wirkung. **Das ist der Punkt.** Was ein Patent bedeutet,
       lässt sich nicht in Zahlen sagen; es lässt sich nur zeigen, indem man
       den Mann zeigt, der es nie bekommen wird — und der einen im April 1796
       über die Pässe gebracht hat. Das Spiel wertet nicht. Es stellt die beiden
       nebeneinander und geht weiter (Invariante 7). */
    if(ziel.rang===7 && !S.martelSalut){
      S.martelSalut = true;
      text += `<br><br>Martel steht in der Reihe, in der du zehn Jahre gestanden hast. Als du vorbeigehst, salutiert er. Er ist zweiundvierzig, er hat dich im April 1796 über die Pässe gebracht, und er wird nie ein Patent bekommen, weil er nicht lesen kann. Er sagt nichts dazu. Du auch nicht.`;
      S.log.push(n.id+': Martel salutiert.');
    }
  } else if(!vakanz){
    text = 'Die Stelle über dir ist besetzt, und der, der sie hat, steht fest. Es gibt nichts zu vergeben.'
         + `<br><br><em>Für den ${esc(ziel.name)} braucht es eine freie Stelle. Frei wird sie nicht, weil du bereit bist.</em>`;
  } else {
    text = (ziel[fehlt] || 'Man geht die Liste durch und hält bei dir nicht an.')
         + `<br><br><em>${(nachsatz[fehlt] || nachsatz.fehltRuf)()}</em>`;
  }
  stationErledigt();     // die Entscheidung ist gefallen, bevor der Knopf kommt
  app.innerHTML = `<div class="stage">${verlauf()}<div>${wegband(n)}
    <div class="card papier"><div class="ch"><span>${esc(n.ort)}</span><span>${esc(n.datum)}</span></div>
      <div class="cb">${vordruck(n)}<div class="prose">${(n.text||[]).map(t=>`<p>${t}</p>`).join('')}</div>
      <div class="ergebnis ${klasse}">${text}</div>
      <div class="rangzeile" style="margin-top:12px">${bekommt?rangabzeichen(S):''}
        <span class="probe" style="margin:0">${vakanz?'VAKANZ VORHANDEN':'KEINE VAKANZ'} · RUF ${g.ruf}/${ziel.ruf} · ${esc(personKurz(ziel.patron).toUpperCase())} ${g.gunst}/${ziel.gunst}${ziel.bildung?' · BILDUNG '+g.bildung+'/'+ziel.bildung:''} · ${bekommt?'BEFÖRDERT':'ÜBERGANGEN'}</span></div>
      </div></div>
    <div class="orders"><div class="ordbody"><button class="ord weiter" onclick="naechster()">Weiter</button></div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}
