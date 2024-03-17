import { useAppSelector } from './app/hooks.ts';
import { selectUser } from './features/users/usersSlice.ts';
import { Container, CssBaseline } from '@mui/material';
import AppToolbar from './UI /AppToolBar.tsx';
import { Route, Routes } from 'react-router-dom';
import Login from './features/users/Login.tsx';
import Register from './features/users/Register.tsx';
import ProtectedRoute from './UI /ProtectedRoute.tsx';
import Chat from './features/posts/components/Chat.tsx';

function App() {
  const user = useAppSelector(selectUser);

  return (
    <>
      <CssBaseline/>
      <header>
        <AppToolbar/>
      </header>
      <main>
        <Container maxWidth="xl">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/chatRoom" element={(
              <ProtectedRoute isAllowed={user}>
                <Chat />
              </ProtectedRoute>
            )} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<h1>Not found</h1>} />
          </Routes>
        </Container>
      </main>
    </>
  );
}

export default App;
