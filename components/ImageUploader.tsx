import React, { useState, useCallback, DragEvent } from 'react';

interface ImageUploaderProps {
  label: string;
  onImageSelected: (base64: string) => void;
  currentImage: string | null;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onImageSelected, currentImage }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const base64 = await fileToBase64(file);
      onImageSelected(base64);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files ? e.target.files[0] : null);
  };

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, []);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-secondary-dark mb-1">{label}</label>
      <div 
        className={`mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${isDragging ? 'border-accent bg-accent-light' : 'border-slate-300 hover:border-accent'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-1 text-center">
          {currentImage ? (
            <div className="relative group">
              <img src={currentImage} alt="Preview" className="mx-auto h-24 w-24 rounded-full object-cover shadow-md"/>
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                  <span className="text-white text-sm font-semibold">Ganti</span>
              </div>
            </div>
          ) : (
            <svg className="mx-auto h-12 w-12 text-secondary" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <div className="flex text-sm text-secondary-dark justify-center">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-surface rounded-md font-medium text-accent hover:text-accent-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent">
              <span>Unggah file</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onFileChange} accept="image/png, image/jpeg" />
            </label>
            <p className="pl-1">atau seret dan lepas</p>
          </div>
          <p className="text-xs text-secondary">PNG, JPG hingga 2MB</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
