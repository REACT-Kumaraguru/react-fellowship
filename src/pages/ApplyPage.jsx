import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Navbar from '../components/Navbar.jsx'

const tracks = {
  msw: {
    title: 'MSW',
    institution: 'Kumaraguru College of Liberal Arts and Science, Coimbatore',
    body: [
      'Social work trains you to be present where most people look away. You sit with communities that policy has not reached, systems that have failed, and problems that continue because nobody stayed long enough to understand them.',
      "That presence is a founder's starting point. REACT gives it a build track.",
      'Inside your MSW at KCLAS, your mandatory field work across all four semesters becomes a structured venture-building track pointed at one real problem in one real community. Your academic structure, examination schedule, and degree pathway remain entirely unchanged. What changes is what your field work produces.',
      'Your venture can be a technology startup, a social enterprise, or a civic initiative. What it looks like depends on what you find. A community health platform. A rural welfare company. A women’s livelihood enterprise. A child development organization. A civic technology startup. Any of these can be built as any of the three venture types.',
      'If your venture needs technology built, REACT pairs you with STEM interns who build under your direction. You understand the community, the problem, and what the solution needs to do. That knowledge drives the product. The founder who knows the problem is always the one in charge.',
      'REACT is for the MSW student who is ready to build the answer.',
    ],
    produces:
      'What you produce inside your MSW: A publication-quality research paper. A working product built and tested in the community you studied. A registered venture you own before you graduate.',
  },
  polsci: {
    title: 'MA Political Science',
    institution: 'Kumaraguru College of Liberal Arts and Science, Coimbatore',
    body: [
      'Most people spend years learning to read the systems that Political Science students study from day one. Who holds power. Where policy fails. What institutions actually protect.',
      "That understanding is a founder's starting point. REACT gives it a build track.",
      'Inside your degree at KCLAS, the field research, policy analysis, and community work you already do become the foundation for a venture you register and own.',
      'Your venture can be a technology startup, a social enterprise, or a civic initiative. What it looks like depends on the problem you find. A political risk platform. A policy research company. A civic technology startup. An international relations advisory. A public policy think tank. Any of these can be built as any of the three venture types.',
      'If your venture needs technology built, REACT pairs you with STEM interns who build under your direction. You bring the domain knowledge. You know the problem, the system, and what the solution needs to do. That is what drives everything. The founder who understands the problem is always the one in charge.',
      'REACT is for the Political Science student who is ready to be that founder.',
    ],
    produces:
      'What you produce inside your Political Science programme: A publication-quality research paper. A working product or platform built around the system gap you identified. A registered venture — commercial, social, or civic — that you own before you graduate.',
  },
}

function TrackCard({ trackKey, info, selected, onSelect }) {
  const isActive = selected === trackKey
  return (
    <button
      type="button"
      onClick={() => onSelect(trackKey)}
      className={`group relative flex w-full flex-col items-start gap-2 border bg-white/60 p-7 text-left transition-all duration-300 hover:-translate-y-0.5 hover:bg-white ${
        isActive
          ? 'border-accent shadow-[0_18px_55px_-30px_rgba(226,91,42,0.55)]'
          : 'border-black/15 hover:border-neutral-400'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-[3px] transition-opacity duration-300 ${
          isActive ? 'bg-accent opacity-100' : 'bg-accent opacity-0'
        }`}
      />
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
        Track
      </p>
      <h3 className="font-serif text-[1.8rem] font-semibold leading-tight text-ink">
        {info.title}
      </h3>
      <p className="text-[14px] leading-snug text-neutral-600">
        {info.institution}
      </p>
      <span
        className={`mt-3 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] transition-colors duration-300 ${
          isActive ? 'text-accent' : 'text-neutral-500 group-hover:text-ink'
        }`}
      >
        {isActive ? 'Selected' : 'Select this track'}
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      </span>
    </button>
  )
}

function Field({ label, type = 'text', name, required, placeholder, value, onChange }) {
  return (
    <label className="flex flex-col gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
      <span>
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="rounded-none border border-black/15 bg-white px-4 py-3 text-[15px] font-normal normal-case tracking-normal text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
    </label>
  )
}

const ADMISSIONS_URL =
  'https://admissions.kumaraguru.edu.in/arts-pg-application-form'

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      const comma = result.indexOf(',')
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

