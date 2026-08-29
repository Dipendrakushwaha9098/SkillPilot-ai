import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Loader2, Sparkles, ArrowRight, CheckCircle, Target, Brain, Zap } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { GoogleLogin, useGoogleLogin, CredentialResponse } from "@react-oauth/google";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your credentials");
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      console.log("[LoginPage] Login result:", result);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Successfully logged in");
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const result = await googleLogin(tokenResponse.access_token);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Successfully logged in with Google!");
          navigate("/dashboard");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Google login failed";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("[Google OAuth Error]:", error);
      toast.error("Google authentication failed or was cancelled.");
    }
  });

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Google login failed: No credential received");
      return;
    }
    setLoading(true);
    try {
      const result = await googleLogin(credentialResponse.credential);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Successfully logged in with Google");
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -60, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/20 rounded-full blur-[120px]" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>


      <div className="w-full max-w-[1100px] grid lg:grid-cols-2 gap-8 relative z-10">
        {/* Left side: Visuals */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-col justify-center p-12 bg-card/60 backdrop-blur-xl rounded-[2rem] border border-border relative overflow-hidden group shadow-xl"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative z-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center gap-3 mb-12"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Sparkles size={24} className="text-white animate-pulse" />
              </div>
              <span className="text-2xl font-black tracking-tight font-display text-foreground">
                SkillPilot <span className="text-emerald-500 italic">AI</span>
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-4xl font-extrabold text-foreground tracking-tight mb-6 font-display leading-tight"
            >
              Master Any Skill with <span className="text-emerald-500">AI Precision</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-muted-foreground text-lg mb-12 leading-relaxed"
            >
              Join thousands of professionals accelerating their careers with 1:1 adaptive roadmaps and 24/7 AI mentorship.
            </motion.p>

            <div className="space-y-6">
              {[
                { title: "Custom Roadmaps", desc: "Tailored to your current level and goals", icon: Target },
                { title: "24/7 AI Mentor", desc: "Get instant code reviews & concept clarity", icon: Brain },
                { title: "Weekly Progress", desc: "Interactive quizzes and skill validation", icon: Zap }
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + (i * 0.1), duration: 0.5 }}
                  className="flex gap-4 items-start"
                >
                  <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <item.icon size={12} className="text-emerald-500" />
                  </div>

                  <div>
                    <h3 className="text-foreground font-semibold text-lg">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-16 pt-8 border-t border-border relative z-10"
          >
            <div className="flex items-center gap-4">
              <p className="text-muted-foreground text-sm">
                Joined by <span className="text-foreground font-semibold">2,000+</span> learners this month.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right side: Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center lg:p-8"
        >
          <div className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-xl p-8 lg:p-12 rounded-[2rem] border border-border shadow-2xl">
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-foreground mb-3 font-display">Welcome Back</h1>
              <p className="text-muted-foreground">Continue your path to excellence.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground ml-1 font-medium">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="h-14 bg-background border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:ring-emerald-500/20 focus:border-emerald-500 transition-all pl-4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-emerald-500 hover:text-emerald-400 font-semibold transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="h-14 bg-background border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:ring-emerald-500/20 focus:border-emerald-500 transition-all pl-4 pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="ml-1" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-muted-foreground text-xs uppercase tracking-widest font-semibold">Social Login</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleGoogleAuth()}
                disabled={loading}
                className="w-full h-14 bg-card border border-border hover:bg-muted/60 text-foreground font-semibold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-sm hover:border-emerald-500/40"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </motion.button>
            </div>

            <p className="mt-10 text-center text-muted-foreground">
              New to SkillPilot?{" "}
              <Link to="/signup" className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;