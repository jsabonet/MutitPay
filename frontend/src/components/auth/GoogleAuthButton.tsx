import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface GoogleAuthButtonProps {
  onAuth: () => Promise<void>;
  disabled?: boolean;
  mode?: 'login' | 'register';
  className?: string;
}

/**
 * Reusable Google authentication button (login or register flavor)
 */
export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onAuth,
  disabled,
  mode = 'login',
  className = ''
}) => {
  const [loading, setLoading] = useState(false);

  const label = mode === 'login' ? 'Entrar com Google' : 'Continuar com Google';

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onAuth();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={`w-full h-12 border-gray-200 ${className}`}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 mr-3 animate-spin text-gray-600" />
          Conectando...
        </>
      ) : (
        <>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="h-5 w-5 mr-3"
          />
          {label}
        </>
      )}
    </Button>
  );
};

export default GoogleAuthButton;
