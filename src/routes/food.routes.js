const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food.controller');

router.get('/', foodController.getFoods);
router.post('/', foodController.createFood);
router.delete('/:id', foodController.deleteFood);

module.exports = router;

