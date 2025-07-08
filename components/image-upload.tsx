"use client"
import React, { useState, useRef } from 'react';
import { Button, Card, CardBody, Image, Progress } from '@heroui/react';
import { CloudArrowUpIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { ImageUploadProps } from '@/app/api/Interfaces';

const ImageUpload: React.FC<ImageUploadProps> = ({
  maxFiles = 5,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  onImagesChange
}) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = acceptedTypes.includes(file.type);
      const isValidSize = file.size <= maxSize * 1024 * 1024;
      return isValidType && isValidSize;
    });

    if (selectedImages.length + validFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images`);
      return;
    }

    const newImages = [...selectedImages, ...validFiles];
    setSelectedImages(newImages);

    // Create previews
    const newPreviews = [...previews];
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        setPreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });

    onImagesChange?.(newImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setPreviews(newPreviews);
    onImagesChange?.(newImages);
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Here you would implement your actual upload logic
    // Example: await uploadToServer(selectedImages);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Upload Area */}
      <Card className={`border-2 border-dashed transition-colors ${
        isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
      }`}>
        <CardBody className="p-8">
          <div
            className="text-center space-y-4"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex justify-center">
              <PhotoIcon className="w-12 h-12 text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium">Drop your images here</p>
              <p className="text-sm text-gray-500">
                or click to select files ({maxFiles} max, {maxSize}MB each)
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supported formats: {acceptedTypes.map(type => type.split('/')[1]).join(', ')}
              </p>
            </div>
            <Button
              color="primary"
              variant="bordered"
              startContent={<CloudArrowUpIcon className="w-4 h-4" />}
              onClick={() => fileInputRef.current?.click()}
            >
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedTypes.join(',')}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>
        </CardBody>
      </Card>

      {/* Progress Bar */}
      {isUploading && (
        <Card>
          <CardBody className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} color="primary" />
            </div>
          </CardBody>
        </Card>
      )}

      {/* Preview Grid */}
      {previews.length > 0 && (
        <Card>
          <CardBody className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Selected Images ({selectedImages.length}/{maxFiles})
                </h3>
                <Button
                  color="primary"
                  onClick={handleUpload}
                  disabled={isUploading}
                  isLoading={isUploading}
                >
                  Upload Images
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      isIconOnly
                      color="danger"
                      variant="solid"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </Button>
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {(selectedImages[index].size / 1024 / 1024).toFixed(1)}MB
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;