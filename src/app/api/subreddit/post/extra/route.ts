import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

export async function GET(req: Request) {
  try {
    // Create a new Prisma client instance for every request
    const prisma = new PrismaClient();

    // Retrieve the latest post
    let latestPost = await prisma.post.findFirst({
      select: {
        id: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    // Close the Prisma client connection after the query is executed
    await prisma.$disconnect();

    // Return the retrieved data as JSON in the response
    return new Response(JSON.stringify(latestPost), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Handle errors and return an appropriate response
    return new Response('Could not fetch posts from the database.', { status: 500 });
  }
}
