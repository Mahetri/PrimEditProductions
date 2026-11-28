
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ========================================
// MEDIA UPLOAD FOLDER
// ========================================

const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(uploadDir));

// ========================================
// MYSQL CONNECTION
// ========================================

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'prime_productions',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ========================================
// RESOURCE CONFIGURATION
// ========================================

const resources = {
  projects: {
    table: 'projects',
    fields: [
      'niche',
      'format',
      'title',
      'description',
      'icon',
      'media_url',
      'media_type',
      'thumbnail_url',
      'external_url',
      'sort_order',
      'is_published'
    ]
  },

  thumbnails: {
    table: 'thumbnails',
    fields: [
      'niche',
      'before_text',
      'after_text',
      'before_image',
      'after_image',
      'image_url',
      'sort_order',
      'is_published'
    ]
  },

  services: {
    table: 'services',
    fields: [
      'title',
      'icon',
      'description',
      'tags',
      'points',
      'turnaround',
      'sort_order',
      'is_published'
    ],
    jsonFields: ['tags', 'points']
  },

  pricing: {
    table: 'pricing_plans',
    fields: [
      'name',
      'description',
      'features',
      'button_text',
      'plan_style',
      'price_inr',
      'price_usd',
      'sort_order',
      'is_published'
    ],
    jsonFields: ['features']
  },

  milestones: {
    table: 'milestones',
    fields: [
      'title',
      'description',
      'sort_order',
      'is_published'
    ]
  },

  testimonials: {
    table: 'testimonials',
    fields: [
      'client_name',
      'client_role',
      'message',
      'rating',
      'image_url',
      'sort_order',
      'is_published'
    ]
  }
};

// ========================================
// AUTHENTICATION MIDDLEWARE
// ========================================

function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Please login first'
    });
  }

  try {
    const token = header.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is missing');
    }

    req.admin = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired login'
    });
  }
}

// ========================================
// HEALTH CHECK
// ========================================

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    res.json({
      success: true,
      message: 'Prime Productions API is running',
      database: 'connected'
    });

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: 'Database connection failed'
    });
  }
});

// ========================================
// ADMIN LOGIN
// ========================================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM admins WHERE email = ? LIMIT 1',
      [email.trim().toLowerCase()]
    );

    if (!rows.length) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const admin = rows[0];

    const validPassword = await bcrypt.compare(
      password,
      admin.password
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is missing in server/.env');
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// ========================================
// GET LOGGED-IN ADMIN
// ========================================

app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role FROM admins WHERE id = ?',
      [req.admin.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      admin: rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Unable to fetch admin'
    });
  }
});

// ========================================
// PUBLIC CONTENT APIs
// ========================================

app.get('/api/public/:resource', async (req, res) => {
  try {
    const config = resources[req.params.resource];

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const [rows] = await pool.query(
      `SELECT * FROM ${config.table}
       WHERE is_published = 1
       ORDER BY sort_order ASC, id DESC`
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Unable to fetch content'
    });
  }
});

// ========================================
// ADMIN: GET ALL CONTENT
// ========================================

app.get('/api/admin/:resource', authenticate, async (req, res) => {
  try {
    const config = resources[req.params.resource];

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const [rows] = await pool.query(
      `SELECT * FROM ${config.table}
       ORDER BY sort_order ASC, id DESC`
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Unable to fetch content'
    });
  }
});

// ========================================
// ADMIN: CREATE CONTENT
// ========================================

app.post('/api/admin/:resource', authenticate, async (req, res, next) => {

  // Upload request ko neeche wale upload API tak jaane do
  if (req.params.resource === 'upload') {
    return next();
  }  
  
  try {

    const config = resources[req.params.resource];

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const fields = config.fields.filter(
      field => req.body[field] !== undefined
    );

    if (!fields.length) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields supplied'
      });
    }

    const values = fields.map(field => {
      const value = req.body[field];

      return config.jsonFields?.includes(field)
        ? JSON.stringify(value)
        : value;
    });

    const placeholders = fields.map(() => '?').join(', ');

    const [result] = await pool.execute(
      `INSERT INTO ${config.table}
       (${fields.join(', ')})
       VALUES (${placeholders})`,
      values
    );

    res.status(201).json({
      success: true,
      message: 'Content created',
      id: result.insertId
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Unable to create content'
    });
  }
});

// ========================================
// ADMIN: UPDATE CONTENT
// ========================================

