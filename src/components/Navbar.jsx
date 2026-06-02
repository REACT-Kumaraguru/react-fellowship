import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { MoreVertical } from 'lucide-react'

const NAV_LINKS = [
  { label: 'The Fellowship', to: '/#fellowship', kind: 'anchor' },
  { label: 'The Journey', to: '/journey', kind: 'route' },
  { label: 'What You Leave With', to: '/#outcomes', kind: 'anchor' },
  { label: 'How To Join', to: '/#apply-steps', kind: 'anchor' },
]

function NavLink({ link, className = '', onClick }) {
  const cls = `rounded-full px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-ink ${className}`
  // Both 'route' and 'anchor' links use <Link>. Anchor `to` values like
  // '/#outcomes' navigate to home and set the hash; ScrollToHash (App.jsx)
  // handles the smooth scroll, so these work from any route.
  return (
    <Link to={link.to} className={cls} onClick={onClick}>
      {link.label}
    </Link>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      if (expanded && Math.abs(y - lastY) > 6) {
        setExpanded(false)
      }
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [expanded])

  const isCompact = scrolled && !expanded
  const dur = reduce ? 0 : 0.5
  const ease = [0.16, 1, 0.3, 1]
  const baseTransition = { duration: dur, ease }

  return (
    <header className="fixed inset-x-0 top-6 z-50 flex flex-col items-center px-4">
      <motion.nav
        initial={false}
        animate={{
          maxWidth: isCompact ? 168 : 1024,
          height: isCompact ? 48 : 60,
          paddingTop: isCompact ? 6 : 10,
          paddingBottom: isCompact ? 6 : 10,
          paddingLeft: isCompact ? 8 : 12,
          paddingRight: isCompact ? 8 : 12,
        }}
        transition={baseTransition}
        className="relative flex w-full items-center gap-2 overflow-hidden rounded-full border border-white/40 bg-white/55 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.18)] backdrop-blur-xl backdrop-saturate-150 sm:gap-3"
      >
        <Link to="/" className="flex items-center gap-3 pl-1">
          <motion.span
            animate={{
              height: isCompact ? 32 : 40,
              width: isCompact ? 34 : 42,
            }}
            transition={baseTransition}
            className="grid shrink-0 place-items-center rounded-full bg-ink text-white"
          >
           <img src="/assets/react-logo.png" alt="Logo" className="invert brightness-0"/>
          </motion.span>

          <AnimatePresence initial={false}>
            {!isCompact && (
              <motion.span
                key="brand"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ ...baseTransition, delay: 0 }}
                style={{ height: 40 }}
                className="flex flex-col justify-center overflow-hidden whitespace-nowrap leading-tight"
              >
                <span className="block text-[13px] font-bold tracking-wide text-ink">
                  REACT Fellowship
                </span>
                <span className="block text-[9px] font-medium uppercase tracking-[0.14em] text-neutral-500">
                  Social Innovation Fellowship
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <AnimatePresence initial={false}>
          {!isCompact && (
            <motion.ul
              key="links"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ ...baseTransition, delay: scrolled ? 0.18 : 0 }}
              className="ml-auto hidden items-center gap-1 lg:flex"
            >
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink link={l} />
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {!isCompact && (
            <motion.div
              key="apply"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ ...baseTransition, delay: scrolled ? 0.18 : 0 }}
              className="ml-auto hidden sm:block lg:ml-2"
            >
              <Link
                to="/apply"
                className="inline-flex items-center rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
              >
                Apply to 2026 Batch
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3-dot toggle. lg+: visible only when compact. <lg: always visible. */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={!isCompact}
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink transition hover:bg-neutral-100 ${
            isCompact ? 'ml-auto' : 'ml-1 lg:hidden'
          }`}
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </motion.nav>

      {/* Mobile dropdown — surfaces the full link list + Apply CTA on <lg when the user taps the 3-dot. */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={baseTransition}
            className="mt-3 w-full max-w-sm rounded-2xl border border-white/40 bg-white/80 p-3 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.18)] backdrop-blur-xl backdrop-saturate-150 lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink
                    link={l}
                    className="block w-full text-left"
                    onClick={() => setExpanded(false)}
                  />
                </li>
              ))}
            </ul>
            <Link
              to="/apply"
              onClick={() => setExpanded(false)}
              className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
            >
              Apply to 2026 Batch
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
