---
title: Docker Deployment Guide
sidebar_position: 2
---

# HyperStudy Docker Deployment Guide

> **Note**: For production deployments with horizontal scaling and monitoring, see the [Kubernetes Deployment Guide](./deployment-kubernetes.md).

This guide explains how to deploy the HyperStudy application with Docker Compose, including the Nginx reverse proxy with SSL certificates. This approach is suitable for single-server deployments and development environments.

## Prerequisites

Before deploying HyperStudy, ensure you have:

- A server with Docker and Docker Compose installed
- A domain name pointed to your server (e.g., hyperstudy.io)
- SSL certificates from Let's Encrypt (or another provider)
- Firebase project credentials
- LiveKit server credentials (if using video chat features)

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ljchang/hyperstudy.git
cd hyperstudy
```

### 2. SSL Certificates

First, ensure you have valid SSL certificates. If you don't have them yet, you can use Let's Encrypt:

```bash
sudo apt update
sudo apt install certbot
sudo certbot certonly --standalone -d hyperstudy.io
```

Your certificates will be stored in `/etc/letsencrypt/live/hyperstudy.io/`.

### 3. Environment Variables

Create environment files for both the backend and frontend services:

#### Backend Environment (.env in backend/)

```bash
# Backend environment variables
NODE_ENV=production
PORT=5000

# LiveKit Configuration
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_URL=wss://your-livekit-server.com

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_SERVICE_ACCOUNT_KEY=your_firebase_service_account_key_json

# CORS Configuration
CORS_ORIGIN=https://hyperstudy.io

# Email Service (Amazon SES)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
SES_FROM_EMAIL=noreply@hyperstudy.io
SES_REGION=us-east-1

# Prolific Integration (optional)
PROLIFIC_API_TOKEN=your_prolific_api_token
```

#### Frontend Environment (.env in frontend/)

```bash
# Frontend environment variables
VITE_API_URL=https://hyperstudy.io/api
VITE_SOCKET_URL=https://hyperstudy.io
VITE_LIVEKIT_URL=wss://your-livekit-server.com

# Firebase Configuration (public keys)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Deployment

### 1. Build and Start the Services

```bash
# Use the production Docker Compose file
docker-compose -f docker-compose.production.yml build

# Start the services in detached mode
docker-compose -f docker-compose.production.yml up -d
```

### 2. Verify the Deployment

Check that all services are running:

```bash
docker-compose -f docker-compose.production.yml ps
```

You should see all services (nginx, backend, frontend) running with status "Up".

### 3. Test the Application

