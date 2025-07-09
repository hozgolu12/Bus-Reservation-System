'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bus, MapPin, Clock, Calendar, Users, Star, ArrowLeft, Filter, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

export default function TravelHistory() {
  const { user } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    // Mock data - replace with actual API call
    const today = new Date();
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
    
    const mockTickets = [
      {
        id: '1',
        ticketNumber: 'TKT-2025-001',
        route: 'New York → Boston',
        bus: 'NYC-101 (Luxury Coach)',
        operator: 'Express Lines',
        passengerName: 'John Doe',
        seatNumbers: ['A12'],
        date: formatDate(new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)), // 30 days ago
        departureTime: '08:30 AM',
        arrivalTime: '01:00 PM',
        price: 45,
        status: 'completed',
        bookingDate: formatDate(new Date(today.getTime() - 35 * 24 * 60 * 60 * 1000)), // 35 days ago
        rating: 4.5,
        amenities: ['WiFi', 'AC', 'Charging Ports', 'Snacks'],
        feedback: 'Great journey! Very comfortable seats and punctual service.'
      },
      {
        id: '2',
        ticketNumber: 'TKT-2025-002',
        route: 'Boston → Washington DC',
        bus: 'DC-201 (Standard Coach)',
        operator: 'Capital Express',
        passengerName: 'Jane Smith',
        seatNumbers: ['B08', 'B09'],
        date: formatDate(new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000)), // 20 days ago
        departureTime: '02:15 PM',
        arrivalTime: '06:30 PM',
        price: 130,
        status: 'completed',
        bookingDate: formatDate(new Date(today.getTime() - 25 * 24 * 60 * 60 * 1000)), // 25 days ago
        rating: 4.2,
        amenities: ['WiFi', 'AC', 'Charging Ports'],
        feedback: 'Good service overall. Bus was clean and on time.'
      },
      {
        id: '3',
        ticketNumber: 'TKT-2025-003',
        route: 'New York → Philadelphia',
        bus: 'PHL-301 (Premium Express)',
        operator: 'Liberty Lines',
        passengerName: 'Mike Johnson',
        seatNumbers: ['C15'],
        date: formatDate(new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000)), // 10 days ago
        departureTime: '10:00 AM',
        arrivalTime: '12:00 PM',
        price: 55,
        status: 'completed',
        bookingDate: formatDate(new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000)), // 15 days ago
        rating: 5.0,
        amenities: ['WiFi', 'AC', 'Premium Seats', 'Entertainment'],
        feedback: 'Excellent service! Premium seats were very comfortable.'
      },
      {
        id: '4',
        ticketNumber: 'TKT-2025-004',
        route: 'Philadelphia → New York',
        bus: 'NYC-205 (Express)',
        operator: 'Express Lines',
        passengerName: 'Sarah Wilson',
        seatNumbers: ['D20'],
        date: formatDate(new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000)), // 45 days ago
        departureTime: '03:00 PM',
        arrivalTime: '05:00 PM',
        price: 40,
        status: 'completed',
        bookingDate: formatDate(new Date(today.getTime() - 50 * 24 * 60 * 60 * 1000)), // 50 days ago
        rating: 4.0,
        amenities: ['WiFi', 'AC', 'Charging Ports'],
        feedback: 'Decent journey. Could improve the cleanliness.'
      },
      {
        id: '5',
        ticketNumber: 'TKT-2025-005',
        route: 'Boston → New York',
        bus: 'NYC-150 (Luxury)',
        operator: 'Premium Travel',
        passengerName: 'David Brown',
        seatNumbers: ['A05', 'A06'],
        date: formatDate(new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000)), // 60 days ago
        departureTime: '09:00 AM',
        arrivalTime: '01:30 PM',
        price: 100,
        status: 'cancelled',
        bookingDate: formatDate(new Date(today.getTime() - 65 * 24 * 60 * 60 * 1000)), // 65 days ago
        rating: null,
        amenities: ['WiFi', 'AC', 'Premium Seats', 'Meals'],
        feedback: null
      }
    ];

    setTickets(mockTickets);
  }, []);

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
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
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
  const totalSpent = completedTickets.reduce((sum, ticket) => sum + ticket.price, 0);
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
                      <CardTitle className="text-xl">{ticket.route}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        {ticket.bus} • {ticket.operator}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </Badge>
                      <div className="text-sm text-gray-500 mt-1">
                        {ticket.ticketNumber}
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
                          <p className="text-sm text-gray-600">{ticket.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Time</p>
                          <p className="text-sm text-gray-600">{ticket.departureTime} - {ticket.arrivalTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Passenger</p>
                          <p className="text-sm text-gray-600">{ticket.passengerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Seats</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {ticket.seatNumbers.map((seat, index) => (
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
                          {ticket.amenities.map((amenity, index) => (
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
                        <p className="text-2xl font-bold text-gray-900">${ticket.price}</p>
                      </div>
                      {ticket.feedback && (
                        <div>
                          <p className="font-medium mb-2">Your Feedback</p>
                          <p className="text-sm text-gray-600 italic">"{ticket.feedback}"</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {ticket.status === 'completed' && (
                    <>
                      <Separator className="my-6" />
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Booked on {ticket.bookingDate}
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
              <Bus className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Travel History Found</h3>
              <p className="text-gray-600 mb-6">
                {statusFilter === 'all' 
                  ? "You haven't completed any journeys yet" 
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