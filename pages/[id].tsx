import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { usePokemonDetails } from '../hooks/usePokemon';
import Link from 'next/link';

const getTypeColor = (type: string) => {
  const typeColors: Record<string, string> = {
    fire: '#F08030',
    water: '#6390F0',
    grass: '#7AC74C',
    normal: '#A8A77A',
    fighting: '#C22E28',
    flying: '#A98FF3',
    rock: '#B6A136',
    steel: '#B7B7CE',
    ground: '#E2BF65',
    bug: '#A6B91A',
    poison: '#A33EA1',
    electric: '#F7D02C',
    ghost: '#735797',
    psychic: '#F95587',
    ice: '#96D9D6',
    dragon: '#6F35FC',
    dark: '#705746',
    fairy: '#D685AD',
    unknown: '#BDBDBD',
  };

  return typeColors[type] || '#FFFFFF'; 
};

const filterGenerations = (generations: Record<string, Record<string, any>>) => {
  const filteredGenerations: Record<string, Record<string, any>> = {};
  for (const [generation, games] of Object.entries(generations)) {
    const hasValidSprites = Object.values(games).some((sprites) =>
      Object.values(sprites).some((sprite) => sprite !== null)
    );
    if (hasValidSprites) {
      filteredGenerations[generation] = games;
    }
  }
  return filteredGenerations;
};





const PokemonPage = () => {
  
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading } = usePokemonDetails(Number(id));

  const filteredGenerations = filterGenerations(data?.generations || {});
  const generationsText = Object.keys(filteredGenerations).join(', ') || 'No valid generations data available';

  if (isLoading) return <p>Loading...</p>;

  const types = data?.types.map((t: any) => t.type.name) || [];
  const typeColors = types.map((type) => getTypeColor(type));
  const gradientBackground =
    typeColors.length > 1
      ? `linear-gradient(135deg, ${typeColors.join(', ')})`
      : typeColors[0];
  const generations = data?.generations ? Object.keys(data.generations).join(', ') : 'No generations data available';

  const renderEvolutionChain = (chain: { id: number; name: string; image: string }[]) => {
    if (!chain || chain.length === 0) return <p>No evolution data available</p>;
  
    return (
      <div className="flex items-center space-x-4">
        {chain.map((pokemon, index) => (
          <div key={pokemon.name} className="flex items-center">
            <div className="text-center">
              <Link href={`/${pokemon.id}`} passHref>
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  width="60"
                  height="60"
                  className="mb-2"
                />
              </Link>
              <p>{pokemon.name}</p>
            </div>
            {index < chain.length - 1 && (
              <span className="text-xl font-bold mx-2">→</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const VerticalMenu = () => {
    const router = useRouter();
  
    return (
      <div className="absolute top-4 left-4 bg-white text-white rounded-lg shadow-md p-4 flex flex-col space-y-2">
        <button
          onClick={() => router.back()}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
        >
          ← Back
        </button>
        <button
          onClick={() => router.push('/')}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
        >
          Home
        </button>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen p-4"
      style={{
        background: gradientBackground,
        color: '#FFF',
      }}
    >
      <VerticalMenu />
      <div className="flex flex-col items-center space-y-8">
        {/* Nombre e imagen del Pokémon */}
        <h1 className="text-4xl font-bold capitalize">{data?.name}</h1>
        <img
          src={data?.sprites.front_default}
          alt={data?.name}
          className="w-40 h-40 object-contain"
        />

        {/* Detalles del Pokémon */}
        <div className="w-full md:w-2/3 bg-white bg-opacity-90 p-6 rounded-lg shadow-md text-black">
          <p className="text-xl font-semibold mb-2">Generations:</p>
          <p>{generationsText}</p>
          

          {/* Cadena evolutiva */}
          <p className="text-xl font-semibold mt-4 mb-2">Evolution Chain:</p>
          <div className="flex space-x-4 overflow-x-auto">
            {renderEvolutionChain(data?.evolutionChain || [])}
          </div>

          {/* Tipos */}
          <p className="text-xl font-semibold mt-4 mb-2">Types:</p>
          <div className="flex space-x-2">
            {data?.types.map((type: any) => (
              <span
                key={type.type.name}
                className="px-4 py-2 rounded-full text-white"
                style={{ backgroundColor: getTypeColor(type.type.name) }}
              >
                {type.type.name}
              </span>
            ))}
          </div>

          {/* Estadísticas */}
          <p className="text-xl font-semibold mt-4 mb-2">Stats:</p>
          <ul>
            {data?.stats.map((stat: any) => (
              <li key={stat.stat.name} className="flex justify-between">
                <span>{stat.stat.name}:</span>
                <span>{stat.base_stat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PokemonPage;