// Shared Kenny SVG generator; no external files or JavaScript dependencies.
let kennySvgId = 0;
export function escapeHtml(value) { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
    // Self-contained, lightweight SVG character. Unique gradient IDs prevent collisions.
    export const svgRobot = (label, mood='focused') => {
      const id = ++kennySvgId;
      const eye = mood==='celebrate' ? '#b9ffe5' : mood==='encourage' ? '#8ff0de' : mood==='supportive' ? '#9ddcf7' : '#63ece1';
      const mouth = mood==='celebrate' ? 'M85 117q25 26 50 0' : mood==='encourage' ? 'M88 121q22 10 44 0' : mood==='supportive' ? 'M90 122q20 -8 40 0' : 'M92 121q18 4 36 0';
      const browL = mood==='celebrate' ? 'M75 84q11 -10 22 0' : mood==='supportive' ? 'M78 89q9 -4 20 -1' : 'M76 87q10 -7 21 -3';
      const browR = mood==='celebrate' ? 'M121 84q12 -11 24 0' : mood==='supportive' ? 'M123 88q11 -3 20 2' : 'M123 84q13 -5 22 2';
      return `<svg class="robot" viewBox="0 0 220 230" role="img" aria-label="${escapeHtml(label)}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="kenny-shell-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#14b7a9"/><stop offset="1" stop-color="#0d6672"/></linearGradient>
          <linearGradient id="kenny-body-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#16a9a2"/><stop offset="1" stop-color="#0e6570"/></linearGradient>
          <linearGradient id="kenny-face-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#071c2e"/><stop offset="1" stop-color="#123c51"/></linearGradient>
        </defs>
        <g class="float">
          <ellipse class="shadow" cx="110" cy="218" rx="67" ry="11" fill="#042b35" opacity=".18"/>
          <path d="M110 43V28" stroke="#78d7d4" stroke-width="5" stroke-linecap="round"/>
          <circle class="antenna-light" cx="110" cy="18" r="9" fill="#4ce0c9" stroke="#0a3446" stroke-width="4"/>
          <circle cx="110" cy="18" r="3" fill="#c9fff5"/>
          <g class="wave-arm">
            <path d="M71 163q-20 3-26 23" stroke="#12384c" stroke-width="15" fill="none" stroke-linecap="round"/>
            <path d="M71 163q-20 3-26 23" stroke="#159c9d" stroke-width="8" fill="none" stroke-linecap="round"/>
            <circle cx="44" cy="187" r="11" fill="#1ac5b4" stroke="#0b354c" stroke-width="4"/>
          </g>
          <path d="M149 163q20 3 26 23" stroke="#12384c" stroke-width="15" fill="none" stroke-linecap="round"/>
          <path d="M149 163q20 3 26 23" stroke="#159c9d" stroke-width="8" fill="none" stroke-linecap="round"/>
          <circle cx="176" cy="187" r="11" fill="#1ac5b4" stroke="#0b354c" stroke-width="4"/>
          <path d="M88 196l-8 19M132 196l8 19" stroke="#113747" stroke-width="12" stroke-linecap="round"/>
          <path d="M78 217h18M124 217h18" stroke="#2ca9a7" stroke-width="10" stroke-linecap="round"/>
          <rect x="63" y="144" width="94" height="57" rx="24" fill="url(#kenny-body-${id})" stroke="#08344b" stroke-width="5"/>
          <path d="M76 152h68" stroke="#a1f2e5" stroke-width="3" opacity=".55"/>
          <rect x="95" y="160" width="30" height="24" rx="9" fill="#0b334a" stroke="#70d5ce" stroke-width="2"/>
          <path d="M104 172h12M110 166v12" stroke="#6ae7d9" stroke-width="2.5" stroke-linecap="round" opacity=".9"/>
          <rect x="21" y="81" width="24" height="48" rx="12" fill="#0d4258" stroke="#4c9fa8" stroke-width="3"/>
          <rect x="175" y="81" width="24" height="48" rx="12" fill="#0d4258" stroke="#4c9fa8" stroke-width="3"/>
          <rect x="31" y="43" width="158" height="119" rx="40" fill="url(#kenny-shell-${id})" stroke="#082d44" stroke-width="6"/>
          <path d="M47 68Q61 49 84 49h49" stroke="#8ee8df" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/>
          <rect x="48" y="61" width="124" height="81" rx="26" fill="url(#kenny-face-${id})" stroke="#358595" stroke-width="3"/>
          <path d="${browL}" stroke="#5ec7cf" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/>
          <path d="${browR}" stroke="#5ec7cf" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/>
          <g class="blink">
            <rect x="73" y="91" width="29" height="16" rx="8" fill="#115472" stroke="#2ea7a7" stroke-width="1.2"/>
            <rect x="118" y="91" width="29" height="16" rx="8" fill="#115472" stroke="#2ea7a7" stroke-width="1.2"/>
            <g class="kenny-pupils" fill="${eye}">
              <ellipse cx="87" cy="99" rx="7.7" ry="5.2"/>
              <ellipse cx="133" cy="99" rx="7.7" ry="5.2"/>
              <circle cx="89" cy="97.5" r="1.6" fill="#efffff"/>
              <circle cx="135" cy="97.5" r="1.6" fill="#efffff"/>
            </g>
          </g>
          <path class="mouth-line" d="${mouth}" stroke="#61d2d6" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M59 75h20" stroke="#3b97a7" stroke-width="2" opacity=".5" stroke-linecap="round"/>
          <path d="M162 130h-14" stroke="#3b97a7" stroke-width="2" opacity=".5" stroke-linecap="round"/>
          <circle cx="41" cy="113" r="5" fill="#e5a35f"/><circle cx="179" cy="113" r="5" fill="#e5a35f"/>
          <path d="M79 152h62" stroke="#8ae2d7" stroke-width="2" opacity=".48"/>
        </g>
      </svg>`;
    };

