import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Route } from './entities/route.entity';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
  ) {}

  async create(createRouteDto: CreateRouteDto): Promise<Route> {
    const route = this.routeRepository.create(createRouteDto);
    return await this.routeRepository.save(route);
  }

  async findAll(filters: {
    source?: string;
    destination?: string;
    page: number;
    limit: number;
  }) {
    const { source, destination, page, limit } = filters;
    const skip = (page - 1) * limit;

    const queryBuilder = this.routeRepository.createQueryBuilder('route')
      .leftJoinAndSelect('route.buses', 'buses')
      .where('route.is_active = :isActive', { isActive: true });

    if (source) {
      queryBuilder.andWhere('route.source ILIKE :source', { source: `%${source}%` });
    }

    if (destination) {
      queryBuilder.andWhere('route.destination ILIKE :destination', { destination: `%${destination}%` });
    }

    const [routes, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: routes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Route> {
    const route = await this.routeRepository.findOne({
      where: { id },
      relations: ['buses'],
    });

    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }

    return route;
  }

  async findBusesByRoute(routeId: number) {
    const route = await this.routeRepository.findOne({
      where: { id: routeId },
      relations: ['buses'],
    });

    if (!route) {
      throw new NotFoundException(`Route with ID ${routeId} not found`);
    }

    return {
      route: {
        id: route.id,
        name: route.name,
        source: route.source,
        destination: route.destination,
        distance: route.distance,
        duration: route.duration,
      },
      buses: route.buses.filter(bus => bus.is_active),
    };
  }

  async update(id: number, updateRouteDto: UpdateRouteDto): Promise<Route> {
    const route = await this.findOne(id);
    Object.assign(route, updateRouteDto);
    return await this.routeRepository.save(route);
  }

  async remove(id: number): Promise<void> {
    const route = await this.findOne(id);
    route.is_active = false;
    await this.routeRepository.save(route);
  }
}