import React, { useState } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';

export default function Lever({ onPull, disabled }) {
    const controls = useAnimation();
    const [pulled, setPulled] = useState(false);

    // Motion value for drag Y position
    const y = useMotionValue(0);
    // Map Y drag to Rotation (0px -> 150px maps to 0deg -> 60deg)
    const rotate = useTransform(y, [0, 150], [0, 60]);

    const triggerPull = async () => {
        if (disabled || pulled) return;
        setPulled(true);

        // Animate Rotation instead of Y
        await controls.start({
            rotate: 60,
            transition: { duration: 0.3, ease: "easeIn" }
        });

        onPull();

        // Snap back
        await controls.start({
            rotate: 0,
            transition: { type: "spring", stiffness: 300, damping: 15 }
        });

        setPulled(false);
    };

    const handleDragEnd = async (event, info) => {
        if (disabled || pulled) return;

        // Trigger if dragged down enough (> 60px)
        if (info.offset.y > 60) {
            setPulled(true);
            onPull();
            // Animate back to 0 rotation
            await controls.start({ rotate: 0 }); // Note: dragEnd might need manual reset or use dragSnapToOrigin
            setPulled(false);
        }
    };

    return (
        <div className={`lever-container ${disabled ? 'disabled' : ''}`}>
            <div className="lever-base">
                <div className="lever-housing"></div>
                {/* Draggable Handle with ROTATION */}
                <motion.div
                    className="lever-handle"
                    style={{ rotate, y }} // y is used for drag tracking but visual rotation dominates
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 50 }} // Allow small Y movement
                    dragElastic={0.1}
                    dragSnapToOrigin={true}
                    onDragEnd={handleDragEnd}
                    onClick={triggerPull}
                    animate={controls}
                    whileTap={{ cursor: "grabbing" }}
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="handle-stick"></div>
                    <motion.div className="handle-knob" />
                </motion.div>
            </div>
        </div>
    );
}
