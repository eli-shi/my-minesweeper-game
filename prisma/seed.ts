import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    await prisma.difficulty.createMany({
        data: [
            { diff_name: 'Easy' },
            { diff_name: 'Medium' },
            { diff_name: 'Hard' },
        ]
    });
    console.log('Seed data inserted successfully.');

}

seed().then(() => prisma.$disconnect());