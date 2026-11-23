import { useEffect, useMemo, useState } from 'react'
import './App.css'

const projects = [
  { niche: 'Real Estate', format: 'short', title: 'Luxury Property Reel', icon: '⌂' },
  { niche: 'Gaming', format: 'short', title: 'Gaming Highlight Edit', icon: '🎮' },
  { niche: 'Talking Heads', format: 'short', title: 'Creator Talking Head', icon: '◉' },
  { niche: 'Clipping', format: 'short', title: 'Best Moments & Highlights', icon: '✂' },
  { niche: 'Real Estate', format: 'short', title: 'Property Walkthrough', icon: '⌂' },
  { niche: 'Gaming', format: 'short', title: 'Level Up Montage', icon: '🎮' },
  { niche: 'Talking Heads', format: 'short', title: 'Business Content', icon: '◉' },
  { niche: 'Clipping', format: 'short', title: 'Podcast & Stream Clips', icon: '✂' },
  { niche: 'Real Estate', format: 'long', title: 'Complete Property Tour', icon: '⌂' },
  { niche: 'Gaming', format: 'long', title: 'Gaming Video Episode', icon: '🎮' },
  { niche: 'Talking Heads', format: 'long', title: 'YouTube Interview', icon: '◉' },
  { niche: 'Vlogs', format: 'long', title: 'Lifestyle & Travel Vlog', icon: '▶' },
  { niche: 'Podcast', format: 'long', title: 'Full Podcast Episode', icon: '🎙' },
]

const thumbnails = [
  { niche: 'Real Estate', before: 'PROPERTY', after: 'DREAM HOME' },
  { niche: 'Gaming', before: 'GAMEPLAY', after: 'LEVEL UP' },
  { niche: 'Talking Heads', before: 'NEW VIDEO', after: 'STOP THIS' },
  { niche: 'Real Estate', before: 'HOUSE TOUR', after: 'VIEW NOW' },
  { niche: 'Gaming', before: 'NEXT ROUND', after: 'GAME ON' },
  { niche: 'Talking Heads', before: 'BUSINESS', after: 'TRUST ME' },
]

const services = [
  {
    icon: '▯',
    title: 'Short-form editing',
    tags: ['Real Estate', 'Gaming', 'Talking Heads', 'Clipping'],
    desc: 'Scroll-stopping short videos made to hold attention and drive engagement.',
    points: [
      'Reels, Shorts & TikToks',
      'Captions and transitions',
      'Sound design and storytelling',
    ],
    time: 'Flexible turnaround',
  },
  {
    icon: '▷',
    title: 'Long-form editing',
    tags: ['Real Estate', 'Gaming', 'Talking Heads', 'Vlogs', 'Podcast'],
    desc: 'Professional long-form videos that keep your audience watching.',
    points: [
      'YouTube videos and interviews',
      'Story structure and pacing',
      'Audio and colour correction',
    ],
    time: 'Project-based timeline',
  },
  {
    icon: '▧',
    title: 'Thumbnails',
    tags: ['Real Estate', 'Gaming', 'Talking Heads'],
    desc: 'Eye-catching thumbnails designed to make people click.',
    points: [
      'Custom visual concepts',
      'Readable typography',
      'Platform-ready designs',
    ],
    time: 'Quick delivery',
  },
  {
    icon: '◎',
    title: 'Shoots',
    tags: ['Real Estate', 'India'],
    desc: 'Professional shoots for brands and properties.',
    points: [
      'Real estate shoots',
      'Creative direction',
      'Professional footage',
    ],
    time: 'Scheduled in advance',
  },
]

const calculatorSteps = [
  {
    key: 'stage',
    title: 'Creator Stage',
    heading: 'What’s your creator stage?',
    description: 'Help us understand your content creation level.',
    options: [
      ['New Creator', '0–10K subscribers', 400],
      ['Growing Creator', '10K–100K subscribers', 400],
      ['Established Creator', '100K–1M subscribers', 400],
      ['Big Creator', '1M–10M subscribers', 400],
      ['Brand / Company', 'Any size', 400],
    ],
  },
  {
    key: 'type',
    title: 'Content Type',
    heading: 'What type of content do you create?',
    description: 'Choose the content type closest to your project.',
    options: [
      ['Talking Head / Business', 'Personal brands, founders and coaches', 1],
      ['Vlog / Lifestyle', 'Daily vloggers, travel and lifestyle creators', 1.22],
      ['Reaction / Commentary', 'Commentary and reaction creators', 1.15],
      ['Tech / Reviews', 'Tech, gadget and product reviewers', 1.2],
      ['Education / Explainer', 'Knowledge and tutorial creators', 1.1],
      ['Real Estate / Property', 'Property tours and developers', 1.2],
      ['Podcast / Interviews', 'Long conversations and interviews', 1],
      ['Documentary / Storytelling', 'Story-driven and cinematic creators', 1.5],
      ['Gaming / Streaming', 'Gamers, streamers and gameplay channels', 1.3],
      ['Other Type', 'Any other type of video', 1.2],
    ],
  },
  {
    key: 'length',
    title: 'Video Length',
    heading: 'What’s your typical video length?',
    description: 'Choose the average final video duration.',
    options: [
      ['0–8 minutes', 'Short-form / quick videos', 1],
      ['8–15 minutes', 'Standard YouTube video', 1.15],
      ['15–30 minutes', 'In-depth content', 1.35],
      ['30–60 minutes', 'Long-form content', 1.6],
      ['60+ minutes', 'Extended content', 2],
    ],
  },
  {
    key: 'raw',
    title: 'Raw Footage',
    heading: 'How much raw footage do you have?',
    description: 'Select the approximate raw footage size per video.',
    options: [
      ['Less than 50 GB', '3–4 days turnaround', 1],
      ['50 GB – 100 GB', '4–5 days turnaround', 1],
      ['100 GB – 200 GB', '5–6 days turnaround', 1],
      ['200 GB – 500 GB', '6–8 days turnaround', 1],
      ['500 GB – 1 TB', '8–10 days turnaround', 1],
      ['1 TB Plus', '10–14 days turnaround', 1],
    ],
  },
  {
    key: 'style',
    title: 'Editing Style',
    heading: 'Choose your editing style',
    description: 'Select the editing approach that matches your vision.',
    options: [
      ['Clean Editing', 'Smooth cuts, balanced audio and basic colour correction', 1],
      ['Creator Style', 'Jump cuts, zooms, text highlights and music', 1.25],
      ['High-Energy Editing', 'Fast cuts, motion graphics and sound effects', 1.45],
      ['Premium Editing', 'Advanced colour grading and polished storytelling', 1.8],
    ],
  },
]

