const express = require('express')
const path = require('path')
const crypto = require('crypto')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// endpoint uji
app.get('/test', (req, res) => {
  res.send('Hello World!')
})

// tampilkan index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// endpoint untuk membuat API key dengan crypto
app.post('/create', (req, res) => {
  const apiKey = 'API-' + crypto.randomBytes(16).toString('hex').toUpperCase()
  res.json({ apiKey })
})

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`)
})

app.post('/create', (req, res) => {
  const apiKey = 'API-' + crypto.randomBytes(16).toString('hex').toUpperCase()
  res.json({ apiKey })
})