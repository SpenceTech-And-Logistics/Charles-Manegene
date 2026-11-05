import { Fragment, useState } from 'react'
import { person, contact, stats, focus, role, education, strengths, majira } from './content.js'
import { Count, useReveals, useScrollScene } from './motion.jsx'

const NAV = [
  ['about', 'About'],
  ['ktda', 'KTDA-MS'],
  ['education', 'Education'],
  ['majira', 'Majira Eco'],
  ['contact', 'Contact'],
]
const NAV_IDS = NAV.map(([id]) => id)

// Tea leaves drifting down the hero: [left %, size px, seconds to fall, start offset, sideways drift]
const LEAVES = [
  [6, 26, 19, 0, 60], [62, 20, 24, 6, -50], [31, 32, 21, 11, 80], [84, 24, 17, 3, -70],
  [47, 18, 27, 15, 40], [15, 22, 23, 8, -40], [73, 30, 20, 14, 50], [93, 18, 26, 19, -60],
]

function Leaves() {
  return (
    <div className="leaves" aria-hidden="true">
      {LEAVES.map(([left, size, secs, offset, sway]) => (
        <span
          key={left}
          className="leaf"
          style={{ left: `${left}%`, width: size, animationDuration: `${secs}s`, animationDelay: `-${offset}s`, '--sway': `${sway}px` }}
        >
          <svg viewBox="0 0 24 40">
            <path d="M12 1C21 9 23 21 12 39 1 21 3 9 12 1Z" fill="currentColor" />
            <path d="M12 6v32" stroke="#1F3D2B" strokeOpacity=".35" strokeWidth="1" fill="none" />
          </svg>
        </span>
      ))}
    </div>
  )
}

