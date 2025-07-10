'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bus, MapPin, Clock, Ticket, User, LogOut, Plus, Calendar, Shield, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const recentTickets = [
    {
      id: '1',
      route: 'New York → Boston',
      bus: 'Luxury Coach #101',
      seat: 'A12',
      date: '2025-07-12',
      time: '08:30 AM',
      status: 'confirmed',
      price: '$45'
    },
    {
      id: '2',
      route: 'Boston → Washington DC',
      bus: 'Express #205',
      seat: 'B08',
      date: '2025-07-15',
      time: '02:15 PM',
      status: 'confirmed',
      price: '$65'
    }
  ];

  const upcomingJourneys = [
    {
      id: '3',
      route: 'New York → Philadelphia',
      bus: 'Comfort Plus #150',
      seat: 'C15',
      date: '2025-07-20',
      time: '10:00 AM',
      status: 'upcoming',
      price: '$35'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">BusGo</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">Welcome, {user.username}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <Link href="/routes">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Book New Ticket</CardTitle>
                <CardDescription>
                  Find and book your next journey
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <Link href="/tickets">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Ticket className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>My Tickets</CardTitle>
                <CardDescription>
                  View and manage your bookings
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <Link href="/history">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Travel History</CardTitle>
                <CardDescription>
                  Review your past journeys
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {/* Upcoming Journeys */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Journeys</h2>
          {upcomingJourneys.length > 0 ? (
            <div className="grid gap-4">
              {upcomingJourneys.map((ticket) => (
                <Card key={ticket.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                          <Bus className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{ticket.route}</h3>
                          <p className="text-gray-600">{ticket.bus}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{ticket.date}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{ticket.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">
                          Seat {ticket.seat}
                        </Badge>
                        <div className="text-xl font-bold text-gray-900">{ticket.price}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No upcoming journeys</p>
                <Button className="mt-4" asChild>
                  <Link href="/routes">Book Your First Trip</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Bookings */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Bookings</h2>
          <div className="grid gap-4">
            {recentTickets.map((ticket) => (
              <Card key={ticket.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <Ticket className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{ticket.route}</h3>
                        <p className="text-gray-600">{ticket.bus}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{ticket.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{ticket.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-2">
                        Seat {ticket.seat}
                      </Badge>
                      <div className="text-xl font-bold text-gray-900">{ticket.price}</div>
                      <Badge variant="outline" className="mt-2">
                        {ticket.status}
                      </Badge>
                    </div>
            {user.role === 'superadmin' && (
              <Link href="/superadmin">
                <Button variant="outline" size="sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Super Admin
                </Button>
              </Link>
            )}
            {(user.role === 'operator' || user.role === 'superadmin') && (
              <Link href="/operator">
                <Button variant="outline" size="sm">
                  <Building2 className="h-4 w-4 mr-2" />
                  Operator Panel
                </Button>
              </Link>
            )}
            <Link href="/account">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Account
              </Button>
            </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}