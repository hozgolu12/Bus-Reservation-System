import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.create(createRouteDto);
  }

  @Get()
  findAll(
    @Query('source') source?: string,
    @Query('destination') destination?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.routesService.findAll({ source, destination, page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(+id);
  }

  @Get(':id/buses')
  findBusesByRoute(@Param('id') id: string) {
    return this.routesService.findBusesByRoute(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routesService.update(+id, updateRouteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routesService.remove(+id);
  }
}