const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
const path = require('path');
const mime = require('mime');
const crypto = require('crypto');
const Database = require('better-sqlite3');

require('dotenv').config();

const routes = {
    staticFiles: async (req, res) => {
        // get file path
        let filePath = path.join('public', url.parse(req.url).pathname);
        if (filePath.endsWith('/')) {
            filePath = path.join(filePath, 'index.html');
        } const type = mime.getType(path.extname(filePath));

        // read file and stuff
        try {
            const content = await fs.promises.readFile(filePath);
            res.writeHead(200, { 'Content-Type': type });
            res.end(content, 'utf-8');
        } catch (error) {
            res.writeHead(['ENOENT', 'EISDIR'].includes(error.code) ? 404 : 500);
            res.end();
        }
    },

    api: async (req, res) => {
        const route = url.parse(req.url).pathname.substr(5);
        if (!api.has(route)) {
            res.writeHead(404);
            res.end();
            return;
        }
        api.get(route)(req, res);
    }
};

const recipes = [
    { 
        "id": 0,
        "name": "A redpwnCTF Review's Exceptionally Dry Cracker",
        "description": "A cookie that's hard to swallow",
        "price": 10,
        "recipe": "Unfortunately, I spent so long making this challenge look pretty that I didn't have time to write flavor text. Just imagine some witty remark—maybe a cookie-related pun."
    },
    { 
        "id": 1,
        "name": "ÅngstromCTF's Perfect Infrastructure Macaroon",
        "description": "An overpriced recipe nobody can afford",
        "price": Infinity,
        "recipe": "[flavor text]"
    },
    { 
        "id": 2,
        // I was told to make clear that this is a reference to the last redpwnctf
        // This is NOT a hint; please don't waste time on it
        "name": "/u0tiI6DJlA1Zj9n2irnB/biscuit.txt",
        "description": "This challenge's flag",
        "price": 1000,
        "recipe": process.env.FLAG 
    }
]

const util = {
    // Get request body from request
    parseRequest: async (req) => {
        return await new Promise((resolve, reject) => {
            const chunks = []
            req.on('data', (data) => {
                chunks.push(data);
            });
            req.on('end', () => {
                try {
                    resolve(JSON.parse(Buffer.concat(chunks))); 
                } catch (e) {
                    reject(e);
                }
            });
        });
    },
    respondJSON: async (res, code, data, token) => {
        const headers = {
            'Content-Type': 'application/json'
        }
        if (token) {
            headers['Set-Cookie'] = `token=${token};Path=/`;
        }
        res.writeHead(code, headers);
        res.end(JSON.stringify(data));
    },
    parseCookies: (cookie) => {
        let regex = /([^;=\s]*)=([^;]*)/g;
        const cookies = new Map();
        for (let current; current = regex.exec(cookie);){
            cookies.set(current[1], decodeURIComponent(current[2]));
        }
        return cookies;
    },
    // Parse URL params
    parseParams: (req) => {
        return querystring.parse(url.parse(req.url).query);
    }
};

