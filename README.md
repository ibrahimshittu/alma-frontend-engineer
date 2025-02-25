# Alma's Lead Management System

## Overview

Alma's Lead Management System is a robust and efficient platform designed to streamline the process of capturing, managing, and tracking leads. This plat provides a seamless experience for both prospects submitting their information and administrators managing lead interactions.

## Technologies Used

- **Next.js 15** - React framework for server-side rendering
- **TypeScript** - Type safety and development efficiency
- **Zod** - Schema validation for forms and API requests
- **TailwindCSS** - Utility-first CSS framework
- **ShadCN/UI** - UI component library
- **Zustand** - Global State management
- **useActionState** - React's server actions
- **JWT (JSON Web Tokens)** - Authentication and authorization
- **bcryptjs** - Password hashing
- **Formidable** - File uploads handling
- **Jest & React Testing Library** - Unit testing
- **JSON DB** - Mock Database

## Installation

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v16 or later)
- **npm** or **yarn**

### Steps to Run the Application

```sh
git clone <repository-url>
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env` file in the root directory and add:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=your_secret_key
```

## API Routes

| Endpoint     | Method | Description                    |
| ------------ | ------ | ------------------------------ |
| `/api/lead`  | `POST` | Create a new lead              |
| `/api/lead`  | `GET`  | Retrieve all leads             |
| `/api/lead`  | `PUT`  | Update a lead status           |
| `/api/login` | `POST` | Admin login and token issuance |
| `/api/login` | `GET`  | Verify authentication token    |

## DB Schemas

### Leads

```sql
Table Lead {
  id ID [pk]
  firstName varchar
  lastName varchar
  email varchar
  country varchar
  portfolio varchar
  visaCategories varchar[]
  message varchar
  status Status
  cv varchar
  createdAt datetime [default: `now()`]
}

Enum Status {
    PENDING
    REACHED_OUT
}

```

### Admin

```sql
Table Admin {
  id ID [pk]
  email varchar
  password varchar
}
```

## Features

- Public lead form submission with file uploads
- Admin panel to manage leads with Authentication using JWT
- Pagination, search and status filtering
- Global state management using Zustand
- Optimistic UI updates using useActionState and Server Actions
- Middleware-based admin protection
- Unit tests for key components

## How to Create an Admin User

1. Open `db/admin.json`.
2. Hash a password using bcryptjs and store it.
3. Example admin user:
   ```json
   {
     "id": "admin1",
     "email": "admin@example.com",
     "password": "$2a$10$hashedpassword123"
   }
   ```

Default Admin Credentials:

```
Email: ibrahim@tryalma.com
Password: Password123$
```

## System Design

## Design Decisions
