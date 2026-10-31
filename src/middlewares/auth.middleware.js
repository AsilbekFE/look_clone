const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Avtorizatsiya talab qilinadi! Token topilmadi.'
            });
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'maxfiy_jwt_kalit_look_app_2026';

        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token muddati tugagan! Qaytadan tizimga kiring.'
            });
        }
        return res.status(401).json({
            message: 'Yaroqsiz token!',
            error: error.message
        });
    }
};

module.exports = authMiddleware;

