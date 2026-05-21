import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// 1. On force le chargement du fichier .env avant que Prisma ne lise la suite
dotenv.config();

export default defineConfig({
  datasource: {
    // 2. Maintenant, process.env.DATABASE_URL contiendra bien ton lien MySQL !
    url: process.env.DATABASE_URL,
  },
});