const api = new Map([
    //Handle user registration
    ['register', async (req, res) => {
        const result = {
            'success': false
        }
        if (req.method !== "POST") {
            res.writeHead(405);
            res.end();
            return;
        }
    
        let data;
        try {
            data = await util.parseRequest(req);
        } catch (error) {
            res.writeHead(400);
            res.end();
            return;
        }

        // Validate username and password
        if (typeof(data.username) !== 'string' || typeof(data.password) !== 'string') {
            result.error = 'Bad input';
            util.respondJSON(res, 400, result);
            return;
        }
        if (data.username.length < 2) {
            result.error = 'Please choose a longer username';
            util.respondJSON(res, 400, result);
            return;
        }

        // Make sure username not taken 
        if (database.hasUser(data.username)) {
            result.error = 'Username taken';
            util.respondJSON(res, 400, result);
            return;
        }

        // Put new user into database
        let userInfo;
        try {
            userInfo = database.register(data.username, data.password, 0);
        } catch (error) {
            res.writeHead(500)
            res.end();
            return;
        }
        
        // Give user some credits
        try {
            database.changeBalance(userInfo.id, 100);
        } catch (error) {
            result.error = "Could not give user credit";
        }

        result.success = true;
        util.respondJSON(res, 200, result, userInfo.token);
    }],
    ['login', async (req, res) => {
        const result = {
            'success': false
        }
        if (req.method !== "POST") {
            res.writeHead(405);
            res.end();
            return;
        }

        let data;
        try {
            data = await util.parseRequest(req);
        } catch (error) {
            res.writeHead(400);
            res.end();
            return;
        }

        // Validate username and password
        if (typeof(data.username) !== 'string' || typeof(data.password) !== 'string') {
            result.error = 'Bad input';
            util.respondJSON(res, 400, result);
            return;
        }

        let token;
        try {
            token = database.login(data.username, data.password);
        } catch (error) {
            res.writeHead(500);
            res.end();
        }
        if (!token) {
            result.error = 'Incorrect username or password';
            util.respondJSON(res, 401, result);
        }

        // Check if IP allowed
        const ip = req.socket.remoteAddress;
        try {
            if (!database.ipAllowed(data.username, ip)) {
                result.error = 'IP address not allowed';
                util.respondJSON(res, 403, result);
                return;
            }
        } catch (error) {
            result.error = 'IP address not allowed';
            util.respondJSON(res, 403, result);
            return;
        }

        result.success = true;
        util.respondJSON(res, 200, result, token);
    }],
    ['getId', async (req, res) => {
        if (req.method !== 'GET') {
            res.writeHead(405);
            res.end();
            return;
        }
        const result = {
            'success': false
        };

        // Get token from cookie
        const cookies = util.parseCookies(req.headers.cookie);
        if (!cookies.has('token')) {
            util.respondJSON(res, 200, result);
            return;
        }
        const token = cookies.get('token');

        // Validate token
        if (typeof(token) !== 'string') {
            result.error = 'Invalid token';
            util.respondJSON(res, 401, result);
            return;
        }

        // Get id from token
        let id;
        try {
            id = database.getId(token);
        } catch (error) {
            res.writeHead(500);
            res.end();
            return;
        }
        if (!id) {
            result.error = 'Invalid token';
            util.respondJSON(res, 401, result);
            return;
        }

        result.id = id;
        result.success = true;
        util.respondJSON(res, 200, result);
    }],
    ['userInfo', async (req, res) => {
        const result = {
            'success': false
        };
        if (req.method !== 'GET') {
            res.writeHead(405);
            res.end();
            return;
        }

        // Get target user id from url params
        const id = util.parseParams(req).id;
        if (typeof id !== 'string') {
            res.writeHead(400);
            res.end();
            return;
        }

        // Get info from database
        let info;
        try {
            info = database.getInfo(id);
        } catch (error) {
            res.writeHead(500);
            res.end();
            return;
        }
        if (!info) {
            result.error = 'ID not found'; 
            util.respondJSON(res, 404, result);
            return;
        }
        result.success = true;
        result.info = info;
        util.respondJSON(res, 200, result);
    }],
    ['getRecipes', async (req, res) => {
        if (req.method !== 'GET') {
            res.writeHead(405);
            res.end();
            return;
        }
        const result = {
            "success": true,
        };

        // Get all recipe info
        result.recipes = [];
        for (const i of recipes) {
            result.recipes.push({
                "id": i.id,
                "name": i.name,
                "description": i.description,
                "price": i.price.toString(),
            });
        }
        util.respondJSON(res, 200, result);
    }],
    ['purchaseRecipe', async (req, res) => {
        if (req.method !== 'POST') {
            res.writeHead(405);
            res.end();
            return;
        }
        const result = {
            'success': false
        };

        // Get and validate token
        const cookies = util.parseCookies(req.headers.cookie);
        if (!cookies.has('token')) {
            util.respondJSON(res, 200, result);
            return;
        }
        const token = cookies.get('token');
        if (typeof(token) !== 'string') {
            result.error = 'Invalid token';
            util.respondJSON(res, 401, result);
            return;
        }

        // Get id from token
        let id;
        try {
            id = database.getId(token);
        } catch (error) {
            res.writeHead(500);
            res.end();
            return;
        }
        if (!id) {
            result.error = 'Invalid token';
            util.respondJSON(res, 401, result);
            return;
        }


        // Get request body
        let data;
        try{
            data = await util.parseRequest(req);
        } catch(error) {
            res.writeHead(400);
            res.end();
            return;
        }

        const recipe_id = data.id;

        // Validate recipe and make sure user does not own it already
        if (typeof recipe_id !== 'number') {
            res.writeHead(400);
            res.end();
            return;
        }
        if (database.ownsRecipe(id, recipe_id)) {
            result.error = 'You already own this recipe!';
            util.respondJSON(res, 400, result);
            return;
        }

        // Make sure recipe actually exists
        if (recipe_id >= recipes.length) {
            result.error = 'Recipe does not exist.';
            util.respondJSON(res, 400, result);
            return;
        }


        // Get price of recipe and make sure user has enough
        const price = recipes[recipe_id].price;

        try {
            const info = database.getInfo(id);
            if (info.balance < price) {
                result.error = 'Balance too low.';
                util.respondJSON(res, 400, result);
                return;
            }
        } catch (error) {
            res.writeHead(500);
            res.end();
            return;
        }

        // Give user the recipe; change user balance
        try {
            database.purchaseRecipe(id, recipe_id);
            database.changeBalance(id, -1 * price);
        } catch (error) {
            res.writeHead(500);
            res.end();
            return;
        }
        result.success = true;
        util.respondJSON(res, 200, result);
    }],
    ['getPurchases', async (req, res) => {
        if (req.method !== 'GET') {
            res.writeHead(405);
            res.end();
            return;
        }
        const result = {
            'success': false
        };

        // Get token from cookie
        const cookies = util.parseCookies(req.headers.cookie);
        if (!cookies.has('token')) {
            util.respondJSON(res, 200, result);
            return;
        }
        const token = cookies.get('token');
        if (typeof(token) !== 'string') {
            result.error = 'Invalid token';
            util.respondJSON(res, 401, result);
            return;
        }

        // Get user id from token
        let id;
        try {
            id = database.getId(token);
        } catch (error) {
            res.writeHead(500);
            res.end();
            return;
        }
        if (!id) {
            result.error = 'Invalid token';
            util.respondJSON(res, 401, result);
            return;
        }

        // Get the user's purchases
        let purchases;
        try {
            purchases = database.getPurchases(id); 
        } catch (error) {
            res.writeHead(500);
            res.end();
            return;
        }
        result.purchases = Array.from(purchases);
        result.success = true;

        util.respondJSON(res, 200, result);
    }],
    ['gift', async (req, res) => {
        if (req.method !== 'POST') {
            res.writeHead(405);
            res.end();
            return;
        }
        const result = {
            'success': false
        };

        // Get token from cookie
        const cookies = util.parseCookies(req.headers.cookie);
        if (!cookies.has('token')) {
            util.respondJSON(res, 200, result);
            return;
        }

        const token = cookies.get('token');
        if (typeof(token) !== 'string') {
            result.error = 'Invalid token';
            util.respondJSON(res, 401, result);
            return;
        }


        // Get id from token
        let id;
        try {
            id = database.getId(token);
        } catch (error) {
            res.writeHead(500);
            res.end();
            return;
        }
        if (!id) {
            result.error = 'Invalid token';
            util.respondJSON(res, 401, result);
            return;
        }

        // Make sure request is from admin
        try {
            if (!database.isAdmin(id)) {
                res.writeHead(403);
                res.end();
                return;
            }
        } catch (error) {
            res.writeHead(500);
            res.end();
            return;
        }

        // Get target user id from url
        const user_id = util.parseParams(req).id;
        if (typeof user_id !== 'string') {
            res.writeHead(400);
            res.end();
            return;
        }

        // Make sure user exists
        try {
            if (!database.getInfo(user_id)) {
                res.writeHead(400);
                res.end();
                return;
            }
        } catch (error) {
            res.writeHead(500);
            res.end();
            return;
        }

        // Make sure user has not already received a gift
        try {
            if (database.receivedGift(user_id)) {
                util.respondJSON(res, 200, result); 
                return;
            }
        } catch (error) {
            res.writeHead(500);
            res.end();
            return;
        }

        // Check admin password to prevent CSRF
        let body;
        try {
            body = await util.parseRequest(req);
        } catch (error) {
            res.writeHead(400);
            res.end();
            return;
        }

        const password = body.password;
        
        try {
            if (!database.checkPassword(id, password)) {
                res.writeHead(401);
                res.end();
                return;
            }
        } catch (error) {
            res.writeHead(500);
            res.end();
            return;
        }

        // Give user 10 credits
        try {
            if (!database.changeBalance(user_id, 150)) {
                // How did we get here
                res.writeHead(500);
                res.end();
                return;
            }
        } catch (error) {
            res.writeHead(500);
            res.end();
            return;
        }

        // User can only receive one gift
        try {
            database.setReceived(user_id);
        } catch (error) {
            res.writeHead(500);
            res.end();
        }

        result.success = true;
        util.respondJSON(res, 200, result);
    }]
]);


