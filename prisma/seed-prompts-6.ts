import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROMPTS: {
  category: string;
  title: string;
  promptText: string;
  previewHtml?: string;
}[] = [
  {
    category: "Loaders",
    title: "Skeleton Loading Placeholder",
    promptText:
      "Create skeleton-screen placeholder blocks (avatar circle + text lines) with a shimmering gradient sweep animation to indicate content is loading, before the real content appears.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17;gap:12px}.sk{background:linear-gradient(90deg,#1a2230 25%,#242c3a 37%,#1a2230 63%);background-size:400% 100%;animation:shimmer 1.4s infinite;border-radius:8px}@keyframes shimmer{0%{background-position:100% 0}100%{background-position:0 0}}.avatar{width:44px;height:44px;border-radius:50%}.lines{display:flex;flex-direction:column;gap:8px}.line1{width:140px;height:12px}.line2{width:100px;height:12px}</style><div class="sk avatar"></div><div class="lines"><div class="sk line1"></div><div class="sk line2"></div></div>`,
  },
  {
    category: "UI Components",
    title: "Before/After Image Comparison Slider",
    promptText:
      "Build a draggable vertical divider that reveals a 'before' image on one side and an 'after' image on the other as the user drags left/right across the container.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.wrap{position:relative;width:240px;height:150px;border-radius:12px;overflow:hidden;background:#8B5CF6}.after{position:absolute;inset:0;background:#22D3EE;clip-path:inset(0 0 0 50%)}.handle{position:absolute;top:0;bottom:0;left:50%;width:2px;background:#fff;cursor:ew-resize}.handle::after{content:'⇔';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;color:#000;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px}</style><div class="wrap" id="w"><div class="after" id="a"></div><div class="handle" id="h" style="left:50%"></div></div><script>const w=document.getElementById('w'),h=document.getElementById('h'),a=document.getElementById('a');let drag=false;h.addEventListener('mousedown',()=>drag=true);addEventListener('mouseup',()=>drag=false);addEventListener('mousemove',e=>{if(!drag)return;const r=w.getBoundingClientRect();let pct=((e.clientX-r.left)/r.width)*100;pct=Math.max(0,Math.min(100,pct));h.style.left=pct+'%';a.style.clipPath='inset(0 0 0 '+pct+'%)'});<\/script>`,
  },
  {
    category: "UI Components",
    title: "Interactive Star Rating",
    promptText:
      "Create a 5-star rating widget where stars fill in with a golden color on hover (previewing the rating) and lock in that value on click, with a smooth color transition.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17;gap:4px;font-size:28px}.star{color:#334155;cursor:pointer;transition:.15s}.stars:hover .star{color:#334155}.stars .star:hover,.stars .star:hover ~ .star{color:#334155}.stars{display:flex;flex-direction:row-reverse}.stars .star:hover,.stars .star:hover~.star{color:#F59E0B}</style><div class="stars"><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span></div>`,
  },
  {
    category: "UI Components",
    title: "Chat Message Bubbles",
    promptText:
      "Build a chat conversation UI with rounded message bubbles that align right (sender, gradient background) and left (receiver, muted background), including small tails and a typing-indicator animation with 3 bouncing dots.",
    previewHtml: `<style>body{margin:0;background:#0B0F17;font-family:sans-serif;padding:20px;display:flex;flex-direction:column;gap:8px}.msg{max-width:70%;padding:10px 14px;border-radius:16px;font-size:13px;color:#fff}.me{align-self:flex-end;background:linear-gradient(135deg,#22D3EE,#8B5CF6);border-bottom-right-radius:4px}.them{align-self:flex-start;background:#141a24;border-bottom-left-radius:4px}.typing{align-self:flex-start;background:#141a24;padding:12px 16px;border-radius:16px;display:flex;gap:4px}.dot{width:6px;height:6px;background:#94A3B8;border-radius:50%;animation:b .6s infinite alternate}.dot:nth-child(2){animation-delay:.15s}.dot:nth-child(3){animation-delay:.3s}@keyframes b{to{transform:translateY(-4px)}}</style><div class="msg them">Hey Agent, ready for today's mission?</div><div class="msg me">Always. Send the case file.</div><div class="typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`,
  },
  {
    category: "UI Components",
    title: "Copy-to-Clipboard Code Block",
    promptText:
      "Create a syntax-highlighted code block with a copy icon button in the top-right corner that changes to a checkmark for 2 seconds after copying the code to the clipboard.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17;font-family:monospace}.block{position:relative;background:#0d1117;border:1px solid #22D3EE33;border-radius:12px;padding:16px 40px 16px 16px;color:#94A3B8;font-size:12px}.copy{position:absolute;top:10px;right:10px;background:#1c2433;border:none;color:#22D3EE;border-radius:6px;padding:4px 6px;cursor:pointer;font-size:11px}</style><div class="block"><button class="copy" id="c" onclick="navigator.clipboard.writeText('console.log(\\'hi\\')');this.textContent='✓';setTimeout(()=>this.textContent='⧉',1500)">⧉</button>console.log('hi')</div>`,
  },
  {
    category: "Backgrounds",
    title: "Confetti Burst Celebration",
    promptText:
      "Create a burst of colorful confetti particles that shoot outward from the center and fall with gravity and rotation when a button is clicked, using JavaScript canvas or absolutely positioned divs.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17;overflow:hidden;position:relative}button{padding:12px 24px;border-radius:10px;border:none;background:linear-gradient(90deg,#22D3EE,#8B5CF6);color:#fff;font-family:sans-serif;font-weight:700;cursor:pointer;z-index:2}.p{position:absolute;width:8px;height:8px;top:50%;left:50%}</style><button onclick="burst()">Celebrate 🎉</button><script>function burst(){const colors=['#22D3EE','#8B5CF6','#F59E0B'];for(let i=0;i<24;i++){const p=document.createElement('div');p.className='p';p.style.background=colors[i%3];document.body.appendChild(p);const angle=Math.random()*Math.PI*2,dist=80+Math.random()*80;p.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:'translate('+Math.cos(angle)*dist+'px,'+(Math.sin(angle)*dist+120)+'px) rotate(360deg)',opacity:0}],{duration:900,easing:'ease-out'}).onfinish=()=>p.remove()}}<\/script>`,
  },
  {
    category: "Forms",
    title: "Password Strength Meter",
    promptText:
      "Build a password input where a colored strength bar (red → amber → green) and label update live as the user types, based on length and character variety checks.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0B0F17;gap:8px;font-family:sans-serif}input{padding:10px;border-radius:8px;border:1px solid #333;background:#141a24;color:#fff}.bar{width:220px;height:6px;background:#242c3a;border-radius:4px;overflow:hidden}.fill{height:100%;width:0%;transition:.3s;background:#ef4444}.lbl{color:#94A3B8;font-size:12px}</style><input type="password" id="p" placeholder="Enter password" oninput="check(this.value)"><div class="bar"><div class="fill" id="f"></div></div><div class="lbl" id="l">Too weak</div><script>function check(v){let s=Math.min(v.length*10,100);const f=document.getElementById('f'),l=document.getElementById('l');f.style.width=s+'%';f.style.background=s<40?'#ef4444':s<75?'#F59E0B':'#22c55e';l.textContent=s<40?'Too weak':s<75?'Getting there':'Strong password'}<\/script>`,
  },
  {
    category: "Navigation",
    title: "Animated Breadcrumb Trail",
    promptText:
      "Create a breadcrumb navigation where each new segment fades and slides in from the right as the user navigates deeper, with a subtle chevron separator between items.",
  },
  {
    category: "Forms",
    title: "Tag Input with Chips",
    promptText:
      "Build a text input where pressing Enter converts the typed text into a removable 'chip' tag displayed inline, supporting backspace to delete the last chip when the input is empty.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.box{display:flex;flex-wrap:wrap;gap:6px;align-items:center;background:#141a24;border:1px solid #333;border-radius:10px;padding:8px;width:240px}.chip{background:#22D3EE22;color:#22D3EE;padding:4px 8px;border-radius:6px;font-size:12px;font-family:sans-serif;display:flex;gap:4px;align-items:center}input{border:none;background:transparent;color:#fff;outline:none;flex:1;min-width:60px}</style><div class="box" id="b"><span class="chip">react <span onclick="this.parentElement.remove()" style="cursor:pointer">×</span></span><input placeholder="Add tag…" onkeydown="if(event.key==='Enter'&&this.value){const c=document.createElement('span');c.className='chip';c.innerHTML=this.value+' <span style=\\'cursor:pointer\\' onclick=\\'this.parentElement.remove()\\'>×</span>';document.getElementById('b').insertBefore(c,this);this.value=''}"></div>`,
  },
  {
    category: "Forms",
    title: "Drag-and-Drop File Upload Zone",
    promptText:
      "Create a dashed-border dropzone that highlights with a colored glow when a file is dragged over it, and shows a file-name preview once dropped or selected via click.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.zone{width:220px;height:130px;border:2px dashed #333;border-radius:14px;display:flex;align-items:center;justify-content:center;color:#94A3B8;font-family:sans-serif;font-size:13px;transition:.2s}.zone.over{border-color:#22D3EE;background:#22D3EE11;color:#22D3EE}</style><div class="zone" id="z" ondragover="event.preventDefault();this.classList.add('over')" ondragleave="this.classList.remove('over')" ondrop="event.preventDefault();this.textContent='File ready ✓';this.classList.remove('over')">Drop files here</div>`,
  },
  {
    category: "Text Animation",
    title: "Countdown Timer",
    promptText:
      "Build a countdown timer showing days, hours, minutes, and seconds in separate flip-style boxes, updating every second with the digits sliding/fading on change.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17;gap:10px;font-family:sans-serif}.box{background:#141a24;border:1px solid #22D3EE33;border-radius:10px;padding:12px 14px;text-align:center;color:#fff}.box .n{font-size:22px;font-weight:800;color:#22D3EE}.box .l{font-size:10px;color:#94A3B8}</style><div class="box"><div class="n" id="h">00</div><div class="l">HRS</div></div><div class="box"><div class="n" id="m">00</div><div class="l">MIN</div></div><div class="box"><div class="n" id="s">00</div><div class="l">SEC</div></div><script>let t=3661;function tick(){const h=Math.floor(t/3600),m=Math.floor(t%3600/60),s=t%60;document.getElementById('h').textContent=String(h).padStart(2,'0');document.getElementById('m').textContent=String(m).padStart(2,'0');document.getElementById('s').textContent=String(s).padStart(2,'0');t--;if(t>=0)setTimeout(tick,1000)}tick();<\/script>`,
  },
  {
    category: "Navigation",
    title: "Sticky Bottom CTA Bar",
    promptText:
      "Create a bottom-fixed call-to-action bar that slides up into view once the user scrolls past a certain point on the page, with a dismiss (×) button that hides it for the session.",
  },
  {
    category: "UI Components",
    title: "Notification Bell Dropdown",
    promptText:
      "Build a bell icon with an unread-count badge that opens a dropdown panel of recent notifications when clicked, closing when clicking outside the panel.",
  },
  {
    category: "Forms",
    title: "Segmented Control Switch",
    promptText:
      "Create a segmented control (like iOS) with 3 options where a sliding highlighted background smoothly animates to whichever segment is selected, using a single moving pill element positioned via transform.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.seg{position:relative;display:flex;background:#141a24;border-radius:999px;padding:4px;width:240px}.pill{position:absolute;top:4px;left:4px;width:calc(33.33% - 4px);height:calc(100% - 8px);background:linear-gradient(90deg,#22D3EE,#8B5CF6);border-radius:999px;transition:.25s}.opt{flex:1;text-align:center;padding:8px 0;color:#94A3B8;font-family:sans-serif;font-size:12px;cursor:pointer;z-index:1}.opt.active{color:#fff}</style><div class="seg" id="s"><div class="pill" id="p"></div><div class="opt active" onclick="sel(this,0)">Day</div><div class="opt" onclick="sel(this,1)">Week</div><div class="opt" onclick="sel(this,2)">Month</div></div><script>function sel(el,i){document.querySelectorAll('.opt').forEach(o=>o.classList.remove('active'));el.classList.add('active');document.getElementById('p').style.transform='translateX('+(i*100)+'%)'}<\/script>`,
  },
  {
    category: "UI Components",
    title: "Step Progress Wizard",
    promptText:
      "Build a multi-step form progress indicator with numbered circles connected by a line, where completed steps turn solid with a checkmark and the current step pulses.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17;gap:0}.step{display:flex;align-items:center}.circle{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-family:sans-serif;font-size:13px;font-weight:700}.done{background:#22c55e}.current{background:linear-gradient(135deg,#22D3EE,#8B5CF6);animation:pulse 1.5s infinite}.todo{background:#242c3a;color:#94A3B8}.line{width:40px;height:2px;background:#242c3a}@keyframes pulse{50%{box-shadow:0 0 0 6px rgba(34,211,238,.15)}}</style><div class="step"><div class="circle done">✓</div><div class="line"></div><div class="circle current">2</div><div class="line"></div><div class="circle todo">3</div></div>`,
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
  console.log(`Seeded ${PROMPTS.length} more example prompts (batch 6).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
