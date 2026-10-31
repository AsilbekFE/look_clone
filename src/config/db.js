const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    }
    : {
        user: process.env.DB_USER || process.env.PGUSER || 'postgres',
        password: process.env.DB_PASSWORD || process.env.PGPASSWORD || 'root',
        host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
        port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432', 10),
        database: process.env.DB_NAME || process.env.PGDATABASE || 'baza'
    };

const pool = new Pool(poolConfig);

pool.on('connect', () => {
    console.log('PostgreSQL bazasiga muvaffaqiyatli ulandi');
});

pool.on('error', (err) => {
    console.error('PostgreSQL kutilmagan xatolik yuz berdi:', err.message);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};

