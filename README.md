# Quiz Application

A modern, full-stack quiz application built with Next.js, TypeScript, and Prisma. This application allows users to take timed quizzes with both multiple-choice and short-answer questions.

## Features

- 🔐 **Authentication System**
  - Email-based user registration and login
  - JWT token-based authentication
  - Secure password hashing with bcrypt

- 📊 **Quiz Dashboard**
  - Clean, modern interface
  - Real-time score tracking
  - Progress indicators
  - User profile display

- ⏱️ **Timed Exams**
  - 10-minute countdown timer
  - Auto-submission when time expires
  - Progress tracking
  - Multiple question types support

- 📝 **Question Types**
  - Multiple choice questions
  - Short answer questions
  - Immediate answer validation

- 📈 **Results & Analytics**
  - Score calculation
  - Performance visualization
  - Detailed result breakdown
  - Option to retake quizzes

## Tech Stack

- **Frontend**
  - Next.js 15.3.3
  - TypeScript
  - Tailwind CSS
  - React Hooks

- **Backend**
  - Next.js API Routes
  - Prisma ORM
  - SQLite Database
  - JWT Authentication

- **Development Tools**
  - Turbopack
  - Prisma Studio
  - TypeScript
  - ESLint

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd quiz-application
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET="your-secret-key"
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   └── results/
│   │   ├── dashboard/
│   │   ├── exam/
│   │   └── results/
│   └── components/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
└── package.json
```

## Database Schema

The application uses the following data models:

- **User**
  - id (Int, auto-increment)
  - email (String, unique)
  - password (String, hashed)
  - createdAt (DateTime)
  - updatedAt (DateTime)

- **Quiz**
  - id (String, UUID)
  - title (String)
  - questions (JSON)
  - createdAt (DateTime)
  - updatedAt (DateTime)

- **QuizAttempt**
  - id (String, UUID)
  - userId (Int, foreign key)
  - quizId (String, foreign key)
  - answers (JSON)
  - score (Int)
  - createdAt (DateTime)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify JWT token

### Quiz
- `GET /api/quiz` - Get quiz details
- `POST /api/results` - Submit quiz results

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
# quiz_app_next.js_node
