import React from 'react';
import { Match, CardConfig } from '../types';
import { X } from 'lucide-react';

interface BannerPreviewProps {
  matches: Match[];
  config: CardConfig;
  previewRef: React.RefObject<HTMLDivElement>;
  onRemoveMatch?: (id: string) => void;
  isExporting?: boolean;
  format: 'square' | 'story';
}

export const BannerPreview: React.FC<BannerPreviewProps> = ({
  matches,
  config,
  previewRef,
  onRemoveMatch,
  isExporting = false,
  format,
}) => {
  // Layout Logic
  const isStory = format === 'story';
  const isSquare = format === 'square';
  const matchCount = matches.length;
  
  // "Compact Mode" triggers only for Square format with > 4 matches.
  // This affects ONLY the internal layout of the match cards, NOT the header/footer.
  const isCompact = isSquare && matchCount > 4;

  // Dimensions
  const containerHeight = isStory ? '1920px' : '1080px';
  
  // Fixed Spacing (Container)
  const contentPadding = isStory ? 'p-12' : 'p-10'; 
  
  // Variable Gap (Matches)
  const matchGap = isStory ? 'gap-6' : (isCompact ? 'gap-1' : 'gap-5');
  
  // Header (FIXED based on format, NEVER changes on match count)
  const logoHeight = isStory ? 'h-40' : 'h-28';
  const logoMargin = isStory ? 'mb-6' : 'mb-2';
  const dateSize = isStory ? 'text-5xl' : 'text-4xl';
  const dateMargin = isStory ? 'mb-8' : 'mb-4';

  // Footer (FIXED based on format, NEVER changes on match count)
  const footerPadding = isStory ? 'pt-12' : 'pt-6';
  const footerTitleSize = isStory ? 'text-3xl' : 'text-2xl';
  const footerTextSize = isStory ? 'text-xl' : 'text-lg';

  // Typography (Matches - Adapts to fit 6 matches)
  const teamNameSize = isCompact ? 'text-xl' : (isStory ? 'text-4xl' : 'text-3xl'); 
  const teamLogoSize = isCompact ? 'w-14 h-14' : (isStory ? 'w-24 h-24' : 'w-20 h-20');
  const oddsTextSize = isCompact ? 'text-3xl' : (isStory ? 'text-5xl' : 'text-4xl');
  const oddsLabelSize = isCompact ? 'text-[10px]' : (isStory ? 'text-sm' : 'text-xs');

  return (
    <div 
        ref={previewRef}
        className="overflow-hidden shadow-2xl relative bg-zinc-950 text-white flex flex-col justify-between" 
        style={{ 
            width: '1080px', 
            height: containerHeight,
            backgroundImage: `
                radial-gradient(circle at 50% 0%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
                url('https://images.unsplash.com/photo-1518605348435-29b84690df08?q=80&w=2000&auto=format&fit=crop')
            `,
            backgroundSize: 'cover',
            backgroundBlendMode: 'multiply',
            backgroundPosition: 'center'
        }}
    >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
        
        {/* Content Container */}
        <div className={`relative z-10 flex flex-col h-full ${contentPadding}`}>
          
          {/* Header Section - Fixed Size */}
          <div className="flex-shrink-0 flex flex-col items-center">
             <div className={`flex justify-center items-center ${logoMargin}`}>
                <img 
                  src="https://res.cloudinary.com/dhznjbcys/image/upload/v1763817620/32435_xpx0re.png"
                  alt="BetGit Logo"
                  className={`${logoHeight} object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]`}
                  crossOrigin="anonymous"
                />
              </div>

              <div className={`text-center ${dateMargin}`}>
                <h2 className={`${dateSize} font-sport font-bold text-white tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] border-b-2 border-brand-yellow inline-block pb-1 px-8`}>
                  {config.date}
                </h2>
              </div>
          </div>

          {/* Matches Grid - Flexible Area */}
          <div className={`flex-grow flex flex-col ${matchGap} justify-center min-h-0`}>
            {matches.length === 0 && (
              <div className="text-center text-zinc-500 text-3xl font-sport italic opacity-50">
                Add matches to preview
              </div>
            )}
            
            {matches.map((match) => (
              <div 
                key={match.id} 
                className={`relative group flex-1 min-h-0`}
              >
                {!isExporting && onRemoveMatch && (
                  <button
                    onClick={() => onRemoveMatch(match.id)}
                    className="absolute -left-12 top-1/2 -translate-y-1/2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-50"
                  >
                    <X size={24} />
                  </button>
                )}

                {/* Card Container */}
                <div className={`
                    relative h-full w-full 
                    bg-gradient-to-r from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 
                    backdrop-blur-md border border-zinc-700/50 rounded-xl shadow-lg 
                    flex items-center overflow-hidden
                    ${isCompact ? 'flex-row' : 'flex-col justify-center p-4'}
                `}>
                  
                  {/* COMPACT LAYOUT (Square > 4 matches) */}
                  {isCompact ? (
                      <>
                        {/* LEFT SIDEBAR: TIME */}
                        <div className="h-full w-20 bg-white/5 border-r border-white/10 flex flex-col items-center justify-center flex-shrink-0">
                            <span className="text-lg font-mono font-bold text-zinc-300">{match.time}</span>
                        </div>

                        {/* MIDDLE: TEAMS */}
                        <div className="flex-grow flex items-center justify-between px-4 h-full">
                            {/* Home */}
                            <div className="flex items-center justify-end gap-3 w-[42%]">
                                <span className={`${teamNameSize} font-black font-sport uppercase truncate text-right tracking-wide text-white leading-none`}>
                                    {match.homeTeam.name}
                                </span>
                                <div className={`${teamLogoSize} flex-shrink-0 flex items-center justify-center bg-white/5 rounded-full p-1 shadow-sm border border-white/10`}>
                                    {match.homeTeam.logoUrl ? (
                                        <img src={match.homeTeam.logoUrl} className="w-full h-full object-contain" alt={match.homeTeam.name} crossOrigin="anonymous" />
                                    ) : <div className="w-full h-full bg-zinc-700 rounded-full" />}
                                </div>
                            </div>

                            {/* VS */}
                            <div className="flex flex-col items-center justify-center px-2">
                                <span className="text-brand-yellow font-sport text-2xl italic font-black tracking-tighter drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]">VS</span>
                            </div>

                            {/* Away */}
                            <div className="flex items-center justify-start gap-3 w-[42%]">
                                <div className={`${teamLogoSize} flex-shrink-0 flex items-center justify-center bg-white/5 rounded-full p-1 shadow-sm border border-white/10`}>
                                    {match.awayTeam.logoUrl ? (
                                        <img src={match.awayTeam.logoUrl} className="w-full h-full object-contain" alt={match.awayTeam.name} crossOrigin="anonymous" />
                                    ) : <div className="w-full h-full bg-zinc-700 rounded-full" />}
                                </div>
                                <span className={`${teamNameSize} font-black font-sport uppercase truncate text-left tracking-wide text-white leading-none`}>
                                    {match.awayTeam.name}
                                </span>
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR: ODDS */}
                        <div className="h-full w-72 flex items-center justify-center gap-5 bg-black/20 border-l border-white/5 flex-shrink-0">
                            <div className="flex flex-col items-center min-w-[60px]">
                                <span className={`${oddsTextSize} font-black text-brand-yellow font-sport leading-none tracking-tight`}>{match.odds.ms1}</span>
                                <span className={`${oddsLabelSize} font-bold text-zinc-500 uppercase mt-1`}>MS 1</span>
                            </div>
                            <div className="flex flex-col items-center min-w-[60px]">
                                <span className={`${oddsTextSize} font-black text-brand-yellow font-sport leading-none tracking-tight`}>{match.odds.msx}</span>
                                <span className={`${oddsLabelSize} font-bold text-zinc-500 uppercase mt-1`}>MS X</span>
                            </div>
                            <div className="flex flex-col items-center min-w-[60px]">
                                <span className={`${oddsTextSize} font-black text-brand-yellow font-sport leading-none tracking-tight`}>{match.odds.ms2}</span>
                                <span className={`${oddsLabelSize} font-bold text-zinc-500 uppercase mt-1`}>MS 2</span>
                            </div>
                        </div>
                      </>
                  ) : (
                      /* STANDARD LAYOUT (Vertical / Less Matches) */
                      <>
                        {/* Time Pill */}
                        <div className={`
                            bg-zinc-800/90 border border-brand-yellow/30 text-brand-yellow rounded-full font-bold font-mono tracking-widest z-10 flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]
                            ${isStory ? 'absolute top-6 text-xl px-8 py-1' : 'absolute -top-3 text-sm px-5 py-1'}
                        `}>
                            {match.time}
                        </div>

                        <div className="w-full flex items-center justify-between mb-2 mt-2">
                             {/* Home */}
                            <div className="flex items-center gap-3 w-5/12 justify-end">
                                <span className={`${teamNameSize} font-black font-sport uppercase truncate text-right tracking-wide text-white leading-none`}>
                                    {match.homeTeam.name}
                                </span>
                                <div className={`${teamLogoSize} flex-shrink-0 flex items-center justify-center bg-white/5 rounded-full p-1 shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10`}>
                                    {match.homeTeam.logoUrl ? (
                                        <img src={match.homeTeam.logoUrl} className="w-full h-full object-contain" alt={match.homeTeam.name} crossOrigin="anonymous" />
                                    ) : <div className="w-full h-full bg-zinc-700 rounded-full" />}
                                </div>
                            </div>

                             {/* VS */}
                            <div className="w-2/12 flex justify-center">
                                <span className="text-brand-yellow font-sport text-4xl italic font-black opacity-80 drop-shadow-lg">VS</span>
                            </div>

                            {/* Away */}
                            <div className="flex items-center gap-3 w-5/12 justify-start">
                                <div className={`${teamLogoSize} flex-shrink-0 flex items-center justify-center bg-white/5 rounded-full p-1 shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10`}>
                                    {match.awayTeam.logoUrl ? (
                                        <img src={match.awayTeam.logoUrl} className="w-full h-full object-contain" alt={match.awayTeam.name} crossOrigin="anonymous" />
                                    ) : <div className="w-full h-full bg-zinc-700 rounded-full" />}
                                </div>
                                <span className={`${teamNameSize} font-black font-sport uppercase truncate text-left tracking-wide text-white leading-none`}>
                                    {match.awayTeam.name}
                                </span>
                            </div>
                        </div>

                        {/* Odds Bottom */}
                        <div className="w-full flex items-center justify-center gap-12 border-t border-white/5 pt-3 mt-1">
                            <div className="flex flex-col items-center">
                                <span className={`${oddsTextSize} font-black text-brand-yellow font-sport drop-shadow-md leading-none`}>{match.odds.ms1}</span>
                                <span className={`${oddsLabelSize} font-bold text-zinc-500 uppercase tracking-widest`}>MS 1</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className={`${oddsTextSize} font-black text-brand-yellow font-sport drop-shadow-md leading-none`}>{match.odds.msx}</span>
                                <span className={`${oddsLabelSize} font-bold text-zinc-500 uppercase tracking-widest`}>MS X</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className={`${oddsTextSize} font-black text-brand-yellow font-sport drop-shadow-md leading-none`}>{match.odds.ms2}</span>
                                <span className={`${oddsLabelSize} font-bold text-zinc-500 uppercase tracking-widest`}>MS 2</span>
                            </div>
                        </div>
                      </>
                  )}

                </div>
              </div>
            ))}
          </div>

          {/* Footer Section - Fixed Size */}
          <div className={`flex-shrink-0 mt-auto grid grid-cols-3 divide-x divide-zinc-700 border-t border-zinc-700 ${footerPadding}`}>
            {[config.footerText1, config.footerText2, config.footerText3].map((text, idx) => {
               const parts = text.split(text.includes('\n') ? '\n' : ' ');
               const head = parts[0];
               const body = parts.slice(1).join(' ');
               return (
                <div key={idx} className="px-2 text-center">
                  <h3 className={`text-brand-yellow font-black font-sport uppercase leading-none mb-1 ${footerTitleSize}`}>
                    {head}
                  </h3>
                  <p className={`text-white font-bold uppercase tracking-tight leading-tight ${footerTextSize}`}>
                    {body}
                  </p>
                </div>
               );
            })}
          </div>

        </div>
    </div>
  );
};