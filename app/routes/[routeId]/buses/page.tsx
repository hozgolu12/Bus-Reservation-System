'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bus, MapPin, Clock, Users, Star, Wifi, Zap, Coffee, Monitor, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { RoutesAPI } from '@/lib/api';
import { toast } from 'sonner';

export default function Buses() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [route, setRoute] = useState(null);
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchRouteAndBuses = async () => {
      if (!params.routeId) return;

      try {
        setIsLoading(true);
        
        // Fetch route details
        const routeData = await RoutesAPI.getRoute(Number(params.routeId));
        setRoute(routeData);
        
        // Fetch buses for this route
        const busesData = await RoutesAPI.getBusesByRoute(Number(params.routeId));
        setBuses(busesData.buses || []);
      } catch (error) {
        console.error("Failed to fetch route or buses:", error);
        toast.error('Failed to load route information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRouteAndBuses();
    }, [params.routeId]);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'charging ports':
        return <Zap className="h-4 w-4" />;
      case 'snacks':
        return <Coffee className="h-4 w-4" />;
      case 'entertainment':
        return <Monitor className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading route information...</p>
        </div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Route not found</p>
          <Link href="/routes">
            <Button className="mt-4">Back to Routes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">BusGo</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.username}</span>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/routes" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Routes</span>
        </Link>

        {/* Route Info */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{route.name}</CardTitle>
            <CardDescription>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{route.source} → {route.destination}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{route.duration}</span>
                </div>
                <Badge variant="outline">{route.distance}</Badge>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Buses List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Buses ({buses.length})
          </h2>
          
          {buses.length > 0 ? (
            buses.map((bus) => (
              <Card key={bus.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Bus className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl text-gray-900">{bus.busNumber}</h3>
                        <p className="text-gray-600">{bus.type} • {bus.operator}</p>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Route:</span>
                              <span>{route.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{bus.departureTime} - {bus.arrivalTime}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>{bus.available_seats || bus.total_seats}/{bus.total_seats} seats available</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span>{bus.rating || '4.0'} rating</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {(bus.amenities || []).map((amenity: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900 mb-2">${bus.price}</div>
                      <p className="text-sm text-gray-600 mb-4">per person</p>
                      <div className="mb-4">
                        <Badge variant={(bus.available_seats || 0) > 10 ? "default" : "destructive"}>
                          {(bus.available_seats || 0) > 10 ? "Available" : "Limited Seats"}
                        </Badge>
                      </div>
                      <Link href={`/buses/${bus.id}/book`}>
                        <Button size="lg" className="w-full" disabled={(bus.available_seats || 0) === 0}>
                          {(bus.available_seats || 0) === 0 ? "Sold Out" : "Select Seats"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No buses available for this route</p>
                <p className="text-sm text-gray-500 mt-2">Please try another route or date</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}