'use client';

import React, { useRef, useState } from 'react';
import { UploadedFile } from '@/types';
import { formatFileSize } from '@/lib/utils';
import { saveArtworkFile, removeArtworkFile } from '@/lib/file-store';
import { UploadCloud, CheckCircle2, AlertCircle, Trash2, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ImageEditorModal } from './ImageEditorModal';

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
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const isEditableImage = Boolean(file?.previewUrl && !file?.name?.toLowerCase().endsWith('.pdf'));

  const validateAndProcessFile = async (selectedFile: File) => {
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

    const fileId = `art_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    await saveArtworkFile(fileId, selectedFile);

    const uploadedFileData: UploadedFile = {
      fileId,
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
    if (file?.fileId) {
      removeArtworkFile(file.fileId);
    }
    onFileSelect(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
          {t('configurator.uploadArtwork')}
        </label>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
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
        /* Attached File State with Image Studio Controls */
        <div className="space-y-2.5 animate-in fade-in">
          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              {file.previewUrl ? (
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-700 shrink-0 relative shadow-sm group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.previewUrl}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  {file.name.endsWith('.pdf') ? (
                    <FileText className="w-7 h-7" />
                  ) : (
                    <ImageIcon className="w-7 h-7" />
                  )}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-200 font-extrabold text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="truncate">{file.name}</span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5 font-medium">
                  {formatFileSize(file.size)} • {tObj('Ready for print production', 'រួចរាល់សម្រាប់ផលិតកម្ម')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isEditableImage && (
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(true)}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-slate-700 text-brand-700 dark:text-brand-300 hover:text-brand-800 border border-emerald-300 dark:border-slate-600 hover:border-brand-400 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                  title="Crop shape, rotate, adjust colors, and add white sticker bleed border"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  <span>{tObj('Edit & Crop', 'កែសម្រួលរូប & គែម')}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleRemove}
                aria-label="Remove uploaded file"
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-colors shrink-0 cursor-pointer"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Tip for Sticker Customization */}
          {isEditableImage && (
            <div className="flex items-center justify-between bg-gradient-to-r from-brand-50/80 to-sky-50/80 dark:from-slate-900 dark:to-slate-800 border border-brand-100 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-brand-900 dark:text-slate-200 shadow-sm">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {tObj(
                    'Crop shape, rotate, shift colors, or add a white die-cut bleed border.',
                    'កាត់តម្រឹមរាង ប្តូរពណ៌ បង្វិល និងបន្ថែមគែមស្ទីគ័រសស្អាត។'
                  )}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setIsEditorOpen(true)}
                className="font-extrabold text-brand-600 dark:text-brand-400 hover:text-brand-700 underline shrink-0 cursor-pointer ml-2"
              >
                {tObj('Customize Design', 'បើកស្ទូឌីយ៉ូ')}
              </button>
            </div>
          )}

          {/* Image Editor Studio Modal */}
          {isEditorOpen && (
            <ImageEditorModal
              isOpen={isEditorOpen}
              onClose={() => setIsEditorOpen(false)}
              file={file}
              onSave={(updatedFile) => onFileSelect(updatedFile)}
            />
          )}
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
              ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 scale-[0.99]'
              : 'border-slate-300 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 bg-white dark:bg-slate-900'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-100 dark:border-brand-900/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>

          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {t('configurator.dragDrop')}{' '}
            <span className="text-brand-600 dark:text-brand-400 underline">{t('configurator.browseFiles')}</span>
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
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
