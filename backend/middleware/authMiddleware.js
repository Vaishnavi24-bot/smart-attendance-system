const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        console.log("❌ No token provided");
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("✅ Token verified for user:", decoded.id);
        next();
    } catch (error) {
        console.log("❌ Token verification failed");
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

module.exports = protect;