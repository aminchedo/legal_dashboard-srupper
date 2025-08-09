import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
    onLoadComplete?: () => void;
    minDisplayTime?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
    onLoadComplete,
    minDisplayTime = 2000 // Minimum time to show loading screen (in milliseconds)
}) => {
    const [percentage, setPercentage] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    // Handle loading animation and timing
    useEffect(() => {
        const startTime = Date.now();
        let animationFrameId: number;
        let timeoutId: NodeJS.Timeout;

        // Animate percentage counter
        const updatePercentage = () => {
            setPercentage(prev => {
                // Gradually increase percentage
                const newValue = prev + (Math.random() * 3 + 1);
                if (newValue < 100) {
                    animationFrameId = requestAnimationFrame(() => {
                        setTimeout(updatePercentage, 100);
                    });
                    return newValue;
                } else {
                    // When we reach 100%, ensure minimum display time has passed
                    const elapsedTime = Date.now() - startTime;
                    const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

                    timeoutId = setTimeout(() => {
                        // Fade out loading screen
                        setIsVisible(false);

                        // Call the completion callback after fade animation
                        setTimeout(() => {
                            if (onLoadComplete) onLoadComplete();
                        }, 600);
                    }, remainingTime);

                    return 100;
                }
            });
        };

        // Start the animation
        setTimeout(updatePercentage, 500);

        // Cleanup function
        return () => {
            cancelAnimationFrame(animationFrameId);
            clearTimeout(timeoutId);
        };
    }, [minDisplayTime, onLoadComplete]);

    if (!isVisible) return null;

    return (
        <div id="loading-screen" className={`${isVisible ? '' : 'fade-out'}`}>
            {/* Floating particles */}
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>

            {/* Geometric shapes */}
            <div className="geo-shape"></div>
            <div className="geo-shape"></div>
            <div className="geo-shape"></div>

            <div className="loading-container">
                <div className="loading-logo">⚖️ LEGAL DASHBOARD</div>

                <div className="loading-icon">
                    <div className="scale-container">
                        <div className="scale-pillar"></div>
                        <div className="scale-arm"></div>
                        <div className="scale-pan"></div>
                        <div className="scale-pan"></div>
                    </div>
                </div>

                <div className="loading-text">Initializing your workspace<span className="loading-dots"></span></div>

                <div className="progress-container">
                    <div className="loading-percentage">{Math.floor(percentage)}%</div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
