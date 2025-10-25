import React, { useEffect } from 'react';
import Header from './components/Header';
import SpeakerList from './components/SpeakerList';
import Footer from './components/Footer';
import RoleSelection from './components/RoleSelection';
import ConfigPanel from './components/ConfigPanel';
import { useMeetingStore } from './store';
import { Role } from './types';

const App: React.FC = () => {
  const { role, status, speakers, nextSpeaker, initializeSync } = useMeetingStore();

  useEffect(() => {
    const meetingId = window.location.pathname.replace('/', '') || 'default-meeting';
    initializeSync(meetingId);
  }, [initializeSync]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && (status === 'in_progress' || status === 'done')) {
        nextSpeaker();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextSpeaker, status]);

  return (
    <div className="h-full w-full bg-slate-900 text-slate-300 font-mono flex flex-col selection:bg-green-500/20">
      {!role ? (
        <RoleSelection />
      ) : (
        <div className="w-full h-full flex flex-col bg-black/50 rounded-lg shadow-2xl shadow-green-500/10 border border-green-500/20 overflow-hidden">
          <Header />
          <div className="flex-grow flex overflow-hidden">
            <main className="flex-grow p-4 overflow-y-auto w-2/3">
              <SpeakerList speakers={speakers} status={status} />
            </main>
            {role === Role.Lead && (
              <aside className="w-1/3 border-l border-green-500/20 bg-slate-800/20 overflow-y-auto">
                <ConfigPanel />
              </aside>
            )}
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default App;
