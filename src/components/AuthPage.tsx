import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  ShieldCheck,
  User as UserIcon,
  KeyRound
} from "lucide-react";
import { useAuth } from "../firebase/authContext";
import { fetchAcademicProfile } from "../firebase/firestoreService";
import { getStudentAcademicProfile } from "../data/academicCatalog";

interface AuthPageProps {
  onBackToLanding: () => void;
  onNavigateOnboarding: () => void;
  onNavigateApp: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onBackToLanding,
  onNavigateOnboarding,
  onNavigateApp,
}) => {
  const { 
    user, 
    loading: authLoading, 
    error: authError, 
    signInWithGoogle, 
    signInAsGuest, 
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    clearError 
  } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetSentEmail, setResetSentEmail] = useState<string | null>(null);

  // Check whether a user already has a complete academic profile
  const handlePostAuthRouting = async (uid: string) => {
    try {
      // 1. Check remote firestore profile
      const remoteProfile = await fetchAcademicProfile(uid);
      if (remoteProfile && remoteProfile.branch && remoteProfile.programme && remoteProfile.section) {
        onNavigateApp();
        return;
      }

      // 2. Check local storage completed profile
      const localProfile = getStudentAcademicProfile();
      const hasCompletedLocal = localStorage.getItem(`academic_profile_onboarding_completed_${uid}`);
      if (hasCompletedLocal === "true" && localProfile && localProfile.branch) {
        onNavigateApp();
        return;
      }

      // If new user or profile incomplete, navigate to onboarding setup
      onNavigateOnboarding();
    } catch (err) {
      console.warn("Routing check warning:", err);
      onNavigateOnboarding();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (mode === "forgot") {
      if (!email.trim()) {
        setLocalError("Please enter your registered email address.");
        return;
      }
      setSubmitting(true);
      try {
        const ok = await sendPasswordReset(email.trim());
        if (ok) {
          setResetSentEmail(email.trim());
        }
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!email.trim() || !password) {
      setLocalError("Please enter both email and password.");
      return;
    }

    if (mode === "signup" && password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      let success = false;
      if (mode === "signup") {
        success = await signUpWithEmail(email.trim(), password, name.trim() || undefined);
      } else {
        success = await signInWithEmail(email.trim(), password);
      }

      if (success) {
        // Wait a tick for auth state to register or inspect current user
        setTimeout(() => {
          if (user) {
            handlePostAuthRouting(user.uid);
          } else {
            // New user signed up or signed in
            if (mode === "signup") {
              onNavigateOnboarding();
            } else {
              onNavigateApp();
            }
          }
        }, 350);
      }
    } catch {
      // Caught via authContext error
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLocalError(null);
    clearError();
    setSubmitting(true);
    try {
      const success = await signInWithGoogle();
      if (success) {
        setTimeout(() => {
          if (user) {
            handlePostAuthRouting(user.uid);
          } else {
            onNavigateOnboarding();
          }
        }, 400);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuestAuth = async () => {
    setLocalError(null);
    clearError();
    setSubmitting(true);
    try {
      const success = await signInAsGuest();
      if (success) {
        onNavigateOnboarding();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const displayedError = localError || authError;

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-[130px] rounded-full" />
        <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] bg-cyan-500/10 blur-[130px] rounded-full" />
      </div>

      {/* Back button */}
      <div className="w-full max-w-md mb-6 relative z-10 flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Landing</span>
        </button>

        <span className="text-[11px] font-mono text-slate-500">Secure Cloud Auth</span>
      </div>

      {/* Main Auth Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative z-10"
      >
        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-4">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {mode === "signin" && "Welcome Back"}
            {mode === "signup" && "Create Student Account"}
            {mode === "forgot" && "Reset Your Password"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {mode === "signin" && "Sign in to access your college timetable and copilot."}
            {mode === "signup" && "Set up your academic dashboard in seconds."}
            {mode === "forgot" && "Enter your email to receive a password reset link."}
          </p>
        </div>

        {/* Mode Toggle (Sign In / Sign Up) */}
        {mode !== "forgot" && (
          <div className="grid grid-cols-2 p-1 bg-white/[0.04] border border-white/[0.06] rounded-xl mb-6 text-xs">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                clearError();
                setLocalError(null);
              }}
              className={`py-2 rounded-lg font-medium transition-all cursor-pointer ${
                mode === "signin"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                clearError();
                setLocalError(null);
              }}
              className={`py-2 rounded-lg font-medium transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Success Message for Reset */}
        {resetSentEmail && mode === "forgot" && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Reset Email Sent</span>
            </div>
            <p className="mt-1 text-slate-300 text-[11px]">
              We've dispatched a recovery link to <strong>{resetSentEmail}</strong>. Check your inbox and follow instructions.
            </p>
          </div>
        )}

        {/* Error Notification */}
        {displayedError && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{displayedError}</span>
          </div>
        )}

        {/* Google One-Click Button */}
        {mode !== "forgot" && (
          <>
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] text-white text-xs font-medium transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="h-px bg-white/[0.08] flex-1" />
              <span className="text-[11px] text-slate-500 uppercase tracking-wider">or with email</span>
              <div className="h-px bg-white/[0.08] flex-1" />
            </div>
          </>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
                <UserIcon className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {mode !== "forgot" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">Password</label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      clearError();
                      setLocalError(null);
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/60 border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-semibold tracking-wide transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Please wait...</span>
              </>
            ) : (
              <>
                <span>
                  {mode === "signin" && "Sign In to Copilot"}
                  {mode === "signup" && "Create Account"}
                  {mode === "forgot" && "Send Reset Link"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Guest access option */}
        {mode !== "forgot" && (
          <div className="mt-4 pt-4 border-t border-white/[0.06] text-center">
            <button
              type="button"
              onClick={handleGuestAuth}
              disabled={submitting}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Or continue in <span className="text-indigo-400 underline font-medium">Guest Demo Mode</span>
            </button>
          </div>
        )}

        {/* Back to sign in if in forgot mode */}
        {mode === "forgot" && (
          <div className="mt-5 pt-4 border-t border-white/[0.06] text-center">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setResetSentEmail(null);
                clearError();
                setLocalError(null);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
