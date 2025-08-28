'use client';

type Props = {
  providerId: string;
};

const ProviderProfile = ({ providerId }: Props) => {
  return (
    <div>
      <h1>Provider Profile: {providerId}</h1>
    </div>
  );
};

export default ProviderProfile;
