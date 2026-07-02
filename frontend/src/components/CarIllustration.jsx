function CarIllustration({ width = 140 }) {
  return (
    <svg
      width={width}
      viewBox="0 0 420 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of a sports car"
    >
      <defs>
        <linearGradient id="bodyGrad" x1="60" y1="50" x2="360" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#60A5FA" />
          <stop offset="0.35" stopColor="#2563EB" />
          <stop offset="1" stopColor="#0F2D7A" />
        </linearGradient>
        <linearGradient id="glassGrad" x1="150" y1="50" x2="290" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#BFE0FF" stopOpacity="0.9" />
          <stop offset="1" stopColor="#3B5B8C" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id="groundGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#1D4ED8" stopOpacity="0.35" />
          <stop offset="1" stopColor="#1D4ED8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rimGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E5E7EB" />
          <stop offset="1" stopColor="#9CA3AF" />
        </linearGradient>
      </defs>

      <ellipse cx="210" cy="172" rx="170" ry="16" fill="url(#groundGlow)" />

      {/* body */}
      <path
        d="M28 152
           C24 138 34 128 48 124
           L66 122
           C72 104 92 88 118 82
           L150 56
           C160 47 174 42 190 41
           L246 41
           C262 42 276 47 286 56
           L316 82
           C344 87 366 100 376 122
           L392 124
           C404 128 410 140 402 152
           C398 158 388 160 378 160
           L58 160
           C44 160 32 158 28 152 Z"
        fill="url(#bodyGrad)"
      />

      {/* glossy highlight along the roofline */}
      <path
        d="M78 118 C96 96 122 82 150 76 L182 58 C196 50 214 47 232 47 L252 48 C240 46 224 46 210 49
           L178 62 C150 70 126 84 108 104 L94 120 Z"
        fill="#ffffff"
        opacity="0.22"
      />

      {/* greenhouse / windows */}
      <path
        d="M124 80 C136 63 158 51 184 47 L246 47 C266 51 282 62 292 80 L280 80
           C270 66 254 58 236 56 L196 56 C180 58 166 65 156 80 Z"
        fill="url(#glassGrad)"
      />
      <path d="M212 50 L210 80" stroke="#0B1220" strokeWidth="2.5" opacity="0.4" />
      <path d="M160 78 L184 56" stroke="#ffffff" strokeWidth="3" opacity="0.35" strokeLinecap="round" />

      {/* door seam + shading */}
      <path d="M214 84 L206 158" stroke="#0B1220" strokeWidth="1.5" opacity="0.18" />
      <path d="M66 122 L376 122" stroke="#0B1220" strokeWidth="1.5" opacity="0.12" />

      {/* front headlight */}
      <path d="M382 128 L400 132 C404 136 403 144 398 146 L380 144 Z" fill="#EAF4FF" opacity="0.95" />
      {/* rear taillight */}
      <path d="M38 130 L28 133 C25 137 26 143 30 145 L40 143 Z" fill="#FCA5A5" opacity="0.95" />

      {/* front wheel */}
      <circle cx="342" cy="160" r="30" fill="#0B1220" />
      <circle cx="342" cy="160" r="30" fill="none" stroke="#1e293b" strokeWidth="2" />
      <circle cx="342" cy="160" r="16" fill="url(#rimGrad)" />
      <circle cx="342" cy="160" r="5" fill="#4B5563" />
      {[0, 72, 144, 216, 288].map((angle) => (
        <line
          key={angle}
          x1="342"
          y1="160"
          x2={342 + 14 * Math.cos((angle * Math.PI) / 180)}
          y2={160 + 14 * Math.sin((angle * Math.PI) / 180)}
          stroke="#6B7280"
          strokeWidth="3"
        />
      ))}

      {/* rear wheel */}
      <circle cx="104" cy="160" r="30" fill="#0B1220" />
      <circle cx="104" cy="160" r="30" fill="none" stroke="#1e293b" strokeWidth="2" />
      <circle cx="104" cy="160" r="16" fill="url(#rimGrad)" />
      <circle cx="104" cy="160" r="5" fill="#4B5563" />
      {[0, 72, 144, 216, 288].map((angle) => (
        <line
          key={angle}
          x1="104"
          y1="160"
          x2={104 + 14 * Math.cos((angle * Math.PI) / 180)}
          y2={160 + 14 * Math.sin((angle * Math.PI) / 180)}
          stroke="#6B7280"
          strokeWidth="3"
        />
      ))}
    </svg>
  )
}

export default CarIllustration
