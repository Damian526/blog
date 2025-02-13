'use client';

import Link from 'next/link';
import {
  Card,
  Title,
  ButtonContainer,
  Author,
  ActionButton,
} from '@/styles/components/posts/PostCard.styles'; // Import styles

// Interfaces
interface Author {
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content?: string;
  published: boolean;
  declineReason?: string;
  createdAt: string; // ISO string
  author: Author;
}

interface PostCardProps {
  post: Post;
  showActions?: boolean; // Optional prop to show edit and delete buttons
  onDelete?: (postId: number) => void; // Optional delete handler
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

  return (
    <Card>
      <Title>{post.title}</Title>
      <Author>
        By{' '}
        {`${post?.author?.name} on ${new Date(post.createdAt).toLocaleDateString()}`}
      </Author>
      <p>{post.content || 'No content available'}...</p>
      <p>
        {post.published
          ? 'This post is published.'
          : post.declineReason
            ? `Declined: ${post.declineReason}`
            : 'Not published yet.'}
      </p>
      <Link href={`/posts/${post.id}`}>Read More</Link>
      {showActions && (
        <ButtonContainer>
          <Link href={`/posts/${post.id}/edit`}>
            <ActionButton>Edit</ActionButton>
          </Link>
          <ActionButton onClick={handleDelete}>Delete</ActionButton>
        </ButtonContainer>
      )}
    </Card>
  );
}
