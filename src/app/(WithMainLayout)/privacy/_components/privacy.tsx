'use client';

import Spinner from '@/components/shared/Spinner';
import { useGetPrivacyQuery } from '@/redux/features/privacy/privacyApi';

const Privacy = () => {
  const { data: privacyData, isLoading } = useGetPrivacyQuery();

  if (isLoading) return <Spinner />;

  return (
    <div
      className="container mx-auto mt-10 shadow p-8 rounded-xl text-gray-600"
      dangerouslySetInnerHTML={{
        __html: privacyData?.data?.content || '<p>No content available</p>',
      }}
    />
  );
};

export default Privacy;
