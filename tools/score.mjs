// Writes the film's om-score (ABC) into index.html, between the om-score script tags.
// 120 BPM, A minor resolving to C major, 31 bars of 4/4 = 62 s. Every voice is a sampled instrument
// (om samples build): piano, marimba, pizz, string sections, violins, horn, vibes, electric bass, recorded kit.
// Run: node tools/score.mjs   (checks that every bar of every voice is exactly 8 eighths long)
import { readFileSync, writeFileSync } from 'node:fs';

const CH = {
  Am: { root: 'A,', tri: '[A,CE]', hi: '[Ace]', arp: ['A,', 'C', 'E', 'A', 'E', 'C', 'E', 'C'], mot: ['e', 'c', 'A'], vib: ['A', 'c', 'e', 'c'], pz: '[A,E]' },
  F:  { root: 'F,', tri: '[F,A,C]', hi: '[FAc]', arp: ['F,', 'A,', 'C', 'F', 'C', 'A,', 'C', 'A,'], mot: ['c', 'A', 'F'], vib: ['F', 'A', 'c', 'A'], pz: '[F,C]' },
  C:  { root: 'C,', tri: '[CEG]', hi: '[EGc]', arp: ['C', 'E', 'G', 'c', 'G', 'E', 'G', 'E'], mot: ['e', 'c', 'G'], vib: ['E', 'G', 'c', 'G'], pz: '[C,G,]' },
  G:  { root: 'G,', tri: '[G,B,D]', hi: '[GBd]', arp: ['G,', 'B,', 'D', 'G', 'D', 'B,', 'D', 'B,'], mot: ['d', 'B', 'G'], vib: ['G', 'B', 'd', 'B'], pz: '[G,D]' },
  E:  { root: 'E,', tri: '[E,^G,B,]', hi: '[E^GB]', arp: ['E,', '^G,', 'B,', 'E', 'B,', '^G,', 'B,', '^G,'], mot: ['B', '^G', 'E'], vib: ['E', '^G', 'B', '^G'], pz: '[E,B,]' },
};
// bar → chord(s); "C|G" splits the bar in halves
const BARS = ['Am', 'F', 'Am', 'F', 'C|G', 'Am', 'F', 'C', 'G', 'Am', 'F|G', 'E', 'Am', 'F', 'C', 'G', 'Am', 'F', 'C|G', 'F', 'C', 'Am', 'F', 'G', 'Am', 'F', 'G', 'C', 'F', 'G', 'C'];
const SEC = { 1: 'hook', 3: 'install', 6: 'plan', 10: 'build', 12: 'gate', 13: 'audit', 17: 'fix', 20: 'converged', 22: 'honest', 25: 'agents', 28: 'end' };
const secOf = (b) => { let s = 'hook'; for (const k of Object.keys(SEC).map(Number)) if (b >= k) s = SEC[k]; return s; };
const halves = (b) => BARS[b - 1].split('|');
const one = (b) => CH[halves(b)[0]];

