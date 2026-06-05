import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const SQRT_5000 = Math.sqrt(5000)
const AUTO_ROTATE_MS = 4000
const MOBILE_BREAKPOINT = 640

const initialMentors = [
  {
    name: 'Shivani',
    role: 'Molecular Biologist',
    domain: 'Research & Innovation',
    quote:
      'REACT is built around the belief that the people closest to a problem are part of its solution. Watching that philosophy translate into actual student work, semester after semester, is what keeps this program worth being part of.',
    image: '/assets/images/Shivani.jpg',
  },
  {
    name: 'Ansu Susan Deepak',
    role: 'Student at Purdue University',
    domain: 'Business Analytics',
    quote:
      'The structure of REACT reflects a clear understanding of how innovation actually works. It starts with immersion, moves through research, and arrives at building. That arc is not accidental and the outcomes are not either.',
    image: '/assets/images/Ansu Susan Deepak.jpg',
  },
  {
    name: 'Janarthanan',
    role: 'Chevening Scholar at Imperial College London',
    domain: 'Sustainable Technologies',
    quote:
      'Most programmes prepare students for industry. REACT prepares students for reality. Those are not the same thing.',
    image: '/assets/images/Janarthanan.jpg',
  },
  {
    name: 'Dr Lakshmi Meera',
    role: 'VP - Forge Innovation & Ventures',
    domain: 'Innovation Ecosystem Builder',
    quote:
      'What makes REACT impactful is its approach to innovation through design thinking and social entrepreneurship. The focus is not just on building technology, but on understanding real societal challenges across health, education, environment, and livelihoods. When innovation begins with empathy and community needs, it creates solutions that are sustainable, inclusive, and truly meaningful',
    image: '/assets/images/Dr Lakshmi Meera.jpg',
  },
  {
    name: 'Dr Saravanan D',
    role: 'Director - KCT',
    domain: 'Education',
    quote:
      'REACT sits in a part of the education landscape that has been mostly empty in India. Applied, community-rooted, venture-oriented, and academically grounded at the same time. The students graduating from it are carrying all four of those qualities together.',
    image: '/assets/images/Dr Saravanan D.jpg',
  },
  {
    name: 'Kabila',
    role: 'Project Associate at CDFD',
    domain: 'Research & Innovation',
    quote:
      'The students in REACT are working on problems that practicing engineers spend entire careers circling around. Wave energy. Post-harvest loss. Cardiac early warning. The ambition of the program is matched only by the seriousness with which students take it.',
    image: '/assets/images/Kabila.jpg',
  },
  {
    name: 'Dhananjay Sing',
    role: 'IRS Officer',
    domain: 'Public Services',
    quote:
      'The problems REACT works on do not have clean solutions. Shrimp farming health monitoring. Photocatalytic water pipe coatings. Jasmine harvesting robotics. These are complex, context-specific, and consequential. The program takes them seriously and so do the students.',
    image: '/assets/images/Dhananjay Sing.jpg',
  },
].map((m, i) => ({ ...m, tempId: i }))

function MentorAttribution({ mentor, light }) {
  return (
    <div className={light ? 'text-white' : 'text-ink'}>
      <p
        className={`text-[13px] font-bold leading-tight sm:text-[14px] ${
          light ? 'text-white' : 'text-ink'
        }`}
      >
        {mentor.name}
      </p>
      <p
        className={`mt-1 text-[11.5px] leading-snug sm:text-[12px] ${
          light ? 'text-white/80' : 'text-neutral-600'
        }`}
      >
        {mentor.role}
      </p>
      <p
        className={`mt-2 text-[9.5px] font-bold uppercase tracking-[0.18em] sm:text-[10px] ${
          light ? 'text-white/80' : 'text-accent'
        }`}
      >
        Domain · {mentor.domain}
      </p>
    </div>
  )
}

