# 🗄️ Database Schema

**[ERD LINK](https://drive.google.com/file/d/1j3ANDqFYj20Nu6VDs8lQYnDMitSW76Z5/view)**

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
| ecoPoints     | Int (0)          |
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
| ACTIVE   | Active user   |
| INACTIVE | Inactive user |

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

| Field            | Description      |
| ---------------- | ---------------- |
| id               | UUID (PK)        |
| title            | String (unique)  |
| slug             | String (unique)  |
| image            | String?          |
| description      | String           |
| problemStatement | String           |
| proposedSolution | String           |
| expectedImpact   | String           |
| estimatedBudget  | Int (0)          |
| fundingGoal      | Int (0)          |
| currentFunding   | Int (0)          |
| location         | String           |
| status           | IdeaStatus       |
| likes            | Int              |
| views            | Int              |
| categoryId       | UUID (FK)        |
| userId           | UUID (FK)        |
| createdAt        | DateTime (now()) |
| updatedAt        | DateTime         |
| deletedAt        | DateTime?        |

**IdeaStatus**

| Value       | Description                      |
| ----------- | -------------------------------- |
| DRAFT       | Idea is being prepared           |
| ON_REVIEW   | Idea is pending for admin review |
| PUBLISHED   | Visible to everyone              |
| FUNDING     | Idea is available for funding    |
| IN_PROGRESS | Currently under implementation   |
| COMPLETED   | Successfully completed           |
| ARCHIVED    | Idea into archived list          |
| REJECTED    | Rejected by moderators           |

## IdeaImage

| Field     | Description      |
| --------- | ---------------- |
| id        | UUID (PK)        |
| ideaId    | UUID (FK)        |
| url       | String           |
| createdAt | DateTime (now()) |
| updatedAt | DateTime         |
| deletedAt | DateTime?        |

## Donation

| Field         | Description      |
| ------------- | ---------------- |
| id            | UUID (PK)        |
| ideaId        | UUID (FK)        |
| userId        | UUID (FK)        |
| amount        | Float            |
| paymentMethod | String           |
| transactionId | String           |
| status        | PaymentStatus    |
| createdAt     | DateTime (now()) |
| updatedAt     | DateTime         |
| deletedAt     | DateTime?        |

**PaymentStatus**

| Value  | Description |
| ------ | ----------- |
| PAID   | paid        |
| UNPAID | unpaid      |
