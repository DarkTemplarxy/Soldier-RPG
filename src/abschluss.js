'use strict';
/* Lager, Winterquartier, Punktwertung, Tod, Kapitelende, Spielstand. */

/* ══════════════════ LAGER ══════════════════ */

/* Ein Lager ist die kleine Fassung des Winterquartiers: zwei bis drei Abende,
   und immer mehr zu tun, als Zeit da ist. Ausbildung und Instandhaltung
   konkurrieren miteinander — das ist der ganze Entwurf. Was hier nicht getan
   wird, fehlt im nächsten Gefecht.

   Die Handlungen stehen hier, die Auswahl je Lager in den Kapiteldaten (tun:[…]).
   Handlungen für Rang und Zweig kommen selbsttätig dazu — ein höherer Rang gibt
   auch im Lager neue Knöpfe, nicht größere Zahlen. */

const LAGER_TUN = {
  exerzieren:{label:'Exerzieren, bis die Handgriffe von allein gehen',
    cost:'Muskete und Drill · Atem −6',
    tu(){ nutzen('muskete',2); nutzen('drill',2);
      S.atem=Math.max(0,S.atem-6); S.belastung=Math.min(100,S.belastung+2);
      return 'Laden in zwölf Zeiten, achtzig Mal hintereinander, bis die Hände es ohne den Kopf können. Ein Caporal zählt laut mit, und wer nachhängt, fängt von vorn an. <span class="fein">Muskete und Drill steigen · Atem −6</span>'; }},

  bajonett:{label:'Bajonettfechten gegen einen Strohmann',
    cost:'Bajonett · Atem −8',
    tu(){ nutzen('bajonett',2.5);
      S.atem=Math.max(0,S.atem-8); S.belastung=Math.min(100,S.belastung+2);
      return 'Ein Sack Stroh an einem Pfahl, zweihundert Stöße. Der Sergent sagt, du sollst nicht stechen wie einer, der jemanden verletzen will, sondern wie einer, der weitergehen will. <span class="fein">Bajonett steigt · Atem −8</span>'; }},

  scharf:{label:'Scharf schießen, mit gekauftem Pulver',
    cost:'Muskete ++ · kostet 4 Francs',
    tu(){ if(S.geld<4) return 'Der Mann mit dem Pulver rechnet nach und schickt dich weg. Vier Francs, sagt er, und du hast sie nicht. <span class="fein">nichts passiert</span>';
      S.geld-=4; nutzen('muskete',3.5);
      S.ausr.muskete.zustand = Math.max(0, S.ausr.muskete.zustand-5);
      return 'Zwölf scharfe Schüsse auf eine Scheibe aus Brettern, achtzig Schritt. Beim Bataillon sind drei Schuss im Jahr vorgesehen; den Rest muss man sich selbst kaufen. Beim neunten triffst du zum ersten Mal, weil du es willst, und nicht, weil es sich ergeben hat. <span class="fein">Muskete steigt deutlich · −4 F · Waffe −5</span>'; }},

  instand:{label:'Ausrüstung durchsehen und flicken',
    cost:'Geschick · alles ein Stück besser',
    tu(){ const p = probe('geschick',30);
      const plus = p.erfolg ? 20 : 8;
      for(const k in S.ausr) if(S.ausr[k].verschleiss) S.ausr[k].zustand = Math.min(100, S.ausr[k].zustand+plus);
      return (p.erfolg
        ? 'Riemen nachgenäht, Sohlen mit Draht gefasst, das Schloss zerlegt und ausgewischt. Du bist der Letzte am Feuer und der Einzige, dessen Zeug morgen noch hält.'
        : 'Du machst, was du kannst, und was du kannst, ist nicht viel. Der Riemen hält bis übermorgen, mehr nicht.')
        + ` <span class="fein">Alle Ausrüstung +${plus}</span>`; }},

  schuhe:{label:'Die Schuhe zum Schuster im Dorf tragen',
    cost:'Schuhe ++ · kostet 6 Francs',
    tu(){ if(S.geld<6) return 'Der Schuster hält die Hand auf, bevor er die Schuhe nimmt. Sechs Francs. Du hast sie nicht und gehst mit denselben Sohlen wieder hinaus. <span class="fein">nichts passiert</span>';
      S.geld-=6; S.ausr.schuhe.zustand = Math.min(100, S.ausr.schuhe.zustand+45);
      return 'Er sieht sie sich an, sagt etwas auf Italienisch, das nicht freundlich klingt, und näht trotzdem. Neue Sohlen, doppelt genagelt, und ein Stück Leder über der linken Ferse. <span class="fein">Schuhe +45 · −6 F</span>'; }},

  waffe:{label:'Die Muskete zerlegen und ölen',
    cost:'Waffenzustand ++',
    tu(){ S.ausr.muskete.zustand = Math.min(100, S.ausr.muskete.zustand+30); nutzen('muskete',0.5);
      return 'Schloss heraus, Feder ab, Pfanne blank, alles mit Öl und einem Lappen, den du dafür zerschnitten hast. Eine Muskete, die zündet, ist der Unterschied zwischen einem Soldaten und einem Mann mit einem Stock. <span class="fein">Muskete +30</span>'; }},

  lesen:{label:'Buchstaben lernen, gegen Bezahlung',
    cost:'Bildung · kostet 5 Francs',
    tu(){ if(S.geld<5) return 'Der Schreiber der Kompanie will fünf Francs für zwei Abende. Du hast sie nicht, und er hat keine Zeit zu verschenken. <span class="fein">nichts passiert</span>';
      S.geld-=5; S.attr.bildung=Math.min(100,S.attr.bildung+5); nutzen('verwaltung',1.5);
      return 'Der Kompanieschreiber malt dir Buchstaben in den Sand und wischt sie wieder weg. Am Ende des Abends kannst du drei Wörter, und eines davon ist dein Name. <span class="fein">Bildung +5 · −5 F</span>'; }},

  leute:{label:'Am Feuer sitzen bleiben',
    cost:'Kameradschaft und Fürsprache',
    tu(){ gunstGeben('martel',1); S.kameradschaft=Math.min(100,S.kameradschaft+8);
      S.belastung=Math.max(0,S.belastung-4); nutzen('menschenkenntnis',1);
      return 'Karten um Knöpfe, weil niemand Geld hat. Martel erzählt von der Rheinfront und lässt die Stellen weg, an denen es schlecht ausging. Du merkst dir, wer redet und wer zuhört. <span class="fein">Kameradschaft +8 · Gunst +1 · Belastung −4</span>'; }},

  fouragieren:{label:'Die Höfe in der Umgegend abgehen',
    cost:'Fouragieren · Geld und Essen',
    tu(){ const p = probe('fouragieren',40);
      if(p.erfolg){ S.geld+=7; S.atem=Math.min(100,S.atem+8);
        return 'Zwei Hühner, ein Sack Kastanien und ein Bauer, der lieber verkauft als beraubt wird. Du bringst mehr zurück, als du selbst brauchst, und das spricht sich herum. <span class="fein">+7 F · Atem +8</span>'; }
      S.belastung=Math.min(100,S.belastung+3);
      return 'Vier Stunden auf nassen Feldwegen. Die Höfe sind leer, die Leute sind in den Bergen, und ihr Vieh ist bei ihnen. <span class="fein">Belastung +3</span>'; }},

  ruhe:{label:'Schlafen und liegen bleiben',
    cost:'Leben, Belastung −10 · Atem +18 · bricht vielleicht ein Fieber',
    tu(){ S.belastung=Math.max(0,S.belastung-10);
      /* Ein Abend im Trockenen kann ein Fieber brechen — muss aber nicht. Das
         ist der einzige Ausweg aus einer Krankheit vor dem Winterquartier, und
         er ist absichtlich ein Wurf: Wer die Ruhr aus dem Sinai mitschleppt,
         verliert Abende, bis sie geht. */
      const krank = S.wunden.findIndex(w=>w.zehrt);
      let zusatz = '';
      if(krank>=0){
        const p = probe('konstitution', 35, true);   // ohne Übungseffekt, siehe probe()
        if(p.erfolg){ const w=S.wunden.splice(krank,1)[0]; atemKlemmen();
          /* **Was man überstanden hat, macht härter — aber nur, was man
             wirklich überstanden hat.** Der Punkt hängt am Erfolg der Probe,
             nicht am Zubettgehen; wer die Ruhr weiterschleppt, bekommt
             nichts. Die Probe selbst läuft weiterhin mit `ohneUebung`, damit
             nicht jeder Ruhe-Abend für sich schon Konstitution trainiert —
             das wäre die alte Falle, in der ausgerechnet der Kranke seinen
             Lebensvorrat übt. */
          S.attr.konstitution = (S.attr.konstitution|0) + 1;
          zusatz = ` Gegen Morgen ist das Fieber weg, und du weißt nicht, warum es gegangen ist und vorher nicht. <span class="fein">„${esc(w.name)}" überstanden · Konstitution +1</span>`; }
        else zusatz = ' Das Fieber bleibt. Es wird bei Dunkelheit stärker, und es wird jede Nacht bei Dunkelheit stärker. <span class="fein">Krankheit hält an</span>';
      }
      // Erst die Krankheit weg, dann heilen — sonst heilt man gegen den kleineren Vorrat.
      lebenAuffuellen(0.25); S.atem=Math.min(100,S.atem+18); atemKlemmen();
      return 'Du legst dich hin, sobald es dunkel wird, und stehst auf, als man dich tritt. Dazwischen war nichts, und nichts ist genau das, was du gebraucht hast. <span class="fein">Leben +25 % · Belastung −10 · Atem +18</span>' + zusatz; }},

  /* Ab Rang 3: nicht mehr üben, sondern üben lassen. */
  korporalschaft:{label:'Deine acht Mann drillen',
    cost:'Autorität und Drill · Ruf +1',
    tu(){ nutzen('autoritaet',2); nutzen('drill',2); S.ruf+=1;
      S.kameradschaft=Math.min(100,S.kameradschaft+6);
      return 'Du stellst acht Mann in zwei Glieder und lässt sie laden, bis es gleichzeitig knackt. Zwei von ihnen sind älter als du. Einer sieht dich an, als wolle er etwas sagen, und sagt es dann doch nicht. <span class="fein">Autorität und Drill steigen · Ruf +1 · Kameradschaft +6</span>'; }},

  /* ── Ab Rang 4: die Listen ──
     Der Fourrier hat keine neuen Kampfknöpfe, und das ist der Witz an ihm
     (KONZEPT: „ein Weg nach oben für schlechte Kämpfer"). Seine Arbeit liegt
     im Lager, und sie zahlt in der Währung, die er dafür braucht. */
  listen:{label:'Die Listen der Kompanie führen',
    cost:'Verwaltung und Bildung · Fürsprache',
    tu(){ const p = probe('verwaltung',35);
      nutzen('verwaltung',2); S.attr.bildung = Math.min(100, S.attr.bildung+2);
      if(p.erfolg){ gunstGeben('collot',1); gunstGeben('berthaud',1);
        return 'Bestand, Abgang, Zugang, dreimal nachgezählt, weil es beim zweiten Mal nie stimmt. Am Ende geht die Liste durch, ohne dass jemand etwas sagt — und das ist bei Listen das höchste Lob. <span class="fein">Verwaltung und Bildung steigen · Fürsprache Collot und Berthaud +1</span>'; }
      gunstGeben('berthaud',-1);
      return 'Zwölf Paar Schuhe fehlen, und du findest nicht heraus, wo sie geblieben sind. Der Lieutenant findet es auch nicht heraus, aber er weiß, auf wessen Blatt es steht. <span class="fein">Verwaltung steigt · Fürsprache Berthaud −1</span>'; }},

  ausgabe:{label:'Die Ausgabe verteilen',
    cost:'Wer bekommt die Schuhe zuerst?',
    tu(){ const p = probe('menschenkenntnis',35);
      if(p.erfolg){ S.kameradschaft=Math.min(100,S.kameradschaft+10); gunstGeben('collot',1);
        return 'Du gibst die Schuhe denen, die am längsten barfuß gehen, und nicht denen, die am lautesten fragen. Es dauert länger und macht zwei Leute wütend, aber am Abend erzählt es die Kompanie weiter. <span class="fein">Kameradschaft +10 · Fürsprache Collot +1</span>'; }
      S.kameradschaft=Math.max(0,S.kameradschaft-6); gunstGeben('berthaud',1); S.geld+=3;
      return 'Du gibst die Schuhe der Reihe nach aus, wie es die Liste vorsieht, und die Liste ist nach Dienstalter geordnet. Es geht schnell, der Lieutenant nickt, und drei Männer im hinteren Glied gehen weiter barfuß. <span class="fein">Kameradschaft −6 · Fürsprache Berthaud +1 · +3 F</span>'; }},

  /* ── Ab Rang 5: zwanzig Mann ── */
  rekruten:{label:'Die Rekruten für deine Sektion aussuchen',
    cost:'Menschenkenntnis · wer neben dir steht, entscheidet mit',
    tu(){ const p = probe('menschenkenntnis',40);
      guetePlus(p.erfolg ? 12 : -6);
      nutzen('autoritaet',1);
      return p.erfolg
        ? 'Du gehst die Neuen ab und siehst nicht auf die Schultern, sondern auf die Hände und auf die Augen. Zwei nimmst du, die niemand wollte, und einen Großen lässt du stehen. Man wird dich in vier Wochen dafür verstehen. <span class="fein">Deine Sektion wird besser</span>'
        : 'Du nimmst die Größten und die, die am geradesten stehen. Es sieht gut aus auf dem Hof. Was davon im Rauch übrig bleibt, wirst du sehen. <span class="fein">Deine Sektion wird schlechter</span>'; }},

  sektion:{label:'Deine zwanzig Mann exerzieren lassen',
    cost:'Autorität und Drill · Ruf +1 · deine Sektion hält besser',
    tu(){ nutzen('autoritaet',2.5); nutzen('drill',2.5); S.ruf+=1;
      guetePlus(8);
      return 'Zwanzig Mann in zwei Gliedern, Salve auf Kommando, vierzig Mal. Beim vierzigsten geht es gleichzeitig los, und das Geräusch ist ein einziges. Genau darum geht es: Zwanzig Musketen, die nacheinander knallen, sind Lärm. Zwanzig auf einmal sind eine Wand. <span class="fein">Autorität und Drill steigen · Ruf +1 · Sektion besser</span>'; }},

  tornister:{label:'Mit vollem Tornister auf den Hügel und zurück',
    cost:'Konstitution · Atem −10',
    tu(){ nutzen('konstitution',1.5); S.atem=Math.max(0,S.atem-10);
      return 'Sechzig Pfund auf den Rücken, dreimal den Hang hinauf. Die Grenadierkompanie steht dort, wo es am dicksten kommt, und wer dort nicht stehen bleiben kann, bleibt liegen. <span class="fein">Konstitution steigt · Atem −10</span>'; }},

  gelaende:{label:'Allein im Gelände üben',
    cost:'Geschick und Muskete · Atem −6',
    tu(){ nutzen('geschick',1.5); nutzen('muskete',1.5); S.atem=Math.max(0,S.atem-6);
      return 'Von Deckung zu Deckung, hinlegen, zielen, weiter. Vor der Linie gibt es keinen Nebenmann, der dir sagt, wann du aufstehst. Das musst du selbst wissen. <span class="fein">Geschick und Muskete steigen · Atem −6</span>'; }},

  /* ══════════════════ AB RANG 7 · DER OFFIZIER IM LAGER ══════════════════ */

  /* Die einzige Quelle, aus der der Säbel noch wächst. Ein Abend, den man
     nicht auf Listen, Kasse oder den Zug verwendet — und der sich erst
     auszahlt, wenn die Linie bricht. Meistens nie. */
  fechtboden:{label:'Auf den Fechtboden gehen',
    cost:'Säbel · der einzige Weg, auf dem er noch wächst',
    tu(){ nutzen('bajonett',2.5,true); S.atem=Math.max(0,S.atem-6);
      return 'Ein Fechtmeister, der vor der Revolution Adlige unterrichtet hat und jetzt Offiziere unterrichtet, die nicht lesen konnten, als er anfing. Er sagt, der Degen sei kein Bajonett, und du sollst aufhören zu stechen wie einer, der weitergehen will. <span class="fein">Säbel steigt · Atem −6</span>'; }},

  zugfuehren:{label:'Deinen Zug selbst antreten lassen',
    cost:'Autorität und Taktik · dein Zug hält besser',
    tu(){ nutzen('autoritaet',2.5); nutzen('taktik',2);
      guetePlus(8);
      S.einheit = Math.min(100,(S.einheit==null?70:S.einheit)+5);
      return 'Sechzig Mann, drei Sergenten, und die Sergenten machen die Arbeit. Deine besteht darin, dazustehen und an drei Stellen etwas zu sagen, das keiner der drei sagen könnte, ohne den anderen zu übergehen. <span class="fein">Autorität und Taktik steigen · dein Zug hält besser</span>'; }},

  karten:{label:'Die Karten des Abschnitts durchgehen',
    cost:'Kartenkunde und Taktik · zahlt erst im Gefecht',
    tu(){ nutzen('kartenkunde',2.5); nutzen('taktik',2);
      return 'Ein Blatt von 1793, auf dem drei Dörfer fehlen und ein Fluss falsch liegt. Der Adjutant sagt, es sei das beste, das sie haben. Du zeichnest den Weg nach, den ihr heute gegangen seid, und danach weißt du, wo ihr wirklich seid. <span class="fein">Kartenkunde und Taktik steigen</span>'; }},

  /* ── Ab Rang 8: der Adjutantenauftrag ──
     Drei Fertigkeiten, die zehn Ränge lang fast nichts getan haben, bekommen
     hier ihre Verwendung. Reihum, damit nicht dieselbe Probe dreimal kommt. */
  adjutant:{label:'Einen Auftrag des Bataillons übernehmen',
    cost:'Reiten, Kartenkunde oder Verwaltung · Fürsprache Vernet',
    tu(){ const arten = [
        ['reiten',40,'Eine Meldung nach Norden reiten, achtzehn Kilometer, zwei davon im Dunkeln.',
         'Du bist vor der Dämmerung dort und kannst hersagen, was du gesehen hast, ohne aufzusehen.',
         'Das Pferd bricht in einem Graben ein, und du kommst zwei Stunden zu spät. Die Meldung ist bis dahin überholt.'],
        ['kartenkunde',40,'Eine Stellung erkunden und aufzeichnen: welcher Hang, welcher Weg, wo man ein Bataillon verstecken kann.',
         'Deine Skizze geht ohne Rückfrage an den Stab, und drei Tage später steht darauf, wo die Batterien hinkommen.',
         'Du zeichnest den Bach auf der falschen Seite ein. Es fällt jemandem auf, der es besser weiß.'],
        ['verwaltung',40,'Einen Nachschubzug führen: elf Wagen, sechs Fuhrleute, die nicht Soldaten sind.',
         'Elf Wagen kommen an, und keiner davon leer. Das ist seltener, als es klingt.',
         'Zwei Wagen bleiben in Vaux stehen, weil ein Fuhrmann sich weigert, und du hast nichts, womit du ihn zwingen kannst.']];
      const a = arten[(S.auftraege||0) % 3];
      S.auftraege = (S.auftraege||0)+1;
      const p = probe(a[0], a[1]);
      if(p.erfolg){ gunstGeben('vernet',1); S.ruf += 1;
        return a[2]+' '+a[3]+' <span class="fein">Fürsprache Vernet +1 · Ruf +1</span>'; }
      gunstGeben('vernet',-1);
      return a[2]+' '+a[4]+' <span class="fein">Fürsprache Vernet −1</span>'; }},

  /* ── Ab Rang 9: die Kompaniekasse ──
     Historisch die *masses*, verwaltet vom Capitaine. Das Spiel kommentiert
     die Wahl nie — es zeigt ein halbes Jahr später einen Satz darüber, wie
     viele auf dem Marsch zurückgeblieben sind. Der Stachel steckt woanders:
     Du hast Veteranenpunkte für deine eigene Muskete ausgegeben und weißt
     deshalb genau, was gute Ausrüstung wert ist. */
  kasse_ganz:{label:'Die Kasse ausgeben, wie sie vorgesehen ist',
    cost:'0 F · Einheitszustand ++',
    tu(){ S.kasseQuartal = true;
      S.einheit = Math.min(100,(S.einheit==null?70:S.einheit)+25);
      return 'Schuhe für einundvierzig Mann, Hemden für neunzehn, ein Fass Branntwein und ein Wagen Stroh. Am Ende liegt der Rest in Kupfer auf dem Tisch, und der Rest ist nichts. <span class="fein">Einheitszustand +25</span>'; }},

  kasse_ueblich:{label:'Das Übliche abzweigen',
    cost:'+150 F · Einheitszustand + · es kann auffallen',
    tu(){ S.kasseQuartal = true; S.geld += 150;
      S.einheit = Math.min(100,(S.einheit==null?70:S.einheit)+10);
      S.kasseRisiko = (S.kasseRisiko||0) + 15;
      return 'Was jeder Capitaine nimmt, und was jeder Inspecteur weiß, dass jeder Capitaine nimmt. Die Schuhe kommen trotzdem, nur zwölf Paar weniger. <span class="fein">+150 F · Einheitszustand +10</span>'; }},

  /* ── Ab Rang 11: die Lieferantenverträge ──
     Dieselbe Struktur wie die Kompaniekasse, eine Größenordnung darüber, mit
     demselben Schweigen. Ein Colonel bestellt Tuch, Schuhe und Brot für
     zweitausend Mann; wer die Lieferung bekommt, entscheidet er. */
  vertrag_sauber:{label:'Den Vertrag an den vergeben, der liefert',
    cost:'0 F · Einheitszustand ++',
    tu(){ S.kasseQuartal = true;
      S.einheit = Math.min(100,(S.einheit==null?70:S.einheit)+30);
      return 'Der Tuchhändler aus Elbeuf ist der teuerste von dreien und der einzige, dessen Ware nach dem ersten Regen noch Tuch ist. Du nimmst ihn. Der Intendant zieht die Augenbrauen hoch und schreibt es auf. <span class="fein">Einheitszustand +30</span>'; }},

  vertrag_still:{label:'Den Vertrag an den vergeben, der zahlt',
    cost:'+600 F · Einheitszustand − · es fällt wahrscheinlich auf',
    tu(){ S.kasseQuartal = true; S.geld += 600;
      S.einheit = Math.max(0,(S.einheit==null?70:S.einheit)-15);
      S.kasseRisiko = (S.kasseRisiko||0) + 35;
      return 'Er kommt selbst, im eigenen Wagen, und er redet zwanzig Minuten über etwas anderes, ehe er zur Sache kommt. Die Sache ist ein Betrag, und der Betrag ist das Doppelte dessen, was ein Colonel im Jahr bekommt. <span class="fein">+600 F · Einheitszustand −15</span>'; }},

  kasse_voll:{label:'Kräftig zulangen',
    cost:'+400 F · Einheitszustand − · es fällt wahrscheinlich auf',
    tu(){ S.kasseQuartal = true; S.geld += 400;
      S.einheit = Math.max(0,(S.einheit==null?70:S.einheit)-10);
      S.kasseRisiko = (S.kasseRisiko||0) + 40;
      return 'Du schreibst die Zahlen so, dass sie stimmen, und sie stimmen. Vierhundert Francs sind ein Pferd und eine Uniform, die nicht aussieht wie die eines Sergenten, der Glück gehabt hat. <span class="fein">+400 F · Einheitszustand −10</span>'; }}
};

