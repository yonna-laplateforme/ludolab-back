# Flux de création des Exercices (Intégration Gemini)

Ce module gère la création automatique d'exercices à partir d'une image fournie par l'utilisateur.

## Logique Métier & Workflow
1. Le Frontend envoie uniquement l'URL d'une image via `POST /exercises`.
2. Le `ExerciseController` transmet cette URL au `AiInteractionsService` (Gemini).
3. Gemini analyse l'image et extrait de manière structurée : le titre, le niveau, la description.
4. Une fois le JSON reçu, on y injecte les IDs par défaut (`user_id` et `subject_id`) pour construire le `CreateExerciseDto`.
5. Le `ExerciseService` persiste l'exercice en BDD via Prisma en incluant la relation `subject` pour le retour Front.

## Choix techniques
* **Pourquoi une seule route ?** Nous avons choisi une approche "1-clic" pour fluidifier l'expérience utilisateur, quitte à ce que l'utilisateur modifie l'exercice plus tard s'il y a des erreurs de l'IA.