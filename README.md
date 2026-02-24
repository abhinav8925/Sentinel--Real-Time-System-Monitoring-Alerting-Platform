# 🚀 Sentinel — Real-Time Distributed Monitoring System

***A production-grade, microservices-based real-time monitoring platform designed to simulate enterprise-level observability systems like Datadog, Prometheus, and AWS CloudWatch.***

---

## 🌟 Project Overview

**Sentinel** is a fully distributed monitoring system that collects system metrics, processes them asynchronously, generates intelligent alerts, and streams real-time data to a live dashboard using modern event-driven architecture.

This project demonstrates ***advanced system design concepts*** including microservices, message queues, real-time communication, and distributed processing.

---

## 🎯 Key Features

✔ Real-time CPU & Memory Monitoring  
✔ Distributed Microservices Architecture  
✔ Redis-Based Message Queue System  
✔ Batch Processing Worker Pipeline  
✔ Intelligent Alert Engine with Cooldown Logic  
✔ Live Alert Streaming using Pub/Sub  
✔ WebSocket-Powered Real-Time Dashboard  
✔ Scalable & Fault-Tolerant System Design  

---

## 🏗️ System Architecture

```
Collector Service → Redis Queue → Worker Service → MongoDB
                                    ↓
                             Alert Engine Service
                                    ↓
                             Redis Pub/Sub Channel
                                    ↓
                          API Gateway (Socket.io)
                                    ↓
                            Real-Time Dashboard
```

---

## 🧠 Architecture Highlights

### 🔹 Microservices Design

Each component runs independently:

• Collector Service → Collects system metrics  
• Worker Service → Processes queued data  
• Alert Engine → Generates intelligent alerts  
• API Gateway → Streams real-time updates  

---

### 🔹 Event-Driven Processing

Redis Pub/Sub enables instant alert broadcasting without database polling.

---

### 🔹 Asynchronous Queue Pipeline

Metrics are buffered using Redis to prevent overload and ensure high scalability.

---

### 🔹 Batch Processing Optimization

Worker service writes metrics in batches to improve database performance.

---

## 🛠️ Tech Stack

### Backend
Node.js  
Express.js  
Socket.io  

### Database
MongoDB (Mongoose)

### Message Queue
Redis (Upstash Cloud Redis)

### System Monitoring
systeminformation npm library

### Architecture Concepts
Microservices  
Event-Driven Systems  
Pub/Sub Messaging  
Real-Time Streaming  
Distributed Processing  

---

## 📊 How the System Works

1. Collector service gathers system metrics.  
2. Metrics are pushed asynchronously into Redis queue.  
3. Worker service processes metrics in batches and stores them in MongoDB.  
4. Alert engine evaluates thresholds and generates alerts.  
5. Alerts are published through Redis Pub/Sub.  
6. API service streams live metrics and alerts to dashboard via WebSockets.  

---

## ⚡ Real-World Use Cases

Cloud infrastructure monitoring  
DevOps observability systems  
Data center performance tracking  
CI/CD pipeline monitoring  
Distributed system analytics  

---

## 🧪 Local Setup Instructions

### 1️⃣ Install Dependencies

```bash
npm install
```

---

### 2️⃣ Configure Environment Variables

Create `.env` file:

```
MONGODB_URI=your_mongodb_uri
REDIS_URL=your_upstash_redis_url
REDIS_TOKEN=your_upstash_redis_token
PORT=5000
```

---

### 3️⃣ Start Services

Run in separate terminals:

```bash
node services/collector/index.js
node services/worker/index.js
node services/alert/index.js
node services/api/index.js
```

---

### 4️⃣ Open Dashboard

```
http://localhost:5000/dashboard.html
```

---

## 🎯 System Design Concepts Demonstrated

Distributed Systems Architecture  
Message Queue Processing  
Event-Driven Design  
Real-Time Streaming Systems  
Fault-Tolerant System Design  
Horizontal Scalability Patterns  

---

## 🏆 Why This Project is Elite

Unlike typical CRUD applications, this project demonstrates:

Production-level system architecture  
Microservices orchestration  
Queue-based scalability patterns  
Real-time distributed communication  

These concepts mirror systems used at companies like Amazon, Google, and Netflix.

---

## 👨‍💻 Author

**Abhinav Anand**  
Full Stack Developer | DevOps Enthusiast | System Design Learner
