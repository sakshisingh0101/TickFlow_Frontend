import { Clapperboard, Globe, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-gray-800 mt-20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tighter mb-4">
              <Clapperboard className="w-8 h-8" />
              <span>TickFlow</span>
            </div>
            <p className="text-muted max-w-sm">
              TickFlow — Where Movie Nights Begin. Book your next movie night instantly. Discover shows, choose seats, and pay securely.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-muted">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-4 text-muted">
              <a href="#" className="hover:text-white transition"><Globe className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition"><Mail className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition"><Phone className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-muted text-sm">
          <p>&copy; {new Date().getFullYear()} TickFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