/* Unteroffiziere sind vom Wachdienst und von den Handreichungen befreit, die
   den Füsilier den halben Abend kosten — dafür haben sie die Korporalschaft am
   Hals. Ein Rang gibt also nicht nur einen Knopf mehr, sondern auch den Abend,
   an dem man ihn drücken kann; sonst verdrängt die Dienstpflicht die eigene
   Ausbildung. Ab Sergent noch einen. */
function abendeFuer(n){ return n.abende + (S.rang>=5 ? 2 : S.rang>=3 ? 1 : 0); }

function lagerHandlungen(n){
  const ids = (n.tun||[]).slice();
  if(S.rang>=3) ids.push('korporalschaft');
  if(S.rang>=4) ids.push('listen','ausgabe');
  if(S.rang>=5) ids.push('rekruten','sektion');
  /* Ab dem Patent fällt weg, was die Muskete betraf, und es kommt hinzu, was
     eine Einheit betrifft. Der Fechtboden steht dabei allein: Er ist die
     einzige Handlung im Spiel, die einen Wert gegen sein eigenes Verkümmern
     verteidigt, statt ihn zu steigern. */
  if(S.rang>=7) ids.push('fechtboden','zugfuehren','karten');
  if(S.rang>=8) ids.push('adjutant');
  if(S.rang>=9 && S.rang<11 && !S.kasseQuartal) ids.push('kasse_ganz','kasse_ueblich','kasse_voll');
  if(S.rang>=11 && !S.kasseQuartal) ids.push('vertrag_sauber','vertrag_still');
  if(S.zweig==='grenadier') ids.push('tornister');
  if(S.zweig==='voltigeur') ids.push('gelaende');
  /* Ein Offizier exerziert nicht mehr selbst und trägt keine Muskete mehr —
     die Lagerhandlungen, die daran hängen, verschwinden mit ihr. */
  if(S.rang>=7) return ids.filter(id=>LAGER_TUN[id]
    && !['exerzieren','bajonett','scharf','waffe','gelaende','tornister'].includes(id));
  return ids.filter(id=>LAGER_TUN[id]);
}

