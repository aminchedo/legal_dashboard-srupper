import React from 'react';
import { Brain, Wifi, WifiOff } from 'lucide-react';
import { colors, spacing } from './theme';

interface HeaderProps {
  isConnected: boolean;
}

const Header: React.FC<HeaderProps> = ({ isConnected }) => {
  return (
    <header 
      className="rounded-3xl mb-8"
      style={{
        background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.accent.primary} 50%, ${colors.accent.secondary} 100%)`,
        padding: spacing.xl,
      }}
    >
      <div className="text-center">
        <div 
          className="flex items-center justify-center gap-4 mb-4 flex-wrap"
          style={{ gap: spacing.md }}
        >
          <Brain className="text-blue-300" size={40} />
          <h1 
            className="text-3xl md:text-4xl font-bold text-white"
            style={{ color: colors.text.primary }}
          >
            سیستم اسکریپینگ هوشمند
          </h1>
          <div 
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              isConnected ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
            }`}
            style={{
              padding: `${spacing.sm} ${spacing.md}`,
              background: isConnected 
                ? colors.status.success.bg + '20' 
                : colors.status.error.bg + '20',
              color: isConnected 
                ? colors.status.success.text 
                : colors.status.error.text,
            }}
            role="status"
            aria-label={isConnected ? 'متصل به سرور' : 'قطع اتصال از سرور'}
          >
            {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
            <span>{isConnected ? 'متصل' : 'قطع'}</span>
          </div>
        </div>
        <p 
          className="text-blue-200 text-base md:text-lg"
          style={{ color: colors.text.secondary }}
        >
          پلتفرم پیشرفته جمع‌آوری خودکار اطلاعات حقوقی
        </p>
      </div>
    </header>
  );
};

export default Header;