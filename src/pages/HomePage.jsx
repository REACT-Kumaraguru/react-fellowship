import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import WhatRemains from '../components/WhatRemains.jsx'
import Programme from '../components/Programme.jsx'
import Outcomes from '../components/Outcomes.jsx'
import MentorVoices from '../components/MentorVoices.jsx'
import StudentVoices from '../components/StudentVoices.jsx'
import ApplySteps from '../components/ApplySteps.jsx'
import Velorah from '../components/Velorah.jsx'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pt-40 pb-12 lg:px-10">
        <Hero />
      </main>
      <WhatRemains />
      <Programme />
      <Outcomes />
      <MentorVoices />
      <StudentVoices />
      <div className="flex flex-col justify-center text-center">
        <div className="text-center">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-[#E66A2C]">
            GLOBAL RECOGNITION
          </p>

          <h2
            className="mb-8 text-[72px] leading-[0.95] tracking-[-0.04em] text-black"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            REACT - Featured in the YOUNGO
            <br />
            Youth Project Compilation.
          </h2>

          <p className="mx-auto max-w-lg text-[20px] leading-[1.6] text-[#4A5565]">
            Recognized by YOUNGO (UNFCCC Youth Constituency) in the 2025 Youth Project
            Compilation on Food, Agriculture and Climate Action for REACT's
            contributions to youth-led social innovation and sustainable development.
          </p>
          <div className="mt-8">
            <a
              href="https://unfccc.int/sites/default/files/resource/YOUNGO-20251205_Youth-project-compilation-on%20food%2Cagriculture-and-climate-action.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-[#E66A2C] px-8 py-4 text-[15px] font-semibold text-white transition-all hover:bg-[#d55e24] hover:shadow-lg"
            >
              Know more about this
            </a>
          </div>
        </div>
      </div>
            <ApplySteps />
      <Velorah />
    </>
  )
}
