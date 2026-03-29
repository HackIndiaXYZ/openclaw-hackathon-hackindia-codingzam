import { useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import gsap from "gsap";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import ChatbotPage from "./pages/ChatbotPage";
import ToolsPage from "./pages/ToolsPage";
import RoadmapPage from "./pages/RoadmapPage";
import SeniorsPage from "./pages/SeniorsPage";
import ThemeToggle from "./components/ThemeToggle";
import LanguageSwitcher from "./components/LanguageSwitcher";
import PrivateRoute from "./components/PrivateRoute";
import GlobalLoading from "./components/GlobalLoading";
import "./App.css";

function App() {
  const location = useLocation();
  const pageRef = useRef(null);

  useEffect(() => {
    if (!pageRef.current) {
      return;
    }

    gsap.fromTo(
      pageRef.current,
      { autoAlpha: 0, y: 14, scale: 0.99 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out" }
    );
  }, [location.pathname]);

  const getRouteTone = () => {
    if (location.pathname.startsWith("/quick-tasks")) {
      return "tasks";
    }

    if (location.pathname.startsWith("/best-match") || location.pathname.startsWith("/career-roadmap")) {
      return "growth";
    }

    if (location.pathname.startsWith("/connect-seniors")) {
      return "community";
    }

    if (location.pathname.startsWith("/dashboard")) {
      return "dashboard";
    }

    return "home";
  };

  return (
    <div className={`app-shell route-tone-${getRouteTone()}`}>
      <GlobalLoading />
      <ThemeToggle />
      <LanguageSwitcher />

      <div ref={pageRef} className="route-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/best-match"
            element={
              <PrivateRoute>
                <ChatbotPage title="Best Match" />
              </PrivateRoute>
            }
          />
          <Route
            path="/quick-tasks"
            element={
              <PrivateRoute>
                <ToolsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/quick-tasks/:toolKey"
            element={
              <PrivateRoute>
                <ToolsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/career-roadmap"
            element={
              <PrivateRoute>
                <RoadmapPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/connect-seniors"
            element={
              <PrivateRoute>
                <SeniorsPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

