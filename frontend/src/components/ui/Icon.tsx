import React from 'react';
import { Icons, type IconName } from '../../utils/iconRegistry';
import { LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  name: IconName;
  fallback?: React.ReactNode;
}

const Icon: React.FC<IconProps> = ({ name, fallback = null, ...props }) => {
  const IconComponent = Icons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in registry`);
    return fallback ? <>{fallback}</> : <div className="w-4 h-4 bg-gray-300 rounded" />;
  }
  
  return <IconComponent {...props} />;
};

export default Icon;