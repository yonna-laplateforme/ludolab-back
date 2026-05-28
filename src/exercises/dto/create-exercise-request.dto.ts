import { IsString, IsNotEmpty } from 'class-validator';

export class CreateExerciseRequestDto {
  @IsString()
  @IsNotEmpty()
  url_image!: string;
}