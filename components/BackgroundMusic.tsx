
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Disc, Loader2, Music, Volume1 } from 'lucide-react';

const BackgroundMusic: React.FC = () => {
  /**
   * =========================================================================
   * HƯỚNG DẪN CHÈN NHẠC CỦA BẠN:
   * 1. Thay thế đường link bên dưới bằng đường dẫn tới file .mp3 của bạn.
   * 2. Nếu file nhạc ở trong thư mục dự án, hãy để nó vào thư mục 'public' 
   *    và thay đổi đường dẫn thành "/ten-file-cua-ban.mp3"
   * =========================================================================
   */
  const SOUND_URL = "music/tet-music.mp3"; 

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cập nhật âm lượng trực tiếp vào thẻ audio qua JS
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    if (audio.paused) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.warn("Trình duyệt chặn tự động phát:", err);
          alert("Chào Xuân Bính Ngọ! Vui lòng nhấn vào đĩa nhạc để bắt đầu phát nhạc Tết.");
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[100] flex flex-col items-center gap-2 group">
      {/* THẺ AUDIO HTML5 - Đơn giản và ổn định nhất */}
      <audio 
        ref={audioRef}
        src={SOUND_URL}
        loop
        preload="auto"
        onCanPlayThrough={() => setIsLoaded(true)}
        className="hidden"
      />

      {/* Hiển thị trạng thái nhạc đang chạy */}
      <div className={`transition-all duration-500 ${isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
        <div className="bg-red-600 text-yellow-300 text-[10px] font-black px-3 py-1 rounded-full shadow-lg border border-yellow-400/30 uppercase tracking-widest animate-pulse">
          Tết 2026 Radio
        </div>
      </div>

      <div className="relative flex items-center">
        {/* Thanh điều khiển âm lượng bằng JS */}
        <div className="absolute right-full mr-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center bg-red-950/90 backdrop-blur-md p-3 rounded-2xl border border-yellow-500/20 shadow-2xl gap-3">
          <button 
            onClick={() => setVolume(v => v === 0 ? 0.5 : 0)} 
            className="text-yellow-500 hover:scale-110 transition-transform"
          >
            {volume === 0 ? <VolumeX size={18} /> : volume < 0.5 ? <Volume1 size={18} /> : <Volume2 size={18} />}
          </button>
          <input 
            type="range" 
            min="0" max="1" step="0.01" 
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 h-1.5 accent-yellow-400 cursor-pointer bg-red-900/50 rounded-full appearance-none outline-none"
          />
        </div>

        {/* Nút đĩa nhạc quay - Giao diện HTML/CSS thuần */}
        <button
          onClick={togglePlay}
          disabled={!isLoaded}
          className={`relative p-0 rounded-full transition-all duration-700 shadow-2xl overflow-hidden border-4 ${
            isPlaying 
            ? 'border-yellow-400 scale-110 shadow-yellow-500/40' 
            : 'border-red-900/50 grayscale opacity-80 hover:opacity-100 hover:grayscale-0'
          } ${!isLoaded ? 'cursor-wait' : 'cursor-pointer hover:shadow-yellow-500/20'}`}
          style={{ width: '64px', height: '64px' }}
        >
          {/* Đĩa than xoay dùng CSS Animation */}
          <div className={`absolute inset-0 bg-black flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
             <div className="w-full h-full bg-[radial-gradient(circle,_#333_0%,_#000_100%)] flex items-center justify-center relative">
                <div className="absolute inset-1 rounded-full border border-white/5" />
                <div className="absolute inset-3 rounded-full border border-white/5" />
                <div className="absolute inset-5 rounded-full border border-white/5" />
                
                <div className="w-8 h-8 bg-red-700 rounded-full border-2 border-yellow-500 flex items-center justify-center relative z-10 shadow-inner">
                    {!isLoaded ? (
                      <Loader2 size={18} className="text-yellow-400 animate-spin" />
                    ) : (
                      <Disc size={20} className={`text-yellow-400 ${isPlaying ? 'animate-pulse' : ''}`} />
                    )}
                    <div className="absolute w-1.5 h-1.5 bg-black rounded-full" />
                </div>
             </div>
          </div>

          {/* Biểu tượng Music khi Hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
            {isPlaying ? <VolumeX className="text-white" size={24} /> : <Music className="text-yellow-400" size={24} />}
          </div>
        </button>
      </div>

      {/* Hiệu ứng cột sóng âm thanh */}
      <div className="flex gap-1 h-4 items-end px-2 py-0.5 bg-red-950/30 rounded-full border border-white/5">
        {[1, 2, 3, 4, 5].map(i => (
          <div 
            key={i} 
            className={`w-1 rounded-full bg-yellow-400/80 transition-all duration-300 ${isPlaying ? 'animate-bar-jump' : 'h-1 opacity-20'}`}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <style>{`
        @keyframes bar-jump {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
        .animate-bar-jump { 
          animation: bar-jump 0.6s ease-in-out infinite; 
          transform-origin: bottom; 
        }
        .animate-spin-slow { 
          animation: spin 6s linear infinite; 
        }
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: #facc15;
          cursor: pointer;
          border: 2px solid #450a0a;
        }
      `}</style>
    </div>
  );
};

export default BackgroundMusic;
