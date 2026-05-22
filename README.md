# 🏋️ FitMetric Pro Backend

<div align="center">

<img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1400&auto=format&fit=crop" width="100%" alt="FitMetric Banner"/>

<br/>
<br/>

### 🚀 Production-Ready Health & Fitness REST API

Built with **Spring Boot 3.2**, **Java 21**, **PostgreSQL**, and **Google Gemini AI**

<br/>

[![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Powered-purple?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

# 📖 Overview

**FitMetric Pro Backend** is a modern and scalable REST API designed for advanced health and fitness tracking applications.

The platform provides:

- ⚖️ Weight tracking
- 🍎 Nutrition monitoring
- 💧 Water intake logging
- 📏 Body measurement tracking
- 💊 Supplement management
- 🥗 AI-powered meal planning
- 📊 Health analytics
- 🤖 Gemini AI health assistant

Built using enterprise-grade technologies including **Spring Boot 3.2**, **Java 21**, and **PostgreSQL**.

---

# ✨ Features

## 🔐 Authentication & Authorization
- JWT Authentication
- Role-based access (`FREE` / `PREMIUM`)
- BCrypt password hashing
- Secure API endpoints

---

## ⚖️ Weight Tracking
- Morning & evening logs
- Weight streak calculations
- Historical trend analytics

---

## 🍽 Nutrition Tracking
- Daily calorie tracking
- Macronutrient breakdown
  - Protein
  - Carbs
  - Fat

---

## 💧 Water Intake
- Hydration goals
- Daily intake monitoring

---

## 📏 Body Measurements
Track:
- Waist
- Chest
- Arms
- Thighs
- Hips
- Neck

---

## 💊 Supplement Management
- Daily supplement tracking
- Supplement stack management
- Adherence monitoring

---

## 🥗 Meal Planning *(Premium)*
- AI-generated meal plans
- Shopping list generation
- Weekly nutrition planning

---

## 🤖 AI Features *(Premium)*

### 🍔 Food Analysis
Convert food descriptions into nutritional values.

### 🏷 Label Scanner
Extract nutrition facts from food label images.

### 🧠 Health Insights
Personalized recommendations based on user data.

### 💬 AI Chat Assistant
Conversational AI powered by **Google Gemini AI**.

---

# 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|----------|----------|
| Java | 21 | Core Language |
| Spring Boot | 3.2.0 | Backend Framework |
| Spring Security | 6.2.0 | Security |
| Spring Data JPA | 3.2.0 | ORM |
| PostgreSQL | 16 | Database |
| JWT | 0.12.3 | Authentication |
| Maven | 3.9+ | Build Tool |
| Lombok | 1.18.30 | Boilerplate Reduction |
| Gemini AI | 1.5 Pro | AI Integration |

---

# 📂 Project Structure

```text
fitmetric-backend/
│
├── src/
│   ├── main/
│   │   ├── java/com/fitmetric/
│   │   │
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── security/
│   │   ├── service/
│   │   └── util/
│   │
│   └── resources/
│       ├── application.yml
│       └── db/migration/
│
├── pom.xml
└── README.md
```

---

# ⚙️ Prerequisites

Before running the project, ensure you have:

- ☕ JDK 21+
- 📦 Maven 3.9+
- 🐘 PostgreSQL 16+
- 🌐 Git

---

# 🚀 Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/fitmetric-backend.git

cd fitmetric-backend
```

---

# 🐘 Configure PostgreSQL

## Option A — Local Database

```sql
CREATE DATABASE fitmetric;

CREATE USER fitmetric_user
WITH PASSWORD 'your_password';

GRANT ALL PRIVILEGES
ON DATABASE fitmetric
TO fitmetric_user;
```

---

## Option B — Supabase

1. Create a Supabase account
2. Create a project
3. Get PostgreSQL connection string

---

# ⚙️ Configure Application

Update:

```text
src/main/resources/application.yml
```

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/fitmetric
    username: postgres
    password: password

jwt:
  secret: your-super-secret-key
  expiration: 86400000

gemini:
  api:
    key: your-gemini-api-key
```

---

# 🌍 Environment Variables

```bash
export DB_URL=jdbc:postgresql://localhost:5432/fitmetric

export DB_USERNAME=postgres

export DB_PASSWORD=password

export JWT_SECRET=your-secret-key

export GEMINI_API_KEY=your-api-key
```

---

# ▶️ Running the Application

## Build Project

```bash
mvn clean install
```

## Run Server

```bash
mvn spring-boot:run
```

Server starts at:

```text
http://localhost:5000
```

---

# 🔑 Authentication Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/auth/signup` | Register User |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/upgrade` | Upgrade Premium |

---

# ⚖️ Weight Tracking Endpoints

| Method | Endpoint |
|--------|-----------|
| POST | `/api/weight/log` |
| GET | `/api/weight/logs` |
| GET | `/api/weight/latest` |
| DELETE | `/api/weight/log/{id}` |

---

# 🍽 Nutrition Endpoints

| Method | Endpoint |
|--------|-----------|
| POST | `/api/nutrition/log` |
| GET | `/api/nutrition/logs` |
| GET | `/api/nutrition/date` |
| DELETE | `/api/nutrition/log/{id}` |

---

# 💧 Water Tracking Endpoints

| Method | Endpoint |
|--------|-----------|
| POST | `/api/water/log` |
| GET | `/api/water/logs` |
| GET | `/api/water/today` |
| DELETE | `/api/water/log/{id}` |

---

# 📏 Measurement Endpoints

| Method | Endpoint |
|--------|-----------|
| POST | `/api/measurements` |
| GET | `/api/measurements` |
| GET | `/api/measurements/latest` |
| DELETE | `/api/measurements/{id}` |

---

# 💊 Supplement Endpoints

| Method | Endpoint |
|--------|-----------|
| POST | `/api/supplements` |
| GET | `/api/supplements` |
| POST | `/api/supplements/{id}/log` |
| GET | `/api/supplements/today` |
| DELETE | `/api/supplements/{id}` |

---

# 🤖 AI Endpoints

| Method | Endpoint | Access |
|--------|-----------|---------|
| POST | `/api/gemini/analyze-food` | Public |
| POST | `/api/gemini/scan-label` | Public |
| GET | `/api/gemini/insights` | Premium |
| POST | `/api/gemini/chat` | Premium |
| POST | `/api/gemini/suggest-meal-plan` | Premium |

---

# 📊 Analytics Endpoints

| Method | Endpoint |
|--------|-----------|
| GET | `/api/analytics` |
| GET | `/api/analytics/weight-trend` |
| GET | `/api/analytics/calorie-trend` |

---

# 📬 API Examples

## 🔐 Register User

```bash
curl -X POST http://localhost:5000/api/auth/signup \
-H "Content-Type: application/json" \
-d '{
  "email":"user@example.com",
  "password":"password123",
  "name":"John Doe"
}'
```

---

## 🔓 Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email":"user@example.com",
  "password":"password123"
}'
```

---

## ⚖️ Add Weight Log

```bash
curl -X POST http://localhost:5000/api/weight/log \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN" \
-d '{
  "weight":75.5,
  "date":"2026-05-22",
  "timeOfDay":"MORNING"
}'
```

---

# 🗄 Database Tables

Main tables include:

- `users`
- `user_profiles`
- `weight_logs`
- `nutrition_logs`
- `water_logs`
- `measurements`
- `supplements`
- `supplement_logs`
- `meal_plans`
- `reminders`

---

# 🧪 Testing

## Run All Tests

```bash
mvn test
```

## Run Specific Test

```bash
mvn test -Dtest=UserServiceTest
```

## Generate Coverage Report

```bash
mvn test jacoco:report
```

---

# 🐳 Docker Support

## Dockerfile

```dockerfile
FROM openjdk:21-jdk-slim

