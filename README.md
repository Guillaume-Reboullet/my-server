# 📊 My server Dashboard & Audit Platform

[![Dockerized](https://img.shields.io/badge/Dockerized-Yes-blue?logo=docker)](https://www.docker.com/)
[![Built With](https://img.shields.io/badge/Built%20With-TypeScript-informational?logo=typescript)](https://www.typescriptlang.org/)
[![Stack](https://img.shields.io/badge/Stack-React%20%2B%20NestJS%20%2B%20PostgreSQL-blueviolet)](https://github.com/Guillaume-Reboullet/my-server)
<!-- [![License](https://img.shields.io/badge/License-MIT-success)](./LICENSE) -->

A secure, Docker-managed dashboard for monitoring, documenting, and deploying applications on a Debian 12-based OVH server. Designed to support small teams through clear infrastructure ownership, real-time server insights, and maintainable deployment workflows.


## 📌 Features

- 🔍 **Audit Dashboard** — Track container status, uptime, SSL certs, and system usage  
- 🛠 **Developer Docs** — Architecture diagrams, deployment instructions, and ownership  
- 🐳 **Docker-native Apps** — Each app runs isolated in its own container (frontend/backend/database)  
- 🔐 **SSL Monitoring** — Real-time cert expiry tracking and renewal logic  
- 📂 **Project Management** — Organize by users (e.g. `alice`, `guillaume`) and domains  
- 📈 **Charts & Trends** — Visual stats on system metrics, cert usage, and deployments  
- ⚙️ **Scalable Stack** — React (Vite) + NestJS + PostgreSQL + Docker + Nginx

## 🧱 Tech Stack

| Layer             | Tech                             |
|------------------|----------------------------------|
| `Frontend`        | `React` + `Tailwind CSS`      |
| `Backend API`      | `NestJS`              |
| `Database`         | `PostgreSQL`          |
| `Infrastructure`   | `Debian 12`, `Nginx`, `Docker`         |
| `Certificates`     | `Certbot` + `Let's Encrypt`          |
<!-- | `Monitoring`       | `grafana`     | -->

## 🧑‍💻 Quick Start

### 1. Clone the project

```bash
git clone git@github.com:Guillaume-Reboullet/my-server.git
cd my-server
```

### 2. Setup environment variables
Create a .env file at the root with:

```sh
cp .env.example .env
```

Create a .env file in the frontend folder with:

```sh
cp .env.example .env
```

Create a .env file in the backend folder with:

```sh
cp .env.example .env
```

### 3. Start in development mode
```sh
#Uses hot-reload for frontend & backend
make run-dev
```

### 4. Start in production mode
```sh
#Builds and starts the containers as production images
make run-prod
```

### 5. Reset (dangerous!)
```sh
make soft-reset  # Removes containers only
make hard-reset  # Removes containers AND volumes
```

## 📄 Pages Overview

 - **Dashboard** — Real-time stats for CPU, memory, disk usage, container uptime, and project summary.
 
 - **Projects** — Displays all deployed apps grouped by user (e.g. Alice, Bob), with filters for ownership and status.

 - **Containers** —Lists all running Docker containers with port mappings, uptime, and status indicators.

 - **SSL** — Monitors SSL certificates: expiration dates, issuers, domains, ownership, and includes renewal actions.

 - **Docs** — Internal documentation: architecture, deployment steps, server structure, SSL policy, and ownership mapping.

## 📂 Folder Structure
```sh
apps/
  frontend/        # React (Vite)
  backend/         # NestJS API
mocks/             # Mock data (containers.json, ssl.json, etc.)
docker-compose.yml
Makefile
.env
```
---

# 🤖 Server OVH
[![OS](https://img.shields.io/badge/OS-Debian%2012-a81d33?logo=debian&logoColor=white)](https://www.debian.org/releases/bookworm/)
[![Web Server](https://img.shields.io/badge/Reverse%20Proxy-Nginx-brightgreen?logo=nginx&logoColor=white)](https://nginx.org/)
[![SSL](https://img.shields.io/badge/SSL-Let's%20Encrypt-yellow?logo=letsencrypt)](https://letsencrypt.org/)
[![Containerized](https://img.shields.io/badge/Containerized-Docker-blue?logo=docker)](https://www.docker.com/)

## 🧩 Server Architecture 
 - 📦 Each project is containerized with Docker and isolated by user (e.g. Alice’s apps run on 300x ports, Guillaume’s on 400x).
 - 🌐 Nginx listens on HTTPS (port 443) and routes traffic to the appropriate internal Docker container using proxy_pass.
 - 🔐 SSL certificates are generated with Certbot and stored at /etc/letsencrypt, then mounted as read-only inside containers.
 - 🧩 The system supports multi-project, multi-user deployment using Docker Compose.

 👀 **[View Architecture Diagram in Eraser](https://app.eraser.io/workspace/bCLUdaJLtBbj4sH3KiGA?origin=share)**  

## 🚀 Deployment Workflow
How to safely deploy a new project to the server (frontend + backend + DB):

Clone your project into `~/projects/your-website`



Add a new service to `docker-compose.yml` with the right ports and environment variables

Mount your `.env` file, and if needed, add volumes and certs

Build and run the service:
```sh
docker compose up -d --build
```
Update the Nginx config to proxy the new domain

Use Certbot to generate a certificate:
```sh
sudo certbot --nginx -d your-domain.com
```
🎉 You're live, secure, and reverse-proxied.

## To Do List 
🔗 Replace mock data with real-time metrics from Docker Engine and Certbot

📈 Add Prometheus + Grafana support for production-grade monitoring

🧪 Integrate tests for backend API (Jest + Supertest)

🔐 Add basic auth or role-based access for moderation

🚀 Automate deployments via GitHub Actions in the future

### 📜 License
MIT — free to use, modify, and deploy.

Built by devs who believe code & infrastructure should be clear, monitored, and documented.