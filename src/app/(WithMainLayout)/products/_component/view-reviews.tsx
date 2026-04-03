import { useGetAllReviewsQuery } from '@/redux/features/review/reviewApi';
import { useSearchParams } from 'next/navigation';
import ReviewCard from './review-card';
import MSWPagination from '@/components/ui/core/MSWPagination';
import Image from 'next/image';

type Props = {
  productId: string;
};

const ViewReviews = ({ productId }: Props) => {
  const searchParams = useSearchParams();

  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 2;

  const { data } = useGetAllReviewsQuery({
    id: productId,
    type: 'product',
    page,
    limit,
  });

  const reviews = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Customer Feedback</h1>
      <div>
        {reviews?.length > 0 ? (
          <>
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>

            {/* Pagination only shows if there are reviews */}
            <div className="mt-6">
              <MSWPagination totalPage={meta?.totalPage || 1} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
            <Image
              src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              alt="No results"
              width={120}
              height={120}
              className="mb-4"
            />
            <p>No reviews yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReviews;
