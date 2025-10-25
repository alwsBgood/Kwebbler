import { create } from 'zustand';
import { database } from './firebase-config';
// FIX: Removed v9 modular imports for Firebase v8 compatibility.
import { type Speaker, SpeakerStatus, Role, type MeetingStatus, type Employee } from './types';

// Utility function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// This interface defines the shape of the data we store in Firebase for each meeting
interface FirebaseMeetingState {
  status: MeetingStatus;
  masterEmployeeList: Employee[];
  presentParticipantIds: string[]; // Store as array for Firebase compatibility
  queue: Employee[];
}

interface MeetingState {
  role: Role | null;
  meetingId: string | null;
  // FIX: Updated listener to support Firebase v8's `off()` method for unsubscribing.
  firebaseListener: { ref: any, listener: any } | null;
  // State synced from Firebase
  status: MeetingStatus;
  masterEmployeeList: Employee[];
  presentParticipantIds: Set<string>;
  queue: Employee[];
  // Locally derived state
  speakers: Speaker[];

  // Actions
  initializeSync: (meetingId: string) => void;
  setRole: (role: Role) => void;
  addEmployee: (name: string) => void;
  toggleParticipantPresence: (employeeId: string) => void;
  startMeeting: () => void;
  nextSpeaker: () => void;
  cleanupSync: () => void;
}

const updateSpeakers = (queue: Employee[], presentParticipants: Employee[]): Speaker[] => {
    const doneSpeakers = presentParticipants.filter(p => !queue.some(q => q.id === p.id));
    
    const speakerList: Speaker[] = [];
    doneSpeakers.forEach(p => speakerList.push({ ...p, status: SpeakerStatus.Done }));

    if(queue.length > 0) speakerList.push({ ...queue[0], status: SpeakerStatus.Speaking });
    if(queue.length > 1) speakerList.push({ ...queue[1], status: SpeakerStatus.Next });
    if(queue.length > 2) queue.slice(2).forEach(p => speakerList.push({ ...p, status: SpeakerStatus.Queued }));
    
    return speakerList.sort((a, b) => {
        const order = { [SpeakerStatus.Speaking]: 0, [SpeakerStatus.Next]: 1, [SpeakerStatus.Queued]: 2, [SpeakerStatus.Done]: 3 };
        return order[a.status] - order[b.status];
    });
}

// FIX: Renamed the `set` parameter from Zustand's `create` function to `setState` to avoid name collision with the `set` function from firebase/database.
export const useMeetingStore = create<MeetingState>((setState, get) => ({
  role: null,
  meetingId: null,
  firebaseListener: null,
  
  // Default initial state
  status: 'waiting',
  masterEmployeeList: [],
  presentParticipantIds: new Set(),
  queue: [],
  speakers: [],

  initializeSync: (meetingId: string) => {
    get().cleanupSync(); // Clean up any existing listener before starting a new one

    setState({ meetingId });
    // FIX: Use Firebase v8 `ref()` method.
    const meetingRef = database.ref(`meetings/${meetingId}`);

    // FIX: Use Firebase v8 `on()` method for listening to changes.
    const listener = (snapshot: any) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as FirebaseMeetingState;
        const presentIds = new Set(data.presentParticipantIds || []);
        const presentParticipants = (data.masterEmployeeList || []).filter(e => presentIds.has(e.id));

        setState({
          status: data.status,
          masterEmployeeList: data.masterEmployeeList || [],
          presentParticipantIds: presentIds,
          queue: data.queue || [],
          speakers: updateSpeakers(data.queue || [], presentParticipants)
        });
      } else {
         // If no data exists in Firebase for this meeting, set a default structure
         const initialState: FirebaseMeetingState = {
            status: 'waiting',
            masterEmployeeList: [
              { id: '1', name: 'dev.alice', active: true },
              { id: '2', name: 'user.bob', active: true },
              { id: '3', name: 'ops.charlie', active: true },
            ],
            presentParticipantIds: [],
            queue: [],
         };
         // FIX: Use Firebase v8 `set()` method.
         meetingRef.set(initialState);
      }
    };
    meetingRef.on('value', listener);

    setState({ firebaseListener: { ref: meetingRef, listener } });
  },

  setRole: (role: Role) => {
    const { status, meetingId, masterEmployeeList } = get();
    // If we are lead and meeting hasn't started, go to config mode
    if (role === Role.Lead && status === 'waiting') {
      const initialPresentIds = masterEmployeeList.map(e => e.id);
      
      const updates: Partial<FirebaseMeetingState> = {
        status: 'configuring',
        presentParticipantIds: initialPresentIds,
      };
      
      // FIX: Use Firebase v8 `update()` method.
      database.ref(`meetings/${meetingId}`).update(updates);
    }
    setState({ role });
  },

  addEmployee: (name: string) => {
    if (name.trim() === '') return;
    const { meetingId, masterEmployeeList, presentParticipantIds } = get();
    const newEmployee: Employee = { id: new Date().toISOString(), name: name.trim(), active: true };
    const newMasterList = [...masterEmployeeList, newEmployee];
    const newPresentIds = new Set(presentParticipantIds).add(newEmployee.id);
    
    const updates = {
      [`masterEmployeeList`]: newMasterList,
      [`presentParticipantIds`]: Array.from(newPresentIds)
    };
    // FIX: Use Firebase v8 `update()` method.
    database.ref(`meetings/${meetingId}`).update(updates);
  },

  toggleParticipantPresence: (employeeId: string) => {
    const { meetingId, presentParticipantIds } = get();
    const newPresentIds = new Set(presentParticipantIds);
    if (newPresentIds.has(employeeId)) {
        newPresentIds.delete(employeeId);
    } else {
        newPresentIds.add(employeeId);
    }
    // FIX: Use Firebase v8 `set()` method.
    database.ref(`meetings/${meetingId}/presentParticipantIds`).set(Array.from(newPresentIds));
  },

  startMeeting: () => {
    const { role, status, meetingId, masterEmployeeList, presentParticipantIds } = get();
    if (role !== Role.Lead || status !== 'configuring') return;

    const presentParticipants = masterEmployeeList.filter(emp => presentParticipantIds.has(emp.id));
    const shuffledQueue = shuffleArray(presentParticipants);

    const updates: Partial<FirebaseMeetingState> = {
        status: 'in_progress',
        queue: shuffledQueue
    };

    // FIX: Use Firebase v8 `update()` method.
    database.ref(`meetings/${meetingId}`).update(updates);
  },
  
  nextSpeaker: () => {
    const { status, queue, meetingId } = get();
    if (status !== 'in_progress' || queue.length === 0) return;

    const newQueue = queue.slice(1);
    const newStatus = newQueue.length === 0 ? 'done' : 'in_progress';

    const updates = {
        [`queue`]: newQueue,
        [`status`]: newStatus,
    };
    // FIX: Use Firebase v8 `update()` method.
    database.ref(`meetings/${meetingId}`).update(updates);
  },

  cleanupSync: () => {
    const { firebaseListener } = get();
    if (firebaseListener) {
        // FIX: Use Firebase v8 `off()` method to unsubscribe from listener.
        firebaseListener.ref.off('value', firebaseListener.listener);
        setState({ firebaseListener: null });
    }
  }
}));