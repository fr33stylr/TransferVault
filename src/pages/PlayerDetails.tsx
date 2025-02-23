import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { ArrowLeft, Trophy, Flag, Clock, Building, Coins } from 'lucide-react';
import type { Player } from '../types';

function PlayerDetails() {
  const { playerName } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadPlayerData = async () => {
      try {
        const response = await fetch('/src/data/players.csv');
        const csvText = await response.text();
        
        interface CsvResults {
          data: Player[];
        }

        Papa.parse(csvText, {
          header: true,
          complete: (results: CsvResults) => {
            const players = results.data;
            const foundPlayer = players.find(
              p => p.name.toLowerCase() === decodeURIComponent(playerName || '').toLowerCase()
            );
            
            if (foundPlayer) {
              setPlayer(foundPlayer);
            } else {
              setError('Player not found');
            }
          },
          error: (error: Error) => {
            setError('Error loading player data');
            console.error('CSV parsing error:', error);
          }
        });
      } catch (err) {
        setError('Error loading player data');
        console.error('Data loading error:', err);
      }
    };

    loadPlayerData();
  }, [playerName]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">{error}</h2>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300"
          >
            <ArrowLeft size={20} />
            <span>Back to Search</span>
          </button>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  const careerHistory = player.career_history.split(', ').map(club => {
    const [clubName, period] = club.split(' (');
    return {
      name: clubName,
      period: period.replace(')', '')
    };
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 mb-8"
      >
        <ArrowLeft size={20} />
        <span>Back to Search</span>
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Player Header */}
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{player.name}</h1>
                <div className="flex items-center space-x-4 text-gray-400">
                  <span className="flex items-center">
                    <Trophy className="w-4 h-4 mr-1" />
                    {player.position}
                  </span>
                  <span className="flex items-center">
                    <Flag className="w-4 h-4 mr-1" />
                    {player.nationality}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {player.age} years
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex items-center space-x-2">
                  <Coins className="text-emerald-400" size={24} />
                  <span className="text-2xl font-bold text-emerald-400">
                    €{(player.market_value / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Career History */}
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <Building className="text-emerald-400 mr-3" size={24} />
              <h2 className="text-2xl font-bold">Career History</h2>
            </div>
            
            <div className="relative">
              {careerHistory.map((club, index) => (
                <div key={index} className="mb-8 relative">
                  {/* Timeline line */}
                  {index !== careerHistory.length - 1 && (
                    <div className="absolute left-4 top-8 w-0.5 h-full bg-emerald-400/30"></div>
                  )}
                  
                  {/* Club entry */}
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center shrink-0 z-10">
                      <Building className="w-4 h-4 text-gray-900" />
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-semibold text-white">{club.name}</h3>
                      <p className="text-emerald-400 font-medium">{club.period}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerDetails;