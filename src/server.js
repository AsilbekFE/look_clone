const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const foodRoutes = require('./routes/food.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/img', express.static(path.join(__dirname, '../img')));
app.use(express.static(path.join(__dirname, '../')));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/foods', foodRoutes);
app.use('/orders', orderRoutes);

app.get('/api', (req, res) => {
    res.json({
        message: "Look Order API muvaffaqiyatli ishlamoqda!",
        endpoints: {
            auth: ["POST /auth/register", "POST /auth/login", "GET /auth/profile (JWT)"],
            users: ["GET /users", "POST /users", "GET /users/:id", "DELETE /users/:id"],
            foods: ["GET /foods", "POST /foods", "DELETE /foods/:id"],
            orders: ["GET /orders/:userId", "POST /orders", "GET /orders"]
        }
    });
});

app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: `Bunday yo'nalish topilmadi: ${req.method} ${req.originalUrl}`
    });
});

app.use((err, req, res, next) => {
    console.error('Server xatoligi:', err.stack);
    res.status(500).json({
        status: 500,
        message: 'Ichki server xatoligi yuz berdi!',
        error: err.message
    });
});

app.listen(PORT, async () => {
    console.log(`Server: http://localhost:${PORT}`);

    try {
        await db.query('SELECT NOW()');
        console.log(`PostgreSQL bazasiga muvaffaqiyatli ulandi!`);
    } catch (err) {
        console.warn(`PostgreSQL ulanishida xatolik: ${err.message}`);
    }
});
