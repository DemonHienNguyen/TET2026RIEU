
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Disc, Loader2, Volume1 } from 'lucide-react';

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [showVolume, setShowVolume] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // =========================================================================
  // HƯỚNG DẪN THAY NHẠC: 
  // Dán link nhạc MP3 trực tiếp của bạn vào giữa hai dấu ngoặc kép dưới đây.
  // Ví dụ: const SOUND_URL = "https://example.com/nhac-tet.mp3";
  // =========================================================================
  const SOUND_URL = "https://pixabay.com/music/tetin2026-mp3cutnet-477023/"; // Thay đổi link nhạc tại đây

  useEffect(() => {
    // Khởi tạo đối tượng audio
    const audio = new Audio();
    audio.src = SOUND_URL;
    audio.loop = true;
    audio.volume = volume;
    audio.preload = "auto";
    
    const handleCanPlay = () => setIsLoaded(true);
    audio.addEventListener('canplaythrough', handleCanPlay);
    
    audioRef.current = audio;

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.pause();
      audio.src = ""; // Giải phóng tài nguyên
    };
  }, [SOUND_URL]);

  // Cập nhật âm lượng khi state volume thay đổi
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current || !isLoaded) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.warn("Autoplay blocked. User interaction required.");
          // Thông báo cho người dùng nếu cần thiết
        });
    }
  };

  return (
    <div 
      className="fixed bottom-24 right-6 z-[100] flex flex-col items-center gap-3"
      onMouseEnter={() => setShowVolume(true)}
      onMouseLeave={() => setShowVolume(false)}
    >
      {/* Thanh điều chỉnh âm lượng - Tăng tính tương tác */}
      <div className={`transition-all duration-300 flex flex-col items-center bg-red-950/80 backdrop-blur-md p-2 rounded-full border border-yellow-500/20 shadow-xl ${showVolume ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume} 
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="h-24 w-1 accent-yellow-400 cursor-pointer appearance-none bg-red-900/50 rounded-full vertical-slider"
          style={{ writingMode: 'bt-lr', appearance: 'slider-vertical' } as any}
        />
        <div className="mt-2">
          {volume === 0 ? (
            <VolumeX size={14} className="text-red-400" />
          ) : volume < 0.5 ? (
            <Volume1 size={14} className="text-yellow-400" />
          ) : (
            <Volume2 size={14} className="text-yellow-400" />
          )}
        </div>
      </div>

      {/* Cụm nút đĩa nhạc */}
      <div className="flex flex-col items-center gap-2">
        <div className={`transition-all duration-500 transform ${isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <span className="bg-red-600 text-yellow-300 text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg border border-yellow-400/30 uppercase tracking-tighter animate-pulse">
            Music Active
          </span>
        </div>

        <button
          onClick={togglePlay}
          disabled={!isLoaded}
          className={`group relative p-0 rounded-full transition-all duration-500 shadow-2xl overflow-hidden border-2 ${
            isPlaying 
            ? 'border-yellow-400 scale-110 shadow-yellow-500/40' 
            : 'border-white/10 grayscale opacity-60 hover:opacity-100 hover:grayscale-0'
          } ${!isLoaded ? 'cursor-wait' : 'cursor-pointer'}`}
          style={{ width: '64px', height: '64px' }}
          aria-label={isPlaying ? "Pause Music" : "Play Music"}
        >
          {/* Đĩa nhạc xoay */}
          <div className={`absolute inset-0 bg-[#111] flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
            <div className="w-full h-full bg-[radial-gradient(circle,_#222_0%,_#000_100%)] flex items-center justify-center">
              <div className="w-10 h-10 bg-red-700 rounded-full border border-yellow-500/50 flex items-center justify-center relative shadow-inner">
                  {!isLoaded ? (
                    <Loader2 size={20} className="text-yellow-400 animate-spin" />
                  ) : (
                    <Disc size={24} className={`text-yellow-400 ${isPlaying ? 'animate-pulse' : ''}`} />
                  )}
                  <div className="absolute w-1.5 h-1.5 bg-black rounded-full shadow-inner" />
              </div>
            </div>
            {/* Các rãnh đĩa (Grooves) */}
            <div className="absolute inset-2 rounded-full border border-white/5" />
            <div className="absolute inset-4 rounded-full border border-white/10" />
            <div className="absolute inset-6 rounded-full border border-white/5" />
          </div>

          {/* Icon Overlay khi hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            {isPlaying ? <VolumeX className="text-white" size={24} /> : <Volume2 className="text-white" size={24} />}
          </div>
        </button>

        {/* Cột sóng âm thanh mini */}
        <div className="flex gap-1 h-4 items-end px-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div 
              key={i} 
              className={`w-1 rounded-full bg-yellow-400/80 transition-all ${
                isPlaying ? 'animate-music-bar-dynamic' : 'h-1 opacity-20'
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes music-bar-dynamic {
          0%, 100% { height: 4px; opacity: 0.5; }
          50% { height: 16px; opacity: 1; }
        }
        .animate-music-bar-dynamic { 
          animation: music-bar-dynamic 0.5s ease-in-out infinite; 
          transform-origin: bottom;
        }
        .animate-spin-slow { 
          animation: spin 5s linear infinite; 
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        /* Custom styles cho thanh trượt dọc */
        input[type=range].vertical-slider {
          writing-mode: bt-lr; 
          -webkit-appearance: slider-vertical; 
          width: 8px;
          height: 80px;
          padding: 0 5px;
        }
        input[type=range].vertical-slider::-webkit-slider-runnable-track {
          background: rgba(127, 29, 29, 0.5);
          border-radius: 10px;
        }
        input[type=range].vertical-slider::-webkit-slider-thumb {
          background: #facc15;
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default BackgroundMusic;
