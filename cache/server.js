const http = require('http')
const fs = require('fs')
const url = require('url')
const crypto = require('crypto')

http.createServer((req, res) => {
    let u = url.parse(req.url)
    if (u.pathname === '/') {
        let data = fs.readFileSync('./index.html')
        res.end(data)
    } else if (u.pathname.includes('.js') || u.pathname.includes('.css')) {
        console.log(u.pathname)
        let data = fs.readFileSync(`.${u.pathname}`)
        res.end(data)
    } else if (u.pathname === '/resource/images/1.jpg') {
        let data = fs.readFileSync('./resource/images/1.jpg')
        res.setHeader('Expires', new Date('2024-06-27').toUTCString())
        res.setHeader('Cache-Control', 'max-age=5')
        res.setHeader('Set-Cookie', ['user=cc'])
        res.end(data)
    } else if (u.pathname === '/resource/images/2.jpg') {
        let data = fs.readFileSync('./resource/images/2.jpg')
        let eTag = getEtag(data)
        if (req.headers['if-none-match'] === eTag) {
            res.statusCode = 304
            res.end()
        } else {
            res.setHeader('ETag', eTag)
            res.statusCode = 200
            res.end(data)
        }
    } else if (u.pathname === '/resource/images/3.jpg') {
        let stat = fs.statSync('./resource/images/3.jpg')
        let lastModified = stat.mtime.toUTCString()
        res.setHeader('Cache-Control', 'no-cache')
        if (req.headers['if-modified-since'] === lastModified) {
            res.statusCode = 304
            res.end()
        } else {
            let data = fs.readFileSync('./resource/images/3.jpg')
            res.statusCode = 200
            res.setHeader('Last-Modified', lastModified)
            res.end(data)
        }
    } else {
        res.statusCode = 404
        res.end()
    }
}).listen(3000, () => {
    console.log('http server started on port 3000');
})


function getEtag(data) {
    let hash = crypto.createHash('md5')
    hash.update(data)
    return hash.digest('hex')
}
