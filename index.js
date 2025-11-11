const express = require('express')
const path = require('path')
const crypto = require('crypto')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

let myApiKey = null // simpan API key terakhir yang dibuat

app.get('/test', (req, res) => {
  res.send('Hello World!')
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.post('/create', (req, res) => {
  const apiKey = 'sk-sm-v1-' + crypto.randomBytes(16).toString('hex').toUpperCase()
  myApiKey = apiKey
  res.json({ apiKey })
})

app.post('/cekapi', (req, res) => {
  // terima dari body atau dari header Authorization Bearer
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

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`)
})
