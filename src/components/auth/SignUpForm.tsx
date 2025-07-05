
import { useAuth } from '@/hooks/useAuth';
import { useAuthForm } from '@/hooks/useAuthForm';
import { toast } from '@/hooks/use-toast';
import { AuthInput } from './AuthInput';
import { AuthButton } from './AuthButton';

export const SignUpForm = () => {
  const { signUp } = useAuth();
  const { email, setEmail, password, setPassword, fullName, setFullName, loading, setLoading } = useAuthForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast({
          title: "Sign Up Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Account created! Please check your email to verify your account."
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
        id="fullName"
        label="Full Name"
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
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
        minLength={6}
      />
      <AuthButton loading={loading} loadingText="Loading...">
        Sign Up
      </AuthButton>
    </form>
  );
};
