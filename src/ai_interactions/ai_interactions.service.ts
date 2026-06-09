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
    const responseAxios = await axios.get(cloudinaryUrl, {
      responseType: 'arraybuffer',
    });
    const buffer = Buffer.from(responseAxios.data, 'binary');

    // 2. Convertir le buffer en objet inlineData (Base64) pour Gemini
    const imagePart = {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType: 'image/jpeg', // Ajustez selon le format (image/png, etc.)
      },
    };

    const prompt = `Analyse cette image d'exercice et extrais les informations au format JSON strict. 
Tu dois agir comme un concepteur pédagogique expert. L'objectif est de générer un parcours d'accompagnement étape par étape, que l'élève pourra suivre en autonomie. 

RÈGLE D'OR : Tu ne dois JAMAIS donner la réponse directe de l'exercice principal. Ton but est de fournir la leçon, les méthodes et les indices pour que l'élève trouve par lui-même.

Génère UNIQUEMENT un objet JSON valide structuré de cette manière :

{
  "title": "Titre de l'exercice ou sujet principal",
  "level": "Niveau estimé (ex: Lycée, Collège, 6ème, etc.)",
  "description": "Description complète de l'exercice avec toutes les informations affichées dans l'image",
  "steps": [
    {
      "step_number": 1,
      "title": "Révision de la leçon",
      "description": "Lecture du cours nécessaire pour résoudre l'exercice.",
      "content": "Génère ici un rappel de cours ultra-synthétique, clair et allant droit au but (Maximum 15 à 20 lignes). Ne mets que ce qui est utile pour l'exercice.",
      "action_for_student": "Pose une question ouverte demandant à l'élève de reformuler ce qu'il a retenu ou compris de cette leçon."
    },
    {
      "step_number": 2,
      "title": "Découverte des méthodes et Entraînement",
      "description": "Comprendre comment réfléchir face à ce problème.",
      "content": "Propose 2 ou 3 méthodes de résolution différentes (ex: une méthode visuelle, une méthode logique/mathématique, une méthode par déduction) pour t'adapter à la psychologie et au type d'intelligence de l'enfant.",
      "action_for_student": "Propose un mini-exercice d'entraînement très simple (sans donner la réponse) pour valider la compréhension des méthodes avant de passer au vrai exercice."
    },
    {
      "step_number": 3,
      "title": "Résolution de l'exercice",
      "description": "C'est à toi de jouer !",
      "content": "Affiche d'abord la 'Consigne officielle' (telle qu'elle est dans l'image), puis fournis une 'Consigne adaptée' (reformulée de manière plus ludique, accessible et simplifiée pour lever les blocages psychologiques).",
      "action_for_student": "Donne 2 ou 3 indices progressifs pour guider la résolution pas à pas. Interdiction stricte de donner la solution finale."
    },
    {
      "step_number": 4,
      "title": "Défi supplémentaire",
      "description": "Pour consolider tes acquis si tu as réussi l'exercice.",
      "content": "Génère un tout nouvel exercice similaire à celui de l'image (mêmes concepts, niveau équivalent), mais avec des consignes, un contexte ou des valeurs différentes.",
      "action_for_student": "Encourage l'élève à résoudre ce nouveau défi en utilisant la méthode qu'il a préférée à l'étape 2."
    }
  ]
}`;

    const response = await this.aiGemini.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [prompt, imagePart],
      config: {
        responseMimeType: 'application/json',
      },
    });

    // Or more simply if you know it's a standard string property:
    if (response.text) {
      console.log(response.text)
      return JSON.parse(response.text);
    }
    return null;
  }
}
