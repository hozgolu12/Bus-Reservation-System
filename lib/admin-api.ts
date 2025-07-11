import config from './config';

// Admin API client for user and operator management
export class AdminAPI {
  private static getHeaders(token: string) {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  // Super Admin - User Management
  static async getAllUsers(token: string, page: number = 1, search?: string) {
    try {
      const url = new URL(`${config.DJANGO_API_URL}/api/admin/users/`);
      url.searchParams.append('page', page.toString());
      if (search) url.searchParams.append('search', search);
      
      const response = await fetch(url.toString(), {
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    } catch (error) {
      console.error('Users fetch error:', error);
      // Return mock data for now until backend is ready
      return {
        results: [
          {
            id: '1',
            username: 'john_doe',
            email: 'john@example.com',
            role: 'user',
            isActive: true,
            dateJoined: '2024-01-15',
            lastLogin: '2024-01-20',
            totalBookings: 5
          },
          {
            id: '2',
            username: 'operator_1',
            email: 'operator@buslines.com',
            role: 'operator',
            isActive: true,
            dateJoined: '2024-01-10',
            lastLogin: '2024-01-19',
            companyName: 'Express Bus Lines'
          }
        ]
      };
    }
  }

  static async blockUser(token: string, userId: string) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/admin/users/${userId}/block/`, {
        method: 'PATCH',
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) throw new Error('Failed to block user');
      return response.json();
    } catch (error) {
      console.error('Block user error:', error);
      throw error;
    }
  }

  static async unblockUser(token: string, userId: string) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/admin/users/${userId}/unblock/`, {
        method: 'PATCH',
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) throw new Error('Failed to unblock user');
      return response.json();
    } catch (error) {
      console.error('Unblock user error:', error);
      throw error;
    }
  }

  // Super Admin - Operator Management
  static async getOperators(token: string) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/admin/operators/`, {
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) throw new Error('Failed to fetch operators');
      return response.json();
    } catch (error) {
      console.error('Operators fetch error:', error);
      // Return mock data for now
      return [
        {
          id: '1',
          username: 'metro_express',
          email: 'admin@metroexpress.com',
          company_name: 'Metro Express Lines',
          contact_phone: '+1-555-0123',
          isActive: true,
          dateJoined: '2024-01-01',
          totalBuses: 15,
          totalRoutes: 8,
          totalBookings: 245
        },
        {
          id: '2',
          username: 'city_transport',
          email: 'info@citytransport.com',
          company_name: 'City Transport Co.',
          contact_phone: '+1-555-0456',
          isActive: true,
          dateJoined: '2024-01-05',
          totalBuses: 12,
          totalRoutes: 6,
          totalBookings: 189
        }
      ];
    }
  }

  static async createOperator(token: string, operatorData: any) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/admin/operators/`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify(operatorData),
      });
      
      if (!response.ok) throw new Error('Failed to create operator');
      return response.json();
    } catch (error) {
      console.error('Create operator error:', error);
      throw error;
    }
  }

  static async deleteOperator(token: string, operatorId: string) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/admin/operators/${operatorId}/`, {
        method: 'DELETE',
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) throw new Error('Failed to delete operator');
      return response.ok;
    } catch (error) {
      console.error('Delete operator error:', error);
      throw error;
    }
  }

  // Dashboard Stats
  static async getDashboardStats(token: string) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/admin/dashboard/stats/`, {
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      return response.json();
    } catch (error) {
      console.error('Dashboard stats error:', error);
      // Return mock data for now
      return {
        totalUsers: 1250,
        totalOperators: 15,
        totalBuses: 180,
        activeBookings: 45,
        recentActivity: [
          {
            id: '1',
            type: 'user',
            action: 'New user registration',
            user: 'john_doe',
            time: '2 hours ago'
          },
          {
            id: '2',
            type: 'operator',
            action: 'New bus added',
            user: 'metro_express',
            time: '4 hours ago'
          }
        ],
        alerts: [
          {
            id: '1',
            severity: 'warning',
            message: 'High booking volume detected on NYC-Boston route'
          }
        ]
      };
    }
  }
}

