'use client';

import { stripHtml } from 'string-strip-html';
import Link from 'next/link';
import {
  Card,
  Header,
  Content,
  Title,
  Meta,
  Categories,
  CategoryTag,
  Actions,
  Footer,
  ReadMore,
  Excerpt,
  ActionButton,
  StatusBadge,
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
  coverImageUrl?: string; // optional header image URL
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
  const subcategories = post.subcategories ?? [];

  const handleDelete = () => {
    if (
      onDelete &&
      window.confirm('Are you sure you want to delete this post?')
    ) {
      onDelete(post.id);
    }
  };

  let statusText = 'Pending';
  let statusType: 'published' | 'rejected' | 'pending' = 'pending';
  if (post.published) {
    statusText = 'Published';
    statusType = 'published';
  } else if (post.declineReason) {
    statusText = `Rejected: ${post.declineReason}`;
    statusType = 'rejected';
  }

  const date = new Date(post.createdAt).toLocaleDateString();
  const categoryColors = ['#e67e22', '#3498db', '#9b59b6', '#27ae60'];

  return (
    <Card>
      {post.coverImageUrl && <Header imgUrl={post.coverImageUrl} />}

      <Content>
        <Title>{post.title}</Title>

        <Meta>
          <span>By {post.author.name}</span>
          <span>•</span>
          <span>{date}</span>
          {showActions && (
            <StatusBadge $status={statusType}>{statusText}</StatusBadge>
          )}
        </Meta>

        {subcategories.length > 0 && (
          <Categories>
            {subcategories.map((sub, i) => (
              <CategoryTag
                key={sub.id}
                color={categoryColors[i % categoryColors.length]}
              >
                {sub.name}
              </CategoryTag>
            ))}
          </Categories>
        )}

        <Excerpt>
          {stripHtml(post.content || 'No content available').result.slice(
            0,
            140,
          )}
          …
        </Excerpt>

        <Footer>
          <ReadMore href={`/posts/${post.id}`}>Read More →</ReadMore>
          {showActions && (
            <Actions>
              <ActionButton $variant="edit">
                <Link href={`/posts/${post.id}/edit`}>Edit</Link>
              </ActionButton>
              <ActionButton $variant="delete" onClick={handleDelete}>
                Delete
              </ActionButton>
            </Actions>
          )}
        </Footer>
      </Content>
    </Card>
  );
}
