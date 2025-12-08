import React, { useState, useRef } from 'react';
import { X, Trophy, UserPlus, Trash2, Upload } from 'lucide-react';

export default function SettingsModal({
    isOpen,
    onClose,
    candidates,
    winnersConfig,
    updateWinnersConfig,
    updateCandidates,
    useCustomImages,
    toggleDataSource
}) {
    const [activeSlot, setActiveSlot] = useState(null); // 0, 1, or 2 (representing 3rd, 2nd, 1st place in logic flow)
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    // Logic flow: winnersConfig[0] is 3rd place, [1] is 2nd, [2] is 1st.
    // Display: Left to Right -> 3rd, 2nd, 1st OR 2nd, 1st, 3rd (Podium style).
    // Let's do logical order for clarity: "Spin 1 (3rd Place)", "Spin 2 (2nd Place)", "Spin 3 (1st Place)"

    const handleCandidateClick = (candidate) => {
        if (activeSlot === null) return;

        const newConfig = [...winnersConfig];
        // If candidate is already in another slot, remove them from there
        const existingIndex = newConfig.indexOf(candidate.id);
        if (existingIndex !== -1) {
            newConfig[existingIndex] = null;
        }

        newConfig[activeSlot] = candidate.id;
        updateWinnersConfig(newConfig);
        setActiveSlot(null);
    };

    const clearSlot = (index, e) => {
        e.stopPropagation();
        const newConfig = [...winnersConfig];
        newConfig[index] = null;
        updateWinnersConfig(newConfig);
    };

    const handleImageUpload = (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const newCandidates = Array.from(files).map((file, index) => ({
            id: `custom-${Date.now()}-${index}`,
            name: file.name.split('.')[0], // Use filename as name (remove extension)
            image: URL.createObjectURL(file)
        }));

        updateCandidates(newCandidates);

        // Also ensure we switch to custom images mode if not already
        if (!useCustomImages) {
            toggleDataSource(true);
        }
    };

    const getWinnerInSlot = (index) => candidates.find(c => c.id === winnersConfig[index]);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>⚙️ إعدادات القرعة</h2>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {/* Hidden File Input */}
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />

                        <button
                            className="upload-btn"
                            onClick={() => fileInputRef.current.click()}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                background: '#333',
                                border: '1px solid #555',
                                color: 'white',
                                padding: '5px 10px',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            <Upload size={16} />
                            <span>رفع صور</span>
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.9rem', color: '#ccc' }}>استخدام صور المشاركين</span>
                            <button
                                className={`toggle-btn ${useCustomImages ? 'active' : ''}`}
                                onClick={() => toggleDataSource(!useCustomImages)}
                            >
                                {useCustomImages ? "ON" : "OFF"}
                            </button>
                        </div>
                    </div>

                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <div className="modal-body">
                    <section className="winner-selection">
                        <h3>🏆 تحديد الفائزين مسبقاً (اختياري)</h3>
                        <p className="subtext">اضغط على الخانة ثم اختر المشارك لتعيين الفوز.</p>

                        <div className="slots-container">
                            {[
                                { label: "السحبة 1 (المركز 3)", index: 0 },
                                { label: "السحبة 2 (المركز 2)", index: 1 },
                                { label: "السحبة 3 (المركز 1)", index: 2 }
                            ].map((slot) => {
                                const winner = getWinnerInSlot(slot.index);
                                return (
                                    <div
                                        key={slot.index}
                                        className={`winner-slot ${activeSlot === slot.index ? 'active' : ''} ${winner ? 'filled' : ''}`}
                                        onClick={() => setActiveSlot(slot.index)}
                                    >
                                        <span className="slot-label">{slot.label}</span>
                                        {winner ? (
                                            <div className="assigned-winner">
                                                <img src={winner.image} alt={winner.name} />
                                                <span>{winner.name}</span>
                                                <button className="remove-winner-btn" onClick={(e) => clearSlot(slot.index, e)}><X size={14} /></button>
                                            </div>
                                        ) : (
                                            <div className="empty-slot-placeholder">
                                                <UserPlus size={24} />
                                                <span>اختر</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="candidates-list-section">
                        <h3>👥 المشاركين ({candidates.length})</h3>
                        <div className="candidates-grid">
                            {candidates.map(candidate => {
                                const isSelected = winnersConfig.includes(candidate.id);
                                return (
                                    <div
                                        key={candidate.id}
                                        className={`candidate-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleCandidateClick(candidate)}
                                    >
                                        <img src={candidate.image} alt={candidate.name} />
                                        <span className="candidate-name">{candidate.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
