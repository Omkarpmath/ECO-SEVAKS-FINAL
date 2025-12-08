/**
 * Card Component
 * ==============
 * Premium card with glassmorphism and gradient effects
 * Features:
 * - 4 variants: default, glass, gradient, outlined
 * - Hover animations (lift, glow, scale)
 * - Optional header and footer slots
 * - Image support with overlay options
 * - Interactive click behavior
 * 
 * Usage:
 * <Card variant="glass" hover="lift">
 *   <Card.Header>Title</Card.Header>
 *   <Card.Body>Content</Card.Body>
 * </Card>
 */

import React from 'react';

// ============================================
// VARIANT STYLES
// ============================================
const variants = {
    default: `
    bg-white 
    border border-gray-100
    shadow-card
  `,
    glass: `
    bg-white/70 backdrop-blur-xl
    border border-white/30
    shadow-glass
  `,
    gradient: `
    bg-gradient-to-br from-primary-500 to-primary-700
    text-white
    shadow-lg shadow-primary-500/30
  `,
    outlined: `
    bg-transparent
    border-2 border-gray-200
    hover:border-gray-300
  `,
    dark: `
    bg-dark-800
    text-white
    border border-dark-700
    shadow-lg
  `,
};

// ============================================
// HOVER EFFECT STYLES
// ============================================
const hoverEffects = {
    none: '',
    lift: 'hover:-translate-y-2 hover:shadow-xl',
    glow: 'hover:shadow-glow',
    scale: 'hover:scale-[1.02]',
    border: 'hover:border-primary-300',
};

// ============================================
// CARD HEADER COMPONENT
// ============================================
const CardHeader = ({ children, className = '' }) => (
    <div
        className={`
      px-6 py-4
      border-b border-gray-100
      ${className}
    `}
    >
        {children}
    </div>
);

// ============================================
// CARD BODY COMPONENT
// ============================================
const CardBody = ({ children, className = '' }) => (
    <div className={`px-6 py-4 ${className}`}>
        {children}
    </div>
);

// ============================================
// CARD FOOTER COMPONENT
// ============================================
const CardFooter = ({ children, className = '' }) => (
    <div
        className={`
      px-6 py-4
      border-t border-gray-100
      bg-gray-50/50
      rounded-b-2xl
      ${className}
    `}
    >
        {children}
    </div>
);

// ============================================
// CARD IMAGE COMPONENT
// ============================================
const CardImage = ({
    src,
    alt,
    className = '',
    overlay = false,
    overlayOpacity = 0.3,
    overlayGradient = false,
}) => (
    <div className={`relative overflow-hidden ${className}`}>
        <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
                e.target.src = `https://placehold.co/600x400/059669/white?text=${encodeURIComponent(alt || 'Image')}`;
                e.target.onerror = null;
            }}
        />

        {/* Simple overlay */}
        {overlay && !overlayGradient && (
            <div
                className="absolute inset-0 bg-black transition-opacity duration-300"
                style={{ opacity: overlayOpacity }}
            />
        )}

        {/* Gradient overlay */}
        {overlayGradient && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        )}
    </div>
);

// ============================================
// MAIN CARD COMPONENT
// ============================================
function Card({
    children,
    variant = 'default',
    hover = 'lift',
    onClick,
    className = '',
    padding = true,
    rounded = '2xl',
    as: Component = 'div',
    ...props
}) {
    const isInteractive = !!onClick;

    return (
        <Component
            onClick={onClick}
            className={`
        /* Base styles */
        group
        rounded-${rounded}
        overflow-hidden
        transition-all duration-300 ease-out
        
        /* Variant styles */
        ${variants[variant] || variants.default}
        
        /* Hover effects */
        ${hoverEffects[hover] || ''}
        
        /* Interactive cursor */
        ${isInteractive ? 'cursor-pointer' : ''}
        
        /* Padding */
        ${padding ? '' : ''}
        
        /* Custom classes */
        ${className}
      `}
            {...props}
        >
            {children}
        </Component>
    );
}

// Attach sub-components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Image = CardImage;

export default Card;

// ============================================
// FEATURE CARD
// Pre-styled card for feature sections
// ============================================
export function FeatureCard({
    icon: Icon,
    title,
    description,
    className = '',
    iconClassName = '',
}) {
    return (
        <Card hover="lift" className={`p-6 text-center ${className}`}>
            {Icon && (
                <div
                    className={`
            inline-flex items-center justify-center
            w-14 h-14 mb-4
            bg-primary-100 text-primary-600
            rounded-2xl
            transition-transform duration-300
            group-hover:scale-110
            ${iconClassName}
          `}
                >
                    <Icon className="w-7 h-7" />
                </div>
            )}

            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </Card>
    );
}

// ============================================
// STATS CARD
// Pre-styled card for statistics display
// ============================================
export function StatsCard({
    icon: Icon,
    value,
    label,
    trend,
    trendUp = true,
    className = '',
}) {
    return (
        <Card hover="glow" className={`p-6 ${className}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
                    <p className="text-sm text-gray-500">{label}</p>

                    {trend && (
                        <p
                            className={`
                text-sm font-medium mt-2
                ${trendUp ? 'text-emerald-600' : 'text-red-600'}
              `}
                        >
                            {trendUp ? '↑' : '↓'} {trend}
                        </p>
                    )}
                </div>

                {Icon && (
                    <div
                        className="
              p-3 
              bg-primary-100 text-primary-600 
              rounded-xl
            "
                    >
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>
        </Card>
    );
}
