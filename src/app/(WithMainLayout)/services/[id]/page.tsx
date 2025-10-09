import ServiceDetails from '../_component';

const ServiceDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const serviceID = (await params).id;

  return (
    <div className="max-w-7xl mx-auto px-3 lg:px-5">
      <ServiceDetails serviceId={serviceID} />
    </div>
  );
};

export default ServiceDetailsPage;
