import Notification from '../_components/notification';

const NotificationPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const notificationID = (await params).id;

  return (
    <div>
      <Notification notificationId={notificationID} />
    </div>
  );
};

export default NotificationPage;
