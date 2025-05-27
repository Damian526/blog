'use client';

import RichText from '@/components/common/RichText';
import {
  PostContainer,
  PostTitle,
  PostMeta,
  PostBody,
} from '@/styles/components/posts/Post.styles';

interface PostContentProps {
  post: {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    author: {
      name: string | null;
      email: string;
    };
    _count: {
      comments: number;
    };
  };
}

// This is a Server Component - no 'use client' directive
export default function PostContent({ post }: PostContentProps) {
  return (
    <PostContainer>
      <PostTitle>{post.title}</PostTitle>
      <PostMeta>
        By {post.author.name || post.author.email} •{' '}
        {new Date(post.createdAt).toLocaleDateString()} • {post._count.comments}{' '}
        comments
      </PostMeta>
      <PostBody>
        <RichText html={post.content} />
      </PostBody>
    </PostContainer>
  );
}
