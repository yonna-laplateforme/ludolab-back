import { IsNotEmpty, IsString,IsStrongPassword } from "class-validator";

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  identifier!: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({minLength: 8,minUppercase:1,minSymbols:1,minNumbers:1})
  password!: string;
}