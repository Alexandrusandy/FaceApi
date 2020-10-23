const express = require('express');
const bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
app.post('/signin', signin.handleSignin(pool, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, pool, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, pool)})
app.put('/image', (req, res) => { image.handleImage(req, res, pool)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, ()=> {
  console.log('app is running on port ${process.env.PORT}');
})