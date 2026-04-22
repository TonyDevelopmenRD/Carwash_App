# 🚗 Car Wash API

A **RESTful API** for managing a car wash service.
Built with **FastAPI**, **SQLAlchemy**, and **MySQL**, fully containerized using **Docker**.

This API allows managing:

* Roles
* Users
* Clients
* Vehicles
* Services

---

# 🚀 Running the Project

You can run this project in two ways:

---

## 🔹 Option 1 — Run with Docker (Recommended)

This is the easiest and most professional way.

### 1️⃣ Requirements

Make sure you have installed:

* Docker
* Docker Compose

### 2️⃣ Start the project

```bash
docker-compose up --build
```

If you want to reset the database:

```bash
docker-compose down -v
docker-compose up --build
```

### 3️⃣ Access the API

Swagger documentation:

```
http://localhost:8000/docs
```

---

## 🐳 What Docker Does

* Creates a MySQL 8 container
* Creates a FastAPI container
* Connects both containers through Docker network
* Injects environment variables from `.env`
* Automatically creates database tables

---

## 🔹 Option 2 — Run Locally (Without Docker)

### 1️⃣ Create virtual environment

```bash
python3 -m venv venv
```

### 2️⃣ Activate it

**Windows**

```bash
venv\Scripts\activate
```

**Mac/Linux**

```bash
source venv/bin/activate
```

### 3️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Configure environment variables

Create a `.env` file:

```
SECRET_KEY=your_secret_key

DB_USER=root
DB_PASSWORD=1234
DB_NAME=db_car_wash
DB_HOST=127.0.0.1
DB_PORT=3307
```

Make sure you have a running MySQL server locally.

### 5️⃣ Run the app

```bash
uvicorn main:app --reload
```

---

# ⚙️ Environment Variables

The project uses the following environment variables:

| Variable    | Description       |
| ----------- | ----------------- |
| SECRET_KEY  | JWT secret key    |
| DB_USER     | Database username |
| DB_PASSWORD | Database password |
| DB_NAME     | Database name     |
| DB_HOST     | Database host     |
| DB_PORT     | Database port     |

When using Docker, these variables are loaded automatically from `.env`.

---

# 🗄️ Project Structure

```
car-wash-api/
│
├── config/          # Database configuration
├── core/            # Core logic (security, JWT, utilities)
├── middlewares/     # Authentication middleware
├── models/          # SQLAlchemy models
├── schemas/         # Pydantic schemas
├── routes/          # API endpoints
├── main.py          # FastAPI entry point
├── init_db.py       # Database initialization script
├── populate_db.py   # Seed data script
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
└── .env
```

---

# 🧠 Technical Stack

* FastAPI
* SQLAlchemy
* MySQL 8
* PyMySQL
* JWT (python-jose)
* Passlib (bcrypt)
* Docker & Docker Compose

---

# 📌 Notes

* MySQL runs internally on port **3306**
* It is exposed externally on port **3307**
* The API runs on port **8000**
* Tables are created automatically on startup

---

### tomorrow

```bash
docker-compose up

```