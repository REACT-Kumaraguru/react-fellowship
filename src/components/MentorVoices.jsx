import { CircularTestimonials } from '@/components/ui/circular-testimonials'

// Mapped to the CircularTestimonials shape: { quote, name, designation, src }
const mentorTestimonials = [
  {
    quote:
      'REACT is built around the belief that the people closest to a problem are part of its solution. Watching that philosophy translate into actual student work, semester after semester, is what keeps this program worth being part of.',
    name: 'Shivani',
    designation: 'Molecular Biologist · Research & Innovation',
    src: '/assets/images/Shivani.jpg',
  },
  {
    quote:
      'The structure of REACT reflects a clear understanding of how innovation actually works. It starts with immersion, moves through research, and arrives at building. That arc is not accidental and the outcomes are not either.',
    name: 'Ansu Susan Deepak',
    designation: 'Student at Purdue University · Business Analytics',
    src: '/assets/images/Ansu Susan Deepak.jpg',
  },
  {
    quote:
      'Most programmes prepare students for industry. REACT prepares students for reality. Those are not the same thing.',
    name: 'Janarthanan',
    designation: 'Chevening Scholar at Imperial College London · Sustainable Technologies',
    src: '/assets/images/Janarthanan.jpg',
  },
  {
    quote:
      'What makes REACT impactful is its approach to innovation through design thinking and social entrepreneurship. The focus is not just on building technology, but on understanding real societal challenges across health, education, environment, and livelihoods. When innovation begins with empathy and community needs, it creates solutions that are sustainable, inclusive, and truly meaningful',
    name: 'Dr Lakshmi Meera',
    designation: 'VP - Forge Innovation & Ventures · Innovation Ecosystem Builder',
    src: '/assets/images/Dr Lakshmi Meera.jpg',
  },
  {
    quote:
      'REACT sits in a part of the education landscape that has been mostly empty in India. Applied, community-rooted, venture-oriented, and academically grounded at the same time. The students graduating from it are carrying all four of those qualities together.',
    name: 'Dr Saravanan D',
    designation: 'Director - KCT · Education',
    src: '/assets/images/Saravanan D.jpg',
  },
  {
    quote:
      'The students in REACT are working on problems that practicing engineers spend entire careers circling around. Wave energy. Post-harvest loss. Cardiac early warning. The ambition of the program is matched only by the seriousness with which students take it.',
    name: 'Kabila',
    designation: 'Project Associate at CDFD · Research & Innovation',
    src: '/assets/images/Kabila.jpg',
  },
  {
    quote:
      'The problems REACT works on do not have clean solutions. Shrimp farming health monitoring. Photocatalytic water pipe coatings. Jasmine harvesting robotics. These are complex, context-specific, and consequential. The program takes them seriously and so do the students.',
    name: 'Dhananjay Sing',
    designation: 'IRS Officer · Public Services',
    src: '/assets/images/Dhananjay Sing.jpg',
  },
]

export default function MentorVoices() {
  return (
    <section
      id="mentors"
      className="relative z-10 flex min-h-[640px] flex-col justify-center overflow-hidden bg-canvas py-16 sm:min-h-screen lg:py-20"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent">
            Mentor &amp; Authority Voices
          </p>
          <h2 className="mt-4 font-serif text-[clamp(1.9rem,3.8vw,3.2rem)] font-semibold leading-[1.05] text-ink">
            The people who shape every fellow in the cohort.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15.5px] leading-[1.7] text-[#5b4d3f]">
            Each fellow works with six mentors across the fellowship — faculty,
            research, field, technical, venture, and innovation — assigned to a
            specific phase and a specific purpose.
          </p>
        </div>

        <div className="mt-12 flex w-full justify-center lg:mt-16">
          <CircularTestimonials
            testimonials={mentorTestimonials}
            autoplay
            colors={{
              name: '#0A0A0A',
              designation: '#5b4d3f',
              testimony: '#0A0A0A',
              arrowBackground: '#E25B2A',
              arrowForeground: '#FAF8F5',
              arrowHoverBackground: '#0A0A0A',
            }}
            fontSizes={{
              name: '28px',
              designation: '18px',
              quote: '20px',
            }}
          />
        </div>
      </div>
    </section>
  )
}
