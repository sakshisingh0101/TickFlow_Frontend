import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ShieldCheck, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

export default function SeatBooking() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);
  
  const show = location.state?.show;

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await api.get(`/public/getSeatsByShow/${showId}`);
        setSeats(response.data.data); // Assuming ApiResponse has data
      } catch (err) {
        console.error('Error fetching seats:', err);
        setError('Unable to load seats. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [showId]);

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        return resolve(true);
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error('Failed to load Razorpay script.'));
      document.body.appendChild(script);
    });
  };

  const handlePaymentVerification = async (paymentDetails) => {
    try {
      const response = await api.post('/payments/verifyPayment', paymentDetails);
      return response.data.data;
    } catch (err) {
      console.error('Payment verification failed:', err);
      throw err;
    }
  };

  const openRazorpayCheckout = async (orderData) => {
    try {
      await loadRazorpayScript();

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.razorpayOrderId,
        name: show?.title || 'TickFlow Booking',
        description: 'Movie ticket booking',
        handler: async (response) => {
          try {
            setPaymentLoading(true);
            await handlePaymentVerification({
              bookingId: bookingInfo.bookingId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            navigate('/dashboard');
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed.');
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: location.state?.show?.theatre_name || 'TickFlow User',
          email: '',
        },
        theme: {
          color: '#E50914'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to open payment checkout.');
    }
  };

  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat.');
      return;
    }

    setError(null);
    setBookingLoading(true);

    try {
      const selectedSeatIds = selectedSeats.map((seat) => seat.id);
      const bookingRes = await api.post('/bookings/createBooking', {
        showId,
        seatIds: selectedSeatIds
      });

      const bookingData = bookingRes.data.data;
      setBookingInfo(bookingData);

      const paymentOrderRes = await api.post(`/payments/createPaymentOrder/${bookingData.bookingId}`);
      const orderData = paymentOrderRes.data.data;
      await openRazorpayCheckout(orderData);
    } catch (err) {
      console.error('Booking or payment error:', err);
      setError(err.response?.data?.message || 'Unable to complete booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.is_booked) return;
    
    if (selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalSeatAmount = selectedSeats.reduce(
    (sum, seat) => sum + Number(seat.base_price || 0),
    0
  );
  const totalAmount = totalSeatAmount;

  if (loading) return <div className="text-white text-center py-20">Loading seats...</div>;

  const showTitle = show?.title || `Show ${showId}`;
  const showLabel = show?.theatre_name ? `${show.theatre_name} • ${new Date(show.start_time).toLocaleString()} • ${show.screen_name}` : `Show ID: ${showId}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800">
        <div>
          <button onClick={() => navigate(-1)} className="text-muted hover:text-white flex items-center gap-2 mb-2 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </button>
          <h1 className="text-2xl font-bold text-white">{showTitle}</h1>
          <p className="text-muted text-sm">{showLabel}</p>
        </div>
        {selectedSeats.length > 0 && (
          <div className="bg-red-900/20 border border-primary/30 rounded-lg px-4 py-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm text-gray-300 font-medium">Hold time: <span className="text-white">04:59</span></span>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Seat Map */}
        <div className="flex-grow overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="mb-12">
              {/* Screen curved line */}
              <div className="w-full h-8 border-t-4 border-primary/40 rounded-[50%/10px] mb-2 shadow-[0_-10px_20px_rgba(229,9,20,0.1)]"></div>
              <p className="text-center text-muted text-xs uppercase tracking-[0.3em]">Screen</p>
            </div>

            <div className="flex flex-col gap-3 items-center">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(row => (
                <div key={row} className="flex items-center gap-4">
                  <span className="w-4 text-muted text-sm font-medium">{row}</span>
                  <div className="flex gap-2">
                    {seats.filter(s => s.row_label === row).map(seat => {
                      const isSelected = selectedSeats.find(s => s.id === seat.id);
                      let seatClass = "w-8 h-8 rounded-t-lg rounded-b-sm flex items-center justify-center text-xs font-bold transition-colors cursor-pointer border ";
                      
                      if (seat.is_booked) {
                        seatClass += "bg-red-900/40 border-red-900/50 text-red-900/50 cursor-not-allowed";
                      } else if (isSelected) {
                        seatClass += "bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]";
                      } else {
                        seatClass += "bg-card border-green-600 text-gray-400 hover:bg-green-900/40 hover:border-green-500 hover:text-white";
                      }

                      return (
                        <motion.button
                          key={seat.id}
                          whileHover={!seat.is_booked ? { scale: 1.1 } : {}}
                          whileTap={!seat.is_booked ? { scale: 0.95 } : {}}
                          className={seatClass}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.is_booked}
                        >
                          {seat.seat_no}
                        </motion.button>
                      );
                    })}
                  </div>
                  <span className="w-4 text-muted text-sm font-medium">{row}</span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-card border border-green-600"></div>
                <span className="text-sm text-muted">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-blue-600 border border-blue-500"></div>
                <span className="text-sm text-muted">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-red-900/40 border border-red-900/50"></div>
                <span className="text-sm text-muted">Booked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-card border border-gray-800 rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Booking Summary</h2>
            
            {selectedSeats.length > 0 ? (
              <>
                <div className="space-y-3 mb-6">
                  {selectedSeats.map(seat => (
                    <div key={seat.id} className="flex justify-between text-sm">
                      <span className="text-gray-300">Seat {seat.row_label}{seat.seat_no}</span>
                      <span className="text-white font-medium">₹{seat.base_price}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-sm pt-3 border-t border-gray-800 mb-3">
                  <span className="text-muted">Estimated seat total</span>
                  <span className="text-white font-medium">₹{totalSeatAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-700 mb-6">
                  <span className="text-white font-bold">Payable</span>
                  <span className="text-2xl font-bold text-primary">₹{totalAmount.toFixed(2)}</span>
                </div>

                {error && (
                  <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-300 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button 
                  onClick={handleProceedToPayment}
                  disabled={bookingLoading || paymentLoading}
                  className="w-full bg-primary hover:bg-red-700 text-white py-3 rounded-lg font-medium transition shadow-[0_0_15px_rgba(229,9,20,0.4)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <ShieldCheck className="w-5 h-5" />
                  {bookingLoading || paymentLoading ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted">Please select seats to continue.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
