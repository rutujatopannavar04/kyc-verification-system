import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, Image, FileText } from 'lucide-react';

interface FileUploadProps {
  label?: string;
  accept?: string;
  onChange: (file: File | null) => void;
  error?: string;
  preview?: boolean;
  icon?: 'image' | 'document';
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = 'image/*',
  onChange,
  error,
  preview = true,
  icon = 'image',
  className,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      onChange(selectedFile);
      
      // Generate preview for images
      if (preview && selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const IconComponent = icon === 'image' ? Image : FileText;

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-200 text-center',
          isDragging
            ? 'border-primary bg-accent/50'
            : 'border-border hover:border-primary/50 hover:bg-muted/50',
          error && 'border-destructive',
          previewUrl && 'p-2'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
          className="hidden"
        />
        
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
            >
              <X size={16} />
            </button>
            <p className="text-sm text-muted-foreground mt-2 truncate">{file?.name}</p>
          </div>
        ) : file ? (
          <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <IconComponent className="text-primary" size={24} />
              <span className="text-sm text-foreground truncate max-w-[200px]">{file.name}</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="py-4">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-accent rounded-full">
                <Upload className="text-primary" size={24} />
              </div>
            </div>
            <p className="text-sm text-foreground font-medium">
              Drop your file here or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports: {accept.replace(/\*/g, 'all')}
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-destructive animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export { FileUpload };
