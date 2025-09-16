# WebDevSphere 🌐

A modern, full-stack blog platform focused on web development articles, built with Next.js 14, TypeScript, and Prisma.

## 🚀 Live Demo

- **Production**: [blog-six-omega-22.vercel.app](https://blog-six-omega-22.vercel.app)
- **Local Development**: [http://localhost:4006](http://localhost:4006)

### Demo Credentials
- **Admin Access**: `admin@admin.pl` / `!1234567`

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm/yarn/pnpm/bun

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Configure your database and other environment variables
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

## ✨ Features

### 🛡️ Authentication & Security
- **NextAuth Integration**: Secure authentication with session management
- **Email Verification**: Account activation system to prevent spam
- **Role-Based Access**: Admin and user roles with proper permissions
- **Modal UI**: Seamless login & registration experience
- **Password Security**: Encrypted password storage

### 📝 Content Management
- **Post Creation**: Rich text editor with markdown support
- **Admin Moderation**: Review system for all user submissions
- **Status Tracking**: Real-time status updates (Published/Pending/Rejected)
- **Rejection Feedback**: Admins can provide detailed rejection reasons
- **Draft System**: Save and edit posts before submission
- **Category Organization**: Comprehensive category and subcategory system

### � User Experience
- **Personal Dashboard**: Track all your posts and their status
- **Profile Management**: Customizable user profiles with avatars
- **Responsive Design**: Mobile-first, responsive UI
- **Real-time Updates**: SWR-powered live data synchronization
- **Interactive Filtering**: Filter posts by categories and subcategories

### 💬 Advanced Comment System
- **Threaded Comments**: Reply to comments with nested structure
- **Real-time Updates**: Live comment updates without page refresh
- **Comment Management**: Edit and delete your own comments
- **User Attribution**: Comments linked to authenticated users
- **Moderation Tools**: Admin oversight of comment content

### 🎯 Admin Panel
- **User Management**: 
  - View all registered users
  - Manage user roles and permissions
  - Delete inactive or problematic accounts
- **Content Moderation**:
  - Approve/reject submitted posts
  - Provide detailed feedback for rejections
  - Bulk actions for efficient moderation
- **Analytics Dashboard**: 
  - User registration trends
  - Post submission statistics
  - Engagement metrics

### 🔍 Advanced Search & Filtering
- **Category-based Search**: Filter posts by main categories
- **Subcategory Refinement**: Drill down with subcategory filters
- **URL Parameter Support**: Bookmarkable search results
- **API Integration**: Efficient backend filtering
- **Empty State Handling**: Informative messages when no results found

### 🚀 Technical Excellence
- **Modern Stack**: Next.js 14 with App Router
- **Type Safety**: Full TypeScript implementation
- **Database**: PostgreSQL with Prisma ORM
- **API Design**: RESTful APIs with proper error handling
- **Caching Strategy**: SWR for client-side data management
- **Testing**: Jest unit and integration tests
- **CI/CD**: GitHub Actions workflow
- **Deployment**: Optimized for Vercel

### ⚡ Performance & Reliability
- **Client-Side Rendering**: SWR for dynamic content
- **Optimistic Updates**: Immediate UI feedback
- **Error Boundaries**: Graceful error handling
- **Loading States**: Smooth user experience during data fetching
- **Cache Management**: Intelligent data invalidation
- **SEO Optimized**: Proper meta tags and structured data

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Styled Components with CSS-in-JS
- **State Management**: SWR for server state
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form with Zod validation
- **Rich Text**: ProseMirror editor

### Backend
- **Runtime**: Node.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API**: Next.js API Routes
- **Authentication**: NextAuth with JWT
- **Email**: Nodemailer integration

### DevOps & Tools
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel
- **Database Hosting**: Supabase/Neon

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Email verification

### Posts Endpoints
- `GET /api/posts` - Get all published posts
- `POST /api/posts` - Create new post (authenticated)
- `GET /api/posts/[id]` - Get specific post
- `PATCH /api/posts/[id]` - Update post (author/admin)
- `DELETE /api/posts/[id]` - Delete post (author/admin)

### Comments Endpoints
- `GET /api/comments?postId={id}` - Get post comments
- `POST /api/comments` - Create comment (authenticated)
- `PATCH /api/comments/[id]` - Update comment (author)
- `DELETE /api/comments/[id]` - Delete comment (author/admin)

### Admin Endpoints
- `GET /api/admin/users` - Get all users (admin)
- `GET /api/admin/posts` - Get all posts for moderation (admin)
- `PATCH /api/admin/posts/[id]` - Approve/reject posts (admin)
- `GET /api/admin/stats` - Get dashboard statistics (admin)

### Categories Endpoints
- `GET /api/categories` - Get all categories and subcategories

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin panel pages
│   ├── dashboard/         # User dashboard
│   └── posts/             # Post-related pages
├── components/            # React components
│   ├── admin/             # Admin-specific components
│   ├── auth/              # Authentication components
│   ├── comments/          # Comment system components
│   ├── layout/            # Layout components
│   ├── posts/             # Post-related components
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── server/                # Server-side logic
│   └── api/               # API client and types
├── styles/                # Styled components
└── types/                 # TypeScript type definitions
```

## 🧪 Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 🚀 Deployment

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Email (optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourapp.com"
```

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push to main branch

### Manual Build

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Vercel for seamless deployment
- All contributors who helped improve this project

---

**Made with ❤️ for the web development community**
