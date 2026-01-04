---
title: Kubernetes Deployment Guide
sidebar_position: 3
---

# Kubernetes Deployment on DigitalOcean

This guide covers deploying HyperStudy to a production Kubernetes cluster on DigitalOcean, including automated CI/CD with GitHub Actions, horizontal scaling, and comprehensive monitoring.

## Architecture Overview

The Kubernetes deployment provides:
- **Horizontal scaling** with multiple backend pods behind a load balancer
- **StatefulSets** for ordered, stable backend instances
- **Redis** for session affinity and state synchronization
- **Traefik** ingress controller for routing and SSL
- **Prometheus & Grafana** for monitoring and observability
- **GitHub Actions** for automated CI/CD

### Components

- **Backend StatefulSet**: 3-12 pods with autoscaling based on CPU/memory
- **Frontend Deployment**: 2-10 replicas serving the Svelte application
- **Redis StatefulSet**: Session store and pub/sub for Socket.IO
- **Traefik**: Ingress controller with automatic SSL via Let's Encrypt
- **Pod Router**: Custom service for participant-to-pod routing
- **Monitoring Stack**: Prometheus, Grafana, node-exporter, kube-state-metrics

## Prerequisites

- DigitalOcean account with Kubernetes cluster
- `doctl` CLI configured
- `kubectl` configured to access your cluster
- GitHub repository with Actions enabled
- Docker Hub or DigitalOcean Container Registry

## GitHub Actions Deployment

### Automated Workflows

The repository includes three main deployment workflows:

#### 1. Deploy Application (`deploy-application.yml`)
Triggers on push to main branch or manual dispatch.

```yaml
# Deploys:
- Backend StatefulSet with latest image
- Frontend Deployment with latest build
- Pod Router service
- Metrics service
- Configures autoscaling policies
```

#### 2. Deploy Infrastructure (`deploy-infrastructure.yml`)
Sets up core Kubernetes resources.

```yaml
# Deploys:
- Namespaces (hyperstudy, monitoring)
- Redis StatefulSet
- Traefik ingress controller
- Services and ConfigMaps
- RBAC policies
```

#### 3. Deploy Monitoring (`deploy-monitoring.yml`)
Deploys the complete monitoring stack.

```yaml
# Deploys:
- Prometheus with persistent storage
- Grafana with dashboards
- Node exporter DaemonSet
- Kube-state-metrics
- Alert rules and dashboards
```

### Setting Up GitHub Actions

#### 1. Configure Repository Secrets

In your GitHub repository settings, add these secrets:

```bash
# DigitalOcean Access
DIGITALOCEAN_ACCESS_TOKEN    # Your DO API token
DIGITALOCEAN_CLUSTER_ID      # Your K8s cluster ID

# Container Registry
REGISTRY_USERNAME            # Docker Hub or DO registry username
REGISTRY_PASSWORD            # Registry password/token

# Application Secrets
LIVEKIT_API_KEY
LIVEKIT_API_SECRET
LIVEKIT_URL
FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET
FIREBASE_SERVICE_ACCOUNT_KEY  # Base64 encoded JSON

# Monitoring
GRAFANA_ADMIN_PASSWORD       # Grafana admin password
```

#### 2. Trigger Deployments

**Automatic deployment** on push to main:
```bash
git push origin main
```

**Manual deployment** via GitHub UI:
1. Go to Actions tab
2. Select workflow (e.g., "Deploy Application")
3. Click "Run workflow"
4. Select branch and fill in parameters

**Manual deployment** via GitHub CLI:
```bash
# Deploy application
gh workflow run deploy-application.yml

# Deploy with specific image tag
gh workflow run deploy-application.yml -f image_tag=v1.2.3

# Deploy infrastructure
gh workflow run deploy-infrastructure.yml

# Deploy monitoring
gh workflow run deploy-monitoring.yml
```

### Workflow Configuration

Each workflow can be customized with input parameters:

```yaml
workflow_dispatch:
  inputs:
    image_tag:
      description: 'Docker image tag'
      default: 'latest'
    replicas:
      description: 'Number of replicas'
      default: '3'
    environment:
      description: 'Target environment'
      default: 'production'
```

