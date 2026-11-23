import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config({ path: 'server/.env' })

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}))

app.use(express.json())

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'prime_productions',
  waitForConnections: true,
  connectionLimit: 10
})

// Test API
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Prime Productions API is running'
  })
})

// Save contact form data
app.post('/api/bookings', async (req, res) => {
  const { name, contact, service } = req.body

  if (!name || !contact || !service) {
    return res.status(400).json({
      message: 'All fields are required'
    })
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO bookings (name, contact, service)
       VALUES (?, ?, ?)`,
      [
        name.trim(),
        contact.trim(),
        service.trim()
      ]
    )

    res.status(201).json({
      success: true,
      message: 'Enquiry saved successfully',
      id: result.insertId
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Database error'
    })
  }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
