'use client';
import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const toggleVisible = () => {
            if (window.scrollY > 400) setVisible(true);
            else setVisible(false);
        };
        window.addEventListener('scroll', toggleVisible);
        return () => window.removeEventListener('scroll', toggleVisible);
    }, []);

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`back-to-top ${visible ? 'visible' : ''}`}
        >
            <ChevronUp size={28} strokeWidth={3} />
        </button>
    );
}