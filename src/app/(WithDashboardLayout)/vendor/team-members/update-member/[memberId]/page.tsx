import UpdateMember from '../../_components/update-member';

const UpdateMemberPage = ({ params }: { params: { memberId: string } }) => {
  return (
    <div>
      <UpdateMember memberId={params.memberId} />
    </div>
  );
};

export default UpdateMemberPage;
