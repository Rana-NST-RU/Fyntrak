# 🚀 Deployment Guide

This guide covers deploying Fyntrak to various platforms.

## 📋 Prerequisites

- Node.js 16+ runtime
- MySQL database
- Environment variables configured

## 🌐 Platform-Specific Deployments

### Vercel (Frontend) + Railway (Backend)

#### Backend on Railway
1. **Create Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Create New Project**: Connect your GitHub repository
3. **Add MySQL Database**: Add MySQL service to your project
4. **Set Environment Variables**:
   ```
   DATABASE_URL=mysql://username:password@host:port/database
   PORT=5002
   ```
5. **Deploy**: Railway auto-deploys from your main branch

#### Frontend on Vercel
1. **Create Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Import Project**: Connect your GitHub repository
3. **Configure Build Settings**:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```

### Heroku (Full Stack)

#### Backend Deployment
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create fyntrak-backend

# Add MySQL addon
heroku addons:create jawsdb:kitefin

# Set environment variables
heroku config:set DATABASE_URL=mysql://...

# Deploy
git subtree push --prefix backend heroku main
```

#### Frontend Deployment
```bash
# Create frontend app
heroku create fyntrak-frontend

# Set buildpack
heroku buildpacks:set heroku/nodejs

# Set environment variables
heroku config:set VITE_API_URL=https://fyntrak-backend.herokuapp.com

# Deploy
git subtree push --prefix frontend heroku main
```

### DigitalOcean App Platform

1. **Create App**: Connect GitHub repository
2. **Configure Services**:
   - **Backend**: Node.js service from `/backend`
   - **Frontend**: Static site from `/frontend`
   - **Database**: Managed MySQL database
3. **Set Environment Variables** in the dashboard
4. **Deploy**: Automatic deployment on git push

### AWS (Advanced)

#### Backend on Elastic Beanstalk
1. **Install EB CLI**: `pip install awsebcli`
2. **Initialize**: `eb init` in backend directory
3. **Create Environment**: `eb create production`
4. **Set Environment Variables** in EB console
5. **Deploy**: `eb deploy`

#### Frontend on S3 + CloudFront
1. **Build**: `npm run build` in frontend directory
2. **Create S3 Bucket**: Enable static website hosting
3. **Upload Files**: Upload `dist` folder contents
4. **Create CloudFront Distribution**: Point to S3 bucket
5. **Configure Custom Domain** (optional)

## 🗄️ Database Setup

### Railway MySQL
```sql
-- Railway provides managed MySQL
-- Use the provided DATABASE_URL
```

### Heroku JawsDB
```sql
-- JawsDB provides managed MySQL
-- Connection string provided in DATABASE_URL
```

### DigitalOcean Managed Database
```sql
-- Create managed MySQL cluster
-- Use connection details in DATABASE_URL
```

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL=mysql://user:pass@host:port/db
PORT=5002
NODE_ENV=production
```

### Frontend (Build-time)
```env
VITE_API_URL=https://your-backend-domain.com
```

## 📊 Post-Deployment Setup

### 1. Database Migration
```bash
# Run after deployment
npx prisma db push
```

### 2. Seed Database
```bash
# Create test user
node create-test-user.js
```

### 3. Health Checks
- Test API endpoints: `/api/user/1`
- Test stock quotes: `/api/market/quote/TCS.NS`
- Verify frontend loads and connects to backend

## 🔒 Security Considerations

### Production Environment
- Use strong database passwords
- Enable HTTPS/SSL
- Set up CORS properly
- Use environment variables for secrets
- Enable rate limiting
- Set up monitoring and logging

### Database Security
- Use connection pooling
- Enable SSL connections
- Regular backups
- Access control

## 📈 Performance Optimization

### Backend
- Enable gzip compression
- Use Redis for caching (optional)
- Database indexing
- Connection pooling

### Frontend
- Code splitting
- Image optimization
- CDN for static assets
- Service worker for caching

## 🔍 Monitoring

### Recommended Tools
- **Uptime**: UptimeRobot, Pingdom
- **Performance**: New Relic, DataDog
- **Errors**: Sentry
- **Analytics**: Google Analytics

### Health Check Endpoints
```javascript
// Add to server.js
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

## 🚨 Troubleshooting

### Common Issues
1. **Database Connection**: Check DATABASE_URL format
2. **CORS Errors**: Verify frontend URL in CORS config
3. **Build Failures**: Check Node.js version compatibility
4. **API Timeouts**: Increase timeout limits for stock API calls

### Debug Commands
```bash
# Check logs
heroku logs --tail -a your-app-name

# Railway logs
railway logs

# Vercel logs
vercel logs
```

## 📞 Support

For deployment issues:
1. Check platform-specific documentation
2. Review error logs
3. Test locally first
4. Create GitHub issue with deployment details

---

**Happy Deploying! 🚀**