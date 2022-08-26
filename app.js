// import List from './List'

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose();

const app = express()
const bodyParser = require('body-parser')
const db = new sqlite3.Database('./mock.db', sqlite3.OPEN_READWRITE, (error) => {
    if (error) return console.error(error);

    console.log('connected successfully')
})

app.use(bodyParser.json())
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
      // if(whitelist.includes(origin || ""))
      //     return callback(null, true)
      //
      // callback(new Error('Not allowed by CORS'));
      console.log("origin: ", origin);
      callback(null, true); // everyone is allowed
  }
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({extended: true}))

app.post('/create-db', () => {
    db.run(
        `CREATE TABLE cars(model, car_number, id);`
    )
})

app.delete('/delete-db', () => {
    db.run(
        `DROP TABLE cars;`
    )
})

app.get('/cars', (req, res) => {
    const sql = `SELECT * FROM cars`
  db.all(sql, [], (error, rows) => {
    if (error) return console.error(error);
    res.send({cars: rows})
  })
})

app.post('/cars', (req, res) => {
    const {model, carNumber, id} = req.body;
    const sql = `INSERT INTO cars(model, car_number, id) VALUES(?,?,?)`
  db.run(sql, [model, carNumber, id], (error) => {
    if (error) return console.error(error);
    res.send({message: 'ok'})
  })
})

app.listen(5000, () => {
    console.log(`Наш порт http://127.0.0.1:5000`)
})

module.exports = app

