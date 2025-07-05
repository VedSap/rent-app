
import { supabase } from '@/integrations/supabase/client';

export const useEmailValidation = () => {
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking email:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error in checkEmailExists:', error);
      return false;
    }
  };

  return { checkEmailExists };
};
