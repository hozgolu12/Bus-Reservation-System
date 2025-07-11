import config from './config';

// API client for Django authentication service
export class AuthAPI {
  private static getHeaders(token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  static async register(userData: {
    username: string;
    email: string;
    password: string;
    role?: string;
    phone_number?: string;
  }) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/auth/register/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(errorData.message || 'Registration failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async login(credentials: { email: string; password: string }) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/auth/login/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Login failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async logout(refreshToken: string) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/auth/logout/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  static async getProfile(token: string) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/auth/profile/`, {
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      return response.json();
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }
}

// API client for ticket management
export class TicketAPI {
  private static getHeaders(token: string) {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  static async getUserTickets(token: string, status?: string) {
    try {
      const url = new URL(`${config.DJANGO_API_URL}/api/tickets/`);
      if (status) {
        url.searchParams.append('status', status);
      }
      
      const response = await fetch(url.toString(), {
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      
      return response.json();
    } catch (error) {
      console.error('Tickets fetch error:', error);
      throw error;
    }
  }

  static async bookTicket(token: string, ticketData: {
    passenger_name: string;
    passenger_email: string;
    passenger_phone: string;
    route_id: string;
    route_name: string;
    bus_id: string;
    bus_number: string;
    departure_date: string;
    departure_time: string;
    arrival_time: string;
    seat_numbers: number[];
    price_per_seat: number;
    total_price: number;
  }) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/tickets/book/`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify(ticketData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to book ticket' }));
        throw new Error(errorData.message || 'Failed to book ticket');
      }
      
      return response.json();
    } catch (error) {
      console.error('Ticket booking error:', error);
      throw error;
    }
  }

  static async cancelTicket(token: string, ticketId: number) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/tickets/${ticketId}/cancel/`, {
        method: 'DELETE',
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel ticket');
      }
      
      return response.json();
    } catch (error) {
      console.error('Ticket cancellation error:', error);
      throw error;
    }
  }

  static async getTicketDetail(token: string, ticketId: number) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/tickets/${ticketId}/`, {
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch ticket details');
      }
      
      return response.json();
    } catch (error) {
      console.error('Ticket detail fetch error:', error);
      throw error;
    }
  }
}

// API client for routes and buses
export class RoutesAPI {
  static async getRoutes(filters?: {
    source?: string;
    destination?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const url = new URL(`${config.NESTJS_API_URL}/api/routes`);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            url.searchParams.append(key, value.toString());
          }
        });
      }
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error('Failed to fetch routes');
      }
      
      return response.json();
    } catch (error) {
      console.error('Routes fetch error:', error);
      throw error;
    }
  }

  static async getRoute(routeId: number) {
    try {
      const response = await fetch(`${config.NESTJS_API_URL}/api/routes/${routeId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch route');
      }
      
      return response.json();
    } catch (error) {
      console.error('Route fetch error:', error);
      throw error;
    }
  }

  static async getBusesByRoute(routeId: number) {
    try {
      const response = await fetch(`${config.NESTJS_API_URL}/api/routes/${routeId}/buses`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch buses');
      }
      
      return response.json();
    } catch (error) {
      console.error('Buses fetch error:', error);
      throw error;
    }
  }
}

export class BusAPI {
  static async getBus(busId: number) {
    try {
      const response = await fetch(`${config.NESTJS_API_URL}/api/buses/${busId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bus');
      }
      
      return response.json();
    } catch (error) {
      console.error('Bus fetch error:', error);
      throw error;
    }
  }

  static async reserveSeats(busId: number, data: {
    seat_numbers: number[];
    user_id: number;
  }) {
    try {
      const response = await fetch(`${config.NESTJS_API_URL}/api/buses/${busId}/reserve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to reserve seats' }));
        throw new Error(errorData.message || 'Failed to reserve seats');
      }
      
      return response.json();
    } catch (error) {
      console.error('Seat reservation error:', error);
      throw error;
    }
  }

  static async cancelSeats(busId: number, data: {
    seat_numbers: number[];
    user_id: number;
  }) {
    try {
      const response = await fetch(`${config.NESTJS_API_URL}/api/buses/${busId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to cancel seats' }));
        throw new Error(errorData.message || 'Failed to cancel seats');
      }
      
      return response.json();
    } catch (error) {
      console.error('Seat cancellation error:', error);
      throw error;
    }
  }
}