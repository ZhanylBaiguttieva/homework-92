import {useEffect, useRef, useState} from "react";
import {ChatMessage, IncomingMessage} from "../../../types";
import { useAppSelector } from '../../../app/hooks.ts';
import { selectUser } from '../../users/usersSlice.ts';

function App() {
  const  [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');

  const user = useAppSelector(selectUser);
  const changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  }

  const ws  = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/chat');
    ws.current.addEventListener('close', () => console.log('ws closed'));
    ws.current.addEventListener('open', () => {
      ws.current?.send(JSON.stringify({type: 'LOGIN', payload: user?.token}));
    });

    ws.current.addEventListener('message', (event) => {
      const decodeMessage  = JSON.parse(event.data) as IncomingMessage;

      if(decodeMessage.type === 'NEW_MESSAGE') {
        setMessages(prev => [...prev, decodeMessage.payload]);
      }

    });

    return () => {
      if(ws.current) {
        ws.current.close();
      }
    }
  }, []);

  const sendMessage = (e:React.FormEvent) => {
    e.preventDefault();
    if(!ws.current) return;
    ws.current.send(JSON.stringify({type: 'SEND_MESSAGE', payload: messageText}));
  };

  return (
    <div>
      {messages.map((message, idx) => (
        <div key={idx}>
          <b>{message.user}: </b>{message.message}
        </div>
      ))}
      <form onSubmit={sendMessage}>
        <input
          type="text"
          name="messageText"
          value={messageText}
          onChange={changeMessage}
        />
        <input
          type="submit"
          value="send"
        />
      </form>
    </div>
  );
}

export default App;