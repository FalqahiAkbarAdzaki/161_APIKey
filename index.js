const express = require('express')
const path = require('path')
const crypto = require('crypto')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// temporary memory (TIDAK merombak repo kamu)
let myApiKey = null 
let users = [] 
let admins = [
  { id: 1, email: "admin@gmail.com", password: "admin123" }
]

// --- EXISTING ROUTES --- //
app.get('/test', (req, res) => {
  res.send('Hello World!')
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// --- CREATE API KEY (original) --- //
app.post('/create', (req, res) => {
  const apiKey = 'sk-sm-v1-' + crypto.randomBytes(16).toString('hex').toUpperCase()
  myApiKey = apiKey
  res.json({ apiKey })
})

// --- CHECK API KEY (original) --- //
app.post('/cekapi', (req, res) => {
  const fromBody = typeof req.body.apiKey === 'string' ? req.body.apiKey.trim() : ''
  const fromAuth = (() => {
    const h = req.get('authorization') || ''
    const parts = h.split(' ')
    return parts[0] === 'Bearer' && parts[1] ? parts[1].trim() : ''
  })()
  
  const candidate = fromBody || fromAuth

  if (!myApiKey) {
    return res.status(409).json({ valid: false, reason: 'Belum ada API key yang dibuat' })
  }
  if (!candidate) {
    return res.status(400).json({ valid: false, reason: 'apiKey tidak diberikan' })
  }

  const valid = candidate === myApiKey
  res.json({ valid })
})


// ======================================================
//  ✨ NEW SMALL FEATURES (sesuai gambar whiteboard)
// ======================================================

// --- Tambah User (dengan FK API KEY) --- //
app.post('/users/add', (req, res) => {
  const { firstname, lastname, email } = req.body

  if (!myApiKey) {
    return res.status(400).json({ error: "Buat API key dulu sebelum tambah user" })
  }

  const newUser = {
    id: users.length + 1,
    firstname,
    lastname,
    email,
    apikey: myApiKey
  }

  users.push(newUser)

  res.json({ success: true, user: newUser })
})

// --- List semua user --- //
app.get('/users/list', (req, res) => {
  res.json(users)
})

// --- Admin: List API Key + Status user --- //
app.get('/admin/listApikey', (req, res) => {
  res.json({
    apikey: myApiKey,
    totalUsers: users.length,
    users
  })
})


app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`)
})
