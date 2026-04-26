import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Ticket, CreditCard, Play, Clock, Star, X, Gift, Percent, Sparkles } from 'lucide-react';
import api from '../api/axios';
import MovieCard from '../components/MovieCard';
import ShowCard from '../components/ShowCard';
import { cities } from '../data/mockData';
import heroBg from '../assets/hero_bg.png';

const CountdownTimer = ({ releaseDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = new Date(releaseDate) - new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          mins: Math.floor((difference / 1000 / 60) % 60),
          secs: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [releaseDate]);

  return (
    <div className="flex gap-4">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.mins },
        { label: 'Secs', value: timeLeft.secs }
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="w-16 h-16 bg-card border border-gray-800 rounded-xl flex items-center justify-center text-2xl font-black text-white shadow-[0_0_15px_rgba(229,9,20,0.15)] mb-1">
            {item.value.toString().padStart(2, '0')}
          </div>
          <span className="text-xs text-muted uppercase tracking-wider font-bold">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieShows, setMovieShows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await api.get('/public/trendingMovies');
        console.log("Trending movies response:", res.data);
        // Handle different response structures
        let data = res.data;
        if (data.data) {
          data = data.data;
        }
        if (Array.isArray(data)) {
          setTrendingMovies(data);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (err) {
        console.error("Failed to fetch trending movies", err);
      }
    };
    fetchTrending();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleBookNow = async (movie) => {
    setSelectedMovie(movie);
    try {
      const response = await api.get('/public/search', { params: { query: movie.title } });
      setMovieShows(response.data.data);
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching shows:', err);
    }
  };

  // Mock upcoming releases
  const upcomingReleases = [
    {
      id: 'upcoming-1',
      title: 'Dune: Part Three',
      genre: 'Sci-Fi / Action',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
      releaseDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
    },
    {
      id: 'upcoming-2',
      title: 'Avengers: Secret Wars',
      genre: 'Action / Adventure',
      poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=800',
      releaseDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000) // 42 days from now
    }
  ];

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg}
            alt="Cinematic Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
        </div>
        
        <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto mt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-tight drop-shadow-2xl"
          >
            Book Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-500 drop-shadow-[0_0_30px_rgba(229,9,20,0.8)]">
              Movie Night
            </span> Instantly
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-medium drop-shadow-lg"
          >
            Discover shows, choose seats, pay securely.
          </motion.p>
          
          {/* Action Buttons & Search */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center gap-8 w-full max-w-3xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Link to="/movies" className="bg-primary hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_35px_rgba(229,9,20,0.6)] flex items-center justify-center gap-3">
                <Play className="w-5 h-5 fill-current" />
                Explore Movies
              </Link>
              <a href="#cities" className="bg-card/80 backdrop-blur-md hover:bg-gray-800 border border-gray-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-3">
                <MapPin className="w-5 h-5" />
                View Shows Near Me
              </a>
            </div>

            <form onSubmit={handleSearch} className="relative w-full max-w-2xl group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-red-600/50 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-[#1A1A1A]/90 backdrop-blur-xl border border-gray-800 rounded-2xl p-2 shadow-2xl">
                <Search className="w-6 h-6 text-gray-400 ml-4 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search movie / city / theatre..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-white text-lg py-3 px-2 focus:outline-none placeholder-gray-500"
                />
                <button type="submit" className="bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition">
                  Search
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* 2. Trending Now Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">Trending Now</h2>
            <div className="w-20 h-1 bg-primary rounded-full mb-4"></div>
            <p className="text-muted text-lg">Top movies running in theatres worldwide</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {trendingMovies.map((movie, index) => (
            <motion.div 
              key={movie.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="group relative"
            >
              {/* Hover Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-b from-primary to-transparent rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
              
              <div className="relative bg-card rounded-2xl overflow-hidden border border-gray-800 flex flex-col h-full transform transition duration-500 group-hover:-translate-y-2">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img src={movie.poster_url || movie.image} alt={movie.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:opacity-80" />
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-gold px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 border border-yellow-500/30">
                    <Star className="w-3 h-3 fill-current" />
                    {movie.rating || '8.5'}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-md text-xs font-bold shadow-lg">
                    {movie.duration || '120 min'}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 group-hover:text-primary transition">{movie.title}</h3>
                  <p className="text-sm text-gray-400 mb-6">{movie.genre}</p>
                  
                  <div className="mt-auto">
                    <button onClick={() => handleBookNow(movie)} className="w-full block text-center bg-[#1A1A1A] hover:bg-primary border border-gray-700 hover:border-primary text-white font-bold py-3 rounded-xl transition duration-300">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Browse by City */}
      <section id="cities" className="py-24 bg-[#0a0a0a] border-y border-gray-800/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tight">Browse by City</h2>
            <p className="text-muted text-lg">Select your location to discover local shows</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {['Delhi', 'Mumbai', 'Bangalore', 'Chennai'].map((city, index) => (
              <motion.div 
                key={city}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative h-40 rounded-2xl overflow-hidden cursor-pointer group"
              >
                <img 
                  src={`https://source.unsplash.com/600x400/?${city.toLowerCase()},city`} 
                  alt={city}
                  className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-80"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center border-2 border-transparent group-hover:border-primary/50 transition duration-300 rounded-2xl z-10">
                  <h3 className="text-2xl font-black text-white tracking-widest uppercase drop-shadow-lg group-hover:text-primary transition">{city}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section id="offers" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tight">Exclusive Offers</h2>
          <p className="text-muted text-lg">Grab the best deals on movie tickets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              id: 1,
              title: 'First Booking Discount',
              description: 'Get 25% off on your first movie booking',
              code: 'FIRST25',
              discount: '25% OFF',
              icon: Percent,
              color: 'from-green-500 to-emerald-600'
            },
            {
              id: 2,
              title: 'Weekend Bonanza',
              description: 'Flat ₹100 off on weekend shows',
              code: 'WEEKEND100',
              discount: '₹100 OFF',
              icon: Gift,
              color: 'from-purple-500 to-pink-600'
            },
            {
              id: 3,
              title: 'Premium Experience',
              description: '20% off on premium format screenings',
              code: 'PREMIUM20',
              discount: '20% OFF',
              icon: Sparkles,
              color: 'from-gold to-yellow-600'
            }
          ].map((offer, index) => (
            <motion.div 
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${offer.color} rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500`}></div>
              <div className="relative bg-card rounded-2xl p-8 border border-gray-800 hover:border-transparent transition duration-500 overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${offer.color} opacity-10 rounded-bl-full`}></div>
                <div className={`w-14 h-14 bg-gradient-to-r ${offer.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                  <offer.icon className="w-7 h-7 text-white" />
                </div>
                <div className={`inline-block px-3 py-1 bg-gradient-to-r ${offer.color} rounded-full text-sm font-bold text-white mb-4`}>
                  {offer.discount}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{offer.title}</h3>
                <p className="text-gray-400 mb-4">{offer.description}</p>
                <div className="flex items-center gap-2 bg-[#1A1A1A] rounded-lg px-4 py-2 border border-gray-700">
                  <span className="text-gray-400 text-sm">Code:</span>
                  <span className="text-primary font-bold">{offer.code}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(offer.code)}
                    className="ml-auto text-gray-500 hover:text-white transition text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Upcoming Releases */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tight">Upcoming Releases</h2>
          <p className="text-muted text-lg">The biggest blockbusters hitting the screen soon</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {upcomingReleases.map((movie, index) => (
            <motion.div 
              key={movie.id}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-card border border-gray-800 rounded-3xl overflow-hidden flex flex-col sm:flex-row relative group"
            >
              <div className="sm:w-2/5 aspect-[3/4] sm:aspect-auto">
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="sm:w-3/5 p-8 flex flex-col justify-center bg-gradient-to-r from-card via-card to-background">
                <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Coming Soon</span>
                <h3 className="text-3xl font-black text-white mb-2 leading-tight">{movie.title}</h3>
                <p className="text-gray-400 mb-8">{movie.genre}</p>
                
                <CountdownTimer releaseDate={movie.releaseDate} />
                
                <button className="mt-8 bg-transparent border-2 border-gray-700 hover:border-primary text-white hover:text-primary py-3 px-6 rounded-xl font-bold transition w-fit flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Set Reminder
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Why TickFlow */}
      <section className="py-24 bg-[#111111] border-t border-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tight">Why TickFlow</h2>
            <p className="text-muted text-lg">The ultimate cinematic experience starts here</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              { icon: Ticket, title: 'Instant Booking', desc: 'Skip the line. Secure your favorite seats in seconds with our lightning-fast booking engine.' },
              { icon: Play, title: 'Live Seat Selection', desc: 'Know exactly where you\'ll sit. Our interactive maps show real-time seat availability.' },
              { icon: CreditCard, title: 'Secure Payments', desc: 'Bank-grade encryption ensures your payment details are always 100% safe and secure.' }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-card rounded-3xl p-10 border border-gray-800 hover:border-primary/50 transition duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full transition duration-500 group-hover:bg-primary/20"></div>
                <div className="w-16 h-16 bg-[#1A1A1A] border border-gray-700 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition duration-500 group-hover:border-primary shadow-lg">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-[#0a0a0a] border-t border-gray-800 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">About TickFlow</h2>
              <div className="w-20 h-1 bg-primary rounded-full mb-6"></div>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                TickFlow is your ultimate destination for seamless movie ticket booking. 
                We bring the cinema experience to your fingertips with instant booking, 
                live seat selection, and secure payments.
              </p>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Whether you're looking for the latest blockbusters or classic films, 
                TickFlow connects you with theaters across the country. Our mission is 
                to make movie watching as easy and enjoyable as possible.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-primary mb-1">50+</div>
                  <div className="text-sm text-gray-400">Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-primary mb-1">200+</div>
                  <div className="text-sm text-gray-400">Theatres</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-primary mb-1">1M+</div>
                  <div className="text-sm text-gray-400">Happy Users</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden border border-gray-800">
                <img 
                  src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop" 
                  alt="Cinema Experience" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-card border border-gray-800 rounded-xl p-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-primary fill-current" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Now Streaming</p>
                    <p className="text-gray-400 text-sm">Latest movies available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shows Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-800">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Shows for {selectedMovie?.title}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {movieShows.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {movieShows.map((show) => (
                    <ShowCard key={show.show_id} show={show} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No shows available for this movie.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
