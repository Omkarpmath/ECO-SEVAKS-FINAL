import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Twitter, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  const { currentUser } = useAuth();

  return (
    <footer className="bg-primary-text text-gray-200 mt-16 p-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Eco Sevaks</h3>
          <p className="text-gray-300">
            Connecting volunteers with environmental causes across India. Join us in making a difference, one event at a time.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/events" className="hover:text-white">Browse Events</Link></li>
            {!currentUser ? (
              <>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><Link to="/register" className="hover:text-white">Register</Link></li>
              </>
            ) : (
              <li><Link to="/dashboard" className="hover:text-white">My Dashboard</Link></li>
            )}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white"><Twitter /></a>
            <a href="#" className="hover:text-white"><Instagram /></a>
            <a href="#" className="hover:text-white"><Facebook /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-600 mt-8 pt-6 text-center text-gray-400 text-sm">
        © 2025 Eco Sevaks. All rights reserved.
      </div>
    </footer>
  );
}