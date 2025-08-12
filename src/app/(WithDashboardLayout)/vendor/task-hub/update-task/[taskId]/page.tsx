import UpdateTask from '../../_components/update-task';

const UpdateTaskPage = ({ params }: { params: { taskId: string } }) => {
  return (
    <div>
      <UpdateTask taskId={params.taskId} />
    </div>
  );
};

export default UpdateTaskPage;
