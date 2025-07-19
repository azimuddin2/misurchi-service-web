"use client";

import { EmblaOptionsType } from "embla-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FeedbackCarousel } from "./feedback-carousel";
import Container from "@/components/shared/Container";
import { SectionHeadWithBorder } from "@/components/common/section-head-with-border";
import { usePrevNextButtons } from "@/components/common/embla-arrow-buttons";
import backgroundImg from '@/assets/images/background-img.png';
import useEmblaCarousel from "embla-carousel-react";

export const OurHappyClients = () => {
  const OPTIONS: EmblaOptionsType = { loop: true };
  const SLIDE_COUNT = 5;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section
      className="py-20"
      style={{
        backgroundImage: `url(${backgroundImg.src})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <Container>
        <SectionHeadWithBorder
          title="OUR HAPPY CLIENTS"
          rightContent={
            <div className="flex gap-x-4">
              <button
                className="bg-transparent border border-gray-600 p-2 rounded-full text-gray-600"
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
              >
                <ChevronLeft />
              </button>
              <button
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
                className="bg-transparent border border-gray-600 p-2 rounded-full text-gray-600"
              >
                <ChevronRight />
              </button>
            </div>
          }
        />

        <FeedbackCarousel
          slides={SLIDES}
          options={OPTIONS}
          emblaApi={emblaApi}
          emblaRef={emblaRef}
        />
      </Container>
    </section>
  );
};
