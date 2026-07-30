# 🌱 Eco Spark Hub – SERVER

EcoSpark Hub is a global crowdfunding platform for environmental innovation, where verified eco-friendly ideas are reviewed by administrators, funded by the community, implemented by their creators, and archived as successful environmental impact projects.

- **[LIVE LINK](https://eco-spark-hub-client.vercel.app)**
- **[CLIENT REPOSITORY](https://github.com/Captain-Kanak/eco-spark-hub-client)**

---

## 📌 Overview

EcoSpark Hub is a crowdfunding platform that empowers innovators to turn environmental ideas into real-world projects. Community members can discover and financially support verified eco-friendly ideas, while creators share implementation progress through project updates until completion.

The platform provides secure authentication, role-based access control, donation management, project moderation, and progress tracking to ensure transparency throughout the entire project lifecycle.

---

## ✨ Features

- 🔐 Secure authentication using Better Auth
- 👥 Role-based access control (Admin & Member)
- 🌱 Submit and manage environmental innovation ideas
- 🛡️ Admin review and approval workflow
- 💰 Crowdfunding & donation system with Stripe integration
- 📈 Funding progress tracking
- 📝 Project progress updates with image uploads
- ❤️ Like and comment system
- 📂 Category management
- 🔍 Search, filtering, sorting & pagination
- 📊 Analytics for users and administrators
- 🗑️ Soft delete support for recoverable resources

---

## 🛠 Technology Stack

| Category       | Technology  |
| -------------- | ----------- |
| Runtime        | Node.js     |
| Language       | TypeScript  |
| Framework      | Express.js  |
| Database       | PostgreSQL  |
| ORM            | Prisma      |
| Authentication | Better Auth |
| Validation     | Zod         |
| Payment        | Stripe      |
| File Storage   | Cloudinary  |

---

## 🔐 Authentication & Authorization

### Better Auth Integration

The system utilizes Better Auth for modern security:

- Session Management: Secure server-side sessions.
- Role Injection: User roles are baked into the session metadata for low-latency authorization.
- Cross-Origin Security: Built-in protection against CSRF and session hijacking.

### Role-Based Access Control (RBAC)

**ADMIN**

- Manage users
- Review and approve ideas
- Reject inappropriate submissions
- Manage categories
- Monitor donations
- View platform analytics

**MEMBER**

- Create environmental ideas
- Edit own ideas
- Receive donations
- Publish project updates
- Like and comment on projects
- Track funding progress

---

## 🔒 Security Considerations

- Session-based authentication using Better Auth
- Role-based authorization
- Secure password hashing
- Protected private routes
- Input validation using Zod
- Prisma transactions for payment consistency
- Soft delete support
- Environment variable protection

---

## 🔄 Project Workflow

1. Member submits an environmental idea.
2. Admin reviews the submission.
3. Approved ideas become publicly visible.
4. Community members donate to support the project.
5. Creator publishes implementation updates.
6. Once funding is completed, the project moves into implementation.
7. Finished projects are archived as completed environmental initiatives.

---

## API & Database

### 🗄️ Database Schema

- **[DATABASE.md](https://github.com/Captain-Kanak/eco-spark-hub-server/blob/main/DATABASE.md)**

### 🔗 API Endpoints

- **[API_DOCS.md](https://github.com/Captain-Kanak/eco-spark-hub-server/blob/main/API_DOCS.md)**

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

- **[.env](https://github.com/Captain-Kanak/eco-spark-hub-server/blob/main/.env.example)**

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

### Kanak Ray

Backend Developer

**Tech Stack**

TypeScript • Express.js • PostgreSQL • Prisma • Docker • Go

---

## 📄 License

This project is intended for educational and demonstration purposes.

> This README file was initially generated with AI assistance and has been reviewed, customized, and modified by me to accurately reflect the project's implementation, features, and documentation.
