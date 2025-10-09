import UpdateMember from '../../_components/update-member';

const UpdateMemberPage = async ({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) => {
  const memberID = (await params).memberId;

  return (
    <div>
      <UpdateMember memberId={memberID} />
    </div>
  );
};

export default UpdateMemberPage;
