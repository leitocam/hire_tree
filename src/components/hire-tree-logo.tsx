interface HireTreeLogoProps {
  size?: number
  className?: string
  showText?: boolean
}

export function HireTreeLogo({ size = 40, className = "", showText = true }: HireTreeLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Tree trunk */}
          <rect
            x="20"
            y="32"
            width="8"
            height="12"
            rx="1"
            fill="url(#trunkGradient)"
          />
          
          {/* Tree layers */}
          <path
            d="M24 8L32 20H16L24 8Z"
            fill="url(#topLeafGradient)"
          />
          <path
            d="M24 14L30 24H18L24 14Z"
            fill="url(#middleLeafGradient)"
          />
          <path
            d="M24 20L28 28H20L24 20Z"
            fill="url(#bottomLeafGradient)"
          />
          
          {/* Stars/sparkles for "talent growth" */}
          <circle cx="10" cy="12" r="1.5" fill="#10B981" opacity="0.7">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="38" cy="16" r="1" fill="#059669" opacity="0.8">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="35" cy="8" r="1.2" fill="#0D9488" opacity="0.6">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
          </circle>
          
          <defs>
            <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="topLeafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="middleLeafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="bottomLeafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {showText && (
        <h1 className="text-4xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent font-bold tracking-tight">
          HireTree
        </h1>
      )}
    </div>
  )
}