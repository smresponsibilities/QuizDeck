# Kahoot Clone

## Table of Contents

1. [Description](#description)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [Features](#features)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

## Description

This project is a MERN stack application that serves as a clone of the popular quiz platform Kahoot. It includes a MongoDB database, Express.js server, React frontend, and Node.js backend. Users can create quizzes, participate in real-time quiz sessions, and view leaderboards. The application is designed to be scalable and secure, providing a seamless experience for users. The frontend is built with React, providing a dynamic and responsive user interface. The backend is built with Express.js, ensuring robust and efficient handling of API requests. MongoDB is used as the database to store user data, quiz information, and real-time scores. The application also incorporates WebSockets for real-time communication, allowing users to receive instant updates during quiz sessions. The project follows best practices for security, including JWT for authentication, input validation, and secure password storage. The application is optimized for performance, with lazy loading of components and efficient state management. It also includes a comprehensive CI/CD pipeline for automated testing and deployment, ensuring high code quality and reliability.

## Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MongoDB (v4.x or higher)
- Create React App (v4.x or higher)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/smresponsibilities/QuizDeck
```

2. Navigate to the project directory:

```bash
cd quizdeck
```

3. Install backend dependencies:

```bash
cd backend
npm install
```

```env
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_JWT_SECRET
PORT=5000
```

```bash
cd frontend
npm install
```

1. Start the backend server:

1. Create a `.env` file in the `backend` directory and add the following environment variables:

```env
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_JWT_SECRET
PORT=5000
```

## Usage

```env
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_JWT_SECRET
PORT=5000
```

```bash
cd backend
node index.js
```

2. Start the frontend server:

```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`.

## Features

- User authentication and authorization
- Create, edit, and delete quizzes
- Real-time quiz participation
- Leaderboard and scoring system
- Responsive design for mobile and desktop
- Timer for each quiz question
- Multiple choice and true/false question types
- Real-time updates for quiz scores and leaderboard
- User profile management
- Admin panel for managing quizzes and users
- Support for multimedia questions (images, videos)
- Customizable quiz themes
- Analytics dashboard for quiz performance
- Integration with third-party services (e.g., Google Analytics)
- Localization and internationalization support
- Accessibility features for users with disabilities
- Real-time notifications for quiz events
- Detailed quiz statistics and reporting
- Multi-language support for quizzes
- Dark mode for better user experience
- Role-based access control for different user types
- Integration with social media platforms for sharing quizzes

## Testing

1. Run backend tests:

```bash
cd backend
npm test
```

2. Run frontend tests:

```bash
cd frontend
npm test
```

## Troubleshooting

- If you encounter issues with MongoDB, ensure that the MongoDB service is running and accessible. Check the connection string in the `.env` file.
- For frontend issues, ensure that Create React App is installed globally:

```bash
npm install -g create-react-app
```

- If the backend server fails to start, check the logs for error messages and ensure that all dependencies are installed correctly.
- For issues with real-time quiz participation, ensure that the WebSocket connection is established and working properly.
- If you experience performance issues, consider optimizing database queries and using caching mechanisms.

```bash
npm install -g create-react-app
```

- If you encounter issues with user authentication, ensure that the JWT tokens are being generated and validated correctly.
- For issues with quiz creation and editing, ensure that the input validation is working as expected.

2. Deploy the backend and frontend to your preferred hosting service. Ensure that the environment variables are set correctly on the hosting platform.

3. Configure a reverse proxy (e.g., Nginx) to route requests to the backend and frontend servers.

2. Deploy the backend and frontend to your preferred hosting service. Ensure that the environment variables are set correctly on the hosting platform.
3. Configure a reverse proxy (e.g., Nginx) to route requests to the backend and frontend servers.
4. Set up SSL/TLS certificates for secure communication.
5. Monitor the application using tools like PM2 for process management and logging.
6. Set up automated backups for the MongoDB database to prevent data loss.
7. Use a load balancer to distribute traffic evenly across multiple instances of the application.
8. Implement rate limiting to prevent abuse and ensure fair usage of the application.

- If you encounter issues with user authentication, ensure that the JWT tokens are being generated and validated correctly.
- For issues with quiz creation and editing, ensure that the input validation is working as expected.

```bash
cd frontend
npm run build
```

- If you encounter issues with user authentication, ensure that the JWT tokens are being generated and validated correctly.
- For issues with quiz creation and editing, ensure that the input validation is working as expected.