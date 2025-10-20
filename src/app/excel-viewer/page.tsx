'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ExcelViewer from '@/components/ExcelViewer';

function ExcelViewerContent() {
  const searchParams = useSearchParams();
  const filePath = searchParams.get('file');

  if (!filePath) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <p className="text-red-500 mb-4">No file specified</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <ExcelViewer filePath={filePath} />;
}

export default function ExcelViewerPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading...</p>
        </div>
      </div>
    }>
      <ExcelViewerContent />
    </Suspense>
  );
}
