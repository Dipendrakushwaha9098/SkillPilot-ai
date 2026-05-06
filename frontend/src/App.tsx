import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

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
import NotFound from "./pages/NotFound";


// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import AIChatBox from "./components/AIChatBox";


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />


          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assessment" 
            element={
              <ProtectedRoute>
                <AssessmentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/course/:topicTitle" 
            element={
              <ProtectedRoute>
                <TopicPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/weekly-test" 
            element={
              <ProtectedRoute>
                <WeeklyTestPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notes" 
            element={
              <ProtectedRoute>
                <NotesPage />
              </ProtectedRoute>
            } 
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIChatBox />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;