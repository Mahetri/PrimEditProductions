
import { useCallback, useEffect, useMemo, useState } from 'react'
import './Admin.css'

const API = 'http://localhost:5000'

const SECTIONS = {
  projects: {
    title: 'Selected Work',
    singular: 'Project',
    description: 'Manage short-form and long-form video projects.',
    fields: [
      ['niche', 'Category'],
      ['format', 'Format (short / long)'],
      ['title', 'Project title'],
      ['description', 'Description', 'textarea'],
      ['icon', 'Icon / Emoji'],
      ['media_url', 'Video URL', 'upload'],
      ['media_type', 'Media type (image / video)'],
      ['thumbnail_url', 'Thumbnail image', 'upload'],
      ['external_url', 'External link'],
      ['sort_order', 'Display order', 'number'],
      ['is_published', 'Published', 'checkbox'],
    ],
  },

  thumbnails: {
    title: 'Thumbnails',
    singular: 'Thumbnail',
    description: 'Manage before-and-after thumbnail designs.',
    fields: [
      ['niche', 'Category'],
      ['before_text', 'Before text'],
      ['after_text', 'After text'],
      ['before_image', 'Before image', 'upload'],
      ['after_image', 'After image', 'upload'],
      ['image_url', 'Thumbnail image URL', 'upload'],
      ['sort_order', 'Display order', 'number'],
      ['is_published', 'Published', 'checkbox'],
    ],
  },

  services: {
    title: 'Services',
    singular: 'Service',
    description: 'Manage the services displayed on your website.',
    fields: [
      ['title', 'Service title'],
      ['icon', 'Icon / Emoji'],
      ['description', 'Description', 'textarea'],
      ['tags', 'Tags (one per line)', 'array'],
      ['points', 'Features (one per line)', 'array'],
      ['turnaround', 'Turnaround time'],
      ['sort_order', 'Display order', 'number'],
      ['is_published', 'Published', 'checkbox'],
    ],
  },

  pricing: {
    title: 'Pricing Plans',
    singular: 'Pricing plan',
    description: 'Manage your pricing packages.',
    fields: [
      ['name', 'Plan name'],
      ['description', 'Description', 'textarea'],
      ['features', 'Features (one per line)', 'array'],
      ['button_text', 'Button text'],
      ['plan_style', 'Plan style'],
      ['price_inr', 'Price (INR)', 'number'],
      ['price_usd', 'Price (USD)', 'number'],
      ['sort_order', 'Display order', 'number'],
      ['is_published', 'Published', 'checkbox'],
    ],
  },

  milestones: {
    title: 'Milestones',
    singular: 'Milestone',
    description: 'Manage your company milestones.',
    fields: [
      ['title', 'Milestone title'],
      ['description', 'Description', 'textarea'],
      ['sort_order', 'Display order', 'number'],
      ['is_published', 'Published', 'checkbox'],
    ],
  },

  testimonials: {
    title: 'Testimonials',
    singular: 'Testimonial',
    description: 'Manage client reviews and feedback.',
    fields: [
      ['client_name', 'Client name'],
      ['client_role', 'Client role'],
      ['message', 'Review message', 'textarea'],
      ['rating', 'Rating (1–5)', 'number'],
      ['image_url', 'Client image', 'upload'],
      ['sort_order', 'Display order', 'number'],
      ['is_published', 'Published', 'checkbox'],
    ],
  },
}

const MENU = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'projects', label: 'Selected Work', icon: '▣' },
  { id: 'thumbnails', label: 'Thumbnails', icon: '▧' },
  { id: 'services', label: 'Services', icon: '✳' },
  { id: 'pricing', label: 'Pricing Plans', icon: '₹' },
  { id: 'milestones', label: 'Milestones', icon: '◇' },
  { id: 'testimonials', label: 'Testimonials', icon: '❝' },
  { id: 'bookings', label: 'Bookings', icon: '▤' },
]

const EMPTY_BOOKING_STATUS = 'new'

