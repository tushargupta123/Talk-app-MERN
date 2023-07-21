const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({id},"secret",{
        expiresIn: "1h"
    })
}

module.exports = generateToken