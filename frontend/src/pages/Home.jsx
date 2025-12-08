/**
 * Home Page Component
 * ===================
 * Premium landing page with advanced animations
 * Features:
 * - Animated hero section with parallax
 * - Floating decorative elements
 * - Scroll-triggered section animations
 * - Interactive feature cards with stagger effect
 * - Stats section with counter animation
 * - Premium CTA section
 */

import { Link } from 'react-router-dom';
import {
  Search,
  UserPlus,
  Heart,
  Leaf,
  Users,
  Calendar,
  MapPin,
  ArrowRight,
  TreeDeciduous,
  Sparkles,
  Globe,
  Award
} from 'lucide-react';
import { useScrollAnimation, useCountAnimation } from '../hooks/useScrollAnimation';

// ============================================
// ANIMATED STAT COMPONENT
// ============================================
const AnimatedStat = ({ value, label, suffix = '' }) => {
  const { ref, count } = useCountAnimation({ end: value, duration: 2000 });

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl md:text-5xl font-bold text-white mb-2">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-primary-200 font-medium">{label}</p>
    </div>
  );
};

// ============================================
// FEATURE CARD COMPONENT
// ============================================
const FeatureCard = ({ icon: Icon, title, description, to, image, index }) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <Link
      ref={ref}
      to={to}
      className={`
        group relative
        bg-white rounded-2xl
        shadow-card hover:shadow-card-hover
        overflow-hidden
        transition-all duration-500 ease-out
        hover:-translate-y-2
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src = `https://placehold.co/600x400/059669/white?text=${encodeURIComponent(title)}`;
            e.target.onerror = null;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Icon Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="p-3 bg-white/90 backdrop-blur rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600">{description}</p>

        {/* Arrow indicator */}
        <div className="mt-4 flex items-center text-primary-600 font-medium">
          <span>Learn more</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

// ============================================
// MAIN HOME COMPONENT
// ============================================
export default function Home() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();
  const { ref: missionRef, isVisible: missionVisible } = useScrollAnimation();

  return (
    <div className="space-y-24">
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section
        ref={heroRef}
        className="relative rounded-3xl overflow-hidden mx-0 md:mx-0"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2013"
            alt="Volunteers working together in nature"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://placehold.co/1920x800/059669/white?text=Eco+Sevaks';
              e.target.onerror = null;
            }}
          />
          {/* Gradient Overlays - dramatic dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900/95 via-dark-900/80 to-primary-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/70 via-transparent to-dark-900/30" />
        </div>

        {/* Floating decorative elements - more vibrant */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-primary-400/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-accent-400/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-secondary-400/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />

        {/* Content - reduced padding for smaller height */}
        <div className="relative z-10 container mx-auto px-6 py-16 md:py-20 max-w-4xl text-center md:text-left md:max-w-none">
          <div className="md:w-2/3 lg:w-1/2">
            {/* Badge */}
            <div
              className={`
                inline-flex items-center gap-2 mb-6
                px-4 py-2 
                bg-white/10 backdrop-blur-md 
                border border-white/20 
                rounded-full
                text-white/90
                transition-all duration-700
                ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
            >
              <Sparkles className="w-4 h-4 text-secondary-400" />
              <span className="text-sm font-medium">Join 10,000+ volunteers across India</span>
            </div>

            {/* Heading */}
            <h1
              className={`
                text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6
                leading-tight
                transition-all duration-700 delay-100
                ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
            >
              Join the{' '}
              <span className="text-gradient-gold">Green Movement</span>
              {' '}in India
            </h1>

            {/* Subtitle */}
            <p
              className={`
                text-lg md:text-xl text-gray-200 mb-8
                transition-all duration-700 delay-200
                ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
            >
              Find virtual and in-person environmental volunteer opportunities near you.
              Make a real difference for our planet, one event at a time.
            </p>

            {/* CTA Buttons */}
            <div
              className={`
                flex flex-col sm:flex-row gap-4 justify-center md:justify-start
                transition-all duration-700 delay-300
                ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
            >
              <Link
                to="/events"
                className="
                  inline-flex items-center justify-center gap-2
                  px-8 py-4
                  bg-primary-500 hover:bg-primary-600
                  text-white text-lg font-semibold
                  rounded-xl
                  shadow-lg shadow-primary-500/30
                  hover:shadow-xl hover:-translate-y-1
                  transition-all duration-300
                "
              >
                <Search className="w-5 h-5" />
                Find Events
              </Link>

              <Link
                to="/register"
                className="
                  inline-flex items-center justify-center gap-2
                  px-8 py-4
                  bg-white/10 hover:bg-white/20
                  backdrop-blur-md
                  border border-white/30
                  text-white text-lg font-semibold
                  rounded-xl
                  hover:-translate-y-1
                  transition-all duration-300
                "
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ============================================
          STATS SECTION
          ============================================ */}
      <section
        ref={statsRef}
        className={`
          -mx-4 md:-mx-6 px-4 md:px-6 py-16
          bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800
          transition-all duration-700
          ${statsVisible ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedStat value={10000} label="Volunteers" suffix="+" />
            <AnimatedStat value={500} label="Events Completed" suffix="+" />
            <AnimatedStat value={50} label="Cities Covered" suffix="+" />
            <AnimatedStat value={25000} label="Trees Planted" suffix="+" />
          </div>
        </div>
      </section>

      {/* ============================================
          HOW IT WORKS SECTION
          ============================================ */}
      <section className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our community of eco-warriors in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Search}
            title="1. Browse"
            description="Explore events by category, type, or location. Find causes that match your passion."
            to="/events"
            image="https://images.unsplash.com/photo-1660816906120-870d60f0fa77?auto=format&fit=crop&q=80&w=800"
            index={0}
          />
          <FeatureCard
            icon={UserPlus}
            title="2. Join"
            description="Sign up for events with one click. Get all the details you need to participate."
            to="/register"
            image="https://images.unsplash.com/photo-1678699255640-a1b75cec7718?auto=format&fit=crop&q=80&w=800"
            index={1}
          />
          <FeatureCard
            icon={Heart}
            title="3. Participate"
            description="Make a real difference for the environment. Connect with like-minded volunteers."
            to="/events"
            image="https://images.unsplash.com/photo-1607074245269-848539fe3335?auto=format&fit=crop&q=80&w=800"
            index={2}
          />
        </div>
      </section>

      {/* ============================================
          MISSION SECTION
          ============================================ */}
      <section
        ref={missionRef}
        className={`
          container mx-auto
          transition-all duration-700
          ${missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
                alt="Environmental conservation"
                className="w-full h-80 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 via-transparent to-transparent" />
            </div>
            {/* Floating stats card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <TreeDeciduous className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">25,000+</p>
                  <p className="text-gray-600">Trees Planted</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              Our Mission
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Building a Greener India, Together
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              Eco Sevaks connects passionate volunteers with meaningful environmental
              initiatives across India. From tree plantation drives to beach cleanups,
              we make it easy to find and join causes that matter to you.
            </p>

            {/* Feature list */}
            <div className="space-y-4 mb-8">
              {[
                { icon: Globe, text: 'Connect with local environmental initiatives' },
                { icon: Users, text: 'Meet like-minded eco-conscious volunteers' },
                { icon: Award, text: 'Track your impact and earn recognition' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <item.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>

            <Link
              to="/events"
              className="
                inline-flex items-center gap-2
                px-6 py-3
                bg-primary-600 text-white
                font-semibold rounded-xl
                shadow-lg shadow-primary-500/25
                hover:bg-primary-700 hover:shadow-xl hover:-translate-y-0.5
                transition-all duration-300
              "
            >
              Explore Opportunities
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section className="-mx-4 md:-mx-6 px-4 md:px-6">
        <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 container mx-auto py-16 px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of volunteers who are already creating positive environmental
              change across India. Your journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="
                  inline-flex items-center justify-center gap-2
                  px-8 py-4
                  bg-white text-primary-700
                  font-semibold text-lg
                  rounded-xl
                  shadow-lg
                  hover:bg-gray-50 hover:-translate-y-1
                  transition-all duration-300
                "
              >
                <Leaf className="w-5 h-5" />
                Join Eco Sevaks
              </Link>
              <Link
                to="/events"
                className="
                  inline-flex items-center justify-center gap-2
                  px-8 py-4
                  bg-white/10 backdrop-blur
                  border border-white/30
                  text-white
                  font-semibold text-lg
                  rounded-xl
                  hover:bg-white/20 hover:-translate-y-1
                  transition-all duration-300
                "
              >
                Browse Events
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}