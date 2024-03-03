## DAY 1

# Start with hono (npm create hono) & then define some api

# Get postgres url (neondb,aevian) and to make it function in serverless env we need connection pool to get connection pool url(Prisma accelerate)

# Initiate prisma using (npm i prisma , npx prisma init)

# Add database url to schema.prisma and update wrangler.toml(contain env variable taken by cloudfare worker) with connection pool url.

# Schema

-> Build model schema in schema.prisma file
-> Migrate your database (For ex: npx prisma migrate dev --name init_schema)
