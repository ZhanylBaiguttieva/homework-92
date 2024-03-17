import React from 'react';
import { Navigate } from 'react-router-dom';
import { User } from '../types';

interface Props extends React.PropsWithChildren{
  isAllowed: User | null;
}
const ProtectedRoute: React.FC<Props> = ({isAllowed, children}) => {
  if(!isAllowed) {
    return <Navigate to='/login' />;
  }
  return children;
};

export default ProtectedRoute;