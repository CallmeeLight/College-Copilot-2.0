import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  X, 
  Cloud, 
  AlertCircle, 
  LogOut, 
  User as UserIcon, 
  ShieldCheck, 
  Database,
  CheckCircle2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight
} from "lucide-react";
import { useAuth } from "../firebase/authContext";
import { PersonPortrait } from "./PersonPortrait";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { 
    user, 
    loading: authLoading, 
    error: authError, 
    signInWithGoogle, 
    signInAsGuest, 
    signInWithEmail,
    signUpWithEmail,
    logout,
    clearError 
  } = useAuth();

  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    clearError();
    setLocalError(null);
    setEmail("");
    setPassword("");
    setName("");
    onClose();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email || !password) {
      setLocalError("Please fill in both email and password.");
      return;
    }

    if (authMode === "signup" && password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }

    setSubmitting(true);
    try {
      let success = false;
      if (authMode === "signup") {
        success = await signUpWithEmail(email, password, name.trim() || undefined);
      } else {
        success = await signInWithEmail(email, password);
      }
      if (success) {
        handleClose();
        onLoginSuccess?.();
      }
    } catch {
      // Error is caught and set in authContext or local state
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    clearError();
    try {
      const success = await signInWithGoogle();
      if (success) {
        handleClose();
        onLoginSuccess?.();
      }
    } catch {
      // Handled in context
    }
  };

  const handleGuestSignIn = async () => {
    setLocalError(null);
    clearError();
    try {
      const success = await signInAsGuest();
      if (success) {
        handleClose();
        onLoginSuccess?.();
      }
    } catch {
      // Handled in context
    }
  };

  const displayError = localError || authError;
  const isLoading = authLoading || submitting;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/50 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-md my-auto max-h-[calc(100vh-2rem)] overflow-y-auto bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-2xl p-5 sm:p-6 sm:p-7 text-left animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 rounded-t-3xl" />

        {/* Close Button */}
        <button
          id="close-auth-modal-btn"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {user ? (
          /* Signed In View */
          <div className="space-y-5 pt-1">
            <div className="flex items-center gap-3.5">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || "Avatar"} 
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm"
                />
              ) : (
                <PersonPortrait size={52} className="border-2 border-indigo-100 shadow-sm" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {user.displayName || (user.isAnonymous ? "Guest Scholar" : "College Student")}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5 truncate max-w-[240px]">
                  {user.email || (user.isAnonymous ? "Anonymous Guest Session" : "Signed In")}
                </p>
              </div>
            </div>

            {/* Cloud Sync Status Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span>Cloud Database</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Connected
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Active Cloud Synchronization:</span>
                </div>
                <ul className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pl-5 list-disc">
                  <li>Assignments & Tasks</li>
                  <li>Lecture Notes & OCR</li>
                  <li>Course Attendance</li>
                  <li>Timetable Schedule</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2.5">
              <motion.button
                id="sign-out-btn"
                type="button"
                onClick={async () => {
                  await logout();
                  handleClose();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={handleClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Done
              </motion.button>
            </div>
          </div>
        ) : (
          /* Sign In & Sign Up View */
          <div className="space-y-4 pt-1">
            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center mb-2.5">
                <PersonPortrait size={48} className="border-2 border-indigo-100 shadow-md" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {authMode === "signin" ? "Sign In to College Copilot" : "Create Student Account"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 max-w-xs mx-auto">
                {authMode === "signin"
                  ? "Access your saved notes, homework tasks, and timetable"
                  : "Sync all your study data and timetable across devices"}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="relative grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                id="auth-tab-signin"
                onClick={() => {
                  setAuthMode("signin");
                  clearError();
                  setLocalError(null);
                }}
                className={`relative py-1.5 rounded-lg transition-colors cursor-pointer select-none ${
                  authMode === "signin"
                    ? "text-slate-900 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {authMode === "signin" && (
                  <motion.div
                    layoutId="auth-tab-sliding-pill"
                    className="absolute inset-0 rounded-lg bg-white shadow-sm border border-slate-200/80 pointer-events-none"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 32,
                      mass: 0.8,
                    }}
                  />
                )}
                <span className="relative z-10">Sign In</span>
              </button>
              <button
                type="button"
                id="auth-tab-signup"
                onClick={() => {
                  setAuthMode("signup");
                  clearError();
                  setLocalError(null);
                }}
                className={`relative py-1.5 rounded-lg transition-colors cursor-pointer select-none ${
                  authMode === "signup"
                    ? "text-slate-900 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {authMode === "signup" && (
                  <motion.div
                    layoutId="auth-tab-sliding-pill"
                    className="absolute inset-0 rounded-lg bg-white shadow-sm border border-slate-200/80 pointer-events-none"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 32,
                      mass: 0.8,
                    }}
                  />
                )}
                <span className="relative z-10">Sign Up</span>
              </button>
            </div>

            {/* Error Message */}
            {displayError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                <div className="flex-1">
                  <p className="font-semibold">Authentication Notice</p>
                  <p className="text-[11px] mt-0.5">{displayError}</p>
                </div>
              </div>
            )}

            {/* Email & Password Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3">
              {authMode === "signup" && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-name-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Kumar"
                      className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={authMode === "signup" ? "At least 6 characters" : "Enter your password"}
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                id="auth-submit-btn"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-colors cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{authMode === "signin" ? "Sign In" : "Create Account"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-2.5 text-[11px] text-slate-400 uppercase tracking-wider font-medium absolute">
                or continue with
              </span>
            </div>

            {/* Social / Alternative Auth Buttons */}
            <div className="space-y-2 pt-1">
              {/* Continue with Google */}
              <motion.button
                type="button"
                id="google-sign-in-btn"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
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
              </motion.button>

              {/* Continue with Guest */}
              <motion.button
                type="button"
                id="guest-sign-in-btn"
                onClick={handleGuestSignIn}
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Continue with Guest</span>
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
