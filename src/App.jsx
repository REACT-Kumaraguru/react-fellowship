import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import ApplyPage from './pages/ApplyPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import JourneyPage from './pages/JourneyPage.jsx'
import AdvisoryFormPage from './pages/AdvisoryFormPage.jsx'

// BrowserRouter does not auto-scroll to a URL hash. This scrolls to the hash
// target after navigation (e.g. clicking "What You Leave With" from /journey),
// and scrolls to top on a plain route change.
function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      let raf
      let timer
      const scrollToTarget = () => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
          return true
        }
        return false
      }
      // The target may not be mounted yet when arriving from another route —
      // try next frame, then retry once shortly after.
      raf = requestAnimationFrame(() => {
        if (!scrollToTarget()) timer = setTimeout(scrollToTarget, 120)
      })
      return () => {
        cancelAnimationFrame(raf)
        clearTimeout(timer)
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/advisory-form" element={<AdvisoryFormPage />} />
      </Routes>
    </div>
  )
}
