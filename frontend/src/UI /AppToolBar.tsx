import { NavLink } from 'react-router-dom';
import { AppBar, Grid, styled, Toolbar, Typography } from '@mui/material';
import { useAppSelector } from '../app/hooks.ts';
import { selectUser } from '../features/users/usersSlice.ts';
import UserMenu from './UserMenu.tsx';
import GuestMenu from './GuestMenu.tsx';


const Link = styled(NavLink)({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: 'inherit'
  },
});

const AppToolbar = () => {
  const user = useAppSelector(selectUser);

  return (
    <AppBar position="sticky" sx={{mb: 2}}>
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            <Link to="/">ChatRoom</Link>
          </Typography>
          { user ? (
            <UserMenu user={user}/>
          ) : (
            <GuestMenu />
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;