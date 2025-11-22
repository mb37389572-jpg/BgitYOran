import React, { useState } from 'react';
import { Match } from '../types';
import { Plus, Trophy, Dribbble, Search, ExternalLink } from 'lucide-react';

interface MatchInputProps {
  onAddMatch: (match: Match) => void;
}

export const MatchInput: React.FC<MatchInputProps> = ({ onAddMatch }) => {
  const [sport, setSport] = useState<'football' | 'basketball'>('football');
  const [homeName, setHomeName] = useState('');
  const [awayName, setAwayName] = useState('');
  const [homeLogo, setHomeLogo] = useState('');
  const [awayLogo, setAwayLogo] = useState('');
  const [time, setTime] = useState('20:00');
  const [ms1, setMs1] = useState('1.50');
  const [msx, setMsx] = useState('3.50');
  const [ms2, setMs2] = useState('2.10');

  const openGoogleSearch = (teamName: string) => {
    if (!teamName) return;
    const query = `${teamName} ${sport} logo transparent`;
    window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMatch: Match = {
      id: Date.now().toString(),
      homeTeam: { name: homeName.toUpperCase(), logoUrl: homeLogo },
      awayTeam: { name: awayName.toUpperCase(), logoUrl: awayLogo },
      time,
      odds: { ms1, msx, ms2 },
    };
    onAddMatch(newMatch);
    // Reset
    setHomeName('');
    setAwayName('');
    setHomeLogo('');
    setAwayLogo('');
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl">
      <h2 className="text-xl font-sport font-bold text-brand-yellow mb-4 flex items-center gap-2">
        <Plus size={20} /> Yeni Maç Ekle
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Sport Selector */}
        <div className="flex bg-zinc-800 p-1 rounded-lg mb-4">
          <button
            type="button"
            onClick={() => setSport('football')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all ${
              sport === 'football' 
                ? 'bg-brand-yellow text-black shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Trophy size={16} /> Futbol
          </button>
          <button
            type="button"
            onClick={() => setSport('basketball')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all ${
              sport === 'basketball' 
                ? 'bg-brand-yellow text-black shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Dribbble size={16} /> Basketbol
          </button>
        </div>

        {/* Teams Input Grid */}
        <div className="grid grid-cols-2 gap-6">
          
          {/* Home Team */}
          <div className="space-y-3">
            <label className="text-xs text-zinc-400 uppercase font-bold">Ev Sahibi</label>
            <div className="relative">
              <input
                type="text"
                value={homeName}
                onChange={(e) => setHomeName(e.target.value)}
                placeholder={sport === 'football' ? "ör. Arsenal" : "ör. Lakers"}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-yellow text-white pl-8"
              />
              <Search className="absolute left-2.5 top-2.5 text-zinc-500" size={14} />
            </div>
            
            {/* Logo Preview & URL Edit */}
            <div className="flex gap-2 items-start">
                 <div className="w-12 h-12 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center flex-shrink-0 overflow-hidden relative group">
                    {homeLogo ? (
                      <img src={homeLogo} alt="Logo" className="w-full h-full object-contain p-1" crossOrigin="anonymous" />
                    ) : (
                      <span className="text-[10px] text-zinc-600 text-center leading-tight">Logo<br/>Yok</span>
                    )}
                 </div>
                 <div className="flex-grow space-y-1">
                    <div className="flex relative">
                        <input 
                            type="text" 
                            value={homeLogo}
                            onChange={(e) => setHomeLogo(e.target.value)}
                            placeholder="Logo URL (Oto/Yapıştır)"
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded px-2 py-1 text-[10px] text-zinc-400 focus:text-white focus:outline-none focus:border-brand-yellow"
                        />
                    </div>
                    <button 
                        type="button" 
                        onClick={() => openGoogleSearch(homeName)}
                        className="text-[10px] flex items-center gap-1 text-zinc-500 hover:text-brand-yellow transition-colors"
                    >
                        <ExternalLink size={10} /> Yanlış logo? Google'da Ara
                    </button>
                 </div>
            </div>
          </div>

          {/* Away Team */}
          <div className="space-y-3">
            <label className="text-xs text-zinc-400 uppercase font-bold">Deplasman</label>
             <div className="relative">
              <input
                type="text"
                value={awayName}
                onChange={(e) => setAwayName(e.target.value)}
                placeholder={sport === 'football' ? "ör. Liverpool" : "ör. Celtics"}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-yellow text-white pl-8"
              />
              <Search className="absolute left-2.5 top-2.5 text-zinc-500" size={14} />
            </div>

             {/* Logo Preview & URL Edit */}
            <div className="flex gap-2 items-start">
                 <div className="w-12 h-12 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center flex-shrink-0 overflow-hidden relative group">
                    {awayLogo ? (
                      <img src={awayLogo} alt="Logo" className="w-full h-full object-contain p-1" crossOrigin="anonymous" />
                    ) : (
                      <span className="text-[10px] text-zinc-600 text-center leading-tight">Logo<br/>Yok</span>
                    )}
                 </div>
                 <div className="flex-grow space-y-1">
                    <div className="flex relative">
                        <input 
                            type="text" 
                            value={awayLogo}
                            onChange={(e) => setAwayLogo(e.target.value)}
                            placeholder="Logo URL (Oto/Yapıştır)"
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded px-2 py-1 text-[10px] text-zinc-400 focus:text-white focus:outline-none focus:border-brand-yellow"
                        />
                    </div>
                    <button 
                        type="button" 
                        onClick={() => openGoogleSearch(awayName)}
                        className="text-[10px] flex items-center gap-1 text-zinc-500 hover:text-brand-yellow transition-colors"
                    >
                        <ExternalLink size={10} /> Yanlış logo? Google'da Ara
                    </button>
                 </div>
            </div>
          </div>
        </div>

        {/* Time & Odds */}
        <div className="grid grid-cols-4 gap-2 mt-2">
          <div>
            <label className="text-xs text-zinc-400 uppercase font-bold block mb-1">Saat</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:border-brand-yellow text-white"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 uppercase font-bold block mb-1">MS 1</label>
            <input
              type="text"
              value={ms1}
              onChange={(e) => setMs1(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-2 text-sm text-center text-brand-yellow font-mono focus:outline-none focus:border-brand-yellow"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 uppercase font-bold block mb-1">MS X</label>
            <input
              type="text"
              value={msx}
              onChange={(e) => setMsx(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-2 text-sm text-center text-brand-yellow font-mono focus:outline-none focus:border-brand-yellow"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 uppercase font-bold block mb-1">MS 2</label>
            <input
              type="text"
              value={ms2}
              onChange={(e) => setMs2(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-2 text-sm text-center text-brand-yellow font-mono focus:outline-none focus:border-brand-yellow"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-brand-yellow hover:bg-yellow-500 text-black font-bold py-3 rounded-lg mt-4 transition-colors font-sport uppercase tracking-wider"
        >
          Karşılaşma Ekle
        </button>
      </form>
    </div>
  );
};