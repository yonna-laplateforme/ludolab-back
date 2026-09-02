import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AiInteractionsService } from 'src/ai_interactions/ai_interactions.service';

@Injectable()
export class ProgressionService {
  constructor(
    private prisma: PrismaService,
    private ai: AiInteractionsService,
  ) {}

  async getOrCreateProgression(exerciseId: number, userId = 1) {
    let progression = await this.prisma.progression.findFirst({
      where: {
        exercise_id: exerciseId,
        user_id: userId,
      },
    });

    if (!progression) {
      progression = await this.prisma.progression.create({
        data: {
          exercise_id: exerciseId,
          user_id: userId,
          current_step: 1,
          status: 'en_cours',
          step_answers: JSON.stringify([]),
        },
      });
    }

    return progression;
  }

  async validateStep(data: {
    exercise_id: number;
    step_number: number;
    student_answer: string;
    user_id?: number;
  }) {
    const userId = data.user_id || 1;

    const exercise = await this.prisma.exercise.findUnique({
      where: { id: data.exercise_id },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercice #${data.exercise_id} introuvable.`);
    }

    let steps: any[] = [];
    try {
      steps = typeof exercise.steps === 'string' ? JSON.parse(exercise.steps) : exercise.steps;
    } catch {
      steps = [];
    }

    const currentStepConfig = steps.find(
      (s: any) => s.step_number === data.step_number,
    ) || {
      step_number: data.step_number,
      title: `Étape ${data.step_number}`,
      content: exercise.description,
      student_question: "Donne ton explication ou calcul.",
      expected_criteria: "Logique et compréhension",
      hint: "",
    };

    // Appel à l'IA pour évaluer la réponse
    const aiResult = await this.ai.validateStudentStep({
      exercise_title: exercise.title || 'Exercice',
      exercise_description: exercise.description,
      step: {
        step_number: currentStepConfig.step_number,
        title: currentStepConfig.title,
        content: currentStepConfig.content,
        student_question: currentStepConfig.student_question || currentStepConfig.action_for_student || '',
        expected_criteria: currentStepConfig.expected_criteria,
        hint: currentStepConfig.hint,
      },
      student_answer: data.student_answer,
    });

    // Récupérer la progression
    const progression = await this.getOrCreateProgression(data.exercise_id, userId);

    let stepAnswersHistory: any[] = [];
    try {
      if (progression.step_answers) {
        stepAnswersHistory = JSON.parse(progression.step_answers);
      }
    } catch {
      stepAnswersHistory = [];
    }

    const newAttempt = {
      step_number: data.step_number,
      student_answer: data.student_answer,
      is_valid: aiResult.is_valid,
      feedback: aiResult.feedback,
      hint: aiResult.hint || null,
      submitted_at: new Date().toISOString(),
    };

    stepAnswersHistory.push(newAttempt);

    const totalSteps = steps.length || 4;
    let nextStep = progression.current_step;
    let newStatus = progression.status;
    let score = progression.score_percentage;

    if (aiResult.is_valid) {
      if (data.step_number >= totalSteps) {
        newStatus = 'termine';
        score = 100;
      } else {
        nextStep = Math.max(progression.current_step, data.step_number + 1);
      }
    }

    const updatedProgression = await this.prisma.progression.update({
      where: { id: progression.id },
      data: {
        current_step: nextStep,
        status: newStatus,
        score_percentage: score,
        step_answers: JSON.stringify(stepAnswersHistory),
        last_activity: new Date(),
      },
    });

    return {
      is_valid: aiResult.is_valid,
      feedback: aiResult.feedback,
      hint: aiResult.hint,
      current_step: updatedProgression.current_step,
      status: updatedProgression.status,
      total_steps: totalSteps,
      step_answers: stepAnswersHistory,
    };
  }
}
