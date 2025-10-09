import ViewService from '../../_components/services/(view-service)/view-service';

const ViewServicePage = async ({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) => {
  const serviceID = (await params).serviceId;

  return (
    <div>
      <ViewService serviceId={serviceID} />
    </div>
  );
};

export default ViewServicePage;
