import { KnowAboutUs, NewArrival, OurHappyClients } from './_components';
import Banner from './_components/banner';
import FAQSection from './_components/faq-seciton';
import ProductServiceSection from './_components/product-service-section';
import TimeOffer from './_components/time-offer';

const HomePage = () => {
  return (
    <div>
      <Banner />
      <ProductServiceSection />
      <NewArrival />
      <OurHappyClients />
      <KnowAboutUs />
      <TimeOffer />
      <FAQSection />
    </div>
  );
};

export default HomePage;
