# TickFlow Frontend

TickFlow is a modern full-stack movie ticket booking platform that allows users to discover movies, browse shows by city, select seats in real time, and complete secure online payments.

## Features

- User signup, login, logout
- JWT-based authentication
- OTP verification flow
- Search movies, theatres, and cities
- Trending movies section
- Show listings by city/movie
- Real-time seat selection UI
- Booking summary dashboard
- Razorpay payment integration
- Responsive premium UI
- Protected routes

## Tech Stack

- React.js
- React Router DOM
- Redux Toolkit
- Axios
- Tailwind CSS
- Framer Motion
- Lucide Icons

## Installation

```bash
npm install
npm run dev
Environment Variables

Create .env file:

VITE_API_URL=http://localhost:3000/api/v1
VITE_RAZORPAY_KEY=your_key
Folder Structure
src/
 ├── api/
 ├── components/
 ├── pages/
 ├── store/
 ├── routes/
 └── utils/
Main Pages
Home
Login / Signup
Verify OTP
Search Results
Seat Booking
User Dashboard
Booking History
Deployment

Recommended: Vercel

Author

Sakshi
