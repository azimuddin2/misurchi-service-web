import Container from '@/components/shared/Container';
import profileIcon from '@/assets/icons/profile.png';
import exploreIcon from '@/assets/icons/explore.png';
import connectIcon from '@/assets/icons/connect.png';
import Image from 'next/image';

export const KnowAboutUs = () => {
  return (
    <Container>
      <section className="space-y-8 my-10 lg:my-20 mx-3">
        {/* seciton head section */}
        <div className="lg:flex justify- items-center gap-4 my-6 lg:my-16">
          <h2 className="text-3xl lg:text-5xl font-semibold lg:w-[45%]">
            Get to Know About Us
          </h2>
          <p className="lg:w-[55%] text-lg text-gray-400 font-normal">
            We ensure that your next business step is just a click away. That’s
            why we built a marketplace that serves both vendors and buyers with
            seamless interaction and growth in one place.
          </p>
        </div>

        {/* Process to involve on this website */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* step of create your profile */}
          <div className="space-y-4 text-center bg-[#B9DDFF] rounded-xl p-6 py-12">
            <Image src={profileIcon} alt="profile" className="mx-auto" />
            <h4 className="font-semibold text-2xl text-gray-950">
              Create Your Profile
            </h4>
            <p className="text-gray-800 text-md">
              Whether you're a service provider offering valuable services or a
              user looking for the perfect solution, setting up your profile is
              quick and easy.
            </p>
          </div>
          {/* step of Explore Your Options */}
          <div className="space-y-4 text-center bg-[#FFE28D] rounded-xl p-6 py-12">
            <Image src={exploreIcon} alt="profile" className="mx-auto" />
            <h4 className="font-semibold text-2xl text-gray-950">
              Explore Your Options
            </h4>
            <p className="text-gray-800 text-md">
              Service Providers can create their services & products, set
              pricing, and highlight special offers, while users can discover
              the services and products that best match their needs.
            </p>
          </div>
          {/* step of Connect on Your Terms */}
          <div className="space-y-4 text-center bg-[#B9DDFF] rounded-xl p-6 py-12">
            <Image src={connectIcon} alt="connect" className="mx-auto" />
            <h4 className="font-semibold text-2xl text-gray-950">
              Connect on Your Terms
            </h4>
            <p className="text-gray-800 text-md">
              Service Providers and users can communicate directly through our
              platform, manage inquiries, schedule appointments, or make
              bookings.
            </p>
          </div>
        </div>

        {/* Steps counts */}
        <StepCountShow />
      </section>
    </Container>
  );
};

const StepCountShow = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-[#5DDCAD] rounded-xl px-6 py-5">
      {/* sates number 1 */}
      <div className="flex justify-center items-center">
        <div className="space-y-3 p-4">
          <h3 className="text-5xl font-bold text-gray-950">500K+</h3>
          <p className="text-[#212529] w-[60%]">
            Messages exchanged between providers & users
          </p>
        </div>
        <div className="w-0.5 h-20 bg-gray-950"></div>
      </div>

      {/* sates number 1 */}
      <div className="flex justify-center items-center">
        <div className="space-y-3 p-4">
          <h3 className="text-5xl font-bold text-gray-950">40K+</h3>
          <p className="text-[#212529] w-[60%]">
            Messages exchanged between providers & users
          </p>
        </div>
        <div className="w-0.5 h-20 bg-gray-950"></div>
      </div>

      {/* sates number 1 */}
      <div className="flex justify-center items-center">
        <div className="space-y-3 p-4">
          <h3 className="text-5xl font-bold text-gray-950">17K+</h3>
          <p className="text-[#212529] w-[60%]">
            Messages exchanged between providers & users
          </p>
        </div>
        <div className="w-0.5 h-20 bg-gray-950"></div>
      </div>

      {/* sates number 1 */}
      <div className="flex justify-center items-center">
        <div className="space-y-3 p-4">
          <h3 className="text-5xl font-bold text-gray-950">97%</h3>
          <p className="text-[#212529] w-[60%]">
            Messages exchanged between providers & users
          </p>
        </div>
      </div>
    </div>
  );
};
