CREATE TABLE IF NOT EXISTS look_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    phone TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    img TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES look_users(id) ON DELETE CASCADE,
    food_id INT NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
    count INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO foods (name, img) VALUES 
('Cola', './img/cola.jpeg'),
('Fanta', './img/fanta.jpeg'),
('Burger Cheese', './img/burger_cheese.jpeg'),
('Chicken Togora', './img/chicken_togora.jpeg'),
('Chicken Wings', './img/chicken_wings.jpeg'),
('Combo', './img/combo.jpeg');

INSERT INTO look_users (name, phone) VALUES 
('Sobir', '+998941049914'),
('Ali', '+998901234567')
ON CONFLICT (phone) DO NOTHING;
