'use client';

import styled from 'styled-components';
import { useState } from 'react';

const CommentItem = styled.div<{ $isReply?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  background-color: ${({ $isReply }) =>
    $isReply ? '#f9f9f9' : '#fff'}; /* Light gray for replies */
  margin-top: 10px;
  margin-left: ${({ $isReply }) =>
    $isReply ? '30px' : '0'}; /* Indent replies */
  border: ${({ $isReply }) => ($isReply ? '1px solid #ddd' : 'none')};
  box-shadow: ${({ $isReply }) =>
    $isReply ? 'none' : '0px 4px 8px rgba(0, 0, 0, 0.1)'};
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc; /* Placeholder avatar */
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #fff;
`;

const CommentContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Author = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Timestamp = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const Content = styled.div`
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
  margin-top: 8px;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 8px;
  font-size: 0.9rem;
  color: #1877f2;
  cursor: pointer;

  & > span:hover {
    text-decoration: underline;
  }
`;

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
