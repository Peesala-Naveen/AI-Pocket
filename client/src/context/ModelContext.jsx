import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Fuse from 'fuse.js';
import toast from 'react-hot-toast';
import {
  fetchModels as apiFetchModels,
  createModel as apiCreateModel,
  updateModel as apiUpdateModel,
  deleteModel as apiDeleteModel,
  searchModelsAPI,
} from '../hooks/useModelAPI';

const ModelContext = createContext(null);

const FUSE_OPTIONS = {
  keys: ['name', 'description', 'category', 'tags'],
  threshold: 0.4,
  includeScore: true,
};

export function ModelProvider({ children }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQueryState] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [modelToEdit, setModelToEdit] = useState(null);

  const debounceTimerRef = useRef(null);

  // Memoize Fuse instance — recreate only when models change
  const fuse = useMemo(() => new Fuse(models, FUSE_OPTIONS), [models]);

  // ── Fetch all models on mount ──
  const refreshModels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetchModels();
      setModels(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load models';
      setError(msg);
      console.error('[ModelContext] fetchModels error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshModels();
  }, [refreshModels]);

  // ── Add Model ──
  const addModel = useCallback(async (data) => {
    try {
      const created = await apiCreateModel(data);
      setModels((prev) => [created, ...prev]);
      toast.success(`"${created.name}" added successfully!`);
      return created;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add model';
      toast.error(msg);
      throw err;
    }
  }, []);

  // ── Update Model ──
  const updateModel = useCallback(async (id, data) => {
    try {
      const updated = await apiUpdateModel(id, data);
      setModels((prev) => prev.map((m) => (m._id === id ? updated : m)));
      toast.success(`"${updated.name}" updated successfully!`);
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update model';
      toast.error(msg);
      throw err;
    }
  }, []);

  // ── Delete Model ──
  const deleteModel = useCallback(async (id) => {
    try {
      await apiDeleteModel(id);
      setModels((prev) => prev.filter((m) => m._id !== id));
      toast.success('Model deleted');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete model';
      toast.error(msg);
      throw err;
    }
  }, []);

  // ── Search ──
  const setSearchQuery = useCallback(
    (query) => {
      setSearchQueryState(query);

      // Immediate client-side Fuse.js search
      if (query.length >= 2) {
        setIsSearching(true);
        const clientResults = fuse.search(query).map((r) => r.item);
        setSearchResults(clientResults);
      } else {
        setIsSearching(false);
        setSearchResults([]);
      }

      // Debounced backend search to merge with client results
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (query.length >= 2) {
        debounceTimerRef.current = setTimeout(async () => {
          try {
            const backendResults = await searchModelsAPI(query);
            if (!Array.isArray(backendResults)) return;

            // Merge: union of client + backend, deduplicated by _id
            setSearchResults((prevClientResults) => {
              const map = new Map();
              prevClientResults.forEach((m) => map.set(m._id, m));
              backendResults.forEach((m) => {
                if (!map.has(m._id)) map.set(m._id, m);
              });
              return Array.from(map.values());
            });
          } catch {
            // Backend search failed — client results are still shown
          }
        }, 400);
      }
    },
    [fuse]
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const [confirmState, setConfirmState] = useState(null);

  const confirm = useCallback((title, message, type = 'info') => {
    return new Promise((resolve) => {
      setConfirmState({ title, message, type, resolve });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmState) {
      confirmState.resolve(true);
      setConfirmState(null);
    }
  }, [confirmState]);

  const handleCancel = useCallback(() => {
    if (confirmState) {
      confirmState.resolve(false);
      setConfirmState(null);
    }
  }, [confirmState]);

  const value = useMemo(
    () => ({
      models,
      loading,
      error,
      searchQuery,
      searchResults,
      isSearching,
      addModel,
      updateModel,
      deleteModel,
      setSearchQuery,
      refreshModels,
      modelToEdit,
      setModelToEdit,
      confirmState,
      confirm,
      handleConfirm,
      handleCancel,
    }),
    [
      models,
      loading,
      error,
      searchQuery,
      searchResults,
      isSearching,
      addModel,
      updateModel,
      deleteModel,
      setSearchQuery,
      refreshModels,
      modelToEdit,
      setModelToEdit,
      confirmState,
      confirm,
      handleConfirm,
      handleCancel,
    ]
  );

  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
}

export function useModels() {
  const ctx = useContext(ModelContext);
  if (!ctx) {
    throw new Error('useModels must be used within a ModelProvider');
  }
  return ctx;
}
