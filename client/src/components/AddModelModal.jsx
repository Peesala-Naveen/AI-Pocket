import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useModels } from '../context/ModelContext';
import { HiX } from 'react-icons/hi';

const CATEGORIES = [
  'Text Generation',
  'Image Generation',
  'Code Assistant',
  'Audio & Speech',
  'Video Generation',
  'Multimodal',
  'Data & Analytics',
  'Other',
];

const INITIAL_FORM = {
  name: '',
  link: '',
  description: '',
  category: '',
};

export default function AddModelModal({ isOpen, onClose, modelToEdit }) {
  const { addModel, updateModel, confirm } = useModels();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Populate or reset form when modelToEdit or isOpen changes
  useEffect(() => {
    if (modelToEdit) {
      setFormData({
        name: modelToEdit.name || '',
        link: modelToEdit.link || '',
        description: modelToEdit.description || '',
        category: modelToEdit.category || '',
      });
    } else {
      setFormData(INITIAL_FORM);
    }
  }, [modelToEdit, isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate non-empty
    if (!formData.name.trim() || !formData.link.trim() || !formData.description.trim() || !formData.category) {
      toast.error('Please fill in all fields');
      return;
    }

    if (modelToEdit) {
      const confirmed = await confirm(
        "Save Changes",
        "Are you sure you want to save changes to this model?",
        "info"
      );
      if (!confirmed) return;
    }

    try {
      setSubmitting(true);
      if (modelToEdit) {
        await updateModel(modelToEdit._id, formData);
      } else {
        await addModel(formData);
        setFormData(INITIAL_FORM);
      }
      onClose();
    } catch {
      toast.error(modelToEdit ? 'Failed to update model. Please try again.' : 'Failed to add model. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="text-gradient">{modelToEdit ? 'Edit Model' : 'Add New Model'}</h2>
              <button className="close-btn" onClick={onClose} aria-label="Close modal">
                <HiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="model-name">Name</label>
                <input
                  id="model-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., ChatGPT"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="model-link">Link</label>
                <input
                  id="model-link"
                  type="url"
                  name="link"
                  value={formData.link}
                  placeholder="https://..."
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="model-description">Description</label>
                <textarea
                  id="model-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What does this model do?"
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="model-category">Category</label>
                <select
                  id="model-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting
                    ? modelToEdit
                      ? 'Saving…'
                      : 'Adding…'
                    : modelToEdit
                    ? 'Save Changes'
                    : 'Add Model'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
