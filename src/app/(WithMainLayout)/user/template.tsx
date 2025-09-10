import UserPagesTopSection from '@/components/shared/user-page-top-section';
import { ReactNode } from 'react';

const UserTemplate = ({ children }: { children: ReactNode }) => {
  return (
    <div className="xl:space-y-16 space-y-8">
      <UserPagesTopSection></UserPagesTopSection>
      <div className="md:pb-16 pb-8">{children}</div>
    </div>
  );
};

export default UserTemplate;
