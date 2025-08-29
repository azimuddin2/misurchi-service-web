'use client';

type Props = {
  serviceId: string;
};

const ServiceDetails = ({ serviceId }: Props) => {
  return (
    <div>
      <h1>Service Details: {serviceId}</h1>
    </div>
  );
};

export default ServiceDetails;
