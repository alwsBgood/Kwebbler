
export enum SpeakerStatus {
  Speaking = 'speaking',
  Next = 'next',
  Done = 'done',
  Queued = 'queued',
}

export enum Role {
  Lead = 'lead',
  Participant = 'participant',
}

export type MeetingStatus = 'waiting' | 'configuring' | 'in_progress' | 'done';

export interface Employee {
  id: string;
  name: string;
  active: boolean;
}

// FIX: The Speaker interface now extends Employee to include the 'active' property,
// resolving errors where Speaker objects were created from Employee objects.
export interface Speaker extends Employee {
  status: SpeakerStatus;
}
