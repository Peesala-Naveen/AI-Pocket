import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiExternalLink } from 'react-icons/hi';

export default function ModelCard3D({ model, index }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  // Prevent body scroll when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  const close = () => setIsExpanded(false);

  return (
    <>
      {/* ── Compact Card ── */}
      <motion.div
        className="model-card"
        initial={{ opacity: 0, y: 40, rotateX: -10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{
          delay: index * 0.08,
          duration: 0.6,
          type: 'spring',
          stiffness: 100,
        }}
        whileHover={{
          y: -8,
          rotateX: 2,
          scale: 1.02,
          transition: { type: 'spring', stiffness: 300, damping: 20 },
        }}
        onClick={() => setIsExpanded(true)}
      >
        <div
          className="model-card-inner"
          style={{ borderTopColor: model.color || '#6366f1' }}
        >
          <div className="model-icon">{model.icon || '🤖'}</div>
          <h3 className="model-name">{model.name}</h3>
          <div className="model-category">
            <span
              className="model-category-dot"
              style={{ background: model.color || '#6366f1' }}
            />
            {model.category}
          </div>
          <p className="model-description-preview">{model.description}</p>
        </div>
      </motion.div>

      {/* ── Expanded Overlay ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            <motion.div
              className="model-card-expanded"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={close} aria-label="Close">
                ✕
              </button>

              <div className="model-icon model-icon-large">
                {model.icon || '🤖'}
              </div>

              <h2 className="model-name">{model.name}</h2>

              <div className="model-category">
                <span
                  className="model-category-dot"
                  style={{ background: model.color || '#6366f1' }}
                />
                {model.category}
              </div>

              <p className="model-description">{model.description}</p>

              {model.link && (
                <a
                  className="model-link-btn"
                  href={model.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Visit Model</span>
                  <HiExternalLink />
                </a>
              )}

              {model.tags && model.tags.length > 0 && (
                <div className="model-tags">
                  {model.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
