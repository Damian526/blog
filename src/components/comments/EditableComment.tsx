'use client';

import { useState } from 'react';
import {
  CommentItem,
  Avatar,
  CommentContent,
  Author,
  Timestamp,
  Content,
  CommentActions,
} from '@/styles/components/comments/EditableComment.styles'; // Import styles

interface EditableCommentProps {
  comment: {
    id: number;
    content: string;
    createdAt: string;
    parentId?: number | null;
    author: {
      name: string;
      email: string;
    };
  };
  currentUserEmail: string | null;
  onDelete: (commentId: number) => void;
  onEdit: (commentId: number, updatedContent: string) => void;
  onReplyClick: () => void;
}

export default function EditableComment({
  comment,
  currentUserEmail,
  onDelete,
  onEdit,
  onReplyClick,
}: EditableCommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleSave = () => {
    onEdit(comment.id, editContent);
    setIsEditing(false);
  };

  return (
    <CommentItem $isReply={!!comment.parentId}>
      <Avatar>{comment.author.name[0]}</Avatar>
      <CommentContent>
        <Author>
          {comment.author.name}{' '}
          <Timestamp>
            {new Date(comment.createdAt).toLocaleDateString()}
          </Timestamp>
        </Author>
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              marginTop: '10px',
              padding: '8px',
              borderRadius: '5px',
            }}
          />
        ) : (
          <Content>{comment.content}</Content>
        )}
        <CommentActions>
          {currentUserEmail === comment.author.email && (
            <>
              {isEditing ? (
                <>
                  <span onClick={handleSave}>Save</span>
                  <span onClick={() => setIsEditing(false)}>Cancel</span>
                </>
              ) : (
                <>
                  <span onClick={() => setIsEditing(true)}>Edit</span>
                  <span onClick={() => onDelete(comment.id)}>Delete</span>
                </>
              )}
            </>
          )}
          <span onClick={onReplyClick}>Reply</span>
        </CommentActions>
      </CommentContent>
    </CommentItem>
  );
}
