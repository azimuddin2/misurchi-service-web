'use client';

import ServiceCard from '@/components/modules/cards/service-card';
import { AppButton } from '@/components/shared/app-button';
import Spinner from '@/components/shared/Spinner';
import { useGetAllServicesQuery } from '@/redux/features/service/serviceApi';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Services = () => {
  const { data, isLoading } = useGetAllServicesQuery({});
  const services = data?.data?.slice(0, 8) || [];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="mb-10">
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-5">
          {services?.map((service) => (
            <ServiceCard key={service._id} service={service}></ServiceCard>
          ))}
        </div>
      ) : (
        <div className="my-20">
          <Image
            src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            alt="No results"
            width={100}
            height={100}
            className="mx-auto"
          />
          <p className="text-center font-semibold mt-1">No Found Services</p>
        </div>
      )}
      <div className="text-center">
        <AppButton
          className="lg:w-1/4 text-white border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80"
          content={
            <Link
              href={`/all-products-services?tab=services`}
              className="flex justify-center items-center space-x-1 font-semibold"
            >
              <span className="uppercase text-sm font-semibold mr-2">
                View All Services
              </span>
              <ArrowRight size={24} />
            </Link>
          }
        />
      </div>
    </div>
  );
};

export default Services;
