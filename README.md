# Setup

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