const database = {
    db: new Database('db.sqlite3'), 
    init: () => {
        database.db.prepare(`CREATE TABLE IF NOT EXISTS users(
            id TEXT PRIMARY KEY, 
            username TEXT, 
            password TEXT, 
            allowed_ip TEXT, 
            balance INTEGER,
            received_gift BOOLEAN,
            admin BOOLEAN);`).run();
        database.db.prepare(`CREATE TABLE IF NOT EXISTS purchases(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            recipe_id INTEGER);`).run();
        database.db.prepare(`CREATE TABLE IF NOT EXISTS tokens(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token TEXT,
            user_id TEXT
            );`).run();
    },
    resetUsers: () => {
        statements.resetUsers.run();
    },
    hasUser: (username) => {
        return !!statements.fromUsername.get(username);
    },
    getInfo: (id) => {
        const result = statements.fromId.get(id);
        if (!result) {
            return false;
        }
        return result;
    },
    getId: (token) => {
        const result = statements.fromToken.get(token);
        if (!result) {
            return false;
        }
        return result.user_id;
    },
    isAdmin: (id) => {
        const result = statements.isAdmin.get(id);
        if (!result) {
            return false;
        }
        return result.admin;
    },
    register: (username, password, admin, id='', token='') => {
        if (!id) {
            id = crypto.randomBytes(8).readBigUInt64LE().toString();
        }
        if (!token) {
            token = crypto.randomBytes(16).toString('hex');
        }
        statements.register.run(id, username, password, 0, 0, admin);
        statements.addToken.run(token, id);
        const info = database.getInfo(id)
        info.token = token;
        return info;
    },
    login: (username, password) => {
        const result = statements.login.get(username, password);
        if (!result) {
            return false
        }
        const id = result.id;
        const token = statements.getToken.get(id);
        if (!token) {
            return false;
        }
        return token.token;
    },
    changeBalance: (id, amount) => {
        const info = database.getInfo(id);
        if (!info) {
            return false;
        }
        statements.setBalance.run(info.balance + amount, id); 
        return true;
    },
    purchaseRecipe: (id, recipe_id) => {
        statements.purchaseRecipe.run(id, recipe_id)
    },
    ownsRecipe: (id, recipe_id) => {
        const result = statements.ownsRecipe.get(id, recipe_id);
        if (result) {
            return true;
        }
        return false;
    },
    getPurchases: (id) => {
        const result = statements.getPurchases.all(id);
        const purchases = new Set();
        if (!result) {
            return purchases;
        }
        for (const purchase of result) {
            purchases.add(recipes[purchase.recipe_id]);
        }
        return purchases;
    },
    receivedGift: (id) => {
        const result = statements.receivedGift.get(id);
        if (result.received_gift) {
            return true;
        }
        return false;
    },
    checkPassword: (id, password) => {
        const result = statements.checkPassword.get(id, password);
        if (!result) {
            return false;
        }
        return true;
    },
    setReceived: (id) => {
        statements.setReceived.run(id);
    },
    ipAllowed: (username, ip) => {
        const result = statements.allowedIp.get(username);
        const allowedIp = result.allowed_ip;
        if (!allowedIp) {
            return true;
        }
        return ip === allowedIp;
    }
};

