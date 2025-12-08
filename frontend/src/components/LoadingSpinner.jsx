/**
 * LoadingSpinner Component
 * ========================
 * Premium loading states with multiple variants:
 * - spinner: Rotating circle with gradient
 * - dots: Bouncing dots animation
 * - pulse: Pulsing circle
 * - skeleton: Shimmer loading placeholder
 * 
 * Usage:
 * <LoadingSpinner /> - Default spinner
 * <LoadingSpinner variant="dots" />
 * <LoadingSpinner variant="skeleton" className="h-48 w-full" />
 */

import React from 'react';

// ============================================
// SPINNER VARIANT
// Rotating gradient circle with smooth animation
// ============================================
const Spinner = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'h-5 w-5 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
        xl: 'h-16 w-16 border-4',
    };

    return (
        <div
            className={`
        ${sizeClasses[size]}
        rounded-full
        border-primary-200
        border-t-primary-600
        animate-spin
        ${className}
      `}
            role="status"
            aria-label="Loading"
        />
    );
};

// ============================================
// DOTS VARIANT
// Three bouncing dots with staggered animation
// ============================================
const Dots = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'h-1.5 w-1.5',
        md: 'h-2.5 w-2.5',
        lg: 'h-3 w-3',
        xl: 'h-4 w-4',
    };

    return (
        <div className={`flex items-center gap-1 ${className}`} role="status" aria-label="Loading">
            {[0, 1, 2].map((index) => (
                <div
                    key={index}
                    className={`
            ${sizeClasses[size]}
            bg-primary-500
            rounded-full
            animate-bounce
          `}
                    style={{
                        animationDelay: `${index * 150}ms`,
                        animationDuration: '0.8s',
                    }}
                />
            ))}
        </div>
    );
};

// ============================================
// PULSE VARIANT
// Pulsing circle with glow effect
// ============================================
const Pulse = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-10 w-10',
        xl: 'h-14 w-14',
    };

    return (
        <div className={`relative ${className}`} role="status" aria-label="Loading">
            <div
                className={`
          ${sizeClasses[size]}
          bg-primary-500
          rounded-full
          animate-pulse-slow
        `}
            />
            <div
                className={`
          absolute inset-0
          ${sizeClasses[size]}
          bg-primary-400
          rounded-full
          animate-ping
          opacity-75
        `}
            />
        </div>
    );
};

// ============================================
// SKELETON VARIANT
// Shimmer effect placeholder for content loading
// ============================================
const Skeleton = ({ className = '', variant = 'text', lines = 3 }) => {
    const baseClasses = 'shimmer rounded';

    if (variant === 'avatar') {
        return (
            <div
                className={`${baseClasses} h-12 w-12 rounded-full ${className}`}
                role="status"
                aria-label="Loading"
            />
        );
    }

    if (variant === 'card') {
        return (
            <div className={`${baseClasses} rounded-xl ${className}`} role="status" aria-label="Loading">
                <div className="h-48 w-full" />
            </div>
        );
    }

    if (variant === 'image') {
        return (
            <div
                className={`${baseClasses} aspect-video w-full rounded-xl ${className}`}
                role="status"
                aria-label="Loading"
            />
        );
    }

    // Default: text lines
    return (
        <div className={`space-y-3 ${className}`} role="status" aria-label="Loading">
            {Array.from({ length: lines }).map((_, index) => (
                <div
                    key={index}
                    className={`${baseClasses} h-4`}
                    style={{
                        width: index === lines - 1 ? '70%' : '100%',
                    }}
                />
            ))}
        </div>
    );
};

// ============================================
// CARD SKELETON
// Full card placeholder with image and text
// ============================================
const CardSkeleton = ({ className = '' }) => {
    return (
        <div
            className={`bg-white rounded-2xl shadow-card overflow-hidden ${className}`}
            role="status"
            aria-label="Loading"
        >
            {/* Image placeholder */}
            <div className="shimmer h-48 w-full" />

            {/* Content placeholder */}
            <div className="p-4 space-y-4">
                {/* Title */}
                <div className="shimmer h-6 w-3/4 rounded" />

                {/* Subtitle */}
                <div className="shimmer h-4 w-1/2 rounded" />

                {/* Description lines */}
                <div className="space-y-2">
                    <div className="shimmer h-3 w-full rounded" />
                    <div className="shimmer h-3 w-5/6 rounded" />
                </div>

                {/* Meta info */}
                <div className="flex gap-4">
                    <div className="shimmer h-4 w-24 rounded" />
                    <div className="shimmer h-4 w-20 rounded" />
                </div>

                {/* Button */}
                <div className="shimmer h-10 w-full rounded-xl" />
            </div>
        </div>
    );
};

// ============================================
// PAGE LOADER
// Full page loading overlay
// ============================================
const PageLoader = ({ message = 'Loading...' }) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="relative">
                {/* Outer rotating ring */}
                <div className="h-16 w-16 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />

                {/* Inner pulsing dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-4 bg-primary-500 rounded-full animate-pulse" />
                </div>
            </div>

            {/* Loading message */}
            <p className="mt-4 text-gray-600 font-medium animate-pulse">{message}</p>
        </div>
    );
};

// ============================================
// INLINE LOADER
// Small inline loading indicator
// ============================================
const InlineLoader = ({ text = 'Loading' }) => {
    return (
        <span className="inline-flex items-center gap-2 text-gray-500">
            <Spinner size="sm" />
            <span>{text}</span>
        </span>
    );
};

// ============================================
// MAIN COMPONENT
// Unified loading component with variants
// ============================================
export default function LoadingSpinner({
    variant = 'spinner',
    size = 'md',
    className = '',
    message,
    lines,
    skeletonVariant,
}) {
    switch (variant) {
        case 'dots':
            return <Dots size={size} className={className} />;
        case 'pulse':
            return <Pulse size={size} className={className} />;
        case 'skeleton':
            return <Skeleton className={className} variant={skeletonVariant} lines={lines} />;
        case 'card':
            return <CardSkeleton className={className} />;
        case 'page':
            return <PageLoader message={message} />;
        case 'inline':
            return <InlineLoader text={message} />;
        default:
            return <Spinner size={size} className={className} />;
    }
}

// Export individual components for direct use
export { Spinner, Dots, Pulse, Skeleton, CardSkeleton, PageLoader, InlineLoader };
