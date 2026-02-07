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

        return res.status(201).json({ message: 'Added user' });
    } catch (err) {
        console.error('Error creating user:', err);
        return res.status(500).json({ message: 'Error creating user', error: err.message });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username)
        const user = await User.findOne({ username: username });
        if(!user) {
            return res.json({ message: 'User does not exist' })
        }
        const checkPassword = await Auth.checkPassword(password, user.password);
        if(!checkPassword) {
            return res.json({ message: 'Wrong password' })
        }

        let payload = {
            userID: user._id,
            username: user.username,
            userRole: user.role_id,
        }

        const tokenExpiry = 60 * 60;
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: tokenExpiry
        });

        return res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            path: '/',
            maxAge: tokenExpiry * 1000
        }).json({
            success: true,
            message: 'Login successful'
        });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ message: 'Error during login', error: err.message });
    }
}

exports.logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            path: '/'
        }).status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Error during logout:', err);
        return res.status(500).json({ message: 'Error during logout', error: err.message });
    }
}