export default function ApplyPage() {
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '' })
  const [resume, setResume] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const formRef = useRef(null)

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selected || submitting) return
    setSubmitting(true)
    setErrorMsg('')
    try {
      const endpoint = import.meta.env.VITE_APPLY_ENDPOINT
      if (!endpoint) throw new Error('Missing VITE_APPLY_ENDPOINT')

      const resumePart = resume
        ? {
            fileName: resume.name,
            mimeType: resume.type || 'application/octet-stream',
            data: await fileToBase64(resume),
          }
        : null

      const payload = {
        track: selected,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        resume: resumePart,
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow',
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const json = await res.json().catch(() => ({}))
      if (json.status && json.status !== 'ok') {
        throw new Error(json.message || 'Submission rejected')
      }
      setSubmitted(true)
      setForm({ fullName: '', email: '', phone: '' })
      setResume(null)
      formRef.current?.reset()
      // Hand the applicant off to the official Kumaraguru admissions form.
      window.location.href = ADMISSIONS_URL
    } catch (err) {
      const isNetwork =
        err instanceof TypeError || err.message === 'Failed to fetch'
      setErrorMsg(
        isNetwork
          ? 'Could not reach the server. Please check your internet connection (or disable any ad-blocker/VPN) and try again.'
          : err.message || 'Something went wrong. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pt-40 pb-24 lg:px-10">
        <header>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent">
            Application · 2026 Batch
          </p>
          <h1 className="mt-5 font-serif text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[1.02] text-ink">
            You are applying to the 2026 REACT Fellowship.
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-neutral-600">
            Tell us which programme brings you here.
          </p>
        </header>

        <section className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {Object.entries(tracks).map(([key, info]) => (
            <TrackCard
              key={key}
              trackKey={key}
              info={info}
              selected={selected}
              onSelect={setSelected}
            />
          ))}
        </section>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.section
              key={selected}
              initial={{ opacity: 0, y: 18, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="mt-12 border-l-[3px] border-accent bg-[#f1ece2] px-7 py-9 sm:px-9">
                {tracks[selected].body.map((p, i) => (
                  <p
                    key={i}
                    className={`text-[16px] leading-[1.75] text-[#5b4d3f] ${
                      i > 0 ? 'mt-5' : ''
                    }`}
                  >
                    {p}
                  </p>
                ))}
                <p className="mt-7 font-serif-italic text-[1.05rem] font-semibold leading-[1.55] text-ink">
                  {tracks[selected].produces}
                </p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {submitted ? (
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mt-14 border-l-[3px] border-accent bg-[#f1ece2] px-7 py-9 sm:px-9 sm:py-12"
          >
            <p className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-tight text-ink">
              Application received.
            </p>
            <p className="mt-6 font-serif-italic text-[1.05rem] leading-[1.65] text-[#5b4d3f]">
              We have your details and resume. Our team will reach out shortly with
              next steps.
            </p>
          </motion.section>
        ) : (
          <form ref={formRef} className="mt-14" onSubmit={handleSubmit}>
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.4rem)] font-semibold leading-tight text-ink">
              A few details to get you in.
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                label="Full Name"
                name="fullName"
                required
                value={form.fullName}
                onChange={update('fullName')}
              />
              <Field
                label="Email Address"
                type="email"
                name="email"
                required
                value={form.email}
                onChange={update('email')}
              />
              <Field
                label="Phone Number (WhatsApp)"
                type="tel"
                name="phone"
                required
                value={form.phone}
                onChange={update('phone')}
              />
              <label className="flex flex-col gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
                <span>
                  Attach Resume<span className="ml-1 text-accent">*</span>
                </span>
                <input
                  type="file"
                  name="resume"
                  required
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResume(e.target.files?.[0] ?? null)}
                  className="cursor-pointer rounded-none border border-black/15 bg-white px-4 py-3 text-[14px] font-normal normal-case tracking-normal text-ink outline-none transition file:mr-4 file:border-0 file:bg-ink file:px-4 file:py-2 file:text-[12px] file:font-bold file:uppercase file:tracking-[0.14em] file:text-white hover:file:bg-neutral-800 focus:border-accent focus:ring-2 focus:ring-accent/30"
                />
              </label>
            </div>

            {errorMsg && (
              <p className="mt-6 text-[14px] text-accent">{errorMsg}</p>
            )}

            <p className="mt-10 max-w-xl text-[14px] leading-relaxed text-neutral-500">
              Clicking next will submit your application to our admissions team.
            </p>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <button
                type="submit"
                disabled={!selected || submitting}
                className="inline-flex min-h-14 items-center justify-center bg-accent px-9 py-4 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white transition hover:bg-[#cf4f22] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'Sending…' : 'Proceed to My Application'}
              </button>
              <Link
                to="/contact"
                className="text-[12.5px] font-bold uppercase tracking-[0.16em] text-neutral-600 underline-offset-4 transition hover:text-ink hover:underline"
              >
                Or talk to our team first
              </Link>
            </div>
          </form>
        )}
      </main>
    </>
  )
}
