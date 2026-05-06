import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Loader2, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your credentials");
      return;
    }
    setLoading(true);
    try {
      const result = await login(email, password);
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

  return (
    <div className="min-h-screen bg-[#0a0514] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>


      <div className="w-full max-w-[1100px] grid lg:grid-cols-2 gap-8 relative z-10">
        {/* Left side: Visuals */}
        <div className="hidden lg:flex flex-col justify-center p-12 glass-dark rounded-[2rem] border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/20">
                <Sparkles size={24} className="text-white animate-pulse" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight font-outfit">SkillPilot</span>
            </div>


            <h2 className="text-5xl font-bold text-white leading-tight mb-8 font-outfit">
              Master any skill <br />
              <span className="text-pink-400">powered by AI.</span>
            </h2>


            <div className="space-y-6">
              {[
                { title: "Personalized Roadmap", desc: "AI-generated learning paths tailored to your goals.", icon: CheckCircle },
                { title: "24/7 AI Mentor", desc: "Get instant answers and guidance whenever you need.", icon: Sparkles },
                { title: "Progress Analytics", desc: "Track your journey with beautiful data visualizations.", icon: ArrowRight },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="mt-1 w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                    <item.icon size={12} className="text-purple-400" />
                  </div>

                  <div>
                    <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-sm">
                Joined by <span className="text-white font-semibold">2,000+</span> learners this month.
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Form */}
        <div className="flex flex-col justify-center lg:p-8">
          <div className="w-full max-w-md mx-auto glass-dark p-8 lg:p-12 rounded-[2rem] border-white/5 shadow-2xl">
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-white mb-3 font-outfit">Welcome Back</h1>
              <p className="text-slate-400">Continue your path to excellence.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 ml-1">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all pl-4"
                  />

                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-slate-300">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
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
                    className="h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all pl-4 pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 disabled:opacity-50 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 active:scale-[0.98]"
              >

                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="ml-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-slate-500 text-xs uppercase tracking-widest font-semibold">Social Login</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            <div className="mt-6">
              <button className="w-full h-14 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-white font-semibold transition-all flex items-center justify-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </div>

            <p className="mt-10 text-center text-slate-400">
              New to SkillPilot?{" "}
              <Link to="/signup" className="text-purple-400 font-bold hover:text-purple-300 transition-colors">
                Create Account
              </Link>

            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;