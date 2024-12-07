import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { Pokemon } from '../types/pokemon';


type Generations = Record<string, Record<string, any>>;

function getGenerations (pokemon: any){
  const generaciones = pokemon.sprites.versions as Record<string, Record<string, any>>;
  const resultado: Generations = {};

  for (const [generacion, juegos] of Object.entries(generaciones)) {
    resultado[generacion] = {};

    for (const [juego, sprites] of Object.entries(juegos as Record<string, any>)) {
      resultado[generacion][juego] = sprites;
    }
  }

  return resultado;
};

export const usePokemonList = () => {
  return useQuery({
    queryKey: ['pokemon-list'], 
    queryFn: async () => {
      const response = await api.get('/pokemon?limit=905');

      const pokemonDetails = await Promise.all(
        response.data.results.map(async (pokemon: any) => {
            const pokemonResponse = await api.get(pokemon.url);
            const id = pokemonResponse.data.id;
            return{
                ...pokemon,
                types: pokemonResponse.data.types.map((t: any) => t.type.name),
                id,
                generations: getGenerations(pokemonResponse.data),
            };
        })
      );
      console.log("Data Estructurada: ", pokemonDetails);

      return pokemonDetails;

    },
  });
};

export const usePokemonDetails = (id: number) => {
  return useQuery({
    queryKey: ['pokemon-details', id],
    queryFn: async () => {
      const response = await api.get(`/pokemon/${id}`);
      const pokemon = response.data;
      const generations = getGenerations(pokemon);
      
      const evolutionResponse = await api.get(`/pokemon-species/${id}`);
      const evolutionChainUrl = evolutionResponse.data.evolution_chain.url;

      const evolutionResponseData = await api.get(evolutionChainUrl);
      const evolutionChain = evolutionResponseData.data.chain;

      const getPokemonImage = (id: number) => {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
      };

      const evolveWithImages = async (chain: any) => {
        const evolutionList = [];
        let currentChain = chain;
        while (currentChain) {
          if (currentChain.species && currentChain.species.name) {
            const pokemonSpeciesResponse = await api.get(currentChain.species.url);
            const pokemonId = pokemonSpeciesResponse.data.id;
            const image = getPokemonImage(pokemonId); 
            evolutionList.push({
              id: pokemonId,
              name: currentChain.species.name,
              image,
            });
          }
          currentChain = currentChain.evolves_to[0]; 
        }
        return evolutionList;
      };

      const evolutionChainWithImages = await evolveWithImages(evolutionChain);

      return { ...pokemon, generations, evolutionChain: evolutionChainWithImages } as Pokemon & { generations: Generations, evolutionChain: { id: number, name: string, image: string }[] };

    },
    enabled: !!id, 
  });
};