import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModels } from '../context/ModelContext';
import { HiLightningBolt, HiEye, HiSparkles, HiRefresh } from 'react-icons/hi';

export default function AIAgentCore({ vaultState, onToggleVault, onOpenAddModal }) {
  const { searchQuery, loading, models } = useModels();
  const [bubbleText, setBubbleText] = useState('Hello! I am your visual companion. Ready to decrypt the model storage.');
  const [showBubble, setShowBubble] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [gender, setGender] = useState('girl'); // 'girl' | 'boy'

  const containerRef = useRef(null);

  // Track cursor movement locally to calculate eye looking angles
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const avatarCenterX = rect.left + rect.width / 2;
      const avatarCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - avatarCenterX;
      const deltaY = e.clientY - avatarCenterY;
      const distance = Math.hypot(deltaX, deltaY);

      // Max eye deviation is 4px for human eye tracking
      const maxDeviation = 4;
      let moveX = 0;
      let moveY = 0;

      if (distance > 0) {
        moveX = (deltaX / distance) * Math.min(distance * 0.04, maxDeviation);
        moveY = (deltaY / distance) * Math.min(distance * 0.04, maxDeviation);
      }

      setEyeOffset({ x: moveX, y: moveY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // React to system status changes
  useEffect(() => {
    let text = '';
    const companionType = gender === 'girl' ? 'Girl' : 'Boy';
    if (loading) {
      text = 'Synchronizing database... Accessing Supabase grid.';
    } else if (searchQuery && searchQuery.length >= 2) {
      text = `Filtering storage keys matching "${searchQuery}"...`;
    } else if (vaultState === 'closed') {
      text = `Vault secured. Storing ${models.length} digital nodes. Click my actions or click the vault to unpack.`;
    } else if (vaultState === 'opening') {
      text = 'Unpacking models... Calibrating anti-gravity vectors.';
    } else if (vaultState === 'open') {
      text = 'Grid active. All AI models operating in floating state.';
    } else if (vaultState === 'closing') {
      text = 'Securing storage. Pulling model assets back magnetically.';
    } else {
      text = `Dashboard online. Ready to assist. Current Companion: ${companionType} Avatar.`;
    }

    setBubbleText(text);
    setShowBubble(true);
    setIsSpeaking(true);

    const speechTimer = setTimeout(() => setIsSpeaking(false), 2500);
    const bubbleTimer = setTimeout(() => {
      if (!loading && (!searchQuery || searchQuery.length < 2)) {
        setShowBubble(false);
      }
    }, 6000);

    return () => {
      clearTimeout(speechTimer);
      clearTimeout(bubbleTimer);
    };
  }, [vaultState, searchQuery, loading, models.length, gender]);

  // Screen Actions triggered by Avatar
  const handleRandomHighlight = () => {
    setBubbleText('Scanning environment... Highlighting a random model node!');
    setShowBubble(true);
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 2000);

    const cards = document.querySelectorAll('.model-card');
    if (cards.length > 0) {
      const randomIndex = Math.floor(Math.random() * cards.length);
      cards[randomIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        cards[randomIndex].click();
      }, 500);
    } else {
      setBubbleText('Storage is empty! Unlock the vault first.');
    }
  };

  const handleAction = (actionFn, msg) => {
    setBubbleText(msg);
    setShowBubble(true);
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 2000);
    actionFn();
  };

  return (
    <div 
      className="ai-agent-core-container" 
      ref={containerRef}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      {/* ── Dynamic Speech Bubble ── */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            className="ai-agent-bubble glassmorphic"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="ai-agent-bubble-header">
              <span className="ai-agent-status-dot" />
              <span className="ai-agent-title">Human Interface Companion</span>
            </div>
            <p className="ai-agent-text">{bubbleText}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Actions Menu ── */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            className="avatar-action-menu glassmorphic"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <button 
              onClick={() => handleAction(onToggleVault, vaultState === 'closed' ? 'Unlocking model vault...' : 'Securing storage container...')}
              className="menu-action-btn"
            >
              <HiLightningBolt />
              <span>{vaultState === 'closed' ? 'Unlock Vault' : 'Secure Vault'}</span>
            </button>
            <button 
              onClick={() => handleAction(onOpenAddModal, 'Accessing form... Initializing new node creation.')}
              className="menu-action-btn"
            >
              <HiSparkles />
              <span>Create Node</span>
            </button>
            <button 
              onClick={handleRandomHighlight}
              className="menu-action-btn"
            >
              <HiEye />
              <span>Highlight Model</span>
            </button>
            <button 
              onClick={() => handleAction(() => setGender(gender === 'girl' ? 'boy' : 'girl'), `Switching interface companion to ${gender === 'girl' ? 'Boy' : 'Girl'} Avatar.`)}
              className="menu-action-btn"
            >
              <HiRefresh />
              <span>{gender === 'girl' ? 'Use Boy Avatar' : 'Use Girl Avatar'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Interactive 3D Holographic Human Avatar Head ── */}
      <div className="ai-avatar-wrapper" onClick={() => setShowBubble(true)}>
        {/* Orbital holographic rings */}
        <div className="avatar-halo ring-slow" />
        <div className="avatar-halo ring-fast" />

        {/* Animated Avatar Face Structure */}
        <div className={`human-avatar ${gender}`}>
          {/* Hair Elements */}
          {gender === 'girl' ? (
            <>
              <div className="hair-bun left" />
              <div className="hair-bun right" />
              <div className="hair-back girl" />
            </>
          ) : (
            <>
              <div className="hair-spikes">
                <span className="hair-spike" />
                <span className="hair-spike" />
                <span className="hair-spike" />
              </div>
              <div className="hair-back boy" />
            </>
          )}

          {/* Neck */}
          <div className="avatar-neck" />

          {/* Face Plate */}
          <div className="avatar-faceplate glassmorphic">
            {/* Front Bangs */}
            <div className={`hair-front ${gender}`} />

            {/* Glowing Cyber visor glasses */}
            <div className="cyber-visor" />

            {/* Human Eyes (Cursor-tracking pupils) */}
            <div className="avatar-eyes">
              <div className="avatar-eye left">
                <div 
                  className="avatar-pupil" 
                  style={{ 
                    transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` 
                  }} 
                />
              </div>
              <div className="avatar-eye right">
                <div 
                  className="avatar-pupil" 
                  style={{ 
                    transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` 
                  }} 
                />
              </div>
            </div>

            {/* Cute smile mouth */}
            <div className={`avatar-mouth human ${isSpeaking ? 'speaking' : ''}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
