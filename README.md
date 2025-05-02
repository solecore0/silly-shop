# 🛍️ SillyShop

**SillyShop** is a full-stack e-commerce platform built with a React frontend and a Node.js backend. It supports product listings, user authentication, cart management, and more — powered by MongoDB, Redis, and Docker.

---

## 📁 Project Structure

```
silly-shop/
├── client/          # React frontend
├── server/          # Node.js backend (Express)
├── docker-compose.yml
├── README.md
```

---

## 🚀 Quick Start

### ⚙️ Backend (via Docker)

Make sure you have Docker and Docker Compose installed.

```bash
# From project root
docker-compose up --build
```

> This starts:
> - `server`: Node.js API
> - `mongodb`: NoSQL database
> - `redis`: Cache/store for sessions, etc.

To stop:
```bash
docker-compose down
```

---

### 🌐 Frontend (React)

Open a new terminal tab:

```bash
cd client
npm install
npm run dev
```

Frontend will be running at:  
👉 `http://localhost:5173`

---

## 🧪 API Testing

Once the backend is running, you can test APIs using tools like:
- [Postman](https://www.postman.com/)
- [Thunder Client](https://www.thunderclient.com/) (VS Code extension)

API Base URL: `http://localhost:4000/`

---

## 🧰 Tech Stack

### Frontend:
- React
- Custom CSS
- React Redux toolkit
- React Redux Query

### Backend:
- Node.js + Express
- MongoDB
- Redis
- Docker + Docker Compose

---

## 🧪 Features

- ✅ User authentication (JWT-based)
- 🛒 Product listing & cart
- 📦 Order creation
- 🔐 Admin dashboard
- ⚙️ Dockerized services
- And many more !!

---

## 🧑‍💻 Developer Scripts

In project root (optional):

```bash
npm run dev         # Run both frontend and backend together
npm run dev:client  # Run only frontend
npm run dev:server  # Run only backend
```

> Requires:  
> `npm install -D concurrently` and a root-level `package.json`

---

## 🤝 Contributing

### Branch Strategy:
- `main`: Stable production
- `dev`: Active development
- Feature branches: `feature/something`

### Workflow:
1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## ✨ Credits

Built with ❤️ by [@abdullah-super](https://github.com/abdullah-super) and [@fireaxelottle](https://github.com/fireaxelottle).
