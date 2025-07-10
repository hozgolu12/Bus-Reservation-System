'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Bus, 
  Route, 
  Ticket, 
  TrendingUp, 
  AlertTriangle,
  Settings,
  Shield,
  BarChart3,
  UserCheck,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import { AdminAPI } from '@/lib/admin-api';
import { toast } from 'sonner';

export default function SuperAdminDashboard() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'superadmin') {
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
          totalUsers: 1247,
          totalOperators: 23,
          totalBuses: 156,
          totalRoutes: 89,
          activeBookings: 342,
          revenue: 45670,
          recentActivity: [
            { id: 1, action: 'New operator registered', user: 'Metro Express', time: '2 hours ago', type: 'operator' },
            { id: 2, action: 'Bus route updated', user: 'City Transport', time: '4 hours ago', type: 'route' },
            { id: 3, action: 'User account blocked', user: 'john@example.com', time: '6 hours ago', type: 'user' },
            { id: 4, action: 'New bus added', user: 'Express Lines', time: '8 hours ago', type: 'bus' },
          ],
          alerts: [
            { id: 1, message: 'High booking volume detected on NYC-Boston route', severity: 'warning' },
            { id: 2, message: '3 operators pending verification', severity: 'info' },
            { id: 3, message: 'System maintenance scheduled for tonight', severity: 'info' },
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

  if (!user || user.role !== 'superadmin') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Super Admin</h1>
                <p className="text-sm text-gray-600">System Administration Panel</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {user.username}
              </Badge>
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
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                </div>
                <Users className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bus Operators</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalOperators || 0}</p>
                </div>
                <Building2 className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Buses</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalBuses || 0}</p>
                </div>
                <Bus className="h-12 w-12 text-purple-600" />
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
                <Ticket className="h-12 w-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/superadmin/users">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <UserCheck className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Manage Users</CardTitle>
                <CardDescription>View, block, and manage user accounts</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/superadmin/operators">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Building2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Manage Operators</CardTitle>
                <CardDescription>Create and manage bus operators</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/superadmin/analytics">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Analytics</CardTitle>
                <CardDescription>View system analytics and reports</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/superadmin/settings">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Settings className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                <CardTitle className="text-lg">System Settings</CardTitle>
                <CardDescription>Configure system settings</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system activities and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentActivity?.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'operator' ? 'bg-green-100' :
                      activity.type === 'user' ? 'bg-blue-100' :
                      activity.type === 'bus' ? 'bg-purple-100' : 'bg-orange-100'
                    }`}>
                      {activity.type === 'operator' && <Building2 className="h-4 w-4 text-green-600" />}
                      {activity.type === 'user' && <Users className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'bus' && <Bus className="h-4 w-4 text-purple-600" />}
                      {activity.type === 'route' && <Route className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Important notifications and warnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.alerts?.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                    alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                    alert.severity === 'error' ? 'bg-red-50 border-red-400' :
                    'bg-blue-50 border-blue-400'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                        alert.severity === 'warning' ? 'text-yellow-600' :
                        alert.severity === 'error' ? 'text-red-600' :
                        'text-blue-600'
                      }`} />
                      <p className="text-sm">{alert.message}</p>
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