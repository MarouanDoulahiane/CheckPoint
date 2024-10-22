# PiPe Resume

PiPe Resume is a web application that allows users to upload their resumes in PDF format. The application processes the uploaded resume and provides a summary of the user's skills and experiences using advanced AI techniques.

## Features

- Upload resumes in PDF format.
- Get a structured summary of your skills and experiences.
- Built with React for the frontend and NestJS for the backend.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/my-project.git
   cd my-project
   ```

2. Install the dependencies for both the frontend and backend:

   ```bash
   # For frontend
   cd my-project
   npm install

   # For backend
   cd backend
   npm install
   ```

### Running the Application

You can run the application using Docker or directly using npm.

#### Using Docker

1. Make sure Docker is installed and running on your machine.
2. In the root of the project, run:

   ```bash
   docker-compose up --build
   ```

This command will build the Docker images and start the frontend and backend services.

#### Directly Using npm

1. Start the backend server:

   ```bash
   cd backend
   npm run start:dev
   ```

2. In a new terminal, start the frontend server:

   ```bash
   cd my-project
   npm start
   ```

### Accessing the Application

Once the application is running, you can access it in your web browser at:
