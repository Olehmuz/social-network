
export interface Message {
  id: string;
  room?: {
    id: string;
    name: string;
  },
  message: string;
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: string;
    nickname: string;
    email: string;
    photo?: string;
  };
}