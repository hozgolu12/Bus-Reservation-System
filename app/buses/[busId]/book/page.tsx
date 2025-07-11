'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bus as BusIcon, MapPin, Clock, Users, Star, ArrowLeft, User as UserIcon, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { BusAPI } from '@/lib/api';

import { IBus, ISeat } from '@/shared/interfaces';

export default function BookBus() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [bus, setBus] = useState<IBus | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const busData = await BusAPI.getBus(Number(params.busId));
        setBus(busData);
      } catch (error) {
        toast.error('Failed to fetch bus details.');
      }
    };

    if (params.busId) {
      fetchBusData();
    }
  }, [params.busId]);

  const handleSeatClick = (seatNumber: number) => {
    if (!bus || bus.seat_map.find(s => s.number === seatNumber)?.isOccupied) {
      return;
    }

    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(s => s !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const getSeatClass = (seat: ISeat) => {
    let baseClass = 'w-8 h-8 rounded-md border-2 cursor-pointer transition-all hover:scale-110 flex items-center justify-center text-xs font-semibold';
    
    if (seat.isOccupied) {
      return baseClass + ' bg-red-100 border-red-300 text-red-600 cursor-not-allowed';
    } else if (selectedSeats.includes(seat.number)) {
      return baseClass + ' bg-blue-500 border-blue-600 text-white';
    } else if (seat.type === 'premium') {
      return baseClass + ' bg-purple-100 border-purple-300 text-purple-600 hover:bg-purple-200';
    } else {
      return baseClass + ' bg-green-100 border-green-300 text-green-600 hover:bg-green-200';
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    if (!passengerName || !passengerPhone || !passengerEmail) {
      toast.error('Please fill in all passenger details');
      return;
    }

    setIsLoading(true);

    try {
      if (!bus || !user) return; // Add null check for bus and user
      await BusAPI.reserveSeats(Number(bus.id), { seat_numbers: selectedSeats, user_id: Number(user.id) });
      
      toast.success(`Booking confirmed! ${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''} reserved successfully.`);
      router.push('/tickets');
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (!bus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <BusIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading bus details...</p>
        </div>
      </div>
    );
  }

  const totalPrice = selectedSeats.length * bus.price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <BusIcon className="h-8 w-8 text-blue-600" />
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
          <span>Back to Buses</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Seat Selection */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Select Your Seats</CardTitle>
                <CardDescription>
                  Choose your preferred seats for the journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Legend */}
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
                    <span className="text-sm">Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-purple-100 border-2 border-purple-300 rounded"></div>
                    <span className="text-sm">Premium</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 border-2 border-blue-600 rounded"></div>
                    <span className="text-sm">Selected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
                    <span className="text-sm">Occupied</span>
                  </div>
                </div>

                {/* Seat Map */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center space-x-2 bg-gray-200 px-4 py-2 rounded-full">
                      <BusIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">Driver</span>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    {Array.from({ length: Math.ceil(bus.total_seats / 4) }).map((_, rowIndex) => (
                      <div key={rowIndex} className="flex items-center justify-center space-x-2">
                        <div className="flex space-x-1">
                          {[1, 2].map(seatPos => {
                            const seatNumber = rowIndex * 4 + seatPos;
                            const seat = bus.seat_map.find(s => s.number === seatNumber);
                            return seat ? (
                              <div
                                key={seatNumber}
                                className={getSeatClass(seat)}
                                onClick={() => handleSeatClick(seatNumber)}
                              >
                                {seatNumber}
                              </div>
                            ) : null;
                          })}
                        </div>
                        <div className="w-6"></div>
                        <div className="flex space-x-1">
                          {[3, 4].map(seatPos => {
                            const seatNumber = rowIndex * 4 + seatPos;
                            const seat = bus.seat_map.find(s => s.number === seatNumber);
                            return seat ? (
                              <div
                                key={seatNumber}
                                className={getSeatClass(seat)}
                                onClick={() => handleSeatClick(seatNumber)}
                              >
                                {seatNumber}
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedSeats.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Selected Seats:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map(seat => (
                        <Badge key={seat} variant="default">
                          Seat {seat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            {/* Bus Details */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">{bus.bus_number}</CardTitle>
                <CardDescription>{bus.type}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{bus.route.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{bus.departure_time} - {bus.arrival_time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm">{bus.rating} Rating</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {bus.amenities && bus.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Passenger Details */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Passenger Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      placeholder="Enter passenger name"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={passengerEmail}
                      onChange={(e) => setPassengerEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Selected Seats</span>
                  <span>{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per seat</span>
                  <span>${bus.price}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleBooking}
                  disabled={selectedSeats.length === 0 || isLoading}
                >
                  {isLoading ? 'Processing...' : `Book ${selectedSeats.length} Seat${selectedSeats.length > 1 ? 's' : ''}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}