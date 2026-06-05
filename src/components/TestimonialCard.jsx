export default function TestimonialCard({ data }) {
  const { quote, name, role, company, initials, avatarBg, image, verified } = data
  return (
    <article className="pointer-events-none flex h-full w-full flex-col justify-between rounded-2xl bg-white p-5 text-ink shadow-card ring-1 ring-black/10 select-none sm:p-7">
      <p className="text-[15.5px] leading-[1.45] text-ink/90 sm:text-[19.5px] sm:leading-[1.5]">
        &ldquo;{quote}&rdquo;
      </p>

      <div className="mt-5 border-t border-black/10 pt-4 sm:mt-7 sm:pt-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full text-base font-bold text-white sm:h-14 sm:w-14"
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
                <span className="truncate text-[16px] font-semibold text-ink sm:text-[18px]">
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
              <div className="truncate text-[13px] text-neutral-600 sm:text-[14.5px]">
                {role}
              </div>
            </div>
          </div>
          <span className="shrink-0 font-serif-italic text-[1.4rem] tracking-tight text-ink sm:text-[1.75rem]">
            {company}
          </span>
        </div>
      </div>
    </article>
  )
}
