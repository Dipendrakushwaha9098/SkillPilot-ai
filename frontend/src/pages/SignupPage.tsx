import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, Eye, EyeOff, Loader2, Mail, User, Lock } from "lucide-react";
import { toast } from "sonner";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill all fields");
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
        toast.success("Account created successfully!");
        navigate("/assessment");
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
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>


      <div className="w-full max-w-[500px] relative z-10">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-xl shadow-purple-600/20">
            <Brain className="h-9 w-9 text-white animate-float-slow" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white font-outfit">
            Create Account
          </h1>
          <p className="mt-3 text-slate-400 font-medium">
            Start your AI-powered learning path today.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-[2.5rem] border border-white/5 bg-white/5 p-8 lg:p-10 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300 ml-1">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 transition-colors group-focus-within:text-purple-400" />
                <Input
                  id="name"
                  placeholder="Enter your name"
                  className="h-14 pl-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-purple-500/50 transition-all"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 ml-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 transition-colors group-focus-within:text-purple-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter you mail"
                  className="h-14 pl-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-purple-500/50 transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>


            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" title="At least 6 characters" className="text-slate-300 ml-1">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 transition-colors group-focus-within:text-purple-400" />
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-14 pl-12 pr-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-purple-500/50 transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-300 transition-colors"
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-14 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white shadow-lg shadow-purple-600/20 mt-4 transition-all active:scale-[0.98]"
              disabled={loading}
            >

              {loading ? (
                <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Setting up...</>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-semibold">
              <span className="bg-[#0b1120] px-4 text-slate-500">Or</span>
            </div>
          </div>

          <p className="text-center text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-purple-400 hover:text-purple-300 transition-colors">
              Sign In
            </Link>
          </p>

        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-slate-500 px-8 leading-relaxed">
          By signing up, you agree to our <span className="text-slate-400 hover:text-blue-400 cursor-pointer transition-colors">Terms of Service</span> and <span className="text-slate-400 hover:text-blue-400 cursor-pointer transition-colors">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;