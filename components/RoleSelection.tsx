import React from 'react';
import { useMeetingStore } from '../store';
import { Role } from '../types';

const RoleSelection: React.FC = () => {
  const { setRole } = useMeetingStore();

  const selectRole = (role: Role) => {
    setRole(role);
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-slate-900">
      <div className="text-center p-8 bg-black/50 border border-green-500/20 rounded-lg shadow-lg">
        <h1 className="text-2xl text-green-400 mb-2">{'>'} select_role:</h1>
        <p className="text-slate-400 mb-6">// How are you joining today?</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => selectRole(Role.Lead)}
            className="px-6 py-2 bg-green-500/20 border border-green-500/50 text-green-300 rounded hover:bg-green-500/30 hover:shadow-lg hover:shadow-green-500/10 transition-all"
          >
            Lead
          </button>
          <button
            onClick={() => selectRole(Role.Participant)}
            className="px-6 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 rounded hover:bg-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all"
          >
            Participant
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;