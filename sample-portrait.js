// Sample corporate portraits embedded as high-resolution SVG Data URIs
// Ensures 100% zero-dependency, zero-installation offline functionality

const SAMPLE_PORTRAITS = [
  {
    id: "sample1",
    name: "Sarah Jenkins",
    location: "Chicago Office",
    reason: "Sold 200 policies in 2 days",
    copy1: "Sold 200 Policies in 2 Days",
    copy2: "Delivered Exceptional Sales Momentum",
    // Professional female corporate portrait SVG
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 550" width="400" height="550">
      <defs>
        <linearGradient id="skin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23fed7aa"/>
          <stop offset="100%" stop-color="%23fbb06e"/>
        </linearGradient>
        <linearGradient id="hair" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="%23271a15"/>
          <stop offset="100%" stop-color="%231a100b"/>
        </linearGradient>
        <linearGradient id="suit" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="%231e293b"/>
          <stop offset="100%" stop-color="%230f172a"/>
        </linearGradient>
        <linearGradient id="shirt" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="%23ffffff"/>
          <stop offset="100%" stop-color="%23e2e8f0"/>
        </linearGradient>
        <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.25"/>
        </filter>
      </defs>
      
      <!-- Torso / Suit -->
      <path d="M 70 550 C 70 420 110 370 145 355 L 200 460 L 255 355 C 290 370 330 420 330 550 Z" fill="url(%23suit)" filter="url(%23soft-shadow)"/>
      <path d="M 145 355 L 200 455 L 160 550 L 70 550 C 70 420 110 370 145 355 Z" fill="%23334155"/>
      
      <!-- Blouse / Inner Shirt -->
      <polygon points="160,350 200,430 240,350 200,365" fill="url(%23shirt)"/>
      
      <!-- Pearl Necklace -->
      <ellipse cx="200" cy="340" rx="35" ry="12" fill="none" stroke="%23ffffff" stroke-width="4" stroke-dasharray="6,3"/>
      
      <!-- Neck -->
      <rect x="175" y="270" width="50" height="70" rx="10" fill="url(%23skin)"/>
      <path d="M 175 320 C 185 335 215 335 225 320 Z" fill="%23ea580c" opacity="0.15"/>
      
      <!-- Back Hair -->
      <path d="M 115 160 C 115 80 285 80 285 160 C 285 240 295 360 270 410 C 255 435 245 440 230 440 C 215 440 205 380 200 370 C 195 380 185 440 170 440 C 155 440 145 435 130 410 C 105 360 115 240 115 160 Z" fill="url(%23hair)"/>
      
      <!-- Head Base -->
      <ellipse cx="200" cy="210" rx="68" ry="85" fill="url(%23skin)" filter="url(%23soft-shadow)"/>
      
      <!-- Front Hair / Styling -->
      <path d="M 132 170 C 135 110 175 90 200 90 C 235 90 268 115 268 170 C 250 140 220 130 185 140 C 155 148 140 160 132 170 Z" fill="url(%23hair)"/>
      <path d="M 132 170 C 128 210 130 260 140 285 C 145 250 145 200 155 170 Z" fill="url(%23hair)"/>
      <path d="M 268 170 C 272 210 270 260 260 285 C 255 250 255 200 245 170 Z" fill="url(%23hair)"/>
      
      <!-- Eyebrows -->
      <path d="M 155 175 Q 170 168 185 174" stroke="%23382319" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M 215 174 Q 230 168 245 175" stroke="%23382319" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      
      <!-- Eyes -->
      <ellipse cx="170" cy="190" rx="10" ry="7" fill="%23ffffff"/>
      <circle cx="170" cy="190" r="5" fill="%23382319"/>
      <circle cx="172" cy="188" r="1.5" fill="%23ffffff"/>
      <path d="M 160 188 Q 170 182 180 188" stroke="%231e293b" stroke-width="2.5" fill="none"/>
      
      <ellipse cx="230" cy="190" rx="10" ry="7" fill="%23ffffff"/>
      <circle cx="230" cy="190" r="5" fill="%23382319"/>
      <circle cx="232" cy="188" r="1.5" fill="%23ffffff"/>
      <path d="M 220 188 Q 230 182 240 188" stroke="%231e293b" stroke-width="2.5" fill="none"/>
      
      <!-- Nose -->
      <path d="M 200 185 L 197 215 Q 200 220 205 218" stroke="%23d97706" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
      
      <!-- Cheeks Warmth -->
      <circle cx="155" cy="220" r="14" fill="%23f43f5e" opacity="0.15"/>
      <circle cx="245" cy="220" r="14" fill="%23f43f5e" opacity="0.15"/>
      
      <!-- Smile / Lips -->
      <path d="M 178 242 Q 200 264 222 242" stroke="%23be123c" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M 183 243 Q 200 258 217 243" fill="%23ffffff"/>
      <path d="M 181 247 Q 200 262 219 247" stroke="%23e11d48" stroke-width="2" fill="none"/>
      
      <!-- Ear rings -->
      <circle cx="132" cy="220" r="4" fill="%23fbbf24"/>
      <circle cx="268" cy="220" r="4" fill="%23fbbf24"/>
    </svg>`
  },
  {
    id: "sample2",
    name: "Alex Rivera",
    location: "Global Strategy & Cloud",
    reason: "Onboarded 50 enterprise clients in Q3 with 100% satisfaction",
    copy1: "Onboarded 50 Enterprise Clients in Q3",
    copy2: "Achieved Flawless 100% Client Satisfaction",
    // Professional male corporate portrait SVG
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 550" width="400" height="550">
      <defs>
        <linearGradient id="skin2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23fcd34d"/>
          <stop offset="100%" stop-color="%23f59e0b"/>
        </linearGradient>
        <linearGradient id="suit2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="%231e1b4b"/>
          <stop offset="100%" stop-color="%230f172a"/>
        </linearGradient>
      </defs>
      
      <!-- Suit & Tie -->
      <path d="M 60 550 C 60 410 100 360 140 345 L 200 460 L 260 345 C 300 360 340 410 340 550 Z" fill="url(%23suit2)"/>
      <polygon points="160,340 200,430 240,340" fill="%23ffffff"/>
      <!-- Tie -->
      <polygon points="193,355 207,355 212,470 200,490 188,470" fill="%23008461"/>
      <polygon points="191,348 209,348 205,365 195,365" fill="%2300664b"/>
      
      <!-- Neck -->
      <rect x="175" y="260" width="50" height="85" rx="8" fill="%23e59b5f"/>
      
      <!-- Head -->
      <ellipse cx="200" cy="200" rx="65" ry="80" fill="%23f2ab75"/>
      
      <!-- Modern Styled Hair -->
      <path d="M 135 180 C 135 100 170 85 200 85 C 235 85 265 100 265 170 C 265 185 255 140 240 130 C 210 115 160 120 135 180 Z" fill="%231e293b"/>
      
      <!-- Glasses -->
      <rect x="150" y="175" width="38" height="26" rx="6" fill="none" stroke="%230f172a" stroke-width="3.5"/>
      <rect x="212" y="175" width="38" height="26" rx="6" fill="none" stroke="%230f172a" stroke-width="3.5"/>
      <line x1="188" y1="185" x2="212" y2="185" stroke="%230f172a" stroke-width="3.5"/>
      
      <!-- Eyes inside glasses -->
      <circle cx="169" cy="188" r="4.5" fill="%231e293b"/>
      <circle cx="231" cy="188" r="4.5" fill="%231e293b"/>
      
      <!-- Eyebrows -->
      <path d="M 148 166 Q 168 160 188 166" stroke="%230f172a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M 212 166 Q 232 160 252 166" stroke="%230f172a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      
      <!-- Nose & Smile -->
      <path d="M 200 190 L 198 220 L 204 220" stroke="%23c27137" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M 176 242 Q 200 262 224 242" stroke="%23993d18" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M 182 243 Q 200 256 218 243" fill="%23ffffff"/>
    </svg>`
  }
];
