export interface IUser {
  id: string;
  username: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  total_bookings: number;
  last_login: string;
  role: string;
  token?: string;
}

export interface ITicket {
  id?: number;
  user: number;
  ticket_number?: string;
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
  status?: 'confirmed' | 'cancelled' | 'completed';
  booking_date?: string;
  updated_at?: string;
  operator?: string;
  amenities?: string[];
  feedback?: string;
  rating?: number;
}

export interface ISeat {
  number: number;
  row: number;
  position: number;
  isOccupied: boolean;
  type: 'premium' | 'standard';
  reservedBy: string | null;
  reservedAt: Date | null;
}

export interface IBus {
  id?: number;
  bus_number: string;
  type: string;
  operator: string;
  total_seats: number;
  seat_map: ISeat[];
  departure_time: string;
  arrival_time: string;
  price: number;
  rating?: number;
  amenities?: string[];
  is_active?: boolean;
  route: IRoute;
  route_id: number;
  created_at?: string;
  updated_at?: string;
  available_seats?: number;
}

export interface IRoute {
  id?: number;
  name: string;
  source: string;
  destination: string;
  distance: string;
  duration: string;
  base_price: number;
  amenities?: string[];
  is_active?: boolean;
  buses?: IBus[];
  created_at?: string;
  updated_at?: string;
}

export interface IOperator {
  id: string;
  username: string;
  email: string;
  company_name: string;
  contact_phone: string;
  is_active: boolean;
  date_joined: string;
  total_buses: number;
  total_routes: number;
  total_bookings: number;
}

export interface IAdminStats {
  totalUsers: number;
  totalOperators: number;
  totalBuses: number;
  activeBookings: number;
  recentActivity: Array<{
    id: string;
    type: string;
    action: string;
    user: string;
    time: string;
  }>;
  alerts: Array<{
    id: string;
    severity: 'info' | 'warning' | 'error';
    message: string;
  }>;
}