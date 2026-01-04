# Memory Optimization & Predictive Scaling Plan

## Executive Summary

This document outlines a comprehensive strategy to optimize memory allocation and implement predictive scaling for the HyperStudy platform. The plan addresses immediate cost savings ($120/month) while building a sophisticated, data-driven capacity planning system.

## Current State Analysis

### Problem Statement
- **4 nodes running** at 60-66% memory utilization
- **Pods requesting 4,224 Mi** but only using **851 Mi (20%)**
- Monthly cost: ~$240 for underutilized infrastructure
- No correlation between memory allocation and actual user load

### Root Cause
- Static memory requests based on arbitrary estimates
- No differentiation between pod types
- No integration with experiment scheduling
- Lack of role-based memory profiling

## Architecture Overview

### Pod Categories

#### Dynamic Pods (User-Dependent)
| Pod | Scaling Factor | Memory Profile |
|-----|---------------|----------------|
| **Backend** | High | Base: 100 MB<br>+15 MB per participant (video)<br>+8 MB per participant (no video)<br>+25 MB per experimenter |
| **Pod-Router** | Medium | Base: 32 MB<br>+2-3 MB per WebSocket connection |

#### Static Pods (Load-Independent)
| Pod | Memory Usage | Scaling Need |
|-----|-------------|--------------|
| **Frontend** | 8-16 MB | None (serves static files) |
| **Redis** | 10-32 MB | Data growth only |
| **Traefik** | 115-120 MB | None |
| **Metrics** | 70-80 MB | None |

## Implementation Phases

### Phase 1: Immediate Optimization (Week 1)

#### Objective
Apply conservative memory reductions for immediate cost savings.

#### Actions
1. **Create Kubernetes patches** for each workload
2. **Apply new memory requests**:
   - Backend: 512 Mi → 256 Mi
   - Frontend: 256 Mi → 32 Mi
   - Redis: 256 Mi → 32 Mi
   - Pod-Router: 256 Mi → 64 Mi
   - Traefik: 128 Mi (no change)
   - Metrics: 128 Mi (no change)
3. **Monitor stability** for 24-48 hours
4. **Verify node scale-down** (4 → 2 nodes expected)

#### Expected Outcome
- Immediate 50% reduction in node count
- $120/month cost savings
- No service disruption

### Phase 2: Enhanced Monitoring (Week 1-2)

#### Objective
Implement pod-specific and role-based memory tracking.

#### New Metrics to Implement

```javascript
// Backend memory tracking
const backendMemoryPerUser = new client.Gauge({
  name: 'hyperstudy_backend_memory_per_user_mb',
  help: 'Backend memory consumption per user type',
  labelNames: ['role', 'video_enabled', 'pod_name']
});

// Frontend baseline (should be constant)
const frontendMemoryBaseline = new client.Gauge({
  name: 'hyperstudy_frontend_memory_baseline_mb',
  help: 'Frontend memory usage baseline',
  labelNames: ['pod_name']
});

// Pod-router connection tracking
const routerMemoryPerConnection = new client.Gauge({
  name: 'hyperstudy_router_memory_per_connection_mb',
  help: 'Memory per WebSocket connection',
  labelNames: ['pod_name']
});

// Experiment-based projections
const experimentMemoryProjection = new client.Gauge({
  name: 'hyperstudy_experiment_memory_projection_mb',
  help: 'Projected memory for scheduled experiments',
  labelNames: ['experiment_id', 'pod_type']
});
```

#### Prometheus Recording Rules

```yaml
groups:
  - name: memory_profiling
    interval: 30s
    rules:
      # Memory per participant calculation
      - record: hyperstudy:memory_per_participant_mb
        expr: |
          rate(container_memory_usage_bytes{pod=~"backend.*"}[5m])
          / rate(hyperstudy_total_participants[5m])
          / 1024 / 1024

      # Memory efficiency score
      - record: hyperstudy:memory_efficiency_ratio
        expr: |
          container_memory_usage_bytes
          / container_spec_memory_limit_bytes

      # Predicted memory needs based on active users
      - record: hyperstudy:predicted_memory_mb
        expr: |
          100 +
          (hyperstudy_active_users_online{role="participant"} * 15) +
          (hyperstudy_active_users_online{role="experimenter"} * 25)
```

### Phase 3: Experiment Scheduling Integration (Week 2-3)

#### Objective
Integrate capacity planning with experiment scheduling system.

#### Experiment Metadata Schema

```typescript
interface ExperimentCapacityPlan {
  experiment_id: string;
  scheduled_time: Date;
  expected_participants: number;
  expected_duration_minutes: number;
  features: {
    video_streaming: boolean;
    video_chat: boolean;
    screen_recording: boolean;
    data_collection_rate_hz: number;
  };
  resource_requirements: {
    backend_memory_mb: number;
    pod_router_memory_mb: number;
    estimated_cost_usd: number;
  };
}
```

#### Pre-Scaling Timeline

```
T-30 minutes: Calculate required capacity
T-20 minutes: Trigger HPA pre-scaling if needed
T-10 minutes: Verify pods are ready
T-5 minutes:  Health check all services
T-0:          Experiment starts
T+duration:   Begin monitoring for scale-down
T+dur+30min:  Execute controlled scale-down
```

#### Capacity Reservation API

