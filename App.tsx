import React, { useState, useRef } from 'react';
import { MatchInput } from './components/MatchInput';
import { BannerPreview } from './components/BannerPreview';
import { Match, CardConfig } from './types';
import { Download, Settings, Type, RefreshCcw, Smartphone, Square } from 'lucide-react';

declare global {
  interface Window {
    html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
  }
}

const DEFAULT_CONFIG: CardConfig = {
  title: "", 
  subtitle: "",
  date: "22.11.2025", 
  footerText1: "%100 Kombine Bonusu",
  footerText2: "Tek Maçtan Kaybedenlere\n%50'ye Varan İade",
  footerText3: "Erken Sonuçlandırma\n& Bahis Bozdur",
};

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [config, setConfig] = useState<CardConfig>(DEFAULT_CONFIG);
  const [format, setFormat] = useState<'square' | 'story'>('square');
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleAddMatch = (match: Match) => {
    setMatches((prev) => {
        if(prev.length >= 6) {
            alert("Maksimum 6 maç eklenebilir.");
            return prev;
        }
        return [...prev, match];
    });
  };

  const handleRemoveMatch = (id: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== id));
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    
    setIsDownloading(true);
    try {
      // 1. Give React time to render "isExporting" state if used (e.g. hiding buttons)
      await new Promise(resolve => setTimeout(resolve, 50));

      const element = previewRef.current;
      const originalWidth = 1080;
      const originalHeight = format === 'story' ? 1920 : 1080;

      // 2. Clone the element to render it off-screen at full resolution.
      // This bypasses any scale transforms applied to the visible preview on screen.
      const clone = element.cloneNode(true) as HTMLElement;

      // 3. Set styles to ensure the clone is rendered correctly
      clone.style.position = 'fixed';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.zIndex = '-1';
      clone.style.width = `${originalWidth}px`;
      clone.style.height = `${originalHeight}px`;
      clone.style.transform = 'none'; // Ensure no scaling is applied
      clone.style.margin = '0';
      
      // Append to body so html2canvas can see it
      document.body.appendChild(clone);

      // 4. Capture
      const canvas = await window.html2canvas(clone, {
        scale: 1, // Native 1:1 scale of the 1080px element
        useCORS: true, // Allow external images
        allowTaint: true,
        backgroundColor: '#000000', // Ensure dark background
        width: originalWidth,
        height: originalHeight,
        windowWidth: originalWidth,
        windowHeight: originalHeight,
        logging: false,
      });

      // 5. Clean up
      document.body.removeChild(clone);

      // 6. Download
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `betgit-${format}-${Date.now()}.png`;
      link.click();

    } catch (error) {
      console.error("Download failed:", error);
      alert("Görsel oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      {/* Header Nav */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-yellow rounded-lg flex items-center justify-center">
                <Type className="text-black font-bold" size={24}/>
            </div>
            <h1 className="text-xl md:text-2xl font-sport font-bold tracking-wider">BETGIT <span className="text-brand-yellow">YÜKSELMİŞ ORAN OLUŞTURUCU</span></h1>
        </div>
        <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-brand-yellow hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold transition-all transform active:scale-95 disabled:opacity-50 shadow-lg shadow-brand-yellow/20"
        >
           {isDownloading ? <RefreshCcw className="animate-spin" /> : <Download size={20} />}
           {isDownloading ? "Oluşturuluyor..." : "PNG İndir"}
        </button>
      </div>

      <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar: Controls */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* Format Selection */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
                <h2 className="text-lg font-sport text-zinc-400 mb-4 flex items-center gap-2">
                    <Settings size={18} /> Görünüm Formatı
                </h2>
                <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                  <button
                    onClick={() => setFormat('square')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-bold transition-all ${
                      format === 'square' 
                        ? 'bg-zinc-800 text-white shadow-md border border-zinc-700' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Square size={18} /> Gönderi (1:1)
                  </button>
                  <button
                    onClick={() => setFormat('story')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-bold transition-all ${
                      format === 'story' 
                        ? 'bg-zinc-800 text-white shadow-md border border-zinc-700' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Smartphone size={18} /> Hikaye (9:16)
                  </button>
                </div>
            </div>

            {/* Config Panel */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
                <h2 className="text-lg font-sport text-zinc-400 mb-4 flex items-center gap-2">
                    <Type size={18} /> Metin Ayarları
                </h2>
                <div className="space-y-4">
                    {/* Date Input */}
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase">Maç Tarihi</label>
                        <input 
                            type="text" 
                            value={config.date} 
                            onChange={(e) => setConfig({...config, date: e.target.value})}
                            placeholder="ör. 22.11.2025"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 mt-1 focus:border-brand-yellow focus:outline-none text-sm text-white font-sport tracking-wide"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase">Alt Metin 1</label>
                        <input 
                            type="text" 
                            value={config.footerText1} 
                            onChange={(e) => setConfig({...config, footerText1: e.target.value})}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 mt-1 focus:border-brand-yellow focus:outline-none text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase">Alt Metin 2 (Alt satır için \n kullanın)</label>
                         <textarea 
                            value={config.footerText2} 
                            onChange={(e) => setConfig({...config, footerText2: e.target.value})}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 mt-1 focus:border-brand-yellow focus:outline-none h-16 resize-none text-sm"
                        />
                    </div>
                    <div>
                         <label className="text-xs font-bold text-zinc-500 uppercase">Alt Metin 3 (Alt satır için \n kullanın)</label>
                         <textarea 
                            value={config.footerText3} 
                            onChange={(e) => setConfig({...config, footerText3: e.target.value})}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 mt-1 focus:border-brand-yellow focus:outline-none h-16 resize-none text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Match Input */}
            <MatchInput onAddMatch={handleAddMatch} />
            
            <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 text-sm text-zinc-500">
                <p className="mb-2 font-bold text-zinc-400">Talimatlar:</p>
                <ul className="list-disc pl-4 space-y-1">
                    <li>Logo URL'sini manuel yapıştırabilir veya Google'da arayabilirsiniz.</li>
                    <li>Takım ismini yazın ve logoyu ekleyin.</li>
                    <li>Dikey Instagram hikayeleri için 'Hikaye' modunu kullanın.</li>
                    <li>Maksimum 6 maç eklenebilir.</li>
                </ul>
            </div>
        </div>

        {/* Right Area: Preview */}
        <div className="lg:col-span-8 flex justify-center items-start overflow-auto bg-zinc-900/30 p-8 rounded-3xl border border-dashed border-zinc-800 min-h-[800px]">
            {/* 
              Scaling container: 
              We use CSS transform to scale down the massive 1080px preview to fit the screen.
            */}
            <div className={`origin-top transform transition-all duration-300 ${format === 'story' ? 'scale-[0.35] sm:scale-[0.4] lg:scale-[0.45]' : 'scale-[0.4] sm:scale-[0.5] lg:scale-[0.65]'}`}>
                <BannerPreview 
                    matches={matches} 
                    config={config} 
                    previewRef={previewRef} 
                    onRemoveMatch={handleRemoveMatch}
                    isExporting={isDownloading}
                    format={format}
                />
            </div>
        </div>

      </div>
    </div>
  );
};

export default App;