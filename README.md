# Online Job Portal

A full-stack job portal website built with MongoDB, Express, React, and Node.js (MERN stack). This platform allows job seekers to search and apply for job openings, upload resumes, and manage their profiles. Recruiters can post job openings, manage applications, and review applicant resumes. The application includes user authentication, error tracking, and performance monitoring, and is deployed on Vercel.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Job Seeker Features**:
  - Search and apply for job openings.
  - Upload and manage resumes in user profiles.
  - Secure user authentication using Clerk.
- **Recruiter Features**:
  - Post and manage job openings.
  - Accept or reject job applications.
  - View applicant resumes.
- **Performance Monitoring**:
  - Error tracking and performance monitoring with Sentry.
  - MongoDB query optimization using Sentry.
- **Deployment**:
  - Hosted on Vercel for seamless scalability.

## Technologies Used
- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB (via Mongoose)
- **Authentication**: Clerk
- **File Uploads**: Multer, Cloudinary
- **Error Tracking**: Sentry
- **Deployment**: Vercel
- **Other Dependencies**:
  - bcrypt (password hashing)
  - jsonwebtoken (JWT for authentication)
  - cors (Cross-Origin Resource Sharing)
  - dotenv (environment variables)
  - svix (webhook handling)

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance, e.g., MongoDB Atlas)
- Clerk account for authentication
- Sentry account for error tracking
- Cloudinary account for resume storage
- Vercel account for deployment

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/BarasaIan11/Job_Hub1
   cd Job_Hub1
   ```

2. **Install Server Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

4. **Set Up Environment Variables**:
   Create a `.env` file in the `server` directory and add the following:
   ```plaintext
   MONGODB_URI=your_mongodb_connection_string
   CLERK_SECRET_KEY=your_clerk_secret_key
   SENTRY_DSN=your_sentry_dsn
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

5. **Configure MongoDB**:
   Ensure your MongoDB instance is running and the connection string is added to the `.env` file.

## Running the Application
1. **Start the Backend Server**:
   ```bash
   cd server
   npm run server
   ```
   The server will run on `http://localhost:5000` (or the port specified in `.env`).

2. **Start the Frontend**:
   ```bash
   cd client
   npm run dev
   ```
   The React app will run on `http://localhost:5173`.

3. **Access the Application**:
   Open `http://localhost:5173` in your browser to use the job portal.

## Deployment
1. **Deploy Backend**:
   - Push the `server` directory to a Git repository.
   - Connect the repository to Vercel and add the environment variables from the `.env` file in the Vercel dashboard.
   - Deploy the backend.

2. **Deploy Frontend**:
   - Push the `client` directory to a Git repository.
   - Connect the repository to Vercel and deploy the React app.
   - Ensure the frontend is configured to communicate with the deployed backend API.

3. **Post-Deployment**:
   - Verify Clerk, Sentry, and Cloudinary integrations are working.
   - Monitor performance using Sentry's dashboard.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the ISC License. See the `LICENSE` file for details.
