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
| id               | uuid (PK)        |
| title            | string (unique)  |
| slug             | string (unique)  |
| image            | string?          |
| description      | string           |
| problemStatement | string           |
| proposedSolution | string           |
| expectedImpact   | string           |
| estimatedBudget  | int (0)          |
| fundingGoal      | int (0)          |
| currentFunding   | int (0)          |
| location         | string           |
| status           | IdeaStatus       |
| likes            | int              |
| views            | int              |
| categoryId       | uuid (FK)        |
| userId           | uuid (FK)        |
| createdAt        | DateTime (now()) |
| updatedAt        | DateTime         |
| deletedAt        | DateTime?        |

**IdeaStatus**

| Value       | Description                      |
| ----------- | -------------------------------- |
| DRAFT       | Idea is being prepared           |
| ON_REVIEW   | Idea is pending for admin review |
| PUBLISHED   | Visible to everyone              |
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

| Field            | Type             | Description                                                        |
| ---------------- | ---------------- | ------------------------------------------------------------------ |
| id               | uuid (PK)        | Unique identifier for the donation.                                |
| ideaId           | uuid (FK)        | References the idea receiving the donation.                        |
| userId           | uuid (FK)        | References the user who made the donation.                         |
| originalAmount   | Decimal          | Amount donated in the donor's selected currency.                   |
| originalCurrency | String           | ISO 4217 currency code (e.g., USD, BDT, EUR).                      |
| exchangeRate     | Decimal          | Exchange rate used to convert the donation into the base currency. |
| baseAmount       | Decimal          | Converted donation amount in the platform's base currency (USD).   |
| baseCurrency     | String           | Platform base currency (always `USD`).                             |
| gateway          | PaymentGateway   | Payment gateway used to process the donation.                      |
| paymentMethod    | String           | Payment method used (e.g., Visa, bKash, Nagad).                    |
| transactionId    | String           | Transaction ID returned by the payment gateway.                    |
| status           | PaymentStatus    | Current payment status.                                            |
| createdAt        | DateTime (now()) | Timestamp when the donation record was created.                    |
| updatedAt        | DateTime         | Timestamp of the last update.                                      |
| deletedAt        | DateTime?        | Soft delete timestamp (if applicable).                             |

### PaymentGateway

| Value      | Description                           |
| ---------- | ------------------------------------- |
| STRIPE     | Payment processed through Stripe.     |
| SSLCOMMERZ | Payment processed through SSLCommerz. |

### PaymentStatus

| Value     | Description                                   |
| --------- | --------------------------------------------- |
| PENDING   | Payment has been initiated but not completed. |
| SUCCESS   | Payment was successfully completed.           |
| FAILED    | Payment failed during processing.             |
| CANCELLED | Payment was cancelled by the user or gateway. |
| REFUNDED  | Payment was refunded after completion.        |
