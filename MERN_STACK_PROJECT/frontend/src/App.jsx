import { useContext } from "react";
import AuthContext, { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function AppRoutes() {
  const { token } = useContext(AuthContext);
  return token ? <Dashboard /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
