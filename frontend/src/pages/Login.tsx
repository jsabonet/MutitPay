import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Forgot password state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Firebase error handling
      switch (err.code) {
        case 'auth/user-not-found':
          setError('Usuário não encontrado');
          break;
        case 'auth/wrong-password':
          setError('Senha incorreta');
          break;
        case 'auth/invalid-email':
          setError('Email inválido');
          break;
        case 'auth/user-disabled':
          setError('Conta desabilitada');
          break;
        case 'auth/too-many-requests':
          setError('Muitas tentativas. Tente novamente mais tarde');
          break;
        default:
          setError('Erro ao fazer login. Tente novamente');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForgot = () => {
    setForgotEmail(email || '');
    setForgotError('');
    setForgotSuccess('');
    setIsForgotOpen(true);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    if (!forgotEmail) {
      setForgotError('Informe o email para recuperar a senha.');
      return;
    }
    try {
      setForgotLoading(true);
      await resetPassword(forgotEmail);
      setForgotSuccess('Se o email estiver cadastrado, enviamos um link para redefinir sua senha. Verifique sua caixa de entrada.');
    } catch (err: any) {
      console.error('Reset password error:', err);
      switch (err?.code) {
        case 'auth/invalid-email':
          setForgotError('Email inválido.');
          break;
        case 'auth/user-not-found':
          // Evitar revelação de existência de conta, mas ainda dar feedback útil
          setForgotSuccess('Se o email estiver cadastrado, enviamos um link para redefinir sua senha. Verifique sua caixa de entrada.');
          break;
        case 'auth/too-many-requests':
          setForgotError('Muitas tentativas. Tente novamente mais tarde.');
          break;
        default:
          setForgotError('Não foi possível enviar o email de recuperação. Tente novamente.');
      }
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img 
            src="/mutit_pay_logo.png" 
            alt="MUTIT PAY - Boutique Premium" 
            className="mx-auto h-16 w-auto"
          />
          <h2 className="mt-8 text-2xl font-semibold text-gray-900">
            Bem-vindo de volta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Entre na sua conta para continuar
          </p>
        </div>

        <Card className="border border-gray-200 bg-white">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-center text-xl font-medium text-gray-900">Entrar</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Acesse sua conta MUTIT PAY
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="text-right">
                  <button type="button" onClick={handleOpenForgot} className="text-xs text-[#0054A6] hover:text-[#003d7a] transition-colors">
                    Esqueceu a senha?
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-[#0054A6] hover:bg-[#003d7a] text-white transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Entrando...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <LogIn className="w-4 h-4 mr-2" />
                      Entrar
                    </div>
                  )}
                </Button>
                <div className="relative flex items-center justify-center">
                  <span className="h-px bg-gray-200 w-full" />
                  <span className="absolute px-2 text-[11px] uppercase tracking-wide bg-white text-gray-400">OU</span>
                </div>
                <GoogleAuthButton
                  disabled={loading}
                  mode="login"
                  onAuth={async () => {
                    setError('');
                    try {
                      await loginWithGoogle();
                      navigate('/');
                    } catch (err: any) {
                      console.error('Google login error:', err);
                      if (err?.code === 'auth/popup-closed-by-user') {
                        setError('Janela de login fechada antes de concluir.');
                      } else if (err?.code === 'auth/cancelled-popup-request') {
                        setError('Outra tentativa de login já estava em andamento.');
                      } else {
                        setError('Não foi possível entrar com Google. Tente novamente.');
                      }
                    }
                  }}
                />
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-[#0054A6] hover:text-[#003d7a] transition-colors"
                >
                  Registre-se aqui
                </Link>
              </p>
              <Link 
                to="/" 
                className="mt-2 inline-block text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                ← Voltar à loja
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    {/* Forgot Password Dialog */}
    <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Recuperar senha</DialogTitle>
          <DialogDescription>
            Informe seu email para receber um link de redefinição de senha.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleResetPassword} className="space-y-4">
          {forgotError && (
            <Alert variant="destructive">
              <AlertDescription>{forgotError}</AlertDescription>
            </Alert>
          )}
          {forgotSuccess && (
            <Alert>
              <AlertDescription>{forgotSuccess}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="forgot-email">Email</Label>
            <Input
              id="forgot-email"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={forgotLoading}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsForgotOpen(false)} disabled={forgotLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={forgotLoading}>
              {forgotLoading ? 'Enviando…' : 'Enviar link'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default Login;
