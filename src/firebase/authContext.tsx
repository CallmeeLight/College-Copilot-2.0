import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInAnonymously, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  AuthError
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, googleAuthProvider, db, testFirestoreConnection } from "./firebaseConfig";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isFirebaseConnected: boolean;
  signInWithGoogle: () => Promise<boolean>;
  signInAsGuest: () => Promise<boolean>;
  signInWithEmail: (email: string, pass: string) => Promise<boolean>;
  signUpWithEmail: (email: string, pass: string, displayName?: string) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);

  useEffect(() => {
    // Check initial Firestore connectivity
    testFirestoreConnection()
      .then((connected) => setIsFirebaseConnected(connected))
      .catch(() => setIsFirebaseConnected(false));

    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // Sync or initialize user profile document in Firestore
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || (firebaseUser.isAnonymous ? "Guest Scholar" : "College Student"),
              email: firebaseUser.email || (firebaseUser.isAnonymous ? "guest@college.edu" : ""),
              photoURL: firebaseUser.photoURL || "",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          } else {
            await setDoc(userRef, {
              updatedAt: new Date().toISOString(),
              ...(firebaseUser.displayName ? { displayName: firebaseUser.displayName } : {}),
              ...(firebaseUser.email ? { email: firebaseUser.email } : {}),
              ...(firebaseUser.photoURL ? { photoURL: firebaseUser.photoURL } : {}),
            }, { merge: true });
          }
        } catch (err) {
          console.warn("Could not sync user profile to Firestore:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleAuthProvider);
      return !!cred.user;
    } catch (err: unknown) {
      const authErr = err as AuthError;
      
      // User closed the popup, dismissed it, or triggered a new request.
      // These are benign user cancellation flows, NOT application errors.
      if (
        authErr.code === "auth/popup-closed-by-user" || 
        authErr.code === "auth/cancelled-popup-request"
      ) {
        console.info("Google sign-in popup was dismissed by the user.");
        return false;
      }
      
      if (authErr.code === "auth/popup-blocked") {
        console.warn("Google sign-in popup was blocked by browser:", authErr.message);
        setError("Sign-in popup was blocked by your browser. Please allow popups for this site, or use Guest mode / Email sign-in.");
        return false;
      }

      if (authErr.code === "auth/unauthorized-domain") {
        console.warn("Firebase Auth unauthorized domain:", authErr.message);
        setError("This site domain is not authorized for Firebase sign-in. In Firebase Console, add this hostname under Authentication > Settings > Authorized domains, then try again.");
        return false;
      }

      if (authErr.code === "auth/admin-restricted-operation" || authErr.code === "auth/operation-not-allowed") {
        console.warn("Google sign-in is not enabled in Firebase:", authErr.message);
        setError("Google sign-in is disabled for this Firebase project. Enable the Google provider under Firebase Console > Authentication > Sign-in method.");
        return false;
      }

      console.warn("Google sign-in could not be completed:", authErr.message || err);
      setError(authErr.message || "Failed to sign in with Google.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signInAsGuest = async (): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      const cred = await signInAnonymously(auth);
      return !!cred.user;
    } catch (err: unknown) {
      console.warn("Guest sign-in issue:", err);
      const authErr = err as AuthError;
      if (authErr.code === "auth/admin-restricted-operation" || authErr.code === "auth/operation-not-allowed") {
        setError("Guest sign-in is disabled for this Firebase project. Enable the Anonymous provider under Firebase Console > Authentication > Sign-in method.");
      } else {
        setError(authErr.message || "Failed to start guest session.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      return !!cred.user;
    } catch (err: unknown) {
      const authErr = err as AuthError;
      if (authErr.code === "auth/user-not-found" || authErr.code === "auth/wrong-password" || authErr.code === "auth/invalid-credential") {
        setError("Invalid email or password. If you don't have an account, please sign up.");
      } else if (authErr.code === "auth/invalid-email") {
        setError("Please provide a valid email address.");
      } else if (authErr.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else if (authErr.code === "auth/admin-restricted-operation" || authErr.code === "auth/operation-not-allowed") {
        setError("Email and password sign-in is disabled for this Firebase project. Enable the Email/Password provider under Firebase Console > Authentication > Sign-in method.");
      } else {
        console.warn("Email sign-in issue:", err);
        setError(authErr.message || "Failed to sign in.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName?: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (displayName && cred.user) {
        await updateProfile(cred.user, { displayName });
        const userRef = doc(db, "users", cred.user.uid);
        await setDoc(userRef, {
          uid: cred.user.uid,
          displayName,
          email: cred.user.email || email,
          photoURL: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }
      return !!cred.user;
    } catch (err: unknown) {
      const authErr = err as AuthError;
      if (authErr.code === "auth/email-already-in-use") {
        setError("An account with this email already exists. Please sign in instead.");
      } else if (authErr.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (authErr.code === "auth/invalid-email") {
        setError("Please provide a valid email address.");
      } else if (authErr.code === "auth/admin-restricted-operation" || authErr.code === "auth/operation-not-allowed") {
        setError("Email and password sign-in is disabled for this Firebase project. Enable the Email/Password provider under Firebase Console > Authentication > Sign-in method.");
      } else {
        console.warn("Email sign-up issue:", err);
        setError(authErr.message || "Failed to create account.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return true;
    } catch (err: unknown) {
      const authErr = err as AuthError;
      if (authErr.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else if (authErr.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (authErr.code === "auth/admin-restricted-operation" || authErr.code === "auth/operation-not-allowed") {
        console.warn("Email/password authentication is not enabled in Firebase:", authErr.message);
        setError("Email and password sign-in is disabled for this Firebase project. Enable the Email/Password provider under Firebase Console > Authentication > Sign-in method.");
      } else {
        console.warn("Password reset error:", err);
        setError(authErr.message || "Failed to send password reset email.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err: unknown) {
      const authErr = err as AuthError;
      setError(authErr.message || "Failed to sign out.");
    }
  };

  const clearError = () => setError(null);

  const value = useMemo(() => ({
    user,
    loading,
    error,
    isFirebaseConnected,
    signInWithGoogle,
    signInAsGuest,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    logout,
    clearError,
  }), [user, loading, error, isFirebaseConnected]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
