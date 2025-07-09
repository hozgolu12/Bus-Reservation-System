'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bus, MapPin, Clock, Users, Star, Wifi, Zap, Coffee, Monitor, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Buses() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [route, setRoute] = useState(null);
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    // Mock data - replace with actual API call
    const routes = {
      '1': {
        id: '1',
        name: 'NYC Express',
        source: 'New York',
        destination: 'Boston',
        distance: '215 miles',
        duration: '4h 30m'
      },
      '2': {
        id: '2',
        name: 'Capital Corridor',
        source: 'New York',
        destination: 'Washington DC',
        distance: '225 miles',
        duration: '4h 15m'
      },
      '3': {
        id: '3',
        name: 'Liberty Line',
        source: 'New York',
        destination: 'Philadelphia',
        distance: '95 miles',
        duration: '2h 00m'
      }
    };

    const busesData = {
      '1': [
        {
          id: '101',
          busNumber: 'NYC-101',
          type: 'Luxury Coach',
          departureTime: '08:30 AM',
          arrivalTime: '01:00 PM',
          availableSeats: 25,
          totalSeats: 40,
          price: '$45',
          rating: 4.5,
          amenities: ['WiFi', 'AC', 'Charging Ports', 'Snacks', 'Reclining Seats'],
          operator: 'Express Lines'
        },
        {
          id: '102',
          busNumber: 'NYC-102',
          type: 'Standard Coach',
          departureTime: '10:15 AM',
          arrivalTime: '02:45 PM',
          availableSeats: 18,
          totalSeats: 35,
          price: '$40',
          rating: 4.2,
          amenities: ['WiFi', 'AC', 'Charging Ports'],
          operator: 'City Transport'
        },
        {
          id: '103',
          busNumber: 'NYC-103',
          type: 'Premium Express',
          departureTime: '02:30 PM',
          arrivalTime: '07:00 PM',
          availableSeats: 12,
          totalSeats: 30,
          price: '$55',
          rating: 4.8,
          amenities: ['WiFi', 'AC', 'Charging Ports', 'Snacks', 'Entertainment', 'Premium Seats'],
          operator: 'Premium Travel'
        }
      ],
      '2': [
        {
          id: '201',
          busNumber: 'DC-201',
          type: 'Luxury Coach',
          departureTime: '09:00 AM',
          arrivalTime: '01:15 PM',
          availableSeats: 20,
          totalSeats: 40,
          price: '$55',
          rating: 4.4,
          amenities: ['WiFi', 'AC', 'Charging Ports', 'Snacks', 'Reclining Seats'],
          operator: 'Capital Express'
        }
      ],
      '3': [
        {
          id: '301',
          busNumber: 'PHL-301',
          type: 'Standard Coach',
          departureTime: '11:00 AM',
          arrivalTime: '01:00 PM',
          availableSeats: 30,
          totalSeats: 35,
          price: '$35',
          rating: 4.6,
          amenities: ['WiFi', 'AC', 'Charging Ports'],
          operator: 'Liberty Lines'
        }
      ]
    };

    setRoute(routes[params.routeId as string]);
    setBuses(busesData[params.routeId as string] || []);
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

  if (!route) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Route not found</p>
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
                        <div className="flex items-center space-x-6 mt-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{bus.departureTime} - {bus.arrivalTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{bus.availableSeats}/{bus.totalSeats} seats</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">{bus.rating}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {bus.amenities.map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                              {getAmenityIcon(amenity)}
                              <span>{amenity}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900 mb-2">{bus.price}</div>
                      <p className="text-sm text-gray-600 mb-4">per person</p>
                      <div className="mb-4">
                        <Badge variant={bus.availableSeats > 10 ? "default" : "destructive"}>
                          {bus.availableSeats > 10 ? "Available" : "Limited Seats"}
                        </Badge>
                      </div>
                      <Link href={`/buses/${bus.id}/book`}>
                        <Button size="lg" className="w-full" disabled={bus.availableSeats === 0}>
                          {bus.availableSeats === 0 ? "Sold Out" : "Select Seats"}
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