export interface RegisterMutation {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginMutation {
  email: string;
  password: string;
}
export interface User {
  _id: string;
  email: string;
  token: string;
  displayName: string;
  role: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    }
  },
  message: string;
  name: string;
  _message: string;
}
export interface RegisterResponse {
  message: string;
  user: User;
}

export  interface GlobalError {
  error: string;
}

export interface Message {
  _id: string;
  user: User;
  text: string;
  datetime: string;
}
export interface IncomingChatMessage {
  type: "NEW_MESSAGE";
  payload: Message;
}

export interface Updates{
  activeUsers: User[];
  messages: Message[];
}
export interface IncomingUpdates {
  type: "LAST_UPDATES";
  payload: Updates;
}

export type IncomingMessage = IncomingChatMessage | IncomingUpdates;