export const Row = ({
  label,
  value,
  suffix,
  isRed,
}: {
  label: string;
  value: string;
  suffix?: string;
  isRed?: boolean;
}) => (
  <div className="flex gap-2 items-baseline text-sm py-0.5">
    <span className="text-gray-500 min-w-[200px]">{label}</span>
    <span className={`font-medium ${isRed ? 'text-red-500' : 'text-gray-900'}`}>
      {value}
    </span>
    {suffix && <span className="text-gray-400 font-normal">{suffix}</span>}
  </div>
);
