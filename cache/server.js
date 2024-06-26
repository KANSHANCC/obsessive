const http = require('http')
const fs = require('fs')
const url = require('url')
const crypto = require('crypto')
http.createServer((req, res) => {
    let u = url.parse(req.url)
    if (u.pathname === '/') {
        let data = fs.readFileSync('./index.html')
        res.end(data)
    } else if (u.pathname === '/resource/images/1.jpg') {
        let data = fs.readFileSync('./resource/images/1.jpg')
        // res.setHeader('Expires', new Date('2024-06-27').toUTCString())
        res.setHeader('Cache-Control', 'max-age=31536000')
        res.end(data)
    } else if (u.pathname === '/resource/images/2.jpg') {
        let hashHistory = req.headers['if-none-match']
        let data = fs.readFileSync('./resource/images/2.jpg')
        let ETagValue = getEtag(data)
        res.setHeader('ETag', ETagValue)
        if (hashHistory !== ETagValue) {
            res.writeHead(200)
            res.end(data)
        } else {
            res.writeHead(304)
            res.end()
        }
    }
}).listen(3000, () => {
    console.log('http server started on port 3000');
})


function getEtag (data) {
    let hash = crypto.createHash('md5')
    hash.update(data)
    return hash.digest('hex')
}