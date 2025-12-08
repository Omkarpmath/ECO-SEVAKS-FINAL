/**
 * useScrollAnimation Hook
 * =======================
 * Custom hook for scroll-triggered animations using Intersection Observer
 * Features:
 * - Efficient scroll detection
 * - Configurable threshold and root margin
 * - Single fire option (animate once)
 * - Multiple animation trigger support
 * 
 * Usage:
 * const { ref, isVisible } = useScrollAnimation();
 * <div ref={ref} className={isVisible ? 'animate-fade-in-up' : 'opacity-0'}>
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================
// MAIN HOOK
// ============================================
export function useScrollAnimation({
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
} = {}) {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        // Skip if already animated and triggerOnce is true
        if (triggerOnce && hasAnimated.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    hasAnimated.current = true;

                    // Disconnect if triggerOnce
                    if (triggerOnce) {
                        observer.disconnect();
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [threshold, rootMargin, triggerOnce]);

    return { ref: elementRef, isVisible };
}

// ============================================
// STAGGERED ANIMATION HOOK
// For animating multiple elements with delay
// ============================================
export function useStaggeredAnimation({
    itemCount,
    baseDelay = 100,
    threshold = 0.1,
    rootMargin = '0px',
} = {}) {
    const { ref, isVisible } = useScrollAnimation({ threshold, rootMargin });

    // Generate delay classes for each item
    const getDelayClass = useCallback((index) => {
        const delay = index * baseDelay;
        return `animation-delay-${Math.min(delay, 1000)}`;
    }, [baseDelay]);

    // Generate inline delay style for custom delays
    const getDelayStyle = useCallback((index) => ({
        animationDelay: `${index * baseDelay}ms`,
        transitionDelay: `${index * baseDelay}ms`,
    }), [baseDelay]);

    return {
        containerRef: ref,
        isVisible,
        getDelayClass,
        getDelayStyle,
    };
}

// ============================================
// PARALLAX EFFECT HOOK
// For subtle parallax scrolling effects
// ============================================
export function useParallax(speed = 0.5) {
    const [offset, setOffset] = useState(0);
    const elementRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!elementRef.current) return;

            const rect = elementRef.current.getBoundingClientRect();
            const scrolled = window.scrollY;
            const rate = scrolled * speed;

            // Only update if element is in view
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                setOffset(rate);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial call

        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return { ref: elementRef, offset };
}

// ============================================
// COUNTER ANIMATION HOOK
// For animating numbers/stats
// ============================================
export function useCountAnimation({
    end,
    start = 0,
    duration = 2000,
    delay = 0,
} = {}) {
    const [count, setCount] = useState(start);
    const [hasStarted, setHasStarted] = useState(false);
    const { ref, isVisible } = useScrollAnimation();

    useEffect(() => {
        if (!isVisible || hasStarted) return;

        setHasStarted(true);

        const startTime = Date.now() + delay;
        const endValue = end;
        const range = endValue - start;

        const animate = () => {
            const now = Date.now();

            if (now < startTime) {
                requestAnimationFrame(animate);
                return;
            }

            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + range * easeOut);

            setCount(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isVisible, hasStarted, start, end, duration, delay]);

    return { ref, count, isVisible };
}

// ============================================
// SCROLL DIRECTION HOOK
// Detect scroll direction for hide/show effects
// ============================================
export function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = useState('up');
    const [scrollY, setScrollY] = useState(0);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY.current) {
                setScrollDirection('down');
            } else if (currentScrollY < lastScrollY.current) {
                setScrollDirection('up');
            }

            lastScrollY.current = currentScrollY;
            setScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return { scrollDirection, scrollY, isScrolled: scrollY > 50 };
}

// Default export
export default useScrollAnimation;
