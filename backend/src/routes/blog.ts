import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt';
import { createBlogInput, updateBlogInput } from "@sushil-01/medium-common";
export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  },
  Variables: {
    userId: string
  }

}>();

// Middleware 

blogRouter.use('/*', async (c, next) => {
  const header = c.req.header("Authorization") || ""
  console.log('headerlll', header);

  const token = header.split(" ")[1]
  console.log('response from token', c.env.JWT_SECRET);

  try {
    const response = await verify(token, c.env.JWT_SECRET)
    console.log('response from middleware', response);
    if (response.id) {
      c.set("userId", response.id);
      await next()
    } else {
      c.status(403);
      return c.json({ error: "Unauthorized" });
    }
  } catch (error) {
    c.status(403);
    return c.json({ error: "Unauthorized" });
  }

})
blogRouter.post('/', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();
  const userId = c.get('userId')
  console.log('con', body.title, body.content, userId);

  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(403);
    return c.json({ error: "Invalid blog input" })
  }

  try {
    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId
      }
    })

    return c.json({ id: blog.id })

  } catch (error) {
    c.status(403);
    return c.json({ error: "Error while signing up" })
  }

})

blogRouter.put('/', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();
  const userId = c.get('userId')
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(403);
    return c.json({ error: "Invalid update blog input" })
  }
  try {
    const blog = await prisma.post.update({
      where: {
        id: body.id
      },
      data: {
        title: body.title,
        content: body.content,
        authorId: userId
      }
    })

    return c.json({ id: blog.id })

  } catch (error) {
    c.status(403);
    return c.json({ error: "Error while updating  blog" })
  }
})

blogRouter.get('/bulk', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())


  try {
    const blog = await prisma.post.findMany()

    if (!blog) {
      c.status(403);
      return c.json({ error: "Blog not found" })

    }
    return c.json({ blog })

  } catch (error) {
    c.status(403);
    return c.json({ error: "Error while updating  blog" })
  }
})





blogRouter.get('/:id', async (c) => {
  const id = c.req.param('id')
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())


  try {
    const blog = await prisma.post.findFirst({
      where: {
        id: id
      },
    })
    console.log('id', id);


    if (!blog) {
      c.status(403);
      return c.json({ error: "Blog not found" })

    }
    return c.json({ blog })

  } catch (error) {
    c.status(403);
    return c.json({ error: "Error while updating  blog" })
  }
})