const volumeOptions = [
  { count: 1, discount: 0 },
  { count: 2, discount: 0.1 },
  { count: 4, discount: 0.2 },
  { count: 6, discount: 0.3 },
  { count: 8, discount: 0.35 },
  { count: 10, discount: 0.4 },
]

const aboutMilestones = [
  {
    title: 'How it began',
    description: 'The first steps of the Prime Productions journey.',
  },
  {
    title: 'First projects',
    description: 'Taking on projects and building creative experience.',
  },
  {
    title: 'Finding our focus',
    description: 'Exploring niches and finding our creative direction.',
  },
  {
    title: 'Going official',
    description: 'Building a dedicated identity for Prime Productions.',
  },
  {
    title: 'Growing the team',
    description: 'Bringing creative people together to do better work.',
  },
  {
    title: 'Learning and improving',
    description: 'Improving our editing, storytelling and workflow.',
  },
  {
    title: 'Building a process',
    description: 'Creating a more consistent process from brief to delivery.',
  },
  {
    title: 'Today',
    description: 'Creating videos and thumbnails for brands and creators.',
  },
]

function ProjectArt({ niche }) {
  return (
    <div className={`project-art ${niche.toLowerCase().replaceAll(' ', '-')}`}>
      {niche === 'Real Estate' ? (
        <div className="building-scene">
          <div className="tower one" />
          <div className="tower two" />
          <div className="house"><span /></div>
          <i className="pin">●</i>
        </div>
      ) : niche === 'Gaming' ? (
        <div className="controller">
          ✣<span>●</span><b>●</b>
        </div>
      ) : niche === 'Vlogs' ? (
        <div className="vlog-scene">
          <div className="vlog-frame">
            <span className="vlog-sun" />
            <span className="vlog-mountain one" />
            <span className="vlog-mountain two" />
            <span className="vlog-play">▶</span>
          </div>
          <span className="vlog-camera">●</span>
        </div>
      ) : (
        <div className="person-scene">
          <div className="head" />
          <div className="body-shape" />
          <div className="mic" />
        </div>
      )}
    </div>
  )
}

/* =========================
   BOOKING MODAL
========================= */

