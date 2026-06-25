# 🔗 API Endpoints

### Authentication (Managed by Better Auth)

| Method | Endpoint                   | Access | Description                    |
| ------ | -------------------------- | ------ | ------------------------------ |
| POST   | /api/v1/auth/register      | PUBLIC | register new user              |
| POST   | /api/v1/auth/verify-email  | PUBLIC | verify user email              |
| POST   | /api/v1/auth/login         | PUBLIC | log in verified user           |
| GET    | /api/v1/auth//login/google | PUBLIC | google login by api call       |
| GET    | /api/v1/auth/get-me        | SECURE | get user data by session token |

---

### User

| Method | Endpoint             | Access | Description                     |
| ------ | -------------------- | ------ | ------------------------------- |
| GET    | /api/v1/users        | ADMIN  | get all users                   |
| PATCH  | /api/v1/users/update | SECURE | update user informations        |
| DELETE | /api/v1/users/:id    | ADMIN  | delete user by id (soft delete) |

---

### Category

| Method | Endpoint               | Access | Description                         |
| ------ | ---------------------- | ------ | ----------------------------------- |
| POST   | /api/v1/categories     | ADMIN  | create a new category               |
| GET    | /api/v1/categories     | PUBLIC | get all categories                  |
| GET    | /api/v1/categories/:id | PUBLIC | get category by id                  |
| PATCH  | /api/v1/categories/:id | ADMIN  | update category by id               |
| DELETE | /api/v1/categories/:id | ADMIN  | delete category by id (soft delete) |

---

### Idea

| Method | Endpoint                             | Access         | Description                       |
| ------ | ------------------------------------ | -------------- | --------------------------------- |
| POST   | /api/v1/ideas                        | MEMBER         | create as new idea                |
| GET    | /api/v1/ideas/pending-ideas          | ADMIN          | get all pending ideas             |
| GET    | /api/v1/ideas                        | PUBLIC         | get all ideas                     |
| GET    | /api/v1/ideas/:id                    | PUBLIC         | get idea by id                    |
| PATCH  | /api/v1/ideas/:id                    | MEMBER         | update idea by id                 |
| PATCH  | /api/v1/ideas/update-idea-status/:id | ADMIN          | update idea status by id          |
| GET    | /api/v1/ideas/my-ideas               | MEMBER         | get user specific ideas           |
| GET    | /api/v1/ideas/purchased-ideas        | MEMBER         | get user specific purchased ideas |
| DELETE | /api/v1/ideas/:id                    | MEMBER / ADMIN | delete idea by id (soft delete)   |

---

### Payment

| Method | Endpoint                               | Access | Description           |
| ------ | -------------------------------------- | ------ | --------------------- |
| POST   | /api/v1/payments/create-payment-intent | MEMBER | Create Payment Intent |
| POST   | /api/v1/payments/confirm-payment       | MEMBER | Confirm Payment       |

---
