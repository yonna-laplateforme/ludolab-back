import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleGenAI } from '@google/genai';
import axios from 'axios';

@Injectable()
export class AiInteractionsService {
  private aiGemini: GoogleGenAI;
  constructor(private prisma: PrismaService) {
    this.aiGemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async create(data: {
    user_id: number;
    exercise_id: number;
    user_question: string;
    ai_response: string;
    help_type: string;
  }) {
    return this.prisma.aiInteraction.create({
      data: data,
    });
  }

  async findAll() {
    return this.prisma.aiInteraction.findMany(); 
  }

  async findOne(id: number) {
    return this.prisma.aiInteraction.findUnique({
      where: { id },
    });
  }

  async remove(id: number) {
    return this.prisma.aiInteraction.delete({
      where: { id },
    });
  }

  async generateExerciceDetails(cloudinaryUrl: string) {
    try {
      // Si l'utilisateur envoie un PDF, Cloudinary convertit la 1ère page en .jpg
      let fetchUrl = cloudinaryUrl;
      if (fetchUrl.toLowerCase().endsWith('.pdf')) {
        fetchUrl = fetchUrl.replace(/\.pdf$/i, '.jpg');
      }

      const responseAxios = await axios.get(fetchUrl, {
        responseType: 'arraybuffer',
      });
      const buffer = Buffer.from(responseAxios.data);

      const contentTypeHeader = (responseAxios.headers['content-type'] as string) || 'image/jpeg';
      const cleanMimeType = contentTypeHeader.split(';')[0].trim();

      const imagePart = {
        inlineData: {
          data: buffer.toString('base64'),
          mimeType: cleanMimeType.startsWith('image/') ? cleanMimeType : 'image/jpeg',
        },
      };

    const prompt = `Tu es un concepteur pédagogique et enseignant expert pour la plateforme LudoLab.
Analyse cette image et extrais ou génère les informations au format JSON strict.

RÈGLE ABSOLUE DE SÉCURITÉ ET QUALITÉ :
1. VÉRIFICATION DU DOCUMENT :
   - Vérifie si l'image représente un exercice scolaire, un devoir, une évaluation, un problème, une figure géométrique, un schéma ou un document pédagogique d'étude.
   - Si l'image est une photo de personne/selfie, un animal, un paysage, un véhicule, un meme, un objet sans rapport, une image totalement floue ou illisible, ou du contenu inapproprié :
     Définis "is_valid_exercise": false, et "rejection_reason": "L'image fournie ne semble pas être un exercice scolaire ou un document pédagogique exploitable. Merci de photographier un énoncé ou un schéma d'exercice."
   - Si l'image est un exercice ou document scolaire valide :
     Définis "is_valid_exercise": true et "rejection_reason": null.

2. RÈGLE D'OR PÉDAGOGIQUE :
   - Ne donne JAMAIS la solution finale directe de l'exercice ! Ton rôle est de guider l'élève pas à pas pour qu'il comprenne et résolve son exercice en toute autonomie.

3. ÉNONCÉ & MATIÈRE :
   - Identifie la matière scolaire précise ("Mathématiques", "Français", "Histoire-Géographie", "Physique-Chimie", "SVT", "Anglais", "Philosophie", "Autre").
   - Si l'énoncé est textuellement présent sur l'image, retranscris-le fidèlement dans "statement". Si l'image ne contient qu'une figure/graphique/formule sans texte de question explicite, formule un énoncé clair, pertinent et adapté basé sur le contenu visuel.

Génère UNIQUEMENT un objet JSON valide structuré comme suit :

{
  "is_valid_exercise": true,
  "rejection_reason": null,
  "subject_name": "Mathématiques",
  "title": "Titre explicite et concis de l'exercice",
  "level": "Niveau estimé (ex: 6ème, Collège (4ème - 3ème), Lycée (Seconde), etc.)",
  "statement": "Énoncé complet extrait de l'image ou formulé fidèlement",
  "description": "Synthèse et présentation pédagogique de l'exercice (ce qu'on cherche à apprendre et comprendre)",
  "steps": [
    {
      "step_number": 1,
      "title": "Rappel de cours & Compréhension",
      "description": "Les notions indispensables pour aborder l'exercice.",
      "content": "Rappel de cours synthétique, simple et ciblé (10 à 15 lignes max) avec les définitions ou formules utiles.",
      "student_question": "Question ouverte posée à l'élève pour vérifier qu'il a compris la notion clé.",
      "expected_criteria": "Éléments et mots-clés que la réponse de l'élève doit contenir pour être validée.",
      "hint": "Indice d'aide bienveillant si l'élève hésite."
    },
    {
      "step_number": 2,
      "title": "Méthode de résolution",
      "description": "Comment structurer son raisonnement.",
      "content": "Présentation d'une méthode étape par étape (ou 2 approches complémentaires) pour attaquer le problème.",
      "student_question": "Mini-application ou question demandant à l'élève d'identifier la première action à mener.",
      "expected_criteria": "La démarche logique attendue de l'élève.",
      "hint": "Indice sur la méthode à privilégier."
    },
    {
      "step_number": 3,
      "title": "Résolution guidée",
      "description": "Mise en application sur l'exercice principal.",
      "content": "Consigne adaptée et reformulée de manière ludique pour débloquer le raisonnement sans donner la réponse finale.",
      "student_question": "Question guidée invitant l'élève à formuler son raisonnement et sa réponse finale à l'exercice.",
      "expected_criteria": "Critères de justesse du raisonnement et du résultat attendu.",
      "hint": "Indice progressif pour débloquer le calcul ou la rédaction."
    },
    {
      "step_number": 4,
      "title": "Défi supplémentaire & Consolidation",
      "description": "Pour ancrer durablement la compétence acquise.",
      "content": "Un mini-défi similaire avec d'autres valeurs ou un autre exemple pour s'entraîner.",
      "student_question": "Résous ce mini-défi en appliquant ce que tu viens d'apprendre.",
      "expected_criteria": "Critères de validation du défi.",
      "hint": "Indice d'encouragement."
    }
  ]
}`;

    const response = await this.aiGemini.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
      contents: [prompt, imagePart],
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (response.text) {
      try {
        const parsed = JSON.parse(response.text);
        return parsed;
      } catch (err) {
        console.error('Erreur parsing JSON Gemini:', err);
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error('Erreur generateExerciceDetails Gemini:', error);
    return null;
  }
}

  async validateStudentStep(data: {
    exercise_title: string;
    exercise_description: string;
    step: {
      step_number: number;
      title: string;
      content: string;
      student_question: string;
      expected_criteria?: string;
      hint?: string;
    };
    student_answer: string;
  }): Promise<{
    is_valid: boolean;
    feedback: string;
    hint?: string;
  }> {
    try {
      const prompt = `Tu es un tuteur pédagogique bienveillant et stimulant sur la plateforme LudoLab.
Ton objectif est d'évaluer la réponse d'un élève pour une étape spécifique d'un exercice scolaire.

CONTEXTE DE L'EXERCICE :
- Titre : ${data.exercise_title}
- Description / Énoncé : ${data.exercise_description}

ÉTAPE ACTUELLE (${data.step.step_number} / ${data.step.title}) :
- Contenu / Leçon : ${data.step.content}
- Question posée à l'élève : ${data.step.student_question}
- Critères attendus : ${data.step.expected_criteria || 'Bonne compréhension et logique'}
- Indice prévu : ${data.step.hint || ''}

RÉPONSE FOURNIE PAR L'ÉLÈVE :
"${data.student_answer}"

RÈGLES D'ÉVALUATION :
1. Sois bienveillant, encourageant et constructif.
2. Si la réponse de l'élève est juste, montre une bonne compréhension ou est sur la bonne voie :
   - "is_valid": true
   - "feedback": Un message chaleureux qui félicite l'élève et résume pourquoi sa démarche est bonne.
3. Si la réponse est incomplète, fausse ou hors-sujet :
   - "is_valid": false
   - "feedback": Un message encourageant qui pointe gentiment où se trouve l'erreur sans le décourager.
   - "hint": Un indice clair pour lui permettre de corriger sa réponse sans lui donner directement la solution.
4. RÈGLE STRICTE : Ne donne JAMAIS la réponse brute finale des étapes suivantes.

Génère UNIQUEMENT un objet JSON valide structuré ainsi :
{
  "is_valid": true,
  "feedback": "Super explication ! Tu as bien identifié que...",
  "hint": "Si besoin, pense à..."
}`;

      const response = await this.aiGemini.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
        contents: [prompt],
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        try {
          return JSON.parse(response.text);
        } catch (err) {
          console.error('Erreur parsing JSON validation step:', err);
          return {
            is_valid: false,
            feedback: "Une erreur est survenue lors de l'analyse. Veuillez réessayer.",
          };
        }
      }

      return {
        is_valid: false,
        feedback: "Impossible d'obtenir une réponse de l'assistant pédagogique.",
      };
    } catch (error) {
      console.error('Erreur validateStudentStep Gemini:', error);
      return {
        is_valid: false,
        feedback: "Une erreur est survenue lors de la communication avec le tuteur IA.",
      };
    }
  }
}
