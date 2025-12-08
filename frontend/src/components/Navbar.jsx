/**
 * Navbar Component
 * ================
 * Premium navigation with glassmorphism and smooth animations
 * Features:
 * - Glassmorphism effect with backdrop blur
 * - Scroll-based opacity and shadow changes
 * - Animated mobile menu with slide transitions
 * - Link hover effects with underline animations
 * - User avatar dropdown (future enhancement)
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  Leaf,
  LogOut,
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Shield,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Check if a link is active
  const isActive = (path) => location.pathname === path;

  // ============================================
  // NAVIGATION LINK COMPONENT
  // ============================================
  const NavLink = ({ to, children, icon: Icon, onClick, isMobile = false }) => (
    <Link
      to={to}
      onClick={onClick || closeMenu}
      className={`
        group relative flex items-center gap-2
        font-medium
        transition-all duration-300 ease-out
        
        ${isMobile
          ? 'px-4 py-3 rounded-xl hover:bg-primary-50 w-full'
          : 'px-3 py-2'
        }
        
        ${isActive(to)
          ? 'text-primary-600'
          : 'text-gray-600 hover:text-primary-600'
        }
      `}
    >
      {/* Icon for mobile */}
      {Icon && isMobile && (
        <Icon className="w-5 h-5" />
      )}

      {/* Link text */}
      <span>{children}</span>

      {/* Animated underline for desktop */}
      {!isMobile && (
        <span
          className={`
            absolute bottom-0 left-1/2 -translate-x-1/2
            h-0.5 bg-primary-500 rounded-full
            transition-all duration-300 ease-out
            ${isActive(to) ? 'w-full' : 'w-0 group-hover:w-full'}
          `}
        />
      )}
    </Link>
  );

  // ============================================
  // DESKTOP NAVIGATION LINKS
  // ============================================
  const DesktopLinks = () => (
    <div className="hidden md:flex items-center gap-2">
      <NavLink to="/events" icon={Calendar}>Browse Events</NavLink>

      {currentUser ? (
        <>
          <NavLink to="/create-event" icon={PlusCircle}>Create Event</NavLink>

          {currentUser.role === 'admin' && (
            <NavLink to="/admin" icon={Shield}>Admin</NavLink>
          )}

          <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-2
              px-4 py-2 ml-2
              text-gray-600 font-medium
              hover:text-red-600
              hover:bg-red-50
              rounded-xl
              transition-all duration-300 ease-out
            "
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>

          {/* Register CTA Button */}
          <Link
            to="/register"
            className="
              ml-2 px-6 py-2.5
              bg-primary-600 text-white
              font-semibold rounded-xl
              shadow-lg shadow-primary-500/25
              hover:bg-primary-700 hover:shadow-xl hover:-translate-y-0.5
              active:translate-y-0
              transition-all duration-300 ease-out
            "
          >
            Get Started
          </Link>
        </>
      )}
    </div>
  );

  // ============================================
  // MOBILE NAVIGATION MENU
  // ============================================
  const MobileMenu = () => (
    <div
      className={`
        md:hidden
        fixed inset-x-0 top-[72px]
        bg-white/95 backdrop-blur-xl
        border-t border-gray-100
        shadow-xl
        transition-all duration-300 ease-out
        ${isMobileMenuOpen
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4 pointer-events-none'
        }
      `}
    >
      <nav className="container mx-auto p-4 space-y-1">
        <NavLink to="/events" icon={Calendar} isMobile>
          Browse Events
        </NavLink>

        {currentUser ? (
          <>
            <NavLink to="/create-event" icon={PlusCircle} isMobile>
              Create Event
            </NavLink>

            {currentUser.role === 'admin' && (
              <NavLink to="/admin" icon={Shield} isMobile>
                Admin Panel
              </NavLink>
            )}

            <NavLink to="/dashboard" icon={LayoutDashboard} isMobile>
              Dashboard
            </NavLink>

            <hr className="my-2 border-gray-100" />

            {/* User info */}
            <div className="px-4 py-3 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="font-medium text-gray-900 truncate">
                {currentUser.name || currentUser.email}
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="
                flex items-center gap-2
                w-full px-4 py-3
                text-red-600 font-medium
                hover:bg-red-50
                rounded-xl
                transition-all duration-300 ease-out
              "
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" isMobile>
              Login
            </NavLink>

            <Link
              to="/register"
              onClick={closeMenu}
              className="
                flex items-center justify-center
                w-full px-4 py-3 mt-2
                bg-primary-600 text-white
                font-semibold rounded-xl
                shadow-lg shadow-primary-500/25
                hover:bg-primary-700
                transition-all duration-300 ease-out
              "
            >
              Get Started
            </Link>
          </>
        )}
      </nav>
    </div>
  );

  // ============================================
  // MAIN NAVBAR RENDER
  // ============================================
  return (
    <>
      <nav
        className={`
          sticky top-0 z-50
          transition-all duration-300 ease-out
          
          ${isScrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-200/50'
            : 'bg-white/50 backdrop-blur-md'
          }
        `}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link
              to="/"
              onClick={closeMenu}
              className="
                flex items-center gap-2
                text-2xl font-bold
                text-primary-700
                hover:text-primary-600
                transition-colors duration-300
              "
            >
              <div
                className="
                  p-2 
                  bg-gradient-to-br from-primary-500 to-primary-600
                  rounded-xl
                  shadow-lg shadow-primary-500/30
                "
              >
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="font-display">Eco Sevaks</span>
            </Link>

            {/* Desktop Navigation */}
            <DesktopLinks />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="
                md:hidden
                p-2 rounded-xl
                text-gray-600 hover:text-primary-600
                hover:bg-primary-50
                transition-all duration-300 ease-out
              "
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`
                    absolute inset-0
                    transition-all duration-300
                    ${isMobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}
                  `}
                />
                <X
                  className={`
                    absolute inset-0
                    transition-all duration-300
                    ${isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}
                  `}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <MobileMenu />

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMenu}
        />
      )}
    </>
  );
}