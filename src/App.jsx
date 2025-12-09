import React, { useState, useEffect, useRef } from 'react';
import { Settings, RotateCcw } from 'lucide-react';
import { useSlotMachine } from './hooks/useSlotMachine';
import SettingsModal from './components/SettingsModal';
import Lever from './components/Lever';
import Reel from './components/Reel';
import confetti from 'canvas-confetti';
import logoImg from './assets/logo.png';
import logo1 from './assets/logo1.jpg';
import logo2 from './assets/logo2.jpeg';
import logo3 from './assets/logo3.jpeg';

// Arabic Ranks
const RANKS = ["المركز الثالث", "المركز الثاني", "المركز الأول"];

export default function App() {
  const {
    candidates,
    winnersConfig,
    revealedCount,
    resetGame,
    updateWinnersConfig,
    updateCandidates,
    spin,
    isSpinning,
    currentWinner,
    useCustomImages,
    toggleDataSource
  } = useSlotMachine();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showGrandFinale, setShowGrandFinale] = useState(false);

  const fireworksInterval = useRef(null);

  // Cleanup fireworks on unmount
  useEffect(() => {
    return () => stopFireworks();
  }, []);

  const handlePull = async () => {
    if (revealedCount >= 3) {
      setShowGrandFinale(true);
      startFireworks();
      return;
    }

    const winner = await spin();
    if (winner) {
      setShowCelebration(true);
      triggerConfetti();
    }
  };

  const handleCloseCelebration = () => {
    setShowCelebration(false);
    if (revealedCount === 3) {
      setTimeout(() => {
        setShowGrandFinale(true);
        startFireworks();
      }, 500);
    }
  };

  const handleCloseFinale = () => {
    setShowGrandFinale(false);
    stopFireworks();
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#c5a059', '#1a1a1a', '#ffffff']
    });
  };

  const startFireworks = () => {
    if (fireworksInterval.current) return; // Already running

    const duration = 2000; // Loop every 2 seconds roughly, or short intervals
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    const random = (min, max) => Math.random() * (max - min) + min;

    // Immediate burst
    confetti({ ...defaults, particleCount: 50, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount: 50, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });

    // Ongoing loop
    fireworksInterval.current = setInterval(() => {
      confetti({ ...defaults, particleCount: 50, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount: 50, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 800);
  };

  const stopFireworks = () => {
    if (fireworksInterval.current) {
      clearInterval(fireworksInterval.current);
      fireworksInterval.current = null;
    }
  };

  const targetReelImageId = currentWinner ? currentWinner.id : null;

  // Helpers to get winners for podium
  const getWinner = (index) => candidates.find(c => c.id === winnersConfig[index]);
  const winner3 = getWinner(0); // 3rd
  const winner2 = getWinner(1); // 2nd
  const winner1 = getWinner(2); // 1st

  return (
    <div className="app-container">
      {/* Logos Header */}
      <div className="logos-header">
        <div className="logo-box">
          <div style={{ color: '#ffd700', fontWeight: '900', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Pal STEM Olympiad</div>
        </div>
        {/* Gold Mask applied here for sharp, solid gold look */}
        <div
          className="logo-gold-mask"
          style={{
            maskImage: `url(${logoImg})`,
            WebkitMaskImage: `url(${logoImg})`
          }}
        />
      </div>

      <div className="machine-frame">
        <div className="title-display">
          <span>{revealedCount === 3 ? "🏆 النتائج النهائية" : `عرض الفائز بالـ: ${RANKS[revealedCount]}`}</span>
        </div>

        <div className="reels-container">
          {[0, 0.2, 0.4].map((delay, i) => (
            <Reel
              key={i}
              candidates={candidates}
              spinning={isSpinning}
              targetId={targetReelImageId}
              delay={delay}
            />
          ))}
        </div>

        <div className="controls-area">
          <button className="settings-btn" onClick={() => setIsSettingsOpen(true)} title="Settings">
            <Settings size={28} />
          </button>

          <button className="settings-btn" onClick={resetGame} title="Reset Game" style={{ borderColor: 'rgba(255, 100, 100, 0.5)' }}>
            <RotateCcw size={28} />
          </button>
        </div>

        <Lever onPull={handlePull} disabled={isSpinning} />
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        candidates={candidates}
        winnersConfig={winnersConfig}
        updateWinnersConfig={updateWinnersConfig}
        updateCandidates={updateCandidates}
        useCustomImages={useCustomImages}
        toggleDataSource={toggleDataSource}
      />

      {/* Individual Spin Winner Overlay */}
      {showCelebration && currentWinner && (
        <div className="celebration-overlay" onClick={handleCloseCelebration}>
          <div className="winner-card">
            <div className="rank-badge">{RANKS[revealedCount - 1]}</div>
            <h2>🎊 الفائز 🎊</h2>
            <img src={currentWinner.image} alt="winner" />
            <h3>{currentWinner.name}</h3>
            <p className="click-to-continue">(اضغط للمتابعة)</p>
          </div>
        </div>
      )}

      {/* Grand Finale Podium Overlay */}
      {showGrandFinale && (
        <div className="finale-overlay" onClick={handleCloseFinale}>
          <h1 className="finale-title">🏆 الفائزين 🏆</h1>
          <div className="finale-podium">

            {/* 2nd Place (Left) */}
            <div className="podium-place second">
              <div className="rank-label">المركز الثاني</div>
              <img src={winner2 ? winner2.image : "https://placehold.co/100"} className="podium-img" />
              <div className="winner-name">{winner2 ? winner2.name : "غير محدد"}</div>
            </div>

            {/* 1st Place (Center - Biggest) */}
            <div className="podium-place first">
              <div className="rank-label">المركز الأول</div>
              <img src={winner1 ? winner1.image : "https://placehold.co/100"} className="podium-img" />
              <div className="winner-name">{winner1 ? winner1.name : "غير محدد"}</div>
            </div>

            {/* 3rd Place (Right) */}
            <div className="podium-place third">
              <div className="rank-label">المركز الثالث</div>
              <img src={winner3 ? winner3.image : "https://placehold.co/100"} className="podium-img" />
              <div className="winner-name">{winner3 ? winner3.name : "غير محدد"}</div>
            </div>

          </div>
          <p className="click-to-continue" style={{ marginTop: '50px', color: '#ccc' }}>(اضغط للإغلاق)</p>
        </div>
      )}

      {/* Partners Footer */}
      <div className="partners-strip">
        <div className="partner-logo-wrapper">
          <img src={logo1} alt="Partner 1" className="partner-logo" />
        </div>
        <div className="partner-logo-wrapper">
          <img src={logo2} alt="Partner 2" className="partner-logo" />
        </div>
        <div className="partner-logo-wrapper">
          <img src={logo3} alt="Partner 3" className="partner-logo" />
        </div>
      </div>

    </div>
  );
}
