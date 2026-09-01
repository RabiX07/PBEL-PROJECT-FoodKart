# 🍔 FoodKart

FoodKart is a full-stack online food ordering and management system inspired by a college canteen. It helps students check menu availability, place orders, and pay online while helping canteen staff manage food, stock, orders, and users efficiently.

## 🌐 Live Demo

- **User Website:** https://food-kart-user.vercel.app
- **Admin Website:** https://pbel-project-food-kart.vercel.app/
- **Backend API:** https://pbel-project-foodkart.onrender.com

## ✨ Features

### User
- Registration and login
- Email OTP verification
- JWT authentication with HTTP-only cookies
- Browse menu and check availability
- Search and view food items
- Cart management
- Online ordering and payment
- Order history and status tracking
- Notifications
- Real-time updates with Socket.IO

### Admin
- Secure admin login
- Role-based authorization
- Manage food items
- Manage stock and availability
- Manage customer orders
- Update order status
- Manage users
- Admin dashboard

## 🏗️ Project Structure

```text
FoodKart/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── server.js
│   └── package.json
├── Frontend/
│   ├── User/
│   └── Admin/
└── .gitignore
```

## 💻 Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- Tailwind CSS
- Axios
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Socket.IO
- Brevo Email API

### Deployment
- **Vercel** — User and Admin frontends
- **Render** — Backend

## 📧 OTP Verification

FoodKart uses email OTP verification. OTP emails are sent through the Brevo API over HTTPS.

```text
User requests OTP
      ↓
Backend generates OTP
      ↓
Brevo API
      ↓
OTP email delivered
      ↓
User enters OTP
      ↓
Backend verifies OTP
```

## 🔐 Security

- Passwords are hashed with bcrypt.
- JWTs are stored in HTTP-only cookies.
- Sensitive credentials are stored in environment variables.
- `.env` files are excluded from Git.
- Admin routes use authorization checks.
- API keys and database credentials are not exposed to the frontend.

## ⚙️ Environment Variables

Create a `.env` file in the backend directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
MAIL_USER=your_verified_sender_email
BREVO_API_KEY=your_brevo_api_key
```

Add any other project-specific variables required by the backend.

**Never commit `.env` files or secret API keys to GitHub.**

## 🚀 Local Setup

### Clone

```bash
git clone https://github.com/RabiX07/PBEL-PROJECT-FoodKart.git
cd PBEL-PROJECT-FoodKart
```

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Frontend

Open the required frontend directory:

```bash
npm install
npm run dev
```

Configure the frontend API URL to point to your local or deployed backend.

## 🔄 Application Flow

```text
User
 ↓
Login / OTP Verification
 ↓
Browse Menu
 ↓
Add to Cart
 ↓
Place Order
 ↓
Payment
 ↓
Backend API
 ├── MongoDB
 └── Socket.IO
       ↓
Admin Dashboard
 ├── Manage Menu
 ├── Manage Stock
 └── Manage Orders
```

## 🎓 Project Purpose

FoodKart was developed as a college project to address common canteen problems such as long queues, uncertain food availability, and inefficient order management. It provides a digital ordering system for students and a management platform for canteen administrators.

## 👨‍💻 Author

**Rabi Singh**
**Pravesh Burathoki**
**Rupashree Panda**

GitHub: https://github.com/RabiX07

## 📄 License

This project is developed for educational and academic purposes.
