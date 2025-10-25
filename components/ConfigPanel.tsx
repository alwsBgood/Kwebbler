import React, { useState } from 'react';
import { useMeetingStore } from '../store';

const ConfigPanel: React.FC = () => {
    const { 
        masterEmployeeList, 
        presentParticipantIds,
        toggleParticipantPresence,
        addEmployee,
        startMeeting,
        status,
    } = useMeetingStore();
    const [newEmployeeName, setNewEmployeeName] = useState('');

    const handleAddEmployee = (e: React.FormEvent) => {
        e.preventDefault();
        addEmployee(newEmployeeName);
        setNewEmployeeName('');
    }

  return (
    <div className="p-4 text-slate-400 h-full flex flex-col">
        <h2 className="text-lg text-yellow-400 mb-2">// config</h2>
        
        {status === 'configuring' ? (
            <>
                <div className="flex-grow overflow-y-auto">
                    <p className="text-sm mb-4">// Select present team members</p>
                    <div className="space-y-2 mb-4">
                        {masterEmployeeList.map(emp => (
                            <label key={emp.id} className="flex items-center space-x-3 cursor-pointer hover:bg-slate-700/50 p-1 rounded">
                                <input 
                                    type="checkbox"
                                    checked={presentParticipantIds.has(emp.id)}
                                    onChange={() => toggleParticipantPresence(emp.id)}
                                    className="form-checkbox h-4 w-4 bg-slate-800 border-slate-600 text-green-500 focus:ring-green-500/50"
                                />
                                <span className={presentParticipantIds.has(emp.id) ? 'text-slate-200' : 'text-slate-500'}>
                                    {emp.name}
                                </span>
                            </label>
                        ))}
                    </div>

                    <form onSubmit={handleAddEmployee} className="flex space-x-2 mt-4">
                        <input 
                            type="text"
                            value={newEmployeeName}
                            onChange={(e) => setNewEmployeeName(e.target.value)}
                            placeholder="new.member"
                            className="flex-grow bg-slate-900/80 border border-slate-700 rounded px-2 py-1 text-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        />
                        <button type="submit" className="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-300 rounded hover:bg-green-500/30 text-sm">
                            Add
                        </button>
                    </form>
                </div>

                <div className="mt-4 flex-shrink-0">
                    <button 
                        onClick={startMeeting}
                        className="w-full py-2 bg-green-600 text-slate-900 font-bold rounded hover:bg-green-500 transition-all shadow-lg shadow-green-500/10"
                    >
                        meeting.start()
                    </button>
                </div>
            </>
        ) : (
            <div className="flex-grow flex items-center justify-center">
                 <p className="text-slate-500">// Meeting in progress...</p>
            </div>
        )}
    </div>
  );
};

export default ConfigPanel;
