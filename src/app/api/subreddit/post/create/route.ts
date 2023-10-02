import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostValidator } from '@/lib/validators/post'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { title, content, subredditId } = PostValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // verify user is subscribed to passed subreddit id
    const subscription = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    })

    if (!subscription) {
      return new Response('Subscribe to post', { status: 403 })
    }

    const createdPost = await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subredditId,
      },
    })


    let text: string = '';

    if (createdPost.content) {
        try {
            const contentObject = JSON.parse(createdPost.content);
            if (contentObject && contentObject.blocks && contentObject.blocks.length > 0) {
                const firstBlock = contentObject.blocks[0];
                if (firstBlock && firstBlock.data && firstBlock.data.text) {
                    text = firstBlock.data.text;
                }
            }
        } catch (error) {
            // Handle JSON parsing error, if necessary
            console.error('Error parsing JSON:', error);
        }
    }
  
    
    const responseContent = {
      id: createdPost.id,
      content: text,
    };
    
    return new Response(JSON.stringify(responseContent), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      'Could not post to subreddit at this time. Please try later',
      { status: 500 }
    )
  }
}
