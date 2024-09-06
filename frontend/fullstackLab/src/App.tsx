import React, { useEffect } from 'react';
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes";

const App = () => {
  useEffect(() => {
    console.log('Dark mode:', document.querySelector('div')?.classList.contains('dark'));
  }, []);

  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
