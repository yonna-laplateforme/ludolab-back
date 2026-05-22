import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom du sujet est obligatoire' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: "L'icône est obligatoire" })
  icon: string;
}