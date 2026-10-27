// node render.js dist/dia1_X.html salida.mp4 [carpeta_frames]
const { chromium } = require('playwright');
const { spawnSync } = require('child_process');
const fs = require('fs'), path = require('path');
(async () => {
  const [file, out, framesDir = '/tmp/frames', audio] = process.argv.slice(2);
  fs.rmSync(framesDir, { recursive: true, force: true }); fs.mkdirSync(framesDir, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const first = await ctx.newPage(); await first.goto('file://' + path.resolve(file));
  const { total } = await first.evaluate(() => window.TIMELINE); const fps = 30;
  const N = Math.ceil(total * fps), W = 4;
  const pages = [first]; for (let i = 1; i < W; i++) { const p = await ctx.newPage(); await p.goto('file://' + path.resolve(file)); pages.push(p); }
  for (const p of pages) await p.evaluate(() => document.fonts.ready);
  console.log(`renderizando ${N} cuadros (${total}s)`);
  await Promise.all(pages.map(async (p, w) => {
    for (let n = w; n < N; n += W) {
      await p.evaluate(t => window.renderAt(t), n / fps);
      await p.screenshot({ path: path.join(framesDir, `f${String(n).padStart(5, '0')}.png`) });
      if (n % 300 === w) console.log('  cuadro', n);
    }
  }));
  await b.close();
  const args = ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(framesDir, 'f%05d.png')];
  if (audio) args.push('-i', audio, '-af', 'apad', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-t', String(total));
  args.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out);
  const r = spawnSync('ffmpeg', args, { stdio: 'inherit' });
  process.exit(r.status);
})();
