var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");
require('dotenv').config();
const auth = require("../middleware/auth");

const User = require("../models").User;

/* GET users listing. */
router.post('/register', async (req, res) => {
    try {
        const {name, password, email, number} = req.body;

        if (!(email && password && name && number)) {
            return res.json({
                error: ['Name, password and email are required fields']
            });
        }

        const oldUser = await User.findOne({
            where: {email}
        })

        if (oldUser) {
            return res.json({
                error: ['User with this email already exists']
            })
        }

        let encryptedPassword = await bcrypt.hash(password, 10);

        let user;
        try {
            user = await User.create({
                name,
                number,
                email: email.toLowerCase(),
                password: encryptedPassword
            });
        } catch (e) {
            return res.json({error: e.errors.map(i => i.message)})
        }

        const token = jwt.sign(
            {user_id: user.id},
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        user.token = token;

        return res.status(201).json(user)
    } catch (err) {
        console.log(err)
    }
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!(email && password)) {
            return res.json({
                error: ['Password and email are required fields']
            });
        }

        const user = await User.findOne({
            where: {email}
        })

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                {user_id: user.id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h"
                }
            )
            user.token = token
            return res.status(200).json(user)
        }

        return res.json({error: ['Invalid credentials']})
    } catch (err) {
        return res.json({error: ['Error']})
    }
})

router.get('/logout', function (req, res) {
    return res.redirect('/login')
})


router.delete('/remove', auth, async function (req, res) {

    const user = await User.findByPk(req.user_id);

    if(!user) {
        return res.json({
            error: ['User not found']
        });
    }

    await user.destroy();
    return res.json({
        msg: 'ok'
    });

})

router.get('/me', auth, async function (req, res) {
    const user = await User.findByPk(req.user_id);

    return res.status(200).json(user);
})


module.exports = router;
