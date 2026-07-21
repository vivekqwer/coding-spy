import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROMPTS: {
  category: string;
  title: string;
  promptText: string;
  previewHtml?: string;
}[] = [
  {
    category: "HTML",
    title: "Responsive Pricing Cards",
    promptText:
      "Create a responsive HTML/CSS pricing section with 3 cards (Basic, Pro, Enterprise), a highlighted 'most popular' card, hover lift effect, and a gradient CTA button on each card.",
    previewHtml: `<style>body{font-family:sans-serif;background:#0B0F17;color:#fff;display:flex;gap:16px;padding:24px;justify-content:center}.card{background:#141a24;border:1px solid #22D3EE33;border-radius:16px;padding:20px;width:160px;text-align:center;transition:transform .2s}.card:hover{transform:translateY(-8px)}.btn{margin-top:12px;padding:8px 16px;border-radius:8px;border:none;background:linear-gradient(90deg,#22D3EE,#8B5CF6);color:#fff;cursor:pointer}</style><div class="card"><h3>Basic</h3><p>$9/mo</p><button class="btn">Choose</button></div><div class="card"><h3>Pro</h3><p>$29/mo</p><button class="btn">Choose</button></div>`,
  },
  {
    category: "HTML",
    title: "Animated Navbar Underline",
    promptText:
      "Build an HTML/CSS navbar where each link gets an animated gradient underline that slides in from the left on hover.",
    previewHtml: `<style>body{background:#0B0F17;display:flex;justify-content:center;padding-top:40px}a{color:#fff;font-family:sans-serif;margin:0 16px;text-decoration:none;position:relative;padding-bottom:4px}a::after{content:'';position:absolute;left:0;bottom:0;width:0;height:2px;background:linear-gradient(90deg,#22D3EE,#8B5CF6);transition:width .3s}a:hover::after{width:100%}</style><a href="#">Home</a><a href="#">Case Files</a><a href="#">Certifications</a>`,
  },
  {
    category: "React",
    title: "Animated Counter Component",
    promptText:
      "Write a React component using useState and useEffect that animates a number counting up from 0 to a target value over 1.5 seconds when it scrolls into view.",
  },
  {
    category: "React",
    title: "Dark Mode Toggle Hook",
    promptText:
      "Create a custom React hook `useDarkMode()` that toggles a data-theme attribute on <html>, persists the choice to localStorage, and respects the user's system preference on first load.",
  },
  {
    category: "3D Scroll Animation",
    title: "Parallax Hero with Floating Cards",
    promptText:
      "Create a full-page hero section using CSS 3D transforms and JavaScript scroll listeners where background layers move at different speeds (parallax) and floating cards tilt in 3D as the user scrolls.",
    previewHtml: `<style>body{margin:0;height:200vh;background:linear-gradient(#0B0F17,#141a24);perspective:800px}.card{position:fixed;top:40%;left:40%;width:120px;height:80px;background:linear-gradient(135deg,#22D3EE,#8B5CF6);border-radius:12px;transform:rotateX(10deg) rotateY(10deg);box-shadow:0 20px 40px rgba(0,0,0,.4)}</style><div class="card"></div><script>window.addEventListener('scroll',()=>{const c=document.querySelector('.card');const y=window.scrollY;c.style.transform='rotateX('+(10+y/20)+'deg) rotateY('+(10+y/20)+'deg)'})</script>`,
  },
  {
    category: "3D Scroll Animation",
    title: "Scroll-Triggered 3D Card Flip",
    promptText:
      "Build a scroll-triggered animation where a row of cards flip in 3D (rotateY) one by one as they enter the viewport, using the Intersection Observer API.",
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
  console.log(`Seeded ${PROMPTS.length} example prompts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
