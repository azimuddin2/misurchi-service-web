'use client';

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium flex items-center gap-1">
        {icon}
        <span className="text-sm">{label}</span>
      </p>
      <span className="text-sm text-gray-700 font-medium">{value}</span>
    </div>
  );
};

export default InfoItem;
