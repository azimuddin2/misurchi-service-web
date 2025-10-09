import BookingDetails from '../_components/booking-details';

const BookingDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const bookingID = (await params).id;

  return (
    <div>
      <BookingDetails bookingId={bookingID} />
    </div>
  );
};

export default BookingDetailsPage;
