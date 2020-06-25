const express = require('express')
const path = require('path')
const app = express()

//Don't forget to redact from published source
const flag = '[REDACTED]'

app.get('/', (req, res) => {
    res.redirect('/page?path=index.html')
})

app.get('/page', (req, res) => {

    let path = req.query.path

    //Handle queryless request
    if(!path || !strip(path)){
        res.redirect('/page?path=index.html')
        return
    }

    path = strip(path)

    path = preventTraversal(path)

    res.sendFile(prepare(path), (err) => {
        if(err){
            if (! res.headersSent) {
                try {
                    res.send(strip(req.query.path) + ' not found')
                } catch {
                    res.end()
                }
            }
        }
    })
})

//Prevent directory traversal attack
function preventTraversal(dir){
    if(dir.includes('../')){
        let res = dir.replace('../', '')
        return preventTraversal(res)
    }

    //In case people want to test locally on windows
    if(dir.includes('..\\')){
        let res = dir.replace('..\\', '')
        return preventTraversal(res)
    }
    return dir
}

//Get absolute path from relative path
function prepare(dir){
    return path.resolve('./public/' + dir)
}

//Strip leading characters
function strip(dir){
    const regex = /^[a-z0-9]$/im

    //Remove first character if not alphanumeric
    if(!regex.test(dir[0])){
        if(dir.length > 0){
            return strip(dir.slice(1))
        }
        return ''
    }

    return dir
}

app.listen(3000, () => {
    console.log('listening on 0.0.0.0:3000')
})
