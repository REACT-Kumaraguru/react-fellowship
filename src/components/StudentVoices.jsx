import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { testimonials } from '../data/testimonials.js'

const rotationDelay = 3000
const avatarRotations = ['-rotate-6', 'rotate-4', '-rotate-3', 'rotate-6']

function AvatarButton({ person, isActive, onSelect, index }) {
  const rotation = avatarRotations[index % avatarRotations.length]

  return (
    <button
      type="button"
      aria-current={isActive ? 'true' : undefined}
      aria-label={`Show testimonial from ${person.name}`}
      onClick={onSelect}
      className={`group relative -ml-3 grid shrink-0 place-items-center overflow-hidden rounded-lg shadow-sm transition duration-300 first:ml-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas sm:-ml-5 ${rotation} ${
        isActive
          ? 'z-20 h-24 w-24 -translate-y-2 scale-105 ring-3 ring-violet-600 ring-offset-2 ring-offset-canvas'
          : 'z-0 h-20 w-20 opacity-45 grayscale hover:z-10 hover:-translate-y-1 hover:opacity-90 hover:grayscale-0'
      }`}
      style={{ backgroundColor: person.image ? undefined : person.avatarBg }}
    >
      {person.image ? (
        <img
          src={person.image}
          alt={person.name}
          className="absolute inset-0 h-full w-full object-cover"
          draggable="false"
        />
      ) : (
        <>
          <span
            className="absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-black/20"
            aria-hidden="true"
          />
          <span
            className="absolute top-[13%] h-[30%] w-[34%] rounded-full bg-white/45 shadow-inner"
            aria-hidden="true"
          />
          <span
            className="absolute bottom-[11%] h-[44%] w-[70%] rounded-t-full bg-black/20"
            aria-hidden="true"
          />
          <span className="relative z-10 translate-y-1 text-lg font-extrabold tracking-wide text-white">
            {person.initials}
          </span>
        </>
      )}
    </button>
  )
}

export default function StudentVoices() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [timerReset, setTimerReset] = useState(0)
  const active = testimonials[activeIndex]

  useEffect(() => {
    if (isPaused || testimonials.length < 2) return undefined

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, rotationDelay)

    return () => clearInterval(interval)
  }, [isPaused, timerReset])

  const selectTestimonial = (index) => {
    setActiveIndex(index)
    setTimerReset((current) => current + 1)
  }

  return (
    <section className="bg-canvas">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.58fr_0.42fr] lg:items-center lg:gap-16 lg:px-10 lg:py-28">
        <div
          className="overflow-hidden border-y border-black/10 py-10 order-2 lg:order-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <div className="flex min-h-32 overflow-x-auto px-3 pb-7 pt-4 sm:justify-center sm:overflow-visible">
            {testimonials.map((person, index) => (
              <AvatarButton
                key={person.name}
                person={person}
                index={index}
                isActive={activeIndex === index}
                onSelect={() => selectTestimonial(index)}
              />
            ))}
          </div>

          <div className="relative mt-8 min-h-[18rem] rounded-lg bg-white p-7 shadow-[0_24px_70px_-45px_rgba(10,10,10,0.5)] ring-1 ring-black/5 sm:p-9">
            <AnimatePresence mode="wait">
              <motion.article
                key={active.name}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="flex min-h-[13.5rem] flex-col justify-between"
              >
                <p className="font-serif text-[clamp(1.8rem,4vw,3.4rem)] leading-[1.02] text-ink">
                  &ldquo;{active.quote}&rdquo;
                </p>

                <div className="mt-9 flex flex-wrap items-end justify-between gap-5 border-t border-black/10 pt-6">
                  <div>
                    <h3 className="text-lg font-bold text-ink">
                      {active.name}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                      {active.role}
                    </p>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <div className="order-1 lg:order-none lg:pl-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent">
            Student Voices
          </p>
          <h2 className="mt-5 max-w-xl font-serif text-[clamp(2.6rem,5vw,5rem)] font-semibold leading-[0.96] text-ink">
            Do not take our word for it.
          </h2>
          <p className="mt-7 max-w-lg text-[18px] leading-relaxed text-neutral-600">
            Hear from the people building inside REACT right now.
          </p>
        </div>
      </div>
    </section>
  )
}
