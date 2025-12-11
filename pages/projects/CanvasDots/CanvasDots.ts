import dynamic from 'next/dynamic';

const CanvasDots = dynamic(() => import('./CanvasDots.tsx'), { ssr: false })
export { CanvasDots };