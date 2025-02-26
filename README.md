# Alma's Lead Management System

## Overview

Alma's Lead Management System is a robust and efficient platform designed to streamline the process of capturing, managing, and tracking leads. It provides a seamless experience for both prospects submitting their information and administrators managing lead interactions. The platform comprises:

- **A Public Lead Form**: A user-friendly interface where prospects can submit their details, including CV uploads.
- **An Admin Dashboard**: A secure and interactive space where authenticated admins can view, filter, and update leads.
- **Authentication & Authorization**: JWT-based authentication to ensure that only authorized users can access admin functionalities.
- **File Uploads**: Secure handling of prospect resumes.
- **Pagination & Search Filtering**: Optimized display of leads with smooth navigation.


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
git clone https://github.com/ibrahimshittu/alma-frontend-engineer.git
npm install (or npm install --force)
npm run dev
```

The application will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env` file in the root directory and add:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=your_secret_key
```
You can generate JWT secrets via [JWT Secret](https://jwtsecret.com/generate)

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

- Admin
  
<img width="755" alt="Screenshot 2025-02-25 at 21 51 10" src="https://github.com/user-attachments/assets/850a4b0a-8158-4610-a33c-f73988dc540d" />


-------
- Client
  
<img width="439" alt="Screenshot 2025-02-25 at 23 50 49" src="https://github.com/user-attachments/assets/0e3b4b7d-2833-4bb3-b067-2e84da4e8c9d" />


### 📌 Design Considerations

### 1️⃣ Performance Optimization
- Server-Side Rendering (SSR) ensures pages load fast.
= API route optimizations reduce unnecessary database reads.
- Pagination improves admin dashboard performance.

### 2️⃣ User Experience
- Optimistic UI updates create a smoother experience.
- TailwindCSS ensure an accessible and beautiful design.
- Mobile responsiveness ensures usability on different devices.

### 3️⃣ Maintainability
Separation of concerns: Logic is divided into API routes, UI components, and state management.
Reusable components: The table and form elements are modular.



## Design Decisions


- Demo


https://github.com/user-attachments/assets/f548151e-d4ca-45b5-a0ee-c3f7867f62cb



### 📌 System Architecture
The system follows a modular, scalable, and secure architecture, leveraging Next.js's server-side rendering (SSR) and API routes. The architecture can be broken down into the following key layers:

### 1️⃣ Frontend
- Next.js 15 with React provides a fast, interactive, and SEO-friendly user experience.
- Tailwind CSS & ShadCN/UI enhance styling, responsiveness, and accessibility.
- Zustand efficiently manages application state without unnecessary re-renders.
- useActionState is utilized for async state management, ensuring seamless API interactions.

### 2️⃣ API
- Next.js API routes handle backend logic, eliminating the need for a separate backend service.
- Routes are optimized for RESTful communication and protected via authentication.

### 3️⃣ Authentication & Authorization
- JWT-based authentication ensures secure access to admin functionalities.
- Tokens are stored in httpOnly cookies to prevent XSS attacks.
- Admin-only pages under /admin are protected via Next.js middleware.

### 4️⃣ Storage & Data
- Local JSON files (for demo purposes) act as a lightweight database.
- Formidable is used for file uploads, ensuring secure storage of prospect CVs.

### 5️⃣ Security & Validation
- Zod and Typescript enforces schema validation on API requests to prevent malformed inputs.
- Bcrypt.js secures admin credentials.




