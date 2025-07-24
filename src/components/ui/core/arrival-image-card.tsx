import { MoveUpRight } from 'lucide-react';

export const ArrivalImageCard = ({
  content,
}: {
  content: { image: string; text: string };
}) => {
  const { image, text } = content;
  return (
    <div className="w-full h-full relative overflow-hidden">
      <img
        src={image}
        alt={text}
        className="w-full h-full rounded-lg object-cover"
      />
      <div className="absolute rounded-b-xl w-full bottom-0 bg-gray-950/40 flex justify-center items-center gap-x-2 py-2">
        <p className="text-gray-100 text-lg">{text}</p>
        <div className="bg-[#706d6e] p-2 rounded-full">
          <MoveUpRight className="w-5 h-5 text-gray-100" />
        </div>
      </div>
    </div>
  );
};
