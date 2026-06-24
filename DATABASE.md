# 🗄️ Database Schema

**[ERD LINK](https://drive.google.com/file/d/1j3ANDqFYj20Nu6VDs8lQYnDMitSW76Z5/view)**

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
