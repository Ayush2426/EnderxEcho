import { useEffect } from "react";
import Navbar from "./Components/Navbar";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import SettingsPage from "./Pages/SettingsPage";
import { Loader } from "lucide-react";
import ProfilePage from "./Pages/ProfilePage";
import { useAuthStore } from "./Store/useAuthStore";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"></Loader>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        ></Route>
        <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to="/" /> }></Route>
        <Route path="/settings" element={<SettingsPage />}></Route>
        <Route
          path="/profile "
          element={
            authUser ? <ProfilePage /> : <Navigate to="/login"/>
          }
        ></Route>
      </Routes>
    </div>
  );
};

export default App;
