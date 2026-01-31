
// Sử dụng một AudioContext duy nhất cho toàn bộ ứng dụng để tối ưu hiệu suất
let sharedAudioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!sharedAudioContext) {
    sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Trình duyệt thường treo AudioContext cho đến khi có tương tác người dùng
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume();
  }
  return sharedAudioContext;
};

export const playSound = (type: 'click' | 'hit' | 'miss' | 'victory' | 'rustle' | 'gunshot') => {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Helper function để tạo gain node
  const createGain = (val: number, duration: number) => {
    const g = ctx.createGain();
    g.gain.setValueAtTime(val, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + duration);
    g.connect(ctx.destination);
    return g;
  };

  switch (type) {
    case 'gunshot': {
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, now);
      filter.frequency.exponentialRampToValueAtTime(10, now + 0.1);
      
      const g = createGain(0.2, 0.1);
      noise.connect(filter);
      filter.connect(g);
      noise.start(now);
      break;
    }
    case 'click': {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      osc.connect(createGain(0.1, 0.1));
      osc.start(now);
      osc.stop(now + 0.1);
      break;
    }
    case 'hit': {
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.connect(createGain(0.1, 0.05));
      osc.start(now);
      osc.stop(now + 0.05);
      break;
    }
    case 'miss': {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, now);
      osc.connect(createGain(0.1, 0.2));
      osc.start(now);
      osc.stop(now + 0.2);
      break;
    }
    case 'rustle': {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.connect(createGain(0.05, 0.3));
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    }
    case 'victory': {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const time = now + i * 0.1;
        osc.frequency.setValueAtTime(freq, time);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.1, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.4);
      });
      break;
    }
  }
};
