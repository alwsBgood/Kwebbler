
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 p-3 border-b border-green-500/20">
      <h1 className="text-lg">
        <span className="text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.4)]">document</span>
        <span className="text-slate-400">.</span>
        <span className="text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.4)]">standup</span>
        <span className="text-slate-400">()</span>
      </h1>
    </header>
  );
};

export default Header;
