# Full Stack Blog Post Management System

A robust, production-ready Blog Post Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js). 

## Features
- **CRUD Operations**: Create, read, update, and delete blog posts.
- **Search & Filter**: Advanced search by title, author, or category. Filter by category and status.
- **Pagination**: Efficient data loading with server-side pagination.
- **Export to CSV**: Download filtered or all posts as a CSV file.
- **Responsive UI**: Modern, clean, and responsive design built with React, Lucide React icons, and pure CSS.
- **Form Validation**: Comprehensive form validation using React Hook Form.
- **Centralized Error Handling**: Standardized API error responses.

## Tech Stack
- **Frontend**: React (Vite), React Router, Axios, React Hook Form, Date-fns, React Hot Toast, Lucide React.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), dotenv, cors, multer, json2csv.

## Project Structure
```text
Blog_post/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── postController.js
│   ├── middleware/
│   │   └── errorMiddleware.js
│   ├── models/
│   │   └── Post.js
│   ├── routes/
│   │   └── postRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── postService.js
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── pages/
    │   │   ├── PostForm.jsx
    │   │   ├── PostList.jsx
    │   │   └── PostView.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running (or a MongoDB Atlas URI)

### Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. The `.env` file is already created with the following defaults:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/blog_manager
   NODE_ENV=development
   ```
   *Make sure your local MongoDB instance is running, or update `MONGO_URI` to an Atlas URL.*
4. Start the server: `npm start` (or `node server.js`)

### Frontend Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open the application in your browser at `http://localhost:5173`.

## API Endpoints

### Posts API
- `GET /api/posts` - Fetch all posts (Supports pagination: `?page=1&limit=10`, search, category, status filters)
- `POST /api/posts` - Create a new post
- `GET /api/posts/:id` - Fetch a single post by ID
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post
- `GET /api/posts/export/csv` - Export posts to CSV (Supports search, category, status filters)

## Deployment Guidelines
- **Backend**: Can be deployed to services like Render, Heroku, or AWS. Set the `MONGO_URI` and `NODE_ENV=production` in the hosting environment variables.
- **Frontend**: Can be built using `npm run build` and deployed to Vercel, Netlify, or any static hosting. Ensure `API_URL` is configured for the deployed backend URL instead of `localhost:5000`.
