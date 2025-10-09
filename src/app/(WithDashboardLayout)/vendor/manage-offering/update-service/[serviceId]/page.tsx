import UpdateService from '../../_components/services/(update-service)/update-service';

const UpdateServicePage = async ({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) => {
  const serviceID = (await params).serviceId;

  return (
    <div>
      <UpdateService serviceId={serviceID} />
    </div>
  );
};

export default UpdateServicePage;
