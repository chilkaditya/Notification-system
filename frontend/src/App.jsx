import { useState, useEffect } from "react";
import "./App.css";
import Landing from "./pages/Landing";
import SignUpModal from "./pages/SignUpModal";
import SignInModal from "./pages/SignInModal";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState("landing"); // landing, signup, signin, dashboard
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setPage("dashboard");
    }
  }, []);

  const handleSignupClick = () => {
    setIsSignupModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSignupModalOpen(false);
    setIsSigninModalOpen(false);
  };

  const handleSignupSuccess = () => {
    // On successful signup, switch to signin
    setIsSignupModalOpen(false);
    setIsSigninModalOpen(true);
  };

  const handleSigninClick = () => {
    setIsSigninModalOpen(true);
  };

  const handleSigninSuccess = () => {
    // On successful signin, go to dashboard
    setIsSigninModalOpen(false);
    setPage("dashboard");
  };

  const handleLogout = () => {
    // Go back to landing page
    setPage("landing");
  };

  return (
    <div className="app">
      {page === "landing" && (
        <Landing
          onSignupClick={handleSignupClick}
          onSigninClick={handleSigninClick}
        />
      )}

      {page === "dashboard" && <Dashboard onLogout={handleLogout} />}

      <SignUpModal
        isOpen={isSignupModalOpen}
        onClose={handleCloseModal}
        onSignupSuccess={handleSignupSuccess}
      />

      <SignInModal
        isOpen={isSigninModalOpen}
        onClose={handleCloseModal}
        onSigninSuccess={handleSigninSuccess}
      />
    </div>
  );
}

export default App;
