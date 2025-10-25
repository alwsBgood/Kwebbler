import React from 'react';
import { type Speaker, SpeakerStatus, type MeetingStatus } from '../types';
import { useMeetingStore } from '../store';

interface SpeakerItemProps {
  speaker: Speaker;
}

const SpeakerItem: React.FC<SpeakerItemProps> = ({ speaker }) => {
  const getStatusStyles = () => {
    switch (speaker.status) {
      case SpeakerStatus.Speaking:
        return 'bg-green-500/10 text-green-300 border-l-4 border-green-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]';
      case SpeakerStatus.Next:
        return 'text-yellow-400';
      case SpeakerStatus.Done:
        return 'text-slate-500 line-through';
      case SpeakerStatus.Queued:
      default:
        return 'text-slate-400';
    }
  };

  const getPrefix = () => {
    switch (speaker.status) {
        case SpeakerStatus.Speaking:
            return '>';
        case SpeakerStatus.Next:
            return '»';
        case SpeakerStatus.Done:
            return '✓';
        default:
            return '-';
    }
  }

  return (
    <li className={`flex items-center space-x-4 p-2 rounded transition-all duration-200 ${getStatusStyles()}`}>
        <span className="w-4 text-center">{getPrefix()}</span>
        <span>{speaker.name}</span>
    </li>
  );
};

interface SpeakerListProps {
  speakers: Speaker[];
  status: MeetingStatus;
}

const SpeakerList: React.FC<SpeakerListProps> = ({ speakers, status }) => {
  const { masterEmployeeList, presentParticipantIds } = useMeetingStore();

  const renderStatusMessage = () => {
    switch (status) {
      case 'configuring':
        const presentCount = presentParticipantIds.size;
        const absentCount = masterEmployeeList.length - presentCount;
        return (
          <>
            <div className="text-cyan-400">{'>'} status: configuring...</div>
            <div className="text-slate-400 pl-4">{'>'} present = [{presentCount}]</div>
            <div className="text-slate-400 pl-4">{'>'} absent = [{absentCount}]</div>
            <div className="text-yellow-400">{'>'} waiting for meeting.start()</div>
          </>
        );
      case 'waiting':
        return <div className="text-yellow-400 animate-pulse">{'>'} Waiting for Lead to start meeting...</div>;
      case 'done':
        return <div className="text-green-400">{'>'} meeting.done() ✅</div>;
      case 'in_progress':
        if (speakers.length > 0) return <div className="text-green-400">{'>'} ready</div>;
        return null; // Should not happen
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {status === 'in_progress' ? (
        <>
          <div className="text-green-400">{'>'} init.queue()</div>
          <ul className="pl-4 border-l border-slate-700/50">
            {speakers.map((speaker) => (
              <SpeakerItem key={speaker.id} speaker={speaker} />
            ))}
          </ul>
        </>
      ) : null}
      <div className="mt-4">{renderStatusMessage()}</div>
    </div>
  );
};

export default SpeakerList;