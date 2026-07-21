import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROMPTS: {
  category: string;
  title: string;
  promptText: string;
  previewHtml?: string;
}[] = [
  // ---------- Chat & Messaging ----------
  {
    category: "Chat & Messaging",
    title: "Chat Bubble List with Tails",
    promptText:
      "Build a messaging thread with left-aligned (received) and right-aligned (sent) chat bubbles, each with a small triangular tail, timestamps below each group, and different bubble colors for sent vs received.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;flex-direction:column;justify-content:center;gap:8px;background:#0B0F17;padding:0 24px;font-family:sans-serif}.b{max-width:70%;padding:8px 12px;border-radius:14px;font-size:13px;color:#fff}.recv{background:#1e293b;align-self:flex-start;border-bottom-left-radius:2px}.sent{background:linear-gradient(135deg,#22D3EE,#8B5CF6);align-self:flex-end;border-bottom-right-radius:2px}</style><div class="b recv">Status on the mission?</div><div class="b sent">Package secured. En route.</div>`,
  },
  {
    category: "Chat & Messaging",
    title: "Typing Indicator Dots",
    promptText:
      "Create a chat 'typing...' indicator with three small dots inside a bubble that bounce up and down in a staggered sequence, looping continuously.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.bubble{display:flex;gap:4px;background:#1e293b;padding:12px 16px;border-radius:16px}.dot{width:6px;height:6px;border-radius:50%;background:#94A3B8;animation:b 1.2s infinite}.dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}@keyframes b{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}</style><div class="bubble"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`,
  },
  {
    category: "Chat & Messaging",
    title: "Message Read-Receipt Ticks",
    promptText:
      "Build sent-message checkmark indicators that show a single grey tick for 'sent', double grey ticks for 'delivered', and double blue ticks for 'read', transitioning color smoothly between states.",
  },
  {
    category: "Chat & Messaging",
    title: "Contact List with Online Dot",
    promptText:
      "Create a chat contact list where each row has an avatar with a small green online-status dot in the corner, name, last message preview, and unread-count badge on the right.",
  },
  {
    category: "Chat & Messaging",
    title: "Voice Message Waveform Bubble",
    promptText:
      "Build a voice-message chat bubble containing a play button, a static waveform bar visualization, and a duration label, with the waveform bars highlighting progressively as playback advances.",
  },
  {
    category: "Chat & Messaging",
    title: "Swipe-to-Reply Message Row",
    promptText:
      "Create a chat message row that reveals a reply icon and slightly shifts the bubble to the side as the user swipes/drags it horizontally, snapping back when released.",
  },

  // ---------- Weather ----------
  {
    category: "UI Components",
    title: "Weather Card with Animated Icon",
    promptText:
      "Build a weather card showing city name, temperature, and a simple animated sun/cloud icon (sun rays rotating slowly or a cloud drifting), plus a 5-day mini forecast row at the bottom.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.card{background:linear-gradient(160deg,#0ea5e9,#22D3EE);border-radius:20px;padding:24px;color:#fff;font-family:sans-serif;width:180px;text-align:center}.sun{font-size:40px;display:inline-block;animation:spin 6s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.temp{font-size:32px;font-weight:800;margin:8px 0}</style><div class="card"><div class="sun">☀️</div><div class="temp">27°C</div><div>New Delhi</div></div>`,
  },
  {
    category: "UI Components",
    title: "Rain Drop Background Effect",
    promptText:
      "Create a subtle animated rain effect using thin falling line elements over a dark background, looping continuously at varying speeds and horizontal positions, for a weather-app hero.",
  },
  {
    category: "UI Components",
    title: "Temperature Range Slider Display",
    promptText:
      "Build a horizontal temperature scale bar showing today's low/high as a filled gradient segment on a full-range track, with min and max labels at each end of the filled portion.",
  },
  {
    category: "UI Components",
    title: "Hourly Forecast Scroll Strip",
    promptText:
      "Create a horizontally scrollable strip of hourly forecast cards, each showing time, a small weather icon, and temperature, with the current hour visually highlighted.",
  },

  // ---------- Music Streaming ----------
  {
    category: "UI Components",
    title: "Now Playing Full-Screen Card",
    promptText:
      "Build a full-screen 'Now Playing' music card with a large album art square, song title, artist, a scrubber progress bar, and play/pause/skip controls centered below.",
  },
  {
    category: "UI Components",
    title: "Album Art Vinyl Spin",
    promptText:
      "Create a circular album-art image that continuously rotates like a vinyl record while a track is playing, pausing the rotation smoothly when playback is paused.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.vinyl{width:120px;height:120px;border-radius:50%;background:conic-gradient(#111,#22D3EE,#111,#8B5CF6,#111);animation:spin 4s linear infinite;position:relative}.vinyl::after{content:'';position:absolute;inset:40%;background:#0B0F17;border-radius:50%}@keyframes spin{to{transform:rotate(360deg)}}</style><div class="vinyl"></div>`,
  },
  {
    category: "UI Components",
    title: "Playlist Row with Hover Play",
    promptText:
      "Build a playlist track row showing track number that swaps to a play icon on hover, title, artist, and duration, with the whole row highlighting on hover.",
  },
  {
    category: "UI Components",
    title: "Genre Category Tile Grid",
    promptText:
      "Create a grid of colorful gradient genre tiles (Pop, Rock, Jazz, Lo-fi) each with a slight rotated decorative icon in the corner, scaling up slightly on hover.",
  },
  {
    category: "UI Components",
    title: "Equalizer Bars Animation",
    promptText:
      "Build a small equalizer visualization of 4-5 vertical bars that animate up and down at random staggered heights continuously, indicating audio is currently playing.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17;gap:3px}.bar{width:5px;background:linear-gradient(#22D3EE,#8B5CF6);animation:eq .8s ease-in-out infinite alternate}.bar:nth-child(2){animation-delay:.15s}.bar:nth-child(3){animation-delay:.3s}.bar:nth-child(4){animation-delay:.1s}@keyframes eq{from{height:6px}to{height:28px}}</style><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>`,
  },

  // ---------- Healthcare ----------
  {
    category: "UI Components",
    title: "Doctor Appointment Card",
    promptText:
      "Build an appointment card showing doctor avatar, name, specialty tag, date/time, and a status badge (Confirmed/Pending), with a video-call icon button if it's a telehealth visit.",
  },
  {
    category: "UI Components",
    title: "Medication Reminder List",
    promptText:
      "Create a medication schedule list grouped by time of day (Morning/Afternoon/Evening), each item with a pill icon, name, dosage, and a checkbox to mark as taken.",
  },
  {
    category: "UI Components",
    title: "Vital Signs Gauge Widget",
    promptText:
      "Build a semi-circular gauge widget showing a heart-rate or blood-pressure value with a colored arc indicating normal/warning/critical zones and a needle or fill pointing to the current reading.",
  },
  {
    category: "UI Components",
    title: "Symptom Checker Chat Flow",
    promptText:
      "Create a step-by-step symptom-checker UI presented as chat bubbles asking one question at a time with tappable answer chips, advancing to the next question on selection.",
  },

  // ---------- Job Board ----------
  {
    category: "UI Components",
    title: "Job Listing Card with Tags",
    promptText:
      "Build a job listing card with company logo, job title, location, salary range, and small tag pills (Remote, Full-time), plus a bookmark icon in the top-right corner.",
  },
  {
    category: "UI Components",
    title: "Application Status Stepper",
    promptText:
      "Create a horizontal stepper showing a job application's progress (Applied → Screening → Interview → Offer), with completed steps filled and connected by a solid line, remaining steps dashed.",
  },
  {
    category: "UI Components",
    title: "Resume Upload Drop Zone",
    promptText:
      "Build a drag-and-drop file upload zone for a resume with a dashed border that highlights and changes color when a file is dragged over it, showing a file-icon preview once uploaded.",
  },
  {
    category: "UI Components",
    title: "Skill Tag Match Percentage",
    promptText:
      "Create a job-match card showing a circular percentage match score next to a list of skill tags, coloring matched skills green and missing ones grey.",
  },

  // ---------- Crypto & Web3 ----------
  {
    category: "UI Components",
    title: "Wallet Connect Button",
    promptText:
      "Build a 'Connect Wallet' button that, when clicked, shows a brief loading spinner then swaps to display a truncated wallet address (e.g. 0x71C...9E3) with a small green connected-status dot.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.btn{padding:10px 20px;border-radius:10px;border:none;background:linear-gradient(90deg,#22D3EE,#8B5CF6);color:#fff;font-family:sans-serif;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:8px}.dot{width:8px;height:8px;border-radius:50%;background:#22c55e;display:none}.connected .dot{display:block}</style><button class="btn" onclick="this.classList.add('connected');this.querySelector('.label').textContent='0x71C...9E3'"><span class="dot"></span><span class="label">Connect Wallet</span></button>`,
  },
  {
    category: "UI Components",
    title: "NFT Gallery Card Hover",
    promptText:
      "Create an NFT card with an image, a subtle animated gradient border, collection name, and floor-price label, with the border animation speeding up slightly on hover.",
  },
  {
    category: "UI Components",
    title: "Token Swap Interface",
    promptText:
      "Build a token-swap panel with two input fields (from/to token) separated by a circular swap-direction icon button that rotates 180° when clicked to flip the tokens.",
  },
  {
    category: "UI Components",
    title: "Gas Fee Estimator Bar",
    promptText:
      "Create a transaction gas-fee selector with three speed options (Slow/Average/Fast) as segmented buttons, each showing an estimated fee and time, with the selected option highlighted.",
  },
  {
    category: "UI Components",
    title: "Live Crypto Price Chart Card",
    promptText:
      "Build a coin price card with current price, 24h percentage change badge (green/red), and an animated SVG line chart that draws itself in on page load using a stroke-dashoffset animation.",
  },

  // ---------- AI Chatbot UI ----------
  {
    category: "UI Components",
    title: "AI Assistant Floating Bubble",
    promptText:
      "Create a floating circular AI-assistant launcher button in the bottom-right corner with a soft pulsing glow ring, expanding into a chat panel when clicked.",
  },
  {
    category: "UI Components",
    title: "Streaming Text Response Effect",
    promptText:
      "Build a chat response area where AI-generated text appears character-by-character (streaming/typewriter effect) with a blinking cursor at the end until the message finishes.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17;font-family:sans-serif;color:#fff;font-size:14px}#c{animation:blink 1s step-end infinite}@keyframes blink{50%{opacity:0}}</style><span id="t"></span><span id="c">▍</span><script>const s='Analyzing mission parameters...';let i=0;(function type(){if(i<=s.length){document.getElementById('t').textContent=s.slice(0,i++);setTimeout(type,60)}else document.getElementById('c').style.display='none'})();<\/script>`,
  },
  {
    category: "UI Components",
    title: "Prompt Suggestion Chips",
    promptText:
      "Create a row of suggested-prompt chip buttons above a chat input, wrapping to multiple lines on smaller widths, each filling the input field with its text when clicked.",
  },
  {
    category: "UI Components",
    title: "AI Thinking Shimmer Skeleton",
    promptText:
      "Build a chat-response placeholder made of a few shimmering skeleton lines (animated gradient sweep) shown while the AI is generating its answer, replaced by real text once ready.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;flex-direction:column;justify-content:center;gap:8px;background:#0B0F17;padding:0 40px}.line{height:12px;border-radius:6px;background:linear-gradient(90deg,#1e293b 25%,#334155 50%,#1e293b 75%);background-size:200% 100%;animation:sh 1.4s infinite}@keyframes sh{to{background-position:-200% 0}}</style><div class="line" style="width:90%"></div><div class="line" style="width:70%"></div><div class="line" style="width:50%"></div>`,
  },
  {
    category: "UI Components",
    title: "Model Selector Dropdown",
    promptText:
      "Create a model-selector dropdown (like choosing between GPT/Claude/Gemini) showing an icon, name, and short description per option, with a checkmark on the currently selected model.",
  },

  // ---------- Settings ----------
  {
    category: "UI Components",
    title: "Toggle Switch List (Settings)",
    promptText:
      "Build a settings list of rows each with a label, short description, and an iOS-style toggle switch on the right that animates the knob sliding and background color change.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.sw{width:44px;height:24px;background:#334155;border-radius:12px;position:relative;cursor:pointer;transition:.3s}.sw.on{background:linear-gradient(90deg,#22D3EE,#8B5CF6)}.knob{width:18px;height:18px;background:#fff;border-radius:50%;position:absolute;top:3px;left:3px;transition:.3s}.sw.on .knob{left:23px}</style><div class="sw on" onclick="this.classList.toggle('on')"><div class="knob"></div></div>`,
  },
  {
    category: "UI Components",
    title: "Theme Selector Swatches",
    promptText:
      "Create a settings section for choosing an app theme, shown as small preview swatch cards (Light/Dark/System) with a selected-state ring border around the active choice.",
  },
  {
    category: "UI Components",
    title: "Danger Zone Settings Section",
    promptText:
      "Build a 'Danger Zone' settings card with a red-tinted border, warning icon, and a destructive action button (Delete Account) that opens a confirmation modal requiring the user to type the account name.",
  },
  {
    category: "UI Components",
    title: "Two-Factor Auth Setup Flow",
    promptText:
      "Create a 2FA setup panel showing a QR code placeholder, a manual setup key with a copy button, and a 6-digit verification code input to confirm the authenticator app link.",
  },

  // ---------- Profile ----------
  {
    category: "UI Components",
    title: "Profile Header with Cover Photo",
    promptText:
      "Build a profile page header with a full-width cover-photo banner and a circular avatar overlapping the bottom edge, name and bio below, and an Edit Profile button aligned to the right.",
  },
  {
    category: "UI Components",
    title: "Profile Completion Progress Bar",
    promptText:
      "Create a 'Complete your profile' card with a circular percentage indicator and a checklist of remaining steps (Add photo, Verify email, Add bio), each with a checkmark once done.",
  },
  {
    category: "UI Components",
    title: "Editable Avatar Upload Circle",
    promptText:
      "Build a circular avatar image with a camera-icon overlay that appears on hover, opening a file picker and showing an upload-progress ring around the avatar while processing.",
  },
  {
    category: "UI Components",
    title: "Tabbed Profile Sections",
    promptText:
      "Create a profile page with tabs (Posts / About / Photos / Friends) where the active tab has an animated sliding underline indicator that moves smoothly between tab positions.",
  },

  // ---------- Video Streaming ----------
  {
    category: "UI Components",
    title: "Video Player Custom Controls",
    promptText:
      "Build a custom video-player control bar overlay with play/pause, a scrubber with buffered-range indicator, volume slider, and fullscreen button, fading out after a few seconds of inactivity.",
  },
  {
    category: "UI Components",
    title: "Continue Watching Progress Card",
    promptText:
      "Create a 'Continue Watching' thumbnail card with a thin progress bar along the bottom edge showing how much of the video has been watched, and a play icon overlay on hover.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.card{width:200px;height:110px;border-radius:12px;background:linear-gradient(135deg,#1c2433,#141a24);position:relative;overflow:hidden}.bar{position:absolute;bottom:0;left:0;height:4px;width:55%;background:linear-gradient(90deg,#22D3EE,#8B5CF6)}</style><div class="card"><div class="bar"></div></div>`,
  },
  {
    category: "UI Components",
    title: "Episode Thumbnail Scrub Preview",
    promptText:
      "Build a video scrubber where hovering over a point on the timeline shows a small floating thumbnail preview image above the cursor position along with the timestamp.",
  },
  {
    category: "UI Components",
    title: "Subtitle/Caption Toggle Bar",
    promptText:
      "Create a video-settings popover for choosing subtitle language and playback speed, opened from a gear icon on the player controls, with radio-style selectable rows.",
  },
  {
    category: "UI Components",
    title: "Live Stream 'LIVE' Badge Pulse",
    promptText:
      "Build a small red 'LIVE' badge with a pulsing dot animation next to it, shown on a video thumbnail to indicate an ongoing live stream.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.badge{display:flex;align-items:center;gap:6px;background:#ef4444;color:#fff;padding:4px 10px;border-radius:6px;font-family:sans-serif;font-size:11px;font-weight:700}.dot{width:6px;height:6px;border-radius:50%;background:#fff;animation:pulse 1.2s infinite}@keyframes pulse{50%{opacity:.3}}</style><div class="badge"><div class="dot"></div>LIVE</div>`,
  },

  // ---------- Blog ----------
  {
    category: "UI Components",
    title: "Blog Category Filter Pills",
    promptText:
      "Build a horizontal row of blog-category filter pills where the active category has a solid gradient fill and others are outlined, filtering the post grid below on click.",
  },
  {
    category: "UI Components",
    title: "Reading Progress Bar (Top)",
    promptText:
      "Create a thin progress bar fixed to the very top of the viewport that fills left-to-right proportional to how far the user has scrolled through a blog article.",
  },
  {
    category: "UI Components",
    title: "Author Bio Card Footer",
    promptText:
      "Build an author bio card shown at the end of a blog post with avatar, name, short bio, and small social icon links, inside a subtly bordered rounded box.",
  },
  {
    category: "UI Components",
    title: "Related Posts Card Row",
    promptText:
      "Create a 'Related Articles' section with a horizontal row of compact post cards (thumbnail, title, date) shown at the bottom of a blog post.",
  },

  // ---------- Community Forum ----------
  {
    category: "UI Components",
    title: "Upvote/Downvote Arrow Widget",
    promptText:
      "Build a vertical up/down arrow voting widget with a score number in between, where the arrow highlights its accent color when active and the score animates when it changes.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0B0F17;font-family:sans-serif;color:#94A3B8}.arrow{cursor:pointer;font-size:18px;transition:.2s}.arrow.up.active{color:#22D3EE}.arrow.down.active{color:#8B5CF6}.score{color:#fff;font-weight:700;margin:4px 0}</style><div class="arrow up active" onclick="this.classList.toggle('active')">▲</div><div class="score">128</div><div class="arrow down">▼</div>`,
  },
  {
    category: "UI Components",
    title: "Forum Thread List Row",
    promptText:
      "Create a forum thread list row with a category tag, thread title, reply count badge, last-activity avatar, and relative timestamp, with unread threads shown in bold.",
  },
  {
    category: "UI Components",
    title: "Nested Reply Collapse Toggle",
    promptText:
      "Build a collapsible comment thread where clicking a '[-]' toggle collapses all nested replies under a comment into a single line showing just the reply count.",
  },
  {
    category: "Badges",
    title: "User Reputation Badge Tier",
    promptText:
      "Create a small reputation/level badge next to a username showing a colored icon (bronze/silver/gold/platinum tiers) with a tooltip on hover showing the exact point total.",
  },
  {
    category: "UI Components",
    title: "Poll Results Bar Chart",
    promptText:
      "Build a forum poll widget showing each option as a horizontal bar that fills to its percentage width with an animated transition, plus the vote count and percentage label.",
  },

  // ---------- Marketplace ----------
  {
    category: "UI Components",
    title: "Seller Profile Rating Card",
    promptText:
      "Build a marketplace seller card with avatar, shop name, a 5-star rating display with a review count, and a 'Verified Seller' badge shown conditionally.",
  },
  {
    category: "UI Components",
    title: "Offer/Counter-Offer Chat Card",
    promptText:
      "Create an inline price-offer card inside a marketplace chat thread, showing the offered amount with Accept/Decline/Counter buttons directly in the message bubble.",
  },
  {
    category: "UI Components",
    title: "Category Icon Grid Menu",
    promptText:
      "Build a marketplace homepage grid of category icons in soft colored circular backgrounds with a label underneath each, scaling up slightly on hover/tap.",
  },
  {
    category: "UI Components",
    title: "Listing Image Carousel with Dots",
    promptText:
      "Create a swipeable image carousel for a marketplace listing with left/right arrow overlays on desktop and dot indicators at the bottom showing the current image position.",
  },
  {
    category: "Badges",
    title: "'Sold' Ribbon Overlay",
    promptText:
      "Build a diagonal 'SOLD' ribbon banner overlaid across the top corner of a listing thumbnail image, styled with a solid color and subtle shadow.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.wrap{width:160px;height:110px;background:#1e293b;border-radius:10px;position:relative;overflow:hidden}.ribbon{position:absolute;top:14px;right:-32px;background:#ef4444;color:#fff;font-family:sans-serif;font-size:11px;font-weight:700;padding:4px 40px;transform:rotate(45deg);box-shadow:0 2px 6px rgba(0,0,0,.3)}</style><div class="wrap"><div class="ribbon">SOLD</div></div>`,
  },

  // ---------- Subscription Billing ----------
  {
    category: "UI Components",
    title: "Plan Comparison Toggle (Monthly/Yearly)",
    promptText:
      "Build a billing-cycle toggle (Monthly/Yearly) above pricing plan cards that animates a sliding pill background and updates displayed prices with a 'Save 20%' badge on the Yearly option.",
  },
  {
    category: "UI Components",
    title: "Invoice List Row with Status",
    promptText:
      "Create a billing history list row with invoice date, amount, a colored status pill (Paid/Failed/Pending), and a download-PDF icon button on the right.",
  },
  {
    category: "UI Components",
    title: "Credit Card Input with Brand Icon",
    promptText:
      "Build a card-number input field that detects the card brand as digits are typed (Visa/Mastercard/Amex) and displays the matching brand icon inside the input on the right side.",
  },
  {
    category: "UI Components",
    title: "Usage Meter Bar with Overage Warning",
    promptText:
      "Create a usage-limit bar (e.g. API calls used) that fills green under 80%, turns amber near the limit, and red with a warning icon once over the plan's included quota.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;flex-direction:column;justify-content:center;gap:6px;background:#0B0F17;padding:0 40px;font-family:sans-serif;color:#94A3B8;font-size:12px}.track{height:10px;border-radius:5px;background:#1e293b;overflow:hidden}.fill{height:100%;width:88%;background:#f59e0b;border-radius:5px}</style><div>8,800 / 10,000 requests</div><div class="track"><div class="fill"></div></div>`,
  },
  {
    category: "UI Components",
    title: "Cancel Subscription Retention Modal",
    promptText:
      "Build a cancellation-flow modal that, before confirming, offers a retention incentive (e.g. discount or pause option) as alternative buttons alongside the final 'Cancel Anyway' link.",
  },

  // ---------- Analytics ----------
  {
    category: "UI Components",
    title: "Multi-Line Comparison Chart Card",
    promptText:
      "Build an analytics card with two overlaid SVG line charts (this period vs last period) in different colors, plus a small legend and a percentage-change summary above the chart.",
  },
  {
    category: "UI Components",
    title: "Funnel Conversion Steps",
    promptText:
      "Create a funnel visualization made of progressively narrower trapezoid/bar segments representing each step of a conversion flow, with a percentage label on each segment.",
  },
  {
    category: "UI Components",
    title: "Donut Chart with Center Label",
    promptText:
      "Build an SVG donut chart with multiple colored segments and a total value shown as text centered inside the ring, animating the segments filling in on load.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}</style><svg width="140" height="140" viewBox="0 0 42 42"><circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#1e293b" stroke-width="5"/><circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#22D3EE" stroke-width="5" stroke-dasharray="60 40" stroke-dashoffset="25" transform="rotate(-90 21 21)"/><circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#8B5CF6" stroke-width="5" stroke-dasharray="25 75" stroke-dashoffset="-35" transform="rotate(-90 21 21)"/><text x="21" y="24" text-anchor="middle" fill="#fff" font-size="7" font-family="sans-serif">1.2k</text></svg>`,
  },
  {
    category: "UI Components",
    title: "Real-time Active Users Counter",
    promptText:
      "Build a live 'active users right now' widget with a pulsing green dot and a number that occasionally ticks up/down with a smooth count animation to simulate real-time updates.",
  },
  {
    category: "UI Components",
    title: "Cohort Retention Heatmap Table",
    promptText:
      "Create a retention cohort table where each cell's background color intensity represents the retention percentage for that week/cohort, darker/brighter for higher retention.",
  },

  // ---------- Smart Home ----------
  {
    category: "UI Components",
    title: "Smart Thermostat Dial",
    promptText:
      "Build a circular draggable thermostat dial showing the current temperature setting in the center, with a colored arc around the edge indicating heating (orange) or cooling (blue) mode.",
  },
  {
    category: "UI Components",
    title: "Room Device Toggle Grid",
    promptText:
      "Create a grid of room/device cards (Living Room lights, Bedroom AC) each with an icon and a toggle switch, the card's background subtly glowing when the device is on.",
  },
  {
    category: "UI Components",
    title: "Smart Lock Status Card",
    promptText:
      "Build a door-lock status card showing a large lock/unlock icon that animates a rotation or shape change on toggle, plus 'Last locked at 9:42 PM' timestamp text below.",
  },
  {
    category: "UI Components",
    title: "Energy Usage Bar Chart",
    promptText:
      "Create a daily energy-consumption bar chart with bars colored by usage intensity, a total kWh summary above, and a comparison line showing the previous day's average.",
  },

  // ---------- Non-profit / Donation ----------
  {
    category: "UI Components",
    title: "Donation Goal Progress Bar",
    promptText:
      "Build a fundraising progress bar showing amount raised vs goal, with a small marker icon riding along the top of the filled portion and a percentage label.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;flex-direction:column;justify-content:center;gap:8px;background:#0B0F17;padding:0 40px;font-family:sans-serif;color:#fff}.track{height:14px;border-radius:7px;background:#1e293b;overflow:hidden}.fill{height:100%;width:64%;background:linear-gradient(90deg,#22D3EE,#8B5CF6);border-radius:7px}</style><div>$12,800 raised of $20,000 goal</div><div class="track"><div class="fill"></div></div>`,
  },
  {
    category: "UI Components",
    title: "Donation Amount Chip Selector",
    promptText:
      "Create a row of preset donation-amount chips ($10/$25/$50/$100) plus a 'Custom' option that reveals a text input, with the selected chip highlighted with a gradient fill.",
  },
  {
    category: "UI Components",
    title: "Impact Stats Counter Row",
    promptText:
      "Build a row of animated counting-up statistics (e.g. 'Meals Provided: 12,400') that count from 0 to their final value when the section scrolls into view.",
  },

  // ---------- Sports ----------
  {
    category: "UI Components",
    title: "Live Match Score Card",
    promptText:
      "Build a live sports scoreboard card with two team logos/names, current score, match time/period, and a pulsing 'LIVE' indicator.",
  },
  {
    category: "UI Components",
    title: "League Standings Table",
    promptText:
      "Create a league standings table with rank, team name/logo, played/won/lost/points columns, highlighting promotion and relegation zones with colored left-border accents.",
  },
  {
    category: "UI Components",
    title: "Player Stat Radar Chart",
    promptText:
      "Build an SVG radar/spider chart comparing a player's stats (Speed, Passing, Shooting, Defense, Stamina) across five axes with a filled polygon shape.",
  },
  {
    category: "UI Components",
    title: "Match Timeline Events Strip",
    promptText:
      "Create a horizontal match-timeline strip with icons (goal, card, substitution) placed at their corresponding minute along the bar, with a tooltip on hover showing event details.",
  },

  // ---------- Automotive ----------
  {
    category: "UI Components",
    title: "Car Rental Comparison Card",
    promptText:
      "Build a car-rental listing card with a vehicle image, model name, seat/transmission icons row, price per day, and a 'Select' button.",
  },
  {
    category: "UI Components",
    title: "EV Battery Charge Indicator",
    promptText:
      "Create a battery-level indicator styled like an EV dashboard gauge, with a fill color that shifts from red to yellow to green based on charge percentage, plus an estimated range label.",
  },
  {
    category: "UI Components",
    title: "Trip Route Map Preview Card",
    promptText:
      "Build a ride-summary card with a simplified route line between two pin markers on a stylized map background, showing distance, duration, and fare below.",
  },

  // ---------- Legal & Docs ----------
  {
    category: "UI Components",
    title: "Sidebar Docs Navigation Tree",
    promptText:
      "Build a documentation sidebar with collapsible nested sections (chevron-toggle) and the currently active page highlighted with a colored left border and background tint.",
  },
  {
    category: "UI Components",
    title: "Contract Clause Accordion",
    promptText:
      "Create an accordion for a terms-of-service page where each clause section expands/collapses with a smooth height animation and a rotating chevron icon.",
  },
  {
    category: "UI Components",
    title: "E-Signature Confirmation Card",
    promptText:
      "Build a document-signing confirmation card showing a stylized signature script rendering in, a green checkmark, and 'Signed on [date]' text below.",
  },

  // ---------- Weddings & Events ----------
  {
    category: "UI Components",
    title: "Event Countdown Timer",
    promptText:
      "Create a countdown timer showing days/hours/minutes/seconds until an event date, each unit in its own flip-card-style box with numbers that update live.",
  },
  {
    category: "UI Components",
    title: "RSVP Response Toggle Buttons",
    promptText:
      "Build an RSVP widget with three toggle buttons (Attending / Maybe / Can't Make It) where the selected option fills with a color matching its meaning (green/amber/grey).",
  },
  {
    category: "UI Components",
    title: "Guest Table Seating Chart",
    promptText:
      "Create a seating-chart layout with circular table icons arranged around a floor plan, each table showing a guest-count badge and highlighting on hover with the assigned names in a tooltip.",
  },
  {
    category: "UI Components",
    title: "Photo Gallery Masonry with Lightbox",
    promptText:
      "Build an event photo gallery in a masonry grid layout that opens a full-screen lightbox with next/prev navigation when any photo thumbnail is clicked.",
  },

  // ---------- Podcasting ----------
  {
    category: "UI Components",
    title: "Podcast Episode List with Chapters",
    promptText:
      "Build a podcast episode detail view listing chapter markers as clickable timestamps that jump the audio player to that point when clicked.",
  },
  {
    category: "UI Components",
    title: "Show Subscribe Platform Icons",
    promptText:
      "Create a row of 'Listen on' platform icon buttons (Spotify, Apple Podcasts, Google Podcasts) each with its own brand color on hover.",
  },
  {
    category: "UI Components",
    title: "Playback Speed Selector Pill",
    promptText:
      "Build a small pill button showing the current playback speed (e.g. '1.5x') that cycles through preset speed options (1x, 1.25x, 1.5x, 2x) each time it's tapped.",
  },

  // ---------- Survey & Polls ----------
  {
    category: "Forms",
    title: "Multiple Choice Survey Question",
    promptText:
      "Build a survey question card with radio-style answer options that highlight with a colored border and checkmark when selected, and a progress indicator showing 'Question 3 of 8'.",
  },
  {
    category: "Forms",
    title: "Likert Scale Rating Row",
    promptText:
      "Create a Likert-scale survey row (Strongly Disagree to Strongly Agree) as a horizontal row of selectable circles with labels below the end points only.",
  },
  {
    category: "Forms",
    title: "Slider-Based Satisfaction Rating",
    promptText:
      "Build a satisfaction survey using a horizontal slider with emoji faces at each end (frowning to smiling) that changes a background color gradient behind the track based on position.",
  },
  {
    category: "UI Components",
    title: "Survey Completion Thank You Screen",
    promptText:
      "Create a survey-completion screen with a checkmark animation, a 'Thanks for your feedback!' message, and a small summary of how the responses will be used.",
  },

  // ---------- Photography ----------
  {
    category: "UI Components",
    title: "Before/After Image Slider",
    promptText:
      "Build a draggable before/after image comparison slider with a vertical divider handle that reveals more of one image and less of the other as it's dragged.",
  },
  {
    category: "UI Components",
    title: "Portfolio Filter Tag Grid",
    promptText:
      "Create a photography portfolio grid with filter tags above (Portraits, Landscape, Events) that fade out non-matching images and reflow the grid when a filter is selected.",
  },
  {
    category: "UI Components",
    title: "EXIF Metadata Overlay Card",
    promptText:
      "Build a photo detail overlay showing camera settings (aperture, shutter speed, ISO, focal length) as small icon-labeled stats along the bottom of the image on hover.",
  },

  // ---------- Newsletter ----------
  {
    category: "Forms",
    title: "Inline Newsletter Signup Bar",
    promptText:
      "Build an inline newsletter signup bar embedded within page content (not a popup) with an email input and subscribe button side-by-side, showing a success checkmark message after submission.",
  },
  {
    category: "UI Components",
    title: "Email Preference Center Checklist",
    promptText:
      "Create an email-preferences page with a checklist of newsletter categories the user can opt in/out of individually, each with a toggle and short description.",
  },
  {
    category: "UI Components",
    title: "Unsubscribe Confirmation Card",
    promptText:
      "Build an unsubscribe-confirmation page with a simple card showing 'You've been unsubscribed', an option to resubscribe, and a short survey asking why they left.",
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
  console.log(`Seeded ${PROMPTS.length} more example prompts (batch 9 — mega batch).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
