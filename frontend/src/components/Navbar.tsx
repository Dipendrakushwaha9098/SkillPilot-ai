import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMenu = () => {
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/70 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold"
          onClick={closeMenu}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
            <Brain className="h-5 w-5 text-white" />
          </div>

          <span>
            SkillPilot <span className="text-indigo-600">AI</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>

              <Link to="/chat">
                <Button variant="ghost" size="sm">
                  AI Mentor
                </Button>
              </Link>

              <span className="text-sm text-muted-foreground">
                Hi, {user.name}
              </span>

              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>

              <Link to="/signup">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {user ? (
              <>
                <Link to="/dashboard" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full justify-start">
                    Dashboard
                  </Button>
                </Link>

                <Link to="/chat" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full justify-start">
                    AI Mentor
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full">
                    Login
                  </Button>
                </Link>

                <Link to="/signup" onClick={closeMenu}>
                  <Button className="w-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
