import Link from 'next/link';
import styled from 'styled-components';

// Styled Components
const Card = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  margin-top: 15px;
`;

const ActionButton = styled.button`
  background-color: #0070f3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 10px;

  &:hover {
    background-color: #005bb5;
  }

  &:last-child {
    margin-right: 0;
  }
`;

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
  createdAt: string; // ISO string
  author: Author;
}

interface PostCardProps {
  post: Post; // Accept a `post` object as a prop
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
      <p>{post.content || 'No content available'}...</p>
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
