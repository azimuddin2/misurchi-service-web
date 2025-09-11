import React from 'react';
import ViewService from '../../_components/services/(view-service)/view-service';

const ViewServicePage = ({ params }: { params: { serviceId: string } }) => {
  return (
    <div>
      <ViewService serviceId={params.serviceId} />
    </div>
  );
};

export default ViewServicePage;
