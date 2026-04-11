# Project Management Web App

A comprehensive full-stack web application for managing academic projects between teachers and students.

## Features

- **Role-Based Authentication** - Separate dashboards for students and teachers
- **Project Request System** - Students request projects, teachers approve/reject
- **Group Projects** - Multiple students can work on one project
- **Weekly Progress Reports** - File upload support, progress tracking
- **Auto Progress Calculation** - 10% per WPR, max 100%
- **Analytics Dashboard** - Charts, statistics, pending approvals
- **Responsive UI** - Mobile, tablet, and desktop optimized

## Tech Stack

### Frontend
- React 18+ with Vite
- React Router v6
- Axios
- Tailwind CSS
- Recharts
- React Hot Toast

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs
- Multer (file uploads)

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
```bash
cd project-management-app
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure environment variables**

Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/project-management
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

5. **Start MongoDB** (if running locally)
```bash
mongod
```

6. **Start the backend server**
```bash
cd backend
npm run dev
```

7. **Start the frontend** (in a new terminal)
```bash
cd frontend
npm run dev
```

8. **Open your browser**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

### For Students
1. Register with your student details (semester, department)
2. Request a new project by selecting a teacher guide
3. Wait for teacher approval
4. Once approved, submit weekly progress reports
5. Track your project progress

### For Teachers
1. Register as a teacher
2. Review pending project requests
3. Approve or reject student project requests
4. Monitor progress through WPR submissions
5. View analytics and statistics
6. Mark projects as completed

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects/request` | Submit project request (Student) |
| GET | `/api/projects/student` | Get student's projects |
| GET | `/api/projects/teacher` | Get teacher's projects |
| GET | `/api/projects/:id` | Get project details |
| POST | `/api/projects/:id/approve` | Approve project (Teacher) |
| POST | `/api/projects/:id/reject` | Reject project (Teacher) |
| PATCH | `/api/projects/:id/progress` | Update progress |
| POST | `/api/projects/:id/complete` | Mark complete (Teacher) |

### WPR (Weekly Progress Reports)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/wpr/:projectId/submit` | Submit WPR (Student) |
| GET | `/api/wpr/:projectId` | Get project WPRs |
| GET | `/api/wpr/:projectId/:id` | Get specific WPR |
| DELETE | `/api/wpr/:projectId/:id` | Delete WPR (Teacher) |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/teacher` | Teacher analytics |
| GET | `/api/analytics/student/:studentId` | Student analytics |
| GET | `/api/analytics/dashboard` | Dashboard stats |

## Database Structure

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'student' | 'teacher',
  semester: Number (students only),
  department: String (students only),
  projects: [ObjectId],
  createdAt: Date
}
```

### Project Collection
```javascript
{
  title: String,
  description: String,
  guide: ObjectId (User),
  students: [ObjectId (User)],
  semester: Number,
  status: 'pending' | 'approved' | 'rejected' | 'completed',
  progress: Number (0-100),
  synopsisFile: String,
  startDate: Date,
  endDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### WPR Collection
```javascript
{
  project: ObjectId (Project),
  weekNumber: Number,
  progressDescription: String,
  submittedBy: ObjectId (User),
  file: String,
  date: Date
}
```

## Project Structure

```
project-management-app/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth & upload middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   ├── uploads/        # Uploaded files
│   ├── .env            # Environment variables
│   ├── package.json
│   └── server.js       # Entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── context/    # React context
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Security Features

- JWT Authentication with 30-day token expiry
- Password hashing using bcryptjs
- Role-based authorization
- Protected routes
- Input validation
- CORS configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
