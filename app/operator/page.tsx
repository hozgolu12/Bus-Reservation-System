'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Bus, 
  Route, 
  Ticket, 
  TrendingUp, 
  Users,
  Settings,
  Plus,
  BarChart3,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { OperatorAPI } from '@/lib/admin-api';
import { toast } from 'sonner';

export default function OperatorDashboard() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (!['operator', 'superadmin'].includes(user.role)) {
      router.push('/dashboard');
      return;
    }
  }, [user, router]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      
      try {
        // Mock data for now - replace with actual API call
        const mockStats = {
          totalBuses: 15,
          totalRoutes: 8,
          activeBookings: 42,
          monthlyRevenue: 12450,
          recentBookings: [
            { id: 1, passenger: 'John Doe', route: 'NYC → Boston', bus: 'NYC-101', date: '2025-07-10', amount: 45 },
            { id: 2, passenger: 'Jane Smith', route: 'NYC → Boston', bus: 'NYC-102', date: '2025-07-10', amount: 40 },
            { id: 3, passenger: 'Mike Wilson', route: 'NYC → Philadelphia', bus: 'PHL-301', date: '2025-07-09', amount: 35 },
            { id: 4, passenger: 'Sarah Brown', route: 'NYC → Boston', bus: 'NYC-101', date: '2025-07-09', amount: 45 },
          ],
          topRoutes: [
            { route: 'NYC → Boston', bookings: 156, revenue: 6240 },
            { route: 'NYC → Philadelphia', bookings: 89, revenue: 3115 },
            { route: 'Boston → NYC', bookings: 134, revenue: 5360 },
          ]
        };
        
        setStats(mockStats);
      } catch (error) {
        toast.error('Failed to fetch dashboard stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (!user || !['operator', 'superadmin'].includes(user.role)) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-green-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading operator dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Operator Panel</h1>
                <p className="text-sm text-gray-600">Manage your buses and routes</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {user.username}
              </Badge>
              <Link href="/operator/account">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Account
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">My Buses</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalBuses || 0}</p>
                </div>
                <Bus className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Routes</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalRoutes || 0}</p>
                </div>
                <Route className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.activeBookings || 0}</p>
                </div>
                <Ticket className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">${stats?.monthlyRevenue || 0}</p>
                </div>
                <TrendingUp className="h-12 w-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/operator/buses">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Bus className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Manage Buses</CardTitle>
                <CardDescription>Add, edit, and manage your bus fleet</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/operator/routes">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Route className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Manage Routes</CardTitle>
                <CardDescription>Create and manage your bus routes</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/operator/bookings">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">View Analytics</CardTitle>
                <CardDescription>Track bookings and revenue</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest bookings for your buses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentBookings?.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{booking.passenger}</p>
                      <p className="text-sm text-gray-600">{booking.route} • {booking.bus}</p>
                      <p className="text-xs text-gray-500">{booking.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${booking.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Routes */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Top Performing Routes</CardTitle>
              <CardDescription>Your most popular routes this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.topRoutes?.map((route, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{route.route}</p>
                      <p className="text-sm text-gray-600">{route.bookings} bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${route.revenue}</p>
                      <p className="text-xs text-gray-500">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}