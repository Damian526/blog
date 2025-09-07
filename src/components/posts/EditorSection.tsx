'use client';
import React from 'react';
import { Label, Input } from '@/styles/components/posts/PostForm.styles';
import { Editor, EditorContent } from '@tiptap/react';
import ImageUpload from './ImageUpload';
import styled from 'styled-components';

// Enhanced editor container with proper styling
const EditorContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 200px;
  padding: 8px;

  /* Editor content styling is handled globally in GlobalStyle.ts */
  .ProseMirror {
    outline: none;

    /* Better paragraph spacing */
    p {
      margin-bottom: 1em;
      line-height: 1.6;
    }

    /* Handle empty paragraphs */
    p:empty {
      height: 1.2em;
    }
  }`;

type EditorSectionProps = {
  title: string;
  setTitle: (value: string) => void;
  editor: Editor | null;
};

export default function EditorSection({
  title,
  setTitle,
  editor,
}: EditorSectionProps) {
  return (
    <>
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter the post title"
        required
      />

      <Label htmlFor="content">Content</Label>
      <div style={{ display: 'flex', gap: 4, margin: '4px 0' }}>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          style={{
            padding: '6px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: editor?.isActive('bold') ? '#007bff' : '#f8f9fa',
            color: editor?.isActive('bold') ? 'white' : '#212529',
          }}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          style={{
            padding: '6px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: editor?.isActive('italic') ? '#007bff' : '#f8f9fa',
            color: editor?.isActive('italic') ? 'white' : '#212529',
          }}
        >
          I
        </button>
        <ImageUpload editor={editor} />
      </div>

      {editor && (
        <EditorContainer>
          {/* Renders the TipTap editor content */}
          <EditorContent editor={editor} />
        </EditorContainer>
      )}
    </>
  );
}
