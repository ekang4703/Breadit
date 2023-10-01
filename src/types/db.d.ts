import type { Post, Subreddit, User, Vote, Comment } from '@prisma/client'
import type { PrismaClient } from '@prisma/client';

declare namespace NodeJS {
  interface Global {
    cachedPrisma?: PrismaClient;
  }
}

export type ExtendedPost = Post & {
  subreddit: Subreddit
  votes: Vote[]
  author: User
  comments: Comment[]
}
