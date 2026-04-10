export interface User {
  address: string;
  username: string;
  avatar: string;
  streak: number;
  points: number;
  lastGm: number;
  following: number;
  followers: number;
  bio?: string;
}

export interface Post {
  id: string;
  authorAddress: string;
  content: string;
  timestamp: string;
  reactions: {
    gm: number;
    fire: number;
    laugh: number;
  };
  commentsCount: number;
  repostsCount: number;
}

export const CURRENT_USER_ADDRESS = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";

export const MOCK_USERS: Record<string, User> = {
  "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM": {
    address: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    username: "gm_alice",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    streak: 12,
    points: 2400,
    lastGm: 0,
    following: 45,
    followers: 128,
    bio: "Saying GM every day since block 1.",
  },
  "ST2CY5V39NHDPWSXWH9QLS3MPDW5A8GWH3RYXQZ00": {
    address: "ST2CY5V39NHDPWSXWH9QLS3MPDW5A8GWH3RYXQZ00",
    username: "stacks_builder",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=builder",
    streak: 45,
    points: 8900,
    lastGm: 0,
    following: 300,
    followers: 550,
    bio: "Building on Bitcoin via Stacks.",
  },
  "ST33ZY8T6F2DBF3W74ZJ2D83C5GZ9W8Z8T8X0T8CQ": {
    address: "ST33ZY8T6F2DBF3W74ZJ2D83C5GZ9W8Z8T8X0T8CQ",
    username: "crypto_bob",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    streak: 3,
    points: 400,
    lastGm: 0,
    following: 12,
    followers: 5,
    bio: "New to the Gm community!",
  },
};

export const MOCK_POSTS: Post[] = [
  {
    id: "post_1",
    authorAddress: "ST2CY5V39NHDPWSXWH9QLS3MPDW5A8GWH3RYXQZ00",
    content: "GM to everyone building on Bitcoin! The new testnet update is incredibly fast. 🚀",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    reactions: {
      gm: 24,
      fire: 12,
      laugh: 0,
    },
    commentsCount: 5,
    repostsCount: 3,
  },
  {
    id: "post_2",
    authorAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    content: "I just hit a 12-day streak on Gm! Who's going for 30? 👀",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    reactions: {
      gm: 45,
      fire: 8,
      laugh: 2,
    },
    commentsCount: 12,
    repostsCount: 1,
  },
  {
    id: "post_3",
    authorAddress: "ST33ZY8T6F2DBF3W74ZJ2D83C5GZ9W8Z8T8X0T8CQ",
    content: "Just joined! Can't wait to see how the social graph evolves here.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    reactions: {
      gm: 5,
      fire: 1,
      laugh: 0,
    },
    commentsCount: 1,
    repostsCount: 0,
  },
];
