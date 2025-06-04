# Інструкція з запуску проекту

## 📋 Вимоги до системи

Переконайтеся, що у вас встановлені:
- **Node.js** (версія 18+)
- **Yarn**
- **Docker** та **Docker Compose**
- **Git**

### 1️⃣ Клонування репозиторію
```bash
git clone <repository-url>
cd real-time-chat
```

### 2️⃣ Встановлення залежностей
```bash
# Встановлення залежностей для backend
yarn install

# Встановлення залежностей для клієнта
cd apps/client
yarn install
cd ../..
```

### 3️⃣ Налаштування змінних середовища
Створіть файл `.env` в кореневій директорії проекту. Список змінних з прикладами можна побачити в `.env.example`.

### 4️⃣ Запуск інфраструктури
```bash
docker-compose up -d
```

Це запустить:
- 🐘 **PostgreSQL** на порту `5432`
- 🔴 **Redis** на порту `6379`
- 🐰 **RabbitMQ** на портах `5672` (AMQP) та `15672` (Management UI)

### 5️⃣ Запуск backend сервісів
Відкрийте окремі термінали для кожного сервісу:

**Термінал 1 - Auth Service:**
```bash
yarn start:dev auth
```

**Термінал 2 - Chat Service:**
```bash
yarn start:dev chat
```

**Термінал 3 - Gateway Service:**
```bash
yarn start:dev gateway
```

### 6️⃣ Запуск клієнтського додатку
**Термінал 4 - Client:**
```bash
cd apps/client
yarn dev
```

## 🌐 Доступні ресурси

Після успішного запуску ви матимете доступ до:

| Сервіс | URL | Опис |
|--------|-----|------|
| 🖥️ **Frontend** | http://localhost:5173 | Клієнтський додаток |
| 🚪 **Gateway API** | http://localhost:3001 | API Gateway |
| 📚 **Swagger Docs** | http://localhost:3001/docs | API документація |
| 🐰 **RabbitMQ Management** | http://localhost:15672 | Управління чергами (guest/guest) |
