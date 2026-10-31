const BASE_URL = 'http://localhost:5000';

const userAddForm = document.querySelector('#userAdd');
const usernameInput = document.querySelector('#usernameInput');
const telephoneInput = document.querySelector('#telephoneInput');
const customersList = document.querySelector('.customers-list');
const foodsSelect = document.querySelector('#foodsSelect');
const foodsForm = document.querySelector('#foodsForm');
const foodsCount = document.querySelector('#foodsCount');
const clientId = document.querySelector('#clientId');
const userHeader = document.querySelector('#userHeader');
const ordersList = document.querySelector('.orders-list');

function renderUsers(users) {
    customersList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.className = 'customer-item';
        li.dataset.id = user.userId;
        li.innerHTML = `
            <span class="customer-name">${user.username}</span>
            <a class="customer-phone" href="tel:${user.telephone}">${user.telephone}</a>
        `;
        customersList.append(li);
    });
}

function renderFoods(foods) {
    foodsSelect.innerHTML = '';
    foods.forEach(food => {
        const option = document.createElement('option');
        option.value = food.foodId;
        option.textContent = food.food_name;
        foodsSelect.append(option);
    });
    foodsSelect.value = localStorage.getItem('foodId') || foodsSelect.value;
}

foodsSelect.onchange = () => localStorage.setItem('foodId', foodsSelect.value);


function renderOrders(orders) {
    ordersList.innerHTML = '';
    orders.forEach(order => {
        const food = order.foods ? order.foods[0] : null;
        const foodName = food ? food.food_name : 'Food';
        const foodImg = food && food.food_img ? (food.food_img.startsWith('http') || food.food_img.startsWith('./') ? food.food_img : `${BASE_URL}${food.food_img.startsWith('/') ? '' : '/'}${food.food_img}`) : './img/cola.jpeg';
        const li = document.createElement('li');
        li.className = 'order-item';
        li.innerHTML = `
            <img src="${foodImg}" alt="${foodName}">
            <div>
                <span class="order-name">${foodName}</span>
                <span class="order-count">${order.count}</span>
            </div>
        `;
        ordersList.append(li);
    });
}

async function getUsers() {
    try {
        const response = await axios.get(`${BASE_URL}/users`);
        if (response.status === 200) {
            renderUsers(response.data.data);
        }
    } catch (error) {
        console.error(error);
    }
}

async function getFoods() {
    try {
        const response = await axios.get(`${BASE_URL}/foods`);
        if (response.status === 200) {
            renderFoods(response.data.data);
        }
    } catch (error) {
        console.error(error);
    }
}

async function getOrders(userId) {
    try {
        const response = await axios.get(`${BASE_URL}/orders/${userId}`);
        if (response.status === 200) {
            renderOrders(response.data.data);
        }
    } catch (error) {
        console.error(error);
    }
}

async function registerUser(username, telephone) {
    try {
        const response = await axios.post(`${BASE_URL}/users`, {
            username: username,
            telephone: telephone
        });

        if (response.status === 201) {
            alert("Mijoz muvaffaqiyatli ro'yxatdan o'tdi!");
            userAddForm.reset();
            getUsers();
        }
    } catch (error) {
        if (error.response && error.response.data) {
            alert(error.response.data.message);
        } else {
            alert("Serverga ulanishda xatolik yuz berdi!");
        }
    }
}

async function createOrder(userId, foodId, count) {
    try {
        const response = await axios.post(`${BASE_URL}/orders`, {
            userId: Number(userId),
            foodId: Number(foodId),
            count: Number(count)
        });

        if (response.status === 201) {
            alert("Buyurtma qabul qilindi!");
            foodsCount.value = '';
            getOrders(userId);
        }
    } catch (error) {
        if (error.response && error.response.data) {
            alert(error.response.data.message);
        } else {
            alert("Serverga ulanishda xatolik yuz berdi!");
        }
    }
}

userAddForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const telephone = telephoneInput.value.trim();

    const uzbPhoneRegex = /^(\+?998)[0-9]{9}$/;
    if (!uzbPhoneRegex.test(telephone)) {
        return alert("Iltimos, to'g'ri O'zbekiston telefon raqamini kiriting! (Masalan: +998901234567)");
    }

    registerUser(username, telephone);
});

foodsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const currentUserId = clientId.textContent.trim();
    if (!currentUserId) {
        return alert("Iltimos avval mijozni tanlang!");
    }

    const foodId = foodsSelect.value;
    const count = Number(foodsCount.value);

    

    createOrder(currentUserId, foodId, count);
});

customersList.addEventListener('click', (e) => {
    const item = e.target.closest('.customer-item');
    if (!item) return;

    const id = item.dataset.id;
    const name = item.querySelector('.customer-name').textContent;

    clientId.textContent = id;
    userHeader.textContent = name;

    window.localStorage.setItem('selectedUserId', id);
    window.localStorage.setItem('selectedUserName', name);

    getOrders(id);
});

const savedUserId = window.localStorage.getItem('selectedUserId');
const savedUserName = window.localStorage.getItem('selectedUserName');

if (savedUserId && savedUserName) {
    clientId.textContent = savedUserId;
    userHeader.textContent = savedUserName;
    getOrders(savedUserId);
}

getUsers();
getFoods();
