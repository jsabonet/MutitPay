import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatPrice";
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProductStats } from '@/hooks/useApi';
import { customersApi } from '@/lib/api/customers';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  BarChart3,
  FileText,
  Shield,
  FolderOpen
} from "lucide-react";

const Admin = () => {
  const adminSections = [
    {
      title: "Dashboard",
      description: "Visão geral do desempenho da loja",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
      color: "text-primary"
    },
    {
      title: "Avaliações",
      description: "Modere avaliações de produtos",
      icon: FileText,
      href: "/admin/reviews",
      color: "text-accent",
    },
    {
      title: "Produtos",
      description: "Gerencie o catálogo de produtos",
      icon: Package,
      href: "/admin/products",
      color: "text-primary"
    },
    {
      title: "Categorias",
      description: "Organize produtos por categorias",
      icon: FolderOpen,
      href: "/admin/categories",
      color: "text-primary"
    },
    {
      title: "Pedidos",
      description: "Acompanhe e gerencie pedidos",
      icon: ShoppingCart,
      href: "/admin/pedidos",
      color: "text-accent"
    },
    {
      title: "Clientes",
      description: "Gerencie informações dos clientes",
      icon: Users,
      href: "/admin/clientes",
      color: "text-primary"
    },
    {
      title: "Configurações",
      description: "Configure a loja e sistema",
      icon: Settings,
      href: "/admin/configuracoes",
      color: "text-muted-foreground"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-gradient-gold">MUTIT PAY</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" className="border-primary/30 hover:border-accent">
                  Ver Site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Área <span className="text-gradient-gold">Administrativa</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bem-vindo ao painel administrativo da MUTIT PAY. 
            Gerencie sua loja de forma eficiente e profissional.
          </p>
        </div>

        {/* Quick Stats */}
        <QuickStats />

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => (
            <Card key={section.href} className="hover:shadow-xl hover:border-accent/50 transition-all cursor-pointer bg-card/50 backdrop-blur">
              <Link to={section.href}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <section.icon className={`h-8 w-8 ${section.color}`} />
                    <div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {section.description}
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/products">
              <Button className="w-full h-14 text-left justify-start bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-white" variant="default">
                <Package className="h-5 w-5 mr-3" />
                Adicionar Produto
              </Button>
            </Link>
            <Link to="/admin/pedidos">
              <Button className="w-full h-14 text-left justify-start bg-gradient-to-r from-accent to-accent/80 hover:opacity-90 text-white" variant="default">
                <ShoppingCart className="h-5 w-5 mr-3" />
                Ver Pedidos Pendentes
              </Button>
            </Link>
            <Link to="/admin/configuracoes">
              <Button className="w-full h-14 text-left justify-start" variant="outline">
                <Settings className="h-5 w-5 mr-3" />
                Configurar Loja
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

// QuickStats component (local) - fetches lightweight metrics for admin landing
const QuickStats = () => {
  const { stats, loading: statsLoading, error: statsError, refresh } = useProductStats();
  const { currentUser } = useAuth();
  const [customersCount, setCustomersCount] = useState<number | null>(null);
  const [ordersToday, setOrdersToday] = useState<number | null>(null);
  const [revenueToday, setRevenueToday] = useState<number | null>(null);
  const [loadingToday, setLoadingToday] = useState<boolean>(true);

  useEffect(() => {
    // fetch customers count (admin endpoint supports page_size=1 and count)
    const fetchCustomers = async () => {
      try {
        const res: any = await customersApi.listAdmin({ page: '1', page_size: '1' });
        if (Array.isArray(res)) {
          setCustomersCount(res.length);
        } else if (res && typeof res.count === 'number') {
          setCustomersCount(res.count);
        }
      } catch (err) {
        // Failed to fetch customers count
      }
    };

    const fetchTodayStats = async () => {
      setLoadingToday(true);
      try {
        const token = await currentUser?.getIdToken();
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // Prefer the aggregated stats endpoint
        const resp = await fetch('/api/cart/admin/orders/stats/', { headers, credentials: 'include' });
        if (resp.ok) {
          const data = await resp.json();
          const statsBlock = data.stats || {};
          if (typeof statsBlock.today_orders === 'number') setOrdersToday(statsBlock.today_orders);
          if (typeof statsBlock.today_revenue === 'number') setRevenueToday(statsBlock.today_revenue);
        } else {
          // fallback: try the slow list approach
          const today = new Date();
          const y = today.getFullYear();
          const m = String(today.getMonth() + 1).padStart(2, '0');
          const d = String(today.getDate()).padStart(2, '0');
          const isoDate = `${y}-${m}-${d}`;
          const listResp = await fetch(`/api/cart/admin/orders/?page=1&page_size=1000&date_from=${isoDate}&date_to=${isoDate}`, { headers, credentials: 'include' });
          if (listResp.ok) {
            const data = await listResp.json();
            const list = data.orders || [];
            setOrdersToday(list.length);
            const revenue = list.reduce((sum: number, o: any) => {
              const total = parseFloat(o.total_amount || '0') || 0;
              const shipping = parseFloat(o.shipping_cost || '0') || 0;
              return sum + total + shipping;
            }, 0);
            setRevenueToday(revenue);
          }
        }
      } catch (err) {
        // Failed to fetch orders stats
      } finally {
        setLoadingToday(false);
      }
    };

    fetchCustomers();
    fetchTodayStats();
  }, [currentUser]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      <Card className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary/50 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Receita Hoje</p>
              <p className="text-2xl font-bold text-gradient-gold">{revenueToday === null ? (stats ? formatPrice(stats.total_stock_value || 0) : formatPrice(0)) : formatPrice(revenueToday)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur border-accent/20 hover:border-accent/50 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-accent" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Pedidos</p>
              <p className="text-2xl font-bold text-foreground">{ordersToday === null ? '—' : ordersToday}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary/50 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-primary" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Produtos</p>
              <p className="text-2xl font-bold text-foreground">{stats ? stats.total_products : '—'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary/50 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-primary" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Clientes</p>
              <p className="text-2xl font-bold text-foreground">{customersCount ?? '—'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

