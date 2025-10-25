import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800/50 p-3 border-t border-green-500/20">
      <div className="flex items-center space-x-2">
        <span className="text-green-400">$</span>
        <span className="text-slate-200 flex-grow">
          press <span className="text-green-400">[Enter]</span> to advance
        </span>
        <div className="w-2 h-4 bg-green-400 animate-blink drop-shadow-[0_0_5px_rgba(52,211,153,0.7)]"></div>
      </div>
    </footer>
  );
};

export default Footer;
