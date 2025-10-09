import UpdateTask from '../../_components/update-task';

const UpdateTaskPage = async ({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) => {
  const taskID = (await params).taskId;

  return (
    <div>
      <UpdateTask taskId={taskID} />
    </div>
  );
};

export default UpdateTaskPage;
