
import { useState } from 'react';
import { AuthCard } from './AuthCard';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export const AuthFormContainer = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const getDescription = () => {
    if (isForgotPassword) return 'Reset your password';
    return isLogin ? 'Sign in to your account' : 'Create your account';
  };

  const getTitle = () => {
    if (isForgotPassword) return 'Forgot Password';
    return isLogin ? 'Sign In' : 'Sign Up';
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setIsLogin(true);
  };

  const renderForm = () => {
    if (isForgotPassword) {
      return <ForgotPasswordForm onBackToLogin={handleBackToLogin} />;
    }

    if (isLogin) {
      return <LoginForm onForgotPassword={handleForgotPassword} />;
    }

    return <SignUpForm />;
  };

  return (
    <AuthCard title={getTitle()} description={getDescription()}>
      {renderForm()}
      
      {!isForgotPassword && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      )}
    </AuthCard>
  );
};
