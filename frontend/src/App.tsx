import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AnimatePresence } from "framer-motion";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import AssessmentPage from "./pages/AssessmentPage";
import ChatPage from "./pages/ChatPage";
import TopicPage from "./pages/TopicPage";
import WeeklyTestPage from "./pages/WeeklyTestPage";
import NotesPage from "./pages/NotesPage";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import NotFound from "./pages/NotFound";


// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import AIChatBox from "./components/AIChatBox";
import PageTransition from "./components/PageTransition";


function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><SignupPage /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/verify-email" element={<PageTransition><VerifyEmailPage /></PageTransition>} />


        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <PageTransition><DashboardPage /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/assessment" 
          element={
            <ProtectedRoute>
              <PageTransition><AssessmentPage /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <PageTransition><ChatPage /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/course/:topicTitle" 
          element={
            <ProtectedRoute>
              <PageTransition><TopicPage /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/weekly-test" 
          element={
            <ProtectedRoute>
              <PageTransition><WeeklyTestPage /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notes" 
          element={
            <ProtectedRoute>
              <PageTransition><NotesPage /></PageTransition>
            </ProtectedRoute>
          } 
        />

        {/* 404 */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <AnimatedRoutes />
        <AIChatBox />
        <ShadcnToaster />
        <SonnerToaster position="top-right" richColors closeButton />
      </div>
    </Router>
  );
}

export default App;