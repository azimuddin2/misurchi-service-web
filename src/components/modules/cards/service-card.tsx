'use client';

import { AppButton } from '@/components/shared/app-button';
import { TService } from '@/types/service.type';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type ServiceProps = {
  service: TService;
};

const ServiceCard = ({ service }: ServiceProps) => {
  return (
    <div className="shadow p-4 rounded-lg">
      <div className="relative w-full h-48">
        <Image
          src={service?.images[0]?.url}
          alt={service?.name || 'Service image'}
          fill
          className="object-cover rounded-lg"
        />
        <div className="absolute bottom-0 bg-black/50 p-2 w-full text-gray-100 text-center text-lg rounded-b-lg">
          <h1>{service?.name}</h1>
        </div>
      </div>

      <AppButton
        className="w-full text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80"
        content={
          <Link
            href={`/`}
            className="flex justify-center items-center space-x-1 font-semibold"
          >
            <span className="uppercase text-sm font-semibold mr-2">
              Schedule
            </span>
            <ArrowRight size={24} />
          </Link>
        }
      />
    </div>
  );
};

export default ServiceCard;
