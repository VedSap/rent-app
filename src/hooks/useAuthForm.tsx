
import { useState } from 'react';

export const useAuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setLoading(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    loading,
    setLoading,
    resetForm
  };
};
