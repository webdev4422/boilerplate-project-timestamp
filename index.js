// index.js
// where your node app starts

// init project
const express = require('express')
const app = express()
// const port = 3000 // 443

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
const cors = require('cors')
app.use(cors({ optionsSuccessStatus: 200 })) // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html')
})


// TODO:
// GET: /api/1451001600000 should return {unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT"}
// GET: /api/2015-12-25 should return {unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT"}
// Source: Using Route parameters https://expressjs.com/en/guide/routing.html


// first API endpoint
app.get( '/api/', function (req, res) {
  let dateUtc = new Date().toUTCString()
  res.json({ unix: Date.now(), utc: dateUtc })
})

// second API endpoint
app.get( '/api/:date?', function (req, res) {
  // Request object value
  let reqParams = req.params.date
  // Number of milliseconds elapsed since January 1, 1970 00:00:00 UTC
  const regexCheckUnix = /^\d{13}$/
  // Date Time String Format in the ECMAScript specification https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse https://tc39.es/ecma262/#sec-date-time-string-format
  const regexCheckUtc = /^\d{4}$|^\d{4}-\d{2}$|^\d{4}-\d{2}-\d{2}$|^\d{4}-\d{2}-\d{2}T([01][0-9]|[2][0-4]):([0-5][0-9])$|^\d{4}-\d{2}-\d{2}T([01][0-9]|[2][0-4]):([0-5][0-9]):([0-5][0-9])$|^\d{4}-\d{2}-\d{2}T([01][0-9]|[2][0-4]):([0-5][0-9]):([0-5][0-9])\.[0-9][0-9][0-9](Z|(\-|\+)([01][0-9]|[2][0-4]):([0-5][0-9]))$/


  // Check if request match regex unix timestamp (number of milliseconds)
  if (reqParams.match(regexCheckUnix)) {
    let convertUnixToUtc = (new Date (Number(reqParams))).toUTCString() // Tue, 12 May 2020 23:50:21 GMT
    let paramToNumber = Number(reqParams) // typeof 1451001600000
    res.json({unix: paramToNumber, utc: convertUnixToUtc})
    // console.log(`Request params: ${paramToNumber}\nResponse: 'unix: ${reqParams}, utc: ${convertUnixToUtc}'`)

  // Check if request match regex date
  } else if (reqParams.match(regexCheckUtc)) {
    let convertDateToUnix = new Date (reqParams).getTime()
    let convertDateToUnixToUtc = (new Date (Number(convertDateToUnix))).toUTCString()
    // If date not pass parsing 'Date.parse()'
    if (convertDateToUnixToUtc == "Invalid Date") {
      res.json({error : "Invalid Date"})
    } else {
      res.json({unix: convertDateToUnix, utc: convertDateToUnixToUtc})
      // console.log(`Request params: ${reqParams}\nResponse: 'unix: ${convertDateToUnix}, utc: ${convertDateToUnixToUtc}'`)
    }


  } else {
    res.json({error : "Invalid Date"})
    // console.log(`Request params: ${reqParams}\nResponse: 'error : "Invalid Date"'`)
  }
})


// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})