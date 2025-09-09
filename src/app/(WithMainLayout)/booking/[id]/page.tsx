import BookingDetails from '../_components/booking-details';

const BookingDetailsPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <BookingDetails bookingId={params.id} />
    </div>
  );
};

export default BookingDetailsPage;
