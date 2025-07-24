import { ReactNode } from 'react';
import { Button } from '../ui/button';

interface IAppButton {
  className?: string;
  content: string | ReactNode;
  disabled?: boolean;
}

export const AppButton = ({ className, content, disabled }: IAppButton) => {
  return (
    <Button
      disabled={disabled}
      className={`p-6 cursor-pointer text-base mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500 ${className}`}
    >
      {content}
    </Button>
  );
};
