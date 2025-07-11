const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3002';

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
    const url = new URL(`${API_GATEWAY_URL}/api/admin/users/`);
    url.searchParams.append('page', page.toString());
    if (search) url.searchParams.append('search', search);
    
    const response = await fetch(url.toString(), {
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  }

  static async blockUser(token: string, userId: string) {
    const response = await fetch(`${API_GATEWAY_URL}/api/admin/users/${userId}/block/`, {
      method: 'PATCH',
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) throw new Error('Failed to block user');
    return response.json();
  }

  static async unblockUser(token: string, userId: string) {
    const response = await fetch(`${API_GATEWAY_URL}/api/admin/users/${userId}/unblock/`, {
      method: 'PATCH',
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) throw new Error('Failed to unblock user');
    return response.json();
  }

  // Super Admin - Operator Management
  static async getAllOperators(token: string, page: number = 1) {
    const url = new URL(`${API_GATEWAY_URL}/api/admin/operators/`);
    url.searchParams.append('page', page.toString());
    
    const response = await fetch(url.toString(), {
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) throw new Error('Failed to fetch operators');
    return response.json();
  }

  static async createOperator(token: string, operatorData: {
    username: string;
    email: string;
    password: string;
    company_name: string;
    contact_phone: string;
  }) {
    const response = await fetch(`${API_GATEWAY_URL}/api/admin/operators/`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(operatorData),
    });
    
    if (!response.ok) throw new Error('Failed to create operator');
    return response.json();
  }

  static async deleteOperator(token: string, operatorId: string) {
    const response = await fetch(`${API_GATEWAY_URL}/api/admin/operators/${operatorId}/`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) throw new Error('Failed to delete operator');
    return response.ok;
  }

  // Dashboard Stats
  static async getDashboardStats(token: string) {
    const response = await fetch(`${API_GATEWAY_URL}/api/admin/dashboard/stats/`, {
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  }

  // Audit Logs
  static async getAuditLogs(token: string, page: number = 1) {
    const url = new URL(`${API_GATEWAY_URL}/api/admin/audit-logs/`);
    url.searchParams.append('page', page.toString());
    
    const response = await fetch(url.toString(), {
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) throw new Error('Failed to fetch audit logs');
    return response.json();
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
    const response = await fetch(`${API_GATEWAY_URL}/api/operator/profile/`, {
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) throw new Error('Failed to fetch operator profile');
    return response.json();
  }

  static async updateProfile(token: string, profileData: any) {
    const response = await fetch(`${API_GATEWAY_URL}/api/operator/profile/`, {
      method: 'PATCH',
      headers: this.getHeaders(token),
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  }

  static async deleteAccount(token: string) {
    const response = await fetch(`${API_GATEWAY_URL}/api/operator/delete/`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) throw new Error('Failed to delete account');
    return response.ok;
  }

  // Operator Bus Management
  static async getMyBuses(token: string) {
    const response = await fetch(`${API_GATEWAY_URL}/api/operator/buses`, {
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) throw new Error('Failed to fetch buses');
    return response.json();
  }

  static async createBus(token: string, busData: any) {
    const response = await fetch(`${API_GATEWAY_URL}/api/operator/buses`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(busData),
    });
    
    if (!response.ok) throw new Error('Failed to create bus');
    return response.json();
  }

  static async updateBus(token: string, busId: string, busData: any) {
    const response = await fetch(`${API_GATEWAY_URL}/api/operator/buses/${busId}`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify(busData),
    });
    
    if (!response.ok) throw new Error('Failed to update bus');
    return response.json();
  }

  static async deleteBus(token: string, busId: string) {
    const response = await fetch(`${API_GATEWAY_URL}/api/operator/buses/${busId}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) throw new Error('Failed to delete bus');
    return response.ok;
  }

  // Operator Route Management
  static async getMyRoutes(token: string) {
    const response = await fetch(`${API_GATEWAY_URL}/api/operator/routes`, {
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) throw new Error('Failed to fetch routes');
    return response.json();
  }

  static async createRoute(token: string, routeData: any) {
    const response = await fetch(`${API_GATEWAY_URL}/api/operator/routes`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(routeData),
    });
    
    if (!response.ok) throw new Error('Failed to create route');
    return response.json();
  }

  static async updateRoute(token: string, routeId: string, routeData: any) {
    const response = await fetch(`${API_GATEWAY_URL}/api/operator/routes/${routeId}`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify(routeData),
    });
    
    if (!response.ok) throw new Error('Failed to update route');
    return response.json();
  }

  static async deleteRoute(token: string, routeId: string) {
    const response = await fetch(`${API_GATEWAY_URL}/api/operator/routes/${routeId}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) throw new Error('Failed to delete route');
    return response.ok;
  }

  // Operator Dashboard Stats
  static async getDashboardStats(token: string) {
    const response = await fetch(`${API_GATEWAY_URL}/api/operator/dashboard/stats/`, {
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
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
    const response = await fetch(`${API_GATEWAY_URL}/api/user/profile/`, {
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
  }

  static async updateProfile(token: string, profileData: any) {
    const response = await fetch(`${API_GATEWAY_URL}/api/user/profile/`, {
      method: 'PATCH',
      headers: this.getHeaders(token),
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  }

  static async deleteAccount(token: string) {
    const response = await fetch(`${API_GATEWAY_URL}/api/user/delete/`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) throw new Error('Failed to delete account');
    return response.ok;
  }

  static async changePassword(token: string, passwordData: {
    current_password: string;
    new_password: string;
  }) {
    const response = await fetch(`${API_GATEWAY_URL}/api/user/change-password/`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(passwordData),
    });
    
    if (!response.ok) throw new Error('Failed to change password');
    return response.json();
  }
}