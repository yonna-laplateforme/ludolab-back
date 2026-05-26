import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleGenAI } from '@google/genai';
import axios from 'axios';

@Injectable()
export class AiInteractionsService {
  private aiGemini: GoogleGenAI;
  constructor(private prisma: PrismaService ) {
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
      // ◄ Ajout du "s"
      data: data,
    });
  }

  async findAll() {
    return this.prisma.aiInteraction.findMany(); // ◄ Ajout du "s"
  }

  async findOne(id: number) {
    return this.prisma.aiInteraction.findUnique({
      // ◄ Ajout du "s"
      where: { id },
    });
  }

  async remove(id: number) {
    return this.prisma.aiInteraction.delete({
      // ◄ Ajout du "s"
      where: { id },
    });
  }

  async generateExerciceDetails(cloudinaryUrl: string) {
    const responseAxios = await axios.get(cloudinaryUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(responseAxios.data, 'binary');
    
    // 2. Convertir le buffer en objet inlineData (Base64) pour Gemini
    const imagePart = {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType: 'image/jpeg', // Ajustez selon le format (image/png, etc.)
      },
    };

    const prompt = `Analyse cette image d'exercice et extrait les informations au format JSON suivant :
    {
      "title": "Titre de l'exercice ou sujet principal",
      "level": "Niveau estimé (ex: Lycée, Collège, 6ème, etc.)",
      "description": "Description de l'exercice complet avec tous les informations affiché dans l'image"
    }`;
    
    const response = await this.aiGemini.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [prompt, imagePart],
      config: {
        responseMimeType: 'application/json'
      }
    });

    // Or more simply if you know it's a standard string property:
    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  }
}