function parseArray(value) {
  if (Array.isArray(value)) return value
  if (!value) return []

  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed
  } catch {
    // Plain text is also supported.
  }

  return String(value)
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function getInitialForm(section) {
  const result = {}

  section.fields.forEach(([key, , type]) => {
    if (type === 'checkbox') {
      result[key] = 1
    } else if (type === 'array') {
      result[key] = ''
    } else if (key === 'sort_order') {
      result[key] = 0
    } else if (key === 'media_type') {
      result[key] = 'video'
    } else {
      result[key] = ''
    }
  })

  return result
}

function prepareForm(item, section) {
  const result = {}

  section.fields.forEach(([key, , type]) => {
    const value = item?.[key]

    if (type === 'checkbox') {
      result[key] = Number(value) === 1 || value === true
    } else if (type === 'array') {
      result[key] = parseArray(value).join('\n')
    } else {
      result[key] = value ?? ''
    }
  })

  return result
}

function preparePayload(form, section) {
  const result = {}

  section.fields.forEach(([key, , type]) => {
    const value = form[key]

    if (type === 'checkbox') {
      result[key] = value ? 1 : 0
    } else if (type === 'array') {
      result[key] = String(value || '')
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
    } else if (type === 'number') {
      result[key] = value === '' ? 0 : Number(value)
    } else {
      result[key] = value
    }
  })

  return result
}

function mediaUrl(url) {
  if (!url) return ''

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  return `${API}${url.startsWith('/') ? '' : '/'}${url}`
}

function isVideoUrl(url) {
  return /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(url || '')
}

