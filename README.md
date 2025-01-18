
## Getting Started
First, install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Secondly, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:4006](http://localhost:4006) with your browser to see the result or see deployed version - [https://vercel.com/damians-projects-d2f33c16/blog](https://vercel.com/damians-projects-d2f33c16/blog).


## Features

### Authentication
🔒 User authentication using next-auth with session management.
🛡️ Secure login and registration forms with modal-based UI.
### Blog Post Management
📝 Create new blog posts dynamically, linked to the authenticated user.
📖 View all posts with detailed content and author information.
✅ Published and unpublished posts differentiation.
🔄 Real-time updates for posts using SWR.
### User Dashboard
👤 Personalized dashboard for authenticated users.
📜 Displays a list of user-specific blog posts.
🛠️ Interactive interface to manage posts.
### API Integration
🌐 RESTful APIs powered by Prisma and Next.js App Router.
🛡️ Authentication-protected APIs ensuring secure access.
🔍 Fetch and manage blog posts with efficient querying.
### Real-Time Updates
⚡ Dynamic data fetching and caching using SWR.
🔁 Automatic revalidation of data on focus and reconnect.
### Backend
🗄️ Powered by Prisma ORM with PostgreSQL.
🧩 Models for User and Post with relational mappings.
🔐 Secure backend implementation for CRUD operations.



