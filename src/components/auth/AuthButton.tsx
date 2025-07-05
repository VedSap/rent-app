
import { Button } from '@/components/ui/button';

interface AuthButtonProps {
  type?: 'button' | 'submit';
  loading: boolean;
  loadingText: string;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export const AuthButton = ({ 
  type = 'submit', 
  loading, 
  loadingText, 
  children, 
  onClick,
  variant = 'default'
}: AuthButtonProps) => {
  return (
    <Button 
      type={type} 
      className="w-full" 
      disabled={loading}
      onClick={onClick}
      variant={variant}
    >
      {loading ? loadingText : children}
    </Button>
  );
};
