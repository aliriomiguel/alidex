import { usePokemonList } from '../hooks/usePokemon';
import { usePokemonStore } from '../hooks/pokemonStore';
import { useEffect } from 'react';
import Link from 'next/link';

const HomePage = () => {
  const { filters, searchQuery, setFilters, setSearchQuery } = usePokemonStore();
  const { data, isLoading } = usePokemonList();

  const filteredPokemon = data?.filter((pokemon: any) => {
    const matchesType =
      !filters.type ||
      (pokemon.types && pokemon.types.includes(filters.type));
    
    const matchesGeneration =
      !filters.generation ||
      (pokemon.generations && Object.keys(pokemon.generations).some((generation) => {
        const hasValidSprites = Object.values(pokemon.generations[generation]).some(
          (sprites: any) => Object.values(sprites).some((sprite: any) => sprite !== null)
        );
        return hasValidSprites && generation === filters.generation;
    }));

    const matchesSearch =
      !filters.search || pokemon.name.toLowerCase().includes(filters.search.toLowerCase());

    return matchesType && matchesGeneration && matchesSearch;
  });

  useEffect(() => {
    if (filters.search !== searchQuery) {
      setFilters({
        ...filters,
        search: searchQuery,
      });
    }
  }, [searchQuery, filters, setFilters]);

  if (isLoading) return <p>Loading...</p>;
 

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-400 via-red-400 to-white-500">
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">Pokémon List</h1>

      {/* Filtros */}
      <div className="mb-4 flex space-x-4 justify-center">
        <select
          className="p-2 border rounded-md"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All Types</option>
          {['fire', 'water', 'grass', 'normal', 'fighting', 'flying', 'rock', 'steel', 'ground', 'bug', 'poison', 'electric', 'ghost', 'psychic', 'ice', 'dragon', 'dark', 'fairy', 'unknown'].map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          className="p-2 border rounded-md"
          value={filters.generation}
          onChange={(e) => setFilters({ ...filters, generation: e.target.value })}
        >
          <option value="">All Generations</option>
          {['generation-i', 'generation-ii', 'generation-iii', 'generation-iv', 'generation-v', 'generation-vi', 'generation-vii', 'generation-viii'].map(gen => (
            <option key={gen} value={gen}>{gen.replace('generation-', 'Generation ')}</option>
          ))}
        </select>

        <input
          className="p-2 border rounded-md"
          type="text"
          placeholder="Search Pokémon"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabla de Pokémon */}
      <table className="table-auto mx-auto text-center bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-3 px-4 text-center">ID</th>
            <th className="py-3 px-4 text-center">Name</th>
            <th className="py-3 px-4 text-center">Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredPokemon?.length ? (
            filteredPokemon.map((pokemon: any) => (
              <tr
                key={pokemon.id}
                className="hover:bg-gray-100"
              >
                <td className="py-2 px-4">{pokemon.id}</td>
                <td className="py-2 px-4">
                  <Link href={`/${pokemon.id}`} className="text-blue-500 hover:underline">{pokemon.name}</Link>
                </td>
                <td className="py-2 px-4">{pokemon.types.join(', ')}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="py-2 px-4 text-center">No Pokémon found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default HomePage;
