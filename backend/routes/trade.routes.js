const express = require('express');
const router = express.Router();
const { buyStock, sellStock, getTransactions, getPrice, getHistory } = require('../controllers/trade.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/price/:symbol', getPrice);
router.get('/history/:symbol', getHistory);
router.post('/buy', protect, buyStock);
router.post('/sell', protect, sellStock);
router.get('/history', protect, getTransactions);

module.exports = router;
