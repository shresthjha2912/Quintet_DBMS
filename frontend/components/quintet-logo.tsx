export function QuintetLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer ring representing unity/connection */}
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2.5" opacity="0.15" />

      {/* Five interconnected nodes representing the "Quintet" (5 roles/entities) */}
      {/* Center database cylinder */}
      <ellipse cx="24" cy="20" rx="8" ry="3" fill="currentColor" opacity="0.2" />
      <rect x="16" y="20" width="16" height="10" fill="currentColor" opacity="0.15" />
      <ellipse cx="24" cy="30" rx="8" ry="3" fill="currentColor" opacity="0.2" />
      <ellipse cx="24" cy="20" rx="8" ry="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="16" y1="20" x2="16" y2="30" stroke="currentColor" strokeWidth="2" />
      <line x1="32" y1="20" x2="32" y2="30" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="24" cy="30" rx="8" ry="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <ellipse cx="24" cy="25" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" opacity="0.4" fill="none" />

      {/* Five dots around — representing the 5 roles */}
      <circle cx="24" cy="6" r="2.5" fill="currentColor" />
      <circle cx="41" cy="17" r="2.5" fill="currentColor" />
      <circle cx="37" cy="37" r="2.5" fill="currentColor" />
      <circle cx="11" cy="37" r="2.5" fill="currentColor" />
      <circle cx="7" cy="17" r="2.5" fill="currentColor" />

      {/* Connection lines from nodes to center */}
      <line x1="24" y1="8.5" x2="24" y2="17" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
      <line x1="39" y1="18" x2="32" y2="22" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
      <line x1="35.5" y1="36" x2="30" y2="29" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
      <line x1="12.5" y1="36" x2="18" y2="29" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
      <line x1="9" y1="18" x2="16" y2="22" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
    </svg>
  )
}
