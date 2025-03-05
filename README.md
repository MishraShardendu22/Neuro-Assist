# Neuro Assist

Neuro Assist is a cutting-edge application designed to seamlessly connect doctors and patients, serving as the go-to platform for stroke cases with efficient file management.

## Features
- **Doctor-Patient Connectivity**: Enables seamless interaction between doctors and patients for better healthcare management.
- **File Management System**: Securely manage patient records and medical files.
- **Real-time Communication**: Instant messaging and updates for effective collaboration.
- **Secure Authentication**: JWT-based authentication for enhanced security.
- **Rate Limiting**: Prevents API abuse and ensures smooth performance.

## Tech Stack

### Frontend
- **React**: Modern JavaScript library for building user interfaces.
- **Axios**: HTTP client for API calls.
- **Zustand**: Lightweight state management.
- **ShadCN UI**: Component library for UI elements.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **React Helmet**: SEO management for better visibility.

### Backend
- **TypeScript**: Strongly typed JavaScript for scalability.
- **JWT (JSON Web Tokens)**: Secure authentication mechanism.
- **Express**: Minimal and flexible Node.js web framework.
- **Mongoose**: ODM for MongoDB.
- **API Rate Limiting**: Prevents excessive requests and ensures API stability.

### Other Integrations
- **Pintura**: Image editor for medical files and images.
- **FileStack**: File upload service for managing patient records.

## Live Demo
[Neuro Assist Live](https://frontend-acumant-neuro.vercel.app/)

## Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (>=16.x)
- MongoDB

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/neuro-assist.git
   cd neuro-assist
   ```

2. Install dependencies:
   ```sh
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the backend directory and set up MongoDB URI, JWT secret, and API keys.
   - Example:
     ```env
     MONGO_URI=your_mongo_connection_string
     JWT_SECRET=your_jwt_secret
     FILESTACK_API_KEY=your_filestack_key
     ```

4. Run the application:
   ```sh
   # Start backend server
   cd backend
   npm run dev
   
   # Start frontend application
   cd ../frontend
   npm start
   ```

## Contributing
Contributions are welcome! Feel free to fork the repository and submit a pull request.
