import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-800 leading-tight">Gemini Spark</h1>
          <p className="text-xs text-slate-500 font-medium">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>
      <div className="hidden md:block">
        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full border border-slate-200 font-medium">
          Simple. Fast. Multimodal.
        </span>
      </div>
    </header>
  );
};

export default Header;