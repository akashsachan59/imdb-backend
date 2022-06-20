const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}))

const port = 3000

const Airtable = require('airtable');
const res = require('express/lib/response')
const base = new Airtable({ apiKey: 'keysVKJT0WBapnQ7a' }).base('app6jlh4CFLGNTjak');


// signup
app.post('/signup', (req, res) => {
  try {
    let reqEmail = req.body.email
    let reqPassword = req.body.password
    base('user').create([
        {
            "fields": {
                "email": `${reqEmail}`,
                "password": `${reqPassword}`,
            }
        }
    ], function (err, records) {
        if (err) {
            res.status(500)
            res.send('error')
            console.error(err);
            return;
        } else {
            let obj = {
                user: true,
                msg: "user successfully created"
            }
            res.status(200)
            res.send(obj)
        }
    })
  } catch (error) {
    console.log(error)
  }
})    
  
// login
app.post('/login', (req, res) => {
  // console.log("got hit")
  // console.log()
  try {
    let reqEmail = req.body.email
    let reqPassword = req.body.password
    console.log(reqEmail, reqPassword)
    base('user').select({
        filterByFormula: `{email} = "${reqEmail}"`
    }).firstPage(function (err, records) {
        // console.log(records.length)
        if (err) {
            let obj = {
                message: "user not found"
            }
            res.status(404)
            res.send(obj)
            console.error(err)
            return
        }
        if (records.length > 0) {
            let email = records[0].get('email')
            let password = records[0].get('password')
            if (email === reqEmail && password === reqPassword) {
                let obj = {
                    token: records[0].get('id'),
                    isloggedin: true
                }
                res.status(200)
                res.send(obj)
            } else {
                let obj = {
                    token: 'wrong password',
                    isloggedin: false
                }
                res.status(404)
                res.send(obj)
            }
        } else {
            let obj = {
                token: 'No user found',
                isloggedin: false
            }
            res.status(404)
            res.send(obj)
        }
    })
  } catch (error) {
    console.log(error)
  }
})

// list all movies
app.get('/', (req, res) => {
    try {
        const data = []
        base('movies').select({
        }).eachPage(function page(records) {
            records.forEach(function (record) {
                data.push(record.fields)
            })
            res.send(data)
            res.status(200)
        })
    } catch (error) {
        console.log(error)
    }
})

// create a new movie
app.post('/createMovie', (req, res) => {
    try {
        const data = req.body
        const resData = []
        base('movies').create([
            {
                "fields": {
                  "name": `${data.name}`,
                  "release": data.release,
                  "plot": `${data.plot}`,
                  "poster": [
                    {
                        "url": `${data.poster}`
                    }
                  ],
                  "producer": `${data.producer}`,
                  "actors": `${data.actors}`
                }
            }
          ], function(err, records) {
            if (err) {
              console.error(err);
              return;
            }
            records.forEach(function (record) {
                resData.push(record.fields)
            })
            res.send(resData)
            res.status(200)
          })
    } catch (error) {
        console.log(error)
    }
})

// edit listed movies
app.post('/edit', (req, res) => {
    try {
        const data = req.body
        const resData = []
        // console.log(data)
        base('movies').update([
            {
            "id": `${data.id}`,
            "fields":  {
                  "name": `${data.name}`,
                  "release": `${data.release}`,
                  "plot": `${data.plot}`,
                  "poster": [
                    {
                        "url": `${data.poster}`
                    }
                  ],
                  "producer": `${data.producer}`,
                  "actors": `${data.actors}`
                }
            }], function (err, records) {
            if(err){
                console.error(err);
                return;
            }
            records.forEach(function(record) {
                resData.push(record.fields)
            })
        res.send(resData)
        res.status(200)
    })    
} catch (error) {
        console.log(error)
    }
})

// create an actor
app.post('/createActor', (req, res) => {
    try {
        const data = req.body
        const resData = []
        base('actor').create([
            {
              "fields": {
                "name": `${data.name}`,
                "dob": `${data.dob}`,
                "gender": `${data.gender}`,
                "bio": `${data.bio}`,
              }
            }
          ], function(err, records) {
            if (err) {
                console.error(err);
                return;
              }
            records.forEach(function (record) {
                resData.push(record.fields)
            })
            res.send(resData)
            res.status(200)
          })
    } catch (error) {
        console.log(error)
    }   
})

// create a producer
app.post('/createProducer', (req, res) => {
    try {
        const data = req.body
        const resData = []
        base('producer').create([
            {
              "fields": {
                "name": `${data.name}`,
                "dob": `${data.dob}`,
                "gender": `${data.gender}`,
                "bio": `${data.bio}`,
              }
            }
          ], function(err, records) {
            if (err) {
              console.error(err);
              return;
            }
            records.forEach(function (record) {
                resData.push(record.fields)
            })
            res.send(resData)
            res.status(200)
          })
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})