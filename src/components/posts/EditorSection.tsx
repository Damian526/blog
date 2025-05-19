'use client';
import React from 'react';
import { Label, Input } from '@/styles/components/posts/PostForm.styles';
import { Editor, EditorContent } from '@tiptap/react';

type EditorSectionProps = {
  title: string;
  setTitle: (value: string) => void;
  editor: Editor | null;
  handleAddImage: () => void;
};

export default function EditorSection({
  title,
  setTitle,
  editor,
  handleAddImage,
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
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          I
        </button>
        <button type="button" onClick={handleAddImage}>
          📷
        </button>
      </div>

      {editor && (
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: 4,
            minHeight: 200,
            padding: 8,
          }}
        >
          {/* Renders the TipTap editor content */}
          <EditorContent editor={editor} />
        </div>
      )}
    </>
  );
}
