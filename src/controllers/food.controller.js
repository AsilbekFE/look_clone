const db = require('../config/db');

const getFoods = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id AS "foodId", name AS "food_name", img AS "food_img" FROM foods ORDER BY id ASC'
        );

        return res.status(200).json({
            status: 200,
            message: 'Taomlar ro\'yxati olindi',
            data: result.rows
        });
    } catch (error) {
        console.error('getFoods xatosi:', error);
        return res.status(500).json({
            message: 'Serverda xatolik yuz berdi!',
            error: error.message
        });
    }
};

const createFood = async (req, res) => {
    try {
        const { food_name, food_img } = req.body;

        if (!food_name || !food_img) {
            return res.status(400).json({
                message: 'food_name va food_img kiritilishi shart!'
            });
        }

        const result = await db.query(
            'INSERT INTO foods (name, img) VALUES ($1, $2) RETURNING id AS "foodId", name AS "food_name", img AS "food_img"',
            [food_name, food_img]
        );

        return res.status(201).json({
            status: 201,
            message: 'Taom muvaffaqiyatli qo\'shildi!',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('createFood xatosi:', error);
        return res.status(500).json({
            message: 'Serverda xatolik yuz berdi!',
            error: error.message
        });
    }
};

const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'DELETE FROM foods WHERE id = $1 RETURNING id AS "foodId"',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Taom topilmadi!' });
        }

        return res.status(200).json({
            message: 'Taom o\'chirildi',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('deleteFood xatosi:', error);
        return res.status(500).json({
            message: 'Serverda xatolik yuz berdi!',
            error: error.message
        });
    }
};

module.exports = {
    getFoods,
    createFood,
    deleteFood
};
