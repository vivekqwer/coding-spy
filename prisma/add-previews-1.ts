import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const B = "#0B0F17";
const wrap = (inner: string, extra = "") =>
  `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:${B};font-family:sans-serif;${extra}}</style>${inner}`;

const PREVIEWS: { title: string; category: string; previewHtml: string }[] = [
  {
    title: "Scroll-Triggered 3D Card Flip",
    category: "3D Scroll Animation",
    previewHtml: wrap(
      `<style>.row{display:flex;gap:14px;perspective:800px}.c{width:70px;height:96px;border-radius:10px;background:linear-gradient(135deg,#22D3EE,#8B5CF6);animation:flip 3s ease-in-out infinite;transform-style:preserve-3d}.c:nth-child(2){animation-delay:.3s}.c:nth-child(3){animation-delay:.6s}@keyframes flip{0%,40%{transform:rotateY(90deg)}60%,100%{transform:rotateY(0)}}</style><div class="row"><div class="c"></div><div class="c"></div><div class="c"></div></div>`
    ),
  },
  {
    title: "Horizontal Scroll-Jacked Gallery",
    category: "3D Scroll Animation",
    previewHtml: wrap(
      `<style>.view{width:280px;overflow:hidden;border-radius:12px}.track{display:flex;gap:10px;animation:pan 4s ease-in-out infinite alternate}.p{min-width:120px;height:120px;border-radius:10px}.p:nth-child(1){background:linear-gradient(135deg,#22D3EE,#0ea5e9)}.p:nth-child(2){background:linear-gradient(135deg,#8B5CF6,#6366f1)}.p:nth-child(3){background:linear-gradient(135deg,#F59E0B,#ef4444)}@keyframes pan{to{transform:translateX(-140px)}}</style><div class="view"><div class="track"><div class="p"></div><div class="p"></div><div class="p"></div></div></div>`
    ),
  },
  {
    title: "Animated Noise Grain Overlay",
    category: "Backgrounds",
    previewHtml: `<style>body{margin:0;height:100vh;background:linear-gradient(135deg,#1e1b4b,#0B0F17)}.g{position:fixed;inset:0;opacity:.35;animation:n .4s steps(2) infinite}@keyframes n{to{transform:translate(3px,-2px)}}</style><svg class="g" xmlns="http://www.w3.org/2000/svg"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2"/></filter><rect width="100%" height="100%" filter="url(#f)"/></svg>`,
  },
  {
    title: "User Reputation Badge Tier",
    category: "Badges",
    previewHtml: wrap(
      `<div style="display:flex;align-items:center;gap:8px;color:#fff;font-size:14px">Agent Zero <span style="display:inline-flex;align-items:center;gap:4px;background:#F59E0B22;color:#F59E0B;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700">★ Gold · 4,820</span></div>`
    ),
  },
  {
    title: "Like Button Burst Animation",
    category: "Buttons",
    previewHtml: wrap(
      `<style>.h{font-size:40px;color:#ec4899;position:relative;cursor:pointer;animation:beat 1.5s infinite}.h span{position:absolute;top:50%;left:50%;font-size:12px;color:#ec4899;animation:burst 1.5s infinite}.h span:nth-child(1){--x:-24px;--y:-20px}.h span:nth-child(2){--x:24px;--y:-20px}.h span:nth-child(3){--x:0;--y:-30px}@keyframes beat{40%{transform:scale(1.25)}50%{transform:scale(1)}}@keyframes burst{0%,35%{opacity:0;transform:translate(-50%,-50%)}45%{opacity:1}70%,100%{opacity:0;transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y)))}}</style><div class="h">♥<span>♥</span><span>♥</span><span>♥</span></div>`
    ),
  },
  {
    title: "Message Read-Receipt Ticks",
    category: "Chat & Messaging",
    previewHtml: wrap(
      `<style>.b{background:linear-gradient(135deg,#22D3EE,#8B5CF6);color:#fff;padding:8px 12px;border-radius:14px;border-bottom-right-radius:2px;font-size:13px;display:flex;align-items:flex-end;gap:6px}.t{color:#a5f3fc;font-size:11px;letter-spacing:-3px}</style><div class="b">On my way<span class="t">✓✓</span></div>`
    ),
  },
  {
    title: "Contact List with Online Dot",
    category: "Chat & Messaging",
    previewHtml: wrap(
      `<style>.row{display:flex;align-items:center;gap:10px;width:260px;color:#fff}.av{position:relative;width:40px;height:40px;border-radius:50%;background:#8B5CF6}.av::after{content:'';position:absolute;bottom:0;right:0;width:11px;height:11px;border-radius:50%;background:#22c55e;border:2px solid ${B}}.n{font-size:13px;font-weight:600}.m{font-size:11px;color:#94A3B8}.badge{margin-left:auto;background:#22D3EE;color:#031;font-size:10px;font-weight:700;border-radius:10px;padding:2px 7px}</style><div class="row"><div class="av"></div><div><div class="n">Agent Vega</div><div class="m">See you at HQ</div></div><span class="badge">3</span></div>`
    ),
  },
  {
    title: "Voice Message Waveform Bubble",
    category: "Chat & Messaging",
    previewHtml: wrap(
      `<style>.b{display:flex;align-items:center;gap:8px;background:#1e293b;padding:10px 14px;border-radius:16px}.play{width:28px;height:28px;border-radius:50%;background:#22D3EE;color:#031;display:flex;align-items:center;justify-content:center;font-size:12px}.w{display:flex;gap:2px;align-items:center}.w i{width:3px;background:#64748b;border-radius:2px}.w i.on{background:#22D3EE}.t{color:#94A3B8;font-size:11px}</style><div class="b"><div class="play">▶</div><div class="w"><i class="on" style="height:8px"></i><i class="on" style="height:16px"></i><i class="on" style="height:10px"></i><i style="height:20px"></i><i style="height:12px"></i><i style="height:6px"></i></div><span class="t">0:12</span></div>`
    ),
  },
  {
    title: "Swipe-to-Reply Message Row",
    category: "Chat & Messaging",
    previewHtml: wrap(
      `<style>.wrap{position:relative;width:260px}.icon{position:absolute;left:0;top:50%;transform:translateY(-50%);color:#22D3EE;font-size:18px}.b{background:#1e293b;color:#fff;padding:10px 14px;border-radius:14px;font-size:13px;animation:sw 2.5s ease-in-out infinite}@keyframes sw{40%{transform:translateX(34px)}60%{transform:translateX(0)}}</style><div class="wrap"><span class="icon">↩</span><div class="b">Swipe me to reply</div></div>`
    ),
  },
  {
    title: "Collapsible Sidebar Toggle",
    category: "Dashboard",
    previewHtml: wrap(
      `<style>.app{display:flex;height:170px;width:300px;border:1px solid #1e293b;border-radius:12px;overflow:hidden}.side{background:#141a24;color:#fff;padding:12px;animation:col 3s ease-in-out infinite;overflow:hidden;white-space:nowrap}.side div{margin:8px 0;font-size:12px}@keyframes col{0%,40%{width:120px}60%,100%{width:36px}}.main{flex:1;background:#0d1117}</style><div class="app"><div class="side"><div>▸ Overview</div><div>▸ Reports</div><div>▸ Users</div></div><div class="main"></div></div>`
    ),
  },
  {
    title: "Notification Center Slide Panel",
    category: "Dashboard",
    previewHtml: wrap(
      `<style>.panel{width:230px;background:#141a24;border:1px solid #22D3EE22;border-radius:12px;padding:12px;color:#fff;animation:in .6s ease}@keyframes in{from{transform:translateX(40px);opacity:0}}.h{font-size:10px;color:#94A3B8;text-transform:uppercase;margin:8px 0 4px}.item{display:flex;gap:8px;align-items:center;font-size:12px;padding:6px 0}.dot{width:7px;height:7px;border-radius:50%;background:#22D3EE}</style><div class="panel"><div class="h">Today</div><div class="item"><span class="dot"></span>New login detected</div><div class="item"><span class="dot"></span>Report ready</div></div>`
    ),
  },
  {
    title: "Dark Dashboard Shell Layout",
    category: "Dashboard",
    previewHtml: wrap(
      `<style>.app{width:300px;height:180px;border-radius:12px;overflow:hidden;display:flex;flex-direction:column;border:1px solid #1e293b}.top{height:32px;background:#141a24;display:flex;align-items:center;padding:0 10px;gap:8px}.s{flex:1;height:14px;background:#0d1117;border-radius:7px}.av{width:18px;height:18px;border-radius:50%;background:#8B5CF6}.body{flex:1;display:flex}.side{width:44px;background:#141a24;padding:8px;display:flex;flex-direction:column;gap:10px}.side i{width:20px;height:20px;border-radius:6px;background:#22D3EE33;display:block}.content{flex:1;background:#0d1117}</style><div class="app"><div class="top"><div class="s"></div><div class="av"></div></div><div class="body"><div class="side"><i></i><i></i><i></i></div><div class="content"></div></div></div>`
    ),
  },
  {
    title: "Sortable Data Table Headers",
    category: "Dashboard",
    previewHtml: wrap(
      `<style>table{border-collapse:collapse;color:#fff;font-size:12px}th{text-align:left;padding:8px 16px;color:#94A3B8;cursor:pointer;border-bottom:1px solid #1e293b}th.active{color:#22D3EE}td{padding:8px 16px;border-bottom:1px solid #141a24}</style><table><tr><th class="active">Name ▲</th><th>Score</th></tr><tr><td>Agent Zero</td><td>980</td></tr><tr><td>Agent Vega</td><td>870</td></tr></table>`
    ),
  },
  {
    title: "Slide-in Cart Drawer",
    category: "E-commerce",
    previewHtml: `<style>body{margin:0;height:100vh;background:rgba(0,0,0,.5);display:flex;justify-content:flex-end;font-family:sans-serif}.d{width:180px;background:#141a24;color:#fff;padding:16px;animation:in .5s ease}@keyframes in{from{transform:translateX(100%)}}.h{font-weight:700;margin-bottom:12px}.li{display:flex;justify-content:space-between;font-size:12px;padding:8px 0;border-bottom:1px solid #1e293b}.co{margin-top:12px;background:linear-gradient(90deg,#22D3EE,#8B5CF6);border:none;color:#fff;padding:10px;border-radius:8px;width:100%;font-weight:600}</style><div class="d"><div class="h">Your Cart</div><div class="li">Hoodie<span>$49</span></div><div class="li">Cap<span>$19</span></div><button class="co">Checkout</button></div>`,
  },
  {
    title: "Quick View Product Modal",
    category: "E-commerce",
    previewHtml: `<style>body{margin:0;height:100vh;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;font-family:sans-serif}.m{display:flex;background:#141a24;border-radius:14px;overflow:hidden;width:280px;animation:pop .3s ease}@keyframes pop{from{transform:scale(.9);opacity:0}}.img{width:120px;background:linear-gradient(135deg,#22D3EE,#8B5CF6)}.info{padding:14px;color:#fff}.p{font-size:18px;font-weight:800;margin:6px 0}.btn{background:#22D3EE;border:none;color:#031;padding:8px 14px;border-radius:8px;font-weight:600}</style><div class="m"><div class="img"></div><div class="info"><div>Agent Hoodie</div><div class="p">$49</div><button class="btn">Add to Cart</button></div></div>`,
  },
  {
    title: "Add-to-Cart Success Bounce",
    category: "E-commerce",
    previewHtml: wrap(
      `<style>.btn{background:#22c55e;color:#fff;border:none;padding:12px 24px;border-radius:10px;font-weight:700;font-size:14px;animation:b 2s ease-in-out infinite}@keyframes b{40%{transform:scale(1.12)}55%{transform:scale(1)}}</style><button class="btn">✓ Added</button>`
    ),
  },
  {
    title: "Sticky Add-to-Cart Bar",
    category: "E-commerce",
    previewHtml: `<style>body{margin:0;height:100vh;background:${B};display:flex;align-items:flex-end;font-family:sans-serif}.bar{width:100%;background:#141a24;border-top:1px solid #22D3EE33;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;animation:up .5s ease}@keyframes up{from{transform:translateY(100%)}}.n{color:#fff;font-size:13px}.p{color:#22D3EE;font-weight:800}.btn{background:linear-gradient(90deg,#22D3EE,#8B5CF6);border:none;color:#fff;padding:8px 16px;border-radius:8px;font-weight:600}</style><div class="bar"><div><div class="n">Agent Hoodie</div><div class="p">$49</div></div><button class="btn">Add to Cart</button></div>`,
  },
  {
    title: "Maintenance Mode Page",
    category: "Error Pages",
    previewHtml: wrap(
      `<style>.gear{font-size:44px;animation:spin 4s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}h3{margin:10px 0 4px}p{color:#94A3B8;font-size:12px;margin:0}</style><div style="text-align:center;color:#fff"><div class="gear">⚙️</div><h3>Under Maintenance</h3><p>Back online at 6:00 PM UTC</p></div>`,
      "flex-direction:column"
    ),
  },
  {
    title: "Under Construction Page",
    category: "Error Pages",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif;color:#111;background:repeating-linear-gradient(45deg,#F59E0B,#F59E0B 20px,#111 20px,#111 40px)}.card{background:#fff;padding:20px 30px;border-radius:12px;text-align:center}.c{font-size:36px;display:inline-block;animation:bob 1.2s ease-in-out infinite}@keyframes bob{50%{transform:translateY(-8px)}}</style><div class="card"><div class="c">🚧</div><div style="font-weight:800;margin-top:6px">Under Construction</div></div>`,
  },
  {
    title: "Table Reservation Form",
    category: "Forms",
    previewHtml: wrap(
      `<style>.f{background:#141a24;padding:16px;border-radius:12px;width:220px;color:#fff}.lbl{font-size:11px;color:#94A3B8;margin:8px 0 4px}.step{display:flex;align-items:center;gap:10px}.step b{width:26px;height:26px;border-radius:6px;background:#22D3EE33;color:#22D3EE;display:flex;align-items:center;justify-content:center;cursor:pointer}.chips{display:flex;gap:6px}.chip{font-size:11px;padding:4px 8px;border-radius:6px;background:#1e293b}.chip.on{background:linear-gradient(90deg,#22D3EE,#8B5CF6)}.btn{margin-top:12px;width:100%;background:linear-gradient(90deg,#22D3EE,#8B5CF6);border:none;color:#fff;padding:9px;border-radius:8px;font-weight:600}</style><div class="f"><div class="lbl">Party size</div><div class="step"><b>−</b>4<b>+</b></div><div class="lbl">Time</div><div class="chips"><span class="chip">7:00</span><span class="chip on">7:30</span><span class="chip">8:00</span></div><button class="btn">Confirm Reservation</button></div>`
    ),
  },
  {
    title: "Phone Input with Country Flag",
    category: "Forms",
    previewHtml: wrap(
      `<style>.grp{display:flex;background:#141a24;border:1px solid #333;border-radius:8px;overflow:hidden}.cc{display:flex;align-items:center;gap:4px;padding:0 10px;background:#1e293b;color:#fff;font-size:13px;border-right:1px solid #333}input{border:none;background:transparent;color:#fff;padding:10px;outline:none}</style><div class="grp"><div class="cc">🇮🇳 +91 ▾</div><input value="98765 43210"></div>`
    ),
  },
  {
    title: "Signature Pad Canvas",
    category: "Forms",
    previewHtml: wrap(
      `<style>.pad{background:#fff;border-radius:10px;padding:8px;width:220px}.line{border-bottom:1px dashed #cbd5e1;height:70px;position:relative}svg{position:absolute;bottom:8px;left:14px}.foot{display:flex;justify-content:space-between;align-items:center;margin-top:6px}.clr{font-size:11px;color:#ef4444;cursor:pointer}</style><div class="pad"><div class="line"><svg width="140" height="46"><path d="M4 34 Q22 4 40 30 T90 22 T134 30" fill="none" stroke="#111" stroke-width="2.5"/></svg></div><div class="foot"><span style="font-size:11px;color:#94a3b8">Sign above</span><span class="clr">Clear</span></div></div>`
    ),
  },
  {
    title: "Multi-Select Dropdown with Chips",
    category: "Forms",
    previewHtml: wrap(
      `<style>.field{width:230px;background:#141a24;border:1px solid #333;border-radius:8px;padding:8px;display:flex;flex-wrap:wrap;gap:6px;align-items:center}.chip{display:flex;align-items:center;gap:4px;background:#22D3EE22;color:#22D3EE;font-size:12px;padding:3px 8px;border-radius:6px}.chip b{cursor:pointer}.ph{color:#64748b;font-size:12px}</style><div class="field"><span class="chip">React <b>×</b></span><span class="chip">Next.js <b>×</b></span><span class="ph">Add more…</span></div>`
    ),
  },
  {
    title: "Date Range Picker",
    category: "Forms",
    previewHtml: wrap(
      `<style>.cal{background:#141a24;padding:12px;border-radius:10px;color:#fff}.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}.d{width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:10px;border-radius:5px;color:#94A3B8}.d.range{background:#22D3EE22;color:#fff;border-radius:0}.d.start,.d.end{background:linear-gradient(90deg,#22D3EE,#8B5CF6);color:#fff}</style><div class="cal"><div class="grid"><span class="d">10</span><span class="d start">11</span><span class="d range">12</span><span class="d range">13</span><span class="d range">14</span><span class="d end">15</span><span class="d">16</span></div></div>`
    ),
  },
  {
    title: "Address Autocomplete Field",
    category: "Forms",
    previewHtml: wrap(
      `<style>.w{width:230px}input{width:100%;box-sizing:border-box;background:#141a24;border:1px solid #333;color:#fff;padding:10px;border-radius:8px 8px 0 0;outline:none}.list{background:#141a24;border:1px solid #333;border-top:none;border-radius:0 0 8px 8px}.it{padding:8px 10px;font-size:12px;color:#94A3B8;display:flex;gap:6px}.it b{color:#22D3EE;font-weight:700}</style><div class="w"><input value="221B Baker"><div class="list"><div class="it">📍 <span><b>221B Baker</b> Street, London</span></div><div class="it">📍 <span><b>221B Baker</b> Ave, NY</span></div></div></div>`
    ),
  },
  {
    title: "Star Rating Review Form",
    category: "Forms",
    previewHtml: wrap(
      `<style>.f{background:#141a24;padding:16px;border-radius:12px;width:220px}.stars{font-size:24px;color:#F59E0B;letter-spacing:2px}.stars .off{color:#334155}textarea{width:100%;box-sizing:border-box;margin-top:8px;background:#0d1117;border:1px solid #333;border-radius:8px;color:#fff;padding:8px;resize:none;font-family:inherit}.btn{margin-top:8px;width:100%;background:linear-gradient(90deg,#22D3EE,#8B5CF6);border:none;color:#fff;padding:9px;border-radius:8px;font-weight:600}</style><div class="f"><div class="stars">★★★★<span class="off">★</span></div><textarea rows="2">Great course!</textarea><button class="btn">Submit Review</button></div>`
    ),
  },
  {
    title: "Multiple Choice Survey Question",
    category: "Forms",
    previewHtml: wrap(
      `<style>.card{background:#141a24;padding:16px;border-radius:12px;width:230px;color:#fff}.q{font-size:10px;color:#22D3EE;text-transform:uppercase}.h{font-weight:600;margin:4px 0 10px}.opt{border:1px solid #333;border-radius:8px;padding:9px;font-size:12px;margin-bottom:6px}.opt.sel{border-color:#22D3EE;background:#22D3EE11;display:flex;justify-content:space-between}</style><div class="card"><div class="q">Question 3 of 8</div><div class="h">Favorite language?</div><div class="opt sel">TypeScript <span style="color:#22D3EE">✓</span></div><div class="opt">Python</div></div>`
    ),
  },
  {
    title: "Likert Scale Rating Row",
    category: "Forms",
    previewHtml: wrap(
      `<style>.w{text-align:center;color:#94A3B8}.row{display:flex;gap:14px;align-items:center;justify-content:center;margin-bottom:6px}.c{width:20px;height:20px;border-radius:50%;border:2px solid #475569}.c.on{border-color:#22D3EE;background:#22D3EE}.lbls{display:flex;justify-content:space-between;font-size:10px;width:200px}</style><div class="w"><div class="row"><span class="c"></span><span class="c"></span><span class="c on"></span><span class="c"></span><span class="c"></span></div><div class="lbls"><span>Disagree</span><span>Agree</span></div></div>`
    ),
  },
  {
    title: "Slider-Based Satisfaction Rating",
    category: "Forms",
    previewHtml: wrap(
      `<style>.w{width:230px}.track{height:10px;border-radius:5px;background:linear-gradient(90deg,#ef4444,#F59E0B,#22c55e);position:relative}.knob{position:absolute;top:50%;left:70%;transform:translate(-50%,-50%);width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.4)}.faces{display:flex;justify-content:space-between;font-size:20px;margin-top:8px}</style><div class="w"><div class="track"><div class="knob"></div></div><div class="faces"><span>😟</span><span>🙂</span></div></div>`
    ),
  },
  {
    title: "Inline Newsletter Signup Bar",
    category: "Forms",
    previewHtml: wrap(
      `<style>.bar{display:flex;background:#141a24;border:1px solid #22D3EE33;border-radius:10px;overflow:hidden;width:270px}input{flex:1;border:none;background:transparent;color:#fff;padding:11px;outline:none}.btn{background:linear-gradient(90deg,#22D3EE,#8B5CF6);border:none;color:#fff;padding:0 16px;font-weight:600}</style><div class="bar"><input value="agent@codingspy.io"><button class="btn">Subscribe</button></div>`
    ),
  },
  {
    title: "Video-Style Looping Gradient Hero",
    category: "Hero Section",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:${B};overflow:hidden;font-family:sans-serif}.blob{position:absolute;width:300px;height:300px;background:linear-gradient(135deg,#22D3EE,#8B5CF6);filter:blur(50px);opacity:.5;animation:m 6s ease-in-out infinite}@keyframes m{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;transform:translate(-20px,10px)}50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%;transform:translate(20px,-10px)}}h1{position:relative;color:#fff;font-size:26px;text-align:center}</style><h1>Decode. Learn.<br>Master.</h1>`,
  },
  {
    title: "Gradient Wave Section Divider",
    category: "Landing Page",
    previewHtml: `<style>body{margin:0;height:100vh;background:#141a24;display:flex;flex-direction:column;font-family:sans-serif}.top{flex:1;background:#8B5CF6}.wave{display:block;margin-top:-1px}</style><div class="top"></div><svg class="wave" viewBox="0 0 500 60" preserveAspectRatio="none" width="100%" height="60"><path d="M0 30 C150 70 350 -10 500 30 L500 60 L0 60 Z" fill="#141a24"/></svg>`,
  },
  {
    title: "Page Transition Wipe Loader",
    category: "Loaders",
    previewHtml: `<style>body{margin:0;height:100vh;background:${B};overflow:hidden}.wipe{position:fixed;inset:0;background:linear-gradient(90deg,#22D3EE,#8B5CF6);animation:wipe 2.2s ease-in-out infinite}@keyframes wipe{0%{transform:translateX(-100%)}45%{transform:translateX(0)}55%{transform:translateX(0)}100%{transform:translateX(100%)}}</style><div class="wipe"></div>`,
  },
  {
    title: "Infinite Scroll Loading Trigger",
    category: "Loaders",
    previewHtml: wrap(
      `<style>.w{display:flex;flex-direction:column;gap:8px;align-items:center}.card{width:200px;height:26px;border-radius:8px;background:#1e293b}.sp{width:24px;height:24px;border:3px solid #334155;border-top-color:#22D3EE;border-radius:50%;animation:s .8s linear infinite;margin-top:4px}@keyframes s{to{transform:rotate(360deg)}}</style><div class="w"><div class="card"></div><div class="card"></div><div class="sp"></div></div>`
    ),
  },
  {
    title: "Newsletter Signup Popup",
    category: "Modals",
    previewHtml: `<style>body{margin:0;height:100vh;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;font-family:sans-serif}.m{background:#141a24;padding:22px;border-radius:14px;width:210px;text-align:center;color:#fff;animation:pop .4s ease}@keyframes pop{from{transform:scale(.9);opacity:0}}input{width:100%;box-sizing:border-box;margin:10px 0;background:#0d1117;border:1px solid #333;border-radius:8px;padding:9px;color:#fff}.btn{width:100%;background:linear-gradient(90deg,#22D3EE,#8B5CF6);border:none;color:#fff;padding:9px;border-radius:8px;font-weight:600}.no{display:block;margin-top:8px;font-size:11px;color:#64748b}</style><div class="m"><b>Join the Agency</b><input value="you@email.com"><button class="btn">Subscribe</button><span class="no">No thanks</span></div>`,
  },
  {
    title: "Bug Report Modal Form",
    category: "Modals",
    previewHtml: `<style>body{margin:0;height:100vh;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;font-family:sans-serif}.m{background:#141a24;padding:18px;border-radius:14px;width:230px;color:#fff}.h{font-weight:700;margin-bottom:10px}input,select{width:100%;box-sizing:border-box;margin-bottom:8px;background:#0d1117;border:1px solid #333;border-radius:8px;padding:8px;color:#fff}.drop{border:1px dashed #475569;border-radius:8px;padding:12px;text-align:center;font-size:11px;color:#64748b}.btn{margin-top:10px;width:100%;background:linear-gradient(90deg,#22D3EE,#8B5CF6);border:none;color:#fff;padding:9px;border-radius:8px;font-weight:600}</style><div class="m"><div class="h">Report a Bug</div><input placeholder="Title" value="Preview not loading"><select><option>Severity: High</option></select><div class="drop">Drop screenshot here</div><button class="btn">Submit</button></div>`,
  },
  {
    title: "Expanding Icon Sidebar",
    category: "Navigation",
    previewHtml: wrap(
      `<style>.side{background:#141a24;border-radius:12px;padding:10px;color:#fff;overflow:hidden;white-space:nowrap;animation:exp 3s ease-in-out infinite}@keyframes exp{0%,40%{width:44px}60%,100%{width:130px}}.it{display:flex;align-items:center;gap:12px;padding:8px 6px;font-size:13px}.it i{width:20px;text-align:center}</style><div class="side"><div class="it"><i>◇</i>Home</div><div class="it"><i>◷</i>History</div><div class="it"><i>⚙</i>Settings</div></div>`
    ),
  },
  {
    title: "Animated Breadcrumb Trail",
    category: "Navigation",
    previewHtml: wrap(
      `<style>.bc{display:flex;align-items:center;gap:6px;color:#94A3B8;font-size:13px}.bc span{animation:in .6s ease backwards}.bc span:nth-child(3){animation-delay:.2s}.bc span:nth-child(5){animation-delay:.4s;color:#22D3EE}@keyframes in{from{opacity:0;transform:translateX(8px)}}.sep{color:#475569}</style><div class="bc"><span>Home</span><span class="sep">›</span><span>Docs</span><span class="sep">›</span><span>Navbar</span></div>`
    ),
  },
  {
    title: "Sticky Bottom CTA Bar",
    category: "Navigation",
    previewHtml: `<style>body{margin:0;height:100vh;background:${B};display:flex;align-items:flex-end;font-family:sans-serif}.bar{width:100%;box-sizing:border-box;background:linear-gradient(90deg,#22D3EE,#8B5CF6);padding:12px 18px;display:flex;align-items:center;justify-content:space-between;color:#fff;animation:up .5s ease}@keyframes up{from{transform:translateY(100%)}}.btn{background:#fff;color:#111;border:none;padding:7px 14px;border-radius:8px;font-weight:700}.x{cursor:pointer;opacity:.8}</style><div class="bar"><b>Start free trial</b><span><button class="btn">Get Started</button> <span class="x">×</span></span></div>`,
  },
  {
    title: "Sticky Table of Contents Sidebar",
    category: "Navigation",
    previewHtml: wrap(
      `<style>.toc{border-left:2px solid #1e293b;padding-left:14px}.toc a{display:block;font-size:12px;color:#64748b;padding:5px 0;text-decoration:none;position:relative}.toc a.on{color:#22D3EE}.toc a.on::before{content:'';position:absolute;left:-15px;top:0;bottom:0;width:2px;background:#22D3EE}</style><div class="toc"><a>Introduction</a><a class="on">Getting Started</a><a>Configuration</a><a>API Reference</a></div>`
    ),
  },
  {
    title: "Currency Switcher Dropdown",
    category: "Navigation",
    previewHtml: wrap(
      `<style>.w{width:150px}.btn{background:#141a24;border:1px solid #333;border-radius:8px 8px 0 0;color:#fff;padding:9px 12px;font-size:13px}.list{background:#141a24;border:1px solid #333;border-top:none;border-radius:0 0 8px 8px}.it{padding:8px 12px;font-size:12px;color:#94A3B8}.it.on{color:#fff;background:#1e293b}</style><div class="w"><div class="btn">🇺🇸 USD ▾</div><div class="list"><div class="it on">🇺🇸 USD</div><div class="it">🇮🇳 INR</div><div class="it">🇪🇺 EUR</div></div></div>`
    ),
  },
  {
    title: "Vertical Tab Sidebar",
    category: "Navigation",
    previewHtml: wrap(
      `<style>.tabs{background:#141a24;border-radius:10px;padding:6px;width:140px}.t{padding:10px 12px;font-size:13px;color:#94A3B8;border-left:3px solid transparent;border-radius:0 6px 6px 0}.t.on{color:#fff;background:#1e293b;border-left-color:#22D3EE}</style><div class="tabs"><div class="t">Profile</div><div class="t on">Security</div><div class="t">Billing</div></div>`
    ),
  },
  {
    title: "Full-Width Mega Menu Dropdown",
    category: "Navigation",
    previewHtml: wrap(
      `<style>.m{background:#141a24;border:1px solid #22D3EE22;border-radius:12px;padding:16px;display:flex;gap:20px;color:#fff;width:300px}.col b{font-size:10px;color:#22D3EE;text-transform:uppercase}.col a{display:block;font-size:12px;color:#94A3B8;padding:4px 0}.promo{margin-left:auto;width:80px;border-radius:8px;background:linear-gradient(135deg,#22D3EE,#8B5CF6)}</style><div class="m"><div class="col"><b>Learn</b><a>HTML</a><a>CSS</a><a>JS</a></div><div class="col"><b>Build</b><a>React</a><a>Next</a></div><div class="promo"></div></div>`
    ),
  },
  {
    title: "Language Switcher Flag Dropdown",
    category: "Navigation",
    previewHtml: wrap(
      `<style>.w{width:130px}.btn{background:#141a24;border:1px solid #333;border-radius:8px 8px 0 0;color:#fff;padding:9px 12px;font-size:13px}.list{background:#141a24;border:1px solid #333;border-top:none;border-radius:0 0 8px 8px}.it{padding:8px 12px;font-size:12px;color:#94A3B8}.it.on{color:#fff}</style><div class="w"><div class="btn">🇬🇧 EN ▾</div><div class="list"><div class="it on">🇬🇧 English</div><div class="it">🇮🇳 हिंदी</div><div class="it">🇪🇸 Español</div></div></div>`
    ),
  },
  {
    title: "Command Palette (Cmd+K)",
    category: "Navigation",
    previewHtml: `<style>body{margin:0;height:100vh;background:rgba(0,0,0,.5);display:flex;align-items:flex-start;justify-content:center;padding-top:40px;font-family:sans-serif}.p{width:260px;background:#141a24;border:1px solid #22D3EE33;border-radius:12px;overflow:hidden;animation:pop .3s ease}@keyframes pop{from{transform:translateY(-10px);opacity:0}}.s{padding:12px;border-bottom:1px solid #1e293b;color:#fff;font-size:13px}.it{padding:10px 12px;font-size:12px;color:#94A3B8;display:flex;gap:8px}.it.on{background:#22D3EE11;color:#fff}</style><div class="p"><div class="s">⌘ Search actions…</div><div class="it on">→ Go to Dashboard</div><div class="it">＋ New Case File</div><div class="it">⚙ Settings</div></div>`,
  },
  {
    title: "Sticky Filter/Sort Bar",
    category: "Navigation",
    previewHtml: wrap(
      `<style>.bar{display:flex;gap:8px;align-items:center;background:#141a24;border:1px solid #1e293b;border-radius:10px;padding:8px 12px}.btn{position:relative;background:#1e293b;color:#fff;font-size:12px;padding:6px 12px;border-radius:8px}.badge{position:absolute;top:-6px;right:-6px;background:#22D3EE;color:#031;font-size:9px;font-weight:700;border-radius:8px;padding:1px 5px}.sort{margin-left:auto;color:#94A3B8;font-size:12px}</style><div class="bar"><span class="btn">Filters<span class="badge">2</span></span><span class="sort">Sort: Newest ▾</span></div>`
    ),
  },
  {
    title: "Achievement Unlock Toast",
    category: "Notifications",
    previewHtml: wrap(
      `<style>.t{display:flex;align-items:center;gap:10px;background:#141a24;border:1px solid #F59E0B;border-radius:12px;padding:12px 16px;color:#fff;box-shadow:0 0 20px #F59E0B44;animation:in .5s ease}@keyframes in{from{transform:translateY(-20px);opacity:0}}.tr{font-size:24px}.s{font-size:10px;color:#F59E0B;text-transform:uppercase}</style><div class="t"><span class="tr">🏆</span><div><div class="s">Achievement Unlocked</div><b>First Case Solved</b></div></div>`
    ),
  },
  {
    title: "Multi-Step Signup Wizard",
    category: "Onboarding",
    previewHtml: wrap(
      `<style>.f{background:#141a24;padding:16px;border-radius:12px;width:230px;color:#fff}.bar{height:5px;background:#1e293b;border-radius:3px;overflow:hidden;margin-bottom:12px}.bar i{display:block;height:100%;width:66%;background:linear-gradient(90deg,#22D3EE,#8B5CF6)}.step{font-size:10px;color:#22D3EE}input{width:100%;box-sizing:border-box;margin:8px 0;background:#0d1117;border:1px solid #333;border-radius:8px;padding:8px;color:#fff}.nav{display:flex;justify-content:space-between}.nav button{border:none;padding:7px 14px;border-radius:8px;font-weight:600}.back{background:#1e293b;color:#94A3B8}.next{background:linear-gradient(90deg,#22D3EE,#8B5CF6);color:#fff}</style><div class="f"><div class="bar"><i></i></div><div class="step">STEP 2 OF 3 · Profile</div><input value="Agent Zero"><div class="nav"><button class="back">Back</button><button class="next">Next</button></div></div>`
    ),
  },
  {
    title: "Product Tour Tooltip Walkthrough",
    category: "Onboarding",
    previewHtml: `<style>body{margin:0;height:100vh;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;font-family:sans-serif}.spot{width:44px;height:44px;border-radius:10px;background:#22D3EE;box-shadow:0 0 0 4px #22D3EE55,0 0 0 9999px rgba(0,0,0,.6);position:relative}.tip{position:absolute;top:56px;left:-70px;width:170px;background:#141a24;border-radius:10px;padding:12px;color:#fff}.tip b{font-size:13px}.tip p{font-size:11px;color:#94A3B8;margin:4px 0 8px}.tip .r{display:flex;justify-content:space-between;font-size:11px}.skip{color:#64748b}.next{color:#22D3EE;font-weight:700}</style><div class="spot"><div class="tip"><b>Your Dashboard</b><p>Track all your case files here.</p><div class="r"><span class="skip">Skip</span><span class="next">Next →</span></div></div></div>`,
  },
  {
    title: "Welcome Confetti Screen",
    category: "Onboarding",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:${B};font-family:sans-serif;color:#fff;overflow:hidden}.c{position:absolute;top:-10px;width:8px;height:12px;animation:fall 2.5s linear infinite}@keyframes fall{to{transform:translateY(105vh) rotate(360deg)}}h2{margin:0}.btn{margin-top:14px;background:linear-gradient(90deg,#22D3EE,#8B5CF6);border:none;color:#fff;padding:10px 22px;border-radius:10px;font-weight:700}</style><div class="c" style="left:15%;background:#22D3EE"></div><div class="c" style="left:35%;background:#8B5CF6;animation-delay:.4s"></div><div class="c" style="left:60%;background:#F59E0B;animation-delay:.8s"></div><div class="c" style="left:80%;background:#ec4899;animation-delay:.2s"></div><h2>Welcome aboard! 🎉</h2><button class="btn">Start Exploring</button>`,
  },
  {
    title: "Progress Dots Carousel",
    category: "Onboarding",
    previewHtml: wrap(
      `<style>.card{width:220px;background:#141a24;border-radius:14px;padding:20px;text-align:center;color:#fff;position:relative}.ill{height:70px;border-radius:10px;background:linear-gradient(135deg,#22D3EE,#8B5CF6);margin-bottom:12px}.dots{display:flex;gap:6px;justify-content:center;margin-top:10px}.dots i{width:7px;height:7px;border-radius:50%;background:#334155}.dots i.on{background:#22D3EE;width:18px;border-radius:4px}.skip{position:absolute;top:10px;right:12px;font-size:11px;color:#64748b}</style><div class="card"><span class="skip">Skip</span><div class="ill"></div><b>Learn by doing</b><div class="dots"><i class="on"></i><i></i><i></i></div></div>`
    ),
  },
  {
    title: "Permission Request Card",
    category: "Onboarding",
    previewHtml: wrap(
      `<style>.card{width:210px;background:#141a24;border-radius:14px;padding:18px;text-align:center;color:#fff}.ic{width:48px;height:48px;border-radius:50%;background:#22D3EE22;display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 10px}p{font-size:12px;color:#94A3B8}.r{display:flex;gap:8px;margin-top:10px}.r button{flex:1;border:none;padding:8px;border-radius:8px;font-weight:600}.no{background:#1e293b;color:#94A3B8}.yes{background:linear-gradient(90deg,#22D3EE,#8B5CF6);color:#fff}</style><div class="card"><div class="ic">🔔</div><b>Stay in the loop</b><p>Get notified about new case files.</p><div class="r"><button class="no">Not Now</button><button class="yes">Allow</button></div></div>`
    ),
  },
  {
    title: "Scroll Parallax Card Stack",
    category: "Parallax Card Animation",
    previewHtml: wrap(
      `<style>.stack{position:relative;width:170px;height:130px}.c{position:absolute;left:0;width:170px;border-radius:12px;color:#fff;font-weight:700;padding:14px;box-sizing:border-box}.c1{top:0;height:100px;background:linear-gradient(135deg,#22D3EE,#0ea5e9);animation:s1 3s ease-in-out infinite}.c2{top:20px;height:100px;background:linear-gradient(135deg,#8B5CF6,#6366f1);animation:s2 3s ease-in-out infinite}@keyframes s1{50%{transform:scale(.92) translateY(-6px)}}@keyframes s2{50%{transform:translateY(-14px)}}</style><div class="stack"><div class="c c1">Card 1</div><div class="c c2">Card 2</div></div>`
    ),
  },
  {
    title: "Image Reveal on Scroll",
    category: "Portfolio",
    previewHtml: wrap(
      `<style>.img{width:180px;height:120px;border-radius:12px;background:linear-gradient(135deg,#22D3EE,#8B5CF6);position:relative;overflow:hidden}.img::after{content:'';position:absolute;inset:0;background:${B};animation:rev 2.5s ease-in-out infinite}@keyframes rev{0%,20%{transform:translateX(0)}60%,100%{transform:translateX(100%)}}</style><div class="img"></div>`
    ),
  },
  {
    title: "Sprint Progress Bar",
    category: "Progress",
    previewHtml: wrap(
      `<style>.w{width:240px}.bar{display:flex;height:14px;border-radius:7px;overflow:hidden}.bar i{display:block;height:100%}.leg{display:flex;gap:14px;margin-top:8px;font-size:11px;color:#94A3B8}.leg b{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:4px}</style><div class="w"><div class="bar"><i style="width:55%;background:#22c55e"></i><i style="width:25%;background:#F59E0B"></i><i style="width:20%;background:#334155"></i></div><div class="leg"><span><b style="background:#22c55e"></b>Done</span><span><b style="background:#F59E0B"></b>In progress</span><span><b style="background:#334155"></b>To do</span></div></div>`
    ),
  },
  {
    title: "XP Bar with Level-Up Flash",
    category: "Progress",
    previewHtml: wrap(
      `<style>.w{width:230px;text-align:center}.badge{display:inline-block;background:#F59E0B;color:#111;font-size:10px;font-weight:800;padding:3px 10px;border-radius:10px;margin-bottom:8px;animation:pop 2.5s ease-in-out infinite}@keyframes pop{0%,60%{opacity:0;transform:scale(.6)}70%{opacity:1;transform:scale(1.1)}80%{transform:scale(1)}100%{opacity:0}}.bar{height:12px;border-radius:6px;background:#1e293b;overflow:hidden}.bar i{display:block;height:100%;background:linear-gradient(90deg,#22D3EE,#8B5CF6);animation:fill 2.5s ease-in-out infinite}@keyframes fill{0%{width:10%}55%{width:100%}56%{width:0}100%{width:40%}}</style><div class="w"><span class="badge">LEVEL UP!</span><div class="bar"><i></i></div></div>`
    ),
  },
  {
    title: "Course Progress Ring",
    category: "Progress",
    previewHtml: wrap(
      `<div style="text-align:center;color:#fff"><svg width="120" height="120" viewBox="0 0 42 42"><circle cx="21" cy="21" r="15.9" fill="none" stroke="#1e293b" stroke-width="4"/><circle cx="21" cy="21" r="15.9" fill="none" stroke="#22D3EE" stroke-width="4" stroke-linecap="round" stroke-dasharray="72 28" stroke-dashoffset="25" transform="rotate(-90 21 21)"/><text x="21" y="20" text-anchor="middle" fill="#fff" font-size="7" font-weight="700">72%</text><text x="21" y="27" text-anchor="middle" fill="#94A3B8" font-size="3.5">HTML</text></svg><div><button style="background:#22D3EE;border:none;color:#031;padding:6px 14px;border-radius:8px;font-weight:600;font-size:12px">Continue</button></div></div>`
    ),
  },
  {
    title: "Workout Ring Trio (Activity Rings)",
    category: "Progress",
    previewHtml: wrap(
      `<svg width="130" height="130" viewBox="0 0 42 42"><g fill="none" stroke-width="3.4" stroke-linecap="round" transform="rotate(-90 21 21)"><circle cx="21" cy="21" r="16" stroke="#7f1d1d"/><circle cx="21" cy="21" r="16" stroke="#ef4444" stroke-dasharray="80 20.5" style="animation:r1 2s ease"/><circle cx="21" cy="21" r="12" stroke="#14532d"/><circle cx="21" cy="21" r="12" stroke="#22c55e" stroke-dasharray="55 20.4"/><circle cx="21" cy="21" r="8" stroke="#0e7490"/><circle cx="21" cy="21" r="8" stroke="#22D3EE" stroke-dasharray="40 10.3"/></g></svg>`
    ),
  },
  {
    title: "Animated Counter Component",
    category: "React",
    previewHtml: wrap(
      `<style>.n{font-size:44px;font-weight:800;color:#22D3EE;font-variant-numeric:tabular-nums}</style><div class="n" id="n">0</div><script>let v=0;const el=document.getElementById('n');const t=setInterval(()=>{v+=48;if(v>=2450){v=2450;clearInterval(t)}el.textContent=v.toLocaleString()},30);<\/script>`
    ),
  },
  {
    title: "Dark Mode Toggle Hook",
    category: "React",
    previewHtml: wrap(
      `<style>.sw{width:60px;height:30px;border-radius:15px;background:#334155;position:relative;cursor:pointer;transition:.3s}.sw.d{background:#1e293b}.k{position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:50%;background:#F59E0B;display:flex;align-items:center;justify-content:center;font-size:13px;transition:.3s}.sw.d .k{left:33px;background:#0f172a}</style><div class="sw d" onclick="this.classList.toggle('d');this.querySelector('.k').textContent=this.classList.contains('d')?'🌙':'☀'"><div class="k">🌙</div></div>`
    ),
  },
  {
    title: "Auto-Rotating Testimonial Card",
    category: "Testimonials",
    previewHtml: wrap(
      `<style>.card{width:230px;background:#141a24;border-radius:14px;padding:18px;text-align:center;color:#fff}.q{font-size:13px;min-height:52px}.q span{display:none}.q span.on{display:block;animation:fade .6s ease}@keyframes fade{from{opacity:0}}.av{display:flex;gap:6px;justify-content:center;margin-top:10px}.av i{width:10px;height:10px;border-radius:50%;background:#334155}.av i.on{background:#22D3EE}</style><div class="card"><div class="q"><span class="on">"Best way to learn to code!"</span></div><div style="font-size:11px;color:#94A3B8">— Agent Vega</div><div class="av"><i class="on"></i><i></i><i></i></div></div>`
    ),
  },
  {
    title: "Notification Bell Dropdown",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.w{position:relative}.bell{font-size:22px;position:relative}.b{position:absolute;top:-4px;right:-6px;background:#ef4444;color:#fff;font-size:9px;font-weight:700;border-radius:8px;padding:1px 5px}.dd{position:absolute;top:32px;right:0;width:190px;background:#141a24;border:1px solid #22D3EE22;border-radius:10px;padding:8px;color:#fff}.it{font-size:12px;padding:7px 6px;border-bottom:1px solid #1e293b}</style><div class="w"><div class="bell">🔔<span class="b">3</span></div><div class="dd"><div class="it">New comment on your post</div><div class="it">Case file approved</div></div></div>`
    ),
  },
  {
    title: "Drag-to-Reorder List",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.list{width:210px;display:flex;flex-direction:column;gap:6px}.it{background:#141a24;border:1px solid #1e293b;border-radius:8px;padding:10px;color:#fff;font-size:13px;display:flex;align-items:center;gap:8px}.it .g{color:#475569;cursor:grab}.gap{height:36px;border:2px dashed #22D3EE55;border-radius:8px;background:#22D3EE0d}</style><div class="list"><div class="it"><span class="g">⠿</span>First item</div><div class="gap"></div><div class="it"><span class="g">⠿</span>Third item</div></div>`
    ),
  },
  {
    title: "Feature Comparison Table",
    category: "UI Components",
    previewHtml: wrap(
      `<style>table{border-collapse:collapse;color:#fff;font-size:12px}th,td{padding:8px 14px;text-align:center;border-bottom:1px solid #1e293b}td:first-child{text-align:left;color:#94A3B8}.pop{border:1px solid #22D3EE;border-bottom:none;border-radius:8px 8px 0 0;position:relative}.badge{position:absolute;top:-9px;left:50%;transform:translateX(-50%);background:#22D3EE;color:#031;font-size:8px;font-weight:700;padding:1px 6px;border-radius:6px}</style><table><tr><th></th><th>Free</th><th class="pop"><span class="badge">POPULAR</span>Pro</th></tr><tr><td>Playground</td><td>✓</td><td class="pop">✓</td></tr><tr><td>Certificates</td><td>✕</td><td class="pop">✓</td></tr></table>`
    ),
  },
  {
    title: "Podcast Episode Card",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.row{display:flex;align-items:center;gap:12px;width:250px;background:#141a24;padding:12px;border-radius:12px;color:#fff}.cover{width:50px;height:50px;border-radius:8px;background:linear-gradient(135deg,#8B5CF6,#22D3EE);position:relative}.play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.35);border-radius:8px}.t{font-size:13px;font-weight:600}.s{font-size:11px;color:#94A3B8}</style><div class="row"><div class="cover"><span class="play">▶</span></div><div><div class="t">Ep 12 · Async JS</div><div class="s">The Dev Files · 42 min</div></div></div>`
    ),
  },
  {
    title: "Sticky Mini Player Bar",
    category: "UI Components",
    previewHtml: `<style>body{margin:0;height:100vh;background:${B};display:flex;align-items:flex-end;font-family:sans-serif}.bar{width:100%;box-sizing:border-box;background:#141a24;border-top:1px solid #1e293b;padding:10px 14px;display:flex;align-items:center;gap:12px;color:#fff}.cov{width:36px;height:36px;border-radius:6px;background:linear-gradient(135deg,#22D3EE,#8B5CF6)}.t{flex:1}.t .n{font-size:12px}.prog{height:3px;background:#334155;border-radius:2px;margin-top:4px}.prog i{display:block;width:45%;height:100%;background:#22D3EE;border-radius:2px}.ctrl{font-size:16px}</style><div class="bar"><div class="cov"></div><div class="t"><div class="n">Async JS</div><div class="prog"><i></i></div></div><span class="ctrl">⏮ ⏸ ⏭</span></div>`,
  },
  {
    title: "Volume Slider with Icon Morph",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.w{display:flex;align-items:center;gap:10px;color:#fff}.track{width:130px;height:6px;border-radius:3px;background:#334155;position:relative}.track i{display:block;width:70%;height:100%;background:#22D3EE;border-radius:3px}.knob{position:absolute;top:50%;left:70%;transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:#fff}</style><div class="w"><span>🔊</span><div class="track"><i></i><div class="knob"></div></div></div>`
    ),
  },
  {
    title: "Mini Calendar Date Picker",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.cal{background:#141a24;padding:12px;border-radius:10px;color:#fff}.hd{display:flex;justify-content:space-between;font-size:12px;margin-bottom:8px}.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}.d{width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:10px;border-radius:50%;color:#94A3B8}.d.today{border:1px solid #22D3EE;color:#fff}.d.sel{background:linear-gradient(135deg,#22D3EE,#8B5CF6);color:#fff}</style><div class="cal"><div class="hd"><span>‹</span><b>July 2026</b><span>›</span></div><div class="grid"><span class="d">12</span><span class="d today">13</span><span class="d">14</span><span class="d sel">15</span><span class="d">16</span><span class="d">17</span><span class="d">18</span></div></div>`
    ),
  },
  {
    title: "Event Timeline Card",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.tl{position:relative;width:200px;height:150px;border-left:1px solid #1e293b;padding-left:8px}.hr{position:absolute;left:-24px;font-size:9px;color:#64748b}.ev{position:absolute;left:8px;right:0;border-radius:6px;padding:4px 8px;font-size:10px;color:#fff}</style><div class="tl"><span class="hr" style="top:0">9AM</span><span class="hr" style="top:50px">10AM</span><span class="hr" style="top:100px">11AM</span><div class="ev" style="top:4px;height:38px;background:#22D3EE99">Standup</div><div class="ev" style="top:58px;height:70px;background:#8B5CF699">Design Review</div></div>`
    ),
  },
  {
    title: "Booking Time Slot Grid",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:220px}.s{padding:9px;border-radius:8px;background:#1e293b;color:#fff;font-size:12px;text-align:center}.s.off{opacity:.35;text-decoration:line-through}.s.on{background:linear-gradient(135deg,#22D3EE,#8B5CF6)}</style><div class="grid"><div class="s">9:00</div><div class="s off">9:30</div><div class="s on">10:00</div><div class="s">10:30</div><div class="s off">11:00</div><div class="s">11:30</div></div>`
    ),
  },
  {
    title: "Availability Heatmap",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.grid{display:grid;grid-template-rows:repeat(7,1fr);grid-auto-flow:column;grid-auto-columns:11px;gap:3px}.c{width:11px;height:11px;border-radius:2px}</style><div class="grid" id="g"></div><script>const g=document.getElementById('g');const cols=['#161b22','#0e4429','#006d32','#26a641','#39d353'];for(let i=0;i<70;i++){const d=document.createElement('div');d.className='c';d.style.background=cols[Math.floor(Math.random()*5)];g.appendChild(d)}<\/script>`
    ),
  },
  {
    title: "Kanban Board Columns",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.board{display:flex;gap:8px}.col{background:#141a24;border-radius:10px;padding:8px;width:80px}.h{font-size:9px;color:#94A3B8;display:flex;justify-content:space-between;margin-bottom:6px}.h b{background:#1e293b;border-radius:8px;padding:0 5px}.card{background:#1e293b;border-radius:6px;padding:6px;font-size:9px;color:#fff;margin-bottom:5px}</style><div class="board"><div class="col"><div class="h">To Do <b>2</b></div><div class="card">Design</div><div class="card">Wireframe</div></div><div class="col"><div class="h">Doing <b>1</b></div><div class="card">Build API</div></div><div class="col"><div class="h">Done <b>1</b></div><div class="card">Setup</div></div></div>`
    ),
  },
  {
    title: "Habit Streak Grid",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.w{text-align:center;color:#fff}.s{font-size:13px;margin-bottom:8px}.s b{color:#F59E0B}.row{display:flex;gap:6px}.d{width:26px;height:26px;border-radius:6px;background:#1e293b;display:flex;align-items:center;justify-content:center;font-size:12px}.d.on{background:linear-gradient(135deg,#22D3EE,#8B5CF6)}</style><div class="w"><div class="s">🔥 <b>4 day streak</b></div><div class="row"><div class="d on">✓</div><div class="d on">✓</div><div class="d on">✓</div><div class="d on">✓</div><div class="d"></div><div class="d"></div><div class="d"></div></div></div>`
    ),
  },
  {
    title: "Social Post Card with Reactions",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.card{width:240px;background:#141a24;border-radius:12px;padding:14px;color:#fff}.hd{display:flex;align-items:center;gap:8px}.av{width:32px;height:32px;border-radius:50%;background:#8B5CF6}.n{font-size:12px;font-weight:600}.tm{font-size:10px;color:#64748b}.txt{font-size:13px;margin:10px 0}.bar{display:flex;gap:16px;color:#94A3B8;font-size:12px;border-top:1px solid #1e293b;padding-top:8px}</style><div class="card"><div class="hd"><div class="av"></div><div><div class="n">Agent Zero</div><div class="tm">2h ago</div></div></div><div class="txt">Just cracked the async case! 🔓</div><div class="bar"><span>♥ 128</span><span>💬 12</span><span>↗ Share</span></div></div>`
    ),
  },
  {
    title: "Threaded Comment List",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.w{width:240px;color:#fff;font-size:12px}.c{padding:6px 0}.c .n{font-weight:600}.c .t{color:#94A3B8}.reply{margin-left:16px;border-left:2px solid #1e293b;padding-left:10px}.rl{color:#22D3EE;font-size:11px}</style><div class="w"><div class="c"><span class="n">Agent Zero</span> <span class="t">Great write-up!</span><div class="rl">Reply</div><div class="reply"><div class="c"><span class="n">Vega</span> <span class="t">Agreed 👍</span></div></div></div></div>`
    ),
  },
  {
    title: "Bottom Share Sheet",
    category: "UI Components",
    previewHtml: `<style>body{margin:0;height:100vh;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center;font-family:sans-serif}.sh{width:100%;box-sizing:border-box;background:#141a24;border-radius:16px 16px 0 0;padding:18px;color:#fff;animation:up .4s ease}@keyframes up{from{transform:translateY(100%)}}.grip{width:36px;height:4px;background:#334155;border-radius:2px;margin:0 auto 14px}.grid{display:flex;justify-content:space-around;text-align:center;font-size:10px;color:#94A3B8}.ic{width:44px;height:44px;border-radius:50%;background:#1e293b;display:flex;align-items:center;justify-content:center;font-size:20px;margin:0 auto 4px}</style><div class="sh"><div class="grip"></div><div class="grid"><div><div class="ic">🔗</div>Copy</div><div><div class="ic">🐦</div>Twitter</div><div><div class="ic">💬</div>WhatsApp</div><div><div class="ic">✉</div>Email</div></div></div>`,
  },
  {
    title: "Health/Mana Bar UI",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.w{width:200px}.bar{height:16px;border-radius:8px;background:#3f1414;overflow:hidden;position:relative;margin-bottom:8px}.hp{position:absolute;inset:0;width:62%;background:linear-gradient(90deg,#ef4444,#f87171);border-radius:8px;animation:dmg 2.5s ease-in-out infinite}.ghost{position:absolute;inset:0;width:75%;background:#fca5a5;border-radius:8px;z-index:-1}@keyframes dmg{40%{width:62%}45%{filter:brightness(2)}100%{width:62%}}.mp{height:10px;border-radius:5px;background:#0e2a4d;overflow:hidden}.mp i{display:block;width:80%;height:100%;background:linear-gradient(90deg,#22D3EE,#3b82f6)}</style><div class="w"><div class="bar"><div class="ghost"></div><div class="hp"></div></div><div class="mp"><i></i></div></div>`
    ),
  },
  {
    title: "Crypto Price Ticker",
    category: "UI Components",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;background:${B};overflow:hidden;font-family:sans-serif}.track{display:flex;gap:28px;white-space:nowrap;animation:sc 8s linear infinite;color:#fff;font-size:13px}@keyframes sc{to{transform:translateX(-50%)}}.up{color:#22c55e}.dn{color:#ef4444}</style><div class="track"><span>BTC $64,210 <span class="up">▲2.4%</span></span><span>ETH $3,120 <span class="dn">▼1.1%</span></span><span>SOL $148 <span class="up">▲5.2%</span></span><span>BTC $64,210 <span class="up">▲2.4%</span></span><span>ETH $3,120 <span class="dn">▼1.1%</span></span><span>SOL $148 <span class="up">▲5.2%</span></span></div>`,
  },
  {
    title: "Stock Chart Card",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.card{background:#141a24;border-radius:12px;padding:14px;color:#fff;width:180px}.top{display:flex;justify-content:space-between;align-items:baseline}.sym{font-weight:700}.chg{color:#22c55e;font-size:11px}.p{font-size:20px;font-weight:800;margin:2px 0 8px}path{stroke-dasharray:300;stroke-dashoffset:300;animation:draw 2s ease forwards}@keyframes draw{to{stroke-dashoffset:0}}</style><div class="card"><div class="top"><span class="sym">CSPY</span><span class="chg">▲ 4.2%</span></div><div class="p">$182.40</div><svg width="150" height="44"><path d="M2 38 L26 30 L50 34 L74 18 L98 22 L122 8 L148 12" fill="none" stroke="#22c55e" stroke-width="2"/></svg></div>`
    ),
  },
  {
    title: "Lesson Completion Checklist",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.w{position:relative;padding-left:6px}.it{display:flex;align-items:center;gap:10px;color:#fff;font-size:13px;padding:6px 0}.ck{width:18px;height:18px;border-radius:50%;border:2px solid #334155;display:flex;align-items:center;justify-content:center;font-size:10px}.done .ck{background:#22c55e;border-color:#22c55e}.done{color:#94A3B8}</style><div class="w"><div class="it done"><span class="ck">✓</span>Intro to HTML</div><div class="it done"><span class="ck">✓</span>Tags & Elements</div><div class="it"><span class="ck"></span>Forms</div></div>`
    ),
  },
  {
    title: "Quiz Answer Feedback Flash",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.w{width:220px;display:flex;flex-direction:column;gap:8px}.a{padding:10px 12px;border-radius:8px;font-size:13px;color:#fff;display:flex;justify-content:space-between}.correct{background:#14532d;border:1px solid #22c55e}.wrong{background:#450a0a;border:1px solid #ef4444}.n{background:#1e293b}</style><div class="w"><div class="a correct">let x = 5;<span>✓</span></div><div class="a wrong">var 5 = x;<span>✕</span></div><div class="a n">const = x5;</div></div>`
    ),
  },
  {
    title: "Certificate Preview Card",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.cert{width:230px;background:#0d1117;border:2px solid #F59E0B;border-radius:10px;padding:18px;text-align:center;color:#fff;position:relative}.seal{font-size:26px}.t{font-size:10px;color:#F59E0B;letter-spacing:2px;margin-top:6px}.name{font-size:17px;font-weight:800;margin:6px 0}.c{font-size:11px;color:#94A3B8}.btn{margin-top:12px;background:#F59E0B;color:#111;border:none;padding:7px 14px;border-radius:8px;font-weight:700;font-size:11px}</style><div class="cert"><div class="seal">🏅</div><div class="t">CERTIFICATE OF COMPLETION</div><div class="name">Agent Zero</div><div class="c">JavaScript Mastery</div><button class="btn">Download PDF</button></div>`
    ),
  },
  {
    title: "Flight Search Result Card",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.card{width:250px;background:#141a24;border-radius:12px;padding:14px;color:#fff;display:flex;align-items:center;justify-content:space-between}.route{text-align:center}.code{font-size:15px;font-weight:800}.line{color:#22D3EE;font-size:11px;margin:0 8px}.dur{font-size:10px;color:#64748b}.p{font-size:18px;font-weight:800;color:#22D3EE}</style><div class="card"><div class="route"><span class="code">DEL</span><span class="line">✈ ——</span><span class="code">LON</span><div class="dur">9h 05m · 1 stop</div></div><div class="p">$540</div></div>`
    ),
  },
  {
    title: "Destination Card with Overlay",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.card{width:180px;height:130px;border-radius:14px;background:linear-gradient(135deg,#0ea5e9,#8B5CF6);position:relative;overflow:hidden;color:#fff}.card::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.7),transparent 55%)}.city{position:absolute;bottom:10px;left:12px;font-weight:800;z-index:1}.price{position:absolute;top:10px;right:10px;background:rgba(0,0,0,.5);padding:3px 8px;border-radius:8px;font-size:11px;z-index:1}</style><div class="card"><span class="price">$899</span><span class="city">Santorini</span></div>`
    ),
  },
  {
    title: "Booking Confirmation Card",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.card{width:220px;background:#141a24;border-radius:14px;padding:18px;text-align:center;color:#fff}.ck{width:48px;height:48px;border-radius:50%;background:#22c55e;display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 10px;animation:pop .5s ease}@keyframes pop{from{transform:scale(0)}}.ref{font-family:monospace;background:#0d1117;padding:6px;border-radius:6px;font-size:12px;margin:8px 0}.d{font-size:11px;color:#94A3B8}</style><div class="card"><div class="ck">✓</div><b>Booking Confirmed</b><div class="ref">#CS-48210</div><div class="d">Jul 24 · 2 guests</div></div>`
    ),
  },
  {
    title: "Trip Itinerary Timeline",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.tl{border-left:2px dotted #334155;padding-left:14px;color:#fff}.day{font-size:10px;color:#22D3EE;text-transform:uppercase;margin:8px 0 4px}.ev{font-size:12px;position:relative;padding:3px 0}.ev::before{content:'';position:absolute;left:-19px;top:7px;width:8px;height:8px;border-radius:50%;background:#22D3EE}.t{color:#64748b;font-size:10px}</style><div class="tl"><div class="day">Day 1</div><div class="ev">✈ Arrive <span class="t">9:00</span></div><div class="ev">🏛 City tour <span class="t">14:00</span></div><div class="day">Day 2</div><div class="ev">⛰ Hike <span class="t">8:00</span></div></div>`
    ),
  },
  {
    title: "Restaurant Menu Item Card",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.row{display:flex;align-items:center;gap:12px;width:250px;background:#141a24;padding:12px;border-radius:12px;color:#fff}.ph{width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,#F59E0B,#ef4444)}.t{font-size:13px;font-weight:600}.d{font-size:10px;color:#94A3B8}.p{margin-left:auto;text-align:right}.add{width:26px;height:26px;border-radius:50%;background:#22c55e;color:#fff;border:none;font-size:14px}</style><div class="row"><div class="ph"></div><div><div class="t">Margherita Pizza</div><div class="d">Tomato, mozzarella</div></div><div class="p">$12<br><button class="add">✓</button></div></div>`
    ),
  },
  {
    title: "Order Status Tracker",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.w{display:flex;align-items:center;width:270px}.step{flex:1;text-align:center;position:relative}.c{width:22px;height:22px;border-radius:50%;background:#1e293b;color:#64748b;display:flex;align-items:center;justify-content:center;font-size:11px;margin:0 auto;position:relative;z-index:1}.step.done .c{background:#22c55e;color:#fff}.step.now .c{background:#22D3EE;color:#031}.line{position:absolute;top:11px;left:-50%;width:100%;height:2px;background:#1e293b}.step.done .line,.step.now .line{background:#22c55e}.lbl{font-size:8px;color:#94A3B8;margin-top:4px}</style><div class="w"><div class="step done"><div class="c">✓</div><div class="lbl">Placed</div></div><div class="step done"><div class="line"></div><div class="c">✓</div><div class="lbl">Preparing</div></div><div class="step now"><div class="line"></div><div class="c">🛵</div><div class="lbl">On way</div></div><div class="step"><div class="line"></div><div class="c"></div><div class="lbl">Delivered</div></div></div>`
    ),
  },
  {
    title: "Property Listing Card",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.card{width:200px;background:#141a24;border-radius:12px;overflow:hidden;color:#fff}.img{height:90px;background:linear-gradient(135deg,#22D3EE,#8B5CF6);position:relative}.price{position:absolute;bottom:8px;left:8px;background:rgba(0,0,0,.6);padding:3px 8px;border-radius:6px;font-size:12px;font-weight:700}.b{padding:10px}.addr{font-size:12px}.icons{display:flex;gap:12px;font-size:10px;color:#94A3B8;margin-top:6px}</style><div class="card"><div class="img"><span class="price">$420,000</span></div><div class="b"><div class="addr">221B Baker Street</div><div class="icons"><span>🛏 3</span><span>🛁 2</span><span>📐 1,800 sqft</span></div></div></div>`
    ),
  },
  {
    title: "Price Range Dual Slider",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.w{width:240px}.vals{display:flex;justify-content:space-between;color:#fff;font-size:12px;margin-bottom:8px}.track{height:6px;border-radius:3px;background:#334155;position:relative}.fill{position:absolute;left:25%;right:25%;top:0;bottom:0;background:#22D3EE;border-radius:3px}.knob{position:absolute;top:50%;transform:translate(-50%,-50%);width:16px;height:16px;border-radius:50%;background:#fff;border:2px solid #22D3EE}</style><div class="w"><div class="vals"><span>$200</span><span>$800</span></div><div class="track"><div class="fill"></div><div class="knob" style="left:25%"></div><div class="knob" style="left:75%"></div></div></div>`
    ),
  },
  {
    title: "Map Pin Popup Card",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.w{text-align:center}.pop{background:#141a24;border-radius:10px;padding:8px;width:150px;color:#fff;position:relative}.pop::after{content:'';position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);border:7px solid transparent;border-top-color:#141a24;border-bottom:0}.thumb{height:50px;border-radius:6px;background:linear-gradient(135deg,#22D3EE,#8B5CF6);margin-bottom:6px}.p{font-weight:700;font-size:13px}.a{font-size:10px;color:#94A3B8}.pin{color:#ef4444;font-size:22px;margin-top:10px}</style><div class="w"><div class="pop"><div class="thumb"></div><div class="p">$420K</div><div class="a">Baker Street</div></div><div class="pin">📍</div></div>`
    ),
  },
  {
    title: "Step Counter Widget",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.card{background:#141a24;border-radius:14px;padding:18px;text-align:center;color:#fff;width:160px}.ic{font-size:22px}.n{font-size:30px;font-weight:800;color:#22D3EE}.g{font-size:10px;color:#94A3B8}.bar{height:6px;border-radius:3px;background:#1e293b;margin-top:8px;overflow:hidden}.bar i{display:block;width:74%;height:100%;background:linear-gradient(90deg,#22D3EE,#8B5CF6)}</style><div class="card"><div class="ic">👟</div><div class="n" id="s">0</div><div class="g">of 10,000 goal</div><div class="bar"><i></i></div></div><script>let v=0;const e=document.getElementById('s');const t=setInterval(()=>{v+=150;if(v>=7420){v=7420;clearInterval(t)}e.textContent=v.toLocaleString()},25);<\/script>`
    ),
  },
  {
    title: "Water Intake Tracker",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.w{text-align:center;color:#fff}.glass{width:70px;height:100px;border:3px solid #22D3EE;border-radius:6px 6px 12px 12px;position:relative;overflow:hidden;margin:0 auto 10px}.fill{position:absolute;bottom:0;left:0;right:0;height:50%;background:linear-gradient(#22D3EE,#0ea5e9);transition:.4s}.f{font-size:13px}.btn{margin-top:8px;background:#22D3EE;border:none;color:#031;padding:6px 14px;border-radius:8px;font-weight:600}</style><div class="w"><div class="glass"><div class="fill" id="fl"></div></div><div class="f"><span id="c">4</span>/8 cups</div><button class="btn" onclick="var c=document.getElementById('c');var n=Math.min(8,+c.textContent+1);c.textContent=n;document.getElementById('fl').style.height=(n/8*100)+'%'">+1 cup</button></div>`
    ),
  },
  {
    title: "Git Commit Graph",
    category: "UI Components",
    previewHtml: wrap(
      `<svg width="200" height="120"><line x1="20" y1="10" x2="20" y2="110" stroke="#22D3EE" stroke-width="2"/><path d="M20 40 C20 60 60 60 60 80" fill="none" stroke="#8B5CF6" stroke-width="2"/><path d="M60 80 C60 100 20 100 20 100" fill="none" stroke="#8B5CF6" stroke-width="2"/><circle cx="20" cy="15" r="5" fill="#22D3EE"/><circle cx="20" cy="40" r="5" fill="#22D3EE"/><circle cx="60" cy="80" r="5" fill="#8B5CF6"/><circle cx="20" cy="100" r="5" fill="#22D3EE"/><text x="35" y="19" fill="#94A3B8" font-size="9" font-family="monospace">init</text><text x="35" y="44" fill="#94A3B8" font-size="9" font-family="monospace">feat: nav</text><text x="75" y="84" fill="#94A3B8" font-size="9" font-family="monospace">fix: css</text><text x="35" y="104" fill="#94A3B8" font-size="9" font-family="monospace">merge</text></svg>`
    ),
  },
  {
    title: "Side-by-Side Diff Viewer",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.w{display:flex;font-family:monospace;font-size:11px;border-radius:8px;overflow:hidden}.col{width:130px}.ln{padding:2px 8px;color:#e5e7eb}.rm{background:#450a0a}.add{background:#052e16}.gut{color:#475569;margin-right:8px}</style><div class="w"><div class="col"><div class="ln rm"><span class="gut">3</span>let x=5</div><div class="ln"><span class="gut">4</span>return x</div></div><div class="col"><div class="ln add"><span class="gut">3</span>const x=5</div><div class="ln"><span class="gut">4</span>return x</div></div></div>`
    ),
  },
  {
    title: "JSON Response Tree Viewer",
    category: "UI Components",
    previewHtml: wrap(
      `<style>.j{font-family:monospace;font-size:12px;color:#e5e7eb;line-height:1.6}.k{color:#22D3EE}.s{color:#22c55e}.n{color:#F59E0B}.b{color:#8B5CF6}.ind{margin-left:16px}.ch{color:#64748b;cursor:pointer}</style><div class="j"><div><span class="ch">▾</span> {</div><div class="ind"><span class="k">"name"</span>: <span class="s">"Agent Zero"</span>,</div><div class="ind"><span class="k">"level"</span>: <span class="n">12</span>,</div><div class="ind"><span class="k">"active"</span>: <span class="b">true</span></div><div>}</div></div>`
    ),
  },
];

async function main() {
  let updated = 0;
  for (const p of PREVIEWS) {
    const existing = await prisma.prompt.findFirst({
      where: { title: p.title, category: p.category },
    });
    if (!existing) {
      console.warn(`NOT FOUND: ${p.category} / ${p.title}`);
      continue;
    }
    await prisma.prompt.update({
      where: { id: existing.id },
      data: { previewHtml: p.previewHtml },
    });
    updated++;
  }
  console.log(`Updated ${updated} prompts with live previews (add-previews batch 1).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
