import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UnprocessableEntityException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ExerciseService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { AiInteractionsService } from '../ai_interactions/ai_interactions.service';
import { SubjectsService } from '../subjects/subjects.service';
import { ProgressionService } from '../progression/progression.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseRequestDto } from './dto/create-exercise-request.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Exercises')
@Controller('exercises')
export class ExerciseController {
  constructor(
    private readonly exerciseService: ExerciseService,
    private readonly ai: AiInteractionsService,
    private readonly subjectsService: SubjectsService,
    private readonly progressionService: ProgressionService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Créer un exercice automatiquement via une image (Gemini)',
  })
  @ApiResponse({
    status: 201,
    description: "L'exercice a été créé avec succès.",
  })
  async create(@Body() body: CreateExerciseRequestDto) {
    try {
      const exerciseJson = await this.ai.generateExerciceDetails(body.url_image);

      if (!exerciseJson) {
        throw new UnprocessableEntityException(
          "Impossible d'analyser l'image transmise. Veuillez vérifier la qualité du fichier et réessayer.",
        );
      }

      // Vérification du document : Si ce n'est pas un exercice
      if (exerciseJson.is_valid_exercise === false) {
        throw new UnprocessableEntityException(
          exerciseJson.rejection_reason ||
            "L'image fournie n'a pas été reconnue comme un exercice ou un devoir scolaire valide. Merci d'importer une photo d'un exercice ou d'un énoncé.",
        );
      }

      // Détection ou création dynamique de la matière
      const subject = await this.subjectsService.findOrCreateByName(
        exerciseJson.subject_name || 'Général',
      );

      // Récupération sécurisée d'un utilisateur existant (uniquement l'ID pour éviter les erreurs de date)
      let defaultUser = await this.prisma.user.findFirst({
        select: { id: true },
      });

      if (!defaultUser) {
        defaultUser = await this.prisma.user.create({
          data: {
            first_name: 'Élève',
            last_name: 'LudoLab',
            email: 'eleve@ludolab.fr',
            username: 'eleve',
            password: 'demo',
            role: 'student',
            country: 'France',
            birthday: new Date('2010-01-01'),
          },
          select: { id: true },
        });
      }

      // Construction de la description / énoncé complet
      let fullDescription = exerciseJson.description || '';
      if (exerciseJson.statement && exerciseJson.statement.trim() !== '') {
        fullDescription = `**Énoncé :**\n${exerciseJson.statement}\n\n**Objectif :**\n${exerciseJson.description}`;
      }

      const createExerciseDto: CreateExerciseDto = {
        user_id: defaultUser.id,
        subject_id: subject.id,
        image_path: body.url_image,
        title: exerciseJson.title || 'Exercice sans titre',
        level: exerciseJson.level || 'Non spécifié',
        description: fullDescription,
        steps: JSON.stringify(exerciseJson.steps || []),
      };

      const savedExercise = await this.exerciseService.create(createExerciseDto);

      // Initialisation automatique de la progression pour cet exercice
      const progression = await this.progressionService.getOrCreateProgression(
        savedExercise.id,
        defaultUser.id,
      );

      return {
        ...savedExercise,
        progression,
      };
    } catch (err: any) {
      console.error("Erreur lors de la création de l'exercice:", err);
      if (err instanceof UnprocessableEntityException) {
        throw err;
      }
      throw new InternalServerErrorException(
        err?.message || "Erreur serveur lors de la création de l'exercice.",
      );
    }
  }

  @Get()
  findAll() {
    return this.exerciseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exerciseService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exerciseService.remove(+id);
  }
}
