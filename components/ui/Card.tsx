import React, { ReactNode } from 'react';

// Fix: Extend CardProps with React.HTMLAttributes to allow passing standard HTML attributes like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...rest }) => {
  return (
    <div
      className={`bg-slate-800/50 rounded-xl shadow-lg backdrop-blur-sm p-4 sm:p-6 border border-slate-700 ${className}`}
      // Fix: Spread the rest of the props onto the div element to pass down attributes like onClick.
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
