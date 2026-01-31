const bcrypt = require('bcryptjs');

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