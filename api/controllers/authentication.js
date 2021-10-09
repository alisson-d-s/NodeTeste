const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth.json');

const User = require('../model/User.js');

const router = express.Router();
router.use(express.json());

router.post('/register', async (req, res) => {
    try{
        const { email } = req.body;
        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'Email already exists' });

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({ user });
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

    const token = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: 86400,
    });

    user.password = undefined;

    res.send({ user, token });
});

module.exports = app => app.use('/auth', router);