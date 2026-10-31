const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'maxfiy_jwt_kalit_look_app_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const register = async (req, res) => {
    try {
        const { username, telephone, password } = req.body;

        if (!username || !telephone || !password) {
            return res.status(400).json({
                message: 'Barcha maydonlarni to\'ldiring (username, telephone, password)!'
            });
        }

        const existing = await db.query(
            'SELECT id FROM look_users WHERE phone = $1',
            [telephone]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                message: 'Bu telefon raqami allaqachon ro\'yxatdan o\'tgan!'
            });
        }

        const hashedPassword = await argon2.hash(password);

        const result = await db.query(
            'INSERT INTO look_users (name, phone, password) VALUES ($1, $2, $3) RETURNING id AS "userId", name AS "username", phone AS "telephone"',
            [username, telephone, hashedPassword]
        );

        const newUser = result.rows[0];

        const token = jwt.sign(
            { userId: newUser.userId, username: newUser.username },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return res.status(201).json({
            message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!",
            token,
            data: newUser
        });
    } catch (error) {
        console.error('Register xatosi:', error);
        return res.status(500).json({
            message: 'Serverda xatolik yuz berdi!',
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { login, telephone, username, password } = req.body;
        const identifier = telephone || username || login;

        if (!identifier || !password) {
            return res.status(400).json({
                message: 'Login (yoki telefon) va parolni kiriting!'
            });
        }

        const result = await db.query(
            'SELECT id AS "userId", name AS "username", phone AS "telephone", password FROM look_users WHERE phone = $1 OR name = $1',
            [identifier]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Foydalanuvchi topilmadi!'
            });
        }

        const user = result.rows[0];

        if (!user.password) {
            return res.status(400).json({
                message: 'Ushbu foydalanuvchiga parol o\'rnatilmagan! Avval ro\'yxatdan o\'ting.'
            });
        }

        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Parol noto\'g\'ri!'
            });
        }

        const token = jwt.sign(
            { userId: user.userId, username: user.username },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return res.status(200).json({
            message: 'Tizimga muvaffaqiyatli kirdingiz!',
            token,
            data: {
                userId: user.userId,
                username: user.username,
                telephone: user.telephone
            }
        });
    } catch (error) {
        console.error('Login xatosi:', error);
        return res.status(500).json({
            message: 'Serverda xatolik yuz berdi!',
            error: error.message
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id AS "userId", name AS "username", phone AS "telephone" FROM look_users WHERE id = $1',
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi!' });
        }

        return res.status(200).json({
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Profile xatosi:', error);
        return res.status(500).json({
            message: 'Serverda xatolik yuz berdi!',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getProfile
};
