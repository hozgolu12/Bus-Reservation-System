import { NextRequest } from 'next/server';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'operator' | 'superadmin';
  operatorId?: string;
  isActive: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasRole: (role: string | string[]) => boolean;
  isOperator: () => boolean;
  isSuperAdmin: () => boolean;
}

export const getUserFromToken = (token: string): User | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.user_id || payload.id,
      username: payload.username,
      email: payload.email,
      role: payload.role || 'user',
      operatorId: payload.operator_id,
      isActive: payload.is_active !== false,
    };
  } catch (error) {
    return null;
  }
};

export const hasPermission = (userRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(userRole);
};

export const withAuth = (allowedRoles: string[] = []) => {
  return (WrappedComponent: React.ComponentType<any>) => {
    return function AuthenticatedComponent(props: any) {
      // This would be implemented with your auth context
      // For now, returning the component directly
      return <WrappedComponent {...props} />;
    };
  };
};