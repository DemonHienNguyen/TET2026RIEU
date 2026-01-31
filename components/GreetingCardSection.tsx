
import React, { useState, useEffect } from 'react';
import { ImageIcon, Download, Loader2, Wand2, Key, AlertCircle, ExternalLink } from 'lucide-react';
import { generateTetGreetingCard } from '../services/geminiService';

const GreetingCardSection: React.FC = () => {
  const [desc, setDesc] = useState('Gia đình sum vầy bên nồi bánh chưng rực rỡ sắc xuân');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(true);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = await generateTetGreetingCard(desc);
      if (url) {
        setImageUrl(url);
      } else {
        setError("AI không tạo được ảnh. Hãy thử mô tả khác chi tiết hơn.");
      }
    } catch (err: any) {
      if (err.message === "KEY_NOT_FOUND") {
        setHasKey(false);
        setError("Vui lòng xác nhận API Key để sử dụng tính năng tạo ảnh cao cấp.");
      } else {
        setError("Lỗi: " + (err.message || "Không thể kết nối với máy chủ AI. Hãy thử lại sau."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn px-4">
      <div className="text-center">
        <h2 className="text-4xl lg:text-5xl font-cursive text-yellow-400 mb-3 drop-shadow-md">Sáng Tạo Thiệp Tết AI</h2>
        <p className="text-red-100 opacity-80 italic">Model Gemini 3 Pro - Kiến tạo nghệ thuật Xuân đỉnh cao</p>
      </div>

      {!hasKey && (
        <div className="bg-yellow-500/10 border-2 border-yellow-500/30 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 animate-pulse">
          <div className="bg-yellow-500 p-4 rounded-full text-red-950">
            <Key size={32} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-yellow-400 font-bold text-lg mb-1">Yêu cầu xác nhận quyền truy cập</h3>
            <p className="text-red-100 text-sm mb-3">Tính năng tạo ảnh 1K yêu cầu bạn xác nhận API Key từ dự án có bật thanh toán (Billing).</p>
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-yellow-500 text-xs underline flex items-center gap-1 justify-center md:justify-start">
              Tìm hiểu về thanh toán API <ExternalLink size={10} />
            </a>
          </div>
          <button 
            onClick={handleSelectKey}
            className="bg-yellow-500 text-red-950 px-8 py-3 rounded-full font-black hover:bg-yellow-400 transition-all shadow-xl"
          >
            CHỌN API KEY
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-2xl flex items-center gap-3 text-red-100">
          <AlertCircle size={20} className="shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="bg-red-950/40 p-8 rounded-[2.5rem] border border-yellow-600/20 space-y-8 flex flex-col">
          <div className="flex-1 space-y-4">
            <label className="block text-sm font-black text-yellow-500 uppercase tracking-widest">Ý tưởng thiệp của bạn</label>
            <textarea 
              rows={5}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="VD: Một chú ngựa vàng dũng mãnh giữa vườn hoa mai rực rỡ dưới nắng xuân..."
              className="w-full bg-red-900/30 border border-yellow-600/20 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none resize-none leading-relaxed"
            />
            <div className="flex gap-2 flex-wrap">
              {['Tranh sơn mài', 'Phong cách 3D', 'Màu nước', 'Cổ điển'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => setDesc(prev => prev + `, phong cách ${tag}`)}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-[10px] text-red-200 border border-white/10 transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-b from-pink-500 to-pink-700 hover:from-pink-400 hover:to-pink-600 disabled:opacity-50 py-5 rounded-2xl font-black text-xl transition-all flex justify-center items-center gap-3 shadow-[0_10px_30px_rgba(219,39,119,0.3)] group"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 className="group-hover:rotate-12 transition-transform" />}
            {loading ? "ĐANG VẼ NGHỆ THUẬT..." : "TẠO THIỆP XUÂN 1K"}
          </button>
        </div>

        <div className="bg-red-950/60 rounded-[2.5rem] border-2 border-dashed border-yellow-600/20 aspect-square flex items-center justify-center relative group overflow-hidden shadow-inner">
          {imageUrl ? (
            <>
              <img src={imageUrl} alt="AI Art" className="w-full h-full object-cover animate-fadeIn" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 backdrop-blur-sm">
                <a 
                  href={imageUrl} 
                  download="tet-2026-card.png"
                  className="bg-white text-red-900 p-5 rounded-full hover:bg-yellow-400 transition-all hover:scale-110 shadow-2xl"
                  title="Tải ảnh về máy"
                >
                  <Download size={32} />
                </a>
              </div>
            </>
          ) : (
            <div className="text-center p-10">
              <div className="relative mb-6">
                <ImageIcon size={80} className="mx-auto text-red-900/40" />
                {loading && (
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                   </div>
                )}
              </div>
              <p className="text-red-300/50 font-bold uppercase tracking-widest text-xs">Kiệt tác nghệ thuật sẽ xuất hiện ở đây</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-500/5 p-6 rounded-3xl border border-yellow-500/10 text-center">
        <p className="text-xs text-yellow-200/60 italic leading-relaxed">
          Mẹo: "Thiệp AI" sử dụng model Gemini 3 Pro Image có khả năng hiểu tiếng Việt rất tốt. <br/>
          Bạn có thể mô tả chi tiết các yếu tố như: ánh sáng, góc chụp, cảm xúc nhân vật để có kết quả ưng ý nhất.
        </p>
      </div>
    </div>
  );
};

export default GreetingCardSection;