database.init();

const statements = {
    resetUsers: database.db.prepare('DROP TABLE IF EXISTS users;'),
    fromUsername: database.db.prepare('SELECT * FROM users WHERE username = ?;'),
    fromId: database.db.prepare('SELECT * FROM users WHERE id = ?;'),
    fromToken: database.db.prepare('SELECT user_id FROM tokens WHERE token = ?;'),
    isAdmin: database.db.prepare('SELECT admin FROM users WHERE id = ?;'),
    register: database.db.prepare(`INSERT INTO 
        users (id, username, password, balance, received_gift, admin) 
        VALUES (?, ?, ?, ?, ?, ?);`),
    addToken: database.db.prepare(`INSERT INTO
        tokens (token, user_id)
        VALUES (?, ?);`),
    getToken: database.db.prepare('SELECT token FROM tokens WHERE user_id = ?;'),
    login: database.db.prepare('SELECT id FROM users WHERE username = ? AND password = ?;'),
    setBalance: database.db.prepare('UPDATE users SET balance = ? WHERE id = ?'),
    purchaseRecipe: database.db.prepare(`INSERT INTO
        purchases (user_id, recipe_id)
        VALUES (?, ?);`),
    ownsRecipe: database.db.prepare('SELECT * FROM purchases WHERE user_id = ? AND recipe_id = ?;'),
    getPurchases: database.db.prepare('SELECT * FROM purchases WHERE user_id = ?;'),
    receivedGift: database.db.prepare('SELECT received_gift FROM users WHERE id = ?;'),
    checkPassword: database.db.prepare('SELECT * FROM users WHERE id = ? AND password = ?;'),
    setReceived: database.db.prepare('UPDATE users SET received_gift = 1 WHERE id = ?;'),
    allowedIp: database.db.prepare('SELECT allowed_ip FROM users WHERE username = ?;'),
    setIp: database.db.prepare('UPDATE users SET allowed_ip = ? WHERE id = ?;')
};


const requestTimes = new Map();

const server = http.createServer(async (req, res) => {
    // handle api stuff
    if (req.url.startsWith('/api/')) {
        await routes.api(req, res); 
        return;
    }

    // serve static files
    await routes.staticFiles(req, res);
});

// Add admin account if it does not exist yet
if (!database.hasUser('admin')) {
    // Admin gets id 0
    database.register('admin', process.env.ADMIN_PASS, 1, '0', process.env.ADMIN_TOKEN);
    statements.setIp.run('::1', '0');
}

server.listen(3000);
