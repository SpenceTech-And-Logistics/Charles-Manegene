import { useEffect, useRef, useState } from 'react'
import { person, contact, stats, focus, role, education, strengths, majira } from './content.js'

const NAV = [
  ['about', 'About'],
  ['ktda', 'KTDA-MS'],
  ['education', 'Education'],
  ['majira', 'Majira Eco'],
  ['contact', 'Contact'],
]

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { el.classList.add('in'); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('in'); io.disconnect() }
    }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

function Section({ id, label, title, children }) {
  const ref = useReveal()
  return (
    <section id={id} className="section reveal" ref={ref}>
      <div className="wrap">
        <p className="label">{label}</p>
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="top">
      <div className="wrap top-in">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>{person.name}</a>
        <button className="burger" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
        <nav className={open ? 'open' : ''}>
          {NAV.map(([id, t]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{t}</a>
          ))}
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="hero" style={{ '--bg': `url(${person.hero})` }}>
      <div className="wrap hero-in">
        <div className="hero-text">
          <p className="label lime">{person.eyebrow}</p>
          <h1>{person.name}</h1>
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
          <div key={s.label}>
            <b>{s.value}</b>
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
      <p className="intro">{person.intro}</p>
      <div className="cards">
        {focus.map((f, i) => (
          <article key={f.title} className="card">
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
      <div className="role">
        <div className="role-logo"><img src={role.logo} alt={`${role.org} logo`} loading="lazy" /></div>
        <div>
          <h3>{role.org}</h3>
          <p className="meta">{role.dates}</p>
          <p>{role.text}</p>
        </div>
      </div>
      <h3 className="sk-h">Skills at KTDA-MS</h3>
      <ul className="chips">{role.skills.map((s) => <li key={s}>{s}</li>)}</ul>
    </Section>
  )
}

function Education() {
  return (
    <Section id="education" label="Education" title="Agriculture, policy and management">
      <div className="edu">
        {education.map((e) => (
          <article key={e.school} className="edu-card">
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
      <h3 className="sk-h">Further strengths</h3>
      <ul className="chips">{strengths.map((s) => <li key={s}>{s}</li>)}</ul>
    </Section>
  )
}

function Majira() {
  return (
    <section id="majira" className="section majira reveal" ref={useReveal()}>
      <div className="wrap">
        <p className="label lime">{majira.role}</p>
        <h2>{majira.name}</h2>
        <div className="m-grid">
          <div>
            <p>{majira.text}</p>
            <p>{majira.note}</p>
            <div className="m-facts">
              {majira.facts.map((f) => (
                <div key={f.label}><b>{f.value}</b><span>{f.label}</span></div>
              ))}
            </div>
            <p className="mission">{majira.mission}</p>
            <a className="btn" href={majira.link} target="_blank" rel="noreferrer">Majira Eco on LinkedIn</a>
          </div>
          <figure>
            <img src={majira.photo} alt={majira.photoAlt} loading="lazy" />
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
            <li key={k}><span>{k}</span>{href ? <a href={href}>{v}</a> : <b>{v}</b>}</li>
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
