---
title: Monitoring & Observability
sidebar_position: 4
---

# Monitoring & Observability Guide

HyperStudy uses Prometheus and Grafana for comprehensive monitoring, providing real-time insights into application performance, resource usage, and system health.

## Architecture Overview

The monitoring stack consists of:

- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **Node Exporter**: Hardware and OS metrics
- **Kube-state-metrics**: Kubernetes cluster metrics
- **Application Metrics**: Custom metrics from HyperStudy services

## Accessing Monitoring Tools

### Local Access (Port Forwarding)

#### Prometheus
```bash
# Forward Prometheus to localhost:9090
kubectl port-forward -n monitoring svc/prometheus 9090:9090

# Access Prometheus UI
open http://localhost:9090
```

#### Grafana
```bash
# Forward Grafana to localhost:3000
kubectl port-forward -n monitoring svc/grafana 3000:3000

# Access Grafana
open http://localhost:3000

# Default credentials:
# Username: admin
# Password: <GRAFANA_ADMIN_PASSWORD from secrets>
```

### Production Access

In production, Grafana is accessible through the ingress:

```
https://grafana.hyperstudy.app
```

## Available Dashboards

### 1. Cluster Overview Dashboard

**Purpose**: High-level view of cluster health and resource utilization

**Key Metrics**:
- Node CPU and memory usage
- Pod distribution across nodes
- Cluster capacity and allocation
- Network I/O statistics
- Disk usage and I/O

**Use Cases**:
- Capacity planning
- Identifying resource bottlenecks
- Node health monitoring

### 2. Application Performance Dashboard

**Purpose**: Monitor HyperStudy application metrics

**Key Metrics**:
- Request rate and latency (p50, p95, p99)
- Error rates by endpoint
- Active connections
- Response time distribution
- Database query performance

**Use Cases**:
- Performance optimization
- SLA monitoring
- Troubleshooting slow endpoints

### 3. Socket.IO Metrics Dashboard

**Purpose**: Real-time communication monitoring

**Key Metrics**:
- Active WebSocket connections
- Room occupancy
- Message throughput
- Connection/disconnection rates
- Event processing times
- Redis pub/sub metrics

**Use Cases**:
- Scaling decisions
- Connection stability monitoring
- Debugging synchronization issues

### 4. Pod Performance Dashboard

**Purpose**: Individual pod monitoring

**Key Metrics**:
- CPU usage per pod
- Memory consumption
- Network traffic
- Restart count
- Container states
- Request handling capacity

**Use Cases**:
- Identifying problematic pods
- Resource optimization
- Load balancing verification

### 5. Redis Metrics Dashboard

**Purpose**: Redis performance and health

**Key Metrics**:
- Memory usage
- Cache hit/miss rates
- Command throughput
- Connection count
- Evicted keys
- Persistence status

**Use Cases**:
- Cache optimization
- Memory management
- Performance tuning

### 6. Experiment Metrics Dashboard

**Purpose**: HyperStudy experiment-specific metrics

**Key Metrics**:
- Active experiments
- Participant distribution
- Media sync accuracy
- Experiment completion rates
- Error rates by experiment phase
- LiveKit room statistics

**Use Cases**:
- Experiment health monitoring
- Participant experience tracking
- Debugging experiment issues

## Key Metrics Explained

### Application Metrics

#### Request Latency
```promql
# 95th percentile latency
histogram_quantile(0.95, 
  rate(http_request_duration_seconds_bucket[5m])
)
```

#### Error Rate
```promql
# Percentage of 5xx errors
sum(rate(http_requests_total{status=~"5.."}[5m])) 
/ 
sum(rate(http_requests_total[5m])) * 100
```

#### Active Connections
```promql
# Current WebSocket connections
socketio_connected_clients
```

### Resource Metrics

#### CPU Usage
```promql
# CPU usage by pod
sum(rate(container_cpu_usage_seconds_total[5m])) by (pod)
```

#### Memory Usage
```promql
# Memory usage percentage
container_memory_working_set_bytes 
/ 
container_spec_memory_limit_bytes * 100
```

#### Network Traffic
```promql
# Network bytes received per second
rate(container_network_receive_bytes_total[5m])
```

## Setting Up Alerts

### Alert Configuration

Alerts are defined in `k8s/monitoring/prometheus-alerts.yaml`:

```yaml
groups:
  - name: hyperstudy
    rules:
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m])) 
          / 
          sum(rate(http_requests_total[5m])) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is above 5% for 5 minutes"
```

### Common Alerts

#### High CPU Usage
```yaml
alert: HighCPUUsage
expr: |
  (sum(rate(container_cpu_usage_seconds_total[5m])) by (pod) 
  / 
  sum(container_spec_cpu_quota) by (pod)) > 0.8
for: 10m
```

#### Memory Pressure
```yaml
alert: MemoryPressure
expr: |
  container_memory_working_set_bytes 
  / 
  container_spec_memory_limit_bytes > 0.9
for: 5m
```

#### Pod Restarts
```yaml
alert: FrequentPodRestarts
expr: |
  increase(kube_pod_container_status_restarts_total[1h]) > 5
```

#### Socket.IO Connection Issues
```yaml
alert: SocketIOConnectionDrop
expr: |
  rate(socketio_disconnect_total[5m]) > 10
```

### Alert Notifications

Configure alert notifications in Grafana:

1. Navigate to **Alerting** → **Contact points**
2. Add notification channel (Email, Slack, PagerDuty, etc.)
3. Configure alert routing rules
4. Test notifications

## Custom Metrics

### Adding Application Metrics

#### Backend Metrics (Node.js)

