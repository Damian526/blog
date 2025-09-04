'use client';

import RichText from '@/components/common/RichText';
import { Post } from '@/server/api';
import {
  PostContainer,
  PostTitle,
  PostMeta,
  PostBody,
} from '@/styles/components/posts/Post.styles';

interface PostContentProps {
  post: Post;
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
