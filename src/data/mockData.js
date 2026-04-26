export const movies = [
  {
    id: 'm1',
    title: 'John Wick: Chapter 4',
    poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop', // placeholder movie image
    rating: '8.4',
    genre: 'Action, Thriller',
    duration: '2h 49m',
    language: 'English, Hindi',
    description: 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe.',
    trending: true,
  },
  {
    id: 'm2',
    title: 'Inception',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop',
    rating: '8.8',
    genre: 'Sci-Fi, Action',
    duration: '2h 28m',
    language: 'English',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    trending: true,
  },
  {
    id: 'm3',
    title: 'The Dark Knight',
    poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop',
    rating: '9.0',
    genre: 'Action, Crime, Drama',
    duration: '2h 32m',
    language: 'English',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    trending: true,
  },
  {
    id: 'm4',
    title: 'Interstellar',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    rating: '8.6',
    genre: 'Sci-Fi, Adventure',
    duration: '2h 49m',
    language: 'English',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    trending: false,
  }
];

export const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'];

export const shows = {
  'm1': [
    { id: 's1', theatre: 'PVR: Select City Walk, Delhi', time: '10:00 AM', format: 'IMAX 2D', price: 450 },
    { id: 's2', theatre: 'INOX: Nehru Place, Delhi', time: '01:30 PM', format: '2D', price: 300 },
    { id: 's3', theatre: 'Cinepolis: Andheri, Mumbai', time: '06:00 PM', format: '4DX', price: 650 },
  ],
  'm2': [
    { id: 's4', theatre: 'PVR: Phoenix Mall, Bangalore', time: '11:00 AM', format: '2D', price: 350 },
  ]
};

export const generateSeats = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = 12;
  const seats = [];
  
  rows.forEach(row => {
    for (let i = 1; i <= cols; i++) {
      // Randomly book some seats
      const isBooked = Math.random() > 0.7;
      seats.push({
        id: `${row}${i}`,
        row: row,
        number: i,
        status: isBooked ? 'booked' : 'available',
        price: row === 'H' ? 500 : 300 // Premium last row
      });
    }
  });
  return seats;
};
