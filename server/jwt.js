const { sign, verify } = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const createToken = (user) => {
    const accessToken = sign(
        { username: user.username,
          role: user.user_role
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 86400 }
    );

    return accessToken;
};

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"];

    if (!accessToken) return res.status(400).json({ error: "User not authenticated!" });

    try {
        const validToken = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        if (validToken) {
            req.authenticated = true;
            return next();
        }
    } catch(err) {
        return res.status(400).json({ error: err });
    }
};

module.exports = { createToken, validateToken };