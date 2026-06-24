import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function AIVaultContainer({ vaultState, onToggle, modelCount }) {
  const isClosed = vaultState === 'closed';

  // Motion values for smooth 360-degree rotation
  const rotX = useMotionValue(-15);
  const rotY = useMotionValue(30);

  // Spring physics for smooth lagging rotation trail
  const springConfig = { damping: 25, stiffness: 80, mass: 1 };
  const smoothX = useSpring(rotX, springConfig);
  const smoothY = useSpring(rotY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const xPercent = e.clientX / window.innerWidth;
      const yPercent = e.clientY / window.innerHeight;

      // Map coordinates to full 360 degrees rotation
      const targetY = (xPercent - 0.5) * 360;
      const targetX = -(yPercent - 0.5) * 360;

      rotY.set(targetY);
      rotX.set(targetX);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [rotX, rotY]);

  // Determine expansion offset for the 3D cube panels
  const isExpanding = vaultState === 'opening' || vaultState === 'open' || vaultState === 'closing';
  const translateDist = isExpanding ? 150 : 80; // Explodes open to 150px, collapses back to 80px
  const opacityVal = isExpanding ? 0.35 : 0.85;

  return (
    <div className="vault-3d-scene">
      {/* 3D Perspective Wrapper */}
      <div className="cube-wrapper" onClick={onToggle}>
        <motion.div
          className={`cube ${vaultState}`}
          style={{
            rotateX: smoothX,
            rotateY: smoothY,
          }}
        >
          {/* ── Core Energy Hologram inside the Cube ── */}
          <div className={`cube-core ${vaultState}`}>
            <div className="cube-core-sparkle" />
          </div>

          {/* ── Top Face ── */}
          <div
            className="cube-face top glassmorphic"
            style={{
              transform: `rotateX(90deg) translateZ(${translateDist}px)`,
              opacity: opacityVal,
            }}
          >
            <div className="cube-face-grid" />
          </div>

          {/* ── Bottom Face ── */}
          <div
            className="cube-face bottom glassmorphic"
            style={{
              transform: `rotateX(-90deg) translateZ(${translateDist}px)`,
              opacity: opacityVal,
            }}
          >
            <div className="cube-face-grid" />
          </div>

          {/* ── Left Face ── */}
          <div
            className="cube-face left glassmorphic"
            style={{
              transform: `rotateY(-90deg) translateZ(${translateDist}px)`,
              opacity: opacityVal,
            }}
          >
            <div className="cube-orbital" />
          </div>

          {/* ── Right Face ── */}
          <div
            className="cube-face right glassmorphic"
            style={{
              transform: `rotateY(90deg) translateZ(${translateDist}px)`,
              opacity: opacityVal,
            }}
          >
            <div className="cube-orbital" />
          </div>

          {/* ── Back Face ── */}
          <div
            className="cube-face back glassmorphic"
            style={{
              transform: `rotateY(180deg) translateZ(${translateDist}px)`,
              opacity: opacityVal,
            }}
          >
            <div className="vault-security-tag">MODEL KEY VAULT</div>
          </div>

          {/* ── Front Face (Shows secure state and count) ── */}
          <div
            className="cube-face front glassmorphic"
            style={{
              transform: `rotateY(0deg) translateZ(${translateDist}px)`,
              opacity: opacityVal,
            }}
          >
            <div className="vault-laser-scanner" />
            <div className="vault-label-content">
              <span className="vault-security-tag">ANTI-GRAVITY CORE</span>
              <h3 className="vault-headline">
                {isClosed ? 'VAULT SECURED' : 'GRID DEPLOYED'}
              </h3>
              <p className="vault-subtext">
                {isClosed
                  ? `${modelCount} Assets Loaded. Click to Decrypt.`
                  : 'Models Released. Click to Secure.'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
