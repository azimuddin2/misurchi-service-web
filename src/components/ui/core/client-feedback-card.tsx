interface IReviewedBy {
  name: string;
  profile: string;
}
interface IClinetContent {
  title: string;
  detailsText: string;
  reviewedBy: IReviewedBy;
}

interface IClientFeedbackCardProps {
  content?: IClinetContent;
}

const clientsFeedback: IClinetContent[] = [
  {
    title: 'Amazing Fashion Wear',
    detailsText: `“ Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer 
took a galley of type and `,
    reviewedBy: {
      name: 'DR. Marina Califer',
      profile:
        'https://img.p.mapq.st/?url=https://s3-media0.fl.yelpcdn.com/photo/cEb4N-HF0OFnR9_qP1pOnw/l.jpg?w=96&q=75',
    },
  },
];

export const ClientFeedbackCard = ({
  content = clientsFeedback[0],
}: IClientFeedbackCardProps) => {
  const { detailsText, reviewedBy, title } = content;
  return (
    <div className="w-full bg-white shadow-sm rounded-md text-gray-500 space-y-2 p-6 text-center">
      {/* client thougts about you */}
      <div className="space-y-2 pb-2">
        <h4 className="font-medium text-xl text-gray-800">{title}</h4>
        <p className="text-base font-normal">{detailsText}</p>
      </div>

      <hr className="bg-gray-300" />

      {/* client details liek avatar and name */}
      <div className="space-y-2 mt-4">
        <h4 className="font-medium text-lg text-gray-900">{reviewedBy.name}</h4>
        <img
          src={reviewedBy.profile}
          alt="cient profile image"
          className="w-20 h-20 rounded-full object-cover mx-auto"
        />
      </div>
    </div>
  );
};
