import {create} from 'zustand';

interface PokemonState {
  filters: {
    type: string;
    generation: string;
    search: string;
  };
  searchQuery: string;
  setFilters: (filters: { type: string; generation: string; search: string; }) => void;
  setSearchQuery: (query: string) => void;
}

export const usePokemonStore = create<PokemonState>((set) => ({
  filters: {
    type: '',
    generation: '',
    search: '',
  },
  searchQuery: '',
  setFilters: (filters) => set(() => ({ filters })),
  setSearchQuery: (query) => set(() => ({ searchQuery: query })),
}));