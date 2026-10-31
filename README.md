# Look Order - Backend & Frontend

Express.js, PostgreSQL (`pg`), Argon2 (parollarni xeshlash) va JWT (JSON Web Token) asosida yaratilgan to'liq backend tizimi.

---

## 🚀 O'rnatilgan paketlar
- **express**: REST API server yaratish uchun
- **pg**: PostgreSQL bilan ulanish uchun pool va query vositasi
- **argon2**: Parollarni xavfsiz xeshlash va tekshirish uchun
- **jsonwebtoken (jwt)**: Foydalanuvchi autentifikatsiyasi va token generatsiya qilish uchun
- **dotenv**: Maxfiy kalitlar va muhit o'zgaruvchilari (.env) uchun
- **cors**: Frontend va Backend o'rtasidagi so'rovlarni ruxsat berish uchun
- **nodemon**: Dasturchi muhiti uchun avto-restart

---

## 🗄️ 1. PostgreSQL bazasini ulash (O'zingiz uchun)

### 1-qadam: Baza va jadvallarni yaratish
PostgreSQL (psql terminali yoki pgAdmin / DBeaver) orqali `look_db` nomli baza yarating:
```sql
CREATE DATABASE look_db;
```

So'ngra `database/database.sql` fayli ichidagi barcha SQL buyruqlarni ishga tushiring (yoki nusxalab bazada bajaring):
- `users` jadvali
- `foods` jadvali (Cola, Fanta, Burger va boshqalar)
- `orders` jadvali

### 2-qadam: `.env` faylini sozlash
`.env` faylini oching va PostgreSQL parolingizni yozing:
```env
PORT=5000

DB_USER=postgres
DB_PASSWORD=sizning_parolingiz
DB_HOST=localhost
DB_PORT=5432
DB_NAME=look_db

JWT_SECRET=maxfiy_jwt_kalit_look_app_2026
JWT_EXPIRES_IN=7d
```

---

## 🏃 2. Serverni ishga tushirish

Dasturni ishlab chiqish (dev) rejimida ishga tushirish:
```bash
npm run dev
```

Oddiy ishga tushirish:
```bash
npm start
```

Server ishga tushgach:
- Backend: `http://localhost:5000`
- API yo'riqnomasi: `http://localhost:5000/api`
- Frontend: `index.html` faylini brauzerda ochishingiz yoki `http://localhost:5000` orqali ko'rishingiz mumkin.

---

## 📡 API Endpoints (Yo'nalishlar)

### 🔐 Autentifikatsiya (Argon2 + JWT)
- **POST** `/auth/register` — Yangi foydalanuvchini ro'yxatdan o'tkazish (parol Argon2 orqali xeshlanadi va JWT token qaytadi)
  - Body: `{ "username": "Ali", "telephone": "+998901234567", "password": "mypassword" }`
- **POST** `/auth/login` — Tizimga kirish (Argon2 tekshiruvi va JWT token)
  - Body: `{ "telephone": "+998901234567", "password": "mypassword" }`
- **GET** `/auth/profile` — Profil ma'lumotlari (Headers: `Authorization: Bearer <token>`)

### 👥 Mijozlar (Users)
- **GET** `/users` — Barcha mijozlarni olish
- **POST** `/users` — Yangi mijoz qo'shish (Frontend `index.html` bilan mos)
  - Body: `{ "username": "Vali", "telephone": "+998991234567" }`
- **GET** `/users/:id` — Bitta mijozni olish
- **DELETE** `/users/:id` — Mijozni o'chirish

### 🍔 Taomlar (Foods)
- **GET** `/foods` — Taomlar ro'yxatini olish (Frontend select uchun)
- **POST** `/foods` — Yangi taom qo'shish
  - Body: `{ "food_name": "Lavash", "food_img": "./img/combo.jpeg" }`

### 🛒 Buyurtmalar (Orders)
- **GET** `/orders/:userId` — Tanlangan mijozning barcha buyurtmalarini olish
- **POST** `/orders` — Yangi buyurtma berish
  - Body: `{ "userId": 1, "foodId": 2, "count": 3 }`
- **GET** `/orders` — Barcha buyurtmalar ro'yxati

