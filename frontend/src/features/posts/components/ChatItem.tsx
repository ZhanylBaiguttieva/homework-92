import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { Message } from '../../../types';
import React from 'react';
import dayjs from 'dayjs';

interface Props {
  chat: Message;
}
const ChatItem: React.FC<Props>  = ({chat}) => {
  const currentDate = dayjs(chat.datetime);
  const formattedDate = currentDate.format('HH:mm:ss');

  return (
    <Grid container>
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar alt={chat.user?.displayName} />
          </ListItemAvatar>
          <Grid container>
            <Grid item xs={12}>
              <ListItemText primary={
                <Typography component="div" variant="h6">
                  {chat.user.displayName}: "{chat.text}"
                </Typography>
                }></ListItemText>
              <Grid item xs={12}>
                <ListItemText secondary={
                  <Typography component="div" >
                    {formattedDate}
                  </Typography>
                }></ListItemText>
              </Grid>
            </Grid>
          </Grid>
        </ListItem>
      </List>
    </Grid>
  );
};

export default ChatItem;