```javascript
async function reserveExperimentCapacity(experiment) {
  const memoryReq = calculateMemoryRequirements(experiment);

  // Check current vs required capacity
  const currentCapacity = await getCurrentClusterCapacity();
  const scalingNeeded = memoryReq.total > currentCapacity.available;

  if (scalingNeeded) {
    await schedulePreScaling({
      time: experiment.scheduled_time - 30 * 60 * 1000,
      targetReplicas: calculateRequiredReplicas(memoryReq),
      experiment_id: experiment.id
    });
  }

  return {
    reserved: true,
    estimated_cost: calculateCost(memoryReq, experiment.duration),
    scaling_required: scalingNeeded,
    capacity_details: memoryReq
  };
}
```

### Phase 4: Horizontal Pod Autoscaling (Week 3)

#### Objective
Implement HPA for dynamic pods with custom metrics.

#### HPA Configuration

```yaml
# Backend HPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: StatefulSet
    name: backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 75
  - type: Pods
    pods:
      metric:
        name: hyperstudy_active_participants
      target:
        type: AverageValue
        averageValue: "25"  # 25 participants per pod
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100  # Double pods if needed
        periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300  # 5 min cooldown
      policies:
      - type: Percent
        value: 50  # Remove half of pods max
        periodSeconds: 120
```

### Phase 5: Grafana Dashboards (Week 3-4)

#### Dashboard 1: Pod Memory Profiling
- Memory usage by pod type (time series)
- Memory per user breakdown by role
- Memory efficiency scores (used/requested)
- Pod-specific memory trends

#### Dashboard 2: Capacity Planning
- Experiment calendar with resource requirements
- Predicted vs actual memory usage
- Cost projections per experiment
- Available capacity for new experiments

#### Dashboard 3: Scaling Operations
- HPA scaling decisions and triggers
- Pre-scaling schedule and status
- Node utilization heatmap
- Scale-up/down event history

### Phase 6: Continuous Optimization (Ongoing)

#### Weekly Review Process
1. Analyze memory usage patterns from previous week
2. Identify anomalies or unexpected spikes
3. Refine memory-per-user calculations
4. Adjust HPA thresholds if needed
5. Update cost projections

#### Monthly Optimization
1. Review P95 memory usage per pod type
2. Adjust base memory requests
3. Optimize HPA policies
4. Review and update scaling strategies

## Memory Calculation Formulas

### Backend Memory
```
Memory_MB = BaseMemory + Σ(UserMemory[role] × UserCount[role])

Where:
- BaseMemory = 100 MB
- UserMemory[participant_video] = 15 MB
- UserMemory[participant_no_video] = 8 MB
- UserMemory[experimenter] = 25 MB
- UserMemory[admin] = 30 MB
```

### Pod-Router Memory
```
Memory_MB = 32 + (ActiveConnections × 2.5)
```

### Static Pods
```
Frontend: 16 MB (constant)
Redis: 32 MB (base) + DataSize_MB
Traefik: 128 MB (constant)
Metrics: 128 MB (constant)
```

## Success Metrics

### Cost Optimization
- [ ] Reduce node count from 4 to 2 (50% reduction)
- [ ] Achieve 70%+ memory efficiency (used/requested)
- [ ] Save $120+/month on infrastructure

### Performance
- [ ] Zero OOM kills during normal operations
- [ ] <30 second scaling response time
- [ ] 99.9% availability during experiments

### Operational
- [ ] Automated capacity planning for experiments
- [ ] Predictive scaling with no manual intervention
- [ ] Cost transparency for researchers

## Risk Mitigation

### Rollback Plan
1. Keep original YAML configurations backed up
2. Document all changes in Git
3. Test in dev environment first
4. Gradual rollout (one service at a time)

### Monitoring Alerts
```yaml
alerts:
  - name: HighMemoryPressure
    expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.9
    for: 2m
    severity: warning

  - name: OOMKillDetected
    expr: increase(container_oom_kills_total[1h]) > 0
    severity: critical

  - name: ScalingFailure
    expr: kube_hpa_status_condition{condition="ScalingLimited"} == 1
    for: 5m
    severity: warning
```

## Implementation Checklist

### Week 1
- [ ] Apply immediate memory optimizations
- [ ] Deploy enhanced metrics collection
- [ ] Create initial Grafana dashboards
- [ ] Document baseline measurements

### Week 2
- [ ] Implement experiment metadata collection
- [ ] Build capacity calculation functions
- [ ] Create pre-scaling logic
- [ ] Test with simulated load

### Week 3
- [ ] Deploy HPA configurations
- [ ] Integrate with recruitment system
- [ ] Complete dashboard suite
- [ ] Run controlled experiments

### Week 4
- [ ] Analyze collected data
- [ ] Fine-tune memory requests
- [ ] Adjust HPA thresholds
- [ ] Document lessons learned

## Appendix

### A. Agent Responsibilities

#### Research Agent
- Analyze current memory usage patterns
- Research best practices
- Identify optimization opportunities

#### Implementation Agent
- Create Kubernetes patches
- Implement monitoring code
- Deploy HPA configurations

#### Coordination Agent
- Manage timeline
- Coordinate between teams
- Track progress

#### Review Agent
- Validate changes
- Test scaling behavior
- Verify cost savings

### B. Tools and Technologies
- Kubernetes 1.33
- Prometheus 2.x
- Grafana 9.x
- Node.js (backend metrics)
- Python (analysis scripts)

### C. References
- [Kubernetes Resource Management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)
- [Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
- [Prometheus Recording Rules](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/)
- [DigitalOcean Kubernetes Best Practices](https://docs.digitalocean.com/products/kubernetes/)

---
*Last Updated: September 2024*
*Version: 1.0*
*Status: Ready for Implementation*