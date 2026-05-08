# 🌱 EcoSpark-Hub – SERVER

A high-integrity, multi-role backend built for a specialized Environmental Innovation Marketplace. This system enables Admins to curate eco-categories, Innovators to list sustainable solutions, and Supporters to fund projects and leave impact reviews with real-time tracking of project availability.

---

## 📌 Overview

This backend system powers a structured environmental incubator:

- Unified Authentication: Powered by Better Auth for secure, session-based identity management.
- Role-Based Access Control (RBAC): Distinct permissions for ADMIN, INNOVATOR, and SUPPORTER.
- Innovation Taxonomy: Only Admins can define the global environmental sectors (Categories).
- Project Inventory: Innovators manage their own project blueprints, funding goals, and pricing.
- Transactional Funding: Atomic "Impact Purchase" process using Prisma Transactions to ensure data integrity between orders and project availability.
- Clean Architecture: Modular service-controller pattern built with TypeScript and Express.

---

## 🛠 Technology Stack

- Runtime: Node.js & TypeScript
- Framework: Express.js
- Database: PostgreSQL (Neon DB)
- ORM: Prisma
- Authentication: Better Auth

---

## 🔐 Authentication & Authorization

### Better Auth Integration

The system utilizes Better Auth for modern security:

- Session Management: Secure server-side sessions.
- Role Injection: User roles are baked into the session metadata for low-latency authorization.
- Cross-Origin Security: Built-in protection against CSRF and session hijacking.

### Role-Based Access Control (RBAC)

- ADMIN – Manage Eco-Categories, Global User Audit, Platform Analytics, Inventory Oversight.
- MEMBER – Create/Update/Delete own Project Ideas, Track Sales/Funding, Manage Project Status.

---

## 🔒 Security Considerations

- Atomic Transactions: Project capacity/stock is adjusted using prisma.$transaction to prevent over-funding beyond project limits.
- Price Integrity: Contribution totals are validated against the DB to prevent frontend price manipulation.
- Unique Constraints: @@unique([name, categoryId]) prevents duplicate innovation entries within the same sector.
- Security Headers: Better Auth handles secure cookie management and session validation.

---

## 🗄️ Database Schema

