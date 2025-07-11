'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bus, MapPin, Clock, Search, ArrowRight, Calendar, Users, Star } from 'lucide-react';
import Link from 'next/link';

export default function Routes() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    let filtered = routes;
    
    if (searchFrom) {
      filtered = filtered.filter(route => 
        route.source.toLowerCase().includes(searchFrom.toLowerCase())
      );
    }
    
    if (searchTo) {
      filtered = filtered.filter(route => 
        route.destination.toLowerCase().includes(searchTo.toLowerCase())
      );
    }
    
    setFilteredRoutes(filtered);
  }, [searchFrom, searchTo]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
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
        {/* Search Section */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Find Your Route</span>
            </CardTitle>
            <CardDescription>
              Search and book bus tickets for your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="from"
                    placeholder="Departure city"
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="to"
                    placeholder="Destination city"
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Routes List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Routes ({filteredRoutes.length})
          </h2>
          
          {filteredRoutes.length > 0 ? (
            filteredRoutes.map((route) => (
              <Card key={route.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Bus className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl text-gray-900">{route.name}</h3>
                        <div className="flex items-center space-x-2 mt-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{route.source}</span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{route.destination}</span>
                        </div>
                        <div className="flex items-center space-x-6 mt-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{route.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{route.distance}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{route.buses} buses</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">{route.rating}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {route.amenities.map((amenity, index) => (
                            <Badge key={index} variant="secondary">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900 mb-2">{route.price}</div>
                      <p className="text-sm text-gray-600 mb-4">per person</p>
                      <Link href={`/routes/${route.id}/buses`}>
                        <Button size="lg" className="w-full">
                          View Buses
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
                <p className="text-gray-600">No routes found for your search criteria</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your search filters</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}