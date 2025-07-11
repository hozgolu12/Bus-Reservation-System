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
}

export interface ITicket {
  id?: number;
  user: number; // Assuming user ID
  ticket_number?: string;
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  route_id: string;
  route_name: string;
  bus_id: string;
  bus_number: string;
  departure_date: string; // Date string
  departure_time: string; // Time string
  arrival_time: string; // Time string
  seat_numbers: number[]; // Array of seat numbers
  price_per_seat: number;
  total_price: number;
  status?: 'confirmed' | 'cancelled' | 'completed';
  booking_date?: string; // DateTime string
  updated_at?: string; // DateTime string
  operator?: string; // Added for frontend display
  amenities?: string[]; // Added for frontend display
  feedback?: string; // Added for frontend display
  rating?: number; // Added for frontend display
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
  route: IRoute; // Assuming IRoute is defined elsewhere
  route_id: number;
  created_at?: string;
  updated_at?: string;
  available_seats?: number; // Virtual field
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
  buses?: IBus[]; // One-to-many relationship
  created_at?: string;
  updated_at?: string;
}
