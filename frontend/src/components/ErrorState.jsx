/**
 * ErrorState Component
 * ====================
 * Friendly error display with retry functionality
 * Features:
 * - Animated error icon
 * - Custom error messages
 * - Retry button with loading state
 * - Multiple variants (error, network, notFound, server)
 * 
 * Usage:
 * <ErrorState message="Something went wrong" onRetry={() => refetch()} />
 */

import React, { useState } from 'react';
import { AlertCircle, WifiOff, FileQuestion, ServerCrash, RefreshCw } from 'lucide-react';

// ============================================
// ERROR ICONS BY TYPE
// ============================================
const ErrorIcon = ({ type, className = '' }) => {
    const iconProps = {
        className: `w-16 h-16 ${className}`,
        strokeWidth: 1.5,
    };

    switch (type) {
        case 'network':
            return <WifiOff {...iconProps} />;
        case 'notFound':
            return <FileQuestion {...iconProps} />;
        case 'server':
            return <ServerCrash {...iconProps} />;
        default:
            return <AlertCircle {...iconProps} />;
    }
};

// ============================================
// DEFAULT MESSAGES BY ERROR TYPE
// ============================================
const defaultMessages = {
    error: {
        title: 'Something went wrong',
        description: 'An unexpected error occurred. Please try again.',
    },
    network: {
        title: 'Connection lost',
        description: 'Please check your internet connection and try again.',
    },
    notFound: {
        title: 'Not found',
        description: "The resource you're looking for doesn't exist or has been moved.",
    },
    server: {
        title: 'Server error',
        description: 'Our servers are experiencing issues. Please try again later.',
    },
};

// ============================================
// MAIN ERROR STATE COMPONENT
// ============================================
export default function ErrorState({
    type = 'error',
    title,
    message,
    onRetry,
    retryText = 'Try again',
    className = '',
    compact = false,
}) {
    const [isRetrying, setIsRetrying] = useState(false);

    // Get default messages based on type
    const defaultContent = defaultMessages[type] || defaultMessages.error;
    const displayTitle = title || defaultContent.title;
    const displayMessage = message || defaultContent.description;

    // Handle retry with loading state
    const handleRetry = async () => {
        if (!onRetry) return;

        setIsRetrying(true);
        try {
            await onRetry();
        } finally {
            setIsRetrying(false);
        }
    };

    if (compact) {
        return (
            <div
                className={`
          flex items-center gap-3 p-4 
          bg-red-50 border border-red-200 
          rounded-xl text-red-700
          animate-fade-in
          ${className}
        `}
                role="alert"
            >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{displayMessage}</p>
                {onRetry && (
                    <button
                        onClick={handleRetry}
                        disabled={isRetrying}
                        className="
              ml-auto flex items-center gap-1.5 
              text-sm font-medium text-red-600 
              hover:text-red-800 transition-colors
            "
                    >
                        <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                        {retryText}
                    </button>
                )}
            </div>
        );
    }

    return (
        <div
            className={`
        flex flex-col items-center justify-center 
        py-12 px-6 text-center
        animate-fade-in
        ${className}
      `}
            role="alert"
        >
            {/* Animated Error Icon */}
            <div
                className="
          relative p-6 mb-6
          bg-gradient-to-br from-red-100 to-red-50
          rounded-full
          animate-scale-in
        "
            >
                {/* Glow effect */}
                <div
                    className="
            absolute inset-0 
            bg-red-200/50 
            rounded-full 
            blur-xl
            animate-pulse-slow
          "
                />

                <ErrorIcon
                    type={type}
                    className="relative z-10 text-red-500"
                />
            </div>

            {/* Error Title */}
            <h3
                className="
          text-xl font-bold text-gray-900 mb-2
          animate-fade-in-up animation-delay-100
        "
            >
                {displayTitle}
            </h3>

            {/* Error Message */}
            <p
                className="
          text-gray-600 max-w-md mb-6
          animate-fade-in-up animation-delay-200
        "
            >
                {displayMessage}
            </p>

            {/* Retry Button */}
            {onRetry && (
                <button
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="
            inline-flex items-center gap-2
            px-6 py-3
            bg-primary-600 text-white
            font-semibold rounded-xl
            shadow-lg hover:shadow-xl
            hover:bg-primary-700
            transform hover:-translate-y-0.5 active:translate-y-0
            transition-all duration-300 ease-out
            disabled:opacity-50 disabled:cursor-not-allowed
            animate-fade-in-up animation-delay-300
          "
                >
                    <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
                    {isRetrying ? 'Retrying...' : retryText}
                </button>
            )}
        </div>
    );
}
