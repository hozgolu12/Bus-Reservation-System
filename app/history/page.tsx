'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bus as IBus, MapPin, Clock, Calendar, Users, Star, ArrowLeft, Filter, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ITicket } from '@/shared/interfaces';

export default function TravelHistory() {
  const { user } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<ITicket[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  

  useEffect(() => {
    let filtered = tickets;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Sort tickets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.departure_date).getTime() - new Date(a.departure_date).getTime();
        case 'oldest':
          return new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime();
        case 'price-high':
          return b.total_price - a.total_price;
        case 'price-low':
          return a.total_price - b.total_price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredTickets(filtered);
  }, [tickets, statusFilter, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const completedTickets = filteredTickets.filter(t => t.status === 'completed');
  const cancelledTickets = filteredTickets.filter(t => t.status === 'cancelled');
  const totalSpent = completedTickets.reduce((sum, ticket) => sum + ticket.total_price, 0);
  const averageRating = completedTickets.reduce((sum, ticket) => sum + (ticket.rating || 0), 0) / completedTickets.length;

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
              <IBus className="h-8 w-8 text-blue-600" />
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
        <Link href="/dashboard" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel History</h1>
          <p className="text-gray-600">Review your past journeys and experiences</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{tickets.length}</div>
              <div className="text-sm text-gray-600">Total Trips</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{completedTickets.length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">${totalSpent}</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <span className="text-3xl font-bold text-yellow-600">{averageRating.toFixed(1)}</span>
                <Star className="h-6 w-6 text-yellow-500 fill-current" />
              </div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Filters</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="price-high">Price (High)</SelectItem>
                      <SelectItem value="price-low">Price (Low)</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Travel History List */}
        {filteredTickets.length > 0 ? (
          <div className="space-y-6">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{ticket.route_name}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        {ticket.bus_number} • {ticket.operator}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(ticket.status ?? '')}>
                        {(ticket.status || '').charAt(0).toUpperCase() + (ticket.status || '').slice(1)}
                      </Badge>
                      <div className="text-sm text-gray-500 mt-1">
                        {ticket.ticket_number}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column - Journey Details */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Travel Date</p>
                          <p className="text-sm text-gray-600">{ticket.departure_date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Time</p>
                          <p className="text-sm text-gray-600">{ticket.departure_time} - {ticket.arrival_time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Passenger</p>
                          <p className="text-sm text-gray-600">{ticket.passenger_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Seats</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {ticket.seat_numbers.map((seat, index) => (
                              <Badge key={index} variant="outline">
                                {seat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Experience Details */}
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium mb-2">Amenities</p>
                        <div className="flex flex-wrap gap-1">
                          {ticket.amenities && ticket.amenities.map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {ticket.rating && (
                        <div>
                          <p className="font-medium mb-2">Your Rating</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              {renderStars(ticket.rating)}
                            </div>
                            <span className="text-sm text-gray-600">({ticket.rating}/5)</span>
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">Total Price</p>
                        <p className="text-2xl font-bold text-gray-900">${ticket.total_price}</p>
                      </div>
                      {ticket.feedback && (
                        <div>
                          <p className="font-medium mb-2">Your Feedback</p>
                          <p className="text-sm text-gray-600 italic">`${ticket.feedback}`</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {ticket.status === 'completed' && (
                    <>
                      <Separator className="my-6" />
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Booked on {ticket.booking_date}
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Receipt
                          </Button>
                          <Button variant="outline" size="sm">
                            Book Again
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <IBus className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Travel History Found</h3>
              <p className="text-gray-600 mb-6">
                {statusFilter === 'all' 
                  ? 'You haven&apos;t completed any journeys yet' 
                  : `No ${statusFilter} trips found`}
              </p>
              <Link href="/routes">
                <Button>Book Your Next Trip</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}