/* ══════════════════ DER INSPECTEUR AUX REVUES ══════════════════

   **Die Kasse hat keinen Moralbalken, sondern eine Zahl und einen Beamten.**
   Der Einheitszustand (0–100) ist das, was hundertzwanzig Männer an den Füßen
   haben; der Inspecteur ist der, der es aufschreibt. Beides zusammen macht aus
   einer Unterschlagung eine Entscheidung statt einer Versuchung: Der Gewinn
   ist sofort und in Francs, der Preis kommt ein halbes Jahr später und in
   Männern, die auf dem Marsch zurückbleiben.

   **Das Spiel kommentiert die Wahl nie.** Es zeigt die Zahl, es zeigt den
   Satz über die Zurückgebliebenen, und es sagt nicht, ob das schlimm war. */
function inspektion(){
  if(S.rang<9) return '';
  const z = (S.einheit==null ? (S.einheit=70) : S.einheit);
  const risiko = S.kasseRisiko||0;
  let t = '', ertappt = false;
  if(risiko>0 && Math.random()*100 < risiko){
    ertappt = true; S.kasseRisiko = 0;
    /* Bei Entdeckung sind Rang **und** Fürsprecher weg — das ist die schärfste
       Strafe, die das Spiel außerhalb des Todes kennt, und sie ist angesagt. */
    S.rang = Math.max(6, S.rang-1); S.ruf = Math.max(0, S.ruf-20);
    gunstGeben('vernet',-4); gunstGeben('grandmaison',-3);
    t = `<div class="wirkung"><span>Der Inspecteur aux revues</span>
      Er rechnet die Ausgabelisten gegen die Bestandslisten und braucht dafür einen Vormittag. Am Nachmittag steht er auf und geht zum Chef de bataillon, ohne dich anzusehen. Was danach passiert, passiert schnell und ohne Verhandlung.
      <b>Rang zurück · Ruf −20 · Fürsprache Vernet −4</b></div>`;
  } else {
    S.kasseRisiko = Math.max(0, risiko-10);
    const wem = 'vernet';
    if(z>=75){ gunstGeben(wem,1);
      t = `<div class="wirkung"><span>Der Inspecteur aux revues</span>
        Er lässt die Kompanie antreten und geht die Reihen ab, Schuhe, Hemden, Tornister. Nach zwanzig Mann hört er auf zu zählen. <b>Einheitszustand ${Math.round(z)} · Fürsprache Vernet +1</b></div>`; }
    else if(z<40){ gunstGeben(wem,-1);
      t = `<div class="wirkung"><span>Der Inspecteur aux revues</span>
        Er lässt die Kompanie antreten und findet neunzehn Mann ohne brauchbare Schuhe. Er schreibt neunzehn auf. Er fragt nicht, warum. <b>Einheitszustand ${Math.round(z)} · Fürsprache Vernet −1</b></div>`; }
    else t = `<div class="wirkung"><span>Der Inspecteur aux revues</span>
        Er geht die Reihen ab, schreibt eine Zahl auf und geht zur nächsten Kompanie. <b>Einheitszustand ${Math.round(z)}</b></div>`;
  }
  return t;
}

/* Der Zustand zehrt sich zwischen den Lagern ab — Schuhe halten nicht ewig.
   Unter 40 steigt die Krankheitsrate, unter 20 verliert jeder Marsch Männer;
   beides wird an der Station gerechnet, nicht angekündigt. */
function einheitZehren(){
  if(S.rang<9) return '';
  if(S.einheit==null) S.einheit = 70;
  S.einheit = Math.max(0, S.einheit - 2);
  if(S.einheit < 20 && Math.random()<0.5){
    S.ruf = Math.max(0,S.ruf-1);
    return 'Auf dem Marsch bleiben vier zurück. Keiner davon ist verwundet.';
  }
  if(S.einheit < 40 && Math.random()<0.3){
    S.belastung = Math.min(100, S.belastung+4);
    return 'Der Feldscher meldet elf Kranke. Vor einem Monat waren es drei.';
  }
  return '';
}

/* Das Lager ist der angesagte Halt: Hier wird der Feldzug gesichert und
   gesagt, dass er gesichert ist. Danach läuft die Sicherung still weiter, damit
   Aufhören zurückbringt, wo man war, und nicht, wo man zuletzt gerastet hat. */