COPY target/fitmetric-backend-1.0.0.jar app.jar

EXPOSE 5000

ENTRYPOINT ["java", "-jar", "/app.jar"]
```

---

## Build Docker Image

```bash
docker build -t fitmetric-backend .
```

## Run Docker Container

```bash
docker run -p 5000:5000 \
-e DB_URL=jdbc:postgresql://host.docker.internal:5432/fitmetric \
-e DB_USERNAME=postgres \
-e DB_PASSWORD=password \
-e JWT_SECRET=your-secret-key \
fitmetric-backend
```

---

# ⚡ Performance Optimizations

- HikariCP connection pooling
- Indexed database queries
- Lazy loading relationships
- Response compression
- Optional Redis caching

---

# 🛡 Security

- JWT Authentication
- BCrypt hashing
- SQL injection protection
- Secure API headers
- Role-based access control

---

# ❌ Error Response Example

```json
{
  "timestamp": "2026-05-22T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Email already registered",
  "path": "/api/auth/signup"
}
```

---

# 🤝 Contributing

Contributions are welcome!

```bash
# Create branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m "Add amazing feature"

# Push changes
git push origin feature/amazing-feature
```

Then open a Pull Request 🚀

---

# 📄 License

Licensed under the **MIT License**.

---

# 👨‍💻 Author

### FitMetric Team

📧 support@fitmetric.com  
🌐 https://fitmetric.com

---

# 🙏 Acknowledgments

Special thanks to:

- Spring Boot
- Google Gemini AI
- PostgreSQL
- Supabase
- JJWT

---

<div align="center">

## ❤️ Made for Fitness Enthusiasts

⭐ Star this repository if you found it useful!

</div>
