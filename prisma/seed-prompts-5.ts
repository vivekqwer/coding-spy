import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROMPTS: {
  category: string;
  title: string;
  promptText: string;
  previewHtml?: string;
}[] = [
  {
    category: "Cards & Grids",
    title: "Flip Card Reveal",
    promptText:
      "Build a card that flips 180° on hover (using CSS 3D transform-style: preserve-3d and backface-visibility) to reveal different content on its back face.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17;perspective:800px}.card{width:180px;height:120px;position:relative;transform-style:preserve-3d;transition:transform .6s}.card:hover{transform:rotateY(180deg)}.face{position:absolute;inset:0;backface-visibility:hidden;border-radius:16px;display:flex;align-items:center;justify-content:center;color:#fff;font-family:sans-serif;font-weight:700}.front{background:linear-gradient(135deg,#22D3EE,#8B5CF6)}.back{background:#141a24;border:1px solid #22D3EE55;transform:rotateY(180deg)}</style><div class="card"><div class="face front">Hover Me</div><div class="face back">Surprise!</div></div>`,
  },
  {
    category: "Cards & Grids",
    title: "Hover Reveal Info Overlay",
    promptText:
      "Create an image/card tile where a dark overlay with title and description slides up from the bottom on hover, with the image slightly zooming in behind it.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.tile{width:200px;height:140px;border-radius:16px;overflow:hidden;position:relative;background:linear-gradient(135deg,#8B5CF6,#22D3EE)}.overlay{position:absolute;left:0;right:0;bottom:-100%;background:rgba(0,0,0,.7);color:#fff;padding:12px;font-family:sans-serif;transition:.3s}.tile:hover .overlay{bottom:0}</style><div class="tile"><div class="overlay"><strong>Case File</strong><p style="font-size:11px;margin:4px 0 0">Learn more inside</p></div></div>`,
  },
  {
    category: "Modals",
    title: "Blurred Backdrop Modal",
    promptText:
      "Build a modal dialog that fades in with a scale-up animation while the page behind it blurs and dims, using backdrop-filter and a CSS transition on open/close.",
    previewHtml: `<style>body{margin:0;height:100vh;background:#0B0F17}.backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center}.modal{background:#141a24;border:1px solid #22D3EE33;border-radius:16px;padding:24px;color:#fff;font-family:sans-serif;animation:pop .25s ease}@keyframes pop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}</style><div class="backdrop"><div class="modal"><h3 style="margin:0 0 8px">Confirm Action</h3><p style="color:#94A3B8;font-size:13px;margin:0">This can't be undone.</p></div></div>`,
  },
  {
    category: "Toggles",
    title: "Animated Dark Mode Switch",
    promptText:
      "Create a pill-shaped toggle switch with a sliding circle that shows a sun icon in light mode and a moon icon in dark mode, animating the icon swap and background color together.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.switch{width:60px;height:30px;background:#242c3a;border-radius:999px;position:relative;cursor:pointer;transition:.3s}.switch.on{background:linear-gradient(90deg,#22D3EE,#8B5CF6)}.knob{position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:50%;background:#fff;transition:.3s;display:flex;align-items:center;justify-content:center;font-size:12px}.switch.on .knob{left:33px}</style><div class="switch" id="s" onclick="this.classList.toggle('on');document.getElementById('k').textContent=this.classList.contains('on')?'🌙':'☀️'"><div class="knob" id="k">☀️</div></div>`,
  },
  {
    category: "Notifications",
    title: "Slide-in Toast Stack",
    promptText:
      "Build a toast notification that slides in from the top-right corner, auto-dismisses after 3 seconds with a shrinking progress bar along its bottom edge, and stacks if multiple appear.",
    previewHtml: `<style>body{margin:0;height:100vh;background:#0B0F17}.toast{position:absolute;top:20px;right:20px;background:#141a24;border:1px solid #22D3EE44;border-radius:12px;padding:12px 16px;color:#fff;font-family:sans-serif;font-size:13px;animation:slide .3s ease;overflow:hidden}.toast::after{content:'';position:absolute;bottom:0;left:0;height:2px;background:#22D3EE;animation:shrink 3s linear forwards}@keyframes slide{from{transform:translateX(120%)}to{transform:translateX(0)}}@keyframes shrink{from{width:100%}to{width:0}}</style><div class="toast">✅ Progress saved to your dossier.</div>`,
  },
  {
    category: "Progress",
    title: "Animated Circular Progress Ring",
    promptText:
      "Create an SVG circular progress ring that animates from 0 to a target percentage using stroke-dashoffset, with the percentage number counting up in sync in the center.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17;position:relative}svg{transform:rotate(-90deg)}circle{fill:none;stroke-width:8}.bg{stroke:#242c3a}.fg{stroke:#22D3EE;stroke-dasharray:283;stroke-dashoffset:283;animation:fill 1.5s ease forwards}.num{position:absolute;color:#fff;font-family:sans-serif;font-weight:700;font-size:20px}@keyframes fill{to{stroke-dashoffset:70}}</style><svg width="100" height="100"><circle class="bg" cx="50" cy="50" r="45"/><circle class="fg" cx="50" cy="50" r="45"/></svg><span class="num">75%</span>`,
  },
  {
    category: "Progress",
    title: "Top Scroll Progress Bar",
    promptText:
      "Add a thin gradient bar fixed to the very top of the page that fills from left to right proportionally to how far the user has scrolled down the document.",
    previewHtml: `<style>body{margin:0;height:250vh;background:#0B0F17}.bar{position:fixed;top:0;left:0;height:4px;background:linear-gradient(90deg,#22D3EE,#8B5CF6);width:0%}</style><div class="bar" id="b"></div><script>addEventListener('scroll',()=>{const h=document.documentElement;const pct=h.scrollTop/(h.scrollHeight-h.clientHeight)*100;document.getElementById('b').style.width=pct+'%'});<\/script>`,
  },
  {
    category: "Search",
    title: "Expanding Icon Search Bar",
    promptText:
      "Build a search icon button that expands into a full text input field when clicked, with a smooth width transition and auto-focus, collapsing back when it loses focus while empty.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.wrap{display:flex;align-items:center;background:#141a24;border:1px solid #333;border-radius:999px;padding:8px;transition:.3s}input{border:none;background:transparent;color:#fff;outline:none;width:0;transition:.3s;font-family:sans-serif}.wrap.open input{width:140px;margin-left:8px}button{background:none;border:none;color:#22D3EE;cursor:pointer;font-size:16px}</style><div class="wrap" id="w"><button onclick="document.getElementById('w').classList.toggle('open');document.getElementById('i').focus()">🔍</button><input id="i" placeholder="Search case files…"></div>`,
  },
  {
    category: "UI Components",
    title: "Stacked Avatar Group",
    promptText:
      "Create a group of overlapping circular avatars with a slight border, and a final '+N' circle showing how many additional people aren't displayed.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.stack{display:flex}.av{width:40px;height:40px;border-radius:50%;border:2px solid #0B0F17;margin-left:-12px;display:flex;align-items:center;justify-content:center;color:#fff;font-family:sans-serif;font-size:12px;font-weight:700}.stack .av:first-child{margin-left:0}</style><div class="stack"><div class="av" style="background:#22D3EE">A</div><div class="av" style="background:#8B5CF6">B</div><div class="av" style="background:#F59E0B">C</div><div class="av" style="background:#334155">+9</div></div>`,
  },
  {
    category: "Badges",
    title: "Pulsing Notification Dot",
    promptText:
      "Build a small red notification dot on the corner of an icon that continuously pulses outward with a fading ring animation to draw attention.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.wrap{position:relative;color:#fff;font-size:28px}.dot{position:absolute;top:-2px;right:-2px;width:12px;height:12px;border-radius:50%;background:#ef4444}.dot::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ef4444;animation:pulse 1.5s infinite}@keyframes pulse{to{transform:scale(2.5);opacity:0}}</style><div class="wrap">🔔<div class="dot"></div></div>`,
  },
  {
    category: "Navigation",
    title: "Smooth Accordion FAQ",
    promptText:
      "Create an accordion list where clicking a question smoothly expands/collapses its answer using a CSS grid-template-rows trick (0fr to 1fr) for animatable height, with a rotating chevron icon.",
    previewHtml: `<style>body{margin:0;background:#0B0F17;font-family:sans-serif;padding:40px}.item{border-bottom:1px solid #242c3a}.q{color:#fff;padding:14px 0;cursor:pointer;display:flex;justify-content:space-between}.a{display:grid;grid-template-rows:0fr;transition:.3s;color:#94A3B8;font-size:13px}.a>div{overflow:hidden}.item.open .a{grid-template-rows:1fr}.chev{transition:.3s}.item.open .chev{transform:rotate(180deg)}</style><div class="item" onclick="this.classList.toggle('open')"><div class="q">What is Coding Spy? <span class="chev">⌄</span></div><div class="a"><div style="padding-bottom:14px">An interactive coding tutorial platform.</div></div></div>`,
  },
  {
    category: "Cursor Effects",
    title: "Custom Cursor with Trailing Dot",
    promptText:
      "Replace the default cursor with a small glowing dot that follows the mouse instantly, plus a second larger ring that trails slightly behind with a lag/easing effect.",
    previewHtml: `<style>body{margin:0;height:100vh;background:#0B0F17;cursor:none}.dot,.ring{position:fixed;top:0;left:0;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%)}.dot{width:8px;height:8px;background:#22D3EE}.ring{width:30px;height:30px;border:1px solid #8B5CF6;transition:transform .15s ease-out}</style><div class="dot" id="d"></div><div class="ring" id="r"></div><script>let rx=0,ry=0;addEventListener('mousemove',e=>{d.style.left=e.clientX+'px';d.style.top=e.clientY+'px';rx=e.clientX;ry=e.clientY});function loop(){r.style.left=rx+'px';r.style.top=ry+'px';requestAnimationFrame(loop)}loop();<\/script>`,
  },
  {
    category: "UI Components",
    title: "Vertical Animated Timeline",
    promptText:
      "Build a vertical timeline with dots connected by a line, where each entry fades and slides in from the side as it scrolls into view using Intersection Observer.",
    previewHtml: `<style>body{margin:0;background:#0B0F17;font-family:sans-serif;padding:40px 20px;color:#fff}.line{position:relative;padding-left:24px;border-left:2px solid #242c3a}.item{position:relative;margin-bottom:24px}.item::before{content:'';position:absolute;left:-30px;top:2px;width:10px;height:10px;border-radius:50%;background:#22D3EE}</style><div class="line"><div class="item"><strong>2024</strong><p style="color:#94A3B8;font-size:13px;margin:4px 0 0">Started learning to code</p></div><div class="item"><strong>2025</strong><p style="color:#94A3B8;font-size:13px;margin:4px 0 0">Earned first certification</p></div></div>`,
  },
  {
    category: "Text Animation",
    title: "Animated Counter on Scroll",
    promptText:
      "Create a stat number that counts up from 0 to its target value over 1.5 seconds as soon as it scrolls into the viewport, using requestAnimationFrame with an ease-out curve.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.num{color:#22D3EE;font-family:sans-serif;font-size:40px;font-weight:800}</style><div class="num" id="n">0</div><script>let start=null;const target=2400;function step(ts){if(!start)start=ts;const p=Math.min((ts-start)/1500,1);document.getElementById('n').textContent=Math.floor(p*target).toLocaleString();if(p<1)requestAnimationFrame(step)}requestAnimationFrame(step);<\/script>`,
  },
  {
    category: "Landing Page",
    title: "Gradient Wave Section Divider",
    promptText:
      "Create an SVG wave shape that sits between two page sections with different background colors, giving a smooth organic transition instead of a hard straight edge.",
  },
  {
    category: "Landing Page",
    title: "Monthly/Yearly Pricing Toggle",
    promptText:
      "Build a pricing section with a monthly/yearly toggle switch that animates the displayed price change and shows a 'Save 20%' badge when yearly is selected.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0B0F17;font-family:sans-serif;color:#fff;gap:16px}.toggle{display:flex;background:#141a24;border-radius:999px;padding:4px;gap:4px}.toggle button{border:none;background:transparent;color:#94A3B8;padding:8px 16px;border-radius:999px;cursor:pointer}.toggle button.active{background:linear-gradient(90deg,#22D3EE,#8B5CF6);color:#fff}.price{font-size:36px;font-weight:800}</style><div class="toggle"><button class="active" onclick="set(this,9)">Monthly</button><button onclick="set(this,84)">Yearly</button></div><div class="price" id="p">$9<span style="font-size:14px;color:#94A3B8">/mo</span></div><script>function set(b,v){document.querySelectorAll('.toggle button').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById('p').innerHTML=v===9?'$9<span style=\\'font-size:14px;color:#94A3B8\\'>/mo</span>':'$84<span style=\\'font-size:14px;color:#94A3B8\\'>/yr</span>'}<\/script>`,
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
  console.log(`Seeded ${PROMPTS.length} more example prompts (batch 5).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
