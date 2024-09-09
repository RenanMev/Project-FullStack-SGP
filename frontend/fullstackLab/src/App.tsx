import React, { useEffect } from 'react';
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes";
import { UserProvider } from './context/UserContext';

const App = () => {
  useEffect(() => {
    console.log('Dark mode:', document.querySelector('div')?.classList.contains('dark'));
  }, []);

  return (
    <ThemeProvider>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
