import React, { useState } from 'react';
import { Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentScanner } from './DocumentScanner';

interface ScanButtonProps {
  onScan: (file: File) => void;
  disabled?: boolean;
}

export const ScanButton = ({ onScan, disabled }: ScanButtonProps) => {
  const [showScanner, setShowScanner] = useState(false);

  const handleScanComplete = (file: File) => {
    onScan(file);
    setShowScanner(false);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowScanner(true)}
        disabled={disabled}
        className="w-full"
      >
        <Scan className="h-4 w-4 mr-2" />
        Scan Document
      </Button>
      
      {showScanner && (
        <DocumentScanner
          onScan={handleScanComplete}
          onClose={() => setShowScanner(false)}
        />
      )}
    </>
  );
};