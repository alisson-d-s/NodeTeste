const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authConfig = require('../../config/auth.json');

const User = require('../model/User.js');

const router = express.Router();
router.use(express.json());

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post('/register', async (req, res) => {
    try{
        const { email } = req.body;
        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'Email already exists' });

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({ 
            user,
            token: generateToken({ id: user.id }),
        });
    }catch(err){
        return res.status(400).send(`Registration failed\n\r ${err}`);
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user)
        return res.status(400).send({ error: 'User not found' });

    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid password' });

    user.password = undefined;

    return res.send({ 
        user,
        token: generateToken({ id: user.id }),
    });
});

module.exports = app => app.use('/auth', router);