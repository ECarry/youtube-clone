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
- 🔐 User authentication (powered by Better Auth)

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

# tRPC setup 🥥

## Why tRPC?

- end-to-end typesafety
- familiar hooks(useQuery, useMutation, useInfiniteQuery)
- v11 allows us to do authenticated prefetching

### Why not X (Hono.js)?

- not possible to prefetch authenticated queries

The main limitation of Hono.js in this context is the inability to prefetch authenticated queries. Here's why this matters:

#### Authentication State Handling

```typescript
// tRPC approach
// Server components can directly access auth state
async function ProtectedPage() {
  // Can prefetch authenticated data directly on the server
  const userData = await trpc.auth.getUser.prefetch();
  return <Component data={userData} />;
}

// Hono + React Query approach
// ❌ Can't use in server components
("use client");
function ProtectedPage() {
  // Auth queries can only happen on the client
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: () => client.getUser(),
  });
}
```

#### Impact on Performance

- Additional network roundtrips required
- Waterfall data loading pattern
- Increased time to first meaningful paint
- Loading flickers and content delays

### Why prefetch?

#### 1. "Render as you fetch" concept

Modern data fetching pattern that starts loading data before rendering:

```typescript
// Traditional way (fetch-on-render)
function OldComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // ❌ Only starts fetching after render
    fetchData().then(setData);
  }, []);
}

// Render as you fetch (with tRPC)
async function NewComponent() {
  // ✅ Start fetching immediately
  const dataPromise = trpc.data.query.prefetch();

  return (
    <Suspense fallback={<Loading />}>
      <AsyncContent promise={dataPromise} />
    </Suspense>
  );
}
```

#### 2. Leverage RSCs as "loaders"

React Server Components act as efficient data loaders:

```typescript
// Server Component as data loader
async function BlogPostLoader({ id }: { id: string }) {
  // ✅ Load data directly on the server
  const post = await trpc.posts.getPost.fetch({ id });
  const comments = await trpc.comments.list.fetch({ postId: id });

  return (
    <article>
      <PostContent post={post} />
      <Suspense fallback={<CommentsSkeleton />}>
        <Comments initialData={comments} />
      </Suspense>
    </article>
  );
}
```

#### 3. Faster Load Time & 4. Parallel Data Loading

Achieve optimal performance through parallel data fetching:

```typescript
async function DashboardPage() {
  // ✅ Fetch multiple data sources in parallel
  const [userData, posts, analytics, notifications] = await Promise.all([
    trpc.users.getProfile.prefetch(),
    trpc.posts.list.prefetch(),
    trpc.analytics.summary.prefetch(),
    trpc.notifications.recent.prefetch(),
  ]);

  return (
    <Layout>
      <UserProfile data={userData} />
      <RecentPosts posts={posts} />
      <AnalyticsDashboard data={analytics} />
      <NotificationPanel notifications={notifications} />
    </Layout>
  );
}
```

### Benefits

1. **Performance**

   - Reduced total loading time
   - Avoided serial requests
   - Optimized first paint

2. **User Experience**

   - Progressive loading
   - Faster interaction response
   - Smoother page transitions

3. **Developer Experience**

   - Declarative data fetching
   - Type safety
   - Simplified error handling

4. **Resource Utilization**
   - Reduced server load
   - Optimized bandwidth usage
   - Better cache utilization

# tRPC configuration

- Enable transformer on tRPC
- Add auth to tRPC context
- Add protected procedure
- Add rate limiting

# Video categories

- Create categories schema
- Push changes to the database
- Seed categories
- Prefetch categories
- Create categories component

# Studio layout

- Create studio route group
- Create studio layout
- Protect studio routes

## AI background jobs

why background jobs?

- avoid timeout from long-running tasks
  - problematic with AI generations
- ensure retries in case of failure
