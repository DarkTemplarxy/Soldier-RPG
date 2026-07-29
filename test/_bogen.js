const { chromium } = require('playwright');
const path = require('path');
(async()=>{
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:1100}});
  p.on('pageerror',e=>console.log('ERR',e.message));
  await p.goto('file://'+path.resolve(__dirname,'../index.html'));
  await p.click('text=Neuen Mann aufstellen'); await p.click('text=Auswürfeln');
  await p.click('#h_schmied'); await p.click('text=Weiter zu den Veteranenpunkten'); await p.click('#startbtn');
  // bis zur ersten Szene klicken
  for(let i=0;i<8;i++){
    const t = await p.$eval('#app', e=>e.innerText);
    if(/Was tust du/.test(t)) break;
    const w = await p.$('.ord.weiter'); if(w){ await w.click(); continue; }
    const any = await p.$('.ord:not([disabled]), .wahl:not([disabled])'); if(any) await any.click();
  }
  await p.screenshot({path:'/tmp/claude-0/-home-user-Soldier-RPG/7efea54b-0739-5fb8-a51c-6cec330c1a65/scratchpad/bogen.png'});
  console.log('Bild geschrieben');
  await b.close();
})();
