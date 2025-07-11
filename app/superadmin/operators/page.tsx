'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Plus, 
  Shield, 
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Trash2,
  Edit
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function ManageOperators() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [operators, setOperators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newOperator, setNewOperator] = useState({
    username: '',
    email: '',
    password: '',
    company_name: '',
    contact_phone: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'superadmin') {
      router.push('/dashboard');
      return;
    }
  }, [user, router]);

  useEffect(() => {
    const fetchOperators = async () => {
      if (!token) return;
      
      try {
        const Operators = await AdminAPI.getOperators(token);
        setOperators(Operators);
      } catch (error) {
        toast.error('Failed to fetch operators');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOperators();
  }, [token]);

  const handleCreateOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newOp = {
        id: Date.now().toString(),
        ...newOperator,
        dateJoined: new Date().toISOString().split('T')[0],
        isActive: true,
      };

      await AdminAPI.createOperator(token, newOp);
      setOperators(prev => [newOp, ...prev]);
      setShowCreateDialog(false);
      setNewOperator({
        username: '',
        email: '',
        totalBuses: 0,
        totalRoutes: 0,
        totalBookings: 0
      });

      setOperators(prev => [newOp, ...prev]);
      setShowCreateDialog(false);
      setNewOperator({
        username: '',
        email: '',
        password: '',
        company_name: '',
        contact_phone: ''
      });
      toast.success('Operator created successfully');
    } catch (error) {
      toast.error('Failed to create operator');
    }
  };

  const handleDeleteOperator = async (operatorId: string) => {
    try {
      await AdminAPI.deleteOperator(token, operatorId);
      setOperators(prev => prev.filter(op => op.id !== operatorId));
      toast.success('Operator deleted successfully');
    } catch (error) {
      toast.error('Failed to delete operator');
    }
  };

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Operators</h1>
            <p className="text-gray-600">Create and manage bus operator accounts</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Operator</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Operator</DialogTitle>
                <DialogDescription>
                  Add a new bus operator to the system
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateOperator} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={newOperator.username}
                    onChange={(e) => setNewOperator(prev => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newOperator.email}
                    onChange={(e) => setNewOperator(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newOperator.password}
                    onChange={(e) => setNewOperator(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    value={newOperator.company_name}
                    onChange={(e) => setNewOperator(prev => ({ ...prev, company_name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={newOperator.contact_phone}
                    onChange={(e) => setNewOperator(prev => ({ ...prev, contact_phone: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Operator</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Operators List */}
        {isLoading ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-600">Loading operators...</p>
            </CardContent>
          </Card>
        ) : operators.length > 0 ? (
          <div className="space-y-6">
            {operators.map((operator) => (
              <Card key={operator.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <Building2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-xl text-gray-900">{operator.company_name}</h3>
                          <Badge variant={operator.isActive ? 'default' : 'destructive'}>
                            {operator.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Username:</span>
                              <span>{operator.username}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4" />
                              <span>{operator.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4" />
                              <span>{operator.contact_phone}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>Joined {operator.dateJoined}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Buses:</span>
                              <span>{operator.totalBuses}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Routes:</span>
                              <span>{operator.totalRoutes}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Badge variant="outline" className="mr-2">
                            {operator.totalBookings} total bookings
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteOperator(operator.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Operators Found</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first bus operator</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Operator
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}