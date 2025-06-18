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

## Microservices with Event-Driven Architecture (EDA) Use Case

### Quiz Application as a Microservice Architecture

This quiz application can be extended to demonstrate a practical use case of microservices with Event-Driven Architecture (EDA). Here's how the system could be structured:

#### Microservices Breakdown:

1. **Authentication Service**
   - Handles user registration and login
   - Manages JWT token generation and validation
   - Publishes events: `UserRegistered`, `UserLoggedIn`

2. **Quiz Service**
   - Manages quiz content and questions
   - Handles quiz session creation
   - Publishes events: `QuizStarted`, `QuizCompleted`

3. **Timer Service**
   - Manages quiz time limits
   - Tracks remaining time
   - Publishes events: `TimeWarning`, `TimeExpired`

4. **Results Service**
   - Processes quiz submissions
   - Calculates scores
   - Publishes events: `ResultsCalculated`, `ResultsReady`

5. **Notification Service**
   - Sends notifications to users
   - Handles email/SMS notifications
   - Subscribes to events: `ResultsReady`, `TimeWarning`

#### Event Flow Example:

1. When a user starts a quiz:
   ```
   Quiz Service → QuizStarted → Timer Service starts countdown
   ```

2. When time is running low:
   ```
   Timer Service → TimeWarning → Notification Service sends warning
   ```

3. When quiz is completed:
   ```
   Quiz Service → QuizCompleted → Results Service processes answers
   Results Service → ResultsCalculated → Notification Service sends results
   ```

#### Benefits of this Architecture:

1. **Scalability**
   - Each service can be scaled independently
   - High-traffic services (like Quiz Service) can be scaled up during peak times

2. **Resilience**
   - Service failures are isolated
   - Event queue ensures no data loss during service downtime

3. **Flexibility**
   - New features can be added by creating new services
   - Existing services can be modified without affecting others

4. **Real-time Processing**
   - Events enable real-time updates across services
   - Users get immediate feedback on their actions

#### Technology Stack for EDA:

- **Message Broker**: Apache Kafka or RabbitMQ
- **Service Communication**: gRPC or REST
- **Event Store**: EventStoreDB
- **API Gateway**: Kong or AWS API Gateway
- **Service Discovery**: Consul or Eureka
- **Container Orchestration**: Kubernetes

This architecture allows the quiz application to handle high loads, provide real-time feedback, and maintain system reliability while enabling future scalability and feature additions.

# quiz_app_next.js_node
