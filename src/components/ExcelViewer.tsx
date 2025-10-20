'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';

interface ExcelViewerProps {
  filePath: string;
}

declare global {
  interface Window {
    luckysheet: any;
  }
}

export default function ExcelViewer({ filePath }: ExcelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExcelFile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load Luckysheet CSS
        if (!document.querySelector('link[href*="luckysheet"]')) {
          const cssLinks = [
            'https://cdn.jsdelivr.net/npm/luckysheet@2.1.13/dist/plugins/css/pluginsCss.css',
            'https://cdn.jsdelivr.net/npm/luckysheet@2.1.13/dist/plugins/plugins.css',
            'https://cdn.jsdelivr.net/npm/luckysheet@2.1.13/dist/css/luckysheet.css',
            'https://cdn.jsdelivr.net/npm/luckysheet@2.1.13/dist/assets/iconfont/iconfont.css'
          ];

          cssLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
          });
        }

        // Load Luckysheet JS
        if (!window.luckysheet && !document.querySelector('script[src*="luckysheet"]')) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/luckysheet@2.1.13/dist/luckysheet.umd.js';
          script.onload = () => {
            // Wait a bit for Luckysheet to be fully available
            setTimeout(() => {
              if (window.luckysheet && window.luckysheet.create) {
                initializeLuckysheet();
              } else {
                setError('Luckysheet library failed to initialize properly');
                setLoading(false);
              }
            }, 100);
          };
          script.onerror = () => {
            setError('Failed to load Luckysheet library from CDN');
            setLoading(false);
          };
          document.head.appendChild(script);
        } else if (window.luckysheet && window.luckysheet.create) {
          initializeLuckysheet();
        } else {
          setError('Luckysheet library not available');
          setLoading(false);
        }

        async function  initializeLuckysheet() {
          try {
            // Double-check that Luckysheet is available
            if (!window.luckysheet || !window.luckysheet.create) {
              throw new Error('Luckysheet library is not properly loaded');
            }

            const response = await fetch(filePath);
            if (!response.ok) {
              throw new Error(`Failed to load Excel file: ${response.statusText}`);
            }
            
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            
            // Convert Excel data to Luckysheet format
            const sheets = workbook.SheetNames.map((sheetName, index) => {
              const worksheet = workbook.Sheets[sheetName];
              const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
              
              // Convert to Luckysheet cell format
              const celldata: any[] = [];
              (jsonData as any[][]).forEach((row, rowIndex) => {
                row.forEach((cellValue, colIndex) => {
                  if (cellValue !== '' && cellValue !== null && cellValue !== undefined) {
                    celldata.push({
                      r: rowIndex,
                      c: colIndex,
                      v: {
                        v: cellValue,
                        ct: { fa: 'General', t: 'g' },
                        m: String(cellValue)
                      }
                    });
                  }
                });
              });

              return {
                name: sheetName,
                index: index.toString(),
                order: index.toString(),
                status: index === 0 ? 1 : 0,
                celldata: celldata,
                row: Math.max(100, (jsonData as any[][]).length + 20),
                column: Math.max(26, Math.max(...(jsonData as any[][]).map(row => row.length)) + 10)
              };
            });

            // Clear any existing instance
            if (containerRef.current) {
              containerRef.current.innerHTML = '';
            }

            // Initialize Luckysheet with Excel-like appearance
            window.luckysheet.create({
              container: 'luckysheet-container',
              title: filePath.split('/').pop()?.replace('.xlsx', '') || 'Excel File',
              lang: 'en',
              data: sheets,
              
              // Excel-like configuration
              showinfobar: false,
              showsheetbar: sheets.length > 1,
              showstatisticBar: false,
              allowEdit: false,
              enableAddRow: false,
              enableAddCol: false,
              sheetFormulaBar: true,
              functionButton: false,
              
              // Toolbar configuration for Excel-like look
              showtoolbar: true,
              showtoolbarConfig: {
                undoRedo: false,
                paintFormat: false,
                currencyFormat: false,
                percentageFormat: false,
                numberDecrease: false,
                numberIncrease: false,
                moreFormats: false,
                font: false,
                fontSize: false,
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                textColor: false,
                fillColor: false,
                border: false,
                mergeCell: false,
                horizontalAlignMode: false,
                verticalAlignMode: false,
                textWrapMode: false,
                textRotateMode: false,
                image: false,
                link: false,
                chart: false,
                postil: false,
                pivotTable: false,
                function: false,
                frozenMode: false,
                sortAndFilter: false,
                conditionalFormat: false,
                dataVerification: false,
                splitColumn: false,
                screenshot: false,
                findAndReplace: false,
                protection: false,
                print: false
              }
            });
            
            setLoading(false);
          } catch (err) {
            console.error('Error initializing Luckysheet:', err);
            setError(err instanceof Error ? err.message : 'Failed to initialize Excel viewer');
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Error loading Excel file:', err);
        setError(err instanceof Error ? err.message : 'Failed to load Excel file');
        setLoading(false);
      }
    };

    loadExcelFile();

    // Cleanup on unmount
    return () => {
      if (window.luckysheet && window.luckysheet.destroy) {
        try {
          window.luckysheet.destroy();
        } catch (e) {
          console.warn('Error destroying Luckysheet:', e);
        }
      }
    };
  }, [filePath]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading Excel file...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we prepare your spreadsheet</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Excel File</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            ← Back to Home
          </button>
          <h1 className="text-lg font-medium text-gray-900">
            {filePath.split('/').pop()?.replace('.xlsx', '')}
          </h1>
          <div></div>
        </div>
      </div>

      {/* Luckysheet Container - Full Excel-like Interface */}
      <div 
        id="luckysheet-container" 
        ref={containerRef}
        style={{ 
          width: '100%', 
          height: 'calc(100vh - 60px)',
          margin: 0,
          padding: 0,
          overflow: 'hidden'
        }}
      />
    </div>
  );
}
