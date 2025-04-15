
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

// Set auto logout timeout to 30 minutes (in milliseconds)
const AUTO_LOGOUT_TIME = 30 * 60 * 1000;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the AuthProvider component as a proper React functional component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Handler for user activity
  const updateLastActivity = () => {
    setLastActivity(Date.now());
    localStorage.setItem("caffinity-last-activity", Date.now().toString());
  };

  useEffect(() => {
    // Set up activity listeners
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => {
      window.addEventListener(event, updateLastActivity);
    });

    // Clean up activity listeners
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateLastActivity);
      });
    };
  }, []);

  // Auto logout effect
  useEffect(() => {
    // Check for inactivity every minute
    const checkInactivity = setInterval(() => {
      const lastActivityTime = Number(localStorage.getItem("caffinity-last-activity")) || lastActivity;
      const currentTime = Date.now();
      
      if (currentTime - lastActivityTime > AUTO_LOGOUT_TIME && user) {
        console.log("Auto logging out due to inactivity");
        signOut();
      }
    }, 60000); // Check every minute

    return () => {
      clearInterval(checkInactivity);
    };
  }, [user, lastActivity]);

  // Function declarations
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
          }
        }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("caffinity-current-user");
    localStorage.removeItem("caffinity-last-activity");
  };

  // Auth state management
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Store current user ID in localStorage for data isolation
        if (currentSession?.user) {
          localStorage.setItem("caffinity-current-user", currentSession.user.id);
          // Initialize last activity time
          updateLastActivity();
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem("caffinity-current-user");
          localStorage.removeItem("caffinity-last-activity");
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Store current user ID in localStorage for data isolation
        if (currentSession?.user) {
          localStorage.setItem("caffinity-current-user", currentSession.user.id);
          // Initialize last activity time
          updateLastActivity();
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Clean up subscription on unmount
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
