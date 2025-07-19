import { ReactNode } from "react";

interface ISectionHeadWithBorderProps {
  title: string;
  rightContent: string | ReactNode;
}
export const SectionHeadWithBorder = ({
  rightContent,
  title,
}: ISectionHeadWithBorderProps) => {
  return (
    <div className="flex justify-between items-center border-b py-4 mb-10">
      <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>

      {rightContent}
    </div>
  );
};