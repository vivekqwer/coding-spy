export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="spyGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#22D3EE" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <path
        d="M4 13 L11 20 L4 27 M15 27 H24"
        stroke="url(#spyGrad)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="26" cy="16" r="8.5" stroke="url(#spyGrad)" strokeWidth="2.6" />
      <line x1="31.8" y1="21.8" x2="37.5" y2="27.5" stroke="url(#spyGrad)" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function LogoWithWordmark({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Logo />
      <span className="text-lg font-bold tracking-tight">
        Coding <span className="text-gradient">Spy</span>
      </span>
    </div>
  );
}
