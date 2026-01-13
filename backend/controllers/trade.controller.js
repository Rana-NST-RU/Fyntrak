const { PrismaClient } = require('@prisma/client');
const { getStockQuote, getStockCandles } = require('../utils/yahooFinanceService');

const prisma = new PrismaClient();

const fs = require('fs');
const path = require('path');

const logDebug = (msg) => {
    const logPath = path.join(__dirname, '../debug_error.log');
    fs.appendFileSync(logPath, new Date().toISOString() + ': ' + msg + '\n');
};

const buyStock = async (req, res) => {
    try {
        const { symbol, quantity } = req.body;
        const userId = req.user.id;

        // Get current stock price from Yahoo Finance (NO FALLBACK)
        const quote = await getStockQuote(symbol);
        const currentPrice = quote.price;
        const totalCost = quantity * currentPrice;

        // Check user balance
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (user.balance < totalCost) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // Execute trade in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update user balance
            await tx.user.update({
                where: { id: userId },
                data: { balance: user.balance - totalCost }
            });

            // Update or create portfolio entry
            const existingPortfolio = await tx.portfolio.findUnique({
                where: {
                    userId_symbol: {
                        userId,
                        symbol
                    }
                }
            });

            if (existingPortfolio) {
                const newQuantity = existingPortfolio.quantity + quantity;
                const newAveragePrice = ((existingPortfolio.quantity * existingPortfolio.averageBuyPrice) + totalCost) / newQuantity;

                await tx.portfolio.update({
                    where: {
                        userId_symbol: {
                            userId,
                            symbol
                        }
                    },
                    data: {
                        quantity: newQuantity,
                        averageBuyPrice: newAveragePrice
                    }
                });
            } else {
                await tx.portfolio.create({
                    data: {
                        userId,
                        symbol,
                        quantity,
                        averageBuyPrice: currentPrice
                    }
                });
            }

            // Log transaction
            await tx.transaction.create({
                data: {
                    userId,
                    symbol,
                    type: 'BUY',
                    quantity,
                    priceAtTransaction: currentPrice
                }
            });

            return { success: true, totalCost, currentPrice };
        });

        res.json(result);
    } catch (error) {
        console.error('Error executing buy order:', error);
        res.status(500).json({ error: 'Failed to execute buy order' });
    }
};

const sellStock = async (req, res) => {
    try {
        const { symbol, quantity } = req.body;
        const userId = req.user.id;

        // Get current stock price from Yahoo Finance (NO FALLBACK)
        const quote = await getStockQuote(symbol);
        const currentPrice = quote.price;
        const totalValue = quantity * currentPrice;

        // Check if user owns enough stock
        const portfolio = await prisma.portfolio.findUnique({
            where: {
                userId_symbol: {
                    userId,
                    symbol
                }
            }
        });

        if (!portfolio || portfolio.quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient stock quantity' });
        }

        // Execute trade in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update user balance
            const user = await tx.user.findUnique({ where: { id: userId } });
            await tx.user.update({
                where: { id: userId },
                data: { balance: user.balance + totalValue }
            });

            // Update portfolio entry
            const newQuantity = portfolio.quantity - quantity;
            if (newQuantity === 0) {
                await tx.portfolio.delete({
                    where: {
                        userId_symbol: {
                            userId,
                            symbol
                        }
                    }
                });
            } else {
                await tx.portfolio.update({
                    where: {
                        userId_symbol: {
                            userId,
                            symbol
                        }
                    },
                    data: {
                        quantity: newQuantity
                    }
                });
            }

            // Log transaction
            await tx.transaction.create({
                data: {
                    userId,
                    symbol,
                    type: 'SELL',
                    quantity,
                    priceAtTransaction: currentPrice
                }
            });

            return { success: true, totalValue, currentPrice };
        });

        res.json(result);
    } catch (error) {
        console.error('Error executing sell order:', error);
        res.status(500).json({ error: 'Failed to execute sell order' });
    }
};

const getTransactions = async (req, res) => {
    try {
        const userId = req.user.id;

        const transactions = await prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

const getPrice = async (req, res) => {
    try {
        const { symbol } = req.params;

        // ONLY Yahoo Finance - no fallback
        const quote = await getStockQuote(symbol);
        res.json(quote);
    } catch (error) {
        logDebug('Error fetching price for ' + req.params.symbol + ': ' + error.message + '\nStack: ' + error.stack);
        console.error('Error fetching price:', error.message);
        res.status(404).json({ error: 'Invalid symbol or data not available' });
    }
};

const getHistory = async (req, res) => {
    try {
        const { symbol } = req.params;
        const { days = 30 } = req.query;

        const candles = await getStockCandles(symbol, parseInt(days));
        res.json(candles);
    } catch (error) {
        logDebug('Error fetching history for ' + req.params.symbol + ': ' + error.message + '\nStack: ' + error.stack);
        console.error('Error fetching history:', error.message);
        res.status(404).json({ error: 'Invalid symbol or no data available' });
    }
};

module.exports = {
    buyStock,
    sellStock,
    getTransactions,
    getPrice,
    getHistory
};
