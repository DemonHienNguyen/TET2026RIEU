
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Lấy API_KEY từ biến môi trường của hệ thống hoặc Vercel
  // Ưu tiên API_KEY (đặt trên Vercel) hoặc VITE_API_KEY (đặt local)
  const apiKey = env.API_KEY || env.VITE_API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Thay thế process.env.API_KEY trong code client bằng giá trị thật tại thời điểm build
      'process.env.API_KEY': JSON.stringify(apiKey)
    },
    server: {
      port: 3000
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      commonjsOptions: {
        transformMixedEsModules: true,
      }
    }
  };
});