app.put('/api/admin/:resource/:id', authenticate, async (req, res) => {
  try {
    const config = resources[req.params.resource];

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const fields = config.fields.filter(
      field => req.body[field] !== undefined
    );

    if (!fields.length) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields supplied'
      });
    }

    const values = fields.map(field => {
      const value = req.body[field];

      return config.jsonFields?.includes(field)
        ? JSON.stringify(value)
        : value;
    });

    const setClause = fields
      .map(field => `${field} = ?`)
      .join(', ');

    const [result] = await pool.execute(
      `UPDATE ${config.table}
       SET ${setClause}
       WHERE id = ?`,
      [...values, req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    res.json({
      success: true,
      message: 'Content updated'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Unable to update content'
    });
  }
});

// ========================================
// ADMIN: DELETE CONTENT
// ========================================

app.delete('/api/admin/:resource/:id', authenticate, async (req, res) => {
  try {
    const config = resources[req.params.resource];

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const [result] = await pool.execute(
      `DELETE FROM ${config.table} WHERE id = ?`,
      [req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    res.json({
      success: true,
      message: 'Content deleted'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Unable to delete content'
    });
  }
});

// ========================================
// SITE CONTENT APIs
// ========================================

// Public: get one site content section
app.get('/api/public/site-content/:key', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT content
       FROM site_content
       WHERE section_key = ?
       LIMIT 1`,
      [req.params.key]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Site content not found'
      });
    }

    res.json({
      success: true,
      data: rows[0].content
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Unable to fetch site content'
    });
  }
});

// Admin: get one site content section
app.get('/api/admin/site-content/:key', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT section_key, content
       FROM site_content
       WHERE section_key = ?
       LIMIT 1`,
      [req.params.key]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Site content not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Unable to fetch site content'
    });
  }
});

// Admin: create or update site content
app.put('/api/admin/site-content/:key', authenticate, async (req, res) => {
  try {
    const { content } = req.body;

    if (content === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    await pool.execute(
      `INSERT INTO site_content (section_key, content)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE content = VALUES(content)`,
      [req.params.key, JSON.stringify(content)]
    );

    res.json({
      success: true,
      message: 'Site content saved successfully'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Unable to save site content'
    });
  }
});

// ========================================
// MEDIA UPLOAD CONFIGURATION
// ========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const uniqueName =
      Date.now() + '-' +
      Math.round(Math.random() * 1e9) +
      extension;

    cb(null, uniqueName);
  }
});

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime'
];

const upload = multer({
  storage,

  limits: {
    fileSize: 500 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(
        'Only JPG, PNG, WEBP, GIF, MP4 and WEBM files are allowed'
      ));
    }
  }
});

// Admin: upload image/video
app.post(
  '/api/admin/upload',
  authenticate,
  upload.single('file'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a file'
      });
    }

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      mimetype: req.file.mimetype
    });
  }
);

// ========================================
// ADMIN: GET BOOKINGS
// ========================================

app.get('/api/admin/bookings', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM bookings ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Unable to fetch bookings'
    });
  }
});

// ========================================
// ADMIN: UPDATE BOOKING STATUS
// ========================================

app.patch(
  '/api/admin/bookings/:id/status',
  authenticate,
  async (req, res) => {
    try {
      const allowedStatuses = [
        'new',
        'contacted',
        'in_progress',
        'completed',
        'cancelled'
      ];

      const { status } = req.body;

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid booking status'
        });
      }

      const [result] = await pool.execute(
        'UPDATE bookings SET status = ? WHERE id = ?',
        [status, req.params.id]
      );

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.json({
        success: true,
        message: 'Booking status updated'
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: 'Unable to update booking'
      });
    }
  }
);

// ========================================
// ADMIN: DELETE BOOKING
// ========================================

app.delete('/api/admin/bookings/:id', authenticate, async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM bookings WHERE id = ?',
      [req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking deleted'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Unable to delete booking'
    });
  }
});

// ========================================
// PUBLIC BOOKING FORM
// ========================================

app.post('/api/bookings', async (req, res) => {
  try {
    const {
      name,
      contact,
      service,
      date,
      time,
      note
    } = req.body;

    if (
      !name?.trim() ||
      !contact?.trim() ||
      !service?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Name, contact and service are required'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO bookings
       (name, contact, service, booking_date, booking_time, note)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        contact.trim(),
        service.trim(),
        date || null,
        time || null,
        note || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Enquiry saved successfully',
      id: result.insertId
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Unable to save enquiry'
    });
  }
});

// ========================================
// ERROR HANDLER
// ========================================

app.use((error, req, res, next) => {
  console.error(error);

  res.status(400).json({
    success: false,
    message: error.message || 'Request failed'
  });
});

// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Prime Productions API running at http://localhost:${PORT}`
  );
});