## Manual Deployment

### 1. Initial Cluster Setup

```bash
# Connect to cluster
doctl kubernetes cluster kubeconfig save <cluster-name>

# Create namespaces
kubectl create namespace hyperstudy
kubectl create namespace monitoring

# Apply base configurations
kubectl apply -k k8s/base/
```

### 2. Deploy Redis

```bash
kubectl apply -f k8s/base/01-redis-statefulset.yaml
kubectl apply -f k8s/base/02-redis-service.yaml
```

### 3. Configure Secrets

```bash
# Create secrets from .env file
kubectl create secret generic hyperstudy-secrets \
  --from-literal=LIVEKIT_API_KEY=$LIVEKIT_API_KEY \
  --from-literal=LIVEKIT_API_SECRET=$LIVEKIT_API_SECRET \
  --from-literal=LIVEKIT_URL=$LIVEKIT_URL \
  --from-literal=FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID \
  --from-literal=FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET \
  --from-literal=FIREBASE_SERVICE_ACCOUNT_KEY=$FIREBASE_SERVICE_ACCOUNT_KEY \
  -n hyperstudy
```

### 4. Deploy Application

```bash
# Deploy backend StatefulSet
kubectl apply -f k8s/base/10-backend-statefulset.yaml

# Deploy frontend
kubectl apply -f k8s/base/30-frontend-deployment.yaml

# Deploy supporting services
kubectl apply -f k8s/base/40-pod-router.yaml
kubectl apply -f k8s/base/50-metrics-service.yaml
```

### 5. Configure Ingress

```bash
# Deploy Traefik
kubectl apply -f k8s/base/traefik-deployment.yaml
kubectl apply -f k8s/base/traefik-rbac.yaml

# Apply ingress rules
kubectl apply -f k8s/base/60-ingress.yaml
```

### 6. Enable Autoscaling

```bash
# Apply HPA configurations
kubectl apply -f k8s/base/70-hpa.yaml
```

## Horizontal Scaling Configuration

### Backend Scaling

The backend uses a StatefulSet with horizontal pod autoscaling:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: StatefulSet
    name: backend
  minReplicas: 3
  maxReplicas: 12
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 60
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 70
```

### Pod Distribution Strategy

Backend pods use pod anti-affinity to spread across nodes:

```yaml
affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
    - weight: 100
      podAffinityTerm:
        labelSelector:
          matchLabels:
            app: backend
        topologyKey: kubernetes.io/hostname
```

### Session Affinity

Participants are routed to specific pods using:
1. **Initial assignment** via pod-router service
2. **Redis-based session tracking**
3. **Consistent pod URLs** for reconnection

## Monitoring Access

### Prometheus

Access Prometheus UI:

```bash
# Port forward to local machine
kubectl port-forward -n monitoring svc/prometheus 9090:9090

# Access at http://localhost:9090
```

### Grafana

Access Grafana dashboards:

```bash
# Port forward to local machine
kubectl port-forward -n monitoring svc/grafana 3000:3000

# Access at http://localhost:3000
# Default login: admin / <GRAFANA_ADMIN_PASSWORD>
```

Available dashboards:
- **Cluster Overview**: Node metrics, resource usage
- **Application Metrics**: Request rates, latencies, errors
- **Socket.IO Metrics**: Connections, rooms, events
- **Pod Performance**: Individual pod metrics
- **Redis Metrics**: Cache hits, memory usage

### Production Access

For production, Grafana is accessible via ingress:
```
https://grafana.hyperstudy.app
```

## Updating Deployments

### Using GitHub Actions

1. **Push to main** for automatic deployment
2. **Create a release** for tagged deployments
3. **Manual trigger** for specific versions

### Manual Updates

```bash
# Update backend image
kubectl set image statefulset/backend backend=registry.digitalocean.com/hyperstudy/backend:v1.2.3 -n hyperstudy

# Rolling restart
kubectl rollout restart statefulset/backend -n hyperstudy

