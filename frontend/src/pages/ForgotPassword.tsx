import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2, Sparkles, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Reset link sent to your email!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0514] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02]" 
             style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <div className="w-full max-w-[450px] relative z-10">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-xl shadow-purple-600/20">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-outfit">
            Reset Password
          </h1>
          <p className="mt-3 text-slate-400 font-medium px-4">
            Enter your email and we'll send you a link to get back into your account.
          </p>
        </div>

        <div className="rounded-[2.5rem] border border-white/5 bg-white/5 p-8 lg:p-10 shadow-2xl backdrop-blur-xl">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 transition-colors group-focus-within:text-purple-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="h-14 pl-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-purple-500/50 transition-all" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white shadow-lg shadow-purple-600/20 mt-2 transition-all active:scale-[0.98]" 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                We've sent a password reset link to <br />
                <span className="text-white font-semibold">{email}</span>
              </p>
              <Button 
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="w-full h-12 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                Try another email
              </Button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/5">
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
