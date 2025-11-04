export interface PostUser {
  id: string;
  username: string;
  avatarUrl: string | null;
  avatarShape: "circle" | "square";
  isFollowing?: boolean;
}

export interface PostData {
  id: string;
  user: PostUser;
  createdAt: string;
  content: string;
  hashtags: string[];
  initialLikes: number;
  initialFavorites: number;
  initialReposts: number;
  initialComments: number;
  mediaUrl?: string;
  isFollowing?: boolean;
}

// Puedes agregar más tipos relacionados aquí
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  hasMore: boolean;
}
