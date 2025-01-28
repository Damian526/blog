import { useState } from 'react';
import styled from 'styled-components';

const CommentItem = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Author = styled.p`
  font-size: 0.9rem;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Content = styled.p`
  font-size: 1rem;
  line-height: 1.4;
  flex-grow: 1;
  margin-right: 10px;
`;

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
}

interface EditableCommentProps {
  comment: Comment;
  currentUserEmail: string | null;
  onDelete: (commentId: number) => void;
  onEdit: (commentId: number, updatedContent: string) => void;
}

export default function EditableComment({
  comment,
  currentUserEmail,
  onDelete,
  onEdit,
}: EditableCommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleSave = () => {
    onEdit(comment.id, editContent);
    setIsEditing(false);
  };

  return (
    <CommentItem>
      <div>
        <Author>
          {comment.author.name} —{' '}
          {new Date(comment.createdAt).toLocaleDateString()}
        </Author>
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            style={{ width: '100%', marginTop: '10px' }}
          />
        ) : (
          <Content>{comment.content}</Content>
        )}
      </div>
      {currentUserEmail === comment.author.email && (
        <CommentActions>
          {isEditing ? (
            <>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => onDelete(comment.id)}>Delete</button>
            </>
          )}
        </CommentActions>
      )}
    </CommentItem>
  );
}
