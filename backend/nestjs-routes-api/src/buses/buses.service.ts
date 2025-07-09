import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bus } from './entities/bus.entity';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { ReserveSeatDto } from './dto/reserve-seat.dto';

@Injectable()
export class BusesService {
  constructor(
    @InjectRepository(Bus)
    private busRepository: Repository<Bus>,
  ) {}

  async create(createBusDto: CreateBusDto): Promise<Bus> {
    // Generate seat map based on total seats
    const seatMap = this.generateSeatMap(createBusDto.total_seats);
    
    const bus = this.busRepository.create({
      ...createBusDto,
      seat_map: seatMap,
    });
    
    return await this.busRepository.save(bus);
  }

  async findAll(): Promise<Bus[]> {
    return await this.busRepository.find({
      where: { is_active: true },
      relations: ['route'],
    });
  }

  async findOne(id: number): Promise<Bus> {
    const bus = await this.busRepository.findOne({
      where: { id },
      relations: ['route'],
    });

    if (!bus) {
      throw new NotFoundException(`Bus with ID ${id} not found`);
    }

    return bus;
  }

  async update(id: number, updateBusDto: UpdateBusDto): Promise<Bus> {
    const bus = await this.findOne(id);
    Object.assign(bus, updateBusDto);
    return await this.busRepository.save(bus);
  }

  async reserveSeats(id: number, reserveSeatDto: ReserveSeatDto): Promise<Bus> {
    const bus = await this.findOne(id);
    const { seat_numbers, user_id } = reserveSeatDto;

    // Check if seats are available
    const seatMap = [...bus.seat_map];
    for (const seatNumber of seat_numbers) {
      const seat = seatMap.find(s => s.number === seatNumber);
      if (!seat) {
        throw new BadRequestException(`Seat ${seatNumber} does not exist`);
      }
      if (seat.isOccupied) {
        throw new BadRequestException(`Seat ${seatNumber} is already occupied`);
      }
    }

    // Reserve the seats
    for (const seatNumber of seat_numbers) {
      const seatIndex = seatMap.findIndex(s => s.number === seatNumber);
      seatMap[seatIndex] = {
        ...seatMap[seatIndex],
        isOccupied: true,
        reservedBy: user_id,
        reservedAt: new Date(),
      };
    }

    bus.seat_map = seatMap;
    return await this.busRepository.save(bus);
  }

  async cancelSeats(id: number, reserveSeatDto: ReserveSeatDto): Promise<Bus> {
    const bus = await this.findOne(id);
    const { seat_numbers, user_id } = reserveSeatDto;

    // Release the seats
    const seatMap = [...bus.seat_map];
    for (const seatNumber of seat_numbers) {
      const seatIndex = seatMap.findIndex(s => s.number === seatNumber);
      if (seatIndex !== -1) {
        seatMap[seatIndex] = {
          ...seatMap[seatIndex],
          isOccupied: false,
          reservedBy: null,
          reservedAt: null,
        };
      }
    }

    bus.seat_map = seatMap;
    return await this.busRepository.save(bus);
  }

  async remove(id: number): Promise<void> {
    const bus = await this.findOne(id);
    bus.is_active = false;
    await this.busRepository.save(bus);
  }

  private generateSeatMap(totalSeats: number): any[] {
    const seats = [];
    const occupiedSeats = Math.floor(totalSeats * 0.3); // 30% occupied
    const occupiedSeatNumbers = new Set();
    
    // Randomly select occupied seats
    while (occupiedSeatNumbers.size < occupiedSeats) {
      occupiedSeatNumbers.add(Math.floor(Math.random() * totalSeats) + 1);
    }

    for (let i = 1; i <= totalSeats; i++) {
      seats.push({
        number: i,
        row: Math.ceil(i / 4),
        position: ((i - 1) % 4) + 1,
        isOccupied: occupiedSeatNumbers.has(i),
        type: i <= 4 ? 'premium' : 'standard',
        reservedBy: occupiedSeatNumbers.has(i) ? 'system' : null,
        reservedAt: occupiedSeatNumbers.has(i) ? new Date() : null,
      });
    }

    return seats;
  }
}