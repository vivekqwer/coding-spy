import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROMPTS: {
  category: string;
  title: string;
  promptText: string;
  previewHtml?: string;
}[] = [
  {
    category: "Parallax Card Animation",
    title: "Layered Depth Parallax Card",
    promptText:
      "Create a card with 3 stacked layers (background image, gradient overlay, and floating title text) that move at different speeds relative to the mouse position, giving a strong sense of depth. Use JavaScript mousemove with translate3d.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.wrap{width:260px;height:170px;border-radius:20px;overflow:hidden;position:relative;background:linear-gradient(160deg,#141a24,#0B0F17)}.layer{position:absolute;inset:0;transition:transform .1s ease-out}.l1{background:radial-gradient(circle at 30% 30%,#8B5CF655,transparent 60%)}.l2{background:radial-gradient(circle at 70% 70%,#22D3EE44,transparent 60%)}.title{position:absolute;bottom:16px;left:16px;color:#fff;font-family:sans-serif;font-weight:700;font-size:18px}</style><div class="wrap" id="w"><div class="layer l1" id="l1"></div><div class="layer l2" id="l2"></div><div class="title" id="t">Depth Card</div></div><script>const w=document.getElementById('w');const l1=document.getElementById('l1'),l2=document.getElementById('l2'),t=document.getElementById('t');w.addEventListener('mousemove',e=>{const r=w.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;l1.style.transform='translate3d('+x*20+'px,'+y*20+'px,0)';l2.style.transform='translate3d('+x*-15+'px,'+y*-15+'px,0)';t.style.transform='translate3d('+x*10+'px,'+y*10+'px,0)'});<\/script>`,
  },
  {
    category: "Parallax Card Animation",
    title: "Scroll Parallax Card Stack",
    promptText:
      "Build a stack of overlapping cards inside a scroll container where each card slows down and scales slightly as the next one slides over it (like Apple's product pages), using position: sticky and scroll-driven transforms.",
  },
  {
    category: "Parallax Card Animation",
    title: "Tilt-and-Glow Parallax Card",
    promptText:
      "Create a product card that tilts toward the cursor (3D rotate) while a radial light/glow follows the cursor position across the card surface, using CSS custom properties updated via JS mousemove.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17;perspective:700px}.card{--x:50%;--y:50%;width:220px;height:150px;border-radius:18px;background:#141a24;border:1px solid #22D3EE33;position:relative;overflow:hidden;transition:transform .1s}.card::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at var(--x) var(--y),rgba(34,211,238,.35),transparent 50%)}</style><div class="card" id="c"></div><script>const c=document.getElementById('c');c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();const px=((e.clientX-r.left)/r.width)*100;const py=((e.clientY-r.top)/r.height)*100;c.style.setProperty('--x',px+'%');c.style.setProperty('--y',py+'%');const rx=(py/100-.5)*-20;const ry=(px/100-.5)*20;c.style.transform='rotateX('+rx+'deg) rotateY('+ry+'deg)'});c.addEventListener('mouseleave',()=>c.style.transform='none');<\/script>`,
  },
  {
    category: "Slider Animation",
    title: "Infinite Auto-Scrolling Logo Marquee",
    promptText:
      "Build an infinite horizontal auto-scrolling logo/testimonial slider using pure CSS keyframe animation (duplicated content trick) that pauses smoothly on hover.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;background:#0B0F17;overflow:hidden}.track{display:flex;gap:24px;animation:scroll 8s linear infinite}.track:hover{animation-play-state:paused}.item{flex:0 0 auto;padding:14px 24px;border-radius:12px;background:#141a24;border:1px solid #8B5CF633;color:#fff;font-family:sans-serif;font-weight:600}@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}</style><div class="track"><div class="item">Coding Spy</div><div class="item">React</div><div class="item">Python</div><div class="item">SQL</div><div class="item">Rust</div><div class="item">Coding Spy</div><div class="item">React</div><div class="item">Python</div><div class="item">SQL</div><div class="item">Rust</div></div>`,
  },
  {
    category: "Slider Animation",
    title: "Draggable Card Carousel with Dots",
    promptText:
      "Create a swipeable/draggable image or testimonial carousel with snap-scrolling, active-dot indicators below, and smooth momentum scrolling on both touch and mouse drag.",
    previewHtml: `<style>body{margin:0;background:#0B0F17;font-family:sans-serif;padding:30px 0}.track{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 20px}.slide{flex:0 0 200px;height:110px;border-radius:16px;scroll-snap-align:center;background:linear-gradient(135deg,#22D3EE,#8B5CF6);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700}.dots{display:flex;gap:6px;justify-content:center;margin-top:12px}.dot{width:6px;height:6px;border-radius:50%;background:#94A3B8}.dot.active{background:#22D3EE;width:18px;border-radius:4px}</style><div class="track"><div class="slide">1</div><div class="slide">2</div><div class="slide">3</div></div><div class="dots"><span class="dot active"></span><span class="dot"></span><span class="dot"></span></div>`,
  },
  {
    category: "Slider Animation",
    title: "Range Slider with Live Gradient Fill",
    promptText:
      "Build a custom-styled range input slider where the filled track shows a live cyan-to-violet gradient that updates as the user drags, with a glowing thumb handle.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}input[type=range]{-webkit-appearance:none;width:220px;height:6px;border-radius:4px;background:linear-gradient(90deg,#22D3EE 50%,#242c3a 50%)}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 0 12px #22D3EE;cursor:pointer}</style><input type="range" id="r" min="0" max="100" value="50"><script>const r=document.getElementById('r');r.addEventListener('input',()=>{r.style.background='linear-gradient(90deg,#22D3EE '+r.value+'%,#242c3a '+r.value+'%)'});<\/script>`,
  },
  {
    category: "React",
    title: "Framer Motion Staggered Card Reveal",
    promptText:
      "Using React and Framer Motion, animate a grid of cards so each one fades in and slides up with a staggered delay (0.1s between each) when the grid scrolls into view, using whileInView and a parent variants object with staggerChildren.",
  },
  {
    category: "React",
    title: "Framer Motion Layout Shared-Element Tab Indicator",
    promptText:
      "Build a React tab bar where a highlighted pill background smoothly slides (using Framer Motion's layoutId shared layout animation) to whichever tab is currently active, instead of fading in a new element each time.",
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
  console.log(`Seeded ${PROMPTS.length} more example prompts (Parallax / Slider / Framer Motion).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
