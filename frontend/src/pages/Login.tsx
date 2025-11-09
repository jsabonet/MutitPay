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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Premium Background with Brand Colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Animated Background Elements with Brand Colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/30 to-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-primary/30 to-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-accent/15 to-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-premium rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gradient-gold bg-clip-text text-transparent mb-3">
            MUTIT PAY
          </h2>
          <p className="text-lg text-white font-medium">
            Acesso Premium
          </p>
          <p className="mt-2 text-sm text-white/80">
            Entre com suas credenciais para acessar o sistema
          </p>
        </div>

        <Card className="glass-card border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-white">
              Entrar na Conta
            </CardTitle>
            <CardDescription className="text-white/80 text-base">
              Digite suas credenciais para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-100 backdrop-blur-sm">
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <Label htmlFor="email" className="text-white font-medium text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  disabled={loading}
                  className="glass-card bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/15 focus:border-accent/50 h-12 text-base"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-white font-medium text-sm">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="glass-card bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/15 focus:border-accent/50 h-12 text-base pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
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
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-accent hover:text-white transition-colors font-medium"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-premium hover:opacity-90 text-white font-semibold text-base shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Entrando...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <LogIn className="w-5 h-5 mr-3" />
                      Entrar na Conta
                    </div>
                  )}
                </Button>
                
                <div className="relative flex items-center justify-center my-6">
                  <span className="h-px bg-white/20 w-full" />
                  <span className="absolute px-4 text-xs uppercase tracking-wider bg-transparent text-white/80 font-medium">
                    OU
                  </span>
                </div>
                
                <div className="google-auth-premium">
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
              </div>
            </form>

            <div className="mt-8 text-center space-y-4">
              <p className="text-sm text-white/80">
                Não tem uma conta?{' '}
                <Link 
                  to="/register" 
                  className="font-semibold text-accent hover:text-white transition-colors underline decoration-accent/50 hover:decoration-white/80"
                >
                  Registre-se aqui
                </Link>
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center text-sm text-white/80 hover:text-white transition-colors group"
              >
                <span className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-200">←</span>
                Voltar à loja
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
