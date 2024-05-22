import React, { PropsWithChildren } from 'react';
import { cn } from '../utils/lib';
interface ToolbarButtonProps extends PropsWithChildren {
  active?: boolean;
  onClick: () => void;
  className?: string;
}
const ToolbarButton: React.FC<ToolbarButtonProps> = ({ active, onClick, className, children }) => {
  return (
    <button
      className={cn(
        'relative bg-transparent text-gray-300 hover:bg-gray-700 p-2 rounded-lg',
        {
          'bg-blue-400 text-gray-700 hover:bg-blue-500': active,
        },
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ToolbarButton;
