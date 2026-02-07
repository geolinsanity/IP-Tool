const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.hashPass = async (password) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        return hashPassword;
    } catch (err) {
        console.error('Error hashing password:', err);
        throw new Error('Error hashing password: ' + err.message);
    }
}

exports.checkPassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (err) {
        console.error('Error checking password:', err);
        throw new Error('Error checking password: ' + err.message);
    }
}

exports.checkToken = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({ message: 'Login first' });
        }

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY)
        req.user = verifyToken;
        console.log(req.user)
        return next();
    } catch (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ message: 'Token is invalid or expired', error: err.message })
    }
}

exports.isUser = async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(401).json({ message: 'Forbidden' })
        }
        const allowedRoles = [1,2,3];
        const userRole = req.user.userRole;
        if(allowedRoles.includes(userRole)) {
            return next();
        }
        
        return res.status(403).json({ message: 'You do not have permission for this' });
    } catch (err) {
        console.error('Error checking user permission:', err);
        return res.status(500).json({ message: 'Error checking user permission', error: err.message });
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(401).json({ message: 'Forbidden' })
        }
        const allowedRoles = [2,3];
        const userRole = req.user.userRole;
        if(allowedRoles.includes(userRole)) {
            return next();
        }
        
        return res.status(403).json({ message: 'You do not have permission for this' });
    } catch (err) {
        console.error('Error checking admin permission:', err);
        return res.status(500).json({ message: 'Error checking admin permission', error: err.message });
    }
}