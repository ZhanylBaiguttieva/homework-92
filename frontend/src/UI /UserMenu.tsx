import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { useAppDispatch } from '../app/hooks.ts';
import { User } from '../types';
import { logout } from '../features/users/usersThunk.ts';

interface Props {
  user: User;
}
const UserMenu: React.FC<Props> = ({user}) => {
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <Button color="inherit" onClick={handleClick}>
        Hello, {user.displayName}
      </Button>
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose} keepMounted>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;