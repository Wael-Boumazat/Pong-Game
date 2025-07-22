import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:3400,
    proxy:{
      '/login':{
        target:'http://localhost:3500',
        changeOrigin:true,
        secure:false,
        rewrite:(path)=>{
          console.log(path)
        return path.replace(/^\/login/,'')
        }
      },
      '/auth':{
        target:'http://localhost:2000',
        changeOrigin:true,
        secure:false,
        rewrite:(path)=>{
          console.log(path)
         return path.replace(/^\/auth/,'')
        }
      },
      '/file':{
        target:'http://localhost:3700',
        changeOrigin:true,
        secure:false,
        rewrite:(path)=>{
          console.log(path)
         return path.replace(/^\/file/,'')
        }
      },
      '/logs':{
      target:'http://localhost:4000',
      changeOrigin:true,
      secure:false,
      rewrite:(path)=>{
        console.log("loginpath"+path)
        return path.replace(/^\/logs/,'')
      }
    },
    '/mkfr':{
      target:"http://localhost:4100",
      changeOrigin:true,
      secure:false,
      rewrite:(path)=>{
        console.log(path)
        return path.replace(/^\/mkfr/,'')
      }
    },
    '/notif':{
      target:"http://localhost:8000",
      changeOrigin:true,
      secure:false,
      rewrite:(path)=>{
        console.log(path)
        return path.replace(/^\/notif/,"")
      }
    },
    '/mail':{
      target:"http://localhost:456",
      changeOrigin:true,
      secure:false,
      rewrite:(path)=>{
        console.log(path)
        return path.replace(/^\/mail/,"")
      }
    }
    }
  }
})
