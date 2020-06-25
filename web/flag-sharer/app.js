const { promisify } = require('util')
const fs = require('fs')
const http = require('http')
const crypto = require('crypto')
const getRawBody = require('raw-body')
const mustache = require('mustache')

const port = process.env.PORT
const adminId = process.env.ADMIN_ID

const registerPage = fs.readFileSync('register.html')
const giftsPage = fs.readFileSync('gifts.html').toString()
const staticFiles = new Map(fs.readdirSync('static').map(name => [
  name,
  fs.readFileSync(`static/${name}`)
]))

const userNames = new Map([['admin', adminId]])
const userIds = new Map([[adminId, 'admin']])
const userItems = new Map([['admin', []]])
const itemDescs = new Map([
  ['Tunisia', 'Tunisia, officially the Republic of Tunisia, is a country in the Maghreb region of North Africa, covering 163,610 square kilometres (63,170 square miles).'],
  ['United States', 'The United States of America (USA), commonly known as the United States (U.S. or US) or America, is a country mostly located in central North America, between Canada and Mexico.'],
  ['actual flag', process.env.FLAG]
])

const randomBytes = promisify(crypto.randomBytes)
const makeId = async () => 'id' + (await randomBytes(16)).toString('hex')

const getFlags = (id) => {
  const flags = ['Tunisia', 'United States']
  if (id === adminId) {
    flags.push('actual flag')
  }
  return flags
}

http.createServer(async (req, res) => {
  const [pathname, query] = req.url.split('?', 2)
  const qs = new URLSearchParams(query)
  const cookies = new Map(decodeURIComponent(req.headers.cookie || '').split('; ').map(c => c.split('=')))
  const headers = { 'content-security-policy': 'script-src \'none\'; object-src \'none\'' }
  let body
  if (req.method === 'POST') {
    let rawBody
    try {
      rawBody = await getRawBody(req, {
        length: req.headers['content-length'],
        limit: '10kb',
        encoding: true
      })
    } catch (e) {
      res.writeHead(400, headers).end()
      return
    }
    body = new URLSearchParams(rawBody)
  }
  if (pathname === '/' && req.method === 'GET') {
    res.writeHead(200, { 'content-type': 'text/html', ...headers }).end(registerPage)
  } else if (pathname === '/gifts' && req.method === 'GET') {
    const id = cookies.get('id')
    const name = userIds.get(id)
    if (!name) {
      res.writeHead(401, headers).end()
      return
    }
    const error = qs.get('error')
    if (/[&<>"'*\s]/.test(error)) {
      res.writeHead(400, headers).end()
      return
    }
    const csrf = await makeId()
    res.writeHead(200, {
      'content-type': 'text/html',
      'set-cookie': `csrf=${csrf}`,
      ...headers
    }).end(mustache.render(giftsPage, {
      name,
      csrf,
      error,
      gifts: getFlags(id),
      items: userItems.get(name)
    }))
  } else if (pathname === '/register' && req.method === 'POST') {
    const name = body.get('name')
    if (!name) {
      res.writeHead(400, headers).end()
      return
    }
    if (userNames.has(name)) {
      res.writeHead(409, headers).end()
      return
    }
    const id = await makeId()
    userNames.set(name, id)
    userIds.set(id, name)
    userItems.set(name, [])
    res.writeHead(302, {
      'set-cookie': `id=${id}`,
      location: '/gifts',
      ...headers
    }).end()
  } else if (pathname === '/send' && req.method === 'POST') {
    const id = cookies.get('id')
    const name = userIds.get(id)
    if (!name) {
      res.writeHead(401, headers).end()
      return
    }
    const csrfCookie = cookies.get('csrf')
    const csrfForm = body.get('csrf')
    if (!csrfCookie || !csrfForm || csrfCookie !== csrfForm) {
      res.writeHead(302, { location: '/gifts?error=bad_csrf', ...headers }).end()
      return
    }
    const recipient = body.get('recipient')
    const items = userItems.get(recipient)
    if (recipient === name || !items) {
      res.writeHead(302, { location: '/gifts?error=bad_recipient', ...headers }).end()
      return
    }
    const gift = body.get('gift')
    const gifts = getFlags(id)
    if (!gifts.includes(gift) || items.includes(gift)) {
      res.writeHead(302, { location: '/gifts?error=bad_gift', ...headers }).end()
      return
    }
    items.push(gift)
    res.writeHead(200, headers).end('gift sent!')
  } else if (pathname === '/item' && req.method === 'GET') {
    const id = cookies.get('id')
    const name = userIds.get(id)
    const items = userItems.get(name)
    if (!items) {
      res.writeHead(401, headers).end()
      return
    }
    const item = qs.get('name')
    res.writeHead(200, headers)
    res.end(items.includes(item) ? itemDescs.get(item) : ` ${item} is not in your item list.`)
  } else if (pathname.startsWith('/static/') && req.method === 'GET') {
    res.writeHead(200, { 'content-type': 'text/css', ...headers })
    res.end(staticFiles.get(/\/static\/(.*)/.exec(pathname)[1]))
  } else {
    res.writeHead(404, headers).end()
  }
}).listen(port, () => {
  console.log('listening on', port)
})
