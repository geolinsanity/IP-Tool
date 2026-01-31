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
        }).then((user) => {
            res.status(201).json(
                {
                    message: 'Added user'
                }
            )
        }).catch((err) => {
            console.error(err)
        })
    } catch (err) {
        console.error(err) 
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        console.log(user)
        if(!user) {
            res.json('User does not exist')
        }
        const checkPassword = await Auth.checkPassword(password, user.password);
        if(!checkPassword) {
            res.json('Wrong password')
        }
        console.log(process.env.SECRET_KEY)

        const payload = {
            user_id: user._id,
            username: user.username,
            user_role: user.role_id,
        }

        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '1h'
        });
        res.header('token', token).json({
            success: true,
            message: 'Login successful'
        })
    } catch (err) {
        console.error(err)
    }
}

// module.exports = { createUser }