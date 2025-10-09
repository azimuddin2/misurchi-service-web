import ProviderProfile from '../_components/provider-profile';

const ProviderProfilePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const providerID = (await params).id;

  return (
    <div>
      <ProviderProfile providerId={providerID} />
    </div>
  );
};

export default ProviderProfilePage;
