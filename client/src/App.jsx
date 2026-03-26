import { useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import gsap from "gsap";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import FeaturePlaceholderPage from "./pages/FeaturePlaceholderPage";
import ChatbotPage from "./pages/ChatbotPage";
import ToolsPage from "./pages/ToolsPage";
import EmailGeneratorPage from "./pages/EmailGeneratorPage";
import ToolPlaceholderPage from "./pages/ToolPlaceholderPage";
import AssignmentHelperPage from "./pages/AssignmentHelperPage";
import PDFToolsPage from "./pages/PDFToolsPage";
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
            path="/quick-tasks/email-generator"
            element={
              <PrivateRoute>
                <EmailGeneratorPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/quick-tasks/pdf-tools"
            element={
              <PrivateRoute>
                <PDFToolsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/quick-tasks/assignment-helper"
            element={
              <PrivateRoute>
                <AssignmentHelperPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/quick-tasks/front-page-generator"
            element={
              <PrivateRoute>
                <ToolPlaceholderPage title="Front Page Generator" />
              </PrivateRoute>
            }
          />
          <Route
            path="/quick-tasks/resume-polisher"
            element={
              <PrivateRoute>
                <ToolPlaceholderPage title="Resume Polisher" />
              </PrivateRoute>
            }
          />
          <Route
            path="/quick-tasks/cover-letter-builder"
            element={
              <PrivateRoute>
                <ToolPlaceholderPage title="Cover Letter Builder" />
              </PrivateRoute>
            }
          />
          <Route
            path="/quick-tasks/linkedin-headline-lab"
            element={
              <PrivateRoute>
                <ToolPlaceholderPage title="LinkedIn Headline Lab" />
              </PrivateRoute>
            }
          />
          <Route
            path="/quick-tasks/interview-question-bank"
            element={
              <PrivateRoute>
                <ToolPlaceholderPage title="Interview Question Bank" />
              </PrivateRoute>
            }
          />
          <Route
            path="/quick-tasks/study-plan-scheduler"
            element={
              <PrivateRoute>
                <ToolPlaceholderPage title="Study Plan Scheduler" />
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

