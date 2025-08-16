'use client';

import { Brain, Sparkles, Zap, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

export const LoadingScreen = ({ message = 'Загрузка...', className = '' }: LoadingScreenProps) => {
  const [currentIcon, setCurrentIcon] = useState(0);
  const [dots, setDots] = useState('');
  const [particles, setParticles] = useState<
    Array<{
      left: number;
      top: number;
      delay: number;
      duration: number;
    }>
  >([]);

  const icons = [Brain, Sparkles, Zap, BookOpen];
  const IconComponent = icons[currentIcon];

  useEffect(() => {
    // Инициализируем частицы после монтирования компонента
    const newParticles = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    }));
    setParticles(newParticles);

    const iconInterval = setInterval(() => {
      setCurrentIcon(prev => (prev + 1) % icons.length);
    }, 800);

    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) {
          return '';
        }
        return prev + '.';
      });
    }, 500);

    return () => {
      clearInterval(iconInterval);
      clearInterval(dotsInterval);
    };
  }, [icons.length]);

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center z-50 ${className}`}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-200 dark:bg-blue-800 rounded-full animate-pulse"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <div className="relative text-center">
        {/* Logo and spinning icon */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            {/* Background glow */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl pulse-glow"
              style={{ transform: 'scale(1.5)' }}
            />

            {/* Main logo container */}
            <div className="relative w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl float">
              <Image src="/dark-logo.svg" alt="Zein" width={80} height={80} />
            </div>

            {/* Rotating icon */}
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg animate-spin">
              <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Brand name */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Zein
          </span>
        </h1>

        {/* Loading message */}
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {message}
          <span className="inline-block w-8 text-left">{dots}</span>
        </p>

        {/* Progress bar */}
        <div className="w-64 mx-auto">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full loading-bar"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          Подготавливаем для вас платформу...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
