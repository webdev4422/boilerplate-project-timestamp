// index.js
// where your node app starts

// init project
const express = require('express')
const app = express()
const port = 3000 // 443

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
// GET: /api -> return current date in format: {unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT"}
// GET: /api/1451001600000 -> return {unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT"}
// GET: /api/2015-12-25 -> return {unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT"}
// GET: /api/05 October 2011, GMT -> return {unix: 1317772800000, utc: "Wed, 05 Oct 2011 00:00:00 GMT"}
// GET: /api/this-is-not-a-date -> return {error : "Invalid Date"}
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

  // Check if request match regex unix timestamp (number of milliseconds)
  if (reqParams.match(regexCheckUnix)) {
    let convertUnixToUtc = new Date (Number(reqParams)).toUTCString() // Tue, 12 May 2020 23:50:21 GMT
    let paramsToNumber = Number(reqParams) // typeof 1451001600000
    res.json({unix: paramsToNumber, utc: convertUnixToUtc})
    // console.log(`Request params: ${paramsToNumber}\nResponse: 'unix: ${reqParams}, utc: ${convertUnixToUtc}'`)

  // Check if request is compatible with ISO format or extended date formats
  } else {
    try {
      // Convert to ISO format, parsing of a non–standard string value that may not be correctly parsed in non–Mozilla browsers (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString).
      let convertDateToIso = new Date(reqParams).toISOString()
      // Convert to UTC format
      let convertDateToUtc = new Date (convertDateToIso).toUTCString()
      // Convert to unix timestamp
      let convertDateToUnix = new Date (reqParams).getTime()

      res.json({unix: convertDateToUnix, utc: convertDateToUtc})
      // console.log(`Request params: ${reqParams}\nResponse: 'unix: ${convertDateToUnix}, utc: ${convertDateToUtc}'`)

    // Other cases send error
    } catch (error) {
      // console.error(error) // output may be browser-dependent
      res.json({error : "Invalid Date"})
      // console.log(`Request params: ${reqParams}\nResponse: 'error : "Invalid Date"'`)
    }
  }

})


// listen for requests :)
const listener = app.listen(port, process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})


/*
  Issue with "05 October 2011, GMT" (05%20October%202011,%20GMT) date string is that it doesn't conform to ISO 8601 format (https://tc39.es/ecma262/#sec-date-time-string-format), but is required to pass "Your project can handle dates that can be successfully parsed by new Date(date_string)" test (https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/timestamp-microservice).

  The ECMAScript specification states: If the String does not conform to the standard format the function may fall back to any implementation–specific heuristics or implementation–specific parsing algorithm (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse#fall-back_to_implementation-specific_date_formats).


  So I making code to handle special cases, WIP...

  // My regex to check "Date Time String Format" in the ECMAScript specification (ISO 8601 format) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse https://tc39.es/ecma262/#sec-date-time-string-format
  const regexCheckUtc = /^\d{4}$|^\d{4}-\d{2}$|^\d{4}-\d{2}-\d{2}$|^\d{4}-\d{2}-\d{2}T([01][0-9]|[2][0-4]):([0-5][0-9])$|^\d{4}-\d{2}-\d{2}T([01][0-9]|[2][0-4]):([0-5][0-9]):([0-5][0-9])$|^\d{4}-\d{2}-\d{2}T([01][0-9]|[2][0-4]):([0-5][0-9]):([0-5][0-9])\.[0-9][0-9][0-9](Z|(\-|\+)([01][0-9]|[2][0-4]):([0-5][0-9]))$/
  // Check if request match regex date
  if (reqParams.match(regexCheckUtc)) {
    let convertDateToUnix = new Date (reqParams).getTime()
    let convertDateToUnixToUtc = new Date (Number(convertDateToUnix)).toUTCString()
    // If date not pass parsing 'Date.parse()'
    if (convertDateToUnixToUtc == "Invalid Date") {
      res.json({error : "Invalid Date"})
    } else {
      res.json({unix: convertDateToUnix, utc: convertDateToUnixToUtc})
      // console.log(`Request params: ${reqParams}\nResponse: 'unix: ${convertDateToUnix}, utc: ${convertDateToUnixToUtc}'`)
    }
  }

  // Handle special case: not ISO 8601 format, another way to convert to ISO string
  // My regex to check extended NOT COMPLETE!
  const regexCheckExtended = /^\d{1,2}\s((Jan|January)|(Feb|February)|(Mar|March)|(Apr|April)|May|(Jun|June)|(Jul|July)|(Aug|August)|(Sep|September)|(Oct|October)|(Nov|November)|(Dec|December))\s\d{4},\s\w{3}$/
*/