function BookingModal({ open, onClose }) {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    service: 'Real estate videos',
    date: '',
    time: '',
    note: '',
  })

  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (!open) return

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', closeOnEscape)

    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open, onClose])

  useEffect(() => {
    if (open) setStatus('idle')
  }, [open])

  if (!open) return null

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function submit(event) {
    event.preventDefault()
    setStatus('sending')

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error('Booking request failed')
      }

      setStatus('success')
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="modal booking-modal" role="dialog" aria-modal="true">
        <button
          type="button"
          className="close-modal"
          onClick={onClose}
        >
          ×
        </button>

        {status === 'success' ? (
          <div className="success-message">
            <h2>Booking Request Sent!</h2>

            <p>
              Your preferred date and time have been submitted.
              We’ll get back to you to confirm the call.
            </p>

            <button
              type="button"
              className="btn btn-line"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <span className="eyebrow">BOOK A CALL</span>

            <h2>Let's Talk</h2>

            <p>Choose your preferred date and time for a call.</p>

            <label>Your Name</label>
            <input
              required
              value={form.name}
              placeholder="Enter your name"
              onChange={(event) => update('name', event.target.value)}
            />

            <label>WhatsApp or Email</label>
            <input
              required
              value={form.contact}
              placeholder="Enter your contact"
              onChange={(event) => update('contact', event.target.value)}
            />

            <label>Preferred Date</label>
            <input
              required
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={form.date}
              onChange={(event) => update('date', event.target.value)}
            />

            <label>Preferred Time</label>
            <input
              required
              type="time"
              value={form.time}
              onChange={(event) => update('time', event.target.value)}
            />

            <label>What do you need?</label>
            <select
              value={form.service}
              onChange={(event) => update('service', event.target.value)}
            >
              <option>Real estate videos</option>
              <option>Gaming videos</option>
              <option>Talking heads for business</option>
              <option>Clipping</option>
              <option>Vlogs</option>
              <option>Podcast</option>
              <option>Thumbnails</option>
              <option>Something else</option>
            </select>

            <label>Anything you want to discuss? (Optional)</label>
            <textarea
              rows="3"
              value={form.note}
              placeholder="Tell us a little about your project"
              onChange={(event) => update('note', event.target.value)}
            />

            {status === 'error' && (
              <p className="error-text">
                Booking request could not be sent. Check your backend connection.
              </p>
            )}

            <button
              className="btn btn-fill send-btn"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Sending...' : 'Request a Call →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

/* =========================
   PLAN CALCULATOR
========================= */

function CalculatorModal({ open, onClose, onBookCall }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [currency, setCurrency] = useState('USD')
  const [shorts, setShorts] = useState(0)
  const [thumbnailsCount, setThumbnailsCount] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const rate = 85

  useEffect(() => {
    if (!open) return

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', closeOnEscape)

    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      setStep(0)
      setAnswers({})
      setShorts(0)
      setThumbnailsCount(0)
      setShowResult(false)
      setCurrency('USD')
    }
  }, [open])

  if (!open) return null

  const selectedStage = calculatorSteps[0].options[answers.stage]
  const selectedType = calculatorSteps[1].options[answers.type]
  const selectedLength = calculatorSteps[2].options[answers.length]
  const selectedRaw = calculatorSteps[3].options[answers.raw]
  const selectedStyle = calculatorSteps[4].options[answers.style]
  const selectedVolume = volumeOptions[answers.volume]

  const basePrice = selectedStage?.[2] || 400

  const unitPrice = Math.round(
    basePrice *
    (selectedType?.[2] || 1) *
    (selectedLength?.[2] || 1) *
    (selectedRaw?.[2] || 1) *
    (selectedStyle?.[2] || 1)
  )

  const quantity = selectedVolume?.count || 1
  const discount = selectedVolume?.discount || 0

  const editingTotal = unitPrice * quantity * (1 - discount)
  const addOnTotal = shorts * 50 + thumbnailsCount * quantity * 30
  const total = editingTotal + addOnTotal

  function money(value) {
    if (currency === 'USD') {
      return `$${Math.round(value).toLocaleString('en-US')}`
    }

    return `₹${Math.round(value * rate).toLocaleString('en-IN')}`
  }

  function selectOption(key, index) {
    setAnswers((current) => ({
      ...current,
      [key]: index,
    }))
  }

  function next() {
    if (step < 6) {
      setStep((current) => current + 1)
    } else {
      setShowResult(true)
    }
  }

  function back() {
    if (showResult) {
      setShowResult(false)
      setStep(6)
    } else if (step > 0) {
      setStep((current) => current - 1)
    }
  }

  const currentStep = calculatorSteps[step]
  const stepKey = currentStep?.key

  const canContinue =
    step === 5
      ? answers.volume !== undefined
      : step === 6
        ? true
        : answers[stepKey] !== undefined

  return (
    <div className="plan-overlay" role="dialog" aria-modal="true">
      <button
        type="button"
        className="plan-close"
        onClick={onClose}
      >
        ×
      </button>

      <div className="plan-container">
        {!showResult ? (
          <>
            <div className="plan-top">
              <span className="plan-kicker">
                ✦ CUSTOM PLAN CALCULATOR
              </span>

              <h1>
                Get Your Custom Plan <em>Now.</em>
              </h1>

              <p>
                Transparent pricing tailored to your content type,
                editing style and monthly volume.
              </p>
            </div>

            <div className="plan-progress">
              <div className="plan-progress-label">
                <span>
                  STEP {step + 1} OF 7 · {
                    step === 5
                      ? 'MONTHLY VOLUME'
                      : step === 6
                        ? 'ADD-ONS'
                        : currentStep.title.toUpperCase()
                  }
                </span>

                <span>{Math.round(((step + 1) / 7) * 100)}%</span>
              </div>

              <div className="plan-progress-track">
                <span
                  style={{
                    width: `${((step + 1) / 7) * 100}%`,
                  }}
                />
              </div>
            </div>

            {step < 5 ? (
              <div className="plan-step">
                <h2>{currentStep.heading}</h2>
                <p>{currentStep.description}</p>

                <div
                  className={`plan-options ${
                    step === 1 || step === 3 || step === 4
                      ? 'two-column'
                      : ''
                  }`}
                >
                  {currentStep.options.map((option, index) => (
                    <button
                      type="button"
                      key={option[0]}
                      className={`plan-option ${
                        answers[stepKey] === index ? 'chosen' : ''
                      }`}
                      onClick={() => selectOption(stepKey, index)}
                    >
                      <span className="plan-option-check">
                        {answers[stepKey] === index ? '✓' : ''}
                      </span>

                      <b>{option[0]}</b>
                      <small>{option[1]}</small>

                      {step === 4 && (
                        <span className="plan-multiplier">
                          {option[2]}× style level
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : step === 5 ? (
              <div className="plan-step">
                <h2>How many videos per month?</h2>

                <p>
                  Choose your monthly volume to unlock volume discounts.
                </p>

                <div className="plan-options two-column">
                  {volumeOptions.map((option, index) => {
                    const subtotal = unitPrice * option.count
                    const discounted = subtotal * (1 - option.discount)

                    return (
                      <button
                        type="button"
                        key={option.count}
                        className={`plan-option ${
                          answers.volume === index ? 'chosen' : ''
                        }`}
                        onClick={() => selectOption('volume', index)}
                      >
                        <b>
                          {option.count === 10
                            ? '10+ Videos'
                            : `${option.count} ${
                                option.count === 1 ? 'Video' : 'Videos'
                              }`}
                        </b>

                        <small>Per month</small>

                        {option.discount > 0 && (
                          <span className="plan-discount">
                            {option.discount * 100}% volume discount
                          </span>
                        )}

                        <strong>{money(discounted)}</strong>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="plan-step">
                <h2>Enhance Your Package</h2>

                <p>
                  Boost your content with premium add-ons and services.
                </p>

                <div className="plan-addon-group">
                  <h3>Short-Form Content</h3>

                  <p>
                    Repurpose your content into engaging shorts · $50 each
                  </p>

                  <div className="plan-addon-options">
                    {[0, 5, 10, 15, 20, 30, 50, 100].map((count) => (
                      <button
                        type="button"
                        key={count}
                        className={shorts === count ? 'chosen' : ''}
                        onClick={() => setShorts(count)}
                      >
                        <b>{count}</b>
                        <small>
                          {count === 1 ? 'short' : 'shorts'}/month
                        </small>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="plan-addon-group">
                  <h3>Custom Thumbnails</h3>

                  <p>Professional thumbnails · $30 each</p>

                  <div className="plan-addon-options">
                    {[0, 1, 2, 3].map((count) => (
                      <button
                        type="button"
                        key={count}
                        className={
                          thumbnailsCount === count ? 'chosen' : ''
                        }
                        onClick={() => setThumbnailsCount(count)}
                      >
                        <b>{count === 0 ? 'No' : count}</b>

                        <small>
                          {count === 1
                            ? 'per video'
                            : count === 0
                              ? 'thumbnails'
                              : 'per video'}
                        </small>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="plan-bottom">
              <button
                type="button"
                className="btn btn-line"
                onClick={back}
                disabled={step === 0}
              >
                ← Back
              </button>

              <button
                type="button"
                className="btn btn-fill"
                onClick={next}
                disabled={!canContinue}
              >
                {step === 6 ? 'View My Estimate →' : 'Continue →'}
              </button>
            </div>

            <div className="plan-estimate-mini">
              <span>Estimated base price per video</span>
              <strong>{money(unitPrice)}</strong>
            </div>
          </>
        ) : (
          <div className="plan-result">
            <span className="plan-kicker">✦ YOUR PERSONAL PLAN</span>

            <h1>
              Your Custom Plan is <em>Ready!</em>
            </h1>

            <p>
              Here’s an estimate based on the options you selected.
            </p>

            <div className="currency-switch">
              <button
                className={currency === 'USD' ? 'active' : ''}
                onClick={() => setCurrency('USD')}
              >
                $ USD
              </button>

              <button
                className={currency === 'INR' ? 'active' : ''}
                onClick={() => setCurrency('INR')}
              >
                ₹ INR
              </button>
            </div>

            <div className="plan-breakdown">
              <div>
                <span>Base editing price per video</span>
                <b>{money(unitPrice)}</b>
              </div>

              <div>
                <span>Monthly video quantity</span>
                <b>{quantity} videos</b>
              </div>

              <div>
                <span>Editing total after volume discount</span>
                <b>{money(editingTotal)}</b>
              </div>

              <div>
                <span>Short-form add-ons ({shorts})</span>
                <b>{money(shorts * 50)}</b>
              </div>

              <div>
                <span>
                  Thumbnail add-ons ({thumbnailsCount * quantity})
                </span>
                <b>{money(thumbnailsCount * quantity * 30)}</b>
              </div>

              <div className="plan-total">
                <span>Estimated monthly total</span>
                <strong>{money(total)}</strong>
              </div>
            </div>

            <div className="plan-selections">
              <h3>Your Selections</h3>

              <p><b>Creator stage:</b> {selectedStage?.[0]}</p>
              <p><b>Content type:</b> {selectedType?.[0]}</p>
              <p><b>Video length:</b> {selectedLength?.[0]}</p>
              <p><b>Raw footage:</b> {selectedRaw?.[0]}</p>
              <p><b>Editing style:</b> {selectedStyle?.[0]}</p>
              <p><b>Monthly volume:</b> {quantity} videos</p>
            </div>

            <p className="plan-disclaimer">
              This is an estimated plan based on the calculator's sample
              pricing. Final pricing can be confirmed after discussing
              your project.
            </p>

            <div className="plan-bottom">
              <button
                type="button"
                className="btn btn-line"
                onClick={back}
              >
                ← Edit Plan
              </button>

              <button
                type="button"
                className="btn btn-fill"
                onClick={() => {
                  onClose()
                  onBookCall()
                }}
              >
                Book a Call →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* =========================
   HEADER
========================= */

function Header({ theme, toggleTheme, navigate, openBooking }) {
  function goToSection(section) {
    navigate('/')

    setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({
        behavior: 'smooth',
      })
    }, 100)
  }

  return (
    <div className="wrap">
      <header className="header">
        <a
          className="brand"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            navigate('/')
          }}
        >
          <span className="brand-mark">P</span>
          Prime Productions
        </a>

        <nav>
          <a
            href="/work"
            onClick={(event) => {
              event.preventDefault()
              navigate('/work')
            }}
          >
            Work
          </a>

          <a
            href="/#thumbs"
            onClick={(event) => {
              event.preventDefault()
              goToSection('thumbs')
            }}
          >
            Thumbnails
          </a>

          <a
            href="/#niches"
            onClick={(event) => {
              event.preventDefault()
              goToSection('niches')
            }}
          >
            Niches
          </a>

          <a
            href="/#services"
            onClick={(event) => {
              event.preventDefault()
              goToSection('services')
            }}
          >
            What we do
          </a>

          <a
            href="/#pricing"
            onClick={(event) => {
              event.preventDefault()
              goToSection('pricing')
            }}
          >
            Pricing
          </a>

          <a
            href="/about"
            onClick={(event) => {
              event.preventDefault()
              navigate('/about')
            }}
          >
            About
          </a>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
          >
            <span className="theme-icon">
              {theme === 'dark' ? '☀' : '☾'}
            </span>

            <span className="theme-label">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          <button
            type="button"
            className="btn-ghost"
            onClick={openBooking}
          >
            Book a Call →
          </button>
        </div>
      </header>
    </div>
  )
}

/* =========================
   WORK PAGE
========================= */

function WorkPage({
  navigate,
  openBooking,
  theme,
  toggleTheme,
}) {
  const [format, setFormat] = useState('short')
  const [niche, setNiche] = useState('All')

  const categories = format === 'short'
    ? ['All', 'Real Estate', 'Gaming', 'Talking Heads', 'Clipping']
    : ['All', 'Real Estate', 'Gaming', 'Talking Heads', 'Vlogs', 'Podcast']

  const visibleProjects = projects.filter(
    (project) =>
      project.format === format &&
      (niche === 'All' || project.niche === niche)
  )

  return (
    <div className="site-shell page-shell" data-theme={theme}>
      <div className="ambient-glow" />

      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        navigate={navigate}
        openBooking={openBooking}
      />

      <main className="wrap inner-page">
        <div className="eyebrow">OUR PORTFOLIO</div>

        <h1 className="display-heading">
          SELECTED <em>WORK.</em>
        </h1>

        <p className="section-sub">
          Explore our short-form and long-form video editing work.
        </p>

        <div className="segmented centered">
          {['short', 'long'].map((item) => (
            <button
              type="button"
              key={item}
              className={format === item ? 'active' : ''}
              onClick={() => {
                setFormat(item)
                setNiche('All')
              }}
            >
              {item === 'short' ? 'Short-form' : 'Long-form'}
            </button>
          ))}
        </div>

        <div className="chips centered">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={niche === item ? 'active' : ''}
              onClick={() => setNiche(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className={`work-grid ${format}`}>
          {visibleProjects.map((project, index) => (
            <article
              className="work-tile"
              key={`${project.title}-${index}`}
            >
              <span className="tile-niche">{project.niche}</span>
              <div className="tile-icon">{project.icon}</div>
              <span className="tile-title">{project.title}</span>
              <span className="tile-play">▶</span>
            </article>
          ))}
        </div>

        {visibleProjects.length === 0 && (
          <p className="section-sub">
            No projects found in this category yet.
          </p>
        )}

        <div className="callout">
          <h3>Have a project in mind?</h3>

          <button
            type="button"
            className="btn btn-fill"
            onClick={openBooking}
          >
            Let's Talk →
          </button>
        </div>

        <button
          type="button"
          className="btn btn-line page-back"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>
      </main>
    </div>
  )
}

/* =========================
   ABOUT PAGE
========================= */

function AboutPage({
  navigate,
  openBooking,
  theme,
  toggleTheme,
}) {
  return (
    <div className="site-shell page-shell" data-theme={theme}>
      <div className="ambient-glow" />

      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        navigate={navigate}
        openBooking={openBooking}
      />

      <main className="wrap inner-page about-page">
        <div className="eyebrow">OUR STORY</div>

        <h1 className="display-heading">
          THE STORY OF <em>PRIME PRODUCTIONS.</em>
        </h1>

        <p className="section-sub">
          A creative journey built around storytelling, editing
          and making every frame matter.
        </p>

        <div className="about-timeline">
          {aboutMilestones.map((item, index) => (
            <article
              className={`about-milestone ${
                index % 2 ? 'right' : 'left'
              }`}
              key={item.title}
            >
              <span className="milestone-number">
                0{index + 1}
              </span>

              <div className="milestone-card">
                <span className="milestone-label">
                  MILESTONE {index + 1}
                </span>

                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="callout">
          <h3>Let's create something that matters.</h3>

          <button
            type="button"
            className="btn btn-fill"
            onClick={openBooking}
          >
            Book a Call →
          </button>
        </div>

        <button
          type="button"
          className="btn btn-line page-back"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>
      </main>
    </div>
  )
}

/* =========================
   PRICING SECTION
========================= */

function PricingSection({ openCalculator, openBooking }) {
  const [currency, setCurrency] = useState('INR')

  const plans = [
    {
      name: 'Per Video',
      description: 'Pay as you go, one video at a time.',
      features: [
        'One edited video',
        'Revisions included',
        'Delivery timeline discussed',
        'Short-form or long-form',
      ],
      button: 'Get Started',
      style: 'standard',
    },
    {
      name: 'Pro Plan',
      description: 'For creators and brands posting regularly.',
      features: [
        'Monthly video package',
        'Priority delivery',
        'Thumbnails can be included',
        'Dedicated editing workflow',
      ],
      button: 'Choose Pro',
      style: 'hot',
    },
    {
      name: 'Talented 1% Plan',
      description: 'For teams that want the best of everything.',
      features: [
        'Everything in Pro',
        'Priority support',
        'Content planning discussion',
        'Shoots in India can be discussed',
      ],
      button: 'Choose Talented 1%',
      style: 'top',
    },
  ]

  return (
    <section className="wrap section pricing-section" id="pricing">
      <div className="eyebrow">PRICING</div>

      <h2 className="display-heading">
        SIMPLE PLANS. <em>BIG IMPACT.</em>
      </h2>

      <p className="section-sub">
        Choose a plan that works for your content and goals.
      </p>

      <div className="currency-switch">
        <button
          className={currency === 'INR' ? 'active' : ''}
          onClick={() => setCurrency('INR')}
        >
          ₹ INR
        </button>

        <button
          className={currency === 'USD' ? 'active' : ''}
          onClick={() => setCurrency('USD')}
        >
          $ USD
        </button>
      </div>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <article
            className={`pricing-card ${plan.style}`}
            key={plan.name}
          >
            {plan.style === 'hot' && (
              <span className="pricing-badge">
                MOST POPULAR
              </span>
            )}

            {plan.style === 'top' && (
              <span className="pricing-badge">
                TOP 1%
              </span>
            )}

            <h3>{plan.name}</h3>
            <p>{plan.description}</p>

            <div className="pricing-amount">
              <strong>Custom</strong>
              <span>{currency} · Quote</span>
            </div>

            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <button
              type="button"
              className={`btn ${
                plan.style === 'hot' ? 'btn-fill' : 'btn-line'
              }`}
              onClick={() =>
                plan.style === 'standard'
                  ? openCalculator()
                  : openBooking()
              }
            >
              {plan.button} →
            </button>
          </article>
        ))}
      </div>

      <div className="callout">
        <h3>Need something different?</h3>

        <button
          type="button"
          className="btn btn-fill"
          onClick={openCalculator}
        >
          Get Custom Plan →
        </button>
      </div>
    </section>
  )
}

/* =========================
   TESTIMONIALS SECTION
========================= */

function TestimonialsSection() {
  return (
    <section className="wrap section testimonials-section">
      <div className="eyebrow">TESTIMONIALS</div>

      <h2 className="display-heading">
        BUILT ON <em>CREATIVE TRUST.</em>
      </h2>

      <p className="section-sub">
        Client feedback and project stories will be featured here.
      </p>

      <div className="testimonial-placeholder">
        <span className="testimonial-quote">“</span>

        <h3>Good work speaks through the results.</h3>

        <p>
          Client testimonials will be added here as projects
          and feedback are shared.
        </p>
      </div>
    </section>
  )
}

/* =========================
   MAIN APP
========================= */

function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('prime-theme') || 'dark'
    } catch {
      return 'dark'
    }
  })

  const [page, setPage] = useState(() => {
    const path = window.location.pathname

    return path === '/work'
      ? 'work'
      : path === '/about'
        ? 'about'
        : 'home'
  })

  const [bookingOpen, setBookingOpen] = useState(false)
  const [calculatorOpen, setCalculatorOpen] = useState(false)

  const [format, setFormat] = useState('short')
  const [niche, setNiche] = useState('All')

  const [thumbFormat, setThumbFormat] = useState('long')
  const [thumbNiche, setThumbNiche] = useState('All')
  const [thumbIndex, setThumbIndex] = useState(0)
  const [compare, setCompare] = useState(50)

  const [scrollProgress, setScrollProgress] = useState(0)

  function navigate(path) {
    const nextPage =
      path === '/work'
        ? 'work'
        : path === '/about'
          ? 'about'
          : 'home'

    window.history.pushState({}, '', path)

    setPage(nextPage)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname

      setPage(
        path === '/work'
          ? 'work'
          : path === '/about'
            ? 'about'
            : 'home'
      )
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'

    setTheme(nextTheme)

    try {
      localStorage.setItem('prime-theme', nextTheme)
    } catch {
      console.warn('Theme preference could not be saved.')
    }
  }

  useEffect(() => {
    document.documentElement.style.colorScheme = theme
  }, [theme])

  useEffect(() => {
    const update = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight

      setScrollProgress(
        max > 0 ? window.scrollY / max : 0
      )
    }

    window.addEventListener('scroll', update, {
      passive: true,
    })

    window.addEventListener('resize', update)

    update()

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [page])

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => {
        element.classList.add('in')
      })

      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,
      }
    )

    elements.forEach((element) => {
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [page])

  const workCategories = format === 'short'
    ? ['All', 'Real Estate', 'Gaming', 'Talking Heads', 'Clipping']
    : ['All', 'Real Estate', 'Gaming', 'Talking Heads', 'Vlogs', 'Podcast']

  const visibleProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.format === format &&
          (niche === 'All' || project.niche === niche)
      ),
    [format, niche]
  )

  const previewProjects = visibleProjects.slice(0, 4)

  const visibleThumbs = useMemo(
    () =>
      thumbnails.filter(
        (thumb) =>
          thumbNiche === 'All' || thumb.niche === thumbNiche
      ),
    [thumbNiche]
  )

  const currentThumb = visibleThumbs[thumbIndex]

  function changeThumbFilter(value) {
    setThumbNiche(value)
    setThumbIndex(0)
    setCompare(50)
  }

  function moveThumb(direction) {
    if (!visibleThumbs.length) return

    setThumbIndex(
      (index) =>
        (index + direction + visibleThumbs.length) %
        visibleThumbs.length
    )

    setCompare(50)
  }

  const openBooking = () => setBookingOpen(true)
  const openCalculator = () => setCalculatorOpen(true)

  /* WORK PAGE */
  if (page === 'work') {
    return (
      <>
        <WorkPage
          navigate={navigate}
          openBooking={openBooking}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <BookingModal
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
        />
      </>
    )
  }

  /* ABOUT PAGE */
  if (page === 'about') {
    return (
      <>
        <AboutPage
          navigate={navigate}
          openBooking={openBooking}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <BookingModal
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
        />
      </>
    )
  }

  /* HOME PAGE */
  return (
    <div className="site-shell" data-theme={theme}>
      <div
        className="scroll-bar"
        style={{
          transform: `scaleX(${scrollProgress})`,
        }}
      />

      <div className="ambient-glow" />

      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        navigate={navigate}
        openBooking={openBooking}
      />

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="hero-eyebrow">
            <span className="live-dot" />
            CREATIVE VIDEO PRODUCTION STUDIO
          </div>

          <h1 className="hero-title">
            <span className="hero-line line-one">
              MAKE EVERY FRAME <em>HOLD.</em>
            </span>

            <span className="hero-line line-two">
              <span className="hero-white">ATTENTION.</span>{' '}
              <em>CONVERT.</em>
            </span>
          </h1>

          <p className="hero-sub">
            Creative video editing for real estate,
            gaming and business brands.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-fill"
              onClick={openCalculator}
            >
              Start a project →
            </button>

            <button
              type="button"
              className="btn btn-line"
              onClick={() => navigate('/work')}
            >
              See our work →
            </button>
          </div>

          <div className="hero-bottom-note">
            <span>THINK IT.</span>
            <span>FRAME IT.</span>
            <span>MAKE IT MATTER.</span>
          </div>
        </section>

        {/* NICHE CARDS */}
        <section className="wrap niche-cards" id="niches">
          {['Real Estate', 'Gaming', 'Talking Heads', 'Vlogs'].map(
            (item, index) => (
              <article
                className="niche-card reveal"
                key={item}
                style={{
                  animationDelay: `${index * 0.12}s`,
                }}
              >
                <span className="tag">
                  {item.toUpperCase()}
                </span>

                <ProjectArt niche={item} />

                <div className="card-copy">
                  <h3>
                    {item === 'Real Estate'
                      ? 'Make every property stand out'
                      : item === 'Gaming'
                        ? 'Turn gameplay into a story'
                        : item === 'Vlogs'
                          ? 'Bring everyday moments to life'
                          : 'Make your message impossible to skip'}
                  </h3>

                  <p>
                    {item === 'Real Estate'
                      ? 'Cinematic property videos that bring spaces to life.'
                      : item === 'Gaming'
                        ? 'Dynamic edits that keep your gaming community hooked.'
                        : item === 'Vlogs'
                          ? 'Engaging lifestyle, travel and daily-life videos with a story worth watching.'
                          : 'Clean, engaging edits for founders, creators and brands.'}
                  </p>
                </div>
              </article>
            )
          )}
        </section>

        <div className="trust-row">
          <span>Creative storytelling</span>
          <i>•</i>
          <span>Detail-focused editing</span>
          <i>•</i>
          <span>Reliable delivery</span>
          <i>•</i>
          <span>India · International</span>
        </div>

        {/* MARQUEE */}
        <div className="marquee">
          <div className="marquee-track">
            {Array(2)
              .fill([
                'REAL ESTATE',
                'GAMING',
                'TALKING HEADS',
                'BUSINESS CLIENTS',
                'YOUTUBE',
                'REELS & SHORTS',
              ])
              .flat()
              .map((item, index) => (
                <span key={index}>
                  {item} <b>/</b>
                </span>
              ))}
          </div>
        </div>
      </main>

      {/* SELECTED WORK */}
      <section className="wrap section work-section" id="work">
        <div className="section-heading">
          <h2>Selected Work</h2>

          <div className="segmented">
            {['short', 'long'].map((item) => (
              <button
                type="button"
                key={item}
                className={format === item ? 'active' : ''}
                onClick={() => {
                  setFormat(item)
                  setNiche('All')
                }}
              >
                {item === 'short' ? 'Short-form' : 'Long-form'}
              </button>
            ))}
          </div>
        </div>

        <div className="chips">
          {workCategories.map((item) => (
            <button
              type="button"
              key={item}
              className={niche === item ? 'active' : ''}
              onClick={() => setNiche(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className={`work-grid ${format}`}>
          {previewProjects.map((project, index) => (
            <article
              className="work-tile"
              key={`${project.title}-${index}`}
            >
              <span className="tile-niche">
                {project.niche}
              </span>

              <div className="tile-icon">
                {project.icon}
              </div>

              <span className="tile-title">
                {project.title}
              </span>

              <span className="tile-play">▶</span>
            </article>
          ))}
        </div>

        <div className="portfolio-more">
          <button
            type="button"
            className="btn btn-line"
            onClick={() => navigate('/work')}
          >
            View Full Portfolio →
          </button>
        </div>
      </section>

      {/* THUMBNAILS */}
      <section
        className={`wrap section thumbnails-section ${
          thumbFormat === 'short' ? 'vertical-mode' : ''
        }`}
        id="thumbs"
      >
        <div className="eyebrow">THUMBNAILS</div>

        <h2 className="display-heading">
          DESIGNED TO <em>GET CLICKS.</em>
        </h2>

        <p className="section-sub">
          Eye-catching thumbnails that make your content stand out.
        </p>

        <div className="segmented centered">
          {['long', 'short'].map((item) => (
            <button
              type="button"
              key={item}
              className={thumbFormat === item ? 'active' : ''}
              onClick={() => setThumbFormat(item)}
            >
              {item === 'long'
                ? 'Long-form · 16:9'
                : 'Short-form · 9:16'}
            </button>
          ))}
        </div>

        <div className="chips centered">
          {['All', 'Real Estate', 'Gaming', 'Talking Heads'].map(
            (item) => (
              <button
                type="button"
                key={item}
                className={thumbNiche === item ? 'active' : ''}
                onClick={() => changeThumbFilter(item)}
              >
                {item}
              </button>
            )
          )}
        </div>

        {currentThumb && (
          <div
            className="thumbnail-viewer"
            style={{
              '--compare': `${compare}%`,
            }}
          >
            <div className="thumb-art before">
              <div className="thumb-shape" />
              <strong>{currentThumb.before}</strong>
            </div>

            <div className="thumb-art after">
              <div className="thumb-shape" />
              <strong>{currentThumb.after}</strong>
              <small>PRIME EDIT</small>
            </div>

            <span className="compare-label left">
              AFTER
            </span>

            <span className="compare-label right">
              BEFORE
            </span>

            <div className="compare-line" />

            <input
              aria-label="Compare before and after"
              type="range"
              min="0"
              max="100"
              value={compare}
              onChange={(event) =>
                setCompare(Number(event.target.value))
              }
            />
          </div>
        )}

        {currentThumb && (
          <div className="thumb-controls">
            <div>
              <span className="mini-label">
                {currentThumb.niche.toUpperCase()}
              </span>

              <h3>{currentThumb.after}</h3>
            </div>

            <div className="thumb-nav">
              <span>
                {String(thumbIndex + 1).padStart(2, '0')} /{' '}
                {String(visibleThumbs.length).padStart(2, '0')}
              </span>

              <button
                type="button"
                className="thumb-arrow thumb-arrow-prev"
                onClick={() => moveThumb(-1)}
                aria-label="Previous thumbnail"
              >
                <span className="arrow-orbit" />
                <span className="arrow-glyph">➜</span>
              </button>

              <button
                type="button"
                className="thumb-arrow thumb-arrow-next"
                onClick={() => moveThumb(1)}
                aria-label="Next thumbnail"
              >
                <span className="arrow-orbit" />
                <span className="arrow-glyph">➜</span>
              </button>
            </div>
          </div>
        )}

        <div className="thumb-list">
          {visibleThumbs.map((thumb, index) => (
            <button
              type="button"
              key={`${thumb.niche}-${index}`}
              className={thumbIndex === index ? 'selected' : ''}
              onClick={() => {
                setThumbIndex(index)
                setCompare(50)
              }}
            >
              <span>{thumb.after}</span>
            </button>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section
        className="wrap section services-section"
        id="services"
      >
        <div className="eyebrow">WHAT WE DO</div>

        <h2 className="display-heading">
          CREATIVE WORK. <em>REAL IMPACT.</em>
        </h2>

        <p className="section-sub">
          From the first cut to the final export,
          we help your content look its best.
        </p>

        <div className="services-grid">
          {services.map((service, index) => (
            <article
              className="service-card reveal"
              key={service.title}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="service-icon">
                {service.icon}
              </div>

              <h3>{service.title}</h3>

              <div className="service-tags">
                {service.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <p>{service.desc}</p>

              <ul>
                {service.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>

              <div className="service-foot">
                <span>{service.time}</span>

                <button
                  type="button"
                  onClick={() => navigate('/work')}
                >
                  See work →
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="callout">
          <h3>Ready to bring your next idea to life?</h3>

          <button
            type="button"
            className="btn btn-fill"
            onClick={openCalculator}
          >
            Start a Project →
          </button>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialsSection />

      {/* PRICING */}
      <PricingSection
        openCalculator={openCalculator}
        openBooking={openBooking}
      />

      {/* ABOUT TEASER */}
      <section className="wrap section about-teaser">
        <div className="eyebrow">OUR STORY</div>

        <h2 className="display-heading">
          GET TO KNOW <em>OUR JOURNEY.</em>
        </h2>

        <p className="section-sub">
          Discover the story and milestones behind Prime Productions.
        </p>

        <button
          type="button"
          className="btn btn-line"
          onClick={() => navigate('/about')}
        >
          Explore About Us →
        </button>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-brand">
          Prime Productions
        </div>

        <p>Creative editing for content that connects.</p>

        <div className="footer-links">
          <button
            type="button"
            onClick={() => navigate('/work')}
          >
            Work
          </button>

          <button
            type="button"
            onClick={() => navigate('/about')}
          >
            About
          </button>

          <button
            type="button"
            onClick={openBooking}
          >
            Book a Call
          </button>
        </div>

        <span>
          © {new Date().getFullYear()} Prime Productions.
          All rights reserved.
        </span>
      </footer>

      {/* MODALS */}
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />

      <CalculatorModal
        open={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
        onBookCall={openBooking}
      />
    </div>
  )
}

export default App