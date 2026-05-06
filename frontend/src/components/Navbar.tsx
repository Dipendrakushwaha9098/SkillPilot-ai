import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, LogOut, Menu, X, Sun, Moon, Sparkles, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-9 h-9 border bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground transition-all"
    >
      {isDark ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMobileOpen(prev => !prev);
  const closeMenu = () => setMobileOpen(false);

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate("/");
  };

  const isLandingPage = location.pathname === "/";
  const isActive = (path: string) => location.pathname === path;

  const landingLinks = [
    { href: "#how", label: "How it works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];

  const appLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/chat", label: "AI Mentor" },
    { to: "/notes", label: "SkillNotes" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled 
          ? "bg-background/80 backdrop-blur-xl border-b shadow-lg py-2" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">
            SkillPilot <span className="text-primary italic">AI</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 md:flex">
          {/* Guest Links (Landing Page) */}
          {isLandingPage && !user && (
            <div className="flex items-center gap-6">
              {landingLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* App Links (Logged In) */}
          {user && (
            <div className="flex items-center gap-2">
              {appLinks.map((link) => (
                <Link key={link.to} to={link.to}>
                  <Button
                    variant={isActive(link.to) ? "secondary" : "ghost"}
                    size="sm"
                    className={`rounded-full px-4 font-bold ${isActive(link.to) ? "bg-primary/10 text-primary" : ""}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 border-l pl-4 border-border/50">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden lg:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Logged as</p>
                  <p className="text-sm font-bold text-foreground">{user.name}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-full font-bold gap-2 border-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-bold">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="rounded-full font-black shadow-lg shadow-primary/20 px-6">
                    Get Started <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="rounded-full"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="container mx-auto flex flex-col gap-4 p-6">
              {user ? (
                <>
                  {appLinks.map((link) => (
                    <Link key={link.to} to={link.to} onClick={closeMenu}>
                      <Button variant="ghost" className="w-full justify-start font-bold text-lg">
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                  <div className="border-t pt-4">
                    <div className="mb-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Account</p>
                      <p className="text-lg font-bold">{user.name}</p>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full font-bold gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {isLandingPage && landingLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={closeMenu}
                      className="px-4 py-3 text-lg font-bold text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Link to="/login" onClick={closeMenu}>
                      <Button variant="outline" className="w-full font-bold">Login</Button>
                    </Link>
                    <Link to="/signup" onClick={closeMenu}>
                      <Button className="w-full font-bold">Sign Up</Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;