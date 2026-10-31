const db = require('../config/db');

const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await db.query(
            `SELECT 
                o.id AS "orderId",
                o.count,
                json_build_array(
                    json_build_object(
                        'food_name', f.name,
                        'food_img', f.img
                    )
                ) AS foods
            FROM orders o
            JOIN foods f ON f.id = o.food_id
            WHERE o.user_id = $1
            ORDER BY o.id DESC`,
            [userId]
        );

        return res.status(200).json({
            status: 200,
            message: 'Buyurtmalar olindi',
            data: result.rows
        });
    } catch (error) {
        console.error('getOrdersByUser xatosi:', error);
        return res.status(500).json({
            message: 'Serverda xatolik yuz berdi!',
            error: error.message
        });
    }
};

const createOrder = async (req, res) => {
    try {
        const { userId, foodId, count } = req.body;

        if (!userId || !foodId || !count) {
            return res.status(400).json({
                message: 'userId, foodId va count kiritilishi shart!'
            });
        }

        const result = await db.query(
            `INSERT INTO orders (user_id, food_id, count)
            VALUES ($1, $2, $3)
            RETURNING id AS "orderId", user_id AS "userId", food_id AS "foodId", count`,
            [userId, foodId, count]
        );

        return res.status(201).json({
            status: 201,
            message: 'Buyurtma qabul qilindi!',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('createOrder xatosi:', error);
        return res.status(500).json({
            message: 'Serverda xatolik yuz berdi!',
            error: error.message
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
                o.id AS "orderId",
                o.user_id AS "userId",
                u.name AS "username",
                o.count,
                f.name AS "food_name",
                f.img AS "food_img"
            FROM orders o
            JOIN look_users u ON u.id = o.user_id
            JOIN foods f ON f.id = o.food_id
            ORDER BY o.id DESC`
        );

        return res.status(200).json({
            status: 200,
            data: result.rows
        });
    } catch (error) {
        console.error('getAllOrders xatosi:', error);
        return res.status(500).json({
            message: 'Serverda xatolik yuz berdi!',
            error: error.message
        });
    }
};

module.exports = {
    getOrdersByUser,
    createOrder,
    getAllOrders
};
