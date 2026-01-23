export function CostGuardLogo({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 320 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="CostGuard"
    >
      {/* Shield */}
      <path
        d="M32 4
           L52 10
           V30
           C52 42 44 52 32 58
           C20 52 12 42 12 30
           V10
           Z"
        fill="#4F46E5"
      />

      {/* Inner accent (optional, subtle) */}
      <path
        d="M32 10
           L46 14
           V28
           C46 36 40 44 32 48
           C24 44 18 36 18 28
           V14
           Z"
        fill="#6366F1"
        opacity="0.6"
      />

      {/* Wordmark */}
      <text
        x="72"
        y="42"
        fontFamily="Inter, ui-sans-serif, system-ui"
        fontSize="32"
        fontWeight="600"
        fill="#0F172A"
      >
        CostGuard
      </text>
    </svg>
  );
}
