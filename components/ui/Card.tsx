
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={`bg-surface rounded-xl shadow-sm border border-slate-200 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className, ...props }) => {
    return <div className={`p-6 border-b border-slate-200 ${className}`} {...props}>{children}</div>
}

export const CardContent: React.FC<CardProps> = ({ children, className, ...props }) => {
    return <div className={`p-6 ${className}`} {...props}>{children}</div>
}

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className, ...props }) => {
    return <h3 className={`text-lg font-bold text-primary ${className}`} {...props}>{children}</h3>
}

export default Card;
