'use client';

import ServiceCard from '@/components/modules/cards/service-card';
import Spinner from '@/components/shared/Spinner';
import { useGetAllServicesQuery } from '@/redux/features/service/serviceApi';

const Services = () => {
  const { data, isLoading } = useGetAllServicesQuery({});
  const services = data?.data || [];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5">
      {services.map((service) => (
        <ServiceCard key={service._id} service={service}></ServiceCard>
      ))}
    </div>
  );
};

export default Services;