function zeigeLager(n){
  const L = LAUF.lager;
  if(L.id !== n.id){ L.id = n.id; L.abende = abendeFuer(n); L.log = []; L.gesichert = Ablage.dauerhaft;
    L.sold = soldAuszahlen();
    S.kasseQuartal = false;              // jedes Lager ist ein neues Quartal
    L.inspektion = inspektion();
    laufSichern(); }
  const opt = lagerHandlungen(n).map((id,i)=>{
    const t = LAGER_TUN[id];
    return wahlZeile(roemisch(i+1), t.label, t.cost, `lagerTun('${id}')`, {gesperrt:L.abende<=0});
  }).join('')
    + (L.abende<=0 ? wahlZeile('·','Antreten lassen','Der Abend ist vorbei','lagerEnde()',{klasse:'weiter'}) : '');
  app.innerHTML = `<div class="stage">${verlauf()}<div>${wegband(n)}
    ${bogen(n,
      `<div class="prose">${n.text.map(t=>`<p>${t}</p>`).join('')}</div>
       ${L.log.length?`<div class="ergebnis">${L.log.join('<br><br>')}</div>`:''}
       ${L.sold?`<div class="wirkung"><span>Sold</span>${soldText(L.sold)} <b>+${L.sold.toFixed(2)} F</b></div>`:''}
       ${L.inspektion||''}
       ${L.gesichert?'<div class="wirkung"><span>Feldzug gesichert</span>Du kannst hier aufhören und später weitermachen. Wer fällt, verliert den Spielstand im selben Augenblick.</div>':''}`,
      ['Womit verbringst du den Abend?',
       `Verbleibend ${L.abende} von ${abendeFuer(n)}${abendeFuer(n)>n.abende?` · ${(abendeFuer(n)-n.abende)===1?'ein Abend':'zwei Abende'} mehr als ${rangName(S.rang)}`:''}`],
      opt,
      'Es ist immer mehr zu tun als Zeit da ist')}
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}
function lagerTun(id){
  const L = LAUF.lager;
  if(L.abende<=0) return;
  L.abende--;
  L.log.push(LAGER_TUN[id].tu());
  S.log.push(L.id+': '+LAGER_TUN[id].label);
  atemKlemmen();
  laufSichern();
  zeigeLager(KAPITEL[LAUF.node]);
}
function lagerEnde(){ LAUF.lager = {id:null, abende:0, log:[]}; stationErledigt(); naechster(); }

/* Was der Zahlmeister dazu sagt. Die Höhe verrät, wie lange nicht gezahlt
   wurde und in welcher Kampagne man steht — der Text muss das nicht erklären,
   er muss nur den richtigen Ton haben. */
function soldText(betrag){
  const f = soldFaktor();
  if(f <= 0.35) return 'Der Zahlmeister zahlt aus, was er hat, und was er hat, ist ein Bruchteil dessen, was auf der Liste steht. Es unterschreibt trotzdem jeder.';
  if(f <= 0.6)  return 'Gezahlt wird in einer Münze, die hier gilt und zu Hause nichts wert ist. Der Fourier rechnet um, und niemand kann nachprüfen, ob er richtig rechnet.';
  if(f >= 0.9)  return 'Der Zahlmeister sitzt an einem Tisch mit einer Kassette, ruft die Namen der Reihe nach auf und zählt vor. Es stimmt, und dass es stimmt, ist neu genug, dass man es erwähnt.';
  return 'Sold, endlich. Man stellt sich an, unterschreibt mit einem Kreuz oder mit einem Namen, und zählt danach noch einmal nach.';
}

/* ══════════════════ WINTERQUARTIER UND SAISON ══════════════════

   Dieselbe Maschine trägt zwei Dinge: das Winterquartier zwischen zwei
   Feldzügen (drei Wochen, fünf Handlungen) und die **Saison** des
   Garnisonskapitels (mehr Wochen, andere Handlungen, ein einmaliges Fenster).

   Deshalb steht die Auswahl seit dem 28.07.2026 **in den Kapiteldaten**, nicht
   mehr fest im Code: `tun:[...]` nennt die Handlungen, `wochen:` die Zahl,
   `frage:` die Zeile über den Knöpfen. Ohne diese Felder verhält sich alles wie
   das alte Winterquartier — die bestehenden Kapitel mussten nicht angefasst
   werden. */

const WINTER_TUN = {

  ausr:{label:'Ausrüstung instand setzen', cost:'Schuhe, Muskete und Tornister flicken',
    tu(){ for(const k in S.ausr) if(S.ausr[k].verschleiss) S.ausr[k].zustand = Math.min(100, S.ausr[k].zustand+30);
      return 'Eine Woche Draht, Pech und Leder. Die Schuhe halten wieder, das Schloss der Muskete ist trocken. <span style="color:var(--faint)">Alle Ausrüstung +30</span>'; }},

  drill:{label:'Drillen und schießen üben', cost:'Muskete und Drill steigen',
    tu(){ nutzen('muskete',3); nutzen('drill',3); nutzen('bajonett',2);
      return 'Exerzieren auf einem gefrorenen Feld, bis die Handgriffe von allein gehen. <span style="color:var(--faint)">Muskete, Drill und Bajonett steigen</span>'; }},

  lesen:{label:'Lesen und Schreiben üben', cost:'Bildung und Verwaltung · kostet 6 Francs',
    tu(){ if(S.geld>=6){ S.geld-=6; S.attr.bildung=Math.min(100,S.attr.bildung+7); nutzen('verwaltung',2);
        return 'Ein Sergent aus Lyon bringt dir Buchstaben bei, gegen Schnaps und sechs Francs. Es ist mühsamer als Grabenschaufeln. <span style="color:var(--faint)">Bildung +7 · −6 F</span>'; }
      return 'Du hast keine sechs Francs. Der Sergent lacht und dreht sich um. <span style="color:var(--faint)">nichts passiert</span>'; }},

  leute:{label:'Zeit mit Martel und den Männern verbringen', cost:'Gunst und Kameradschaft',
    tu(){ gunstGeben('martel',2); S.kameradschaft=Math.min(100,S.kameradschaft+10); S.belastung=Math.max(0,S.belastung-5);
      nutzen('menschenkenntnis',2);
      return 'Karten, Wein und Geschichten, die jedes Mal besser werden. Martel erzählt vom Rhein, und du hörst zu. <span style="color:var(--faint)">Gunst +2 · Kameradschaft +10</span>'; }},

  /* Die einzige Handlung, die den Lebensvorrat wirklich wieder auffüllt — und
     sie kostet eine der Wochen. Wer verwundet aus dem Feldzug kommt, muss sich
     zwischen Genesung und Ausbildung entscheiden.

     Reihenfolge: **erst die Wunde heraus, dann heilen.** Andersherum rechnete
     `lebenAuffuellen` gegen den wundenverkleinerten Vorrat, und die teuerste
     Woche des Spiels verschenkte einen Teil ihrer Wirkung. */
  ruhe:{label:'Schlafen, essen, nichts tun', cost:'Leben und Belastung erholen sich, Wunden heilen',
    tu(){ S.belastung=Math.max(0,S.belastung-16);
      const krank = S.wunden.findIndex(w=>w.zehrt);          // Krankheiten zuerst
      if(krank>=0) S.wunden.unshift(S.wunden.splice(krank,1)[0]);
      const weg = S.wunden.length ? S.wunden.shift() : null;
      lebenAuffuellen(0.6); S.atem=100; atemKlemmen();
      return weg
        ? `${weg.zehrt?'Das Fieber geht in der zweiten Woche':'Die Wunde („'+esc(weg.name)+'") schließt sich endlich'}. <span style="color:var(--faint)">Leben +60 % · Belastung −16 · „${esc(weg.name)}" überstanden</span>`
        : 'Du schläfst, isst zweimal am Tag und tust drei Wochen lang nichts Nützliches. Es hilft mehr als alles andere. <span style="color:var(--faint)">Leben +60 % · Belastung −16</span>'; }}
};

