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
  Bus, 
  Plus, 
  Building2, 
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Clock,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { OperatorAPI } from '@/lib/admin-api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ManageBuses() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newBus, setNewBus] = useState({
    bus_number: '',
    type: '',
    operator: '',
    total_seats: 40,
    departure_time: '',
    arrival_time: '',
    price: '',
    amenities: [],
    route_id: ''
  });

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
    const fetchData = async () => {
      if (!token) return;
      
      try {
        const fetchedBuses = await OperatorAPI.getMyBuses(token);
        const fetchedRoutes = await OperatorAPI.getMyRoutes(token);
        
        setBuses(fetchedBuses);
        setRoutes(fetchedRoutes);
      } catch (error) {
        toast.error('Failed to fetch buses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleCreateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const selectedRoute = routes.find(r => r.id === newBus.route_id);
      const newBusData = {
        id: Date.now().toString(),
        ...newBus,
        operator: user.username || 'Metro Express Lines',
        available_seats: newBus.total_seats,
        rating: 4.0,
        route: selectedRoute?.name || '',
        is_active: true,
        price: parseFloat(newBus.price)
      };
      
      setBuses(prev => [newBusData, ...prev]);
      setShowCreateDialog(false);
      setNewBus({
        bus_number: '',
        type: '',
        operator: '',
        total_seats: 40,
        departure_time: '',
        arrival_time: '',
        price: '',
        amenities: [],
        route_id: ''
      });
      toast.success('Bus created successfully');
    } catch (error) {
      toast.error('Failed to create bus');
    }
  };

  const handleDeleteBus = async (busId: string) => {
    try {
      await OperatorAPI.deleteBus(token, busId);
      setBuses(prev => prev.filter(bus => bus.id !== busId));
      toast.success('Bus deleted successfully');
    } catch (error) {
      toast.error('Failed to delete bus');
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setNewBus(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  if (!user || !['operator', 'superadmin'].includes(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/operator" className="flex items-center space-x-2 text-green-600 hover:text-green-800">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Building2 className="h-6 w-6 text-green-600" />
              <span className="text-gray-700">Operator Panel</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Buses</h1>
            <p className="text-gray-600">Add, edit, and manage your bus fleet</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Bus</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Bus</DialogTitle>
                <DialogDescription>
                  Add a new bus to your fleet
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateBus} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bus_number">Bus Number</Label>
                    <Input
                      id="bus_number"
                      value={newBus.bus_number}
                      onChange={(e) => setNewBus(prev => ({ ...prev, bus_number: e.target.value }))}
                      placeholder="e.g., NYC-104"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Bus Type</Label>
                    <Select value={newBus.type} onValueChange={(value) => setNewBus(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard Coach">Standard Coach</SelectItem>
                        <SelectItem value="Luxury Coach">Luxury Coach</SelectItem>
                        <SelectItem value="Premium Express">Premium Express</SelectItem>
                        <SelectItem value="Sleeper">Sleeper</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="route_id">Route</Label>
                  <Select value={newBus.route_id} onValueChange={(value) => setNewBus(prev => ({ ...prev, route_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      {routes.map((route) => (
                        <SelectItem key={route.id} value={route.id}>{route.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="total_seats">Total Seats</Label>
                    <Input
                      id="total_seats"
                      type="number"
                      value={newBus.total_seats}
                      onChange={(e) => setNewBus(prev => ({ ...prev, total_seats: parseInt(e.target.value) }))}
                      min="20"
                      max="60"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newBus.price}
                      onChange={(e) => setNewBus(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="45.00"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departure_time">Departure Time</Label>
                    <Input
                      id="departure_time"
                      type="time"
                      value={newBus.departure_time}
                      onChange={(e) => setNewBus(prev => ({ ...prev, departure_time: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arrival_time">Arrival Time</Label>
                    <Input
                      id="arrival_time"
                      type="time"
                      value={newBus.arrival_time}
                      onChange={(e) => setNewBus(prev => ({ ...prev, arrival_time: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['WiFi', 'AC', 'Charging Ports', 'Snacks', 'Entertainment', 'Premium Seats', 'Reclining Seats'].map((amenity: string) => (
                      <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newBus.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="rounded"
                        />
                        <span className="text-sm">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Bus</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Buses List */}
        {isLoading ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-600">Loading buses...</p>
            </CardContent>
          </Card>
        ) : buses.length > 0 ? (
          <div className="space-y-6">
            {buses.map((bus) => (
              <Card key={bus.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Bus className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-xl text-gray-900">{bus.bus_number}</h3>
                          <Badge variant="secondary">{bus.type}</Badge>
                          <Badge variant={bus.is_active ? 'default' : 'destructive'}>
                            {bus.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Route:</span>
                              <span>{bus.route}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{bus.departure_time} - {bus.arrival_time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>{bus.available_seats}/{bus.total_seats} seats available</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Price:</span>
                              <span>${bus.price}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span>{bus.rating} rating</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {bus.amenities.map((amenity, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
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
                        onClick={() => handleDeleteBus(bus.id)}
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
              <Bus className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Buses Found</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first bus</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Bus
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}