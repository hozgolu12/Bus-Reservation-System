import { IsArray, IsNumber, ArrayNotEmpty } from 'class-validator';

export class ReserveSeatDto {
  @IsArray()
  @ArrayNotEmpty()
  seat_numbers: number[];

  @IsNumber()
  user_id: number;
}