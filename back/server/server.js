import http from 'node:http'
import path from 'node:path'
const fs = require('fs/promises')

const PORT = 8000
const __dirname = import.meta.dirname

const server = http.createServer( async (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  const rawDataPath = path.join(__dirname, '..', 'pricesData', 'merged.json')
  // res.writeHead(200, {'Content-Type' : 'application.json'})
  /* 
  setHeader() has to always come before writeHead()
  setHeader() can be overwritten by writeHead()
  writeHead() should only be used when you are not planning on changing the headers anymore
  there are more differences on setHeader() and writeHead(), go look if u want
  */
  const raw = await fs.readFile(rawDataPath)
  const data = JSON.parse(raw)
  res.end(data)
})

server.listen(PORT, () => console.log(`Connected on port: ${PORT}`))
