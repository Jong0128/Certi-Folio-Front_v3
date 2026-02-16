import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
    text: string;
    delay?: number;
    speed?: number;
    className?: string;
    showCursor?: boolean;
    cursorClassName?: string;
    onComplete?: () => void;
}

export const TypingEffect = ({
    text,
    delay = 0,
    speed = 100,
    className = '',
    showCursor = true,
    cursorClassName = 'bg-gray-900',
    onComplete
}: TypingEffectProps) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        let intervalId: ReturnType<typeof setInterval>;

        setDisplayedText('');

        timeoutId = setTimeout(() => {
            let index = 0;
            intervalId = setInterval(() => {
                index++;
                setDisplayedText(text.slice(0, index));
                if (index >= text.length) {
                    clearInterval(intervalId);
                    if (onComplete) onComplete();
                }
            }, speed);
        }, delay);

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, [text, delay, speed]);

    return (
        <span className={className}>
            {displayedText}
            <span className={`ml-1 inline-block w-[3px] h-[1em] align-middle mb-1 ${cursorClassName} ${showCursor ? 'animate-pulse' : 'opacity-0'}`}></span>
        </span>
    );
};
