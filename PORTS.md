# 📡 Port Allocation Reference

This document defines the official port mapping convention for applications deployed on this server.

## 📐 Convention

- **Users are assigned port ranges:**
  - `3000–3099` → **guillaume**
  - `4000–4099` → **alice**
  - `5000–5099` → **system-wide apps**
  - `5100–5199` → **monitoring / observability**

- **Frontend/Backend convention:**
  - 🟦 **Even ports = Frontend**
  - 🟧 **Odd ports = Backend**

## 🧠 Reserved Ports

Avoid using the following for services:

- `80`, `443` – used by **Nginx** for HTTP/S entry
- `5432` – **PostgreSQL** DB
- `22` – **SSH**
- `3000`, `4000` – default for many Node-based apps (document usage)