// Desktop stagger-fan card
function FanCard({ position, mentor, handleMove, cardSize }) {
  const isCenter = position === 0
  const cardHeight = cardSize + 120

  return (
    <div
      onClick={() => handleMove(position)}
      className={`absolute left-1/2 top-1/2 cursor-pointer border-2 p-6 sm:p-7 flex flex-col ${
        isCenter
          ? 'z-10 border-accent bg-accent text-white'
          : 'z-0 border-black/15 bg-white text-ink hover:border-accent/50'
      }`}
      style={{
        width: cardSize,
        height: cardHeight,
        clipPath:
          'polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)',
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.6) * position}px)
          translateY(${isCenter ? -55 : position % 2 ? 14 : -14}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter
          ? '0px 8px 0px 4px rgba(20, 14, 8, 0.18)'
          : '0px 0px 0px 0px transparent',
        transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), background-color 500ms ease, border-color 500ms ease, color 500ms ease, box-shadow 500ms ease',
        willChange: 'transform',
      }}
    >
      <span
        className={`absolute block origin-top-right rotate-45 ${
          isCenter ? 'bg-white/60' : 'bg-black/15'
        }`}
        style={{ right: -2, top: 48, width: SQRT_5000, height: 2 }}
      />

      <img
        src={mentor.image}
        alt={mentor.name}
        draggable="false"
        className="mb-4 h-14 w-12 bg-neutral-200 object-cover object-center sm:h-16 sm:w-14 flex-shrink-0"        style={{
          boxShadow: isCenter
            ? '3px 3px 0px rgba(255,255,255,0.35)'
            : '3px 3px 0px #faf8f5',
        }}
      />

      <div
        className={`flex-1 overflow-y-auto pr-2 mb-4 min-h-0 custom-scrollbar ${
          isCenter ? 'custom-scrollbar-light' : ''
        }`}
        onClick={(e) => {
          if (isCenter) {
            e.stopPropagation()
          }
        }}
      >
        <h3
          className={`font-serif text-[0.98rem] font-semibold leading-snug sm:text-[1.1rem] ${
            isCenter ? 'text-white' : 'text-ink'
          }`}
        >
          “{mentor.quote}”
        </h3>
      </div>

      <div className={`mt-auto border-t pt-4 flex-shrink-0 ${isCenter ? 'border-white/20' : 'border-black/10'}`}>
        <MentorAttribution mentor={mentor} light={isCenter} />
      </div>
    </div>
  )
}

// Mobile single-card carousel slide
function MobileCard({ mentor, onTap }) {
  return (
    <motion.article
      key={mentor.tempId}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={onTap}
      className="absolute inset-0 flex flex-col rounded-2xl border-2 border-accent bg-accent p-6 text-white shadow-[0_8px_0_4px_rgba(20,14,8,0.18)]"
    >
      <img
        src={mentor.image}
        alt={mentor.name}
        draggable="false"
        className="mb-4 h-16 w-14 bg-neutral-200 object-cover object-center"
        style={{ boxShadow: '3px 3px 0px rgba(255,255,255,0.35)' }}
      />

      <div
        className="overflow-y-auto pr-2 custom-scrollbar custom-scrollbar-light mb-4"
        style={{ maxHeight: '190px' }}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <p className="font-serif text-[1.05rem] font-semibold leading-snug text-white">
          “{mentor.quote}”
        </p>
      </div>

      <div className="mt-auto border-t border-white/20 pt-4">
        <MentorAttribution mentor={mentor} light />
      </div>
    </motion.article>
  )
}

export default function StaggerMentors() {
  const [cardSize, setCardSize] = useState(280)
  const [isMobile, setIsMobile] = useState(false)
  const [list, setList] = useState(initialMentors)
  const [paused, setPaused] = useState(false)

  const handleMove = (steps) => {
    setList((prev) => {
      const next = [...prev]
      if (steps > 0) {
        for (let i = steps; i > 0; i--) {
          const item = next.shift()
          if (!item) return prev
          next.push({ ...item, tempId: Math.random() })
        }
      } else if (steps < 0) {
        for (let i = steps; i < 0; i++) {
          const item = next.pop()
          if (!item) return prev
          next.unshift({ ...item, tempId: Math.random() })
        }
      }
      return next
    })
  }

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setIsMobile(w < MOBILE_BREAKPOINT)
      if (w < MOBILE_BREAKPOINT) setCardSize(0)
      else if (w < 1024) setCardSize(280)
      else setCardSize(320)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => handleMove(1), AUTO_ROTATE_MS)
    return () => clearInterval(t)
  }, [paused])

  // ─── Mobile: single-card carousel ──────────────────────────────────────────
  if (isMobile) {
    const current = list[Math.floor(list.length / 2)]
    return (
      <div
        className="relative mx-auto w-full max-w-sm px-6"
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div className="relative h-[410px] w-full">
          <AnimatePresence mode="wait">
            <MobileCard
              key={current.tempId}
              mentor={current}
              onTap={() => handleMove(1)}
            />
          </AnimatePresence>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5">
          {list.map((m, i) => (
            <span
              key={m.tempId}
              className={`h-1.5 rounded-full transition-all ${
                i === Math.floor(list.length / 2)
                  ? 'w-6 bg-accent'
                  : 'w-1.5 bg-neutral-300'
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  // ─── Desktop: stagger fan ──────────────────────────────────────────────────
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: cardSize + 260 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {list.map((mentor, index) => {
        const position = index - Math.floor(list.length / 2)
        return (
          <FanCard
            key={mentor.tempId}
            mentor={mentor}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        )
      })}
    </div>
  )
}
