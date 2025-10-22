import { TReview } from '@/types/review.type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type TReviewProps = {
  review: TReview;
};

export const ClientFeedbackCard = ({ review }: TReviewProps) => {
  return (
    <div className="w-full bg-white shadow-sm rounded-md text-gray-500 space-y-2 p-6 text-center">
      {/* client thougts about you */}
      <div className="space-y-2 pb-2">
        <h4 className="font-medium text-xl text-gray-800">
          {review.vendor.businessName}
        </h4>
        <p className="text-sm text-gray-400 font-normal">{review.review}</p>
      </div>

      <hr className="bg-gray-300" />

      {/* client details liek avatar and name */}
      <div className="space-y-2 mt-4">
        <h4 className="font-medium text-lg text-gray-900">
          {review.user.fullName}
        </h4>
        <Avatar className="cursor-pointer w-14 h-14 border border-gray-300 mx-auto">
          <AvatarImage src={review.user?.image} />
          <AvatarFallback>{review.user?.fullName?.[0]}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};
