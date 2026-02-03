const User = require('../models/user.model');
const Auth = require('../controllers/auth.controller');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const encryptPass = await Auth.hashPass(password);
        console.log(encryptPass)
        await User.create({
            username,
            password: encryptPass,
            role_id: 1
        })

        return res.status(201).json('Added user')
    } catch (err) {
        console.error(err) 
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if(!user) {
            res.json('User does not exist')
        }
        const checkPassword = await Auth.checkPassword(password, user.password);
        if(!checkPassword) {
            res.json('Wrong password')
        }

        let payload = {
            userID: user._id,
            username: user.username,
            userRole: user.role_id,
        }

        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '1h'
        });

        return res.header('token', token).json({
            success: true,
            message: 'Login successful'
        })
    } catch (err) {
        console.error(err)
    }
}