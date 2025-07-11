const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3002';

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
    password_confirm: string;
    phone_number?: string;
  }) {
    const response = await fetch(`${API_GATEWAY_URL}/api/auth/register/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    return response.json();
  }

  static async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${API_GATEWAY_URL}/api/auth/login/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return response.json();
  }

  static async logout(refreshToken: string) {
    const response = await fetch(`${API_GATEWAY_URL}/api/auth/logout/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    return response.ok;
  }

  static async getProfile(token: string) {
    const response = await fetch(`${API_GATEWAY_URL}/api/auth/profile/`, {
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return response.json();
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
    const url = new URL(`${API_GATEWAY_URL}/api/tickets/`);
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
    const response = await fetch(`${API_GATEWAY_URL}/api/tickets/book/`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(ticketData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to book ticket');
    }
    
    return response.json();
  }

  static async cancelTicket(token: string, ticketId: number) {
    const response = await fetch(`${API_GATEWAY_URL}/api/tickets/${ticketId}/cancel/`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) {
      throw new Error('Failed to cancel ticket');
    }
    
    return response.json();
  }

  static async getTicketDetail(token: string, ticketId: number) {
    const response = await fetch(`${API_GATEWAY_URL}/api/tickets/${ticketId}/`, {
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch ticket details');
    }
    
    return response.json();
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
    const url = new URL(`${API_GATEWAY_URL}/api/routes`);
    
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
  }

  static async getRoute(routeId: number) {
    const response = await fetch(`${API_GATEWAY_URL}/api/routes/${routeId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch route');
    }
    
    return response.json();
  }

  static async getBusesByRoute(routeId: number) {
    const response = await fetch(`${API_GATEWAY_URL}/api/routes/${routeId}/buses`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch buses');
    }
    
    return response.json();
  }
}

export class BusAPI {
  static async getBus(busId: number) {
    const response = await fetch(`${API_GATEWAY_URL}/api/buses/${busId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch bus');
    }
    
    return response.json();
  }

  static async reserveSeats(busId: number, data: {
    seat_numbers: number[];
    user_id: number;
  }) {
    const response = await fetch(`${API_GATEWAY_URL}/api/buses/${busId}/reserve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to reserve seats');
    }
    
    return response.json();
  }

  static async cancelSeats(busId: number, data: {
    seat_numbers: number[];
    user_id: number;
  }) {
    const response = await fetch(`${API_GATEWAY_URL}/api/buses/${busId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to cancel seats');
    }
    
    return response.json();
  }
}