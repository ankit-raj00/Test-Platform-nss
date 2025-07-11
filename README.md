# Test Platform

**Link** – [https://test-platform-phi.vercel.app](https://test-platform-phi.vercel.app)


## 🔐 Sample Login Credentials

- **Username:** `test`  
- **Email:** `test@gmail.com`  
- **Password:** `1234567`  
- **Enrollment No.:** `22322020`
  
The **TestPlatform** is a robust and feature-rich **MERN** (MongoDB, Express.js, React.js, Node.js) application designed to streamline online test-taking and performance analysis for students while providing admins with powerful tools for test management and student monitoring.

Features
1. User Roles
Students
- Sign Up & Login:
  - Register using enrollment number, name, email, and password.
  - Login to access personalized dashboard and tests.
- Test Access:
  - View available tests with details like syllabus, status (active, upcoming, expired), date & time, pattern, and duration.
  - Take active tests with features such as:
    - Timers for individual questions and overall test duration.
    - Navigation controls: Save & Next, Mark for Review, Mark for Review & Next.
- Profile Management:
  - Access previous test responses, performance analytics, and bookmarked questions.
  - Analyze performance through detailed graphs and metrics.
Admins
- Sign Up & Login:
  - Register using name, email, and password.
  - Login to access admin dashboard for test and student management.
- Test Management:
  - Create, edit, and delete tests with metadata (title, syllabus, duration, etc.) and questions (text, options, correct answers, etc.).
  - Declare results and monitor test analytics.
- Student Management:
  - View registered students, their test history, and performance data.
Realistic Test Interface
- Color-Coded Question Status:
  - Questions are marked as Attempted, Not Attempted, or Marked for Review, enabling efficient test navigation.
- Synced Timers:
  - Timers ensure individual question and overall test duration is adhered to.
- Flexible Navigation:
  - Students can switch between subjects and questions without restrictions.
Performance Analysis
- Subject-Wise and Topic-Wise Analytics:
  - Detailed breakdown of marks and time spent on each subject, topic, and sub-topic.
- Visual Insights:
  - Graphs and charts help students identify strengths and weaknesses.
  - Metrics such as subject-wise accuracy, time spent vs. marks, and question type distribution are provided.
Test History and Bookmarks
- Access to Past Tests:
  - Students can view their previous test attempts, analyze answers, and revisit answer keys.
- Bookmarking Features:
  - Bookmarked PYQs (Previous Year Questions) and important questions are accessible for future review, streamlining study workflows.
Upcoming Test Management
- Calendar Integration:
  - A built-in calendar displays upcoming test dates and syllabus reminders, ensuring students stay organized.
- Test Scheduling:
  - Admins can schedule and modify tests while notifying students in advance.
Admin Tools
- Efficient Question Management:
  - Questions can be added with multimedia options, ensuring flexibility for diverse test requirements.
- Result Declaration:
  - Results can be declared with detailed analytics provided for each student.
- Personalized Feedback:
  - Admins can provide feedback to students based on their performance metrics.
System Workflows
1. Student Workflow
1. Sign Up/Login:
   - Create an account or log in to access the platform.
2. Explore Tests:
   - Browse available tests and view their details.
3. Take Tests:
   - Participate in active tests using navigation tools and timers.
4. Review Performance:
   - Access test history, analyze performance metrics, and bookmark important questions.
2. Admin Workflow
1. Sign Up/Login:
   - Register or log in to the admin dashboard.
2. Test Management:
   - Create and manage tests, upload questions, and declare results.
3. Student Monitoring:
   - Access detailed student performance analytics and manage user accounts.
Setup Instructions
Backend Setup
1. Clone the repository and navigate to the backend directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables for:
   - Database URI
   - JWT secrets
   - Cloudinary credentials (for file uploads)
4. Start the server:
   ```bash
   npm start
   ```
Frontend Setup
1. Navigate to the frontend directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the backend API URL in the frontend configuration.
4. Start the development server:
   ```bash
   npm run dev
   ```
Technical Overview
Backend
- Framework: Node.js with Express.js.
- Database: MongoDB for storing user details, test metadata, questions, and results.
- File Handling: Multer for uploads and Cloudinary for secure media storage.
- Authentication: JWT-based system for secure API calls.
Frontend
- Framework: React.js with Vite for optimized development.
- UI Libraries: TailwindCSS for styling and Chart.js for data visualizations.
- Features:
  - Responsive design.
  - Interactive test-taking and performance analysis interface.
API Endpoints
Admin Routes
1. POST /api/v1/admins/register:
   - Register a new admin account.
2. POST /api/v1/admins/login:
   - Authenticate admin and return access tokens.
3. POST /api/v1/admins/logout:
   - Logout admin (JWT required).
4. POST /api/v1/admins/change-password:
   - Update admin password (JWT required).
5. PATCH /api/v1/admins/update-account:
   - Update admin details (JWT required).
6. GET /api/v1/admins/current-admin:
   - Fetch current admin details (JWT required).
7. PATCH /api/v1/admins/avatar:
   - Update admin avatar image (JWT required).
User Routes
1. POST /api/v1/users/register:
   - Register a new user.
2. POST /api/v1/users/login:
   - Authenticate user and return tokens.
3. POST /api/v1/users/logout:
   - Logout user (JWT required).
4. POST /api/v1/users/change-password:
   - Update user password (JWT required).
5. GET /api/v1/users/current-user:
   - Fetch current user details (JWT required).
6. PATCH /api/v1/users/update-account:
   - Update user details (JWT required).
7. PATCH /api/v1/users/avatar:
   - Update user avatar image (JWT required).
8. GET /api/v1/users/history:
   - Fetch user test history (JWT required).
Test Routes
1. POST /api/v1/test:
   - Create a new test (Admin only).
2. GET /api/v1/test:
   - Fetch all tests.
3. GET /api/v1/test/:id:
   - Fetch specific test details by ID.
4. PATCH /api/v1/test/:id:
   - Update test details by ID (Admin only).
5. DELETE /api/v1/test/:id:
   - Delete a test by ID (Admin only).
Question Routes
1. POST /api/v1/question:
   - Add a new question (Admin only).
2. GET /api/v1/question/:id:
   - Fetch questions (all or specific by ID).
3. PUT /api/v1/question/:id:
   - Update a question by ID (Admin only).
4. DELETE /api/v1/question/:id:
   - Delete a question by ID (Admin only).
Bookmark Routes
1. POST /api/v1/bookmark/toggle/:questionId:
   - Toggle bookmark for a specific question.
2. GET /api/v1/bookmark/user:
   - Get all bookmarks for the current user.
3. GET /api/v1/bookmark/question/:questionId:
   - Get all users who bookmarked a specific question.
