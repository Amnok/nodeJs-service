/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// body parser middleware
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());

// DB config
const db = require('./config/key').mongoURI;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('****MONGODB CONNECTED****')).catch((err) => console.log('error occured----------------->', err));
app.get('/', (req, res) => res.send('****API RUNNING****'));

// use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`****SERVING RUNNING AT PORT**** ${port}`));
