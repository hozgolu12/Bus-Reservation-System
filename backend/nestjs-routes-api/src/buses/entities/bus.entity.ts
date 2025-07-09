import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Route } from '../../routes/entities/route.entity';

export class Seat {
  number: number;
  row: number;
  position: number;
  isOccupied: boolean;
  type: 'premium' | 'standard';
  reservedBy: string | null;
  reservedAt: Date | null;
}

@Entity('buses')
export class Bus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  bus_number: string;

  @Column({ length: 100 })
  type: string;

  @Column({ length: 100 })
  operator: string;

  @Column()
  total_seats: number;

  @Column({ type: 'json' })
  seat_map: Seat[];

  @Column({ type: 'time' })
  departure_time: string;

  @Column({ type: 'time' })
  arrival_time: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 4.0 })
  rating: number;

  @Column({ type: 'json', nullable: true })
  amenities: string[];

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => Route, route => route.buses)
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @Column()
  route_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Virtual field for available seats count
  get available_seats(): number {
    return this.seat_map.filter(seat => !seat.isOccupied).length;
  }
}