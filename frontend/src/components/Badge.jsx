/**
 * Badge Component
 * ===============
 * Tag/badge component with glow effects and color variants
 * Features:
 * - 6 color variants
 * - 3 sizes (sm, md, lg)
 * - Optional icon support
 * - Glow effect option
 * - Dismissible option
 * - Animated entrance
 * 
 * Usage:
 * <Badge variant="primary">Active</Badge>
 * <Badge variant="success" glow>Verified</Badge>
 * <Badge onDismiss={() => {}}>Removable</Badge>
 */

import React from 'react';
import { X } from 'lucide-react';

// ============================================
// VARIANT STYLES
// ============================================
const variants = {
    primary: {
        base: 'bg-primary-100 text-primary-800',
        glow: 'shadow-[0_0_10px_rgba(5,150,105,0.3)]',
        dot: 'bg-primary-500',
    },
    secondary: {
        base: 'bg-secondary-100 text-secondary-800',
        glow: 'shadow-[0_0_10px_rgba(245,158,11,0.3)]',
        dot: 'bg-secondary-500',
    },
    accent: {
        base: 'bg-accent-100 text-accent-800',
        glow: 'shadow-[0_0_10px_rgba(14,165,233,0.3)]',
        dot: 'bg-accent-500',
    },
    success: {
        base: 'bg-emerald-100 text-emerald-800',
        glow: 'shadow-[0_0_10px_rgba(16,185,129,0.3)]',
        dot: 'bg-emerald-500',
    },
    warning: {
        base: 'bg-amber-100 text-amber-800',
        glow: 'shadow-[0_0_10px_rgba(251,191,36,0.3)]',
        dot: 'bg-amber-500',
    },
    danger: {
        base: 'bg-red-100 text-red-800',
        glow: 'shadow-[0_0_10px_rgba(239,68,68,0.3)]',
        dot: 'bg-red-500',
    },
    gray: {
        base: 'bg-gray-100 text-gray-800',
        glow: 'shadow-[0_0_10px_rgba(100,116,139,0.2)]',
        dot: 'bg-gray-500',
    },
    dark: {
        base: 'bg-gray-900 text-white',
        glow: 'shadow-[0_0_10px_rgba(15,23,42,0.4)]',
        dot: 'bg-white',
    },
};

// ============================================
// SIZE STYLES
// ============================================
const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
};

// ============================================
// MAIN BADGE COMPONENT
// ============================================
export default function Badge({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    showDot = false,
    glow = false,
    animated = false,
    onDismiss,
    className = '',
    ...props
}) {
    const variantStyles = variants[variant] || variants.primary;

    return (
        <span
            className={`
        /* Base styles */
        inline-flex items-center
        font-medium
        rounded-full
        transition-all duration-200 ease-out
        
        /* Size styles */
        ${sizes[size] || sizes.md}
        
        /* Variant styles */
        ${variantStyles.base}
        
        /* Glow effect */
        ${glow ? variantStyles.glow : ''}
        
        /* Animation */
        ${animated ? 'animate-scale-in' : ''}
        
        /* Custom classes */
        ${className}
      `}
            {...props}
        >
            {/* Status dot */}
            {showDot && (
                <span
                    className={`
            w-1.5 h-1.5 rounded-full
            ${variantStyles.dot}
            ${glow ? 'animate-pulse' : ''}
          `}
                />
            )}

            {/* Left icon */}
            {icon && (
                <span className="flex-shrink-0">{icon}</span>
            )}

            {/* Badge text */}
            <span>{children}</span>

            {/* Dismiss button */}
            {onDismiss && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDismiss();
                    }}
                    className="
            -mr-1 p-0.5 rounded-full
            hover:bg-black/10
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1
          "
                    aria-label="Dismiss"
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </span>
    );
}

// ============================================
// BADGE GROUP
// For displaying multiple badges
// ============================================
export function BadgeGroup({ children, className = '' }) {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {children}
        </div>
    );
}

// ============================================
// STATUS BADGE
// Pre-styled for common status indicators
// ============================================
export function StatusBadge({ status, className = '' }) {
    const statusConfig = {
        active: { variant: 'success', label: 'Active', dot: true },
        inactive: { variant: 'gray', label: 'Inactive', dot: true },
        pending: { variant: 'warning', label: 'Pending', dot: true },
        approved: { variant: 'success', label: 'Approved', dot: true },
        rejected: { variant: 'danger', label: 'Rejected', dot: true },
        draft: { variant: 'gray', label: 'Draft', dot: true },
        published: { variant: 'primary', label: 'Published', dot: true },
        archived: { variant: 'dark', label: 'Archived', dot: false },
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
        <Badge
            variant={config.variant}
            showDot={config.dot}
            glow={status === 'active' || status === 'approved'}
            className={className}
        >
            {config.label}
        </Badge>
    );
}

// ============================================
// COUNT BADGE
// Small circular badge for counts/notifications
// ============================================
export function CountBadge({
    count,
    max = 99,
    variant = 'danger',
    className = '',
}) {
    if (!count || count <= 0) return null;

    const displayCount = count > max ? `${max}+` : count;
    const variantStyles = variants[variant] || variants.danger;

    return (
        <span
            className={`
        inline-flex items-center justify-center
        min-w-[1.25rem] h-5
        px-1.5
        text-xs font-bold
        rounded-full
        ${variantStyles.base}
        animate-scale-in
        ${className}
      `}
        >
            {displayCount}
        </span>
    );
}