# Check rollout status
kubectl rollout status statefulset/backend -n hyperstudy
```

## Troubleshooting

### Check Pod Status

```bash
# List all pods
kubectl get pods -n hyperstudy

# Describe problematic pod
kubectl describe pod backend-0 -n hyperstudy

# Check pod logs
kubectl logs backend-0 -n hyperstudy
kubectl logs backend-0 -n hyperstudy --previous  # Previous container logs
```

### Socket.IO Connection Issues

```bash
# Check Redis connectivity
kubectl exec -it backend-0 -n hyperstudy -- redis-cli -h redis-service ping

# Check pod routing
kubectl logs deployment/pod-router -n hyperstudy

# Verify session affinity
kubectl get svc backend-0 -n hyperstudy -o yaml | grep sessionAffinity
```

### Scaling Issues

```bash
# Check HPA status
kubectl get hpa -n hyperstudy

# View HPA details
kubectl describe hpa backend-hpa -n hyperstudy

# Check metrics server
kubectl top pods -n hyperstudy
kubectl top nodes
```

### Ingress Problems

```bash
# Check Traefik logs
kubectl logs deployment/traefik -n hyperstudy

# Verify ingress configuration
kubectl get ingress -n hyperstudy
kubectl describe ingress hyperstudy-ingress -n hyperstudy

# Check certificate status
kubectl get certificates -n hyperstudy
```

## Resource Management

### Setting Resource Limits

Backend pods have defined resource requests and limits:

```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

### Monitoring Resource Usage

```bash
# Current usage
kubectl top pods -n hyperstudy

# Historical data in Grafana
# Dashboard: "Pod Performance"
```

### Adjusting Resources

```bash
# Edit StatefulSet directly
kubectl edit statefulset backend -n hyperstudy

# Or apply updated manifest
kubectl apply -f k8s/base/10-backend-statefulset.yaml
```

## Backup and Recovery

### Database Backup

Since HyperStudy uses Firebase, backups are managed through Firebase Console. For Redis:

```bash
# Create Redis backup
kubectl exec -it redis-0 -n hyperstudy -- redis-cli BGSAVE

# Copy backup file
kubectl cp hyperstudy/redis-0:/data/dump.rdb ./redis-backup.rdb
```

### Configuration Backup

```bash
# Export all configurations
kubectl get all,cm,secret,ingress -n hyperstudy -o yaml > hyperstudy-backup.yaml

# Backup secrets separately (encrypted)
kubectl get secrets -n hyperstudy -o yaml | kubeseal > sealed-secrets.yaml
```

## Security Best Practices

### Network Policies

Implement network segmentation:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-netpol
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: traefik
    - podSelector:
        matchLabels:
          app: pod-router
```

### Secret Management

- Use Kubernetes Secrets for sensitive data
- Consider using Sealed Secrets or External Secrets Operator
- Rotate credentials regularly
- Never commit secrets to Git

### RBAC Configuration

Limit permissions with role-based access control:

```bash
# Create service account
kubectl create serviceaccount github-actions -n hyperstudy

# Bind role
kubectl create rolebinding github-actions \
  --clusterrole=edit \
  --serviceaccount=hyperstudy:github-actions \
  -n hyperstudy
```

## Performance Optimization

### Connection Pooling

Configure Redis connection pooling in backend:

```javascript
{
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  maxConnections: 50,
  minConnections: 10
}
```

### CDN Integration

Serve static assets through CDN:

1. Configure CloudFlare or similar CDN
2. Point CDN to frontend service
3. Update CORS settings for CDN domain

### Database Indexing

Ensure Firebase Firestore indexes are optimized for your query patterns.

## Development Environment

For local development that mirrors production:

```bash
# Use Minikube or Kind
minikube start --cpus=4 --memory=8192

# Apply development overlay
kubectl apply -k k8s/overlays/development/

# Port forward services
kubectl port-forward svc/backend-service 3000:3000 -n hyperstudy-dev
kubectl port-forward svc/frontend-service 5173:80 -n hyperstudy-dev
```

## Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [DigitalOcean Kubernetes Guide](https://docs.digitalocean.com/products/kubernetes/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Prometheus Operator](https://prometheus-operator.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)