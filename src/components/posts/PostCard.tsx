'use client';

import { stripHtml } from 'string-strip-html';
import Link from 'next/link';
import { Post } from '@/server/api';
import {
  Card,
  Header,
  Content,
  Title,
  Meta,
  CategoryTag,
  Actions,
  Footer,
  ReadMore,
  Excerpt,
  ActionButton,
  StatusBadge,
  AuthorAvatar,
  ReadingTime,
  CardHeader,
  TagsContainer,
} from '@/styles/components/posts/PostCard.styles';

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

  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const categoryColors = [
    '#3498db',
    '#e67e22',
    '#9b59b6',
    '#27ae60',
    '#e74c3c',
    '#f39c12',
  ];

  const wordCount = stripHtml(post.content || '').result.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card as={Link} href={`/posts/${post.id}`}>
      {/* TODO: Add coverImageUrl to Post schema when image upload is implemented */}
      {false ? (
        <Header imgUrl={''}>
          {subcategories.length > 0 && (
            <TagsContainer $overlay>
              {subcategories.slice(0, 2).map((sub, i) => (
                <CategoryTag
                  key={sub.id}
                  color={categoryColors[i % categoryColors.length]}
                >
                  {sub.name}
                </CategoryTag>
              ))}
              {subcategories.length > 2 && (
                <CategoryTag color="#64748b">
                  +{subcategories.length - 2}
                </CategoryTag>
              )}
            </TagsContainer>
          )}
          {showActions && (
            <StatusBadge $status={statusType} $overlay>
              {statusText}
            </StatusBadge>
          )}
        </Header>
      ) : (
        <CardHeader>
          {subcategories.length > 0 && (
            <TagsContainer $overlay>
              {subcategories.slice(0, 2).map((sub, i) => (
                <CategoryTag
                  key={sub.id}
                  color={categoryColors[i % categoryColors.length]}
                >
                  {sub.name}
                </CategoryTag>
              ))}
              {subcategories.length > 2 && (
                <CategoryTag color="#64748b">
                  +{subcategories.length - 2}
                </CategoryTag>
              )}
            </TagsContainer>
          )}
          <StatusBadge $status={statusType} $overlay>
            {statusText}
          </StatusBadge>
        </CardHeader>
      )}

      <Content>
        <Title>{post.title}</Title>

        <Excerpt>
          {stripHtml(post.content || 'No content available').result.slice(
            0,
            120,
          )}
          {post.content && stripHtml(post.content).result.length > 120 && '...'}
        </Excerpt>

        <Meta>
          <AuthorAvatar>{getInitials(post.author.name)}</AuthorAvatar>
          <div className="metadata">
            <span className="author">{post.author.name}</span>
            <span className="separator">•</span>
            <span className="date">{date}</span>
            <span className="separator">•</span>
            <ReadingTime>{readingTime} min read</ReadingTime>
          </div>
        </Meta>

        {!showActions && (
          <ReadMore onClick={(e) => e.stopPropagation()}>
            Read more <span>→</span>
          </ReadMore>
        )}

        {showActions && (
          <Footer>
            <Actions>
              <ActionButton
                $variant="edit"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/posts/${post.id}/edit`;
                }}
              >
                <span>✏️</span>
                Edit
              </ActionButton>
              <ActionButton
                $variant="delete"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <span>🗑️</span>
                Delete
              </ActionButton>
            </Actions>
            {!post.published && (
              <ReadMore
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/posts/${post.id}`;
                }}
              >
                Preview <span>👁️</span>
              </ReadMore>
            )}
          </Footer>
        )}
      </Content>
    </Card>
  );
}
