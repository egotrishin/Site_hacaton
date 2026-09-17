import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { endDemoSession, loadDemoProfile, loadDemoSession, saveDemoProfile, startDemoSession, type DemoProfile } from '@/lib/auth-data';

type RegistrationData = {
  name: string;
  email: string;
};

type AuthContextValue = {
  profile: DemoProfile | null;
  isSignedIn: boolean;
  register: (data: RegistrationData) => void;
  signIn: () => boolean;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<DemoProfile | null>(() => loadDemoProfile());
  const [isSignedIn, setIsSignedIn] = useState(() => loadDemoSession());

  const value = useMemo<AuthContextValue>(() => ({
    profile,
    isSignedIn,
    register(data) {
      const nextProfile = saveDemoProfile(data);
      setProfile(nextProfile);
      startDemoSession();
      setIsSignedIn(true);
    },
    signIn() {
      const savedProfile = loadDemoProfile();
      if (!savedProfile || !startDemoSession()) return false;
      setProfile(savedProfile);
      setIsSignedIn(true);
      return true;
    },
    signOut() {
      endDemoSession();
      setIsSignedIn(false);
    },
  }), [isSignedIn, profile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
