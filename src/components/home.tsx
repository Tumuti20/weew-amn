import React, { useState, useEffect } from "react";
import LoginForm from "./auth/LoginForm";
import Dashboard from "./dashboard/Dashboard";

interface HomeProps {
  initialAuthenticated?: boolean;
}

const Home: React.FC<HomeProps> = ({ initialAuthenticated = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPasswordSent, setIsPasswordSent] = useState(false);

  // Apply dark mode class to document when isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Handle login attempt
  const handleLogin = (email: string, password: string) => {
    setIsLoading(true);
    setError("");

    // Simulate authentication process
    setTimeout(() => {
      // For demo purposes, any non-empty email/password combination works
      if (email && password) {
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        setError("Invalid credentials. Please try again.");
        setIsLoading(false);
      }
    }, 1500);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsPasswordSent(false);
  };

  // Toggle dark/light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen w-full bg-background">
      {isAuthenticated ? (
        <Dashboard
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onLogout={handleLogout}
        />
      ) : (
        <div className="flex items-center justify-center min-h-screen p-4">
          <LoginForm
            onLogin={handleLogin}
            isLoading={isLoading}
            error={error}
            isPasswordSent={isPasswordSent}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
