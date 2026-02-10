# Deployment Checklist

## Pre-Deployment

### Backend Preparation
- [ ] Review `.env` file settings
- [ ] Update JWT_SECRET to strong value
- [ ] Set NODE_ENV=production
- [ ] Test all API endpoints locally
- [ ] Run `npm run build` (if applicable)
- [ ] Check error logs
- [ ] Verify database connection

### Frontend Preparation
- [ ] Update API_BASE URL to production backend
- [ ] Run `npm run build` to generate optimized build
- [ ] Test all pages and features
- [ ] Check browser console for errors
- [ ] Verify responsive design on devices
- [ ] Test authentication flow
- [ ] Clear cache and test again

### Database Preparation
- [ ] Backup existing data (if migrating)
- [ ] Create production database
- [ ] Run database initialization
- [ ] Test all queries
- [ ] Set up database user with limited privileges
- [ ] Enable automated backups

### Security Review
- [ ] Change all default passwords
- [ ] Update JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Review API authentication
- [ ] Set up rate limiting (optional)
- [ ] Enable database encryption (optional)

## Deployment Steps

### Step 1: Backend Deployment

#### On Cloud Server (AWS, Heroku, DigitalOcean, etc.)
```bash
# Clone repository
git clone <repo-url>
cd internship_management/backend

# Install dependencies
npm install --production

# Set environment variables
export DB_HOST=<production_db_host>
export DB_USER=<production_db_user>
export DB_PASSWORD=<production_db_password>
export DB_NAME=internship_management
export JWT_SECRET=<strong_secret_key>
export PORT=5000
export NODE_ENV=production

# Start server
npm start
```

#### Using PM2 (Process Manager)
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name "internship-api"

# Enable auto-restart on reboot
pm2 startup
pm2 save

# Monitor
pm2 monit
```

### Step 2: Frontend Deployment

#### Build Application
```bash
cd frontend
npm run build
```

#### Deploy to Web Server
- **Option 1: Netlify**
  - Connect GitHub repository
  - Set build command: `npm run build`
  - Set publish directory: `build`
  
- **Option 2: Vercel**
  - Import project
  - Configure settings
  - Deploy
  
- **Option 3: AWS S3 + CloudFront**
  - Upload `build` folder to S3
  - Create CloudFront distribution
  - Update DNS records
  
- **Option 4: Traditional Hosting**
  - Upload `build` folder contents
  - Configure web server (Apache/Nginx)
  - Enable gzip compression
  - Set cache headers

### Step 3: Database Migration

```sql
-- Create production database
CREATE DATABASE internship_management;

-- Create user with limited privileges
CREATE USER 'app_user'@'%' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON internship_management.* TO 'app_user'@'%';
FLUSH PRIVILEGES;
```

### Step 4: Domain & DNS Configuration
- [ ] Purchase domain name
- [ ] Configure DNS records
- [ ] Point to hosting provider
- [ ] Enable SSL certificate
- [ ] Wait for DNS propagation

### Step 5: Testing Post-Deployment

#### Functionality Tests
- [ ] User registration works
- [ ] User login successful
- [ ] Can browse internships
- [ ] Can apply to internship
- [ ] Can submit reports
- [ ] Can view dashboard
- [ ] All role permissions work
- [ ] Logout works properly

#### Performance Tests
- [ ] Page load times acceptable
- [ ] API responses fast
- [ ] Database queries optimized
- [ ] No memory leaks
- [ ] Handles concurrent users

#### Security Tests
- [ ] HTTPS enforced
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens (if applicable)
- [ ] Authentication works
- [ ] Authorization enforced

#### Browser Compatibility
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

## Post-Deployment

### Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure logging
- [ ] Set up uptime monitoring
- [ ] Monitor database performance
- [ ] Track API response times
- [ ] Monitor server resources

### Maintenance
- [ ] Set up automated backups
- [ ] Schedule database maintenance
- [ ] Plan updates
- [ ] Monitor security patches
- [ ] Review logs regularly
- [ ] Update dependencies periodically

### Documentation
- [ ] Update README with production URLs
- [ ] Document deployment process
- [ ] Create runbooks for common issues
- [ ] Document backup procedures
- [ ] Create incident response plan

## Environment Variables Template

### Production .env
```env
# Database
DB_HOST=prod-db.example.com
DB_USER=app_user
DB_PASSWORD=strong_password_here
DB_NAME=internship_management

