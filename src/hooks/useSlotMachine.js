import { useState, useEffect } from 'react';
import { initialImages } from '../data/initialImages';
import { customParticipants } from '../data/customList';

const STORAGE_KEY = 'slot_machine_state_v3'; // Bumped to clean slate

export function useSlotMachine() {
    // State
    const [candidates, setCandidates] = useState(initialImages); // Start with data immediately

    // winnersConfig: Array of 3 IDs. [3rdPlaceId, 2ndPlaceId, 1stPlaceId]
    const [winnersConfig, setWinnersConfig] = useState([null, null, null]);

    const [revealedCount, setRevealedCount] = useState(0); // 0 means none revealed. 1 means 3rd place revealed.
    const [isSpinning, setIsSpinning] = useState(false);
    const [currentWinner, setCurrentWinner] = useState(null); // The winner just revealed

    // New Flag: Use Custom Images or Default
    const [useCustomImages, setUseCustomImages] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Validate loaded data
                if (parsed.candidates && Array.isArray(parsed.candidates) && parsed.candidates.length > 0) {
                    setCandidates(parsed.candidates);
                } else {
                    setCandidates(initialImages);
                }

                setWinnersConfig(parsed.winnersConfig || [null, null, null]);
                setRevealedCount(parsed.revealedCount || 0);
                setUseCustomImages(parsed.useCustomImages || false);

                // If custom mode was saved as true, ensure we have the custom list loaded
                if (parsed.useCustomImages) {
                    setCandidates(customParticipants);
                }
            }
        } catch (e) {
            console.error("Failed to load state", e);
            setCandidates(initialImages);
        }
    }, []);

    // Save to LocalStorage whenever state changes
    useEffect(() => {
        if (candidates.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                candidates,
                winnersConfig,
                revealedCount,
                useCustomImages
            }));
        }
    }, [candidates, winnersConfig, revealedCount, useCustomImages]);

    const updateCandidates = (newCandidates) => {
        setCandidates(newCandidates);
    };

    const updateWinnersConfig = (newConfig) => {
        setWinnersConfig(newConfig);
    };

    const resetGame = () => {
        setRevealedCount(0);
        setCurrentWinner(null);
    };

    const spin = () => {
        if (isSpinning || revealedCount >= 3) return null;

        setIsSpinning(true);
        setCurrentWinner(null);

        return new Promise((resolve) => {
            // Determine target ID
            let targetId;

            // If config exists and has valid entry for this round, use it.
            // Otherwise pick random from candidates excluding already picked? 
            // For simplicity, just pick random if config missing.
            if (winnersConfig[revealedCount]) {
                targetId = winnersConfig[revealedCount];
            } else {
                // Fallback random (should generally be avoided if we want strict rigging)
                const available = candidates.filter(c => !winnersConfig.includes(c.id)); // mild safety
                const random = available[Math.floor(Math.random() * available.length)] || candidates[0];
                targetId = random.id;
            }

            // Simulate spin duration
            setTimeout(() => {
                setIsSpinning(false);
                setRevealedCount(prev => prev + 1);
                const winner = candidates.find(c => c.id === targetId);
                setCurrentWinner(winner);
                resolve(winner);
            }, 3000); // 3 seconds spin
        });
    };

    const toggleDataSource = () => {
        setUseCustomImages(prev => !prev);
    };

    return {
        candidates,
        winnersConfig,
        revealedCount,
        isSpinning,
        currentWinner,
        useCustomImages,
        toggleDataSource,
        updateCandidates,
        updateWinnersConfig,
        spin,
        resetGame
    };
}
