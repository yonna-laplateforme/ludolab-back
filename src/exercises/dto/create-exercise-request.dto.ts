import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseRequestDto {
    @ApiProperty({ 
        description: "L'URL de l'image de l'exercice à analyser par l'IA",
        example: 'https://mon-stockage.com/image_exercice.png' // Fournit un exemple concret au Front !
    })
    @IsString()
    @IsNotEmpty()
    url_image!: string;
}