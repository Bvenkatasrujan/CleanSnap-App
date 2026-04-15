import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { getUserRole } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const userRole = await getUserRole(session.user.id);
          setRole(userRole);
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session?.user) {
            setUser(session.user);
            const userRole = await getUserRole(session.user.id);
            setRole(userRole);
          } else {
            setUser(null);
            setRole(null);
          }
        } catch (err) {
          console.error('Auth state change error:', err);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, role, loading };
};