/* eslint-disable no-console */
const express = require('express');

const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/key');
// load user model
const User = require('../../models/User');


// @route GET api/users
// @desc  login user/ return users
// @access public

router.get('/', (req, res) => {
  User.find({}).then((data) => {
    if (data && data.length > 0) {
      return res.status(200).json({ result: data });
    }
    return res.status(400).json('Some Error occured');
  });
});

// @route GET api/users/test
// @desc  tests users route
// @access public

router.get('/test', (req, res) => {
  res.json({
    message: 'users works',
  });
});

// @route GET api/users/register
// @desc  reguister user
// @access public

router.post('/register', (req, res) => {
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      res.status(400).json({
        email: 'email already exists',
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: 200,
        r: 'pg',
        d: 'mm',
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          newUser.password = hash;
          newUser.save().then((tempUser) => {
            res.json(tempUser).catch((err) => console.log(err));
          });
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc  login user/ return token
// @access public

router.post('/login', (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  User.findOne({
    email,
  }).then((user) => {
    if (!user) {
      return res.status(400).json({
        email: 'user not found',
      });
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        }; // payload for JWT
        jwt.sign(payload, keys.secretKey, {
          expiresIn: 3600,
        }, (err, token) => {
          res.json({
            success: true,
            token: `Bearer ${token}`,
          });
        });
      } else {
        return res.status(400).json({
          password: "password doesn't match",
        });
      }
    });
  });
});


module.exports = router;
