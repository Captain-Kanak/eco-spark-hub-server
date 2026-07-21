# 🗄️ Database Schema

**[ERD LINK](https://drive.google.com/file/d/1j3ANDqFYj20Nu6VDs8lQYnDMitSW76Z5/view)**

### IdeaStatus

| Value         | Description                    |
| ------------- | ------------------------------ |
| `DRAFT`       | Idea is being prepared         |
| `PUBLISHED`   | Visible to everyone            |
| `IN_PROGRESS` | Currently under implementation |
| `COMPLETED`   | Successfully completed         |
| `REJECTED`    | Rejected by moderators         |

### FundingStatus

| Value      | Description         |
| ---------- | ------------------- |
| `PENDING`  | Waiting for payment |
| `SUCCESS`  | Payment completed   |
| `FAILED`   | Payment failed      |
| `REFUNDED` | Payment refunded    |

## User (Manage by Better Auth)

| Field         | Description      |
| ------------- | ---------------- |
| id            | UUID (PK)        |
| name          | String           |
| email         | String (unique)  |
| emailVerified | Boolean (false)  |
| image         | String?          |
| phone         | String?          |
| address       | String?          |
| dateOfBirth   | DateTime?        |
| role          | UserRole         |
| status        | UserStatus       |
| createdAt     | DateTime (now()) |
| updatedAt     | DateTime         |
| deletedAt     | DateTime?        |

**UserRole**

| Value | Description            |
| ----- | ---------------------- |
| ADMIN | Platform administrator |
| USER  | Regular user           |

**UserStatus**

| Value    | Description   |
| -------- | ------------- |
| ACTIVE   | active user   |
| INACTIVE | inactive user |

## Category

| Field       | Description      |
| ----------- | ---------------- |
| id          | UUID (PK)        |
| name        | String (unique)  |
| slug        | String (unique)  |
| icon        | String?          |
| description | String?          |
| createdAt   | DateTime (now()) |
| updatedAt   | DateTime         |
| deletedAt   | DateTime?        |

## Idea

| Field            | Description                   |
| ---------------- | ----------------------------- |
| id               | UUID (PK)                     |
| title            | String (unique)               |
| slug             | String (unique)               |
| description      | String                        |
| problemStatement | String                        |
| solution         | String                        |
| expectedImpact   | String                        |
| estimatedBudget  | Int                           |
| location         | String                        |
| image            | String?                       |
| status           | PENDING / APPROVED / REJECTED |
| likes            | Int                           |
| views            | Int                           |
| categoryId       | String (FK)                   |
| userId           | String (FK)                   |
| createdAt        | DateTime (now())              |
| updatedAt        | DateTime                      |
| deletedAt        | DateTime?                     |

## Payment

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
