# 🍕 Forno — Full-Stack Pizza Delivery Platform

A production-ready full-stack pizza ordering and inventory management platform built with the MERN stack.

Forno provides a complete customer ordering experience along with a powerful admin dashboard for managing menus, users, orders, and inventory.

## 🚀 Live Demo

🌐 Frontend: 
https://forno-pizza-delivery-platform-iho7958l1-rituraj2004.vercel.app/

🔗 Backend API: 
https://forno-api-79sw.onrender.com/

---

## ✨ Features

### 👤 Customer

- User registration and login
- JWT-based authentication
- Browse pizza menu
- Category-based menu filtering
- Pizza customization
- Choose pizza size
- Add/remove toppings
- Shopping cart
- Automatic subtotal, tax, and delivery fee calculation
- Checkout
- Razorpay payment integration
- Order placement
- Order history
- Real-time order tracking
- Profile management
- Change password
- Inventory-aware cart validation

### 👨‍💼 Admin

- Admin authentication and protected routes
- Dashboard with order, customer, menu, and revenue statistics
- Menu management
- Add, edit, and delete menu items
- Search and category filtering
- Availability management
- User management
- Customer/admin role management
- Order management
- Order status updates
- Order details and payment information
- Inventory management
- Mark items available/out of stock

### ⚡ Real-Time Features

- Socket.IO-powered order updates
- Real-time order tracking
- Automatic order status updates

### 🔐 Security

- JWT authentication
- Password hashing with bcrypt
- Protected customer and admin routes
- Role-based authorization
- Server-side order price calculation
- Server-side menu availability validation
- Razorpay payment signature verification
- Helmet security middleware
- CORS configuration
- Environment-based secrets

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Tailwind CSS
- Axios
- Socket.IO Client
- Framer Motion
- React Icons

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Socket.IO
- Razorpay
- Helmet
- Morgan

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 🏗️ Project Structure

```text
pizza-delivery-platform/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.css
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── jobs/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── sockets/
│   ├── utils/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md


---

## 🔄 Application Architecture

```text

                ┌─────────────────────┐
                │     React Client    │
                │       Vercel        │
                └──────────┬──────────┘
                           │
                    REST API / Socket.IO
                           │
                           ▼
                ┌─────────────────────┐
                │   Express Server    │
                │       Render        │
                └──────┬───────┬──────┘
                       │       │
              ┌────────┘       └─────────┐
              ▼                          ▼
     ┌─────────────────┐        ┌─────────────────┐
     │  MongoDB Atlas  │        │    Razorpay     │
     │    Database     │        │    Payments     │
     └─────────────────┘        └─────────────────┘


---
     
## 💰 Order Pricing

Order totals are calculated securely on the server.

The backend calculates:

```text
Item Price
    ↓
Pizza Size Adjustment
    ↓
Topping Charges
    ↓
Quantity
    ↓
Subtotal
    ↓
Tax
    ↓
Delivery Fee
    ↓
Final Total


---


## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/rituraj821310/forno-pizza-delivery-platform.git
cd forno-pizza-delivery-platform
```

### 2. Install client dependencies

```bash
cd client
npm install
```

### 3. Install server dependencies

Open another terminal:

```bash
cd server
npm install
```

---

## ⚙️ Environment Variables

Create the required environment files locally.

### Client

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SERVER_BASE_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Server

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

## ▶️ Running Locally

### Start the backend

```bash
cd server
npm start
```

### Start the frontend

```bash
cd client
npm run dev
```

The application will be available at:

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:5000
```

---

## 🧪 Production Testing

The deployed application has been tested across the major customer and admin workflows, including:

- Authentication
- Menu browsing
- Pizza customization
- Cart
- Checkout
- Order placement
- Order history
- Order tracking
- Profile management
- Admin dashboard
- Menu management
- User management
- Order management
- Inventory management
- Production API communication
- Mobile responsiveness

---

## 📱 Responsive Design

The application is designed to work across:

- Desktop
- Tablet
- Mobile devices

Responsive layouts were tested using common mobile and tablet viewport sizes.

---

## 🔮 Future Improvements

- Delivery partner dashboard
- Advanced analytics
- Coupon and discount system
- Email/SMS order notifications
- Customer reviews and ratings
- Location-based delivery tracking
- Automated inventory alerts
- Image upload management
- Performance optimization and code splitting

---

## 👨‍💻 Author

Ritu Raj

Full-Stack Developer | MERN Stack | Software Engineering

Computer Science & Engineering graduate passionate about building scalable, user-focused web applications and solving real-world problems through technology.

I enjoy working across the full development lifecycle — from designing responsive interfaces and building REST APIs to database management, authentication, payment integration, and cloud deployment.

### 🛠️ What I Work With

- Languages: C++, Python, JavaScript, SQL
- Frontend: React.js, Vite, Tailwind CSS
- Backend: Node.js, Express.js, FastAPI
- Database: MongoDB, MySQL
- Tools & Platforms: Git, GitHub, Vercel, Render, MongoDB Atlas


### Connect

- GitHub: https://github.com/rituraj821310
- LinkedIn: https://www.linkedin.com/in/rituraj821310/

---

## ⭐ Project

If you find this project useful or interesting, consider giving the repository a star.