import ProviderProfile from '../_components/vendor-profile';

const ProviderProfilePage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <ProviderProfile providerId={params.id} />
    </div>
  );
};

export default ProviderProfilePage;
