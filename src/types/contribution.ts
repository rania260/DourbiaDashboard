export interface Contribution {
  id: number;
  text?: string;
  fileUrl?: string;
  fileType?: 'image' | 'video' | 'pdf' | null;
  monument?: {
    id: number;
    name: string;
  };
  createdAt: string;
  user?: {
    id: number;
    username: string;
  };
}
