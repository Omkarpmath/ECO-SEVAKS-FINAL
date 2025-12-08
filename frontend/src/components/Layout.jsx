/**
 * Layout Component
 * ================
 * Main layout wrapper with page transition animations
 * Features:
 * - Animated page transitions (fade-in-up)
 * - Scroll restoration
 * - Scroll-to-top button
 * - Premium gradient background
 * - Floating animated background elements
 */

import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

// ============================================
// ANIMATED BACKGROUND COMPONENT
// Floating decorative elements
// ============================================
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Main gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/20" />

    {/* Animated gradient orbs */}
    <div
      className="
        absolute -top-40 -right-40 
        w-80 h-80 
        bg-primary-200/30 
        rounded-full 
        blur-3xl
        animate-float
      "
      style={{ animationDuration: '8s' }}
    />
    <div
      className="
        absolute top-1/3 -left-20 
        w-60 h-60 
        bg-accent-200/20 
        rounded-full 
        blur-3xl
        animate-float
      "
      style={{ animationDuration: '10s', animationDelay: '2s' }}
    />
    <div
      className="
        absolute bottom-20 right-1/4 
        w-72 h-72 
        bg-secondary-200/20 
        rounded-full 
        blur-3xl
        animate-float
      "
      style={{ animationDuration: '12s', animationDelay: '4s' }}
    />

    {/* Subtle grid pattern */}
    <div
      className="absolute inset-0 opacity-[0.015]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(5, 150, 105, 0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(5, 150, 105, 0.5) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  </div>
);

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-8 right-8 z-50
        p-3 
        bg-primary-600 text-white
        rounded-full
        shadow-lg shadow-primary-500/30
        hover:bg-primary-700 hover:shadow-xl
        hover:-translate-y-1
        transition-all duration-300 ease-out
        ${isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
        }
      `}
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
};

// ============================================
// PAGE TRANSITION WRAPPER
// Animates page content on route change
// ============================================
const PageTransition = ({ children }) => {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setIsAnimating(true);

    // Brief exit animation
    const exitTimeout = setTimeout(() => {
      setDisplayChildren(children);

      // Scroll to top on page change
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Entry animation
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 150);

    return () => clearTimeout(exitTimeout);
  }, [location.pathname, children]);

  return (
    <div
      className={`
        transition-all duration-300 ease-out
        ${isAnimating
          ? 'opacity-0 translate-y-4'
          : 'opacity-100 translate-y-0'
        }
      `}
    >
      {displayChildren}
    </div>
  );
};

// ============================================
// MAIN LAYOUT COMPONENT
// ============================================
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col text-gray-800">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Navigation */}
      <Navbar />

      {/* Main Content with Page Transitions */}
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}