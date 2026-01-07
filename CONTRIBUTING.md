# Contributing to Fyntrak

Thank you for your interest in contributing to Fyntrak! This document provides guidelines and information for contributors.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/fyntrak.git
   cd fyntrak
   ```
3. **Install dependencies**:
   ```bash
   npm run install:all
   ```
4. **Set up the database** following the README instructions
5. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Guidelines

### Code Style
- Use **ESLint** and **Prettier** for consistent formatting
- Follow **React best practices** for frontend components
- Use **async/await** for asynchronous operations
- Write **descriptive commit messages**

### Frontend (React)
- Use functional components with hooks
- Keep components small and focused
- Use Tailwind CSS for styling
- Ensure responsive design
- Add proper error handling

### Backend (Node.js)
- Use Express.js best practices
- Implement proper error handling
- Use Prisma for database operations
- Add input validation
- Follow RESTful API conventions

### Database
- Use Prisma migrations for schema changes
- Keep the schema normalized
- Add proper indexes for performance
- Use transactions for complex operations

## 🧪 Testing

- Write unit tests for new features
- Test API endpoints with proper error cases
- Ensure frontend components render correctly
- Test trading functionality thoroughly

## 📋 Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Update the README** if you've added features
5. **Create a pull request** with:
   - Clear title and description
   - Screenshots for UI changes
   - List of changes made
   - Any breaking changes

## 🐛 Bug Reports

When reporting bugs, please include:
- **Steps to reproduce** the issue
- **Expected behavior**
- **Actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Node version, etc.)

## 💡 Feature Requests

For new features:
- **Describe the feature** clearly
- **Explain the use case**
- **Provide mockups** if it's a UI feature
- **Consider the impact** on existing functionality

## 🔧 Development Setup

### Prerequisites
- Node.js 16+
- MySQL database
- Git

### Environment Setup
1. Copy `.env.example` to `.env` in backend directory
2. Configure your database connection
3. Run `npx prisma db push` to create tables
4. Create a test user with `node create-test-user.js`

### Running the Application
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:backend
npm run dev:frontend
```

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Focus on constructive feedback
- Maintain a positive environment

## 📞 Questions?

If you have questions:
- Check existing [Issues](https://github.com/yourusername/fyntrak/issues)
- Create a new issue with the "question" label
- Join our community discussions

Thank you for contributing to Fyntrak! 🚀