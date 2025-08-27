import UpdateService from '../../_components/services/(update-service)/update-service';

const UpdateServicePage = ({ params }: { params: { serviceId: string } }) => {
  return (
    <div>
      <UpdateService serviceId={params.serviceId} />
    </div>
  );
};

export default UpdateServicePage;
