import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET(req: Request) {
  try {
    // Retrieve the latest post using raw SQL query
    let latestPost = await db.$queryRaw`SELECT * FROM Post ORDER BY id DESC LIMIT 1`;

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