// Operator API client
export class OperatorAPI {
  private static getHeaders(token: string) {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  // Operator Profile Management
  static async getProfile(token: string) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/operator/profile/`, {
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) throw new Error('Failed to fetch operator profile');
      return response.json();
    } catch (error) {
      console.error('Operator profile error:', error);
      throw error;
    }
  }

  static async updateProfile(token: string, profileData: any) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/operator/profile/`, {
        method: 'PATCH',
        headers: this.getHeaders(token),
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  static async deleteAccount(token: string) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/operator/delete/`, {
        method: 'DELETE',
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) throw new Error('Failed to delete account');
      return response.ok;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }

  // Operator Bus Management
  static async getMyBuses(token: string) {
    try {
      const response = await fetch(`${config.NESTJS_API_URL}/api/operator/buses`, {
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) throw new Error('Failed to fetch buses');
      return response.json();
    } catch (error) {
      console.error('Buses fetch error:', error);
      // Return mock data for now
      return [
        {
          id: '1',
          bus_number: 'NYC-101',
          type: 'Luxury Coach',
          operator: 'Metro Express Lines',
          total_seats: 40,
          available_seats: 35,
          departure_time: '08:30',
          arrival_time: '13:00',
          price: 45.00,
          rating: 4.5,
          amenities: ['WiFi', 'AC', 'Charging Ports', 'Snacks'],
          route: 'New York - Boston',
          is_active: true
        }
      ];
    }
  }

  static async getMyRoutes(token: string) {
    try {
      const response = await fetch(`${config.NESTJS_API_URL}/api/operator/routes`, {
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) throw new Error('Failed to fetch routes');
      return response.json();
    } catch (error) {
      console.error('Routes fetch error:', error);
      // Return mock data for now
      return [
        {
          id: '1',
          name: 'NYC Express',
          source: 'New York',
          destination: 'Boston'
        }
      ];
    }
  }

  static async deleteBus(token: string, busId: string) {
    try {
      const response = await fetch(`${config.NESTJS_API_URL}/api/operator/buses/${busId}`, {
        method: 'DELETE',
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) throw new Error('Failed to delete bus');
      return response.ok;
    } catch (error) {
      console.error('Delete bus error:', error);
      throw error;
    }
  }

  // Operator Dashboard Stats
  static async getDashboardStats(token: string) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/operator/dashboard/stats/`, {
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      return response.json();
    } catch (error) {
      console.error('Operator dashboard stats error:', error);
      // Return mock data for now
      return {
        totalBuses: 15,
        totalRoutes: 8,
        activeBookings: 23,
        monthlyRevenue: 12500,
        recentBookings: [
          {
            id: '1',
            passenger: 'John Smith',
            route: 'NYC - Boston',
            bus: 'NYC-101',
            date: '2024-01-20',
            amount: 45
          }
        ],
        topRoutes: [
          {
            route: 'NYC - Boston',
            bookings: 45,
            revenue: 2025
          }
        ]
      };
    }
  }
}

// User Account API
export class UserAccountAPI {
  private static getHeaders(token: string) {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  static async getProfile(token: string) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/user/profile/`, {
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) throw new Error('Failed to fetch user profile');
      return response.json();
    } catch (error) {
      console.error('User profile error:', error);
      // Return mock data for now
      return {
        id: '1',
        username: 'john_doe',
        email: 'john@example.com',
        phone_number: '+1-555-0123',
        date_of_birth: '1990-01-01',
        first_name: 'John',
        last_name: 'Doe',
        date_joined: '2024-01-15',
        total_bookings: 5,
        last_login: '2024-01-20',
        role: 'user'
      };
    }
  }

  static async updateProfile(token: string, profileData: any) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/user/profile/`, {
        method: 'PATCH',
        headers: this.getHeaders(token),
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  static async deleteAccount(token: string) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/user/delete/`, {
        method: 'DELETE',
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) throw new Error('Failed to delete account');
      return response.ok;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }

  static async changePassword(token: string, passwordData: {
    current_password: string;
    new_password: string;
  }) {
    try {
      const response = await fetch(`${config.DJANGO_API_URL}/api/user/change-password/`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify(passwordData),
      });
      
      if (!response.ok) throw new Error('Failed to change password');
      return response.json();
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }
}