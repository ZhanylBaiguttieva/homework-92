import { User } from '../../../types';
import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@mui/material';
import React from 'react';

interface Props {
  user: User;
}

const UsersActive: React.FC<Props> = ({user}) => {

  return (
    <Paper elevation={6} variant="elevation" square={false}>
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar alt={user.displayName} />
          </ListItemAvatar>
          <Grid container>
            <Grid item xs={12}>
              <ListItemText primary={
                <Typography component="div" variant="h6">
                  {user.displayName}
                </Typography>
              }></ListItemText>
            </Grid>
          </Grid>
        </ListItem>
      </List>
    </Paper>
  );
};

export default UsersActive;