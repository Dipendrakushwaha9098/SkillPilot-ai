import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, Eye, EyeOff, Loader2, Mail, User, Lock } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { GoogleLogin, useGoogleLogin, CredentialResponse } from "@react-oauth/google";
import { motion } from "framer-motion";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const result = await signup(name, email, password);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Registration successful!");
        setIsEmailSent(true);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  
  const onGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const result = await googleLogin(tokenResponse.access_token);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Account created successfully with Google!");
          navigate("/assessment");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Google signup failed";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("[Google OAuth Error]:", error);
      toast.error("Google signup failed or was cancelled.");
    }
  });

  const onGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    setLoading(true);
    try {
      const result = await googleLogin(credentialResponse.credential);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Account created successfully with Google!");
        navigate("/assessment");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google signup failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleError = () => {
    toast.error("Google signup failed. Please try again.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, -50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
            x: [0, 60, 0],
            y: [0, -40, 0]
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px]" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>


      <div className="w-full max-w-[500px] relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-xl shadow-purple-600/20">
            <Brain className="h-9 w-9 text-white animate-float-slow" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground font-outfit">
            Create Account
          </h1>
          <p className="mt-3 text-muted-foreground font-medium">
            Start your AI-powered learning path today.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-[2.5rem] border border-border bg-card/80 p-8 lg:p-10 shadow-2xl backdrop-blur-xl"
        >
          {isEmailSent ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-4"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/20 text-emerald-400">
                <Mail className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Check your email</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                We've sent a verification link to <span className="text-foreground font-semibold">{email}</span>. Please click the link to activate your account.
              </p>
              <Link to="/login">
                <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all">
                  Back to Login
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-foreground font-semibold ml-1">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-emerald-400" />
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      className="h-14 pl-12 rounded-2xl border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500/50 transition-all"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-foreground font-semibold ml-1">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-emerald-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="h-14 pl-12 rounded-2xl border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500/50 transition-all"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </motion.div>


                {/* Password */}
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" title="At least 6 characters" className="text-foreground font-semibold ml-1">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-emerald-400" />
                    <Input
                      id="password"
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-14 pl-12 pr-12 rounded-2xl border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500/50 transition-all"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />

                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPw(!showPw)}
                    >
                      {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-14 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white shadow-lg shadow-blue-500/20 mt-4 transition-all active:scale-[0.98]"
                    disabled={loading}
                  >

                    {loading ? (
                      <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Setting up...</>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </motion.div>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-semibold">
                  <span className="bg-card px-4 text-muted-foreground">Or</span>
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-6 flex flex-col gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => onGoogleAuth()}
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
              </motion.div>

              <p className="text-center text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                  Sign In
                </Link>
              </p>
            </>
          )}
        </motion.div>

        {/* Footer info */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-xs text-muted-foreground px-8 leading-relaxed"
        >
          By signing up, you agree to our <span className="text-foreground hover:text-emerald-400 cursor-pointer transition-colors font-medium">Terms of Service</span> and <span className="text-foreground hover:text-emerald-400 cursor-pointer transition-colors font-medium">Privacy Policy</span>.
        </motion.p>
      </div>
    </div>
  );
};

export default SignupPage;