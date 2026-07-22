# 🌱 Eco Spark Hub – SERVER

EcoSpark Hub is a global crowdfunding platform for environmental innovation, where verified eco-friendly ideas are reviewed by administrators, funded by the community, implemented by their creators, and archived as successful environmental impact projects.

- **[LIVE LINK](https://eco-spark-hub-client.vercel.app)**
- **[CLIENT REPOSITORY](https://github.com/Captain-Kanak/eco-spark-hub-client)**

---

## 📌 Overview

This backend system powers a structured environmental incubator:

- Unified Authentication: Powered by Better Auth for secure, session-based identity management.
- Role-Based Access Control (RBAC): Distinct permissions for ADMIN and MEMBER.
- Innovation Taxonomy: Only Admins can define the global environmental sectors (Categories).
- Project Inventory: Innovators (MEMBER) manage their own project blueprints, funding goals, and pricing.
- Transactional Funding: Atomic "Impact Purchase" process using Prisma Transactions to ensure data integrity between orders and project availability.
- Clean Architecture: Modular service-controller pattern built with TypeScript and Express.

---

## 🛠 Technology Stack

- Runtime: Node.js
- Language: TypeScript
- Framework: Express.js
- Database: PostgreSQL (Neon DB)
- ORM: Prisma
- Authentication: Better Auth & JWT

---

## 🔐 Authentication & Authorization

### Better Auth Integration

The system utilizes Better Auth for modern security:

- Session Management: Secure server-side sessions.
- Role Injection: User roles are baked into the session metadata for low-latency authorization.
- Cross-Origin Security: Built-in protection against CSRF and session hijacking.

### Role-Based Access Control (RBAC)

- ADMIN – Manage Eco-Categories, Global User Audit, Platform Analytics, Inventory Oversight.
- MEMBER – Create/Update/Delete own Ideas, Track Sales/Funding, Manage Project Status.

---

## 🔒 Security Considerations

- Atomic Transactions: Project capacity is adjusted using prisma.$transaction to prevent over-funding beyond project limits.
- Price Integrity: Contribution totals are validated against the DB to prevent frontend price manipulation.
- Unique Constraints: @@unique([name, categoryId]) prevents duplicate innovation entries within the same sector.
- Security Headers: Better Auth handles secure cookie management and session validation.

---

## 🗄️ Database Schema

- **[Details](https://github.com/Captain-Kanak/eco-spark-hub-server/blob/main/DATABASE.md)**

---

## 🔗 API Endpoints

- **[Details](https://github.com/Captain-Kanak/eco-spark-hub-server/blob/main/API_DOCS.md)**

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

**Kanak Ray**

> Software Engineer

- (TypeScript | Express.js | PostgreSQL | Docker | GO | Echo)

---

## 📄 License

This project is intended for educational and demonstration purposes.

> This README file was initially generated with AI assistance and has been reviewed, customized, and modified by me to accurately reflect the project's implementation, features, and documentation.
