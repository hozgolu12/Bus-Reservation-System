'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Shield, 
  Ban, 
  CheckCircle, 
  ArrowLeft,
  Mail,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { AdminAPI } from '@/lib/admin-api';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ManageUsers() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!user || user.role !== 'superadmin') {
      router.push('/dashboard');
      return;
    }
  }, [user, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      
      try {
        // Mock data for now - replace with actual API call
        const mockUsers = [
          {
            id: '1',
            username: 'john_doe',
            email: 'john@example.com',
            role: 'user',
            isActive: true,
            dateJoined: '2025-01-15',
            lastLogin: '2025-07-08',
            totalBookings: 12
          },
          {
            id: '2',
            username: 'jane_smith',
            email: 'jane@example.com',
            role: 'user',
            isActive: false,
            dateJoined: '2025-02-20',
            lastLogin: '2025-07-05',
            totalBookings: 8
          },
          {
            id: '3',
            username: 'metro_express',
            email: 'admin@metroexpress.com',
            role: 'operator',
            isActive: true,
            dateJoined: '2025-01-10',
            lastLogin: '2025-07-09',
            totalBookings: 0,
            companyName: 'Metro Express Lines'
          },
          {
            id: '4',
            username: 'city_transport',
            email: 'contact@citytransport.com',
            role: 'operator',
            isActive: true,
            dateJoined: '2025-03-05',
            lastLogin: '2025-07-07',
            totalBookings: 0,
            companyName: 'City Transport Co.'
          },
          {
            id: '5',
            username: 'mike_wilson',
            email: 'mike@example.com',
            role: 'user',
            isActive: true,
            dateJoined: '2025-06-01',
            lastLogin: '2025-07-09',
            totalBookings: 3
          }
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        toast.error('Failed to fetch users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [token, currentPage]);

  const handleBlockUser = async (userId: string) => {
    try {
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isActive: false } : u
      ));
      toast.success('User blocked successfully');
    } catch (error) {
      toast.error('Failed to block user');
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isActive: true } : u
      ));
      toast.success('User unblocked successfully');
    } catch (error) {
      toast.error('Failed to unblock user');
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.role !== 'superadmin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/superadmin" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="text-gray-700">Super Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
          <p className="text-gray-600">View and manage all user accounts in the system</p>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by username or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="outline" className="px-3 py-2">
                {filteredUsers.length} users found
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        {isLoading ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-600">Loading users...</p>
            </CardContent>
          </Card>
        ) : filteredUsers.length > 0 ? (
          <div className="space-y-4">
            {filteredUsers.map((userData) => (
              <Card key={userData.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${
                        userData.role === 'operator' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <Users className={`h-6 w-6 ${
                          userData.role === 'operator' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="font-semibold text-lg text-gray-900">{userData.username}</h3>
                          <Badge variant={userData.role === 'operator' ? 'default' : 'secondary'}>
                            {userData.role}
                          </Badge>
                          <Badge variant={userData.isActive ? 'default' : 'destructive'}>
                            {userData.isActive ? 'Active' : 'Blocked'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>{userData.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Joined {userData.dateJoined}</span>
                          </div>
                        </div>
                        {userData.companyName && (
                          <p className="text-sm text-gray-600 mt-1">Company: {userData.companyName}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span className="text-gray-600">Last login: {userData.lastLogin}</span>
                          {userData.role === 'user' && (
                            <span className="text-gray-600">Bookings: {userData.totalBookings}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {userData.isActive ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBlockUser(userData.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Block
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnblockUser(userData.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Unblock
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>View Bookings</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-600">
                            Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Users Found</h3>
              <p className="text-gray-600">No users match your search criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}