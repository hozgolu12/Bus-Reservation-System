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
import { TicketAPI } from '@/lib/api';

export default function Tickets() {
  const { user } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const response = await TicketAPI.getUserTickets(user.token || '');
        setTickets(response.results || response);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
        toast.error('Failed to fetch tickets');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTickets();
  }, [user]);

  const handleCancelTicket = async (ticketId: string) => {
    if (!user) return;
    
    try {
      await TicketAPI.cancelTicket(user.token || '', Number(ticketId));
      setTickets(prev => prev.filter((ticket: any) => ticket.id !== ticketId));
      toast.success('Ticket cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel ticket:', error);
      toast.error('Failed to cancel ticket');
    }
  };

  const handleDownloadTicket = (ticket: any) => {
    // TODO: Implement actual ticket generation and download logic
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
        {isLoading ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-600">Loading tickets...</p>
            </CardContent>
          </Card>
        ) : tickets.length > 0 ? (
          <div className="space-y-6">
            {tickets.map((ticket: any) => (
              <Card key={ticket.id} className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{ticket.route_name}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        {ticket.bus_number} • Operator
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
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
                        <QrCode className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Seats</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {ticket.seat_numbers.map((seat: number, index: number) => (
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
                          {(ticket.amenities || []).map((amenity: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Booking Date</p>
                        <p className="text-sm text-gray-600">{new Date(ticket.booking_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-medium">Total Price</p>
                        <p className="text-2xl font-bold text-gray-900">${ticket.total_price}</p>
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
                    {ticket.status === 'confirmed' && new Date(ticket.departure_date) > new Date() && (
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
              <p className="text-gray-600 mb-6">You haven&apos;t booked any tickets yet</p>
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