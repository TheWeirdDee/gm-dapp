export interface User {
  address: string;
  username: string;
  avatar?: string;
  streak: number;
  points: number;
  lastGm: number;
  following: number;
  followers: number;
  bio?: string;
  website?: string;
  isPro?: boolean;
}

export interface Post {
  id: string;
  authorAddress: string;
  content: string;
  timestamp: string;
  txId?: string;
  reactions: {
    gm: number;
    fire: number;
    laugh: number;
  };
  commentsCount: number;
  repostsCount: number;
  points: number;
  isPro?: boolean;
  avatar?: string;
  mediaUrl?: string;
  pollData?: {
    options: string[];
    votes: number[];
    expiresAt?: string;
  };
  currentUserReaction?: string | null;
}
