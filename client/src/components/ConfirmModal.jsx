import { motion, AnimatePresence } from 'framer-motion';
import { HiExclamation } from 'react-icons/hi';

export default function ConfirmModal({ isOpen, title, message, type = 'info', onConfirm, onCancel }) {
  const confirmText = type === 'danger' ? 'Delete' : 'Confirm';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ zIndex: 1200 }}
          onClick={onCancel}
        >
          <motion.div
            className="modal-content confirm-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-header">
              <div className={`confirm-icon ${type}`}>
                <HiExclamation />
              </div>
              <h2 className="confirm-title">{title}</h2>
            </div>
            
            <p className="confirm-message">{message}</p>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`btn ${type === 'danger' ? 'btn-danger' : 'btn-primary'}`}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
