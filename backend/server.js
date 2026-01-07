const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const YahooFinance = require('yahoo-finance2').default;

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Market Data Routes
app.get('/api/market/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const quote = await yahooFinance.quote(symbol);
    
    res.json({
      symbol: quote.symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      previousClose: quote.regularMarketPreviousClose,
      marketCap: quote.marketCap,
      volume: quote.regularMarketVolume
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ error: 'Failed to fetch stock quote' });
  }
});

app.get('/api/market/history/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1mo' } = req.query;
    
    const history = await yahooFinance.historical(symbol, {
      period1: getDateFromPeriod(period),
      period2: new Date(),
      interval: '1d'
    });
    
    const chartData = history.map(item => ({
      date: item.date.toISOString().split('T')[0],
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume
    }));
    
    res.json(chartData);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch stock history' });
  }
});

// User Routes
app.get('/api/user/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        portfolios: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Calculate total portfolio value
    let totalPortfolioValue = 0;
    const portfolioWithCurrentPrices = [];
    
    for (const portfolio of user.portfolios) {
      try {
        const quote = await yahooFinance.quote(portfolio.symbol);
        const currentPrice = quote.regularMarketPrice;
        const currentValue = portfolio.quantity * currentPrice;
        const totalInvested = portfolio.quantity * portfolio.averageBuyPrice;
        const profitLoss = currentValue - totalInvested;
        const profitLossPercent = (profitLoss / totalInvested) * 100;
        
        portfolioWithCurrentPrices.push({
          ...portfolio,
          currentPrice,
          currentValue,
          profitLoss,
          profitLossPercent
        });
        
        totalPortfolioValue += currentValue;
      } catch (error) {
        console.error(`Error fetching price for ${portfolio.symbol}:`, error);
        portfolioWithCurrentPrices.push({
          ...portfolio,
          currentPrice: 0,
          currentValue: 0,
          profitLoss: 0,
          profitLossPercent: 0
        });
      }
    }
    
    res.json({
      ...user,
      portfolios: portfolioWithCurrentPrices,
      totalPortfolioValue,
      totalNetWorth: user.balance + totalPortfolioValue
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Trading Routes
app.post('/api/trade/buy', async (req, res) => {
  try {
    const { userId, symbol, quantity } = req.body;
    
    // Get current stock price
    const quote = await yahooFinance.quote(symbol);
    const currentPrice = quote.regularMarketPrice;
    const totalCost = quantity * currentPrice;
    
    // Check user balance
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
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
});

app.post('/api/trade/sell', async (req, res) => {
  try {
    const { userId, symbol, quantity } = req.body;
    
    // Get current stock price
    const quote = await yahooFinance.quote(symbol);
    const currentPrice = quote.regularMarketPrice;
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
});

// Create a default user for testing
app.post('/api/user/create', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    const user = await prisma.user.create({
      data: {
        email,
        name
      }
    });
    
    res.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Helper function to convert period to date
function getDateFromPeriod(period) {
  const now = new Date();
  switch (period) {
    case '1d':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '5d':
      return new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    case '1mo':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '3mo':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case '6mo':
      return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    case '1y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});