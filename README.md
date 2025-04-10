# Restaurant Reservation System

A full-stack web application for restaurant reservation management, built with React.js and Node.js.

## Overview

This application allows users to:
- Register an account
- Log in to the system
- Make restaurant reservations with preferences for:
  - Number of guests
  - Seating area (Smoking/Non-smoking, Indoor/Outdoor)
  - Date and time

## Project Structure

The project is organized into two main directories:
- `/session` - Frontend React application
- `/backend` - Node.js/Express backend server with MySQL database

## Technologies Used

### Frontend
- React 19.0.0
- React Router 7.2.0
- Axios for API requests
- CSS for styling

### Backend
- Node.js
- Express
- MySQL database
- Cors for cross-origin requests

## Getting Started

### Prerequisites
- Node.js and npm
- MySQL database

### Setting up the Database
The backend will automatically create the necessary database and tables if they don't exist.

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following content:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=bookingtable
   PORT=5000
   ```
4. Start the server:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd session
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the React app:
   ```
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features
- User authentication and registration
- Form validation
- Responsive design
- Persistent user sessions using local storage
- Secure reservation booking

## Original Create React App Documentation

For more information about Create React App, please refer to the [official documentation](https://facebook.github.io/create-react-app/).
