export interface Pokemon {
    id: number;
    name: string;
    types: { type: { name: string } }[];
    stats: { base_stat: number; stat: { name: string } }[];
    sprites: { front_default: string };
    species: { url: string };
  }
  
  export interface Evolution {
    name: string;
    id: number;
    sprite: string;
  }