
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

dotenv.config({ path: 'server/.env' })

const rl = readline.createInterface({ input, output })

async function createAdmin() {
  let connection

  try {
    const name = await rl.question('Admin name: ')
    const email = await rl.question('Admin email: ')
    const password = await rl.question('Admin password: ')

    if (!name.trim() || !email.trim() || password.length < 8) {
      throw new Error('Name, email required. Password must be at least 8 characters.')
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'prime_productions'
    })

    const hashedPassword = await bcrypt.hash(password, 12)

    await connection.execute(
      `INSERT INTO admins (name, email, password, role)
       VALUES (?, ?, ?, 'superadmin')
       ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       password = VALUES(password)`,
      [name.trim(), email.trim().toLowerCase(), hashedPassword]
    )

    console.log('\nAdmin account created/updated successfully!')
  } catch (error) {
    console.error('\nError:', error.message)
  } finally {
    if (connection) await connection.end()
    rl.close()
  }
}

createAdmin()
