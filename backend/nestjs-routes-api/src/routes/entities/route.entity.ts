import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Bus } from '../../buses/entities/bus.entity';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 100 })
  source: string;

  @Column({ length: 100 })
  destination: string;

  @Column({ length: 50 })
  distance: string;

  @Column({ length: 50 })
  duration: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  base_price: number;

  @Column({ type: 'json', nullable: true })
  amenities: string[];

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => Bus, bus => bus.route)
  buses: Bus[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}