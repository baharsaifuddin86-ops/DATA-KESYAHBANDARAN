import React from 'react';

interface FisheryPortLogoProps {
  className?: string;
  size?: number | string;
}

export const FisheryPortLogo: React.FC<FisheryPortLogoProps> = ({
  className = '',
  size = 40,
}) => {
  return (
    <svg
      id="fishery-port-logo"
      width={size}
      height={size}
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none shrink-0 ${className}`}
    >
      <defs>
        {/* Net Grid Pattern */}
        <pattern id="net-grid" width="6" height="6" patternUnits="userSpaceOnUse">
          <path
            d="M 6 0 L 0 0 0 6"
            fill="none"
            stroke="#16a34a"
            strokeWidth="0.65"
            strokeOpacity="0.8"
          />
        </pattern>

        {/* Mask for the Net to give it a teardrop shape */}
        <mask id="net-mask">
          <path
            d="M 50 18 C 10 38, 10 75, 50 96 C 90 75, 90 38, 50 18 Z"
            fill="white"
          />
        </mask>
      </defs>

      {/* 1. GREEN NET GRID */}
      <path
        d="M 50 18 C 10 38, 10 75, 50 96 C 90 75, 90 38, 50 18 Z"
        fill="#f8fafc"
        fillOpacity="0.4"
        stroke="#16a34a"
        strokeWidth="1.2"
        className="backdrop-blur-xs"
      />
      <rect
        width="100"
        height="115"
        fill="url(#net-grid)"
        mask="url(#net-mask)"
      />

      {/* 2. ANCHOR SHAFT AND RING (Underneath the fish, but above the net) */}
      {/* Top Ring */}
      <circle cx="50" cy="11" r="9" fill="#ca8a04" stroke="#854d0e" strokeWidth="1" />
      <circle cx="50" cy="11" r="5" fill="#38bdf8" stroke="#854d0e" strokeWidth="1" />

      {/* Crossbar (Stock) */}
      <rect x="25" y="17" width="50" height="4.5" rx="1" fill="#eab308" stroke="#854d0e" strokeWidth="1" />
      <circle cx="25" cy="19.25" r="4.5" fill="#eab308" stroke="#854d0e" strokeWidth="1" />
      <circle cx="75" cy="19.25" r="4.5" fill="#eab308" stroke="#854d0e" strokeWidth="1" />

      {/* Vertical Shaft */}
      <rect x="47.5" y="21" width="5" height="74" fill="#eab308" stroke="#854d0e" strokeWidth="1" />

      {/* 3. ROPE & BUOY CHAIN (On the net's boundary) */}
      {/* Blue Rope Left */}
      <path
        d="M 50 18 C 11 38, 11 75, 50 96"
        fill="none"
        stroke="#1d4ed8"
        strokeWidth="1.5"
      />
      {/* Blue Rope Right */}
      <path
        d="M 50 18 C 89 38, 89 75, 50 96"
        fill="none"
        stroke="#1d4ed8"
        strokeWidth="1.5"
      />

      {/* Left Buoys (3 Red/White Ovals) */}
      {/* Buoy 1 */}
      <ellipse cx="32" cy="30" rx="4" ry="2.2" fill="#ef4444" stroke="#ffffff" strokeWidth="0.8" transform="rotate(-30, 32, 30)" />
      {/* Buoy 2 */}
      <ellipse cx="18.5" cy="51" rx="4" ry="2.2" fill="#ef4444" stroke="#ffffff" strokeWidth="0.8" transform="rotate(-75, 18.5, 51)" />
      {/* Buoy 3 */}
      <ellipse cx="30" cy="73" rx="4" ry="2.2" fill="#ef4444" stroke="#ffffff" strokeWidth="0.8" transform="rotate(-120, 30, 73)" />

      {/* Right Buoys (3 Red/White Ovals) */}
      {/* Buoy 1 */}
      <ellipse cx="68" cy="30" rx="4" ry="2.2" fill="#ef4444" stroke="#ffffff" strokeWidth="0.8" transform="rotate(30, 68, 30)" />
      {/* Buoy 2 */}
      <ellipse cx="81.5" cy="51" rx="4" ry="2.2" fill="#ef4444" stroke="#ffffff" strokeWidth="0.8" transform="rotate(75, 81.5, 51)" />
      {/* Buoy 3 */}
      <ellipse cx="70" cy="73" rx="4" ry="2.2" fill="#ef4444" stroke="#ffffff" strokeWidth="0.8" transform="rotate(120, 70, 73)" />


      {/* 4. ANCHOR BOTTOM ARMS (Thick curved parts with flukes) */}
      <path
        d="M 50 88 C 36 88, 20 80, 17 65 
           L 13 65 L 17 52 L 23 63 L 21 66 
           C 24 75, 36 81, 50 81 
           C 64 81, 76 75, 79 66 
           L 77 63 L 83 52 L 87 65 L 83 65 
           C 80 80, 64 88, 50 88 Z"
        fill="#eab308"
        stroke="#854d0e"
        strokeWidth="1"
      />
      {/* Crown pointed bottom */}
      <path d="M 46 87.5 L 50 94.5 L 54 87.5 Z" fill="#eab308" stroke="#854d0e" strokeWidth="1" />


      {/* 5. BLUE MARLIN / SWORDFISH (Swimming diagonally across) */}
      <g id="blue-marlin">
        {/* Main Body */}
        <path
          d="M 33 26 
             C 41 31, 44 32, 49 33
             C 52 30, 56 27, 60 27
             C 57 33, 62 43, 64 54
             C 66 65, 63 71, 56 73
             C 54 75, 55 77, 56 79
             C 48 76, 40 68, 38 56
             C 41 58, 44 62, 47 64
             C 49 61, 46 54, 44 48
             C 41 40, 36 32, 33 26 Z"
          fill="#1d4ed8"
          stroke="#1e3a8a"
          strokeWidth="0.8"
        />
        {/* Lighter Underbelly Detail */}
        <path
          d="M 44 48
             C 47 54, 49 61, 47 64
             C 49 61, 51 55, 52 48
             C 53 43, 50 38, 48 35
             C 46 38, 43 43, 44 48 Z"
          fill="#60a5fa"
          opacity="0.65"
        />
        {/* Dorsal Fin Spikes/Texture */}
        <path
          d="M 52 30 C 54 28, 56 27, 60 27 C 58 31, 58 35, 59 39"
          stroke="#172554"
          strokeWidth="0.6"
          fill="none"
        />
        {/* Eye */}
        <circle cx="48.5" cy="35.5" r="1" fill="#ffffff" />
        <circle cx="48.5" cy="35.5" r="0.4" fill="#000000" />

        {/* Tail fin bottom detail */}
        <path
          d="M 56 73 C 50 71, 43 66, 38 56 C 41 61, 45 68, 49 71 Z"
          fill="#1e40af"
        />
      </g>


      {/* 6. PIER / DOCK & PILINGS */}
      {/* Pilings under the pier */}
      <rect x="34" y="99" width="1.6" height="11" fill="#1e2937" stroke="#0f172a" strokeWidth="0.5" />
      <rect x="38" y="99" width="1.6" height="13" fill="#1e2937" stroke="#0f172a" strokeWidth="0.5" />
      <rect x="50" y="99" width="1.6" height="15" fill="#1e2937" stroke="#0f172a" strokeWidth="0.5" />
      <rect x="62" y="99" width="1.6" height="13" fill="#1e2937" stroke="#0f172a" strokeWidth="0.5" />
      <rect x="66" y="99" width="1.6" height="11" fill="#1e2937" stroke="#0f172a" strokeWidth="0.5" />

      {/* Horizontal Pier Deck */}
      <rect x="27" y="95" width="46" height="5.5" rx="0.5" fill="#94a3b8" stroke="#334155" strokeWidth="1" />
      {/* Deck Details / Bolts */}
      <line x1="30" y1="96" x2="30" y2="99.5" stroke="#475569" strokeWidth="0.6" />
      <line x1="40" y1="96" x2="40" y2="99.5" stroke="#475569" strokeWidth="0.6" />
      <line x1="50" y1="96" x2="50" y2="99.5" stroke="#475569" strokeWidth="0.6" />
      <line x1="60" y1="96" x2="60" y2="99.5" stroke="#475569" strokeWidth="0.6" />
      <line x1="70" y1="96" x2="70" y2="99.5" stroke="#475569" strokeWidth="0.6" />


      {/* 7. WATER WAVES (Left & Right) */}
      {/* Left Waves (Blue and Black) */}
      <path
        d="M 1 100 Q 6 97, 11 100 T 21 100 T 26 100"
        fill="none"
        stroke="#2563eb"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M 3 102.5 Q 8 99.5, 13 102.5 T 23 102.5"
        fill="none"
        stroke="#1e3a8a"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Right Waves (Blue and Black) */}
      <path
        d="M 74 100 Q 79 97, 84 100 T 94 100 T 99 100"
        fill="none"
        stroke="#2563eb"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M 76 102.5 Q 81 99.5, 86 102.5 T 96 102.5"
        fill="none"
        stroke="#1e3a8a"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default FisheryPortLogo;
