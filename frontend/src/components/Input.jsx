/**
 * Input Component
 * ===============
 * Premium form input with floating labels and animations
 * Features:
 * - Floating label animation
 * - Multiple variants (default, filled, outlined)
 * - Validation states (error, success)
 * - Icon support (left/right)
 * - Focus glow effects
 * - Helper text and error messages
 * 
 * Usage:
 * <Input label="Email" type="email" leftIcon={<Mail />} />
 * <Input label="Password" type="password" error="Invalid password" />
 */

import React, { useState, forwardRef } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

// ============================================
// MAIN INPUT COMPONENT
// ============================================
const Input = forwardRef(({
    label,
    type = 'text',
    variant = 'default',
    leftIcon,
    rightIcon,
    error,
    success,
    helperText,
    disabled = false,
    required = false,
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    // Check if input has value - use props.value directly for controlled inputs
    const hasValue = props.value !== undefined ? !!props.value && props.value !== '' : false;

    // Determine the current state for styling
    const state = error ? 'error' : success ? 'success' : isFocused ? 'focus' : 'default';

    const stateStyles = {
        default: 'border-gray-200 hover:border-gray-300',
        focus: 'border-primary-500 ring-4 ring-primary-100',
        error: 'border-red-500 ring-4 ring-red-100',
        success: 'border-emerald-500 ring-4 ring-emerald-100',
    };

    const labelStyles = {
        default: 'text-gray-500',
        focus: 'text-primary-600',
        error: 'text-red-600',
        success: 'text-emerald-600',
    };

    const handleFocus = (e) => {
        setIsFocused(true);
        props.onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        props.onBlur?.(e);
    };

    const handleChange = (e) => {
        props.onChange?.(e);
    };

    return (
        <div className={`relative ${containerClassName}`}>
            <div className="relative">
                {/* Left Icon */}
                {leftIcon && (
                    <div
                        className={`
              absolute left-4 top-1/2 -translate-y-1/2
              text-gray-400
              transition-colors duration-200
              ${isFocused ? 'text-primary-500' : ''}
              ${error ? 'text-red-500' : ''}
            `}
                    >
                        {leftIcon}
                    </div>
                )}

                {/* Input Field */}
                <input
                    ref={ref}
                    type={inputType}
                    disabled={disabled}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className={`
            /* Base styles */
            w-full
            px-4 py-4
            ${leftIcon ? 'pl-12' : ''}
            ${rightIcon || isPassword ? 'pr-12' : ''}
            ${label ? 'pt-6 pb-2' : ''}
            
            /* Typography */
            text-gray-900
            placeholder-transparent
            
            /* Border and background */
            bg-white/80 backdrop-blur-sm
            border-2 rounded-xl
            ${stateStyles[state]}
            
            /* Transitions */
            transition-all duration-300 ease-out
            
            /* Disabled state */
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
            
            /* Focus outline */
            outline-none
            
            /* Custom classes */
            ${className}
          `}
                    placeholder={label || 'Enter text...'}
                    {...props}
                />

                {/* Floating Label */}
                {label && (
                    <label
                        className={`
              absolute left-4 
              ${leftIcon ? 'left-12' : ''}
              
              /* Floating behavior */
              transition-all duration-200 ease-out
              pointer-events-none
              
              ${isFocused || hasValue
                                ? 'top-2 text-xs font-medium'
                                : 'top-1/2 -translate-y-1/2 text-base'
                            }
              
              /* Color based on state */
              ${labelStyles[state]}
            `}
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                {/* Right Icon / Password Toggle */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="
                text-gray-400 hover:text-gray-600
                transition-colors duration-200
                focus:outline-none
              "
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    )}

                    {rightIcon && !isPassword && rightIcon}

                    {/* Validation icons */}
                    {error && <AlertCircle className="w-5 h-5 text-red-500" />}
                    {success && !error && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                </div>
            </div>

            {/* Helper/Error Text */}
            {(helperText || error) && (
                <p
                    className={`
            mt-2 text-sm
            animate-fade-in
            ${error ? 'text-red-600' : 'text-gray-500'}
          `}
                >
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;

// ============================================
// TEXTAREA COMPONENT
// ============================================
export const Textarea = forwardRef(({
    label,
    error,
    success,
    helperText,
    disabled = false,
    required = false,
    rows = 4,
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    // Check if textarea has value - use props.value directly for controlled inputs
    const hasValue = props.value !== undefined ? !!props.value && props.value !== '' : false;

    const state = error ? 'error' : success ? 'success' : isFocused ? 'focus' : 'default';

    const stateStyles = {
        default: 'border-gray-200 hover:border-gray-300',
        focus: 'border-primary-500 ring-4 ring-primary-100',
        error: 'border-red-500 ring-4 ring-red-100',
        success: 'border-emerald-500 ring-4 ring-emerald-100',
    };

    return (
        <div className={`relative ${containerClassName}`}>
            <div className="relative">
                <textarea
                    ref={ref}
                    rows={rows}
                    disabled={disabled}
                    onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
                    onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
                    onChange={props.onChange}
                    className={`
            w-full
            px-4 py-4
            ${label ? 'pt-6' : ''}
            text-gray-900
            placeholder-transparent
            bg-white/80 backdrop-blur-sm
            border-2 rounded-xl
            ${stateStyles[state]}
            transition-all duration-300 ease-out
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
            outline-none resize-none
            ${className}
          `}
                    placeholder={label || 'Enter text...'}
                    {...props}
                />

                {label && (
                    <label
                        className={`
              absolute left-4
              transition-all duration-200 ease-out
              pointer-events-none
              ${isFocused || hasValue
                                ? 'top-2 text-xs font-medium'
                                : 'top-4 text-base'
                            }
              ${error ? 'text-red-600' : isFocused ? 'text-primary-600' : 'text-gray-500'}
            `}
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
            </div>

            {(helperText || error) && (
                <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';

// ============================================
// SELECT COMPONENT
// ============================================
export const Select = forwardRef(({
    label,
    options = [],
    error,
    helperText,
    disabled = false,
    required = false,
    placeholder = 'Select an option',
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = !!props.value;

    const state = error ? 'error' : isFocused ? 'focus' : 'default';

    const stateStyles = {
        default: 'border-gray-200 hover:border-gray-300',
        focus: 'border-primary-500 ring-4 ring-primary-100',
        error: 'border-red-500 ring-4 ring-red-100',
    };

    return (
        <div className={`relative ${containerClassName}`}>
            <div className="relative">
                <select
                    ref={ref}
                    disabled={disabled}
                    onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
                    onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
                    className={`
            w-full
            px-4 py-4
            ${label ? 'pt-6 pb-2' : ''}
            text-gray-900
            bg-white/80 backdrop-blur-sm
            border-2 rounded-xl
            ${stateStyles[state]}
            transition-all duration-300 ease-out
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
            outline-none appearance-none
            cursor-pointer
            ${className}
          `}
                    {...props}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {label && (
                    <label
                        className={`
              absolute left-4
              transition-all duration-200 ease-out
              pointer-events-none
              ${isFocused || hasValue
                                ? 'top-2 text-xs font-medium'
                                : 'top-1/2 -translate-y-1/2 text-base'
                            }
              ${error ? 'text-red-600' : isFocused ? 'text-primary-600' : 'text-gray-500'}
            `}
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                {/* Dropdown arrow */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {(helperText || error) && (
                <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Select.displayName = 'Select';
