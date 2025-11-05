'use client';

import Spinner from '@/components/shared/Spinner';
import { useGetTermsQuery } from '@/redux/features/terms/termsApi';

const Terms = () => {
  const { data: termsData, isLoading } = useGetTermsQuery();

  if (isLoading) return <Spinner />;

  return (
    <div
      className="container mx-auto mt-12 shadow p-8 rounded-xl text-gray-600"
      dangerouslySetInnerHTML={{
        __html: termsData?.data?.content || '<p>No content available</p>',
      }}
    />
  );
};

export default Terms;
