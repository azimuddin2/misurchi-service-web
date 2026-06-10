import { FileText } from 'lucide-react';

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
    <FileText className="w-12 h-12 mb-3 opacity-40" />
    <p className="text-sm">{message}</p>
  </div>
);

export default EmptyState;
