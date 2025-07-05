
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
}

export const AuthInput = ({ 
  id, 
  label, 
  type, 
  value, 
  onChange, 
  required = false, 
  minLength 
}: AuthInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
      />
    </div>
  );
};
