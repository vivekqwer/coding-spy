import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROMPTS: {
  category: string;
  title: string;
  promptText: string;
  previewHtml?: string;
}[] = [
  // ---------- Maps & Location ----------
  {
    category: "UI Components",
    title: "Map Marker Pulse Pin",
    promptText:
      "Build a map location pin with a continuous pulsing ring animation expanding outward from its base, indicating a live/current location on a map.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.pin{position:relative;width:16px;height:16px;border-radius:50%;background:#22D3EE;box-shadow:0 0 0 4px #0B0F17}.pin::after{content:'';position:absolute;inset:-8px;border-radius:50%;border:2px solid #22D3EE;animation:p 1.6s infinite}@keyframes p{to{transform:scale(2.2);opacity:0}}</style><div class="pin"></div>`,
  },
  {
    category: "UI Components",
    title: "Nearby Places Bottom Sheet",
    promptText:
      "Create a bottom-sheet panel over a map view listing nearby places with distance and rating, draggable to expand from a peek height to full-screen.",
  },
  {
    category: "UI Components",
    title: "Route Direction Steps List",
    promptText:
      "Build a turn-by-turn direction list with a small directional arrow icon per step, distance, and street name, highlighting the current step as the user progresses.",
  },
  {
    category: "UI Components",
    title: "Location Search Autocomplete Dropdown",
    promptText:
      "Create a location search input showing a dropdown of matching place suggestions with a pin icon and secondary address text, updating live as the user types.",
  },
  {
    category: "UI Components",
    title: "Live Location Sharing Avatar Trail",
    promptText:
      "Build a map view showing a moving avatar marker that leaves a fading trail line behind it representing recent movement history, updating position smoothly.",
  },

  // ---------- File Manager ----------
  {
    category: "UI Components",
    title: "Grid/List View Toggle for Files",
    promptText:
      "Build a file browser with a toggle button switching between grid view (thumbnail tiles) and list view (rows with metadata columns), animating the layout transition.",
  },
  {
    category: "UI Components",
    title: "File Upload Progress List",
    promptText:
      "Create a file-upload panel showing multiple files each with its own progress bar, a cancel icon per file, and a checkmark replacing the bar once upload completes.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;flex-direction:column;justify-content:center;gap:10px;background:#0B0F17;padding:0 40px;font-family:sans-serif;color:#fff;font-size:12px}.row{display:flex;flex-direction:column;gap:4px}.track{height:6px;background:#1e293b;border-radius:3px;overflow:hidden}.fill{height:100%;background:linear-gradient(90deg,#22D3EE,#8B5CF6);width:70%}</style><div class="row">report.pdf<div class="track"><div class="fill"></div></div></div><div class="row">photo.png ✓</div>`,
  },
  {
    category: "UI Components",
    title: "Folder Breadcrumb Navigation",
    promptText:
      "Build a folder-path breadcrumb bar with clickable segments separated by chevrons, truncating middle segments into a '...' dropdown when the path is too long.",
  },
  {
    category: "UI Components",
    title: "File Type Icon Set Grid",
    promptText:
      "Create a file grid where each item shows a distinct colored icon based on file extension (PDF, DOCX, image, zip), with the filename truncated below the icon.",
  },

  // ---------- Email Client ----------
  {
    category: "UI Components",
    title: "Inbox List with Swipe Actions",
    promptText:
      "Build an email inbox list row that reveals archive/delete action buttons when swiped left, snapping back if not fully swiped, with unread emails shown bold with a blue dot.",
  },
  {
    category: "UI Components",
    title: "Compose Email Floating Window",
    promptText:
      "Create a minimizable email-compose window fixed to the bottom-right corner with To/Subject/Body fields, that can be minimized to just a title bar and expanded again.",
  },
  {
    category: "UI Components",
    title: "Email Label/Folder Sidebar",
    promptText:
      "Build an email sidebar listing folders (Inbox, Sent, Drafts) and colored labels, each with an unread-count badge, highlighting the currently active folder.",
  },
  {
    category: "UI Components",
    title: "Attachment Chip Preview Row",
    promptText:
      "Create a row of attachment chips below an email compose body, each showing a file-type icon, filename, size, and a small 'x' remove button.",
  },
  {
    category: "UI Components",
    title: "Snooze Email Time Picker",
    promptText:
      "Build a 'Snooze until' popover with preset options (Later Today, Tomorrow, Next Week) plus a custom date/time picker, triggered from a clock icon on an email row.",
  },

  // ---------- Recipe & Cooking ----------
  {
    category: "UI Components",
    title: "Recipe Card with Cook Time Badge",
    promptText:
      "Build a recipe card with a food photo, title, a small badge row showing prep time, cook time, and servings icons, and a bookmark button in the corner.",
  },
  {
    category: "UI Components",
    title: "Ingredient Checklist with Servings Scaler",
    promptText:
      "Create an ingredient checklist where each item has a checkbox, and a servings stepper above that recalculates all ingredient quantities proportionally when changed.",
  },
  {
    category: "UI Components",
    title: "Step-by-Step Cooking Mode",
    promptText:
      "Build a full-screen 'cooking mode' view showing one recipe step at a time in large text with next/prev arrows and a built-in timer button for steps that need one.",
  },
  {
    category: "UI Components",
    title: "Nutrition Facts Bar Breakdown",
    promptText:
      "Create a nutrition breakdown widget showing protein/carbs/fat as a segmented horizontal bar with percentages, plus total calories displayed above.",
  },

  // ---------- Pet Care ----------
  {
    category: "UI Components",
    title: "Pet Profile Card",
    promptText:
      "Build a pet profile card with a circular photo, name, breed, age, and small icon stats row (weight, last vet visit), styled playfully with rounded shapes.",
  },
  {
    category: "UI Components",
    title: "Vaccination Schedule Timeline",
    promptText:
      "Create a vertical vaccination timeline for a pet showing past (checked) and upcoming (outlined) vaccine entries connected by a line, with dates labeled.",
  },
  {
    category: "UI Components",
    title: "Walk Tracker Map Stat Card",
    promptText:
      "Build a dog-walk summary card showing distance walked, duration, and a simplified route-line map preview, with a paw-print icon accent.",
  },

  // ---------- Parenting & Baby ----------
  {
    category: "UI Components",
    title: "Baby Feeding/Sleep Log Timeline",
    promptText:
      "Create a daily log timeline for a baby-tracking app showing feeding, sleep, and diaper-change entries as colored blocks along a 24-hour vertical timeline.",
  },
  {
    category: "UI Components",
    title: "Growth Percentile Chart Card",
    promptText:
      "Build a baby growth-chart card with an SVG line plotting height/weight over time against percentile curve bands shown as shaded regions.",
  },
  {
    category: "UI Components",
    title: "Milestone Checklist Cards",
    promptText:
      "Create a milestone tracker with cards for each developmental milestone (First Smile, First Steps) that flip or reveal a date-achieved stamp once marked complete.",
  },

  // ---------- Language Learning ----------
  {
    category: "UI Components",
    title: "Flashcard Flip Animation",
    promptText:
      "Build a vocabulary flashcard that flips with a 3D rotation to reveal the translation on the back when clicked or swiped, using CSS perspective and backface-visibility.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17;perspective:800px}.card{width:160px;height:100px;position:relative;transform-style:preserve-3d;transition:.6s;cursor:pointer}.card.flip{transform:rotateY(180deg)}.face{position:absolute;inset:0;backface-visibility:hidden;display:flex;align-items:center;justify-content:center;border-radius:12px;font-family:sans-serif;color:#fff;font-size:16px;font-weight:700}.front{background:linear-gradient(135deg,#22D3EE,#8B5CF6)}.back{background:#141a24;border:1px solid #333;transform:rotateY(180deg)}</style><div class="card" onclick="this.classList.toggle('flip')"><div class="face front">Bonjour</div><div class="face back">Hello</div></div>`,
  },
  {
    category: "UI Components",
    title: "Lesson Path Progress Map",
    promptText:
      "Create a winding lesson-path map (like a game board) with circular nodes for each lesson connected by a curved dashed line, current lesson highlighted and glowing.",
  },
  {
    category: "UI Components",
    title: "XP Streak Flame Counter",
    promptText:
      "Build a streak counter showing a flame icon next to a day count, with the flame glowing brighter/larger as the streak number increases, resetting with a dimmed grey flame if broken.",
  },
  {
    category: "UI Components",
    title: "Pronunciation Waveform Comparison",
    promptText:
      "Create a side-by-side waveform comparison showing the target pronunciation waveform above and the user's recorded attempt waveform below, for a speaking-practice exercise.",
  },

  // ---------- Music Production ----------
  {
    category: "UI Components",
    title: "DAW Track Mixer Channel Strip",
    promptText:
      "Build a mixer channel strip UI with a vertical volume fader, pan knob, mute/solo buttons, and a small level meter bar beside the fader.",
  },
  {
    category: "UI Components",
    title: "Step Sequencer Grid",
    promptText:
      "Create a drum-machine step-sequencer grid of toggleable beat cells across multiple instrument rows, with the currently playing step column highlighted as it advances.",
  },
  {
    category: "UI Components",
    title: "Knob Rotary Control",
    promptText:
      "Build a rotary knob control (like a synth parameter) that rotates visually as the user drags vertically, with a small value readout appearing above it while dragging.",
  },
  {
    category: "UI Components",
    title: "Waveform Editor Selection Region",
    promptText:
      "Create an audio waveform editor where the user can drag to select a region, highlighting the selected portion with a semi-transparent overlay and draggable edge handles.",
  },

  // ---------- AR/VR ----------
  {
    category: "UI Components",
    title: "AR View Corner Bracket Overlay",
    promptText:
      "Build an AR-scanning overlay UI with animated corner brackets on each corner of a square viewfinder area, plus a scanning line that moves up and down within it.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.frame{width:180px;height:180px;position:relative}.c{position:absolute;width:24px;height:24px;border:3px solid #22D3EE}.tl{top:0;left:0;border-right:none;border-bottom:none}.tr{top:0;right:0;border-left:none;border-bottom:none}.bl{bottom:0;left:0;border-right:none;border-top:none}.br{bottom:0;right:0;border-left:none;border-top:none}.scan{position:absolute;left:0;width:100%;height:2px;background:#22D3EE;animation:s 2s linear infinite;box-shadow:0 0 8px #22D3EE}@keyframes s{0%{top:0}50%{top:calc(100% - 2px)}100%{top:0}}</style><div class="frame"><div class="c tl"></div><div class="c tr"></div><div class="c bl"></div><div class="c br"></div><div class="scan"></div></div>`,
  },
  {
    category: "UI Components",
    title: "VR Menu Floating Panel",
    promptText:
      "Create a floating glassmorphic VR-style menu panel with large touch-friendly icon buttons arranged in an arc, suitable for a spatial-computing interface mockup.",
  },
  {
    category: "UI Components",
    title: "3D Object Rotation Gizmo",
    promptText:
      "Build a 3D-viewer rotation control widget (small cube or sphere gizmo in the corner) that visually indicates the current camera orientation and can be clicked to snap to standard views.",
  },

  // ---------- Accessibility ----------
  {
    category: "UI Components",
    title: "Accessibility Settings Panel",
    promptText:
      "Build an accessibility settings panel with toggles for high-contrast mode, larger text size, reduced motion, and a live preview box showing the effect of each setting.",
  },
  {
    category: "UI Components",
    title: "Focus-Visible Ring Indicator",
    promptText:
      "Create a set of interactive buttons that show a clear, high-contrast focus ring only when navigated via keyboard (Tab key), not on mouse click, using :focus-visible.",
  },
  {
    category: "UI Components",
    title: "Text Size Adjuster Stepper",
    promptText:
      "Build a floating text-size adjustment widget with A-/A+ buttons that scale the page's font size up/down within defined limits, showing the current size level.",
  },

  // ---------- Space & Astronomy ----------
  {
    category: "Backgrounds",
    title: "Twinkling Starfield Background",
    promptText:
      "Create a full-page dark background covered in small randomly-placed dots that twinkle (fade in/out) at staggered intervals, simulating a starfield.",
    previewHtml: `<style>body{margin:0;height:100vh;background:#05070d;position:relative;overflow:hidden}.star{position:absolute;width:2px;height:2px;background:#fff;border-radius:50%;animation:tw 2s infinite}@keyframes tw{50%{opacity:.1}}</style><script>document.write(Array.from({length:60},()=>'<div class="star" style="top:'+(Math.random()*100)+'%;left:'+(Math.random()*100)+'%;animation-delay:'+(Math.random()*2)+'s"></div>').join(''))<\/script>`,
  },
  {
    category: "UI Components",
    title: "Planet Orbit Info Card",
    promptText:
      "Build a card for a planet showing a circular planet icon, name, and key stats (distance from sun, moons, day length) with a subtle rotating ring animation around the icon.",
  },
  {
    category: "UI Components",
    title: "Rocket Launch Countdown",
    promptText:
      "Create a mission-launch countdown display with a large T-minus timer, mission name, and a status label (Go/Hold) that changes color based on launch status.",
  },

  // ---------- Insurance ----------
  {
    category: "UI Components",
    title: "Insurance Quote Slider Calculator",
    promptText:
      "Build a quote calculator with sliders for coverage amount and deductible that live-update an estimated monthly premium display as they're adjusted.",
  },
  {
    category: "UI Components",
    title: "Claim Status Tracker",
    promptText:
      "Create a claim-status stepper (Submitted → Under Review → Approved → Paid) with icons per stage and an estimated completion date shown beneath the active stage.",
  },
  {
    category: "UI Components",
    title: "Policy Document Card List",
    promptText:
      "Build a list of policy document cards each showing policy type icon, policy number, expiry date with a colored badge if expiring soon, and a download button.",
  },

  // ---------- Inventory & Warehouse ----------
  {
    category: "UI Components",
    title: "Stock Level Indicator Bar",
    promptText:
      "Create an inventory row with a small horizontal stock-level bar colored green/amber/red based on remaining quantity relative to a reorder threshold.",
  },
  {
    category: "UI Components",
    title: "Barcode Scan Input Field",
    promptText:
      "Build a barcode-entry input styled with a scanner-line icon that, on receiving input, briefly flashes green and auto-submits, simulating a barcode scanner workflow.",
  },
  {
    category: "UI Components",
    title: "Warehouse Bin Location Grid",
    promptText:
      "Create a grid-map of warehouse storage bins where each cell is colored by occupancy level and shows a bin code label, with a hover tooltip showing item details.",
  },
  {
    category: "UI Components",
    title: "Purchase Order Status Badge Row",
    promptText:
      "Build a purchase-order list where each row has a colored status badge (Draft/Sent/Received/Cancelled), supplier name, and total amount, sortable by column headers.",
  },

  // ---------- Retail POS ----------
  {
    category: "UI Components",
    title: "POS Numeric Keypad",
    promptText:
      "Create a point-of-sale numeric keypad with large touch-friendly digit buttons and a running total display above, plus clear and enter action buttons.",
  },
  {
    category: "UI Components",
    title: "Cart Line Item with Quantity Stepper",
    promptText:
      "Build a POS cart line item row with product name, a quantity stepper (-/+), unit price, and line total that updates instantly as quantity changes.",
  },
  {
    category: "UI Components",
    title: "Payment Method Tile Selector",
    promptText:
      "Create a grid of payment-method tiles (Cash, Card, UPI, Wallet) each with an icon, highlighting the selected tile with a colored border and checkmark.",
  },
  {
    category: "UI Components",
    title: "Receipt Print Preview Card",
    promptText:
      "Build a receipt preview styled like a printed paper strip with a dashed/torn edge effect at the bottom, listing items, tax, and total in a monospace font.",
  },

  // ---------- Hotel Booking ----------
  {
    category: "UI Components",
    title: "Room Type Comparison Card",
    promptText:
      "Build a hotel room-type card with an image, amenities icon row (WiFi, breakfast, AC), price per night, and a 'Select Room' button.",
  },
  {
    category: "UI Components",
    title: "Guest Count Stepper Popover",
    promptText:
      "Create a guests/rooms selector popover with separate steppers for adults, children, and rooms, showing a summary label on the trigger button (e.g. '2 Guests, 1 Room').",
  },
  {
    category: "UI Components",
    title: "Amenity Icon Filter Row",
    promptText:
      "Build a horizontal row of amenity filter toggle icons (Pool, Gym, Parking, Pet-friendly) that highlight when active and filter the hotel list below.",
  },
  {
    category: "UI Components",
    title: "Booking Summary Sticky Sidebar",
    promptText:
      "Create a sticky booking-summary sidebar showing selected room, dates, price breakdown, and taxes, remaining fixed in view as the page content scrolls.",
  },

  // ---------- Coworking & Booking ----------
  {
    category: "UI Components",
    title: "Desk/Room Availability Grid",
    promptText:
      "Build a coworking-space floor plan grid showing individual desks/rooms colored by availability status (available/booked/reserved), clickable to open a booking modal.",
  },
  {
    category: "UI Components",
    title: "Time Slot Booking Calendar Grid",
    promptText:
      "Create a weekly calendar grid for booking meeting-room time slots, where dragging across cells selects a time range and shows a live duration label.",
  },
  {
    category: "UI Components",
    title: "Membership Plan Toggle Cards",
    promptText:
      "Build coworking membership plan cards (Hot Desk / Dedicated Desk / Private Office) with feature checklists, highlighting the recommended plan.",
  },

  // ---------- Library & Books ----------
  {
    category: "UI Components",
    title: "Book Spine Shelf Row",
    promptText:
      "Create a horizontal bookshelf row displaying books as colored vertical spine rectangles with title text rotated vertically, scaling up slightly on hover to reveal the cover.",
  },
  {
    category: "UI Components",
    title: "Reading Progress Bookmark Ribbon",
    promptText:
      "Build a book cover thumbnail with a ribbon-style bookmark tab showing the percentage read, positioned at the top of the cover image.",
  },
  {
    category: "UI Components",
    title: "Due Date Reminder Badge",
    promptText:
      "Create a borrowed-book list item with a due-date badge that turns amber within 3 days of the due date and red once overdue, with a renew button appearing conditionally.",
  },

  // ---------- Museum & Art ----------
  {
    category: "UI Components",
    title: "Exhibit Info Hotspot Overlay",
    promptText:
      "Build an image of an artwork with small circular numbered hotspot markers overlaid at points of interest, opening an info tooltip when clicked.",
  },
  {
    category: "UI Components",
    title: "Audio Guide Track List",
    promptText:
      "Create a museum audio-guide track list with exhibit number, title, duration, and a play button, highlighting the currently playing track.",
  },
  {
    category: "UI Components",
    title: "Gallery Floor Map Navigator",
    promptText:
      "Build a simplified museum floor-plan map with clickable room sections that highlight and scroll to the corresponding exhibit list when selected.",
  },

  // ---------- Concert Ticketing ----------
  {
    category: "UI Components",
    title: "Seat Map Selector Grid",
    promptText:
      "Create an interactive seat-map grid where seats are colored by price tier and availability, letting users click to select seats which then highlight and add to a summary panel.",
  },
  {
    category: "UI Components",
    title: "Ticket Stub Card Design",
    promptText:
      "Build a ticket-stub styled card with a perforated-edge divider between the main info section and a tear-off stub section showing a QR code.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0B0F17}.ticket{display:flex;background:#141a24;border-radius:12px;overflow:hidden;font-family:sans-serif;color:#fff}.main{padding:16px 20px;width:160px}.stub{width:70px;background:#1e293b;border-left:2px dashed #475569;display:flex;align-items:center;justify-content:center;font-size:24px}</style><div class="ticket"><div class="main"><div style="font-size:11px;color:#94A3B8">CONCERT</div><div style="font-weight:700">Synthwave Night</div></div><div class="stub">▦</div></div>`,
  },
  {
    category: "UI Components",
    title: "Countdown to Event Ticket Banner",
    promptText:
      "Build a purchased-ticket banner showing event name, date, and a live countdown timer to the event, with a 'View Ticket' button that opens the QR code full-screen.",
  },
  {
    category: "UI Components",
    title: "Artist Lineup Timeline",
    promptText:
      "Create a festival lineup schedule showing multiple stages as columns and time slots as rows, with artist name blocks positioned and sized by their performance duration.",
  },

  // ---------- Print & Invoice ----------
  {
    category: "UI Components",
    title: "Invoice Line Items Table",
    promptText:
      "Build a printable invoice layout with a header (logo, invoice number, date), a line-items table with quantity/rate/amount columns, and a totals summary block aligned to the right.",
  },
  {
    category: "UI Components",
    title: "Business Card Preview Design",
    promptText:
      "Create a front/back business-card preview pair side by side with a subtle drop shadow, showing a flip button that rotates between front and back designs.",
  },
  {
    category: "UI Components",
    title: "Watermark Overlay Preview",
    promptText:
      "Build a document preview with a diagonal repeating 'DRAFT' or 'CONFIDENTIAL' watermark text overlay at low opacity across the page background.",
  },
  {
    category: "UI Components",
    title: "Print Layout Page Size Selector",
    promptText:
      "Create a print-settings panel with selectable page-size thumbnails (A4, Letter, A5) that visually resize a preview page outline to match the chosen ratio.",
  },

  // ---------- Government & Civic ----------
  {
    category: "UI Components",
    title: "Application Reference Number Card",
    promptText:
      "Build a government-service application confirmation card showing a large reference number, a copy button, and a status stepper for tracking processing stages.",
  },
  {
    category: "UI Components",
    title: "Public Service Directory Search",
    promptText:
      "Create a searchable directory of public services with category icon filters and a results list showing office name, address, and hours.",
  },
  {
    category: "UI Components",
    title: "Voting Ballot Selection Card",
    promptText:
      "Build a sample ballot UI listing candidates as selectable radio-style cards with photo, name, and party, highlighting the selected candidate distinctly.",
  },

  // ---------- Real-time Collaboration ----------
  {
    category: "UI Components",
    title: "Live Cursor Presence Avatars",
    promptText:
      "Create a document-editing UI showing other users' cursor positions as small colored labeled pointers moving in real time, plus a stack of avatar circles showing who's currently viewing.",
  },
  {
    category: "UI Components",
    title: "Comment Thread Pin on Canvas",
    promptText:
      "Build a design-tool style comment pin (small numbered circle) placed on a canvas element that opens a comment thread popover when clicked.",
  },
  {
    category: "UI Components",
    title: "Version History Timeline Sidebar",
    promptText:
      "Create a document version-history sidebar listing timestamped snapshots grouped by day, each showing the editor's avatar and a 'Restore' link on hover.",
  },
  {
    category: "UI Components",
    title: "Live Editing 'Someone is typing' Banner",
    promptText:
      "Build a subtle banner notification showing avatar(s) and 'X is editing this document' text that appears at the top of a collaborative document when another user starts typing.",
  },

  // ---------- Whiteboard & Drawing ----------
  {
    category: "UI Components",
    title: "Drawing Tool Floating Toolbar",
    promptText:
      "Create a floating vertical toolbar for a whiteboard app with tool icons (pen, shapes, text, eraser) where the active tool is highlighted with a colored background pill.",
  },
  {
    category: "UI Components",
    title: "Color and Stroke Width Picker",
    promptText:
      "Build a drawing-tool settings popover with a row of color swatches and a stroke-width slider that live-previews the selected thickness as a growing dot.",
  },
  {
    category: "UI Components",
    title: "Sticky Note Board Grid",
    promptText:
      "Create a freeform sticky-note board where colored note cards can be repositioned by dragging, each note having an editable text area and a small color-tag selector.",
  },
  {
    category: "UI Components",
    title: "Canvas Zoom Controls Widget",
    promptText:
      "Build a bottom-corner zoom control widget with +/- buttons, a percentage display, and a 'Fit to screen' button for a whiteboard/canvas application.",
  },

  // ---------- Time Tracking ----------
  {
    category: "UI Components",
    title: "Timer Start/Stop Widget",
    promptText:
      "Build a time-tracking widget with a large running timer display, a project/task label, and a single button that toggles between 'Start' (green) and 'Stop' (red) states.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:#0B0F17;font-family:sans-serif;color:#fff}.time{font-size:28px;font-weight:700;font-variant-numeric:tabular-nums}button{padding:10px 24px;border-radius:8px;border:none;font-weight:600;cursor:pointer}.start{background:#22c55e;color:#fff}</style><div class="time">00:12:47</div><button class="start" onclick="this.textContent=this.textContent==='Start'?'Stop':'Start';this.style.background=this.textContent==='Stop'?'#ef4444':'#22c55e'">Stop</button>`,
  },
  {
    category: "UI Components",
    title: "Weekly Timesheet Grid",
    promptText:
      "Create a weekly timesheet grid with days as columns and projects as rows, each cell an editable hours input, with a running total column and row summary.",
  },
  {
    category: "UI Components",
    title: "Idle Time Detection Prompt",
    promptText:
      "Build a modal that appears after detecting inactivity while a timer is running, asking whether to keep or discard the idle time, showing the idle duration.",
  },
  {
    category: "UI Components",
    title: "Billable Hours Summary Donut",
    promptText:
      "Create a donut chart splitting billable vs non-billable hours for the week, with a legend showing exact hour totals and percentages for each segment.",
  },

  // ---------- Password Manager ----------
  {
    category: "UI Components",
    title: "Password Strength Meter Bar",
    promptText:
      "Build a password input with a strength-meter bar beneath it that fills and changes color (red/amber/green) in real time as the user types, with a text label like 'Strong'.",
    previewHtml: `<style>body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:#0B0F17;font-family:sans-serif}input{padding:8px 12px;border-radius:8px;border:1px solid #333;background:#141a24;color:#fff}.track{width:200px;height:6px;background:#1e293b;border-radius:3px;overflow:hidden}.fill{height:100%;width:80%;background:#22c55e}</style><input value="••••••••••" readonly><div class="track"><div class="fill"></div></div><span style="color:#22c55e;font-size:12px;font-family:sans-serif">Strong</span>`,
  },
  {
    category: "UI Components",
    title: "Vault Item List with Reveal Toggle",
    promptText:
      "Create a saved-password list row with a masked password field and an eye-icon toggle to reveal/hide the actual value, plus a copy-to-clipboard button.",
  },
  {
    category: "UI Components",
    title: "Biometric Unlock Prompt Screen",
    promptText:
      "Build a full-screen unlock prompt with a large fingerprint/face-icon that pulses while waiting, transitioning to a checkmark success animation on unlock.",
  },

  // ---------- Sustainability & Eco ----------
  {
    category: "UI Components",
    title: "Carbon Footprint Gauge",
    promptText:
      "Build a semi-circular gauge showing a carbon-footprint score with color zones from green (low) to red (high) and a needle pointing to the current value.",
  },
  {
    category: "UI Components",
    title: "Recycling Category Sort Game",
    promptText:
      "Create a drag-and-drop UI where item icons must be dragged into the correct colored recycling bin (paper/plastic/glass), showing a success bounce animation on a correct match.",
  },
  {
    category: "UI Components",
    title: "Eco Impact Stats Comparison Card",
    promptText:
      "Build a card comparing an eco-friendly choice's impact (e.g. 'You saved 2kg CO2') against a baseline, with a small animated bar or leaf-icon fill representing the saved amount.",
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
  console.log(`Seeded ${PROMPTS.length} more example prompts (batch 10 — mega batch).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
