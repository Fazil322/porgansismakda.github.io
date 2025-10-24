

export interface Candidate {
  id: number;
  name: string;
  vision: string;
  mission: string;
  photoUrl: string;
  votes: number;
  bio?: string;
}

export interface VotingEvent {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  candidates: Candidate[];
}

export interface VotingToken {
  id: string;
  status: 'active' | 'used';
  usedAt?: number;
}

export interface VoteRecord {
    id: string;
    candidateId: number;
    timestamp: number;
}

export interface Organization {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  members: string[];
}

export interface Activity {
  id: number;
  date: string;
  title: string;
  organizer: string;
}

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  organizationTag: string;
}

export interface Aspiration {
  id: number;
  text: string;
  status: 'unread' | 'read';
  category?: string;
  timestamp: number;
}

export interface Registration {
    id: number;
    studentName: string;
    studentClass: string;
    organizationName: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: number;
}

export interface Document {
    id: number;
    title: string;
    date: string;
    content: string;
    organization: string;
}

export interface PollOption {
  id: number;
  text: string;
  votes: number;
}

export interface Poll {
  id: number;
  question: string;
  options: PollOption[];
  isActive: boolean;
  createdAt: number;
}

// FIX: Add missing FinancialRecord interface.
export interface FinancialRecord {
  id: number;
  date: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
}
