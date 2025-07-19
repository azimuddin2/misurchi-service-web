import { KnowAboutUs, NewArrival, OurHappyClients, } from "@/components/modules/home";
import Banner from "@/components/modules/home/banner";
import FAQSection from "@/components/modules/home/faq-seciton";
import TimeOffer from "@/components/modules/home/time-offer";

const HomePage = () => {
    return (
        <div>
            <Banner />
            <NewArrival />
            <OurHappyClients />
            <KnowAboutUs />
            <TimeOffer />
            <FAQSection />
        </div>
    );
};

export default HomePage;