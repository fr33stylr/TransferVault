import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Papa from 'papaparse';
import type { Player } from '../types';

function SearchPage() {
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [suggestions, setSuggestions] = useState<Player[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const response = await fetch('/src/data/players.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            setPlayers(results.data as Player[]);
          }
        });
      } catch (err) {
        console.error('Error loading players:', err);
      }
    };

    loadPlayers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPlayerName(value);

    if (value.trim()) {
      const filtered = players.filter(player =>
        player.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      const player = players.find(
        p => p.name.toLowerCase().includes(playerName.toLowerCase())
      );
      if (player) {
        navigate(`/player/${encodeURIComponent(player.name)}`);
      }
    }
  };

  const handleSuggestionClick = (player: Player) => {
    navigate(`/player/${encodeURIComponent(player.name)}`);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4 relative"
      style={{
      backgroundImage: 'url(/gyokeres.png)',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backgroundBlendMode: 'overlay'
      }}
    >
      <div className="w-full max-w-xl text-center relative z-10">
      <h1 className="text-6xl font-bold mb-8 text-emerald-400 tracking-wider">
        TRANSFERVAULT
      </h1>
      <p className="text-gray-300 mb-8 text-xl">
        ENTER PLAYER NAME:
      </p>
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
        <input
          type="text"
          value={playerName}
          onChange={handleInputChange}
          className="w-full px-6 py-4 bg-black/50 backdrop-blur-sm text-white rounded-lg border-2 border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Search for a player..."
        />
        {suggestions.length > 0 && (
          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-400 scrollbar-track-gray-800">

{suggestions.map((player, index) => (

            <button
            key={index}
            onClick={() => handleSuggestionClick(player)}
            className="w-full px-6 py-3 text-left text-white hover:bg-emerald-400/20 transition-colors duration-200 flex items-center justify-between border-b border-emerald-400/20 last:border-b-0"

            >
            <span>{player.name}</span>
            <span className="text-emerald-400 text-sm">{player.club}</span>
            </button>
          ))}
          </div>
        )}
        </div>
        <button
        type="submit"
        className="w-full bg-emerald-500 text-white py-4 rounded-lg hover:bg-emerald-600 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
        <Search size={20} />
        <span>SEARCH</span>
        </button>
      </form>
      </div>
    </div>
  );
}

export default SearchPage;