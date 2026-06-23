# 🔗 API Endpoints

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