# Security
JWT_SECRET=production_secret_key_must_be_strong_and_unique

# Server
PORT=5000
NODE_ENV=production

# CORS (if needed)
CORS_ORIGIN=https://yourdomain.com
```

## Common Deployment Issues & Solutions

### Issue: Database Connection Failed
**Solution:**
- Verify database is running
- Check credentials
- Verify network access
- Check firewall rules

### Issue: CORS Errors
**Solution:**
- Update backend URL in frontend
- Configure CORS origin properly
- Check request headers

### Issue: 502 Bad Gateway
**Solution:**
- Check backend is running
- Verify port is open
- Check process manager logs
- Restart application

### Issue: Slow Performance
**Solution:**
- Enable caching
- Optimize queries
- Enable gzip compression
- Use CDN for static files
- Check database indexes

### Issue: 404 Errors on Page Refresh
**Solution:**
- Configure web server for SPA routing
- Add fallback to index.html
- Check public path configuration

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

### Configure Nginx
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Performance Optimization

### Backend
- Enable connection pooling (already done)
- Add caching layer (Redis)
- Implement pagination
- Add database indexes
- Use compression middleware

### Frontend
- Minify code (done in build)
- Lazy load routes
- Compress images
- Enable caching headers
- Use CDN for static assets

## Scaling Considerations

### Horizontal Scaling
- Load balancer (Nginx, HAProxy)
- Multiple backend instances
- Database replication
- Cache layer (Redis)

### Vertical Scaling
- Increase server resources
- Optimize queries
- Cache frequently accessed data
- Enable compression

## Backup Strategy

### Database Backups
```bash
# Daily backup
mysqldump -u root -p internship_management > backup_$(date +%Y%m%d).sql

# Automated with cron
0 2 * * * mysqldump -u root -p internship_management > /backups/internship_$(date +\%Y\%m\%d).sql
```

### File Backups
- Backup source code to GitHub
- Backup configuration files
- Backup static files
- Store backups off-site

## Monitoring Dashboard

Set up monitoring for:
- Server uptime
- Database performance
- API response times
- Error rates
- User activity
- Traffic patterns

## Incident Response Plan

- **Database Down:** Restore from backup, notify users
- **Server Down:** Switch to backup server, check logs
- **API Errors:** Check server logs, restart service
- **Security Breach:** Revoke tokens, change credentials, investigate

## Communication

### Before Deployment
- Notify team
- Set maintenance window if needed
- Prepare rollback plan

### During Deployment
- Monitor progress
- Watch for errors
- Test functionality
- Document any issues

### After Deployment
- Confirm all systems working
- Document changes
- Thank team
- Plan next improvements

## Success Criteria

✅ **Deployment is successful when:**
- [ ] All pages load without errors
- [ ] User authentication works
- [ ] Database operations successful
- [ ] API endpoints respond correctly
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Mobile responsive works
- [ ] All browsers supported
- [ ] Monitoring active
- [ ] Backups configured

## Rollback Plan

If deployment fails:
1. Identify issue
2. Stop services
3. Restore previous version
4. Restore database backup
5. Restart services
6. Test functionality
7. Document issue
8. Plan fix

## Support Contacts

- Backend Admin: [contact]
- Database Admin: [contact]
- Frontend Lead: [contact]
- DevOps: [contact]
- Security: [contact]

---

**Last Updated:** February 10, 2026
**Version:** 1.0
