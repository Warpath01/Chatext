import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import ProtectedRoute from "./components/Protected/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { useAuthStore } from "./store/auth.store";
import { useEffect, useState } from "react";
import AuthLayout from "./components/auth-layout/AuthLayout";

function App() {
  const { checkAuth, authUser, isLoading, setIsLoading } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={!authUser ? <AuthLayout /> : <Navigate to="/home" />}
        >
          <Route
            path="signup"
            element={!authUser ? <Signup /> : <Navigate to="/home" />}
          />
          <Route
            path="login"
            element={!authUser ? <Login /> : <Navigate to="/home" />}
          />
        </Route>

        {/* These routes are protected */}
        <Route
          path="/home"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat"
          element={authUser ? <Chat /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
