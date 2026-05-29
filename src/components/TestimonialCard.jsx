export default function TestimonialCard({ data }) {
  const { quote, name, role, initials, avatarBg, image, verified } = data
  return (
    <article className="pointer-events-none flex h-full w-full flex-col justify-between rounded-2xl bg-white/70 p-7 text-ink shadow-card ring-1 ring-black/10 backdrop-blur-md select-none">
      <p className="text-[19.5px] leading-[1.5] text-ink/90">
        &ldquo;{quote}&rdquo;
      </p>

      <div className="mt-7 border-t border-black/10 pt-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full text-base font-bold text-white"
              style={{ backgroundColor: image ? 'transparent' : avatarBg }}
            >
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="h-full w-full object-cover"
                  draggable="false"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                initials
              )}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-[18px] font-semibold text-ink">
                  {name}
                </span>
                {verified && (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[18px] w-[18px] shrink-0 text-sky-500"
                    fill="currentColor"
                    aria-label="verified"
                  >
                    <path d="M12 2l2.39 2.05 3.15-.36.69 3.09 2.78 1.53-1.4 2.85 1.4 2.85-2.78 1.53-.69 3.09-3.15-.36L12 20.35l-2.39-2.05-3.15.36-.69-3.09L3 14.04l1.4-2.85L3 8.34l2.78-1.53.69-3.09 3.15.36L12 2z" />
                    <path d="M10.6 13.2l-2-2 1.2-1.2.8.8 3.4-3.4 1.2 1.2-4.6 4.6z" fill="#ffffff" />
                  </svg>
                )}
              </div>
              <div className="truncate text-[14.5px] text-neutral-600">
                {role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
