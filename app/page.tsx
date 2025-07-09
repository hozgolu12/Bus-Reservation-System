'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, MapPin, Clock, Shield, Star } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) {
    return null; // Will redirect to dashboard
  }

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
              <Button variant="outline" onClick={() => router.push('/login')}>
                Login
              </Button>
              <Button onClick={() => router.push('/register')}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Book Your Bus Tickets
            <span className="text-blue-600 block">Online with Ease</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Travel across the country with comfort and convenience. Choose from hundreds of routes and buses.
          </p>
          <Button size="lg" className="text-lg px-8 py-6" onClick={() => router.push('/register')}>
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose BusGo?</h2>
          <p className="text-gray-600 text-lg">Experience the best in bus travel booking</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Wide Network</CardTitle>
              <CardDescription>
                Connect to over 1000+ destinations across the country
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Real-time Booking</CardTitle>
              <CardDescription>
                Book tickets instantly with real-time seat availability
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Secure & Safe</CardTitle>
              <CardDescription>
                Your payments and personal data are completely secure
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Routes</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Buses</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-2xl mx-auto border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl">Ready to Travel?</CardTitle>
            <CardDescription className="text-lg">
              Join thousands of satisfied customers and book your next journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center space-x-4">
              <Button size="lg" onClick={() => router.push('/register')}>
                Create Account
              </Button>
              <Button variant="outline" size="lg" onClick={() => router.push('/login')}>
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Bus className="h-6 w-6" />
              <span className="text-xl font-bold">BusGo</span>
            </div>
            <p className="text-gray-400">
              © 2024 BusGo. All rights reserved. Travel safe, travel smart.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}