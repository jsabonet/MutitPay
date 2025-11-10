import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  LogOut,
  Menu,
  Home,
  FileText,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const getUserInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return currentUser?.email?.[0]?.toUpperCase() || 'U';
  };

  interface NavItem {
    name: string;
    href: string;
    icon: any;
    current: boolean;
    badge?: string;
  }

  const navigation: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/admin/dashboard'
    },
    {
      name: 'Produtos',
      href: '/admin/products',
      icon: Package,
      current: location.pathname.startsWith('/admin/products')
    },
    {
      name: 'Avaliações',
      href: '/admin/reviews',
      icon: Star,
      current: location.pathname.startsWith('/admin/reviews'),
    },
    {
      name: 'Pedidos',
      href: '/admin/pedidos',
      icon: ShoppingCart,
      current: location.pathname === '/admin/pedidos'
    },
    {
      name: 'Clientes',
      href: '/admin/clientes',
      icon: Users,
      current: location.pathname === '/admin/clientes'
    },
    // Promotions link can be added later to the sidebar if desired
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background/95 backdrop-blur px-6 pb-4 border-r border-border">
          <div className="flex h-16 shrink-0 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gradient-gold">MUTIT PAY</span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all
                          ${item.current
                            ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md'
                            : 'text-foreground hover:bg-accent/50'
                          }
                        `}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 ${
                            item.current ? 'text-white' : 'text-muted-foreground group-hover:text-accent'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="flex-1">{item.name}</span>
                        {/* badge removido conforme pedido */}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <Link
                  to="/admin/configuracoes"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-foreground hover:bg-accent/50 transition-all"
                >
                  <Settings
                    className="h-6 w-6 shrink-0 text-muted-foreground group-hover:text-accent"
                    aria-hidden="true"
                  />
                  Configurações
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background/95 backdrop-blur px-4 shadow-sm sm:gap-x-6 sm:px-6">
          <Button variant="ghost" size="sm" className="-m-2.5 p-2.5 text-foreground" onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
            <span className="sr-only">Abrir sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Link to="/" className="flex items-center space-x-2">
                <Home className="h-6 w-6 text-primary" />
                <span className="font-bold text-gradient-gold">MUTIT PAY</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} aria-hidden />
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-background/95 backdrop-blur shadow-lg p-4 overflow-y-auto border-r border-border">
              <div className="flex items-center justify-between mb-4">
                <Link to="/" className="flex items-center space-x-2">
                  <Home className="h-6 w-6 text-primary" />
                  <span className="font-bold text-gradient-gold">MUTIT PAY</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Fechar menu">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav>
                <ul className="space-y-2">
                  {navigation.map(item => (
                    <li key={item.name}>
                      <Link to={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-2 py-2 rounded-md ${item.current ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent hover:text-accent-foreground'}`}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                        {item.badge && <span className="ml-auto inline-flex items-center rounded-md bg-accent/20 px-2 py-1 text-xs font-medium text-accent">{item.badge}</span>}
                      </Link>
                    </li>
                  ))}
                  <li className="mt-4">
                    <Link to="/admin/configuracoes" className="flex items-center gap-3 px-2 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                      <Settings className="h-5 w-5" />
                      <span>Configurações</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </aside>
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold leading-6 text-gray-900">
                Área Administrativa
              </h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser?.photoURL || ''} alt={currentUser?.displayName || 'Admin'} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser?.displayName || 'Administrador'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/" className="flex items-center w-full">
                      <Home className="mr-2 h-4 w-4" />
                      <span>Ver Site</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full overflow-x-auto">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
