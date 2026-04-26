import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Shows from './pages/Shows';
import SeatBooking from './pages/SeatBooking';
import Dashboard from './pages/Dashboard';
import Login from './pages/login';
import Register from './pages/Register';
import Logout from './pages/logout';
import AdminDashboard from './pages/admin/AdminDashboard';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/shows/:movieId" element={<Shows />} />
            <Route path="/booking/:showId" element={<SeatBooking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element = {<Dashboard/>} />
            <Route path="/register" element ={<Register/>}/>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
