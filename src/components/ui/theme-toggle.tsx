
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
  className?: string;
}

export const ThemeToggle = ({ 
  variant = 'ghost', 
  size = 'default', 
  showText = true,
  className = ''
}: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`transition-all duration-300 ease-in-out hover:scale-105 ${className}`}
    >
      <div className="relative flex items-center gap-2">
        <div className="relative w-4 h-4">
          <Sun 
            className={`absolute inset-0 h-4 w-4 transition-all duration-500 ease-in-out transform ${
              theme === 'light' 
                ? 'rotate-0 scale-100 opacity-100' 
                : 'rotate-90 scale-0 opacity-0'
            }`}
          />
          <Moon 
            className={`absolute inset-0 h-4 w-4 transition-all duration-500 ease-in-out transform ${
              theme === 'dark' 
                ? 'rotate-0 scale-100 opacity-100' 
                : '-rotate-90 scale-0 opacity-0'
            }`}
          />
        </div>
        {showText && (
          <span className="text-sm font-medium">
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </span>
        )}
      </div>
    </Button>
  );
};
