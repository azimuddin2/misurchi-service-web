import Schedule from '../_components';

const SchedulePage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="max-w-6xl my-8 mx-auto px-3 lg:px-5">
      <Schedule id={params.id} />
    </div>
  );
};

export default SchedulePage;
