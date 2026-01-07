# 📈 Fyntrak - Virtual Trading Platform

A full-stack virtual trading platform for Indian stocks built with React, Node.js, and real-time market data.

![Fyntrak Dashboard](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)

## 🚀 Features

- **Real-time Stock Data**: Live Indian stock prices via Yahoo Finance API
- **Interactive Trading**: Buy/sell stocks with virtual money (₹1,00,000 starting balance)
- **Portfolio Management**: Track holdings with real-time P&L calculations
- **Interactive Charts**: Historical price charts with Recharts
- **Modern UI**: Dark-themed responsive design with Tailwind CSS
- **Complete Trading Flow**: Dashboard, Portfolio, and Trading sections

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Recharts** for interactive charts
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **Prisma ORM** with MySQL
- **Yahoo Finance API** for real-time data
- **CORS** enabled for frontend communication

### Database
- **MySQL** with Prisma schema
- User management and authentication ready
- Portfolio and transaction tracking

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/fyntrak.git
cd fyntrak
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your MySQL credentials

# Setup database
npx prisma generate
npx prisma db push

# Create test user
node create-test-user.js

# Start backend server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start frontend development server
npm run dev
```

## 🌐 Usage

1. **Access the Application**: Open http://localhost:3001
2. **Start Trading**: Login with the test user (₹1,00,000 balance)
3. **Search Stocks**: Try popular Indian stocks:
   - `TCS.NS` - Tata Consultancy Services
   - `INFY.NS` - Infosys
   - `RELIANCE.NS` - Reliance Industries
   - `HDFCBANK.NS` - HDFC Bank
   - `ICICIBANK.NS` - ICICI Bank

## 📊 API Endpoints

### Market Data
- `GET /api/market/quote/:symbol` - Get current stock price
- `GET /api/market/history/:symbol` - Get historical data

### User Management
- `GET /api/user/:id` - Get user data with portfolio
- `POST /api/user/create` - Create new user

### Trading
- `POST /api/trade/buy` - Execute buy order
- `POST /api/trade/sell` - Execute sell order

## 🗄 Database Schema

```sql
-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  balance DECIMAL(15,2) DEFAULT 100000.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio table
CREATE TABLE portfolios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  symbol VARCHAR(20),
  quantity INT,
  average_buy_price DECIMAL(10,2),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Transactions table
CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  symbol VARCHAR(20),
  type ENUM('BUY', 'SELL'),
  quantity INT,
  price_at_transaction DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🎯 Project Structure

```
fyntrak/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
PORT=5002
```

### Supported Stock Symbols
Use NSE symbols with `.NS` suffix:
- TCS.NS, INFY.NS, RELIANCE.NS, HDFCBANK.NS, ICICIBANK.NS
- WIPRO.NS, LT.NS, BHARTIARTL.NS, ITC.NS, HINDUNILVR.NS

## 🚀 Deployment

### Backend Deployment
1. Set up MySQL database on your hosting provider
2. Configure environment variables
3. Run `npx prisma db push` to create tables
4. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to Vercel, Netlify, or any static hosting service
3. Update API base URL in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Yahoo Finance for providing stock market data
- Prisma for excellent database tooling
- Tailwind CSS for beautiful styling
- Recharts for interactive charts

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/fyntrak/issues) page
2. Create a new issue with detailed description
3. Join our community discussions

---

**Happy Trading! 📈**

*Disclaimer: This is a virtual trading platform for educational purposes only. No real money is involved.*