'use client';

import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 left-8 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark hover:scale-110 transition-all duration-200 z-50 animate-bounce"
                    aria-label="بازگشت به بالا"
                >
                    <FaArrowUp className="text-xl" />
                </button>
            )}
        </>
    );
}
