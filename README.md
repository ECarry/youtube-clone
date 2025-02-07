# YouTube Clone Project 🎥

A comprehensive guide to building a full-featured YouTube clone application.

📺 [Watch the Full Tutorial @CodeWithAntonio](https://www.youtube.com/watch?si=oP2_MMRY_Jc61GSn&v=ArmPzvHTcfQ&feature=youtu.be)

## Key Features 🚀

### Video Management

- 🎬 Video infrastructure & storage (powered by MuxHQ)
- 📝 Automatic video transcription
- 🖼️ Smart thumbnail generation
- 🤖 AI-powered background jobs (using Upstash)

### User Features

- 📊 Creator Studio with analytics
- 🗂️ Playlist management system
- 💬 Interactive comments
- 👍 Like and subscription system
- 🎯 Watch history tracking
- 🔐 User authentication (powered by Clerk)

### Technical Stack 💻

#### Core Technologies

- 🚀 Next.js 15
- ⚛️ React 19
- 🔄 tRPC for type-safe APIs

#### Database & Storage

- 🗄️ PostgreSQL (Neon Database)
- 🔍 DrizzleORM

#### UI/UX

- 💅 TailwindCSS
- 🎨 shadcn/ui
- 📱 Responsive design

# Setup ⚙️

- Configure environment

  - runtime (Node.js, Bun)
  - package manager (npm, pnpm, bun)

- Why Bun?
  - Easily run TypeScript scripts with ES6 imports
  - Less issues with dependency issues regarding React 19
  - Establish basic Bun commands
    - bun add === npm install
    - bunx === npx

# Database setup 🌵

- Create a Postgres database([neon](https://www.neon.tech))
- Setup Drizzle ORM
- Create users schema
- Migrate changes to database
- Learn how to use drizzle-kit

## Why Drizzle ORM?

- Only ORM with both relational and SQL-Like query APIs
- Serverless by default
- Forcing us to 'understand' our queries

### Prisma-like querying

```javascript
const result = await db.query.users.findMany({
  with: {
    posts: true,
  },
});
```

### SQL-like querying

```javascript
const result = await db
  .select()
  .from(countries)
  .leftJoin(cities, eq(cities.countryId, countries.id))
  .where(eq(cities.id, 1));
```

# Webhook sync 🌈

- Create ngrok account (or any other local tunnel solution)
- Obtain a static domain
- Add script to concurrently run local tunnel & app
- Create the users webhook
- Connect the webhook on Clerk dashboard

# tRpc setup 🥥

## Why tRpc?

- end-to-end typesafety
- familiar hooks(useQuery, useMutation, useInfiniteQuery)
- v11 allows us to do authenticated prefetching
