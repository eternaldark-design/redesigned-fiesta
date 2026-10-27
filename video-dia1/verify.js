// Comprueba el texto que realmente se dibuja en pantalla contra guion_original.txt
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ref = {}; let cur;
for (const l of fs.readFileSync(path.join(__dirname, 'guion_original.txt'), 'utf8').split('\n')) {
  if (l.startsWith('## ')) { cur = l.slice(3).trim(); ref[cur] = []; } else if (l.trim()) ref[cur].push(l.trim());
}
(async () => {
  const file = path.resolve(process.argv[2]);
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await pg.goto('file://' + file); await pg.evaluate(() => document.fonts.ready);
  const T = await pg.evaluate(() => window.TIMELINE);
  let ok = true;
  for (let i = 0; i < T.parts.length; i++) {
    const p = T.parts[i], got = [];
    let tag = '';
    for (let k = 0; k < p.chunks.length; k++) {
      const end = k + 1 < p.bounds.length ? p.bounds[k + 1] : p.dur - 0.6;
      const t = T.starts[i] + (p.bounds[k] + end) / 2;
      const r = await pg.evaluate(t => { window.renderAt(t); return [document.getElementById('subIn').textContent, document.getElementById('tagText').textContent]; }, t);
      got.push(r[0]); tag = r[1];
    }
    const same = got.join(' ') === ref[p.name].join(' ') && tag === p.name;
    ok = ok && same;
    console.log(`  [${same ? 'OK' : 'DIFERENTE'}] pantalla "${tag}"`);
    if (!same) console.log('   esperado:', ref[p.name].join(' '), '\n   en pantalla:', got.join(' '));
  }
  const fin = await pg.evaluate(t => { window.renderAt(t); return [0, 1, 2].map(i => document.getElementById('f' + i).textContent).join(' '); }, T.finalStart + 5);
  const sameF = fin === ref['Pantalla final'].join(' ');
  ok = ok && sameF;
  console.log(`  [${sameF ? 'OK' : 'DIFERENTE'}] pantalla final: ${fin}`);
  await b.close(); process.exit(ok ? 0 : 1);
})();
