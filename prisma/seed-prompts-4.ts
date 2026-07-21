import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROMPTS: {
  category: string;
  title: string;
  promptText: string;
  previewHtml?: string;
}[] = [
  {
    category: "Buttons",
    title: "Shimmer Sweep Button",
    promptText:
      "Create a rounded button with a diagonal white shimmer that sweeps across it every few seconds using a CSS keyframe animation on a pseudo-element, on a dark gradient background.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.btn{position:relative;overflow:hidden;padding:14px 32px;border-radius:999px;border:none;background:linear-gradient(135deg,#141a24,#1c2433);color:#fff;font-family:sans-serif;font-weight:600;cursor:pointer}.btn::after{content:'';position:absolute;top:0;left:-75%;width:50%;height:100%;background:linear-gradient(120deg,transparent,rgba(255,255,255,.4),transparent);animation:shimmer 2.5s infinite}@keyframes shimmer{100%{left:125%}}</style><button class="btn">Get Started →</button>`,
  },
  {
    category: "Buttons",
    title: "Magnetic Hover Button",
    promptText:
      "Build a button that subtly follows the cursor within a radius (magnetic pull effect) when hovered nearby, snapping back smoothly when the mouse leaves, using JS mousemove and CSS transitions.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.btn{padding:16px 40px;border-radius:16px;border:none;background:linear-gradient(90deg,#22D3EE,#8B5CF6);color:#fff;font-family:sans-serif;font-weight:700;cursor:pointer;transition:transform .15s ease-out}</style><button class="btn" id="b">Magnetic</button><script>const b=document.getElementById('b');document.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();const cx=r.left+r.width/2,cy=r.top+r.height/2;const dx=e.clientX-cx,dy=e.clientY-cy;const dist=Math.hypot(dx,dy);if(dist<120){b.style.transform='translate('+dx*0.3+'px,'+dy*0.3+'px)'}else{b.style.transform='translate(0,0)'}});<\/script>`,
  },
  {
    category: "Loaders",
    title: "Gradient Ring Spinner",
    promptText:
      "Create a smooth circular loading spinner with a rotating conic gradient ring (cyan to violet) and a dark inner circle to mask the center, using pure CSS animation.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.spin{width:60px;height:60px;border-radius:50%;background:conic-gradient(#22D3EE,#8B5CF6,transparent);animation:rot 1s linear infinite;display:flex;align-items:center;justify-content:center}.spin::after{content:'';width:44px;height:44px;border-radius:50%;background:#0B0F17}@keyframes rot{to{transform:rotate(360deg)}}</style><div class="spin"></div>`,
  },
  {
    category: "Loaders",
    title: "Bouncing Dots Loader",
    promptText:
      "Build a classic 3-dot loading indicator where each dot bounces up and down in sequence with a staggered animation-delay, in the brand's gradient colors.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17;gap:8px}.dot{width:14px;height:14px;border-radius:50%;background:linear-gradient(135deg,#22D3EE,#8B5CF6);animation:bounce 0.6s infinite alternate}.dot:nth-child(2){animation-delay:.15s}.dot:nth-child(3){animation-delay:.3s}@keyframes bounce{to{transform:translateY(-14px)}}</style><div class="dot"></div><div class="dot"></div><div class="dot"></div>`,
  },
  {
    category: "Text Animation",
    title: "Typewriter Effect Heading",
    promptText:
      "Create a heading that types itself out character-by-character with a blinking cursor at the end, looping through a list of phrases, using pure JavaScript (no library).",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17;font-family:monospace}#t{color:#22D3EE;font-size:22px}#c{animation:blink 1s step-end infinite}@keyframes blink{50%{opacity:0}}</style><div><span id="t"></span><span id="c">|</span></div><script>const words=['Decode.','Learn.','Master.'];let wi=0,ci=0,el=document.getElementById('t');function type(){if(ci<=words[wi].length){el.textContent=words[wi].slice(0,ci++);setTimeout(type,90)}else{setTimeout(()=>{ci=0;wi=(wi+1)%words.length;type()},900)}}type();<\/script>`,
  },
  {
    category: "Text Animation",
    title: "Gradient Wave Text",
    promptText:
      "Build a heading where a gradient color sweeps continuously left to right across the text using background-clip: text and a moving background-position keyframe animation.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}h1{font-family:sans-serif;font-size:32px;background:linear-gradient(90deg,#22D3EE,#8B5CF6,#F59E0B,#22D3EE);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:wave 4s linear infinite}@keyframes wave{to{background-position:300% 0}}</style><h1>Decode. Learn. Master.</h1>`,
  },
  {
    category: "Backgrounds",
    title: "Animated Grid Background",
    promptText:
      "Create a subtle moving grid-line background (like a HUD/dashboard) that slowly scrolls diagonally behind the page content, using a repeating CSS linear-gradient pattern animated with background-position.",
    previewHtml: `<style>body{margin:0;height:100vh;background:#0B0F17;background-image:linear-gradient(#22D3EE22 1px,transparent 1px),linear-gradient(90deg,#22D3EE22 1px,transparent 1px);background-size:40px 40px;animation:move 6s linear infinite}@keyframes move{to{background-position:40px 40px}}</style>`,
  },
  {
    category: "Backgrounds",
    title: "Animated Noise Grain Overlay",
    promptText:
      "Add a subtle animated film-grain/noise texture overlay on top of a dark gradient background using an SVG turbulence filter, for a premium cinematic feel.",
  },
  {
    category: "Navigation",
    title: "Sticky Shrinking Navbar on Scroll",
    promptText:
      "Build a navbar that starts tall and transparent at the top of the page, then shrinks in height and gains a solid blurred background as the user scrolls down, with a smooth CSS transition.",
    previewHtml: `<style>body{margin:0;height:200vh;background:#0B0F17;font-family:sans-serif}nav{position:sticky;top:0;display:flex;align-items:center;padding:24px;color:#fff;transition:.3s;background:transparent}nav.shrink{padding:10px 24px;background:rgba(11,15,23,.85);backdrop-filter:blur(10px);border-bottom:1px solid #22D3EE33}</style><nav id="n">Coding Spy</nav><script>addEventListener('scroll',()=>document.getElementById('n').classList.toggle('shrink',scrollY>50));<\/script>`,
  },
  {
    category: "Navigation",
    title: "Expanding Icon Sidebar",
    promptText:
      "Create a vertical icon-only sidebar that expands to show text labels on hover, with a smooth width transition and icons that stay aligned throughout the animation.",
  },
  {
    category: "Forms",
    title: "Floating Label Input",
    promptText:
      "Build a text input where the placeholder label floats up and shrinks above the field when focused or filled, using the CSS :focus and :placeholder-shown pseudo-classes (no JS required).",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.field{position:relative;width:220px}input{width:100%;padding:16px 12px 8px;border-radius:10px;border:1px solid #333;background:#141a24;color:#fff;font-size:14px}label{position:absolute;left:12px;top:16px;color:#94A3B8;font-family:sans-serif;font-size:14px;transition:.15s;pointer-events:none}input:focus+label,input:not(:placeholder-shown)+label{top:4px;font-size:10px;color:#22D3EE}</style><div class="field"><input placeholder=" " id="i"><label for="i">Email address</label></div>`,
  },
  {
    category: "Forms",
    title: "Animated Success Checkmark",
    promptText:
      "After a form submits, show a circular checkmark icon that draws itself using SVG stroke-dasharray animation, replacing the submit button with a success state.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}svg{width:80px;height:80px}.circle,.check{fill:none;stroke:#22D3EE;stroke-width:3}.circle{stroke-dasharray:157;stroke-dashoffset:157;animation:draw 0.6s ease forwards}.check{stroke-dasharray:36;stroke-dashoffset:36;animation:draw 0.4s 0.6s ease forwards}@keyframes draw{to{stroke-dashoffset:0}}</style><svg viewBox="0 0 52 52"><circle class="circle" cx="26" cy="26" r="24"/><path class="check" d="M14 27l7 7 16-16"/></svg>`,
  },
  {
    category: "Hero Section",
    title: "Split-Screen Animated Hero",
    promptText:
      "Design a split-screen hero with text on the left and a slowly rotating gradient shape on the right, where both halves fade/slide in on page load with a slight delay between them.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;background:#0B0F17}.left,.right{flex:1;display:flex;align-items:center;justify-content:center;opacity:0;animation:in .6s forwards}.right{animation-delay:.2s}.left h1{color:#fff;font-family:sans-serif;font-size:28px;max-width:260px}.shape{width:160px;height:160px;border-radius:40%;background:linear-gradient(135deg,#22D3EE,#8B5CF6);animation:spin 8s linear infinite}@keyframes in{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}</style><div class="left"><h1>Decode. Learn. Master.</h1></div><div class="right"><div class="shape"></div></div>`,
  },
  {
    category: "Hero Section",
    title: "Video-Style Looping Gradient Hero",
    promptText:
      "Create a full-viewport hero where a large, slowly-morphing animated gradient blob fills the background (using CSS border-radius and background-position keyframes) behind a centered headline and CTA.",
  },
  {
    category: "Testimonials",
    title: "Auto-Rotating Testimonial Card",
    promptText:
      "Build a single testimonial card that automatically cross-fades to the next quote every few seconds, with small avatar circles below acting as clickable indicators.",
  },
  {
    category: "Portfolio",
    title: "Image Reveal on Scroll",
    promptText:
      "Create a portfolio image gallery where each image is clipped by a sliding panel that reveals it (like a curtain opening) as it scrolls into view, using Intersection Observer and CSS clip-path transitions.",
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
  console.log(`Seeded ${PROMPTS.length} more example prompts (batch 4).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
