const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.hashPass = async (password) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        return hashPassword;
    } catch (err) {
        console.error(err)
    }
}

exports.checkPassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (err) {
        console.error(err)
    }
}

exports.checkToken = (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if(header === undefined) {
            return res.json('Login first')
        }
        if(!header || !header.startsWith('Bearer ')) {
            return res.status(401).json('Forbidden')
        }
        const token = header.split(' ')[1];
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY)
        console.log(verifyToken)
        req.user = verifyToken;
        console.log(req.user)
        return next();
    } catch (err) {
        console.error(err)
        return res.status(401).json('Token is invalid or expired')
    }
}

exports.isUser = async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(401).json('Forbidden')
        }
        const allowedRoles = [1,2,3];
        const userRole = req.user.userRole;
        if(allowedRoles.includes(userRole)) {
            return next();
        }
        
        return res.status(403).json('You do not have permission for this')
    } catch (err) {
        console.error(err)
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(401).json('Forbidden')
        }
        const allowedRoles = [2,3];
        const userRole = req.user.userRole;
        if(allowedRoles.includes(userRole)) {
            return next();
        }
        
        return res.status(403).json('You do not have permission for this')
    } catch (err) {
        console.error(err)
    }
}