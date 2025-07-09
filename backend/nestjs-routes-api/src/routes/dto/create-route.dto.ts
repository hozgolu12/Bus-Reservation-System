import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsString()
  @IsNotEmpty()
  distance: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsNumber()
  base_price: number;

  @IsArray()
  @IsOptional()
  amenities?: string[];
}