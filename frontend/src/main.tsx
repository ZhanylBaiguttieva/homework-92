import ReactDOM from 'react-dom/client';
import App from './App';
import theme from '../theme.ts';
import { ThemeProvider } from '@mui/material';
import { addInterceptors } from './axiosApi.ts';
import { persistor, store } from './app/store.ts';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';

addInterceptors(store);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <App/>
        </ThemeProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
