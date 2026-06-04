import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

function calculateGap(width) {
  const minWidth = 1024
  const maxWidth = 1456
  const minGap = 60
  const maxGap = 86
  if (width <= minWidth) return minGap
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth))
  return (
    minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth))
  )
}

export function CircularTestimonials({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {},
}) {
  // Color & font config
  const colorName = colors.name ?? '#000'
  const colorDesignation = colors.designation ?? '#6b7280'
  const colorTestimony = colors.testimony ?? '#4b5563'
  const colorArrowBg = colors.arrowBackground ?? '#141414'
  const colorArrowFg = colors.arrowForeground ?? '#f1f1f7'
  const colorArrowHoverBg = colors.arrowHoverBackground ?? '#00a6fb'
  const fontSizeName = fontSizes.name ?? '1.5rem'
  const fontSizeDesignation = fontSizes.designation ?? '0.925rem'
  const fontSizeQuote = fontSizes.quote ?? '1.125rem'

  // State
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverPrev, setHoverPrev] = useState(false)
  const [hoverNext, setHoverNext] = useState(false)
  const [containerWidth, setContainerWidth] = useState(1200)

  const imageContainerRef = useRef(null)
  const autoplayIntervalRef = useRef(null)
  const manualPauseTimeoutRef = useRef(null)

  const testimonialsLength = useMemo(
    () => testimonials.length,
    [testimonials]
  )
  const activeTestimonial = useMemo(
    () => testimonials[activeIndex],
    [activeIndex, testimonials]
  )

  // Navigation handlers
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonialsLength)
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current)
    if (manualPauseTimeoutRef.current) clearTimeout(manualPauseTimeoutRef.current)
    if (autoplay) {
      manualPauseTimeoutRef.current = setTimeout(() => {
        autoplayIntervalRef.current = setInterval(() => {
          setActiveIndex((prev) => (prev + 1) % testimonialsLength)
        }, 5000)
      }, 5000)
    }
  }, [autoplay, testimonialsLength])
  const handlePrev = useCallback(() => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonialsLength) % testimonialsLength
    )
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current)
    if (manualPauseTimeoutRef.current) clearTimeout(manualPauseTimeoutRef.current)
    if (autoplay) {
      manualPauseTimeoutRef.current = setTimeout(() => {
        autoplayIntervalRef.current = setInterval(() => {
          setActiveIndex((prev) => (prev + 1) % testimonialsLength)
        }, 5000)
      }, 5000)
    }
  }, [autoplay, testimonialsLength])

  // Responsive gap calculation
  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Autoplay
  useEffect(() => {
    if (autoplay) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonialsLength)
      }, 5000)
    }
    return () => {
      if (autoplayIntervalRef.current)
        clearInterval(autoplayIntervalRef.current)
      if (manualPauseTimeoutRef.current) clearTimeout(manualPauseTimeoutRef.current)
    }
  }, [autoplay, testimonialsLength])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handlePrev, handleNext])

  // Compute transforms for each image (always show 3: left, center, right)
  function getImageStyle(index) {
    const gap = calculateGap(containerWidth)
    const maxStickUp = gap * 0.8
    const isActive = index === activeIndex
    const isLeft =
      (activeIndex - 1 + testimonialsLength) % testimonialsLength === index
    const isRight = (activeIndex + 1) % testimonialsLength === index
    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: 'auto',
        transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
        transition: 'transform 0.8s cubic-bezier(.4,2,.3,1), opacity 0.8s cubic-bezier(.4,2,.3,1)',
        willChange: 'transform, opacity',
      }
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: 'auto',
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: 'transform 0.8s cubic-bezier(.4,2,.3,1), opacity 0.8s cubic-bezier(.4,2,.3,1)',
        willChange: 'transform, opacity',
      }
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: 'auto',
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: 'transform 0.8s cubic-bezier(.4,2,.3,1), opacity 0.8s cubic-bezier(.4,2,.3,1)',
        willChange: 'transform, opacity',
      }
    }
    // Hide all other images
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: 'none',
      transform: `translateX(0px) translateY(-${maxStickUp}px) scale(0.7) rotateY(0deg)`,
      transition: 'transform 0.8s cubic-bezier(.4,2,.3,1), opacity 0.8s cubic-bezier(.4,2,.3,1)',
      willChange: 'transform, opacity',
    }
  }

  // Motion variants for quote
  const quoteVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <div className="w-full max-w-4xl px-4 py-6 sm:px-8">
      <div className="grid items-center gap-14 md:grid-cols-[minmax(0,0.86fr)_minmax(0,1fr)] md:gap-20 lg:gap-28">
        {/* Images */}
        <div
          className="relative mx-auto h-52 w-full max-w-[14rem] [perspective:1000px] sm:h-64 sm:max-w-[17rem] lg:h-72 lg:max-w-[20rem]"
          ref={imageContainerRef}
        >
          {testimonials.map((testimonial, index) => (
            <img
              key={testimonial.src}
              src={testimonial.src}
              alt={testimonial.name}
              className="absolute h-full w-full rounded-3xl object-cover shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
              data-index={index}
              style={getImageStyle(index)}
            />
          ))}
        </div>
        {/* Content */}
        <div className="flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={quoteVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <h3
                className="mb-1 font-bold"
                style={{ color: colorName, fontSize: fontSizeName }}
              >
                {activeTestimonial.name}
              </h3>
              <p
                className="mb-8"
                style={{
                  color: colorDesignation,
                  fontSize: fontSizeDesignation,
                }}
              >
                {activeTestimonial.designation}
              </p>
              <p
                className="leading-[1.75]"
                style={{ color: colorTestimony, fontSize: fontSizeQuote }}
              >
                {activeTestimonial.quote}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-6 pt-12 md:pt-0">
            <button
              className="flex h-[2.7rem] w-[2.7rem] cursor-pointer items-center justify-center rounded-full border-none transition-colors duration-300"
              onClick={handlePrev}
              style={{
                backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg,
              }}
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              aria-label="Previous testimonial"
            >
              <ArrowLeft size={28} color={colorArrowFg} />
            </button>
            <button
              className="flex h-[2.7rem] w-[2.7rem] cursor-pointer items-center justify-center rounded-full border-none transition-colors duration-300"
              onClick={handleNext}
              style={{
                backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg,
              }}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              aria-label="Next testimonial"
            >
              <ArrowRight size={28} color={colorArrowFg} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CircularTestimonials
