
import { useAuth } from '@/hooks/useAuth';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { toast } from '@/hooks/use-toast';
import { AuthInput } from './AuthInput';
import { AuthButton } from './AuthButton';

interface LoginFormProps {
  onForgotPassword: () => void;
}

export const LoginForm = ({ onForgotPassword }: LoginFormProps) => {
  const { signIn } = useAuth();
  const { email, setEmail, password, setPassword, loading, setLoading } = useAuthForm();
  const { checkEmailExists } = useEmailValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const emailExists = await checkEmailExists(email);
      
      if (!emailExists) {
        toast({
          title: "Login Error",
          description: "Credentials not matched. Please check your email and try again.",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: "Login Error",
          description: "Credentials not matched. Please check your email and password.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AuthInput
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <AuthInput
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <AuthButton loading={loading} loadingText="Loading...">
        Sign In
      </AuthButton>
      
      <div className="mt-2 text-center">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-primary hover:underline"
        >
          Forgot password?
        </button>
      </div>
    </form>
  );
};
