import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET(req: Request) {
  try {
    // Retrieve data from the database (for example, all posts)
    const users = await db.user.findMany({
      select: {
        name: true,
      },
    });

    // Return the retrieved data as JSON in the response
    return new Response(JSON.stringify(users), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Handle errors and return an appropriate response
    return new Response('Could not fetch posts from the database.', { status: 500 });
  }
}
