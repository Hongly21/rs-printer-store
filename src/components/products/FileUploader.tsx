'use client';

import React, { useRef, useState } from 'react';
import { UploadedFile } from '@/types';
import { formatFileSize } from '@/lib/utils';
import { UploadCloud, CheckCircle2, AlertCircle, Trash2, FileText, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FileUploaderProps {
  file?: UploadedFile;
  onFileSelect: (file: UploadedFile | undefined) => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  file,
  onFileSelect,
  maxSizeMB = 20,
  acceptedFormats = ['.png', '.jpg', '.jpeg', '.pdf', '.svg', '.ai', '.psd'],
}) => {
  const { t, tObj } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateAndProcessFile = (selectedFile: File) => {
    setErrorMessage(null);

    // Validate size
    if (selectedFile.size > maxSizeBytes) {
      setErrorMessage(
        tObj(
          `File is too large. Maximum size is ${maxSizeMB} MB.`,
          `ឯកសារធំពេកហើយ។ ទំហំធំបំផុតគឺ ${maxSizeMB} MB។`
        )
      );
      return;
    }

    // Validate extension
    const fileName = selectedFile.name.toLowerCase();
    const isAccepted = acceptedFormats.some((ext) => fileName.endsWith(ext));
    if (!isAccepted) {
      setErrorMessage(
        tObj(
          'This file type is not supported. Please upload PNG, JPG, PDF or SVG.',
          'ប្រភេទឯកសារនេះមិនគាំទ្រទេ។ សូមភ្ជាប់ឯកសារ PNG, JPG, PDF ឬ SVG។'
        )
      );
      return;
    }

    let previewUrl: string | undefined = undefined;
    if (selectedFile.type.startsWith('image/')) {
      try {
        previewUrl = URL.createObjectURL(selectedFile);
      } catch (e) {
        // ignore
      }
    }

    const uploadedFileData: UploadedFile = {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type || 'application/octet-stream',
      lastModified: selectedFile.lastModified,
      previewUrl,
    };

    onFileSelect(uploadedFileData);
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setErrorMessage(null);
    onFileSelect(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {t('configurator.uploadArtwork')}
        </label>
        <span className="text-xs text-slate-500 font-medium">
          {t('configurator.optional')}
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {file ? (
        /* Attached File State */
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3 min-w-0">
            {file.previewUrl ? (
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-emerald-200 shrink-0 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.previewUrl}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                {file.name.endsWith('.pdf') ? (
                  <FileText className="w-6 h-6" />
                ) : (
                  <ImageIcon className="w-6 h-6" />
                )}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="truncate">{file.name}</span>
              </div>
              <p className="text-xs text-emerald-700 mt-0.5">
                {formatFileSize(file.size)} • {tObj('Ready for print review', 'រួចរាល់សម្រាប់ពិនិត្យប្លង់')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove uploaded file"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
            title="Remove file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-brand-500 bg-brand-50/50 scale-[0.99]'
              : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50/80 bg-white'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>

          <p className="text-sm font-bold text-slate-800">
            {t('configurator.dragDrop')}{' '}
            <span className="text-brand-600 underline">{t('configurator.browseFiles')}</span>
          </p>

          <p className="text-xs text-slate-500 mt-1.5">
            {t('configurator.fileFormats')}
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
