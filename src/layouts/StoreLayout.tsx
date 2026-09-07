import React from 'react';
import { Navbar } from '../components/common/Navbar';

interface StoreLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const StoreLayout: React.FC<StoreLayoutProps> = ({
  children,
  currentPath,
  onNavigate,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar currentPath={currentPath} onNavigate={onNavigate} />
      <main className="flex-1">{children}</main>
    </div>
  );
};
