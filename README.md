# 🚀 Premium MERN Blog Management System

A full-stack, production-ready blogging platform built with the MERN ecosystem (MongoDB, Express, React, Node.js). This system features a sophisticated Admin Panel, Rich Text editing, and seamless Cloudinary media integration.

![Banner](https://placehold.co/1200x400?text=Premium+Blog+Post+Manager)

## ✨ Core Features

### 🔐 Advanced Authentication & Security
- **JWT Authentication**: Secure token-based session management.
- **Role-Based Access Control (RBAC)**: Granular permissions for Users and Admins.
- **XSS Protection**: Dual-layer sanitization using `sanitize-html` (Backend) and `DOMPurify` (Frontend).
- **Secure Password Hashing**: Industry-standard encryption with Bcrypt.

### ✍️ Professional Content Creation
- **Rich Text Editor**: Integrated `react-quill-new` supporting headers, code blocks, blockquotes, and lists.
- **Cloud Media Pipeline**: Direct integration with **Cloudinary** for:
  - **Post Thumbnails**: High-quality image uploads with automatic resizing.
  - **Embedded Images**: Drag-and-drop or select images directly within the editor.
- **Real-time Previews**: Instant visual feedback for thumbnail and profile image uploads.

### 📊 Powerful Admin Dashboard
- **Analytics Overview**: Interactive charts (via Recharts) for tracking post and user metrics.
- **Full Moderation Workflow**: Admin approval/rejection system for all submitted posts.
- **User Management**: Control user roles, status (Active/Inactive), and account details.
- **Advanced Filtering**: Sort and search through the entire database with ease.

### 👤 User Experience (UX)
- **Personalized Profile**: Manage your identity, update profile pictures, and track your content.
- **My Posts Dashboard**: View the status (Pending/Approved) of all your submissions.
- **Dynamic Homepage**: Modern, responsive landing page featuring categorized trending posts.
- **CSV Data Export**: One-click download of post data for offline analysis.

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Lucide Icons, React Hook Form, Recharts, DOMPurify |
| **Backend** | Node.js, Express.js, JWT, Bcrypt, Sanitize-HTML |
| **Database** | MongoDB (Mongoose ODM) |
| **Storage** | Cloudinary (Images & Media) |
| **Styling** | Modern Vanilla CSS (Global Design System) |

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Cloudinary Account

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yashwantsahu9907/Blog-Post-Manager.git
   cd Blog-Post-Manager
   ```

2. **Backend Configuration**
   Navigate to `/backend`, create a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend Configuration**
   Navigate to `/frontend`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by Yashwant Sahu
