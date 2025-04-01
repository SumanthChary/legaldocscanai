
type UploadTipsProps = {
  maxFileSize: number;
  allowedFileTypes: string[];
};

export const UploadTips = ({ maxFileSize, allowedFileTypes }: UploadTipsProps) => {
  return (
    <div>
      <p className="text-xs text-gray-500 mt-2">
        Max file size: {(maxFileSize / 1024 / 1024).toFixed(0)}MB. 
        Supported formats: {allowedFileTypes.map(type => type.replace('.', '').toUpperCase()).join(', ')}
      </p>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
        <h3 className="text-sm font-medium text-blue-700 mb-2">Tips for successful uploads:</h3>
        <ul className="text-xs text-blue-600 space-y-1 list-disc pl-5">
          <li>For PDFs, ensure text is selectable, not scanned images</li>
          <li>Word documents with simple formatting work best</li>
          <li>For complex documents, try saving as plain text first</li>
          <li>Large documents may be truncated - consider uploading key sections</li>
          <li>Make sure your document is not encrypted or password protected</li>
          <li>If upload fails, try with a smaller file or different format</li>
        </ul>
      </div>
    </div>
  );
};
