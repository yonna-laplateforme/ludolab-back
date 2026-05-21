import { PrismaClient } from '@prisma/client';
import chalk from 'chalk';

// Constructeur totalement vide, conforme à Prisma 7
const prisma = new PrismaClient();

async function main() {
  console.log(chalk.blue.bold("\n🚀 [PRISMA] Tentative de connexion à la base 'ludolab' !"));
  console.log(chalk.dim("--------------------------------------------------"));

  // Noms de tables basés sur ton db pull (au singulier si jamais "users" bloque)
  const targetUsers = await prisma.users.findMany({ take: 3 });
  
  console.log(chalk.yellow.bold("\n👥 [BASE DE DONNÉES] Échantillon des Utilisateurs :"));
  if (targetUsers.length === 0) {
    console.log(chalk.italic.gray(" Aucun utilisateur trouvé dans la table."));
  } else {
    console.dir(targetUsers, { colors: true });
  }
}

main()
  .catch((e) => {
    console.error(chalk.red.bold("\n❌ [ERREUR] Le script a rencontré un problème :"), e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log(chalk.cyan.dim("\n🔌 Déconnexion propre du client Prisma.\n"));
  });