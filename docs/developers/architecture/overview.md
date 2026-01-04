---
title: Architecture Overview
sidebar_position: 1
---

# HyperStudy Architecture Overview

This document provides a high-level overview of the HyperStudy platform architecture, explaining the major components, data flows, and design principles.

## System Architecture

The HyperStudy platform follows a modern web application architecture with specialized components for real-time communication and media synchronization.


## Core Components

### Frontend (Svelte 5)

- **Framework**: Svelte 5 with runes mode for reactive state management
- **Key Features**:
  - Component-based UI with reactive state
  - Efficient DOM updates
  - Custom synchronization engine
  - LiveKit client integration
  - Experiment execution engine

### Backend (Node.js/Express)

- **Framework**: Node.js with Express
- **Key Services**:
  - API endpoints for experiment management
  - Socket.IO server for synchronization
  - LiveKit server integration
  - Recording management
  - Authentication and authorization
- **Horizontal Scaling**: 
  - Kubernetes StatefulSet deployment
  - Redis-based coordination
  - Pod-based room affinity
  - See [Horizontal Scaling Architecture](./horizontal-scaling.md) for details

### Real-time Communication (LiveKit)

- WebRTC-based audio/video communication
- Selective track subscription
- Adaptive streaming
- Recording capabilities
- Server-side processing

### Synchronization System

- Socket.IO-based time synchronization
- Kalman filter prediction engine
- PID controller for playback adjustments
- Server-controlled playback state

### Data Storage

#### Firebase
- **Firestore**: Structured data storage for:
  - User accounts
  - Experiment definitions
  - Room state
  - Participant data
  
- **Realtime Database**: Fast updates for:
  - Participant presence
  - Active state synchronization
  - Live experiment metrics
  
- **Firebase Storage**: Binary data storage for:
  - Recordings
  - Media assets
  - Exported experiment data

#### Redis
- **Session Management**: WebSocket session coordination
- **Pub/Sub**: Cross-pod communication
- **State Coordination**: 
  - Room-to-pod assignments
  - Pod metrics and health
  - Distributed waiting room queue
  - Socket.IO adapter for multi-pod broadcasting

## Data Flow

### Authentication Flow

1. User logs in via Firebase Authentication
2. JWT token is generated and stored
3. Token is verified on backend API requests
4. Role-based permissions are enforced

### Experiment Execution Flow

1. Experimenter creates experiment definition
2. Participants join experiment room
3. Server manages state transitions
4. Component data is synchronized via Socket.IO
5. Video sync uses specialized sync algorithm
6. Results stored in Firestore

### Media Synchronization Flow

1. Host controls send playback commands
2. Server broadcasts commands to clients
3. Clients calculate time offset from server
4. Kalman filter predicts optimal playback position
5. PID controller adjusts playback speed
6. Metrics are reported back to server

## Directory Structure

```
/
├── backend/                # Node.js Express backend
│   ├── src/
│   │   ├── experiment/     # Experiment state management
│   │   ├── experiment-livekit/ # LiveKit integration for experiments
│   │   ├── firebase/       # Firebase service integration
│   │   ├── livekit/        # LiveKit service for video
│   │   ├── routes/         # API routes
│   │   ├── sync/           # Time synchronization
│   │   └── utils/          # Utility functions
│   └── scripts/            # Maintenance and seeding scripts
│
├── frontend/               # Svelte 5 frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── admin/      # Admin interface components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── experiment/ # Experiment components
│   │   │   ├── shared/     # Shared UI components
│   │   │   └── ...
│   │   ├── lib/            # Libraries and utilities
│   │   │   ├── experiment/ # Experiment execution 
│   │   │   ├── media/      # Media handling
│   │   │   ├── network/    # Network communication
│   │   │   ├── services/   # API services
│   │   │   └── state/      # State management
│   │   └── routes/         # Application routes
│   └── public/             # Static assets
│
└── nginx/                  # Nginx configuration for deployment
```

## Key Design Principles

### 1. Component-Based Architecture

The frontend is built using a component-based architecture, with each UI element encapsulated as a Svelte component with clear inputs, outputs, and behaviors.

### 2. Separation of Concerns

The codebase separates:
- UI components from business logic
- API services from state management
- Synchronization from media playback
- Authentication from application logic

### 3. Reactive State Management

Svelte 5 runes are used for reactive state management:
- `$state` for reactive component state
- `$derived` for computed properties
- `$effect` for side effects
- Clean, concise reactivity patterns

### 4. Service-Oriented Design

Backend functionality is organized into discrete services:
- Room management
- Authentication
- Media synchronization
- Recording
- LiveKit integration

### 5. Real-Time First

The application is designed for real-time interaction:
- WebSocket connections for live updates
- Optimistic UI updates
- Careful handling of race conditions
- Robust error recovery

## System Boundaries and Integration Points

### External Integrations

The platform integrates with several external services:

1. **LiveKit Cloud** (or self-hosted)
   - WebRTC signaling and management
   - Recording capabilities
   - SFU for efficient video distribution
   
2. **Firebase**
   - Authentication
   - Data storage
   - File storage
   - Realtime updates

### Internal APIs

Key internal API boundaries include:

1. **Backend REST API**
   - Experiment management
   - User management
   - Media upload/management
   - Recording access
   
2. **Socket.IO Channels**
   - Time synchronization
   - Experiment state updates
   - Participant presence
   - Media sync commands

3. **LiveKit Room Service**
   - Audio/video track publication
   - Room management
   - Connection state
   - Track subscriptions

## Performance Considerations

The architecture addresses these key performance areas:

1. **Time Synchronization Precision**
   - Millisecond-level media synchronization
   - Compensation for network jitter
   - Adaptive playback rate adjustments
   
2. **WebRTC Optimization**
   - Bandwidth adaptation
   - Selective track subscription
   - Connection quality monitoring
   
3. **Resource Management**
   - Careful memory usage for long experiments
   - Efficient DOM updates
   - Background resource cleanup

## Security Model

The application implements a multi-layered security approach:

1. **Authentication**
   - Firebase Authentication with email/password
   - JWT token validation
   - Session management
   
2. **Authorization**
   - Role-based access control
   - Granular permissions
   - Firestore security rules
   
3. **Data Protection**
   - HTTPS for all communication
   - Secure WebSocket connections
   - Input validation and sanitization

## Next Steps

To dive deeper into the architecture, explore these sections:

{/* - [Frontend Architecture](./frontend.md) (coming soon) */}
{/* - [Backend Architecture](./backend.md) (coming soon) */}
{/* - [Firebase Integration](./firebase.md) (coming soon) */}
{/* - [LiveKit Integration](./livekit.md) (coming soon) */}
{/* - [Synchronization System](../sync-system/time-synchronization.md) (coming soon) */}