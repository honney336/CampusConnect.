# CampusConnect

A comprehensive campus management system built with React.js frontend and Node.js backend, designed to streamline communication and resource sharing between students, faculty, and administrators.

## 🌟 Features

### For Students
- **Course Enrollment**: Browse and enroll in available courses
- **Notes Access**: Download course materials and notes uploaded by faculty
- **Announcements**: View important course and campus announcements
- **Events**: Stay updated with campus events and activities

### For Faculty
- **Course Management**: Create, update, and manage courses
- **Notes Upload**: Share course materials with students
- **Announcements**: Post course-specific or general announcements
- **Event Creation**: Schedule and manage campus events
- **Student Enrollment**: Manage student enrollments in courses

### For Administrators
- **Full System Access**: Complete control over all system features
- **User Management**: Manage student and faculty accounts
- **Content Moderation**: Oversee all announcements, notes, and courses
- **System Analytics**: Access to activity logs and system statistics

## 🏗️ Project Structure

```
CampusConnect/
├── frontend/
│   └── campusconnect/          # React.js frontend application
│       ├── src/
│       │   ├── Pages/          # Application pages/components
│       │   │   ├── Course/     # Course-related pages
│       │   │   ├── Notes/      # Notes management pages
│       │   │   ├── Announcement/ # Announcement pages
│       │   │   └── Enrollment/ # Enrollment management
│       │   ├── API/            # API integration layer
│       │   └── components/     # Reusable components
│       ├── package.json
│       └── tailwind.config.js  # Tailwind CSS configuration
└── backend/
    ├── controller/             # Route controllers
    │   ├── authController.js   # Authentication logic
    │   ├── courseController.js # Course management
    │   ├── notesController.js  # Notes upload/download
    │   ├── announcementController.js
    │   └── enrollmentController.js
    ├── model/                  # Database models
    │   ├── notesmodel.js      # Notes data model
    │   ├── coursemodel.js     # Course data model
    │   └── ...
    ├── middleware/             # Authentication & authorization
    │   ├── authGuard.js       # General authentication
    │   ├── isAdmin.js         # Admin role check
    │   ├── isFacutlyorAdmin.js # Faculty/Admin check
    │   └── isStudent.js       # Student role check
    ├── uploads/               # File storage for notes
    │   └── notes/             # Uploaded course materials
    ├── db/                    # Database configuration
    ├── route/                 # API routes
    └── app.js                 # Main application file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MySQL/PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CampusConnect
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=campusconnect
   JWT_SECRET=your_jwt_secret
   ```

3. **Frontend Setup**
   ```bash
   cd frontend/campusconnect
   npm install
   ```

4. **Start the Application**
   
   Backend:
   ```bash
   cd backend
   npm start
   ```
   
   Frontend:
   ```bash
   cd frontend/campusconnect
   npm run dev
   ```

## 📋 API Features

### Authentication
- User registration and login
- JWT-based authentication
- Role-based access control (Student, Faculty, Admin)

### Course Management
- Create, read, update, delete courses
- Course enrollment system
- Faculty assignment to courses

### Notes System
- File upload with support for multiple formats (PDF, DOC, DOCX, PPT, PPTX, TXT)
- 10MB file size limit
- Course-specific note organization
- Download tracking and analytics

### Announcements
- Create and manage announcements
- Course-specific or general announcements
- Priority levels and filtering

### File Management
- Secure file upload and storage
- File type validation
- Download statistics

## 🔒 Security Features

- **Authentication Middleware**: Protects routes based on user roles
- **File Upload Security**: Validates file types and sizes
- **Role-Based Access**: Different permissions for students, faculty, and admins
- **Activity Logging**: Tracks user actions for audit purposes

## 🎨 Frontend Technologies

- **React.js**: Main frontend framework
- **React Router**: Navigation and routing
- **Tailwind CSS**: Styling and responsive design
- **React Icons**: Icon library
- **React Hot Toast**: Notification system
- **Axios**: HTTP client for API calls

## 🔧 Backend Technologies

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Sequelize**: ORM for database operations
- **Multer**: File upload handling
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing

## 📁 File Upload System

The notes system supports the following file types:
- **Documents**: PDF, DOC, DOCX, TXT
- **Presentations**: PPT, PPTX
- **Images**: JPG, JPEG, PNG
- **Size Limit**: 10MB per file

Files are stored in the `backend/uploads/notes/` directory with unique filenames to prevent conflicts.

## 👥 User Roles

### Student
- View and download notes
- View announcements and events
- Enroll in courses
- Access course materials

### Faculty
- All student permissions
- Upload course notes
- Create announcements
- Manage course enrollments
- Create events

### Administrator
- All faculty permissions
- Manage all users
- Delete any content
- Access system analytics
- Full system control


## 🔮 Future Enhancements

- Real-time notifications
- Mobile application
- Advanced search functionality
- Grade management system
- Discussion forums
- Calendar integration
- Email notifications
