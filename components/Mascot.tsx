
import React from 'react';

interface MascotProps {
  status: 'idle' | 'listening' | 'speaking' | 'happy';
  size?: 'sm' | 'md' | 'lg';
}

const Mascot: React.FC<MascotProps> = ({ status, size = 'md' }) => {
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  };

  const getAnimation = () => {
    switch (status) {
      case 'listening': return 'animate-pulse';
      case 'speaking': return 'animate-bounce';
      case 'happy': return 'animate-bounce';
      default: return 'hover:animate-wiggle';
    }
  };

  return (
    <div className={`${sizes[size]} relative flex items-center justify-center`}>
      <div className={`text-6xl ${getAnimation()} transition-all duration-300`}>
        🦇
      </div>
      {status === 'listening' && (
        <div className="absolute inset-0 border-4 border-indigo-400 rounded-full animate-ping opacity-25"></div>
      )}
      {status === 'happy' && (
        <div className="absolute -top-4 -right-4 text-2xl animate-bounce">✨</div>
      )}
    </div>
  );
};

export default Mascot;
