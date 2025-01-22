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
  editable?: boolean; // Optional prop to show the "Edit" button
}

export default function PostCard({ post, editable = false }: PostCardProps) {
  return (
    <Card>
      <Title>{post.title}</Title>
      <p>{post.content || 'No content available'}...</p>
      <Link href={`/posts/${post.id}`}>Read More</Link>
      {editable && (
        <Link href={`/posts/${post.id}/edit`}>
          <button style={{ marginLeft: '10px' }}>Edit</button>
        </Link>
      )}
    </Card>
  );
}
