/**
 * EmptyState Component
 * ====================
 * Friendly empty state display for no-data scenarios
 * Features:
 * - Custom illustrations with animated icons
 * - Multiple preset types (events, search, notifications, etc.)
 * - Call-to-action button support
 * - Animated entrance
 * 
 * Usage:
 * <EmptyState type="events" actionText="Create Event" onAction={() => navigate('/create')} />
 */

import React from 'react';
import {
    Calendar,
    Search,
    Bell,
    Users,
    Inbox,
    Leaf,
    Heart,
    Plus
} from 'lucide-react';

// ============================================
// PRESET CONFIGURATIONS
// ============================================
const presets = {
    events: {
        icon: Calendar,
        title: 'No events yet',
        description: 'Be the first to create an event and make a difference in your community!',
    },
    search: {
        icon: Search,
        title: 'No results found',
        description: 'Try adjusting your search terms or filters to find what you\'re looking for.',
    },
    notifications: {
        icon: Bell,
        title: 'All caught up!',
        description: 'You have no new notifications. Check back later for updates.',
    },
    users: {
        icon: Users,
        title: 'No participants yet',
        description: 'Be the first to join this event and inspire others to participate!',
    },
    inbox: {
        icon: Inbox,
        title: 'Your inbox is empty',
        description: 'When you receive messages, they\'ll appear here.',
    },
    joined: {
        icon: Heart,
        title: 'No joined events',
        description: 'Browse events and join ones that match your interests!',
    },
    created: {
        icon: Leaf,
        title: 'No created events',
        description: 'Start making an impact by creating your first environmental event!',
    },
    default: {
        icon: Inbox,
        title: 'Nothing here',
        description: 'There\'s no content to display at the moment.',
    },
};

// ============================================
// ANIMATED ICON WRAPPER
// ============================================
const AnimatedIcon = ({ icon: Icon, className = '' }) => {
    return (
        <div
            className={`
        relative p-6 mb-6
        bg-gradient-to-br from-primary-100 to-primary-50
        rounded-full
        animate-scale-in
        ${className}
      `}
        >
            {/* Floating animation rings */}
            <div
                className="
          absolute inset-0 
          bg-primary-200/30 
          rounded-full 
          animate-ping
          animation-delay-300
        "
                style={{ animationDuration: '2s' }}
            />
            <div
                className="
          absolute inset-2 
          bg-primary-200/20 
          rounded-full 
          animate-ping
          animation-delay-500
        "
                style={{ animationDuration: '2.5s' }}
            />

            {/* Main icon */}
            <Icon
                className="
          relative z-10 
          w-12 h-12 
          text-primary-500
          animate-float
        "
                strokeWidth={1.5}
            />
        </div>
    );
};

// ============================================
// MAIN EMPTY STATE COMPONENT
// ============================================
export default function EmptyState({
    type = 'default',
    icon,
    title,
    description,
    actionText,
    onAction,
    secondaryActionText,
    onSecondaryAction,
    className = '',
    compact = false,
}) {
    // Get preset or use custom props
    const preset = presets[type] || presets.default;
    const IconComponent = icon || preset.icon;
    const displayTitle = title || preset.title;
    const displayDescription = description || preset.description;

    if (compact) {
        return (
            <div
                className={`
          flex items-center gap-4 p-6
          bg-gray-50 border border-gray-100
          rounded-xl
          animate-fade-in
          ${className}
        `}
            >
                <div className="p-3 bg-primary-100 rounded-full">
                    <IconComponent className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{displayTitle}</h4>
                    <p className="text-sm text-gray-500">{displayDescription}</p>
                </div>
                {actionText && onAction && (
                    <button
                        onClick={onAction}
                        className="
              px-4 py-2 
              text-primary-600 font-medium 
              hover:bg-primary-50 
              rounded-lg transition-colors
            "
                    >
                        {actionText}
                    </button>
                )}
            </div>
        );
    }

    return (
        <div
            className={`
        flex flex-col items-center justify-center 
        py-16 px-6 text-center
        ${className}
      `}
        >
            {/* Animated Icon */}
            <AnimatedIcon icon={IconComponent} />

            {/* Title */}
            <h3
                className="
          text-xl font-bold text-gray-900 mb-2
          animate-fade-in-up animation-delay-100
        "
            >
                {displayTitle}
            </h3>

            {/* Description */}
            <p
                className="
          text-gray-600 max-w-md mb-8
          animate-fade-in-up animation-delay-200
        "
            >
                {displayDescription}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center animate-fade-in-up animation-delay-300">
                {actionText && onAction && (
                    <button
                        onClick={onAction}
                        className="
              inline-flex items-center gap-2
              px-6 py-3
              bg-primary-600 text-white
              font-semibold rounded-xl
              shadow-lg hover:shadow-xl
              hover:bg-primary-700
              transform hover:-translate-y-0.5 active:translate-y-0
              transition-all duration-300 ease-out
            "
                    >
                        <Plus className="w-5 h-5" />
                        {actionText}
                    </button>
                )}

                {secondaryActionText && onSecondaryAction && (
                    <button
                        onClick={onSecondaryAction}
                        className="
              px-6 py-3
              text-primary-700 font-semibold
              bg-primary-50 hover:bg-primary-100
              rounded-xl
              transition-all duration-300 ease-out
            "
                    >
                        {secondaryActionText}
                    </button>
                )}
            </div>
        </div>
    );
}
