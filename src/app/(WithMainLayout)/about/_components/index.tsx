import Container from '@/components/shared/Container';
import { CheckRoundedIcon } from '@/components/icons/check-rounded-icon';
import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  return (
    <Container>
      <div className="text-center my-10">
        <span className="text-gray-700 font-bold bg-sky-50 px-4 py-1 rounded-sm">
          Our Story
        </span>
      </div>

      <h1 className="text-2xl md:text-6xl text-gray-800 font-bold text-center mb-4">
        Empowering Connections: Redefining Service Experiences with Purpose
      </h1>

      <p className="text-center text-gray-500 mb-8 px-2 mx-auto lg:text-lg">
        {"We're"} dedicated to empowering service providers and users by
        creating a seamless, no-code platform to manage services, bookings, and
        interactions. Whether {"you're"} a service provider looking to grow your
        business or a user seeking quality services, {"we're"} here to bridge
        the gap and foster meaningful connections.
      </p>

      <div className="grid grid-cols-12 gap-4 mb-12">
        <div className="col-span-12 md:col-span-6">
          <Image
            src="https://i.postimg.cc/6qRrm38Q/59b3211ff19b460afe1ec15a05532ec127ade387.jpg"
            alt="People celebrating together"
            width={800}
            height={600}
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
        <div className="col-span-12 md:col-span-6 grid grid-rows-2 gap-4">
          <Image
            src="https://i.postimg.cc/NMZ8DTfV/fe20bdf34dcec0fa0575de38d34c7c4cfe3257af.jpg"
            alt="Team collaboration"
            width={800}
            height={600}
            className="rounded-lg w-full h-full object-cover"
          />
          <Image
            src="https://i.postimg.cc/ZYyxRfwh/2f953ce9b5c4450653cf81cb727360fb80293eef.jpg"
            alt="People giving thumbs up"
            width={800}
            height={600}
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
      </div>

      <StepCountShow />

      {/* Our Mission */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <div className="">
          <Image
            src="https://i.postimg.cc/d1Zrh1m9/7f0ad934466ca89d03b28d74e87be6b6ac147023.jpg"
            alt="Team members smiling"
            width={800}
            height={600}
            className="w-full h-full object-cover rounded-lg mb-4"
          />
        </div>
        <div className="pr-6">
          <div className="text-gray-500 mb-2 font-semibold text-lg">
            Our Mission
          </div>
          <h2 className="text-2xl lg:text-4xl font-bold mb-4 text-gray-800 lg:leading-12">
            Our Mission: Empowering Service Providers Through Simplicity,
            Connection, and Growth
          </h2>

          <ul className="space-y-4 text-gray-500 text-lg">
            <li className="flex">
              <CheckRoundedIcon className="h-8 w-8 text-green-500 mr-2 flex-shrink-0" />

              <div>
                <strong className="font-medium">Simplifying Management:</strong>{' '}
                No-code tools for service providers to manage bookings and
                services.
              </div>
            </li>
            <li className="flex">
              <CheckRoundedIcon className="h-8 w-8 text-green-500 mr-2 flex-shrink-0" />
              <div>
                <strong className="font-medium">Connecting Communities:</strong>{' '}
                Bringing service providers and users together for seamless
                interactions.
              </div>
            </li>
            <li className="flex">
              <CheckRoundedIcon className="h-8 w-8 text-green-500 mr-2 flex-shrink-0" />
              <div>
                <strong className="font-medium">Supporting Growth:</strong>{' '}
                Offering scalable plans and insights to help providers thrive.
              </div>
            </li>
            <li className="flex">
              <CheckRoundedIcon className="h-8 w-8 text-green-500 mr-2 flex-shrink-0" />
              <div>
                <strong className="font-medium">Supporting Growth:</strong>{' '}
                Offering scalable plans and insights to help providers thrive.
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <div>
          <div className="mb-4">
            <div className="text-gray-500 mb-2 font-semibold text-lg">
              Our Values
            </div>
            <h2 className="text-2xl lg:text-4xl font-bold mb-4 text-gray-800 lg:leading-12">
              Driving Impact Through Accessibility, Community, and Support
            </h2>
          </div>

          <ul className="space-y-4 text-gray-500 text-lg">
            <li className="flex">
              <CheckRoundedIcon className="h-8 w-8 text-green-500 mr-2 flex-shrink-0" />
              <div>
                <strong className="font-medium">Accessibility:</strong> Tools
                designed for service providers of all sizes, no tech skills
                needed.
              </div>
            </li>
            <li className="flex">
              <CheckRoundedIcon className="h-8 w-8 text-green-500 mr-2 flex-shrink-0" />
              <div>
                <strong className="font-medium">Community:</strong> Building
                strong connections between service providers and users.
              </div>
            </li>
            <li className="flex">
              <CheckRoundedIcon className="h-8 w-8 text-green-500 mr-2 flex-shrink-0" />
              <div>
                <strong className="font-medium">Transparency:</strong> Clear
                policies and communication to foster trust.
              </div>
            </li>
            <li className="flex">
              <CheckRoundedIcon className="h-8 w-8 text-green-500 mr-2 flex-shrink-0" />
              <div>
                <strong className="font-medium">Support:</strong> Dedicated
                resources to ensure every user and provider succeeds.
              </div>
            </li>
          </ul>

          <div className="mt-8 space-y-2">
            <div className="text-xl text-gray-500">Simple & Fast</div>
            <Link
              href="/join"
              className="text-gray-800 font-bold underline underline-offset-8 text-3xl"
            >
              Join Us In Our Mission
            </Link>
          </div>
        </div>

        <div className="">
          <Image
            src="https://i.postimg.cc/BvV2ZDD6/802aab3fdd8a0c862b3bd9d0e711c09e165ad614.jpg"
            alt="People working together"
            width={500}
            height={400}
            className="rounded-lg w-full h-[480px] object-cover"
          />
        </div>
      </div>
    </Container>
  );
}

const StepCountShow = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-sky-950 rounded-md px-6 my-10">
      {/* sates number 1 */}
      <div className="flex justify-center items-center">
        <div className="space-y-3 p-4">
          <h3 className="text-5xl font-bold text-gray-200">500K+</h3>
          <p className="text-gray-300 w-[60%]">
            Messages exchanged between providers & users
          </p>
        </div>
        <div className="w-0.5 h-20 bg-gray-400"></div>
      </div>

      {/* sates number 1 */}
      <div className="flex justify-center items-center">
        <div className="space-y-3 p-4">
          <h3 className="text-5xl font-bold text-gray-200">500K+</h3>
          <p className="text-gray-300 w-[60%]">
            Messages exchanged between providers & users
          </p>
        </div>
        <div className="w-0.5 h-20 bg-gray-400"></div>
      </div>

      {/* sates number 1 */}
      <div className="flex justify-center items-center">
        <div className="space-y-3 p-4">
          <h3 className="text-5xl font-bold text-gray-200">500K+</h3>
          <p className="text-gray-300 w-[60%]">
            Messages exchanged between providers & users
          </p>
        </div>
        <div className="w-0.5 h-20 bg-gray-400"></div>
      </div>

      {/* sates number 1 */}
      <div className="flex justify-center items-center">
        <div className="space-y-3 p-4">
          <h3 className="text-5xl font-bold text-gray-200">500K+</h3>
          <p className="text-gray-300 w-[60%]">
            Messages exchanged between providers & users
          </p>
        </div>
        {/* hide for the last element */}
        {/* <div className="w-0.5 h-20 bg-gray-400"></div> */}
      </div>
    </div>
  );
};
