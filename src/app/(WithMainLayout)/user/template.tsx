import UserPagesTopSection from '@/components/shared/user-page-top-section';
import { ReactNode } from 'react';

const UserTemplate = ({ children }: { children: ReactNode }) => {
  return (
    <div className="xl:space-y-12 space-y-8">
      <UserPagesTopSection></UserPagesTopSection>
      <div className="container mx-auto">{children}</div>
    </div>
  );
};

export default UserTemplate;
