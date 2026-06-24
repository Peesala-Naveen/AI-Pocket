import { AnimatePresence } from 'framer-motion';
import { useModels } from '../context/ModelContext';
import ModelCard3D from './ModelCard3D';

export default function ModelGrid({ vaultState }) {
  const { models, searchResults, searchQuery, loading, isSearching } = useModels();

  const displayModels = searchQuery?.length >= 2 ? searchResults : models;

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="model-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="skeleton-card" key={i}>
            <div className="skeleton-line skeleton-icon animate-shimmer" />
            <div className="skeleton-line skeleton-title animate-shimmer" />
            <div className="skeleton-line skeleton-category animate-shimmer" />
            <div className="skeleton-line skeleton-desc animate-shimmer" />
            <div className="skeleton-line skeleton-desc-short animate-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  // ── Empty state ──
  if (displayModels.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">📭</span>
        <h3>No AI Models Found</h3>
        <p>
          {isSearching
            ? 'Try adjusting your search query or clearing the filter.'
            : 'Get started by adding your first AI model to the vault.'}
        </p>
      </div>
    );
  }

  const isVisible = vaultState === 'open' || vaultState === 'opening' || vaultState === 'closing';

  // ── Grid ──
  return (
    <div className="model-grid-container" style={{ minHeight: isVisible ? 'auto' : '0' }}>
      <AnimatePresence>
        {isVisible && (
          <div className="model-grid">
            {displayModels.map((model, i) => (
              <ModelCard3D key={model._id} model={model} index={i} totalCount={displayModels.length} />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

