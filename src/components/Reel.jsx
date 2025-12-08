import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const ITEM_HEIGHT = 120; // px
const VISIBLE_ITEMS = 1; // Just show one mainly, but maybe peek others

export default function Reel({ candidates = [], spinning, targetId, delay = 0 }) {
    if (!candidates || !Array.isArray(candidates) || candidates.length === 0) return null;
    // We need a loop of images.
    // When spinning, we translate Y efficiently.
    const controls = useAnimation();

    // Create a "strip" of images. 
    // To simulate infinite spin, we can repeat the list a few times or use CSS animation.
    // Framer motion is requested by user implied by existing code, but standard CSS keyframes are smoother for infinite loop.
    // Let's use CSS for the "Blur" spin state, and Framer Motion or static render for the "Result" state.

    // Actually, let's keep it simple and premium.
    // State: 'static' | 'spinning' | 'stopping'

    const shuffled = React.useMemo(() => {
        // Random shuffle for visual variety in the reel strip
        return [...candidates].sort(() => 0.5 - Math.random()).slice(0, 10);
    }, [candidates]);

    const targetCandidate = candidates.find(c => c.id === targetId);

    return (
        <div className="reel-viewport">
            <div className={`reel-strip ${spinning ? 'spinning' : ''}`} style={{ transitionDelay: `${delay}s` }}>
                {/* If spinning, we show a blurred repeating background or a motion blurred strip */}
                {spinning ? (
                    <div className="blur-strip">
                        {shuffled.map(c => <img key={c.id} src={c.image} alt="spin" />)}
                        {shuffled.map(c => <img key={`d-${c.id}`} src={c.image} alt="spin" />)}
                    </div>
                ) : (
                    <div className="static-result">
                        {targetCandidate ? (
                            <img src={targetCandidate.image} alt={targetCandidate.name} className="result-img" />
                        ) : (
                            <div className="placeholder-reel">?</div>
                        )}
                    </div>
                )}
            </div>
            <div className="reel-overlay-gradient"></div>
        </div>
    );
}
