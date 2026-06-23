import { useMemo } from 'react';
import Fuse from 'fuse.js';

const DEFAULT_OPTIONS = {
  keys: ['name', 'description', 'category', 'tags'],
  threshold: 0.4,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
};

const useSearch = (items, query, options = {}) => {
  const fuseOptions = useMemo(
    () => ({ ...DEFAULT_OPTIONS, ...options }),
    [options]
  );

  const fuse = useMemo(
    () => new Fuse(items || [], fuseOptions),
    [items, fuseOptions]
  );

  const results = useMemo(() => {
    if (!query || query.length < 2) {
      return items || [];
    }
    return fuse.search(query).map((r) => r.item);
  }, [fuse, query, items]);

  const isSearching = query?.length >= 2;

  return { results, isSearching };
};

export default useSearch;