/* ── Handlungen der Garnisonssaisons (Kapitel 3) ──

   **Im Krieg ist der Feind die Kugel, im Frieden ist es die Zeit.** Die Maschine
   bleibt dieselbe, die Währung wechselt: Es gibt keine Vakanzen zu erben und
   keinen Ruf zu erkämpfen, sondern nur das, was man aus vier Jahren macht.
   Deshalb zahlen diese Handlungen in Bildung, Geld und Beziehungen — und
   deshalb ist die Knappheit dieselbe wie im Lager: mehr zu tun als Wochen. */

  const GARNISON_TUN = {

  schule:{label:'Die Regimentsschule besuchen', cost:'Bildung — der Flaschenhals des ganzen Spiels',
    tu(){ const p = probe('bildung', 20, true);
      /* Der Sprung ist absichtlich groß. Kapitel 3 ist das einzige Fenster, in
         dem ein Analphabet auf die 35 des Fourriers und in die Nähe der 50
         kommt, die Rang 7 später verlangt. Wer die Jahre vertrödelt, sitzt fest
         — das ist der „Rangstillstand als Druckmittel" aus KONZEPT §9. */
      const zu = p.erfolg ? 9 : 5;
      S.attr.bildung = Math.min(100, S.attr.bildung + zu);
      nutzen('verwaltung', 2);
      return p.erfolg
        ? `Ein invalider Sergent mit einer Hand unterrichtet zwölf Mann in einem Stall. Er lässt dich Buchstaben abschreiben, bis die Hand weh tut, und nennt es Dienst. In der dritten Woche liest du eine Seite ohne Hilfe. <span style="color:var(--faint)">Bildung +${zu} · Verwaltung steigt</span>`
        : `Die Buchstaben bleiben Zeichen, und der Sergent wird laut. Etwas bleibt trotzdem hängen, weil etwas immer hängen bleibt. <span style="color:var(--faint)">Bildung +${zu} · Verwaltung steigt</span>`; }},

  fechtboden:{label:'Auf den Fechtboden gehen', cost:'Bajonett und Geschick · in Nîmes wird viel gefochten',
    tu(){ nutzen('bajonett',3); nutzen('geschick',1.5); S.atem=Math.max(0,S.atem-4);
      return 'Der Waffenmeister des Regiments ist ein Piemonteser, der behauptet, er habe unter dem König gedient, und keiner fragt nach, unter welchem. Er zeigt dir, wie man mit dem Bajonett nicht sticht, sondern schiebt. <span style="color:var(--faint)">Bajonett und Geschick steigen · Atem −4</span>'; }},

  verdienst:{label:'Nebenher arbeiten', cost:'Francs · in der Stadt wird gebaut',
    tu(){ const p = probe('konstitution', 30, true);
      const f = p.erfolg ? 14 : 7;
      S.geld += f; S.atem = Math.max(0, S.atem-6); S.belastung = Math.min(100, S.belastung+3);
      return p.erfolg
        ? `Die Seidenmanufaktur am Fluss nimmt Soldaten für den Tag, weil Soldaten billiger sind als Tagelöhner und nicht verhandeln. Es ist stumpf, es ist erlaubt, und am Samstag zahlen sie. <span style="color:var(--faint)">+${f} F · Atem −6 · Belastung +3</span>`
        : `Zwei Wochen Ziegel schleppen für einen Bauunternehmer, der am Ende weniger zahlt, als er versprochen hat. Beschweren kann man sich bei niemandem. <span style="color:var(--faint)">+${f} F · Atem −6 · Belastung +3</span>`; }},

  wirtshaus:{label:'Die Abende im Wirtshaus verbringen', cost:'Kameradschaft und Belastung · kostet Francs',
    tu(){ const kosten = Math.min(S.geld, 8);
      S.geld -= kosten;
      S.kameradschaft = Math.min(100, S.kameradschaft + (kosten>=8?12:5));
      S.belastung = Math.max(0, S.belastung - (kosten>=8?10:4));
      gunstGeben('martel',1);
      nutzen('menschenkenntnis',1.5);
      return kosten>=8
        ? 'Vier Jahre Frieden bestehen aus Abenden, und die Abende bestehen aus Wein, Karten und denselben Geschichten. Martel erzählt Ägypten inzwischen so, dass es besser klingt, als es war. Niemand widerspricht. <span style="color:var(--faint)">Kameradschaft +12 · Belastung −10 · Fürsprache Martel +1 · −8 F</span>'
        : 'Du sitzt dabei und trinkst, was andere ausgeben. Es ist nicht dasselbe, und alle merken es. <span style="color:var(--faint)">Kameradschaft +5 · Belastung −4 · Fürsprache Martel +1</span>'; }},

  /* ── Der Marketender ──
     KONZEPT und die Aufgabenliste führten „Ausrüstungskauf im Spiel" lange als
     offenen Punkt: Geld hatte zu wenig Verwendung. Hier ist die natürliche
     Anbindung — eine Garnison hat Läden, ein Feldlager nicht.

     Gekauft wird in **Francs**, nicht in Veteranenpunkten. Das ist die Grenze,
     die Invariante 3 zieht: Der Vorrat kauft den Ausgangspunkt eines Mannes,
     Francs kaufen, was dieser eine Mann sich im Feld leisten kann. Beides sind
     Ausrüstungsgegenstände, aber nur eines davon überlebt seinen Tod. */
  marketender:{label:'Zum Marketender gehen', cost:'Ausrüstung gegen Francs · was der Sold hergibt',
    tu(){
      const angebot = [
        {k:'schuhe',   preis:14, zu:45, was:'ein Paar doppelt genähte Schuhe'},
        {k:'mantel',   preis:18, zu:50, was:'einen Mantel, den ein Schneider gemacht hat'},
        {k:'muskete',  preis:10, zu:35, was:'eine Überholung des Schlosses beim Büchsenmacher'},
        {k:'tornister',preis:8,  zu:40, was:'einen neuen Tornisterriemen aus Rindsleder'}
      ];
      /* Gekauft wird, was am nötigsten ist und noch bezahlbar — der Spieler
         entscheidet über die Woche, der Marketender über die Reihenfolge. So
         bleibt es ein Knopf und wird kein zweiter Laden mit eigener Oberfläche. */
      const offen = angebot.filter(a=>S.ausr[a.k] && S.ausr[a.k].zustand < 70 && S.geld >= a.preis)
                           .sort((a,b)=> S.ausr[a.k].zustand - S.ausr[b.k].zustand);
      if(!offen.length){
        if(S.geld < 8) return 'Der Marketender führt alles, was ein Soldat braucht, und nichts davon auf Kredit. Du siehst dir die Auslage an und gehst wieder. <span style="color:var(--faint)">zu wenig Geld</span>';
        return 'Deine Ausrüstung ist in Ordnung, und der Marketender merkt das schneller als du. Er versucht es mit einem Fernrohr und einer Uhr und lässt dich dann in Ruhe. <span style="color:var(--faint)">nichts Nötiges im Angebot</span>';
      }
      const kauf = offen[0];
      S.geld -= kauf.preis;
      S.ausr[kauf.k].zustand = Math.min(100, S.ausr[kauf.k].zustand + kauf.zu);
      return `Der Marketender ist ein entlassener Sergent aus dem 14., der jetzt mehr verdient als je im Dienst. Du kaufst ${kauf.was}. Er rechnet zweimal nach, zu seinen Gunsten, und ihr wisst es beide. <span style="color:var(--faint)">${S.ausr[kauf.k].name} +${kauf.zu} · −${kauf.preis} F</span>`; }},

  /* ── Ab Rang 4: die Listen einer Garnison ── */
  magazin:{label:'Das Magazin verwalten', cost:'Verwaltung und Francs · Fürsprache Collot',
    tu(){ const p = probe('verwaltung', 35);
      nutzen('verwaltung',2.5); S.attr.bildung = Math.min(100, S.attr.bildung+3);
      if(p.erfolg){ gunstGeben('collot',1); S.geld += 6;
        return 'Vier Jahre Frieden heißt vier Jahre Bestand, und ein Bestand, der stimmt, ist in einer Garnison seltener als einer, der nicht stimmt. Du findest zweimal einen Fehler, bevor ihn jemand anders findet. <span style="color:var(--faint)">Verwaltung und Bildung steigen · Fürsprache Collot +1 · +6 F</span>'; }
      gunstGeben('collot',-1);
      return 'Der Bestand stimmt nicht, und diesmal findet es der Sergent-fourrier zuerst. Es waren keine sechzig Francs, es waren vierzig, aber der Unterschied interessiert ihn nicht. <span style="color:var(--faint)">Verwaltung und Bildung steigen · Fürsprache Collot −1</span>'; }},

  /* ── Ab Rang 5: der Sergent in der Garnison ──
     Ausdrücklicher Wunsch: Der Sergent bleibt, wo er ist, soll aber in der
     Garnison etwas Lohnendes zu tun haben. Alle drei zahlen auf das ein, was
     ihn im Feld ausmacht — die Sektion —, und keine davon geht im Feld. */
  ausbilden:{label:'Die Rekruten des Jahrgangs ausbilden', cost:'Autorität und Drill · deine Sektion wird besser',
    tu(){ const p = probe('autoritaet', 40);
      nutzen('autoritaet',3); nutzen('drill',3);
      guetePlus(p.erfolg ? 14 : 5);
      if(p.erfolg) S.ruf += 1;
      return p.erfolg
        ? 'Die Konskribierten des Jahrgangs XI sind achtzehn und haben noch nie einen Toten gesehen. Du hast vier Wochen, ihnen die zwölf Handgriffe beizubringen, und du nimmst dir acht. Danach laden sie im Schlaf. <span style="color:var(--faint)">Autorität und Drill steigen · Ruf +1 · Sektion besser</span>'
        : 'Du brüllst zu viel und erklärst zu wenig, und am Ende laden sie schnell und falsch. Im Frieden fällt das niemandem auf. <span style="color:var(--faint)">Autorität und Drill steigen · Sektion etwas besser</span>'; }},

  schreiber:{label:'Dem Capitaine die Berichte schreiben', cost:'Bildung und Fürsprache Berthaud · nur wer schreiben kann',
    tu(){ if(S.attr.bildung < 30)
        return 'Du bietest es an. Der Capitaine sieht deine Handschrift an, sagt nichts und gibt das Blatt einem anderen. <span style="color:var(--faint)">nichts passiert</span>';
      const p = probe('bildung', 40);
      S.attr.bildung = Math.min(100, S.attr.bildung+4); nutzen('verwaltung',2);
      if(p.erfolg){ gunstGeben('berthaud',1); gunstGeben('vernet',1);
        return 'Monatsberichte, Krankenlisten, Schuhbestände. Es ist die langweiligste Arbeit, die du je gemacht hast, und sie findet in einem Zimmer statt, in dem der Capitaine sitzt. Er weiß jetzt, wie du heißt. <span style="color:var(--faint)">Bildung +4 · Fürsprache Berthaud und Vernet +1</span>'; }
      return 'Du brauchst für zwei Seiten einen ganzen Abend, und am Ende schreibt der Fourier sie noch einmal ab. Gelernt hast du trotzdem etwas. <span style="color:var(--faint)">Bildung +4 · Verwaltung steigt</span>'; }},

  strafdienst:{label:'Über die Strafen entscheiden', cost:'Menschenkenntnis · Kameradschaft gegen Fürsprache',
    tu(){ const p = probe('menschenkenntnis', 40);
      nutzen('autoritaet',1.5);
      if(p.erfolg){ S.kameradschaft = Math.min(100,S.kameradschaft+8); gunstGeben('berthaud',1);
        return 'Zwei deiner Leute kommen zu spät aus der Stadt zurück, einer davon zum dritten Mal. Du meldest den einen und behältst den anderen für dich, und beide wissen genau, warum. <span style="color:var(--faint)">Kameradschaft +8 · Fürsprache Berthaud +1</span>'; }
      S.kameradschaft = Math.max(0,S.kameradschaft-8); gunstGeben('berthaud',1);
      return 'Du meldest beide. Es ist korrekt, es steht so im Reglement, und es kostet dich mehr, als du gedacht hättest. <span style="color:var(--faint)">Kameradschaft −8 · Fürsprache Berthaud +1</span>'; }}
};
Object.assign(WINTER_TUN, GARNISON_TUN);

const WINTER_STANDARD = ['ausr','drill','lesen','leute','ruhe'];

function winterHandlungen(n){
  const ids = (n.tun && n.tun.length ? n.tun : WINTER_STANDARD).slice();
  if(n.rangTun) for(const r in n.rangTun) if(S.rang >= +r) ids.push(...n.rangTun[r]);
  if(S.zweig==='grenadier' && n.zweigTun && n.zweigTun.grenadier) ids.push(...n.zweigTun.grenadier);
  if(S.zweig==='voltigeur' && n.zweigTun && n.zweigTun.voltigeur) ids.push(...n.zweigTun.voltigeur);
  return ids.filter((id,i,a)=>WINTER_TUN[id] && a.indexOf(id)===i);
}
function wochenFuer(n){ return n.wochen || 3; }

