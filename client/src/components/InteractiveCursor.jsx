import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function InteractiveCursor() {
  const [trail, setTrail] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // Motion values for smooth lagging follower ring
  const ringX = useMotionValue(0);
  const ringY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const springX = useSpring(ringX, springConfig);
  const springY = useSpring(ringY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      setCoords({ x, y });

      // Update motion values for spring-ring
      ringX.set(x - 20); // half of width
      ringY.set(y - 20);

      // Add a particle trail
      setTrail((prev) => {
        const newTrail = [...prev, { id: Math.random(), x, y }];
        if (newTrail.length > 15) {
          newTrail.shift();
        }
        return newTrail;
      });
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [ringX, ringY]);

  return (
    <div className="custom-cursor-container">
      {/* ── Interactive Particle Trail ── */}
      {trail.map((t, index) => {
        const ratio = index / trail.length;
        return (
          <motion.div
            key={t.id}
            className="cursor-trail-particle"
            style={{
              left: t.x,
              top: t.y,
              transform: 'translate(-50%, -50%)',
              opacity: ratio * 0.4,
              scale: ratio * 1.5,
              background: `radial-gradient(circle, rgba(108, 99, 255, ${ratio}) 0%, rgba(0, 212, 255, 0) 70%)`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3 }}
          />
        );
      })}

      {/* ── Outer Spring Ring ── */}
      <motion.div
        className={`cursor-outer-ring ${clicked ? 'clicked' : ''}`}
        style={{
          x: springX,
          y: springY,
        }}
      />

      {/* ── Inner Direct Dot ── */}
      <div
        className="cursor-inner-dot"
        style={{
          transform: `translate3d(calc(${coords.x}px - 50%), calc(${coords.y}px - 50%), 0)`,
          position: 'fixed',
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}
