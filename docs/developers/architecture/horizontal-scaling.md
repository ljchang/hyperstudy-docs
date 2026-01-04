# Horizontal Scaling Architecture

## Overview

HyperStudy implements a comprehensive horizontal scaling architecture for both frontend and backend services in a Kubernetes cluster. This architecture ensures high availability, load balancing, and efficient resource utilization. The backend handles complex stateful operations with WebSocket affinity, while the frontend provides stateless content delivery with automatic scaling based on load.

## Architecture Components

### 1. Kubernetes StatefulSet

The backend runs as a Kubernetes StatefulSet with multiple replicas:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: backend
spec:
  replicas: 3  # Scalable from 1 to N pods
  serviceName: backend
```

**Key Benefits:**
- Stable network identities (backend-0, backend-1, backend-2)
- Ordered deployment and scaling
- Persistent storage per pod if needed
- Predictable pod naming for debugging

### 2. Two-Stage Routing Architecture

The system implements a sophisticated two-stage routing approach:

**Stage 1: Waiting Room (Round-Robin)**
- Participants connect to any available backend pod
- Pure round-robin load balancing across all pods
- Waiting room state shared via Redis
- Any pod can perform participant matching

**Stage 2: Experiment Room (Pod-Specific)**
- After matching, room is assigned to a specific pod
- All participants redirected to the assigned pod
- Pod-router ensures all room traffic goes to same pod
- Room affinity maintained for entire experiment duration

```yaml
# Traefik IngressRoute Configuration
/experiment/room_* → pod-routing-service:3001 (path-based routing)
/socket.io/* → pod-routing-service:3001 (all WebSocket traffic)
/api/room/* → pod-routing-service:3001 (room-specific APIs)
/api/experiment/* → pod-routing-service:3001 (experiment APIs)
/api/* → backend-service:3000 (general APIs, round-robin)
/* → frontend-service:80 (static content)
```

**Routing Decision Flow:**
1. Browser requests `/experiment/room_xyz` (with Accept: text/html)
2. Traefik routes to pod-routing-service
3. Pod-router detects browser request and looks up room in Redis
4. Pod-router sends 302 redirect to `/experiment?roomId=room_xyz&pod=backend-X`
5. Frontend JavaScript reads pod parameter from URL
6. Socket.IO connects with `?roomId=room_xyz` in query string
7. Pod-router routes Socket.IO to correct backend pod based on roomId

### 3. Redis-Based Coordination

Redis serves as the central coordination layer:

```javascript
// Room-to-pod assignment
room:${roomId}:pod → {
  podId: "backend-1",
  participantCount: 4,
  assignedAt: timestamp
}

// Pod metrics
pod:${podId}:metrics → {
  activeRooms: 3,
  totalParticipants: 12,
  lastUpdate: timestamp
}

// Waiting room state (shared across all pods)
waiting:${experimentId}:participants → Set of participant IDs
```

### 4. Socket.IO Redis Adapter

Enables cross-pod communication for WebSocket events:

```javascript
import { createAdapter } from '@socket.io/redis-adapter';

io.adapter(createAdapter(pubClient, subClient));
```

**Features:**
- Broadcasting across all pods
- Room management across pods
- Sticky sessions for WebSocket connections
- Automatic failover on pod failure

## Critical Architecture Details

### Path-Based vs Query-Based Routing

The system uses a hybrid approach for maximum compatibility:

1. **Path-Based Routing (for browsers)**:
   - URL: `https://hyperstudy.io/experiment/room_xyz`
   - Used when users share links or bookmark rooms
   - Pod-router detects browser request and redirects to frontend
   - Frontend receives room and pod info via query parameters

2. **Query-Based Routing (for Socket.IO)**:
   - URL: `wss://hyperstudy.io/socket.io/?roomId=room_xyz`
   - Socket.IO cannot use dynamic namespaces with room IDs
   - Room ID passed as query parameter for pod-router to parse
   - Pod-router proxies to correct backend based on Redis lookup

### Why Two Pod-Router Replicas?

Having 2 pod-router replicas provides:
- **High Availability**: No single point of failure for routing
- **Zero-Downtime Updates**: Rolling deployments without service interruption
- **Stateless Operation**: Both routers query same Redis for decisions
- **Load Distribution**: Handles routing decisions in parallel

### Socket.IO Architecture

The application uses multiple Socket.IO namespaces:
- `/waiting`: Waiting room connections (any pod)
- `/experiment`: Active experiment connections (pod-specific)
- `/sync`: Media synchronization (pod-specific)

All Socket.IO traffic MUST go through pod-router to ensure correct pod routing based on roomId.

## Core Services

### Pod Selection Service

Intelligently assigns rooms to pods based on capacity and load:

```javascript
class PodSelectionService {
  async selectPodForRoom(participantCount) {
    // 1. Get metrics for all pods from Redis
    const podMetrics = await this.getAllPodMetrics();
    
    // 2. Filter out pods at capacity
    const availablePods = podMetrics.filter(pod => 
      pod.activeRooms < this.maxRoomsPerPod &&
      pod.totalParticipants + participantCount <= this.maxParticipantsPerPod
    );
    
    // 3. Score each pod based on:
    //    - Room capacity (35% weight)
    //    - Participant capacity (35% weight)
    //    - Load balance (20% weight)
    //    - Metric freshness (10% weight)
    const scoredPods = availablePods.map(pod => ({
      podId: pod.podId,
      score: this.calculatePodScore(pod, participantCount)
    }));
    
    // 4. Select pod with highest score
    return this.selectBestPod(scoredPods);
  }
}
```

**Scoring Algorithm:**
- **Room Capacity Score**: Available room slots (0-35 points)
- **Participant Capacity Score**: Available participant slots (0-35 points)
- **Load Balance Score**: Prefers even distribution (0-20 points)
- **Freshness Score**: Recent metrics weighted higher (0-10 points)

### Pod Router Service (podRouterProxy.js)

The pod-router is a critical component that handles room-based routing:

```javascript
// Pod Router handles two types of requests:
// 1. Browser requests to /experiment/room_xyz - redirects to frontend
// 2. API/Socket.IO requests - proxies to correct backend pod

function extractRoomId(req) {
  // Check URL path for room ID (e.g., /experiment/room_xyz)
  const pathMatch = req.url.match(/room_([\w-]+)/);
  if (pathMatch) return pathMatch[0];
  
  // Check Socket.IO query parameters
  if (req.url.includes('/socket.io/')) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return url.searchParams.get('roomId');
  }
  
  return null;
}

async function getTargetBackend(req) {
  const roomId = extractRoomId(req);
  
  if (!roomId) {
    // No room ID - use default round-robin backend
    return 'http://backend-service:3000';
  }
  
  // Look up room-to-pod assignment in Redis
  const assignment = await redisClient.get(`room:${roomId}:pod`);
  if (!assignment) {
    return 'http://backend-service:3000';
  }
  
  const { podId } = JSON.parse(assignment);
  // Return pod-specific endpoint
  return `http://${podId}.hyperstudy.svc.cluster.local:3000`;
}

// Handle browser requests differently than API requests
if (isBrowserRequest && isExperimentPath) {
  // Redirect browser to frontend with pod info
  res.writeHead(302, {
    'Location': `/experiment?roomId=${roomId}&pod=${podId}`
  });
  res.end();
} else {
  // Proxy API/Socket.IO to backend pod
  proxy.web(req, res, { target });
}
```

### State Manager

Centralized Redis state management:

```javascript
class StateManager {
  // Room-pod assignments
  async assignRoomToPod(roomId, podId, participantCount) {
    const key = `room:${roomId}:pod`;
    const data = {
      podId,
      participantCount,
      assignedAt: Date.now()
    };
    await redis.set(key, JSON.stringify(data));
  }
  
  // Pod metrics updates
  async updatePodMetrics(podId, metrics) {
    const key = `pod:${podId}:metrics`;
    await redis.set(key, JSON.stringify({
      ...metrics,
      lastUpdate: Date.now()
    }));
  }
  
  // Waiting room operations (shared across pods)
  async addToWaitingRoom(experimentId, participant) {
    const key = `waiting:${experimentId}:participants`;
    await redis.sadd(key, participant.id);
  }
}
```

## Waiting Room Architecture

The waiting room system is fully distributed across all pods:

### Shared State in Redis
- Participant queue
- Matching status
- Room assignments
- Experiment configurations

### Cross-Pod Communication
```javascript
// Any pod can handle waiting room connections
io.of('/waiting').on('connection', async (socket) => {
  // Add to Redis-based waiting queue
  await stateManager.addToWaitingRoom(experimentId, participant);
  
  // Check for matches (any pod can perform matching)
  const matches = await checkForMatches(experimentId);
  
  if (matches.length >= minParticipants) {
    // Create room and assign to pod
    const selectedPod = await podSelectionService.selectPodForRoom(matches.length);
    await createRoomOnPod(roomId, selectedPod, matches);
    
    // Notify all participants (across all pods)
    io.of('/waiting').to(experimentId).emit('room_assigned', {
      roomId,
      redirectUrl: `/experiment/${roomId}`
    });
  }
});
```

## Deployment Configuration

### Environment Variables

```bash
# Enable horizontal scaling (CRITICAL - must be set)
HORIZONTAL_SCALING_ENABLED=true

# Pod identification (injected by Kubernetes)
POD_NAME=backend-0
POD_NAMESPACE=hyperstudy
POD_IP=10.244.1.80

# Capacity limits
MAX_ROOMS_PER_POD=20
MAX_PARTICIPANTS_PER_POD=80

# Metrics reporting
METRICS_HEARTBEAT_INTERVAL=60000  # 60 seconds

# Redis configuration
REDIS_HOST=redis-service.hyperstudy.svc.cluster.local
REDIS_PORT=6379

# Frontend configuration (MUST be empty for relative URLs)
# CRITICAL: DO NOT set VITE_BACKEND_URL in production!
# Empty value enables nginx reverse proxy to backend
VITE_BACKEND_URL=
```

### Kubernetes Components

#### Backend StatefulSet
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: backend
  namespace: hyperstudy
spec:
  replicas: 3
  serviceName: backend
  template:
    spec:
      containers:
      - name: backend
        env:
        - name: POD_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: HORIZONTAL_SCALING_ENABLED
          value: "true"
```

#### Pod Routing Service
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pod-router
  namespace: hyperstudy
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: router
        image: backend-image
        command: ["node", "/app/src/services/podRouterProxy.js"]
        ports:
        - containerPort: 3001
```

#### Frontend with Nginx Proxy
```nginx
# nginx.conf in frontend pods
location /api/ {
    proxy_pass http://backend-service.hyperstudy.svc.cluster.local:3000;
}

location /experiment-livekit/ {
    proxy_pass http://backend-service.hyperstudy.svc.cluster.local:3000;
}

location /socket.io/ {
    proxy_pass http://backend-service.hyperstudy.svc.cluster.local:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

### Scaling Operations

#### Backend Scaling

```bash
# Manual scaling
kubectl scale statefulset backend -n hyperstudy --replicas=5

# Check backend HPA status
kubectl get hpa backend-hpa -n hyperstudy
```

#### Frontend Scaling

```bash
# Manual scaling (temporary, overridden by HPA)
kubectl scale deployment frontend -n hyperstudy --replicas=5

# Check frontend HPA status
kubectl get hpa frontend-hpa -n hyperstudy

# Apply frontend HPA
kubectl apply -f k8s/base/frontend-hpa.yaml
```

#### Complete Deployment

```bash
# Deploy both frontend and backend with scaling
./deploy-horizontal-scaling.sh

# Monitor all HPAs
kubectl get hpa -n hyperstudy -w

# Check metrics server
kubectl top nodes
kubectl top pods -n hyperstudy
```

### Prerequisites for Auto-scaling

1. **Metrics Server**: Required for HPA to function
```bash
# Check if metrics-server is running
kubectl get deployment metrics-server -n kube-system

# If not installed, deploy it
kubectl apply -f k8s/base/metrics-server.yaml
```

2. **Resource Requests**: Pods must have resource requests defined
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "100m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

## Frontend Scaling Architecture

### Frontend Service Overview

The frontend runs as a Kubernetes Deployment with nginx serving the Svelte 5 SPA and acting as a reverse proxy for backend services:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 3  # Base replicas, auto-scales 2-10
  strategy:
    type: RollingUpdate
```

### Frontend Components

#### 1. Nginx Web Server
- Serves compiled Svelte application from `/usr/share/nginx/html`
- Handles client-side routing with SPA fallback
- Provides gzip compression and static asset caching
- Acts as reverse proxy for API and WebSocket traffic

#### 2. Reverse Proxy Configuration
```nginx
# Proxy API requests to backend
location /api/ {
    proxy_pass http://backend-service.hyperstudy.svc.cluster.local:3000;
}

# Proxy LiveKit endpoints
location /experiment-livekit/ {
    proxy_pass http://backend-service.hyperstudy.svc.cluster.local:3000;
}

# Proxy WebSocket connections
location /socket.io/ {
    proxy_pass http://backend-service.hyperstudy.svc.cluster.local:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

#### 3. Automatic Scaling (HPA)
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: frontend-hpa
spec:
  scaleTargetRef:
    kind: Deployment
    name: frontend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        averageUtilization: 80
```

### Frontend vs Backend Scaling Comparison

| Aspect | Frontend | Backend |
|--------|----------|---------|
| **Deployment Type** | Deployment (stateless) | StatefulSet (stateful) |
| **Scaling Complexity** | Simple - any pod serves any request | Complex - room affinity required |
| **Session Affinity** | None needed | Required for rooms |
| **State Management** | No state (static files) | Redis-coordinated state |
| **Routing** | Simple round-robin | Two-stage with pod routing |
| **Scale Triggers** | CPU/Memory utilization | Rooms and participants |
| **Pod Identity** | Anonymous (frontend-abc123) | Stable (backend-0, backend-1) |

### Frontend Scaling Benefits

1. **Stateless Design**: No session state or coordination needed
2. **Horizontal Scalability**: Add/remove pods without impact
3. **Load Distribution**: Kubernetes automatically balances requests
4. **Resource Efficiency**: Scales based on actual CPU/memory usage
5. **High Availability**: Pod anti-affinity spreads across nodes

### Monitoring Frontend Performance

```bash
# Check current scaling status
kubectl get hpa frontend-hpa -n hyperstudy

# Monitor pod metrics
kubectl top pods -n hyperstudy | grep frontend

# View scaling events
kubectl describe hpa frontend-hpa -n hyperstudy

# Check pod distribution
kubectl get pods -n hyperstudy -o wide | grep frontend
```

## Backend Load Balancing Strategies

### 1. Least Loaded Pod Selection
Rooms are assigned to the pod with the lowest current load:

```javascript
const scores = pods.map(pod => ({
  pod,
  load: (pod.activeRooms / maxRooms) * 0.5 + 
        (pod.participants / maxParticipants) * 0.5
}));
return scores.sort((a, b) => a.load - b.load)[0].pod;
```

### 2. Capacity-Based Scoring
Advanced scoring considers multiple factors:
- Available room slots
- Available participant capacity
- Current utilization percentage
- Metric freshness (stale pods deprioritized)

### 3. Affinity Rules
- All participants in a room must connect to the same pod
- Waiting room connections can go to any pod
- API requests are load-balanced unless room-specific

## Failover and Recovery

### Pod Failure Handling

1. **Detection**: Kubernetes health checks detect pod failure
2. **Redistribution**: 
   - Waiting room participants automatically reconnect to other pods
   - Active rooms are lost (participants must rejoin)
3. **Cleanup**: Redis TTLs ensure stale assignments are removed

### Graceful Shutdown

```javascript
process.on('SIGTERM', async () => {
  console.log('Graceful shutdown initiated');
  
  // Stop accepting new connections
  server.close();
  
  // Wait for existing connections to complete
  await waitForConnectionsDrain();
  
  // Clean up Redis state
  await stateManager.cleanupPodState(podId);
  
  process.exit(0);
});
```

## Monitoring and Observability

### Metrics Collection

Each pod reports metrics to Redis:

```javascript
{
  podId: "backend-1",
  activeRooms: 3,
  totalParticipants: 12,
  cpuUsage: 45.2,
  memoryUsage: 512,
  lastUpdate: 1634567890123
}
```

### Health Endpoints

```bash
# Pod-specific health
GET /health/pod
{
  "podId": "backend-1",
  "status": "healthy",
  "rooms": 3,
  "participants": 12
}

# Cluster-wide health
GET /health/cluster
{
  "totalPods": 3,
  "healthyPods": 3,
  "totalRooms": 9,
  "totalParticipants": 36
}
```

### Logging

Structured logging with pod context:

```javascript
console.log('[PodSelection] Room assigned', {
  podId: 'backend-1',
  roomId: 'room_123',
  participantCount: 4,
  timestamp: new Date().toISOString()
});
```

## Performance Considerations

### Capacity Planning

| Metric | Per Pod Limit | Reasoning |
|--------|--------------|-----------|
| Active Rooms | 10 | Memory and CPU overhead per room |
| Total Participants | 40 | WebSocket connection limit |
| WebSocket Connections | 1000 | System file descriptor limits |
| Redis Operations/sec | 1000 | Redis connection pooling |

### Optimization Strategies

1. **Connection Pooling**: Reuse Redis connections
2. **Batch Operations**: Group Redis operations
3. **Caching**: Local cache for pod metrics (short TTL)
4. **Event Debouncing**: Aggregate rapid state changes

## Troubleshooting Guide

### Common Issues

#### 1. Participants Stuck on "Synchronizing Participants"
**Symptoms**: Participants see "Synchronizing participants" screen indefinitely during experiment

**Root Causes**:
- Participants being routed to different backend pods
- IngressRoute not routing `/experiment/room_*` to pod-router
- Socket.IO connections bypassing pod-router
- Frontend including roomId in path instead of query parameters

**Diagnosis**:
```bash
# Check if participants are on same pod
for i in 0 1 2; do 
  echo "=== backend-$i ==="
  kubectl logs backend-$i -n hyperstudy --tail=10 | grep "Socket connected"
done

# Verify IngressRoute configuration
kubectl get ingressroute hyperstudy-main -n hyperstudy -o yaml | grep experiment/room

# Check pod-router logs
kubectl logs deployment/pod-router -n hyperstudy --tail=50 | grep Room

# Verify Redis room assignment
kubectl exec -n hyperstudy redis-0 -- redis-cli GET "room:ROOM_ID:pod"
```

**Solutions**:
```bash
# Fix IngressRoute to route room paths to pod-router
kubectl edit ingressroute hyperstudy-main -n hyperstudy
# Ensure this rule exists with high priority:
# match: Host(`hyperstudy.io`) && PathRegexp(`^/experiment/room_[\w-]+`)
# services:
#   - name: pod-routing-service
#     port: 3001
# priority: 100

# Ensure ALL Socket.IO goes through pod-router
# match: Host(`hyperstudy.io`) && PathPrefix(`/socket.io`)
# services:
#   - name: pod-routing-service
#     port: 3001
```

#### 2. Wrong VITE_BACKEND_URL Configuration
**Symptoms**: API calls fail, Socket.IO can't connect, or routing breaks

**Root Cause**: VITE_BACKEND_URL set to absolute URL instead of empty

**Solution**: 
```bash
# Frontend MUST have empty VITE_BACKEND_URL for nginx proxy
cd frontend
echo 'ENV VITE_BACKEND_URL=' >> Dockerfile
docker build --platform linux/amd64 -t registry.digitalocean.com/hyperstudy/frontend:latest .
docker push registry.digitalocean.com/hyperstudy/frontend:latest
kubectl rollout restart deployment frontend -n hyperstudy
```

#### 3. Uneven Load Distribution
**Symptoms**: One pod has many more rooms than others

**Diagnosis**:
```bash
# View all pod metrics
kubectl exec backend-0 -- curl localhost:3000/api/health/metrics
```

**Solutions**:
- Adjust scoring weights in pod selection
- Check for stale metrics
- Verify heartbeat intervals

#### 4. Waiting Room Not Matching
**Symptoms**: Participants stuck in waiting room

**Diagnosis**:
```bash
# Check waiting room state
redis-cli smembers waiting:${experimentId}:participants
```

**Solutions**:
- Verify Redis pub/sub is working
- Check Socket.IO adapter configuration
- Ensure all pods have same matching logic

### Debug Commands

```bash
# Test the complete routing flow
curl -I -H "Accept: text/html" https://hyperstudy.io/experiment/room_xyz
# Should return 302 redirect to /experiment?roomId=room_xyz&pod=backend-X

# Check room assignments in Redis
kubectl exec -n hyperstudy redis-0 -- redis-cli KEYS "room:*:pod"
kubectl exec -n hyperstudy redis-0 -- redis-cli GET "room:ROOM_ID:pod"

# Monitor Socket.IO connections per pod
for i in 0 1 2; do
  echo "=== backend-$i ==="
  kubectl logs backend-$i -n hyperstudy --tail=5 | grep -E "socket|room"
done

# Check pod-router routing decisions
kubectl logs deployment/pod-router -n hyperstudy --tail=100 | grep PodRouter

# Verify IngressRoute rules
kubectl get ingressroute hyperstudy-main -n hyperstudy -o json | \
  jq -r '.spec.routes[] | select(.match | contains("room") or contains("socket.io")) | "\(.match) → \(.services[0].name):\(.services[0].port)"'

# Test Socket.IO connection with roomId
curl "https://hyperstudy.io/socket.io/?roomId=room_xyz&EIO=4&transport=polling"

# Check pod distribution
echo "=== Pod Assignment Distribution ==="
for i in 0 1 2; do
  count=$(kubectl exec -n hyperstudy redis-0 -- redis-cli --scan --pattern "room:*:pod" | \
    xargs -I {} sh -c "kubectl exec -n hyperstudy redis-0 -- redis-cli GET {}" | \
    grep -c "backend-$i" 2>/dev/null || echo 0)
  echo "backend-$i: $count rooms"
done
```

## Best Practices

### 1. Configuration Management
- Use ConfigMaps for environment variables
- Separate configs for dev/staging/production
- Version control all configuration

### 2. Deployment Strategy
- Use rolling updates for zero-downtime deployments
- Test scaling changes in staging first
- Monitor metrics during scaling operations

### 3. Redis Management
- Use Redis persistence for production
- Configure appropriate TTLs for all keys
- Monitor Redis memory usage
- Use Redis Cluster for high availability

### 4. Testing
- Load test with multiple pods
- Test failover scenarios
- Verify room affinity under load
- Test waiting room with concurrent matches

## Future Enhancements

### Planned Improvements

1. **Dynamic Rebalancing**: Migrate rooms between pods for better distribution
2. **Predictive Scaling**: Use ML to predict load and pre-scale
3. **Multi-Region Support**: Deploy across multiple Kubernetes clusters
4. **Session Migration**: Allow rooms to survive pod failures
5. **Advanced Metrics**: Prometheus integration for detailed monitoring

### Experimental Features

- **WebRTC Optimization**: Media server affinity for reduced latency
- **Smart Caching**: Distributed cache layer for frequently accessed data
- **Queue Prioritization**: Priority queues for experiment matching
- **Cost Optimization**: Spot instance support with graceful migration

## Related Documentation

- [Deployment Guide](../deployment.md) - General deployment instructions
- [Architecture Overview](./overview.md) - System architecture
- [API Documentation](../data-api/overview.md) - API endpoints
- [Kubernetes Setup](../../administrators/kubernetes-setup.md) - Cluster configuration