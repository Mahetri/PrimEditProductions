
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config({ path: './server/.env' });

const projects = [
  ['Real Estate', 'short', 'Luxury Property Reel', '⌂'],
  ['Gaming', 'short', 'Gaming Highlight Edit', '🎮'],
  ['Talking Heads', 'short', 'Creator Talking Head', '◉'],
  ['Clipping', 'short', 'Best Moments & Highlights', '✂'],
  ['Real Estate', 'short', 'Property Walkthrough', '⌂'],
  ['Gaming', 'short', 'Level Up Montage', '🎮'],
  ['Talking Heads', 'short', 'Business Content', '◉'],
  ['Clipping', 'short', 'Podcast & Stream Clips', '✂'],
  ['Real Estate', 'long', 'Complete Property Tour', '⌂'],
  ['Gaming', 'long', 'Gaming Video Episode', '🎮'],
  ['Talking Heads', 'long', 'YouTube Interview', '◉'],
  ['Vlogs', 'long', 'Lifestyle & Travel Vlog', '▶'],
  ['Podcast', 'long', 'Full Podcast Episode', '🎙'],
]

const thumbnails = [
  ['Real Estate', 'PROPERTY', 'DREAM HOME'],
  ['Gaming', 'GAMEPLAY', 'LEVEL UP'],
  ['Talking Heads', 'NEW VIDEO', 'STOP THIS'],
  ['Real Estate', 'HOUSE TOUR', 'VIEW NOW'],
  ['Gaming', 'NEXT ROUND', 'GAME ON'],
  ['Talking Heads', 'BUSINESS', 'TRUST ME'],
]

const services = [
  {
    icon: '▯',
    title: 'Short-form editing',
    tags: ['Real Estate', 'Gaming', 'Talking Heads', 'Clipping'],
    description: 'Scroll-stopping short videos made to hold attention and drive engagement.',
    points: [
      'Reels, Shorts & TikToks',
      'Captions and transitions',
      'Sound design and storytelling',
    ],
    turnaround: 'Flexible turnaround',
  },
  {
    icon: '▷',
    title: 'Long-form editing',
    tags: ['Real Estate', 'Gaming', 'Talking Heads', 'Vlogs', 'Podcast'],
    description: 'Professional long-form videos that keep your audience watching.',
    points: [
      'YouTube videos and interviews',
      'Story structure and pacing',
      'Audio and colour correction',
    ],
    turnaround: 'Project-based timeline',
  },
  {
    icon: '▧',
    title: 'Thumbnails',
    tags: ['Real Estate', 'Gaming', 'Talking Heads'],
    description: 'Eye-catching thumbnails designed to make people click.',
    points: [
      'Custom visual concepts',
      'Readable typography',
      'Platform-ready designs',
    ],
    turnaround: 'Quick delivery',
  },
  {
    icon: '◎',
    title: 'Shoots',
    tags: ['Real Estate', 'India'],
    description: 'Professional shoots for brands and properties.',
    points: [
      'Real estate shoots',
      'Creative direction',
      'Professional footage',
    ],
    turnaround: 'Scheduled in advance',
  },
]

const pricingPlans = [
  {
    name: 'Per Video',
    description: 'Pay as you go, one video at a time.',
    features: [
      'One edited video',
      'Revisions included',
      'Delivery timeline discussed',
      'Short-form or long-form',
    ],
    button_text: 'Get Started',
    plan_style: 'standard',
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
    button_text: 'Choose Pro',
    plan_style: 'hot',
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
    button_text: 'Choose Talented 1%',
    plan_style: 'top',
  },
]

const milestones = [
  ['How it began', 'The first steps of the Prime Productions journey.'],
  ['First projects', 'Taking on projects and building creative experience.'],
  ['Finding our focus', 'Exploring niches and finding our creative direction.'],
  ['Going official', 'Building a dedicated identity for Prime Productions.'],
  ['Growing the team', 'Bringing creative people together to do better work.'],
  ['Learning and improving', 'Improving our editing, storytelling and workflow.'],
  ['Building a process', 'Creating a more consistent process from brief to delivery.'],
  ['Today', 'Creating videos and thumbnails for brands and creators.'],
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

async function seed() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'prime_productions',
  })

  try {
    const tables = [
      'projects',
      'thumbnails',
      'services',
      'pricing_plans',
      'milestones',
      'site_content',
    ]

    for (const table of tables) {
      const [rows] = await db.query(`SELECT COUNT(*) AS total FROM ${table}`)

      if (Number(rows[0].total) > 0) {
        throw new Error(
          `Table "${table}" already contains data. Migration stopped to prevent duplicates.`
        )
      }
    }

    await db.beginTransaction()

    for (let i = 0; i < projects.length; i++) {
      const p = projects[i]

      await db.execute(
        `INSERT INTO projects
        (niche, format, title, icon, sort_order, is_published)
        VALUES (?, ?, ?, ?, ?, 1)`,
        [...p, i]
      )
    }

    for (let i = 0; i < thumbnails.length; i++) {
      const t = thumbnails[i]

      await db.execute(
        `INSERT INTO thumbnails
        (niche, before_text, after_text, sort_order, is_published)
        VALUES (?, ?, ?, ?, 1)`,
        [...t, i]
      )
    }

    for (let i = 0; i < services.length; i++) {
      const s = services[i]

      await db.execute(
        `INSERT INTO services
        (title, icon, description, tags, points, turnaround, sort_order, is_published)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          s.title,
          s.icon,
          s.description,
          JSON.stringify(s.tags),
          JSON.stringify(s.points),
          s.turnaround,
          i,
        ]
      )
    }

    for (let i = 0; i < pricingPlans.length; i++) {
      const p = pricingPlans[i]

      await db.execute(
        `INSERT INTO pricing_plans
        (name, description, features, button_text, plan_style, price_inr, price_usd, sort_order, is_published)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          p.name,
          p.description,
          JSON.stringify(p.features),
          p.button_text,
          p.plan_style,
          'Custom',
          'Custom',
          i,
        ]
      )
    }

    for (let i = 0; i < milestones.length; i++) {
      await db.execute(
        `INSERT INTO milestones
        (title, description, sort_order, is_published)
        VALUES (?, ?, ?, 1)`,
        [...milestones[i], i]
      )
    }

    await db.execute(
      `INSERT INTO site_content (section_key, content)
       VALUES (?, ?)`,
      [
        'calculator_settings',
        JSON.stringify({
          steps: calculatorSteps,
          volumeOptions,
          currencyRate: 85,
          shortAddonPrice: 50,
          thumbnailAddonPrice: 30,
        }),
      ]
    )

    await db.commit()

    console.log('--------------------------------')
    console.log('Prime Productions content seeded!')
    console.log('Projects:', projects.length)
    console.log('Thumbnails:', thumbnails.length)
    console.log('Services:', services.length)
    console.log('Pricing plans:', pricingPlans.length)
    console.log('Milestones:', milestones.length)
    console.log('Calculator settings: saved')
    console.log('Testimonials: left empty (no real reviews yet)')
    console.log('--------------------------------')
  } catch (error) {
    await db.rollback()
    throw error
  } finally {
    await db.end()
  }
}

seed().catch((error) => {
  console.error('SEED FAILED:', error.message)
  process.exitCode = 1
})
