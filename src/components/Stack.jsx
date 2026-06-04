import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

function CardRotate({
  children,
  onSendToBack,
  sensitivity,
  disableDrag = false,
  cardId,
  registerMVs,
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [60, -60])
  const rotateY = useTransform(x, [-100, 100], [-60, 60])

  useEffect(() => {
    if (!registerMVs || cardId == null) return
    registerMVs(cardId, { x, y })
    return () => registerMVs(cardId, null)
  }, [cardId, registerMVs, x, y])

  function handleDragEnd(_, info) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack()
    } else {
      x.set(0)
      y.set(0)
    }
  }

  if (disableDrag) {
    return (
      <motion.div className="absolute inset-0 cursor-pointer" style={{ x, y, rotateX, rotateY, willChange: 'transform' }}>
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab"
      style={{ x, y, rotateX, rotateY, willChange: 'transform' }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  )
}

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cards = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  mobileClickOnly = false,
  mobileBreakpoint = 768,
}) {
  const [isMobile, setIsMobile] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [throwingId, setThrowingId] = useState(null)
  const cardMVs = useRef({})

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [mobileBreakpoint])

  const shouldDisableDrag = mobileClickOnly && isMobile
  const shouldEnableClick = sendToBackOnClick || shouldDisableDrag

  const [stack, setStack] = useState(() =>
    cards.map((content, index) => ({ id: index + 1, content })),
  )

  useEffect(() => {
    if (cards.length) {
      setStack(cards.map((content, index) => ({ id: index + 1, content })))
    }
  }, [cards])

  const sendToBack = (id) => {
    setStack((prev) => {
      const newStack = [...prev]
      const index = newStack.findIndex((card) => card.id === id)
      if (index === -1) return prev
      const [card] = newStack.splice(index, 1)
      newStack.unshift(card)
      return newStack
    })
  }

  const registerMVs = (id, mvs) => {
    if (mvs === null) {
      delete cardMVs.current[id]
    } else {
      cardMVs.current[id] = mvs
    }
  }

  useEffect(() => {
    if (!autoplay || stack.length <= 1 || isPaused) return

    let cancelled = false

    const tick = async () => {
      if (cancelled) return
      const topCard = stack[stack.length - 1]
      const mvs = cardMVs.current[topCard.id]
      if (!mvs) {
        sendToBack(topCard.id)
        return
      }

      setThrowingId(topCard.id)

      // Pull: animate the card off to the right with a slight upward arc.
      // useTransform on x/y in CardRotate gives free rotateY/rotateX tilt as it moves.
      const pullOpts = { duration: 0.28, ease: [0.4, 0, 0.2, 1] }
      const returnOpts = { duration: 0.42, ease: [0, 0, 0.2, 1] }

      animate(mvs.y, -28, pullOpts)
      const pullX = animate(mvs.x, 220, pullOpts)

      try {
        await pullX
      } catch {
        // animation cancelled — bail out gracefully
      }

      if (cancelled) {
        setThrowingId(null)
        return
      }

      // Hand off: reorder the deck so the next render places this card at the back.
      sendToBack(topCard.id)

      // Elastic return: the card eases back from (220, -28) to (0, 0) while the
      // outer wrapper springs into its new back-of-stack scale/rotate.
      animate(mvs.x, 0, returnOpts)
      animate(mvs.y, 0, returnOpts)

      setThrowingId(null)
    }

    const interval = setInterval(tick, autoplayDelay)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [autoplay, autoplayDelay, stack, isPaused])

  return (
    <div
      className="relative h-full w-full"
      style={{ perspective: 600 }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {stack.map((card, index) => {
        const randomRotate = randomRotation ? Math.random() * 10 - 5 : 0
        const isThrowing = throwingId === card.id
        return (
          <CardRotate
            key={card.id}
            cardId={card.id}
            registerMVs={registerMVs}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            disableDrag={shouldDisableDrag || isThrowing}
          >
            <motion.div
              className="h-full w-full overflow-hidden rounded-2xl"
              onClick={() => shouldEnableClick && !isThrowing && sendToBack(card.id)}
              animate={{
                rotateZ: (stack.length - index - 1) * 4 + randomRotate,
                scale: 1 + index * 0.06 - stack.length * 0.06,
                transformOrigin: '90% 90%',
              }}
              initial={false}
              transition={{
                type: 'spring',
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
              }}
              style={{ willChange: 'transform' }}
            >
              {card.content}
            </motion.div>
          </CardRotate>
        )
      })}
    </div>
  )
}
