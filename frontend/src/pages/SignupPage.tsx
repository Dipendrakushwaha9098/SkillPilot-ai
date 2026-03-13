import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, Eye, EyeOff, Loader2 } from "lucide-react";
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
    if (!name || !email || !password) { toast.error("Please fill all fields"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    
    setLoading(true);
    const result = await signup(name, email, password);
    setLoading(false);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Account created successfully!");
      navigate("/assessment");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg shadow-primary/20">
            <Brain className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-2 text-muted-foreground font-medium">Start your personalized learning journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border bg-card p-8 shadow-card border-slate-100">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" className="h-12 rounded-xl" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" className="h-12 rounded-xl" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPw ? "text" : "password"} placeholder="••••••••" className="h-12 rounded-xl" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" variant="hero" className="w-full h-12 rounded-xl font-bold text-lg mt-2" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating account...</> : "Start Learning"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground font-medium">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-primary hover:underline underline-offset-4">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
