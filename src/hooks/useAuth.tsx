
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Auth: Setting up authentication');
    let mounted = true;
    let authTimeout: NodeJS.Timeout;

    // Set a timeout to prevent infinite loading (30 seconds)
    const setLoadingTimeout = () => {
      authTimeout = setTimeout(() => {
        if (mounted) {
          console.log('Auth: Loading timeout reached, setting loading to false');
          setLoading(false);
        }
      }, 30000);
    };

    const clearLoadingTimeout = () => {
      if (authTimeout) {
        clearTimeout(authTimeout);
      }
    };

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Auth: Getting initial session');
        setLoadingTimeout();
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        clearLoadingTimeout();
        
        if (error) {
          console.error('Auth: Error getting session:', error);
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }

        console.log('Auth: Initial session retrieved:', session?.user?.id || 'no session');
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      } catch (error) {
        console.error('Auth: Error in getInitialSession:', error);
        if (mounted) {
          clearLoadingTimeout();
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth: State changed:', event, session?.user?.id || 'no session');
        
        if (!mounted) return;
        
        // Clear any existing timeout when auth state changes
        clearLoadingTimeout();
        
        // Simple auth state update without complex profile verification
        setSession(session);
        setUser(session?.user || null);
        
        // Only set loading to false if we're not in the middle of a sign-in process
        if (event !== 'SIGNED_IN' || session) {
          setLoading(false);
        }
      }
    );

    return () => {
      console.log('Auth: Cleaning up authentication');
      mounted = false;
      clearLoadingTimeout();
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('Auth: Attempting sign up for:', email);
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName
          }
        }
      });
      
      if (!error) {
        console.log('Auth: Sign up successful');
      } else {
        console.error('Auth: Sign up error:', error);
      }
      
      return { error };
    } catch (err) {
      console.error('Auth: Sign up exception:', err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Auth: Attempting sign in for:', email);
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (!error) {
        console.log('Auth: Sign in successful');
      } else {
        console.error('Auth: Sign in error:', error);
        setLoading(false); // Set loading to false on error
      }
      
      return { error };
    } catch (err) {
      console.error('Auth: Sign in exception:', err);
      setLoading(false);
      return { error: err };
    }
  };

  const signOut = async () => {
    console.log('Auth: Signing out');
    setLoading(true);
    
    try {
      await supabase.auth.signOut();
      console.log('Auth: Sign out successful');
    } catch (error) {
      console.error('Auth: Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
