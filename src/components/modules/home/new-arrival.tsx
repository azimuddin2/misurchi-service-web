import { SectionHeadWithBorder } from "@/components/common/section-head-with-border";
import Container from "@/components/shared/Container";
import { ArrivalImageCard } from "@/components/ui/core/arrival-image-card";
import { MoveRight } from "lucide-react";

type TArrivalServices = {
  id: number;
  image: string;
  text: string;
};

const arrivalSerivecs: TArrivalServices[] = [
  {
    id: 1,
    image:
      "https://www.crodabeauty.com/mediaassets/images/beauty/blogs/industry-trends/the-beauty-snacking-trend/beauty-snacking.jpg?la=en-GB&hash=AF2BB299622EC8944CC6274D92A5613B",
    text: "Shampo & Conditioner",
  },
  {
    id: 2,
    image:
      "https://debrasmouse.com/wp-content/uploads/2011/05/lessons-learned-42-to-43.jpg",
    text: "Baking Classes",
  },
  {
    id: 3,
    image:
      "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTizHcjm2ZMxiNrx4yT59r3m5mpNGGl_D-JsieShR91liwwe5VO",
    text: "Accesories",
  },
  {
    id: 4,
    image: "https://live.staticflickr.com/8073/8345026710_d9a091f43e_w.jpg",
    text: "Yoga Training Sessions",
  },
];

export const NewArrival = () => {
  return (
    <section className="flex justify-center items-center mb-20">
      <Container>
        {/* New Arrivals sections head content displayed here */}
        <SectionHeadWithBorder
          title="New Arrivlas"
          rightContent={
            <div className="flex gap-x-4 p-1 px-4 shadow-sm">
              <p className="uppercase font-semibold tracking-tight">View All</p>
              <button>
                <MoveRight />
              </button>
            </div>
          }
        />

        {/* New Arrivals services image cards displayed here */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 px-4">
          {arrivalSerivecs.map((content) => (
            <ArrivalImageCard key={content.id} content={content} />
          ))}
        </div>
      </Container>
    </section>
  );
};