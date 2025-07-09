'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bus, MapPin, Clock, Calendar, Users, QrCode, Download, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function Tickets() {
  const { user } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    // Mock data - replace with actual API call
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
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
        date: formatDate(tomorrow),
        departureTime: '08:30 AM',
        arrivalTime: '01:00 PM',
        price: 45,
        status: 'confirmed',
        bookingDate: formatDate(today),
        amenities: ['WiFi', 'AC', 'Charging Ports', 'Snacks']
      },
      {
        id: '2',
        ticketNumber: 'TKT-2025-002',
        route: 'Boston → Washington DC',
        bus: 'DC-201 (Standard Coach)',
        operator: 'Capital Express',
        passengerName: 'Jane Smith',
        seatNumbers: ['B08', 'B09'],
        date: formatDate(nextWeek),
        departureTime: '02:15 PM',
        arrivalTime: '06:30 PM',
        price: 130,
        status: 'confirmed',
        bookingDate: formatDate(today),
        amenities: ['WiFi', 'AC', 'Charging Ports']
      },
      {
        id: '3',
        ticketNumber: 'TKT-2025-003',
        route: 'New York → Philadelphia',
        bus: 'PHL-301 (Premium Express)',
        operator: 'Liberty Lines',
        passengerName: 'Mike Johnson',
        seatNumbers: ['C15'],
        date: formatDate(new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000)), // 15 days from now
        departureTime: '10:00 AM',
        arrivalTime: '12:00 PM',
        price: 55,
        status: 'confirmed',
        bookingDate: formatDate(today),
        amenities: ['WiFi', 'AC', 'Premium Seats', 'Entertainment']
      }
    ];

    setTickets(mockTickets);
  }, []);

  const handleCancelTicket = async (ticketId: string) => {
    try {
      // Mock cancellation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
      toast.success('Ticket cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel ticket');
    }
  };

  const handleDownloadTicket = (ticket) => {
    // Mock download - replace with actual ticket generation
    toast.success('Ticket downloaded successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
            <p className="text-gray-600 mt-2">Manage your bus reservations</p>
          </div>
          <Link href="/routes">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Book New Ticket</span>
            </Button>
          </Link>
        </div>

        {/* Tickets List */}
        {tickets.length > 0 ? (
          <div className="space-y-6">
            {tickets.map((ticket) => (
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
                        <QrCode className="h-5 w-5 text-gray-500" />
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

                    {/* Right Column - Booking Details */}
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
                      <div>
                        <p className="font-medium">Booking Date</p>
                        <p className="text-sm text-gray-600">{ticket.bookingDate}</p>
                      </div>
                      <div>
                        <p className="font-medium">Total Price</p>
                        <p className="text-2xl font-bold text-gray-900">${ticket.price}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadTicket(ticket)}
                        className="flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <QrCode className="h-4 w-4" />
                        <span>Show QR</span>
                      </Button>
                    </div>
                    {ticket.status === 'confirmed' && new Date(ticket.date) > new Date() && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelTicket(ticket.id)}
                        className="flex items-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel Ticket</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Bus className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tickets Found</h3>
              <p className="text-gray-600 mb-6">You haven't booked any tickets yet</p>
              <Link href="/routes">
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Book Your First Ticket</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}