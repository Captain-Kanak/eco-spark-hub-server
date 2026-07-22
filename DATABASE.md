# 🗄️ Database Schema

**[ERD LINK](https://drive.google.com/file/d/1j3ANDqFYj20Nu6VDs8lQYnDMitSW76Z5/view)**

## User (Managed by Better Auth)

| Field         | Type             | Description                                            |
| ------------- | ---------------- | ------------------------------------------------------ |
| id            | UUID (PK)        | Unique identifier for the user.                        |
| name          | String           | User's full name.                                      |
| email         | String (Unique)  | User's email address.                                  |
| emailVerified | Boolean (false)  | Indicates whether the email address has been verified. |
| image         | String?          | Profile image URL.                                     |
| phone         | String?          | User's contact number.                                 |
| address       | String?          | User's residential or mailing address.                 |
| dateOfBirth   | Date?            | User's date of birth.                                  |
| role          | UserRole         | User's role within the platform.                       |
| status        | UserStatus       | User's current account status.                         |
| ecoPoints     | Int (0)          | Reward points earned through platform activities.      |
| createdAt     | DateTime (now()) | Timestamp when the account was created.                |
| updatedAt     | DateTime         | Timestamp of the last account update.                  |
| deletedAt     | DateTime?        | Soft delete timestamp (if applicable).                 |

### UserRole

| Value | Description                                                                |
| ----- | -------------------------------------------------------------------------- |
| ADMIN | Platform administrator with full system access.                            |
| USER  | Registered user who can create ideas, donate, and participate in projects. |

### UserStatus

| Value   | Description                                                     |
| ------- | --------------------------------------------------------------- |
| ACTIVE  | User account is active and can access all permitted features.   |
| BLOCKED | User account is disabled or restricted from using the platform. |

---

## Category

| Field       | Type             | Description                                               |
| ----------- | ---------------- | --------------------------------------------------------- |
| id          | UUID (PK)        | Unique identifier for the category.                       |
| name        | String (Unique)  | Category name (e.g., Renewable Energy, Waste Management). |
| slug        | String (Unique)  | URL-friendly unique identifier for the category.          |
| icon        | String?          | Category icon or image URL.                               |
| description | String?          | Brief description of the category.                        |
| createdAt   | DateTime (now()) | Timestamp when the category was created.                  |
| updatedAt   | DateTime         | Timestamp of the last category update.                    |
| deletedAt   | DateTime?        | Soft delete timestamp (if applicable).                    |

---

## Idea

| Field            | Type             | Description                                   |
| ---------------- | ---------------- | --------------------------------------------- |
| id               | UUID (PK)        | Unique identifier for the idea.               |
| categoryId       | UUID (FK)        | References the associated category.           |
| userId           | UUID (FK)        | References the creator of the idea.           |
| title            | String           | Title of the environmental idea.              |
| slug             | String (Unique)  | URL-friendly unique identifier.               |
| coverImage       | String?          | Cover image URL for the idea.                 |
| description      | Text             | Detailed description of the idea.             |
| problemStatement | Text             | Environmental problem the idea aims to solve. |
| proposedSolution | Text             | Proposed solution for addressing the problem. |
| expectedImpact   | Text             | Expected environmental and social impact.     |
| estimatedBudget  | Decimal (0)      | Estimated implementation cost in USD.         |
| fundingGoal      | Decimal (0)      | Total funding goal in USD.                    |
| currentFunding   | Decimal (0)      | Total amount raised in USD.                   |
| location         | String           | Project implementation location.              |
| status           | IdeaStatus       | Current lifecycle status of the idea.         |
| likes            | Int (0)          | Total number of likes.                        |
| views            | Int (0)          | Total number of views.                        |
| createdAt        | DateTime (now()) | Timestamp when the idea was created.          |
| updatedAt        | DateTime         | Timestamp of the last update.                 |
| deletedAt        | DateTime?        | Soft delete timestamp (if applicable).        |

### IdeaStatus

| Value       | Description                                           |
| ----------- | ----------------------------------------------------- |
| DRAFT       | Idea is being prepared by the creator.                |
| ON_REVIEW   | Submitted and awaiting administrator review.          |
| PUBLISHED   | Approved and publicly visible for donations.          |
| IN_PROGRESS | Funding goal achieved and implementation has started. |
| COMPLETED   | Implementation has been successfully completed.       |
| ARCHIVED    | Completed project archived for historical reference.  |
| REJECTED    | Rejected by the administrator during review.          |

---

## IdeaUpdate

| Field              | Type             | Description                                      |
| ------------------ | ---------------- | ------------------------------------------------ |
| id                 | UUID (PK)        | Unique identifier for the progress update.       |
| ideaId             | UUID (FK)        | References the related idea.                     |
| title              | String           | Title of the update.                             |
| content            | Text             | Detailed progress description.                   |
| progressPercentage | Int?             | Overall project progress (0–100).                |
| createdBy          | UUID (FK)        | References the creator who published the update. |
| createdAt          | DateTime (now()) | Timestamp when the update was published.         |
| updatedAt          | DateTime         | Timestamp of the last update.                    |
| deletedAt          | DateTime?        | Soft delete timestamp (if applicable).           |

---

## IdeaUpdateImage

| Field        | Type             | Description                            |
| ------------ | ---------------- | -------------------------------------- |
| id           | UUID (PK)        | Unique identifier for the image.       |
| ideaUpdateId | UUID (FK)        | References the related idea update.    |
| imageUrl     | String           | Uploaded image URL.                    |
| createdAt    | DateTime (now()) | Timestamp when the image was uploaded. |

---

## Donation

| Field            | Type             | Description                                                        |
| ---------------- | ---------------- | ------------------------------------------------------------------ |
| id               | UUID (PK)        | Unique identifier for the donation.                                |
| ideaId           | UUID (FK)        | References the idea receiving the donation.                        |
| userId           | UUID (FK)        | References the user who made the donation.                         |
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

---
