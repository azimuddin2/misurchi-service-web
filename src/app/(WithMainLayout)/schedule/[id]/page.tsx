import Schedule from '../_components';

const SchedulePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const scheduleID = (await params).id;

  return (
    <div className="max-w-6xl my-8 mx-auto px-3 lg:px-5">
      <Schedule id={scheduleID} />
    </div>
  );
};

export default SchedulePage;