Visit your domain (https://hyperstudy.io) in a web browser to verify that everything is working correctly.

## SSL Certificate Management

### Automatic Renewal

Let's Encrypt certificates expire after 90 days. Set up auto-renewal:

```bash
# Add a cron job to renew certificates
sudo crontab -e
```

Add the following line:

```
0 3 * * * certbot renew --quiet && docker-compose -f /path/to/hyperstudy/docker-compose.production.yml restart nginx
```

This will attempt to renew certificates at 3 AM daily (if needed) and restart Nginx to apply any renewals.

### Manual Renewal

To manually renew certificates:

```bash
sudo certbot renew
docker-compose -f docker-compose.production.yml restart nginx
```

## Maintenance and Updates

### Updating the Application

```bash
# Pull the latest changes
git pull origin main

# Stop the current containers
docker-compose -f docker-compose.production.yml down

# Rebuild and restart containers
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up -d
```

### Checking Logs

```bash
# View logs for all services
docker-compose -f docker-compose.production.yml logs

# View logs for a specific service
docker-compose -f docker-compose.production.yml logs nginx
docker-compose -f docker-compose.production.yml logs backend
docker-compose -f docker-compose.production.yml logs frontend

# Follow logs in real-time
docker-compose -f docker-compose.production.yml logs -f

# View logs with timestamps
docker-compose -f docker-compose.production.yml logs -t
```

### Database Backups

Since HyperStudy uses Firebase Firestore, database backups are handled through Firebase Console or using Firebase Admin SDK. However, you should back up:

1. **Local storage data** (if any):
   ```bash
   docker cp hyperstudy_backend:/app/uploads /path/to/backup/
   ```

2. **Environment files**:
   ```bash
   cp backend/.env /path/to/backup/backend.env
   cp frontend/.env /path/to/backup/frontend.env
   ```

3. **SSL certificates**:
   ```bash
   sudo cp -r /etc/letsencrypt /path/to/backup/
   ```

## Monitoring

### Health Checks

The deployment includes health check endpoints:

- Backend health: `https://hyperstudy.io/api/health`
- Frontend status: `https://hyperstudy.io/`

### Resource Monitoring

Monitor Docker container resources:

```bash
# View resource usage
docker stats

# View detailed container information
docker-compose -f docker-compose.production.yml top
```

## Troubleshooting

### Common Issues

#### Nginx Configuration Issues

If you encounter issues with Nginx:

1. Check Nginx logs:
   ```bash
   docker-compose -f docker-compose.production.yml logs nginx
   ```

2. Test Nginx configuration:
   ```bash
   docker-compose -f docker-compose.production.yml exec nginx nginx -t
   ```

3. Reload Nginx configuration:
   ```bash
   docker-compose -f docker-compose.production.yml exec nginx nginx -s reload
   ```

#### Backend Connection Issues

If the backend isn't accessible:

1. Check backend logs:
   ```bash
   docker-compose -f docker-compose.production.yml logs backend
   ```

2. Verify environment variables:
   ```bash
   docker-compose -f docker-compose.production.yml exec backend env | grep -E "(NODE_ENV|PORT|CORS)"
   ```

3. Test backend connectivity:
   ```bash
   curl https://hyperstudy.io/api/health
   ```

#### WebSocket Connection Issues

For Socket.IO or LiveKit connection problems:

1. Check Nginx WebSocket configuration in `nginx/conf.d/hyperstudy.conf`
2. Verify WebSocket upgrade headers are properly set
3. Check browser console for connection errors
4. Ensure firewall allows WebSocket connections

### Container Connectivity

If services can't communicate:

1. Verify all services are on the same network:
   ```bash
   docker network inspect hyperstudy-network
   ```

2. Test internal connectivity:
   ```bash
   docker-compose -f docker-compose.production.yml exec backend ping frontend
   ```

3. Check service names in environment variables match Docker service names

### Email Configuration Issues

If emails are not being sent:

1. Verify Amazon SES credentials:
   ```bash
   docker-compose -f docker-compose.production.yml exec backend env | grep -E "(AWS_|SES_)"
   ```

2. Check SES configuration:
   - Ensure the sender email is verified in SES
   - Check if your AWS account is still in SES sandbox mode
   - Verify the correct AWS region is specified

3. Test email functionality:
   - Use the admin panel to send a test email
   - Check backend logs for SES errors
   - Verify recipient addresses are valid

## Security Considerations

### Firewall Configuration

Ensure your firewall allows:
- Port 80 (HTTP, for Let's Encrypt validation)
- Port 443 (HTTPS)
- Any additional ports for LiveKit if self-hosted

### Environment Variables

- Never commit `.env` files to version control
- Use strong, unique passwords for all services
- Rotate API keys and secrets regularly
- Consider using Docker secrets for sensitive data

### Updates

- Regularly update Docker images
- Keep the host system updated
- Monitor security advisories for dependencies

## Architecture Overview

The deployment consists of three main services:

1. **Nginx**: Reverse proxy handling SSL termination and request routing
2. **Backend**: Node.js/Express API server with Socket.IO
3. **Frontend**: Svelte application served as static files

All services communicate through the Docker network `hyperstudy-network`, with Nginx as the single entry point for external traffic.

## Advanced Configuration

### Scaling

To scale the backend for higher load:

```yaml
# In docker-compose.production.yml
services:
  backend:
    deploy:
      replicas: 3
```

Note: This requires using Docker Swarm or Kubernetes for proper load balancing.

### Custom Domain Configuration

To use a custom domain:

1. Update Nginx configuration in `nginx/conf.d/hyperstudy.conf`
2. Update CORS settings in backend environment
3. Update frontend API URLs
4. Obtain SSL certificates for the new domain

### Performance Tuning

1. **Nginx optimization**:
   - Enable gzip compression
   - Configure caching headers
   - Tune worker processes and connections

2. **Backend optimization**:
   - Implement Redis for session storage
   - Use PM2 for process management
   - Enable Node.js cluster mode

3. **Frontend optimization**:
   - Enable service workers
   - Implement CDN for static assets
   - Use build-time optimization flags

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [GitHub Issues](https://github.com/ljchang/hyperstudy/issues)
2. Review Docker and service logs
3. Consult the architecture documentation
4. Contact the development team

Remember to always test updates in a staging environment before deploying to production.