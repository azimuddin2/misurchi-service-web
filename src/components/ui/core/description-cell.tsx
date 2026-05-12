import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type DescriptionCellProps = {
  text: string;
};

const DescriptionCell = ({ text }: DescriptionCellProps) => {
  const [expanded, setExpanded] = useState(false);

  const isLong = text.length > 50;
  const displayText = expanded || !isLong ? text : text.slice(0, 50) + '...';

  return (
    <div className=" break-words whitespace-normal">
      <span className="text-sm text-gray-700">{displayText}</span>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-2 inline-flex items-center gap-1 text-blue-500 text-xs hover:underline"
        >
          {expanded ? (
            <>
              Read Less <ChevronUp size={16} />
            </>
          ) : (
            <>
              Read More <ChevronDown size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default DescriptionCell;