function zeigeWinter(n){
  const W = LAUF.winter;
  if(W.ort !== n.id){                       // neue Saison: Wochen frisch setzen
    W.ort = n.id; W.wochen = wochenFuer(n); W.log = []; W.gesichert = Ablage.dauerhaft;
    /* Wochen unter einem Dach, mit Sold und zweimal Essen am Tag: Der Atem ist
       danach voll, ohne dass man dafür eine Woche opfern müsste. Belastung und
       Wunden bleiben Sache der Wochenverteilung — die sitzen tiefer. */
    W.atemVoll = S.atem < S.leben; S.atem = 100; atemKlemmen();
    W.sold = soldAuszahlen();
    laufSichern();
  }
  const opt = winterHandlungen(n).map((id,i)=>{
    const t = WINTER_TUN[id];
    return wahlZeile(roemisch(i+1), t.label, t.cost, `winterTun('${id}')`, {gesperrt:W.wochen<=0});
  }).join('');
  const schluss = W.wochen<=0
    ? wahlZeile('·', esc(n.weiter||'Ins Feld zurück'), 'Die Wochen sind vorbei',
        winterMusterung(n)?'winterBefoerderung()':'winterEnde()', {klasse:'weiter'})
    : '';
  app.innerHTML = `<div class="stage">${verlauf()}<div>${wegband(n)}
    ${bogen(n,
      `<div class="prose">${(n.text||[]).map(t=>`<p>${t}</p>`).join('')}</div>
       ${W.log.length?`<div class="ergebnis">${W.log.join('<br><br>')}</div>`:''}
       ${W.atemVoll?`<div class="wirkung"><span>Wieder bei Atem</span>${n.atemText||'Drei Wochen unter einem Dach, Sold und zweimal Essen am Tag.'} ${S.atem<100?'So ausgeruht, wie es dein Zustand zulässt — mehr Luft gibt der Körper nicht her, solange er nicht heil ist.':'Du bist ausgeruht, wie du es seit April nicht warst.'} <b>Atem ${S.atem}</b></div>`:''}
       ${W.sold?`<div class="wirkung"><span>Sold</span>${soldText(W.sold)} <b>+${W.sold.toFixed(2)} F</b></div>`:''}
       ${W.gesichert?'<div class="wirkung"><span>Feldzug gesichert</span>Du kannst hier aufhören und später weitermachen. Wer fällt, verliert den Spielstand im selben Augenblick.</div>':''}`,
      [esc(n.frage||'Womit verbringst du die Woche?'), `Verbleibend ${W.wochen} von ${wochenFuer(n)}`],
      opt+schluss,
      'Drei Wochen unter einem Dach')}
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}
function winterTun(id){
  const W = LAUF.winter;
  if(W.wochen<=0 || !WINTER_TUN[id]) return;
  W.wochen--;
  W.log.push(WINTER_TUN[id].tu());
  S.log.push((KAPITEL[LAUF.node]||{}).ort+': '+WINTER_TUN[id].label);
  if(S.kaeufe.includes('flasche')) S.belastung=Math.max(0,S.belastung-2);
  atemKlemmen();
  laufSichern();
  zeigeWinter(KAPITEL[LAUF.node]);
}
function winterEnde(){ LAUF.winter = {ort:null, wochen:3, log:[]}; stationErledigt(); naechster(); }

/* ── Die Musterung im Winterquartier ──
   **Sonst verhungern acht Ränge an sechs Musterungen.** Vier Kapitel haben
   sechs `befoerderung`-Stationen; eine vierzehnstufige Leiter braucht mehr
   Gelegenheiten als das, sonst steht ein Mann mit erfüllten Schwellen und
   freier Stelle ein halbes Kapitel lang daneben.

   Winterquartier und Saison sind der natürliche zweite Ort: Dort wird ohnehin
   abgerechnet, es ist ruhig, und der Capitaine hat einen Tisch. Geprüft wird
   erst beim Verlassen — wer eine Woche verbringt, soll sie erst verbringen. */
function winterMusterung(n){
  if(!S || !leiterZiel()) return false;
  S.winterMusterung = S.winterMusterung || {};
  if(S.winterMusterung[n.id]) return false;
  S.winterMusterung[n.id] = true;
  return true;
}

/* Die Beförderung im Winterquartier benutzt denselben Bildschirm wie die
   Musterung — nur die Station drumherum ist eine andere. */
function winterBefoerderung(){
  const n = KAPITEL[LAUF.node];
  LAUF.winter = {ort:null, wochen:3, log:[]};
  zeigeBefoerderung(Object.assign({}, n, {
    ort:'Musterung im Quartier',
    text:['Bevor es zurück ins Feld geht, wird durchgezählt. Der Capitaine sitzt an einem Tisch, den jemand aus einem Bauernhaus getragen hat, und geht die Namen durch.',
          'Es ist keine Zeremonie. Es ist Buchhaltung, und die Buchhaltung entscheidet, wer morgen was trägt.']
  }));
}

/* ══════════════════ WERTUNG UND ENDE ══════════════════ */

function stationen(){ return Math.min(KAPITEL.length, LAUF.node+1); }

/* Wie viele Kapitel dieser Mann hinter sich gebracht hat.

   Die volle Skala zahlt **je überlebtem Kapitel**, nicht je Station (KONZEPT
   §5): Ein Kapitel ist ein Feldzug, und ein halber Feldzug ist keiner. Das ist
   der Unterschied zur Prototypskala — die zahlte 2 VP je Station und belohnte
   damit auch den, der auf Station 30 von 32 fiel, fast wie den, der ankam. */
function kapitelUeberlebt(){
  let grenze = 0, zahl = 0;
  for(const k of KAMPAGNEN){
    const st = STATIONEN[k.id];
    if(!st || !st.length) continue;          // ungebaute Kapitel zählen nicht mit
    grenze += st.length;
    if(stationen() >= grenze) zahl++;
  }
  return zahl;
}

/* Die volle Skala aus KONZEPT §5. Die Rangwerte (0/12/26/42/62) standen schon
   immer darin; seit Rang 4 und 5 erreichbar sind, ziehen die Zuschläge nach —
   vorher rechneten Rang und Zuschläge in zwei verschiedenen Skalen, und ein
   Sergentenlauf bekam dadurch überproportional viel.

   `ueberleben` bleibt bei 25 und ist der Platzhalter für den gestaffelten
   Überlebensbonus (70/120/180), der erst mit dem freiwilligen Ausstieg an den
   Rangschranken Sinn ergibt — den gibt es noch nicht. Wer ihn baut, ersetzt
   hier die 25. */
function wertung(){
  const p = {};
  p.rang = rangWert(S.rang);
  p.kapitel = 8 * kapitelUeberlebt();          // volle Skala: 8 je Kapitel, max. 11
  p.ruf = 5 * Math.floor(S.ruf/10);
  p.nennungen = 3 * Math.min(10, S.nennungen);
  p.orden = (S.orden||[]).reduce((sum,id)=>{ const o=ordenVon(id); return sum+(o?o.vp:0); },0);
  /* ── Der Überlebensbonus, gestaffelt (KONZEPT §5) ──
     **Bis Kapitel 8 stand hier der Platzhalter 25**, und der Kommentar dazu
     sagte, warum: Die gestaffelten Werte ergeben erst Sinn, wenn es den
     freiwilligen Ausstieg an den Rangschranken gibt — dann ist die Höhe des
     Bonus die Belohnung dafür, **rechtzeitig aufzuhören**. Ohne diese
     Entscheidung wäre er nur eine große Zahl für jeden, der nicht stirbt.

     Mit Russland gibt es die Entscheidung, also fällt der Platzhalter:

       180  Ruhestand nach Russland — ausgemustert oder freiwillig gegangen.
            **Der höchste Wert des Spiels für ein Ende**, und das ist Absicht:
            Wer 1812 lebend nach Hause geht, hat alles gesehen, was ein Mensch
            sehen kann, und hört auf, als es noch möglich ist.
       120  Halbsold nach 1814. Später, teurer erkauft, und man geht nicht
            freiwillig, sondern wird gegangen.
        70  Am Leben, ohne ein Ende gewählt zu haben — der Lauf hört auf, weil
            der gebaute Inhalt aufhört.
         0  tot.

     **Die Reihenfolge ist keine Belohnung fürs Kneifen.** Wer bei Russland
     aussteigt, verzichtet auf drei Kapitel Rangaufstieg, und Rang ist der
     größte Posten der Wertung: Ein Colonel bringt 330 Punkte, ein Sergent 62.
     Die 180 machen den Ausstieg zu einer echten Rechnung statt zu einer
     Verlegenheit — und genau das war der Sinn. */
  p.ueberleben = !S.lebt ? 0
    : S.ende === 'ruhestand' ? 180
    : S.ende === 'halbsold'  ? 120
    : 70;
  p.sauber = (!S.gekniffen && S.lebt) ? 20 : 0;
  /* ── Der Preis des Patents, erster Teil ──
     **Der gekaufte Rang zählt nicht, und die Stufe darüber auch nicht.** Ein
     Sous-Lieutenant mit Patent zieht 158 ab — das ist der Rangwert des
     Lieutenants —, ein Lieutenant 205, der des Capitaine.

     Der Abzug ist absichtlich eine Stufe höher als der gekaufte Rang: Sonst
     wäre das Patent bei gleichem Endrang wertungsneutral, und damit wäre es
     ein reiner Vorteil. **Ein Marschall mit Patent ist weniger wert als einer
     ohne** — die Wertung erinnert sich daran, wo einer angefangen hat. */
  const pat = S.patent ? patentVon(S.patent) : null;
  p.patent = pat ? -pat.abzug : 0;
  p.summe = Math.max(0, p.rang+p.kapitel+p.ruf+p.nennungen+p.orden+p.ueberleben+p.sauber+p.patent);
  return p;
}

/* Was von einem Mann bleibt. Die vier alten Felder stehen vorn, damit die
   Chroniktabelle unverändert weiterläuft; alles Übrige ist der Zusatz, den das
   Blatt anzeigt. Ältere Einträge ohne diese Felder bleiben lesbar — sie zeigen
   dann eben nur die Zeile. */
function chronikblatt(endeText, p){
  const letzte = KAPITEL[Math.min(LAUF?LAUF.node:0, KAPITEL.length-1)] || {};
  return {
    name:S.name, rang:rangName(S.rang), ende:endeText, punkte:p.summe,
    herkunft:S.herkunft, zweig:S.zweig, rangN:S.rang, gefallen:!S.lebt, patent:S.patent||null,
    ort:letzte.datum || '', stationen:stationen(),
    attr:Object.assign({},S.attr), fert:Object.assign({},S.fert),
    ausr:Object.keys(S.ausr).map(k=>({name:S.ausr[k].name, zustand:S.ausr[k].zustand,
                                      verschleiss:S.ausr[k].verschleiss})),
    wunden:S.wunden.map(w=>w.name), ruf:S.ruf, gunst:gunst('martel'),
    leute:LEUTE.map(l=>({name:personName(l.id), gunst:gunst(l.id),
                         lebt:!!(S.leute&&S.leute[l.id]&&S.leute[l.id].lebt)})),
    kameradschaft:S.kameradschaft, belastung:S.belastung, atem:S.atem,
    leben:S.leben, lebenMax:lebenMax(),
    nennungen:S.nennungen, orden:(S.orden||[]).slice(), geld:S.geld, gekniffen:!!S.gekniffen,
    kaeufe:(S.kaeufe||[]).slice(), gekauft:Object.assign({},S.gekauft||{}),
    log:(S.log||[]).slice(), wertung:p
  };
}

function eintragen(endeText){
  const p = wertung();
  /* Der Vergleich muss **vor** dem Anheben stehen. Vorher prüfte der
     Bildschirm `p.summe >= META.vp`, nachdem `META.vp` schon angehoben war —
     ein Lauf, der den bisherigen Bestwert nur einstellte, meldete „Neuer
     Rekord" und einen Vorrat, der sich gar nicht bewegt hatte. */
  p.rekord = p.summe > META.vp;
  META.chronik.push(chronikblatt(endeText, p));
  META.laeufe = (META.laeufe|0) + 1;
  META.vp = Math.max(META.vp, p.summe);
  chronikKuerzen();
  laufVerwerfen();          // der Lauf ist zu Ende, in jedem Fall
  chronikSichern();
  return p;
}

function wertungsTabelle(p){ return wertungsTabelleAus({wertung:p, rang:rangName(S.rang),
  stationen:stationen(), kapitel:kapitelUeberlebt(), ruf:S.ruf, nennungen:S.nennungen,
  orden:(S.orden||[]).slice(), patent:S.patent||null}); }

function wertungsTabelleAus(c){
  const p = c.wertung; if(!p) return '';
  return `<table>
    <tr><th>Wofür</th><th class="n">VP</th></tr>
    <tr><td class="d">Erreichter Rang — ${esc(c.rang)}</td><td class="n">${p.rang}</td></tr>
    ${p.kapitel!==undefined
      ? `<tr><td class="d">Überlebte Kapitel (${c.kapitel!==undefined?c.kapitel:p.kapitel/8} × 8)</td><td class="n">${p.kapitel}</td></tr>`
      : `<tr><td class="d">Erreichte Stationen (${c.stationen} × 2)</td><td class="n">${p.stationen}</td></tr>`}
    <tr><td class="d">Ruf ${c.ruf}, je volle 10 Punkte</td><td class="n">${p.ruf}</td></tr>
    <tr><td class="d">Im Tagesbefehl genannt (${c.nennungen}×)</td><td class="n">${p.nennungen}</td></tr>
    ${p.orden ? `<tr><td class="d">Orden — ${esc((c.orden||[]).map(id=>(ordenVon(id)||{}).name).filter(Boolean).join(', '))}</td><td class="n">${p.orden}</td></tr>` : ''}
    <tr><td class="d">Kapitel lebend beendet</td><td class="n">${p.ueberleben}</td></tr>
    <tr><td class="d">Nie vor Zeugen gekniffen</td><td class="n">${p.sauber}</td></tr>
    ${p.patent ? `<tr><td class="d">Mit gekauftem Patent begonnen</td><td class="n">${p.patent}</td></tr>` : ''}
    <tr class="hi"><td class="d"><b>Summe</b></td><td class="n"><b>${p.summe}</b></td></tr>
  </table>`;
}

/* `letzterText` und `kk` reicht `gefallen()` aus dem Gefecht herein: der letzte
   Absatz vor dem Umfallen und die Taten dieses Gefechts. Vorher baute
   `kampfEnde()` beides in einen Bildschirm, den `zeigeTod()` eine Anweisung
   später vollständig überschrieb — **sämtliche Todestexte der Sondermissionen
   („Auf dem Schutt der Rampe bleibst du liegen") waren unerreichbar.** */
function zeigeTod(letzterText, kk){
  const grund = S.todesart || 'Gefallen';
  laufVerwerfen();
  const p = eintragen(grund);
  const neu = p.rekord;
  app.innerHTML = `<div class="card papier"><div class="ch"><span class="tot">Ende</span><span>${esc(grund)}</span></div>
    <div class="cb">
      <div class="prose">
        ${letzterText?`<p>${letzterText}</p>`:''}
        <p><b>${esc(S.name)}</b>, ${rangName(S.rang)} der 32. Halbbrigade, ${esc(grund.toLowerCase())}.</p>
        <p>${todesText()}</p>
      </div>
      ${kk && kk.taten && kk.taten.length?`<div class="lage"><div class="lagekopf">Was gesehen wurde</div>
        ${kk.taten.map(t=>`<div class="tat"><span>${esc(t.was)}</span><b>Ruf +${t.ruf}</b></div>`).join('')}
      </div>`:''}
      <div class="grid2" style="margin-top:18px">
        <div>${wertungsTabelle(p)}</div>
        <div class="note ${neu?'green':'red'}">
          ${neu?`<b>Neuer Rekord.</b> Dein Vorrat steigt auf <b>${META.vp} Veteranenpunkte</b>. Der nächste Mann rückt besser ausgerüstet ein.`
                :`Dein bester Lauf bleibt bei <b>${META.vp} Punkten</b>. Dieser hier war nicht besser — er kostet dich aber auch nichts.`}
          <p style="margin-top:10px">Gezählt wird nur der beste Lauf. Es gibt nichts zu grinden, nur zu übertreffen.</p>
          ${META.laeufe<=2?`<p style="margin-top:10px">Ein Rekrut rückt mit sechzig Punkten ein — das reicht für ein gutes Attribut und ein halbes. Der Rest des Weges führt über diesen Vorrat: Was dieser Mann gesehen hat, bringt der nächste schon mit. Gegen manche Gegner hattest du heute keine Chance. In zwei, drei Läufen hast du eine.</p>`:''}
        </div>
      </div>
      <div class="probe" style="margin-top:14px">DER SPIELSTAND DIESES MANNES IST GELÖSCHT</div>
      <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="plain" onclick="zeigeErschaffung(true)">Nächster Mann</button>
        <button class="plain" onclick="zeigeTitel()">Zur Chronik</button>
        <button class="plain" onclick="speichern()">Spielstand sichern</button>
      </div>
    </div></div>`;
  LAUF=null; binde(); kopfzeile();
}
function todesText(){
  const t = [
    'Man nimmt ihm die Patronen ab und die Schuhe, wenn sie noch etwas taugen, und zieht weiter. Am Abend fehlt sein Name beim Appell, und am übernächsten Tag erinnert sich niemand mehr, wann genau er gefehlt hat.',
    'Zwei Männer tragen ihn an den Rand und legen ihn zu den anderen. Ein Brief nach Hause wird nicht geschrieben, weil in seiner Kompanie niemand schreiben kann.',
    'Er wird in eine Grube gelegt, die vierzig andere teilen. Die Halbbrigade marschiert am Morgen weiter, und seine Muskete bekommt ein Rekrut, der noch nicht weiß, wem sie gehört hat.'
  ];
  return t[Math.floor(Math.random()*t.length)];
}

/* ══════════════════ DIE RANGSCHRANKE ══════════════════

   **Die erste Stelle im Spiel, an der man freiwillig aufhören kann.**

   Nach Russland verlangt der Krieg Rang 7, vor Waterloo Rang 10 (RANGLEITER §9,
   `SCHRANKEN` in `src/kampf.js`). Wer darunter bleibt, wird ausgemustert — das
   ist kein Scheitern, sondern das zweitbeste Ende, das dieses Spiel kennt. Wer
   darüber liegt, bekommt eine Wahl, und sie ist echt:

   | | Ausgemustert / gegangen | Weiter |
   |---|---|---|
   | Punkte sofort | **+180** | +70 am Ende |
   | Was du aufgibst | drei Kapitel Rangaufstieg | nichts |
   | Was du gewinnst | den Rest deines Lebens | den Rang, den es dafür braucht |

   **Das Spiel rechnet den Erwartungswert nicht vor**, und das ist der ganze
   Sinn der Station. Ein Colonel bringt 330 Wertungspunkte, ein Sergent 62 —
   wer weitergeht, kann das Vielfache der 180 holen und stirbt dabei
   wahrscheinlich. Wer aufhört, hat es sicher. Es steht nirgends, welche der
   beiden Zahlen größer ist, weil das von einem Mann abhängt, den nur der
   Spieler kennt.

   **Angezeigt wird die Schranke wie ein Kapitelende, nicht wie eine Szene.**
   Sie ist eines. */
function zeigeSchranke(n){
  const sch = SCHRANKEN[n.schranke];
  if(!sch){ zeigeKapitelende(n); return; }
  const durch = schrankeGeschafft(n.schranke);
  const kopf = `<div class="ch"><span>${esc(n.ort||sch.name)}</span><span>${esc(n.datum||'')}</span></div>`;
  const prosa = (n.text||[]).map(t=>`<p>${t}</p>`).join('');

  if(!durch){
    /* Ausgemustert. Kein Knopf, keine Wahl — die Listen werden neu
       geschrieben, und was kein Offizier ist, steht nicht mehr darauf. */
    S.ende = sch.endeArt || 'ruhestand';
    schrankeEnde(n, prosa + `<p>${esc(sch.ende)}</p>`, sch.epilog);
    return;
  }
  app.innerHTML = `<div class="stage">${verlauf()}
    <div><div class="card"><div class="ch"><span>${esc(n.ort||sch.name)}</span><span>${esc(n.datum||'')}</span></div>
      <div class="cb"><div class="prose">${prosa}</div>
        <div class="ergebnis gut">${esc(sch.durch)}</div>
        <div class="wirkung"><span>Was jetzt zur Wahl steht</span>
          Du bist ${rangName(S.rang)}. Wer geht, bekommt <b>${sch.bonus} Punkte</b> und hört auf.
          Wer bleibt, behält alles, was er sich noch verdienen kann — und alles, was er verlieren kann.</div>
      </div></div>
      <div class="orders"><div class="ch"><span>Wie entscheidest du?</span></div><div class="ordbody">
        <button class="ord" onclick="schrankeWeiter()">Weitermarschieren
          <span class="cost">Der Krieg geht weiter, und er braucht dich · +70 am Ende</span></button>
        <button class="ord" onclick="schrankeGehen()">Den Abschied nehmen
          <span class="cost">${sch.endeArt==='halbsold'?'Halbsold':'Ruhestand'} · +${sch.bonus} Punkte · die Laufbahn endet hier</span></button>
      </div></div>
    </div>${seitenleiste()}</div>`;
  kopfzeile();
}

/* Weiter: die Station ist erledigt wie jede andere, und der Feldzug läuft. */
function schrankeWeiter(){
  const n = KAPITEL[LAUF.node];
  S.log.push((n.ort||'') + ': weitermarschiert');
  /* **Eine Schranke am Kapitelende ist auch ein Übergang.** Wer weitergeht,
     hat denselben Winter vor sich wie jeder andere zwischen zwei Feldzügen —
     und ohne ihn überlebt niemand 1813, der aus Russland kommt: Er käme mit
     vier Wunden und leerem Vorrat in ein Kapitel, das seine eigene Härte
     hat, und stürbe an Borodino statt an Leipzig.

     Die Dispatch-Reihenfolge in `naechster()` prüft `schranke` **vor**
     `typ`, also läuft `zeigeUebergang()` hier nie. Deshalb steht die
     Erholung an dieser Stelle noch einmal — mitsamt der Konstitution, denn
     wer Russland überlebt hat, hat sie sich verdient wie sonst nur einer,
     der einen ganzen Feldzug hinter sich hat. Reihenfolge wie dort: erst
     der Zuwachs, dann auffüllen. */
  if(n.typ === 'uebergang'){
    S.attr.konstitution = (S.attr.konstitution|0) + 3;
    S.wunden = [];
    S.leben = lebenMax();
    S.atem = 100; atemKlemmen();
    S.belastung = Math.max(0, Math.floor(S.belastung/2));
  }
  stationErledigt();
  naechster();
}

function schrankeGehen(){
  const n = KAPITEL[LAUF.node];
  const sch = SCHRANKEN[n.schranke] || {};
  /* Wer freiwillig geht, geht auf demselben Weg wie der Ausgemusterte — nach
     Russland in den Ruhestand, nach 1814 auf Halbsold. Der Unterschied liegt
     nicht in der Art des Endes, sondern darin, dass man es gewählt hat. */
  S.ende = sch.endeArt || 'ruhestand';
  S.log.push((n.ort||'') + ': den Abschied genommen');
  schrankeEnde(n, (n.text||[]).map(t=>`<p>${t}</p>`).join('') +
    `<p>Du meldest dich ab. Es geht schneller, als du gedacht hast — ein Formular, zwei Unterschriften, und der Adjutant sieht dabei nicht auf.</p>`,
    sch.epilog);
}

/* Der gemeinsame Abschluss beider Wege. Wertung, Chronikeintrag, Titelrückkehr
   — dieselbe Maschine wie `zeigeKapitelende()`, nur mit einem anderen Satz
   darunter und ohne den Ausblick auf ein nächstes Kapitel. */
/* ══════════════════ DER LEBENSEPILOG ══════════════════

   **Das einzige Ende, das über den Tag hinaussieht.** Jedes andere hört auf,
   wo der Mann aufhört — gefallen, ausgemustert, auf Halbsold. Dieses eine
   sagt, was aus ihm geworden ist, und es sagt es in vier Zeilen, ohne zu
   werten (Invariante 7).

   **Was den Text bestimmt, ist der Rang und nicht der Sieg.** Waterloo ist
   verloren, für alle gleich; was danach kommt, hängt davon ab, wie hoch man
   stand, als es verloren ging. Ein Bataillonschef verschwindet in einer
   Provinzstadt; ein Marschall steht auf einer Liste, die man später
   Proskriptionen nennen wird.

   Und wer den Rückruf abgelehnt hat, bekommt denselben Bogen mit einem
   anderen Satz — **kein schlechteres Ende, ein anderes.** */
const EPILOG_LEBEN = [
  {ab:14, text:'Dein Name steht auf der Liste, die im Juli in der Zeitung erscheint. Zwei der sechsundzwanzig werden erschossen; du gehörst nicht dazu, und niemand hat dir je erklärt, warum. Du lebst noch dreißig Jahre, gibst keine Erinnerungen heraus und gehst nicht zu den Feiern. Als man dir 1840 einen Platz im Zug anbietet, der ihn zurückbringt, sagst du ab.'},
  {ab:12, text:'Man setzt dich auf Halbsold und dann auf eine Liste. Du gehst nicht nach Amerika, obwohl es angeboten wird, sondern in eine Provinzstadt, in der niemand weiß, was ein Général ist. Vierundzwanzig Jahre später bekommst du einen Brief mit der Anrede, die du seit Waterloo nicht gelesen hast, und legst ihn weg, ohne ihn zu beantworten.'},
  {ab:10, text:'Die Armee wird im Juli aufgelöst, und du wirst mit ihr aufgelöst: ein Papier, eine Zahl, eine Adresse. Du heiratest spät, arbeitest an etwas, das mit Krieg nichts zu tun hat, und erzählst deinen Kindern nichts. Sie erfahren es von einem Nachbarn, der auch dabei war.'},
  {ab:7,  text:'Du bekommst Halbsold und eine Adresse, an die man ihn schickt. In den ersten Jahren kommt er unregelmäßig, dann gar nicht mehr, dann wieder. Du wirst alt, ohne dass jemand dich fragt, und einmal im Jahr, im Juni, gehst du früher schlafen als sonst.'},
  {ab:1,  text:'Du gehst nach Hause, in ein Dorf, das kleiner ist, als du es in Erinnerung hattest. Man weiß dort, wo du warst, und fragt nicht nach. Nach ein paar Jahren fragt niemand mehr etwas, und das ist keine Kränkung, sondern nur die Zeit.'}
];

function zeigeEpilog(n){
  const abgelehnt = !!S.abgelehnt;
  /* Wer abgelehnt hat, bleibt auf Halbsold — er hat ihn ja nie verlassen.
     Wer mitgegangen und lebendig geblieben ist, ebenso: 1815 gibt es keinen
     Ruhestand mehr zu vergeben, es gibt nur noch Auflösung. */
  S.ende = 'halbsold';
  const leben = (EPILOG_LEBEN.find(e => S.rang >= e.ab) || EPILOG_LEBEN[EPILOG_LEBEN.length-1]).text;
  const p = eintragen('Epilog · ' + rangName(S.rang));
  const neu = p.rekord;

  const prosa = abgelehnt
    ? `<p>Der Feldzug findet ohne dich statt. Am 18. Juni bist du zu Hause, es regnet auch dort, und du erfährst es elf Tage später aus einer Zeitung.</p>
       <p>Was du gelesen hast, hättest du selbst gesehen, wenn du im April zwei andere Sätze geschrieben hättest. Es steht nicht fest, ob es anders ausgegangen wäre. Es steht fest, dass du nicht dabei warst.</p>`
    : (n.text||[]).map(t=>`<p>${t}</p>`).join('');

  app.innerHTML = `<div class="stage">${verlauf()}
    <div><div class="card papier"><div class="ch"><span>${esc(n.ort||'Der Epilog')}</span><span>${esc(n.datum||'')}</span></div>
      <div class="cb">${vordruck(n)}
        <div class="prose">${prosa}</div>
        <div class="ergebnis" style="margin-top:16px">${leben}</div>
        <div class="grid2" style="margin-top:18px">
          <div>${wertungsTabelle(p)}</div>
          <div class="note ${neu?'green':''}">
            ${neu?`<b>Neuer Rekord: ${META.vp} Veteranenpunkte.</b>`:`Dein bester Lauf bleibt bei <b>${META.vp} Punkten</b>.`}
            <p style="margin-top:10px">Neunzehn Jahre, ${S.kapitel|0} Feldzüge, ${stationen()} Stationen. Von hundert, die 1796 in Savona angetreten sind, steht am Ende keiner mehr in der Liste — und du bist noch da.</p>
          </div>
        </div>
        <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">
          <button class="plain" onclick="zeigeErschaffung(true)">Noch einmal, besser</button>
          <button class="plain" onclick="zeigeTitel()">Zur Chronik</button>
          <button class="plain" onclick="speichern()">Spielstand sichern</button>
        </div>
      </div></div>
    </div>${seitenleiste()}</div>`;
  LAUF=null; binde(); kopfzeile();
}

function schrankeEnde(n, prosa, epilog){
  const p = eintragen((S.ende==='halbsold'?'Halbsold · ':'Ruhestand · ')+rangName(S.rang));
  const neu = p.rekord;
  app.innerHTML = `<div class="card"><div class="ch"><span>${esc(n.datum||'')}</span><span>${esc(n.ort||'')}</span></div>
    <div class="cb"><div class="prose">${prosa}</div>
      <div class="ergebnis" style="margin-top:14px">${esc(epilog||'')}</div>
      <div class="grid2" style="margin-top:18px">
        <div>${wertungsTabelle(p)}</div>
        <div class="note ${neu?'green':''}">
          ${neu?`<b>Neuer Rekord: ${META.vp} Veteranenpunkte.</b>`:`Dein bester Lauf bleibt bei <b>${META.vp} Punkten</b>.`}
          <p style="margin-top:10px">Du bist nicht gefallen. Von hundert, die mit dir angefangen haben, sind sechs so weit gekommen, und die meisten davon liegen irgendwo.</p>
        </div>
      </div>
      <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="plain" onclick="zeigeErschaffung(true)">Noch einmal, besser</button>
        <button class="plain" onclick="zeigeTitel()">Zur Chronik</button>
        <button class="plain" onclick="speichern()">Spielstand sichern</button>
      </div>
    </div></div>`;
  LAUF=null; binde(); kopfzeile();
}

function zeigeKapitelende(n){
  n = n || KAPITEL[KAPITEL.length-1] || {};
  const p = eintragen('Feldzüge überstanden · '+rangName(S.rang));
  const neu = p.rekord;
  /* ── Der Schlusssatz wandert mit dem Rang ──
     **Und er wird nach oben hin nüchterner, nicht feierlicher** (Invariante 7).
     Der Marschallstab ist ausdrücklich die Legende, nicht das Ziel:
     sechsundzwanzig in zwölf Jahren, unter Hunderttausenden. Der Abschluss
     feiert deshalb nichts — er nennt die Namen, die vor deinem stehen, und
     das Datum. */
  const rangSatz =
      S.rang>=14 ? 'Sechsundzwanzig Männer haben diesen Stab in zwölf Jahren bekommen. Vor deinem Namen stehen Lannes, der bei Aspern gefallen ist, Bessières, der bei Rippach gefallen ist, und Ney, der noch lebt. Die Liste wird nicht länger.'
    : S.rang>=13 ? 'Zehntausend Mann, ein Landgut in Westfalen und ein Titel, den es vor zehn Jahren nicht gab. Du kennst niemanden mehr, der dich beim Vornamen nennt.'
    : S.rang>=12 ? 'Du entscheidest über Lagen, die es nicht mehr gibt, wenn deine Befehle ankommen. Man gewöhnt sich daran; das ist das Beunruhigende.'
    : S.rang>=11 ? 'Zweitausend Mann tragen deinen Namen im Regimentsbuch, und ein Adler steht in deinem Zelt.'
    : S.rang>=10 ? 'Vier Kompanien, achthundert Mann, und du siehst keine Gesichter mehr. Das ist kein Bild, das ist der Dienst.'
    : S.rang>=7  ? 'Du trägst Epauletten und keine Muskete. Was du im Gefecht tust, tun andere Leute für dich, und ob sie es tun, entscheidet sich vorher.'
    : S.rang>=3  ? 'Acht Mann sehen dich morgens an und warten, was du sagst.'
    : S.rang===2 ? 'Du stehst nicht mehr in der Mitte des Bataillons, sondern dort, wo sie die Leute hinstellen, auf die es ankommt.'
                 : 'Du stehst noch in der Reihe wie am ersten Tag — aber du stehst.';
  app.innerHTML = `<div class="card"><div class="ch"><span>${esc(n.datum||'')}</span><span>${esc(n.ort||'')}</span></div>
    <div class="cb"><div class="prose">
      ${(n.text||[]).map(t=>`<p>${t}</p>`).join('')}
      <p>Du bist <b>${rangName(S.rang)}</b>. ${rangSatz}</p>
    </div>
    <div class="grid2" style="margin-top:18px">
      <div>${wertungsTabelle(p)}</div>
      <div class="note ${neu?'green':''}">
        ${neu?`<b>Neuer Rekord: ${META.vp} Veteranenpunkte.</b>`:`Dein bester Lauf bleibt bei <b>${META.vp} Punkten</b>.`}
        <p style="margin-top:10px">${n.ausblick||''}</p>
        <p style="margin-top:10px">Was hier funktioniert, funktioniert in den nächsten Kapiteln genauso: Proben gegen Attribute, Ausrüstung, die verschleißt, Ruf und Fürsprache, die über Beförderung entscheiden — und ein Tod, der endgültig ist.</p>
      </div>
    </div>
    <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">
      <button class="plain" onclick="zeigeErschaffung(true)">Noch einmal, besser</button>
      <button class="plain" onclick="zeigeTitel()">Zur Chronik</button>
      <button class="plain" onclick="speichern()">Spielstand sichern</button>
    </div>
  </div></div>`;
  LAUF=null; binde(); kopfzeile();
}

/* ══════════════════ SPIELSTAND ══════════════════ */

function speichern(){
  const blob = new Blob([dateiInhalt()],{type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'marschallstab-spielstand.json';
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
}
function laden(ev){
  const f = ev.target.files[0]; if(!f) return;
  const r = new FileReader();
  r.onload = () => {
    let e;
    try{ e = dateiEinlesen(r.result); }
    catch(x){ e = {ok:false, grund:'Diese Datei ließ sich nicht lesen.'}; }
    if(e.ok) zeigeTitel(); else alert(e.grund);
  };
  r.readAsText(f);
}
