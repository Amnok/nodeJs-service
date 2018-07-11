const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// load user model
const User = require('../../models/User');


// @route GET api/users/test
// @desc  tests users route 
// @access public

router.get('/test', (req, res) => {
    res.json({
        message: "users works"
    });
})


// @route GET api/users/register
// @desc  reguister user
// @access public

router.post('/register', (req, res) => {
    User.findOne({
        email: req.body.email
    }).then((user) => {
        if (user) {
            res.status(400).json({
                email: "email already exists"
            });
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: 200,
                r: 'pg',
                d: 'mm'
            })
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar: avatar,
                password: req.body.password
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    newUser.password = hash;
                    newUser.save().then((user) => {
                        res.json(user).catch(err => console.log(err))
                    })
                })
            })
        }
    })
})

// @route GET api/users/login
// @desc  login user/ return token
// @access public

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
        email
    }).then((user) => {
        if (!user) {
            return res.status(400).json({
                email: "user not found"
            })
        }
        bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
                res.json({
                    msg: "success"
                })
            } else {
                return res.status(400).json({
                    password: "password doesn't match"
                })
            }
        })

    })
})

module.exports = router;