# Placement_cell
>>>>>>> 78f740b11e751cf0a39c76680298a8e516eb1b87
=======
# Placement Management System (Placement_cell)

A full-stack web application for managing student placements with separate dashboards for Students and Coordinators.

## 🏗️ Project Structure

```
placement/
├── backend/                    # Node.js + Express.js Backend
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── studentController.js
│   │   └── coordinatorController.js
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── Student.js
│   │   ├── Coordinator.js
│   │   ├── Company.js
│   │   ├── Application.js
│   │   └── index.js
│   ├── routes/
│   │   ├── studentRoutes.js
│   │   └── coordinatorRoutes.js
│   ├── .env                   # Environment variables
│   ├── schema.sql             # MySQL database schema
│   ├── seed.js                # Seed script for default coordinator
│   ├── server.js              # Main server file
│   └── package.json
│
└── frontend/                   # React.js Frontend
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/
    │   │   └── index.js      # API calls
    │   ├── components/
    │   │   └── ProtectedRoute.js
    │   ├── pages/
    │   │   ├── LandingPage.js & LandingPage.css
    │   │   ├── StudentLogin.js
    │   │   ├── StudentRegister.js
    │   │   ├── StudentDashboard.js
    │   │   ├── CoordinatorLogin.js
    │   │   ├── CoordinatorDashboard.js
    │   │   ├── Auth.css
    │   │   └── Dashboard.css
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```

## 🚀 Tech Stack

### Backend
- Node.js
- Express.js
- MySQL (with Sequelize ORM)
- JWT Authentication
- Bcrypt for password hashing

### Frontend
- React.js
- React Router
- Axios for API calls
- CSS for styling

## 📋 Features

### Student Features
- ✅ Student Registration (Name, Email, Password, Department, Year, Resume Link)
- ✅ Student Login
- ✅ View all companies
- ✅ Apply to companies (Interested button)
- ✅ Prevent duplicate applications
- ✅ "Already Applied" status

### Coordinator Features
- ✅ Coordinator Login
- ✅ Add Companies (Name, LPA, Role, Requirements)
- ✅ View all added companies
- ✅ View interested students per company
- ✅ Delete companies

## 🔌 API Endpoints

### Student Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/students/register` | Register new student |
| POST | `/api/students/login` | Student login |
| GET | `/api/students/companies` | Get all companies (Protected) |
| POST | `/api/students/apply/:companyId` | Apply to company (Protected) |
| GET | `/api/students/profile` | Get student profile (Protected) |

### Coordinator Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/coordinators/login` | Coordinator login |
| POST | `/api/coordinators/companies` | Add new company (Protected) |
| GET | `/api/coordinators/companies` | Get all companies (Protected) |
| GET | `/api/coordinators/companies/:companyId/applications` | Get applications (Protected) |
| DELETE | `/api/coordinators/companies/:companyId` | Delete company (Protected) |

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

### Database Setup
1. Open MySQL and create the database:
```
sql
CREATE DATABASE placement_management;
```

2. Or use the provided schema:
```
bash
mysql -u root -p < backend/schema.sql
```

### Backend Setup
1. Navigate to backend directory:
```
bash
cd backend
```

2. Install dependencies:
```
bash
npm install
```

3. Update `.env` file with your database credentials:
```
env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=placement_management
JWT_SECRET=your_super_secret_key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

4. Run the seed script to create default coordinator:
```
bash
node seed.js
```

5. Start the backend server:
```
bash
npm start
```
The server will run on http://localhost:5000

### Frontend Setup
1. Navigate to frontend directory:
```
bash
cd frontend
```

2. Install dependencies:
```
bash
npm install
```

3. Start the React development server:
```
bash
npm start
```
The application will open at http://localhost:3000

## 🔑 Default Credentials

### Coordinator Account
- **Email:** admin@placement.com
- **Password:** admin123

### Student Account
- Create a new account using the Registration form

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing Page with login options |
| `/student-login` | Student Login |
| `/student-register` | Student Registration |
| `/coordinator-login` | Coordinator Login |
| `/student-dashboard` | Student Dashboard (Protected) |
| `/coordinator-dashboard` | Coordinator Dashboard (Protected) |

## 🎨 UI Features

- Clean, modern gradient design
- Responsive layout for all devices
- Protected routes with authentication
- Loading states and error handling
- Modal for viewing applications
- Company cards with LPA badges

## 📄 License

This project is for educational purposes.
=======
# Placement_cell
>>>>>>> 78f740b11e751cf0a39c76680298a8e516eb1b87
