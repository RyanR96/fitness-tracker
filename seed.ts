import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Exercise Templates

  const [benchPress, overheadPress, dips] = await Promise.all([
    prisma.exerciseTemplate.upsert({
      where: { name: "Bench Press" },
      update: {},
      create: { name: "Bench Press" },
    }),
    prisma.exerciseTemplate.upsert({
      where: { name: "Overhead Press" },
      update: {},
      create: { name: "Overhead Press" },
    }),
    prisma.exerciseTemplate.upsert({
      where: { name: "Dips" },
      update: {},
      create: { name: "Dips" },
    }),
  ]);

  //Upserting user

  const user = await prisma.user.upsert({
    where: { username: "ryan" },
    update: {},
    create: { username: "ryan", password: "123" },
  });

  // Create workout

  const workout = await prisma.workout.create({
    data: {
      name: "Push day 1",
      userId: user.id,
      exercises: {
        create: [
          { exerciseTemplateName: benchPress.name },
          { exerciseTemplateName: overheadPress.name },
          { exerciseTemplateName: dips.name },
        ],
      },
    },
  });

  // Completed workout

  const completedWorkout = await prisma.completedWorkout.create({
    data: {
      date: new Date(),
      userId: user.id,
      workoutId: workout.id,
      exercises: {
        create: [
          {
            exerciseTemplateName: benchPress.name,
            set: {
              create: [
                { reps: 10, weight: 70, formRating: 10, dropset: false },
                { reps: 6, weight: 70, formRating: 10, dropset: false },
                { reps: 6, weight: 60, formRating: 8, dropset: false },
              ],
            },
          },
          {
            exerciseTemplateName: overheadPress.name,
            set: {
              create: [
                { reps: 8, weight: 40, formRating: 10, dropset: false },
                { reps: 6, weight: 40, formRating: 6, dropset: false },
                { reps: 4, weight: 40, formRating: 6, dropset: false },
                { reps: 3, weight: 30, formRating: 10, dropset: true },
              ],
            },
          },
          {
            exerciseTemplateName: dips.name,
            set: {
              create: [{ reps: 10, weight: 0, formRating: 10, dropset: false }],
            },
          },
        ],
      },
    },
    include: {
      exercises: {
        include: {
          set: true,
          exerciseTemplate: true,
        },
      },
    },
  });
}

main()
  .catch(e => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
