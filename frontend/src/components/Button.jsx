/**
 * Button Component
 * ================
 * Premium button with multiple variants and states
 * Features:
 * - 5 variants: primary, secondary, ghost, outline, danger
 * - 3 sizes: sm, md, lg
 * - Loading state with spinner
 * - Icon support (left/right)
 * - Ripple effect on click
 * - Smooth hover animations
 * 
 * Usage:
 * <Button variant="primary" size="lg" leftIcon={<Plus />}>Create Event</Button>
 * <Button loading>Saving...</Button>
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

// ============================================
// VARIANT STYLES
// ============================================
const variants = {
    primary: `
    bg-primary-600 text-white 
    hover:bg-primary-700 active:bg-primary-800
    shadow-lg hover:shadow-xl hover:shadow-primary-500/25
    focus:ring-4 focus:ring-primary-300
  `,
    secondary: `
    bg-white text-primary-700 
    border-2 border-primary-200 
    hover:border-primary-400 hover:bg-primary-50
    shadow-md hover:shadow-lg
    focus:ring-4 focus:ring-primary-100
  `,
    ghost: `
    text-primary-700 
    hover:bg-primary-50 active:bg-primary-100
    focus:ring-4 focus:ring-primary-100
  `,
    outline: `
    bg-transparent text-gray-700 
    border-2 border-gray-200 
    hover:border-gray-400 hover:bg-gray-50
    focus:ring-4 focus:ring-gray-100
  `,
    danger: `
    bg-red-600 text-white 
    hover:bg-red-700 active:bg-red-800
    shadow-lg hover:shadow-xl hover:shadow-red-500/25
    focus:ring-4 focus:ring-red-300
  `,
    success: `
    bg-emerald-600 text-white 
    hover:bg-emerald-700 active:bg-emerald-800
    shadow-lg hover:shadow-xl hover:shadow-emerald-500/25
    focus:ring-4 focus:ring-emerald-300
  `,
};

// ============================================
// SIZE STYLES
// ============================================
const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5',
};

// ============================================
// MAIN BUTTON COMPONENT
// ============================================
export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    loading = false,
    disabled = false,
    fullWidth = false,
    className = '',
    onClick,
    type = 'button',
    ...props
}) {
    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`
        /* Base styles */
        inline-flex items-center justify-center
        font-semibold rounded-xl
        transition-all duration-300 ease-out
        transform hover:-translate-y-0.5 active:translate-y-0
        
        /* Variant styles */
        ${variants[variant] || variants.primary}
        
        /* Size styles */
        ${sizes[size] || sizes.md}
        
        /* Full width */
        ${fullWidth ? 'w-full' : ''}
        
        /* Disabled state */
        ${isDisabled ? 'opacity-60 cursor-not-allowed hover:translate-y-0 hover:shadow-lg' : ''}
        
        /* Ripple effect container */
        relative overflow-hidden
        
        /* Custom classes */
        ${className}
      `}
            {...props}
        >
            {/* Loading spinner */}
            {loading && (
                <Loader2 className="w-5 h-5 animate-spin" />
            )}

            {/* Left icon */}
            {!loading && leftIcon && (
                <span className="flex-shrink-0">{leftIcon}</span>
            )}

            {/* Button text */}
            <span className={loading ? 'opacity-0' : ''}>
                {children}
            </span>
            {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin" />
                </span>
            )}

            {/* Right icon */}
            {!loading && rightIcon && (
                <span className="flex-shrink-0">{rightIcon}</span>
            )}
        </button>
    );
}

// ============================================
// ICON BUTTON VARIANT
// For icon-only buttons with tooltip support
// ============================================
export function IconButton({
    icon,
    variant = 'ghost',
    size = 'md',
    label,
    loading = false,
    disabled = false,
    className = '',
    onClick,
    ...props
}) {
    const isDisabled = disabled || loading;

    const iconSizes = {
        sm: 'p-2',
        md: 'p-3',
        lg: 'p-4',
    };

    const iconDimensions = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isDisabled}
            aria-label={label}
            title={label}
            className={`
        /* Base styles */
        inline-flex items-center justify-center
        rounded-xl
        transition-all duration-300 ease-out
        transform hover:-translate-y-0.5 active:translate-y-0
        
        /* Variant styles */
        ${variants[variant] || variants.ghost}
        
        /* Size styles */
        ${iconSizes[size] || iconSizes.md}
        
        /* Disabled state */
        ${isDisabled ? 'opacity-60 cursor-not-allowed hover:translate-y-0' : ''}
        
        /* Custom classes */
        ${className}
      `}
            {...props}
        >
            {loading ? (
                <Loader2 className={`${iconDimensions[size]} animate-spin`} />
            ) : (
                <span className={iconDimensions[size]}>{icon}</span>
            )}
        </button>
    );
}

// ============================================
// BUTTON GROUP
// For grouping related buttons
// ============================================
export function ButtonGroup({ children, className = '' }) {
    return (
        <div
            className={`
        inline-flex rounded-xl overflow-hidden
        shadow-md
        ${className}
      `}
        >
            {React.Children.map(children, (child, index) => {
                if (!React.isValidElement(child)) return child;

                return React.cloneElement(child, {
                    className: `
            ${child.props.className || ''}
            rounded-none
            ${index === 0 ? 'rounded-l-xl' : ''}
            ${index === React.Children.count(children) - 1 ? 'rounded-r-xl' : ''}
            border-r border-white/20 last:border-r-0
          `,
                });
            })}
        </div>
    );
}
