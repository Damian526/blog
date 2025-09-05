'use client';

import { useState } from 'react';
import { Comment } from '@/server/api/types';
import {
  CommentItem,
  Avatar,
  CommentContent,
  CommentHeader,
  Author,
  Timestamp,
  Content,
  CommentActions,
  EditTextarea,
  EditActions,
} from '@/styles/components/comments/EditableComment.styles';

interface EditableCommentProps {
  comment: Comment;
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
  const [editContent, setEditContent] = useState(comment.content || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (editContent.trim() === '') return;

    setIsSaving(true);
    try {
      await onEdit(comment.id, editContent.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save comment:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditContent(comment.content || '');
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const isOwner = currentUserEmail === comment.author.email;

  return (
    <CommentItem $isReply={!!comment.parentId}>
      <Avatar>{getInitials(comment.author.name)}</Avatar>
      <CommentContent>
        <CommentHeader>
          <Author>{comment.author.name}</Author>
          <Timestamp>{formatDate(comment.createdAt)}</Timestamp>
        </CommentHeader>

        {isEditing ? (
          <>
            <EditTextarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Edit your comment..."
              disabled={isSaving}
            />
            <EditActions>
              <button
                className="save"
                onClick={handleSave}
                disabled={isSaving || editContent.trim() === ''}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                className="cancel"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </button>
            </EditActions>
          </>
        ) : (
          <>
            <Content>{comment.content || '[No content]'}</Content>
            <CommentActions>
              {isOwner && (
                <>
                  <span className="edit" onClick={() => setIsEditing(true)}>
                    Edit
                  </span>
                  <span className="delete" onClick={() => onDelete(comment.id)}>
                    Delete
                  </span>
                </>
              )}
              <span onClick={onReplyClick}>Reply</span>
            </CommentActions>
          </>
        )}
      </CommentContent>
    </CommentItem>
  );
}
