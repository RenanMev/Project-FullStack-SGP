import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes";
import { UserProvider } from './context/UserContext';

const App = () => {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
