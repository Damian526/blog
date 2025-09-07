'use client';
import React, { useState, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { uploadImage } from '@/lib/supabase';
import styled from 'styled-components';

const ImageUploadContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ImageButton = styled.button`
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: #e0e0e0;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 2px;
  background: #007bff;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
  border-radius: 1px;
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: #ff4444;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  margin-top: 4px;

  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 8px;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid #ff4444;
  }
`;

const ImagePreview = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
  margin-top: 4px;
  min-width: 200px;
`;

const PreviewImage = styled.img`
  max-width: 200px;
  max-height: 150px;
  object-fit: contain;
  border-radius: 4px;
`;

const PreviewInfo = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: #666;
`;

const ActionButtons = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;

  &.primary {
    background: #007bff;
    color: white;
  }

  &.secondary {
    background: #6c757d;
    color: white;
  }

  &:hover {
    opacity: 0.8;
  }
`;

type ImageUploadProps = {
  editor: Editor | null;
  onImageUploaded?: (url: string) => void;
};

// Enhanced image processing utilities
const compressImage = (
  file: File, 
  maxWidth: number = 1200, 
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      // Smart resizing based on image orientation and size
      if (width > maxWidth || height > maxWidth) {
        const ratio = Math.min(maxWidth / width, maxWidth / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      // Use better image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        }
      }, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

const validateImage = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file' };
  }

  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'Image must be smaller than 10MB' };
  }

  // Check supported formats
  const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!supportedTypes.includes(file.type)) {
    return { valid: false, error: 'Supported formats: JPEG, PNG, GIF, WebP' };
  }

  return { valid: true };
};

export default function ImageUpload({ editor, onImageUploaded }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleImageSelect = async (file: File) => {
    setError(null);
    
    // Validate image
    const validation = validateImage(file);
    if (!validation.valid) {
      setError(validation.error!);
      return;
    }

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setImageInfo({
      name: file.name,
      size: formatFileSize(file.size)
    });
  };

  const handleImageUpload = async (file: File, shouldCompress: boolean = true) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      let processedFile = file;

      // Compress if requested and file is large
      if (shouldCompress && file.size > 500 * 1024) { // 500KB threshold
        setUploadProgress(25);
        processedFile = await compressImage(file);
      }

      setUploadProgress(50);

      // Upload image
      const url = await uploadImage(processedFile);
      
      setUploadProgress(75);

      // Insert into editor with proper responsive attributes
      if (editor) {
        editor.chain().focus().setImage({ 
          src: url,
          alt: file.name.split('.')[0], // Use filename without extension as alt text
          title: file.name,
        }).run();
      }

      setUploadProgress(100);
      
      // Call callback if provided
      onImageUploaded?.(url);

      // Clean up
      setTimeout(() => {
        setPreviewImage(null);
        setImageInfo(null);
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleConfirmUpload = (compress: boolean = true) => {
    if (previewImage && imageInfo) {
      // Get the original file from the input
      const file = fileInputRef.current?.files?.[0];
      if (file) {
        handleImageUpload(file, compress);
      }
    }
  };

  const handleCancelUpload = () => {
    setPreviewImage(null);
    setImageInfo(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <ImageUploadContainer>
      <ImageButton
        type="button"
        onClick={handleButtonClick}
        disabled={isUploading}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        📷 {isUploading ? 'Uploading...' : 'Add Image'}
      </ImageButton>

      {isUploading && <ProgressBar progress={uploadProgress} />}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}

      {previewImage && imageInfo && !isUploading && (
        <ImagePreview>
          <PreviewImage src={previewImage} alt="Preview" />
          <PreviewInfo>
            <div><strong>{imageInfo.name}</strong></div>
            <div>Size: {imageInfo.size}</div>
          </PreviewInfo>
          <ActionButtons>
            <ActionButton 
              className="primary" 
              onClick={() => handleConfirmUpload(true)}
            >
              Upload (Optimized)
            </ActionButton>
            <ActionButton 
              className="primary" 
              onClick={() => handleConfirmUpload(false)}
            >
              Upload Original
            </ActionButton>
            <ActionButton 
              className="secondary" 
              onClick={handleCancelUpload}
            >
              Cancel
            </ActionButton>
          </ActionButtons>
        </ImagePreview>
      )}
    </ImageUploadContainer>
  );
}