**ERD Link:** [ERD Link](https://drive.google.com/file/d/1j3ANDqFYj20Nu6VDs8lQYnDMitSW76Z5/view)

### User

| Field         | Description       |
| ------------- | ----------------- |
| id            | UUID (PK)         |
| name          | String            |
| email         | String (unique)   |
| emailVerified | Boolean (false)   |
| image         | String?           |
| role          | ADMIN / MEMBER    |
| status        | ACTIVE / DEACTIVE |
| phone         | String?           |
| address       | String?           |
| date_of_birth | DateTime?         |
| isDeleted     | Boolean (false)   |
| deletedAt     | DateTime?         |
| createdAt     | DateTime (now())  |
| updatedAt     | DateTime          |

### Category

| Field       | Description      |
| ----------- | ---------------- |
| id          | UUID (PK)        |
| name        | String (unique)  |
| icon        | String?          |
| description | String?          |
| isDeleted   | Boolean (false)  |
| deletedAt   | DateTime?        |
| createdAt   | DateTime (now()) |
| updatedAt   | DateTime         |

### Idea

| Field            | Description                   |
| ---------------- | ----------------------------- |
| id               | UUID (PK)                     |
| title            | String (unique)               |
| description      | String                        |
| problemStatement | String                        |
| solution         | String                        |
| image            | String?                       |
| isPaid           | Boolean (false)               |
| price            | Float?                        |
| status           | PENDING / APPROVED / REJECTED |
| adminFeedback    | String?                       |
| upvotes          | Int                           |
| downvotes        | Int                           |
| categoryId       | String (FK)                   |
| userId           | String (FK)                   |
| isDeleted        | Boolean (false)               |
| deletedAt        | DateTime?                     |
| createdAt        | DateTime (now())              |
| updatedAt        | DateTime                      |

### Payment

| Field         | Description      |
| ------------- | ---------------- |
| id            | UUID (PK)        |
| amount        | Float            |
| transactionId | String           |
| status        | PAID / UNPAID    |
| paymentMethod | String           |
| ideaId        | String (FK)      |
| userId        | String (FK)      |
| isDeleted     | Boolean (false)  |
| deletedAt     | DateTime?        |
| createdAt     | DateTime (now()) |
| updatedAt     | DateTime         |

---

## 🔗 API Endpoints

### Authentication (Managed by Better Auth)

| Method | Endpoint                  | Access | Description           |
| ------ | ------------------------- | ------ | --------------------- |
| POST   | /api/v1/auth/register     | Public | Sign Up User          |
| POST   | /api/v1/auth/verify-email | Public | Verify User Email     |
| POST   | /api/v1/auth/login        | Public | Sign In Verified User |

---

### User

| Method | Endpoint                     | Access         | Description                     |
| ------ | ---------------------------- | -------------- | ------------------------------- |
| GET    | /api/v1/users/get-users      | ADMIN          | Get All Users                   |
| PATCH  | /api/v1/users/update-profile | Logged in User | Update User Information         |
| DELETE | /api/v1/users/:id            | ADMIN          | Delete User by id (soft delete) |

---

### Category

| Method | Endpoint               | Access | Description                         |
| ------ | ---------------------- | ------ | ----------------------------------- |
| POST   | /api/v1/categories     | ADMIN  | Create Category                     |
| GET    | /api/v1/categories     | Public | Get all Categories                  |
| GET    | /api/v1/categories/:id | Public | Get Category by id                  |
| PATCH  | /api/v1/categories/:id | ADMIN  | Update Category by id               |
| DELETE | /api/v1/categories/:id | ADMIN  | Delete Category by id (soft delete) |

---

### Medicine

| Method | Endpoint                             | Access         | Description                       |
| ------ | ------------------------------------ | -------------- | --------------------------------- |
| POST   | /api/v1/ideas                        | MEMBER         | Add new Idea                      |
| GET    | /api/v1/ideas                        | Public         | Get all Ideas                     |
| GET    | /api/v1/ideas/pending-ideas          | ADMIN          | Get all pending Ideas             |
| GET    | /api/v1/ideas/my-ideas               | MEMBER         | Get user specific Ideas           |
| GET    | /api/v1/ideas/purchased-ideas        | MEMBER         | Get user specific purchased Ideas |
| GET    | /api/v1/ideas/:id                    | Public         | Get Idea by id                    |
| PATCH  | /api/v1/ideas/:id                    | MEMBER         | Update Idea by id                 |
| PATCH  | /api/v1/ideas/update-idea-status/:id | ADMIN          | Update Idea status by id          |
| DELETE | /api/v1/ideas/:id                    | SELLER / ADMIN | Delete Idea by id (soft delete)   |

---

### Payment

| Method | Endpoint                               | Access | Description           |
| ------ | -------------------------------------- | ------ | --------------------- |
| POST   | /api/v1/payments/create-payment-intent | MEMBER | Create Payment Intent |
| POST   | /api/v1/payments/confirm-payment       | MEMBER | Confirm Payment       |

---

## ⚙️ Installation & Setup

Prerequisites:

- Node.js (v20.19+)
- PostgreSQL / (Neon DB)
- pnpm

Clone Repository:

```bash
git clone https://github.com/Captain-Kanak/eco-spark-hub-server
cd eco-spark-hub-server
```

Install Dependencies:

```bash
pnpm install
```

Environment Variables:
Create a `.env` file in the root of your project and add the following:

```env
NODE_ENV="development"
PORT="5000"
DATABASE_URL='database-url'
FRONTEND_URL="http://localhost:3000"
BETTER_AUTH_URL="http://localhost:5000"
BETTER_AUTH_SECRET="better-auth-secret"
BETTER_AUTH_SESSION_EXPIRES_IN="1d"
BETTER_AUTH_SESSION_UPDATE_AGE="7 days"
EMAIL_SENDER_SMTP_USER="email-sender-smtp-user"
EMAIL_SENDER_SMTP_PASS="email-sender-smtp-pass"
EMAIL_SENDER_SMTP_HOST="smtp.gmail.com"
EMAIL_SENDER_SMTP_PORT="465"
EMAIL_SENDER_SMTP_FROM="Eco Spark Hub <email-sender-smtp-user>"
STRIPE_SECRET_KEY="stripe-secret-key"
GOOGLE_CLIENT_ID="google-client-id"
GOOGLE_CLIENT_SECRET="google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/callback/google"
CLOUDINARY_CLOUD_NAME="cloudinary-cloud-name"
CLOUDINARY_API_KEY="cloudinary-api-key"
CLOUDINARY_API_SECRET="cloudinary-api-secret"
```

---

Run Prisma:

```bash
npx prisma migrate dev
npx prisma generate
```

---

Start Server:

```bash
pnpm dev
```

---

## 👤 Author

- Kanak Ray
- Full Stack Developer
- (Node.js · Express.js · TypeScript · PostgreSQL · Prisma)

---

## 📄 License

This project is intended for educational and demonstration purposes.
