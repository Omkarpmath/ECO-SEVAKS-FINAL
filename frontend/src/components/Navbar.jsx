import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const NavLinks = ({ isMobile = false }) => (
    <>
      <Link to="/events" className={isMobile ? "block text-gray-600 hover:text-primary" : "text-gray-600 hover:text-primary"} onClick={closeMenu}>Browse Events</Link>

      {currentUser && (
        <>
          <Link to="/create-event" className={isMobile ? "block text-gray-600 hover:text-primary" : "text-gray-600 hover:text-primary"} onClick={closeMenu}>Create Event</Link>
          {currentUser.role === 'admin' && (
            <Link to="/admin" className={isMobile ? "block text-gray-600 hover:text-primary" : "text-gray-600 hover:text-primary"} onClick={closeMenu}>Admin</Link>
          )}
          <Link to="/dashboard" className={isMobile ? "block text-gray-600 hover:text-primary" : "text-gray-600 hover:text-primary"} onClick={closeMenu}>Dashboard</Link>
          <button onClick={handleLogout} className={isMobile ? "block w-full text-left text-gray-600 hover:text-primary" : "text-gray-600 hover:text-primary"}>Logout</button>
        </>
      )}

      {/* Guest Links */}
      {!currentUser && (
        <>
          <Link to="/login" className={isMobile ? "block text-gray-600 hover:text-primary" : "text-gray-600 hover:text-primary"} onClick={closeMenu}>Login</Link>
          <Link to="/register" className={isMobile ? "block" : ""} onClick={closeMenu}>
            <button className={isMobile ? "w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors" : "bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"}>
              Register
            </button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary-text" onClick={closeMenu}>
          Eco Sevaks
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
        </div>
        <button className="md:hidden text-gray-700" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white border-t">
          <NavLinks isMobile={true} />
        </div>
      )}
    </nav>
  );
}