function Section({ id, label, title, children }) {
  return (
    <section id={id} className="section">
      <div className="wrap">
        <p className="label" data-r="">{label}</p>
        <h2 data-r="">{title}</h2>
        {children}
      </div>
    </section>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  useScrollScene(NAV_IDS, setActive)
  return (
    <header className="top">
      <div className="wrap top-in">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>{person.name}</a>
        <button className="burger" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
        <nav className={open ? 'open' : ''}>
          {NAV.map(([id, t], i) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? 'on' : undefined}
              aria-current={active === id ? 'true' : undefined}
              style={{ '--n': i }}
              onClick={() => setOpen(false)}
            >
              {t}
            </a>
          ))}
        </nav>
      </div>
      <div className="progress" aria-hidden="true" />
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-img" style={{ backgroundImage: `url(${person.hero})` }} />
      </div>
      <Leaves />
      <div className="wrap hero-in">
        <div className="hero-text">
          <p className="label lime">{person.eyebrow}</p>
          <h1>
            {person.name.split(' ').map((word) => (
              <Fragment key={word}>
                <span className="word"><span>{word}</span></span>{' '}
              </Fragment>
            ))}
          </h1>
          <p className="lead">{person.headline}</p>
          <p className="tag">{person.tagline}</p>
          <div className="hero-cta">
            <a className="btn" href="#contact">Get in touch</a>
            <a className="btn ghost" href="#ktda">See my work</a>
          </div>
        </div>
        <figure className="portrait">
          <img src={person.photo} alt={`Portrait of ${person.name}`} />
        </figure>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <div className="stats">
      <div className="wrap stats-in">
        {stats.map((s) => (
          <div key={s.label} data-r="">
            <b><Count value={s.value} /></b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function About() {
  return (
    <Section id="about" label="About" title="From the factory floor to the global cup">
      <p className="intro" data-r="">{person.bio}</p>
      <p className="intro" data-r="">{person.intro}</p>
      <div className="cards">
        {focus.map((f, i) => (
          <article key={f.title} className="card" data-r="">
            <span className="num">0{i + 1}</span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}

function Ktda() {
  return (
    <Section id="ktda" label="Current role" title={role.title}>
      <div className="role" data-r="">
        <div className="role-logo"><img src={role.logo} alt={`${role.org} logo`} loading="lazy" /></div>
        <div>
          <h3>{role.org}</h3>
          <p className="meta">{role.dates}</p>
          <p>{role.text}</p>
        </div>
      </div>
      <h3 className="sk-h" data-r="">Skills at KTDA-MS</h3>
      <ul className="chips">{role.skills.map((s) => <li key={s} data-r="pop">{s}</li>)}</ul>
    </Section>
  )
}

function Education() {
  return (
    <Section id="education" label="Education" title="Agriculture, policy and management">
      <div className="edu">
        {education.map((e) => (
          <article key={e.school} className="edu-card" data-r="left">
            <div className="logo"><img src={e.logo} alt={`${e.school} logo`} loading="lazy" /></div>
            <div>
              <h3>{e.award}</h3>
              <p className="school">{e.school}</p>
              {e.when && <p className="meta">{e.when}</p>}
              {e.skills && <p className="sk">{e.skills}</p>}
            </div>
          </article>
        ))}
      </div>
      <h3 className="sk-h" data-r="">Further strengths</h3>
      <ul className="chips">{strengths.map((s) => <li key={s} data-r="pop">{s}</li>)}</ul>
    </Section>
  )
}

function Majira() {
  return (
    <section id="majira" className="section majira">
      <div className="wrap">
        <p className="label lime" data-r="">{majira.role}</p>
        <h2 data-r="">{majira.name}</h2>
        <div className="m-grid">
          <div>
            <p data-r="">{majira.text}</p>
            <p data-r="">{majira.note}</p>
            <div className="m-facts" data-r="">
              {majira.facts.map((f) => (
                <div key={f.label}><b><Count value={f.value} /></b><span>{f.label}</span></div>
              ))}
            </div>
            <p className="mission" data-r="">{majira.mission}</p>
            <div data-r=""><a className="btn" href={majira.link} target="_blank" rel="noreferrer">Majira Eco on LinkedIn</a></div>
          </div>
          <figure data-r="clip">
            <img src={majira.photo} alt={majira.photoAlt} loading="lazy" data-drift="" />
          </figure>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [sent, setSent] = useState(false)
  const rows = [
    contact.email && ['Email', contact.email, `mailto:${contact.email}`],
    contact.phone && ['Phone', contact.phone, `tel:${contact.phone.replace(/\s/g, '')}`],
    contact.linkedin && ['LinkedIn', 'View profile', contact.linkedin],
    contact.location && ['Based in', contact.location, null],
  ].filter(Boolean)

  async function submit(e) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    try {
      const r = await fetch(`https://formspree.io/f/${contact.formspree}`, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      if (r.ok) setSent(true)
    } catch { /* leave form visible */ }
  }

  return (
    <Section id="contact" label="Contact" title="Let's talk">
      <div className="contact">
        <ul className="clist">
          {rows.map(([k, v, href]) => (
            <li key={k} data-r=""><span>{k}</span>{href ? <a href={href}>{v}</a> : <b>{v}</b>}</li>
          ))}
        </ul>
        {contact.formspree && (
          sent ? <p className="thanks">Thank you. Your message has been sent.</p> : (
            <form onSubmit={submit}>
              <input name="name" placeholder="Your name" required />
              <input name="email" type="email" placeholder="Your email" required />
              <textarea name="message" placeholder="How can I help?" rows="4" required />
              <button className="btn" type="submit">Send message</button>
            </form>
          )
        )}
      </div>
    </Section>
  )
}

export default function App() {
  useReveals()
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <About />
        <Ktda />
        <Education />
        <Majira />
        <Contact />
      </main>
      <footer className="foot">
        <div className="wrap">
          <p>© {new Date().getFullYear()} {person.name}. All rights reserved.</p>
          <p>Built by SpenceTec and Logistics Limited</p>
        </div>
      </footer>
    </>
  )
}
