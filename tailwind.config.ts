import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Be Vietnam Pro', 'sans-serif'] },
      colors: {
        brand:  { DEFAULT:'#6C63FF', dark:'#5A52E0', light:'#8B85FF' },
        second: '#FF6B9D',
        accent: '#FFB347',
        ok:     '#4ECDC4',
        danger: '#FF5757',
        bg: { base:'#0A0714', dark:'#0E0B1A', card:'#1A1530', card2:'#221C3A', card3:'#2A2445' },
        bdr:  { DEFAULT:'#2D2550', light:'#3D3468' },
        tx:   { base:'#FFFFFF', sec:'#C4BBEE', muted:'#9B93C9', dim:'#6B5F9E' },
      },
      keyframes: {
        float:   { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-10px)' } },
        fadeUp:  { from:{ opacity:'0',transform:'translateY(16px)' }, to:{ opacity:'1',transform:'translateY(0)' } },
        bounce3: { '0%,80%,100%':{ transform:'translateY(0)' }, '40%':{ transform:'translateY(-8px)' } },
      },
      animation: {
        float:   'float 3s ease-in-out infinite',
        fadeUp:  'fadeUp 0.4s ease both',
        bounce3: 'bounce3 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
