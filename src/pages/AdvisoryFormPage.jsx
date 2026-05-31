import { useState } from 'react'
import { motion } from 'motion/react'
import Navbar from '../components/Navbar.jsx'

const RELEVANCE_OPTIONS = [
  { value: 'academia', label: 'I work in academia / research' },
  { value: 'social', label: 'I work in the social sector / NGO' },
  { value: 'industry', label: "I'm in industry or building something" },
  { value: 'mentor', label: 'I mentor or advise young people' },
  { value: 'university', label: "I'm connected to a university or lab" },
  { value: 'students', label: "I have students I'd want to send here" },
  { value: 'community', label: 'I work on ground-level community problems' },
  { value: 'other', label: 'Other' },
]

const CONNECTION_OPTIONS = [
  { value: 'advisor', label: 'Advisor or mentor to fellows' },
  { value: 'speaker', label: 'Guest speaker or workshop lead' },
  { value: 'host', label: 'Host a fellow at my lab / org / institution' },
  { value: 'send', label: 'Send students here as applicants' },
  { value: 'problem', label: 'Bring a real problem for a fellow team to work on' },
  { value: 'research', label: 'Research or institutional collaboration' },
  { value: 'informed', label: 'I want to stay informed for now' },
]

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

function TextArea({ label, name, hint, value, onChange }) {
  return (
    <label className="flex flex-col gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
      <span>
        {label}
        {hint && (
          <span className="ml-1 font-normal normal-case tracking-normal text-neutral-500">
            {hint}
          </span>
        )}
      </span>
      <textarea
        name={name}
        rows={4}
        value={value}
        onChange={onChange}
        className="rounded-none border border-black/15 bg-white px-4 py-3 text-[15px] font-normal normal-case tracking-normal text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
    </label>
  )
}

function CheckboxGroup({ options, selected, onToggle }) {
  return (
    <div className="flex flex-col">
      {options.map((opt) => {
        const checked = selected.includes(opt.label)
        return (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-3 border-b border-black/10 py-3 text-[15px] text-ink/90 last:border-b-0"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(opt.label)}
              className="h-[18px] w-[18px] shrink-0 accent-accent"
            />
            <span>{opt.label}</span>
          </label>
        )
      })}
    </div>
  )
}

export default function AdvisoryFormPage() {
  const [form, setForm] = useState({
    name: '',
    role: '',
    email: '',
    problemDescription: '',
    additionalNotes: '',
  })
  const [relevance, setRelevance] = useState([])
  const [connection, setConnection] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const toggle = (setter) => (label) =>
    setter((list) =>
      list.includes(label) ? list.filter((l) => l !== label) : [...list, label]
    )

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    setErrorMsg('')

    if (!form.name.trim()) {
      setErrorMsg('Please enter your name.')
      return
    }
    if (!form.role.trim()) {
      setErrorMsg('Please enter your current role / affiliation.')
      return
    }
    if (!form.email.trim()) {
      setErrorMsg('Please enter your best email to reach you.')
      return
    }
    if (relevance.length === 0) {
      setErrorMsg('Please select at least one option for what feels relevant to you.')
      return
    }
    if (connection.length === 0) {
      setErrorMsg('Please select at least one way you see yourself connecting with REACT.')
      return
    }

    setSubmitting(true)
    try {
      const endpoint = import.meta.env.VITE_ADVISORY_ENDPOINT
      if (!endpoint) throw new Error('Missing VITE_ADVISORY_ENDPOINT')

      const payload = {
        name: form.name,
        role: form.role,
        email: form.email,
        relevance,
        connection,
        problemDescription: form.problemDescription,
        additionalNotes: form.additionalNotes,
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
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pt-40 pb-24 lg:px-10">
        <header>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent">
            REACT Fellowship · Interest Form
          </p>
          <h1 className="mt-5 font-serif text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[1.02] text-ink">
            Tell us how you&rsquo;d like to connect.
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-neutral-600">
            Share a little about yourself and how you see yourself working with
            REACT. Brathikan will follow up personally.
          </p>
        </header>

        {submitted ? (
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mt-14 border-l-[3px] border-accent bg-[#f1ece2] px-7 py-9 sm:px-9 sm:py-12"
          >
            <p className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-tight text-ink">
              Thank you for your interest in REACT.
            </p>
            <p className="mt-6 font-serif-italic text-[1.05rem] leading-[1.65] text-[#5b4d3f]">
              We have your details. Brathikan will be in touch soon to take the
              conversation forward.
            </p>
          </motion.section>
        ) : (
          <form className="mt-14 flex flex-col gap-14" onSubmit={handleSubmit}>
            {/* Personal Details */}
            <section>
              <h2 className="border-b border-black/10 pb-3 font-serif text-[1.5rem] font-semibold text-ink">
                Personal Details
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field
                  label="Name"
                  name="name"
                  required
                  placeholder="e.g., Dr. Jane Smith"
                  value={form.name}
                  onChange={update('name')}
                />
                <Field
                  label="Current role / affiliation"
                  name="role"
                  required
                  placeholder="e.g., Professor at XYZ University"
                  value={form.role}
                  onChange={update('role')}
                />
                <Field
                  label="Best email to reach you"
                  type="email"
                  name="email"
                  required
                  placeholder="your.email@example.com"
                  value={form.email}
                  onChange={update('email')}
                />
              </div>
            </section>

            {/* Relevance */}
            <section>
              <h2 className="border-b border-black/10 pb-3 font-serif text-[1.5rem] font-semibold text-ink">
                Which of these feels most relevant to you?
              </h2>
              <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
                Select all that apply<span className="ml-1 text-accent">*</span>
              </p>
              <div className="mt-4">
                <CheckboxGroup
                  options={RELEVANCE_OPTIONS}
                  selected={relevance}
                  onToggle={toggle(setRelevance)}
                />
              </div>
            </section>

            {/* Connection */}
            <section>
              <h2 className="border-b border-black/10 pb-3 font-serif text-[1.5rem] font-semibold text-ink">
                How do you see yourself connecting with REACT?
              </h2>
              <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
                Pick your top one or two<span className="ml-1 text-accent">*</span>
              </p>
              <div className="mt-4">
                <CheckboxGroup
                  options={CONNECTION_OPTIONS}
                  selected={connection}
                  onToggle={toggle(setConnection)}
                />
              </div>
            </section>

            {/* Problem & Referrals */}
            <section className="flex flex-col gap-6">
              <h2 className="border-b border-black/10 pb-3 font-serif text-[1.5rem] font-semibold text-ink">
                Problem & Notes
              </h2>
              <TextArea
                label="If you're bringing a problem or collaboration, describe it briefly"
                name="problemDescription"
                hint="(what's the problem, who does it affect, what support would you want — optional)"
                value={form.problemDescription}
                onChange={update('problemDescription')}
              />
              <TextArea
                label="Anything else you want us to know ?"
                name="additionalNotes"
                hint="(optional)"
                value={form.additionalNotes}
                onChange={update('additionalNotes')}
              />
            </section>

            {errorMsg && <p className="text-[14px] text-accent">{errorMsg}</p>}

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-14 items-center justify-center bg-accent px-12 py-4 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white transition hover:bg-[#cf4f22] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Submit Form'}
              </button>
            </div>
          </form>
        )}
      </main>
    </>
  )
}
