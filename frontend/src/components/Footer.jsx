/**
 * Footer Component
 * ================
 * Premium footer with gradient background and animated elements
 * Features:
 * - Gradient background with glass effect
 * - Animated social media icons
 * - Newsletter subscription (placeholder)
 * - Responsive column layout
 * - Animated link hover effects
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Twitter,
  Instagram,
  Facebook,
  Leaf,
  Mail,
  MapPin,
  Heart,
  ArrowRight,
  Linkedin,
  Github
} from 'lucide-react';

export default function Footer() {
  const { currentUser } = useAuth();
  const currentYear = new Date().getFullYear();

  // ============================================
  // SOCIAL LINK COMPONENT
  // ============================================
  const SocialLink = ({ href, icon: Icon, label }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="
        p-3
        bg-white/10 hover:bg-white/20
        rounded-xl
        text-white/80 hover:text-white
        hover:scale-110 hover:-translate-y-1
        transition-all duration-300 ease-out
      "
    >
      <Icon className="w-5 h-5" />
    </a>
  );

  // ============================================
  // FOOTER LINK COMPONENT
  // ============================================
  const FooterLink = ({ to, children, external = false }) => {
    const linkClasses = `
      group flex items-center gap-2
      text-white/70 hover:text-white
      transition-all duration-300 ease-out
    `;

    if (external) {
      return (
        <a href={to} className={linkClasses} target="_blank" rel="noopener noreferrer">
          <span>{children}</span>
          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </a>
      );
    }

    return (
      <Link to={to} className={linkClasses}>
        <span>{children}</span>
        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </Link>
    );
  };

  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      {/* Content */}
      <div className="relative">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link to="/" className="inline-flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-white/10 backdrop-blur rounded-xl">
                  <Leaf className="w-7 h-7 text-primary-300" />
                </div>
                <span className="text-2xl font-bold text-white font-display">
                  Eco Sevaks
                </span>
              </Link>

              <p className="text-white/70 mb-6 leading-relaxed">
                Connecting passionate volunteers with environmental causes across India.
                Join us in making a difference, one event at a time.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                <SocialLink href="#" icon={Twitter} label="Twitter" />
                <SocialLink href="#" icon={Instagram} label="Instagram" />
                <SocialLink href="#" icon={Facebook} label="Facebook" />
                <SocialLink href="#" icon={Linkedin} label="LinkedIn" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li><FooterLink to="/events">Browse Events</FooterLink></li>
                {!currentUser ? (
                  <>
                    <li><FooterLink to="/login">Login</FooterLink></li>
                    <li><FooterLink to="/register">Register</FooterLink></li>
                  </>
                ) : (
                  <>
                    <li><FooterLink to="/dashboard">My Dashboard</FooterLink></li>
                    <li><FooterLink to="/create-event">Create Event</FooterLink></li>
                  </>
                )}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6">
                Resources
              </h3>
              <ul className="space-y-3">
                <li><FooterLink to="#">About Us</FooterLink></li>
                <li><FooterLink to="#">Our Mission</FooterLink></li>
                <li><FooterLink to="#">Impact Report</FooterLink></li>
                <li><FooterLink to="#">Volunteer Guide</FooterLink></li>
              </ul>
            </div>

            {/* Newsletter Section */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6">
                Stay Updated
              </h3>
              <p className="text-white/70 mb-4">
                Subscribe to our newsletter for the latest events and environmental news.
              </p>

              {/* Newsletter Form */}
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="
                      w-full pl-12 pr-4 py-3
                      bg-white/10 backdrop-blur
                      border border-white/10
                      rounded-xl
                      text-white placeholder:text-white/40
                      focus:outline-none focus:ring-2 focus:ring-primary-400
                      transition-all duration-300
                    "
                  />
                </div>
                <button
                  type="submit"
                  className="
                    w-full py-3
                    bg-primary-500 hover:bg-primary-400
                    text-white font-semibold
                    rounded-xl
                    shadow-lg shadow-primary-500/30
                    hover:shadow-xl hover:-translate-y-0.5
                    transition-all duration-300 ease-out
                  "
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/50 text-sm text-center md:text-left">
                © {currentYear} Eco Sevaks. All rights reserved.
              </p>

              <p className="flex items-center gap-2 text-white/50 text-sm">
                Made with <Heart className="w-4 h-4 text-red-400 animate-pulse" /> for the environment
              </p>

              <div className="flex gap-6 text-sm">
                <FooterLink to="#">Privacy Policy</FooterLink>
                <FooterLink to="#">Terms of Service</FooterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}