```javascript
// metrics.js
const promClient = require('prom-client');

// Create custom metrics
const httpDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const activeExperiments = new promClient.Gauge({
  name: 'hyperstudy_active_experiments',
  help: 'Number of active experiments'
});

const syncAccuracy = new promClient.Histogram({
  name: 'hyperstudy_sync_accuracy_ms',
  help: 'Media synchronization accuracy in milliseconds',
  buckets: [1, 5, 10, 25, 50, 100, 250, 500, 1000]
});

// Export metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

#### Socket.IO Metrics

```javascript
// Track Socket.IO connections
io.on('connection', (socket) => {
  connectedClients.inc();
  
  socket.on('disconnect', () => {
    connectedClients.dec();
    disconnectTotal.inc();
  });
  
  socket.on('join-room', (room) => {
    roomOccupancy.inc({ room });
  });
});
```

### Prometheus Scraping Configuration

Add service monitor for custom metrics:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-metrics
  labels:
    app: backend
    metrics: "true"
spec:
  ports:
  - name: metrics
    port: 8080
    targetPort: 8080
  selector:
    app: backend
```

## Debugging with Metrics

### Performance Issues

1. **Check latency percentiles**:
   ```promql
   histogram_quantile(0.99, 
     rate(http_request_duration_seconds_bucket[5m])
   )
   ```

2. **Identify slow endpoints**:
   ```promql
   topk(10, 
     histogram_quantile(0.95, 
       rate(http_request_duration_seconds_bucket[5m])
     ) by (route)
   )
   ```

3. **Check resource constraints**:
   - CPU throttling
   - Memory limits
   - Network saturation

### Connection Issues

1. **Monitor WebSocket connections**:
   ```promql
   socketio_connected_clients
   ```

2. **Check disconnection reasons**:
   ```promql
   increase(socketio_disconnect_total[5m]) by (reason)
   ```

3. **Verify Redis connectivity**:
   ```promql
   redis_connected_clients
   ```

### Scaling Decisions

1. **CPU-based scaling indicators**:
   ```promql
   avg(rate(container_cpu_usage_seconds_total[5m])) by (deployment)
   ```

2. **Memory pressure indicators**:
   ```promql
   container_memory_working_set_bytes / container_spec_memory_limit_bytes
   ```

3. **Request queue depth**:
   ```promql
   http_requests_pending
   ```

## Best Practices

### Dashboard Design

1. **Use consistent time ranges** across panels
2. **Group related metrics** logically
3. **Include context** (thresholds, targets)
4. **Use appropriate visualizations**:
   - Graphs for time series
   - Gauges for current values
   - Tables for detailed breakdowns
   - Heatmaps for distributions

### Query Optimization

1. **Use recording rules** for expensive queries:
   ```yaml
   - record: job:http_requests:rate5m
     expr: sum(rate(http_requests_total[5m])) by (job)
   ```

2. **Limit cardinality** in labels
3. **Use appropriate time ranges**
4. **Aggregate before graphing**

### Alert Management

1. **Avoid alert fatigue**:
   - Set appropriate thresholds
   - Use proper time windows
   - Group related alerts

2. **Include actionable information**:
   - Clear descriptions
   - Runbook links
   - Suggested remediation

3. **Test alerts regularly**:
   - Verify they fire correctly
   - Check notification delivery
   - Update as system evolves

## Troubleshooting Monitoring

### Prometheus Issues

```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Verify metrics ingestion
curl http://localhost:9090/api/v1/query?query=up

# Check Prometheus logs
kubectl logs -n monitoring deployment/prometheus
```

### Grafana Issues

```bash
# Reset admin password
kubectl exec -n monitoring deployment/grafana -- \
  grafana-cli admin reset-admin-password newpassword

# Check datasource connectivity
kubectl exec -n monitoring deployment/grafana -- \
  curl http://prometheus:9090/api/v1/query?query=up

# Review Grafana logs
kubectl logs -n monitoring deployment/grafana
```

### Missing Metrics

1. **Verify service discovery**:
   ```bash
   kubectl get servicemonitor -n monitoring
   ```

2. **Check scrape configuration**:
   ```bash
   kubectl get configmap -n monitoring prometheus-config -o yaml
   ```

3. **Test metric endpoint**:
   ```bash
   kubectl port-forward -n hyperstudy pod/backend-0 8080:8080
   curl http://localhost:8080/metrics
   ```

## Advanced Topics

### Long-term Storage

Configure remote storage for historical data:

```yaml
remote_write:
  - url: "https://prometheus-storage.example.com/api/v1/write"
    basic_auth:
      username: user
      password: pass
```

### Federation

Set up Prometheus federation for multi-cluster monitoring:

```yaml
scrape_configs:
  - job_name: 'federate'
    honor_labels: true
    metrics_path: '/federate'
    params:
      'match[]':
        - '{job="hyperstudy"}'
    static_configs:
      - targets:
        - 'prometheus-cluster-b:9090'
```

### Custom Exporters

Create custom exporters for third-party services:

```javascript
// firebase-exporter.js
const admin = require('firebase-admin');
const express = require('express');
const promClient = require('prom-client');

const userCount = new promClient.Gauge({
  name: 'firebase_user_count',
  help: 'Total number of users'
});

// Update metrics periodically
setInterval(async () => {
  const users = await admin.auth().listUsers();
  userCount.set(users.users.length);
}, 60000);
```

## Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [PromQL Tutorial](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Grafana Dashboard Library](https://grafana.com/grafana/dashboards/)
- [Kubernetes Monitoring Best Practices](https://kubernetes.io/docs/tasks/debug/)