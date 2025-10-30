import React, { useState, useRef } from 'react';
import { FiPaperclip, FiImage, FiMic, FiFile, FiX } from 'react-icons/fi';
import api from '../../utils/api';

const FileUpload = ({ chatId, onFileUploaded, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chatId', chatId);

      // Determine message type
      let messageType = 'file';
      if (file.type.startsWith('image/')) messageType = 'image';
      else if (file.type.startsWith('audio/')) messageType = 'audio';
      
      formData.append('messageType', messageType);

      const response = await api.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      onFileUploaded(response.data);
      onClose();
    } catch (error) {
      console.error('File upload error:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="absolute bottom-16 left-4 bg-white rounded-lg shadow-lg border p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Share File</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <FiX size={16} />
        </button>
      </div>

      {uploading ? (
        <div className="text-center py-4">
          <div className="mb-2">Uploading... {uploadProgress}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="mb-4">
            <FiPaperclip size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">Drag & drop files here or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">
              Images, Audio, Documents (Max 10MB)
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="image/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
            className="hidden"
          />

          <div className="flex justify-center gap-2">
            <button
              onClick={() => {
                fileInputRef.current.accept = 'image/*';
                fileInputRef.current.click();
              }}
              className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
            >
              <FiImage size={16} />
              Image
            </button>
            <button
              onClick={() => {
                fileInputRef.current.accept = 'audio/*';
                fileInputRef.current.click();
              }}
              className="flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
            >
              <FiMic size={16} />
              Audio
            </button>
            <button
              onClick={() => {
                fileInputRef.current.accept = '.pdf,.doc,.docx,.txt,.zip,.rar';
                fileInputRef.current.click();
              }}
              className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              <FiFile size={16} />
              Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;