import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROMPTS: {
  category: string;
  title: string;
  promptText: string;
  previewHtml?: string;
}[] = [
  {
    category: "Navigation",
    title: "Animated Hamburger to X Icon",
    promptText:
      "Build a hamburger menu icon made of 3 bars that morphs smoothly into an X shape when clicked, using CSS transforms and transitions on each bar (no icon library).",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.burger{width:32px;height:24px;position:relative;cursor:pointer}.bar{position:absolute;left:0;width:100%;height:3px;background:#22D3EE;border-radius:2px;transition:.3s}.bar:nth-child(1){top:0}.bar:nth-child(2){top:10px}.bar:nth-child(3){top:20px}.burger.open .bar:nth-child(1){top:10px;transform:rotate(45deg)}.burger.open .bar:nth-child(2){opacity:0}.burger.open .bar:nth-child(3){top:10px;transform:rotate(-45deg)}</style><div class="burger" onclick="this.classList.toggle('open')"><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>`,
  },
  {
    category: "Navigation",
    title: "Scroll-to-Top Fade Button",
    promptText:
      "Create a circular scroll-to-top button fixed at the bottom-right that fades and slides in only after the user scrolls down 300px, smoothly scrolling the page back to top on click.",
    previewHtml: `<style>body{margin:0;height:250vh;background:#0B0F17}.top{position:fixed;bottom:24px;right:24px;width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#22D3EE,#8B5CF6);color:#fff;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transform:translateY(10px);transition:.3s}.top.show{opacity:1;transform:translateY(0)}</style><button class="top" id="t" onclick="scrollTo({top:0,behavior:'smooth'})">↑</button><script>addEventListener('scroll',()=>document.getElementById('t').classList.toggle('show',scrollY>200));<\/script>`,
  },
  {
    category: "UI Components",
    title: "Color Palette Swatch Picker",
    promptText:
      "Build a row of circular color swatches where clicking one applies a check-mark ring around it and updates a preview box's background to the selected color, with a smooth scale animation on selection.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0B0F17;gap:16px}.row{display:flex;gap:10px}.sw{width:32px;height:32px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:.2s}.sw.active{border-color:#fff;transform:scale(1.15)}.prev{width:80px;height:50px;border-radius:10px;background:#22D3EE;transition:.3s}</style><div class="prev" id="p"></div><div class="row"><div class="sw active" style="background:#22D3EE" onclick="pick(this,'#22D3EE')"></div><div class="sw" style="background:#8B5CF6" onclick="pick(this,'#8B5CF6')"></div><div class="sw" style="background:#F59E0B" onclick="pick(this,'#F59E0B')"></div></div><script>function pick(el,c){document.querySelectorAll('.sw').forEach(s=>s.classList.remove('active'));el.classList.add('active');document.getElementById('p').style.background=c}<\/script>`,
  },
  {
    category: "UI Components",
    title: "Drag-to-Reorder List",
    promptText:
      "Create a vertical list of items that can be reordered by dragging (using the HTML5 Drag and Drop API), with a visual placeholder gap showing where the item will drop.",
  },
  {
    category: "UI Components",
    title: "Team Member Card Grid",
    promptText:
      "Build a grid of team-member cards, each with a circular avatar, name, role, and social icon row that fades in on hover with a slight upward slide, over a subtle card lift effect.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17;gap:16px}.card{width:140px;background:#141a24;border:1px solid #22D3EE22;border-radius:16px;padding:20px;text-align:center;transition:.2s}.card:hover{transform:translateY(-6px);border-color:#22D3EE66}.av{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#22D3EE,#8B5CF6);margin:0 auto 10px}.name{color:#fff;font-family:sans-serif;font-weight:700;font-size:13px}.role{color:#94A3B8;font-size:11px}</style><div class="card"><div class="av"></div><div class="name">Agent Zero</div><div class="role">Founder</div></div>`,
  },
  {
    category: "UI Components",
    title: "Blog Post Card with Reading Time",
    promptText:
      "Design a blog post preview card with a gradient thumbnail, category tag, title, excerpt, and a small footer row showing author avatar, name, and estimated reading time.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.card{width:220px;background:#141a24;border:1px solid #333;border-radius:16px;overflow:hidden;font-family:sans-serif}.thumb{height:90px;background:linear-gradient(135deg,#22D3EE,#8B5CF6)}.body{padding:14px;color:#fff}.tag{font-size:10px;color:#22D3EE;font-weight:700;text-transform:uppercase}.title{font-size:14px;font-weight:700;margin:6px 0}.foot{display:flex;align-items:center;gap:6px;margin-top:10px;font-size:10px;color:#94A3B8}.dot{width:20px;height:20px;border-radius:50%;background:#8B5CF6}</style><div class="card"><div class="thumb"></div><div class="body"><div class="tag">React</div><div class="title">Mastering Hooks</div><div class="foot"><div class="dot"></div> Agent Zero · 4 min read</div></div></div>`,
  },
  {
    category: "Modals",
    title: "Newsletter Signup Popup",
    promptText:
      "Build a centered popup modal that appears after a short delay, with an email input, subscribe button, and a small 'No thanks' dismiss link, animating in with a scale+fade.",
  },
  {
    category: "Notifications",
    title: "Cookie Consent Banner",
    promptText:
      "Create a bottom-fixed cookie consent banner that slides up on page load, with Accept/Decline buttons, disappearing with a slide-down animation once a choice is made.",
    previewHtml: `<style>body{margin:0;height:100vh;background:#0B0F17;display:flex;align-items:flex-end}.banner{width:100%;background:#141a24;border-top:1px solid #22D3EE33;padding:16px 24px;display:flex;justify-content:space-between;align-items:center;color:#fff;font-family:sans-serif;font-size:13px;animation:up .3s ease}.banner button{margin-left:8px;padding:8px 16px;border-radius:8px;border:none;cursor:pointer}.accept{background:linear-gradient(90deg,#22D3EE,#8B5CF6);color:#fff}.decline{background:transparent;color:#94A3B8;border:1px solid #333!important}@keyframes up{from{transform:translateY(100%)}to{transform:translateY(0)}}</style><div class="banner">🍪 We use cookies to improve your experience.<span><button class="decline">Decline</button><button class="accept">Accept</button></span></div>`,
  },
  {
    category: "UI Components",
    title: "Feature Comparison Table",
    promptText:
      "Build a pricing-style feature comparison table with 3 plan columns and rows of checkmarks/crosses, highlighting the recommended plan's column with a colored border and 'Popular' badge.",
  },
  {
    category: "UI Components",
    title: "Video Play Button Overlay",
    promptText:
      "Create a video thumbnail with a centered circular play button that has a pulsing ring animation, scaling up slightly and darkening the thumbnail on hover.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.thumb{width:220px;height:130px;border-radius:14px;background:linear-gradient(135deg,#1c2433,#141a24);position:relative;display:flex;align-items:center;justify-content:center;cursor:pointer}.play{width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,.15);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;color:#fff;position:relative}.play::after{content:'';position:absolute;inset:-8px;border:2px solid #22D3EE;border-radius:50%;animation:ring 1.6s infinite}@keyframes ring{to{transform:scale(1.4);opacity:0}}</style><div class="thumb"><div class="play">▶</div></div>`,
  },
  {
    category: "Navigation",
    title: "Sticky Table of Contents Sidebar",
    promptText:
      "Build a sticky sidebar table-of-contents where the currently-in-view section heading is automatically highlighted as the user scrolls, using Intersection Observer to track active sections.",
  },
  {
    category: "UI Components",
    title: "Review Rating Distribution Bars",
    promptText:
      "Create a review summary showing an average star rating next to horizontal bars for 5-star through 1-star counts, each bar animating its width in from 0 on page load.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;flex-direction:column;justify-content:center;gap:6px;background:#0B0F17;padding:0 40px;font-family:sans-serif;color:#94A3B8;font-size:12px}.row{display:flex;align-items:center;gap:8px}.bar{flex:1;height:8px;background:#242c3a;border-radius:4px;overflow:hidden}.fill{height:100%;background:#F59E0B;animation:grow 1s ease forwards;width:0}@keyframes grow{to{width:var(--w)}}</style><div class="row">5★ <div class="bar"><div class="fill" style="--w:80%"></div></div></div><div class="row">4★ <div class="bar"><div class="fill" style="--w:50%"></div></div></div><div class="row">3★ <div class="bar"><div class="fill" style="--w:20%"></div></div></div>`,
  },
  {
    category: "Loaders",
    title: "Page Transition Wipe Loader",
    promptText:
      "Create a full-screen color wipe transition that slides across the viewport and back when navigating between pages, revealing the new page content underneath.",
  },
  {
    category: "UI Components",
    title: "Empty State Illustration Card",
    promptText:
      "Design an empty-state placeholder (for when a list has no items) with a simple centered icon inside a soft glowing circle, a friendly headline, and a short call-to-action button — matching a 'No intel yet, Agent' spy-themed tone.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0B0F17;font-family:sans-serif;color:#fff;gap:10px}.circle{width:70px;height:70px;border-radius:50%;background:radial-gradient(circle,#22D3EE33,transparent 70%);display:flex;align-items:center;justify-content:center;font-size:28px}h3{margin:0}p{color:#94A3B8;font-size:13px;margin:0}button{padding:10px 20px;border-radius:8px;border:none;background:linear-gradient(90deg,#22D3EE,#8B5CF6);color:#fff;font-weight:600;cursor:pointer;margin-top:6px}</style><div class="circle">🕵️</div><h3>No intel yet, Agent.</h3><p>Start a case file to see it here.</p><button>Browse Case Files</button>`,
  },
  {
    category: "3D Scroll Animation",
    title: "Horizontal Scroll-Jacked Gallery",
    promptText:
      "Build a section where vertical page scroll is translated into horizontal movement of a row of large image panels (scroll-jacking), so scrolling down the page pans across a gallery sideways.",
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
  console.log(`Seeded ${PROMPTS.length} more example prompts (batch 7).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
