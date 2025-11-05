'use client';

import Spinner from '@/components/shared/Spinner';
import { useGetPolicyQuery } from '@/redux/features/policy/policyApi';

const Policy = () => {
  const { data: policyData, isLoading } = useGetPolicyQuery();

  if (isLoading) return <Spinner />;

  return (
    <div
      className="container mx-auto mt-5 shadow p-8 rounded-xl text-gray-600"
      dangerouslySetInnerHTML={{
        __html: policyData?.data?.content || '<p>No content available</p>',
      }}
    />
  );
};

export default Policy;
