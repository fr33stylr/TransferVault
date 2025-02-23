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

    // Function to get player image based on name
    const getPlayerImage = (name: string) => {
      const imageMap: { [key: string]: string } = {
        'Erling Haaland': 'https://biucazilwqgdipdptgnh.supabase.co/storage/v1/object/public/pics/haaland.jpeg',
        'Kylian Mbappé': 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRIiyRW0hVBB2t9FpvsKzXBDeBRXtJXxIlbs3_tEwh3Xr06xCLtRx_h823mTmpplVjDnEDKZcDhT95kjSs',
        'Harry Kane': 'https://assets.goal.com/images/v3/bltd32b7be8e4199395/GOAL_-_Blank_WEB_-_Facebook_(81).jpg?auto=webp&format=pjpg&width=3840&quality=60',
        'Jude Bellingham': 'https://tmssl.akamaized.net/images/foto/galerie/jude-bellingham-real-madrid-2023-24-1698938944-121078.jpg',
        'Vinicius Jr.':'https://tmssl.akamaized.net/images/foto/galerie/vinicius-junior-real-madrid-2024-1731166100-153769.jpg' ,
        'Bukayo Saka': 'https://e0.365dm.com/24/02/2048x1152/skysports-bukayo-saka-arsenal_6468486.jpg?20240224213929',
        'Victor Osimhen':'https://media.cnn.com/api/v1/images/stellar/prod/230929040658-01-victor-osimhen-092723-restricted.jpg?c=16x9&q=h_833,w_1480,c_fill',
        'Phil Foden':'https://i.guim.co.uk/img/media/5ffcda128c221dbfc54ec9f6c74f84212cb90a7c/0_74_2300_1380/master/2300.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=35806a153f05fa33d228278d6fe5c58e',
        'Rodri':'https://tmssl.akamaized.net/images/foto/galerie/rodri-spain-euro-2024-1720799713-142340.jpg',
        'Bruno Fernandes':'https://tmssl.akamaized.net/images/foto/galerie/bruno-fernandes-manchester-united-2024-1713039540-134196.jpg',  
        'Lionel Messi':"https://cdn.vox-cdn.com/thumbor/B2sS7T94K3E9oDFSdA29_QPSMH0=/0x0:4500x3000/1200x800/filters:focal(1138x431:1858x1151)/cdn.vox-cdn.com/uploads/chorus_image/image/73741835/1133831265.0.jpg",
        'Cristiano Ronaldo':"https://www.sportico.com/wp-content/uploads/2024/09/GettyImages-1734016483-e1726177787958.jpg?w=1280&h=719&crop=1",
        'Neymar Jr': "https://assets.goal.com/images/v3/SPOX_6851380/contentpush.tmp?auto=webp&format=pjpg&width=3840&quality=60"
        
        
        
        
      };
      
      return imageMap[name] || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1000';
    };
  
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
          {/* Player Header with Image */}
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl mb-8">
            <div className="relative h-96">
              <div className="absolute inset-0">
                <img
                  src={getPlayerImage(player.name)}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                  <div>
                    <h1 className="text-5xl font-bold mb-2 text-white shadow-text">{player.name}</h1>
                    <div className="flex items-center space-x-4 text-gray-200">
                      <span className="flex items-center">
                        <Trophy className="w-5 h-5 mr-1" />
                        {player.position}
                      </span>
                      <span className="flex items-center">
                        <Flag className="w-5 h-5 mr-1" />
                        {player.nationality}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-5 h-5 mr-1" />
                        {player.age} years
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="flex items-center space-x-2 bg-black/50 px-4 py-2 rounded-full">
                      <Coins className="text-emerald-400" size={24} />
                      <span className="text-2xl font-bold text-emerald-400">
                        €{(player.market_value / 1000000).toFixed(1)}M
                      </span>
                    </div>
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