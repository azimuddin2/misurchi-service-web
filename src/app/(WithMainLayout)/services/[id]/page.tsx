import ServiceDetails from '../_component';

const ServiceDetailsPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <ServiceDetails serviceId={params.id} />
    </div>
  );
};

export default ServiceDetailsPage;
