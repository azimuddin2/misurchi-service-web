import RescheduleSet from '../_components/booking-request/reschedule-set';

const ReschedulePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const rescheduleId = (await params).id;

  return (
    <div className="max-w-6xl my-8 mx-auto px-3 lg:px-5">
      <RescheduleSet id={rescheduleId} />
    </div>
  );
};

export default ReschedulePage;
