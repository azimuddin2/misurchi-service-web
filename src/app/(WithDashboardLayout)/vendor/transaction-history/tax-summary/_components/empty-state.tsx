import { FileText } from 'lucide-react';
import Image from 'next/image';

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
    <Image
      src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      alt="No results"
      width={100}
      height={100}
      className="mx-auto w-28"
    />
    <p className="text-sm mt-2 text-gray-500">{message}</p>
  </div>
);

export default EmptyState;
