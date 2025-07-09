import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateBusDto {
  @IsString()
  @IsNotEmpty()
  bus_number: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  operator: string;

  @IsNumber()
  total_seats: number;

  @IsString()
  @IsNotEmpty()
  departure_time: string;

  @IsString()
  @IsNotEmpty()
  arrival_time: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsArray()
  @IsOptional()
  amenities?: string[];

  @IsNumber()
  route_id: number;
}