import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROMPTS: {
  category: string;
  title: string;
  promptText: string;
  previewHtml?: string;
}[] = [
  // ---------- E-commerce ----------
  {
    category: "E-commerce",
    title: "Product Card with Hover Zoom",
    promptText:
      "Build a product card where the product image slowly zooms in on hover (overflow hidden on the container), revealing a quick 'Add to Cart' button that fades in over the bottom of the image.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.card{width:180px;border-radius:14px;overflow:hidden;background:#141a24;font-family:sans-serif}.img{height:120px;background:linear-gradient(135deg,#22D3EE,#8B5CF6);transition:.4s;overflow:hidden}.card:hover .img{transform:scale(1.12)}.info{padding:10px;color:#fff;font-size:12px}</style><div class="card"><div class="img"></div><div class="info">Agent Hoodie — $49</div></div>`,
  },
  {
    category: "E-commerce",
    title: "Slide-in Cart Drawer",
    promptText:
      "Create a shopping cart drawer that slides in from the right edge of the screen over a dimmed backdrop, listing line items with quantity steppers and a sticky checkout button at the bottom.",
  },
  {
    category: "E-commerce",
    title: "Quick View Product Modal",
    promptText:
      "Build a 'Quick View' modal that opens from a product card click, showing a larger image on one side and details/price/add-to-cart on the other, without navigating away from the listing page.",
  },
  {
    category: "E-commerce",
    title: "Size Selector Chips",
    promptText:
      "Create a row of size-selection chips (S, M, L, XL) where the selected chip gets a solid gradient background and the others stay outlined, with unavailable sizes shown struck-through and disabled.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17;gap:8px}.chip{width:36px;height:36px;border-radius:8px;border:1px solid #333;color:#94A3B8;display:flex;align-items:center;justify-content:center;font-family:sans-serif;font-size:12px;cursor:pointer}.chip.active{background:linear-gradient(135deg,#22D3EE,#8B5CF6);color:#fff;border-color:transparent}.chip.off{opacity:.3;text-decoration:line-through;cursor:not-allowed}</style><div class="chip">S</div><div class="chip active">M</div><div class="chip">L</div><div class="chip off">XL</div>`,
  },
  {
    category: "E-commerce",
    title: "Add-to-Cart Success Bounce",
    promptText:
      "Animate an 'Add to Cart' button so that on click it briefly shows a checkmark with a bounce/scale animation, then a small cart-icon badge count increments with a pop effect.",
  },
  {
    category: "E-commerce",
    title: "Wishlist Heart Toggle",
    promptText:
      "Create a heart icon button that fills in with a pink color and a quick scale-pulse animation when clicked to add an item to a wishlist, reverting smoothly when clicked again.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.heart{font-size:32px;cursor:pointer;transition:.2s;color:#475569}.heart.active{color:#ec4899;animation:pop .3s}@keyframes pop{50%{transform:scale(1.4)}}</style><div class="heart" onclick="this.classList.toggle('active')">♥</div>`,
  },
  {
    category: "E-commerce",
    title: "Sticky Add-to-Cart Bar",
    promptText:
      "Build a slim product summary bar that becomes fixed to the bottom of the screen once the user scrolls past the main product image, showing name, price, and an Add to Cart button.",
  },

  // ---------- Dashboard ----------
  {
    category: "Dashboard",
    title: "Collapsible Sidebar Toggle",
    promptText:
      "Create a dashboard sidebar that collapses to icon-only width when a toggle button is clicked, animating the width and fading out the text labels, with the main content area resizing to fill the space.",
  },
  {
    category: "Dashboard",
    title: "KPI Stat Card with Sparkline",
    promptText:
      "Build a stat card showing a large number, a percentage-change badge (green up / red down arrow), and a small inline SVG sparkline chart showing the recent trend beneath it.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.card{background:#141a24;border:1px solid #22D3EE22;border-radius:16px;padding:16px;font-family:sans-serif;color:#fff;width:160px}.num{font-size:26px;font-weight:800}.up{color:#22c55e;font-size:11px}</style><div class="card"><div class="num">4,921</div><div class="up">▲ 12.4%</div><svg width="120" height="30" viewBox="0 0 120 30"><polyline points="0,25 20,20 40,22 60,10 80,14 100,4 120,8" fill="none" stroke="#22D3EE" stroke-width="2"/></svg></div>`,
  },
  {
    category: "Dashboard",
    title: "Notification Center Slide Panel",
    promptText:
      "Build a bell-icon-triggered notification panel that slides in from the right, grouping notifications by 'Today' and 'Earlier', with unread items marked by a small colored dot.",
  },
  {
    category: "Dashboard",
    title: "Dark Dashboard Shell Layout",
    promptText:
      "Create the base layout shell for an admin dashboard: fixed left sidebar with nav icons, a top header bar with search and profile avatar, and a scrollable main content region — all in a dark theme.",
  },
  {
    category: "Dashboard",
    title: "Sortable Data Table Headers",
    promptText:
      "Build a data table where clicking a column header toggles an ascending/descending sort arrow icon and highlights the active column, re-ordering the visible rows accordingly.",
  },

  // ---------- Onboarding ----------
  {
    category: "Onboarding",
    title: "Multi-Step Signup Wizard",
    promptText:
      "Create a 3-step signup form (Account → Profile → Preferences) with a progress bar at top, Next/Back buttons, and a slide transition between steps without a full page reload.",
  },
  {
    category: "Onboarding",
    title: "Product Tour Tooltip Walkthrough",
    promptText:
      "Build a guided product-tour overlay that spotlights one UI element at a time with a dimmed backdrop everywhere else, showing a tooltip with 'Next'/'Skip' controls pointing at the highlighted element.",
  },
  {
    category: "Onboarding",
    title: "Welcome Confetti Screen",
    promptText:
      "Design a full-screen 'Welcome aboard!' confirmation screen shown right after signup, with a burst of confetti animation and a prominent 'Start Exploring' button.",
  },
  {
    category: "Onboarding",
    title: "Progress Dots Carousel",
    promptText:
      "Build an onboarding carousel of 3-4 slides with small dot indicators at the bottom that fill in as active, supporting swipe/drag and a 'Skip' link in the corner.",
  },
  {
    category: "Onboarding",
    title: "Permission Request Card",
    promptText:
      "Create a friendly permission-request card (e.g. for notifications) explaining the benefit with an icon, and Allow/Not Now buttons, styled as a soft floating card rather than a native browser prompt.",
  },

  // ---------- Error Pages ----------
  {
    category: "Error Pages",
    title: "Animated 404 Page",
    promptText:
      "Design a 404 error page with a large glitching/flickering '404' headline, a short friendly message, and a button back to the homepage, using a subtle CSS glitch animation on the numbers.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0B0F17;font-family:sans-serif;color:#fff}h1{font-size:64px;margin:0;background:linear-gradient(90deg,#22D3EE,#8B5CF6);-webkit-background-clip:text;background-clip:text;color:transparent;animation:glitch 2s infinite}p{color:#94A3B8}@keyframes glitch{2%,64%{transform:translate(2px,0) skew(0deg)}4%,60%{transform:translate(-2px,0) skew(0deg)}62%{transform:translate(0,0) skew(5deg)}}</style><h1>404</h1><p>No intel found at this location, Agent.</p>`,
  },
  {
    category: "Error Pages",
    title: "Maintenance Mode Page",
    promptText:
      "Build a 'Site under maintenance' page with a slowly rotating gear/wrench icon illustration, an estimated return time, and an email field to get notified when the site is back.",
  },
  {
    category: "Error Pages",
    title: "Under Construction Page",
    promptText:
      "Design a playful 'Under Construction' landing page with a diagonal caution-stripe banner pattern background and a bouncing construction-icon animation.",
  },

  // ---------- Media ----------
  {
    category: "UI Components",
    title: "Audio Player with Waveform",
    promptText:
      "Build an audio player UI with a play/pause button, a horizontal waveform made of animated bars that pulse in height while playing, and a scrubber progress line over the waveform.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17;gap:2px}.bar{width:4px;background:#22D3EE;border-radius:2px;animation:wave 1s ease-in-out infinite}@keyframes wave{50%{transform:scaleY(0.3)}}</style><script>document.write(Array.from({length:20},(_,i)=>'<div class="bar" style="height:'+(10+Math.random()*30)+'px;animation-delay:'+(i*0.05)+'s"></div>').join(''))<\/script>`,
  },
  {
    category: "UI Components",
    title: "Podcast Episode Card",
    promptText:
      "Create a podcast episode list item with a square cover thumbnail, episode title, show name, duration, and a circular play button that appears on hover.",
  },
  {
    category: "UI Components",
    title: "Sticky Mini Player Bar",
    promptText:
      "Build a slim audio/video mini-player bar fixed to the bottom of the screen showing the current track, a mini progress bar, and play/next/prev controls, expandable to a full player on click.",
  },
  {
    category: "UI Components",
    title: "Volume Slider with Icon Morph",
    promptText:
      "Create a volume control where the speaker icon morphs between muted, low, and full-volume states as a slider is dragged, using SVG path transitions or icon swapping.",
  },
  {
    category: "Buttons",
    title: "Play/Pause Morph Button",
    promptText:
      "Build a circular play button whose triangle icon smoothly morphs into a pause icon (two bars) when clicked, using an SVG path or clip-path transition rather than an abrupt icon swap.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.btn{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#22D3EE,#8B5CF6);border:none;cursor:pointer;color:#fff;font-size:20px}</style><button class="btn" onclick="this.textContent=this.textContent==='▶'?'❚❚':'▶'">▶</button>`,
  },

  // ---------- Calendar ----------
  {
    category: "UI Components",
    title: "Mini Calendar Date Picker",
    promptText:
      "Build a compact month-view calendar date picker with prev/next month arrows, today highlighted with a ring, and the selected date filled with a solid gradient circle.",
  },
  {
    category: "UI Components",
    title: "Event Timeline Card",
    promptText:
      "Create a day-schedule view where events are shown as colored blocks positioned and sized according to their start time and duration along a vertical hour timeline.",
  },
  {
    category: "UI Components",
    title: "Booking Time Slot Grid",
    promptText:
      "Build a grid of clickable time-slot buttons (e.g. 9:00, 9:30, 10:00...) for booking an appointment, where already-booked slots are disabled/greyed and the selected slot is highlighted.",
  },
  {
    category: "UI Components",
    title: "Availability Heatmap",
    promptText:
      "Create a GitHub-style contribution heatmap grid of small colored squares representing daily activity intensity over the past year, with a tooltip showing the exact count on hover.",
  },

  // ---------- Kanban / Productivity ----------
  {
    category: "UI Components",
    title: "Kanban Board Columns",
    promptText:
      "Build a 3-column Kanban board (To Do / In Progress / Done) with draggable cards between columns, a card count badge in each column header, and an 'Add card' link at the bottom of each column.",
  },
  {
    category: "UI Components",
    title: "Draggable Task Card",
    promptText:
      "Create a task card for a Kanban board with a title, small colored label tags, an assignee avatar, and a due-date pill, that lifts with a shadow while being dragged.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.card{width:200px;background:#141a24;border:1px solid #333;border-radius:12px;padding:12px;font-family:sans-serif;color:#fff}.tag{display:inline-block;font-size:10px;padding:2px 8px;border-radius:6px;background:#22D3EE22;color:#22D3EE;margin-bottom:8px}.title{font-size:13px;font-weight:600;margin-bottom:8px}.foot{display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#94A3B8}.av{width:20px;height:20px;border-radius:50%;background:#8B5CF6}</style><div class="card"><span class="tag">Frontend</span><div class="title">Build the pricing page</div><div class="foot"><span>Due Fri</span><div class="av"></div></div></div>`,
  },
  {
    category: "UI Components",
    title: "Todo List with Strike-through",
    promptText:
      "Build a to-do list where checking an item's checkbox animates a strike-through line across the text and fades its opacity, with a smooth transition rather than an instant change.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:8px;background:#0B0F17;font-family:sans-serif;color:#fff;padding-left:60px}label{display:flex;gap:8px;align-items:center;cursor:pointer}.txt{position:relative}.txt::after{content:'';position:absolute;left:0;top:50%;width:0;height:1px;background:#94A3B8;transition:.3s}input:checked~.txt{opacity:.5}input:checked~.txt::after{width:100%}</style><label><input type="checkbox"><span class="txt">Finish Rust case file</span></label><label><input type="checkbox" checked><span class="txt">Pass SQL quiz</span></label>`,
  },
  {
    category: "UI Components",
    title: "Habit Streak Grid",
    promptText:
      "Create a weekly habit-tracker grid of small squares (one per day) that fill in with a checkmark and gradient color when marked complete, showing a current streak count above it.",
  },
  {
    category: "Progress",
    title: "Sprint Progress Bar",
    promptText:
      "Build a segmented progress bar for a project sprint showing completed, in-progress, and remaining tasks as differently colored proportional segments in a single bar, with a legend below.",
  },

  // ---------- Social ----------
  {
    category: "UI Components",
    title: "Social Post Card with Reactions",
    promptText:
      "Create a social media post card with avatar, username, timestamp, post text, and a reaction bar (like, comment, share icons) where the like count animates up when clicked.",
  },
  {
    category: "Buttons",
    title: "Like Button Burst Animation",
    promptText:
      "Build a heart/like button that, on click, bursts several small heart particles outward and fading while the main icon fills solid, similar to Instagram's double-tap like animation.",
  },
  {
    category: "Buttons",
    title: "Follow Button State Toggle",
    promptText:
      "Create a 'Follow' button that switches to 'Following' (outlined, muted style) after clicking, reverting to a red 'Unfollow' state only when hovered while in the Following state.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.btn{padding:8px 20px;border-radius:8px;border:none;background:linear-gradient(90deg,#22D3EE,#8B5CF6);color:#fff;font-family:sans-serif;font-weight:600;cursor:pointer}.btn.following{background:transparent;border:1px solid #333;color:#94A3B8}.btn.following:hover{border-color:#ef4444;color:#ef4444}</style><button class="btn" onclick="this.classList.toggle('following');this.textContent=this.classList.contains('following')?'Following':'Follow'">Follow</button>`,
  },
  {
    category: "UI Components",
    title: "Threaded Comment List",
    promptText:
      "Build a nested comment thread UI where replies are indented under their parent comment with a connecting vertical line, including a 'Reply' link that reveals an inline reply input.",
  },
  {
    category: "UI Components",
    title: "Bottom Share Sheet",
    promptText:
      "Create a mobile-style share sheet that slides up from the bottom of the screen with a grid of app icons (copy link, twitter, whatsapp, email), dismissible by tapping the backdrop or swiping down.",
  },

  // ---------- Gaming ----------
  {
    category: "Progress",
    title: "XP Bar with Level-Up Flash",
    promptText:
      "Build an experience-points progress bar that fills smoothly, and when it reaches 100%, flashes/glows and resets to 0 while a 'Level Up!' badge briefly pops up above it.",
  },
  {
    category: "Notifications",
    title: "Achievement Unlock Toast",
    promptText:
      "Create a game-style achievement notification that slides in from the top with a trophy icon, gold shimmer border, and the achievement name, auto-dismissing after a few seconds.",
  },
  {
    category: "UI Components",
    title: "Leaderboard Rank List",
    promptText:
      "Build a leaderboard list with rank numbers, avatar, name, and score, where the top 3 rows get special gold/silver/bronze accent styling and slightly larger avatars.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;flex-direction:column;justify-content:center;gap:8px;background:#0B0F17;font-family:sans-serif;color:#fff;padding-left:40px}.row{display:flex;align-items:center;gap:10px;font-size:13px}.rank{width:20px;font-weight:800}.g{color:#F59E0B}.s{color:#cbd5e1}.b{color:#b45309}</style><div class="row"><span class="rank g">1</span> Agent Zero — 9,240</div><div class="row"><span class="rank s">2</span> Agent Vega — 8,110</div><div class="row"><span class="rank b">3</span> Agent Nova — 7,980</div>`,
  },
  {
    category: "UI Components",
    title: "Health/Mana Bar UI",
    promptText:
      "Create an RPG-style health bar with a red gradient fill that smoothly shrinks when damage is taken, briefly flashing white, plus a thin secondary bar showing the previous value catching down slowly.",
  },

  // ---------- Finance ----------
  {
    category: "UI Components",
    title: "Crypto Price Ticker",
    promptText:
      "Build a horizontal scrolling ticker of crypto/stock prices with green/red color coding and small up/down arrows for percentage change, auto-scrolling continuously like a stock exchange display.",
  },
  {
    category: "UI Components",
    title: "Stock Chart Card",
    promptText:
      "Create a card showing a stock symbol, current price, percentage change badge, and a simple animated SVG line chart of the past week's price movement filling in on load.",
  },
  {
    category: "UI Components",
    title: "Transaction List Item",
    promptText:
      "Build a bank/wallet transaction list row with a category icon in a colored circle, merchant name, date, and amount (green for income, red/default for expense) right-aligned.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;flex-direction:column;justify-content:center;gap:10px;background:#0B0F17;font-family:sans-serif;color:#fff;padding:0 40px}.row{display:flex;align-items:center;gap:10px}.ic{width:32px;height:32px;border-radius:50%;background:#22D3EE22;display:flex;align-items:center;justify-content:center}.name{flex:1;font-size:13px}.amt{font-weight:700}.pos{color:#22c55e}.neg{color:#f8fafc}</style><div class="row"><div class="ic">💼</div><div class="name">Freelance Payment</div><div class="amt pos">+$240.00</div></div><div class="row"><div class="ic">☕</div><div class="name">Coffee Shop</div><div class="amt neg">-$4.50</div></div>`,
  },
  {
    category: "UI Components",
    title: "Gradient Balance Card",
    promptText:
      "Design a bank-card-style balance display with a gradient background, card-number-style masked digits, and a small chip icon, resembling a physical debit/credit card.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.card{width:240px;height:140px;border-radius:18px;background:linear-gradient(135deg,#22D3EE,#8B5CF6);padding:20px;color:#fff;font-family:sans-serif;box-shadow:0 20px 40px rgba(0,0,0,.4)}.chip{width:30px;height:22px;border-radius:4px;background:rgba(255,255,255,.5);margin-bottom:30px}.num{letter-spacing:2px;font-size:14px}</style><div class="card"><div class="chip"></div><div class="num">•••• •••• •••• 4821</div><div style="margin-top:14px;font-size:12px;opacity:.8">Agent Zero</div></div>`,
  },
  {
    category: "Navigation",
    title: "Currency Switcher Dropdown",
    promptText:
      "Build a small currency-selector dropdown showing a flag icon and currency code, with a searchable list of currencies that appears below the button on click.",
  },

  // ---------- Education ----------
  {
    category: "Progress",
    title: "Course Progress Ring",
    promptText:
      "Create a circular progress ring showing percentage of a course completed, with the topic title in the center and a small 'Continue' button below it.",
  },
  {
    category: "UI Components",
    title: "Lesson Completion Checklist",
    promptText:
      "Build a vertical list of lesson titles each with a circular checkmark indicator that fills solid green when complete, connected by a vertical progress line that grows as lessons are finished.",
  },
  {
    category: "UI Components",
    title: "Quiz Answer Feedback Flash",
    promptText:
      "Create quiz answer buttons that flash green with a checkmark for the correct answer and red with an X for an incorrect selection immediately after the user picks one.",
  },
  {
    category: "UI Components",
    title: "Certificate Preview Card",
    promptText:
      "Design a certificate preview card with an ornate border, a ribbon/seal icon, recipient name, course title, and a 'Download PDF' button below it.",
  },

  // ---------- Travel ----------
  {
    category: "UI Components",
    title: "Flight Search Result Card",
    promptText:
      "Build a flight listing card showing departure/arrival times and airport codes connected by a dashed line with a plane icon, plus duration, stops, and price on the right.",
  },
  {
    category: "UI Components",
    title: "Destination Card with Overlay",
    promptText:
      "Create a travel destination card with a full-bleed background image, a dark gradient overlay at the bottom for legibility, and the city name plus a small price tag in the corner.",
  },
  {
    category: "UI Components",
    title: "Booking Confirmation Card",
    promptText:
      "Build a booking-confirmed card with a checkmark icon animation, booking reference number, and a summary of the trip details in a clean receipt-like layout.",
  },
  {
    category: "UI Components",
    title: "Trip Itinerary Timeline",
    promptText:
      "Create a vertical itinerary timeline for a multi-day trip, grouping activities under each day's date header, connected by a dotted line with time-stamped icons.",
  },

  // ---------- Restaurant ----------
  {
    category: "UI Components",
    title: "Restaurant Menu Item Card",
    promptText:
      "Build a menu item row with a small circular food photo, name, short description, price, and a '+' add button that briefly shows a checkmark after being tapped.",
  },
  {
    category: "Forms",
    title: "Table Reservation Form",
    promptText:
      "Create a reservation form with a party-size stepper, a date picker, and time-slot chip selector, culminating in a 'Confirm Reservation' button.",
  },
  {
    category: "UI Components",
    title: "Order Status Tracker",
    promptText:
      "Build a horizontal order-status tracker (Placed → Preparing → Out for Delivery → Delivered) with connected circles that fill in progressively and a moving delivery icon along the line.",
  },

  // ---------- Real Estate ----------
  {
    category: "UI Components",
    title: "Property Listing Card",
    promptText:
      "Create a real-estate listing card with an image, price badge overlay, address, and a small icon row showing bed/bath/sqft counts along the bottom.",
  },
  {
    category: "UI Components",
    title: "Price Range Dual Slider",
    promptText:
      "Build a dual-handle range slider for filtering by minimum and maximum price, with a highlighted track between the two handles and live-updating value labels above each handle.",
  },
  {
    category: "UI Components",
    title: "Map Pin Popup Card",
    promptText:
      "Create a small popup card that appears above a map pin marker showing a property thumbnail, price, and address, with a little triangular pointer connecting it to the pin.",
  },

  // ---------- Fitness ----------
  {
    category: "Progress",
    title: "Workout Ring Trio (Activity Rings)",
    promptText:
      "Build three concentric circular progress rings (like Apple Watch activity rings) in different colors representing move/exercise/stand goals, each animating its fill on load.",
  },
  {
    category: "UI Components",
    title: "Step Counter Widget",
    promptText:
      "Create a step-counter card with a large animated number counting up to the day's step total, a small footprint icon, and a thin progress bar showing progress toward a daily goal.",
  },
  {
    category: "UI Components",
    title: "Water Intake Tracker",
    promptText:
      "Build a water-intake tracker showing a glass/bottle icon that visually fills up from the bottom as the user taps '+1 cup', with a fraction label like '4/8 cups' updating live.",
  },

  // ---------- Forms ----------
  {
    category: "Forms",
    title: "OTP Verification Input Boxes",
    promptText:
      "Create a row of 6 individual single-digit input boxes for an OTP code, where typing a digit automatically focuses the next box, and backspace moves focus back to the previous one.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;gap:8px;background:#0B0F17}input{width:40px;height:48px;text-align:center;font-size:20px;border-radius:8px;border:1px solid #333;background:#141a24;color:#fff}</style><input maxlength="1" onkeyup="if(this.value)this.nextElementSibling?.focus()"><input maxlength="1" onkeyup="if(this.value)this.nextElementSibling?.focus()"><input maxlength="1" onkeyup="if(this.value)this.nextElementSibling?.focus()"><input maxlength="1" onkeyup="if(this.value)this.nextElementSibling?.focus()">`,
  },
  {
    category: "Forms",
    title: "Phone Input with Country Flag",
    promptText:
      "Build a phone-number input with a country-code dropdown (flag + dial code) attached to the left side of the field, filtering the dropdown list as the user types a country name.",
  },
  {
    category: "Forms",
    title: "Signature Pad Canvas",
    promptText:
      "Create a canvas-based signature pad where the user can draw their signature with mouse or touch, plus a 'Clear' button to reset the canvas.",
  },
  {
    category: "Forms",
    title: "Multi-Select Dropdown with Chips",
    promptText:
      "Build a dropdown that lets users select multiple options, rendering each selection as a removable chip inside the input field itself rather than a plain text value.",
  },
  {
    category: "Forms",
    title: "Date Range Picker",
    promptText:
      "Create a two-month calendar view for selecting a start and end date range, highlighting all days between the two selected dates with a connected background band.",
  },
  {
    category: "Forms",
    title: "Address Autocomplete Field",
    promptText:
      "Build a text input that shows a dropdown list of matching address suggestions as the user types, highlighting the matched substring in each suggestion.",
  },

  // ---------- Dev Tools ----------
  {
    category: "UI Components",
    title: "Terminal Prompt Typing Loop",
    promptText:
      "Create a fake terminal window UI that types out a sequence of commands character-by-character with a blinking cursor, pausing between each simulated command.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17;font-family:monospace}.term{background:#0d1117;border:1px solid #333;border-radius:10px;padding:16px;width:280px;color:#22c55e;font-size:12px}</style><div class="term">$ <span id="t"></span><span style="animation:blink 1s step-end infinite">▊</span></div><style>@keyframes blink{50%{opacity:0}}</style><script>const cmd='npm run dev';let i=0;function type(){if(i<=cmd.length){document.getElementById('t').textContent=cmd.slice(0,i++);setTimeout(type,100)}}type();<\/script>`,
  },
  {
    category: "UI Components",
    title: "Git Commit Graph",
    promptText:
      "Build a simplified git-branch commit graph visualization with colored dots representing commits connected by curved SVG lines showing branch and merge points.",
  },
  {
    category: "UI Components",
    title: "Side-by-Side Diff Viewer",
    promptText:
      "Create a two-column code diff viewer with removed lines highlighted in red on the left and added lines highlighted in green on the right, with line numbers in a gutter.",
  },
  {
    category: "UI Components",
    title: "JSON Response Tree Viewer",
    promptText:
      "Build a collapsible JSON tree viewer where objects and arrays can be expanded/collapsed by clicking a chevron, with syntax coloring for keys, strings, numbers, and booleans.",
  },
  {
    category: "UI Components",
    title: "Split Markdown Live Preview",
    promptText:
      "Create a split-pane editor where typing Markdown in the left textarea instantly renders formatted HTML output in the right pane, updating on every keystroke.",
  },
  {
    category: "UI Components",
    title: "Changelog Version Timeline",
    promptText:
      "Build a changelog page listing version entries (v2.1.0, v2.0.0, ...) each with a date, colored tag (Added/Fixed/Changed), and a bulleted list of changes underneath.",
  },

  // ---------- Navigation ----------
  {
    category: "Navigation",
    title: "Vertical Tab Sidebar",
    promptText:
      "Create a vertical tab list (like settings navigation) where the active tab has a colored left border indicator and slightly different background, smoothly transitioning when switching tabs.",
  },
  {
    category: "Navigation",
    title: "Full-Width Mega Menu Dropdown",
    promptText:
      "Build a navbar item that opens a full-width mega-menu dropdown panel below it containing multiple columns of links and a small promotional image or card on the right.",
  },
  {
    category: "Navigation",
    title: "Language Switcher Flag Dropdown",
    promptText:
      "Create a language selector button showing a flag and language code that opens a dropdown list of languages (each with its own flag), closing when a language is selected or clicked outside.",
  },
  {
    category: "Navigation",
    title: "Command Palette (Cmd+K)",
    promptText:
      "Build a command-palette overlay that opens with Cmd+K / Ctrl+K, showing a search input at top and a filtered list of actions/pages below that can be navigated with arrow keys and Enter.",
  },

  // ---------- Feedback ----------
  {
    category: "Forms",
    title: "Star Rating Review Form",
    promptText:
      "Create a review submission form combining a 5-star rating selector with a textarea for written feedback and a submit button that disables until a star rating is chosen.",
  },
  {
    category: "UI Components",
    title: "Emoji Reaction Picker",
    promptText:
      "Build a row of emoji reaction buttons that pop up on hovering a message, each emoji scaling up slightly on its own hover, with a running count shown once selected.",
  },
  {
    category: "Modals",
    title: "Bug Report Modal Form",
    promptText:
      "Create a bug-report modal with fields for a title, description, severity dropdown, and an optional screenshot drag-and-drop area, with a submit button showing a loading spinner while sending.",
  },
  {
    category: "UI Components",
    title: "NPS Survey Slider",
    promptText:
      "Build a 'How likely are you to recommend us?' survey with a 0-10 numbered button row, color-coded from red (low) to green (high), and a follow-up comment box that appears after selection.",
  },

  // ---------- Content ----------
  {
    category: "UI Components",
    title: "Avatar Testimonial Carousel",
    promptText:
      "Create a testimonial carousel where a large quote and customer avatar/name cross-fade between entries, with small avatar thumbnails below acting as navigation dots.",
  },
  {
    category: "UI Components",
    title: "FAQ Live Search Filter",
    promptText:
      "Build an FAQ page with a search input at the top that live-filters the list of questions below as the user types, highlighting the matching text within each question.",
  },
  {
    category: "UI Components",
    title: "Roadmap Kanban Timeline",
    promptText:
      "Create a product roadmap view with three columns (Now / Next / Later) containing feature cards, each card showing a short description and a small status tag.",
  },
  {
    category: "UI Components",
    title: "Changelog Filter Tabs",
    promptText:
      "Build changelog filter tabs (All / Features / Fixes / Improvements) above a list of entries, where selecting a tab animates a sliding underline and filters the visible entries.",
  },

  // ---------- Misc UI ----------
  {
    category: "UI Components",
    title: "Emoji Picker Grid",
    promptText:
      "Create an emoji picker popover with category tabs at the top and a scrollable grid of emoji buttons below, each emoji scaling up slightly on hover.",
  },
  {
    category: "UI Components",
    title: "@Mention Autocomplete Dropdown",
    promptText:
      "Build a text input where typing '@' opens a small dropdown list of matching usernames below the cursor, inserting the selected mention as a styled inline chip when chosen.",
  },
  {
    category: "UI Components",
    title: "Rich Text Editor Toolbar",
    promptText:
      "Create a floating text-formatting toolbar (bold, italic, underline, link) that appears above selected text in an editable area, positioned dynamically based on the text selection.",
  },
  {
    category: "Navigation",
    title: "Sticky Filter/Sort Bar",
    promptText:
      "Build a filter and sort control bar that sticks to the top of a product/content list as the user scrolls past it, showing active filter count as a small badge on the Filters button.",
  },
  {
    category: "Loaders",
    title: "Infinite Scroll Loading Trigger",
    promptText:
      "Create a list that automatically loads more items with a spinner shown at the bottom as the user scrolls near the end, using Intersection Observer to trigger the next page fetch.",
  },
  {
    category: "UI Components",
    title: "Masonry Photo Grid",
    promptText:
      "Build a Pinterest-style masonry photo grid where images of varying heights are arranged in balanced columns without gaps, using CSS columns or a JS packing algorithm.",
  },
  {
    category: "UI Components",
    title: "Image Lightbox Zoom Viewer",
    promptText:
      "Create a lightbox that opens a clicked thumbnail into a full-screen darkened overlay with the enlarged image centered, supporting next/prev arrows and closing on backdrop click or Escape.",
  },
  {
    category: "UI Components",
    title: "PDF Viewer Toolbar",
    promptText:
      "Build a PDF-viewer style toolbar with page-number input, zoom in/out buttons with a percentage display, and download/print icon buttons, styled as a slim dark header bar.",
  },
  {
    category: "UI Components",
    title: "File Tree Explorer",
    promptText:
      "Create a collapsible file/folder tree view (like a code editor sidebar) with folder icons that rotate a chevron when expanded, and file-type icons that vary by file extension.",
  },
  {
    category: "UI Components",
    title: "Org Chart Tree Diagram",
    promptText:
      "Build a simple organizational chart with a top-level box connected by lines down to several subordinate boxes, each showing a name and title, laid out with CSS Grid or Flexbox.",
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
  console.log(`Seeded ${PROMPTS.length} more example prompts (batch 8 — mega batch).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
