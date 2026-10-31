const db = require('../config/db');

const getUsers = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id AS "userId", name AS "username", phone AS "telephone" FROM look_users ORDER BY id ASC'
        );

        return res.status(200).json({
            status: 200,
            message: 'Mijozlar ro\'yxati olindi',
            data: result.rows
        });
    } catch (error) {
        console.error('getUsers xatosi:', error);
        return res.status(500).json({
            message: 'Serverda xatolik yuz berdi!',
            error: error.message
        });
    }
};

const createUser = async (req, res) => {
    try {
        const { username, telephone } = req.body;

        if (!username || !telephone) {
            return res.status(400).json({
                message: 'Username va telefon raqam kiritilishi shart!'
            });
        }

        const existing = await db.query(
            'SELECT id FROM look_users WHERE phone = $1',
            [telephone]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                message: 'Ushbu telefon raqamli mijoz allaqachon mavjud!'
            });
        }

        const result = await db.query(
            'INSERT INTO look_users (name, phone) VALUES ($1, $2) RETURNING id AS "userId", name AS "username", phone AS "telephone"',
            [username, telephone]
        );

        return res.status(201).json({
            status: 201,
            message: "Mijoz muvaffaqiyatli ro'yxatdan o'tdi!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error('createUser xatosi:', error);
        return res.status(500).json({
            message: 'Serverda xatolik yuz berdi!',
            error: error.message
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'SELECT id AS "userId", name AS "username", phone AS "telephone" FROM look_users WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Mijoz topilmadi!' });
        }

        return res.status(200).json({
            data: result.rows[0]
        });
    } catch (error) {
        console.error('getUserById xatosi:', error);
        return res.status(500).json({
            message: 'Serverda xatolik yuz berdi!',
            error: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'DELETE FROM look_users WHERE id = $1 RETURNING id AS "userId"',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Mijoz topilmadi!' });
        }

        return res.status(200).json({
            message: 'Mijoz o\'chirildi',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('deleteUser xatosi:', error);
        return res.status(500).json({
            message: 'Serverda xatolik yuz berdi!',
            error: error.message
        });
    }
};

module.exports = {
    getUsers,
    createUser,
    getUserById,
    deleteUser
};
