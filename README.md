Open [http://localhost:4006](http://localhost:4006) with your browser to see the result or see deployed version - [blog-six-omega-22.vercel.app](blog-six-omega-22.vercel.app).

Credantials for admin:
Email: admin@admin.pl
Password: !1234567


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

## Features

### 🛡️ Authentication
- Secure NextAuth-based user authentication with session management.
- Email-based account activation to prevent spam registrations.
- Modal-based login & registration UI for a seamless experience.
 
### 📝 Blog Post Management
- Users can create and submit posts, which are reviewed by admins before publishing.
- Published & Unpublished Status: Users see whether their posts are approved, rejected (with reason), or pending review.
- Admin Panel for Post Management: Admins can approve, reject (with a reason), or delete posts.
- Rich Text Support: Write engaging articles with markdown support.
- Real-Time Updates: Changes reflect instantly without page refresh using SWR.

### 👤 User Dashboard
- Personalized dashboard for authenticated users.
- Displays all user-created blog posts with their current status:
    - ✅ Published (Live on the site)
    - ❌ Rejected (With admin-provided reason)
    - ⏳ Pending Review (Awaiting approval)
- Interactive tools to edit or delete posts before publishing.

### 💬 Comment System
- Users can add, edit, delete, and reply to comments on blog posts.
- Comments are linked to authenticated users for accountability.
- Real-time comment updates for a seamless discussion experience.

### 🛠️ Admin Panel
- Manage Users:
    - View all registered users.
    - Delete non-admin users if necessary.
- Manage Blog Posts:
    - Approve or reject posts submitted by users.
    - If rejecting a post, admins can provide a reason, which will be visible to the user.
    - Ensure only high-quality and relevant web development articles are published.

### 🌐 API Integration
- RESTful APIs powered by Prisma and Next.js App Router.
- Authentication-protected APIs ensuring secure access.
- Fetch and manage blog posts with efficient querying.

### ⚡ Real-Time Updates

- SWR-powered dynamic data fetching for blog posts, comments, and user dashboards.
- Automatic revalidation ensures users always see the latest content.   

### 🗄️ Backend & Database

- PostgreSQL as the database, managed using Prisma ORM.
- Relational models for Users, Posts, and Comments.
- Secure backend implementation for authentication, post moderation, and data access control.

### Testing (Jest)

- Unit and integration tests with Jest ensure system reliability.
- Basic test coverage for authentication, blog posts, and comment system.

### 🔍 Search Posts by Category & Subcategory
- **Overview:**  
  Users can now search for blog posts by selecting a specific category and/or subcategory.  
- **Usage:**  
  Append query parameters to the search URL. For example:  
  ```
  /search?category=2&subcategory=5
  ```  
  This will display a list of posts filtered by the specified category and subcategory.
- **API Integration:**  
  The client component uses these query parameters to hit a dedicated API endpoint, which returns the matching posts.
- **User Experience:**  
  If no posts are found matching the criteria, an informative message is displayed.
