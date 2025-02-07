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

## Why not X (Hono.js)?

- 不能预取认证查询(prefetch authenticated queries)

### 1.核心问题-认证状态的处理

```typescript
// tRPC 的方式
// 服务器组件可以直接访问认证状态
async function ProtectedPage() {
  // 可以在服务器端直接预取需要认证的数据
  const userData = await trpc.auth.getUser.prefetch();
  return <Component data={userData} />;
}

// Hono + React Query 的方式
// ❌ 不能在服务器组件中使用
("use client");
function ProtectedPage() {
  // 认证查询只能在客户端进行
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: () => client.getUser(),
  });
}
```

### 2.预取的时机

- tRPC 可以在服务器端完成认证检查和数据预取
- Hono + React Query 必须等到客户端代码执行才能获取认证状态

### 3.实际影响

```typescript
// tRPC 方式：一次请求完成所有操作
async function DashboardPage() {
  // ✅ 服务器端同时处理认证和数据获取
  const [user, posts, notifications] = await Promise.all([
    trpc.auth.getUser.prefetch(),
    trpc.posts.list.prefetch(),
    trpc.notifications.list.prefetch(),
  ]);
  return <Dashboard user={user} posts={posts} notifications={notifications} />;
}

// Hono + React Query 方式：需要多次往返
("use client");
function DashboardPage() {
  // ❌ 需要先获取认证状态
  const { data: auth } = useQuery(["auth"]);
  // ❌ 然后才能获取需要认证的数据
  const { data: posts } = useQuery(["posts"], {
    enabled: !!auth, // 依赖认证状态
  });
  // ❌ 瀑布式的数据获取
  const { data: notifications } = useQuery(["notifications"], {
    enabled: !!auth,
  });
}
```

#### 影响和后果

1. 性能影响

- 额外的网络往返
- 瀑布式的数据加载
- 首屏加载时间增加

2. 用户体验

- 可能出现加载闪烁
- 内容加载延迟
- 分阶段渲染

3. 开发复杂性

```typescript
// tRPC：简洁明了
export const createRouter = t.router({
  protectedRoute: t.procedure
    .use(isAuthed) // 中间件处理认证
    .query(async ({ ctx }) => {
      // 已认证的查询
      return ctx.db.getData();
    }),
});

// Hono：需要额外处理
app.use("/api/*", async (c, next) => {
  // 需要在每个需要认证的路由中处理
  const auth = await authenticate(c);
  if (!auth) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
});
```

## Why prefetch?

- "render as you fetch" concept
- leverage RSCs as "loaders"
- faster load time
- parallel data loading

### Render as you fetch

这是一种现代的数据获取模式，不同于传统的 "fetch-on-render" 或 "fetch-then-render"。

```typescript
// 传统方式 (fetch-on-render)
function OldComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // ❌ 等待渲染后才开始获取数据
    fetchData().then(setData);
  }, []);
}

// Render as you fetch (使用 tRPC)
async function NewComponent() {
  // ✅ 数据获取与渲染同时开始
  const dataPromise = trpc.data.query.prefetch();

  // 可以立即开始渲染UI框架
  return (
    <Suspense fallback={<Loading />}>
      <AsyncContent promise={dataPromise} />
    </Suspense>
  );
}
```

### RSCs as "loaders"

利用 React Server Components (RSCs) 作为数据加载器：

```typescript
// Server Component 作为数据加载器
async function BlogPostLoader({ id }: { id: string }) {
  // ✅ 在服务器端直接加载数据
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

// 客户端组件接收预加载的数据
("use client");
function Comments({ initialData }) {
  // ✅ 使用预加载的数据，避免客户端重新请求
  const { data } = useQuery({
    queryKey: ["comments"],
    queryFn: () => trpc.comments.list.query(),
    initialData,
  });
}
```

### Faster load time

通过并行数据加载和服务器端预取实现更快的加载时间：

```typescript
// 快速加载时间示例
async function DashboardPage() {
  // ✅ 并行预取多个数据源
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

### Parallel data loading

通过并行数据加载实现更快的加载时间和更好的用户体验：

```typescript
// ❌ 瀑布式数据加载 (不好的方式)
async function SerialLoadingPage() {
  // 串行加载，每个请求都要等待前一个完成
  const user = await getUser();
  const posts = await getUserPosts(user.id);
  const comments = await getPostComments(posts[0].id);
}

// ✅ 并行数据加载 (好的方式)
async function ParallelLoadingPage() {
  // 1. 定义所有数据获取操作
  const queries = {
    user: trpc.users.getUser.prefetch(),
    posts: trpc.posts.list.prefetch(),
    categories: trpc.categories.list.prefetch(),
    tags: trpc.tags.list.prefetch(),
  };

  // 2. 并行执行所有查询
  const data = await Promise.all(Object.values(queries));

  // 3. 使用 Suspense 优化加载体验
  return (
    <Layout>
      <Suspense fallback={<UserSkeleton />}>
        <UserSection data={data.user} />
      </Suspense>
      <Suspense fallback={<PostsSkeleton />}>
        <PostsSection data={data.posts} />
      </Suspense>
    </Layout>
  );
}
```

### 这些特性的优势

1. 更好的性能

- 减少总加载时间
- 避免串行请求
- 优化首屏加载

2. 更好的用户体验

- 渐进式加载
- 更快的交互响应
- 更流畅的页面转换

3. 更好的开发体验

- 声明式数据获取
- 类型安全
- 更容易的错误处理

4. 更好的资源利用

- 减少服务器负载
- 优化带宽使用
- 更好的缓存利用
