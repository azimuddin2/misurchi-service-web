import RescheduleSet from '../_components/booking-request/reschedule-set';

const ReschedulePage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="max-w-6xl my-8 mx-auto px-3 lg:px-5">
      <RescheduleSet id={params.id} />
    </div>
  );
};

export default ReschedulePage;
