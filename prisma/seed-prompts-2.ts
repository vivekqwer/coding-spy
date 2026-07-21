import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROMPTS: {
  category: string;
  title: string;
  promptText: string;
  previewHtml?: string;
}[] = [
  {
    category: "Landing Page",
    title: "Glassmorphism Pricing Hero",
    promptText:
      "Design a dark landing page hero with a frosted-glass pricing card (backdrop-filter blur), a floating glowing orb behind it, gradient headline text, and a glowing gradient CTA button.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 30% 30%,#1a1030,#0B0F17 60%);font-family:sans-serif;overflow:hidden;position:relative}.orb{position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,#8B5CF6,transparent 70%);filter:blur(10px);top:10%;left:15%;opacity:.6}.card{position:relative;z-index:2;background:rgba(255,255,255,.06);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.15);border-radius:24px;padding:40px;text-align:center;color:#fff;box-shadow:0 20px 60px rgba(0,0,0,.4)}h1{font-size:28px;margin:0 0 8px;background:linear-gradient(90deg,#22D3EE,#8B5CF6);-webkit-background-clip:text;background-clip:text;color:transparent}p{color:#94A3B8;margin:0 0 20px;font-size:13px}.btn{padding:12px 28px;border-radius:12px;border:none;background:linear-gradient(90deg,#22D3EE,#8B5CF6);color:#fff;font-weight:600;cursor:pointer;box-shadow:0 0 30px rgba(139,92,246,.5)}</style><div class="orb"></div><div class="card"><h1>Go Unlimited</h1><p>One plan. Every feature. No limits.</p><button class="btn">Upgrade Now</button></div>`,
  },
  {
    category: "UI Components",
    title: "Bento Grid Dashboard",
    promptText:
      "Build a modern bento-box style dashboard layout using CSS Grid with mixed-size cards (stats, chart placeholder, list), rounded corners, subtle borders, and soft glow accents on hover.",
    previewHtml: `<style>body{margin:0;background:#0B0F17;font-family:sans-serif;padding:20px;color:#fff}.grid{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:80px;gap:12px}.box{background:#141a24;border:1px solid #22D3EE22;border-radius:16px;padding:14px;transition:.2s}.box:hover{border-color:#22D3EE88;transform:translateY(-3px)}.b1{grid-column:span 2;grid-row:span 2}.b2{grid-column:span 2}.b3{grid-column:span 1}.b4{grid-column:span 1}.b5{grid-column:span 2;grid-row:span 2}.num{font-size:22px;font-weight:700;background:linear-gradient(90deg,#22D3EE,#8B5CF6);-webkit-background-clip:text;background-clip:text;color:transparent}.lbl{font-size:11px;color:#94A3B8}</style><div class="grid"><div class="box b1"><div class="num">2.4K</div><div class="lbl">Active Agents</div></div><div class="box b2"><div class="num">98%</div><div class="lbl">Uptime</div></div><div class="box b3"><div class="num">47</div><div class="lbl">Topics</div></div><div class="box b4"><div class="num">12</div><div class="lbl">New</div></div><div class="box b5"><div class="num">$12K</div><div class="lbl">Revenue</div></div></div>`,
  },
  {
    category: "UI Components",
    title: "3D Tilt Card on Mouse Move",
    promptText:
      "Create a card that tilts in 3D following the mouse cursor position (rotateX/rotateY based on cursor offset), with a subtle glare/shine overlay and smooth spring-back on mouse leave.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17;perspective:600px}.card{width:200px;height:130px;border-radius:16px;background:linear-gradient(135deg,#22D3EE,#8B5CF6);display:flex;align-items:center;justify-content:center;color:#fff;font-family:sans-serif;font-weight:700;transition:transform .1s;box-shadow:0 20px 40px rgba(0,0,0,.4)}</style><div class="card" id="c">Hover me</div><script>const c=document.getElementById('c');document.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)/10;const y=(e.clientY-r.top-r.height/2)/10;c.style.transform='rotateX('+(-y)+'deg) rotateY('+x+'deg)'})<\/script>`,
  },
  {
    category: "UI Components",
    title: "Neon Cyberpunk Button",
    promptText:
      "Design a glowing neon-outline button with a flickering pulse animation, cyan-to-violet color shift, and a subtle scanline overlay effect on hover.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#05070c}.btn{padding:14px 36px;border-radius:8px;border:2px solid #22D3EE;color:#22D3EE;background:transparent;font-family:monospace;font-weight:700;letter-spacing:2px;cursor:pointer;text-shadow:0 0 8px #22D3EE;box-shadow:0 0 12px #22D3EE, inset 0 0 12px rgba(34,211,238,.2);animation:pulse 2s infinite}@keyframes pulse{50%{box-shadow:0 0 24px #8B5CF6, inset 0 0 20px rgba(139,92,246,.3);border-color:#8B5CF6;color:#8B5CF6;text-shadow:0 0 12px #8B5CF6}}</style><button class="btn">ENTER</button>`,
  },
  {
    category: "React",
    title: "Animated Gradient Text Reveal",
    promptText:
      "Write a React component that reveals a heading word-by-word with a fade-and-slide-up animation on scroll into view, using Framer Motion, with an animated gradient color sweep across the text.",
  },
  {
    category: "Landing Page",
    title: "Floating Gradient Orbs Background",
    promptText:
      "Create a full-page ambient background with 3-4 large soft blurred gradient orbs (cyan/violet/amber) that slowly float and drift using CSS keyframe animations, layered behind glassmorphism content cards.",
    previewHtml: `<style>body{margin:0;height:100vh;background:#0B0F17;overflow:hidden;position:relative}.orb{position:absolute;border-radius:50%;filter:blur(40px);opacity:.5;animation:float 8s ease-in-out infinite}.o1{width:220px;height:220px;background:#22D3EE;top:10%;left:10%}.o2{width:260px;height:260px;background:#8B5CF6;bottom:10%;right:10%;animation-delay:2s}.o3{width:160px;height:160px;background:#F59E0B;top:40%;right:30%;animation-delay:4s}@keyframes float{0%,100%{transform:translateY(0) translateX(0)}50%{transform:translateY(-30px) translateX(20px)}}</style><div class="orb o1"></div><div class="orb o2"></div><div class="orb o3"></div>`,
  },
];

async function main() {
  for (const p of PROMPTS) {
    const existing = await prisma.prompt.findFirst({ where: { title: p.title, category: p.category } });
    if (existing) continue;
    const maxOrder = await prisma.prompt.aggregate({ _max: { order: true }, where: { category: p.category } });
    await prisma.prompt.create({
      data: { ...p, order: (maxOrder._max.order ?? 0) + 1 },
    });
  }
  console.log(`Seeded ${PROMPTS.length} more example prompts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
