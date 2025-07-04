
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        console.log('Auth callback params:', { tokenHash, type, accessToken, refreshToken });

        if (tokenHash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as any,
          });

          if (error) {
            console.error('Auth verification error:', error);
            setMessage('Authentication failed. Please try again.');
            toast({
              title: "Authentication Error",
              description: error.message,
              variant: "destructive"
            });
            setTimeout(() => navigate('/'), 3000);
            return;
          }

          // Handle different auth types
          switch (type) {
            case 'signup':
              setMessage('Account confirmed successfully! Welcome to RentApp.');
              toast({
                title: "Account Confirmed",
                description: "Your account has been verified successfully!"
              });
              break;
            case 'recovery':
              setMessage('Password reset confirmed. You can now set a new password.');
              toast({
                title: "Password Reset",
                description: "You can now set a new password."
              });
              break;
            case 'email_change':
              setMessage('Email change confirmed successfully.');
              toast({
                title: "Email Changed",
                description: "Your email has been updated successfully."
              });
              break;
            case 'invite':
              setMessage('Invitation accepted! Welcome to RentApp.');
              toast({
                title: "Invitation Accepted",
                description: "Welcome to RentApp!"
              });
              break;
            default:
              setMessage('Authentication successful!');
              toast({
                title: "Success",
                description: "Authentication completed successfully."
              });
          }

          setTimeout(() => navigate('/'), 2000);
        } else if (accessToken && refreshToken) {
          // Handle magic link with tokens
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Session error:', error);
            setMessage('Authentication failed. Please try again.');
            toast({
              title: "Authentication Error",
              description: error.message,
              variant: "destructive"
            });
          } else {
            setMessage('Successfully signed in with magic link!');
            toast({
              title: "Success",
              description: "Successfully signed in!"
            });
            setTimeout(() => navigate('/'), 1000);
          }
        } else {
          setMessage('Invalid authentication link. Redirecting...');
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setMessage('Authentication failed. Please try again.');
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        setTimeout(() => navigate('/'), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            🏠 RentApp
          </CardTitle>
          <CardDescription>
            {loading ? 'Processing...' : 'Authentication Complete'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            {loading && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            )}
            <p className="text-sm text-gray-600">{message}</p>
            {!loading && (
              <p className="text-xs text-gray-500">
                You will be redirected automatically...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
