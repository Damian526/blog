'use client';

import Link from 'next/link';
import {
  Card,
  Title,
  ButtonContainer,
  Author,
  ActionButton,
  StatusBadge,
  StatusContainer,
  CategoriesContainer,
  CategoryList,
  CategoryTag,
} from '@/styles/components/posts/PostCard.styles';

interface Author {
  name: string;
  email: string;
}

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  category: Category;
}

interface Post {
  id: number;
  title: string;
  content?: string;
  published: boolean;
  declineReason?: string;
  createdAt: string;
  author: Author;
  subcategories?: Subcategory[];
}

interface PostCardProps {
  post: Post;
  showActions?: boolean;
  onDelete?: (postId: number) => void;
}

export default function PostCard({
  post,
  showActions = false,
  onDelete,
}: PostCardProps) {
  const handleDelete = () => {
    if (
      onDelete &&
      window.confirm('Are you sure you want to delete this post?')
    ) {
      onDelete(post.id);
    }
  };

  // Determine status text and type
  let statusText = 'Status: Pending';
  let statusType: 'published' | 'rejected' | 'pending' = 'pending';

  if (post.published) {
    statusText = 'Status: Published';
    statusType = 'published';
  } else if (post.declineReason) {
    statusText = `Status: Rejected — Reason: ${post.declineReason}`;
    statusType = 'rejected';
  }

  return (
    <Card>
      <Title>{post.title}</Title>

      <Author>
        By {post.author.name} on {new Date(post.createdAt).toLocaleDateString()}
      </Author>

      {/* Place subcategories below the Author */}
      {post.subcategories && post.subcategories.length > 0 && (
        <CategoriesContainer
          style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}
        >
          <CategoryList>
            {post.subcategories.map((subcat) => (
              <CategoryTag key={subcat.id}>{subcat.name}</CategoryTag>
            ))}
          </CategoryList>
        </CategoriesContainer>
      )}

      <p>{post.content || 'No content available'}...</p>
      <Link href={`/posts/${post.id}`}>Read More</Link>

      {showActions && (
        <div>
          <StatusContainer>
            <StatusBadge status={statusType}>{statusText}</StatusBadge>
          </StatusContainer>
          <ButtonContainer>
            <Link href={`/posts/${post.id}/edit`}>
              <ActionButton>Edit</ActionButton>
            </Link>
            <ActionButton onClick={handleDelete}>Delete</ActionButton>
          </ButtonContainer>
        </div>
      )}
    </Card>
  );
}
