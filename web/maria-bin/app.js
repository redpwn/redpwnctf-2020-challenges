const { promisify } = require('util')
const fs = require('fs')
const crypto = require('crypto')
const http = require('http')
const getRawBody = require('raw-body')
const mustache = require('mustache')

const appPort = process.env.APP_PORT
const rawPort = process.env.RAW_PORT
const rawOrigin = process.env.RAW_ORIGIN
const adminName = process.env.ADMIN_NAME
const flag = process.env.FLAG
const tokenKey = Buffer.from(process.env.TOKEN_KEY, 'base64') // 32 bytes

const registerPage = fs.readFileSync('pages/register.html')
const logoJpg = fs.readFileSync('pages/logo.jpg')
const newPage = fs.readFileSync('pages/new.html').toString()
const searchPage = fs.readFileSync('pages/search.html').toString()
const viewPage = fs.readFileSync('pages/view.html').toString()

const randomBytes = promisify(crypto.randomBytes)
const makeId = async () => (await randomBytes(16)).toString('hex')
const normalizeId = id => id.toLowerCase().trim().substring(0, 32)

const encryptToken = async (content) => {
  const iv = await randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', tokenKey, iv)
  const cipherText = cipher.update(content)
  cipher.final()
  const tokenContent = Buffer.concat([iv, cipherText, cipher.getAuthTag()])
  return tokenContent.toString('base64')
}

const decryptToken = async (token) => {
  try {
    const tokenContent = Buffer.from(token, 'base64')
    const iv = tokenContent.slice(0, 12)
    const authTag = tokenContent.slice(tokenContent.length - 16)
    const cipher = crypto.createDecipheriv('aes-256-gcm', tokenKey, iv)
    cipher.setAuthTag(authTag)
    const plainText = cipher.update(tokenContent.slice(12, tokenContent.length - 16))
    return plainText.toString()
  } catch (e) {
    return null
  }
}

const parseReq = async (req, res) => {
  const [pathname, query] = req.url.split('?', 2)
  const qs = new URLSearchParams(query)
  const cookies = new Map(decodeURIComponent(req.headers.cookie || '').split('; ').map(c => c.split('=')))
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
  const sendError = (code, msg) => {
    res.writeHead(code, { 'content-security-policy': `default-src 'none'`, 'content-type': 'text/html' })
    res.end(`<h3>MariaBin encountered an unexpected error...</h3><div>${msg}</div>`)
  }
  return { pathname, qs, cookies, body, sendError }
}

const users = new Map([[adminName, 'admin']])
const pastes = new Map()

http.createServer(async (req, res) => {
  const parsed = await parseReq(req, res)
  if (!parsed) {
    return
  }
  const { pathname, cookies, body, sendError } = parsed
  if (pathname === '/images.jpg' && req.method === 'GET') {
    res.writeHead(200, { 'content-type': 'image/jpg' })
    res.end(logoJpg)
  } if (pathname === '/' && req.method === 'GET') {
    res.writeHead(200, { 'content-type': 'text/html', 'content-security-policy': `default-src 'none'; img-src 'self'; form-action 'self'; style-src 'unsafe-inline'` })
    res.end(registerPage)
  } else if (pathname === '/new' && req.method === 'GET') {
    const type = users.get(await decryptToken(cookies.get('__Host-token')))
    if (!type) {
      sendError(401, 'bad token')
      return
    }
    const csrf = await makeId()
    res.writeHead(200, {
      'content-type': 'text/html',
      'set-cookie': `__Host-csrf=${encodeURIComponent(csrf)}; Secure; path=/; HttpOnly`,
      'content-security-policy': `default-src 'none'; img-src 'self'; form-action 'self' ${rawOrigin}; style-src 'unsafe-inline'`
    })
    res.end(mustache.render(newPage, {
      csrf,
      flag: type === 'admin' ? flag : null
    }))
  } else if (pathname === '/new' && req.method === 'POST') {
    const type = users.get(await decryptToken(cookies.get('__Host-token')))
    if (!type) {
      sendError(401, 'bad token')
      return
    }
    const content = body.get('content')
    if (!content) {
      sendError(400, 'bad content')
      return
    }
    const pasteId = await makeId()
    pastes.set(pasteId, content)
    res.writeHead(302, {
      location: `${rawOrigin}/view?id=${pasteId}`
    }).end()
  } else if (pathname === '/search' && req.method === 'POST') {
    const type = users.get(await decryptToken(cookies.get('__Host-token')))
    if (!type) {
      sendError(401, 'bad token')
      return
    }
    const csrfCookie = cookies.get('__Host-csrf')
    const csrfForm = body.get('csrf')
    if (!csrfCookie || !csrfForm || csrfCookie !== csrfForm) {
      sendError(400, 'bad csrf')
      return
    }
    const name = body.get('name')
    if (!name) {
      sendError(400, 'bad name')
      return
    }
    const optionType = body.get('type')
    if (!type) {
      sendError(400, 'bad type')
      return
    }
    if (optionType !== type && type !== 'admin') {
      sendError(403, 'the admins need privacy')
      return
    }
    const filteredUsers = []
    for (const [filterName, filterType] of users.entries()) {
      if (filterType === optionType && filterName.startsWith(name)) {
        filteredUsers.push(filterName)
      }
    }
    if (filteredUsers.length === 0) {
      sendError(404, 'no results')
      return
    }
    res.writeHead(200).end(mustache.render(searchPage, {
      users: filteredUsers
    }))
  } else if (pathname === '/register' && req.method === 'POST') {
    const name = body.get('name')
    if (!name) {
      sendError(400, 'bad name')
      return
    }
    if (users.has(name)) {
      sendError(409, 'name conflict')
      return
    }
    users.set(name, 'user')
    const token = await encryptToken(name)
    res.writeHead(302, {
      'set-cookie': `__Host-token=${encodeURIComponent(token)}; Secure; path=/; HttpOnly`,
      location: '/new'
    }).end()
  } else {
    sendError(404, 'not found')
  }
}).listen(appPort, () => {
  console.log('app listening on', appPort)
})

http.createServer(async (req, res) => {
  const parsed = await parseReq(req, res)
  if (!parsed) {
    return
  }
  const { pathname, qs, sendError } = parsed
  if (pathname === '/view' && req.method === 'GET') {
    const id = qs.get('id')
    if (!id) {
      sendError(400, 'bad id')
    }
    const content = pastes.get(normalizeId(id))
    if (!content) {
      sendError(404, 'unknown paste')
    }
    res.writeHead(200, { 'content-type': 'text/html' })
    res.end(mustache.render(viewPage, { id, content }))
  } else {
    sendError(404, 'not found')
  }
}).listen(rawPort, () => {
  console.log('raw listening on', rawPort)
})
