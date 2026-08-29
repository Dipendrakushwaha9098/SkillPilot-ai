import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link. Missing token.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/auth/verify/${token}`);
        setStatus("success");
        setMessage(response.data.message || "Email verified successfully!");
      } catch (error: unknown) {
        setStatus("error");
        const err = error as { response?: { data?: { error?: string } } };
        setMessage(err.response?.data?.error || "Verification failed. The link may have expired.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-dark p-8 md:p-12 rounded-[2.5rem] border-white/5 text-center relative z-10"
      >
        <div className="mb-8 flex justify-center">
          {status === "loading" && (
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
            </div>
          )}
          {status === "success" && (
            <div className="w-20 h-20 bg-green-500/20 rounded-3xl flex items-center justify-center shadow-lg shadow-green-500/20">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          )}
          {status === "error" && (
            <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center shadow-lg shadow-red-500/20">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-white mb-4 font-outfit">
          {status === "loading" ? "Verifying..." : status === "success" ? "All Set!" : "Oops!"}
        </h1>
        <p className="text-slate-400 mb-10 leading-relaxed">
          {status === "loading" ? "We're verifying your email address. Just a moment." : message}
        </p>

        {status !== "loading" && (
          <Link to="/login">
            <Button className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
              {status === "success" ? "Continue to Login" : "Back to Login"}
              <ArrowRight size={18} />
            </Button>
          </Link>
        )}
        
        {status === "error" && (
          <p className="mt-6 text-sm text-slate-500">
            Need help? Contact support or try <Link to="/signup" className="text-purple-400 hover:underline">signing up</Link> again.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