export default function Admin({ onExit }) {
  const [token, setToken] = useState(
    () => localStorage.getItem('prime-admin-token') || ''
  )

  const [admin, setAdmin] = useState(null)
  const [active, setActive] = useState('dashboard')
  const [data, setData] = useState({})
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [login, setLogin] = useState({
    email: '',
    password: '',
  })

  const [loginLoading, setLoginLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState('')

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  )

  const request = useCallback(async (path, options = {}) => {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        ...(options.body instanceof FormData
          ? {}
          : { 'Content-Type': 'application/json' }),
        ...authHeaders,
        ...options.headers,
      },
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('prime-admin-token')
        setToken('')
        setAdmin(null)
      }

      throw new Error(result.message || 'Something went wrong.')
    }

    return result
  }, [authHeaders])

  const loadAdmin = useCallback(async () => {
    if (!token) return

    try {
      const result = await request('/api/auth/me')
      setAdmin(result.admin)
    } catch (err) {
      setError(err.message)
    }
  }, [token, request])

  const loadResource = useCallback(async (resource) => {
    setLoading(true)
    setError('')

    try {
      const result = await request(`/api/admin/${resource}`)

      setData((current) => ({
        ...current,
        [resource]: result.data || [],
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [request])

  const loadBookings = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const result = await request('/api/admin/bookings')
      setBookings(result.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    if (token) loadAdmin()
  }, [token, loadAdmin])

  useEffect(() => {
    if (!token) return

    if (SECTIONS[active]) {
      loadResource(active)
    } else if (active === 'bookings') {
      loadBookings()
    }
  }, [active, token, loadResource, loadBookings])

  useEffect(() => {
    if (!token || active !== 'dashboard') return

    Object.keys(SECTIONS).forEach((resource) => {
      loadResource(resource)
    })

    loadBookings()
  }, [token, active, loadResource, loadBookings])

  async function handleLogin(event) {
    event.preventDefault()
    setLoginLoading(true)
    setError('')

    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(login),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Login failed.')
      }

      localStorage.setItem('prime-admin-token', result.token)

      setToken(result.token)
      setAdmin(result.admin)
      setActive('dashboard')

      setLogin({
        email: '',
        password: '',
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoginLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('prime-admin-token')

    setToken('')
    setAdmin(null)
    setData({})
    setBookings([])
    setActive('dashboard')
    setNotice('')
    setError('')
  }

  function openAdd() {
    const section = SECTIONS[active]

    setEditing(null)
    setForm(getInitialForm(section))
    setModalOpen(true)
    setError('')
  }

  function openEdit(item) {
    const section = SECTIONS[active]

    setEditing(item)
    setForm(prepareForm(item, section))
    setModalOpen(true)
    setError('')
  }

  function closeModal() {
    if (saving || uploading) return

    setModalOpen(false)
    setEditing(null)
    setForm({})
  }

  function updateField(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  async function uploadFile(key, file) {
    if (!file) return

    setUploading(key)
    setError('')
    setNotice('')

    try {
      const body = new FormData()
      body.append('file', file)

      const result = await request('/api/admin/upload', {
        method: 'POST',
        body,
      })

      if (!result.url) {
        throw new Error('Upload completed but file URL was not returned.')
      }

      updateField(key, result.url)
      setNotice('File uploaded successfully. Save changes to store it.')
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading('')
    }
  }

  async function saveItem(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = preparePayload(form, SECTIONS[active])

      const path = editing
        ? `/api/admin/${active}/${editing.id}`
        : `/api/admin/${active}`

      await request(path, {
        method: editing ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      })

      setModalOpen(false)
      setEditing(null)

      setNotice(
        editing
          ? 'Changes saved successfully.'
          : 'New item added successfully.'
      )

      await loadResource(active)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function deleteItem(item) {
    const section = SECTIONS[active]

    const label =
      item.title ||
      item.name ||
      item.client_name ||
      `#${item.id}`

    if (!window.confirm(`Delete "${label}" permanently?`)) return

    try {
      await request(`/api/admin/${active}/${item.id}`, {
        method: 'DELETE',
      })

      setNotice(`${section.singular} deleted successfully.`)
      await loadResource(active)
    } catch (err) {
      setError(err.message)
    }
  }

  async function togglePublish(item) {
    try {
      await request(`/api/admin/${active}/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          is_published: Number(item.is_published) === 1 ? 0 : 1,
        }),
      })

      setNotice('Publish status updated.')
      await loadResource(active)
    } catch (err) {
      setError(err.message)
    }
  }

  async function updateBookingStatus(id, status) {
    try {
      await request(`/api/admin/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })

      setNotice('Booking status updated.')
      await loadBookings()
    } catch (err) {
      setError(err.message)
    }
  }

  async function deleteBooking(booking) {
    if (
      !window.confirm(
        `Delete booking from ${booking.name || 'this client'}?`
      )
    ) {
      return
    }

    try {
      await request(`/api/admin/bookings/${booking.id}`, {
        method: 'DELETE',
      })

      setNotice('Booking deleted.')
      await loadBookings()
    } catch (err) {
      setError(err.message)
    }
  }

  const allItems = Object.values(data).flat()

  const publishedCount = allItems.filter(
    (item) => Number(item.is_published) === 1
  ).length

  const newBookings = bookings.filter(
    (item) => (item.status || EMPTY_BOOKING_STATUS) === 'new'
  ).length

  const filteredItems = (data[active] || []).filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  )

  if (!token) {
    return (
      <main className="admin-login-page">
        <div className="admin-login-glow" />

        <form className="admin-login-card" onSubmit={handleLogin}>
          <div className="admin-brand-mark">
            P<span>.</span>
          </div>

          <div className="admin-eyebrow">PRIME PRODUCTIONS</div>

          <h1>
            Welcome <span>back.</span>
          </h1>

          <p>Sign in to manage your creative studio.</p>

          {error && (
            <div className="admin-alert error">
              {error}
            </div>
          )}

          <label htmlFor="admin-email">Email address</label>

          <input
            id="admin-email"
            type="email"
            placeholder="admin@example.com"
            value={login.email}
            onChange={(event) =>
              setLogin({
                ...login,
                email: event.target.value,
              })
            }
            required
          />

          <label htmlFor="admin-password">Password</label>

          <input
            id="admin-password"
            type="password"
            placeholder="Enter your password"
            value={login.password}
            onChange={(event) =>
              setLogin({
                ...login,
                password: event.target.value,
              })
            }
            required
          />

          <button
            className="admin-primary-btn admin-login-btn"
            disabled={loginLoading}
          >
            {loginLoading
              ? 'Signing in...'
              : 'Sign in to dashboard →'}
          </button>

          <button
            type="button"
            className="admin-back-link"
            onClick={onExit}
          >
            ← Back to website
          </button>
        </form>
      </main>
    )
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-brand-mark">
            P<span>.</span>
          </div>

          <div>
            <strong>PRIME</strong>
            <small>PRODUCTIONS</small>
          </div>
        </div>

        <div className="admin-side-label">WORKSPACE</div>

        <nav className="admin-nav">
          {MENU.map((item) => (
            <button
              key={item.id}
              className={active === item.id ? 'active' : ''}
              onClick={() => {
                setActive(item.id)
                setSearch('')
                setError('')
                setNotice('')
              }}
            >
              <span className="admin-nav-icon">
                {item.icon}
              </span>

              {item.label}

              {item.id === 'bookings' && newBookings > 0 && (
                <span className="admin-nav-count">
                  {newBookings}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-user-mini">
            <div className="admin-avatar">
              {(admin?.name || 'A').charAt(0).toUpperCase()}
            </div>

            <div className="admin-user-info">
              <strong>{admin?.name || 'Administrator'}</strong>
              <small>Administrator</small>
            </div>
          </div>

          <button
            className="admin-logout-btn"
            onClick={logout}
          >
            ↪ Sign out
          </button>

          <button
            className="admin-back-link side-back"
            onClick={onExit}
          >
            ← View website
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-top-eyebrow">
              PRIME PRODUCTIONS / ADMIN
            </span>

            <h2>
              {active === 'dashboard'
                ? 'Dashboard'
                : active === 'bookings'
                  ? 'Bookings'
                  : SECTIONS[active]?.title}
            </h2>
          </div>

          <div className="admin-top-right">
            <span className="admin-live-dot">
              System online
            </span>

            <div className="admin-top-avatar">
              {(admin?.name || 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {error && (
          <div className="admin-alert error admin-main-alert">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {notice && (
          <div className="admin-alert success admin-main-alert">
            {notice}
            <button onClick={() => setNotice('')}>×</button>
          </div>
        )}

        {active === 'dashboard' && (
          <section className="admin-content">
            <div className="admin-welcome">
              <div>
                <div className="admin-eyebrow">
                  YOUR CREATIVE CONTROL ROOM
                </div>

                <h1>
                  Make it <span>matter.</span>
                </h1>

                <p>
                  Manage your website content, projects and client
                  enquiries from one place.
                </p>
              </div>

              <div className="admin-welcome-art">
                P<span>.</span>
              </div>
            </div>

            <div className="admin-stat-grid">
              <div className="admin-stat-card">
                <span>Total content</span>
                <strong>{allItems.length}</strong>
                <small>Across all sections</small>
              </div>

              <div className="admin-stat-card">
                <span>Published items</span>
                <strong>{publishedCount}</strong>
                <small>Visible content entries</small>
              </div>

              <div className="admin-stat-card">
                <span>Total enquiries</span>
                <strong>{bookings.length}</strong>
                <small>Client booking requests</small>
              </div>

              <div className="admin-stat-card">
                <span>New enquiries</span>
                <strong>{newBookings}</strong>
                <small>Need your attention</small>
              </div>
            </div>

            <div className="admin-dashboard-heading">
              <div>
                <div className="admin-eyebrow">QUICK ACCESS</div>
                <h3>Manage your website</h3>
              </div>
            </div>

            <div className="admin-quick-grid">
              {MENU.filter(
                (item) => item.id !== 'dashboard'
              ).map((item) => (
                <button
                  className="admin-quick-card"
                  key={item.id}
                  onClick={() => setActive(item.id)}
                >
                  <span className="admin-quick-icon">
                    {item.icon}
                  </span>

                  <strong>{item.label}</strong>

                  <small>
                    {item.id === 'bookings'
                      ? `${bookings.length} enquiries`
                      : `${(data[item.id] || []).length} entries`}
                  </small>

                  <span className="admin-quick-arrow">↗</span>
                </button>
              ))}
            </div>

            <div className="admin-note">
              <span>✦</span>

              <div>
                <strong>
                  Changes are saved to your database
                </strong>

                <p>
                  Use the sections on the left to add, edit,
                  publish or remove website content.
                </p>
              </div>
            </div>
          </section>
        )}

        {SECTIONS[active] && (
          <section className="admin-content">
            <div className="admin-section-heading">
              <div>
                <div className="admin-eyebrow">
                  CONTENT MANAGEMENT
                </div>

                <h3>{SECTIONS[active].title}</h3>

                <p>{SECTIONS[active].description}</p>
              </div>

              <button
                className="admin-primary-btn"
                onClick={openAdd}
              >
                ＋ Add {SECTIONS[active].singular}
              </button>
            </div>

            <div className="admin-table-toolbar">
              <input
                type="search"
                placeholder={`Search ${SECTIONS[active].title.toLowerCase()}...`}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <button
                className="admin-secondary-btn"
                onClick={() => loadResource(active)}
              >
                ↻ Refresh
              </button>
            </div>

            {loading ? (
              <div className="admin-empty">
                Loading content...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="admin-empty">
                <span>▣</span>

                <strong>No content found</strong>

                <p>
                  Add your first{' '}
                  {SECTIONS[active].singular.toLowerCase()}
                  {' '}to get started.
                </p>

                <button
                  className="admin-primary-btn"
                  onClick={openAdd}
                >
                  ＋ Add item
                </button>
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Content</th>
                      <th>Details</th>
                      <th>Visibility</th>
                      <th>Order</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredItems.map((item) => {
                      const title =
                        item.title ||
                        item.name ||
                        item.client_name ||
                        `Item #${item.id}`

                      const subtitle =
                        item.niche ||
                        item.client_role ||
                        item.format ||
                        item.description ||
                        ''

                      const image =
                        item.thumbnail_url ||
                        item.image_url ||
                        item.after_image ||
                        ''

                      return (
                        <tr key={item.id}>
                          <td>
                            <div className="admin-table-content">
                              {image ? (
                                <img
                                  src={mediaUrl(image)}
                                  alt=""
                                />
                              ) : (
                                <div className="admin-table-placeholder">
                                  P.
                                </div>
                              )}

                              <div>
                                <strong>{title}</strong>
                                <small>#{item.id}</small>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="admin-muted-cell">
                              {subtitle || '—'}
                            </span>
                          </td>

                          <td>
                            <button
                              className={`admin-status ${
                                Number(item.is_published) === 1
                                  ? 'published'
                                  : 'draft'
                              }`}
                              onClick={() => togglePublish(item)}
                              title="Click to change publish status"
                            >
                              {Number(item.is_published) === 1
                                ? '● Published'
                                : '○ Draft'}
                            </button>
                          </td>

                          <td>{item.sort_order ?? 0}</td>

                          <td>
                            <div className="admin-row-actions">
                              <button onClick={() => openEdit(item)}>
                                Edit
                              </button>

                              <button
                                className="delete"
                                onClick={() => deleteItem(item)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {active === 'bookings' && (
          <section className="admin-content">
            <div className="admin-section-heading">
              <div>
                <div className="admin-eyebrow">
                  CLIENT ENQUIRIES
                </div>

                <h3>Booking requests</h3>

                <p>
                  Review enquiries and update their progress.
                </p>
              </div>

              <button
                className="admin-secondary-btn"
                onClick={loadBookings}
              >
                ↻ Refresh
              </button>
            </div>

            {loading ? (
              <div className="admin-empty">
                Loading bookings...
              </div>
            ) : bookings.length === 0 ? (
              <div className="admin-empty">
                <span>▤</span>

                <strong>No bookings yet</strong>

                <p>
                  New website enquiries will appear here.
                </p>
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table booking-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Contact</th>
                      <th>Service</th>
                      <th>Date / Time</th>
                      <th>Note</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <strong>{booking.name}</strong>
                          <small>#{booking.id}</small>
                        </td>

                        <td>{booking.contact}</td>
                        <td>{booking.service}</td>

                        <td>
                          {booking.booking_date || '—'}
                          <small>
                            {booking.booking_time || ''}
                          </small>
                        </td>

                        <td className="admin-booking-note">
                          {booking.note || '—'}
                        </td>

                        <td>
                          <select
                            className="admin-booking-status"
                            value={
                              booking.status || EMPTY_BOOKING_STATUS
                            }
                            onChange={(event) =>
                              updateBookingStatus(
                                booking.id,
                                event.target.value
                              )
                            }
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="in_progress">In progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td>
                          <button
                            className="admin-delete-text"
                            onClick={() => deleteBooking(booking)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>

      {modalOpen && SECTIONS[active] && (
        <div
          className="admin-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal()
            }
          }}
        >
          <form
            className="admin-modal"
            onSubmit={saveItem}
          >
            <div className="admin-modal-head">
              <div>
                <div className="admin-eyebrow">
                  {editing ? 'EDIT CONTENT' : 'NEW CONTENT'}
                </div>

                <h3>
                  {editing ? 'Edit' : 'Add'}{' '}
                  {SECTIONS[active].singular}
                </h3>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <div className="admin-form-grid">
              {SECTIONS[active].fields.map(
                ([key, label, type]) => (
                  <div
                    className={`admin-form-field ${
                      type === 'textarea' ||
                      type === 'array' ||
                      type === 'upload'
                        ? 'wide'
                        : ''
                    }`}
                    key={key}
                  >
                    {type === 'checkbox' ? (
                      <label className="admin-checkbox-label">
                        <input
                          type="checkbox"
                          checked={Boolean(form[key])}
                          onChange={(event) =>
                            updateField(
                              key,
                              event.target.checked
                            )
                          }
                        />

                        <span>{label}</span>
                      </label>
                    ) : (
                      <>
                        <label htmlFor={`field-${key}`}>
                          {label}
                        </label>

                        {type === 'textarea' ||
                        type === 'array' ? (
                          <textarea
                            id={`field-${key}`}
                            rows={type === 'array' ? 4 : 3}
                            placeholder={
                              type === 'array'
                                ? 'Enter one item per line'
                                : `Enter ${label.toLowerCase()}`
                            }
                            value={form[key] ?? ''}
                            onChange={(event) =>
                              updateField(
                                key,
                                event.target.value
                              )
                            }
                          />
                        ) : type === 'upload' ? (
                          <div className="admin-upload-field">
                            <input
                              id={`field-${key}`}
                              type="text"
                              placeholder="Paste URL or upload a file"
                              value={form[key] ?? ''}
                              onChange={(event) =>
                                updateField(
                                  key,
                                  event.target.value
                                )
                              }
                            />

                            <label className="admin-upload-btn">
                              {uploading === key
                                ? 'Uploading...'
                                : 'Choose file'}

                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                                disabled={Boolean(uploading)}
                                onChange={(event) => {
                                  uploadFile(
                                    key,
                                    event.target.files?.[0]
                                  )

                                  event.target.value = ''
                                }}
                              />
                            </label>

                            {form[key] && (
                              <div className="admin-upload-preview">
                                <div className="admin-upload-preview-heading">
                                  <strong>
                                    Uploaded file preview
                                  </strong>

                                  <span>
                                    File ready
                                  </span>
                                </div>

                                {isVideoUrl(form[key]) ? (
                                  <video
                                    src={mediaUrl(form[key])}
                                    controls
                                    className="admin-upload-preview-media"
                                  >
                                    Your browser does not support video.
                                  </video>
                                ) : (
                                  <img
                                    src={mediaUrl(form[key])}
                                    alt={`${label} preview`}
                                    className="admin-upload-preview-media"
                                    onError={(event) => {
                                      event.currentTarget.style.display =
                                        'none'
                                    }}
                                  />
                                )}

                                <a
                                  href={mediaUrl(form[key])}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="admin-upload-preview-link"
                                >
                                  Open uploaded file ↗
                                </a>

                                <button
                                  type="button"
                                  className="admin-upload-remove"
                                  onClick={() =>
                                    updateField(key, '')
                                  }
                                >
                                  Remove file
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <input
                            id={`field-${key}`}
                            type={
                              type === 'number'
                                ? 'number'
                                : 'text'
                            }
                            value={form[key] ?? ''}
                            placeholder={`Enter ${label.toLowerCase()}`}
                            onChange={(event) =>
                              updateField(
                                key,
                                event.target.value
                              )
                            }
                          />
                        )}
                      </>
                    )}
                  </div>
                )
              )}
            </div>

            {error && (
              <div className="admin-alert error">
                {error}
              </div>
            )}

            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-secondary-btn"
                onClick={closeModal}
                disabled={saving || Boolean(uploading)}
              >
                Cancel
              </button>

              <button
                className="admin-primary-btn"
                disabled={saving || Boolean(uploading)}
              >
                {saving
                  ? 'Saving...'
                  : editing
                    ? 'Save changes'
                    : 'Add to website'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