// lengths in eighths, for the check
const len = (bar) => {
  let s = bar.replace(/![^!]*!/g, '').replace(/\[([^\]]*)\]/g, (m, inner) => { const n = inner.match(/[\^_=]?[A-Ga-gz][,']*([0-9]*\/?[0-9]*)/); return 'C' + (n ? n[1] : ''); });
  let total = 0;
  for (const m of s.matchAll(/[\^_=]?[A-Ga-gzZ][,']*(\d*)(\/*)(\d*)/g)) {
    let v = m[1] ? Number(m[1]) : 1;
    if (m[2]) v /= m[3] ? Number(m[3]) : 2 ** m[2].length;
    total += v;
  }
  return total;
};

const voices = {
  PNO: { head: 'V:PNO inst=piano role=melody gain=0.85', bar(b, s) {
    const h = halves(b), c = one(b);
    const motif = (x) => `${x.mot[0]}2 ${x.mot[1]}2 ${x.mot[2]}2 z2`;
    if (s === 'hook') return (b === 1 ? '!mp! ' : '') + motif(c);
    if (s === 'install') return b === 5 ? `${CH.C.mot[0]}2 ${CH.C.mot[2]}2 ${CH.G.mot[0]}2 ${CH.G.mot[2]}2` : motif(c);
    if (s === 'honest') return (b === 22 ? '!p! ' : '') + motif(c);
    if (s === 'end') return b === 28 ? '!f! [C,G,CEc]8' : b === 31 ? '!mp! [C,G,CEGc]8' : (b === 29 ? '!mp! ' : '') + motif(c);
    if (s === 'converged') return `${c.hi}4 ${c.hi}4`;
    return 'z8';
  } },
  MAR: { head: 'V:MAR inst=marimba gain=0.5', bar(b, s) {
    const h = halves(b);
    const arp = (n) => (h.length > 1 ? [...CH[h[0]].arp.slice(0, 4), ...CH[h[1]].arp.slice(0, 4)] : CH[h[0]].arp).join('');
    if (['hook', 'install', 'agents'].includes(s)) return (b === 1 ? '!mp! ' : b === 25 ? '!mf! ' : '') + arp();
    if (s === 'plan' || s === 'build') return (b === 6 ? '!p! ' : '') + arp();
    if (s === 'audit' && b !== 16) return (b === 13 ? '!mf! ' : '') + arp();
    return 'z8';
  } },
  PIZ: { head: 'V:PIZ inst=pizz gain=0.6', bar(b, s) {
    const c = one(b);
    if (s === 'plan') return (b === 6 ? '!mf! ' : '') + `${c.pz}2 z2 ${c.pz}2 z2`;
    if (s === 'fix') return (b === 17 ? '!f! ' : '') + `${c.pz}${c.pz} ${c.pz}${c.pz} ${c.pz}${c.pz} ${c.pz}${c.pz}`;
    return 'z8';
  } },
  STR: { head: 'V:STR inst=strings gain=0.7', bar(b, s) {
    const h = halves(b);
    const hold = h.length > 1 ? `${CH[h[0]].tri}4 ${CH[h[1]].tri}4` : `${CH[h[0]].tri}8`;
    if (s === 'build') return b === 10 ? '!p! !crescendo(! ' + hold : hold + ' !crescendo)!';
    if (s === 'gate') return '!mf! ' + hold;
    if (s === 'audit') return b === 16 ? `${CH.G.tri}4 z4` : (b === 13 ? '!mf! ' : '') + hold;
    if (s === 'fix' || s === 'converged') return (b === 17 ? '!ff! ' : '') + hold;
    if (s === 'honest') return (b === 22 ? '!pp! ' : '') + hold;
    if (s === 'end') return b === 28 ? '!mf! ' + hold : (b === 29 ? '!p! ' : '') + hold;
    return 'z8';
  } },
  VLN: { head: 'V:VLN inst=violins role=melody gain=0.75', bar(b, s) {
    if (b === 17) return "!ff! [ee']3 [cc']3 [Aa]2";
    if (b === 18) return "[cc']3 [Aa]3 [Ff]2";
    if (b === 19) return "[ee']2 [cc']2 [dd']2 [Bb]2";
    if (b === 20) return "[cc']4 [ff']4";
    if (b === 21) return "[ee']8";
    return 'z8';
  } },
  HRN: { head: 'V:HRN inst=horn gain=0.6', bar(b, s) {
    if (b === 20) return '!f! [FAc]8';
    if (b === 21) return '[EGc]8';
    if (b === 28) return '!mf! [EGc]2 z6';
    return 'z8';
  } },
  VIB: { head: 'V:VIB inst=vibes gain=0.55', bar(b, s) {
    const c = one(b);
    if (s === 'honest') return (b === 22 ? '!mp! ' : '') + c.vib.map((n) => n.toLowerCase().replace(/^\^?([a-g])$/, (m) => m) + '2').join(' ');
    return 'z8';
  } },
  BAS: { head: 'V:BAS inst=bass gain=0.8', bar(b, s) {
    const h = halves(b), r = CH[h[0]].root, r2 = CH[h[h.length - 1]].root;
    const eighths = h.length > 1 ? `${r}${r}${r}${r} ${r2}${r2}${r2}${r2}` : `${r}${r}${r}${r} ${r}${r}${r}${r}`;
    if (s === 'hook') return 'z8';
    if (s === 'install' || s === 'agents' || s === 'build') return (b === 3 ? '!mf! ' : '') + eighths;
    if (s === 'plan') return `${r}3 ${r}3 ${r}2`;
    if (s === 'gate') return `${r}8`;
    if (s === 'audit') return b === 16 ? `${r}${r}${r}${r} z4` : (b === 13 ? '!f! ' : '') + eighths;
    if (s === 'fix') return (b === 17 ? '!ff! ' : '') + eighths;
    if (s === 'converged') return `${r}3 ${r}3 ${r}2`;
    if (s === 'honest') return (b === 22 ? '!mp! ' : '') + `${r}8`;
    if (s === 'end') return b === 28 ? `${r}8` : 'z8';
    return 'z8';
  } },
  DR: { head: 'V:DR inst=drums kit=acoustic gain=0.85', bar(b, s) {
    const K = 'C,,', S = 'D,,', H = '^F,,', CR = '^C,';
    const groove = `${K}${H} [${S}${H}]${H} ${K}${K} [${S}${H}]${H}`;
    const half = `${K}${H} ${H}${H} [${S}${H}]${H} ${H}${H}`;
    const fill = `${K}${H} [${S}${H}]${H} ${S}/${S}/${S}/${S}/ ${S}/${S}/${S}/${S}/`;
    const sixteenths = `[${K}${H}]/${H}/ ${H}/${H}/ [${S}${H}]/${H}/ ${H}/${H}/ [${K}${H}]/${H}/ [${K}${H}]/${H}/ [${S}${H}]/${H}/ ${H}/${H}/`;
    const crash = (x) => x.replace(/^(\[?)/, (m) => `[${CR}`).replace(/^\[\[/, '[');
    switch (s) {
      case 'hook': return b === 1 ? `!mp! [${CR}${K}]${H} ${H}${H} ${K}${H} ${H}${H}` : `${K}${H} ${H}${H} ${K}${H} ${H}${H}`;
      case 'install': return b === 3 ? `!mf! [${CR}${K}]${H} [${S}${H}]${H} ${K}${K} [${S}${H}]${H}` : b === 5 ? fill : groove;
      case 'plan': return b === 9 ? `${K}${H} ${H}${H} [${S}${H}]${H} ${S}/${S}/${S}/${S}/` : half;
      case 'build': return b === 10 ? `!crescendo(! [${K}${H}]${H} [${K}${H}]${H} [${K}${H}]${H} [${K}${H}]${H}` : `[${K}${H}]${H} [${K}${H}]${H} ${S}/${S}/${S}/${S}/ ${S}/${S}/${S}/${S}/ !crescendo)!`;
      case 'gate': return `!mf! [${CR}${K}]z z2 z4`;
      case 'audit':
        if (b === 13) return `!f! [${CR}${K}]${H} [${S}${H}]${H} ${K}${K} [${S}${H}]${H}`;
        if (b === 16) return `!crescendo(! ${S}/${S}/${S}/${S}/ ${S}/${S}/${S}/${S}/ !crescendo)! !rise(! z4`;
        return sixteenths;
      case 'fix': return b === 17 ? `!rise)! !hit! !ff! [${CR}${K}]${H} [${S}${H}]${H} ${K}${K} [${S}${H}]${H}` : b === 19 ? fill : groove;
      case 'converged': return b === 20 ? `!f! [${CR}${K}]${H} ${H}${H} [${S}${H}]${H} ${H}${H}` : half;
      case 'honest': return (b === 22 ? '!mp! ' : '') + `${K}2 z2 ${K}2 z2`;
      case 'agents': return b === 25 ? `!f! [${CR}${K}]${H} [${S}${H}]${H} ${K}${K} [${S}${H}]${H}` : b === 27 ? fill : groove;
      case 'end': return b === 28 ? `!mf! [${CR}${K}]z z2 z4` : 'z8';
    }
    return 'z8';
  } },
};

const lines = ['X:1', 'T:a11y-loop · launch cue (hook -> install -> plan -> build -> gate -> audit burst -> stop -> fix drop -> converged -> honest -> agents -> end)', 'M:4/4', 'L:1/8', 'Q:1/4=120', 'K:Am'];
let bad = 0;
for (const [id, v] of Object.entries(voices)) {
  lines.push(v.head);
  const bars = [];
  for (let b = 1; b <= BARS.length; b++) {
    let x = v.bar(b, secOf(b));
    if (id === 'PNO' && SEC[b]) x = `!mark:${SEC[b]}! ` + x;
    const l = len(x);
    if (Math.abs(l - 8) > 1e-9) { console.error(`${id} bar ${b}: ${l} eighths: ${x}`); bad++; }
    bars.push(x);
  }
  for (let i = 0; i < bars.length; i += 4) lines.push(bars.slice(i, i + 4).join(' | ') + ' |');
}
if (bad) process.exit(1);
const abc = lines.join('\n');
const file = new URL('../index.html', import.meta.url);
const html = readFileSync(file, 'utf8');
const re = /(<script type="text\/vnd\.abc" id="om-score">)[\s\S]*?(<\/script>)/;
if (!re.test(html)) { console.error('no om-score tag in index.html'); process.exit(1); }
writeFileSync(file, html.replace(re, `$1\n${abc}\n$2`));
console.log(`score: ${Object.keys(voices).length} voices × ${BARS.length} bars written`);
