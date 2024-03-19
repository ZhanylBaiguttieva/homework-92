import React, {useEffect, useRef, useState} from "react";
import { IncomingMessage, Message, User } from '../../../types';
import { useAppSelector } from '../../../app/hooks.ts';
import { selectUser } from '../../users/usersSlice.ts';
import { Button, Grid, TextField } from '@mui/material';
import ChatItem from './ChatItem.tsx';
import UsersActive from './UsersActive.tsx';

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [lastMessages, setLastMessages] = useState<Message[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);

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
      if(decodeMessage.type === 'LAST_UPDATES') {
        console.log(decodeMessage.payload);
        setLastMessages(decodeMessage.payload.messages);
        setActiveUsers(decodeMessage.payload.activeUsers);
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
    setMessageText('');
  };


  return (
    <Grid container
          justifyContent="space-between">
      <Grid item xs={8} sx={{
          height: '60vh',
          overflowY: 'auto',
          border: '1px solid black',
          borderRadius: 3,
        }}>
        <Grid item xs={12}>
          {(lastMessages.length > 0) && lastMessages.map((lastMessage) => (
            <ChatItem
              key={lastMessage._id}
              chat={lastMessage}
            >
            </ChatItem>
          ))}
        </Grid>
        <Grid item xs={12}>
          {messages.map((message) => (
            <ChatItem
              key={message._id}
              chat={message}
            >
            </ChatItem>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={4} sx={{
          height: '60vh',
          overflowY: 'auto',
          border: '1px solid grey',
          borderRadius: 3,
        }}>
        {(activeUsers.length > 0) && activeUsers.map((activeUser) => (
            <UsersActive
              key={activeUser._id}
              user={activeUser}
            >
            </UsersActive>
        ))}
      </Grid>
      <Grid item xs={12} mt={2}>
        <form
          autoComplete="off"
          onSubmit={sendMessage}>
          <Grid container direction="row" spacing={2}>
            <Grid item xs>
              <TextField
                id="text" label="Message"
                value={messageText}
                onChange={changeMessage}
                name="messageText"
                required
              />
            </Grid>
            <Grid item xs>
              <Button type="submit" color="primary" variant="contained">Send</Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}

export default Chat;
