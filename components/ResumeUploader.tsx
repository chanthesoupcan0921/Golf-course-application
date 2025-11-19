import React, { useState } from 'react';
import { parseResumeWithGemini } from '../services/geminiService';
import { UploadStatus, ParsedResumeData } from '../types';
import { Button } from './ui/Button';

interface ResumeUploaderProps {
  onDataParsed: (data: ParsedResumeData) => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onDataParsed }) => {
  const [status, setStatus] = useState<UploadStatus>(UploadStatus.IDLE);
  const [fileName, setFileName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simple validation
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Please upload a PDF or Image file. Convert Word docs to PDF first.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setErrorMsg("File size is too large (Max 5MB).");
      return;
    }

    setFileName(file.name);
    setErrorMsg('');
    setStatus(UploadStatus.UPLOADING);

    try {
      setStatus(UploadStatus.PARSING);
      const data = await parseResumeWithGemini(file);
      onDataParsed(data);
      setStatus(UploadStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMsg("We couldn't automatically read your resume. Please fill in the details manually.");
      setStatus(UploadStatus.ERROR);
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl p-6 shadow-sm mb-8 transition-colors duration-300">
      <h3 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 mb-2">
        Optional: Upload Resume to Auto-fill
      </h3>
      <p className="text-stone-600 dark:text-stone-400 text-sm mb-4">
        Save time by uploading your resume/CV. We'll do our best to fill in the details for you.
        <br/>
        <span className="text-stone-500 italic">Accepted formats: PDF, JPG, PNG. (For Word documents, please save as PDF first).</span>
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <label className="relative cursor-pointer">
          <input 
            type="file" 
            className="hidden" 
            accept=".pdf, .jpg, .jpeg, .png"
            onChange={handleFileChange}
            disabled={status === UploadStatus.PARSING}
          />
          <div className="bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium py-2 px-4 rounded-lg border border-stone-300 dark:border-stone-600 transition-colors flex items-center gap-2 group">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-500 dark:text-stone-400 group-hover:text-stone-800 dark:group-hover:text-stone-200 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
             <span>{fileName ? 'Change File' : 'Select File'}</span>
          </div>
        </label>

        {status === UploadStatus.PARSING && (
          <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-2">
             <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
             Reading document...
          </span>
        )}

        {status === UploadStatus.SUCCESS && (
          <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
             </svg>
             Auto-filled! Please review fields below.
          </span>
        )}

        {status === UploadStatus.ERROR && (
          <span className="text-red-600 dark:text-red-400 text-sm">{errorMsg}</span>
        )}
      </div>
      {fileName && status !== UploadStatus.PARSING && status !== UploadStatus.ERROR && (
          <p className="mt-2 text-xs text-stone-500">File: {fileName}</p>
      )}
    </div>
  );
};