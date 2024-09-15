import React, { useEffect } from 'react';
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes";
import { UserProvider } from './context/UserContext';

const App = () => {

  return (
    <ThemeProvider>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
